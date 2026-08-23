import { MeetingState } from "./types";

function isSwitchActive(el: HTMLElement | null): boolean {
  if (!el) return false;

  const ariaChecked = el.getAttribute("aria-checked");
  if (ariaChecked === "true") return true;
  if (ariaChecked === "false") return false;

  const ariaPressed = el.getAttribute("aria-pressed");
  if (ariaPressed === "true") return true;
  if (ariaPressed === "false") return false;

  const inputEl = (
    el.tagName.toLowerCase() === "input" ? el : el.querySelector("input")
  ) as HTMLInputElement | null;
  if (inputEl && typeof inputEl.checked === "boolean") {
    return inputEl.checked;
  }

  const isCheckedClass =
    el.className.includes("is-checked") ||
    el.className.includes("checked") ||
    el.className.includes("Switch--checked") ||
    el.closest(".is-checked, .checked, [class*='Switch--checked']") !== null;
  if (isCheckedClass) return true;

  const ariaLabel = (el.getAttribute("aria-label") || "").toLowerCase();
  const title = (el.getAttribute("title") || "").toLowerCase();
  const combined = `${ariaLabel} ${title}`;

  if (
    combined.includes("turn camera off") ||
    combined.includes("turn off camera") ||
    combined.includes("turn mic off") ||
    combined.includes("turn off mic") ||
    combined.includes("camera is on") ||
    combined.includes("mic is on")
  ) {
    return true;
  }

  if (
    combined.includes("turn camera on") ||
    combined.includes("turn on camera") ||
    combined.includes("turn mic on") ||
    combined.includes("turn on mic") ||
    combined.includes("camera is off") ||
    combined.includes("mic is off") ||
    combined.includes("unmute") ||
    combined.includes("muted")
  ) {
    return false;
  }

  return false;
}

