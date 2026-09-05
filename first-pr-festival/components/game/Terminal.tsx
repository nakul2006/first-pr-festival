"use client";

import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { CornerDownLeft, Lightbulb, TerminalSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SpiderEmblem, WebCorner } from "@/components/SpiderArt";
import { useGame } from "@/context/GameContext";
import { useSound } from "./useSound";

const PROMPT = "miles@earth-1610:~$";

/** Easter-egg commands. Not required to win — just rewards for poking around. */
const EASTER_EGGS: Record<string, string> = {
  help: "Commands: hint · lyla · clear · whoami · ls · status · lore · sudo · exit — everything else, Git handles.",
  whoami: "You're the one who got bit. Everything after that was a choice.",
  ls: "spider-society/  app/  components/  .git/  <- that hidden folder is the whole multiverse",
  lore: "Every Spider-Person's story starts the same way. That's not a bug. That's the canon.",
  status: "On branch main. Your move.",
  exit: "There's no exit. There's only the next commit.",
  sudo: "Nice try. With great power comes great responsibility — not root access.",
  "rm -rf /": "Absolutely not. Somewhere, a DevOps engineer just woke up screaming.",
  "git push --force": "Force-pushing to main is how canon events happen. Don't.",
  "git blame": "It was never your fault, kid.",
  spiderman: "*points*",
};

