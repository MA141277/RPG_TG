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
const {
  createHouseRuntimeBridge,
} = require("../.test-dist/core/runtime/house-runtime.js");
const {
  createHouseModuleRegistry,
} = require("../.test-dist/core/registry/house-module-registry.js");

const playerCharacterId = "char.player";

function createBaseState(currentHouseId = null) {
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: "city.kulan",
    currentHouseId,
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
  });
}

function createHostHouseDefinition() {
  return {
    id: "house.kulan.temple_txt_narrative",
    cityId: "city.kulan",
    name: "皇觉寺（文游）",
    type: "temple",
    moduleId: "txt-narrative-place",
    characterIds: ["char.player"],
    defaultCharacterId: "char.player",
    backAction: {
      label: "返回濠州",
      targetView: "city",
    },
  };
}

function createCharacterDefinition(id, name, houseId) {
  return {
    id,
    name,
    birthYear: 1330,
    age: 20,
    cityId: "city.kulan",
    houseId,
    portraitId: `portrait.${id}`,
    stats: {
      leadership: 1,
      martial: 1,
      intelligence: 1,
      politics: 1,
      charm: 1,
      fame: 1,
      gold: 0,
    },
    stamina: 100,
    availableFunctions: [],
  };
}

test("house module and runtime contracts expose the TXT narrative provider seam", () => {
  const houseModuleSource = fs.readFileSync("src/domain/house-module.ts", "utf8");
  const houseRuntimeContractSource = fs.readFileSync(
    "src/core/contracts/house-runtime.ts",
    "utf8"
  );
  const houseRuntimeSource = fs.readFileSync(
    "src/core/runtime/house-runtime.ts",
    "utf8"
  );

  assert.match(houseModuleSource, /"txt-narrative-place"/u);
  assert.match(
    houseModuleSource,
    /type:\s*"txt-narrative-provider-event"/u
  );
  assert.match(
    houseModuleSource,
    /type:\s*"start-txt-narrative-stream"/u
  );
  assert.match(
    houseModuleSource,
    /type:\s*"cancel-txt-narrative-stream"/u
  );
  assert.match(
    houseModuleSource,
    /TxtNarrativePlaceSessionState/u
  );

  assert.match(
    houseRuntimeContractSource,
    /type:\s*"txt-narrative-provider-event"/u
  );

  assert.match(houseRuntimeSource, /txtNarrativeProvider/u);
  assert.match(
    houseRuntimeSource,
    /sideEffect\.type === "start-txt-narrative-stream"/u
  );
  assert.match(
    houseRuntimeSource,
    /sideEffect\.type === "cancel-txt-narrative-stream"/u
  );
  assert.match(
    houseRuntimeSource,
    /type:\s*"txt-narrative-provider-event"/u
  );
});

test("house runtime starts TXT narrative provider streams and forwards provider events back into house dispatch", async () => {
  const houseDefinition = createHostHouseDefinition();
  const providerRequests = [];
  const providerEventRequests = [];

  const fakeHouseModule = {
    moduleId: "txt-narrative-place",
    enter(input) {
      return {
        gameState: input.gameState,
        characterDefinitions: input.characterDefinitions,
        sessionState: {
          status: "streaming",
        },
        sideEffects: [
          {
            type: "start-txt-narrative-stream",
            requestId: "opening-request",
            payload: {
              requestId: "opening-request",
              system: "test-system",
              messages: [],
              metadata: {
                phaseId: "temple_alms_departure",
                houseId: "house.kulan.temple",
                placeName: "皇觉寺",
              },
            },
          },
        ],
      };
    },
    dispatch(input) {
      if (input.request.type === "txt-narrative-provider-event") {
        providerEventRequests.push(input.request);
      }
      return {
        gameState: input.gameState,
        characterDefinitions: input.characterDefinitions,
        sessionState: input.sessionState,
      };
    },
    leave(input) {
      return {
        gameState: input.gameState,
        characterDefinitions: input.characterDefinitions,
        sessionState: null,
      };
    },
    selectViewModel() {
      return {
        moduleId: "txt-narrative-place",
        houseId: houseDefinition.id,
        sceneTitle: houseDefinition.name,
        standbyRoster: [],
        dialogue: null,
        actionContainer: null,
        statusCard: null,
        overlay: null,
        leaveAction: {
          id: "leave-house",
          label: "离开",
        },
      };
    },
  };

  let appState = {
    gameState: createBaseState(null),
    characterDefinitions: [
      createCharacterDefinition("char.player", "朱重八", houseDefinition.id),
    ],
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
  };

  const runtime = createHouseRuntimeBridge({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp: () => {},
    playCoinReward: () => {},
    startMapAutoAdvance: () => {},
    stopMapAutoAdvance: () => {},
    houseDefinitions: [houseDefinition],
    playerCharacterId,
    eventDefinitionsById: {},
    sceneDefinitionsById: {},
    syncCouncilPriorityAfterGameStateChange: () => false,
    houseModuleRegistry: createHouseModuleRegistry([
      {
        moduleId: "txt-narrative-place",
        module: fakeHouseModule,
      },
    ]),
    txtNarrativeProvider: {
      async stream(request, onEvent) {
        providerRequests.push(request);
        onEvent({
          type: "start",
          requestId: request.requestId,
        });
        onEvent({
          type: "complete",
          requestId: request.requestId,
          rawText: "[NARRATION: 寺里已快断粮。]",
          allSteps: [{ type: "narration", text: "寺里已快断粮。" }],
        });
      },
    },
  });

  runtime.dispatch({
    type: "enter",
    houseId: houseDefinition.id,
  });

  await Promise.resolve();

  assert.equal(providerRequests.length, 1);
  assert.equal(providerRequests[0].requestId, "opening-request");
  assert.equal(
    providerRequests[0].metadata.houseId,
    "house.kulan.temple"
  );
  assert.deepEqual(
    providerEventRequests.map((request) => request.event.type),
    ["start", "complete"]
  );
});

