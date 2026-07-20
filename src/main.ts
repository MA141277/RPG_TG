import "./styles/app.css";
import { ensureCityNpcPoolsForCurrentDay } from "./application/city-npcs/refresh-city-npc-pools";
import { createDefaultUiLayoutAppState } from "./application/layout-editor/layout-editor-bootstrap";
import {
  closeCityMenu,
  closeCityDirectory,
  equipValuable,
  openCityMenu,
  selectCard,
  selectValuable,
  setCardFilter,
  setValuableFilter,
  setValuableSort,
  updateOverlayView,
} from "./application/app-actions";
import type { AppState } from "./application/app-shell";
import {
  getCityBeggingMiniGameStatus,
  isCityBeggingMiniGamePlaying,
} from "./application/minigames/city-begging-minigame";
import {
  createCityMenuState,
  isPlayerMonkIdentity,
  type CityMenuPanelId,
} from "./application/city-menu/city-menu";
import { createAppRenderCoordinator } from "./application/presenter/app-render-coordinator";
import { createMainRuntimeOrchestrator } from "./application/runtime/main-runtime-orchestrator";
import {
  applyCouncilPriorityFollowUp,
  createNavigationTimeFollowUpBridge,
} from "./application/runtime/navigation-time-follow-up";
import {
  applyCampaignTravelCompletion,
  applyCampaignTravelStart,
} from "./application/runtime/campaign-travel-transition";
import { createCampaignMoveAnimationCoordinator } from "./application/runtime/campaign-move-animation-coordinator";
import { createCity3dHouseEntryCoordinator } from "./application/runtime/city-3d-house-entry-coordinator";
import { createCityDirectoryLeaderResidenceCoordinator } from "./application/runtime/city-directory-leader-residence-coordinator";
import { createCouncilPriorityCityBeggingCoordinator } from "./application/runtime/council-priority-city-begging-coordinator";
import { createCityHouseTransitionCoordinator } from "./application/runtime/city-house-transition-coordinator";
import { createHouseDragDropCoordinator } from "./application/runtime/house-drag-drop-coordinator";
import {
  applyMapAutoAdvanceSnapshot,
  applyMapAutoAdvanceStart,
} from "./application/runtime/map-auto-advance-transition";
import {
  formatCouncilStatusText,
  readCalendarDateNumber,
} from "./application/time/time-progression";
import {
  getCouncilPriorityHouseModuleId,
  hasReachedCouncilDate,
  isCouncilPriorityHouseDefinition,
} from "./application/time/council-priority";
import {
  isCityEntryVisibleForStoryStage,
  isHouseVisibleForStoryStage,
} from "./application/story/story-stage-access";
import { evaluateLocationAccess } from "./application/location-access/location-access-runtime";
import {
  travelToCoordinate,
  type GridCoordinate,
} from "./application/navigation/travel-to-coordinate";
import {
  getRevealedCampaignHexKeys,
  revealCampaignMapHexesForCoordinate,
} from "./application/map/campaign-map-exploration";
import { createInitialState } from "./application/state/create-initial-state";
import {
  type ActiveGameContentContext,
} from "./application/content/active-game-content";
import {
  resolveTextEntry,
  resolveTextTemplateEntry,
} from "./application/content/text-resolution";
import { createEntryShellBootstrapState } from "./application/startup/entry-shell-bootstrap-state";
import {
  runStartupSessionCoordinator,
  type StartupSaveData,
  type StartupScenario,
  type StartupSessionBootstrap,
} from "./application/startup/startup-session-coordinator";
import {
  loadScenarioPackFromFiles,
  loadScenarioPackFromUrl,
} from "./application/scenario/scenario-pack-loader";
import { createShellBootLifecycleCoordinator } from "./application/startup/shell-boot-lifecycle-coordinator";
import { createStartupSessionApplyCoordinator } from "./application/startup/startup-session-apply-coordinator";
import {
  applyStartupStoryBootstrap,
  type StartupStoryBootstrap,
} from "./application/startup/startup-story-bootstrap";
import { createPrototypeStartupAppStateBuilder } from "./application/startup/prototype-startup-app-state";
import { resolveScenarioStartupTarget } from "./application/startup/scenario-startup-target";
import {
  createEnterCityRequest,
  routeNavigationRuntime,
} from "./core/runtime/navigation-runtime";
import {
  createAdvanceTimeSegmentsRequest,
  createDayStartRequest,
  routeTimeRuntime,
} from "./core/runtime/time-runtime";
import {
  createPrototypeCharactersForStoryStage,
} from "./content/prototype-world";
import { getZhuYuanzhangCitySceneMappingByCityId } from "./content/city-scene-mappings";
import {
  createHouseRuntimeBridge,
  dispatchHouseRuntimeRequest,
  enterHouseThroughRuntime,
  leaveHouseThroughRuntime,
  type HouseRuntimeBridge,
} from "./core/runtime/house-runtime";
import {
  createExitInteractiveRequest,
  createInteractiveActionRequest,
  type InteractiveRuntimeOutput,
  runInteractiveRuntime,
} from "./core/runtime/interactive-runtime";
import {
  configureDefaultPlayableRuntimeRegistriesFromActivatedMod,
  createLaunchPlayableRequest,
  createPlayableActionRequest,
  runPlayableRuntime,
} from "./core/runtime/playable-runtime";
import {
  readBrowserSaveRecord,
  writeBrowserSaveRecord,
} from "./core/save/browser-save-record";
import { commitRuntimeRequest } from "./core/runtime/state-sync-runtime";
import { stateSyncCoreSeam } from "./core/runtime/state-sync-core-seam";
import type {
  RuntimeFollowUpContext,
  RuntimeRouter,
} from "./core/runtime/runtime-router";
import type {
  ModActivationResult,
  ModSourceDescriptor,
} from "./core/contracts/mod-runtime";
import type { ViewName as CoreSaveViewName } from "./core/contracts/core-state";
import type { ActivityDefinition } from "./domain/activity";
import type { SceneDefinition } from "./domain/action";
import type { GameState } from "./domain/game-state";
import type { CityDefinition } from "./domain/city";
import type { CharacterDefinition } from "./domain/character";
import type { CityBeggingGameCompletionResult } from "./domain/city-begging-minigame";
import type { CityEntryDefinition } from "./domain/city-entry";
import type { CityNpcPoolDefinition } from "./domain/city-npc";
import type { EventDefinition } from "./domain/event";
import type { HouseDefinition } from "./domain/house";
import type { HouseModuleTransitionResult } from "./domain/house-module";
import type { MapDefinition } from "./domain/map";
import type {
  ScenarioPackDefinition,
  ScenarioPackSummary,
} from "./domain/scenario-pack";
import type {
  CardLibraryFilter,
  ValuableLibraryFilter,
  ValuableLibrarySortKey,
} from "./domain/global-ui";
import { KEEP_HOUSE_VARIABLE_KEYS } from "./domain/keep-house";
import type { ValuableItemId } from "./domain/valuable-item";
import {
  isHaozhouShortageDuringBeggingJourney,
  ZHU_YUANZHANG_STORY_FLAG_KEYS,
  ZHU_YUANZHANG_STORY_STAGES,
  ZHU_YUANZHANG_STORY_VARIABLE_KEYS,
  type ZhuYuanzhangStoryStage,
} from "./domain/zhu-yuanzhang-story";
import { assertExists } from "./shared/assert";
import {
  renderLoadingScreen,
  selectRandomLoadingTheme,
  setLoadingScreenProgress,
  type LoadingTheme,
} from "./ui/loading-screen";
import { MainUiFlow } from "./ui/main-ui/main-ui-flow.js";
import {
  DEFAULT_CAMPAIGN_CITY_DEPTH_MESH_TRANSFORM,
  DEFAULT_CAMPAIGN_TERRAIN_STYLE,
  resolveCampaignTerrainUvFromClientPosition,
  requestCampaignTerrainRender,
  setCampaignTerrainCamera,
  syncCampaignTerrainWebGl,
  type CampaignCityDepthMeshTransform,
  type CampaignTerrainStyle,
} from "./ui/views/map/campaign-terrain-webgl";
import { syncCityBeggingMiniGameOverlay } from "./ui/views/minigames/city-begging-minigame-view";

