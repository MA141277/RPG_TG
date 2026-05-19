import "./styles/app.css";
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
import type { CardDefinition } from "./domain/card";
import type { CharacterDefinition } from "./domain/character";
import type {
  CardLibraryFilter,
  ValuableLibraryFilter,
  ValuableLibrarySortKey,
} from "./domain/global-ui";
import type { ValuableItemDefinition, ValuableItemId } from "./domain/valuable-item";
import { renderConfirmModal } from "./ui/components/modal/confirm-modal";
import {
  createGlobalPlayerPanelModel,
  renderGlobalPlayerPanel,
} from "./ui/panels/global-player-panel";
import { renderCharacterDetailView } from "./ui/views/character/character-detail-view";
import { renderCardLibraryView } from "./ui/views/cards/card-library-view";
import { renderCityView } from "./ui/views/city/city-view";
import { createHouseViewModel } from "./ui/views/house/house-view";
import { createMapViewModel, renderMapView } from "./ui/views/map/map-view";
import { renderValuableLibraryView } from "./ui/views/valuables/valuable-library-view";

type AppModalState =
  | {
      type: "travel-confirm";
      targetCoordinate: GridCoordinate;
      cityId: string | null;
      cityName: string | null;
    }
  | {
      type: "enter-city-confirm";
      cityId: string;
      cityName: string;
    }
  | null;

type AppState = {
  gameState: ReturnType<typeof createInitialState>;
  playerCoordinate: GridCoordinate;
  modalState: AppModalState;
};

type CharacterDetailViewOptions = Parameters<typeof renderCharacterDetailView>[1];

const appElement = document.querySelector<HTMLElement>("#app");

if (appElement == null) {
  throw new Error("Missing #app mount point.");
}

const appRoot = appElement;
const playerCharacterId = "char.player";
const cityCoordinatesById: Record<string, GridCoordinate> = {
  [prototypeCity.id]: { x: 2, y: 2 },
};
const prototypeCityCoordinate = cityCoordinatesById[prototypeCity.id]!;
const cityNameById = Object.fromEntries(
  [prototypeCity].map((cityDefinition) => [cityDefinition.id, cityDefinition.name])
);
const houseNameById = Object.fromEntries(
  prototypeHouses.map((houseDefinition) => [houseDefinition.id, houseDefinition.name])
);
const characterNameById = Object.fromEntries(
  prototypeCharacters.map((characterDefinition) => [characterDefinition.id, characterDefinition.name])
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
          prototypeValuables.find((valuableDefinition) => valuableDefinition.category === "weapon")
            ?.id ?? null,
        armorId:
          prototypeValuables.find((valuableDefinition) => valuableDefinition.category === "armor")
            ?.id ?? null,
      },
    },
    currentView: "map",
  }),
  playerCoordinate: { x: 0, y: 0 },
  modalState: null,
};

