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
