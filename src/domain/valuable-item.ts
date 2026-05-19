export type ValuableItemCategory = "weapon" | "armor";
export type ValuableItemType = "all" | ValuableItemCategory;

export type ValuableItemId = string;

export type ValuableItemDefinition = {
  id: ValuableItemId;
  name: string;
  category: ValuableItemCategory;
  price: number;
  ownedCount: number;
  kindText: string;
  itemImageId: string;
  description: string;
};

export type EquippedWeaponSet = {
  swordId: ValuableItemId | null;
  armorId: ValuableItemId | null;
};

export type ValuableItemInventory = {
  items: ValuableItemDefinition[];
  selectedItemId: ValuableItemId | null;
  equippedWeaponSet: EquippedWeaponSet;
};
