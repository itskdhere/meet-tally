import { MeetingState } from "./types";

export function isGoogleMeetParticipantElement(el: HTMLElement): boolean {
  if (
    el.closest(
      '[data-participant-id], [data-requested-participant-id], [data-tile-id], [data-allocation-index], [data-self-name], [role="listitem"]'
    )
  ) {
    return true;
  }

  const ariaLabel = (el.getAttribute("aria-label") || "").toLowerCase();
  const tooltip = (el.getAttribute("data-tooltip") || "").toLowerCase();

  if (
    ariaLabel.includes("'s microphone") ||
    ariaLabel.includes("'s mic") ||
    ariaLabel.includes("'s camera") ||
    ariaLabel.includes("'s video") ||
    tooltip.includes("'s microphone") ||
    tooltip.includes("'s mic") ||
    tooltip.includes("'s camera") ||
    tooltip.includes("'s video") ||
    ariaLabel.startsWith("mute ") ||
    ariaLabel.startsWith("pin ")
  ) {
    return true;
  }

  return false;
}

export function parseGoogleMeet(): MeetingState | null {
  let micElement = document.querySelector<HTMLElement>(
    'button[aria-label*="ctrl + d" i], ' +
      'button[aria-label*="⌘ + d" i], ' +
      'button[aria-label*="ctrl+d" i], ' +
      'button[aria-label*="⌘+d" i], ' +
      'button[data-tooltip*="ctrl + d" i], ' +
      'button[data-tooltip*="⌘ + d" i], ' +
      'button[data-tooltip*="ctrl+d" i], ' +
      'button[data-tooltip*="⌘+d" i], ' +
      'div[role="button"][aria-label*="ctrl + d" i], ' +
      'div[role="button"][aria-label*="⌘ + d" i], ' +
      'div[role="button"][data-tooltip*="ctrl + d" i], ' +
      'div[role="button"][data-tooltip*="⌘ + d" i]'
  );

  let camElement = document.querySelector<HTMLElement>(
    'button[aria-label*="ctrl + e" i], ' +
      'button[aria-label*="⌘ + e" i], ' +
      'button[aria-label*="ctrl+e" i], ' +
      'button[aria-label*="⌘+e" i], ' +
      'button[data-tooltip*="ctrl + e" i], ' +
      'button[data-tooltip*="⌘ + e" i], ' +
      'button[data-tooltip*="ctrl+e" i], ' +
      'button[data-tooltip*="⌘+e" i], ' +
      'div[role="button"][aria-label*="ctrl + e" i], ' +
      'div[role="button"][aria-label*="⌘ + e" i], ' +
      'div[role="button"][data-tooltip*="ctrl + e" i], ' +
      'div[role="button"][data-tooltip*="⌘ + e" i]'
  );

  if (!micElement || !camElement) {
    const controlBar =
      document.querySelector<HTMLElement>('div[data-is-control-bar="true"]') ||
      document
        .querySelector<HTMLElement>(
          'button[aria-label*="leave" i], button[aria-label*="end call" i], [data-call-ended]'
        )
        ?.closest<HTMLElement>(
          'div[role="region"], div[data-is-control-bar], footer, div'
        );

    if (controlBar) {
      if (!micElement) {
        micElement = controlBar.querySelector<HTMLElement>(
          'button[aria-label*="mic" i], ' +
            'button[aria-label*="microphone" i], ' +
            'button[data-tooltip*="mic" i], ' +
            'button[data-tooltip*="microphone" i], ' +
            'div[role="button"][aria-label*="mic" i], ' +
            "button[data-is-muted]"
        );
      }
      if (!camElement) {
        camElement = controlBar.querySelector<HTMLElement>(
          'button[aria-label*="camera" i], ' +
            'button[aria-label*="video" i], ' +
            'button[data-tooltip*="camera" i], ' +
            'button[data-tooltip*="video" i], ' +
            'div[role="button"][aria-label*="camera" i], ' +
            'div[role="button"][aria-label*="video" i]'
        );
      }
    }
  }

  if (!micElement) {
    const micCandidates = Array.from(
      document.querySelectorAll<HTMLElement>(
        'button[aria-label*="turn off microphone" i], ' +
          'button[aria-label*="turn on microphone" i], ' +
          'button[aria-label*="turn off mic" i], ' +
          'button[aria-label*="turn on mic" i], ' +
          'button[data-tooltip*="turn off microphone" i], ' +
          'button[data-tooltip*="turn on microphone" i], ' +
          'button[data-tooltip*="turn off mic" i], ' +
          'button[data-tooltip*="turn on mic" i], ' +
          'div[role="button"][aria-label*="turn off microphone" i], ' +
          'div[role="button"][aria-label*="turn on microphone" i]'
      )
    );
    micElement =
      micCandidates.find((el) => !isGoogleMeetParticipantElement(el)) || null;
  }

  if (!camElement) {
    const camCandidates = Array.from(
      document.querySelectorAll<HTMLElement>(
        'button[aria-label*="turn off camera" i], ' +
          'button[aria-label*="turn on camera" i], ' +
          'button[aria-label*="turn off video" i], ' +
          'button[aria-label*="turn on video" i], ' +
          'button[aria-label*="turn off cam" i], ' +
          'button[aria-label*="turn on cam" i], ' +
          'button[data-tooltip*="turn off camera" i], ' +
          'button[data-tooltip*="turn on camera" i], ' +
          'button[data-tooltip*="turn off video" i], ' +
          'button[data-tooltip*="turn on video" i], ' +
          'div[role="button"][aria-label*="turn off camera" i], ' +
          'div[role="button"][aria-label*="turn on camera" i]'
      )
    );
    camElement =
      camCandidates.find((el) => !isGoogleMeetParticipantElement(el)) || null;
  }

  if (!micElement || !camElement) {
    const allButtons = Array.from(
      document.querySelectorAll<HTMLElement>('button, div[role="button"]')
    );

    for (const el of allButtons) {
      if (isGoogleMeetParticipantElement(el)) continue;

      const ariaLabel = (el.getAttribute("aria-label") || "").toLowerCase();
      const tooltip = (el.getAttribute("data-tooltip") || "").toLowerCase();
      const combined = `${ariaLabel} ${tooltip}`;

      if (!micElement) {
        if (
          combined.includes("microphone") ||
          combined.includes("turn off mic") ||
          combined.includes("turn on mic")
        ) {
          micElement = el;
        }
      }

      if (!camElement) {
        if (
          combined.includes("camera") ||
          combined.includes("turn off video") ||
          combined.includes("turn on video") ||
          combined.includes("turn off cam") ||
          combined.includes("turn on cam")
        ) {
          camElement = el;
        }
      }

      if (micElement && camElement) break;
    }
  }

  const hasEndedScreen =
    document.querySelector("[data-call-ended]") !== null ||
    document.querySelector('button[aria-label*="rejoin" i]') !== null ||
    document.querySelector(
      'a[href*="meet.google.com"][aria-label*="home" i]'
    ) !== null;

  if (hasEndedScreen) {
    return { inMeeting: false, micOn: false, camOn: false };
  }

  const isMeetingUrl =
    /meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}/i.test(
      window.location.href
    ) || window.location.pathname.replace(/^\/+|\/+$/g, "").length >= 9;

  if (!micElement && !camElement && !isMeetingUrl) return null;

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
    const innerHtml = micElement.innerHTML.toLowerCase();
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
      combined.includes("mute (⌘ + d)") ||
      combined.includes("mute (ctrl+d)") ||
      combined.includes("mute (⌘+d)")
    ) {
      micOn = true;
    } else if (
      combined.includes("turn on microphone") ||
      combined.includes("turn on mic") ||
      combined.includes("unmute (ctrl + d)") ||
      combined.includes("unmute (⌘ + d)") ||
      combined.includes("unmute (ctrl+d)") ||
      combined.includes("unmute (⌘+d)")
    ) {
      micOn = false;
    } else if (innerHtml.includes("mic_off") || innerHtml.includes("mic-off")) {
      micOn = false;
    } else if (innerHtml.includes("mic") || text.includes("mic")) {
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
    const innerHtml = camElement.innerHTML.toLowerCase();
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
      combined.includes("turn off cam") ||
      combined.includes("turn off (ctrl + e)") ||
      combined.includes("turn off (⌘ + e)")
    ) {
      camOn = true;
    } else if (
      combined.includes("turn on camera") ||
      combined.includes("turn on video") ||
      combined.includes("turn on cam") ||
      combined.includes("turn on (ctrl + e)") ||
      combined.includes("turn on (⌘ + e)")
    ) {
      camOn = false;
    } else if (
      innerHtml.includes("videocam_off") ||
      innerHtml.includes("video-off") ||
      innerHtml.includes("camera-off")
    ) {
      camOn = false;
    } else if (
      innerHtml.includes("videocam") ||
      innerHtml.includes("camera") ||
      text.includes("videocam")
    ) {
      camOn = true;
    }
  }

  return { inMeeting: true, micOn, camOn };
}
