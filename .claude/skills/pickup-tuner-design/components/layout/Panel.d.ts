import * as React from "react";

/**
 * The section frame that wraps a functional block. Optional spaced-uppercase
 * caption and a right-aligned action slot.
 *
 * @startingPoint section="Layout" subtitle="Section card with caption + action slot" viewport="700x200"
 */
export interface PanelProps {
  /** Spaced-uppercase caption printed at the top, e.g. "Level". */
  label?: string;
  /** Right-aligned control in the header row, e.g. a "Reset hold" button. */
  action?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Panel(props: PanelProps): JSX.Element;
