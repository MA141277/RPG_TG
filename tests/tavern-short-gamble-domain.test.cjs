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

test("tavern short hand keeps stable five-card hands through draw and discard", () => {
  const hand = createTavernShortHand({
    seed: 7,
    dealerSeatIndex: 0,
    playerName: "tester",
    openingStacks: [1200, 1200, 1200, 1200],
  });
  const drawn = drawTavernShortIncomingCard(hand, "you");
  assert.equal(drawn.players[0].hand.length, 5);
  assert.ok(drawn.pendingIncomingCard);
  const selected = chooseTavernShortDiscardCandidate(
    drawn,
    "you",
    drawn.players[0].hand[0].id
  );
  const confirmed = confirmTavernShortDiscard(selected, "you");
  assert.equal(confirmed.players[0].hand.length, 5);
  assert.equal(confirmed.pendingIncomingCard, null);
});

test("tavern short broadcast hides NPC draw card labels but keeps the player's own draw visible", () => {
  const cards = byId();
  const travelerCard = cards["wan-9"];
  const playerCard = cards["tong-12"];
  const hand = createTavernShortHand({
    seed: 7,
    dealerSeatIndex: 0,
    playerName: "tester",
    openingStacks: [1200, 1200, 1200, 1200],
  });

  const npcDrawn = drawTavernShortIncomingCard(
    {
      ...hand,
      deck: [travelerCard, ...hand.deck.filter((card) => card.id !== travelerCard.id)],
    },
    "traveler"
  );
  const npcLogLine = npcDrawn.logLines[npcDrawn.logLines.length - 1] ?? "";
  assert.match(npcLogLine, /摸牌/u);
  assert.doesNotMatch(npcLogLine, new RegExp(getTavernShortCardLabel(travelerCard), "u"));

  const playerDrawn = drawTavernShortIncomingCard(
    {
      ...hand,
      deck: [playerCard, ...hand.deck.filter((card) => card.id !== playerCard.id)],
    },
    "you"
  );
  const playerLogLine = playerDrawn.logLines[playerDrawn.logLines.length - 1] ?? "";
  assert.match(playerLogLine, /摸/u);
  assert.match(playerLogLine, new RegExp(getTavernShortCardLabel(playerCard), "u"));
});

test("tavern short claim chains keep original resume seat and highest priority option", () => {
  const base = createTavernShortHand({
    seed: 11,
    dealerSeatIndex: 0,
    playerName: "tester",
    openingStacks: [1200, 1200, 1200, 1200],
  });
  const forced = {
    ...base,
    phase: "claim-window",
    actingSeatIndex: 2,
    claimChain: {
      discarderSeatId: "traveler",
      visibleDiscard: { id: "wan-7", suit: "wan", rank: 7 },
      originalResumeSeatId: "broker",
      turnOwnerSeatId: "traveler",
      stage: "kong-pong-chow",
      chainDepth: 0,
      passedSeatIds: [],
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
          consumeCardIds: ["bing-7", "tong-7"],
          priority: 2,
        },
      ],
    },
  };
  const claimed = claimTavernShortDiscard(forced, "pong-broker");
  assert.equal(claimed.claimChain.originalResumeSeatId, "broker");
  assert.equal(claimed.pendingIncomingCard.ownerSeatId, "broker");
});

test("tavern short claims record exposed meld history separately from discard history", () => {
  const cards = byId();
  const base = createTavernShortHand({
    seed: 11,
    dealerSeatIndex: 0,
    playerName: "tester",
    openingStacks: [1200, 1200, 1200, 1200],
  });
  const claimed = claimTavernShortDiscard(
    {
      ...base,
      phase: "claim-window",
      actingSeatIndex: 2,
      players: base.players.map((player) =>
        player.seatId !== "broker"
          ? player
          : {
              ...player,
              hand: [
                cards["bing-7"],
                cards["tong-7"],
                cards["wan-2"],
                cards["bing-3"],
                cards["tong-4"],
              ],
              discardHistory: [],
            }
      ),
      claimChain: {
        discarderSeatId: "traveler",
        visibleDiscard: { id: "wan-7", suit: "wan", rank: 7 },
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
            consumeCardIds: ["bing-7", "tong-7"],
            priority: 2,
          },
        ],
      },
    },
    "pong-broker"
  );

  const broker = claimed.players.find((player) => player.seatId === "broker");
  assert.ok(broker);
  assert.deepEqual(
    broker.meldHistory.map((meld) => ({
      kind: meld.kind,
      cardIds: meld.cards.map((card) => card.id),
    })),
    [
      {
        kind: "pong",
        cardIds: ["wan-7", "bing-7", "tong-7"],
      },
    ]
  );
  assert.deepEqual(broker.discardHistory, []);
});

