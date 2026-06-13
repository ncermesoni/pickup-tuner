A compact segmented switch for 2–3 mutually exclusive options; the live example is the grid's RMS / Peak metric toggle.

```jsx
const [metric, setMetric] = React.useState("RMS");
<SegmentedToggle options={["RMS", "Peak"]} value={metric} onChange={setMetric} />
```

- `options`: array of strings, or `{ value, label }` pairs.
- The active segment fills `--surface-hover` with primary text; the rest stay muted and lighten on hover.
