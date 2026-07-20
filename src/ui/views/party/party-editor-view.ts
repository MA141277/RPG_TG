import type { PartyEditorStageViewModel } from "../../../application/formation/formation-stage-view-model";
import { renderFormationPreviewGrid } from "./formation-preview-grid";

export function renderPartyEditorView(model: PartyEditorStageViewModel): string {
  return `
    <section class="view-party-editor" aria-label="${model.title}">
      <header class="c-party-editor__resource-bar">
        ${model.resources
          .map(
            (resource) => `
              <article class="c-party-editor__resource-slot c-party-editor__resource-slot--${resource.tone}">
                <span class="c-party-editor__resource-label">${resource.label}</span>
                <strong class="c-party-editor__resource-value">${resource.valueText}</strong>
              </article>
            `
          )
          .join("")}
      </header>
      <div class="c-party-editor__body">
        <aside class="c-party-editor__teams">
          ${model.teams
            .map(
              (team) => `
                <article class="c-party-editor__team-card">
                  <h2 class="c-party-editor__team-title">${team.name}</h2>
                  <p class="c-party-editor__team-summary">${team.summary}</p>
                  ${renderFormationPreviewGrid(team.slots)}
                </article>
              `
            )
            .join("")}
        </aside>
        <aside class="c-party-editor__commands">
          ${model.commands
            .map(
              (button) => `
                <button
                  type="button"
                  class="c-party-editor__command"
                  ${button.actionId == null ? "disabled" : ""}
                  ${button.actionId == null ? "" : `data-action="${button.actionId}"`}
                >
                  ${button.label}
                </button>
              `
            )
            .join("")}
        </aside>
      </div>
    </section>
  `;
}
