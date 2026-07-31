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
import {
  renderDialogueTypewriterHint,
  renderDialogueTypewriterLines,
} from "./dialogue-typewriter";
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
import { projectBackpackItems } from "../application/inventory/item-inventory";
import { assertExists } from "../shared/assert";
import { renderConfirmModal } from "./components/modal/confirm-modal";
import {
  renderNpcInteractionDialogue,
  renderNpcInteractionMenu,
} from "./components/npc-interaction/npc-interaction-menu";
import {
  isNpcInteractionBlocked,
  selectNpcInteractionBlockState,
  selectHouseNpcSpecialActions,
  selectNpcInteractionMenu,
} from "../application/npc-interaction/npc-interaction";
import {
  createGlobalPlayerPanelModel,
  renderGlobalPlayerPanel,
} from "./panels/global-player-panel";
import {
  createBattleTroopPreviewViewModel,
} from "../application/troop-editor/troop-editor-stage-view-model";
import { selectPlayerTroopSnapshots } from "../application/troop-editor/troop-editor-selectors";
import { renderCharacterDetailView } from "./views/character/character-detail-view";
import { renderCardLibraryView } from "./views/cards/card-library-view";
import { renderBackpackView } from "./views/inventory/backpack-view";
import { renderCity3dView } from "./views/city/city-3d-view";
import { renderCityView } from "./views/city/city-view";
import { renderCityBeggingDefaultDialogueOverlay } from "./views/minigames/city-begging-default-dialogue-view";
import { renderCityBeggingMiniGameOverlay } from "./views/minigames/city-begging-minigame-view";
import { createHouseViewModel } from "./views/house/house-view";
import { renderHouseModuleView } from "./views/house/house-module-view-registry";
import { renderTempleAutoAdvanceStatusPanel } from "./views/house/temple-auto-advance-status-view";
import { createMapViewModel, renderMapView } from "./views/map/map-view";
import { renderTroopEditorView } from "./views/troop-editor/troop-editor-view";
import { renderTroopManagementView } from "./views/troop-editor/troop-management-view";
import { renderSceneView } from "./views/scene/scene-view";
import { renderStoryBattleView } from "./views/battle/story-battle-view";
import { renderStoryChapterTitleOverlay } from "./views/story/story-chapter-title-overlay";
import { renderLayoutEditor } from "./tools/layout-editor-view";
import { formatCardDrawResultLabel } from "./animations/card-draw-animation";
import { resolveCharacterFactionLabel } from "../application/faction/faction-affiliation-runtime";
import { defaultEquipmentLoadoutService } from "../domain/equipment/equipment-loadout-service";
import type { EquipmentSlotId } from "../domain/equipment/equipment-slot-registry";

type CharacterDetailViewOptions = Parameters<typeof renderCharacterDetailView>[1];

export type AppRenderInput = {
  appState: AppState;
  playerCharacterId: string;
  coinRewardDisplayValue?: number | null;
  coinRewardAnchorEditor?: {
    isOpen: boolean;
    draftX: number;
    draftY: number;
    isDirty: boolean;
  };
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

function getDetailCharacter(
  appState: AppState,
  playerCharacter: CharacterDefinition
): CharacterDefinition {
  const detailCharacterId = appState.gameState.ui.detailCharacterId;
  if (detailCharacterId == null) {
    return playerCharacter;
  }

  return (
    appState.characterDefinitions.find(
      (characterDefinition) => characterDefinition.id === detailCharacterId
    ) ?? playerCharacter
  );
}

function resolveEquippedItemName(
  appState: AppState,
  slotId: EquipmentSlotId
): string | null {
  const equippedId = defaultEquipmentLoadoutService.getEquippedItemId(
    appState.gameState.valuables,
    slotId
  );

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
  const equippedAccessory = resolveEquippedItemName(input.appState, "accessory");
  const equippedMount = resolveEquippedItemName(input.appState, "mount");
  const notorietyValue = input.appState.gameState.runtime.variables.notoriety;

  const options: CharacterDetailViewOptions = {
    layout: input.appState.uiLayouts["character-detail-screen"],
    layoutEditor: input.appState.layoutEditor,
    abilityDetailOpen: input.appState.gameState.ui.isCharacterAbilityDetailOpen,
    notoriety: typeof notorietyValue === "number" ? notorietyValue : 0,
    stipendText: `${playerCharacter.stats.gold} 文`,
    accessoryName: equippedAccessory ?? "无",
    mountName: equippedMount ?? "无",
    weaponName: equippedWeapon ?? "无",
    armorName: equippedArmor ?? "无",
  };

  const cityName = input.cityNameById[playerCharacter.cityId];
  if (cityName != null) {
    options.cityName = cityName;
  }

  options.clanName =
    resolveCharacterFactionLabel({
      state: input.appState.gameState,
      character: playerCharacter,
    }) ?? "无";
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
    const detailCharacter = getDetailCharacter(input.appState, playerCharacter);
    return renderCharacterDetailView(
      detailCharacter,
      buildCharacterDetailOptions(input, detailCharacter)
    );
  }

  if (overlayView === "cards") {
    return renderCardLibraryView({
      cardDefinitions: input.cardDefinitions,
      inventory: input.appState.gameState.cards,
      filter: input.appState.gameState.ui.cardLibraryFilter,
    });
  }

  if (overlayView === "backpack" || overlayView === "valuables") {
    return renderBackpackView({
      items: projectBackpackItems({
        valuableInventory: input.appState.gameState.valuables,
        gameState: input.appState.gameState,
      }),
      filter: input.appState.gameState.ui.backpackLibraryFilter,
      selectedItemId: input.appState.gameState.ui.selectedBackpackItemId,
    });
  }

  return "";
}

