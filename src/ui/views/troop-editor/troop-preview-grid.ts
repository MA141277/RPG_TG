import {
  getTroopRoleLabel,
  type TroopPreviewSlotViewModel,
} from "../../../application/troop-editor/troop-editor-stage-view-model";

type TroopPreviewGridLabelMode = "default" | "role-only";

function getTroopRoleAssetTag(role: string | null): string | null {
  if (role == null) {
    return null;
  }
  if (
    role === "militia" ||
    role === "scout" ||
    role === "infantry" ||
    role === "elite-infantry" ||
    role === "guard" ||
    role === "siege" ||
    role === "support"
  ) {
    return "infantry";
  }
  if (role === "spearman") {
    return "spearman";
  }
  if (role === "archer" || role === "crossbow") {
    return "archer";
  }
  if (role === "teppo" || role === "gunpowder" || role === "musketeer") {
    return "musketeer";
  }
  if (role === "light-cavalry" || role === "heavy-cavalry" || role === "cavalry") {
    return "cavalry";
  }
  return "infantry";
}

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
          const roleAssetTag = slot.isOccupied ? getTroopRoleAssetTag(slot.role) : null;
          const displayLabel =
            labelMode === "role-only" ? roleLabel ?? "空位" : slot.label;

          return `
            <article
              class="c-troop-preview-grid__slot${slot.isOccupied ? " is-occupied" : ""}${slot.isCaptain ? " is-captain" : ""}"
              data-slot-key="${slot.slotKey}"
              data-troop-role="${slot.role ?? ""}"
              data-troop-asset-tag="${roleAssetTag ?? ""}"
            >
              ${slot.isCaptain ? '<span class="c-troop-preview-grid__captain-badge">L</span>' : ""}
              ${
                roleAssetTag != null
                  ? '<span class="c-troop-preview-grid__unit-thumbnail" aria-hidden="true"></span>'
                  : ""
              }
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
