# Security model

This repository does two things at once: it **hosts the live Vercel site**
(the roster and the game) and it **accepts ~100 public Pull Requests** into
the same tree, from strangers, on a live day. That combination is the whole
threat model. Here is every layer that protects it, and what you must set up
by hand before the event (items marked ⚠️).

## 1. Student HTML never executes

A student's Chapter 2 card is arbitrary HTML + CSS they wrote themselves.
It renders on the live roster inside:

```html
<iframe sandbox srcdoc="...">
```

`sandbox` with **no** `allow-scripts` token is the entire guarantee: the
browser refuses to execute any `<script>`, inline handler, or `javascript:`
URL inside that frame, full stop — it isn't a filter that can be bypassed
with clever markup, it's the browser's own execution model. Their CSS is
also confined to the frame's own document, so it cannot restyle the page
around it. Worst case, a student's own card renders wrong. It can never
touch the host page, read cookies, or make requests as a logged-in visitor.

`utils/getData.ts` and `scripts/validate.mjs` additionally **strip and
reject** `<script>`, inline `on*=` handlers, `<iframe>`, and `javascript:`
before the HTML ever reaches the build — defence in depth, in case the
sandbox attribute is ever weakened by a future edit.

## 2. CI runs on every PR, not just ones that "look right"

`.github/workflows/validate.yml` intentionally has **no `paths:` filter** on
the `pull_request` trigger. A path filter would mean a PR that only touches
`next.config.mjs` or `package.json` never runs CI at all — silently, with
nothing for a fast-merging maintainer to notice. Every PR now runs two jobs:

- **`scope`** (`scripts/check-pr-scope.mjs`) — fails the PR unless every
  changed file is under `spider-society/`, isn't a `_`-prefixed template,
  and — for anything that isn't a brand-new file — belongs to the PR's own
  author (checked against `github.event.pull_request.user.login`, which
  GitHub supplies and the PR author cannot forge). This is what stops a PR
  from editing app code, deleting someone else's card, or impersonating
  another student by filename. Tested against five scenarios (legitimate
  self-edit, config tampering, cross-user delete, impersonation, template
  edit) — all behave correctly.
- **`validate`** (`scripts/validate.mjs`) — the content rules: schema,
  3 skills, hex colour, no `<script>`, matching filename, and (new) that an
  HTML card has a paired JSON record.

## 3. ⚠️ Branch protection — you must turn this on

CI passing means nothing if `main` can be pushed to directly, or a PR can be
merged while checks are still red. On GitHub:

**Settings → Branches → Add branch protection rule** for `main`:
- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging → select both `scope`
  and `validate`
- ✅ Do not allow bypassing the above settings (uncheck "allow force pushes",
  uncheck admin bypass unless you specifically need it for the lunch-merge
  batch operation)

Or via `gh` CLI (run once, before the event):

```bash
gh api repos/Jay-Naik2526/first-pr-festival/branches/main/protection \
  --method PUT \
  -f required_status_checks[strict]=true \
  -f 'required_status_checks[contexts][]=scope' \
  -f 'required_status_checks[contexts][]=validate' \
  -f enforce_admins=false \
  -f required_pull_request_reviews=null \
  -f restrictions=null
```

## 4. No secrets live in this repo

There is no database, no API token, no `.env` committed (`.gitignore`
excludes `.env*.local`). The GitHub-verification feature discussed earlier
in the project (a server-side `GITHUB_TOKEN` calling the GitHub API) was
**never built** — which means there is currently nothing for a malicious PR
to exfiltrate even if a Vercel preview build ran untrusted code. If you add
that feature later: put the token only in Vercel's server-side environment
variables, never in a file that ships to a PR preview, and keep it read-only
/ public-repo scope.

## 5. Vercel preview deployments on fork PRs

Vercel builds a preview for every PR by default, including from forks. Given
point 4 (no secrets, no build step contributors control beyond a static JSON
or HTML file), there is nothing meaningful for a hostile PR to reach today.
If that ever changes, disable preview deployments for PRs from forks in
**Vercel → Project Settings → Git → Preview Deployments**, or add required
approval before a fork PR's preview builds.

## 6. What this deliberately does NOT try to stop

- A student writing an ugly or broken card. Not a security issue — it's
  their card, sandboxed, and CI already requires the four data attributes.
- A student's PR failing CI. That's the system working — they fix it and
  push again, which is the actual lesson.
