const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("main audio playback delegates to the application audio seam instead of hand-rolled BGM helpers", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.match(source, /from "\.\/application\/audio\/audio-manager"/);
  assert.doesNotMatch(source, /function createBackgroundMusicPlayer/);
  assert.doesNotMatch(source, /function syncBackgroundMusic/);
  assert.doesNotMatch(source, /const OPENING_BGM_URL = /);
  assert.doesNotMatch(source, /const IN_GAME_BGM_URL = /);
});

test("application audio manager owns cue registry session output and controller seams", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/application/audio/audio-manager.ts"),
    "utf8"
  );

  assert.match(source, /export const BUILTIN_AUDIO_CUE_IDS = \{/);
  assert.match(source, /export function createAppAudioSession/);
  assert.match(source, /export function queueAppAudioCue/);
  assert.match(source, /export function createAppAudioOutput/);
  assert.match(source, /export function createAppAudioController/);
  assert.match(source, /export function resolveStoryBattleActionCueId/);
});

test("application audio manager registers shared jump and landing battle cues centrally", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/application/audio/audio-manager.ts"),
    "utf8"
  );

  assert.match(source, /battleJump: "battle\.jump"/);
  assert.match(source, /battleLanding: "battle\.landing"/);
  assert.match(source, /battleHorseRun: "battle\.horse\.run"/);
  assert.match(source, /assetPath: "audio\/battle\/jump\.mp3"/);
  assert.match(source, /assetPath: "audio\/battle\/landing\.mp3"/);
  assert.match(source, /assetPath: "audio\/battle\/horse-run\.mp3"/);
  assert.match(
    source,
    /id: BUILTIN_AUDIO_CUE_IDS\.battleHorseRun,[\s\S]*?defaultVolume: 0\.56,/
  );
});

test("application audio manager registers shared game event cues centrally", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/application/audio/audio-manager.ts"),
    "utf8"
  );

  assert.match(source, /gameMoney: "game\.money"/);
  assert.match(source, /gameTaskVictory: "game\.task\.victory"/);
  assert.match(source, /gameTaskFailure: "game\.task\.failure"/);
  assert.match(source, /assetPath: "audio\/game-events\/money\.mp3"/);
  assert.match(source, /assetPath: "audio\/game-events\/task-victory\.mp3"/);
  assert.match(source, /assetPath: "audio\/game-events\/task-failure\.mp3"/);
});

test("application audio manager registers shared pachinko launch cue centrally", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/application/audio/audio-manager.ts"),
    "utf8"
  );

  assert.match(source, /activityPachinkoLaunch: "activity\.pachinko\.launch"/);
  assert.match(source, /assetPath: "audio\/activity\/pachinko-launch\.mp3"/);
});

test("application audio manager registers shared pachinko collision bounce cues centrally", () => {
  const audioManagerSource = fs.readFileSync(
    path.join(process.cwd(), "src/application/audio/audio-manager.ts"),
    "utf8"
  );

  assert.match(
    audioManagerSource,
    /activityPachinkoBounce1: "activity\.pachinko\.bounce\.1"/
  );
  assert.match(
    audioManagerSource,
    /activityPachinkoBounce2: "activity\.pachinko\.bounce\.2"/
  );
  assert.match(
    audioManagerSource,
    /assetPath: "audio\/activity\/pachinko-bounce-1\.mp3"/
  );
  assert.match(
    audioManagerSource,
    /assetPath: "audio\/activity\/pachinko-bounce-2\.mp3"/
  );
  assert.match(
    audioManagerSource,
    /id: BUILTIN_AUDIO_CUE_IDS\.activityPachinkoBounce1,[\s\S]*?maxInstances: 10,/
  );
  assert.match(
    audioManagerSource,
    /id: BUILTIN_AUDIO_CUE_IDS\.activityPachinkoBounce2,[\s\S]*?maxInstances: 10,/
  );
  assert.match(
    audioManagerSource,
    /const PACHINKO_BOUNCE_PLAYBACK_VARIATION: AudioCuePlaybackVariation = \{/
  );
});

test("main resolves button audio assets through static mp3 URLs before legacy fallback", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.match(
    source,
    /import buttonLightAudioUrl from "\.\/assets\/audio\/ui\/button-light\.mp3\?url";/
  );
  assert.match(
    source,
    /import buttonHeavyAudioUrl from "\.\/assets\/audio\/ui\/button-heavy\.mp3\?url";/
  );
  assert.match(
    source,
    /"audio\/ui\/button-light\.mp3": buttonLightAudioUrl/
  );
  assert.match(
    source,
    /"audio\/ui\/button-heavy\.mp3": buttonHeavyAudioUrl/
  );
});

