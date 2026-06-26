export type MedicineHouseCompoundingGrade = "S" | "A" | "B" | "C" | "D";

export type MedicineHouseAttributeChange = {
  key: "medicine";
  label: string;
  delta: number;
};

export type MedicineHouseInventoryChange = {
  itemId: string;
  quantity: number;
};

export type MedicineHouseActionOutcome = {
  relationshipChange: number;
  attributeChange: MedicineHouseAttributeChange[];
  fatigueRecovery: number;
  moneyChange: number;
  inventoryChange: MedicineHouseInventoryChange[];
  timeCost: number;
};

export type MedicineHousePreparedMedicineEffect = {
  hp?: number;
  fatigue?: number;
  poison?: number;
};

export type MedicineHouseHerbDefinition = {
  id: string;
  name: string;
  cold: number;
  heat: number;
  poison: number;
  heal: number;
};

export type CompoundingSessionTarget = {
  ailmentId: string;
  ailmentName: string;
  coldRequired: number;
  healRequired: number;
  maxPoison: number;
};

export type CompoundingHerbSelection = {
  herbId: string;
  amount: number;
};

export function getMedicineHouseTimeVariableKey(houseId: string): string {
  return `${houseId}.time`;
}

export function getMedicineHouseFavorabilityVariableKey(
  houseId: string,
  actorId: string
): string {
  return `${houseId}.${actorId}.favorability`;
}

export function getMedicineInventoryQuantityVariableKey(itemId: string): string {
  return `var.medicine_inventory.${itemId}`;
}

export function getPlayerFatigueVariableKey(): string {
  return "player.fatigue";
}

export function getPlayerHpVariableKey(): string {
  return "player.hp";
}

export function getPlayerPoisonVariableKey(): string {
  return "player.poison";
}

export function getPlayerInjuryVariableKey(): string {
  return "player.injury";
}
