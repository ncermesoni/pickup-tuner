/* @ds-bundle: {"format":3,"namespace":"PickupTunerDesignSystem_dfbad4","components":[{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"SegmentedToggle","sourcePath":"components/forms/SegmentedToggle.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Slider","sourcePath":"components/forms/Slider.jsx"},{"name":"Stepper","sourcePath":"components/forms/Stepper.jsx"},{"name":"TextField","sourcePath":"components/forms/TextField.jsx"},{"name":"ValueField","sourcePath":"components/forms/ValueField.jsx"},{"name":"GridCell","sourcePath":"components/instruments/GridCell.jsx"},{"name":"Meter","sourcePath":"components/instruments/Meter.jsx"},{"name":"Tuner","sourcePath":"components/instruments/Tuner.jsx"},{"name":"Panel","sourcePath":"components/layout/Panel.jsx"},{"name":"SectionLabel","sourcePath":"components/layout/SectionLabel.jsx"},{"name":"StatusBadge","sourcePath":"components/layout/StatusBadge.jsx"}],"sourceHashes":{"components/feedback/Tooltip.jsx":"ce5be540d357","components/forms/Button.jsx":"ec09a8fd3674","components/forms/Checkbox.jsx":"8da15e51ece5","components/forms/SegmentedToggle.jsx":"82ff72d42d7a","components/forms/Select.jsx":"7e910681077a","components/forms/Slider.jsx":"3293d1125f2b","components/forms/Stepper.jsx":"4c05533fffdc","components/forms/TextField.jsx":"4e03d9b15d46","components/forms/ValueField.jsx":"3873e3e8460e","components/instruments/GridCell.jsx":"0507c61a5001","components/instruments/Meter.jsx":"f55b0b646c73","components/instruments/Tuner.jsx":"6d4eb1e541e5","components/layout/Panel.jsx":"b31e598f039d","components/layout/SectionLabel.jsx":"d8bc2abf3fe9","components/layout/StatusBadge.jsx":"cd9b6c0c10f6","ui_kits/pickup-tuner/App.jsx":"7f72ef99fbdd","ui_kits/pickup-tuner/CaptureGrid.jsx":"b08baeac0da6","ui_kits/pickup-tuner/ConfigPanel.jsx":"ab04ad567f50","ui_kits/pickup-tuner/StatusBar.jsx":"5caba8a3a9e1","ui_kits/pickup-tuner/model.js":"221a7b558786"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.PickupTunerDesignSystem_dfbad4 = window.PickupTunerDesignSystem_dfbad4 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/feedback/Tooltip.jsx
try { (() => {
/**
 * Tooltip — a help bubble on the dark tweed chassis with CREAM text
 * (--text-on-chassis), so it always clears contrast. Wraps a trigger element
 * and shows on hover/focus. Has a max-width so long help copy wraps instead of
 * stretching off-panel. NEVER style tooltip text with faceplate ink (dark ink
 * on a dark bubble is the contrast bug this primitive exists to prevent).
 */
function Tooltip({
  content,
  placement = "top",
  maxWidth = 240,
  children,
  style
}) {
  const [open, setOpen] = React.useState(false);
  const pos = placement === "bottom" ? {
    top: "calc(100% + 8px)",
    left: "50%",
    transform: "translateX(-50%)"
  } : {
    bottom: "calc(100% + 8px)",
    left: "50%",
    transform: "translateX(-50%)"
  };
  const arrow = placement === "bottom" ? {
    top: -4,
    left: "50%",
    marginLeft: -4
  } : {
    bottom: -4,
    left: "50%",
    marginLeft: -4
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "inline-flex",
      ...style
    },
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false)
  }, children, open && /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: "absolute",
      ...pos,
      zIndex: 40,
      maxWidth,
      width: "max-content",
      background: "var(--chassis)",
      color: "var(--text-on-chassis)",
      border: "1px solid var(--chassis-line)",
      borderRadius: "var(--radius-sm)",
      boxShadow: "0 8px 22px rgba(0,0,0,0.55)",
      padding: "7px 10px",
      font: "var(--type-label)",
      lineHeight: "var(--leading-normal)",
      textAlign: "left",
      pointerEvents: "none",
      whiteSpace: "normal"
    }
  }, content, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      ...arrow,
      width: 8,
      height: 8,
      background: "var(--chassis)",
      borderRight: "1px solid var(--chassis-line)",
      borderBottom: "1px solid var(--chassis-line)",
      transform: "rotate(45deg)"
    }
  })));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Faceplate button — a raised control on the cream panel. Slightly darker cream
 * face, machined hairline edge, top bevel highlight; lightens on hover and
 * presses 0.5px down. Meaning lives in the label; `tone` only tints the ink for
 * status-bearing actions.
 */
function Button({
  children,
  size = "default",
  tone = "neutral",
  disabled = false,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const small = size === "small";
  const toneColor = {
    neutral: "var(--ink)",
    olive: "var(--olive-deep)",
    amber: "var(--amber)",
    red: "var(--oxblood)",
    brass: "var(--brass-deep)"
  }[tone];
  const base = {
    font: "var(--type-label)",
    fontSize: small ? "var(--text-xs)" : "var(--text-sm)",
    letterSpacing: "0.04em",
    color: disabled ? "var(--text-disabled)" : toneColor,
    background: hover && !disabled ? "var(--surface-hover)" : "var(--surface-control)",
    border: "1px solid var(--plate-edge)",
    borderRadius: "var(--radius-sm)",
    boxShadow: disabled ? "none" : "var(--shadow-btn)",
    padding: small ? "3px 9px" : "var(--control-pad-y) var(--control-pad-x)",
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transform: active && !disabled ? "translateY(0.5px)" : "none",
    transition: "background 90ms linear",
    userSelect: "none",
    whiteSpace: "nowrap",
    ...style
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: base
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
/**
 * Checkbox — a raised faceplate box; the check renders in dark ink. Label sits
 * to the right and is clickable.
 */
function Checkbox({
  checked,
  label,
  onChange,
  disabled = false,
  style
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-3)",
      cursor: disabled ? "default" : "pointer",
      opacity: disabled ? 0.5 : 1,
      userSelect: "none",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      width: "17px",
      height: "17px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: hover && !disabled ? "var(--surface-hover)" : "var(--surface-control)",
      border: "1px solid var(--plate-edge)",
      borderRadius: "var(--radius-sm)",
      boxShadow: "var(--shadow-btn)",
      color: "var(--ink-strong)",
      fontSize: "12px",
      lineHeight: 1,
      transition: "background 90ms linear"
    }
  }, checked ? "\u2713" : ""), label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      color: "var(--text-primary)"
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/SegmentedToggle.jsx
try { (() => {
/**
 * Segmented toggle — the RMS / Peak metric switch, styled as a recessed track
 * on the faceplate with a raised brass-tinted active segment.
 */
function SegmentedToggle({
  options,
  value,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      gap: "2px",
      padding: "2px",
      background: "rgba(40,28,12,0.14)",
      border: "1px solid var(--plate-edge)",
      borderRadius: "var(--radius-sm)",
      boxShadow: "inset 0 1px 2px rgba(0,0,0,0.18)",
      ...style
    }
  }, options.map(opt => {
    const val = typeof opt === "string" ? opt : opt.value;
    const label = typeof opt === "string" ? opt : opt.label;
    return /*#__PURE__*/React.createElement(Segment, {
      key: val,
      label: label,
      selected: val === value,
      onClick: () => onChange && onChange(val)
    });
  }));
}
function Segment({
  label,
  selected,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      font: "var(--type-label)",
      fontSize: "var(--text-xs)",
      letterSpacing: "0.04em",
      color: selected ? "var(--ink-strong)" : "var(--text-muted)",
      background: selected ? "var(--surface-hover)" : hover ? "rgba(255,255,255,0.35)" : "transparent",
      border: selected ? "1px solid var(--plate-edge)" : "1px solid transparent",
      borderRadius: "3px",
      boxShadow: selected ? "var(--shadow-btn)" : "none",
      padding: "3px 13px",
      cursor: "pointer",
      transition: "background 90ms linear"
    }
  }, label);
}
Object.assign(__ds_scope, { SegmentedToggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SegmentedToggle.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
/**
 * Combo box — a raised faceplate value box with the label to its right. Click
 * toggles a dropdown list. Styled to match the panel buttons.
 */
function Select({
  label,
  value,
  options,
  onChange,
  placeholder = "(default)",
  style
}) {
  const [open, setOpen] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-3)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setOpen(o => !o),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "10px",
      minWidth: "150px",
      font: "var(--type-label)",
      fontSize: "var(--text-sm)",
      color: value ? "var(--ink-strong)" : "var(--text-muted)",
      background: hover ? "var(--surface-hover)" : "var(--surface-control)",
      border: "1px solid var(--plate-edge)",
      borderRadius: "var(--radius-sm)",
      boxShadow: "var(--shadow-btn)",
      padding: "var(--control-pad-y) var(--control-pad-x)",
      cursor: "pointer",
      transition: "background 90ms linear"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, value || placeholder), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)",
      fontSize: "11px"
    }
  }, "\u25BE")), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "calc(100% + 3px)",
      left: 0,
      minWidth: "100%",
      background: "var(--grad-plate)",
      border: "1px solid var(--plate-edge)",
      borderRadius: "var(--radius-sm)",
      boxShadow: "0 10px 26px rgba(0,0,0,0.45)",
      padding: "3px",
      zIndex: 20
    }
  }, options.map(opt => /*#__PURE__*/React.createElement(Option, {
    key: opt,
    label: opt,
    selected: opt === value,
    onClick: () => {
      onChange && onChange(opt);
      setOpen(false);
    }
  })))), label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      color: "var(--text-primary)"
    }
  }, label));
}
function Option({
  label,
  selected,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      font: "var(--type-label)",
      fontSize: "var(--text-sm)",
      color: "var(--ink-strong)",
      background: hover ? "var(--surface-hover)" : selected ? "rgba(202,162,74,0.28)" : "transparent",
      borderRadius: "3px",
      padding: "5px 10px",
      cursor: "pointer",
      whiteSpace: "nowrap"
    }
  }, label);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Slider.jsx
