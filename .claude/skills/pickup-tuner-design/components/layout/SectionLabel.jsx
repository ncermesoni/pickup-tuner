import React from "react";

/**
 * Spaced-uppercase engraved caption (Oswald) — titles a faceplate block in dim
 * ink, like silkscreen on a panel.
 */
export function SectionLabel({ children, style }) {
  return (
    <span
      style={{
        font: "var(--type-caption)",
        color: "var(--text-muted)",
        letterSpacing: "var(--tracking-label)",
        textTransform: "uppercase",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
