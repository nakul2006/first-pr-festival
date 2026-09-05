"use client";

import { motion } from "framer-motion";
import { Lock, NotebookText, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import Link from "next/link";
import { SpiderEmblem } from "@/components/SpiderArt";
import { LEVELS } from "@/data/levels";
import { useGame } from "@/context/GameContext";

export default function GameHud() {
  const {
    currentLevel,
    isLevelUnlocked,
    xp,
    totalXp,
    progress,
    attempts,
    alias,
    soundOn,
    toggleSound,
    resetGame,
  } = useGame();

  return (
    <header className="relative shrink-0 border-b border-web-red/25 bg-black/70 backdrop-blur">
      <div className="pointer-events-none absolute inset-0 suit-weave opacity-40" />
      <div className="relative mx-auto flex max-w-[1700px] flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <SpiderEmblem
            className="animate-spider-dangle h-7 w-7 text-web-red transition group-hover:text-web-scarlet"
            color="currentColor"
          />
          <span className="font-display text-xl uppercase tracking-[0.12em] text-silk transition group-hover:text-web-scarlet">
            Into the Git-Verse
          </span>
          {alias && (
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-web-scarlet lg:inline">
              · {alias}
            </span>
          )}
        </Link>

        <nav aria-label="Chapters" className="flex items-center gap-1.5">
          {LEVELS.map((lvl, i) => {
            const actBreak = i > 0 && lvl.act !== LEVELS[i - 1].act;
            const done = lvl.id < currentLevel || (lvl.id === currentLevel && isLevelUnlocked);
            const active = lvl.id === currentLevel;
            return (
              <div
                key={lvl.id}
                title={`Ch ${lvl.id} — ${lvl.codename}`}
                className={`relative grid h-8 w-8 place-items-center rounded-md border font-mono text-xs transition ${
                  actBreak ? "ml-4 before:absolute before:-left-2.5 before:h-6 before:w-px before:bg-web-red/40" : ""
                }`}
                style={{
                  borderColor: done ? "#E6242999" : active ? "#E62429" : "#ffffff1a",
                  background: done ? "#E6242926" : active ? "#E6242933" : "transparent",
                  color: done ? "#FF3B3B" : active ? "#E8E6E3" : "#5A5A66",
                  boxShadow: active ? "0 0 20px -4px #E62429" : undefined,
                }}
              >
                {lvl.id > currentLevel ? <Lock className="h-3.5 w-3.5" /> : lvl.id}
                {active && (
                  <motion.span
                    layoutId="chapter-pulse"
                    className="absolute -bottom-1 h-1 w-1 rounded-full bg-web-red"
                  />
                )}
              </div>
            );
          })}
        </nav>

        {/* Web-fluid gauge */}
        <div className="flex min-w-[180px] flex-1 items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full border border-white/10 bg-black/60">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-web-blood via-web-red to-web-scarlet"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 90, damping: 18 }}
            />
          </div>
          <span className="flex items-center gap-1 font-mono text-xs tabular-nums text-web-scarlet">
            <Zap className="h-3.5 w-3.5" />
            {xp}
            <span className="text-silk-faint">/{totalXp}</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span
            className="hidden font-mono text-[11px] uppercase tracking-widest tabular-nums text-silk-faint md:inline"
            title="Missed web-lines — everyone misses the first one"
          >
            {attempts} misses
          </span>
          <button
            onClick={toggleSound}
            aria-pressed={soundOn}
            title={soundOn ? "Sound on" : "Sound off"}
            className="rounded-md border border-white/10 p-1.5 text-silk-faint transition hover:border-web-red/60 hover:text-web-scarlet"
          >
            {soundOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          </button>
          <Link
            href="/cheatsheet"
            className="flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-silk-faint transition hover:border-web-red/60 hover:text-web-scarlet"
          >
            <NotebookText className="h-3 w-3" /> Cheat sheet
          </Link>
          <button
            onClick={() => {
              if (confirm("Reset all progress and restart from Chapter 0?")) resetGame();
            }}
            className="flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-silk-faint transition hover:border-web-red/60 hover:text-web-scarlet"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>
      </div>
    </header>
  );
}
