import type { HouseModuleViewModel, HouseOverlayViewModel } from "../../../domain/house-module";
import {
  renderHouseActionContainer,
  renderHouseAlertOverlay,
  renderHouseDialogue,
  renderHouseLeaveButton,
  renderHouseStandbyRoster,
  renderHouseStatusCard,
} from "./house-shared-view";

function renderConfirmOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "confirm" }>
): string {
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="confirm">
      <div class="c-grain-shop-modal c-grain-shop-skin-panel" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
        <div class="c-grain-shop-modal__body">
          ${overlay.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
        </div>
        <div class="c-grain-shop-modal__actions c-grain-shop-modal__actions--split">
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-house-action="${overlay.cancelActionId}">
            ${overlay.cancelLabel}
          </button>
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-house-action="${overlay.confirmActionId}">
            ${overlay.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderGambleOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "gamble" }>
): string {
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="gamble">
      <div class="c-grain-shop-modal c-grain-shop-modal--trade c-grain-shop-skin-panel" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
        <p class="c-grain-shop-trade__price">选择本次赌本</p>
        <div class="c-grain-shop-trade__quantity">
          <button type="button" class="c-grain-shop-qty-btn" data-house-action="${overlay.decrementActionId}" aria-label="减少赌本">-</button>
          <div class="c-grain-shop-trade__input">${overlay.wager}</div>
          <button type="button" class="c-grain-shop-qty-btn" data-house-action="${overlay.incrementActionId}" aria-label="增加赌本">+</button>
        </div>
        <p class="c-grain-shop-trade__total">候选档位：${overlay.options.join(" / ")} 文</p>
        <div class="c-grain-shop-modal__actions c-grain-shop-modal__actions--split">
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-house-action="${overlay.cancelActionId}">
            ${overlay.cancelLabel}
          </button>
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-house-action="${overlay.confirmActionId}">
            ${overlay.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderOverlay(overlay: HouseOverlayViewModel | null): string {
  if (overlay == null) {
    return "";
  }

  switch (overlay.type) {
    case "alert":
      return renderHouseAlertOverlay(overlay);
    case "confirm":
      return renderConfirmOverlay(overlay);
    case "gamble":
      return renderGambleOverlay(overlay);
    default:
      return "";
  }
}

export function renderTavernHouseView(viewModel: HouseModuleViewModel): string {
  const showLeaveButton =
    viewModel.overlay?.type !== "confirm" && viewModel.overlay?.type !== "gamble";

  return `
    <section class="view-house-grain-shop view-house-tea-house" data-house-module="${viewModel.moduleId}">
      ${renderHouseActionContainer(viewModel)}
      ${renderHouseStandbyRoster(viewModel, {
        asideClassName: "c-grain-shop-npc-idle c-tea-house-npc-idle",
        asideLabel: "酒馆老板",
        includeSelectedState: true,
        renderSecondaryText: (actor) =>
          actor.title == null ? "" : `<span class="c-tea-house-npc-idle__title">${actor.title}</span>`,
      })}
      ${renderHouseDialogue(viewModel, {
        footerClassName: "c-grain-shop-dialogue c-tea-house-dialogue",
      })}
      ${showLeaveButton ? renderHouseLeaveButton(viewModel) : ""}
      ${renderHouseStatusCard(viewModel)}
      ${renderOverlay(viewModel.overlay)}
    </section>
  `;
}
