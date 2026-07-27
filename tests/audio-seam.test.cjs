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

test("vite env types include mp3 url modules", () => {
  const viteEnv = fs.readFileSync(
    path.join(process.cwd(), "src/vite-env.d.ts"),
    "utf8"
  );

  assert.match(viteEnv, /declare module "\*\.mp3\?url"/);
});
