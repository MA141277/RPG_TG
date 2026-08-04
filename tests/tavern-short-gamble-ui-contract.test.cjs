const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const {
  renderTavernHouseView,
} = require("../.test-dist/ui/views/house/tavern-house-view.js");
const {
  selectTavernShortGambleOverlay,
} = require("../.test-dist/application/house-modules/tavern/tavern-short-gamble-view-model.js");
const {
  createTavernShortTableSession,
} = require("../.test-dist/application/house-modules/tavern/tavern-short-gamble-session.js");
const {
  createTavernLongGambleSession,
} = require("../.test-dist/domain/tavern-gambling.js");
const {
  getTavernShortCardLabel,
} = require("../.test-dist/domain/tavern-short-gambling.js");

const teaHouseCss = fs.readFileSync("src/styles/tea-house.css", "utf8");

test("tavern short overlay exposes pending incoming card, side pots, between-hand actions, and available actions", () => {
  const table = createTavernShortTableSession({
    playerName: "tester",
    buyInGold: 100,
    seed: 17,
  });
  const overlay = selectTavernShortGambleOverlay({
    ...table,
    currentHand: {
      ...table.currentHand,
      phase: "betting",
      pendingIncomingCard: {
        ownerSeatId: "you",
        source: "draw",
        card: { id: "wan-1", suit: "wan", rank: 1 },
      },
      pots: [
        { id: "main", amount: 800, eligibleSeatIds: ["you", "traveler"] },
        { id: "side-1", amount: 400, eligibleSeatIds: ["you"] },
      ],
    },
    prompt: "continue-or-cashout",
  });

  assert.equal(overlay.variant, "short");
  assert.ok(overlay.pendingIncomingCard.label.includes("1"));
  assert.equal(overlay.sidePotLabels.length, 2);
  assert.ok(overlay.sidePotLabels[0].endsWith("800"));
  assert.ok(overlay.sidePotLabels[1].endsWith("400"));
  assert.deepEqual(overlay.availableActions, ["continue", "cash-out"]);
  assert.equal(overlay.highlightAvailableActions, true);
  assert.equal(
    overlay.betweenHandActions.cashOutActionId,
    "gamble-short-cash-out"
  );
});

test("tavern house view renders an explicit short-table debug preset toggle in the wager overlay", () => {
  const markup = renderTavernHouseView({
    moduleId: "tavern",
    houseId: "house.tavern",
    sceneTitle: "Tavern",
    sceneSubtitle: "Preview",
    standbyRoster: [],
    dialogue: null,
    actionContainer: null,
    statusCard: null,
    overlay: {
      type: "gamble",
      title: "短牌下注",
      variantLabel: "短牌",
      wager: 100,
      options: [20, 100, 200],
      decrementActionId: "decrease-wager",
      incrementActionId: "increase-wager",
      confirmActionId: "confirm-gamble",
      confirmLabel: "开始赌局",
      cancelActionId: "cancel-overlay",
      cancelLabel: "取消",
      debugToggle: {
        actionId: "toggle-short-debug-claim-cycle",
        label: "调试预设：已关闭",
        helperText: "开启后，连续几手会固定给出可碰、可杠、可吃的测试牌局。",
      },
    },
    leaveAction: { id: "leave-house", label: "Leave" },
  });

  assert.match(markup, /data-house-action="toggle-short-debug-claim-cycle"/u);
  assert.match(
    markup,
    /(?:class="[^"]*c-tavern-gamble__button-skin[^"]*"[^>]*data-house-action="toggle-short-debug-claim-cycle"|data-house-action="toggle-short-debug-claim-cycle"[^>]*class="[^"]*c-tavern-gamble__button-skin[^"]*")/u
  );
  assert.match(
    markup,
    /(?:class="[^"]*c-tavern-gamble__button-skin[^"]*"[^>]*data-house-action="cancel-overlay"|data-house-action="cancel-overlay"[^>]*class="[^"]*c-tavern-gamble__button-skin[^"]*")/u
  );
  assert.match(
    markup,
    /(?:class="[^"]*c-tavern-gamble__button-skin[^"]*"[^>]*data-house-action="confirm-gamble"|data-house-action="confirm-gamble"[^>]*class="[^"]*c-tavern-gamble__button-skin[^"]*")/u
  );
  assert.doesNotMatch(markup, /c-house-red-nine-slice-actions/u);
  assert.match(markup, /调试预设：已关闭/u);
  assert.match(markup, /连续几手会固定给出可碰、可杠、可吃的测试牌局/u);
});

test("tavern house view keeps gamble-choice button layout but skins the button bodies", () => {
  const markup = renderTavernHouseView({
    moduleId: "tavern",
    houseId: "house.tavern",
    sceneTitle: "Tavern",
    sceneSubtitle: "Preview",
    standbyRoster: [],
    dialogue: null,
    actionContainer: null,
    statusCard: null,
    overlay: {
      type: "gamble-choice",
      title: "Choose Table",
      options: [
        {
          actionId: "choose-short-table",
          label: "Short Table",
          description: "Fast round",
        },
        {
          actionId: "choose-long-table",
          label: "Long Table",
          description: "Long round",
        },
      ],
      cancelActionId: "cancel-choice",
      cancelLabel: "Cancel",
    },
    leaveAction: { id: "leave-house", label: "Leave" },
  });

  assert.match(
    markup,
    /(?:class="[^"]*c-tavern-gamble__button-skin[^"]*"[^>]*data-house-action="choose-short-table"|data-house-action="choose-short-table"[^>]*class="[^"]*c-tavern-gamble__button-skin[^"]*")/u
  );
  assert.match(
    markup,
    /(?:class="[^"]*c-tavern-gamble__button-skin[^"]*"[^>]*data-house-action="choose-long-table"|data-house-action="choose-long-table"[^>]*class="[^"]*c-tavern-gamble__button-skin[^"]*")/u
  );
  assert.match(
    markup,
    /(?:class="[^"]*c-tavern-gamble__button-skin[^"]*"[^>]*data-house-action="cancel-choice"|data-house-action="cancel-choice"[^>]*class="[^"]*c-tavern-gamble__button-skin[^"]*")/u
  );
  assert.doesNotMatch(markup, /c-house-red-nine-slice-actions/u);
});

test("tavern short overlay suppresses action highlight when another seat is acting", () => {
  const table = createTavernShortTableSession({
    playerName: "tester",
    buyInGold: 100,
    seed: 17,
  });
  const overlay = selectTavernShortGambleOverlay({
    ...table,
    prompt: null,
    currentHand: {
      ...table.currentHand,
      phase: "betting",
      actingSeatIndex: 1,
    },
  });

  assert.deepEqual(overlay.availableActions, ["fold", "call", "raise"]);
  assert.equal(overlay.highlightAvailableActions, false);
});

test("tavern short overlay switches to check and bet after the player has matched the current stake", () => {
  const table = createTavernShortTableSession({
    playerName: "tester",
    buyInGold: 100,
    seed: 17,
  });
  const overlay = selectTavernShortGambleOverlay({
    ...table,
    prompt: null,
    currentHand: {
      ...table.currentHand,
      phase: "betting",
      actingSeatIndex: 0,
      players: table.currentHand.players.map((player) =>
        player.seatId === "you"
          ? {
              ...player,
              committedThisRound: table.currentHand.currentBet,
              committedThisHand: table.currentHand.currentBet,
            }
          : player
      ),
    },
  });

  assert.deepEqual(overlay.availableActions, ["check", "raise"]);
  assert.equal(overlay.highlightAvailableActions, true);
});

test("tavern short overlay exposes a structured pass action when the player can claim a discard", () => {
  const table = createTavernShortTableSession({
    playerName: "tester",
    buyInGold: 100,
    seed: 17,
  });
  const overlay = selectTavernShortGambleOverlay({
    ...table,
    prompt: null,
    currentHand: {
      ...table.currentHand,
      phase: "claim-window",
      actingSeatIndex: 0,
      claimChain: {
        discarderSeatId: "traveler",
        visibleDiscard: {
          id: "wan-7",
          suit: "wan",
          rank: 7,
        },
        originalResumeSeatId: "you",
        turnOwnerSeatId: "traveler",
        stage: "pong-chow",
        chainDepth: 0,
        passedSeatIds: [],
        options: [
          {
            id: "pong:you:wan-7:wan-7a:wan-7b",
            seatId: "you",
            kind: "pong",
            discardCardId: "wan-7",
            consumeCardIds: ["wan-7a", "wan-7b"],
            priority: 2,
          },
        ],
      },
      lastVisibleDiscard: {
        seatId: "traveler",
        card: {
          id: "wan-7",
          suit: "wan",
          rank: 7,
        },
      },
    },
  });

  assert.equal(overlay.claimOptions.length, 1);
  assert.equal(overlay.claimPassAction?.actionId, "gamble-skip-meld");
  assert.ok((overlay.claimPassAction?.label ?? "").length > 0);
  assert.equal(overlay.highlightAvailableActions, true);
});

