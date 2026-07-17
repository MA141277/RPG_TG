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

function loadScheduleFns() {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const pickBody = extractFunctionBody(source, "function pickRandomFormationMemberIndex(poolLength, randomValue = Math.random())");
  const buildBody = extractFunctionBody(source, "function buildScheduledFormationSideStrikes(sourceUnit, targetUnit, options = {})");
  const pickRandomFormationMemberIndex = new Function(
    `return function pickRandomFormationMemberIndex(poolLength, randomValue = Math.random()) {${pickBody}};`,
  )();
  const buildScheduledFormationSideStrikes = new Function(
    "TROOP_TYPES",
    "getBattleReadyMembers",
    "pickRandomFormationMemberIndex",
    "randInt",
    "sortFormationMembersForBattleOrder",
    "chooseFormationTarget",
    "calculateMemberDamage",
    "applyMemberDamage",
    `return function buildScheduledFormationSideStrikes(sourceUnit, targetUnit, options = {}) {${buildBody}};`,
  )(
    {
      infantry: { label: "步兵" },
      archer: { label: "弓兵" },
    },
    (unit) => unit.formationMembers,
    pickRandomFormationMemberIndex,
    () => 300,
    (members) => members,
    (_sourceUnit, _member, targetUnit) => targetUnit.formationMembers.find((target) => target.soldiers > 0) || null,
    () => ({ damage: 10, typeAdv: 1 }),
    (_targetUnit, targetMember, damage) => {
      targetMember.soldiers -= damage;
    },
  );
  return { pickRandomFormationMemberIndex, buildScheduledFormationSideStrikes };
}

test("formation side schedule uses random-without-replacement attacker order and cumulative launchAtMs", () => {
  const { buildScheduledFormationSideStrikes } = loadScheduleFns();
  const sourceUnit = {
    id: "attacker",
    soldiers: 300,
    formationMembers: [
      { slotKey: "front-left", troopType: "infantry", soldiers: 100, range: 1, status: "ready" },
      { slotKey: "front-center", troopType: "infantry", soldiers: 100, range: 1, status: "ready" },
      { slotKey: "front-right", troopType: "archer", soldiers: 100, range: 2, status: "ready" },
    ],
  };
  const targetUnit = {
    id: "defender",
    soldiers: 300,
    formationMembers: [
      { slotKey: "front-left", troopType: "infantry", soldiers: 100, range: 1, status: "ready" },
    ],
  };
  const randomValues = [0.8, 0.0, 0.0];
  const strikes = buildScheduledFormationSideStrikes(sourceUnit, targetUnit, {
    distance: 1,
    sourceSide: "attacker",
    targetSide: "defender",
    label: "攻方",
    isCounter: false,
    random: () => randomValues.shift(),
  });

  assert.deepEqual(strikes.map((step) => step.sourceSlotKey), ["front-right", "front-left", "front-center"]);
  assert.deepEqual(strikes.map((step) => step.launchAtMs), [0, 300, 600]);
  assert.equal(strikes[2].nextDelayMs, null);
});
