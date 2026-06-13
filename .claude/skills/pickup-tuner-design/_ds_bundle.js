/* @ds-bundle: {"format":3,"namespace":"PickupTunerDesignSystem_dfbad4","components":[{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"SegmentedToggle","sourcePath":"components/forms/SegmentedToggle.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Slider","sourcePath":"components/forms/Slider.jsx"},{"name":"Stepper","sourcePath":"components/forms/Stepper.jsx"},{"name":"TextField","sourcePath":"components/forms/TextField.jsx"},{"name":"GridCell","sourcePath":"components/instruments/GridCell.jsx"},{"name":"Meter","sourcePath":"components/instruments/Meter.jsx"},{"name":"Tuner","sourcePath":"components/instruments/Tuner.jsx"},{"name":"Panel","sourcePath":"components/layout/Panel.jsx"},{"name":"SectionLabel","sourcePath":"components/layout/SectionLabel.jsx"},{"name":"StatusBadge","sourcePath":"components/layout/StatusBadge.jsx"}],"sourceHashes":{"components/forms/Button.jsx":"ec09a8fd3674","components/forms/Checkbox.jsx":"8da15e51ece5","components/forms/SegmentedToggle.jsx":"82ff72d42d7a","components/forms/Select.jsx":"7e910681077a","components/forms/Slider.jsx":"3293d1125f2b","components/forms/Stepper.jsx":"4c05533fffdc","components/forms/TextField.jsx":"4e03d9b15d46","components/instruments/GridCell.jsx":"3312241264f5","components/instruments/Meter.jsx":"f55b0b646c73","components/instruments/Tuner.jsx":"6d4eb1e541e5","components/layout/Panel.jsx":"b31e598f039d","components/layout/SectionLabel.jsx":"d8bc2abf3fe9","components/layout/StatusBadge.jsx":"cd9b6c0c10f6","explorations/design-canvas.jsx":"bd8746af6e58","ui_kits/pickup-tuner/App.jsx":"881a8fedfc32","ui_kits/pickup-tuner/CaptureGrid.jsx":"11a16f5277b3","ui_kits/pickup-tuner/ConfigPanel.jsx":"0b30cc97aec0","ui_kits/pickup-tuner/StatusBar.jsx":"5caba8a3a9e1","ui_kits/pickup-tuner/model.js":"221a7b558786"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.PickupTunerDesignSystem_dfbad4 = window.PickupTunerDesignSystem_dfbad4 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

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

// components/instruments/GridCell.jsx
try { (() => {
/**
 * Capture-grid cell — an enamel chip on the faceplate. Background is the balance
 * verdict (clear green within ±balance, gold within ~4×, terracotta beyond, dim
 * cream if uncaptured). Shows the physical instruction (✓ / ↓ n / ↑ n) over the
 * absolute dBFS level in dark ink, a brass focus ring when selected, and a ⚠
 * when the capture clipped. Faithful to src/ui/grid.rs.
 */
const AMBER_BAND = 4;
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
  clipped = false,
  onClick,
  style
}) {
  const captured = level != null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      position: "relative",
      width: "var(--cell-w)",
      height: "var(--cell-h)",
      borderRadius: "var(--radius-sm)",
      background: heat(captured ? delta : null, balance),
      boxShadow: selected ? "inset 0 0 0 2px var(--ring-focus), var(--shadow-cell)" : "var(--shadow-cell)",
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
  }, "\u26A0")) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-faint)",
      fontSize: "14px"
    }
  }, "\u2014"));
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

// explorations/design-canvas.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// DesignCanvas.jsx — Figma-ish design canvas wrapper
// Warm gray grid bg + Sections + Artboards + PostIt notes.
// Exports (to window): DesignCanvas, DCSection, DCArtboard, DCPostIt.
// Artboards are reorderable (grip-drag), deletable, labels/titles are
// inline-editable, and any artboard can be opened in a fullscreen focus
// overlay (←/→/Esc). State persists to a .design-canvas.state.json sidecar
// via the host bridge. No assets, no deps.
//
// Usage:
//   <DesignCanvas>
//     <DCSection id="onboarding" title="Onboarding" subtitle="First-run variants">
//       <DCArtboard id="a" label="A · Dusk" width={260} height={480}>…</DCArtboard>
//       <DCArtboard id="b" label="B · Minimal" width={260} height={480}>…</DCArtboard>
//     </DCSection>
//   </DesignCanvas>
//
// Artboards are static design frames, not scroll regions — never use
// height: 100% + overflow: auto/scroll on inner elements; size each artboard
// to fit its content (explicit pixel height, or let it grow).
/* END USAGE */

const DC = {
  bg: '#f0eee9',
  grid: 'rgba(0,0,0,0.06)',
  label: 'rgba(60,50,40,0.7)',
  title: 'rgba(40,30,20,0.85)',
  subtitle: 'rgba(60,50,40,0.6)',
  postitBg: '#fef4a8',
  postitText: '#5a4a2a',
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
};

