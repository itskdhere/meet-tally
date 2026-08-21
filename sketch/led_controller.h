#pragma once
#include <Arduino.h>

enum LedState {
  STATE_OFF,
  STATE_RED,
  STATE_BLUE,
  STATE_GREEN
};

void initLeds();

void applyLedState(LedState state);

void toggleLed(LedState state);

LedState getCurrentState();

String getStateString();
