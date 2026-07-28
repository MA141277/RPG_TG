const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createTavernShortDeck,
  getTavernShortCardLabel,
  evaluateBestTavernShortShowdown,
  compareTavernShortBestFives,
  buildTavernShortPots,
  splitTavernShortPot,
} = require("../.test-dist/domain/tavern-short-gambling.js");

const byId = () =>
  Object.fromEntries(createTavernShortDeck().map((card) => [card.id, card]));

test("tavern short deck is a unique 52-card set with four suits and thirteen ranks", () => {
  const deck = createTavernShortDeck();
  assert.equal(deck.length, 52);
  assert.equal(new Set(deck.map((card) => card.id)).size, 52);
  assert.deepEqual(
    [...new Set(deck.map((card) => card.suit))].sort(),
    ["bing", "tiao", "tong", "wan"]
  );
  assert.deepEqual(
    [...new Set(deck.map((card) => card.rank))],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  );
  assert.equal(
    getTavernShortCardLabel(deck.find((card) => card.id === "wan-1")),
    "1万"
  );
});

test("tavern short evaluator treats rank 1 as Ace for wheel and royal flush", () => {
  const cards = byId();
  const wheel = evaluateBestTavernShortShowdown([
    cards["wan-1"],
    cards["bing-2"],
    cards["tong-3"],
    cards["tiao-4"],
    cards["wan-5"],
    cards["bing-9"],
    cards["tong-13"],
  ]);
  const royal = evaluateBestTavernShortShowdown([
    cards["wan-10"],
    cards["wan-11"],
    cards["wan-12"],
    cards["wan-13"],
    cards["wan-1"],
    cards["bing-3"],
    cards["tong-7"],
  ]);
  assert.equal(wheel.category, "straight");
  assert.equal(royal.category, "royal-flush");
  assert.equal(compareTavernShortBestFives(royal, wheel) > 0, true);
});

test("tavern short pot helpers build side pots and split remainders from dealer-next order", () => {
  const pots = buildTavernShortPots([
    { seatId: "you", committed: 1200, folded: false },
    { seatId: "traveler", committed: 1200, folded: false },
    { seatId: "broker", committed: 400, folded: false },
    { seatId: "guard", committed: 200, folded: true },
  ]);
  assert.deepEqual(
    pots.map((pot) => ({ amount: pot.amount, eligibleSeatIds: pot.eligibleSeatIds })),
    [
      { amount: 800, eligibleSeatIds: ["you", "traveler", "broker"] },
      { amount: 600, eligibleSeatIds: ["you", "traveler", "broker"] },
      { amount: 1600, eligibleSeatIds: ["you", "traveler"] },
    ]
  );
  assert.deepEqual(
    splitTavernShortPot(
      { id: "main", amount: 5, eligibleSeatIds: ["you", "traveler"] },
      ["traveler", "you"],
      ["you", "traveler", "broker", "guard"]
    ),
    [
      { seatId: "traveler", amount: 2 },
      { seatId: "you", amount: 3 },
    ]
  );
});
