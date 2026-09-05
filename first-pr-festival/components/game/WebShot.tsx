"use client";

/**
 * Fires a web-line across the screen on every chapter jump, with a splat where
 * it lands. Pure CSS so a backgrounded tab can't strand it mid-flight.
 */
export default function WebShot({ shotKey, accent }: { shotKey: number; accent: string }) {
  return (
    <div key={shotKey} aria-hidden className="pointer-events-none fixed inset-0 z-40">
      <div className="animate-dimension-flash absolute inset-0" style={{ background: accent }} />

      <div className="animate-web-shot absolute left-0 top-1/2 h-[3px] w-full -translate-y-1/2">
        <div className="h-full w-full bg-gradient-to-r from-transparent via-silk to-silk shadow-[0_0_18px_rgba(232,230,227,0.9)]" />
      </div>

      <svg
        viewBox="0 0 120 120"
        className="animate-web-splat absolute right-[6%] top-1/2 h-32 w-32 -translate-y-1/2"
        fill="none"
      >
        {Array.from({ length: 11 }).map((_, i) => {
          const a = (Math.PI * 2 * i) / 11;
          return (
            <line
              key={i}
              x1="60"
              y1="60"
              x2={(60 + 52 * Math.cos(a)).toFixed(3)}
              y2={(60 + 52 * Math.sin(a)).toFixed(3)}
              stroke="rgba(232,230,227,0.9)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          );
        })}
        {[16, 30, 44].map((r) => (
          <circle
            key={r}
            cx="60"
            cy="60"
            r={r}
            stroke="rgba(232,230,227,0.75)"
            strokeWidth="1.8"
            strokeDasharray="5 7"
            fill="none"
          />
        ))}
        <circle cx="60" cy="60" r="6" fill="rgba(232,230,227,0.95)" />
      </svg>
    </div>
  );
}
