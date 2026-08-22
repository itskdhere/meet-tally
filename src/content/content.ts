import { MeetingState } from "./types";
import { parseGoogleMeet } from "./googleMeet";

(() => {
  let lastEvaluatedState: MeetingState = {
    inMeeting: false,
    micOn: false,
    camOn: false,
  };
  let heartbeatTimer: any = null;
  let detectedPlatform = "Generic Meeting";

  function getPlatform(): string {
    const host = window.location.hostname.toLowerCase();
    if (host.includes("meet.google.com")) return "Google Meet";
    if (host.includes("teams.microsoft.com") || host.includes("teams.live.com"))
      return "Microsoft Teams";
    if (host.includes("zoom.us")) return "Zoom Web";
    return "Web Meeting";
  }

  detectedPlatform = getPlatform();

  // Microsoft Teams
  function parseMicrosoftTeams(): MeetingState | null {
    const micBtn = document.querySelector(
      "#microphone-button, " +
        'button[aria-label*="mic" i], ' +
        'button[aria-label*="mute" i], ' +
        'button[id*="mic-button" i], ' +
        'button[data-tid*="toggle-mute" i]'
    );

    const camBtn = document.querySelector(
      "#video-button, " +
        'button[aria-label*="camera" i], ' +
        'button[aria-label*="video" i], ' +
        'button[id*="video-button" i], ' +
        'button[data-tid*="toggle-video" i]'
    );

    if (!micBtn && !camBtn) return null;

    let micOn = false;
    let camOn = false;

    if (micBtn) {
      const label = (micBtn.getAttribute("aria-label") || "").toLowerCase();
      micOn = !label.includes("unmute") && !label.includes("muted");
    }

    if (camBtn) {
      const label = (camBtn.getAttribute("aria-label") || "").toLowerCase();
      camOn =
        !label.includes("turn camera on") &&
        !label.includes("camera is off") &&
        !label.includes("turn on camera");
    }

    return { inMeeting: true, micOn, camOn };
  }

  // Zoom Web
  function parseZoomWeb(): MeetingState | null {
    const micBtn = document.querySelector(
      'button[aria-label*="audio" i], ' +
        'button[aria-label*="mute" i], ' +
        ".join-dialog"
    );

    const camBtn = document.querySelector(
      'button[aria-label*="video" i], ' +
        'button[aria-label*="start video" i], ' +
        'button[aria-label*="stop video" i]'
    );

    if (!micBtn && !camBtn) return null;

    let micOn = false;
    let camOn = false;

    if (micBtn) {
      const label = (micBtn.getAttribute("aria-label") || "").toLowerCase();
      micOn =
        (label.includes("mute my audio") || label.includes("mute")) &&
        !label.includes("unmute");
    }

    if (camBtn) {
      const label = (camBtn.getAttribute("aria-label") || "").toLowerCase();
      camOn = label.includes("stop video") || label.includes("turn off camera");
    }

    return { inMeeting: true, micOn, camOn };
  }

  function evaluateMeetingState() {
    let state: MeetingState | null = null;

    if (detectedPlatform === "Google Meet") {
      state = parseGoogleMeet();
    } else if (detectedPlatform === "Microsoft Teams") {
      state = parseMicrosoftTeams();
    } else if (detectedPlatform === "Zoom Web") {
      state = parseZoomWeb();
    }

    if (!state) {
      return;
    }

    if (
      state.inMeeting !== lastEvaluatedState.inMeeting ||
      state.micOn !== lastEvaluatedState.micOn ||
      state.camOn !== lastEvaluatedState.camOn
    ) {
      lastEvaluatedState = state;

      console.log(
        `[MeetTally] ${detectedPlatform} status -> MIC=${state.micOn ? "ON" : "OFF"}, CAM=${state.camOn ? "ON" : "OFF"}`
      );

      try {
        chrome.runtime.sendMessage({
          type: "UPDATE_MEETING_STATUS",
          platform: detectedPlatform,
          inMeeting: state.inMeeting,
          micOn: state.micOn,
          camOn: state.camOn,
        });
      } catch (err) {}
    }
  }

  const observer = new MutationObserver(() => {
    evaluateMeetingState();
  });

  observer.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: [
      "data-is-muted",
      "aria-label",
      "aria-pressed",
      "class",
      "data-tooltip",
      "data-tid",
      "title",
    ],
  });

  evaluateMeetingState();

  heartbeatTimer = setInterval(evaluateMeetingState, 1000);

  window.addEventListener("beforeunload", () => {
    if (heartbeatTimer) clearInterval(heartbeatTimer);
    try {
      chrome.runtime.sendMessage({
        type: "MEETING_PAGE_UNLOADED",
      });
    } catch (e) {}
  });

  console.log(`[MeetTally] Content script active for ${detectedPlatform}`);
})();
