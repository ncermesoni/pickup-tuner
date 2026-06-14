A help tooltip rendered on the dark chassis with cream text — use it for the inline help on settings like the grid balance threshold.

```jsx
<Tooltip content="how close to the row median a string must be to count as balanced (green / ✓)">
  <span style={{ color: "var(--text-muted)", cursor: "help" }}>balanced within ± dB</span>
</Tooltip>
```

- Fill is `--chassis` with `--text-on-chassis` (cream) text — never faceplate ink, which would be dark-on-dark.
- `maxWidth` (default 240) wraps long copy; `placement` is `"top"` or `"bottom"`.
