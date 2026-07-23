import type { TroopEditorStageViewModel } from "../../../application/troop-editor/troop-editor-stage-view-model";
import { renderTroopPreviewGrid } from "./troop-preview-grid";

function renderMenuButton(
  model: TroopEditorStageViewModel,
  button: TroopEditorStageViewModel["menu"][number]
): string {
  if (
    button.id === "disband" ||
    button.id === "create" ||
    button.id === "sort" ||
    button.id === "dismiss" ||
    button.id === "recruit"
  ) {
    return `
      <button
        type="button"
        class="c-button c-troop-editor__menu-button${button.id === model.selectedMenuId ? " is-selected" : ""}"
        data-troop-editor-action="${button.id}"
        aria-pressed="false"
      >
        ${button.label}
      </button>
    `;
  }

  const selectedTroopId = model.selectedTroopId ?? "";
  const troopIdAttribute =
    button.actionId === "open-troop-management" && selectedTroopId.length > 0
      ? `data-troop-id="${selectedTroopId}"`
      : "";

  return `
    <button
      type="button"
      class="c-button c-troop-editor__menu-button${button.id === model.selectedMenuId ? " is-selected" : ""}"
      ${button.actionId == null ? "disabled" : ""}
      ${button.actionId == null ? "" : `data-action="${button.actionId}"`}
      ${troopIdAttribute}
      ${button.id === model.selectedMenuId ? 'aria-selected="true"' : ""}
    >
      ${button.label}
    </button>
  `;
}

function renderShopScreen(model: TroopEditorStageViewModel): string {
  return `
    <section class="c-troop-editor__shop-screen c-troop-editor__recruit-popup c-troop-assessment-popup c-troop-assessment-popup--list" data-troop-editor-shop hidden>
      <header class="c-troop-editor__shop-screen-head">
        <h2 class="c-troop-editor__title">招兵买马</h2>
      </header>

      <div class="c-troop-editor__shop-scroll">
        ${
          model.shopOffers.length === 0
            ? `
              <div class="c-troop-management__reserve-empty">
                当前商店暂无可招募士兵
              </div>
            `
            : model.shopOffers
                .map(
                  (offer) => `
                    <button
                      type="button"
                      class="c-button c-troop-editor__shop-offer"
                      data-troop-editor-shop-offer="${offer.id}"
                      data-offer-id="${offer.id}"
                      data-price="${offer.price}"
                      data-required-fame="${offer.requiredFame}"
                    >
                      <div class="c-troop-editor__shop-offer-main">
                        <strong class="c-troop-editor__shop-offer-name">${offer.name}</strong>
                        <span class="c-troop-editor__shop-offer-role">${offer.roleLabel}</span>
                      </div>
                      <div class="c-troop-editor__shop-offer-costs">
                        <span class="c-troop-editor__shop-offer-cost">金钱 ${offer.priceText}</span>
                        <span class="c-troop-editor__shop-offer-cost">最低声望 ${offer.requiredFameText}</span>
                      </div>
                    </button>
                  `
                )
                .join("")
        }
      </div>

      <div class="c-troop-management__reserve-prompt" data-troop-editor-shop-prompt hidden>
        <button
          type="button"
          class="c-button c-troop-editor__menu-button c-troop-management__reserve-prompt-button"
          data-troop-editor-shop-prompt-action="buy"
        >
          购买
        </button>
        <button
          type="button"
          class="c-button c-troop-editor__menu-button c-troop-management__reserve-prompt-button"
          data-troop-editor-shop-prompt-action="cancel"
        >
          取消
        </button>
      </div>

      <button
        type="button"
        class="c-button c-troop-editor__menu-button c-troop-management__reserve-return"
        data-troop-editor-shop-back
      >
        返回
      </button>
    </section>
  `;
}

function renderCreateCaptainList(model: TroopEditorStageViewModel): string {
  if (model.createCaptainOptions.length === 0) {
    return `
      <div class="c-troop-editor__create-captain-empty" data-troop-editor-create-captain-list>
        当前预备队中暂无可选队长单位
      </div>
    `;
  }

  return `
    <div class="c-troop-editor__create-captain-list" data-troop-editor-create-captain-list>
      ${model.createCaptainOptions
        .map(
          (member) => `
            <button
              type="button"
              class="c-button c-troop-editor__create-captain-option"
              data-troop-editor-create-member="${member.id}"
            >
              <strong class="c-troop-editor__create-captain-name">${member.name}</strong>
              <span class="c-troop-editor__create-captain-role">${member.roleLabel}</span>
              <span class="c-troop-editor__create-captain-flag">队长</span>
            </button>
          `
        )
        .join("")}
    </div>
  `;
}

