# Backlog — polish queue for the loop

Worked top-down. Each item is small enough to finish and verify in one pass.

## Next up
- [ ] **GitHub verification badges** — fully designed, deliberately not built.
      `app/api/verify` + a server-side token would let a chapter show a
      "✓ VERIFIED on GitHub" badge (fork exists / PR open / merge commit has
      two parents) as a bonus, never a gate. Needs its own security review
      before adding a server-side token to this repo — see `SECURITY.md` §4-5.
- [ ] **Web-swing cursor** — a faint strand trailing the pointer. Deliberately
      last: it competes with the terminal caret for attention.
- [ ] **Per-chapter `/game/[chapter]` routes** so facilitators can deep-link.

## Later
- [ ] Live roster ↔ game link: after a PR merges, show that student's card.
- [ ] `/leaderboard` from static JSON (fastest clears, fewest misses).
- [ ] OG image per Spider-ID for sharing.
- [ ] Lighthouse + a11y pass (focus rings, aria-live on terminal output).

## Done
- [x] **Fixed bug**: `REPO_URL` was a placeholder in TWO places (`data/levels.ts`
      and a duplicate hardcoded copy in `app/page.tsx`). Now one source of
      truth, pointing at the real repo; `app/page.tsx` imports it.
- [x] **Fixed bug**: Chapter 2 produced only an `.html` card, but Chapters 6/7
      say "open your json file" and the hero stats derive `skills` from JSON —
      HTML-only students hit a missing file in Act II and the stats bar showed
      0 unique abilities all day. Chapter 2 now creates both; CI (`validate.mjs`)
      requires the pairing; `getData.ts` merges an HTML card's display with its
      paired JSON's skills/color.
- [x] **Fixed bug**: `_template.json`'s sample values ("Miles Morales",
      "octocat") looked like real data, not placeholders — a lightly-edited
      submission could slip past detection. Now explicit ("Your Name", etc.),
      and both validators additionally reject the literal placeholder strings.
- [x] **Fixed security hole**: ConflictForge's "one identity, not two" check
      parsed the JSON and then checked shape — but `JSON.parse` silently keeps
      the LAST occurrence of a duplicate key, so deleting only the marker
      lines (leaving both `alias`/`skills` blocks intact) passed all three
      checks. Now counts raw key occurrences in the source text before
      parsing collapses them. Verified against the exact bypass case.
- [x] **Fixed security hole (the big one)**: this repo hosts the live Vercel
      site AND accepts ~100 contributor PRs into the same tree. CI previously
      only ran when a PR touched `spider-society/**` — a PR touching only
      `next.config.mjs` or the CI workflow itself triggered *no check at all*.
      Added `scripts/check-pr-scope.mjs` + a workflow job that runs on every
      PR and rejects anything that isn't the author's own new/edited
      `spider-society/<their-username>.{json,html}` file. Verified against 5
      scenarios: legit self-edit, config tampering, cross-user delete,
      filename impersonation, template tampering — all behave correctly.
      Documented the full model, plus required branch-protection setup and
      the (currently moot, no secrets exist) Vercel-preview consideration, in
      new `SECURITY.md`.
- [x] **Fixed a real hydration bug**: `SpiderMask` and `WebCorner` computed
      SVG line coordinates with raw `Math.cos`/`Math.sin` floats passed
      directly into JSX attributes. Server and client JS engines aren't
      guaranteed to stringify the same float identically at the ULP level,
      which was firing a React hydration-mismatch warning on every single
      page load. Fixed by rounding every trig-derived coordinate to
      `.toFixed(3)` before it reaches JSX.
- [x] Load-tested with 104 simultaneous roster entries (mixed JSON + HTML
      cards): ~216ms load, ~3,000 DOM nodes, ~7MB heap, zero console errors.
      `loading="lazy"` on card iframes was already in place and is doing its
      job — comfortably holds at 100 participants.
- [x] **Fixed the lunch-merge trap**: Chapter 9's whole lesson is that a
      pushed commit updates an OPEN PR automatically — but a *merged* PR is
      closed and can't reopen. Merging at lunch (the original plan) would
      have closed every PR before Act II's afternoon push had anywhere to
      land, silently discarding three hours of student work. Rewrote
      `RUNBOOK.md`'s run of show: PRs stay open all day, one batch merge at
      ~15:35 via `scripts/merge-all-prs.sh` (gh CLI, checks Vercal auto-deploy
      is paused first so 100 merges don't queue 100 rebuilds).
- [x] **Extended the game, then rescoped it the night before the event.**
      First pass added Act III (4 new chapters teaching `git log`, `git grep`,
      `git stash`, `git tag`, with a real easter egg committed in
      `components/SpiderArt.tsx`). Reverted on request — those are advanced
      topics a facilitator can't responsibly explain without prep the night
      before a live event. Replaced with **Chapter 10, "One More Web-Shot"**:
      zero new commands, just one more add → commit → push cycle (identical
      to Chapters 3–5) on a small visual flourish added to the student's own
      card. Reinforces the three commands that matter most instead of
      teaching new ones. Total XP 2,450 → 2,750, 10 chapters → 11. Full
      playthrough verified end to end, zero console errors, from a clean
      browser tab.
- [x] Identity gate — Spider-Alias + GitHub username captured once, then
      substituted into every chapter ("spider-society/JayNaik.json").
- [x] Facilitator projector view at /game?facilitator=1 (arrow-key driven).
- [x] Copy-to-clipboard on Field Ops commands and the expected-command block
      (fixed: the regex was anchored to line-start and missed commands that
      follow a prose lead-in like "Check it worked: git --version").
- [x] Web Audio cues, off by default, persisted toggle in the HUD.
- [x] Reduced-motion pass incl. the JS-driven confetti.
- [x] Comic SFX burst (THWIP!/SNIKT!/BAMF!/KRAK!/WEB-LOCK!) on correct commands.
- [x] Spider-sense red shockwave on wrong commands, alongside the shake.
- [x] RUNBOOK.md — organizer guide: pre-work email, run of show, ranked failure
      modes with fixes, merge workflow, facilitator tips.
- [x] In-chapter "Stuck?" panels (troubleshoot data on 10 of the 11 chapters),
      including the full push-auth / PAT flow in Chapter 5.
- [x] /cheatsheet — printable one-pager for all chapters across both acts,
      + print stylesheet.
- [x] Chapter 0 (Suit Up) with chained multi-command stages engine.
- [x] Act II: Ch 6-9 symbiote arc, Path A self-contained merge conflict.
- [x] Conflict Forge — in-browser conflict resolution with live validation.
- [x] Classic red/black Spider-Man retheme across game + roster; original SVG
      emblem/mask/webbing in components/SpiderArt.tsx (no Marvel art bundled).
- [x] Web-shot chapter transition, swing-in mission log, CSS-driven entrances.
- [x] Phases 1–4 of the game spec (state, split-screen, terminal engine,
      5 levels, theming, transitions).
- [x] Roster site (`/`) with fs-based JSON parsing + CI validation.
