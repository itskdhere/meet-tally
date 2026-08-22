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
  onSaveUrl: (url: string) => Promise<boolean>;
  onPing: (
    url: string
  ) => Promise<{ success: boolean; latency?: number; error?: string }>;
}

export const DeviceSettings: React.FC<Props> = ({
  espUrl = "http://meet-tally.local",
  connectionState,
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
            <span className="btn-spinner" />
            <span>Saving...</span>
          </>
        );
      case "saved":
        return (
          <>
            <IconCheck size={13} stroke={2.5} />
            <span>Saved!</span>
          </>
        );
      case "error":
        return (
          <>
            <IconX size={13} stroke={2.5} />
            <span>Error</span>
          </>
        );
      default:
        return (
          <>
            <IconDeviceFloppy size={13} stroke={2} />
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
            <span className="btn-spinner" />
            <span>Pinging...</span>
          </>
        );
      case "success":
        return (
          <>
            <IconCheck size={13} stroke={2.5} />
            <span>{pingState.text}</span>
          </>
        );
      case "fail":
        return (
          <>
            <IconCircleX size={13} stroke={2} />
            <span>{pingState.text}</span>
          </>
        );
      default:
        return (
          <>
            <IconActivity size={13} stroke={2} />
            <span>Test Ping</span>
          </>
        );
    }
  };

  return (
    <section className="card config-card">
      <div className="config-header">
        <IconSettings size={15} stroke={2} />
        <span>Device mDNS / IP Address:</span>
      </div>

      <div className="input-group">
        <input
          type="text"
          className="config-input"
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

      <div className="config-btn-row">
        <button
          className={`btn-ping ${
            pingState.status === "success"
              ? "btn-ping-success"
              : pingState.status === "fail"
                ? "btn-ping-fail"
                : pingState.status === "pinging"
                  ? "btn-ping-active"
                  : ""
          }`}
          type="button"
          disabled={pingState.status === "pinging"}
          onClick={handlePing}
        >
          {getPingButtonContent()}
        </button>

        <button
          className={`btn-save ${
            saveStatus === "saved"
              ? "btn-save-success"
              : saveStatus === "error"
                ? "btn-save-error"
                : ""
          }`}
          title="Save Device URL"
          type="button"
          disabled={saveStatus === "saving"}
          onClick={handleSave}
        >
          {getSaveButtonContent()}
        </button>
      </div>

      <div className="config-status-row">
        <ConnectionBadge connectionState={connectionState} />
      </div>
    </section>
  );
};
