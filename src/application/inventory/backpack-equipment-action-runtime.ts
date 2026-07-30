import type {
  BackpackActionStatus,
  BackpackItemDefinition,
  ItemActionDefinition,
  ItemActionId,
} from "../../domain/item";
import {
  defaultEquipmentLoadoutService,
  type EquipmentLoadoutService,
} from "../../domain/equipment/equipment-loadout-service";
import {
  defaultEquipmentSlotRegistry,
  type EquipmentSlotId,
  type EquipmentSlotRegistry,
} from "../../domain/equipment/equipment-slot-registry";
import type {
  ValuableItemDefinition,
  ValuableItemInventory,
} from "../../domain/valuable-item";

export type BackpackEquipmentItemProjection = Omit<
  Pick<
    BackpackItemDefinition,
    "equipSlotId" | "isEquipped" | "equippedLabel" | "canEquip" | "actions"
  >,
  "equipSlotId"
> & {
  equipSlotId: EquipmentSlotId;
};

export type ApplyBackpackEquipmentActionInput = {
  valuableInventory: ValuableItemInventory;
  itemId: string;
  actionId: ItemActionId;
};

export type ApplyBackpackEquipmentActionResult = {
  valuableInventory: ValuableItemInventory;
  status: BackpackActionStatus;
};

function createActionResult(
  valuableInventory: ValuableItemInventory,
  status: BackpackActionStatus
): ApplyBackpackEquipmentActionResult {
  return {
    valuableInventory,
    status,
  };
}

function createEquipmentActions(isEquipped: boolean): ItemActionDefinition[] {
  return [
    {
      id: "equip.valuable",
      label: "装备",
      disabled: isEquipped,
    },
    {
      id: "unequip.valuable",
      label: "卸除",
      disabled: !isEquipped,
    },
  ];
}

export class BackpackEquipmentActionRuntime {
  constructor(
    private readonly loadoutService: EquipmentLoadoutService,
    private readonly slotRegistry: EquipmentSlotRegistry
  ) {}

  projectItem(
    item: ValuableItemDefinition,
    inventory: ValuableItemInventory
  ): BackpackEquipmentItemProjection | null {
    const slot = this.slotRegistry.getSlotForCategory(item.category);
    if (slot == null) {
      return null;
    }

    const isEquipped = this.loadoutService.isItemEquipped(inventory, item.id);
    return {
      equipSlotId: slot.slotId,
      isEquipped,
      equippedLabel: isEquipped ? "已装备" : "",
      canEquip: true,
      actions: createEquipmentActions(isEquipped),
    };
  }

  applyAction(
    input: ApplyBackpackEquipmentActionInput
  ): ApplyBackpackEquipmentActionResult {
    const matchedItem = input.valuableInventory.items.find(
      (item) => item.id === input.itemId
    );
    if (matchedItem == null) {
      return createActionResult(input.valuableInventory, "unsupported");
    }

    const projection = this.projectItem(matchedItem, input.valuableInventory);
    if (projection == null) {
      return createActionResult(input.valuableInventory, "unsupported");
    }

    if (input.actionId === "equip.valuable") {
      return createActionResult(
        this.loadoutService.equipItem(input.valuableInventory, matchedItem),
        "applied"
      );
    }

    if (input.actionId === "unequip.valuable") {
      return projection.isEquipped !== true
        ? createActionResult(input.valuableInventory, "unsupported")
        : createActionResult(
            this.loadoutService.unequipSlot(
              input.valuableInventory,
              projection.equipSlotId
            ),
            "applied"
          );
    }

    return createActionResult(input.valuableInventory, "unsupported");
  }
}

export const defaultBackpackEquipmentActionRuntime =
  new BackpackEquipmentActionRuntime(
    defaultEquipmentLoadoutService,
    defaultEquipmentSlotRegistry
  );
