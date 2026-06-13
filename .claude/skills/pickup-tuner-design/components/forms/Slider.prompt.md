A labeled slider with a live monospace readout; used for monitor gain, A4 reference, and the balance threshold.

```jsx
const [a4, setA4] = React.useState(440);
<Slider value={a4} min={415} max={466} label="A4 (Hz)" onChange={setA4} />
```

- `step` controls precision: integer steps show whole numbers, fractional steps show one decimal.
- Track and handle are intentionally neutral — sliders set values, they never carry status color.