renderApp();

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

  const closeOverlayButton = targetElement.closest<HTMLElement>("[data-action='close-overlay'], [data-action='close-character-detail']");
  if (closeOverlayButton != null) {
    updateOverlayView(null);
    return;
  }

  const playerCardButton = targetElement.closest<HTMLElement>("[data-action='open-player-detail']");
  if (playerCardButton != null) {
    updateOverlayView("detail");
    return;
  }

  const openCardsButton = targetElement.closest<HTMLElement>("[data-action='open-cards']");
  if (openCardsButton != null) {
    updateOverlayView("cards");
    return;
  }

  const openValuablesButton = targetElement.closest<HTMLElement>("[data-action='open-valuables']");
  if (openValuablesButton != null) {
    updateOverlayView("valuables");
    return;
  }

  const cardFilterButton = targetElement.closest<HTMLElement>("[data-card-filter]");
  if (cardFilterButton != null) {
    const filter = cardFilterButton.dataset.cardFilter as CardLibraryFilter | undefined;
    if (filter != null) {
      setCardFilter(filter);
    }
    return;
  }

  const cardButton = targetElement.closest<HTMLElement>("[data-card-id]");
  if (cardButton != null) {
    const cardId = cardButton.dataset.cardId;
    if (cardId != null) {
      selectCard(cardId);
    }
    return;
  }

  const valuableFilterButton = targetElement.closest<HTMLElement>("[data-valuable-filter]");
  if (valuableFilterButton != null) {
    const filter = valuableFilterButton.dataset.valuableFilter as ValuableLibraryFilter | undefined;
    if (filter != null) {
      setValuableFilter(filter);
    }
    return;
  }

  const valuableSortButton = targetElement.closest<HTMLElement>("[data-valuable-sort]");
  if (valuableSortButton != null) {
    const sortKey = valuableSortButton.dataset.valuableSort as ValuableLibrarySortKey | undefined;
    if (sortKey != null) {
      setValuableSort(sortKey);
    }
    return;
  }

  const valuableButton = targetElement.closest<HTMLElement>("[data-valuable-id]");
  if (valuableButton != null) {
    const valuableId = valuableButton.dataset.valuableId;
    if (valuableId != null) {
      selectValuable(valuableId);
    }
    return;
  }

  const equipButton = targetElement.closest<HTMLElement>("[data-action='equip-valuable'][data-valuable-id]");
  if (equipButton != null) {
    const valuableId = equipButton.dataset.valuableId;
    if (valuableId != null) {
      equipValuable(valuableId);
    }
    return;
  }

  const leaveCityButton = targetElement.closest<HTMLElement>("[data-action='leave-city']");
  if (leaveCityButton != null) {
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
        },
      },
    };
    renderApp();
    return;
  }

  const leaveHouseButton = targetElement.closest<HTMLElement>("[data-action='leave-house']");
  if (leaveHouseButton != null) {
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
          currentView: "city",
          overlayView: null,
        },
      },
    };
    renderApp();
    return;
  }

  const houseButton = targetElement.closest<HTMLElement>("[data-house-id]");
  if (houseButton != null) {
    const houseId = houseButton.dataset.houseId;
    if (houseId == null) {
      return;
    }

    appState = {
      ...appState,
      gameState: {
        ...appState.gameState,
        world: {
          ...appState.gameState.world,
          currentHouseId: houseId,
        },
        ui: {
          ...appState.gameState.ui,
          currentView: "house",
          overlayView: null,
        },
      },
    };
    renderApp();
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

function updateOverlayView(
  overlayView: AppState["gameState"]["ui"]["overlayView"]
) {
  appState = {
    ...appState,
    gameState: {
      ...appState.gameState,
      ui: {
        ...appState.gameState.ui,
        overlayView,
      },
    },
  };
  renderApp();
}

function setCardFilter(filter: CardLibraryFilter) {
  const visibleCards = getVisibleCards(filter);
  const selectedCardId =
    visibleCards.find((cardDefinition) => cardDefinition.id === appState.gameState.cards.selectedCardId)?.id ??
    visibleCards[0]?.id ??
    null;

  appState = {
    ...appState,
    gameState: {
      ...appState.gameState,
      cards: {
        ...appState.gameState.cards,
        selectedCardId,
      },
      ui: {
        ...appState.gameState.ui,
        cardLibraryFilter: filter,
        overlayView: "cards",
      },
    },
  };
  renderApp();
}

function selectCard(cardId: string) {
  appState = {
    ...appState,
    gameState: {
      ...appState.gameState,
      cards: {
        ...appState.gameState.cards,
        selectedCardId: cardId,
      },
      ui: {
        ...appState.gameState.ui,
        overlayView: "cards",
      },
    },
  };
  renderApp();
}

function setValuableFilter(filter: ValuableLibraryFilter) {
  const visibleItems = getVisibleValuables(filter);
  const selectedItemId =
    visibleItems.find((itemDefinition) => itemDefinition.id === appState.gameState.valuables.selectedItemId)?.id ??
    visibleItems[0]?.id ??
    null;

  appState = {
    ...appState,
    gameState: {
      ...appState.gameState,
      valuables: {
        ...appState.gameState.valuables,
        selectedItemId,
      },
      ui: {
        ...appState.gameState.ui,
        valuableLibraryFilter: filter,
        overlayView: "valuables",
      },
    },
  };
  renderApp();
}

function setValuableSort(sortKey: ValuableLibrarySortKey) {
  const nextSortDirection =
    appState.gameState.ui.valuableLibrarySortKey === sortKey &&
    appState.gameState.ui.valuableLibrarySortDirection === "asc"
      ? "desc"
      : "asc";

  appState = {
    ...appState,
    gameState: {
      ...appState.gameState,
      ui: {
        ...appState.gameState.ui,
        valuableLibrarySortKey: sortKey,
        valuableLibrarySortDirection: nextSortDirection,
        overlayView: "valuables",
      },
    },
  };
  renderApp();
}

function selectValuable(valuableId: ValuableItemId) {
  appState = {
    ...appState,
    gameState: {
      ...appState.gameState,
      valuables: {
        ...appState.gameState.valuables,
        selectedItemId: valuableId,
      },
      ui: {
        ...appState.gameState.ui,
        overlayView: "valuables",
      },
    },
  };
  renderApp();
}

function equipValuable(valuableId: ValuableItemId) {
  const selectedItem = appState.gameState.valuables.items.find(
    (itemDefinition) => itemDefinition.id === valuableId
  );
  if (selectedItem == null) {
    return;
  }

  const nextWeaponSet = { ...appState.gameState.valuables.equippedWeaponSet };
  if (selectedItem.category === "weapon") {
    nextWeaponSet.swordId = valuableId;
  }

  if (selectedItem.category === "armor") {
    nextWeaponSet.armorId = valuableId;
  }

  appState = {
    ...appState,
    gameState: {
      ...appState.gameState,
      valuables: {
        ...appState.gameState.valuables,
        selectedItemId: valuableId,
        equippedWeaponSet: nextWeaponSet,
      },
      ui: {
        ...appState.gameState.ui,
        overlayView: "valuables",
      },
    },
  };
  renderApp();
}

function getVisibleCards(filter: CardLibraryFilter): CardDefinition[] {
  const ownedIdSet = new Set(appState.gameState.cards.ownedCardIds);

  return prototypeCards.filter((cardDefinition) => {
    if (!ownedIdSet.has(cardDefinition.id)) {
      return false;
    }

    return filter === "all" ? true : cardDefinition.category === filter;
  });
}

function getVisibleValuables(filter: ValuableLibraryFilter): ValuableItemDefinition[] {
  if (filter === "all") {
    return appState.gameState.valuables.items;
  }

  return appState.gameState.valuables.items.filter(
    (itemDefinition) => itemDefinition.category === "weapon" || itemDefinition.category === "armor"
  );
}

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

  appState = {
    ...appState,
    gameState: enterCity(appState.gameState, appState.modalState.cityId),
    modalState: null,
  };
  renderApp();
}

