#include "wifi_manager.h"
#include "config.h"
#include <ESP8266WiFi.h>
#include <ESP8266mDNS.h>

void initWiFi() {
  Serial.print("Connecting to Wi-Fi: ");
  Serial.println(WIFI_SSID);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("Wi-Fi connected successfully!");
    Serial.print("IP Address: http://");
    Serial.println(WiFi.localIP());

    if (MDNS.begin(HOSTNAME)) {
      Serial.print("mDNS responder started: http://");
      Serial.print(HOSTNAME);
      Serial.println(".local");
    }
  } else {
    Serial.println("Wi-Fi Connection Failed. Launching SoftAP mode...");
    WiFi.mode(WIFI_AP);
    WiFi.softAP("Meet Tally", "0123456789");
    Serial.print("AP IP Address: http://");
    Serial.println(WiFi.softAPIP());
  }
}

void updateMDNS() {
  MDNS.update();
}
