import React from "react";

/**
 * Capture-grid cell — an enamel chip on the faceplate. Background is the balance
 * verdict (clear green within ±balance, gold within ~4×, terracotta beyond, dim
 * cream if uncaptured). Shows the physical instruction (✓ / ↓ n / ↑ n) over the
 * absolute dBFS level in dark ink. States: `selected` (brass focus ring),
 * `target` (the live capture target — a pulsing brass ripple), `flash` (a brief
 * olive flash the instant a capture lands), `clipped` (⚠). Faithful to
 * src/ui/grid.rs.
 */
const AMBER_BAND = 4;

// inject the pulse/flash keyframes once
let stylesReady = false;
function ensureStyles() {
  if (stylesReady || typeof document === "undefined") return;
  stylesReady = true;
  const el = document.createElement("style");
  el.textContent = `
@keyframes ptcPulse {
  0%   { box-shadow: inset 0 0 0 2px var(--brass), 0 0 0 0 rgba(202,162,74,0.55), var(--shadow-cell); }
  70%,100% { box-shadow: inset 0 0 0 2px var(--brass), 0 0 0 8px rgba(202,162,74,0), var(--shadow-cell); }
}
@keyframes ptcFlash { from { opacity: 0.85; } to { opacity: 0; } }
@keyframes ptcArrow { 0%,100% { opacity: 0.45; } 50% { opacity: 1; } }`;
  document.head.appendChild(el);
}

function heat(delta, balance) {
  if (delta == null) return "var(--heat-empty)";
  const a = Math.abs(delta);
  if (a <= balance) return "var(--heat-balanced)";
  if (a <= balance * AMBER_BAND) return "var(--heat-close)";
  return "var(--heat-off)";
}
function instruction(delta, balance) {
  if (Math.abs(delta) <= balance) return "\u2713";
  return delta > 0 ? `\u2193 ${Math.abs(delta).toFixed(1)}` : `\u2191 ${Math.abs(delta).toFixed(1)}`;
}

export function GridCell({
  delta = null,
  level = null,
  balance = 0.5,
  selected = false,
  target = false,
  flash = false,
  clipped = false,
  onClick,
  style,
}) {
  ensureStyles();
  const captured = level != null;

  let boxShadow = "var(--shadow-cell)";
  if (selected) boxShadow = "inset 0 0 0 2px var(--ring-focus), var(--shadow-cell)";
  const animation = target ? "ptcPulse 1.15s ease-out infinite" : undefined;

  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        width: "var(--cell-w)",
        height: "var(--cell-h)",
        borderRadius: "var(--radius-sm)",
        background: heat(captured ? delta : null, balance),
        boxShadow: target ? "var(--shadow-cell)" : boxShadow,
        animation,
        cursor: onClick ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1px",
        ...style,
      }}
    >
      {captured ? (
        <>
          <span style={{ font: "var(--type-readout)", fontSize: "var(--text-md)",
                         color: "var(--ink-strong)", fontVariantNumeric: "tabular-nums" }}>
            {delta != null ? instruction(delta, balance) : ""}
          </span>
          <span style={{ font: "var(--type-readout-sm)", color: "rgba(36,27,16,0.66)",
                         fontVariantNumeric: "tabular-nums" }}>
            {level.toFixed(1)} dB
          </span>
          {clipped && (
            <span style={{ position: "absolute", top: "3px", right: "5px",
                           color: "var(--oxblood)", fontSize: "11px", lineHeight: 1 }}>
              {"\u26A0"}
            </span>
          )}
        </>
      ) : target ? (
        <span style={{ color: "var(--brass-deep)", fontSize: "16px", lineHeight: 1,
                       animation: "ptcArrow 1.15s ease-in-out infinite" }}>{"\u25B8"}</span>
      ) : (
        <span style={{ color: "var(--ink-faint)", fontSize: "14px" }}>{"\u2014"}</span>
      )}

      {flash && (
        <span style={{ position: "absolute", inset: 0, borderRadius: "var(--radius-sm)",
                       background: "var(--olive)", animation: "ptcFlash 0.55s ease-out forwards",
                       pointerEvents: "none" }} />
      )}
    </div>
  );
}
