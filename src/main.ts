import "./styles/app.css";
import { ensureCityNpcPoolsForCurrentDay } from "./application/city-npcs/refresh-city-npc-pools";
import {
  selectLayoutEditorComponent,
  selectLayoutEditorElement,
  selectLayoutEditorTarget,
  setLayoutEditorBackgroundAsset,
  setLayoutEditorBackgroundAssetQuery,
  setLayoutEditorBackgroundMode,
  setLayoutEditorBackgroundSlice,
  setLayoutEditorComponentRectField,
  setLayoutEditorElementRectField,
  toggleLayoutEditor,
  updateLayoutEditorComponentPosition,
  updateLayoutEditorComponentSize,
  updateLayoutEditorElementPosition,
  updateLayoutEditorElementSize,
} from "./application/layout-editor/layout-editor-actions";
import {
  closeCityMenu,
  closeCityDirectory,
  equipValuable,
  openCityMenu,
  openCityDirectory,
  selectCard,
  selectValuable,
  setCardFilter,
  setValuableFilter,
  setValuableSort,
  updateOverlayView,
} from "./application/app-actions";
import type { AppState } from "./application/app-shell";
import {
  CITY_BEGGING_DURATION_DAYS,
  getCityBeggingMiniGameCompletionResult,
  getCityBeggingMiniGameStatus,
  isCityBeggingMiniGamePlaying,
} from "./application/minigames/city-begging-minigame";
import {
  createCityMenuState,
  isPlayerMonkIdentity,
  type CityMenuPanelId,
} from "./application/city-menu/city-menu";
import { createAppPresenterOutput } from "./application/presenter/app-presenter";
import { selectLeaderResidenceOptions } from "./application/city-entries/select-leader-residence-options";
import {
  ACTIVITY_COMPLETION_STAMINA_COST,
  canAffordActivityCost,
} from "./application/player/player-stamina";
import {
  formatCouncilStatusText,
  readCalendarDateNumber,
} from "./application/time/time-progression";
import {
  getInsufficientDaysForTimedActivity,
  getCouncilPriorityHouseModuleId,
  hasReachedCouncilDate,
  isCouncilPriorityHouseDefinition,
} from "./application/time/council-priority";
import {
  advanceStorySceneStep,
  buildStoryTriggerInput,
  chooseStorySceneOption,
  getCurrentChoiceOptions,
  startStoryEventById,
  triggerStoryEvents,
} from "./application/story/story-runtime";
import {
  isCityEntryVisibleForStoryStage,
  isHouseVisibleForStoryStage,
  selectHouseEntryAccess,
} from "./application/story/story-stage-access";
import {
  travelToCoordinate,
  type GridCoordinate,
} from "./application/navigation/travel-to-coordinate";
import { createInitialState } from "./application/state/create-initial-state";
import {
  createActiveGameContent,
  type ActiveGameContent,
} from "./application/content/active-game-content";
import {
  resolveTextEntry,
  resolveTextTemplateEntry,
} from "./application/content/text-resolution";
import { loadDefaultRuntimeContent } from "./application/content/default-runtime-content";
import { bootstrapLegacyMain } from "./core/adapters/legacy-main-adapter";
import { toLegacyBootstrapInput } from "./core/adapters/mod-runtime-main-adapter";
import {
  createEnterCityRequest,
  runNavigationRuntime,
} from "./core/runtime/navigation-runtime";
import {
  createAdvanceTimeSegmentsRequest,
  createDayStartRequest,
  runTimeRuntime,
} from "./core/runtime/time-runtime";
import {
  createEventTriggerRequest,
  runEventRuntime,
} from "./core/runtime/event-runtime";
import { runSceneFromEvent } from "./core/runtime/scene-runtime";
import {
  createPrototypeCharactersForStoryStage,
} from "./content/prototype-world";
import { createBaseGameContentPack } from "./content/base-game-content-pack";
import { getZhuYuanzhangCitySceneMappingByCityId } from "./content/city-scene-mappings";
import {
  createDefaultCharacterDetailScreenLayout,
  createDefaultCharacterSelectScreenLayout,
  createDefaultGlobalHudLayout,
  createDefaultStartScreenLayout,
  globalHudBackgroundOptions,
} from "./content/layout-editor-presets";
import { builtInScenarioPacks } from "./content/scenario-packs/scenario-pack-catalog";
import {
  loadScenarioPackFromUrl,
  loadScenarioPackFromFiles,
} from "./application/scenario/scenario-pack-loader";
import {
  createEmptyModRuntimeState,
  createLoadedModFromManifest,
  createLoadedModFromScenarioPack,
  runModRuntime,
} from "./core/mods/mod-runtime";
import {
  clearActivityResult,
} from "./application/activity/activity-qte-runtime";
import {
  createHouseRuntimeBridge,
  dispatchHouseRuntimeRequest,
  enterHouseThroughRuntime,
  leaveHouseThroughRuntime,
  type HouseRuntimeBridge,
} from "./core/runtime/house-runtime";
import {
  createInteractiveActionRequest,
  createLaunchInteractiveRequest,
  type InteractiveRuntimeOutput,
  runInteractiveRuntime,
} from "./core/runtime/interactive-runtime";
import { dispatchRuntimeRequest } from "./core/runtime/runtime-dispatch";
import {
  applyInteractiveRuntimeResult,
  applyInteractiveRuntimeState,
  createInteractiveRuntimeState,
} from "./core/runtime/state-sync-runtime";
import type { GameModManifest } from "./core/contracts/mod-manifest";
import type {
  LoadedMod,
  ModActivationResult,
  ModRuntimeState,
  ModSourceDescriptor,
} from "./core/contracts/mod-runtime";
import type { ActivityDefinition } from "./domain/activity";
import type { SceneDefinition } from "./domain/action";
import type { GameState } from "./domain/game-state";
import type { CityDefinition } from "./domain/city";
import type { CharacterDefinition } from "./domain/character";
import type { CityBeggingGameCompletionResult } from "./domain/city-begging-minigame";
import type { CityEntryDefinition } from "./domain/city-entry";
import type { CityNpcPoolDefinition } from "./domain/city-npc";
import type { EventDefinition, EventTriggerTiming } from "./domain/event";
import type { HouseDefinition } from "./domain/house";
import type { HouseModuleTransitionResult } from "./domain/house-module";
import type { MapDefinition } from "./domain/map";
import type {
  ScenarioPackDefinition,
  ScenarioPackSummary,
} from "./domain/scenario-pack";
import type { EngineRegistry } from "./core/registry/engine-registry";
import type {
  CardLibraryFilter,
  ValuableLibraryFilter,
  ValuableLibrarySortKey,
} from "./domain/global-ui";
import { KEEP_HOUSE_VARIABLE_KEYS } from "./domain/keep-house";
import { LEADER_RESIDENCE_VARIABLE_KEYS } from "./domain/leader-residence";
import type {
  UiLayoutBackgroundMode,
  UiLayout,
  UiLayoutRect,
  LayoutEditorTargetId,
} from "./domain/ui-layout";
import type { ValuableItemId } from "./domain/valuable-item";
import {
  isHaozhouShortageDuringBeggingJourney,
  ZHU_YUANZHANG_STORY_FLAG_KEYS,
  ZHU_YUANZHANG_STORY_STAGES,
  ZHU_YUANZHANG_STORY_VARIABLE_KEYS,
  type ZhuYuanzhangStoryStage,
} from "./domain/zhu-yuanzhang-story";
import { assertExists } from "./shared/assert";
import { renderApp as renderAppMarkup } from "./ui/app-render";
import {
  renderLoadingScreen,
  selectRandomLoadingTheme,
  setLoadingScreenProgress,
  type LoadingTheme,
} from "./ui/loading-screen";
import { MainUiFlow } from "./ui/main-ui/main-ui-flow.js";
import {
  resolveCampaignTerrainUvFromClientPosition,
  requestCampaignTerrainRender,
  setCampaignTerrainCamera,
  syncCampaignTerrainWebGl,
} from "./ui/views/map/campaign-terrain-webgl";
import { syncCityBeggingMiniGameOverlay } from "./ui/views/minigames/city-begging-minigame-view";

const GAME_VIEWPORT_WIDTH = 1600;
const GAME_VIEWPORT_HEIGHT = 900;
const MAP_DEBUG_MIN_SCALE = 0.5;
const MAP_DEBUG_MAX_SCALE = 40;
const MAP_DEBUG_SCALE_STEP = 0.2;
const INITIAL_MAP_DEBUG_ANIMATION_DURATION_MS = 5000;
const LOADING_SCREEN_SIMULATION_DURATION_MS = 1800;
const CAMPAIGN_TRAVEL_SPEED_SCALE = 0.6;
const CAMPAIGN_TRAVEL_MS_PER_MAP_UNIT = 55 / CAMPAIGN_TRAVEL_SPEED_SCALE;
const CAMPAIGN_TRAVEL_MIN_DURATION_MS = 1400 / CAMPAIGN_TRAVEL_SPEED_SCALE;
const CAMPAIGN_TRAVEL_MAX_DURATION_MS = 18000 / CAMPAIGN_TRAVEL_SPEED_SCALE;
const CAMPAIGN_TURN_DEGREES_PER_SECOND = 180;
const ACTIVITY_QTE_INTERVAL_MS = 90;
const OPENING_BGM_URL = new URL("../BGM/开局.mp3", import.meta.url).href;
const IN_GAME_BGM_URL = new URL("../BGM/游戏内.mp3", import.meta.url).href;
const HAOZHOU_RETURN_ENCOUNTER_SPY_SCENE_CURSOR = 4;
const INITIAL_CAMPAIGN_MAP_DEBUG_STATE: CampaignMapDebugState = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
};
const TARGET_CAMPAIGN_MAP_DEBUG_STATE: CampaignMapDebugState = {
  scale: 40,
  offsetX: -5737,
  offsetY: 4769,
};

declare global {
  interface Window {
    onBeggingGameComplete?: (
      result: CityBeggingGameCompletionResult
    ) => void;
  }
}

type CampaignMapDebugState = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

type SaveDataResult = {
  selectedCharacterId?: string | null;
  selectedModId?: string | null;
} | null;

type BackgroundMusicMode = "opening" | "in-game";
type StartupScenario = "default" | "haozhou-return-encounter";

type CampaignMoveAnimationState = {
  frameId: number | null;
  startedAtMs: number;
  from: GridCoordinate;
  to: GridCoordinate;
  durationMs: number;
  resolve: () => void;
};

const appElement = document.querySelector<HTMLElement>("#app");
const uiOverlayElement = document.querySelector<HTMLElement>("#ui-overlay");

if (appElement == null) {
  throw new Error("Missing #app mount point.");
}

if (uiOverlayElement == null) {
  throw new Error("Missing #ui-overlay mount point.");
}

const appRoot = appElement;
const defaultPlayerCharacterId = "char.player";
const builtinDefaultModId = "builtin.default";
const builtinDefaultModManifest: GameModManifest = {
  id: builtinDefaultModId,
  schemaVersion: "1",
  version: "1.0.0",
  title: "Default Builtin Mod",
  entryContentPackIds: [],
};
const selectableCharacterIds = [
  "char.player",
  "char.kulan_xu_da",
  "char.kulan_tang_he",
  "char.kulan_chang_yuchun",
] as const;
const baseGameContentPack = await createBaseGameContentPack();
await loadDefaultRuntimeContent();
let modRuntimeState: ModRuntimeState = createEmptyModRuntimeState();
const builtinStartupActivation = await runModRuntime({
  state: modRuntimeState,
  request: {
    type: "mod.activate-loaded",
    requestId: "startup:builtin.default",
    loadedMod: createLoadedModFromManifest({
      source: { kind: "builtin", modId: builtinDefaultModId },
      manifest: builtinDefaultModManifest,
      rawContent: baseGameContentPack,
    }),
  },
});
modRuntimeState = builtinStartupActivation.state;
const builtinLegacyBootstrapInput = toLegacyBootstrapInput(
  builtinStartupActivation
);
const legacyEngineRegistry: EngineRegistry = {
  mods: {
    [builtinDefaultModId]: builtinDefaultModManifest,
  },
  content: {
    [builtinDefaultModId]: baseGameContentPack,
  },
};
const legacyEngineSession = bootstrapLegacyMain({
  selectedModId: builtinLegacyBootstrapInput.selectedModId,
  registry: legacyEngineRegistry,
});

function createCityCoordinatesById(
  definitions: CityDefinition[],
  mapNodesById: ActiveGameContent["mapNodesById"]
): Record<string, GridCoordinate> {
  return Object.fromEntries(
    definitions.map((cityDefinition) => {
      assertExists(
        cityDefinition.mapNodeId,
        `Missing map node id for city "${cityDefinition.id}".`
      );
      const mapNode = mapNodesById[cityDefinition.mapNodeId];
      assertExists(
        mapNode,
        `Missing campaign map node "${cityDefinition.mapNodeId}" for city "${cityDefinition.id}".`
      );
      return [cityDefinition.id, { x: mapNode.x, y: mapNode.y }];
    })
  );
}

function createCityDefinitionById(
  definitions: CityDefinition[]
): Record<string, CityDefinition> {
  return Object.fromEntries(
    definitions.map((cityDefinition) => [cityDefinition.id, cityDefinition])
  );
}

function createCityNameById(definitions: CityDefinition[]): Record<string, string> {
  return Object.fromEntries(
    definitions.map((cityDefinition) => [
      cityDefinition.id,
      cityDefinition.name,
    ])
  );
}

function createHouseNameById(definitions: HouseDefinition[]): Record<string, string> {
  return Object.fromEntries(
    definitions.map((houseDefinition) => [
      houseDefinition.id,
      houseDefinition.name,
    ])
  );
}

function getMapDefinitionById(mapId: string): MapDefinition | null {
  return activeMapDefinitionById[mapId] ?? null;
}

function getCurrentMapDefinition(): MapDefinition | null {
  return (
    getMapDefinitionById(appState.gameState.world.currentMapId) ??
    activeMapDefinitions[0] ??
    null
  );
}

void legacyEngineSession;
let activeGameContent: ActiveGameContent = createActiveGameContent(baseGameContentPack);
let activeMapDefinitions: MapDefinition[] = activeGameContent.maps;
let activeMapDefinitionById: Record<string, MapDefinition> =
  activeGameContent.mapDefinitionById;
let cityDefinitions: CityDefinition[] = activeGameContent.cities;
let houseDefinitions: HouseDefinition[] = activeGameContent.houses;
let cityEntries: CityEntryDefinition[] = activeGameContent.cityEntries;
let cardDefinitions = activeGameContent.cards;
let cityNpcPoolDefinitions: CityNpcPoolDefinition[] = activeGameContent.cityNpcPools;
let historicalCharacters = activeGameContent.historicalCharacters;
let historicalCityRosters = activeGameContent.historicalCityRosters;
let historicalCharacterIdByCharacterId =
  activeGameContent.historicalCharacterIdByCharacterId;
let cityPortraits = activeGameContent.cityPortraits;
let textEntriesById = activeGameContent.textEntriesById;
let cityCoordinatesById: Record<string, GridCoordinate> = createCityCoordinatesById(
  cityDefinitions,
  activeGameContent.mapNodesById
);
let cityDefinitionById: Record<string, CityDefinition> =
  createCityDefinitionById(cityDefinitions);
let cityNameById: Record<string, string> = createCityNameById(cityDefinitions);
let houseNameById: Record<string, string> = createHouseNameById(houseDefinitions);
let characterNameById: Record<string, string> = activeGameContent.characterNameById;

function getRuntimeText(textId: string, fallback?: string): string {
  return resolveTextEntry(textEntriesById, textId, fallback);
}

function getRuntimeTemplateText(
  textId: string,
  values: Record<string, string | number | boolean | null | undefined>,
  fallback?: string
): string {
  return resolveTextTemplateEntry(textEntriesById, textId, values, fallback);
}

function syncActiveGameContent(nextContent: ActiveGameContent): void {
  activeGameContent = nextContent;
  activeMapDefinitions = nextContent.maps;
  activeMapDefinitionById = nextContent.mapDefinitionById;
  cityDefinitions = nextContent.cities;
  houseDefinitions = nextContent.houses;
  cityEntries = nextContent.cityEntries;
  cardDefinitions = nextContent.cards;
  cityNpcPoolDefinitions = nextContent.cityNpcPools;
  historicalCharacters = nextContent.historicalCharacters;
  historicalCityRosters = nextContent.historicalCityRosters;
  historicalCharacterIdByCharacterId = nextContent.historicalCharacterIdByCharacterId;
  cityPortraits = nextContent.cityPortraits;
  textEntriesById = nextContent.textEntriesById;
  cityCoordinatesById = createCityCoordinatesById(
    cityDefinitions,
    nextContent.mapNodesById
  );
  cityDefinitionById = createCityDefinitionById(cityDefinitions);
  cityNameById = createCityNameById(cityDefinitions);
  houseNameById = createHouseNameById(houseDefinitions);
  characterNameById = nextContent.characterNameById;
  activeStoryEventDefinitionsById = nextContent.eventDefinitionsById;
  activeStorySceneDefinitionsById = nextContent.sceneDefinitionsById;
  activeActivityDefinitionsById = nextContent.activityDefinitionsById;
}

const selectableCharacters = selectableCharacterIds.map((characterId) => {
  const characterDefinition = activeGameContent.characters.find(
    (candidateCharacter) => candidateCharacter.id === characterId
  );
  assertExists(
    characterDefinition,
    `Selectable character not found for id "${characterId}".`
  );
  return characterDefinition;
});

let currentPlayerCharacterId = defaultPlayerCharacterId;
let activeStoryEventDefinitionsById: Record<string, EventDefinition> =
  activeGameContent.eventDefinitionsById;
let activeStorySceneDefinitionsById: Record<string, SceneDefinition> =
  activeGameContent.sceneDefinitionsById;