export function parseMicrosoftTeams(): MeetingState | null {
  const bodyText = (
    document.body.innerText ||
    document.body.textContent ||
    ""
  ).toLowerCase();

  const hangupBtn = document.querySelector<HTMLElement>(
    "#hangup-button, " +
      'button[data-tid*="hangup" i], ' +
      'button[data-tid*="call-hangup" i], ' +
      'button[data-tid*="leave" i], ' +
      'button[id*="leave-button" i], ' +
      'button[aria-label*="leave" i], ' +
      'button[aria-label*="hang up" i]'
  );

  const callingToolbar = document.querySelector<HTMLElement>(
    '[data-tid*="calling-toolbar" i], ' +
      '[data-tid*="call-controls" i], ' +
      '[data-tid*="calling-top-bar" i], ' +
      '[data-tid*="call-bar" i], ' +
      '[data-tid="call-controls-container"], ' +
      "#callingButtons-container, " +
      "#call-controls-container, " +
      ".calling-toolbar, " +
      'div[role="toolbar"][aria-label*="meeting" i], ' +
      'div[role="toolbar"][aria-label*="call" i], ' +
      'header[role="toolbar"]'
  );

  const isInCall = !!hangupBtn || !!callingToolbar;

  const hasJoinNowButton = Array.from(
    document.querySelectorAll<HTMLElement>('button, [role="button"]')
  ).some((btn) => {
    const text = (btn.innerText || btn.textContent || "").trim().toLowerCase();
    const aria = (btn.getAttribute("aria-label") || "").trim().toLowerCase();
    const tid = (btn.getAttribute("data-tid") || "").trim().toLowerCase();
    return (
      text === "join now" ||
      aria === "join now" ||
      text === "join meeting" ||
      aria === "join meeting" ||
      tid === "prejoin-join-button" ||
      tid.includes("prejoin-join")
    );
  });

  const isPreJoinScreen =
    !isInCall &&
    (hasJoinNowButton ||
      bodyText.includes("computer audio") ||
      bodyText.includes("don't use audio") ||
      bodyText.includes("phone audio") ||
      bodyText.includes("your camera is turned off") ||
      bodyText.includes("background filters") ||
      bodyText.includes("choose your audio and video settings") ||
      document.querySelector(
        'button[data-tid*="prejoin" i], [data-tid*="prejoin" i], #prejoin-container, .prejoin-container, [class*="prejoin" i]'
      ) !== null);

  if (!isInCall && !isPreJoinScreen) {
    const hasEndedScreen =
      document.querySelector(
        '[data-tid*="call-ended" i], [data-tid*="post-call" i], button[data-tid*="rejoin" i], button[aria-label*="rejoin" i]'
      ) !== null || bodyText.includes("you left the meeting");

    if (hasEndedScreen) {
      return { inMeeting: false, micOn: false, camOn: false };
    }
  }

  const isMeetHubTab =
    !isInCall &&
    !isPreJoinScreen &&
    bodyText.includes("create a meeting link") &&
    (bodyText.includes("schedule a meeting") ||
      bodyText.includes("join with a meeting id"));

  if (isMeetHubTab) {
    return null;
  }

  if (!isInCall && !isPreJoinScreen) {
    return null;
  }

  if (isPreJoinScreen) {
    const allSwitches = Array.from(
      document.querySelectorAll<HTMLElement>(
        '[role="switch"], input[type="checkbox"], [class*="Switch" i], [class*="switch" i]'
      )
    );

    const camSwitch =
      allSwitches.find((el) => {
        const aria = (el.getAttribute("aria-label") || "").toLowerCase();
        const title = (el.getAttribute("title") || "").toLowerCase();
        const tid = (el.getAttribute("data-tid") || "").toLowerCase();
        const parentText = (
          el.parentElement?.innerText ||
          el.closest("div")?.innerText ||
          ""
        ).toLowerCase();
        return (
          aria.includes("camera") ||
          aria.includes("video") ||
          title.includes("camera") ||
          title.includes("video") ||
          tid.includes("camera") ||
          tid.includes("video") ||
          parentText.includes("background filters") ||
          parentText.includes("camera")
        );
      }) || (allSwitches.length > 0 ? allSwitches[0] : null);

    const micSwitch =
      allSwitches.find((el) => {
        const aria = (el.getAttribute("aria-label") || "").toLowerCase();
        const title = (el.getAttribute("title") || "").toLowerCase();
        const tid = (el.getAttribute("data-tid") || "").toLowerCase();
        const parentText = (
          el.parentElement?.innerText ||
          el.closest("div")?.innerText ||
          ""
        ).toLowerCase();
        return (
          aria.includes("mic") ||
          aria.includes("mute") ||
          aria.includes("audio") ||
          title.includes("mic") ||
          title.includes("mute") ||
          tid.includes("mic") ||
          tid.includes("mute") ||
          parentText.includes("microphone") ||
          parentText.includes("audio device") ||
          parentText.includes("speaker")
        );
      }) || (allSwitches.length > 1 ? allSwitches[1] : null);

    let camOn = false;
    if (camSwitch) {
      camOn = isSwitchActive(camSwitch);
    } else {
      camOn =
        !bodyText.includes("your camera is turned off") &&
        !bodyText.includes("camera is turned off");
    }

    let micOn = false;
    const dontUseAudio = document.querySelector<HTMLInputElement>(
      'input[type="radio"][aria-label*="don\'t use audio" i]'
    );
    if (dontUseAudio && dontUseAudio.checked) {
      micOn = false;
    } else if (micSwitch) {
      micOn = isSwitchActive(micSwitch);
    }

    return { inMeeting: true, micOn, camOn };
  }

  let micElement: HTMLElement | null = null;
  if (callingToolbar) {
    micElement = callingToolbar.querySelector<HTMLElement>(
      "#microphone-button, " +
        'button[data-tid="toggle-mute"], ' +
        'button[data-tid*="toggle-mute" i], ' +
        'button[data-tid*="microphone" i], ' +
        'button[aria-label*="ctrl+shift+m" i], ' +
        'button[aria-label*="ctrl + shift + m" i], ' +
        'button[aria-label*="⌘+shift+m" i], ' +
        'button[aria-label*="⌘ + shift + m" i], ' +
        'button[data-tid*="mute" i], ' +
        'button[aria-label*="mute" i], ' +
        'button[aria-label*="mic" i]'
    );
  }

  if (!micElement) {
    micElement = document.querySelector<HTMLElement>(
      "#microphone-button, " +
        'button[data-tid="toggle-mute"], ' +
        'button[data-tid*="toggle-mute" i], ' +
        'button[data-tid="microphone-button"], ' +
        'button[data-tid*="microphone-button" i], ' +
        'button[aria-label*="ctrl+shift+m" i], ' +
        'button[aria-label*="ctrl + shift + m" i], ' +
        'button[aria-label*="⌘+shift+m" i], ' +
        'button[aria-label*="⌘ + shift + m" i]'
    );
  }

  let camElement: HTMLElement | null = null;
  if (callingToolbar) {
    camElement = callingToolbar.querySelector<HTMLElement>(
      "#video-button, " +
        'button[data-tid="toggle-video"], ' +
        'button[data-tid*="toggle-video" i], ' +
        'button[data-tid*="camera" i], ' +
        'button[aria-label*="ctrl+shift+o" i], ' +
        'button[aria-label*="ctrl + shift + o" i], ' +
        'button[aria-label*="⌘+shift+o" i], ' +
        'button[aria-label*="⌘ + shift + o" i], ' +
        'button[data-tid*="video" i], ' +
        'button[aria-label*="camera" i], ' +
        'button[aria-label*="video" i]'
    );
  }

  if (!camElement) {
    camElement = document.querySelector<HTMLElement>(
      "#video-button, " +
        'button[data-tid="toggle-video"], ' +
        'button[data-tid*="toggle-video" i], ' +
        'button[data-tid="video-button"], ' +
        'button[data-tid*="camera-button" i], ' +
        'button[aria-label*="ctrl+shift+o" i], ' +
        'button[aria-label*="ctrl + shift + o" i], ' +
        'button[aria-label*="⌘+shift+o" i], ' +
        'button[aria-label*="⌘ + shift + o" i]'
    );
  }

  let micOn = false;
  if (micElement) {
    const isMutedAttr =
      micElement.getAttribute("data-is-muted") ||
      micElement.closest("[data-is-muted]")?.getAttribute("data-is-muted");
    const ariaChecked = micElement.getAttribute("aria-checked");
    const ariaPressed = micElement.getAttribute("aria-pressed");
    const isCheckedClass =
      micElement.className.includes("is-checked") ||
      micElement.className.includes("checked") ||
      micElement.closest(".is-checked, .checked") !== null;
    const inputChecked = (micElement as HTMLInputElement).checked;
    const ariaLabel = (
      micElement.getAttribute("aria-label") || ""
    ).toLowerCase();
    const title = (micElement.getAttribute("title") || "").toLowerCase();
    const innerText = (
      micElement.innerText ||
      micElement.textContent ||
      ""
    ).toLowerCase();
    const innerHtml = micElement.innerHTML.toLowerCase();
    const combined = `${ariaLabel} ${title} ${innerText}`;

    if (isMutedAttr === "false") {
      micOn = true;
    } else if (isMutedAttr === "true") {
      micOn = false;
    } else if (
      ariaChecked === "true" ||
      isCheckedClass ||
      inputChecked === true
    ) {
      micOn = true;
    } else if (ariaChecked === "false" || inputChecked === false) {
      micOn = false;
    } else if (
      combined.includes("unmute") ||
      combined.includes("muted") ||
      combined.includes("turn mic on") ||
      combined.includes("turn on mic") ||
      combined.includes("mic is off") ||
      innerHtml.includes("mic_off") ||
      innerHtml.includes("mic-off")
    ) {
      micOn = false;
    } else if (
      combined.includes("mute (") ||
      combined.includes("turn mic off") ||
      combined.includes("turn off mic") ||
      combined.includes("mic is on")
    ) {
      micOn = true;
    } else if (ariaPressed !== null) {
      micOn = ariaPressed !== "true";
    } else {
      micOn = !combined.includes("unmute") && !combined.includes("muted");
    }
  }

  let camOn = false;
  if (camElement) {
    const isMutedAttr =
      camElement.getAttribute("data-is-muted") ||
      camElement.closest("[data-is-muted]")?.getAttribute("data-is-muted");
    const ariaChecked = camElement.getAttribute("aria-checked");
    const ariaPressed = camElement.getAttribute("aria-pressed");
    const isCheckedClass =
      camElement.className.includes("is-checked") ||
      camElement.className.includes("checked") ||
      camElement.closest(".is-checked, .checked") !== null;
    const inputChecked = (camElement as HTMLInputElement).checked;
    const ariaLabel = (
      camElement.getAttribute("aria-label") || ""
    ).toLowerCase();
    const title = (camElement.getAttribute("title") || "").toLowerCase();
    const innerText = (
      camElement.innerText ||
      camElement.textContent ||
      ""
    ).toLowerCase();
    const innerHtml = camElement.innerHTML.toLowerCase();
    const combined = `${ariaLabel} ${title} ${innerText}`;

    if (isMutedAttr === "false") {
      camOn = true;
    } else if (isMutedAttr === "true") {
      camOn = false;
    } else if (
      ariaChecked === "true" ||
      isCheckedClass ||
      inputChecked === true
    ) {
      camOn = true;
    } else if (ariaChecked === "false" || inputChecked === false) {
      camOn = false;
    } else if (
      combined.includes("turn camera on") ||
      combined.includes("turn on camera") ||
      combined.includes("camera is off") ||
      combined.includes("start video") ||
      combined.includes("turn video on") ||
      combined.includes("turn on video") ||
      innerHtml.includes("videocam_off") ||
      innerHtml.includes("video-off") ||
      innerHtml.includes("camera-off")
    ) {
      camOn = false;
    } else if (
      combined.includes("turn camera off") ||
      combined.includes("turn off camera") ||
      combined.includes("camera is on") ||
      combined.includes("stop video") ||
      combined.includes("turn video off") ||
      combined.includes("turn off video")
    ) {
      camOn = true;
    } else if (ariaPressed !== null) {
      camOn = ariaPressed === "true";
    } else {
      camOn =
        !combined.includes("turn camera on") &&
        !combined.includes("camera is off") &&
        !combined.includes("turn on camera");
    }
  }

  return { inMeeting: true, micOn, camOn };
}
