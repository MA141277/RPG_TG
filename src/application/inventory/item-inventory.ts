import type { GameState } from "../../domain/game-state";
import type {
  BackpackActionStatus,
  BackpackItemCategoryFilter,
  BackpackItemDefinition,
  ItemActionId,
} from "../../domain/item";
import type {
  ValuableItemDefinition,
  ValuableItemInventory,
} from "../../domain/valuable-item";
import { equipValuableItem } from "./inventory-selection";
import { readPlayerGrainDou } from "./trade-inventory";

export const PLAYER_GRAIN_ITEM_ID = "item.grain";

type ProjectBackpackItemsInput = {
  valuableInventory: ValuableItemInventory;
  gameState: Pick<GameState, "runtime">;
};

type ApplyBackpackItemActionInput = {
  valuableInventory: ValuableItemInventory;
  itemId: string;
  actionId: ItemActionId;
};

type ApplyBackpackItemActionResult = {
  valuableInventory: ValuableItemInventory;
  status: BackpackActionStatus;
};

function compactTypes(types: string[]): string[] {
  return types.filter((type, index) => type.length > 0 && types.indexOf(type) === index);
}

function projectValuableItem(item: ValuableItemDefinition): BackpackItemDefinition {
  const isWeapon = item.category === "weapon";
  return {
    id: item.id,
    name: item.name,
    icon: item.itemImageId.length > 0 ? item.itemImageId : null,
    value: item.price,
    types: compactTypes([
      "equipment",
      item.category,
      item.kindText,
    ]),
    count: item.ownedCount,
    description: item.description,
    ...(item.detailText == null ? {} : { detailText: item.detailText }),
    actions: [
      {
        id: isWeapon ? "equip.weapon" : "equip.armor",
        label: "装备",
      },
    ],
  };
}

function projectGrainItem(gameState: Pick<GameState, "runtime">): BackpackItemDefinition | null {
  const grainDou = readPlayerGrainDou(gameState as GameState);
  if (grainDou <= 0) {
    return null;
  }

  return {
    id: PLAYER_GRAIN_ITEM_ID,
    name: "粮食",
    icon: null,
    value: 0,
    types: ["food", "grain"],
    count: grainDou,
    description: "随身携带的粮食，以斗为单位。",
    actions: [
      {
        id: "submit.quest",
        label: "提交",
      },
    ],
  };
}

export function projectBackpackItems(
  input: ProjectBackpackItemsInput
): BackpackItemDefinition[] {
  const grainItem = projectGrainItem(input.gameState);
  return [
    ...input.valuableInventory.items.map(projectValuableItem),
    ...(grainItem == null ? [] : [grainItem]),
  ];
}

export function filterBackpackItems<T extends { types: string[] }>(
  items: T[],
  filter: BackpackItemCategoryFilter
): T[] {
  if (filter === "all") {
    return items;
  }

  if (filter === "other") {
    return items.filter(
      (item) => !item.types.includes("equipment") && !item.types.includes("food")
    );
  }

  return items.filter((item) => item.types.includes(filter));
}

export function resolveSelectedBackpackItemId<T extends { id: string }>(
  visibleItems: T[],
  selectedItemId: string | null
): string | null {
  return visibleItems.find((item) => item.id === selectedItemId)?.id ?? visibleItems[0]?.id ?? null;
}

export function applyBackpackItemAction(
  input: ApplyBackpackItemActionInput
): ApplyBackpackItemActionResult {
  if (input.actionId === "equip.weapon" || input.actionId === "equip.armor") {
    const matchedItem = input.valuableInventory.items.find(
      (item) => item.id === input.itemId
    );
    if (
      matchedItem != null &&
      ((input.actionId === "equip.weapon" && matchedItem.category === "weapon") ||
        (input.actionId === "equip.armor" && matchedItem.category === "armor"))
    ) {
      return {
        valuableInventory: equipValuableItem(input.valuableInventory, input.itemId),
        status: "applied",
      };
    }
  }

  return {
    valuableInventory: input.valuableInventory,
    status: "unsupported",
  };
}