test("tavern short overlay hides stale claim controls and locks meld cards during post-claim discard", () => {
  const table = createTavernShortTableSession({
    playerName: "tester",
    buyInGold: 100,
    seed: 17,
  });
  const overlay = selectTavernShortGambleOverlay({
    ...table,
    currentHand: {
      ...table.currentHand,
      phase: "draw-discard",
      pendingIncomingCard: {
        ownerSeatId: "you",
        source: "claim",
        card: {
          id: "wan-7",
          suit: "wan",
          rank: 7,
        },
        lockedCardIds: ["wan-7", "bing-7", "tong-7"],
      },
      players: table.currentHand.players.map((player) =>
        player.seatId !== "you"
          ? player
          : {
              ...player,
              hand: [
                { id: "bing-7", suit: "bing", rank: 7 },
                { id: "tong-7", suit: "tong", rank: 7 },
                { id: "wan-2", suit: "wan", rank: 2 },
                { id: "bing-3", suit: "bing", rank: 3 },
                { id: "tong-4", suit: "tong", rank: 4 },
              ],
            }
      ),
      claimChain: {
        discarderSeatId: "traveler",
        visibleDiscard: {
          id: "wan-7",
          suit: "wan",
          rank: 7,
        },
        originalResumeSeatId: "you",
        turnOwnerSeatId: "traveler",
        stage: "pong-chow",
        chainDepth: 1,
        passedSeatIds: [],
        options: [
          {
            id: "pong:you:wan-7:bing-7:tong-7",
            seatId: "you",
            kind: "pong",
            discardCardId: "wan-7",
            consumeCardIds: ["bing-7", "tong-7"],
            priority: 2,
          },
        ],
      },
      lastVisibleDiscard: {
        seatId: "traveler",
        card: {
          id: "wan-7",
          suit: "wan",
          rank: 7,
        },
      },
    },
  });

  assert.equal(overlay.claimOptions.length, 0);
  assert.equal(overlay.claimPassAction, null);
  assert.ok(
    overlay.handCards.some(
      (card) => card.id === "wan-7" && card.incoming === true
    )
  );
  assert.equal(
    overlay.handCards.find((card) => card.id === "wan-2")?.actionId,
    "gamble-play-tile:wan-2"
  );
  assert.equal(overlay.handCards.find((card) => card.id === "bing-7")?.actionId, undefined);
  assert.equal(overlay.handCards.find((card) => card.id === "tong-7")?.actionId, undefined);
  assert.equal(overlay.handCards.find((card) => card.id === "wan-7")?.actionId, undefined);
});

test("tavern short overlay keeps meld cards inert across later draw turns", () => {
  const table = createTavernShortTableSession({
    playerName: "tester",
    buyInGold: 100,
    seed: 17,
  });
  const overlay = selectTavernShortGambleOverlay({
    ...table,
    currentHand: {
      ...table.currentHand,
      phase: "draw-discard",
      pendingIncomingCard: {
        ownerSeatId: "you",
        source: "draw",
        card: {
          id: "tiao-9",
          suit: "tiao",
          rank: 9,
        },
      },
      players: table.currentHand.players.map((player) =>
        player.seatId !== "you"
          ? player
          : {
              ...player,
              hand: [
                { id: "wan-7", suit: "wan", rank: 7 },
                { id: "bing-7", suit: "bing", rank: 7 },
                { id: "tong-7", suit: "tong", rank: 7 },
                { id: "bing-3", suit: "bing", rank: 3 },
                { id: "tong-4", suit: "tong", rank: 4 },
              ],
              meldHistory: [
                {
                  kind: "pong",
                  cards: [
                    { id: "wan-7", suit: "wan", rank: 7 },
                    { id: "bing-7", suit: "bing", rank: 7 },
                    { id: "tong-7", suit: "tong", rank: 7 },
                  ],
                },
              ],
            }
      ),
      claimChain: null,
      lastVisibleDiscard: null,
    },
  });

  assert.equal(overlay.handCards.find((card) => card.id === "wan-7")?.actionId, undefined);
  assert.equal(overlay.handCards.find((card) => card.id === "bing-7")?.actionId, undefined);
  assert.equal(overlay.handCards.find((card) => card.id === "tong-7")?.actionId, undefined);
  assert.equal(
    overlay.handCards.find((card) => card.id === "bing-3")?.actionId,
    "gamble-play-tile:bing-3"
  );
  assert.equal(
    overlay.handCards.find((card) => card.id === "tong-4")?.actionId,
    "gamble-play-tile:tong-4"
  );
  assert.equal(
    overlay.handCards.find((card) => card.id === "tiao-9")?.actionId,
    "gamble-play-tile:tiao-9"
  );
});

test("tavern short overlay marks the incoming draw card and only arms discard confirmation after one tile is selected", () => {
  const table = createTavernShortTableSession({
    playerName: "tester",
    buyInGold: 100,
    seed: 17,
  });
  const drawDiscardHand = {
    ...table.currentHand,
    phase: "draw-discard",
    pendingIncomingCard: {
      ownerSeatId: "you",
      source: "draw",
      card: {
        id: "tiao-9",
        suit: "tiao",
        rank: 9,
      },
    },
    players: table.currentHand.players.map((player) =>
      player.seatId !== "you"
        ? player
        : {
            ...player,
            hand: [
              { id: "wan-2", suit: "wan", rank: 2 },
              { id: "bing-3", suit: "bing", rank: 3 },
              { id: "tong-4", suit: "tong", rank: 4 },
              { id: "wan-5", suit: "wan", rank: 5 },
              { id: "bing-6", suit: "bing", rank: 6 },
            ],
          }
    ),
    claimChain: null,
    lastVisibleDiscard: null,
    selectedDiscardCardId: null,
  };

  const idleOverlay = selectTavernShortGambleOverlay({
    ...table,
    currentHand: drawDiscardHand,
  });
  assert.equal(idleOverlay.phase, "出牌");
  assert.deepEqual(idleOverlay.availableActions, []);
  assert.equal(
    idleOverlay.handCards.find((card) => card.id === "tiao-9")?.incoming,
    true
  );
  assert.equal(
    idleOverlay.handCards.find((card) => card.id === "bing-3")?.actionId,
    "gamble-play-tile:bing-3"
  );
  assert.equal(
    idleOverlay.handCards.find((card) => card.id === "tong-4")?.actionId,
    "gamble-play-tile:tong-4"
  );
  assert.equal(
    idleOverlay.handCards.find((card) => card.id === "tiao-9")?.actionId,
    "gamble-play-tile:tiao-9"
  );

  const armedOverlay = selectTavernShortGambleOverlay({
    ...table,
    currentHand: {
      ...drawDiscardHand,
      selectedDiscardCardId: "bing-3",
    },
  });
  assert.deepEqual(armedOverlay.availableActions, ["confirm-discard"]);
  assert.equal(
    armedOverlay.handCards.find((card) => card.id === "bing-3")?.actionId,
    "gamble-play-tile:bing-3"
  );
  assert.equal(
    armedOverlay.handCards.find((card) => card.id === "tong-4")?.actionId,
    undefined
  );
  assert.equal(
    armedOverlay.handCards.find((card) => card.id === "tiao-9")?.actionId,
    undefined
  );
});

test("tavern short overlay exposes claim countdown data for timed pong-kong windows", () => {
  const table = createTavernShortTableSession({
    playerName: "tester",
    buyInGold: 100,
    seed: 17,
  });
  const originalDateNow = Date.now;
  Date.now = () => 4_000;
  try {
    const overlay = selectTavernShortGambleOverlay({
      ...table,
      claimCountdown: {
        totalSeconds: 10,
        startedAtEpochMs: 0,
        expiresAtEpochMs: 10_000,
      },
      currentHand: {
        ...table.currentHand,
        phase: "claim-window",
        actingSeatIndex: 0,
        claimChain: {
          discarderSeatId: "traveler",
          visibleDiscard: {
            id: "wan-7",
            suit: "wan",
            rank: 7,
          },
          originalResumeSeatId: "you",
          turnOwnerSeatId: "traveler",
          stage: "pong-chow",
          chainDepth: 0,
          passedSeatIds: [],
          options: [
            {
              id: "pong:you:wan-7:wan-7a:wan-7b",
              seatId: "you",
              kind: "pong",
              discardCardId: "wan-7",
              consumeCardIds: ["wan-7a", "wan-7b"],
              priority: 2,
            },
          ],
        },
        lastVisibleDiscard: {
          seatId: "traveler",
          card: {
            id: "wan-7",
            suit: "wan",
            rank: 7,
          },
        },
      },
    });

    assert.equal(overlay.claimCountdown?.totalSeconds, 10);
    assert.equal(overlay.claimCountdown?.remainingSeconds, 6);
    assert.equal(overlay.claimCountdown?.remainingMs, 6_000);
    assert.equal(overlay.claimCountdown?.progressPercent, 60);
    assert.equal(overlay.claimCountdown?.label, "\u5269\u4f59 6 \u79d2");
  } finally {
    Date.now = originalDateNow;
  }
});

