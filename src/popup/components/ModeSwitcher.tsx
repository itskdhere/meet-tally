import React from "react";
import { IconRadar, IconBolt } from "@tabler/icons-react";

interface Props {
  mode: "auto" | "manual";
  onModeChange: (mode: "auto" | "manual") => void;
}

export const ModeSwitcher: React.FC<Props> = ({ mode, onModeChange }) => {
  return (
    <div className="mode-switch-container">
      <div className="segmented-control">
        <button
          className={`seg-btn ${mode === "auto" ? "active" : ""}`}
          type="button"
          onClick={() => onModeChange("auto")}
        >
          <IconRadar size={15} stroke={2} />
          Auto Detect
        </button>
        <button
          className={`seg-btn ${mode === "manual" ? "active" : ""}`}
          type="button"
          onClick={() => onModeChange("manual")}
        >
          <IconBolt size={15} stroke={2} />
          Manual Override
        </button>
      </div>
    </div>
  );
};