// One-time CSS injection (classes are dc-prefixed so they don't collide with
// the hosted design's own styles).
if (typeof document !== 'undefined' && !document.getElementById('dc-styles')) {
  const s = document.createElement('style');
  s.id = 'dc-styles';
  s.textContent = ['.dc-editable{cursor:text;outline:none;white-space:nowrap;border-radius:3px;padding:0 2px;margin:0 -2px}', '.dc-editable:focus{background:#fff;box-shadow:0 0 0 1.5px #c96442}', '[data-dc-slot]{transition:transform .18s cubic-bezier(.2,.7,.3,1)}', '[data-dc-slot].dc-dragging{transition:none;z-index:10;pointer-events:none}', '[data-dc-slot].dc-dragging .dc-card{box-shadow:0 12px 40px rgba(0,0,0,.25),0 0 0 2px #c96442;transform:scale(1.02)}',
  // isolation:isolate contains artboard content's z-indexes so a
  // z-indexed child (sticky navbar etc.) can't paint over .dc-header or
  // the .dc-menu popover that drops into the top of the card.
  '.dc-card{isolation:isolate;transition:box-shadow .15s,transform .15s}', '.dc-card *{scrollbar-width:none}', '.dc-card *::-webkit-scrollbar{display:none}',
  // Per-artboard header: grip + label on the left, delete/expand on the
  // right. Single flex row; when the artboard's on-screen width is too
  // narrow for both the label yields (ellipsis, then hidden entirely below
  // ~4ch via the container query) and the buttons stay on the row.
  '.dc-header{position:absolute;bottom:100%;left:-4px;margin-bottom:calc(4px * var(--dc-inv-zoom,1));z-index:2;', '  display:flex;align-items:center;container-type:inline-size}', '.dc-labelrow{display:flex;align-items:center;gap:4px;height:24px;flex:1 1 auto;min-width:0}', '.dc-grip{flex:0 0 auto;cursor:grab;display:flex;align-items:center;padding:5px 4px;border-radius:4px;transition:background .12s,opacity .12s}', '.dc-grip:hover{background:rgba(0,0,0,.08)}', '.dc-grip:active{cursor:grabbing}', '.dc-labeltext{flex:1 1 auto;min-width:0;cursor:pointer;border-radius:4px;padding:3px 6px;', '  display:flex;align-items:center;transition:background .12s;overflow:hidden}',
  // Below ~4ch of label room: hide the label entirely, and drop the grip to
  // hover-only (same reveal rule as .dc-btns) so a narrow header is clean
  // until the card is moused.
  '@container (max-width: 110px){', '  .dc-labeltext{display:none}', '  .dc-grip{opacity:0}', '  [data-dc-slot]:hover .dc-grip{opacity:1}', '}', '.dc-labeltext:hover{background:rgba(0,0,0,.05)}', '.dc-labeltext .dc-editable{overflow:hidden;text-overflow:ellipsis;max-width:100%}', '.dc-labeltext .dc-editable:focus{overflow:visible;text-overflow:clip}', '.dc-btns{flex:0 0 auto;margin-left:auto;display:flex;gap:2px;opacity:0;transition:opacity .12s}', '[data-dc-slot]:hover .dc-btns,.dc-btns:has(.dc-menu){opacity:1}', '.dc-expand,.dc-kebab{width:22px;height:22px;border-radius:5px;border:none;cursor:pointer;padding:0;', '  background:transparent;color:rgba(60,50,40,.7);display:flex;align-items:center;justify-content:center;', '  font:inherit;transition:background .12s,color .12s}', '.dc-expand:hover,.dc-kebab:hover{background:rgba(0,0,0,.06);color:#2a251f}',
  // Slot hosting an open menu floats above later siblings (which otherwise
  // paint on top — same z-index:auto, later DOM order) so the popup isn't
  // clipped by the next card.
  '[data-dc-slot]:has(.dc-menu){z-index:10}', '.dc-menu{position:absolute;top:100%;right:0;margin-top:4px;background:#fff;border-radius:8px;', '  box-shadow:0 8px 28px rgba(0,0,0,.18),0 0 0 1px rgba(0,0,0,.05);padding:4px;min-width:160px;z-index:10}', '.dc-menu button{display:block;width:100%;padding:7px 10px;border:0;background:transparent;', '  border-radius:5px;font-family:inherit;font-size:13px;font-weight:500;line-height:1.2;', '  color:#29261b;cursor:pointer;text-align:left;transition:background .12s;white-space:nowrap}', '.dc-menu button:hover{background:rgba(0,0,0,.05)}', '.dc-menu hr{border:0;border-top:1px solid rgba(0,0,0,.08);margin:4px 2px}', '.dc-menu .dc-danger{color:#c96442}', '.dc-menu .dc-danger:hover{background:rgba(201,100,66,.1)}',
  // Chrome (titles / labels / buttons) counter-scales against the viewport
  // zoom so it stays a constant on-screen size. --dc-inv-zoom is set by
  // DCViewport on every transform update and inherits to all descendants —
  // any overlay inside the world (e.g. a TweaksPanel on an artboard) can use
  // it the same way.
  //
  // The header uses transform:scale (out-of-flow, so layout impact doesn't
  // matter) with its world-space width set to card-width / inv-zoom so that
  // after counter-scaling its on-screen width exactly matches the card's —
  // that's what lets the container query + text-overflow behave against the
  // card's visible edge at every zoom level.
  //
  // The section head uses CSS zoom instead of transform so its layout box
  // grows with the counter-scale, pushing the card row down — otherwise the
  // constant-screen-size title would overflow into the (shrinking) world-
  // space gap and overlap the artboard headers at low zoom.
  '.dc-header{width:calc((100% + 4px) / var(--dc-inv-zoom,1));', '  transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom left}', '.dc-sectionhead{zoom:var(--dc-inv-zoom,1)}'].join('\n');
  document.head.appendChild(s);
}
const DCCtx = React.createContext(null);

// Recursively unwrap React.Fragment so <>…</> grouping doesn't hide
// DCSection/DCArtboard children from the type-based walks below.
function dcFlatten(children) {
  const out = [];
  React.Children.forEach(children, c => {
    if (c && c.type === React.Fragment) out.push(...dcFlatten(c.props.children));else out.push(c);
  });
  return out;
}

