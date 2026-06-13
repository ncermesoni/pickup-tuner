import React from "react";

/**
 * Numeric stepper — a compact faceplate field showing an integer with ▴/▾
 * nudges, clamped to [min, max]. Used for the grid's strings / pickups counts.
 */
export function Stepper({ value, min = 0, max = 99, onChange, label, style }) {
  const clamp = (v) => Math.max(min, Math.min(max, v));
  const set = (v) => onChange && onChange(clamp(v));

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-3)", ...style }}>
      {label && (
        <span style={{ font: "var(--type-label)", color: "var(--text-primary)" }}>{label}</span>
      )}
      <div
        style={{
          display: "inline-flex",
          alignItems: "stretch",
          background: "var(--surface-control)",
          border: "1px solid var(--plate-edge)",
          borderRadius: "var(--radius-sm)",
          boxShadow: "var(--shadow-btn)",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            font: "var(--type-readout)",
            fontSize: "var(--text-sm)",
            color: "var(--ink-strong)",
            fontVariantNumeric: "tabular-nums",
            padding: "4px 10px",
            minWidth: "16px",
            textAlign: "center",
          }}
        >
          {value}
        </span>
        <div style={{ display: "flex", flexDirection: "column", borderLeft: "1px solid var(--plate-edge)" }}>
          <Nudge dir={"\u25B4"} onClick={() => set(value + 1)} disabled={value >= max} />
          <Nudge dir={"\u25BE"} onClick={() => set(value - 1)} disabled={value <= min} />
        </div>
      </div>
    </div>
  );
}

function Nudge({ dir, onClick, disabled }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        flex: 1,
        border: "none",
        background: hover && !disabled ? "var(--surface-hover)" : "rgba(40,28,12,0.06)",
        color: disabled ? "var(--text-disabled)" : "var(--text-muted)",
        fontSize: "8px",
        lineHeight: 1,
        width: "18px",
        padding: 0,
        cursor: disabled ? "default" : "pointer",
      }}
    >
      {dir}
    </button>
  );
}