let activeActivityDefinitionsById: Record<string, ActivityDefinition> =
  activeGameContent.activityDefinitionsById;

let appState: AppState = createPrototypeAppState(currentPlayerCharacterId);
let campaignMapDebugState: CampaignMapDebugState = {
  ...INITIAL_CAMPAIGN_MAP_DEBUG_STATE,
};
let campaignMapDebugHomeState: CampaignMapDebugState = {
  ...INITIAL_CAMPAIGN_MAP_DEBUG_STATE,
};
let hasAppliedInitialCampaignMapDebug = false;
let hasStartedInitialCampaignMapDebugAnimation = false;
let initialCampaignMapDebugAnimationFrame: number | null = null;
let initialCampaignMapDebugAnimationStartTime: number | null = null;
let activeMapIntroOverlay: HTMLElement | null = null;
let activeBackgroundMusicMode: BackgroundMusicMode | null = null;
let campaignMapDragState:
  | {
      pointerId: number;
      startClientX: number;
      startClientY: number;
      startOffsetX: number;
      startOffsetY: number;
      didMove: boolean;
    }
  | null = null;
let shouldSuppressNextClickAfterMapDrag = false;
let recentPointerDispatchedHouseAction:
  | {
      actionId: string;
      timestamp: number;
    }
  | null = null;
let houseDragPayload: string | null = null;
let houseTileDragState:
  | {
      pointerId: number;
      payload: string;
      root: HTMLElement;
      sourceTile: HTMLElement;
      ghostTile: HTMLElement;
      startClientX: number;
      startClientY: number;
      offsetX: number;
      offsetY: number;
      didMove: boolean;
      currentBeforeId: string | null;
      restingBeforeId: string | null;
    }
  | null = null;
let suppressHouseClickUntilMs = 0;
let layoutEditorDragState:
  | {
      mode: "component" | "element" | "component-size" | "element-size";
      componentId: string;
      elementId: string | null;
      pointerId: number;
      startClientX: number;
      startClientY: number;
      resizeAxis?: "x" | "y" | "xy";
    }
  | null = null;
let campaignMoveAnimationState: CampaignMoveAnimationState | null = null;
let cityBeggingMiniGameFrameId: number | null = null;
let activityQteIntervalHandle: number | null = null;
let campaignTravelRequestId = 0;
let loadingScreenAnimationFrameId: number | null = null;
let loadingScreenRequestId = 0;
let activeLoadingScreenElement: HTMLElement | null = null;
let activeLoadingTheme: LoadingTheme | null = null;
const mapAutoAdvanceHandles: Record<string, number> = {};

let houseRuntime: HouseRuntimeBridge = createHouseRuntimeInstance();

const backgroundMusicPlayer = createBackgroundMusicPlayer();
const mainUiFlow = new MainUiFlow({
  overlayRoot: uiOverlayElement,
  characters: selectableCharacters,
  scenarioPacks: builtInScenarioPacks,
  onStartGame: startMainGameWithLoading,
  onContinueGame: startContinueGameWithLoading,
  onStartScenarioPack: startScenarioPackWithLoading,
  onImportScenarioPackFiles: startScenarioPackFilesWithLoading,
  loadSaveData,
  getAppState: () => appState,
});

syncGameViewport();
window.addEventListener("resize", syncGameViewport);
setGameVisibility(false);
mainUiFlow.mount();
mainUiFlow.showMainMenu();

function createPrototypeAppState(playerCharacterId: string): AppState {
  const defaultMapDefinition =
    activeMapDefinitionById["map.yuanmo_campaign"] ?? activeMapDefinitions[0];
  const defaultCityDefinition =
    cityDefinitionById["city.kulan"] ?? cityDefinitions[0];
  assertExists(defaultMapDefinition, "Missing default map definition.");
  assertExists(defaultCityDefinition, "Missing default city definition.");
  const storyStage: ZhuYuanzhangStoryStage =
    playerCharacterId === defaultPlayerCharacterId
      ? ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
      : ZHU_YUANZHANG_STORY_STAGES.guoZixingCamp;
  const storyCharacterDefinitions =
    createPrototypeCharactersForStoryStage(storyStage);
  let nextAppState: AppState = {
    gameState: ensureCityNpcPoolsForCurrentDay(
      createInitialState({
        currentMapId: defaultMapDefinition.id,
        currentCityId: defaultCityDefinition.id,
        currentHouseId: null,
        playerCharacterId,
        chapterId: "chapter.prototype",
        year: 1567,
        month: 1,
        day: 1,
        pinnedCharacterId: playerCharacterId,
        reviewDateText: formatCouncilStatusText(40),
        mainHouseMissionText: getRuntimeText(
          "runtime.zhu_yuanzhang.prototype.main_mission.review_hall",
        ),
        cards: {
          ownedCardIds: cardDefinitions.map((cardDefinition) => cardDefinition.id),
          selectedCardId: cardDefinitions[0]?.id ?? null,
        },
        valuables: {
          items: activeGameContent.valuables,
          selectedItemId: activeGameContent.valuables[0]?.id ?? null,
          equippedWeaponSet: {
            swordId:
              activeGameContent.valuables.find(
                (valuableDefinition) => valuableDefinition.category === "weapon"
              )?.id ?? null,
            armorId:
              activeGameContent.valuables.find(
                (valuableDefinition) => valuableDefinition.category === "armor"
              )?.id ?? null,
          },
        },
        currentView: "map",
      }),
      cityNpcPoolDefinitions
    ),
    characterDefinitions: storyCharacterDefinitions,
    playerCoordinate: defaultMapDefinition.initialPlayerCoordinate ?? { x: 0, y: 0 },
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
    uiLayouts: {
      "global-hud": createDefaultGlobalHudLayout(),
      "start-screen": createDefaultStartScreenLayout(),
      "character-select-screen": createDefaultCharacterSelectScreenLayout(),
      "character-detail-screen": createDefaultCharacterDetailScreenLayout(),
    },
    layoutEditor: {
      isOpen: false,
      selectedTargetId: "global-hud",
      selectedComponentId: "status-board",
      selectedElementId: null,
      backgroundAssetQuery: "",
    },
  };

  nextAppState = {
    ...nextAppState,
    gameState: {
      ...nextAppState.gameState,
      ui: {
        ...nextAppState.gameState.ui,
        reviewDateText:
          storyStage === ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
            ? formatCouncilStatusText(0)
            : nextAppState.gameState.ui.reviewDateText,
        mainHouseMissionText:
          storyStage === ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
            ? getRuntimeText(
                "runtime.zhu_yuanzhang.prototype.main_mission.temple_review"
              )
            : nextAppState.gameState.ui.mainHouseMissionText,
      },
      runtime: {
        ...nextAppState.gameState.runtime,
        variables: {
          ...nextAppState.gameState.runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 0,
          [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage]: storyStage,
        },
      },
    },
  };

  return nextAppState;
}

function getCurrentPlayerCharacter(): CharacterDefinition | null {
  return (
    appState.characterDefinitions.find(
      (characterDefinition) => characterDefinition.id === currentPlayerCharacterId
    ) ?? null
  );
}

function getCurrentCityUiContext(): {
  cityDefinition: CityDefinition;
  houseDefinitions: HouseDefinition[];
  cityEntries: CityEntryDefinition[];
  cityNpcPoolDefinition: CityNpcPoolDefinition | null;
} | null {
  const cityDefinition =
    cityDefinitionById[appState.gameState.world.currentCityId] ?? null;

  if (cityDefinition == null) {
    return null;
  }

  const cityHouseIds = new Set(cityDefinition.houseIds);
  const activeCityHouseDefinitions = houseDefinitions.filter((houseDefinition) => {
    if (
      !(
        houseDefinition.cityId === cityDefinition.id ||
        cityHouseIds.has(houseDefinition.id)
      )
    ) {
      return false;
    }

    return isHouseVisibleForStoryStage(
      appState.gameState,
      appState.characterDefinitions,
      houseDefinition
    );
  });
  const cityEntries = activeGameContent.cityEntries.filter(
    (cityEntry) =>
      cityEntry.cityId === cityDefinition.id &&
      isCityEntryVisibleForStoryStage(appState.gameState, cityEntry)
  );
  const cityNpcPoolDefinition =
    cityNpcPoolDefinitions.find(
      (poolDefinition) => poolDefinition.cityId === cityDefinition.id
    ) ?? null;

  return {
    cityDefinition,
    houseDefinitions: activeCityHouseDefinitions,
    cityEntries,
    cityNpcPoolDefinition,
  };
}

function openCityMenuPanel(panelId: CityMenuPanelId): void {
  const playerCharacter = getCurrentPlayerCharacter();

  if (playerCharacter == null) {
    return;
  }

  if (panelId === "begging" && !isPlayerMonkIdentity(playerCharacter)) {
    return;
  }

  if (panelId === "begging") {
    openBeggingMiniGame();
    return;
  }

  const cityContext = getCurrentCityUiContext();

  if (cityContext == null) {
    return;
  }

  appState = openCityMenu(
    closeCityDirectory(appState),
    createCityMenuState({
      panelId,
      cityDefinition: cityContext.cityDefinition,
      houseDefinitions: cityContext.houseDefinitions,
      cityEntries: cityContext.cityEntries,
      cityNpcPoolDefinition: cityContext.cityNpcPoolDefinition,
      calendar: appState.gameState.calendar,
    })
  );
  renderApp();
}

function stopCityBeggingMiniGameLoop(): void {
  if (cityBeggingMiniGameFrameId != null) {
    window.cancelAnimationFrame(cityBeggingMiniGameFrameId);
  }
  cityBeggingMiniGameFrameId = null;
}

function onBeggingGameComplete(result: CityBeggingGameCompletionResult): void {
  const previousGameState = appState.gameState;
  const completion = runInteractiveRuntime({
    state: createInteractiveRuntimeState(appState),
    request: createInteractiveActionRequest(
      "interactive.city-begging.complete",
      { result }
    ),
    characterDefinitions: appState.characterDefinitions,
    playerCharacterId: currentPlayerCharacterId,
  });
  appState = applyInteractiveRuntimeResult(appState, completion);
  syncCouncilPriorityAfterGameStateChange(previousGameState);
  window.onBeggingGameComplete?.(result);
}

function triggerStoryEventsForTiming(
  timing: EventTriggerTiming,
  state: GameState,
  characterDefinitions: CharacterDefinition[]
): {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
} {
  const eventRuntimeResult = runEventRuntime({
    request: createEventTriggerRequest(`story.${timing}`),
    state,
    characterDefinitions,
    eventDefinitionsById: activeStoryEventDefinitionsById,
    triggerInput: buildStoryTriggerInput(timing, state),
  });

  if (eventRuntimeResult.activation?.sceneId == null) {
    return {
      state: eventRuntimeResult.state,
      characterDefinitions: eventRuntimeResult.characterDefinitions,
    };
  }

  const sceneRuntimeResult = runSceneFromEvent({
    state: eventRuntimeResult.state,
    characterDefinitions: eventRuntimeResult.characterDefinitions,
    sceneDefinitionsById: activeStorySceneDefinitionsById,
    eventDefinitionsById: activeStoryEventDefinitionsById,
    activityDefinitionsById: activeActivityDefinitionsById,
    textEntriesById,
  });

  return {
    state: sceneRuntimeResult.state,
    characterDefinitions: sceneRuntimeResult.characterDefinitions,
  };
}

function getCouncilPriorityHouseDefinition(): HouseDefinition | null {
  const priorityModuleId = getCouncilPriorityHouseModuleId(appState.gameState);
  const currentCityId = appState.gameState.world.currentCityId;

  return (
    houseDefinitions.find(
      (houseDefinition) =>
        houseDefinition.moduleId === priorityModuleId &&
        houseDefinition.cityId === currentCityId
    ) ??
    houseDefinitions.find(
      (houseDefinition) => houseDefinition.moduleId === priorityModuleId
    ) ??
    null
  );
}

function createCouncilArrivalDialogue(
  targetHouseId: string,
  councilArrivalNotice?: HouseModuleTransitionResult["councilArrivalNotice"]
): NonNullable<AppState["locationDialogueState"]> | null {
  const priorityHouse = getCouncilPriorityHouseDefinition();
  if (priorityHouse == null) {
    return null;
  }

  const isTempleReview = priorityHouse.moduleId === "temple-house";
  const defaultSpeakerCharacterId =
    priorityHouse.defaultCharacterId ??
    (isTempleReview ? "char.kulan_temple_abbot" : "char.kulan_guard");
  const defaultTextLines = isTempleReview
    ? [
        getRuntimeTemplateText(
          "runtime.zhu_yuanzhang.council_arrival.temple.001",
          { targetHouseName: priorityHouse.name }
        ),
        getRuntimeText(
          "runtime.zhu_yuanzhang.council_arrival.temple.002"
        ),
      ]
    : [
        getRuntimeTemplateText(
          "runtime.zhu_yuanzhang.council_arrival.keep.001",
          { targetHouseName: priorityHouse.name }
        ),
        getRuntimeText(
          "runtime.zhu_yuanzhang.council_arrival.keep.002"
        ),
      ];

  return {
    type: "council-arrival-reminder",
    speakerCharacterId:
      councilArrivalNotice?.speakerCharacterId ?? defaultSpeakerCharacterId,
    textLines: [...defaultTextLines, ...(councilArrivalNotice?.textLines ?? [])],
    advanceHintText: councilArrivalNotice?.advanceHintText ?? "知道了",
    targetHouseId,
  };
}

function clearTransientUiForCouncilTrigger(): void {
  appState = {
    ...appState,
    modalState: null,
    locationDialogueState: null,
    beggingMiniGameState: null,
    cityMenuState: null,
    cityDirectoryState: null,
    autoAdvanceState: null,
    campaignTravelState: null,
  };
}

function syncCouncilPriorityAfterGameStateChange(
  previousGameState: GameState,
  councilArrivalNotice?: HouseModuleTransitionResult["councilArrivalNotice"]
): boolean {
  if (
    hasReachedCouncilDate(previousGameState) ||
    !hasReachedCouncilDate(appState.gameState)
  ) {
    return false;
  }
  const targetHouseId = getCouncilPriorityHouseDefinition()?.id ?? null;
  if (targetHouseId == null) {
    return false;
  }

  clearTransientUiForCouncilTrigger();
  const councilArrivalDialogue = createCouncilArrivalDialogue(
    targetHouseId,
    councilArrivalNotice
  );
  appState = {
    ...appState,
    locationDialogueState: councilArrivalDialogue,
  };
  renderApp();
  return true;
}

function showCouncilPriorityRefusal(): void {
  const priorityHouse = getCouncilPriorityHouseDefinition();
  const isTempleReview = priorityHouse?.moduleId === "temple-house";

  appState = {
    ...appState,
    locationDialogueState: {
      type: "house-access-refusal",
      speakerCharacterId:
        priorityHouse?.defaultCharacterId ??
        (isTempleReview ? "char.kulan_temple_abbot" : "char.kulan_guard"),
      textLines: isTempleReview
        ? [
            getRuntimeTemplateText(
              "runtime.zhu_yuanzhang.council_refusal.temple.001",
              { targetHouseName: priorityHouse?.name ?? "皇觉寺" }
            ),
            getRuntimeText(
              "runtime.zhu_yuanzhang.council_refusal.temple.002"
            ),
          ]
        : [
            getRuntimeTemplateText(
              "runtime.zhu_yuanzhang.council_refusal.keep.001",
              { targetHouseName: priorityHouse?.name ?? "帅府" }
            ),
            getRuntimeText(
              "runtime.zhu_yuanzhang.council_refusal.keep.002"
            ),
          ],
      advanceHintText: priorityHouse == null ? "知道了" : `前往${priorityHouse.name}`,
    },
  };
  renderApp();
}

function showCouncilInsufficientTimeRefusal(
  activityLabel: string,
  durationDays: number,
  remainingDays: number
): void {
  const priorityHouse = getCouncilPriorityHouseDefinition();
  const isTempleReview = priorityHouse?.moduleId === "temple-house";
  const targetName = priorityHouse?.name ?? (isTempleReview ? "皇觉寺" : "帅府");

  appState = {
    ...closeCityMenu(closeCityDirectory(appState)),
    beggingMiniGameState: null,
    locationDialogueState: {
      type: "house-access-refusal",
      speakerCharacterId:
        priorityHouse?.defaultCharacterId ??
        (isTempleReview ? "char.kulan_temple_abbot" : "char.kulan_guard"),
      textLines: isTempleReview
        ? remainingDays <= 0
          ? [
              getRuntimeTemplateText(
                "runtime.zhu_yuanzhang.council_insufficient_time.temple.arrived.001",
                { activityLabel, durationDays }
              ),
              getRuntimeTemplateText(
                "runtime.zhu_yuanzhang.council_insufficient_time.temple.arrived.002",
                { targetHouseName: targetName }
              ),
            ]
          : [
              getRuntimeTemplateText(
                "runtime.zhu_yuanzhang.council_insufficient_time.temple.remaining.001",
                { remainingDays, activityLabel, durationDays }
              ),
              getRuntimeTemplateText(
                "runtime.zhu_yuanzhang.council_insufficient_time.temple.remaining.002",
                { targetHouseName: targetName }
              ),
            ]
        : remainingDays <= 0
          ? [
              getRuntimeTemplateText(
                "runtime.zhu_yuanzhang.council_insufficient_time.keep.arrived.001",
                { activityLabel, durationDays }
              ),
              getRuntimeTemplateText(
                "runtime.zhu_yuanzhang.council_insufficient_time.keep.arrived.002",
                { targetHouseName: targetName }
              ),
            ]
          : [
              getRuntimeTemplateText(
                "runtime.zhu_yuanzhang.council_insufficient_time.keep.remaining.001",
                { remainingDays, activityLabel, durationDays }
              ),
              getRuntimeTemplateText(
                "runtime.zhu_yuanzhang.council_insufficient_time.keep.remaining.002",
                { targetHouseName: targetName }
              ),
            ],
      advanceHintText: "知道了",
    },
  };
  renderApp();
}