// ─────────────────────────────────────────────────────────────
// DesignCanvas — stateful wrapper around the pan/zoom viewport.
// Owns runtime state (per-section order, renamed titles/labels, hidden
// artboards, focused artboard). Order/titles/labels/hidden persist to a
// .design-canvas.state.json
// sidecar next to the HTML. Reads go via plain fetch() so the saved
// arrangement is visible anywhere the HTML + sidecar are served together
// (omelette preview, direct link, downloaded zip). Writes go through the
// host's window.omelette bridge — editing requires the omelette runtime.
// Focus is ephemeral.
// ─────────────────────────────────────────────────────────────
const DC_STATE_FILE = '.design-canvas.state.json';
function DesignCanvas({
  children,
  minScale,
  maxScale,
  style
}) {
  const [state, setState] = React.useState({
    sections: {},
    focus: null
  });
  // Hold rendering until the sidecar read settles so the saved order/titles
  // appear on first paint (no source-order flash). didRead gates writes until
  // the read settles so the empty initial state can't clobber a slow read;
  // skipNextWrite suppresses the one echo-write that would otherwise follow
  // hydration.
  const [ready, setReady] = React.useState(false);
  const didRead = React.useRef(false);
  const skipNextWrite = React.useRef(false);
  React.useEffect(() => {
    let off = false;
    fetch('./' + DC_STATE_FILE).then(r => r.ok ? r.json() : null).then(saved => {
      if (off || !saved || !saved.sections) return;
      skipNextWrite.current = true;
      setState(s => ({
        ...s,
        sections: saved.sections
      }));
    }).catch(() => {}).finally(() => {
      didRead.current = true;
      if (!off) setReady(true);
    });
    const t = setTimeout(() => {
      if (!off) setReady(true);
    }, 150);
    return () => {
      off = true;
      clearTimeout(t);
    };
  }, []);
  React.useEffect(() => {
    if (!didRead.current) return;
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
    const t = setTimeout(() => {
      window.omelette?.writeFile(DC_STATE_FILE, JSON.stringify({
        sections: state.sections
      })).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [state.sections]);

  // Build registries synchronously from children so FocusOverlay can read
  // them in the same render. Fragments are flattened; wrapping in other
  // elements still opts out of focus/reorder.
  const registry = {}; // slotId -> { sectionId, artboard }
  const sectionMeta = {}; // sectionId -> { title, subtitle, slotIds[] }
  const sectionOrder = [];
  dcFlatten(children).forEach(sec => {
    if (!sec || sec.type !== DCSection) return;
    const sid = sec.props.id ?? sec.props.title;
    if (!sid) return;
    sectionOrder.push(sid);
    const persisted = state.sections[sid] || {};
    const abs = [];
    dcFlatten(sec.props.children).forEach(ab => {
      if (!ab || ab.type !== DCArtboard) return;
      const aid = ab.props.id ?? ab.props.label;
      if (aid) abs.push([aid, ab]);
    });
    // hidden is scoped to one source revision — when the agent regenerates
    // (artboard-ID set changes), prior deletes don't apply to new content.
    const srcKey = abs.map(([k]) => k).join('\x1f');
    const hidden = persisted.srcKey === srcKey ? persisted.hidden || [] : [];
    const srcIds = [];
    abs.forEach(([aid, ab]) => {
      if (hidden.includes(aid)) return;
      registry[`${sid}/${aid}`] = {
        sectionId: sid,
        artboard: ab
      };
      srcIds.push(aid);
    });
    const kept = (persisted.order || []).filter(k => srcIds.includes(k));
    sectionMeta[sid] = {
      title: persisted.title ?? sec.props.title,
      subtitle: sec.props.subtitle,
      slotIds: [...kept, ...srcIds.filter(k => !kept.includes(k))]
    };
  });
  const api = React.useMemo(() => ({
    state,
    section: id => state.sections[id] || {},
    patchSection: (id, p) => setState(s => ({
      ...s,
      sections: {
        ...s.sections,
        [id]: {
          ...s.sections[id],
          ...(typeof p === 'function' ? p(s.sections[id] || {}) : p)
        }
      }
    })),
    setFocus: slotId => setState(s => ({
      ...s,
      focus: slotId
    }))
  }), [state]);

  // Esc exits focus; any outside pointerdown commits an in-progress rename.
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') api.setFocus(null);
    };
    const onPd = e => {
      const ae = document.activeElement;
      if (ae && ae.isContentEditable && !ae.contains(e.target)) ae.blur();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPd, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPd, true);
    };
  }, [api]);
  return /*#__PURE__*/React.createElement(DCCtx.Provider, {
    value: api
  }, /*#__PURE__*/React.createElement(DCViewport, {
    minScale: minScale,
    maxScale: maxScale,
    style: style
  }, ready && children), state.focus && registry[state.focus] && /*#__PURE__*/React.createElement(DCFocusOverlay, {
    entry: registry[state.focus],
    sectionMeta: sectionMeta,
    sectionOrder: sectionOrder
  }));
}

