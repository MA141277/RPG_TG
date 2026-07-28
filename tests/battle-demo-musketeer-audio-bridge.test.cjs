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

function loadBattleDemoMusketeerAudioBridgeFns() {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const chainIdBody = extractFunctionBody(
    source,
    "function createBattleDemoMusketeerAudioChainId(step)",
  );
  const createBattleDemoMusketeerAudioChainId = new Function(
    `return function createBattleDemoMusketeerAudioChainId(step) {${chainIdBody}};`,
  )();
  return { source, createBattleDemoMusketeerAudioChainId };
}

test("battle-demo musketeer audio chain ids stay stable per strike source and launch time", () => {
  const { createBattleDemoMusketeerAudioChainId } =
    loadBattleDemoMusketeerAudioBridgeFns();
  assert.equal(
    createBattleDemoMusketeerAudioChainId({
      sourceSide: "player",
      sourceSlotKey: "middle-right",
      launchAtMs: 210,
    }),
    "player:middle-right:210",
  );
});

test("battle-demo musketeer strikes emit reload and fire bridge messages but never emit impact audio", () => {
  const { source } = loadBattleDemoMusketeerAudioBridgeFns();
  assert.match(
    source,
    /if\s*\(!musketeerReloadAudioTriggered\s*&&\s*info\.actionFrame\s*>=\s*9\)/,
  );
  assert.match(source, /phase:\s*['"]reload['"],\s*mode:\s*['"]play['"]/);
  assert.match(
    source,
    /if\s*\(!musketeerFireAudioTriggered\s*&&\s*info\.actionFrame\s*>=\s*26\)/,
  );
  assert.match(source, /phase:\s*['"]fire['"],\s*mode:\s*['"]transition['"]/);
  assert.match(source, /fadeFrames:\s*3/);
  assert.match(source, /nextStartFrame:\s*29/);
  assert.doesNotMatch(source, /musketeerImpactAudioTriggered/);
  assert.doesNotMatch(
    source,
    /if\s*\(step\.hit\s*&&\s*!musketeerImpactAudioTriggered\s*&&\s*info\.actionFrame\s*>=\s*29\)/,
  );
  assert.match(source, /attackImpactFrame:\s*30/);
});

test("main accepts reload and fire phases for battle-demo audio messages", () => {
  const mainSource = fs.readFileSync("src/main.ts", "utf8");
  assert.match(
    mainSource,
    /phase\?: "draw" \| "release" \| "reload" \| "fire" \| "impact";/,
  );
  assert.match(mainSource, /audioMessage\.phase !== "reload"/);
  assert.match(mainSource, /audioMessage\.phase !== "fire"/);
});
