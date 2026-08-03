const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

function createAppState(overrides = {}) {
  const { createInitialState } = require("../.test-dist/application/state/create-initial-state.js");
  const gameState = createInitialState({
    currentMapId: "map.test",
    currentCityId: "city.kulan",
    currentHouseId: null,
    playerCharacterId: "person.hero",
    chapterId: "chapter.test",
    year: 1352,
    month: 1,
    day: 1,
    pinnedCharacterId: "person.hero",
    reviewDateText: "今日评定",
    mainHouseMissionText: "当前任务",
    cards: { ownedCardIds: [], selectedCardId: null },
    valuables: { items: [], selectedItemId: null },
    currentView: "city",
  });

  return {
    gameState: {
      ...gameState,
      ...(overrides.gameState ?? {}),
      world: {
        ...gameState.world,
        ...(overrides.gameState?.world ?? {}),
      },
      ui: {
        ...gameState.ui,
        ...(overrides.gameState?.ui ?? {}),
      },
    },
    characterDefinitions: [],
    playerCoordinate: { x: 0, y: 0 },
    campaignActorState: { facingDegrees: 0, isMoving: false },
    campaignTravelState: null,
    modalState: null,
    locationDialogueState: null,
    cityMenuState: null,
    cityDirectoryState: null,
    autoAdvanceState: null,
    uiLayouts: {},
  };
}

function createExportableProject() {
  return {
    schemaVersion: 1,
    kind: "script-editor-project",
    id: "project.test.navigation",
    title: "Navigation Test Project",
    description: "",
    completionState: { state: "draft" },
    storyPack: {
      id: "story-pack.test.navigation",
      title: "Navigation Test Pack",
      description: "",
      basePackId: "content-pack.base-game.zhuyuanzhang",
      scenarioProfile: {
        id: "scenario.test.navigation",
        title: "Navigation Test Scenario",
        playerCharacterId: "person.hero",
        chapterId: "chapter.test",
        initialLocation: {
          mapId: "map.test",
          cityId: "city.kulan",
          houseId: null,
          view: "city",
        },
      },
    },
    maps: [{ id: "map.test", name: "Test Map", nodes: [] }],
    people: [{ id: "person.hero", name: "Hero", role: "playable" }],
    portraits: [],
    portraitVariants: [],
    cities: [{ id: "city.kulan", name: "Kulan" }],
    buildings: [],
    cityEntries: [],
    events: [],
    eventBindings: [],
    quests: [],
    activities: [],
    cards: [],
    valuables: [],
    cityNpcPools: [],
    houseModuleDefaults: {},
    cityPortraits: {},
    historicalCharacters: [],
    historicalCityRosters: [],
    historicalCharacterIdByCharacterId: {},
    dialogues: [],
    minigames: [],
    storyNodes: [],
    textEntries: [],
    conditionGroups: [],
    effectBundles: [],
  };
}

test("navigation runtime consumes generic navigate requests without reading events", () => {
  const {
    createNavigateRequest,
    runNavigationRuntime,
  } = require("../.test-dist/core/runtime/navigation-runtime.js");
  const state = createAppState().gameState;

  const cityResult = runNavigationRuntime({
    state: {
      ...state,
      world: {
        ...state.world,
        currentCityId: "city.start",
        currentHouseId: "house.city.start.temple",
      },
    },
    request: createNavigateRequest({ kind: "city", cityId: "city.kulan" }),
  });

  assert.equal(cityResult.state.world.currentCityId, "city.kulan");
  assert.equal(cityResult.state.world.currentHouseId, null);
  assert.equal(cityResult.state.ui.currentView, "city");
  assert.deepEqual(cityResult.navigation, { view: "city", cityId: "city.kulan" });
});

test("navigation runtime consumes generic navigate request for leaving a building", () => {
  const {
    createNavigateRequest,
    runNavigationRuntime,
  } = require("../.test-dist/core/runtime/navigation-runtime.js");
  const state = createAppState({
    gameState: {
      world: {
        currentHouseId: "house.city.start.temple",
      },
      ui: {
        currentView: "house",
        overlayView: "dialogue",
        houseSession: { moduleId: "temple-house", state: {} },
      },
    },
  }).gameState;

  const result = runNavigationRuntime({
    state,
    request: createNavigateRequest({ kind: "leaveBuilding" }),
  });

  assert.equal(result.state.world.currentCityId, "city.kulan");
  assert.equal(result.state.world.currentHouseId, null);
  assert.equal(result.state.ui.currentView, "city");
  assert.equal(result.state.ui.overlayView, null);
  assert.equal(result.state.ui.houseSession, null);
  assert.deepEqual(result.navigation, { view: "city", cityId: "city.kulan" });
});