function shouldBlockForCouncilPriority(targetHouseDefinition?: HouseDefinition | null): boolean {
  if (!hasReachedCouncilDate(appState.gameState)) {
    return false;
  }

  if (
    targetHouseDefinition != null &&
    isCouncilPriorityHouseDefinition(appState.gameState, targetHouseDefinition)
  ) {
    if (appState.locationDialogueState != null) {
      appState = {
        ...appState,
        locationDialogueState: null,
      };
    }
    return false;
  }

  showCouncilPriorityRefusal();
  return true;
}

function confirmBeggingMiniGameResult(): void {
  const result = appState.beggingMiniGameState;
  const completionResult = getCityBeggingMiniGameCompletionResult(result);
  if (completionResult == null) {
    return;
  }

  onBeggingGameComplete(completionResult);
  stopCityBeggingMiniGameLoop();
  appState = {
    ...appState,
    beggingMiniGameState: null,
  };
  renderApp();
}

function syncCityBeggingMiniGamePointer(clientX: number): void {
  const currentState = appState.beggingMiniGameState;
  if (currentState == null || !isCityBeggingMiniGamePlaying(currentState)) {
    return;
  }

  const canvas = appRoot.querySelector<HTMLCanvasElement>(
    "[data-begging-game-canvas]"
  );
  if (canvas == null) {
    return;
  }

  const rect = canvas.getBoundingClientRect();
  if (rect.width <= 0) {
    return;
  }

  const normalizedX = (clientX - rect.left) / rect.width;
  const pointerX = normalizedX * canvas.width;
  appState = applyInteractiveRuntimeResult(appState, runInteractiveRuntime({
    state: createInteractiveRuntimeState(appState),
    request: createInteractiveActionRequest(
      "interactive.city-begging.pointer",
      { pointerX }
    ),
    characterDefinitions: appState.characterDefinitions,
  }));
  syncCityBeggingMiniGameOverlay(appRoot, appState.beggingMiniGameState);
}

function tickCityBeggingMiniGame(timestamp: number): void {
  cityBeggingMiniGameFrameId = null;
  const currentState = appState.beggingMiniGameState;
  if (currentState == null || !isCityBeggingMiniGamePlaying(currentState)) {
    return;
  }

  const nextResult = runInteractiveRuntime({
    state: createInteractiveRuntimeState(appState),
    request: createInteractiveActionRequest("interactive.city-begging.tick", {
      now: timestamp,
    }),
    characterDefinitions: appState.characterDefinitions,
  });
  const nextAppState = applyInteractiveRuntimeResult(appState, nextResult);
  const nextState = nextAppState.beggingMiniGameState ?? currentState;
  const shouldRerender =
    getCityBeggingMiniGameStatus(nextState) !==
    getCityBeggingMiniGameStatus(currentState);
  appState = nextAppState;

  if (shouldRerender) {
    renderApp();
    return;
  }

  syncCityBeggingMiniGameOverlay(appRoot, nextState);
  cityBeggingMiniGameFrameId = window.requestAnimationFrame(
    tickCityBeggingMiniGame
  );
}

function startCityBeggingMiniGameLoop(): void {
  if (cityBeggingMiniGameFrameId != null) {
    return;
  }

  cityBeggingMiniGameFrameId = window.requestAnimationFrame(
    tickCityBeggingMiniGame
  );
}

function openBeggingMiniGame(): void {
  const playerCharacter = getCurrentPlayerCharacter();
  if (playerCharacter == null || !isPlayerMonkIdentity(playerCharacter)) {
    return;
  }

  if (isHaozhouShortageDuringBeggingJourney(appState.gameState)) {
    stopCityBeggingMiniGameLoop();
    appState = {
      ...closeCityMenu(closeCityDirectory(appState)),
      locationDialogueState: {
        type: "house-access-refusal",
        speakerCharacterId: "char.kulan_temple_abbot",
        textLines: [
          getRuntimeText(
            "runtime.zhu_yuanzhang.haozhou_shortage.001"
          ),
          getRuntimeText(
            "runtime.zhu_yuanzhang.haozhou_shortage.002"
          ),
        ],
        advanceHintText: getRuntimeText(
          "runtime.zhu_yuanzhang.haozhou_shortage.advance_hint"
        ),
      },
      beggingMiniGameState: null,
    };
    renderApp();
    return;
  }

  if (!canAffordActivityCost(playerCharacter)) {
    stopCityBeggingMiniGameLoop();
    appState = {
      ...closeCityMenu(closeCityDirectory(appState)),
      locationDialogueState: {
        type: "house-access-refusal",
        speakerCharacterId: "char.kulan_temple_abbot",
        textLines: [
          getRuntimeText(
            "runtime.zhu_yuanzhang.begging_stamina_refusal.001"
          ),
          getRuntimeTemplateText(
            "runtime.zhu_yuanzhang.begging_stamina_refusal.002",
            {
              requiredStamina: ACTIVITY_COMPLETION_STAMINA_COST,
            }
          ),
        ],
        advanceHintText: getRuntimeText(
          "runtime.zhu_yuanzhang.begging_stamina_refusal.advance_hint"
        ),
      },
      beggingMiniGameState: null,
    };
    renderApp();
    return;
  }

  const remainingDays = getInsufficientDaysForTimedActivity(
    appState.gameState,
    CITY_BEGGING_DURATION_DAYS
  );
  if (remainingDays != null) {
    stopCityBeggingMiniGameLoop();
    showCouncilInsufficientTimeRefusal("化缘", CITY_BEGGING_DURATION_DAYS, remainingDays);
    return;
  }

  stopCityBeggingMiniGameLoop();
  const launchState = {
    ...closeCityMenu(closeCityDirectory(appState)),
    locationDialogueState: null,
  };
  appState = applyInteractiveRuntimeResult(launchState, runInteractiveRuntime({
    state: createInteractiveRuntimeState(launchState),
    characterDefinitions: launchState.characterDefinitions,
    request: createLaunchInteractiveRequest(
      "interactive.city-begging.launch",
      { now: performance.now() }
    ),
  }));
  renderApp();
  startCityBeggingMiniGameLoop();
}

function createHouseRuntimeInstance(): HouseRuntimeBridge {
  return createHouseRuntimeBridge({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp,
    syncCouncilPriorityAfterGameStateChange,
    startMapAutoAdvance,
    stopMapAutoAdvance,
    houseDefinitions,
    playerCharacterId: currentPlayerCharacterId,
    eventDefinitionsById: activeStoryEventDefinitionsById,
    sceneDefinitionsById: activeStorySceneDefinitionsById,
    activityDefinitionsById: activeActivityDefinitionsById,
    textEntriesById,
  });
}

function getActiveStoryChoiceOptions() {
  return getCurrentChoiceOptions(
    appState.gameState,
    activeStorySceneDefinitionsById
  );
}

function stopMapAutoAdvance(intervalId: string): void {
  const handle = mapAutoAdvanceHandles[intervalId];
  if (handle != null) {
    window.clearInterval(handle);
    delete mapAutoAdvanceHandles[intervalId];
  }

  if (appState.autoAdvanceState?.intervalId === intervalId) {
    appState = {
      ...appState,
      autoAdvanceState: null,
    };
  }
}

function isActivityQteBlockingScene(): boolean {
  return appState.gameState.runtime.activitySession?.type === "qte-bar";
}

function stopActivityQteLoop(): void {
  if (activityQteIntervalHandle != null) {
    window.clearInterval(activityQteIntervalHandle);
    activityQteIntervalHandle = null;
  }
}

function syncRenderedActivityQteMarker(): boolean {
  const session = appState.gameState.runtime.activitySession;
  if (session?.type !== "qte-bar") {
    return false;
  }

  const markerElement = appRoot.querySelector<HTMLElement>(
    "[data-activity-overlay='qte-bar'] .c-temple-house-qte__marker"
  );
  if (markerElement == null) {
    return false;
  }

  markerElement.style.left = `${session.markerPercent}%`;
  return true;
}

function syncActivityQteLoop(): void {
  if (appState.gameState.runtime.activitySession?.type !== "qte-bar") {
    stopActivityQteLoop();
    return;
  }

  if (activityQteIntervalHandle != null) {
    return;
  }

  activityQteIntervalHandle = window.setInterval(() => {
    if (appState.gameState.runtime.activitySession?.type !== "qte-bar") {
      stopActivityQteLoop();
      return;
    }

    appState = applyInteractiveRuntimeResult(appState, runInteractiveRuntime({
      state: createInteractiveRuntimeState(appState),
      request: createInteractiveActionRequest("interactive.activity-qte.tick"),
      characterDefinitions: appState.characterDefinitions,
    }));

    if (!syncRenderedActivityQteMarker()) {
      renderApp();
    }
  }, ACTIVITY_QTE_INTERVAL_MS);
}

function stopCurrentActivityQte(): void {
  const session = appState.gameState.runtime.activitySession;
  if (session?.type !== "qte-bar") {
    return;
  }

  if (activeActivityDefinitionsById[session.activityId] == null) {
    stopActivityQteLoop();
    appState = applyInteractiveRuntimeResult(appState, runInteractiveRuntime({
      state: createInteractiveRuntimeState(appState),
      request: createInteractiveActionRequest("interactive.activity-qte.stop"),
      characterDefinitions: appState.characterDefinitions,
      activityDefinitionsById: activeActivityDefinitionsById,
    }));
    renderApp();
    return;
  }

  appState = applyInteractiveRuntimeResult(appState, runInteractiveRuntime({
    state: createInteractiveRuntimeState(appState),
    request: createInteractiveActionRequest("interactive.activity-qte.stop"),
    characterDefinitions: appState.characterDefinitions,
    activityDefinitionsById: activeActivityDefinitionsById,
  }));
  renderApp();
}

function closeCurrentActivityResult(): void {
  appState = {
    ...appState,
    gameState: clearActivityResult(appState.gameState),
  };
  renderApp();
}

function startMapAutoAdvance(input: {
  intervalId: string;
  everyMs: number;
  targetHouseId: string;
  label: string;
  snapshots?: NonNullable<AppState["autoAdvanceState"]>["snapshots"];
  completion?: NonNullable<AppState["autoAdvanceState"]>["completion"];
}): void {
  stopMapAutoAdvance(input.intervalId);
  if (input.snapshots != null && input.snapshots.length === 0 && input.completion != null) {
    houseRuntime.applyMapAutoAdvanceCompletion(input.completion);
    return;
  }
  cancelCampaignTravel();
  houseRuntime.clearAllHouseIntervals();
  appState = {
    ...appState,
    modalState: null,
    locationDialogueState: null,
    cityMenuState: null,
    cityDirectoryState: null,
    campaignTravelState: null,
    autoAdvanceState: {
      intervalId: input.intervalId,
      label: input.label,
      targetHouseId: input.targetHouseId,
      snapshots: input.snapshots ?? null,
      completion: input.completion ?? null,
    },
    gameState: {
      ...appState.gameState,
      world: {
        ...appState.gameState.world,
        currentHouseId: null,
      },
      ui: {
        ...appState.gameState.ui,
        currentView: "map",
        overlayView: null,
        houseSession: null,
      },
    },
  };
  renderApp();

  mapAutoAdvanceHandles[input.intervalId] = window.setInterval(() => {
    const autoAdvanceState = appState.autoAdvanceState;
    if (autoAdvanceState == null || autoAdvanceState.intervalId !== input.intervalId) {
      stopMapAutoAdvance(input.intervalId);
      return;
    }

    if (autoAdvanceState.snapshots != null) {
      const [nextSnapshot, ...remainingSnapshots] = autoAdvanceState.snapshots;
      if (nextSnapshot == null) {
        stopMapAutoAdvance(input.intervalId);
        if (autoAdvanceState.completion != null) {
          houseRuntime.applyMapAutoAdvanceCompletion(autoAdvanceState.completion);
          return;
        }
        renderApp();
        return;
      }

      appState = {
        ...appState,
        characterDefinitions: nextSnapshot.characterDefinitions,
        autoAdvanceState: {
          ...autoAdvanceState,
          snapshots: remainingSnapshots,
        },
        gameState: {
          ...nextSnapshot.gameState,
          world: {
            ...nextSnapshot.gameState.world,
            currentHouseId: null,
          },
          ui: {
            ...nextSnapshot.gameState.ui,
            currentView: "map",
            overlayView: null,
            houseSession: null,
          },
        },
      };

      if (remainingSnapshots.length === 0) {
        stopMapAutoAdvance(input.intervalId);
        if (autoAdvanceState.completion != null) {
          houseRuntime.applyMapAutoAdvanceCompletion(autoAdvanceState.completion);
          return;
        }
      }

      renderApp();
      return;
    }

    const previousGameState = appState.gameState;
    appState = {
      ...appState,
      gameState: runTimeRuntime({
        state: appState.gameState,
        request: createDayStartRequest(),
      }).state,
    };
    const councilArrived =
      !hasReachedCouncilDate(previousGameState) &&
      hasReachedCouncilDate(appState.gameState);
    if (councilArrived && autoAdvanceState.completion != null) {
      stopMapAutoAdvance(input.intervalId);
      houseRuntime.applyMapAutoAdvanceCompletion(autoAdvanceState.completion);
      return;
    }
    if (syncCouncilPriorityAfterGameStateChange(previousGameState)) {
      stopMapAutoAdvance(input.intervalId);
      return;
    }
    renderApp();
  }, input.everyMs);
}

function advanceCurrentStoryScene(): void {
  const result = advanceStorySceneStep(
    {
      state: appState.gameState,
      characterDefinitions: appState.characterDefinitions,
    },
    {
      eventDefinitionsById: activeStoryEventDefinitionsById,
      sceneDefinitionsById: activeStorySceneDefinitionsById,
      activityDefinitionsById: activeActivityDefinitionsById,
      textEntriesById,
    }
  );

  appState = {
    ...appState,
    gameState: result.state,
    characterDefinitions: result.characterDefinitions,
  };
  renderApp();
}

function chooseCurrentStoryOption(choiceId: string): void {
  const selectedOption = getActiveStoryChoiceOptions().find(
    (choiceOption) => choiceOption.id === choiceId
  );
  if (selectedOption == null) {
    return;
  }

  const result = chooseStorySceneOption(
    {
      state: appState.gameState,
      characterDefinitions: appState.characterDefinitions,
    },
    {
      eventDefinitionsById: activeStoryEventDefinitionsById,
      sceneDefinitionsById: activeStorySceneDefinitionsById,
      activityDefinitionsById: activeActivityDefinitionsById,
      textEntriesById,
    },
    selectedOption
  );

  appState = {
    ...appState,
    gameState: result.state,
    characterDefinitions: result.characterDefinitions,
  };
  renderApp();
}

function dispatchCurrentStoryBattleAction(actionId: string): void {
  let followUpRendered = false;
  const result = dispatchRuntimeRequest({
    state: createInteractiveRuntimeState(appState),
    request: createInteractiveActionRequest(
      "interactive.story-battle.action",
      { battleActionId: actionId }
    ),
    context: {
      router: {
        route: ({ state, request }) =>
          runInteractiveRuntime({
            state,
            request,
            characterDefinitions: appState.characterDefinitions,
            textEntriesById,
          }),
      },
      followUp: {
        handleInteractive: ({ interactive }) => {
          enterHouseThroughRuntime(houseRuntime, interactive.houseId);
          followUpRendered = true;
          return createInteractiveRuntimeState(appState);
        },
      },
    },
  });
  appState = applyInteractiveRuntimeState(appState, result.state);

  if (followUpRendered) {
    return;
  }

  renderApp();
}

type BattleDemoResultMessage = {
  type: "rpg-tg:battle-demo-result";
  scenarioId?: string;
  result?: "victory" | "defeat";
};

function handleBattleDemoResultMessage(message: unknown): void {
  if (message == null || typeof message !== "object") {
    return;
  }

  const resultMessage = message as BattleDemoResultMessage;
  const activeBattle = appState.gameState.storyBattle;
  if (
    resultMessage.type !== "rpg-tg:battle-demo-result" ||
    activeBattle?.demoScenarioId == null ||
    resultMessage.scenarioId !== activeBattle.demoScenarioId ||
    resultMessage.result !== "victory"
  ) {
    return;
  }

  dispatchCurrentStoryBattleAction("embedded-victory");
}

async function activateLoadedModForStartup(
  loadedMod: LoadedMod,
  requestId: string
): Promise<ModActivationResult> {
  const result = await runModRuntime({
    state: modRuntimeState,
    request: {
      type: "mod.activate-loaded",
      requestId,
      loadedMod,
    },
  });
  modRuntimeState = result.state;
  toLegacyBootstrapInput(result);
  return result;
}

async function activateBuiltinDefaultMod(
  requestId: string
): Promise<ModActivationResult> {
  return activateLoadedModForStartup(
    createLoadedModFromManifest({
      source: { kind: "builtin", modId: builtinDefaultModId },
      manifest: builtinDefaultModManifest,
      rawContent: baseGameContentPack,
    }),
    requestId
  );
}

async function activateScenarioPackMod(
  scenarioPack: ScenarioPackDefinition,
  source: ModSourceDescriptor,
  requestId: string
): Promise<ModActivationResult> {
  return activateLoadedModForStartup(
    createLoadedModFromScenarioPack({ source, scenarioPack }),
    requestId
  );
}

async function activateSavedMod(
  selectedModId: string,
  requestId: string
): Promise<ModActivationResult> {
  const result = await runModRuntime({
    state: modRuntimeState,
    request: {
      type: "mod.activate",
      requestId,
      modId: selectedModId,
    },
  });
  modRuntimeState = result.state;
  toLegacyBootstrapInput(result);
  return result;
}