try { (() => {
/**
 * Labeled slider — a recessed faceplate track with a brass-capped handle and a
 * live mono readout. Used for monitor gain, A4 reference and the balance band.
 */
function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  label,
  suffix,
  onChange,
  style
}) {
  const pct = (value - min) / (max - min) * 100;
  const display = Number.isInteger(step) ? value : value.toFixed(1);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-3)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: 1,
      height: "18px",
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      height: "5px",
      background: "rgba(40,28,12,0.18)",
      borderRadius: "3px",
      boxShadow: "inset 0 1px 2px rgba(0,0,0,0.25)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      width: `${pct}%`,
      height: "5px",
      background: "var(--brass-deep)",
      borderRadius: "3px",
      opacity: 0.55
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: `calc(${pct}% - 7px)`,
      width: "14px",
      height: "14px",
      background: "radial-gradient(circle at 36% 30%, #e9d49a, var(--brass))",
      borderRadius: "50%",
      border: "1px solid var(--brass-deep)",
      boxShadow: "0 1px 2px rgba(0,0,0,0.4)"
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange && onChange(parseFloat(e.target.value)),
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      width: "100%",
      height: "18px",
      margin: 0,
      opacity: 0,
      cursor: "pointer"
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-readout)",
      fontSize: "var(--text-sm)",
      color: "var(--ink-strong)",
      fontVariantNumeric: "tabular-nums",
      minWidth: "46px",
      textAlign: "right"
    }
  }, display), (label || suffix) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      color: "var(--text-muted)",
      whiteSpace: "nowrap"
    }
  }, label || suffix));
}
Object.assign(__ds_scope, { Slider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Slider.jsx", error: String((e && e.message) || e) }); }

// components/forms/Stepper.jsx
try { (() => {
/**
 * Numeric stepper — a compact faceplate field showing an integer with ▴/▾
 * nudges, clamped to [min, max]. Used for the grid's strings / pickups counts.
 */
function Stepper({
  value,
  min = 0,
  max = 99,
  onChange,
  label,
  style
}) {
  const clamp = v => Math.max(min, Math.min(max, v));
  const set = v => onChange && onChange(clamp(v));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-3)",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      color: "var(--text-primary)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "stretch",
      background: "var(--surface-control)",
      border: "1px solid var(--plate-edge)",
      borderRadius: "var(--radius-sm)",
      boxShadow: "var(--shadow-btn)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-readout)",
      fontSize: "var(--text-sm)",
      color: "var(--ink-strong)",
      fontVariantNumeric: "tabular-nums",
      padding: "4px 10px",
      minWidth: "16px",
      textAlign: "center"
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      borderLeft: "1px solid var(--plate-edge)"
    }
  }, /*#__PURE__*/React.createElement(Nudge, {
    dir: "\u25B4",
    onClick: () => set(value + 1),
    disabled: value >= max
  }), /*#__PURE__*/React.createElement(Nudge, {
    dir: "\u25BE",
    onClick: () => set(value - 1),
    disabled: value <= min
  }))));
}
function Nudge({
  dir,
  onClick,
  disabled
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      flex: 1,
      border: "none",
      background: hover && !disabled ? "var(--surface-hover)" : "rgba(40,28,12,0.06)",
      color: disabled ? "var(--text-disabled)" : "var(--text-muted)",
      fontSize: "8px",
      lineHeight: 1,
      width: "18px",
      padding: 0,
      cursor: disabled ? "default" : "pointer"
    }
  }, dir);
}
Object.assign(__ds_scope, { Stepper });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Stepper.jsx", error: String((e && e.message) || e) }); }

