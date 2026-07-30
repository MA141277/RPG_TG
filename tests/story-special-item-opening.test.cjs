const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const { applyEffects } = require("../.test-dist/application/effects/effect-applier.js");
const {
  isCampaignMapCoordinateRevealed,
} = require("../.test-dist/application/navigation/campaign-map-exploration.js");
const {
  processMapReturnEffects,
} = require("../.test-dist/application/runtime/transition/map-return-effect-transition.js");
const { projectBackpackItems } = require("../.test-dist/application/inventory/item-inventory.js");
const { runSceneUntilPause } = require("../.test-dist/application/scene/scene-runner.js");
const { advanceScene } = require("../.test-dist/application/scene/scene-runner.js");
const { startEvent } = require("../.test-dist/application/events/event-runner.js");
const { selectTriggeredEvents } = require("../.test-dist/application/events/trigger-evaluator.js");
const { createInitialState } = require("../.test-dist/application/state/create-initial-state.js");

function createMinimalGameState(overrides = {}) {
  return {
    world: {
      currentMapId: "map.test",
      currentCityId: "city.test",
      currentHouseId: null,
      timeOfDay: "morning",
      schedule: { councilDate: { year: 1352, month: 1, day: 1 } },
    },
    player: { characterId: "char.player" },
    calendar: { chapterId: "chapter.test", year: 1352, month: 1, day: 1 },
    scene: {
      activeEventId: "event.test",
      activeSceneId: "scene.test",
      cursor: 0,
      status: "playing",
    },
    storyBattle: null,
    ui: {
      visiblePanels: [],
      pinnedCharacterId: "char.player",
      detailCharacterId: null,
      isCharacterAbilityDetailOpen: false,
      selectedTroopId: null,
      activeMissionId: null,
      reviewDateText: "",
      mainHouseMissionText: "",
      overlayView: null,
      cardLibraryFilter: "all",
      backpackLibraryFilter: "all",
      selectedBackpackItemId: null,
      valuableLibraryFilter: "all",
      valuableLibrarySortKey: "name",
      valuableLibrarySortDirection: "asc",
      houseSession: null,
      npcInteractionSession: null,
      currentView: "scene",
    },
    missions: { activeMissionId: null, completedMissionIds: [] },
    cards: { ownedCardIds: [], selectedCardId: null },
    valuables: {
      items: [],
      selectedItemId: null,
      equippedWeaponSet: { swordId: null, armorId: null },
    },
    runtime: {
      flags: {},
      variables: {},
      factionMerit: {},
      factionMemberships: {},
      tasks: { instancesByTaskId: {}, completedTaskIds: [], failedTaskIds: [], updatedAt: "" },
      playableSession: null,
      cityNpcPools: {},
      cityMarkets: {},
      mapExplorationByMapId: {},
      activitySession: null,
      troops: { troopsById: {}, activeTroopIds: [], reserveCharacterIds: [] },
      mapExploration: { revealedCoordinatesByMapId: {} },
      eventHistory: {},
    },
    ...overrides,
  };
}

test("grant-special-item effect stores a dynamic special item instance", () => {
  const result = applyEffects(
    createMinimalGameState(),
    [
      {
        type: "grant-special-item",
        item: {
          instanceId: "story.zhu_yuanzhang.opening.letter",
          name: "书信",
          icon: null,
          value: 0,
          types: ["other", "quest", "letter"],
          count: 1,
          description: "村中长者托你交给皇觉寺住持的书信。",
          actions: [],
        },
      },
    ],
    { characterDefinitions: [] }
  );

  assert.deepEqual(
    result.state.runtime.specialItemsByInstanceId?.[
      "story.zhu_yuanzhang.opening.letter"
    ],
    {
      instanceId: "story.zhu_yuanzhang.opening.letter",
      name: "书信",
      icon: null,
      value: 0,
      types: ["other", "quest", "letter"],
      count: 1,
      description: "村中长者托你交给皇觉寺住持的书信。",
      actions: [],
    }
  );
});

