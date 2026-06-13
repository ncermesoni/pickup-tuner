import * as React from "react";

/**
 * Combo box matching egui ComboBox::from_label: the value box renders first and
 * the label sits to its right. Opens a simple dropdown of options on click.
 */
export interface SelectProps {
  /** Caption shown to the RIGHT of the box (egui convention). Optional. */
  label?: string;
  value: string;
  options: string[];
  onChange?: (value: string) => void;
  /** Shown when value is empty. Defaults to "(default)". */
  placeholder?: string;
  style?: React.CSSProperties;
}

export function Select(props: SelectProps): JSX.Element;
