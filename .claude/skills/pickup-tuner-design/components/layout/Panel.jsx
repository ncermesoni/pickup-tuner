import React from "react";
import { SectionLabel } from "./SectionLabel.jsx";

/**
 * Faceplate panel — the raised cream control panel that wraps every functional
 * block. Cream gradient, machined hairline edge, top bevel highlight and a soft
 * cast shadow. Pass a `label` to silkscreen the engraved caption at the top.
 */
export function Panel({ label, action, children, style }) {
  return (
    <div
      style={{
        background: "var(--grad-plate)",
        border: "1px solid var(--plate-edge)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-plate)",
        padding: "var(--space-5)",
        ...style,
      }}
    >
      {(label || action) && (
        <div style={{ display: "flex", alignItems: "center", marginBottom: "var(--space-3)" }}>
          {label && <SectionLabel>{label}</SectionLabel>}
          {action && <div style={{ marginLeft: "auto" }}>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
