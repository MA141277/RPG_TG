const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  createHouseRuntimeBridge,
  enterHouseThroughRuntime,
  leaveHouseThroughRuntime,
} = require("../.test-dist/core/runtime/house-runtime.js");
const {
  prototypeCards,
  prototypeMap,
  prototypeValuables,
} = require("../.test-dist/content/prototype-world.js");

function createBaseAppState() {
  return {
    gameState: createInitialState({
      currentMapId: prototypeMap.id,
      currentCityId: "city.kulan",
      currentHouseId: null,
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
      currentView: "city",
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
    layoutEditor: {},
  };
}

test("house runtime contracts expose a generic observed-event forwarding seam", () => {
  const houseModuleSource = fs.readFileSync("src/domain/house-module.ts", "utf8");
  const houseRuntimeSource = fs.readFileSync(
    "src/core/runtime/house-runtime.ts",
    "utf8"
  );

  assert.match(houseModuleSource, /observedEvents/u);
  assert.match(houseRuntimeSource, /recordObservedEvents/u);
});

test("house runtime forwards observedEvents from enter, dispatch, and leave without shell business branches", () => {
  let appState = createBaseAppState();
  const observedEvents = [];
  const runtimeHouse = {
    id: "house.test.observed",
    cityId: "city.kulan",
    name: "测试屋舍",
    type: "custom",
    characterIds: ["char.test.npc"],
    defaultCharacterId: "char.test.npc",
    moduleId: "test-observed-house",
    backAction: {
      label: "返回濠州",
      targetView: "city",
    },
  };
  const houseModule = {
    moduleId: "test-observed-house",
    enter(input) {
      return {
        gameState: input.gameState,
        characterDefinitions: input.characterDefinitions,
        sessionState: null,
        observedEvents: [
          {
            type: "test:enter",
            cityId: input.houseDefinition.cityId,
            houseId: input.houseDefinition.id,
            summary: "玩家进入了测试屋舍。",
          },
        ],
      };
    },
    dispatch(input) {
      if (
        input.request.type === "action" &&
        input.request.actionId === "emit-observed"
      ) {
        return {
          gameState: input.gameState,
          characterDefinitions: input.characterDefinitions,
          sessionState: input.sessionState,
          observedEvents: [
            {
              type: "test:dispatch",
              cityId: input.houseDefinition.cityId,
              houseId: input.houseDefinition.id,
              summary: "玩家触发了测试动作。",
            },
          ],
        };
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
        observedEvents: [
          {
            type: "test:leave",
            cityId: input.houseDefinition.cityId,
            houseId: null,
            summary: "玩家离开了测试屋舍。",
          },
        ],
      };
    },
  };

  const runtime = createHouseRuntimeBridge({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp: () => {},
    startMapAutoAdvance: () => {},
    stopMapAutoAdvance: () => {},
    houseDefinitions: [runtimeHouse],
    playerCharacterId: "char.player",
    eventDefinitionsById: {},
    sceneDefinitionsById: {},
    houseModuleRegistry: {
      getModule(moduleId) {
        return moduleId === "test-observed-house" ? houseModule : null;
      },
    },
    recordObservedEvents: (events) => {
      observedEvents.push(...events);
    },
    syncCouncilPriorityAfterGameStateChange: () => false,
  });

  enterHouseThroughRuntime(runtime, runtimeHouse.id);
  runtime.dispatch({
    type: "dispatch",
    request: {
      type: "action",
      actionId: "emit-observed",
    },
  });
  leaveHouseThroughRuntime(runtime);

  assert.deepEqual(
    observedEvents.map((event) => event.summary),
    ["玩家进入了测试屋舍。", "玩家触发了测试动作。", "玩家离开了测试屋舍。"]
  );
});
