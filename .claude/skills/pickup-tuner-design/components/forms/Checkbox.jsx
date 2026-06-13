import React from "react";

/**
 * Checkbox — a raised faceplate box; the check renders in dark ink. Label sits
 * to the right and is clickable.
 */
export function Checkbox({ checked, label, onChange, disabled = false, style }) {
  const [hover, setHover] = React.useState(false);
  return (
    <label
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-3)",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        userSelect: "none",
        ...style,
      }}
    >
      <span
        onClick={() => !disabled && onChange && onChange(!checked)}
        style={{
          width: "17px",
          height: "17px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: hover && !disabled ? "var(--surface-hover)" : "var(--surface-control)",
          border: "1px solid var(--plate-edge)",
          borderRadius: "var(--radius-sm)",
          boxShadow: "var(--shadow-btn)",
          color: "var(--ink-strong)",
          fontSize: "12px",
          lineHeight: 1,
          transition: "background 90ms linear",
        }}
      >
        {checked ? "\u2713" : ""}
      </span>
      {label && (
        <span style={{ font: "var(--type-label)", color: "var(--text-primary)" }}>{label}</span>
      )}
    </label>
  );
}
