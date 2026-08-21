#include "web_server.h"
#include "config.h"
#include "led_controller.h"
#include "index_html.h"
#include <ESP8266WebServer.h>
#include <ESP8266WiFi.h>

static ESP8266WebServer server(SERVER_PORT);

static void sendCORS() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "*");
}

static void handleOptions() {
  sendCORS();
  server.send(204);
}

static void handleRoot() {
  server.send_P(200, "text/html", INDEX_HTML);
}

static void handleSet() {
  sendCORS();
  String led = "";
  if (server.hasArg("led")) {
    led = server.arg("led");
  } else if (server.hasArg("color")) {
    led = server.arg("color");
  }

  bool isToggle = server.hasArg("toggle") && (server.arg("toggle") == "1" || server.arg("toggle") == "true");

  if (led.length() > 0) {
    led.toLowerCase();
    if (led == "red") {
      if (isToggle) toggleLed(STATE_RED);
      else applyLedState(STATE_RED);
    } else if (led == "blue") {
      if (isToggle) toggleLed(STATE_BLUE);
      else applyLedState(STATE_BLUE);
    } else if (led == "green") {
      if (isToggle) toggleLed(STATE_GREEN);
      else applyLedState(STATE_GREEN);
    } else if (led == "off") {
      applyLedState(STATE_OFF);
    }
  }

  LedState state = getCurrentState();
  String json = "{\"success\":true,\"active\":\"" + getStateString() + "\","
                                                                       "\"red\":"
                + (state == STATE_RED ? "true" : "false") + ","
                                                            "\"blue\":"
                + (state == STATE_BLUE ? "true" : "false") + ","
                                                             "\"green\":"
                + (state == STATE_GREEN ? "true" : "false") + "}";
  server.send(200, "application/json", json);
}

static void handleStatus() {
  sendCORS();

  if (server.hasArg("led") || server.hasArg("color")) {
    String led = server.hasArg("led") ? server.arg("led") : server.arg("color");
    led.toLowerCase();
    if (led == "red") applyLedState(STATE_RED);
    else if (led == "blue") applyLedState(STATE_BLUE);
    else if (led == "green") applyLedState(STATE_GREEN);
    else if (led == "off") applyLedState(STATE_OFF);
  } else if (server.hasArg("mic") || server.hasArg("cam")) {
    bool mic = server.hasArg("mic") && (server.arg("mic") == "1" || server.arg("mic") == "true");
    bool cam = server.hasArg("cam") && (server.arg("cam") == "1" || server.arg("cam") == "true");

    if (cam) {
      applyLedState(STATE_RED);
    } else if (mic) {
      applyLedState(STATE_BLUE);
    } else {
      applyLedState(STATE_GREEN);
    }
  }

  LedState state = getCurrentState();
  String json = "{\"active\":\"" + getStateString() + "\","
                                                      "\"red\":"
                + (state == STATE_RED ? "true" : "false") + ","
                                                            "\"blue\":"
                + (state == STATE_BLUE ? "true" : "false") + ","
                                                             "\"green\":"
                + (state == STATE_GREEN ? "true" : "false") + ","
                                                              "\"ip\":\""
                + WiFi.localIP().toString() + "\","
                                              "\"uptimeSeconds\":"
                + String(millis() / 1000) + "}";
  server.send(200, "application/json", json);
}

static void handleHeartbeat() {
  sendCORS();
  server.send(200, "text/plain", "PONG");
}

static void handleApiState() {
  handleStatus();
}

static void handleNotFound() {
  sendCORS();
  server.send(404, "text/plain", "404: Not Found");
}

void initWebServer() {
  server.on("/", HTTP_GET, handleRoot);
  server.on("/set", HTTP_GET, handleSet);
  server.on("/set", HTTP_OPTIONS, handleOptions);
  server.on("/status", HTTP_GET, handleStatus);
  server.on("/status", HTTP_OPTIONS, handleOptions);
  server.on("/heartbeat", HTTP_GET, handleHeartbeat);
  server.on("/heartbeat", HTTP_OPTIONS, handleOptions);
  server.on("/api/state", HTTP_GET, handleApiState);
  server.on("/api/state", HTTP_OPTIONS, handleOptions);
  server.onNotFound(handleNotFound);

  server.begin();
  Serial.println("HTTP server started. Ready for requests.");
}

void handleWebServerClient() {
  server.handleClient();
}