test("event route command dispatch routes navigate actions through navigation runtime", () => {
  const {
    dispatchEventRouteCommands,
  } = require("../.test-dist/application/events/event-route-command-dispatch.js");
  const state = createAppState({
    gameState: {
      world: {
        currentHouseId: "house.city.start.temple",
      },
      ui: {
        currentView: "house",
        houseSession: { moduleId: "temple-house", state: {} },
      },
    },
  });

  const result = dispatchEventRouteCommands({
    state,
    eventDefinition: {
      id: "event.leave-building",
      chapterId: "chapter.test",
      name: "Leave Building",
      occurrence: "repeatable",
      dialogueId: "",
      actions: [{ type: "navigate", target: { kind: "leaveBuilding" } }],
    },
  });

  assert.equal(result.handled, true);
  assert.deepEqual(result.unhandledCommands, []);
  assert.equal(result.state.gameState.world.currentCityId, "city.kulan");
  assert.equal(result.state.gameState.world.currentHouseId, null);
  assert.equal(result.state.gameState.ui.currentView, "city");
  assert.equal(result.state.gameState.ui.houseSession, null);
});

test("city menu event launch routes navigate building actions with navigation context", () => {
  const {
    launchCityMenuEvent,
  } = require("../.test-dist/application/city-menu/city-menu-event-launch.js");
  const state = createAppState();

  const nextState = launchCityMenuEvent({
    state,
    action: { type: "event", eventId: "event.enter-temple" },
    storyContent: {
      eventDefinitionsById: {
        "event.enter-temple": {
          id: "event.enter-temple",
          chapterId: "chapter.test",
          name: "Enter Temple",
          occurrence: "repeatable",
          dialogueId: "",
          actions: [
            {
              type: "navigate",
              target: { kind: "building", houseId: "house.city.kulan.temple" },
            },
          ],
        },
      },
      eventBindingsById: {},
      dialogueDefinitionsById: {},
      activityDefinitionsById: {},
      textEntriesById: {},
      cityDefinitionsById: {
        "city.kulan": {
          id: "city.kulan",
          name: "Kulan",
          regionId: "region.test",
          mapNodeId: "map-node.kulan",
          houseIds: ["house.city.kulan.temple"],
          neighbourCityIds: [],
          travelCost: 1,
          tags: [],
          prosperity: 50,
          danger: 0,
          specialDemand: [],
        },
      },
      houseDefinitionsById: {
        "house.city.kulan.temple": {
          id: "house.city.kulan.temple",
          cityId: "city.kulan",
          name: "Temple",
          type: "temple",
          characterIds: [],
          defaultCharacterId: null,
          activityLocationId: "temple",
          backAction: { label: "Back", targetView: "city" },
        },
      },
      buildingArrangements: [
        {
          id: "arrangement.city.kulan.temple",
          cityId: "city.kulan",
          buildingId: "house.city.kulan.temple",
          displayName: "Temple",
          mountedNpcIds: [],
          primaryNpcId: null,
          containers: [],
        },
      ],
      locationAccessDefinitions: [],
    },
  });

  assert.equal(nextState.gameState.world.currentHouseId, "house.city.kulan.temple");
  assert.equal(nextState.gameState.ui.currentView, "house");
});

test("building container item actions execute navigate leave-building events", () => {
  const {
    triggerBuildingContainerItemAction,
  } = require("../.test-dist/application/building/building-container-event-runtime.js");
  const state = createAppState({
    gameState: {
      world: {
        currentHouseId: "house.city.start.temple",
      },
      ui: {
        currentView: "house",
        houseSession: { moduleId: "temple-house", state: {} },
      },
    },
  }).gameState;

  const result = triggerBuildingContainerItemAction({
    state,
    characterDefinitions: [],
    storyContent: {
      eventDefinitionsById: {
        "event.leave-building": {
          id: "event.leave-building",
          chapterId: "chapter.test",
          name: "Leave Building",
          occurrence: "repeatable",
          dialogueId: "",
          actions: [{ type: "navigate", target: { kind: "leaveBuilding" } }],
        },
      },
      eventBindingsById: {
        "binding.leave-building": {
          id: "binding.leave-building",
          eventId: "event.leave-building",
          owner: { family: "building", id: "house.city.start.temple" },
          trigger: {
            timing: "after",
            action: "building-container-item-action",
            extra: {
              arrangementId: "arrangement.city.kulan.temple",
              containerId: "house.city.start.temple.actions",
              itemId: "leave",
            },
          },
          enabled: true,
        },
      },
      dialogueDefinitionsById: {},
    },
    action: {
      arrangementId: "arrangement.city.kulan.temple",
      containerId: "house.city.start.temple.actions",
      itemId: "leave",
      eventId: "event.leave-building",
    },
  });

  assert.equal(result.state.world.currentCityId, "city.kulan");
  assert.equal(result.state.world.currentHouseId, null);
  assert.equal(result.state.ui.currentView, "city");
  assert.equal(result.state.ui.houseSession, null);
});

