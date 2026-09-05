import type { LucideIcon } from "lucide-react";
import {
  Biohazard,
  Fingerprint,
  GitMerge,
  ShieldCheck,
  Sparkles,
  Split,
  Wrench,
  GitBranch,
  GitCommitHorizontal,
  Layers,
  Rocket,
} from "lucide-react";

/** Where the real PR gets opened. Change this to your event repo. */
export const REPO_URL = "https://github.com/Jay-Naik2526/first-pr-festival";
export const PR_URL = `${REPO_URL}/compare`;

export type ValidationResult = {
  ok: boolean;
  /** Terminal response line shown to the player. */
  message: string;
  /** Softer nudge for a near-miss — styled amber instead of red. */
  nearMiss?: boolean;
};

/**
 * A single terminal check. Levels that teach one command have exactly one;
 * setup-heavy levels (Chapter 0) chain several.
 */
export type Stage = {
  label: string;
  expectedDisplay: string;
  hints: string[];
  successLine: string;
  validate: (input: string) => ValidationResult;
};

export type Level = {
  id: number;
  /** Act I runs before lunch, Act II is the afternoon boss fight. */
  act: 1 | 2;
  codename: string;
  title: string;
  dimension: string;
  villain: string;
  icon: LucideIcon;
  accent: string;
  /** Comic panels of lore, rendered one after another. */
  lore: string[];
  objective: string;
  /** Things to do OUTSIDE the app — on GitHub, in VS Code, in a real shell. */
  fieldOps: string[];
  /** What the terminal expects, shown in the HUD. */
  expectedDisplay: string;
  hints: string[];
  /** Terminal challenge, a button for offline tasks, or the conflict forge. */
  kind: "terminal" | "button" | "conflict" | "weave";
  /** Optional multi-command sequence; overrides the level's own validator. */
  stages?: Stage[];
  /** Self-serve fixes for the ways this chapter actually breaks in the wild. */
  troubleshoot?: { symptom: string; fix: string }[];
  buttonLabel?: string;
  successTitle: string;
  successLines: string[];
  xp: number;
  validate?: (input: string) => ValidationResult;
};

const strip = (s: string) => s.trim().replace(/\s+/g, " ");

