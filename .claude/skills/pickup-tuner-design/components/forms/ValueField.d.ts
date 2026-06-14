import * as React from "react";

/**
 * A compact editable numeric readout on the faceplate — dark ink on cream with a
 * brass focus ring. Click to type or drag up/down to scrub. The numeric-entry
 * sibling of Slider's readout; use instead of an amber-on-dark editor.
 */
export interface ValueFieldProps {
  value: number;
  min?: number;
  max?: number;
  /** Scrub/round increment. Integer step → 0 decimals, else 1 (override with `decimals`). */
  step?: number;
  /** Force a fixed number of decimal places. */
  decimals?: number;
  /** Trailing unit, e.g. "dB" or "Hz". */
  suffix?: string;
  /** px width. Default 64. */
  width?: number;
  onChange?: (value: number) => void;
  style?: React.CSSProperties;
}

export function ValueField(props: ValueFieldProps): JSX.Element;