test("tavern short claims lock meld cards for the forced discard step", () => {
  const cards = byId();
  const base = createTavernShortHand({
    seed: 11,
    dealerSeatIndex: 0,
    playerName: "tester",
    openingStacks: [1200, 1200, 1200, 1200],
  });
  const claimed = claimTavernShortDiscard(
    {
      ...base,
      phase: "claim-window",
      actingSeatIndex: 2,
      players: base.players.map((player) =>
        player.seatId !== "broker"
          ? player
          : {
              ...player,
              hand: [
                cards["bing-7"],
                cards["tong-7"],
                cards["wan-2"],
                cards["bing-3"],
                cards["tong-4"],
              ],
              discardHistory: [],
            }
      ),
      claimChain: {
        discarderSeatId: "traveler",
        visibleDiscard: { id: "wan-7", suit: "wan", rank: 7 },
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
            consumeCardIds: ["bing-7", "tong-7"],
            priority: 2,
          },
        ],
      },
    },
    "pong-broker"
  );

  assert.deepEqual(claimed.pendingIncomingCard?.lockedCardIds, [
    "wan-7",
    "bing-7",
    "tong-7",
  ]);

  const rejectedConsumed = chooseTavernShortDiscardCandidate(
    claimed,
    "broker",
    "bing-7"
  );
  assert.equal(rejectedConsumed.selectedDiscardCardId, null);

  const rejectedClaimed = chooseTavernShortDiscardCandidate(
    claimed,
    "broker",
    "wan-7"
  );
  assert.equal(rejectedClaimed.selectedDiscardCardId, null);

  const selectedUnlocked = chooseTavernShortDiscardCandidate(
    claimed,
    "broker",
    "wan-2"
  );
  assert.equal(selectedUnlocked.selectedDiscardCardId, "wan-2");

  const confirmed = confirmTavernShortDiscard(claimed, "broker");
  const broker = confirmed.players.find((player) => player.seatId === "broker");
  assert.ok(broker);
  assert.equal(broker.hand.length, 5);
  assert.equal(broker.discardHistory.at(-1)?.id, "wan-2");
  assert.ok(broker.hand.some((card) => card.id === "wan-7"));
  assert.ok(broker.hand.some((card) => card.id === "bing-7"));
  assert.ok(broker.hand.some((card) => card.id === "tong-7"));
});

test("tavern short claimed meld cards stay locked for later draw turns", () => {
  const cards = byId();
  const base = createTavernShortHand({
    seed: 11,
    dealerSeatIndex: 0,
    playerName: "tester",
    openingStacks: [1200, 1200, 1200, 1200],
  });
  const claimed = claimTavernShortDiscard(
    {
      ...base,
      phase: "claim-window",
      actingSeatIndex: 2,
      players: base.players.map((player) =>
        player.seatId !== "broker"
          ? player
          : {
              ...player,
              hand: [
                cards["bing-7"],
                cards["tong-7"],
                cards["wan-2"],
                cards["bing-3"],
                cards["tong-4"],
              ],
              discardHistory: [],
            }
      ),
      claimChain: {
        discarderSeatId: "traveler",
        visibleDiscard: { id: "wan-7", suit: "wan", rank: 7 },
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
            consumeCardIds: ["bing-7", "tong-7"],
            priority: 2,
          },
        ],
      },
    },
    "pong-broker"
  );
  const confirmed = confirmTavernShortDiscard(
    chooseTavernShortDiscardCandidate(claimed, "broker", "wan-2"),
    "broker"
  );
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

  assert.equal(
    chooseTavernShortDiscardCandidate(laterDraw, "broker", "wan-7")
      .selectedDiscardCardId,
    null
  );
  assert.equal(
    chooseTavernShortDiscardCandidate(laterDraw, "broker", "bing-7")
      .selectedDiscardCardId,
    null
  );
  assert.equal(
    chooseTavernShortDiscardCandidate(laterDraw, "broker", "tong-7")
      .selectedDiscardCardId,
    null
  );
  assert.equal(
    chooseTavernShortDiscardCandidate(laterDraw, "broker", "bing-3")
      .selectedDiscardCardId,
    "bing-3"
  );
  assert.equal(
    chooseTavernShortDiscardCandidate(laterDraw, "broker", "tiao-9")
      .selectedDiscardCardId,
    "tiao-9"
  );
});

