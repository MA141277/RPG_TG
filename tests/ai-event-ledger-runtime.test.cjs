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

function createBaseAppState(currentHouseId = "house.kulan.tavern") {
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

test("shared AI event-ledger contracts expose durable ledger storage and related NPC reaction memories", () => {
  const worldIntentSource = requireSource("src/domain/world-intent.ts");
  const npcDialogueSource = requireSource("src/domain/npc-ai-dialogue.ts");
  const runtimeSource = requireSource("src/core/runtime/world-intent-runtime.ts");

  assert.match(worldIntentSource, /eventLedger/u);
  assert.match(worldIntentSource, /reactionHints/u);
  assert.match(worldIntentSource, /houseActionMemory/u);
  assert.match(npcDialogueSource, /reactionMemoriesByCharacterId/u);
  assert.match(npcDialogueSource, /houseActionMemory/u);
  assert.match(runtimeSource, /eventLedger/u);
  assert.match(runtimeSource, /reactionMemoriesByCharacterId/u);
  assert.match(runtimeSource, /houseActionMemory/u);
});

test("observe-event appends the shared ledger and keeps only the latest five reaction memories per related NPC", () => {
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
      currentHouseId: "house.kulan.tavern",
      currentHouseModuleId: "tavern",
      storyStage: "test",
      reachableHouses: [],
      talkTargets: [],
      serviceActions: [],
      negotiableStoryNodes: [],
      leaveAction: {
        actionId: "leave-house",
        label: "离开酒馆",
      },
    }),
  });

  for (let index = 1; index <= 6; index += 1) {
    runtime.dispatch({
      type: "observe-event",
      event: {
        type: `tavern:gamble:test-${index}`,
        cityId: "city.kulan",
        houseId: "house.kulan.tavern",
        summary: `酒馆事件 ${index}`,
        reactionHints: [
          {
            characterId: "char.kulan_tavern_boss",
            summary: `老板记忆 ${index}`,
          },
        ],
      },
    });
  }

  const ledger = appState.gameState.runtime.worldIntent.eventLedger;
  const reactions =
    appState.gameState.runtime.npcDialogue.reactionMemoriesByCharacterId[
      "char.kulan_tavern_boss"
    ].entries;

  assert.equal(ledger.length, 6);
  assert.equal(appState.gameState.runtime.worldIntent.recentEvents.length, 6);
  assert.equal(ledger[0].summary, "酒馆事件 1");
  assert.match(ledger[0].eventId, /world-observed-event-/u);
  assert.equal(reactions.length, 5);
  assert.deepEqual(
    reactions.map((entry) => entry.summary),
    ["老板记忆 2", "老板记忆 3", "老板记忆 4", "老板记忆 5", "老板记忆 6"]
  );
});

test("observe-event keeps the full durable ledger even after recent-events rolling windows trim", () => {
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
      currentHouseId: "house.kulan.tavern",
      currentHouseModuleId: "tavern",
      storyStage: "test",
      reachableHouses: [],
      talkTargets: [],
      serviceActions: [],
      negotiableStoryNodes: [],
      leaveAction: {
        actionId: "leave-house",
        label: "离开酒馆",
      },
    }),
  });

  for (let index = 1; index <= 75; index += 1) {
    runtime.dispatch({
      type: "observe-event",
      event: {
        type: `tavern:gamble:ledger-${index}`,
        cityId: "city.kulan",
        houseId: "house.kulan.tavern",
        summary: `账本事件 ${index}`,
      },
    });
  }

  const worldIntent = appState.gameState.runtime.worldIntent;

  assert.equal(worldIntent.recentEvents.length, 12);
  assert.equal(worldIntent.eventLedger.length, 75);
  assert.equal(worldIntent.eventLedger[0]?.summary, "账本事件 1");
  assert.equal(worldIntent.eventLedger.at(-1)?.summary, "账本事件 75");
});
