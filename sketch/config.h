#pragma once
#include <Arduino.h>

// Wi-Fi (2.4 GHz) Configuration:
constexpr char WIFI_SSID[] = "YOUR_WIFI_SSID";
constexpr char WIFI_PASSWORD[] = "YOUR_WIFI_PASSWORD";

// Custom mDNS Hostname Configuration:
constexpr char HOSTNAME[] = "meet-tally";  // Accessible at http://meet-tally.local

// Hardware Pin Definitions:
#ifndef D1
#define D1 5   // D1 (GPIO5)
#define D2 4   // D2 (GPIO4)
#define D5 14  // D5 (GPIO14)
#define D6 12  // D6 (GPIO12)
#endif

constexpr uint8_t PIN_RED = D6;     // Red LED Pin: D6 (GPIO12) - Camera Only / Live
constexpr uint8_t PIN_YELLOW = D5;  // Yellow LED Pin: D5 (GPIO14) - Microphone Only / Live
constexpr uint8_t PIN_BLUE = D2;    // Blue LED Pin: D2 (GPIO4) - In Meeting (Idle)
constexpr uint8_t PIN_GREEN = D1;   // Green LED Pin: D1 (GPIO5) - Not in Meeting

// LED Logic:
// true = Active HIGH (Common Cathode)
// false = Active LOW (Common Anode / Relays)
constexpr bool LED_ACTIVE_HIGH = true;


// Web Server HTTP Port:
constexpr uint16_t SERVER_PORT = 80;
