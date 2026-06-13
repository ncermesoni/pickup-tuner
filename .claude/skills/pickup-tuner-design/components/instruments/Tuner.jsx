import React from "react";

/**
 * Chromatic tuner — centered needle on an ivory dial face. Straight up = in
 * tune; the needle swings left for flat (♭) and right for sharp (♯). A green
 * enamel band sits across the top-center "in tune" zone (±3 cents). The note is
 * a big warm serif; pass reading=null for the idle dash. Faithful intent of
 * src/ui/tuner.rs, restyled for the Analog VU direction.
 */
const IN_TUNE = 3;
const CX = 100, CY = 104, ARC_R = 86, SPAN = 52; // degrees each side of vertical
const MARKS = [-50, -25, 0, 25, 50];

const clampC = (c) => Math.max(-50, Math.min(50, c));
const angOf = (c) => 90 - (clampC(c) / 50) * SPAN; // 90°=up=in tune
const polar = (deg, r) => [
  CX + r * Math.cos((deg * Math.PI) / 180),
  CY - r * Math.sin((deg * Math.PI) / 180),
];

export function Tuner({ reading = null, height = 104, style }) {
  const inTune = reading && Math.abs(reading.cents) < IN_TUNE;
  const [ax0, ay0] = polar(angOf(-50), ARC_R);
  const [ax1, ay1] = polar(angOf(50), ARC_R);
  const [gx0, gy0] = polar(angOf(-5), ARC_R);
  const [gx1, gy1] = polar(angOf(5), ARC_R);
  const [bx, by] = polar(angOf(-50), ARC_R + 12);
  const [sx, sy] = polar(angOf(50), ARC_R + 12);
  const [nx, ny] = reading ? polar(angOf(reading.cents), 80) : polar(90, 80);

  return (
    <div
      style={{
        background: "var(--grad-dial)",
        border: "1px solid var(--dial-edge)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-dial)",
        padding: "12px 14px 10px",
        textAlign: "center",
        ...style,
      }}
    >
      {/* note */}
      <div style={{ font: "var(--type-display)", color: reading ? "var(--ink-strong)" : "var(--text-disabled)",
                    lineHeight: 1 }}>
        {reading ? <>{reading.name}<span style={{ fontSize: "26px", opacity: 0.55 }}>{reading.octave}</span></>
                 : "\u2014"}
      </div>

      {/* dial */}
      <svg viewBox="0 0 200 112" style={{ width: "100%", height, display: "block" }}>
        <path d={`M ${ax0} ${ay0} A ${ARC_R} ${ARC_R} 0 0 1 ${ax1} ${ay1}`}
          fill="none" stroke="var(--plate-edge)" strokeWidth="2" />
        {/* in-tune enamel band */}
        <path d={`M ${gx0} ${gy0} A ${ARC_R} ${ARC_R} 0 0 1 ${gx1} ${gy1}`}
          fill="none" stroke="var(--olive)" strokeWidth="5" strokeLinecap="round" />
        {MARKS.map((m, i) => {
          const a = angOf(m);
          const [x1, y1] = polar(a, ARC_R + 2);
          const [x2, y2] = polar(a, m === 0 ? ARC_R - 11 : ARC_R - 7);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ink-dim)" strokeWidth={m === 0 ? 1.6 : 1} />;
        })}
        <text x={bx} y={by + 4} textAnchor="middle" fontFamily="var(--font-display)" fontSize="14" fill="var(--ink-dim)">&#9837;</text>
        <text x={sx} y={sy + 4} textAnchor="middle" fontFamily="var(--font-display)" fontSize="14" fill="var(--ink-dim)">&#9839;</text>
        {/* needle */}
        <line x1={CX} y1={CY} x2={nx} y2={ny}
          stroke={inTune ? "var(--olive-deep)" : "var(--ink-strong)"} strokeWidth="2.6" strokeLinecap="round" />
        <circle cx={CX} cy={CY} r="5.5" fill="#3a2a1a" stroke="#1c140c" strokeWidth="1" />
      </svg>

      {/* sub-readout */}
      <div style={{ font: "var(--type-readout)", fontSize: "var(--text-xs)", color: "var(--text-muted)",
                    fontVariantNumeric: "tabular-nums", marginTop: "2px" }}>
        {reading
          ? <>{reading.cents >= 0 ? "+" : ""}{Math.round(reading.cents)} cents &middot; {reading.frequency.toFixed(1)} Hz</>
          : "no signal"}
      </div>

      {/* in-tune lamp */}
      {inTune && (
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "6px",
                      font: "var(--font-ui)", fontSize: "10px", fontWeight: "var(--weight-strong)",
                      letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--olive-deep)" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--olive)",
                         boxShadow: "0 0 8px var(--olive)" }} />
          in tune
        </div>
      )}
    </div>
  );
}