test("tavern short overlay exposes structured seat tiles for meld and discard history", () => {
  const table = createTavernShortTableSession({
    playerName: "tester",
    buyInGold: 100,
    seed: 17,
  });
  const overlay = selectTavernShortGambleOverlay({
    ...table,
    currentHand: {
      ...table.currentHand,
      players: table.currentHand.players.map((player) =>
        player.seatId !== "broker"
          ? player
          : {
              ...player,
              meldHistory: [
                {
                  kind: "pong",
                  cards: [
                    { id: "wan-7", suit: "wan", rank: 7 },
                    { id: "bing-7", suit: "bing", rank: 7 },
                    { id: "tong-7", suit: "tong", rank: 7 },
                  ],
                },
              ],
            }
      ),
    },
  });

  const brokerRow = overlay.playerRows.find((player) => player.id === "broker");
  const expectedLabels = [
    { id: "wan-7", suit: "wan", rank: 7 },
    { id: "bing-7", suit: "bing", rank: 7 },
    { id: "tong-7", suit: "tong", rank: 7 },
  ]
    .map(getTavernShortCardLabel)
    .flat();

  assert.ok(brokerRow);
  assert.equal(brokerRow.tablePosition, "top");
  assert.equal(brokerRow.meldGroups.length, 1);
  assert.equal(brokerRow.meldGroups[0].kind, "pong");
  assert.deepEqual(
    brokerRow.meldGroups[0].cards.map((card) => card.label),
    expectedLabels
  );
  assert.deepEqual(brokerRow.discardTiles, []);
});

test("tavern house view renders only the currently available short gameplay actions inside the hand area", () => {
  const markup = renderTavernHouseView({
    moduleId: "tavern",
    houseId: "house.tavern",
    sceneTitle: "Tavern",
    sceneSubtitle: "Preview",
    standbyRoster: [],
    dialogue: null,
    actionContainer: null,
    statusCard: null,
    overlay: {
      type: "gamble-table",
      variant: "short",
      title: "Short Table",
      phase: "betting",
      pot: 800,
      currentBet: 200,
      chipLabel: "chips",
      publicCards: [
        { id: "wan-1", label: "A1" },
        { id: "wan-13", label: "K1" },
      ],
      handCards: [{ id: "tong-8", label: "H8", selected: false, actionId: "pick" }],
      sidePotLabels: ["主池 800", "边池 400"],
      pendingIncomingCard: { source: "draw", label: "draw-5" },
      visibleDiscard: { seatName: "traveler", label: "discard-7" },
      claimOptions: [],
      availableActions: ["fold", "call", "raise"],
      highlightAvailableActions: true,
      playerRows: [
        {
          id: "you",
          name: "朱元璋",
          seatIndex: 0,
          tablePosition: "bottom",
          stack: 1800,
          committed: 200,
          folded: false,
          allIn: false,
          autoBetPending: false,
          statusLabel: "已投 200",
          meldGroups: [
            {
              kind: "pong",
              cards: [
                { id: "you-meld-1", label: "Y1" },
                { id: "you-meld-2", label: "Y2" },
                { id: "you-meld-3", label: "Y3" },
              ],
            },
          ],
          discardTiles: [{ id: "tong-4", label: "4筒" }],
        },
        {
          id: "traveler",
          name: "traveler",
          seatIndex: 1,
          tablePosition: "left",
          stack: 1200,
          committed: 200,
          folded: false,
          allIn: false,
          autoBetPending: false,
          statusLabel: "已投 200",
          meldGroups: [
            {
              kind: "pong",
              cards: [
                { id: "wan-7", label: "7万" },
                { id: "bing-7", label: "7饼" },
                { id: "tong-7", label: "7筒" },
              ],
            },
          ],
          discardTiles: [{ id: "wan-8", label: "8万" }],
        },
        {
          id: "guard",
          name: "guard",
          seatIndex: 3,
          tablePosition: "right",
          stack: 900,
          committed: 200,
          folded: false,
          allIn: false,
          autoBetPending: false,
          statusLabel: "宸叉姇 200",
          meldGroups: [
            {
              kind: "chow",
              cards: [
                { id: "tiao-4", label: "T4" },
                { id: "tiao-5", label: "T5" },
                { id: "tiao-6", label: "T6" },
              ],
            },
          ],
          discardTiles: [{ id: "bing-9", label: "B9" }],
        },
      ],
      logLines: [],
      showdownRows: [],
      actionIds: {
        check: "check",
        call: "call",
        raise: "raise",
        fold: "fold",
        close: "close",
      },
    },
    leaveAction: { id: "leave-house", label: "Leave" },
  });

  assert.doesNotMatch(markup, /draw-5/u);
  const topActionIndex = markup.indexOf('data-house-action="close"');
  const shortTableIndex = markup.indexOf(
    'class="c-tavern-gamble__table c-tavern-gamble__table--short"'
  );
  const shortCenterIndex = markup.indexOf(
    'class="c-tavern-gamble__center c-tavern-gamble__center--short"'
  );
  const shortPlayActionIndex = markup.indexOf(
    'c-tavern-gamble__actions c-tavern-gamble__actions--short-play'
  );
  const handAreaIndex = markup.indexOf('class="c-tavern-gamble__hand-on-felt"');
  const handTilesIndex = markup.indexOf('c-tavern-gamble__tiles c-tavern-gamble__tiles--hand');
  const publicTilesIndex = markup.indexOf('c-tavern-gamble__tiles c-tavern-gamble__tiles--public');
  const feltIndex = markup.indexOf('<section class="c-tavern-gamble__felt">');
  const metaIndex = markup.indexOf('class="c-tavern-gamble__meta"');
  const foldActionIndex = markup.indexOf('data-house-action="fold"');
  const callActionIndex = markup.indexOf('data-house-action="call"');
  const raiseActionIndex = markup.indexOf('data-house-action="raise"');
  assert.ok(topActionIndex >= 0);
  assert.ok(shortTableIndex >= 0);
  assert.ok(shortCenterIndex >= 0);
  assert.ok(topActionIndex < shortTableIndex);
  assert.ok(shortPlayActionIndex >= 0);
  assert.ok(handAreaIndex >= 0);
  assert.ok(handTilesIndex >= 0);
  assert.ok(publicTilesIndex >= 0);
  assert.ok(feltIndex >= 0);
  assert.ok(metaIndex >= 0);
  assert.ok(shortPlayActionIndex > handAreaIndex);
  assert.ok(shortPlayActionIndex < handTilesIndex);
  assert.ok(shortCenterIndex > feltIndex);
  assert.ok(metaIndex > shortCenterIndex);
  assert.ok(metaIndex < publicTilesIndex);
  assert.ok(metaIndex > feltIndex);
  assert.ok(foldActionIndex >= 0);
  assert.ok(callActionIndex > foldActionIndex);
  assert.ok(raiseActionIndex > callActionIndex);
  assert.match(markup, /<span>betting<\/span>/u);
  assert.match(markup, /<span>池 800<\/span>/u);
  assert.doesNotMatch(markup, /底池/u);
  assert.doesNotMatch(markup, /当前注/u);
  assert.doesNotMatch(markup, /主池/u);
  assert.doesNotMatch(markup, /边池/u);
  assert.doesNotMatch(markup, /c-tavern-gamble__sidebar/u);
  assert.doesNotMatch(markup, /traveler 打出 discard-7/u);
  assert.doesNotMatch(markup, /我的手牌/u);
  assert.doesNotMatch(markup, /c-tavern-gamble__short-note/u);
  assert.match(markup, /class="c-tavern-gamble__seats c-tavern-gamble__seats--short"/u);
  assert.match(markup, /data-seat-position="bottom"/u);
  assert.match(markup, /data-seat-position="left"/u);
  assert.match(markup, /data-seat-position="right"/u);
  assert.match(markup, /c-house-red-nine-slice-button/u);
  assert.match(markup, /class="c-tavern-gamble__seat-summary"/u);
  assert.match(markup, /class="c-tavern-gamble__seat-meld-group"/u);
  assert.match(markup, /class="c-tavern-gamble__seat-meld-kind">碰/u);
  assert.match(markup, /8万/u);
  assert.doesNotMatch(markup, /data-house-action="check"/u);
  assert.match(markup, />\s*弃牌\s*</u);
  assert.match(markup, />\s*跟住\s*</u);
  assert.match(markup, />\s*加注\s*</u);
  assert.match(markup, /data-house-action="call"/u);
  assert.match(markup, /data-house-action="raise"/u);
  assert.match(markup, /data-house-action="fold"/u);
  assert.doesNotMatch(markup, /data-house-action="draw"/u);
  assert.doesNotMatch(markup, /data-house-action="confirm-discard"/u);
  assert.doesNotMatch(markup, /is-available/u);
  const playerSeatIndex = markup.indexOf('data-seat-id="you"');
  const nextSeatIndex = markup.indexOf('data-seat-id="traveler"', playerSeatIndex);
  const travelerSeatIndex = markup.indexOf('data-seat-id="traveler"');
  const travelerSummaryIndex = markup.indexOf(
    'class="c-tavern-gamble__seat-summary"',
    travelerSeatIndex
  );
  const travelerMeldRowIndex = markup.indexOf(
    'class="c-tavern-gamble__seat-melds"',
    travelerSeatIndex
  );
  const travelerDiscardRowIndex = markup.indexOf(
    'class="c-tavern-gamble__seat-discards"',
    travelerSeatIndex
  );
  const guardSeatIndex = markup.indexOf('data-seat-id="guard"', travelerSeatIndex);
  const guardSummaryIndex = markup.indexOf(
    'class="c-tavern-gamble__seat-summary"',
    guardSeatIndex
  );
  const guardDiscardRowIndex = markup.indexOf(
    'class="c-tavern-gamble__seat-discards"',
    guardSeatIndex
  );
  const guardMeldRowIndex = markup.indexOf(
    'class="c-tavern-gamble__seat-melds"',
    guardSeatIndex
  );
  const playerMeldRowIndex = markup.indexOf(
    'class="c-tavern-gamble__seat-melds"',
    playerSeatIndex
  );
  const playerDiscardIndex = markup.indexOf(
    'class="c-tavern-gamble__seat-discards"',
    playerSeatIndex
  );
  const playerSummaryIndex = markup.indexOf(
    'class="c-tavern-gamble__seat-summary"',
    playerSeatIndex
  );
  assert.ok(travelerSeatIndex >= 0);
  assert.ok(travelerSummaryIndex >= 0);
  assert.ok(travelerMeldRowIndex >= 0);
  assert.ok(travelerMeldRowIndex > travelerSummaryIndex);
  assert.ok(travelerDiscardRowIndex > travelerMeldRowIndex);
  assert.ok(guardSeatIndex > travelerSeatIndex);
  assert.ok(guardSummaryIndex >= 0);
  assert.ok(guardMeldRowIndex > guardSummaryIndex);
  assert.ok(guardDiscardRowIndex > guardMeldRowIndex);
  assert.ok(playerSeatIndex >= 0);
  assert.ok(nextSeatIndex > playerSeatIndex);
  assert.ok(playerDiscardIndex > playerSeatIndex);
  assert.ok(playerMeldRowIndex > playerDiscardIndex);
  assert.ok(playerSummaryIndex > playerMeldRowIndex);
  assert.ok(nextSeatIndex > playerSummaryIndex);
  assert.doesNotMatch(markup, /c-tavern-gamble__discard-strip--vertical/u);
  assert.doesNotMatch(markup, /选择 3 张顺\/刻/u);
});

