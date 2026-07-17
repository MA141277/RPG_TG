const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

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

function loadBattleCavalryFns() {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const getPlanBody = extractFunctionBody(
    source,
    "function getBattleMeleeAttackPlan(troopType, renderer, randomValue = Math.random())",
  );
  const assetsMatch = source.match(/const BATTLE_SPINE_TROOP_ASSETS = (\{[\s\S]*?\n\s*\});/);
  if (!assetsMatch) {
    throw new Error("Missing BATTLE_SPINE_TROOP_ASSETS constant");
  }
  const BATTLE_SPINE_TROOP_ASSETS = new Function(`return ${assetsMatch[1]};`)();
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
    getBattleMeleeAttackPlan,
  };
}

test("battle Spine asset registry resolves cavalry movement by action name and lands impact on frame 30", () => {
  const { BATTLE_SPINE_TROOP_ASSETS } = loadBattleCavalryFns();
  assert.equal(BATTLE_SPINE_TROOP_ASSETS.cavalry.cacheKey, "cavalry");
  assert.deepEqual(BATTLE_SPINE_TROOP_ASSETS.cavalry.attackActionNames, ["\u5288\u780d"]);
  assert.deepEqual(BATTLE_SPINE_TROOP_ASSETS.cavalry.moveActionIds, []);
  assert.deepEqual(BATTLE_SPINE_TROOP_ASSETS.cavalry.moveActionNames, ["\u51b2\u523a"]);
  assert.equal(BATTLE_SPINE_TROOP_ASSETS.cavalry.renderScaleMultiplier, 1.8);
  assert.deepEqual(BATTLE_SPINE_TROOP_ASSETS.cavalry.renderOffsetYBySide, {
    player: -98,
    enemy: -98,
  });
  assert.equal(BATTLE_SPINE_TROOP_ASSETS.cavalry.renderOffsetY, 0);
  assert.equal(BATTLE_SPINE_TROOP_ASSETS.cavalry.attackImpactFrame, 30);
  assert.equal(BATTLE_SPINE_TROOP_ASSETS.cavalry.attackEffectFrame, 30);
  assert.deepEqual(BATTLE_SPINE_TROOP_ASSETS.cavalry.landingBackOffsetXBySide, {
    player: -140,
    enemy: 140,
  });
});

test("battle cavalry attack plan uses the imported cavalry action ids instead of legacy move/attack placeholders", () => {
  const { getBattleMeleeAttackPlan } = loadBattleCavalryFns();
  const renderer = {
    moveAction: { id: "action-k7yfp1", name: "\u51b2\u523a" },
    attackAction: { id: "action-1unktf", name: "\u5288\u780d" },
    getActionDurationMs(actionId) {
      if (actionId === "action-k7yfp1") return 1666.6666666666667;
      if (actionId === "action-1unktf") return 1666.6666666666667;
      throw new Error(`Unexpected action: ${actionId}`);
    },
  };

  assert.deepEqual(getBattleMeleeAttackPlan("cavalry", renderer, 0.25), {
    variant: "dash_slash",
    moveAction: "action-k7yfp1",
    moveDurationMs: 1666.6666666666667,
    moveStartFrame: null,
    moveEndFrame: null,
    moveArcHeight: 0,
    attackAction: "action-1unktf",
    attackDurationMs: 1666.6666666666667,
    attackMoveStartFrame: null,
    attackMoveEndFrame: null,
    impactFrame: 30,
    effectFrame: 30,
    returnsToSource: false,
  });
});

test("battle cavalry project ships the imported idle, dash, and slash clips even when the selected action points at dash", () => {
  const project = JSON.parse(fs.readFileSync("src/faxian/leg/cavalry/project.json", "utf8"));
  const actions = new Map((project.actions || []).map((action) => [action.name, action]));

  assert.equal(project.selectedActionId, "action-k7yfp1");
  assert.equal(actions.get("\u5f85\u673a")?.duration, 59);
  assert.equal(actions.get("\u51b2\u523a")?.duration, 29);
  assert.equal(actions.get("\u5288\u780d")?.duration, 59);
});

test("battle renderer resolves attack actions from explicit attack names before falling back to selectedActionId", () => {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  assert.match(
    source,
    /this\.findPreferredAction\(\s*config\.attackActionIds \|\| \[\],\s*config\.attackActionNames \|\| \[\]\s*\)\s*\|\|\s*this\.findPreferredAction\(\s*\[project\.selectedActionId\]\.filter\(Boolean\),\s*\[\]\s*\)/,
  );
});

test("battle cavalry slash fx custom image references resolve to real files in the cavalry asset folder", () => {
  const project = JSON.parse(fs.readFileSync("src/faxian/leg/cavalry/project.json", "utf8"));
  const slashImages = Object.values(project.customImages || {})
    .filter((item) => String(item?.name || "").includes("刀光"));

  assert.ok(slashImages.length >= 2);
  slashImages.forEach((item) => {
    const src = String(item.src || "");
    assert.match(src, /^leg:/);
    const relativePath = src.slice(4);
    assert.equal(
      fs.existsSync(path.join("src/faxian/leg/cavalry", relativePath)),
      true,
      `missing cavalry slash fx image: ${relativePath}`,
    );
  });
});
