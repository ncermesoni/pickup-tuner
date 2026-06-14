/* Capture grid section. Frozen toolbar (nothing reflows when armed), a reserved-
   height capture-mode strip, note-labeled columns, editable pickup rows of
   heatmap cells with a live capture target, and the pickup-to-pickup verdicts. */
(function () {
  const { GridCell, SegmentedToggle, Stepper, Button, TextField, SectionLabel } =
    window.PickupTunerDesignSystem_dfbad4;

  const ARM_BTN_W = 168; // fixed so "Arm capture" ⇄ "Cancel (Space/Esc)" never resizes the row

  function CaptureGrid(props) {
    const {
      grid, selected, setSelected, metric, setMetric, strings, pickups,
      onReshape, captureState, onArm, onClearSlot, onClearAll,
      pickupNames, setPickupName, balance, columnNotes, tuning, flashCell, rowDone,
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
      gap: "var(--space-3)",
    };

    return (
      <div>
        {/* ---- frozen toolbar: nowrap, fixed-width arm button, reserved right group ---- */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "nowrap" }}>
          <SectionLabel>Capture grid</SectionLabel>
          <div style={lock}>
            <SegmentedToggle options={["RMS", "Peak"]} value={metric} onChange={setMetric} />
            <div style={{ width: 1, height: 18, background: "var(--plate-edge)" }} />
            <Stepper label="strings:" value={strings} min={4} max={12} onChange={(v) => onReshape(v, pickups)} />
            <Stepper label="pickups:" value={pickups} min={1} max={4} onChange={(v) => onReshape(strings, v)} />
          </div>
          <div style={{ width: 1, height: 18, background: "var(--plate-edge)" }} />
          <div style={{ width: ARM_BTN_W, flex: "none" }}>
            <Button onClick={onArm} tone={armed ? "amber" : "brass"} style={{ width: "100%", textAlign: "center" }}>
              {armed ? "Cancel (Space/Esc)" : "Arm capture (Space)"}
            </Button>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: "var(--space-3)", flex: "none",
                        opacity: armed ? 0.4 : 1, pointerEvents: armed ? "none" : "auto",
                        transition: "opacity 140ms linear" }}>
            <Button size="small" onClick={onClearSlot}>Clear slot</Button>
            <Button size="small" onClick={onClearAll}>Clear all</Button>
          </div>
        </div>

        {/* ---- capture-mode strip: ALWAYS present (reserved height) so the grid never shifts ---- */}
        <ModeStrip
          captureState={captureState} selected={selected} strings={strings}
          tuning={tuning} pickupNames={pickupNames} rowDone={rowDone}
        />

        {/* legend */}
        <div style={{ font: "var(--type-body)", fontSize: "var(--text-xs)", color: "var(--text-muted)",
                      margin: "var(--space-3) 0 var(--space-4)" }}>
          each cell: distance from that pickup's median string · ↑ raise pole · ↓ lower pole · ✓ balanced
          (within ±{balance.toFixed(1)} dB)
        </div>

        {/* grid */}
        <div style={{ display: "inline-grid",
                      gridTemplateColumns: `120px repeat(${strings}, var(--cell-w))`,
                      gap: "var(--grid-gap)", alignItems: "center" }}>
          <div />
          {colLabels.map((label, s) => (
            <div key={s} style={{ textAlign: "center" }}>
              {columnNotes[s] ? (
                <>
                  <div style={{ font: "var(--type-title)", color: "var(--text-primary)" }}>{columnNotes[s]}</div>
                  <div style={{ font: "var(--type-body)", fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{label}</div>
                </>
              ) : (
                <div style={{ font: "var(--type-title)", color: "var(--text-primary)" }}>{label}</div>
              )}
            </div>
          ))}

          {grid.map((row, p) => {
            const med = window.PT.rowMedian(row, metricKey);
            const rowActive = armed && selected.p === p;
            return (
              <React.Fragment key={p}>
                <div style={{ paddingRight: "var(--space-3)", display: "flex", alignItems: "center", gap: "6px" }}>
                  {rowActive && (
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--brass)",
                                   boxShadow: "0 0 7px var(--brass)", flex: "none" }} />
                  )}
                  <TextField value={pickupNames[p]} onChange={(v) => setPickupName(p, v)} width="100%" />
                </div>
                {row.map((cell, col) => {
                  const delta = cell && med != null ? cell[metricKey] - med : null;
                  const isTarget = armed && selected.p === p && selected.s === col;
                  const isFlash = flashCell && flashCell.p === p && flashCell.s === col;
                  return (
                    <GridCell
                      key={col}
                      delta={cell ? delta : null}
                      level={cell ? cell[metricKey] : null}
                      balance={balance}
                      clipped={cell ? cell.clipped : false}
                      selected={!armed && selected.p === p && selected.s === col}
                      target={isTarget}
                      flash={isFlash}
                      onClick={armed ? undefined : () => setSelected({ p, s: col })}
                    />
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>

        <Verdicts grid={grid} metricKey={metricKey} pickupNames={pickupNames} balance={balance} />
      </div>
    );
  }

  function ModeStrip({ captureState, selected, strings, tuning, pickupNames, rowDone }) {
    const colLabel = "S" + (strings - selected.s);
    const note = tuning[selected.s] || tuning[0];
    const noteName = note ? `${note.name}${note.octave}` : "";
    const pickup = pickupNames[selected.p];

    let bg = "transparent", border = "1px solid var(--plate-edge)", body = null;

    if (captureState === "armed") {
      bg = "rgba(214,162,78,0.16)";
      border = "1px solid rgba(214,162,78,0.5)";
      body = (
        <>
          <Lamp color="var(--amber)" pulse />
          <span style={cap("var(--amber)")}>ARMED</span>
          <span style={txt}>pluck <b style={strong}>{colLabel}</b> · <b style={strong}>{noteName}</b> on <b style={strong}>{pickup}</b></span>
          <span style={{ ...hint, marginLeft: "auto" }}>auto-captures on transient · Space/Esc to cancel</span>
        </>
      );
    } else if (captureState === "capturing") {
      bg = "rgba(106,160,67,0.18)";
      border = "1px solid rgba(106,160,67,0.5)";
      body = (
        <>
          <Lamp color="var(--olive)" pulse />
          <span style={cap("var(--olive-deep)")}>CAPTURING</span>
          <span style={txt}><b style={strong}>{colLabel}</b> · <b style={strong}>{noteName}</b> — hold the note…</span>
        </>
      );
    } else if (rowDone) {
      bg = "rgba(106,160,67,0.14)";
      border = "1px solid rgba(106,160,67,0.45)";
      body = (
        <>
          <span style={{ color: "var(--olive-deep)", fontSize: "13px" }}>✓</span>
          <span style={txt}>Row complete — flip your guitar's pickup selector to <b style={strong}>{pickup}</b>, then arm again.</span>
        </>
      );
    } else {
      body = <span style={hint}>Ready — select a cell, press <b style={{ color: "var(--text-primary)" }}>Space</b> to arm, then pluck each string in turn.</span>;
    }

    return (
      <div style={{ marginTop: "var(--space-3)", minHeight: 34, display: "flex", alignItems: "center",
                    gap: "10px", padding: "6px 12px", borderRadius: "var(--radius-sm)",
                    background: bg, border, transition: "background 140ms linear" }}>
        {body}
      </div>
    );
  }

  function Lamp({ color, pulse }) {
    return (
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flex: "none",
                     boxShadow: `0 0 8px ${color}`,
                     animation: pulse ? "ptcArrow 1.1s ease-in-out infinite" : "none" }} />
    );
  }

  const cap = (color) => ({ font: "var(--type-caption)", letterSpacing: "var(--tracking-label)",
                            textTransform: "uppercase", color, flex: "none" });
  const txt = { font: "var(--type-label)", color: "var(--text-primary)" };
  const strong = { color: "var(--ink-strong)", fontWeight: "var(--weight-strong)" };
  const hint = { font: "var(--type-label)", color: "var(--text-muted)" };

  function Verdicts({ grid, metricKey, pickupNames, balance }) {
    const avgs = grid
      .map((row, p) => {
        const vals = row.filter(Boolean).map((c) => c[metricKey]);
        return vals.length ? { p, avg: vals.reduce((a, b) => a + b, 0) / vals.length } : null;
      })
      .filter(Boolean);
    if (avgs.length < 2) return null;
    const base = avgs[0];
    const baseName = pickupNames[base.p];
    return (
      <div style={{ marginTop: "var(--space-4)", display: "flex", flexDirection: "column", gap: "4px" }}>
        {avgs.slice(1).map(({ p, avg }) => {
          const diff = avg - base.avg;
          const name = pickupNames[p];
          let verdict, tone = "muted";
          if (Math.abs(diff) <= balance) { verdict = "level-matched ✓"; tone = "olive"; }
          else if (diff > 0) verdict = `${diff >= 0 ? "+" : ""}${diff.toFixed(1)} dB hotter — lower it or raise ${baseName}`;
          else verdict = `${diff.toFixed(1)} dB quieter — raise it or lower ${baseName}`;
          return (
            <div key={p} style={{ font: "var(--type-label)", color: "var(--text-primary)" }}>
              <span style={{ color: "var(--text-muted)" }}>{name} vs {baseName}: </span>
              <span style={{ color: tone === "olive" ? "var(--olive-deep)" : "var(--ink-strong)" }}>{verdict}</span>
            </div>
          );
        })}
      </div>
    );
  }

  window.CaptureGrid = CaptureGrid;
})();
