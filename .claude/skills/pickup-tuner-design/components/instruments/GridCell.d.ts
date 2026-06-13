import * as React from "react";

/**
 * One capture-grid cell: a heatmap tile whose color is the balance verdict and
 * whose label is the physical instruction (✓ / ↓ n / ↑ n) over the absolute
 * dBFS level. Faithful to src/ui/grid.rs.
 */
export interface GridCellProps {
  /** dB distance from the pickup row's median. null = not yet captured. */
  delta?: number | null;
  /** Absolute level in dBFS. null = not yet captured (renders the dash). */
  level?: number | null;
  /** Balance band (±dB) that counts as ✓. Default 0.5. */
  balance?: number;
  selected?: boolean;
  /** Show the ⚠ clip flag. */
  clipped?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function GridCell(props: GridCellProps): JSX.Element;
