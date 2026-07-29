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
  assert.match(markup, /调试预设：已关闭/u);
  assert.match(markup, /连续几手会固定给出可碰、可杠、可吃的测试牌局/u);
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

  assert.deepEqual(overlay.availableActions, ["check", "call", "raise", "fold"]);
  assert.equal(overlay.highlightAvailableActions, false);
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
  assert.equal(
    overlay.handCards.find((card) => card.id === "wan-2")?.actionId,
    "gamble-play-tile:wan-2"
  );
  assert.equal(overlay.handCards.find((card) => card.id === "bing-7")?.actionId, undefined);
  assert.equal(overlay.handCards.find((card) => card.id === "tong-7")?.actionId, undefined);
  assert.equal(overlay.handCards.find((card) => card.id === "wan-7")?.actionId, undefined);
});

test("tavern short overlay exposes claim countdown data for timed pong-kong windows", () => {
  const table = createTavernShortTableSession({
    playerName: "tester",
    buyInGold: 100,
    seed: 17,
  });
  const overlay = selectTavernShortGambleOverlay({
    ...table,
    claimCountdown: {
      totalSeconds: 10,
      remainingSeconds: 6,
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

  assert.deepEqual(overlay.claimCountdown, {
    totalSeconds: 10,
    remainingSeconds: 6,
    progressPercent: 60,
    label: "剩余 6 秒",
  });
});

test("tavern short overlay exposes dedicated meld labels for each player row", () => {
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
  const expectedCards = [
    { id: "wan-7", suit: "wan", rank: 7 },
    { id: "bing-7", suit: "bing", rank: 7 },
    { id: "tong-7", suit: "tong", rank: 7 },
  ]
    .map(getTavernShortCardLabel)
    .join("");

  assert.ok(brokerRow);
  assert.equal(brokerRow.meldLabels.length, 1);
  assert.ok(brokerRow.meldLabels[0].endsWith(expectedCards));
  assert.ok(brokerRow.meldLabels[0].length > expectedCards.length);
  assert.doesNotMatch(brokerRow.meldLabels[0], /\b(?:wan|bing|tong)-7\b/u);
});

test("tavern house view moves short gameplay actions above the hand area while keeping close at the top", () => {
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
      sidePotLabels: ["main 800"],
      pendingIncomingCard: { source: "draw", label: "draw-5" },
      visibleDiscard: { seatName: "traveler", label: "discard-7" },
      claimOptions: [],
      availableActions: ["check", "call", "raise", "fold"],
      highlightAvailableActions: true,
      playerRows: [
        {
          id: "traveler",
          name: "traveler",
          seatIndex: 1,
          stack: 1200,
          committed: 200,
          folded: false,
          allIn: false,
          autoBetPending: false,
          meldLabels: ["meld-7-7-7"],
          discardLabels: ["discard-7"],
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

  assert.match(markup, /draw-5/u);
  const topActionIndex = markup.indexOf('data-house-action="close"');
  const shortTableIndex = markup.indexOf(
    'class="c-tavern-gamble__table c-tavern-gamble__table--short"'
  );
  const shortPlayActionIndex = markup.indexOf(
    'c-tavern-gamble__actions c-tavern-gamble__actions--short-play'
  );
  const handAreaIndex = markup.indexOf('class="c-tavern-gamble__hand-on-felt"');
  assert.ok(topActionIndex >= 0);
  assert.ok(shortTableIndex >= 0);
  assert.ok(topActionIndex < shortTableIndex);
  assert.ok(shortPlayActionIndex >= 0);
  assert.ok(handAreaIndex >= 0);
  assert.ok(shortPlayActionIndex < handAreaIndex);
  assert.match(markup, /class="c-tavern-gamble__player-summary"/u);
  assert.match(markup, /class="c-tavern-gamble__meld-strip"/u);
  assert.match(markup, /meld-7-7-7/u);
  assert.doesNotMatch(markup, /data-house-action="check"[^>]*disabled/u);
  assert.doesNotMatch(markup, /is-available/u);
  const meldRowIndex = markup.indexOf('class="c-tavern-gamble__meld-strip"');
  const discardRowIndex = markup.indexOf(
    'c-tavern-gamble__discard-strip c-tavern-gamble__discard-strip--narrow'
  );
  assert.ok(meldRowIndex >= 0);
  assert.ok(discardRowIndex > meldRowIndex);
  assert.match(
    markup,
    /c-tavern-gamble__discard-strip c-tavern-gamble__discard-strip--narrow/u
  );
  assert.doesNotMatch(markup, /c-tavern-gamble__discard-strip--vertical/u);
  assert.doesNotMatch(markup, /选择 3 张顺\/刻/u);
});

test("tavern house view grows the short action panel upward and renders claim actions in a dedicated upper row", () => {
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
        progressPercent: 60,
        label: "剩余 6 秒",
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

  assert.match(markup, /c-tavern-gamble__actions--short-play has-claim-row/u);
  assert.match(markup, /class="c-tavern-gamble__claim-countdown"/u);
  assert.match(markup, /剩余 6 秒/u);
  assert.match(markup, /aria-valuemax="10"/u);
  assert.match(markup, /aria-valuenow="6"/u);
  assert.match(markup, /data-house-action="gamble-meld:pong-option"/u);
  assert.match(markup, /data-house-action="gamble-skip-meld"/u);
  assert.ok(countdownIndex >= 0);
  assert.ok(claimRowIndex > countdownIndex);
  assert.ok(claimRowIndex >= 0);
  assert.ok(primaryRowIndex > claimRowIndex);
  assert.ok(handAreaIndex > primaryRowIndex);
});

test("tavern house view does not auto-wire discard clicks for short tiles without an explicit action id", () => {
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
      ],
      sidePotLabels: [],
      pendingIncomingCard: { source: "claim", label: "claim-7" },
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
});

test("tavern house view dims all short-table gameplay actions while another player is acting", () => {
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

  assert.match(markup, /data-house-action="check"[^>]*disabled/u);
  assert.match(markup, /data-house-action="call"[^>]*disabled/u);
  assert.match(markup, /data-house-action="raise"[^>]*disabled/u);
  assert.match(markup, /data-house-action="fold"[^>]*disabled/u);
  assert.doesNotMatch(markup, /is-available/u);
});

test("tavern short CSS places gameplay actions above the hand area, enlarges the log, uses horizontal opponent discards, and lays showdown cards out horizontally", () => {
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
    /\.c-tavern-gamble__center--short\s*\{[^}]*margin-inline:\s*auto;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__action-button\s*\{[^}]*color:\s*#[0-9a-fA-F]{3,6};/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__player-summary\s*\{[^}]*display:\s*grid;[^}]*gap:\s*2px;/su
  );
  assert.doesNotMatch(teaHouseCss, /\.c-tavern-gamble__player\s+div\s*\{/su);
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__tile--discard\s*\{[^}]*display:\s*grid;[^}]*place-items:\s*center;/su
  );
  assert.match(teaHouseCss, /\.c-tavern-gamble__action-button:disabled\s*\{[^}]*opacity:\s*0\.54;/su);
  assert.doesNotMatch(teaHouseCss, /\.c-tavern-gamble__action-button\.is-available\s*\{/su);
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__actions--top\s*\{[^}]*padding:\s*8px 14px;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__actions--short-play\s*\{[^}]*position:\s*absolute;[^}]*left:\s*50%;[^}]*bottom:\s*182px;[^}]*max-height:\s*none;[^}]*overflow:\s*visible;[^}]*display:\s*flex;[^}]*flex-direction:\s*column;[^}]*transform:\s*translateX\(-50%\);/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__actions--short-play\.has-claim-row\s*\{[^}]*padding-top:\s*14px;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__actions-row\s*\{[^}]*display:\s*flex;[^}]*flex-wrap:\s*wrap;[^}]*justify-content:\s*center;[^}]*width:\s*100%;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__claim-countdown\s*\{[^}]*display:\s*flex;[^}]*flex-direction:\s*column;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__claim-countdown-fill\s*\{[^}]*transition:\s*width 0\.25s ease;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__meld-strip\s*\{[^}]*display:\s*flex;[^}]*min-height:\s*24px;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__log\s*\{[^}]*max-height:\s*186px;[^}]*\}/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__discard-strip--narrow\s*\{[^}]*flex-wrap:\s*nowrap;[^}]*overflow-x:\s*auto;[^}]*overflow-y:\s*hidden;/su
  );
  assert.match(
    teaHouseCss,
    /\.c-tavern-gamble__discard-strip--narrow\s+\.c-tavern-gamble__tile--discard\s*\{[^}]*min-width:\s*48px;[^}]*width:\s*48px;[^}]*min-height:\s*63px;/su
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