// components/forms/TextField.jsx
try { (() => {
/**
 * Singleline text field — a recessed dark well sunk into the faceplate, with
 * cream text and a brass focus ring. Used for renaming a pickup row.
 */
function TextField({
  value,
  onChange,
  placeholder,
  width = 100,
  disabled = false,
  style
}) {
  const [focused, setFocused] = React.useState(false);
  return /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: value,
    placeholder: placeholder,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      font: "var(--type-label)",
      fontSize: "var(--text-sm)",
      color: "var(--dial)",
      background: "var(--surface-well)",
      border: "1px solid var(--chassis-line)",
      borderRadius: "var(--radius-sm)",
      boxShadow: focused ? "var(--shadow-well), 0 0 0 1.5px var(--brass)" : "var(--shadow-well)",
      outline: "none",
      padding: "4px 9px",
      width: typeof width === "number" ? `${width}px` : width,
      height: "var(--field-h)",
      boxSizing: "border-box",
      ...style
    }
  });
}
Object.assign(__ds_scope, { TextField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TextField.jsx", error: String((e && e.message) || e) }); }

// components/forms/ValueField.jsx
try { (() => {
/**
 * ValueField — a compact editable numeric readout on the faceplate. Dark ink on
 * the cream control face with a brass focus ring (NOT amber-on-dark). Click to
 * type, or drag up/down to scrub; clamped to [min, max] and snapped to `step`.
 * This is the numeric-entry sibling of Slider's readout — reach for it instead
 * of hand-rolling an editable dB/Hz box.
 */
function ValueField({
  value,
  min = -Infinity,
  max = Infinity,
  step = 0.1,
  suffix,
  decimals,
  width = 64,
  onChange,
  style
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const drag = React.useRef(null);
  const dp = decimals != null ? decimals : Number.isInteger(step) ? 0 : 1;
  const clamp = v => Math.max(min, Math.min(max, v));
  const commit = raw => {
    const n = parseFloat(raw);
    if (!Number.isNaN(n)) onChange && onChange(clamp(+n.toFixed(dp)));
    setEditing(false);
  };
  const onMouseDown = e => {
    if (editing) return;
    drag.current = {
      y: e.clientY,
      v: value,
      moved: false
    };
    const move = ev => {
      if (!drag.current) return;
      const dy = drag.current.y - ev.clientY;
      if (Math.abs(dy) > 2) drag.current.moved = true;
      onChange && onChange(clamp(+(drag.current.v + dy * step).toFixed(dp)));
    };
    const up = () => {
      const moved = drag.current && drag.current.moved;
      drag.current = null;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      if (!moved) {
        setDraft(String(value));
        setEditing(true);
      }
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };
  const shell = {
    display: "inline-flex",
    alignItems: "baseline",
    gap: "3px",
    background: "var(--surface-control)",
    border: "1px solid var(--plate-edge)",
    borderRadius: "var(--radius-sm)",
    boxShadow: focused ? "var(--shadow-btn), 0 0 0 1.5px var(--brass)" : "var(--shadow-btn)",
    padding: "3px 8px",
    width,
    boxSizing: "border-box",
    cursor: editing ? "text" : "ns-resize",
    ...style
  };
  const numStyle = {
    font: "var(--type-readout)",
    fontSize: "var(--text-sm)",
    color: "var(--ink-strong)",
    fontVariantNumeric: "tabular-nums"
  };
  return /*#__PURE__*/React.createElement("span", {
    style: shell,
    onMouseDown: onMouseDown
  }, editing ? /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    value: draft,
    onChange: e => setDraft(e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => {
      setFocused(false);
      commit(draft);
    },
    onKeyDown: e => {
      if (e.key === "Enter") commit(draft);else if (e.key === "Escape") setEditing(false);
    },
    style: {
      ...numStyle,
      width: "100%",
      background: "transparent",
      border: "none",
      outline: "none",
      padding: 0
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: numStyle
  }, value.toFixed(dp)), suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      fontSize: "var(--text-xs)",
      color: "var(--text-muted)"
    }
  }, suffix));
}
Object.assign(__ds_scope, { ValueField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/ValueField.jsx", error: String((e && e.message) || e) }); }

// components/instruments/GridCell.jsx
try { (() => {
/**
 * Capture-grid cell — an enamel chip on the faceplate. Background is the balance
 * verdict (clear green within ±balance, gold within ~4×, terracotta beyond, dim
 * cream if uncaptured). Shows the physical instruction (✓ / ↓ n / ↑ n) over the
 * absolute dBFS level in dark ink. States: `selected` (brass focus ring),
 * `target` (the live capture target — a pulsing brass ripple), `flash` (a brief
 * olive flash the instant a capture lands), `clipped` (⚠). Faithful to
 * src/ui/grid.rs.
 */
const AMBER_BAND = 4;

// inject the pulse/flash keyframes once
let stylesReady = false;
function ensureStyles() {
  if (stylesReady || typeof document === "undefined") return;
  stylesReady = true;
  const el = document.createElement("style");
  el.textContent = `
@keyframes ptcPulse {
  0%   { box-shadow: inset 0 0 0 2px var(--brass), 0 0 0 0 rgba(202,162,74,0.55), var(--shadow-cell); }
  70%,100% { box-shadow: inset 0 0 0 2px var(--brass), 0 0 0 8px rgba(202,162,74,0), var(--shadow-cell); }
}
@keyframes ptcFlash { from { opacity: 0.85; } to { opacity: 0; } }
@keyframes ptcArrow { 0%,100% { opacity: 0.45; } 50% { opacity: 1; } }`;
  document.head.appendChild(el);
}
function heat(delta, balance) {
  if (delta == null) return "var(--heat-empty)";
  const a = Math.abs(delta);
  if (a <= balance) return "var(--heat-balanced)";
  if (a <= balance * AMBER_BAND) return "var(--heat-close)";
  return "var(--heat-off)";
}
function instruction(delta, balance) {
  if (Math.abs(delta) <= balance) return "\u2713";
  return delta > 0 ? `\u2193 ${Math.abs(delta).toFixed(1)}` : `\u2191 ${Math.abs(delta).toFixed(1)}`;
}
function GridCell({
  delta = null,
  level = null,
  balance = 0.5,
  selected = false,
  target = false,
  flash = false,
  clipped = false,
  onClick,
  style
}) {
  ensureStyles();
  const captured = level != null;
  let boxShadow = "var(--shadow-cell)";
  if (selected) boxShadow = "inset 0 0 0 2px var(--ring-focus), var(--shadow-cell)";
  const animation = target ? "ptcPulse 1.15s ease-out infinite" : undefined;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      position: "relative",
      width: "var(--cell-w)",
      height: "var(--cell-h)",
      borderRadius: "var(--radius-sm)",
      background: heat(captured ? delta : null, balance),
      boxShadow: target ? "var(--shadow-cell)" : boxShadow,
      animation,
      cursor: onClick ? "pointer" : "default",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "1px",
      ...style
    }
  }, captured ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-readout)",
      fontSize: "var(--text-md)",
      color: "var(--ink-strong)",
      fontVariantNumeric: "tabular-nums"
    }
  }, delta != null ? instruction(delta, balance) : ""), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-readout-sm)",
      color: "rgba(36,27,16,0.66)",
      fontVariantNumeric: "tabular-nums"
    }
  }, level.toFixed(1), " dB"), clipped && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: "3px",
      right: "5px",
      color: "var(--oxblood)",
      fontSize: "11px",
      lineHeight: 1
    }
  }, "\u26A0")) : target ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--brass-deep)",
      fontSize: "16px",
      lineHeight: 1,
      animation: "ptcArrow 1.15s ease-in-out infinite"
    }
  }, "\u25B8") : /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-faint)",
      fontSize: "14px"
    }
  }, "\u2014"), flash && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: "var(--radius-sm)",
      background: "var(--olive)",
      animation: "ptcFlash 0.55s ease-out forwards",
      pointerEvents: "none"
    }
  }));
}
Object.assign(__ds_scope, { GridCell });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/instruments/GridCell.jsx", error: String((e && e.message) || e) }); }