test("script editor export preserves navigate event actions without adding event fields", () => {
  const {
    exportScriptEditorProjectToScenarioPackFiles,
  } = require("../.test-dist/modules/script-editor/application/runtime-pack-export.js");
  const project = createExportableProject();
  project.events = [
    {
      id: "event.leave-building",
      title: "Leave Building",
      actions: [{ type: "navigate", target: { kind: "leaveBuilding" } }],
    },
  ];

  const files = exportScriptEditorProjectToScenarioPackFiles(project);
  const events = JSON.parse(files["events.json"]);

  assert.deepEqual(events[0].actions, [
    { type: "navigate", target: { kind: "leaveBuilding" } },
  ]);
  assert.equal(Object.hasOwn(events[0], "navigationTarget"), false);
  assert.equal(Object.hasOwn(events[0], "routeTarget"), false);
});

test("script editor export rejects malformed navigate actions without throwing", () => {
  const {
    exportScriptEditorProjectToScenarioPackFiles,
  } = require("../.test-dist/modules/script-editor/application/runtime-pack-export.js");
  const project = createExportableProject();
  project.events = [
    {
      id: "event.bad-navigation",
      title: "Bad Navigation",
      actions: [{ type: "navigate" }],
    },
  ];

  assert.throws(
    () => exportScriptEditorProjectToScenarioPackFiles(project),
    /Event export currently supports only navigate and launchPlayable runtime actions/
  );
});

test("script editor export rejects retired closeBuilding actions", () => {
  const {
    exportScriptEditorProjectToScenarioPackFiles,
  } = require("../.test-dist/modules/script-editor/application/runtime-pack-export.js");
  const project = createExportableProject();
  project.events = [
    {
      id: "event.legacy-close-building",
      title: "Legacy Close Building",
      actions: [{ type: "closeBuilding" }],
    },
  ];

  assert.throws(
    () => exportScriptEditorProjectToScenarioPackFiles(project),
    /Event export currently supports only navigate and launchPlayable runtime actions/
  );
});

test("event binding runtime does not own navigation state mutations", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/event-binding-runtime.ts"),
    "utf8"
  );

  assert.doesNotMatch(source, /closeBuilding/);
  assert.doesNotMatch(source, /currentView:\s*"city"/);
  assert.doesNotMatch(source, /currentHouseId:\s*null/);
  assert.doesNotMatch(source, /houseSession:\s*null/);
});

test("runtime reenter-house follow-up is routed through navigation runtime", () => {
  const {
    applyNavigationRuntimeFollowUp,
  } = require("../.test-dist/application/runtime/navigation-runtime-follow-up.js");
  const state = createAppState({
    gameState: {
      world: {
        currentHouseId: null,
      },
      ui: {
        currentView: "minigame",
        overlayView: "dialogue",
        houseSession: { moduleId: "story-battle", state: {} },
      },
    },
  });

  const result = applyNavigationRuntimeFollowUp({
    state,
    followUp: { type: "reenter-house", houseId: "house.city.kulan.temple" },
  });

  assert.equal(
    result.gameState.world.currentHouseId,
    "house.city.kulan.temple"
  );
  assert.equal(result.gameState.ui.currentView, "house");
  assert.equal(result.gameState.ui.overlayView, null);
  assert.equal(result.gameState.ui.houseSession, null);
});

test("main runtime follow-up path does not branch directly on reenter-house", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.doesNotMatch(source, /function applyRuntimeReenterBuilding/);
  assert.doesNotMatch(source, /function applyGameStateReenterBuilding/);
  assert.doesNotMatch(source, /followUp\.type === "reenter-house"/);
  assert.match(source, /applyNavigationRuntimeFollowUp/);
});

test("navigation runtime remains independent from event, dialogue, playable, and story systems", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/navigation-runtime.ts"),
    "utf8"
  );

  assert.doesNotMatch(source, /domain\/event|EventDefinition|EventRouteCommand/);
  assert.doesNotMatch(source, /dialogue|playable|story-runtime|event-binding-runtime/);
  assert.doesNotMatch(source, /eventDefinitionsById|eventBindingsById/);
});
