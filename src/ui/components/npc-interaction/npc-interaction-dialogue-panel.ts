import type { NpcInteractionSession } from "../../../domain/npc-interaction";
import {
  renderDialogueTypewriterHint,
  renderDialogueTypewriterLines,
} from "../../dialogue-typewriter";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function looksLikeInternalSpeakerToken(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length === 0 || /[\u3400-\u9fff]/u.test(trimmed)) {
    return false;
  }

  if (/^[A-Z0-9_]+$/u.test(trimmed)) {
    return true;
  }

  return /[._:-]/u.test(trimmed);
}

function resolveOptionStance(input: {
  stance?: string;
  kind?: string;
  index: number;
}): "benevolent" | "neutral" | "hostile" {
  const normalizedStance = input.stance?.trim().toLowerCase();
  if (
    normalizedStance === "benevolent" ||
    normalizedStance === "neutral" ||
    normalizedStance === "hostile"
  ) {
    return normalizedStance;
  }

  const normalizedKind = input.kind?.trim().toLowerCase();
  if (normalizedKind === "benevolent") {
    return "benevolent";
  }

  if (normalizedKind === "neutral") {
    return "neutral";
  }

  if (normalizedKind === "hostile") {
    return "hostile";
  }

  if (input.index === 0) {
    return "benevolent";
  }

  if (input.index === 1) {
    return "neutral";
  }

  return "hostile";
}

