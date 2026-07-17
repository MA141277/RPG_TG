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

function loadBattleSpearmanFns() {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const getAssetBody = extractFunctionBody(source, "function getBattleSpineTroopAsset(troopType)");
  const getPlanBody = extractFunctionBody(
    source,
    "function getBattleMeleeAttackPlan(troopType, renderer, randomValue = Math.random())",
  );
  const assetsMatch = source.match(/const BATTLE_SPINE_TROOP_ASSETS = (\{[\s\S]*?\n\s*\});/);
  if (!assetsMatch) {
    throw new Error("Missing BATTLE_SPINE_TROOP_ASSETS constant");
  }
  const BATTLE_SPINE_TROOP_ASSETS = new Function(`return ${assetsMatch[1]};`)();
  const getBattleSpineTroopAsset = new Function(
    "BATTLE_SPINE_TROOP_ASSETS",
    `return function getBattleSpineTroopAsset(troopType) {${getAssetBody}};`,
  )(BATTLE_SPINE_TROOP_ASSETS);
  const chooseBattleInfantryAttackVariant = () => "jump_slash";
  const getBattleInfantryAttackPlan = () => ({ variant: "jump_slash_fallback" });
  const getBattleMeleeAttackPlan = new Function(
    "chooseBattleInfantryAttackVariant",
    "getBattleInfantryAttackPlan",
    `return function getBattleMeleeAttackPlan(troopType, renderer, randomValue = Math.random()) {${getPlanBody}};`,
  )(chooseBattleInfantryAttackVariant, getBattleInfantryAttackPlan);
  return {
    source,
    BATTLE_SPINE_TROOP_ASSETS,
    getBattleSpineTroopAsset,
    getBattleMeleeAttackPlan,
  };
}

test("battle Spine asset registry defines a dedicated spearman entry with weapon foreground normalization", () => {
  const { BATTLE_SPINE_TROOP_ASSETS } = loadBattleSpearmanFns();
  assert.deepEqual(BATTLE_SPINE_TROOP_ASSETS.spearman, {
    cacheKey: "spearman",
    projectUrl: "/src/faxian/leg/spearman/project.json",
    imageBaseUrl: "../../src/faxian/leg/spearman/",
    attackActionNames: ["戳刺"],
    moveActionIds: ["jump"],
    moveActionNames: ["跳跃"],
    materialForegroundImageKeys: ["newSword"],
    materialForegroundNormalizeOptions: {
      newSword: {
        removeDarkGuideLine: true,
      },
    },
    renderScaleMultiplier: 1.1088,
    renderOffsetX: -16,
    renderOffsetXBySide: {
      player: -110,
      enemy: 85,
    },
    renderOffsetYBySide: {
      player: -30,
      enemy: -30,
    },
    renderOffsetY: 0,
    stationaryAttack: false,
    attackImpactRatio: 0.5,
  });
});

test("battle Spine asset selection maps spear troop types to the spearman renderer config", () => {
  const { getBattleSpineTroopAsset } = loadBattleSpearmanFns();
  const asset = getBattleSpineTroopAsset("spear");
  assert.equal(asset.cacheKey, "spearman");
  assert.equal(asset.projectUrl, "/src/faxian/leg/spearman/project.json");
});

test("battle spearman attack plan jumps on frames 7-31 and lands damage on thrust frame 14", () => {
  const { getBattleMeleeAttackPlan } = loadBattleSpearmanFns();
  const renderer = {
    findActionByName() {
      return null;
    },
    getActionDurationMs(actionId) {
      if (actionId === "jump") return 972.2222222222222;
      if (actionId === "attack") return 805.5555555555555;
      throw new Error(`Unexpected action: ${actionId}`);
    },
  };

  assert.deepEqual(getBattleMeleeAttackPlan("spear", renderer, 0.9), {
    variant: "jump_thrust",
    moveAction: "jump",
    moveDurationMs: 972.2222222222222,
    moveStartFrame: 7,
    moveEndFrame: 31,
    attackAction: "attack",
    attackDurationMs: 805.5555555555555,
    attackMoveStartFrame: null,
    attackMoveEndFrame: null,
    impactFrame: 14,
    effectFrame: 14,
    returnsToSource: false,
  });
});

test("spearman Spine project includes the thrust action clip imported from the dedicated unit json", () => {
  const project = JSON.parse(fs.readFileSync("src/faxian/leg/spearman/project.json", "utf8"));
  const thrust = (project.actions || []).find((action) => action.name === "戳刺");
  assert.ok(thrust);
  assert.equal(thrust.duration, 29);
});

test("battle runtime routes non-stationary melee Spine troops through the troop-aware melee attack planner", () => {
  const { source } = loadBattleSpearmanFns();
  assert.match(
    source,
    /const infantryAttackPlan = !troopAsset\.stationaryAttack && troopType !== 'archer'\s*\?\s*getBattleMeleeAttackPlan\(troopType,\s*renderer\)\s*:\s*null;/,
  );
});
