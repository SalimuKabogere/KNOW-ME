import type { CSSProperties } from "react";

export type ArtKind =
  | "backend"
  | "frontend"
  | "mobile"
  | "cloud"
  | "workflow"
  | "learning";

const BRAND = "#79B2DA";

/** Per-element stagger delay consumed by the .anim-* classes via --d. */
const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/**
 * Hand-built inline-SVG mini demos, one per skill group — anime.js-style
 * always-running vignettes made of primitives only (no design assets).
 * Continuous motion comes from the .anim-* CSS keyframes in globals.css;
 * paths marked [data-draw] are drawn in by GSAP when they scroll into view
 * (pathLength=1 normalizes every dash animation to the 0..1 range).
 * Chrome strokes use currentColor so the parent tile can brighten them
 * on hover with a plain text-color transition.
 */
export default function SkillArt({ kind }: { kind: ArtKind }) {
  switch (kind) {
    case "backend":
      return <BackendArt />;
    case "frontend":
      return <FrontendArt />;
    case "mobile":
      return <MobileArt />;
    case "cloud":
      return <CloudArt />;
    case "workflow":
      return <WorkflowArt />;
    case "learning":
      return <LearningArt />;
  }
}

/* Requests pulse from an API rack to a client and responses flow back. */
function BackendArt() {
  return (
    <svg viewBox="0 0 240 120" fill="none" aria-hidden className="h-full w-full">
      <g
        stroke="currentColor"
        className="text-white/40 transition-colors duration-300 group-hover:text-white/70"
      >
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x="16" y={24 + i * 26} width="64" height="18" rx="3" />
            <path d={`M40 ${33 + i * 26} H72`} strokeDasharray="2 3" />
          </g>
        ))}
        <rect x="182" y="46" width="42" height="26" rx="4" />
        <path d="M190 56 H216" strokeDasharray="2 3" />
        <path d="M190 62 H208" strokeDasharray="2 3" />
      </g>

      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx="26"
          cy={33 + i * 26}
          r="2.4"
          fill={BRAND}
          className="anim-led"
          style={d(i * 0.5)}
        />
      ))}

      {/* request / response wires */}
      <path
        d="M86 42 C130 22 150 22 180 50"
        stroke={BRAND}
        strokeWidth="1.4"
        strokeDasharray="3 7"
        className="anim-dash"
        opacity="0.85"
      />
      <path
        d="M180 66 C150 96 130 96 86 76"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeDasharray="3 7"
        className="anim-dash-rev text-white/50"
      />

      <text x="16" y="14" fontSize="7" letterSpacing="1.5" className="fill-white/35 font-mono">
        API SERVER
      </text>
      <text x="182" y="40" fontSize="7" letterSpacing="1.5" className="fill-white/35 font-mono">
        CLIENT
      </text>
      <text
        x="118"
        y="14"
        fontSize="7"
        letterSpacing="1.5"
        fill={BRAND}
        className="anim-led font-mono"
        style={d(0.3)}
      >
        200 OK
      </text>
    </svg>
  );
}

/* A browser window whose skeleton bars stretch in a staggered loop. */
function FrontendArt() {
  const bars = [
    { y: 46, w: 92 },
    { y: 60, w: 64 },
    { y: 74, w: 110 },
  ];
  return (
    <svg viewBox="0 0 200 120" fill="none" aria-hidden className="h-full w-full">
      <g
        stroke="currentColor"
        className="text-white/40 transition-colors duration-300 group-hover:text-white/70"
      >
        <rect x="20" y="14" width="160" height="92" rx="6" />
        <path d="M20 34 H180" />
      </g>
      {[32, 42, 52].map((cx, i) => (
        <circle key={cx} cx={cx} cy="24" r="2.2" fill={BRAND} className="anim-led" style={d(i * 0.3)} />
      ))}
      {bars.map((b, i) => (
        <rect
          key={b.y}
          x="34"
          y={b.y}
          width={b.w}
          height="6"
          rx="3"
          fill={BRAND}
          opacity="0.7"
          className="anim-bar"
          style={d(i * 0.35)}
        />
      ))}
      <rect
        x="34"
        y="88"
        width="34"
        height="11"
        rx="2.5"
        stroke={BRAND}
        className="anim-led"
        style={d(1.1)}
      />
    </svg>
  );
}

/* A phone whose dot-matrix screen ripples diagonally — classic stagger grid. */
function MobileArt() {
  const dots: { cx: number; cy: number; delay: number }[] = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 4; col++) {
      dots.push({
        cx: 87.5 + col * 8.5,
        cy: 26 + row * 9,
        delay: (row + col) * 0.12,
      });
    }
  }
  return (
    <svg viewBox="0 0 200 120" fill="none" aria-hidden className="h-full w-full">
      <g
        stroke="currentColor"
        className="text-white/40 transition-colors duration-300 group-hover:text-white/70"
      >
        <rect x="76" y="8" width="48" height="104" rx="9" />
        <path d="M92 15 H108" strokeLinecap="round" />
      </g>
      {dots.map((dot) => (
        <circle
          key={`${dot.cx}-${dot.cy}`}
          cx={dot.cx}
          cy={dot.cy}
          r="1.8"
          fill={BRAND}
          className="anim-dot"
          style={d(dot.delay)}
        />
      ))}
    </svg>
  );
}