// ─────────────────────────────────────────────────────────────
// DCViewport — transform-based pan/zoom (internal)
//
// Input mapping (Figma-style):
//   • trackpad pinch  → zoom   (ctrlKey wheel; Safari gesture* events)
//   • trackpad scroll → pan    (two-finger)
//   • mouse wheel     → zoom   (notched; distinguished from trackpad scroll)
//   • middle-drag / primary-drag-on-bg → pan
//
// Transform state lives in a ref and is written straight to the DOM
// (translate3d + will-change) so wheel ticks don't go through React —
// keeps pans at 60fps on dense canvases.
// ─────────────────────────────────────────────────────────────
function DCViewport({
  children,
  minScale = 0.1,
  maxScale = 8,
  style = {}
}) {
  const vpRef = React.useRef(null);
  const worldRef = React.useRef(null);
  const tf = React.useRef({
    x: 0,
    y: 0,
    scale: 1
  });
  // Persist viewport across reloads so the user lands back where they were
  // after an agent edit or browser refresh. The sandbox origin is already
  // per-project; pathname keeps multiple canvas files in one project apart.
  const tfKey = 'dc-viewport:' + location.pathname;
  const saveT = React.useRef(0);
  const lastPostedScale = React.useRef();
  const apply = React.useCallback(() => {
    const {
      x,
      y,
      scale
    } = tf.current;
    const el = worldRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    // Exposed for zoom-invariant chrome (labels, buttons, TweaksPanel).
    el.style.setProperty('--dc-inv-zoom', String(1 / scale));
    // Keep the host toolbar's % readout in sync with the canvas scale. Pan
    // ticks leave scale unchanged — skip the cross-frame post for those.
    if (lastPostedScale.current !== scale) {
      lastPostedScale.current = scale;
      window.parent.postMessage({
        type: '__dc_zoom',
        scale
      }, '*');
    }
    clearTimeout(saveT.current);
    saveT.current = setTimeout(() => {
      try {
        localStorage.setItem(tfKey, JSON.stringify(tf.current));
      } catch {}
    }, 200);
  }, [tfKey]);
  React.useLayoutEffect(() => {
    const flush = () => {
      clearTimeout(saveT.current);
      try {
        localStorage.setItem(tfKey, JSON.stringify(tf.current));
      } catch {}
    };
    try {
      const s = JSON.parse(localStorage.getItem(tfKey) || 'null');
      if (s && Number.isFinite(s.x) && Number.isFinite(s.y) && Number.isFinite(s.scale)) {
        tf.current = {
          x: s.x,
          y: s.y,
          scale: Math.min(maxScale, Math.max(minScale, s.scale))
        };
        apply();
      }
    } catch {}
    // Flush on pagehide and unmount so a reload within the 200ms debounce
    // window doesn't drop the last pan/zoom.
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, []);
  React.useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    const zoomAt = (cx, cy, factor) => {
      const r = vp.getBoundingClientRect();
      const px = cx - r.left,
        py = cy - r.top;
      const t = tf.current;
      const next = Math.min(maxScale, Math.max(minScale, t.scale * factor));
      const k = next / t.scale;
      // --dc-inv-zoom consumers (.dc-sectionhead's CSS zoom, each section's
      // marginBottom) reflow on every scale change, vertically shifting the
      // world layout — so a world point mathematically pinned under the cursor
      // drifts as you zoom (content creeps up on zoom-in, down on zoom-out).
      // Anchor the DOM element under the cursor instead: record its screen Y,
      // apply the transform + --dc-inv-zoom, then cancel whatever vertical
      // drift the reflow introduced so it stays put on screen.
      let marker = null,
        markerY0 = 0;
      if (k !== 1) {
        const hit = document.elementFromPoint(cx, cy);
        marker = hit && hit.closest ? hit.closest('[data-dc-slot],[data-dc-section]') : null;
        if (marker) markerY0 = marker.getBoundingClientRect().top;
      }
      // keep the world point under the cursor fixed
      t.x = px - (px - t.x) * k;
      t.y = py - (py - t.y) * k;
      t.scale = next;
      apply();
      if (marker) {
        // A pure zoom around (cx, cy) maps screen Y → cy + (Y - cy) * k. Any
        // departure after the --dc-inv-zoom reflow is the layout drift.
        const drift = marker.getBoundingClientRect().top - (cy + (markerY0 - cy) * k);
        if (Math.abs(drift) > 0.1) {
          t.y -= drift;
          apply();
        }
      }
    };

    // Mouse-wheel vs trackpad-scroll heuristic. A physical wheel sends
    // line-mode deltas (Firefox) or large integer pixel deltas with no X
    // component (Chrome/Safari, typically multiples of 100/120). Trackpad
    // two-finger scroll sends small/fractional pixel deltas, often with
    // non-zero deltaX. ctrlKey is set by the browser for trackpad pinch.
    const isMouseWheel = e => e.deltaMode !== 0 || e.deltaX === 0 && Number.isInteger(e.deltaY) && Math.abs(e.deltaY) >= 40;
    const onWheel = e => {
      e.preventDefault();
      if (isGesturing) return; // Safari: gesture* owns the pinch — discard concurrent wheels
      if ((e.ctrlKey || e.metaKey) && !isMouseWheel(e)) {
        // trackpad pinch, or ctrl/cmd + smooth-scroll mouse. Notched
        // wheels fall through to the fixed-step branch below.
        zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.01));
      } else if (isMouseWheel(e)) {
        // notched mouse wheel — fixed-ratio step per click
        zoomAt(e.clientX, e.clientY, Math.exp(-Math.sign(e.deltaY) * 0.18));
      } else {
        // trackpad two-finger scroll — pan
        tf.current.x -= e.deltaX;
        tf.current.y -= e.deltaY;
        apply();
      }
    };

    // Safari sends native gesture* events for trackpad pinch with a smooth
    // e.scale; preferring these over the ctrl+wheel fallback gives a much
    // better feel there. No-ops on other browsers. Safari also fires
    // ctrlKey wheel events during the same pinch — isGesturing makes
    // onWheel drop those entirely so they neither zoom nor pan.
    let gsBase = 1;
    let isGesturing = false;
    const onGestureStart = e => {
      e.preventDefault();
      isGesturing = true;
      gsBase = tf.current.scale;
    };
    const onGestureChange = e => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, gsBase * e.scale / tf.current.scale);
    };
    const onGestureEnd = e => {
      e.preventDefault();
      isGesturing = false;
    };

    // Drag-pan: middle button anywhere, or primary button on canvas
    // background (anything that isn't an artboard or an inline editor).
    let drag = null;
    const onPointerDown = e => {
      const onBg = !e.target.closest('[data-dc-slot], .dc-editable');
      if (!(e.button === 1 || e.button === 0 && onBg)) return;
      e.preventDefault();
      vp.setPointerCapture(e.pointerId);
      drag = {
        id: e.pointerId,
        lx: e.clientX,
        ly: e.clientY
      };
      vp.style.cursor = 'grabbing';
    };
    const onPointerMove = e => {
      if (!drag || e.pointerId !== drag.id) return;
      tf.current.x += e.clientX - drag.lx;
      tf.current.y += e.clientY - drag.ly;
      drag.lx = e.clientX;
      drag.ly = e.clientY;
      apply();
    };
    const onPointerUp = e => {
      if (!drag || e.pointerId !== drag.id) return;
      vp.releasePointerCapture(e.pointerId);
      drag = null;
      vp.style.cursor = '';
    };

    // Host-driven zoom (toolbar % menu). Zooms around viewport centre so the
    // visible midpoint stays fixed — matching the host's iframe-zoom feel.
    const onHostMsg = e => {
      const d = e.data;
      if (d && d.type === '__dc_set_zoom' && typeof d.scale === 'number') {
        const r = vp.getBoundingClientRect();
        zoomAt(r.left + r.width / 2, r.top + r.height / 2, d.scale / tf.current.scale);
      } else if (d && d.type === '__dc_probe') {
        // Host's [readyGen] reset asks whether a canvas is present; it
        // fires on the iframe's native 'load', which for canvases with
        // images/fonts is after our mount-time announce, so re-announce.
        // Clear the pan-tick guard so apply() re-posts the current scale
        // even if it's unchanged — the host just reset dcScale to 1.
        window.parent.postMessage({
          type: '__dc_present'
        }, '*');
        lastPostedScale.current = undefined;
        apply();
      }
    };
    window.addEventListener('message', onHostMsg);
    // Announce canvas mode so the host toolbar proxies its % control here
    // instead of scaling the iframe element (which would just shrink the
    // viewport window of an infinite canvas). The apply() that follows emits
    // the initial __dc_zoom so the toolbar % is correct before first pinch.
    // lastPostedScale reset mirrors the __dc_probe handler: the layout
    // effect's restore-path apply() may already have posted the restored
    // scale (before __dc_present), so clear the guard to re-post it in order.
    window.parent.postMessage({
      type: '__dc_present'
    }, '*');
    lastPostedScale.current = undefined;
    apply();
    vp.addEventListener('wheel', onWheel, {
      passive: false
    });
    vp.addEventListener('gesturestart', onGestureStart, {
      passive: false
    });
    vp.addEventListener('gesturechange', onGestureChange, {
      passive: false
    });
    vp.addEventListener('gestureend', onGestureEnd, {
      passive: false
    });
    vp.addEventListener('pointerdown', onPointerDown);
    vp.addEventListener('pointermove', onPointerMove);
    vp.addEventListener('pointerup', onPointerUp);
    vp.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('message', onHostMsg);
      vp.removeEventListener('wheel', onWheel);
      vp.removeEventListener('gesturestart', onGestureStart);
      vp.removeEventListener('gesturechange', onGestureChange);
      vp.removeEventListener('gestureend', onGestureEnd);
      vp.removeEventListener('pointerdown', onPointerDown);
      vp.removeEventListener('pointermove', onPointerMove);
      vp.removeEventListener('pointerup', onPointerUp);
      vp.removeEventListener('pointercancel', onPointerUp);
    };
  }, [apply, minScale, maxScale]);
  const gridSvg = `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M120 0H0v120' fill='none' stroke='${encodeURIComponent(DC.grid)}' stroke-width='1'/%3E%3C/svg%3E")`;
  return /*#__PURE__*/React.createElement("div", {
    ref: vpRef,
    className: "design-canvas",
    style: {
      height: '100vh',
      width: '100vw',
      background: DC.bg,
      overflow: 'hidden',
      overscrollBehavior: 'none',
      touchAction: 'none',
      position: 'relative',
      fontFamily: DC.font,
      boxSizing: 'border-box',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: worldRef,
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      transformOrigin: '0 0',
      willChange: 'transform',
      width: 'max-content',
      minWidth: '100%',
      minHeight: '100%',
      padding: '60px 0 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: -6000,
      backgroundImage: gridSvg,
      backgroundSize: '120px 120px',
      pointerEvents: 'none',
      zIndex: -1
    }
  }), children));
}

