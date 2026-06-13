import * as React from "react";

/**
 * The level meter — a vintage dual-needle VU on an ivory dial face. A dark RMS
 * needle rests on the level; a thinner brass peak-hold needle holds the highest
 * peak. The top of the arc is an oxblood "hot" zone. All values are dBFS
 * (floor −60).
 *
 * @startingPoint section="Instruments" subtitle="Analog VU level meter" viewport="700x190"
 */
export interface MeterProps {
  /** RMS / average level, dBFS — where the dark needle rests. */
  rms?: number;
  /** Peak hold (resettable), dBFS — the brass peak-hold needle. */
  hold?: number;
  /** SVG render height in px. Default 104. */
  height?: number;
  style?: React.CSSProperties;
}

export function Meter(props: MeterProps): JSX.Element;
