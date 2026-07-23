import type { TroopManagementStageViewModel } from "../../../application/troop-editor/troop-management-stage-view-model";
import { renderTroopPreviewGrid } from "./troop-preview-grid";

function encodePreviewConfig(model: TroopManagementStageViewModel): string {
  return encodeURIComponent(JSON.stringify(model.battlePreview));
}

type TroopManagementAction = TroopManagementStageViewModel["actions"][number];
type TroopManagementResource = TroopManagementStageViewModel["resources"][number];

function getResourceDisplayLabel(resource: TroopManagementResource): string {
  if (resource.id === "fame") {
    return "威望";
  }

  if (resource.id === "gold") {
    return "金钱";
  }

  return resource.label;
}

function renderResourceSlot(resource: TroopManagementResource): string {
  return `
    <article
      class="c-troop-editor__resource-slot c-troop-editor__resource-slot--${resource.id}"
      data-resource-id="${resource.id}"
    >
      <span class="c-troop-editor__resource-icon" aria-hidden="true"></span>
      <span class="c-troop-editor__resource-label">${getResourceDisplayLabel(resource)}</span>
      <strong class="c-troop-editor__resource-value">${resource.valueText}</strong>
    </article>
  `;
}

function createManagementResources(
  model: TroopManagementStageViewModel
): TroopManagementResource[] {
  const scaleField = model.summaryFields.find((field) => field.id === "scale");
  const scaleResource: TroopManagementResource[] =
    scaleField == null
      ? []
      : [
          {
            id: "scale",
            label: "规模",
            valueText: scaleField.valueText,
          },
        ];

  return [...model.resources, ...scaleResource];
}

function renderTroopManagementActionButton(action: TroopManagementAction): string {
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
}

function renderTroopManagementReturnButton(action: TroopManagementAction | null): string {
  if (action == null) {
    return "";
  }

  return `
    <button
      type="button"
      class="c-button c-troop-editor__menu-button c-troop-management__action-button c-troop-management__action-button--return"
      ${action.actionId == null ? "disabled" : `data-action="${action.actionId}"`}
    >
      ${action.label}
    </button>
  `;
}

export function renderTroopManagementView(model: TroopManagementStageViewModel): string {
  const previewConfig = encodePreviewConfig(model);
  const resources = createManagementResources(model);
  const normalActions = model.actions.filter((action) => action.id !== "back");
  const returnAction = model.actions.find((action) => action.id === "back") ?? null;

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
        ${resources.map(renderResourceSlot).join("")}
      </header>

      <div class="c-troop-management__body">
        <aside class="c-troop-management__left-column">
          <section class="c-troop-management__troops-panel" aria-label="当前队伍">
            <div class="c-troop-editor__panel-heading">
              <h1 class="c-troop-editor__title">${model.title}</h1>
              <span class="c-troop-management__heading-rule" aria-hidden="true"></span>
              <strong class="c-troop-management__current-troop-name">${model.troopName}</strong>
            </div>
            <div class="c-troop-management__troop-scroll">
              <article class="c-troop-editor__troop-card is-selected">
                ${renderTroopPreviewGrid(model.previewSlots, {
                  className:
                    "c-troop-preview-grid c-troop-preview-grid--compact c-troop-preview-grid--management-panel",
                  labelMode: "role-only",
                })}
              </article>
            </div>
          </section>

          <div class="c-troop-management__action-area">
            <div class="c-troop-management__action-list" data-troop-management-actions-panel>
              <div class="c-troop-management__action-grid">
                ${normalActions.map(renderTroopManagementActionButton).join("")}
              </div>
              <div class="c-troop-management__return-row">
                ${renderTroopManagementReturnButton(returnAction)}
              </div>
            </div>

            <section class="c-troop-management__reserve-panel c-troop-assessment-popup c-troop-assessment-popup--list" data-troop-management-reserve-panel hidden>
              <header class="c-troop-management__reserve-head">
                <h2 class="c-troop-management__reserve-title">增加单位</h2>
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

        <div class="c-troop-management__workspace">
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
        </div>
      </div>

      <div
        class="c-troop-management__confirm-overlay"
        data-troop-management-remove-confirm
        hidden
      >
        <div
          class="c-troop-management__confirm-dialog c-troop-assessment-popup"
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
          class="c-troop-management__confirm-dialog c-troop-assessment-popup"
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
