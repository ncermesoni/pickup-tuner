A square checkbox with an optional clickable label; the live example is the monitoring "Mute" toggle.

```jsx
const [mute, setMute] = React.useState(false);
<Checkbox checked={mute} label="Mute" onChange={setMute} />
```

- The check glyph renders in primary text on a neutral box; the box lightens on hover.