// components/instruments/Meter.jsx
try { (() => {
/**
 * Level meter — vintage VU needle on an ivory dial face. The dark RMS needle
 * rests on the level; a thinner brass peak-hold needle (ball tip) holds the
 * highest peak. The upper end of the arc is an oxblood "hot" zone where
 * redlining means a hot/clipping signal. dBFS in, floor −60.
 */
const MIN = -60;
const HOT_FROM = -6; // oxblood zone start

// geometry of the 180° arc
const CX = 100,
  CY = 104,
  R = 84;
const norm = db => Math.min(1, Math.max(0, (db - MIN) / -MIN));
const angOf = db => 180 * (1 - norm(db)); // 180°=left(−60) … 0°=right(0)
const polar = (deg, r) => [CX + r * Math.cos(deg * Math.PI / 180), CY - r * Math.sin(deg * Math.PI / 180)];
function Meter({
  rms = -90,
  hold = -90,
  height = 104,
  style
}) {
  const ticks = [-60, -40, -20, -10, -6, -3, 0];
  const [hx, hy] = polar(angOf(rms), 74);
  const [r0x, r0y] = polar(angOf(HOT_FROM), R);
  const [r1x, r1y] = polar(angOf(0), R);
  const [hpx, hpy] = polar(angOf(hold), 72);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--grad-dial)",
      border: "1px solid var(--dial-edge)",
      borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow-dial)",
      padding: "8px 14px 6px",
      ...style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 200 112",
    style: {
      width: "100%",
      height,
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 16 104 A 84 84 0 0 1 184 104",
    fill: "none",
    stroke: "var(--plate-edge)",
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: `M ${r0x} ${r0y} A 84 84 0 0 1 ${r1x} ${r1y}`,
    fill: "none",
    stroke: "var(--oxblood)",
    strokeWidth: "3.5"
  }), ticks.map((v, i) => {
    const a = angOf(v);
    const [x1, y1] = polar(a, R);
    const [x2, y2] = polar(a, v >= HOT_FROM ? 73 : 76);
    return /*#__PURE__*/React.createElement("line", {
      key: i,
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      stroke: v >= HOT_FROM ? "var(--oxblood)" : "var(--ink-dim)",
      strokeWidth: v >= HOT_FROM ? 1.5 : 1
    });
  }), [[-20, "-20"], [0, "0"]].map(([v, lbl], i) => {
    const [x, y] = polar(angOf(v), 62);
    return /*#__PURE__*/React.createElement("text", {
      key: i,
      x: x,
      y: y + 3,
      textAnchor: "middle",
      fontFamily: "var(--font-mono)",
      fontSize: "8",
      fill: "var(--ink-dim)"
    }, lbl);
  }), /*#__PURE__*/React.createElement("text", {
    x: "100",
    y: "46",
    textAnchor: "middle",
    fontFamily: "var(--font-display)",
    fontStyle: "italic",
    fontSize: "14",
    fill: "var(--ink-dim)"
  }, "VU"), hold > MIN && /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("line", {
    x1: CX,
    y1: CY,
    x2: hpx,
    y2: hpy,
    stroke: "var(--brass)",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: hpx,
    cy: hpy,
    r: "2.6",
    fill: "var(--brass)",
    stroke: "var(--brass-deep)",
    strokeWidth: "0.8"
  })), /*#__PURE__*/React.createElement("line", {
    x1: CX,
    y1: CY,
    x2: hx,
    y2: hy,
    stroke: "var(--ink-strong)",
    strokeWidth: "2.4",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: CX,
    cy: CY,
    r: "5.5",
    fill: "#3a2a1a",
    stroke: "#1c140c",
    strokeWidth: "1"
  })));
}
Object.assign(__ds_scope, { Meter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/instruments/Meter.jsx", error: String((e && e.message) || e) }); }

// components/instruments/Tuner.jsx
try { (() => {
/**
 * Chromatic tuner — centered needle on an ivory dial face. Straight up = in
 * tune; the needle swings left for flat (♭) and right for sharp (♯). A green
 * enamel band sits across the top-center "in tune" zone (±3 cents). The note is
 * a big warm serif; pass reading=null for the idle dash. Faithful intent of
 * src/ui/tuner.rs, restyled for the Analog VU direction.
 */
const IN_TUNE = 3;
const CX = 100,
  CY = 104,
  ARC_R = 86,
  SPAN = 52; // degrees each side of vertical
const MARKS = [-50, -25, 0, 25, 50];
const clampC = c => Math.max(-50, Math.min(50, c));
const angOf = c => 90 - clampC(c) / 50 * SPAN; // 90°=up=in tune
const polar = (deg, r) => [CX + r * Math.cos(deg * Math.PI / 180), CY - r * Math.sin(deg * Math.PI / 180)];
function Tuner({
  reading = null,
  height = 104,
  style
}) {
  const inTune = reading && Math.abs(reading.cents) < IN_TUNE;
  const [ax0, ay0] = polar(angOf(-50), ARC_R);
  const [ax1, ay1] = polar(angOf(50), ARC_R);
  const [gx0, gy0] = polar(angOf(-5), ARC_R);
  const [gx1, gy1] = polar(angOf(5), ARC_R);
  const [bx, by] = polar(angOf(-50), ARC_R + 12);
  const [sx, sy] = polar(angOf(50), ARC_R + 12);
  const [nx, ny] = reading ? polar(angOf(reading.cents), 80) : polar(90, 80);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--grad-dial)",
      border: "1px solid var(--dial-edge)",
      borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow-dial)",
      padding: "12px 14px 10px",
      textAlign: "center",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-display)",
      color: reading ? "var(--ink-strong)" : "var(--text-disabled)",
      lineHeight: 1
    }
  }, reading ? /*#__PURE__*/React.createElement(React.Fragment, null, reading.name, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "26px",
      opacity: 0.55
    }
  }, reading.octave)) : "\u2014"), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 200 112",
    style: {
      width: "100%",
      height,
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: `M ${ax0} ${ay0} A ${ARC_R} ${ARC_R} 0 0 1 ${ax1} ${ay1}`,
    fill: "none",
    stroke: "var(--plate-edge)",
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: `M ${gx0} ${gy0} A ${ARC_R} ${ARC_R} 0 0 1 ${gx1} ${gy1}`,
    fill: "none",
    stroke: "var(--olive)",
    strokeWidth: "5",
    strokeLinecap: "round"
  }), MARKS.map((m, i) => {
    const a = angOf(m);
    const [x1, y1] = polar(a, ARC_R + 2);
    const [x2, y2] = polar(a, m === 0 ? ARC_R - 11 : ARC_R - 7);
    return /*#__PURE__*/React.createElement("line", {
      key: i,
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      stroke: "var(--ink-dim)",
      strokeWidth: m === 0 ? 1.6 : 1
    });
  }), /*#__PURE__*/React.createElement("text", {
    x: bx,
    y: by + 4,
    textAnchor: "middle",
    fontFamily: "var(--font-display)",
    fontSize: "14",
    fill: "var(--ink-dim)"
  }, "\u266D"), /*#__PURE__*/React.createElement("text", {
    x: sx,
    y: sy + 4,
    textAnchor: "middle",
    fontFamily: "var(--font-display)",
    fontSize: "14",
    fill: "var(--ink-dim)"
  }, "\u266F"), /*#__PURE__*/React.createElement("line", {
    x1: CX,
    y1: CY,
    x2: nx,
    y2: ny,
    stroke: inTune ? "var(--olive-deep)" : "var(--ink-strong)",
    strokeWidth: "2.6",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: CX,
    cy: CY,
    r: "5.5",
    fill: "#3a2a1a",
    stroke: "#1c140c",
    strokeWidth: "1"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-readout)",
      fontSize: "var(--text-xs)",
      color: "var(--text-muted)",
      fontVariantNumeric: "tabular-nums",
      marginTop: "2px"
    }
  }, reading ? /*#__PURE__*/React.createElement(React.Fragment, null, reading.cents >= 0 ? "+" : "", Math.round(reading.cents), " cents \xB7 ", reading.frequency.toFixed(1), " Hz") : "no signal"), inTune && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      marginTop: "6px",
      font: "var(--font-ui)",
      fontSize: "10px",
      fontWeight: "var(--weight-strong)",
      letterSpacing: "var(--tracking-label)",
      textTransform: "uppercase",
      color: "var(--olive-deep)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: "var(--olive)",
      boxShadow: "0 0 8px var(--olive)"
    }
  }), "in tune"));
}
Object.assign(__ds_scope, { Tuner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/instruments/Tuner.jsx", error: String((e && e.message) || e) }); }

// components/layout/SectionLabel.jsx
try { (() => {
/**
 * Spaced-uppercase engraved caption (Oswald) — titles a faceplate block in dim
 * ink, like silkscreen on a panel.
 */
function SectionLabel({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-caption)",
      color: "var(--text-muted)",
      letterSpacing: "var(--tracking-label)",
      textTransform: "uppercase",
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { SectionLabel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/SectionLabel.jsx", error: String((e && e.message) || e) }); }

// components/layout/Panel.jsx
try { (() => {
/**
 * Faceplate panel — the raised cream control panel that wraps every functional
 * block. Cream gradient, machined hairline edge, top bevel highlight and a soft
 * cast shadow. Pass a `label` to silkscreen the engraved caption at the top.
 */
function Panel({
  label,
  action,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--grad-plate)",
      border: "1px solid var(--plate-edge)",
      borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow-plate)",
      padding: "var(--space-5)",
      ...style
    }
  }, (label || action) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      marginBottom: "var(--space-3)"
    }
  }, label && /*#__PURE__*/React.createElement(__ds_scope.SectionLabel, null, label), action && /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto"
    }
  }, action)), children);
}
Object.assign(__ds_scope, { Panel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Panel.jsx", error: String((e && e.message) || e) }); }

// components/layout/StatusBadge.jsx
try { (() => {
/**
 * Inline status text — an enamel-colored status line with an optional glowing
 * lamp. Olive = balanced / in tune / capturing, amber = armed / getting hot,
 * oxblood = clipping / error. Renders on either the cream faceplate or the dark
 * tweed chassis (set `onDark` for the chassis).
 */
function StatusBadge({
  children,
  tone = "muted",
  lamp = false,
  strong = false,
  onDark = false,
  style
}) {
  const color = {
    muted: onDark ? "var(--text-on-chassis-dim)" : "var(--text-muted)",
    olive: "var(--olive)",
    green: "var(--olive)",
    amber: "var(--amber)",
    red: "var(--oxblood)",
    brass: "var(--brass)"
  }[tone];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "7px",
      font: "var(--type-label)",
      fontWeight: strong ? "var(--weight-strong)" : "var(--weight-medium)",
      letterSpacing: "var(--tracking-normal)",
      color,
      ...style
    }
  }, lamp && /*#__PURE__*/React.createElement("span", {
    style: {
      width: "7px",
      height: "7px",
      borderRadius: "50%",
      background: color,
      boxShadow: tone === "muted" ? "none" : "0 0 7px currentColor"
    }
  }), children);
}
Object.assign(__ds_scope, { StatusBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/StatusBadge.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pickup-tuner/App.jsx
try { (() => {
/* Pickup Tuner — full app recreation. Free-form single screen: status bar, a
   central column of meter / tuner / capture-grid blocks, and the right config
   panel. No real audio — the capture loop, meter and tuner are simulated so the
   whole workflow is clickable. */
(function () {
  const {
    Panel,
    Button,
    StatusBadge,
    Meter,
    Tuner
  } = window.PickupTunerDesignSystem_dfbad4;
  const emptyGrid = (pickups, strings) => Array.from({
    length: pickups
  }, () => Array.from({
    length: strings
  }, () => null));

  // A deterministic "true" level for a string/pickup, plus a little jitter, so
  // captured grids look like a real, slightly-uneven instrument.
  function simulateLevel(p, s, strings) {
    const arch = -Math.pow((s - (strings - 1) / 2) / strings, 2) * 9; // middle strings hotter
    const perPickup = p === 0 ? -1.5 : 0;
    const bump = [0, 1.6, -0.8, 0.4, -1.2, 0.9, 0.2, -0.5][s % 8];
    const rms = -16 + arch + perPickup + bump + (Math.random() - 0.5) * 0.7;
    const peak = rms + 5 + Math.random() * 2.5;
    const clipped = peak > -1.5;
    return {
      rms: +rms.toFixed(1),
      peak: +peak.toFixed(1),
      clipped
    };
  }
  function App() {
    const {
      StatusBar,
      ConfigPanel,
      CaptureGrid
    } = window;
    const [s, setS] = React.useState({
      driver: "ASIO",
      inputDevice: "Focusrite USB ASIO",
      outputDevice: "Focusrite USB ASIO",
      sampleRate: 48000,
      bufferSize: 256,
      inputChannel: 1,
      gain: 0,
      mute: false,
      a4: 440,
      balance: 0.5
    });
    const set = patch => setS(prev => ({
      ...prev,
      ...patch
    }));
    const [strings, setStrings] = React.useState(6);
    const [pickups, setPickups] = React.useState(2);
    const [pickupNames, setPickupNames] = React.useState(["Neck", "Bridge"]);
    const [grid, setGrid] = React.useState(() => emptyGrid(2, 6));
    const [selected, setSelected] = React.useState({
      p: 0,
      s: 0
    });
    const [metric, setMetric] = React.useState("RMS");
    const [captureState, setCaptureState] = React.useState("idle");
    const [meter, setMeter] = React.useState({
      peak: -90,
      hold: -90,
      rms: -90
    });
    const [flashCell, setFlashCell] = React.useState(null);
    const [rowDone, setRowDone] = React.useState(false);
    const tuning = React.useMemo(() => window.PT.tuningFor(strings), [strings]);
    const env = React.useRef(0); // pluck envelope 0..1
    const holdRef = React.useRef(-90);
    const timers = React.useRef([]);
    const selRef = React.useRef(selected);
    selRef.current = selected;
    const clearTimers = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };

    // --- simulated meter (and tuner liveness) -------------------------------
    React.useEffect(() => {
      const id = setInterval(() => {
        env.current *= 0.86; // decay
        const idle = -46 + Math.random() * 3;
        const ringing = -52 + env.current * 44;
        const rms = Math.max(idle, ringing) + (Math.random() - 0.5) * 1.2;
        const peak = rms + 4 + Math.random() * 2 + env.current * 3;
        holdRef.current = Math.max(holdRef.current, peak);
        setMeter({
          peak: +peak.toFixed(1),
          hold: +holdRef.current.toFixed(1),
          rms: +rms.toFixed(1)
        });
      }, 90);
      return () => clearInterval(id);
    }, []);

    // tuner shows the selected column's note, gently wandering in cents
    const [tick, setTick] = React.useState(0);
    React.useEffect(() => {
      const id = setInterval(() => setTick(t => t + 1), 140);
      return () => clearInterval(id);
    }, []);
    const tunerReading = React.useMemo(() => {
      const note = tuning[selected.s] || tuning[0];
      const cents = Math.round(Math.sin(tick / 3 + selected.s) * 6 + (env.current > 0.2 ? 0 : 0));
      return {
        name: note.name,
        octave: note.octave,
        cents,
        frequency: window.PT.noteFreq(note.name, note.octave, s.a4) * Math.pow(2, cents / 1200)
      };
    }, [tick, selected.s, tuning, s.a4]);

    // --- capture loop: continuous, string-by-string across ONE pickup row -----
    // (one pickup-selector position at a time — the player flips the guitar's
    //  selector and re-arms for the next row). Auto-captures on each transient.
    const resetHold = () => {
      holdRef.current = -90;
    };
    const captureAt = (p, col) => {
      const lvl = simulateLevel(p, col, strings);
      const note = tuning[col] || tuning[0];
      env.current = 1; // kick the meter
      setGrid(g => g.map((row, pi) => row.map((cell, si) => pi === p && si === col ? {
        ...lvl,
        note: {
          name: note.name,
          octave: note.octave
        }
      } : cell)));
      setFlashCell({
        p,
        s: col
      });
      timers.current.push(setTimeout(() => setFlashCell(null), 550));
    };

    // one step: wait for a pluck, capture, then advance within the row or finish.
    const runStep = () => {
      timers.current.push(setTimeout(() => {
        setCaptureState("capturing");
        env.current = 1;
        timers.current.push(setTimeout(() => {
          const {
            p,
            s: col
          } = selRef.current;
          captureAt(p, col);
          if (col + 1 < strings) {
            setSelected({
              p,
              s: col + 1
            }); // next string in this row
            setCaptureState("armed");
            timers.current.push(setTimeout(runStep, 280));
          } else {
            setCaptureState("idle"); // row finished — player must flip selector
            setRowDone(true);
            timers.current.push(setTimeout(() => setRowDone(false), 3500));
            setSelected(cur => cur.p + 1 < pickups ? {
              p: cur.p + 1,
              s: 0
            } : {
              p: cur.p,
              s: 0
            });
          }
        }, 460));
      }, 850));
    };
    const arm = () => {
      if (captureState !== "idle") {
        clearTimers();
        setCaptureState("idle");
        return;
      }
      setRowDone(false);
      setSelected(cur => ({
        ...cur,
        s: 0
      })); // start at the first string of the selected row
      setCaptureState("armed");
      timers.current.push(setTimeout(runStep, 120));
    };
    const cancel = () => {
      clearTimers();
      setCaptureState("idle");
    };
    const clearSlot = () => {
      const {
        p,
        s: col
      } = selRef.current;
      setGrid(g => g.map((row, pi) => row.map((cell, si) => pi === p && si === col ? null : cell)));
    };
    const clearAll = () => setGrid(emptyGrid(pickups, strings));
    const reshape = (ns, np) => {
      setGrid(g => {
        const next = emptyGrid(np, ns);
        for (let p = 0; p < Math.min(np, g.length); p++) for (let c = 0; c < Math.min(ns, g[p].length); c++) next[p][c] = g[p][c];
        return next;
      });
      setPickupNames(names => {
        const base = ["Neck", "Bridge"];
        const out = [];
        for (let i = 0; i < np; i++) out.push(names[i] || base[i] || `Pickup ${i + 1}`);
        return out;
      });
      setStrings(ns);
      setPickups(np);
      setSelected(cur => ({
        p: Math.min(cur.p, np - 1),
        s: Math.min(cur.s, ns - 1)
      }));
    };
    const setPickupName = (p, v) => setPickupNames(names => names.map((n, i) => i === p ? v : n));

    // column note labels (the note heard at capture, per column)
    const columnNotes = React.useMemo(() => {
      const out = Array(strings).fill(null);
      for (let c = 0; c < strings; c++) for (let p = 0; p < grid.length; p++) {
        const cell = grid[p][c];
        if (cell && cell.note) {
          out[c] = `${cell.note.name}${cell.note.octave}`;
          break;
        }
      }
      return out;
    }, [grid, strings]);

    // keyboard shortcuts
    React.useEffect(() => {
      const onKey = e => {
        if (document.activeElement && document.activeElement.tagName === "INPUT") return;
        if (e.code === "Space") {
          e.preventDefault();
          arm();
        } else if (e.code === "Escape") cancel();else if (captureState !== "idle") return; // lock navigation during a capture session
        else if (e.code === "ArrowRight") setSelected(c => ({
          ...c,
          s: Math.min(strings - 1, c.s + 1)
        }));else if (e.code === "ArrowLeft") setSelected(c => ({
          ...c,
          s: Math.max(0, c.s - 1)
        }));else if (e.code === "ArrowDown") setSelected(c => ({
          ...c,
          p: Math.min(pickups - 1, c.p + 1)
        }));else if (e.code === "ArrowUp") setSelected(c => ({
          ...c,
          p: Math.max(0, c.p - 1)
        }));
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [captureState, strings, pickups]);
    const clipped = meter.peak > -1.5;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--grad-chassis)"
      }
    }, /*#__PURE__*/React.createElement(StatusBar, {
      state: "running",
      inputChannel: s.inputChannel,
      onReconnect: () => {}
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flex: 1,
        minHeight: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        overflowY: "auto",
        padding: "var(--space-6)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-5)"
      }
    }, /*#__PURE__*/React.createElement(Panel, {
      label: "Level",
      action: /*#__PURE__*/React.createElement(Button, {
        size: "small",
        onClick: resetHold
      }, "Reset hold")
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: "var(--space-5)",
        font: "var(--type-readout)",
        color: "var(--text-muted)",
        fontVariantNumeric: "tabular-nums",
        marginBottom: "var(--space-3)"
      }
    }, /*#__PURE__*/React.createElement("span", null, "peak ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: "var(--ink-strong)",
        fontWeight: 500
      }
    }, meter.peak.toFixed(1))), /*#__PURE__*/React.createElement("span", null, "hold ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: "var(--ink-strong)",
        fontWeight: 500
      }
    }, meter.hold.toFixed(1))), /*#__PURE__*/React.createElement("span", null, "rms ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: "var(--ink-strong)",
        fontWeight: 500
      }
    }, meter.rms.toFixed(1)), " dBFS"), clipped && /*#__PURE__*/React.createElement(StatusBadge, {
      tone: "red",
      strong: true
    }, "CLIP")), /*#__PURE__*/React.createElement(Meter, {
      rms: meter.rms,
      hold: meter.hold
    })), /*#__PURE__*/React.createElement(Panel, {
      label: "Tuner"
    }, /*#__PURE__*/React.createElement(Tuner, {
      reading: tunerReading
    })), /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(CaptureGrid, {
      grid: grid,
      selected: selected,
      setSelected: setSelected,
      metric: metric,
      setMetric: setMetric,
      strings: strings,
      pickups: pickups,
      onReshape: reshape,
      captureState: captureState,
      onArm: arm,
      onClearSlot: clearSlot,
      onClearAll: clearAll,
      pickupNames: pickupNames,
      setPickupName: setPickupName,
      balance: s.balance,
      columnNotes: columnNotes,
      tuning: tuning,
      flashCell: flashCell,
      rowDone: rowDone
    }))), /*#__PURE__*/React.createElement(ConfigPanel, {
      s: s,
      set: set,
      onApply: () => {}
    })));
  }
  window.PickupTunerApp = App;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pickup-tuner/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pickup-tuner/CaptureGrid.jsx
