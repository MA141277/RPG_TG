const test = require("node:test");
const assert = require("node:assert/strict");

const {
  BUILTIN_AUDIO_CUE_IDS,
  createAppAudioSession,
} = require("../.test-dist/application/audio/audio-manager.js");
const {
  PachinkoLaunchSoundEffect,
  PACHINKO_LAUNCH_SOUND,
  resolvePachinkoLaunchSoundEffectById,
  resolvePachinkoLaunchSoundEffectFromTarget,
} = require("../.test-dist/application/audio/pachinko-launch-sound.js");

test("pachinko launch sound object queues the shared cue id", () => {
  let session = createAppAudioSession();
  session = PACHINKO_LAUNCH_SOUND.queue(session);

  assert.ok(PACHINKO_LAUNCH_SOUND instanceof PachinkoLaunchSoundEffect);
  assert.equal(
    PACHINKO_LAUNCH_SOUND.cueId,
    BUILTIN_AUDIO_CUE_IDS.activityPachinkoLaunch
  );
  assert.deepEqual(
    session.pendingCommands.map((command) => command.cueId),
    [BUILTIN_AUDIO_CUE_IDS.activityPachinkoLaunch]
  );
});

test("pachinko launch sound helpers resolve configured launch ids centrally", () => {
  assert.equal(
    resolvePachinkoLaunchSoundEffectById("launch"),
    PACHINKO_LAUNCH_SOUND
  );
  assert.equal(resolvePachinkoLaunchSoundEffectById("unknown"), null);

  const launchTarget = {
    closest(selector) {
      if (selector !== "[data-pachinko-sound]") {
        return null;
      }
      return {
        dataset: {
          pachinkoSound: "launch",
        },
      };
    },
  };
  const plainTarget = {
    closest() {
      return null;
    },
  };

  assert.equal(
    resolvePachinkoLaunchSoundEffectFromTarget(launchTarget),
    PACHINKO_LAUNCH_SOUND
  );
  assert.equal(resolvePachinkoLaunchSoundEffectFromTarget(plainTarget), null);
});
