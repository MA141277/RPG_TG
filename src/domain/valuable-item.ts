import type { EquipmentLoadout } from "./equipment/equipment-loadout-service";

export type ValuableItemCategory = "weapon" | "armor" | "accessory" | "mount";
export type ValuableItemType = "all" | ValuableItemCategory;

export type ValuableItemId = string;

export type ValuableItemDefinition = {
  id: ValuableItemId;
  name: string;
  category: ValuableItemCategory;
  price: number;
  ownedCount: number;
  equippedCount?: number;
  sortWeight?: number;
  kindText: string;
  itemImageId: string;
  description: string;
  detailText?: string;
};

export type ValuableItemInventory = {
  items: ValuableItemDefinition[];
  selectedItemId: ValuableItemId | null;
  equippedSlots: EquipmentLoadout;
};