test("tavern house view renders check and bet controls when no call is owed", () => {
  const markup = renderTavernHouseView({
    moduleId: "tavern",
    houseId: "house.tavern",
    sceneTitle: "Tavern",
    sceneSubtitle: "Preview",
    standbyRoster: [],
    dialogue: null,
    actionContainer: null,
    statusCard: null,
    overlay: {
      type: "gamble-table",
      variant: "short",
      title: "Short Table",
      phase: "betting",
      pot: 800,
      currentBet: 200,
      chipLabel: "chips",
      publicCards: [],
      handCards: [],
      sidePotLabels: [],
      pendingIncomingCard: null,
      visibleDiscard: null,
      claimOptions: [],
      availableActions: ["check", "raise"],
      highlightAvailableActions: true,
      playerRows: [],
      logLines: [],
      showdownRows: [],
      actionIds: {
        check: "check",
        call: "call",
        raise: "raise",
        fold: "fold",
        close: "close",
      },
    },
    leaveAction: { id: "leave-house", label: "Leave" },
  });

  assert.match(markup, /data-house-action="check"/u);
  assert.match(markup, /data-house-action="raise"/u);
  assert.doesNotMatch(markup, /data-house-action="call"/u);
  assert.doesNotMatch(markup, /data-house-action="fold"/u);
  assert.match(markup, />\s*过牌\s*</u);
  assert.match(markup, />\s*下注\s*</u);
  assert.doesNotMatch(markup, />\s*加注\s*</u);
});

test("tavern short table markup adds top depth to hand tiles and bottom depth to table tiles", () => {
  const markup = renderTavernHouseView({
    moduleId: "tavern",
    houseId: "house.tavern",
    sceneTitle: "Tavern",
    sceneSubtitle: "Preview",
    standbyRoster: [],
    dialogue: null,
    actionContainer: null,
    statusCard: null,
    overlay: {
      type: "gamble-table",
      variant: "short",
      title: "Short Table",
      phase: "betting",
      pot: 800,
      currentBet: 200,
      chipLabel: "chips",
      publicCards: [{ id: "public-1", label: "P1" }],
      handCards: [{ id: "hand-1", label: "H1", selected: false, actionId: "pick" }],
      sidePotLabels: [],
      pendingIncomingCard: null,
      visibleDiscard: null,
      claimOptions: [],
      availableActions: [],
      highlightAvailableActions: false,
      playerRows: [
        {
          id: "traveler",
          name: "traveler",
          seatIndex: 1,
          tablePosition: "left",
          stack: 1200,
          committed: 200,
          folded: false,
          allIn: false,
          autoBetPending: false,
          statusLabel: "已投 200",
          meldGroups: [
            {
              kind: "pong",
              cards: [
                { id: "meld-1", label: "M1" },
                { id: "meld-2", label: "M2" },
                { id: "meld-3", label: "M3" },
              ],
            },
          ],
          discardTiles: [{ id: "discard-1", label: "D1" }],
        },
      ],
      logLines: [],
      showdownRows: [],
      actionIds: {
        check: "check",
        call: "call",
        raise: "raise",
        fold: "fold",
        close: "close",
      },
    },
    leaveAction: { id: "leave-house", label: "Leave" },
  });

  assert.match(
    markup,
    /class="c-tavern-gamble__tile c-tavern-gamble__tile--depth-bottom">P1<\/span>/u
  );
  assert.match(
    markup,
    /class="c-tavern-gamble__tile c-tavern-gamble__tile--hand c-tavern-gamble__tile--depth-top"[^>]*>H1<\/button>/u
  );
  assert.match(
    markup,
    /class="c-tavern-gamble__tile c-tavern-gamble__tile--discard c-tavern-gamble__tile--depth-bottom">M1<\/span>/u
  );
  assert.match(
    markup,
    /class="c-tavern-gamble__tile c-tavern-gamble__tile--discard c-tavern-gamble__tile--depth-bottom">D1<\/span>/u
  );
});

test("tavern house view floats claim controls without keeping inactive betting buttons", () => {
  const markup = renderTavernHouseView({
    moduleId: "tavern",
    houseId: "house.tavern",
    sceneTitle: "Tavern",
    sceneSubtitle: "Preview",
    standbyRoster: [],
    dialogue: null,
    actionContainer: null,
    statusCard: null,
    overlay: {
      type: "gamble-table",
      variant: "short",
      title: "Short Table",
      phase: "claim-window",
      pot: 800,
      currentBet: 200,
      chipLabel: "chips",
      publicCards: [],
      handCards: [],
      sidePotLabels: [],
      pendingIncomingCard: null,
      visibleDiscard: { seatName: "traveler", label: "discard-7" },
      claimOptions: [
        {
          id: "pong-option",
          kind: "pong",
          label: "碰 discard-7",
          actionId: "gamble-meld:pong-option",
          flashing: true,
        },
      ],
      claimCountdown: {
        totalSeconds: 10,
        remainingSeconds: 6,
        remainingMs: 6_000,
        progressPercent: 60,
        label: "\u5269\u4f59 6 \u79d2",
      },
      claimPassAction: {
        actionId: "gamble-skip-meld",
        label: "跳过",
      },
      availableActions: [],
      highlightAvailableActions: true,
      playerRows: [],
      logLines: [],
      showdownRows: [],
      actionIds: {
        check: "check",
        call: "call",
        raise: "raise",
        fold: "fold",
        close: "close",
      },
    },
    leaveAction: { id: "leave-house", label: "Leave" },
  });

  const claimRowIndex = markup.indexOf(
    'c-tavern-gamble__actions-row c-tavern-gamble__actions-row--claim'
  );
  const countdownIndex = markup.indexOf('class="c-tavern-gamble__claim-countdown"');
  const primaryRowIndex = markup.indexOf(
    'c-tavern-gamble__actions-row c-tavern-gamble__actions-row--primary'
  );
  const handAreaIndex = markup.indexOf('class="c-tavern-gamble__hand-on-felt"');
  const handTilesIndex = markup.indexOf('c-tavern-gamble__tiles c-tavern-gamble__tiles--hand');

  assert.match(markup, /c-tavern-gamble__actions--short-play has-claim-row/u);
  assert.match(markup, /class="c-tavern-gamble__claim-countdown"/u);
  assert.match(markup, /\u5269\u4f59 6 \u79d2/u);
  assert.match(markup, /aria-valuemax="10"/u);
  assert.match(markup, /aria-valuenow="6"/u);
  assert.match(markup, /data-house-claim-countdown="true"/u);
  assert.match(markup, /data-house-claim-countdown-total-ms="10000"/u);
  assert.match(markup, /data-house-claim-countdown-remaining-ms="6000"/u);
  assert.match(markup, /data-house-claim-countdown-label="true"/u);
  assert.match(markup, /data-house-claim-countdown-track="true"/u);
  assert.match(markup, /data-house-claim-countdown-fill="true"/u);
  assert.match(markup, /data-house-action="gamble-meld:pong-option"/u);
  assert.match(markup, /data-house-action="gamble-skip-meld"/u);
  assert.doesNotMatch(markup, /\bis-flashing\b/u);
  assert.match(markup, /c-house-red-nine-slice-button/u);
  assert.ok(countdownIndex >= 0);
  assert.ok(claimRowIndex > countdownIndex);
  assert.ok(claimRowIndex >= 0);
  assert.equal(primaryRowIndex, -1);
  assert.ok(handAreaIndex >= 0);
  assert.ok(handTilesIndex >= 0);
  assert.ok(countdownIndex > handAreaIndex);
  assert.doesNotMatch(markup, /traveler 打出 discard-7/u);
  assert.doesNotMatch(markup, /data-house-action="check"/u);
  assert.doesNotMatch(markup, /data-house-action="call"/u);
  assert.doesNotMatch(markup, /data-house-action="raise"/u);
  assert.doesNotMatch(markup, /data-house-action="fold"/u);
});

