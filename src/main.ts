import "./styles/app.css";
import { ensureCityNpcPoolsForCurrentDay } from "./application/city-npcs/refresh-city-npc-pools";
import {
  selectLayoutEditorComponent,
  selectLayoutEditorElement,
  setLayoutEditorBackgroundAsset,
  setLayoutEditorBackgroundAssetQuery,
  setLayoutEditorBackgroundMode,
  setLayoutEditorBackgroundSlice,
  setLayoutEditorComponentRectField,
  setLayoutEditorElementRectField,
  toggleLayoutEditor,
  updateLayoutEditorComponentPosition,
  updateLayoutEditorElementPosition,
} from "./application/layout-editor/layout-editor-actions";
import {
  closeCityDirectory,
  equipValuable,
  openCityDirectory,
  selectCard,
  selectValuable,
  setCardFilter,
  setValuableFilter,
  setValuableSort,
  updateOverlayView,
} from "./application/app-actions";
import type { AppState } from "./application/app-shell";
import { selectLeaderResidenceOptions } from "./application/city-entries/select-leader-residence-options";
import {
  createHouseRuntime,
  type HouseRuntime,
} from "./application/house/house-runtime";
import { canEnterHouseForStoryStage } from "./application/story/story-stage-access";
import { enterCity } from "./application/navigation/enter-city";
import {
  travelToCoordinate,
  type GridCoordinate,
} from "./application/navigation/travel-to-coordinate";
import { createInitialState } from "./application/state/create-initial-state";
import {
  createPrototypeCharactersForStoryStage,
  prototypeCards,
  prototypeCharacters,
  prototypeCityEntries,
  prototypeCity,
  prototypeCities,
  prototypeHistoricalCharacterIdByCharacterId,
  prototypeCityNpcPools,
  prototypeCityPortraits,
  prototypeHouses,
  prototypeValuables,
} from "./content/prototype-world";
import {
  createDefaultGlobalHudLayout,
  globalHudBackgroundOptions,
} from "./content/layout-editor-presets";
import { yuanmoCampaignMap } from "./content/yuanmo-campaign-map";
import {
  zhuYuanzhangCityRosters,
  zhuYuanzhangEarlyCharacters,
} from "./content/zhu-yuanzhang-early-characters";
import type { CharacterDefinition } from "./domain/character";
import type {
  CardLibraryFilter,
  ValuableLibraryFilter,
  ValuableLibrarySortKey,
} from "./domain/global-ui";
import { KEEP_HOUSE_VARIABLE_KEYS } from "./domain/keep-house";
import { LEADER_RESIDENCE_VARIABLE_KEYS } from "./domain/leader-residence";
import type {
  UiLayoutBackgroundMode,
  UiLayoutComponent,
  UiLayoutRect,
} from "./domain/ui-layout";
import type { ValuableItemId } from "./domain/valuable-item";
import {
  ZHU_YUANZHANG_STORY_STAGES,
  ZHU_YUANZHANG_STORY_VARIABLE_KEYS,
  type ZhuYuanzhangStoryStage,
} from "./domain/zhu-yuanzhang-story";
import { assertExists } from "./shared/assert";
import { renderApp as renderAppMarkup } from "./ui/app-render";
import { MainUiFlow } from "./ui/main-ui/main-ui-flow.js";
import {
  requestCampaignTerrainRender,
  setCampaignTerrainCamera,
  syncCampaignTerrainWebGl,
} from "./ui/views/map/campaign-terrain-webgl";

const GAME_VIEWPORT_WIDTH = 1600;
const GAME_VIEWPORT_HEIGHT = 900;
const MAP_DEBUG_MIN_SCALE = 0.5;
const MAP_DEBUG_MAX_SCALE = 40;
const MAP_DEBUG_SCALE_STEP = 0.2;
const INITIAL_MAP_DEBUG_ANIMATION_DURATION_MS = 5000;
const CAMPAIGN_TRAVEL_SPEED_SCALE = 0.6;
const CAMPAIGN_TRAVEL_MS_PER_MAP_UNIT = 55 / CAMPAIGN_TRAVEL_SPEED_SCALE;
const CAMPAIGN_TRAVEL_MIN_DURATION_MS = 1400 / CAMPAIGN_TRAVEL_SPEED_SCALE;
const CAMPAIGN_TRAVEL_MAX_DURATION_MS = 18000 / CAMPAIGN_TRAVEL_SPEED_SCALE;
const CAMPAIGN_TURN_DEGREES_PER_SECOND = 180;
const OPENING_BGM_URL = new URL("../BGM/开局.mp3", import.meta.url).href;
const IN_GAME_BGM_URL = new URL("../BGM/游戏内.mp3", import.meta.url).href;
const INITIAL_CAMPAIGN_MAP_DEBUG_STATE: CampaignMapDebugState = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
};
const TARGET_CAMPAIGN_MAP_DEBUG_STATE: CampaignMapDebugState = {
  scale: 40,
  offsetX: -5695,
  offsetY: 5918,
};