async function restoreModFromSave(
  saveData: SaveDataResult
): Promise<ModActivationResult | null> {
  if (saveData?.selectedModId == null) {
    return null;
  }

  return activateSavedMod(saveData.selectedModId, "restore:saved-mod");
}

function showStartupError(error: unknown): void {
  window.alert(
    error instanceof Error ? error.message : "Startup failed."
  );
}

function loadSaveData(): SaveDataResult {
  // Placeholder for future save loading integration.
  return null;
}

function startContinueGameWithLoading(selectedCharacter: CharacterDefinition): void {
  void restoreModFromSave(loadSaveData())
    .then(() =>
      startMainGameWithLoading(selectedCharacter, "haozhou-return-encounter")
    )
    .catch(showStartupError);
}

function startMainGameWithLoading(
  selectedCharacter: CharacterDefinition,
  startupScenario: StartupScenario = "default"
): void {
  const requestId = beginLoadingScreen();

  simulateLoadingProgress((progress) => {
    if (requestId !== loadingScreenRequestId) {
      return;
    }

    setActiveLoadingProgress(progress);
  }).then(async () => {
    if (requestId !== loadingScreenRequestId) {
      return;
    }

    await startMainGame(selectedCharacter, startupScenario);
    endLoadingScreen(requestId);
  }).catch((error: unknown) => {
    endLoadingScreen(requestId);
    showStartupError(error);
  });
}

async function startMainGame(
  selectedCharacter: CharacterDefinition,
  startupScenario: StartupScenario = "default"
): Promise<void> {
  const activationResult = await activateBuiltinDefaultMod(
    `startup:builtin:${startupScenario}`
  );
  const bootstrapInput = toLegacyBootstrapInput(activationResult);
  resetMainGameRuntime();
  resetActiveScenarioContent();
  currentPlayerCharacterId =
    bootstrapInput.startupProfile.playerCharacterId ?? selectedCharacter.id;
  appState = createPrototypeAppState(currentPlayerCharacterId);
  if (startupScenario === "haozhou-return-encounter") {
    appState = createHaozhouReturnEncounterAppState(appState);
  }
  houseRuntime = createHouseRuntimeInstance();
  setGameVisibility(true);
  mainUiFlow.hide();
  renderApp();
}

async function startScenarioPackWithLoading(
  scenarioPack: ScenarioPackSummary
): Promise<void> {
  try {
    const loadedScenarioPack = await loadScenarioPackFromUrl(scenarioPack.url);
    startLoadedScenarioPackWithLoading(loadedScenarioPack, {
      kind: "url",
      name: scenarioPack.title,
      url: scenarioPack.url,
    });
  } catch (error) {
    window.alert(
      error instanceof Error
        ? `JSON 开局读取失败：${error.message}`
        : "JSON 开局读取失败。"
    );
  }
}

async function startScenarioPackFilesWithLoading(
  files: File[]
): Promise<void> {
  const importLabel =
    files.find((file) => file.name === "pack.json")?.name ??
    files[0]?.name ??
    "scenario-pack";

  try {
    const loadedScenarioPack = await loadScenarioPackFromFiles(files);
    startLoadedScenarioPackWithLoading(loadedScenarioPack, {
      kind: "file",
      name: importLabel,
      filePath: importLabel,
    });
  } catch (error) {
    window.alert(
      error instanceof Error
        ? `JSON 开局读取失败（${importLabel}）：${error.message}`
        : `JSON 开局读取失败（${importLabel}）。`
    );
  }
}

function startLoadedScenarioPackWithLoading(
  scenarioPack: ScenarioPackDefinition,
  source: ModSourceDescriptor
): void {
  const requestId = beginLoadingScreen();

  simulateLoadingProgress((progress) => {
    if (requestId !== loadingScreenRequestId) {
      return;
    }

    setActiveLoadingProgress(progress);
  }).then(async () => {
    if (requestId !== loadingScreenRequestId) {
      return;
    }

    await startLoadedScenarioPack(scenarioPack, source);
    endLoadingScreen(requestId);
  }).catch((error: unknown) => {
    endLoadingScreen(requestId);
    showStartupError(error);
  });
}

async function startLoadedScenarioPack(
  scenarioPack: ScenarioPackDefinition,
  source: ModSourceDescriptor
): Promise<void> {
  const activationResult = await activateScenarioPackMod(
    scenarioPack,
    source,
    `startup:${source.kind}:${scenarioPack.id}`
  );
  const bootstrapInput = toLegacyBootstrapInput(activationResult);
  resetMainGameRuntime();
  resetActiveScenarioContent();
  installScenarioPackContent(scenarioPack);
  currentPlayerCharacterId =
    bootstrapInput.startupProfile.playerCharacterId ??
    scenarioPack.scenarioProfile.playerCharacterId;
  appState = createScenarioPackAppState(scenarioPack);
  houseRuntime = createHouseRuntimeInstance();
  setGameVisibility(true);
  mainUiFlow.hide();
  renderApp();
}

function resetActiveScenarioContent(): void {
  syncActiveGameContent(createActiveGameContent(baseGameContentPack));
}

function resetActiveWorldContent(): void {
  syncActiveGameContent(createActiveGameContent(baseGameContentPack));
}

function installScenarioPackContent(scenarioPack: ScenarioPackDefinition): void {
  syncActiveGameContent(createActiveGameContent(baseGameContentPack, scenarioPack));
}

function installScenarioPackWorldContent(
  scenarioPack: ScenarioPackDefinition
): void {
  syncActiveGameContent(createActiveGameContent(baseGameContentPack, scenarioPack));
}

function mergeById<T extends { id: string }>(base: T[], next: T[]): T[] {
  if (next.length === 0) {
    return base;
  }

  const nextIds = new Set(next.map((definition) => definition.id));
  return [
    ...base.filter((definition) => !nextIds.has(definition.id)),
    ...next,
  ];
}

function createScenarioPackAppState(
  scenarioPack: ScenarioPackDefinition
): AppState {
  const profile = scenarioPack.scenarioProfile;
  const scenarioMapDefinition =
    getMapDefinitionById(profile.initialLocation.mapId) ??
    activeMapDefinitions[0];
  assertExists(
    scenarioMapDefinition,
    `Missing scenario map "${profile.initialLocation.mapId}".`
  );
  const calendar = profile.initialCalendar ?? {
    year: 1,
    month: 1,
    day: 1,
  };
  const playerCoordinate =
    profile.initialPlayerCoordinate ??
    cityCoordinatesById[profile.initialLocation.cityId] ??
    scenarioMapDefinition.initialPlayerCoordinate ??
    { x: 0, y: 0 };

  let nextAppState: AppState = {
    gameState: ensureCityNpcPoolsForCurrentDay(
      createInitialState({
        currentMapId: profile.initialLocation.mapId,
        currentCityId: profile.initialLocation.cityId,
        currentHouseId: profile.initialLocation.houseId,
        playerCharacterId: profile.playerCharacterId,
        chapterId: profile.chapterId,
        year: calendar.year,
        month: calendar.month,
        day: calendar.day,
        pinnedCharacterId: profile.playerCharacterId,
        reviewDateText: profile.initialUi?.reviewDateText ?? "JSON 开局",
        mainHouseMissionText:
          profile.initialUi?.mainHouseMissionText ?? scenarioPack.title,
        cards: {
          ownedCardIds: cardDefinitions.map((cardDefinition) => cardDefinition.id),
          selectedCardId: cardDefinitions[0]?.id ?? null,
        },
        valuables: {
          items: activeGameContent.valuables,
          selectedItemId: activeGameContent.valuables[0]?.id ?? null,
          equippedWeaponSet: {
            swordId:
              activeGameContent.valuables.find(
                (valuableDefinition) => valuableDefinition.category === "weapon"
              )?.id ?? null,
            armorId:
              activeGameContent.valuables.find(
                (valuableDefinition) => valuableDefinition.category === "armor"
              )?.id ?? null,
          },
        },
        currentView: profile.initialLocation.view,
      }),
      cityNpcPoolDefinitions
    ),
    characterDefinitions: mergeCharacterDefinitions(
      activeGameContent.characters,
      scenarioPack.characters ?? []
    ),
    playerCoordinate,
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
    uiLayouts: {
      "global-hud": createDefaultGlobalHudLayout(),
      "start-screen": createDefaultStartScreenLayout(),
      "character-select-screen": createDefaultCharacterSelectScreenLayout(),
      "character-detail-screen": createDefaultCharacterDetailScreenLayout(),
    },
    layoutEditor: {
      isOpen: false,
      selectedTargetId: "global-hud",
      selectedComponentId: "status-board",
      selectedElementId: null,
      backgroundAssetQuery: "",
    },
  };

  nextAppState = {
    ...nextAppState,
    gameState: {
      ...nextAppState.gameState,
      runtime: {
        ...nextAppState.gameState.runtime,
        flags: {
          ...nextAppState.gameState.runtime.flags,
          ...(profile.initialRuntime?.flags ?? {}),
        },
        variables: {
          ...nextAppState.gameState.runtime.variables,
          ...(profile.initialRuntime?.variables ?? {}),
        },
      },
    },
  };

  if (profile.entryEventId != null) {
    const storyResult = startStoryEventById(
      {
        state: nextAppState.gameState,
        characterDefinitions: nextAppState.characterDefinitions,
      },
      {
        eventDefinitionsById: activeStoryEventDefinitionsById,
        sceneDefinitionsById: activeStorySceneDefinitionsById,
        activityDefinitionsById: activeActivityDefinitionsById,
        textEntriesById,
      },
      profile.entryEventId
    );

    nextAppState = {
      ...nextAppState,
      gameState: storyResult.state,
      characterDefinitions: storyResult.characterDefinitions,
    };
  }

  return nextAppState;
}

function mergeCharacterDefinitions(
  baseCharacters: CharacterDefinition[],
  scenarioCharacters: CharacterDefinition[]
): CharacterDefinition[] {
  const scenarioCharacterIds = new Set(
    scenarioCharacters.map((characterDefinition) => characterDefinition.id)
  );

  return [
    ...baseCharacters.filter(
      (characterDefinition) => !scenarioCharacterIds.has(characterDefinition.id)
    ),
    ...scenarioCharacters,
  ];
}

function createHaozhouReturnEncounterAppState(baseState: AppState): AppState {
  let nextAppState: AppState = {
    ...baseState,
    gameState: {
      ...baseState.gameState,
      world: {
        ...baseState.gameState.world,
        currentCityId: "city.kulan",
        currentHouseId: null,
      },
      ui: {
        ...baseState.gameState.ui,
        currentView: "city",
        overlayView: null,
        houseSession: null,
        mainHouseMissionText: getRuntimeText(
          "runtime.zhu_yuanzhang.main_mission.haozhou_return"
        ),
      },
      runtime: {
        ...baseState.gameState.runtime,
        flags: {
          ...baseState.gameState.runtime.flags,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.ordinationCompleted]: true,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted]: true,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked]: true,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingUnlocked]: true,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingTransitionAssigned]: true,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.banditBattleCompleted]: true,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.banditBattleWon]: true,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.sundeyaRescueBattleCompleted]: false,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.sundeyaRescueBattleWon]: false,
        },
        variables: {
          ...baseState.gameState.runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 0,
          [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage]:
            ZHU_YUANZHANG_STORY_STAGES.huangjueBeggingJourney,
          [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeWeek]: 4,
          [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeContribution]: 30,
          [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.lastBattleId]:
            "story.zhu_yuanzhang.week4.roadside-bandits",
          [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.lastBattleResult]: "victory",
        },
      },
    },
    characterDefinitions: createPrototypeCharactersForStoryStage(
      ZHU_YUANZHANG_STORY_STAGES.huangjueBeggingJourney
    ),
    modalState: null,
    locationDialogueState: null,
    cityMenuState: null,
    cityDirectoryState: null,
    beggingMiniGameState: null,
    campaignTravelState: null,
  };

  const storyResult = startStoryEventById(
    {
      state: nextAppState.gameState,
      characterDefinitions: nextAppState.characterDefinitions,
    },
    {
      eventDefinitionsById: activeStoryEventDefinitionsById,
      sceneDefinitionsById: activeStorySceneDefinitionsById,
      activityDefinitionsById: activeActivityDefinitionsById,
      textEntriesById,
    },
    "event.story.zhu_yuanzhang.haozhou_return_encounter"
  );

  nextAppState = {
    ...nextAppState,
    gameState: {
      ...storyResult.state,
      scene: {
        ...storyResult.state.scene,
        cursor: HAOZHOU_RETURN_ENCOUNTER_SPY_SCENE_CURSOR,
        status: "playing",
      },
    },
    characterDefinitions: storyResult.characterDefinitions,
  };

  return nextAppState;
}

function beginLoadingScreen(): number {
  loadingScreenRequestId += 1;

  if (loadingScreenAnimationFrameId != null) {
    window.cancelAnimationFrame(loadingScreenAnimationFrameId);
    loadingScreenAnimationFrameId = null;
  }

  const selectedLoadingTheme = selectRandomLoadingTheme();
  activeLoadingTheme = selectedLoadingTheme;
  window.console.log(
    "[Loading] selected theme:",
    selectedLoadingTheme.name,
    selectedLoadingTheme.cursorPath
  );
  const loadingHost = document.createElement("div");
  loadingHost.className = "c-loading-screen-host";
  loadingHost.innerHTML = renderLoadingScreen(0, selectedLoadingTheme);
  document.body.append(loadingHost);
  activeLoadingScreenElement = loadingHost.querySelector<HTMLElement>(
    ".c-loading-screen"
  );
  mainUiFlow.hide();

  return loadingScreenRequestId;
}

function setActiveLoadingProgress(progress: number): void {
  if (activeLoadingScreenElement == null) {
    return;
  }

  if (activeLoadingTheme == null) {
    return;
  }

  setLoadingScreenProgress(activeLoadingScreenElement, progress, activeLoadingTheme);
}

function endLoadingScreen(requestId: number): void {
  if (requestId !== loadingScreenRequestId) {
    return;
  }

  activeLoadingScreenElement?.parentElement?.remove();
  activeLoadingScreenElement = null;
  activeLoadingTheme = null;
  loadingScreenAnimationFrameId = null;
}

function simulateLoadingProgress(
  onProgress: (progress: number) => void
): Promise<void> {
  return new Promise((resolve) => {
    const startedAtMs = performance.now();

    const tick = (timestamp: number): void => {
      const elapsedMs = timestamp - startedAtMs;
      const linearProgress = Math.min(
        elapsedMs / LOADING_SCREEN_SIMULATION_DURATION_MS,
        1
      );
      const easedProgress = 1 - (1 - linearProgress) ** 3;

      // Replace this simulated value with real asset/scene loading progress when
      // the project has an async loading pipeline.
      onProgress(easedProgress);

      if (linearProgress < 1) {
        loadingScreenAnimationFrameId = window.requestAnimationFrame(tick);
        return;
      }

      loadingScreenAnimationFrameId = null;
      resolve();
    };

    loadingScreenAnimationFrameId = window.requestAnimationFrame(tick);
  });
}

function setGameVisibility(isVisible: boolean): void {
  appRoot.style.visibility = isVisible ? "visible" : "hidden";
  appRoot.style.pointerEvents = isVisible ? "auto" : "none";
  syncBackgroundMusic(isVisible ? "in-game" : "opening");
}

function resetMainGameRuntime(): void {
  houseRuntime.clearAllHouseIntervals();
  stopCityBeggingMiniGameLoop();
  stopActivityQteLoop();

  if (loadingScreenAnimationFrameId != null) {
    window.cancelAnimationFrame(loadingScreenAnimationFrameId);
  }

  loadingScreenAnimationFrameId = null;
  activeLoadingTheme = null;

  if (initialCampaignMapDebugAnimationFrame != null) {
    window.cancelAnimationFrame(initialCampaignMapDebugAnimationFrame);
  }

  initialCampaignMapDebugAnimationFrame = null;
  initialCampaignMapDebugAnimationStartTime = null;
  hasAppliedInitialCampaignMapDebug = false;
  hasStartedInitialCampaignMapDebugAnimation = false;
  campaignMapDebugState = {
    ...INITIAL_CAMPAIGN_MAP_DEBUG_STATE,
  };
  campaignMapDebugHomeState = {
    ...INITIAL_CAMPAIGN_MAP_DEBUG_STATE,
  };
  campaignMapDragState = null;
  shouldSuppressNextClickAfterMapDrag = false;
  cityBeggingMiniGameFrameId = null;
  layoutEditorDragState = null;
  hideMapIntroOverlay();
}

function createBackgroundMusicPlayer(): HTMLAudioElement {
  const audio = new Audio();
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 0.35;
  return audio;
}

function syncBackgroundMusic(mode: BackgroundMusicMode): void {
  const nextSourceUrl = mode === "opening" ? OPENING_BGM_URL : IN_GAME_BGM_URL;
  if (activeBackgroundMusicMode !== mode) {
    activeBackgroundMusicMode = mode;
    backgroundMusicPlayer.pause();
    backgroundMusicPlayer.src = nextSourceUrl;
    backgroundMusicPlayer.currentTime = 0;
    backgroundMusicPlayer.load();
  }

  void playBackgroundMusic();
}

async function playBackgroundMusic(): Promise<void> {
  try {
    await backgroundMusicPlayer.play();
  } catch {
    // Browser autoplay policy may defer playback until the next user gesture.
  }
}

function resumeBackgroundMusicIfNeeded(): void {
  if (backgroundMusicPlayer.paused) {
    void playBackgroundMusic();
  }
}

function canOpenHouseFromCity(houseDefinition: HouseDefinition): boolean {
  const accessResult = selectHouseEntryAccess(
    appState.gameState,
    appState.characterDefinitions,
    houseDefinition,
    activeGameContent.houseAccessRefusalRules
  );

  if (accessResult.canEnter) {
    if (appState.locationDialogueState != null) {
      appState = {
        ...appState,
        locationDialogueState: null,
      };
    }
    return true;
  }

  if (accessResult.refusal != null) {
    appState = {
      ...appState,
      locationDialogueState: {
        type: "house-access-refusal",
        speakerCharacterId: accessResult.refusal.speakerCharacterId,
        textLines: [accessResult.refusal.text],
        advanceHintText: accessResult.refusal.confirmLabel,
      },
    };
    renderApp();
  }

  return false;
}

