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
  assert.equal(BATTLE_SPINE_TROOP_ASSETS.cavalry.renderScaleMultiplier, 1.512);
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

test("battle formation slot clears stale canvas layers before the first frame of a different troop type", () => {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  assert.match(source, /function clearBattleSpineCanvasLayers\(canvas\) \{/);
  assert.match(source, /const troopTypeChanged = previous && previous\.troopType !== nextState\.troopType;/);
  assert.match(source, /if \(troopTypeChanged\) \{\s*clearBattleSpineCanvasLayers\(entry\.canvas\);\s*\}/);
});

test("battle idle loop keeps cavalry unthrottled while preserving the slower idle gate for other troop types", () => {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  assert.match(source, /const allowThrottledIdleRender = now - battleSpineLastIdleRender >= 83;/);
  assert.match(source, /if \(troopType !== 'cavalry' && !allowThrottledIdleRender\) \{\s*continue;\s*\}/);
  assert.match(source, /battleSpineIdleRaf = window\.setInterval\(tick, 16\);/);
  assert.match(source, /const actionId = entry\.canvas\.dataset\.action \|\| 'idle';/);
  assert.match(source, /if \(troopType === 'cavalry' && !freezeIdleFrame\) \{/);
  assert.match(source, /entry\.canvas\.__battleLastIdleActionFrameBucket === actionFrameBucket/);
});

test("battle renderer caps mesh density by authored attachment mesh settings instead of always using the generic segment-based grid", () => {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  assert.match(source, /const defaultCols = this\.lowDetail \? 3 : attachment\.restPart\.partId === 'torso' \? 5 : 4;/);
  assert.match(source, /const defaultRows = this\.lowDetail \? Math\.max\(4, segments\.length \* 3\) : Math\.max\(6, segments\.length \* 5\);/);
  assert.match(source, /const authoredMeshCols = Math\.round\(Number\(attachment\.meshCols\)\);/);
  assert.match(source, /const authoredMeshRows = Math\.round\(Number\(attachment\.meshRows\)\);/);
  assert.match(source, /const cols = authoredMeshCols > 0[\s\S]*Math\.max\(3, Math\.min\(defaultCols, authoredMeshCols\)\)/);
  assert.match(source, /const rows = authoredMeshRows > 0[\s\S]*Math\.max\(4, Math\.min\(defaultRows, authoredMeshRows\)\)/);
});

test("battle formation layout uses the restored baseline vertical slot spacing and panel size", () => {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  assert.match(source, /const BATTLE_FORMATION_BASELINE_Y = 88;/);
  assert.match(source, /const BATTLE_VERTICAL_FILE_SPACING_MULTIPLIER = 1\.95;/);
  assert.match(source, /y:\s*14 \* BATTLE_VERTICAL_FILE_SPACING_MULTIPLIER,/);
  assert.match(source, /const y = BATTLE_FORMATION_BASELINE_Y - formationFile \* BATTLE_FILE_DIAGONAL_STEP\.y;/);
  assert.match(source, /\.formation-side \{[\s\S]*bottom: 197px;[\s\S]*height: min\(390px, 48vh\);[\s\S]*min-height: 320px;/);
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
