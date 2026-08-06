const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createTavernShortDeck,
  createTavernShortHand,
  reorderTavernShortDisplayOrderEntries,
  syncTavernShortDisplayOrderEntries,
  toTavernShortDisplayOrderEntryId,
} = require("../.test-dist/domain/tavern-short-gambling.js");
const {
  createTavernShortTableSession,
  updateTavernShortTableSession,
} = require("../.test-dist/application/house-modules/tavern/tavern-short-gamble-session.js");

const byId = () =>
  Object.fromEntries(createTavernShortDeck().map((card) => [card.id, card]));

function configureHumanHand(baseHand, cards) {
  return {
    ...baseHand,
    players: baseHand.players.map((player) =>
      player.seatId !== "you"
        ? player
        : {
            ...player,
            hand: [
              cards["wan-2"],
              cards["tong-4"],
              cards["east"],
              cards["wan-5"],
              cards["tong-6"],
            ],
          }
    ),
    publicCards: [cards["wan-7"], cards["tong-8"]],
    pendingIncomingCard: null,
    selectedDiscardCardId: null,
    liftedDiscardCardId: null,
    droppingDiscardCardId: null,
  };
}

test("tavern short display-order sync initializes visible hand entries and public ghosts with separator-safe ids", () => {
  const cards = byId();
  const hand = configureHumanHand(
    createTavernShortHand({
      seed: 31,
      dealerSeatIndex: 0,
      playerName: "tester",
      openingStacks: [1200, 1200, 1200, 1200],
    }),
    cards
  );

  const synced = syncTavernShortDisplayOrderEntries(hand, "you");

  assert.deepEqual(
    synced.displayOrderEntries.map(toTavernShortDisplayOrderEntryId),
    [
      "hand|wan-2",
      "hand|tong-4",
      "hand|east",
      "hand|wan-5",
      "hand|tong-6",
      "public-ghost|wan-7",
      "public-ghost|tong-8",
    ]
  );
  assert.equal(
    toTavernShortDisplayOrderEntryId({
      kind: "public-ghost",
      cardId: "wan-7",
    }),
    "public-ghost|wan-7"
  );
});

test("tavern short display-order sync preserves custom order while appending new visible entries and pruning stale ones", () => {
  const cards = byId();
  const configured = configureHumanHand(
    createTavernShortHand({
      seed: 37,
      dealerSeatIndex: 0,
      playerName: "tester",
      openingStacks: [1200, 1200, 1200, 1200],
    }),
    cards
  );
  const base = syncTavernShortDisplayOrderEntries(configured, "you");
  const reordered = reorderTavernShortDisplayOrderEntries(
    base,
    "you",
    "public-ghost|wan-7",
    "hand|tong-4"
  );

  const withNewEntries = syncTavernShortDisplayOrderEntries(
    {
      ...reordered,
      publicCards: [cards["wan-7"], cards["tong-8"], cards["tiao-9"]],
      pendingIncomingCard: {
        ownerSeatId: "you",
        source: "draw",
        card: cards["bai"],
      },
    },
    "you"
  );

  assert.deepEqual(
    withNewEntries.displayOrderEntries.map(toTavernShortDisplayOrderEntryId),
    [
      "hand|wan-2",
      "public-ghost|wan-7",
      "hand|tong-4",
      "hand|east",
      "hand|wan-5",
      "hand|tong-6",
      "public-ghost|tong-8",
      "public-ghost|tiao-9",
      "incoming-draw|bai",
    ]
  );

  const pruned = syncTavernShortDisplayOrderEntries(
    {
      ...withNewEntries,
      publicCards: [cards["tong-8"]],
      pendingIncomingCard: null,
    },
    "you"
  );

  assert.deepEqual(
    pruned.displayOrderEntries.map(toTavernShortDisplayOrderEntryId),
    [
      "hand|wan-2",
      "hand|tong-4",
      "hand|east",
      "hand|wan-5",
      "hand|tong-6",
      "public-ghost|tong-8",
    ]
  );
});

test("tavern short display-order reorder moves only mixed display entries and keeps the true hand untouched", () => {
  const cards = byId();
  const configured = syncTavernShortDisplayOrderEntries(
    configureHumanHand(
      createTavernShortHand({
        seed: 41,
        dealerSeatIndex: 0,
        playerName: "tester",
        openingStacks: [1200, 1200, 1200, 1200],
      }),
      cards
    ),
    "you"
  );

  const reordered = reorderTavernShortDisplayOrderEntries(
    configured,
    "you",
    "public-ghost|wan-7",
    "hand|tong-4"
  );

  assert.deepEqual(
    reordered.displayOrderEntries.map(toTavernShortDisplayOrderEntryId),
    [
      "hand|wan-2",
      "public-ghost|wan-7",
      "hand|tong-4",
      "hand|east",
      "hand|wan-5",
      "hand|tong-6",
      "public-ghost|tong-8",
    ]
  );
  assert.deepEqual(
    reordered.players.find((player) => player.seatId === "you")?.hand.map((card) => card.id),
    ["wan-2", "tong-4", "east", "wan-5", "tong-6"]
  );
});

test("tavern short session normalization auto-draws and syncs the incoming draw entry into display order", () => {
  const cards = byId();
  const table = createTavernShortTableSession({
    playerName: "tester",
    buyInGold: 100,
    seed: 43,
  });
  const currentHand = table.currentHand;
  assert.ok(currentHand);

  const normalized = updateTavernShortTableSession(table, {
    ...configureHumanHand(currentHand, cards),
    phase: "draw-discard",
    actingSeatIndex: 0,
    currentDrawTurnSeatId: "you",
    deck: [cards["bai"], ...currentHand.deck.filter((card) => card.id !== "bai")],
    pendingIncomingCard: null,
  });

  assert.deepEqual(
    normalized.currentHand.displayOrderEntries.map(toTavernShortDisplayOrderEntryId),
    [
      "hand|wan-2",
      "hand|tong-4",
      "hand|east",
      "hand|wan-5",
      "hand|tong-6",
      "public-ghost|wan-7",
      "public-ghost|tong-8",
      "incoming-draw|bai",
    ]
  );
});
