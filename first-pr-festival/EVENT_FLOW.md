# Event Flow — First PR Festival

The precise, minute-by-minute breakdown: what happens on the **website**,
what happens in **VS Code**, what happens in the **real terminal**, and what
happens on **GitHub.com**, for every single chapter. Read `RUNBOOK.md` for
logistics (merging, troubleshooting, facilitator tips) and `SECURITY.md` for
the security model — this doc is the *what happens, where, in what order*.

---

## The four surfaces, once, so every row below makes sense

A student has **four things** open during the event. Understanding which one
does what kills most floor confusion:

| Surface | What it is | What it does |
| ------- | ---------- | ------------ |
| **The website** (`/game`) | A browser tab | Tells the story, states the objective, and **checks whether a typed command *looks* right**. It never executes anything. Left panel = story + instructions ("Field Ops"). Right panel = a simulated terminal (or, in two chapters, a different tool — see below). |
| **VS Code** | A real code editor, on their laptop | Where they actually create and edit files — their JSON identity record, their HTML card, and later their villain/hero edits. |
| **The real terminal** | Their laptop's actual shell (Terminal.app, PowerShell, Git Bash, whatever) | Where Git commands **actually run** against their actual cloned folder. This is the real work. |
| **GitHub.com** | The actual GitHub website | Where forking, opening the Pull Request, and (for the organizer) merging happens. |

**The one sentence to say from the projector at 10:20, before anyone touches
anything:** *"The terminal on the right side of the website is a simulator —
it only checks that you typed the right command. The real work happens in
your real terminal and VS Code. Field Ops on the left is what you actually do;
typing it into the website again is how you prove you did it."*

Two chapters replace the simulated terminal with something else on the
website's right panel:
- **Chapter 2** → the **Suit Weaver**, a live HTML/CSS editor with instant preview.
- **Chapter 8** → the **Conflict Forge**, a safe practice pad for resolving a merge conflict before doing it for real.

Progress is saved in the browser's `localStorage`, per browser. Tell students
to pick one browser for the whole day and not use incognito/private mode, or
a refresh-in-a-different-browser will look like their progress vanished (it
didn't — it's just not visible from a different browser profile).

---

## Before 11:00 — organizer setup (once, not per-student)

Full checklist in `RUNBOOK.md`. The load-bearing ones:

1. Confirm `REPO_URL` in `data/levels.ts` points at the real repo (it already
   does: `Jay-Naik2526/first-pr-festival`).
2. Delete the sample files in `spider-society/` so the roster starts empty.
3. **Turn on branch protection on `main`** — `SECURITY.md` §3. Without this,
   CI passing is a suggestion, not a gate.
4. `gh auth login` on the machine you'll merge from, ahead of time.
5. Deploy to Vercel, confirm `/`, `/game`, and `/cheatsheet` all load.
6. Print the cheat sheet (`/cheatsheet`), one per student.
7. Send the pre-work email 48 hours ahead (installs Git + VS Code, makes a
   GitHub account) — this is the single highest-leverage thing you can do.

---

## 11:00–11:20 — Story hook

**Website:** project `/game` (or `/game?facilitator=1`, the projector view)
on the big screen. Walk through Chapter 1's lore out loud. Sell the story —
Kingpin locked the archive, they're about to fork a universe.

**VS Code / terminal / GitHub:** nothing yet. Nobody has touched their laptop.

---

## 11:20–11:50 — Chapter 0: Suit Up

*The gate. Nobody proceeds until this is genuinely done — Chapter 4 fails for
everyone simultaneously otherwise.*

