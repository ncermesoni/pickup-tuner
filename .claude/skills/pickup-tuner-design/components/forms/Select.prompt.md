A combo box for device / rate / channel pickers; the label sits to the right of the box, matching egui.

```jsx
<Select label="Driver" value={driver} options={["ASIO", "Windows Audio"]} onChange={setDriver} />
```

- `label` renders to the right of the value box; omit for a bare combo.
- Empty `value` shows `placeholder` (default `"(default)"`).
- Clicking opens a dropdown; the current option is washed with `--select-wash`.
