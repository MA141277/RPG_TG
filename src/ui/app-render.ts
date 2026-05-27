import { selectCityNpcSummariesForHouse } from "../application/city-npcs/select-city-npcs-for-house";
import { getHouseModule } from "../application/house-modules/house-module-registry";
import type { AppState, AppModalState } from "../application/app-shell";
import type { GridCoordinate } from "../application/navigation/travel-to-coordinate";
import type { CardDefinition } from "../domain/card";
import type { CharacterDefinition } from "../domain/character";
import type { CityDefinition } from "../domain/city";
import type { CityEntryDefinition } from "../domain/city-entry";
import type { CityNpcPoolDefinition } from "../domain/city-npc";
import type { HouseDefinition } from "../domain/house";
import type {
  HistoricalCharacterRecord,
  HistoricalCityRoster,
} from "../domain/historical-character";
import type { MapDefinition } from "../domain/map";
import type { ValuableItemDefinition } from "../domain/valuable-item";
import { assertExists } from "../shared/assert";
import { renderConfirmModal } from "./components/modal/confirm-modal";
import {
  createGlobalPlayerPanelModel,
  renderGlobalPlayerPanel,
} from "./panels/global-player-panel";
import { renderCharacterDetailView } from "./views/character/character-detail-view";
import { renderCardLibraryView } from "./views/cards/card-library-view";
import { renderCityView } from "./views/city/city-view";
import { createHouseViewModel } from "./views/house/house-view";
import { renderHouseModuleView } from "./views/house/house-module-view-registry";
import { createMapViewModel, renderMapView } from "./views/map/map-view";
import { renderValuableLibraryView } from "./views/valuables/valuable-library-view";
import { renderLayoutEditor } from "./tools/layout-editor-view";

type CharacterDetailViewOptions = Parameters<typeof renderCharacterDetailView>[1];

export type AppRenderInput = {
  appState: AppState;
  playerCharacterId: string;
  mapDefinition: MapDefinition;
  cityDefinition: CityDefinition;
  houseDefinitions: HouseDefinition[];
  cityEntries: CityEntryDefinition[];
  cardDefinitions: CardDefinition[];
  cityNpcPoolDefinitions: CityNpcPoolDefinition[];
  cityCoordinatesById: Record<string, GridCoordinate>;
  cityNameById: Record<string, string>;
  houseNameById: Record<string, string>;
  characterNameById: Record<string, string>;
  cityPortraits: Record<string, string>;
  historicalCharacters?: HistoricalCharacterRecord[];
  historicalCityRosters?: HistoricalCityRoster[];
};

function getActiveHouseDefinition(
  appState: AppState,
  houseDefinitions: HouseDefinition[]
): HouseDefinition | null {
  return (
    houseDefinitions.find(
      (houseDefinition) =>
        houseDefinition.id === appState.gameState.world.currentHouseId
    ) ?? null
  );
}

function getPlayerCharacter(
  appState: AppState,
  playerCharacterId: string
): CharacterDefinition {
  const playerCharacter = appState.characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === playerCharacterId
  );
  assertExists(
    playerCharacter,
    `Player character not found for id "${playerCharacterId}".`
  );
  return playerCharacter;
}

function resolveEquippedItemName(
  appState: AppState,
  category: ValuableItemDefinition["category"]
): string | null {
  const equippedId =
    category === "weapon"
      ? appState.gameState.valuables.equippedWeaponSet.swordId
      : appState.gameState.valuables.equippedWeaponSet.armorId;

  if (equippedId == null) {
    return null;
  }

  return (
    appState.gameState.valuables.items.find(
      (itemDefinition) => itemDefinition.id === equippedId
    )?.name ?? null
  );
}

function buildCharacterDetailOptions(
  input: Pick<
    AppRenderInput,
    "appState" | "cityNameById" | "houseDefinitions" | "houseNameById" | "characterNameById"
  >,
  playerCharacter: CharacterDefinition
): CharacterDetailViewOptions {
  const activeHouseDefinition =
    playerCharacter.houseId == null
      ? null
      : input.houseDefinitions.find(
          (houseDefinition) => houseDefinition.id === playerCharacter.houseId
        ) ?? null;
  const equippedWeapon = resolveEquippedItemName(input.appState, "weapon");
  const equippedArmor = resolveEquippedItemName(input.appState, "armor");
  const notorietyValue = input.appState.gameState.runtime.variables.notoriety;

  const options: CharacterDetailViewOptions = {
    notoriety: typeof notorietyValue === "number" ? notorietyValue : 0,
    stipendText: `${playerCharacter.stats.gold} 文`,
    schoolName: "无",
    masterName: "无",
    weaponName: equippedWeapon ?? "无",
    armorName: equippedArmor ?? "无",
  };

  const cityName = input.cityNameById[playerCharacter.cityId];
  if (cityName != null) {
    options.cityName = cityName;
  }

  options.clanName = playerCharacter.clanId ?? "无";
  options.houseName =
    playerCharacter.houseId == null
      ? "无"
      : input.houseNameById[playerCharacter.houseId] ?? playerCharacter.houseId;
  options.lordName =
    activeHouseDefinition?.defaultCharacterId == null
      ? activeHouseDefinition == null
        ? "无"
        : input.houseNameById[activeHouseDefinition.id] ?? "无"
      : input.characterNameById[activeHouseDefinition.defaultCharacterId] ??
        input.houseNameById[activeHouseDefinition.id] ??
        "无";

  return options;
}

