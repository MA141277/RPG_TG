import type { ValuableItemCategory } from "../valuable-item";

export type EquipmentSlotId = "weapon" | "armor" | "accessory" | "mount";

export type EquipmentSlotDefinition = {
  slotId: EquipmentSlotId;
  label: string;
  acceptedCategories: readonly ValuableItemCategory[];
  sortOrder: number;
};

export const DEFAULT_EQUIPMENT_SLOT_DEFINITIONS = [
  {
    slotId: "weapon",
    label: "武器",
    acceptedCategories: ["weapon"],
    sortOrder: 0,
  },
  {
    slotId: "armor",
    label: "防具",
    acceptedCategories: ["armor"],
    sortOrder: 1,
  },
  {
    slotId: "accessory",
    label: "饰品",
    acceptedCategories: ["accessory"],
    sortOrder: 2,
  },
  {
    slotId: "mount",
    label: "坐骑",
    acceptedCategories: ["mount"],
    sortOrder: 3,
  },
] as const satisfies readonly EquipmentSlotDefinition[];

export class EquipmentSlotRegistry {
  private readonly slotsById: ReadonlyMap<EquipmentSlotId, EquipmentSlotDefinition>;

  private readonly orderedSlots: EquipmentSlotDefinition[];

  constructor(slots: readonly EquipmentSlotDefinition[]) {
    this.orderedSlots = [...slots].sort((a, b) => a.sortOrder - b.sortOrder);
    this.slotsById = new Map(
      this.orderedSlots.map((slot) => [slot.slotId, slot])
    );
  }

  get(slotId: EquipmentSlotId): EquipmentSlotDefinition {
    const slot = this.slotsById.get(slotId);
    if (slot == null) {
      throw new Error(`Equipment slot not found for id "${slotId}".`);
    }

    return slot;
  }

  getAll(): readonly EquipmentSlotDefinition[] {
    return this.orderedSlots;
  }

  getSlotForCategory(
    category: ValuableItemCategory
  ): EquipmentSlotDefinition | null {
    return (
      this.orderedSlots.find((slot) =>
        slot.acceptedCategories.includes(category)
      ) ?? null
    );
  }

  acceptsCategory(
    slotId: EquipmentSlotId,
    category: ValuableItemCategory
  ): boolean {
    return this.get(slotId).acceptedCategories.includes(category);
  }
}

export const defaultEquipmentSlotRegistry = new EquipmentSlotRegistry(
  DEFAULT_EQUIPMENT_SLOT_DEFINITIONS
);