/* A cloud that draws itself, uploads pulsing in, a satellite in orbit. */
function CloudArt() {
  return (
    <svg viewBox="0 0 200 120" fill="none" aria-hidden className="h-full w-full">
      <path
        d="M56 76 H124 A15 15 0 0 0 127 46 A21 21 0 0 0 88 32 A16 16 0 0 0 56 46 A15 15 0 0 0 56 76 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset="1"
        data-draw
        className="text-white/50 transition-colors duration-300 group-hover:text-white/80"
      />
      {[68, 90, 112].map((x, i) => (
        <path
          key={x}
          d={`M${x - 5} 100 l5 -7 l5 7`}
          stroke={BRAND}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="anim-rise"
          style={d(i * 0.55)}
        />
      ))}
      <circle cx="152" cy="30" r="15" stroke="currentColor" strokeDasharray="2 4" className="text-white/20" />
      <g
        className="anim-spin-slow"
        style={{ transformBox: "view-box", transformOrigin: "152px 30px" }}
      >
        <circle cx="167" cy="30" r="2.3" fill={BRAND} />
      </g>
      <circle cx="152" cy="30" r="3" fill="currentColor" className="text-white/40" />
    </svg>
  );
}

/* A git graph: a branch draws itself, commits blink, a gear keeps turning. */
function WorkflowArt() {
  const commits: [number, number][] = [
    [40, 88],
    [60, 88],
    [92, 56],
    [118, 56],
    [140, 56],
    [172, 88],
  ];
  return (
    <svg viewBox="0 0 200 120" fill="none" aria-hidden className="h-full w-full">
      <path
        d="M24 88 H176"
        stroke="currentColor"
        className="text-white/40 transition-colors duration-300 group-hover:text-white/70"
      />
      <path
        d="M60 88 C76 88 76 56 92 56 H140 C160 56 160 88 172 88"
        stroke={BRAND}
        strokeWidth="1.4"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset="1"
        data-draw
      />
      {commits.map(([cx, cy], i) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="2.6"
          fill={BRAND}
          className="anim-led"
          style={d(i * 0.35)}
        />
      ))}
      <g
        className="anim-spin-slow"
        style={{ transformBox: "view-box", transformOrigin: "168px 28px" }}
        stroke="currentColor"
      >
        <circle cx="168" cy="28" r="6" className="text-white/45" />
        {[0, 45, 90, 135].map((deg) => (
          <path
            key={deg}
            d="M168 18.5 V37.5"
            className="text-white/45"
            transform={`rotate(${deg} 168 28)`}
          />
        ))}
      </g>
      <circle cx="168" cy="28" r="2.4" fill="currentColor" className="text-white/60" />
    </svg>
  );
}

/* Progress rings fill to their level; a tiny network pulses beside them. */
function LearningArt() {
  const rings = [
    { label: "LINUX", progress: 0.72, cx: 46 },
    { label: "AI / ML", progress: 0.45, cx: 122 },
    { label: "SECURITY", progress: 0.6, cx: 198 },
  ];
  const layers = [
    { x: 254, ys: [30, 54, 78] },
    { x: 288, ys: [42, 66] },
  ];
  return (
    <svg viewBox="0 0 320 120" fill="none" aria-hidden className="h-full w-full">
      {rings.map((ring) => (
        <g key={ring.label}>
          <circle cx={ring.cx} cy="50" r="20" stroke="currentColor" strokeWidth="3" className="text-white/10" />
          <circle
            cx={ring.cx}
            cy="50"
            r="20"
            stroke={BRAND}
            strokeWidth="3"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset="1"
            data-draw
            data-progress={ring.progress}
            transform={`rotate(-90 ${ring.cx} 50)`}
          />
          <text
            x={ring.cx}
            y="88"
            fontSize="7"
            letterSpacing="1.5"
            textAnchor="middle"
            className="fill-white/40 font-mono"
          >
            {ring.label}
          </text>
        </g>
      ))}

      {/* mini network */}
      <g stroke="currentColor" className="text-white/15">
        {layers[0].ys.map((y1) =>
          layers[1].ys.map((y2) => (
            <path key={`${y1}-${y2}`} d={`M${layers[0].x} ${y1} L${layers[1].x} ${y2}`} />
          ))
        )}
        <path d={`M${layers[1].x} 42 L310 54`} />
        <path d={`M${layers[1].x} 66 L310 54`} />
      </g>
      {[...layers, { x: 310, ys: [54] }].flatMap((layer, li) =>
        layer.ys.map((y, yi) => (
          <circle
            key={`${layer.x}-${y}`}
            cx={layer.x}
            cy={y}
            r="2.6"
            fill={BRAND}
            className="anim-dot"
            style={d((li * 2 + yi) * 0.2)}
          />
        ))
      )}
    </svg>
  );
}
