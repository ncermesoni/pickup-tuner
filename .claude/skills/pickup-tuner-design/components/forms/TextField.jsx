import React from "react";

/**
 * Singleline text field — a recessed dark well sunk into the faceplate, with
 * cream text and a brass focus ring. Used for renaming a pickup row.
 */
export function TextField({ value, onChange, placeholder, width = 100, disabled = false, style }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) => onChange && onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        font: "var(--type-label)",
        fontSize: "var(--text-sm)",
        color: "var(--dial)",
        background: "var(--surface-well)",
        border: "1px solid var(--chassis-line)",
        borderRadius: "var(--radius-sm)",
        boxShadow: focused
          ? "var(--shadow-well), 0 0 0 1.5px var(--brass)"
          : "var(--shadow-well)",
        outline: "none",
        padding: "4px 9px",
        width: typeof width === "number" ? `${width}px` : width,
        height: "var(--field-h)",
        boxSizing: "border-box",
        ...style,
      }}
    />
  );
}