export function renderNpcInteractionDialoguePanel(input: {
  session: NpcInteractionSession;
  targetName: string | null;
  portraitImageUrl?: string | null;
  portraitArtClassName?: string | null;
  inlineHouseMode: boolean;
  inlineHouseLeaveAction?:
    | {
        id: string;
        label: string;
        buttonSound?: "light" | "heavy";
      }
    | null;
}): string {
  if (
    input.session == null ||
    input.session.mode !== "ai-dialogue" ||
    input.targetName == null
  ) {
    return "";
  }

  const dialogueSession = input.session.dialogue;
  const currentPageIndex =
    dialogueSession.displayPages.length === 0
      ? 0
      : Math.min(
          dialogueSession.currentDisplayPageIndex,
          dialogueSession.displayPages.length - 1
        );
  const currentPage = dialogueSession.displayPages[currentPageIndex] ?? null;
  const resolvedCurrentSpeakerName =
    currentPage != null &&
    currentPage.type === "dialogue" &&
    currentPage.speakerName != null
      ? looksLikeInternalSpeakerToken(currentPage.speakerName)
        ? input.targetName
        : currentPage.speakerName
      : null;
  const targetName = escapeHtml(input.targetName);
  const portraitImageUrl =
    input.portraitImageUrl == null ? null : escapeHtml(input.portraitImageUrl);
  const portraitArtClassName =
    input.portraitArtClassName == null
      ? ""
      : ` ${escapeHtml(input.portraitArtClassName)}`;
  const typewriterLines =
    currentPage == null
      ? null
      : renderDialogueTypewriterLines([currentPage.text]);
  const speakerMarkup =
    resolvedCurrentSpeakerName != null
      ? `<p class="c-grain-shop-dialogue__speaker">${escapeHtml(
          resolvedCurrentSpeakerName
        )}</p>`
      : "";
  const textMarkup = typewriterLines == null ? "" : typewriterLines.markup;
  const statusNotice =
    dialogueSession.statusNotice == null
      ? ""
      : `
        <p class="c-npc-interaction-notice" data-npc-dialogue-notice="status">
          ${escapeHtml(dialogueSession.statusNotice)}
        </p>
      `;
  const errorNotice =
    dialogueSession.errorNotice == null
      ? ""
      : `
        <p class="c-npc-interaction-notice c-npc-interaction-notice--error" data-npc-dialogue-notice="error">
          ${escapeHtml(dialogueSession.errorNotice)}
        </p>
      `;
  const isStreaming = dialogueSession.status === "streaming";
  const canAdvancePage =
    dialogueSession.status === "awaiting-advance" ||
    dialogueSession.status === "awaiting-action-jump";
  const hasChoiceButtons =
    dialogueSession.status === "awaiting-choice" &&
    dialogueSession.customInputOpen !== true &&
    dialogueSession.options.length === 3;
  const isCustomInputOpen =
    dialogueSession.status === "awaiting-choice" &&
    dialogueSession.customInputOpen === true;
  const footerHintMarkup =
    canAdvancePage && typewriterLines != null
      ? renderDialogueTypewriterHint("点击继续", typewriterLines.totalDurationMs)
      : "";
  const optionButtons = dialogueSession.options
    .map((option, index) => {
      const recommendedClass =
        option.recommended === true
          ? " c-npc-interaction-option--recommended"
          : "";
      const resolvedStance = resolveOptionStance({
        index,
        ...(option.stance == null ? {} : { stance: option.stance }),
        ...(option.kind == null ? {} : { kind: option.kind }),
      });
      const stanceClassName = ` c-npc-interaction-reply--${resolvedStance}`;
      return `
        <button
          type="button"
          class="c-button c-grain-shop-button c-grain-shop-button--paper c-npc-interaction-reply${stanceClassName}${recommendedClass}"
          data-npc-action="select-option"
          data-npc-option-id="${escapeHtml(option.id)}"
          data-npc-option-stance="${escapeHtml(resolvedStance)}"
          data-ui-click-sound="none"
        >
          <span class="c-npc-interaction-reply__text">${escapeHtml(option.actionText)}</span>
        </button>
      `;
    })
    .join("");
  const containerClassName = input.inlineHouseMode
    ? "c-house-npc-dialogue-panel c-npc-interaction-inline"
    : "c-npc-interaction-inline";
  const containerDataAttributes = input.inlineHouseMode
    ? 'data-house-npc-dialogue="inline" data-npc-dialogue="ai-dialogue"'
    : 'data-npc-dialogue="ai-dialogue"';
  const inlineHouseLeaveButton =
    input.inlineHouseMode && input.inlineHouseLeaveAction != null
      ? `
          <button
            type="button"
            class="c-button c-grain-shop-button c-npc-interaction-leave-house"
            data-action="${escapeHtml(input.inlineHouseLeaveAction.id)}"
            ${
              input.inlineHouseLeaveAction.buttonSound == null
                ? ""
                : `data-button-sound="${escapeHtml(input.inlineHouseLeaveAction.buttonSound)}"`
            }
          >
            ${escapeHtml(input.inlineHouseLeaveAction.label)}
          </button>
        `
      : "";

  return `
    <div
      class="${containerClassName}"
      ${containerDataAttributes}
      data-npc-dialogue-streaming="${isStreaming ? "true" : "false"}"
      aria-label="${targetName} 谈话"
    >
      <footer class="c-grain-shop-dialogue c-npc-interaction-dialogue" aria-label="${targetName} 谈话">
        <div
          class="c-grain-shop-dialogue__text c-grain-shop-skin-card ${canAdvancePage ? "c-grain-shop-dialogue__text--clickable c-grain-shop-dialogue__text--with-hint" : ""}"
          ${
            canAdvancePage
              ? 'data-npc-action="advance-page" role="button" tabindex="0" data-ui-click-sound="none"'
              : ""
          }
        >
          ${speakerMarkup}
          ${textMarkup}
          ${statusNotice}
          ${errorNotice}
          ${footerHintMarkup}
        </div>
        <div class="c-grain-shop-dialogue__npc c-npc-interaction-dialogue-npc">
          <div class="c-grain-shop-portrait" aria-hidden="true">
            ${
              portraitImageUrl == null
                ? `<span class="c-grain-shop-portrait__art${portraitArtClassName}"></span>`
                : `<img class="c-grain-shop-portrait__image" src="${portraitImageUrl}" alt="">`
            }
          </div>
          <p class="c-grain-shop-portrait__name c-grain-shop-nameplate c-grain-shop-nameplate--small">
            ${targetName}
          </p>
        </div>
      </footer>
      ${
        hasChoiceButtons
          ? `
            <nav class="c-grain-shop-actions c-npc-interaction-inline-actions" aria-label="${targetName} 谈话选项">
              ${optionButtons}
              <button
                type="button"
                class="c-button c-grain-shop-button c-grain-shop-button--paper c-npc-interaction-reply c-npc-interaction-reply--custom"
                data-npc-action="open-custom-input"
                data-ui-click-sound="none"
              >
                <span class="c-npc-interaction-reply__stance">自定义</span>
                <span class="c-npc-interaction-reply__text">输入你想说的话</span>
              </button>
            </nav>
          `
          : ""
      }
      ${
        isCustomInputOpen
          ? `
            <div class="c-npc-interaction-inline-composer">
          <input
            type="text"
            class="c-grain-shop-text-field"
            data-npc-input="custom"
            value="${escapeHtml(dialogueSession.customInputValue)}"
            placeholder="输入你想说的话"
          >
              <div class="c-npc-interaction-inline-composer__actions">
                <button
                  type="button"
                  class="c-button c-grain-shop-button c-grain-shop-button--gold"
                  data-npc-action="submit-custom"
                  data-ui-click-sound="none"
                >
                  发送
                </button>
                <button
                  type="button"
                  class="c-button c-grain-shop-button c-grain-shop-button--paper"
                  data-npc-action="cancel-custom-input"
                  data-ui-click-sound="none"
                >
                  返回选项
                </button>
              </div>
            </div>
          `
          : ""
      }
      <div class="c-npc-interaction-inline-footer-actions">
        ${inlineHouseLeaveButton}
        <button
          type="button"
          class="c-button c-grain-shop-button c-grain-shop-button--paper c-npc-interaction-exit"
          data-npc-action="close"
          data-ui-click-sound="none"
        >
          退出
        </button>
      </div>
    </div>
  `;
}
