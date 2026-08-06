const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createTavernShortDeck,
  createTavernShortHand,
  reorderTavernShortDisplayOrderEntries,
  syncTavernShortDisplayOrderEntries,
  toTavernShortDisplayOrderEntryId,
} = require("../.test-dist/domain/tavern-short-gambling.js");

const byId = () =>
  Object.fromEntries(createTavernShortDeck().map((card) => [card.id, card]));

function configureMixedShortHand(overrides = {}) {
  const cards = byId();
  const hand = createTavernShortHand({
    seed: 19,
    dealerSeatIndex: 0,
    playerName: "tester",
    openingStacks: [1200, 1200, 1200, 1200],
  });
  return syncTavernShortDisplayOrderEntries(
    {
      ...hand,
      phase: "betting",
      publicCards: [cards["wan-7"], cards["tong-8"]],
      pendingIncomingCard: {
        ownerSeatId: "you",
        source: "draw",
        card: cards["west"],
      },
      players: hand.players.map((player) =>
        player.seatId !== "you"
          ? player
          : {
              ...player,
              hand: [
                cards["wan-2"],
                cards["tong-3"],
                cards["tiao-4"],
                cards["east"],
                cards["wan-5"],
              ],
            }
      ),
      ...overrides,
    },
    "you"
  );
}

test("tavern short display-order reorder moves mixed entries without mutating the true human hand", () => {
  const configured = configureMixedShortHand();
  const handIdsBefore =
    configured.players.find((player) => player.seatId === "you")?.hand.map((card) => card.id) ??
    [];

  assert.deepEqual(
    configured.displayOrderEntries.map(toTavernShortDisplayOrderEntryId),
    [
      "hand|wan-2",
      "hand|tong-3",
      "hand|tiao-4",
      "hand|east",
      "hand|wan-5",
      "public-ghost|wan-7",
      "public-ghost|tong-8",
      "incoming-draw|west",
    ]
  );

  const reordered = reorderTavernShortDisplayOrderEntries(
    configured,
    "you",
    "public-ghost|wan-7",
    "hand|tong-3"
  );

  assert.deepEqual(
    reordered.displayOrderEntries.map(toTavernShortDisplayOrderEntryId),
    [
      "hand|wan-2",
      "public-ghost|wan-7",
      "hand|tong-3",
      "hand|tiao-4",
      "hand|east",
      "hand|wan-5",
      "public-ghost|tong-8",
      "incoming-draw|west",
    ]
  );
  assert.deepEqual(
    reordered.players.find((player) => player.seatId === "you")?.hand.map((card) => card.id),
    handIdsBefore
  );
});

test("tavern short display-order reorder stays available during draw-discard and preserves discard state", () => {
  const configured = configureMixedShortHand({
    phase: "draw-discard",
    actingSeatIndex: 0,
    currentDrawTurnSeatId: "you",
    pendingIncomingCard: {
      ownerSeatId: "you",
      source: "draw",
      card: byId()["west"],
    },
    selectedDiscardCardId: "tiao-4",
  });

  const reordered = reorderTavernShortDisplayOrderEntries(
    configured,
    "you",
    "public-ghost|tong-8",
    "hand|wan-2"
  );

  assert.equal(reordered.selectedDiscardCardId, "tiao-4");
  assert.deepEqual(
    reordered.displayOrderEntries.map(toTavernShortDisplayOrderEntryId),
    [
      "public-ghost|tong-8",
      "hand|wan-2",
      "hand|tong-3",
      "hand|tiao-4",
      "hand|east",
      "hand|wan-5",
      "public-ghost|wan-7",
      "incoming-draw|west",
    ]
  );

  const invalid = reorderTavernShortDisplayOrderEntries(
    configured,
    "you",
    "missing-entry",
    "hand|wan-2"
  );
  assert.deepEqual(
    invalid.displayOrderEntries.map(toTavernShortDisplayOrderEntryId),
    configured.displayOrderEntries.map(toTavernShortDisplayOrderEntryId)
  );
});
