import React from "react";

/**
 * Segmented toggle — the RMS / Peak metric switch, styled as a recessed track
 * on the faceplate with a raised brass-tinted active segment.
 */
export function SegmentedToggle({ options, value, onChange, style }) {
  return (
    <div
      style={{
        display: "inline-flex",
        gap: "2px",
        padding: "2px",
        background: "rgba(40,28,12,0.14)",
        border: "1px solid var(--plate-edge)",
        borderRadius: "var(--radius-sm)",
        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.18)",
        ...style,
      }}
    >
      {options.map((opt) => {
        const val = typeof opt === "string" ? opt : opt.value;
        const label = typeof opt === "string" ? opt : opt.label;
        return (
          <Segment key={val} label={label} selected={val === value} onClick={() => onChange && onChange(val)} />
        );
      })}
    </div>
  );
}

function Segment({ label, selected, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        font: "var(--type-label)",
        fontSize: "var(--text-xs)",
        letterSpacing: "0.04em",
        color: selected ? "var(--ink-strong)" : "var(--text-muted)",
        background: selected ? "var(--surface-hover)" : hover ? "rgba(255,255,255,0.35)" : "transparent",
        border: selected ? "1px solid var(--plate-edge)" : "1px solid transparent",
        borderRadius: "3px",
        boxShadow: selected ? "var(--shadow-btn)" : "none",
        padding: "3px 13px",
        cursor: "pointer",
        transition: "background 90ms linear",
      }}
    >
      {label}
    </button>
  );
}
