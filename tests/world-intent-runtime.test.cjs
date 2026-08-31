const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  prototypeCards,
  prototypeMap,
  prototypeValuables,
} = require("../.test-dist/content/prototype-world.js");

function requireSource(path) {
  assert.equal(
    fs.existsSync(path),
    true,
    `Expected source file to exist: ${path}`
  );
  return fs.readFileSync(path, "utf8");
}

function createBaseAppState(currentHouseId = "house.kulan.temple") {
  return {
    gameState: createInitialState({
      currentMapId: prototypeMap.id,
      currentCityId: "city.kulan",
      currentHouseId,
      playerCharacterId: "char.player",
      chapterId: "chapter.prototype",
      year: 1567,
      month: 1,
      day: 1,
      pinnedCharacterId: "char.player",
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
            prototypeValuables.find(
              (valuableDefinition) => valuableDefinition.category === "weapon"
            )?.id ?? null,
          armorId:
            prototypeValuables.find(
              (valuableDefinition) => valuableDefinition.category === "armor"
            )?.id ?? null,
        },
      },
      currentView: currentHouseId == null ? "city" : "house",
    }),
    characterDefinitions: [],
    playerCoordinate: { x: 0, y: 0 },
    campaignActorState: { facingDegrees: 0, isMoving: false },
    campaignTravelState: null,
    modalState: null,
    locationDialogueState: null,
    beggingMiniGameState: null,
    cityCardDrawTestState: null,
    cityMenuState: null,
    cityDirectoryState: null,
    autoAdvanceState: null,
    uiLayouts: {},
    layoutEditor: {
      active: false,
      selectedTargetId: null,
      selectedComponentId: null,
      selectedElementId: null,
      backgroundMode: "off",
      backgroundAssetId: null,
      backgroundAssetQuery: "",
      backgroundSlice: null,
      battleUiValues: {},
    },
    worldIntentState: {
      draftText: "",
      status: "idle",
      currentRequestId: null,
      pendingResolution: null,
      lastError: null,
    },
  };
}

test("world-intent runtime contracts expose request lifecycle state and persistent observed-event support", () => {
  const worldIntentSource = requireSource("src/domain/world-intent.ts");
  const runtimeSource = requireSource("src/core/runtime/world-intent-runtime.ts");
  const gameStateSource = requireSource("src/domain/game-state.ts");
  const initialStateSource = requireSource(
    "src/application/state/create-initial-state.ts"
  );
  const appShellSource = requireSource("src/application/app-shell.ts");

  assert.match(worldIntentSource, /createInitialWorldIntentRuntimeState/u);
  assert.match(worldIntentSource, /recentEvents/u);
  assert.match(worldIntentSource, /eventLedger/u);
  assert.match(worldIntentSource, /reactionHints/u);
  assert.match(worldIntentSource, /lastKnownCityId/u);
  assert.match(runtimeSource, /createWorldIntentRuntimeBridge/u);
  assert.match(runtimeSource, /submit-text-intent/u);
  assert.match(runtimeSource, /observe-event/u);
  assert.match(runtimeSource, /cancel-request/u);
  assert.match(gameStateSource, /worldIntent/u);
  assert.match(initialStateSource, /createInitialWorldIntentRuntimeState/u);
  assert.match(appShellSource, /worldIntentState/u);
});

test("world-intent runtime records observed events, starts text-intent classification, and ignores stale completions after cancel", async () => {
  const {
    createWorldIntentRuntimeBridge,
  } = require("../.test-dist/core/runtime/world-intent-runtime.js");

  let appState = createBaseAppState();
  const providerRequests = [];
  let resolveCurrentRequest = null;

  const runtime = createWorldIntentRuntimeBridge({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp: () => {},
    selectCapabilitySnapshot: () => ({
      cityId: "city.kulan",
      currentHouseId: "house.kulan.temple",
      currentHouseModuleId: "temple-house",
      storyStage: "huangjue-temple",
      reachableHouses: [
        {
          houseId: "house.kulan.market",
          houseName: "商铺",
        },
      ],
      talkTargets: [],
      serviceActions: [],
      negotiableStoryNodes: [],
      leaveAction: {
        actionId: "leave-house",
        label: "离开寺庙",
      },
    }),
    worldIntentProvider: {
      classify(request) {
        providerRequests.push(request);
        return new Promise((resolve) => {
          resolveCurrentRequest = resolve;
        });
      },
    },
  });

  runtime.dispatch({
    type: "observe-event",
    event: {
      type: "enter-house",
      cityId: "city.kulan",
      houseId: "house.kulan.temple",
      summary: "玩家进入了皇觉寺。",
    },
  });

  assert.equal(appState.gameState.runtime.worldIntent.recentEvents.length, 1);
  assert.equal(
    appState.gameState.runtime.worldIntent.lastKnownHouseId,
    "house.kulan.temple"
  );

  runtime.dispatch({
    type: "submit-text-intent",
    text: "我要去商铺",
  });

  assert.equal(providerRequests.length, 1);
  assert.equal(providerRequests[0].text, "我要去商铺");
  assert.equal(providerRequests[0].capabilitySnapshot.cityId, "city.kulan");
  assert.equal(appState.worldIntentState.status, "classifying");
  const staleRequestId = appState.worldIntentState.currentRequestId;

  runtime.dispatch({
    type: "cancel-request",
  });

  assert.equal(appState.worldIntentState.status, "idle");
  assert.equal(appState.worldIntentState.currentRequestId, null);

  await resolveCurrentRequest({
    requestId: staleRequestId,
    result: {
      intent: "go-to-house",
      targetHouseId: "house.kulan.market",
      shortNarration: "你转身往商铺那边去。",
      confidence: 0.98,
    },
  });
  await Promise.resolve();

  assert.equal(appState.worldIntentState.status, "idle");
  assert.equal(appState.worldIntentState.pendingResolution, null);
});
