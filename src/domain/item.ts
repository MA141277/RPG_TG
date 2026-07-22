export type BackpackItemCategoryFilter = "all" | "equipment" | "food" | "other";

export type BackpackItemSortKey = "name" | "value" | "count" | "type";

export type ItemActionId =
  | "equip.weapon"
  | "equip.armor"
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
  actions: ItemActionDefinition[];
};

export type BackpackActionStatus = "applied" | "unsupported";

