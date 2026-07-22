import {
  getTroopRoleLabel,
  type TroopPreviewSlotViewModel,
} from "../../../application/troop-editor/troop-editor-stage-view-model";

type TroopPreviewGridLabelMode = "default" | "role-only";

export function renderTroopPreviewGrid(
  slots: TroopPreviewSlotViewModel[],
  options: {
    className?: string;
    labelMode?: TroopPreviewGridLabelMode;
  } = {}
): string {
  const className = options.className ?? "c-troop-preview-grid";
  const labelMode = options.labelMode ?? "default";

  return `
    <div class="${className}" aria-label="队伍九宫格缩略预览">
      ${slots
        .map((slot) => {
          const roleLabel =
            slot.isOccupied && slot.role != null ? getTroopRoleLabel(slot.role) : null;
          const displayLabel =
            labelMode === "role-only" ? roleLabel ?? "空位" : slot.label;

          return `
            <article
              class="c-troop-preview-grid__slot${slot.isOccupied ? " is-occupied" : ""}"
              data-slot-key="${slot.slotKey}"
            >
              <span class="c-troop-preview-grid__slot-key">${slot.slotKey}</span>
              ${
                labelMode === "default" && roleLabel != null
                  ? `<span class="c-troop-preview-grid__slot-role">${roleLabel}</span>`
                  : ""
              }
              <strong class="c-troop-preview-grid__slot-label">${displayLabel}</strong>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}