type CampaignMapDebugState = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

type SaveDataResult = {
  selectedCharacterId?: string | null;
} | null;

type BackgroundMusicMode = "opening" | "in-game";

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
const selectableCharacterIds = [
  "char.player",
  "char.kulan_xu_da",
  "char.kulan_tang_he",
  "char.kulan_chang_yuchun",
] as const;
const cityDefinitions = prototypeCities;
const mapNodeById = Object.fromEntries(
  yuanmoCampaignMap.nodes
    .filter((mapNode) => mapNode.id != null)
    .map((mapNode) => [mapNode.id as string, mapNode])
);
const cityCoordinatesById: Record<string, GridCoordinate> = Object.fromEntries(
  cityDefinitions.map((cityDefinition) => {
    assertExists(
      cityDefinition.mapNodeId,
      `Missing map node id for city "${cityDefinition.id}".`
    );
    const mapNode = mapNodeById[cityDefinition.mapNodeId];
    assertExists(
      mapNode,
      `Missing campaign map node "${cityDefinition.mapNodeId}" for city "${cityDefinition.id}".`
    );
    return [cityDefinition.id, { x: mapNode.x, y: mapNode.y }];
  })
);
const cityDefinitionById = Object.fromEntries(
  cityDefinitions.map((cityDefinition) => [cityDefinition.id, cityDefinition])
);
const cityNameById = Object.fromEntries(
  cityDefinitions.map((cityDefinition) => [
    cityDefinition.id,
    cityDefinition.name,
  ])
);
const houseNameById = Object.fromEntries(
  prototypeHouses.map((houseDefinition) => [
    houseDefinition.id,
    houseDefinition.name,
  ])
);
const characterNameById = Object.fromEntries(
  prototypeCharacters.map((characterDefinition) => [
    characterDefinition.id,
    characterDefinition.name,
  ])
);
const selectableCharacters = selectableCharacterIds.map((characterId) => {
  const characterDefinition = prototypeCharacters.find(
    (candidateCharacter) => candidateCharacter.id === characterId
  );
  assertExists(
    characterDefinition,
    `Selectable character not found for id "${characterId}".`
  );
  return characterDefinition;
});

let currentPlayerCharacterId = defaultPlayerCharacterId;

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
let layoutEditorDragState:
  | {
      mode: "component" | "element";
      componentId: string;
      elementId: string | null;
      pointerId: number;
      startClientX: number;
      startClientY: number;
    }
  | null = null;
let campaignMoveAnimationState: CampaignMoveAnimationState | null = null;

let houseRuntime: HouseRuntime = createHouseRuntimeInstance();
const backgroundMusicPlayer = createBackgroundMusicPlayer();
const mainUiFlow = new MainUiFlow({
  overlayRoot: uiOverlayElement,
  characters: selectableCharacters,
  onStartGame: startMainGame,
  loadSaveData,
});

syncGameViewport();
window.addEventListener("resize", syncGameViewport);
setGameVisibility(false);
mainUiFlow.mount();
mainUiFlow.showMainMenu();

