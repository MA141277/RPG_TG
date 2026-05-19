import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import type { MissionDefinition } from "../../domain/mission";

export type GlobalPlayerPanelModel = {
  portraitLabel: string;
  name: string;
  title: string;
  occupation: string;
  currentDateText: string;
  ageText: string;
  stamina: number;
  fame: number;
  notoriety: number;
  reviewDateText: string;
  mainHouseMissionText: string;
  biography: string;
};

export function createGlobalPlayerPanelModel(
  playerCharacter: CharacterDefinition,
  state: GameState,
  activeMission: MissionDefinition | null
): GlobalPlayerPanelModel {
  const notorietyValue = state.runtime.variables.notoriety;

  return {
    portraitLabel:
      playerCharacter.portraitVariants?.find(
        (variant) => variant.id === playerCharacter.portraitVariantId
      )?.label ?? "通常",
    name: playerCharacter.name,
    title: playerCharacter.title ?? "无职位",
    occupation: playerCharacter.occupation ?? "无职业",
    currentDateText: `${state.calendar.year}年 ${state.calendar.month}月 ${state.calendar.day}日`,
    ageText: `${playerCharacter.age}岁`,
    stamina: playerCharacter.stamina,
    fame: playerCharacter.stats.fame,
    notoriety: typeof notorietyValue === "number" ? notorietyValue : 0,
    reviewDateText: state.ui.reviewDateText,
    mainHouseMissionText: activeMission?.title ?? state.ui.mainHouseMissionText,
    biography: playerCharacter.biography ?? "暂无人物简介。",
  };
}

export function renderGlobalPlayerPanel(model: GlobalPlayerPanelModel): string {
  return `
    <section class="p-global-player-card">
      <div class="p-global-player-card__portrait">
        <span class="p-global-player-card__portrait-label">${model.portraitLabel}</span>
      </div>
      <div class="p-global-player-card__body">
        <div class="p-global-player-card__topline">
          <strong class="p-global-player-card__name">${model.name}</strong>
          <span class="p-global-player-card__title">${model.title}</span>
        </div>
        <div class="p-global-player-card__meta">
          <span>${model.currentDateText}</span>
          <span>${model.ageText}</span>
          <span>${model.occupation}</span>
        </div>
        <div class="p-global-player-card__row">
          <span>体力</span>
          <div class="p-global-player-card__meter">
            <span class="p-global-player-card__meter-fill" style="width: ${model.stamina}%"></span>
          </div>
          <strong>${model.stamina}</strong>
        </div>
        <div class="p-global-player-card__row">
          <span>名声</span>
          <div class="p-global-player-card__meter">
            <span class="p-global-player-card__meter-fill" style="width: ${Math.min(model.fame, 100)}%"></span>
          </div>
          <strong>${model.fame}</strong>
        </div>
        <div class="p-global-player-card__row">
          <span>恶名</span>
          <div class="p-global-player-card__meter">
            <span class="p-global-player-card__meter-fill p-global-player-card__meter-fill--dark" style="width: ${Math.min(model.notoriety, 100)}%"></span>
          </div>
          <strong>${model.notoriety}</strong>
        </div>
        <p class="p-global-player-card__note">${model.biography}</p>
      </div>
    </section>
    <section class="p-global-task-card">
      <div class="p-global-task-card__block">
        <span class="p-global-task-card__label">距离评定</span>
        <strong class="p-global-task-card__value">${model.reviewDateText}</strong>
      </div>
      <div class="p-global-task-card__block">
        <span class="p-global-task-card__label">主家任务</span>
        <strong class="p-global-task-card__value">${model.mainHouseMissionText}</strong>
      </div>
    </section>
  `;
}
