const test = require("node:test");
const assert = require("node:assert/strict");

const {
  BUILTIN_AUDIO_CUE_IDS,
} = require("../.test-dist/application/audio/audio-manager.js");
const {
  PachinkoCollisionSoundEffect,
  PACHINKO_COLLISION_SOUND,
} = require("../.test-dist/application/audio/pachinko-collision-sound.js");

test("pachinko collision sound chooses only from the two registered bounce cues", () => {
  const played = [];
  const target = {
    playCue(cueId) {
      played.push(cueId);
    },
  };

  const firstCueId = PACHINKO_COLLISION_SOUND.play(target, () => 0);
  const secondCueId = PACHINKO_COLLISION_SOUND.play(target, () => 0.999);

  assert.ok(PACHINKO_COLLISION_SOUND instanceof PachinkoCollisionSoundEffect);
  assert.deepEqual(PACHINKO_COLLISION_SOUND.cueIds, [
    BUILTIN_AUDIO_CUE_IDS.activityPachinkoBounce1,
    BUILTIN_AUDIO_CUE_IDS.activityPachinkoBounce2,
  ]);
  assert.equal(firstCueId, BUILTIN_AUDIO_CUE_IDS.activityPachinkoBounce1);
  assert.equal(secondCueId, BUILTIN_AUDIO_CUE_IDS.activityPachinkoBounce2);
  assert.deepEqual(played, [firstCueId, secondCueId]);
});
