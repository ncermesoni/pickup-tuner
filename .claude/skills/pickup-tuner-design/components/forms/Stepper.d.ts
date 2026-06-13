import * as React from "react";

/** Compact integer stepper (egui DragValue) with ▴/▾ nudges, clamped to a range. */
export interface StepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  /** Caption to the LEFT of the field, e.g. "strings:". */
  label?: string;
  style?: React.CSSProperties;
}

export function Stepper(props: StepperProps): JSX.Element;
