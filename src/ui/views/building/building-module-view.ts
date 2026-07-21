import type { CharacterDefinition } from "../../../domain/character";
import type { CharacterManager } from "../../../application/character/character-manager";
import type { BuildingModuleStage } from "../../../application/building/building-module-entry";
import { resolveLocationBackgroundImageUrl } from "../../location-backgrounds";

export function renderBuildingModuleView(input: {
  stage: BuildingModuleStage;
  characterDefinitions: CharacterDefinition[];
  characterManager: CharacterManager;
}): string {
  if (input.stage.type !== "building") {
    return "";
  }

  const arrangement = input.stage.arrangement;
  const backgroundId =
    arrangement.backgroundId ?? input.stage.activeHouse.backgroundId;
  const backgroundImageUrl = resolveLocationBackgroundImageUrl(backgroundId);
  const backgroundStyle =
    backgroundImageUrl == null
      ? ""
      : `background-image:url('${backgroundImageUrl}')`;
  const title = arrangement.displayName ?? input.stage.activeHouse.name;
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
              if (container.characters.length === 0) {
                return "";
              }

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
              if (container.actions.length === 0) {
                return "";
              }

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
