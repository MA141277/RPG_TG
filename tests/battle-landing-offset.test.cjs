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

function loadLandingFns() {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const randomOffsetBody = extractFunctionBody(
    source,
    "function getBattleRandomLandingOffset(radius = 20)",
  );
  const landingTargetBody = extractFunctionBody(
    source,
    "function getBattleLandingTargetPosition(targetAnchor, troopAsset, proxySide)",
  );
  return { randomOffsetBody, landingTargetBody };
}

test("battle random landing offset stays inside a 20px circle and no longer rejects recent nearby offsets", () => {
  const { randomOffsetBody } = loadLandingFns();
  const battleRecentLandingOffsets = [{ x: 0, y: 0 }];
  const mathMock = {
    PI: Math.PI,
    sqrt: Math.sqrt,
    cos: Math.cos,
    sin: Math.sin,
    randomCalls: 0,
    random() {
      this.randomCalls += 1;
      return 0;
    },
  };
  const getBattleRandomLandingOffset = new Function(
    "battleRecentLandingOffsets",
    "Math",
    `return function getBattleRandomLandingOffset(radius = 20) {${randomOffsetBody}};`,
  )(battleRecentLandingOffsets, mathMock);

  const offset = getBattleRandomLandingOffset();
  assert.deepEqual(offset, { x: 0, y: 0 });
  assert.equal(mathMock.randomCalls, 2);
  assert.ok(Math.hypot(offset.x, offset.y) <= 20);
});

test("battle melee landing target position offsets 120px backward from the target anchor", () => {
  const { landingTargetBody } = loadLandingFns();
  const getBattleLandingTargetPosition = new Function(
    "getBattleRandomLandingOffset",
    `return function getBattleLandingTargetPosition(targetAnchor, troopAsset, proxySide) {${landingTargetBody}};`,
  )(() => ({ x: 12, y: -5 }));

  assert.deepEqual(
    getBattleLandingTargetPosition({ x: 300, y: 180 }, { stationaryAttack: false }, "player"),
    { x: 192, y: 175 },
  );
  assert.deepEqual(
    getBattleLandingTargetPosition({ x: 300, y: 180 }, { stationaryAttack: false }, "enemy"),
    { x: 432, y: 175 },
  );
  assert.deepEqual(
    getBattleLandingTargetPosition({ x: 300, y: 180 }, { stationaryAttack: true }, "enemy"),
    { x: 300, y: 180 },
  );
});
