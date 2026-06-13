Inline status text that takes a signal color; use for the armed/capturing prompts, the CLIP alarm, and device banners.

```jsx
<StatusBadge tone="amber" lamp>armed — pluck the string…</StatusBadge>
<StatusBadge tone="green">capturing…</StatusBadge>
<StatusBadge tone="red" strong>CLIP</StatusBadge>
```

- `tone`: `"muted"` (default), `"green"`, `"amber"`, `"red"`.
- `lamp` adds a glowing dot; `strong` bolds the text (the CLIP alarm).
