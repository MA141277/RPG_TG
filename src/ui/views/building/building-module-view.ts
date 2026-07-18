import type { CharacterDefinition } from "../../../domain/character";
import type { CharacterManager } from "../../../application/character/character-manager";
import type { BuildingModuleStage } from "../../../application/building/building-module-entry";
import { resolveCharacterAvatarImageUrl, resolveCharacterPortraitImageUrl } from "../../portrait-assets";
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

  return `
    <section class="view-house">
      <div class="c-stage-header">
        <div>
          <p class="c-stage-header__eyebrow">灞嬫暦</p>
          <h1 class="c-stage-header__title">${houseViewModel.title}</h1>
        </div>
        <button class="c-button c-button--ghost" data-action="leave-house">${houseViewModel.backButtonLabel}</button>
      </div>
      <div class="c-house-interior">
        <div class="c-house-interior__hero c-panel">
          <strong class="c-house-interior__hero-name">
            ${houseViewModel.defaultCharacterId == null ? "鏃犱汉鎺ュ緟" : "榛樿瑙掕壊宸插睍寮€"}
          </strong>
          <p class="c-house-interior__hero-text">
            杩欓噷鏄?${houseViewModel.title}銆傚悗缁彲浠ュ湪杩欓噷鎺ュ叆瑙掕壊鍔熻兘銆佷簨浠跺叆鍙ｄ笌灏忔父鎴忋€?
          </p>
        </div>
        <div class="c-house-roster">
          ${houseViewModel.characterSummaries
            .map(
              (characterSummary) => `
                <article class="c-roster-card c-panel">
                  <span class="c-roster-card__title">${characterSummary.title ?? "鍦ㄥ満浜虹墿"}</span>
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
