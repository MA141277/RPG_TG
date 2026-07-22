import type { FormationPreviewSlotViewModel } from "../../../application/formation/formation-stage-view-model";

export function renderFormationPreviewGrid(
  slots: FormationPreviewSlotViewModel[],
  options: { className?: string } = {}
): string {
  const className = options.className ?? "c-formation-preview-grid";

  return `
    <div class="${className}" aria-label="队伍九宫格预览">
      ${slots
        .map(
          (slot) => `
            <article
              class="c-formation-preview-grid__slot${slot.isOccupied ? " is-occupied" : ""}"
              data-slot-key="${slot.slotKey}"
            >
              <span class="c-formation-preview-grid__slot-key">${slot.slotKey}</span>
              <strong class="c-formation-preview-grid__slot-label">${slot.label}</strong>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}
