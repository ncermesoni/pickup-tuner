A compact editable numeric readout for the faceplate — the right control for an editable dB / Hz / threshold value (replaces hand-rolled amber-on-dark editors).

```jsx
const [balance, setBalance] = React.useState(0.5);
<ValueField value={balance} min={0.1} max={3} step={0.1} suffix="dB" onChange={setBalance} />
```

- Dark `--ink-strong` figure on the cream control face; brass focus ring — high contrast at rest and while editing.
- Click to type (Enter commits, Esc cancels) or drag up/down to scrub. Clamped to `[min, max]`.
