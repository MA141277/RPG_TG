const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");
const HAOZHOU_CITY_ID = "city.kulan";
const HAOZHOU_NODE_ID = "settlement.fenyang_province";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, filePath), "utf8"));
}

function findCampaignNode(maps, nodeId) {
  const campaignMap = maps.find((map) => map.id === "map.yuanmo_campaign");

  assert.ok(campaignMap, "Expected map.yuanmo_campaign to exist.");

  return campaignMap.nodes.find((node) => node.id === nodeId);
}

function assertHaozhouBinding({ label, mapsPath, citiesPath }) {
  const maps = readJson(mapsPath);
  const cities = readJson(citiesPath);
  const haozhouCity = cities.find((city) => city.id === HAOZHOU_CITY_ID);
  const haozhouNode = findCampaignNode(maps, HAOZHOU_NODE_ID);

  assert.ok(haozhouCity, `${label}: expected old Haozhou city data to exist.`);
  assert.ok(haozhouNode, `${label}: expected Haozhou map node to exist.`);
  assert.equal(haozhouCity.mapNodeId, HAOZHOU_NODE_ID, `${label}: city points at Haozhou node.`);
  assert.equal(haozhouNode.kind, "city", `${label}: Haozhou map node is enterable as a city.`);
  assert.equal(haozhouNode.cityId, HAOZHOU_CITY_ID, `${label}: Haozhou node points at old data.`);
}

test("Haozhou map node binds to old Haozhou city data across scenario content copies", () => {
  assertHaozhouBinding({
    label: "scenario pack",
    mapsPath: "src/content/scenario-packs/zhuyuanzhang/maps.json",
    citiesPath: "src/content/scenario-packs/zhuyuanzhang/cities.json",
  });
  assertHaozhouBinding({
    label: "public script editor template",
    mapsPath: "public/script-editor-templates/zhuyuanzhang/maps.json",
    citiesPath: "public/script-editor-templates/zhuyuanzhang/cities.json",
  });
  assertHaozhouBinding({
    label: "builtin script editor template",
    mapsPath: "src/modules/script-editor/builtin-templates/zhuyuanzhang/maps.json",
    citiesPath: "src/modules/script-editor/builtin-templates/zhuyuanzhang/cities.json",
  });
});

test("runtime Yuanmo campaign map keeps Haozhou enterable through old Haozhou data", () => {
  const source = fs.readFileSync(
    path.join(repoRoot, "src", "content", "yuanmo-campaign-map.ts"),
    "utf8"
  );
  const nodeMatch = source.match(
    /\{"id": "settlement\.fenyang_province"[\s\S]*?structureVisual: \{ kind: "settlement-building" \}\}/
  );

  assert.ok(nodeMatch, "Expected runtime Haozhou node source to exist.");
  assert.match(nodeMatch[0], /"kind": "city"/);
  assert.match(nodeMatch[0], /"cityId": "city\.kulan"/);
});
