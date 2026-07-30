import type { ItemActionId } from "../../../domain/item";

export function getBackpackActionButtonSound(
  actionId: ItemActionId
): "light" | "heavy" {
  return actionId.startsWith("equip.") || actionId.startsWith("unequip.")
    ? "heavy"
    : "light";
}
