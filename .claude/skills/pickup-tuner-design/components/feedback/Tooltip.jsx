import React from "react";

/**
 * Tooltip — a help bubble on the dark tweed chassis with CREAM text
 * (--text-on-chassis), so it always clears contrast. Wraps a trigger element
 * and shows on hover/focus. Has a max-width so long help copy wraps instead of
 * stretching off-panel. NEVER style tooltip text with faceplate ink (dark ink
 * on a dark bubble is the contrast bug this primitive exists to prevent).
 */
export function Tooltip({ content, placement = "top", maxWidth = 240, children, style }) {
  const [open, setOpen] = React.useState(false);

  const pos =
    placement === "bottom"
      ? { top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" }
      : { bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" };

  const arrow =
    placement === "bottom"
      ? { top: -4, left: "50%", marginLeft: -4 }
      : { bottom: -4, left: "50%", marginLeft: -4 };

  return (
    <span
      style={{ position: "relative", display: "inline-flex", ...style }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          style={{
            position: "absolute",
            ...pos,
            zIndex: 40,
            maxWidth,
            width: "max-content",
            background: "var(--chassis)",
            color: "var(--text-on-chassis)",
            border: "1px solid var(--chassis-line)",
            borderRadius: "var(--radius-sm)",
            boxShadow: "0 8px 22px rgba(0,0,0,0.55)",
            padding: "7px 10px",
            font: "var(--type-label)",
            lineHeight: "var(--leading-normal)",
            textAlign: "left",
            pointerEvents: "none",
            whiteSpace: "normal",
          }}
        >
          {content}
          <span
            style={{
              position: "absolute",
              ...arrow,
              width: 8,
              height: 8,
              background: "var(--chassis)",
              borderRight: "1px solid var(--chassis-line)",
              borderBottom: "1px solid var(--chassis-line)",
              transform: "rotate(45deg)",
            }}
          />
        </span>
      )}
    </span>
  );
}
