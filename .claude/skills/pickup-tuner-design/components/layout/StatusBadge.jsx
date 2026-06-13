import React from "react";

/**
 * Inline status text — an enamel-colored status line with an optional glowing
 * lamp. Olive = balanced / in tune / capturing, amber = armed / getting hot,
 * oxblood = clipping / error. Renders on either the cream faceplate or the dark
 * tweed chassis (set `onDark` for the chassis).
 */
export function StatusBadge({ children, tone = "muted", lamp = false, strong = false, onDark = false, style }) {
  const color = {
    muted: onDark ? "var(--text-on-chassis-dim)" : "var(--text-muted)",
    olive: "var(--olive)",
    green: "var(--olive)",
    amber: "var(--amber)",
    red: "var(--oxblood)",
    brass: "var(--brass)",
  }[tone];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
        font: "var(--type-label)",
        fontWeight: strong ? "var(--weight-strong)" : "var(--weight-medium)",
        letterSpacing: "var(--tracking-normal)",
        color,
        ...style,
      }}
    >
      {lamp && (
        <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: color,
                       boxShadow: tone === "muted" ? "none" : "0 0 7px currentColor" }} />
      )}
      {children}
    </span>
  );
}