function renderModal(
  modalState: AppModalState,
  cityPortraits: Record<string, string>,
  mapDefinition: MapDefinition,
  cityDefinitions: CityDefinition[]
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

  const mapEntryVisualKind = resolveMapEntryVisualKind(
    modalState.cityId,
    mapDefinition,
    cityDefinitions
  );

  return renderConfirmModal({
    title: `进入 ${modalState.cityName}`,
    body: "人物与城市坐标已经重合，确认后展开城市结构。",
    confirmLabel: "进入城市",
    cancelLabel: "稍后",
    confirmButtonSound: "heavy",
    cancelButtonSound: "light",
    className: `c-confirm-modal--map-entry c-confirm-modal--map-entry-${mapEntryVisualKind}`,
    portraitLabel: cityPortraits[modalState.cityId] ?? modalState.cityName,
    portraitImageUrl: null,
  });
}

function renderNpcInteractionOverlay(input: AppRenderInput): string {
  const session = input.appState.gameState.ui.npcInteractionSession;
  const stage = input.presenterOutput.stage;
  const specialActions =
    session?.context.type === "house" &&
    stage.type === "house" &&
    stage.moduleViewModel != null
      ? selectHouseNpcSpecialActions({
          actors: stage.moduleViewModel.standbyRoster,
          targetCharacterId: session.targetCharacterId,
        })
      : [];
  const targetHouseActor =
    session?.context.type === "house" &&
    stage.type === "house" &&
    stage.moduleViewModel != null
      ? stage.moduleViewModel.standbyRoster.find(
          (actor) => actor.characterId === session.targetCharacterId
        ) ?? null
      : null;
  const targetCharacterDefinition =
    session == null
      ? null
      : input.appState.characterDefinitions.find(
          (characterDefinition) =>
            characterDefinition.id === session.targetCharacterId
        ) ?? null;
  const targetName =
    session == null
      ? null
      : targetHouseActor?.name ?? targetCharacterDefinition?.name ?? null;
  const targetPortraitImageUrl =
    targetHouseActor?.portraitImageUrl ??
    (targetCharacterDefinition == null
      ? null
      : resolveCharacterPortraitImageUrl(targetCharacterDefinition));
  const targetPortraitArtClassName = targetHouseActor?.portraitArtClassName ?? null;
  const menu = selectNpcInteractionMenu({
    session,
    targetName,
    specialActions,
    giftDisabled: true,
  });

  if (menu != null) {
    window.console.info(
      `[RPG_TG_DEBUG][npc-interaction-menu] ${JSON.stringify({
        targetCharacterId: menu.targetCharacterId,
        targetName: menu.targetName,
        options: menu.options.map((option) => ({
          id: option.id,
          label: option.label,
          kind: option.kind,
          disabled: option.disabled === true,
        })),
      })}`
    );
  }

  return (
    renderNpcInteractionMenu(menu) +
    renderNpcInteractionDialogue({
      session,
      targetName,
      portraitImageUrl: targetPortraitImageUrl,
      portraitArtClassName: targetPortraitArtClassName,
      giftDisabled: true,
    })
  );
}

function applyHouseNpcInteractionBlockedState(
  viewModel: HouseModuleViewModel,
  blocked: boolean
): HouseModuleViewModel {
  if (!blocked) {
    return viewModel;
  }

  return {
    ...viewModel,
    standbyRoster: viewModel.standbyRoster.map((actor) => ({
      ...actor,
      disabled: true,
    })),
  };
}

