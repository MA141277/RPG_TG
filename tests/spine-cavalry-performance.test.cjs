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

function loadSource() {
  return fs.readFileSync("tools/spine-node-timeline-editor.html", "utf8");
}

test("cavalry import caps oversized full-skin textures while preserving world-space size", () => {
  const source = loadSource();
  const body = extractFunctionBody(source, "function computeImportedFullSkinScale(width, height, worldScale)");
  const computeImportedFullSkinScale = new Function(
    `return function computeImportedFullSkinScale(width, height, worldScale) {${body}};`,
  )();

  const result = computeImportedFullSkinScale(1791, 1427, 620 / 4320);
  assert.equal(result.scaled, true);
  assert.ok(result.targetWidth < 1791);
  assert.ok(result.targetHeight < 1427);
  assert.ok(Math.max(result.targetWidth, result.targetHeight) <= 768);
  assert.ok(result.renderScaleMultiplier > 1);

  const originalDisplayWidth = 1791 * (620 / 4320);
  const resizedDisplayWidth = result.targetWidth * (620 / 4320) * result.renderScaleMultiplier;
  assert.ok(Math.abs(originalDisplayWidth - resizedDisplayWidth) < 0.75);

  assert.match(source, /const optimized = optimizeCavalryFullSkinImage\(imageData,\s*transform\.scale\);/);
  assert.match(source, /renderScaleMultiplier:\s*optimized\.renderScaleMultiplier/);
  assert.match(source, /scale:\s*transform\.scale \* \(image\.renderScaleMultiplier \|\| 1\)/);
});
