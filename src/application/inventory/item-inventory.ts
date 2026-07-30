import type { GameState } from "../../domain/game-state";
import type {
  BackpackActionStatus,
  BackpackItemCategoryFilter,
  BackpackItemDefinition,
  ItemActionId,
} from "../../domain/item";
import {
  medicineHousePreparedMedicines,
} from "../../content/houses/medicine-house-content";
import type { MedicineHousePreparedMedicineDefinition } from "../../content/houses/medicine-house-content";
import { runtimeTradeGoodsPool } from "../../content/markets/runtime-trade-goods-pool";
import type { TradeGoodDefinition } from "../../domain/trade-good";
import type {
  ValuableItemDefinition,
  ValuableItemInventory,
} from "../../domain/valuable-item";
import {
  defaultEquipmentLoadoutService,
} from "../../domain/equipment/equipment-loadout-service";
import {
  defaultEquipmentSlotRegistry,
} from "../../domain/equipment/equipment-slot-registry";
import {
  TEMPLE_TOP_RANK_REWARD,
  readRuntimeItemQuantity,
} from "../review/faction-review";
import { equipValuableItem } from "./inventory-selection";
import { readPlayerItemQuantity } from "./player-item-inventory";
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

function compareEquipmentItems(
  inventory: ValuableItemInventory,
  left: ValuableItemDefinition,
  right: ValuableItemDefinition
): number {
  const leftEquipped = defaultEquipmentLoadoutService.isItemEquipped(
    inventory,
    left.id
  );
  const rightEquipped = defaultEquipmentLoadoutService.isItemEquipped(
    inventory,
    right.id
  );
  if (leftEquipped !== rightEquipped) {
    return leftEquipped ? -1 : 1;
  }

  const leftSlot = defaultEquipmentSlotRegistry.getSlotForCategory(
    left.category
  );
  const rightSlot = defaultEquipmentSlotRegistry.getSlotForCategory(
    right.category
  );
  const slotOrder =
    (leftSlot?.sortOrder ?? Number.MAX_SAFE_INTEGER) -
    (rightSlot?.sortOrder ?? Number.MAX_SAFE_INTEGER);
  if (slotOrder !== 0) {
    return slotOrder;
  }

  const sortWeight = (left.sortWeight ?? 0) - (right.sortWeight ?? 0);
  if (sortWeight !== 0) {
    return sortWeight;
  }

  return (
    left.name.localeCompare(right.name, "zh-Hans") ||
    left.id.localeCompare(right.id)
  );
}

function projectValuableItem(
  item: ValuableItemDefinition,
  inventory: ValuableItemInventory
): BackpackItemDefinition {
  const slot = defaultEquipmentSlotRegistry.getSlotForCategory(item.category);
  const isEquipped = defaultEquipmentLoadoutService.isItemEquipped(
    inventory,
    item.id
  );
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
    ...(slot == null
      ? {}
      : {
          equipSlotId: slot.slotId,
          isEquipped,
          equippedLabel: isEquipped ? "已装备" : "",
          canEquip: true,
        }),
    actions: [
      {
        id: "equip.valuable",
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

function projectReviewRuntimeItems(
  gameState: Pick<GameState, "runtime">
): BackpackItemDefinition[] {
  const scriptureCopyCount = readRuntimeItemQuantity(
    gameState,
    TEMPLE_TOP_RANK_REWARD.itemId
  );
  if (scriptureCopyCount <= 0) {
    return [];
  }

  return [
    {
      id: TEMPLE_TOP_RANK_REWARD.itemId,
      name: TEMPLE_TOP_RANK_REWARD.label,
      icon: null,
      value: 0,
      types: ["other", "quest"],
      count: scriptureCopyCount,
      description: "寺中评定赐下的经书抄本。",
      actions: [],
    },
  ];
}

function describePreparedMedicine(
  medicine: MedicineHousePreparedMedicineDefinition
): string {
  const parts: string[] = [];
  if (typeof medicine.effect.hp === "number" && medicine.effect.hp > 0) {
    parts.push(`Restore ${medicine.effect.hp} HP`);
  }
  if (
    typeof medicine.effect.fatigue === "number" &&
    medicine.effect.fatigue > 0
  ) {
    parts.push(`Restore ${medicine.effect.fatigue} fatigue`);
  }
  if (
    typeof medicine.effect.poison === "number" &&
    medicine.effect.poison < 0
  ) {
    parts.push(`Cure ${Math.abs(medicine.effect.poison)} poison`);
  }
  return parts.join("; ") || "Prepared medicine.";
}

function projectPreparedMedicineItems(
  gameState: Pick<GameState, "runtime">
): BackpackItemDefinition[] {
  return medicineHousePreparedMedicines.flatMap((medicine) => {
    const count = readPlayerItemQuantity(
      gameState,
      medicine.id,
      ["medicine-house"]
    );
    if (count <= 0) {
      return [];
    }

    const description = describePreparedMedicine(medicine);
    return [
      {
        id: `item.medicine.${medicine.id}`,
        name: medicine.name,
        icon: null,
        value: medicine.price,
        types: ["other", "prepared-medicine"],
        count,
        description,
        detailText: description,
        actions: [],
      },
    ];
  });
}

function projectTradeGoods(
  gameState: Pick<GameState, "runtime">
): BackpackItemDefinition[] {
  return runtimeTradeGoodsPool.flatMap((goodsDefinition: TradeGoodDefinition) => {
    if (goodsDefinition.shopType === "grain-shop") {
      return [];
    }

    const count = readPlayerItemQuantity(
      gameState,
      goodsDefinition.id,
      ["market-house"]
    );
    if (count <= 0) {
      return [];
    }

    return [
      {
        id: `item.trade.${goodsDefinition.id}`,
        name: goodsDefinition.name,
        icon: null,
        value: goodsDefinition.basePrice,
        types: compactTypes(["other", "trade", goodsDefinition.category]),
        count,
        description: goodsDefinition.description,
        actions: [],
      },
    ];
  });
}

export function projectBackpackItems(
  input: ProjectBackpackItemsInput
): BackpackItemDefinition[] {
  const grainItem = projectGrainItem(input.gameState);
  return [
    ...[...input.valuableInventory.items]
      .sort((left, right) =>
        compareEquipmentItems(input.valuableInventory, left, right)
      )
      .map((item) => projectValuableItem(item, input.valuableInventory)),
    ...(grainItem == null ? [] : [grainItem]),
    ...projectReviewRuntimeItems(input.gameState),
    ...projectPreparedMedicineItems(input.gameState),
    ...projectTradeGoods(input.gameState),
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
  if (input.actionId === "equip.valuable") {
    const matchedItem = input.valuableInventory.items.find(
      (item) => item.id === input.itemId
    );
    if (
      matchedItem != null &&
      defaultEquipmentSlotRegistry.getSlotForCategory(matchedItem.category) != null
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
