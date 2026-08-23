export type LedTargetColor =
  | "red"
  | "yellow"
  | "blue"
  | "green"
  | "live"
  | "off";

export interface MeetTallyConfig {
  espUrl: string;
  mode: "auto" | "manual";
  manualColor: LedTargetColor;
  debugLog: boolean;
}

export interface MeetingTab {
  id: number;
  platform: string;
  micOn: boolean;
  camOn: boolean;
  title: string;
  lastUpdate: number;
}

export interface ConnectionState {
  status: "idle" | "connected" | "error" | "connecting";
  lastSyncTime: number | null;
  lastLatency: number | null;
  lastError: string | null;
  lastSentColor: string | null;
}

const DEFAULT_CONFIG: MeetTallyConfig = {
  espUrl: "http://meet-tally.local",
  mode: "auto",
  manualColor: "green",
  debugLog: true,
};

const activeMeetingTabs = new Map<number, MeetingTab>();

const connectionState: ConnectionState = {
  status: "idle",
  lastSyncTime: null,
  lastLatency: null,
  lastError: null,
  lastSentColor: null,
};

export async function getConfig(): Promise<MeetTallyConfig> {
  try {
    const data = (await chrome.storage.sync.get([
      "espUrl",
      "mode",
      "manualColor",
      "debugLog",
    ])) as Partial<MeetTallyConfig>;
    let url = (data.espUrl || DEFAULT_CONFIG.espUrl).trim();
    if (!/^https?:\/\//i.test(url)) {
      url = `http://${url}`;
    }
    url = url.replace(/\/+$/, "");
    return {
      espUrl: url,
      mode: data.mode === "manual" ? "manual" : "auto",
      manualColor:
        data.manualColor === "red" ||
        data.manualColor === "yellow" ||
        data.manualColor === "blue" ||
        data.manualColor === "green" ||
        data.manualColor === "live" ||
        data.manualColor === "off"
          ? data.manualColor
          : "green",
      debugLog: data.debugLog ?? true,
    };
  } catch (err) {
    console.warn("[MeetTally] Failed to read storage:", err);
    return DEFAULT_CONFIG;
  }
}

export async function saveConfig(
  partial: Partial<MeetTallyConfig>
): Promise<MeetTallyConfig> {
  const current = await getConfig();
  const updated: MeetTallyConfig = { ...current, ...partial };
  if (partial.espUrl) {
    let url = partial.espUrl.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = `http://${url}`;
    }
    updated.espUrl = url.replace(/\/+$/, "");
  }
  await chrome.storage.sync.set(updated);
  await syncStatusToESP();
  return updated;
}

export function getAggregatedState() {
  let mic = false;
  let cam = false;
  let platform = "No Active Meeting";

  for (const tab of activeMeetingTabs.values()) {
    if (tab.micOn) mic = true;
    if (tab.camOn) cam = true;
    if (tab.platform) platform = tab.platform;
  }

  const meetingCount = activeMeetingTabs.size;
  return {
    inMeeting: meetingCount > 0,
    micOn: mic,
    camOn: cam,
    totalMeetings: meetingCount,
    platform: meetingCount > 0 ? platform : "None",
  };
}

export function resolveTargetColor(
  config: MeetTallyConfig,
  aggregated: ReturnType<typeof getAggregatedState>
): LedTargetColor {
  if (config.mode === "manual") {
    return config.manualColor;
  }

  if (!aggregated.inMeeting) {
    return "green";
  }

  if (aggregated.camOn && aggregated.micOn) {
    return "live";
  } else if (aggregated.camOn) {
    return "red";
  } else if (aggregated.micOn) {
    return "yellow";
  } else {
    return "blue";
  }
}

export function updateExtensionBadge(
  targetColor: string,
  mode: "auto" | "manual",
  aggregated: ReturnType<typeof getAggregatedState>
) {
  if (mode === "manual") {
    chrome.action.setBadgeText({ text: "MAN" });
    if (targetColor === "red") {
      chrome.action.setBadgeBackgroundColor({ color: "#ef4444" });
    } else if (targetColor === "yellow") {
      chrome.action.setBadgeBackgroundColor({ color: "#f59e0b" });
    } else if (targetColor === "blue") {
      chrome.action.setBadgeBackgroundColor({ color: "#3b82f6" });
    } else if (targetColor === "green") {
      chrome.action.setBadgeBackgroundColor({ color: "#10b981" });
    } else if (targetColor === "live") {
      chrome.action.setBadgeBackgroundColor({ color: "#ef4444" });
    } else {
      chrome.action.setBadgeBackgroundColor({ color: "#64748b" });
    }
    return;
  }

  // Auto Mode
  if (!aggregated.inMeeting) {
    chrome.action.setBadgeText({ text: "IDLE" });
    chrome.action.setBadgeBackgroundColor({ color: "#10b981" });
    return;
  }

  if (aggregated.camOn && aggregated.micOn) {
    chrome.action.setBadgeText({ text: "LIVE" });
    chrome.action.setBadgeBackgroundColor({ color: "#ef4444" });
  } else if (aggregated.camOn) {
    chrome.action.setBadgeText({ text: "CAM" });
    chrome.action.setBadgeBackgroundColor({ color: "#ef4444" });
  } else if (aggregated.micOn) {
    chrome.action.setBadgeText({ text: "MIC" });
    chrome.action.setBadgeBackgroundColor({ color: "#f59e0b" });
  } else {
    chrome.action.setBadgeText({ text: "MEET" });
    chrome.action.setBadgeBackgroundColor({ color: "#3b82f6" });
  }
}

