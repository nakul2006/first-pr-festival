// Guards the shared repo: this codebase hosts the LIVE Vercel site AND
// accepts ~100 student Pull Requests into the same tree. A PR must only
// ADD a new file under spider-society/, or touch a file whose name matches
// the PR author's own GitHub username. Anything else — app code, config,
// workflows, someone else's card, the templates — is rejected before a
// human ever has to notice it by eye while merging fast.
//
// Requires two env vars, both supplied by the workflow from GitHub's own
// event payload (not user-controllable):
//   BASE_SHA, HEAD_SHA — the PR's merge-base and head commits
//   PR_AUTHOR           — github.event.pull_request.user.login
import { execFileSync } from "node:child_process";

const { BASE_SHA, HEAD_SHA, PR_AUTHOR } = process.env;
if (!BASE_SHA || !HEAD_SHA || !PR_AUTHOR) {
  console.error("check-pr-scope: missing BASE_SHA, HEAD_SHA, or PR_AUTHOR env var.");
  process.exit(1);
}

const author = PR_AUTHOR.toLowerCase();
const diff = execFileSync("git", ["diff", "--name-status", `${BASE_SHA}...${HEAD_SHA}`], {
  encoding: "utf-8",
});

const errors = [];

for (const line of diff.split("\n").filter(Boolean)) {
  // git diff --name-status: "A\tpath", "M\tpath", "D\tpath", or "R100\told\tnew"
  const parts = line.split("\t");
  const status = parts[0][0]; // first letter — A, M, D, or R
  const paths = status === "R" ? [parts[1], parts[2]] : [parts[1]];

  for (const filePath of paths) {
    if (!filePath.startsWith("spider-society/")) {
      errors.push(
        `"${filePath}" is outside spider-society/ — this PR touches site code, not just a card. ` +
          `Only files under spider-society/ may be part of a contribution PR.`,
      );
      continue;
    }

    const basename = filePath.slice("spider-society/".length).replace(/\.(json|html)$/i, "");

    if (basename.startsWith("_")) {
      errors.push(`"${filePath}" is a protected template file and cannot be edited or removed.`);
      continue;
    }

    if (status === "A") {
      // A brand-new file should be named after the person adding it — this
      // stops one PR from adding a card impersonating someone else.
      if (basename.toLowerCase() !== author) {
        errors.push(
          `"${filePath}" was added by @${PR_AUTHOR}, but the filename doesn't match their username. ` +
            `Name your file "${author}.json" / "${author}.html".`,
        );
      }
      continue;
    }

    // Modifying, deleting, or renaming an EXISTING file is only allowed when
    // it's the author's own card — editing or removing someone else's entry
    // is never a legitimate contribution PR.
    if (basename.toLowerCase() !== author) {
      errors.push(
        `"${filePath}" (${status === "D" ? "deleted" : status === "R" ? "renamed" : "modified"}) ` +
          `does not belong to @${PR_AUTHOR} and cannot be changed in this PR.`,
      );
    }
  }
}

if (errors.length) {
  console.error("\n❌ This PR is out of scope:\n");
  for (const e of errors) console.error("  • " + e);
  console.error(
    "\nA contribution PR should contain exactly one new file: spider-society/<your-username>.json " +
      "and/or spider-society/<your-username>.html\n",
  );
  process.exit(1);
}

console.log("✅ PR scope OK — touches only the author's own spider-society file(s).");