try { (() => {
/* Capture grid section. Frozen toolbar (nothing reflows when armed), a reserved-
   height capture-mode strip, note-labeled columns, editable pickup rows of
   heatmap cells with a live capture target, and the pickup-to-pickup verdicts. */
(function () {
  const {
    GridCell,
    SegmentedToggle,
    Stepper,
    Button,
    TextField,
    SectionLabel
  } = window.PickupTunerDesignSystem_dfbad4;
  const ARM_BTN_W = 168; // fixed so "Arm capture" ⇄ "Cancel (Space/Esc)" never resizes the row

  function CaptureGrid(props) {
    const {
      grid,
      selected,
      setSelected,
      metric,
      setMetric,
      strings,
      pickups,
      onReshape,
      captureState,
      onArm,
      onClearSlot,
      onClearAll,
      pickupNames,
      setPickupName,
      balance,
      columnNotes,
      tuning,
      flashCell,
      rowDone
    } = props;
    const metricKey = metric === "RMS" ? "rms" : "peak";
    const armed = captureState !== "idle";
    const colLabels = [];
    for (let s = 0; s < strings; s++) colLabels.push("S" + (strings - s));

    // locked cluster (config controls that don't apply mid-capture)
    const lock = {
      opacity: armed ? 0.4 : 1,
      pointerEvents: armed ? "none" : "auto",
      transition: "opacity 140ms linear",
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-3)"
    };
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: "var(--space-3)",
        flexWrap: "nowrap"
      }
    }, /*#__PURE__*/React.createElement(SectionLabel, null, "Capture grid"), /*#__PURE__*/React.createElement("div", {
      style: lock
    }, /*#__PURE__*/React.createElement(SegmentedToggle, {
      options: ["RMS", "Peak"],
      value: metric,
      onChange: setMetric
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 1,
        height: 18,
        background: "var(--plate-edge)"
      }
    }), /*#__PURE__*/React.createElement(Stepper, {
      label: "strings:",
      value: strings,
      min: 4,
      max: 12,
      onChange: v => onReshape(v, pickups)
    }), /*#__PURE__*/React.createElement(Stepper, {
      label: "pickups:",
      value: pickups,
      min: 1,
      max: 4,
      onChange: v => onReshape(strings, v)
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 1,
        height: 18,
        background: "var(--plate-edge)"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: ARM_BTN_W,
        flex: "none"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      onClick: onArm,
      tone: armed ? "amber" : "brass",
      style: {
        width: "100%",
        textAlign: "center"
      }
    }, armed ? "Cancel (Space/Esc)" : "Arm capture (Space)")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: "auto",
        display: "flex",
        gap: "var(--space-3)",
        flex: "none",
        opacity: armed ? 0.4 : 1,
        pointerEvents: armed ? "none" : "auto",
        transition: "opacity 140ms linear"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      size: "small",
      onClick: onClearSlot
    }, "Clear slot"), /*#__PURE__*/React.createElement(Button, {
      size: "small",
      onClick: onClearAll
    }, "Clear all"))), /*#__PURE__*/React.createElement(ModeStrip, {
      captureState: captureState,
      selected: selected,
      strings: strings,
      tuning: tuning,
      pickupNames: pickupNames,
      rowDone: rowDone
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        font: "var(--type-body)",
        fontSize: "var(--text-xs)",
        color: "var(--text-muted)",
        margin: "var(--space-3) 0 var(--space-4)"
      }
    }, "each cell: distance from that pickup's median string \xB7 \u2191 raise pole \xB7 \u2193 lower pole \xB7 \u2713 balanced (within \xB1", balance.toFixed(1), " dB)"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "inline-grid",
        gridTemplateColumns: `120px repeat(${strings}, var(--cell-w))`,
        gap: "var(--grid-gap)",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("div", null), colLabels.map((label, s) => /*#__PURE__*/React.createElement("div", {
      key: s,
      style: {
        textAlign: "center"
      }
    }, columnNotes[s] ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: "var(--type-title)",
        color: "var(--text-primary)"
      }
    }, columnNotes[s]), /*#__PURE__*/React.createElement("div", {
      style: {
        font: "var(--type-body)",
        fontSize: "var(--text-xs)",
        color: "var(--text-muted)"
      }
    }, label)) : /*#__PURE__*/React.createElement("div", {
      style: {
        font: "var(--type-title)",
        color: "var(--text-primary)"
      }
    }, label))), grid.map((row, p) => {
      const med = window.PT.rowMedian(row, metricKey);
      const rowActive = armed && selected.p === p;
      return /*#__PURE__*/React.createElement(React.Fragment, {
        key: p
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          paddingRight: "var(--space-3)",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }
      }, rowActive && /*#__PURE__*/React.createElement("span", {
        style: {
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "var(--brass)",
          boxShadow: "0 0 7px var(--brass)",
          flex: "none"
        }
      }), /*#__PURE__*/React.createElement(TextField, {
        value: pickupNames[p],
        onChange: v => setPickupName(p, v),
        width: "100%"
      })), row.map((cell, col) => {
        const delta = cell && med != null ? cell[metricKey] - med : null;
        const isTarget = armed && selected.p === p && selected.s === col;
        const isFlash = flashCell && flashCell.p === p && flashCell.s === col;
        return /*#__PURE__*/React.createElement(GridCell, {
          key: col,
          delta: cell ? delta : null,
          level: cell ? cell[metricKey] : null,
          balance: balance,
          clipped: cell ? cell.clipped : false,
          selected: !armed && selected.p === p && selected.s === col,
          target: isTarget,
          flash: isFlash,
          onClick: armed ? undefined : () => setSelected({
            p,
            s: col
          })
        });
      }));
    })), /*#__PURE__*/React.createElement(Verdicts, {
      grid: grid,
      metricKey: metricKey,
      pickupNames: pickupNames,
      balance: balance
    }));
  }
  function ModeStrip({
    captureState,
    selected,
    strings,
    tuning,
    pickupNames,
    rowDone
  }) {
    const colLabel = "S" + (strings - selected.s);
    const note = tuning[selected.s] || tuning[0];
    const noteName = note ? `${note.name}${note.octave}` : "";
    const pickup = pickupNames[selected.p];
    let bg = "transparent",
      border = "1px solid var(--plate-edge)",
      body = null;
    if (captureState === "armed") {
      bg = "rgba(214,162,78,0.16)";
      border = "1px solid rgba(214,162,78,0.5)";
      body = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lamp, {
        color: "var(--amber)",
        pulse: true
      }), /*#__PURE__*/React.createElement("span", {
        style: cap("var(--amber)")
      }, "ARMED"), /*#__PURE__*/React.createElement("span", {
        style: txt
      }, "pluck ", /*#__PURE__*/React.createElement("b", {
        style: strong
      }, colLabel), " \xB7 ", /*#__PURE__*/React.createElement("b", {
        style: strong
      }, noteName), " on ", /*#__PURE__*/React.createElement("b", {
        style: strong
      }, pickup)), /*#__PURE__*/React.createElement("span", {
        style: {
          ...hint,
          marginLeft: "auto"
        }
      }, "auto-captures on transient \xB7 Space/Esc to cancel"));
    } else if (captureState === "capturing") {
      bg = "rgba(106,160,67,0.18)";
      border = "1px solid rgba(106,160,67,0.5)";
      body = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lamp, {
        color: "var(--olive)",
        pulse: true
      }), /*#__PURE__*/React.createElement("span", {
        style: cap("var(--olive-deep)")
      }, "CAPTURING"), /*#__PURE__*/React.createElement("span", {
        style: txt
      }, /*#__PURE__*/React.createElement("b", {
        style: strong
      }, colLabel), " \xB7 ", /*#__PURE__*/React.createElement("b", {
        style: strong
      }, noteName), " \u2014 hold the note\u2026"));
    } else if (rowDone) {
      bg = "rgba(106,160,67,0.14)";
      border = "1px solid rgba(106,160,67,0.45)";
      body = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
        style: {
          color: "var(--olive-deep)",
          fontSize: "13px"
        }
      }, "\u2713"), /*#__PURE__*/React.createElement("span", {
        style: txt
      }, "Row complete \u2014 flip your guitar's pickup selector to ", /*#__PURE__*/React.createElement("b", {
        style: strong
      }, pickup), ", then arm again."));
    } else {
      body = /*#__PURE__*/React.createElement("span", {
        style: hint
      }, "Ready \u2014 select a cell, press ", /*#__PURE__*/React.createElement("b", {
        style: {
          color: "var(--text-primary)"
        }
      }, "Space"), " to arm, then pluck each string in turn.");
    }
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: "var(--space-3)",
        minHeight: 34,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "6px 12px",
        borderRadius: "var(--radius-sm)",
        background: bg,
        border,
        transition: "background 140ms linear"
      }
    }, body);
  }
  function Lamp({
    color,
    pulse
  }) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: color,
        flex: "none",
        boxShadow: `0 0 8px ${color}`,
        animation: pulse ? "ptcArrow 1.1s ease-in-out infinite" : "none"
      }
    });
  }
  const cap = color => ({
    font: "var(--type-caption)",
    letterSpacing: "var(--tracking-label)",
    textTransform: "uppercase",
    color,
    flex: "none"
  });
  const txt = {
    font: "var(--type-label)",
    color: "var(--text-primary)"
  };
  const strong = {
    color: "var(--ink-strong)",
    fontWeight: "var(--weight-strong)"
  };
  const hint = {
    font: "var(--type-label)",
    color: "var(--text-muted)"
  };
  function Verdicts({
    grid,
    metricKey,
    pickupNames,
    balance
  }) {
    const avgs = grid.map((row, p) => {
      const vals = row.filter(Boolean).map(c => c[metricKey]);
      return vals.length ? {
        p,
        avg: vals.reduce((a, b) => a + b, 0) / vals.length
      } : null;
    }).filter(Boolean);
    if (avgs.length < 2) return null;
    const base = avgs[0];
    const baseName = pickupNames[base.p];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: "var(--space-4)",
        display: "flex",
        flexDirection: "column",
        gap: "4px"
      }
    }, avgs.slice(1).map(({
      p,
      avg
    }) => {
      const diff = avg - base.avg;
      const name = pickupNames[p];
      let verdict,
        tone = "muted";
      if (Math.abs(diff) <= balance) {
        verdict = "level-matched ✓";
        tone = "olive";
      } else if (diff > 0) verdict = `${diff >= 0 ? "+" : ""}${diff.toFixed(1)} dB hotter — lower it or raise ${baseName}`;else verdict = `${diff.toFixed(1)} dB quieter — raise it or lower ${baseName}`;
      return /*#__PURE__*/React.createElement("div", {
        key: p,
        style: {
          font: "var(--type-label)",
          color: "var(--text-primary)"
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          color: "var(--text-muted)"
        }
      }, name, " vs ", baseName, ": "), /*#__PURE__*/React.createElement("span", {
        style: {
          color: tone === "olive" ? "var(--olive-deep)" : "var(--ink-strong)"
        }
      }, verdict));
    }));
  }
  window.CaptureGrid = CaptureGrid;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pickup-tuner/CaptureGrid.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pickup-tuner/ConfigPanel.jsx
