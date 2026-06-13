The chromatic tuner — a big warm-serif note over a centered needle dial. Up = in tune, left ♭ / right ♯.

```jsx
<Tuner reading={{ name: "A", octave: 2, cents: -1, frequency: 109.9 }} />
<Tuner reading={null} /> {/* idle dash */}
```

- Within ±3 cents the needle turns olive, a green enamel band lights, and an "in tune" lamp appears.
- `reading = null` (or omitted) shows the idle "—" and "no signal". Cents are clamped to ±50 on the dial.
