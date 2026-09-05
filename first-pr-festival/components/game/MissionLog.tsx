"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  LifeBuoy,
  Radio,
  Skull,
  Target,
} from "lucide-react";
import { WebCorner } from "@/components/SpiderArt";
import { personalize, PR_URL, REPO_URL } from "@/data/levels";
import { useGame } from "@/context/GameContext";

/** Sporadic flicker — an unstable portal, not a strobe. */
const flicker = {
  animate: { opacity: [1, 1, 0.82, 1, 0.94, 1] },
  transition: { duration: 0.5, repeat: Infinity, repeatDelay: 5.5, ease: "easeInOut" as const },
};

export default function MissionLog() {
  const {
    level,
    stage,
    stageIndex,
    stageCount,
    isLevelUnlocked,
    isComplete,
    advanceLevel,
    completeLevel,
    alias,
    githubUsername,
  } = useGame();
  const say = (text: string) => personalize(text, githubUsername, alias);
  const Icon = level.icon;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-web-red/30 bg-ink-900/85 shadow-[0_0_80px_-30px_rgba(230,36,41,0.85)]">
      {/* Comic-panel header */}
      <div
        className="relative shrink-0 overflow-hidden border-b-2 border-web-red/40 px-6 py-5"
        style={{ background: `linear-gradient(120deg, ${level.accent}22, transparent 70%)` }}
      >
        <div className="pointer-events-none absolute inset-0 halftone opacity-30" />
        <WebCorner
          className="pointer-events-none absolute -left-6 -top-6 h-40 w-40"
          opacity={0.5}
          rings={5}
          spokes={7}
        />
        {/* Oversized chapter numeral, bled off the panel edge like a comic page */}
        <span
          aria-hidden
          className="pointer-events-none absolute -right-2 -top-8 select-none font-display text-[9rem] leading-none text-silk/[0.06]"
        >
          {level.id}
        </span>
        <div className="relative flex items-start gap-4">
          <div
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border"
            style={{
              borderColor: `${level.accent}80`,
              background: `${level.accent}1A`,
              boxShadow: `0 0 24px ${level.accent}55`,
            }}
          >
            <Icon className="h-6 w-6" style={{ color: level.accent }} />
          </div>
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.25em] text-silk-dim">
              <span>
                Act {level.act} · Chapter {level.id}
              </span>
              <span className="flex items-center gap-1 text-web-scarlet">
                <Skull className="h-3 w-3" /> {level.villain}
              </span>
              <span className="flex items-center gap-1 text-silk-dim">
                <Radio className="h-3 w-3" /> {level.dimension}
              </span>
            </p>
            <motion.h2
              {...flicker}
              className="mt-1 font-display text-4xl font-black uppercase leading-[0.85] tracking-[0.02em] text-silk sm:text-5xl"
              style={{ textShadow: `2px 0 ${level.accent}, -2px 0 rgba(232,230,227,0.55)` }}
            >
              {level.codename}
            </motion.h2>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-silk-faint">
              {level.title}
            </p>
          </div>
        </div>
      </div>

      {/* Sliding narrative body */}
      <div className="scroll-slim relative overflow-x-hidden px-6 py-5 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        {/* Keyed on level.id so each chapter slides in fresh. CSS-driven for the
            same reason as the lore lines: an AnimatePresence exit that stalls
            would block the next chapter from mounting at all. */}
        <div key={level.id} className="swing-in">
            <div className="space-y-3 border-l-2 pl-4" style={{ borderColor: `${level.accent}66` }}>
              {level.lore.map((line, i) => (
                <p
                  key={line}
                  style={{ animationDelay: `${150 + i * 120}ms` }}
                  className={`reveal-up ${
                    i === 0
                      ? "font-display text-lg uppercase tracking-wide text-silk"
                      : "text-sm leading-relaxed text-silk/80"
                  }`}
                >
                  {say(line)}
                </p>
              ))}
            </div>

            {stageCount > 1 && !isLevelUnlocked && (
              <div className="mt-6 rounded-xl border border-web-red/25 bg-web-red/[0.06] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-web-scarlet">
                  Check {stageIndex + 1} of {stageCount}
                </p>
                <p className="mt-1.5 text-sm text-silk">{stage.label}</p>
                <div className="mt-3 flex gap-1.5">
                  {Array.from({ length: stageCount }).map((_, i) => (
                    <span
                      key={i}
                      className="h-1 flex-1 rounded-full transition-colors duration-300"
                      style={{
                        background:
                          i < stageIndex ? "#3FBF6F" : i === stageIndex ? level.accent : "#26262F",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Objective */}
            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-web-red">
                <Target className="h-3.5 w-3.5" /> Objective
              </p>
              <p className="mt-2 text-sm text-silk">{say(level.objective)}</p>
            </div>

            {/* Field ops */}
            <div className="mt-4">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-silk-faint">
                Field Ops — do these for real
              </p>
              <ol className="space-y-2">
                {level.fieldOps.map((step, i) => (
                  <li
                    key={step}
                    className="flex gap-3 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-sm text-silk/80 transition duration-200 hover:translate-x-1 hover:border-web-red/40 hover:bg-web-red/[0.07] hover:text-silk"
                  >
                    <span
                      className="mt-0.5 font-mono text-xs font-bold"
                      style={{ color: level.accent }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 [overflow-wrap:anywhere]">{say(step)}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Self-serve support. Every symptom here is one a beginner
                actually hits — the goal is fewer raised hands. */}
            {level.troubleshoot && level.troubleshoot.length > 0 && (
              <details className="group/help mt-4 rounded-xl border border-white/10 bg-white/[0.02] open:border-web-red/35 open:bg-web-red/[0.05]">
                <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-silk-dim transition hover:text-web-scarlet">
                  <LifeBuoy className="h-3.5 w-3.5" />
                  Stuck? {level.troubleshoot.length} common problems
                  <span className="ml-auto text-silk-faint transition group-open/help:rotate-180">
                    &#9660;
                  </span>
                </summary>
                <dl className="space-y-3 border-t border-white/10 px-4 py-3">
                  {level.troubleshoot.map((item) => (
                    <div key={item.symptom}>
                      <dt className="font-mono text-xs text-web-scarlet [overflow-wrap:anywhere]">
                        {item.symptom}
                      </dt>
                      <dd className="mt-1 text-sm leading-relaxed text-silk/75 [overflow-wrap:anywhere]">
                        {item.fix}
                      </dd>
                    </div>
                  ))}
                </dl>
              </details>
            )}

            {level.id === 1 && (
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-web-red/50 px-4 py-2 font-mono text-xs uppercase tracking-widest text-web-scarlet transition hover:bg-web-red/15"
              >
                Open the repo <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
        </div>
      </div>

      {/* Action bar */}
      <div className="shrink-0 border-t border-white/10 bg-black/40 p-4">
        {level.kind === "button" && !isLevelUnlocked && (
          <motion.button
            onClick={completeLevel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full rounded-xl px-6 py-4 font-display text-xl uppercase tracking-wider text-white transition"
            style={{
              background: `linear-gradient(100deg, ${level.accent}, #8E0912)`,
              boxShadow: `0 0 40px -8px ${level.accent}`,
            }}
          >
            {level.buttonLabel}
          </motion.button>
        )}

        {isLevelUnlocked && !isComplete && (
          <motion.button
            onClick={advanceLevel}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-web-red px-6 py-4 font-display text-xl uppercase tracking-wider text-silk shadow-[0_0_44px_-8px_rgba(230,36,41,0.95)]"
          >
            <CheckCircle2 className="h-5 w-5" />
            Jump to Chapter {level.id + 1}
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        )}

        {isComplete && (
          <motion.a
            href={PR_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: 1,
              boxShadow: [
                "0 0 30px -5px rgba(230,36,41,0.9)",
                "0 0 74px 0px rgba(255,59,59,1)",
                "0 0 30px -5px rgba(230,36,41,0.9)",
              ],
            }}
            transition={{
              boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              default: { type: "spring", stiffness: 200, damping: 15 },
            }}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-web-scarlet via-web-red to-web-blood px-6 py-5 text-center font-display text-2xl uppercase tracking-wider text-white"
          >
            Enter the Multiverse — Submit PR
            <ExternalLink className="h-6 w-6" />
          </motion.a>
        )}

        {!isLevelUnlocked && level.kind === "terminal" && (
          <p className="text-center font-mono text-[11px] uppercase tracking-[0.2em] text-silk-faint">
            Terminal locked → prove the command to continue
          </p>
        )}
      </div>
    </div>
  );
}
