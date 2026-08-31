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

function createBaseAppState(currentHouseId = "house.kulan.market") {
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

test("house action-memory contracts expose typed payloads on observed events and NPC reaction memories", () => {
  const worldIntentSource = requireSource("src/domain/world-intent.ts");
  const npcDialogueSource = requireSource("src/domain/npc-ai-dialogue.ts");
  const runtimeSource = requireSource("src/core/runtime/world-intent-runtime.ts");

  assert.match(worldIntentSource, /HouseActionMemoryKind/u);
  assert.match(worldIntentSource, /houseActionMemory/u);
  assert.match(npcDialogueSource, /houseActionMemory/u);
  assert.match(runtimeSource, /houseActionMemory/u);
});

test("observe-event keeps ledger-only house action memory out of NPC reactions while preserving typed context for commentable memories", () => {
  const {
    createWorldIntentRuntimeBridge,
  } = require("../.test-dist/core/runtime/world-intent-runtime.js");

  let appState = createBaseAppState();
  const runtime = createWorldIntentRuntimeBridge({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp: () => {},
    selectCapabilitySnapshot: () => ({
      cityId: "city.kulan",
      currentHouseId: "house.kulan.market",
      currentHouseModuleId: "market-house",
      storyStage: "test",
      reachableHouses: [],
      talkTargets: [],
      serviceActions: [],
      negotiableStoryNodes: [],
      leaveAction: {
        actionId: "leave-house",
        label: "离开货铺",
      },
    }),
  });

  runtime.dispatch({
    type: "observe-event",
    event: {
      type: "market:buy:preview",
      cityId: "city.kulan",
      houseId: "house.kulan.market",
      summary: "玩家在货铺翻看了买货账簿。",
      houseActionMemory: {
        kind: "panel-open",
        panelId: "market-buy",
        panelLabel: "买入货物",
        resultKind: "preview",
      },
    },
  });
  runtime.dispatch({
    type: "observe-event",
    event: {
      type: "market:buy:abandon",
      cityId: "city.kulan",
      houseId: "house.kulan.market",
      summary: "玩家在货铺看了看货单，却没有买任何货物。",
      houseActionMemory: {
        kind: "panel-close-without-action",
        panelId: "market-buy",
        panelLabel: "买入货物",
        resultKind: "no-action",
      },
      reactionHints: [
        {
          characterId: "char.kulan_market_boss",
          summary: "他方才翻了翻货单，却没下手买货。",
        },
      ],
    },
  });

  const worldIntent = appState.gameState.runtime.worldIntent;
  const reactionRecord =
    appState.gameState.runtime.npcDialogue.reactionMemoriesByCharacterId[
      "char.kulan_market_boss"
    ];

  assert.equal(worldIntent.eventLedger.length, 2);
  assert.equal(worldIntent.eventLedger[0]?.houseActionMemory?.kind, "panel-open");
  assert.equal(
    worldIntent.eventLedger[1]?.houseActionMemory?.kind,
    "panel-close-without-action"
  );
  assert.equal(reactionRecord.entries.length, 1);
  assert.equal(reactionRecord.entries[0]?.houseId, "house.kulan.market");
  assert.equal(
    reactionRecord.entries[0]?.houseActionMemory?.kind,
    "panel-close-without-action"
  );
  assert.equal(
    reactionRecord.entries[0]?.houseActionMemory?.resultKind,
    "no-action"
  );
});
