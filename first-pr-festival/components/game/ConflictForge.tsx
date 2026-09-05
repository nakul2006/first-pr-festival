"use client";

import { AlertTriangle, Biohazard, CheckCircle2, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { useGame } from "@/context/GameContext";

/** Exactly what Git writes into a conflicted file, markers and all. */
const CONFLICTED = `{
  "name": "Your Name",
<<<<<<< HEAD
  "alias": "Spider-Byte (Upgraded)",
  "skills": ["TypeScript", "Web-Slinging", "Precision"],
  "suitColor": "#E62429",
=======
  "alias": "Venom-Byte",
  "skills": ["Corrupted Code", "Shadow-Slinging", "Rage"],
  "suitColor": "#1A1A1A",
>>>>>>> symbiote
  "githubUsername": "your-username"
}`;

type Check = { label: string; ok: boolean; detail: string };

export default function ConflictForge() {
  const { completeLevel, isLevelUnlocked, registerFailure } = useGame();
  const [text, setText] = useState(CONFLICTED);
  const [submitted, setSubmitted] = useState(false);

  const checks = useMemo<Check[]>(() => {
    const hasMarkers = /^(<{7}|={7}|>{7})/m.test(text);

    let parsed: Record<string, unknown> | null = null;
    let parseError = "";
    try {
      parsed = JSON.parse(text) as Record<string, unknown>;
    } catch (e) {
      parseError = e instanceof Error ? e.message.replace(/^JSON\.parse:\s*/, "") : "invalid JSON";
    }

    const skills = Array.isArray(parsed?.skills) ? (parsed!.skills as unknown[]) : null;

    // JSON.parse silently keeps the LAST occurrence of a duplicate key, so a
    // student who deletes only the three marker lines — and leaves both the
    // HEAD and symbiote blocks intact — still gets valid JSON with a single
    // "alias" and "skills" in the parsed object. That defeats the entire
    // lesson of this chapter (decide, don't just delete markers), so count
    // raw key occurrences in the SOURCE TEXT, before parsing collapses them.
    const aliasOccurrences = (text.match(/"alias"\s*:/g) ?? []).length;
    const skillsOccurrences = (text.match(/"skills"\s*:/g) ?? []).length;
    const suitColorOccurrences = (text.match(/"suitColor"\s*:/g) ?? []).length;
    const hasDuplicateKeys =
      aliasOccurrences > 1 || skillsOccurrences > 1 || suitColorOccurrences > 1;

    return [
      {
        label: "Markers removed",
        ok: !hasMarkers,
        detail: hasMarkers
          ? "Still see <<<<<<<, ======= or >>>>>>> — delete those three lines entirely."
          : "No Git markers left in the file.",
      },
      {
        label: "Valid JSON",
        ok: parsed !== null,
        detail: parsed !== null ? "Parses cleanly." : `Won't parse — ${parseError}`,
      },
      {
        label: "One identity, not two",
        ok:
          parsed !== null &&
          !hasDuplicateKeys &&
          typeof parsed.alias === "string" &&
          skills?.length === 3,
        detail:
          parsed === null
            ? "Fix the JSON first."
            : hasDuplicateKeys
              ? "Both blocks are still in there — the file has the same key twice. Delete one whole side, not just the marker lines."
              : typeof parsed.alias !== "string"
                ? "Needs exactly one alias."
                : skills?.length !== 3
                  ? `Needs exactly 3 skills — found ${skills?.length ?? 0}.`
                  : "One alias, three skills. Decision made.",
      },
    ];
  }, [text]);

  const solved = checks.every((c) => c.ok);

  function attempt() {
    setSubmitted(true);
    if (solved) completeLevel();
    else registerFailure();
  }

  return (
    <div className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl border border-web-red/30 bg-black/90 shadow-[0_0_70px_-25px_rgba(230,36,41,0.8)]">
      <div className="flex shrink-0 items-center gap-2 border-b border-white/10 bg-ink-800/90 px-4 py-2.5">
        <Biohazard className="h-4 w-4 text-web-scarlet" />
        <span className="font-mono text-[11px] uppercase tracking-widest text-silk-dim">
          conflict forge — practice run
        </span>
        <button
          onClick={() => {
            setText(CONFLICTED);
            setSubmitted(false);
          }}
          className="ml-auto flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-silk-faint transition hover:text-web-scarlet"
        >
          <RotateCcw className="h-3 w-3" /> reset
        </button>
      </div>

      <label className="sr-only" htmlFor="conflict-editor">
        Conflicted file contents
      </label>
      <textarea
        id="conflict-editor"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setSubmitted(false);
        }}
        spellCheck={false}
        className="scroll-slim min-h-[200px] flex-1 resize-none bg-transparent p-4 font-mono text-[13px] leading-relaxed text-silk outline-none"
      />

      <div className="shrink-0 space-y-1.5 border-t border-white/10 bg-ink-900/80 px-4 py-3">
        {checks.map((check) => (
          <p
            key={check.label}
            className={`flex items-start gap-2 font-mono text-[11px] ${
              check.ok ? "text-signal-ok" : "text-silk-faint"
            }`}
          >
            {check.ok ? (
              <CheckCircle2 className="mt-px h-3.5 w-3.5 shrink-0" />
            ) : (
              <AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0" />
            )}
            <span>
              <span className="uppercase tracking-widest">{check.label}</span>
              <span className="ml-2 normal-case tracking-normal text-silk-dim">{check.detail}</span>
            </span>
          </p>
        ))}
      </div>

      <button
        onClick={attempt}
        disabled={isLevelUnlocked}
        className={`shrink-0 py-4 font-display text-xl uppercase tracking-wider transition ${
          solved
            ? "bg-web-red text-silk hover:brightness-110"
            : "bg-ink-700 text-silk-faint hover:bg-ink-600"
        } disabled:opacity-60`}
      >
        {isLevelUnlocked ? "Symbiote purged" : solved ? "Purge the symbiote" : "Purge — not clean yet"}
      </button>

      {submitted && !solved && (
        <p className="shrink-0 bg-web-blood/25 px-4 py-2 text-center font-mono text-[11px] text-signal-bad">
          Still infected. Check the three lines above — nothing here can break your real repo.
        </p>
      )}
    </div>
  );
}
