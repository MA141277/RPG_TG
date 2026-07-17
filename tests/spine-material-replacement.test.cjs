const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const source = fs.readFileSync("tools/spine-node-timeline-editor.html", "utf8");

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

function loadMaterialReplacementFns(unitType = "swordsman") {
  const specsMatch = source.match(/const baseMaterialReplacementSpecs = (\[[\s\S]*?\n\s*\]);/);
  if (!specsMatch) {
    throw new Error("Missing baseMaterialReplacementSpecs constant");
  }
  const baseMaterialReplacementSpecs = new Function(`return ${specsMatch[1]};`)();
  const specsBody = extractFunctionBody("function materialReplacementSpecsForUnit(unitType = state.currentUnitType)");
  const matchBody = extractFunctionBody("function matchMaterialInputComponents(inputImageData, inputComponents, slots)");
  const normalizeMatchBody = extractFunctionBody(
    "function normalizeMatchedMaterialPiece(pieceImageData, slot, padding = materialReplacementOptions.padding)",
  );
  const state = { currentUnitType: unitType };
  const materialReplacementOptions = { padding: 2 };
  const materialReplacementSpecsForUnit = new Function(
    "state",
    "baseMaterialReplacementSpecs",
    `return function materialReplacementSpecsForUnit(unitType = state.currentUnitType) {${specsBody}};`,
  )(state, baseMaterialReplacementSpecs);
  const matchMaterialInputComponents = new Function(
    `return function matchMaterialInputComponents(inputImageData, inputComponents, slots) {${matchBody}};`,
  )();
  const normalizeMatchedMaterialPiece = new Function(
    "materialReplacementOptions",
    "normalizeMaterialPiece",
    `return function normalizeMatchedMaterialPiece(pieceImageData, slot, padding = materialReplacementOptions.padding) {${normalizeMatchBody}};`,
  )(materialReplacementOptions, (pieceImageData, width, height, padding) => ({ pieceImageData, width, height, padding }));
  return { materialReplacementSpecsForUnit, matchMaterialInputComponents, normalizeMatchedMaterialPiece };
}

test("Spine editor defines unit-aware material replacement specs", () => {
  assert.match(source, /function materialReplacementSpecsForUnit\(unitType = state\.currentUnitType\) \{/);
  assert.match(source, /unitType === "spearman"/);
});

test("spearman material replacement preserves the raw weapon component size", () => {
  const { materialReplacementSpecsForUnit, normalizeMatchedMaterialPiece } = loadMaterialReplacementFns("spearman");
  const swordSlot = materialReplacementSpecsForUnit("spearman").find((slot) => slot.id === "sword");
  const extracted = { width: 80, height: 980 };

  const normalized = normalizeMatchedMaterialPiece(extracted, swordSlot, 2);

  assert.equal(swordSlot.preserveComponentBounds, true);
  assert.equal(swordSlot.preserveExtractedSize, true);
  assert.equal(normalized, extracted);
});

test("swordsman material replacement still normalizes the weapon component to the reference sword box", () => {
  const { materialReplacementSpecsForUnit, normalizeMatchedMaterialPiece } = loadMaterialReplacementFns("swordsman");
  const swordSlot = materialReplacementSpecsForUnit("swordsman").find((slot) => slot.id === "sword");
  const extracted = { width: 80, height: 980 };

  const normalized = normalizeMatchedMaterialPiece(extracted, swordSlot, 2);

  assert.notEqual(normalized, extracted);
  assert.equal(normalized.width, swordSlot.targetWidth);
  assert.equal(normalized.height, swordSlot.targetHeight);
});

test("spearman material replacement keeps an oversized weapon component instead of falling back to the short-sword slot box", () => {
  const { matchMaterialInputComponents } = loadMaterialReplacementFns("spearman");
  const inputImageData = { width: 1000, height: 1000 };
  const swordSlot = {
    id: "sword",
    targetWidth: 104,
    targetHeight: 637,
    preserveComponentBounds: true,
    referenceImageSize: { width: 1000, height: 1000 },
    reference: { minX: 40, minY: 100, maxX: 143, maxY: 736, width: 104, height: 637, cx: 92, cy: 418.5 },
    normalizedCenter: { x: 0.092, y: 0.4185 },
  };
  const matches = matchMaterialInputComponents(
    inputImageData,
    [{ minX: 30, minY: 60, maxX: 109, maxY: 959, width: 80, height: 900, cx: 70, cy: 510 }],
    [swordSlot],
  );

  assert.equal(matches[0].mode, "component");
  assert.deepEqual(matches[0].component, { minX: 30, minY: 60, maxX: 109, maxY: 959, width: 80, height: 900, cx: 70, cy: 510 });
});

test("swordsman material replacement still falls back when a weapon component is too tall for the sword slot", () => {
  const { matchMaterialInputComponents } = loadMaterialReplacementFns("swordsman");
  const inputImageData = { width: 1000, height: 1000 };
  const swordSlot = {
    id: "sword",
    targetWidth: 104,
    targetHeight: 637,
    referenceImageSize: { width: 1000, height: 1000 },
    reference: { minX: 40, minY: 100, maxX: 143, maxY: 736, width: 104, height: 637, cx: 92, cy: 418.5 },
    normalizedCenter: { x: 0.092, y: 0.4185 },
  };
  const matches = matchMaterialInputComponents(
    inputImageData,
    [{ minX: 30, minY: 60, maxX: 109, maxY: 959, width: 80, height: 900, cx: 70, cy: 510 }],
    [swordSlot],
  );

  assert.equal(matches[0].mode, "slot");
  assert.deepEqual(matches[0].component, {
    minX: 40,
    minY: 100,
    maxX: 143,
    maxY: 736,
    width: 104,
    height: 637,
    cx: 92,
    cy: 418.5,
  });
});
