#pragma once
#include <Arduino.h>

const char INDEX_HTML[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meet Tally</title>
  <style>
    :root {
      --bg: #0f172a;
      --card-bg: rgba(30, 41, 59, 0.85);
      --card-border: rgba(255, 255, 255, 0.1);
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --red-color: #ef4444;
      --red-glow: rgba(239, 68, 68, 0.45);
      --blue-color: #3b82f6;
      --blue-glow: rgba(59, 130, 246, 0.45);
      --green-color: #22c55e;
      --green-glow: rgba(34, 197, 94, 0.45);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }

    body {
      background: radial-gradient(circle at 50% 10%, #1e293b, var(--bg));
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .container {
      width: 100%;
      max-width: 440px;
      background: var(--card-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--card-border);
      border-radius: 24px;
      padding: 36px 24px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
      text-align: center;
    }

    .header {
      margin-bottom: 26px;
    }

    .header h1 {
      font-size: 1.6rem;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin-bottom: 6px;
    }

    .header p {
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    .status-dock {
      background: rgba(30, 41, 59, 0.5);
      border: 1.5px solid #475569;
      border-radius: 44px;
      padding: 14px 20px;
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 18px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    }

    .led-bulb {
      width: 66px;
      height: 66px;
      border-radius: 50%;
      background: #1e293b;
      border: 3px solid #334155;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      cursor: pointer;
    }

    .led-bulb:hover {
      transform: scale(1.06);
    }

    .led-bulb:active {
      transform: scale(0.96);
    }

    .led-bulb::after {
      content: '';
      position: absolute;
      top: 15%;
      left: 20%;
      width: 25%;
      height: 25%;
      background: rgba(255, 255, 255, 0.25);
      border-radius: 50%;
    }

    .led-bulb.red.active {
      background: var(--red-color);
      box-shadow: 0 0 30px var(--red-color), 0 0 60px var(--red-glow);
    }

    .led-bulb.blue.active {
      background: var(--blue-color);
      box-shadow: 0 0 30px var(--blue-color), 0 0 60px var(--blue-glow);
    }

    .led-bulb.green.active {
      background: var(--green-color);
      box-shadow: 0 0 30px var(--green-color), 0 0 60px var(--green-glow);
    }

    .footer {
      margin-top: 26px;
      font-size: 0.75rem;
      color: #64748b;
    }

    .footer a {
      color: #94a3b8;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .footer a:hover {
      color: #38bdf8;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Meet Tally</h1>
      <p>Controller and Status Indicator</p>
    </div>

    <div class="status-dock">
      <div id="bulb-red" class="led-bulb red" onclick="setLed('red')" title="Toggle Red"></div>
      <div id="bulb-blue" class="led-bulb blue" onclick="setLed('blue')" title="Toggle Blue"></div>
      <div id="bulb-green" class="led-bulb green" onclick="setLed('green')" title="Toggle Green"></div>
    </div>

    <div class="footer">
      GitHub: <a href="https://github.com/itskdhere/meet-tally" target="_blank" rel="noopener noreferrer">itskdhere/meet-tally</a>
    </div>
  </div>

  <script>
    async function setLed(color) {
      try {
        const response = await fetch(`/set?led=${color}`);
        if (response.ok) {
          const data = await response.json();
          updateUI(data.active);
        }
      } catch (err) {
        console.error("Error communicating with ESP8266:", err);
      }
    }

    function updateUI(state) {
      document.getElementById('bulb-red').classList.toggle('active', state === 'red');
      document.getElementById('bulb-blue').classList.toggle('active', state === 'blue');
      document.getElementById('bulb-green').classList.toggle('active', state === 'green');
    }

    async function fetchStatus() {
      try {
        const response = await fetch('/status');
        if (response.ok) {
          const data = await response.json();
          updateUI(data.active);
        }
      } catch (e) {
        console.log("Waiting for ESP8266 response...");
      }
    }

    window.addEventListener('DOMContentLoaded', fetchStatus);
  </script>
</body>
</html>
)rawliteral";
