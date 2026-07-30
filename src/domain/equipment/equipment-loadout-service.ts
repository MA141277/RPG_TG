import type {
  ValuableItemCategory,
  ValuableItemDefinition,
  ValuableItemId,
  ValuableItemInventory,
} from "../valuable-item";
import type { EquipmentSlotId } from "./equipment-slot-registry";
import {
  defaultEquipmentSlotRegistry,
  EquipmentSlotRegistry,
} from "./equipment-slot-registry";

export type EquipmentLoadout = Record<EquipmentSlotId, ValuableItemId | null>;

export function createDefaultEquipmentLoadout(): EquipmentLoadout {
  return {
    weapon: null,
    armor: null,
    accessory: null,
    mount: null,
  };
}

export function normalizeEquipmentLoadout(
  input?: Partial<EquipmentLoadout> | null
): EquipmentLoadout {
  return {
    weapon: input?.weapon ?? null,
    armor: input?.armor ?? null,
    accessory: input?.accessory ?? null,
    mount: input?.mount ?? null,
  };
}

export class EquipmentLoadoutService {
  constructor(private readonly registry: EquipmentSlotRegistry) {}

  createDefaultLoadout(): EquipmentLoadout {
    return createDefaultEquipmentLoadout();
  }

  normalizeLoadout(input?: Partial<EquipmentLoadout> | null): EquipmentLoadout {
    return normalizeEquipmentLoadout(input);
  }

  equip(
    loadout: Partial<EquipmentLoadout> | null | undefined,
    item: { id: ValuableItemId; category: ValuableItemCategory }
  ): EquipmentLoadout {
    const slot = this.registry.getSlotForCategory(item.category);
    if (slot == null) {
      throw new Error(
        `No equipment slot accepts category "${item.category}".`
      );
    }

    return {
      ...normalizeEquipmentLoadout(loadout),
      [slot.slotId]: item.id,
    };
  }

  equipItem(
    inventory: ValuableItemInventory,
    item: Pick<ValuableItemDefinition, "id" | "category">
  ): ValuableItemInventory {
    return {
      ...inventory,
      selectedItemId: item.id,
      equippedSlots: this.equip(inventory.equippedSlots, item),
    };
  }

  unequipSlot(
    inventory: ValuableItemInventory,
    slotId: EquipmentSlotId
  ): ValuableItemInventory {
    this.registry.get(slotId);
    return {
      ...inventory,
      equippedSlots: {
        ...this.normalizeLoadout(inventory.equippedSlots),
        [slotId]: null,
      },
    };
  }

  getEquippedItemId(
    inventory: ValuableItemInventory,
    slotId: EquipmentSlotId
  ): ValuableItemId | null {
    this.registry.get(slotId);
    return this.normalizeLoadout(inventory.equippedSlots)[slotId];
  }

  isItemEquipped(
    inventory: ValuableItemInventory,
    itemId: ValuableItemId
  ): boolean {
    return Object.values(this.normalizeLoadout(inventory.equippedSlots)).includes(
      itemId
    );
  }
}

export const defaultEquipmentLoadoutService = new EquipmentLoadoutService(
  defaultEquipmentSlotRegistry
);