const GAME_VIEWPORT_WIDTH = 1600;
const GAME_VIEWPORT_HEIGHT = 900;
const MAP_DEBUG_MIN_SCALE = 0.5;
const MAP_DEBUG_MAX_SCALE = Number.POSITIVE_INFINITY;
const MAP_DEBUG_SCALE_STEP_RATIO = 1.08;
const INITIAL_MAP_DEBUG_ANIMATION_DURATION_MS = 250;
const LOADING_SCREEN_SIMULATION_DURATION_MS = 350;
const CAMPAIGN_TRAVEL_SPEED_SCALE = 0.6;
const CAMPAIGN_TRAVEL_MS_PER_MAP_UNIT = 55 / CAMPAIGN_TRAVEL_SPEED_SCALE;
const CAMPAIGN_TRAVEL_MIN_DURATION_MS = 1400 / CAMPAIGN_TRAVEL_SPEED_SCALE;
const CAMPAIGN_TRAVEL_MAX_DURATION_MS = 18000 / CAMPAIGN_TRAVEL_SPEED_SCALE;
const CAMPAIGN_TURN_DEGREES_PER_SECOND = 180;
const ACTIVITY_QTE_INTERVAL_MS = 90;
const OPENING_BGM_URL = new URL("../BGM/开局.mp3", import.meta.url).href;
const IN_GAME_BGM_URL = new URL("../BGM/游戏内.mp3", import.meta.url).href;
const INITIAL_CAMPAIGN_MAP_DEBUG_STATE: CampaignMapDebugState = {
  scale: 15,
  offsetX: -1000,
  offsetY: 1750,
};
const TARGET_CAMPAIGN_MAP_DEBUG_STATE: CampaignMapDebugState = {
  scale: 15,
  offsetX: -1000,
  offsetY: 1750,
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

type BackgroundMusicMode = "opening" | "in-game";

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
const entryShellBootstrapState = await createEntryShellBootstrapState();
const {
  baseGameContentPack,
  builtinDefaultModId,
  builtinDefaultModManifest,
  builtinStartupActivation,
} = entryShellBootstrapState;
if (!builtinStartupActivation.ok) {
  throw new Error(builtinStartupActivation.failure.message);
}

function getMapDefinitionById(mapId: string): MapDefinition | null {
  return activeContentContext.mapDefinitionById[mapId] ?? null;
}

function getCurrentMapDefinition(): MapDefinition | null {
  return (
    getMapDefinitionById(appState.gameState.world.currentMapId) ??
    activeContentContext.maps[0] ??
    null
  );
}

function getCurrentCityDefinition(currentAppState: AppState): CityDefinition | null {
  return (
    activeContentContext.cityDefinitionById[
      currentAppState.gameState.world.currentCityId
    ] ??
    activeContentContext.cities[0] ??
    null
  );
}

function getActiveCitySceneMappingsByCityId() {
  return getZhuYuanzhangCitySceneMappingByCityId({
    cities: activeContentContext.cities,
    houses: activeContentContext.houses,
  });
}

let activeContentContext: ActiveGameContentContext =
  entryShellBootstrapState.createStartupContentContext(
    builtinStartupActivation
  );

function getRuntimeText(textId: string, fallback?: string): string {
  return resolveTextEntry(activeContentContext.textEntriesById, textId, fallback);
}

function getRuntimeTemplateText(
  textId: string,
  values: Record<string, string | number | boolean | null | undefined>,
  fallback?: string
): string {
  return resolveTextTemplateEntry(
    activeContentContext.textEntriesById,
    textId,
    values,
    fallback
  );
}

function bootstrapStartupStoryAppState(input: {
  appState: AppState;
  bootstrap: StartupStoryBootstrap | null;
}): AppState {
  return applyStartupStoryBootstrap({
    appState: input.appState,
    bootstrap: input.bootstrap,
    content: {
      eventDefinitionsById: activeContentContext.storyContent.eventDefinitionsById,
      sceneDefinitionsById: activeContentContext.storyContent.sceneDefinitionsById,
      activityDefinitionsById:
        activeContentContext.storyContent.activityDefinitionsById,
      textEntriesById: activeContentContext.storyContent.textEntriesById,
    },
  });
}

function setActiveContentContext(
  nextContentContext: ActiveGameContentContext
): void {
  activeContentContext = nextContentContext;
  mainUiFlow?.setCharacters(getSelectableCharactersFromContentContext(nextContentContext));
}

function getSelectableCharactersFromContentContext(
  currentContentContext: ActiveGameContentContext
): CharacterDefinition[] {
  const selectableCharacters = currentContentContext.characterManager.playableCharacters;
  if (selectableCharacters.length > 0) {
    return selectableCharacters;
  }

  const fallbackCharacter =
    currentContentContext.characterManager.getCharacterById(defaultPlayerCharacterId) ??
    currentContentContext.gameContent.characters[0] ??
    null;
  assertExists(fallbackCharacter, "Selectable character data is missing from active content.");
  return [fallbackCharacter];
}

let currentPlayerCharacterId = defaultPlayerCharacterId;

function createRuntimeCommitContext(input: {
  router: RuntimeRouter;
  followUp?: RuntimeFollowUpContext;
}) {
  return {
    router: input.router,
    ...(input.followUp == null ? {} : { followUp: input.followUp }),
    taskDefinitionsById: activeContentContext.taskDefinitionsById,
  };
}

const prototypeStartupAppStateBuilder = createPrototypeStartupAppStateBuilder({
  getActiveContentContext: () => activeContentContext,
  defaultPlayerCharacterId,
  createDefaultUiLayoutAppState,
  createPrototypeCharactersForStoryStage,
});

let appState: AppState =
  prototypeStartupAppStateBuilder.createPrototypeAppState(
    currentPlayerCharacterId
  );
let campaignMapDebugState: CampaignMapDebugState = {
  ...INITIAL_CAMPAIGN_MAP_DEBUG_STATE,
};
let campaignMapDebugHomeState: CampaignMapDebugState = {
  ...INITIAL_CAMPAIGN_MAP_DEBUG_STATE,
};
let campaignTerrainStyleState: CampaignTerrainStyle = {
  ...DEFAULT_CAMPAIGN_TERRAIN_STYLE,
};
let campaignCityDepthMeshTransformState: CampaignCityDepthMeshTransform = {
  ...DEFAULT_CAMPAIGN_CITY_DEPTH_MESH_TRANSFORM,
};
let hasAppliedInitialCampaignMapDebug = false;
let hasStartedInitialCampaignMapDebugAnimation = false;
let initialCampaignMapDebugAnimationFrame: number | null = null;
let initialCampaignMapDebugAnimationStartTime: number | null = null;
let activeMapIntroOverlay: HTMLElement | null = null;
let activeBackgroundMusicMode: BackgroundMusicMode | null = null;
let campaignMapScaleDraftValue: string | null = null;
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
let cityBeggingMiniGameFrameId: number | null = null;
let activityQteIntervalHandle: number | null = null;
let campaignTravelRequestId = 0;
let loadingScreenAnimationFrameId: number | null = null;
let loadingScreenRequestId = 0;
let activeLoadingScreenElement: HTMLElement | null = null;
let activeLoadingTheme: LoadingTheme | null = null;
const mapAutoAdvanceHandles: Record<string, number> = {};

let houseRuntime: HouseRuntimeBridge = createHouseRuntimeInstance();
const cityHouseTransitionCoordinator = createCityHouseTransitionCoordinator({
  getAppState: () => appState,
  setAppState: (nextAppState) => {
    appState = nextAppState;
  },
  renderApp,
  clearHouseIntervals: () => {
    houseRuntime.clearAllHouseIntervals();
  },
  stopCityBeggingMiniGameLoop,
  canEnterCity3d: () =>
    getActiveCitySceneMappingsByCityId()[appState.gameState.world.currentCityId] !=
    null,
});
const councilPriorityCityBeggingCoordinator =
  createCouncilPriorityCityBeggingCoordinator({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp,
    getCurrentPlayerCharacter,
    getCouncilPriorityHouseDefinition,
    getRuntimeText,
    getRuntimeTemplateText,
    hasHaozhouShortage: (currentAppState) =>
      isHaozhouShortageDuringBeggingJourney(currentAppState.gameState),
    launchCityBeggingPlayable: (launchState, now) =>
      commitRuntimeRequest({
        state: launchState,
        request: createLaunchPlayableRequest("city-begging", {
          payload: { now },
        }),
        context: {
          router: {
            route: ({ state, request }) =>
              runInteractiveRuntime({
                state,
                request,
                characterDefinitions: launchState.characterDefinitions,
              }),
          },
        },
      }).state,
    settleCityBeggingResult: (result) => {
      onBeggingGameComplete(result);
    },
    stopCityBeggingMiniGameLoop,
    startCityBeggingMiniGameLoop,
    now: () => performance.now(),
  });
const cityDirectoryLeaderResidenceCoordinator =
  createCityDirectoryLeaderResidenceCoordinator({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp,
    findCityEntry: (cityEntryId, cityId) =>
      activeContentContext.cityEntries.find(
        (entryDefinition) =>
          entryDefinition.id === cityEntryId &&
          entryDefinition.cityId === cityId
      ) ?? null,
    findHouse: (houseId) =>
      activeContentContext.houses.find(
        (houseDefinition) => houseDefinition.id === houseId
      ) ?? null,
    canOpenHouseFromCity,
    enterHouse: (houseId) => {
      enterHouseThroughRuntime(houseRuntime, houseId);
    },
    getHistoricalCharacters: () => activeContentContext.historicalCharacters,
    getHistoricalCharacterIdByCharacterId: () =>
      activeContentContext.historicalCharacterIdByCharacterId,
  });
const city3dHouseEntryCoordinator = createCity3dHouseEntryCoordinator({
  getAppState: () => appState,
  getCitySceneMapping: (cityId) => getActiveCitySceneMappingsByCityId()[cityId] ?? null,
  findHouse: (houseId) =>
    activeContentContext.houses.find(
      (houseDefinition) => houseDefinition.id === houseId
    ) ?? null,
  canOpenHouseFromCity,
  enterHouse: (houseId) => {
    enterHouseThroughRuntime(houseRuntime, houseId);
  },
  getWindowOrigin: () => window.location.origin,
});
const houseDragDropCoordinator = createHouseDragDropCoordinator({
  dispatchHouseAction: (actionId) => {
    dispatchHouseRuntimeRequest(houseRuntime, {
      type: "action",
      actionId,
    });
  },
  renderApp,
});
const campaignMoveAnimationCoordinator =
  createCampaignMoveAnimationCoordinator({
    getCurrentFacingDegrees: () => appState.campaignActorState.facingDegrees,
    syncCampaignActorRuntimeState,
    syncCampaignActorView,
    renderApp,
    requestAnimationFrame: (callback) => window.requestAnimationFrame(callback),
    cancelAnimationFrame: (frameId) => window.cancelAnimationFrame(frameId),
    now: () => performance.now(),
    clamp,
    msPerMapUnit: CAMPAIGN_TRAVEL_MS_PER_MAP_UNIT,
    minDurationMs: CAMPAIGN_TRAVEL_MIN_DURATION_MS,
    maxDurationMs: CAMPAIGN_TRAVEL_MAX_DURATION_MS,
    turnDegreesPerSecond: CAMPAIGN_TURN_DEGREES_PER_SECOND,
  });
const mainRuntimeOrchestrator = createMainRuntimeOrchestrator({
  getAppState: () => appState,
  setAppState: (nextAppState) => {
    appState = nextAppState;
  },
  setPlayerCharacterId: (playerCharacterId) => {
    currentPlayerCharacterId = playerCharacterId;
  },
  getStoryContent: () => ({
    eventDefinitionsById: activeContentContext.storyContent.eventDefinitionsById,
    eventBindingsById: activeContentContext.storyContent.eventBindingsById,
    sceneDefinitionsById: activeContentContext.storyContent.sceneDefinitionsById,
    activityDefinitionsById:
      activeContentContext.storyContent.activityDefinitionsById,
    textEntriesById: activeContentContext.storyContent.textEntriesById,
  }),
  resetMainGameRuntime,
  setActiveContentContext,
  recreateHouseRuntime: () => {
    houseRuntime = createHouseRuntimeInstance();
  },
  setGameVisibility,
  hideMainUiFlow: () => {
    mainUiFlow.hide();
  },
});
const startupSessionApplyCoordinator = createStartupSessionApplyCoordinator({
  configureDefaultPlayableRuntimeRegistriesFromActivatedMod,
  mainRuntimeOrchestrator,
  persistSaveData,
  renderApp,
});
const shellBootLifecycleCoordinator = createShellBootLifecycleCoordinator({
  beginLoadingScreen,
  isLoadingRequestActive: (requestId) => requestId === loadingScreenRequestId,
  simulateLoadingProgress,
  setActiveLoadingProgress,
  runStartupSession: (request) =>
    runStartupSessionCoordinator(request, startupSessionCoordinatorDeps),
  unwrapStartupSession,
  startupSessionApplyCoordinator,
  endLoadingScreen,
  showStartupError,
});
const navigationTimeFollowUp = createNavigationTimeFollowUpBridge({
  getCharacterDefinitions: () => appState.characterDefinitions,
  getHouseDefinitions: () => activeContentContext.houses,
  getStoryContent: () => ({
    eventDefinitionsById: activeContentContext.storyContent.eventDefinitionsById,
    eventBindingsById: activeContentContext.storyContent.eventBindingsById,
    sceneDefinitionsById: activeContentContext.storyContent.sceneDefinitionsById,
    activityDefinitionsById:
      activeContentContext.storyContent.activityDefinitionsById,
    textEntriesById: activeContentContext.storyContent.textEntriesById,
  }),
});

const backgroundMusicPlayer = createBackgroundMusicPlayer();
const mainUiFlow = new MainUiFlow({
  overlayRoot: uiOverlayElement,
  characters: getSelectableCharactersFromContentContext(activeContentContext),
  scenarioPacks: entryShellBootstrapState.scenarioPacks,
  onStartGame: startMainGameWithLoading,
  onContinueGame: startContinueGameWithLoading,
  onStartScenarioPack: startScenarioPackWithLoading,
  onStartLoadedScenarioPack: startLoadedScenarioPackWithLoading,
  onImportScenarioPackFiles: startScenarioPackFilesWithLoading,
  loadSaveData,
  getAppState: () => appState,
});
const appRenderCoordinator = createAppRenderCoordinator({
  getAppState: () => appState,
  setAppState: (nextAppState) => {
    appState = nextAppState;
  },
  getAppRoot: () => appRoot,
  getPlayerCharacterId: () => currentPlayerCharacterId,
  getActiveContentContext: () => activeContentContext,
  getCurrentMapDefinition,
  getCurrentCityDefinition,
  getCitySceneMappingsByCityId: () => getActiveCitySceneMappingsByCityId(),
  captureCampaignTerrainCanvases,
  restoreCampaignTerrainCanvases,
  startInitialCampaignMapDebugAnimationIfNeeded,
  syncCampaignMapDebugView,
  syncCampaignTerrainStyleView,
  syncCampaignCityDepthMeshTransformView,
  restoreCampaignMapScaleInputFocus,
  syncMapIntroOverlay,
  syncActivityQteLoop,
  syncCampaignTerrainWebGl: (root) => {
    syncCampaignTerrainWebGl(root);
  },
  syncCityBeggingMiniGameOverlay,
});

syncGameViewport();
window.addEventListener("resize", syncGameViewport);
window.addEventListener("beforeunload", () => {
  persistSaveData();
});
setGameVisibility(false);
mainUiFlow.mount();
mainUiFlow.showMainMenu();

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
    activeContentContext.cityDefinitionById[appState.gameState.world.currentCityId] ??
    null;

  if (cityDefinition == null) {
    return null;
  }

  const cityEntries = activeContentContext.cityEntries.filter(
    (cityEntry) =>
      cityEntry.cityId === cityDefinition.id &&
      isCityEntryVisibleForStoryStage(appState.gameState, cityEntry)
  );
  const cityEntryHouseIds = new Set(
    cityEntries.map((cityEntry) => cityEntry.targetHouseId)
  );
  const activeCityHouseDefinitions = activeContentContext.houses.filter((houseDefinition) => {
    if (!cityEntryHouseIds.has(houseDefinition.id)) {
      return false;
    }

    return isHouseVisibleForStoryStage(
      appState.gameState,
      appState.characterDefinitions,
      houseDefinition
    );
  });
  const cityNpcPoolDefinition =
    activeContentContext.cityNpcPools.find(
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
  const completion = commitRuntimeRequest({
    state: appState,
    request: createInteractiveActionRequest(
      "interactive.city-begging.complete",
      { result }
    ),
    context: createRuntimeCommitContext({
      router: {
        route: ({ state, request }) =>
          runInteractiveRuntime({
            state,
            request,
            characterDefinitions: appState.characterDefinitions,
            playerCharacterId: currentPlayerCharacterId,
          }),
      },
    }),
  });
  appState = completion.state;
  syncCouncilPriorityAfterGameStateChange(previousGameState);
  window.onBeggingGameComplete?.(result);
}

function getCouncilPriorityHouseDefinition(): HouseDefinition | null {
  const priorityModuleId = getCouncilPriorityHouseModuleId(appState.gameState);
  const currentCityId = appState.gameState.world.currentCityId;

  return (
    activeContentContext.houses.find(
      (houseDefinition) =>
        houseDefinition.moduleId === priorityModuleId &&
        houseDefinition.cityId === currentCityId
    ) ??
    activeContentContext.houses.find(
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
  const followUp = applyCouncilPriorityFollowUp({
    state: stateSyncCoreSeam.createRuntimeStateFromAppState(appState),
    previousGameState,
    houseDefinitions: activeContentContext.houses,
    textEntriesById: activeContentContext.textEntriesById,
    councilArrivalNotice,
  });
  if (!followUp.handled) {
    return false;
  }

  appState = stateSyncCoreSeam.applyRuntimeStateToAppState(
    appState,
    followUp.state
  );
  renderApp();
  return true;
}

function showCouncilPriorityRefusal(): void {
  councilPriorityCityBeggingCoordinator.showCouncilPriorityRefusal();
}

function showCouncilInsufficientTimeRefusal(
  activityLabel: string,
  durationDays: number,
  remainingDays: number
): void {
  councilPriorityCityBeggingCoordinator.showCouncilInsufficientTimeRefusal({
    activityLabel,
    durationDays,
    remainingDays,
  });
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
  councilPriorityCityBeggingCoordinator.confirmBeggingMiniGameResult();
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
  appState = commitRuntimeRequest({
    state: appState,
    request: createInteractiveActionRequest(
      "interactive.city-begging.pointer",
      { pointerX }
    ),
    context: {
      router: {
        route: ({ state, request }) =>
          runInteractiveRuntime({
            state,
            request,
            characterDefinitions: appState.characterDefinitions,
          }),
      },
    },
  }).state;
  syncCityBeggingMiniGameOverlay(appRoot, appState.beggingMiniGameState);
}

function tickCityBeggingMiniGame(timestamp: number): void {
  cityBeggingMiniGameFrameId = null;
  const currentState = appState.beggingMiniGameState;
  if (currentState == null || !isCityBeggingMiniGamePlaying(currentState)) {
    return;
  }

  const nextResult = commitRuntimeRequest({
    state: appState,
    request: createInteractiveActionRequest("interactive.city-begging.tick", {
      now: timestamp,
    }),
    context: {
      router: {
        route: ({ state, request }) =>
          runInteractiveRuntime({
            state,
            request,
            characterDefinitions: appState.characterDefinitions,
          }),
      },
    },
  });
  const nextAppState = nextResult.state;
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
  councilPriorityCityBeggingCoordinator.openBeggingMiniGame();
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
    houseDefinitions: activeContentContext.houses,
    playerCharacterId: currentPlayerCharacterId,
    eventDefinitionsById: activeContentContext.storyContent.eventDefinitionsById,
    eventBindingsById: activeContentContext.storyContent.eventBindingsById,
    sceneDefinitionsById: activeContentContext.storyContent.sceneDefinitionsById,
    activityDefinitionsById:
      activeContentContext.storyContent.activityDefinitionsById,
    textEntriesById: activeContentContext.storyContent.textEntriesById,
  });
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

    appState = commitRuntimeRequest({
      state: appState,
      request: createInteractiveActionRequest("interactive.activity-qte.tick"),
      context: {
        router: {
          route: ({ state, request }) =>
            runInteractiveRuntime({
              state,
              request,
              characterDefinitions: appState.characterDefinitions,
            }),
        },
      },
    }).state;

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

  if (activeContentContext.storyContent.activityDefinitionsById[session.activityId] == null) {
    stopActivityQteLoop();
    appState = commitRuntimeRequest({
      state: appState,
      request: createInteractiveActionRequest("interactive.activity-qte.stop"),
      context: {
        router: {
          route: ({ state, request }) =>
            runInteractiveRuntime({
              state,
              request,
              characterDefinitions: appState.characterDefinitions,
              activityDefinitionsById:
                activeContentContext.storyContent.activityDefinitionsById,
            }),
        },
      },
    }).state;
    renderApp();
    return;
  }

  appState = commitRuntimeRequest({
    state: appState,
    request: createInteractiveActionRequest("interactive.activity-qte.stop"),
    context: {
      router: {
        route: ({ state, request }) =>
            runInteractiveRuntime({
              state,
              request,
              characterDefinitions: appState.characterDefinitions,
              activityDefinitionsById:
                activeContentContext.storyContent.activityDefinitionsById,
          }),
      },
    },
  }).state;
  renderApp();
}

function closeCurrentActivityResult(): void {
  appState = commitRuntimeRequest({
    state: appState,
    request: createExitInteractiveRequest("activity-qte"),
    context: {
      router: {
        route: ({ state, request }) =>
          runInteractiveRuntime({
            state,
            request,
            characterDefinitions: appState.characterDefinitions,
          }),
      },
    },
  }).state;
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
  appState = applyMapAutoAdvanceStart(appState, input);
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

      appState = applyMapAutoAdvanceSnapshot(appState, {
        autoAdvanceState,
        nextSnapshot,
        remainingSnapshots,
      });

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
    const runtimeCommit = commitRuntimeRequest({
      state: appState,
      request: createDayStartRequest(),
      context: createRuntimeCommitContext({
        router: {
          route: ({ state, request }) => routeTimeRuntime({ state, request }),
        },
        followUp: {
          handleFollowUp: ({ state, followUp }) =>
            followUp.type === "reenter-house"
              ? { state }
              : navigationTimeFollowUp.applyOutcome({ state, outcome: followUp }),
        },
      }),
    });
    appState = runtimeCommit.state;
    const councilArrived =
      !hasReachedCouncilDate(previousGameState) &&
      hasReachedCouncilDate(appState.gameState);
    if (councilArrived && autoAdvanceState.completion != null) {
      stopMapAutoAdvance(input.intervalId);
      houseRuntime.applyMapAutoAdvanceCompletion(autoAdvanceState.completion);
      return;
    }
    if (appState.autoAdvanceState == null) {
      stopMapAutoAdvance(input.intervalId);
    }
    renderApp();
  }, input.everyMs);
}

