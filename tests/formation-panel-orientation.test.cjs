const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");

function extractConstArray(name) {
  const match = source.match(new RegExp(`const ${name} = \\[(.*?)\\];`, "s"));
  if (!match) {
    throw new Error(`Missing array constant: ${name}`);
  }
  return new Function(`return [${match[1]}];`)();
}

function extractFunctionBody(signature) {
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

const FORMATION_SLOT_KEYS = extractConstArray("FORMATION_SLOT_KEYS");
const FORMATION_SLOT_ROW_NAMES = extractConstArray("FORMATION_SLOT_ROW_NAMES");
const FORMATION_SLOT_COL_NAMES = extractConstArray("FORMATION_SLOT_COL_NAMES");

const getFormationSlotIndices = new Function(
  "FORMATION_SLOT_ROW_NAMES",
  "FORMATION_SLOT_COL_NAMES",
  `return function getFormationSlotIndices(slotKey) {${extractFunctionBody("function getFormationSlotIndices(slotKey)")}};`,
)(FORMATION_SLOT_ROW_NAMES, FORMATION_SLOT_COL_NAMES);

const buildFormationSlotKey = new Function(
  "FORMATION_SLOT_ROW_NAMES",
  "FORMATION_SLOT_COL_NAMES",
  `return function buildFormationSlotKey(row, col) {${extractFunctionBody("function buildFormationSlotKey(row, col)")}};`,
)(FORMATION_SLOT_ROW_NAMES, FORMATION_SLOT_COL_NAMES);

const rotateFormationPanelSlotKey = new Function(
  "getFormationSlotIndices",
  "buildFormationSlotKey",
  `return function rotateFormationPanelSlotKey(slotKey, side = 'player') {${extractFunctionBody("function rotateFormationPanelSlotKey(slotKey, side = 'player')")}};`,
)(getFormationSlotIndices, buildFormationSlotKey);

const getFormationPanelDisplaySlotKeys = new Function(
  "FORMATION_SLOT_KEYS",
  "rotateFormationPanelSlotKey",
  `return function getFormationPanelDisplaySlotKeys(side = 'player') {${extractFunctionBody("function getFormationPanelDisplaySlotKeys(side = 'player')")}};`,
)(FORMATION_SLOT_KEYS, rotateFormationPanelSlotKey);

test("formation detail panel rotates player formations clockwise so the front row becomes the right column", () => {
  assert.deepEqual(getFormationPanelDisplaySlotKeys("player"), [
    "rear-left", "middle-left", "front-left",
    "rear-center", "middle-center", "front-center",
    "rear-right", "middle-right", "front-right",
  ]);
});

test("formation detail panel rotates enemy formations counterclockwise so the front row becomes the left column", () => {
  assert.deepEqual(getFormationPanelDisplaySlotKeys("enemy"), [
    "front-right", "middle-right", "rear-right",
    "front-center", "middle-center", "rear-center",
    "front-left", "middle-left", "rear-left",
  ]);
});

test("formation detail panel leaves unknown sides unrotated", () => {
  assert.deepEqual(getFormationPanelDisplaySlotKeys("neutral"), FORMATION_SLOT_KEYS);
});