| Step | Website | VS Code | Terminal | GitHub.com |
| ---- | ------- | ------- | -------- | ---------- |
| 1 | Shows the Identity Gate first — student types their **Spider-Alias** and **real GitHub username**. Every later chapter's instructions personalize using this. | — | — | Student should already have an account (from the pre-work email). |
| 2 | Lore: *"Nobody swings on their first day."* Field Ops lists the install steps. | — | Install Git (`git-scm.com` on Windows, `xcode-select --install` on Mac). **Close and reopen the terminal after.** | — |
| 3 | Check 1 of 3: type `git --version` into the simulator. | — | Also run `git --version` for real — confirms the install worked. | — |
| 4 | Check 2 of 3: type `git config --global user.name "Their Name"` into the simulator. | — | Run the same command for real. This is what signs every future commit with their name. | — |
| 5 | Check 3 of 3: type `git config --global user.email "their@email"` into the simulator (must match their GitHub account's email). | — | Run the same command for real. | — |
| 6 | All three green → Chapter 0 unlocks, **+50 XP**, "Jump to Chapter 1" button appears. | — | — | — |

**Facilitator check before moving the room on:** walk past a few laptops and
confirm `git config --global --list` actually shows a name and email. The
simulator can be beaten by typing the command without running it for real —
this is the one chapter worth spot-checking by eye.

---

## 11:50–12:50 — Act I, Chapters 1–5

### Chapter 1 — The Heist (Fork & Clone)

| Step | Website | VS Code | Terminal | GitHub.com |
| ---- | ------- | ------- | -------- | ---------- |
| 1 | Lore: Kingpin locked the archive; forking pulls a copy into their own universe. Field Ops has a direct "Open the repo" link. | — | — | Student clicks the link, then clicks **Fork** (top-right). Now they own `github.com/<them>/first-pr-festival`. |
| 2 | — | — | — | On THEIR fork, click **Code** → copy the HTTPS URL. |
| 3 | — | — | Run `git clone <that URL>` for real. This downloads their fork onto their laptop. | — |
| 4 | Type `git clone https://github.com/<their-fork-url>` into the simulator. Must start with `https://github.com/`. | — | — | — |
| 5 | Green → **+100 XP**, Chapter 2 unlocks. | — | `cd` into the newly created folder — this is home base for the rest of the day. | — |

### Chapter 2 — Weave the Suit (Identity + HTML/CSS card)

This is the "make your own ID card" task — the creative centerpiece of Act I.

| Step | Website | VS Code | Terminal | GitHub.com |
| ---- | ------- | ------- | -------- | ---------- |
| 1 | Lore explains: two files now — a JSON *identity record* and an HTML *suit*. Right panel becomes the **Suit Weaver**: a live HTML/CSS editor with instant sandboxed preview. | — | — | — |
| 2 | — | Copy `spider-society/_template.json` → rename to `<username>.json`. Fill in name, alias, exactly 3 skills, a hex `suitColor`, and `githubUsername`. | — | — |
| 3 | — | Copy `spider-society/_template.html` → rename to `<username>.html`. Fill in the four `data-*` attributes (must match the JSON) and the avatar `<img src>`. | — | — |
| 4 | Paste/iterate the HTML+CSS in the **Suit Weaver** on the website — colors, fonts, gradients, whatever — watching the sandboxed preview update live. Three checks (details filled in, `<style>` present, no JavaScript) must go green. | Once happy, copy the final HTML back into the real `<username>.html` file. | — | — |
| 5 | Click **Suit Woven**. | — | — | — |
| 6 | Green → **+200 XP**, Chapter 3 unlocks. | Save both files. | — | — |

**Rules the loom enforces (checked by CI later, not just the website):**
internal CSS only, no `<script>` tags, card fits 320×440, all four `data-*`
attributes filled with real values (not the template placeholders).

### Chapter 3 — Gather Web Fluid (Staging)

| Website | VS Code | Terminal | GitHub.com |
| ------- | ------- | -------- | ---------- |
| Lore: The Prowler is scanning the drive — stage your files before he finds them. | — | Run `git status` (their two new files show up untracked, in red). Run `git add .` for real. | — |
| Type `git add .` into the simulator. | — | — | — |
| Green → **+200 XP**, Chapter 4 unlocks. | — | — | — |

### Chapter 4 — Lock the Timeline (Commit)

| Website | VS Code | Terminal | GitHub.com |
| ------- | ------- | -------- | ---------- |
| Lore: Miguel O'Hara appears — a commit is a permanent snapshot with your name burned into it. | — | Run `git commit -m "Add <their alias> to the Spider-Society"` for real. | — |
| Type the exact same commit command into the simulator (quotes required, message can't be empty). | — | — | — |
| Green → **+250 XP**, Chapter 5 unlocks. | — | — | — |

### Chapter 5 — Open the Portal (Push & Pull Request)

*This is the bottleneck chapter. See `RUNBOOK.md` for the full push-auth
troubleshooting table — put the PAT steps on a shared slide before this
chapter starts.*

| Step | Website | VS Code | Terminal | GitHub.com |
| ---- | ------- | ------- | -------- | ---------- |
| 1 | Lore: push sends local history to the cloud; a Pull Request is a portal asking to be let into the original archive. "Stuck?" panel has the full auth walkthrough. | — | Run `git push` for real. First push may prompt for authentication — a Personal Access Token as the password, or the Git Credential Manager browser popup. | — |
| 2 | Type `git push` into the simulator. | — | — | — |
| 3 | Green → **+400 XP**, a glowing **"Enter the Multiverse — Submit PR"** button appears. | — | — | Refresh their fork — the new files are there. A green **"Compare & pull request"** banner appears. Click it, write a title/description, click **Create pull request**. |
| 4 | Click the Submit PR button (opens GitHub's compare page directly). | — | — | The PR is now open against the real repo. **This is the moment their PR exists — and it stays open all day.** |

**⚠️ Organizer note:** do **not** merge this PR yet. See "12:50–13:15" below.

---

## 12:50–13:15 — Open-PR count-up (not a merge)

**Website:** nothing new for students — most are still finishing Chapter 5.

**GitHub.com (organizer, on the projector):** open the repo's **Pull
requests** tab, sorted newest-first, and just let it scroll/refresh as new
PRs land. "We're at 62 open PRs" is a genuinely good moment on its own, and it
costs nothing. **Do not click Merge on anything yet** — see the box below.

> **Why not merge now?** Chapter 9 (Act II, this afternoon) teaches that a PR
> stays open and updates itself when you push more commits — "a PR is alive."
> A *merged* PR is closed and cannot reopen. If you merge now, every
> student's Act II push this afternoon has nowhere to land, and three hours
> of real work never reaches the roster. One merge pass happens at 15:35,
> after Act II is done. Full reasoning in `RUNBOOK.md`.

---

## 13:15–14:00 — Lunch

**Website / VS Code / terminal:** idle. Progress is saved.

**GitHub.com:** PRs remain open. If a student's CI is red, you can comment on
their PR now so they see it when they're back (optional — the game already
tells them what's wrong).

---

## 14:00–14:15 — Peer review warm-up

**Website:** nothing new.

**GitHub.com:** each student opens the PR of the person sitting next to them,
reads the diff (their `.json` and `.html`), leaves one comment, and clicks
**Approve** (or "Comment" if there's genuine feedback). This is the half of
GitHub the game doesn't otherwise teach — reviewing, not just submitting.

---

## 14:15–15:15 — Act II, Chapters 6–10 (the boss fight, plus one more)

### Chapter 6 — Split the Timeline (Branching)

| Step | Website | VS Code | Terminal | GitHub.com |
| ---- | ------- | ------- | -------- | ---------- |
| 1 | Lore: a symbiote is wearing their file like a coat — split off a parallel timeline before dealing with it. | — | Run `git checkout -b symbiote` for real. | — |
| 2 | Check 1: type `git checkout -b symbiote`. | Edit **both** `<username>.json` and `<username>.html` — rewrite as their **villain alter-ego**: dark alias, black `suitColor`, corrupted skills. This is the creative task of Act II. | — | — |
| 3 | Check 2: type `git add .`. | — | Run `git add .` for real. | — |
| 4 | Check 3: type `git commit -m "Symbiote takeover"` (or similar). | — | Run the matching commit for real. | — |
| 5 | Green → **+250 XP**, Chapter 7 unlocks. | — | — | — |

### Chapter 7 — Collide the Timelines (Merge → Conflict)

| Step | Website | VS Code | Terminal | GitHub.com |
| ---- | ------- | ------- | -------- | ---------- |
| 1 | Lore: return to `main` — it looks untouched, because branching worked. | — | Run `git checkout main` for real. | — |
| 2 | Check 1: type `git checkout main`. | Edit the **same two files**, on `main` this time — write their **upgraded hero form**: stronger alias, brighter suit, evolved skills. Must touch the same lines as the villain edit for a real conflict to occur. | — | — |
| 3 | Check 2: type the commit command for the upgraded form. | — | `git add .` then `git commit -m "Upgraded form"` for real. | — |
| 4 | Check 3: type `git merge symbiote`. | — | Run `git merge symbiote` for real. **Git reports a conflict — this is expected, not an error.** | — |
| 5 | Green (the simulator recognizes the conflict as the correct outcome) → **+300 XP**, Chapter 8 unlocks. | — | — | — |

### Chapter 8 — Purge the Symbiote (Resolve the Conflict)

*No terminal this chapter — the website's right panel becomes the
**Conflict Forge**, a safe practice pad.*

| Step | Website | VS Code | Terminal | GitHub.com |
| ---- | ------- | ------- | -------- | ---------- |
| 1 | The Conflict Forge shows realistic `<<<<<<< HEAD` / `=======` / `>>>>>>>` markers in an editable textarea, with three live checks: markers removed, still valid JSON, exactly one identity left. | — | — | — |
| 2 | Practice: delete the markers, decide what survives (keep the hero, optionally steal one villain skill), edit freely — **zero risk**, this text never touches their real repo. Retry as many times as needed until all three checks are green. | — | — | — |
| 3 | Once green here, open the REAL conflicted file. | Delete the same three marker lines for real, in their actual `<username>.json` (and `.html`, since both conflicted). Keep exactly one alias, one suit color, one set of 3 skills. Confirm the JSON still has matching braces/commas. | — | — |
| 4 | Click **"Suit Woven"**-equivalent completion button once the real file matches. | Save the file. | — | — |
| 5 | Green → **+400 XP**, Chapter 9 unlocks. | — | — | — |

### Chapter 9 — Seal the Timeline (Commit the Merge & Push)

| Step | Website | VS Code | Terminal | GitHub.com |
| ---- | ------- | ------- | -------- | ---------- |
| 1 | Lore: staging a resolved conflict is how you tell Git "I decided." | — | Run `git add .` for real — this is what marks a conflict as resolved. | — |
| 2 | Check 1: type `git add .`. | — | — | — |
| 3 | Check 2: type `git commit -m "Purge the symbiote"` (Git may pre-fill a merge message in an editor like vim — `Esc` then `:wq` to accept it). | — | Run the matching commit for real. | — |
| 4 | Check 3: type `git push`. | — | Run `git push` for real. | Refresh the **existing** PR from this morning — the new commits are already there. **No second PR is opened.** |
| 5 | Green → **+350 XP**. Lore bridges into the bonus round: "the archive never really closes." | — | — | — |

---

## 15:15–15:35 — Chapter 10 (optional, for students who finish early)

*Zero new commands. Chapter 10 exists purely so early finishers have
something to do that doesn't require you to explain anything new.*

### Chapter 10 — One More Web-Shot (reinforcement)

| Step | Website | VS Code | Terminal | GitHub.com |
| ---- | ------- | ------- | -------- | ---------- |
| 1 | Lore: nothing new to learn — just the same three moves, one more time, on something that's purely theirs. | Open `<username>.html` again. Add one small flourish: a corner badge, a glow, an extra line — pure CSS, nothing beyond what Chapter 2 already covered. Save. | — | — |
| 2 | Check 1: type `git add .` — identical to Chapter 3. | — | Run `git add .` for real. | — |
| 3 | Check 2: type `git commit -m "..."` — identical to Chapter 4. | — | Run the matching commit for real. | — |
| 4 | Check 3: type `git push` — identical to Chapter 5. | — | Run `git push` for real. | Refresh the same existing PR — the new commit is already on it. |
| 5 | Green → **+250 XP**. **Victory screen**: confetti, XP total, miss count, elapsed time, and the "Enter the Multiverse — Submit PR" button. | — | — | — |

Students can stop at Chapter 9 with a complete, working PR — Chapter 10 is a
bonus lap, not a requirement, and needs no new explanation from you: it's
Chapters 3, 4, and 5 again, on their own card.

---

## 15:35–15:50 — The one merge pass

**Website / VS Code / terminal:** idle for students — this is organizer-only.

**Organizer, in a real terminal (not the website):**

1. **Pause Vercel auto-deploy** — Project → Settings → Git → toggle off.
2. Dry run: `./scripts/merge-all-prs.sh` — lists every open PR and how many
   have every CI check green.
3. Merge: `./scripts/merge-all-prs.sh --go` — squash-merges every green PR via
   the `gh` CLI. Anything red is left open; go talk to that student.
4. **Turn auto-deploy back on**, then trigger **one manual redeploy**.
   ~60–90 seconds, one build, contains every merged card at once.

**GitHub.com:** ~100 PRs move from "open" to "merged" in about a minute of
scripted work instead of 30 minutes of clicking.

---

## 15:50–16:00 — Roster reveal, prizes

**Website:** refresh `/` on the projector. Every merged student's card
appears — a mix of the generated JSON look and the hand-woven HTML suits,
side by side. This is the payoff for the entire day.

**GitHub.com:** optionally scroll the closed PR list, or a student's Tags
page from Chapter 13, showing their own permanent marker in the history.

---

## Quick reference: what's simulated vs. what's real

| Thing | Real or simulated? |
| ----- | ------------------- |
| Typing a command into the website's terminal | **Simulated** — pattern-matched, nothing executes |
| Running that same command in the real terminal | **Real** — actually mutates their actual Git repo |
| The Suit Weaver / Conflict Forge previews | **Real rendering**, sandboxed — the exact HTML they'll ship, in a locked-down iframe |
| The hidden phrase in Chapter 11 | **Real** — genuinely committed in this repo's source |
| A Pull Request existing, updating, being merged | **Real** — actual GitHub state, the only thing that gets a card on the roster |
| The roster rebuilding after a merge | **Real** — Vercel actually rebuilds and Node's `fs` actually re-reads every file |