function createPrototypeAppState(playerCharacterId: string): AppState {
  const storyStage: ZhuYuanzhangStoryStage =
    playerCharacterId === defaultPlayerCharacterId
      ? ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
      : ZHU_YUANZHANG_STORY_STAGES.guoZixingCamp;
  const storyCharacterDefinitions =
    createPrototypeCharactersForStoryStage(storyStage);
  let nextAppState: AppState = {
    gameState: ensureCityNpcPoolsForCurrentDay(
      createInitialState({
        currentMapId: yuanmoCampaignMap.id,
        currentCityId: prototypeCity.id,
        currentHouseId: null,
        playerCharacterId,
        chapterId: "chapter.prototype",
        year: 1567,
        month: 1,
        day: 1,
        pinnedCharacterId: playerCharacterId,
        reviewDateText: "距离评定 40 天",
        mainHouseMissionText: "前往评定会场",
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
        currentView: "map",
      }),
      prototypeCityNpcPools
    ),
    characterDefinitions: storyCharacterDefinitions,
    playerCoordinate: yuanmoCampaignMap.initialPlayerCoordinate ?? { x: 0, y: 0 },
    campaignActorState: {
      facingDegrees: 0,
      isMoving: false,
    },
    campaignTravelState: null,
    modalState: null,
    cityDirectoryState: null,
    uiLayouts: {
      globalHud: createDefaultGlobalHudLayout(),
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
            ? "今日评定"
            : nextAppState.gameState.ui.reviewDateText,
        mainHouseMissionText:
          storyStage === ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
            ? "前往皇觉寺听候住持训示"
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

function createHouseRuntimeInstance(): HouseRuntime {
  return createHouseRuntime({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp,
    houseDefinitions: prototypeHouses,
    playerCharacterId: currentPlayerCharacterId,
  });
}

function loadSaveData(): SaveDataResult {
  // Placeholder for future save loading integration.
  return null;
}

function startMainGame(selectedCharacter: CharacterDefinition): void {
  resetMainGameRuntime();
  currentPlayerCharacterId = selectedCharacter.id;
  appState = createPrototypeAppState(currentPlayerCharacterId);
  houseRuntime = createHouseRuntimeInstance();
  setGameVisibility(true);
  mainUiFlow.hide();
  renderApp();
}

function setGameVisibility(isVisible: boolean): void {
  appRoot.style.visibility = isVisible ? "visible" : "hidden";
  appRoot.style.pointerEvents = isVisible ? "auto" : "none";
  syncBackgroundMusic(isVisible ? "in-game" : "opening");
}

function resetMainGameRuntime(): void {
  houseRuntime.clearAllHouseIntervals();

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

window.addEventListener("pointerdown", resumeBackgroundMusicIfNeeded, {
  passive: true,
});
window.addEventListener("keydown", resumeBackgroundMusicIfNeeded);

function getSelectedLayoutComponent(): UiLayoutComponent | null {
  return (
    appState.uiLayouts.globalHud.components.find(
      (component) => component.id === appState.layoutEditor.selectedComponentId
    ) ??
    appState.uiLayouts.globalHud.components[0] ??
    null
  );
}

async function copyCurrentLayoutParams(): Promise<void> {
  const payload = {
    targetId: appState.layoutEditor.selectedTargetId,
    selectedComponentId: appState.layoutEditor.selectedComponentId,
    selectedElementId: appState.layoutEditor.selectedElementId,
    layout: appState.uiLayouts.globalHud,
  };
  await navigator.clipboard.writeText(`${JSON.stringify(payload, null, 2)}\n`);
}

appElement.addEventListener("input", (event) => {
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
    houseRuntime.dispatchCurrentHouseRequest({
      type: "field",
      fieldId,
      value: targetElement.value,
    });
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
  zoomCampaignMapAtScreenCenter(
    campaignMapDebugState.scale + direction * MAP_DEBUG_SCALE_STEP
  );
});

appElement.addEventListener("pointerdown", (event) => {
  const targetElement = event.target;
  if (!(targetElement instanceof HTMLElement)) {
    return;
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
  if (
    layoutEditorDragState != null &&
    layoutEditorDragState.pointerId === event.pointerId
  ) {
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
    } else if (layoutEditorDragState.elementId != null) {
      appState = updateLayoutEditorElementPosition(
        appState,
        layoutEditorDragState.componentId,
        layoutEditorDragState.elementId,
        deltaX,
        deltaY
      );
    }

    renderApp();
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
      appState = setCardFilter(appState, filter, prototypeCards);
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

  const closeLayoutEditorButton = targetElement.closest<HTMLElement>(
    "[data-action='close-layout-editor']"
  );
  if (closeLayoutEditorButton != null) {
    appState = toggleLayoutEditor(appState, false);
    renderApp();
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
    appState = {
      ...appState,
      cityDirectoryState: null,
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

  const cityEntryButton = targetElement.closest<HTMLElement>(
    "[data-city-entry-id]"
  );
  if (cityEntryButton != null) {
    const cityEntryId = cityEntryButton.dataset.cityEntryId;
    const cityEntry = prototypeCityEntries.find(
      (entryDefinition) =>
        entryDefinition.id === cityEntryId &&
        entryDefinition.cityId === appState.gameState.world.currentCityId
    );
    if (cityEntry?.directoryType === "leader-residence") {
      appState = openCityDirectory(appState, {
        type: cityEntry.directoryType,
        title: cityEntry.name,
        targetHouseId: cityEntry.targetHouseId,
        options: selectLeaderResidenceOptions(
          appState.gameState,
          appState.characterDefinitions,
          cityEntry,
          {
            historicalCharacters: zhuYuanzhangEarlyCharacters,
            historicalCharacterIdByCharacterId:
              prototypeHistoricalCharacterIdByCharacterId,
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
      houseRuntime.enterHouseById(targetHouseId);
    }
    return;
  }

  const houseActionButton = targetElement.closest<HTMLElement>(
    "[data-house-action]"
  );
  if (houseActionButton != null) {
    const actionId = houseActionButton.dataset.houseAction;
    if (actionId != null) {
      houseRuntime.dispatchCurrentHouseRequest({
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
    houseRuntime.leaveCurrentHouse();
    return;
  }

  const houseButton = targetElement.closest<HTMLElement>("[data-house-id]");
  if (houseButton != null) {
    const houseId = houseButton.dataset.houseId;
    if (houseId != null) {
      const houseDefinition = prototypeHouses.find(
        (candidateHouse) => candidateHouse.id === houseId
      );
      if (
        houseDefinition == null ||
        !canEnterHouseForStoryStage(
          appState.gameState,
          appState.characterDefinitions,
          houseDefinition
        )
      ) {
        return;
      }

      houseRuntime.enterHouseById(houseId);
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

  const mapCell = targetElement.closest<HTMLElement>("[data-map-x][data-map-y]");
  if (mapCell != null && appState.gameState.ui.currentView === "map") {
    const xValue = Number(mapCell.dataset.mapX);
    const yValue = Number(mapCell.dataset.mapY);
    const cityId = mapCell.dataset.cityId || null;
    const mapNodeName = mapCell.dataset.mapNodeName || null;
    const cityName =
      mapNodeName ?? (cityId == null ? null : cityNameById[cityId] ?? null);

    appState = {
      ...appState,
      modalState: {
        type: "travel-confirm",
        targetCoordinate: { x: xValue, y: yValue },
        cityId,
        cityName,
      },
    };
    renderApp();
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
    };
    renderApp();
    void animateCampaignMove(previousCoordinate, nextCoordinate).then(() => {
      const shouldEnterCity =
        appState.campaignTravelState != null &&
        appState.campaignTravelState.targetCoordinate.x === nextCoordinate.x &&
        appState.campaignTravelState.targetCoordinate.y === nextCoordinate.y;
      appState = {
        ...appState,
        campaignTravelState: null,
        modalState: shouldEnterCity ? pendingEnterCityState : null,
      };
      renderApp();
    });
    return;
  }

  houseRuntime.clearAllHouseIntervals();
  appState = {
    ...appState,
    gameState: enterCity(appState.gameState, appState.modalState.cityId),
    modalState: null,
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

  stopCampaignMoveAnimation();
  appState = {
    ...appState,
    campaignTravelState: null,
    campaignActorState: {
      ...appState.campaignActorState,
      isMoving: false,
    },
  };
  renderApp();
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

  const coordinateSpace = yuanmoCampaignMap.coordinateSpace;
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
    root.querySelectorAll<HTMLCanvasElement>("[data-campaign-map-terrain]")
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
    root.querySelectorAll<HTMLCanvasElement>("[data-campaign-map-terrain]")
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
      prototypeCityNpcPools
    ),
  };
  const preservedTerrainCanvases =
    appState.gameState.ui.currentView === "map"
      ? captureCampaignTerrainCanvases(appRoot)
      : null;

  appRoot.innerHTML = renderAppMarkup({
    appState,
    playerCharacterId: currentPlayerCharacterId,
    mapDefinition: yuanmoCampaignMap,
    cityDefinition: prototypeCity,
    cityDefinitions,
    houseDefinitions: prototypeHouses,
    cityEntries: prototypeCityEntries,
    cardDefinitions: prototypeCards,
    cityNpcPoolDefinitions: prototypeCityNpcPools,
    cityCoordinatesById,
    cityNameById,
    houseNameById,
    characterNameById,
    cityPortraits: prototypeCityPortraits,
    historicalCharacters: zhuYuanzhangEarlyCharacters,
    historicalCityRosters: zhuYuanzhangCityRosters,
  });
  restoreCampaignTerrainCanvases(appRoot, preservedTerrainCanvases);
  startInitialCampaignMapDebugAnimationIfNeeded();
  syncCampaignMapDebugView();
  syncMapIntroOverlay();
  syncCampaignTerrainWebGl(appRoot);
}

function syncGameViewport(): void {
  const scale = Math.min(
    window.innerWidth / GAME_VIEWPORT_WIDTH,
    window.innerHeight / GAME_VIEWPORT_HEIGHT
  );

  appRoot.style.setProperty("--game-width", `${GAME_VIEWPORT_WIDTH}px`);
  appRoot.style.setProperty("--game-height", `${GAME_VIEWPORT_HEIGHT}px`);
  appRoot.style.setProperty("--game-scale", `${scale}`);
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
  showMapIntroOverlay("第一章·淮西托钵");

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
      showMapIntroOverlay("第一章·淮西托钵");
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
      appRoot.querySelector<HTMLElement>(
        layoutEditorDragState.mode === "component"
          ? `[data-layout-component-handle="${layoutEditorDragState.componentId}"]`
          : `[data-layout-element-handle="${layoutEditorDragState.componentId}:${layoutEditorDragState.elementId}"]`
      ) ?? null;
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
