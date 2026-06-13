import React from "react";

/**
 * Labeled slider — a recessed faceplate track with a brass-capped handle and a
 * live mono readout. Used for monitor gain, A4 reference and the balance band.
 */
export function Slider({ value, min = 0, max = 100, step = 1, label, suffix, onChange, style }) {
  const pct = ((value - min) / (max - min)) * 100;
  const display = Number.isInteger(step) ? value : value.toFixed(1);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", ...style }}>
      <div style={{ position: "relative", flex: 1, height: "18px", display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", left: 0, right: 0, height: "5px",
                      background: "rgba(40,28,12,0.18)", borderRadius: "3px",
                      boxShadow: "inset 0 1px 2px rgba(0,0,0,0.25)" }} />
        <div style={{ position: "absolute", left: 0, width: `${pct}%`, height: "5px",
                      background: "var(--brass-deep)", borderRadius: "3px", opacity: 0.55 }} />
        <div style={{ position: "absolute", left: `calc(${pct}% - 7px)`, width: "14px", height: "14px",
                      background: "radial-gradient(circle at 36% 30%, #e9d49a, var(--brass))",
                      borderRadius: "50%", border: "1px solid var(--brass-deep)",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.4)" }} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange && onChange(parseFloat(e.target.value))}
          style={{ position: "absolute", left: 0, right: 0, width: "100%", height: "18px",
                   margin: 0, opacity: 0, cursor: "pointer" }}
        />
      </div>
      <span style={{ font: "var(--type-readout)", fontSize: "var(--text-sm)",
                     color: "var(--ink-strong)", fontVariantNumeric: "tabular-nums",
                     minWidth: "46px", textAlign: "right" }}>
        {display}
      </span>
      {(label || suffix) && (
        <span style={{ font: "var(--type-label)", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
          {label || suffix}
        </span>
      )}
    </div>
  );
}
