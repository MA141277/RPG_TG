import type { HouseModuleViewModel, HouseOverlayViewModel } from "../../../domain/house-module";
import {
  renderHouseActionContainer,
  renderHouseAlertOverlay,
  renderHouseDialogue,
  renderHouseLeaveButton,
  renderHouseStandbyRoster,
  renderHouseStatusCard,
} from "./house-shared-view";

function getDebateTopicCardClass(topic: string): string {
  switch (topic) {
    case "义":
      return "c-tea-house-topic-card--yi";
    case "利":
      return "c-tea-house-topic-card--li";
    case "名":
      return "c-tea-house-topic-card--ming";
    case "情":
      return "c-tea-house-topic-card--qing";
    case "势":
      return "c-tea-house-topic-card--shi";
    default:
      return "c-tea-house-topic-card--back";
  }
}

function renderDebateOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "debate" }>
): string {
  const summaryLines =
    overlay.lastRoundSummary.length > 0
      ? overlay.lastRoundSummary
      : [
          `第 ${overlay.round} 回合，对手 ${overlay.actorName} 已亮出论点。`,
          `请从“义 / 利 / 名 / 情 / 势”中选出你的出牌。`,
        ];
  const selectedTopicClass =
    overlay.selectedTopic == null
      ? "c-tea-house-topic-card--back"
      : getDebateTopicCardClass(overlay.selectedTopic);

  return `
    <div class="c-grain-shop-overlay c-tea-house-debate-overlay" data-house-overlay="debate">
      <div class="c-tea-house-debate" role="dialog" aria-modal="true" aria-label="${overlay.title}">
        <div class="c-tea-house-debate__main">
          <aside class="c-tea-house-debate__portrait c-tea-house-debate__portrait--player" aria-label="玩家">
            <div class="c-tea-house-debate__side-label c-tea-house-debate__side-label--player" aria-hidden="true"></div>
            <div class="c-tea-house-debate__portrait-frame c-tea-house-debate__portrait-frame--player" aria-hidden="true"></div>
          </aside>

          <section class="c-tea-house-debate__board" aria-label="舌战棋盘">
            <div class="c-tea-house-debate__board-frame" aria-hidden="true"></div>
            <div class="c-tea-house-debate__title-medallion" aria-hidden="true"></div>
            <div class="c-tea-house-debate__spirit c-tea-house-debate__spirit--player">
              <span class="c-tea-house-debate__spirit-label">气势</span>
              <strong class="c-tea-house-debate__spirit-value">${overlay.playerSpirit}</strong>
            </div>
            <div class="c-tea-house-debate__spirit c-tea-house-debate__spirit--npc">
              <span class="c-tea-house-debate__spirit-label">气势</span>
              <strong class="c-tea-house-debate__spirit-value">${overlay.npcSpirit}</strong>
            </div>
            <div class="c-tea-house-debate__meta">
              <span>第 <strong>${overlay.round}</strong> 回合</span>
              <span>对手 <strong>${overlay.actorName}</strong></span>
              <span>超时 <strong>${overlay.timeoutCount}</strong> 次</span>
            </div>
            <div class="c-tea-house-debate__facedown c-tea-house-debate__facedown--left" aria-hidden="true"></div>
            <div class="c-tea-house-debate__facedown c-tea-house-debate__facedown--right" aria-hidden="true"></div>
            <div class="c-tea-house-debate__summary" aria-live="polite">
              ${summaryLines.map((line) => `<p>${line}</p>`).join("")}
            </div>
            <div class="c-tea-house-debate__selected-slot" aria-label="已选出牌">
              ${
                overlay.selectedTopic == null
                  ? `<div class="c-tea-house-debate__selected-placeholder">请先选牌</div>`
                  : `
                    <div class="c-tea-house-debate__selected-card c-tea-house-topic-card ${selectedTopicClass}">
                      <span class="c-tea-house-topic-card__face" aria-hidden="true"></span>
                    </div>
                  `
              }
            </div>
          </section>

          <aside class="c-tea-house-debate__portrait c-tea-house-debate__portrait--npc" aria-label="对手">
            <div class="c-tea-house-debate__side-label c-tea-house-debate__side-label--npc" aria-hidden="true"></div>
            <div class="c-tea-house-debate__portrait-frame c-tea-house-debate__portrait-frame--npc" aria-hidden="true"></div>
          </aside>
        </div>

        <div class="c-tea-house-debate__timer" aria-label="倒计时 ${overlay.secondsLeft} 秒">
          <div class="c-tea-house-debate__timer-face" aria-hidden="true"></div>
          <strong class="c-tea-house-debate__timer-value">${overlay.secondsLeft}</strong>
        </div>

        <div class="c-tea-house-debate__topic-row" aria-label="主题牌">
          ${overlay.topicActionIds
            .map(
              (topicAction) => `
                <button
                  type="button"
                  class="c-button c-tea-house-topic-card ${getDebateTopicCardClass(topicAction.topic)}${overlay.selectedTopic === topicAction.topic ? " is-selected" : ""}"
                  data-house-action="${topicAction.actionId}"
                  aria-label="出牌 ${topicAction.topic}"
                >
                  <span class="c-tea-house-topic-card__face" aria-hidden="true"></span>
                </button>
              `
            )
            .join("")}
        </div>

        <button
          type="button"
          class="c-button c-tea-house-debate__confirm"
          data-house-action="${overlay.confirmActionId}"
          ${overlay.confirmDisabled ? "disabled" : ""}
          aria-label="确认出牌"
        >
          <span class="c-tea-house-debate__confirm-art" aria-hidden="true"></span>
        </button>
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
  const isIdle = viewModel.dialogue == null;

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
      ${isIdle ? renderHouseLeaveButton(viewModel) : ""}
      ${renderHouseStatusCard(viewModel)}
      ${renderOverlay(viewModel.overlay)}
    </section>
  `;
}