export default function Terminal() {
  const {
    level,
    stage,
    stageIndex,
    stageCount,
    terminalHistory,
    isLevelUnlocked,
    pushHistory,
    clearHistory,
    clearStage,
    registerFailure,
    useHint,
  } = useGame();

  const play = useSound();
  const [input, setInput] = useState("");
  /** Comic SFX burst on a correct command, and a red pulse on a wrong one. */
  const [burst, setBurst] = useState<{ id: number; word: string } | null>(null);
  const [senseKey, setSenseKey] = useState(0);
  const [recall, setRecall] = useState<string[]>([]);
  const [recallIndex, setRecallIndex] = useState(-1);
  const shake = useAnimationControls();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Boot banner whenever the level changes.
  useEffect(() => {
    clearHistory();
    pushHistory({ kind: "system", text: `>> LINKING TO ${level.dimension} ...` });
    pushHistory({
      kind: "system",
      text: `>> ACT ${level.act} · CHAPTER ${level.id} — ${level.codename}`,
    });
    if (level.kind === "terminal") {
      if (stageCount > 1) {
        pushHistory({ kind: "system", text: `>> ${stageCount} checks in this chapter.` });
      }
      pushHistory({ kind: "lore", text: `>> Step 1/${stageCount} — ${stage.label}` });
      pushHistory({ kind: "system", text: ">> Type 'hint' for a nudge, or 'lyla' to pull up the command reference." });
    } else if (level.kind === "conflict" || level.kind === "weave") {
      pushHistory({ kind: "lore", text: ">> Resolve the conflict in the forge. This terminal is idle." });
    } else {
      pushHistory({ kind: "lore", text: ">> No command required. Complete the field op, then confirm." });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [terminalHistory]);

  const SFX = ["THWIP!", "SNIKT!", "BAMF!", "KRAK!", "WEB-LOCK!"];

  function fail() {
    registerFailure();
    play("bad");
    setSenseKey((n) => n + 1);
    shake.start({
      x: [0, -12, 11, -8, 6, -3, 0],
      transition: { duration: 0.45 },
    });
  }

  function submit() {
    const raw = input;
    const trimmed = raw.trim();
    if (!trimmed) return;

    setInput("");
    setRecall((prev) => [...prev, trimmed]);
    setRecallIndex(-1);
    pushHistory({ kind: "input", text: trimmed });

    const lower = trimmed.toLowerCase();

    if (lower === "clear" || lower === "cls") {
      clearHistory();
      return;
    }

    if (lower === "hint" || lower === "help me") {
      pushHistory({ kind: "warn", text: `[LYLA] ${useHint()}` });
      return;
    }

    if (lower === "lyla") {
      pushHistory({ kind: "warn", text: "[LYLA] Pulling up the command reference for you." });
      // An <a target="_blank"> click is honored more reliably than a raw
      // window.open() across browsers with strict popup blocking (Safari in
      // particular) — some venue laptops lock this down hard.
      const link = document.createElement("a");
      link.href = "/cheatsheet";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      link.remove();
      return;
    }

    if (EASTER_EGGS[lower]) {
      pushHistory({ kind: "system", text: EASTER_EGGS[lower] });
      return;
    }

    if (isLevelUnlocked) {
      pushHistory({
        kind: "system",
        text: "Challenge already cleared. Hit CONTINUE to jump dimensions.",
      });
      return;
    }

    if (level.kind === "button") {
      pushHistory({
        kind: "warn",
        text: "This one isn't a command. Synthesize your suit in VS Code, then press the button.",
      });
      return;
    }

    if (level.kind === "conflict") {
      pushHistory({
        kind: "warn",
        text: "No command here — purge the symbiote in the forge panel.",
      });
      return;
    }

    const result = stage.validate(trimmed);

    if (result.ok) {
      const word = SFX[Math.floor(Math.random() * SFX.length)];
      play("ok");
      setBurst({ id: Date.now(), word });
      window.setTimeout(() => setBurst(null), 900);
      pushHistory({ kind: "success", text: result.message });
      pushHistory({ kind: "success", text: stage.successLine });
      const { advanced } = clearStage();
      if (advanced) {
        const next = level.stages?.[stageIndex + 1];
        if (next) {
          pushHistory({ kind: "system", text: "" });
          pushHistory({
            kind: "lore",
            text: `>> Step ${stageIndex + 2}/${stageCount} — ${next.label}`,
          });
        }
      }
    } else {
      pushHistory({
        kind: result.nearMiss ? "warn" : "error",
        text: result.nearMiss ? `[LYLA] ${result.message}` : `!! ${result.message}`,
      });
      fail();
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    // Real shells have history. So does this one.
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!recall.length) return;
      const next = recallIndex === -1 ? recall.length - 1 : Math.max(0, recallIndex - 1);
      setRecallIndex(next);
      setInput(recall[next]);
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (recallIndex === -1) return;
      const next = recallIndex + 1;
      if (next >= recall.length) {
        setRecallIndex(-1);
        setInput("");
      } else {
        setRecallIndex(next);
        setInput(recall[next]);
      }
    }
  }

  const lineColor: Record<string, string> = {
    input: "text-silk/85",
    success: "text-signal-ok",
    error: "text-signal-bad",
    warn: "text-signal-warn",
    system: "text-silk-dim",
    lore: "text-web-scarlet/85",
  };

  return (
    <motion.div
      animate={shake}
      onClick={() => inputRef.current?.focus()}
      className="relative flex h-full min-h-0 cursor-text flex-col overflow-hidden rounded-2xl border border-web-red/30 bg-black/90 shadow-[0_0_70px_-25px_rgba(230,36,41,0.8)]"
    >
      {/* Spider-sense: a red shockwave when a command is rejected. */}
      {senseKey > 0 && (
        <div
          key={`sense-${senseKey}`}
          aria-hidden
          className="animate-spider-sense pointer-events-none absolute inset-0 z-20 rounded-2xl border-2 border-web-red"
          style={{ boxShadow: "inset 0 0 70px rgba(230,36,41,0.55)" }}
        />
      )}

      {/* Comic SFX lettering on a correct command. */}
      {burst && (
        <span
          key={burst.id}
          aria-hidden
          className="animate-thwip pointer-events-none absolute left-1/2 top-1/2 z-30 select-none font-display text-6xl uppercase tracking-wider text-silk sm:text-7xl"
          style={{
            WebkitTextStroke: "3px #08080A",
            textShadow: "5px 5px 0 #E62429, 10px 10px 0 rgba(142,9,18,0.55)",
          }}
        >
          {burst.word}
        </span>
      )}

      {/* Title bar */}
      <div className="relative flex shrink-0 items-center gap-2 overflow-hidden border-b border-white/10 bg-ink-800/90 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-web-red" />
        <span className="h-2.5 w-2.5 rounded-full bg-web-blood" />
        <span className="h-2.5 w-2.5 rounded-full bg-silk-faint" />
        <span className="ml-2 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-silk-dim">
          <TerminalSquare className="h-3.5 w-3.5" />
          multiverse-terminal
        </span>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-web-scarlet/80">
          {level.dimension}
        </span>
        <WebCorner
          className="pointer-events-none absolute -right-4 -top-4 h-28 w-28 rotate-90"
          opacity={0.45}
          rings={4}
          spokes={6}
        />
      </div>

      {/* Scrollback */}
      <div
        ref={scrollRef}
        className="scroll-slim relative flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-4 font-mono text-[13px] leading-relaxed"
      >
        {/* CRT furniture: a drifting scanline and a faint emblem burned into
            the phosphor. Decorative only. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-20 animate-scanline bg-gradient-to-b from-transparent via-web-red/[0.07] to-transparent"
        />
        <SpiderEmblem
          className="pointer-events-none absolute bottom-6 right-6 h-28 w-28 text-web-red/[0.07]"
          color="currentColor"
        />
        <AnimatePresence initial={false}>
          {terminalHistory.map((entry) => (
            <motion.p
              key={entry.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18 }}
              className={`whitespace-pre-wrap break-words ${lineColor[entry.kind]}`}
            >
              {entry.kind === "input" ? (
                <>
                  <span className="text-web-red">{PROMPT}</span> {entry.text}
                </>
              ) : (
                entry.text
              )}
            </motion.p>
          ))}
        </AnimatePresence>

        {isLevelUnlocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 16 }}
            className="mt-3 rounded-lg border border-signal-ok/40 bg-signal-ok/10 p-3"
          >
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal-ok">
              ✓ {level.successTitle}
            </p>
            {level.successLines.map((line) => (
              <p key={line} className="mt-1 font-mono text-[12px] text-signal-ok/75">
                {line}
              </p>
            ))}
          </motion.div>
        )}
      </div>

      {/* Input line */}
      <div className="shrink-0 border-t border-white/10 bg-ink-900/95 px-4 py-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="flex items-center gap-2 font-mono text-[13px]"
        >
          <span className="shrink-0 text-web-red">{PROMPT}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            aria-label="Terminal command input"
            placeholder={level.kind === "terminal" ? "type the command…" : "try 'help'"}
            className="w-full flex-1 bg-transparent text-silk caret-web-red outline-none placeholder:text-silk-faint"
          />
          <button
            type="submit"
            aria-label="Run command"
            className="ml-auto hidden shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-silk-faint transition hover:text-web-scarlet sm:flex"
          >
            <CornerDownLeft className="h-3 w-3" /> enter
          </button>
        </form>
      </div>

      {/* Hint bar */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          pushHistory({ kind: "warn", text: `[LYLA] ${useHint()}` });
        }}
        className="flex shrink-0 items-center justify-center gap-2 border-t border-white/10 bg-web-red/5 py-2 font-mono text-[11px] uppercase tracking-widest text-web-scarlet/80 transition hover:bg-web-red/15 hover:text-web-scarlet"
      >
        <Lightbulb className="h-3.5 w-3.5" />
        Ping Lyla for a hint
      </button>
    </motion.div>
  );
}
