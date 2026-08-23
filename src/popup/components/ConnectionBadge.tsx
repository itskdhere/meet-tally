import React from "react";
import type { ConnectionState } from "../types";

interface Props {
  connectionState?: ConnectionState;
}

export const ConnectionBadge: React.FC<Props> = ({ connectionState }) => {
  let badgeStyles = "bg-slate-500/15 text-slate-400 border-slate-500/30";
  let dotStyles = "bg-slate-400";
  let text = "STANDBY";
  let title = "Device Connection Status";

  if (connectionState) {
    if (connectionState.status === "connected") {
      badgeStyles = "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      dotStyles = "bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse-dot";
      text = connectionState.lastLatency
        ? `ONLINE (${connectionState.lastLatency}ms)`
        : "ONLINE";
    } else if (connectionState.status === "error") {
      badgeStyles = "bg-red-500/15 text-red-400 border-red-500/30";
      dotStyles = "bg-red-500 shadow-[0_0_8px_#ef4444]";
      text = "SYNC ERROR";
      title = connectionState.lastError || "Network Error";
    }
  }

  return (
    <div
      className={`flex w-full items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide transition-all duration-250 border ${badgeStyles}`}
      title={title}
    >
      <span
        className={`w-1.75 h-1.75 rounded-full transition-all duration-250 ${dotStyles}`}
      />
      <span>{text}</span>
    </div>
  );
};
