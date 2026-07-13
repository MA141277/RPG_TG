import type {
  ScriptEditorWorkspaceAuxiliaryCard,
  ScriptEditorWorkspaceExportTarget,
  ScriptEditorWorkspaceInspectorCard,
  ScriptEditorWorkspaceTreeNode,
  ScriptEditorWorkspaceValidationIssue,
  ScriptEditorWorkspaceViewModel,
} from "../../../application/script-editor/workspace-shell";

export function renderScriptEditorWorkspaceView(
  model: ScriptEditorWorkspaceViewModel
): string {
  const activeNavigationLabel =
    model.navigationItems.find((item) => item.isActive)?.label ?? "创作工作台";

  return `
    <section class="c-script-editor-shell" aria-label="剧本编辑器工作台">
      <header class="c-script-editor-shell__header">
        <div class="c-script-editor-shell__heading">
          <p class="c-script-editor-shell__eyebrow">剧本编辑器工作台</p>
          <h1 class="c-script-editor-shell__title">${escapeHtml(model.title)}</h1>
          <p class="c-script-editor-shell__subtitle">${escapeHtml(model.subtitle)}</p>
        </div>
        <div class="c-script-editor-shell__badges">
          ${model.badges
            .map(
              (badge) => `
                <span class="c-script-editor-shell__badge c-script-editor-shell__badge--${badge.tone}">
                  ${escapeHtml(badge.label)}
                </span>
              `
            )
            .join("")}
        </div>
        <div class="c-script-editor-shell__toolbar" aria-label="工作台操作">
          <button
            type="button"
            class="c-script-editor-shell__action c-script-editor-shell__action--ghost"
            data-script-editor-action="back-to-landing"
          >
            <strong>返回项目列表</strong>
            <p>项目选择与导入留在列表页，不再常驻工作台首屏。</p>
          </button>
          ${model.toolbarActions
            .map(
              (action) => `
                <button
                  type="button"
                  class="c-script-editor-shell__action c-script-editor-shell__action--${action.status}"
                  data-script-editor-action="${action.id}"
                >
                  <strong>${escapeHtml(action.label)}</strong>
                  <p>${escapeHtml(action.description)}</p>
                </button>
              `
            )
            .join("")}
        </div>
        <nav class="c-script-editor-shell__nav" aria-label="工作台阶段导航">
          ${model.navigationItems
            .map(
              (item) => `
                <button
                  type="button"
                  class="c-script-editor-shell__nav-item ${item.isActive ? "is-active" : ""}"
                  data-script-editor-nav="${item.id}"
                >
                  ${escapeHtml(item.label)}
                </button>
              `
            )
            .join("")}
        </nav>
      </header>

      <div class="c-script-editor-shell__body">
        <aside class="c-script-editor-shell__sidebar" aria-label="对象树">
          <section class="c-script-editor-shell__sidebar-intro">
            <p class="c-script-editor-shell__sidebar-eyebrow">当前工作域</p>
            <h2 class="c-script-editor-shell__sidebar-title">${escapeHtml(
              activeNavigationLabel
            )}</h2>
            <p class="c-script-editor-shell__sidebar-description">
              先切换对象类型，再进入具体实例。项目打开、导入与删除留在列表页处理，不再挤占创作首屏。
            </p>
          </section>
          ${model.objectTreeGroups
            .map(
              (group) => `
                <section class="c-script-editor-tree-group">
                  <header class="c-script-editor-tree-group__header">
                    <h2>${escapeHtml(group.label)}</h2>
                  </header>
                  <div class="c-script-editor-tree-group__nodes">
                    ${group.nodes.map(renderTreeNode).join("")}
                  </div>
                </section>
              `
            )
            .join("")}
        </aside>

        <main class="c-script-editor-shell__workspace">
          <section class="c-script-editor-shell__inspector">
            <p class="c-script-editor-shell__inspector-eyebrow">
              ${escapeHtml(model.inspector.eyebrow)}
            </p>
            <h2 class="c-script-editor-shell__inspector-title">
              ${escapeHtml(model.inspector.title)}
            </h2>
            <p class="c-script-editor-shell__inspector-description">
              ${escapeHtml(model.inspector.description)}
            </p>
            <dl class="c-script-editor-shell__stats">
              ${model.inspector.stats
                .map(
                  (stat) => `
                    <div class="c-script-editor-shell__stat">
                      <dt>${escapeHtml(stat.label)}</dt>
                      <dd>${escapeHtml(stat.value)}</dd>
                    </div>
                  `
                )
                .join("")}
            </dl>
            <div class="c-script-editor-shell__cards">
              ${model.inspector.cards.map(renderInspectorCard).join("")}
            </div>
          </section>

          <aside class="c-script-editor-shell__handoff" aria-label="校验与导出摘要">
            <div class="c-script-editor-shell__handoff-header">
              <div>
                <p class="c-script-editor-shell__handoff-eyebrow">预览与校验辅助区</p>
                <p class="c-script-editor-shell__handoff-message">
                  ${
                    model.handoffSummary.firstMessage == null
                      ? "默认不常驻展开；需要时再打开查看结构预览、问题清单和导出落点。"
                      : escapeHtml(model.handoffSummary.firstMessage)
                  }
                </p>
              </div>
              <button
                type="button"
                class="c-main-ui-json-text-button"
                data-script-editor-action="toggle-preview-panel"
              >
                ${escapeHtml(model.auxiliaryPanel.toggleLabel)}
              </button>
            </div>
            <div class="c-script-editor-shell__handoff-grid">
              <article class="c-script-editor-shell__handoff-card">
                <strong>阻塞数</strong>
                <span>${model.handoffSummary.blockedCount}</span>
              </article>
              <article class="c-script-editor-shell__handoff-card">
                <strong>关注项</strong>
                <span>${model.handoffSummary.attentionCount}</span>
              </article>
            </div>

            ${
              model.auxiliaryPanel.isOpen
                ? `
                  <div class="c-script-editor-shell__auxiliary">
                    <section class="c-script-editor-shell__auxiliary-section">
                      <header class="c-script-editor-shell__auxiliary-heading">
                        <h3>结构预览</h3>
                        <span>与当前选中对象联动</span>
                      </header>
                      <div class="c-script-editor-shell__auxiliary-cards">
                        ${model.auxiliaryPanel.previewCards
                          .map(renderAuxiliaryCard)
                          .join("")}
                      </div>
                    </section>

                    <section class="c-script-editor-shell__auxiliary-section">
                      <header class="c-script-editor-shell__auxiliary-heading">
                        <h3>统一校验</h3>
                        <span>
                          阻塞 ${model.auxiliaryPanel.summary.blockedCount}
                          / 关注 ${model.auxiliaryPanel.summary.attentionCount}
                          / 提示 ${model.auxiliaryPanel.summary.infoCount}
                        </span>
                      </header>
                      <div class="c-script-editor-shell__issue-list">
                        ${model.auxiliaryPanel.issues.map(renderValidationIssue).join("")}
                      </div>
                    </section>

                    <section class="c-script-editor-shell__auxiliary-section">
                      <header class="c-script-editor-shell__auxiliary-heading">
                        <h3>导出落点</h3>
                        <span>当前对象导出预估</span>
                      </header>
                      <div class="c-script-editor-shell__export-list">
                        ${model.auxiliaryPanel.exportTargets
                          .map(renderExportTarget)
                          .join("")}
                      </div>
                    </section>
                  </div>
                `
                : ""
            }
          </aside>
        </main>
      </div>
    </section>
  `;
}

