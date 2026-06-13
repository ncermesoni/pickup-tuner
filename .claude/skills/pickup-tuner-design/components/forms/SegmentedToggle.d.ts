import * as React from "react";

/** One segment, either a bare string (used as both value and label) or a pair. */
export type SegmentOption = string | { value: string; label: string };

/**
 * A small two-or-three-way segmented switch (e.g. the RMS / Peak metric toggle).
 *
 * @startingPoint section="Forms" subtitle="RMS / Peak style segmented switch" viewport="700x120"
 */
export interface SegmentedToggleProps {
  options: SegmentOption[];
  value: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}

export function SegmentedToggle(props: SegmentedToggleProps): JSX.Element;
