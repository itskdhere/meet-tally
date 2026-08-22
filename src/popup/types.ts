export interface MeetTallyConfig {
  espUrl: string;
  mode: "auto" | "manual";
  manualColor: "red" | "blue" | "green" | "off";
  debugLog: boolean;
}

export interface ConnectionState {
  status: "idle" | "connected" | "error" | "connecting";
  lastSyncTime: number | null;
  lastLatency: number | null;
  lastError: string | null;
  lastSentColor: string | null;
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
  targetColor: "red" | "blue" | "green" | "off";
  tabs: MeetingTab[];
}
