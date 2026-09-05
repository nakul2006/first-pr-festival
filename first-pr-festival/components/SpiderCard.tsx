"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import type { SpiderMember } from "@/utils/getData";

/** Turns "#FF1B4C" (or "#F14") into "255,27,76" for rgba() interpolation. */
function toRgb(hex: string): string {
  let value = hex.replace("#", "");
  if (value.length === 3) {
    value = value
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const int = parseInt(value, 16);
  return `${(int >> 16) & 255},${(int >> 8) & 255},${int & 255}`;
}

type Props = {
  member: SpiderMember;
  index?: number;
};

export default function SpiderCard({ member, index = 0 }: Props) {
  const [avatarFailed, setAvatarFailed] = useState(false);
  const rgb = toRgb(member.suitColor);

  // 3D tilt: raw pointer position → spring-smoothed rotation.
  const px = useMotionValue(50);
  const py = useMotionValue(50);
  const rx = useSpring(0, { stiffness: 220, damping: 18 });
  const ry = useSpring(0, { stiffness: 220, damping: 18 });
  const glareX = useTransform(px, (v) => `${v}%`);
  const glareY = useTransform(py, (v) => `${v}%`);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, rgba(${rgb},0.30), transparent 62%)`;

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    px.set(x * 100);
    py.set(y * 100);
    ry.set((x - 0.5) * 18); // left/right → rotateY
    rx.set((0.5 - y) * 18); // up/down   → rotateX
  }

  function handleLeave() {
    rx.set(0);
    ry.set(0);
    px.set(50);
    py.set(50);
  }

  return (
    <div
      style={{ perspective: 1000, animationDelay: `${Math.min(index * 60, 600)}ms` }}
      className="reveal-up group relative h-full"
    >
      <motion.article
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          rotateX: rx,
          rotateY: ry,
          transformStyle: "preserve-3d",
          borderColor: `rgba(${rgb},0.55)`,
          boxShadow: `0 0 0 1px rgba(${rgb},0.25), 0 18px 45px -20px rgba(${rgb},0.85), 0 0 60px -30px rgba(${rgb},0.9)`,
        }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border bg-ink-900/80 p-5 backdrop-blur-sm"
      >
        {/* Suit-color wash + halftone comic texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background: `linear-gradient(160deg, rgba(${rgb},0.22) 0%, transparent 45%, rgba(${rgb},0.12) 100%)`,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 halftone bg-[length:10px_10px] opacity-[0.07] mix-blend-screen"
        />
        {/* Cursor glare, follows the tilt */}
        <motion.div
          aria-hidden
          style={{ background: glare }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        {/* Scanline sweep on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 -translate-y-full bg-gradient-to-b from-transparent via-white/10 to-transparent opacity-0 group-hover:animate-scanline group-hover:opacity-100"
        />

        <div className="relative flex h-full flex-col" style={{ transform: "translateZ(40px)" }}>
          {/* ── Header: dimension + status ─────────────────────────── */}
          <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
            <span>{member.dimension}</span>
            <span className="flex items-center gap-1.5 text-signal-ok">
              <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-signal-ok" />
              merged
            </span>
          </div>

          {/* ── Avatar ─────────────────────────────────────────────── */}
          <div className="flex items-start gap-4">
            <div
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2"
              style={{ borderColor: member.suitColor, boxShadow: `0 0 22px rgba(${rgb},0.55)` }}
            >
              {avatarFailed ? (
                <div
                  className="flex h-full w-full items-center justify-center font-display text-2xl text-white/90"
                  style={{ background: `rgba(${rgb},0.25)` }}
                >
                  {member.alias.charAt(0).toUpperCase()}
                </div>
              ) : (
                <Image
                  src={`https://github.com/${member.githubUsername}.png`}
                  alt={`${member.githubUsername} avatar`}
                  fill
                  sizes="80px"
                  unoptimized
                  className="object-cover grayscale-[0.25] transition duration-500 group-hover:grayscale-0 group-hover:scale-105"
                  onError={() => setAvatarFailed(true)}
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3
                className="font-display text-xl font-black uppercase leading-tight tracking-wide [overflow-wrap:anywhere]"
                style={{ color: member.suitColor, textShadow: `0 0 18px rgba(${rgb},0.6)` }}
                title={member.alias}
              >
                {member.alias}
              </h3>
              <p className="text-sm text-white/80 [overflow-wrap:anywhere]">{member.name}</p>
              <a
                href={`https://github.com/${member.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block font-mono text-xs text-web-scarlet/80 transition hover:text-web-scarlet hover:underline"
              >
                @{member.githubUsername}
              </a>
            </div>
          </div>

          {/* ── Skills ─────────────────────────────────────────────── */}
          <div className="mt-5 flex-1">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              Spider-Abilities
            </p>
            <div className="flex flex-wrap gap-2">
              {member.skills.length > 0 ? (
                member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border px-3 py-1 text-xs font-medium text-white/90 transition group-hover:border-white/30"
                    style={{
                      borderColor: `rgba(${rgb},0.5)`,
                      background: `rgba(${rgb},0.12)`,
                    }}
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs italic text-white/35">No abilities logged</span>
              )}
            </div>
          </div>

          {/* ── Footer barcode ─────────────────────────────────────── */}
          <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
              Spider-Society ID
            </span>
            <div className="flex h-5 items-end gap-[2px]" aria-hidden>
              {member.githubUsername.split("").slice(0, 14).map((char, i) => (
                <span
                  key={`${char}-${i}`}
                  className="w-[2px] rounded-sm"
                  style={{
                    height: `${30 + ((char.charCodeAt(0) * 7) % 70)}%`,
                    background: i % 3 === 0 ? member.suitColor : "rgba(255,255,255,0.35)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
}