try { (() => {
/* Right config panel — a cream faceplate column: Audio / Monitoring / Tuner / Grid,
   with engraved Oswald headings and hairline dividers. */
(function () {
  const {
    Select,
    Slider,
    Checkbox,
    Button,
    Tooltip
  } = window.PickupTunerDesignSystem_dfbad4;
  function Heading({
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        font: "var(--type-caption)",
        color: "var(--text-muted)",
        letterSpacing: "var(--tracking-label)",
        textTransform: "uppercase",
        margin: "0 0 var(--space-4)"
      }
    }, children);
  }
  function Divider() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        height: 1,
        background: "var(--plate-edge)",
        margin: "var(--space-6) 0"
      }
    });
  }
  function Field({
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: "var(--space-3)"
      }
    }, children);
  }
  function ConfigPanel({
    s,
    set,
    onApply
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: "var(--config-panel-w)",
        flex: "none",
        background: "var(--grad-plate)",
        borderLeft: "1px solid var(--chassis-line)",
        boxShadow: "inset 1px 0 0 var(--plate-hi)",
        padding: "var(--space-6)",
        overflowY: "auto"
      }
    }, /*#__PURE__*/React.createElement(Heading, null, "Audio"), /*#__PURE__*/React.createElement(Field, null, /*#__PURE__*/React.createElement(Select, {
      label: "Driver",
      value: s.driver,
      options: ["ASIO", "Windows Audio", "DirectSound"],
      onChange: v => set({
        driver: v
      })
    })), /*#__PURE__*/React.createElement(Field, null, /*#__PURE__*/React.createElement(Select, {
      label: "Input device",
      value: s.inputDevice,
      options: ["Focusrite USB ASIO", "Realtek ASIO", "(default)"],
      onChange: v => set({
        inputDevice: v
      })
    })), /*#__PURE__*/React.createElement(Field, null, /*#__PURE__*/React.createElement(Select, {
      label: "Output device",
      value: s.outputDevice,
      options: ["Focusrite USB ASIO", "Speakers (Realtek)", "(default)"],
      onChange: v => set({
        outputDevice: v
      })
    })), /*#__PURE__*/React.createElement(Field, null, /*#__PURE__*/React.createElement(Select, {
      label: "Sample rate",
      value: String(s.sampleRate),
      options: ["44100", "48000", "88200", "96000"],
      onChange: v => set({
        sampleRate: +v
      })
    })), /*#__PURE__*/React.createElement(Field, null, /*#__PURE__*/React.createElement(Select, {
      label: "Buffer size",
      value: String(s.bufferSize),
      options: ["64", "128", "256", "512"],
      onChange: v => set({
        bufferSize: +v
      })
    })), /*#__PURE__*/React.createElement(Field, null, /*#__PURE__*/React.createElement(Select, {
      label: "Input channel",
      value: String(s.inputChannel),
      options: ["1", "2"],
      onChange: v => set({
        inputChannel: +v
      })
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: "var(--space-3)",
        marginTop: "var(--space-3)"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      tone: "brass",
      onClick: onApply
    }, "Apply"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: "var(--type-readout)",
        fontSize: "var(--text-xs)",
        color: "var(--text-muted)"
      }
    }, "active: ", s.sampleRate, " Hz / ", s.bufferSize)), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement(Heading, null, "Monitoring"), /*#__PURE__*/React.createElement(Field, null, /*#__PURE__*/React.createElement(Slider, {
      value: s.gain,
      min: -60,
      max: 6,
      step: 1,
      label: "gain (dB)",
      onChange: v => set({
        gain: v
      })
    })), /*#__PURE__*/React.createElement(Checkbox, {
      checked: s.mute,
      label: "Mute",
      onChange: v => set({
        mute: v
      })
    }), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement(Heading, null, "Tuner"), /*#__PURE__*/React.createElement(Field, null, /*#__PURE__*/React.createElement(Slider, {
      value: s.a4,
      min: 415,
      max: 466,
      step: 1,
      label: "A4 (Hz)",
      onChange: v => set({
        a4: v
      })
    })), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement(Heading, null, /*#__PURE__*/React.createElement(Tooltip, {
      placement: "bottom",
      content: "how close to the row median a string must be to count as balanced (green / \u2713)"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        cursor: "help",
        borderBottom: "1px dotted var(--text-muted)"
      }
    }, "Grid"))), /*#__PURE__*/React.createElement(Field, null, /*#__PURE__*/React.createElement(Slider, {
      value: s.balance,
      min: 0.1,
      max: 3,
      step: 0.1,
      label: "balanced within \xB1 dB",
      onChange: v => set({
        balance: v
      })
    })));
  }
  window.ConfigPanel = ConfigPanel;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pickup-tuner/ConfigPanel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pickup-tuner/StatusBar.jsx
