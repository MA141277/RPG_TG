const test = require("node:test");
const assert = require("node:assert/strict");

const {
  BUILTIN_AUDIO_CUE_IDS,
  createAppAudioSession,
} = require("../.test-dist/application/audio/audio-manager.js");
const {
  EnterSoundEffect,
  ENTER_SOUND,
  resolveEnterSoundEffectById,
  resolveEnterSoundEffectFromTarget,
} = require("../.test-dist/application/audio/enter-sound.js");

test("shared enter sound object queues the built-in enter cue id", () => {
  let session = createAppAudioSession();
  session = ENTER_SOUND.queue(session);

  assert.ok(ENTER_SOUND instanceof EnterSoundEffect);
  assert.equal(ENTER_SOUND.cueId, BUILTIN_AUDIO_CUE_IDS.uiEnter);
  assert.deepEqual(
    session.pendingCommands.map((command) => command.cueId),
    [BUILTIN_AUDIO_CUE_IDS.uiEnter]
  );
});

test("enter sound helpers resolve configured enter ids centrally", () => {
  assert.equal(resolveEnterSoundEffectById("enter"), ENTER_SOUND);
  assert.equal(resolveEnterSoundEffectById("unknown"), null);

  const enterTarget = {
    closest(selector) {
      if (selector !== "[data-enter-sound]") {
        return null;
      }
      return {
        dataset: {
          enterSound: "enter",
        },
      };
    },
  };
  const plainTarget = {
    closest() {
      return null;
    },
  };

  assert.equal(resolveEnterSoundEffectFromTarget(enterTarget), ENTER_SOUND);
  assert.equal(resolveEnterSoundEffectFromTarget(plainTarget), null);
});
