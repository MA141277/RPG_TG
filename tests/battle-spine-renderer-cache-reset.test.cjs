const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");

function extractFunctionBody(signature) {
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
      if (depth === 0) {
        return source.slice(bodyStart + 1, index);
      }
    }
  }
  throw new Error(`Unclosed function body for: ${signature}`);
}

test("battle mode preloads all Spine troop renderers before the first attack animation", () => {
  assert.match(
    source,
    /const BATTLE_SPINE_PRELOAD_TROOP_TYPES = Object\.freeze\(\[[\s\S]*?'infantry'[\s\S]*?'archer'[\s\S]*?'spear'[\s\S]*?'cavalry'[\s\S]*?'gunpowder'[\s\S]*?\]\);/
  );
  assert.match(source, /function preloadBattleSpineRenderers\(troopTypes = BATTLE_SPINE_PRELOAD_TROOP_TYPES\) \{/);
  assert.match(
    extractFunctionBody("function init(config = {})"),
    /preloadBattleSpineRenderers\(\);/
  );
});

test("formation battle overlay keeps cached Spine renderers warm across ordinary battle entries", () => {
  assert.match(source, /function clearBattleSpineRendererCache\(cacheKey = null\) \{/);
  assert.doesNotMatch(
    extractFunctionBody("function showFormationBattleOverlay(report)"),
    /clearBattleSpineRendererCache\(\);/
  );
  assert.doesNotMatch(
    extractFunctionBody("function closeFormationBattleOverlay()"),
    /clearBattleSpineRendererCache\(\);/
  );
});

test("battle Spine project fetch allows browser caching instead of forcing a reload", () => {
  assert.doesNotMatch(
    extractFunctionBody("static async load(config = {})"),
    /cache:\s*['"]no-store['"]/
  );
});
