import type {
  ScriptEditorWorkspaceInspectorCard,
  ScriptEditorWorkspaceTreeNode,
  ScriptEditorWorkspaceViewModel,
} from "../../../application/script-editor/workspace-shell";

export function renderScriptEditorWorkspaceView(
  model: ScriptEditorWorkspaceViewModel
): string {
  return `
    <section class="c-script-editor-shell" aria-label="剧本编辑器工作台">
      <header class="c-script-editor-shell__header">
        <div class="c-script-editor-shell__heading">
          <p class="c-script-editor-shell__eyebrow">Script Editor Shell</p>
          <h1 class="c-script-editor-shell__title">${escapeHtml(model.title)}</h1>
          <p class="c-script-editor-shell__subtitle">${escapeHtml(model.subtitle)}</p>
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
        </div>
        <nav class="c-script-editor-shell__nav" aria-label="工作台导航">
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
        <div class="c-script-editor-shell__toolbar" aria-label="工作台操作">
          ${model.toolbarActions
            .map(
              (action) => `
                <article
                  class="c-script-editor-shell__action c-script-editor-shell__action--${action.status}"
                  data-script-editor-action="${action.id}"
                >
                  <strong>${escapeHtml(action.label)}</strong>
                  <p>${escapeHtml(action.description)}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </header>

      <div class="c-script-editor-shell__body">
        <aside class="c-script-editor-shell__sidebar" aria-label="对象树">
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

          <aside class="c-script-editor-shell__handoff" aria-label="交接摘要">
            <p class="c-script-editor-shell__handoff-eyebrow">Handoff Summary</p>
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
            <p class="c-script-editor-shell__handoff-message">
              ${
                model.handoffSummary.firstMessage == null
                  ? "当前 shell 已能稳定承接后续 workflow queue 的保存、校验和导出入口。"
                  : escapeHtml(model.handoffSummary.firstMessage)
              }
            </p>
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

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
