import * as React from "react";

/**
 * A neutral rack-gear button. Every button shares the same chrome — meaning lives
 * in the label, not the fill. `tone` only tints the text for status-bearing actions.
 *
 * @startingPoint section="Forms" subtitle="Neutral desktop button, default + small" viewport="700x150"
 */
export interface ButtonProps {
  children: React.ReactNode;
  /** default = standard control height; small = compact (egui small_button) */
  size?: "default" | "small";
  /** Tints the label only; the fill always stays neutral. */
  tone?: "neutral" | "olive" | "amber" | "red" | "brass";
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}

export function Button(props: ButtonProps): JSX.Element;
