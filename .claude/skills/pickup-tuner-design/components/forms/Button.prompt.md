A neutral rack-gear button; use for every clickable action — meaning comes from the label, not color.

```jsx
<Button onClick={arm}>Arm capture (Space)</Button>
<Button size="small">Reset hold</Button>
<Button tone="amber">Reconnect</Button>
```

- `size`: `"default"` (standard) or `"small"` (compact, e.g. "Reset hold").
- `tone`: tints the label only — `"neutral"` (default), `"green"`, `"amber"`, `"red"`. The fill always stays neutral; reserve tinted labels for status-bearing actions.
- Fill rests at `--surface-control` and lightens to `--surface-hover` on hover.
