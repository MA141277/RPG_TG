const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

function extractFunctionBody(source, signature) {
  const start = source.indexOf(signature);
  if (start === -1) {
    throw new Error(`Missing signature: ${signature}`);
  }
  const bodyStart = source.indexOf("{", start);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(bodyStart + 1, index);
      }
    }
  }
  throw new Error(`Unclosed function body for: ${signature}`);
}

function loadBattleDemoAudioBridgeFns() {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const chainIdBody = extractFunctionBody(
    source,
    "function createBattleDemoArcherAudioChainId(step)",
  );
  const cavalryChainIdBody = extractFunctionBody(
    source,
    "function createBattleDemoCavalryAudioChainId(step)",
  );
  const createBattleDemoArcherAudioChainId = new Function(
    `return function createBattleDemoArcherAudioChainId(step) {${chainIdBody}};`,
  )();
  const createBattleDemoCavalryAudioChainId = new Function(
    `return function createBattleDemoCavalryAudioChainId(step) {${cavalryChainIdBody}};`,
  )();
  return { source, createBattleDemoArcherAudioChainId, createBattleDemoCavalryAudioChainId };
}

test("battle-demo archer audio chain ids stay stable per strike source and launch time", () => {
  const { createBattleDemoArcherAudioChainId } = loadBattleDemoAudioBridgeFns();
  assert.equal(
    createBattleDemoArcherAudioChainId({
      sourceSide: "player",
      sourceSlotKey: "rear-center",
      launchAtMs: 120,
    }),
    "player:rear-center:120",
  );
});

test("battle-demo cavalry run audio chain ids stay stable per strike source and launch time", () => {
  const { createBattleDemoCavalryAudioChainId } = loadBattleDemoAudioBridgeFns();
  assert.equal(
    createBattleDemoCavalryAudioChainId({
      sourceSide: "player",
      sourceSlotKey: "front-left",
      launchAtMs: 120,
    }),
    "player:front-left:120:cavalry-run",
  );
});

test("battle-demo archer strikes emit draw release and hit-only impact bridge messages at the approved frame thresholds", () => {
  const { source } = loadBattleDemoAudioBridgeFns();
  assert.match(source, /function postBattleDemoAudioMessage\(message\)/);
  assert.match(source, /type:\s*['"]rpg-tg:battle-demo-audio['"]/);
  assert.match(source, /if\s*\(!archerDrawAudioTriggered\s*&&\s*info\.actionFrame\s*>=\s*18\)/);
  assert.match(source, /phase:\s*['"]draw['"],\s*mode:\s*['"]play['"]/);
  assert.match(source, /if\s*\(!archerReleaseAudioTriggered\s*&&\s*info\.actionFrame\s*>=\s*37\)/);
  assert.match(source, /phase:\s*['"]release['"],\s*mode:\s*['"]transition['"]/);
  assert.match(source, /fadeFrames:\s*4/);
  assert.match(source, /nextStartFrame:\s*41/);
  assert.match(source, /if\s*\(step\.hit\s*&&\s*!archerImpactAudioTriggered\s*&&\s*info\.actionFrame\s*>=\s*41\)/);
  assert.match(source, /phase:\s*['"]impact['"],\s*mode:\s*['"]transition['"]/);
  assert.match(source, /nextStartFrame:\s*42/);
});

test("battle-demo archer impact frame resolves at frame 42 for strike and active hit effects", () => {
  const { source } = loadBattleDemoAudioBridgeFns();
  assert.match(source, /troopType === 'archer' \? 42 : 14/);
  assert.match(source, /impactFrame:\s*42,/);
  assert.match(source, /stage1:\s*\{[\s\S]*frame:\s*42,/);
});

test("main validates battle-demo audio messages and forwards them into the shared audio bridge", () => {
  const mainSource = fs.readFileSync("src/main.ts", "utf8");
  assert.match(mainSource, /type BattleDemoAudioMessage = \{/);
  assert.match(mainSource, /type:\s*["']rpg-tg:battle-demo-audio["']/);
  assert.match(mainSource, /phase\?: "draw" \| "release" \| "reload" \| "fire" \| "impact" \| "horse-run";/);
  assert.match(mainSource, /mode\?: "play" \| "transition" \| "stop";/);
  assert.match(mainSource, /function handleBattleDemoAudioMessage\(message: unknown\): void \{/);
  assert.match(mainSource, /audioMessage\.phase !== "horse-run"/);
  assert.match(mainSource, /audioMessage\.mode !== "stop"/);
  assert.match(mainSource, /appAudioController\.playBattleDemoBridgeMessage\(/);
  assert.match(mainSource, /window\.addEventListener\("message", \(event\) => \{[\s\S]*handleBattleDemoAudioMessage\(event\.data\);/);
});

test("main also routes embedded melee cue messages into direct shared battle cue playback", () => {
  const mainSource = fs.readFileSync("src/main.ts", "utf8");
  assert.match(mainSource, /cueId\?: string;/);
  assert.match(mainSource, /resolveBattleDemoCueId\(/);
  assert.match(
    mainSource,
    /const resolvedBattleDemoCueId = resolveBattleDemoCueId\(audioMessage\.cueId\);[\s\S]*?if\s*\(resolvedBattleDemoCueId != null\)\s*\{[\s\S]*?appAudioController\.playCue\(resolvedBattleDemoCueId\);[\s\S]*?return;[\s\S]*?\}/,
  );
});

test("main routes embedded battle music bridge messages into the shared BGM override and victory fade handlers", () => {
  const mainSource = fs.readFileSync("src/main.ts", "utf8");
  assert.match(mainSource, /resolveBattleDemoMusicCommand\(/);
  assert.match(
    mainSource,
    /const resolvedBattleDemoMusicCommand = resolveBattleDemoMusicCommand\([\s\S]*?audioMessage\.cueId[\s\S]*?\);[\s\S]*?if \(resolvedBattleDemoMusicCommand\?\.kind === "start-bgm"\) \{[\s\S]*?appAudioController\.setBgmOverrideCue\(resolvedBattleDemoMusicCommand\.cueId\);[\s\S]*?return;[\s\S]*?\}/,
  );
  assert.match(
    mainSource,
    /if \(resolvedBattleDemoMusicCommand\?\.kind === "play-victory"\) \{[\s\S]*?appAudioController\.playCueWithBgmSuppressed\([\s\S]*?resolvedBattleDemoMusicCommand\.cueId,[\s\S]*?fadeOutMs: resolvedBattleDemoMusicCommand\.fadeOutMs,[\s\S]*?\);[\s\S]*?return;[\s\S]*?\}/,
  );
});

test("embedded battle-demo victory completion keeps the runtime transition but skips the legacy duplicate victory cue queue", () => {
  const mainSource = fs.readFileSync("src/main.ts", "utf8");
  assert.match(
    mainSource,
    /dispatchCurrentStoryBattleAction\("embedded-victory", \{ queueAudio: false \}\);/,
  );
});
