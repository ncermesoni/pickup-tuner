import * as React from "react";

/**
 * Horizontal slider with a live numeric readout and a trailing caption — the
 * monitor gain, A4 reference, and balance-threshold controls all use this.
 */
export interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  /** Trailing caption, e.g. "gain (dB)" or "A4 (Hz)". */
  label?: string;
  /** Alias for label. */
  suffix?: string;
  onChange?: (value: number) => void;
  style?: React.CSSProperties;
}

export function Slider(props: SliderProps): JSX.Element;
