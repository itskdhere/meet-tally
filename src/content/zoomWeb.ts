import { MeetingState } from "./types";

export function parseZoomWeb(): MeetingState | null {
  const micBtn = document.querySelector<HTMLElement>(
    'button[aria-label*="audio" i], ' +
      'button[aria-label*="mute" i], ' +
      ".join-dialog"
  );

  const camBtn = document.querySelector<HTMLElement>(
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
