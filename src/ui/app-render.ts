import type {
  AppLocationDialogueState,
  AppState,
  AppModalState,
} from "../application/app-shell";
import type { AppPresenterOutput } from "../application/presenter/presenter-output";
import {
  resolveCharacterAvatarImageUrl,
  resolveCharacterPortraitImageUrl,
} from "./portrait-assets";
import type { GridCoordinate } from "../application/navigation/travel-to-coordinate";
import type { CardDefinition } from "../domain/card";
import type { CharacterDefinition } from "../domain/character";
import type { CityDefinition } from "../domain/city";
import type { CityEntryDefinition } from "../domain/city-entry";
import type { CityNpcPoolDefinition } from "../domain/city-npc";
import type { CitySceneMapping } from "../domain/city-scene-mapping";
import type { HouseDefinition } from "../domain/house";
import type { HouseModuleViewModel } from "../domain/house-module";
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
import cityEntryPortraitUrl from "../../ui/card/chengzhengsuoluetu.png?url";
import { renderCharacterDetailView } from "./views/character/character-detail-view";
import { renderCardLibraryView } from "./views/cards/card-library-view";
import { renderCity3dView } from "./views/city/city-3d-view";
import { renderCityView } from "./views/city/city-view";
import { renderCityBeggingMiniGameOverlay } from "./views/minigames/city-begging-minigame-view";
import { createHouseViewModel } from "./views/house/house-view";
import { renderHouseModuleView } from "./views/house/house-module-view-registry";
import { createMapViewModel, renderMapView } from "./views/map/map-view";
import { renderSceneView } from "./views/scene/scene-view";
import { renderStoryBattleView } from "./views/battle/story-battle-view";
import { renderValuableLibraryView } from "./views/valuables/valuable-library-view";
import { renderLayoutEditor } from "./tools/layout-editor-view";

type CharacterDetailViewOptions = Parameters<typeof renderCharacterDetailView>[1];

export type AppRenderInput = {
  appState: AppState;
  playerCharacterId: string;
  mapDefinition: MapDefinition;
  cityDefinition: CityDefinition;
  cityDefinitions?: CityDefinition[];
  houseDefinitions: HouseDefinition[];
  cityEntries: CityEntryDefinition[];
  cardDefinitions: CardDefinition[];
  cityNpcPoolDefinitions: CityNpcPoolDefinition[];
  cityCoordinatesById: Record<string, GridCoordinate>;
  cityNameById: Record<string, string>;
  houseNameById: Record<string, string>;
  characterNameById: Record<string, string>;
  textEntriesById?: Record<string, string>;
  cityPortraits: Record<string, string>;
  citySceneMappingsByCityId?: Record<string, CitySceneMapping>;
  historicalCharacters?: HistoricalCharacterRecord[];
  historicalCityRosters?: HistoricalCityRoster[];
  presenterOutput: AppPresenterOutput;
};

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
    layout: input.appState.uiLayouts["character-detail-screen"],
    layoutEditor: input.appState.layoutEditor,
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
  const overlayView = input.presenterOutput.overlay.overlayView;

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
    className: "c-confirm-modal--map-entry",
    portraitLabel: cityPortraits[modalState.cityId] ?? modalState.cityName,
    portraitImageUrl: cityEntryPortraitUrl,
  });
}

function renderLocationDialogue(
  dialogueState: AppLocationDialogueState,
  characterDefinitions: CharacterDefinition[]
): string {
  if (dialogueState == null) {
    return "";
  }

  const speaker =
    characterDefinitions.find(
      (characterDefinition) =>
        characterDefinition.id === dialogueState.speakerCharacterId
    ) ?? null;
  const portraitImageUrl =
    speaker == null ? null : resolveCharacterPortraitImageUrl(speaker);

  return `
    <footer class="c-grain-shop-dialogue c-scene-dialogue c-location-dialogue" aria-label="地点对话">
      <div
        class="c-grain-shop-dialogue__text c-grain-shop-skin-card c-grain-shop-dialogue__text--clickable"
        data-action="close-location-dialogue"
        role="button"
        tabindex="0"
      >
        ${dialogueState.textLines
          .map((line) => `<p class="c-grain-shop-dialogue__line">${line}</p>`)
          .join("")}
        <p class="c-grain-shop-dialogue__hint">${dialogueState.advanceHintText}</p>
      </div>
      <div class="c-grain-shop-dialogue__npc">
        <div class="c-grain-shop-portrait" aria-hidden="true">
          ${
            portraitImageUrl == null
              ? '<span class="c-grain-shop-portrait__art"></span>'
              : `<img class="c-location-dialogue__portrait-image" src="${portraitImageUrl}" alt="">`
          }
        </div>
        <p class="c-grain-shop-portrait__name c-grain-shop-nameplate c-grain-shop-nameplate--small">
          ${speaker?.name ?? dialogueState.speakerCharacterId}
        </p>
      </div>
    </footer>
  `;
}

