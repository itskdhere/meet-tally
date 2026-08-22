import React from "react";
import { IconPower, IconBroadcast } from "@tabler/icons-react";
import type { LedTargetColor } from "../types";

interface Props {
  manualColor: LedTargetColor;
  onSelectColor: (color: LedTargetColor) => void;
}

export const ManualView: React.FC<Props> = ({ manualColor, onSelectColor }) => {
  const isLive = manualColor === "live";

  return (
    <section className="view-panel">
      <div className="card manual-card">
        <div className="card-header">
          <span className="card-tag">MANUAL LED CONTROL</span>
          <span className="manual-hint">Select color to light up</span>
        </div>

        <div className="status-dock manual-dock-4">
          <button
            className={`led-bulb red ${manualColor === "red" || isLive ? "active" : ""}`}
            title="Set LED Red (Camera On)"
            type="button"
            onClick={() => onSelectColor("red")}
          >
            <span className="bulb-reflection"></span>
            <span className="bulb-label">RED</span>
          </button>

          <button
            className={`led-bulb yellow ${manualColor === "yellow" || isLive ? "active" : ""}`}
            title="Set LED Yellow (Microphone On)"
            type="button"
            onClick={() => onSelectColor("yellow")}
          >
            <span className="bulb-reflection"></span>
            <span className="bulb-label">YELLOW</span>
          </button>

          <button
            className={`led-bulb blue ${manualColor === "blue" ? "active" : ""}`}
            title="Set LED Blue (In Meeting)"
            type="button"
            onClick={() => onSelectColor("blue")}
          >
            <span className="bulb-reflection"></span>
            <span className="bulb-label">BLUE</span>
          </button>

          <button
            className={`led-bulb green ${manualColor === "green" ? "active" : ""}`}
            title="Set LED Green (Not in Meeting)"
            type="button"
            onClick={() => onSelectColor("green")}
          >
            <span className="bulb-reflection"></span>
            <span className="bulb-label">GREEN</span>
          </button>
        </div>

        <div className="manual-actions">
          <button
            className={`btn-live-control ${isLive ? "active" : ""}`}
            type="button"
            onClick={() => onSelectColor("live")}
            title="Set Red + Yellow LED (Camera + Microphone)"
          >
            <IconBroadcast size={15} stroke={2} />
            <span>LIVE (Red + Yellow)</span>
          </button>

          <button
            className="btn-off-control"
            type="button"
            onClick={() => onSelectColor("off")}
          >
            <IconPower size={14} stroke={2} />
            <span>Turn Off</span>
          </button>
        </div>
      </div>
    </section>
  );
};
