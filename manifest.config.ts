import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json" with { type: "json" };

export default defineManifest({
  manifest_version: 3,
  name: "Meet Tally",
  version: pkg.version,
  description:
    "Physical Meeting & Mic./Cam. Status Indicator for Google Meet, MS Teams, and Zoom",
  icons: {
    16: "public/logo.png",
    32: "public/logo.png",
    48: "public/logo.png",
    128: "public/logo.png",
    256: "public/logo.png",
    512: "public/logo.png",
  },
  action: {
    default_icon: {
      16: "public/logo.png",
      32: "public/logo.png",
      48: "public/logo.png",
      128: "public/logo.png",
      256: "public/logo.png",
      512: "public/logo.png",
    },
    default_popup: "src/popup/index.html",
    default_title: "Meet Tally Controller",
  },
  background: {
    service_worker: "src/background/background.ts",
    type: "module",
  },
  content_scripts: [
    {
      js: ["src/content/content.ts"],
      matches: [
        "https://meet.google.com/*",
        "https://teams.microsoft.com/*",
        "https://teams.live.com/*",
        "https://*.zoom.us/*",
      ],
      run_at: "document_idle",
    },
  ],
  permissions: ["storage", "tabs", "alarms"],
  host_permissions: ["http://*/*", "https://*/*"],
});
