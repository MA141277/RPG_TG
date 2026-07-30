import type { EquipmentSlotId } from "./equipment/equipment-slot-registry";

export type BackpackItemCategoryFilter = "all" | "equipment" | "food" | "other";

export type BackpackItemSortKey = "name" | "value" | "count" | "type";

export type ItemActionId =
  | "equip.valuable"
  | "consume.food"
  | "consume.medicine"
  | "submit.quest"
  | string;

export type ItemActionDefinition = {
  id: ItemActionId;
  label: string;
  disabled?: boolean;
};

export type BackpackItemDefinition = {
  id: string;
  name: string;
  icon: string | null;
  value: number;
  types: string[];
  count: number;
  description: string;
  detailText?: string;
  equipSlotId?: EquipmentSlotId;
  isEquipped?: boolean;
  equippedLabel?: string;
  canEquip?: boolean;
  actions: ItemActionDefinition[];
};

export type BackpackActionStatus = "applied" | "unsupported";

