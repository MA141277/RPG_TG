import { resolveCharacterPortraitImageUrl } from "../portrait-assets";
import { uiLayoutComponentBaseSizeById } from "../../domain/ui-layout";
import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import type { MissionDefinition } from "../../domain/mission";
import type {
  GlobalHudLayout,
  UiLayoutComponent,
  UiLayoutElement,
} from "../../domain/ui-layout";
import { getCouncilStatusText } from "../../application/time/time-progression";

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

function getComponentRectStyle(component: UiLayoutComponent): string {
  return [
    `left:${component.rect.x}px`,
    `top:${component.rect.y}px`,
    `width:${component.rect.width}px`,
    `height:${component.rect.height}px`,
  ].join(";");
}

function getComponentContentStyle(component: UiLayoutComponent): string {
  const baseSize = uiLayoutComponentBaseSizeById[component.id];
  if (baseSize == null) {
    return "width:100%;height:100%;";
  }

  const scale = component.rect.width / Math.max(baseSize.width, 1);
  return [
    `width:${baseSize.width}px`,
    `height:${baseSize.height}px`,
    `transform-origin:top left`,
    `transform:scale(${scale})`,
  ].join(";");
}

function getBackgroundStyle(component: UiLayoutComponent): string {
  const background = component.background;
  const styleParts: string[] = [];

  if (background != null) {
    if (background.mode === "nine-slice") {
      styleParts.push(
        `border-style:solid`,
        `border-width:${background.slice.top}px ${background.slice.right}px ${background.slice.bottom}px ${background.slice.left}px`,
        `border-image-source:url(${background.imageUrl})`,
        `border-image-slice:${background.slice.top} ${background.slice.right} ${background.slice.bottom} ${background.slice.left} fill`,
        `border-image-width:${background.slice.top} ${background.slice.right} ${background.slice.bottom} ${background.slice.left}`
      );
    } else {
      const backgroundSize =
        background.mode === "contain"
          ? "contain"
          : background.mode === "cover"
            ? "cover"
            : "100% 100%";
      styleParts.push(
        `background-image:url(${background.imageUrl})`,
        `background-repeat:no-repeat`,
        `background-position:center`,
        `background-size:${backgroundSize}`
      );
    }
  }

  return styleParts.join(";");
}

function getElementStyle(element: UiLayoutElement): string {
  return [
    `left:${element.rect.x}px`,
    `top:${element.rect.y}px`,
    `width:${element.rect.width}px`,
    `height:${element.rect.height}px`,
  ].join(";");
}

function getComponent(
  layout: GlobalHudLayout,
  componentId: string
): UiLayoutComponent | null {
  return layout.components.find((component) => component.id === componentId) ?? null;
}

function getElement(
  component: UiLayoutComponent | null,
  elementId: string
): UiLayoutElement | null {
  return component?.elements.find((element) => element.id === elementId) ?? null;
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
  const portraitComponent = getComponent(layout, "portrait-frame");
  const statusComponent = getComponent(layout, "status-board");
  const taskComponent = getComponent(layout, "task-panel");
  const portraitLabelElement = getElement(portraitComponent, "portrait-label");
  const identityElement = getElement(statusComponent, "identity");
  const goldElement = getElement(statusComponent, "gold");
  const locationElement = getElement(statusComponent, "location");
  const staminaElement = getElement(statusComponent, "stamina");
  const prestigeElement = getElement(statusComponent, "prestige");
  const reviewItemElement = getElement(taskComponent, "review-item");
  const missionItemElement = getElement(taskComponent, "mission-item");

  return `
    <section class="p-global-hud">
      <button class="u-click-layer p-global-status-trigger" data-action="open-player-detail" aria-label="打开角色详情">
        <div class="p-global-status-layout">
          ${
            portraitComponent == null
              ? ""
              : `
                <div class="p-global-status-bar__portrait p-layout-component" style="${getComponentRectStyle(portraitComponent)}">
                  <div class="p-layout-component__content" style="${getComponentContentStyle(portraitComponent)}">
                    <div class="p-global-status-bar__portrait-shell">
                      ${
                        model.portraitImageUrl == null
                          ? ""
                          : `
                            <div class="p-global-status-bar__portrait-mask">
                              <img class="p-global-status-bar__portrait-art" src="${model.portraitImageUrl}" alt="${model.name}">
                            </div>
                          `
                      }
                      <div class="p-global-status-bar__portrait-frame" style="${getBackgroundStyle(portraitComponent)}"></div>
                      <span
                        class="p-global-status-bar__portrait-label"
                        style="${portraitLabelElement == null ? "" : getElementStyle(portraitLabelElement)}"
                      >
                        ${model.portraitLabel}
                      </span>
                    </div>
                  </div>
                </div>
              `
          }
          ${
            statusComponent == null
              ? ""
              : `
                <div class="p-layout-component" style="${getComponentRectStyle(statusComponent)}">
                  <div class="p-layout-component__content" style="${getComponentContentStyle(statusComponent)}">
                    <div class="p-global-status-bar__board" style="${getBackgroundStyle(statusComponent)}">
                      <div class="p-global-status-bar__identity" style="${identityElement == null ? "" : getElementStyle(identityElement)}">
                        <strong class="p-global-status-bar__name">${model.name}</strong>
                        <span class="p-global-status-bar__title">${model.title}</span>
                        <span class="p-global-status-bar__date">${model.currentDateText}</span>
                      </div>
                      <div class="p-global-status-bar__gold" style="${goldElement == null ? "" : getElementStyle(goldElement)}">
                        <strong class="p-global-status-bar__gold-value">${model.goldText}</strong>
                      </div>
                      <div class="p-global-status-bar__location" style="${locationElement == null ? "" : getElementStyle(locationElement)}">
                        <span class="p-global-status-bar__location-icon">◉</span>
                        <strong class="p-global-status-bar__location-text">${model.locationText}</strong>
                      </div>
                      <div class="p-global-status-bar__stamina" style="${staminaElement == null ? "" : getElementStyle(staminaElement)}">
                        <span class="p-global-status-bar__stamina-label">体力 ${model.stamina}</span>
                      </div>
                      <div class="p-global-status-bar__prestige" style="${prestigeElement == null ? "" : getElementStyle(prestigeElement)}">
                        <span class="p-global-status-bar__prestige-label">威望</span>
                        <strong class="p-global-status-bar__prestige-value">${model.fame}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              `
          }
        </div>
      </button>
      ${
        taskComponent == null
          ? ""
          : `
            <div class="p-layout-component" style="${getComponentRectStyle(taskComponent)}">
              <div class="p-layout-component__content" style="${getComponentContentStyle(taskComponent)}">
                <div class="p-global-task-panel" style="${getBackgroundStyle(taskComponent)}">
                  <div class="p-global-task-panel__header"></div>
                  <div class="p-global-task-panel__items">
                    <section class="p-global-task-panel__item" style="${reviewItemElement == null ? "" : getElementStyle(reviewItemElement)}">
                      <span class="p-global-task-panel__label">评定</span>
                      <strong class="p-global-task-panel__value">${model.reviewDateText}</strong>
                    </section>
                    <section
                      class="p-global-task-panel__item"
                      title="${model.mainHouseMissionText}"
                      style="${missionItemElement == null ? "" : getElementStyle(missionItemElement)}"
                    >
                      <span class="p-global-task-panel__label">当前任务</span>
                      <strong class="p-global-task-panel__value">${model.mainHouseMissionText}</strong>
                    </section>
                  </div>
                  <div class="p-global-task-panel__footer"></div>
                </div>
              </div>
            </div>
          `
      }
    </section>
  `;
}
