const test = require("node:test");
const assert = require("node:assert/strict");

const {
  prototypeCities,
} = require("../.test-dist/content/prototype-world.js");
const {
  runtimeTradeGoodsPool,
  getRuntimeTradeGoodDefinition,
} = require("../.test-dist/content/markets/runtime-trade-goods-pool.js");
const {
  generateShopInventory,
} = require("../.test-dist/application/markets/shop-inventory-generator.js");
const {
  generateGoodsPrice,
} = require("../.test-dist/application/markets/price-generator.js");
const {
  projectBackpackItems,
} = require("../.test-dist/application/inventory/item-inventory.js");
const {
  getPlayerItemQuantityVariableKey,
} = require("../.test-dist/application/inventory/player-item-inventory.js");

const citiesById = Object.fromEntries(
  prototypeCities.map((cityDefinition) => [cityDefinition.id, cityDefinition])
);

function createEmptyValuableInventory() {
  return {
    items: [],
    selectedItemId: null,
    equippedWeaponSet: {
      swordId: null,
      armorId: null,
    },
  };
}

test("runtime trade goods pool includes all eight settlement draft-only goods", () => {
  const draftGoods = runtimeTradeGoodsPool
    .filter((goodsDefinition) => goodsDefinition.shopType === "settlement-trade")
    .map((goodsDefinition) => goodsDefinition.id)
    .sort();

  assert.deepEqual(draftGoods, [
    "alum",
    "alum_ore",
    "fish_goods",
    "lychee",
    "refined_alum",
    "salted_duck_egg",
    "sea_goods",
    "wuchang_fish",
  ]);
});

test("settlement trade refresh can generate Wenzhou alum cargo inventory", () => {
  const inventory = generateShopInventory(
    citiesById["city.wenzhou"],
    "settlement-trade",
    runtimeTradeGoodsPool,
    [],
    1,
    () => 0.999
  );

  assert.equal(
    inventory.inventory.some((entry) => entry.goodsId === "alum"),
    true
  );
  assert.equal(
    inventory.inventory.some((entry) => entry.goodsId === "refined_alum"),
    true
  );
});

test("settlement draft runtime pricing keeps Yingtian alum resale above Wenzhou buy price", () => {
  const alumDefinition = getRuntimeTradeGoodDefinition("alum");

  assert.ok(alumDefinition);

  const wenzhouPrice = generateGoodsPrice(
    citiesById["city.wenzhou"],
    alumDefinition,
    [],
    () => 0.5
  );
  const yingtianPrice = generateGoodsPrice(
    citiesById["city.yingtian"],
    alumDefinition,
    [],
    () => 0.5
  );

  assert.equal(wenzhouPrice.buyPrice < yingtianPrice.sellPrice, true);
});

test("backpack projection shows settlement draft runtime goods through unified player items", () => {
  const items = projectBackpackItems({
    valuableInventory: createEmptyValuableInventory(),
    gameState: {
      runtime: {
        variables: {
          [getPlayerItemQuantityVariableKey("alum")]: 2,
        },
      },
    },
  });

  const alumItem = items.find((item) => item.id === "item.trade.alum");

  assert.equal(alumItem?.count, 2);
  assert.deepEqual(alumItem?.types, ["other", "trade", "industrial"]);
  assert.equal(typeof alumItem?.name, "string");
  assert.equal(typeof alumItem?.description, "string");
});
