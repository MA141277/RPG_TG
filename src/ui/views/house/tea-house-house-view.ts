import type { HouseModuleViewModel, HouseOverlayViewModel } from "../../../domain/house-module";
import {
  renderHouseActionContainer,
  renderHouseAlertOverlay,
  renderHouseDialogue,
  renderHouseLeaveButton,
  renderHouseStandbyRoster,
  renderHouseStatusCard,
} from "./house-shared-view";

function renderDebateOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "debate" }>
): string {
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="debate">
      <div
        class="c-grain-shop-modal c-grain-shop-modal--game c-grain-shop-skin-panel c-tea-house-modal"
        role="dialog"
        aria-modal="true"
      >
        <header class="c-grain-shop-game__header">
          <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
          <div class="c-grain-shop-game__hud">
            <span>对手 <strong>${overlay.actorName}</strong></span>
            <span>回合 <strong>${overlay.round}</strong></span>
            <span>倒计时 <strong>${overlay.secondsLeft}</strong> 秒</span>
          </div>
          <div class="c-grain-shop-game__hud">
            <span>你的气势 <strong>${overlay.playerSpirit}</strong></span>
            <span>对方气势 <strong>${overlay.npcSpirit}</strong></span>
            <span>超时 <strong>${overlay.timeoutCount}</strong> 次</span>
          </div>
        </header>
        ${
          overlay.lastRoundSummary.length === 0
            ? ""
            : `
              <div class="c-grain-shop-ledger c-grain-shop-skin-card c-tea-house-debate__summary">
                ${overlay.lastRoundSummary.map((line) => `<p>${line}</p>`).join("")}
              </div>
            `
        }
        <div class="c-grain-shop-game__actions c-tea-house-topic-grid">
          ${overlay.topicActionIds
            .map(
              (topicAction) => `
                <button
                  type="button"
                  class="c-button c-grain-shop-button c-grain-shop-button--gold c-tea-house-topic-grid__button"
                  data-house-action="${topicAction.actionId}"
                >
                  ${topicAction.topic}
                </button>
              `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

function renderOverlay(overlay: HouseOverlayViewModel | null): string {
  if (overlay == null) {
    return "";
  }

  if (overlay.type === "alert") {
    return renderHouseAlertOverlay(overlay);
  }

  if (overlay.type === "debate") {
    return renderDebateOverlay(overlay);
  }

  return "";
}

export function renderTeaHouseHouseView(viewModel: HouseModuleViewModel): string {
  const showLeaveButton = viewModel.overlay?.type !== "debate";

  return `
    <section class="view-house-grain-shop view-house-tea-house" data-house-module="${viewModel.moduleId}">
      ${renderHouseActionContainer(viewModel)}
      ${renderHouseStandbyRoster(viewModel, {
        asideClassName: "c-grain-shop-npc-idle c-tea-house-npc-idle",
        asideLabel: "茶馆人物",
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
