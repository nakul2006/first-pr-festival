/**
 * Hand-drawn Spider-Man iconography. Everything here is original SVG geometry —
 * no Marvel artwork is imported, which keeps the event site clean to publish.
 */

/** The emblem: eight legs off a bulbed body, built from arcs rather than paths. */
export function SpiderEmblem({
  className = "",
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) {
  const legs = [
    "M32 30 C 20 22, 12 12, 6 2",
    "M32 32 C 18 30, 9 26, 1 18",
    "M32 35 C 18 38, 9 44, 3 53",
    "M32 38 C 21 46, 16 55, 13 64",
    "M32 30 C 44 22, 52 12, 58 2",
    "M32 32 C 46 30, 55 26, 63 18",
    "M32 35 C 46 38, 55 44, 61 53",
    "M32 38 C 43 46, 48 55, 51 64",
  ];
  return (
    <svg viewBox="0 0 64 66" className={className} fill="none" aria-hidden>
      {legs.map((d) => (
        <path
          key={d}
          d={d}
          stroke={color}
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
      ))}
      <ellipse cx="32" cy="26" rx="6" ry="7" fill={color} />
      <ellipse cx="32" cy="39" rx="8.5" ry="12" fill={color} />
    </svg>
  );
}

/** The mask: teardrop lenses with the classic webbing radiating from the brow. */
export function SpiderMask({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 220" className={className} fill="none" aria-hidden>
      <defs>
        <radialGradient id="mask-fill" cx="50%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#E62429" />
          <stop offset="70%" stopColor="#8E0912" />
          <stop offset="100%" stopColor="#3A050A" />
        </radialGradient>
      </defs>
      <path
        d="M100 6c48 0 82 30 82 78 0 58-40 108-82 130C58 192 18 142 18 84 18 36 52 6 100 6Z"
        fill="url(#mask-fill)"
      />
      {/* Webbing: radials from the brow + concentric arcs */}
      <g stroke="rgba(0,0,0,0.55)" strokeWidth="1.6" fill="none">
        {Array.from({ length: 13 }).map((_, i) => {
          const angle = (Math.PI / 12) * i;
          return (
            <line
              key={`r-${i}`}
              x1="100"
              y1="72"
              x2={(100 + 190 * Math.cos(angle - Math.PI)).toFixed(3)}
              y2={(72 + 190 * Math.sin(angle - Math.PI) * -1).toFixed(3)}
            />
          );
        })}
        {[26, 52, 78, 104, 130, 156].map((r) => (
          <circle key={`c-${r}`} cx="100" cy="72" r={r} strokeDasharray="7 9" />
        ))}
      </g>
      {/* Lenses */}
      <path
        d="M74 78c-16 2-30 12-32 26-1 10 8 18 22 18 18 0 34-14 38-30 2-9-10-16-28-14Z"
        fill="#F2F0EC"
        stroke="#0A0A0B"
        strokeWidth="4"
      />
      <path
        d="M126 78c16 2 30 12 32 26 1 10-8 18-22 18-18 0-34-14-38-30-2-9 10-16 28-14Z"
        fill="#F2F0EC"
        stroke="#0A0A0B"
        strokeWidth="4"
      />
    </svg>
  );
}

/**
 * A quarter web anchored to one corner: radial strands plus sagging catenary
 * cross-strands, which is what sells it as a web instead of a spoked wheel.
 */
export function WebCorner({
  className = "",
  rings = 7,
  spokes = 9,
  opacity = 0.5,
}: {
  className?: string;
  rings?: number;
  spokes?: number;
  opacity?: number;
}) {
  const R = 420;
  const spokeAngles = Array.from({ length: spokes }, (_, i) => (Math.PI / 2) * (i / (spokes - 1)));

  return (
    <svg viewBox="0 0 420 420" className={className} fill="none" aria-hidden style={{ opacity }}>
      {spokeAngles.map((a, i) => (
        <line
          key={`s-${i}`}
          x1="0"
          y1="0"
          x2={(R * Math.cos(a)).toFixed(3)}
          y2={(R * Math.sin(a)).toFixed(3)}
          stroke="rgba(232,230,227,0.85)"
          strokeWidth="1.6"
        />
      ))}
      {Array.from({ length: rings }).map((_, r) => {
        const radius = ((r + 1) / rings) * R * 0.98;
        const sag = 0.86; // pulls each strand toward the hub so it droops
        const d = spokeAngles
          .map((a, i) => {
            const x = radius * Math.cos(a);
            const y = radius * Math.sin(a);
            if (i === 0) return `M ${x.toFixed(1)} ${y.toFixed(1)}`;
            const prev = spokeAngles[i - 1];
            const mid = (a + prev) / 2;
            const cx = radius * sag * Math.cos(mid);
            const cy = radius * sag * Math.sin(mid);
            return `Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
          })
          .join(" ");
        return (
          <path
            key={`r-${r}`}
            d={d}
            stroke="rgba(232,230,227,0.7)"
            strokeWidth="1.3"
            fill="none"
          />
        );
      })}
    </svg>
  );
}

/** A single dangling strand — used to hang small ornaments off panel edges. */
export function WebStrand({ className = "", height = 120 }: { className?: string; height?: number }) {
  return (
    <svg
      viewBox={`0 0 8 ${height}`}
      className={className}
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
    >
      <line x1="4" y1="0" x2="4" y2={height} stroke="rgba(232,230,227,0.45)" strokeWidth="1" />
    </svg>
  );
}