test("scene effects can reveal a campaign map coordinate and update the current task", () => {
  const haozhouCoordinate = { x: 245.87288158317762, y: 291.97687861271675 };
  const coordinateSpace = { width: 509, height: 451 };
  const coordinateSystem = {
    hexTerrainScale: 138,
    hexMapAspect: 1.1285,
    coordinateSpace,
    hexPointBounds: {
      minX: -103.057023,
      maxX: 101.324972,
      minY: -86.5,
      maxY: 86.5,
    },
  };
  const result = applyEffects(
    createMinimalGameState({
      world: {
        ...createMinimalGameState().world,
        currentMapId: "map.yuanmo_campaign",
      },
      ui: {
        ...createMinimalGameState().ui,
        mainHouseMissionText: "旧任务",
      },
    }),
    [
      {
        type: "reveal-map-coordinate",
        mapId: "map.yuanmo_campaign",
        coordinate: haozhouCoordinate,
        coordinateSpace,
        coordinateSystem,
        revealedAtMs: 12345,
      },
      {
        type: "set-main-mission-text",
        text: "前往 濠州·皇觉寺",
      },
    ],
    { characterDefinitions: [] }
  );

  const exploration =
    result.state.runtime.mapExplorationByMapId["map.yuanmo_campaign"];
  assert.equal(result.state.ui.mainHouseMissionText, "前往 濠州·皇觉寺");
  assert.equal(exploration.revealedHexKeys.length, 7);
  assert.equal(
    isCampaignMapCoordinateRevealed({
      state: result.state,
      mapId: "map.yuanmo_campaign",
      coordinate: haozhouCoordinate,
      coordinateSpace,
      coordinateSystem,
    }),
    true
  );
  assert.ok(
    Object.values(exploration.revealingHexStartedAtMsByKey).every(
      (startedAtMs) => startedAtMs === 12345
    )
  );
});

test("scene effects can queue a map return reveal without changing exploration before the map delay", () => {
  const haozhouCoordinate = { x: 245.87288158317762, y: 291.97687861271675 };
  const coordinateSpace = { width: 509, height: 451 };
  const coordinateSystem = {
    hexTerrainScale: 138,
    hexMapAspect: 1.1285,
    coordinateSpace,
    hexPointBounds: {
      minX: -103.057023,
      maxX: 101.324972,
      minY: -86.5,
      maxY: 86.5,
    },
  };
  const queued = applyEffects(
    createMinimalGameState({
      world: {
        ...createMinimalGameState().world,
        currentMapId: "map.yuanmo_campaign",
      },
      ui: {
        ...createMinimalGameState().ui,
        currentView: "scene",
        mainHouseMissionText: "旧任务",
      },
    }),
    [
      {
        type: "queue-map-return-effects",
        id: "story.zhu_yuanzhang.opening.reveal-haozhou",
        delayMs: 1000,
        effects: [
          {
            type: "reveal-map-coordinate",
            mapId: "map.yuanmo_campaign",
            coordinate: haozhouCoordinate,
            coordinateSpace,
            coordinateSystem,
          },
          {
            type: "set-main-mission-text",
            text: "前往 濠州·皇觉寺",
          },
        ],
      },
    ],
    { characterDefinitions: [] }
  );

  assert.equal(
    queued.state.runtime.mapExplorationByMapId["map.yuanmo_campaign"],
    undefined
  );
  assert.equal(queued.state.ui.mainHouseMissionText, "旧任务");
  assert.equal(queued.state.runtime.pendingMapReturnEffects?.length, 1);

  const stillInScene = processMapReturnEffects({
    state: queued.state,
    characterDefinitions: [],
    nowMs: 1000,
  });
  assert.equal(stillInScene.state, queued.state);
  assert.equal(stillInScene.nextDelayMs, null);

  const returnedToMap = processMapReturnEffects({
    state: {
      ...queued.state,
      ui: {
        ...queued.state.ui,
        currentView: "map",
      },
    },
    characterDefinitions: [],
    nowMs: 1000,
  });
  assert.equal(
    returnedToMap.state.runtime.mapExplorationByMapId["map.yuanmo_campaign"],
    undefined
  );
  assert.equal(returnedToMap.state.ui.mainHouseMissionText, "旧任务");
  assert.equal(returnedToMap.nextDelayMs, 1000);

  const beforeDelay = processMapReturnEffects({
    state: returnedToMap.state,
    characterDefinitions: [],
    nowMs: 1999,
  });
  assert.equal(
    beforeDelay.state.runtime.mapExplorationByMapId["map.yuanmo_campaign"],
    undefined
  );
  assert.equal(beforeDelay.nextDelayMs, 1);

  const afterDelay = processMapReturnEffects({
    state: beforeDelay.state,
    characterDefinitions: [],
    nowMs: 2000,
  });
  assert.equal(afterDelay.state.ui.mainHouseMissionText, "前往 濠州·皇觉寺");
  assert.equal(
    isCampaignMapCoordinateRevealed({
      state: afterDelay.state,
      mapId: "map.yuanmo_campaign",
      coordinate: haozhouCoordinate,
      coordinateSpace,
      coordinateSystem,
    }),
    true
  );
  assert.equal(afterDelay.state.runtime.pendingMapReturnEffects?.length ?? 0, 0);
  assert.equal(afterDelay.nextDelayMs, null);
});

