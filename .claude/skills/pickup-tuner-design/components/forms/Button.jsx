import React from "react";

/**
 * Faceplate button — a raised control on the cream panel. Slightly darker cream
 * face, machined hairline edge, top bevel highlight; lightens on hover and
 * presses 0.5px down. Meaning lives in the label; `tone` only tints the ink for
 * status-bearing actions.
 */
export function Button({
  children,
  size = "default",
  tone = "neutral",
  disabled = false,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);

  const small = size === "small";
  const toneColor = {
    neutral: "var(--ink)",
    olive: "var(--olive-deep)",
    amber: "var(--amber)",
    red: "var(--oxblood)",
    brass: "var(--brass-deep)",
  }[tone];

  const base = {
    font: "var(--type-label)",
    fontSize: small ? "var(--text-xs)" : "var(--text-sm)",
    letterSpacing: "0.04em",
    color: disabled ? "var(--text-disabled)" : toneColor,
    background: hover && !disabled ? "var(--surface-hover)" : "var(--surface-control)",
    border: "1px solid var(--plate-edge)",
    borderRadius: "var(--radius-sm)",
    boxShadow: disabled ? "none" : "var(--shadow-btn)",
    padding: small ? "3px 9px" : "var(--control-pad-y) var(--control-pad-x)",
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transform: active && !disabled ? "translateY(0.5px)" : "none",
    transition: "background 90ms linear",
    userSelect: "none",
    whiteSpace: "nowrap",
    ...style,
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={base}
      {...rest}
    >
      {children}
    </button>
  );
}
