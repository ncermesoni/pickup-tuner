/* Capture grid section — egui grid_widget. Header controls, note-labeled columns,
   editable pickup rows of heatmap cells, and the pickup-to-pickup verdict lines. */
(function () {
  const { GridCell, SegmentedToggle, Stepper, Button, StatusBadge, TextField, SectionLabel } =
    window.PickupTunerDesignSystem_dfbad4;

  function CaptureGrid(props) {
    const {
      grid, selected, setSelected, metric, setMetric, strings, pickups,
      onReshape, captureState, onArm, onClearSlot, onClearAll,
      pickupNames, setPickupName, balance, columnNotes,
    } = props;

    const metricKey = metric === "RMS" ? "rms" : "peak";

    // string column labels: S6 .. S1 left to right (low on the left)
    const colLabels = [];
    for (let s = 0; s < strings; s++) colLabels.push("S" + (strings - s));

    return (
      <div>
        {/* header row */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
          <SectionLabel>Capture grid</SectionLabel>
          <SegmentedToggle options={["RMS", "Peak"]} value={metric} onChange={setMetric} />
          <div style={{ width: 1, height: 18, background: "var(--plate-edge)" }} />
          <Stepper label="strings:" value={strings} min={4} max={12}
            onChange={(v) => onReshape(v, pickups)} />
          <Stepper label="pickups:" value={pickups} min={1} max={4}
            onChange={(v) => onReshape(strings, v)} />
          <div style={{ width: 1, height: 18, background: "var(--plate-edge)" }} />
          <Button onClick={onArm} tone={captureState === "idle" ? "neutral" : "amber"}>
            {captureState === "idle" ? "Arm capture (Space)" : "Cancel (Space/Esc)"}
          </Button>
          {captureState === "armed" && <StatusBadge tone="amber" lamp>armed — pluck the string…</StatusBadge>}
          {captureState === "capturing" && <StatusBadge tone="olive" lamp>capturing…</StatusBadge>}
          <div style={{ marginLeft: "auto", display: "flex", gap: "var(--space-3)" }}>
            <Button size="small" onClick={onClearSlot}>Clear slot</Button>
            <Button size="small" onClick={onClearAll}>Clear all</Button>
          </div>
        </div>

        <div style={{ font: "var(--type-body)", fontSize: "var(--text-xs)", color: "var(--text-muted)",
                      margin: "var(--space-3) 0 var(--space-4)" }}>
          each cell: distance from that pickup's median string · ↑ raise pole · ↓ lower pole · ✓ balanced
          (within ±{balance.toFixed(1)} dB)
        </div>

        {/* grid */}
        <div style={{ display: "inline-grid",
                      gridTemplateColumns: `120px repeat(${strings}, var(--cell-w))`,
                      gap: "var(--grid-gap)", alignItems: "center" }}>
          {/* column header row */}
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

          {/* pickup rows */}
          {grid.map((row, p) => {
            const med = window.PT.rowMedian(row, metricKey);
            return (
              <React.Fragment key={p}>
                <div style={{ paddingRight: "var(--space-3)" }}>
                  <TextField value={pickupNames[p]} onChange={(v) => setPickupName(p, v)} width="100%" />
                </div>
                {row.map((cell, s) => {
                  const delta = cell && med != null ? cell[metricKey] - med : null;
                  return (
                    <GridCell
                      key={s}
                      delta={cell ? delta : null}
                      level={cell ? cell[metricKey] : null}
                      balance={balance}
                      clipped={cell ? cell.clipped : false}
                      selected={selected.p === p && selected.s === s}
                      onClick={() => setSelected({ p, s })}
                    />
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>

        {/* pickup-to-pickup verdicts */}
        <Verdicts grid={grid} metricKey={metricKey} pickupNames={pickupNames} balance={balance} />
      </div>
    );
  }

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
