const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const packRoot = path.join(
  root,
  "src",
  "content",
  "scenario-packs",
  "zhuyuanzhang"
);

function readPackJson(fileName) {
  return JSON.parse(fs.readFileSync(path.join(packRoot, fileName), "utf8"));
}

test("Yuanmo new city grain shops expose a default shopkeeper for trade actions", () => {
  const houses = readPackJson("houses.json");
  const characters = readPackJson("characters.json");
  const targetGrainShopIds = [
    "house.anfeng.grain_shop",
    "house.runing.grain_shop",
    "house.luzhou.grain_shop",
  ];

  for (const houseId of targetGrainShopIds) {
    const house = houses.find((candidate) => candidate.id === houseId);
    assert.ok(house, `Expected ${houseId} to exist.`);
    assert.equal(house.moduleId, "grain-shop");
    assert.equal(
      typeof house.defaultCharacterId === "string" &&
        house.defaultCharacterId.length > 0,
      true,
      `Expected ${houseId} to bind a default grain shopkeeper.`
    );
    assert.equal(
      house.characterIds.includes(house.defaultCharacterId),
      true,
      `Expected ${houseId} characterIds to include its default shopkeeper.`
    );

    const shopkeeper = characters.find(
      (candidate) => candidate.id === house.defaultCharacterId
    );
    assert.ok(shopkeeper, `Expected ${house.defaultCharacterId} to exist.`);
    assert.equal(shopkeeper.cityId, house.cityId);
    assert.equal(shopkeeper.houseId, house.id);
  }
});
