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
    <section className="flex flex-col gap-3 transition-opacity duration-200">
      <div className="bg-gray-900/75 backdrop-blur-md border border-white/8 hover:border-white/16 rounded-2xl p-3.5 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.4)] transition-colors duration-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold tracking-widest text-gray-500">
            MANUAL LED CONTROL
          </span>
          <span className="text-[11px] text-gray-500">
            Select color to light up
          </span>
        </div>

        <div className="bg-slate-900/60 border border-white/8 rounded-xl p-2 h-16 flex items-center justify-around mb-3 shadow-[inset_0_2px_6px_rgba(0,0,0,0.3)] gap-2 box-border">
          <button
            className={`w-11.5 h-11.5 rounded-full relative cursor-pointer flex items-center justify-center transition-all duration-250 p-0 shrink-0 hover:scale-108 active:scale-95 border-2 ${
              manualColor === "red" || isLive
                ? "bg-red-500 border-red-300 shadow-[0_0_24px_#ef4444,0_0_45px_rgba(239,68,68,0.45)] text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]"
                : "border-red-500/40 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.12)_0%,#1e293b_85%)] hover:border-red-500/75 hover:shadow-[0_0_12px_rgba(239,68,68,0.25)] text-red-400"
            }`}
            title="Set LED Red (Camera On)"
            type="button"
            onClick={() => onSelectColor("red")}
          >
            <span className="absolute top-[12%] left-[20%] w-[22%] h-[22%] bg-white/35 rounded-full pointer-events-none" />
            <span className="text-[8px] font-extrabold tracking-wider pointer-events-none mt-2.5">
              RED
            </span>
          </button>

          <button
            className={`w-11.5 h-11.5 rounded-full relative cursor-pointer flex items-center justify-center transition-all duration-250 p-0 shrink-0 hover:scale-108 active:scale-95 border-2 ${
              manualColor === "yellow" || isLive
                ? "bg-amber-500 border-yellow-300 shadow-[0_0_24px_#f59e0b,0_0_45px_rgba(245,158,11,0.45)] text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]"
                : "border-amber-500/40 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.12)_0%,#1e293b_85%)] hover:border-amber-500/75 hover:shadow-[0_0_12px_rgba(245,158,11,0.25)] text-amber-300"
            }`}
            title="Set LED Yellow (Microphone On)"
            type="button"
            onClick={() => onSelectColor("yellow")}
          >
            <span className="absolute top-[12%] left-[20%] w-[22%] h-[22%] bg-white/35 rounded-full pointer-events-none" />
            <span className="text-[8px] font-extrabold tracking-wider pointer-events-none mt-2.5">
              YELLOW
            </span>
          </button>

          <button
            className={`w-11.5 h-11.5 rounded-full relative cursor-pointer flex items-center justify-center transition-all duration-250 p-0 shrink-0 hover:scale-108 active:scale-95 border-2 ${
              manualColor === "blue"
                ? "bg-blue-500 border-blue-300 shadow-[0_0_24px_#3b82f6,0_0_45px_rgba(59,130,246,0.45)] text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]"
                : "border-blue-500/40 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.12)_0%,#1e293b_85%)] hover:border-blue-500/75 hover:shadow-[0_0_12px_rgba(59,130,246,0.25)] text-blue-400"
            }`}
            title="Set LED Blue (In Meeting)"
            type="button"
            onClick={() => onSelectColor("blue")}
          >
            <span className="absolute top-[12%] left-[20%] w-[22%] h-[22%] bg-white/35 rounded-full pointer-events-none" />
            <span className="text-[8px] font-extrabold tracking-wider pointer-events-none mt-2.5">
              BLUE
            </span>
          </button>

          <button
            className={`w-11.5 h-11.5 rounded-full relative cursor-pointer flex items-center justify-center transition-all duration-250 p-0 shrink-0 hover:scale-108 active:scale-95 border-2 ${
              manualColor === "green"
                ? "bg-emerald-500 border-emerald-300 shadow-[0_0_24px_#10b981,0_0_45px_rgba(16,185,129,0.45)] text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]"
                : "border-emerald-500/40 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.12)_0%,#1e293b_85%)] hover:border-emerald-500/75 hover:shadow-[0_0_12px_rgba(16,185,129,0.25)] text-emerald-400"
            }`}
            title="Set LED Green (Not in Meeting)"
            type="button"
            onClick={() => onSelectColor("green")}
          >
            <span className="absolute top-[12%] left-[20%] w-[22%] h-[22%] bg-white/35 rounded-full pointer-events-none" />
            <span className="text-[8px] font-extrabold tracking-wider pointer-events-none mt-2.5">
              GREEN
            </span>
          </button>
        </div>

        <div className="grid grid-cols-[1.4fr_1fr] gap-2.5 w-full">
          <button
            className={`inline-flex items-center justify-center w-full h-10 gap-1.5 px-2.5 rounded-lg text-[11.5px] font-semibold whitespace-nowrap cursor-pointer transition-all duration-250 border box-border ${
              isLive
                ? "bg-linear-to-r from-red-500 to-amber-500 border-white/20 text-white shadow-[0_0_16px_rgba(239,68,68,0.5)]"
                : "[background:linear-gradient(rgba(15,23,42,0.92),rgba(15,23,42,0.92))_padding-box,linear-gradient(135deg,#ef4444_0%,#f59e0b_100%)_border-box] border-transparent hover:[background:linear-gradient(rgba(30,41,59,0.9),rgba(30,41,59,0.9))_padding-box,linear-gradient(135deg,#f87171_0%,#fcd34d_100%)_border-box]"
            }`}
            type="button"
            onClick={() => onSelectColor("live")}
            title="Set Red + Yellow LED (Camera + Microphone)"
          >
            <IconBroadcast
              size={15}
              stroke={2}
              className={
                isLive ? "text-white shrink-0" : "text-red-400 shrink-0"
              }
            />
            <span
              className={
                isLive
                  ? "text-white"
                  : "bg-linear-to-r from-red-400 to-amber-400 bg-clip-text text-transparent"
              }
            >
              LIVE (Red + Yellow)
            </span>
          </button>

          <button
            className="inline-flex items-center justify-center w-full h-10 gap-1.5 px-2.5 rounded-lg border border-white/8 bg-white/4 text-slate-300 text-[11.5px] font-semibold whitespace-nowrap cursor-pointer transition-all duration-200 hover:bg-white/8 hover:text-white hover:border-white/16 box-border"
            type="button"
            onClick={() => onSelectColor("off")}
          >
            <IconPower size={14} stroke={2} className="shrink-0" />
            <span>Turn Off</span>
          </button>
        </div>
      </div>
    </section>
  );
};
