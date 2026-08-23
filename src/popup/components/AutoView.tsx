import React from "react";
import {
  IconMicrophone,
  IconMicrophoneOff,
  IconVideo,
  IconVideoOff,
} from "@tabler/icons-react";
import type { AggregatedState, MeetingTab, LedTargetColor } from "../types";

interface Props {
  aggregated?: AggregatedState;
  targetColor: LedTargetColor;
  tabs?: MeetingTab[];
}

export const AutoView: React.FC<Props> = ({
  aggregated = {
    inMeeting: false,
    micOn: false,
    camOn: false,
    totalMeetings: 0,
    platform: "None",
  },
  targetColor,
  tabs = [],
}) => {
  const getPlatformStyles = (platform?: string) => {
    if (!aggregated.inMeeting) {
      return "bg-white/6 text-slate-300 border-white/8";
    }
    const p = (platform || "").toLowerCase();
    if (p.includes("meet") || p.includes("google")) {
      return "bg-amber-500/20 text-amber-300 border-amber-500/45 shadow-[0_0_10px_rgba(245,158,11,0.15)]";
    }
    if (p.includes("team") || p.includes("microsoft")) {
      return "bg-indigo-500/25 text-indigo-200 border-indigo-400/45 shadow-[0_0_10px_rgba(99,102,241,0.15)]";
    }
    return "bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.15)]";
  };

  const getLedStyles = (color: LedTargetColor) => {
    switch (color) {
      case "green":
        return "bg-emerald-500 border-2 border-emerald-200 shadow-[0_0_18px_#10b981,0_0_35px_rgba(16,185,129,0.45)]";
      case "blue":
        return "bg-blue-500 border-2 border-blue-200 shadow-[0_0_18px_#3b82f6,0_0_35px_rgba(59,130,246,0.45)]";
      case "yellow":
        return "bg-amber-500 border-2 border-yellow-200 shadow-[0_0_18px_#f59e0b,0_0_35px_rgba(245,158,11,0.45)]";
      case "red":
        return "bg-red-500 border-2 border-red-200 shadow-[0_0_18px_#ef4444,0_0_35px_rgba(239,68,68,0.45)]";
      case "live":
        return "bg-gradient-to-br from-red-500 to-amber-500 border-2 border-yellow-200 shadow-[0_0_16px_rgba(239,68,68,0.6),0_0_24px_rgba(245,158,11,0.5)]";
      case "off":
      default:
        return "bg-slate-800 border-2 border-slate-700";
    }
  };

  const getLedTitle = (color: LedTargetColor) => {
    switch (color) {
      case "green":
        return "Green (Not in Meeting)";
      case "blue":
        return "Blue (In Meeting)";
      case "yellow":
        return "Yellow (Microphone On)";
      case "red":
        return "Red (Camera On)";
      case "live":
        return "Red + Yellow (Camera + Microphone)";
      case "off":
        return "Off";
      default:
        return color;
    }
  };

  return (
    <section className="flex flex-col gap-3 transition-opacity duration-200">
      <div className="bg-gray-900/75 backdrop-blur-md border border-white/8 hover:border-white/16 rounded-2xl p-3.5 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.4)] transition-colors duration-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold tracking-widest text-gray-500">
            MEETING DETECTION STATUS
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <div
            className={`rounded-xl p-3 h-16 flex items-center gap-2.5 transition-all duration-250 border box-border ${
              aggregated.micOn
                ? "border-amber-500/40 bg-amber-500/8"
                : "border-white/6 bg-slate-900/60"
            }`}
          >
            <div
              className={`w-9.5 h-9.5 rounded-xl flex items-center justify-center shrink-0 transition-all duration-250 ${
                aggregated.micOn
                  ? "bg-amber-500 text-white shadow-[0_0_16px_rgba(245,158,11,0.45)]"
                  : "bg-white/5 text-gray-400"
              }`}
            >
              {aggregated.micOn ? (
                <IconMicrophone size={22} stroke={2} />
              ) : (
                <IconMicrophoneOff size={22} stroke={2} />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-gray-400 font-medium">
                Microphone
              </span>
              <span
                className={`text-xs font-bold tracking-wide ${
                  aggregated.micOn ? "text-amber-400" : "text-slate-500"
                }`}
              >
                {aggregated.micOn ? "ON" : "OFF"}
              </span>
            </div>
          </div>

          <div
            className={`rounded-xl p-3 h-16 flex items-center gap-2.5 transition-all duration-250 border box-border ${
              aggregated.camOn
                ? "border-red-500/40 bg-red-500/8"
                : "border-white/6 bg-slate-900/60"
            }`}
          >
            <div
              className={`w-9.5 h-9.5 rounded-xl flex items-center justify-center shrink-0 transition-all duration-250 ${
                aggregated.camOn
                  ? "bg-red-500 text-white shadow-[0_0_16px_rgba(239,68,68,0.45)]"
                  : "bg-white/5 text-gray-400"
              }`}
            >
              {aggregated.camOn ? (
                <IconVideo size={22} stroke={2} />
              ) : (
                <IconVideoOff size={22} stroke={2} />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-gray-400 font-medium">
                Camera
              </span>
              <span
                className={`text-xs font-bold tracking-wide ${
                  aggregated.camOn ? "text-red-400" : "text-slate-500"
                }`}
              >
                {aggregated.camOn ? "ON" : "OFF"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-slate-900/85 border border-white/8 rounded-xl px-3 h-10 flex items-center justify-center box-border">
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-full text-center transition-all duration-250 border ${getPlatformStyles(
                aggregated.platform
              )}`}
            >
              {aggregated.inMeeting
                ? aggregated.platform || "Meeting Active"
                : "No Active Meeting"}
            </span>
          </div>

          <div
            className="bg-slate-900/85 border border-white/8 rounded-xl px-3 h-10 flex items-center justify-evenly box-border"
            title={getLedTitle(targetColor)}
          >
            <span className="text-xs font-semibold text-gray-400 tracking-wide">
              LED:
            </span>
            {targetColor === "live" ? (
              <div className="flex items-center gap-1.5">
                <div
                  className="w-5.5 h-5.5 rounded-full bg-red-500 border-2 border-red-200 shadow-[0_0_18px_#ef4444,0_0_35px_rgba(239,68,68,0.45)]"
                  title="Red (Camera ON)"
                />
                <div
                  className="w-5.5 h-5.5 rounded-full bg-amber-500 border-2 border-yellow-200 shadow-[0_0_18px_#f59e0b,0_0_35px_rgba(245,158,11,0.45)]"
                  title="Yellow (Microphone ON)"
                />
              </div>
            ) : (
              <div
                className={`w-5.5 h-5.5 rounded-full transition-all duration-300 ${getLedStyles(
                  targetColor
                )}`}
                title={getLedTitle(targetColor)}
              />
            )}
          </div>
        </div>

        {tabs && tabs.length > 0 && (
          <div className="mt-2.5 pt-2.5 border-t border-white/6 flex flex-col gap-1.5">
            {tabs.map((tab) => (
              <div
                className="flex items-center justify-between text-[11px] text-gray-400 bg-white/2 px-2.5 py-1.5 rounded-md"
                key={tab.id}
              >
                <span className="truncate max-w-full" title={tab.title}>
                  {tab.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
