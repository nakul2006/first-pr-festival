"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import { SpiderEmblem, SpiderMask } from "@/components/SpiderArt";
import { useEffect, useMemo, useState } from "react";
import { PR_URL } from "@/data/levels";
import { useGame } from "@/context/GameContext";

/** Deterministic-ish confetti so the render is cheap and doesn't thrash. */
function useConfetti(count: number) {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.6,
        duration: 2.6 + Math.random() * 2.2,
        color: ["#E62429", "#FF3B3B", "#E8E6E3", "#8E0912", "#C1121F"][i % 5],
        size: 5 + Math.random() * 7,
      })),
    [count],
  );
}

/** Framer's confetti loop is JS-driven, so the CSS media query can't reach it. */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export default function VictoryOverlay() {
  const reducedMotion = usePrefersReducedMotion();
  const { xp, attempts, startedAt, finishedAt, alias } = useGame();
  const [open, setOpen] = useState(true);
  const confetti = useConfetti(70);

  const elapsed =
    startedAt && finishedAt
      ? (() => {
          const secs = Math.max(1, Math.round((finishedAt - startedAt) / 1000));
          return `${Math.floor(secs / 60)}m ${secs % 60}s`;
        })()
      : "—";

  return (
    <AnimatePresence>
      {open && (
        <div className="fade-in fixed inset-0 z-50 grid place-items-center bg-black/92 p-4 backdrop-blur-sm">
          {/* Confetti */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            {!reducedMotion &&
              confetti.map((c) => (
              <motion.span
                key={c.id}
                initial={{ y: -40, opacity: 0, rotate: 0 }}
                animate={{ y: "105vh", opacity: [0, 1, 1, 0], rotate: 540 }}
                transition={{
                  duration: c.duration,
                  delay: c.delay,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute rounded-sm"
                style={{
                  left: `${c.left}%`,
                  width: c.size,
                  height: c.size * 1.6,
                  background: c.color,
                  }}
                />
              ))}
          </div>

          <div
            className="pop-in relative w-full max-w-lg rounded-2xl border border-web-red/45 bg-ink-900 p-8 text-center shadow-[0_0_100px_-20px_rgba(230,36,41,0.9)]"
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 text-silk-faint transition hover:text-silk"
            >
              <X className="h-5 w-5" />
            </button>

            <SpiderMask className="animate-spider-dangle mx-auto h-28 w-28 drop-shadow-[0_0_30px_rgba(230,36,41,0.7)]" />
            <h2 className="mt-4 font-display text-4xl uppercase leading-none tracking-wide text-silk sm:text-5xl">
              {alias ? `${alias} is Canon` : "You're Canon Now"}
            </h2>
            <p className="mt-3 text-sm text-silk-dim">
              Eleven chapters. You forked, wove a suit by hand, staged, committed, pushed,
              branched, collided, and resolved a merge conflict yourself. One Pull Request
              carries all of it.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { label: "Web fluid", value: xp, color: "#E62429" },
                { label: "Misses", value: attempts, color: "#FF3B3B" },
                { label: "Time", value: elapsed, color: "#E8E6E3" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/10 bg-white/[0.03] py-3">
                  <p className="font-display text-2xl" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-silk-faint">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <a
              href={PR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-web-scarlet via-web-red to-web-blood px-6 py-4 font-display text-xl uppercase tracking-wider text-white transition hover:brightness-110"
            >
              Open the Portal (Submit PR) <ExternalLink className="h-5 w-5" />
            </a>
            <p className="mt-3 font-mono text-[11px] text-silk-faint">
              Once a maintainer merges it, your Spider-ID appears on the live roster.
            </p>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
