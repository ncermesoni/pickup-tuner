import React from "react";

/**
 * Level meter — vintage VU needle on an ivory dial face. The dark RMS needle
 * rests on the level; a thinner brass peak-hold needle (ball tip) holds the
 * highest peak. The upper end of the arc is an oxblood "hot" zone where
 * redlining means a hot/clipping signal. dBFS in, floor −60.
 */
const MIN = -60;
const HOT_FROM = -6; // oxblood zone start

// geometry of the 180° arc
const CX = 100, CY = 104, R = 84;
const norm = (db) => Math.min(1, Math.max(0, (db - MIN) / -MIN));
const angOf = (db) => 180 * (1 - norm(db)); // 180°=left(−60) … 0°=right(0)
const polar = (deg, r) => [
  CX + r * Math.cos((deg * Math.PI) / 180),
  CY - r * Math.sin((deg * Math.PI) / 180),
];

export function Meter({ rms = -90, hold = -90, height = 104, style }) {
  const ticks = [-60, -40, -20, -10, -6, -3, 0];
  const [hx, hy] = polar(angOf(rms), 74);
  const [r0x, r0y] = polar(angOf(HOT_FROM), R);
  const [r1x, r1y] = polar(angOf(0), R);
  const [hpx, hpy] = polar(angOf(hold), 72);

  return (
    <div
      style={{
        background: "var(--grad-dial)",
        border: "1px solid var(--dial-edge)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-dial)",
        padding: "8px 14px 6px",
        ...style,
      }}
    >
      <svg viewBox="0 0 200 112" style={{ width: "100%", height, display: "block" }}>
        {/* baseline arc */}
        <path d="M 16 104 A 84 84 0 0 1 184 104" fill="none" stroke="var(--plate-edge)" strokeWidth="2" />
        {/* oxblood hot zone */}
        <path d={`M ${r0x} ${r0y} A 84 84 0 0 1 ${r1x} ${r1y}`} fill="none" stroke="var(--oxblood)" strokeWidth="3.5" />
        {/* ticks */}
        {ticks.map((v, i) => {
          const a = angOf(v);
          const [x1, y1] = polar(a, R);
          const [x2, y2] = polar(a, v >= HOT_FROM ? 73 : 76);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={v >= HOT_FROM ? "var(--oxblood)" : "var(--ink-dim)"} strokeWidth={v >= HOT_FROM ? 1.5 : 1} />;
        })}
        {/* a couple of scale numbers */}
        {[[-20, "-20"], [0, "0"]].map(([v, lbl], i) => {
          const [x, y] = polar(angOf(v), 62);
          return <text key={i} x={x} y={y + 3} textAnchor="middle"
            fontFamily="var(--font-mono)" fontSize="8" fill="var(--ink-dim)">{lbl}</text>;
        })}
        {/* VU mark */}
        <text x="100" y="46" textAnchor="middle" fontFamily="var(--font-display)"
          fontStyle="italic" fontSize="14" fill="var(--ink-dim)">VU</text>
        {/* peak-hold needle (thinner, brass) sits behind the RMS needle */}
        {hold > MIN && (
          <g>
            <line x1={CX} y1={CY} x2={hpx} y2={hpy} stroke="var(--brass)" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx={hpx} cy={hpy} r="2.6" fill="var(--brass)" stroke="var(--brass-deep)" strokeWidth="0.8" />
          </g>
        )}
        {/* RMS needle */}
        <line x1={CX} y1={CY} x2={hx} y2={hy} stroke="var(--ink-strong)" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx={CX} cy={CY} r="5.5" fill="#3a2a1a" stroke="#1c140c" strokeWidth="1" />
      </svg>
    </div>
  );
}
