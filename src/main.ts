import "./styles/app.css";
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
  prototypeCityPortraits,
  prototypeHouses,
  prototypeMap,
  prototypeValuables,
} from "./content/prototype-world";
import type {
  CardLibraryFilter,
  ValuableLibraryFilter,
  ValuableLibrarySortKey,
} from "./domain/global-ui";
import type { ValuableItemId } from "./domain/valuable-item";
import { assertExists } from "./shared/assert";
import { renderApp as renderAppMarkup } from "./ui/app-render";

const GAME_VIEWPORT_WIDTH = 1600;
const GAME_VIEWPORT_HEIGHT = 900;

const appElement = document.querySelector<HTMLElement>("#app");

if (appElement == null) {
  throw new Error("Missing #app mount point.");
}

const appRoot = appElement;
const playerCharacterId = "char.player";
const cityCoordinatesById: Record<string, GridCoordinate> = {
  [prototypeCity.id]: { x: 2, y: 2 },
};
const prototypeCityCoordinateCandidate = cityCoordinatesById[prototypeCity.id];
assertExists(
  prototypeCityCoordinateCandidate,
  `Missing city coordinate for "${prototypeCity.id}".`
);
const prototypeCityCoordinate = prototypeCityCoordinateCandidate;
const cityNameById = Object.fromEntries(
  [prototypeCity].map((cityDefinition) => [cityDefinition.id, cityDefinition.name])
);
const houseNameById = Object.fromEntries(
  prototypeHouses.map((houseDefinition) => [houseDefinition.id, houseDefinition.name])
);
const characterNameById = Object.fromEntries(
  prototypeCharacters.map((characterDefinition) => [
    characterDefinition.id,
    characterDefinition.name,
  ])
);

let appState: AppState = {
  gameState: createInitialState({
    currentMapId: prototypeMap.id,
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
  characterDefinitions: [...prototypeCharacters],
  playerCoordinate: { x: 0, y: 0 },
  modalState: null,
};

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

appElement.addEventListener("click", (event) => {
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

  const openCardsButton = targetElement.closest<HTMLElement>("[data-action='open-cards']");
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

  const cardFilterButton = targetElement.closest<HTMLElement>("[data-card-filter]");
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

  const valuableButton = targetElement.closest<HTMLElement>("[data-valuable-id]");
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

  const leaveCityButton = targetElement.closest<HTMLElement>("[data-action='leave-city']");
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

  const houseActionButton = targetElement.closest<HTMLElement>("[data-house-action]");
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

  const leaveHouseButton = targetElement.closest<HTMLElement>("[data-action='leave-house']");
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

  const mapCell = targetElement.closest<HTMLElement>("[data-map-x][data-map-y]");
  if (mapCell != null && appState.gameState.ui.currentView === "map") {
    const xValue = Number(mapCell.dataset.mapX);
    const yValue = Number(mapCell.dataset.mapY);
    const cityId = mapCell.dataset.cityId || null;
    const cityName = cityId == null ? null : cityNameById[cityId] ?? null;

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

    const didReachCity =
      appState.modalState.cityId === prototypeCity.id &&
      nextCoordinate.x === prototypeCityCoordinate.x &&
      nextCoordinate.y === prototypeCityCoordinate.y;

    appState = {
      ...appState,
      playerCoordinate: nextCoordinate,
      modalState: didReachCity
        ? {
            type: "enter-city-confirm",
            cityId: prototypeCity.id,
            cityName: prototypeCity.name,
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
  appRoot.innerHTML = renderAppMarkup({
    appState,
    playerCharacterId,
    mapDefinition: prototypeMap,
    cityDefinition: prototypeCity,
    houseDefinitions: prototypeHouses,
    cardDefinitions: prototypeCards,
    cityCoordinatesById,
    cityNameById,
    houseNameById,
    characterNameById,
    cityPortraits: prototypeCityPortraits,
  });
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
