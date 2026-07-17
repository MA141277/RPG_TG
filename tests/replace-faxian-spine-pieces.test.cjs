const test = require("node:test");
const assert = require("node:assert/strict");

async function loadReplaceFaxianSpinePiecesModule() {
  return import("../tools/replace-faxian-spine-pieces.mjs");
}

test("replace-faxian-spine-pieces exposes unit-aware part specs for spearman weapon preservation", async () => {
  const mod = await loadReplaceFaxianSpinePiecesModule();
  assert.equal(typeof mod.partsForUnit, "function");

  const swordPart = mod.partsForUnit("spearman").find((part) => part.id === "sword");
  assert.equal(swordPart.preserveComponentBounds, true);
  assert.equal(swordPart.preserveExtractedSize, true);
});

test("replace-faxian-spine-pieces keeps oversized spearman weapon components instead of falling back to the short-sword slot box", async () => {
  const mod = await loadReplaceFaxianSpinePiecesModule();
  const swordSlot = mod.partsForUnit("spearman").find((part) => part.id === "sword");
  const inputPng = { width: 1000, height: 1000 };
  const matches = mod.matchInputComponents(
    inputPng,
    [{ minX: 30, minY: 60, maxX: 109, maxY: 959, width: 80, height: 900, cx: 70, cy: 510 }],
    [
      {
        ...swordSlot,
        referenceImageSize: { width: 1000, height: 1000 },
        reference: { minX: 40, minY: 100, maxX: 143, maxY: 736, width: 104, height: 637, cx: 92, cy: 418.5 },
        normalizedCenter: { x: 0.092, y: 0.4185 },
      },
    ],
  );

  assert.equal(matches[0].mode, "component");
  assert.deepEqual(matches[0].component, {
    minX: 30,
    minY: 60,
    maxX: 109,
    maxY: 959,
    width: 80,
    height: 900,
    cx: 70,
    cy: 510,
  });
});

test("replace-faxian-spine-pieces preserves extracted spearman weapon size during normalization", async () => {
  const mod = await loadReplaceFaxianSpinePiecesModule();
  const swordSlot = mod.partsForUnit("spearman").find((part) => part.id === "sword");
  const piece = { width: 80, height: 980 };

  const normalized = mod.normalizeMatchedPiece(piece, swordSlot, 2);

  assert.equal(normalized, piece);
});
