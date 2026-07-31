const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");
const DINGYUAN_CITY_ID = "city.dingyuan";
const DINGYUAN_NODE_ID = "settlement.kaifeng_province";
const forbiddenHousePatterns = [/huangjue/i, /temple/i, /皇觉寺/];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8"));
}

function findCampaignNode(maps, nodeId) {
  const campaignMap = maps.find((map) => map.id === "map.yuanmo_campaign");
  assert.ok(campaignMap, "Expected map.yuanmo_campaign to exist.");
  return campaignMap.nodes.find((node) => node.id === nodeId);
}

function assertNoForbiddenHouseIds(houseIds, label) {
  for (const houseId of houseIds) {
    assert.equal(
      forbiddenHousePatterns.some((pattern) => pattern.test(houseId)),
      false,
      `${label}: Dingyuan must not expose Huangjue/temple house id ${houseId}.`
    );
  }
}

function assertDingyuanScenarioBinding({ label, mapsPath, citiesPath, housesPath }) {
  const maps = readJson(mapsPath);
  const cities = readJson(citiesPath);
  const houses = readJson(housesPath);
  const dingyuanCity = cities.find((city) => city.id === DINGYUAN_CITY_ID);
  const dingyuanNode = findCampaignNode(maps, DINGYUAN_NODE_ID);

  assert.ok(dingyuanCity, `${label}: expected city.dingyuan to exist.`);
  assert.equal(dingyuanCity.name, "定远", `${label}: city name is Dingyuan.`);
  assert.equal(
    dingyuanCity.mapNodeId,
    DINGYUAN_NODE_ID,
    `${label}: Dingyuan city points at the existing Dingyuan map node.`
  );
  assert.equal(dingyuanNode.kind, "city", `${label}: Dingyuan node is enterable.`);
  assert.equal(
    dingyuanNode.cityId,
    DINGYUAN_CITY_ID,
    `${label}: Dingyuan node enters city.dingyuan instead of Kaifeng.`
  );
  assertNoForbiddenHouseIds(dingyuanCity.houseIds, label);

  for (const houseId of dingyuanCity.houseIds) {
    const house = houses.find((candidate) => candidate.id === houseId);
    assert.ok(house, `${label}: expected Dingyuan house ${houseId} to exist.`);
    assert.equal(house.cityId, DINGYUAN_CITY_ID, `${label}: ${houseId} belongs to Dingyuan.`);
    assert.notEqual(house.name, "皇觉寺", `${label}: Dingyuan houses do not include Huangjue Temple.`);
  }
}

function assertDingyuanTemplateBinding({ label, mapsPath, citiesPath }) {
  const maps = readJson(mapsPath);
  const cities = readJson(citiesPath);
  const dingyuanCity = cities.find((city) => city.id === DINGYUAN_CITY_ID);
  const dingyuanNode = findCampaignNode(maps, DINGYUAN_NODE_ID);

  assert.ok(dingyuanCity, `${label}: expected city.dingyuan to exist.`);
  assert.equal(dingyuanCity.name, "定远", `${label}: city name is Dingyuan.`);
  assert.equal(dingyuanNode.cityId, DINGYUAN_CITY_ID);
  assertNoForbiddenHouseIds(dingyuanCity.houseIds, label);
  assertNoForbiddenHouseIds(
    (dingyuanCity.mountedBuildings ?? []).map((building) => building.buildingId),
    `${label} mounted buildings`
  );
}

test("Dingyuan map node enters new Dingyuan city data without Huangjue Temple", () => {
  assertDingyuanScenarioBinding({
    label: "scenario pack",
    mapsPath: "src/content/scenario-packs/zhuyuanzhang/maps.json",
    citiesPath: "src/content/scenario-packs/zhuyuanzhang/cities.json",
    housesPath: "src/content/scenario-packs/zhuyuanzhang/houses.json",
  });
  assertDingyuanTemplateBinding({
    label: "public script editor template",
    mapsPath: "public/script-editor-templates/zhuyuanzhang/maps.json",
    citiesPath: "public/script-editor-templates/zhuyuanzhang/cities.json",
  });
  assertDingyuanTemplateBinding({
    label: "builtin script editor template",
    mapsPath: "src/modules/script-editor/builtin-templates/zhuyuanzhang/maps.json",
    citiesPath: "src/modules/script-editor/builtin-templates/zhuyuanzhang/cities.json",
  });
});

test("Dingyuan city-stage layout exists and does not render a temple entry", () => {
  const layout = readJson(
    "src/content/scenario-packs/zhuyuanzhang/city-stages/dingyuan-city-layout.json"
  );
  const prefabs = readJson(
    "src/content/scenario-packs/zhuyuanzhang/city-stages/dingyuan-city-prefabs.json"
  );
  const houseEntities = layout.entities.filter((entity) => entity.entry?.type === "house");
  const houseIds = houseEntities.map((entity) => entity.entry.houseId);

  assert.equal(layout.map.id, "dingyuan");
  assert.equal(layout.map.name, "定远");
  assert.equal(Array.isArray(prefabs.prefabs), true);
  assert.equal(houseEntities.length >= 8, true);
  assert.equal(houseIds.includes("house.dingyuan.leader_residence"), true);
  assert.equal(houseIds.includes("house.dingyuan.keep"), true);
  assertNoForbiddenHouseIds(houseIds, "Dingyuan layout");
  assert.equal(
    houseEntities.some((entity) => /huangjuesi/i.test(entity.asset?.image ?? "")),
    false,
    "Dingyuan layout must not use the Huangjue Temple building artwork."
  );
});