try { (() => {
/* Top status bar — the tweed chassis header with silkscreen wordmark, model
   plate, and the live engine state with a brass power lamp. */
(function () {
  const {
    Button,
    StatusBadge
  } = window.PickupTunerDesignSystem_dfbad4;
  function StatusBar({
    state,
    inputChannel,
    onReconnect
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: "var(--space-5)",
        height: "var(--topbar-h)",
        padding: "0 var(--space-6)",
        background: "transparent",
        borderBottom: "1px solid var(--chassis-line)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: "11px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "flex-end",
        gap: "2px",
        height: "18px"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 4,
        height: 7,
        background: "var(--chassis-dim)",
        borderRadius: 1
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 4,
        height: 11,
        background: "var(--chassis-dim)",
        borderRadius: 1
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 4,
        height: 18,
        background: "var(--brass)",
        borderRadius: 1,
        boxShadow: "0 0 8px var(--brass)"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 4,
        height: 12,
        background: "var(--chassis-dim)",
        borderRadius: 1
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 4,
        height: 8,
        background: "var(--chassis-dim)",
        borderRadius: 1
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        lineHeight: 1.05
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: "var(--type-title)",
        color: "var(--text-on-chassis)",
        letterSpacing: "var(--tracking-brand)"
      }
    }, "PICKUP TUNER"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-ui)",
        fontSize: "8.5px",
        color: "var(--text-on-chassis-dim)",
        letterSpacing: "var(--tracking-wide)",
        textTransform: "uppercase",
        marginTop: "3px"
      }
    }, "pole \xB7 height \xB7 balance")), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: "4px",
        fontFamily: "var(--font-mono)",
        fontSize: "9px",
        letterSpacing: "0.12em",
        color: "var(--brass)",
        border: "1px solid var(--brass-deep)",
        borderRadius: "3px",
        padding: "2px 6px"
      }
    }, "PT-V")), state === "running" && /*#__PURE__*/React.createElement(StatusBadge, {
      tone: "olive",
      lamp: true,
      onDark: true
    }, "monitoring \xB7 in ", inputChannel), state === "nosignal" && /*#__PURE__*/React.createElement(StatusBadge, {
      tone: "amber",
      lamp: true,
      onDark: true
    }, "no signal on input ", inputChannel, " \u2014 check cable/channel"), state === "stopped" && /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: "var(--space-3)"
      }
    }, /*#__PURE__*/React.createElement(StatusBadge, {
      tone: "amber",
      lamp: true,
      onDark: true
    }, "audio device stopped"), /*#__PURE__*/React.createElement(Button, {
      size: "small",
      onClick: onReconnect
    }, "Reconnect")), state === "unavailable" && /*#__PURE__*/React.createElement(StatusBadge, {
      tone: "red",
      lamp: true,
      onDark: true
    }, "audio engine unavailable"));
  }
  window.StatusBar = StatusBar;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pickup-tuner/StatusBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pickup-tuner/model.js