test("tavern house view keeps draw-discard tiles armed without showing a discard button before selection", () => {
  const markup = renderTavernHouseView({
    moduleId: "tavern",
    houseId: "house.tavern",
    sceneTitle: "Tavern",
    sceneSubtitle: "Preview",
    standbyRoster: [],
    dialogue: null,
    actionContainer: null,
    statusCard: null,
    overlay: {
      type: "gamble-table",
      variant: "short",
      title: "Short Table",
      phase: "draw-discard",
      pot: 800,
      currentBet: 200,
      chipLabel: "chips",
      publicCards: [],
      handCards: [
        { id: "locked-claim", label: "L7", selected: false },
        {
          id: "free-discard",
          label: "F2",
          selected: false,
          actionId: "gamble-play-tile:free-discard",
        },
        {
          id: "drawn-card",
          label: "D9",
          selected: false,
          incoming: true,
          actionId: "gamble-play-tile:drawn-card",
        },
      ],
      sidePotLabels: [],
      pendingIncomingCard: { source: "draw", label: "draw-9" },
      visibleDiscard: { seatName: "traveler", label: "discard-7" },
      claimOptions: [],
      availableActions: [],
      highlightAvailableActions: true,
      playerRows: [],
      logLines: [],
      showdownRows: [],
      actionIds: {
        check: "check",
        call: "call",
        raise: "raise",
        fold: "fold",
        close: "close",
        confirmDiscard: "confirm-discard",
      },
    },
    leaveAction: { id: "leave-house", label: "Leave" },
  });

  const tileActions = markup.match(/data-house-action="gamble-play-tile:[^"]+"/gu) ?? [];
  assert.deepEqual(tileActions, [
    'data-house-action="gamble-play-tile:free-discard"',
    'data-house-action="gamble-play-tile:drawn-card"',
  ]);
  assert.match(markup, /is-incoming/u);
  assert.doesNotMatch(markup, /has-selected-discard/u);
  assert.doesNotMatch(markup, /data-house-action="draw"/u);
  assert.doesNotMatch(markup, /data-house-action="confirm-discard"/u);
  assert.doesNotMatch(markup, /traveler 打出 discard-7/u);
  assert.doesNotMatch(markup, /data-house-action="check"/u);
  assert.doesNotMatch(markup, /data-house-action="call"/u);
  assert.doesNotMatch(markup, /data-house-action="raise"/u);
  assert.doesNotMatch(markup, /data-house-action="fold"/u);
});

test("tavern house view locks draw-discard selection to one armed tile and only shows the discard button after selection", () => {
  const markup = renderTavernHouseView({
    moduleId: "tavern",
    houseId: "house.tavern",
    sceneTitle: "Tavern",
    sceneSubtitle: "Preview",
    standbyRoster: [],
    dialogue: null,
    actionContainer: null,
    statusCard: null,
    overlay: {
      type: "gamble-table",
      variant: "short",
      title: "Short Table",
      phase: "draw-discard",
      pot: 800,
      currentBet: 200,
      chipLabel: "chips",
      publicCards: [],
      handCards: [
        { id: "locked-claim", label: "L7", selected: false },
        {
          id: "free-discard",
          label: "F2",
          selected: true,
          actionId: "gamble-play-tile:free-discard",
        },
        {
          id: "drawn-card",
          label: "D9",
          selected: false,
          incoming: true,
        },
      ],
      sidePotLabels: [],
      pendingIncomingCard: { source: "draw", label: "draw-9" },
      visibleDiscard: { seatName: "traveler", label: "discard-7" },
      claimOptions: [],
      availableActions: ["confirm-discard"],
      highlightAvailableActions: true,
      playerRows: [],
      logLines: [],
      showdownRows: [],
      actionIds: {
        check: "check",
        call: "call",
        raise: "raise",
        fold: "fold",
        close: "close",
        confirmDiscard: "confirm-discard",
      },
    },
    leaveAction: { id: "leave-house", label: "Leave" },
  });

  const tileActions = markup.match(/data-house-action="gamble-play-tile:[^"]+"/gu) ?? [];
  assert.deepEqual(tileActions, ['data-house-action="gamble-play-tile:free-discard"']);
  assert.match(markup, /has-selected-discard/u);
  assert.match(markup, /data-house-action="confirm-discard"/u);
  assert.doesNotMatch(markup, /data-house-action="draw"/u);
});

