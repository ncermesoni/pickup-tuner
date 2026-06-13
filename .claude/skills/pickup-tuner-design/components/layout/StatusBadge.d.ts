import * as React from "react";

/**
 * Inline status text — an enamel-colored status line with an optional glowing
 * lamp. Used for "armed — pluck the string…", "capturing…", "CLIP", device
 * banners, etc. Set `onDark` when it sits on the tweed chassis (e.g. status bar).
 */
export interface StatusBadgeProps {
  children: React.ReactNode;
  tone?: "muted" | "olive" | "green" | "amber" | "red" | "brass";
  /** Show a leading glowing lamp dot in the tone color. */
  lamp?: boolean;
  /** Bold weight (e.g. the "CLIP" alarm). */
  strong?: boolean;
  /** Render for the dark tweed chassis instead of the cream faceplate. */
  onDark?: boolean;
  style?: React.CSSProperties;
}

export function StatusBadge(props: StatusBadgeProps): JSX.Element;
