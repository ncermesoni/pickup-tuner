/* Right config panel — a cream faceplate column: Audio / Monitoring / Tuner / Grid,
   with engraved Oswald headings and hairline dividers. */
(function () {
  const { Select, Slider, Checkbox, Button, Tooltip } = window.PickupTunerDesignSystem_dfbad4;

  function Heading({ children }) {
    return (
      <div style={{ font: "var(--type-caption)", color: "var(--text-muted)",
                    letterSpacing: "var(--tracking-label)", textTransform: "uppercase",
                    margin: "0 0 var(--space-4)" }}>
        {children}
      </div>
    );
  }
  function Divider() {
    return <div style={{ height: 1, background: "var(--plate-edge)", margin: "var(--space-6) 0" }} />;
  }
  function Field({ children }) {
    return <div style={{ marginBottom: "var(--space-3)" }}>{children}</div>;
  }

  function ConfigPanel({ s, set, onApply }) {
    return (
      <div
        style={{
          width: "var(--config-panel-w)",
          flex: "none",
          background: "var(--grad-plate)",
          borderLeft: "1px solid var(--chassis-line)",
          boxShadow: "inset 1px 0 0 var(--plate-hi)",
          padding: "var(--space-6)",
          overflowY: "auto",
        }}
      >
        <Heading>Audio</Heading>
        <Field><Select label="Driver" value={s.driver}
          options={["ASIO", "Windows Audio", "DirectSound"]} onChange={(v) => set({ driver: v })} /></Field>
        <Field><Select label="Input device" value={s.inputDevice}
          options={["Focusrite USB ASIO", "Realtek ASIO", "(default)"]} onChange={(v) => set({ inputDevice: v })} /></Field>
        <Field><Select label="Output device" value={s.outputDevice}
          options={["Focusrite USB ASIO", "Speakers (Realtek)", "(default)"]} onChange={(v) => set({ outputDevice: v })} /></Field>
        <Field><Select label="Sample rate" value={String(s.sampleRate)}
          options={["44100", "48000", "88200", "96000"]} onChange={(v) => set({ sampleRate: +v })} /></Field>
        <Field><Select label="Buffer size" value={String(s.bufferSize)}
          options={["64", "128", "256", "512"]} onChange={(v) => set({ bufferSize: +v })} /></Field>
        <Field><Select label="Input channel" value={String(s.inputChannel)}
          options={["1", "2"]} onChange={(v) => set({ inputChannel: +v })} /></Field>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginTop: "var(--space-3)" }}>
          <Button tone="brass" onClick={onApply}>Apply</Button>
          <span style={{ font: "var(--type-readout)", fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
            active: {s.sampleRate} Hz / {s.bufferSize}
          </span>
        </div>

        <Divider />
        <Heading>Monitoring</Heading>
        <Field><Slider value={s.gain} min={-60} max={6} step={1} label="gain (dB)"
          onChange={(v) => set({ gain: v })} /></Field>
        <Checkbox checked={s.mute} label="Mute" onChange={(v) => set({ mute: v })} />

        <Divider />
        <Heading>Tuner</Heading>
        <Field><Slider value={s.a4} min={415} max={466} step={1} label="A4 (Hz)"
          onChange={(v) => set({ a4: v })} /></Field>

        <Divider />
        <Heading>
          <Tooltip placement="bottom"
            content="how close to the row median a string must be to count as balanced (green / ✓)">
            <span style={{ cursor: "help", borderBottom: "1px dotted var(--text-muted)" }}>Grid</span>
          </Tooltip>
        </Heading>
        <Field><Slider value={s.balance} min={0.1} max={3} step={0.1} label="balanced within ± dB"
          onChange={(v) => set({ balance: v })} /></Field>
      </div>
    );
  }

  window.ConfigPanel = ConfigPanel;
})();
