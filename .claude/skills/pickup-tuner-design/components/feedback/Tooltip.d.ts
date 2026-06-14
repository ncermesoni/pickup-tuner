import * as React from "react";

/**
 * A help bubble on the dark tweed chassis with cream text — guaranteed contrast.
 * Wraps a trigger and shows on hover/focus; long copy wraps at `maxWidth`.
 *
 * @startingPoint section="Feedback" subtitle="Help tooltip (cream-on-chassis)" viewport="700x150"
 */
export interface TooltipProps {
  /** Bubble contents — string or nodes. */
  content: React.ReactNode;
  placement?: "top" | "bottom";
  /** Max bubble width in px before the text wraps. Default 240. */
  maxWidth?: number;
  /** The trigger element the tooltip is attached to. */
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Tooltip(props: TooltipProps): JSX.Element;
