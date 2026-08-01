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
  underlayMarkup?: string;
};

function renderDialogueScreenCard(
  paragraphs: string[],
  options: {
    speakerName?: string;
    portraitImageUrl?: string | null;
    portraitArtClassName?: string;
    advanceActionId?: string;
  } = {}
): string {
  const clickable = options.advanceActionId != null;
  const typewriterLines = renderDialogueTypewriterLines(paragraphs);

  return `
    <footer class="c-grain-shop-dialogue c-scene-dialogue" aria-label="剧情对话">
      <div
        class="c-grain-shop-dialogue__text c-grain-shop-skin-card ${clickable ? "c-grain-shop-dialogue__text--clickable" : ""}"
        ${clickable ? `data-dialogue-action="${options.advanceActionId}" role="button" tabindex="0" data-ui-click-sound="none"` : ""}
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
                data-dialogue-choice-id="${option.id}"
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
    underlayMarkup,
  } = input;

  if (dialogueScreenViewModel.mode === "choice") {
    return `
      <section class="view-dialogue" data-dialogue-view="choice">
        ${underlayMarkup ?? ""}
        ${renderDialogueScreenCard([dialogueScreenViewModel.text], {
          speakerName: dialogueScreenViewModel.speakerName,
          portraitImageUrl: speakerPortraitImageUrl,
          ...(speakerPortraitImageUrl == null
            ? { portraitArtClassName: speakerPortraitArtClassName }
            : {}),
        })}
        ${renderDialogueScreenChoiceList(dialogueScreenViewModel)}
      </section>
      ${activityOverlay}
    `;
  }

  return `
    <section class="view-dialogue" data-dialogue-view="dialogue">
      ${underlayMarkup ?? ""}
      ${renderDialogueScreenCard([dialogueScreenViewModel.text], {
        advanceActionId: "advance",
        speakerName: dialogueScreenViewModel.speakerName,
        portraitImageUrl: speakerPortraitImageUrl,
        ...(speakerPortraitImageUrl == null
          ? { portraitArtClassName: speakerPortraitArtClassName }
          : {}),
      })}
    </section>
    ${activityOverlay}
  `;
}