function enterMappedCity3dHouseBySceneObjectId(
  sceneObjectId: string,
  requestedHouseId: string | null = null
): void {
  const normalizedSceneObjectId = sceneObjectId.trim();
  if (!normalizedSceneObjectId) {
    return;
  }

  const mapping =
    getZhuYuanzhangCitySceneMappingByCityId()[
      appState.gameState.world.currentCityId
    ];
  const mappedHouse =
    mapping?.houses.find(
      (houseMapping) =>
        houseMapping.sceneObjectId === normalizedSceneObjectId &&
        (requestedHouseId == null || houseMapping.houseId === requestedHouseId)
    ) ?? null;
  if (mappedHouse == null) {
    return;
  }

  const houseDefinition = houseDefinitions.find(
    (candidateHouse) => candidateHouse.id === mappedHouse.houseId
  );
  if (houseDefinition == null || !canOpenHouseFromCity(houseDefinition)) {
    return;
  }

  enterHouseThroughRuntime(houseRuntime, mappedHouse.houseId);
}

window.addEventListener("pointerdown", resumeBackgroundMusicIfNeeded, {
  passive: true,
});
window.addEventListener("keydown", resumeBackgroundMusicIfNeeded);
window.addEventListener("message", (event) => {
  if (event.origin !== window.location.origin) {
    return;
  }

  const data = event.data;
  if (
    data == null ||
    typeof data !== "object" ||
    data.type !== "hd2deg:enter-house" ||
    typeof data.sceneObjectId !== "string"
  ) {
    return;
  }

  enterMappedCity3dHouseBySceneObjectId(
    data.sceneObjectId,
    typeof data.houseId === "string" ? data.houseId : null
  );
});

function getLayoutEditorDragHandleSelector(): string {
  if (layoutEditorDragState == null) {
    return "";
  }

  if (layoutEditorDragState.mode === "component-size") {
    return `[data-layout-component-resize="${layoutEditorDragState.componentId}"][data-layout-resize-axis="${layoutEditorDragState.resizeAxis}"]`;
  }

  if (layoutEditorDragState.mode === "element-size") {
    return `[data-layout-element-resize="${layoutEditorDragState.componentId}:${layoutEditorDragState.elementId}"][data-layout-resize-axis="${layoutEditorDragState.resizeAxis}"]`;
  }

  return layoutEditorDragState.mode === "component"
    ? `[data-layout-component-handle="${layoutEditorDragState.componentId}"]`
    : `[data-layout-element-handle="${layoutEditorDragState.componentId}:${layoutEditorDragState.elementId}"]`;
}

function getLayoutEditorDragEventId(event: PointerEvent | MouseEvent): number {
  return "pointerId" in event ? event.pointerId : -1;
}

function setLayoutEditorPointerCapture(
  element: HTMLElement,
  event: PointerEvent | MouseEvent
): void {
  if ("pointerId" in event) {
    element.setPointerCapture(event.pointerId);
  }
}

function releaseLayoutEditorPointerCapture(
  element: HTMLElement,
  event: PointerEvent | MouseEvent
): void {
  if ("pointerId" in event && element.hasPointerCapture(event.pointerId)) {
    element.releasePointerCapture(event.pointerId);
  }
}

function getSelectedLayout(): UiLayout {
  return appState.uiLayouts[appState.layoutEditor.selectedTargetId];
}

function renderActiveSurface(): void {
  if (uiOverlayElement == null) {
    renderApp();
    return;
  }
  if (uiOverlayElement.classList.contains("is-hidden")) {
    renderApp();
    return;
  }

  mainUiFlow.render();
}

async function copyCurrentLayoutParams(): Promise<void> {
  const payload = {
    targetId: appState.layoutEditor.selectedTargetId,
    selectedComponentId: appState.layoutEditor.selectedComponentId,
    selectedElementId: appState.layoutEditor.selectedElementId,
    layout: getSelectedLayout(),
  };
  await navigator.clipboard.writeText(`${JSON.stringify(payload, null, 2)}\n`);
}

function handleLayoutEditorInput(targetElement: EventTarget | null): boolean {
  if (
    !(
      targetElement instanceof HTMLInputElement ||
      targetElement instanceof HTMLSelectElement
    )
  ) {
    return false;
  }

  if (
    targetElement instanceof HTMLInputElement &&
    targetElement.hasAttribute("data-layout-background-asset-query")
  ) {
    appState = setLayoutEditorBackgroundAssetQuery(appState, targetElement.value);
    renderActiveSurface();
    return true;
  }

  const componentId = targetElement.dataset.layoutComponentId;
  if (componentId == null) {
    return false;
  }

  if (
    targetElement instanceof HTMLSelectElement &&
    targetElement.hasAttribute("data-layout-background-asset")
  ) {
    const selectedAsset = globalHudBackgroundOptions.find(
      (asset) => asset.id === targetElement.value
    );
    if (selectedAsset != null) {
      appState = setLayoutEditorBackgroundAsset(
        appState,
        componentId,
        selectedAsset
      );
      renderActiveSurface();
    }
    return true;
  }

  if (
    targetElement instanceof HTMLSelectElement &&
    targetElement.hasAttribute("data-layout-background-mode")
  ) {
    appState = setLayoutEditorBackgroundMode(
      appState,
      componentId,
      targetElement.value as UiLayoutBackgroundMode
    );
    renderActiveSurface();
    return true;
  }

  if (
    targetElement instanceof HTMLInputElement &&
    targetElement.dataset.layoutSliceEdge != null
  ) {
    appState = setLayoutEditorBackgroundSlice(
      appState,
      componentId,
      targetElement.dataset.layoutSliceEdge as "top" | "right" | "bottom" | "left",
      Number(targetElement.value)
    );
    renderActiveSurface();
    return true;
  }

  if (
    targetElement instanceof HTMLInputElement &&
    targetElement.dataset.layoutComponentField != null
  ) {
    appState = setLayoutEditorComponentRectField(
      appState,
      componentId,
      targetElement.dataset.layoutComponentField as keyof UiLayoutRect,
      Number(targetElement.value)
    );
    renderActiveSurface();
    return true;
  }

  if (
    targetElement instanceof HTMLInputElement &&
    targetElement.dataset.layoutElementField != null &&
    targetElement.dataset.layoutElementId != null
  ) {
    appState = setLayoutEditorElementRectField(
      appState,
      componentId,
      targetElement.dataset.layoutElementId,
      targetElement.dataset.layoutElementField as keyof UiLayoutRect,
      Number(targetElement.value)
    );
    renderActiveSurface();
    return true;
  }

  return false;
}

function handleLayoutEditorClick(targetElement: EventTarget | null): boolean {
  if (!(targetElement instanceof HTMLElement)) {
    return false;
  }

  const openLayoutEditorButton = targetElement.closest<HTMLElement>(
    "[data-action='open-layout-editor']"
  );
  if (openLayoutEditorButton != null) {
    if (uiOverlayElement == null) {
      return false;
    }
    const nextTargetId: LayoutEditorTargetId =
      appState.gameState.ui.overlayView === "detail"
        ? "character-detail-screen"
        : uiOverlayElement.classList.contains("is-hidden")
          ? appState.layoutEditor.selectedTargetId
          : uiOverlayElement.querySelector(".c-main-ui-screen--character-select") != null
            ? "character-select-screen"
            : "start-screen";
    appState =
      nextTargetId === appState.layoutEditor.selectedTargetId
        ? appState
        : selectLayoutEditorTarget(appState, nextTargetId);
    appState = toggleLayoutEditor(appState, true);
    renderActiveSurface();
    return true;
  }

  const closeLayoutEditorButton = targetElement.closest<HTMLElement>(
    "[data-action='close-layout-editor']"
  );
  if (closeLayoutEditorButton != null) {
    appState = toggleLayoutEditor(appState, false);
    renderActiveSurface();
    return true;
  }

  const layoutTargetButton = targetElement.closest<HTMLElement>(
    "[data-layout-target-id]"
  );
  if (layoutTargetButton != null) {
    const targetId = layoutTargetButton.dataset.layoutTargetId;
    if (
      targetId === "global-hud" ||
      targetId === "start-screen" ||
      targetId === "character-select-screen" ||
      targetId === "character-detail-screen"
    ) {
      appState = selectLayoutEditorTarget(appState, targetId as LayoutEditorTargetId);
      renderActiveSurface();
    }
    return true;
  }

  const layoutElementSelectButton = targetElement.closest<HTMLElement>(
    "[data-layout-element-select]"
  );
  if (layoutElementSelectButton != null) {
    const value = layoutElementSelectButton.dataset.layoutElementSelect;
    const [componentId, elementId] = value?.split(":") ?? [];
    if (componentId != null && elementId != null) {
      appState = selectLayoutEditorElement(appState, componentId, elementId);
      renderActiveSurface();
    }
    return true;
  }

  const layoutComponentSelectButton = targetElement.closest<HTMLElement>(
    "[data-layout-component-select]"
  );
  if (layoutComponentSelectButton != null) {
    const componentId = layoutComponentSelectButton.dataset.layoutComponentSelect;
    if (componentId != null) {
      appState = selectLayoutEditorComponent(appState, componentId);
      renderActiveSurface();
    }
    return true;
  }

  const copyLayoutParamsButton = targetElement.closest<HTMLElement>(
    "[data-action='copy-layout-params']"
  );
  if (copyLayoutParamsButton != null) {
    void copyCurrentLayoutParams();
    return true;
  }

  return false;
}

function startLayoutEditorDrag(event: PointerEvent | MouseEvent): boolean {
  const targetElement = event.target;
  if (!(targetElement instanceof HTMLElement)) {
    return false;
  }

  const componentResizeHandle = targetElement.closest<HTMLElement>(
    "[data-layout-component-resize]"
  );
  if (componentResizeHandle != null) {
    const componentId = componentResizeHandle.dataset.layoutComponentResize;
    const resizeAxis = componentResizeHandle.dataset.layoutResizeAxis;
    if (
      componentId != null &&
      (resizeAxis === "x" || resizeAxis === "y" || resizeAxis === "xy")
    ) {
      event.preventDefault();
      event.stopPropagation();
      layoutEditorDragState = {
        mode: "component-size",
        componentId,
        elementId: null,
        pointerId: getLayoutEditorDragEventId(event),
        startClientX: event.clientX,
        startClientY: event.clientY,
        resizeAxis,
      };
      setLayoutEditorPointerCapture(componentResizeHandle, event);
      return true;
    }
  }

  const elementResizeHandle = targetElement.closest<HTMLElement>(
    "[data-layout-element-resize]"
  );
  if (elementResizeHandle != null) {
    const [componentId, elementId] =
      elementResizeHandle.dataset.layoutElementResize?.split(":") ?? [];
    const resizeAxis = elementResizeHandle.dataset.layoutResizeAxis;
    if (
      componentId != null &&
      elementId != null &&
      (resizeAxis === "x" || resizeAxis === "y" || resizeAxis === "xy")
    ) {
      event.preventDefault();
      event.stopPropagation();
      layoutEditorDragState = {
        mode: "element-size",
        componentId,
        elementId,
        pointerId: getLayoutEditorDragEventId(event),
        startClientX: event.clientX,
        startClientY: event.clientY,
        resizeAxis,
      };
      setLayoutEditorPointerCapture(elementResizeHandle, event);
      return true;
    }
  }

  const elementHandle = targetElement.closest<HTMLElement>(
    "[data-layout-element-handle]"
  );
  if (elementHandle != null) {
    const [componentId, elementId] =
      elementHandle.dataset.layoutElementHandle?.split(":") ?? [];
    if (componentId != null && elementId != null) {
      layoutEditorDragState = {
        mode: "element",
        componentId,
        elementId,
        pointerId: getLayoutEditorDragEventId(event),
        startClientX: event.clientX,
        startClientY: event.clientY,
      };
      setLayoutEditorPointerCapture(elementHandle, event);
      return true;
    }
  }

  const componentHandle = targetElement.closest<HTMLElement>(
    "[data-layout-component-handle]"
  );
  if (componentHandle != null) {
    const componentId = componentHandle.dataset.layoutComponentHandle;
    if (componentId != null) {
      layoutEditorDragState = {
        mode: "component",
        componentId,
        elementId: null,
        pointerId: getLayoutEditorDragEventId(event),
        startClientX: event.clientX,
        startClientY: event.clientY,
      };
      setLayoutEditorPointerCapture(componentHandle, event);
      return true;
    }
  }

  return false;
}

function moveLayoutEditorDrag(event: PointerEvent | MouseEvent): boolean {
  if (
    layoutEditorDragState == null ||
    layoutEditorDragState.pointerId !== getLayoutEditorDragEventId(event)
  ) {
    return false;
  }

  const deltaX = event.clientX - layoutEditorDragState.startClientX;
  const deltaY = event.clientY - layoutEditorDragState.startClientY;
  layoutEditorDragState = {
    ...layoutEditorDragState,
    startClientX: event.clientX,
    startClientY: event.clientY,
  };

  if (layoutEditorDragState.mode === "component") {
    appState = updateLayoutEditorComponentPosition(
      appState,
      layoutEditorDragState.componentId,
      deltaX,
      deltaY
    );
  } else if (layoutEditorDragState.mode === "component-size") {
    appState = updateLayoutEditorComponentSize(
      appState,
      layoutEditorDragState.componentId,
      layoutEditorDragState.resizeAxis ?? "xy",
      layoutEditorDragState.resizeAxis === "y" ? 0 : deltaX,
      layoutEditorDragState.resizeAxis === "x" ? 0 : deltaY
    );
  } else if (
    layoutEditorDragState.mode === "element-size" &&
    layoutEditorDragState.elementId != null
  ) {
    appState = updateLayoutEditorElementSize(
      appState,
      layoutEditorDragState.componentId,
      layoutEditorDragState.elementId,
      layoutEditorDragState.resizeAxis ?? "xy",
      layoutEditorDragState.resizeAxis === "y" ? 0 : deltaX,
      layoutEditorDragState.resizeAxis === "x" ? 0 : deltaY
    );
  } else if (layoutEditorDragState.elementId != null) {
    appState = updateLayoutEditorElementPosition(
      appState,
      layoutEditorDragState.componentId,
      layoutEditorDragState.elementId,
      deltaX,
      deltaY
    );
  }

  renderActiveSurface();
  return true;
}

function endLayoutEditorDrag(event: PointerEvent | MouseEvent): boolean {
  if (
    layoutEditorDragState == null ||
    layoutEditorDragState.pointerId !== getLayoutEditorDragEventId(event)
  ) {
    return false;
  }

  const handle =
    document.querySelector<HTMLElement>(getLayoutEditorDragHandleSelector()) ?? null;
  if (handle != null) {
    releaseLayoutEditorPointerCapture(handle, event);
  }
  layoutEditorDragState = null;
  return true;
}

appElement.addEventListener("input", (event) => {
  if (handleLayoutEditorInput(event.target)) {
    return;
  }

  const targetElement = event.target;
  if (
    !(
      targetElement instanceof HTMLInputElement ||
      targetElement instanceof HTMLSelectElement
    )
  ) {
    return;
  }

  if (
    targetElement instanceof HTMLInputElement &&
    targetElement.hasAttribute("data-layout-background-asset-query")
  ) {
    appState = setLayoutEditorBackgroundAssetQuery(appState, targetElement.value);
    renderApp();
    return;
  }

  const componentId = targetElement.dataset.layoutComponentId;
  if (componentId != null) {
    if (
      targetElement instanceof HTMLSelectElement &&
      targetElement.hasAttribute("data-layout-background-asset")
    ) {
      const selectedAsset = globalHudBackgroundOptions.find(
        (asset) => asset.id === targetElement.value
      );
      if (selectedAsset != null) {
        appState = setLayoutEditorBackgroundAsset(
          appState,
          componentId,
          selectedAsset
        );
        renderApp();
      }
      return;
    }

    if (
      targetElement instanceof HTMLSelectElement &&
      targetElement.hasAttribute("data-layout-background-mode")
    ) {
      appState = setLayoutEditorBackgroundMode(
        appState,
        componentId,
        targetElement.value as UiLayoutBackgroundMode
      );
      renderApp();
      return;
    }

    if (
      targetElement instanceof HTMLInputElement &&
      targetElement.dataset.layoutSliceEdge != null
    ) {
      appState = setLayoutEditorBackgroundSlice(
        appState,
        componentId,
        targetElement.dataset.layoutSliceEdge as "top" | "right" | "bottom" | "left",
        Number(targetElement.value)
      );
      renderApp();
      return;
    }

    if (
      targetElement instanceof HTMLInputElement &&
      targetElement.dataset.layoutComponentField != null
    ) {
      appState = setLayoutEditorComponentRectField(
        appState,
        componentId,
        targetElement.dataset.layoutComponentField as keyof UiLayoutRect,
        Number(targetElement.value)
      );
      renderApp();
      return;
    }

    if (
      targetElement instanceof HTMLInputElement &&
      targetElement.dataset.layoutElementField != null &&
      targetElement.dataset.layoutElementId != null
    ) {
      appState = setLayoutEditorElementRectField(
        appState,
        componentId,
        targetElement.dataset.layoutElementId,
        targetElement.dataset.layoutElementField as keyof UiLayoutRect,
        Number(targetElement.value)
      );
      renderApp();
      return;
    }
  }

  const fieldId = targetElement.dataset.houseField;
  if (fieldId != null) {
    dispatchHouseRuntimeRequest(houseRuntime, {
      type: "field",
      fieldId,
      value: targetElement.value,
    });
  }
});

