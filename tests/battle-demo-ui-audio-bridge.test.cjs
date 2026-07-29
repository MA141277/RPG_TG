const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const {
  BUILTIN_AUDIO_CUE_IDS,
} = require("../.test-dist/application/audio/audio-manager.js");
const {
  resolveBattleDemoCueId,
} = require("../.test-dist/application/audio/battle-sound.js");

function extractFunctionBody(source, signature) {
  const start = source.indexOf(signature);
  if (start === -1) {
    throw new Error(`Missing signature: ${signature}`);
  }
  const bodyStart = source.indexOf("{", start + signature.length);
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

function readBattleSources() {
  return {
    demoSource: fs.readFileSync("prototypes/battle-demo/index.html", "utf8"),
    previewSource: fs.readFileSync(
      "prototypes/troop-management-preview/index.html",
      "utf8",
    ),
  };
}

test("battle demo ui cue ids resolve into the shared button and troop selection sounds", () => {
  assert.equal(
    resolveBattleDemoCueId("troopSelection"),
    BUILTIN_AUDIO_CUE_IDS.uiTroopSelection,
  );
  assert.equal(
    resolveBattleDemoCueId("buttonLight"),
    BUILTIN_AUDIO_CUE_IDS.uiButtonLight,
  );
  assert.equal(
    resolveBattleDemoCueId("buttonHeavy"),
    BUILTIN_AUDIO_CUE_IDS.uiButtonHeavy,
  );
});

test("battle demo and troop preview share the same ui audio helper and click-flow audio hooks", () => {
  const { demoSource, previewSource } = readBattleSources();

  [
    "function playBattleDemoUiCue(cueId)",
    "function playBattleDemoMusicCue(cueId)",
    "function selectPlayerUnit(unit)",
    "async function onCellClick(x, y)",
  ].forEach((signature) => {
    assert.equal(
      extractFunctionBody(previewSource, signature).replace(/\s+/g, ""),
      extractFunctionBody(demoSource, signature).replace(/\s+/g, ""),
    );
  });
});

test("battle demo plays troop selection on controllable unit selection and legal move clicks", () => {
  const { demoSource } = readBattleSources();
  const selectPlayerUnitBody = extractFunctionBody(
    demoSource,
    "function selectPlayerUnit(unit)",
  );
  const onCellClickBody = extractFunctionBody(
    demoSource,
    "async function onCellClick(x, y)",
  );

  assert.match(selectPlayerUnitBody, /playBattleDemoUiCue\('troopSelection'\);/);
  assert.match(
    onCellClickBody,
    /else if \(reachable\.some\(c => c\.x === x && c\.y === y\)\) \{[\s\S]*?playBattleDemoUiCue\('troopSelection'\);[\s\S]*?applyMove\(selectedUnit, x, y\);/,
  );
  assert.match(
    onCellClickBody,
    /if \(clicked\?\.side === 'enemy' && attackable\.some\(u => u\.id === clicked\.id\)\) \{[\s\S]*?playBattleDemoUiCue\('buttonHeavy'\);[\s\S]*?await resolveAttack\(selectedUnit, clicked\);/,
  );
});

test("battle demo and troop preview share the same battle music bridge hooks for valid start and victory", () => {
  const { demoSource, previewSource } = readBattleSources();

  [
    "function startBattle()",
    "function showOverlay(title, desc, isWin = false)",
    "function scheduleBattleDemoLocalBgmLoop(audio, token, delayMs)",
  ].forEach((signature) => {
    assert.equal(
      extractFunctionBody(previewSource, signature).replace(/\s+/g, ""),
      extractFunctionBody(demoSource, signature).replace(/\s+/g, ""),
    );
  });
});

test("battle demo only starts battle music after a valid deployment and switches to victory music at the win overlay", () => {
  const { demoSource } = readBattleSources();
  const startBattleBody = extractFunctionBody(
    demoSource,
    "function startBattle()",
  );
  const showOverlayBody = extractFunctionBody(
    demoSource,
    "function showOverlay(title, desc, isWin = false)",
  );

  assert.match(
    startBattleBody,
    /if \(!units\.some\(u => u\.side === 'player' && u\.x >= 0\)\) \{[\s\S]*?return;[\s\S]*?if \(isAssassinationBattle\(\)\) \{[\s\S]*?return;[\s\S]*?\}[\s\S]*?playBattleDemoMusicCue\('battleMusicStart'\);[\s\S]*?showObjectiveIntro\(\);/,
  );
  assert.match(
    showOverlayBody,
    /if \(isWin\) \{[\s\S]*?playBattleDemoMusicCue\('battleMusicVictory'\);[\s\S]*?\}/,
  );
});

test("battle demo local battle music fallback applies a 200ms fade-out and fade-in around the loop jump", () => {
  const { demoSource } = readBattleSources();
  const scheduleBattleDemoLocalBgmLoopBody = extractFunctionBody(
    demoSource,
    "function scheduleBattleDemoLocalBgmLoop(audio, token, delayMs)",
  );

  assert.match(
    scheduleBattleDemoLocalBgmLoopBody,
    /const fadeDurationMs = 200;/,
  );
  assert.match(
    scheduleBattleDemoLocalBgmLoopBody,
    /const loopDurationMs = 74000;/,
  );
  assert.match(
    scheduleBattleDemoLocalBgmLoopBody,
    /const fadeSteps = 4;/,
  );
  assert.match(
    scheduleBattleDemoLocalBgmLoopBody,
    /const nextDelayMs = delayMs > fadeDurationMs \? delayMs - fadeDurationMs : 10;/,
  );
  assert.match(
    scheduleBattleDemoLocalBgmLoopBody,
    /window\.setTimeout\(\(\) => \{[\s\S]*?audio\.volume = Math\.max\(0, startVolume \* \(1 - step \/ fadeSteps\)\);[\s\S]*?\}, delayMsOut\);/,
  );
  assert.match(
    scheduleBattleDemoLocalBgmLoopBody,
    /audio\.currentTime = 18;[\s\S]*?audio\.volume = 0;[\s\S]*?void audio\.play\(\)\.catch\(\(\) => \{\}\);/,
  );
  assert.match(
    scheduleBattleDemoLocalBgmLoopBody,
    /window\.setTimeout\(\(\) => \{[\s\S]*?audio\.volume = Math\.min\(startVolume, startVolume \* \(step \/ fadeSteps\)\);[\s\S]*?\}, delayMsIn\);/,
  );
  assert.match(
    scheduleBattleDemoLocalBgmLoopBody,
    /scheduleBattleDemoLocalBgmLoop\(audio, token, loopDurationMs \+ fadeDurationMs\);/,
  );
});

test("battle demo command buttons emit the agreed selection heavy and light cues", () => {
  const { demoSource } = readBattleSources();

  assert.match(
    demoSource,
    /document\.getElementById\('btn-start'\)\.addEventListener\('click', \(\) => \{[\s\S]*?playBattleDemoUiCue\('buttonHeavy'\);[\s\S]*?startBattle\(\);[\s\S]*?\}\);/,
  );
  assert.match(
    demoSource,
    /document\.getElementById\('btn-objective-ok'\)\.addEventListener\('click', \(\) => \{[\s\S]*?playBattleDemoUiCue\('buttonHeavy'\);[\s\S]*?playBattleDemoMusicCue\('battleMusicStart'\);[\s\S]*?beginBattle\(\);[\s\S]*?\}\);/,
  );
  assert.match(
    demoSource,
    /document\.getElementById\('btn-end-turn'\)\.addEventListener\('click', async \(\) => \{[\s\S]*?if \(turn !== 'player'\) return;[\s\S]*?playBattleDemoUiCue\('buttonHeavy'\);/,
  );
  assert.match(
    demoSource,
    /document\.getElementById\('btn-wait'\)\.addEventListener\('click', \(\) => \{[\s\S]*?playBattleDemoUiCue\('troopSelection'\);[\s\S]*?waitSelectedUnit\(\);[\s\S]*?\}\);/,
  );
  assert.match(
    demoSource,
    /document\.getElementById\('action-wait'\)\.addEventListener\('click', \(\) => \{[\s\S]*?playBattleDemoUiCue\('troopSelection'\);[\s\S]*?waitSelectedUnit\(\);[\s\S]*?\}\);/,
  );
  assert.match(
    demoSource,
    /document\.getElementById\('action-rally'\)\.addEventListener\('click', \(\) => \{[\s\S]*?playBattleDemoUiCue\('troopSelection'\);[\s\S]*?rallySelectedUnit\(\);[\s\S]*?\}\);/,
  );
  assert.match(
    demoSource,
    /document\.getElementById\('action-attack'\)\.addEventListener\('click', \(\) => \{[\s\S]*?playBattleDemoUiCue\('troopSelection'\);[\s\S]*?mode = 'target-attack';/,
  );
  assert.match(
    demoSource,
    /document\.getElementById\('action-cancel'\)\.addEventListener\('click', \(\) => \{[\s\S]*?playBattleDemoUiCue\('troopSelection'\);[\s\S]*?undoPendingMove\(\);[\s\S]*?\}\);/,
  );
  assert.match(
    demoSource,
    /document\.getElementById\('battle-close'\)\.addEventListener\('click', \(\) => \{[\s\S]*?playBattleDemoUiCue\('buttonLight'\);[\s\S]*?closeFormationBattleOverlay\(\);[\s\S]*?\}\);/,
  );
});
