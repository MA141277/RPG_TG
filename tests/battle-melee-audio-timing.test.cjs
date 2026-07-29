const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

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

function loadBattleMeleeAudioFns() {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const pickCueBody = extractFunctionBody(
    source,
    "function pickBattleMeleeHitCue(randomValue = Math.random())",
  );
  const resolveJumpLandingPlanBody = extractFunctionBody(
    source,
    "function resolveBattleJumpLandingSoundPlan({ troopType, variant = null })",
  );
  const resolvePlanBody = extractFunctionBody(
    source,
    "function resolveBattleMeleeSoundPlan({ troopType, variant = null, hit, randomValue = Math.random() })",
  );
  const pickBattleMeleeHitCue = new Function(
    "Math",
    `return function pickBattleMeleeHitCue(randomValue = Math.random()) {${pickCueBody}};`,
  )(Math);
  const resolveBattleJumpLandingSoundPlan = new Function(
    `return function resolveBattleJumpLandingSoundPlan({ troopType, variant = null }) {${resolveJumpLandingPlanBody}};`,
  )();
  const resolveBattleMeleeSoundPlan = new Function(
    "pickBattleMeleeHitCue",
    "Math",
    `return function resolveBattleMeleeSoundPlan({ troopType, variant = null, hit, randomValue = Math.random() }) {${resolvePlanBody}};`,
  )(pickBattleMeleeHitCue, Math);
  return {
    source,
    pickBattleMeleeHitCue,
    resolveBattleJumpLandingSoundPlan,
    resolveBattleMeleeSoundPlan,
  };
}

test("battle melee sound plan maps the requested frames and hit or miss cues", () => {
  const { resolveBattleMeleeSoundPlan } = loadBattleMeleeAudioFns();
  assert.deepEqual(
    resolveBattleMeleeSoundPlan({ troopType: "infantry", variant: "jump_slash", hit: false, randomValue: 0.8 }),
    { triggerFrame: 13, cueId: "slashMiss" },
  );
  assert.deepEqual(
    resolveBattleMeleeSoundPlan({ troopType: "infantry", variant: "jump_chop", hit: true, randomValue: 0.1 }),
    { triggerFrame: 42, cueId: "slashHit1" },
  );
  assert.deepEqual(
    resolveBattleMeleeSoundPlan({ troopType: "spear", variant: "jump_thrust", hit: true, randomValue: 0.5 }),
    { triggerFrame: 14, cueId: "slashHit2" },
  );
  assert.deepEqual(
    resolveBattleMeleeSoundPlan({ troopType: "cavalry", variant: "dash_slash", hit: true, randomValue: 0.9 }),
    { triggerFrame: 30, cueId: "slashHit3" },
  );
  assert.equal(
    resolveBattleMeleeSoundPlan({ troopType: "archer", variant: null, hit: true, randomValue: 0.2 }),
    null,
  );
});

test("battle jump and landing sound plan maps the requested swordsman and spearman frames", () => {
  const { resolveBattleJumpLandingSoundPlan } = loadBattleMeleeAudioFns();
  assert.deepEqual(
    resolveBattleJumpLandingSoundPlan({ troopType: "infantry", variant: "jump_slash" }),
    { jumpTriggerFrame: 9, landingTriggerFrame: 27 },
  );
  assert.deepEqual(
    resolveBattleJumpLandingSoundPlan({ troopType: "infantry", variant: "jump_chop" }),
    { jumpTriggerFrame: 29, landingTriggerFrame: 42 },
  );
  assert.deepEqual(
    resolveBattleJumpLandingSoundPlan({ troopType: "spear", variant: "jump_thrust" }),
    { jumpTriggerFrame: 8, landingTriggerFrame: 29 },
  );
  assert.equal(
    resolveBattleJumpLandingSoundPlan({ troopType: "archer", variant: null }),
    null,
  );
});

