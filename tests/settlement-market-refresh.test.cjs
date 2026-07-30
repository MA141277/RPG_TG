const test = require("node:test");
const assert = require("node:assert/strict");

const {
  prototypeCities,
} = require("../.test-dist/content/prototype-world.js");
const {
  globalGoodsPool,
} = require("../.test-dist/content/markets/global-goods-pool.js");
const {
  generateGoodsPrice,
} = require("../.test-dist/application/markets/price-generator.js");
const {
  calculateTradeGoodSelectionWeight,
} = require("../.test-dist/application/markets/shop-inventory-generator.js");

const citiesById = Object.fromEntries(
  prototypeCities.map((cityDefinition) => [cityDefinition.id, cityDefinition])
);
const goodsById = Object.fromEntries(
  globalGoodsPool.map((goodsDefinition) => [goodsDefinition.id, goodsDefinition])
);

function fixedRandomSource() {
  return 0.5;
}

test("settlement medicinal exports and shortages split herb weights and prices", () => {
  const gongchangHerbsWeight = calculateTradeGoodSelectionWeight(
    citiesById["city.gongchang"],
    goodsById.herbs,
    []
  );
  const yingtianHerbsWeight = calculateTradeGoodSelectionWeight(
    citiesById["city.yingtian"],
    goodsById.herbs,
    []
  );

  assert.equal(gongchangHerbsWeight > yingtianHerbsWeight, true);

  const gongchangHerbsBuyPrice = generateGoodsPrice(
    citiesById["city.gongchang"],
    goodsById.herbs,
    [],
    fixedRandomSource
  ).buyPrice;
  const yingtianHerbsBuyPrice = generateGoodsPrice(
    citiesById["city.yingtian"],
    goodsById.herbs,
    [],
    fixedRandomSource
  ).buyPrice;

  assert.equal(gongchangHerbsBuyPrice < yingtianHerbsBuyPrice, true);
});

test("settlement shortages make Kulan salt rarer and pricier than Yangzhou salt", () => {
  const kulanSaltWeight = calculateTradeGoodSelectionWeight(
    citiesById["city.kulan"],
    goodsById.salt,
    []
  );
  const yangzhouSaltWeight = calculateTradeGoodSelectionWeight(
    citiesById["city.yangzhou"],
    goodsById.salt,
    []
  );

  assert.equal(kulanSaltWeight < yangzhouSaltWeight, true);

  const kulanSaltBuyPrice = generateGoodsPrice(
    citiesById["city.kulan"],
    goodsById.salt,
    [],
    fixedRandomSource
  ).buyPrice;
  const yangzhouSaltBuyPrice = generateGoodsPrice(
    citiesById["city.yangzhou"],
    goodsById.salt,
    [],
    fixedRandomSource
  ).buyPrice;

  assert.equal(kulanSaltBuyPrice > yangzhouSaltBuyPrice, true);
});

test("settlement rare-demand capitals pay more for antiques than export cities", () => {
  const yingtianAntiqueWeight = calculateTradeGoodSelectionWeight(
    citiesById["city.yingtian"],
    goodsById.antique,
    []
  );
  const daduAntiqueWeight = calculateTradeGoodSelectionWeight(
    citiesById["city.dadu"],
    goodsById.antique,
    []
  );

  assert.equal(yingtianAntiqueWeight > daduAntiqueWeight, true);

  const yingtianAntiqueBuyPrice = generateGoodsPrice(
    citiesById["city.yingtian"],
    goodsById.antique,
    [],
    fixedRandomSource
  ).buyPrice;
  const daduAntiqueBuyPrice = generateGoodsPrice(
    citiesById["city.dadu"],
    goodsById.antique,
    [],
    fixedRandomSource
  ).buyPrice;

  assert.equal(daduAntiqueBuyPrice > yingtianAntiqueBuyPrice, true);
});