export function renderTroopEditorView(model: TroopEditorStageViewModel): string {
  return `
    <section
      class="view-troop-editor"
      aria-label="${model.title}"
      data-troop-editor-root
      data-reserve-count="${model.reserveCount}"
      data-reserve-capacity="${model.reserveCapacity}"
      data-player-gold="${model.playerGold}"
      data-player-fame="${model.playerFame}"
    >
      <header class="c-troop-editor__resource-bar">
        ${model.resources
          .map(
            (resource) => `
              <article class="c-troop-editor__resource-slot">
                <span class="c-troop-editor__resource-label">${resource.label}</span>
                <strong class="c-troop-editor__resource-value">${resource.valueText}</strong>
              </article>
            `
          )
          .join("")}
      </header>

      <div class="c-troop-editor__body" data-troop-editor-body>
        <section class="c-troop-editor__troops-panel">
          <div class="c-troop-editor__panel-heading">
            <p class="c-troop-editor__eyebrow">部队</p>
            <h1 class="c-troop-editor__title">${model.title}</h1>
          </div>

          <div class="c-troop-editor__troops-panel-body">
            <div class="c-troop-editor__troop-scroll" data-troop-editor-list>
              ${model.troops
                .map(
                  (troop) => `
                    <article
                      class="c-troop-editor__troop-card${troop.id === model.selectedTroopId ? " is-selected" : ""}"
                      data-troop-editor-card
                      data-troop-id="${troop.id}"
                      role="button"
                      tabindex="0"
                    >
                      <header class="c-troop-editor__troop-head">
                        <h2 class="c-troop-editor__troop-name">${troop.name}</h2>
                      </header>
                      ${renderTroopPreviewGrid(troop.slots)}
                    </article>
                  `
                )
                .join("")}
            </div>
          </div>
        </section>

        <aside class="c-troop-editor__menu">
          <div class="c-troop-editor__panel-heading">
            <p class="c-troop-editor__eyebrow">管理</p>
            <h2 class="c-troop-editor__title">队伍管理</h2>
          </div>
          <div class="c-troop-editor__menu-list">
            ${model.menu.map((button) => renderMenuButton(model, button)).join("")}
          </div>
        </aside>
      </div>

      ${renderShopScreen(model)}

      <div class="c-troop-editor__toast" data-troop-editor-sort-toast hidden>
        点击选择两支队伍以交换队伍排序
      </div>

      <div class="c-troop-management__confirm-overlay" data-troop-editor-create hidden>
        <div
          class="c-troop-management__confirm-dialog c-troop-editor__create-dialog c-troop-assessment-popup"
          role="dialog"
          aria-modal="true"
          aria-labelledby="troop-editor-create-title"
        >
          <h2 class="c-troop-management__confirm-title" id="troop-editor-create-title">
            组建队伍
          </h2>
          <label class="c-troop-editor__create-label" for="troop-editor-create-input">
            请输入队伍名称
          </label>
          <input
            id="troop-editor-create-input"
            class="c-troop-editor__create-input"
            type="text"
            maxlength="10"
            placeholder="最大 10 字"
            data-troop-editor-create-input
          />
          <div class="c-troop-editor__create-captain-block">
            <p class="c-troop-editor__create-label">请从预备队中选择队长</p>
            ${renderCreateCaptainList(model)}
          </div>
          <div class="c-troop-management__confirm-actions">
            <button
              type="button"
              class="c-button c-troop-editor__menu-button c-troop-management__confirm-button"
              data-troop-editor-create-choice="confirm"
            >
              确定创建
            </button>
            <button
              type="button"
              class="c-button c-troop-editor__menu-button c-troop-management__confirm-button"
              data-troop-editor-create-choice="cancel"
            >
              返回
            </button>
          </div>
          <p class="c-troop-editor__create-error" data-troop-editor-create-error hidden></p>
        </div>
      </div>

      <div class="c-troop-management__confirm-overlay" data-troop-editor-dismiss-overlay hidden>
        <div class="c-troop-editor__reserve-overlay-shell">
          <section
            class="c-troop-management__reserve-panel c-troop-editor__reserve-panel c-troop-assessment-popup c-troop-assessment-popup--list"
            data-troop-editor-dismiss-panel
          >
            <header class="c-troop-management__reserve-head">
              <h2 class="c-troop-management__reserve-title">解雇单位</h2>
              <div class="c-troop-management__reserve-count">
                ${model.reserveMembers.length} / ${model.reserveCapacity}
              </div>
            </header>

            <div class="c-troop-management__reserve-scroll">
              ${
                model.reserveMembers.length === 0
                  ? `
                    <div class="c-troop-management__reserve-empty">
                      当前预备队中暂无可解雇士兵
                    </div>
                  `
                  : model.reserveMembers
                      .map(
                        (member) => `
                          <button
                            type="button"
                            class="c-button c-troop-management__reserve-member"
                            data-troop-editor-dismiss-member="${member.id}"
                          >
                            <strong class="c-troop-management__reserve-member-name">${member.name}</strong>
                            <span class="c-troop-management__reserve-member-role">${member.roleLabel}</span>
                          </button>
                        `
                      )
                      .join("")
              }
            </div>

            <div class="c-troop-management__reserve-prompt" data-troop-editor-dismiss-prompt hidden>
              <button
                type="button"
                class="c-button c-troop-editor__menu-button c-troop-management__reserve-prompt-button c-troop-management__confirm-button--danger"
                data-troop-editor-dismiss-prompt-action="dismiss"
              >
                解雇
              </button>
              <button
                type="button"
                class="c-button c-troop-editor__menu-button c-troop-management__reserve-prompt-button"
                data-troop-editor-dismiss-prompt-action="back"
              >
                返回
              </button>
            </div>

            <button
              type="button"
              class="c-button c-troop-editor__menu-button c-troop-management__reserve-return"
              data-troop-editor-dismiss-close
            >
              返回
            </button>
          </section>
        </div>
      </div>

      <div class="c-troop-management__confirm-overlay" data-troop-editor-dismiss-confirm hidden>
        <div
          class="c-troop-management__confirm-dialog c-troop-assessment-popup"
          role="dialog"
          aria-modal="true"
          aria-labelledby="troop-editor-dismiss-confirm-title"
        >
          <h2 class="c-troop-management__confirm-title" id="troop-editor-dismiss-confirm-title">
            解雇单位
          </h2>
          <p class="c-troop-management__confirm-text">
            确定要解雇这个单位吗？单位将永远地离开！
          </p>
          <div class="c-troop-management__confirm-actions">
            <button
              type="button"
              class="c-button c-troop-editor__menu-button c-troop-management__confirm-button"
              data-troop-editor-dismiss-confirm-choice="cancel"
            >
              取消
            </button>
            <button
              type="button"
              class="c-button c-troop-editor__menu-button c-troop-management__confirm-button c-troop-management__confirm-button--danger"
              data-troop-editor-dismiss-confirm-choice="confirm"
            >
              解雇
            </button>
          </div>
        </div>
      </div>

      <div class="c-troop-management__confirm-overlay" data-troop-editor-confirm hidden>
        <div
          class="c-troop-management__confirm-dialog c-troop-assessment-popup"
          role="dialog"
          aria-modal="true"
          aria-labelledby="troop-editor-confirm-title"
        >
          <h2 class="c-troop-management__confirm-title" id="troop-editor-confirm-title">
            解散队伍
          </h2>
          <p class="c-troop-management__confirm-text" data-troop-editor-confirm-text>
            确定要解散队伍吗？被解散的单位将返回预备队。
          </p>
          <div class="c-troop-management__confirm-actions">
            <button
              type="button"
              class="c-button c-troop-editor__menu-button c-troop-management__confirm-button"
              data-troop-editor-confirm-choice="confirm"
            >
              是
            </button>
            <button
              type="button"
              class="c-button c-troop-editor__menu-button c-troop-management__confirm-button"
              data-troop-editor-confirm-choice="cancel"
            >
              否
            </button>
          </div>
        </div>
      </div>

      <div class="c-troop-management__confirm-overlay" data-troop-editor-alert hidden>
        <div
          class="c-troop-management__confirm-dialog c-troop-assessment-popup"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="troop-editor-alert-title"
        >
          <h2 class="c-troop-management__confirm-title" id="troop-editor-alert-title">
            提示
          </h2>
          <p class="c-troop-management__confirm-text" data-troop-editor-alert-text></p>
          <div class="c-troop-management__confirm-actions">
            <button
              type="button"
              class="c-button c-troop-editor__menu-button c-troop-management__confirm-button"
              data-troop-editor-alert-close
            >
              知道了
            </button>
          </div>
        </div>
      </div>
    </section>
  `;
}
