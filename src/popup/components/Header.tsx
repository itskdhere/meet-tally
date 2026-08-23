import React from "react";
import { IconPower } from "@tabler/icons-react";

interface Props {
  enabled?: boolean;
  onToggleEnabled?: (enabled: boolean) => void;
}

export const Header: React.FC<Props> = ({
  enabled = true,
  onToggleEnabled,
}) => {
  return (
    <header className="flex items-center justify-between pb-0.5">
      <div className="flex items-center gap-2.5">
        <div className="w-7.5 h-7.5 flex items-center justify-center shrink-0">
          <img
            src="/logo.png"
            alt="Meet Tally"
            className="w-full h-full object-contain block"
          />
        </div>
        <div>
          <h1 className="text-[15px] font-bold tracking-tight text-gray-50 leading-tight">
            Meet Tally
          </h1>
          <span className="text-[11px] text-gray-400 block font-normal">
            Controller & Status Indicator
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex flex-col items-end mr-0.5">
          <span
            className={`text-[10px] font-bold tracking-wider uppercase transition-colors duration-200 ${
              enabled ? "text-emerald-400" : "text-slate-500"
            }`}
          >
            {enabled ? "ON" : "OFF"}
          </span>
          <span className="text-[9px] text-slate-400 leading-none">
            {enabled ? "Active" : "Disabled"}
          </span>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => onToggleEnabled?.(!enabled)}
          title={
            enabled
              ? "Click to disable extension sync in this Chrome profile"
              : "Click to enable extension sync in this Chrome profile"
          }
          className={`group relative inline-flex items-center h-6.5 w-12 shrink-0 cursor-pointer rounded-full border p-0.5 transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
            enabled
              ? "bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
              : "bg-slate-800/90 border-slate-700 hover:border-slate-600"
          }`}
        >
          <span className="sr-only">Toggle extension status</span>
          <span
            className={`pointer-events-none flex items-center justify-center h-5 w-5 transform rounded-full transition-all duration-300 ease-in-out ${
              enabled
                ? "translate-x-5.5 bg-emerald-400 text-slate-950 shadow-[0_0_8px_#10b981]"
                : "translate-x-0 bg-slate-500 text-slate-900"
            }`}
          >
            <IconPower
              size={12}
              stroke={3}
              className={enabled ? "text-slate-950" : "text-slate-800"}
            />
          </span>
        </button>
      </div>
    </header>
  );
};
