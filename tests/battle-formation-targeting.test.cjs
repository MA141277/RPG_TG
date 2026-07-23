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
      if (depth === 0) return source.slice(bodyStart + 1, index);
    }
  }
  throw new Error(`Unclosed function body for: ${signature}`);
}

function loadFormationTargetingFns(randomValue = 0) {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const getAliveFormationMembers = new Function(
    `return function getAliveFormationMembers(unit) {${extractFunctionBody(source, "function getAliveFormationMembers(unit)")}};`,
  )();
  const getFormationSlotMeta = new Function(
    `return function getFormationSlotMeta(slotKey, mirrorCols = false) {${extractFunctionBody(source, "function getFormationSlotMeta(slotKey, mirrorCols = false)")}};`,
  )();
  const shouldMirrorFormationCols = new Function(
    `return function shouldMirrorFormationCols(unit) {${extractFunctionBody(source, "function shouldMirrorFormationCols(unit)")}};`,
  )();
  const getFormationResolutionOrder = new Function(
    "getFormationSlotMeta",
    `return function getFormationResolutionOrder(member) {${extractFunctionBody(source, "function getFormationResolutionOrder(member)")}};`,
  )(getFormationSlotMeta);
  const chooseFormationTarget = new Function(
    "getAliveFormationMembers",
    "getFormationSlotMeta",
    "shouldMirrorFormationCols",
    "getFormationResolutionOrder",
    "randInt",
    `return function chooseFormationTarget(attackerUnit, attackerMember, defenderUnit) {${extractFunctionBody(source, "function chooseFormationTarget(attackerUnit, attackerMember, defenderUnit)")}};`,
  )(
    getAliveFormationMembers,
    getFormationSlotMeta,
    shouldMirrorFormationCols,
    getFormationResolutionOrder,
    () => randomValue,
  );
  return { chooseFormationTarget };
}

test("player upper-row attacker prioritizes the enemy upper-row defender", () => {
  const { chooseFormationTarget } = loadFormationTargetingFns();
  const attackerUnit = {
    side: "player",
    formationMembers: [{ slotKey: "front-left", soldiers: 100 }],
  };
  const defenderUnit = {
    side: "enemy",
    formationMembers: [
      { slotKey: "front-left", soldiers: 100 },
      { slotKey: "front-right", soldiers: 100 },
    ],
  };

  const target = chooseFormationTarget(attackerUnit, attackerUnit.formationMembers[0], defenderUnit);
  assert.equal(target?.slotKey, "front-right");
});

test("enemy upper-row attacker prioritizes the player upper-row defender", () => {
  const { chooseFormationTarget } = loadFormationTargetingFns();
  const attackerUnit = {
    side: "enemy",
    formationMembers: [{ slotKey: "front-left", soldiers: 100 }],
  };
  const defenderUnit = {
    side: "player",
    formationMembers: [
      { slotKey: "front-left", soldiers: 100 },
      { slotKey: "front-right", soldiers: 100 },
    ],
  };

  const target = chooseFormationTarget(attackerUnit, attackerUnit.formationMembers[0], defenderUnit);
  assert.equal(target?.slotKey, "front-right");
});

test("same-row targeting falls back to a random surviving front-row defender when that row is empty", () => {
  const { chooseFormationTarget } = loadFormationTargetingFns(0);
  const attackerUnit = {
    side: "player",
    formationMembers: [{ slotKey: "front-left", soldiers: 100 }],
  };
  const defenderUnit = {
    side: "enemy",
    formationMembers: [
      { slotKey: "front-left", soldiers: 100 },
      { slotKey: "front-center", soldiers: 100 },
      { slotKey: "rear-left", soldiers: 100 },
    ],
  };

  const target = chooseFormationTarget(attackerUnit, attackerUnit.formationMembers[0], defenderUnit);
  assert.equal(target?.slotKey, "front-left");
});
