import type { Metadata } from "next";
import Link from "next/link";
import { SpiderEmblem, WebCorner } from "@/components/SpiderArt";

export const metadata: Metadata = {
  title: "Git-Verse Command Reference | First PR Festival",
  description: "A flat glossary of every Git command used today. What each one does — not when to use it.",
};

/**
 * Deliberately NOT generated from data/levels.ts. A per-chapter breakdown
 * doubles as an answer key (objective + exact command, chapter by chapter).
 * This is a flat glossary instead: what a command does, never which puzzle
 * it solves or in what order. Figuring out where each one applies is the
 * point of the game.
 */
const COMMANDS: { cmd: string; does: string }[] = [
  { cmd: "git --version", does: "Prints the installed Git version." },
  { cmd: 'git config --global user.name "..."', does: "Sets the name attached to every commit you make." },
  { cmd: 'git config --global user.email "..."', does: "Sets the email attached to every commit you make." },
  { cmd: "git clone <url>", does: "Downloads a copy of a repository onto your machine." },
  { cmd: "git status", does: "Shows what's changed, what's staged, and what branch you're on." },
  { cmd: "git add <file>", does: "Stages a specific file's changes." },
  { cmd: "git add .", does: "Stages every changed file in the current folder." },
  { cmd: 'git commit -m "message"', does: "Saves a permanent snapshot of everything currently staged." },
  { cmd: "git push", does: "Uploads your local commits to the remote repository." },
  { cmd: "git branch", does: "Lists your branches. The one with * is where you are." },
  { cmd: "git checkout <branch>", does: "Switches to a branch that already exists." },
  { cmd: "git checkout -b <branch>", does: "Creates a new branch and switches to it in one step." },
  { cmd: "git merge <branch>", does: "Combines another branch's history into the one you're on." },
];

export default function CheatSheet() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10 print:max-w-none print:px-0 print:py-0">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 print:hidden">
        <WebCorner className="absolute -left-16 -top-16 h-[36rem] w-[36rem]" opacity={0.4} />
      </div>

      <header className="mb-8 flex items-start justify-between gap-6 border-b-2 border-web-red/50 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <SpiderEmblem className="h-8 w-8 text-web-red" color="currentColor" />
            <h1 className="font-display text-3xl uppercase leading-none tracking-wide text-silk print:text-black sm:text-4xl">
              Command Reference
            </h1>
          </div>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-silk-dim print:text-neutral-600">
            First PR Festival : Intro to Github and Open Source
          </p>
        </div>
        <div className="flex shrink-0 gap-2 print:hidden">
          <Link
            href="/game"
            className="rounded-md border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-silk-dim transition hover:border-web-red/60 hover:text-web-scarlet"
          >
            Back to game
          </Link>
        </div>
      </header>

      <p className="mb-6 text-sm text-silk/70 print:text-neutral-700">
        Every command used today, what it does — nothing about which chapter needs it or in what
        order. That part's yours to work out.
      </p>

      <ul className="space-y-2">
        {COMMANDS.map(({ cmd, does }) => (
          <li
            key={cmd}
            className="flex flex-col gap-1 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 print:border-neutral-300 print:bg-white sm:flex-row sm:items-baseline sm:gap-4"
          >
            <code className="shrink-0 rounded bg-black/50 px-2 py-0.5 font-mono text-[13px] text-web-scarlet print:bg-neutral-100 print:text-black sm:min-w-[280px]">
              {cmd}
            </code>
            <span className="text-sm text-silk/75 print:text-neutral-700">{does}</span>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-silk-faint print:text-neutral-500">
        With great power comes great responsibility — not root access.
      </p>
    </main>
  );
}
