const test = require("node:test");
const assert = require("node:assert/strict");

const {
  prototypeCities,
} = require("../.test-dist/content/prototype-world.js");
const {
  globalGoodsPool,
} = require("../.test-dist/content/markets/global-goods-pool.js");
const {
  settlementTradeGoodsCatalog,
  settlementTradeProfiles,
  settlementTradeProfilesByCityId,
} = require("../.test-dist/content/markets/settlement-trade-profiles.js");

test("settlement trade draft references known cities, goods, and current fallback goods", () => {
  const knownCityIds = new Set(prototypeCities.map((city) => city.id));
  const knownDraftGoodsIds = new Set(Object.keys(settlementTradeGoodsCatalog));
  const knownFallbackGoodsIds = new Set(globalGoodsPool.map((goods) => goods.id));

  assert.equal(settlementTradeProfiles.length, 21);

  for (const profile of settlementTradeProfiles) {
    assert.equal(
      knownCityIds.has(profile.cityId),
      true,
      `Unknown city id in settlement trade draft: ${profile.cityId}`
    );

    for (const goodsId of [
      ...profile.exportTiers.primary,
      ...profile.exportTiers.secondary,
      ...profile.exportTiers.rare,
      ...profile.shortages,
      ...profile.rareDemands,
    ]) {
      assert.equal(
        knownDraftGoodsIds.has(goodsId),
        true,
        `Unknown goods id "${goodsId}" referenced by ${profile.cityId}`
      );
    }

    for (const [goodsId, sourceCityIds] of Object.entries(profile.importSources)) {
      assert.equal(
        knownDraftGoodsIds.has(goodsId),
        true,
        `Unknown import goods id "${goodsId}" referenced by ${profile.cityId}`
      );

      for (const sourceCityId of sourceCityIds) {
        assert.equal(
          knownCityIds.has(sourceCityId),
          true,
          `Unknown import source city "${sourceCityId}" referenced by ${profile.cityId}`
        );
      }
    }
  }

  for (const [goodsId, goodsDefinition] of Object.entries(settlementTradeGoodsCatalog)) {
    for (const fallbackGoodsId of goodsDefinition.runtimeFallbackGoodsIds) {
      assert.equal(
        knownFallbackGoodsIds.has(fallbackGoodsId),
        true,
        `Unknown fallback goods id "${fallbackGoodsId}" referenced by ${goodsId}`
      );
    }
  }
});

test("settlement trade draft preserves the approved flagship city routes", () => {
  assert.deepEqual(
    settlementTradeProfilesByCityId["city.yingtian"].exportTiers.primary,
    ["yunjin"]
  );
  assert.deepEqual(
    settlementTradeProfilesByCityId["city.yangzhou"].exportTiers.primary,
    ["huai_salt"]
  );
  assert.deepEqual(
    settlementTradeProfilesByCityId["city.gongchang"].exportTiers.primary,
    ["medicinals"]
  );

  assert.deepEqual(
    settlementTradeProfilesByCityId["city.kulan"].shortages,
    ["yunjin", "huai_salt"]
  );
  assert.deepEqual(
    settlementTradeProfilesByCityId["city.dadu"].rareDemands,
    ["gold_leaf", "imported_goods"]
  );
});

test("draft-only historical goods carry a temporary nonlocal premium rule", () => {
  const expectedGoodsIds = [
    "fish_goods",
    "salted_duck_egg",
    "wuchang_fish",
    "sea_goods",
    "alum",
    "alum_ore",
    "refined_alum",
    "lychee",
  ];
  const actualGoodsIds = Object.entries(settlementTradeGoodsCatalog)
    .filter(([, definition]) => definition.temporaryArbitragePricing != null)
    .map(([goodsId]) => goodsId)
    .sort();

  assert.deepEqual(actualGoodsIds, [...expectedGoodsIds].sort());

  for (const goodsId of expectedGoodsIds) {
    const pricing = settlementTradeGoodsCatalog[goodsId].temporaryArbitragePricing;
    assert.equal(pricing.strategy, "origin-cheaper-nonlocal-higher");
    assert.equal(pricing.localBuyPriceMultiplier < 1, true);
    assert.equal(pricing.nonLocalSellPriceMultiplier > 1, true);
    assert.equal(
      pricing.localBuyPriceMultiplier < pricing.nonLocalSellPriceMultiplier,
      true
    );
  }
});
