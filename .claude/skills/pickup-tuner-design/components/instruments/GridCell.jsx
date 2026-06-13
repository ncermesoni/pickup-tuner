import React from "react";

/**
 * Capture-grid cell — an enamel chip on the faceplate. Background is the balance
 * verdict (clear green within ±balance, gold within ~4×, terracotta beyond, dim
 * cream if uncaptured). Shows the physical instruction (✓ / ↓ n / ↑ n) over the
 * absolute dBFS level in dark ink, a brass focus ring when selected, and a ⚠
 * when the capture clipped. Faithful to src/ui/grid.rs.
 */
const AMBER_BAND = 4;

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
  clipped = false,
  onClick,
  style,
}) {
  const captured = level != null;
  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        width: "var(--cell-w)",
        height: "var(--cell-h)",
        borderRadius: "var(--radius-sm)",
        background: heat(captured ? delta : null, balance),
        boxShadow: selected
          ? "inset 0 0 0 2px var(--ring-focus), var(--shadow-cell)"
          : "var(--shadow-cell)",
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
      ) : (
        <span style={{ color: "var(--ink-faint)", fontSize: "14px" }}>{"\u2014"}</span>
      )}
    </div>
  );
}
