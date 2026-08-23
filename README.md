<h1 align="center">
  <img src="public/logo.png" alt="Meet Tally" width="64">
  <br>
  <b>Meet Tally</b>
</h1>

<h4 align="center">
  A real-time physical and digital tally light for <b>Google Meet</b> & <b>Microsoft Teams</b>, indicating microphone, camera, and meeting status.
</h4>

<p align="center">
  <a href="https://github.com/itskdhere/meet-tally/releases/latest">
    <img alt="GitHub Release" src="https://img.shields.io/github/v/release/itskdhere/meet-tally?logo=semver&label=Release">
  </a>
  &nbsp;
  <a href="https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3">
    <img alt="Chrome Extension" src="https://img.shields.io/badge/Manifest-V3-34A853?logo=googlechrome&logoColor=white">
  </a>
  &nbsp;
  <a href="LICENSE">
    <img alt="License" src="https://img.shields.io/github/license/itskdhere/meet-tally?logo=gplv3&label=License">
  </a>
</p>
<br>

#### Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [Intelligent Meeting Detection](#1-intelligent-meeting-detection)
  - [Browser Extension Popup UI](#2-browser-extension-popup-ui)
  - [Hardware Firmware (ESP8266)](#3-hardware-firmware-esp8266)
- [LED Status Matrix](#-led-status-matrix)
- [Tech Stack](#-tech-stack)
  - [Chrome Extension](#chrome-extension)
  - [Microcontroller Firmware](#microcontroller-firmware)
- [Hardware Setup & Wiring](#-hardware-setup--wiring)
  - [Required Components](#required-components)
  - [Default Pinout Configuration (ESP8266)](#default-pinout-configuration-esp8266)
- [Getting Started](#-getting-started)
  - [Flash the ESP8266 Firmware](#1-flash-the-esp8266-firmware)
  - [Install the Chrome Extension](#2-install-the-chrome-extension)
- [REST API Reference](#-rest-api-reference)
  - [Set LED State](#1-set-led-state)
  - [Get Device Status](#2-get-device-status)
- [Repository Structure](#-repository-structure)
- [Permissions & Security](#-permissions--security)
- [License](#-license)

## 📌 Overview

**Meet Tally** bridges the gap between the virtual meeting tabs and the physical world. It monitors the meeting status, microphone, and camera states in real-time, automatically controlling an external hardware tally light placed outside the room or on the desk so family, roommates, or colleagues know when you are live or muted.

## 🔮 Key Features

### 1. Intelligent Meeting Detection

- **Google Meet Support**: Analyzes DOM buttons, aria labels, shortcut keys (`Ctrl+D`, `Ctrl+E`), and filters out participant lists to eliminate false positives.
- **Microsoft Teams Support**: Compatible with classic and new Teams interfaces (`teams.microsoft.com`, `teams.live.com`, `teams.cloud.microsoft`), pre-join/green room toggle switches, calling toolbars, and meeting hubs.
- **Multi-Tab State Aggregation**: Seamlessly aggregates status across multiple open meetings and tabs.
- **Dynamic Action Badges**: Real-time badge indicators directly on the browser extension icon (`LIVE`, `CAM`, `MIC`, `MEET`, `IDLE`, `MAN`).

### 2. Browser Extension Popup UI

- Built with **React 19**, **TypeScript**, and **Tailwind CSS v4** in a sleek glassmorphic dark theme.
- **Profile Toggle Switch**: Instant ON/OFF power switch in the header to pause or resume hardware sync per browser profile.
- **Auto Detection View**: Live monitoring of microphone, camera, active platform, and connected tabs.
- **Manual Override View**: Click-to-activate physical LEDs (Red, Yellow, Blue, Green, Live Red+Yellow, or Off).
- **Device Management**: Input custom mDNS hostnames or IP addresses with real-time ping latency tests and connection health diagnostics.

### 3. Hardware Firmware (ESP8266)

- Zero-dependency, lightweight C++ Arduino sketch.
- **mDNS Support**: Accessible over local network at `http://meet-tally.local`.
- **Standalone Web UI**: Built-in digital tally dashboard hosted on the ESP8266.
- **RESTful HTTP API**: Instant control with CORS support for seamless browser communication.
- **Wi-Fi Auto-Reconnect**: Automatic reconnect with fallback SoftAP mode (`Meet Tally`).

## 🚦 LED Status Matrix

| Indicator Color |      Hardware State      | Meeting Condition               | Browser Badge  | Meaning                            |
| :-------------- | :----------------------: | :------------------------------ | :------------: | :--------------------------------- |
| 🟢 **Green**    |     `PIN_GREEN` (D1)     | Not in any active meeting       | `IDLE` (Green) | **Available / Free**               |
| 🔵 **Blue**     |     `PIN_BLUE` (D2)      | In meeting, Camera OFF, Mic OFF | `MEET` (Blue)  | **In Meeting (Muted / Listening)** |
| 🟡 **Yellow**   |    `PIN_YELLOW` (D5)     | In meeting, Camera OFF, Mic ON  | `MIC` (Yellow) | **Speaking / Mic Active**          |
| 🔴 **Red**      |      `PIN_RED` (D6)      | In meeting, Camera ON, Mic OFF  |  `CAM` (Red)   | **On Video / Camera Active**       |
| 🔴🟡 **Live**   | `PIN_RED` + `PIN_YELLOW` | In meeting, Camera ON, Mic ON   |  `LIVE` (Red)  | **On Air / Live (Video + Audio)**  |
| ⚫ **Off**      |       All Pins Low       | Manual shutdown / Disabled      | `MAN` / `OFF`  | **Disabled / Standby**             |

## 🛠 Tech Stack

### Chrome Extension

- **Framework**: [React v19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- **Bundler & Build Tool**: [Vite v8](https://vite.dev) + [@crxjs/vite-plugin](https://www.npmjs.com/package/@crxjs/vite-plugin)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Icons**: [@tabler/icons-react](https://tabler.io/icons)
- **Packaging**: [vite-plugin-zip-pack](https://www.npmjs.com/package/vite-plugin-zip-pack)

### Microcontroller Firmware

- **Platform**: ESP8266
- **Framework**: Arduino C++
- **Libraries**: `ESP8266WiFi`, `ESP8266WebServer`, `ESP8266mDNS`

## 🔌 Hardware Setup & Wiring

### Required Components

- **1x** ESP8266 Development Board (NodeMCU, Wemos D1 Mini etc.)
- **4x** 5mm LEDs (1x Red, 1x Yellow, 1x Blue, 1x Green)
- **1x** to **4x** 220Ω – 330Ω Resistors (single resistor on common GND or one per LED)
- **1x** Breadboard & Jumper Wires
- **1x** Micro-USB / USB-C Cable for power & programming

### Default Pinout Configuration (ESP8266)

| LED Color        | NodeMCU / Wemos Pin | ESP8266 GPIO | Purpose               |
| :--------------- | :-----------------: | :----------: | :-------------------- |
| 🟢 **Green**     |       **D1**        |   `GPIO5`    | Idle / Not in Meeting |
| 🔵 **Blue**      |       **D2**        |   `GPIO4`    | In Meeting (Muted)    |
| 🟡 **Yellow**    |       **D5**        |   `GPIO14`   | Microphone Active     |
| 🔴 **Red**       |       **D6**        |   `GPIO12`   | Camera Active         |
| ⏚ &nbsp; **GND** |       **GND**       |    Ground    | Common Ground         |

> [!TIP]
> Pin assignments can be customized in [`sketch/config.h`](file:///sketch/config.h). If using a 5V relay module with Active LOW triggers, set `LED_ACTIVE_HIGH = false` in `config.h`. For wiring, you can use a single 220Ω–330Ω resistor on the common GND rail (or individual resistors on each LED).

## 🚀 Getting Started

### 1. Flash the ESP8266 Firmware

1. Open the [`sketch/`](file:///sketch/) folder in **Arduino IDE** or **VS Code + PlatformIO**.
2. Install the **ESP8266 Board Package** in Arduino IDE (`Boards Manager -> esp8266`).
3. Open [`sketch/config.h`](file:///sketch/config.h) and enter your Wi-Fi credentials:
   ```cpp
   constexpr char WIFI_SSID[] = "YOUR_WIFI_SSID";
   constexpr char WIFI_PASSWORD[] = "YOUR_WIFI_PASSWORD";
   ```
4. Select your board (e.g., _NodeMCU 1.0 (ESP-12E Module)_ or _LOLIN(WEMOS) D1 R2 & mini_) and serial port.
5. Upload the sketch.
6. Open the Serial Monitor at **115200 baud** to view the connected IP address and verify mDNS startup (`http://meet-tally.local`).

### 2. Install the Chrome Extension

#### Option A: Quick Install (Pre-built Release – Recommended)

1. Download the latest `crx-meet-tally-x.y.z.zip` from [GitHub Releases](https://github.com/itskdhere/meet-tally/releases/latest).
2. Extract the downloaded `.zip` file to a permanent folder on your computer (e.g., in `Documents` or a dedicated tools folder).
3. Open Google Chrome (or any Chromium browser like Brave or Edge) and navigate to `chrome://extensions`.
4. Enable **Developer mode** using the toggle switch in the top-right corner.
5. Click **Load unpacked** and select the extracted folder (containing `manifest.json`).
6. Pin the **Meet Tally** extension to your browser toolbar.

> [!IMPORTANT]
> **Do not delete, rename, or move the extracted folder** after loading it. Chromium browsers read unpacked extensions directly from that directory on disk; deleting or moving it will cause the extension to fail to load.

_**OR**_,

#### Option B: Build from Source (Developers)

##### Prerequisites

- [Node.js](https://nodejs.org) (≥24)
- [pnpm](https://pnpm.io) (≥11)

##### Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/itskdhere/meet-tally.git
   cd meet-tally
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start development server with hot-reload:

   ```bash
   pnpm dev
   ```

4. Load into Chrome:
   - Open `chrome://extensions` and enable **Developer mode**.
   - Click **Load unpacked** and select the generated [`dist/`](file:///dist/) folder.

##### Production Build

```bash
pnpm build
```

The optimized extension bundle will be generated in `dist/`, and a zipped distribution package will be created in `release/`.

## 📡 REST API Reference

The ESP8266 firmware hosts an HTTP REST server with full CORS support:

### 1. Set LED State

**Endpoint**: `GET /set?led=<color>`

**Parameters**:

- `led` / `color`: `green` | `blue` | `yellow` | `red` | `live` | `off`

**Example Request**:

```http
GET http://meet-tally.local/set?led=live HTTP/1.1
```

**Example Response**:

```json
{
  "success": true,
  "active": "live",
  "red": true,
  "yellow": true,
  "blue": false,
  "green": false
}
```

### 2. Get Device Status

**Endpoint**: `GET /status` or `GET /api/state`

**Example Response**:

```json
{
  "active": "green",
  "red": false,
  "yellow": false,
  "blue": false,
  "green": true,
  "ip": "192.168.1.105",
  "uptimeSeconds": 1420
}
```

## 📁 Repository Structure

```
meet-tally/
├── public/                   # Static assets
│   └── logo.png              # Extension icon and branding artwork
├── sketch/                   # Microcontroller Firmware (ESP8266/ESP32)
│   ├── config.h              # Wi-Fi credentials, pin mappings, and hostnames
│   ├── index_html.h          # Embedded web dashboard for ESP8266
│   ├── led_controller.cpp    # GPIO logic and state management
│   ├── led_controller.h      # LED controller definitions and state enums
│   ├── sketch.ino            # Main Arduino entrypoint
│   ├── web_server.cpp        # HTTP REST API server with CORS
│   ├── web_server.h          # Web server declarations and routing headers
│   ├── wifi_manager.cpp      # Wi-Fi connection and mDNS responder
│   └── wifi_manager.h        # Wi-Fi manager declarations and headers
├── src/                      # Chrome Extension Source
│   ├── assets/               # Vector graphics and UI assets
│   │   └── logo.svg          # Vector logo graphic
│   ├── background/           # Background Service Worker
│   │   └── background.ts     # State aggregation, HTTP sync & badge controller
│   ├── content/              # DOM Content Scripts
│   │   ├── content.ts        # Main observer entrypoint & lifecycle events
│   │   ├── googleMeet.ts     # Google Meet parser heuristics
│   │   ├── microsoftTeams.ts # MS Teams parser heuristics
│   │   └── types.ts          # Content script type definitions
│   └── popup/                # Extension Popup UI
│       ├── components/       # UI Components (AutoView, ManualView, Settings, etc.)
│       ├── hooks/            # React hooks (usePopupState)
│       ├── App.tsx           # Popup root component
│       ├── main.tsx          # Popup React entrypoint
│       ├── style.css         # Tailwind CSS v4 setup & typography
│       └── types.ts          # Popup state & configuration types
├── manifest.config.ts        # Chrome Extension Manifest V3 configuration
├── package.json              # Scripts & project dependencies
├── pnpm-lock.yaml            # Locked dependency versions
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite bundler, Tailwind, and CRXJS configuration
```

## 🔒 Permissions & Security

Meet Tally requests minimal Chrome permissions:

- **`storage`**: Saves your ESP8266 device IP/mDNS URL and mode preferences locally.
- **`tabs`**: Monitors active meeting tab lifecycle and closes/reconnects cleanly.
- **`alarms`**: Periodic background sync heartbeat to prevent state drift.
- **`host_permissions`**: Allows HTTP fetch communication to your local ESP8266 device and meeting hosts (`meet.google.com`, `teams.microsoft.com`, `teams.live.com`, `teams.cloud.microsoft`).

## 📄 License

This project is licensed under the **GNU General Public License v3.0**. See the [LICENSE](LICENSE) file for details.

<br>
<p align="center">
  Developed & Maintained by <a href="https://github.com/itskdhere">itskdhere</a>
</p>
