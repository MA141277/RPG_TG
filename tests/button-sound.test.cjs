const test = require("node:test");
const assert = require("node:assert/strict");

const {
  BUILTIN_AUDIO_CUE_IDS,
  createAppAudioSession,
} = require("../.test-dist/application/audio/audio-manager.js");
const {
  ButtonSoundEffect,
  LIGHT_BUTTON_SOUND,
  HEAVY_BUTTON_SOUND,
  resolveButtonSoundEffectByTone,
  resolveButtonSoundEffectFromTarget,
  resolveButtonHoverSoundEffectFromTarget,
  resolveUiClickCueIdFromTarget,
} = require("../.test-dist/application/audio/button-sound.js");

test("light and heavy button sound objects queue their shared cue ids", () => {
  let session = createAppAudioSession();
  session = LIGHT_BUTTON_SOUND.queue(session);
  session = HEAVY_BUTTON_SOUND.queue(session);

  assert.ok(LIGHT_BUTTON_SOUND instanceof ButtonSoundEffect);
  assert.ok(HEAVY_BUTTON_SOUND instanceof ButtonSoundEffect);
  assert.equal(LIGHT_BUTTON_SOUND.cueId, BUILTIN_AUDIO_CUE_IDS.uiButtonLight);
  assert.equal(HEAVY_BUTTON_SOUND.cueId, BUILTIN_AUDIO_CUE_IDS.uiButtonHeavy);
  assert.deepEqual(
    session.pendingCommands.map((command) => command.cueId),
    [BUILTIN_AUDIO_CUE_IDS.uiButtonLight, BUILTIN_AUDIO_CUE_IDS.uiButtonHeavy]
  );
});

test("button sound helpers resolve configured light and heavy tones centrally", () => {
  assert.equal(resolveButtonSoundEffectByTone("light"), LIGHT_BUTTON_SOUND);
  assert.equal(resolveButtonSoundEffectByTone("heavy"), HEAVY_BUTTON_SOUND);
  assert.equal(resolveButtonSoundEffectByTone("unknown"), null);

  const lightTarget = {
    closest(selector) {
      if (selector !== "[data-button-sound]") {
        return null;
      }
      return {
        dataset: {
          buttonSound: "light",
        },
      };
    },
  };
  const heavyTarget = {
    closest(selector) {
      if (selector !== "[data-button-sound]") {
        return null;
      }
      return {
        dataset: {
          buttonSound: "heavy",
        },
      };
    },
  };
  const plainTarget = {
    closest() {
      return null;
    },
  };

  assert.equal(resolveButtonSoundEffectFromTarget(lightTarget), LIGHT_BUTTON_SOUND);
  assert.equal(resolveButtonSoundEffectFromTarget(heavyTarget), HEAVY_BUTTON_SOUND);
  assert.equal(resolveButtonSoundEffectFromTarget(plainTarget), null);
  assert.equal(resolveButtonHoverSoundEffectFromTarget(lightTarget), null);
});

test("button sound hover helper resolves configured hover tones centrally", () => {
  const hoverTarget = {
    closest(selector) {
      if (selector !== "[data-button-hover-sound]") {
        return null;
      }
      return {
        dataset: {
          buttonHoverSound: "light",
        },
      };
    },
  };
  const plainTarget = {
    closest() {
      return null;
    },
  };

  assert.equal(resolveButtonHoverSoundEffectFromTarget(hoverTarget), LIGHT_BUTTON_SOUND);
  assert.equal(resolveButtonHoverSoundEffectFromTarget(plainTarget), null);
});

test("ui click cue helper prioritizes enter then button tones before generic fallback", () => {
  const pachinkoTarget = {
    closest(selector) {
      if (selector === "[data-pachinko-sound]") {
        return {
          dataset: {
            pachinkoSound: "launch",
          },
        };
      }
      if (selector === "[data-enter-sound]") {
        return {
          dataset: {
            enterSound: "enter",
          },
        };
      }
      if (selector === "[data-button-sound]") {
        return {
          dataset: {
            buttonSound: "heavy",
          },
        };
      }
      return null;
    },
  };
  const enterTarget = {
    closest(selector) {
      if (selector === "[data-enter-sound]") {
        return {
          dataset: {
            enterSound: "enter",
          },
        };
      }
      if (selector === "[data-button-sound]") {
        return {
          dataset: {
            buttonSound: "heavy",
          },
        };
      }
      return null;
    },
  };
  const buttonTarget = {
    closest(selector) {
      if (selector === "[data-enter-sound]") {
        return null;
      }
      if (selector === "[data-button-sound]") {
        return {
          dataset: {
            buttonSound: "heavy",
          },
        };
      }
      return null;
    },
  };
  const plainTarget = {
    closest() {
      return null;
    },
  };
  const silentTarget = {
    closest(selector) {
      if (selector === "[data-ui-click-sound]") {
        return {
          dataset: {
            uiClickSound: "none",
          },
        };
      }
      return null;
    },
  };

  assert.equal(
    resolveUiClickCueIdFromTarget({
      target: pachinkoTarget,
      allowFallbackUiClick: true,
    }),
    BUILTIN_AUDIO_CUE_IDS.activityPachinkoLaunch
  );
  assert.equal(
    resolveUiClickCueIdFromTarget({
      target: enterTarget,
      allowFallbackUiClick: true,
    }),
    BUILTIN_AUDIO_CUE_IDS.uiEnter
  );
  assert.equal(
    resolveUiClickCueIdFromTarget({
      target: buttonTarget,
      allowFallbackUiClick: true,
    }),
    BUILTIN_AUDIO_CUE_IDS.uiButtonHeavy
  );
  assert.equal(
    resolveUiClickCueIdFromTarget({
      target: plainTarget,
      allowFallbackUiClick: true,
    }),
    BUILTIN_AUDIO_CUE_IDS.uiClick
  );
  assert.equal(
    resolveUiClickCueIdFromTarget({
      target: plainTarget,
      allowFallbackUiClick: false,
    }),
    null
  );
  assert.equal(
    resolveUiClickCueIdFromTarget({
      target: silentTarget,
      allowFallbackUiClick: true,
    }),
    null
  );
});