try { (() => {
/* Pickup Tuner UI kit — shared model helpers (plain JS, on window.PT).
   Mirrors the domain in src/model/ and src/dsp/: string tunings, note math,
   row-median deltas. No real audio — readings are simulated for the demo. */
(function () {
  const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  // Common tunings, stored LOW string -> HIGH string (= grid columns S(n)..S1, left to right).
  const TUNINGS = {
    4: [["E", 1], ["A", 1], ["D", 2], ["G", 2]],
    5: [["B", 0], ["E", 1], ["A", 1], ["D", 2], ["G", 2]],
    6: [["E", 2], ["A", 2], ["D", 3], ["G", 3], ["B", 3], ["E", 4]],
    7: [["B", 1], ["E", 2], ["A", 2], ["D", 3], ["G", 3], ["B", 3], ["E", 4]],
    8: [["F#", 1], ["B", 1], ["E", 2], ["A", 2], ["D", 3], ["G", 3], ["B", 3], ["E", 4]]
  };
  function semitoneIndex(name, octave) {
    return octave * 12 + NOTE_NAMES.indexOf(name);
  }
  // Build a chromatic fallback rising from E2 for unusual string counts.
  function tuningFor(strings) {
    if (TUNINGS[strings]) return TUNINGS[strings].map(([n, o]) => ({
      name: n,
      octave: o
    }));
    const out = [];
    let idx = semitoneIndex("E", 2);
    for (let i = 0; i < strings; i++) {
      out.push({
        name: NOTE_NAMES[(idx % 12 + 12) % 12],
        octave: Math.floor(idx / 12)
      });
      idx += 5; // stack in fourths
    }
    return out;
  }
  function noteFreq(name, octave, a4 = 440) {
    const n = semitoneIndex(name, octave) - semitoneIndex("A", 4);
    return a4 * Math.pow(2, n / 12);
  }
  function median(values) {
    if (!values.length) return null;
    const s = [...values].sort((a, b) => a - b);
    const m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  }

  // delta of each captured cell vs the median of its pickup row (per metric).
  function rowMedian(row, metric) {
    return median(row.filter(Boolean).map(c => c[metric]));
  }
  window.PT = {
    NOTE_NAMES,
    tuningFor,
    noteFreq,
    median,
    rowMedian
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pickup-tuner/model.js", error: String((e && e.message) || e) }); }

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.SegmentedToggle = __ds_scope.SegmentedToggle;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Slider = __ds_scope.Slider;

__ds_ns.Stepper = __ds_scope.Stepper;

__ds_ns.TextField = __ds_scope.TextField;

__ds_ns.ValueField = __ds_scope.ValueField;

__ds_ns.GridCell = __ds_scope.GridCell;

__ds_ns.Meter = __ds_scope.Meter;

__ds_ns.Tuner = __ds_scope.Tuner;

__ds_ns.Panel = __ds_scope.Panel;

__ds_ns.SectionLabel = __ds_scope.SectionLabel;

__ds_ns.StatusBadge = __ds_scope.StatusBadge;

})();
