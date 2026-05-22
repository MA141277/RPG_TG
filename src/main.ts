import "./styles/app.css";
import { ensureCityNpcPoolsForCurrentDay } from "./application/city-npcs/refresh-city-npc-pools";
import {
  equipValuable,
  selectCard,
  selectValuable,
  setCardFilter,
  setValuableFilter,
  setValuableSort,
  updateOverlayView,
} from "./application/app-actions";
import type { AppState } from "./application/app-shell";
import { createHouseRuntime } from "./application/house/house-runtime";
import { enterCity } from "./application/navigation/enter-city";
import {
  travelToCoordinate,
  type GridCoordinate,
} from "./application/navigation/travel-to-coordinate";
import { createInitialState } from "./application/state/create-initial-state";
import {
  prototypeCards,
  prototypeCharacters,
  prototypeCity,
  prototypeCities,
  prototypeCityNpcPools,
  prototypeCityPortraits,
  prototypeHouses,
  prototypeValuables,
} from "./content/prototype-world";
import { yuanmoCampaignMap } from "./content/yuanmo-campaign-map";
import type {
  CardLibraryFilter,
  ValuableLibraryFilter,
  ValuableLibrarySortKey,
} from "./domain/global-ui";
import { KEEP_HOUSE_VARIABLE_KEYS } from "./domain/keep-house";
import type { ValuableItemId } from "./domain/valuable-item";
import { assertExists } from "./shared/assert";
import { renderApp as renderAppMarkup } from "./ui/app-render";
import {
  setCampaignTerrainCamera,
  syncCampaignTerrainWebGl,
} from "./ui/views/map/campaign-terrain-webgl";

const GAME_VIEWPORT_WIDTH = 1600;
const GAME_VIEWPORT_HEIGHT = 900;
const MAP_DEBUG_MIN_SCALE = 0.5;
const MAP_DEBUG_MAX_SCALE = 6;
const MAP_DEBUG_SCALE_STEP = 0.2;

type CampaignMapDebugState = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

const appElement = document.querySelector<HTMLElement>("#app");

if (appElement == null) {
  throw new Error("Missing #app mount point.");
}

const appRoot = appElement;
const playerCharacterId = "char.player";
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

let appState: AppState = {
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
  characterDefinitions: [...prototypeCharacters],
  playerCoordinate: yuanmoCampaignMap.initialPlayerCoordinate ?? { x: 0, y: 0 },
  modalState: null,
};
appState = {
  ...appState,
  gameState: {
    ...appState.gameState,
    runtime: {
      ...appState.gameState.runtime,
      variables: {
        ...appState.gameState.runtime.variables,
        [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 0,
      },
    },
  },
};
let campaignMapDebugState: CampaignMapDebugState = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
};
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

const houseRuntime = createHouseRuntime({
  getAppState: () => appState,
  setAppState: (nextAppState) => {
    appState = nextAppState;
  },
  renderApp,
  houseDefinitions: prototypeHouses,
  playerCharacterId,
});

syncGameViewport();
window.addEventListener("resize", syncGameViewport);
renderApp();

appElement.addEventListener("input", (event) => {
  const targetElement = event.target;
  if (!(targetElement instanceof HTMLInputElement)) {
    return;
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
  setCampaignMapDebugState({
    ...campaignMapDebugState,
    scale:
      campaignMapDebugState.scale + direction * MAP_DEBUG_SCALE_STEP,
  });
});

appElement.addEventListener("pointerdown", (event) => {
  const targetElement = event.target;
  if (!(targetElement instanceof HTMLElement)) {
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

  const leaveCityButton = targetElement.closest<HTMLElement>(
    "[data-action='leave-city']"
  );
  if (leaveCityButton != null) {
    houseRuntime.clearAllHouseIntervals();
    appState = {
      ...appState,
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
      houseRuntime.enterHouseById(houseId);
    }
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

    appState = {
      ...appState,
      playerCoordinate: nextCoordinate,
      modalState: reachedCityDefinition != null
        ? {
            type: "enter-city-confirm",
            cityId: reachedCityDefinition.id,
            cityName: reachedCityDefinition.name,
          }
        : null,
    };
    renderApp();
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

function renderApp() {
  appState = {
    ...appState,
    gameState: ensureCityNpcPoolsForCurrentDay(
      appState.gameState,
      prototypeCityNpcPools
    ),
  };

  appRoot.innerHTML = renderAppMarkup({
    appState,
    playerCharacterId,
    mapDefinition: yuanmoCampaignMap,
    cityDefinition: prototypeCity,
    houseDefinitions: prototypeHouses,
    cardDefinitions: prototypeCards,
    cityNpcPoolDefinitions: prototypeCityNpcPools,
    cityCoordinatesById,
    cityNameById,
    houseNameById,
    characterNameById,
    cityPortraits: prototypeCityPortraits,
  });
  syncCampaignMapDebugView();
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
    setCampaignMapDebugState({
      ...campaignMapDebugState,
      scale: campaignMapDebugState.scale + MAP_DEBUG_SCALE_STEP,
    });
    return;
  }

  if (action === "zoom-out") {
    setCampaignMapDebugState({
      ...campaignMapDebugState,
      scale: campaignMapDebugState.scale - MAP_DEBUG_SCALE_STEP,
    });
    return;
  }

  if (action === "reset") {
    setCampaignMapDebugState({ scale: 1, offsetX: 0, offsetY: 0 });
  }
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
