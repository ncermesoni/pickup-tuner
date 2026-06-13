/* Top status bar — the tweed chassis header with silkscreen wordmark, model
   plate, and the live engine state with a brass power lamp. */
(function () {
  const { Button, StatusBadge } = window.PickupTunerDesignSystem_dfbad4;

  function StatusBar({ state, inputChannel, onReconnect }) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-5)",
          height: "var(--topbar-h)",
          padding: "0 var(--space-6)",
          background: "transparent",
          borderBottom: "1px solid var(--chassis-line)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
          {/* silkscreen bar-graph mark */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "18px" }}>
            <span style={{ width: 4, height: 7, background: "var(--chassis-dim)", borderRadius: 1 }} />
            <span style={{ width: 4, height: 11, background: "var(--chassis-dim)", borderRadius: 1 }} />
            <span style={{ width: 4, height: 18, background: "var(--brass)", borderRadius: 1,
                           boxShadow: "0 0 8px var(--brass)" }} />
            <span style={{ width: 4, height: 12, background: "var(--chassis-dim)", borderRadius: 1 }} />
            <span style={{ width: 4, height: 8, background: "var(--chassis-dim)", borderRadius: 1 }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
            <span style={{ font: "var(--type-title)", color: "var(--text-on-chassis)",
                           letterSpacing: "var(--tracking-brand)" }}>PICKUP TUNER</span>
            <span style={{ fontFamily: "var(--font-ui)", fontSize: "8.5px", color: "var(--text-on-chassis-dim)",
                           letterSpacing: "var(--tracking-wide)", textTransform: "uppercase", marginTop: "3px" }}>
              pole &middot; height &middot; balance
            </span>
          </div>
          <span style={{ marginLeft: "4px", fontFamily: "var(--font-mono)", fontSize: "9px",
                         letterSpacing: "0.12em", color: "var(--brass)", border: "1px solid var(--brass-deep)",
                         borderRadius: "3px", padding: "2px 6px" }}>PT-V</span>
        </div>

        {state === "running" && (
          <StatusBadge tone="olive" lamp onDark>monitoring &middot; in {inputChannel}</StatusBadge>
        )}
        {state === "nosignal" && (
          <StatusBadge tone="amber" lamp onDark>
            no signal on input {inputChannel} — check cable/channel
          </StatusBadge>
        )}
        {state === "stopped" && (
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <StatusBadge tone="amber" lamp onDark>audio device stopped</StatusBadge>
            <Button size="small" onClick={onReconnect}>Reconnect</Button>
          </div>
        )}
        {state === "unavailable" && (
          <StatusBadge tone="red" lamp onDark>audio engine unavailable</StatusBadge>
        )}
      </div>
    );
  }

  window.StatusBar = StatusBar;
})();
