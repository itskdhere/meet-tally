(() => {
  interface MeetingState {
    inMeeting: boolean;
    micOn: boolean;
    camOn: boolean;
  }

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

  // Google Meet
  function parseGoogleMeet(): MeetingState | null {
    const candidates = Array.from(
      document.querySelectorAll<HTMLElement>(
        'button, div[role="button"], [data-is-muted], [data-tooltip], [aria-label]'
      )
    );

    let micElement: HTMLElement | null = null;
    let camElement: HTMLElement | null = null;

    for (const el of candidates) {
      const ariaLabel = (el.getAttribute("aria-label") || "").toLowerCase();
      const tooltip = (el.getAttribute("data-tooltip") || "").toLowerCase();
      const title = (el.getAttribute("title") || "").toLowerCase();
      const text = (el.innerText || el.textContent || "").toLowerCase();
      const combined = `${ariaLabel} ${tooltip} ${title} ${text}`;

      if (!micElement) {
        if (
          combined.includes("microphone") ||
          combined.includes("ctrl + d") ||
          combined.includes("⌘ + d") ||
          combined.includes("turn off mic") ||
          combined.includes("turn on mic") ||
          combined.includes("mic_off") ||
          (combined.includes("unmute") && !combined.includes("camera"))
        ) {
          micElement = el;
        }
      }

      if (!camElement) {
        if (
          combined.includes("camera") ||
          combined.includes("ctrl + e") ||
          combined.includes("⌘ + e") ||
          combined.includes("turn off video") ||
          combined.includes("turn on video") ||
          combined.includes("turn off cam") ||
          combined.includes("turn on cam") ||
          combined.includes("videocam") ||
          combined.includes("videocam_off")
        ) {
          camElement = el;
        }
      }

      if (micElement && camElement) break;
    }

    if (!micElement) {
      micElement = document.querySelector<HTMLElement>(
        'button[data-is-muted][aria-label*="mic" i], ' +
          'button[data-is-muted][data-tooltip*="mic" i], ' +
          'button[data-is-muted][aria-label*="microphone" i], ' +
          'div[role="button"][data-is-muted][aria-label*="mic" i], ' +
          'button[aria-label*="microphone" i], ' +
          'button[aria-label*="mic" i], ' +
          'button[data-tooltip*="microphone" i], ' +
          'button[data-tooltip*="mic" i], ' +
          'button[data-tooltip*="ctrl + d" i], ' +
          'button[data-tooltip*="⌘ + d" i]'
      );
    }

    if (!camElement) {
      camElement = document.querySelector<HTMLElement>(
        'button[data-is-muted][aria-label*="camera" i], ' +
          'button[data-is-muted][data-tooltip*="camera" i], ' +
          'button[data-is-muted][aria-label*="video" i], ' +
          'div[role="button"][data-is-muted][aria-label*="camera" i], ' +
          'button[aria-label*="camera" i], ' +
          'button[aria-label*="video" i], ' +
          'button[data-tooltip*="camera" i], ' +
          'button[data-tooltip*="video" i], ' +
          'button[data-tooltip*="ctrl + e" i], ' +
          'button[data-tooltip*="⌘ + e" i]'
      );
    }

    if (!micElement && !camElement) return null;

    let micOn = false;
    let camOn = false;

    if (micElement) {
      const isMutedAttr =
        micElement.getAttribute("data-is-muted") ||
        micElement.closest("[data-is-muted]")?.getAttribute("data-is-muted");
      const ariaLabel = (
        micElement.getAttribute("aria-label") || ""
      ).toLowerCase();
      const tooltip = (
        micElement.getAttribute("data-tooltip") || ""
      ).toLowerCase();
      const text = (
        micElement.innerText ||
        micElement.textContent ||
        ""
      ).toLowerCase();
      const combined = `${ariaLabel} ${tooltip} ${text}`;

      if (isMutedAttr === "false") {
        micOn = true;
      } else if (isMutedAttr === "true") {
        micOn = false;
      } else if (
        combined.includes("turn off microphone") ||
        combined.includes("turn off mic") ||
        combined.includes("mute (ctrl + d)") ||
        combined.includes("mute (⌘ + d)")
      ) {
        micOn = true;
      } else if (
        combined.includes("turn on microphone") ||
        combined.includes("turn on mic") ||
        combined.includes("unmute (ctrl + d)") ||
        combined.includes("unmute (⌘ + d)")
      ) {
        micOn = false;
      } else if (text.includes("mic_off")) {
        micOn = false;
      } else if (text.includes("mic")) {
        micOn = true;
      }
    }

    if (camElement) {
      const isMutedAttr =
        camElement.getAttribute("data-is-muted") ||
        camElement.closest("[data-is-muted]")?.getAttribute("data-is-muted");
      const ariaLabel = (
        camElement.getAttribute("aria-label") || ""
      ).toLowerCase();
      const tooltip = (
        camElement.getAttribute("data-tooltip") || ""
      ).toLowerCase();
      const text = (
        camElement.innerText ||
        camElement.textContent ||
        ""
      ).toLowerCase();
      const combined = `${ariaLabel} ${tooltip} ${text}`;

      if (isMutedAttr === "false") {
        camOn = true;
      } else if (isMutedAttr === "true") {
        camOn = false;
      } else if (
        combined.includes("turn off camera") ||
        combined.includes("turn off video") ||
        combined.includes("turn off cam")
      ) {
        camOn = true;
      } else if (
        combined.includes("turn on camera") ||
        combined.includes("turn on video") ||
        combined.includes("turn on cam")
      ) {
        camOn = false;
      } else if (text.includes("videocam_off")) {
        camOn = false;
      } else if (text.includes("videocam")) {
        camOn = true;
      }
    }

    return { inMeeting: true, micOn, camOn };
  }

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
