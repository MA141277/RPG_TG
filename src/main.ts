import "./styles/app.css";
import buttonLightAudioUrl from "./assets/audio/ui/button-light.mp3?url";
import buttonHeavyAudioUrl from "./assets/audio/ui/button-heavy.mp3?url";
import enterAudioUrl from "./assets/audio/ui/enter.mp3?url";
import troopSelectionAudioUrl from "./assets/audio/ui/troop-selection.mp3?url";
import troopMutationAudioUrl from "./assets/audio/ui/troop-mutation.mp3?url";
import pachinkoLaunchAudioUrl from "./assets/audio/activity/pachinko-launch.mp3?url";
import pachinkoBounce1AudioUrl from "./assets/audio/activity/pachinko-bounce-1.mp3?url";
import pachinkoBounce2AudioUrl from "./assets/audio/activity/pachinko-bounce-2.mp3?url";
import gameMoneyAudioUrl from "./assets/audio/game-events/money.mp3?url";
import taskVictoryAudioUrl from "./assets/audio/game-events/task-victory.mp3?url";
import taskFailureAudioUrl from "./assets/audio/game-events/task-failure.mp3?url";
import battleSlashHit1AudioUrl from "./assets/audio/battle/slash-hit-1.mp3?url";
import battleSlashHit2AudioUrl from "./assets/audio/battle/slash-hit-2.mp3?url";
import battleSlashHit3AudioUrl from "./assets/audio/battle/slash-hit-3.mp3?url";
import battleSlashMissAudioUrl from "./assets/audio/battle/slash-miss.mp3?url";
import battleBowDrawAudioUrl from "./assets/audio/battle/bow-draw.mp3?url";
import battleArrowReleaseAudioUrl from "./assets/audio/battle/arrow-release.mp3?url";
import battleJumpAudioUrl from "./assets/audio/battle/jump.mp3?url";
import battleLandingAudioUrl from "./assets/audio/battle/landing.mp3?url";
import battleHorseRunAudioUrl from "./assets/audio/battle/horse-run.mp3?url";
import battleMusketeerReloadAudioUrl from "./assets/audio/battle/musketeer-reload.mp3?url";
import battleMusketeerFireAudioUrl from "./assets/audio/battle/musketeer-fire.mp3?url";
import battleImpactAudioUrl from "./assets/audio/battle/impact.mp3?url";
import battleBgmAudioUrl from "./assets/audio/battle/battle-bgm.mp3?url";
import battleVictoryAudioUrl from "./assets/audio/battle/battle-victory.mp3?url";
import { ensureCityNpcPoolsForCurrentDay } from "./application/city-npcs/refresh-city-npc-pools";
import { selectPlayableCharacters } from "./application/character/character-manager";
import {
  selectLayoutEditorComponent,
  selectLayoutEditorElement,
  selectLayoutEditorTarget,
  setLayoutEditorBackgroundAsset,
  setLayoutEditorBackgroundAssetQuery,
  setLayoutEditorBackgroundMode,
  setLayoutEditorBackgroundSlice,
  setLayoutEditorBattleUiValue,
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
  closeCharacterAbilityDetail,
  closeGlobalOverlay,
  closeNpcInteraction,
  closeTroopEditor,
  closeTroopManagement,
  clearTroopManagementUnit,
  createTroopEditorTeam,
  dismissTroopEditorReserveUnit,
  disbandTroopManagementUnit,
  purchaseTroopEditorShopOffer,
  swapTroopEditorTeams,
  chooseNpcDefaultTalk,
  openCharacterAbilityDetail,
  openCharacterDetail,
  openBackpack,
  openCityMenu,
  openCityDirectory,
  openNpcInteraction,
  openPlayerDetail,
  openTroopEditor,
  openTroopManagement,
  addTroopManagementUnitFromReserve,
  removeTroopManagementUnit,
  runBackpackItemAction,
  selectCard,
  selectBackpackItem,
  selectValuable,
  setBackpackFilter,
  setCardFilter,
  setValuableFilter,
  setValuableSort,
  moveTroopManagementUnit,
  updateOverlayView,
} from "./application/app-actions";
import type { AppState } from "./application/app-shell";
import { applyCoinReward } from "./application/rewards/coin-reward";
import { normalizeTroopRuntimeStateUnitDefinitions } from "./domain/troop-editor";
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
import {
  BUILTIN_AUDIO_CUE_IDS,
  createAppAudioController,
  createAppAudioOutput,
  createAppAudioSession,
  queueAppAudioCue,
  resolveStoryBattleActionCueId,
} from "./application/audio/audio-manager";
import {
  ENTER_SOUND,
  type EnterSoundEffect,
} from "./application/audio/enter-sound";
import {
  TROOP_SELECTION_SOUND,
  type TroopSelectionSoundEffect,
} from "./application/audio/troop-selection-sound";
import {
  TROOP_MUTATION_SOUND,
  type TroopMutationSoundEffect,
} from "./application/audio/troop-mutation-sound";
import { PACHINKO_COLLISION_SOUND } from "./application/audio/pachinko-collision-sound";
import { consumePachinkoCollisionAudioPulse } from "./application/audio/pachinko-collision-playback";
import {
  resolveButtonHoverSoundEffectFromTarget,
  resolveUiClickCueIdFromTarget,
  type ButtonSoundEffect,
} from "./application/audio/button-sound";
import {
  resolveBattleDemoCueId,
  resolveBattleDemoMusicCommand,
} from "./application/audio/battle-sound";
import { createAppPresenterOutput } from "./application/presenter/app-presenter";
import { createMainRuntimeOrchestrator } from "./application/runtime/main-runtime-orchestrator";
import { resolveStorySceneHouseFollowUp } from "./application/runtime/transition/story-scene-house-follow-up";
import { processMapReturnEffects } from "./application/runtime/transition/map-return-effect-transition";
import {
  applyCouncilPriorityFollowUp,
  createNavigationTimeFollowUpBridge,
  type NavigationTimeFollowUpAppState,
} from "./application/runtime/navigation-time-follow-up";
import { selectLeaderResidenceOptions } from "./application/city-entries/select-leader-residence-options";
import { canAffordActivityCost } from "./application/player/player-stamina";
import {
  formatCouncilStatusText,
  readCalendarDateNumber,
} from "./application/time/time-progression";
import {
  COUNCIL_INSUFFICIENT_TIME_DIALOGUE_TEXT,
} from "./application/time/council-insufficient-time-dialogue";
import {
  getInsufficientDaysForTimedActivity,
  getCouncilPriorityHouseModuleId,
  hasReachedCouncilDate,
  isCouncilPriorityHouseDefinition,
} from "./application/time/council-priority";
import {
  isCityEntryVisibleForStoryStage,
  isHouseVisibleForStoryStage,
  selectHouseEntryAccess,
} from "./application/story/story-stage-access";
import {
  coordinateToRoundedHex,
  createPassableHexTravelPath,
  getHexKey,
  getHexNeighbors,
  hexToCoordinatePolygon,
  snapCoordinateToHexCenter,
  travelToCoordinate,
  type CoordinateSpace,
  type GridCoordinate,
  type HexCoordinateSystem,
} from "./application/navigation/travel-to-coordinate";
import {
  revealCampaignMapHexesForCoordinate,
} from "./application/map/campaign-map-exploration";
import { resolveCampaignMapNodeAtCoordinate } from "./application/map/campaign-map-node-hit";
import {
  isCampaignMapCoordinateClickable,
  revealCampaignMapAroundCoordinate,
} from "./application/navigation/campaign-map-exploration";
import { createInitialState } from "./application/state/create-initial-state";
import {
  createActiveGameContentContextFromModActivation,
  type ActiveGameContentContext,
} from "./application/content/active-game-content";
import {
  isNpcInteractionBlocked,
  selectNpcInteractionBlockState,
} from "./application/npc-interaction/npc-interaction";
import {
  resolveTextEntry,
  resolveTextTemplateEntry,
} from "./application/content/text-resolution";
import { loadDefaultRuntimeContent } from "./application/content/default-runtime-content";
import {
  runStartupSessionCoordinator,
  type StartupSaveData,
  type StartupScenario,
  type StartupSessionBootstrap,
} from "./application/startup/startup-session-coordinator";
import {
  applyStartupStoryBootstrap,
  type StartupStoryBootstrap,
} from "./application/startup/startup-story-bootstrap";
import { createHaozhouReturnEncounterBattleState } from "./application/startup/haozhou-return-battle-state";
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
} from "./core/runtime/event-runtime";
import {
  createPrototypeCharactersForStoryStage,
} from "./content/prototype-world";
import { createBaseGameContentPack } from "./content/base-game-content-pack";
import { getZhuYuanzhangCitySceneMappingByCityId } from "./content/city-scene-mappings";
import {
  createDefaultBattleUiScreenLayout,
  createDefaultCharacterDetailScreenLayout,
  createDefaultCharacterSelectScreenLayout,
  createDefaultGlobalHudLayout,
  createDefaultStartScreenLayout,
  globalHudBackgroundOptions,
} from "./content/layout-editor-presets";
import {
  battleUiEditorVariableDefinitions,
  createDefaultBattleUiEditorValues,
  type BattleUiEditorValues,
  type BattleUiEditorVariableName,
} from "./domain/battle-ui-editor";
import { builtInScenarioPacks } from "./content/scenario-packs/scenario-pack-catalog";
import {
  createEmptyModRuntimeState,
  createLoadedModFromManifest,
  createLoadedModFromScenarioPack,
  runModRuntime,
} from "./core/mods/mod-runtime";
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
  createLaunchPlayableRequest,
  createPlayableActionRequest,
  runPlayableRuntime,
} from "./core/runtime/playable-runtime";
import {
  applyRuntimeBridgeState,
  commitRuntimeRequest,
  createRuntimeBridgeState,
} from "./core/runtime/state-sync-runtime";
import type {
  RuntimeFollowUpContext,
  RuntimeRouter,
} from "./core/runtime/runtime-router";
import type { GameModManifest } from "./core/contracts/mod-manifest";
import type {
  LoadedMod,
  ModActivationResult,
  ModRuntimeState,
  ModSourceDescriptor,
} from "./core/contracts/mod-runtime";
import type { ActivityDefinition } from "./domain/activity";
import {
  FORTUNE_BOARD_DEFAULT_ANIMATION_TICK_MS,
  FORTUNE_BOARD_MAX_ANIMATION_TICK_MS,
  FORTUNE_BOARD_MIN_ANIMATION_TICK_MS,
  PACHINKO_BOARD_DEFAULT_ANIMATION_TICK_MS,
} from "./domain/activity-session";
import type { ActiveActivitySession } from "./domain/activity-session";
import type { SceneDefinition } from "./domain/action";
import type { GameState } from "./domain/game-state";
import type { CityDefinition } from "./domain/city";
import type { CharacterDefinition } from "./domain/character";
import type { CityBeggingGameCompletionResult } from "./domain/city-begging-minigame";
import type { CityEntryDefinition } from "./domain/city-entry";
import type { CityNpcPoolDefinition } from "./domain/city-npc";
import type { EventDefinition } from "./domain/event";
import type { HouseDefinition } from "./domain/house";
import type {
  HouseModuleId,
  HouseModuleTransitionResult,
} from "./domain/house-module";
import type { MapDefinition } from "./domain/map";
import type { NpcInteractionContext } from "./domain/npc-interaction";
import type {
  ScenarioPackDefinition,
  ScenarioPackSummary,
} from "./domain/scenario-pack";
import type {
  BackpackItemCategoryFilter,
  ItemActionId,
} from "./domain/item";
import type {
  CardLibraryFilter,
  ValuableLibraryFilter,
  ValuableLibrarySortKey,
} from "./domain/global-ui";
import { LEADER_RESIDENCE_VARIABLE_KEYS } from "./domain/leader-residence";
import type {
  UiLayoutBackgroundMode,
  UiLayout,
  UiLayoutRect,
  LayoutEditorTargetId,
} from "./domain/ui-layout";
import type { ValuableItemId } from "./domain/valuable-item";
import {
  isHaozhouEvacuatedDuringBeggingJourney,
  isHaozhouShortageDuringBeggingJourney,
  ZHU_YUANZHANG_STORY_FLAG_KEYS,
  ZHU_YUANZHANG_STORY_STAGES,
  ZHU_YUANZHANG_STORY_VARIABLE_KEYS,
} from "./domain/zhu-yuanzhang-story";
import {
  STORY_PRESENTATION_VARIABLE_KEYS,
  readStoryChapterTitleText,
} from "./domain/story-presentation";
import { assertExists } from "./shared/assert";
import { renderApp as renderAppMarkup } from "./ui/app-render";
import {
  renderLoadingScreen,
  selectRandomLoadingTheme,
  setLoadingScreenProgress,
  type LoadingTheme,
} from "./ui/loading-screen";
import { preloadInitialMapViewAssets } from "./ui/startup-asset-preloader";
import { MainUiFlow } from "./ui/main-ui/main-ui-flow.js";
import { createCoinRewardAnimator } from "./ui/animations/coin-reward-animation";
import {
  CardDrawAnimator,
  formatCardDrawResultLabel,
} from "./ui/animations/card-draw-animation";
import {
  DEFAULT_CAMPAIGN_TERRAIN_STYLE,
  createCampaignTerrainCameraCenteredOnCoordinate,
  getCampaignTerrainCameraTiltRadiansForScale,
  getCampaignTerrainHexCoordinateSystem,
  getCampaignTerrainTravelGrid,
  isCampaignTerrainUvPassable,
  projectCampaignTerrainUvToClientPointAtHeightAnchor,
  resolveCampaignTerrainUvFromClientPosition,
  requestCampaignTerrainRender,
  setCampaignTerrainCamera,
  syncCampaignTerrainWebGl,
  waitForCampaignTerrainReady,
  type CampaignTerrainStyle,
} from "./ui/views/map/campaign-terrain-webgl";
import {
  DEFAULT_CAMPAIGN_CLOUD_TEXTURE_SCALE_BOOST,
  MAX_CAMPAIGN_CLOUD_TEXTURE_SCALE_BOOST,
  MIN_CAMPAIGN_CLOUD_TEXTURE_SCALE_BOOST,
  beginCampaignCloudInteraction,
  endCampaignCloudInteraction,
  getCampaignCloudTextureScaleBoost,
  requestCampaignCloudRender,
  setCampaignCloudTextureScaleBoost,
  syncCampaignCloudWebGl,
} from "./ui/views/map/campaign-cloud-webgl";
import { mountCityStageDomRuntime } from "./ui/views/city/city-stage-dom-runtime";
import { syncCityBeggingMiniGameOverlay } from "./ui/views/minigames/city-begging-minigame-view";
import { syncDialogueTypewriterRuntime } from "./ui/components/dialogue/dialogue-typewriter-runtime";
import { syncTroopEditorInteractions } from "./ui/views/troop-editor/troop-editor-interactions";
import { syncTroopManagementBattlePreview } from "./ui/views/troop-editor/troop-management-battle-preview";
import { syncTroopManagementMoveInteractions } from "./ui/views/troop-editor/troop-management-move-interactions";

