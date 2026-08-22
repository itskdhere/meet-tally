import React from "react";
import type { ConnectionState } from "../types";

interface Props {
  connectionState?: ConnectionState;
}

export const ConnectionBadge: React.FC<Props> = ({ connectionState }) => {
  let badgeClass = "conn-idle";
  let text = "STANDBY";
  let title = "Device Connection Status";

  if (connectionState) {
    if (connectionState.status === "connected") {
      badgeClass = "conn-connected";
      text = connectionState.lastLatency
        ? `ONLINE (${connectionState.lastLatency}ms)`
        : "ONLINE";
    } else if (connectionState.status === "error") {
      badgeClass = "conn-error";
      text = "SYNC ERROR";
      title = connectionState.lastError || "Network Error";
    } else {
      badgeClass = "conn-idle";
      text = "STANDBY";
    }
  }

  return (
    <div className={`conn-badge ${badgeClass}`} title={title}>
      <span className="conn-dot"></span>
      <span>{text}</span>
    </div>
  );
};
