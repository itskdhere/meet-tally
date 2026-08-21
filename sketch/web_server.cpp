#include "web_server.h"
#include "config.h"
#include "led_controller.h"
#include "index_html.h"
#include <ESP8266WebServer.h>

static ESP8266WebServer server(SERVER_PORT);

static void handleRoot() {
  server.send_P(200, "text/html", INDEX_HTML);
}

static void handleSet() {
  if (server.hasArg("led")) {
    String led = server.arg("led");
    led.toLowerCase();

    if (led == "red") toggleLed(STATE_RED);
    else if (led == "blue") toggleLed(STATE_BLUE);
    else if (led == "green") toggleLed(STATE_GREEN);
    else if (led == "off") applyLedState(STATE_OFF);
  }

  String json = "{\"active\":\"" + getStateString() + "\"}";
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", json);
}

static void handleStatus() {
  LedState state = getCurrentState();
  String json = "{\"active\":\"" + getStateString() + "\","
                                                      "\"red\":"
                + (state == STATE_RED ? "true" : "false") + ","
                                                            "\"blue\":"
                + (state == STATE_BLUE ? "true" : "false") + ","
                                                             "\"green\":"
                + (state == STATE_GREEN ? "true" : "false") + "}";
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", json);
}

static void handleNotFound() {
  server.send(404, "text/plain", "404: Not Found");
}

void initWebServer() {
  server.on("/", HTTP_GET, handleRoot);
  server.on("/set", HTTP_GET, handleSet);
  server.on("/status", HTTP_GET, handleStatus);
  server.onNotFound(handleNotFound);

  server.begin();
  Serial.println("HTTP server started. Ready for requests.");
}

void handleWebServerClient() {
  server.handleClient();
}
