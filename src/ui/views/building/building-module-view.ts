import type { CharacterDefinition } from "../../../domain/character";
import type { CharacterManager } from "../../../application/character/character-manager";
import type { BuildingModuleStage } from "../../../application/building/building-module-entry";
import { resolveCharacterAvatarImageUrl, resolveCharacterPortraitImageUrl } from "../../portrait-assets";
import { resolveLocationBackgroundImageUrl } from "../../location-backgrounds";
import { createHouseViewModel } from "../house/house-view";
import { renderHouseModuleView } from "../house/house-module-view-registry";
import type { HouseModuleViewModel } from "../../../domain/house-module";

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
          actor.portraitImageUrl ?? resolveCharacterPortraitImageUrl(characterDefinition),
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

export function renderBuildingModuleView(input: {
  stage: BuildingModuleStage;
  characterDefinitions: CharacterDefinition[];
  characterManager: CharacterManager;
}): string {
  if (input.stage.type === "empty") {
    return "";
  }

  if (input.stage.type === "building") {
    const arrangement = input.stage.arrangement;
    const backgroundId =
      arrangement.backgroundId ?? input.stage.activeHouse.backgroundId;
    const backgroundImageUrl = resolveLocationBackgroundImageUrl(backgroundId);
    const backgroundStyle =
      backgroundImageUrl == null
        ? ""
        : `background-image:url('${backgroundImageUrl}')`;
    const title =
      arrangement.displayName ?? input.stage.activeHouse.name;
    const backButtonLabel = input.stage.activeHouse.backAction?.label ?? "返回";

    return `
      <section class="view-house" style="${backgroundStyle}">
        <div class="c-stage-header">
          <div>
            <p class="c-stage-header__eyebrow">建筑</p>
            <h1 class="c-stage-header__title">${title}</h1>
          </div>
          <button class="c-button c-button--ghost" data-action="leave-house">${backButtonLabel}</button>
        </div>
        <div class="c-house-interior">
          ${
            arrangement.description == null
              ? ""
              : `<div class="c-house-interior__hero c-panel">
                  <p class="c-house-interior__hero-text">${arrangement.description}</p>
                </div>`
          }
          ${input.stage.containerViewModels
            .map((container) => {
              if (container.type === "character-seats") {
                return `
                  <section class="c-house-roster" data-building-container-id="${container.id}">
                    ${container.title == null ? "" : `<h2>${container.title}</h2>`}
                    ${container.characters
                      .map(
                        (character) => `
                          <article class="c-roster-card c-panel">
                            <span class="c-roster-card__title">${character.title ?? "在场人物"}</span>
                            <strong class="c-roster-card__name">${character.name}</strong>
                          </article>
                        `
                      )
                      .join("")}
                  </section>
                `;
              }

              if (container.type === "action-menu") {
                return `
                  <section class="c-house-roster" data-building-container-id="${container.id}">
                    ${container.title == null ? "" : `<h2>${container.title}</h2>`}
                    ${container.actions
                      .map(
                        (action) => `
                          <button
                            class="c-button"
                            data-action="building-container-item-action"
                            data-building-arrangement-id="${arrangement.id}"
                            data-building-container-id="${container.id}"
                            data-building-container-action-id="${action.id}"
                            data-building-container-event-id="${action.eventId}"
                            ${action.isEnabled ? "" : "disabled"}
                          >
                            ${action.label}
                          </button>
                        `
                      )
                      .join("")}
                  </section>
                `;
              }

              return `
                <section class="c-panel" data-building-container-id="${container.id}">
                  ${container.title == null ? "" : `<h2>${container.title}</h2>`}
                </section>
              `;
            })
            .join("")}
        </div>
      </section>
    `;
  }

  if (input.stage.moduleViewModel != null) {
    return renderHouseModuleView(
      withResolvedHousePortraits(
        input.stage.moduleViewModel,
        input.characterDefinitions
      )
    );
  }

  const houseViewModel = createHouseViewModel(
    input.stage.activeHouse,
    input.characterManager,
    input.stage.cityNpcSummaries
  );
  const backgroundImageUrl = resolveLocationBackgroundImageUrl(
    input.stage.activeHouse.backgroundId
  );
  const backgroundStyle =
    backgroundImageUrl == null
      ? ""
      : `background-image:url('${backgroundImageUrl}')`;

  return `
    <section class="view-house" style="${backgroundStyle}">
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
            这里是 ${houseViewModel.title}。后续可以在这里接入角色功能、事件入口与小游戏。
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