uiOverlayElement.addEventListener("input", (event) => {
  handleLayoutEditorInput(event.target);
});

uiOverlayElement.addEventListener("pointerdown", (event) => {
  startLayoutEditorDrag(event);
});

uiOverlayElement.addEventListener("pointermove", (event) => {
  moveLayoutEditorDrag(event);
});

uiOverlayElement.addEventListener("pointerup", (event) => {
  endLayoutEditorDrag(event);
});

uiOverlayElement.addEventListener("pointercancel", (event) => {
  endLayoutEditorDrag(event);
});

uiOverlayElement.addEventListener("mousedown", (event) => {
  if (layoutEditorDragState == null) {
    startLayoutEditorDrag(event);
  }
});

uiOverlayElement.addEventListener("mousemove", (event) => {
  moveLayoutEditorDrag(event);
});

uiOverlayElement.addEventListener("mouseup", (event) => {
  endLayoutEditorDrag(event);
});

uiOverlayElement.addEventListener("click", (event) => {
  handleLayoutEditorClick(event.target);
});

appElement.addEventListener("wheel", (event) => {
  const targetElement = event.target;
  if (!(targetElement instanceof HTMLElement)) {
    return;
  }

  const campaignMap = targetElement.closest<HTMLElement>(
    "[data-campaign-map-viewport]"
  );
  if (campaignMap == null) {
    return;
  }

  event.preventDefault();
  const direction = event.deltaY > 0 ? -1 : 1;
  zoomCampaignMapAtScreenCenter(
    campaignMapDebugState.scale + direction * MAP_DEBUG_SCALE_STEP
  );
});

appElement.addEventListener("pointerdown", (event) => {
  if (startLayoutEditorDrag(event)) {
    return;
  }

  const targetElement = event.target;
  if (!(targetElement instanceof HTMLElement)) {
    return;
  }

  const pointerHouseActionButton = targetElement.closest<HTMLElement>(
    "[data-house-action]"
  );
  const pointerHouseActionId = pointerHouseActionButton?.dataset.houseAction;
  if (
    pointerHouseActionId != null &&
    shouldDispatchHouseActionOnPointerDown(pointerHouseActionId)
  ) {
    event.preventDefault();
    event.stopPropagation();
    recentPointerDispatchedHouseAction = {
      actionId: pointerHouseActionId,
      timestamp: window.performance.now(),
    };
    dispatchHouseRuntimeRequest(houseRuntime, {
      type: "action",
      actionId: pointerHouseActionId,
    });
    return;
  }

  const componentResizeHandle = targetElement.closest<HTMLElement>(
    "[data-layout-component-resize]"
  );
  if (componentResizeHandle != null) {
    const componentId = componentResizeHandle.dataset.layoutComponentResize;
    const resizeAxis = componentResizeHandle.dataset.layoutResizeAxis;
    if (
      componentId != null &&
      (resizeAxis === "x" || resizeAxis === "y" || resizeAxis === "xy")
    ) {
      event.preventDefault();
      event.stopPropagation();
      layoutEditorDragState = {
        mode: "component-size",
        componentId,
        elementId: null,
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startClientY: event.clientY,
        resizeAxis,
      };
      componentResizeHandle.setPointerCapture(event.pointerId);
      return;
    }
  }

  const elementHandle = targetElement.closest<HTMLElement>(
    "[data-layout-element-handle]"
  );
  if (elementHandle != null) {
    const [componentId, elementId] =
      elementHandle.dataset.layoutElementHandle?.split(":") ?? [];
    if (componentId != null && elementId != null) {
      layoutEditorDragState = {
        mode: "element",
        componentId,
        elementId,
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startClientY: event.clientY,
      };
      elementHandle.setPointerCapture(event.pointerId);
      return;
    }
  }

  const componentHandle = targetElement.closest<HTMLElement>(
    "[data-layout-component-handle]"
  );
  if (componentHandle != null) {
    const componentId = componentHandle.dataset.layoutComponentHandle;
    if (componentId != null) {
      layoutEditorDragState = {
        mode: "component",
        componentId,
        elementId: null,
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startClientY: event.clientY,
      };
      componentHandle.setPointerCapture(event.pointerId);
      return;
    }
  }

  if (targetElement.closest(".c-campaign-map-debug") != null) {
    return;
  }

   // City markers are clickable buttons; do not turn their press into a drag capture.
  if (targetElement.closest("[data-map-node-id]") != null) {
    return;
  }

  const campaignMap = targetElement.closest<HTMLElement>(
    "[data-campaign-map-viewport]"
  );
  if (campaignMap == null) {
    return;
  }

  if (isInitialCampaignMapDebugAnimating()) {
    return;
  }

  campaignMapDragState = {
    pointerId: event.pointerId,
    startClientX: event.clientX,
    startClientY: event.clientY,
    startOffsetX: campaignMapDebugState.offsetX,
    startOffsetY: campaignMapDebugState.offsetY,
    didMove: false,
  };
  campaignMap.classList.add("is-dragging");
  campaignMap.setPointerCapture(event.pointerId);
});

appElement.addEventListener("pointermove", (event) => {
  if (moveLayoutEditorDrag(event)) {
    return;
  }

  if (appState.beggingMiniGameState != null) {
    syncCityBeggingMiniGamePointer(event.clientX);
    return;
  }

  if (
    campaignMapDragState == null ||
    campaignMapDragState.pointerId !== event.pointerId
  ) {
    return;
  }

  const deltaX = event.clientX - campaignMapDragState.startClientX;
  const deltaY = event.clientY - campaignMapDragState.startClientY;
  if (Math.abs(deltaX) + Math.abs(deltaY) > 3) {
    campaignMapDragState.didMove = true;
  }

  setCampaignMapDebugState({
    ...campaignMapDebugState,
    offsetX: campaignMapDragState.startOffsetX + deltaX,
    offsetY: campaignMapDragState.startOffsetY + deltaY,
  });
});

appElement.addEventListener("pointerup", endCampaignMapDrag);
appElement.addEventListener("pointercancel", endCampaignMapDrag);

function clearHouseTileDropMarkers(): void {
  appRoot
    .querySelectorAll<HTMLElement>(
      ".is-house-drop-before, .is-house-drop-after, .is-house-drag-origin"
    )
    .forEach((element) => {
      element.classList.remove(
        "is-house-drop-before",
        "is-house-drop-after",
        "is-house-drag-origin"
      );
    });
}

function endHouseTileDrag(): void {
  if (houseTileDragState == null) {
    return;
  }
  houseTileDragState.ghostTile.remove();
  clearHouseTileDropMarkers();
  houseTileDragState = null;
}

function updateHouseTileDropMarker(clientX: number, clientY: number): void {
  if (houseTileDragState == null) {
    return;
  }
  clearHouseTileDropMarkers();
  houseTileDragState.sourceTile.classList.add("is-house-drag-origin");
  const rootRect = houseTileDragState.root.getBoundingClientRect();
  const outsideRecognitionRange =
    clientX < rootRect.left - 32 ||
    clientX > rootRect.right + 32 ||
    clientY < rootRect.top - 36 ||
    clientY > rootRect.bottom + 36;
  if (outsideRecognitionRange) {
    houseTileDragState.currentBeforeId = houseTileDragState.restingBeforeId;
    return;
  }
  const tiles = [...houseTileDragState.root.querySelectorAll<HTMLElement>("[data-house-drop-before]")].filter(
    (tile) =>
      tile !== houseTileDragState?.sourceTile &&
      tile.dataset.houseDropBefore !== "end"
  );
  let currentBeforeId: string | null = null;
  let previousTile: HTMLElement | null = null;
  let nextTile: HTMLElement | null = null;
  for (const tile of tiles) {
    const rect = tile.getBoundingClientRect();
    const midpoint = rect.left + rect.width / 2;
    if (clientX < midpoint) {
      currentBeforeId = tile.dataset.houseDropBefore ?? null;
      nextTile = tile;
      break;
    }
    previousTile = tile;
  }
  if (currentBeforeId === houseTileDragState.restingBeforeId) {
    houseTileDragState.currentBeforeId = currentBeforeId;
    return;
  }
  previousTile?.classList.add("is-house-drop-after");
  nextTile?.classList.add("is-house-drop-before");
  houseTileDragState.currentBeforeId = currentBeforeId;
}

appElement.addEventListener("pointermove", (event) => {
  if (houseTileDragState == null || houseTileDragState.pointerId !== event.pointerId) {
    return;
  }
  const deltaX = event.clientX - houseTileDragState.startClientX;
  const deltaY = event.clientY - houseTileDragState.startClientY;
  if (!houseTileDragState.didMove && Math.abs(deltaX) + Math.abs(deltaY) < 6) {
    return;
  }
  houseTileDragState.didMove = true;
  houseTileDragState.ghostTile.style.left = `${event.clientX - houseTileDragState.offsetX}px`;
  houseTileDragState.ghostTile.style.top = `${event.clientY - houseTileDragState.offsetY}px`;
  updateHouseTileDropMarker(event.clientX, event.clientY);
});

appElement.addEventListener("pointerup", (event) => {
  if (houseTileDragState == null || houseTileDragState.pointerId !== event.pointerId) {
    return;
  }
  const dragState = houseTileDragState;
  const didMove = dragState.didMove;
  const beforeId = dragState.currentBeforeId;
  endHouseTileDrag();
  if (!didMove) {
    return;
  }
  if (beforeId === dragState.restingBeforeId) {
    return;
  }
  suppressHouseClickUntilMs = window.performance.now() + 250;
  dispatchHouseRuntimeRequest(houseRuntime, {
    type: "action",
    actionId: `${dragState.root.dataset.houseDropActionPrefix}${dragState.payload}:${beforeId ?? "end"}`,
  });
  renderApp();
});

appElement.addEventListener("pointercancel", () => {
  endHouseTileDrag();
});

appElement.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) {
    return;
  }
  const targetElement = event.target;
  if (!(targetElement instanceof HTMLElement)) {
    return;
  }
  const tile = targetElement.closest<HTMLElement>("[data-house-sortable-tile='true'][data-house-drag-payload]");
  const root = targetElement.closest<HTMLElement>("[data-house-drop-action-prefix]");
  const payload = tile?.dataset.houseDragPayload;
  const actionPrefix = root?.dataset.houseDropActionPrefix;
  if (tile == null || root == null || payload == null || actionPrefix == null) {
    return;
  }
  const rect = tile.getBoundingClientRect();
  const sortableTiles = [...root.querySelectorAll<HTMLElement>("[data-house-drop-before]")].filter(
    (candidateTile) => candidateTile.dataset.houseDropBefore !== "end"
  );
  const sourceIndex = sortableTiles.indexOf(tile);
  const restingBeforeId =
    sourceIndex >= 0 && sourceIndex < sortableTiles.length - 1
      ? sortableTiles[sourceIndex + 1]?.dataset.houseDropBefore ?? null
      : null;
  const ghostTile = tile.cloneNode(true) as HTMLElement;
  ghostTile.removeAttribute("data-house-action");
  ghostTile.style.position = "fixed";
  ghostTile.style.left = `${rect.left}px`;
  ghostTile.style.top = `${rect.top}px`;
  ghostTile.style.width = `${rect.width}px`;
  ghostTile.style.height = `${rect.height}px`;
  ghostTile.style.pointerEvents = "none";
  ghostTile.style.zIndex = "9999";
  ghostTile.style.opacity = "0.96";
  ghostTile.style.transform = "translateY(-10px) scale(1.03)";
  ghostTile.style.boxShadow = "0 16px 28px rgb(0 0 0 / 28%)";
  ghostTile.classList.add("is-house-drag-ghost");
  document.body.appendChild(ghostTile);
  houseTileDragState = {
    pointerId: event.pointerId,
    payload,
    root,
    sourceTile: tile,
    ghostTile,
    startClientX: event.clientX,
    startClientY: event.clientY,
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
    didMove: false,
    currentBeforeId: restingBeforeId,
    restingBeforeId,
  };
});

appElement.addEventListener("dragstart", (event) => {
  const targetElement = event.target;
  if (!(targetElement instanceof HTMLElement)) {
    return;
  }
  if (targetElement.closest("[data-house-sortable-tile='true']") != null) {
    event.preventDefault();
    return;
  }
  const dragElement = targetElement.closest<HTMLElement>("[data-house-drag-payload]");
  const payload = dragElement?.dataset.houseDragPayload;
  if (payload == null) {
    return;
  }
  houseDragPayload = payload;
  event.dataTransfer?.setData("text/plain", payload);
  if (event.dataTransfer != null) {
    event.dataTransfer.effectAllowed = "move";
  }
});

appElement.addEventListener("dragover", (event) => {
  const targetElement = event.target;
  if (!(targetElement instanceof HTMLElement) || houseDragPayload == null) {
    return;
  }
  const dropElement = targetElement.closest<HTMLElement>("[data-house-drop-before]");
  if (dropElement == null) {
    return;
  }
  event.preventDefault();
  if (event.dataTransfer != null) {
    event.dataTransfer.dropEffect = "move";
  }
});

appElement.addEventListener("drop", (event) => {
  const targetElement = event.target;
  if (!(targetElement instanceof HTMLElement)) {
    return;
  }
  const dropElement = targetElement.closest<HTMLElement>("[data-house-drop-before]");
  const actionRoot = targetElement.closest<HTMLElement>("[data-house-drop-action-prefix]");
  const payload = houseDragPayload ?? event.dataTransfer?.getData("text/plain") ?? null;
  const before = dropElement?.dataset.houseDropBefore;
  const actionPrefix = actionRoot?.dataset.houseDropActionPrefix;
  houseDragPayload = null;
  if (payload == null || before == null || actionPrefix == null) {
    return;
  }
  event.preventDefault();
  dispatchHouseRuntimeRequest(houseRuntime, {
    type: "action",
    actionId: `${actionPrefix}${payload}:${before}`,
  });
});

appElement.addEventListener("dragend", () => {
  houseDragPayload = null;
});

window.addEventListener("message", (event) => {
  handleBattleDemoResultMessage(event.data);
});

