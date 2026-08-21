#include "led_controller.h"
#include "config.h"

static LedState currentState = STATE_OFF;

void initLeds() {
  pinMode(PIN_RED, OUTPUT);
  pinMode(PIN_BLUE, OUTPUT);
  pinMode(PIN_GREEN, OUTPUT);
  applyLedState(STATE_OFF);
}

void applyLedState(LedState state) {
  currentState = state;

  bool redOn = (state == STATE_RED);
  bool blueOn = (state == STATE_BLUE);
  bool greenOn = (state == STATE_GREEN);

  uint8_t onLevel = LED_ACTIVE_HIGH ? HIGH : LOW;
  uint8_t offLevel = LED_ACTIVE_HIGH ? LOW : HIGH;

  digitalWrite(PIN_RED, redOn ? onLevel : offLevel);
  digitalWrite(PIN_BLUE, blueOn ? onLevel : offLevel);
  digitalWrite(PIN_GREEN, greenOn ? onLevel : offLevel);
}

void toggleLed(LedState state) {
  if (currentState == state) {
    applyLedState(STATE_OFF);
  } else {
    applyLedState(state);
  }
}

LedState getCurrentState() {
  return currentState;
}

String getStateString() {
  switch (currentState) {
    case STATE_RED: return "red";
    case STATE_BLUE: return "blue";
    case STATE_GREEN: return "green";
    default: return "off";
  }
}
