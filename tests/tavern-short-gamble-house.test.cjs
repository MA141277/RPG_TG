const test = require("node:test");
const assert = require("node:assert/strict");

const { createInitialState } = require("../.test-dist/application/state/create-initial-state.js");
const {
  prototypeCards,
  prototypeCharacters,
  prototypeHouses,
  prototypeMap,
  prototypeValuables,
} = require("../.test-dist/content/prototype-world.js");
const {
  tavernHouseModule,
} = require("../.test-dist/application/house-modules/tavern/tavern-house-module.js");
const {
  createTavernShortTableSession,
  continueTavernShortTableSession,
  updateTavernShortTableSession,
} = require("../.test-dist/application/house-modules/tavern/tavern-short-gamble-session.js");
const {
  ACTIVITY_COMPLETION_STAMINA_COST,
} = require("../.test-dist/application/player/player-stamina.js");
const {
  advanceTavernShortNpcAction,
  resolveTavernShortBetAction,
} = require("../.test-dist/domain/tavern-short-gambling.js");

const playerCharacterId = "char.player";
const tavernHouse = prototypeHouses.find((house) => house.moduleId === "tavern");
const SHORT_CLAIM_TIMEOUT_TICK_ID = "tavern-gamble-short-claim-timeout";

function createBaseState() {
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: "city.kulan",
    currentHouseId: tavernHouse.id,
    playerCharacterId,
    chapterId: "chapter.prototype",
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: playerCharacterId,
    reviewDateText: "test",
    mainHouseMissionText: "test",
    cards: {
      ownedCardIds: prototypeCards.map((cardDefinition) => cardDefinition.id),
      selectedCardId: prototypeCards[0]?.id ?? null,
    },
    valuables: {
      items: prototypeValuables,
      selectedItemId: prototypeValuables[0]?.id ?? null,
      equippedWeaponSet: {
        swordId:
          prototypeValuables.find((valuableDefinition) => valuableDefinition.category === "weapon")
            ?.id ?? null,
        armorId:
          prototypeValuables.find((valuableDefinition) => valuableDefinition.category === "armor")
            ?.id ?? null,
      },
    },
    currentView: "house",
  });
}

function getPlayerCharacter(characterDefinitions) {
  const playerCharacter = characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === playerCharacterId
  );
  assert.ok(playerCharacter);
  return playerCharacter;
}

function openShortTable(baseState, characters, buyInGold, enableDebugPreset = false) {
  const entered = tavernHouseModule.enter({
    gameState: baseState,
    characterDefinitions: characters,
    houseDefinition: tavernHouse,
    playerCharacterId,
  });
  const opened = tavernHouseModule.dispatch({
    gameState: entered.gameState,
    characterDefinitions: entered.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: entered.sessionState,
    request: { type: "action", actionId: "open-gamble" },
  });
  const selected = tavernHouseModule.dispatch({
    gameState: opened.gameState,
    characterDefinitions: opened.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: opened.sessionState,
    request: { type: "action", actionId: "select-gamble-variant:short" },
  });
  const toggled =
    !enableDebugPreset
      ? selected
      : tavernHouseModule.dispatch({
          gameState: selected.gameState,
          characterDefinitions: selected.characterDefinitions,
          houseDefinition: tavernHouse,
          playerCharacterId,
          sessionState: selected.sessionState,
          request: {
            type: "action",
            actionId: "toggle-short-debug-claim-cycle",
          },
        });
  return tavernHouseModule.dispatch({
    gameState: toggled.gameState,
    characterDefinitions: toggled.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: { ...toggled.sessionState, currentWager: buyInGold },
    request: { type: "action", actionId: "confirm-gamble" },
  });
}

