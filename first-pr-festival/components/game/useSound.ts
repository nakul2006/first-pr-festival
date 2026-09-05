"use client";

import { useCallback, useRef } from "react";
import { useGame } from "@/context/GameContext";

type Cue = "ok" | "bad" | "levelup" | "type";

/**
 * Web Audio blips — no asset files, nothing to load. Off by default: sixty
 * laptops chirping in one room is a nightmare, so it's opt-in per student.
 */
export function useSound() {
  const { soundOn } = useGame();
  const ctxRef = useRef<AudioContext | null>(null);

  return useCallback(
    (cue: Cue) => {
      if (!soundOn) return;
      if (typeof window === "undefined") return;
      if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

      try {
        const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return;
        const ctx = (ctxRef.current ??= new Ctor());
        if (ctx.state === "suspended") void ctx.resume();

        const notes: Record<Cue, number[]> = {
          ok: [660, 990],
          bad: [180, 120],
          levelup: [523, 659, 784, 1046],
          type: [440],
        };
        const seq = notes[cue];
        const step = cue === "levelup" ? 0.09 : 0.07;

        seq.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = cue === "bad" ? "sawtooth" : "triangle";
          osc.frequency.value = freq;
          const start = ctx.currentTime + i * step;
          gain.gain.setValueAtTime(0.0001, start);
          gain.gain.exponentialRampToValueAtTime(cue === "bad" ? 0.09 : 0.06, start + 0.012);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + step + 0.05);
          osc.connect(gain).connect(ctx.destination);
          osc.start(start);
          osc.stop(start + step + 0.08);
        });
      } catch {
        /* audio is a nicety — never let it break the game */
      }
    },
    [soundOn],
  );
}
