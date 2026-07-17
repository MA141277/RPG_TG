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

function loadBattleArcherEffectFns() {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const alphaBody = extractFunctionBody(
    source,
    "function getBattleFrameEffectAlphaAtFrame(frame, effectFrame, fadeInFrames = 2, holdFrames = 1, fadeOutFrames = 4)",
  );
  const entryStartBody = extractFunctionBody(
    source,
    "function getBattleArcherScreenEntryStartPosition(targetPosition, layerRect, sourceSide = 'player', angleDeg = 20, padding = 180)",
  );
  const planBody = extractFunctionBody(
    source,
    "function getBattleArcherAttackEffectPlan(hit = false)",
  );
  const getBattleFrameEffectAlphaAtFrame = new Function(
    `return function getBattleFrameEffectAlphaAtFrame(frame, effectFrame, fadeInFrames = 2, holdFrames = 1, fadeOutFrames = 4) {${alphaBody}};`,
  )();
  const getBattleArcherScreenEntryStartPosition = new Function(
    "Math",
    `return function getBattleArcherScreenEntryStartPosition(targetPosition, layerRect, sourceSide = 'player', angleDeg = 20, padding = 180) {${entryStartBody}};`,
  )(Math);
  const getBattleArcherAttackEffectPlan = new Function(
    `return function getBattleArcherAttackEffectPlan(hit = false) {${planBody}};`,
  )();
  return {
    source,
    getBattleFrameEffectAlphaAtFrame,
    getBattleArcherScreenEntryStartPosition,
    getBattleArcherAttackEffectPlan,
  };
}

test("battle frame effect alpha still supports the shared timing math", () => {
  const { getBattleFrameEffectAlphaAtFrame } = loadBattleArcherEffectFns();
  assert.equal(getBattleFrameEffectAlphaAtFrame(43, 46), 0);
  assert.equal(getBattleFrameEffectAlphaAtFrame(45, 46), 0.5);
  assert.equal(getBattleFrameEffectAlphaAtFrame(46, 46), 1);
  assert.equal(getBattleFrameEffectAlphaAtFrame(50, 46), 0.25);
  assert.equal(getBattleFrameEffectAlphaAtFrame(51, 46), 0);
});

test("battle archer attack effect plan includes restored trail and arrow launch effects", () => {
  const { getBattleArcherAttackEffectPlan } = loadBattleArcherEffectFns();
  const expectedPlan = [
    { kind: "trail", frame: 41, fadeInFrames: 2, holdFrames: 2, fadeOutFrames: 8 },
    { kind: "arrow", frame: 41, fadeInFrames: 2, holdFrames: 0, fadeOutFrames: 2 },
    { kind: "flight", frame: 45, fadeInFrames: 0, holdFrames: 4, fadeOutFrames: 0, motionStartFrame: 45, motionEndFrame: 48 },
    { kind: "stage1", frame: 49, fadeInFrames: 0, holdFrames: 2, fadeOutFrames: 0 },
    { kind: "stage2", frame: 51, fadeInFrames: 0, holdFrames: 2, fadeOutFrames: 2 },
  ];
  assert.deepEqual(getBattleArcherAttackEffectPlan(false), expectedPlan);
  assert.deepEqual(getBattleArcherAttackEffectPlan(true), expectedPlan);
});

test("battle archer screen-entry flight now uses a 20 degree entry angle", () => {
  const { getBattleArcherScreenEntryStartPosition } = loadBattleArcherEffectFns();
  const start = getBattleArcherScreenEntryStartPosition({ x: 700, y: 420 }, { width: 1000, height: 600 }, "player", 20, 180);
  assert.ok(start.x < 700);
  assert.ok(start.y < 420);
  const dy = 420 - start.y;
  const dx = 700 - start.x;
  const angleDeg = Math.atan2(dy, dx) * 180 / Math.PI;
  assert.ok(Math.abs(angleDeg - 20) < 1e-6);
});

