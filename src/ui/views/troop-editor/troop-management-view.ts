import type { TroopManagementStageViewModel } from "../../../application/troop-editor/troop-management-stage-view-model";
import { renderTroopPreviewGrid } from "./troop-preview-grid";

function encodePreviewConfig(model: TroopManagementStageViewModel): string {
  return encodeURIComponent(JSON.stringify(model.battlePreview));
}

export function renderTroopManagementView(model: TroopManagementStageViewModel): string {
  const previewConfig = encodePreviewConfig(model);

  return `
    <section
      class="view-troop-management"
      aria-label="${model.title}"
      data-troop-management-root
      data-troop-id="${model.selectedTroopId}"
      data-reserve-count="${model.reserveMembers.length}"
      data-reserve-capacity="${model.reserveCapacity}"
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

      <div class="c-troop-management__body">
        <aside class="c-troop-management__troops-panel">
          <div class="c-troop-editor__panel-heading">
            <p class="c-troop-editor__eyebrow">部队</p>
            <h1 class="c-troop-editor__title">${model.title}</h1>
          </div>
          <div class="c-troop-management__troop-scroll">
            ${model.troops
              .map(
                (troop) => `
                  <article
                    class="c-troop-editor__troop-card${troop.id === model.selectedTroopId ? " is-selected" : ""}"
                    data-action="open-troop-management"
                    data-troop-id="${troop.id}"
                    role="button"
                    tabindex="0"
                  >
                    <header class="c-troop-editor__troop-head">
                      <h2 class="c-troop-editor__troop-name">${troop.name}</h2>
                    </header>
                    ${renderTroopPreviewGrid(troop.slots, {
                      className: "c-troop-preview-grid c-troop-preview-grid--compact",
                      labelMode: "role-only",
                    })}
                  </article>
                `
              )
              .join("")}
          </div>
        </aside>

        <div class="c-troop-management__workspace">
          <div class="c-troop-management__stage-row">
            <div
              class="c-troop-management__battlefield-shell"
              data-troop-management-battlefield-shell
            >
              <section
                class="c-troop-management__battlefield"
                aria-label="${model.troopName} 战斗预览"
              >
                <div class="c-troop-management__battlefield-stage">
                  <iframe
                    class="c-troop-management__battle-preview-frame"
                    src="/prototypes/troop-management-preview/index.html?previewConfig=${previewConfig}"
                    title="${model.troopName} 战斗预览"
                    loading="lazy"
                    data-troop-management-battle-preview
                    data-preview-config="${previewConfig}"
                  ></iframe>
                </div>
              </section>
              <button
                type="button"
                class="c-troop-management__cycle-button c-troop-management__cycle-button--left"
                ${
                  model.canCycleTroops && model.previousTroopId != null
                    ? `data-action="open-troop-management" data-troop-id="${model.previousTroopId}"`
                    : "disabled"
                }
                aria-label="切换到上一支队伍"
              ></button>
              <button
                type="button"
                class="c-troop-management__cycle-button c-troop-management__cycle-button--right"
                ${
                  model.canCycleTroops && model.nextTroopId != null
                    ? `data-action="open-troop-management" data-troop-id="${model.nextTroopId}"`
                    : "disabled"
                }
                aria-label="切换到下一支队伍"
              ></button>
            </div>

            <aside class="c-troop-management__inspector">
              <div class="c-troop-management__sidebar-stack">
                <div class="c-troop-management__action-list" data-troop-management-actions-panel>
                  ${model.actions
                    .map((action) => {
                      if (
                        action.id === "move" ||
                        action.id === "add" ||
                        action.id === "remove" ||
                        action.id === "clear" ||
                        action.id === "disband"
                      ) {
                        return `
                          <button
                            type="button"
                            class="c-button c-troop-editor__menu-button c-troop-management__action-button"
                            data-troop-management-action="${action.id}"
                            aria-pressed="false"
                          >
                            ${action.label}
                          </button>
                        `;
                      }

                      return `
                        <button
                          type="button"
                          class="c-button c-troop-editor__menu-button c-troop-management__action-button"
                          ${action.actionId == null ? "disabled" : ""}
                          ${action.actionId == null ? "" : `data-action="${action.actionId}"`}
                        >
                          ${action.label}
                        </button>
                      `;
                    })
                    .join("")}
                </div>

                <section class="c-troop-management__reserve-panel" data-troop-management-reserve-panel hidden>
                  <header class="c-troop-management__reserve-head">
                    <h2 class="c-troop-management__reserve-title">预备队</h2>
                    <div class="c-troop-management__reserve-count">
                      ${model.reserveMembers.length} / ${model.reserveCapacity}
                    </div>
                  </header>

                  <div class="c-troop-management__reserve-scroll">
                    ${
                      model.reserveMembers.length === 0
                        ? `
                          <div class="c-troop-management__reserve-empty">
                            当前预备队中暂无可编入士兵
                          </div>
                        `
                        : model.reserveMembers
                            .map(
                              (member) => `
                                <button
                                  type="button"
                                  class="c-button c-troop-management__reserve-member"
                                  data-troop-management-reserve-member="${member.id}"
                                >
                                  <strong class="c-troop-management__reserve-member-name">${member.name}</strong>
                                  <span class="c-troop-management__reserve-member-role">${member.roleLabel}</span>
                                </button>
                              `
                            )
                            .join("")
                    }
                  </div>

                  <div class="c-troop-management__reserve-prompt" data-troop-management-reserve-prompt hidden>
                    <button
                      type="button"
                      class="c-button c-troop-editor__menu-button c-troop-management__reserve-prompt-button"
                      data-troop-management-reserve-prompt-action="assign"
                    >
                      编入队伍
                    </button>
                    <button
                      type="button"
                      class="c-button c-troop-editor__menu-button c-troop-management__reserve-prompt-button"
                      data-troop-management-reserve-prompt-action="back"
                    >
                      返回
                    </button>
                  </div>

                  <button
                    type="button"
                    class="c-button c-troop-editor__menu-button c-troop-management__reserve-return"
                    data-troop-management-reserve-close
                  >
                    返回编辑
                  </button>
                </section>
              </div>
            </aside>
          </div>

          <section class="c-troop-management__summary">
            <div class="c-troop-management__summary-nameplate">${model.troopName}</div>
            <div class="c-troop-management__summary-grid">
              ${model.summaryFields
                .map(
                  (field) => `
                    <article class="c-troop-management__summary-field">
                      <span class="c-troop-management__summary-label">${field.label}</span>
                      <strong class="c-troop-management__summary-value">${field.valueText}</strong>
                    </article>
                  `
                )
                .join("")}
            </div>
          </section>
        </div>
      </div>

      <div
        class="c-troop-management__confirm-overlay"
        data-troop-management-remove-confirm
        hidden
      >
        <div
          class="c-troop-management__confirm-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="troop-remove-confirm-title"
        >
          <h2
            class="c-troop-management__confirm-title"
            id="troop-remove-confirm-title"
            data-troop-management-confirm-title
          >
            移除单位
          </h2>
          <p class="c-troop-management__confirm-text" data-troop-management-confirm-text>
            确定要移除这个单位吗？单位将返回预备队。
          </p>
          <div class="c-troop-management__confirm-actions">
            <button
              type="button"
              class="c-button c-troop-editor__menu-button c-troop-management__confirm-button"
              data-troop-management-remove-confirm-choice="confirm"
            >
              是
            </button>
            <button
              type="button"
              class="c-button c-troop-editor__menu-button c-troop-management__confirm-button"
              data-troop-management-remove-confirm-choice="cancel"
            >
              否
            </button>
          </div>
        </div>
      </div>

      <div
        class="c-troop-management__confirm-overlay"
        data-troop-management-alert
        hidden
      >
        <div
          class="c-troop-management__confirm-dialog"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="troop-management-alert-title"
        >
          <h2 class="c-troop-management__confirm-title" id="troop-management-alert-title">
            提示
          </h2>
          <p class="c-troop-management__confirm-text" data-troop-management-alert-text></p>
          <div class="c-troop-management__confirm-actions">
            <button
              type="button"
              class="c-button c-troop-editor__menu-button c-troop-management__confirm-button"
              data-troop-management-alert-close
            >
              知道了
            </button>
          </div>
        </div>
      </div>
    </section>
  `;
}
