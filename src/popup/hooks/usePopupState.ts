import { useCallback, useEffect, useState } from "react";
import type { PopupState, LedTargetColor } from "../types";

const CACHE_KEY = "meet_tally_popup_state";

function getCachedState(): PopupState | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return null;
}

function setCachedState(state: PopupState | null) {
  try {
    if (state) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(state));
    }
  } catch {}
}

export function usePopupState() {
  const [state, setState] = useState<PopupState | null>(getCachedState);

  const refresh = useCallback(async () => {
    try {
      const response = await chrome.runtime.sendMessage({
        type: "GET_POPUP_STATE",
      });
      if (response && response.config) {
        const popupState = response as PopupState;
        setState(popupState);
        setCachedState(popupState);
      }
    } catch {}
  }, []);

  const setMode = useCallback(
    async (mode: "auto" | "manual") => {
      // Optimistic update
      setState((prev) => {
        const next = prev
          ? {
              ...prev,
              config: { ...prev.config, mode },
            }
          : prev;
        setCachedState(next);
        return next;
      });

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
      setState((prev) => {
        const next = prev
          ? {
              ...prev,
              config: {
                ...prev.config,
                mode: "manual" as const,
                manualColor: color,
              },
              targetColor: color,
            }
          : prev;
        setCachedState(next);
        return next;
      });

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
      setState((prev) => {
        const next = prev
          ? {
              ...prev,
              config: { ...prev.config, enabled },
            }
          : prev;
        setCachedState(next);
        return next;
      });

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
  };
}
