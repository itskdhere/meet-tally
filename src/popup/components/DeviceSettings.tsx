import React, { useEffect, useState } from "react";
import {
  IconSettings,
  IconDeviceFloppy,
  IconCheck,
  IconX,
  IconActivity,
  IconCircleX,
} from "@tabler/icons-react";
import { ConnectionBadge } from "./ConnectionBadge";
import type { ConnectionState } from "../types";

interface Props {
  espUrl?: string;
  connectionState?: ConnectionState;
  enabled?: boolean;
  onSaveUrl: (url: string) => Promise<boolean>;
  onPing: (
    url: string
  ) => Promise<{ success: boolean; latency?: number; error?: string }>;
}

export const DeviceSettings: React.FC<Props> = ({
  espUrl = "http://meet-tally.local",
  connectionState,
  enabled = true,
  onSaveUrl,
  onPing,
}) => {
  const [urlInput, setUrlInput] = useState(espUrl);
  const [isFocused, setIsFocused] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [pingState, setPingState] = useState<{
    status: "idle" | "pinging" | "success" | "fail";
    text: string;
  }>({ status: "idle", text: "" });

  // Update input only if user isn't currently typing in it
  useEffect(() => {
    if (!isFocused && espUrl && espUrl !== urlInput && saveStatus === "idle") {
      setUrlInput(espUrl);
    }
  }, [espUrl, isFocused, saveStatus, urlInput]);

  const handleSave = async () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    setSaveStatus("saving");
    const success = await onSaveUrl(trimmed);
    if (success) {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 1200);
    } else {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 1500);
    }
  };

  const handlePing = async () => {
    const targetUrl = urlInput.trim() || espUrl || "http://meet-tally.local";
    setPingState({ status: "pinging", text: "Pinging..." });

    const result = await onPing(targetUrl);
    if (result.success) {
      setPingState({
        status: "success",
        text: `Online (${result.latency ?? 0}ms)`,
      });
      setTimeout(() => setPingState({ status: "idle", text: "" }), 3000);
    } else {
      setPingState({
        status: "fail",
        text: result.error
          ? result.error.length > 18
            ? "Offline"
            : result.error
          : "Offline",
      });
      setTimeout(() => setPingState({ status: "idle", text: "" }), 3000);
    }
  };

  const getSaveButtonContent = () => {
    switch (saveStatus) {
      case "saving":
        return (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white/25 border-t-white rounded-full animate-spin shrink-0" />
            <span>Saving...</span>
          </>
        );
      case "saved":
        return (
          <>
            <IconCheck size={14} stroke={2.5} className="shrink-0" />
            <span>Saved!</span>
          </>
        );
      case "error":
        return (
          <>
            <IconX size={14} stroke={2.5} className="shrink-0" />
            <span>Error</span>
          </>
        );
      default:
        return (
          <>
            <IconDeviceFloppy size={14} stroke={2} className="shrink-0" />
            <span>Save</span>
          </>
        );
    }
  };

  const getPingButtonContent = () => {
    switch (pingState.status) {
      case "pinging":
        return (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white/25 border-t-white rounded-full animate-spin shrink-0" />
            <span>Pinging...</span>
          </>
        );
      case "success":
        return (
          <>
            <IconCheck size={14} stroke={2.5} className="shrink-0" />
            <span>{pingState.text}</span>
          </>
        );
      case "fail":
        return (
          <>
            <IconCircleX size={14} stroke={2} className="shrink-0" />
            <span>{pingState.text}</span>
          </>
        );
      default:
        return (
          <>
            <IconActivity size={14} stroke={2} className="shrink-0" />
            <span>Test Ping</span>
          </>
        );
    }
  };

  const getPingStyles = () => {
    if (pingState.status === "success") {
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/35";
    }
    if (pingState.status === "fail") {
      return "bg-red-500/15 text-red-400 border-red-500/35";
    }
    return "bg-white/4 text-slate-300 border-white/8 hover:enabled:bg-white/8 hover:enabled:text-white hover:enabled:border-white/16";
  };

  const getSaveStyles = () => {
    if (saveStatus === "saved") {
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/35";
    }
    if (saveStatus === "error") {
      return "bg-red-500/15 text-red-400 border-red-500/35";
    }
    return "bg-white/4 text-slate-300 border-white/8 hover:enabled:bg-white/8 hover:enabled:text-white hover:enabled:border-white/16";
  };

  return (
    <section className="bg-gray-900/75 backdrop-blur-md border border-white/8 hover:border-white/16 rounded-2xl p-3.5 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.4)] transition-colors duration-200 flex flex-col gap-2.5">
      <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-slate-300">
        <IconSettings size={15} stroke={2} />
        <span>Device mDNS / IP Address:</span>
      </div>

      <div className="w-full">
        <input
          type="text"
          className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-3 py-2 text-slate-50 text-xs outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          value={urlInput}
          placeholder="http://meet-tally.local"
          spellCheck={false}
          autoComplete="off"
          onChange={(e) => setUrlInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2.5 w-full">
        <button
          className={`inline-flex items-center justify-center w-full gap-1.5 py-2 px-2.5 border rounded-lg text-[11.5px] font-semibold whitespace-nowrap cursor-pointer transition-all duration-200 active:enabled:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden text-ellipsis ${getPingStyles()}`}
          type="button"
          disabled={pingState.status === "pinging"}
          onClick={handlePing}
        >
          {getPingButtonContent()}
        </button>

        <button
          className={`inline-flex items-center justify-center w-full gap-1.5 py-2 px-2.5 border rounded-lg text-[11.5px] font-semibold whitespace-nowrap cursor-pointer transition-all duration-200 active:enabled:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed ${getSaveStyles()}`}
          title="Save Device URL"
          type="button"
          disabled={saveStatus === "saving"}
          onClick={handleSave}
        >
          {getSaveButtonContent()}
        </button>
      </div>

      <div className="w-full flex pt-0.5">
        <ConnectionBadge connectionState={connectionState} enabled={enabled} />
      </div>
    </section>
  );
};
