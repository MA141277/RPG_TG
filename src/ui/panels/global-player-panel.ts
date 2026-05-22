import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import type { MissionDefinition } from "../../domain/mission";

export type GlobalPlayerPanelModel = {
  portraitLabel: string;
  name: string;
  title: string;
  currentDateText: string;
  locationText: string;
  goldText: string;
  stamina: number;
  staminaPercent: number;
  fame: number;
  reviewDateText: string;
  mainHouseMissionText: string;
};

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
    name: playerCharacter.name,
    title: playerCharacter.title ?? playerCharacter.occupation ?? "无官职",
    currentDateText: `${state.calendar.year}年 ${state.calendar.month}月${state.calendar.day}日`,
    locationText,
    goldText: `${playerCharacter.stats.gold} 文`,
    stamina: playerCharacter.stamina,
    staminaPercent: Math.max(0, Math.min(100, playerCharacter.stamina)) / 100,
    fame: playerCharacter.stats.fame,
    reviewDateText: state.ui.reviewDateText,
    mainHouseMissionText:
      activeMission?.title ?? state.ui.mainHouseMissionText ?? "暂无任务",
  };
}

export function renderGlobalPlayerPanel(model: GlobalPlayerPanelModel): string {
  return `
    <section class="p-global-hud">
      <button class="u-click-layer p-global-status-trigger" data-action="open-player-detail" aria-label="打开角色详情">
        <div class="p-global-status-bar">
          <div class="p-global-status-bar__portrait">
            <div class="p-global-status-bar__portrait-frame">
              <span class="p-global-status-bar__portrait-label">${model.portraitLabel}</span>
            </div>
          </div>
          <div class="p-global-status-bar__board">
            <div class="p-global-status-bar__identity">
              <strong class="p-global-status-bar__name">${model.name}</strong>
              <span class="p-global-status-bar__title">${model.title}</span>
              <span class="p-global-status-bar__date">${model.currentDateText}</span>
            </div>
            <div class="p-global-status-bar__gold">
              <strong class="p-global-status-bar__gold-value">${model.goldText}</strong>
            </div>
            <div class="p-global-status-bar__location">
              <span class="p-global-status-bar__location-icon">◉</span>
              <strong class="p-global-status-bar__location-text">${model.locationText}</strong>
            </div>
            <div class="p-global-status-bar__stamina">
              <span class="p-global-status-bar__stamina-label">体力 ${model.stamina}</span>
              <div class="p-global-status-bar__meter">
                <span
                  class="p-global-status-bar__meter-fill"
                  style="transform: scaleX(${model.staminaPercent})"
                ></span>
              </div>
            </div>
            <div class="p-global-status-bar__prestige">
              <strong class="p-global-status-bar__prestige-value">${model.fame}</strong>
            </div>
          </div>
        </div>
      </button>
      <div class="p-global-task-panel">
        <div class="p-global-task-panel__header"></div>
        <div class="p-global-task-panel__items">
          <section class="p-global-task-panel__item">
            <span class="p-global-task-panel__label">距离评定</span>
            <strong class="p-global-task-panel__value">${model.reviewDateText}</strong>
          </section>
          <section class="p-global-task-panel__item" title="${model.mainHouseMissionText}">
            <span class="p-global-task-panel__label">当前任务</span>
            <strong class="p-global-task-panel__value">${model.mainHouseMissionText}</strong>
          </section>
        </div>
        <div class="p-global-task-panel__footer"></div>
      </div>
    </section>
  `;
}
