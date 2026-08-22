import React from "react";
import { IconPower } from "@tabler/icons-react";

interface Props {
  manualColor: "red" | "blue" | "green" | "off";
  onSelectColor: (color: "red" | "blue" | "green" | "off") => void;
}

export const ManualView: React.FC<Props> = ({ manualColor, onSelectColor }) => {
  return (
    <section className="view-panel">
      <div className="card manual-card">
        <div className="card-header">
          <span className="card-tag">MANUAL LED CONTROL</span>
          <span className="manual-hint">Select color to light up</span>
        </div>

        <div className="status-dock">
          <button
            className={`led-bulb red ${manualColor === "red" ? "active" : ""}`}
            title="Set LED Red (On-Air)"
            type="button"
            onClick={() => onSelectColor("red")}
          >
            <span className="bulb-reflection"></span>
            <span className="bulb-label">RED</span>
          </button>

          <button
            className={`led-bulb blue ${manualColor === "blue" ? "active" : ""}`}
            title="Set LED Blue (Mic Live)"
            type="button"
            onClick={() => onSelectColor("blue")}
          >
            <span className="bulb-reflection"></span>
            <span className="bulb-label">BLUE</span>
          </button>

          <button
            className={`led-bulb green ${manualColor === "green" ? "active" : ""}`}
            title="Set LED Green (Safe / Idle)"
            type="button"
            onClick={() => onSelectColor("green")}
          >
            <span className="bulb-reflection"></span>
            <span className="bulb-label">GREEN</span>
          </button>
        </div>

        <div className="manual-actions">
          <button
            className="btn-off-control"
            type="button"
            onClick={() => onSelectColor("off")}
          >
            <IconPower size={14} stroke={2} />
            Turn Off LEDs
          </button>
        </div>
      </div>
    </section>
  );
};
