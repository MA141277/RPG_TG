const test = require("node:test");
const assert = require("node:assert/strict");
const { fileURLToPath, pathToFileURL } = require("node:url");
const ts = require("typescript");

const { createInitialState } = require("../.test-dist/application/state/create-initial-state.js");
const {
  ensureCityNpcPoolsForCurrentDay,
  pickCityNpcActivityLocation,
} = require("../.test-dist/application/city-npcs/refresh-city-npc-pools.js");
const {
  selectCityNpcSummariesForHouse,
} = require("../.test-dist/application/city-npcs/select-city-npcs-for-house.js");
const {
  prototypeCards,
  createPrototypeCharactersForStoryStage,
  prototypeCharacters,
  prototypeCityEntries,
  prototypeHistoricalCharacterIdByCharacterId,
  prototypeLeaderResidenceHistoricalCharacters,
  prototypeHouseAccessRefusalRules,
  prototypeHouses,
  prototypeMap,
  prototypeCityNpcPools,
  prototypeValuables,
} = require("../.test-dist/content/prototype-world.js");
const { executeGrainTrade } = require("../.test-dist/application/grain-shop/grain-trade.js");
const {
  PLAYER_GRAIN_RUNTIME_KEYS,
} = require("../.test-dist/application/inventory/trade-inventory.js");
const {
  homeHouseHouseModule,
} = require("../.test-dist/application/house-modules/home-house/home-house-house-module.js");
const {
  grainShopHouseModule,
} = require("../.test-dist/application/house-modules/grain-shop/grain-shop-house-module.js");
const {
  keepHouseHouseModule,
} = require("../.test-dist/application/house-modules/keep-house/keep-house-house-module.js");
const {
  templeHouseHouseModule,
} = require("../.test-dist/application/house-modules/temple-house/temple-house-house-module.js");
const {
  marketHouseHouseModule,
} = require("../.test-dist/application/house-modules/market-house/market-house-house-module.js");
const {
  medicineHouseHouseModule,
} = require("../.test-dist/application/house-modules/medicine-house/medicine-house-house-module.js");
const {
  teaHouseHouseModule,
} = require("../.test-dist/application/house-modules/tea-house/tea-house-house-module.js");
const {
  resolveCompoundingGrade,
} = require("../.test-dist/application/medicine-house/compounding-minigame.js");
const {
  tavernHouseModule,
} = require("../.test-dist/application/house-modules/tavern/tavern-house-module.js");
const {
  advanceTavernGambleMeldCountdown,
  advanceTavernGambleNpcThinking,
  createTavernLongGambleSession,
  confirmTavernGamblePlayGroup,
  createTavernGambleSession,
  createTavernMahjongDeck,
  declareTavernGambleMeld,
  discardForTavernGamble,
  drawForTavernGamble,
  passHumanLongHu,
  pushHumanLongHu,
  resolveTavernGambleBettingAction,
  scoreTavernGamblePlayer,
  toggleTavernGamblePlayTile,
} = require("../.test-dist/domain/tavern-gambling.js");
const {
  leaderResidenceHouseModule,
} = require("../.test-dist/application/house-modules/leader-residence/leader-residence-house-module.js");
const {
  selectLeaderResidenceOptions,
} = require("../.test-dist/application/city-entries/select-leader-residence-options.js");
const {
  canEnterHouseForStoryStage,
  isCityEntryVisibleForStoryStage,
  isHouseVisibleForStoryStage,
  selectHouseEntryAccess,
} = require("../.test-dist/application/story/story-stage-access.js");
const {
  createInitialGrainShopSessionState,
} = require("../.test-dist/application/house-modules/grain-shop/grain-shop-session-state.js");
const {
  equipValuableItem,
  getVisibleOwnedCards,
  getVisibleValuables,
  resolveSelectedCardId,
  resolveSelectedValuableId,
} = require("../.test-dist/application/inventory/inventory-selection.js");
const {
  accountingGradeRewards,
} = require("../.test-dist/content/houses/grain-shop-content.js");
const { GRAIN_SHOP_VARIABLE_KEYS } = require("../.test-dist/domain/grain-shop.js");
const { HOME_HOUSE_VARIABLE_KEYS } = require("../.test-dist/domain/home-house.js");
const { KEEP_HOUSE_VARIABLE_KEYS } = require("../.test-dist/domain/keep-house.js");
const { TEMPLE_HOUSE_VARIABLE_KEYS } = require("../.test-dist/domain/temple-house.js");
const {
  getMedicineInventoryQuantityVariableKey,
  getPlayerFatigueVariableKey,
} = require("../.test-dist/domain/medicine-house.js");
const {
  getTavernCompletedWorkKey,
  getTavernFailedWorkKey,
} = require("../.test-dist/domain/tavern.js");
const {
  getLeaderResidenceRelationKey,
  LEADER_RESIDENCE_VARIABLE_KEYS,
} = require("../.test-dist/domain/leader-residence.js");
const {
  pickTeaHouseAiTopic,
  resolveTeaHouseDebateRound,
} = require("../.test-dist/application/tea-house/tea-house-debate.js");
const {
  ACTIVITY_COMPLETION_STAMINA_COST,
} = require("../.test-dist/application/player/player-stamina.js");
const {
  createSundeyaRescueBattleSession,
  dispatchStoryBattleAction,
  startStoryBattle,
} = require("../.test-dist/application/story-battle/story-battle-runtime.js");
const {
  runStoryCallback,
} = require("../.test-dist/application/story/story-callbacks.js");
const { startEvent } = require("../.test-dist/application/events/event-runner.js");
const {
  runSceneUntilPause,
} = require("../.test-dist/application/scene/scene-runner.js");
const {
  createActiveGameContent,
} = require("../.test-dist/application/content/active-game-content.js");
const {
  loadDefaultRuntimeContent,
} = require("../.test-dist/application/content/default-runtime-content.js");
const {
  sampleScene,
} = require("../.test-dist/content/sample-scenario.js");
const {
  stopActivityQte,
} = require("../.test-dist/application/activity/activity-qte-runtime.js");
const {
  ZHU_YUANZHANG_STORY_FLAG_KEYS,
  ZHU_YUANZHANG_STORY_STAGES,
  ZHU_YUANZHANG_STORY_VARIABLE_KEYS,
} = require("../.test-dist/domain/zhu-yuanzhang-story.js");
const fs = require("node:fs");
const path = require("node:path");

const playerCharacterId = "char.player";
const keepHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "keep-house"
);
const homeHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "home-house"
);
const grainShopHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "grain-shop"
);
const teaHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "tea-house"
);
const marketHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "market-house"
);
const medicineHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "medicine-house"
);
const tavernHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "tavern"
);
const leaderResidenceHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "leader-residence"
);
const templeHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "temple-house"
);
const leaderResidenceEntry = prototypeCityEntries.find(
  (entryDefinition) => entryDefinition.id === "city-entry.kulan.leader-residence"
);

assert.ok(homeHouse, "Expected prototype home house to exist.");
assert.ok(keepHouse, "Expected prototype keep house to exist.");
assert.ok(grainShopHouse, "Expected prototype grain shop house to exist.");
assert.ok(marketHouse, "Expected prototype market house to exist.");
assert.ok(teaHouse, "Expected prototype tea house to exist.");
assert.ok(medicineHouse, "Expected prototype medicine house to exist.");
assert.ok(tavernHouse, "Expected prototype tavern house to exist.");
assert.ok(
  leaderResidenceHouse,
  "Expected prototype leader residence house to exist."
);
assert.ok(templeHouse, "Expected prototype temple house to exist.");
assert.ok(
  leaderResidenceEntry,
  "Expected prototype leader residence city entry to exist."
);

function createBaseState() {
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: "city.kulan",
    currentHouseId: grainShopHouse.id,
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
    currentView: "house",
  });
}

function createRuntimeState(coreState = createBaseState()) {
  return {
    core: coreState,
    app: {
      beggingMiniGameState: null,
      autoAdvanceState: null,
      campaignTravelState: null,
      cityDirectoryState: null,
      cityMenuState: null,
      locationDialogueState: null,
      modalState: null,
    },
    view: {},
  };
}

function addTestDays(date, days) {
  const currentNumber = date.year * 360 + (date.month - 1) * 30 + date.day;
  const nextNumber = currentNumber + days;
  const nextYear = Math.floor((nextNumber - 1) / 360);
  const dayOfYear = nextNumber - nextYear * 360;
  return {
    year: nextYear,
    month: Math.floor((dayOfYear - 1) / 30) + 1,
    day: ((dayOfYear - 1) % 30) + 1,
  };
}

async function withLocalJsonFileFetch(run) {
  const originalFetch = global.fetch;

  global.fetch = async (input) => {
    const url = typeof input === "string" ? input : input.url;

    if (url.startsWith("file:")) {
      const localPath = fileURLToPath(url);
      if (!fs.existsSync(localPath)) {
        return new Response(null, { status: 404 });
      }

      return new Response(fs.readFileSync(localPath, "utf8"), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return originalFetch(input);
  };

  try {
    await run();
  } finally {
    global.fetch = originalFetch;
  }
}

function loadCurrentViteConfigModule() {
  const sourceFilePath = path.join(process.cwd(), "vite.config.ts");
  const sourceText = fs.readFileSync(sourceFilePath, "utf8");
  const transpiled = ts.transpileModule(sourceText, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
      verbatimModuleSyntax: false,
    },
    fileName: sourceFilePath,
  });
  const LoadedModule = module.constructor;
  const loadedModule = new LoadedModule(sourceFilePath, module);

  loadedModule.filename = sourceFilePath;
  loadedModule.paths = LoadedModule._nodeModulePaths(path.dirname(sourceFilePath));
  loadedModule._compile(transpiled.outputText, sourceFilePath);

  return loadedModule.exports;
}

function getTypeScriptDiagnosticsForFile(relativeFilePath) {
  const configPath = path.join(process.cwd(), "tsconfig.json");
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  if (configFile.error) {
    throw new Error(ts.flattenDiagnosticMessageText(configFile.error.messageText, "\n"));
  }

  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    process.cwd(),
    undefined,
    configPath
  );
  const program = ts.createProgram({
    rootNames: parsedConfig.fileNames,
    options: parsedConfig.options,
  });
  const targetPath = path
    .resolve(process.cwd(), relativeFilePath)
    .replaceAll("\\", "/");

  return ts
    .getPreEmitDiagnostics(program)
    .filter(
      (diagnostic) =>
        diagnostic.file?.fileName.replaceAll("\\", "/") === targetPath
    )
    .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
}

function collectTypeScriptSourceFiles(rootPath) {
  const entries = fs.readdirSync(rootPath, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const entryPath = path.join(rootPath, entry.name);

    if (entry.isDirectory()) {
      return collectTypeScriptSourceFiles(entryPath);
    }

    if (entry.isFile() && entry.name.endsWith(".ts")) {
      return [entryPath];
    }

    return [];
  });
}

function findForbiddenProductionSourceReferences(forbiddenPatterns) {
  const sourceRoot = path.join(process.cwd(), "src");
  const sourceFilePaths = collectTypeScriptSourceFiles(sourceRoot);

  return sourceFilePaths.flatMap((filePath) => {
    const source = fs.readFileSync(filePath, "utf8");
    const matchedPatterns = forbiddenPatterns.filter((pattern) =>
      source.includes(pattern)
    );

    if (matchedPatterns.length === 0) {
      return [];
    }

    return [
      {
        filePath: path.relative(process.cwd(), filePath),
        matchedPatterns,
      },
    ];
  });
}

function collectFilePaths(rootPath) {
  const entries = fs.readdirSync(rootPath, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const entryPath = path.join(rootPath, entry.name);

    if (entry.isDirectory()) {
      return collectFilePaths(entryPath);
    }

    if (entry.isFile()) {
      return [entryPath];
    }

    return [];
  });
}

function createImportedScenarioPackFilesFromDisk(packRoot, packFolderName) {
  return collectFilePaths(packRoot).map((filePath) => {
    const fileName = path.basename(filePath);
    const relativePath = path
      .relative(packRoot, filePath)
      .replaceAll(path.sep, "/");
    const file = new File([fs.readFileSync(filePath)], fileName, {
      type: fileName.endsWith(".json")
        ? "application/json"
        : "application/octet-stream",
    });

    Object.defineProperty(file, "webkitRelativePath", {
      configurable: true,
      value: `${packFolderName}/${relativePath}`,
    });

    return file;
  });
}

test.before(async () => {
  await withLocalJsonFileFetch(async () => {
    await loadDefaultRuntimeContent();
  });
});

test("scene start-activity action executes registered fallback activity", () => {
  const state = createBaseState();
  const activityDefinition = {
    id: "activity.test.special",
    label: "Special activity",
    handlerId: "missing.special-handler",
    fallbackHandlerId: "generic.qte",
    qte: {
      totalRounds: 3,
      requiredSuccesses: 2,
    },
    outcome: {
      completedFlagKey: "flag.test.activity.completed",
      gradeVariableKey: "var.test.activity.grade",
      effects: [
        {
          type: "change-variable",
          key: "var.test.activity.points",
          delta: 5,
        },
      ],
    },
  };
  const eventDefinition = {
    id: "event.test.activity",
    chapterId: "chapter.prototype",
    name: "Activity integration test",
    occurrence: "repeatable",
    trigger: { timing: "manual" },
    conditions: [],
    entrySceneId: "scene.test.activity",
  };
  const sceneDefinitionsById = {
    "scene.test.activity": {
      id: "scene.test.activity",
      name: "Activity scene",
      actions: [
        {
          type: "start-activity",
          activityId: "activity.test.special",
        },
        {
          type: "narration",
          text: "Activity resolved.",
        },
      ],
    },
  };
  const result = runSceneUntilPause(startEvent(state, eventDefinition), {
    sceneDefinitionsById,
    eventDefinitionsById: {
      [eventDefinition.id]: eventDefinition,
    },
    activityDefinitionsById: {
      "activity.test.special": activityDefinition,
    },
    characterDefinitions: prototypeCharacters,
  });

  assert.equal(result.currentAction?.type, "narration");
  assert.equal(result.state.runtime.activitySession?.type, "qte-bar");
  assert.equal(result.state.runtime.activitySession.activityId, "activity.test.special");
  assert.equal(result.state.runtime.variables["var.test.activity.points"], undefined);

  const firstStop = stopActivityQte(
    {
      ...result.state,
      runtime: {
        ...result.state.runtime,
        activitySession: {
          ...result.state.runtime.activitySession,
          markerPercent: 45,
        },
      },
    },
    activityDefinition,
    prototypeCharacters
  );
  const secondStop = stopActivityQte(
    {
      ...firstStop.state,
      runtime: {
        ...firstStop.state.runtime,
        activitySession: {
          ...firstStop.state.runtime.activitySession,
          markerPercent: 62,
        },
      },
    },
    activityDefinition,
    firstStop.characterDefinitions
  );
  const thirdStop = stopActivityQte(
    {
      ...secondStop.state,
      runtime: {
        ...secondStop.state.runtime,
        activitySession: {
          ...secondStop.state.runtime.activitySession,
          markerPercent: 0,
        },
      },
    },
    activityDefinition,
    secondStop.characterDefinitions
  );

  assert.equal(thirdStop.state.runtime.activitySession?.type, "result");
  assert.equal(thirdStop.state.runtime.flags["flag.test.activity.completed"], true);
  assert.equal(
    thirdStop.state.runtime.flags["flag.activity.test.special.completed"],
    true
  );
  assert.equal(thirdStop.state.runtime.variables["var.test.activity.grade"], "success");
  assert.equal(thirdStop.state.runtime.variables["var.test.activity.points"], 5);
  assert.equal(thirdStop.state.runtime.variables["var.activity.last_handler"], "generic.qte");
});

function withCouncilInDays(state, days = 30) {
  return {
    ...state,
    world: {
      ...state.world,
      schedule: {
        ...state.world.schedule,
        councilDate: addTestDays(state.calendar, days),
      },
    },
    runtime: {
      ...state.runtime,
      variables: {
        ...state.runtime.variables,
        [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: days,
      },
    },
  };
}

function createStateWithGrainVariables() {
  const state = createBaseState();
  return {
    ...state,
    runtime: {
      ...state.runtime,
      variables: {
        ...state.runtime.variables,
        [GRAIN_SHOP_VARIABLE_KEYS.food]: 5,
        [GRAIN_SHOP_VARIABLE_KEYS.relationship]: 0,
        [GRAIN_SHOP_VARIABLE_KEYS.time]: 1,
        [GRAIN_SHOP_VARIABLE_KEYS.grainPrice]: 100,
      },
    },
  };
}

function createMonkStageState() {
  const state = createBaseState();
  return {
    ...state,
    runtime: {
      ...state.runtime,
      variables: {
        ...state.runtime.variables,
        [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage]:
          ZHU_YUANZHANG_STORY_STAGES.huangjueTemple,
      },
    },
  };
}

function getPlayerCharacter(characterDefinitions) {
  const playerCharacter = characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === playerCharacterId
  );
  assert.ok(playerCharacter);
  return playerCharacter;
}

function withPlayerStamina(characterDefinitions, stamina) {
  return characterDefinitions.map((characterDefinition) =>
    characterDefinition.id === playerCharacterId
      ? {
          ...characterDefinition,
          stamina,
        }
      : characterDefinition
  );
}

test("active game content indexes pack text entries by id", () => {
  const content = createActiveGameContent({
    schemaVersion: 1,
    id: "pack.test.text",
    title: "Text pack",
    textEntries: {
      "scene.test.line.001": "第一句台词",
      "scene.test.choice.001": "接受",
    },
    scenes: [],
    events: [],
    characters: [],
    cities: [],
    houses: [],
    maps: [],
    cityEntries: [],
    activities: [],
    cards: [],
    valuables: [],
  });

  assert.equal(content.textEntriesById["scene.test.line.001"], "第一句台词");
  assert.equal(content.textEntriesById["scene.test.choice.001"], "接受");
});

test("active game content indexes merged task definitions by id", () => {
  const content = createActiveGameContent(
    {
      schemaVersion: 1,
      id: "pack.base.tasks",
      title: "Base Tasks",
      textEntries: {},
      scenes: [],
      events: [],
      characters: [],
      cities: [],
      houses: [],
      maps: [],
      cityEntries: [],
      tasks: [
        {
          id: "task.base",
          title: "Base Task",
          objectives: [{ id: "report", target: 1, signalType: "scene.reported" }],
        },
      ],
      activities: [],
      cards: [],
      valuables: [],
    },
    {
      schemaVersion: 1,
      id: "pack.override.tasks",
      title: "Override Tasks",
      textEntries: {},
      scenes: [],
      events: [],
      characters: [],
      cities: [],
      houses: [],
      maps: [],
      cityEntries: [],
      tasks: [
        {
          id: "task.override",
          title: "Override Task",
          objectives: [{ id: "visit", target: 1, signalType: "city.entered" }],
        },
      ],
      activities: [],
      cards: [],
      valuables: [],
    }
  );

  assert.deepEqual(
    content.taskDefinitions.map((taskDefinition) => taskDefinition.id),
    ["task.base", "task.override"]
  );
  assert.equal(content.taskDefinitionsById["task.base"].title, "Base Task");
  assert.equal(
    content.taskDefinitionsById["task.override"].objectives[0].signalType,
    "city.entered"
  );
});

test("scene view resolves narration dialogue and choice text through text ids", () => {
  const {
    resolveActionNodeText,
  } = require("../.test-dist/application/content/text-resolution.js");

  const textEntriesById = {
    "scene.test.prompt": "你要如何回应？",
    "scene.test.choice.yes": "接受",
    "scene.test.choice.no": "拒绝",
  };

  const resolved = resolveActionNodeText(
    {
      type: "choice",
      promptTextId: "scene.test.prompt",
      options: [
        { id: "yes", labelTextId: "scene.test.choice.yes" },
        { id: "no", labelTextId: "scene.test.choice.no" },
      ],
    },
    ({
      textEntriesById,
    })
  );

  assert.equal(resolved.prompt, "你要如何回应？");
  assert.deepEqual(
    resolved.options.map((option) => option.label),
    ["接受", "拒绝"]
  );
});

test("text resolution interpolates template entries with named variables", () => {
  const {
    resolveTextTemplateEntry,
  } = require("../.test-dist/application/content/text-resolution.js");

  const textEntriesById = {
    "runtime.test.reminder":
      "先去{targetHouseName}把评定应下，这一趟{activityLabel}至少要 {durationDays} 天。",
  };

  const resolved = resolveTextTemplateEntry(
    textEntriesById,
    "runtime.test.reminder",
    {
      targetHouseName: "皇觉寺",
      activityLabel: "远途化缘",
      durationDays: 5,
    }
  );

  assert.equal(
    resolved,
    "先去皇觉寺把评定应下，这一趟远途化缘至少要 5 天。"
  );
});

test("zhuyuanzhang pack text entries provide extracted main runtime copy ids", () => {
  const textEntriesById = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src/content/scenario-packs/zhuyuanzhang/text-entries.json"
      ),
      "utf8"
    )
  );

  [
    "runtime.zhu_yuanzhang.prototype.main_mission.temple_review",
    "runtime.zhu_yuanzhang.council_arrival.temple.001",
    "runtime.zhu_yuanzhang.council_arrival.keep.001",
    "runtime.zhu_yuanzhang.council_refusal.temple.001",
    "runtime.zhu_yuanzhang.council_refusal.keep.001",
    "runtime.zhu_yuanzhang.council_insufficient_time.temple.arrived.001",
    "runtime.zhu_yuanzhang.council_insufficient_time.keep.arrived.001",
    "runtime.zhu_yuanzhang.haozhou_shortage.001",
    "runtime.zhu_yuanzhang.haozhou_shortage.advance_hint",
    "runtime.zhu_yuanzhang.begging_stamina_refusal.001",
    "runtime.zhu_yuanzhang.begging_stamina_refusal.002",
    "runtime.zhu_yuanzhang.begging_stamina_refusal.advance_hint",
    "runtime.zhu_yuanzhang.chapter_intro.huai_xi_begging",
    "runtime.zhu_yuanzhang.main_mission.haozhou_return",
    "runtime.zhu_yuanzhang.main_mission.guo_zixing_keep",
    "runtime.zhu_yuanzhang.main_mission.sundeya_battle_review",
    "runtime.zhu_yuanzhang.player.biography.guo_zixing_camp",
    "battle.story.zhu_yuanzhang.sundeya_rescue.title",
    "battle.story.zhu_yuanzhang.sundeya_rescue.log.victory.002",
    "battle.story.zhu_yuanzhang.sundeya_rescue.unit.player_vanguard.name",
  ].forEach((textId) => {
    assert.equal(typeof textEntriesById[textId], "string", `Missing text entry ${textId}`);
  });
});

test("zhuyuanzhang pack stamina refusal entries interpolate the activity cost", () => {
  const {
    resolveTextTemplateEntry,
  } = require("../.test-dist/application/content/text-resolution.js");

  const textEntriesById = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src/content/scenario-packs/zhuyuanzhang/text-entries.json"
      ),
      "utf8"
    )
  );

  const resolved = resolveTextTemplateEntry(
    textEntriesById,
    "runtime.zhu_yuanzhang.begging_stamina_refusal.002",
    {
      requiredStamina: 8,
    }
  );

  assert.equal(
    resolved,
    "先回去歇息，体力缓到 8 点，再出门也不迟。"
  );
});

test("main.ts stays free of TypeScript diagnostics for runtime text wiring", () => {
  assert.deepEqual(getTypeScriptDiagnosticsForFile("src/main.ts"), []);
});

test("runtime zhuyuanzhang text ids in main.ts do not keep inline fallback prose", () => {
  const source = fs.readFileSync(path.join(process.cwd(), "src/main.ts"), "utf8");
  const forbiddenStrings = [
    "前往评定会场",
    "前往皇觉寺听候住持训示",
    "评定日期已到，先去${priorityHouse.name}听候方丈安排。",
    "寺中知客僧已经在前殿等你了，别再误了时辰。",
    "评定日期已到，速去${priorityHouse.name}应评。",
    "门前亲兵已经来催，你该先把这一轮评定办完。",
    "今日是寺中评定，先去${priorityHouse?.name ?? \"皇觉寺\"}听候安排。",
    "其他去处都先放下，评定要紧。",
    "今日该去${priorityHouse?.name ?? \"帅府\"}参加评定。",
    "别处都先不用跑，先把评定办完。",
    "（上前提醒你）评定日期已到，这一趟${activityLabel}至少要 ${durationDays} 天，眼下已经来不及了。",
    "先去${targetName}把评定应下，回来再说这桩事。",
    "（上前提醒你）离评定只剩 ${remainingDays} 天，这一趟${activityLabel}至少要 ${durationDays} 天，眼下已经来不及了。",
    "门前亲兵催道：“评定日期已到，这趟${activityLabel}至少要 ${durationDays} 天，眼下抽不开身。”",
    "“先去${targetName}应评，别把时辰误了。”",
    "门前亲兵催道：“离评定只剩 ${remainingDays} 天，这趟${activityLabel}至少要 ${durationDays} 天，眼下抽不开身。”",
    "濠州近来断粮得厉害，沿街托钵也讨不出几把米来。",
    "住持早已吩咐过，这一轮别把时日耗在城里，还是往颍州方向走，外地才更有指望。",
    "改去北路",
    "（隔着人群唤住了你）你这会儿脚步都虚了，就别再硬撑着出去化缘。",
    "先回去歇息，体力缓到 ${ACTIVITY_COMPLETION_STAMINA_COST} 点，再出门也不迟。",
    "先去休息",
    "返濠州听候盘查",
    "第一章·淮西托钵",
  ];
  const matchedStrings = forbiddenStrings.filter((entry) => source.includes(entry));

  assert.deepEqual(
    matchedStrings,
    [],
    `Expected main.ts to stop carrying inline runtime fallback prose for zhuyuanzhang ids. Matched ${matchedStrings.length} string(s).`
  );
});

test("story callback resolves guo zixing camp copy from text entries", () => {
  const result = runStoryCallback(
    "story.zhu_yuanzhang.join-guo-zixing-camp",
    undefined,
    {
      state: createBaseState(),
      characterDefinitions: prototypeCharacters,
      textEntriesById: {
        "runtime.zhu_yuanzhang.main_mission.guo_zixing_keep": "转去帅府待命",
        "runtime.zhu_yuanzhang.player.title.guo_zixing_camp": "帐前亲兵",
        "runtime.zhu_yuanzhang.player.occupation.guo_zixing_camp": "郭营近卫",
        "runtime.zhu_yuanzhang.player.affiliation.guo_zixing_camp": "濠州义军",
        "runtime.zhu_yuanzhang.player.biography.guo_zixing_camp":
          "你被编入郭营近侧，先从亲兵杂务做起。",
      },
    }
  );

  const playerCharacter = getPlayerCharacter(result.characterDefinitions);
  assert.equal(result.state.ui.mainHouseMissionText, "转去帅府待命");
  assert.equal(playerCharacter.title, "帐前亲兵");
  assert.equal(playerCharacter.occupation, "郭营近卫");
  assert.equal(playerCharacter.affiliationLabel, "濠州义军");
  assert.equal(
    playerCharacter.biography,
    "你被编入郭营近侧，先从亲兵杂务做起。"
  );
});

test("story callbacks do not keep inline fallback prose for guo zixing camp runtime copy", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/application/story/story-callbacks.ts"),
    "utf8"
  );
  const forbiddenStrings = [
    "前往帅府听候差遣",
    "亲兵",
    "郭子兴部亲兵",
    "濠州郭子兴集团",
    "你已被郭子兴留置左右，暂从亲兵与粮道杂务做起，开始真正卷入濠州红巾军的秩序之中。",
    "战后帅府评定",
  ];
  const matchedStrings = forbiddenStrings.filter((entry) => source.includes(entry));

  assert.deepEqual(
    matchedStrings,
    [],
    `Expected story-callbacks.ts to stop carrying inline runtime fallback prose for zhuyuanzhang ids. Matched ${matchedStrings.length} string(s).`
  );
});

test("sample scenario scene content is migrated to text ids", () => {
  const dialogueAction = sampleScene.actions.find(
    (action) => action.type === "dialogue"
  );
  const choiceAction = sampleScene.actions.find(
    (action) => action.type === "choice"
  );

  assert.ok(dialogueAction);
  assert.equal(dialogueAction.text, undefined);
  assert.equal(typeof dialogueAction.textId, "string");

  assert.ok(choiceAction);
  assert.equal(choiceAction.prompt, undefined);
  assert.equal(typeof choiceAction.promptTextId, "string");
  assert.equal(choiceAction.options.every((option) => option.label == null), true);
  assert.equal(
    choiceAction.options.every((option) => typeof option.labelTextId === "string"),
    true
  );
});

test("liu bang json scenario pack uses external text entries for scene content", () => {
  const packRoot = path.join(
    process.cwd(),
    "src",
    "content",
    "scenario-packs",
    "liu-bang-pei-county-opening"
  );
  const packManifest = JSON.parse(
    fs.readFileSync(path.join(packRoot, "pack.json"), "utf8")
  );
  const scenes = JSON.parse(
    fs.readFileSync(path.join(packRoot, "scenes.json"), "utf8")
  );
  const textEntries = JSON.parse(
    fs.readFileSync(path.join(packRoot, "text-entries.json"), "utf8")
  );

  assert.equal(packManifest.files.textEntries, "text-entries.json");
  assert.equal(
    scenes.some((scene) =>
      scene.actions.some(
        (action) =>
          (action.type === "narration" || action.type === "dialogue") &&
          typeof action.textId === "string" &&
          action.text == null
      )
    ),
    true
  );
  assert.equal(
    scenes.some((scene) =>
      scene.actions.some(
        (action) =>
          action.type === "choice" &&
          typeof action.promptTextId === "string" &&
          action.prompt == null &&
          action.options.every((option) => option.label == null) &&
          action.options.every((option) => typeof option.labelTextId === "string")
      )
    ),
    true
  );
  assert.equal(
    typeof textEntries["scene.story.liu_bang.pei_county_opening.001"],
    "string"
  );
});

test("zhuyuanzhang scenario pack manifest follows canonical split-table shape", () => {
  const packRoot = path.join(
    process.cwd(),
    "src",
    "content",
    "scenario-packs",
    "zhuyuanzhang"
  );
  const packManifest = JSON.parse(
    fs.readFileSync(path.join(packRoot, "pack.json"), "utf8")
  );

  assert.equal(packManifest.kind, "scenario-pack");
  assert.equal(typeof packManifest.files.scenarioProfile, "string");
  assert.equal(typeof packManifest.files.events, "string");
  assert.equal(typeof packManifest.files.scenes, "string");
  assert.equal(typeof packManifest.files.textEntries, "string");
  assert.equal(typeof packManifest.files.activities, "string");

  [
    packManifest.files.scenarioProfile,
    packManifest.files.events,
    packManifest.files.scenes,
    packManifest.files.textEntries,
    packManifest.files.activities,
  ].forEach((fileName) => {
    assert.equal(
      fs.existsSync(path.join(packRoot, fileName)),
      true,
      `Expected zhuyuanzhang pack file ${fileName} to exist`
    );
  });
});

test("zhuyuanzhang scenario pack keeps scene text in pack-local text entries", () => {
  const packRoot = path.join(
    process.cwd(),
    "src",
    "content",
    "scenario-packs",
    "zhuyuanzhang"
  );
  const scenes = JSON.parse(
    fs.readFileSync(path.join(packRoot, "scenes.json"), "utf8")
  );
  const textEntries = JSON.parse(
    fs.readFileSync(path.join(packRoot, "text-entries.json"), "utf8")
  );
  const scenarioProfile = JSON.parse(
    fs.readFileSync(path.join(packRoot, "scenario-profile.json"), "utf8")
  );

  assert.equal(scenarioProfile.id, "scenario.zhu_yuanzhang.monk_opening");
  assert.equal(
    scenes.some((scene) =>
      scene.actions.some(
        (action) =>
          (action.type === "narration" || action.type === "dialogue") &&
          typeof action.textId === "string" &&
          action.text == null
      )
    ),
    true
  );
  assert.equal(
    typeof textEntries["scene.story.zhu_yuanzhang.ordination.001"],
    "string"
  );
});

test("base game content no longer imports zhuyuanzhang base-content-pack", () => {
  const sourceRoot = path.join(process.cwd(), "src", "content");
  const baseGameContentSource = fs.readFileSync(
    path.join(sourceRoot, "base-game-content-pack.ts"),
    "utf8"
  );
  const scenarioProfilesSource = fs.readFileSync(
    path.join(sourceRoot, "scenarios", "scenario-profiles.ts"),
    "utf8"
  );

  assert.equal(
    baseGameContentSource.includes(
      './scenario-packs/zhuyuanzhang/base-content-pack'
    ),
    false
  );
  assert.equal(
    scenarioProfilesSource.includes(
      "../scenario-packs/zhuyuanzhang/base-content-pack"
    ),
    false
  );
});

test("zhuyuanzhang pack directory has no TypeScript assembly entrypoint", () => {
  const packRoot = path.join(
    process.cwd(),
    "src",
    "content",
    "scenario-packs",
    "zhuyuanzhang"
  );

  assert.equal(fs.existsSync(path.join(packRoot, "base-content-pack.ts")), false);
});

test(
  "scenario pack catalog declares default zhuyuanzhang and liu bang manifests",
  () => {
    const catalog = JSON.parse(
      fs.readFileSync(
        path.join(
          process.cwd(),
          "src",
          "content",
          "scenario-packs",
          "catalog.json"
        ),
        "utf8"
      )
    );

    assert.equal(
      catalog.some(
        (entry) => entry.id === "scenario-pack.zhu_yuanzhang.monk_opening"
      ),
      true
    );
    assert.equal(
      catalog.some(
        (entry) => entry.id === "scenario-pack.liu_bang.pei_county_opening"
      ),
      true
    );
    assert.equal(
      catalog.find(
        (entry) => entry.id === "scenario-pack.zhu_yuanzhang.monk_opening"
      )?.isDefault,
      true
    );
    assert.equal(
      catalog.every((entry) => entry.scenarioProfile == null),
      true
    );
  }
);

test(
  "scenario pack catalog loader resolves default zhuyuanzhang manifest url",
  async () => {
    const {
      parseScenarioPackCatalogText,
      getDefaultScenarioPackCatalogEntry,
      resolveScenarioPackSummaries,
    } = require("../.test-dist/application/content/catalog-loader.js");
    const catalogPath = path.join(
      process.cwd(),
      "src",
      "content",
      "scenario-packs",
      "catalog.json"
    );
    const catalogUrl = pathToFileURL(catalogPath).href;
    const catalogEntries = parseScenarioPackCatalogText(
      fs.readFileSync(catalogPath, "utf8")
    );
    const defaultEntry = getDefaultScenarioPackCatalogEntry(catalogEntries);
    const summaries = resolveScenarioPackSummaries(catalogEntries, catalogUrl);

    assert.equal(
      defaultEntry.id,
      "scenario-pack.zhu_yuanzhang.monk_opening"
    );
    assert.equal(summaries[0]?.id, "scenario-pack.zhu_yuanzhang.monk_opening");
    assert.equal(
      summaries[0]?.url.endsWith("/src/content/scenario-packs/zhuyuanzhang/pack.json"),
      true
    );
    assert.equal(
      summaries[1]?.url.endsWith(
        "/src/content/scenario-packs/liu-bang-pei-county-opening/pack.json"
      ),
      true
    );
  }
);

test(
  "built-in scenario pack summaries use the published /scenario-packs route",
  () => {
    const {
      builtInScenarioPacks,
    } = require("../.test-dist/content/scenario-packs/scenario-pack-catalog.js");

    assert.equal(
      builtInScenarioPacks[0]?.url,
      "/scenario-packs/zhuyuanzhang/pack.json"
    );
    assert.equal(
      builtInScenarioPacks[1]?.url,
      "/scenario-packs/liu-bang-pei-county-opening/pack.json"
    );
  }
);

test(
  "scenario profiles source no longer imports zhuyuanzhangScenarioProfile",
  () => {
    const source = fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "content",
        "scenarios",
        "scenario-profiles.ts"
      ),
      "utf8"
    );

    assert.equal(source.includes("zhuyuanzhangScenarioProfile"), false);
    assert.equal(source.includes("entry.scenarioProfile"), false);
    assert.equal(source.includes("loadScenarioPackFromUrl"), true);
    assert.equal(source.includes("qin_shihuang"), false);
  }
);

test(
  "production TypeScript sources contain no zhuyuanzhang pack-private assembly references",
  () => {
    const forbiddenReferences = [
      "scenario-packs/zhuyuanzhang/base-content-pack",
      "zhuyuanzhangScenarioProfile",
      "createZhuyuanzhangBaseContentPackCore",
    ];
    const offenders = findForbiddenProductionSourceReferences(
      forbiddenReferences
    );

    assert.deepEqual(
      offenders,
      [],
      `Expected production sources to avoid pack-private assembly references, found ${JSON.stringify(
        offenders,
        null,
        2
      )}`
    );
  }
);

test(
  "scenario profiles load default built-in scenario profile through manifest-driven catalog loading",
  async () => {
    const {
      loadScenarioProfiles,
    } = require("../.test-dist/content/scenarios/scenario-profiles.js");
    const scenarioPackRoot = path.join(
      process.cwd(),
      "src",
      "content",
      "scenario-packs"
    );
    const originalFetch = global.fetch;

    global.fetch = async (input) => {
      const url = typeof input === "string" ? input : input.url;
      const baseUrl = "https://example.test/content/scenario-packs/";
      const relativePath = url.startsWith(baseUrl)
        ? url.slice(baseUrl.length)
        : null;

      assert.notEqual(relativePath, null, `Unexpected fetch url ${url}`);
      const localPath = path.join(
        scenarioPackRoot,
        relativePath.replaceAll("/", path.sep)
      );

      if (!fs.existsSync(localPath)) {
        return new Response(null, { status: 404 });
      }

      return new Response(fs.readFileSync(localPath, "utf8"), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    };

    try {
      const scenarioProfiles = await loadScenarioProfiles(
        "https://example.test/content/scenario-packs/catalog.json"
      );

      assert.equal(
        scenarioProfiles[0]?.id,
        "scenario.zhu_yuanzhang.monk_opening"
      );
      assert.equal(
        scenarioProfiles[1]?.id,
        "scenario.liu_bang.pei_county_opening"
      );
      assert.equal(
        scenarioProfiles.length,
        2
      );
    } finally {
      global.fetch = originalFetch;
    }
  }
);

test("vite scenario-pack publisher stages zhuyuanzhang manifest content to the browser route", () => {
  const {
    publishScenarioPacksToDir,
    SCENARIO_PACK_PUBLIC_ROOT,
  } = loadCurrentViteConfigModule();
  const outputRoot = fs.mkdtempSync(
    path.join(require("node:os").tmpdir(), "rpg-tg-pack-publish-")
  );

  publishScenarioPacksToDir(process.cwd(), outputRoot);

  const publishedPackRoot = path.join(
    outputRoot,
    SCENARIO_PACK_PUBLIC_ROOT.replace(/^\//, "")
  );

  assert.equal(
    fs.existsSync(path.join(publishedPackRoot, "zhuyuanzhang", "pack.json")),
    true
  );
  assert.equal(
    fs.existsSync(path.join(publishedPackRoot, "zhuyuanzhang", "cities.json")),
    true
  );
  assert.equal(
    fs.existsSync(path.join(publishedPackRoot, "zhuyuanzhang", "assets", "maps", "HD.png")),
    true
  );
});

test("base game content pack is sourced from the shared content-pack loader", async () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src", "content", "base-game-content-pack.ts"),
    "utf8"
  );

  assert.equal(
    source.includes("loadContentPackFromManifestUrl"),
    true,
    "Expected base-game-content-pack.ts to delegate to the shared loader."
  );
  assert.equal(
    source.includes("scenario-packs/zhuyuanzhang/pack.json"),
    true,
    "Expected base-game-content-pack.ts to load the fixed zhuyuanzhang manifest path."
  );
  assert.equal(
    source.includes("/scenario-packs/zhuyuanzhang/pack.json"),
    true,
    "Expected the browser runtime to fetch the published scenario-pack route."
  );
  assert.equal(
    source.includes("/src/content/scenario-packs/zhuyuanzhang/pack.json"),
    false,
    "Expected the browser runtime to stop fetching the source-tree path directly."
  );
  assert.equal(
    source.includes('scenario-packs/zhuyuanzhang/characters.json'),
    false,
    "Expected base-game-content-pack.ts to stop importing split tables directly."
  );

  const {
    createBaseGameContentPack,
  } = require("../.test-dist/content/base-game-content-pack.js");

  await withLocalJsonFileFetch(async () => {
    const pack = await createBaseGameContentPack();

    assert.equal(pack.id, "scenario-pack.zhu_yuanzhang.monk_opening");
    assert.equal(pack.characters.some((character) => character.id === "char.player"), true);
    assert.equal(
      pack.historicalCharacters.some(
        (character) => character.id === "zyz.character.zhu_yuanzhang"
      ),
      true
    );
    assert.equal(
      pack.historicalCharacterIdByCharacterId["char.yuanmo.zhu_yuanzhang"],
      "zyz.character.zhu_yuanzhang"
    );
    assert.equal(pack.cityNpcPools.some((pool) => pool.cityId === "city.kulan"), true);
    assert.equal(
      pack.houseAccessRefusalRules.some(
        (rule) => rule.id === "rule.zhu_yuanzhang.temple.first_review_stay"
      ),
      true
    );
  });
});

test("story content registry does not hard-import zhuyuanzhang pack tables", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src", "content", "story", "index.ts"),
    "utf8"
  );

  assert.equal(
    source.includes("scenario-packs/zhuyuanzhang"),
    false,
    "Expected src/content/story/index.ts to stop hard-importing zhuyuanzhang pack tables."
  );
});

test("house content registry does not hard-import zhuyuanzhang house content tables", () => {
  const houseContentRoot = path.join(process.cwd(), "src", "content", "houses");
  const houseContentFiles = fs
    .readdirSync(houseContentRoot)
    .filter((fileName) => fileName.endsWith(".ts"));

  const hardImportFiles = houseContentFiles.filter((fileName) => {
    const source = fs.readFileSync(path.join(houseContentRoot, fileName), "utf8");
    return source.includes("scenario-packs/zhuyuanzhang");
  });

  assert.deepEqual(
    hardImportFiles,
    [],
    `Expected src/content/houses/*.ts to stop hard-importing zhuyuanzhang pack tables, but found: ${hardImportFiles.join(", ")}`
  );
});

test("pack content access consumers do not hard-import zhuyuanzhang activities or text tables", () => {
  const files = [
    path.join(
      process.cwd(),
      "src",
      "application",
      "house-modules",
      "keep-house",
      "keep-house-house-module.ts"
    ),
    path.join(
      process.cwd(),
      "src",
      "application",
      "house-modules",
      "temple-house",
      "temple-house-house-module.ts"
    ),
  ];

  const hardImportFiles = files.filter((filePath) =>
    fs.readFileSync(filePath, "utf8").includes("scenario-packs/zhuyuanzhang")
  );

  assert.deepEqual(
    hardImportFiles.map((filePath) => path.basename(filePath)),
    [],
    `Expected covered house modules to stop hard-importing zhuyuanzhang activities/text tables, but found: ${hardImportFiles.join(", ")}`
  );
});

test("zhuyuanzhang scenario pack manifest includes pack-local city and access tables", () => {
  const packRoot = path.join(
    process.cwd(),
    "src",
    "content",
    "scenario-packs",
    "zhuyuanzhang"
  );
  const packManifest = JSON.parse(
    fs.readFileSync(path.join(packRoot, "pack.json"), "utf8")
  );

  assert.equal(typeof packManifest.files.cityEntries, "string");
  assert.equal(typeof packManifest.files.cityNpcPools, "string");
  assert.equal(typeof packManifest.files.houseAccessRefusalRules, "string");
  assert.equal(typeof packManifest.files.cityPortraits, "string");

  [
    packManifest.files.cityEntries,
    packManifest.files.cityNpcPools,
    packManifest.files.houseAccessRefusalRules,
    packManifest.files.cityPortraits,
  ].forEach((fileName) => {
    assert.equal(
      fs.existsSync(path.join(packRoot, fileName)),
      true,
      `Expected zhuyuanzhang pack file ${fileName} to exist`
    );
  });
});

test("zhuyuanzhang pack-local city and access tables contain kulan content", () => {
  const packRoot = path.join(
    process.cwd(),
    "src",
    "content",
    "scenario-packs",
    "zhuyuanzhang"
  );
  const cityEntries = JSON.parse(
    fs.readFileSync(path.join(packRoot, "city-entries.json"), "utf8")
  );
  const cityNpcPools = JSON.parse(
    fs.readFileSync(path.join(packRoot, "city-npc-pools.json"), "utf8")
  );
  const houseAccessRefusalRules = JSON.parse(
    fs.readFileSync(path.join(packRoot, "house-access-refusal-rules.json"), "utf8")
  );
  const cityPortraits = JSON.parse(
    fs.readFileSync(path.join(packRoot, "city-portraits.json"), "utf8")
  );

  assert.equal(
    cityEntries.some((entry) => entry.id === "city-entry.kulan.leader-residence"),
    true
  );
  assert.equal(
    cityNpcPools.some((pool) => pool.cityId === "city.kulan" && pool.residents.length > 0),
    true
  );
  assert.equal(
    houseAccessRefusalRules.some(
      (rule) => rule.id === "rule.zhu_yuanzhang.temple.first_review_stay"
    ),
    true
  );
  assert.equal(cityPortraits["city.kulan"] != null, true);
});

test("zhuyuanzhang pack manifest includes historical split tables", () => {
  const packRoot = path.join(
    process.cwd(),
    "src",
    "content",
    "scenario-packs",
    "zhuyuanzhang"
  );
  const packManifest = JSON.parse(
    fs.readFileSync(path.join(packRoot, "pack.json"), "utf8")
  );

  assert.equal(
    packManifest.files.historicalCharacters,
    "historical-characters.json"
  );
  assert.equal(
    packManifest.files.historicalCityRosters,
    "historical-city-rosters.json"
  );
  assert.equal(
    packManifest.files.historicalCharacterIdByCharacterId,
    "historical-character-id-map.json"
  );
});

test("zhuyuanzhang pack-local historical tables contain zhu yuanzhang records", () => {
  const packRoot = path.join(
    process.cwd(),
    "src",
    "content",
    "scenario-packs",
    "zhuyuanzhang"
  );
  const historicalCharacters = JSON.parse(
    fs.readFileSync(path.join(packRoot, "historical-characters.json"), "utf8")
  );
  const historicalCityRosters = JSON.parse(
    fs.readFileSync(path.join(packRoot, "historical-city-rosters.json"), "utf8")
  );
  const historicalCharacterIdByCharacterId = JSON.parse(
    fs.readFileSync(path.join(packRoot, "historical-character-id-map.json"), "utf8")
  );
  const historicalCharacterIds = new Set(
    historicalCharacters.map((characterRecord) => characterRecord.id)
  );
  const fenyangRoster = historicalCityRosters.find(
    (rosterRecord) => rosterRecord.cityNodeId === "settlement.fenyang_province"
  );
  const mappedZhuYuanzhangId =
    historicalCharacterIdByCharacterId["char.yuanmo.zhu_yuanzhang"];

  assert.equal(
    historicalCharacters.some(
      (characterRecord) => characterRecord.id === "zyz.character.zhu_yuanzhang"
    ),
    true
  );
  assert.ok(fenyangRoster);
  assert.equal("cityId" in fenyangRoster, false);
  assert.equal(
    [
      ...fenyangRoster.primaryCharacterIds,
      ...fenyangRoster.secondaryCharacterIds,
      ...fenyangRoster.backgroundCharacterIds,
    ].includes("zyz.character.zhu_yuanzhang"),
    true
  );
  assert.equal(
    [
      ...fenyangRoster.primaryCharacterIds,
      ...fenyangRoster.secondaryCharacterIds,
      ...fenyangRoster.backgroundCharacterIds,
    ].every((characterId) => historicalCharacterIds.has(characterId)),
    true
  );
  assert.equal(
    typeof mappedZhuYuanzhangId,
    "string"
  );
  assert.equal(historicalCharacterIds.has(mappedZhuYuanzhangId), true);
});

test("zhuyuanzhang maps use relative pack asset urls instead of imageAssetId", () => {
  const packRoot = path.join(
    process.cwd(),
    "src",
    "content",
    "scenario-packs",
    "zhuyuanzhang"
  );
  const maps = JSON.parse(
    fs.readFileSync(path.join(packRoot, "maps.json"), "utf8")
  );
  const yuanmoCampaignMap = maps.find((map) => map.id === "map.yuanmo_campaign");

  assert.ok(yuanmoCampaignMap);
  assert.equal("primaryImageAssetId" in yuanmoCampaignMap, false);
  assert.equal("regionOverlayImageAssetId" in yuanmoCampaignMap, false);
  assert.equal(yuanmoCampaignMap.primaryImageUrl, "./assets/maps/HD.png");
  assert.equal(
    yuanmoCampaignMap.regionOverlayImageUrl,
    "./assets/maps/yuanmo-map-regions.png"
  );
  assert.equal(
    yuanmoCampaignMap.layers.every((layer) => typeof layer.imageUrl === "string"),
    true
  );
  assert.equal(
    yuanmoCampaignMap.layers.every((layer) => layer.imageUrl.startsWith("./assets/maps/")),
    true
  );
  assert.equal(
    yuanmoCampaignMap.layers.some((layer) => "imageAssetId" in layer),
    false
  );

  [
    yuanmoCampaignMap.primaryImageUrl,
    yuanmoCampaignMap.regionOverlayImageUrl,
    ...yuanmoCampaignMap.layers.map((layer) => layer.imageUrl),
  ].forEach((relativeAssetUrl) => {
    const assetPath = path.join(
      packRoot,
      relativeAssetUrl.replaceAll("/", path.sep)
    );

    assert.equal(
      fs.existsSync(assetPath),
      true,
      `Expected zhuyuanzhang map asset ${relativeAssetUrl} to exist`
    );
  });
});

test("content pack loader resolves zhuyuanzhang map asset urls", async () => {
  const {
    loadContentPackFromManifestText,
  } = require("../.test-dist/application/content/content-pack-loader.js");
  const packRoot = path.join(
    process.cwd(),
    "src",
    "content",
    "scenario-packs",
    "zhuyuanzhang"
  );
  const manifestText = fs.readFileSync(path.join(packRoot, "pack.json"), "utf8");
  const manifestUrl =
    "https://example.test/content/scenario-packs/zhuyuanzhang/pack.json";
  const packBaseUrl =
    "https://example.test/content/scenario-packs/zhuyuanzhang/";
  const originalFetch = global.fetch;

  global.fetch = async (input) => {
    const url = typeof input === "string" ? input : input.url;
    const relativePath = url.startsWith(packBaseUrl)
      ? url.slice(packBaseUrl.length)
      : null;

    assert.notEqual(relativePath, null, `Unexpected fetch url ${url}`);
    const localPath = path.join(packRoot, relativePath.replaceAll("/", path.sep));

    if (!fs.existsSync(localPath)) {
      return new Response(null, { status: 404 });
    }

    return new Response(fs.readFileSync(localPath, "utf8"), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  try {
    const pack = await loadContentPackFromManifestText(manifestText, manifestUrl);
    const yuanmoCampaignMap = pack.maps.find(
      (map) => map.id === "map.yuanmo_campaign"
    );

    assert.equal(pack.id, "scenario-pack.zhu_yuanzhang.monk_opening");
    assert.ok(yuanmoCampaignMap);
    assert.equal(
      yuanmoCampaignMap.primaryImageUrl,
      `${packBaseUrl}assets/maps/HD.png`
    );
    assert.equal(
      yuanmoCampaignMap.regionOverlayImageUrl,
      `${packBaseUrl}assets/maps/yuanmo-map-regions.png`
    );
    assert.equal(
      yuanmoCampaignMap.layers.every((layer) =>
        layer.imageUrl.startsWith(`${packBaseUrl}assets/maps/`)
      ),
      true
    );
  } finally {
    global.fetch = originalFetch;
  }
});

test("ui contract modules export the reserve contract families", async () => {
  const schema = await import("../.test-dist/domain/ui/screen-schema.js");
  const layout = await import("../.test-dist/domain/ui/screen-layout.js");
  const skin = await import("../.test-dist/domain/ui/screen-skin.js");
  const assets = await import("../.test-dist/domain/ui/asset-catalog.js");
  const contract = await import("../.test-dist/domain/ui/ui-screen-contract.js");

  assert.equal(typeof schema.isScreenSchemaComponentKind, "function");
  assert.equal(typeof layout.isScreenLayoutPreset, "function");
  assert.equal(typeof skin.isScreenSkinPreset, "function");
  assert.equal(typeof assets.isUiAssetCatalog, "function");
  assert.equal(typeof contract.createEmptyResolvedScreenContract, "function");
});

test("ui asset resolver prefers higher-priority layered aliases", async () => {
  const { resolveUiAssetAlias } = await import(
    "../.test-dist/application/ui/ui-asset-resolver.js"
  );

  const resolved = resolveUiAssetAlias("ui.button.start.default", {
    builtin: { "ui.button.start.default": "/builtin/start.png" },
    pack: { "ui.button.start.default": "/pack/start.png" },
    mod: { "ui.button.start.default": "/mod/start.png" },
    user: { "ui.button.start.default": "/user/start.png" },
  });

  assert.equal(resolved?.url, "/user/start.png");
});

test(
  "ui reserve registry returns builtin-only defaults when no overrides exist",
  async () => {
    const { createUiContractRegistry } = await import(
      "../.test-dist/application/ui/ui-contract-registry.js"
    );

    const registry = createUiContractRegistry({
      builtinSchemasById: {
        "global-hud": { id: "global-hud", version: 1, components: [] },
      },
      builtinLayoutsById: {
        "global-hud": {
          screenId: "global-hud",
          version: 1,
          canvas: { width: 1600, height: 900 },
          components: [],
        },
      },
      builtinSkinsById: {
        "global-hud": {
          screenId: "global-hud",
          version: 1,
          themeId: "builtin",
          components: [],
        },
      },
      builtinAssetCatalogs: [],
    });

    assert.equal(registry.getSchema("global-hud")?.id, "global-hud");
  }
);

test("builtin ui reserve content covers the current layout-editor targets", async () => {
  const { builtinScreenSchemasById } = await import(
    "../.test-dist/content/ui/screen-schemas/builtin-screen-schemas.js"
  );
  const { builtinLayoutPresetsById } = await import(
    "../.test-dist/content/ui/layout-presets/builtin-layout-presets.js"
  );
  const { builtinSkinPresetsById } = await import(
    "../.test-dist/content/ui/skin-presets/builtin-skin-presets.js"
  );

  for (const targetId of [
    "global-hud",
    "start-screen",
    "character-select-screen",
    "character-detail-screen",
  ]) {
    assert.equal(typeof builtinScreenSchemasById[targetId], "object");
    assert.equal(typeof builtinLayoutPresetsById[targetId], "object");
    assert.equal(typeof builtinSkinPresetsById[targetId], "object");
  }
});

test("content pack definition accepts optional ui reserve fields", async () => {
  const source = await fs.promises.readFile(
    path.join(process.cwd(), "src", "domain", "content-pack.ts"),
    "utf8"
  );

  assert.equal(source.includes("uiScreenSchemas"), true);
  assert.equal(source.includes("uiLayouts"), true);
  assert.equal(source.includes("uiSkins"), true);
  assert.equal(source.includes("uiAssetCatalogs"), true);
});

test("content pack definition accepts optional task contribution fields", async () => {
  const source = await fs.promises.readFile(
    path.join(process.cwd(), "src", "domain", "content-pack.ts"),
    "utf8"
  );

  assert.equal(source.includes('import type { TaskDefinition }'), true);
  assert.equal(source.includes("tasks?: TaskDefinition[];"), true);
});

test("content pack loader ignores missing optional ui reserve files", async () => {
  const { loadContentPackFromManifestText } = await import(
    "../.test-dist/application/content/content-pack-loader.js"
  );
  const originalFetch = global.fetch;

  global.fetch = async () => ({
    ok: true,
    json: async () => [],
  });

  try {
    const pack = await loadContentPackFromManifestText(
      JSON.stringify({
        schemaVersion: 1,
        id: "pack.test",
        title: "Pack Test",
        files: { maps: "maps.json" },
      }),
      "file:///virtual/pack.json"
    );

    assert.equal(pack.id, "pack.test");
    assert.equal(pack.uiScreenSchemas == null, true);
    assert.equal(pack.uiLayouts == null, true);
    assert.equal(pack.uiSkins == null, true);
    assert.equal(pack.uiAssetCatalogs == null, true);
  } finally {
    global.fetch = originalFetch;
  }
});

test("content pack loader hydrates optional task contribution files", async () => {
  const { loadContentPackFromManifestText } = await import(
    "../.test-dist/application/content/content-pack-loader.js"
  );
  const originalFetch = global.fetch;
  const expectedTasks = [
    {
      id: "task.pack-test",
      title: "Pack Test Task",
      objectives: [
        {
          id: "report",
          target: 1,
          signalType: "scene.reported",
        },
      ],
    },
  ];

  global.fetch = async (input) => {
    const url = typeof input === "string" ? input : input.url;

    if (url.endsWith("/tasks.json")) {
      return {
        ok: true,
        json: async () => expectedTasks,
      };
    }

    return {
      ok: true,
      json: async () => [],
    };
  };

  try {
    const pack = await loadContentPackFromManifestText(
      JSON.stringify({
        schemaVersion: 1,
        id: "pack.test",
        title: "Pack Test",
        files: { tasks: "tasks.json" },
      }),
      "file:///virtual/pack.json"
    );

    assert.deepEqual(pack.tasks, expectedTasks);
  } finally {
    global.fetch = originalFetch;
  }
});

test("main runtime path does not import the ui reserve registry yet", async () => {
  const source = await fs.promises.readFile(
    path.join(process.cwd(), "src", "main.ts"),
    "utf8"
  );

  assert.equal(source.includes("./application/ui/ui-contract-registry"), false);
});

test(
  "existing layout editor target registry still stays on the current ui-layout path",
  async () => {
    const source = await fs.promises.readFile(
      path.join(
        process.cwd(),
        "src",
        "application",
        "layout-editor",
        "layout-editor-target-registry.ts"
      ),
      "utf8"
    );

    assert.equal(source.includes("../../domain/ui-layout"), true);
  }
);

test(
  "scenario pack loader resolves zhuyuanzhang manifest map asset urls on the real startup path",
  async () => {
    const {
      loadScenarioPackFromUrl,
    } = require("../.test-dist/application/scenario/scenario-pack-loader.js");
    const packRoot = path.join(
      process.cwd(),
      "src",
      "content",
      "scenario-packs",
      "zhuyuanzhang"
    );
    const manifestUrl =
      "https://example.test/content/scenario-packs/zhuyuanzhang/pack.json";
    const packBaseUrl =
      "https://example.test/content/scenario-packs/zhuyuanzhang/";
    const originalFetch = global.fetch;

    global.fetch = async (input) => {
      const url = typeof input === "string" ? input : input.url;
      const relativePath = url.startsWith(packBaseUrl)
        ? url.slice(packBaseUrl.length)
        : null;

      assert.notEqual(relativePath, null, `Unexpected fetch url ${url}`);
      const localPath = path.join(packRoot, relativePath.replaceAll("/", path.sep));

      if (!fs.existsSync(localPath)) {
        return new Response(null, { status: 404 });
      }

      return new Response(fs.readFileSync(localPath, "utf8"), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    };

    try {
      const pack = await loadScenarioPackFromUrl(manifestUrl);
      const yuanmoCampaignMap = pack.maps.find(
        (map) => map.id === "map.yuanmo_campaign"
      );

      assert.ok(yuanmoCampaignMap);
      assert.equal(
        yuanmoCampaignMap.primaryImageUrl,
        `${packBaseUrl}assets/maps/HD.png`
      );
      assert.equal(
        yuanmoCampaignMap.regionOverlayImageUrl,
        `${packBaseUrl}assets/maps/yuanmo-map-regions.png`
      );
      assert.equal(
        yuanmoCampaignMap.layers.every((layer) =>
          layer.imageUrl.startsWith(`${packBaseUrl}assets/maps/`)
        ),
        true
      );
    } finally {
      global.fetch = originalFetch;
    }
  }
);

test(
  "scenario pack loader reserves optional task contribution manifest and validation seams",
  async () => {
    const source = await fs.promises.readFile(
      path.join(
        process.cwd(),
        "src",
        "application",
        "scenario",
        "scenario-pack-loader.ts"
      ),
      "utf8"
    );

    assert.equal(source.includes("tasks?: string;"), true);
    assert.match(source, /value\.tasks != null/);
    assert.match(source, /assertArray\(value\.tasks, "scenario tasks"\)/);
  }
);

test(
  "scenario pack loader accepts browser root-relative manifest urls for built-in JSON starts",
  async () => {
    const {
      loadScenarioPackFromUrl,
    } = require("../.test-dist/application/scenario/scenario-pack-loader.js");
    const packRoot = path.join(
      process.cwd(),
      "src",
      "content",
      "scenario-packs",
      "zhuyuanzhang"
    );
    const manifestUrl = "/scenario-packs/zhuyuanzhang/pack.json";
    const packBaseUrl =
      "https://example.test/scenario-packs/zhuyuanzhang/";
    const originalFetch = global.fetch;
    const originalWindow = global.window;

    global.window = {
      location: {
        href: "https://example.test/game",
      },
    };

    global.fetch = async (input) => {
      const url = typeof input === "string" ? input : input.url;
      if (url === manifestUrl) {
        return new Response(fs.readFileSync(path.join(packRoot, "pack.json"), "utf8"), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      const relativePath = url.startsWith(packBaseUrl)
        ? url.slice(packBaseUrl.length)
        : null;

      assert.notEqual(relativePath, null, `Unexpected fetch url ${url}`);
      const localPath = path.join(packRoot, relativePath.replaceAll("/", path.sep));

      if (!fs.existsSync(localPath)) {
        return new Response(null, { status: 404 });
      }

      return new Response(fs.readFileSync(localPath, "utf8"), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    };

    try {
      const pack = await loadScenarioPackFromUrl(manifestUrl);

      assert.equal(pack.id, "scenario-pack.zhu_yuanzhang.monk_opening");
      assert.equal(pack.scenarioProfile.id, "scenario.zhu_yuanzhang.monk_opening");
      assert.equal(
        pack.maps.some(
          (map) =>
            map.primaryImageUrl === `${packBaseUrl}assets/maps/HD.png`
        ),
        true
      );
    } finally {
      global.fetch = originalFetch;
      global.window = originalWindow;
    }
  }
);

test(
  "scenario pack loader can hydrate a manifest-driven imported pack directory",
  async () => {
    const {
      loadScenarioPackFromFiles,
    } = require("../.test-dist/application/scenario/scenario-pack-loader.js");
    const packRoot = path.join(
      process.cwd(),
      "src",
      "content",
      "scenario-packs",
      "zhuyuanzhang"
    );
    const importedFiles = createImportedScenarioPackFilesFromDisk(
      packRoot,
      "zhuyuanzhang"
    );

    const pack = await loadScenarioPackFromFiles(importedFiles);

    assert.equal(pack.id, "scenario-pack.zhu_yuanzhang.monk_opening");
    assert.equal(
      pack.scenarioProfile.id,
      "scenario.zhu_yuanzhang.monk_opening"
    );
    assert.equal(
      pack.characters.some((character) => character.id === "char.player"),
      true
    );
    assert.equal(
      pack.maps.some(
        (map) =>
          typeof map.primaryImageUrl === "string" &&
          !map.primaryImageUrl.startsWith("./assets/")
      ),
      true
    );
  }
);

test("pack-derived runtime consumers no longer import prototype-world directly", () => {
  const sourceFiles = [
    path.join(
      process.cwd(),
      "src",
      "application",
      "grain-shop",
      "grain-market.ts"
    ),
    path.join(
      process.cwd(),
      "src",
      "application",
      "house-modules",
      "market-house",
      "market-house-house-module.ts"
    ),
    path.join(
      process.cwd(),
      "src",
      "application",
      "house-modules",
      "tea-house",
      "tea-house-house-module.ts"
    ),
    path.join(process.cwd(), "src", "content", "city-scene-mappings.ts"),
  ];

  sourceFiles.forEach((filePath) => {
    const source = fs.readFileSync(filePath, "utf8");
    assert.equal(
      source.includes("prototype-world"),
      false,
      `Expected ${path.relative(process.cwd(), filePath)} to stop importing prototype-world directly.`
    );
  });
});

test("default runtime content loads from the shared base content pack path", async () => {
  const source = fs.readFileSync(
    path.join(
      process.cwd(),
      "src",
      "application",
      "content",
      "default-runtime-content.ts"
    ),
    "utf8"
  );

  assert.equal(
    source.includes("scenario-packs/zhuyuanzhang/cities.json"),
    false,
    "Expected default-runtime-content.ts to stop importing pack JSON tables directly."
  );

  const {
    defaultRuntimeContent,
    loadDefaultRuntimeContent,
  } = require("../.test-dist/application/content/default-runtime-content.js");

  assert.equal(typeof loadDefaultRuntimeContent, "function");

  await withLocalJsonFileFetch(async () => {
    const content = await loadDefaultRuntimeContent();

    assert.equal(content, defaultRuntimeContent);
    assert.equal(
      defaultRuntimeContent.cities.some((city) => city.id === "city.kulan"),
      true
    );
    assert.equal(
      defaultRuntimeContent.houses.some(
        (house) => house.id === "house.kulan.market"
      ),
      true
    );
    assert.equal(
      defaultRuntimeContent.cityNpcPools.some((pool) => pool.cityId === "city.kulan"),
      true
    );
  });
});

test("grain trade succeeds for a valid buy and advances runtime state", () => {
  const state = createStateWithGrainVariables();
  const result = executeGrainTrade(
    state,
    prototypeCharacters,
    playerCharacterId,
    "buy",
    1,
    100
  );

  assert.equal(result.ok, true);
  if (!result.ok) {
    return;
  }

  const playerCharacter = getPlayerCharacter(result.mutation.characterDefinitions);
  assert.equal(playerCharacter.stats.gold, 20);
  assert.equal(
    result.mutation.state.runtime.variables[PLAYER_GRAIN_RUNTIME_KEYS.quantityDou],
    60
  );
  assert.equal(result.mutation.state.runtime.variables[GRAIN_SHOP_VARIABLE_KEYS.food], 0);
  assert.equal(result.mutation.state.runtime.variables[GRAIN_SHOP_VARIABLE_KEYS.time], 2);
});

test("leader residence selector only lists eligible historical visitors in the city", () => {
  const state = createBaseState();
  const options = selectLeaderResidenceOptions(
    state,
    prototypeCharacters,
    leaderResidenceEntry,
    {
      historicalCharacters: prototypeLeaderResidenceHistoricalCharacters,
      historicalCharacterIdByCharacterId: prototypeHistoricalCharacterIdByCharacterId,
    }
  );

  assert.equal(options.length > 0, true);
  assert.equal(
    options.every((option) => {
      const historicalCharacterId =
        prototypeHistoricalCharacterIdByCharacterId[option.characterId];
      if (historicalCharacterId == null) {
        return false;
      }
      const historicalCharacter = prototypeLeaderResidenceHistoricalCharacters.find(
        (characterRecord) => characterRecord.id === historicalCharacterId
      );
      return historicalCharacter?.leaderResidenceProfile?.eligible === true;
    }),
    true
  );
  assert.equal(
    options.some((option) => option.characterId === "char.kulan_lord"),
    false
  );
  assert.equal(
    options.some((option) => option.characterId === "char.kulan_tea_boss"),
    false
  );
  assert.equal(
    options.some((option) => option.characterId === "char.kulan_grain_shopkeeper"),
    false
  );
  assert.equal(
    options.some((option) => option.characterId === "char.kulan_merchant"),
    false
  );

  const liuBowenOption = options.find(
    (option) => option.characterId === "char.kulan_liu_bowen"
  );
  assert.ok(liuBowenOption);
  assert.equal(liuBowenOption.tags.length > 0, true);
});

test("leader residence enter requires a selected character id in runtime variables", () => {
  const state = createBaseState();

  assert.throws(() => {
    leaderResidenceHouseModule.enter({
      gameState: state,
      characterDefinitions: prototypeCharacters,
      houseDefinition: leaderResidenceHouse,
      playerCharacterId,
    });
  }, /pending selected character id/i);
});

test("leader residence interaction flow updates relation and learning skill", () => {
  const selectedCharacterId = "char.kulan_liu_bowen";
  const relationKey = getLeaderResidenceRelationKey(selectedCharacterId);
  const state = {
    ...createBaseState(),
    runtime: {
      ...createBaseState().runtime,
      variables: {
        ...createBaseState().runtime.variables,
        [LEADER_RESIDENCE_VARIABLE_KEYS.pendingCharacterId]: selectedCharacterId,
      },
    },
  };
  const playerBefore = getPlayerCharacter(prototypeCharacters);
  const originalMilitarySkill = playerBefore.skills.military;

  const enterResult = leaderResidenceHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: leaderResidenceHouse,
    playerCharacterId,
  });

  assert.equal(
    enterResult.sessionState?.selectedCharacterId,
    selectedCharacterId
  );

  const greetingResult = leaderResidenceHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: leaderResidenceHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "leader-residence:greeting" },
  });
  assert.equal(greetingResult.gameState.runtime.variables[relationKey], 1);

  const giftResult = leaderResidenceHouseModule.dispatch({
    gameState: greetingResult.gameState,
    characterDefinitions: greetingResult.characterDefinitions,
    houseDefinition: leaderResidenceHouse,
    playerCharacterId,
    sessionState: greetingResult.sessionState,
    request: { type: "action", actionId: "leader-residence:gift" },
  });
  assert.equal(giftResult.gameState.runtime.variables[relationKey], 3);
  assert.equal(giftResult.sessionState?.overlay?.type, "alert");

  const learnResult = leaderResidenceHouseModule.dispatch({
    gameState: giftResult.gameState,
    characterDefinitions: giftResult.characterDefinitions,
    houseDefinition: leaderResidenceHouse,
    playerCharacterId,
    sessionState: giftResult.sessionState,
    request: { type: "action", actionId: "leader-residence:learn" },
  });
  const playerAfter = getPlayerCharacter(learnResult.characterDefinitions);

  assert.equal(playerAfter.skills.military, originalMilitarySkill + 1);
  assert.equal(learnResult.sessionState?.mode, "learning");
  assert.equal(learnResult.sessionState?.overlay?.type, "alert");
});

test("grain trade fails when the player cannot afford the purchase", () => {
  const state = createStateWithGrainVariables();
  const result = executeGrainTrade(
    state,
    prototypeCharacters,
    playerCharacterId,
    "buy",
    2,
    1000
  );

  assert.equal(result.ok, false);
  if (result.ok) {
    return;
  }

  assert.equal(result.errorTitle.length > 0, true);
  assert.equal(result.errorMessage.length > 0, true);
});

test("house enter and leave keep session wiring and interval side effects consistent", () => {
  const state = createBaseState();
  const enterResult = grainShopHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: grainShopHouse,
    playerCharacterId,
  });

  assert.equal(enterResult.sessionState?.dialoguePhase, "greeting");
  assert.equal(enterResult.gameState.runtime.cityMarkets["city.kulan"] != null, true);
  assert.equal(
    enterResult.gameState.runtime.cityMarkets["city.kulan"].shops["grain-shop"] != null,
    true
  );
  assert.deepEqual(enterResult.sideEffects, [
    { type: "stop-interval", intervalId: "grain-shop-accounting" },
  ]);

  const leaveResult = grainShopHouseModule.leave({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
  });

  assert.equal(leaveResult.sessionState, null);
  assert.deepEqual(leaveResult.sideEffects, [
    { type: "stop-interval", intervalId: "grain-shop-accounting" },
  ]);
});

test("keep house starts review meeting at countdown zero and resets to 60 after assignment", () => {
  const state = createBaseState();
  const enterResult = keepHouseHouseModule.enter({
    gameState: {
      ...state,
      runtime: {
        ...state.runtime,
        variables: {
          ...state.runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 0,
        },
      },
    },
    characterDefinitions: prototypeCharacters,
    houseDefinition: keepHouse,
    playerCharacterId,
  });

  assert.equal(enterResult.sessionState?.mode, "meeting");
  assert.equal(enterResult.sessionState?.meetingStage, "intro");

  const contributionResult = keepHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: keepHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-keep-dialogue" },
  });
  assert.equal(contributionResult.sessionState?.meetingStage, "contribution");
  assert.equal(contributionResult.sessionState?.overlay?.type, "alert");

  const praiseResult = keepHouseHouseModule.dispatch({
    gameState: contributionResult.gameState,
    characterDefinitions: contributionResult.characterDefinitions,
    houseDefinition: keepHouse,
    playerCharacterId,
    sessionState: contributionResult.sessionState,
    request: { type: "action", actionId: "close-alert" },
  });
  assert.equal(praiseResult.sessionState?.meetingStage, "praise");

  const strategyResult = keepHouseHouseModule.dispatch({
    gameState: praiseResult.gameState,
    characterDefinitions: praiseResult.characterDefinitions,
    houseDefinition: keepHouse,
    playerCharacterId,
    sessionState: praiseResult.sessionState,
    request: { type: "action", actionId: "advance-keep-dialogue" },
  });
  assert.equal(strategyResult.sessionState?.meetingStage, "strategy");

  const assignTaskResult = keepHouseHouseModule.dispatch({
    gameState: strategyResult.gameState,
    characterDefinitions: strategyResult.characterDefinitions,
    houseDefinition: keepHouse,
    playerCharacterId,
    sessionState: strategyResult.sessionState,
    request: { type: "action", actionId: "advance-keep-dialogue" },
  });
  assert.equal(assignTaskResult.sessionState?.meetingStage, "assign-task");

  const assignedResult = keepHouseHouseModule.dispatch({
    gameState: assignTaskResult.gameState,
    characterDefinitions: assignTaskResult.characterDefinitions,
    houseDefinition: keepHouse,
    playerCharacterId,
    sessionState: assignTaskResult.sessionState,
    request: { type: "action", actionId: "assign-keep-task:grain-procurement" },
  });

  assert.equal(
    assignedResult.gameState.missions.activeMissionId,
    "mission.keep.grain-procurement"
  );
  assert.equal(assignedResult.gameState.ui.mainHouseMissionText, "采办军粮");
  assert.equal(
    assignedResult.gameState.runtime.variables[KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown],
    60
  );
  assert.equal(assignedResult.gameState.world.schedule.councilDate.day, 1);
  assert.equal(assignedResult.gameState.world.schedule.councilDate.month, 3);
  assert.equal(assignedResult.sessionState?.overlay?.type, "alert");
});

test("keep house review copy resolves from text entries during strategy and assignment flow", () => {
  const state = createBaseState();
  const textEntriesById = {
    "runtime.zhu_yuanzhang.keep.review.intro.001": "自定义评定开场一。",
    "runtime.zhu_yuanzhang.keep.review.intro.002": "自定义评定开场二。",
    "runtime.zhu_yuanzhang.keep.review.praise.none.001": "无人立功，自定义警示。",
    "runtime.zhu_yuanzhang.keep.review.praise.header.001": "主帅先翻阅功簿。",
    "runtime.zhu_yuanzhang.keep.review.praise.rank.001":
      "首功记在{entryName}身上，共{contribution}点。",
    "runtime.zhu_yuanzhang.keep.review.praise.rank.002":
      "次功记在{entryName}身上，共{contribution}点。",
    "runtime.zhu_yuanzhang.keep.review.strategy.001": "自定义军议开场。",
    "runtime.zhu_yuanzhang.keep.review.assign.001": "{playerName}出列听令。",
    "runtime.zhu_yuanzhang.keep.review.assign.002":
      "当前可领差事：{availableTaskList}。",
    "runtime.zhu_yuanzhang.keep.review.assign.003": "领命后立即出发。",
    "runtime.zhu_yuanzhang.keep.review.assignment.order.001":
      "军令已下：{taskTitle}。",
    "runtime.zhu_yuanzhang.keep.review.assignment.overlay.title": "自定义军令下达",
    "runtime.zhu_yuanzhang.keep.review.assignment.overlay.001":
      "先办：{taskBriefing}",
    "runtime.zhu_yuanzhang.keep.review.assignment.overlay.002":
      "自定义提示：评定倒计时重置为 60 天。",
    "test.keep.task.grain.title": "自定义采办军粮",
    "test.keep.task.grain.briefing": "先去自定义粮道点验军粮。",
    "test.keep.task.grain.order.001": "先核对仓册，再放行运粮。",
    "test.keep.task.grain.order.002": "今日只准按自定义粮道规程办事。",
  };
  const activityDefinitionsById = {
    "activity.test.keep.grain-procurement": {
      id: "activity.test.keep.grain-procurement",
      label: "grain procurement test",
      handlerId: "generic.qte",
      houseModuleId: "keep-house",
      taskId: "grain-procurement",
      missionId: "mission.keep.grain-procurement",
      titleTextId: "test.keep.task.grain.title",
      briefingTextId: "test.keep.task.grain.briefing",
      orderLineTextIds: [
        "test.keep.task.grain.order.001",
        "test.keep.task.grain.order.002",
      ],
      keepMinTier: "runner",
    },
  };
  const enterResult = keepHouseHouseModule.enter({
    gameState: {
      ...state,
      runtime: {
        ...state.runtime,
        variables: {
          ...state.runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 0,
        },
      },
    },
    characterDefinitions: prototypeCharacters,
    houseDefinition: keepHouse,
    playerCharacterId,
    activityDefinitionsById,
    textEntriesById,
  });
  assert.deepEqual(enterResult.sessionState?.dialogueLines, [
    "自定义评定开场一。",
    "自定义评定开场二。",
  ]);

  const contributionResult = keepHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: keepHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-keep-dialogue" },
    activityDefinitionsById,
    textEntriesById,
  });
  const praiseResult = keepHouseHouseModule.dispatch({
    gameState: contributionResult.gameState,
    characterDefinitions: contributionResult.characterDefinitions,
    houseDefinition: keepHouse,
    playerCharacterId,
    sessionState: contributionResult.sessionState,
    request: { type: "action", actionId: "close-alert" },
    activityDefinitionsById,
    textEntriesById,
  });
  assert.equal(
    praiseResult.sessionState?.dialogueLines[0],
    "主帅先翻阅功簿。"
  );

  const strategyResult = keepHouseHouseModule.dispatch({
    gameState: praiseResult.gameState,
    characterDefinitions: praiseResult.characterDefinitions,
    houseDefinition: keepHouse,
    playerCharacterId,
    sessionState: praiseResult.sessionState,
    request: { type: "action", actionId: "advance-keep-dialogue" },
    activityDefinitionsById,
    textEntriesById,
  });
  assert.equal(
    strategyResult.sessionState?.dialogueLines[0],
    "自定义军议开场。"
  );

  const assignTaskResult = keepHouseHouseModule.dispatch({
    gameState: strategyResult.gameState,
    characterDefinitions: strategyResult.characterDefinitions,
    houseDefinition: keepHouse,
    playerCharacterId,
    sessionState: strategyResult.sessionState,
    request: { type: "action", actionId: "advance-keep-dialogue" },
    activityDefinitionsById,
    textEntriesById,
  });
  assert.deepEqual(assignTaskResult.sessionState?.dialogueLines, [
    "朱元璋出列听令。",
    "当前可领差事：自定义采办军粮。",
    "领命后立即出发。",
  ]);

  const assignedResult = keepHouseHouseModule.dispatch({
    gameState: assignTaskResult.gameState,
    characterDefinitions: assignTaskResult.characterDefinitions,
    houseDefinition: keepHouse,
    playerCharacterId,
    sessionState: assignTaskResult.sessionState,
    request: { type: "action", actionId: "assign-keep-task:grain-procurement" },
    activityDefinitionsById,
    textEntriesById,
  });

  assert.deepEqual(assignedResult.sessionState?.dialogueLines, [
    "先核对仓册，再放行运粮。",
    "今日只准按自定义粮道规程办事。",
    "军令已下：自定义采办军粮。",
  ]);
  assert.equal(assignedResult.sessionState?.overlay?.title, "自定义军令下达");
  assert.deepEqual(assignedResult.sessionState?.overlay?.paragraphs, [
    "先办：先去自定义粮道点验军粮。",
    "自定义提示：评定倒计时重置为 60 天。",
  ]);
});

test("keep house audience and late-review copy resolves from text entries", () => {
  const audienceTextEntries = {
    "runtime.zhu_yuanzhang.keep.audience.greeting.001": "自定义觐见招呼一。",
    "runtime.zhu_yuanzhang.keep.audience.greeting.002": "自定义觐见招呼二。",
    "runtime.zhu_yuanzhang.keep.audience.open.001": "自定义觐见开口一。",
    "runtime.zhu_yuanzhang.keep.audience.open.002": "自定义觐见开口二。",
  };
  const audienceEnterResult = keepHouseHouseModule.enter({
    gameState: withCouncilInDays(createBaseState(), 30),
    characterDefinitions: prototypeCharacters,
    houseDefinition: keepHouse,
    playerCharacterId,
    textEntriesById: audienceTextEntries,
  });

  assert.deepEqual(audienceEnterResult.sessionState?.dialogueLines, [
    "自定义觐见招呼一。",
    "自定义觐见招呼二。",
  ]);

  const audienceOpenResult = keepHouseHouseModule.dispatch({
    gameState: audienceEnterResult.gameState,
    characterDefinitions: audienceEnterResult.characterDefinitions,
    houseDefinition: keepHouse,
    playerCharacterId,
    sessionState: audienceEnterResult.sessionState,
    request: { type: "action", actionId: "advance-keep-dialogue" },
    textEntriesById: audienceTextEntries,
  });

  assert.deepEqual(audienceOpenResult.sessionState?.dialogueLines, [
    "自定义觐见开口一。",
    "自定义觐见开口二。",
  ]);

  const lateMeetingTextEntries = {
    "runtime.zhu_yuanzhang.keep.review.late.light.001": "自定义轻度迟到一。",
    "runtime.zhu_yuanzhang.keep.review.late.light.002": "自定义轻度迟到 {lateDays} 天。",
    "runtime.zhu_yuanzhang.keep.review.late.light.003":
      "自定义轻度扣除 {contributionPenalty} 点。",
  };
  const lateMeetingEnterResult = keepHouseHouseModule.enter({
    gameState: withCouncilInDays(createBaseState(), -2),
    characterDefinitions: prototypeCharacters,
    houseDefinition: keepHouse,
    playerCharacterId,
    textEntriesById: lateMeetingTextEntries,
  });

  assert.deepEqual(lateMeetingEnterResult.sessionState?.dialogueLines, [
    "自定义轻度迟到一。",
    "自定义轻度迟到 2 天。",
    "自定义轻度扣除 4 点。",
  ]);

  const expelledTextEntries = {
    "runtime.zhu_yuanzhang.keep.review.expulsion.001": "自定义逐出开场。",
    "runtime.zhu_yuanzhang.keep.review.expulsion.002": "自定义逐出迟到 {lateDays} 天。",
    "runtime.zhu_yuanzhang.keep.review.expulsion.003":
      "自定义逐出扣除 {contributionPenalty} 点。",
    "runtime.zhu_yuanzhang.keep.review.late.heavy.001": "自定义逐出开场。",
    "runtime.zhu_yuanzhang.keep.review.late.heavy.002": "自定义逐出迟到 {lateDays} 天。",
    "runtime.zhu_yuanzhang.keep.review.late.heavy.003":
      "自定义逐出扣除 {contributionPenalty} 点。",
  };
  const expelledEnterResult = keepHouseHouseModule.enter({
    gameState: withCouncilInDays(createBaseState(), -6),
    characterDefinitions: prototypeCharacters,
    houseDefinition: keepHouse,
    playerCharacterId,
    textEntriesById: expelledTextEntries,
  });

  assert.deepEqual(expelledEnterResult.sessionState?.dialogueLines, [
    "自定义逐出开场。",
    "自定义逐出迟到 6 天。",
    "自定义逐出扣除 12 点。",
  ]);
});

test("keep house review module no longer keeps core assignment prose inline", () => {
  const source = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/application/house-modules/keep-house/keep-house-house-module.ts"
    ),
    "utf8"
  );
  const forbiddenStrings = [
    "（抬了抬手）示意你上前。",
    "“有话就说，军中事务不喜拖沓。”",
    "（翻着案上的军报）仍分出神来看了你一眼。",
    "“军情、粮道、市面，凡是看见的，都可以报上来。”",
    "（端坐主位）厅中诸将已经依次列坐。",
    "“评定已到，今日先报功过，再定今后的方针与差事。”",
    "（冷冷看了你一眼）堂中气氛一下子沉了下去。",
    "“评定拖了{lateDays}天才来，军中不养散漫之人。”",
    "“功劳先削去{contributionPenalty}点。从今日起，你不再算我营中之人。”",
    "郭子兴展开舆图，手指城中仓廪与市集。",
    "自己选一件，领了就立刻去办。",
    "“${taskDefinition.title}这件事，就由你去办。”",
    "本次评定结束，下一次评定倒计时已重置为 60 天。",
  ];

  assert.deepEqual(
    forbiddenStrings.filter((entry) => source.includes(entry)),
    []
  );
});

test("story-stage access keeps leader residence entry visible in monk stage", () => {
  const monkState = createMonkStageState();
  const monkCharacters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
  );
  const monkKeepHouse = prototypeHouses.find(
    (houseDefinition) => houseDefinition.id === "house.kulan.keep"
  );
  const monkTempleHouse = prototypeHouses.find(
    (houseDefinition) => houseDefinition.id === "house.kulan.temple"
  );

  assert.ok(homeHouse);
  assert.ok(leaderResidenceHouse);
  assert.ok(monkKeepHouse);
  assert.ok(monkTempleHouse);

  assert.equal(
    isHouseVisibleForStoryStage(monkState, monkCharacters, homeHouse),
    false
  );
  assert.equal(
    isHouseVisibleForStoryStage(monkState, monkCharacters, leaderResidenceHouse),
    true
  );
  assert.equal(
    isCityEntryVisibleForStoryStage(monkState, leaderResidenceEntry),
    true
  );
  assert.equal(
    isHouseVisibleForStoryStage(monkState, monkCharacters, monkKeepHouse),
    true
  );
  assert.equal(
    canEnterHouseForStoryStage(monkState, monkCharacters, monkKeepHouse),
    true
  );
  assert.equal(
    isHouseVisibleForStoryStage(monkState, monkCharacters, monkTempleHouse),
    true
  );
  assert.equal(
    canEnterHouseForStoryStage(monkState, monkCharacters, monkTempleHouse),
    true
  );
});

test("house access refusal blocks leaving temple before first review", () => {
  const monkState = createMonkStageState();
  const monkCharacters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
  );
  const monkGrainShop = prototypeHouses.find(
    (houseDefinition) => houseDefinition.id === "house.kulan.grain_shop"
  );
  const monkTempleHouse = prototypeHouses.find(
    (houseDefinition) => houseDefinition.id === "house.kulan.temple"
  );

  assert.ok(monkGrainShop);
  assert.ok(monkTempleHouse);

  const grainShopAccess = selectHouseEntryAccess(
    monkState,
    monkCharacters,
    monkGrainShop,
    prototypeHouseAccessRefusalRules
  );
  const templeAccess = selectHouseEntryAccess(
    monkState,
    monkCharacters,
    monkTempleHouse,
    prototypeHouseAccessRefusalRules
  );

  assert.equal(grainShopAccess.canEnter, false);
  assert.equal(grainShopAccess.refusal?.speakerCharacterId, "char.player");
  assert.equal(
    grainShopAccess.refusal?.text,
    "既然答应了主持，就先不要离开寺院吧。"
  );
  assert.equal(templeAccess.canEnter, true);
});

test("house access refusal shows guard dialogue for keep during monk stage", () => {
  const monkState = {
    ...createMonkStageState(),
    runtime: {
      ...createMonkStageState().runtime,
      flags: {
        ...createMonkStageState().runtime.flags,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted]: true,
      },
    },
  };
  const monkCharacters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
  );
  const monkKeepHouse = prototypeHouses.find(
    (houseDefinition) => houseDefinition.id === "house.kulan.keep"
  );

  assert.ok(monkKeepHouse);

  const keepAccess = selectHouseEntryAccess(
    monkState,
    monkCharacters,
    monkKeepHouse,
    prototypeHouseAccessRefusalRules
  );

  assert.equal(keepAccess.canEnter, false);
  assert.equal(keepAccess.refusal?.speakerCharacterId, "char.kulan_soldier");
  assert.equal(keepAccess.refusal?.text, "军机要出，请阁下回避。");
});

test("keep house stays in audience mode during monk stage even when review countdown is zero", () => {
  const monkCharacters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
  );
  const enterResult = keepHouseHouseModule.enter({
    gameState: {
      ...createMonkStageState(),
      runtime: {
        ...createMonkStageState().runtime,
        flags: {
          ...createMonkStageState().runtime.flags,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked]: true,
        },
        variables: {
          ...createMonkStageState().runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 0,
        },
      },
    },
    characterDefinitions: monkCharacters,
    houseDefinition: keepHouse,
    playerCharacterId,
  });

  assert.equal(enterResult.sessionState?.mode, "audience");
  assert.equal(enterResult.sessionState?.meetingStage, "finished");
});

test("keep house dismiss turns lord into idle roster actor that can reopen dialogue", () => {
  const enterResult = keepHouseHouseModule.enter({
    gameState: {
      ...createBaseState(),
      runtime: {
        ...createBaseState().runtime,
        variables: {
          ...createBaseState().runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 30,
        },
      },
    },
    characterDefinitions: prototypeCharacters,
    houseDefinition: keepHouse,
    playerCharacterId,
  });

  const openResult = keepHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: keepHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-keep-dialogue" },
  });

  const idleResult = keepHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: keepHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "dismiss-dialogue" },
  });

  const idleViewModel = keepHouseHouseModule.selectViewModel({
    gameState: idleResult.gameState,
    characterDefinitions: idleResult.characterDefinitions,
    houseDefinition: keepHouse,
    playerCharacterId,
    sessionState: idleResult.sessionState,
  });

  assert.equal(idleResult.sessionState?.dialoguePhase, "idle");
  assert.equal(idleViewModel.dialogue, null);
  assert.equal(idleViewModel.actionContainer, null);
  assert.equal(idleViewModel.standbyRoster.length, 1);
  assert.equal(idleViewModel.standbyRoster[0]?.characterId, "char.kulan_lord");
  assert.equal(idleViewModel.standbyRoster[0]?.actionId, "open-lord-dialogue");
});

test("temple house review only selects work direction and daily actions start temple chores later", () => {
  const monkCharacters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
  );
  const enterResult = templeHouseHouseModule.enter({
    gameState: {
      ...createMonkStageState(),
      runtime: {
        ...createMonkStageState().runtime,
        variables: {
          ...createMonkStageState().runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 0,
        },
      },
    },
    characterDefinitions: monkCharacters,
    houseDefinition: templeHouse,
    playerCharacterId,
  });

  assert.equal(enterResult.sessionState?.mode, "meeting");
  assert.equal(enterResult.sessionState?.meetingStage, "intro");

  const contributionResult = templeHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-temple-dialogue" },
  });
  assert.equal(contributionResult.sessionState?.meetingStage, "contribution");
  assert.equal(contributionResult.sessionState?.overlay?.type, "alert");

  const praiseResult = templeHouseHouseModule.dispatch({
    gameState: contributionResult.gameState,
    characterDefinitions: contributionResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: contributionResult.sessionState,
    request: { type: "action", actionId: "close-temple-overlay" },
  });
  assert.equal(praiseResult.sessionState?.meetingStage, "praise");

  const policyResult = templeHouseHouseModule.dispatch({
    gameState: praiseResult.gameState,
    characterDefinitions: praiseResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: praiseResult.sessionState,
    request: { type: "action", actionId: "advance-temple-dialogue" },
  });
  assert.equal(policyResult.sessionState?.meetingStage, "policy");

  const assignDutyResult = templeHouseHouseModule.dispatch({
    gameState: policyResult.gameState,
    characterDefinitions: policyResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: policyResult.sessionState,
    request: { type: "action", actionId: "advance-temple-dialogue" },
  });
  assert.equal(assignDutyResult.sessionState?.meetingStage, "assign-duty");

  const assignedResult = templeHouseHouseModule.dispatch({
    gameState: assignDutyResult.gameState,
    characterDefinitions: assignDutyResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: assignDutyResult.sessionState,
    request: { type: "action", actionId: "select-review-work:temple-help" },
  });

  assert.equal(
    assignedResult.gameState.missions.activeMissionId,
    null
  );
  assert.equal(
    assignedResult.gameState.runtime.variables[KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown],
    30
  );
  assert.equal(
    assignedResult.gameState.runtime.variables[
      TEMPLE_HOUSE_VARIABLE_KEYS.currentWorkPlan
    ],
    "temple-help"
  );
  assert.equal(assignedResult.gameState.world.schedule.councilDate.day, 1);
  assert.equal(assignedResult.gameState.world.schedule.councilDate.month, 2);
  assert.equal(assignedResult.sessionState?.mode, "daily");
  assert.equal(assignedResult.sessionState?.overlay?.type, "alert");

  const closeReviewResult = templeHouseHouseModule.dispatch({
    gameState: assignedResult.gameState,
    characterDefinitions: assignedResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: assignedResult.sessionState,
    request: { type: "action", actionId: "close-temple-overlay" },
  });
  const dailyViewModel = templeHouseHouseModule.selectViewModel({
    gameState: closeReviewResult.gameState,
    characterDefinitions: closeReviewResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: closeReviewResult.sessionState,
  });

  assert.equal(closeReviewResult.sessionState?.dialoguePhase, "idle");
  assert.equal(dailyViewModel.actionContainer, null);
  assert.equal(
    dailyViewModel.standbyRoster.find(
      (actor) => actor.characterId === "char.kulan_temple_abbot"
    )?.actionId,
    "open-abbot-dialogue"
  );
  const reopenResult = templeHouseHouseModule.dispatch({
    gameState: closeReviewResult.gameState,
    characterDefinitions: closeReviewResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: closeReviewResult.sessionState,
    request: { type: "action", actionId: "open-abbot-dialogue" },
  });
  const reopenedViewModel = templeHouseHouseModule.selectViewModel({
    gameState: reopenResult.gameState,
    characterDefinitions: reopenResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: reopenResult.sessionState,
  });
  assert.deepEqual(
    reopenedViewModel.actionContainer?.actions.map((action) => action.id),
    [
      "open-temple-work-menu",
      "open-temple-rest-menu",
      "ask-fortune",
      "open-donate",
      "dismiss-dialogue",
    ]
  );
  const openWorkMenuResult = templeHouseHouseModule.dispatch({
    gameState: reopenResult.gameState,
    characterDefinitions: reopenResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: reopenResult.sessionState,
    request: { type: "action", actionId: "open-temple-work-menu" },
  });
  const workMenuViewModel = templeHouseHouseModule.selectViewModel({
    gameState: openWorkMenuResult.gameState,
    characterDefinitions: openWorkMenuResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: openWorkMenuResult.sessionState,
  });
  assert.deepEqual(
    workMenuViewModel.actionContainer?.actions.map((action) => action.id),
    [
      "assign-temple-task:copy-scripture",
      "assign-temple-task:sweep-courtyard",
      "assign-temple-task:carry-water",
      "close-temple-work-menu",
    ]
  );
});

test("temple house review copy resolves from text entries during work-plan assignment", () => {
  const monkState = createMonkStageState();
  const monkCharacters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
  );
  const textEntriesById = {
    "runtime.zhu_yuanzhang.temple.review.intro.001": "自定义寺评开场一。",
    "runtime.zhu_yuanzhang.temple.review.intro.002": "自定义寺评开场二。",
    "runtime.zhu_yuanzhang.temple.review.assignment.indoor.001": "自定义寺内差事说明一。",
    "runtime.zhu_yuanzhang.temple.review.assignment.indoor.002": "自定义寺内差事说明二。",
    "runtime.zhu_yuanzhang.temple.review.assignment.overlay.title": "自定义本轮差事已定",
    "runtime.zhu_yuanzhang.temple.review.assignment.overlay.indoor.001":
      "自定义寺内帮忙总结。",
    "runtime.zhu_yuanzhang.temple.review.assignment.overlay.shared.001":
      "自定义寺中评定结束提示。",
    "test.temple.task.copy.title": "自定义抄录经卷",
    "test.temple.task.copy.briefing": "今日先按自定义经卷目录抄录。",
    "test.temple.task.copy.order.001": "先净手，再依自定义次序展卷。",
    "test.temple.task.copy.order.002": "抄完后把自定义册页送回偏殿。",
  };
  const activityDefinitionsById = {
    "activity.test.temple.copy-scripture": {
      id: "activity.test.temple.copy-scripture",
      label: "copy scripture test",
      handlerId: "generic.qte",
      houseModuleId: "temple-house",
      taskId: "copy-scripture",
      missionId: "mission.temple.copy-scripture",
      titleTextId: "test.temple.task.copy.title",
      briefingTextId: "test.temple.task.copy.briefing",
      orderLineTextIds: [
        "test.temple.task.copy.order.001",
        "test.temple.task.copy.order.002",
      ],
    },
    "activity.test.temple.sweep-courtyard": {
      id: "activity.test.temple.sweep-courtyard",
      label: "sweep courtyard test",
      handlerId: "generic.qte",
      houseModuleId: "temple-house",
      taskId: "sweep-courtyard",
      missionId: "mission.temple.sweep-courtyard",
      titleTextId: "test.temple.task.copy.title",
      briefingTextId: "test.temple.task.copy.briefing",
      orderLineTextIds: [
        "test.temple.task.copy.order.001",
        "test.temple.task.copy.order.002",
      ],
    },
    "activity.test.temple.carry-water": {
      id: "activity.test.temple.carry-water",
      label: "carry water test",
      handlerId: "generic.qte",
      houseModuleId: "temple-house",
      taskId: "carry-water",
      missionId: "mission.temple.carry-water",
      titleTextId: "test.temple.task.copy.title",
      briefingTextId: "test.temple.task.copy.briefing",
      orderLineTextIds: [
        "test.temple.task.copy.order.001",
        "test.temple.task.copy.order.002",
      ],
    },
  };
  const enterResult = templeHouseHouseModule.enter({
    gameState: {
      ...monkState,
      runtime: {
        ...monkState.runtime,
        variables: {
          ...monkState.runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 0,
        },
      },
    },
    characterDefinitions: monkCharacters,
    houseDefinition: templeHouse,
    playerCharacterId,
    activityDefinitionsById,
    textEntriesById,
  });
  assert.deepEqual(enterResult.sessionState?.dialogueLines, [
    "自定义寺评开场一。",
    "自定义寺评开场二。",
  ]);

  const contributionResult = templeHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-temple-dialogue" },
    activityDefinitionsById,
    textEntriesById,
  });
  const praiseResult = templeHouseHouseModule.dispatch({
    gameState: contributionResult.gameState,
    characterDefinitions: contributionResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: contributionResult.sessionState,
    request: { type: "action", actionId: "close-temple-overlay" },
    activityDefinitionsById,
    textEntriesById,
  });
  const policyResult = templeHouseHouseModule.dispatch({
    gameState: praiseResult.gameState,
    characterDefinitions: praiseResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: praiseResult.sessionState,
    request: { type: "action", actionId: "advance-temple-dialogue" },
    activityDefinitionsById,
    textEntriesById,
  });
  const assignDutyResult = templeHouseHouseModule.dispatch({
    gameState: policyResult.gameState,
    characterDefinitions: policyResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: policyResult.sessionState,
    request: { type: "action", actionId: "advance-temple-dialogue" },
    activityDefinitionsById,
    textEntriesById,
  });

  const assignedResult = templeHouseHouseModule.dispatch({
    gameState: assignDutyResult.gameState,
    characterDefinitions: assignDutyResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: assignDutyResult.sessionState,
    request: { type: "action", actionId: "select-review-work:temple-help" },
    activityDefinitionsById,
    textEntriesById,
  });

  assert.deepEqual(assignedResult.sessionState?.dialogueLines, [
    "自定义寺内差事说明一。",
    "自定义寺内差事说明二。",
  ]);
  assert.equal(assignedResult.sessionState?.overlay?.title, "自定义本轮差事已定");
  assert.deepEqual(assignedResult.sessionState?.overlay?.paragraphs, [
    "自定义寺内帮忙总结。",
    "自定义寺中评定结束提示。",
  ]);

  const reopenResult = templeHouseHouseModule.dispatch({
    gameState: assignedResult.gameState,
    characterDefinitions: assignedResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: {
      ...assignedResult.sessionState,
      overlay: null,
      dialoguePhase: "open",
      dailyActionPanel: "work",
    },
    request: { type: "action", actionId: "assign-temple-task:copy-scripture" },
    activityDefinitionsById,
    textEntriesById,
  });

  assert.equal(reopenResult.sessionState?.overlay?.type, "activity-confirm");
  assert.deepEqual(reopenResult.sessionState?.overlay?.paragraphs.slice(0, 3), [
    "今日先按自定义经卷目录抄录。",
    "先净手，再依自定义次序展卷。",
    "抄完后把自定义册页送回偏殿。",
  ]);
});

test("temple house greeting, open, beg-alms assignment, and leave refusal resolve from text entries", () => {
  const monkCharacters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
  );
  const greetingTextEntries = {
    "runtime.zhu_yuanzhang.temple.greeting.001": "自定义寺门招呼一。",
    "runtime.zhu_yuanzhang.temple.greeting.002": "自定义寺门招呼二。",
    "runtime.zhu_yuanzhang.temple.open.001": "自定义住持开口一。",
    "runtime.zhu_yuanzhang.temple.open.002": "自定义住持开口二。",
  };
  const audienceState = withCouncilInDays(createMonkStageState(), 30);
  const enterResult = templeHouseHouseModule.enter({
    gameState: audienceState,
    characterDefinitions: monkCharacters,
    houseDefinition: templeHouse,
    playerCharacterId,
    textEntriesById: greetingTextEntries,
  });

  assert.deepEqual(enterResult.sessionState?.dialogueLines, [
    "自定义寺门招呼一。",
    "自定义寺门招呼二。",
  ]);

  const openResult = templeHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "open-abbot-dialogue" },
    textEntriesById: greetingTextEntries,
  });

  assert.deepEqual(openResult.sessionState?.dialogueLines, [
    "自定义住持开口一。",
    "自定义住持开口二。",
  ]);

  const begAlmsTextEntries = {
    "runtime.zhu_yuanzhang.temple.review.intro.001": "自定义寺评开场甲。",
    "runtime.zhu_yuanzhang.temple.review.intro.002": "自定义寺评开场乙。",
    "runtime.zhu_yuanzhang.temple.review.assignment.overlay.title": "自定义化缘安排",
    "runtime.zhu_yuanzhang.temple.review.assignment.overlay.shared.001": "自定义评定结束提示。",
    "runtime.zhu_yuanzhang.temple.review.assignment.beg_alms.default.001":
      "自定义化缘说明一。",
    "runtime.zhu_yuanzhang.temple.review.assignment.beg_alms.default.002":
      "自定义化缘说明二。",
    "runtime.zhu_yuanzhang.temple.review.assignment.overlay.beg_alms.default.001":
      "自定义化缘总结。",
    "runtime.zhu_yuanzhang.temple.leave_refusal.001": "自定义离寺拦截。",
  };
  const begAlmsState = {
    ...createMonkStageState(),
    runtime: {
      ...createMonkStageState().runtime,
      flags: {
        ...createMonkStageState().runtime.flags,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked]: true,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingUnlocked]: true,
      },
      variables: {
        ...createMonkStageState().runtime.variables,
        [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 0,
        [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeContribution]: 30,
        [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeWeek]: 2,
      },
    },
  };
  const reviewEnterResult = templeHouseHouseModule.enter({
    gameState: begAlmsState,
    characterDefinitions: monkCharacters,
    houseDefinition: templeHouse,
    playerCharacterId,
    textEntriesById: begAlmsTextEntries,
  });
  const contributionResult = templeHouseHouseModule.dispatch({
    gameState: reviewEnterResult.gameState,
    characterDefinitions: reviewEnterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: reviewEnterResult.sessionState,
    request: { type: "action", actionId: "advance-temple-dialogue" },
    textEntriesById: begAlmsTextEntries,
  });
  const praiseResult = templeHouseHouseModule.dispatch({
    gameState: contributionResult.gameState,
    characterDefinitions: contributionResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: contributionResult.sessionState,
    request: { type: "action", actionId: "close-temple-overlay" },
    textEntriesById: begAlmsTextEntries,
  });
  const policyResult = templeHouseHouseModule.dispatch({
    gameState: praiseResult.gameState,
    characterDefinitions: praiseResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: praiseResult.sessionState,
    request: { type: "action", actionId: "advance-temple-dialogue" },
    textEntriesById: begAlmsTextEntries,
  });
  const assignDutyResult = templeHouseHouseModule.dispatch({
    gameState: policyResult.gameState,
    characterDefinitions: policyResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: policyResult.sessionState,
    request: { type: "action", actionId: "advance-temple-dialogue" },
    textEntriesById: begAlmsTextEntries,
  });
  const assignedResult = templeHouseHouseModule.dispatch({
    gameState: assignDutyResult.gameState,
    characterDefinitions: assignDutyResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: assignDutyResult.sessionState,
    request: { type: "action", actionId: "select-review-work:beg-alms" },
    textEntriesById: begAlmsTextEntries,
  });

  assert.deepEqual(assignedResult.sessionState?.dialogueLines, [
    "自定义化缘说明一。",
    "自定义化缘说明二。",
  ]);
  assert.equal(assignedResult.sessionState?.overlay?.title, "自定义化缘安排");
  assert.deepEqual(assignedResult.sessionState?.overlay?.paragraphs, [
    "自定义化缘总结。",
    "自定义评定结束提示。",
  ]);

  const leaveResult = templeHouseHouseModule.leave({
    gameState: assignedResult.gameState,
    characterDefinitions: assignedResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: assignedResult.sessionState,
    textEntriesById: begAlmsTextEntries,
  });

  assert.deepEqual(leaveResult.sessionState?.dialogueOverride?.textLines, [
    "自定义离寺拦截。",
  ]);
});

test("temple house rest summary resolves from text entries", () => {
  const monkCharacters = withPlayerStamina(
    createPrototypeCharactersForStoryStage(
      ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
    ),
    60
  );
  const baseState = withCouncilInDays(createMonkStageState(), 30);
  const state = {
    ...baseState,
    currentHouseId: templeHouse.id,
    runtime: {
      ...baseState.runtime,
      flags: {
        ...baseState.runtime.flags,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted]: true,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked]: true,
      },
      variables: {
        ...baseState.runtime.variables,
        [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 30,
        [TEMPLE_HOUSE_VARIABLE_KEYS.currentWorkPlan]: "temple-help",
      },
    },
  };
  const textEntriesById = {
    "runtime.zhu_yuanzhang.temple.rest.summary.days.001":
      "自定义寺中休息 {daysRested} 天，恢复 {totalRecovered} 体力。",
    "runtime.zhu_yuanzhang.temple.rest.summary.current.001":
      "自定义寺中当前体力 {stamina}。",
    "runtime.zhu_yuanzhang.temple.rest.summary.normal.001": "自定义寺中静养总结。",
  };
  const enterResult = templeHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: monkCharacters,
    houseDefinition: templeHouse,
    playerCharacterId,
    textEntriesById,
  });
  const openResult = templeHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "open-abbot-dialogue" },
    textEntriesById,
  });
  const restMenuResult = templeHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "open-temple-rest-menu" },
    textEntriesById,
  });
  const restResult = templeHouseHouseModule.dispatch({
    gameState: restMenuResult.gameState,
    characterDefinitions: restMenuResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: restMenuResult.sessionState,
    request: { type: "action", actionId: "temple-rest-one-day" },
    textEntriesById,
  });

  const autoAdvanceEffect = restResult.sideEffects?.find(
    (sideEffect) => sideEffect.type === "start-map-auto-advance"
  );
  assert.ok(autoAdvanceEffect);
  assert.equal(autoAdvanceEffect.completion?.type, "restore-house-session");
  assert.deepEqual(autoAdvanceEffect.completion?.houseSession?.state.overlay?.paragraphs, [
    "自定义寺中休息 1 天，恢复 12 体力。",
    "自定义寺中当前体力 72。",
    "自定义寺中静养总结。",
  ]);
});

test("temple house review module no longer keeps core assignment prose inline", () => {
  const source = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/application/house-modules/temple-house/temple-house-house-module.ts"
    ),
    "utf8"
  );
  const forbiddenStrings = [
    "（山门风声微动）住持那边已经知道你到了。",
    "“先在寺里安下心，有事再来回禀。”",
    "（抬眼看了看你）像是在等你先开口。",
    "“寺中缺人手，院外也缺口粮。你若有话，现在便说。”",
    "（住持在殿前坐定）寺中诸僧与挂单人都已候在一旁。",
    "“这一轮先看各人做了多少事，再定接下来该守院中还是出外求粮。”",
    "这一轮评定里，方丈还不准你离寺化缘。",
    "先在寺内帮忙积攒贡献，等满三十后再说。",
    "这一轮评定，先以寺内帮忙为主。",
    "评定到此为止，回到寺中事务里，再挑具体杂务去做。",
    "这一轮既准你外出化缘，就别再把脚步困在院里了。",
    "离寺后照着化缘的路数去做，得了米面便尽快带回寺中。",
    "既然答应了主持，就先不要离开寺院吧。",
    "“${taskDefinition.title}这份寺务，就由你去办。”",
    "本次寺中评定结束，下次评定倒计时已重置为 30 天。",
  ];

  assert.deepEqual(
    forbiddenStrings.filter((entry) => source.includes(entry)),
    []
  );
});

test("temple and keep house content files no longer author pack task definitions", () => {
  const templeContentSource = fs.readFileSync(
    path.join(process.cwd(), "src/content/houses/temple-house-content.ts"),
    "utf8"
  );
  const keepContentSource = fs.readFileSync(
    path.join(process.cwd(), "src/content/houses/keep-house-content.ts"),
    "utf8"
  );

  assert.deepEqual(
    [
      "mission.temple.copy-scripture",
      "mission.temple.sweep-courtyard",
      "mission.temple.carry-water",
      "mission.temple.beg-alms",
      "mission.temple.relief-refugees",
      "mission.keep.grain-procurement",
      "mission.keep.market-inspection",
      "mission.keep.militia-drill",
    ].filter(
      (entry) =>
        templeContentSource.includes(entry) || keepContentSource.includes(entry)
    ),
    []
  );
  assert.equal(templeContentSource.trim(), "export {};");
});

test("temple house blocks leaving during first review with player dialogue", () => {
  const monkCharacters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
  );
  const enterResult = templeHouseHouseModule.enter({
    gameState: {
      ...createMonkStageState(),
      runtime: {
        ...createMonkStageState().runtime,
        variables: {
          ...createMonkStageState().runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 0,
        },
      },
    },
    characterDefinitions: monkCharacters,
    houseDefinition: templeHouse,
    playerCharacterId,
  });

  const leaveResult = templeHouseHouseModule.leave({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: {
      ...enterResult.sessionState,
      overlay: {
        type: "alert",
        title: "上期寺中贡献",
        paragraphs: ["1. 觉远：18 点贡献", "2. 朱元璋：0 点贡献"],
        tone: "info",
      },
    },
  });

  assert.deepEqual(leaveResult.navigation, { type: "stay-in-house" });
  assert.equal(leaveResult.sessionState?.overlay, null);
  assert.equal(leaveResult.sessionState?.dialogueOverride?.speakerCharacterId, playerCharacterId);
  assert.deepEqual(leaveResult.sessionState?.dialogueOverride?.textLines, [
    "既然答应了主持，就先不要离开寺院吧。",
  ]);

  const viewModel = templeHouseHouseModule.selectViewModel({
    gameState: leaveResult.gameState,
    characterDefinitions: leaveResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: leaveResult.sessionState,
  });

  assert.equal(viewModel.dialogue?.characterId, playerCharacterId);
  assert.deepEqual(viewModel.dialogue?.textLines, [
    "既然答应了主持，就先不要离开寺院吧。",
  ]);
  assert.equal(
    viewModel.dialogue?.portraitArtClassName,
    "c-temple-house-portrait-art--player"
  );

});

test("temple house only blocks leaving during the first tutorial work period", () => {
  const monkCharacters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
  );
  const baseState = createMonkStageState();
  const firstWorkState = {
    ...baseState,
    runtime: {
      ...baseState.runtime,
      flags: {
        ...baseState.runtime.flags,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted]: true,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleWorkLockCompleted]: false,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked]: true,
      },
      variables: {
        ...baseState.runtime.variables,
        [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 30,
        [TEMPLE_HOUSE_VARIABLE_KEYS.currentWorkPlan]: "temple-help",
      },
    },
  };
  const firstWorkEnterResult = templeHouseHouseModule.enter({
    gameState: firstWorkState,
    characterDefinitions: monkCharacters,
    houseDefinition: templeHouse,
    playerCharacterId,
  });
  const blockedLeaveResult = templeHouseHouseModule.leave({
    gameState: firstWorkEnterResult.gameState,
    characterDefinitions: firstWorkEnterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: firstWorkEnterResult.sessionState,
  });

  assert.deepEqual(blockedLeaveResult.navigation, { type: "stay-in-house" });
  assert.deepEqual(blockedLeaveResult.sessionState?.dialogueOverride?.textLines, [
    "既然答应了主持，就先不要离开寺院吧。",
  ]);

  const nextReviewEnterResult = templeHouseHouseModule.enter({
    gameState: {
      ...firstWorkState,
      runtime: {
        ...firstWorkState.runtime,
        variables: {
          ...firstWorkState.runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 0,
        },
      },
    },
    characterDefinitions: monkCharacters,
    houseDefinition: templeHouse,
    playerCharacterId,
  });

  assert.equal(
    nextReviewEnterResult.gameState.runtime.flags[
      ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleWorkLockCompleted
    ],
    true
  );

  const laterTempleHelpState = {
    ...firstWorkState,
    runtime: {
      ...firstWorkState.runtime,
      flags: {
        ...firstWorkState.runtime.flags,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleWorkLockCompleted]: true,
      },
    },
  };
  const laterEnterResult = templeHouseHouseModule.enter({
    gameState: laterTempleHelpState,
    characterDefinitions: monkCharacters,
    houseDefinition: templeHouse,
    playerCharacterId,
  });
  const allowedLeaveResult = templeHouseHouseModule.leave({
    gameState: laterEnterResult.gameState,
    characterDefinitions: laterEnterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: laterEnterResult.sessionState,
  });

  assert.equal(allowedLeaveResult.navigation, undefined);
  assert.equal(allowedLeaveResult.sessionState, null);
});

test("temple house unlocked begging is chosen in review and executes later without qte", () => {
  const monkCharacters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
  );
  const baseState = createMonkStageState();
  const enterResult = templeHouseHouseModule.enter({
    gameState: {
      ...baseState,
      runtime: {
        ...baseState.runtime,
        flags: {
          ...baseState.runtime.flags,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked]: true,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingUnlocked]: true,
        },
        variables: {
          ...baseState.runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 0,
          [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeContribution]: 30,
          [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeWeek]: 2,
        },
      },
    },
    characterDefinitions: monkCharacters,
    houseDefinition: templeHouse,
    playerCharacterId,
  });

  const contributionResult = templeHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-temple-dialogue" },
  });
  assert.equal(contributionResult.sessionState?.meetingStage, "contribution");
  const praiseResult = templeHouseHouseModule.dispatch({
    gameState: contributionResult.gameState,
    characterDefinitions: contributionResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: contributionResult.sessionState,
    request: { type: "action", actionId: "close-temple-overlay" },
  });
  assert.equal(praiseResult.sessionState?.meetingStage, "praise");
  const policyResult = templeHouseHouseModule.dispatch({
    gameState: praiseResult.gameState,
    characterDefinitions: praiseResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: praiseResult.sessionState,
    request: { type: "action", actionId: "advance-temple-dialogue" },
  });
  const assignDutyResult = templeHouseHouseModule.dispatch({
    gameState: policyResult.gameState,
    characterDefinitions: policyResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: policyResult.sessionState,
    request: { type: "action", actionId: "advance-temple-dialogue" },
  });
  const reviewChoiceResult = templeHouseHouseModule.dispatch({
    gameState: assignDutyResult.gameState,
    characterDefinitions: assignDutyResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: assignDutyResult.sessionState,
    request: { type: "action", actionId: "select-review-work:beg-alms" },
  });
  const closeReviewResult = templeHouseHouseModule.dispatch({
    gameState: reviewChoiceResult.gameState,
    characterDefinitions: reviewChoiceResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: reviewChoiceResult.sessionState,
    request: { type: "action", actionId: "close-temple-overlay" },
  });

  const reopenResult = templeHouseHouseModule.dispatch({
    gameState: closeReviewResult.gameState,
    characterDefinitions: closeReviewResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: closeReviewResult.sessionState,
    request: { type: "action", actionId: "open-abbot-dialogue" },
  });

  const begAlmsResult = templeHouseHouseModule.dispatch({
    gameState: reopenResult.gameState,
    characterDefinitions: reopenResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: reopenResult.sessionState,
    request: { type: "action", actionId: "open-temple-work-menu" },
  });

  const confirmBegAlmsResult = templeHouseHouseModule.dispatch({
    gameState: begAlmsResult.gameState,
    characterDefinitions: begAlmsResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: begAlmsResult.sessionState,
    request: { type: "action", actionId: "assign-temple-task:beg-alms" },
  });

  assert.equal(
    confirmBegAlmsResult.gameState.missions.activeMissionId,
    "mission.temple.beg-alms"
  );
  assert.equal(
    confirmBegAlmsResult.gameState.runtime.variables[TEMPLE_HOUSE_VARIABLE_KEYS.currentWorkPlan],
    "beg-alms"
  );
  assert.equal(
    confirmBegAlmsResult.gameState.runtime.variables[KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown],
    30
  );
  assert.equal(confirmBegAlmsResult.sessionState?.overlay?.type, "activity-confirm");
});

test("temple house daily flow resolves fortune and donation through unified state", () => {
  const wealthyCharacters = prototypeCharacters.map((characterDefinition) =>
    characterDefinition.id !== playerCharacterId
      ? characterDefinition
      : {
          ...characterDefinition,
          stats: {
            ...characterDefinition.stats,
            gold: 500,
          },
        }
  );
  const enterResult = templeHouseHouseModule.enter({
    gameState: createBaseState(),
    characterDefinitions: wealthyCharacters,
    houseDefinition: templeHouse,
    playerCharacterId,
  });

  assert.equal(enterResult.sessionState?.mode, "daily");

  const openResult = templeHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-temple-dialogue" },
  });
  assert.equal(openResult.sessionState?.dialoguePhase, "open");

  const idleResult = templeHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "dismiss-dialogue" },
  });
  const idleViewModel = templeHouseHouseModule.selectViewModel({
    gameState: idleResult.gameState,
    characterDefinitions: idleResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: idleResult.sessionState,
  });

  assert.equal(idleResult.sessionState?.dialoguePhase, "idle");
  assert.equal(idleViewModel.dialogue, null);
  assert.equal(idleViewModel.actionContainer, null);
  assert.equal(
    idleViewModel.standbyRoster.some(
      (actor) => actor.characterId === "char.kulan_temple_abbot"
    ),
    true
  );

  const fortuneResult = templeHouseHouseModule.dispatch({
    gameState: idleResult.gameState,
    characterDefinitions: idleResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: idleResult.sessionState,
    request: { type: "action", actionId: "open-abbot-dialogue" },
  });
  assert.equal(fortuneResult.sessionState?.dialoguePhase, "open");

  const askFortuneResult = templeHouseHouseModule.dispatch({
    gameState: fortuneResult.gameState,
    characterDefinitions: fortuneResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: fortuneResult.sessionState,
    request: { type: "action", actionId: "ask-fortune" },
  });
  assert.equal(askFortuneResult.sessionState?.overlay?.type, "alert");

  const closedFortuneResult = templeHouseHouseModule.dispatch({
    gameState: askFortuneResult.gameState,
    characterDefinitions: askFortuneResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: askFortuneResult.sessionState,
    request: { type: "action", actionId: "close-temple-overlay" },
  });
  assert.equal(closedFortuneResult.sessionState?.overlay, null);

  const donatePromptResult = templeHouseHouseModule.dispatch({
    gameState: closedFortuneResult.gameState,
    characterDefinitions: closedFortuneResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: closedFortuneResult.sessionState,
    request: { type: "action", actionId: "open-donate" },
  });
  assert.equal(donatePromptResult.sessionState?.overlay?.type, "donate-confirm");

  const donatedResult = templeHouseHouseModule.dispatch({
    gameState: donatePromptResult.gameState,
    characterDefinitions: donatePromptResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: donatePromptResult.sessionState,
    request: { type: "action", actionId: "confirm-donate" },
  });

  const playerCharacter = getPlayerCharacter(donatedResult.characterDefinitions);
  assert.equal(playerCharacter.stats.gold, 450);
  assert.equal(
    donatedResult.gameState.runtime.variables[
      TEMPLE_HOUSE_VARIABLE_KEYS.donationTotal
    ],
    50
  );
  assert.equal(donatedResult.sessionState?.overlay?.type, "alert");
});

test("temple house status labels, fortune, and begging submit overlay resolve from text entries", () => {
  const textEntriesById = {
    "runtime.zhu_yuanzhang.temple.scene.monk.subtitle": "自定义皇觉寺副标题。",
    "runtime.zhu_yuanzhang.temple.status.eyebrow": "自定义寺院眉题。",
    "runtime.zhu_yuanzhang.temple.status.title.monk": "自定义寺中标题。",
    "runtime.zhu_yuanzhang.temple.status.subtitle.daily": "自定义住持接待副标题。",
    "runtime.zhu_yuanzhang.temple.status.metric.abbot": "自定义住持称呼",
    "runtime.zhu_yuanzhang.temple.work_plan.beg_alms.default.label": "自定义外出化缘",
    "runtime.zhu_yuanzhang.temple.fortune.upper.title": "自定义上签",
    "runtime.zhu_yuanzhang.temple.fortune.upper.001": "自定义求签首句。",
    "runtime.zhu_yuanzhang.temple.fortune.upper.monk.002": "自定义寺门外应验句。",
    "runtime.zhu_yuanzhang.temple.begging_food.submit.title": "自定义提交化缘粮食",
    "runtime.zhu_yuanzhang.temple.begging_food.submit.001": "自定义交粮说明一。",
    "runtime.zhu_yuanzhang.temple.begging_food.submit.002": "自定义交粮说明二。",
  };
  const gameState = withCouncilInDays(
    {
      ...createMonkStageState(),
      calendar: {
        ...createMonkStageState().calendar,
        day: 2,
      },
      runtime: {
        ...createMonkStageState().runtime,
        flags: {
          ...createMonkStageState().runtime.flags,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted]: true,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked]: true,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingUnlocked]: true,
        },
        variables: {
          ...createMonkStageState().runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 30,
          [TEMPLE_HOUSE_VARIABLE_KEYS.currentWorkPlan]: "beg-alms",
          [PLAYER_GRAIN_RUNTIME_KEYS.quantityDou]: 12,
        },
      },
    },
    30
  );
  const monkCharacters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
  ).map((characterDefinition) =>
    characterDefinition.id !== playerCharacterId
      ? characterDefinition
      : {
          ...characterDefinition,
          stats: {
            ...characterDefinition.stats,
            fame: 0,
          },
        }
  );
  const enterResult = templeHouseHouseModule.enter({
    gameState,
    characterDefinitions: monkCharacters,
    houseDefinition: templeHouse,
    playerCharacterId,
    textEntriesById,
  });
  const viewModel = templeHouseHouseModule.selectViewModel({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    textEntriesById,
  });

  assert.equal(viewModel.sceneSubtitle, "自定义皇觉寺副标题。");
  assert.equal(viewModel.statusCard?.eyebrow, "自定义寺院眉题。");
  assert.equal(viewModel.statusCard?.title, "自定义寺中标题。");
  assert.equal(viewModel.statusCard?.metrics[0]?.label, "自定义住持称呼");
  assert.equal(
    viewModel.statusCard?.metrics.find((metric) => metric.label === "当前差事")
      ?.value,
    "自定义外出化缘"
  );

  const openResult = templeHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "open-abbot-dialogue" },
    textEntriesById,
  });
  const fortuneResult = templeHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "ask-fortune" },
    textEntriesById,
  });

  assert.equal(fortuneResult.sessionState?.overlay?.title, "自定义上签");
  assert.deepEqual(fortuneResult.sessionState?.overlay?.paragraphs, [
    "自定义求签首句。",
    "自定义寺门外应验句。",
  ]);

  const submitOverlayResult = templeHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "submit-temple-begging-food" },
    textEntriesById,
  });
  const submitOverlayViewModel = templeHouseHouseModule.selectViewModel({
    gameState: submitOverlayResult.gameState,
    characterDefinitions: submitOverlayResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: submitOverlayResult.sessionState,
    textEntriesById,
  });

  assert.equal(submitOverlayViewModel.overlay?.title, "自定义提交化缘粮食");
  assert.deepEqual(submitOverlayViewModel.overlay?.paragraphs, [
    "自定义交粮说明一。",
    "自定义交粮说明二。",
  ]);
});

test("home house rest-one-day advances date, restores hp and fatigue, and resets morning", () => {
  const enterResult = homeHouseHouseModule.enter({
    gameState: createBaseState(),
    characterDefinitions: prototypeCharacters,
    houseDefinition: homeHouse,
    playerCharacterId,
  });

  const preparedCharacters = enterResult.characterDefinitions.map((characterDefinition) =>
    characterDefinition.id !== playerCharacterId
      ? characterDefinition
      : {
          ...characterDefinition,
          stamina: 40,
        }
  );
  const preparedState = {
    ...enterResult.gameState,
    world: {
      ...enterResult.gameState.world,
      timeOfDay: "night",
      schedule: {
        councilDate: {
          year: 1567,
          month: 1,
          day: 10,
        },
      },
    },
    runtime: {
      ...enterResult.gameState.runtime,
      variables: {
        ...enterResult.gameState.runtime.variables,
        [HOME_HOUSE_VARIABLE_KEYS.hp]: 50,
        [HOME_HOUSE_VARIABLE_KEYS.maxHp]: 100,
        [HOME_HOUSE_VARIABLE_KEYS.fatigue]: 40,
        [HOME_HOUSE_VARIABLE_KEYS.maxFatigue]: 100,
      },
    },
  };

  const restResult = homeHouseHouseModule.dispatch({
    gameState: preparedState,
    characterDefinitions: preparedCharacters,
    houseDefinition: homeHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: {
      type: "action",
      actionId: "rest-one-day",
    },
  });

  const autoAdvanceEffect = restResult.sideEffects?.find(
    (sideEffect) => sideEffect.type === "start-map-auto-advance"
  );
  assert.ok(autoAdvanceEffect);
  assert.equal(restResult.gameState.calendar.day, 1);
  assert.equal(restResult.gameState.world.timeOfDay, "night");
  assert.equal(autoAdvanceEffect.snapshots.length, 1);

  const finalSnapshot = autoAdvanceEffect.snapshots[0];
  const playerCharacter = getPlayerCharacter(finalSnapshot.characterDefinitions);
  assert.equal(finalSnapshot.gameState.calendar.day, 2);
  assert.equal(finalSnapshot.gameState.world.timeOfDay, "morning");
  assert.equal(
    finalSnapshot.gameState.runtime.variables[HOME_HOUSE_VARIABLE_KEYS.hp] > 50,
    true
  );
  assert.equal(
    finalSnapshot.gameState.runtime.variables[HOME_HOUSE_VARIABLE_KEYS.fatigue] > 40,
    true
  );
  assert.equal(playerCharacter.stamina > 40, true);
  assert.equal(autoAdvanceEffect.completion?.type, "restore-house-session");
  assert.equal(
    autoAdvanceEffect.completion?.houseSession?.state.overlay?.type,
    "alert"
  );
});

test("home house rest-until-council stops at configured council date", () => {
  const enterResult = homeHouseHouseModule.enter({
    gameState: createBaseState(),
    characterDefinitions: prototypeCharacters,
    houseDefinition: homeHouse,
    playerCharacterId,
  });
  const preparedState = {
    ...enterResult.gameState,
    world: {
      ...enterResult.gameState.world,
      schedule: {
        councilDate: {
          year: 1567,
          month: 1,
          day: 3,
        },
      },
    },
  };

  const restResult = homeHouseHouseModule.dispatch({
    gameState: preparedState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: homeHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: {
      type: "action",
      actionId: "rest-until-council",
    },
  });

  const autoAdvanceEffect = restResult.sideEffects?.find(
    (sideEffect) => sideEffect.type === "start-map-auto-advance"
  );
  assert.ok(autoAdvanceEffect);
  assert.equal(restResult.gameState.calendar.day, 1);
  assert.equal(autoAdvanceEffect.snapshots.length, 2);

  const finalSnapshot = autoAdvanceEffect.snapshots.at(-1);
  assert.equal(finalSnapshot.gameState.calendar.day, 3);
  assert.equal(finalSnapshot.gameState.ui.reviewDateText, "今日评定");
  assert.equal(autoAdvanceEffect.completion?.type, "restore-house-session");
  const completionOverlay =
    autoAdvanceEffect.completion?.houseSession?.state.overlay;
  assert.equal(completionOverlay?.type, "alert");
  if (completionOverlay?.type !== "alert") {
    return;
  }

  assert.equal(
    completionOverlay.paragraphs.some((paragraph) => paragraph.includes("评定")),
    true
  );
});

test("home house rest summary resolves from text entries", () => {
  const textEntriesById = {
    "runtime.zhu_yuanzhang.home.rest.summary.days.001": "自定义居家静养 {daysRested} 日。",
    "runtime.zhu_yuanzhang.home.rest.summary.recovery.001":
      "自定义恢复 HP {recoveredHp} / 疲劳 {recoveredFatigue}。",
    "runtime.zhu_yuanzhang.home.rest.summary.current.001":
      "自定义当前体力 {stamina}，HP {currentHp}/{maxHp}。",
    "runtime.zhu_yuanzhang.home.rest.summary.normal.001": "自定义静养总结。",
  };
  const enterResult = homeHouseHouseModule.enter({
    gameState: withCouncilInDays(createBaseState(), 30),
    characterDefinitions: prototypeCharacters,
    houseDefinition: homeHouse,
    playerCharacterId,
    textEntriesById,
  });
  const preparedCharacters = enterResult.characterDefinitions.map((characterDefinition) =>
    characterDefinition.id !== playerCharacterId
      ? characterDefinition
      : {
          ...characterDefinition,
          stamina: 40,
        }
  );
  const preparedState = {
    ...enterResult.gameState,
    runtime: {
      ...enterResult.gameState.runtime,
      variables: {
        ...enterResult.gameState.runtime.variables,
        [HOME_HOUSE_VARIABLE_KEYS.hp]: 50,
        [HOME_HOUSE_VARIABLE_KEYS.maxHp]: 100,
        [HOME_HOUSE_VARIABLE_KEYS.fatigue]: 40,
        [HOME_HOUSE_VARIABLE_KEYS.maxFatigue]: 100,
      },
    },
  };

  const restResult = homeHouseHouseModule.dispatch({
    gameState: preparedState,
    characterDefinitions: preparedCharacters,
    houseDefinition: homeHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "rest-one-day" },
    textEntriesById,
  });

  const autoAdvanceEffect = restResult.sideEffects?.find(
    (sideEffect) => sideEffect.type === "start-map-auto-advance"
  );
  assert.ok(autoAdvanceEffect);
  assert.equal(autoAdvanceEffect.completion?.type, "restore-house-session");
  assert.deepEqual(autoAdvanceEffect.completion?.houseSession?.state.overlay?.paragraphs, [
    "自定义居家静养 1 日。",
    "自定义恢复 HP 10 / 疲劳 12。",
    "自定义当前体力 52，HP 60/100。",
    "自定义静养总结。",
  ]);
});

test("grain shop trade overlay reads buy and sell price from unified city market", () => {
  const enterResult = grainShopHouseModule.enter({
    gameState: createBaseState(),
    characterDefinitions: prototypeCharacters,
    houseDefinition: grainShopHouse,
    playerCharacterId,
  });

  const openBuy = grainShopHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "buy" },
  });
  const openSell = grainShopHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "sell" },
  });

  assert.equal(openBuy.sessionState?.overlay?.type, "trade");
  assert.equal(openSell.sessionState?.overlay?.type, "trade");
  if (openBuy.sessionState?.overlay?.type !== "trade") {
    return;
  }
  if (openSell.sessionState?.overlay?.type !== "trade") {
    return;
  }

  assert.equal(openBuy.sessionState.overlay.mode, "buy");
  assert.equal(openSell.sessionState.overlay.mode, "sell");
  assert.equal(
    openBuy.sessionState.overlay.grainPrice >= openSell.sessionState.overlay.grainPrice,
    true
  );
});

test("grain shop greeting and investigate copy resolve from text entries", () => {
  const textEntriesById = {
    "runtime.zhu_yuanzhang.grain_shop.greeting.001": "自定义粮铺招呼一。",
    "runtime.zhu_yuanzhang.grain_shop.greeting.002": "自定义粮铺招呼一。",
    "runtime.zhu_yuanzhang.grain_shop.greeting.003": "自定义粮铺招呼一。",
    "runtime.zhu_yuanzhang.grain_shop.greeting.004": "自定义粮铺招呼一。",
    "runtime.zhu_yuanzhang.grain_shop.default.001": "自定义粮铺常规招呼。",
    "runtime.zhu_yuanzhang.grain_shop.default.002": "自定义粮铺常规招呼。",
    "runtime.zhu_yuanzhang.grain_shop.default.003": "自定义粮铺常规招呼。",
    "runtime.zhu_yuanzhang.grain_shop.default.004": "自定义粮铺常规招呼。",
    "runtime.zhu_yuanzhang.grain_market.rumor.001": "自定义粮市传闻。",
    "runtime.zhu_yuanzhang.grain_market.rumor.002": "自定义粮市传闻。",
    "runtime.zhu_yuanzhang.grain_market.rumor.003": "自定义粮市传闻。",
    "runtime.zhu_yuanzhang.grain_market.rumor.004": "自定义粮市传闻。",
    "runtime.zhu_yuanzhang.grain_market.investigate.high": "自定义粮价看涨。",
    "runtime.zhu_yuanzhang.grain_market.investigate.low": "自定义粮价走低。",
    "runtime.zhu_yuanzhang.grain_market.investigate.neutral": "自定义粮价平稳。",
  };

  const enterResult = grainShopHouseModule.enter({
    gameState: createBaseState(),
    characterDefinitions: prototypeCharacters,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    textEntriesById,
  });

  assert.equal(enterResult.sessionState?.npcGreeting, "自定义粮铺招呼一。");
  assert.equal(enterResult.sessionState?.npcDefaultLine, "自定义粮铺常规招呼。");

  const investigateResult = grainShopHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "investigate" },
    textEntriesById,
  });

  assert.equal(investigateResult.sessionState?.overlay?.type, "alert");
  const investigatedPrice =
    enterResult.gameState.runtime.variables[GRAIN_SHOP_VARIABLE_KEYS.grainPrice];
  const expectedInvestigateLine =
    investigatedPrice > 130
      ? "自定义粮价看涨。"
      : investigatedPrice < 100
        ? "自定义粮价走低。"
        : "自定义粮价平稳。";
  assert.deepEqual(investigateResult.sessionState?.overlay?.paragraphs, [
    expectedInvestigateLine,
    "传闻：自定义粮市传闻。",
    `当前粮价约为每石 ${investigatedPrice} 文。`,
  ]);
});

test("grain market and grain shop content no longer keep core greeting and rumor prose inline", () => {
  const grainMarketSource = fs.readFileSync(
    path.join(process.cwd(), "src/application/grain-shop/grain-market.ts"),
    "utf8"
  );
  const grainShopContentSource = fs.readFileSync(
    path.join(process.cwd(), "src/content/houses/grain-shop-content.ts"),
    "utf8"
  );

  assert.deepEqual(
    [
      "近来粮价怕是要涨。",
      "粮价还算平稳。",
      "濠州粮价上涨。",
      "做生意，算盘得快。",
    ].filter(
      (entry) =>
        grainMarketSource.includes(entry) || grainShopContentSource.includes(entry)
    ),
    []
  );
});

test("grain shop council-date refusal and sold-out copy resolve from text entries", () => {
  const blockedEntries = {
    "runtime.zhu_yuanzhang.grain_shop.accounting.blocked_by_council.title":
      "自定义时日不够",
    "runtime.zhu_yuanzhang.grain_shop.accounting.blocked_by_council.expired.001":
      "自定义掌柜把账册按回去了。",
    "runtime.zhu_yuanzhang.grain_shop.accounting.blocked_by_council.expired.002":
      "自定义评定已到，这轮账要占 {durationDays} 天。",
    "runtime.zhu_yuanzhang.grain_shop.accounting.blocked_by_council.expired.003":
      "自定义先去评定后再来。",
  };
  const blockedEnter = grainShopHouseModule.enter({
    gameState: withCouncilInDays(createBaseState(), 0),
    characterDefinitions: prototypeCharacters,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    textEntriesById: blockedEntries,
  });
  const blockedResult = grainShopHouseModule.dispatch({
    gameState: blockedEnter.gameState,
    characterDefinitions: blockedEnter.characterDefinitions,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    sessionState: blockedEnter.sessionState,
    request: { type: "action", actionId: "accounting" },
    textEntriesById: blockedEntries,
  });
  assert.equal(blockedResult.sessionState?.overlay?.title, "自定义时日不够");
  assert.deepEqual(blockedResult.sessionState?.overlay?.paragraphs, [
    "自定义掌柜把账册按回去了。",
    "自定义评定已到，这轮账要占 10 天。",
    "自定义先去评定后再来。",
  ]);

  const soldOutEntries = {
    "runtime.zhu_yuanzhang.grain_shop.sold_out.title": "自定义今日无米可买",
    "runtime.zhu_yuanzhang.grain_shop.sold_out.001": "自定义濠州断粮。",
    "runtime.zhu_yuanzhang.grain_shop.sold_out.002": "自定义去外地碰碰运气。",
  };
  const soldOutState = {
    ...createBaseState(),
    runtime: {
      ...createBaseState().runtime,
      variables: {
        ...createBaseState().runtime.variables,
        [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage]:
          ZHU_YUANZHANG_STORY_STAGES.huangjueBeggingJourney,
      },
    },
  };
  const soldOutEnter = grainShopHouseModule.enter({
    gameState: soldOutState,
    characterDefinitions: prototypeCharacters,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    textEntriesById: soldOutEntries,
  });
  const soldOutResult = grainShopHouseModule.dispatch({
    gameState: soldOutEnter.gameState,
    characterDefinitions: soldOutEnter.characterDefinitions,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    sessionState: soldOutEnter.sessionState,
    request: { type: "action", actionId: "buy" },
    textEntriesById: soldOutEntries,
  });
  assert.equal(soldOutResult.sessionState?.overlay?.title, "自定义今日无米可买");
  assert.deepEqual(soldOutResult.sessionState?.overlay?.paragraphs, [
    "自定义濠州断粮。",
    "自定义去外地碰碰运气。",
  ]);
});

test("market house enters through module registry and ensures unified city shop data", () => {
  const state = ensureCityNpcPoolsForCurrentDay(createBaseState(), prototypeCityNpcPools, () => 0.1);
  const enterResult = marketHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: marketHouse,
    playerCharacterId,
  });

  assert.equal(enterResult.sessionState?.dialoguePhase, "greeting");
  assert.equal(enterResult.gameState.runtime.cityMarkets["city.kulan"] != null, true);
  assert.equal(
    enterResult.gameState.runtime.cityMarkets["city.kulan"].shops["grain-shop"] != null,
    true
  );
  assert.equal(
    enterResult.gameState.runtime.cityMarkets["city.kulan"].shops["silk-shop"] != null,
    true
  );

  const viewModel = marketHouseHouseModule.selectViewModel({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
  });

  assert.equal(viewModel.moduleId, "market-house");
  assert.equal(viewModel.sceneTitle, "货栈");
  assert.equal(viewModel.sceneTitle.length > 0, true);
});

test("market house inventory excludes grain and horse goods", () => {
  const state = ensureCityNpcPoolsForCurrentDay(createBaseState(), prototypeCityNpcPools, () => 0.1);
  const enterResult = marketHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: marketHouse,
    playerCharacterId,
  });

  const openResult = marketHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: {
      type: "action",
      actionId: "advance-greeting",
    },
  });

  const overlayResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: {
      type: "action",
      actionId: "buy-goods",
    },
  });

  const overlayViewModel = marketHouseHouseModule.selectViewModel({
    gameState: overlayResult.gameState,
    characterDefinitions: overlayResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: overlayResult.sessionState,
  });

  assert.equal(overlayViewModel.overlay?.type, "market-trade");
  if (overlayViewModel.overlay?.type !== "market-trade") {
    return;
  }

  assert.equal(
    overlayViewModel.overlay.rows.some(
      (row) => row.categoryLabel === "粮食" || row.categoryLabel === "马匹"
    ),
    false
  );
});

test("market house follows greeting open idle rhythm with fixed boss and guest roster", () => {
  const state = ensureCityNpcPoolsForCurrentDay(createBaseState(), prototypeCityNpcPools, () => 0.1);
  const enterResult = marketHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: marketHouse,
    playerCharacterId,
  });

  assert.equal(enterResult.sessionState?.selectedActorId, "shopkeeper_qian");
  assert.equal(enterResult.sessionState?.guestActorIds.length >= 1, true);

  const openResult = marketHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: {
      type: "action",
      actionId: "advance-greeting",
    },
  });

  assert.equal(openResult.sessionState?.dialoguePhase, "open");
  assert.equal(openResult.sessionState?.dialogueLines[0].includes("货单"), true);

  const idleResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: {
      type: "action",
      actionId: "dismiss-dialogue",
    },
  });

  assert.equal(idleResult.sessionState?.dialoguePhase, "idle");

  const idleViewModel = marketHouseHouseModule.selectViewModel({
    gameState: idleResult.gameState,
    characterDefinitions: idleResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: idleResult.sessionState,
  });

  assert.equal(idleViewModel.dialogue, null);
  assert.equal(idleViewModel.standbyRoster.length >= 2, true);
  assert.equal(idleViewModel.actionContainer, null);
});

test("market house copy resolves from text entries for greeting, open, small talk, and investigate", async () => {
  const state = ensureCityNpcPoolsForCurrentDay(
    createBaseState(),
    prototypeCityNpcPools,
    () => 0.1
  );
  const textEntriesById = {
    "runtime.zhu_yuanzhang.market_house.greeting.001": "自定义货栈开场一。",
    "runtime.zhu_yuanzhang.market_house.greeting.002": "自定义货栈开场二。",
    "runtime.zhu_yuanzhang.market_house.boss_open.001": "自定义掌柜开场一。",
    "runtime.zhu_yuanzhang.market_house.boss_open.002": "自定义掌柜开场二。",
    "runtime.zhu_yuanzhang.market_house.small_talk.001": "自定义货栈闲谈。",
    "runtime.zhu_yuanzhang.market_house.small_talk.002": "自定义货栈闲谈。",
    "runtime.zhu_yuanzhang.market_house.small_talk.003": "自定义货栈闲谈。",
    "runtime.zhu_yuanzhang.market_house.small_talk.004": "自定义货栈闲谈。",
    "runtime.zhu_yuanzhang.market_house.investigate.city.001":
      "{cityName}繁荣 {prosperity}，风险 {danger}。",
    "runtime.zhu_yuanzhang.market_house.investigate.city.002":
      "城中偏好：{specialDemandList}",
    "runtime.zhu_yuanzhang.market_house.investigate.rumor.general.001": "自定义货栈传闻。",
    "runtime.zhu_yuanzhang.market_house.investigate.rumor.grain.001": "自定义货栈传闻。",
    "runtime.zhu_yuanzhang.market_house.investigate.rumor.grain.002": "自定义货栈传闻。",
    "runtime.zhu_yuanzhang.market_house.investigate.rumor.medicine.001": "自定义货栈传闻。",
    "runtime.zhu_yuanzhang.market_house.investigate.rumor.medicine.002": "自定义货栈传闻。",
    "runtime.zhu_yuanzhang.market_house.investigate.rumor.silk.001": "自定义货栈传闻。",
    "runtime.zhu_yuanzhang.market_house.investigate.rumor.silk.002": "自定义货栈传闻。",
    "runtime.zhu_yuanzhang.market_house.investigate.rumor.arms.001": "自定义货栈传闻。",
    "runtime.zhu_yuanzhang.market_house.investigate.rumor.arms.002": "自定义货栈传闻。",
    "runtime.zhu_yuanzhang.market_house.investigate.rumor.horses.001": "自定义货栈传闻。",
    "runtime.zhu_yuanzhang.market_house.investigate.rumor.horses.002": "自定义货栈传闻。",
    "runtime.zhu_yuanzhang.market_house.investigate.rumor.special.001": "自定义货栈传闻。",
    "runtime.zhu_yuanzhang.market_house.investigate.rumor.special.002": "自定义货栈传闻。",
    "runtime.zhu_yuanzhang.market_house.investigate.specialty.trade": "自定义货栈行规。",
    "runtime.zhu_yuanzhang.market_house.investigate.overlay.title": "自定义调查行情",
    "runtime.zhu_yuanzhang.market_house.small_talk.overlay.title": "自定义闲谈",
  };

  const enterResult = marketHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: marketHouse,
    playerCharacterId,
    textEntriesById,
  });

  assert.deepEqual(enterResult.sessionState?.dialogueLines, [
    "自定义货栈开场一。",
    "自定义货栈开场二。",
  ]);

  const openResult = marketHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-greeting" },
    textEntriesById,
  });

  assert.deepEqual(openResult.sessionState?.dialogueLines, [
    "自定义掌柜开场一。",
    "自定义掌柜开场二。",
  ]);

  const smallTalkResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "small-talk" },
    textEntriesById,
  });

  assert.equal(smallTalkResult.sessionState?.overlay?.title, "自定义闲谈");
  assert.equal(
    smallTalkResult.sessionState?.overlay?.paragraphs[0],
    "自定义货栈闲谈。"
  );

  const investigateResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "investigate-market" },
    textEntriesById,
  });
  const runtimeContent = await loadDefaultRuntimeContent();
  const marketCity = runtimeContent.cities.find(
    (cityDefinition) => cityDefinition.id === marketHouse.cityId
  );

  assert.ok(marketCity);

  assert.equal(investigateResult.sessionState?.overlay?.title, "自定义调查行情");
  assert.deepEqual(investigateResult.sessionState?.overlay?.paragraphs, [
    `${marketCity.name}繁荣 ${marketCity.prosperity}，风险 ${marketCity.danger}。`,
    `城中偏好：${marketCity.specialDemand.join(" / ") || "无"}`,
    "自定义货栈传闻。",
    "自定义货栈行规。",
  ]);
});

test("market house runtime and content no longer keep core greeting rumor prose inline", () => {
  const marketHouseRuntimeSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/application/house-modules/market-house/market-house-house-module.ts"
    ),
    "utf8"
  );
  const marketHouseContentSource = fs.readFileSync(
    path.join(process.cwd(), "src/content/houses/market-house-content.ts"),
    "utf8"
  );

  assert.deepEqual(
    [
      "货栈刚开门，南来北往的货都在这里。想跑商，先看准价。",
      "想买想卖都行，先把价看明白，商路上吃亏的都是心急人。",
      "真正的高价，不在货本身，而在遇见识货的人。",
      "最近粮价不太稳定。",
      "最近生意不好做。",
    ].filter(
      (entry) =>
        marketHouseRuntimeSource.includes(entry) ||
        marketHouseContentSource.includes(entry)
    ),
    []
  );
});

test("market house can open trade overlay and execute buy flow", () => {
  const state = ensureCityNpcPoolsForCurrentDay(createBaseState(), prototypeCityNpcPools, () => 0.1);
  const wealthyCharacters = prototypeCharacters.map((characterDefinition) =>
    characterDefinition.id !== playerCharacterId
      ? characterDefinition
      : {
          ...characterDefinition,
          stats: {
            ...characterDefinition.stats,
            gold: 5000,
          },
        }
  );
  const enterResult = marketHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: wealthyCharacters,
    houseDefinition: marketHouse,
    playerCharacterId,
  });

  const openResult = marketHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: {
      type: "action",
      actionId: "advance-greeting",
    },
  });

  const overlayResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: {
      type: "action",
      actionId: "buy-goods",
    },
  });

  assert.equal(overlayResult.sessionState?.overlay?.type, "market-trade");
  if (overlayResult.sessionState?.overlay?.type !== "market-trade") {
    return;
  }

  const goodsId = overlayResult.sessionState.overlay.selectedGoodsId;
  assert.equal(typeof goodsId, "string");

  const overlayViewModel = marketHouseHouseModule.selectViewModel({
    gameState: overlayResult.gameState,
    characterDefinitions: overlayResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: overlayResult.sessionState,
  });

  assert.equal(overlayViewModel.overlay?.type, "market-trade");
  if (overlayViewModel.overlay?.type !== "market-trade") {
    return;
  }
  assert.equal(overlayViewModel.overlay.rows.length > 0, true);

  const buyResult = marketHouseHouseModule.dispatch({
    gameState: overlayResult.gameState,
    characterDefinitions: overlayResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: overlayResult.sessionState,
    request: {
      type: "action",
      actionId: "confirm-trade",
    },
  });

  assert.equal(buyResult.sessionState?.overlay?.type, "alert");
  const playerCharacter = getPlayerCharacter(buyResult.characterDefinitions);
  assert.equal(playerCharacter.stats.gold < 5000, true);
  assert.equal(
    buyResult.gameState.runtime.variables[`var.trade_inventory.${goodsId}`] > 0,
    true
  );
});

test("minigame tick settles into result overlay and applies grade reward", () => {
  const state = createStateWithGrainVariables();
  const startingStamina = getPlayerCharacter(prototypeCharacters).stamina;
  const sessionState = {
    ...createInitialGrainShopSessionState("greeting", "default"),
    overlay: {
      type: "minigame",
      score: 14,
      wrongCount: 0,
      secondsLeft: 1,
      question: {
        bought: 10,
        sold: 4,
        displayedStock: 6,
        isLedgerCorrect: true,
      },
    },
  };

  const result = grainShopHouseModule.dispatch({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    sessionState,
    request: {
      type: "tick",
      tickId: "grain-shop-accounting",
    },
  });

  assert.equal(result.sessionState?.overlay?.type, "result");
  if (result.sessionState?.overlay?.type !== "result") {
    return;
  }

  const reward = accountingGradeRewards.A;
  const playerCharacter = getPlayerCharacter(result.characterDefinitions);
  assert.equal(result.sessionState.overlay.grade, "A");
  assert.equal(playerCharacter.stats.gold, 120 + reward.money);
  assert.equal(
    playerCharacter.stamina,
    startingStamina - ACTIVITY_COMPLETION_STAMINA_COST
  );
  assert.equal(playerCharacter.skills.arithmetic, 1 + reward.math);
  assert.equal(
    result.gameState.runtime.variables[GRAIN_SHOP_VARIABLE_KEYS.relationship],
    reward.relationship
  );
  assert.equal(result.gameState.runtime.variables[GRAIN_SHOP_VARIABLE_KEYS.time], 11);
  assert.deepEqual(result.sideEffects, [
    { type: "stop-interval", intervalId: "grain-shop-accounting" },
  ]);
});

test("grain shop accounting is blocked when stamina is below activity cost", () => {
  const lowStaminaCharacters = withPlayerStamina(
    prototypeCharacters,
    ACTIVITY_COMPLETION_STAMINA_COST - 1
  );
  const result = grainShopHouseModule.dispatch({
    gameState: createStateWithGrainVariables(),
    characterDefinitions: lowStaminaCharacters,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    sessionState: createInitialGrainShopSessionState("open", "default"),
    request: { type: "action", actionId: "accounting" },
  });

  assert.equal(result.sessionState?.overlay?.type, "alert");
  assert.equal(result.sideEffects, undefined);
  assert.equal(
    getPlayerCharacter(result.characterDefinitions).stamina,
    ACTIVITY_COMPLETION_STAMINA_COST - 1
  );
});

test("inventory filtering and equip logic preserve valid selection", () => {
  const visibleBattleCards = getVisibleOwnedCards(
    prototypeCards,
    {
      ownedCardIds: prototypeCards.map((cardDefinition) => cardDefinition.id),
      selectedCardId: prototypeCards[2]?.id ?? null,
    },
    "battle"
  );
  assert.equal(
    resolveSelectedCardId(visibleBattleCards, prototypeCards[2]?.id ?? null),
    prototypeCards[2]?.id ?? null
  );

  const visibleSecretCards = getVisibleOwnedCards(
    prototypeCards,
    {
      ownedCardIds: prototypeCards.map((cardDefinition) => cardDefinition.id),
      selectedCardId: prototypeCards[2]?.id ?? null,
    },
    "secret-technique"
  );
  assert.equal(
    resolveSelectedCardId(visibleSecretCards, prototypeCards[2]?.id ?? null),
    prototypeCards[1]?.id ?? null
  );

  const visibleEquipment = getVisibleValuables(prototypeValuables, "equipment");
  assert.equal(
    resolveSelectedValuableId(visibleEquipment, prototypeValuables[1]?.id ?? null),
    prototypeValuables[1]?.id ?? null
  );

  const equippedInventory = equipValuableItem(
    {
      items: prototypeValuables,
      selectedItemId: null,
      equippedWeaponSet: {
        swordId: null,
        armorId: null,
      },
    },
    prototypeValuables[0].id
  );
  assert.equal(equippedInventory.selectedItemId, prototypeValuables[0].id);
  assert.equal(equippedInventory.equippedWeaponSet.swordId, prototypeValuables[0].id);
  assert.equal(equippedInventory.equippedWeaponSet.armorId, null);
});

test("city npc daily refresh picks weighted locations and stays stable within the same day", () => {
  const residentDefinition = prototypeCityNpcPools[0].residents[0];
  assert.equal(
    pickCityNpcActivityLocation(
      {
        ...residentDefinition,
        activityWeight: { market: 60, tavern: 40 },
      },
      () => 0.1
    ),
    "market"
  );
  assert.equal(
    pickCityNpcActivityLocation(
      {
        ...residentDefinition,
        activityWeight: { market: 60, tavern: 40 },
      },
      () => 0.9
    ),
    "tavern"
  );

  const refreshedState = ensureCityNpcPoolsForCurrentDay(
    createBaseState(),
    prototypeCityNpcPools,
    () => 0.1
  );
  const stableState = ensureCityNpcPoolsForCurrentDay(
    refreshedState,
    prototypeCityNpcPools,
    () => 0.9
  );

  assert.equal(stableState, refreshedState);
  assert.equal(
    refreshedState.runtime.cityNpcPools["city.kulan"].lastRefreshedOn,
    "1567-01-01"
  );
});

test("house city npc selector reads from shared city pool instead of fixed house ownership", () => {
  const state = createBaseState();
  const marketHouse = prototypeHouses.find(
    (houseDefinition) => houseDefinition.id === "house.kulan.market"
  );

  assert.ok(marketHouse);

  const stateWithNpcPool = {
    ...state,
    runtime: {
      ...state.runtime,
      cityNpcPools: {
        "city.kulan": {
          cityId: "city.kulan",
          lastRefreshedOn: "1567-01-01",
          residents: {
            "city-npc.kulan.merchant_zhou": {
              npcId: "city-npc.kulan.merchant_zhou",
              favorability: 0,
              currentLocationId: "market",
            },
            "city-npc.kulan.scholar_he": {
              npcId: "city-npc.kulan.scholar_he",
              favorability: 0,
              currentLocationId: "tea-house",
            },
          },
        },
      },
    },
  };

  const summaries = selectCityNpcSummariesForHouse(
    stateWithNpcPool,
    marketHouse,
    prototypeCityNpcPools
  );

  assert.deepEqual(summaries, [
    {
      id: "city-npc.kulan.merchant_zhou",
      name: "周掌柜",
      title: "盐商",
    },
  ]);
});

test("tea house enter samples up to two city guests plus fixed boss", () => {
  const state = ensureCityNpcPoolsForCurrentDay(createBaseState(), prototypeCityNpcPools, () => 0.1);
  const enterResult = teaHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: teaHouse,
    playerCharacterId,
  });

  assert.ok(enterResult.sessionState);
  assert.equal(enterResult.sessionState.guestNpcIds.length <= 2, true);
  assert.equal(enterResult.sessionState.selectedActorId, "char.kulan_tea_boss");

  const viewModel = teaHouseHouseModule.selectViewModel({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
  });

  assert.equal(viewModel.moduleId, "tea-house");
  assert.equal(viewModel.dialogue?.speakerName, "柳四");
});

test("tea house follows greeting open idle rhythm like grain shop", () => {
  const state = ensureCityNpcPoolsForCurrentDay(createBaseState(), prototypeCityNpcPools, () => 0.1);
  const enterResult = teaHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: teaHouse,
    playerCharacterId,
  });

  assert.equal(enterResult.sessionState?.dialoguePhase, "greeting");

  const openResult = teaHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: {
      type: "action",
      actionId: "advance-greeting",
    },
  });

  assert.equal(openResult.sessionState?.dialoguePhase, "open");

  const idleResult = teaHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: {
      type: "action",
      actionId: "dismiss-dialogue",
    },
  });

  assert.equal(idleResult.sessionState?.dialoguePhase, "idle");

  const idleViewModel = teaHouseHouseModule.selectViewModel({
    gameState: idleResult.gameState,
    characterDefinitions: idleResult.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: idleResult.sessionState,
  });

  assert.equal(idleViewModel.dialogue, null);
  assert.equal(idleViewModel.standbyRoster.length > 0, true);
  assert.equal(idleViewModel.actionContainer, null);
});

test("tea house copy resolves from text entries for greeting talk inquire and stamina refusal", () => {
  const state = ensureCityNpcPoolsForCurrentDay(
    createBaseState(),
    prototypeCityNpcPools,
    () => 0.1
  );
  const textEntriesById = {
    "runtime.zhu_yuanzhang.tea_house.greeting.fixed.001": "自定义茶馆迎客。",
    "runtime.zhu_yuanzhang.tea_house.open.fixed.001": "自定义茶馆开场。",
    "runtime.zhu_yuanzhang.tea_house.dialogue.fixed.001": "自定义茶馆闲谈。",
    "runtime.zhu_yuanzhang.tea_house.dialogue.fixed.002": "自定义茶馆闲谈。",
    "runtime.zhu_yuanzhang.tea_house.dialogue.fixed.003": "自定义茶馆闲谈。",
    "runtime.zhu_yuanzhang.tea_house.dialogue.fixed.004": "自定义茶馆闲谈。",
    "runtime.zhu_yuanzhang.tea_house.dialogue.fixed.005": "自定义茶馆闲谈。",
    "runtime.zhu_yuanzhang.tea_house.intel.fixed.001": "自定义茶馆消息。",
    "runtime.zhu_yuanzhang.tea_house.intel.fixed.002": "自定义茶馆消息。",
    "runtime.zhu_yuanzhang.tea_house.intel.fixed.003": "自定义茶馆消息。",
    "runtime.zhu_yuanzhang.tea_house.intel.fixed.004": "自定义茶馆消息。",
    "runtime.zhu_yuanzhang.tea_house.intel.fixed.005": "自定义茶馆消息。",
    "runtime.zhu_yuanzhang.tea_house.intel.fixed.006": "自定义茶馆消息。",
    "runtime.zhu_yuanzhang.tea_house.talk.overlay.title": "自定义闲谈",
    "runtime.zhu_yuanzhang.tea_house.talk.extra_intel": "自定义闲谈额外情报。",
    "runtime.zhu_yuanzhang.tea_house.inquire.dialogue.001": "（压低声音）{intelLine}",
    "runtime.zhu_yuanzhang.tea_house.inquire.overlay.title": "自定义打听",
    "runtime.zhu_yuanzhang.tea_house.inquire.overlay.001": "自定义打听结果。",
    "runtime.zhu_yuanzhang.tea_house.debate.low_stamina.title": "自定义先缓口气",
    "runtime.zhu_yuanzhang.tea_house.debate.low_stamina.001": "自定义茶馆体力不足。",
    "runtime.zhu_yuanzhang.tea_house.debate.low_stamina.002":
      "体力至少恢复到 {requiredStamina} 点。",
  };

  const enterResult = teaHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: teaHouse,
    playerCharacterId,
    textEntriesById,
  });

  assert.deepEqual(enterResult.sessionState?.dialogueLines, ["自定义茶馆迎客。"]);

  const openResult = teaHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-greeting" },
    textEntriesById,
  });

  assert.deepEqual(openResult.sessionState?.dialogueLines, ["自定义茶馆开场。"]);

  const talkResult = teaHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "talk" },
    textEntriesById,
  });

  assert.equal(talkResult.sessionState?.overlay?.title, "自定义闲谈");
  assert.equal(talkResult.sessionState?.overlay?.paragraphs[0], "自定义茶馆闲谈。");

  const inquireResult = teaHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "inquire" },
    textEntriesById,
  });

  assert.equal(inquireResult.sessionState?.overlay?.title, "自定义打听");
  assert.deepEqual(inquireResult.sessionState?.overlay?.paragraphs.slice(0, 2), [
    "（压低声音）自定义茶馆消息。",
    "自定义打听结果。",
  ]);

  const lowStaminaCharacters = withPlayerStamina(
    prototypeCharacters,
    ACTIVITY_COMPLETION_STAMINA_COST - 1
  );
  const lowStaminaEnter = teaHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: lowStaminaCharacters,
    houseDefinition: teaHouse,
    playerCharacterId,
    textEntriesById,
  });

  const lowStaminaResult = teaHouseHouseModule.dispatch({
    gameState: lowStaminaEnter.gameState,
    characterDefinitions: lowStaminaEnter.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: {
      ...lowStaminaEnter.sessionState,
      dialoguePhase: "open",
    },
    request: { type: "action", actionId: "start-debate" },
    textEntriesById,
  });

  assert.equal(lowStaminaResult.sessionState?.overlay?.title, "自定义先缓口气");
  assert.deepEqual(lowStaminaResult.sessionState?.overlay?.paragraphs, [
    "自定义茶馆体力不足。",
    `体力至少恢复到 ${ACTIVITY_COMPLETION_STAMINA_COST} 点。`,
  ]);
});

test("tea house runtime and content no longer keep core greeting rumor prose inline", () => {
  const teaHouseRuntimeSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/application/house-modules/tea-house/tea-house-house-module.ts"
    ),
    "utf8"
  );
  const teaHouseContentSource = fs.readFileSync(
    path.join(process.cwd(), "src/content/houses/tea-house-content.ts"),
    "utf8"
  );

  assert.deepEqual(
    [
      "最近城里不太安稳。",
      "濠州粮价上涨。",
      "（笑着抬手）请你入座。",
      "这会儿还没什么新鲜消息。",
      "（放下茶盏）示意你出题。",
    ].filter(
      (entry) =>
        teaHouseRuntimeSource.includes(entry) || teaHouseContentSource.includes(entry)
    ),
    []
  );
});

test("tea house debate resolves counters and timeout penalty", () => {
  const roundResult = resolveTeaHouseDebateRound(
    {
      round: 1,
      playerSpirit: 10,
      npcSpirit: 10,
      timeoutCount: 0,
      consecutivePlayerWins: 1,
    },
    "义",
    "利",
    true
  );

  assert.equal(roundResult.winner, "player");
  assert.equal(roundResult.nextState.playerSpirit, 9);
  assert.equal(roundResult.nextState.npcSpirit, 7);
  assert.equal(roundResult.nextState.timeoutCount, 1);
  assert.equal(roundResult.nextState.consecutivePlayerWins, 2);
});

test("tea house ai weights bias topic choice by personality", () => {
  assert.equal(pickTeaHouseAiTopic("精明", () => 0.2), "利");
  assert.equal(pickTeaHouseAiTopic("傲气", () => 0.5), "名");
});

test("tea house debate is blocked when stamina is below activity cost", () => {
  const lowStaminaCharacters = withPlayerStamina(
    prototypeCharacters,
    ACTIVITY_COMPLETION_STAMINA_COST - 1
  );
  const enterResult = teaHouseHouseModule.enter({
    gameState: ensureCityNpcPoolsForCurrentDay(
      withCouncilInDays(createBaseState(), 90),
      prototypeCityNpcPools,
      () => 0.1
    ),
    characterDefinitions: lowStaminaCharacters,
    houseDefinition: teaHouse,
    playerCharacterId,
  });

  const result = teaHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: {
      ...enterResult.sessionState,
      dialoguePhase: "open",
    },
    request: { type: "action", actionId: "start-debate" },
  });

  assert.equal(result.sessionState?.overlay?.type, "alert");
  assert.equal(result.sideEffects, undefined);
});

test("tea house debate spends stamina when settled", () => {
  const startingStamina = getPlayerCharacter(prototypeCharacters).stamina;
  const enterResult = teaHouseHouseModule.enter({
    gameState: ensureCityNpcPoolsForCurrentDay(
      withCouncilInDays(createBaseState(), 200),
      prototypeCityNpcPools,
      () => 0.1
    ),
    characterDefinitions: prototypeCharacters,
    houseDefinition: teaHouse,
    playerCharacterId,
  });
  const startDebate = teaHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: {
      ...enterResult.sessionState,
      dialoguePhase: "open",
    },
    request: { type: "action", actionId: "start-debate" },
  });
  assert.equal(startDebate.sessionState?.overlay?.type, "activity-confirm");

  const confirmedDebate = teaHouseHouseModule.dispatch({
    gameState: startDebate.gameState,
    characterDefinitions: startDebate.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: startDebate.sessionState,
    request: { type: "action", actionId: "confirm-start-debate" },
  });

  const result = teaHouseHouseModule.dispatch({
    gameState: confirmedDebate.gameState,
    characterDefinitions: confirmedDebate.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: {
      ...confirmedDebate.sessionState,
      overlay: {
        ...confirmedDebate.sessionState.overlay,
        npcSpirit: 1,
        plannedNpcTopic: "利",
        selectedPlayerTopic: "义",
      },
    },
    request: { type: "action", actionId: "confirm-debate-topic" },
  });

  assert.equal(result.sessionState?.overlay?.type, "alert");
  assert.equal(
    getPlayerCharacter(result.characterDefinitions).stamina,
    startingStamina - ACTIVITY_COMPLETION_STAMINA_COST
  );
});

test("tavern drink flow spends 100 gold after confirmation", () => {
  const state = createBaseState();
  const enterResult = tavernHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
  });

  const openDrink = tavernHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "order-drink" },
  });

  assert.equal(openDrink.sessionState?.overlay?.type, "drink-confirm");

  const confirmDrink = tavernHouseModule.dispatch({
    gameState: openDrink.gameState,
    characterDefinitions: openDrink.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openDrink.sessionState,
    request: { type: "action", actionId: "confirm-drink" },
  });

  const playerCharacter = getPlayerCharacter(confirmDrink.characterDefinitions);
  assert.equal(playerCharacter.stats.gold, 20);
  assert.equal(confirmDrink.sessionState?.overlay?.type, "alert");
});

test("tavern gamble flow opens structured mahjong table session", () => {
  const state = createBaseState();
  const enterResult = tavernHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
  });

  const openGamble = tavernHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "open-gamble" },
  });

  assert.equal(openGamble.sessionState?.overlay?.type, "gamble-choice");

  const selectShortGamble = tavernHouseModule.dispatch({
    gameState: openGamble.gameState,
    characterDefinitions: openGamble.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openGamble.sessionState,
    request: { type: "action", actionId: "select-gamble-variant:short" },
  });

  assert.equal(selectShortGamble.sessionState?.overlay?.type, "gamble");

  const startGamble = tavernHouseModule.dispatch({
    gameState: selectShortGamble.gameState,
    characterDefinitions: selectShortGamble.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: {
      ...selectShortGamble.sessionState,
      currentWager: 100,
    },
    request: { type: "action", actionId: "confirm-gamble" },
  });

  const playerCharacter = getPlayerCharacter(startGamble.characterDefinitions);
  assert.equal(playerCharacter.stats.gold, 120);
  assert.equal(startGamble.sessionState?.overlay?.type, "gamble-table");
  assert.equal(startGamble.sessionState?.gambleSession?.phase, "betting");
  assert.equal(startGamble.sessionState?.gambleSession?.players[0]?.hand.length, 4);
  assert.equal(startGamble.sessionState?.gambleSession?.wager, 100);
  assert.equal(startGamble.sessionState?.gambleSession?.currentBet, 20);
  assert.equal(startGamble.sessionState?.gambleSession?.pot, 30);
  assert.equal(startGamble.sessionState?.gambleSession?.players[1]?.committed, 10);
  assert.equal(startGamble.sessionState?.gambleSession?.players[2]?.committed, 20);
});

test("tavern gamble start is blocked when stamina is below activity cost", () => {
  const lowStaminaCharacters = withPlayerStamina(
    prototypeCharacters,
    ACTIVITY_COMPLETION_STAMINA_COST - 1
  );
  const enterResult = tavernHouseModule.enter({
    gameState: withCouncilInDays(createBaseState(), 200),
    characterDefinitions: lowStaminaCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
  });
  const openGamble = tavernHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "open-gamble" },
  });
  const selectShortGamble = tavernHouseModule.dispatch({
    gameState: openGamble.gameState,
    characterDefinitions: openGamble.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openGamble.sessionState,
    request: { type: "action", actionId: "select-gamble-variant:short" },
  });

  const result = tavernHouseModule.dispatch({
    gameState: selectShortGamble.gameState,
    characterDefinitions: selectShortGamble.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: {
      ...selectShortGamble.sessionState,
      currentWager: 100,
    },
    request: { type: "action", actionId: "confirm-gamble" },
  });

  assert.equal(result.sessionState?.overlay?.type, "alert");
  assert.equal(result.sessionState?.gambleSession, null);
});

test("tavern gamble settlement spends stamina", () => {
  const startingStamina = getPlayerCharacter(prototypeCharacters).stamina;
  const enterResult = tavernHouseModule.enter({
    gameState: createBaseState(),
    characterDefinitions: prototypeCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
  });
  const openGamble = tavernHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "open-gamble" },
  });
  const selectShortGamble = tavernHouseModule.dispatch({
    gameState: openGamble.gameState,
    characterDefinitions: openGamble.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openGamble.sessionState,
    request: { type: "action", actionId: "select-gamble-variant:short" },
  });
  const startGamble = tavernHouseModule.dispatch({
    gameState: selectShortGamble.gameState,
    characterDefinitions: selectShortGamble.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: {
      ...selectShortGamble.sessionState,
      currentWager: 100,
    },
    request: { type: "action", actionId: "confirm-gamble" },
  });

  const result = tavernHouseModule.dispatch({
    gameState: startGamble.gameState,
    characterDefinitions: startGamble.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: startGamble.sessionState,
    request: { type: "action", actionId: "gamble-settle" },
  });

  assert.equal(result.sessionState?.overlay?.type, "alert");
  assert.equal(
    getPlayerCharacter(result.characterDefinitions).stamina,
    startingStamina - ACTIVITY_COMPLETION_STAMINA_COST
  );
  assert.equal(result.sessionState?.gambleSession, null);
});

test("tavern long gamble starts with personal public tile slots", () => {
  const state = createBaseState();
  const enterResult = tavernHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
  });

  const openGamble = tavernHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "open-gamble" },
  });

  const selectLongGamble = tavernHouseModule.dispatch({
    gameState: openGamble.gameState,
    characterDefinitions: openGamble.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openGamble.sessionState,
    request: { type: "action", actionId: "select-gamble-variant:long" },
  });

  const startGamble = tavernHouseModule.dispatch({
    gameState: selectLongGamble.gameState,
    characterDefinitions: selectLongGamble.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: {
      ...selectLongGamble.sessionState,
      currentWager: 100,
    },
    request: { type: "action", actionId: "confirm-gamble" },
  });

  const session = startGamble.sessionState?.gambleSession;
  assert.equal(session?.variant, "long");
  assert.equal(session?.players[0]?.hand.length, 5);
  assert.equal(session?.players[0]?.publicTileSlots?.length, 9);
  assert.deepEqual(
    session?.players[0]?.publicTileSlots?.map((slot) => slot.tile.kind === "suited" ? `${slot.tile.suit}-${slot.tile.rank}` : slot.tile.kind === "honor" ? slot.tile.honor : slot.tile.flower),
    session?.players[1]?.publicTileSlots?.map((slot) => slot.tile.kind === "suited" ? `${slot.tile.suit}-${slot.tile.rank}` : slot.tile.kind === "honor" ? slot.tile.honor : slot.tile.flower)
  );
  assert.equal(session?.publicTiles.length, 0);
});

test("tavern long gamble human can choose push hu or pass", () => {
  const deck = createTavernMahjongDeck();
  const suited = (suit, rank, count = 1) =>
    deck.filter((tile) => tile.kind === "suited" && tile.suit === suit && tile.rank === rank).slice(0, count);
  const honors = (honor, count = 1) =>
    deck.filter((tile) => tile.kind === "honor" && tile.honor === honor).slice(0, count);
  const eastTiles = honors("east", 3);
  const zhongTiles = honors("zhong", 2);

  const base = createTavernLongGambleSession({
    wager: 100,
    seed: 99,
    playerName: "tester",
  });
  const human = {
    ...base.players[0],
    hand: [suited("wan", 1)[0], suited("wan", 2)[0], suited("wan", 3)[0], suited("tiao", 1)[0], suited("tiao", 2)[0]],
    publicTileSlots: [
      suited("tiao", 3)[0],
      suited("tong", 1)[0],
      suited("tong", 2)[0],
      suited("tong", 3)[0],
      eastTiles[0],
      eastTiles[1],
      eastTiles[2],
      zhongTiles[0],
      zhongTiles[1],
    ].map((tile, index) => ({
      id: `human-public-${index}`,
      tile: { ...tile, id: `human-public-copy-${index}` },
      covered: false,
    })),
  };
  const session = {
    ...base,
    phase: "draw-discard",
    pendingDrawTile: null,
    pendingDiscardsRemaining: 0,
    wall: [suited("wan", 9)[0], suited("tiao", 9)[0], suited("tong", 9)[0]],
    players: [human, ...base.players.slice(1)],
  };

  const drawn = drawForTavernGamble(session);
  assert.equal(drawn.pendingHumanHu, true);

  const passed = passHumanLongHu(drawn);
  assert.equal(passed.pendingHumanHu, false);
  assert.equal(passed.pendingDiscardsRemaining, 3);

  const pushed = pushHumanLongHu(drawn);
  assert.equal(pushed.phase, "finished");
  assert.ok(pushed.showdown);
});

test("tavern long gamble npc no longer auto-plays short groups", () => {
  const deck = createTavernMahjongDeck();
  const suited = (suit, rank, count = 1) =>
    deck.filter((tile) => tile.kind === "suited" && tile.suit === suit && tile.rank === rank).slice(0, count);
  const honors = (honor, count = 1) =>
    deck.filter((tile) => tile.kind === "honor" && tile.honor === honor).slice(0, count);

  const base = createTavernLongGambleSession({
    wager: 100,
    seed: 109,
    playerName: "tester",
  });
  const npc = {
    ...base.players[1],
    hand: [suited("wan", 1)[0], suited("wan", 4)[0], suited("tiao", 6)[0], suited("tong", 9)[0], honors("fa", 1)[0]],
    publicTileSlots: [
      suited("wan", 7)[0],
      suited("wan", 9)[1],
      suited("tiao", 2)[0],
      suited("tiao", 8)[0],
      suited("tong", 1)[1],
      suited("tong", 5)[0],
      honors("east", 1)[0],
      honors("south", 1)[0],
      honors("bai", 1)[0],
    ].map((tile, index) => ({
      id: `npc-public-${index}`,
      tile: { ...tile, id: `npc-public-copy-${index}` },
      covered: false,
    })),
  };
  const session = {
    ...base,
    phase: "npc-thinking",
    npcThinkingSeat: npc.seatIndex,
    npcThinkTicksRemaining: 1,
    wall: [suited("wan", 2)[1], suited("tiao", 7)[1], suited("tong", 8)[1]],
    players: [base.players[0], npc, ...base.players.slice(2)],
  };

  const next = advanceTavernGambleNpcThinking(session);
  const nextNpc = next.players.find((player) => player.id === npc.id);
  assert.ok(nextNpc);
  assert.equal(nextNpc.playedGroups.length, 0);
  assert.equal(next.publicDiscards.length, 3);
});

test("tavern gamble scoring rejects scattered all-big tiles without a complete shape", () => {
  const deck = createTavernMahjongDeck();
  const tilesByKey = (key, count = 1) => {
    const [suit, rankText] = key.split("-");
    const tiles = deck.filter(
      (candidate) =>
        candidate.kind === "suited" &&
        candidate.suit === suit &&
        candidate.rank === Number(rankText)
    );
    assert.equal(tiles.length >= count, true, `missing tile ${key}`);
    return tiles.slice(0, count);
  };
  const tileByKey = (key) => tilesByKey(key)[0];
  const createPlayer = (tiles) => ({
    id: "tester",
    name: "tester",
    isHuman: true,
    seatIndex: 0,
    hand: tiles.slice(0, 4),
    flowers: [],
    discarded: [],
    exposedMelds: [],
    playedGroups: [],
    playedOwnTileCount: 0,
    folded: false,
    committed: 0,
    skipsDraw: false,
  });

  const scattered = [
    "wan-7",
    "tiao-7",
    "wan-8",
    "tong-8",
    "tiao-9",
    "tong-9",
  ].map(tileByKey);
  const scatteredScore = scoreTavernGamblePlayer(
    createPlayer(scattered),
    scattered.slice(4)
  );
  assert.equal(scatteredScore.totalFan, 0);
  assert.equal(scatteredScore.bestScore.validHu, false);

  const shaped = ["wan-7", "wan-8", "wan-9", "tiao-7", "tiao-8", "tiao-9"].map(
    tileByKey
  );
  const shapedScore = scoreTavernGamblePlayer(createPlayer(shaped), shaped.slice(4));
  assert.equal(shapedScore.bestScore.mainPattern, "双顺");
  assert.equal(shapedScore.bestScore.validHu, true);
  assert.equal(
    shapedScore.bestScore.detailLines.some((line) => line.includes("全大+2")),
    true
  );

  const doubleTriplet = [
    ...tilesByKey("wan-7", 3),
    ...tilesByKey("tiao-8", 3),
  ];
  const doubleTripletScore = scoreTavernGamblePlayer(
    createPlayer(doubleTriplet),
    doubleTriplet.slice(4)
  );
  assert.equal(doubleTripletScore.bestScore.mainPattern, "双刻");
  assert.equal(doubleTripletScore.bestScore.validHu, true);
  assert.equal(doubleTripletScore.bestScore.totalFan >= 7, true);

  const stepStraight = [
    ...tilesByKey("wan-1", 1),
    ...tilesByKey("wan-2", 2),
    ...tilesByKey("wan-3", 2),
    ...tilesByKey("wan-4", 1),
  ];
  const stepStraightScore = scoreTavernGamblePlayer(
    createPlayer(stepStraight),
    stepStraight.slice(4)
  );
  assert.equal(stepStraightScore.bestScore.mainPattern, "双顺");
  assert.equal(
    stepStraightScore.bestScore.detailLines.some((line) => line.includes("步步高+4")),
    true
  );

  const playedFirstPlayer = {
    ...createPlayer([
      ...tilesByKey("wan-7", 3),
      ...tilesByKey("tiao-8", 1),
    ]),
    playedGroups: [
      {
        id: "played-you-1",
        kind: "sequence",
        tileLabels: ["1万", "2万", "3万"],
        ownTileCount: 3,
        usesPublicTile: false,
        fan: 1,
      },
      {
        id: "played-you-2",
        kind: "sequence",
        tileLabels: ["4条", "5条", "6条"],
        ownTileCount: 3,
        usesPublicTile: false,
        fan: 1,
      },
    ],
    playedOwnTileCount: 6,
  };
  const playedFirstScore = scoreTavernGamblePlayer(playedFirstPlayer, [
    ...tilesByKey("tiao-8", 2),
    ...tilesByKey("tiao-9", 3),
  ]);

  assert.deepEqual(playedFirstScore.bestScore.selectedTiles, [
    "1万",
    "2万",
    "3万",
    "4条",
    "5条",
    "6条",
  ]);
  assert.equal(playedFirstScore.bestScore.mainPattern, "双顺");
  assert.equal(
    playedFirstScore.bestScore.detailLines.some((line) => line.includes("提前胡+2")),
    true
  );
});

test("tavern gamble played group locks public tiles and still requires discards", () => {
  const deck = createTavernMahjongDeck();
  const takeTiles = (key, count = 1) => {
    const [suit, rankText] = key.split("-");
    const tiles = deck.filter(
      (candidate) =>
        candidate.kind === "suited" &&
        candidate.suit === suit &&
        candidate.rank === Number(rankText)
    );
    assert.equal(tiles.length >= count, true, `missing tile ${key}`);
    return tiles.slice(0, count);
  };
  const [wan1] = takeTiles("wan-1");
  const [wan2] = takeTiles("wan-2");
  const [wan3] = takeTiles("wan-3");
  const [tong5] = takeTiles("tong-5");
  const [tong8] = takeTiles("tong-8");
  const [tiao9] = takeTiles("tiao-9");
  const [wan9] = takeTiles("wan-9");
  const [draw1] = takeTiles("tiao-1");
  const [draw2] = takeTiles("tiao-2");
  const [draw3] = takeTiles("tong-1");
  const [draw4] = takeTiles("tong-2");

  const base = createTavernGambleSession({
    wager: 100,
    seed: 77,
    playerName: "tester",
  });
  const human = {
    ...base.players[0],
    hand: [wan1, wan2, tong5, tong8, tiao9, wan9],
  };
  const session = {
    ...base,
    phase: "draw-discard",
    pendingDrawTile: wan9,
    pendingDiscardsRemaining: 0,
    publicTiles: [wan3],
    wall: [draw1, draw2, draw3, draw4],
    players: [human, ...base.players.slice(1)],
    selectedPlayTileIds: [],
    spentPublicTileIds: [],
  };

  const selected = [wan1.id, wan2.id, wan3.id].reduce(
    (nextSession, tileId) => toggleTavernGamblePlayTile(nextSession, tileId),
    session
  );
  const selectedDespiteGlobalSpent = [wan1.id, wan2.id, wan3.id].reduce(
    (nextSession, tileId) => toggleTavernGamblePlayTile(nextSession, tileId),
    { ...session, spentPublicTileIds: [wan3.id] }
  );

  assert.deepEqual(selectedDespiteGlobalSpent.selectedPlayTileIds, [
    wan1.id,
    wan2.id,
    wan3.id,
  ]);

  const played = confirmTavernGamblePlayGroup(selected);
  const playedHuman = played.players[0];

  assert.deepEqual(played.spentPublicTileIds, []);
  assert.deepEqual(playedHuman.spentPublicTileIds, [wan3.id]);
  assert.equal(playedHuman.playedOwnTileCount, 2);
  assert.equal(playedHuman.playedGroups.length, 1);
  assert.equal(playedHuman.hand.length, 6);
  assert.equal(played.pendingDiscardsRemaining, 2);

  const afterFirstDiscard = discardForTavernGamble(played, playedHuman.hand[0].id);
  const afterSecondDiscardHuman = afterFirstDiscard.players[0];
  const afterSecondDiscard = discardForTavernGamble(
    afterFirstDiscard,
    afterSecondDiscardHuman.hand[0].id
  );

  assert.equal(afterSecondDiscard.players[0].hand.length, 4);
  assert.equal(afterSecondDiscard.pendingDrawTile, null);

  const waitingHuman = {
    ...human,
    hand: [wan1, wan2, tong5, tong8, tiao9, wan9],
    playedGroups: [
      {
        id: "played-you-1",
        kind: "sequence",
        tileLabels: ["1万", "2万", "3万"],
        ownTileCount: 3,
        usesPublicTile: false,
        fan: 1,
      },
    ],
    playedOwnTileCount: 3,
  };
  const secondGroupSession = {
    ...session,
    players: [waitingHuman, ...base.players.slice(1)],
    selectedPlayTileIds: [],
    spentPublicTileIds: [],
  };
  const secondSelected = [wan1.id, wan2.id, wan3.id].reduce(
    (nextSession, tileId) => toggleTavernGamblePlayTile(nextSession, tileId),
    secondGroupSession
  );
  const afterSecondGroup = confirmTavernGamblePlayGroup(secondSelected);

  assert.equal(afterSecondGroup.players[0].playedGroups.length, 2);
  assert.equal(afterSecondGroup.pendingDiscardsRemaining, 0);
  assert.notEqual(afterSecondGroup.phase, "draw-discard");
});

test("tavern gamble opens staged discard response windows", () => {
  const deck = createTavernMahjongDeck();
  const takeTiles = (key, count = 1) => {
    const [suit, rankText] = key.split("-");
    const tiles = deck.filter(
      (candidate) =>
        candidate.kind === "suited" &&
        candidate.suit === suit &&
        candidate.rank === Number(rankText)
    );
    assert.equal(tiles.length >= count, true, `missing tile ${key}`);
    return tiles.slice(0, count);
  };
  const [wan1] = takeTiles("wan-1");
  const [wan2] = takeTiles("wan-2");
  const wan3Tiles = takeTiles("wan-3", 4);
  const [tong5] = takeTiles("tong-5");
  const [wan8] = takeTiles("wan-8");
  const [tiao9] = takeTiles("tiao-9");

  const base = createTavernGambleSession({
    wager: 100,
    seed: 91,
    playerName: "tester",
  });
  const human = {
    ...base.players[0],
    hand: [wan1, wan2, wan3Tiles[1], wan3Tiles[2]],
  };
  const npc = {
    ...base.players[1],
    hand: [wan3Tiles[0], tong5],
  };
  const session = {
    ...base,
    phase: "npc-thinking",
    npcThinkingSeat: npc.seatIndex,
    npcThinkTicksRemaining: 1,
    wall: [wan8, tiao9],
    publicTiles: [],
    publicDiscards: [],
    players: [human, npc, ...base.players.slice(2)],
  };

  const response = advanceTavernGambleNpcThinking(session);
  assert.equal(response.phase, "meld-window");
  assert.equal(response.meldCountdownTicks, 3);
  assert.equal(response.meldWindow?.stage, "chi-pong-kong");
  assert.equal(response.pendingMelds.some((option) => option.kind === "chi"), true);
  assert.equal(response.pendingMelds.some((option) => option.kind === "pong"), true);

  const pongWindow = advanceTavernGambleMeldCountdown(
    advanceTavernGambleMeldCountdown(
      advanceTavernGambleMeldCountdown(response)
    )
  );
  assert.equal(pongWindow.phase, "meld-window");
  assert.equal(pongWindow.meldWindow?.stage, "pong-kong");
  assert.equal(pongWindow.pendingMelds.some((option) => option.kind === "chi"), false);
  assert.equal(pongWindow.pendingMelds.some((option) => option.kind === "pong"), true);
});

test("tavern gamble discard responses can use public tiles with hand tiles", () => {
  const deck = createTavernMahjongDeck();
  const takeTiles = (key, count = 1) => {
    const [suit, rankText] = key.split("-");
    const tiles = deck.filter(
      (candidate) =>
        candidate.kind === "suited" &&
        candidate.suit === suit &&
        candidate.rank === Number(rankText)
    );
    assert.equal(tiles.length >= count, true, `missing tile ${key}`);
    return tiles.slice(0, count);
  };
  const [wan6] = takeTiles("wan-6");
  const [wan7] = takeTiles("wan-7");
  const wan8Tiles = takeTiles("wan-8", 4);
  const [tong5] = takeTiles("tong-5");
  const [tiao9] = takeTiles("tiao-9");
  const base = createTavernGambleSession({
    wager: 100,
    seed: 93,
    playerName: "tester",
  });
  const human = {
    ...base.players[0],
    hand: [wan6, wan8Tiles[1], tong5, tiao9],
  };
  const npc = {
    ...base.players[1],
    hand: [tong5],
    skipsDraw: true,
  };
  const session = {
    ...base,
    phase: "npc-thinking",
    npcThinkingSeat: npc.seatIndex,
    npcThinkTicksRemaining: 1,
    wall: [takeTiles("tong-1")[0], takeTiles("tong-2")[0]],
    publicTiles: [wan7, wan8Tiles[2], wan8Tiles[3]],
    publicDiscards: [wan8Tiles[0]],
    players: [human, npc, ...base.players.slice(2)],
  };

  const response = advanceTavernGambleNpcThinking(session);
  assert.equal(response.phase, "meld-window");
  assert.equal(response.pendingMelds.some((option) => option.kind === "chi"), true);
  assert.equal(response.pendingMelds.some((option) => option.kind === "pong"), true);
  assert.equal(response.pendingMelds.some((option) => option.kind === "public-kong"), true);

  const kongOption = response.pendingMelds.find((option) => option.kind === "public-kong");
  assert.ok(kongOption);
  const declared = declareTavernGambleMeld(response, kongOption.id);
  const declaredHuman = declared.players[0];
  assert.equal(declaredHuman.exposedMelds.some((meld) => meld.kind === "public-kong"), true);
  assert.equal(declaredHuman.spentPublicTileIds.includes(wan8Tiles[2].id), true);
  assert.equal(declaredHuman.spentPublicTileIds.includes(wan8Tiles[3].id), true);
});

test("tavern gamble npc cannot auto-play more than two groups", () => {
  const deck = createTavernMahjongDeck();
  const takeTiles = (key, count = 1) => {
    const [suit, rankText] = key.split("-");
    const tiles = deck.filter(
      (candidate) =>
        candidate.kind === "suited" &&
        candidate.suit === suit &&
        candidate.rank === Number(rankText)
    );
    assert.equal(tiles.length >= count, true, `missing tile ${key}`);
    return tiles.slice(0, count);
  };
  const base = createTavernGambleSession({
    wager: 100,
    seed: 92,
    playerName: "tester",
  });
  const npc = {
    ...base.players[1],
    hand: [
      takeTiles("wan-1")[0],
      takeTiles("wan-2")[0],
      takeTiles("wan-3")[0],
      takeTiles("tiao-1")[0],
    ],
  };
  const session = {
    ...base,
    phase: "npc-thinking",
    npcThinkingSeat: npc.seatIndex,
    npcThinkTicksRemaining: 1,
    wall: [
      takeTiles("tiao-2")[0],
      takeTiles("tiao-3")[0],
      takeTiles("tong-1")[0],
      takeTiles("tong-2")[0],
      takeTiles("tong-3")[0],
      takeTiles("wan-4")[0],
      takeTiles("wan-5")[0],
      takeTiles("wan-6")[0],
    ],
    publicTiles: [
      takeTiles("tong-4")[0],
      takeTiles("tong-5")[0],
      takeTiles("tong-6")[0],
    ],
    players: [base.players[0], npc, ...base.players.slice(2)],
  };

  const next = advanceTavernGambleNpcThinking(session);
  const nextNpc = next.players.find((player) => player.id === npc.id);
  assert.ok(nextNpc);
  assert.equal(nextNpc.playedGroups.length <= 2, true);
});

test("tavern gamble completed player skips later betting and draw actions", () => {
  const base = createTavernGambleSession({
    wager: 100,
    seed: 81,
    playerName: "tester",
  });
  const completedGroup = {
    id: "played-you-1",
    kind: "sequence",
    tileLabels: ["1万", "2万", "3万"],
    ownTileCount: 3,
    usesPublicTile: false,
    fan: 1,
  };
  const completedHuman = {
    ...base.players[0],
    playedGroups: [
      completedGroup,
      {
        ...completedGroup,
        id: "played-you-2",
        tileLabels: ["4万", "5万", "6万"],
      },
    ],
    playedOwnTileCount: 6,
  };

  const bettingSkipped = resolveTavernGambleBettingAction(
    {
      ...base,
      phase: "betting",
      players: [completedHuman, ...base.players.slice(1)],
    },
    "check"
  );

  assert.notEqual(bettingSkipped.phase, "betting");
  assert.equal(bettingSkipped.players[0].playedGroups.length, 2);

  const drawSkipped = drawForTavernGamble({
    ...base,
    phase: "draw-discard",
    pendingDrawTile: null,
    pendingDiscardsRemaining: 0,
    players: [completedHuman, ...base.players.slice(1)],
  });

  assert.notEqual(drawSkipped.phase, "draw-discard");
  assert.equal(drawSkipped.pendingDiscardsRemaining, 0);
  assert.equal(drawSkipped.players[0].playedGroups.length, 2);
});

test("tavern copy resolves from text entries for greeting open and low stamina refusal", () => {
  const textEntriesById = {
    "runtime.zhu_yuanzhang.tavern.greeting.001": "自定义酒馆迎客。",
    "runtime.zhu_yuanzhang.tavern.open.001": "自定义酒馆开场。",
    "runtime.zhu_yuanzhang.tavern.open.002": "自定义酒馆重开。",
    "runtime.zhu_yuanzhang.tavern.low_stamina.title": "自定义先去休息",
    "runtime.zhu_yuanzhang.tavern.low_stamina.001":
      "自定义体力不足：{actionLabel}。",
    "runtime.zhu_yuanzhang.tavern.low_stamina.002":
      "体力至少回到 {requiredStamina} 点。",
  };

  const enterResult = tavernHouseModule.enter({
    gameState: withCouncilInDays(createBaseState(), 200),
    characterDefinitions: prototypeCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
    textEntriesById,
  });

  assert.deepEqual(enterResult.sessionState?.dialogueLines, ["自定义酒馆迎客。"]);

  const openResult = tavernHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-greeting" },
    textEntriesById,
  });

  assert.deepEqual(openResult.sessionState?.dialogueLines, ["自定义酒馆开场。"]);

  const reopenResult = tavernHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: {
      ...openResult.sessionState,
      dialoguePhase: "idle",
    },
    request: { type: "action", actionId: "open-boss-dialogue" },
    textEntriesById,
  });

  assert.deepEqual(reopenResult.sessionState?.dialogueLines, ["自定义酒馆重开。"]);

  const lowStaminaCharacters = withPlayerStamina(
    prototypeCharacters,
    ACTIVITY_COMPLETION_STAMINA_COST - 1
  );
  const lowStaminaEnter = tavernHouseModule.enter({
    gameState: withCouncilInDays(createBaseState(), 200),
    characterDefinitions: lowStaminaCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
    textEntriesById,
  });
  const openWork = tavernHouseModule.dispatch({
    gameState: lowStaminaEnter.gameState,
    characterDefinitions: lowStaminaEnter.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: lowStaminaEnter.sessionState,
    request: { type: "action", actionId: "open-work" },
    textEntriesById,
  });
  const openAccept = tavernHouseModule.dispatch({
    gameState: openWork.gameState,
    characterDefinitions: openWork.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openWork.sessionState,
    request: { type: "action", actionId: "open-work-accept" },
    textEntriesById,
  });
  const lowStaminaResult = tavernHouseModule.dispatch({
    gameState: openAccept.gameState,
    characterDefinitions: openAccept.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openAccept.sessionState,
    request: { type: "action", actionId: "accept-work:offer.kulan.wash_dishes" },
    textEntriesById,
  });

  assert.equal(
    lowStaminaResult.sessionState?.overlay?.title,
    "自定义先去休息"
  );
  assert.deepEqual(lowStaminaResult.sessionState?.overlay?.paragraphs, [
    "自定义体力不足：接活。",
    `体力至少回到 ${ACTIVITY_COMPLETION_STAMINA_COST} 点。`,
  ]);
});

test("tavern runtime and content no longer keep core greeting and stamina prose inline", () => {
  const tavernRuntimeSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/application/house-modules/tavern/tavern-house-module.ts"
    ),
    "utf8"
  );
  const tavernContentSource = fs.readFileSync(
    path.join(process.cwd(), "src/content/houses/tavern-content.ts"),
    "utf8"
  );

  assert.deepEqual(
    [
      "（抬眼看了你一眼）要找活、喝酒，还是上桌赌两把？",
      "（把算盘往旁边一拨）说吧，你今天想干什么？",
      "（站在柜后看着你）酒、活、赌，三样都明码标价。",
      "（摆了摆手）你这会儿脚下都发虚，还想",
    ].filter(
      (entry) =>
        tavernRuntimeSource.includes(entry) || tavernContentSource.includes(entry)
    ),
    []
  );
});

test("tavern copy resolves from text entries for capacity drink gamble and insufficient wager", () => {
  const textEntriesById = {
    "runtime.zhu_yuanzhang.tavern.work.capacity.title": "自定义接活上限",
    "runtime.zhu_yuanzhang.tavern.work.capacity.001":
      "最多同时接 {capacity} 个任务。",
    "runtime.zhu_yuanzhang.tavern.work.capacity.002": "名声更高再来。",
    "runtime.zhu_yuanzhang.tavern.drink.result.title": "自定义喝酒",
    "runtime.zhu_yuanzhang.tavern.drink.result.dialogue.001": "自定义斟酒。",
    "runtime.zhu_yuanzhang.tavern.drink.result.dialogue.002": "自定义松快。",
    "runtime.zhu_yuanzhang.tavern.drink.result.001": "自定义花费 {price} 文。",
    "runtime.zhu_yuanzhang.tavern.drink.result.002": "自定义喝酒结算。",
    "runtime.zhu_yuanzhang.tavern.gamble.start.001": "自定义坐上赌桌。",
    "runtime.zhu_yuanzhang.tavern.gamble.start.002": "自定义赌局开场。",
    "runtime.zhu_yuanzhang.tavern.gamble.settlement.title": "自定义赌局结算",
    "runtime.zhu_yuanzhang.tavern.gamble.settlement.dialogue.loss":
      "自定义本局净输 {amount} 文。",
    "runtime.zhu_yuanzhang.tavern.gamble.settlement.dialogue.win":
      "自定义本局净赚 {amount} 文。",
    "runtime.zhu_yuanzhang.tavern.gamble.settlement.001": "自定义底池 {pot} 文。",
    "runtime.zhu_yuanzhang.tavern.gamble.settlement.delta.loss":
      "自定义金钱变化 {delta} 文。",
    "runtime.zhu_yuanzhang.tavern.gamble.settlement.delta.win":
      "自定义金钱变化 +{delta} 文。",
    "runtime.zhu_yuanzhang.tavern.gamble.settlement.002":
      "自定义体力 -{requiredStamina}",
    "runtime.zhu_yuanzhang.tavern.gamble.insufficient_wager.title":
      "自定义赌本不够",
    "runtime.zhu_yuanzhang.tavern.gamble.insufficient_wager.001":
      "自定义至少要有 {minimumWager} 文。",
    "runtime.zhu_yuanzhang.tavern.gamble.insufficient_wager.002":
      "自定义临到上桌钱不够。",
  };

  const lowFameCharacters = prototypeCharacters.map((characterDefinition) =>
    characterDefinition.id === playerCharacterId
      ? {
          ...characterDefinition,
          stats: {
            ...characterDefinition.stats,
            fame: 0,
          },
        }
      : characterDefinition
  );
  const capacityEnterResult = tavernHouseModule.enter({
    gameState: withCouncilInDays(createBaseState(), 200),
    characterDefinitions: lowFameCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
    textEntriesById,
  });

  const openWork = tavernHouseModule.dispatch({
    gameState: capacityEnterResult.gameState,
    characterDefinitions: capacityEnterResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: capacityEnterResult.sessionState,
    request: { type: "action", actionId: "open-work" },
    textEntriesById,
  });
  const openAccept = tavernHouseModule.dispatch({
    gameState: openWork.gameState,
    characterDefinitions: openWork.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openWork.sessionState,
    request: { type: "action", actionId: "open-work-accept" },
    textEntriesById,
  });
  const acceptWork = tavernHouseModule.dispatch({
    gameState: openAccept.gameState,
    characterDefinitions: openAccept.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openAccept.sessionState,
    request: { type: "action", actionId: "accept-work:offer.kulan.wash_dishes" },
    textEntriesById,
  });
  const confirmedWork = tavernHouseModule.dispatch({
    gameState: acceptWork.gameState,
    characterDefinitions: acceptWork.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: acceptWork.sessionState,
    request: {
      type: "action",
      actionId: "confirm-start-work:offer.kulan.wash_dishes",
    },
    textEntriesById,
  });
  const overCapacity = tavernHouseModule.dispatch({
    gameState: confirmedWork.gameState,
    characterDefinitions: confirmedWork.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: {
      ...confirmedWork.sessionState,
      overlay: null,
      workPanelMode: "accept",
      dialoguePhase: "open",
    },
    request: { type: "action", actionId: "accept-work:offer.kulan.supply_run" },
    textEntriesById,
  });

  assert.equal(overCapacity.sessionState?.overlay?.title, "自定义接活上限");
  assert.deepEqual(overCapacity.sessionState?.overlay?.paragraphs, [
    "最多同时接 1 个任务。",
    "名声更高再来。",
  ]);

  const enterResult = tavernHouseModule.enter({
    gameState: createBaseState(),
    characterDefinitions: prototypeCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
    textEntriesById,
  });

  const openDrink = tavernHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "order-drink" },
    textEntriesById,
  });
  const confirmDrink = tavernHouseModule.dispatch({
    gameState: openDrink.gameState,
    characterDefinitions: openDrink.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openDrink.sessionState,
    request: { type: "action", actionId: "confirm-drink" },
    textEntriesById,
  });

  assert.deepEqual(confirmDrink.sessionState?.dialogueLines, [
    "自定义斟酒。",
    "自定义松快。",
  ]);
  assert.equal(confirmDrink.sessionState?.overlay?.title, "自定义喝酒");
  assert.deepEqual(confirmDrink.sessionState?.overlay?.paragraphs, [
    "自定义花费 100 文。",
    "自定义喝酒结算。",
  ]);

  const openGamble = tavernHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "open-gamble" },
    textEntriesById,
  });
  const selectShortGamble = tavernHouseModule.dispatch({
    gameState: openGamble.gameState,
    characterDefinitions: openGamble.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openGamble.sessionState,
    request: { type: "action", actionId: "select-gamble-variant:short" },
    textEntriesById,
  });
  const startGamble = tavernHouseModule.dispatch({
    gameState: selectShortGamble.gameState,
    characterDefinitions: selectShortGamble.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: {
      ...selectShortGamble.sessionState,
      currentWager: 100,
    },
    request: { type: "action", actionId: "confirm-gamble" },
    textEntriesById,
  });

  assert.deepEqual(startGamble.sessionState?.dialogueLines, [
    "自定义坐上赌桌。",
    "自定义赌局开场。",
  ]);

  const settleGamble = tavernHouseModule.dispatch({
    gameState: startGamble.gameState,
    characterDefinitions: startGamble.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: startGamble.sessionState,
    request: { type: "action", actionId: "gamble-settle" },
    textEntriesById,
  });

  assert.equal(settleGamble.sessionState?.overlay?.title, "自定义赌局结算");
  assert.equal(
    settleGamble.sessionState?.overlay?.paragraphs[0],
    "自定义底池 30 文。"
  );
  assert.equal(
    settleGamble.sessionState?.overlay?.paragraphs[1]?.startsWith("自定义金钱变化 "),
    true
  );
  assert.equal(
    settleGamble.sessionState?.overlay?.paragraphs[2],
    `自定义体力 -${ACTIVITY_COMPLETION_STAMINA_COST}`
  );
  assert.equal(settleGamble.sessionState?.dialogueLines?.[0], "牌局已结。");
  assert.equal(
    settleGamble.sessionState?.dialogueLines?.[1]?.startsWith("自定义本局净"),
    true
  );

  const poorCharacters = prototypeCharacters.map((characterDefinition) =>
    characterDefinition.id === playerCharacterId
      ? {
          ...characterDefinition,
          stats: {
            ...characterDefinition.stats,
            gold: 40,
          },
        }
      : characterDefinition
  );
  const poorEnter = tavernHouseModule.enter({
    gameState: createBaseState(),
    characterDefinitions: poorCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
    textEntriesById,
  });
  const poorOpenGamble = tavernHouseModule.dispatch({
    gameState: poorEnter.gameState,
    characterDefinitions: poorEnter.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: poorEnter.sessionState,
    request: { type: "action", actionId: "open-gamble" },
    textEntriesById,
  });

  assert.equal(
    poorOpenGamble.sessionState?.overlay?.title,
    "自定义赌本不够"
  );
  assert.deepEqual(poorOpenGamble.sessionState?.overlay?.paragraphs, [
    "自定义至少要有 50 文。",
    "自定义临到上桌钱不够。",
  ]);
});

test("tavern runtime no longer keeps drink gamble and work-capacity prose inline", () => {
  const tavernRuntimeSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/application/house-modules/tavern/tavern-house-module.ts"
    ),
    "utf8"
  );

  assert.deepEqual(
    [
      "你当前最多能同时接",
      "名声高了以后，老板才会把更多活交给你。",
      "当前先按单次喝酒状态结算。",
      "你坐上赌桌。",
      "四轮下注、摸打、碰杠之后摊牌比番。",
      "赌局结算",
      "赌本不够",
    ].filter((entry) => tavernRuntimeSource.includes(entry)),
    []
  );
});

test("tavern copy resolves from text entries for work panel and drink prompts", () => {
  const textEntriesById = {
    "runtime.zhu_yuanzhang.tavern.work.main.001": "自定义活计面板。",
    "runtime.zhu_yuanzhang.tavern.work.main.002": "自定义接取或提交说明。",
    "runtime.zhu_yuanzhang.tavern.work.accept.available.001":
      "自定义当前还能接的活。",
    "runtime.zhu_yuanzhang.tavern.work.accept.available.002":
      "自定义前期只接一个。",
    "runtime.zhu_yuanzhang.tavern.work.submit.empty.001": "自定义提交空状态。",
    "runtime.zhu_yuanzhang.tavern.work.submit.empty.002":
      "自定义还没有接下的活。",
    "runtime.zhu_yuanzhang.tavern.drink.confirm.title": "自定义点酒",
    "runtime.zhu_yuanzhang.tavern.drink.confirm.001": "自定义敲酒坛。",
    "runtime.zhu_yuanzhang.tavern.drink.confirm.002":
      "自定义买酒 {price} 文。",
    "runtime.zhu_yuanzhang.tavern.drink.insufficient_money.title":
      "自定义钱不够",
    "runtime.zhu_yuanzhang.tavern.drink.insufficient_money.001":
      "自定义摸钱袋。",
    "runtime.zhu_yuanzhang.tavern.drink.insufficient_money.002":
      "自定义现在喝不起。",
  };

  const enterResult = tavernHouseModule.enter({
    gameState: createBaseState(),
    characterDefinitions: prototypeCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
    textEntriesById,
  });

  const openWork = tavernHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "open-work" },
    textEntriesById,
  });

  assert.deepEqual(openWork.sessionState?.dialogueLines, [
    "自定义活计面板。",
    "自定义接取或提交说明。",
  ]);

  const openAccept = tavernHouseModule.dispatch({
    gameState: openWork.gameState,
    characterDefinitions: openWork.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openWork.sessionState,
    request: { type: "action", actionId: "open-work-accept" },
    textEntriesById,
  });

  assert.deepEqual(openAccept.sessionState?.dialogueLines, [
    "自定义当前还能接的活。",
    "自定义前期只接一个。",
  ]);

  const openSubmit = tavernHouseModule.dispatch({
    gameState: openWork.gameState,
    characterDefinitions: openWork.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openWork.sessionState,
    request: { type: "action", actionId: "open-work-submit" },
    textEntriesById,
  });

  assert.deepEqual(openSubmit.sessionState?.dialogueLines, [
    "自定义提交空状态。",
    "自定义还没有接下的活。",
  ]);

  const openDrink = tavernHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "order-drink" },
    textEntriesById,
  });

  assert.equal(openDrink.sessionState?.overlay?.title, "自定义点酒");
  assert.deepEqual(openDrink.sessionState?.overlay?.paragraphs, [
    "自定义敲酒坛。",
    "自定义买酒 100 文。",
  ]);

  const poorCharacters = prototypeCharacters.map((characterDefinition) =>
    characterDefinition.id === playerCharacterId
      ? {
          ...characterDefinition,
          stats: {
            ...characterDefinition.stats,
            gold: 10,
          },
        }
      : characterDefinition
  );
  const poorEnter = tavernHouseModule.enter({
    gameState: createBaseState(),
    characterDefinitions: poorCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
    textEntriesById,
  });
  const poorOpenDrink = tavernHouseModule.dispatch({
    gameState: poorEnter.gameState,
    characterDefinitions: poorEnter.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: poorEnter.sessionState,
    request: { type: "action", actionId: "order-drink" },
    textEntriesById,
  });
  const poorConfirmDrink = tavernHouseModule.dispatch({
    gameState: poorOpenDrink.gameState,
    characterDefinitions: poorOpenDrink.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: poorOpenDrink.sessionState,
    request: { type: "action", actionId: "confirm-drink" },
    textEntriesById,
  });

  assert.equal(
    poorConfirmDrink.sessionState?.overlay?.title,
    "自定义钱不够"
  );
  assert.deepEqual(poorConfirmDrink.sessionState?.overlay?.paragraphs, [
    "自定义摸钱袋。",
    "自定义现在喝不起。",
  ]);
});

test("tavern work council-date refusal resolves from text entries", () => {
  const textEntriesById = {
    "runtime.zhu_yuanzhang.tavern.work.blocked_by_council.title": "自定义时日不够",
    "runtime.zhu_yuanzhang.tavern.work.blocked_by_council.expired.001":
      "自定义酒馆评定已到，{offerTitle} 要占 {durationDays} 天。",
    "runtime.zhu_yuanzhang.tavern.work.blocked_by_council.expired.002":
      "自定义先去评定。",
  };
  const enterResult = tavernHouseModule.enter({
    gameState: withCouncilInDays(createBaseState(), 0),
    characterDefinitions: prototypeCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
    textEntriesById,
  });
  const openWork = tavernHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "open-work" },
    textEntriesById,
  });
  const openAccept = tavernHouseModule.dispatch({
    gameState: openWork.gameState,
    characterDefinitions: openWork.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openWork.sessionState,
    request: { type: "action", actionId: "open-work-accept" },
    textEntriesById,
  });
  const result = tavernHouseModule.dispatch({
    gameState: openAccept.gameState,
    characterDefinitions: openAccept.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openAccept.sessionState,
    request: { type: "action", actionId: "accept-work:offer.kulan.wash_dishes" },
    textEntriesById,
  });

  assert.equal(result.sessionState?.overlay?.title, "自定义时日不够");
  assert.deepEqual(result.sessionState?.overlay?.paragraphs, [
    "自定义酒馆评定已到，刷盘子 要占 3 天。",
    "自定义先去评定。",
  ]);
});

test("tavern runtime no longer keeps work-panel and drink prompt prose inline", () => {
  const tavernRuntimeSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/application/house-modules/tavern/tavern-house-module.ts"
    ),
    "utf8"
  );

  assert.deepEqual(
    [
      "（把活计牌翻了出来）",
      "你可以先接取，也可以提交已经接下的活。",
      "这些是当前酒馆还能接的活。",
      "前期只能接一个主命以外的任务，名声高了才会放宽。",
      "你在这家酒馆还没有接下的活。",
      "点一杯酒",
      "这一杯酒你现在还喝不起。",
    ].filter((entry) => tavernRuntimeSource.includes(entry)),
    []
  );
});

test("tavern work flow accepts dishwashing qte and submits with confirmation", () => {
  const state = withCouncilInDays(createBaseState(), 30);
  const startingStamina = getPlayerCharacter(prototypeCharacters).stamina;
  const enterResult = tavernHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
  });

  const openWork = tavernHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "open-work" },
  });

  const openAccept = tavernHouseModule.dispatch({
    gameState: openWork.gameState,
    characterDefinitions: openWork.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openWork.sessionState,
    request: { type: "action", actionId: "open-work-accept" },
  });

  assert.equal(openAccept.sessionState?.workPanelMode, "accept");

  const acceptWork = tavernHouseModule.dispatch({
    gameState: openAccept.gameState,
    characterDefinitions: openAccept.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openAccept.sessionState,
    request: { type: "action", actionId: "accept-work:offer.kulan.wash_dishes" },
  });

  assert.equal(acceptWork.sessionState?.overlay?.type, "activity-confirm");

  const confirmedWork = tavernHouseModule.dispatch({
    gameState: acceptWork.gameState,
    characterDefinitions: acceptWork.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: acceptWork.sessionState,
    request: {
      type: "action",
      actionId: "confirm-start-work:offer.kulan.wash_dishes",
    },
  });

  assert.equal(confirmedWork.sessionState?.overlay?.type, "qte-bar");

  let qteResult = confirmedWork;
  for (let round = 0; round < 3; round += 1) {
    qteResult = tavernHouseModule.dispatch({
      gameState: qteResult.gameState,
      characterDefinitions: qteResult.characterDefinitions,
      houseDefinition: tavernHouse,
      playerCharacterId,
      sessionState: {
        ...qteResult.sessionState,
        overlay: {
          ...qteResult.sessionState.overlay,
          markerPercent: qteResult.sessionState.overlay.targetStartPercent,
        },
      },
      request: { type: "action", actionId: "tavern-work-stop" },
    });
  }

  assert.equal(qteResult.sessionState?.overlay?.type, "result");

  const openSubmitConfirm = tavernHouseModule.dispatch({
    gameState: qteResult.gameState,
    characterDefinitions: qteResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: qteResult.sessionState,
    request: { type: "action", actionId: "submit-work:offer.kulan.wash_dishes" },
  });

  assert.equal(openSubmitConfirm.sessionState?.overlay?.type, "submit-confirm");

  const submitResult = tavernHouseModule.dispatch({
    gameState: openSubmitConfirm.gameState,
    characterDefinitions: openSubmitConfirm.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openSubmitConfirm.sessionState,
    request: { type: "action", actionId: "confirm-submit-work" },
  });

  const playerCharacter = getPlayerCharacter(submitResult.characterDefinitions);
  assert.equal(playerCharacter.stats.gold, 190);
  assert.equal(
    playerCharacter.stamina,
    startingStamina - ACTIVITY_COMPLETION_STAMINA_COST
  );
  assert.equal(submitResult.sessionState?.acceptedOffers.length, 0);
  assert.equal(
    submitResult.gameState.runtime.flags[
      getTavernCompletedWorkKey(tavernHouse.id, "offer.kulan.wash_dishes")
    ],
    true
  );
});

test("tavern work acceptance is blocked when stamina is below activity cost", () => {
  const lowStaminaCharacters = withPlayerStamina(
    prototypeCharacters,
    ACTIVITY_COMPLETION_STAMINA_COST - 1
  );
  const enterResult = tavernHouseModule.enter({
    gameState: createBaseState(),
    characterDefinitions: lowStaminaCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
  });
  const openWork = tavernHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "open-work" },
  });
  const openAccept = tavernHouseModule.dispatch({
    gameState: openWork.gameState,
    characterDefinitions: openWork.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openWork.sessionState,
    request: { type: "action", actionId: "open-work-accept" },
  });

  const result = tavernHouseModule.dispatch({
    gameState: openAccept.gameState,
    characterDefinitions: openAccept.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openAccept.sessionState,
    request: { type: "action", actionId: "accept-work:offer.kulan.wash_dishes" },
  });

  assert.equal(result.sessionState?.overlay?.type, "alert");
  assert.equal(result.sessionState?.acceptedOffers.length, 0);
});

test("tavern work submission is blocked when stamina is below activity cost", () => {
  const enterResult = tavernHouseModule.enter({
    gameState: withCouncilInDays(createBaseState(), 90),
    characterDefinitions: prototypeCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
  });
  const openWork = tavernHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "open-work" },
  });
  const openAccept = tavernHouseModule.dispatch({
    gameState: openWork.gameState,
    characterDefinitions: openWork.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openWork.sessionState,
    request: { type: "action", actionId: "open-work-accept" },
  });
  const acceptWork = tavernHouseModule.dispatch({
    gameState: openAccept.gameState,
    characterDefinitions: openAccept.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openAccept.sessionState,
    request: { type: "action", actionId: "accept-work:offer.kulan.wash_dishes" },
  });
  const confirmedWork = tavernHouseModule.dispatch({
    gameState: acceptWork.gameState,
    characterDefinitions: acceptWork.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: acceptWork.sessionState,
    request: {
      type: "action",
      actionId: "confirm-start-work:offer.kulan.wash_dishes",
    },
  });

  let qteResult = confirmedWork;
  for (let round = 0; round < 3; round += 1) {
    qteResult = tavernHouseModule.dispatch({
      gameState: qteResult.gameState,
      characterDefinitions: qteResult.characterDefinitions,
      houseDefinition: tavernHouse,
      playerCharacterId,
      sessionState: {
        ...qteResult.sessionState,
        overlay: {
          ...qteResult.sessionState.overlay,
          markerPercent: qteResult.sessionState.overlay.targetStartPercent,
        },
      },
      request: { type: "action", actionId: "tavern-work-stop" },
    });
  }

  const openSubmitConfirm = tavernHouseModule.dispatch({
    gameState: qteResult.gameState,
    characterDefinitions: qteResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: qteResult.sessionState,
    request: { type: "action", actionId: "submit-work:offer.kulan.wash_dishes" },
  });
  const lowStaminaCharacters = withPlayerStamina(
    openSubmitConfirm.characterDefinitions,
    ACTIVITY_COMPLETION_STAMINA_COST - 1
  );

  const result = tavernHouseModule.dispatch({
    gameState: openSubmitConfirm.gameState,
    characterDefinitions: lowStaminaCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openSubmitConfirm.sessionState,
    request: { type: "action", actionId: "confirm-submit-work" },
  });

  assert.equal(result.sessionState?.overlay?.type, "alert");
  assert.equal(getPlayerCharacter(result.characterDefinitions).stats.gold, 120);
  assert.equal(result.sessionState?.acceptedOffers.length, 1);
});

test("tavern submitting unfinished work fails and clears active work", () => {
  const state = withCouncilInDays(createBaseState(), 30);
  const enterResult = tavernHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
  });

  const openWork = tavernHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "open-work" },
  });

  const openAccept = tavernHouseModule.dispatch({
    gameState: openWork.gameState,
    characterDefinitions: openWork.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openWork.sessionState,
    request: { type: "action", actionId: "open-work-accept" },
  });

  const acceptRandom = tavernHouseModule.dispatch({
    gameState: openAccept.gameState,
    characterDefinitions: openAccept.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openAccept.sessionState,
    request: { type: "action", actionId: "accept-work:offer.kulan.supply_run" },
  });

  assert.equal(acceptRandom.sessionState?.overlay?.type, "activity-confirm");

  const confirmedRandom = tavernHouseModule.dispatch({
    gameState: acceptRandom.gameState,
    characterDefinitions: acceptRandom.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: acceptRandom.sessionState,
    request: {
      type: "action",
      actionId: "confirm-start-work:offer.kulan.supply_run",
    },
  });

  assert.equal(confirmedRandom.sessionState?.acceptedOffers.length, 1);

  const openSubmitConfirm = tavernHouseModule.dispatch({
    gameState: confirmedRandom.gameState,
    characterDefinitions: confirmedRandom.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: confirmedRandom.sessionState,
    request: { type: "action", actionId: "submit-work:offer.kulan.supply_run" },
  });

  assert.equal(openSubmitConfirm.sessionState?.overlay?.type, "submit-confirm");

  const submitResult = tavernHouseModule.dispatch({
    gameState: openSubmitConfirm.gameState,
    characterDefinitions: openSubmitConfirm.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openSubmitConfirm.sessionState,
    request: { type: "action", actionId: "confirm-submit-work" },
  });

  const playerCharacter = getPlayerCharacter(submitResult.characterDefinitions);
  assert.equal(playerCharacter.stats.gold, 120);
  assert.equal(submitResult.sessionState?.acceptedOffers.length, 0);
  assert.equal(
    submitResult.gameState.runtime.flags[
      getTavernFailedWorkKey(tavernHouse.id, "offer.kulan.supply_run")
    ],
    true
  );
});

test("medicine house greeting flow opens actions after advance", () => {
  const state = createBaseState();
  const enterResult = medicineHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: medicineHouse,
    playerCharacterId,
  });

  assert.equal(enterResult.sessionState?.dialoguePhase, "greeting");

  const openResult = medicineHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-greeting" },
  });

  assert.equal(openResult.sessionState?.dialoguePhase, "open");
  const viewModel = medicineHouseHouseModule.selectViewModel({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
  });

  assert.equal(viewModel.actionContainer?.actions.length, 5);
});

test("medicine house heal and buy update fatigue inventory and gold", () => {
  const state = createBaseState();
  const richCharacters = prototypeCharacters.map((characterDefinition) =>
    characterDefinition.id === playerCharacterId
      ? {
          ...characterDefinition,
          stats: {
            ...characterDefinition.stats,
            gold: 300,
          },
        }
      : characterDefinition
  );
  const enterResult = medicineHouseHouseModule.enter({
    gameState: {
      ...state,
      runtime: {
        ...state.runtime,
        variables: {
          ...state.runtime.variables,
          [getPlayerFatigueVariableKey()]: 40,
        },
      },
    },
    characterDefinitions: richCharacters,
    houseDefinition: medicineHouse,
    playerCharacterId,
  });

  const openResult = medicineHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: richCharacters,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-greeting" },
  });

  const healResult = medicineHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: richCharacters,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "heal" },
  });

  assert.equal(healResult.gameState.runtime.variables[getPlayerFatigueVariableKey()], 10);

  const playerAfterHeal = getPlayerCharacter(healResult.characterDefinitions);
  assert.equal(playerAfterHeal.stats.gold, 250);

  const afterAlert = medicineHouseHouseModule.dispatch({
    gameState: healResult.gameState,
    characterDefinitions: healResult.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: healResult.sessionState,
    request: { type: "action", actionId: "close-alert" },
  });

  const buyOpen = medicineHouseHouseModule.dispatch({
    gameState: afterAlert.gameState,
    characterDefinitions: afterAlert.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: afterAlert.sessionState,
    request: { type: "action", actionId: "open-buy" },
  });

  assert.equal(buyOpen.sessionState?.overlay?.type, "buy");

  const buyResult = medicineHouseHouseModule.dispatch({
    gameState: buyOpen.gameState,
    characterDefinitions: buyOpen.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: buyOpen.sessionState,
    request: { type: "action", actionId: "confirm-buy" },
  });

  assert.equal(
    buyResult.gameState.runtime.variables[
      getMedicineInventoryQuantityVariableKey("medicine_heal_001")
    ],
    1
  );
});

test("medicine house copy resolves from text entries for greeting talk heal and compounding refusal", () => {
  const textEntriesById = {
    "runtime.zhu_yuanzhang.medicine_house.greeting.001": "自定义药铺迎客。",
    "runtime.zhu_yuanzhang.medicine_house.greeting.002": "自定义药铺迎客。",
    "runtime.zhu_yuanzhang.medicine_house.dialogue.001": "自定义药铺闲谈。",
    "runtime.zhu_yuanzhang.medicine_house.dialogue.002": "自定义药铺闲谈。",
    "runtime.zhu_yuanzhang.medicine_house.dialogue.003": "自定义药铺闲谈。",
    "runtime.zhu_yuanzhang.medicine_house.dialogue.004": "自定义药铺闲谈。",
    "runtime.zhu_yuanzhang.medicine_house.talk.overlay.title": "自定义药铺闲谈",
    "runtime.zhu_yuanzhang.medicine_house.heal.overlay.title": "自定义疗伤",
    "runtime.zhu_yuanzhang.medicine_house.heal.001": "自定义疗伤文案。",
    "runtime.zhu_yuanzhang.medicine_house.heal.002": "收费 {cost} 文。",
    "runtime.zhu_yuanzhang.medicine_house.compounding.low_stamina.title": "自定义先去歇息",
    "runtime.zhu_yuanzhang.medicine_house.compounding.low_stamina.001": "自定义配药体力不足。",
    "runtime.zhu_yuanzhang.medicine_house.compounding.low_stamina.002":
      "体力至少恢复到 {requiredStamina} 点。",
  };
  const richCharacters = prototypeCharacters.map((characterDefinition) =>
    characterDefinition.id === playerCharacterId
      ? {
          ...characterDefinition,
          stats: {
            ...characterDefinition.stats,
            gold: 300,
          },
        }
      : characterDefinition
  );
  const enterResult = medicineHouseHouseModule.enter({
    gameState: createBaseState(),
    characterDefinitions: richCharacters,
    houseDefinition: medicineHouse,
    playerCharacterId,
    textEntriesById,
  });

  assert.equal(enterResult.sessionState?.npcGreeting, "自定义药铺迎客。");

  const openResult = medicineHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: richCharacters,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-greeting" },
    textEntriesById,
  });

  const talkResult = medicineHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: richCharacters,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "talk" },
    textEntriesById,
  });

  assert.equal(talkResult.sessionState?.overlay?.title, "自定义药铺闲谈");
  assert.equal(
    talkResult.sessionState?.overlay?.paragraphs[0],
    "自定义药铺闲谈。"
  );

  const healResult = medicineHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: richCharacters,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "heal" },
    textEntriesById,
  });

  assert.equal(healResult.sessionState?.overlay?.title, "自定义疗伤");
  assert.deepEqual(healResult.sessionState?.overlay?.paragraphs.slice(0, 2), [
    "自定义疗伤文案。",
    `收费 ${50} 文。`,
  ]);

  const lowStaminaCharacters = withPlayerStamina(
    prototypeCharacters,
    ACTIVITY_COMPLETION_STAMINA_COST - 1
  );
  const lowStaminaEnter = medicineHouseHouseModule.enter({
    gameState: createBaseState(),
    characterDefinitions: lowStaminaCharacters,
    houseDefinition: medicineHouse,
    playerCharacterId,
    textEntriesById,
  });
  const lowStaminaOpen = medicineHouseHouseModule.dispatch({
    gameState: lowStaminaEnter.gameState,
    characterDefinitions: lowStaminaEnter.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: lowStaminaEnter.sessionState,
    request: { type: "action", actionId: "advance-greeting" },
    textEntriesById,
  });
  const lowStaminaResult = medicineHouseHouseModule.dispatch({
    gameState: lowStaminaOpen.gameState,
    characterDefinitions: lowStaminaOpen.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: lowStaminaOpen.sessionState,
    request: { type: "action", actionId: "start-compounding" },
    textEntriesById,
  });

  assert.equal(
    lowStaminaResult.sessionState?.overlay?.title,
    "自定义先去歇息"
  );
  assert.deepEqual(lowStaminaResult.sessionState?.overlay?.paragraphs, [
    "自定义配药体力不足。",
    `体力至少恢复到 ${ACTIVITY_COMPLETION_STAMINA_COST} 点。`,
  ]);
});

test("medicine house council-date refusal resolves from text entries", () => {
  const textEntriesById = {
    "runtime.zhu_yuanzhang.medicine_house.compounding.blocked_by_council.title":
      "自定义时日不够",
    "runtime.zhu_yuanzhang.medicine_house.compounding.blocked_by_council.expired.001":
      "自定义药铺评定已到，这炉药要占 {durationDays} 天。",
    "runtime.zhu_yuanzhang.medicine_house.compounding.blocked_by_council.expired.002":
      "自定义先去评定再来。",
  };
  const enterResult = medicineHouseHouseModule.enter({
    gameState: withCouncilInDays(createBaseState(), 0),
    characterDefinitions: prototypeCharacters,
    houseDefinition: medicineHouse,
    playerCharacterId,
    textEntriesById,
  });
  const openResult = medicineHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: {
      ...enterResult.sessionState,
      dialoguePhase: "open",
    },
    request: { type: "action", actionId: "start-compounding" },
    textEntriesById,
  });

  assert.equal(openResult.sessionState?.overlay?.title, "自定义时日不够");
  assert.deepEqual(openResult.sessionState?.overlay?.paragraphs, [
    "自定义药铺评定已到，这炉药要占 10 天。",
    "自定义先去评定再来。",
  ]);
});

test("medicine house runtime and content no longer keep core greeting and heal prose inline", () => {
  const medicineHouseRuntimeSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/application/house-modules/medicine-house/medicine-house-house-module.ts"
    ),
    "utf8"
  );
  const medicineHouseContentSource = fs.readFileSync(
    path.join(process.cwd(), "src/content/houses/medicine-house-content.ts"),
    "utf8"
  );

  assert.deepEqual(
    [
      "近来风寒病人不少。",
      "（放下药秤，朝你点了点头）",
      "（为你把脉施针）你的气色渐渐平复。",
      "（按住药杵，皱起眉）你这会儿气息不稳，硬要配药，只会把药性配岔了。",
    ].filter(
      (entry) =>
        medicineHouseRuntimeSource.includes(entry) ||
        medicineHouseContentSource.includes(entry)
    ),
    []
  );
});

test("medicine compounding is blocked when stamina is below activity cost", () => {
  const lowStaminaCharacters = withPlayerStamina(
    prototypeCharacters,
    ACTIVITY_COMPLETION_STAMINA_COST - 1
  );
  const enterResult = medicineHouseHouseModule.enter({
    gameState: withCouncilInDays(createBaseState(), 30),
    characterDefinitions: lowStaminaCharacters,
    houseDefinition: medicineHouse,
    playerCharacterId,
  });

  const result = medicineHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: {
      ...enterResult.sessionState,
      dialoguePhase: "open",
    },
    request: { type: "action", actionId: "start-compounding" },
  });

  assert.equal(result.sessionState?.overlay?.type, "alert");
  assert.equal(result.sideEffects, undefined);
});

test("medicine compounding spends stamina when settled", () => {
  const startingStamina = getPlayerCharacter(prototypeCharacters).stamina;
  const enterResult = medicineHouseHouseModule.enter({
    gameState: withCouncilInDays(createBaseState(), 200),
    characterDefinitions: prototypeCharacters,
    houseDefinition: medicineHouse,
    playerCharacterId,
  });
  const startResult = medicineHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: {
      ...enterResult.sessionState,
      dialoguePhase: "open",
    },
    request: { type: "action", actionId: "start-compounding" },
  });
  assert.equal(startResult.sessionState?.overlay?.type, "activity-confirm");

  const confirmedStart = medicineHouseHouseModule.dispatch({
    gameState: startResult.gameState,
    characterDefinitions: startResult.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: startResult.sessionState,
    request: { type: "action", actionId: "confirm-start-compounding" },
  });

  const result = medicineHouseHouseModule.dispatch({
    gameState: confirmedStart.gameState,
    characterDefinitions: confirmedStart.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: confirmedStart.sessionState,
    request: { type: "action", actionId: "compound-finish" },
  });

  assert.equal(result.sessionState?.overlay?.type, "result");
  assert.equal(
    getPlayerCharacter(result.characterDefinitions).stamina,
    startingStamina - ACTIVITY_COMPLETION_STAMINA_COST
  );
});

test("temple work is blocked when stamina is below activity cost", () => {
  const baseState = createMonkStageState();
  const lowStaminaMonkCharacters = withPlayerStamina(
    createPrototypeCharactersForStoryStage(
      ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
    ),
    ACTIVITY_COMPLETION_STAMINA_COST - 1
  );
  const enterResult = templeHouseHouseModule.enter({
    gameState: {
      ...baseState,
      currentHouseId: templeHouse.id,
      runtime: {
        ...baseState.runtime,
        flags: {
          ...baseState.runtime.flags,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted]: true,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked]: true,
        },
        variables: {
          ...baseState.runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 30,
          [TEMPLE_HOUSE_VARIABLE_KEYS.currentWorkPlan]: "temple-help",
        },
      },
    },
    characterDefinitions: lowStaminaMonkCharacters,
    houseDefinition: templeHouse,
    playerCharacterId,
  });
  const openResult = templeHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: {
      ...enterResult.sessionState,
      dialoguePhase: "open",
    },
    request: { type: "action", actionId: "open-temple-work-menu" },
  });

  const result = templeHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "assign-temple-task:copy-scripture" },
  });

  assert.equal(result.sessionState?.overlay?.type, "alert");
  assert.equal(result.sideEffects, undefined);
});

test("temple begging settlement is blocked when stamina is below activity cost", () => {
  const baseState = createMonkStageState();
  const lowStaminaMonkCharacters = withPlayerStamina(
    createPrototypeCharactersForStoryStage(
      ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
    ),
    ACTIVITY_COMPLETION_STAMINA_COST - 1
  );
  const enterResult = templeHouseHouseModule.enter({
    gameState: {
      ...baseState,
      currentHouseId: templeHouse.id,
      runtime: {
        ...baseState.runtime,
        flags: {
          ...baseState.runtime.flags,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted]: true,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked]: true,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingUnlocked]: true,
        },
        variables: {
          ...baseState.runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 30,
          [TEMPLE_HOUSE_VARIABLE_KEYS.currentWorkPlan]: "beg-alms",
          [PLAYER_GRAIN_RUNTIME_KEYS.quantityDou]: 15,
        },
      },
    },
    characterDefinitions: lowStaminaMonkCharacters,
    houseDefinition: templeHouse,
    playerCharacterId,
  });
  const openSubmit = templeHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: {
      ...enterResult.sessionState,
      dialoguePhase: "open",
    },
    request: { type: "action", actionId: "submit-temple-begging-food" },
  });

  assert.equal(openSubmit.sessionState?.overlay?.type, "submit-food");

  const result = templeHouseHouseModule.dispatch({
    gameState: openSubmit.gameState,
    characterDefinitions: openSubmit.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: openSubmit.sessionState,
    request: { type: "action", actionId: "confirm-temple-begging-food" },
  });

  assert.equal(result.sessionState?.overlay?.type, "alert");
  assert.equal(
    result.gameState.runtime.variables[PLAYER_GRAIN_RUNTIME_KEYS.quantityDou],
    15
  );
  assert.equal(
    getPlayerCharacter(result.characterDefinitions).stamina,
    ACTIVITY_COMPLETION_STAMINA_COST - 1
  );
});

test("temple work reaching contribution threshold starts shared map auto advance for next review", () => {
  const monkCharacters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
  );
  const startingStamina = getPlayerCharacter(monkCharacters).stamina;
  const enterResult = templeHouseHouseModule.enter({
    gameState: {
      ...withCouncilInDays(createMonkStageState(), 30),
      runtime: {
        ...withCouncilInDays(createMonkStageState(), 30).runtime,
        flags: {
          ...withCouncilInDays(createMonkStageState(), 30).runtime.flags,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted]: true,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked]: true,
        },
        variables: {
          ...withCouncilInDays(createMonkStageState(), 30).runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 30,
          [TEMPLE_HOUSE_VARIABLE_KEYS.currentWorkPlan]: "temple-help",
          [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeContribution]: 20,
        },
      },
    },
    characterDefinitions: monkCharacters,
    houseDefinition: templeHouse,
    playerCharacterId,
  });

  const openResult = templeHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: {
      ...enterResult.sessionState,
      dialoguePhase: "open",
    },
    request: { type: "action", actionId: "open-temple-work-menu" },
  });

  const startWorkResult = templeHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "assign-temple-task:copy-scripture" },
  });
  assert.equal(startWorkResult.sessionState?.overlay?.type, "activity-confirm");

  const confirmedWorkResult = templeHouseHouseModule.dispatch({
    gameState: startWorkResult.gameState,
    characterDefinitions: startWorkResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: startWorkResult.sessionState,
    request: {
      type: "action",
      actionId: "confirm-start-temple-task:copy-scripture",
    },
  });

  let qteResult = confirmedWorkResult;
  for (let round = 0; round < 3; round += 1) {
    qteResult = templeHouseHouseModule.dispatch({
      gameState: qteResult.gameState,
      characterDefinitions: qteResult.characterDefinitions,
      houseDefinition: templeHouse,
      playerCharacterId,
      sessionState: {
        ...qteResult.sessionState,
        overlay: {
          ...qteResult.sessionState.overlay,
          markerPercent: qteResult.sessionState.overlay.targetStartPercent,
        },
      },
      request: { type: "action", actionId: "temple-work-stop" },
    });
  }

  assert.equal(qteResult.sessionState?.overlay?.type, "result");
  assert.equal(
    getPlayerCharacter(qteResult.characterDefinitions).stamina,
    startingStamina - ACTIVITY_COMPLETION_STAMINA_COST
  );
  assert.equal(
    qteResult.gameState.runtime.flags[ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingUnlocked],
    true
  );

  const closeResult = templeHouseHouseModule.dispatch({
    gameState: qteResult.gameState,
    characterDefinitions: qteResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: qteResult.sessionState,
    request: { type: "action", actionId: "close-temple-result" },
  });

  assert.equal(closeResult.sessionState, null);
  assert.equal(
    closeResult.sideEffects?.some(
      (sideEffect) => sideEffect.type === "start-map-auto-advance"
    ),
    true
  );
});

test("story battle rescue flow opens battle demo scenario and returns to keep review", () => {
  const completion = {
    completedFlagKey:
      ZHU_YUANZHANG_STORY_FLAG_KEYS.sundeyaRescueBattleCompleted,
    winFlagKey: ZHU_YUANZHANG_STORY_FLAG_KEYS.sundeyaRescueBattleWon,
    battleIdVariableKey: ZHU_YUANZHANG_STORY_VARIABLE_KEYS.lastBattleId,
    resultVariableKey: ZHU_YUANZHANG_STORY_VARIABLE_KEYS.lastBattleResult,
    enterHouseId: keepHouse.id,
    mainMissionText: "战后帅府评定",
  };
  const session = createSundeyaRescueBattleSession(completion);
  const startedState = startStoryBattle(createBaseState(), session);

  assert.equal(startedState.ui.currentView, "battle");
  assert.equal(startedState.storyBattle?.phase, "embedded-running");
  assert.equal(startedState.storyBattle?.demoScenarioId, "sundeya-rescue");
  assert.equal(
    startedState.storyBattle?.units.filter((unit) => unit.controller === "player").length,
    1
  );

  const finishResult = dispatchStoryBattleAction(startedState, "embedded-victory");
  assert.equal(finishResult.enterHouseId, keepHouse.id);
  assert.equal(finishResult.state.storyBattle, null);
  assert.equal(finishResult.state.ui.currentView, "house");
  assert.equal(
    finishResult.state.runtime.flags[
      ZHU_YUANZHANG_STORY_FLAG_KEYS.sundeyaRescueBattleCompleted
    ],
    true
  );
  assert.equal(
    finishResult.state.runtime.variables[
      ZHU_YUANZHANG_STORY_VARIABLE_KEYS.lastBattleResult
    ],
    "victory"
  );
  assert.equal(
    finishResult.state.runtime.variables[KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown],
    0
  );
});

test("story battle rescue copy resolves from text entries across session and actions", () => {
  const completion = {
    completedFlagKey:
      ZHU_YUANZHANG_STORY_FLAG_KEYS.sundeyaRescueBattleCompleted,
    winFlagKey: ZHU_YUANZHANG_STORY_FLAG_KEYS.sundeyaRescueBattleWon,
    battleIdVariableKey: ZHU_YUANZHANG_STORY_VARIABLE_KEYS.lastBattleId,
    resultVariableKey: ZHU_YUANZHANG_STORY_VARIABLE_KEYS.lastBattleResult,
    enterHouseId: keepHouse.id,
  };
  const textEntriesById = {
    "battle.story.zhu_yuanzhang.sundeya_rescue.title": "夜袭解围",
    "battle.story.zhu_yuanzhang.sundeya_rescue.objective": "撕开缺口并接应友军。",
    "battle.story.zhu_yuanzhang.sundeya_rescue.summary.001": "摘要一",
    "battle.story.zhu_yuanzhang.sundeya_rescue.summary.002": "摘要二",
    "battle.story.zhu_yuanzhang.sundeya_rescue.summary.003": "摘要三",
    "battle.story.zhu_yuanzhang.sundeya_rescue.log.opening.001": "开场一",
    "battle.story.zhu_yuanzhang.sundeya_rescue.log.opening.002": "开场二",
    "battle.story.zhu_yuanzhang.sundeya_rescue.log.advance.001": "推进日志",
    "battle.story.zhu_yuanzhang.sundeya_rescue.log.victory.001": "胜利一",
    "battle.story.zhu_yuanzhang.sundeya_rescue.log.victory.002": "胜利二",
    "battle.story.zhu_yuanzhang.sundeya_rescue.main_mission.post_battle":
      "回府复命",
    "battle.story.zhu_yuanzhang.sundeya_rescue.unit.player_vanguard.name":
      "先锋亲兵",
    "battle.story.zhu_yuanzhang.sundeya_rescue.unit.player_vanguard.role":
      "破阵队",
  };

  const session = createSundeyaRescueBattleSession(completion, {
    textEntriesById,
  });
  assert.equal(session.title, "夜袭解围");
  assert.equal(session.objective, "撕开缺口并接应友军。");
  assert.deepEqual(session.summaryLines, ["摘要一", "摘要二", "摘要三"]);
  assert.deepEqual(session.logLines, ["开场一", "开场二"]);
  assert.equal(session.units[0].name, "先锋亲兵");
  assert.equal(session.units[0].role, "破阵队");
  assert.equal(session.completion.mainMissionText, "回府复命");

  const playerAdvanceState = {
    ...createBaseState(),
    storyBattle: {
      ...session,
      phase: "awaiting-player-order",
    },
  };
  const advanceResult = dispatchStoryBattleAction(
    playerAdvanceState,
    "player-advance",
    { textEntriesById }
  );
  assert.equal(
    advanceResult.state.storyBattle?.logLines.at(-1),
    "推进日志"
  );

  const npcResolveResult = dispatchStoryBattleAction(
    advanceResult.state,
    "npc-resolve",
    { textEntriesById }
  );
  assert.deepEqual(
    npcResolveResult.state.storyBattle?.logLines.slice(-2),
    ["胜利一", "胜利二"]
  );

  const finishResult = dispatchStoryBattleAction(
    npcResolveResult.state,
    "finish",
    { textEntriesById }
  );
  assert.equal(finishResult.state.ui.mainHouseMissionText, "回府复命");
});

test("medicine compounding grades targets by closeness", () => {
  const perfect = resolveCompoundingGrade(
    {
      ailmentId: "wind_cold",
      ailmentName: "风寒",
      coldRequired: 2,
      healRequired: 5,
      maxPoison: 1,
    },
    [
      { herbId: "herb_bo_he", amount: 1 },
      { herbId: "herb_xing_ren", amount: 1 },
      { herbId: "herb_dang_gui", amount: 1 },
    ],
    [
      { id: "herb_bo_he", name: "薄荷", cold: 2, heat: 0, poison: 0, heal: 1 },
      { id: "herb_xing_ren", name: "杏仁", cold: 1, heat: 0, poison: 0, heal: 2 },
      { id: "herb_dang_gui", name: "当归", cold: 0, heat: 1, poison: 0, heal: 3 },
    ]
  );

  assert.equal(perfect.grade, "S");
});

test("core contracts export the boundary types", async () => {
  const contracts = require("../.test-dist/core/contracts/mod-manifest.js");
  assert.equal(typeof contracts, "object");
});

test("runtime request contract supports action tick and external variants", async () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/runtime-request.ts"),
    "utf8"
  );

  assert.match(source, /type: "action"/);
  assert.match(source, /type: "tick"/);
  assert.match(source, /type: "external"/);
});

test("runtime request contract exports typed request families for shared routing", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/runtime-request.ts"),
    "utf8"
  );

  assert.match(source, /export type RuntimeRequestFamily =/);
  assert.match(source, /export type ActionRuntimeRequest =/);
  assert.match(source, /family: "action"/);
  assert.match(source, /export type TickRuntimeRequest =/);
  assert.match(source, /family: "tick"/);
  assert.match(source, /export type ExternalRuntimeRequest =/);
  assert.match(source, /family: "external"/);
});

test("runtime router contract exports a formal routing seam", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/runtime-router.ts"),
    "utf8"
  );

  assert.match(source, /export type RuntimeRouteInput =/);
  assert.match(source, /export interface RuntimeRouter/);
  assert.match(source, /route\(input: RuntimeRouteInput\): RuntimeResult/);
});

test("shared dispatch consumes the hardened runtime router contract", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/runtime-dispatch.ts"),
    "utf8"
  );

  assert.match(source, /import type \{ RuntimeRouter \}/);
  assert.match(source, /router: RuntimeRouter/);
  assert.match(source, /input\.context\.router\.route\(/);
  assert.doesNotMatch(source, /routeRequest:/);
});

test("engine bootstrap builds a session from a selected mod id and registry", async () => {
  const { createEngineSession } = require("../.test-dist/core/engine/engine-factory.js");
  const session = createEngineSession({
    selectedMod: {
      id: "builtin.default",
      version: "1.0.0",
      title: "Default",
      entryContentPackIds: [],
    },
    registry: {
      mods: {},
      content: {},
    },
  });

  assert.equal(session.state.engine.selectedModId, "builtin.default");
});

test("runtime dispatch settles effects after routing", async () => {
  const { dispatchRuntimeRequest } = require("../.test-dist/core/runtime/runtime-dispatch.js");
  const result = dispatchRuntimeRequest({
    state: {
      core: {
        world: {
          currentMapId: "map.test",
          currentCityId: "city.test",
          currentHouseId: null,
          timeOfDay: "morning",
          schedule: {
            councilDate: {
              year: 1567,
              month: 1,
              day: 1,
            },
          },
        },
        player: {
          characterId: playerCharacterId,
        },
        calendar: {
          chapterId: "chapter.prototype",
          year: 1567,
          month: 1,
          day: 1,
        },
        scene: {
          activeEventId: null,
          activeSceneId: null,
          cursor: 0,
          status: "idle",
        },
        storyBattle: null,
        ui: {
          visiblePanels: ["player-card"],
          pinnedCharacterId: playerCharacterId,
          activeMissionId: null,
          reviewDateText: "test",
          mainHouseMissionText: "test",
          overlayView: null,
          cardLibraryFilter: "all",
          valuableLibraryFilter: "all",
          valuableLibrarySortKey: "name",
          valuableLibrarySortDirection: "asc",
          houseSession: null,
          currentView: "map",
        },
        missions: {
          activeMissionId: null,
          completedMissionIds: [],
        },
        cards: {
          ownedCardIds: [],
          selectedCardId: null,
        },
        valuables: {
          items: [],
          selectedItemId: null,
          equippedWeaponSet: {
            swordId: null,
            armorId: null,
          },
        },
        runtime: {
          flags: {},
          variables: {},
          cityNpcPools: {},
          cityMarkets: {},
          activitySession: null,
          eventHistory: {},
        },
      },
      app: {
        beggingMiniGameState: null,
        autoAdvanceState: null,
        cityDirectoryState: null,
        locationDialogueState: null,
      },
      view: {},
    },
    request: { family: "action", type: "action", actionId: "test" },
    context: {
      router: {
        route() {
          return {
          state: {
            core: {
              world: {
                currentMapId: "map.test",
                currentCityId: "city.test",
                currentHouseId: null,
                timeOfDay: "morning",
                schedule: {
                  councilDate: {
                    year: 1567,
                    month: 1,
                    day: 1,
                  },
                },
              },
              player: {
                characterId: playerCharacterId,
              },
              calendar: {
                chapterId: "chapter.prototype",
                year: 1567,
                month: 1,
                day: 1,
              },
              scene: {
                activeEventId: null,
                activeSceneId: null,
                cursor: 0,
                status: "idle",
              },
              storyBattle: null,
              ui: {
                visiblePanels: ["player-card"],
                pinnedCharacterId: playerCharacterId,
                activeMissionId: null,
                reviewDateText: "test",
                mainHouseMissionText: "test",
                overlayView: null,
                cardLibraryFilter: "all",
                valuableLibraryFilter: "all",
                valuableLibrarySortKey: "name",
                valuableLibrarySortDirection: "asc",
                houseSession: null,
                currentView: "map",
              },
              missions: {
                activeMissionId: null,
                completedMissionIds: [],
              },
              cards: {
                ownedCardIds: [],
                selectedCardId: null,
              },
              valuables: {
                items: [],
                selectedItemId: null,
                equippedWeaponSet: {
                  swordId: null,
                  armorId: null,
                },
              },
              runtime: {
                flags: {},
                variables: {},
                cityNpcPools: {},
                cityMarkets: {},
                activitySession: null,
                eventHistory: {},
              },
            },
            app: {
              beggingMiniGameState: null,
              autoAdvanceState: null,
              cityDirectoryState: null,
              locationDialogueState: null,
            },
            view: {},
          },
          effects: [{ type: "setFlag", key: "booted", value: true }],
        };
        },
      },
    },
  });

  assert.equal(result.state.core.runtime.flags.booted, true);
});

test("createInitialState seeds runtime task state through the unified game state", () => {
  const state = createInitialState({
    currentMapId: "map.test",
    currentCityId: "city.test",
    currentHouseId: null,
    playerCharacterId,
    chapterId: "chapter.prototype",
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: playerCharacterId,
    reviewDateText: "test",
    mainHouseMissionText: "test",
    cards: {
      ownedCardIds: [],
      selectedCardId: null,
    },
    valuables: {
      items: [],
      selectedItemId: null,
      equippedWeaponSet: {
        swordId: null,
        armorId: null,
      },
    },
  });

  assert.deepEqual(state.runtime.tasks, {
    instancesByTaskId: {},
    completedTaskIds: [],
    failedTaskIds: [],
    updatedAt: "",
  });
});

test("runtime dispatch settles routed task actions and signals into unified task state", async () => {
  const { dispatchRuntimeRequest } = require("../.test-dist/core/runtime/runtime-dispatch.js");
  const state = createBaseState();

  const result = dispatchRuntimeRequest({
    state: {
      core: state,
      app: {
        beggingMiniGameState: null,
        autoAdvanceState: null,
        cityDirectoryState: null,
        locationDialogueState: null,
      },
      view: {},
    },
    request: { family: "action", type: "action", actionId: "test.task-runtime" },
    context: {
      router: {
        route: ({ state }) => ({
          state,
          effects: [],
          taskActions: [
            {
              type: "start",
              taskId: "task.runtime.test",
              occurredAt: "2026-07-02T08:00:00.000Z",
              source: "event-runtime",
            },
          ],
          taskSignals: [
            {
              type: "scene.reported",
              source: "scene-runtime",
              occurredAt: "2026-07-02T08:05:00.000Z",
            },
          ],
        }),
      },
      taskDefinitionsById: {
        "task.runtime.test": {
          id: "task.runtime.test",
          title: "Runtime Test Task",
          objectives: [
            { id: "report", target: 1, signalType: "scene.reported" },
          ],
          onCompleteEffects: [
            {
              type: "setFlag",
              key: "task.runtime.test.completed",
              value: true,
            },
          ],
        },
      },
    },
  });

  assert.equal(
    result.state.core.runtime.tasks.instancesByTaskId["task.runtime.test"].status,
    "completed"
  );
  assert.deepEqual(result.state.core.runtime.tasks.completedTaskIds, [
    "task.runtime.test",
  ]);
  assert.equal(
    result.state.core.runtime.flags["task.runtime.test.completed"],
    true
  );
  assert.deepEqual(
    result.taskUpdates.map((update) => update.type),
    ["started", "completed"]
  );
});

test("covered shared runtime reentry is runtime-owned", async () => {
  const { dispatchRuntimeRequest } = require("../.test-dist/core/runtime/runtime-dispatch.js");
  const baseState = createBaseState();
  const handledInteractive = [];

  const result = dispatchRuntimeRequest({
    state: {
      core: baseState,
      app: {
        beggingMiniGameState: null,
        autoAdvanceState: null,
        cityDirectoryState: null,
        locationDialogueState: null,
      },
      view: {},
    },
    request: {
      family: "action",
      type: "action",
      actionId: "interactive.story-battle.action",
    },
    context: {
      router: {
        route: ({ state }) => ({
          state,
          effects: [
            {
              type: "setFlag",
              key: "flag.runtime.reentry",
              value: true,
            },
          ],
          interactive: {
            type: "reenter-house",
            houseId: homeHouse.id,
          },
        }),
      },
      followUp: {
        handleInteractive: ({ state, interactive }) => {
          handledInteractive.push(interactive.type);

          if (interactive.type !== "reenter-house") {
            return state;
          }

          return {
            ...state,
            core: {
              ...state.core,
              world: {
                ...state.core.world,
                currentHouseId: interactive.houseId,
              },
              ui: {
                ...state.core.ui,
                currentView: "house",
              },
            },
          };
        },
      },
    },
  });

  assert.deepEqual(handledInteractive, ["reenter-house"]);
  assert.equal(result.state.core.runtime.flags["flag.runtime.reentry"], true);
  assert.equal(result.state.core.world.currentHouseId, homeHouse.id);
  assert.equal(result.state.core.ui.currentView, "house");
  assert.deepEqual(result.interactive, { type: "none" });
});

test("child 13 shared dispatch follow-up no longer branches on reenter-house in main.ts", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.doesNotMatch(source, /followUpRendered/);
  assert.doesNotMatch(
    source,
    /enterHouseThroughRuntime\(houseRuntime, interactive\.houseId\)/
  );
  assert.match(source, /houseRuntime\.applyInteractiveFollowUp\(interactive\)/);
});

test("save envelope preserves selected mod id and mod state payload", async () => {
  const { createSaveEnvelope } = require("../.test-dist/core/save/save-envelope.js");
  const envelope = createSaveEnvelope({
    version: "1.0.0",
    selectedModSource: {
      kind: "url",
      name: "Imported Pack",
      url: "https://example.com/mods/imported-pack.json",
    },
    state: {
      engine: {
        selectedModId: "builtin.default",
        version: "1.0.0",
        currentView: "map",
      },
      runtime: {
        flags: {},
        variables: {},
        activeEventId: null,
        activeTaskIds: [],
      },
      modState: { "builtin.default": { foo: 1 } },
    },
  });

  assert.equal(envelope.selectedModId, "builtin.default");
  assert.deepEqual(envelope.selectedModSource, {
    kind: "url",
    name: "Imported Pack",
    url: "https://example.com/mods/imported-pack.json",
  });
  assert.deepEqual(envelope.modState["builtin.default"], { foo: 1 });
});

test("child 29 main.ts primary startup no longer depends on legacy startup adapters", () => {
  const mainSource = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.doesNotMatch(mainSource, /legacy-main-adapter/);
  assert.doesNotMatch(mainSource, /mod-runtime-main-adapter/);
  assert.doesNotMatch(mainSource, /bootstrapLegacyMain/);
  assert.doesNotMatch(mainSource, /toLegacyBootstrapInput/);
  assert.doesNotMatch(mainSource, /builtinLegacyBootstrapInput|legacyEngineSession/);
  assert.match(
    mainSource,
    /createActiveGameContentContextFromModActivation\(\{[\s\S]*activationResult:\s*builtinStartupActivation/
  );
});

test("loadSaveEnvelope normalizes a legacy save into the current envelope", async () => {
  const { loadSaveEnvelope } = require("../.test-dist/core/save/save-loader.js");
  const normalized = loadSaveEnvelope(
    {
      version: "0.9.0",
      selectedModId: "builtin.default",
      state: {
        flags: { started: true },
        variables: { stage: 1 },
      },
    },
    { availableModIds: ["builtin.default"] }
  );

  assert.equal(normalized.selectedModId, "builtin.default");
  assert.equal(normalized.engineState.selectedModId, "builtin.default");
  assert.deepEqual(normalized.selectedModSource, {
    kind: "builtin",
    modId: "builtin.default",
  });
  assert.equal(normalized.runtimeState.flags.started, true);
  assert.equal(normalized.runtimeState.variables.stage, 1);
});

test("loadSaveEnvelope rejects a missing selected mod id", async () => {
  const { loadSaveEnvelope } = require("../.test-dist/core/save/save-loader.js");

  assert.throws(() =>
    loadSaveEnvelope(
      {
        version: "1.0.0",
        selectedModId: "missing.mod",
        engineState: {
          selectedModId: "missing.mod",
          version: "1.0.0",
          currentView: "map",
        },
        runtimeState: {
          flags: {},
          variables: {},
          activeEventId: null,
          activeTaskIds: [],
        },
        modState: {},
      },
      { availableModIds: ["builtin.default"] }
    )
  );
});

test("serializeSaveEnvelope preserves unknown mod payload after load", async () => {
  const { loadSaveEnvelope } = require("../.test-dist/core/save/save-loader.js");
  const { serializeSaveEnvelope } = require("../.test-dist/core/save/save-writer.js");
  const loaded = loadSaveEnvelope(
    {
      version: "1.0.0",
      selectedModId: "builtin.default",
      selectedModSource: {
        kind: "file",
        name: "Imported Pack",
        filePath: "mods/imported-pack/pack.json",
      },
      engineState: {
        selectedModId: "builtin.default",
        version: "1.0.0",
        currentView: "map",
      },
      runtimeState: {
        flags: {},
        variables: {},
        activeEventId: null,
        activeTaskIds: [],
      },
      modState: {
        "builtin.default": { foo: 1 },
        "unknown.mod": { nested: { keep: true } },
      },
    },
    { availableModIds: ["builtin.default"] }
  );

  const serialized = serializeSaveEnvelope(loaded);
  const parsed = JSON.parse(serialized);
  assert.deepEqual(parsed.selectedModSource, {
    kind: "file",
    name: "Imported Pack",
    filePath: "mods/imported-pack/pack.json",
  });
  assert.deepEqual(parsed.modState["unknown.mod"], { nested: { keep: true } });
});

test("save migration upgrades legacy runtime state to the current envelope version", async () => {
  const { migrateSaveEnvelope } = require("../.test-dist/core/save/save-migrations.js");
  const migrated = migrateSaveEnvelope({
    version: "0.8.0",
    selectedModId: "builtin.default",
    state: {
      flags: { started: true },
    },
  });

  assert.equal(migrated.version, "1.0.0");
  assert.equal(migrated.runtimeState.flags.started, true);
});

test("runtime request contract supports navigation external entry ids", async () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/navigation-runtime.ts"),
    "utf8"
  );

  assert.match(source, /createEnterCityRequest/);
  assert.match(source, /createEnterHouseRequest/);
});

test("time runtime creates a typed day-start request", async () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/time-runtime.ts"),
    "utf8"
  );

  assert.match(source, /createDayStartRequest/);
});

test("event runtime exports candidate selection and activation seams", async () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/event-runtime.ts"),
    "utf8"
  );

  assert.match(source, /selectEventCandidate/);
  assert.match(source, /activateEvent/);
});

test("scene runtime accepts an activated event handoff", async () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/scene-runtime.ts"),
    "utf8"
  );

  assert.match(source, /runSceneFromEvent/);
});

test("main.ts no longer imports application house-runtime directly for production ownership", () => {
  const mainSource = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.doesNotMatch(mainSource, /application\/house\/house-runtime/);
  assert.match(mainSource, /legacy-house-adapter|core\/runtime\/house-runtime/);
});

test("interactive runtime exports launch and action seams", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/interactive-runtime.ts"),
    "utf8"
  );

  assert.match(source, /createLaunchInteractiveRequest/);
  assert.match(source, /runInteractiveRuntime/);
});

test("interactive runtime contract exports launch action exit and result seams", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/interactive-runtime.ts"),
    "utf8"
  );

  assert.match(source, /export type LaunchInteractiveRequest =/);
  assert.match(source, /export type InteractiveActionRequest =/);
  assert.match(source, /export type ExitInteractiveRequest =/);
  assert.match(source, /export type InteractiveRuntimeRequest =/);
  assert.match(source, /export type InteractiveRuntimeResult =/);
  assert.match(source, /session: ActiveInteractiveRuntimeSession \| null/);
});

test("covered interactive flow is runtime-owned", () => {
  const {
    CITY_BEGGING_DURATION_DAYS,
    applyCityBeggingMiniGameCompletion,
    createCityBeggingMiniGameState,
  } = require("../.test-dist/application/minigames/city-begging-minigame.js");
  const {
    convertHouseActivityDaysToSegments,
  } = require("../.test-dist/application/house/house-activity-costs.js");
  const {
    createInteractiveActionRequest,
    runInteractiveRuntime,
  } = require("../.test-dist/core/runtime/interactive-runtime.js");
  const {
    createAdvanceTimeSegmentsRequest,
    runTimeRuntime,
  } = require("../.test-dist/core/runtime/time-runtime.js");

  const completionResult = {
    foodGain: 3,
    goldGain: 7,
    maxCombo: 5,
    success: true,
  };
  const baseState = createBaseState();
  const appliedCompletion = applyCityBeggingMiniGameCompletion(
    baseState,
    prototypeCharacters,
    playerCharacterId,
    completionResult
  );
  const expectedGameState = runTimeRuntime({
    state: appliedCompletion.state,
    request: createAdvanceTimeSegmentsRequest(
      convertHouseActivityDaysToSegments(CITY_BEGGING_DURATION_DAYS)
    ),
  }).state;
  const runtimeResult = runInteractiveRuntime({
    state: {
      core: baseState,
      app: {
        beggingMiniGameState: createCityBeggingMiniGameState(0),
        autoAdvanceState: null,
        cityDirectoryState: null,
        locationDialogueState: null,
      },
      view: {},
    },
    request: createInteractiveActionRequest(
      "interactive.city-begging.complete",
      { result: completionResult }
    ),
    characterDefinitions: prototypeCharacters,
    playerCharacterId,
  });
  const mainSource = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );
  const adapterSource = fs.readFileSync(
    path.join(process.cwd(), "src/core/adapters/legacy-interactive-adapter.ts"),
    "utf8"
  );
  const onBeggingGameCompleteBlock = mainSource.match(
    /function onBeggingGameComplete[\s\S]*?\n}\n/
  )?.[0] ?? "";

  assert.equal(runtimeResult.state.app.beggingMiniGameState, null);
  assert.deepEqual(runtimeResult.state.core.calendar, expectedGameState.calendar);
  assert.equal(
    runtimeResult.state.core.world.timeOfDay,
    expectedGameState.world.timeOfDay
  );
  assert.equal(
    getPlayerCharacter(runtimeResult.characterDefinitions).stats.gold,
    getPlayerCharacter(appliedCompletion.characterDefinitions).stats.gold
  );
  assert.doesNotMatch(onBeggingGameCompleteBlock, /runTimeRuntime\(/);
  assert.doesNotMatch(adapterSource, /applyLegacyCityBeggingCompletion/);
  assert.doesNotMatch(adapterSource, /createLegacyCityBeggingSession/);
  assert.doesNotMatch(adapterSource, /updateLegacyCityBeggingPointer/);
  assert.doesNotMatch(adapterSource, /tickLegacyCityBeggingSession/);
});

test("minigame dispatch contract converges covered flows through one interactive request normalizer", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/interactive-runtime.ts"),
    "utf8"
  );

  assert.match(source, /createExitInteractiveRequest/);
  assert.match(source, /toInteractiveRuntimeRequest/);
  assert.match(source, /InteractiveRuntimeRequest/);
  assert.match(source, /InteractiveRuntimeResult/);
  assert.match(source, /activity-qte/);
  assert.match(source, /city-begging/);
  assert.match(source, /story-battle/);
});

test("child 14 interactive runtime no longer depends on legacy adapter-owned qte or story-battle ownership", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/interactive-runtime.ts"),
    "utf8"
  );

  assert.doesNotMatch(source, /legacy-interactive-adapter/);
  assert.doesNotMatch(source, /tickLegacyActivityQte/);
  assert.doesNotMatch(source, /stopLegacyActivityQte/);
  assert.doesNotMatch(source, /dispatchLegacyStoryBattleAction/);
});

test("child 14 activity qte result close routes through interactive runtime exit instead of direct clearActivityResult helper", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );
  const closeActivityResultBlock = source.match(
    /function closeCurrentActivityResult\(\)[\s\S]*?\n}\n/
  )?.[0] ?? "";

  assert.doesNotMatch(source, /clearActivityResult/);
  assert.match(closeActivityResultBlock, /createExitInteractiveRequest\("activity-qte"\)/);
  assert.match(closeActivityResultBlock, /runInteractiveRuntime/);
});

test("child 15 covered enter-city path routes through shared runtime dispatch instead of direct runNavigationRuntime helper", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );
  const handleModalConfirmBlock = source.match(
    /function handleModalConfirm\(\)[\s\S]*?\r?\n}\r?\n\r?\nfunction getFacingDegrees/
  )?.[0] ?? "";

  assert.doesNotMatch(handleModalConfirmBlock, /runNavigationRuntime\(/);
  assert.match(handleModalConfirmBlock, /commitRuntimeRequest\(/);
  assert.match(handleModalConfirmBlock, /createEnterCityRequest\(/);
  assert.match(
    handleModalConfirmBlock,
    /handleOutcome:\s*\(\{\s*state,\s*outcome\s*\}\)\s*=>[\s\S]*navigationTimeFollowUp\.applyOutcome\(\{\s*state,\s*outcome\s*\}\)/
  );
});

test("child 15 covered day-start path routes through shared runtime dispatch instead of direct runTimeRuntime helper", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );
  const startMapAutoAdvanceBlock = source.match(
    /function startMapAutoAdvance\(input: \{[\s\S]*?\r?\n}\r?\n\r?\nfunction advanceCurrentStoryScene/
  )?.[0] ?? "";

  assert.doesNotMatch(startMapAutoAdvanceBlock, /runTimeRuntime\(/);
  assert.match(startMapAutoAdvanceBlock, /commitRuntimeRequest\(/);
  assert.match(startMapAutoAdvanceBlock, /createDayStartRequest\(/);
  assert.match(startMapAutoAdvanceBlock, /handleOutcome:\s*\(\{\s*state,\s*outcome\s*\}\)\s*=>/);
});

test("child 15 covered advance-segments travel paths route through shared runtime dispatch instead of direct runTimeRuntime helper", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );
  const handleModalConfirmBlock = source.match(
    /function handleModalConfirm\(\)[\s\S]*?\r?\n}\r?\n\r?\nfunction getFacingDegrees/
  )?.[0] ?? "";
  const startCampaignTravelBlock = source.match(
    /function startCampaignTravel\([\s\S]*?\r?\n}\r?\n\r?\nfunction animateCampaignMove/
  )?.[0] ?? "";

  assert.doesNotMatch(handleModalConfirmBlock, /runTimeRuntime\(/);
  assert.doesNotMatch(startCampaignTravelBlock, /runTimeRuntime\(/);
  assert.match(handleModalConfirmBlock, /createAdvanceTimeSegmentsRequest\(1\)/);
  assert.match(startCampaignTravelBlock, /createAdvanceTimeSegmentsRequest\(1\)/);
  assert.match(handleModalConfirmBlock, /commitRuntimeRequest\(/);
  assert.match(startCampaignTravelBlock, /commitRuntimeRequest\(/);
});

test("child 16 story trigger helper routes through one runtime-owned seam instead of direct event and scene stitching", () => {
  const followUpSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/application/runtime/main-runtime-orchestrator.ts"
    ),
    "utf8"
  );
  const navigationFollowUpSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/application/runtime/navigation-time-follow-up.ts"
    ),
    "utf8"
  );

  assert.doesNotMatch(followUpSource, /runEventRuntime\(/);
  assert.doesNotMatch(followUpSource, /runSceneFromEvent\(/);
  assert.match(navigationFollowUpSource, /runStoryTriggerRuntime\(/);
});

test("child 16 covered city-enter story handoff stays on the shared trigger seam", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );
  const handleModalConfirmBlock = source.match(
    /function handleModalConfirm\(\)[\s\S]*?\r?\n}\r?\n\r?\nfunction getFacingDegrees/
  )?.[0] ?? "";

  assert.match(
    handleModalConfirmBlock,
    /handleOutcome:\s*\(\{\s*state,\s*outcome\s*\}\)\s*=>[\s\S]*navigationTimeFollowUp\.applyOutcome\(\{\s*state,\s*outcome\s*\}\)/
  );
  assert.doesNotMatch(handleModalConfirmBlock, /runEventRuntime\(/);
  assert.doesNotMatch(handleModalConfirmBlock, /runSceneFromEvent\(/);
});

test("child 16 covered indoor-screen-shown story handoff stays on the shared trigger seam", () => {
  const source = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/application/runtime/indoor-screen-story-follow-up.ts"
    ),
    "utf8"
  );

  assert.match(source, /applyIndoorScreenStoryFollowUp/);
  assert.match(source, /"indoor-screen-shown"/);
  assert.doesNotMatch(source, /runEventRuntime\(/);
  assert.doesNotMatch(source, /runSceneFromEvent\(/);
});

test("effect settlement contract exports emitter applier input and result seams", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/effect-settlement.ts"),
    "utf8"
  );

  assert.match(source, /export type EffectEmitter =/);
  assert.match(source, /export type EffectSettlementApplier =/);
  assert.match(source, /export type EffectSettlementInput =/);
  assert.match(source, /export type EffectSettlementResult =/);
  assert.match(source, /unsupportedEffects:/);
  assert.match(source, /warnings:/);
});

test("runtime settlement uses explicit contract and reports unsupported effect kinds", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/runtime-settlement.ts"),
    "utf8"
  );

  assert.match(source, /import type \{[\s\S]*EffectSettlementInput[\s\S]*EffectSettlementResult[\s\S]*\}/);
  assert.match(source, /export function settleRuntimeEffects/);
  assert.match(source, /unsupportedEffects/);
  assert.match(source, /warnings/);
  assert.doesNotMatch(source, /runTask|activateEvent|renderApp|writeSave/);
});

test("runtime spine commit helper is exported from state sync runtime", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/state-sync-runtime.ts"),
    "utf8"
  );

  assert.match(source, /import \{ dispatchRuntimeRequest \} from "\.\/runtime-dispatch"/);
  assert.match(source, /export function commitRuntimeRequest/);
  assert.match(source, /createRuntimeBridgeState/);
  assert.match(source, /applyRuntimeBridgeState/);
});

test("main runtime orchestration uses shared runtime commit helper for covered dispatch paths", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );
  const startMapAutoAdvanceBlock = source.match(
    /function startMapAutoAdvance\(input: \{[\s\S]*?\r?\n}\r?\n\r?\nfunction advanceCurrentStoryScene/
  )?.[0] ?? "";
  const dispatchCurrentStoryBattleActionBlock = source.match(
    /function dispatchCurrentStoryBattleAction\(actionId: string\): void \{[\s\S]*?\r?\n}\r?\n\r?\ntype BattleDemoResultMessage/
  )?.[0] ?? "";
  const handleModalConfirmBlock = source.match(
    /function handleModalConfirm\(\)[\s\S]*?\r?\n}\r?\n\r?\nfunction getFacingDegrees/
  )?.[0] ?? "";
  const startCampaignTravelBlock = source.match(
    /function startCampaignTravel\([\s\S]*?\r?\n}\r?\n\r?\nfunction animateCampaignMove/
  )?.[0] ?? "";

  assert.match(startMapAutoAdvanceBlock, /commitRuntimeRequest\(/);
  assert.match(dispatchCurrentStoryBattleActionBlock, /commitRuntimeRequest\(/);
  assert.match(handleModalConfirmBlock, /commitRuntimeRequest\(/);
  assert.match(startCampaignTravelBlock, /commitRuntimeRequest\(/);

  assert.doesNotMatch(startMapAutoAdvanceBlock, /createRuntimeBridgeState\(/);
  assert.doesNotMatch(startMapAutoAdvanceBlock, /applyRuntimeBridgeState\(/);
  assert.doesNotMatch(dispatchCurrentStoryBattleActionBlock, /createInteractiveRuntimeState\(/);
  assert.doesNotMatch(dispatchCurrentStoryBattleActionBlock, /applyInteractiveRuntimeState\(/);
  assert.doesNotMatch(handleModalConfirmBlock, /createRuntimeBridgeState\(/);
  assert.doesNotMatch(handleModalConfirmBlock, /applyRuntimeBridgeState\(/);
  assert.doesNotMatch(startCampaignTravelBlock, /createRuntimeBridgeState\(/);
  assert.doesNotMatch(startCampaignTravelBlock, /applyRuntimeBridgeState\(/);
});

test("interactive covered main write-back paths use shared runtime commit helper", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );
  const onBeggingGameCompleteBlock = source.match(
    /function onBeggingGameComplete[\s\S]*?\n}\n/
  )?.[0] ?? "";
  const syncCityBeggingMiniGamePointerBlock = source.match(
    /function syncCityBeggingMiniGamePointer\(clientX: number\): void \{[\s\S]*?\r?\n}\r?\n\r?\nfunction tickCityBeggingMiniGame/
  )?.[0] ?? "";
  const tickCityBeggingMiniGameBlock = source.match(
    /function tickCityBeggingMiniGame\(timestamp: number\): void \{[\s\S]*?\r?\n}\r?\n\r?\nfunction startCityBeggingMiniGameLoop/
  )?.[0] ?? "";
  const openBeggingMiniGameBlock = source.match(
    /function openBeggingMiniGame\(\): void \{[\s\S]*?\r?\n}\r?\n\r?\nfunction createHouseRuntimeInstance/
  )?.[0] ?? "";
  const stopCurrentActivityQteBlock = source.match(
    /function stopCurrentActivityQte\(\): void \{[\s\S]*?\r?\n}\r?\n\r?\nfunction closeCurrentActivityResult/
  )?.[0] ?? "";
  const closeCurrentActivityResultBlock = source.match(
    /function closeCurrentActivityResult\(\): void \{[\s\S]*?\r?\n}\r?\n\r?\nfunction startMapAutoAdvance/
  )?.[0] ?? "";

  for (const block of [
    onBeggingGameCompleteBlock,
    syncCityBeggingMiniGamePointerBlock,
    tickCityBeggingMiniGameBlock,
    openBeggingMiniGameBlock,
    stopCurrentActivityQteBlock,
    closeCurrentActivityResultBlock,
  ]) {
    assert.match(block, /commitRuntimeRequest\(/);
    assert.doesNotMatch(block, /createInteractiveRuntimeState\(/);
    assert.doesNotMatch(block, /applyInteractiveRuntimeResult\(/);
  }
});

test("covered settlement path stays on shared runtime ownership", () => {
  const {
    CITY_BEGGING_DURATION_DAYS,
    applyCityBeggingMiniGameCompletion,
    createCityBeggingMiniGameState,
  } = require("../.test-dist/application/minigames/city-begging-minigame.js");
  const {
    convertHouseActivityDaysToSegments,
  } = require("../.test-dist/application/house/house-activity-costs.js");
  const {
    createInteractiveActionRequest,
    runInteractiveRuntime,
  } = require("../.test-dist/core/runtime/interactive-runtime.js");
  const {
    createAdvanceTimeSegmentsRequest,
    runTimeRuntime,
  } = require("../.test-dist/core/runtime/time-runtime.js");
  const {
    createHouseRuntimeBridge,
    dispatchHouseRuntimeRequest,
    enterHouseThroughRuntime,
  } = require("../.test-dist/core/runtime/house-runtime.js");

  const completionResult = {
    foodGain: 3,
    goldGain: 7,
    maxCombo: 5,
    success: true,
  };
  const baseState = createBaseState();
  const appliedCompletion = applyCityBeggingMiniGameCompletion(
    baseState,
    prototypeCharacters,
    playerCharacterId,
    completionResult
  );
  const expectedInteractiveState = runTimeRuntime({
    state: appliedCompletion.state,
    request: createAdvanceTimeSegmentsRequest(
      convertHouseActivityDaysToSegments(CITY_BEGGING_DURATION_DAYS)
    ),
  }).state;
  const interactiveResult = runInteractiveRuntime({
    state: {
      core: baseState,
      app: {
        beggingMiniGameState: createCityBeggingMiniGameState(0),
        autoAdvanceState: null,
        cityDirectoryState: null,
        locationDialogueState: null,
      },
      view: {},
    },
    request: createInteractiveActionRequest(
      "interactive.city-begging.complete",
      { result: completionResult }
    ),
    characterDefinitions: prototypeCharacters,
    playerCharacterId,
  });

  let appState = {
    gameState: {
      ...baseState,
      world: {
        ...baseState.world,
        currentHouseId: null,
        timeOfDay: "morning",
      },
      ui: {
        ...baseState.ui,
        currentView: "city",
        overlayView: null,
        houseSession: null,
      },
    },
    characterDefinitions: prototypeCharacters,
    playerCoordinate: { x: 0, y: 0 },
    campaignActorState: {
      facingDegrees: 0,
      isMoving: false,
    },
    campaignTravelState: null,
    modalState: null,
    locationDialogueState: null,
    beggingMiniGameState: null,
    cityMenuState: null,
    cityDirectoryState: null,
    autoAdvanceState: null,
    uiLayouts: {},
    layoutEditor: {},
  };
  const houseRuntime = createHouseRuntimeBridge({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp: () => {},
    startMapAutoAdvance: () => {},
    stopMapAutoAdvance: () => {},
    houseDefinitions: prototypeHouses,
    playerCharacterId,
    eventDefinitionsById: {},
    sceneDefinitionsById: {},
    syncCouncilPriorityAfterGameStateChange: () => false,
  });
  const interactiveSource = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/interactive-runtime.ts"),
    "utf8"
  );
  const houseRuntimeSource = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/house-runtime.ts"),
    "utf8"
  );
  const settlementSource = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/runtime-settlement.ts"),
    "utf8"
  );

  enterHouseThroughRuntime(houseRuntime, grainShopHouse.id);
  dispatchHouseRuntimeRequest(houseRuntime, {
    type: "action",
    actionId: "advance-greeting",
  });
  dispatchHouseRuntimeRequest(houseRuntime, {
    type: "action",
    actionId: "investigate",
  });

  assert.deepEqual(
    interactiveResult.state.core.calendar,
    expectedInteractiveState.calendar
  );
  assert.equal(
    interactiveResult.state.core.world.timeOfDay,
    expectedInteractiveState.world.timeOfDay
  );
  assert.equal(appState.gameState.world.timeOfDay, "afternoon");
  assert.equal(appState.gameState.ui.houseSession?.state?.overlay?.type, "alert");
  assert.match(settlementSource, /effect\.type === "advanceTime"/);
  assert.doesNotMatch(interactiveSource, /runTimeRuntime\(/);
  assert.doesNotMatch(houseRuntimeSource, /advanceGameStateTimeSegments\(/);
});

test("house runtime request contract exports enter leave and dispatch variants", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/house-runtime.ts"),
    "utf8"
  );

  assert.match(source, /export type HouseRuntimeSessionRequest =/);
  assert.match(source, /export type EnterHouseRuntimeRequest =/);
  assert.match(source, /export type LeaveHouseRuntimeRequest =/);
  assert.match(source, /export type DispatchHouseRuntimeRequest =/);
  assert.match(source, /export type HouseRuntimeRequest =/);
});

test("house runtime bridge consumes core-owned request contract instead of domain request leakage", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/house-runtime.ts"),
    "utf8"
  );

  assert.match(source, /import type \{[\s\S]*HouseRuntimeRequest[\s\S]*\} from "\.\.\/contracts\/house-runtime"/);
  assert.match(source, /dispatchHouseRuntimeRequest/);
  assert.doesNotMatch(source, /import type \{ HouseModuleRequest \} from "\.\.\/\.\.\/domain\/house-module"/);
  assert.doesNotMatch(source, /request: HouseModuleRequest/);
});

test("core house runtime bridge exports enter leave and dispatch seams", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/house-runtime.ts"),
    "utf8"
  );

  assert.match(source, /enterHouseThroughRuntime/);
  assert.match(source, /leaveHouseThroughRuntime/);
  assert.match(source, /dispatchHouseRuntimeRequest/);
});

test("house module registry exposes a shared registration seam for mod-owned modules", () => {
  const registryPath = path.join(
    process.cwd(),
    "src/core/registry/house-module-registry.ts"
  );

  assert.ok(
    fs.existsSync(registryPath),
    "Expected a shared house registry seam under src/core/registry."
  );

  const source = fs.readFileSync(registryPath, "utf8");

  assert.match(source, /export type HouseModuleRegistration/);
  assert.match(source, /export type HouseModuleRegistry/);
  assert.match(source, /createHouseModuleRegistry/);
  assert.match(source, /createBuiltinHouseModuleRegistry/);
});

test("mod house registration removes core runtime dependence on the application static registry", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/house-runtime.ts"),
    "utf8"
  );

  assert.match(source, /HouseModuleRegistry|houseModuleRegistry/);
  assert.doesNotMatch(
    source,
    /from "\.\.\/\.\.\/application\/house-modules\/house-module-registry"/
  );
});

test("loadSaveEnvelope normalizes engine selected mod id to the envelope selected mod id", async () => {
  const { loadSaveEnvelope } = require("../.test-dist/core/save/save-loader.js");
  const normalized = loadSaveEnvelope(
    {
      version: "1.0.0",
      selectedModId: "builtin.default",
      engineState: {
        selectedModId: "mod.mismatched",
        version: "1.0.0",
        currentView: "map",
      },
      runtimeState: {
        flags: {},
        variables: {},
        activeEventId: null,
        activeTaskIds: [],
      },
      modState: {},
    },
    { availableModIds: ["builtin.default"] }
  );

  assert.equal(normalized.selectedModId, "builtin.default");
  assert.equal(normalized.engineState.selectedModId, "builtin.default");
});

test("loadSaveEnvelope preserves imported mod source descriptors for restore", async () => {
  const { loadSaveEnvelope } = require("../.test-dist/core/save/save-loader.js");
  const normalized = loadSaveEnvelope(
    {
      version: "1.0.0",
      selectedModId: "scenario.imported",
      selectedModSource: {
        kind: "url",
        name: "Imported Scenario",
        url: "https://example.com/mods/scenario.imported.json",
      },
      engineState: {
        selectedModId: "scenario.imported",
        version: "1.0.0",
        currentView: "map",
      },
      runtimeState: {
        flags: {},
        variables: { chapter: 2 },
        activeEventId: "event.imported-start",
        activeTaskIds: ["task.imported"],
      },
      modState: {
        "scenario.imported": {
          checkpoint: "city-entry",
        },
      },
    },
    { availableModIds: ["builtin.default"] }
  );

  assert.deepEqual(normalized.selectedModSource, {
    kind: "url",
    name: "Imported Scenario",
    url: "https://example.com/mods/scenario.imported.json",
  });
  assert.equal(normalized.runtimeState.activeEventId, "event.imported-start");
  assert.deepEqual(normalized.runtimeState.activeTaskIds, ["task.imported"]);
});

test("mod house registration removes presenter dependence on the application static registry", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/application/presenter/stage-presenters.ts"),
    "utf8"
  );

  assert.match(source, /HouseModuleRegistry|houseModuleRegistry/);
  assert.doesNotMatch(
    source,
    /from "\.\.\/house-modules\/house-module-registry"/
  );
});

test("house renderer registry resolves renderers through the shared registration seam", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/ui/views/house/house-module-view-registry.ts"),
    "utf8"
  );

  assert.match(source, /HouseModuleRegistry|createBuiltinHouseModuleRegistry|getHouseModuleRenderer/);
  assert.doesNotMatch(source, /export const houseModuleViewRegistry: Record/);
});

test("special house interface documents builtin and mod-owned registration through one seam", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "docs/special-house-interface.md"),
    "utf8"
  );

  assert.match(source, /builtin/i);
  assert.match(source, /mod-owned|mod-facing/i);
  assert.match(source, /shared registration seam/i);
});

test("covered house flow is runtime-owned", () => {
  const {
    createHouseRuntimeBridge,
    dispatchHouseRuntimeRequest,
    enterHouseThroughRuntime,
    leaveHouseThroughRuntime,
  } = require("../.test-dist/core/runtime/house-runtime.js");

  const baseState = createBaseState();
  let appState = {
    gameState: {
      ...baseState,
      world: {
        ...baseState.world,
        currentHouseId: null,
      },
      ui: {
        ...baseState.ui,
        currentView: "city",
        overlayView: null,
        houseSession: null,
      },
    },
    characterDefinitions: prototypeCharacters,
    playerCoordinate: { x: 0, y: 0 },
    campaignActorState: {
      facingDegrees: 0,
      isMoving: false,
    },
    campaignTravelState: null,
    modalState: null,
    locationDialogueState: null,
    beggingMiniGameState: null,
    cityMenuState: null,
    cityDirectoryState: null,
    autoAdvanceState: null,
    uiLayouts: {},
    layoutEditor: {},
  };
  let renderCount = 0;

  const runtime = createHouseRuntimeBridge({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp: () => {
      renderCount += 1;
    },
    startMapAutoAdvance: () => {},
    stopMapAutoAdvance: () => {},
    houseDefinitions: prototypeHouses,
    playerCharacterId,
    eventDefinitionsById: {},
    sceneDefinitionsById: {},
    syncCouncilPriorityAfterGameStateChange: () => false,
  });
  const houseRuntimeSource = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/house-runtime.ts"),
    "utf8"
  );
  const adapterSource = fs.readFileSync(
    path.join(process.cwd(), "src/core/adapters/legacy-house-adapter.ts"),
    "utf8"
  );

  enterHouseThroughRuntime(runtime, grainShopHouse.id);
  assert.equal(appState.gameState.world.currentHouseId, grainShopHouse.id);
  assert.equal(appState.gameState.ui.currentView, "house");
  assert.equal(appState.gameState.ui.houseSession?.moduleId, "grain-shop");
  assert.equal(
    appState.gameState.ui.houseSession?.state?.dialoguePhase,
    "greeting"
  );

  dispatchHouseRuntimeRequest(runtime, {
    type: "action",
    actionId: "advance-greeting",
  });
  assert.equal(
    appState.gameState.ui.houseSession?.state?.dialoguePhase,
    "open"
  );

  leaveHouseThroughRuntime(runtime);
  assert.equal(appState.gameState.world.currentHouseId, null);
  assert.equal(appState.gameState.ui.currentView, "city");
  assert.equal(appState.gameState.ui.houseSession, null);
  assert.equal(renderCount, 3);

  assert.doesNotMatch(
    houseRuntimeSource,
    /createLegacyHouseRuntimeAdapter|LegacyHouseRuntimeAdapter|dispatchLegacyHouseRuntimeRequest/
  );
  assert.doesNotMatch(adapterSource, /createHouseRuntime/);
  assert.doesNotMatch(adapterSource, /enterHouseById|leaveCurrentHouse|dispatchCurrentHouseRequest/);
});

test("child 13 house runtime bridge owns reenter-house follow-up", () => {
  const { createHouseRuntimeBridge } = require("../.test-dist/core/runtime/house-runtime.js");

  const baseState = createBaseState();
  let appState = {
    gameState: {
      ...baseState,
      world: {
        ...baseState.world,
        currentHouseId: null,
      },
      ui: {
        ...baseState.ui,
        currentView: "city",
        overlayView: null,
        houseSession: null,
      },
    },
    characterDefinitions: prototypeCharacters,
    playerCoordinate: { x: 0, y: 0 },
    campaignActorState: {
      facingDegrees: 0,
      isMoving: false,
    },
    campaignTravelState: null,
    modalState: null,
    locationDialogueState: null,
    beggingMiniGameState: null,
    cityMenuState: null,
    cityDirectoryState: null,
    autoAdvanceState: null,
    uiLayouts: {},
    layoutEditor: {},
  };
  let renderCount = 0;

  const runtime = createHouseRuntimeBridge({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp: () => {
      renderCount += 1;
    },
    startMapAutoAdvance: () => {},
    stopMapAutoAdvance: () => {},
    houseDefinitions: prototypeHouses,
    playerCharacterId,
    eventDefinitionsById: {},
    sceneDefinitionsById: {},
    syncCouncilPriorityAfterGameStateChange: () => false,
  });

  const runtimeState = runtime.applyInteractiveFollowUp({
    type: "reenter-house",
    houseId: grainShopHouse.id,
  });

  assert.equal(appState.gameState.world.currentHouseId, grainShopHouse.id);
  assert.equal(appState.gameState.ui.currentView, "house");
  assert.equal(appState.gameState.ui.houseSession?.moduleId, "grain-shop");
  assert.equal(runtimeState.core.world.currentHouseId, grainShopHouse.id);
  assert.equal(runtimeState.core.ui.currentView, "house");
  assert.equal(renderCount, 0);
});

test("main.ts routes covered interactive flows through core runtime instead of direct feature branching", () => {
  const mainSource = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.match(mainSource, /runInteractiveRuntime/);
});

test("runtime state contract exports core app and view partitions", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/runtime-state.ts"),
    "utf8"
  );

  assert.match(source, /export type RuntimeState/);
  assert.match(source, /core:/);
  assert.match(source, /app:/);
  assert.match(source, /view:/);
});

test("runtime result state is widened to RuntimeState", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/runtime-result.ts"),
    "utf8"
  );

  assert.match(source, /import type \{ RuntimeState \}/);
  assert.match(source, /state: RuntimeState/);
});

test("shared runtime dispatch routes RuntimeState instead of CoreGameState only", () => {
  const dispatchSource = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/runtime-dispatch.ts"),
    "utf8"
  );
  const routerSource = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/runtime-router.ts"),
    "utf8"
  );

  assert.match(dispatchSource, /RuntimeState/);
  assert.match(routerSource, /RuntimeState/);
});

test("interactive runtime returns shared RuntimeResult instead of private appState result", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/interactive-runtime.ts"),
    "utf8"
  );

  assert.match(source, /RuntimeResult/);
  assert.doesNotMatch(source, /type InteractiveRuntimeResult = \{[\s\S]*appState:/);
});

test("ui/app-render.ts no longer imports gameplay selection helpers directly", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/ui/app-render.ts"),
    "utf8"
  );

  assert.doesNotMatch(source, /getHouseModule/);
  assert.doesNotMatch(source, /isCityEntryVisibleForStoryStage/);
  assert.doesNotMatch(source, /selectCityNpcSummariesForHouse/);
});

test("application presenter exports a top-level presenter output seam", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/application/presenter/app-presenter.ts"),
    "utf8"
  );

  assert.match(source, /createAppPresenterOutput/);
});

test("main.ts assembles render input through application presenter output", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.match(source, /createAppPresenterOutput/);
});

test("task runtime contract exports definition instance state action signal and result seams", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/task-runtime.ts"),
    "utf8"
  );

  assert.match(source, /export type TaskDefinition/);
  assert.match(source, /export type TaskInstance/);
  assert.match(source, /export type TaskRuntimeState/);
  assert.match(source, /export type TaskAction/);
  assert.match(source, /export type TaskSignal/);
  assert.match(source, /export type TaskUpdate/);
  assert.match(source, /export type TaskRuntimeResult/);
});

test("main.ts keeps covered runtime commits supplied with active task definitions", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.match(
    source,
    /(taskDefinitionsById:\s*activeContentContext\.taskDefinitionsById|taskDefinitionsById:\s*activeTaskDefinitionsById)/
  );
});

test("task runtime exports lifecycle and signal progression entrypoints", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/task-runtime.ts"),
    "utf8"
  );

  assert.match(source, /startTask/);
  assert.match(source, /applyTaskAction/);
  assert.match(source, /applyTaskSignal/);
});

test("task runtime starts one instance per task id and rejects duplicate active start", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/task-runtime.ts"),
    "utf8"
  );

  assert.match(source, /instancesByTaskId/);
  assert.match(source, /duplicate-active-task/);
});

test("task runtime broadcasts one signal to multiple active tasks", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/task-runtime.ts"),
    "utf8"
  );

  assert.match(source, /applyTaskSignal/);
  assert.match(source, /Object\.values\(state\.instancesByTaskId\)/);
});

test("task runtime treats failed tasks as terminal", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/task-runtime.ts"),
    "utf8"
  );

  assert.match(source, /failed-is-terminal/);
});

test("task runtime result carries task updates effects and signals without applying effects", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/task-runtime.ts"),
    "utf8"
  );

  assert.match(source, /taskUpdates/);
  assert.match(source, /effects/);
  assert.match(source, /signals/);
});

test("task runtime progresses active tasks from one broadcast signal without applying effects", () => {
  const {
    applyTaskAction,
    applyTaskSignal,
    createEmptyTaskRuntimeState,
  } = require("../.test-dist/core/runtime/task-runtime.js");

  const definitionsById = {
    "meet-scholar": {
      id: "meet-scholar",
      title: "Meet Scholar",
      objectives: [{ id: "meet", target: 1, signalType: "npc-met" }],
      onCompleteEffects: [{ type: "setFlag", key: "task.meet.done", value: true }],
    },
    "report-scholar": {
      id: "report-scholar",
      title: "Report Scholar",
      objectives: [{ id: "report", target: 1, signalType: "npc-met" }],
      onCompleteEffects: [{ type: "setFlag", key: "task.report.done", value: true }],
    },
  };

  let state = createEmptyTaskRuntimeState("2026-07-01T00:00:00.000Z");
  state = applyTaskAction({
    state,
    definitionsById,
    action: {
      type: "start",
      taskId: "meet-scholar",
      occurredAt: "2026-07-01T00:01:00.000Z",
    },
  }).state;
  state = applyTaskAction({
    state,
    definitionsById,
    action: {
      type: "start",
      taskId: "report-scholar",
      occurredAt: "2026-07-01T00:02:00.000Z",
    },
  }).state;

  const result = applyTaskSignal({
    state,
    definitionsById,
    signal: {
      type: "npc-met",
      source: "scene-runtime",
      occurredAt: "2026-07-01T00:03:00.000Z",
    },
  });

  assert.equal(result.state.instancesByTaskId["meet-scholar"].status, "completed");
  assert.equal(result.state.instancesByTaskId["report-scholar"].status, "completed");
  assert.deepEqual(result.state.completedTaskIds, [
    "meet-scholar",
    "report-scholar",
  ]);
  assert.equal(result.taskUpdates.filter((update) => update.type === "completed").length, 2);
  assert.deepEqual(result.effects, [
    { type: "setFlag", key: "task.meet.done", value: true },
    { type: "setFlag", key: "task.report.done", value: true },
  ]);
  assert.deepEqual(result.signals, []);
});

test("task runtime applies signal-only failure conditions without objective progress", () => {
  const {
    applyTaskAction,
    applyTaskSignal,
    createEmptyTaskRuntimeState,
  } = require("../.test-dist/core/runtime/task-runtime.js");

  const definitionsById = {
    "timed-report": {
      id: "timed-report",
      title: "Timed Report",
      objectives: [{ id: "report", target: 1, signalType: "report-submitted" }],
      failureConditions: [{ type: "signal", signalType: "deadline-missed" }],
      onFailEffects: [{ type: "setFlag", key: "task.report.failed", value: true }],
    },
  };

  let state = createEmptyTaskRuntimeState("2026-07-01T00:00:00.000Z");
  state = applyTaskAction({
    state,
    definitionsById,
    action: {
      type: "start",
      taskId: "timed-report",
      occurredAt: "2026-07-01T00:01:00.000Z",
    },
  }).state;

  const result = applyTaskSignal({
    state,
    definitionsById,
    signal: {
      type: "deadline-missed",
      source: "time-runtime",
      occurredAt: "2026-07-02T00:00:00.000Z",
    },
  });

  assert.equal(result.state.instancesByTaskId["timed-report"].status, "failed");
  assert.deepEqual(result.state.failedTaskIds, ["timed-report"]);
  assert.deepEqual(result.effects, [
    { type: "setFlag", key: "task.report.failed", value: true },
  ]);
});

test("mod runtime contract exports source state request activation and failure seams", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/mod-runtime.ts"),
    "utf8"
  );

  assert.match(source, /export type ModSourceKind/);
  assert.match(source, /export type LoadedMod/);
  assert.match(source, /export type ActivatedMod/);
  assert.match(source, /export type ModRuntimeState/);
  assert.match(source, /export type ModRuntimeRequest/);
  assert.match(source, /export type ModActivationResult/);
  assert.match(source, /export type ModRuntimeFailure/);
});

test("mod runtime normalizes builtin file and url sources through one source registry seam", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/mods/mod-source-registry.ts"),
    "utf8"
  );

  assert.match(source, /builtin/);
  assert.match(source, /file/);
  assert.match(source, /url/);
  assert.match(source, /normalizeModSource/);
});

test("mod runtime activation is atomic and leaves no partial active mod on failure", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/mods/mod-runtime.ts"),
    "utf8"
  );

  assert.match(source, /activation-failed/);
  assert.match(source, /previousActiveModId/);
  assert.match(source, /rollback/);
});

test("child 29 startup coordinator keeps builtin and scenario startup on one explicit session contract", async () => {
  const {
    runStartupSessionCoordinator,
  } = require("../.test-dist/application/startup/startup-session-coordinator.js");

  const activationResult = {
    ok: true,
    activatedMod: {
      normalizedContentSources: [],
    },
  };
  const contentContext = {
    packId: "pack.base",
    storyContent: {
      eventDefinitionsById: {},
      sceneDefinitionsById: {},
      activityDefinitionsById: {},
      textEntriesById: {},
    },
  };
  const createStartupAppState = () => ({
    gameState: createBaseState(),
    characterDefinitions: prototypeCharacters,
    playerCoordinate: { x: 0, y: 0 },
    campaignActorState: {
      facingDegrees: 0,
      isMoving: false,
    },
    campaignTravelState: null,
    modalState: null,
    locationDialogueState: null,
    beggingMiniGameState: null,
    cityMenuState: null,
    cityDirectoryState: null,
    autoAdvanceState: null,
    uiLayouts: {},
    layoutEditor: {},
  });
  const scenarioPack = {
    id: "scenario.child29",
    schemaVersion: 1,
    title: "Child 29 Scenario",
    scenarioProfile: {
      playerCharacterId: "char.player",
      initialLocation: {
        mapId: "map.world",
        cityId: "city.test",
        houseId: null,
        view: "map",
      },
      entryEventId: "event.scenario.entry",
    },
  };

  const deps = {
    activateBuiltinDefaultMod: async () => activationResult,
    restoreModFromSave: async (saveData) =>
      saveData?.selectedModId === "scenario.child29" ? activationResult : null,
    activateScenarioPackMod: async () => activationResult,
    createPrototypeAppState: () => createStartupAppState(),
    createHaozhouReturnEncounterAppState: (appState) => appState,
    createScenarioPackAppState: () => createStartupAppState(),
    createStartupContentContext: () => contentContext,
    bootstrapStartupStoryAppState: ({ appState }) => appState,
  };

  const builtinResult = await runStartupSessionCoordinator(
    {
      type: "builtin",
      selectedCharacter: prototypeCharacters[0],
    },
    deps
  );
  const scenarioResult = await runStartupSessionCoordinator(
    {
      type: "restore",
      selectedCharacter: prototypeCharacters[0],
      saveData: {
        selectedModId: "scenario.child29",
        selectedModSource: {
          kind: "url",
          name: "Scenario",
          url: "https://example.com/scenario.json",
        },
        selectedCharacterId: "char.player",
      },
    },
    {
      ...deps,
      restoreModFromSave: async () => ({
        ...activationResult,
        activatedMod: {
          ...activationResult.activatedMod,
          normalizedContentSources: [scenarioPack],
        },
      }),
    }
  );

  assert.equal(builtinResult.ok, true);
  assert.equal(scenarioResult.ok, true);
  assert.deepEqual(
    Object.keys(builtinResult.session).sort(),
    Object.keys(scenarioResult.session).sort()
  );
  assert.equal(typeof builtinResult.session.createAppState, "function");
  assert.equal(typeof scenarioResult.session.createAppState, "function");
  assert.equal(builtinResult.session.contentContext, contentContext);
  assert.equal(scenarioResult.session.contentContext, contentContext);
});

test("save restore re-activates selected mod through mod runtime", () => {
  const source = fs.readFileSync(path.join(process.cwd(), "src/main.ts"), "utf8");

  assert.match(source, /restore/i);
  assert.match(source, /runModRuntime|activateSavedMod|restoreModFromSave/);
});

test("child 22 restore path can reload imported mod sources after a fresh page load", () => {
  const source = fs.readFileSync(path.join(process.cwd(), "src/main.ts"), "utf8");
  const restoreBlock = source.match(
    /async function restoreModFromSave\([\s\S]*?\n}\n/
  )?.[0] ?? "";

  assert.match(source, /selectedModSource/);
  assert.match(restoreBlock, /selectedModSource/);
  assert.match(
    restoreBlock,
    /if \(saveData\.selectedModSource != null\) \{[\s\S]*activateSavedModSource/
  );
  assert.match(
    source,
    /function activateSavedModSource|mod\.load-(builtin|file|url)|kind === "builtin"|kind === "file"|kind === "url"/
  );
});

test("child 22 continue path does not overwrite a restored mod by re-entering builtin startup", () => {
  const source = fs.readFileSync(path.join(process.cwd(), "src/main.ts"), "utf8");
  const continueBlock = source.match(
    /function startContinueGameWithLoading\(selectedCharacter: CharacterDefinition\): void \{[\s\S]*?\n}\n/
  )?.[0] ?? "";

  assert.match(continueBlock, /loadSaveData\(\)/);
  assert.match(
    continueBlock,
    /startRestoredGameWithLoading|startActivatedGameWithLoading|runStartupSessionCoordinator/
  );
  assert.doesNotMatch(
    continueBlock,
    /restoreModFromSave\(loadSaveData\(\)\)\s*\.then\(\s*\(\)\s*=>\s*startMainGameWithLoading\(/
  );
});

test("child 22 builtin and imported startup paths share one activated session bootstrap helper", () => {
  const source = fs.readFileSync(path.join(process.cwd(), "src/main.ts"), "utf8");
  assert.match(source, /function applyActivatedModSession|function startActivatedGameSession/);
  const helperUsageCount = (
    source.match(/applyActivatedModSession\(|startActivatedGameSession\(/g) ?? []
  ).length;

  assert.ok(helperUsageCount >= 3);
  assert.doesNotMatch(source, /installScenarioPackContent\(scenarioPack\)/);
});

test("child 23 startup coordinator module exists with a narrow request/result seam", () => {
  const coordinatorPath = path.join(
    process.cwd(),
    "src/application/startup/startup-session-coordinator.ts"
  );

  assert.equal(fs.existsSync(coordinatorPath), true);
  const source = fs.readFileSync(coordinatorPath, "utf8");
  assert.match(source, /export type StartupSessionRequest =/);
  assert.match(source, /export type StartupSessionResult =/);
  assert.match(source, /export async function runStartupSessionCoordinator\(/);
});

test("child 23 main startup extraction delegates startup-family orchestration to the coordinator", () => {
  const source = fs.readFileSync(path.join(process.cwd(), "src/main.ts"), "utf8");

  assert.match(
    source,
    /startup-session-coordinator|runStartupSessionCoordinator/
  );
  const coordinatorUsageCount = (
    source.match(/runStartupSessionCoordinator\(/g) ?? []
  ).length;
  assert.ok(coordinatorUsageCount >= 3);
  assert.doesNotMatch(
    source,
    /const activationResult = await activateBuiltinDefaultMod\(/
  );
  assert.doesNotMatch(
    source,
    /const activationResult = await restoreModFromSave\(saveData\);/
  );
  assert.doesNotMatch(
    source,
    /const loadedScenarioPack = await loadScenarioPackFromUrl\(scenarioPack\.url\);/
  );
});

test("child 23 scenario-pack startup defers app-state bootstrap until after active content sync", () => {
  const coordinatorSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src",
      "application",
      "startup",
      "startup-session-coordinator.ts"
    ),
    "utf8"
  );
  const mainSource = fs.readFileSync(
    path.join(process.cwd(), "src", "main.ts"),
    "utf8"
  );
  const orchestratorSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src",
      "application",
      "runtime",
      "main-runtime-orchestrator.ts"
    ),
    "utf8"
  );

  assert.doesNotMatch(
    coordinatorSource,
    /appState:\s*deps\.createScenarioPackAppState\(scenarioPack\)/
  );
  assert.match(
    coordinatorSource,
    /createAppState:\s*createStartupAppStateBuilder\([\s\S]*deps\.createScenarioPackAppState\(scenarioPack\)/
  );
  assert.match(mainSource, /applyActivatedModSession|mainRuntimeOrchestrator/);
  assert.match(
    orchestratorSource,
    /(setActiveContentContext\(request\.session\.contentContext\)|syncActivatedContentSource\(request\.session\.activationResult\))[\s\S]*const appState = request\.session\.createAppState\(\);/
  );
});

test("child 27 main.ts startup builders no longer directly start story events", () => {
  const source = fs.readFileSync(path.join(process.cwd(), "src/main.ts"), "utf8");
  const scenarioPackBlock = source.match(
    /function createScenarioPackAppState\([\s\S]*?return nextAppState;\r?\n}\r?\n/
  )?.[0] ?? "";
  const haozhouBlock = source.match(
    /function createHaozhouReturnEncounterAppState\([\s\S]*?return nextAppState;\r?\n}\r?\n/
  )?.[0] ?? "";

  assert.doesNotMatch(scenarioPackBlock, /startStoryEventById\(/);
  assert.doesNotMatch(haozhouBlock, /startStoryEventById\(/);
});

test("child 27 startup coordinator exposes bootstrap-complete createAppState for builtin startup", async () => {
  const {
    runStartupSessionCoordinator,
  } = require("../.test-dist/application/startup/startup-session-coordinator.js");

  const baseState = createBaseState();
  const createStartupAppState = () => ({
    gameState: {
      ...baseState,
      scene: {
        ...baseState.scene,
        activeEventId: null,
        activeSceneId: null,
        cursor: 0,
        status: "idle",
      },
    },
    characterDefinitions: prototypeCharacters,
    playerCoordinate: { x: 0, y: 0 },
    campaignActorState: {
      facingDegrees: 0,
      isMoving: false,
    },
    campaignTravelState: null,
    modalState: null,
    locationDialogueState: null,
    beggingMiniGameState: null,
    cityMenuState: null,
    cityDirectoryState: null,
    autoAdvanceState: null,
    uiLayouts: {},
    layoutEditor: {},
  });
  const activationResult = {
    ok: true,
    activatedMod: {
      normalizedContentSources: [],
    },
  };

  const result = await runStartupSessionCoordinator(
    {
      type: "builtin",
      selectedCharacter: prototypeCharacters[0],
      startupScenario: "haozhou-return-encounter",
    },
    {
      activateBuiltinDefaultMod: async () => activationResult,
      restoreModFromSave: async () => null,
      activateScenarioPackMod: async () => activationResult,
      createPrototypeAppState: () => createStartupAppState(),
      createHaozhouReturnEncounterAppState: (appState) => ({
        ...appState,
        gameState: {
          ...appState.gameState,
          world: {
            ...appState.gameState.world,
            currentCityId: "city.kulan",
            currentHouseId: null,
          },
        },
      }),
      createScenarioPackAppState: () => createStartupAppState(),
      createStartupContentContext: () => ({
        packId: "pack.base",
        storyContent: {
          eventDefinitionsById: {},
          sceneDefinitionsById: {},
          activityDefinitionsById: {},
          textEntriesById: {},
        },
      }),
      bootstrapStartupStoryAppState: ({ appState, bootstrap }) => ({
        ...appState,
        gameState: {
          ...appState.gameState,
          scene: {
            ...appState.gameState.scene,
            activeEventId: bootstrap?.eventId ?? null,
            activeSceneId: bootstrap == null ? null : "scene.bootstrapped",
            cursor: bootstrap?.sceneCursor ?? 0,
            status: bootstrap?.sceneStatus ?? "idle",
          },
        },
      }),
    }
  );

  assert.equal(result.ok, true);
  const startupAppState = result.session.createAppState();
  assert.equal(
    startupAppState.gameState.scene.activeEventId,
    "event.story.zhu_yuanzhang.haozhou_return_encounter"
  );
  assert.equal(startupAppState.gameState.scene.cursor, 4);
  assert.equal(startupAppState.gameState.world.currentCityId, "city.kulan");
});

test("child 27 restore scenario startup returns bootstrap-complete app state", async () => {
  const {
    runStartupSessionCoordinator,
  } = require("../.test-dist/application/startup/startup-session-coordinator.js");

  const baseState = createBaseState();
  const createStartupAppState = () => ({
    gameState: {
      ...baseState,
      scene: {
        ...baseState.scene,
        activeEventId: null,
        activeSceneId: null,
        cursor: 0,
        status: "idle",
      },
    },
    characterDefinitions: prototypeCharacters,
    playerCoordinate: { x: 0, y: 0 },
    campaignActorState: {
      facingDegrees: 0,
      isMoving: false,
    },
    campaignTravelState: null,
    modalState: null,
    locationDialogueState: null,
    beggingMiniGameState: null,
    cityMenuState: null,
    cityDirectoryState: null,
    autoAdvanceState: null,
    uiLayouts: {},
    layoutEditor: {},
  });
  const scenarioPack = {
    id: "scenario.test.bootstrap",
    title: "Bootstrap Test",
    scenarioProfile: {
      id: "scenario.test.bootstrap",
      playerCharacterId,
      chapterId: "chapter.prototype",
      initialLocation: {
        mapId: prototypeMap.id,
        cityId: "city.kulan",
        houseId: null,
        view: "city",
      },
      entryEventId: "event.test.bootstrap-entry",
    },
  };
  const activationResult = {
    ok: true,
    activatedMod: {
      normalizedContentSources: [scenarioPack],
    },
  };

  const result = await runStartupSessionCoordinator(
    {
      type: "restore",
      selectedCharacter: prototypeCharacters[0],
      saveData: {
        selectedModId: scenarioPack.id,
      },
    },
    {
      activateBuiltinDefaultMod: async () => activationResult,
      restoreModFromSave: async () => activationResult,
      activateScenarioPackMod: async () => activationResult,
      createPrototypeAppState: () => createStartupAppState(),
      createHaozhouReturnEncounterAppState: (appState) => appState,
      createScenarioPackAppState: () => createStartupAppState(),
      createStartupContentContext: () => ({
        packId: scenarioPack.id,
        storyContent: {
          eventDefinitionsById: {},
          sceneDefinitionsById: {},
          activityDefinitionsById: {},
          textEntriesById: {},
        },
      }),
      bootstrapStartupStoryAppState: ({ appState, bootstrap }) => ({
        ...appState,
        gameState: {
          ...appState.gameState,
          scene: {
            ...appState.gameState.scene,
            activeEventId: bootstrap?.eventId ?? null,
            activeSceneId: bootstrap == null ? null : "scene.scenario-entry",
            cursor: bootstrap?.sceneCursor ?? 0,
            status: bootstrap?.sceneStatus ?? "idle",
          },
        },
      }),
    }
  );

  assert.equal(result.ok, true);
  assert.equal(result.session.playerCharacterId, playerCharacterId);
  const startupAppState = result.session.createAppState();
  assert.equal(
    startupAppState.gameState.scene.activeEventId,
    "event.test.bootstrap-entry"
  );
  assert.equal(startupAppState.gameState.scene.activeSceneId, "scene.scenario-entry");
});

test("child 28 main.ts no longer keeps central active-content mirror write state", () => {
  const source = fs.readFileSync(path.join(process.cwd(), "src/main.ts"), "utf8");

  assert.doesNotMatch(source, /function syncActiveGameContent\(/);
  assert.doesNotMatch(source, /function syncActivatedContentSource\(/);
  assert.doesNotMatch(source, /let activeMapDefinitions: MapDefinition\[] =/);
  assert.doesNotMatch(source, /let cityDefinitions: CityDefinition\[] =/);
  assert.doesNotMatch(source, /let houseDefinitions: HouseDefinition\[] =/);
  assert.doesNotMatch(source, /let textEntriesById = activeGameContent\.textEntriesById/);
  assert.match(source, /activeContentContext|contentContext/);
});

test("child 28 startup coordinator exposes content-context-complete session for builtin startup", async () => {
  const {
    runStartupSessionCoordinator,
  } = require("../.test-dist/application/startup/startup-session-coordinator.js");

  const activationResult = {
    ok: true,
    activatedMod: {
      normalizedContentSources: [],
    },
  };
  const contentContext = {
    packId: "pack.base",
    storyContent: {
      eventDefinitionsById: {},
      sceneDefinitionsById: {},
      activityDefinitionsById: {},
      textEntriesById: {},
    },
  };

  const result = await runStartupSessionCoordinator(
    {
      type: "builtin",
      selectedCharacter: prototypeCharacters[0],
    },
    {
      activateBuiltinDefaultMod: async () => activationResult,
      restoreModFromSave: async () => null,
      activateScenarioPackMod: async () => activationResult,
      createPrototypeAppState: () => ({
        gameState: createBaseState(),
        characterDefinitions: prototypeCharacters,
        playerCoordinate: { x: 0, y: 0 },
        campaignActorState: {
          facingDegrees: 0,
          isMoving: false,
        },
        campaignTravelState: null,
        modalState: null,
        locationDialogueState: null,
        beggingMiniGameState: null,
        cityMenuState: null,
        cityDirectoryState: null,
        autoAdvanceState: null,
        uiLayouts: {},
        layoutEditor: {},
      }),
      createHaozhouReturnEncounterAppState: (appState) => appState,
      createScenarioPackAppState: () => {
        throw new Error("scenario path should not run");
      },
      bootstrapStartupStoryAppState: ({ appState }) => appState,
      createStartupContentContext: () => contentContext,
    }
  );

  assert.equal(result.ok, true);
  assert.equal(result.session.contentContext, contentContext);
  assert.equal(result.session.contentContext.packId, "pack.base");
});

test("child 28 restore scenario startup returns content-context-complete session", async () => {
  const {
    runStartupSessionCoordinator,
  } = require("../.test-dist/application/startup/startup-session-coordinator.js");

  const scenarioPack = {
    id: "scenario.test.content-context",
    title: "Scenario Context",
    scenarioProfile: {
      id: "scenario.test.content-context",
      playerCharacterId,
      chapterId: "chapter.prototype",
      initialLocation: {
        mapId: prototypeMap.id,
        cityId: "city.kulan",
        houseId: null,
        view: "city",
      },
    },
  };
  const activationResult = {
    ok: true,
    activatedMod: {
      normalizedContentSources: [scenarioPack],
    },
  };
  const contentContext = {
    packId: scenarioPack.id,
    storyContent: {
      eventDefinitionsById: {},
      sceneDefinitionsById: {},
      activityDefinitionsById: {},
      textEntriesById: {},
    },
  };

  const result = await runStartupSessionCoordinator(
    {
      type: "restore",
      selectedCharacter: prototypeCharacters[0],
      saveData: {
        selectedModId: scenarioPack.id,
      },
    },
    {
      activateBuiltinDefaultMod: async () => activationResult,
      restoreModFromSave: async () => activationResult,
      activateScenarioPackMod: async () => activationResult,
      createPrototypeAppState: () => ({
        gameState: createBaseState(),
        characterDefinitions: prototypeCharacters,
        playerCoordinate: { x: 0, y: 0 },
        campaignActorState: {
          facingDegrees: 0,
          isMoving: false,
        },
        campaignTravelState: null,
        modalState: null,
        locationDialogueState: null,
        beggingMiniGameState: null,
        cityMenuState: null,
        cityDirectoryState: null,
        autoAdvanceState: null,
        uiLayouts: {},
        layoutEditor: {},
      }),
      createHaozhouReturnEncounterAppState: (appState) => appState,
      createScenarioPackAppState: () => ({
        gameState: createBaseState(),
        characterDefinitions: prototypeCharacters,
        playerCoordinate: { x: 0, y: 0 },
        campaignActorState: {
          facingDegrees: 0,
          isMoving: false,
        },
        campaignTravelState: null,
        modalState: null,
        locationDialogueState: null,
        beggingMiniGameState: null,
        cityMenuState: null,
        cityDirectoryState: null,
        autoAdvanceState: null,
        uiLayouts: {},
        layoutEditor: {},
      }),
      bootstrapStartupStoryAppState: ({ appState }) => appState,
      createStartupContentContext: () => contentContext,
    }
  );

  assert.equal(result.ok, true);
  assert.equal(result.session.playerCharacterId, playerCharacterId);
  assert.equal(result.session.contentContext, contentContext);
  assert.equal(result.session.contentContext.packId, scenarioPack.id);
});

test("child 28 startup apply consumes session content context before app state bootstrap", () => {
  const source = fs.readFileSync(
    path.join(
      process.cwd(),
      "src",
      "application",
      "runtime",
      "main-runtime-orchestrator.ts"
    ),
    "utf8"
  );

  assert.doesNotMatch(source, /syncActivatedContentSource\(request\.session\.activationResult\)/);
  assert.match(
    source,
    /setActiveContentContext\(request\.session\.contentContext\)[\s\S]*const appState = request\.session\.createAppState\(\);/
  );
});

test("child 24 main runtime orchestrator module exists with a narrow request/result seam", () => {
  const orchestratorPath = path.join(
    process.cwd(),
    "src/application/runtime/main-runtime-orchestrator.ts"
  );

  assert.equal(fs.existsSync(orchestratorPath), true);
  const source = fs.readFileSync(orchestratorPath, "utf8");
  assert.match(source, /export type MainRuntimeOrchestratorRequest =/);
  assert.match(source, /export type MainRuntimeOrchestratorResult =/);
  assert.match(source, /export function createMainRuntimeOrchestrator\(/);
});

test("child 24 main runtime follow-up ownership removes covered business orchestration from main.ts", () => {
  const source = fs.readFileSync(path.join(process.cwd(), "src/main.ts"), "utf8");

  assert.match(source, /main-runtime-orchestrator|createMainRuntimeOrchestrator/);
  assert.doesNotMatch(
    source,
    /function applyActivatedModSession[\s\S]*syncActivatedContentSource\(input\.activationResult\)[\s\S]*appState = input\.createAppState\(\);/
  );
  assert.doesNotMatch(
    source,
    /function advanceCurrentStoryScene[\s\S]*advanceStorySceneStep\(/
  );
  assert.doesNotMatch(
    source,
    /function chooseCurrentStoryOption[\s\S]*chooseStorySceneOption\(/
  );
});

test("child 24 passive render trigger extraction removes gameplay mutation from renderApp", () => {
  const source = fs.readFileSync(path.join(process.cwd(), "src/main.ts"), "utf8");

  assert.doesNotMatch(
    source,
    /function renderApp\(\)[\s\S]*syncPassiveStoryTriggers\(\);[\s\S]*createAppPresenterOutput\(/
  );
});

test("child 26 renderApp stays display-only and no longer runs passive indoor follow-up", () => {
  const source = fs.readFileSync(path.join(process.cwd(), "src/main.ts"), "utf8");
  const renderBlock =
    source.match(
      /function renderApp\(\)[\s\S]*?\r?\n}\r?\n\r?\nfunction renderAppFrame/
    )?.[0] ?? "";

  assert.doesNotMatch(renderBlock, /sync-passive-story-triggers/);
  assert.doesNotMatch(renderBlock, /indoor-screen-shown/);
});

test("child 26 story scene settlement re-triggers indoor-screen follow-up before render", () => {
  const {
    createMainRuntimeOrchestrator,
  } = require("../.test-dist/application/runtime/main-runtime-orchestrator.js");

  const indoorEvent = {
    id: "event.test.indoor-screen",
    chapterId: "chapter.prototype",
    name: "Indoor follow-up",
    occurrence: "once",
    trigger: {
      timing: "indoor-screen-shown",
      scope: {
        cityId: "city.kulan",
        houseId: grainShopHouse.id,
      },
    },
    conditions: [],
    entrySceneId: "scene.test.indoor-screen",
  };
  const endScene = {
    id: "scene.test.end-in-house",
    name: "End in house",
    actions: [
      {
        type: "narration",
        text: "Scene ending.",
      },
    ],
  };
  const indoorScene = {
    id: "scene.test.indoor-screen",
    name: "Indoor screen follow-up",
    actions: [
      {
        type: "narration",
        text: "Indoor passive trigger fired.",
      },
    ],
  };
  let appState = {
    gameState: {
      ...createBaseState(),
      scene: {
        activeEventId: "event.test.previous",
        activeSceneId: endScene.id,
        cursor: 0,
        status: "playing",
      },
      ui: {
        ...createBaseState().ui,
        currentView: "scene",
      },
    },
    characterDefinitions: prototypeCharacters,
    playerCoordinate: { x: 0, y: 0 },
    campaignActorState: {
      facingDegrees: 0,
      isMoving: false,
    },
    campaignTravelState: null,
    modalState: null,
    locationDialogueState: null,
    beggingMiniGameState: null,
    cityMenuState: null,
    cityDirectoryState: null,
    autoAdvanceState: null,
    uiLayouts: {},
    layoutEditor: {},
  };
  const orchestrator = createMainRuntimeOrchestrator({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    setPlayerCharacterId: () => {},
    getStoryContent: () => ({
      eventDefinitionsById: {
        [indoorEvent.id]: indoorEvent,
      },
      sceneDefinitionsById: {
        [endScene.id]: endScene,
        [indoorScene.id]: indoorScene,
      },
    }),
    resetMainGameRuntime: () => {},
    syncActivatedContentSource: () => {},
    recreateHouseRuntime: () => {},
    setGameVisibility: () => {},
    hideMainUiFlow: () => {},
  });

  const result = orchestrator.execute({
    type: "advance-story-scene",
  });

  assert.equal(result.appState.gameState.scene.activeEventId, indoorEvent.id);
  assert.equal(result.appState.gameState.scene.activeSceneId, indoorScene.id);
  assert.equal(result.appState.gameState.ui.currentView, "scene");
  assert.equal(
    result.appState.gameState.runtime.eventHistory[indoorEvent.id]?.firedCount,
    1
  );
});

test("child 26 house runtime owns indoor-screen follow-up before render", () => {
  const {
    createHouseRuntimeBridge,
    enterHouseThroughRuntime,
  } = require("../.test-dist/core/runtime/house-runtime.js");

  const indoorEvent = {
    id: "event.test.house-indoor-screen",
    chapterId: "chapter.prototype",
    name: "Indoor follow-up",
    occurrence: "once",
    trigger: {
      timing: "indoor-screen-shown",
      scope: {
        cityId: "city.kulan",
        houseId: grainShopHouse.id,
      },
    },
    conditions: [],
    entrySceneId: "scene.test.house-indoor-screen",
  };
  const indoorScene = {
    id: "scene.test.house-indoor-screen",
    name: "Indoor scene",
    actions: [
      {
        type: "narration",
        text: "Indoor passive trigger fired.",
      },
    ],
  };
  const baseState = createBaseState();
  let appState = {
    gameState: {
      ...baseState,
      world: {
        ...baseState.world,
        currentHouseId: null,
      },
      ui: {
        ...baseState.ui,
        currentView: "city",
        overlayView: null,
        houseSession: null,
      },
    },
    characterDefinitions: prototypeCharacters,
    playerCoordinate: { x: 0, y: 0 },
    campaignActorState: {
      facingDegrees: 0,
      isMoving: false,
    },
    campaignTravelState: null,
    modalState: null,
    locationDialogueState: null,
    beggingMiniGameState: null,
    cityMenuState: null,
    cityDirectoryState: null,
    autoAdvanceState: null,
    uiLayouts: {},
    layoutEditor: {},
  };
  let renderCount = 0;

  const runtime = createHouseRuntimeBridge({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp: () => {
      renderCount += 1;
    },
    startMapAutoAdvance: () => {},
    stopMapAutoAdvance: () => {},
    houseDefinitions: prototypeHouses,
    playerCharacterId,
    eventDefinitionsById: {
      [indoorEvent.id]: indoorEvent,
    },
    sceneDefinitionsById: {
      [indoorScene.id]: indoorScene,
    },
    syncCouncilPriorityAfterGameStateChange: () => false,
  });

  enterHouseThroughRuntime(runtime, grainShopHouse.id);

  assert.equal(appState.gameState.scene.activeEventId, indoorEvent.id);
  assert.equal(appState.gameState.scene.activeSceneId, indoorScene.id);
  assert.equal(appState.gameState.ui.currentView, "scene");
  assert.equal(
    appState.gameState.runtime.eventHistory[indoorEvent.id]?.firedCount,
    1
  );
  assert.equal(renderCount, 1);
});

test("child 25 navigation runtime emits explicit entered-city follow-up outcome", () => {
  const {
    createEnterCityRequest,
    runNavigationRuntime,
  } = require("../.test-dist/core/runtime/navigation-runtime.js");

  const result = runNavigationRuntime({
    state: createBaseState(),
    request: createEnterCityRequest("city.kulan"),
  });

  assert.deepEqual(result.outcome, {
    type: "navigation.entered-city",
    cityId: "city.kulan",
  });
});

test("child 25 time runtime emits explicit council-threshold outcome when day-start crosses the council date", () => {
  const {
    createDayStartRequest,
    runTimeRuntime,
  } = require("../.test-dist/core/runtime/time-runtime.js");

  const result = runTimeRuntime({
    state: withCouncilInDays(createBaseState(), 1),
    request: createDayStartRequest(),
  });

  assert.equal(result.outcome?.type, "time.council-threshold-crossed");
});

test("child 25 main.ts no longer hand-stitches covered navigation/time follow-up after runtime settlement", () => {
  const source = fs.readFileSync(path.join(process.cwd(), "src/main.ts"), "utf8");
  const handleModalConfirmBlock = source.match(
    /function handleModalConfirm\(\)[\s\S]*?\r?\n}\r?\n\r?\nfunction getFacingDegrees/
  )?.[0] ?? "";
  const startCampaignTravelBlock = source.match(
    /function startCampaignTravel\([\s\S]*?\r?\n}\r?\n\r?\nfunction animateCampaignMove/
  )?.[0] ?? "";

  assert.match(source, /createNavigationTimeFollowUpBridge|navigationTimeFollowUp/);
  assert.doesNotMatch(
    handleModalConfirmBlock,
    /type:\s*"trigger-story-events"[\s\S]*timing:\s*"city-enter"/
  );
  assert.doesNotMatch(
    handleModalConfirmBlock,
    /syncCouncilPriorityAfterGameStateChange\(previousGameState\)/
  );
  assert.doesNotMatch(
    startCampaignTravelBlock,
    /syncCouncilPriorityAfterGameStateChange\(previousGameState\)/
  );
});

test("child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator", () => {
  const orchestratorSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src",
      "application",
      "runtime",
      "main-runtime-orchestrator.ts"
    ),
    "utf8"
  );
  const followUpSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src",
      "application",
      "runtime",
      "navigation-time-follow-up.ts"
    ),
    "utf8"
  );

  assert.match(followUpSource, /navigation\.entered-city/);
  assert.match(followUpSource, /time\.advanced/);
  assert.match(followUpSource, /time\.council-threshold-crossed/);
  assert.match(followUpSource, /timing:\s*"city-enter"/);
  assert.doesNotMatch(
    orchestratorSource,
    /navigation\.entered-city|time\.advanced|time\.council-threshold-crossed/
  );
});

test("mod runtime does not absorb content assembly or gameplay execution ownership", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/mods/mod-runtime.ts"),
    "utf8"
  );

  assert.doesNotMatch(source, /ActiveGameContent/);
  assert.doesNotMatch(source, /renderApp/);
  assert.doesNotMatch(
    source,
    /runEventRuntime|runSceneFromEvent|runInteractiveRuntime/
  );
});

test("gameplay contribution registry contract exports navigation event scene task and house contribution families", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/gameplay-contribution.ts"),
    "utf8"
  );

  assert.match(source, /export type GameplayContributionDeclaration/);
  assert.match(source, /export type GameplayContributionRegistry/);
  assert.match(source, /navigation/);
  assert.match(source, /events/);
  assert.match(source, /scenes/);
  assert.match(source, /tasks/);
  assert.match(source, /houses/);
});

test("mod manifest contribution contract exposes optional gameplay contributions", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/mod-manifest.ts"),
    "utf8"
  );

  assert.match(source, /GameplayContributionDeclaration/);
  assert.match(source, /gameplayContributions\?:/);
});

test("mod runtime contribution contract exposes installed gameplay contributions on activated mods", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/mod-runtime.ts"),
    "utf8"
  );

  assert.match(source, /GameplayContributionRegistry/);
  assert.match(source, /gameplayContributions:/);
});

test("mod runtime contribution activation installs unified gameplay contributions from content sources", async () => {
  const {
    createEmptyModRuntimeState,
    createLoadedModFromManifest,
    runModRuntime,
  } = require("../.test-dist/core/mods/mod-runtime.js");

  const loadedMod = createLoadedModFromManifest({
    source: { kind: "builtin", modId: "mod.test.registry" },
    manifest: {
      id: "mod.test.registry",
      schemaVersion: "1",
      version: "1.0.0",
      title: "Registry Test",
      entryContentPackIds: ["pack.test.registry"],
      gameplayContributions: {
        events: ["event.registry.opening"],
        scenes: ["scene.registry.opening"],
        tasks: ["task.registry.opening"],
        houses: ["house.registry.guild"],
      },
    },
    rawContent: {
      id: "pack.test.registry",
      title: "Registry Pack",
      maps: [{ id: "map.registry" }],
      cities: [{ id: "city.registry", mapId: "map.registry", name: "Registry City", x: 0, y: 0, description: "" }],
      cityEntries: [{ id: "entry.registry.guild", cityId: "city.registry", label: "Guild", description: "" }],
      events: [{ id: "event.registry.opening", title: "Opening", trigger: { type: "manual" }, steps: [] }],
      scenes: [{ id: "scene.registry.opening", title: "Opening Scene", startNodeId: "start", nodes: [{ id: "start", type: "line", text: "start", nextNodeId: null }] }],
      tasks: [{ id: "task.registry.opening", title: "Opening Task", objectives: [] }],
      houses: [{
        id: "house.registry.guild",
        cityId: "city.registry",
        name: "Guild Hall",
        type: "special",
        characterIds: [],
        defaultCharacterId: null,
        moduleId: "keep-house",
        backAction: { label: "Back", targetView: "city" },
      }],
    },
  });

  const result = await runModRuntime({
    state: createEmptyModRuntimeState(),
    request: {
      type: "mod.activate-loaded",
      requestId: "test:mod-runtime-contributions",
      loadedMod,
    },
    context: {
      allowedCapabilities: [],
    },
  });

  assert.equal(result.ok, true);
  if (!result.ok) {
    return;
  }

  assert.deepEqual(result.activatedMod.gameplayContributions.contentPackIds, [
    "pack.test.registry",
  ]);
  assert.deepEqual(result.activatedMod.gameplayContributions.navigation, [
    "map.registry",
    "city.registry",
    "entry.registry.guild",
  ]);
  assert.deepEqual(result.activatedMod.gameplayContributions.events, [
    "event.registry.opening",
  ]);
  assert.deepEqual(result.activatedMod.gameplayContributions.scenes, [
    "scene.registry.opening",
  ]);
  assert.deepEqual(result.activatedMod.gameplayContributions.tasks, [
    "task.registry.opening",
  ]);
  assert.deepEqual(result.activatedMod.gameplayContributions.houses, [
    "house.registry.guild",
  ]);
  assert.deepEqual(result.activatedMod.gameplayContributions.houseModules, [
    "keep-house",
  ]);
});

test("state sync runtime contract exports canonical app save presentation trigger and result seams", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/state-sync-runtime.ts"),
    "utf8"
  );

  assert.match(source, /export type CanonicalRuntimeState/);
  assert.match(source, /export type AppStateBridge/);
  assert.match(source, /export type SaveState/);
  assert.match(source, /export type PresentationInput/);
  assert.match(source, /export type StateSyncTrigger/);
  assert.match(source, /export type StateSyncResult/);
  assert.match(source, /export interface StateSyncRuntime/);
});

test("state sync trigger contract includes all mandatory sync points", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/state-sync-runtime.ts"),
    "utf8"
  );

  for (const trigger of [
    "boot",
    "load",
    "runtime-commit",
    "mod-activated",
    "session-rebuild",
    "pre-save",
  ]) {
    assert.match(source, new RegExp(`type: "${trigger}"`));
  }
});

test("state sync runtime exports one small sync entrypoint", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/state-sync-runtime.ts"),
    "utf8"
  );

  assert.match(source, /export function syncState/);
  assert.doesNotMatch(source, /runTask/);
  assert.doesNotMatch(source, /activateEvent/);
  assert.doesNotMatch(source, /renderApp/);
  assert.doesNotMatch(source, /writeSave/);
});

test("main.ts does not add new feature-specific state sync branches after state sync runtime exists", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.doesNotMatch(source, /function createInteractiveRuntimeState/);
  assert.doesNotMatch(source, /function applyInteractiveRuntimeState/);
});

test("child 30 playable runtime contract exports unified playable launch session and settlement seams", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/playable-runtime.ts"),
    "utf8"
  );

  assert.match(source, /export type PlayableFamily = "minigame" \| "battle"/);
  assert.match(source, /export type PlayableDefinition = \{/);
  assert.match(source, /export type PlayableIntegrationDefinition = \{/);
  assert.match(source, /export type PlayableLaunchRequest = \{/);
  assert.match(source, /export type ActivePlayableSession = \{/);
  assert.match(source, /export type PlayableSettlement = \{/);
});

test("child 30 playable definition registry installs covered interactive playables with family boundaries", () => {
  const {
    builtinPlayableDefinitionRegistry,
  } = require("../.test-dist/core/registry/playable-definition-registry.js");

  assert.equal(
    builtinPlayableDefinitionRegistry.get("activity-qte")?.family,
    "minigame"
  );
  assert.equal(
    builtinPlayableDefinitionRegistry.get("city-begging")?.family,
    "minigame"
  );
  assert.equal(
    builtinPlayableDefinitionRegistry.get("story-battle")?.family,
    "battle"
  );
  assert.equal(
    builtinPlayableDefinitionRegistry.matchActionId(
      "interactive.story-battle.action"
    )?.id,
    "story-battle"
  );
});

test("child 30 playable launch normalization resolves city-begging by playable id to one integration id", () => {
  const {
    createLaunchPlayableRequest,
    resolvePlayableLaunchRequest,
  } = require("../.test-dist/core/runtime/playable-runtime.js");

  const resolution = resolvePlayableLaunchRequest({
    request: createLaunchPlayableRequest("city-begging", {
      payload: { now: 123 },
    }),
  });

  assert.equal(resolution?.ok, true);
  if (resolution == null || !resolution.ok) {
    return;
  }

  assert.equal(
    resolution.launch.integrationId,
    "playable.city-begging.external.default"
  );
  assert.equal(resolution.launch.family, "minigame");
  assert.equal(resolution.launch.ownerContext.ownerKind, "external");
  assert.equal(resolution.launch.ownerContext.returnPolicy, "close-only");
  assert.deepEqual(resolution.launch.payload, { now: 123 });
});

test("child 30 playable launch normalization fails closed for ambiguous integrations", () => {
  const {
    createPlayableDefinitionRegistry,
  } = require("../.test-dist/core/registry/playable-definition-registry.js");
  const {
    createPlayableIntegrationRegistry,
  } = require("../.test-dist/core/registry/playable-integration-registry.js");
  const { resolvePlayableLaunch } = require(
    "../.test-dist/core/runtime/playable-runtime.js"
  );

  const definitions = createPlayableDefinitionRegistry([
    {
      id: "playable.test.ambiguous",
      family: "minigame",
      commandPrefix: "interactive.test.ambiguous.",
    },
  ]);
  const integrations = createPlayableIntegrationRegistry([
    {
      integrationId: "playable.test.ambiguous.one",
      playableId: "playable.test.ambiguous",
      ownerDefaults: {
        ownerKind: "external",
        ownerId: null,
        returnPolicy: "close-only",
      },
      trigger: {
        triggerId: "trigger.test.ambiguous.one",
        ownerKind: "external",
        trigger: "manual-launch",
      },
      outcomeConfig: {},
    },
    {
      integrationId: "playable.test.ambiguous.two",
      playableId: "playable.test.ambiguous",
      ownerDefaults: {
        ownerKind: "external",
        ownerId: null,
        returnPolicy: "close-only",
      },
      trigger: {
        triggerId: "trigger.test.ambiguous.two",
        ownerKind: "external",
        trigger: "manual-launch",
      },
      outcomeConfig: {},
    },
  ]);

  const resolution = resolvePlayableLaunch({
    launch: {
      playableId: "playable.test.ambiguous",
    },
    definitions,
    integrations,
  });

  assert.equal(resolution.ok, false);
  if (resolution.ok) {
    return;
  }
  assert.equal(resolution.code, "ambiguous-integration");
});

test("child 30 interactive runtime can launch covered playable sessions through playable runtime normalization", () => {
  const { runInteractiveRuntime } = require(
    "../.test-dist/core/runtime/interactive-runtime.js"
  );
  const { createLaunchPlayableRequest } = require(
    "../.test-dist/core/runtime/playable-runtime.js"
  );

  const result = runInteractiveRuntime({
    state: createRuntimeState(),
    request: createLaunchPlayableRequest("city-begging", {
      payload: { now: 456 },
    }),
    characterDefinitions: prototypeCharacters,
  });

  assert.equal(result.session?.kind, "city-begging");
  assert.equal(
    result.session?.playable.integrationId,
    "playable.city-begging.external.default"
  );
  assert.equal(result.session?.playable.family, "minigame");
  assert.equal(result.session?.playable.ownerContext.ownerKind, "external");
  assert.equal(result.state.app.beggingMiniGameState?.variantId, "village-catching");
});

test("child 31 activity qte launch writes shared playable session into runtime state", () => {
  const activityDefinition = {
    id: "activity.test.child31",
    label: "Child 31 Activity",
    handlerId: "generic.qte",
    qte: {
      totalRounds: 1,
      requiredSuccesses: 1,
    },
  };
  const eventDefinition = {
    id: "event.test.child31.activity",
    chapterId: "chapter.prototype",
    name: "Child 31 activity event",
    occurrence: "repeatable",
    trigger: { timing: "manual" },
    conditions: [],
    entrySceneId: "scene.test.child31.activity",
  };
  const sceneDefinitionsById = {
    "scene.test.child31.activity": {
      id: "scene.test.child31.activity",
      name: "Child 31 activity scene",
      actions: [
        {
          type: "start-activity",
          activityId: activityDefinition.id,
        },
      ],
    },
  };

  const result = runSceneUntilPause(startEvent(createBaseState(), eventDefinition), {
    sceneDefinitionsById,
    eventDefinitionsById: {
      [eventDefinition.id]: eventDefinition,
    },
    activityDefinitionsById: {
      [activityDefinition.id]: activityDefinition,
    },
    characterDefinitions: prototypeCharacters,
  });

  assert.equal(result.state.runtime.playableSession?.playableId, "activity-qte");
  assert.equal(
    result.state.runtime.playableSession?.integrationId,
    "playable.activity-qte.scene.default"
  );
  assert.equal(result.state.runtime.playableSession?.ownerContext.ownerKind, "scene");
});

test("child 31 playable runtime closes activity qte through shared playable session exit", () => {
  const {
    createExitPlayableRequest,
    runPlayableRuntime,
  } = require("../.test-dist/core/runtime/playable-runtime.js");
  const {
    startActivityQtePlayable,
  } = require(
    "../.test-dist/application/playables/activity-qte/activity-qte-definition.js"
  );

  const activityDefinition = {
    id: "activity.test.child31.exit",
    label: "Child 31 Exit Activity",
    handlerId: "generic.qte",
    qte: {
      totalRounds: 1,
      requiredSuccesses: 1,
    },
  };
  const runtimeState = startActivityQtePlayable({
    state: createRuntimeState(),
    activityDefinition,
    handlerId: "generic.qte",
  });

  const result = runPlayableRuntime({
    state: runtimeState,
    request: createExitPlayableRequest("activity-qte"),
    characterDefinitions: prototypeCharacters,
  });

  assert.equal(result.handled, true);
  assert.equal(result.state.core.runtime.playableSession, null);
  assert.equal(result.state.core.runtime.activitySession, null);
});

test("child 31 city-begging completion clears shared playable session after settlement", () => {
  const { runPlayableRuntime, createLaunchPlayableRequest } = require(
    "../.test-dist/core/runtime/playable-runtime.js"
  );
  const { createInteractiveActionRequest } = require(
    "../.test-dist/core/runtime/interactive-runtime.js"
  );

  const launched = runPlayableRuntime({
    state: createRuntimeState(),
    request: createLaunchPlayableRequest("city-begging", {
      payload: { now: 789 },
    }),
    characterDefinitions: prototypeCharacters,
  });

  assert.equal(
    launched.state.core.runtime.playableSession?.playableId,
    "city-begging"
  );

  const completed = runPlayableRuntime({
    state: launched.state,
    request: createInteractiveActionRequest("interactive.city-begging.complete", {
      result: {
        foodGain: 3,
        goldGain: 2,
        maxCombo: 4,
        success: true,
      },
    }),
    characterDefinitions: prototypeCharacters,
    playerCharacterId,
  });

  assert.equal(completed.handled, true);
  assert.equal(completed.state.core.runtime.playableSession, null);
  assert.equal(completed.state.app.beggingMiniGameState, null);
});