function renderApp() {
  const currentView = appState.gameState.ui.currentView;
  const activeHouse = prototypeHouses.find(
    (houseDefinition) => houseDefinition.id === appState.gameState.world.currentHouseId
  );
  const playerCharacter =
    prototypeCharacters.find((characterDefinition) => characterDefinition.id === playerCharacterId) ??
    prototypeCharacters[0]!;
  const playerPanelModel = createGlobalPlayerPanelModel(playerCharacter, appState.gameState, null);

  let stageMarkup = "";

  if (currentView === "map") {
    const mapViewModel = createMapViewModel({
      mapName: prototypeMap.name,
      size: 5,
      playerCoordinate: appState.playerCoordinate,
      cityDefinitions: [prototypeCity],
      cityCoordinatesById,
    });

    stageMarkup = renderMapView(mapViewModel);
  } else if (currentView === "city") {
    stageMarkup = renderCityView(prototypeCity, prototypeHouses);
  } else if (currentView === "house" && activeHouse != null) {
    const houseViewModel = createHouseViewModel(activeHouse, prototypeCharacters);

    stageMarkup = `
      <section class="view-house">
        <div class="c-stage-header">
          <div>
            <p class="c-stage-header__eyebrow">屋敷</p>
            <h1 class="c-stage-header__title">${houseViewModel.title}</h1>
          </div>
          <button class="c-button c-button--ghost" data-action="leave-house">${houseViewModel.backButtonLabel}</button>
        </div>
        <div class="c-house-interior">
          <div class="c-house-interior__hero c-panel">
            <strong class="c-house-interior__hero-name">
              ${houseViewModel.defaultCharacterId == null ? "无人接待" : "默认角色已展开"}
            </strong>
            <p class="c-house-interior__hero-text">
              这里是 ${houseViewModel.title}。后续可以在这里接入角色功能、事件入口和小游戏。
            </p>
          </div>
          <div class="c-house-roster">
            ${houseViewModel.characterSummaries
              .map(
                (characterSummary) => `
                  <article class="c-roster-card c-panel">
                    <span class="c-roster-card__title">${characterSummary.title ?? "在场人物"}</span>
                    <strong class="c-roster-card__name">${characterSummary.name}</strong>
                  </article>
                `
              )
              .join("")}
          </div>
        </div>
      </section>
    `;
  }

  appRoot.innerHTML = `
    <div class="l-shell l-shell--prototype">
      <main class="l-stage">
        ${stageMarkup}
        <div class="l-overlay-ui">
          <button class="u-click-layer" data-action="open-player-detail" aria-label="打开角色详情">
            ${renderGlobalPlayerPanel(playerPanelModel)}
          </button>
        </div>
      </main>
      ${renderModal()}
      ${renderOverlay(playerCharacter)}
    </div>
  `;
}

