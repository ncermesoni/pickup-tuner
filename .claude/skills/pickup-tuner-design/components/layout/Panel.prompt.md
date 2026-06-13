The section card that wraps every functional block, plus the spaced-uppercase caption it uses.

```jsx
<Panel label="Level" action={<Button size="small">Reset hold</Button>}>
  …meter…
</Panel>

<SectionLabel>Capture grid</SectionLabel>
```

- `Panel` is `--surface-card`, 8px radius, 10px padding.
- `label` prints a `SectionLabel`; `action` is a right-aligned slot in the header row.
- `SectionLabel` is exported separately for headers you compose by hand.