const GAME_VIEWPORT_WIDTH = 1600;
const GAME_VIEWPORT_HEIGHT = 900;
const MAP_DEBUG_MIN_SCALE = 0.5;
const MAP_DEBUG_MAX_SCALE = Number.POSITIVE_INFINITY;
const MAP_DEBUG_SCALE_STEP_RATIO = 1.3;
const INITIAL_MAP_DEBUG_ANIMATION_DURATION_MS = 250;
const MAP_INTRO_OVERLAY_DURATION_MS = 4000;
const CAMPAIGN_MAP_ZOOM_ANIMATION_DURATION_MS = 220;
const CAMPAIGN_MAP_ZOOM_CLOUD_IDLE_RESUME_DELAY_MS = 500;
const CAMPAIGN_MAP_ZOOM_SETTLE_SCALE_EPSILON = 0.002;
const CAMPAIGN_MAP_ZOOM_SETTLE_OFFSET_EPSILON_PX = 1;
const LOADING_SCREEN_SIMULATION_DURATION_MS = 350;
const STARTUP_LOADING_SIMULATED_PROGRESS_CAP = 0.7;
const STARTUP_LOADING_ASSET_PROGRESS_CAP = 0.82;
const STARTUP_LOADING_COMPLETION_ANIMATION_MS = 260;
const CAMPAIGN_TRAVEL_SPEED_SCALE = 0.6;
const CAMPAIGN_TRAVEL_MS_PER_MAP_UNIT = 55 / CAMPAIGN_TRAVEL_SPEED_SCALE;
const CAMPAIGN_TRAVEL_MIN_DURATION_MS = 1400 / CAMPAIGN_TRAVEL_SPEED_SCALE;
const CAMPAIGN_TRAVEL_MAX_DURATION_MS = 18000 / CAMPAIGN_TRAVEL_SPEED_SCALE;
const CAMPAIGN_TURN_DEGREES_PER_SECOND = 180;
const ACTIVITY_QTE_INTERVAL_MS = 90;
const BUILTIN_AUDIO_ASSET_URLS: Readonly<Record<string, string>> = {
  "BGM/开局.mp3": new URL("../BGM/开局.mp3", import.meta.url).href,
  "BGM/游戏内.mp3": new URL("../BGM/游戏内.mp3", import.meta.url).href,
  "BGM/战斗背景音乐.mp3": new URL("../BGM/战斗背景音乐.mp3", import.meta.url).href,
};
const INITIAL_CAMPAIGN_MAP_DEBUG_STATE: CampaignMapDebugState = {
  scale: 40,
  offsetX: 0,
  offsetY: 0,
};
const TARGET_CAMPAIGN_MAP_DEBUG_STATE: CampaignMapDebugState = {
  scale: 40,
  offsetX: 0,
  offsetY: 0,
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

type CampaignMapZoomAnimationState = {
  frameId: number | null;
  target: CampaignMapDebugState;
  lastFrameMs: number | null;
};

type CampaignMoveAnimationState = {
  frameId: number | null;
  startedAtMs: number;
  from: GridCoordinate;
  to: GridCoordinate;
  durationMs: number;
  resolve: () => void;
};

type CityCardDrawOverlayRuntime = {
  overlay: HTMLElement;
  mount: HTMLElement;
  sessionId: number;
  animator: CardDrawAnimator;
  hasStarted: boolean;
};

type CityBeggingDefaultFortuneRuntime = {
  overlay: HTMLElement;
  mount: HTMLElement;
  drawKey: string;
  animator: CardDrawAnimator;
  hasStarted: boolean;
};

type PachinkoFortuneCardDrawRuntime = {
  overlay: HTMLElement;
  mount: HTMLElement;
  drawKey: string;
  animator: CardDrawAnimator;
  hasStarted: boolean;
};

type PreservedPachinkoFortuneCardDrawOverlay = {
  overlay: HTMLElement;
  drawKey: string;
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

let activeContentContext: ActiveGameContentContext =
  createActiveGameContentContextFromModActivation({
    basePack: baseGameContentPack,
    activationResult: builtinStartupActivation,
  });

function revealCampaignMapAroundAppCoordinate(
  state: AppState,
  coordinate: GridCoordinate,
  options?: {
    animateNewHexes?: boolean;
    coordinateSystem?: HexCoordinateSystem;
    revealedAtMs?: number;
  }
): AppState {
  const mapDefinition =
    getMapDefinitionById(state.gameState.world.currentMapId) ?? null;
  if (
    mapDefinition?.mode !== "campaign" ||
    mapDefinition.coordinateSpace == null
  ) {
    return state;
  }

  const nextGameState = revealCampaignMapAroundCoordinate({
    state: state.gameState,
    mapId: mapDefinition.id,
    coordinate,
    coordinateSpace: mapDefinition.coordinateSpace,
    ...(options?.coordinateSystem == null
      ? {}
      : { coordinateSystem: options.coordinateSystem }),
    ...(options?.animateNewHexes == null
      ? {}
      : { animateNewHexes: options.animateNewHexes }),
    ...(options?.revealedAtMs == null
      ? {}
      : { revealedAtMs: options.revealedAtMs }),
  });
  if (nextGameState === state.gameState) {
    return state;
  }

  return {
    ...state,
    gameState: nextGameState,
  };
}

function isCurrentCampaignCoordinateClickable(coordinate: GridCoordinate): boolean {
  const mapDefinition = getCurrentMapDefinition();
  if (
    mapDefinition?.mode !== "campaign" ||
    mapDefinition.coordinateSpace == null
  ) {
    return true;
  }

  const coordinateSystem = getCurrentCampaignHexCoordinateSystem();
  return isCampaignMapCoordinateClickable({
    state: appState.gameState,
    mapId: mapDefinition.id,
    coordinate,
    coordinateSpace: mapDefinition.coordinateSpace,
    ...(coordinateSystem == null ? {} : { coordinateSystem }),
  });
}

function getCurrentCampaignHexCoordinateSystem(): HexCoordinateSystem | null {
  const mapViewport = appRoot.querySelector<HTMLElement>("[data-campaign-map-viewport]");
  if (mapViewport == null) {
    return null;
  }

  return getCampaignTerrainHexCoordinateSystem(mapViewport);
}

const realignedCampaignOpeningRevealMapIds = new Set<string>();

function getCampaignRevealNeighborhoodKeys(input: {
  coordinate: GridCoordinate;
  coordinateSpace: CoordinateSpace;
  coordinateSystem?: HexCoordinateSystem;
}): Set<string> {
  const centerHex = coordinateToRoundedHex(
    input.coordinate,
    input.coordinateSpace,
    input.coordinateSystem
  );
  return new Set(
    [centerHex, ...getHexNeighbors(centerHex)].map((hex) => getHexKey(hex))
  );
}

function realignCurrentCampaignOpeningRevealSeed(
  coordinateSystem: HexCoordinateSystem
): boolean {
  const mapDefinition = getCurrentMapDefinition();
  if (
    mapDefinition?.mode !== "campaign" ||
    mapDefinition.coordinateSpace == null ||
    realignedCampaignOpeningRevealMapIds.has(mapDefinition.id)
  ) {
    return false;
  }

  const explorationState =
    appState.gameState.runtime.mapExplorationByMapId?.[mapDefinition.id] ?? null;
  if (explorationState == null) {
    realignedCampaignOpeningRevealMapIds.add(mapDefinition.id);
    return false;
  }

  const defaultKeys = getCampaignRevealNeighborhoodKeys({
    coordinate: appState.playerCoordinate,
    coordinateSpace: mapDefinition.coordinateSpace,
  });
  const actualKeys = getCampaignRevealNeighborhoodKeys({
    coordinate: appState.playerCoordinate,
    coordinateSpace: mapDefinition.coordinateSpace,
    coordinateSystem,
  });
  const existingKeys = new Set(explorationState.revealedHexKeys);
  const hasDefaultOnlySeed = Array.from(defaultKeys).some(
    (key) => !actualKeys.has(key) && existingKeys.has(key)
  );
  realignedCampaignOpeningRevealMapIds.add(mapDefinition.id);
  if (!hasDefaultOnlySeed) {
    return false;
  }

  const nextKeys = new Set(existingKeys);
  for (const key of defaultKeys) {
    if (!actualKeys.has(key)) {
      nextKeys.delete(key);
    }
  }
  for (const key of actualKeys) {
    nextKeys.add(key);
  }

  appState = {
    ...appState,
    gameState: {
      ...appState.gameState,
      runtime: {
        ...appState.gameState.runtime,
        mapExplorationByMapId: {
          ...(appState.gameState.runtime.mapExplorationByMapId ?? {}),
          [mapDefinition.id]: {
            revealedHexKeys: Array.from(nextKeys).sort(),
            revealingHexStartedAtMsByKey: Object.fromEntries(
              Object.entries(explorationState.revealingHexStartedAtMsByKey).filter(
                ([key]) => nextKeys.has(key)
              )
            ),
          },
        },
      },
    },
  };
  return true;
}

function ensureCurrentCampaignRevealForCoordinateSystem(
  coordinateSystem: HexCoordinateSystem | null
): boolean {
  if (coordinateSystem == null) {
    return false;
  }

  const didRealignOpeningReveal =
    realignCurrentCampaignOpeningRevealSeed(coordinateSystem);
  const nextAppState = revealCampaignMapAroundAppCoordinate(
    appState,
    appState.playerCoordinate,
    {
      animateNewHexes: false,
      coordinateSystem,
    }
  );
  if (nextAppState !== appState) {
    appState = nextAppState;
    return true;
  }

  return didRealignOpeningReveal;
}

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
}

const selectableCharacters = selectPlayableCharacters(
  activeContentContext.gameContent.characters,
  selectableCharacterIds
);
for (const characterId of selectableCharacterIds) {
  assertExists(
    activeContentContext.gameContent.characterDefinitionById[characterId],
    `Selectable character not found for id "${characterId}".`
  );
}

let currentPlayerCharacterId = defaultPlayerCharacterId;

const BATTLE_UI_EDITOR_STORAGE_KEY = "rpg_tg_battle_ui_values_v1";
const LEGACY_BATTLE_UI_EDITOR_VALUE_FIXES: Partial<
  Record<
    BattleUiEditorVariableName,
    {
      oldValue: string;
      newValue: string;
    }
  >
> = {
  "--battle-action-menu-width": {
    oldValue: "29.75%",
    newValue: "6.75%",
  },
  "--battle-action-menu-height": {
    oldValue: "26.85%",
    newValue: "17.7%",
  },
};

function normalizePersistedBattleUiEditorValue(
  name: BattleUiEditorVariableName,
  value: string
): string {
  const legacyFix = LEGACY_BATTLE_UI_EDITOR_VALUE_FIXES[name];
  if (legacyFix == null) {
    return value;
  }

  return value === legacyFix.oldValue ? legacyFix.newValue : value;
}

function loadPersistedBattleUiEditorValues(): Partial<BattleUiEditorValues> {
  try {
    const raw = window.localStorage.getItem(BATTLE_UI_EDITOR_STORAGE_KEY);
    if (raw == null) {
      return {};
    }
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const entries = battleUiEditorVariableDefinitions.flatMap((definition) => {
      const value = parsed[definition.name];
      return typeof value === "string"
        ? [
            [
              definition.name,
              normalizePersistedBattleUiEditorValue(definition.name, value),
            ] as const,
          ]
        : [];
    });
    return Object.fromEntries(entries) as Partial<BattleUiEditorValues>;
  } catch {
    return {};
  }
}

function persistBattleUiEditorValues(values: BattleUiEditorValues): void {
  try {
    window.localStorage.setItem(
      BATTLE_UI_EDITOR_STORAGE_KEY,
      JSON.stringify(values)
    );
  } catch {
    // Best-effort editor persistence; live defaults still apply.
  }
}

function applyPersistedBattleUiEditorValues(nextState: AppState): AppState {
  const mergedValues: BattleUiEditorValues = {
    ...nextState.layoutEditor.battleUiValues,
  };
  const persistedValues = loadPersistedBattleUiEditorValues();
  for (const definition of battleUiEditorVariableDefinitions) {
    const value = persistedValues[definition.name];
    if (typeof value === "string") {
      mergedValues[definition.name] = value;
    }
  }
  persistBattleUiEditorValues(mergedValues);
  return {
    ...nextState,
    layoutEditor: {
      ...nextState.layoutEditor,
      battleUiValues: mergedValues,
    },
  };
}

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

let appState: AppState = applyPersistedBattleUiEditorValues(
  createPrototypeAppState(currentPlayerCharacterId)
);
let coinRewardDisplayValue: number | null = null;
let coinRewardAnchorEditorState = {
  isOpen: false,
  actualOffsetX: -151,
  actualOffsetY: 25,
  draftOffsetX: -151,
  draftOffsetY: 25,
};
let coinRewardAnimatorInstance: ReturnType<typeof createCoinRewardAnimator> | null =
  null;
const coinRewardAnimator = {
  play(input: Parameters<ReturnType<typeof createCoinRewardAnimator>["play"]>[0]) {
    getCoinRewardAnimator().play(input);
  },
};
let nextCityCardDrawTestSessionId = 0;
let cityCardDrawOverlayRuntime: CityCardDrawOverlayRuntime | null = null;
let cityBeggingDefaultFortuneRuntime: CityBeggingDefaultFortuneRuntime | null = null;
let pachinkoFortuneCardDrawRuntime: PachinkoFortuneCardDrawRuntime | null = null;
let campaignMapDebugState: CampaignMapDebugState = {
  ...INITIAL_CAMPAIGN_MAP_DEBUG_STATE,
};
let campaignMapDebugHomeState: CampaignMapDebugState = {
  ...INITIAL_CAMPAIGN_MAP_DEBUG_STATE,
};
let campaignTerrainStyleState: CampaignTerrainStyle = {
  ...DEFAULT_CAMPAIGN_TERRAIN_STYLE,
};
let campaignCloudTextureScaleBoostState = DEFAULT_CAMPAIGN_CLOUD_TEXTURE_SCALE_BOOST;
let isGameVisible = false;
let hasAppliedInitialCampaignMapDebug = false;
let hasStartedInitialCampaignMapDebugAnimation = false;
let initialCampaignMapDebugAnimationFrame: number | null = null;
let initialCampaignMapDebugAnimationStartTime: number | null = null;
let initialMapIntroStoryTriggerTimeoutId: number | null = null;
let campaignMapZoomAnimationState: CampaignMapZoomAnimationState | null = null;
let campaignMapZoomCloudResumeTimeoutId: number | null = null;
let activeMapIntroOverlay: HTMLElement | null = null;
let storyChapterTitleAutoAdvanceTimeoutId: number | null = null;
let pendingInitialCampaignMapIntroTerrainReady = false;
let cityStageDomRuntimeHandle: {
  cityId: string;
  attach(root: HTMLElement): void;
  destroy(): void;
} | null = null;
let dialogueTypewriterRuntimeHandle: {
  destroy(): void;
} | null = null;
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
let recentPointerDispatchedActivityAction:
  | {
      action: string;
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
let activityQteIntervalMs: number | null = null;
let campaignTravelRequestId = 0;
let loadingScreenAnimationFrameId: number | null = null;
let loadingScreenRequestId = 0;
let activeLoadingScreenElement: HTMLElement | null = null;
let activeLoadingTheme: LoadingTheme | null = null;
const mapAutoAdvanceHandles: Record<string, number> = {};

function getPlayerCharacter(
  state: AppState,
  playerCharacterId: string
): CharacterDefinition {
  const playerCharacter = state.characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === playerCharacterId
  );
  assertExists(
    playerCharacter,
    `Player character not found for id "${playerCharacterId}".`
  );
  return playerCharacter;
}

function getCoinRewardAnimator(): ReturnType<typeof createCoinRewardAnimator> {
  if (coinRewardAnimatorInstance == null) {
    const coinRewardLayer = document.querySelector<HTMLElement>(
      "[data-ui-coin-reward-layer]"
    );
    assertExists(coinRewardLayer, "Missing coin reward animation layer.");
    coinRewardAnimatorInstance = createCoinRewardAnimator({
      layer: coinRewardLayer,
      onDisplayValueChange(value) {
        coinRewardDisplayValue = value;
        syncCoinRewardGoldDisplay();
      },
    });
  }

  coinRewardAnimatorInstance.setGoldTargetElement(
    document.querySelector<HTMLElement>("[data-ui-gold-target]")
  );

  return coinRewardAnimatorInstance;
}

function syncCoinRewardAnimatorTarget(): void {
  coinRewardAnimatorInstance?.setGoldTargetElement(
    document.querySelector<HTMLElement>("[data-ui-gold-target]")
  );
}

function syncCoinRewardGoldDisplay(): void {
  const goldValueElement = document.querySelector<HTMLElement>("[data-ui-gold-value]");
  if (goldValueElement == null) {
    return;
  }

  const resolvedGoldValue =
    coinRewardDisplayValue ??
    getPlayerCharacter(appState, currentPlayerCharacterId).stats.gold;
  goldValueElement.textContent = `银两 ${resolvedGoldValue}`;
}

function destroyCityCardDrawOverlayRuntime(): void {
  if (cityCardDrawOverlayRuntime == null) {
    return;
  }

  cityCardDrawOverlayRuntime.animator.destroy();
  cityCardDrawOverlayRuntime = null;
}

function syncCityCardDrawTestOverlayView(
  overlay: ParentNode,
  resultValue: number | null
): void {
  const resultLabelElement = overlay.querySelector<HTMLElement>(
    "[data-city-card-draw-result-label]"
  );
  if (resultLabelElement != null) {
    resultLabelElement.textContent =
      resultValue == null
        ? "\u70b9\u51fb\u5361\u724c\u5f00\u59cb\u62bd\u53d6\uff0c\u8fd4\u56de 1-6 \u7684\u6d4b\u8bd5\u7ed3\u679c\u3002"
        : `\u672c\u6b21\u7ed3\u679c\u4e3a ${formatCardDrawResultLabel(resultValue)} (${resultValue})`;
  }

  const confirmButton = overlay.querySelector<HTMLButtonElement>(
    "[data-action='confirm-city-card-draw-test']"
  );
  if (confirmButton != null) {
    confirmButton.hidden = resultValue == null;
  }
}

function syncCityCardDrawTestOverlay(): void {
  const overlay = appRoot.querySelector<HTMLElement>("[data-city-card-draw-overlay]");
  const currentState = appState.cityCardDrawTestState;
  if (overlay == null || currentState == null) {
    destroyCityCardDrawOverlayRuntime();
    return;
  }

  syncCityCardDrawTestOverlayView(overlay, currentState.resultValue);

  const mount = overlay.querySelector<HTMLElement>("[data-city-card-draw-mount]");
  assertExists(mount, "Missing city card draw overlay mount.");
  const hasMatchingRuntime =
    cityCardDrawOverlayRuntime != null &&
    cityCardDrawOverlayRuntime.sessionId === currentState.sessionId &&
    cityCardDrawOverlayRuntime.mount === mount &&
    cityCardDrawOverlayRuntime.overlay === overlay;

  if (currentState.resultValue != null) {
    if (!hasMatchingRuntime) {
      destroyCityCardDrawOverlayRuntime();
    }
    return;
  }

  if (!hasMatchingRuntime) {
    destroyCityCardDrawOverlayRuntime();
    mount.replaceChildren();
    cityCardDrawOverlayRuntime = {
      overlay,
      mount,
      sessionId: currentState.sessionId,
      animator: new CardDrawAnimator({
        host: mount,
        stackCount: 5,
        cardWidthPx: 146,
        cardHeightPx: 192,
        clickHintText: "\u70b9\u51fb\u62bd\u53d6",
        busyHintText: "\u62bd\u53d6\u4e2d...",
      }),
      hasStarted: false,
    };
  }

  const runtime = cityCardDrawOverlayRuntime;
  if (runtime == null || runtime.hasStarted) {
    return;
  }

  runtime.hasStarted = true;
  const activeSessionId = currentState.sessionId;
  void runtime.animator
    .play()
    .then((value) => {
      const latestState = appState.cityCardDrawTestState;
      if (latestState == null || latestState.sessionId !== activeSessionId) {
        return;
      }

      appState = {
        ...appState,
        cityCardDrawTestState: {
          ...latestState,
          resultValue: value,
        },
      };
      syncCityCardDrawTestOverlayView(overlay, value);
    })
    .catch(() => {});
}

function destroyCityBeggingDefaultFortuneRuntime(): void {
  if (cityBeggingDefaultFortuneRuntime == null) {
    return;
  }

  cityBeggingDefaultFortuneRuntime.animator.destroy();
  cityBeggingDefaultFortuneRuntime = null;
}

function destroyPachinkoFortuneCardDrawRuntime(): void {
  if (pachinkoFortuneCardDrawRuntime == null) {
    return;
  }

  pachinkoFortuneCardDrawRuntime.animator.destroy();
  pachinkoFortuneCardDrawRuntime = null;
}

function getPachinkoFortuneCardDrawLabel(mount: HTMLElement): string {
  const label = mount.dataset.pachinkoFortuneCardLabel;
  return label == null || label.length === 0 ? "运势" : label;
}

function dispatchPachinkoFortuneCardDrawAction(mount: HTMLElement): void {
  const dispatchKind = mount.dataset.pachinkoFortuneCardDispatch;
  const actionId = mount.dataset.pachinkoFortuneCardActionId;
  if (dispatchKind === "house" && actionId != null && actionId.length > 0) {
    dispatchHouseRuntimeRequest(houseRuntime, {
      type: "action",
      actionId,
    });
    return;
  }

  if (dispatchKind === "activity") {
    dispatchCurrentActivityQteAction("play");
  }
}

function isPachinkoFortuneCardDrawMountActive(mount: HTMLElement): boolean {
  const overlay = mount.closest<HTMLElement>(
    "[data-activity-overlay='pachinko-fortune-card'], [data-house-overlay='pachinko-fortune-card']"
  );
  const cardRoot = mount.closest<HTMLElement>(
    "[data-pachinko-fortune-card-state]"
  );

  return (
    overlay != null &&
    appRoot.contains(overlay) &&
    cardRoot?.dataset.pachinkoFortuneCardState === "drawing-card"
  );
}

function triggerPachinkoFortuneCardDrawFromElement(element: HTMLElement): boolean {
  const pachinkoFortuneCardClickProxy = element.closest<HTMLElement>(
    "[data-pachinko-fortune-card-click-proxy]"
  );
  if (pachinkoFortuneCardClickProxy == null) {
    return false;
  }

  syncPachinkoFortuneCardDrawOverlay();
  pachinkoFortuneCardDrawRuntime?.animator.trigger();
  return true;
}

function syncPachinkoFortuneCardDrawOverlay(): void {
  const overlay = appRoot.querySelector<HTMLElement>(
    "[data-activity-overlay='pachinko-fortune-card'], [data-house-overlay='pachinko-fortune-card']"
  );
  const mount = overlay?.querySelector<HTMLElement>(
    "[data-pachinko-fortune-card-mount]"
  );

  if (
    overlay == null ||
    mount == null ||
    !isPachinkoFortuneCardDrawMountActive(mount)
  ) {
    destroyPachinkoFortuneCardDrawRuntime();
    return;
  }

  const drawKey = mount.dataset.pachinkoFortuneCardDrawKey ?? "pachinko-fortune-card";
  const hasMatchingRuntime =
    pachinkoFortuneCardDrawRuntime != null &&
    pachinkoFortuneCardDrawRuntime.overlay === overlay &&
    pachinkoFortuneCardDrawRuntime.mount === mount &&
    pachinkoFortuneCardDrawRuntime.drawKey === drawKey;

  if (!hasMatchingRuntime) {
    destroyPachinkoFortuneCardDrawRuntime();
    mount.replaceChildren();
    const fortuneCardDrawLabel = getPachinkoFortuneCardDrawLabel(mount);
    pachinkoFortuneCardDrawRuntime = {
      overlay,
      mount,
      drawKey,
      animator: new CardDrawAnimator({
        host: mount,
        values: [0],
        resolveValue: () => 0,
        resultFormatter: () => fortuneCardDrawLabel,
        resultHintFormatter: () => "运势已定",
        stackCount: 5,
        cardWidthPx: 146,
        cardHeightPx: 192,
        clickHintText: "点击抽取运势卡",
        busyHintText: "抽取中...",
      }),
      hasStarted: false,
    };
  }

  const runtime = pachinkoFortuneCardDrawRuntime;
  if (runtime == null || runtime.hasStarted) {
    return;
  }

  runtime.hasStarted = true;
  void runtime.animator
    .play({
      values: [0],
      resolveValue: () => 0,
      resultFormatter: () => getPachinkoFortuneCardDrawLabel(runtime.mount),
      resultHintFormatter: () => "运势已定",
      questionLabel: "?",
      clickHintText: "点击抽取运势卡",
      busyHintText: "抽取中...",
    })
    .then(() => {
      if (!isPachinkoFortuneCardDrawMountActive(runtime.mount)) {
        return;
      }

      dispatchPachinkoFortuneCardDrawAction(runtime.mount);
    })
    .catch(() => {});
}

function getCityBeggingFortuneValue(result: string | null | undefined): number {
  switch (result) {
    case "ji":
      return 2;
    case "ping":
      return 1;
    case "xiong":
      return 0;
    default:
      return 1;
  }
}

function formatCityBeggingFortuneValue(value: number): string {
  switch (value) {
    case 2:
      return "吉";
    case 1:
      return "平";
    case 0:
      return "凶";
    default:
      return "?";
  }
}

function dispatchCityBeggingDefaultAction(
  action: string,
  payload?: Record<string, unknown>
): void {
  const sourceState = appState;
  appState = commitRuntimeRequest({
    state: sourceState,
    request: createPlayableActionRequest("aibegging", action, payload),
    context: {
      router: {
        route: ({ state, request }) =>
          runInteractiveRuntime({
            state,
            request,
            characterDefinitions: sourceState.characterDefinitions,
            playerCharacterId: currentPlayerCharacterId,
          }),
      },
    },
  }).state;
}

function scheduleCityBeggingDefaultThinkingTick(): void {
  window.setTimeout(() => {
    dispatchCityBeggingDefaultAction("tick", {
      now: performance.now() + 3000,
    });
    renderApp();
  }, 2400);
}

function syncCityBeggingDefaultDialogueOverlay(): void {
  const overlay = appRoot.querySelector<HTMLElement>(
    "[data-city-begging-default-overlay]"
  );
  const mount = overlay?.querySelector<HTMLElement>(
    "[data-city-begging-fortune-mount]"
  );
  const currentState = appState.beggingMiniGameState;
  const isFortuneDraw =
    currentState != null &&
    "mode" in currentState &&
    currentState.mode === "default-dialogue" &&
    currentState.phase === "fortune-draw" &&
    currentState.fixedResult != null;

  if (overlay == null || mount == null || !isFortuneDraw) {
    destroyCityBeggingDefaultFortuneRuntime();
    return;
  }

  const drawKey = [
    currentState.selectedLocationId ?? "",
    currentState.selectedOptionId ?? "",
    currentState.fixedResult,
  ].join(":");
  const hasMatchingRuntime =
    cityBeggingDefaultFortuneRuntime != null &&
    cityBeggingDefaultFortuneRuntime.overlay === overlay &&
    cityBeggingDefaultFortuneRuntime.mount === mount &&
    cityBeggingDefaultFortuneRuntime.drawKey === drawKey;

  if (!hasMatchingRuntime) {
    destroyCityBeggingDefaultFortuneRuntime();
    mount.replaceChildren();
    cityBeggingDefaultFortuneRuntime = {
      overlay,
      mount,
      drawKey,
      animator: new CardDrawAnimator({
        host: mount,
        values: [0, 1, 2],
        resolveValue: () => getCityBeggingFortuneValue(currentState.fixedResult),
        resultFormatter: formatCityBeggingFortuneValue,
        resultHintFormatter: (_value, label) => `本次结果：${label}`,
        stackCount: 5,
        cardWidthPx: 146,
        cardHeightPx: 192,
        clickHintText: "点击抽取吉凶平",
        busyHintText: "抽取中...",
      }),
      hasStarted: false,
    };
  }

  const runtime = cityBeggingDefaultFortuneRuntime;
  if (runtime == null || runtime.hasStarted) {
    return;
  }

  runtime.hasStarted = true;
  void runtime.animator
    .play({
      values: [0, 1, 2],
      resolveValue: () => getCityBeggingFortuneValue(currentState.fixedResult),
      resultFormatter: formatCityBeggingFortuneValue,
      resultHintFormatter: (_value, label) => `本次结果：${label}`,
      questionLabel: "?",
      clickHintText: "点击抽取吉凶平",
      busyHintText: "抽取中...",
    })
    .then(() => {
      const latestState = appState.beggingMiniGameState;
      if (
        latestState == null ||
        !("mode" in latestState) ||
        latestState.mode !== "default-dialogue" ||
        latestState.phase !== "fortune-draw"
      ) {
        return;
      }

      dispatchCityBeggingDefaultAction("confirm-fortune");
      renderApp();
      scheduleCityBeggingDefaultThinkingTick();
    })
    .catch(() => {});
}

function playCoinRewardFlight(input: {
  playerCharacterId: string;
  delta: number;
  sourceElement: HTMLElement;
  sourceClientX?: number;
  sourceClientY?: number;
}): void {
  if (input.delta <= 0) {
    return;
  }

  const targetValue = getPlayerCharacter(appState, input.playerCharacterId).stats.gold;
  const startValue = targetValue - input.delta;
  coinRewardDisplayValue = startValue;
  syncCoinRewardGoldDisplay();

  window.requestAnimationFrame(() => {
    coinRewardAnimator.play({
      sourceElement: input.sourceElement,
      ...(input.sourceClientX == null
        ? {}
        : { sourceClientX: input.sourceClientX }),
      ...(input.sourceClientY == null
        ? {}
        : { sourceClientY: input.sourceClientY }),
      startValue,
      targetValue,
      amount: input.delta,
    });
  });
}

function isCoinRewardAnchorEditorDirty(): boolean {
  return (
    coinRewardAnchorEditorState.actualOffsetX !== coinRewardAnchorEditorState.draftOffsetX ||
    coinRewardAnchorEditorState.actualOffsetY !== coinRewardAnchorEditorState.draftOffsetY
  );
}

function syncCoinRewardAnchorEditor(): void {
  const animator = getCoinRewardAnimator();
  animator.setTargetOffset(
    coinRewardAnchorEditorState.actualOffsetX,
    coinRewardAnchorEditorState.actualOffsetY
  );
  animator.setPreviewTargetOffset(
    coinRewardAnchorEditorState.isOpen
      ? coinRewardAnchorEditorState.draftOffsetX
      : coinRewardAnchorEditorState.actualOffsetX,
    coinRewardAnchorEditorState.isOpen
      ? coinRewardAnchorEditorState.draftOffsetY
      : coinRewardAnchorEditorState.actualOffsetY
  );
}

function syncCoinRewardAnchorEditorView(): void {
  const editorElement = document.querySelector<HTMLElement>("[data-ui-coin-anchor-editor]");
  if (editorElement == null) {
    return;
  }

  const isDirty = isCoinRewardAnchorEditorDirty();
  editorElement.classList.toggle("is-open", coinRewardAnchorEditorState.isOpen);
  editorElement.dataset.uiCoinAnchorEditorOpen = coinRewardAnchorEditorState.isOpen
    ? "true"
    : "false";
  editorElement.dataset.uiCoinAnchorEditorDirty = isDirty ? "true" : "false";

  const xInput = editorElement.querySelector<HTMLInputElement>(
    "[data-ui-coin-anchor-input='x']"
  );
  const yInput = editorElement.querySelector<HTMLInputElement>(
    "[data-ui-coin-anchor-input='y']"
  );
  if (xInput != null && document.activeElement !== xInput) {
    xInput.value = String(coinRewardAnchorEditorState.draftOffsetX);
  }
  if (yInput != null && document.activeElement !== yInput) {
    yInput.value = String(coinRewardAnchorEditorState.draftOffsetY);
  }

  editorElement
    .querySelectorAll<HTMLButtonElement>(
      "[data-action='confirm-coin-anchor-editor'], [data-action='revert-coin-anchor-editor']"
    )
    .forEach((button) => {
      button.disabled = !isDirty;
      button.classList.toggle(
        "p-global-coin-anchor-editor__action--active",
        isDirty
      );
    });

  const toggleButton = document.querySelector<HTMLElement>(
    "[data-action='toggle-coin-anchor-editor']"
  );
  if (toggleButton != null) {
    toggleButton.setAttribute(
      "aria-expanded",
      coinRewardAnchorEditorState.isOpen ? "true" : "false"
    );
  }
}

let houseRuntime: HouseRuntimeBridge = createHouseRuntimeInstance();
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
    sceneDefinitionsById: activeContentContext.storyContent.sceneDefinitionsById,
    eventBindingsById: activeContentContext.storyContent.eventBindingsById,
    activityDefinitionsById:
      activeContentContext.storyContent.activityDefinitionsById,
    settlementDefinitionsById:
      activeContentContext.storyContent.settlementDefinitionsById,
    progressTrackDefinitionsById:
      activeContentContext.storyContent.progressTrackDefinitionsById,
    progressTrackBindingsById:
      activeContentContext.storyContent.progressTrackBindingsById,
    cityDefinitionsById: activeContentContext.storyContent.cityDefinitionsById,
    houseDefinitionsById:
      activeContentContext.storyContent.houseDefinitionsById,
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
const navigationTimeFollowUp = createNavigationTimeFollowUpBridge({
  getCharacterDefinitions: () => appState.characterDefinitions,
  getHouseDefinitions: () => activeContentContext.houses,
  getAppState: () => appState as NavigationTimeFollowUpAppState,
  getStoryContent: () => ({
    eventDefinitionsById: activeContentContext.storyContent.eventDefinitionsById,
    sceneDefinitionsById: activeContentContext.storyContent.sceneDefinitionsById,
    eventBindingsById: activeContentContext.storyContent.eventBindingsById,
    activityDefinitionsById:
      activeContentContext.storyContent.activityDefinitionsById,
    settlementDefinitionsById:
      activeContentContext.storyContent.settlementDefinitionsById,
    progressTrackDefinitionsById:
      activeContentContext.storyContent.progressTrackDefinitionsById,
    progressTrackBindingsById:
      activeContentContext.storyContent.progressTrackBindingsById,
    cityDefinitionsById: activeContentContext.storyContent.cityDefinitionsById,
    houseDefinitionsById:
      activeContentContext.storyContent.houseDefinitionsById,
    textEntriesById: activeContentContext.storyContent.textEntriesById,
  }),
});
let appAudioSession = createAppAudioSession();
let lastPachinkoCollisionAudioToken: number | null = null;
const STATIC_AUDIO_ASSET_URLS: Readonly<Partial<Record<string, string>>> = {
  "audio/ui/button-light.mp3": buttonLightAudioUrl,
  "audio/ui/button-heavy.mp3": buttonHeavyAudioUrl,
  "audio/ui/enter.mp3": enterAudioUrl,
  "audio/ui/troop-selection.mp3": troopSelectionAudioUrl,
  "audio/ui/troop-mutation.mp3": troopMutationAudioUrl,
  "audio/activity/pachinko-launch.mp3": pachinkoLaunchAudioUrl,
  "audio/activity/pachinko-bounce-1.mp3": pachinkoBounce1AudioUrl,
  "audio/activity/pachinko-bounce-2.mp3": pachinkoBounce2AudioUrl,
  "audio/game-events/money.mp3": gameMoneyAudioUrl,
  "audio/game-events/task-victory.mp3": taskVictoryAudioUrl,
  "audio/game-events/task-failure.mp3": taskFailureAudioUrl,
  "audio/battle/slash-hit-1.mp3": battleSlashHit1AudioUrl,
  "audio/battle/slash-hit-2.mp3": battleSlashHit2AudioUrl,
  "audio/battle/slash-hit-3.mp3": battleSlashHit3AudioUrl,
  "audio/battle/slash-miss.mp3": battleSlashMissAudioUrl,
  "audio/battle/bow-draw.mp3": battleBowDrawAudioUrl,
  "audio/battle/arrow-release.mp3": battleArrowReleaseAudioUrl,
  "audio/battle/jump.mp3": battleJumpAudioUrl,
  "audio/battle/landing.mp3": battleLandingAudioUrl,
  "audio/battle/horse-run.mp3": battleHorseRunAudioUrl,
  "audio/battle/musketeer-reload.mp3": battleMusketeerReloadAudioUrl,
  "audio/battle/musketeer-fire.mp3": battleMusketeerFireAudioUrl,
  "audio/battle/impact.mp3": battleImpactAudioUrl,
  "audio/battle/battle-bgm.mp3": battleBgmAudioUrl,
  "audio/battle/battle-victory.mp3": battleVictoryAudioUrl,
};
const appAudioController = createAppAudioController({
  resolveAssetPath: (assetPath) =>
    STATIC_AUDIO_ASSET_URLS[assetPath] ??
    BUILTIN_AUDIO_ASSET_URLS[assetPath] ??
    new URL(`../${assetPath}`, import.meta.url).href,
});
const mainUiFlow = new MainUiFlow({
  overlayRoot: uiOverlayElement,
  characters: selectableCharacters,
  scenarioPacks: builtInScenarioPacks,
  onStartGame: startMainGameWithLoading,
  onContinueGame: startContinueGameWithLoading,
  onStartScenarioPack: startScenarioPackWithLoading,
  onImportScenarioPackFiles: startScenarioPackFilesWithLoading,
  onQueueButtonSound: queueButtonSoundEffect,
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
    activeContentContext.mapDefinitionById["map.yuanmo_campaign"] ??
    activeContentContext.maps[0];
  const defaultCityDefinition =
    activeContentContext.cityDefinitionById["city.huangcun"] ??
    activeContentContext.cities[0];
  assertExists(defaultMapDefinition, "Missing default map definition.");
  assertExists(defaultCityDefinition, "Missing default city definition.");
  const initialRuntime =
    playerCharacterId === defaultPlayerCharacterId
      ? {
          variables: {
            "var.story.zhu_yuanzhang.stage": "village-opening",
          },
        }
      : {
          variables: {
            [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage]:
              ZHU_YUANZHANG_STORY_STAGES.guoZixingCamp,
          },
        };
  let nextAppState: AppState = {
    gameState: ensureCityNpcPoolsForCurrentDay(
      createInitialState({
        currentMapId: defaultMapDefinition.id,
        currentCityId: defaultCityDefinition.id,
        currentHouseId: null,
        playerCharacterId,
        chapterId: "chapter.prototype",
        year: 1448,
        month: 1,
        day: 1,
        pinnedCharacterId: playerCharacterId,
        reviewDateText: formatCouncilStatusText(40),
        mainHouseMissionText: getRuntimeText(
          "runtime.zhu_yuanzhang.prototype.main_mission.review_hall",
        ),
        cards: {
          ownedCardIds: activeContentContext.cards.map(
            (cardDefinition) => cardDefinition.id
          ),
          selectedCardId: activeContentContext.cards[0]?.id ?? null,
        },
        valuables: {
          items: activeContentContext.gameContent.valuables,
          selectedItemId: activeContentContext.gameContent.valuables[0]?.id ?? null,
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
        initialRuntime,
        currentView: "map",
      }),
      activeContentContext.cityNpcPools
    ),
    characterDefinitions: activeContentContext.gameContent.characters,
    playerCoordinate:
      activeContentContext.cityCoordinatesById[defaultCityDefinition.id] ??
      defaultMapDefinition.initialPlayerCoordinate ??
      { x: 0, y: 0 },
    campaignActorState: {
      facingDegrees: 0,
      isMoving: false,
    },
    campaignTravelState: null,
    modalState: null,
    locationDialogueState: null,
    beggingMiniGameState: null,
    cityCardDrawTestState: null,
    cityMenuState: null,
    cityDirectoryState: null,
    autoAdvanceState: null,
    uiLayouts: {
      "global-hud": createDefaultGlobalHudLayout(),
      "start-screen": createDefaultStartScreenLayout(),
      "character-select-screen": createDefaultCharacterSelectScreenLayout(),
      "character-detail-screen": createDefaultCharacterDetailScreenLayout(),
      "battle-ui-screen": createDefaultBattleUiScreenLayout(),
    },
    layoutEditor: {
      isOpen: false,
      selectedTargetId: "global-hud",
      selectedComponentId: "status-board",
      selectedElementId: null,
      backgroundAssetQuery: "",
      battleUiValues: createDefaultBattleUiEditorValues(),
    },
  };
  nextAppState = {
    ...nextAppState,
    gameState: revealCampaignMapHexesForCoordinate(
      nextAppState.gameState,
      defaultMapDefinition,
      nextAppState.playerCoordinate
    ),
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

function syncCityMapBuildingLabelHover(
  labelElement: HTMLElement,
  isHovered: boolean
): void {
  const buildingId = labelElement.dataset.cityMapBuildingLabelId;
  if (buildingId == null) {
    return;
  }

  const cityMapStage = labelElement.closest<HTMLElement>(".c-city-map-stage");
  const buildingGroup = cityMapStage?.querySelector<HTMLElement>(
    `[data-city-map-building-group-id="${CSS.escape(buildingId)}"]`
  );
  buildingGroup?.classList.toggle("is-hovered", isHovered);
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

  const cityHouseIds = new Set(cityDefinition.houseIds);
  const activeCityHouseDefinitions = activeContentContext.houses.filter((houseDefinition) => {
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
  const cityEntries = activeContentContext.cityEntries.filter(
    (cityEntry) =>
      cityEntry.cityId === cityDefinition.id &&
      isCityEntryVisibleForStoryStage(appState.gameState, cityEntry)
  );
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

  if (panelId === "begging") {
    openCityBeggingDefault();
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
    cityCardDrawTestState: null,
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
    state: createRuntimeBridgeState(appState),
    previousGameState,
    houseDefinitions: activeContentContext.houses,
    textEntriesById: activeContentContext.textEntriesById,
    councilArrivalNotice,
  });
  if (!followUp.handled) {
    return false;
  }

  appState = applyRuntimeBridgeState(appState, followUp.state);
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

function showCouncilInsufficientTimeDialogue(): void {
  appState = {
    ...closeCityMenu(closeCityDirectory(appState)),
    beggingMiniGameState: null,
    locationDialogueState: {
      type: "house-access-refusal",
      speakerCharacterId: appState.gameState.player.characterId,
      textLines: [COUNCIL_INSUFFICIENT_TIME_DIALOGUE_TEXT],
      advanceHintText: "返回评定地点",
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
        speakerCharacterId: currentPlayerCharacterId,
        textLines: [
          getRuntimeText(
            "runtime.zhu_yuanzhang.begging_stamina_refusal.001"
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
    showCouncilInsufficientTimeDialogue();
    return;
  }

  stopCityBeggingMiniGameLoop();
  const launchState = {
    ...closeCityMenu(closeCityDirectory(appState)),
    locationDialogueState: null,
  };
  appState = commitRuntimeRequest({
    state: launchState,
    request: createLaunchPlayableRequest("city-begging", {
      payload: { now: performance.now() },
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
  }).state;
  renderApp();
  startCityBeggingMiniGameLoop();
}

function openCityBeggingDefault(): void {
  stopCityBeggingMiniGameLoop();
  destroyCityBeggingDefaultFortuneRuntime();
  if (isHaozhouEvacuatedDuringBeggingJourney(appState.gameState)) {
    appState = {
      ...closeCityMenu(closeCityDirectory(appState)),
      beggingMiniGameState: null,
      locationDialogueState: {
        type: "house-access-refusal",
        speakerCharacterId: currentPlayerCharacterId,
        textLines: [
          getRuntimeText(
            "runtime.zhu_yuanzhang.haozhou_evacuation.001"
          ),
        ],
        advanceHintText: getRuntimeText(
          "runtime.zhu_yuanzhang.haozhou_evacuation.advance_hint"
        ),
      },
    };
    renderApp();
    return;
  }

  if (appState.gameState.runtime.flags["flag.city_begging.default.completed"] === true) {
    appState = {
      ...closeCityMenu(closeCityDirectory(appState)),
      beggingMiniGameState: null,
      locationDialogueState: {
        type: "house-access-refusal",
        speakerCharacterId: currentPlayerCharacterId,
        textLines: [
          getRuntimeText(
            "runtime.city_begging.default.completed_refusal.001"
          ),
        ],
        advanceHintText: "回寺",
      },
    };
    renderApp();
    return;
  }

  const launchState = {
    ...closeCityMenu(closeCityDirectory(appState)),
    locationDialogueState: null,
  };
  appState = commitRuntimeRequest({
    state: launchState,
    request: createLaunchPlayableRequest("aibegging", {
      payload: { now: performance.now() },
    }),
    context: {
      router: {
        route: ({ state, request }) =>
          runInteractiveRuntime({
            state,
            request,
            characterDefinitions: launchState.characterDefinitions,
            playerCharacterId: currentPlayerCharacterId,
          }),
      },
    },
  }).state;
  renderApp();
}

function createHouseRuntimeInstance(): HouseRuntimeBridge {
  return createHouseRuntimeBridge({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp,
    playCoinReward: ({
      playerCharacterId,
      delta,
      sourceClientX,
      sourceClientY,
    }) => {
      playCoinRewardFlight({
        playerCharacterId,
        delta,
        sourceElement: appRoot,
        ...(sourceClientX == null ? {} : { sourceClientX }),
        ...(sourceClientY == null ? {} : { sourceClientY }),
      });
    },
    syncCouncilPriorityAfterGameStateChange,
    startMapAutoAdvance,
    stopMapAutoAdvance,
    houseDefinitions: activeContentContext.houses,
    playerCharacterId: currentPlayerCharacterId,
    eventDefinitionsById: activeContentContext.storyContent.eventDefinitionsById,
    sceneDefinitionsById: activeContentContext.storyContent.sceneDefinitionsById,
    eventBindingsById: activeContentContext.storyContent.eventBindingsById,
    activityDefinitionsById:
      activeContentContext.storyContent.activityDefinitionsById,
    settlementDefinitionsById:
      activeContentContext.storyContent.settlementDefinitionsById,
    progressTrackDefinitionsById:
      activeContentContext.storyContent.progressTrackDefinitionsById,
    progressTrackBindingsById:
      activeContentContext.storyContent.progressTrackBindingsById,
    cityDefinitionsById: activeContentContext.storyContent.cityDefinitionsById,
    houseDefinitionsById: activeContentContext.storyContent.houseDefinitionsById,
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
  const session = appState.gameState.runtime.activitySession;
  return session != null && session.type !== "result";
}

function stopActivityQteLoop(): void {
  if (activityQteIntervalHandle != null) {
    window.clearInterval(activityQteIntervalHandle);
    activityQteIntervalHandle = null;
  }
  activityQteIntervalMs = null;
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

function getFortuneBoardKindLabel(kind: string): string {
  switch (kind) {
    case "timing":
      return "天时";
    case "favorable":
      return "顺意";
    case "complete":
      return "周全";
    case "resonance":
      return "灵犀";
    case "rumor":
      return "奇闻";
    default:
      return "平";
  }
}

function renderFortuneBoardSummary(input: {
  baseScore: number;
  resonanceCount: number;
  rumorCount: number;
}): string {
  return [
    `<span>基础 ${input.baseScore}</span>`,
    "<span>天时/顺意/周全/平三连计奖</span>",
    input.resonanceCount > 0
      ? `<span>灵犀 +${input.resonanceCount * 3} 枚</span>`
      : "",
    input.rumorCount > 0 ? "<span>奇闻待触发</span>" : "",
  ].join("");
}

function createFortuneBoardRerollDelay(
  cellKey: string,
  rerollCount: number,
  salt: string
): string {
  let seed = Array.from(`${cellKey}:${rerollCount}:${salt}`).reduce(
    (result, char) => (result * 31 + char.charCodeAt(0)) >>> 0,
    2166136261
  );
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return `${(seed / 0x100000000).toFixed(3)}s`;
}

function syncRenderedFortuneBoardOverlay(): boolean {
  const session = appState.gameState.runtime.activitySession;
  if (session?.type !== "fortune-board") {
    return false;
  }

  const overlayElement = appRoot.querySelector<HTMLElement>(
    "[data-activity-overlay='fortune-board'], [data-house-overlay='fortune-board']"
  );
  if (overlayElement == null) {
    return false;
  }

  const gridElement = overlayElement.querySelector<HTMLElement>(
    ".c-fortune-board__grid"
  );
  if (gridElement == null) {
    return false;
  }

  gridElement.dataset.fortunePhase = session.phase;
  const metaElement = overlayElement.querySelector<HTMLElement>("[data-fortune-meta]");
  if (metaElement != null) {
    metaElement.textContent = `剩余 ${session.remainingPieces} 枚 · 本轮 ${session.wager} 枚 · 玩法分数 ${session.score} · 贡献值 +${session.score}`;
  }

  const summaryElement = overlayElement.querySelector<HTMLElement>(
    "[data-fortune-summary]"
  );
  if (summaryElement != null) {
    summaryElement.innerHTML = renderFortuneBoardSummary(session);
  }

  const speedInputElement = overlayElement.querySelector<HTMLInputElement>(
    "[data-fortune-speed-input]"
  );
  if (
    speedInputElement != null &&
    speedInputElement !== document.activeElement
  ) {
    speedInputElement.value = String(session.animationTickMs);
  }
  const speedValueElement = overlayElement.querySelector<HTMLElement>(
    "[data-fortune-speed-value]"
  );
  if (speedValueElement != null) {
    speedValueElement.textContent = `${session.animationTickMs}ms`;
  }

  const playButton = overlayElement.querySelector<HTMLButtonElement>(
    "[data-fortune-play-button]"
  );
  if (playButton != null) {
    playButton.textContent = session.phase === "scanning" ? "选定此列" : "游玩";
  }

  session.board.forEach((cell) => {
    const cellKey = `${cell.row}:${cell.column}`;
    const cellElement = gridElement.querySelector<HTMLElement>(
      `[data-fortune-cell-key='${cellKey}']`
    );
    if (cellElement == null) {
      return;
    }

    const isHighlighted = session.highlightedColumn === cell.column;
    const isColumnSelected = session.selectedColumn === cell.column;
    const isCellHighlighted = session.highlightedCellKey === cellKey;
    const isPicked = session.pickedCellKey === cellKey;
    const isPickFlashActive =
      session.phase === "cell-pick" &&
      isPicked &&
      session.flashTicks > 0 &&
      session.flashTicks % 2 === 0;
    const isNewSelection = session.selectedCellKeys.includes(cellKey);
    const isFinalSelectionFlash = session.phase === "final-flash" && cell.selected;
    const nextLabel = getFortuneBoardKindLabel(cell.kind);
    const labelElement = cellElement.querySelector<HTMLElement>(
      ".c-fortune-board__cell-label"
    );
    const previousKind = cellElement.dataset.fortuneKind ?? cell.kind;
    const previousLabel =
      cellElement.dataset.fortuneLabel ??
      labelElement?.textContent ??
      nextLabel;
    const previousRerollCount = Number(cellElement.dataset.fortuneRerollCount ?? "0");
    const shouldAnimateReroll =
      previousKind != null &&
      session.rerollCount > previousRerollCount &&
      !cell.selected &&
      !cellElement.classList.contains("is-rerolling");

    if (shouldAnimateReroll) {
      cellElement.dataset.fortunePreviousLabel = previousLabel;
      cellElement.dataset.fortuneNextLabel = nextLabel;
      cellElement.dataset.fortunePreviousKind = previousKind;
      cellElement.dataset.fortuneNextKind = cell.kind;
      cellElement.style.setProperty(
        "--fortune-reroll-out-delay",
        createFortuneBoardRerollDelay(cellKey, session.rerollCount, "out")
      );
      cellElement.style.setProperty(
        "--fortune-reroll-in-delay",
        createFortuneBoardRerollDelay(cellKey, session.rerollCount, "in")
      );
      cellElement.dataset.fortuneRerollCount = String(session.rerollCount);
      cellElement.classList.add("is-rerolling");
      window.setTimeout(() => {
        cellElement.classList.remove("is-rerolling");
        delete cellElement.dataset.fortunePreviousLabel;
        delete cellElement.dataset.fortuneNextLabel;
        delete cellElement.dataset.fortunePreviousKind;
        delete cellElement.dataset.fortuneNextKind;
        cellElement.dataset.fortuneKind = cell.kind;
        cellElement.dataset.fortuneLabel = nextLabel;
        cellElement.dataset.fortuneRerollCount = String(session.rerollCount);
        const settledLabelElement = cellElement.querySelector<HTMLElement>(
          ".c-fortune-board__cell-label"
        );
        if (settledLabelElement != null) {
          settledLabelElement.textContent = nextLabel;
        }
        [
          "timing",
          "favorable",
          "complete",
          "plain",
          "rumor",
          "resonance",
        ].forEach((kind) => cellElement.classList.remove(`is-kind-${kind}`));
        cellElement.classList.add(`is-kind-${cell.kind}`);
      }, 4100);
    } else if (!cellElement.classList.contains("is-rerolling")) {
      if (labelElement != null) {
        labelElement.textContent = nextLabel;
      }
      cellElement.dataset.fortuneKind = cell.kind;
      cellElement.dataset.fortuneLabel = nextLabel;
      cellElement.dataset.fortuneRerollCount = String(session.rerollCount);
    }

    const isRerolling = cellElement.classList.contains("is-rerolling");
    cellElement.className = [
      "c-fortune-board__cell",
      isRerolling ? "" : `is-kind-${cell.kind}`,
      isRerolling ? "is-rerolling" : "",
      cell.selected ? "is-selected" : "",
      isHighlighted ? "is-highlighted" : "",
      isColumnSelected ? "is-column-selected" : "",
      isCellHighlighted ? "is-cell-highlighted" : "",
      isPicked ? "is-picked" : "",
      isPickFlashActive ? "is-picked-flash" : "",
      isFinalSelectionFlash ? "is-final-selection-flash" : "",
      session.phase === "column-flash" &&
      session.flashTicks > 0 &&
      isColumnSelected &&
      session.flashTicks % 2 === 0
        ? "is-flashing-column"
        : "",
      isNewSelection ? "is-new-selection" : "",
    ]
      .filter(Boolean)
      .join(" ");
  });

  return true;
}

function getActivityQteLoopIntervalMs(): number {
  const session = appState.gameState.runtime.activitySession;
  if (session?.type === "pachinko-board") {
    return session.animationTickMs;
  }

  return session?.type === "fortune-board"
    ? session.animationTickMs
    : ACTIVITY_QTE_INTERVAL_MS;
}

function shouldRunActivityQteLoop(session: ActiveActivitySession): boolean {
  if (session?.type === "qte-bar") {
    return true;
  }

  if (session?.type === "pachinko-board") {
    return (
      session.phase === "ready" ||
      session.phase === "dropping" ||
      session.phase === "rewarding"
    );
  }

  return session?.type === "fortune-board" && session.phase !== "ready";
}

function syncActivityQteLoop(): void {
  const session = appState.gameState.runtime.activitySession;
  if (!shouldRunActivityQteLoop(session)) {
    stopActivityQteLoop();
    return;
  }

  const nextIntervalMs = getActivityQteLoopIntervalMs();
  if (
    activityQteIntervalHandle != null &&
    activityQteIntervalMs === nextIntervalMs
  ) {
    return;
  }
  if (activityQteIntervalHandle != null) {
    stopActivityQteLoop();
  }
  activityQteIntervalMs = nextIntervalMs;

  activityQteIntervalHandle = window.setInterval(() => {
    const activeSession = appState.gameState.runtime.activitySession;
    if (!shouldRunActivityQteLoop(activeSession)) {
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
              activityDefinitionsById:
                activeContentContext.storyContent.activityDefinitionsById,
            }),
        },
      },
    }).state;
    const activePachinkoSession =
      appState.gameState.runtime.activitySession?.type === "pachinko-board"
        ? appState.gameState.runtime.activitySession
        : null;
    lastPachinkoCollisionAudioToken = consumePachinkoCollisionAudioPulse({
      session: activePachinkoSession,
      lastConsumedToken: lastPachinkoCollisionAudioToken,
      sound: PACHINKO_COLLISION_SOUND,
      target: appAudioController,
      scheduleTask: (callback, delayMs) =>
        window.setTimeout(callback, delayMs),
    });

    if (!syncRenderedActivityQteMarker() && !syncRenderedFortuneBoardOverlay()) {
      renderApp();
    }
  }, nextIntervalMs);
}

function stopCurrentActivityQte(): void {
  const session = appState.gameState.runtime.activitySession;
  if (
    session?.type !== "qte-bar" &&
    session?.type !== "work-sequence" &&
    session?.type !== "fortune-board" &&
    session?.type !== "pachinko-board"
  ) {
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

function dispatchCurrentActivityQteAction(action: string): void {
  const session = appState.gameState.runtime.activitySession;
  if (session?.type !== "fortune-board" && session?.type !== "pachinko-board") {
    return;
  }

  appState = commitRuntimeRequest({
    state: appState,
    request: createInteractiveActionRequest(`interactive.activity-qte.${action}`),
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
  syncActivityQteLoop();
  renderApp();
}

function dispatchCurrentActivityQteSpeed(tickMs: number): void {
  const session = appState.gameState.runtime.activitySession;
  if (session?.type !== "fortune-board" && session?.type !== "pachinko-board") {
    return;
  }

  const nextTickMs =
    session.type === "pachinko-board"
      ? Math.max(16, Math.min(100, Math.round(tickMs)))
      : clampFortuneBoardAnimationTickMs(tickMs);
  appState = commitRuntimeRequest({
    state: appState,
    request: createInteractiveActionRequest("interactive.activity-qte.speed", {
      tickMs: nextTickMs,
    }),
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
  syncActivityQteLoop();
  if (!syncRenderedFortuneBoardOverlay()) {
    renderApp();
  }
}

function clampFortuneBoardAnimationTickMs(tickMs: number): number {
  if (!Number.isFinite(tickMs)) {
    return FORTUNE_BOARD_DEFAULT_ANIMATION_TICK_MS;
  }

  return Math.max(
    FORTUNE_BOARD_MIN_ANIMATION_TICK_MS,
    Math.min(FORTUNE_BOARD_MAX_ANIMATION_TICK_MS, Math.round(tickMs))
  );
}

function dispatchActivityActionButton(activityActionButton: HTMLElement): void {
  const activityAction = activityActionButton.dataset.activityAction;
  if (activityAction === "stop-qte") {
    stopCurrentActivityQte();
  } else if (activityAction === "play-board") {
    dispatchCurrentActivityQteAction("play");
  } else if (activityAction === "wager-minus") {
    dispatchCurrentActivityQteAction("wager-minus");
  } else if (activityAction === "wager-plus") {
    dispatchCurrentActivityQteAction("wager-plus");
  } else if (activityAction === "choose-command") {
    const commandId = activityActionButton.dataset.activityCommandId;
    if (commandId != null) {
      chooseCurrentActivityCommand(commandId);
    }
  } else if (activityAction === "close-result") {
    closeCurrentActivityResult();
  }
}

function chooseCurrentActivityCommand(commandId: string): void {
  const session = appState.gameState.runtime.activitySession;
  if (session?.type !== "work-sequence") {
    return;
  }

  appState = commitRuntimeRequest({
    state: appState,
    request: createInteractiveActionRequest("interactive.activity-qte.choose", {
      commandId,
    }),
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

function applyCampaignMapReturnState(): void {
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
}

function returnToCampaignMapWithLoading(): void {
  const requestId = beginLoadingScreen();

  simulateLoadingProgress((progress) => {
    if (requestId !== loadingScreenRequestId) {
      return;
    }

    setActiveLoadingProgress(progress * STARTUP_LOADING_SIMULATED_PROGRESS_CAP);
  })
    .then(async () => {
      if (requestId !== loadingScreenRequestId) {
        return;
      }

      applyCampaignMapReturnState();
      renderApp();
      setGameVisibility(true);
      await waitForInitialMapReadyWithLoading(requestId);
      endLoadingScreen(requestId);
    })
    .catch((error: unknown) => {
      endLoadingScreen(requestId);
      window.console.error("[Loading] failed to return to campaign map:", error);
      applyCampaignMapReturnState();
      renderApp();
      setGameVisibility(true);
    });
}

function startMapAutoAdvance(input: {
  intervalId: string;
  everyMs: number;
  targetHouseId: string;
  label: string;
  snapshots?: NonNullable<AppState["autoAdvanceState"]>["snapshots"];
  completion?: NonNullable<AppState["autoAdvanceState"]>["completion"];
  statusPanel?: NonNullable<AppState["autoAdvanceState"]>["statusPanel"];
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
      statusPanel: input.statusPanel ?? null,
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
          statusPanel:
            nextSnapshot.statusPanel ?? autoAdvanceState.statusPanel ?? null,
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
    const runtimeCommit = commitRuntimeRequest({
      state: appState,
      request: createDayStartRequest(),
      context: createRuntimeCommitContext({
        router: {
          route: ({ state, request }) => routeTimeRuntime({ state, request }),
        },
        followUp: {
          handleOutcome: ({ state, outcome }) =>
            navigationTimeFollowUp.applyOutcome({ state, outcome }),
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
  const previousAppState = appState;
  mainRuntimeOrchestrator.execute({
    type: "advance-story-scene",
  });
  const followUp = resolveStorySceneHouseFollowUp({
    previousAppState,
    nextAppState: appState,
  });
  if (followUp?.type === "reenter-house") {
    houseRuntime.applyInteractiveFollowUp(followUp);
  }
  renderApp();
}

function chooseCurrentStoryOption(choiceId: string): void {
  mainRuntimeOrchestrator.execute({
    type: "choose-story-option",
    choiceId,
  });
  renderApp();
}

function dispatchCurrentStoryBattleAction(
  actionId: string,
  options: {
    queueAudio?: boolean;
  } = {}
): void {
  const audioCueId = resolveStoryBattleActionCueId(actionId);
  if (audioCueId != null && options.queueAudio !== false) {
    queueAppAudioCueById(audioCueId);
    syncAppAudio();
  }

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
        handleInteractive: ({ interactive }) =>
          houseRuntime.applyInteractiveFollowUp(interactive),
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

type BattleDemoAudioMessage = {
  type: "rpg-tg:battle-demo-audio";
  scenarioId?: string;
  cueId?: string;
  chainId?: string;
  phase?: "draw" | "release" | "reload" | "fire" | "impact" | "horse-run";
  mode?: "play" | "transition" | "stop";
  currentActionFrame?: number;
  frameDurationMs?: number;
  fadeFrames?: number;
  nextStartFrame?: number;
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

  dispatchCurrentStoryBattleAction("embedded-victory", { queueAudio: false });
}

function handleBattleDemoAudioMessage(message: unknown): void {
  if (message == null || typeof message !== "object") {
    return;
  }

  const audioMessage = message as BattleDemoAudioMessage;
  const activeBattle = appState.gameState.storyBattle;
  if (
    audioMessage.type !== "rpg-tg:battle-demo-audio" ||
    activeBattle?.demoScenarioId == null ||
    audioMessage.scenarioId !== activeBattle.demoScenarioId
  ) {
    return;
  }

  const resolvedBattleDemoMusicCommand = resolveBattleDemoMusicCommand(
    audioMessage.cueId
  );
  if (resolvedBattleDemoMusicCommand?.kind === "start-bgm") {
    appAudioController.setBgmOverrideCue(resolvedBattleDemoMusicCommand.cueId);
    return;
  }
  if (resolvedBattleDemoMusicCommand?.kind === "play-victory") {
    appAudioController.playCueWithBgmSuppressed(
      resolvedBattleDemoMusicCommand.cueId,
      {
        fadeOutMs: resolvedBattleDemoMusicCommand.fadeOutMs,
      }
    );
    return;
  }

  const resolvedBattleDemoCueId = resolveBattleDemoCueId(audioMessage.cueId);
  if (resolvedBattleDemoCueId != null) {
    appAudioController.playCue(resolvedBattleDemoCueId);
    return;
  }

  const normalizedChainId =
    typeof audioMessage.chainId === "string" ? audioMessage.chainId.trim() : "";
  if (
    normalizedChainId.length === 0 ||
    (audioMessage.phase !== "draw" &&
      audioMessage.phase !== "release" &&
      audioMessage.phase !== "reload" &&
      audioMessage.phase !== "fire" &&
      audioMessage.phase !== "impact" &&
      audioMessage.phase !== "horse-run") ||
    (audioMessage.mode !== "play" &&
      audioMessage.mode !== "transition" &&
      audioMessage.mode !== "stop") ||
    typeof audioMessage.currentActionFrame !== "number" ||
    !Number.isFinite(audioMessage.currentActionFrame) ||
    typeof audioMessage.frameDurationMs !== "number" ||
    !Number.isFinite(audioMessage.frameDurationMs)
  ) {
    return;
  }

  appAudioController.playBattleDemoBridgeMessage({
    chainId: normalizedChainId,
    phase: audioMessage.phase,
    mode: audioMessage.mode,
    currentActionFrame: audioMessage.currentActionFrame,
    frameDurationMs: audioMessage.frameDurationMs,
    ...(typeof audioMessage.fadeFrames === "number" &&
    Number.isFinite(audioMessage.fadeFrames)
      ? { fadeFrames: audioMessage.fadeFrames }
      : {}),
    ...(typeof audioMessage.nextStartFrame === "number" &&
    Number.isFinite(audioMessage.nextStartFrame)
      ? { nextStartFrame: audioMessage.nextStartFrame }
      : {}),
  });
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
  return result;
}

async function activateSavedModSource(
  source: ModSourceDescriptor,
  requestId: string
): Promise<ModActivationResult> {
  const request =
    source.kind === "builtin"
      ? {
          type: "mod.load-builtin" as const,
          requestId,
          modId: source.modId,
        }
      : source.kind === "file"
        ? {
            type: "mod.load-file" as const,
            requestId,
            name: source.name,
            filePath: source.filePath,
          }
        : {
            type: "mod.load-url" as const,
            requestId,
            name: source.name,
            url: source.url,
          };
  const result = await runModRuntime({
    state: modRuntimeState,
    request,
  });
  modRuntimeState = result.state;
  return result;
}

async function restoreModFromSave(
  saveData: StartupSaveData
): Promise<ModActivationResult | null> {
  if (saveData?.selectedModId == null) {
    return null;
  }

  if (saveData.selectedModSource != null) {
    return activateSavedModSource(
      saveData.selectedModSource,
      "restore:saved-mod"
    );
  }

  return activateSavedMod(saveData.selectedModId, "restore:saved-mod");
}

function applyActivatedModSession(input: {
  activationResult: ModActivationResult;
  contentContext: ActiveGameContentContext;
  playerCharacterId: string;
  createAppState(): AppState;
}): void {
  mainRuntimeOrchestrator.execute({
    type: "apply-startup-session",
    session: input,
  });
  renderApp();
}

function showStartupError(error: unknown): void {
  window.alert(
    error instanceof Error ? error.message : "Startup failed."
  );
}

function loadSaveData(): StartupSaveData {
  // Placeholder for future save loading integration.
  return null;
}

const startupSessionCoordinatorDeps = {
  activateBuiltinDefaultMod,
  restoreModFromSave,
  activateScenarioPackMod,
  createPrototypeAppState,
  createHaozhouReturnEncounterAppState,
  createScenarioPackAppState,
  createStartupContentContext: (activationResult: ModActivationResult) =>
    createActiveGameContentContextFromModActivation({
      basePack: baseGameContentPack,
      activationResult,
    }),
  bootstrapStartupStoryAppState,
};

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
  const requestId = beginLoadingScreen();

  simulateLoadingProgress((progress) => {
    if (requestId !== loadingScreenRequestId) {
      return;
    }

    setActiveLoadingProgress(progress * STARTUP_LOADING_SIMULATED_PROGRESS_CAP);
  })
    .then(async () => {
      if (requestId !== loadingScreenRequestId) {
        return;
      }

      const startupSession = unwrapStartupSession(
        await runStartupSessionCoordinator(
          {
            type: "continue",
            selectedCharacter,
            saveData,
          },
          startupSessionCoordinatorDeps
        )
      );
      applyActivatedModSession(startupSession);
      await waitForInitialMapReadyWithLoading(requestId);
      endLoadingScreen(requestId);
      scheduleInitialMapIntroAfterLoading();
    })
    .catch((error: unknown) => {
      endLoadingScreen(requestId);
      showStartupError(error);
    });
}

function startRestoredGameWithLoading(
  selectedCharacter: CharacterDefinition,
  saveData: StartupSaveData
): Promise<void> {
  const requestId = beginLoadingScreen();

  return simulateLoadingProgress((progress) => {
    if (requestId !== loadingScreenRequestId) {
      return;
    }

    setActiveLoadingProgress(progress * STARTUP_LOADING_SIMULATED_PROGRESS_CAP);
  })
    .then(async () => {
      if (requestId !== loadingScreenRequestId) {
        return;
      }

      const startupSession = unwrapStartupSession(
        await runStartupSessionCoordinator(
          {
            type: "restore",
            selectedCharacter,
            saveData,
          },
          startupSessionCoordinatorDeps
        )
      );
      applyActivatedModSession(startupSession);
      await waitForInitialMapReadyWithLoading(requestId);
      endLoadingScreen(requestId);
      scheduleInitialMapIntroAfterLoading();
    })
    .catch((error: unknown) => {
      endLoadingScreen(requestId);
      showStartupError(error);
    });
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

    setActiveLoadingProgress(progress * STARTUP_LOADING_SIMULATED_PROGRESS_CAP);
  }).then(async () => {
    if (requestId !== loadingScreenRequestId) {
      return;
    }

    const startupSession = unwrapStartupSession(
      await runStartupSessionCoordinator(
        {
          type: "builtin",
          selectedCharacter,
          startupScenario,
        },
        startupSessionCoordinatorDeps
      )
    );
    applyActivatedModSession(startupSession);
    await waitForInitialMapReadyWithLoading(requestId);
    endLoadingScreen(requestId);
    scheduleInitialMapIntroAfterLoading();
  }).catch((error: unknown) => {
    endLoadingScreen(requestId);
    showStartupError(error);
  });
}

function runScenarioPackStartupRequestWithLoading(
  request:
    | { type: "scenario-summary"; scenarioPack: ScenarioPackSummary }
    | { type: "scenario-files"; files: File[] }
): Promise<void> {
  const requestId = beginLoadingScreen();

  return simulateLoadingProgress((progress) => {
    if (requestId !== loadingScreenRequestId) {
      return;
    }

    setActiveLoadingProgress(progress * STARTUP_LOADING_SIMULATED_PROGRESS_CAP);
  }).then(async () => {
    if (requestId !== loadingScreenRequestId) {
      return;
    }

    const startupSession = unwrapStartupSession(
      await runStartupSessionCoordinator(request, startupSessionCoordinatorDeps)
    );
    applyActivatedModSession(startupSession);
    await waitForInitialMapReadyWithLoading(requestId);
    endLoadingScreen(requestId);
    scheduleInitialMapIntroAfterLoading();
  }).catch((error) => {
    endLoadingScreen(requestId);
    window.alert(
      error instanceof Error
        ? `JSON 寮€灞€璇诲彇澶辫触锛?{error.message}`
        : "JSON 寮€灞€璇诲彇澶辫触銆?"
    );
  });
}

async function startScenarioPackWithLoading(
  scenarioPack: ScenarioPackSummary
): Promise<void> {
  try {
    return runScenarioPackStartupRequestWithLoading({
      type: "scenario-summary",
      scenarioPack,
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
    return runScenarioPackStartupRequestWithLoading({
      type: "scenario-files",
      files,
    });
  } catch (error) {
    window.alert(
      error instanceof Error
        ? `JSON 开局读取失败（${importLabel}）：${error.message}`
        : `JSON 开局读取失败（${importLabel}）。`
    );
  }
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
    activeContentContext.cityCoordinatesById[profile.initialLocation.cityId] ??
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
        initialRuntime: profile.initialRuntime,
        currentView: profile.initialLocation.view,
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
    cityCardDrawTestState: null,
    cityMenuState: null,
    cityDirectoryState: null,
    autoAdvanceState: null,
    uiLayouts: {
      "global-hud": createDefaultGlobalHudLayout(),
      "start-screen": createDefaultStartScreenLayout(),
      "character-select-screen": createDefaultCharacterSelectScreenLayout(),
      "character-detail-screen": createDefaultCharacterDetailScreenLayout(),
      "battle-ui-screen": createDefaultBattleUiScreenLayout(),
    },
    layoutEditor: {
      isOpen: false,
      selectedTargetId: "global-hud",
      selectedComponentId: "status-board",
      selectedElementId: null,
      backgroundAssetQuery: "",
      battleUiValues: createDefaultBattleUiEditorValues(),
    },
  };

  nextAppState = {
    ...nextAppState,
    gameState: revealCampaignMapHexesForCoordinate(
      nextAppState.gameState,
      scenarioMapDefinition,
      nextAppState.playerCoordinate
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

function createHaozhouReturnEncounterAppState(baseState: AppState): AppState {
  let nextAppState: AppState = {
    ...baseState,
    gameState: createHaozhouReturnEncounterBattleState({
      state: baseState.gameState,
      mainMissionText: getRuntimeText(
        "runtime.zhu_yuanzhang.main_mission.sundeya_battle_review"
      ),
      textEntriesById: activeContentContext.textEntriesById,
    }),
    characterDefinitions: createPrototypeCharactersForStoryStage(
      ZHU_YUANZHANG_STORY_STAGES.huangjueBeggingJourney
    ),
    modalState: null,
    locationDialogueState: null,
    cityMenuState: null,
    cityDirectoryState: null,
    beggingMiniGameState: null,
    cityCardDrawTestState: null,
    campaignTravelState: null,
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

function createStartupPreloadProgressHandler(
  requestId: number
): Parameters<typeof preloadInitialMapViewAssets>[1] {
  return ({ loaded, total }) => {
    if (requestId !== loadingScreenRequestId) {
      return;
    }

    const preloadProgress = total === 0 ? 1 : loaded / total;
    const progress =
      STARTUP_LOADING_SIMULATED_PROGRESS_CAP +
      (STARTUP_LOADING_ASSET_PROGRESS_CAP -
        STARTUP_LOADING_SIMULATED_PROGRESS_CAP) *
        preloadProgress;
    setActiveLoadingProgress(progress);
  };
}

function createStartupTerrainProgressHandler(
  requestId: number
): Parameters<typeof waitForCampaignTerrainReady>[1] {
  return ({ loaded, total }) => {
    if (requestId !== loadingScreenRequestId) {
      return;
    }

    const terrainProgress = total === 0 ? 1 : loaded / total;
    const progress =
      STARTUP_LOADING_ASSET_PROGRESS_CAP +
      (1 - STARTUP_LOADING_ASSET_PROGRESS_CAP) * terrainProgress;
    setActiveLoadingProgress(progress);
  };
}

async function waitForInitialMapReadyWithLoading(requestId: number): Promise<void> {
  await preloadInitialMapViewAssets(
    appRoot,
    createStartupPreloadProgressHandler(requestId)
  );
  await waitForCampaignTerrainReady(
    appRoot,
    createStartupTerrainProgressHandler(requestId)
  );
  await animateActiveLoadingProgressTo(
    1,
    requestId,
    STARTUP_LOADING_COMPLETION_ANIMATION_MS
  );
}

function animateActiveLoadingProgressTo(
  targetProgress: number,
  requestId: number,
  durationMs: number
): Promise<void> {
  if (requestId !== loadingScreenRequestId) {
    return Promise.resolve();
  }

  const loadingElement = activeLoadingScreenElement;
  if (loadingElement == null) {
    return Promise.resolve();
  }

  const currentProgress = Number.parseFloat(
    loadingElement.style.getPropertyValue("--loading-progress") || "0"
  );
  const startProgress = Number.isFinite(currentProgress) ? currentProgress : 0;
  const clampedTargetProgress = clamp(targetProgress, 0, 1);
  if (
    durationMs <= 0 ||
    Math.abs(clampedTargetProgress - startProgress) < 0.001
  ) {
    setActiveLoadingProgress(clampedTargetProgress);
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const startedAtMs = performance.now();
    const tick = (timestamp: number): void => {
      if (requestId !== loadingScreenRequestId) {
        resolve();
        return;
      }

      const progress = clamp((timestamp - startedAtMs) / durationMs, 0, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      setActiveLoadingProgress(
        startProgress +
          (clampedTargetProgress - startProgress) * easedProgress
      );

      if (progress < 1) {
        loadingScreenAnimationFrameId = window.requestAnimationFrame(tick);
        return;
      }

      loadingScreenAnimationFrameId = null;
      resolve();
    };

    loadingScreenAnimationFrameId = window.requestAnimationFrame(tick);
  });
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
  isGameVisible = isVisible;
  document.body.classList.toggle("is-game-visible", isVisible);
  appRoot.style.visibility = isVisible ? "visible" : "hidden";
  appRoot.style.pointerEvents = isVisible ? "auto" : "none";
  syncAppAudio();
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

  if (initialMapIntroStoryTriggerTimeoutId != null) {
    window.clearTimeout(initialMapIntroStoryTriggerTimeoutId);
  }

  initialCampaignMapDebugAnimationFrame = null;
  initialCampaignMapDebugAnimationStartTime = null;
  initialMapIntroStoryTriggerTimeoutId = null;
  activeMapIntroOverlay = null;
  pendingInitialCampaignMapIntroTerrainReady = false;
  cancelCampaignMapZoomAnimation();
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

function queueAppAudioCueById(cueId: string): void {
  appAudioSession = queueAppAudioCue(appAudioSession, cueId);
}

function queuePointerDispatchedUiClickCue(targetElement: HTMLElement): void {
  const clickSoundCueId = resolveUiClickCueIdFromTarget({
    target: targetElement,
    allowFallbackUiClick: shouldQueueUiClickCue(targetElement),
  });
  if (clickSoundCueId == null) {
    return;
  }

  queueAppAudioCueById(clickSoundCueId);
  syncAppAudio();
}

function queueButtonSoundEffect(effect: ButtonSoundEffect): void {
  appAudioSession = effect.queue(appAudioSession);
  syncAppAudio();
}

function queueEnterSoundEffect(effect: EnterSoundEffect): void {
  appAudioSession = effect.queue(appAudioSession);
  syncAppAudio();
}

function queueTroopSelectionSoundEffect(effect: TroopSelectionSoundEffect): void {
  appAudioSession = effect.queue(appAudioSession);
  syncAppAudio();
}

function queueTroopMutationSoundEffect(effect: TroopMutationSoundEffect): void {
  appAudioSession = effect.queue(appAudioSession);
  syncAppAudio();
}

function playTroopMutationSoundBurst(
  effect: TroopMutationSoundEffect,
  options: {
    repeatCount?: number | undefined;
    repeatDelayMs?: number | undefined;
  } = {}
): void {
  const repeatCount = Math.max(1, Math.trunc(options.repeatCount ?? 1));
  const repeatDelayMs = Math.max(0, options.repeatDelayMs ?? 0);

  queueTroopMutationSoundEffect(effect);

  for (let index = 1; index < repeatCount; index += 1) {
    window.setTimeout(() => {
      appAudioController.playCue(effect.cueId);
    }, repeatDelayMs * index);
  }
}

function commitTroopRuntimeMutation(
  nextAppState: AppState,
  options: {
    closeTroopManagementAfter?: boolean;
    mutationSoundRepeatCount?: number;
    mutationSoundRepeatDelayMs?: number;
  } = {}
): void {
  const didMutateTroops =
    nextAppState.gameState.runtime.troops !== appState.gameState.runtime.troops;
  appState = nextAppState;
  if (options.closeTroopManagementAfter === true) {
    appState = closeTroopManagement(appState);
  }
  if (didMutateTroops) {
    playTroopMutationSoundBurst(TROOP_MUTATION_SOUND, {
      repeatCount: options.mutationSoundRepeatCount,
      repeatDelayMs: options.mutationSoundRepeatDelayMs,
    });
  }
  renderApp();
}

function syncAppAudio(): void {
  const result = createAppAudioOutput({
    appState,
    isGameVisible,
    sceneDefinitionsById: activeContentContext.storyContent.sceneDefinitionsById,
    session: appAudioSession,
  });
  appAudioSession = result.session;
  appAudioController.sync(result.output);
}

function shouldQueueUiClickCue(targetElement: HTMLElement): boolean {
  if (
    targetElement.closest(
      "button, [role='button'], [data-action], [data-modal-action], [data-scene-action], [data-house-action], [data-activity-action], [data-city-action], [data-npc-target]"
    ) != null
  ) {
    return true;
  }

  return false;
}

function hasRecentPointerDispatchedActivityAction(action: string): boolean {
  if (recentPointerDispatchedActivityAction == null) {
    return false;
  }

  const elapsedMs =
    window.performance.now() - recentPointerDispatchedActivityAction.timestamp;
  if (elapsedMs >= 500) {
    recentPointerDispatchedActivityAction = null;
    return false;
  }

  return recentPointerDispatchedActivityAction.action === action;
}

function hasRecentPointerDispatchedHouseAction(actionId: string): boolean {
  if (recentPointerDispatchedHouseAction == null) {
    return false;
  }

  const elapsedMs =
    window.performance.now() - recentPointerDispatchedHouseAction.timestamp;
  if (elapsedMs >= 500) {
    recentPointerDispatchedHouseAction = null;
    return false;
  }

  return recentPointerDispatchedHouseAction.actionId === actionId;
}

function shouldSkipPointerDispatchedClickAudio(targetElement: HTMLElement): boolean {
  const activityActionButton = targetElement.closest<HTMLElement>(
    "[data-activity-action]"
  );
  const activityAction = activityActionButton?.dataset.activityAction;
  if (
    activityAction != null &&
    shouldDispatchActivityActionOnPointerDown(activityAction) &&
    hasRecentPointerDispatchedActivityAction(activityAction)
  ) {
    return true;
  }

  const houseActionButton = targetElement.closest<HTMLElement>("[data-house-action]");
  const houseActionId = houseActionButton?.dataset.houseAction;
  if (
    houseActionId != null &&
    shouldDispatchHouseActionOnPointerDown(houseActionId) &&
    hasRecentPointerDispatchedHouseAction(houseActionId)
  ) {
    return true;
  }

  return false;
}

function unlockAppAudioIfNeeded(): void {
  appAudioController.unlock();
}

function canOpenHouseFromCity(houseDefinition: HouseDefinition): boolean {
  const accessResult = selectHouseEntryAccess(
    appState.gameState,
    appState.characterDefinitions,
    houseDefinition,
    activeContentContext.gameContent.houseAccessRefusalRules
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

  const houseDefinition = activeContentContext.houses.find(
    (candidateHouse) => candidateHouse.id === mappedHouse.houseId
  );
  if (houseDefinition == null) {
    return;
  }

  queueEnterSoundEffect(ENTER_SOUND);
  if (!canOpenHouseFromCity(houseDefinition)) {
    return;
  }

  enterHouseThroughRuntime(houseRuntime, mappedHouse.houseId);
}

window.addEventListener("pointerdown", unlockAppAudioIfNeeded, {
  passive: true,
});
window.addEventListener("keydown", unlockAppAudioIfNeeded);
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

function getBattleUiEditorPayload(): Record<string, string> {
  return { ...appState.layoutEditor.battleUiValues };
}

function postBattleUiEditorConfigToFrame(
  frame: HTMLIFrameElement | null | undefined
): void {
  if (frame?.contentWindow == null) {
    return;
  }

  frame.contentWindow.postMessage(
    {
      type: "rpg-tg:battle-ui-config",
      variables: getBattleUiEditorPayload(),
    },
    window.location.origin
  );
}

function syncEmbeddedBattleUiEditor(): void {
  const battleFrame =
    appRoot.querySelector<HTMLIFrameElement>(".c-story-battle__demo-frame");
  if (battleFrame == null) {
    return;
  }

  battleFrame.addEventListener(
    "load",
    () => {
      postBattleUiEditorConfigToFrame(battleFrame);
    },
    { once: true }
  );

  postBattleUiEditorConfigToFrame(battleFrame);
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
  syncEmbeddedBattleUiEditor();
}

async function copyCurrentLayoutParams(): Promise<void> {
  const payload =
    appState.layoutEditor.selectedTargetId === "battle-ui-screen"
      ? {
          targetId: appState.layoutEditor.selectedTargetId,
          variables: getBattleUiEditorPayload(),
        }
      : {
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
    targetElement.dataset.battleUiVar != null
  ) {
    appState = setLayoutEditorBattleUiValue(
      appState,
      targetElement.dataset.battleUiVar as BattleUiEditorVariableName,
      targetElement.value
    );
    persistBattleUiEditorValues(appState.layoutEditor.battleUiValues);
    syncEmbeddedBattleUiEditor();
    renderActiveSurface();
    return true;
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
      targetId === "character-detail-screen" ||
      targetId === "battle-ui-screen"
    ) {
      appState = selectLayoutEditorTarget(appState, targetId as LayoutEditorTargetId);
      renderActiveSurface();
      syncEmbeddedBattleUiEditor();
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
  const targetElement = event.target;
  if (
    targetElement instanceof HTMLInputElement &&
    targetElement.dataset.uiCoinAnchorInput != null
  ) {
    const nextValue = Number(targetElement.value);
    if (!Number.isFinite(nextValue)) {
      return;
    }

    if (targetElement.dataset.uiCoinAnchorInput === "x") {
      coinRewardAnchorEditorState = {
        ...coinRewardAnchorEditorState,
        draftOffsetX: Math.round(nextValue),
      };
    } else if (targetElement.dataset.uiCoinAnchorInput === "y") {
      coinRewardAnchorEditorState = {
        ...coinRewardAnchorEditorState,
        draftOffsetY: Math.round(nextValue),
      };
    }

    syncCoinRewardAnchorEditor();
    syncCoinRewardAnchorEditorView();
    return;
  }

  if (
    targetElement instanceof HTMLInputElement &&
    targetElement.hasAttribute("data-campaign-map-scale-input")
  ) {
    campaignMapScaleDraftValue = targetElement.value;
    return;
  }

  if (
    targetElement instanceof HTMLInputElement &&
    targetElement.hasAttribute("data-fortune-speed-input")
  ) {
    const nextTickMs = clampFortuneBoardAnimationTickMs(Number(targetElement.value));
    const speedValueElement = targetElement
      .closest("[data-fortune-speed-control]")
      ?.querySelector<HTMLElement>("[data-fortune-speed-value]");
    if (speedValueElement != null) {
      speedValueElement.textContent = `${nextTickMs}ms`;
    }

    const houseFieldId = targetElement.dataset.fortuneSpeedField;
    if (houseFieldId != null && appState.gameState.ui.currentView === "house") {
      dispatchHouseRuntimeRequest(houseRuntime, {
        type: "field",
        fieldId: houseFieldId,
        value: String(nextTickMs),
      });
      return;
    }

    dispatchCurrentActivityQteSpeed(nextTickMs);
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
    targetElement.hasAttribute("data-campaign-cloud-texture-scale-input")
  ) {
    handleCampaignCloudTextureScaleInput(targetElement);
    return;
  }

  if (handleLayoutEditorInput(event.target)) {
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
    event.code === "Space" &&
    !(targetElement instanceof HTMLInputElement) &&
    !(targetElement instanceof HTMLTextAreaElement)
  ) {
    const session = appState.gameState.runtime.activitySession;
    if (session?.type === "pachinko-board" && session.phase !== "dropping") {
      const playButton = appRoot.querySelector<HTMLButtonElement>(
        "[data-activity-overlay='pachinko-board'] [data-activity-action='play-board'], [data-house-overlay='pachinko-board'] .c-pachinko-board__play"
      );
      if (playButton != null && !playButton.disabled) {
        event.preventDefault();
        playButton.click();
        return;
      }
    }
  }

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
  zoomCampaignMapAtScreenCenter(getSteppedCampaignMapScale(direction));
});

appElement.addEventListener("pointerdown", (event) => {
  if (startLayoutEditorDrag(event)) {
    return;
  }

  const targetElement = event.target;
  if (!(targetElement instanceof HTMLElement)) {
    return;
  }

  const pointerActivityActionButton = targetElement.closest<HTMLElement>(
    "[data-activity-action]"
  );
  const pointerActivityAction =
    pointerActivityActionButton?.dataset.activityAction;
  if (
    pointerActivityActionButton != null &&
    pointerActivityAction != null &&
    shouldDispatchActivityActionOnPointerDown(pointerActivityAction)
  ) {
    event.preventDefault();
    event.stopPropagation();
    recentPointerDispatchedActivityAction = {
      action: pointerActivityAction,
      timestamp: window.performance.now(),
    };
    queuePointerDispatchedUiClickCue(pointerActivityActionButton);
    dispatchActivityActionButton(pointerActivityActionButton);
    return;
  }

  const pointerHouseActionButton = targetElement.closest<HTMLElement>(
    "[data-house-action]"
  );
  const pointerHouseActionId = pointerHouseActionButton?.dataset.houseAction;
  if (
    pointerHouseActionButton != null &&
    pointerHouseActionId != null &&
    shouldDispatchHouseActionOnPointerDown(pointerHouseActionId)
  ) {
    const houseActionButton = pointerHouseActionButton;
    event.preventDefault();
    event.stopPropagation();
    recentPointerDispatchedHouseAction = {
      actionId: pointerHouseActionId,
      timestamp: window.performance.now(),
    };
    queuePointerDispatchedUiClickCue(houseActionButton);
    dispatchHouseRuntimeRequest(houseRuntime, {
      type: "action",
      actionId: pointerHouseActionId,
    }, {
      pointer: {
        clientX: event.clientX,
        clientY: event.clientY,
      },
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

  if (targetElement.closest("[data-ui-coin-anchor-editor]") != null) {
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

  cancelCampaignMapZoomAnimation();
  campaignMapDragState = {
    pointerId: event.pointerId,
    startClientX: event.clientX,
    startClientY: event.clientY,
    startOffsetX: campaignMapDebugState.offsetX,
    startOffsetY: campaignMapDebugState.offsetY,
    didMove: false,
  };
  beginCampaignCloudInteraction("drag");
  hideCampaignHoverHexOutline();
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

  if (campaignMapDragState == null) {
    updateCampaignHoverHexOutline(event);
  }

  if (
    campaignMapDragState == null ||
    campaignMapDragState.pointerId !== event.pointerId
  ) {
    return;
  }

  hideCampaignHoverHexOutline();
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
appElement.addEventListener("pointerleave", hideCampaignHoverHexOutline);

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
  if (triggerPachinkoFortuneCardDrawFromElement(targetElement)) {
    event.preventDefault();
    event.stopPropagation();
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
  handleBattleDemoAudioMessage(event.data);
});

function parseNpcInteractionContext(
  rawContext: string
): NpcInteractionContext | null {
  try {
    const value: unknown = JSON.parse(rawContext);
    if (value == null || typeof value !== "object") {
      return null;
    }

    const candidate = value as Record<string, unknown>;
    if (
      candidate.type === "house" &&
      typeof candidate.houseId === "string" &&
      (candidate.moduleId == null || typeof candidate.moduleId === "string")
    ) {
      const context: NpcInteractionContext = {
        type: "house",
        houseId: candidate.houseId,
      };
      if (candidate.moduleId != null) {
        return {
          ...context,
          moduleId: candidate.moduleId as HouseModuleId,
        };
      }
      return context;
    }
  } catch {
    return null;
  }

  return null;
}

appElement.addEventListener(
  "click",
  (event) => {
    if (shouldSuppressNextClickAfterMapDrag) {
      return;
    }

    const targetElement = event.target;
    if (!(targetElement instanceof HTMLElement)) {
      return;
    }

    if (shouldSkipPointerDispatchedClickAudio(targetElement)) {
      return;
    }

    const clickSoundCueId = resolveUiClickCueIdFromTarget({
      target: targetElement,
      allowFallbackUiClick: shouldQueueUiClickCue(targetElement),
    });
    if (clickSoundCueId == null) {
      return;
    }

    queueAppAudioCueById(clickSoundCueId);
    syncAppAudio();
  },
  true
);

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

  if (triggerPachinkoFortuneCardDrawFromElement(targetElement)) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  const confirmBeggingResultButton = targetElement.closest<HTMLElement>(
    "[data-action='confirm-begging-game-result']"
  );
  if (confirmBeggingResultButton != null) {
    confirmBeggingMiniGameResult();
    return;
  }

  const startCityBeggingDefaultButton = targetElement.closest<HTMLElement>(
    "[data-action='start-aibegging']"
  );
  if (startCityBeggingDefaultButton != null) {
    openCityBeggingDefault();
    return;
  }

  const cityBeggingDefaultState = appState.beggingMiniGameState;
  const isCityBeggingDefaultDialogue =
    cityBeggingDefaultState != null &&
    "mode" in cityBeggingDefaultState &&
    cityBeggingDefaultState.mode === "default-dialogue";
  if (isCityBeggingDefaultDialogue) {
    const sceneContinueElement = targetElement.closest<HTMLElement>(
      "[data-scene-action='continue-journey']"
    );
    if (sceneContinueElement != null) {
      dispatchCityBeggingDefaultAction("continue-journey", {
        now: performance.now(),
      });
      scheduleCityBeggingDefaultThinkingTick();
      renderApp();
      return;
    }

    const sceneAdvanceElement = targetElement.closest<HTMLElement>(
      "[data-scene-action='advance']"
    );
    if (sceneAdvanceElement != null) {
      if (cityBeggingDefaultState.phase === "outcome") {
        dispatchCityBeggingDefaultAction("confirm-outcome");
        destroyCityBeggingDefaultFortuneRuntime();
      } else {
        dispatchCityBeggingDefaultAction("advance-dialogue", {
          now: performance.now(),
        });
        scheduleCityBeggingDefaultThinkingTick();
      }
      renderApp();
      return;
    }

    const sceneChoiceButton = targetElement.closest<HTMLElement>(
      "[data-scene-choice-id]"
    );
    if (sceneChoiceButton != null) {
      const choiceId = sceneChoiceButton.dataset.sceneChoiceId;
      if (choiceId != null) {
        if (cityBeggingDefaultState.phase === "location-options") {
          dispatchCityBeggingDefaultAction("select-location", {
            locationId: choiceId,
          });
        } else if (cityBeggingDefaultState.phase === "option-select") {
          dispatchCityBeggingDefaultAction("select-option", {
            optionId: choiceId,
            now: performance.now(),
          });
        }
        renderApp();
      }
      return;
    }
  }

  const exitCityBeggingDefaultButton = targetElement.closest<HTMLElement>(
    "[data-action='exit-city-begging-default']"
  );
  if (exitCityBeggingDefaultButton != null) {
    destroyCityBeggingDefaultFortuneRuntime();
    appState = commitRuntimeRequest({
      state: appState,
      request: createPlayableActionRequest("aibegging", "exit"),
      context: {
        router: {
          route: ({ state, request }) =>
            runInteractiveRuntime({
              state,
              request,
              characterDefinitions: appState.characterDefinitions,
              playerCharacterId: currentPlayerCharacterId,
            }),
        },
      },
    }).state;
    renderApp();
    return;
  }

  if (appState.beggingMiniGameState != null) {
    if (targetElement.closest(".c-begging-game") != null) {
      return;
    }
  }

  const toggleCoinAnchorEditorButton = targetElement.closest<HTMLElement>(
    "[data-action='toggle-coin-anchor-editor']"
  );
  if (toggleCoinAnchorEditorButton != null) {
    const nextIsOpen = !coinRewardAnchorEditorState.isOpen;
    coinRewardAnchorEditorState = {
      ...coinRewardAnchorEditorState,
      isOpen: nextIsOpen,
      draftOffsetX: nextIsOpen
        ? coinRewardAnchorEditorState.actualOffsetX
        : coinRewardAnchorEditorState.actualOffsetX,
      draftOffsetY: nextIsOpen
        ? coinRewardAnchorEditorState.actualOffsetY
        : coinRewardAnchorEditorState.actualOffsetY,
    };
    renderApp();
    return;
  }

  const confirmCoinAnchorEditorButton = targetElement.closest<HTMLElement>(
    "[data-action='confirm-coin-anchor-editor']"
  );
  if (confirmCoinAnchorEditorButton != null) {
    coinRewardAnchorEditorState = {
      ...coinRewardAnchorEditorState,
      actualOffsetX: coinRewardAnchorEditorState.draftOffsetX,
      actualOffsetY: coinRewardAnchorEditorState.draftOffsetY,
    };
    syncCoinRewardAnchorEditor();
    syncCoinRewardAnchorEditorView();
    return;
  }

  const revertCoinAnchorEditorButton = targetElement.closest<HTMLElement>(
    "[data-action='revert-coin-anchor-editor']"
  );
  if (revertCoinAnchorEditorButton != null) {
    coinRewardAnchorEditorState = {
      ...coinRewardAnchorEditorState,
      draftOffsetX: coinRewardAnchorEditorState.actualOffsetX,
      draftOffsetY: coinRewardAnchorEditorState.actualOffsetY,
    };
    syncCoinRewardAnchorEditor();
    syncCoinRewardAnchorEditorView();
    return;
  }

  const haozhouCoinRewardButton = targetElement.closest<HTMLElement>(
    "[data-action='grant-haozhou-test-coin']"
  );
  if (haozhouCoinRewardButton != null) {
    appState = applyCoinReward(appState, currentPlayerCharacterId, 10);
    playCoinRewardFlight({
      playerCharacterId: currentPlayerCharacterId,
      delta: 10,
      sourceElement: haozhouCoinRewardButton,
      sourceClientX: event.clientX,
      sourceClientY: event.clientY,
    });
    return;
  }

  const openCityCardDrawTestButton = targetElement.closest<HTMLElement>(
    "[data-action='open-city-card-draw-test']"
  );
  if (openCityCardDrawTestButton != null) {
    appState = {
      ...closeCityMenu(closeCityDirectory(appState)),
      locationDialogueState: null,
      cityCardDrawTestState: {
        sessionId: (nextCityCardDrawTestSessionId += 1),
        resultValue: null,
      },
    };
    renderApp();
    return;
  }

  const closeCityCardDrawTestButton = targetElement.closest<HTMLElement>(
    "[data-action='close-city-card-draw-test']"
  );
  if (closeCityCardDrawTestButton != null) {
    appState = {
      ...appState,
      cityCardDrawTestState: null,
    };
    renderApp();
    return;
  }

  const confirmCityCardDrawTestButton = targetElement.closest<HTMLElement>(
    "[data-action='confirm-city-card-draw-test']"
  );
  if (confirmCityCardDrawTestButton != null) {
    appState = {
      ...appState,
      cityCardDrawTestState: null,
    };
    renderApp();
    return;
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

  const dismissStoryChapterTitleAction = targetElement.closest<HTMLElement>(
    "[data-action='dismiss-story-chapter-title']"
  );
  if (dismissStoryChapterTitleAction != null) {
    clearStoryChapterTitle();
    renderApp();
    return;
  }

  const closeOverlayButton = targetElement.closest<HTMLElement>(
    "[data-action='close-overlay'], [data-action='close-character-detail']"
  );
  if (closeOverlayButton != null) {
    appState = closeGlobalOverlay(appState);
    renderApp();
    return;
  }

  const playerCardButton = targetElement.closest<HTMLElement>(
    "[data-action='open-player-detail']"
  );
  if (playerCardButton != null) {
    appState = openPlayerDetail(appState);
    renderApp();
    return;
  }

  const openTroopEditorButton = targetElement.closest<HTMLElement>(
    "[data-action='open-troop-editor']"
  );
  if (openTroopEditorButton != null) {
    appState = openTroopEditor(appState);
    renderApp();
    return;
  }

  const closeTroopEditorButton = targetElement.closest<HTMLElement>(
    "[data-action='close-troop-editor']"
  );
  if (closeTroopEditorButton != null) {
    appState = closeTroopEditor(appState);
    renderApp();
    return;
  }

  const openTroopManagementButton = targetElement.closest<HTMLElement>(
    "[data-action='open-troop-management']"
  );
  if (openTroopManagementButton != null) {
    appState = openTroopManagement(appState, {
      troopId: openTroopManagementButton.dataset.troopId ?? null,
    });
    renderApp();
    return;
  }

  const closeTroopManagementButton = targetElement.closest<HTMLElement>(
    "[data-action='close-troop-management']"
  );
  if (closeTroopManagementButton != null) {
    appState = closeTroopManagement(appState);
    renderApp();
    return;
  }

  const npcTargetButton = targetElement.closest<HTMLElement>(
    "[data-npc-target][data-npc-context]"
  );
  if (npcTargetButton != null) {
    const characterId = npcTargetButton.dataset.npcTarget;
    const rawContext = npcTargetButton.dataset.npcContext;
    const blockState = selectNpcInteractionBlockState({
      overlayView: appState.gameState.ui.overlayView,
      modalState: appState.modalState,
      locationDialogueState: appState.locationDialogueState,
      beggingMiniGameState: appState.beggingMiniGameState,
      activitySession: appState.gameState.runtime.activitySession,
    });
    debugNpcInteraction("npc-target:hit", {
      characterId,
      rawContext,
      blockState,
      targetTag: targetElement.tagName,
      targetClassName: targetElement.className,
      buttonClassName: npcTargetButton.className,
    });
    if (characterId != null && rawContext != null) {
      const context = parseNpcInteractionContext(rawContext);
      if (context != null && !isNpcInteractionBlocked(blockState)) {
        appState = openNpcInteraction(appState, context, characterId);
        debugNpcInteraction("npc-target:opened", {
          characterId,
          context,
        });
        renderApp();
      } else {
        debugNpcInteraction("npc-target:blocked", {
          characterId,
          context,
          isBlocked: isNpcInteractionBlocked(blockState),
        });
      }
    }
    return;
  }

  const npcActionButton = targetElement.closest<HTMLElement>("[data-npc-action]");
  if (npcActionButton != null) {
    const npcAction = npcActionButton.dataset.npcAction;
    if (npcAction === "close") {
      appState = closeNpcInteraction(appState);
      renderApp();
      return;
    }

    if (npcAction === "continue") {
      appState = closeNpcInteraction(appState);
      renderApp();
      return;
    }

    if (npcAction === "profile") {
      const characterId = npcActionButton.dataset.characterId;
      if (characterId != null && characterId.length > 0) {
        appState = openCharacterDetail(appState, characterId);
        renderApp();
      }
      return;
    }

    if (npcAction === "talk") {
      const characterId = npcActionButton.dataset.characterId;
      if (characterId != null && characterId.length > 0) {
        appState = chooseNpcDefaultTalk(appState, characterId);
        renderApp();
      }
      return;
    }
  }

  const openCardsButton = targetElement.closest<HTMLElement>(
    "[data-action='open-cards']"
  );
  if (openCardsButton != null) {
    appState = updateOverlayView(appState, "cards");
    renderApp();
    return;
  }

  const openBackpackButton = targetElement.closest<HTMLElement>(
    "[data-action='open-backpack']"
  );
  if (openBackpackButton != null) {
    appState = openBackpack(appState);
    renderApp();
    return;
  }

  const openCharacterAbilityDetailButton = targetElement.closest<HTMLElement>(
    "[data-action='open-character-ability-detail']"
  );
  if (openCharacterAbilityDetailButton != null) {
    appState = openCharacterAbilityDetail(appState);
    renderApp();
    return;
  }

  const closeCharacterAbilityDetailButton = targetElement.closest<HTMLElement>(
    "[data-action='close-character-ability-detail']"
  );
  if (closeCharacterAbilityDetailButton != null) {
    appState = closeCharacterAbilityDetail(appState);
    renderApp();
    return;
  }

  const openValuablesButton = targetElement.closest<HTMLElement>(
    "[data-action='open-valuables']"
  );
  if (openValuablesButton != null) {
    appState = openBackpack(appState);
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

  const backpackActionButton = targetElement.closest<HTMLElement>(
    "[data-action='run-backpack-item-action'][data-backpack-item-id][data-item-action-id]"
  );
  if (backpackActionButton != null) {
    const itemId = backpackActionButton.dataset.backpackItemId;
    const actionId = backpackActionButton.dataset.itemActionId;
    if (itemId != null && actionId != null) {
      appState = runBackpackItemAction(appState, itemId, actionId as ItemActionId);
      renderApp();
    }
    return;
  }

  const backpackFilterButton = targetElement.closest<HTMLElement>(
    "[data-backpack-filter]"
  );
  if (backpackFilterButton != null) {
    const filter = backpackFilterButton.dataset.backpackFilter as
      | BackpackItemCategoryFilter
      | undefined;
    if (filter != null) {
      appState = setBackpackFilter(appState, filter);
      renderApp();
    }
    return;
  }

  const backpackItemButton = targetElement.closest<HTMLElement>(
    "[data-backpack-item-id]"
  );
  if (backpackItemButton != null) {
    const itemId = backpackItemButton.dataset.backpackItemId;
    if (itemId != null) {
      appState = selectBackpackItem(appState, itemId);
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
    openCityBeggingDefault();
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
    returnToCampaignMapWithLoading();
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
      cityCardDrawTestState: null,
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
      cityCardDrawTestState: null,
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

  const cityMapBuildingButton = targetElement.closest<HTMLElement>(
    "[data-city-map-building-id]"
  );
  if (cityMapBuildingButton != null) {
    event.preventDefault();
    event.stopPropagation();

    const cityMapBuildingGroup = cityMapBuildingButton.closest<HTMLElement>(
      "[data-city-map-building-group-id]"
    );
    const cityMapStage = cityMapBuildingGroup?.closest<HTMLElement>(
      ".c-city-map-stage"
    );
    const buildingGroups =
      cityMapStage?.querySelectorAll<HTMLElement>(
        "[data-city-map-building-group-id]"
      ) ?? [];

    buildingGroups.forEach((buildingGroup) => {
      const isSelected = buildingGroup === cityMapBuildingGroup;
      buildingGroup.classList.toggle("is-selected", isSelected);
      const hotspot = buildingGroup.querySelector<HTMLElement>(
        "[data-city-map-building-id]"
      );
      hotspot?.setAttribute("aria-pressed", String(isSelected));
    });

    const shouldContinueToCityEntry =
      cityMapBuildingButton.hasAttribute("data-house-id") ||
      cityMapBuildingButton.hasAttribute("data-city-entry-id");
    if (!shouldContinueToCityEntry) {
      return;
    }
  }

  const cityEntryButton = targetElement.closest<HTMLElement>(
    "[data-city-entry-id]"
  );
  if (cityEntryButton != null) {
    const cityEntryId = cityEntryButton.dataset.cityEntryId;
    const cityEntry = activeContentContext.cityEntries.find(
      (entryDefinition) =>
        entryDefinition.id === cityEntryId &&
        entryDefinition.cityId === appState.gameState.world.currentCityId
    );
    if (cityEntry?.directoryType === "leader-residence") {
      const targetHouse = activeContentContext.houses.find(
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
            historicalCharacters: activeContentContext.historicalCharacters,
            historicalCharacterIdByCharacterId:
              activeContentContext.historicalCharacterIdByCharacterId,
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
        const targetHouse = activeContentContext.houses.find(
          (houseDefinition) => houseDefinition.id === targetHouseId
        );
        if (targetHouse == null || !canOpenHouseFromCity(targetHouse)) {
          return;
        }

        appState = {
          ...closeCityDirectory(appState),
          cityCardDrawTestState: null,
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
    if (
      activityAction != null &&
      shouldSuppressPointerDispatchedActivityClick(activityAction)
    ) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    dispatchActivityActionButton(activityActionButton);
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
      }, {
        pointer: {
          clientX: event.clientX,
          clientY: event.clientY,
        },
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
      const houseDefinition = activeContentContext.houses.find(
        (candidateHouse) => candidateHouse.id === houseId
      );
      if (houseDefinition == null) {
        return;
      }

      if (!canOpenHouseFromCity(houseDefinition)) {
        return;
      }

      appState = {
        ...appState,
        cityCardDrawTestState: null,
      };
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
    debugCampaignMapClick("blocked:auto-advance", {
      targetTag: targetElement.tagName,
      targetClassName: targetElement.className,
    });
    return;
  }

  const mapCell = targetElement.closest<HTMLElement>("[data-map-x][data-map-y]");
  if (mapCell != null && appState.gameState.ui.currentView === "map") {
    const xValue = Number(mapCell.dataset.mapX);
    const yValue = Number(mapCell.dataset.mapY);
    debugCampaignMapClick("map-cell:hit", {
      targetTag: targetElement.tagName,
      targetClassName: targetElement.className,
      mapCellTag: mapCell.tagName,
      mapCellClassName: mapCell.className,
      x: xValue,
      y: yValue,
      cityId: mapCell.dataset.cityId || null,
      markerId: mapCell.dataset.campaignMarkerId || null,
      nodeId: mapCell.dataset.mapNodeId || null,
      revealedAttribute: mapCell.dataset.mapNodeRevealed ?? null,
    });
    if (!isCurrentCampaignCoordinateClickable({ x: xValue, y: yValue })) {
      debugCampaignMapClick("map-cell:blocked-unrevealed", {
        x: xValue,
        y: yValue,
      });
      return;
    }
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
    debugCampaignMapClick("viewport:hit", {
      targetTag: targetElement.tagName,
      targetClassName: targetElement.className,
      clientX: event.clientX,
      clientY: event.clientY,
      ...describeNearestCampaignMarker(campaignMap, event.clientX, event.clientY),
    });
    const clickTarget = resolveCampaignTerrainUvFromClientPosition(
      campaignMap,
      event.clientX,
      event.clientY
    );
    const currentMapDefinition = getCurrentMapDefinition();
    const coordinateSpace = currentMapDefinition?.coordinateSpace;
    if (clickTarget == null || currentMapDefinition == null || coordinateSpace == null) {
      debugCampaignMapClick("viewport:blocked-no-uv-or-coordinate-space", {
        hasClickTarget: clickTarget != null,
        hasMapDefinition: currentMapDefinition != null,
        hasCoordinateSpace: coordinateSpace != null,
      });
      return;
    }
    const targetCoordinate = {
      x: clickTarget.u * coordinateSpace.width,
      y: (1 - clickTarget.v) * coordinateSpace.height,
    };
    const campaignCoordinateSystem = getCurrentCampaignHexCoordinateSystem();
    const snappedTargetCoordinate = snapCoordinateToHexCenter(
      targetCoordinate,
      coordinateSpace,
      campaignCoordinateSystem ?? undefined
    );
    const snappedTargetU = snappedTargetCoordinate.x / coordinateSpace.width;
    const snappedTargetV = 1 - snappedTargetCoordinate.y / coordinateSpace.height;
    if (!isCurrentCampaignCoordinateClickable(snappedTargetCoordinate)) {
      debugCampaignMapClick("viewport:blocked-unrevealed", {
        clickTarget,
        targetCoordinate,
        snappedTargetCoordinate,
      });
      return;
    }
    if (
      isCampaignTerrainUvPassable(campaignMap, snappedTargetU, snappedTargetV) !== true
    ) {
      debugCampaignMapClick("viewport:blocked-impassable", {
        clickTarget,
        targetCoordinate,
        snappedTargetCoordinate,
      });
      return;
    }

    const targetMapNode = resolveCampaignMapNodeAtCoordinate({
      mapDefinition: currentMapDefinition,
      coordinate: snappedTargetCoordinate,
      ...(campaignCoordinateSystem == null
        ? {}
        : { coordinateSystem: campaignCoordinateSystem }),
    });
    const cityId = targetMapNode?.cityId ?? null;
    const cityName =
      cityId == null
        ? targetMapNode?.label ?? null
        : activeContentContext.cityNameById[cityId] ??
          targetMapNode?.label ??
          null;

    debugCampaignMapClick("viewport:start-travel", {
      clickTarget,
      targetCoordinate,
      snappedTargetCoordinate,
      cityId,
      cityName,
      nodeId: targetMapNode?.id ?? null,
    });
    startCampaignTravel(
      snappedTargetCoordinate,
      cityId,
      cityName
    );
  }
});

appElement.addEventListener("mouseover", (event) => {
  const targetElement = event.target;
  if (!(targetElement instanceof HTMLElement)) {
    return;
  }

  const configuredButtonHoverSoundEffect =
    resolveButtonHoverSoundEffectFromTarget(targetElement);
  const hoverSoundButton = targetElement.closest<HTMLElement>(
    "[data-button-hover-sound]"
  );
  if (
    configuredButtonHoverSoundEffect != null &&
    hoverSoundButton != null &&
    !(
      event.relatedTarget instanceof Node &&
      hoverSoundButton.contains(event.relatedTarget)
    )
  ) {
    queueButtonSoundEffect(configuredButtonHoverSoundEffect);
  }

  const cityMapBuildingLabel = targetElement.closest<HTMLElement>(
    "[data-city-map-building-label-id]"
  );
  if (cityMapBuildingLabel != null) {
    syncCityMapBuildingLabelHover(cityMapBuildingLabel, true);
  }
});

appElement.addEventListener("mouseout", (event) => {
  const targetElement = event.target;
  if (!(targetElement instanceof HTMLElement)) {
    return;
  }

  const cityMapBuildingLabel = targetElement.closest<HTMLElement>(
    "[data-city-map-building-label-id]"
  );
  if (cityMapBuildingLabel == null) {
    return;
  }

  if (
    event.relatedTarget instanceof Node &&
    cityMapBuildingLabel.contains(event.relatedTarget)
  ) {
    return;
  }

  syncCityMapBuildingLabelHover(cityMapBuildingLabel, false);
});

appElement.addEventListener("focusin", (event) => {
  const targetElement = event.target;
  if (!(targetElement instanceof HTMLElement)) {
    return;
  }

  const cityMapBuildingLabel = targetElement.closest<HTMLElement>(
    "[data-city-map-building-label-id]"
  );
  if (cityMapBuildingLabel != null) {
    syncCityMapBuildingLabelHover(cityMapBuildingLabel, true);
  }
});

appElement.addEventListener("focusout", (event) => {
  const targetElement = event.target;
  if (!(targetElement instanceof HTMLElement)) {
    return;
  }

  const cityMapBuildingLabel = targetElement.closest<HTMLElement>(
    "[data-city-map-building-label-id]"
  );
  if (cityMapBuildingLabel == null) {
    return;
  }

  if (
    event.relatedTarget instanceof Node &&
    cityMapBuildingLabel.contains(event.relatedTarget)
  ) {
    return;
  }

  syncCityMapBuildingLabelHover(cityMapBuildingLabel, false);
});

function handleModalConfirm() {
  if (appState.modalState == null) {
    return;
  }

  if (appState.modalState.type === "travel-confirm") {
    const travelPath = createCampaignTravelPath(appState.modalState.targetCoordinate);
    if (travelPath == null) {
      return;
    }
    const nextCoordinate = getLastTravelPathCoordinate(travelPath);
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

    const travelRequestId = campaignTravelRequestId + 1;
    campaignTravelRequestId = travelRequestId;
    stopCampaignMoveAnimation();
    appState = {
      ...appState,
      campaignTravelState: {
        targetCoordinate: nextCoordinate,
        cityId: appState.modalState.cityId,
        cityName: appState.modalState.cityName,
      },
      modalState: null,
      locationDialogueState: null,
    };
    renderApp();
    void animateCampaignMovePath(
      travelPath,
      () => campaignTravelRequestId === travelRequestId
    ).then(() => {
      if (campaignTravelRequestId !== travelRequestId) {
        return;
      }

      const shouldEnterCity =
        appState.campaignTravelState != null &&
        appState.campaignTravelState.targetCoordinate.x === nextCoordinate.x &&
        appState.campaignTravelState.targetCoordinate.y === nextCoordinate.y;
      let nextAppState = {
        ...appState,
        campaignTravelState: null,
        modalState: shouldEnterCity ? pendingEnterCityState : null,
        locationDialogueState: null,
      };
      const currentMapDefinition = getCurrentMapDefinition();
      if (currentMapDefinition != null) {
        nextAppState = {
          ...nextAppState,
          gameState: revealCampaignMapHexesForCoordinate(
            nextAppState.gameState,
            currentMapDefinition,
            nextCoordinate,
            getCurrentCampaignHexCoordinateSystem() ?? undefined
          ),
        };
      }
      const runtimeCommit = commitRuntimeRequest({
        state: nextAppState,
        request: createAdvanceTimeSegmentsRequest(1),
        context: createRuntimeCommitContext({
          router: {
            route: ({ state, request }) => routeTimeRuntime({ state, request }),
          },
          followUp: {
            handleOutcome: ({ state, outcome }) =>
              navigationTimeFollowUp.applyOutcome({ state, outcome }),
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
        route: ({ state, request }) => routeNavigationRuntime({ state, request }),
      },
      followUp: {
        handleOutcome: ({ state, outcome }) =>
          navigationTimeFollowUp.applyOutcome({ state, outcome }),
      },
    }),
  });
  appState = runtimeCommit.state;
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

function debugCampaignMapClick(
  eventName: string,
  details: Record<string, unknown> = {}
): void {
  const payload = {
    event: eventName,
    view: appState.gameState.ui.currentView,
    autoAdvance: appState.autoAdvanceState != null,
    modalType: appState.modalState?.type ?? null,
    overlayView: appState.gameState.ui.overlayView,
    ...details,
  };
  window.console.info(
    `[RPG_TG_DEBUG][campaign-map-click] ${JSON.stringify(payload)}`
  );
}

function debugNpcInteraction(
  eventName: string,
  details: Record<string, unknown> = {}
): void {
  const payload = {
    event: eventName,
    view: appState.gameState.ui.currentView,
    modalType: appState.modalState?.type ?? null,
    overlayView: appState.gameState.ui.overlayView,
    activeNpcSession: appState.gameState.ui.npcInteractionSession,
    ...details,
  };
  window.console.info(
    `[RPG_TG_DEBUG][npc-interaction] ${JSON.stringify(payload)}`
  );
}

function describeNearestCampaignMarker(
  campaignMap: HTMLElement,
  clientX: number,
  clientY: number
): Record<string, unknown> {
  const markers = Array.from(
    campaignMap.querySelectorAll<HTMLElement>(".c-campaign-marker")
  );
  const measuredMarkers = markers.map((marker) => {
    const rect = marker.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return {
      marker,
      markerId: marker.dataset.campaignMarkerId ?? null,
      cityId: marker.dataset.cityId || null,
      nodeId: marker.dataset.mapNodeId ?? null,
      ready: marker.hasAttribute("data-terrain-projection-ready"),
      hidden: marker.hidden,
      disabled: marker.hasAttribute("disabled"),
      pointerEvents: window.getComputedStyle(marker).pointerEvents,
      rect: {
        left: Math.round(rect.left),
        top: Math.round(rect.top),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      },
      distance: Math.hypot(centerX - clientX, centerY - clientY),
    };
  });
  measuredMarkers.sort((left, right) => left.distance - right.distance);
  const nearest = measuredMarkers[0] ?? null;

  return {
    markerCount: markers.length,
    markerReadyCount: markers.filter((marker) =>
      marker.hasAttribute("data-terrain-projection-ready")
    ).length,
    markerVisibleCount: markers.filter((marker) => !marker.hidden).length,
    nearestMarker:
      nearest == null
        ? null
        : {
            markerId: nearest.markerId,
            cityId: nearest.cityId,
            nodeId: nearest.nodeId,
            ready: nearest.ready,
            hidden: nearest.hidden,
            disabled: nearest.disabled,
            pointerEvents: nearest.pointerEvents,
            rect: nearest.rect,
            distance: Math.round(nearest.distance),
          },
  };
}

function startCampaignTravel(
  targetCoordinate: GridCoordinate,
  cityId: string | null,
  cityName: string | null
): void {
  debugCampaignMapClick("startCampaignTravel:requested", {
    targetCoordinate,
    cityId,
    cityName,
    playerCoordinate: appState.playerCoordinate,
  });
  const travelPath = createCampaignTravelPath(targetCoordinate);
  if (travelPath == null) {
    debugCampaignMapClick("startCampaignTravel:no-path", {
      targetCoordinate,
      cityId,
      cityName,
      playerCoordinate: appState.playerCoordinate,
    });
    return;
  }
  queueTroopSelectionSoundEffect(TROOP_SELECTION_SOUND);
  const nextCoordinate = getLastTravelPathCoordinate(travelPath);
  debugCampaignMapClick("startCampaignTravel:path-created", {
    targetCoordinate,
    nextCoordinate,
    cityId,
    cityName,
    pathLength: travelPath.length,
  });
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

  void animateCampaignMovePath(
    travelPath,
    () => campaignTravelRequestId === travelRequestId
  ).then(() => {
    if (campaignTravelRequestId !== travelRequestId) {
      return;
    }

    const activeTravelState = appState.campaignTravelState;
    const shouldEnterCity =
      activeTravelState != null &&
      activeTravelState.targetCoordinate.x === nextCoordinate.x &&
      activeTravelState.targetCoordinate.y === nextCoordinate.y;
    let nextAppState = {
      ...appState,
      campaignTravelState: null,
      modalState: shouldEnterCity ? pendingEnterCityState : null,
      locationDialogueState: null,
    };
    const currentMapDefinition = getCurrentMapDefinition();
    if (currentMapDefinition != null) {
      nextAppState = {
        ...nextAppState,
        gameState: revealCampaignMapHexesForCoordinate(
          nextAppState.gameState,
          currentMapDefinition,
          nextCoordinate,
          getCurrentCampaignHexCoordinateSystem() ?? undefined
        ),
      };
    }
    const runtimeCommit = commitRuntimeRequest({
      state: nextAppState,
      request: createAdvanceTimeSegmentsRequest(1),
      context: createRuntimeCommitContext({
        router: {
          route: ({ state, request }) => routeTimeRuntime({ state, request }),
        },
        followUp: {
          handleOutcome: ({ state, outcome }) =>
            navigationTimeFollowUp.applyOutcome({ state, outcome }),
        },
      }),
    });
    appState = runtimeCommit.state;
    renderApp();
  });
}

function createCampaignTravelPath(targetCoordinate: GridCoordinate): GridCoordinate[] | null {
  const currentMapDefinition = getCurrentMapDefinition();
  const campaignCoordinateSpace =
    currentMapDefinition?.mode === "campaign"
      ? currentMapDefinition.coordinateSpace ?? null
      : null;
  const campaignCoordinateSystem = getCurrentCampaignHexCoordinateSystem();
  ensureCurrentCampaignRevealForCoordinateSystem(campaignCoordinateSystem);
  const snappedTargetCoordinate =
    campaignCoordinateSpace == null
      ? targetCoordinate
      : snapCoordinateToHexCenter(
          targetCoordinate,
          campaignCoordinateSpace,
          campaignCoordinateSystem ?? undefined
        );
  const nextCoordinate = travelToCoordinate(
    appState.playerCoordinate,
    snappedTargetCoordinate
  );

  if (
    currentMapDefinition?.mode !== "campaign" ||
    currentMapDefinition.coordinateSpace == null
  ) {
    return [appState.playerCoordinate, nextCoordinate];
  }
  if (!isCurrentCampaignCoordinateClickable(nextCoordinate)) {
    return null;
  }

  const travelGrid = getCampaignTerrainTravelGrid(appRoot);
  if (travelGrid == null) {
    return null;
  }

  return createPassableHexTravelPath({
    currentCoordinate: appState.playerCoordinate,
    targetCoordinate: nextCoordinate,
    coordinateSpace: currentMapDefinition.coordinateSpace,
    travelGrid,
    ...(campaignCoordinateSystem == null
      ? {}
      : { coordinateSystem: campaignCoordinateSystem }),
  });
}

function hideCampaignHoverHexOutline(): void {
  const hoverOutline = appRoot.querySelector<SVGSVGElement>(
    "[data-campaign-hover-hex='true']"
  );
  const polygonElement = hoverOutline?.querySelector<SVGPolygonElement>(
    "[data-campaign-hover-hex-polygon='true']"
  );
  hoverOutline?.setAttribute("hidden", "");
  polygonElement?.setAttribute("points", "");
}

const CAMPAIGN_HOVER_HEX_EDGE_SEGMENTS = 5;

function updateCampaignHoverHexOutline(event: PointerEvent): void {
  if (
    appState.gameState.ui.currentView !== "map" ||
    campaignMapDragState != null ||
    isInitialCampaignMapDebugAnimating()
  ) {
    hideCampaignHoverHexOutline();
    return;
  }

  const hitElement = document.elementFromPoint(event.clientX, event.clientY);
  if (!(hitElement instanceof HTMLElement)) {
    hideCampaignHoverHexOutline();
    return;
  }

  if (hitElement.closest(".c-campaign-map-debug") != null) {
    hideCampaignHoverHexOutline();
    return;
  }

  const campaignMap = hitElement.closest<HTMLElement>(
    "[data-campaign-map-viewport]"
  );
  const currentMapDefinition = getCurrentMapDefinition();
  const coordinateSpace = currentMapDefinition?.coordinateSpace ?? null;
  const hoverOutline = campaignMap?.querySelector<SVGSVGElement>(
    "[data-campaign-hover-hex='true']"
  );
  const polygonElement = hoverOutline?.querySelector<SVGPolygonElement>(
    "[data-campaign-hover-hex-polygon='true']"
  );
  if (
    campaignMap == null ||
    currentMapDefinition?.mode !== "campaign" ||
    coordinateSpace == null ||
    hoverOutline == null ||
    polygonElement == null
  ) {
    hideCampaignHoverHexOutline();
    return;
  }

  const clickTarget = resolveCampaignTerrainUvFromClientPosition(
    campaignMap,
    event.clientX,
    event.clientY
  );
  if (clickTarget == null) {
    hideCampaignHoverHexOutline();
    return;
  }

  const targetCoordinate = {
    x: clickTarget.u * coordinateSpace.width,
    y: (1 - clickTarget.v) * coordinateSpace.height,
  };
  const coordinateSystem = getCampaignTerrainHexCoordinateSystem(campaignMap);
  ensureCurrentCampaignRevealForCoordinateSystem(coordinateSystem);
  const hoverHex = coordinateToRoundedHex(
    targetCoordinate,
    coordinateSpace,
    coordinateSystem ?? undefined
  );
  const hoverCenterCoordinate = snapCoordinateToHexCenter(
    targetCoordinate,
    coordinateSpace,
    coordinateSystem ?? undefined
  );
  const hoverCenterU = hoverCenterCoordinate.x / coordinateSpace.width;
  const hoverCenterV = 1 - hoverCenterCoordinate.y / coordinateSpace.height;
  if (!isCurrentCampaignCoordinateClickable(hoverCenterCoordinate)) {
    hideCampaignHoverHexOutline();
    return;
  }
  if (
    isCampaignTerrainUvPassable(campaignMap, hoverCenterU, hoverCenterV) !== true
  ) {
    hideCampaignHoverHexOutline();
    return;
  }
  if (createCampaignTravelPath(hoverCenterCoordinate) == null) {
    hideCampaignHoverHexOutline();
    return;
  }

  const mapRect = campaignMap.getBoundingClientRect();
  if (mapRect.width <= 0 || mapRect.height <= 0) {
    hideCampaignHoverHexOutline();
    return;
  }

  const hoverHexPolygon = hexToCoordinatePolygon({
    hex: hoverHex,
    coordinateSpace,
    ...(coordinateSystem == null ? {} : { coordinateSystem }),
    radiusScale: 1.015,
  });
  const hoverHexOutlineCoordinates = createTerrainFollowingHexOutlineCoordinates(
    hoverHexPolygon
  );
  const points: string[] = [];
  for (const outlineCoordinate of hoverHexOutlineCoordinates) {
    const outlineU = outlineCoordinate.x / coordinateSpace.width;
    const outlineV = 1 - outlineCoordinate.y / coordinateSpace.height;
    const projectedPoint = projectCampaignTerrainUvToClientPointAtHeightAnchor(
      campaignMap,
      outlineU,
      outlineV,
      outlineU,
      outlineV
    );
    if (projectedPoint == null) {
      hideCampaignHoverHexOutline();
      return;
    }

    points.push(
      `${(projectedPoint.clientX - mapRect.left).toFixed(2)},${(projectedPoint.clientY - mapRect.top).toFixed(2)}`
    );
  }

  hoverOutline.setAttribute(
    "viewBox",
    `0 0 ${mapRect.width.toFixed(2)} ${mapRect.height.toFixed(2)}`
  );
  polygonElement.setAttribute("points", points.join(" "));
  hoverOutline.removeAttribute("hidden");
}

function createTerrainFollowingHexOutlineCoordinates(
  polygon: GridCoordinate[]
): GridCoordinate[] {
  const outlineCoordinates: GridCoordinate[] = [];

  for (let cornerIndex = 0; cornerIndex < polygon.length; cornerIndex += 1) {
    const from = polygon[cornerIndex];
    const to = polygon[(cornerIndex + 1) % polygon.length];
    if (from == null || to == null) {
      continue;
    }

    for (let segmentIndex = 0; segmentIndex < CAMPAIGN_HOVER_HEX_EDGE_SEGMENTS; segmentIndex += 1) {
      const amount = segmentIndex / CAMPAIGN_HOVER_HEX_EDGE_SEGMENTS;
      outlineCoordinates.push({
        x: from.x + (to.x - from.x) * amount,
        y: from.y + (to.y - from.y) * amount,
      });
    }
  }

  return outlineCoordinates;
}

function getLastTravelPathCoordinate(path: GridCoordinate[]): GridCoordinate {
  return path[path.length - 1] ?? appState.playerCoordinate;
}

async function animateCampaignMovePath(
  path: GridCoordinate[],
  shouldContinue: () => boolean
): Promise<void> {
  if (path.length <= 1) {
    syncCampaignActorRuntimeState(
      getLastTravelPathCoordinate(path),
      appState.campaignActorState.facingDegrees,
      false
    );
    renderApp();
    return;
  }

  for (let index = 1; index < path.length; index += 1) {
    if (!shouldContinue()) {
      return;
    }

    const from = path[index - 1] ?? appState.playerCoordinate;
    const to = path[index] ?? from;
    await animateCampaignMove(from, to);
  }

  syncCampaignActorRuntimeState(
    getLastTravelPathCoordinate(path),
    appState.campaignActorState.facingDegrees,
    false
  );
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
  appState = {
    ...appState,
    playerCoordinate: coordinate,
    campaignActorState: {
      facingDegrees,
      isMoving,
    },
  };
  const nextAppState = revealCampaignMapAroundAppCoordinate(appState, coordinate, {
    animateNewHexes: true,
    ...(getCurrentCampaignHexCoordinateSystem() == null
      ? {}
      : { coordinateSystem: getCurrentCampaignHexCoordinateSystem() as HexCoordinateSystem }),
  });
  if (nextAppState !== appState) {
    appState = nextAppState;
  }
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
  const coordinateSystem = getCurrentCampaignHexCoordinateSystem();
  ensureCurrentCampaignRevealForCoordinateSystem(coordinateSystem);

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
      "[data-campaign-map-terrain], [data-campaign-map-actor-layer], [data-campaign-map-fog], [data-campaign-map-cloud]"
    )
  );
  return canvases.length === 0 ? null : canvases;
}

let cachedCampaignTerrainCanvases: HTMLCanvasElement[] | null = null;
let cachedCampaignMarkers: Map<string, HTMLElement> | null = null;
const CAMPAIGN_OPENING_REVEAL_RETRY_INTERVAL_MS = 120;
const CAMPAIGN_OPENING_REVEAL_MAX_RETRIES = 50;
let campaignOpeningRevealRetryTimeoutId: number | null = null;
let campaignOpeningRevealRetryCount = 0;

function shouldKeepCampaignMapStageAlive(
  view: AppState["gameState"]["ui"]["currentView"]
): boolean {
  return (
    view === "map" ||
    view === "troop-editor" ||
    view === "troop-management"
  );
}

function clearCampaignOpeningRevealRetry(): void {
  campaignOpeningRevealRetryCount = 0;
  if (campaignOpeningRevealRetryTimeoutId == null) {
    return;
  }

  window.clearTimeout(campaignOpeningRevealRetryTimeoutId);
  campaignOpeningRevealRetryTimeoutId = null;
}

function scheduleCampaignOpeningRevealRetry(): void {
  if (
    campaignOpeningRevealRetryTimeoutId != null ||
    campaignOpeningRevealRetryCount >= CAMPAIGN_OPENING_REVEAL_MAX_RETRIES
  ) {
    return;
  }

  campaignOpeningRevealRetryCount += 1;
  campaignOpeningRevealRetryTimeoutId = window.setTimeout(() => {
    campaignOpeningRevealRetryTimeoutId = null;
    if (appState.gameState.ui.currentView === "map") {
      renderApp();
    }
  }, CAMPAIGN_OPENING_REVEAL_RETRY_INTERVAL_MS);
}

function syncPreservedCanvasAttributes(
  preservedCanvas: HTMLCanvasElement,
  replacementCanvas: HTMLCanvasElement
): void {
  for (const attribute of Array.from(preservedCanvas.attributes)) {
    if (
      attribute.name.startsWith("data-") ||
      attribute.name === "aria-label" ||
      attribute.name === "aria-hidden"
    ) {
      preservedCanvas.removeAttribute(attribute.name);
    }
  }

  for (const attribute of Array.from(replacementCanvas.attributes)) {
    if (
      attribute.name.startsWith("data-") ||
      attribute.name === "aria-label" ||
      attribute.name === "aria-hidden"
    ) {
      preservedCanvas.setAttribute(attribute.name, attribute.value);
    }
  }
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
      "[data-campaign-map-terrain], [data-campaign-map-actor-layer], [data-campaign-map-fog], [data-campaign-map-cloud]"
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

    syncPreservedCanvasAttributes(preservedCanvas, replacementCanvas);
    replacementCanvas.replaceWith(preservedCanvas);
  });
}

function getCampaignMarkerStableKey(element: HTMLElement): string | null {
  if (element.dataset.campaignMarkerId != null) {
    return `marker:${element.dataset.campaignMarkerId}`;
  }
  if (element.dataset.campaignMarkerSummaryId != null) {
    return `summary:${element.dataset.campaignMarkerSummaryId}`;
  }

  return null;
}

function captureCampaignMarkerElements(
  root: ParentNode
): Map<string, HTMLElement> | null {
  const markerElements = Array.from(
    root.querySelectorAll<HTMLElement>(
      "[data-campaign-marker-id], [data-campaign-marker-summary-id]"
    )
  );
  if (markerElements.length === 0) {
    return null;
  }

  const preservedElements = new Map<string, HTMLElement>();
  for (const markerElement of markerElements) {
    const stableKey = getCampaignMarkerStableKey(markerElement);
    if (stableKey != null) {
      preservedElements.set(stableKey, markerElement);
    }
  }

  return preservedElements.size === 0 ? null : preservedElements;
}

function captureCoinRewardLayer(root: ParentNode): HTMLElement | null {
  const layer = root.querySelector<HTMLElement>("[data-ui-coin-reward-layer]");
  if (layer == null) {
    return null;
  }

  layer.remove();
  return layer;
}

function captureCityCardDrawOverlay(root: ParentNode): HTMLElement | null {
  const state = appState.cityCardDrawTestState;
  if (state == null) {
    return null;
  }

  const overlay = root.querySelector<HTMLElement>("[data-city-card-draw-overlay]");
  if (
    overlay == null ||
    overlay.dataset.cityCardDrawSessionId !== String(state.sessionId)
  ) {
    return null;
  }

  overlay.remove();
  return overlay;
}

function getPachinkoFortuneCardOverlayDrawKey(overlay: ParentNode): string | null {
  const mount = overlay.querySelector<HTMLElement>(
    "[data-pachinko-fortune-card-mount]"
  );
  return mount?.dataset.pachinkoFortuneCardDrawKey ?? null;
}

function isPachinkoFortuneCardOverlayDrawing(overlay: ParentNode): boolean {
  const cardRoot = overlay.querySelector<HTMLElement>(
    "[data-pachinko-fortune-card-state]"
  );
  return cardRoot?.dataset.pachinkoFortuneCardState === "drawing-card";
}

function capturePachinkoFortuneCardDrawOverlay(
  root: ParentNode
): PreservedPachinkoFortuneCardDrawOverlay | null {
  const overlay = root.querySelector<HTMLElement>(
    "[data-activity-overlay='pachinko-fortune-card'], [data-house-overlay='pachinko-fortune-card']"
  );
  if (overlay == null || !isPachinkoFortuneCardOverlayDrawing(overlay)) {
    return null;
  }

  const drawKey = getPachinkoFortuneCardOverlayDrawKey(overlay);
  if (drawKey == null) {
    return null;
  }

  overlay.remove();
  return {
    overlay,
    drawKey,
  };
}

function syncPreservedCampaignMarkerAttributes(
  preservedElement: HTMLElement,
  replacementElement: HTMLElement
): void {
  const dynamicProjectionAttributes = new Set([
    "style",
    "hidden",
    "data-terrain-projection-ready",
  ]);

  for (const attribute of Array.from(preservedElement.attributes)) {
    if (dynamicProjectionAttributes.has(attribute.name)) {
      continue;
    }
    if (!replacementElement.hasAttribute(attribute.name)) {
      preservedElement.removeAttribute(attribute.name);
    }
  }

  for (const attribute of Array.from(replacementElement.attributes)) {
    if (dynamicProjectionAttributes.has(attribute.name)) {
      continue;
    }
    preservedElement.setAttribute(attribute.name, attribute.value);
  }
}

function restoreCampaignMarkerElements(
  root: ParentNode,
  preservedElements: Map<string, HTMLElement> | null
): void {
  if (preservedElements == null || preservedElements.size === 0) {
    return;
  }

  const replacementElements = Array.from(
    root.querySelectorAll<HTMLElement>(
      "[data-campaign-marker-id], [data-campaign-marker-summary-id]"
    )
  );
  for (const replacementElement of replacementElements) {
    const stableKey = getCampaignMarkerStableKey(replacementElement);
    const preservedElement =
      stableKey == null ? null : preservedElements.get(stableKey) ?? null;
    if (preservedElement == null) {
      continue;
    }

    syncPreservedCampaignMarkerAttributes(preservedElement, replacementElement);
    replacementElement.replaceWith(preservedElement);
  }
}

function restoreCoinRewardLayer(
  root: ParentNode,
  preservedLayer: HTMLElement | null
): void {
  if (preservedLayer == null) {
    return;
  }

  const replacementLayer = root.querySelector<HTMLElement>(
    "[data-ui-coin-reward-layer]"
  );
  if (replacementLayer == null) {
    return;
  }

  replacementLayer.replaceWith(preservedLayer);
}

function restoreCityCardDrawOverlay(
  root: ParentNode,
  preservedOverlay: HTMLElement | null
): void {
  if (preservedOverlay == null) {
    return;
  }

  const replacementOverlay = root.querySelector<HTMLElement>(
    "[data-city-card-draw-overlay]"
  );
  if (replacementOverlay == null) {
    return;
  }

  replacementOverlay.replaceWith(preservedOverlay);
}

function restorePachinkoFortuneCardDrawOverlay(
  root: ParentNode,
  preservedOverlay: PreservedPachinkoFortuneCardDrawOverlay | null
): void {
  if (preservedOverlay == null) {
    return;
  }

  const replacementOverlay = root.querySelector<HTMLElement>(
    "[data-activity-overlay='pachinko-fortune-card'], [data-house-overlay='pachinko-fortune-card']"
  );
  if (
    replacementOverlay == null ||
    !isPachinkoFortuneCardOverlayDrawing(replacementOverlay) ||
    getPachinkoFortuneCardOverlayDrawKey(replacementOverlay) !==
      preservedOverlay.drawKey
  ) {
    return;
  }

  replacementOverlay.replaceWith(preservedOverlay.overlay);
}

let mapReturnEffectTimeoutId: number | null = null;

function scheduleMapReturnEffectProcessing(delayMs: number | null): void {
  if (mapReturnEffectTimeoutId != null) {
    window.clearTimeout(mapReturnEffectTimeoutId);
    mapReturnEffectTimeoutId = null;
  }

  if (delayMs == null) {
    return;
  }

  mapReturnEffectTimeoutId = window.setTimeout(() => {
    mapReturnEffectTimeoutId = null;
    if (syncMapReturnEffects(Date.now())) {
      renderApp();
    }
  }, delayMs);
}

function syncMapReturnEffects(nowMs: number = Date.now()): boolean {
  const result = processMapReturnEffects({
    state: appState.gameState,
    characterDefinitions: appState.characterDefinitions,
    nowMs,
  });
  const didChange =
    result.state !== appState.gameState ||
    result.characterDefinitions !== appState.characterDefinitions;

  if (didChange) {
    appState = {
      ...appState,
      gameState: result.state,
      characterDefinitions: result.characterDefinitions,
    };
  }

  scheduleMapReturnEffectProcessing(result.nextDelayMs);
  return didChange;
}

function renderApp() {
  if (syncRenderedFortuneBoardOverlay()) {
    return;
  }

  const activeScaleInput = document.activeElement;
  const focusedScaleInput =
    activeScaleInput instanceof HTMLInputElement &&
    activeScaleInput.hasAttribute("data-campaign-map-scale-input")
      ? {
          value: activeScaleInput.value,
          selectionStart: activeScaleInput.selectionStart,
          selectionEnd: activeScaleInput.selectionEnd,
        }
      : null;
  renderAppFrame(focusedScaleInput);
}

function renderAppFrame(
  focusedScaleInput: {
    value: string;
    selectionStart: number | null;
    selectionEnd: number | null;
  } | null = null
) {
  appState = {
    ...appState,
    gameState: ensureCityNpcPoolsForCurrentDay(
      appState.gameState,
      activeContentContext.cityNpcPools
    ),
  };
  appState = {
    ...appState,
    gameState: {
      ...appState.gameState,
      runtime: {
        ...appState.gameState.runtime,
        troops: normalizeTroopRuntimeStateUnitDefinitions(
          appState.gameState.runtime.troops
        ),
      },
    },
  };
  syncMapReturnEffects();
  const currentMapDefinition = getCurrentMapDefinition();
  const currentCityDefinition =
    activeContentContext.cityDefinitionById[appState.gameState.world.currentCityId] ??
    activeContentContext.cities[0] ??
    null;
  assertExists(currentMapDefinition, "Missing active map definition for render.");
  assertExists(currentCityDefinition, "Missing active city definition for render.");
  if (shouldKeepCampaignMapStageAlive(appState.gameState.ui.currentView)) {
    const capturedTerrainCanvases = captureCampaignTerrainCanvases(appRoot);
    if (capturedTerrainCanvases != null) {
      cachedCampaignTerrainCanvases = capturedTerrainCanvases;
    }

    const capturedCampaignMarkers = captureCampaignMarkerElements(appRoot);
    if (capturedCampaignMarkers != null) {
      cachedCampaignMarkers = capturedCampaignMarkers;
    }
  } else {
    cachedCampaignTerrainCanvases = null;
    cachedCampaignMarkers = null;
  }
  const preservedTerrainCanvases = shouldKeepCampaignMapStageAlive(
    appState.gameState.ui.currentView
  )
    ? cachedCampaignTerrainCanvases
    : null;
  const preservedCampaignMarkers = shouldKeepCampaignMapStageAlive(
    appState.gameState.ui.currentView
  )
    ? cachedCampaignMarkers
    : null;
  const preservedCoinRewardLayer = captureCoinRewardLayer(appRoot);
  const preservedCityCardDrawOverlay = captureCityCardDrawOverlay(appRoot);
  const preservedPachinkoFortuneCardDrawOverlay =
    capturePachinkoFortuneCardDrawOverlay(appRoot);
  const presenterOutput = createAppPresenterOutput({
    appState,
    playerCharacterId: currentPlayerCharacterId,
    cityDefinition: currentCityDefinition,
    cityDefinitions: activeContentContext.cities,
    houseDefinitions: activeContentContext.houses,
    cityEntries: activeContentContext.cityEntries,
    cityNpcPoolDefinitions: activeContentContext.cityNpcPools,
    cityNameById: activeContentContext.cityNameById,
    textEntriesById: activeContentContext.textEntriesById,
    citySceneMappingsByCityId: getZhuYuanzhangCitySceneMappingByCityId(),
    sceneDefinitionsById: activeContentContext.storyContent.sceneDefinitionsById,
  });
  syncAppAudio();

  dialogueTypewriterRuntimeHandle?.destroy();
  dialogueTypewriterRuntimeHandle = null;
  appRoot.innerHTML = renderAppMarkup({
    appState,
    playerCharacterId: currentPlayerCharacterId,
    coinRewardDisplayValue,
    coinRewardAnchorEditor: {
      isOpen: coinRewardAnchorEditorState.isOpen,
      draftX: coinRewardAnchorEditorState.draftOffsetX,
      draftY: coinRewardAnchorEditorState.draftOffsetY,
      isDirty: isCoinRewardAnchorEditorDirty(),
    },
    mapDefinition: currentMapDefinition,
    cityDefinition: currentCityDefinition,
    cityDefinitions: activeContentContext.cities,
    houseDefinitions: activeContentContext.houses,
    cityEntries: activeContentContext.cityEntries,
    cardDefinitions: activeContentContext.cards,
    cityNpcPoolDefinitions: activeContentContext.cityNpcPools,
    cityCoordinatesById: activeContentContext.cityCoordinatesById,
    cityNameById: activeContentContext.cityNameById,
    houseNameById: activeContentContext.houseNameById,
    characterNameById: activeContentContext.characterNameById,
    textEntriesById: activeContentContext.textEntriesById,
    cityPortraits: activeContentContext.cityPortraits,
    citySceneMappingsByCityId: getZhuYuanzhangCitySceneMappingByCityId(),
    historicalCharacters: activeContentContext.historicalCharacters,
    historicalCityRosters: activeContentContext.historicalCityRosters,
    presenterOutput,
  });
  restoreCampaignTerrainCanvases(appRoot, preservedTerrainCanvases);
  restoreCampaignMarkerElements(appRoot, preservedCampaignMarkers);
  restoreCoinRewardLayer(appRoot, preservedCoinRewardLayer);
  restoreCityCardDrawOverlay(appRoot, preservedCityCardDrawOverlay);
  restorePachinkoFortuneCardDrawOverlay(
    appRoot,
    preservedPachinkoFortuneCardDrawOverlay
  );
  syncCampaignMapDebugView();
  syncCampaignTerrainStyleView();
  restoreCampaignMapScaleInputFocus(focusedScaleInput);
  syncMapIntroOverlay();
  syncStoryChapterTitleOverlay();
  syncActivityQteLoop();
  syncPachinkoFortuneCardDrawOverlay();
  if (appState.gameState.ui.currentView === "map") {
    syncCampaignTerrainWebGl(appRoot);
    const campaignCoordinateSystem = getCurrentCampaignHexCoordinateSystem();
    if (campaignCoordinateSystem == null) {
      scheduleCampaignOpeningRevealRetry();
      syncCampaignCloudWebGl(appRoot);
      return;
    }
    clearCampaignOpeningRevealRetry();
    const didRevealCurrentCampaignHexes =
      ensureCurrentCampaignRevealForCoordinateSystem(campaignCoordinateSystem);
    if (didRevealCurrentCampaignHexes) {
      renderAppFrame(focusedScaleInput);
      return;
    }
    syncCampaignCloudWebGl(appRoot);
    scheduleMapIntroOverlayAfterTerrainReady();
  } else if (!shouldKeepCampaignMapStageAlive(appState.gameState.ui.currentView)) {
    clearCampaignOpeningRevealRetry();
    syncCampaignTerrainWebGl(appRoot);
    const didRevealCurrentCampaignHexes =
      ensureCurrentCampaignRevealForCoordinateSystem(getCurrentCampaignHexCoordinateSystem());
    if (didRevealCurrentCampaignHexes) {
      renderAppFrame(focusedScaleInput);
      return;
    }
    syncCampaignCloudWebGl(appRoot);
  }
  syncCampaignCloudTextureScaleControl();
  syncCityCardDrawTestOverlay();
  syncCityBeggingDefaultDialogueOverlay();
  syncCityBeggingMiniGameOverlay(appRoot, appState.beggingMiniGameState);
  syncCityStageDomRuntime();
  syncCoinRewardAnimatorTarget();
  syncCoinRewardAnchorEditor();
  syncCoinRewardAnchorEditorView();
  syncCoinRewardGoldDisplay();
  syncTroopEditorInteractions(appRoot, {
    onOpenTroopManagement: (input) => {
      appState = openTroopManagement(appState, input);
      renderApp();
    },
    onDisbandTroop: (input) => {
      commitTroopRuntimeMutation(disbandTroopManagementUnit(appState, input));
    },
    onCreateTeam: (input) => {
      commitTroopRuntimeMutation(createTroopEditorTeam(appState, input));
    },
    onSwapTeams: (input) => {
      commitTroopRuntimeMutation(swapTroopEditorTeams(appState, input));
    },
    onDismissReserveUnit: (input) => {
      commitTroopRuntimeMutation(dismissTroopEditorReserveUnit(appState, input));
    },
    onPurchaseShopOffer: (input) => {
      commitTroopRuntimeMutation(purchaseTroopEditorShopOffer(appState, input));
    },
  });
  syncTroopManagementBattlePreview(appRoot);
  syncTroopManagementMoveInteractions(appRoot, {
    onSelectUnit: () => {
      queueTroopSelectionSoundEffect(TROOP_SELECTION_SOUND);
    },
    onMoveUnit: (input) => {
      commitTroopRuntimeMutation(moveTroopManagementUnit(appState, input));
    },
    onAddUnit: (input) => {
      commitTroopRuntimeMutation(addTroopManagementUnitFromReserve(appState, input));
    },
    onRemoveUnit: (input) => {
      commitTroopRuntimeMutation(removeTroopManagementUnit(appState, input));
    },
    onClearTroop: (input) => {
      commitTroopRuntimeMutation(clearTroopManagementUnit(appState, input), {
        mutationSoundRepeatCount: 4,
        mutationSoundRepeatDelayMs: 100,
      });
    },
    onDisbandTroop: (input) => {
      commitTroopRuntimeMutation(disbandTroopManagementUnit(appState, input), {
        closeTroopManagementAfter: true,
      });
    },
  });
  syncEmbeddedBattleUiEditor();
  dialogueTypewriterRuntimeHandle = syncDialogueTypewriterRuntime(appRoot);
}

function syncCityStageDomRuntime(): void {
  if (appState.gameState.ui.currentView !== "city") {
    cityStageDomRuntimeHandle?.destroy();
    cityStageDomRuntimeHandle = null;
    return;
  }

  const stageRoot = appRoot.querySelector<HTMLElement>("[data-city-stage-root]");
  const cityId = appState.gameState.world.currentCityId;
  if (stageRoot == null || cityId == null) {
    cityStageDomRuntimeHandle?.destroy();
    cityStageDomRuntimeHandle = null;
    return;
  }

  if (cityStageDomRuntimeHandle?.cityId === cityId) {
    cityStageDomRuntimeHandle.attach(stageRoot);
    return;
  }

  cityStageDomRuntimeHandle?.destroy();
  cityStageDomRuntimeHandle = mountCityStageDomRuntime(stageRoot, { cityId });
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
  return (
    actionId === "temple-work-stop" ||
    actionId === "tavern-work-stop" ||
    actionId === "temple-work-board-play" ||
    actionId === "temple-work-board-wager-minus" ||
    actionId === "temple-work-board-wager-plus"
  );
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

function shouldDispatchActivityActionOnPointerDown(action: string): boolean {
  return (
    action === "stop-qte" ||
    action === "play-board" ||
    action === "wager-minus" ||
    action === "wager-plus"
  );
}

function shouldSuppressPointerDispatchedActivityClick(action: string): boolean {
  if (recentPointerDispatchedActivityAction == null) {
    return false;
  }

  const elapsedMs =
    window.performance.now() - recentPointerDispatchedActivityAction.timestamp;
  const shouldSuppress =
    recentPointerDispatchedActivityAction.action === action && elapsedMs < 500;

  if (shouldSuppress || elapsedMs >= 500) {
    recentPointerDispatchedActivityAction = null;
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
    cancelCampaignMapZoomAnimation();
    setCampaignMapDebugState(campaignMapDebugHomeState);
    return;
  }

  if (action === "terrain-style-reset") {
    setCampaignTerrainStyleState(DEFAULT_CAMPAIGN_TERRAIN_STYLE);
    return;
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

function handleCampaignCloudTextureScaleInput(inputElement: HTMLInputElement): void {
  const nextValue = Number(inputElement.value);
  if (!Number.isFinite(nextValue)) {
    return;
  }

  campaignCloudTextureScaleBoostState = setCampaignCloudTextureScaleBoost(
    clampCampaignCloudTextureScaleBoost(nextValue)
  );
  syncCampaignCloudTextureScaleControl();
  requestCampaignCloudRender();
}

function clampCampaignCloudTextureScaleBoost(value: number): number {
  return clamp(
    value,
    MIN_CAMPAIGN_CLOUD_TEXTURE_SCALE_BOOST,
    MAX_CAMPAIGN_CLOUD_TEXTURE_SCALE_BOOST
  );
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
  const mapHomeState = createCurrentCampaignMapHomeDebugState();
  campaignMapDebugState = { ...mapHomeState };
  campaignMapDebugHomeState = { ...mapHomeState };
  syncCampaignMapDebugView();
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

    campaignMapDebugHomeState = {
      ...TARGET_CAMPAIGN_MAP_DEBUG_STATE,
    };
    initialCampaignMapDebugAnimationFrame = null;
    scheduleGameStartStoryAfterMapIntroFade(elapsedMs);
  };

  initialCampaignMapDebugAnimationFrame = window.requestAnimationFrame(animate);
}

function scheduleGameStartStoryAfterMapIntroFade(elapsedMs: number): void {
  if (initialMapIntroStoryTriggerTimeoutId != null) {
    window.clearTimeout(initialMapIntroStoryTriggerTimeoutId);
  }

  const remainingIntroMs = Math.max(0, MAP_INTRO_OVERLAY_DURATION_MS - elapsedMs);
  initialMapIntroStoryTriggerTimeoutId = window.setTimeout(() => {
    initialMapIntroStoryTriggerTimeoutId = null;
    hasAppliedInitialCampaignMapDebug = true;
    hideMapIntroOverlay();
    triggerGameStartStoryAfterInitialMapIntro();
  }, remainingIntroMs);
}

function triggerGameStartStoryAfterInitialMapIntro(): void {
  const result = mainRuntimeOrchestrator.execute({
    type: "trigger-current-story-events",
    timing: "game-start",
  });
  if (result.didChange && result.shouldRender) {
    renderApp();
  }
}

function scheduleMapIntroOverlayAfterTerrainReady(): void {
  if (
    !isGameVisible ||
    pendingInitialCampaignMapIntroTerrainReady ||
    hasStartedInitialCampaignMapDebugAnimation ||
    hasAppliedInitialCampaignMapDebug ||
    appState.gameState.ui.currentView !== "map"
  ) {
    return;
  }

  pendingInitialCampaignMapIntroTerrainReady = true;
  void waitForCampaignTerrainReady(appRoot).then(() => {
    pendingInitialCampaignMapIntroTerrainReady = false;
    if (appState.gameState.ui.currentView !== "map") {
      return;
    }

    startInitialCampaignMapDebugAnimationIfNeeded();
  });
}

function scheduleInitialMapIntroAfterLoading(): void {
  if (!isGameVisible) {
    return;
  }

  scheduleMapIntroOverlayAfterTerrainReady();
}

function interpolateCampaignMapDebugState(progress: number): CampaignMapDebugState {
  void progress;
  return {
    ...campaignMapDebugHomeState,
  };
}

function createCurrentCampaignMapHomeDebugState(): CampaignMapDebugState {
  const mapDefinition = getCurrentMapDefinition();
  if (mapDefinition?.mode !== "campaign" || mapDefinition.coordinateSpace == null) {
    return { ...TARGET_CAMPAIGN_MAP_DEBUG_STATE };
  }

  return createCampaignTerrainCameraCenteredOnCoordinate({
    coordinate: appState.playerCoordinate,
    coordinateSpace: mapDefinition.coordinateSpace,
    scale: TARGET_CAMPAIGN_MAP_DEBUG_STATE.scale,
  });
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
  activeMapIntroOverlay = null;
  pendingInitialCampaignMapIntroTerrainReady = false;
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

function clearStoryChapterTitle(): void {
  if (storyChapterTitleAutoAdvanceTimeoutId != null) {
    window.clearTimeout(storyChapterTitleAutoAdvanceTimeoutId);
    storyChapterTitleAutoAdvanceTimeoutId = null;
  }

  if (readStoryChapterTitleText(appState.gameState).length === 0) {
    return;
  }

  appState = {
    ...appState,
    gameState: {
      ...appState.gameState,
      runtime: {
        ...appState.gameState.runtime,
        variables: {
          ...appState.gameState.runtime.variables,
          [STORY_PRESENTATION_VARIABLE_KEYS.chapterTitleText]: "",
        },
      },
    },
  };
}

function syncStoryChapterTitleOverlay(): void {
  const chapterTitleText = readStoryChapterTitleText(appState.gameState);
  if (chapterTitleText.length === 0) {
    if (storyChapterTitleAutoAdvanceTimeoutId != null) {
      window.clearTimeout(storyChapterTitleAutoAdvanceTimeoutId);
      storyChapterTitleAutoAdvanceTimeoutId = null;
    }
    return;
  }

  if (storyChapterTitleAutoAdvanceTimeoutId != null) {
    return;
  }

  storyChapterTitleAutoAdvanceTimeoutId = window.setTimeout(() => {
    storyChapterTitleAutoAdvanceTimeoutId = null;
    clearStoryChapterTitle();
    advanceCurrentStoryScene();
  }, 4000);
}

function zoomCampaignMapAtScreenCenter(nextScale: number): void {
  startCampaignMapZoomAnimation(createCampaignMapZoomTargetState(nextScale));
}

function createCampaignMapZoomTargetState(nextScale: number): CampaignMapDebugState {
  const clampedScale = clamp(
    nextScale,
    MAP_DEBUG_MIN_SCALE,
    MAP_DEBUG_MAX_SCALE
  );
  const currentScale = Math.max(campaignMapDebugState.scale, 0.0001);
  const scaleRatio = clampedScale / currentScale;
  const tiltScaleRatio =
    getCampaignMapTiltConstrainedScaleFactor(clampedScale) /
    getCampaignMapTiltConstrainedScaleFactor(currentScale);

  return {
    scale: clampedScale,
    offsetX: campaignMapDebugState.offsetX * scaleRatio,
    offsetY: campaignMapDebugState.offsetY * tiltScaleRatio,
  };
}

function startCampaignMapZoomAnimation(targetState: CampaignMapDebugState): void {
  cancelCampaignMapZoomCloudResume();
  beginCampaignCloudInteraction("zoom");

  if (campaignMapZoomAnimationState != null) {
    campaignMapZoomAnimationState.target = targetState;
    return;
  }

  campaignMapZoomAnimationState = {
    frameId: null,
    target: targetState,
    lastFrameMs: null,
  };

  scheduleCampaignMapZoomAnimationFrame();
}

function scheduleCampaignMapZoomAnimationFrame(): void {
  if (
    campaignMapZoomAnimationState == null ||
    campaignMapZoomAnimationState.frameId != null
  ) {
    return;
  }

  campaignMapZoomAnimationState.frameId =
    window.requestAnimationFrame(animateCampaignMapZoom);
}

function animateCampaignMapZoom(timestamp: number): void {
  if (campaignMapZoomAnimationState == null) {
    return;
  }

  const targetState = campaignMapZoomAnimationState.target;
  const lastFrameMs = campaignMapZoomAnimationState.lastFrameMs ?? timestamp;
  const elapsedMs = Math.max(0, timestamp - lastFrameMs);
  campaignMapZoomAnimationState.frameId = null;
  campaignMapZoomAnimationState.lastFrameMs = timestamp;

  const progress = clamp(
    elapsedMs / CAMPAIGN_MAP_ZOOM_ANIMATION_DURATION_MS,
    0,
    1
  );
  const easedProgress = easeOutCubic(progress);
  setCampaignMapDebugState(
    interpolateCampaignMapState(
      campaignMapDebugState,
      targetState,
      easedProgress
    )
  );

  if (isCampaignMapZoomStateSettled(campaignMapDebugState, targetState)) {
    setCampaignMapDebugState(targetState);
    campaignMapZoomAnimationState = null;
    scheduleCampaignMapZoomCloudResume();
    return;
  }

  scheduleCampaignMapZoomAnimationFrame();
}

function cancelCampaignMapZoomAnimation(
  options: { keepCloudInteraction?: boolean } = {}
): void {
  if (campaignMapZoomAnimationState?.frameId != null) {
    window.cancelAnimationFrame(campaignMapZoomAnimationState.frameId);
  }
  campaignMapZoomAnimationState = null;
  if (options.keepCloudInteraction !== true) {
    cancelCampaignMapZoomCloudResume();
    endCampaignCloudInteraction("zoom");
  }
}

function scheduleCampaignMapZoomCloudResume(): void {
  cancelCampaignMapZoomCloudResume();
  campaignMapZoomCloudResumeTimeoutId = window.setTimeout(() => {
    campaignMapZoomCloudResumeTimeoutId = null;
    endCampaignCloudInteraction("zoom");
  }, CAMPAIGN_MAP_ZOOM_CLOUD_IDLE_RESUME_DELAY_MS);
}

function cancelCampaignMapZoomCloudResume(): void {
  if (campaignMapZoomCloudResumeTimeoutId == null) {
    return;
  }

  window.clearTimeout(campaignMapZoomCloudResumeTimeoutId);
  campaignMapZoomCloudResumeTimeoutId = null;
}

function interpolateCampaignMapState(
  from: CampaignMapDebugState,
  to: CampaignMapDebugState,
  progress: number
): CampaignMapDebugState {
  const interpolatedScale = from.scale + (to.scale - from.scale) * progress;
  const fromScale = Math.max(from.scale, 0.0001);
  const toScale = Math.max(to.scale, 0.0001);
  const interpolatedTiltScaleFactor =
    getCampaignMapTiltConstrainedScaleFactor(interpolatedScale);
  const fromTiltScaleFactor = getCampaignMapTiltConstrainedScaleFactor(fromScale);
  const toTiltScaleFactor = getCampaignMapTiltConstrainedScaleFactor(toScale);
  const normalizedOffsetX =
    from.offsetX / fromScale +
    (to.offsetX / toScale - from.offsetX / fromScale) * progress;
  const normalizedOffsetY =
    from.offsetY / fromTiltScaleFactor +
    (to.offsetY / toTiltScaleFactor - from.offsetY / fromTiltScaleFactor) *
      progress;

  return {
    scale: interpolatedScale,
    offsetX: normalizedOffsetX * interpolatedScale,
    offsetY: normalizedOffsetY * interpolatedTiltScaleFactor,
  };
}

function getCampaignMapTiltConstrainedScaleFactor(scale: number): number {
  const safeScale = Math.max(scale, 0.0001);
  const tiltCos = Math.cos(getCampaignTerrainCameraTiltRadiansForScale(safeScale));
  const safeTiltCos = Math.abs(tiltCos) < 0.0001 ? 1 : tiltCos;

  return safeScale * safeTiltCos;
}

function setCampaignMapDebugState(nextState: CampaignMapDebugState): void {
  campaignMapDebugState = {
    scale: clamp(nextState.scale, MAP_DEBUG_MIN_SCALE, MAP_DEBUG_MAX_SCALE),
    offsetX: Math.round(nextState.offsetX),
    offsetY: Math.round(nextState.offsetY),
  };
  hideCampaignHoverHexOutline();
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
  requestCampaignCloudRender();

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

function syncCampaignCloudTextureScaleControl(): void {
  campaignCloudTextureScaleBoostState = getCampaignCloudTextureScaleBoost();
  const inputElement = appRoot.querySelector<HTMLInputElement>(
    "[data-campaign-cloud-texture-scale-input]"
  );
  const valueElement = appRoot.querySelector<HTMLElement>(
    "[data-campaign-cloud-texture-scale-value]"
  );
  const formattedValue = campaignCloudTextureScaleBoostState.toFixed(2);

  if (inputElement != null && inputElement !== document.activeElement) {
    inputElement.value = formattedValue;
  }
  if (valueElement != null) {
    valueElement.textContent = `${formattedValue}x`;
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
  const shouldUpdateHoverOutline = !campaignMapDragState.didMove;
  campaignMapDragState = null;
  endCampaignCloudInteraction("drag");
  if (shouldUpdateHoverOutline) {
    updateCampaignHoverHexOutline(event);
  }
}

function isCampaignMapZoomStateSettled(
  currentState: CampaignMapDebugState,
  targetState: CampaignMapDebugState
): boolean {
  const scaleDelta = Math.abs(currentState.scale - targetState.scale);
  const offsetDelta = Math.max(
    Math.abs(currentState.offsetX - targetState.offsetX),
    Math.abs(currentState.offsetY - targetState.offsetY)
  );

  return (
    scaleDelta <= CAMPAIGN_MAP_ZOOM_SETTLE_SCALE_EPSILON &&
    offsetDelta <= CAMPAIGN_MAP_ZOOM_SETTLE_OFFSET_EPSILON_PX
  );
}

function easeOutCubic(value: number): number {
  const clampedValue = clamp(value, 0, 1);

  return 1 - (1 - clampedValue) ** 3;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
