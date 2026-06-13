/* Pickup Tuner — full app recreation. Free-form single screen: status bar, a
   central column of meter / tuner / capture-grid blocks, and the right config
   panel. No real audio — the capture loop, meter and tuner are simulated so the
   whole workflow is clickable. */
(function () {
  const { Panel, Button, StatusBadge, Meter, Tuner } = window.PickupTunerDesignSystem_dfbad4;

  const emptyGrid = (pickups, strings) =>
    Array.from({ length: pickups }, () => Array.from({ length: strings }, () => null));

  // A deterministic "true" level for a string/pickup, plus a little jitter, so
  // captured grids look like a real, slightly-uneven instrument.
  function simulateLevel(p, s, strings) {
    const arch = -Math.pow((s - (strings - 1) / 2) / strings, 2) * 9; // middle strings hotter
    const perPickup = p === 0 ? -1.5 : 0;
    const bump = [0, 1.6, -0.8, 0.4, -1.2, 0.9, 0.2, -0.5][s % 8];
    const rms = -16 + arch + perPickup + bump + (Math.random() - 0.5) * 0.7;
    const peak = rms + 5 + Math.random() * 2.5;
    const clipped = peak > -1.5;
    return { rms: +rms.toFixed(1), peak: +peak.toFixed(1), clipped };
  }

  function App() {
    const { StatusBar, ConfigPanel, CaptureGrid } = window;
    const [s, setS] = React.useState({
      driver: "ASIO", inputDevice: "Focusrite USB ASIO", outputDevice: "Focusrite USB ASIO",
      sampleRate: 48000, bufferSize: 256, inputChannel: 1,
      gain: 0, mute: false, a4: 440, balance: 0.5,
    });
    const set = (patch) => setS((prev) => ({ ...prev, ...patch }));

    const [strings, setStrings] = React.useState(6);
    const [pickups, setPickups] = React.useState(2);
    const [pickupNames, setPickupNames] = React.useState(["Neck", "Bridge"]);
    const [grid, setGrid] = React.useState(() => emptyGrid(2, 6));
    const [selected, setSelected] = React.useState({ p: 0, s: 0 });
    const [metric, setMetric] = React.useState("RMS");
    const [captureState, setCaptureState] = React.useState("idle");
    const [meter, setMeter] = React.useState({ peak: -90, hold: -90, rms: -90 });

    const tuning = React.useMemo(() => window.PT.tuningFor(strings), [strings]);
    const env = React.useRef(0);     // pluck envelope 0..1
    const holdRef = React.useRef(-90);
    const timers = React.useRef([]);
    const selRef = React.useRef(selected);
    selRef.current = selected;

    const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

    // --- simulated meter (and tuner liveness) -------------------------------
    React.useEffect(() => {
      const id = setInterval(() => {
        env.current *= 0.86; // decay
        const idle = -46 + Math.random() * 3;
        const ringing = -52 + env.current * 44;
        const rms = Math.max(idle, ringing) + (Math.random() - 0.5) * 1.2;
        const peak = rms + 4 + Math.random() * 2 + env.current * 3;
        holdRef.current = Math.max(holdRef.current, peak);
        setMeter({ peak: +peak.toFixed(1), hold: +holdRef.current.toFixed(1), rms: +rms.toFixed(1) });
      }, 90);
      return () => clearInterval(id);
    }, []);

    // tuner shows the selected column's note, gently wandering in cents
    const [tick, setTick] = React.useState(0);
    React.useEffect(() => {
      const id = setInterval(() => setTick((t) => t + 1), 140);
      return () => clearInterval(id);
    }, []);
    const tunerReading = React.useMemo(() => {
      const note = tuning[selected.s] || tuning[0];
      const cents = Math.round(Math.sin(tick / 3 + selected.s) * 6 + (env.current > 0.2 ? 0 : 0));
      return {
        name: note.name, octave: note.octave, cents,
        frequency: window.PT.noteFreq(note.name, note.octave, s.a4) * Math.pow(2, cents / 1200),
      };
    }, [tick, selected.s, tuning, s.a4]);

    // --- capture loop -------------------------------------------------------
    const resetHold = () => { holdRef.current = -90; };

    const land = () => {
      const { p, s: col } = selRef.current;
      const lvl = simulateLevel(p, col, strings);
      const note = tuning[col] || tuning[0];
      env.current = 1; // kick the meter
      setGrid((g) => g.map((row, pi) => row.map((cell, si) =>
        pi === p && si === col ? { ...lvl, note: { name: note.name, octave: note.octave } } : cell)));
      setCaptureState("idle");
      // advance selection
      setSelected((cur) => {
        if (cur.s + 1 < strings) return { p: cur.p, s: cur.s + 1 };
        if (cur.p + 1 < pickups) return { p: cur.p + 1, s: 0 };
        return cur;
      });
    };

    const arm = () => {
      if (captureState !== "idle") { clearTimers(); setCaptureState("idle"); return; }
      setCaptureState("armed");
      timers.current.push(setTimeout(() => {
        setCaptureState("capturing");
        env.current = 1;
        timers.current.push(setTimeout(land, 520));
      }, 700));
    };

    const cancel = () => { clearTimers(); setCaptureState("idle"); };

    const clearSlot = () => {
      const { p, s: col } = selRef.current;
      setGrid((g) => g.map((row, pi) => row.map((cell, si) => (pi === p && si === col ? null : cell))));
    };
    const clearAll = () => setGrid(emptyGrid(pickups, strings));

    const reshape = (ns, np) => {
      setGrid((g) => {
        const next = emptyGrid(np, ns);
        for (let p = 0; p < Math.min(np, g.length); p++)
          for (let c = 0; c < Math.min(ns, g[p].length); c++) next[p][c] = g[p][c];
        return next;
      });
      setPickupNames((names) => {
        const base = ["Neck", "Bridge"];
        const out = [];
        for (let i = 0; i < np; i++) out.push(names[i] || base[i] || `Pickup ${i + 1}`);
        return out;
      });
      setStrings(ns); setPickups(np);
      setSelected((cur) => ({ p: Math.min(cur.p, np - 1), s: Math.min(cur.s, ns - 1) }));
    };

    const setPickupName = (p, v) =>
      setPickupNames((names) => names.map((n, i) => (i === p ? v : n)));

    // column note labels (the note heard at capture, per column)
    const columnNotes = React.useMemo(() => {
      const out = Array(strings).fill(null);
      for (let c = 0; c < strings; c++)
        for (let p = 0; p < grid.length; p++) {
          const cell = grid[p][c];
          if (cell && cell.note) { out[c] = `${cell.note.name}${cell.note.octave}`; break; }
        }
      return out;
    }, [grid, strings]);

    // keyboard shortcuts
    React.useEffect(() => {
      const onKey = (e) => {
        if (document.activeElement && document.activeElement.tagName === "INPUT") return;
        if (e.code === "Space") { e.preventDefault(); arm(); }
        else if (e.code === "Escape") cancel();
        else if (e.code === "ArrowRight") setSelected((c) => ({ ...c, s: Math.min(strings - 1, c.s + 1) }));
        else if (e.code === "ArrowLeft") setSelected((c) => ({ ...c, s: Math.max(0, c.s - 1) }));
        else if (e.code === "ArrowDown") setSelected((c) => ({ ...c, p: Math.min(pickups - 1, c.p + 1) }));
        else if (e.code === "ArrowUp") setSelected((c) => ({ ...c, p: Math.max(0, c.p - 1) }));
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [captureState, strings, pickups]);

    const clipped = meter.peak > -1.5;

    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%",
                    background: "var(--grad-chassis)" }}>
        <StatusBar state="running" inputChannel={s.inputChannel} onReconnect={() => {}} />
        <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
          <div style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "var(--space-6)",
                        display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
            <Panel
              label="Level"
              action={<Button size="small" onClick={resetHold}>Reset hold</Button>}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-5)",
                            font: "var(--type-readout)", color: "var(--text-muted)",
                            fontVariantNumeric: "tabular-nums", marginBottom: "var(--space-3)" }}>
                <span>peak <b style={{ color: "var(--ink-strong)", fontWeight: 500 }}>{meter.peak.toFixed(1)}</b></span>
                <span>hold <b style={{ color: "var(--ink-strong)", fontWeight: 500 }}>{meter.hold.toFixed(1)}</b></span>
                <span>rms <b style={{ color: "var(--ink-strong)", fontWeight: 500 }}>{meter.rms.toFixed(1)}</b> dBFS</span>
                {clipped && <StatusBadge tone="red" strong>CLIP</StatusBadge>}
              </div>
              <Meter rms={meter.rms} hold={meter.hold} />
            </Panel>

            <Panel label="Tuner">
              <Tuner reading={tunerReading} />
            </Panel>

            <Panel>
              <CaptureGrid
                grid={grid} selected={selected} setSelected={setSelected}
                metric={metric} setMetric={setMetric}
                strings={strings} pickups={pickups} onReshape={reshape}
                captureState={captureState} onArm={arm}
                onClearSlot={clearSlot} onClearAll={clearAll}
                pickupNames={pickupNames} setPickupName={setPickupName}
                balance={s.balance} columnNotes={columnNotes}
              />
            </Panel>
          </div>
          <ConfigPanel s={s} set={set} onApply={() => {}} />
        </div>
      </div>
    );
  }

  window.PickupTunerApp = App;
})();
