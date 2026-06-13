One capture-grid cell — a heatmap tile showing the raise/lower instruction over the absolute level.

```jsx
<GridCell delta={-1.5} level={-12.7} balance={0.5} />   {/* amber: ↓ 1.5 */}
<GridCell delta={0.2} level={-14.2} selected />          {/* green: ✓ */}
<GridCell level={null} />                                {/* empty dash */}
<GridCell delta={3.1} level={-17.4} clipped />           {/* red + ⚠ */}
```

- `delta` is dB from the pickup row's median: positive = hotter → `↓ lower the pole`, negative = quieter → `↑ raise the pole`, within `balance` → `✓`.
- Color follows the same verdict: green / amber (within ~4× band) / red. Lay cells out on a 4px grid (`--grid-gap`).