test("battle archer effect asset sizes and motion config match the current runtime tuning", () => {
  const { source } = loadBattleArcherEffectFns();
  assert.match(source, /trail:\s*\{[\s\S]*?src:\s*['"]\.\.\/\.\.\/ui\/battle\/战斗\/archer_trail_effect\.png['"],/);
  assert.match(source, /trail:\s*\{[\s\S]*?width:\s*257(?:\.6)?,/);
  assert.match(source, /trail:\s*\{[\s\S]*?spawnOffsetX:\s*50,/);
  assert.match(source, /trail:\s*\{[\s\S]*?spawnOffsetY:\s*70,/);
  assert.match(source, /trail:\s*\{[\s\S]*?renderOffsetY:\s*30,/);
  assert.match(source, /trail:\s*\{[\s\S]*?motionDistance:\s*10,/);
  assert.match(source, /trail:\s*\{[\s\S]*?endScale:\s*1(?:\.2)?,/);
  assert.match(source, /arrow:\s*\{[\s\S]*?src:\s*['"]\.\.\/\.\.\/ui\/battle\/战斗\/archer_arrow_path_effect\.png['"],/);
  assert.match(source, /arrow:\s*\{[\s\S]*?width:\s*220,/);
  assert.match(source, /arrow:\s*\{[\s\S]*?speedPxPerFrame:\s*240,/);
  assert.match(source, /arrow:\s*\{[\s\S]*?screenPadding:\s*200,/);
  assert.match(source, /flight:\s*\{[\s\S]*?src:\s*['"]\.\.\/\.\.\/ui\/battle\/战斗\/archer_hit_effect_flight\.png['"],/);
  assert.match(source, /flight:\s*\{[\s\S]*?width:\s*250,/);
  assert.match(source, /flight:\s*\{[\s\S]*?angleDeg:\s*20,/);
  assert.match(source, /flight:\s*\{[\s\S]*?startPadding:\s*180,/);
  assert.match(source, /stage1:\s*\{[\s\S]*?src:\s*['"]\.\.\/\.\.\/ui\/battle\/战斗\/archer_hit_effect_stage1\.png['"],/);
  assert.match(source, /stage1:\s*\{[\s\S]*?width:\s*250,/);
  assert.match(source, /stage2:\s*\{[\s\S]*?src:\s*['"]\.\.\/\.\.\/ui\/battle\/战斗\/archer_hit_effect_stage2\.png['"],/);
  assert.match(source, /stage2:\s*\{[\s\S]*?width:\s*260,/);
  assert.match(source, /function getBattleArcherScreenEntryStartPosition\(targetPosition, layerRect, sourceSide = 'player', angleDeg = 20, padding = 180\)/);
  assert.match(source, /kind:\s*'trail',\s*frame:\s*41,\s*fadeInFrames:\s*2,\s*holdFrames:\s*2,\s*fadeOutFrames:\s*8/);
  assert.match(source, /kind:\s*'arrow',\s*frame:\s*41,\s*fadeInFrames:\s*2,\s*holdFrames:\s*0,\s*fadeOutFrames:\s*2/);
  assert.match(source, /kind:\s*'flight',\s*frame:\s*45,\s*fadeInFrames:\s*0,\s*holdFrames:\s*4,\s*fadeOutFrames:\s*0,\s*motionStartFrame:\s*45,\s*motionEndFrame:\s*48/);
  assert.match(source, /kind:\s*'stage1',\s*frame:\s*49,\s*fadeInFrames:\s*0,\s*holdFrames:\s*2,\s*fadeOutFrames:\s*0/);
  assert.match(source, /kind:\s*'stage2',\s*frame:\s*51,\s*fadeInFrames:\s*0,\s*holdFrames:\s*2,\s*fadeOutFrames:\s*2/);
  assert.match(source, /if\s*\(effect\.kind === 'trail'\)\s*\{/);
  assert.match(source, /if\s*\(effect\.kind === 'arrow'\)\s*\{/);
  assert.match(source, /const battleTimedImageEffectPool = \[\];/);
  assert.match(source, /function acquireBattleTimedImageEffectAnchor\(/);
  assert.match(source, /function releaseBattleTimedImageEffectAnchor\(/);
});