test("tavern house view keeps a deselected short-hand tile lifted without restoring the selection border", () => {
  const markup = renderTavernHouseView({
    moduleId: "tavern",
    houseId: "house.tavern",
    sceneTitle: "Tavern",
    sceneSubtitle: "Preview",
    standbyRoster: [],
    dialogue: null,
    actionContainer: null,
    statusCard: null,
    overlay: {
      type: "gamble-table",
      variant: "short",
      title: "Short Table",
      phase: "draw-discard",
      pot: 800,
      currentBet: 200,
      chipLabel: "chips",
      publicCards: [],
      handCards: [
        {
          id: "free-discard",
          label: "F2",
          selected: false,
          lifted: true,
          actionId: "gamble-play-tile:free-discard",
        },
      ],
      sidePotLabels: [],
      pendingIncomingCard: { source: "draw", label: "draw-9" },
      visibleDiscard: null,
      claimOptions: [],
      availableActions: [],
      highlightAvailableActions: true,
      playerRows: [],
      logLines: [],
      showdownRows: [],
      actionIds: {
        check: "check",
        call: "call",
        raise: "raise",
        fold: "fold",
        close: "close",
        confirmDiscard: "confirm-discard",
      },
    },
    leaveAction: { id: "leave-house", label: "Leave" },
  });

  assert.match(markup, /c-tavern-gamble__tile--hand c-tavern-gamble__tile--depth-top is-lifted/u);
  assert.match(
    markup,
    /data-house-mouseleave-action="gamble-clear-lifted-tile:free-discard"/u
  );
  assert.doesNotMatch(markup, /free-discard"[^>]*is-selected/u);
});

test("tavern house view renders a dropping short-hand tile for the post-mouseleave fall animation", () => {
  const markup = renderTavernHouseView({
    moduleId: "tavern",
    houseId: "house.tavern",
    sceneTitle: "Tavern",
    sceneSubtitle: "Preview",
    standbyRoster: [],
    dialogue: null,
    actionContainer: null,
    statusCard: null,
    overlay: {
      type: "gamble-table",
      variant: "short",
      title: "Short Table",
      phase: "draw-discard",
      pot: 800,
      currentBet: 200,
      chipLabel: "chips",
      publicCards: [],
      handCards: [
        {
          id: "free-discard",
          label: "F2",
          selected: false,
          dropping: true,
        },
      ],
      sidePotLabels: [],
      pendingIncomingCard: { source: "draw", label: "draw-9" },
      visibleDiscard: null,
      claimOptions: [],
      availableActions: [],
      highlightAvailableActions: true,
      playerRows: [],
      logLines: [],
      showdownRows: [],
      actionIds: {
        check: "check",
        call: "call",
        raise: "raise",
        fold: "fold",
        close: "close",
        confirmDiscard: "confirm-discard",
      },
    },
    leaveAction: { id: "leave-house", label: "Leave" },
  });

  assert.match(markup, /c-tavern-gamble__tile--hand c-tavern-gamble__tile--depth-top is-dropping/u);
  assert.doesNotMatch(markup, /data-house-mouseleave-action="gamble-clear-lifted-tile:free-discard"/u);
  assert.doesNotMatch(markup, /free-discard"[^>]*is-selected/u);
});

test("tavern house view hides all short-table gameplay actions while another player is acting", () => {
  const markup = renderTavernHouseView({
    moduleId: "tavern",
    houseId: "house.tavern",
    sceneTitle: "Tavern",
    sceneSubtitle: "Preview",
    standbyRoster: [],
    dialogue: null,
    actionContainer: null,
    statusCard: null,
    overlay: {
      type: "gamble-table",
      variant: "short",
      title: "Short Table",
      phase: "betting",
      pot: 800,
      currentBet: 200,
      chipLabel: "chips",
      publicCards: [],
      handCards: [],
      sidePotLabels: [],
      pendingIncomingCard: null,
      visibleDiscard: null,
      claimOptions: [],
      availableActions: ["check", "call", "raise", "fold"],
      highlightAvailableActions: false,
      playerRows: [],
      logLines: [],
      showdownRows: [],
      actionIds: {
        check: "check",
        call: "call",
        raise: "raise",
        fold: "fold",
        close: "close",
      },
    },
    leaveAction: { id: "leave-house", label: "Leave" },
  });

  assert.doesNotMatch(markup, /c-tavern-gamble__actions--short-play/u);
  assert.doesNotMatch(markup, /data-house-action="check"/u);
  assert.doesNotMatch(markup, /data-house-action="call"/u);
  assert.doesNotMatch(markup, /data-house-action="raise"/u);
  assert.doesNotMatch(markup, /data-house-action="fold"/u);
});

test("tavern house view swaps top-seat discard and meld rows while keeping the summary first", () => {
  const markup = renderTavernHouseView({
    moduleId: "tavern",
    houseId: "house.tavern",
    sceneTitle: "Tavern",
    sceneSubtitle: "Preview",
    standbyRoster: [],
    dialogue: null,
    actionContainer: null,
    statusCard: null,
    overlay: {
      type: "gamble-table",
      variant: "short",
      title: "Short Table",
      phase: "betting",
      pot: 800,
      currentBet: 200,
      chipLabel: "chips",
      publicCards: [],
      handCards: [],
      sidePotLabels: [],
      pendingIncomingCard: null,
      visibleDiscard: null,
      claimOptions: [],
      availableActions: [],
      highlightAvailableActions: false,
      playerRows: [
        {
          id: "broker",
          name: "broker",
          seatIndex: 2,
          tablePosition: "top",
          stack: 1100,
          committed: 200,
          folded: false,
          allIn: false,
          autoBetPending: false,
          statusLabel: "committed 200",
          meldGroups: [
            {
              kind: "kong",
              cards: [
                { id: "broker-meld-1", label: "B1" },
                { id: "broker-meld-2", label: "B2" },
                { id: "broker-meld-3", label: "B3" },
              ],
            },
          ],
          discardTiles: [{ id: "broker-discard", label: "D5" }],
        },
      ],
      logLines: [],
      showdownRows: [],
      actionIds: {
        check: "check",
        call: "call",
        raise: "raise",
        fold: "fold",
        close: "close",
      },
    },
    leaveAction: { id: "leave-house", label: "Leave" },
  });

  const brokerSeatIndex = markup.indexOf('data-seat-id="broker"');
  const brokerSummaryIndex = markup.indexOf(
    'class="c-tavern-gamble__seat-summary"',
    brokerSeatIndex
  );
  const brokerDiscardRowIndex = markup.indexOf(
    'class="c-tavern-gamble__seat-discards"',
    brokerSeatIndex
  );
  const brokerMeldRowIndex = markup.indexOf(
    'class="c-tavern-gamble__seat-melds"',
    brokerSeatIndex
  );

  assert.ok(brokerSeatIndex >= 0);
  assert.ok(brokerSummaryIndex >= 0);
  assert.ok(brokerDiscardRowIndex > brokerSummaryIndex);
  assert.ok(brokerMeldRowIndex > brokerDiscardRowIndex);
});

test("tavern short CSS keeps the public-card stage centered, floats active controls, and anchors the broadcast window in the lower-left", () => {
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble-overlay--short\s*\{[^}]*align-items:\s*center;[^}]*justify-content:\s*center;/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s*\{[^}]*height:\s*min\(710px,\s*calc\(100vh - 40px\)\);[^}]*max-height:\s*710px;/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__table--short\s*\{[^}]*position:\s*relative;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__table--short\s*\{[^}]*grid-template-columns:\s*1fr;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__felt\s*\{[^}]*position:\s*relative;[^}]*overflow:\s*hidden;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__seats--short\s*\{[^}]*inset:\s*24px 24px 152px;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__center--short\s*\{[^}]*position:\s*absolute;[^}]*left:\s*50%;[^}]*top:\s*calc\(50%\s*-\s*85px\);[^}]*padding:\s*18px 18px 28px;[^}]*transform:\s*translate\(-50%,\s*-50%\);/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__center--short\s+\.c-tavern-gamble__meta\s*\{[^}]*width:\s*100%;[^}]*justify-content:\s*center;/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__action-button\s*\{[^}]*color:\s*#[0-9a-fA-F]{3,6};/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__seat-summary\s*\{[^}]*display:\s*grid;[^}]*gap:\s*2px;/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__seat-summary\s*\{[^}]*margin-top:\s*20px;/su
  );
  assert.doesNotMatch(teaHouseCss, /\.c-tavern-gamble__player\s+div\s*\{/su);
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__tile--discard\s*\{[^}]*display:\s*grid;[^}]*place-items:\s*center;/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__tile\s*\{[^}]*display:\s*grid;[^}]*place-items:\s*center;[^}]*text-align:\s*center;/su
  );
  assert.match(teaHouseCss, /\.c-tavern-gamble__action-button:disabled\s*\{[^}]*opacity:\s*0\.54;/su);
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__button-skin\s*\{[^}]*border-image-source:\s*url\("\.\.\/\.\.\/ui\/yuansu\/评定\/generated\/20260709-205123_button-clean-anti-seam\.png"\);[^}]*border-image-slice:\s*10 18 fill;[^}]*border-image-width:\s*10px 18px;[^}]*background:\s*transparent;[^}]*box-shadow:\s*none;[^}]*color:\s*#f7e6ba;/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__button-skin:disabled\s*\{[^}]*color:\s*#d2b98b;[^}]*filter:\s*saturate\(0\.36\) brightness\(0\.9\);/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__action-button\.c-house-red-nine-slice-button\s*\{[^}]*border-image-source:\s*url\("\.\.\/\.\.\/ui\/yuansu\/评定\/generated\/20260709-205123_button-clean-anti-seam\.png"\);[^}]*border-image-slice:\s*10 18 fill;[^}]*border-image-width:\s*10px 18px;[^}]*padding:\s*0 18px;[^}]*background:\s*transparent;[^}]*box-shadow:\s*none;[^}]*color:\s*#f7e6ba;[^}]*text-shadow:\s*0 1px 1px rgb\(57 16 8 \/ 66%\);/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__action-button\.c-house-red-nine-slice-button:disabled\s*\{[^}]*color:\s*#d2b98b;[^}]*filter:\s*saturate\(0\.36\) brightness\(0\.9\);/su
  );
  assert.doesNotMatch(teaHouseCss, /\.c-tavern-gamble__action-button\.is-available\s*\{/su);
  assert.doesNotMatch(teaHouseCss, /\.c-tavern-gamble__meld-action\.is-flashing\s*\{/su);
  assert.doesNotMatch(teaHouseCss, /@keyframes tavern-gamble-meld-flash\s*\{/su);
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__actions--top\s*\{[^}]*padding:\s*8px 14px;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__actions--short-play\s*\{[^}]*position:\s*relative;[^}]*width:\s*min\(680px,\s*100%\);[^}]*margin-inline:\s*auto;[^}]*max-height:\s*none;[^}]*overflow:\s*visible;[^}]*display:\s*flex;[^}]*flex-direction:\s*column;[^}]*padding:\s*0;[^}]*border:\s*0;[^}]*background:\s*none;[^}]*box-shadow:\s*none;/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__actions--short-play\.has-claim-row\s*\{[^}]*padding-top:\s*14px;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__seat--short-0\s*\{[^}]*bottom:\s*74px;[^}]*left:\s*50%;[^}]*transform:\s*translateX\(-50%\);/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__seat--short-0\s+\.c-tavern-gamble__seat-discards,\s*\.c-tavern-gamble__seat--short-0\s+\.c-tavern-gamble__seat-melds\s*\{[^}]*transform:\s*translateY\(10px\);[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__seat--short-1\s*\{[^}]*left:\s*18px;[^}]*top:\s*42%;[^}]*width:\s*148px;[^}]*height:\s*160px;[^}]*transform:\s*translateY\(calc\(-50%\s*-\s*50px\)\);/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__seat--short-2\s*\{[^}]*top:\s*-2px;[^}]*left:\s*50%;[^}]*transform:\s*translateX\(-50%\);/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__seat--short-3\s*\{[^}]*right:\s*18px;[^}]*top:\s*42%;[^}]*width:\s*148px;[^}]*height:\s*160px;[^}]*transform:\s*translateY\(calc\(-50%\s*-\s*50px\)\);/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__seat--short-1\s+\.c-tavern-gamble__seat-summary,\s*\.c-tavern-gamble__seat--short-3\s+\.c-tavern-gamble__seat-summary\s*\{[^}]*position:\s*absolute;[^}]*top:\s*0;[^}]*inset-inline:\s*0;/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__seat--short-1\s+\.c-tavern-gamble__seat-discards,\s*\.c-tavern-gamble__seat--short-3\s+\.c-tavern-gamble__seat-discards\s*\{[^}]*position:\s*absolute;[^}]*top:\s*78px;[^}]*inset-inline:\s*0;/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__seat--short-1\s+\.c-tavern-gamble__seat-melds,\s*\.c-tavern-gamble__seat--short-3\s+\.c-tavern-gamble__seat-melds\s*\{[^}]*position:\s*absolute;[^}]*top:\s*126px;[^}]*inset-inline:\s*0;/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__hand-on-felt\s*\{[^}]*left:\s*50%;[^}]*right:\s*auto;[^}]*bottom:\s*42px;[^}]*transform:\s*translateX\(-50%\);[^}]*background:\s*none;[^}]*box-shadow:\s*none;/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__tiles--hand\.has-selected-discard\s*\{[^}]*cursor:\s*default;/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__tiles--public\s*\{[^}]*gap:\s*0;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__tiles--hand\s*\{[^}]*gap:\s*0;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__seat-discards\s*\{[^}]*gap:\s*0;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__seat-meld-tiles\s*\{[^}]*gap:\s*0;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__tiles--hand\s+\.c-tavern-gamble__tile--hand\.is-incoming\s*\{[^}]*margin-inline-start:\s*8px;/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__tiles--hand:not\(.has-selected-discard\)\s+\.c-tavern-gamble__tile--hand:not\(\[aria-disabled="true"\]\):hover\s*\{[^}]*--tile-lift-y:\s*-30px;/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__tile--hand\.is-selected\s*\{[^}]*--tile-lift-y:\s*-30px;/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__tile--hand\.is-lifted\s*\{[^}]*--tile-lift-y:\s*-30px;/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__tile--hand\.is-dropping\s*\{[^}]*animation:\s*tavern-short-discard-drop 180ms cubic-bezier\(0\.22,\s*1,\s*0\.36,\s*1\) both;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__tile\.is-selected\s*\{[^}]*outline:\s*0;[^}]*z-index:\s*1;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__tile--hand\.is-selected\s*\{[^}]*--tile-lift-y:\s*-30px;[^}]*box-shadow:\s*-3px 0 0 0 #f7d982,\s*3px 0 0 0 #f7d982,\s*0 3px 0 0 #f7d982,\s*inset 0 0 0 2px rgb\(255 255 255 \/ 42%\);/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__actions--short-play\s*\{[^}]*margin-top:\s*20px;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__actions--short-play\s*\{[^}]*pointer-events:\s*none;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__actions--short-play\s+\.c-tavern-gamble__action-button\s*\{[^}]*pointer-events:\s*auto;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /@keyframes tavern-short-discard-drop\s*\{[\s\S]*from\s*\{[\s\S]*transform:\s*translate\(var\(--tile-shift-x\),\s*-30px\);[\s\S]*\}[\s\S]*to\s*\{[\s\S]*transform:\s*translate\(var\(--tile-shift-x\),\s*0px\);[\s\S]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__center--short\s*\{[^}]*top:\s*calc\(44%\s*-\s*69px\);[^}]*width:\s*calc\(100%\s*-\s*120px\);[^}]*max-width:\s*420px;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__log\s*\{[^}]*left:\s*18px;[^}]*right:\s*auto;[^}]*bottom:\s*18px;[^}]*width:\s*min\(240px,\s*calc\(100%\s*-\s*36px\)\);[^}]*height:\s*min\(320px,\s*calc\(100%\s*-\s*36px\)\);[^}]*max-height:\s*none;[^}]*padding:\s*10px 12px;[^}]*border:\s*1px solid rgb\(255 230 168 \/ 28%\);[^}]*border-radius:\s*10px;[^}]*transform:\s*none;[^}]*background:\s*rgb\(10 41 33 \/ 84%\);[^}]*box-shadow:\s*inset 0 0 0 1px rgb\(255 255 255 \/ 6%\),\s*0 12px 28px rgb\(0 0 0 \/ 26%\);[^}]*text-align:\s*left;/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__actions-row\s*\{[^}]*display:\s*flex;[^}]*flex-wrap:\s*wrap;[^}]*justify-content:\s*center;[^}]*width:\s*100%;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__actions-row--primary\s*\{[^}]*transform:\s*translateY\(-40px\);[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__claim-countdown\s*\{[^}]*display:\s*flex;[^}]*flex-direction:\s*column;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__actions-row--claim\s*\{[^}]*transform:\s*translateY\(-20px\);[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__claim-countdown\s*\{[^}]*transform:\s*translateY\(-20px\);[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__claim-countdown-fill\s*\{[^}]*will-change:\s*width;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__seat-melds\s*\{[^}]*display:\s*grid;[^}]*gap:\s*6px;[^}]*justify-items:\s*center;/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__seat-meld-group\s*\{[^}]*display:\s*grid;[^}]*gap:\s*4px;[^}]*justify-items:\s*center;/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__seat-meld-kind\s*\{[^}]*font-size:\s*0\.72rem;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__seat-discards\s+\.c-tavern-gamble__tile--discard,\s*\.c-tavern-gamble__seat-meld-tiles\s+\.c-tavern-gamble__tile--discard\s*\{[^}]*width:\s*30px;[^}]*min-width:\s*30px;[^}]*height:\s*40px;[^}]*min-height:\s*40px;[^}]*flex:\s*0 0 30px;[^}]*font-size:\s*0\.72rem;/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__seat-discards\s+\.c-tavern-gamble__tile--discard,\s*\.c-tavern-gamble--short\s+\.c-tavern-gamble__seat-meld-tiles\s+\.c-tavern-gamble__tile--discard\s*\{[^}]*height:\s*var\(--tavern-short-seat-discard-height\);[^}]*min-height:\s*var\(--tavern-short-seat-discard-height\);[^}]*--tavern-short-tile-depth-local-step-1:\s*var\(--tavern-short-seat-discard-depth-step-1\);[^}]*--tavern-short-tile-depth-local-step-shift:\s*var\(--tavern-short-seat-discard-depth-step-shift\);[^}]*--tavern-short-tile-depth-local-accent-offset:\s*var\(--tavern-short-seat-discard-depth-accent-offset\);/su
  );
  assert.match(
    teaHouseCss,
    /@media \(width <= 760px\)\s*\{[\s\S]*?\.c-tavern-gamble__seat-discards\s+\.c-tavern-gamble__tile--discard,\s*\.c-tavern-gamble__seat-meld-tiles\s+\.c-tavern-gamble__tile--discard\s*\{[^}]*width:\s*24px;[^}]*min-width:\s*24px;[^}]*height:\s*34px;[^}]*min-height:\s*34px;[^}]*flex:\s*0 0 24px;[^}]*font-size:\s*0\.66rem;/su
  );
  assert.match(
    teaHouseCss,
    /@media \(width <= 760px\)\s*\{[\s\S]*?\.c-tavern-gamble--short\s*\{[^}]*--tavern-short-seat-discard-height:\s*calc\(34px\s*\*\s*15\s*\/\s*16\);[^}]*--tavern-short-seat-discard-depth-step-1:\s*calc\(var\(--tavern-short-seat-discard-height\)\s*\*\s*2\s*\/\s*17\);[^}]*--tavern-short-seat-discard-depth-step-shift:\s*calc\(var\(--tavern-short-seat-discard-height\)\s*\*\s*9\s*\/\s*136\);[^}]*--tavern-short-seat-discard-depth-accent-offset:\s*calc\(var\(--tavern-short-seat-discard-height\)\s*\*\s*69\s*\/\s*272\);/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__seat--short-0\s*\{[^}]*bottom:\s*60px;[^}]*width:\s*min\(260px,\s*calc\(100%\s*-\s*48px\)\);[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /@media \(width <= 760px\)\s*\{[\s\S]*?\.c-tavern-gamble__seat--short-1,\s*\.c-tavern-gamble__seat--short-3\s*\{[^}]*top:\s*38%;[^}]*width:\s*112px;[^}]*height:\s*138px;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /@media \(width <= 760px\)\s*\{[\s\S]*?\.c-tavern-gamble__seat--short-1\s+\.c-tavern-gamble__seat-discards,\s*\.c-tavern-gamble__seat--short-3\s+\.c-tavern-gamble__seat-discards\s*\{[^}]*top:\s*72px;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /@media \(width <= 760px\)\s*\{[\s\S]*?\.c-tavern-gamble__seat--short-1\s+\.c-tavern-gamble__seat-melds,\s*\.c-tavern-gamble__seat--short-3\s+\.c-tavern-gamble__seat-melds\s*\{[^}]*top:\s*112px;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__actions--short-play\s*\{[^}]*margin-top:\s*12px;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__showdown\s*\{[^}]*position:\s*absolute;[^}]*top:\s*50%;[^}]*left:\s*50%;[^}]*transform:\s*translate\(-50%,\s*-50%\);[^}]*display:\s*flex;[^}]*flex-wrap:\s*wrap;[^}]*justify-content:\s*center;/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__showdown\s*>\s*div\s*\{[^}]*flex:\s*1 1 140px;[^}]*max-width:\s*170px;/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__showdown\s+header\s*\{[^}]*flex-direction:\s*column;[^}]*align-items:\s*center;/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__showdown-actions\s*\{[^}]*flex-basis:\s*100%;[^}]*width:\s*100%;[^}]*justify-content:\s*center;[^}]*padding:\s*0;[^}]*border:\s*0;[^}]*background:\s*none;[^}]*box-shadow:\s*none;/su
  );
});

