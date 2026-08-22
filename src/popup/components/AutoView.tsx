import React from "react";
import {
  IconMicrophone,
  IconMicrophoneOff,
  IconVideo,
  IconVideoOff,
} from "@tabler/icons-react";
import type { AggregatedState, MeetingTab, LedTargetColor } from "../types";

interface Props {
  aggregated?: AggregatedState;
  targetColor: LedTargetColor;
  tabs?: MeetingTab[];
}

export const AutoView: React.FC<Props> = ({
  aggregated = {
    inMeeting: false,
    micOn: false,
    camOn: false,
    totalMeetings: 0,
    platform: "None",
  },
  targetColor,
  tabs = [],
}) => {
  const getPlatformClass = (platform?: string) => {
    if (!platform) return "";
    const p = platform.toLowerCase();
    if (p.includes("meet") || p.includes("google")) return "platform-meet";
    if (p.includes("team") || p.includes("microsoft")) return "platform-teams";
    if (p.includes("zoom")) return "platform-zoom";
    return "platform-generic";
  };

  const getLedTitle = (color: LedTargetColor) => {
    switch (color) {
      case "green":
        return "Green (Not in Meeting)";
      case "blue":
        return "Blue (In Meeting)";
      case "yellow":
        return "Yellow (Microphone On)";
      case "red":
        return "Red (Camera On)";
      case "live":
        return "Red + Yellow (Camera + Microphone)";
      case "off":
        return "Off";
      default:
        return color;
    }
  };

  return (
    <section className="view-panel">
      <div className="card live-card">
        <div className="card-header">
          <span className="card-tag">MEETING DETECTION STATUS</span>
        </div>

        <div className="indicator-grid">
          <div
            className={`sensor-box ${aggregated.micOn ? "mic-live" : "muted"}`}
          >
            <div className="sensor-icon-wrap">
              {aggregated.micOn ? (
                <IconMicrophone size={22} stroke={2} />
              ) : (
                <IconMicrophoneOff size={22} stroke={2} />
              )}
            </div>
            <div className="sensor-meta">
              <span className="sensor-label">Microphone</span>
              <span className="sensor-state">
                {aggregated.micOn ? "ON" : "OFF"}
              </span>
            </div>
          </div>

          <div
            className={`sensor-box ${aggregated.camOn ? "cam-live" : "muted"}`}
          >
            <div className="sensor-icon-wrap">
              {aggregated.camOn ? (
                <IconVideo size={22} stroke={2} />
              ) : (
                <IconVideoOff size={22} stroke={2} />
              )}
            </div>
            <div className="sensor-meta">
              <span className="sensor-label">Camera</span>
              <span className="sensor-state">
                {aggregated.camOn ? "ON" : "OFF"}
              </span>
            </div>
          </div>
        </div>

        <div className="status-bottom-grid">
          <div className="status-bottom-box platform-box">
            <span
              className={`platform-pill ${
                aggregated.inMeeting
                  ? `active ${getPlatformClass(aggregated.platform)}`
                  : ""
              }`}
            >
              {aggregated.inMeeting
                ? aggregated.platform || "Meeting Active"
                : "No Active Meeting"}
            </span>
          </div>

          <div
            className="status-bottom-box led-box"
            title={getLedTitle(targetColor)}
          >
            <span className="preview-label">LED:</span>
            {targetColor === "live" ? (
              <div className="led-dual-wrap">
                <div className="led-orb red" title="Red (Camera ON)"></div>
                <div
                  className="led-orb yellow"
                  title="Yellow (Microphone ON)"
                ></div>
              </div>
            ) : (
              <div
                className={`led-orb ${targetColor}`}
                title={getLedTitle(targetColor)}
              ></div>
            )}
          </div>
        </div>

        {tabs && tabs.length > 0 && (
          <div className="tabs-list">
            {tabs.map((tab) => (
              <div className="tab-item" key={tab.id}>
                <span className="tab-title" title={tab.title}>
                  {tab.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