function renderOverlay(playerCharacter: CharacterDefinition): string {
  const overlayView = appState.gameState.ui.overlayView;

  if (overlayView === "detail") {
    return renderCharacterDetailView(playerCharacter, buildCharacterDetailOptions(playerCharacter));
  }

  if (overlayView === "cards") {
    return renderCardLibraryView({
      cardDefinitions: prototypeCards,
      inventory: appState.gameState.cards,
      filter: appState.gameState.ui.cardLibraryFilter,
    });
  }

  if (overlayView === "valuables") {
    return renderValuableLibraryView({
      inventory: appState.gameState.valuables,
      filter: appState.gameState.ui.valuableLibraryFilter,
      sortKey: appState.gameState.ui.valuableLibrarySortKey,
      sortDirection: appState.gameState.ui.valuableLibrarySortDirection,
    });
  }

  return "";
}

function buildCharacterDetailOptions(
  playerCharacter: CharacterDefinition
): CharacterDetailViewOptions {
  const activeHouseDefinition =
    playerCharacter.houseId == null
      ? null
      : prototypeHouses.find((houseDefinition) => houseDefinition.id === playerCharacter.houseId) ?? null;
  const equippedWeapon = resolveEquippedItemName("weapon");
  const equippedArmor = resolveEquippedItemName("armor");
  const notorietyValue = appState.gameState.runtime.variables.notoriety;

  const options: CharacterDetailViewOptions = {
    notoriety: typeof notorietyValue === "number" ? notorietyValue : 0,
    stipendText: `${playerCharacter.stats.gold} 贯`,
    schoolName: "无",
    masterName: "无",
    weaponName: equippedWeapon ?? "无",
    armorName: equippedArmor ?? "无",
  };

  const cityName = cityNameById[playerCharacter.cityId];
  if (cityName != null) {
    options.cityName = cityName;
  }

  options.clanName = playerCharacter.clanId ?? "无";
  options.houseName =
    playerCharacter.houseId == null ? "无" : houseNameById[playerCharacter.houseId] ?? playerCharacter.houseId;
  options.lordName =
    activeHouseDefinition?.defaultCharacterId == null
      ? activeHouseDefinition == null
        ? "无"
        : houseNameById[activeHouseDefinition.id] ?? "无"
      : characterNameById[activeHouseDefinition.defaultCharacterId] ??
        houseNameById[activeHouseDefinition.id] ??
        "无";

  return options;
}

function resolveEquippedItemName(category: ValuableItemDefinition["category"]): string | null {
  const equippedId =
    category === "weapon"
      ? appState.gameState.valuables.equippedWeaponSet.swordId
      : appState.gameState.valuables.equippedWeaponSet.armorId;

  if (equippedId == null) {
    return null;
  }

  return (
    appState.gameState.valuables.items.find((itemDefinition) => itemDefinition.id === equippedId)?.name ??
    null
  );
}

function renderModal(): string {
  if (appState.modalState == null) {
    return "";
  }

  if (appState.modalState.type === "travel-confirm") {
    const title =
      appState.modalState.cityName == null
        ? `前往 (${appState.modalState.targetCoordinate.x}, ${appState.modalState.targetCoordinate.y})`
        : `前往 ${appState.modalState.cityName}`;
    const body =
      appState.modalState.cityName == null
        ? "确认移动到这个网格坐标。"
        : `这将移动到 ${appState.modalState.cityName} 所在坐标。`;

    return renderConfirmModal({
      title,
      body,
      confirmLabel: "前往",
      cancelLabel: "取消",
    });
  }

  return renderConfirmModal({
    title: `进入 ${appState.modalState.cityName}`,
    body: "人物与城市坐标已经重合，确认后展开城市结构。",
    confirmLabel: "进入城市",
    cancelLabel: "稍后",
    portraitLabel:
      prototypeCityPortraits[appState.modalState.cityId] ?? appState.modalState.cityName,
  });
}