function renderOverlay(input: AppRenderInput, playerCharacter: CharacterDefinition): string {
  const overlayView = input.appState.gameState.ui.overlayView;

  if (overlayView === "detail") {
    return renderCharacterDetailView(
      playerCharacter,
      buildCharacterDetailOptions(input, playerCharacter)
    );
  }

  if (overlayView === "cards") {
    return renderCardLibraryView({
      cardDefinitions: input.cardDefinitions,
      inventory: input.appState.gameState.cards,
      filter: input.appState.gameState.ui.cardLibraryFilter,
    });
  }

  if (overlayView === "valuables") {
    return renderValuableLibraryView({
      inventory: input.appState.gameState.valuables,
      filter: input.appState.gameState.ui.valuableLibraryFilter,
      sortKey: input.appState.gameState.ui.valuableLibrarySortKey,
      sortDirection: input.appState.gameState.ui.valuableLibrarySortDirection,
    });
  }

  return "";
}

function renderModal(
  modalState: AppModalState,
  cityPortraits: Record<string, string>
): string {
  if (modalState == null) {
    return "";
  }

  if (modalState.type === "travel-confirm") {
    const title =
      modalState.cityName == null
        ? `前往 (${modalState.targetCoordinate.x}, ${modalState.targetCoordinate.y})`
        : `前往 ${modalState.cityName}`;
    const body =
      modalState.cityName == null
        ? "确认移动到这个网格坐标。"
        : `这将移动到 ${modalState.cityName} 所在坐标。`;

    return renderConfirmModal({
      title,
      body,
      confirmLabel: "前往",
      cancelLabel: "取消",
    });
  }

  return renderConfirmModal({
    title: `进入 ${modalState.cityName}`,
    body: "人物与城市坐标已经重合，确认后展开城市结构。",
    confirmLabel: "进入城市",
    cancelLabel: "稍后",
    portraitLabel: cityPortraits[modalState.cityId] ?? modalState.cityName,
  });
}

function renderStage(input: AppRenderInput): string {
  const currentView = input.appState.gameState.ui.currentView;
  const activeHouse = getActiveHouseDefinition(input.appState, input.houseDefinitions);

  if (currentView === "map") {
    const mapViewModelInput: Parameters<typeof createMapViewModel>[0] = {
      mapDefinition: input.mapDefinition,
      playerCoordinate: input.appState.playerCoordinate,
      cityDefinitions: [input.cityDefinition],
      cityCoordinatesById: input.cityCoordinatesById,
    };
    const mapViewModel = createMapViewModel(mapViewModelInput);

    return renderMapView(mapViewModel);
  }

  if (currentView === "city") {
    return renderCityView(
      input.cityDefinition,
      input.houseDefinitions,
      input.cityEntries,
      input.appState.cityDirectoryState
    );
  }

  if (currentView === "house" && activeHouse != null) {
    if (activeHouse.moduleId != null) {
      const houseModule = getHouseModule(activeHouse.moduleId);
      const houseViewModel = houseModule.selectViewModel({
        gameState: input.appState.gameState,
        characterDefinitions: input.appState.characterDefinitions,
        houseDefinition: activeHouse,
        playerCharacterId: input.playerCharacterId,
        sessionState: input.appState.gameState.ui.houseSession?.state ?? null,
      });

      return renderHouseModuleView(houseViewModel);
    }

    const houseViewModel = createHouseViewModel(
      activeHouse,
      input.appState.characterDefinitions,
      selectCityNpcSummariesForHouse(
        input.appState.gameState,
        activeHouse,
        input.cityNpcPoolDefinitions
      )
    );

    return `
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

  return "";
}

export function renderApp(input: AppRenderInput): string {
  const playerCharacter = getPlayerCharacter(
    input.appState,
    input.playerCharacterId
  );
  const locationText =
    input.cityNameById[input.appState.gameState.world.currentCityId] ??
    input.cityDefinition.name;
  const playerPanelModel = createGlobalPlayerPanelModel(
    playerCharacter,
    input.appState.gameState,
    null,
    locationText
  );
  const stageMarkup = renderStage(input);

  return `
    <div class="l-viewport">
      <div class="l-game-frame">
        <div class="l-game-screen">
          <div class="l-shell l-shell--prototype">
            <main class="l-stage">
              ${stageMarkup}
              <div class="l-overlay-ui">
                ${renderGlobalPlayerPanel(
                  playerPanelModel,
                  input.appState.uiLayouts.globalHud
                )}
              </div>
            </main>
            ${renderModal(input.appState.modalState, input.cityPortraits)}
            ${renderOverlay(input, playerCharacter)}
            ${renderLayoutEditor(input.appState)}
          </div>
        </div>
      </div>
    </div>
  `;
}