test("battle demo triggers melee audio from onFrame rather than onImpact", () => {
  const { source } = loadBattleMeleeAudioFns();
  assert.match(source, /const meleeSoundPlan = resolveBattleMeleeSoundPlan\(\{/);
  assert.match(
    source,
    /onFrame:\s*info\s*=>\s*\{[\s\S]*?info\.actionFrame >= meleeSoundPlan\.triggerFrame[\s\S]*?playBattleMeleeCue\(meleeSoundPlan\.cueId\)/,
  );
  assert.doesNotMatch(
    source,
    /onImpact:\s*info\s*=>\s*\{[\s\S]*?playBattleMeleeCue\(/,
  );
});

test("battle demo also triggers swordsman and spearman jump and landing cues from onFrame", () => {
  const { source } = loadBattleMeleeAudioFns();
  assert.match(
    source,
    /const jumpLandingSoundPlan = resolveBattleJumpLandingSoundPlan\(\{/,
  );
  assert.match(
    source,
    /function triggerBattleJumpLandingCues\(info,\s*jumpLandingSoundPlan,\s*jumpLandingAudioState\)\s*\{/,
  );
  assert.match(
    source,
    /playBattleMeleeCue\('jump'\)/,
  );
  assert.match(
    source,
    /playBattleMeleeCue\('landing'\)/,
  );
});

test("embedded melee playback delegates to the shared battle audio bridge before falling back to local audio", () => {
  const demoSource = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const previewSource = fs.readFileSync("prototypes/troop-management-preview/index.html", "utf8");

  const signatures = [
    "function playBattleMeleeCue(cueId)",
  ];

  signatures.forEach((signature) => {
    assert.equal(
      extractFunctionBody(previewSource, signature).replace(/\s+/g, ""),
      extractFunctionBody(demoSource, signature).replace(/\s+/g, ""),
    );
  });

  assert.match(
    demoSource,
    /function playBattleMeleeCue\(cueId\)\s*\{[\s\S]*?if\s*\(battleConfig\.embedded(?:\s*&&\s*battleConfig\.scenarioId)?\)\s*\{[\s\S]*?postBattleDemoAudioMessage\(\{\s*cueId\s*\}\);[\s\S]*?return;[\s\S]*?\}/,
  );
});

test("troop preview mirrors battle demo melee audio helpers and frame trigger wiring", () => {
  const demoSource = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const previewSource = fs.readFileSync("prototypes/troop-management-preview/index.html", "utf8");

  const signatures = [
    "function pickBattleMeleeHitCue(randomValue = Math.random())",
    "function resolveBattleMeleeSoundPlan({ troopType, variant = null, hit, randomValue = Math.random() })",
    "function playBattleMeleeCue(cueId)",
  ];

  signatures.forEach((signature) => {
    assert.equal(
      extractFunctionBody(previewSource, signature).replace(/\s+/g, ""),
      extractFunctionBody(demoSource, signature).replace(/\s+/g, ""),
    );
  });

  assert.match(
    previewSource,
    /const meleeSoundPlan = resolveBattleMeleeSoundPlan\(\{/,
  );
  assert.match(
    previewSource,
    /onFrame:\s*info\s*=>\s*\{[\s\S]*?info\.actionFrame >= meleeSoundPlan\.triggerFrame[\s\S]*?playBattleMeleeCue\(meleeSoundPlan\.cueId\)/,
  );
});

test("battle cavalry dash emits the shared horse run cue during the move phase in demo and preview", () => {
  const demoSource = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const previewSource = fs.readFileSync("prototypes/troop-management-preview/index.html", "utf8");

  [demoSource, previewSource].forEach((source) => {
    assert.match(source, /let cavalryRunAudioTriggered = false;/);
    assert.match(source, /const cavalryRunAudioChainId = troopType === 'cavalry' \? createBattleDemoCavalryAudioChainId\(step\) : null;/);
    assert.match(
      source,
      /if\s*\(\s*troopType === 'cavalry'\s*&&\s*!cavalryRunAudioTriggered\s*&&\s*info\.actionFrame >= 1\s*\)\s*\{[\s\S]*?cavalryRunAudioTriggered = true;[\s\S]*?phase:\s*'horse-run'[\s\S]*?mode:\s*'play'/,
    );
    assert.match(
      source,
      /if\s*\(\s*troopType === 'cavalry'\s*&&\s*cavalryRunAudioTriggered\s*\)\s*\{[\s\S]*?phase:\s*'horse-run'[\s\S]*?mode:\s*'stop'/,
    );
  });
});
