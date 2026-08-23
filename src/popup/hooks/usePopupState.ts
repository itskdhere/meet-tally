import { useCallback, useEffect, useState } from "react";
import type { PopupState, LedTargetColor } from "../types";

export function usePopupState() {
  const [state, setState] = useState<PopupState | null>(null);

  const refresh = useCallback(async () => {
    try {
      const response = await chrome.runtime.sendMessage({
        type: "GET_POPUP_STATE",
      });
      if (response && response.config) {
        setState(response as PopupState);
      }
    } catch {}
  }, []);

  const setMode = useCallback(
    async (mode: "auto" | "manual") => {
      // Optimistic update
      setState((prev) =>
        prev
          ? {
              ...prev,
              config: { ...prev.config, mode },
            }
          : prev
      );

      try {
        await chrome.runtime.sendMessage({ type: "SET_MODE", mode });
        await refresh();
      } catch (err) {
        console.error("Failed to set mode:", err);
      }
    },
    [refresh]
  );

  const setManualColor = useCallback(
    async (color: LedTargetColor) => {
      // Optimistic update
      setState((prev) =>
        prev
          ? {
              ...prev,
              config: { ...prev.config, mode: "manual", manualColor: color },
              targetColor: color,
            }
          : prev
      );

      try {
        await chrome.runtime.sendMessage({
          type: "SET_MANUAL_COLOR",
          color,
        });
        await refresh();
      } catch (err) {
        console.error("Failed to set manual color:", err);
      }
    },
    [refresh]
  );

  const setEnabled = useCallback(
    async (enabled: boolean) => {
      // Optimistic update
      setState((prev) =>
        prev
          ? {
              ...prev,
              config: { ...prev.config, enabled },
            }
          : prev
      );

      try {
        await chrome.runtime.sendMessage({
          type: "SET_ENABLED",
          enabled,
        });
        await refresh();
      } catch (err) {
        console.error("Failed to set enabled state:", err);
      }
    },
    [refresh]
  );

  const saveConfig = useCallback(
    async (espUrl: string) => {
      try {
        const res = await chrome.runtime.sendMessage({
          type: "SAVE_CONFIG",
          espUrl,
        });
        await refresh();
        return res?.success ?? true;
      } catch (err) {
        console.error("Failed to save config:", err);
        return false;
      }
    },
    [refresh]
  );

  const testPing = useCallback(async (url: string) => {
    try {
      const res = await chrome.runtime.sendMessage({
        type: "TEST_PING",
        url,
      });
      return res as { success: boolean; latency?: number; error?: string };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Extension Error",
      };
    }
  }, []);

  const testHardware = useCallback(
    async (color: LedTargetColor) => {
      try {
        await chrome.runtime.sendMessage({ type: "TEST_LED", color });
        await refresh();
      } catch (err) {
        console.error("Test LED error:", err);
      }
    },
    [refresh]
  );

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 1200);
    return () => clearInterval(interval);
  }, [refresh]);

  return {
    state,
    setMode,
    setManualColor,
    setEnabled,
    saveConfig,
    testPing,
    testHardware,
    refresh,
  };
}
