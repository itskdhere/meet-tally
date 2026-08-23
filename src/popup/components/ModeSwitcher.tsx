import React from "react";
import { IconRadar, IconBolt } from "@tabler/icons-react";

interface Props {
  mode: "auto" | "manual";
  onModeChange: (mode: "auto" | "manual") => void;
}

export const ModeSwitcher: React.FC<Props> = ({ mode, onModeChange }) => {
  return (
    <div className="w-full">
      <div className="bg-slate-900/70 border border-white/10 rounded-xl p-0.75 grid grid-cols-2 gap-1">
        <button
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-[9px] text-xs font-semibold cursor-pointer transition-all duration-200 ${
            mode === "auto"
              ? "bg-slate-800 text-sky-400 shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]"
              : "text-gray-400 hover:text-gray-100 bg-transparent"
          }`}
          type="button"
          onClick={() => onModeChange("auto")}
        >
          <IconRadar size={15} stroke={2} />
          <span>Auto Detect</span>
        </button>
        <button
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-[9px] text-xs font-semibold cursor-pointer transition-all duration-200 ${
            mode === "manual"
              ? "bg-slate-800 text-sky-400 shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]"
              : "text-gray-400 hover:text-gray-100 bg-transparent"
          }`}
          type="button"
          onClick={() => onModeChange("manual")}
        >
          <IconBolt size={15} stroke={2} />
          <span>Manual Override</span>
        </button>
      </div>
    </div>
  );
};
