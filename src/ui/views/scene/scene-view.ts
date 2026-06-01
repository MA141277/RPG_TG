import type { ActionNode, ChoiceOption } from "../../../domain/action";
import type { CharacterDefinition } from "../../../domain/character";

type SceneViewInput = {
  currentAction: ActionNode | null;
  characterDefinitions: CharacterDefinition[];
  choiceOptions: ChoiceOption[];
};

function getScenePortraitArtClassName(characterId: string): string {
  switch (characterId) {
    case "char.kulan_temple_abbot":
      return "c-temple-house-portrait-art--abbot";
    case "char.kulan_temple_senior_monk":
      return "c-temple-house-portrait-art--senior-monk";
    default:
      return "";
  }
}

function getCharacterName(
  characterDefinitions: CharacterDefinition[],
  characterId: string
): string {
  return (
    characterDefinitions.find(
      (characterDefinition) => characterDefinition.id === characterId
    )?.name ?? characterId
  );
}

function renderSceneDialogueCard(
  paragraphs: string[],
  options: {
    advanceActionId?: string;
    speakerName?: string;
    narration?: boolean;
    portraitArtClassName?: string;
  } = {}
): string {
  const clickable = options.advanceActionId != null;

  return `
    <footer class="c-grain-shop-dialogue c-scene-dialogue" aria-label="剧情对话">
      <div
        class="c-grain-shop-dialogue__text c-grain-shop-skin-card ${clickable ? "c-grain-shop-dialogue__text--clickable" : ""}"
        ${clickable ? `data-scene-action="${options.advanceActionId}" role="button" tabindex="0"` : ""}
      >
        ${paragraphs
          .map((paragraph) => `<p class="c-grain-shop-dialogue__line">${paragraph}</p>`)
          .join("")}
        ${
          clickable
            ? '<p class="c-grain-shop-dialogue__hint">点击继续</p>'
            : ""
        }
      </div>
      ${
        options.narration
          ? ""
          : `
            <div class="c-grain-shop-dialogue__npc">
              <div class="c-grain-shop-portrait" aria-hidden="true">
                <span class="c-grain-shop-portrait__art ${options.portraitArtClassName ?? ""}"></span>
              </div>
              <p class="c-grain-shop-portrait__name c-grain-shop-nameplate c-grain-shop-nameplate--small">
                ${options.speakerName ?? ""}
              </p>
            </div>
          `
      }
    </footer>
  `;
}

function renderChoiceList(choiceOptions: ChoiceOption[]): string {
  return `
    <div class="c-grain-shop-center c-grain-shop-center--open">
      <nav class="c-grain-shop-actions" aria-label="剧情选择">
        ${choiceOptions
          .map(
            (option) => `
              <button
                type="button"
                class="c-button c-grain-shop-button c-grain-shop-button--paper"
                data-scene-choice-id="${option.id}"
              >
                ${option.label}
              </button>
            `
          )
          .join("")}
      </nav>
    </div>
  `;
}

export function renderSceneView(input: SceneViewInput): string {
  const action = input.currentAction;
  if (action == null) {
    return "";
  }

  if (action.type === "narration") {
    return `
      <section class="view-house-grain-shop view-house-temple view-scene" data-scene-view="narration">
        ${renderSceneDialogueCard([action.text], {
          advanceActionId: "advance",
          narration: true,
        })}
      </section>
    `;
  }

  if (action.type === "dialogue") {
    return `
      <section class="view-house-grain-shop view-house-temple view-scene" data-scene-view="dialogue">
        ${renderSceneDialogueCard([action.text], {
          advanceActionId: "advance",
          speakerName: getCharacterName(input.characterDefinitions, action.characterId),
          portraitArtClassName: getScenePortraitArtClassName(action.characterId),
        })}
      </section>
    `;
  }

  if (action.type === "choice") {
    return `
      <section class="view-house-grain-shop view-house-temple view-scene" data-scene-view="choice">
        ${renderSceneDialogueCard(
          [action.prompt ?? "你要如何回应？"],
          { narration: true }
        )}
        ${renderChoiceList(input.choiceOptions)}
      </section>
    `;
  }

  return `
    <section class="view-house-grain-shop view-house-temple view-scene" data-scene-view="transition">
      ${renderSceneDialogueCard(["场景推进中。"], {
        advanceActionId: "advance",
        narration: true,
      })}
    </section>
  `;
}
