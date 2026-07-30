const test = require("node:test");
const assert = require("node:assert/strict");

const {
  quoteSettlementDraftTradeRoute,
} = require("../.test-dist/application/markets/settlement-trade-draft-pricing.js");

test("quotes a positive nonlocal spread for draft-only industrial goods", () => {
  const quote = quoteSettlementDraftTradeRoute({
    goodsId: "alum",
    originCityId: "city.wenzhou",
    targetCityId: "city.yingtian",
  });

  assert.equal(quote?.usesTemporaryArbitragePricing, true);
  assert.equal(quote?.originCityExportsGoods, true);
  assert.equal(quote?.originBuyPrice < quote?.targetSellPrice, true);
  assert.equal((quote?.profitPerUnit ?? 0) > 0, true);
});

test("quotes a positive nonlocal spread for draft-only fruit goods", () => {
  const quote = quoteSettlementDraftTradeRoute({
    goodsId: "lychee",
    originCityId: "city.fuzhou",
    targetCityId: "city.dadu",
  });

  assert.equal(quote?.usesTemporaryArbitragePricing, true);
  assert.equal(quote?.originCityExportsGoods, true);
  assert.equal(quote?.originBuyPrice < quote?.targetSellPrice, true);
  assert.equal((quote?.profitPerUnit ?? 0) > 0, true);
});

test("does not quote temporary route pricing for goods outside the draft-only set", () => {
  const quote = quoteSettlementDraftTradeRoute({
    goodsId: "yunjin",
    originCityId: "city.yingtian",
    targetCityId: "city.kulan",
  });

  assert.equal(quote, null);
});
