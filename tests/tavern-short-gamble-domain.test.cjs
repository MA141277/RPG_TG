const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createTavernShortDeck,
  getTavernShortCardLabel,
  evaluateBestTavernShortShowdown,
  compareTavernShortBestFives,
  buildTavernShortPots,
  splitTavernShortPot,
  createTavernShortHand,
  resolveTavernShortBetAction,
  drawTavernShortIncomingCard,
  chooseTavernShortDiscardCandidate,
  confirmTavernShortDiscard,
  claimTavernShortDiscard,
  advanceTavernShortNpcAction,
  settleTavernShortShowdown,
} = require("../.test-dist/domain/tavern-short-gambling.js");

const byId = () =>
  Object.fromEntries(createTavernShortDeck().map((card) => [card.id, card]));

function createBaseHand(seed = 11) {
  return createTavernShortHand({
    seed,
    dealerSeatIndex: 0,
    playerName: "tester",
    openingStacks: [1200, 1200, 1200, 1200],
  });
}

function createBrokerPongWindow(base, cards) {
  return {
    ...base,
    phase: "claim-window",
    actingSeatIndex: 2,
    players: base.players.map((player) =>
      player.seatId !== "broker"
        ? player
        : {
            ...player,
            hand: [
              cards["wan-7-2"],
              cards["wan-7-3"],
              cards["wan-2"],
              cards["tong-3"],
              cards["tong-4"],
            ],
            discardHistory: [],
          }
    ),
    claimChain: {
      discarderSeatId: "traveler",
      visibleDiscard: cards["wan-7"],
      originalResumeSeatId: "broker",
      turnOwnerSeatId: "traveler",
      stage: "pong-chow",
      chainDepth: 0,
      passedSeatIds: [],
      options: [
        {
          id: "pong-broker",
          seatId: "broker",
          kind: "pong",
          discardCardId: "wan-7",
          consumeCardIds: ["wan-7-2", "wan-7-3"],
          priority: 2,
        },
      ],
    },
  };
}

function advanceShortHandToHumanClaimWindow(hand) {
  let nextHand = hand;
  for (let step = 0; step < 64; step += 1) {
    const youOptions =
      nextHand.claimChain?.options.filter((option) => option.seatId === "you") ?? [];
    if (nextHand.phase === "claim-window" && youOptions.length > 0) {
      return nextHand;
    }

    const actingPlayer = nextHand.players[nextHand.actingSeatIndex] ?? null;
    if (nextHand.phase === "betting" && actingPlayer?.seatId === "you") {
      const owed = Math.max(
        0,
        nextHand.currentBet - (actingPlayer.committedThisRound ?? 0)
      );
      nextHand = resolveTavernShortBetAction(nextHand, "you", {
        kind: owed > 0 ? "call" : "check",
      });
      continue;
    }

    nextHand = advanceTavernShortNpcAction(nextHand);
  }
  throw new Error("Expected the debug short hand to reach a human claim window.");
}

test("tavern short deck uses a 136-tile Mahjong wall with three suits, honors, and four copies", () => {
  const deck = createTavernShortDeck();

  assert.equal(deck.length, 136);
  assert.equal(new Set(deck.map((card) => card.id)).size, 136);
  assert.deepEqual(
    [...new Set(deck.filter((card) => "suit" in card).map((card) => card.suit))].sort(),
    ["tiao", "tong", "wan"]
  );
  assert.deepEqual(
    [...new Set(deck.filter((card) => "rank" in card).map((card) => card.rank))],
    [1, 2, 3, 4, 5, 6, 7, 8, 9]
  );
  assert.deepEqual(
    [...new Set(deck.filter((card) => "honor" in card).map((card) => card.honor))].sort(),
    ["bai", "east", "fa", "north", "south", "west", "zhong"]
  );
  assert.equal(deck.filter((card) => card.id.startsWith("wan-7")).length, 4);
  assert.equal(deck.filter((card) => card.id.startsWith("east")).length, 4);
  assert.equal(getTavernShortCardLabel(deck.find((card) => card.id === "wan-1")).includes("1"), true);
});

test("tavern short evaluator compares Mahjong-tile straights and four-of-a-kind correctly", () => {
  const cards = byId();
  const straight = evaluateBestTavernShortShowdown([
    cards["wan-1"],
    cards["tong-2"],
    cards["tong-3"],
    cards["tiao-4"],
    cards["wan-5"],
    cards.east,
    cards.zhong,
  ]);
  const fourKind = evaluateBestTavernShortShowdown([
    cards["wan-7"],
    cards["wan-7-2"],
    cards["wan-7-3"],
    cards["wan-7-4"],
    cards["tong-3"],
    cards.east,
    cards.south,
  ]);

  assert.equal(straight.category, "straight");
  assert.equal(fourKind.category, "four-of-a-kind");
  assert.equal(compareTavernShortBestFives(fourKind, straight) > 0, true);
});