// ─────────────────────────────────────────────────────────────
// DCSection — editable title + h-row of artboards in persisted order
// ─────────────────────────────────────────────────────────────
function DCSection({
  id,
  title,
  subtitle,
  children,
  gap = 48
}) {
  const ctx = React.useContext(DCCtx);
  const sid = id ?? title;
  const all = React.Children.toArray(dcFlatten(children));
  const artboards = all.filter(c => c && c.type === DCArtboard);
  const rest = all.filter(c => !(c && c.type === DCArtboard));
  const sec = ctx && sid && ctx.section(sid) || {};
  // Must match DesignCanvas's srcKey computation exactly (it filters falsy
  // IDs), or onDelete persists a srcKey that DesignCanvas never recognizes.
  const allIds = artboards.map(a => a.props.id ?? a.props.label).filter(Boolean);
  const srcKey = allIds.join('\x1f');
  const hidden = sec.srcKey === srcKey ? sec.hidden || [] : [];
  const srcOrder = allIds.filter(k => !hidden.includes(k));
  const order = React.useMemo(() => {
    const kept = (sec.order || []).filter(k => srcOrder.includes(k));
    return [...kept, ...srcOrder.filter(k => !kept.includes(k))];
  }, [sec.order, srcOrder.join('|')]);
  const byId = Object.fromEntries(artboards.map(a => [a.props.id ?? a.props.label, a]));

  // marginBottom counter-scales so the on-screen gap between sections stays
  // constant — otherwise at low zoom the (world-space) gap collapses while
  // the screen-constant sectionhead below it doesn't, and the title reads as
  // belonging to the section above. paddingBottom below is just enough for
  // the 24px artboard-header (abs-positioned above each card) plus ~8px, so
  // the title sits tight against its own row at every zoom.
  return /*#__PURE__*/React.createElement("div", {
    "data-dc-section": sid,
    style: {
      marginBottom: 'calc(80px * var(--dc-inv-zoom, 1))',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 60px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-sectionhead",
    style: {
      paddingBottom: 36
    }
  }, /*#__PURE__*/React.createElement(DCEditable, {
    tag: "div",
    value: sec.title ?? title,
    onChange: v => ctx && sid && ctx.patchSection(sid, {
      title: v
    }),
    style: {
      fontSize: 28,
      fontWeight: 600,
      color: DC.title,
      letterSpacing: -0.4,
      marginBottom: 6,
      display: 'inline-block'
    }
  }), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      color: DC.subtitle
    }
  }, subtitle))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap,
      padding: '0 60px',
      alignItems: 'flex-start',
      width: 'max-content'
    }
  }, order.map(k => /*#__PURE__*/React.createElement(DCArtboardFrame, {
    key: k,
    sectionId: sid,
    artboard: byId[k],
    order: order,
    label: (sec.labels || {})[k] ?? byId[k].props.label,
    onRename: v => ctx && ctx.patchSection(sid, x => ({
      labels: {
        ...x.labels,
        [k]: v
      }
    })),
    onReorder: next => ctx && ctx.patchSection(sid, {
      order: next
    }),
    onDelete: () => ctx && ctx.patchSection(sid, x => ({
      hidden: [...(x.srcKey === srcKey ? x.hidden || [] : []), k],
      srcKey
    })),
    onFocus: () => ctx && ctx.setFocus(`${sid}/${k}`)
  }))), rest);
}

// DCArtboard — marker; rendered by DCArtboardFrame via DCSection.
function DCArtboard() {
  return null;
}

