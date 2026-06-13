import React from "react";

/**
 * Combo box — a raised faceplate value box with the label to its right. Click
 * toggles a dropdown list. Styled to match the panel buttons.
 */
export function Select({ label, value, options, onChange, placeholder = "(default)", style }) {
  const [open, setOpen] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", ...style }}>
      <div ref={ref} style={{ position: "relative" }}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
            minWidth: "150px",
            font: "var(--type-label)",
            fontSize: "var(--text-sm)",
            color: value ? "var(--ink-strong)" : "var(--text-muted)",
            background: hover ? "var(--surface-hover)" : "var(--surface-control)",
            border: "1px solid var(--plate-edge)",
            borderRadius: "var(--radius-sm)",
            boxShadow: "var(--shadow-btn)",
            padding: "var(--control-pad-y) var(--control-pad-x)",
            cursor: "pointer",
            transition: "background 90ms linear",
          }}
        >
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {value || placeholder}
          </span>
          <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>&#9662;</span>
        </button>
        {open && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 3px)",
              left: 0,
              minWidth: "100%",
              background: "var(--grad-plate)",
              border: "1px solid var(--plate-edge)",
              borderRadius: "var(--radius-sm)",
              boxShadow: "0 10px 26px rgba(0,0,0,0.45)",
              padding: "3px",
              zIndex: 20,
            }}
          >
            {options.map((opt) => (
              <Option key={opt} label={opt} selected={opt === value}
                onClick={() => { onChange && onChange(opt); setOpen(false); }} />
            ))}
          </div>
        )}
      </div>
      {label && (
        <span style={{ font: "var(--type-label)", color: "var(--text-primary)" }}>{label}</span>
      )}
    </div>
  );
}

function Option({ label, selected, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        font: "var(--type-label)",
        fontSize: "var(--text-sm)",
        color: "var(--ink-strong)",
        background: hover ? "var(--surface-hover)" : selected ? "rgba(202,162,74,0.28)" : "transparent",
        borderRadius: "3px",
        padding: "5px 10px",
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  );
}
