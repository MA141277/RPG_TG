import type {
  ScriptEditorWorkspaceInspectorCard,
  ScriptEditorWorkspaceTreeGroup,
  ScriptEditorWorkspaceTreeNode,
  ScriptEditorWorkspaceViewModel,
} from "../../../application/script-editor/workspace-shell";

export function renderScriptEditorWorkspaceView(
  model: ScriptEditorWorkspaceViewModel,
  editorMarkup = ""
): string {
  const sidebarGroups = splitWorkspaceTreeGroups(model.objectTreeGroups);
  const embeddedInspector = editorMarkup.includes("<!-- SCRIPT_EDITOR_INSPECTOR_SLOT -->");
  const inspectorHeaderSlot = extractTemplateSlot(
    editorMarkup,
    "data-script-editor-inspector-header-slot"
  );
  const suppressInspectorText = editorMarkup.includes(
    "<!-- SCRIPT_EDITOR_INSPECTOR_SUPPRESS_TEXT -->"
  );
  const sanitizedEditorMarkup = editorMarkup
    .replace("<!-- SCRIPT_EDITOR_INSPECTOR_SUPPRESS_TEXT -->", "")
    .replace(inspectorHeaderSlot.fullMatch, "");
  const inspectorMarkup = renderInspector(model, {
    compact: embeddedInspector,
    headerSlot: inspectorHeaderSlot.content,
    hideHeaderText: suppressInspectorText,
  });
  const stageContent = sanitizedEditorMarkup.includes("<!-- SCRIPT_EDITOR_INSPECTOR_SLOT -->")
    ? sanitizedEditorMarkup.replace("<!-- SCRIPT_EDITOR_INSPECTOR_SLOT -->", inspectorMarkup)
    : `${inspectorMarkup}${sanitizedEditorMarkup}`;

  return `
    <section class="c-script-editor-shell">
      <header class="c-script-editor-shell__header">
        <div class="c-script-editor-shell__toolbar">
          <button
            type="button"
            class="c-script-editor-shell__toolbar-button c-script-editor-shell__toolbar-button--ghost"
            data-script-editor-action="back-to-landing"
          >
            返回列表
          </button>
          ${renderToolbarButtons(model)}
        </div>
      </header>

      <div class="c-script-editor-shell__body">
        <aside class="c-script-editor-shell__sidebar">
          ${sidebarGroups.map(renderTreeGroup).join("")}
        </aside>

        <main class="c-script-editor-shell__workspace">
          <section class="c-script-editor-shell__editor-stage">
            ${stageContent}
          </section>
        </main>
      </div>
    </section>
  `;
}

function splitWorkspaceTreeGroups(
  groups: ScriptEditorWorkspaceTreeGroup[]
): ScriptEditorWorkspaceTreeGroup[] {
  return groups
    .map((group) => {
      const nodes = group.nodes.filter((node) => {
        if (node.family !== "storyPack") {
          return true;
        }
        return false;
      });

      return {
        ...group,
        nodes,
      };
    })
    .filter((group) => group.nodes.length > 0);
}

function renderToolbarButtons(model: ScriptEditorWorkspaceViewModel): string {
  return model.toolbarActions
    .filter((action) => action.id !== "save")
    .filter((action) => action.id !== "validate")
    .map((action) => {
      const modifierClass =
        action.id === "export"
          ? "c-script-editor-shell__toolbar-button--accent"
          : "c-script-editor-shell__toolbar-button--outline";

      return `
        <button
          type="button"
          class="c-script-editor-shell__toolbar-button ${modifierClass}"
          data-script-editor-action="${escapeHtml(action.id)}"
          aria-label="${escapeHtml(action.description)}"
          title="${escapeHtml(action.description)}"
        >
          ${escapeHtml(action.label)}
        </button>
      `;
    })
    .join("");
}

function renderTreeGroup(group: ScriptEditorWorkspaceTreeGroup): string {
  return `
    <section class="c-script-editor-tree-group">
      <header class="c-script-editor-tree-group__header">
        <h2>${escapeHtml(group.label)}</h2>
      </header>
      <div class="c-script-editor-tree-group__nodes">
        ${group.nodes.map(renderTreeNode).join("")}
      </div>
    </section>
  `;
}

function renderTreeNode(node: ScriptEditorWorkspaceTreeNode): string {
  const selectedClass = node.isSelected ? " is-selected" : "";
  const warningClass = node.tone === "warning" ? " c-script-editor-tree-node--warning" : "";
  const entityIdAttribute =
    node.entityId == null ? "" : ` data-script-editor-entity-id="${escapeHtml(node.entityId)}"`;

  return `
    <button
      type="button"
      class="c-script-editor-tree-node${selectedClass}${warningClass}"
      data-script-editor-family="${escapeHtml(node.family)}"${entityIdAttribute}
    >
      <strong class="c-script-editor-tree-node__label">${escapeHtml(node.label)}</strong>
      <span class="c-script-editor-tree-node__count">${escapeHtml(String(node.itemCount))}</span>
    </button>
  `;
}

function renderInspector(
  model: ScriptEditorWorkspaceViewModel,
  options: { compact?: boolean; headerSlot?: string; hideHeaderText?: boolean } = {}
): string {
  const inspector = model.inspector;
  const compactClass = options.compact ? " c-script-editor-shell__inspector--compact" : "";
  const headerTextMarkup = options.hideHeaderText
    ? ""
    : `
        <div>
          <p class="c-script-editor-shell__inspector-eyebrow">${escapeHtml(inspector.eyebrow)}</p>
          <h1 class="c-script-editor-shell__inspector-title">${escapeHtml(inspector.title)}</h1>
        </div>
      `;
  const headerSlotMarkup = options.headerSlot?.trim() ?? "";
  const inspectorDescriptionMarkup =
    options.hideHeaderText || inspector.description.trim().length === 0
      ? ""
      : `<p class="c-script-editor-shell__inspector-description">${escapeHtml(inspector.description)}</p>`;

  if (options.compact && options.hideHeaderText && headerSlotMarkup.length === 0) {
    return "";
  }

  return `
    <section class="c-script-editor-shell__inspector${compactClass}">
      <div class="c-script-editor-shell__inspector-header">
        ${headerTextMarkup}
        ${headerSlotMarkup}
      </div>
      ${inspectorDescriptionMarkup}
      ${
        options.compact
          ? ""
          : `
            <dl class="c-script-editor-shell__stats">
              ${inspector.stats
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
              ${inspector.cards.map(renderInspectorCard).join("")}
            </div>
          `
      }
    </section>
  `;
}

function extractTemplateSlot(
  markup: string,
  attribute: string
): { fullMatch: string; content: string } {
  const pattern = new RegExp(
    `<template\\s+${attribute}\\s*>([\\s\\S]*?)<\\/template>`,
    "i"
  );
  const match = markup.match(pattern);

  if (match == null) {
    return {
      fullMatch: "",
      content: "",
    };
  }

  return {
    fullMatch: match[0],
    content: match[1] ?? "",
  };
}

function renderInspectorCard(card: ScriptEditorWorkspaceInspectorCard): string {
  const toneClass = ` c-script-editor-shell__card--${card.tone}`;
  return `
    <article class="c-script-editor-shell__card${toneClass}">
      <h3>${escapeHtml(card.title)}</h3>
      <p>${escapeHtml(card.body)}</p>
    </article>
  `;
}

function escapeHtml(value: string | number | null | undefined): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