// Per-artboard export (kind: 'png' | 'html'). Both paths share the same
// self-contained clone: computed styles baked in, @font-face / <img> /
// inline-style background-image urls inlined as data URIs. PNG wraps the
// clone in foreignObject→canvas at 3× the artboard's natural width×height
// (same pipeline the host uses for page captures); HTML wraps it in a
// minimal standalone document. Both are independent of viewport zoom.
async function dcExport(node, w, h, name, kind) {
  try {
    await document.fonts.ready;
  } catch {}
  const toDataURL = url => fetch(url).then(r => r.blob()).then(b => new Promise(res => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = () => res(url);
    fr.readAsDataURL(b);
  })).catch(() => url);

  // Collect @font-face rules. ss.cssRules throws SecurityError on
  // cross-origin sheets (e.g. fonts.googleapis.com) — in that case fetch
  // the CSS text directly (those endpoints send ACAO:*) and regex-extract
  // the blocks. @import and @media/@supports are walked so nested
  // @font-face rules aren't missed.
  const fontRules = [],
    pending = [],
    seen = new Set();
  const scrapeCss = href => {
    if (seen.has(href)) return;
    seen.add(href);
    pending.push(fetch(href).then(r => r.text()).then(css => {
      for (const m of css.match(/@font-face\s*{[^}]*}/g) || []) fontRules.push({
        css: m,
        base: href
      });
      for (const m of css.matchAll(/@import\s+(?:url\()?['"]?([^'")\s;]+)/g)) scrapeCss(new URL(m[1], href).href);
    }).catch(() => {}));
  };
  const walk = (rules, base) => {
    for (const r of rules) {
      if (r.type === CSSRule.FONT_FACE_RULE) fontRules.push({
        css: r.cssText,
        base
      });else if (r.type === CSSRule.IMPORT_RULE && r.styleSheet) {
        const ibase = r.styleSheet.href || base;
        try {
          walk(r.styleSheet.cssRules, ibase);
        } catch {
          scrapeCss(ibase);
        }
      } else if (r.cssRules) walk(r.cssRules, base);
    }
  };
  for (const ss of document.styleSheets) {
    const base = ss.href || location.href;
    try {
      walk(ss.cssRules, base);
    } catch {
      if (ss.href) scrapeCss(ss.href);
    }
  }
  while (pending.length) await pending.shift();
  const fontCss = (await Promise.all(fontRules.map(async rule => {
    let out = rule.css,
      m;
    const re = /url\((['"]?)([^'")]+)\1\)/g;
    while (m = re.exec(rule.css)) {
      if (m[2].indexOf('data:') === 0) continue;
      let abs;
      try {
        abs = new URL(m[2], rule.base).href;
      } catch {
        continue;
      }
      out = out.split(m[0]).join('url("' + (await toDataURL(abs)) + '")');
    }
    return out;
  }))).join('\n');
  const cloneStyled = src => {
    if (src.nodeType === 8 || src.nodeType === 1 && src.tagName === 'SCRIPT') return document.createTextNode('');
    const dst = src.cloneNode(false);
    if (src.nodeType === 1) {
      const cs = getComputedStyle(src);
      let txt = '';
      for (let i = 0; i < cs.length; i++) txt += cs[i] + ':' + cs.getPropertyValue(cs[i]) + ';';
      dst.setAttribute('style', txt + 'animation:none;transition:none;');
      if (src.tagName === 'CANVAS') try {
        const im = document.createElement('img');
        im.src = src.toDataURL();
        im.setAttribute('style', txt);
        return im;
      } catch {}
    }
    for (let c = src.firstChild; c; c = c.nextSibling) dst.appendChild(cloneStyled(c));
    return dst;
  };
  const clone = cloneStyled(node);
  clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  // Drop the card's own shadow/radius so the export is a flush w×h rect;
  // the artboard's own background (if any) is already in the computed style.
  clone.style.boxShadow = 'none';
  clone.style.borderRadius = '0';
  const jobs = [];
  clone.querySelectorAll('img').forEach(el => {
    const s = el.getAttribute('src');
    if (s && s.indexOf('data:') !== 0) jobs.push(toDataURL(el.src).then(d => el.setAttribute('src', d)));
  });
  [clone, ...clone.querySelectorAll('*')].forEach(el => {
    const bg = el.style.backgroundImage;
    if (!bg) return;
    let m;
    const re = /url\(["']?([^"')]+)["']?\)/g;
    while (m = re.exec(bg)) {
      const tok = m[0],
        url = m[1];
      if (url.indexOf('data:') === 0) continue;
      jobs.push(toDataURL(url).then(d => {
        el.style.backgroundImage = el.style.backgroundImage.split(tok).join('url("' + d + '")');
      }));
    }
  });
  await Promise.all(jobs);
  const xml = new XMLSerializer().serializeToString(clone);
  const save = (blob, ext) => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name + '.' + ext;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  if (kind === 'html') {
    const html = '<!doctype html><html><head><meta charset="utf-8"><title>' + name + '</title>' + (fontCss ? '<style>' + fontCss + '</style>' : '') + '</head><body style="margin:0">' + xml + '</body></html>';
    return save(new Blob([html], {
      type: 'text/html'
    }), 'html');
  }

  // PNG: the SVG's own width/height must be the output resolution — an
  // <img>-loaded SVG rasterizes at its intrinsic size, so sizing it at 1×
  // and ctx.scale()-ing up would just upscale a 1× bitmap. viewBox maps the
  // w×h foreignObject onto the px·w × px·h SVG canvas so the browser renders
  // the HTML at full resolution.
  const px = 3;
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w * px + '" height="' + h * px + '" viewBox="0 0 ' + w + ' ' + h + '"><foreignObject width="' + w + '" height="' + h + '">' + (fontCss ? '<style><![CDATA[' + fontCss + ']]></style>' : '') + xml + '</foreignObject></svg>';
  const img = new Image();
  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = () => rej(new Error('svg load failed'));
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
  const cv = document.createElement('canvas');
  cv.width = w * px;
  cv.height = h * px;
  cv.getContext('2d').drawImage(img, 0, 0);
  cv.toBlob(blob => save(blob, 'png'), 'image/png');
}
function DCArtboardFrame({
  sectionId,
  artboard,
  label,
  order,
  onRename,
  onReorder,
  onFocus,
  onDelete
}) {
  const {
    id: rawId,
    label: rawLabel,
    width = 260,
    height = 480,
    children,
    style = {}
  } = artboard.props;
  const id = rawId ?? rawLabel;
  const ref = React.useRef(null);
  const cardRef = React.useRef(null);
  const menuRef = React.useRef(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);

  // ⋯ menu: close on any outside pointerdown. Two-click delete lives inside
  // the menu — first click arms the row, second commits; closing disarms.
  React.useEffect(() => {
    if (!menuOpen) {
      setConfirming(false);
      return;
    }
    const off = e => {
      if (!menuRef.current || !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('pointerdown', off, true);
    return () => document.removeEventListener('pointerdown', off, true);
  }, [menuOpen]);
  const doExport = kind => {
    setMenuOpen(false);
    if (!cardRef.current) return;
    const name = String(label || id || 'artboard').replace(/[^\w\s.-]+/g, '_');
    dcExport(cardRef.current, width, height, name, kind).catch(e => console.error('[design-canvas] export failed:', e));
  };

  // Live drag-reorder: dragged card sticks to cursor; siblings slide into
  // their would-be slots in real time via transforms. DOM order only
  // changes on drop.
  const onGripDown = e => {
    e.preventDefault();
    e.stopPropagation();
    const me = ref.current;
    // translateX is applied in local (pre-scale) space but pointer deltas and
    // getBoundingClientRect().left are screen-space — divide by the viewport's
    // current scale so the dragged card tracks the cursor at any zoom level.
    const scale = me.getBoundingClientRect().width / me.offsetWidth || 1;
    const peers = Array.from(document.querySelectorAll(`[data-dc-section="${sectionId}"] [data-dc-slot]`));
    const homes = peers.map(el => ({
      el,
      id: el.dataset.dcSlot,
      x: el.getBoundingClientRect().left
    }));
    const slotXs = homes.map(h => h.x);
    const startIdx = order.indexOf(id);
    const startX = e.clientX;
    let liveOrder = order.slice();
    me.classList.add('dc-dragging');
    const layout = () => {
      for (const h of homes) {
        if (h.id === id) continue;
        const slot = liveOrder.indexOf(h.id);
        h.el.style.transform = `translateX(${(slotXs[slot] - h.x) / scale}px)`;
      }
    };
    const move = ev => {
      const dx = ev.clientX - startX;
      me.style.transform = `translateX(${dx / scale}px)`;
      const cur = homes[startIdx].x + dx;
      let nearest = 0,
        best = Infinity;
      for (let i = 0; i < slotXs.length; i++) {
        const d = Math.abs(slotXs[i] - cur);
        if (d < best) {
          best = d;
          nearest = i;
        }
      }
      if (liveOrder.indexOf(id) !== nearest) {
        liveOrder = order.filter(k => k !== id);
        liveOrder.splice(nearest, 0, id);
        layout();
      }
    };
    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      const finalSlot = liveOrder.indexOf(id);
      me.classList.remove('dc-dragging');
      me.style.transform = `translateX(${(slotXs[finalSlot] - homes[startIdx].x) / scale}px)`;
      // After the settle transition, kill transitions + clear transforms +
      // commit the reorder in the same frame so there's no visual snap-back.
      setTimeout(() => {
        for (const h of homes) {
          h.el.style.transition = 'none';
          h.el.style.transform = '';
        }
        if (liveOrder.join('|') !== order.join('|')) onReorder(liveOrder);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          for (const h of homes) h.el.style.transition = '';
        }));
      }, 180);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    "data-dc-slot": id,
    style: {
      position: 'relative',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-header",
    "data-omelette-chrome": "",
    style: {
      color: DC.label
    },
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-labelrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-grip",
    onPointerDown: onGripDown,
    title: "Drag to reorder"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "9",
    height: "13",
    viewBox: "0 0 9 13",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "11",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "11",
    r: "1.1"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-labeltext",
    onClick: onFocus,
    title: "Click to focus"
  }, /*#__PURE__*/React.createElement(DCEditable, {
    value: label,
    onChange: onRename,
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: DC.label,
      lineHeight: 1
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-btns"
  }, /*#__PURE__*/React.createElement("div", {
    ref: menuRef,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "dc-kebab",
    title: "More",
    onClick: () => setMenuOpen(o => !o)
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2.5",
    cy: "6",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "6",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9.5",
    cy: "6",
    r: "1.1"
  }))), menuOpen && /*#__PURE__*/React.createElement("div", {
    className: "dc-menu",
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => doExport('png')
  }, "Download PNG"), /*#__PURE__*/React.createElement("button", {
    onClick: () => doExport('html')
  }, "Download HTML"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("button", {
    className: "dc-danger",
    onClick: () => {
      if (confirming) {
        setMenuOpen(false);
        onDelete();
      } else setConfirming(true);
    }
  }, confirming ? 'Click again to delete' : 'Delete'))), /*#__PURE__*/React.createElement("button", {
    className: "dc-expand",
    onClick: onFocus,
    title: "Focus"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 1h4v4M5 11H1V7M11 1L7.5 4.5M1 11l3.5-3.5"
  }))))), /*#__PURE__*/React.createElement("div", {
    ref: cardRef,
    className: "dc-card",
    style: {
      borderRadius: 2,
      boxShadow: '0 1px 3px rgba(0,0,0,.08),0 4px 16px rgba(0,0,0,.06)',
      overflow: 'hidden',
      width,
      height,
      background: '#fff',
      ...style
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb',
      fontSize: 13,
      fontFamily: DC.font
    }
  }, id)));
}