appElement.addEventListener("click", (event) => {
  if (shouldSuppressNextClickAfterMapDrag) {
    shouldSuppressNextClickAfterMapDrag = false;
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  const targetElement = event.target;
  if (!(targetElement instanceof HTMLElement)) {
    return;
  }

  if (handleLayoutEditorClick(targetElement)) {
    return;
  }

  const confirmBeggingResultButton = targetElement.closest<HTMLElement>(
    "[data-action='confirm-begging-game-result']"
  );
  if (confirmBeggingResultButton != null) {
    confirmBeggingMiniGameResult();
    return;
  }

  if (appState.beggingMiniGameState != null) {
    if (targetElement.closest(".c-begging-game") != null) {
      return;
    }
  }

  const modalAction = targetElement.closest<HTMLElement>("[data-modal-action]");
  if (modalAction != null && appState.modalState != null) {
    const actionType = modalAction.dataset.modalAction;
    if (actionType === "cancel") {
      appState = {
        ...appState,
        modalState: null,
      };
      renderApp();
      return;
    }

    if (actionType === "confirm") {
      handleModalConfirm();
      return;
    }
  }

  const locationDialogueAction = targetElement.closest<HTMLElement>(
    "[data-action='close-location-dialogue']"
  );
  if (locationDialogueAction != null) {
    appState = {
      ...appState,
      locationDialogueState: null,
    };
    renderApp();
    return;
  }

  const closeOverlayButton = targetElement.closest<HTMLElement>(
    "[data-action='close-overlay'], [data-action='close-character-detail']"
  );
  if (closeOverlayButton != null) {
    appState = updateOverlayView(appState, null);
    renderApp();
    return;
  }

  const playerCardButton = targetElement.closest<HTMLElement>(
    "[data-action='open-player-detail']"
  );
  if (playerCardButton != null) {
    appState = updateOverlayView(appState, "detail");
    renderApp();
    return;
  }

  const openCardsButton = targetElement.closest<HTMLElement>(
    "[data-action='open-cards']"
  );
  if (openCardsButton != null) {
    appState = updateOverlayView(appState, "cards");
    renderApp();
    return;
  }

  const openValuablesButton = targetElement.closest<HTMLElement>(
    "[data-action='open-valuables']"
  );
  if (openValuablesButton != null) {
    appState = updateOverlayView(appState, "valuables");
    renderApp();
    return;
  }

  const cardFilterButton = targetElement.closest<HTMLElement>(
    "[data-card-filter]"
  );
  if (cardFilterButton != null) {
    const filter = cardFilterButton.dataset.cardFilter as
      | CardLibraryFilter
      | undefined;
    if (filter != null) {
      appState = setCardFilter(appState, filter, cardDefinitions);
      renderApp();
    }
    return;
  }

  const cardButton = targetElement.closest<HTMLElement>("[data-card-id]");
  if (cardButton != null) {
    const cardId = cardButton.dataset.cardId;
    if (cardId != null) {
      appState = selectCard(appState, cardId);
      renderApp();
    }
    return;
  }

  const valuableFilterButton = targetElement.closest<HTMLElement>(
    "[data-valuable-filter]"
  );
  if (valuableFilterButton != null) {
    const filter = valuableFilterButton.dataset.valuableFilter as
      | ValuableLibraryFilter
      | undefined;
    if (filter != null) {
      appState = setValuableFilter(appState, filter);
      renderApp();
    }
    return;
  }

  const valuableSortButton = targetElement.closest<HTMLElement>(
    "[data-valuable-sort]"
  );
  if (valuableSortButton != null) {
    const sortKey = valuableSortButton.dataset.valuableSort as
      | ValuableLibrarySortKey
      | undefined;
    if (sortKey != null) {
      appState = setValuableSort(appState, sortKey);
      renderApp();
    }
    return;
  }

  const valuableButton = targetElement.closest<HTMLElement>(
    "[data-valuable-id]"
  );
  if (valuableButton != null) {
    const valuableId = targetElement
      .closest<HTMLElement>("[data-valuable-id]")
      ?.dataset.valuableId;
    if (valuableId != null) {
      appState = selectValuable(appState, valuableId as ValuableItemId);
      renderApp();
    }
    return;
  }

  const equipButton = targetElement.closest<HTMLElement>(
    "[data-action='equip-valuable'][data-valuable-id]"
  );
  if (equipButton != null) {
    const valuableId = equipButton.dataset.valuableId;
    if (valuableId != null) {
      appState = equipValuable(appState, valuableId as ValuableItemId);
      renderApp();
    }
    return;
  }

  const openLayoutEditorButton = targetElement.closest<HTMLElement>(
    "[data-action='open-layout-editor']"
  );
  if (openLayoutEditorButton != null) {
    appState = toggleLayoutEditor(appState, true);
    renderApp();
    return;
  }

  const closeCityDirectoryButton = targetElement.closest<HTMLElement>(
    "[data-action='close-city-directory']"
  );
  if (closeCityDirectoryButton != null) {
    appState = closeCityDirectory(appState);
    renderApp();
    return;
  }

  const closeCityMenuButton = targetElement.closest<HTMLElement>(
    "[data-action='close-city-menu']"
  );
  if (closeCityMenuButton != null) {
    appState = closeCityMenu(appState);
    renderApp();
    return;
  }

  const startBeggingMiniGameButton = targetElement.closest<HTMLElement>(
    "[data-action='start-begging-minigame']"
  );
  if (startBeggingMiniGameButton != null) {
    openBeggingMiniGame();
    return;
  }

  const cityMenuOpenButton = targetElement.closest<HTMLElement>(
    "[data-city-menu-open]"
  );
  if (cityMenuOpenButton != null) {
    const panelId = cityMenuOpenButton.dataset.cityMenuOpen;
    if (
      panelId === "culture" ||
      panelId === "intel" ||
      panelId === "locations" ||
      panelId === "management" ||
      panelId === "begging"
    ) {
      openCityMenuPanel(panelId);
    }
    return;
  }

  const closeLayoutEditorButton = targetElement.closest<HTMLElement>(
    "[data-action='close-layout-editor']"
  );
  if (closeLayoutEditorButton != null) {
    appState = toggleLayoutEditor(appState, false);
    renderApp();
    return;
  }

  const layoutElementSelectButton = targetElement.closest<HTMLElement>(
    "[data-layout-element-select]"
  );
  if (layoutElementSelectButton != null) {
    const value = layoutElementSelectButton.dataset.layoutElementSelect;
    const [componentId, elementId] = value?.split(":") ?? [];
    if (componentId != null && elementId != null) {
      appState = selectLayoutEditorElement(appState, componentId, elementId);
      renderApp();
    }
    return;
  }

  const layoutComponentSelectButton = targetElement.closest<HTMLElement>(
    "[data-layout-component-select]"
  );
  if (layoutComponentSelectButton != null) {
    const componentId = layoutComponentSelectButton.dataset.layoutComponentSelect;
    if (componentId != null) {
      appState = selectLayoutEditorComponent(appState, componentId);
      renderApp();
    }
    return;
  }

  const copyLayoutParamsButton = targetElement.closest<HTMLElement>(
    "[data-action='copy-layout-params']"
  );
  if (copyLayoutParamsButton != null) {
    void copyCurrentLayoutParams();
    return;
  }

  const leaveCityButton = targetElement.closest<HTMLElement>(
    "[data-action='leave-city']"
  );
  if (leaveCityButton != null) {
    houseRuntime.clearAllHouseIntervals();
    stopCityBeggingMiniGameLoop();
    appState = {
      ...appState,
      beggingMiniGameState: null,
      cityMenuState: null,
      cityDirectoryState: null,
      locationDialogueState: null,
      gameState: {
        ...appState.gameState,
        world: {
          ...appState.gameState.world,
          currentHouseId: null,
        },
        ui: {
          ...appState.gameState.ui,
          currentView: "map",
          overlayView: null,
          houseSession: null,
        },
      },
    };
    renderApp();
    return;
  }

  const enterCity3dButton = targetElement.closest<HTMLElement>(
    "[data-action='enter-city-3d']"
  );
  if (enterCity3dButton != null) {
    const mapping =
      getZhuYuanzhangCitySceneMappingByCityId()[
        appState.gameState.world.currentCityId
      ];
    if (mapping == null) {
      return;
    }

    houseRuntime.clearAllHouseIntervals();
    appState = {
      ...appState,
      cityMenuState: null,
      cityDirectoryState: null,
      locationDialogueState: null,
      gameState: {
        ...appState.gameState,
        world: {
          ...appState.gameState.world,
          currentHouseId: null,
        },
        ui: {
          ...appState.gameState.ui,
          currentView: "city-3d",
          overlayView: null,
          houseSession: null,
        },
      },
    };
    renderApp();
    return;
  }

  const leaveCity3dButton = targetElement.closest<HTMLElement>(
    "[data-action='leave-city-3d']"
  );
  if (leaveCity3dButton != null) {
    appState = {
      ...appState,
      cityMenuState: null,
      gameState: {
        ...appState.gameState,
        world: {
          ...appState.gameState.world,
          currentHouseId: null,
        },
        ui: {
          ...appState.gameState.ui,
          currentView: "city",
          overlayView: null,
          houseSession: null,
        },
      },
    };
    renderApp();
    return;
  }

  const city3dHouseButton = targetElement.closest<HTMLElement>(
    "[data-city-3d-house-id]"
  );
  if (city3dHouseButton != null) {
    const sceneObjectId = city3dHouseButton.dataset.city3dSceneObjectId;
    if (sceneObjectId != null) {
      enterMappedCity3dHouseBySceneObjectId(sceneObjectId);
    }
    return;
  }

  const cityEntryButton = targetElement.closest<HTMLElement>(
    "[data-city-entry-id]"
  );
  if (cityEntryButton != null) {
    const cityEntryId = cityEntryButton.dataset.cityEntryId;
    const cityEntry = cityEntries.find(
      (entryDefinition) =>
        entryDefinition.id === cityEntryId &&
        entryDefinition.cityId === appState.gameState.world.currentCityId
    );
    if (cityEntry?.directoryType === "leader-residence") {
      const targetHouse = houseDefinitions.find(
        (houseDefinition) => houseDefinition.id === cityEntry.targetHouseId
      );
      if (targetHouse == null || !canOpenHouseFromCity(targetHouse)) {
        return;
      }

      appState = openCityDirectory(appState, {
        type: cityEntry.directoryType,
        title: cityEntry.name,
        targetHouseId: cityEntry.targetHouseId,
        options: selectLeaderResidenceOptions(
          appState.gameState,
          appState.characterDefinitions,
          cityEntry,
          {
            historicalCharacters,
            historicalCharacterIdByCharacterId,
          }
        ),
      });
      renderApp();
    }
    return;
  }

  const cityDirectoryCharacterButton = targetElement.closest<HTMLElement>(
    "[data-city-directory-character-id]"
  );
  if (cityDirectoryCharacterButton != null && appState.cityDirectoryState != null) {
    const selectedCharacterId =
      cityDirectoryCharacterButton.dataset.cityDirectoryCharacterId;
      if (selectedCharacterId != null) {
        const targetHouseId = appState.cityDirectoryState.targetHouseId;
        const targetHouse = houseDefinitions.find(
          (houseDefinition) => houseDefinition.id === targetHouseId
        );
        if (targetHouse == null || !canOpenHouseFromCity(targetHouse)) {
          return;
        }

        appState = {
          ...closeCityDirectory(appState),
          gameState: {
          ...appState.gameState,
          runtime: {
            ...appState.gameState.runtime,
            variables: {
              ...appState.gameState.runtime.variables,
              [LEADER_RESIDENCE_VARIABLE_KEYS.pendingCharacterId]:
                selectedCharacterId,
            },
          },
        },
      };
      enterHouseThroughRuntime(houseRuntime, targetHouseId);
    }
    return;
  }

  const activityActionButton = targetElement.closest<HTMLElement>(
    "[data-activity-action]"
  );
  if (activityActionButton != null) {
    const activityAction = activityActionButton.dataset.activityAction;
    if (activityAction === "stop-qte") {
      stopCurrentActivityQte();
    } else if (activityAction === "close-result") {
      closeCurrentActivityResult();
    }
    return;
  }

  const sceneAdvanceElement = targetElement.closest<HTMLElement>(
    "[data-scene-action='advance']"
  );
  if (sceneAdvanceElement != null && appState.gameState.ui.currentView === "scene") {
    if (isActivityQteBlockingScene()) {
      return;
    }
    advanceCurrentStoryScene();
    return;
  }

  const sceneChoiceButton = targetElement.closest<HTMLElement>(
    "[data-scene-choice-id]"
  );
  if (sceneChoiceButton != null && appState.gameState.ui.currentView === "scene") {
    if (isActivityQteBlockingScene()) {
      return;
    }
    const choiceId = sceneChoiceButton.dataset.sceneChoiceId;
    if (choiceId != null) {
      chooseCurrentStoryOption(choiceId);
    }
    return;
  }

  const storyBattleActionButton = targetElement.closest<HTMLElement>(
    "[data-story-battle-action]"
  );
  if (
    storyBattleActionButton != null &&
    appState.gameState.ui.currentView === "battle"
  ) {
    const actionId = storyBattleActionButton.dataset.storyBattleAction;
    if (actionId != null) {
      dispatchCurrentStoryBattleAction(actionId);
    }
    return;
  }

  const houseActionButton = targetElement.closest<HTMLElement>(
    "[data-house-action]"
  );
  if (houseActionButton != null) {
    if (window.performance.now() < suppressHouseClickUntilMs) {
      event.preventDefault();
      event.stopPropagation();
      suppressHouseClickUntilMs = 0;
      return;
    }
    const actionId = houseActionButton.dataset.houseAction;
    if (actionId != null) {
      if (shouldSuppressPointerDispatchedHouseClick(actionId)) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      dispatchHouseRuntimeRequest(houseRuntime, {
        type: "action",
        actionId,
      });
    }
    return;
  }

  const leaveHouseButton = targetElement.closest<HTMLElement>(
    "[data-action='leave-house']"
  );
  if (leaveHouseButton != null) {
    leaveHouseThroughRuntime(houseRuntime);
    return;
  }

  const houseButton = targetElement.closest<HTMLElement>("[data-house-id]");
  if (houseButton != null) {
    const houseId = houseButton.dataset.houseId;
    if (houseId != null) {
      const houseDefinition = houseDefinitions.find(
        (candidateHouse) => candidateHouse.id === houseId
      );
      if (houseDefinition == null) {
        return;
      }

      if (!canOpenHouseFromCity(houseDefinition)) {
        return;
      }

      enterHouseThroughRuntime(houseRuntime, houseId);
    }
    return;
  }

  const cancelCampaignTravelButton = targetElement.closest<HTMLElement>(
    "[data-action='cancel-campaign-travel']"
  );
  if (cancelCampaignTravelButton != null) {
    cancelCampaignTravel();
    return;
  }

  const mapDebugActionButton = targetElement.closest<HTMLElement>(
    "[data-map-debug-action]"
  );
  if (mapDebugActionButton != null) {
    handleCampaignMapDebugAction(mapDebugActionButton.dataset.mapDebugAction);
    return;
  }

  if (appState.autoAdvanceState != null) {
    return;
  }

  const mapCell = targetElement.closest<HTMLElement>("[data-map-x][data-map-y]");
  if (mapCell != null && appState.gameState.ui.currentView === "map") {
    const xValue = Number(mapCell.dataset.mapX);
    const yValue = Number(mapCell.dataset.mapY);
    const cityId = mapCell.dataset.cityId || null;
    const mapNodeName = mapCell.dataset.mapNodeName || null;
    const cityName =
      mapNodeName ?? (cityId == null ? null : cityNameById[cityId] ?? null);
    startCampaignTravel(
      { x: xValue, y: yValue },
      cityId,
      cityName
    );
    return;
  }

  const campaignMap = targetElement.closest<HTMLElement>("[data-campaign-map-viewport]");
  if (campaignMap != null && appState.gameState.ui.currentView === "map") {
    const clickTarget = resolveCampaignTerrainUvFromClientPosition(
      campaignMap,
      event.clientX,
      event.clientY
    );
    const coordinateSpace = getCurrentMapDefinition()?.coordinateSpace;
    if (clickTarget == null || coordinateSpace == null) {
      return;
    }

    startCampaignTravel(
      {
        x: clickTarget.u * coordinateSpace.width,
        y: (1 - clickTarget.v) * coordinateSpace.height,
      },
      null,
      null
    );
  }
});

function handleModalConfirm() {
  if (appState.modalState == null) {
    return;
  }

  if (appState.modalState.type === "travel-confirm") {
    const nextCoordinate = travelToCoordinate(
      appState.playerCoordinate,
      appState.modalState.targetCoordinate
    );
    const reachedCityDefinition =
      appState.modalState.cityId == null
        ? null
        : cityDefinitionById[appState.modalState.cityId] ?? null;
    const pendingEnterCityState =
      reachedCityDefinition != null
        ? {
            type: "enter-city-confirm" as const,
            cityId: reachedCityDefinition.id,
            cityName: reachedCityDefinition.name,
          }
        : null;

    const previousCoordinate = appState.playerCoordinate;
    appState = {
      ...appState,
      campaignTravelState: {
        targetCoordinate: appState.modalState.targetCoordinate,
        cityId: appState.modalState.cityId,
        cityName: appState.modalState.cityName,
      },
      modalState: null,
      locationDialogueState: null,
    };
    renderApp();
    void animateCampaignMove(previousCoordinate, nextCoordinate).then(() => {
      const shouldEnterCity =
        appState.campaignTravelState != null &&
        appState.campaignTravelState.targetCoordinate.x === nextCoordinate.x &&
        appState.campaignTravelState.targetCoordinate.y === nextCoordinate.y;
      const previousGameState = appState.gameState;
      appState = {
        ...appState,
        campaignTravelState: null,
        modalState: shouldEnterCity ? pendingEnterCityState : null,
        locationDialogueState: null,
        gameState: runTimeRuntime({
          state: appState.gameState,
          request: createAdvanceTimeSegmentsRequest(1),
        }).state,
      };
      if (!syncCouncilPriorityAfterGameStateChange(previousGameState)) {
        renderApp();
      }
    });
    return;
  }

  houseRuntime.clearAllHouseIntervals();
  const enteredCityState = runNavigationRuntime({
    state: appState.gameState,
    request: createEnterCityRequest(appState.modalState.cityId),
  }).state;
  const storyResult = triggerStoryEventsForTiming(
    "city-enter",
    enteredCityState,
    appState.characterDefinitions
  );
  appState = {
    ...appState,
    gameState: storyResult.state,
    characterDefinitions: storyResult.characterDefinitions,
    modalState: null,
    locationDialogueState: null,
  };
  renderApp();
}

function getFacingDegrees(from: GridCoordinate, to: GridCoordinate): number {
  const deltaX = to.x - from.x;
  const deltaY = to.y - from.y;
  if (deltaX === 0 && deltaY === 0) {
    return appState.campaignActorState.facingDegrees;
  }

  return Math.atan2(deltaY, deltaX) * 180 / Math.PI;
}

function stopCampaignMoveAnimation(): void {
  if (campaignMoveAnimationState?.frameId != null) {
    window.cancelAnimationFrame(campaignMoveAnimationState.frameId);
  }
  campaignMoveAnimationState = null;
}

function cancelCampaignTravel(): void {
  if (campaignMoveAnimationState == null && appState.campaignTravelState == null) {
    return;
  }

  campaignTravelRequestId += 1;
  stopCampaignMoveAnimation();
  appState = {
    ...appState,
    campaignTravelState: null,
    modalState: null,
    locationDialogueState: null,
    campaignActorState: {
      ...appState.campaignActorState,
      isMoving: false,
    },
  };
  renderApp();
}

function startCampaignTravel(
  targetCoordinate: GridCoordinate,
  cityId: string | null,
  cityName: string | null
): void {
  const nextCoordinate = travelToCoordinate(appState.playerCoordinate, targetCoordinate);
  const reachedCityDefinition =
    cityId == null ? null : cityDefinitionById[cityId] ?? null;
  const pendingEnterCityState =
    reachedCityDefinition != null
      ? {
          type: "enter-city-confirm" as const,
          cityId: reachedCityDefinition.id,
          cityName: reachedCityDefinition.name,
        }
      : null;
  const previousCoordinate = appState.playerCoordinate;
  const travelRequestId = campaignTravelRequestId + 1;
  campaignTravelRequestId = travelRequestId;
  stopCampaignMoveAnimation();

  appState = {
    ...appState,
    campaignTravelState: {
      targetCoordinate: nextCoordinate,
      cityId,
      cityName,
    },
    modalState: null,
    locationDialogueState: null,
  };
  renderApp();

  void animateCampaignMove(previousCoordinate, nextCoordinate).then(() => {
    if (campaignTravelRequestId !== travelRequestId) {
      return;
    }

    const activeTravelState = appState.campaignTravelState;
    const shouldEnterCity =
      activeTravelState != null &&
      activeTravelState.targetCoordinate.x === nextCoordinate.x &&
      activeTravelState.targetCoordinate.y === nextCoordinate.y;
    const previousGameState = appState.gameState;
    appState = {
      ...appState,
      campaignTravelState: null,
      modalState: shouldEnterCity ? pendingEnterCityState : null,
      locationDialogueState: null,
      gameState: runTimeRuntime({
        state: appState.gameState,
        request: createAdvanceTimeSegmentsRequest(1),
      }).state,
    };
    if (!syncCouncilPriorityAfterGameStateChange(previousGameState)) {
      renderApp();
    }
  });
}

function animateCampaignMove(
  from: GridCoordinate,
  to: GridCoordinate
): Promise<void> {
  stopCampaignMoveAnimation();

  const deltaX = to.x - from.x;
  const deltaY = to.y - from.y;
  const distance = Math.hypot(deltaX, deltaY);
  const startFacingDegrees = appState.campaignActorState.facingDegrees;
  const facingDegrees = getFacingDegrees(from, to);
  if (distance < 0.001) {
    syncCampaignActorRuntimeState(to, facingDegrees, false);
    renderApp();
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const durationMs = Math.max(
      CAMPAIGN_TRAVEL_MIN_DURATION_MS,
      Math.min(CAMPAIGN_TRAVEL_MAX_DURATION_MS, distance * CAMPAIGN_TRAVEL_MS_PER_MAP_UNIT)
    );
    const facingDelta = getShortestAngleDelta(startFacingDegrees, facingDegrees);
    const turnDurationMs =
      Math.abs(facingDelta) < 0.5
        ? 0
        : Math.max(180, Math.abs(facingDelta) / CAMPAIGN_TURN_DEGREES_PER_SECOND * 1000);
    const animationState: CampaignMoveAnimationState = {
      frameId: null,
      startedAtMs: performance.now(),
      from,
      to,
      durationMs,
      resolve,
    };
    campaignMoveAnimationState = animationState;

    const tick = (timestamp: number) => {
      if (campaignMoveAnimationState !== animationState) {
        resolve();
        return;
      }

      const elapsedMs = timestamp - animationState.startedAtMs;
      const rawProgress = clamp(elapsedMs / animationState.durationMs, 0, 1);
      const nextCoordinate = {
        x: animationState.from.x + (animationState.to.x - animationState.from.x) * rawProgress,
        y: animationState.from.y + (animationState.to.y - animationState.from.y) * rawProgress,
      };
      const turnProgress =
        turnDurationMs <= 0 ? 1 : clamp(elapsedMs / turnDurationMs, 0, 1);
      const currentFacingDegrees = normalizeDegrees(
        startFacingDegrees + facingDelta * turnProgress
      );
      syncCampaignActorRuntimeState(nextCoordinate, currentFacingDegrees, rawProgress < 1);
      syncCampaignActorView();

      if (rawProgress >= 1) {
        campaignMoveAnimationState = null;
        resolve();
        return;
      }

      animationState.frameId = window.requestAnimationFrame(tick);
    };

    animationState.frameId = window.requestAnimationFrame(tick);
  });
}

