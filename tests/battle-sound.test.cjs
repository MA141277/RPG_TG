const test = require("node:test");
const assert = require("node:assert/strict");

const {
  BUILTIN_AUDIO_CUE_IDS,
  createAppAudioSession,
} = require("../.test-dist/application/audio/audio-manager.js");
const {
  BattleSoundPlayer,
  BATTLE_SOUND,
  resolveBattleDemoCueId,
  resolveBattleDemoMusicCommand,
} = require("../.test-dist/application/audio/battle-sound.js");

test("battle sound facade queues all shared battle cues centrally", () => {
  let session = createAppAudioSession();
  session = BATTLE_SOUND.playSlashHit1(session);
  session = BATTLE_SOUND.playSlashHit2(session);
  session = BATTLE_SOUND.playSlashHit3(session);
  session = BATTLE_SOUND.playSlashMiss(session);
  session = BATTLE_SOUND.playHorseRun(session);
  session = BATTLE_SOUND.playBowDraw(session);
  session = BATTLE_SOUND.playArrowRelease(session);
  session = BATTLE_SOUND.playJump(session);
  session = BATTLE_SOUND.playLanding(session);
  session = BATTLE_SOUND.playImpact(session);

  assert.ok(BATTLE_SOUND instanceof BattleSoundPlayer);
  assert.deepEqual(
    session.pendingCommands.map((command) => command.cueId),
    [
      BUILTIN_AUDIO_CUE_IDS.battleSlashHit1,
      BUILTIN_AUDIO_CUE_IDS.battleSlashHit2,
      BUILTIN_AUDIO_CUE_IDS.battleSlashHit3,
      BUILTIN_AUDIO_CUE_IDS.battleSlashMiss,
      BUILTIN_AUDIO_CUE_IDS.battleHorseRun,
      BUILTIN_AUDIO_CUE_IDS.battleBowDraw,
      BUILTIN_AUDIO_CUE_IDS.battleArrowRelease,
      BUILTIN_AUDIO_CUE_IDS.battleJump,
      BUILTIN_AUDIO_CUE_IDS.battleLanding,
      BUILTIN_AUDIO_CUE_IDS.battleImpactHit,
    ]
  );
});

test("battle sound facade resolves embedded melee cue ids into shared battle cue ids", () => {
  assert.equal(resolveBattleDemoCueId("slashHit1"), BUILTIN_AUDIO_CUE_IDS.battleSlashHit1);
  assert.equal(resolveBattleDemoCueId("slashHit2"), BUILTIN_AUDIO_CUE_IDS.battleSlashHit2);
  assert.equal(resolveBattleDemoCueId("slashHit3"), BUILTIN_AUDIO_CUE_IDS.battleSlashHit3);
  assert.equal(resolveBattleDemoCueId("slashMiss"), BUILTIN_AUDIO_CUE_IDS.battleSlashMiss);
  assert.equal(resolveBattleDemoCueId("horseRun"), BUILTIN_AUDIO_CUE_IDS.battleHorseRun);
  assert.equal(resolveBattleDemoCueId("jump"), BUILTIN_AUDIO_CUE_IDS.battleJump);
  assert.equal(resolveBattleDemoCueId("landing"), BUILTIN_AUDIO_CUE_IDS.battleLanding);
  assert.equal(resolveBattleDemoCueId("missing"), null);
});

test("battle sound facade resolves embedded battle music bridge cue ids into centralized battle music commands", () => {
  assert.deepEqual(resolveBattleDemoMusicCommand("battleMusicStart"), {
    kind: "start-bgm",
    cueId: BUILTIN_AUDIO_CUE_IDS.bgmBattle,
  });
  assert.deepEqual(resolveBattleDemoMusicCommand("battleMusicVictory"), {
    kind: "play-victory",
    cueId: BUILTIN_AUDIO_CUE_IDS.battleVictory,
    fadeOutMs: 200,
  });
  assert.equal(resolveBattleDemoMusicCommand("missing"), null);
});