// Inline rename — commits on blur or Enter.
function DCEditable({
  value,
  onChange,
  style,
  tag = 'span',
  onClick
}) {
  const T = tag;
  return /*#__PURE__*/React.createElement(T, {
    className: "dc-editable",
    contentEditable: true,
    suppressContentEditableWarning: true,
    onClick: onClick,
    onPointerDown: e => e.stopPropagation(),
    onBlur: e => onChange && onChange(e.currentTarget.textContent),
    onKeyDown: e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.currentTarget.blur();
      }
    },
    style: style
  }, value);
}

// ─────────────────────────────────────────────────────────────
// Focus mode — overlay one artboard; ←/→ within section, ↑/↓ across
// sections, Esc or backdrop click to exit.
// ─────────────────────────────────────────────────────────────
function DCFocusOverlay({
  entry,
  sectionMeta,
  sectionOrder
}) {
  const ctx = React.useContext(DCCtx);
  const {
    sectionId,
    artboard
  } = entry;
  const sec = ctx.section(sectionId);
  const meta = sectionMeta[sectionId];
  const peers = meta.slotIds;
  const aid = artboard.props.id ?? artboard.props.label;
  const idx = peers.indexOf(aid);
  const secIdx = sectionOrder.indexOf(sectionId);
  const go = d => {
    const n = peers[(idx + d + peers.length) % peers.length];
    if (n) ctx.setFocus(`${sectionId}/${n}`);
  };
  const goSection = d => {
    // Sections whose artboards are all deleted have slotIds:[] — step past
    // them to the next non-empty section so ↑/↓ doesn't dead-end.
    const n = sectionOrder.length;
    for (let i = 1; i < n; i++) {
      const ns = sectionOrder[((secIdx + d * i) % n + n) % n];
      const first = sectionMeta[ns] && sectionMeta[ns].slotIds[0];
      if (first) {
        ctx.setFocus(`${ns}/${first}`);
        return;
      }
    }
  };
  React.useEffect(() => {
    const k = e => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        goSection(-1);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goSection(1);
      }
    };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  });
  const {
    width = 260,
    height = 480,
    children
  } = artboard.props;
  const [vp, setVp] = React.useState({
    w: window.innerWidth,
    h: window.innerHeight
  });
  React.useEffect(() => {
    const r = () => setVp({
      w: window.innerWidth,
      h: window.innerHeight
    });
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);
  const scale = Math.max(0.1, Math.min((vp.w - 200) / width, (vp.h - 260) / height, 2));
  const [ddOpen, setDd] = React.useState(false);
  const Arrow = ({
    dir,
    onClick
  }) => /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onClick();
    },
    style: {
      position: 'absolute',
      top: '50%',
      [dir]: 28,
      transform: 'translateY(-50%)',
      border: 'none',
      background: 'rgba(255,255,255,.08)',
      color: 'rgba(255,255,255,.9)',
      width: 44,
      height: 44,
      borderRadius: 22,
      fontSize: 18,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background .15s'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.18)',
    onMouseLeave: e => e.currentTarget.style.background = 'rgba(255,255,255,.08)'
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: dir === 'left' ? 'M11 3L5 9l6 6' : 'M7 3l6 6-6 6'
  })));

  // Portal to body so position:fixed is the real viewport regardless of any
  // transform on DesignCanvas's ancestors (including the canvas zoom itself).
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    onClick: () => ctx.setFocus(null),
    onWheel: e => e.preventDefault(),
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(24,20,16,.6)',
      backdropFilter: 'blur(14px)',
      fontFamily: DC.font,
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 72,
      display: 'flex',
      alignItems: 'flex-start',
      padding: '16px 20px 0',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDd(o => !o),
    style: {
      border: 'none',
      background: 'transparent',
      color: '#fff',
      cursor: 'pointer',
      padding: '6px 8px',
      borderRadius: 6,
      textAlign: 'left',
      fontFamily: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: -0.3
    }
  }, meta.title), /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 11 11",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    style: {
      opacity: .7
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 4l3.5 3.5L9 4"
  }))), meta.subtitle && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 13,
      opacity: .6,
      fontWeight: 400,
      marginTop: 2
    }
  }, meta.subtitle)), ddOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      marginTop: 4,
      background: '#2a251f',
      borderRadius: 8,
      boxShadow: '0 8px 32px rgba(0,0,0,.4)',
      padding: 4,
      minWidth: 200,
      zIndex: 10
    }
  }, sectionOrder.filter(sid => sectionMeta[sid].slotIds.length).map(sid => /*#__PURE__*/React.createElement("button", {
    key: sid,
    onClick: () => {
      setDd(false);
      const f = sectionMeta[sid].slotIds[0];
      if (f) ctx.setFocus(`${sid}/${f}`);
    },
    style: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      border: 'none',
      cursor: 'pointer',
      background: sid === sectionId ? 'rgba(255,255,255,.1)' : 'transparent',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: 5,
      fontSize: 14,
      fontWeight: sid === sectionId ? 600 : 400,
      fontFamily: 'inherit'
    }
  }, sectionMeta[sid].title)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => ctx.setFocus(null),
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.12)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent',
    style: {
      border: 'none',
      background: 'transparent',
      color: 'rgba(255,255,255,.7)',
      width: 32,
      height: 32,
      borderRadius: 16,
      fontSize: 20,
      cursor: 'pointer',
      lineHeight: 1,
      transition: 'background .12s'
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 64,
      bottom: 56,
      left: 100,
      right: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: width * scale,
      height: height * scale,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      background: '#fff',
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: '0 20px 80px rgba(0,0,0,.4)'
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb'
    }
  }, aid))), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 14,
      fontWeight: 500,
      opacity: .85,
      textAlign: 'center'
    }
  }, (sec.labels || {})[aid] ?? artboard.props.label, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .5,
      marginLeft: 10,
      fontVariantNumeric: 'tabular-nums'
    }
  }, idx + 1, " / ", peers.length))), /*#__PURE__*/React.createElement(Arrow, {
    dir: "left",
    onClick: () => go(-1)
  }), /*#__PURE__*/React.createElement(Arrow, {
    dir: "right",
    onClick: () => go(1)
  }), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 8
    }
  }, peers.map((p, i) => /*#__PURE__*/React.createElement("button", {
    key: p,
    onClick: () => ctx.setFocus(`${sectionId}/${p}`),
    style: {
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      width: 6,
      height: 6,
      borderRadius: 3,
      background: i === idx ? '#fff' : 'rgba(255,255,255,.3)'
    }
  })))), document.body);
}