function syncCampaignActorRuntimeState(
  coordinate: GridCoordinate,
  facingDegrees: number,
  isMoving: boolean
): void {
  appState.playerCoordinate = coordinate;
  appState.campaignActorState.facingDegrees = facingDegrees;
  appState.campaignActorState.isMoving = isMoving;
}

function syncCampaignActorView(): void {
  const playerElement = appRoot.querySelector<HTMLElement>("[data-campaign-player='true']");
  if (playerElement == null) {
    return;
  }

  const coordinateSpace = getCurrentMapDefinition()?.coordinateSpace;
  if (coordinateSpace == null) {
    return;
  }

  const playerHeightX = appState.playerCoordinate.x / coordinateSpace.width;
  const playerHeightY = 1 - appState.playerCoordinate.y / coordinateSpace.height;
  playerElement.dataset.mapHeightU = playerHeightX.toFixed(5);
  playerElement.dataset.mapHeightV = playerHeightY.toFixed(5);
  playerElement.dataset.campaignPlayerFacingDeg =
    appState.campaignActorState.facingDegrees.toFixed(2);
  playerElement.dataset.campaignPlayerMoving =
    appState.campaignActorState.isMoving ? "true" : "false";
  playerElement.setAttribute("data-terrain-projection-ready", "true");
  playerElement.style.setProperty(
    "--campaign-player-facing-deg",
    `${appState.campaignActorState.facingDegrees.toFixed(2)}deg`
  );
  playerElement.title =
    `Player (${appState.playerCoordinate.x.toFixed(1)}, ${appState.playerCoordinate.y.toFixed(1)})`;
  requestCampaignTerrainRender("dynamic");
}

function getShortestAngleDelta(fromDegrees: number, toDegrees: number): number {
  return ((toDegrees - fromDegrees + 540) % 360) - 180;
}

function normalizeDegrees(degrees: number): number {
  const normalized = degrees % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function captureCampaignTerrainCanvases(
  root: ParentNode
): HTMLCanvasElement[] | null {
  const canvases = Array.from(
    root.querySelectorAll<HTMLCanvasElement>(
      "[data-campaign-map-terrain], [data-campaign-map-actor-layer]"
    )
  );
  return canvases.length === 0 ? null : canvases;
}

function restoreCampaignTerrainCanvases(
  root: ParentNode,
  preservedCanvases: HTMLCanvasElement[] | null
): void {
  if (preservedCanvases == null || preservedCanvases.length === 0) {
    return;
  }

  const replacementCanvases = Array.from(
    root.querySelectorAll<HTMLCanvasElement>(
      "[data-campaign-map-terrain], [data-campaign-map-actor-layer]"
    )
  );
  if (replacementCanvases.length !== preservedCanvases.length) {
    return;
  }

  replacementCanvases.forEach((replacementCanvas, index) => {
    const preservedCanvas = preservedCanvases[index];
    if (preservedCanvas == null) {
      return;
    }

    replacementCanvas.replaceWith(preservedCanvas);
  });
}

function renderApp() {
  appState = {
    ...appState,
    gameState: ensureCityNpcPoolsForCurrentDay(
      appState.gameState,
      cityNpcPoolDefinitions
    ),
  };
  syncPassiveStoryTriggers();
  const currentMapDefinition = getCurrentMapDefinition();
  const currentCityDefinition =
    cityDefinitionById[appState.gameState.world.currentCityId] ?? cityDefinitions[0] ?? null;
  assertExists(currentMapDefinition, "Missing active map definition for render.");
  assertExists(currentCityDefinition, "Missing active city definition for render.");
  const preservedTerrainCanvases =
    appState.gameState.ui.currentView === "map"
      ? captureCampaignTerrainCanvases(appRoot)
      : null;
  const presenterOutput = createAppPresenterOutput({
    appState,
    playerCharacterId: currentPlayerCharacterId,
    cityDefinition: currentCityDefinition,
    cityDefinitions,
    houseDefinitions,
    cityEntries,
    cityNpcPoolDefinitions,
    cityNameById,
    textEntriesById,
    citySceneMappingsByCityId: getZhuYuanzhangCitySceneMappingByCityId(),
    sceneDefinitionsById: activeStorySceneDefinitionsById,
  });

  appRoot.innerHTML = renderAppMarkup({
    appState,
    playerCharacterId: currentPlayerCharacterId,
    mapDefinition: currentMapDefinition,
    cityDefinition: currentCityDefinition,
    cityDefinitions,
    houseDefinitions,
    cityEntries,
    cardDefinitions,
    cityNpcPoolDefinitions,
    cityCoordinatesById,
    cityNameById,
    houseNameById,
    characterNameById,
    textEntriesById,
    cityPortraits,
    citySceneMappingsByCityId: getZhuYuanzhangCitySceneMappingByCityId(),
    historicalCharacters,
    historicalCityRosters,
    presenterOutput,
  });
  restoreCampaignTerrainCanvases(appRoot, preservedTerrainCanvases);
  startInitialCampaignMapDebugAnimationIfNeeded();
  syncCampaignMapDebugView();
  syncMapIntroOverlay();
  syncActivityQteLoop();
  syncCampaignTerrainWebGl(appRoot);
  syncCityBeggingMiniGameOverlay(appRoot, appState.beggingMiniGameState);
}

function syncPassiveStoryTriggers(): void {
  if (appState.gameState.scene.activeSceneId != null) {
    return;
  }

  if (appState.gameState.ui.currentView !== "house") {
    return;
  }

  const result = triggerStoryEventsForTiming(
    "indoor-screen-shown",
    appState.gameState,
    appState.characterDefinitions
  );

  if (result.state === appState.gameState) {
    return;
  }

  appState = {
    ...appState,
    gameState: result.state,
    characterDefinitions: result.characterDefinitions,
  };
}

function syncGameViewport(): void {
  const scale = Math.min(
    window.innerWidth / GAME_VIEWPORT_WIDTH,
    window.innerHeight / GAME_VIEWPORT_HEIGHT
  );

  appRoot.style.setProperty("--game-width", `${GAME_VIEWPORT_WIDTH}px`);
  appRoot.style.setProperty("--game-height", `${GAME_VIEWPORT_HEIGHT}px`);
  appRoot.style.setProperty("--game-scale", `${scale}`);
  uiOverlayElement?.style.setProperty("--game-width", `${GAME_VIEWPORT_WIDTH}px`);
  uiOverlayElement?.style.setProperty("--game-height", `${GAME_VIEWPORT_HEIGHT}px`);
  uiOverlayElement?.style.setProperty("--game-scale", `${scale}`);
}

function shouldDispatchHouseActionOnPointerDown(actionId: string): boolean {
  return actionId === "temple-work-stop" || actionId === "tavern-work-stop";
}

function shouldSuppressPointerDispatchedHouseClick(actionId: string): boolean {
  if (recentPointerDispatchedHouseAction == null) {
    return false;
  }

  const elapsedMs =
    window.performance.now() - recentPointerDispatchedHouseAction.timestamp;
  const shouldSuppress =
    recentPointerDispatchedHouseAction.actionId === actionId && elapsedMs < 500;

  if (shouldSuppress || elapsedMs >= 500) {
    recentPointerDispatchedHouseAction = null;
  }

  return shouldSuppress;
}

function handleCampaignMapDebugAction(action: string | undefined): void {
  if (action === "zoom-in") {
    zoomCampaignMapAtScreenCenter(
      campaignMapDebugState.scale + MAP_DEBUG_SCALE_STEP
    );
    return;
  }

  if (action === "zoom-out") {
    zoomCampaignMapAtScreenCenter(
      campaignMapDebugState.scale - MAP_DEBUG_SCALE_STEP
    );
    return;
  }

  if (action === "reset") {
    setCampaignMapDebugState(campaignMapDebugHomeState);
  }
}

function startInitialCampaignMapDebugAnimationIfNeeded(): void {
  if (
    hasStartedInitialCampaignMapDebugAnimation ||
    hasAppliedInitialCampaignMapDebug ||
    appState.gameState.ui.currentView !== "map"
  ) {
    return;
  }

  hasStartedInitialCampaignMapDebugAnimation = true;
  initialCampaignMapDebugAnimationStartTime = null;
  showMapIntroOverlay(
    getRuntimeText("runtime.zhu_yuanzhang.chapter_intro.huai_xi_begging")
  );

  const animate = (timestamp: number) => {
    if (initialCampaignMapDebugAnimationStartTime == null) {
      initialCampaignMapDebugAnimationStartTime = timestamp;
    }

    const elapsedMs = timestamp - initialCampaignMapDebugAnimationStartTime;
    const progress = clamp(
      elapsedMs / INITIAL_MAP_DEBUG_ANIMATION_DURATION_MS,
      0,
      1
    );

    setCampaignMapDebugState(interpolateCampaignMapDebugState(progress));

    if (progress < 1) {
      initialCampaignMapDebugAnimationFrame =
        window.requestAnimationFrame(animate);
      return;
    }

    hasAppliedInitialCampaignMapDebug = true;
    campaignMapDebugHomeState = {
      ...TARGET_CAMPAIGN_MAP_DEBUG_STATE,
    };
    hideMapIntroOverlay();
    initialCampaignMapDebugAnimationFrame = null;
  };

  initialCampaignMapDebugAnimationFrame = window.requestAnimationFrame(animate);
}

function interpolateCampaignMapDebugState(progress: number): CampaignMapDebugState {
  return {
    scale:
      INITIAL_CAMPAIGN_MAP_DEBUG_STATE.scale +
      (TARGET_CAMPAIGN_MAP_DEBUG_STATE.scale -
        INITIAL_CAMPAIGN_MAP_DEBUG_STATE.scale) *
        progress,
    offsetX:
      INITIAL_CAMPAIGN_MAP_DEBUG_STATE.offsetX +
      (TARGET_CAMPAIGN_MAP_DEBUG_STATE.offsetX -
        INITIAL_CAMPAIGN_MAP_DEBUG_STATE.offsetX) *
        progress,
    offsetY:
      INITIAL_CAMPAIGN_MAP_DEBUG_STATE.offsetY +
      (TARGET_CAMPAIGN_MAP_DEBUG_STATE.offsetY -
        INITIAL_CAMPAIGN_MAP_DEBUG_STATE.offsetY) *
        progress,
  };
}

function isInitialCampaignMapDebugAnimating(): boolean {
  return (
    hasStartedInitialCampaignMapDebugAnimation && !hasAppliedInitialCampaignMapDebug
  );
}

function showMapIntroOverlay(title: string): void {
  if (appState.gameState.ui.currentView !== "map") {
    return;
  }

  let overlayElement = appRoot.querySelector<HTMLElement>(".c-map-intro-overlay");
  if (overlayElement == null) {
    const stageElement = appRoot.querySelector<HTMLElement>(".l-stage");
    if (stageElement == null) {
      return;
    }

    overlayElement = document.createElement("div");
    overlayElement.className = "c-map-intro-overlay";
    overlayElement.setAttribute("aria-hidden", "true");
    overlayElement.innerHTML = `<div class="c-map-intro-overlay__title"></div>`;
    stageElement.append(overlayElement);
  }

  const titleElement = overlayElement.querySelector<HTMLElement>(
    ".c-map-intro-overlay__title"
  );
  if (titleElement == null) {
    return;
  }

  titleElement.textContent = title;
  titleElement.classList.remove("is-animating");
  void titleElement.offsetWidth;
  titleElement.classList.add("is-animating");
  activeMapIntroOverlay = overlayElement;
}

function hideMapIntroOverlay(): void {
  activeMapIntroOverlay?.remove();
  activeMapIntroOverlay = null;
}

function syncMapIntroOverlay(): void {
  if (appState.gameState.ui.currentView !== "map") {
    hideMapIntroOverlay();
    return;
  }

  if (activeMapIntroOverlay != null && !appRoot.contains(activeMapIntroOverlay)) {
    activeMapIntroOverlay = null;
    if (isInitialCampaignMapDebugAnimating()) {
      showMapIntroOverlay(
        getRuntimeText("runtime.zhu_yuanzhang.chapter_intro.huai_xi_begging")
      );
    }
  }
}

function zoomCampaignMapAtScreenCenter(nextScale: number): void {
  const clampedScale = clamp(
    nextScale,
    MAP_DEBUG_MIN_SCALE,
    MAP_DEBUG_MAX_SCALE
  );
  const currentScale = Math.max(campaignMapDebugState.scale, 0.0001);
  const scaleRatio = clampedScale / currentScale;

  setCampaignMapDebugState({
    scale: clampedScale,
    offsetX: campaignMapDebugState.offsetX * scaleRatio,
    offsetY: campaignMapDebugState.offsetY * scaleRatio,
  });
}

function setCampaignMapDebugState(nextState: CampaignMapDebugState): void {
  campaignMapDebugState = {
    scale: clamp(nextState.scale, MAP_DEBUG_MIN_SCALE, MAP_DEBUG_MAX_SCALE),
    offsetX: Math.round(nextState.offsetX),
    offsetY: Math.round(nextState.offsetY),
  };
  syncCampaignMapDebugView();
}

function syncCampaignMapDebugView(): void {
  const transformElement = appRoot.querySelector<HTMLElement>(
    "[data-campaign-map-transform]"
  );
  if (transformElement == null) {
    return;
  }

  transformElement.style.setProperty(
    "--map-debug-scale",
    "1"
  );
  transformElement.style.setProperty(
    "--map-marker-inverse-scale",
    "1"
  );
  transformElement.style.setProperty(
    "--map-debug-offset-x",
    "0px"
  );
  transformElement.style.setProperty(
    "--map-debug-offset-y",
    "0px"
  );
  setCampaignTerrainCamera({
    scale: campaignMapDebugState.scale,
    offsetX: campaignMapDebugState.offsetX,
    offsetY: campaignMapDebugState.offsetY,
  });

  const scaleElement = appRoot.querySelector<HTMLElement>(
    "[data-campaign-map-scale]"
  );
  const offsetXElement = appRoot.querySelector<HTMLElement>(
    "[data-campaign-map-offset-x]"
  );
  const offsetYElement = appRoot.querySelector<HTMLElement>(
    "[data-campaign-map-offset-y]"
  );
  if (scaleElement != null) {
    scaleElement.textContent = `${campaignMapDebugState.scale.toFixed(2)}x`;
  }
  if (offsetXElement != null) {
    offsetXElement.textContent = `${campaignMapDebugState.offsetX}px`;
  }
  if (offsetYElement != null) {
    offsetYElement.textContent = `${campaignMapDebugState.offsetY}px`;
  }
}

function endCampaignMapDrag(event: PointerEvent): void {
  if (
    layoutEditorDragState != null &&
    layoutEditorDragState.pointerId === event.pointerId
  ) {
    const handle =
      appRoot.querySelector<HTMLElement>(getLayoutEditorDragHandleSelector()) ??
      null;
    if (handle?.hasPointerCapture(event.pointerId) === true) {
      handle.releasePointerCapture(event.pointerId);
    }
    layoutEditorDragState = null;
    return;
  }

  if (
    campaignMapDragState == null ||
    campaignMapDragState.pointerId !== event.pointerId
  ) {
    return;
  }

  const campaignMap = appRoot.querySelector<HTMLElement>(
    "[data-campaign-map-viewport]"
  );
  if (campaignMap?.hasPointerCapture(event.pointerId) === true) {
    campaignMap.releasePointerCapture(event.pointerId);
  }
  campaignMap?.classList.remove("is-dragging");
  shouldSuppressNextClickAfterMapDrag = campaignMapDragState.didMove;
  campaignMapDragState = null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
