#include <Arduino.h>
#include "config.h"
#include "led_controller.h"
#include "wifi_manager.h"
#include "web_server.h"

void setup() {
  Serial.begin(115200);
  delay(100);
  Serial.println("\n--- Meet Tally Starting ---");

  initLeds();
  initWiFi();
  initWebServer();
}

void loop() {
  updateMDNS();
  handleWebServerClient();
}
