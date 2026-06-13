import * as React from "react";

/** A square checkbox with a clickable right-hand label (e.g. monitor "Mute"). */
export interface CheckboxProps {
  checked: boolean;
  label?: string;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export function Checkbox(props: CheckboxProps): JSX.Element;