// ─────────────────────────────────────────────────────────────
// Post-it — absolute-positioned sticky note
// ─────────────────────────────────────────────────────────────
function DCPostIt({
  children,
  top,
  left,
  right,
  bottom,
  rotate = -2,
  width = 180
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top,
      left,
      right,
      bottom,
      width,
      background: DC.postitBg,
      padding: '14px 16px',
      fontFamily: '"Comic Sans MS", "Marker Felt", "Segoe Print", cursive',
      fontSize: 14,
      lineHeight: 1.4,
      color: DC.postitText,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
      transform: `rotate(${rotate}deg)`,
      zIndex: 5
    }
  }, children);
}
Object.assign(window, {
  DesignCanvas,
  DCSection,
  DCArtboard,
  DCPostIt
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "explorations/design-canvas.jsx", error: String((e && e.message) || e) }); }

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

    // --- capture loop -------------------------------------------------------
    const resetHold = () => {
      holdRef.current = -90;
    };
    const land = () => {
      const {
        p,
        s: col
      } = selRef.current;
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
      setCaptureState("idle");
      // advance selection
      setSelected(cur => {
        if (cur.s + 1 < strings) return {
          p: cur.p,
          s: cur.s + 1
        };
        if (cur.p + 1 < pickups) return {
          p: cur.p + 1,
          s: 0
        };
        return cur;
      });
    };
    const arm = () => {
      if (captureState !== "idle") {
        clearTimers();
        setCaptureState("idle");
        return;
      }
      setCaptureState("armed");
      timers.current.push(setTimeout(() => {
        setCaptureState("capturing");
        env.current = 1;
        timers.current.push(setTimeout(land, 520));
      }, 700));
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
        } else if (e.code === "Escape") cancel();else if (e.code === "ArrowRight") setSelected(c => ({
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
      columnNotes: columnNotes
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
/* Capture grid section — egui grid_widget. Header controls, note-labeled columns,
   editable pickup rows of heatmap cells, and the pickup-to-pickup verdict lines. */
(function () {
  const {
    GridCell,
    SegmentedToggle,
    Stepper,
    Button,
    StatusBadge,
    TextField,
    SectionLabel
  } = window.PickupTunerDesignSystem_dfbad4;
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
      columnNotes
    } = props;
    const metricKey = metric === "RMS" ? "rms" : "peak";

    // string column labels: S6 .. S1 left to right (low on the left)
    const colLabels = [];
    for (let s = 0; s < strings; s++) colLabels.push("S" + (strings - s));
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: "var(--space-3)",
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement(SectionLabel, null, "Capture grid"), /*#__PURE__*/React.createElement(SegmentedToggle, {
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
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 1,
        height: 18,
        background: "var(--plate-edge)"
      }
    }), /*#__PURE__*/React.createElement(Button, {
      onClick: onArm,
      tone: captureState === "idle" ? "neutral" : "amber"
    }, captureState === "idle" ? "Arm capture (Space)" : "Cancel (Space/Esc)"), captureState === "armed" && /*#__PURE__*/React.createElement(StatusBadge, {
      tone: "amber",
      lamp: true
    }, "armed \u2014 pluck the string\u2026"), captureState === "capturing" && /*#__PURE__*/React.createElement(StatusBadge, {
      tone: "olive",
      lamp: true
    }, "capturing\u2026"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: "auto",
        display: "flex",
        gap: "var(--space-3)"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      size: "small",
      onClick: onClearSlot
    }, "Clear slot"), /*#__PURE__*/React.createElement(Button, {
      size: "small",
      onClick: onClearAll
    }, "Clear all"))), /*#__PURE__*/React.createElement("div", {
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
      return /*#__PURE__*/React.createElement(React.Fragment, {
        key: p
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          paddingRight: "var(--space-3)"
        }
      }, /*#__PURE__*/React.createElement(TextField, {
        value: pickupNames[p],
        onChange: v => setPickupName(p, v),
        width: "100%"
      })), row.map((cell, s) => {
        const delta = cell && med != null ? cell[metricKey] - med : null;
        return /*#__PURE__*/React.createElement(GridCell, {
          key: s,
          delta: cell ? delta : null,
          level: cell ? cell[metricKey] : null,
          balance: balance,
          clipped: cell ? cell.clipped : false,
          selected: selected.p === p && selected.s === s,
          onClick: () => setSelected({
            p,
            s
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
    Button
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
    })), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement(Heading, null, "Grid"), /*#__PURE__*/React.createElement(Field, null, /*#__PURE__*/React.createElement(Slider, {
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

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.SegmentedToggle = __ds_scope.SegmentedToggle;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Slider = __ds_scope.Slider;

__ds_ns.Stepper = __ds_scope.Stepper;

__ds_ns.TextField = __ds_scope.TextField;

__ds_ns.GridCell = __ds_scope.GridCell;

__ds_ns.Meter = __ds_scope.Meter;

__ds_ns.Tuner = __ds_scope.Tuner;

__ds_ns.Panel = __ds_scope.Panel;

__ds_ns.SectionLabel = __ds_scope.SectionLabel;

__ds_ns.StatusBadge = __ds_scope.StatusBadge;

})();
