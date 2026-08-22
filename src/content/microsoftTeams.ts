import { MeetingState } from "./types";

export function parseMicrosoftTeams(): MeetingState | null {
  const micBtn = document.querySelector<HTMLElement>(
    "#microphone-button, " +
      'button[data-tid*="toggle-mute" i], ' +
      'button[aria-label*="ctrl+shift+m" i], ' +
      'button[aria-label*="ctrl + shift + m" i], ' +
      'button[aria-label*="mic" i], ' +
      'button[aria-label*="mute" i], ' +
      'button[id*="mic-button" i]'
  );

  const camBtn = document.querySelector<HTMLElement>(
    "#video-button, " +
      'button[data-tid*="toggle-video" i], ' +
      'button[aria-label*="ctrl+shift+o" i], ' +
      'button[aria-label*="ctrl + shift + o" i], ' +
      'button[aria-label*="camera" i], ' +
      'button[aria-label*="video" i], ' +
      'button[id*="video-button" i]'
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
