const test = require("node:test");
const assert = require("node:assert/strict");

function loadResolver() {
  return require("../.test-dist/application/txt-narrative/txt-narrative-place-resolver.js");
}

const knownPlaces = [
  {
    houseId: "house.kulan.temple",
    placeName: "皇觉寺",
  },
  {
    houseId: "house.kulan.grain_shop",
    placeName: "粮行",
  },
  {
    houseId: "house.kulan.inn",
    placeName: "客栈",
  },
];

test("TXT place resolver returns exact matches when the place name already exists", () => {
  const { resolveTxtNarrativePlace } = loadResolver();

  const match = resolveTxtNarrativePlace({
    requestedName: "皇觉寺",
    knownPlaces,
  });

  assert.deepEqual(match, {
    requestedName: "皇觉寺",
    resolvedHouseId: "house.kulan.temple",
    resolvedPlaceName: "皇觉寺",
    strategy: "exact",
    confidence: 1,
  });
});

test("TXT place resolver falls back to fuzzy_existing when a close authored place is available", () => {
  const { resolveTxtNarrativePlace } = loadResolver();

  const match = resolveTxtNarrativePlace({
    requestedName: "粮仓",
    knownPlaces,
  });

  assert.equal(match.requestedName, "粮仓");
  assert.equal(match.resolvedHouseId, "house.kulan.grain_shop");
  assert.equal(match.resolvedPlaceName, "粮行");
  assert.equal(match.strategy, "fuzzy_existing");
  assert.ok(match.confidence > 0);
});

test("TXT place resolver creates a temporary narrative place when no reliable authored match exists", () => {
  const { resolveTxtNarrativePlace } = loadResolver();

  const match = resolveTxtNarrativePlace({
    requestedName: "山门外粥棚",
    knownPlaces,
  });

  assert.deepEqual(match, {
    requestedName: "山门外粥棚",
    strategy: "temporary_generated",
    confidence: 0,
    note: "no-authored-place-match",
  });
});
