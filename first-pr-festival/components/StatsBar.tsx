"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (latest) => setValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {String(value).padStart(2, "0")}
    </span>
  );
}

export type Stat = { label: string; value: number | string; accent: string };

export default function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid w-full grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          style={{
            animationDelay: `${150 + i * 80}ms`,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
          className="reveal-up group relative overflow-hidden rounded-xl border border-white/10 bg-ink-900/70 px-4 py-4 backdrop-blur"
        >
          <div
            className="absolute inset-x-0 bottom-0 h-[2px] opacity-70 transition-opacity group-hover:opacity-100"
            style={{ background: stat.accent }}
          />
          <p
            className="font-display text-4xl font-black leading-none"
            style={{ color: stat.accent, textShadow: `0 0 22px ${stat.accent}66` }}
          >
            {typeof stat.value === "number" ? <Counter to={stat.value} /> : stat.value}
          </p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
