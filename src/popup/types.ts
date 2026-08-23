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
  enabled?: boolean;
}

export interface ConnectionState {
  status: "idle" | "connected" | "error" | "connecting";
  lastSyncTime: number | null;
  lastLatency: number | null;
  lastError: string | null;
}

export interface AggregatedState {
  inMeeting: boolean;
  micOn: boolean;
  camOn: boolean;
  totalMeetings: number;
  platform: string;
}

export interface MeetingTab {
  id: number;
  platform: string;
  micOn: boolean;
  camOn: boolean;
  title: string;
  lastUpdate: number;
}

export interface PopupState {
  config: MeetTallyConfig;
  connectionState: ConnectionState;
  aggregated: AggregatedState;
  targetColor: LedTargetColor;
  tabs: MeetingTab[];
}
