#pragma once
#include <Arduino.h>

enum LedState {
  STATE_OFF,
  STATE_RED,
  STATE_YELLOW,
  STATE_BLUE,
  STATE_GREEN,
  STATE_LIVE
};

void initLeds();

void applyLedState(LedState state);

LedState getCurrentState();

String getStateString();