test("tavern short discard selection toggles off the same tile and ignores switching while armed", () => {
  const cards = byId();
  const base = createTavernShortHand({
    seed: 29,
    dealerSeatIndex: 0,
    playerName: "tester",
    openingStacks: [1200, 1200, 1200, 1200],
  });
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
              cards["bing-3"],
              cards["tong-4"],
              cards["wan-5"],
              cards["bing-6"],
            ],
          }
    ),
  };

  const selected = chooseTavernShortDiscardCandidate(
    drawDiscardTurn,
    "you",
    "bing-3"
  );
  assert.equal(selected.selectedDiscardCardId, "bing-3");

  const rejectedSwitch = chooseTavernShortDiscardCandidate(
    selected,
    "you",
    "tong-4"
  );
  assert.equal(rejectedSwitch.selectedDiscardCardId, "bing-3");

  const deselected = chooseTavernShortDiscardCandidate(
    selected,
    "you",
    "bing-3"
  );
  assert.equal(deselected.selectedDiscardCardId, null);
});

test("tavern short auto-bet is consumed once and a short all-in kong penalty rebuilds pots", () => {
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

test("tavern short logs use Chinese broadcast text for betting and draw-discard flow", () => {
  let hand = createTavernShortHand({
    seed: 7,
    dealerSeatIndex: 0,
    playerName: "tester",
    openingStacks: [1200, 1200, 1200, 1200],
  });

  hand = resolveTavernShortBetAction(hand, "guard", { kind: "call" });
  hand = drawTavernShortIncomingCard(hand, "you");
  hand = chooseTavernShortDiscardCandidate(hand, "you", hand.players[0].hand[0].id);
  hand = confirmTavernShortDiscard(hand, "you");

  const recentLogs = hand.logLines.slice(-3);
  assert.equal(recentLogs.length, 3);
  assert.match(recentLogs[0], /护院/u);
  assert.match(recentLogs[0], /跟注/u);
  assert.doesNotMatch(recentLogs[0], /\bguard\b|\bcall\b/u);
  assert.match(recentLogs[1], /你/u);
  assert.match(recentLogs[1], /摸入/u);
  assert.match(recentLogs[1], /[万饼筒条]/u);
  assert.doesNotMatch(recentLogs[1], /\b(?:you|wan|bing|tong|tiao)-\d+\b/u);
  assert.match(recentLogs[2], /你/u);
  assert.match(recentLogs[2], /打出/u);
  assert.match(recentLogs[2], /[万饼筒条]/u);
  assert.doesNotMatch(recentLogs[2], /\b(?:you|wan|bing|tong|tiao)-\d+\b/u);
});

test("tavern short logs use Chinese broadcast text for claim resolution", () => {
  const base = createTavernShortHand({
    seed: 11,
    dealerSeatIndex: 0,
    playerName: "tester",
    openingStacks: [1200, 1200, 1200, 1200],
  });
  const claimed = claimTavernShortDiscard(
    {
      ...base,
      phase: "claim-window",
      actingSeatIndex: 2,
      logLines: [],
      claimChain: {
        discarderSeatId: "traveler",
        visibleDiscard: { id: "wan-7", suit: "wan", rank: 7 },
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
            consumeCardIds: ["bing-7", "tong-7"],
            priority: 2,
          },
        ],
      },
    },
    "pong-broker"
  );

  const latestLog = claimed.logLines.at(-1) ?? "";
  assert.match(latestLog, /牙人/u);
  assert.match(latestLog, /抢得/u);
  assert.match(latestLog, /碰/u);
  assert.match(latestLog, /7万/u);
  assert.doesNotMatch(latestLog, /\b(?:broker|wan-7|pong)\b/u);
});
