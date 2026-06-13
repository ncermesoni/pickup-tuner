A compact numeric stepper for small integer counts; the live use is the grid's strings / pickups shape controls.

```jsx
const [strings, setStrings] = React.useState(6);
<Stepper label="strings:" value={strings} min={4} max={12} onChange={setStrings} />
```

- Value is clamped to `[min, max]`; the ▴/▾ nudges disable at the bounds.