test("tavern short pot helpers still build side pots and split remainders from dealer-next order", () => {
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

test("tavern short hand keeps a stable five-card hidden hand through draw and discard", () => {
  const hand = createBaseHand(7);
  const drawn = drawTavernShortIncomingCard(hand, "you");
  const selected = chooseTavernShortDiscardCandidate(
    drawn,
    "you",
    drawn.players[0].hand[0].id
  );
  const confirmed = confirmTavernShortDiscard(selected, "you");

  assert.equal(drawn.players[0].hand.length, 5);
  assert.ok(drawn.pendingIncomingCard);
  assert.equal(confirmed.players[0].hand.length, 5);
  assert.equal(confirmed.pendingIncomingCard, null);
});

test("tavern short broadcast still hides NPC draws while exposing the human draw tile", () => {
  const cards = byId();
  const hand = createBaseHand(7);
  const travelerCard = cards["wan-9"];
  const playerCard = cards["tong-9"];

  const npcDrawn = drawTavernShortIncomingCard(
    {
      ...hand,
      deck: [travelerCard, ...hand.deck.filter((card) => card.id !== travelerCard.id)],
    },
    "traveler"
  );
  const npcLogLine = npcDrawn.logLines.at(-1) ?? "";
  assert.equal(npcLogLine.length > 0, true);
  assert.equal(npcLogLine.includes(getTavernShortCardLabel(travelerCard)), false);
  assert.equal(npcLogLine.includes(travelerCard.id), false);

  const playerDrawn = drawTavernShortIncomingCard(
    {
      ...hand,
      deck: [playerCard, ...hand.deck.filter((card) => card.id !== playerCard.id)],
    },
    "you"
  );
  const playerLogLine = playerDrawn.logLines.at(-1) ?? "";
  assert.equal(playerLogLine.length > 0, true);
  assert.equal(playerLogLine.includes(getTavernShortCardLabel(playerCard)), true);
  assert.equal(playerLogLine.includes(playerCard.id), false);
});

test("tavern short claim resolution preserves the original resume seat and highest-priority pong option", () => {
  const cards = byId();
  const base = createBaseHand();
  const forced = {
    ...createBrokerPongWindow(base, cards),
    claimChain: {
      ...createBrokerPongWindow(base, cards).claimChain,
      options: [
        {
          id: "chow-you",
          seatId: "you",
          kind: "chow",
          discardCardId: "wan-7",
          consumeCardIds: ["wan-5", "wan-6"],
          priority: 1,
        },
        {
          id: "pong-broker",
          seatId: "broker",
          kind: "pong",
          discardCardId: "wan-7",
          consumeCardIds: ["wan-7-2", "wan-7-3"],
          priority: 2,
        },
      ],
    },
  };

  const claimed = claimTavernShortDiscard(forced, "pong-broker");

  assert.equal(claimed.claimChain.originalResumeSeatId, "broker");
  assert.equal(claimed.pendingIncomingCard.ownerSeatId, "broker");
});

test("tavern short chow-locked tiles no longer create false pong or kong windows across different suits", () => {
  const cards = byId();
  const base = createBaseHand(17);
  const resolved = confirmTavernShortDiscard(
    {
      ...base,
      phase: "draw-discard",
      actingSeatIndex: 1,
      currentDrawTurnSeatId: "traveler",
      pendingIncomingCard: {
        ownerSeatId: "traveler",
        source: "draw",
        card: cards["tiao-6"],
      },
      selectedDiscardCardId: "tiao-6",
      players: base.players.map((player) => {
        if (player.seatId === "you") {
          return {
            ...player,
            hand: [
              cards["wan-4"],
              cards["wan-5"],
              cards["wan-6"],
              cards["wan-6-2"],
              cards["tong-6"],
            ],
            meldHistory: [
              {
                kind: "chow",
                cards: [cards["wan-4"], cards["wan-5"], cards["wan-6"]],
              },
            ],
          };
        }
        if (player.seatId === "traveler") {
          return {
            ...player,
            hand: [
              cards["tong-2"],
              cards["tong-3"],
              cards["tiao-4"],
              cards["wan-8"],
              cards["tong-9"],
            ],
          };
        }
        return player;
      }),
    },
    "traveler"
  );

  assert.deepEqual(
    resolved.claimChain?.options
      .filter((option) => option.seatId === "you")
      .map((option) => option.kind) ?? [],
    []
  );
  assert.deepEqual(resolved.lastVisibleDiscard, {
    seatId: "traveler",
    card: cards["tiao-6"],
  });
});

test("tavern short claims record exposed melds separately and lock the claimed tile copies out of hand", () => {
  const cards = byId();
  const base = createBaseHand();
  const claimed = claimTavernShortDiscard(createBrokerPongWindow(base, cards), "pong-broker");
  const broker = claimed.players.find((player) => player.seatId === "broker");

  assert.ok(broker);
  assert.deepEqual(
    broker.meldHistory.map((meld) => ({
      kind: meld.kind,
      cardIds: meld.cards.map((card) => card.id),
    })),
    [{ kind: "pong", cardIds: ["wan-7", "wan-7-2", "wan-7-3"] }]
  );
  assert.deepEqual(broker.discardHistory, []);
  assert.deepEqual(claimed.pendingIncomingCard?.lockedCardIds, [
    "wan-7",
    "wan-7-2",
    "wan-7-3",
  ]);
  assert.deepEqual(
    broker.hand.map((card) => card.id),
    ["wan-2", "tong-3", "tong-4"]
  );
  assert.equal(
    chooseTavernShortDiscardCandidate(claimed, "broker", "wan-7-2")
      .selectedDiscardCardId,
    null
  );
});

test("tavern short claimed meld tiles stay locked across the forced discard and later draw turns", () => {
  const cards = byId();
  const base = createBaseHand();
  const claimed = claimTavernShortDiscard(createBrokerPongWindow(base, cards), "pong-broker");
  const confirmed = confirmTavernShortDiscard(
    chooseTavernShortDiscardCandidate(claimed, "broker", "wan-2"),
    "broker"
  );
  const broker = confirmed.players.find((player) => player.seatId === "broker");
  const laterDraw = {
    ...confirmed,
    phase: "draw-discard",
    actingSeatIndex: 2,
    pendingIncomingCard: {
      ownerSeatId: "broker",
      source: "draw",
      card: cards["tiao-9"],
    },
    selectedDiscardCardId: null,
  };

  assert.ok(broker);
  assert.equal(broker.discardHistory.at(-1)?.id, "wan-2");
  assert.deepEqual(
    broker.hand.map((card) => card.id),
    ["tong-3", "tong-4"]
  );
  assert.equal(
    chooseTavernShortDiscardCandidate(laterDraw, "broker", "wan-7").selectedDiscardCardId,
    null
  );
  assert.equal(
    chooseTavernShortDiscardCandidate(laterDraw, "broker", "wan-7-2")
      .selectedDiscardCardId,
    null
  );
  assert.equal(
    chooseTavernShortDiscardCandidate(laterDraw, "broker", "wan-7-3")
      .selectedDiscardCardId,
    null
  );
  assert.equal(
    chooseTavernShortDiscardCandidate(laterDraw, "broker", "tong-3")
      .selectedDiscardCardId,
    "tong-3"
  );
  assert.equal(
    chooseTavernShortDiscardCandidate(laterDraw, "broker", "tiao-9")
      .selectedDiscardCardId,
    "tiao-9"
  );
});

test("tavern short showdown scoring still counts locked meld tiles toward the best five-card result", () => {
  const cards = byId();
  const base = createBaseHand(31);
  const showdown = settleTavernShortShowdown({
    ...base,
    phase: "showdown",
    publicCards: [cards["wan-5"], cards["tong-7"]],
    players: base.players.map((player) => {
      if (player.seatId === "you") {
        return {
          ...player,
          folded: false,
          committedThisHand: 200,
          hand: [cards["wan-9"], cards.east],
          meldHistory: [
            {
              kind: "chow",
              cards: [cards["wan-6"], cards["wan-7"], cards["wan-8"]],
            },
          ],
        };
      }
      if (player.seatId === "traveler") {
        return {
          ...player,
          folded: false,
          committedThisHand: 200,
          hand: [
            cards["tong-2"],
            cards["tong-2-2"],
            cards["tiao-4"],
            cards["wan-8-2"],
            cards["tong-9"],
          ],
        };
      }
      return {
        ...player,
        folded: true,
        committedThisHand: 0,
      };
    }),
  });
  const humanRow = showdown.showdown.find((row) => row.seatId === "you");

  assert.ok(humanRow);
  assert.equal(humanRow.winner, true);
  assert.equal(humanRow.bestFive.category, "straight-flush");
  assert.deepEqual(
    humanRow.bestFive.cards.map((card) => card.id),
    ["wan-9", "wan-8", "wan-7", "wan-6", "wan-5"]
  );
});

test("tavern short discard selection still toggles off the same tile and switches directly to another selectable tile", () => {
  const cards = byId();
  const base = createBaseHand(29);
  const drawDiscardTurn = {
    ...base,
    phase: "draw-discard",
    actingSeatIndex: 0,
    pendingIncomingCard: {
      ownerSeatId: "you",
      source: "draw",
      card: cards["tiao-9"],
    },
    selectedDiscardCardId: null,
    players: base.players.map((player) =>
      player.seatId !== "you"
        ? player
        : {
            ...player,
            hand: [
              cards["wan-2"],
              cards["tong-3"],
              cards["tiao-4"],
              cards["wan-5"],
              cards.east,
            ],
          }
    ),
  };

  const selected = chooseTavernShortDiscardCandidate(drawDiscardTurn, "you", "tong-3");
  const switchedSelection = chooseTavernShortDiscardCandidate(selected, "you", "tiao-4");
  const deselected = chooseTavernShortDiscardCandidate(selected, "you", "tong-3");

  assert.equal(selected.selectedDiscardCardId, "tong-3");
  assert.equal(switchedSelection.selectedDiscardCardId, "tiao-4");
  assert.equal(switchedSelection.liftedDiscardCardId, "tiao-4");
  assert.equal(deselected.selectedDiscardCardId, null);
});

test("tavern short auto-bet is still consumed once when the human covers the current stake", () => {
  const hand = createTavernShortHand({
    seed: 21,
    dealerSeatIndex: 0,
    playerName: "tester",
    openingStacks: [400, 400, 200, 150],
  });
  const withAutoBet = {
    ...hand,
    phase: "betting",
    bettingRoundIndex: 1,
    currentBet: 200,
    players: hand.players.map((player) =>
      player.seatId === "you" ? { ...player, autoBetPending: true } : player
    ),
  };
  const resolved = resolveTavernShortBetAction(withAutoBet, "you", { kind: "call" });

  assert.equal(resolved.players[0].autoBetPending, false);
  assert.equal(
    resolved.players[0].allIn || resolved.players[0].committedThisRound >= 200,
    true
  );
});

test("tavern short logs keep Chinese broadcast text for betting and draw-discard flow", () => {
  const cards = byId();
  let hand = createBaseHand(7);

  hand = resolveTavernShortBetAction(hand, "guard", { kind: "call" });
  hand = drawTavernShortIncomingCard(
    {
      ...hand,
      deck: [cards["wan-1"], ...hand.deck.filter((card) => card.id !== "wan-1")],
    },
    "you"
  );
  hand = chooseTavernShortDiscardCandidate(hand, "you", hand.players[0].hand[0].id);
  hand = confirmTavernShortDiscard(hand, "you");

  const recentLogs = hand.logLines.slice(-3);
  const discardedCardLabel = getTavernShortCardLabel(
    hand.players[0].discardHistory.at(-1)
  );
  assert.equal(recentLogs.length, 3);
  assert.equal(recentLogs[0].length > 0, true);
  assert.doesNotMatch(recentLogs[0], /\bguard\b|\bcall\b/u);
  assert.equal(recentLogs[1].length > 0, true);
  assert.equal(
    recentLogs[1].includes(getTavernShortCardLabel(cards["wan-1"])),
    true
  );
  assert.doesNotMatch(
    recentLogs[1],
    /\b(?:you|wan|tong|tiao|east|south|west|north|zhong|fa|bai)(?:-\d(?:-\d)?)?\b/u
  );
  assert.equal(recentLogs[2].length > 0, true);
  assert.equal(recentLogs[2].includes(discardedCardLabel), true);
  assert.doesNotMatch(
    recentLogs[2],
    /\b(?:you|wan|tong|tiao|east|south|west|north|zhong|fa|bai)(?:-\d(?:-\d)?)?\b/u
  );
});

test("tavern short logs keep Chinese broadcast text for claim resolution", () => {
  const cards = byId();
  const base = createBaseHand();
  const claimed = claimTavernShortDiscard(
    {
      ...createBrokerPongWindow(base, cards),
      logLines: [],
    },
    "pong-broker"
  );
  const latestLog = claimed.logLines.at(-1) ?? "";

  assert.equal(latestLog.length > 0, true);
  assert.equal(latestLog.includes(getTavernShortCardLabel(cards["wan-7"])), true);
  assert.doesNotMatch(latestLog, /\b(?:broker|wan-7|pong)\b/u);
});
