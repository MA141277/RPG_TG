import type { DialogueScreenViewModel } from "../../core/runtime/dialogue-screen-runtime";
import {
  renderDialogueTypewriterHint,
  renderDialogueTypewriterLines,
} from "../dialogue-typewriter";

type DialogueScreenPanelInput = {
  dialogueScreenViewModel: DialogueScreenViewModel;
  activityOverlay: string;
  speakerPortraitImageUrl: string | null;
  speakerPortraitArtClassName?: string;
};

function renderSceneDialogueCard(
  paragraphs: string[],
  options: {
    advanceActionId?: string;
    speakerName?: string;
    narration?: boolean;
    portraitImageUrl?: string | null;
    portraitArtClassName?: string;
  } = {}
): string {
  const clickable = options.advanceActionId != null;
  const typewriterLines = renderDialogueTypewriterLines(paragraphs);

  return `
    <footer class="c-grain-shop-dialogue c-scene-dialogue" aria-label="剧情对话">
      <div
        class="c-grain-shop-dialogue__text c-grain-shop-skin-card ${clickable ? "c-grain-shop-dialogue__text--clickable" : ""}"
        ${clickable ? `data-scene-action="${options.advanceActionId}" role="button" tabindex="0" data-ui-click-sound="none"` : ""}
      >
        ${typewriterLines.markup}
        ${
          clickable
            ? renderDialogueTypewriterHint(
                "点击继续",
                typewriterLines.totalDurationMs
              )
            : ""
        }
      </div>
      ${
        options.narration
          ? ""
          : `
            <div class="c-grain-shop-dialogue__npc">
              <div class="c-grain-shop-portrait" aria-hidden="true">
                ${
                  options.portraitImageUrl == null
                    ? `<span class="c-grain-shop-portrait__art ${options.portraitArtClassName ?? ""}"></span>`
                    : `<img class="c-grain-shop-portrait__image" src="${options.portraitImageUrl}" alt="">`
                }
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

function renderDialogueScreenChoiceList(
  dialogueScreenViewModel: DialogueScreenViewModel
): string {
  return `
    <div class="c-grain-shop-center c-grain-shop-center--open">
      <nav class="c-grain-shop-actions" aria-label="剧情选择">
        ${dialogueScreenViewModel.options
          .map(
            (option) => `
              <button
                type="button"
                class="c-button c-grain-shop-button c-grain-shop-button--paper"
                data-scene-choice-id="${option.id}"
              >
                ${option.text}
              </button>
            `
          )
          .join("")}
      </nav>
    </div>
  `;
}

export function renderDialogueScreenPanel(
  input: DialogueScreenPanelInput
): string {
  const {
    dialogueScreenViewModel,
    activityOverlay,
    speakerPortraitImageUrl,
    speakerPortraitArtClassName,
  } = input;

  if (dialogueScreenViewModel.mode === "choice") {
    return `
      <section class="view-house-grain-shop view-house-temple view-scene" data-scene-view="choice">
        ${renderSceneDialogueCard([dialogueScreenViewModel.text], {
          speakerName: dialogueScreenViewModel.speakerName,
          portraitImageUrl: speakerPortraitImageUrl,
          ...(speakerPortraitImageUrl == null
            ? {
                portraitArtClassName: speakerPortraitArtClassName,
              }
            : {}),
        })}
        ${renderDialogueScreenChoiceList(dialogueScreenViewModel)}
      </section>
      ${activityOverlay}
    `;
  }

  return `
    <section class="view-house-grain-shop view-house-temple view-scene" data-scene-view="dialogue">
      ${renderSceneDialogueCard([dialogueScreenViewModel.text], {
        advanceActionId: "advance",
        speakerName: dialogueScreenViewModel.speakerName,
        portraitImageUrl: speakerPortraitImageUrl,
        ...(speakerPortraitImageUrl == null
          ? {
              portraitArtClassName: speakerPortraitArtClassName,
            }
          : {}),
      })}
    </section>
    ${activityOverlay}
  `;
}
