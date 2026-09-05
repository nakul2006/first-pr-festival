# 🕸️ Spider-Society Mainframe

Live roster for **First PR Festival : Intro to Github and Open Source**.

Merge a Pull Request → Vercel rebuilds → your Spider-ID Card appears on the site.
No database. Just JSON files and Git.

---

## 🧵 Hand-woven cards

Chapter 2 asks students to build their ID card themselves in **HTML with
internal CSS** — `spider-society/<username>.html`. The roster renders each one
inside `<iframe sandbox srcdoc>` with **scripts disabled**, which is the entire
security model:

- their JavaScript never executes, so a merged card cannot XSS the live site
- their CSS is confined to the frame, so it cannot leak out and restyle the page
- the worst a student can do is break their own card

`scripts/validate.mjs` additionally rejects `<script>`, inline `on*=` handlers,
`<iframe>`, missing `<style>`, unfilled placeholders, files over 30KB, and
filenames that don't match `data-github`. `getData.ts` strips scripts and
handlers again at build time — defence in depth.

A `.json` entry still works and renders the generated card; if both exist for
the same person, the hand-woven HTML wins.

## 🚀 Join the Society (contributor guide)

1. **Fork** this repository.
2. Copy `spider-society/_template.json` to a new file named after your GitHub
   username: `spider-society/<your-github-username>.json`
3. Fill it in:

```json
{
  "name": "Your Name",
  "alias": "Your Spider-Alias",
  "skills": ["Skill One", "Skill Two", "Skill Three"],
  "suitColor": "#FF1B4C",
  "githubUsername": "your-github-username"
}
```

| Field            | Rules                                        |
| ---------------- | -------------------------------------------- |
| `name`           | Your real name                               |
| `alias`          | Your Spider-Alias                            |
| `skills`         | Exactly **3** strings                        |
| `suitColor`      | Hex code, e.g. `#00F0FF` — drives card glow  |
| `githubUsername` | Must match your account and the file name    |

4. Commit, push, and **open a Pull Request**.
5. A GitHub Action validates your JSON. Green check → a maintainer merges → you're live.

**Rules:** one file per person, don't edit `_template.json`, don't touch other
people's files.

## 🎮 Into the Git-Verse (the game) — `/game`

An interactive Git escape room students play *while* doing the real work.
**Eleven chapters across two acts**, each gated behind a real Git command
typed into a simulated terminal. Nothing unlocks until the command is right.
Every chapter uses only commands the game itself teaches — `clone`, `add`,
`commit`, `push`, `checkout -b`, `merge` — nothing a facilitator needs to
prep or explain beyond what's already in this README.

### Act I — before lunch (Chapters 0–5)

| Ch | Codename | Teaches | Gate |
| -- | -------- | ------- | ---- |
| 0 | Suit Up | Install + identity | `git --version` → `user.name` → `user.email` |
| 1 | The Heist | Fork & clone | `git clone https://github.com/...` |
| 2 | Weave the Suit | Identity record + HTML/CSS card | `.json` record + the Suit Weaver (live preview) |
| 3 | Gather Web Fluid | Staging | `git add .` |
| 4 | Lock the Timeline | Commits | `git commit -m "..."` |
| 5 | Open the Portal | Push & PR | `git push` → PR button |

**Chapter 0 exists to protect your schedule.** Without `user.name` / `user.email`
set, Chapter 4 fails for every student simultaneously with *"Please tell me who
you are"* — the single most common way a beginner workshop loses 20 minutes.

**Chapter 2 produces two files, on purpose**: a `.json` identity record (the
data Act II reads and edits) and a hand-woven `.html` card (what the roster
actually shows). Losing either one breaks something downstream, so the game
and CI both require both.

### Act II — the afternoon boss fight, plus one more (Chapters 6–10)

Self-contained: every student generates their own merge conflict on their own
machine. No organizer timing, no `upstream` remote, nothing to coordinate.

| Ch | Codename | Teaches | Gate |
| -- | -------- | ------- | ---- |
| 6 | Split the Timeline | Branching | `git checkout -b symbiote` → add → commit |
| 7 | Collide the Timelines | Merging | `git checkout main` → commit → `git merge symbiote` |
| 8 | Purge the Symbiote | Conflict resolution | The Conflict Forge (in-browser) |
| 9 | Seal the Timeline | Merge commit + push | `git add .` → commit → `git push` |
| 10 | One More Web-Shot | Reinforcement (bonus round) | `git add .` → commit → `git push` — same three commands, one more time |

**The creative task:** on the `symbiote` branch students rewrite their own
Spider-ID as their villain alter-ego (dark alias, black suit, corrupted skills).
Back on `main` they write their upgraded hero form. Both edits touch the same
lines, so the merge conflicts *by construction* — and the conflict is about
their own identity, which is a much better story than a conflict over lorem text.

**The Conflict Forge** (`components/game/ConflictForge.tsx`) shows real
`<<<<<<< HEAD` markers in an editable pane and validates three things live:
markers removed, JSON still parses, exactly one identity left (it counts raw
key occurrences before parsing, so leaving both blocks in and only deleting
the marker lines is correctly rejected — `JSON.parse` would otherwise silently
keep the last duplicate key and pass). Students can fail it endlessly with
zero risk to their repo — then do the real one in 90 seconds.

