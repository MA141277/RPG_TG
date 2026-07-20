import type { ActivePlayableSession } from "../../../core/contracts/playable-runtime";
import { presentFlowPlayable } from "../../../application/playables/flow/flow-playable-presenter";
import type { FlowPlayableDefinition } from "../../../domain/playables/flow";

export function renderFlowPlayableView(input: {
  definition: FlowPlayableDefinition;
  session: ActivePlayableSession;
}): string {
  const presenter = presentFlowPlayable(input);
  const viewModel = presenter.viewModel ?? {};
  const nodeType = viewModel.nodeType;

  return `
    <section class="view-house view-playable-flow">
      <div class="c-stage-header">
        <div>
          <p class="c-stage-header__eyebrow">建筑功能</p>
          <h1 class="c-stage-header__title">${presenter.title}</h1>
        </div>
      </div>
      <div class="c-house-interior">
        ${
          nodeType === "choice"
            ? `<div class="c-panel"><p>${String(viewModel.prompt ?? "")}</p></div>`
            : `<div class="c-panel"><p>${String(viewModel.text ?? "")}</p></div>`
        }
        <div class="c-house-roster">
          ${presenter.actions
            .map(
              (action) => `
                <button
                  class="c-button"
                  data-action="playable-flow-action"
                  data-playable-id="${presenter.playableId}"
                  data-playable-action="${action.commandType === "custom" ? "select" : action.id}"
                  data-playable-value="${action.commandType === "custom" ? action.id : ""}"
                >
                  ${action.label}
                </button>
              `
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}