function renderTreeNode(node: ScriptEditorWorkspaceTreeNode): string {
  return `
    <button
      type="button"
      class="c-script-editor-tree-node c-script-editor-tree-node--${node.tone} ${node.isSelected ? "is-selected" : ""}"
      data-script-editor-family="${node.family}"
      ${node.entityId == null ? "" : `data-script-editor-entity-id="${escapeHtml(node.entityId)}"`}
    >
      <span class="c-script-editor-tree-node__label">${escapeHtml(node.label)}</span>
      <span class="c-script-editor-tree-node__count">${node.itemCount}</span>
      <span class="c-script-editor-tree-node__description">${escapeHtml(node.description)}</span>
    </button>
  `;
}

function renderInspectorCard(card: ScriptEditorWorkspaceInspectorCard): string {
  return `
    <article class="c-script-editor-shell__card c-script-editor-shell__card--${card.tone}">
      <h3>${escapeHtml(card.title)}</h3>
      <p>${escapeHtml(card.body)}</p>
    </article>
  `;
}

function renderAuxiliaryCard(card: ScriptEditorWorkspaceAuxiliaryCard): string {
  return `
    <article class="c-script-editor-shell__auxiliary-card c-script-editor-shell__auxiliary-card--${card.tone}">
      <h3>${escapeHtml(card.title)}</h3>
      <p>${escapeHtml(card.body)}</p>
    </article>
  `;
}

function renderValidationIssue(issue: ScriptEditorWorkspaceValidationIssue): string {
  return `
    <article class="c-script-editor-shell__issue c-script-editor-shell__issue--${issue.severity}">
      <div class="c-script-editor-shell__issue-copy">
        <strong>${escapeHtml(issue.title)}</strong>
        <p>${escapeHtml(issue.message)}</p>
      </div>
      <button
        type="button"
        class="c-main-ui-json-text-button"
        data-script-editor-action="jump-to-preview-issue"
        data-script-editor-family="${issue.targetFamily}"
        ${issue.targetEntityId == null ? "" : `data-script-editor-entity-id="${escapeHtml(issue.targetEntityId)}"`}
        ${issue.targetTab == null ? "" : `data-script-editor-target-tab="${escapeHtml(issue.targetTab)}"`}
      >
        ${escapeHtml(issue.actionLabel)}
      </button>
    </article>
  `;
}

function renderExportTarget(target: ScriptEditorWorkspaceExportTarget): string {
  return `
    <article class="c-script-editor-shell__export-target c-script-editor-shell__export-target--${target.status}">
      <div class="c-script-editor-shell__export-copy">
        <strong>${escapeHtml(target.label)}</strong>
        <p>${escapeHtml(target.body)}</p>
      </div>
      <span class="c-script-editor-shell__export-file">${escapeHtml(target.file)}</span>
    </article>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
