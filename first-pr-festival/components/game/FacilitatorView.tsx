"use client";

import { ArrowLeft, ArrowRight, MonitorX } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SpiderEmblem, WebCorner } from "@/components/SpiderArt";
import { getStages, LEVELS } from "@/data/levels";

/**
 * Projector view: one chapter's story at a time, at a size readable from the
 * back of a room. Arrow keys advance it. No game state, no progress — this is
 * for the person at the front, not the students.
 */
export default function FacilitatorView() {
  const [index, setIndex] = useState(0);
  const level = LEVELS[index];
  const Icon = level.icon;

  const go = useCallback((delta: number) => {
    setIndex((i) => Math.min(LEVELS.length - 1, Math.max(0, i + delta)));
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") go(1);
      if (e.key === "ArrowLeft") go(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const commands = getStages(level)
    .map((s) => s.expectedDisplay)
    .filter((c) => !c.startsWith("no command") && !c.startsWith("resolve"));

  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-ink text-silk">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 suit-weave opacity-50" />
        <WebCorner className="absolute -left-16 -top-16 h-[44rem] w-[44rem]" opacity={0.5} />
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            background: `radial-gradient(1100px circle at 50% 0%, ${level.accent}22, transparent 65%)`,
          }}
        />
      </div>

      <header className="flex items-center gap-4 border-b border-web-red/25 px-8 py-4">
        <SpiderEmblem className="h-7 w-7 text-web-red" color="currentColor" />
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-silk-dim">
          Facilitator view
        </span>
        <span className="ml-auto font-mono text-xs uppercase tracking-[0.3em] text-silk-faint">
          ← → to move
        </span>
        <Link
          href="/game"
          className="flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-silk-dim transition hover:border-web-red/60 hover:text-web-scarlet"
        >
          <MonitorX className="h-3 w-3" /> Exit
        </Link>
      </header>

      <main key={level.id} className="swing-in mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-8 py-10">
        <p className="flex flex-wrap items-center gap-x-6 font-mono text-sm uppercase tracking-[0.3em] text-silk-dim">
          <span>
            Act {level.act} · Chapter {level.id}
          </span>
          <span className="text-web-scarlet">{level.villain}</span>
          <span>{level.dimension}</span>
        </p>

        <div className="mt-4 flex items-center gap-6">
          <Icon className="h-14 w-14 shrink-0" style={{ color: level.accent }} />
          <h1
            className="font-display text-6xl uppercase leading-[0.9] tracking-wide text-silk sm:text-8xl"
            style={{ textShadow: `4px 0 ${level.accent}, -4px 0 rgba(232,230,227,0.35)` }}
          >
            {level.codename}
          </h1>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-5 border-l-4 pl-6" style={{ borderColor: level.accent }}>
            {level.lore.map((line, i) => (
              <p
                key={line}
                style={{ animationDelay: `${120 + i * 110}ms` }}
                className={
                  i === 0
                    ? "reveal-up font-display text-3xl uppercase tracking-wide text-silk"
                    : "reveal-up text-xl leading-relaxed text-silk/80"
                }
              >
                {line}
              </p>
            ))}
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-web-scarlet">
              Objective
            </p>
            <p className="mt-2 text-2xl leading-snug text-silk">{level.objective}</p>

            {commands.length > 0 && (
              <div className="mt-8 space-y-2">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-silk-faint">
                  Commands
                </p>
                {commands.map((cmd) => (
                  <code
                    key={cmd}
                    className="block rounded-lg border border-web-red/30 bg-black/60 px-4 py-3 font-mono text-lg text-web-scarlet [overflow-wrap:anywhere]"
                  >
                    {cmd}
                  </code>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="flex items-center gap-4 border-t border-white/10 px-8 py-4">
        <button
          onClick={() => go(-1)}
          disabled={index === 0}
          className="flex items-center gap-2 rounded-lg border border-white/15 px-5 py-2.5 font-display text-lg uppercase tracking-wider text-silk transition hover:border-web-red disabled:opacity-30"
        >
          <ArrowLeft className="h-4 w-4" /> Prev
        </button>
        <div className="flex flex-1 justify-center gap-1.5">
          {LEVELS.map((l, i) => (
            <button
              key={l.id}
              onClick={() => setIndex(i)}
              aria-label={`Chapter ${l.id}`}
              className="h-2 flex-1 max-w-[60px] rounded-full transition"
              style={{ background: i === index ? level.accent : "#26262F" }}
            />
          ))}
        </div>
        <button
          onClick={() => go(1)}
          disabled={index === LEVELS.length - 1}
          className="flex items-center gap-2 rounded-lg border border-white/15 px-5 py-2.5 font-display text-lg uppercase tracking-wider text-silk transition hover:border-web-red disabled:opacity-30"
        >
          Next <ArrowRight className="h-4 w-4" />
        </button>
      </footer>
    </div>
  );
}