function advanceShortHandToHumanClaimWindow(hand) {
  let nextHand = hand;
  for (let step = 0; step < 32; step += 1) {
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

function continueShortTableForDebug(table, seed) {
  return continueTavernShortTableSession(
    {
      ...table,
      currentHand: null,
      prompt: "continue-or-cashout",
    },
    seed
  );
}

function syncShortTableToHumanClaimWindow(table) {
  return updateTavernShortTableSession(
    table,
    advanceShortHandToHumanClaimWindow(table.currentHand)
  );
}

test("tavern short buy-in exchanges gold to chips and charges stamina once per table", () => {
  const started = openShortTable(createBaseState(), prototypeCharacters, 100);
  const player = getPlayerCharacter(started.characterDefinitions);
  assert.equal(started.sessionState.gambleSession.variant, "short");
  assert.equal(player.stats.gold, 20);
  assert.equal(
    player.stamina,
    getPlayerCharacter(prototypeCharacters).stamina - ACTIVITY_COMPLETION_STAMINA_COST
  );
});

test("tavern short continue next hand reuses bankroll instead of charging gold again", () => {
  const started = openShortTable(createBaseState(), prototypeCharacters, 100);
  const afterContinue = tavernHouseModule.dispatch({
    gameState: started.gameState,
    characterDefinitions: started.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: started.sessionState,
    request: { type: "action", actionId: "gamble-short-continue-hand" },
  });
  assert.equal(afterContinue.sessionState.gambleSession.variant, "short");
  assert.equal(
    getPlayerCharacter(afterContinue.characterDefinitions).stats.gold,
    getPlayerCharacter(started.characterDefinitions).stats.gold
  );
});

test("tavern short cash-out defers gold payout until the alert is acknowledged", () => {
  const started = openShortTable(createBaseState(), prototypeCharacters, 100);
  const goldBeforeCashOut = getPlayerCharacter(started.characterDefinitions).stats.gold;
  const cashout = tavernHouseModule.dispatch({
    gameState: started.gameState,
    characterDefinitions: started.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: started.sessionState,
    request: { type: "action", actionId: "gamble-short-cash-out" },
  });
  assert.equal(cashout.sessionState.gambleSession, null);
  assert.equal(cashout.sessionState.overlay.type, "alert");
  assert.equal(
    getPlayerCharacter(cashout.characterDefinitions).stats.gold,
    goldBeforeCashOut
  );

  const closedAlert = tavernHouseModule.dispatch({
    gameState: cashout.gameState,
    characterDefinitions: cashout.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: cashout.sessionState,
    request: { type: "action", actionId: "close-alert" },
  });

  assert.equal(closedAlert.sessionState.overlay, null);
  assert.equal(
    getPlayerCharacter(closedAlert.characterDefinitions).stats.gold,
    goldBeforeCashOut + 100
  );
  assert.deepEqual(closedAlert.sideEffects, [
    {
      type: "play-coin-reward",
      playerCharacterId,
      delta: 100,
      source: "request-pointer",
    },
  ]);
});

test("tavern short debug toggle starts a stable pong-kong-chow claim cycle across consecutive hands", () => {
  const started = openShortTable(createBaseState(), prototypeCharacters, 100, true);
  assert.equal(started.sessionState.gambleSession.variant, "short");

  let table = started.sessionState.gambleSession.table;
  assert.equal(table.debugPresetMode, "claim-cycle");

  let hand = advanceShortHandToHumanClaimWindow(table.currentHand);
  assert.deepEqual(
    hand.claimChain.options
      .filter((option) => option.seatId === "you")
      .map((option) => option.kind),
    ["pong"]
  );

  table = continueShortTableForDebug(table, 101);
  hand = advanceShortHandToHumanClaimWindow(table.currentHand);
  assert.deepEqual(
    hand.claimChain.options
      .filter((option) => option.seatId === "you")
      .map((option) => option.kind),
    ["kong"]
  );

  table = continueShortTableForDebug(table, 102);
  hand = advanceShortHandToHumanClaimWindow(table.currentHand);
  assert.deepEqual(
    hand.claimChain.options
      .filter((option) => option.seatId === "you")
      .map((option) => option.kind),
    ["chow"]
  );
});

test("tavern short claim countdown only starts for non-upstream pong-kong windows", () => {
  const table = createTavernShortTableSession({
    playerName: "tester",
    buyInGold: 100,
    seed: 17,
  });
  const visibleDiscard = { id: "wan-7", suit: "wan", rank: 7 };

  const timedTable = updateTavernShortTableSession(table, {
    ...table.currentHand,
    phase: "claim-window",
    actingSeatIndex: 0,
    claimChain: {
      discarderSeatId: "traveler",
      visibleDiscard,
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
      card: visibleDiscard,
    },
  });
  assert.deepEqual(timedTable.claimCountdown, {
    totalSeconds: 10,
    remainingSeconds: 10,
  });

  const upstreamTable = updateTavernShortTableSession(table, {
    ...table.currentHand,
    phase: "claim-window",
    actingSeatIndex: 0,
    claimChain: {
      discarderSeatId: "guard",
      visibleDiscard,
      originalResumeSeatId: "you",
      turnOwnerSeatId: "guard",
      stage: "kong-pong-chow",
      chainDepth: 0,
      passedSeatIds: [],
      options: [
        {
          id: "kong:you:wan-7:wan-7a:wan-7b:wan-7c",
          seatId: "you",
          kind: "kong",
          discardCardId: "wan-7",
          consumeCardIds: ["wan-7a", "wan-7b", "wan-7c"],
          priority: 3,
        },
      ],
    },
    lastVisibleDiscard: {
      seatId: "guard",
      card: visibleDiscard,
    },
  });
  assert.equal(upstreamTable.claimCountdown, null);

  const chowOnlyTable = updateTavernShortTableSession(table, {
    ...table.currentHand,
    phase: "claim-window",
    actingSeatIndex: 0,
    claimChain: {
      discarderSeatId: "traveler",
      visibleDiscard,
      originalResumeSeatId: "you",
      turnOwnerSeatId: "traveler",
      stage: "chow",
      chainDepth: 0,
      passedSeatIds: [],
      options: [
        {
          id: "chow:you:wan-7:wan-5:wan-6",
          seatId: "you",
          kind: "chow",
          discardCardId: "wan-7",
          consumeCardIds: ["wan-5", "wan-6"],
          priority: 1,
        },
      ],
    },
    lastVisibleDiscard: {
      seatId: "traveler",
      card: visibleDiscard,
    },
  });
  assert.equal(chowOnlyTable.claimCountdown, null);
});

test("tavern short claim countdown auto-skips after ten seconds", () => {
  const started = openShortTable(createBaseState(), prototypeCharacters, 100, true);
  let table = syncShortTableToHumanClaimWindow(started.sessionState.gambleSession.table);
  assert.equal(table.currentHand.claimChain.discarderSeatId, "traveler");
  assert.equal(table.claimCountdown.remainingSeconds, 10);

  let transition = {
    gameState: started.gameState,
    characterDefinitions: started.characterDefinitions,
    sessionState: {
      ...started.sessionState,
      gambleSession: {
        variant: "short",
        table,
      },
    },
  };

  for (let step = 0; step < 9; step += 1) {
    transition = tavernHouseModule.dispatch({
      gameState: transition.gameState,
      characterDefinitions: transition.characterDefinitions,
      houseDefinition: tavernHouse,
      playerCharacterId,
      sessionState: transition.sessionState,
      request: { type: "tick", tickId: SHORT_CLAIM_TIMEOUT_TICK_ID },
    });
  }

  table = transition.sessionState.gambleSession.table;
  assert.deepEqual(table.claimCountdown, {
    totalSeconds: 10,
    remainingSeconds: 1,
  });

  transition = tavernHouseModule.dispatch({
    gameState: transition.gameState,
    characterDefinitions: transition.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: transition.sessionState,
    request: { type: "tick", tickId: SHORT_CLAIM_TIMEOUT_TICK_ID },
  });

  table = transition.sessionState.gambleSession.table;
  assert.equal(table.claimCountdown, null);
  assert.notEqual(table.currentHand.phase, "claim-window");
  assert.equal(
    table.currentHand.claimChain?.options.some((option) => option.seatId === "you") ?? false,
    false
  );
});

test("tavern short claim countdown disappears once the player selects pong or kong", () => {
  const started = openShortTable(createBaseState(), prototypeCharacters, 100, true);
  const table = syncShortTableToHumanClaimWindow(started.sessionState.gambleSession.table);
  const option = table.currentHand.claimChain.options.find(
    (candidate) => candidate.seatId === "you" && candidate.kind === "pong"
  );
  assert.ok(option);
  assert.deepEqual(table.claimCountdown, {
    totalSeconds: 10,
    remainingSeconds: 10,
  });

  const claimed = tavernHouseModule.dispatch({
    gameState: started.gameState,
    characterDefinitions: started.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: {
      ...started.sessionState,
      gambleSession: {
        variant: "short",
        table,
      },
    },
    request: { type: "action", actionId: `gamble-meld:${option.id}` },
  });

  const nextTable = claimed.sessionState.gambleSession.table;
  assert.equal(nextTable.claimCountdown, null);
  assert.equal(nextTable.currentHand.phase, "draw-discard");
  assert.equal(nextTable.currentHand.pendingIncomingCard?.ownerSeatId, "you");
  assert.equal(nextTable.currentHand.pendingIncomingCard?.source, "claim");
});

test("tavern short house ignores repeated claim actions after the player has already claimed", () => {
  const started = openShortTable(createBaseState(), prototypeCharacters, 100, true);
  const table = syncShortTableToHumanClaimWindow(started.sessionState.gambleSession.table);
  const option =
    table.currentHand.claimChain.options.find(
      (candidate) => candidate.seatId === "you" && candidate.kind === "pong"
    ) ??
    table.currentHand.claimChain.options.find((candidate) => candidate.seatId === "you");
  assert.ok(option);

  const claimed = tavernHouseModule.dispatch({
    gameState: started.gameState,
    characterDefinitions: started.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: {
      ...started.sessionState,
      gambleSession: {
        variant: "short",
        table,
      },
    },
    request: { type: "action", actionId: `gamble-meld:${option.id}` },
  });

  const afterClaim = claimed.sessionState.gambleSession.table;
  const afterClaimPlayer = afterClaim.currentHand.players.find(
    (player) => player.seatId === "you"
  );
  assert.ok(afterClaimPlayer);
  assert.equal(afterClaim.currentHand.phase, "draw-discard");
  assert.equal(afterClaimPlayer.meldHistory.length, 1);

  const repeated = tavernHouseModule.dispatch({
    gameState: claimed.gameState,
    characterDefinitions: claimed.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: {
      ...claimed.sessionState,
      gambleSession: {
        variant: "short",
        table: afterClaim,
      },
    },
    request: { type: "action", actionId: `gamble-meld:${option.id}` },
  });

  const afterRepeat = repeated.sessionState.gambleSession.table;
  const afterRepeatPlayer = afterRepeat.currentHand.players.find(
    (player) => player.seatId === "you"
  );
  assert.ok(afterRepeatPlayer);
  assert.equal(afterRepeat.currentHand.phase, "draw-discard");
  assert.equal(afterRepeat.claimCountdown, null);
  assert.equal(afterRepeat.currentHand.selectedDiscardCardId, null);
  assert.equal(afterRepeatPlayer.meldHistory.length, 1);
});
