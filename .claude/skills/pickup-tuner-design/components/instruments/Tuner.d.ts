import * as React from "react";

/** A detected note: name + octave, cents offset, and frequency in Hz. */
export interface NoteReading {
  name: string;   // "A", "C#", …
  octave: number; // 4
  cents: number;  // signed offset, clamped to ±50 on the dial
  frequency: number; // Hz
}

/**
 * Chromatic needle tuner on an ivory dial face. Straight up = in tune; left ♭,
 * right ♯. A green enamel band marks the ±3-cent in-tune zone and an "in tune"
 * lamp lights when centered. `reading = null` shows the idle dash.
 *
 * @startingPoint section="Instruments" subtitle="Centered-needle chromatic tuner" viewport="700x230"
 */
export interface TunerProps {
  reading?: NoteReading | null;
  /** Well height in px. Default 110. */
  height?: number;
  style?: React.CSSProperties;
}

export function Tuner(props: TunerProps): JSX.Element;
