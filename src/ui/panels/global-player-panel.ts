import { resolveCharacterPortraitImageUrl } from "../portrait-assets";
import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import type { MissionDefinition } from "../../domain/mission";
import type { GlobalHudLayout, UiLayoutComponent } from "../../domain/ui-layout";
import { getCouncilStatusText } from "../../application/time/time-progression";

const compactHudAssets = {
  base: "/ui/yuansu/属性栏/20260706-152826.png",
  portraitFrame: "/ui/yuansu/属性栏/20260706-172043.png",
  titlePlate: "/ui/yuansu/属性栏/20260706-152803.png",
  locationIcon: "/ui/yuansu/属性栏/20260706-152722.png",
  goldIcon: "/ui/yuansu/属性栏/20260706-152814.png",
  staminaIcon: "/ui/yuansu/属性栏/20260706-152810.png",
  prestigeIcon: "/ui/yuansu/属性栏/20260706-152807.png",
  attributeButton: "/ui/yuansu/属性栏/20260706-152820.png",
};

export type GlobalPlayerPanelModel = {
  portraitLabel: string;
  portraitImageUrl: string | null;
  name: string;
  title: string;
  currentDateText: string;
  locationText: string;
  goldText: string;
  stamina: number;
  fame: number;
  reviewDateText: string;
  mainHouseMissionText: string;
};

function formatTimeOfDayLabel(timeOfDay: GameState["world"]["timeOfDay"]): string {
  switch (timeOfDay) {
    case "morning":
      return "早晨";
    case "afternoon":
      return "午后";
    case "night":
      return "夜晚";
    default:
      return timeOfDay;
  }
}

function getComponent(
  layout: GlobalHudLayout,
  componentId: string
): UiLayoutComponent | null {
  return layout.components.find((component) => component.id === componentId) ?? null;
}

export function createGlobalPlayerPanelModel(
  playerCharacter: CharacterDefinition,
  state: GameState,
  activeMission: MissionDefinition | null,
  locationText: string
): GlobalPlayerPanelModel {
  return {
    portraitLabel:
      playerCharacter.portraitVariants?.find(
        (variant) => variant.id === playerCharacter.portraitVariantId
      )?.label ?? "通常",
    portraitImageUrl: resolveCharacterPortraitImageUrl(playerCharacter),
    name: playerCharacter.name,
    title: playerCharacter.title ?? playerCharacter.occupation ?? "无官职",
    currentDateText:
      `${state.calendar.year}年${state.calendar.month}月${state.calendar.day}日` +
      `・${formatTimeOfDayLabel(state.world.timeOfDay)}`,
    locationText,
    goldText: `${playerCharacter.stats.gold} 文`,
    stamina: playerCharacter.stamina,
    fame: playerCharacter.stats.fame,
    reviewDateText: getCouncilStatusText(state),
    mainHouseMissionText:
      activeMission?.title ?? state.ui.mainHouseMissionText ?? "暂无任务",
  };
}

export function renderGlobalPlayerPanel(
  model: GlobalPlayerPanelModel,
  layout: GlobalHudLayout
): string {
  const taskComponent = getComponent(layout, "task-panel");
  const taskItems = [
    {
      id: "review",
      label: "评定",
      value: model.reviewDateText,
      title: model.reviewDateText,
    },
    {
      id: "mission",
      label: "当前任务",
      value: model.mainHouseMissionText,
      title: model.mainHouseMissionText,
    },
  ];

  return `
    <section class="p-global-hud">
      <div class="p-global-status-layout" aria-label="人物属性栏">
        <div class="p-global-status-compact">
          <img class="p-global-status-compact__layer p-global-status-compact__base" src="${compactHudAssets.base}" alt="" aria-hidden="true">
          <img class="p-global-status-compact__layer p-global-status-compact__portrait-frame" src="${compactHudAssets.portraitFrame}" alt="" aria-hidden="true">
          <img class="p-global-status-compact__layer" src="${compactHudAssets.titlePlate}" alt="" aria-hidden="true">
          <img class="p-global-status-compact__layer" src="${compactHudAssets.locationIcon}" alt="" aria-hidden="true">
          <img class="p-global-status-compact__layer" src="${compactHudAssets.goldIcon}" alt="" aria-hidden="true">
          <img class="p-global-status-compact__layer" src="${compactHudAssets.staminaIcon}" alt="" aria-hidden="true">
          <img class="p-global-status-compact__layer" src="${compactHudAssets.prestigeIcon}" alt="" aria-hidden="true">
          <img class="p-global-status-compact__layer" src="${compactHudAssets.attributeButton}" alt="" aria-hidden="true">
          ${
            model.portraitImageUrl == null
              ? ""
              : `
                <div class="p-global-status-compact__portrait-mask">
                  <img class="p-global-status-compact__portrait-art" src="${model.portraitImageUrl}" alt="${model.name}">
                </div>
              `
          }
          <strong class="p-global-status-compact__name">${model.name}</strong>
          <span class="p-global-status-compact__title">${model.title}</span>
          <strong class="p-global-status-compact__location">${model.locationText}</strong>
          <span class="p-global-status-compact__date-separator" aria-hidden="true"></span>
          <strong class="p-global-status-compact__date">${model.currentDateText}</strong>
          <strong class="p-global-status-compact__gold">银两 ${model.goldText}</strong>
          <strong class="p-global-status-compact__stamina">体力 ${model.stamina}</strong>
          <strong class="p-global-status-compact__prestige">威望 ${model.fame}</strong>
          <button
            class="u-click-layer p-global-status-compact__attribute"
            data-action="open-player-detail"
            data-button-sound="heavy"
            aria-label="打开人物详细属性"
          ></button>
        </div>
      </div>
      ${
        taskComponent == null
          ? ""
          : `
            <aside
              class="p-global-task-panel"
              aria-label="右侧任务栏"
              style="--task-item-count:${taskItems.length}"
            >
              <div class="p-global-task-panel__items">
                ${taskItems
                  .map(
                    (item) => `
                      <section class="p-global-task-panel__item" title="${item.title}" data-task-item="${item.id}">
                        <span class="p-global-task-panel__label">${item.label}</span>
                        <strong class="p-global-task-panel__value">${item.value}</strong>
                      </section>
                    `
                  )
                  .join("")}
              </div>
            </aside>
          `
      }
    </section>
  `;
}
