const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");
const packRoot = path.join(repoRoot, "src", "content", "scenario-packs", "zhuyuanzhang");
const stageRoot = path.join(packRoot, "city-stages");
const cityStageLayoutSourcePath = path.join(
  repoRoot,
  "src",
  "ui",
  "views",
  "city",
  "city-stage-layout.ts"
);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function resolveProjectAssetPath(assetPath) {
  return path.join(repoRoot, assetPath);
}

test("huangcun is a no-house village placed at the Yuanmo campaign opening coordinate", () => {
  const maps = readJson(path.join(packRoot, "maps.json"));
  const cities = readJson(path.join(packRoot, "cities.json"));
  const campaignMap = maps.find((map) => map.id === "map.yuanmo_campaign");
  const huangcun = cities.find((city) => city.id === "city.huangcun");
  const huangcunNode = campaignMap?.nodes.find((node) => node.id === "settlement.huangcun");

  assert.ok(campaignMap, "Expected map.yuanmo_campaign to exist.");
  assert.ok(huangcun, "Expected city.huangcun to exist.");
  assert.ok(huangcunNode, "Expected settlement.huangcun to exist on map.yuanmo_campaign.");
  assert.equal(huangcun.name, "荒村");
  assert.deepEqual(huangcun.houseIds, []);
  assert.equal(huangcun.mapNodeId, "settlement.huangcun");
  assert.equal(huangcunNode.kind, "settlement");
  assert.equal(huangcunNode.cityId, "city.huangcun");
  assert.equal(huangcunNode.label, "荒村");
  assert.deepEqual(
    { x: huangcunNode.x, y: huangcunNode.y },
    campaignMap.initialPlayerCoordinate
  );
});

test("huangcun city-stage layout keeps city layers empty while using grass as prefabs", () => {
  const layout = readJson(path.join(stageRoot, "huangcun-city-layout.json"));
  const prefabs = readJson(path.join(stageRoot, "huangcun-city-prefabs.json"));
  const prefabById = new Map(prefabs.prefabs.map((prefab) => [prefab.id, prefab]));

  assert.equal(layout.map.id, "huangcun");
  assert.equal(layout.map.name, "荒村");
  assert.equal(layout.map.backgroundImage, "");
  assert.equal(layout.map.foregroundImage, "");
  assert.equal(layout.instances.length >= 20, true);

  const houseInstances = layout.instances.filter((instance) =>
    instance.prefabId.startsWith("ruined-house-")
  );
  const grassInstances = layout.instances.filter((instance) =>
    instance.prefabId.startsWith("grass-")
  );

  assert.equal(houseInstances.length, 4);
  assert.equal(grassInstances.length >= 16, true);
  assert.equal(
    layout.instances.every((instance) => prefabById.has(instance.prefabId)),
    true
  );
  assert.equal(
    prefabs.prefabs.every((prefab) => prefab.entry.type === "none"),
    true
  );
  assert.equal(
    prefabs.prefabs.some((prefab) => prefab.id.startsWith("grass-")),
    true
  );
  assert.equal(
    prefabs.prefabs.every((prefab) =>
      fs.existsSync(resolveProjectAssetPath(prefab.asset.image))
    ),
    true
  );
  assert.equal(
    prefabs.prefabs.some((prefab) => /farm|field|farmland|农田/.test(prefab.id + prefab.name)),
    false
  );
});

test("city-stage renderer skips city layer images when a layout leaves them empty", () => {
  const source = fs.readFileSync(cityStageLayoutSourcePath, "utf8");

  assert.match(source, /function renderStageBackgroundImage/);
  assert.match(source, /layout\.map\.backgroundImage\.trim\(\)\.length === 0/);
  assert.match(source, /\$\{renderStageBackgroundImage\(layout\)\}/);
  assert.match(source, /function renderStageForegroundImage/);
  assert.match(source, /layout\.map\.foregroundImage\.trim\(\)\.length === 0/);
  assert.match(source, /\$\{renderStageForegroundImage\(layout\)\}/);
});