test("house runtime ignores stale TXT narrative provider events after leaving the originating host house", async () => {
  const houseDefinition = createHostHouseDefinition();
  const providerEventRequests = [];
  let capturedOnEvent = null;

  const fakeHouseModule = {
    moduleId: "txt-narrative-place",
    enter(input) {
      return {
        gameState: input.gameState,
        characterDefinitions: input.characterDefinitions,
        sessionState: {
          status: "streaming",
        },
        sideEffects: [
          {
            type: "start-txt-narrative-stream",
            requestId: "stale-request",
            payload: {
              requestId: "stale-request",
              system: "test-system",
              messages: [],
              metadata: {
                phaseId: "temple_alms_departure",
                houseId: "house.kulan.temple",
                placeName: "皇觉寺",
              },
            },
          },
        ],
      };
    },
    dispatch(input) {
      if (input.request.type === "txt-narrative-provider-event") {
        providerEventRequests.push(input.request);
      }
      return {
        gameState: input.gameState,
        characterDefinitions: input.characterDefinitions,
        sessionState: input.sessionState,
      };
    },
    leave(input) {
      return {
        gameState: input.gameState,
        characterDefinitions: input.characterDefinitions,
        sessionState: null,
      };
    },
    selectViewModel() {
      return {
        moduleId: "txt-narrative-place",
        houseId: houseDefinition.id,
        sceneTitle: houseDefinition.name,
        standbyRoster: [],
        dialogue: null,
        actionContainer: null,
        statusCard: null,
        overlay: null,
        leaveAction: {
          id: "leave-house",
          label: "离开",
        },
      };
    },
  };

  let appState = {
    gameState: createBaseState(null),
    characterDefinitions: [
      createCharacterDefinition("char.player", "朱重八", houseDefinition.id),
    ],
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
  };

  const runtime = createHouseRuntimeBridge({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp: () => {},
    playCoinReward: () => {},
    startMapAutoAdvance: () => {},
    stopMapAutoAdvance: () => {},
    houseDefinitions: [houseDefinition],
    playerCharacterId,
    eventDefinitionsById: {},
    sceneDefinitionsById: {},
    syncCouncilPriorityAfterGameStateChange: () => false,
    houseModuleRegistry: createHouseModuleRegistry([
      {
        moduleId: "txt-narrative-place",
        module: fakeHouseModule,
      },
    ]),
    txtNarrativeProvider: {
      async stream(_request, onEvent) {
        capturedOnEvent = onEvent;
      },
    },
  });

  runtime.dispatch({
    type: "enter",
    houseId: houseDefinition.id,
  });

  runtime.dispatch({
    type: "leave",
  });

  assert.equal(typeof capturedOnEvent, "function");

  capturedOnEvent({
    type: "complete",
    requestId: "stale-request",
    rawText: "[NARRATION: 迟来的旧事件。]",
    allSteps: [{ type: "narration", text: "迟来的旧事件。" }],
  });

  await Promise.resolve();

  assert.deepEqual(providerEventRequests, []);
});
