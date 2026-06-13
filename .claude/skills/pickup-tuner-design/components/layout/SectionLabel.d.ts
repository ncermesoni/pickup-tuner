import * as React from "react";

/** Spaced-uppercase dim caption that titles a block (egui section_label). */
export interface SectionLabelProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function SectionLabel(props: SectionLabelProps): JSX.Element;