**Chapter 10 is deliberately not a new lesson.** After Chapter 9, most groups
still have time left and nothing left to teach that's safe to explain without
prep the night before. Rather than introduce a new Git verb, Chapter 10 asks
students to add one small visual flourish to their card and run the exact
stage → commit → push cycle from Chapters 3–5 one more time. Zero new syntax,
genuine reinforcement of the three commands that matter most, and it's
optional — a student can stop at Chapter 9 with a complete, working PR.

**⚠️ Do not merge PRs before students reach Chapter 9 (or 10).** A merged PR
is closed and cannot reopen — if it's already merged, the afternoon's push has
nowhere to land and that student's work never reaches the roster. See
`RUNBOOK.md`.

### Engine notes

Levels can chain multiple terminal checks via `stages` (see Chapter 0), so a
single chapter can teach a sequence. `getStages()` in `data/levels.ts`
normalises single- and multi-check levels into one code path.

Built in: XP bar (2,750 total), chapter rail split by act, miss counter,
Lyla's progressive hints (vague first, exact answer last), near-miss coaching
that names the *specific* mistake (`git fork` isn't real; `git pull` is the
wrong direction; bare `git commit` traps you in vim), terminal history via
↑/↓, easter eggs (`sudo`, `whoami`, `git blame`), copy-to-clipboard on every
Field Ops command, a facilitator projector view (`/game?facilitator=1`),
optional sound (off by default), and progress saved to `localStorage` so a
refresh mid-event doesn't wipe anyone.

**Before the event:** `REPO_URL` in [`data/levels.ts`](data/levels.ts) already
points at this repository. If you fork this project for your own event, change
it there — it's the only place it's defined; `app/page.tsx` imports it rather
than hardcoding its own copy.

## 🔒 Security model

This repo hosts the live site **and** accepts ~100 public Pull Requests into
the same tree. See [`SECURITY.md`](SECURITY.md) for the full model: the
sandboxed-iframe rendering of student HTML, the CI scope guard that rejects a
PR touching anything outside the author's own `spider-society/` file, and the
branch-protection setup you must turn on before the event.

## 🗓️ Running the event (11:00–16:00)

| Time | |
| ---- | -- |
| 11:00–11:20 | Story hook, demo the game on the projector |
| 11:20–11:50 | **Chapter 0 gate** — nobody moves on until `git --version` answers |
| 11:50–12:50 | Act I (Chapters 1–5) |
| 12:50–13:15 | **Open-PR count-up on the projector** — not a merge, see `RUNBOOK.md` |
| 13:15–14:00 | Lunch — PRs stay open |
| 14:00–14:15 | Peer review warm-up — review the PR of the person beside you |
| 14:15–15:15 | Act II (Chapters 6–9), Chapter 10 bonus round for early finishers |
| 15:15–15:35 | Speedrun leaderboard / help stragglers |
| 15:35–15:50 | **The one merge pass** — `scripts/merge-all-prs.sh`, deploy paused |
| 15:50–16:00 | Roster reveal, prizes |

Realistic completion for a true beginner: **~40 min** with a prepared laptop,
**~1h50** from zero. Chapter 10 adds only a few minutes and needs zero new
explanation — it's the same three commands as Chapters 3–5.

See [`EVENT_FLOW.md`](EVENT_FLOW.md) for the minute-by-minute breakdown of
exactly what happens on the website vs. VS Code vs. the terminal vs. GitHub.com,
for every single chapter.

## 🧑‍💻 Run it locally

```bash
npm install
npm run dev       # http://localhost:3000
npm run validate  # same check CI runs
npm run build
```

## 🏗️ How it works

- `utils/getData.ts` reads `/spider-society/*.json` with Node's `fs` at **build time**
  (skipping `_template.json`), validates each entry, and skips malformed ones so a
  single bad PR can never break the live site.
- `app/page.tsx` is a static Server Component that calls it and renders the grid.
- `components/SpiderCard.tsx` is the client card: Framer Motion 3D tilt, a cursor
  glare and glow driven by `suitColor`, and the avatar from
  `https://github.com/<username>.png`.
- Avatars use `unoptimized` images so Vercel's image budget stays free regardless
  of roster size.

## ▲ Deploy

Import the repo on Vercel and hit deploy — defaults are correct. Every merge to
`main` triggers a rebuild, which re-reads the folder and regenerates the roster.

## 🎨 Theme tokens

Classic Spider-Man, deliberately restrained — suit red on suit black, with
web-silk for type. Defined in `tailwind.config.ts`: `ink` (blacks), `web`
(red / scarlet / crimson / blood / ember), `silk` (whites), and `signal`
(ok / warn / bad) which is reserved for state and never used decoratively.

All Spider-Man iconography in `components/SpiderArt.tsx` — the emblem, mask,
and webbing — is original SVG geometry drawn for this project. No Marvel
artwork is bundled, which keeps the site safe to publish publicly.
