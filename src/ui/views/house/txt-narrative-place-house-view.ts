import type { HouseModuleViewModel } from "../../../domain/house-module";
import {
  renderHouseLeaveButton,
  renderHouseStandbyRoster,
} from "./house-shared-view";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderTranscript(viewModel: HouseModuleViewModel): string {
  const overlay = viewModel.overlay;
  if (overlay == null || overlay.type !== "txt-narrative") {
    return "";
  }

  return overlay.transcript
    .map((entry) => {
      if (entry.type === "narration") {
        return `
          <article class="c-txt-narrative__entry c-txt-narrative__entry--narration">
            <p>${escapeHtml(entry.text)}</p>
          </article>
        `;
      }

      const portraitMarkup =
        entry.portraitImageUrl == null
          ? `
            <span class="c-grain-shop-portrait__art ${entry.portraitArtClassName ?? ""}"></span>
          `
          : `
            <img class="c-grain-shop-portrait__image" src="${escapeHtml(entry.portraitImageUrl)}" alt="">
          `;

      return `
        <article class="c-txt-narrative__entry c-txt-narrative__entry--dialogue">
          <div class="c-grain-shop-portrait c-txt-narrative__portrait" aria-hidden="true">
            ${portraitMarkup}
          </div>
          <div class="c-txt-narrative__speech">
            ${
              entry.speakerName == null
                ? ""
                : `<p class="c-txt-narrative__speaker">${escapeHtml(entry.speakerName)}</p>`
            }
            <p>${escapeHtml(entry.text)}</p>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderOptions(viewModel: HouseModuleViewModel): string {
  const overlay = viewModel.overlay;
  if (overlay == null || overlay.type !== "txt-narrative") {
    return "";
  }

  return overlay.options
    .map((option) => {
      const recommendedClassName = option.recommended
        ? " c-txt-narrative__option--recommended"
        : "";
      return `
        <button
          type="button"
          class="c-button c-grain-shop-button c-grain-shop-button--paper c-txt-narrative__option${recommendedClassName}"
          data-house-action="${escapeHtml(option.actionId)}"
          ${option.disabled ? "disabled" : ""}
        >
          ${escapeHtml(option.label)}
        </button>
      `;
    })
    .join("");
}

export function renderTxtNarrativePlaceHouseView(
  viewModel: HouseModuleViewModel
): string {
  const overlay = viewModel.overlay;
  if (overlay == null || overlay.type !== "txt-narrative") {
    throw new Error("TXT narrative house view requires a txt-narrative overlay.");
  }

  return `
    <section class="view-house-grain-shop view-house-temple view-house-txt-narrative" data-house-module="${escapeHtml(viewModel.moduleId)}">
      <div class="c-txt-narrative__hero c-grain-shop-skin-panel">
        <p class="c-txt-narrative__eyebrow c-grain-shop-nameplate c-grain-shop-nameplate--small">${escapeHtml(overlay.title)}</p>
        <h2 class="c-txt-narrative__title">${escapeHtml(viewModel.sceneTitle)}</h2>
        ${
          viewModel.sceneSubtitle == null
            ? ""
            : `<p class="c-txt-narrative__subtitle">${escapeHtml(viewModel.sceneSubtitle)}</p>`
        }
        <div class="c-txt-narrative__meta">
          <span>${escapeHtml(overlay.placeName)}</span>
          <span>${escapeHtml(overlay.phaseLabel)}</span>
        </div>
      </div>
      <div
        class="c-txt-narrative__stage"
        data-txt-narrative-streaming="${overlay.isStreaming ? "true" : "false"}"
        data-txt-narrative-paused="${overlay.paused ? "true" : "false"}"
      >
        ${renderHouseStandbyRoster(viewModel, {
          asideClassName: "c-grain-shop-npc-idle c-tea-house-npc-idle c-txt-narrative__roster",
          asideLabel: "当前人物",
          includeSelectedState: false,
          renderSecondaryText: (actor) =>
            actor.title == null
              ? ""
              : `<span class="c-tea-house-npc-idle__title">${escapeHtml(actor.title)}</span>`,
        })}
        <div class="c-txt-narrative__panel c-grain-shop-skin-panel">
          ${
            overlay.statusNotice == null
              ? ""
              : `<p class="c-txt-narrative__status">${escapeHtml(overlay.statusNotice)}</p>`
          }
          ${
            overlay.errorNotice == null
              ? ""
              : `<p class="c-txt-narrative__error">${escapeHtml(overlay.errorNotice)}</p>`
          }
          <div class="c-txt-narrative__transcript">
            ${renderTranscript(viewModel)}
          </div>
          <div class="c-txt-narrative__options">
            ${renderOptions(viewModel)}
          </div>
          <div class="c-txt-narrative__composer">
            <input
              type="text"
              class="c-txt-narrative__input"
              value="${escapeHtml(overlay.customInput.value ?? "")}"
              placeholder="${escapeHtml(overlay.customInput.placeholder)}"
              data-house-field="${escapeHtml(overlay.customInput.fieldId)}"
            />
            <button
              type="button"
              class="c-button c-grain-shop-button c-grain-shop-button--gold c-txt-narrative__submit"
              data-house-action="${escapeHtml(overlay.customInput.submitActionId)}"
            >
              提交回应
            </button>
          </div>
          <div class="c-txt-narrative__controls">
            <button
              type="button"
              class="c-button c-grain-shop-button c-grain-shop-button--paper"
              data-house-action="${escapeHtml(overlay.controlActions.exitActionId)}"
            >
              暂停主动推演
            </button>
            <button
              type="button"
              class="c-button c-grain-shop-button c-grain-shop-button--gold"
              data-house-action="${escapeHtml(overlay.controlActions.reactivateActionId)}"
            >
              继续主动推演
            </button>
          </div>
          ${renderHouseLeaveButton(viewModel, {
            className: "c-grain-shop-leave c-txt-narrative__leave",
          })}
        </div>
      </div>
    </section>
  `;
}
