const test = require("node:test");
const assert = require("node:assert/strict");

const {
  BUILTIN_AUDIO_CUE_IDS,
  createAppAudioSession,
} = require("../.test-dist/application/audio/audio-manager.js");
const {
  GameEventSoundPlayer,
  GAME_EVENT_SOUND,
} = require("../.test-dist/application/audio/game-event-sound.js");

test("game event sound facade queues the shared money and task result cues centrally", () => {
  let session = createAppAudioSession();
  session = GAME_EVENT_SOUND.playMoney(session);
  session = GAME_EVENT_SOUND.playTaskVictory(session);
  session = GAME_EVENT_SOUND.playTaskFailure(session);

  assert.ok(GAME_EVENT_SOUND instanceof GameEventSoundPlayer);
  assert.deepEqual(
    session.pendingCommands.map((command) => command.cueId),
    [
      BUILTIN_AUDIO_CUE_IDS.gameMoney,
      BUILTIN_AUDIO_CUE_IDS.gameTaskVictory,
      BUILTIN_AUDIO_CUE_IDS.gameTaskFailure,
    ]
  );
});