function resolveMapEntryVisualKind(
  cityId: string,
  mapDefinition: MapDefinition,
  cityDefinitions: CityDefinition[]
): "city" | "village" {
  const cityDefinition = cityDefinitions.find((city) => city.id === cityId);
  if (
    cityDefinition?.tags.some((tag) =>
      ["castle-town", "large-city", "commercial", "market"].includes(tag)
    )
  ) {
    return "city";
  }

  const mapNode = mapDefinition.nodes.find(
    (node) => node.id === cityDefinition?.mapNodeId
  );

  return mapNode?.kind === "settlement" ? "village" : "city";
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
  const typewriterLines = renderDialogueTypewriterLines(dialogueState.textLines);
  const hasAdvanceHint = dialogueState.advanceHintText.length > 0;

  return `
    <footer class="c-grain-shop-dialogue c-scene-dialogue c-location-dialogue" aria-label="地点对话">
      <div
        class="c-grain-shop-dialogue__text c-grain-shop-skin-card c-grain-shop-dialogue__text--clickable ${hasAdvanceHint ? "c-grain-shop-dialogue__text--with-hint" : ""}"
        data-action="close-location-dialogue"
        role="button"
        tabindex="0"
        data-ui-click-sound="none"
      >
        ${typewriterLines.markup}
        ${renderDialogueTypewriterHint(
          dialogueState.advanceHintText,
          typewriterLines.totalDurationMs
        )}
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

function renderAutoAdvanceStatusPanel(input: AppRenderInput): string {
  const panel = input.appState.autoAdvanceState?.statusPanel;
  if (panel == null) {
    return "";
  }

  return renderTempleAutoAdvanceStatusPanel(panel);
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
      ...(input.historicalCharacters == null
        ? {}
        : { historicalCharacters: input.historicalCharacters }),
      ...(input.historicalCityRosters == null
        ? {}
        : { historicalCityRosters: input.historicalCityRosters }),
      mapExplorationState:
        input.appState.gameState.runtime.mapExplorationByMapId[
          input.mapDefinition.id
        ] ?? null,
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
      input.appState.cityDirectoryState
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
      const npcInteractionBlocked = isNpcInteractionBlocked(
        selectNpcInteractionBlockState({
          overlayView: input.presenterOutput.overlay.overlayView,
          modalState: input.presenterOutput.overlay.modalState,
          locationDialogueState:
            input.presenterOutput.overlay.locationDialogueState,
          houseOverlay: stage.moduleViewModel.overlay,
          houseDialogue: stage.moduleViewModel.dialogue,
          beggingMiniGameState: input.appState.beggingMiniGameState,
          activitySession: input.appState.gameState.runtime.activitySession,
        })
      );
      return renderHouseModuleView(
        withResolvedHousePortraits(
          applyHouseNpcInteractionBlockedState(
            stage.moduleViewModel,
            npcInteractionBlocked
          ),
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
      currentBackgroundId: stage.currentSceneBackgroundId,
      activitySession: input.appState.gameState.runtime.activitySession,
      characterDefinitions: input.appState.characterDefinitions,
      choiceOptions: stage.currentSceneChoiceOptions,
      ...(input.textEntriesById == null
        ? {}
        : { textEntriesById: input.textEntriesById }),
    });
  }

  if (stage.type === "troop-editor") {
    return renderTroopEditorView(stage.viewModel);
  }

  if (stage.type === "troop-management") {
    return renderTroopManagementView(stage.viewModel);
  }

  if (stage.type === "battle") {
    const troopSnapshots = selectPlayerTroopSnapshots(
      input.appState,
      input.playerCharacterId
    );
    return renderStoryBattleView(input.appState.gameState.storyBattle, {
      formationPreview: createBattleTroopPreviewViewModel(
        troopSnapshots[0] ?? null
      ),
    });
  }

  return "";
}

function renderCityCardDrawTestOverlay(input: AppRenderInput): string {
  const state = input.appState.cityCardDrawTestState;
  if (state == null || input.presenterOutput.stage.type !== "city") {
    return "";
  }

  const resultText =
    state.resultValue == null
      ? "\u70b9\u51fb\u5361\u724c\u5f00\u59cb\u62bd\u53d6\uff0c\u8fd4\u56de 1-6 \u7684\u6d4b\u8bd5\u7ed3\u679c\u3002"
      : `\u672c\u6b21\u7ed3\u679c\u4e3a ${formatCardDrawResultLabel(state.resultValue)} (${state.resultValue})`;

  return `
    <div
      class="c-city-card-draw-test"
      data-city-card-draw-overlay
      data-city-card-draw-session-id="${state.sessionId}"
      role="dialog"
      aria-modal="true"
      aria-labelledby="city-card-draw-test-title"
    >
      <div class="c-city-card-draw-test__veil"></div>
      <section class="c-city-card-draw-test__panel">
        <button
          type="button"
          class="c-city-card-draw-test__close"
          data-action="close-city-card-draw-test"
          aria-label="\u5173\u95ed\u62bd\u5361\u6d4b\u8bd5"
        >
          ×
        </button>
        <p class="c-city-card-draw-test__eyebrow">\u4e34\u65f6\u6d4b\u8bd5</p>
        <h2 class="c-city-card-draw-test__title" id="city-card-draw-test-title">
          \u62bd\u5361\u52a8\u753b
        </h2>
        <p class="c-city-card-draw-test__copy">
          CardDrawAnimator \u4f1a\u5728\u70b9\u51fb\u5361\u724c\u540e\u8fd4\u56de\u4e00\u4e2a 1-6 \u6570\u503c\uff0c\u53ef\u4ee5\u76f4\u63a5\u7ed9\u5224\u5b9a\u903b\u8f91\u4f7f\u7528\u3002
        </p>
        <div class="c-city-card-draw-test__stage" data-city-card-draw-mount>
          ${
            state.resultValue == null
              ? ""
              : `
                <div class="c-city-card-draw-test__static-card" aria-hidden="true">
                  <span class="c-city-card-draw-test__static-card-label">${formatCardDrawResultLabel(
                    state.resultValue
                  )}</span>
                </div>
              `
          }
        </div>
        <p class="c-city-card-draw-test__result" data-city-card-draw-result-label>
          ${resultText}
        </p>
        <div class="c-city-card-draw-test__actions">
          <button
            type="button"
            class="c-city-card-draw-test__confirm"
            data-action="confirm-city-card-draw-test"
            ${state.resultValue == null ? "hidden" : ""}
          >
            \u786e\u5b9a
          </button>
        </div>
      </section>
    </div>
  `;
}

export function renderApp(input: AppRenderInput): string {
  const playerCharacter = getPlayerCharacter(
    input.appState,
    input.playerCharacterId
  );
  const basePlayerPanelModel = createGlobalPlayerPanelModel(
    playerCharacter,
    input.appState.gameState,
    null,
    input.presenterOutput.overlay.locationText
  );
  const goldTextOverride =
    input.coinRewardDisplayValue == null
      ? null
      : basePlayerPanelModel.goldText.replace(
          /^\d+/,
          String(input.coinRewardDisplayValue)
        );
  const playerPanelModel = {
    ...basePlayerPanelModel,
    goldTextOverride,
    ...(input.coinRewardAnchorEditor == null
      ? {}
      : { coinAnchorEditor: input.coinRewardAnchorEditor }),
  };
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
                    ? `${renderGlobalPlayerPanel(
                        playerPanelModel,
                        input.appState.uiLayouts["global-hud"]
                      )}
                      <button class="c-backpack-shortcut" type="button" data-action="open-backpack">背包</button>`
                    : ""
                }
              </div>
            </main>
            ${renderCityBeggingDefaultDialogueOverlay(input.appState.beggingMiniGameState)}
            ${renderLocationDialogue(
              input.presenterOutput.overlay.locationDialogueState,
              input.appState.characterDefinitions
            )}
            ${
              input.presenterOutput.overlay.storyChapterTitleText.length === 0
                ? ""
                : renderStoryChapterTitleOverlay(
                    input.presenterOutput.overlay.storyChapterTitleText
                  )
            }
            ${renderAutoAdvanceStatusPanel(input)}
            ${renderModal(
              input.presenterOutput.overlay.modalState,
              input.cityPortraits,
              input.mapDefinition,
              input.cityDefinitions ?? []
            )}
            ${renderNpcInteractionOverlay(input)}
            ${renderCityCardDrawTestOverlay(input)}
            ${renderCityBeggingMiniGameOverlay(input.appState.beggingMiniGameState)}
            <div class="p-ui-coin-reward-layer" data-ui-coin-reward-layer aria-hidden="true"></div>
            ${renderOverlay(input, playerCharacter)}
            ${renderLayoutEditor(input.appState)}
          </div>
        </div>
      </div>
    </div>
  `;
}