test("backpack projects dynamic special item instances", () => {
  const items = projectBackpackItems({
    valuableInventory: {
      items: [],
      selectedItemId: null,
      equippedWeaponSet: { swordId: null, armorId: null },
    },
    gameState: {
      runtime: {
        variables: {},
        specialItemsByInstanceId: {
          "story.zhu_yuanzhang.opening.letter": {
            instanceId: "story.zhu_yuanzhang.opening.letter",
            name: "书信",
            icon: null,
            value: 0,
            types: ["other", "quest", "letter"],
            count: 1,
            description: "村中长者托你交给皇觉寺住持的书信。",
            actions: [],
          },
        },
      },
    },
  });

  assert.deepEqual(items, [
    {
      id: "story.zhu_yuanzhang.opening.letter",
      name: "书信",
      icon: null,
      value: 0,
      types: ["other", "quest", "letter"],
      count: 1,
      description: "村中长者托你交给皇觉寺住持的书信。",
      actions: [],
    },
  ]);
});

test("scene backgrounds persist through following dialogue actions", () => {
  const state = createMinimalGameState();
  const result = runSceneUntilPause(state, {
    sceneDefinitionsById: {
      "scene.test": {
        id: "scene.test",
        name: "Test",
        actions: [
          { type: "background", backgroundId: "xiangcun" },
          { type: "dialogue", characterId: "char.elder", side: "left", text: "去皇觉寺。" },
        ],
      },
    },
    eventDefinitionsById: {},
    characterDefinitions: [{ id: "char.elder", name: "村中长者", portraitId: "portrait.elder" }],
  });

  assert.equal(result.currentAction?.type, "dialogue");
  assert.equal(result.state.scene.backgroundId, "xiangcun");
});

test("scene reward action reuses the temple reward popup skin", () => {
  const sceneViewSource = fs.readFileSync("src/ui/views/scene/scene-view.ts", "utf8");
  const houseSharedViewSource = fs.readFileSync("src/ui/views/house/house-shared-view.ts", "utf8");
  const grainShopCss = fs.readFileSync("src/styles/grain-shop.css", "utf8");

  assert.match(sceneViewSource, /action\.type === "reward"/);
  assert.match(sceneViewSource, /renderHouseAlertOverlay/);
  assert.match(sceneViewSource, /c-house-temple-utility-popup/);
  assert.match(sceneViewSource, /confirmActionAttribute:\s*"data-scene-action"/);
  assert.match(houseSharedViewSource, /confirmActionAttribute/);
  assert.doesNotMatch(sceneViewSource, /c-scene-item-reward/);
  assert.doesNotMatch(grainShopCss, /c-scene-item-reward/);
});

test("map return reveal scheduling stays in the transition layer", () => {
  const mainSource = fs.readFileSync("src/main.ts", "utf8");
  const transitionSource = fs.readFileSync(
    "src/application/runtime/transition/map-return-effect-transition.ts",
    "utf8"
  );

  assert.match(mainSource, /processMapReturnEffects/);
  assert.match(mainSource, /mapReturnEffectTimeoutId/);
  assert.doesNotMatch(mainSource, /dispatchMapReturnAction/);
  assert.doesNotMatch(transitionSource, /MapReturnAction/);
  assert.doesNotMatch(
    mainSource,
    /story\.zhu_yuanzhang\.opening\.reveal-haozhou/
  );
  assert.doesNotMatch(mainSource, /house\.kulan\.temple/);
  assert.doesNotMatch(transitionSource, /document\.querySelector/);
  assert.doesNotMatch(transitionSource, /window\.addEventListener/);
  assert.doesNotMatch(transitionSource, /innerHTML\s*=/);
});

