import { MeetingState } from "./types";
import { parseGoogleMeet } from "./googleMeet";
import { parseMicrosoftTeams } from "./microsoftTeams";
import { parseZoomWeb } from "./zoomWeb";

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
    if (
      host.includes("teams.microsoft.com") ||
      host.includes("teams.live.com") ||
      host.includes("teams.cloud.microsoft") ||
      host.includes("teams.")
    )
      return "Microsoft Teams";
    if (host.includes("zoom.us")) return "Zoom Web";
    return "Web Meeting";
  }

  detectedPlatform = getPlatform();

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
      if (lastEvaluatedState.inMeeting) {
        lastEvaluatedState = {
          inMeeting: false,
          micOn: false,
          camOn: false,
        };
        try {
          chrome.runtime.sendMessage({
            type: "UPDATE_MEETING_STATUS",
            platform: detectedPlatform,
            inMeeting: false,
            micOn: false,
            camOn: false,
          });
        } catch (err) {}
      }
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
      "aria-checked",
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
