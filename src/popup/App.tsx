import React from "react";
import { usePopupState } from "./hooks/usePopupState";
import { Header } from "./components/Header";
import { ModeSwitcher } from "./components/ModeSwitcher";
import { AutoView } from "./components/AutoView";
import { ManualView } from "./components/ManualView";
import { DeviceSettings } from "./components/DeviceSettings";
import { Footer } from "./components/Footer";

export const App: React.FC = () => {
  const { state, setMode, setManualColor, setEnabled, saveConfig, testPing } =
    usePopupState();

  const enabled = state?.config?.enabled !== false;
  const mode = state?.config?.mode || "auto";
  const manualColor = state?.config?.manualColor || "green";
  const targetColor = state?.targetColor || "green";

  return (
    <div className="p-4 flex flex-col gap-3 min-h-130 box-border">
      <Header enabled={enabled} onToggleEnabled={setEnabled} />

      <ModeSwitcher mode={mode} onModeChange={setMode} />

      {mode === "auto" ? (
        <AutoView
          aggregated={state?.aggregated}
          targetColor={targetColor}
          tabs={state?.tabs}
        />
      ) : (
        <ManualView manualColor={manualColor} onSelectColor={setManualColor} />
      )}

      <DeviceSettings
        espUrl={state?.config?.espUrl}
        connectionState={state?.connectionState}
        enabled={enabled}
        onSaveUrl={saveConfig}
        onPing={testPing}
      />

      <Footer />
    </div>
  );
};

export default App;
