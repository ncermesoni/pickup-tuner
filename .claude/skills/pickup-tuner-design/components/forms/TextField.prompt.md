A singleline text field that sits in the darkest inset well; the live use is renaming a pickup row (Neck / Bridge…).

```jsx
const [name, setName] = React.useState("Bridge");
<TextField value={name} onChange={setName} width={100} />
```

- Background is `--surface-well` (the darkest tone); a `--ring-focus` outline appears on focus.
