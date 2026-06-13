import * as React from "react";

/** Singleline text input (egui TextEdit) — the pickup-name rename field. */
export interface TextFieldProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** px number or any CSS width string. Defaults to 100. */
  width?: number | string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export function TextField(props: TextFieldProps): JSX.Element;