test("scene background overrides reused house skin pseudo background", () => {
  const sceneViewSource = fs.readFileSync("src/ui/views/scene/scene-view.ts", "utf8");
  const grainShopCss = fs.readFileSync("src/styles/grain-shop.css", "utf8");

  assert.match(sceneViewSource, /--scene-background-image/);
  assert.doesNotMatch(sceneViewSource, /style="background-image:/);
  assert.match(
    grainShopCss,
    /\.view-scene\.view-house-grain-shop::before[\s\S]*background-image:\s*var\(--scene-background-image\)/
  );
});

test("map-started story scene returns to map after its final action", () => {
  const state = createMinimalGameState({
    scene: {
      activeEventId: null,
      activeSceneId: null,
      cursor: 0,
      status: "idle",
    },
    ui: {
      ...createMinimalGameState().ui,
      currentView: "map",
    },
  });
  const event = {
    id: "event.map.opening",
    chapterId: "chapter.test",
    name: "Map Opening",
    occurrence: "once",
    trigger: { timing: "game-start" },
    entrySceneId: "scene.map.opening",
  };
  const sceneContext = {
    sceneDefinitionsById: {
      "scene.map.opening": {
        id: "scene.map.opening",
        name: "Map Opening Scene",
        actions: [{ type: "narration", text: "opening" }],
      },
    },
    eventDefinitionsById: { [event.id]: event },
    characterDefinitions: [],
  };

  const started = startEvent(state, event);
  const paused = runSceneUntilPause(started, sceneContext);
  const finished = advanceScene(paused.state, sceneContext);

  assert.equal(started.scene.returnView, "map");
  assert.equal(finished.state.scene.activeSceneId, null);
  assert.equal(finished.state.scene.returnView, null);
  assert.equal(finished.state.ui.currentView, "map");
});

test("initial map chapter intro triggers game-start story after title fade", () => {
  const source = fs.readFileSync("src/main.ts", "utf8");
  const animationCompletionBlock =
    source.match(
      /hasAppliedInitialCampaignMapDebug\s*=\s*true;[\s\S]*?initialCampaignMapDebugAnimationFrame\s*=\s*null;/,
    )?.[0] ?? "";

  assert.match(animationCompletionBlock, /hideMapIntroOverlay\(\);/);
  assert.match(
    animationCompletionBlock,
    /triggerGameStartStoryAfterInitialMapIntro\(\);/
  );
  assert.match(
    source,
    /type:\s*"trigger-current-story-events"[\s\S]*timing:\s*"game-start"/
  );
});

test("builtin zhu yuanzhang start uses the village opening state", () => {
  const source = fs.readFileSync("src/main.ts", "utf8");
  const prototypeAppStateBlock =
    source.match(
      /function createPrototypeAppState\([\s\S]*?function getCurrentPlayerCharacter/
    )?.[0] ?? "";

  assert.match(
    prototypeAppStateBlock,
    /activeContentContext\.cityDefinitionById\["city\.huangcun"\]/
  );
  assert.match(
    prototypeAppStateBlock,
    /"var\.story\.zhu_yuanzhang\.stage":\s*"village-opening"/
  );
  assert.match(
    prototypeAppStateBlock,
    /characterDefinitions:\s*activeContentContext\.gameContent\.characters/
  );
  assert.doesNotMatch(
    prototypeAppStateBlock,
    /playerCharacterId === defaultPlayerCharacterId[\s\S]*?ZHU_YUANZHANG_STORY_STAGES\.huangjueTemple/
  );
});

test("zhu yuanzhang opening flow starts from the village elder letter", () => {
  const source = fs.readFileSync("src/content/scenarios/scenario-profiles.ts", "utf8");
  const monkOpeningFlow =
    source.match(
      /id:\s*"flow\.zhu_yuanzhang\.monk_opening"[\s\S]*?slotId:\s*"default-temple-chore"/
    )?.[0] ?? "";

  assert.match(monkOpeningFlow, /slotId:\s*"opening"/);
  assert.match(
    monkOpeningFlow,
    /eventId:\s*"event\.story\.zhu_yuanzhang\.village_elder_letter"/
  );
  assert.doesNotMatch(
    monkOpeningFlow,
    /eventId:\s*"event\.story\.zhu_yuanzhang\.ordination"/
  );
});

test("zhu yuanzhang profile starts outside huangjue temple and waits for map intro", () => {
  const profile = JSON.parse(
    fs.readFileSync("src/content/scenario-packs/zhuyuanzhang/scenario-profile.json", "utf8")
  );

  assert.equal(profile.initialLocation.houseId, null);
  assert.equal(profile.initialLocation.view, "map");
  assert.notEqual(profile.initialLocation.cityId, "city.kulan");
  assert.equal(profile.entryEventId, "event.story.zhu_yuanzhang.village_elder_letter");
  assert.equal(profile.launchPolicy?.entryEventTiming, "after-map-entry");
});

test("initial state applies scenario runtime flags and variables", () => {
  const state = createInitialState({
    currentMapId: "map.test",
    currentCityId: "city.test",
    currentHouseId: null,
    playerCharacterId: "char.player",
    chapterId: "chapter.test",
    year: 1352,
    month: 1,
    day: 1,
    pinnedCharacterId: "char.player",
    reviewDateText: "",
    mainHouseMissionText: "",
    cards: { ownedCardIds: [], selectedCardId: null },
    valuables: {
      items: [],
      selectedItemId: null,
      equippedWeaponSet: { swordId: null, armorId: null },
    },
    initialRuntime: {
      flags: { "flag.test.opening": true },
      variables: { "var.test.stage": "village-opening" },
    },
  });

  assert.equal(state.runtime.flags["flag.test.opening"], true);
  assert.equal(state.runtime.variables["var.test.stage"], "village-opening");
});

test("game-start village elder event treats missing completed flag as false", () => {
  const state = createMinimalGameState({
    scene: {
      activeEventId: null,
      activeSceneId: null,
      cursor: 0,
      status: "idle",
    },
  });
  const events = selectTriggeredEvents(
    state,
    [
      {
        id: "event.story.zhu_yuanzhang.village_elder_letter",
        chapterId: "chapter.zhu-yuanzhang-rise",
        name: "村中长者托信",
        occurrence: "once",
        trigger: { timing: "game-start", priority: 210 },
        conditions: [
          {
            type: "flag",
            key: "flag.story.zhu_yuanzhang.village_elder_letter.completed",
            expected: false,
          },
        ],
        entrySceneId: "scene.story.zhu_yuanzhang.village_elder_letter",
      },
    ],
    { timing: "game-start" },
    {
      isCharacterAvailable: () => true,
      isCharacterInClan: () => false,
      isCharacterInCity: () => false,
      doesClanExist: () => false,
      getClanRelation: () => null,
      isCityOwnedByClan: () => false,
      hasEventFired: () => false,
      getEventFiredCount: () => 0,
      getMonthsSinceEvent: () => null,
      getMissionStatus: () => "inactive",
      runCustomCondition: () => false,
    }
  );

  assert.equal(events[0]?.id, "event.story.zhu_yuanzhang.village_elder_letter");
});

test("village elder letter opening is independent from the huangjue ordination event", () => {
  const events = JSON.parse(
    fs.readFileSync("src/content/scenario-packs/zhuyuanzhang/events.json", "utf8")
  );
  const villageLetterEvent = events.find(
    (event) => event.id === "event.story.zhu_yuanzhang.village_elder_letter"
  );

  assert.equal(villageLetterEvent?.entrySceneId, "scene.story.zhu_yuanzhang.village_elder_letter");
  assert.equal(villageLetterEvent?.nextEventId, undefined);
});

test("huangjue ordination returns to temple house instead of chaining the review scene", () => {
  const events = JSON.parse(
    fs.readFileSync("src/content/scenario-packs/zhuyuanzhang/events.json", "utf8")
  );
  const storySource = fs.readFileSync(
    "src/content/story/zhu-yuanzhang-main-story.ts",
    "utf8"
  );
  const scriptEditorEvents = JSON.parse(
    fs.readFileSync(
      "src/modules/script-editor/builtin-templates/zhuyuanzhang/events.json",
      "utf8"
    )
  );
  const ordinationEvent = events.find(
    (event) => event.id === "event.story.zhu_yuanzhang.ordination"
  );
  const scriptEditorOrdinationEvent = scriptEditorEvents.find(
    (event) => event.id === "event.story.zhu_yuanzhang.ordination"
  );

  assert.equal(ordinationEvent?.trigger?.timing, "house-enter");
  assert.equal(ordinationEvent?.trigger?.scope?.houseId, "house.kulan.temple");
  assert.equal(ordinationEvent?.nextEventId, undefined);
  assert.equal(scriptEditorOrdinationEvent?.nextEventId, undefined);
  assert.doesNotMatch(
    storySource,
    /id:\s*"event\.story\.zhu_yuanzhang\.ordination"[\s\S]*?nextEventId:\s*"event\.story\.zhu_yuanzhang\.first_temple_review"/
  );
});

test("grain procurement bridge uses an out-of-town uprising broadcast and revised temple review copy", () => {
  const events = JSON.parse(
    fs.readFileSync("src/content/scenario-packs/zhuyuanzhang/events.json", "utf8")
  );
  const scenes = JSON.parse(
    fs.readFileSync("src/content/scenario-packs/zhuyuanzhang/scenes.json", "utf8")
  );
  const textEntries = JSON.parse(
    fs.readFileSync("src/content/scenario-packs/zhuyuanzhang/text-entries.json", "utf8")
  );
  const broadcastEvent = events.find(
    (event) => event.id === "event.story.zhu_yuanzhang.runing_broadcast"
  );
  const unlockScene = scenes.find(
    (entry) => entry.id === "scene.story.zhu_yuanzhang.unlock_begging"
  );
  const broadcastScene = scenes.find(
    (entry) => entry.id === "scene.story.zhu_yuanzhang.runing_broadcast"
  );

  assert.equal(broadcastEvent?.trigger?.timing, "city-enter");
  assert.equal(broadcastEvent?.trigger?.scope, undefined);
  assert.equal(
    broadcastEvent?.conditions?.some(
      (condition) =>
        condition.type === "group" &&
        condition.operator === "not" &&
        condition.conditions?.[0]?.type === "location" &&
        condition.conditions?.[0]?.cityId === "city.kulan"
    ),
    true
  );
  assert.equal(broadcastScene?.actions[0]?.type, "background");
  assert.equal(broadcastScene?.actions[0]?.backgroundId, "bg.story.qiyi");
  assert.equal(
    textEntries["scene.story.zhu_yuanzhang.first_temple_review.001"],
    "往后这段时日，寺里的方针以保全自身为主。"
  );
  assert.equal(
    textEntries["scene.story.zhu_yuanzhang.first_temple_review.002"],
    "你初来乍到，外面也兵荒马乱，姑且在寺内帮忙吧。"
  );
  assert.equal(
    textEntries["scene.story.zhu_yuanzhang.unlock_begging.002"],
    "这是500文，濠州近日断粮，你去附近的城市带回来吧，尽量多买也好施舍。"
  );
  assert.equal(
    textEntries["scene.story.zhu_yuanzhang.runing_broadcast.001"],
    "世界事件：濠州爆发红巾起义。繁荣度-2"
  );
  assert.equal(
    textEntries["scene.story.zhu_yuanzhang.runing_broadcast.002"],
    "不知寺内情况如何，买了粮食就回去吧。"
  );
  assert.equal(
    unlockScene?.actions.some(
      (action) =>
        action.type === "effect" &&
        action.effects?.some(
          (effect) =>
            effect.type === "modify-character-stat" &&
            effect.characterId === "char.player" &&
            effect.stat === "gold" &&
            effect.delta === 500
        )
    ),
    true
  );
});

test("returning to Haozhou after the grain broadcast triggers the return encounter on week two", () => {
  const events = JSON.parse(
    fs.readFileSync("src/content/scenario-packs/zhuyuanzhang/events.json", "utf8")
  );
  const state = createMinimalGameState({
    scene: {
      activeEventId: null,
      activeSceneId: null,
      cursor: 0,
      status: "idle",
    },
    world: {
      ...createMinimalGameState().world,
      currentCityId: "city.kulan",
      currentHouseId: null,
    },
    runtime: {
      ...createMinimalGameState().runtime,
      flags: {
        "flag.story.zhu_yuanzhang.begging_unlocked": true,
        "flag.story.zhu_yuanzhang.haozhou_uprising_broadcasted": true,
      },
      variables: {
        "var.story.zhu_yuanzhang.stage": "huangjue-begging-journey",
        "var.story.zhu_yuanzhang.temple_week": 2,
      },
    },
  });

  const triggered = selectTriggeredEvents(
    state,
    events,
    { timing: "city-enter", cityId: "city.kulan" },
    {
      isCharacterAvailable: () => true,
      isCharacterInClan: () => false,
      isCharacterInCity: () => false,
      doesClanExist: () => false,
      getClanRelation: () => null,
      isCityOwnedByClan: () => false,
      hasEventFired: () => false,
      getEventFiredCount: () => 0,
      getMonthsSinceEvent: () => null,
      getMissionStatus: () => "inactive",
      runCustomCondition: () => false,
    }
  );

  assert.equal(
    triggered.some(
      (event) => event.id === "event.story.zhu_yuanzhang.haozhou_return_encounter"
    ),
    true
  );
});

test("village elder letter dialogue is split and only uses the configured elder", () => {
  const scenes = JSON.parse(
    fs.readFileSync("src/content/scenario-packs/zhuyuanzhang/scenes.json", "utf8")
  );
  const scene = scenes.find(
    (entry) => entry.id === "scene.story.zhu_yuanzhang.village_elder_letter"
  );
  const dialogueActions =
    scene?.actions.filter((action) => action.type === "dialogue") ?? [];
  const textEntries = JSON.parse(
    fs.readFileSync("src/content/scenario-packs/zhuyuanzhang/text-entries.json", "utf8")
  );

  assert.equal(scene?.actions[0]?.backgroundId, "xiangcun");
  assert.ok(dialogueActions.length >= 4);
  assert.deepEqual(
    [...new Set(dialogueActions.map((action) => action.characterId))],
    ["char.zhu_yuanzhang.village_elder"]
  );
  assert.equal(
    dialogueActions.some((action) => action.characterId.includes("temple")),
    false
  );
  for (const action of dialogueActions) {
    assert.equal(typeof textEntries[action.textId], "string");
    assert.ok(textEntries[action.textId].length < 80);
  }
});

test("village elder letter reveals Haozhou and updates the temple objective after the item reward", () => {
  const scenes = JSON.parse(
    fs.readFileSync("src/content/scenario-packs/zhuyuanzhang/scenes.json", "utf8")
  );
  const maps = JSON.parse(
    fs.readFileSync("src/content/scenario-packs/zhuyuanzhang/maps.json", "utf8")
  );
  const runtimeHexGrid = JSON.parse(
    fs.readFileSync(
      "src/content/scenario-packs/zhuyuanzhang/assets/maps/yuanmo-campaign-hex-grid-map2-runtime.json",
      "utf8"
    )
  );
  const scene = scenes.find(
    (entry) => entry.id === "scene.story.zhu_yuanzhang.village_elder_letter"
  );
  const campaignMap = maps.find((entry) => entry.id === "map.yuanmo_campaign");
  const haozhouNode = campaignMap?.nodes.find(
    (node) => node.cityId === "city.kulan"
  );
  const rewardIndex =
    scene?.actions.findIndex((action) => action.type === "reward") ?? -1;
  const followupAction = scene?.actions[rewardIndex + 1];

  assert.ok(rewardIndex >= 0);
  assert.equal(followupAction?.type, "effect");
  assert.deepEqual(followupAction.effects, [
    {
      type: "queue-map-return-effects",
      id: "story.zhu_yuanzhang.opening.reveal-haozhou",
      delayMs: 1000,
      effects: [
        {
          type: "reveal-map-coordinate",
          mapId: "map.yuanmo_campaign",
          coordinate: { x: haozhouNode.x, y: haozhouNode.y },
          coordinateSpace: { width: 509, height: 451 },
          coordinateSystem: runtimeHexGrid.coordinateSystem,
        },
        {
          type: "set-main-mission-text",
          text: "前往 濠州·皇觉寺",
        },
      ],
    },
  ]);
});

test("story qiyi cg is wired into dialogue background previews", () => {
  const source = fs.readFileSync("src/ui/location-backgrounds.ts", "utf8");

  assert.match(source, /qiyi\.png\?url/);
  assert.match(source, /"bg\.story\.qiyi":\s*storyBackgroundQiyiUrl/);
});