test("tavern short CSS renders stacked tile depth above hands and below table cards", () => {
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s*\{[^}]*--tavern-short-tile-depth-step-1:\s*8px;[^}]*--tavern-short-tile-depth-step-2:\s*9px;[^}]*--tavern-short-tile-depth-step-3:\s*24px;[^}]*--tavern-short-tile-depth-step-shift:\s*calc\(var\(--tavern-short-tile-depth-step-2\)\s*\/\s*2\);[^}]*--tavern-short-tile-depth-accent-shift:\s*calc\(var\(--tavern-short-tile-depth-step-2\)\s*-\s*\(var\(--tavern-short-tile-depth-step-shift\)\s*\/\s*2\)\);[^}]*--tavern-short-tile-depth-side:\s*rgb\(221 223 218\);[^}]*--tavern-short-tile-depth-mid:\s*rgb\(173 176 179\);[^}]*--tavern-short-tile-depth-accent:\s*rgb\(62 171 214\);[^}]*--tavern-short-seat-discard-height:\s*calc\(40px\s*\*\s*15\s*\/\s*16\);[^}]*--tavern-short-seat-discard-depth-step-1:\s*calc\(var\(--tavern-short-seat-discard-height\)\s*\*\s*2\s*\/\s*17\);[^}]*--tavern-short-seat-discard-depth-step-shift:\s*calc\(var\(--tavern-short-seat-discard-height\)\s*\*\s*9\s*\/\s*136\);[^}]*--tavern-short-seat-discard-depth-accent-offset:\s*calc\(var\(--tavern-short-seat-discard-height\)\s*\*\s*69\s*\/\s*272\);[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__tile\s*\{[^}]*--tavern-short-tile-depth-local-step-1:\s*var\(--tavern-short-tile-depth-step-1\);[^}]*--tavern-short-tile-depth-local-step-shift:\s*var\(--tavern-short-tile-depth-step-shift\);[^}]*--tavern-short-tile-depth-local-accent-offset:\s*calc\(var\(--tavern-short-tile-depth-step-3\)\s*-\s*var\(--tavern-short-tile-depth-accent-shift\)\);[^}]*position:\s*relative;[^}]*isolation:\s*isolate;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__tile:not\(\.c-tavern-gamble__tile--hand-public\):not\(\.c-tavern-gamble__tile--discard-public\):not\(\.is-covered\)\s*\{[^}]*background:\s*rgb\(221 223 218\);[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__tile--hand\[aria-disabled="true"\]\s*\{[^}]*opacity:\s*1;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__tile--depth-top::before,\s*\.c-tavern-gamble--short\s+\.c-tavern-gamble__tile--depth-top::after,\s*\.c-tavern-gamble--short\s+\.c-tavern-gamble__tile--depth-bottom::before,\s*\.c-tavern-gamble--short\s+\.c-tavern-gamble__tile--depth-bottom::after\s*\{[^}]*content:\s*"";[^}]*position:\s*absolute;[^}]*inset:\s*0;[^}]*border-radius:\s*inherit;[^}]*pointer-events:\s*none;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__tile--depth-top::before,\s*\.c-tavern-gamble--short\s+\.c-tavern-gamble__tile--depth-bottom::before\s*\{[^}]*z-index:\s*-1;[^}]*background:\s*var\(--tavern-short-tile-depth-side\);[^}]*opacity:\s*1;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__tile--depth-top::after,\s*\.c-tavern-gamble--short\s+\.c-tavern-gamble__tile--depth-bottom::after\s*\{[^}]*z-index:\s*-2;[^}]*background:\s*var\(--tavern-short-tile-depth-accent\);[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__tile--depth-top::before\s*\{[^}]*transform:\s*translateY\(calc\(var\(--tavern-short-tile-depth-local-step-1\)\s*\*\s*-1\)\);[^}]*box-shadow:\s*0\s+calc\(var\(--tavern-short-tile-depth-local-step-shift\)\s*\*\s*-1\)\s+0\s+0\s+var\(--tavern-short-tile-depth-mid\);[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__tile--depth-top::after\s*\{[^}]*transform:\s*translateY\(calc\(var\(--tavern-short-tile-depth-local-accent-offset\)\s*\*\s*-1\)\);[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__tile--depth-bottom::before\s*\{[^}]*transform:\s*translateY\(var\(--tavern-short-tile-depth-local-step-1\)\);[^}]*box-shadow:\s*0\s+var\(--tavern-short-tile-depth-local-step-shift\)\s+0\s+0\s+var\(--tavern-short-tile-depth-mid\);[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__tile--depth-bottom::after\s*\{[^}]*transform:\s*translateY\(var\(--tavern-short-tile-depth-local-accent-offset\)\);[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble--short\s+\.c-tavern-gamble__tile--depth-top\.is-selected::after,\s*\.c-tavern-gamble--short\s+\.c-tavern-gamble__tile--depth-bottom\.is-selected::after\s*\{[^}]*left:\s*-3px;[^}]*right:\s*-3px;[^}]*box-shadow:\s*inset 3px 0 0 #f7d982,\s*inset -3px 0 0 #f7d982,\s*inset 0 3px 0 #f7d982;[^}]*\}/su
  );
});