function withResolvedHousePortraits(
  viewModel: HouseModuleViewModel,
  characterDefinitions: CharacterDefinition[]
): HouseModuleViewModel {
  const characterById = new Map(
    characterDefinitions.map((characterDefinition) => [
      characterDefinition.id,
      characterDefinition,
    ])
  );
  const dialogueCharacter =
    viewModel.dialogue?.characterId == null
      ? null
      : characterById.get(viewModel.dialogue.characterId) ?? null;

  return {
    ...viewModel,
    standbyRoster: viewModel.standbyRoster.map((actor) => {
      const characterDefinition = characterById.get(actor.characterId);
      if (characterDefinition == null) {
        return actor;
      }

      return {
        ...actor,
        avatarImageUrl:
          actor.avatarImageUrl ?? resolveCharacterAvatarImageUrl(characterDefinition),
        portraitImageUrl:
          actor.portraitImageUrl ??
          resolveCharacterPortraitImageUrl(characterDefinition),
      };
    }),
    dialogue:
      viewModel.dialogue == null
        ? null
        : {
            ...viewModel.dialogue,
            portraitImageUrl:
              viewModel.dialogue.portraitImageUrl ??
              (dialogueCharacter == null
                ? null
                : resolveCharacterPortraitImageUrl(dialogueCharacter)),
          },
  };
}

function renderCampaignTravelBanner(
  campaignTravelState: AppState["campaignTravelState"]
): string {
  if (campaignTravelState == null) {
    return "";
  }

  const coordinateLabel = `(${campaignTravelState.targetCoordinate.x.toFixed(1)}, ${campaignTravelState.targetCoordinate.y.toFixed(1)})`;
  const destinationLabel =
    campaignTravelState.cityName == null
      ? coordinateLabel
      : `${campaignTravelState.cityName} ${coordinateLabel}`;

  return `
    <div class="c-campaign-travel-banner" role="status" aria-live="polite">
      <span class="c-campaign-travel-banner__label">正在前往 ${destinationLabel}</span>
      <button
        type="button"
        class="c-campaign-travel-banner__cancel"
        data-action="cancel-campaign-travel"
        aria-label="取消前往 ${destinationLabel}"
        title="取消前往"
      >
        x
      </button>
    </div>
  `;
}

function renderStage(
  input: AppRenderInput,
  playerCharacter: CharacterDefinition
): string {
  const { stage } = input.presenterOutput;

  if (stage.type === "map") {
    const mapViewModelInput: Parameters<typeof createMapViewModel>[0] = {
      mapDefinition: input.mapDefinition,
      playerCoordinate: input.appState.playerCoordinate,
      playerFacingDegrees: input.appState.campaignActorState.facingDegrees,
      playerIsMoving: input.appState.campaignActorState.isMoving,
      cityDefinitions: stage.cityDefinitions,
      cityCoordinatesById: input.cityCoordinatesById,
    };
    const mapViewModel = createMapViewModel(mapViewModelInput);

    return renderMapView(mapViewModel);
  }

  if (stage.type === "city") {
    return renderCityView(
      stage.activeCityDefinition,
      playerCharacter,
      stage.activeCityHouseDefinitions,
      stage.activeCityEntries,
      input.appState.cityMenuState,
      input.appState.cityDirectoryState,
      stage.citySceneMapping
    );
  }

  if (stage.type === "city-3d") {
    return renderCity3dView(
      stage.activeCityDefinition,
      stage.citySceneMapping
    );
  }

  if (stage.type === "house") {
    if (stage.moduleViewModel != null) {
      return renderHouseModuleView(
        withResolvedHousePortraits(
          stage.moduleViewModel,
          input.appState.characterDefinitions
        )
      );
    }

    const houseViewModel = createHouseViewModel(
      stage.activeHouse,
      input.appState.characterDefinitions,
      stage.cityNpcSummaries
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

  if (stage.type === "scene") {
    return renderSceneView({
      currentAction: stage.currentSceneAction,
      activitySession: input.appState.gameState.runtime.activitySession,
      characterDefinitions: input.appState.characterDefinitions,
      choiceOptions: stage.currentSceneChoiceOptions,
      ...(input.textEntriesById == null
        ? {}
        : { textEntriesById: input.textEntriesById }),
    });
  }

  if (stage.type === "battle") {
    return renderStoryBattleView(input.appState.gameState.storyBattle);
  }

  return "";
}

export function renderApp(input: AppRenderInput): string {
  const playerCharacter = getPlayerCharacter(
    input.appState,
    input.playerCharacterId
  );
  const playerPanelModel = createGlobalPlayerPanelModel(
    playerCharacter,
    input.appState.gameState,
    null,
    input.presenterOutput.overlay.locationText
  );
  const stageMarkup = renderStage(input, playerCharacter);

  return `
    <div class="l-viewport">
      <div class="l-game-frame">
        <div class="l-game-screen">
          <div class="l-shell l-shell--prototype">
            <main class="l-stage">
              ${stageMarkup}
              <div class="l-overlay-ui">
                ${renderCampaignTravelBanner(input.presenterOutput.overlay.campaignTravelState)}
                ${
                  input.presenterOutput.overlay.shouldShowGlobalHud
                    ? renderGlobalPlayerPanel(
                        playerPanelModel,
                        input.appState.uiLayouts["global-hud"]
                      )
                    : ""
                }
              </div>
            </main>
            ${renderLocationDialogue(
              input.presenterOutput.overlay.locationDialogueState,
              input.appState.characterDefinitions
            )}
            ${renderModal(
              input.presenterOutput.overlay.modalState,
              input.cityPortraits
            )}
            ${renderCityBeggingMiniGameOverlay(input.appState.beggingMiniGameState)}
            ${renderOverlay(input, playerCharacter)}
            ${renderLayoutEditor(input.appState)}
          </div>
        </div>
      </div>
    </div>
  `;
}
