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
import { createHouseViewModel } from "./ui/views/house/house-view";
import { renderConfirmModal } from "./ui/components/modal/confirm-modal";
import { renderCityView } from "./ui/views/city/city-view";
import { createMapViewModel, renderMapView } from "./ui/views/map/map-view";
import {
  createGlobalPlayerPanelModel,
  renderGlobalPlayerPanel,
} from "./ui/panels/global-player-panel";
import { renderCharacterDetailView } from "./ui/views/character/character-detail-view";

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
  characterDetailOpen: boolean;
};

const appElement = document.querySelector<HTMLElement>("#app");

if (appElement == null) {
  throw new Error("Missing #app mount point.");
}
const appRoot: HTMLElement = appElement;

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
const clanNameById: Record<string, string> = {
  "clan.oda": "织田家",
};

let appState: AppState = {
  gameState: createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: prototypeCity.id,
    currentHouseId: null,
    playerCharacterId: "char.player",
    chapterId: "chapter.prototype",
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: "char.player",
    reviewDateText: "剩余40天",
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
  characterDetailOpen: false,
};

renderApp();

appElement.addEventListener("click", (event) => {
  const targetElement = event.target;
  if (!(targetElement instanceof HTMLElement)) {
    return;
  }

  const mapCell = targetElement.closest<HTMLElement>("[data-map-x][data-map-y]");
  if (mapCell != null && appState.gameState.ui.currentView === "map") {
    const xValue = Number(mapCell.dataset.mapX);
    const yValue = Number(mapCell.dataset.mapY);
    const cityId = mapCell.dataset.cityId || null;
    const cityName = cityId === prototypeCity.id ? prototypeCity.name : null;

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

  const playerCardButton = targetElement.closest<HTMLElement>("[data-action='open-player-detail']");
  if (playerCardButton != null) {
    appState = {
      ...appState,
      characterDetailOpen: true,
    };
    renderApp();
    return;
  }

  const closeDetailButton = targetElement.closest<HTMLElement>("[data-action='close-character-detail']");
  if (closeDetailButton != null) {
    appState = {
      ...appState,
      characterDetailOpen: false,
    };
    renderApp();
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
        },
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
    prototypeCharacters.find((characterDefinition) => characterDefinition.id === "char.player") ??
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

  const detailMarkup = appState.characterDetailOpen
    ? renderCharacterDetailView(playerCharacter, {
        cityName: cityNameById[playerCharacter.cityId],
        clanName: playerCharacter.clanId == null ? "无" : clanNameById[playerCharacter.clanId] ?? playerCharacter.clanId,
        houseName: playerCharacter.houseId == null ? "无" : houseNameById[playerCharacter.houseId] ?? playerCharacter.houseId,
        lordName:
          playerCharacter.houseId == null
            ? "无"
            : characterNameById[
                prototypeHouses.find((houseDefinition) => houseDefinition.id === playerCharacter.houseId)
                  ?.defaultCharacterId ?? ""
              ] ?? houseNameById[playerCharacter.houseId] ?? "无",
        stipendText: `${playerCharacter.stats.gold}贯`,
        schoolName: "无",
        masterName: "无",
        weaponName: "胁差",
        armorName: "锁具足",
        notoriety:
          appState.gameState.runtime.variables.notoriety as number | undefined
            ? Number(appState.gameState.runtime.variables.notoriety)
            : 0,
      })
    : "";

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
      ${detailMarkup}
    </div>
  `;
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
    body: "人物与城池坐标已重合，确认后展开城市结构。",
    confirmLabel: "进入城市",
    cancelLabel: "稍后",
    portraitLabel:
      prototypeCityPortraits[appState.modalState.cityId] ?? appState.modalState.cityName,
  });
}