test("main resolves troop selection and troop mutation audio assets through static mp3 URLs before legacy fallback", () => {
  const mainSource = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );
  const audioManagerSource = fs.readFileSync(
    path.join(process.cwd(), "src/application/audio/audio-manager.ts"),
    "utf8"
  );

  assert.match(
    mainSource,
    /import troopSelectionAudioUrl from "\.\/assets\/audio\/ui\/troop-selection\.mp3\?url";/
  );
  assert.match(
    mainSource,
    /"audio\/ui\/troop-selection\.mp3": troopSelectionAudioUrl/
  );
  assert.match(
    audioManagerSource,
    /uiTroopSelection: "ui\.troop\.selection"/
  );
  assert.match(
    audioManagerSource,
    /assetPath: "audio\/ui\/troop-selection\.mp3"/
  );
  assert.match(
    mainSource,
    /import troopMutationAudioUrl from "\.\/assets\/audio\/ui\/troop-mutation\.mp3\?url";/
  );
  assert.match(
    mainSource,
    /"audio\/ui\/troop-mutation\.mp3": troopMutationAudioUrl/
  );
  assert.match(
    audioManagerSource,
    /uiTroopMutation: "ui\.troop\.mutation"/
  );
  assert.match(
    audioManagerSource,
    /assetPath: "audio\/ui\/troop-mutation\.mp3"/
  );
});

test("main resolves pachinko launch audio asset through static mp3 URL before legacy fallback", () => {
  const mainSource = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.match(
    mainSource,
    /import pachinkoLaunchAudioUrl from "\.\/assets\/audio\/activity\/pachinko-launch\.mp3\?url";/
  );
  assert.match(
    mainSource,
    /"audio\/activity\/pachinko-launch\.mp3": pachinkoLaunchAudioUrl/
  );
});

test("main resolves pachinko collision bounce audio assets through static mp3 URLs before legacy fallback", () => {
  const mainSource = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.match(
    mainSource,
    /import pachinkoBounce1AudioUrl from "\.\/assets\/audio\/activity\/pachinko-bounce-1\.mp3\?url";/
  );
  assert.match(
    mainSource,
    /import pachinkoBounce2AudioUrl from "\.\/assets\/audio\/activity\/pachinko-bounce-2\.mp3\?url";/
  );
  assert.match(
    mainSource,
    /"audio\/activity\/pachinko-bounce-1\.mp3": pachinkoBounce1AudioUrl/
  );
  assert.match(
    mainSource,
    /"audio\/activity\/pachinko-bounce-2\.mp3": pachinkoBounce2AudioUrl/
  );
});

