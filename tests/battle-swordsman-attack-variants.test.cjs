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

function loadBattleSwordsmanAttackFns() {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const chooseVariantBody = extractFunctionBody(
    source,
    "function chooseBattleInfantryAttackVariant(randomValue = Math.random())",
  );
  const getPlanBody = extractFunctionBody(
    source,
    "function getBattleInfantryAttackPlan(renderer, randomValue = Math.random())",
  );
  const chooseBattleInfantryAttackVariant = new Function(
    "Math",
    `return function chooseBattleInfantryAttackVariant(randomValue = Math.random()) {${chooseVariantBody}};`,
  )(Math);
  const getBattleInfantryAttackPlan = new Function(
    "chooseBattleInfantryAttackVariant",
    `return function getBattleInfantryAttackPlan(renderer, randomValue = Math.random()) {${getPlanBody}};`,
  )(chooseBattleInfantryAttackVariant);
  return {
    source,
    chooseBattleInfantryAttackVariant,
    getBattleInfantryAttackPlan,
  };
}

test("battle infantry attack variant chooser splits swordsman attacks at an exact 50/50 threshold", () => {
  const { chooseBattleInfantryAttackVariant } = loadBattleSwordsmanAttackFns();
  assert.equal(chooseBattleInfantryAttackVariant(0), "jump_slash");
  assert.equal(chooseBattleInfantryAttackVariant(0.499999), "jump_slash");
  assert.equal(chooseBattleInfantryAttackVariant(0.5), "jump_chop");
  assert.equal(chooseBattleInfantryAttackVariant(0.999999), "jump_chop");
});

test("battle infantry jump-chop plan uses the imported 69-frame action and 43-frame impact timing", () => {
  const { getBattleInfantryAttackPlan } = loadBattleSwordsmanAttackFns();
  const renderer = {
    findActionByName(name) {
      return name === "跳劈" ? { id: "action-cq1nlp", name: "跳劈", duration: 69 } : null;
    },
    getActionDurationMs(actionId) {
      if (actionId === "action-cq1nlp") return 2333.3333333333335;
      if (actionId === "move") return 1200;
      if (actionId === "attack") return 1000;
      throw new Error(`Unexpected action: ${actionId}`);
    },
  };

  assert.deepEqual(getBattleInfantryAttackPlan(renderer, 0.5), {
    variant: "jump_chop",
    moveAction: null,
    moveDurationMs: 0,
    moveStartFrame: null,
    moveEndFrame: null,
    attackAction: "action-cq1nlp",
    attackDurationMs: 2333.3333333333335,
    attackMoveStartFrame: 29,
    attackMoveEndFrame: 41,
    impactFrame: 43,
    effectFrame: 43,
    returnsToSource: true,
  });
});

test("battle infantry jump-chop plan falls back to the existing jump-slash chain when the action is unavailable", () => {
  const { getBattleInfantryAttackPlan } = loadBattleSwordsmanAttackFns();
  const renderer = {
    findActionByName() {
      return null;
    },
    getActionDurationMs(actionId) {
      if (actionId === "move") return 1200;
      if (actionId === "attack") return 1000;
      throw new Error(`Unexpected action: ${actionId}`);
    },
  };

  assert.deepEqual(getBattleInfantryAttackPlan(renderer, 0.9), {
    variant: "jump_slash",
    moveAction: "move",
    moveDurationMs: 1200,
    moveStartFrame: 7,
    moveEndFrame: 23,
    attackAction: "attack",
    attackDurationMs: 1000,
    attackMoveStartFrame: null,
    attackMoveEndFrame: null,
    impactFrame: 14,
    effectFrame: 13,
    returnsToSource: false,
  });
});

test("swordsman Spine project includes the imported jump-chop action clip", () => {
  const project = JSON.parse(fs.readFileSync("src/faxian/leg/swordsman/project.json", "utf8"));
  const jumpChop = (project.actions || []).find((action) => action.name === "跳劈");
  assert.ok(jumpChop);
  assert.equal(jumpChop.duration, 69);
});

test("battle runtime routes swordsman attacks through the troop-aware melee planner while preserving non-stationary melee support", () => {
  const { source } = loadBattleSwordsmanAttackFns();
  assert.match(
    source,
    /const infantryAttackPlan = !troopAsset\.stationaryAttack && troopType !== 'archer'\s*\?\s*getBattleMeleeAttackPlan\(troopType,\s*renderer\)\s*:\s*null;/,
  );
});