export async function syncStatusToESP(
  overrideColor: LedTargetColor | null = null
): Promise<boolean> {
  const config = await getConfig();
  const aggregated = getAggregatedState();
  const targetColor = overrideColor || resolveTargetColor(config, aggregated);

  updateExtensionBadge(targetColor, config.mode, aggregated);

  const endpoint = `${config.espUrl}/set?led=${targetColor}`;
  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const latency = Date.now() - startTime;

    if (res.ok) {
      connectionState.status = "connected";
      connectionState.lastSyncTime = Date.now();
      connectionState.lastLatency = latency;
      connectionState.lastError = null;
      connectionState.lastSentColor = targetColor;
      if (config.debugLog) {
        console.log(
          `[MeetTally] Synced LED=${targetColor} (mode=${config.mode}) -> ESP OK (${latency}ms)`
        );
      }
      return true;
    } else {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err: any) {
    clearTimeout(timeoutId);
    connectionState.status = "error";
    connectionState.lastError =
      err.name === "AbortError"
        ? "Connection timed out (2.5s)"
        : err.message || "Network error";
    if (config.debugLog) {
      console.warn(
        `[MeetTally] Failed sync to ${endpoint}:`,
        connectionState.lastError
      );
    }
    return false;
  }
}

export async function sendHeartbeat() {
  const config = await getConfig();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${config.espUrl}/heartbeat`, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      connectionState.status = "connected";
      connectionState.lastSyncTime = Date.now();
    }
  } catch (e) {}
}

chrome.alarms.create("meet_tally_alarm", { periodInMinutes: 0.05 }); // ~3s
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "meet_tally_alarm") {
    syncStatusToESP();
  }
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  if (activeMeetingTabs.has(tabId)) {
    activeMeetingTabs.delete(tabId);
    console.log(
      `[MeetTally] Tab ${tabId} closed. Remaining tabs: ${activeMeetingTabs.size}`
    );
    await syncStatusToESP();
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.url && activeMeetingTabs.has(tabId)) {
    const isMeetingUrl =
      /meet\.google\.com|teams\.microsoft\.com|teams\.live\.com|teams\.cloud\.microsoft/i.test(
        changeInfo.url
      );
    if (!isMeetingUrl) {
      activeMeetingTabs.delete(tabId);
      await syncStatusToESP();
    }
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    switch (message.type) {
      case "UPDATE_MEETING_STATUS": {
        const tabId = sender.tab ? sender.tab.id : null;
        if (tabId !== null && tabId !== undefined) {
          if (message.inMeeting === false) {
            activeMeetingTabs.delete(tabId);
          } else {
            activeMeetingTabs.set(tabId, {
              id: tabId,
              micOn: !!message.micOn,
              camOn: !!message.camOn,
              platform: message.platform || "Meeting",
              title:
                sender.tab && sender.tab.title
                  ? sender.tab.title
                  : `${message.platform || "Meeting"} Tab`,
              lastUpdate: Date.now(),
            });
          }
        }
        await syncStatusToESP();
        sendResponse({ success: true, aggregated: getAggregatedState() });
        break;
      }

      case "MEETING_PAGE_UNLOADED": {
        const tabId = sender.tab ? sender.tab.id : null;
        if (
          tabId !== null &&
          tabId !== undefined &&
          activeMeetingTabs.has(tabId)
        ) {
          activeMeetingTabs.delete(tabId);
        }
        await syncStatusToESP();
        sendResponse({ success: true });
        break;
      }

      case "GET_POPUP_STATE": {
        const config = await getConfig();
        const aggregated = getAggregatedState();
        const targetColor = resolveTargetColor(config, aggregated);
        sendResponse({
          config,
          connectionState,
          aggregated,
          targetColor,
          tabs: Array.from(activeMeetingTabs.values()),
        });
        break;
      }

      case "SET_MODE": {
        const mode = message.mode === "manual" ? "manual" : "auto";
        const updated = await saveConfig({ mode });
        sendResponse({ success: true, config: updated });
        break;
      }

      case "SET_MANUAL_COLOR": {
        const color = message.color;
        const updated = await saveConfig({
          mode: "manual",
          manualColor: color,
        });
        sendResponse({ success: true, config: updated });
        break;
      }

      case "SAVE_CONFIG": {
        const updated = await saveConfig({ espUrl: message.espUrl });
        sendResponse({ success: true, config: updated });
        break;
      }

      case "TEST_PING": {
        let url = (message.url || "").trim();
        if (!/^https?:\/\//i.test(url)) {
          url = `http://${url}`;
        }
        url = url.replace(/\/+$/, "");

        const startTime = Date.now();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        try {
          const res = await fetch(`${url}/api/state`, {
            signal: controller.signal,
            cache: "no-store",
          });
          clearTimeout(timeoutId);
          const latency = Date.now() - startTime;
          if (res.ok) {
            const data = await res.json().catch(() => ({}));
            sendResponse({ success: true, latency, data });
          } else {
            throw new Error(`HTTP ${res.status}`);
          }
        } catch (err: any) {
          clearTimeout(timeoutId);
          sendResponse({
            success: false,
            error:
              err.name === "AbortError"
                ? "Timeout (3s)"
                : err.message || "Connection failed",
          });
        }
        break;
      }

      case "TEST_LED": {
        const color = message.color;
        const success = await syncStatusToESP(color);
        sendResponse({ success, color });
        break;
      }

      default:
        sendResponse({ error: "Unknown message type" });
    }
  })();
  return true;
});

getConfig().then((config) => {
  console.log(
    "[MeetTally] Background Service Worker ready. Target:",
    config.espUrl
  );
  syncStatusToESP();
});