test("main resolves battle audio assets through static mp3 URLs before legacy fallback", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.match(
    source,
    /import battleSlashHit1AudioUrl from "\.\/assets\/audio\/battle\/slash-hit-1\.mp3\?url";/
  );
  assert.match(
    source,
    /import battleSlashHit2AudioUrl from "\.\/assets\/audio\/battle\/slash-hit-2\.mp3\?url";/
  );
  assert.match(
    source,
    /import battleSlashHit3AudioUrl from "\.\/assets\/audio\/battle\/slash-hit-3\.mp3\?url";/
  );
  assert.match(
    source,
    /import battleSlashMissAudioUrl from "\.\/assets\/audio\/battle\/slash-miss\.mp3\?url";/
  );
  assert.match(
    source,
    /import battleBowDrawAudioUrl from "\.\/assets\/audio\/battle\/bow-draw\.mp3\?url";/
  );
  assert.match(
    source,
    /import battleArrowReleaseAudioUrl from "\.\/assets\/audio\/battle\/arrow-release\.mp3\?url";/
  );
  assert.match(
    source,
    /import battleJumpAudioUrl from "\.\/assets\/audio\/battle\/jump\.mp3\?url";/
  );
  assert.match(
    source,
    /import battleLandingAudioUrl from "\.\/assets\/audio\/battle\/landing\.mp3\?url";/
  );
  assert.match(
    source,
    /import battleHorseRunAudioUrl from "\.\/assets\/audio\/battle\/horse-run\.mp3\?url";/
  );
  assert.match(
    source,
    /import battleMusketeerReloadAudioUrl from "\.\/assets\/audio\/battle\/musketeer-reload\.mp3\?url";/
  );
  assert.match(
    source,
    /import battleMusketeerFireAudioUrl from "\.\/assets\/audio\/battle\/musketeer-fire\.mp3\?url";/
  );
  assert.match(
    source,
    /import battleImpactAudioUrl from "\.\/assets\/audio\/battle\/impact\.mp3\?url";/
  );
  assert.match(
    source,
    /"audio\/battle\/slash-hit-1\.mp3": battleSlashHit1AudioUrl/
  );
  assert.match(
    source,
    /"audio\/battle\/slash-hit-2\.mp3": battleSlashHit2AudioUrl/
  );
  assert.match(
    source,
    /"audio\/battle\/slash-hit-3\.mp3": battleSlashHit3AudioUrl/
  );
  assert.match(
    source,
    /"audio\/battle\/slash-miss\.mp3": battleSlashMissAudioUrl/
  );
  assert.match(
    source,
    /"audio\/battle\/bow-draw\.mp3": battleBowDrawAudioUrl/
  );
  assert.match(
    source,
    /"audio\/battle\/arrow-release\.mp3": battleArrowReleaseAudioUrl/
  );
  assert.match(
    source,
    /"audio\/battle\/jump\.mp3": battleJumpAudioUrl/
  );
  assert.match(
    source,
    /"audio\/battle\/landing\.mp3": battleLandingAudioUrl/
  );
  assert.match(
    source,
    /"audio\/battle\/horse-run\.mp3": battleHorseRunAudioUrl/
  );
  assert.match(
    source,
    /"audio\/battle\/musketeer-reload\.mp3": battleMusketeerReloadAudioUrl/
  );
  assert.match(
    source,
    /"audio\/battle\/musketeer-fire\.mp3": battleMusketeerFireAudioUrl/
  );
  assert.match(
    source,
    /"audio\/battle\/impact\.mp3": battleImpactAudioUrl/
  );
});

test("main resolves game event audio assets through static mp3 URLs before legacy fallback", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.match(
    source,
    /import gameMoneyAudioUrl from "\.\/assets\/audio\/game-events\/money\.mp3\?url";/
  );
  assert.match(
    source,
    /import taskVictoryAudioUrl from "\.\/assets\/audio\/game-events\/task-victory\.mp3\?url";/
  );
  assert.match(
    source,
    /import taskFailureAudioUrl from "\.\/assets\/audio\/game-events\/task-failure\.mp3\?url";/
  );
  assert.match(
    source,
    /"audio\/game-events\/money\.mp3": gameMoneyAudioUrl/
  );
  assert.match(
    source,
    /"audio\/game-events\/task-victory\.mp3": taskVictoryAudioUrl/
  );
  assert.match(
    source,
    /"audio\/game-events\/task-failure\.mp3": taskFailureAudioUrl/
  );
});

test("vite env types include mp3 url modules", () => {
  const viteEnv = fs.readFileSync(
    path.join(process.cwd(), "src/vite-env.d.ts"),
    "utf8"
  );

  assert.match(viteEnv, /declare module "\*\.mp3\?url"/);
});