test("tavern short showdown markup keeps real hand labels for horizontal result cards", () => {
  const markup = renderTavernHouseView({
    moduleId: "tavern",
    houseId: "house.tavern",
    sceneTitle: "Tavern",
    sceneSubtitle: "Preview",
    standbyRoster: [],
    dialogue: null,
    actionContainer: null,
    statusCard: null,
    overlay: {
      type: "gamble-table",
      variant: "short",
      title: "Short Table",
      phase: "showdown",
      pot: 1200,
      currentBet: 200,
      chipLabel: "chips",
      publicCards: [],
      handCards: [],
      sidePotLabels: [],
      pendingIncomingCard: null,
      visibleDiscard: null,
      claimOptions: [],
      availableActions: [],
      highlightAvailableActions: false,
      playerRows: [],
      logLines: [],
      showdownRows: [
        {
          playerName: "traveler",
          bestLabel: "两对",
          winningPotLabels: ["main 1200"],
          chipDelta: 600,
          folded: false,
          winner: true,
        },
      ],
      actionIds: {
        check: "check",
        call: "call",
        raise: "raise",
        fold: "fold",
        close: "close",
      },
    },
    leaveAction: { id: "leave-house", label: "Leave" },
  });

  assert.match(markup, /traveler/u);
  assert.match(markup, /两对/u);
  assert.match(markup, /\+600 筹码/u);
});

test("tavern short showdown keeps between-hand actions inside the settlement area", () => {
  const markup = renderTavernHouseView({
    moduleId: "tavern",
    houseId: "house.tavern",
    sceneTitle: "Tavern",
    sceneSubtitle: "Preview",
    standbyRoster: [],
    dialogue: null,
    actionContainer: null,
    statusCard: null,
    overlay: {
      type: "gamble-table",
      variant: "short",
      title: "Short Table",
      phase: "showdown",
      pot: 1200,
      currentBet: 200,
      chipLabel: "chips",
      publicCards: [],
      handCards: [],
      sidePotLabels: [],
      pendingIncomingCard: null,
      visibleDiscard: null,
      claimOptions: [],
      availableActions: ["continue", "cash-out"],
      highlightAvailableActions: true,
      playerRows: [],
      logLines: [],
      showdownRows: [
        {
          playerName: "traveler",
          bestLabel: "涓ゅ",
          winningPotLabels: ["main 1200"],
          chipDelta: 600,
          folded: false,
          winner: true,
        },
      ],
      betweenHandActions: {
        continueActionId: "gamble-short-continue-hand",
        cashOutActionId: "gamble-short-cash-out",
      },
      actionIds: {
        check: "check",
        call: "call",
        raise: "raise",
        fold: "fold",
        close: "close",
      },
    },
    leaveAction: { id: "leave-house", label: "Leave" },
  });

  const shortPlayActionIndex = markup.indexOf(
    'c-tavern-gamble__actions c-tavern-gamble__actions--short-play'
  );
  const handAreaIndex = markup.indexOf('class="c-tavern-gamble__hand-on-felt"');
  const shortPlayMarkup = markup.slice(shortPlayActionIndex, handAreaIndex);
  const showdownIndex = markup.indexOf('class="c-tavern-gamble__showdown"');
  const continueIndex = markup.indexOf('data-house-action="gamble-short-continue-hand"');
  const cashOutIndex = markup.indexOf('data-house-action="gamble-short-cash-out"');

  assert.doesNotMatch(shortPlayMarkup, /gamble-short-continue-hand/u);
  assert.doesNotMatch(shortPlayMarkup, /gamble-short-cash-out/u);
  assert.ok(showdownIndex >= 0);
  assert.ok(continueIndex > showdownIndex);
  assert.ok(cashOutIndex > showdownIndex);
  assert.match(markup, /开始下一轮/u);
  assert.match(markup, /结束对局/u);
  assert.match(
    markup,
    /(?:class="[^"]*c-grain-shop-button--gold[^"]*"[^>]*data-house-action="gamble-short-continue-hand"|data-house-action="gamble-short-continue-hand"[^>]*class="[^"]*c-grain-shop-button--gold[^"]*")/u
  );
  assert.match(
    markup,
    /(?:class="[^"]*c-grain-shop-button--gold[^"]*"[^>]*data-house-action="gamble-short-cash-out"|data-house-action="gamble-short-cash-out"[^>]*class="[^"]*c-grain-shop-button--gold[^"]*")/u
  );
});

test("tavern long overlay still renders existing long-mode structure", () => {
  const session = createTavernLongGambleSession({
    wager: 100,
    seed: 33,
    playerName: "tester",
  });
  assert.equal(session.variant, "long");
  assert.equal(session.players[0].publicTileSlots.length, 9);
});
