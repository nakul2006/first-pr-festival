#!/usr/bin/env bash
# Batch-merges every open, CI-green contribution PR in one pass.
#
# Why this exists: merging 100 PRs one at a time through the GitHub web UI
# takes 25-35 minutes of solid clicking, and — if Vercel's auto-deploy is
# left on — triggers 100 separate rebuilds that queue behind each other and
# can hit the Hobby-plan daily deployment cap mid-event. See RUNBOOK.md,
# "Merging 100 PRs" for the full procedure (pause auto-deploy first).
#
# Requires: gh CLI, authenticated (`gh auth login`), run from inside the repo.
set -euo pipefail

REPO="Jay-Naik2526/first-pr-festival"
DRY_RUN=1

if [[ "${1:-}" == "--go" ]]; then
  DRY_RUN=0
fi

echo "── Open PRs against $REPO ──────────────────────────────────"
gh pr list --repo "$REPO" --state open --limit 300 \
  --json number,author,title,statusCheckRollup \
  --jq '.[] | "#\(.number)  @\(.author.login)  \(.title)"'

echo ""
mergeable=$(gh pr list --repo "$REPO" --state open --limit 300 \
  --json number,statusCheckRollup \
  --jq '[.[] | select(all(.statusCheckRollup[]?; .conclusion == "SUCCESS")) | .number] | length')
echo "→ $mergeable PR(s) have every check green and are safe to merge."
echo ""

if [[ "$DRY_RUN" == "1" ]]; then
  echo "DRY RUN — nothing merged. Review the list above, then re-run:"
  echo ""
  echo "    ./scripts/merge-all-prs.sh --go"
  echo ""
  echo "Before running --go: confirm you have PAUSED Vercel auto-deploy"
  echo "(Project → Settings → Git → toggle off), so this doesn't trigger"
  echo "100 sequential builds. Turn it back on and do ONE manual redeploy"
  echo "once every PR is merged."
  exit 0
fi

echo "Merging every PR with all checks green..."
gh pr list --repo "$REPO" --state open --limit 300 \
  --json number,statusCheckRollup \
  --jq '.[] | select(all(.statusCheckRollup[]?; .conclusion == "SUCCESS")) | .number' \
  | while read -r n; do
      echo "  merging #$n ..."
      gh pr merge "$n" --repo "$REPO" --squash --delete-branch --admin || \
        echo "    ⚠️  #$n failed to merge — check it manually."
    done

echo ""
echo "Done. Remember: turn Vercel auto-deploy back on and trigger ONE"
echo "manual redeploy to publish everyone's cards at once."