function advanceCurrentStoryScene(): void {
  mainRuntimeOrchestrator.execute({
    type: "advance-story-scene",
  });
  renderApp();
}

function chooseCurrentStoryOption(choiceId: string): void {
  mainRuntimeOrchestrator.execute({
    type: "choose-story-option",
    choiceId,
  });
  renderApp();
}

function dispatchCurrentStoryBattleAction(actionId: string): void {
  const result = commitRuntimeRequest({
    state: appState,
    request: createPlayableActionRequest("story-battle", "battle-action", {
      battleActionId: actionId,
    }),
    context: {
      router: {
        route: ({ state, request }) =>
          runPlayableRuntime({
            state,
            request,
            characterDefinitions: appState.characterDefinitions,
            ...(currentPlayerCharacterId == null
              ? {}
              : { playerCharacterId: currentPlayerCharacterId }),
            textEntriesById: activeContentContext.textEntriesById,
          }),
      },
      followUp: {
        handleFollowUp: ({ state, followUp }) => ({
          state:
            followUp.type === "reenter-house"
              ? houseRuntime.applyInteractiveFollowUp(followUp)
              : state,
        }),
      },
    },
  });
  appState = result.state;
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

async function restoreModFromSave(
  saveData: StartupSaveData
): Promise<ModActivationResult | null> {
  if (saveData?.selectedModId == null) {
    return null;
  }

  if (saveData.selectedModSource != null) {
    return entryShellBootstrapState.activateSavedModSource(
      saveData.selectedModSource,
      "restore:saved-mod"
    );
  }

  return entryShellBootstrapState.activateSavedMod(
    saveData.selectedModId,
    "restore:saved-mod"
  );
}

function showStartupError(error: unknown): void {
  window.alert(
    error instanceof Error ? error.message : "Startup failed."
  );
}

function loadSaveData(): StartupSaveData {
  return readBrowserSaveRecord({
    storage: getBrowserStorage(),
    availableModIds: readAvailableSaveModIds(),
  });
}

function persistSaveData(): void {
  writeBrowserSaveRecord({
    storage: getBrowserStorage(),
    selectedCharacterId: currentPlayerCharacterId,
    selectedModSource: readCurrentSelectedModSource(),
    state: readCurrentCoreGameStateForSave(),
  });
}

function getBrowserStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readAvailableSaveModIds(): string[] {
  const modRuntimeState = entryShellBootstrapState.getModRuntimeState();
  return Array.from(
    new Set([
      builtinDefaultModId,
      ...Object.keys(modRuntimeState.availableModsById),
      ...(modRuntimeState.activeModId == null ? [] : [modRuntimeState.activeModId]),
    ])
  );
}

function readCurrentSelectedModSource(): ModSourceDescriptor | null {
  const modRuntimeState = entryShellBootstrapState.getModRuntimeState();
  const activeModId = modRuntimeState.activeModId;
  if (activeModId == null) {
    return {
      kind: "builtin",
      modId: builtinDefaultModId,
    };
  }

  return (
    modRuntimeState.availableModsById[activeModId]?.source ?? {
      kind: "builtin",
      modId: activeModId,
    }
  );
}

function readCurrentCoreGameStateForSave() {
  const modRuntimeState = entryShellBootstrapState.getModRuntimeState();
  const activeModId = modRuntimeState.activeModId ?? builtinDefaultModId;
  const activeLoadedMod = modRuntimeState.availableModsById[activeModId] ?? null;
  const modState: Record<string, unknown> = {};

  if (
    appState.characterStatusById != null &&
    Object.keys(appState.characterStatusById).length > 0
  ) {
    modState.characterStatusById = appState.characterStatusById;
  }
  if (
    appState.cityStatusById != null &&
    Object.keys(appState.cityStatusById).length > 0
  ) {
    modState.cityStatusById = appState.cityStatusById;
  }
  if (
    appState.buildingStatusById != null &&
    Object.keys(appState.buildingStatusById).length > 0
  ) {
    modState.buildingStatusById = appState.buildingStatusById;
  }

  return {
    engine: {
      selectedModId: activeModId,
      version:
        activeLoadedMod?.manifest.version ?? builtinDefaultModManifest.version,
      currentView: normalizeSaveView(appState.gameState.ui.currentView),
    },
    runtime: {
      flags: { ...appState.gameState.runtime.flags },
      variables: { ...appState.gameState.runtime.variables },
      activeEventId: appState.gameState.scene.activeEventId,
      activeTaskIds: Object.values(
        appState.gameState.runtime.tasks.instancesByTaskId
      )
        .filter((instance) => instance.status === "active")
        .map((instance) => instance.taskId),
    },
    modState,
  };
}

function normalizeSaveView(
  view: AppState["gameState"]["ui"]["currentView"]
): CoreSaveViewName {
  if (
    view === "map" ||
    view === "city" ||
    view === "house" ||
    view === "scene"
  ) {
    return view;
  }

  if (view === "city-3d") {
    return "city";
  }

  return "interactive";
}

const startupSessionCoordinatorDeps = {
  activateBuiltinDefaultMod: entryShellBootstrapState.activateBuiltinDefaultMod,
  restoreModFromSave,
  activateScenarioPackMod: entryShellBootstrapState.activateScenarioPackMod,
  createPrototypeAppState:
    prototypeStartupAppStateBuilder.createPrototypeAppState,
  createHaozhouReturnEncounterAppState:
    prototypeStartupAppStateBuilder.createHaozhouReturnEncounterAppState,
  createScenarioPackAppState,
  createStartupContentContext: (activationResult: ModActivationResult) =>
    entryShellBootstrapState.createStartupContentContext(activationResult),
  bootstrapStartupStoryAppState,
};

type PendingScenarioStartupRequest =
  | {
      type: "scenario-summary";
      scenarioPack: ScenarioPackSummary;
      previewSession?: true;
    }
  | {
      type: "scenario-files";
      files: File[];
      previewSession?: true;
    }
  | {
      type: "scenario-pack";
      scenarioPack: ScenarioPackDefinition;
      source: ModSourceDescriptor;
      previewSession?: true;
    };

let pendingScenarioStartupRequest: PendingScenarioStartupRequest | null = null;

function unwrapStartupSession(
  result: Awaited<ReturnType<typeof runStartupSessionCoordinator>>
): StartupSessionBootstrap {
  if (!result.ok) {
    throw result.error;
  }

  return result.session;
}

function startContinueGameWithLoading(selectedCharacter: CharacterDefinition): void {
  const saveData = loadSaveData();
  void shellBootLifecycleCoordinator.startContinue({
    selectedCharacter,
    saveData,
  });
}

function startRestoredGameWithLoading(
  selectedCharacter: CharacterDefinition,
  saveData: StartupSaveData
): Promise<void> {
  return shellBootLifecycleCoordinator.startRestore({
    selectedCharacter,
    saveData,
  });
}

function startMainGameWithLoading(
  selectedCharacter: CharacterDefinition,
  startupScenario: StartupScenario = "default"
): void {
  if (pendingScenarioStartupRequest != null) {
    const request = pendingScenarioStartupRequest;
    pendingScenarioStartupRequest = null;
    void runScenarioPackStartupRequestWithLoading({
      ...request,
      selectedCharacter,
    }).then((didStart) => {
      if (didStart && request.previewSession === true) {
        mainUiFlow.setScreen("runtime-preview");
      }
    });
    return;
  }

  void shellBootLifecycleCoordinator.startBuiltin({
    selectedCharacter,
    startupScenario,
  });
}

function runScenarioPackStartupRequestWithLoading(
  request:
    | {
        type: "scenario-summary";
        scenarioPack: ScenarioPackSummary;
        selectedCharacter?: CharacterDefinition;
      }
    | {
        type: "scenario-files";
        files: File[];
        selectedCharacter?: CharacterDefinition;
      }
    | {
        type: "scenario-pack";
        scenarioPack: ScenarioPackDefinition;
        source: ModSourceDescriptor;
        selectedCharacter?: CharacterDefinition;
      }
): Promise<boolean> {
  let didStart = true;
  return shellBootLifecycleCoordinator.startScenarioPackRequest({
    request,
    handleError: (error) => {
      didStart = false;
      console.error("JSON scenario startup failed", error);
      setGameVisibility(false);
      mainUiFlow.showMainMenu();
      window.alert(
        error instanceof Error
          ? `JSON 开局读取失败：${error.message}`
          : "JSON 开局读取失败。"
      );
    },
  }).then(() => didStart);
}

async function startScenarioPackWithLoading(
  scenarioPack: ScenarioPackSummary
): Promise<void> {
  try {
    const loadedScenarioPack = await loadScenarioPackFromUrl(scenarioPack.url);
    const shouldDefer = await prepareScenarioPackCharacterSelection(
      loadedScenarioPack,
      {
        kind: "url",
        name: scenarioPack.title,
        url: scenarioPack.url,
      },
      {
        type: "scenario-summary",
        scenarioPack,
      }
    );
    if (shouldDefer) {
      return;
    }

    const didStart = await runScenarioPackStartupRequestWithLoading({
      type: "scenario-pack",
      scenarioPack: loadedScenarioPack,
      source: {
        kind: "url",
        name: scenarioPack.title,
        url: scenarioPack.url,
      },
    });
    if (!didStart) {
      throw new Error("Scenario pack startup failed.");
    }
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
    const shouldDefer = await prepareScenarioPackCharacterSelection(
      loadedScenarioPack,
      {
        kind: "file",
        name: importLabel,
        filePath: importLabel,
      },
      {
        type: "scenario-files",
        files,
      }
    );
    if (shouldDefer) {
      return;
    }

    const didStart = await runScenarioPackStartupRequestWithLoading({
      type: "scenario-pack",
      scenarioPack: loadedScenarioPack,
      source: {
        kind: "file",
        name: importLabel,
        filePath: importLabel,
      },
    });
    if (!didStart) {
      throw new Error("Scenario pack startup failed.");
    }
  } catch (error) {
    window.alert(
      error instanceof Error
        ? `JSON 开局读取失败（${importLabel}）：${error.message}`
        : `JSON 开局读取失败（${importLabel}）。`
    );
  }
}

async function startLoadedScenarioPackWithLoading(
  scenarioPack: ScenarioPackDefinition
): Promise<"started" | "deferred" | "failed"> {
  const source = {
    kind: "file" as const,
    name: scenarioPack.title,
    filePath: `preview:${scenarioPack.id}`,
  };

  const shouldDefer = await prepareScenarioPackCharacterSelection(
    scenarioPack,
    source,
    {
      type: "scenario-pack",
      scenarioPack,
      source,
      previewSession: true,
    }
  );
  if (shouldDefer) {
    return "deferred";
  }

  const didStart = await runScenarioPackStartupRequestWithLoading({
    type: "scenario-pack",
    scenarioPack,
    source,
  });
  if (!didStart) {
    return "failed";
  }

  return "started";
}

async function prepareScenarioPackCharacterSelection(
  scenarioPack: ScenarioPackDefinition,
  source: ModSourceDescriptor,
  pendingRequest: PendingScenarioStartupRequest
): Promise<boolean> {
  if (scenarioPack.scenarioProfile.launchPolicy?.characterSelection !== "shell") {
    return false;
  }

  const activationResult = await entryShellBootstrapState.activateScenarioPackMod(
    scenarioPack,
    source,
    `startup:shell-select:${source.kind}:${scenarioPack.id}`
  );
  if (!activationResult.ok) {
    throw new Error(activationResult.failure.message);
  }

  setActiveContentContext(
    entryShellBootstrapState.createStartupContentContext(activationResult)
  );
  pendingScenarioStartupRequest = pendingRequest;
  setGameVisibility(false);
  mainUiFlow.showCharacterSelect();
  return true;
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
  scenarioPack: ScenarioPackDefinition,
  playerCharacterId: string = scenarioPack.scenarioProfile.playerCharacterId
): AppState {
  const profile = scenarioPack.scenarioProfile;
  const scenarioMapDefinition =
    getMapDefinitionById(profile.initialLocation.mapId) ??
    activeContentContext.maps[0];
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
    activeContentContext.mapLocationProvider.getCityLocation(
      profile.initialLocation.cityId
    ) ??
    scenarioMapDefinition.initialPlayerCoordinate ??
    { x: 0, y: 0 };
  const startupTarget = resolveScenarioStartupTarget(profile);

  let nextAppState: AppState = {
    gameState: ensureCityNpcPoolsForCurrentDay(
      createInitialState({
        currentMapId: startupTarget.currentMapId,
        currentCityId: startupTarget.currentCityId,
        currentHouseId: startupTarget.currentHouseId,
        playerCharacterId,
        chapterId: profile.chapterId,
        year: calendar.year,
        month: calendar.month,
        day: calendar.day,
        pinnedCharacterId: playerCharacterId,
        reviewDateText: profile.initialUi?.reviewDateText ?? "JSON 开局",
        mainHouseMissionText:
          profile.initialUi?.mainHouseMissionText ?? scenarioPack.title,
        cards: {
          ownedCardIds: activeContentContext.cards.map(
            (cardDefinition) => cardDefinition.id
          ),
          selectedCardId: activeContentContext.cards[0]?.id ?? null,
        },
        valuables: {
          items: activeContentContext.gameContent.valuables,
          selectedItemId:
            activeContentContext.gameContent.valuables[0]?.id ?? null,
          equippedWeaponSet: {
            swordId:
              activeContentContext.gameContent.valuables.find(
                (valuableDefinition) => valuableDefinition.category === "weapon"
              )?.id ?? null,
            armorId:
              activeContentContext.gameContent.valuables.find(
                (valuableDefinition) => valuableDefinition.category === "armor"
              )?.id ?? null,
          },
        },
        activeSceneId: startupTarget.activeSceneId,
        currentView: startupTarget.currentView,
      }),
      activeContentContext.cityNpcPools
    ),
    characterDefinitions: mergeCharacterDefinitions(
      activeContentContext.gameContent.characters,
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
    ...createDefaultUiLayoutAppState(),
  };
  nextAppState = {
    ...nextAppState,
    gameState: revealCampaignMapHexesForCoordinate(
      nextAppState.gameState,
      scenarioMapDefinition,
      playerCoordinate
    ),
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
  const accessResult = evaluateLocationAccess({
    state: appState.gameState,
    targetFamily: "building",
    targetId: houseDefinition.id,
    targetBuilding: houseDefinition,
    characterDefinitions: appState.characterDefinitions,
    locationAccessDefinitions: activeContentContext.locationAccess,
  });

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
    cityHouseTransitionCoordinator.handleHouseAccessRefusal(accessResult.refusal);
  }

  return false;
}

window.addEventListener("pointerdown", resumeBackgroundMusicIfNeeded, {
  passive: true,
});
window.addEventListener("keydown", resumeBackgroundMusicIfNeeded);
window.addEventListener("message", (event) => {
  city3dHouseEntryCoordinator.handleWindowMessage(event);
});

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

appElement.addEventListener("input", (event) => {
  const targetElement = event.target;
  if (
    targetElement instanceof HTMLInputElement &&
    targetElement.hasAttribute("data-campaign-map-scale-input")
  ) {
    campaignMapScaleDraftValue = targetElement.value;
    return;
  }

  if (
    targetElement instanceof HTMLInputElement &&
    targetElement.dataset.campaignTerrainStyleField != null
  ) {
    handleCampaignTerrainStyleInput(targetElement);
    return;
  }

  if (
    targetElement instanceof HTMLInputElement &&
    targetElement.dataset.campaignCityMeshField != null
  ) {
    handleCampaignCityDepthMeshInput(targetElement);
    return;
  }

  if (
    !(
      targetElement instanceof HTMLInputElement ||
      targetElement instanceof HTMLSelectElement
    )
  ) {
    return;
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

appElement.addEventListener("change", (event) => {
  const targetElement = event.target;
  if (
    targetElement instanceof HTMLInputElement &&
    targetElement.hasAttribute("data-campaign-map-scale-input")
  ) {
    handleCampaignMapScaleInput(targetElement, { normalizeInput: true });
    campaignMapScaleDraftValue = null;
  }
});

appElement.addEventListener("keydown", (event) => {
  const targetElement = event.target;
  if (
    event.key === "Enter" &&
    targetElement instanceof HTMLInputElement &&
    targetElement.hasAttribute("data-campaign-map-scale-input")
  ) {
    event.preventDefault();
    handleCampaignMapScaleInput(targetElement, { normalizeInput: true });
    campaignMapScaleDraftValue = null;
  }
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
  zoomCampaignMapAtScreenCenter(getSteppedCampaignMapScale(direction));
});

appElement.addEventListener("pointerdown", (event) => {
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
  const pointerDragState = houseTileDragState;
  const didMove = pointerDragState.didMove;
  const beforeId = pointerDragState.currentBeforeId;
  endHouseTileDrag();
  if (!didMove) {
    return;
  }
  suppressHouseClickUntilMs = window.performance.now() + 250;
  const dragState = {
    payload: pointerDragState.payload,
    beforeId,
    restingBeforeId: pointerDragState.restingBeforeId,
    root: pointerDragState.root,
  };
  houseDragDropCoordinator.submitPointerDrag(dragState);
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
  event.preventDefault();
  houseDragDropCoordinator.submitHtmlDrop({
    payload,
    beforeId: before ?? null,
    actionPrefix: actionPrefix ?? null,
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
      appState = setCardFilter(appState, filter, activeContentContext.cards);
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

  const leaveCityButton = targetElement.closest<HTMLElement>(
    "[data-action='leave-city']"
  );
  if (leaveCityButton != null) {
    cityHouseTransitionCoordinator.leaveCity();
    return;
  }

  const enterCity3dButton = targetElement.closest<HTMLElement>(
    "[data-action='enter-city-3d']"
  );
  if (enterCity3dButton != null) {
    if (!cityHouseTransitionCoordinator.enterCity3d()) {
      return;
    }
    return;
  }

  const leaveCity3dButton = targetElement.closest<HTMLElement>(
    "[data-action='leave-city-3d']"
  );
  if (leaveCity3dButton != null) {
    cityHouseTransitionCoordinator.leaveCity3d();
    return;
  }

  const city3dHouseButton = targetElement.closest<HTMLElement>(
    "[data-city-3d-house-id]"
  );
  if (city3dHouseButton != null) {
    const sceneObjectId = city3dHouseButton.dataset.city3dSceneObjectId;
    if (sceneObjectId != null) {
      city3dHouseEntryCoordinator.handleSceneObjectHouseEntry(sceneObjectId);
    }
    return;
  }

  const cityEntryButton = targetElement.closest<HTMLElement>(
    "[data-city-entry-id]"
  );
  if (cityEntryButton != null) {
    const cityEntryId = cityEntryButton.dataset.cityEntryId;
    cityDirectoryLeaderResidenceCoordinator.handleCityEntryClick(cityEntryId);
    return;
  }

  const cityDirectoryCharacterButton = targetElement.closest<HTMLElement>(
    "[data-city-directory-character-id]"
  );
  if (cityDirectoryCharacterButton != null && appState.cityDirectoryState != null) {
    const selectedCharacterId =
      cityDirectoryCharacterButton.dataset.cityDirectoryCharacterId;
    cityDirectoryLeaderResidenceCoordinator.handleCityDirectoryCharacterSelection(selectedCharacterId);
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
      mapNodeName ??
      (cityId == null ? null : activeContentContext.cityNameById[cityId] ?? null);
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
        : activeContentContext.cityDefinitionById[appState.modalState.cityId] ??
          null;
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
    void campaignMoveAnimationCoordinator.animateMove(previousCoordinate, nextCoordinate).then(() => {
      const shouldEnterCity =
        appState.campaignTravelState != null &&
        appState.campaignTravelState.targetCoordinate.x === nextCoordinate.x &&
        appState.campaignTravelState.targetCoordinate.y === nextCoordinate.y;
      const nextAppState = {
        ...appState,
        campaignTravelState: null,
        modalState: shouldEnterCity ? pendingEnterCityState : null,
        locationDialogueState: null,
      };
      const runtimeCommit = commitRuntimeRequest({
        state: nextAppState,
        request: createAdvanceTimeSegmentsRequest(1),
        context: createRuntimeCommitContext({
          router: {
            route: ({ state, request }) => routeTimeRuntime({ state, request }),
          },
          followUp: {
            handleFollowUp: ({ state, followUp }) =>
              followUp.type === "reenter-house"
                ? { state }
                : navigationTimeFollowUp.applyOutcome({
                    state,
                    outcome: followUp,
                  }),
          },
        }),
      });
      appState = runtimeCommit.state;
      renderApp();
    });
    return;
  }

  houseRuntime.clearAllHouseIntervals();
  const clearedModalState = {
    ...appState,
    modalState: null,
    locationDialogueState: null,
  };
  const runtimeCommit = commitRuntimeRequest({
    state: clearedModalState,
    request: createEnterCityRequest(appState.modalState.cityId),
    context: createRuntimeCommitContext({
      router: {
        route: ({ state, request }) =>
          routeNavigationRuntime({
            state,
            request,
            cityDefinitionsById: activeContentContext.cityDefinitionById,
            characterDefinitions: appState.characterDefinitions,
            locationAccessDefinitions: activeContentContext.locationAccess,
          }),
      },
      followUp: {
        handleFollowUp: ({ state, followUp }) =>
          followUp.type === "reenter-house"
            ? { state }
            : navigationTimeFollowUp.applyOutcome({ state, outcome: followUp }),
      },
    }),
  });
  appState = runtimeCommit.state;
  if (runtimeCommit.runtimeResult.access?.refusal != null) {
    cityHouseTransitionCoordinator.handleHouseAccessRefusal(
      runtimeCommit.runtimeResult.access.refusal
    );
    return;
  }
  renderApp();
}

function cancelCampaignTravel(): void {
  if (
    !campaignMoveAnimationCoordinator.hasActiveAnimation() &&
    appState.campaignTravelState == null
  ) {
    return;
  }

  campaignTravelRequestId += 1;
  campaignMoveAnimationCoordinator.stopAnimation();
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
    cityId == null ? null : activeContentContext.cityDefinitionById[cityId] ?? null;
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
  campaignMoveAnimationCoordinator.stopAnimation();

  appState = applyCampaignTravelStart(appState, {
    targetCoordinate: nextCoordinate,
    cityId,
    cityName,
  });
  renderApp();

  void campaignMoveAnimationCoordinator.animateMove(previousCoordinate, nextCoordinate).then(() => {
    if (campaignTravelRequestId !== travelRequestId) {
      return;
    }

    const nextAppState = applyCampaignTravelCompletion(appState, {
      targetCoordinate: nextCoordinate,
      pendingEnterCityState: pendingEnterCityState,
    });
    const runtimeCommit = commitRuntimeRequest({
      state: nextAppState,
      request: createAdvanceTimeSegmentsRequest(1),
      context: createRuntimeCommitContext({
        router: {
          route: ({ state, request }) => routeTimeRuntime({ state, request }),
        },
        followUp: {
          handleFollowUp: ({ state, followUp }) =>
            followUp.type === "reenter-house"
              ? { state }
              : navigationTimeFollowUp.applyOutcome({
                  state,
                  outcome: followUp,
                }),
        },
      }),
    });
    appState = runtimeCommit.state;
    renderApp();
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

function ensureCurrentCampaignMapCoordinateRevealed(): void {
  const currentMapDefinition = getCurrentMapDefinition();
  if (currentMapDefinition == null) {
    return;
  }

  if ((currentMapDefinition.mode ?? "grid") !== "campaign") {
    return;
  }

  const currentHexKeys = getRevealedCampaignHexKeys(
    appState.gameState,
    currentMapDefinition.id
  );
  const nextGameState = revealCampaignMapHexesForCoordinate(
    appState.gameState,
    currentMapDefinition,
    appState.playerCoordinate
  );
  if (nextGameState === appState.gameState || currentHexKeys.length === getRevealedCampaignHexKeys(
    nextGameState,
    currentMapDefinition.id
  ).length) {
    return;
  }

  appState = {
    ...appState,
    gameState: nextGameState,
  };
}

function renderApp() {
  ensureCurrentCampaignMapCoordinateRevealed();
  appRenderCoordinator.render();
}

function restoreCampaignMapScaleInputFocus(
  focusedScaleInput: {
    value: string;
    selectionStart: number | null;
    selectionEnd: number | null;
  } | null
): void {
  if (focusedScaleInput == null) {
    return;
  }

  const scaleInputElement = appRoot.querySelector<HTMLInputElement>(
    "[data-campaign-map-scale-input]"
  );
  if (scaleInputElement == null) {
    return;
  }

  scaleInputElement.value = campaignMapScaleDraftValue ?? focusedScaleInput.value;
  scaleInputElement.focus({ preventScroll: true });
  if (
    focusedScaleInput.selectionStart != null &&
    focusedScaleInput.selectionEnd != null
  ) {
    scaleInputElement.setSelectionRange(
      focusedScaleInput.selectionStart,
      focusedScaleInput.selectionEnd
    );
  }
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
    zoomCampaignMapAtScreenCenter(getSteppedCampaignMapScale(1));
    return;
  }

  if (action === "zoom-out") {
    zoomCampaignMapAtScreenCenter(getSteppedCampaignMapScale(-1));
    return;
  }

  if (action === "reset") {
    setCampaignMapDebugState(campaignMapDebugHomeState);
    return;
  }

  if (action === "terrain-style-reset") {
    setCampaignTerrainStyleState(DEFAULT_CAMPAIGN_TERRAIN_STYLE);
    return;
  }

  if (action === "city-mesh-reset") {
    setCampaignCityDepthMeshTransformState(
      DEFAULT_CAMPAIGN_CITY_DEPTH_MESH_TRANSFORM
    );
    return;
  }

  if (action === "city-mesh-copy") {
    void copyCampaignCityDepthMeshParameters();
  }
}

function getSteppedCampaignMapScale(direction: -1 | 1): number {
  if (direction > 0) {
    return campaignMapDebugState.scale * MAP_DEBUG_SCALE_STEP_RATIO;
  }

  return campaignMapDebugState.scale / MAP_DEBUG_SCALE_STEP_RATIO;
}

function handleCampaignMapScaleInput(
  inputElement: HTMLInputElement,
  options: { normalizeInput?: boolean } = {}
): void {
  if (inputElement.value.trim() === "") {
    return;
  }

  const nextScale = Number(inputElement.value);
  if (!Number.isFinite(nextScale)) {
    return;
  }

  zoomCampaignMapAtScreenCenter(nextScale);
  if (options.normalizeInput === true) {
    inputElement.value = campaignMapDebugState.scale.toFixed(2);
  }
}

function handleCampaignTerrainStyleInput(inputElement: HTMLInputElement): void {
  const field = inputElement.dataset.campaignTerrainStyleField;
  if (!isCampaignTerrainStyleField(field)) {
    return;
  }

  const nextValue = Number(inputElement.value);
  if (!Number.isFinite(nextValue)) {
    return;
  }

  setCampaignTerrainStyleState({
    ...campaignTerrainStyleState,
    [field]: clampCampaignTerrainStyleValue(field, nextValue),
  });
}

function isCampaignTerrainStyleField(
  field: string | undefined
): field is keyof CampaignTerrainStyle {
  return (
    field === "saturation" ||
    field === "brightness" ||
    field === "brightnessOffset" ||
    field === "shadeMin" ||
    field === "shadeMax"
  );
}

function clampCampaignTerrainStyleValue(
  field: keyof CampaignTerrainStyle,
  value: number
): number {
  if (field === "brightnessOffset") {
    return clamp(value, -0.5, 0.5);
  }

  if (field === "shadeMin" || field === "shadeMax") {
    return clamp(value, 0, 2);
  }

  return clamp(value, 0, 3);
}

function setCampaignTerrainStyleState(nextState: CampaignTerrainStyle): void {
  const clampedState: CampaignTerrainStyle = {
    saturation: clampCampaignTerrainStyleValue("saturation", nextState.saturation),
    brightness: clampCampaignTerrainStyleValue("brightness", nextState.brightness),
    brightnessOffset: clampCampaignTerrainStyleValue(
      "brightnessOffset",
      nextState.brightnessOffset
    ),
    shadeMin: clampCampaignTerrainStyleValue("shadeMin", nextState.shadeMin),
    shadeMax: clampCampaignTerrainStyleValue("shadeMax", nextState.shadeMax),
  };

  campaignTerrainStyleState = clampedState;
  syncCampaignTerrainStyleView();
  requestCampaignTerrainRender("static");
}

function handleCampaignCityDepthMeshInput(inputElement: HTMLInputElement): void {
  const field = inputElement.dataset.campaignCityMeshField;
  if (!isCampaignCityDepthMeshTransformField(field)) {
    return;
  }

  const nextValue = Number(inputElement.value);
  if (!Number.isFinite(nextValue)) {
    return;
  }

  setCampaignCityDepthMeshTransformState({
    ...campaignCityDepthMeshTransformState,
    [field]: clampCampaignCityDepthMeshTransformValue(field, nextValue),
  });
}

function isCampaignCityDepthMeshTransformField(
  field: string | undefined
): field is keyof CampaignCityDepthMeshTransform {
  return (
    field === "rotationDegrees" ||
    field === "pitchDegrees" ||
    field === "scale" ||
    field === "offsetX" ||
    field === "offsetY" ||
    field === "lift"
  );
}

function clampCampaignCityDepthMeshTransformValue(
  field: keyof CampaignCityDepthMeshTransform,
  value: number
): number {
  if (field === "rotationDegrees") {
    return clamp(value, -180, 180);
  }

  if (field === "pitchDegrees") {
    return clamp(value, -90, 90);
  }

  if (field === "offsetX" || field === "offsetY") {
    return clamp(value, -1, 1);
  }

  if (field === "lift") {
    return clamp(value, -0.08, 0.16);
  }

  return clamp(value, 0.1, 6);
}

function setCampaignCityDepthMeshTransformState(
  nextState: CampaignCityDepthMeshTransform
): void {
  campaignCityDepthMeshTransformState = {
    rotationDegrees: clampCampaignCityDepthMeshTransformValue(
      "rotationDegrees",
      nextState.rotationDegrees
    ),
    pitchDegrees: clampCampaignCityDepthMeshTransformValue(
      "pitchDegrees",
      nextState.pitchDegrees
    ),
    scale: clampCampaignCityDepthMeshTransformValue("scale", nextState.scale),
    offsetX: clampCampaignCityDepthMeshTransformValue(
      "offsetX",
      nextState.offsetX
    ),
    offsetY: clampCampaignCityDepthMeshTransformValue(
      "offsetY",
      nextState.offsetY
    ),
    lift: clampCampaignCityDepthMeshTransformValue("lift", nextState.lift),
  };
  syncCampaignCityDepthMeshTransformView();
  requestCampaignTerrainRender("static");
}

function syncCampaignCityDepthMeshTransformView(): void {
  const canvases = appRoot.querySelectorAll<HTMLCanvasElement>(
    "[data-campaign-map-terrain]"
  );
  for (const canvas of canvases) {
    canvas.dataset.campaignCityRotation =
      campaignCityDepthMeshTransformState.rotationDegrees.toFixed(3);
    canvas.dataset.campaignCityPitch =
      campaignCityDepthMeshTransformState.pitchDegrees.toFixed(3);
    canvas.dataset.campaignCityScale =
      campaignCityDepthMeshTransformState.scale.toFixed(3);
    canvas.dataset.campaignCityOffsetX =
      campaignCityDepthMeshTransformState.offsetX.toFixed(3);
    canvas.dataset.campaignCityOffsetY =
      campaignCityDepthMeshTransformState.offsetY.toFixed(3);
    canvas.dataset.campaignCityLift =
      campaignCityDepthMeshTransformState.lift.toFixed(4);
  }

  syncCampaignCityDepthMeshTransformControl(
    "rotationDegrees",
    campaignCityDepthMeshTransformState.rotationDegrees
  );
  syncCampaignCityDepthMeshTransformControl(
    "pitchDegrees",
    campaignCityDepthMeshTransformState.pitchDegrees
  );
  syncCampaignCityDepthMeshTransformControl(
    "scale",
    campaignCityDepthMeshTransformState.scale
  );
  syncCampaignCityDepthMeshTransformControl(
    "offsetX",
    campaignCityDepthMeshTransformState.offsetX
  );
  syncCampaignCityDepthMeshTransformControl(
    "offsetY",
    campaignCityDepthMeshTransformState.offsetY
  );
  syncCampaignCityDepthMeshTransformControl(
    "lift",
    campaignCityDepthMeshTransformState.lift
  );
}

function syncCampaignCityDepthMeshTransformControl(
  field: keyof CampaignCityDepthMeshTransform,
  value: number
): void {
  const inputElement = appRoot.querySelector<HTMLInputElement>(
    `[data-campaign-city-mesh-field="${field}"]`
  );
  const valueElement = appRoot.querySelector<HTMLElement>(
    `[data-campaign-city-mesh-value="${field}"]`
  );
  const formattedValue =
    field === "rotationDegrees" || field === "pitchDegrees"
      ? `${value.toFixed(0)}deg`
      : field === "lift"
        ? value.toFixed(4)
        : field === "offsetX" || field === "offsetY"
          ? value.toFixed(2)
        : value.toFixed(2);

  if (inputElement != null && inputElement !== document.activeElement) {
    inputElement.value = value.toFixed(field === "lift" ? 4 : 3);
  }
  if (valueElement != null) {
    valueElement.textContent = formattedValue;
  }
}

async function copyCampaignCityDepthMeshParameters(): Promise<void> {
  const parameters = {
    rotationDegrees: Number(
      campaignCityDepthMeshTransformState.rotationDegrees.toFixed(3)
    ),
    pitchDegrees: Number(
      campaignCityDepthMeshTransformState.pitchDegrees.toFixed(3)
    ),
    scale: Number(campaignCityDepthMeshTransformState.scale.toFixed(3)),
    offsetX: Number(campaignCityDepthMeshTransformState.offsetX.toFixed(3)),
    offsetY: Number(campaignCityDepthMeshTransformState.offsetY.toFixed(3)),
    lift: Number(campaignCityDepthMeshTransformState.lift.toFixed(4)),
  };
  const text = JSON.stringify(parameters, null, 2);
  try {
    await navigator.clipboard.writeText(text);
    updateCampaignCityDepthMeshCopyStatus("Copied");
  } catch {
    updateCampaignCityDepthMeshCopyStatus(text);
  }
}

function updateCampaignCityDepthMeshCopyStatus(text: string): void {
  const statusElement = appRoot.querySelector<HTMLElement>(
    "[data-campaign-city-mesh-copy-status]"
  );
  if (statusElement != null) {
    statusElement.textContent = text;
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
  const scaleInputElement = appRoot.querySelector<HTMLInputElement>(
    "[data-campaign-map-scale-input]"
  );
  if (scaleElement != null) {
    scaleElement.textContent = `${campaignMapDebugState.scale.toFixed(2)}x`;
  }
  if (
    scaleInputElement != null &&
    scaleInputElement !== document.activeElement
  ) {
    scaleInputElement.value = campaignMapDebugState.scale.toFixed(2);
  }
  if (offsetXElement != null) {
    offsetXElement.textContent = `${campaignMapDebugState.offsetX}px`;
  }
  if (offsetYElement != null) {
    offsetYElement.textContent = `${campaignMapDebugState.offsetY}px`;
  }
}

function syncCampaignTerrainStyleView(): void {
  const canvases = appRoot.querySelectorAll<HTMLCanvasElement>(
    "[data-campaign-map-terrain]"
  );
  for (const canvas of canvases) {
    canvas.dataset.mapTextureSaturation =
      campaignTerrainStyleState.saturation.toFixed(3);
    canvas.dataset.mapTextureBrightness =
      campaignTerrainStyleState.brightness.toFixed(3);
    canvas.dataset.mapTextureBrightnessOffset =
      campaignTerrainStyleState.brightnessOffset.toFixed(3);
    canvas.dataset.mapTextureShadeMin =
      campaignTerrainStyleState.shadeMin.toFixed(3);
    canvas.dataset.mapTextureShadeMax =
      campaignTerrainStyleState.shadeMax.toFixed(3);
  }

  syncCampaignTerrainStyleControl(
    "saturation",
    campaignTerrainStyleState.saturation
  );
  syncCampaignTerrainStyleControl(
    "brightness",
    campaignTerrainStyleState.brightness
  );
  syncCampaignTerrainStyleControl(
    "brightnessOffset",
    campaignTerrainStyleState.brightnessOffset
  );
  syncCampaignTerrainStyleControl("shadeMin", campaignTerrainStyleState.shadeMin);
  syncCampaignTerrainStyleControl("shadeMax", campaignTerrainStyleState.shadeMax);
}

function syncCampaignTerrainStyleControl(
  field: keyof CampaignTerrainStyle,
  value: number
): void {
  const inputElement = appRoot.querySelector<HTMLInputElement>(
    `[data-campaign-terrain-style-field="${field}"]`
  );
  const valueElement = appRoot.querySelector<HTMLElement>(
    `[data-campaign-terrain-style-value="${field}"]`
  );
  const formattedValue = value.toFixed(field === "brightnessOffset" ? 3 : 2);

  if (inputElement != null && inputElement !== document.activeElement) {
    inputElement.value = value.toFixed(3);
  }
  if (valueElement != null) {
    valueElement.textContent = formattedValue;
  }
}

function endCampaignMapDrag(event: PointerEvent): void {
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
