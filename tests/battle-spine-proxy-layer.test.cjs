const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");

test("battle melee strike proxy is hoisted above battle UI and target slots, while stationary ranged proxies stay on their source layer", () => {
  assert.match(
    source,
    /function createBattleSpineProxyFromSlot\(sourceSlot,\s*layer,\s*layerRect,\s*proxySide,\s*troopType,\s*stackOrder = 1000\)/,
  );
  assert.match(source, /const anchorPosition = getBattleSlotAnchorPosition\(sourceSlot,\s*layerRect\);/);
  assert.match(source, /proxyAnchor\.style\.zIndex = String\(stackOrder\);/);
  assert.match(source, /const box = document\.querySelector\('\.formation-battle-box'\);/);
  assert.match(source, /const layerRect = box\.getBoundingClientRect\(\);/);
  assert.match(source, /const sourceSlotZ = Number\(sourceSlot\.style\.zIndex \|\| 0\);/);
  assert.match(source, /const targetSlotZ = Number\(targetSlot\?\.style\.zIndex \|\| 0\);/);
  assert.match(source, /const elevateProxyLayer = !troopAsset\.stationaryAttack;/);
  assert.match(source, /const proxyLayer = elevateProxyLayer \? box : sourceGrid;/);
  assert.match(source, /const proxyLayerRect = elevateProxyLayer\s*\?\s*layerRect\s*:\s*sourceGrid\.getBoundingClientRect\(\);/);
  assert.match(source, /const proxyStackOrder = elevateProxyLayer\s*\?\s*1000 \+ Math\.max\(sourceSlotZ,\s*targetSlotZ\) \+ 1\s*:\s*sourceSlotZ;/);
  assert.match(source, /layer\.appendChild\(proxyAnchor\);/);
  assert.match(
    source,
    /const proxyView = createBattleSpineProxyFromSlot\(\s*sourceSlot,\s*proxyLayer,\s*proxyLayerRect,\s*proxySide,\s*troopType,\s*proxyStackOrder,\s*\);/,
  );
});
