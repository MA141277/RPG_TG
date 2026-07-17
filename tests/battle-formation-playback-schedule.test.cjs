const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

function extractFunctionBody(source, signature) {
  const start = source.indexOf(signature);
  if (start === -1) throw new Error(`Missing signature: ${signature}`);
  const bodyStart = source.indexOf("{", start + signature.length);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(bodyStart + 1, index);
    }
  }
  throw new Error(`Unclosed function body for: ${signature}`);
}

function loadPlaybackFn() {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const body = extractFunctionBody(source, "async function playScheduledFormationSideBlock(report, strikes, state)");
  return new Function(
    "clearBattleModelShakeState",
    "clearBattleTimedImageEffects",
    "battleRecentLandingOffsets",
    "buildBattleBatchActiveState",
    "renderBattleAnimationState",
    "sleep",
    "playSingleFormationStrike",
    `return async function playScheduledFormationSideBlock(report, strikes, state) {${body}};`,
  );
}

test("scheduled side block launches strikes in launchAtMs order and waits for block completion before returning", async () => {
  const launches = [];
  const playScheduledFormationSideBlock = loadPlaybackFn()(
    () => {},
    () => {},
    [],
    () => ({}),
    () => {},
    async () => {},
    async (_report, strike) => {
      launches.push(strike.sourceSlotKey);
    },
  );

  await playScheduledFormationSideBlock({}, [
    { sourceSlotKey: "front-center", launchAtMs: 700 },
    { sourceSlotKey: "front-left", launchAtMs: 0 },
    { sourceSlotKey: "front-right", launchAtMs: 1400 },
  ], {});

  assert.deepEqual(launches, ["front-left", "front-center", "front-right"]);
});