export const LEVELS: Level[] = [
  {
    id: 0,
    act: 1,
    codename: "SUIT UP",
    title: "Fit the Suit",
    dimension: "EARTH-1610",
    villain: "THE UNPREPARED",
    icon: Wrench,
    accent: "#E8E6E3",
    lore: [
      "Nobody swings on their first day.",
      "Before Peter ever caught a train with his bare hands, he spent a week sewing a suit that didn't fit.",
      "Your suit is your machine. Git has to be installed on it, and it has to know who you are — because every snapshot you take gets signed with your name, forever.",
      "Three checks. Then you're cleared to swing.",
      "Skip this and Chapter 4 will throw you off a building.",
    ],
    objective: "Install Git and teach it your name and email.",
    fieldOps: [
      "Windows: install Git from git-scm.com (accept every default). Mac: run xcode-select --install",
      "Close and REOPEN your terminal afterwards, or it won't find git.",
      "Check it worked: git --version",
      'Set your name: git config --global user.name "Your Name"',
      'Set your email: git config --global user.email "you@example.com"',
      "Use the same email as your GitHub account so your commits link to you.",
    ],
    expectedDisplay: "git --version",
    hints: ["Start with: git --version"],
    kind: "terminal",
    stages: [
      {
        label: "Check the suit exists",
        expectedDisplay: "git --version",
        successLine: ">> GIT DETECTED. Suit powered on.",
        hints: [
          "Two words and a flag.",
          "It is literally: git --version",
          "If your terminal says 'command not found', Git isn't installed — or you didn't reopen the terminal.",
        ],
        validate: (raw) => {
          const input = strip(raw);
          if (/^git\s+(--version|version|-v)$/i.test(input)) {
            return { ok: true, message: "git version detected — suit powered on." };
          }
          if (/^git$/i.test(input)) {
            return { ok: false, nearMiss: true, message: "Add the flag: git --version" };
          }
          return { ok: false, message: "Anomaly detected. Invalid command." };
        },
      },
      {
        label: "Sign the suit — your name",
        expectedDisplay: 'git config --global user.name "Your Name"',
        successLine: ">> NAME BURNED INTO THE WEAVE.",
        hints: [
          "It starts with git config --global",
          'The setting is called user.name and your name goes in quotes.',
          'git config --global user.name "Your Name"',
        ],
        validate: (raw) => {
          const input = raw.trim();
          const m = input.match(/^git\s+config\s+--global\s+user\.name\s+(["'])(.*?)\1\s*$/i);
          if (m) {
            if (!m[2].trim()) {
              return { ok: false, nearMiss: true, message: "An unsigned suit. Put your actual name in the quotes." };
            }
            return { ok: true, message: `Identity set to "${m[2]}" — every commit you make will carry it.` };
          }
          if (/^git\s+config\s+--global\s+user\.name\s+\S/i.test(input)) {
            return { ok: false, nearMiss: true, message: 'Wrap your name in quotes: user.name "Your Name"' };
          }
          if (/^git\s+config/i.test(input)) {
            return { ok: false, nearMiss: true, message: 'Close. The full form is: git config --global user.name "Your Name"' };
          }
          return { ok: false, message: "Anomaly detected. Invalid command." };
        },
      },
      {
        label: "Sign the suit — your email",
        expectedDisplay: 'git config --global user.email "you@example.com"',
        successLine: ">> SUIT FITTED. You are cleared to swing.",
        hints: [
          "Same command as before, but user.email this time.",
          "Use the same address as your GitHub account.",
          'git config --global user.email "you@example.com"',
        ],
        validate: (raw) => {
          const input = raw.trim();
          const m = input.match(/^git\s+config\s+--global\s+user\.email\s+(["'])(.*?)\1\s*$/i);
          if (m) {
            if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m[2].trim())) {
              return { ok: false, nearMiss: true, message: "That doesn't look like an email address. Check for typos." };
            }
            return { ok: true, message: `Contact channel set to ${m[2]} — GitHub will match your commits to your account.` };
          }
          if (/^git\s+config\s+--global\s+user\.email\s+\S/i.test(input)) {
            return { ok: false, nearMiss: true, message: 'Quotes: user.email "you@example.com"' };
          }
          return { ok: false, message: "Anomaly detected. Invalid command." };
        },
      },
    ],
    troubleshoot: [
      {
        symptom: "'git' is not recognized / command not found",
        fix: "Git isn't installed, or you didn't reopen the terminal after installing. Close it completely and open a new one.",
      },
      {
        symptom: "Mac says 'xcode-select: note: install requested'",
        fix: "A popup appeared behind your window. Find it and click Install, then wait — it takes a few minutes.",
      },
      {
        symptom: "I don't know if it saved",
        fix: "Run: git config --global --list  — you should see your user.name and user.email in the output.",
      },
    ],
    successTitle: "SUIT FITTED",
    successLines: [
      "Git installed. Identity signed into the weave.",
      "Every snapshot you take from here carries your name.",
      "Now go steal a universe.",
    ],
    xp: 50,
  },
  {
    id: 1,
    act: 1,
    codename: "THE HEIST",
    title: "Fork & Clone",
    dimension: "EARTH-1610",
    villain: "KINGPIN",
    icon: GitBranch,
    accent: "#E62429",
    lore: [
      "03:14. The Alchemax mainframe goes dark.",
      "Kingpin has locked the Spider-Society archive behind his own collider. Every Spider-Person's file — gone. The originals are untouchable.",
      "But Lyla found something. The archive is public. You cannot edit the original... but you CAN pull a copy of the entire universe into your own dimension.",
      "That copy is called a FORK. Dragging it down onto your machine is called a CLONE.",
      "Go get us a universe, kid.",
    ],
    objective: "Fork the event repository, then clone your fork to your machine.",
    fieldOps: [
      "Open the event repo on GitHub.",
      "Hit the Fork button (top-right). You now own a parallel universe.",
      "On YOUR fork, click the green Code button and copy the HTTPS URL.",
      "In your real terminal: git clone <that url>",
      "Then type the same command into the simulator on the right.",
    ],
    expectedDisplay: "git clone https://github.com/...",
    hints: [
      "The command is two words, then a link.",
      "It starts with: git clone https://github.com/",
      "Paste the URL you copied from YOUR fork — it has your username in it.",
    ],
    kind: "terminal",
    troubleshoot: [
      {
        symptom: "fatal: repository not found",
        fix: "You copied the URL from the ORIGINAL repo instead of your fork. Your fork's URL has YOUR username in it.",
      },
      {
        symptom: "Where did the folder go?",
        fix: "It cloned into whatever folder your terminal was sitting in. Run: pwd (Mac) or cd (Windows) to see where you are.",
      },
      {
        symptom: "I can't cd into it",
        fix: "The folder is named after the repo. Type cd then the first few letters and press Tab to autocomplete.",
      },
    ],
    successTitle: "UNIVERSE ACQUIRED",
    successLines: [
      "Fork detected. Local dimension spun up.",
      "You are now standing inside your own copy of the multiverse.",
      "Kingpin has no idea you were ever here.",
    ],
    xp: 100,
    validate: (raw) => {
      const input = strip(raw);
      if (/^git\s+clone\s+https:\/\/github\.com\/[\w.-]+\/[\w.-]+/i.test(input)) {
        return { ok: true, message: "Cloning parallel universe... 100% — timeline secured." };
      }
      if (/^git\s+clone\s*$/i.test(input)) {
        return {
          ok: false,
          nearMiss: true,
          message: "Clone what, exactly? Give it the HTTPS URL of YOUR fork.",
          };
      }
      if (/^git\s+clone\s+/i.test(input)) {
        return {
          ok: false,
          nearMiss: true,
          message: "Right command, wrong coordinates. The URL must start with https://github.com/",
        };
      }
      if (/^git\s+fork/i.test(input)) {
        return {
          ok: false,
          nearMiss: true,
          message: "'git fork' isn't real. Forking happens on the GitHub website — the button, top-right.",
        };
      }
      return { ok: false, message: "Anomaly detected. Invalid command." };
    },
  },
  {
    id: 2,
    act: 1,
    codename: "WEAVE THE SUIT",
    title: "Build Your Card in HTML & CSS",
    dimension: "EARTH-65",
    villain: "THE SPOT",
    icon: Fingerprint,
    accent: "#FF3B3B",
    lore: [
      "You're inside. But you're a nobody here — no mask, no signal, no file.",
      "Gwen's voice cuts through the static: \"Nobody hands you a suit. Every Spider-Person in this archive wove their own.\"",
      "Two things live in your file now. A JSON record — the raw data the archive indexes you by. And an HTML card — the suit everyone else actually sees.",
      "Copy _template.json for your identity record. Copy _template.html and weave it into a suit nobody else has.",
      "Two rules the loom enforces on the HTML: keep the CSS inside the file, and no JavaScript. Everything else is yours.",
    ],
    objective: "Create spider-society/<your-github-username>.json AND .html — your data and your suit.",
    fieldOps: [
      "Open the cloned folder in VS Code.",
      "Copy spider-society/_template.json, rename to <your-github-username>.json, fill in name/alias/skills/suitColor/githubUsername.",
      "Copy spider-society/_template.html and rename it to <your-github-username>.html",
      "Fill in the four data- attributes at the top of the HTML — they must match your JSON.",
      "Point the avatar <img> at https://github.com/<your-github-username>.png",
      "Now restyle the HTML. Colours, fonts, gradients, borders — go as far as you want.",
      "Preview it in the Suit Weaver on the right, then hit Suit Woven.",
    ],
    expectedDisplay: "weave your card in the Suit Weaver",
    hints: [
      "Right-click the file in VS Code and choose Copy, then Paste, then rename it.",
      "The data- attributes must be filled in — CI rejects the placeholders.",
      "Keep everything inside 320x440. That's the card.",
    ],
    kind: "weave",
    buttonLabel: "SUIT WOVEN",
    troubleshoot: [
      {
        symptom: "My card looks nothing like the preview",
        fix: "You probably wrote CSS outside the <style> block, or targeted body/html. Style .spider-card and things inside it.",
      },
      {
        symptom: "CI says 'still the template placeholder'",
        fix: "One of the data- attributes still says Your Name / Your Spider-Alias / your-github-username. Replace all four.",
      },
      {
        symptom: "My avatar is a broken image",
        fix: "The <img> src still points at your-github-username. Swap in your real username.",
      },
      {
        symptom: "Can I use JavaScript / a CSS framework?",
        fix: "No — HTML and internal CSS only. Cards render in a locked-down frame, so scripts and external files never load.",
      },
      {
        symptom: "My content overflows the card",
        fix: "The card is fixed at 320x440 and hides overflow. Shorten your text or reduce font sizes.",
      },
    ],
    successTitle: "SUIT WOVEN",
    successLines: [
      "Hand-stitched. Not issued.",
      "Nobody else in the archive has that card, because nobody else wrote it.",
      "But it's still only on YOUR machine. Nobody else can see you yet.",
    ],
    xp: 200,
  },
  {
    id: 3,
    act: 1,
    codename: "GATHER WEB FLUID",
    title: "Stage Your Changes",
    dimension: "EARTH-42",
    villain: "THE PROWLER",
    icon: Layers,
    accent: "#C1121F",
    lore: [
      "Alarms. The Prowler is sweeping the drive, one sector at a time.",
      "\"Everything you changed is loose,\" Peter B. says, mouth full. \"Git can't save what it hasn't been shown.\"",
      "Before Git will protect your work, you have to hand it over deliberately. Load it into the web-shooters.",
      "That's STAGING. You're saying: these exact changes — these ones — are the ones I mean.",
      "Load up. He's two sectors away.",
    ],
    objective: "Stage every changed file so Git can see them.",
    fieldOps: [
      "In your real terminal, make sure you're inside the cloned folder.",
      "Run: git status  — your new file shows up in red. That's untracked.",
      "Run: git add .   — the dot means 'everything in this folder'.",
      "Run git status again. Green now. That's staged.",
    ],
    expectedDisplay: "git add .",
    hints: [
      "Three characters after 'git add'. Well — two, plus a dot.",
      "The dot is a wildcard meaning 'all changes right here'.",
      "It's literally: git add .",
    ],
    kind: "terminal",
    successTitle: "WEB-SHOOTERS LOADED",
    successLines: [
      "Changes staged. The Prowler swept an empty sector.",
      "Your file is in the chamber — but it hasn't been fired yet.",
      "Staged is not saved. Not until you commit.",
    ],
    xp: 200,
    validate: (raw) => {
      const input = strip(raw);
      if (/^git\s+add\s+(\.|-A|--all|\*)$/i.test(input)) {
        return { ok: true, message: "Staging all changes... web fluid at capacity." };
      }
      if (/^git\s+add\s+\S+/i.test(input)) {
        return {
          ok: true,
          message: "Specific file staged. Precise. The Society approves — but '.' grabs everything at once.",
        };
      }
      if (/^git\s+add$/i.test(input)) {
        return { ok: false, nearMiss: true, message: "Add WHAT? Try a dot: git add ." };
      }
      if (/^git\s+status$/i.test(input)) {
        return {
          ok: false,
          nearMiss: true,
          message: "Good instinct — status is how you check. But staging needs 'git add .'",
        };
      }
      return { ok: false, message: "Anomaly detected. Invalid command." };
    },
  },
  {
    id: 4,
    act: 1,
    codename: "LOCK THE TIMELINE",
    title: "Commit the Snapshot",
    dimension: "EARTH-928",
    villain: "THE CANON EVENT",
    icon: GitCommitHorizontal,
    accent: "#8E0912",
    lore: [
      "Miguel O'Hara steps out of the dark, and the room gets colder.",
      "\"Staging isn't history,\" he says. \"History is a COMMIT. A permanent, timestamped snapshot with your name burned into it.\"",
      "Every commit carries a message. Not for the machine — for the next person who opens this timeline and asks: what did they do, and why?",
      "Write a bad message and it haunts the archive forever. Write a good one and you're canon.",
      "Say something worth keeping.",
    ],
    objective: "Commit your staged changes with a message in quotes.",
    fieldOps: [
      'Run: git commit -m "Add <your alias> to the Spider-Society"',
      "The -m flag means 'here comes the message'.",
      "The quotes matter. Without them the shell eats your words.",
      "Then type your command into the simulator.",
    ],
    expectedDisplay: 'git commit -m "your message"',
    hints: [
      "Structure: git commit -m then your message inside double quotes.",
      'Example: git commit -m "Add Spider-Byte to the roster"',
      "Empty quotes won't cut it. Miguel will know.",
    ],
    kind: "terminal",
    troubleshoot: [
      {
        symptom: "*** Please tell me who you are",
        fix: "You skipped Chapter 0. Run the two git config --global commands, then commit again.",
      },
      {
        symptom: "My terminal filled with text and won't let me type",
        fix: "You ran bare 'git commit' and Git opened vim. Press Esc, then type :q! and press Enter to escape.",
      },
      {
        symptom: "nothing to commit, working tree clean",
        fix: "You either forgot to save the file in VS Code, or you already committed it. Run git status to see.",
      },
      {
        symptom: "Windows: my quotes look wrong",
        fix: "Use straight double quotes \" \" — not the curly ones a word processor makes.",
      },
    ],
    successTitle: "CANON EVENT SECURED",
    successLines: [
      "Snapshot written to the archive. Hash generated.",
      "Your name is on this timeline permanently now.",
      "One jump left — this history still only exists on your machine.",
    ],
    xp: 250,
    validate: (raw) => {
      const input = raw.trim();
      const quoted = input.match(/^git\s+commit\s+-m\s+(["'])(.*?)\1\s*$/i);
      if (quoted) {
        if (!quoted[2].trim()) {
          return {
            ok: false,
            nearMiss: true,
            message: "An empty message? That's how timelines get lost. Say what you did.",
          };
        }
        return { ok: true, message: `Committing "${quoted[2]}" — snapshot locked into the archive.` };
      }
      if (/^git\s+commit\s+-m\s+\S/i.test(input)) {
        return {
          ok: false,
          nearMiss: true,
          message: "Message needs to be wrapped in quotes: -m \"like this\"",
        };
      }
      if (/^git\s+commit\s*$/i.test(input)) {
        return {
          ok: false,
          nearMiss: true,
          message: "Bare 'git commit' opens a text editor and traps beginners. Use -m \"your message\".",
        };
      }
      return { ok: false, message: "Anomaly detected. Invalid command." };
    },
  },
  {
    id: 5,
    act: 1,
    codename: "OPEN THE PORTAL",
    title: "Push & Pull Request",
    dimension: "EARTH-616",
    villain: "THE VOID",
    icon: Rocket,
    accent: "#FF1E27",
    lore: [
      "Everything you've built is still trapped in one dimension: yours.",
      "PUSH fires your local history up to the cloud — your fork on GitHub finally matches your machine.",
      "Then comes the last move. A PULL REQUEST. A portal opened from your universe to the original, saying: I made something. Let me in.",
      "Someone on the other side reviews it. Approves it. Merges it.",
      "And the moment they do — you exist in the archive. Forever. Shoot your web, Spider-Person.",
    ],
    objective: "Push your commit to your fork, then open the Pull Request.",
    fieldOps: [
      "Run: git push",
      "Refresh your fork on GitHub — your file is there now.",
      "GitHub shows a banner: 'Compare & pull request'. Click it.",
      "Write a title, describe your Spider-ID, and hit Create pull request.",
    ],
    expectedDisplay: "git push",
    hints: [
      "Two words. It's the opposite of pull.",
      "It's just: git push",
      "If Git complains about upstream, use: git push -u origin main",
    ],
    kind: "terminal",
    troubleshoot: [
      {
        symptom: "It's asking for a username and password",
        fix: "GitHub stopped accepting passwords in 2021. Your password will NOT work here — see the next row.",
      },
      {
        symptom: "How do I actually authenticate?",
        fix: "Easiest: install Git Credential Manager (bundled with Git for Windows) — a browser window opens, you click Authorize, done. Otherwise create a Personal Access Token.",
      },
      {
        symptom: "Creating a Personal Access Token (PAT)",
        fix: "GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token → tick 'repo' → copy it. Paste it as the PASSWORD when Git asks. Copy it now — GitHub never shows it again.",
      },
      {
        symptom: "Authentication failed even with my token",
        fix: "Your machine cached the old wrong credentials. Mac: open Keychain Access, search github.com, delete it. Windows: Credential Manager → Windows Credentials → remove git:https://github.com.",
      },
      {
        symptom: "fatal: The current branch has no upstream branch",
        fix: "Run: git push -u origin main  — that links your local branch to the fork, once.",
      },
      {
        symptom: "I pushed but I don't see a PR",
        fix: "Pushing only updates YOUR fork. Go to the original repo on GitHub — a green 'Compare & pull request' banner will be waiting.",
      },
    ],
    successTitle: "PORTAL STABILIZED",
    successLines: [
      "Uploading timeline to Earth-616... connection established.",
      "Your fork now matches your machine. The multiverse can see you.",
      "One thing left. Open the portal.",
    ],
    xp: 400,
    validate: (raw) => {
      const input = strip(raw);
      if (/^git\s+push(\s+.*)?$/i.test(input)) {
        return { ok: true, message: "Firing web-line to origin... portal coordinates locked." };
      }
      if (/^git\s+pull/i.test(input)) {
        return {
          ok: false,
          nearMiss: true,
          message: "Wrong direction. 'pull' brings changes DOWN. You're sending them UP.",
        };
      }
      return { ok: false, message: "Anomaly detected. Invalid command." };
    },
  },
  {
    id: 6,
    act: 2,
    codename: "SPLIT THE TIMELINE",
    title: "Branch & Alter Ego",
    dimension: "EARTH-VENOM",
    villain: "THE SYMBIOTE",
    icon: Split,
    accent: "#B9121B",
    lore: [
      "Something followed you back through the portal.",
      "It got into the archive at 13:58 and it is wearing your file like a coat.",
      "Here is the thing about Git: you do not have to fight it on the main timeline. You can split off a parallel one, let the worst version of you exist there, and decide later which survives.",
      "That split is a BRANCH. Nothing you do on it can touch main.",
      "So make the branch. Then write the villain you would be.",
    ],
    objective: "Branch off, rewrite your Spider-ID as your symbiote self, and commit it.",
    fieldOps: [
      "git checkout -b symbiote   (a parallel timeline, branched off main)",
      "Open YOUR json file again — you are editing the same file, on purpose.",
      'Rewrite "alias" as your VILLAIN name (Venom-Byte, Night-Weaver, whatever fits).',
      'Set "suitColor" to something dark — "#1A1A1A", "#2B0A0A".',
      "Corrupt your 3 skills into their evil versions. Have fun with it.",
      "Save, then stage and commit on this branch.",
    ],
    expectedDisplay: "git checkout -b symbiote",
    hints: ["Start by creating the branch: git checkout -b symbiote"],
    kind: "terminal",
    stages: [
      {
        label: "Split off a parallel timeline",
        expectedDisplay: "git checkout -b symbiote",
        successLine: ">> BRANCH 'symbiote' CREATED. You are no longer on main.",
        hints: [
          "The -b flag means 'make this branch, then move to it'.",
          "Name the branch: symbiote",
          "git checkout -b symbiote",
        ],
        validate: (raw) => {
          const input = strip(raw);
          if (/^git\s+(checkout\s+-b|switch\s+-c)\s+symbiote$/i.test(input)) {
            return { ok: true, message: "Switched to a new branch 'symbiote' — a timeline nobody else can see." };
          }
          if (/^git\s+(checkout\s+-b|switch\s+-c)\s+\S+$/i.test(input)) {
            return { ok: false, nearMiss: true, message: "Right command, but call the branch 'symbiote' so the next steps line up." };
          }
          if (/^git\s+branch\s+symbiote$/i.test(input)) {
            return { ok: false, nearMiss: true, message: "That creates the branch but leaves you standing on main. Use -b to create AND switch." };
          }
          if (/^git\s+checkout\s+symbiote$/i.test(input)) {
            return { ok: false, nearMiss: true, message: "The branch doesn't exist yet — you need -b to make it." };
          }
          return { ok: false, message: "Anomaly detected. Invalid command." };
        },
      },
      {
        label: "Stage the corruption",
        expectedDisplay: "git add .",
        successLine: ">> SYMBIOTE DNA STAGED.",
        hints: ["Same as Chapter 3.", "git add ."],
        validate: (raw) => {
          const input = strip(raw);
          if (/^git\s+add\s+(\.|-A|--all|\S+)$/i.test(input)) {
            return { ok: true, message: "Staged. The dark version of you is loaded." };
          }
          return { ok: false, message: "Anomaly detected. Stage your changes first." };
        },
      },
      {
        label: "Commit the alter ego",
        expectedDisplay: 'git commit -m "your message"',
        successLine: ">> ALTER EGO COMMITTED TO THE BRANCH.",
        hints: [
          'Same shape as Chapter 4: git commit -m "..."',
          'Try: git commit -m "Symbiote takeover"',
        ],
        validate: (raw) => {
          const m = raw.trim().match(/^git\s+commit\s+-m\s+(["'])(.*?)\1\s*$/i);
          if (m && m[2].trim()) {
            return { ok: true, message: `Committed "${m[2]}" to branch symbiote. Two versions of you now exist.` };
          }
          if (m) return { ok: false, nearMiss: true, message: "Give it a real message." };
          return { ok: false, nearMiss: true, message: 'Quotes and the -m flag: git commit -m "Symbiote takeover"' };
        },
      },
    ],
    troubleshoot: [
      {
        symptom: "error: pathspec 'symbiote' did not match",
        fix: "You forgot the -b flag. Use: git checkout -b symbiote",
      },
      {
        symptom: "Which branch am I on?",
        fix: "Run: git branch  — the one with a * beside it is where you are. Press q to exit if it pages.",
      },
    ],
    successTitle: "TWO OF YOU EXIST",
    successLines: [
      "Branch 'symbiote' holds your dark timeline.",
      "Branch 'main' still holds the original.",
      "Neither one knows about the other yet. That's about to be a problem.",
    ],
    xp: 250,
  },
  {
    id: 7,
    act: 2,
    codename: "COLLIDE THE TIMELINES",
    title: "Merge & Conflict",
    dimension: "EARTH-616",
    villain: "PARADOX",
    icon: GitMerge,
    accent: "#FF2A2A",
    lore: [
      "Go back to main. The original you is still standing there, unchanged.",
      "Except you have been busy. On main, you are about to write your UPGRADED form — the version that beat the symbiote.",
      "Then you are going to slam the two timelines together with a MERGE.",
      "Git will handle almost all of it alone. But when both timelines rewrote the exact same line, it stops and refuses to guess.",
      "That refusal is a merge conflict. It is not an error. It is Git saying: only you know who you really are.",
    ],
    objective: "Return to main, write your upgraded form, commit it, then merge the symbiote.",
    fieldOps: [
      "git checkout main   (back to the original timeline)",
      "Open your json file — it looks untouched. That is branching working.",
      'Now write your UPGRADED hero: a stronger alias, a brighter suitColor, evolved skills.',
      "Stage and commit it on main.",
      "Then: git merge symbiote",
      "Git WILL report a conflict. That is the point. Do not panic.",
    ],
    expectedDisplay: "git checkout main",
    hints: ["Get back to main first: git checkout main"],
    kind: "terminal",
    stages: [
      {
        label: "Return to the main timeline",
        expectedDisplay: "git checkout main",
        successLine: ">> BACK ON MAIN. Your file looks untouched — that's branching working.",
        hints: [
          "Same command, no -b this time — the branch already exists.",
          "git checkout main",
          "If your default branch is called master, use that instead.",
        ],
        validate: (raw) => {
          const input = strip(raw);
          if (/^git\s+(checkout|switch)\s+(main|master)$/i.test(input)) {
            return { ok: true, message: "Switched to branch 'main'. The symbiote edits vanished — they live on the other branch." };
          }
          if (/^git\s+(checkout|switch)\s+-b\s+(main|master)$/i.test(input)) {
            return { ok: false, nearMiss: true, message: "No -b — main already exists. You're moving to it, not creating it." };
          }
          return { ok: false, message: "Anomaly detected. Invalid command." };
        },
      },
      {
        label: "Commit your upgraded form",
        expectedDisplay: 'git commit -m "your message"',
        successLine: ">> UPGRADED FORM COMMITTED TO MAIN.",
        hints: [
          "Edit your file first, then git add . and commit.",
          'git commit -m "Upgraded form"',
        ],
        validate: (raw) => {
          const input = raw.trim();
          if (/^git\s+add\s+/i.test(input)) {
            return { ok: false, nearMiss: true, message: "Staged — good. Now commit it with a message." };
          }
          const m = input.match(/^git\s+commit\s+-m\s+(["'])(.*?)\1\s*$/i);
          if (m && m[2].trim()) {
            return { ok: true, message: `Committed "${m[2]}" to main. Both timelines have now changed the same line.` };
          }
          return { ok: false, nearMiss: true, message: 'Commit with a message: git commit -m "Upgraded form"' };
        },
      },
      {
        label: "Slam them together",
        expectedDisplay: "git merge symbiote",
        successLine: ">> !! CONFLICT !! Both timelines rewrote the same line. Git will not guess.",
        hints: [
          "You're merging the symbiote branch INTO main, so name the branch you're pulling in.",
          "git merge symbiote",
        ],
        validate: (raw) => {
          const input = strip(raw);
          if (/^git\s+merge\s+symbiote$/i.test(input)) {
            return {
              ok: true,
              message: "Auto-merging your Spider-ID... CONFLICT (content): merge failed. Exactly as planned.",
            };
          }
          if (/^git\s+merge\s+(main|master)$/i.test(input)) {
            return { ok: false, nearMiss: true, message: "Backwards — you're standing ON main. Merge symbiote into it." };
          }
          if (/^git\s+merge$/i.test(input)) {
            return { ok: false, nearMiss: true, message: "Merge what? Name the branch: git merge symbiote" };
          }
          return { ok: false, message: "Anomaly detected. Invalid command." };
        },
      },
    ],
    troubleshoot: [
      {
        symptom: "error: Your local changes would be overwritten",
        fix: "You have unsaved-but-modified work. Commit it first — same git add . then git commit -m \"...\" you already know — then try the merge again.",
      },
      {
        symptom: "Merge said 'Already up to date'",
        fix: "You didn't commit your upgraded form on main. Both branches must actually differ to conflict.",
      },
      {
        symptom: "It merged with no conflict!",
        fix: "You edited different lines on each branch. Redo it changing the SAME line — the alias — on both.",
      },
      {
        symptom: "error: pathspec 'main' did not match",
        fix: "Your default branch is called master. Use: git checkout master",
      },
    ],
    successTitle: "PARADOX DETECTED",
    successLines: [
      "CONFLICT: both timelines rewrote your identity.",
      "Git has stopped and put the two versions side by side inside your file.",
      "Nothing is broken. Nothing is lost. It is waiting for a decision.",
    ],
    xp: 300,
  },
  {
    id: 8,
    act: 2,
    codename: "PURGE THE SYMBIOTE",
    title: "Resolve the Conflict",
    dimension: "THE BELL TOWER",
    villain: "YOURSELF",
    icon: Biohazard,
    accent: "#6E0710",
    lore: [
      "Open your file. It does not look like JSON any more.",
      "Git has stacked both versions inside it and fenced them with markers: <<<<<<< then ======= then >>>>>>>.",
      "Above the ======= is HEAD — the version on main, your upgraded form. Below it is the incoming symbiote.",
      "The markers are not code. They are Git talking to you, and they must be deleted.",
      "Practise here first. Get it wrong as many times as you like — this simulator cannot break your repo.",
    ],
    objective: "Delete the markers and leave one valid identity behind.",
    fieldOps: [
      "Resolve it in the simulator on the right until it goes green.",
      "Then open your real file and do exactly the same thing.",
      "Delete all three marker lines: <<<<<<<, =======, >>>>>>>",
      "Keep ONE alias, ONE suitColor, ONE set of 3 skills.",
      "Best answer: fuse them. Hero name, one skill you stole from the symbiote.",
      "Make sure the file is still valid JSON — commas and braces intact.",
    ],
    expectedDisplay: "resolve the conflict in the forge",
    hints: [
      "Delete the three marker lines entirely.",
      "You may keep either side, or write something new that combines both.",
      "When it parses as valid JSON with no markers left, it turns green.",
    ],
    kind: "conflict",
    successTitle: "SYMBIOTE PURGED",
    successLines: [
      "Markers gone. One identity left standing.",
      "You just did the thing that scares senior engineers.",
      "Now do it in your real file, and seal it.",
    ],
    xp: 400,
  },
  {
    id: 9,
    act: 2,
    codename: "SEAL THE TIMELINE",
    title: "Commit the Merge & Push",
    dimension: "EARTH-1610",
    villain: "THE VOID",
    icon: ShieldCheck,
    accent: "#E62429",
    lore: [
      "A resolved conflict is not finished until you tell Git you resolved it.",
      "Staging the file is how you say: I looked at this, I decided, it is done.",
      "Then one more commit seals the merge into history — permanently, with both timelines folded into one.",
      "Push it, and the Pull Request you opened this morning updates itself. You do not open a new one.",
      "That is the part nobody expects. A PR is alive.",
    ],
    objective: "Stage the resolved file, commit the merge, and push.",
    fieldOps: [
      "git add .    (this is how you mark a conflict as resolved)",
      'git commit -m "Purge the symbiote"',
      "git push",
      "Open your PR on GitHub — the new commits are already on it.",
    ],
    expectedDisplay: "git add .",
    hints: ["Mark it resolved: git add ."],
    kind: "terminal",
    stages: [
      {
        label: "Mark the conflict resolved",
        expectedDisplay: "git add .",
        successLine: ">> RESOLUTION ACCEPTED.",
        hints: [
          "Staging a conflicted file is how you declare it fixed.",
          "git add .",
        ],
        validate: (raw) => {
          const input = strip(raw);
          if (/^git\s+add\s+(\.|-A|--all|\S+)$/i.test(input)) {
            return { ok: true, message: "Conflict marked resolved. Git trusts your decision." };
          }
          return { ok: false, nearMiss: true, message: "Stage it to declare the conflict resolved: git add ." };
        },
      },
      {
        label: "Seal the merge",
        expectedDisplay: 'git commit -m "your message"',
        successLine: ">> MERGE COMMIT WRITTEN. Both timelines are now one.",
        hints: [
          'git commit -m "Purge the symbiote"',
          "A merge commit is the knot where two histories tie together.",
        ],
        validate: (raw) => {
          const m = raw.trim().match(/^git\s+commit\s+-m\s+(["'])(.*?)\1\s*$/i);
          if (m && m[2].trim()) {
            return { ok: true, message: `Merge commit "${m[2]}" written. Two histories, one timeline.` };
          }
          return { ok: false, nearMiss: true, message: 'Commit with a message: git commit -m "Purge the symbiote"' };
        },
      },
      {
        label: "Send it back to the cloud",
        expectedDisplay: "git push",
        successLine: ">> PUSHED. Your Pull Request just updated itself.",
        hints: ["Same as Chapter 5.", "git push"],
        validate: (raw) => {
          const input = strip(raw);
          if (/^git\s+push(\s+.*)?$/i.test(input)) {
            return { ok: true, message: "Pushing merged timeline... your existing PR now shows the new commits." };
          }
          return { ok: false, nearMiss: true, message: "Send it up: git push" };
        },
      },
    ],
    troubleshoot: [
      {
        symptom: "error: Committing is not possible because you have unmerged files",
        fix: "You resolved the file but forgot to stage it. Run git add . then commit.",
      },
      {
        symptom: "Vim opened again on the merge commit",
        fix: "Git pre-fills merge messages. Press Esc then :wq and Enter to accept it.",
      },
      {
        symptom: "Do I open a second Pull Request?",
        fix: "No. Pushing updates the PR you already opened — refresh it and your new commits are there.",
      },
    ],
    successTitle: "TIMELINE SEALED",
    successLines: [
      "Merge pushed. Your Pull Request updated itself — no second PR needed.",
      "You branched, you collided, you resolved, you sealed.",
      "One more thing, if you want it — the archive never really closes.",
    ],
    xp: 350,
  },
  {
    id: 10,
    act: 2,
    codename: "ONE MORE WEB-SHOT",
    title: "Leave Your Mark",
    dimension: "EARTH-1610",
    villain: "THE ENCORE",
    icon: Sparkles,
    accent: "#FF3B3B",
    lore: [
      "The symbiote is purged. The timeline is sealed. Most people would stop here.",
      "But Gwen catches you before you close the laptop: \"You know the archive lets you keep going, right? One more pass, whenever you want.\"",
      "Nothing new to learn. Just the same three moves you've already got cold — stage it, commit it, send it — one more time, on something that's purely yours.",
      "Go back into your card. Add one small flourish that says you survived today: a badge, a ribbon, a line of text, a glow — whatever feels like a victory lap.",
      "Then stage it, commit it, push it. Exactly like Chapter 3, 4, and 5. You already know how.",
    ],
    objective: "Add a small victory flourish to your card, then stage, commit, and push it — same commands as before.",
    fieldOps: [
      "Open your <username>.html in VS Code.",
      "Add something small and yours: a badge, a corner ribbon, an extra line, a glow effect — pure CSS, no new rules beyond what Chapter 2 already had.",
      "Save the file.",
      "Run: git add .",
      "Run: git commit -m \"Add a victory flourish\"",
      "Run: git push",
    ],
    expectedDisplay: "git add .",
    hints: [
      "Same three commands as Chapters 3, 4, and 5 — nothing new here.",
      "Not sure what to add? A small \"⚡ Verified\" tag in a corner is enough.",
      "git add .  →  git commit -m \"...\"  →  git push",
    ],
    kind: "terminal",
    stages: [
      {
        label: "Stage the flourish",
        expectedDisplay: "git add .",
        successLine: ">> FLOURISH STAGED.",
        hints: ["Same as Chapter 3: git add ."],
        validate: (raw) => {
          const input = strip(raw);
          if (/^git\s+add\s+(\.|-A|--all|\S+)$/i.test(input)) {
            return { ok: true, message: "Staged. One more snapshot coming up." };
          }
          return { ok: false, message: "Anomaly detected. Invalid command." };
        },
      },
      {
        label: "Commit it",
        expectedDisplay: 'git commit -m "your message"',
        successLine: ">> FLOURISH COMMITTED.",
        hints: ['Same as Chapter 4: git commit -m "..."'],
        validate: (raw) => {
          const m = raw.trim().match(/^git\s+commit\s+-m\s+(["'])(.*?)\1\s*$/i);
          if (m && m[2].trim()) {
            return { ok: true, message: `Committed "${m[2]}" — a small, permanent, extra flex.` };
          }
          return { ok: false, nearMiss: true, message: 'Commit with a message: git commit -m "Add a victory flourish"' };
        },
      },
      {
        label: "Send it up",
        expectedDisplay: "git push",
        successLine: ">> BROADCAST. Your existing Pull Request just got a little better.",
        hints: ["Same as Chapter 5: git push"],
        validate: (raw) => {
          const input = strip(raw);
          if (/^git\s+push(\s+.*)?$/i.test(input)) {
            return { ok: true, message: "Pushed. Same PR, a little more you in it." };
          }
          return { ok: false, nearMiss: true, message: "Send it up: git push" };
        },
      },
    ],
    troubleshoot: [
      {
        symptom: "I don't know what to add",
        fix: "Keep it tiny — a corner badge, a border glow, a one-line tagline. The point is the commit cycle, not the design.",
      },
      {
        symptom: "nothing to commit, working tree clean",
        fix: "You didn't save the file after editing it in VS Code, or you're editing a different file than the one you pushed this morning.",
      },
    ],
    successTitle: "YOU LEFT YOUR MARK",
    successLines: [
      "Fork, weave, stage, commit, push, branch, merge, resolve, seal — and now, once more, just because you could.",
      "That loop — stage it, commit it, send it — is the one you'll run a thousand times as an engineer. You've got it now.",
    ],
    xp: 250,
  },
];

/** Every level as a stage list, so the terminal has one code path. */
export function getStages(level: Level): Stage[] {
  if (level.stages?.length) return level.stages;
  return [
    {
      label: level.title,
      expectedDisplay: level.expectedDisplay,
      hints: level.hints,
      successLine: ">> ACCESS GRANTED. TIMELINE SECURED.",
      validate: level.validate ?? (() => ({ ok: false, message: "Anomaly detected." })),
    },
  ];
}

export const ACT_ONE = LEVELS.filter((l) => l.act === 1);
export const ACT_TWO = LEVELS.filter((l) => l.act === 2);

/**
 * Pulls the runnable command out of a Field Ops line so it can be copied.
 * Lines read like `git checkout -b symbiote   (a parallel timeline)` — we want
 * only the command, never the prose after it.
 */
export function extractCommand(line: string): string | null {
  // Not anchored to the start of the line — several Field Ops lines lead with
  // prose ("Set your name: git config …", "Check it worked: git --version")
  // and the command still deserves a copy button.
  const m = line.match(/\b(git|xcode-select|cd|npm)\s[^(]*/);
  if (!m) return null;
  const cmd = m[0].trim().replace(/[.,;:]$/, "");
  return cmd.length > 3 ? cmd : null;
}

/**
 * Swaps placeholder tokens for the student's real details. Beginners do
 * literally type `<your-github-username>.json`, so showing their actual
 * filename removes a whole support category.
 */
export function personalize(text: string, username: string, alias: string): string {
  let out = text;
  if (username) {
    out = out
      .replace(/<your-github-username>/g, username)
      .replace(/your-github-username/g, username)
      .replace(/<your-username>/g, username)
      .replace(/<my-github-username>/g, username);
  }
  if (alias) out = out.replace(/<your alias>/g, alias);
  return out;
}

export const TOTAL_XP = LEVELS.reduce((sum, level) => sum + level.xp, 0);
