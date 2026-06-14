import React from "react";

/**
 * ValueField — a compact editable numeric readout on the faceplate. Dark ink on
 * the cream control face with a brass focus ring (NOT amber-on-dark). Click to
 * type, or drag up/down to scrub; clamped to [min, max] and snapped to `step`.
 * This is the numeric-entry sibling of Slider's readout — reach for it instead
 * of hand-rolling an editable dB/Hz box.
 */
export function ValueField({
  value, min = -Infinity, max = Infinity, step = 0.1, suffix, decimals,
  width = 64, onChange, style,
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const drag = React.useRef(null);

  const dp = decimals != null ? decimals : (Number.isInteger(step) ? 0 : 1);
  const clamp = (v) => Math.max(min, Math.min(max, v));
  const commit = (raw) => {
    const n = parseFloat(raw);
    if (!Number.isNaN(n)) onChange && onChange(clamp(+n.toFixed(dp)));
    setEditing(false);
  };

  const onMouseDown = (e) => {
    if (editing) return;
    drag.current = { y: e.clientY, v: value, moved: false };
    const move = (ev) => {
      if (!drag.current) return;
      const dy = drag.current.y - ev.clientY;
      if (Math.abs(dy) > 2) drag.current.moved = true;
      onChange && onChange(clamp(+(drag.current.v + dy * step).toFixed(dp)));
    };
    const up = () => {
      const moved = drag.current && drag.current.moved;
      drag.current = null;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      if (!moved) { setDraft(String(value)); setEditing(true); }
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const shell = {
    display: "inline-flex",
    alignItems: "baseline",
    gap: "3px",
    background: "var(--surface-control)",
    border: "1px solid var(--plate-edge)",
    borderRadius: "var(--radius-sm)",
    boxShadow: focused ? "var(--shadow-btn), 0 0 0 1.5px var(--brass)" : "var(--shadow-btn)",
    padding: "3px 8px",
    width,
    boxSizing: "border-box",
    cursor: editing ? "text" : "ns-resize",
    ...style,
  };
  const numStyle = {
    font: "var(--type-readout)",
    fontSize: "var(--text-sm)",
    color: "var(--ink-strong)",
    fontVariantNumeric: "tabular-nums",
  };

  return (
    <span style={shell} onMouseDown={onMouseDown}>
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); commit(draft); }}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit(draft);
            else if (e.key === "Escape") setEditing(false);
          }}
          style={{ ...numStyle, width: "100%", background: "transparent", border: "none", outline: "none", padding: 0 }}
        />
      ) : (
        <span style={numStyle}>{value.toFixed(dp)}</span>
      )}
      {suffix && <span style={{ font: "var(--type-label)", fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{suffix}</span>}
    </span>
  );
}
