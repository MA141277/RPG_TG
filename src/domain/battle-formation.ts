import type { CharacterId, CharacterStats, SkillKey } from "./character";

export type BattleFormationId = string;
export type BattleFormationMemberId = string;
export type BattleFormationUnitDefinitionId = string;

export type BattleFormationRow = "front" | "middle" | "rear";
export type BattleFormationColumn = "left" | "center" | "right";
export type BattleFormationSlotKey = `${BattleFormationRow}-${BattleFormationColumn}`;

export const BATTLE_FORMATION_SLOT_KEYS = [
  "front-left",
  "front-center",
  "front-right",
  "middle-left",
  "middle-center",
  "middle-right",
  "rear-left",
  "rear-center",
  "rear-right",
] as const satisfies BattleFormationSlotKey[];

export type BattleFormationUnitRole =
  | "militia"
  | "scout"
  | "infantry"
  | "spearman"
  | "archer"
  | "crossbow"
  | "teppo"
  | "light-cavalry"
  | "elite-infantry"
  | "heavy-cavalry"
  | "guard"
  | "siege"
  | "support";

export const BATTLE_FORMATION_UNIT_CAPACITY_COSTS = {
  militia: 1,
  scout: 1,
  infantry: 2,
  spearman: 2,
  archer: 2,
  crossbow: 3,
  teppo: 3,
  "light-cavalry": 3,
  "elite-infantry": 3,
  "heavy-cavalry": 4,
  guard: 4,
  siege: 5,
  support: 5,
} as const satisfies Record<BattleFormationUnitRole, number>;

export type BattleFormationUnitDefinition = {
  id: BattleFormationUnitDefinitionId;
  name: string;
  role: BattleFormationUnitRole;
  capacityCost?: number;
  preferredRows: BattleFormationRow[];
  primarySkillKey?: SkillKey;
};

export type BattleFormationMember = {
  id: BattleFormationMemberId;
  unitDefinitionId: BattleFormationUnitDefinitionId;
  name: string;
  role: BattleFormationUnitRole;
  slotKey: BattleFormationSlotKey;
  characterId?: CharacterId;
  capacityCost?: number;
};

export type BattleFormation = {
  id: BattleFormationId;
  name: string;
  leaderCharacterId: CharacterId;
  members: BattleFormationMember[];
  rankCapacityBonus?: number;
  traitCapacityBonus?: number;
};

export type BattleFormationCapacityInput = {
  leadership: number;
  militarySkillLevel?: number;
  rankCapacityBonus?: number;
  traitCapacityBonus?: number;
};

export type BattleFormationCapacityBreakdown = {
  baseCapacity: number;
  leadershipBonus: number;
  militarySkillBonus: number;
  rankCapacityBonus: number;
  traitCapacityBonus: number;
  totalCapacity: number;
};

export const BATTLE_FORMATION_CAPACITY_RULE = {
  baseCapacity: 6,
  leadershipStep: 20,
  militarySkillStep: 2,
  maxCapacity: 20,
} as const;

export type BattleFormationValidationResult = {
  isValid: boolean;
  capacity: BattleFormationCapacityBreakdown;
  load: number;
  overCapacityBy: number;
  duplicateSlotKeys: BattleFormationSlotKey[];
  invalidSlotKeys: string[];
};

export type BattleFormationPerformanceInput = {
  leadership: number;
  unitSkillLevel?: number;
};

export const BATTLE_FORMATION_PERFORMANCE_RULE = {
  basePercent: 80,
  skillPercentPerLevel: 4,
  leadershipDivisor: 5,
  maxPercent: 130,
} as const;

export function calculateBattleFormationCapacity(
  input: BattleFormationCapacityInput
): BattleFormationCapacityBreakdown {
  const leadershipBonus = Math.floor(sanitizeNonNegativeNumber(input.leadership) / BATTLE_FORMATION_CAPACITY_RULE.leadershipStep);
  const militarySkillBonus = Math.floor(
    sanitizeNonNegativeNumber(input.militarySkillLevel ?? 0) / BATTLE_FORMATION_CAPACITY_RULE.militarySkillStep
  );
  const rankCapacityBonus = sanitizeNonNegativeNumber(input.rankCapacityBonus ?? 0);
  const traitCapacityBonus = sanitizeNonNegativeNumber(input.traitCapacityBonus ?? 0);
  const unclampedTotal =
    BATTLE_FORMATION_CAPACITY_RULE.baseCapacity +
    leadershipBonus +
    militarySkillBonus +
    rankCapacityBonus +
    traitCapacityBonus;

  return {
    baseCapacity: BATTLE_FORMATION_CAPACITY_RULE.baseCapacity,
    leadershipBonus,
    militarySkillBonus,
    rankCapacityBonus,
    traitCapacityBonus,
    totalCapacity: Math.min(BATTLE_FORMATION_CAPACITY_RULE.maxCapacity, unclampedTotal),
  };
}

export function calculateBattleFormationCapacityForCharacter(
  stats: Pick<CharacterStats, "leadership">,
  skills: Partial<Record<SkillKey, number>> = {},
  formation: Pick<BattleFormation, "rankCapacityBonus" | "traitCapacityBonus"> = {}
): BattleFormationCapacityBreakdown {
  return calculateBattleFormationCapacity({
    leadership: stats.leadership,
    militarySkillLevel: skills.military ?? 0,
    rankCapacityBonus: formation.rankCapacityBonus ?? 0,
    traitCapacityBonus: formation.traitCapacityBonus ?? 0,
  });
}

export function getBattleFormationMemberCapacityCost(
  member: Pick<BattleFormationMember, "role" | "capacityCost">
): number {
  return sanitizePositiveNumber(member.capacityCost ?? BATTLE_FORMATION_UNIT_CAPACITY_COSTS[member.role]);
}

export function calculateBattleFormationLoad(members: ReadonlyArray<BattleFormationMember>): number {
  return members.reduce((total, member) => total + getBattleFormationMemberCapacityCost(member), 0);
}

export function validateBattleFormation(
  formation: BattleFormation,
  leaderStats: Pick<CharacterStats, "leadership">,
  leaderSkills: Partial<Record<SkillKey, number>> = {}
): BattleFormationValidationResult {
  const capacity = calculateBattleFormationCapacityForCharacter(leaderStats, leaderSkills, formation);
  const load = calculateBattleFormationLoad(formation.members);
  const duplicateSlotKeys = findDuplicateSlotKeys(formation.members);
  const validSlotKeys = new Set<string>(BATTLE_FORMATION_SLOT_KEYS);
  const invalidSlotKeys = formation.members
    .map((member) => member.slotKey)
    .filter((slotKey) => !validSlotKeys.has(slotKey));
  const overCapacityBy = Math.max(0, load - capacity.totalCapacity);

  return {
    isValid: overCapacityBy === 0 && duplicateSlotKeys.length === 0 && invalidSlotKeys.length === 0,
    capacity,
    load,
    overCapacityBy,
    duplicateSlotKeys,
    invalidSlotKeys,
  };
}

export function calculateBattleFormationUnitPerformancePercent(
  input: BattleFormationPerformanceInput
): number {
  const rawPercent =
    BATTLE_FORMATION_PERFORMANCE_RULE.basePercent +
    sanitizeNonNegativeNumber(input.unitSkillLevel ?? 0) * BATTLE_FORMATION_PERFORMANCE_RULE.skillPercentPerLevel +
    Math.floor(sanitizeNonNegativeNumber(input.leadership) / BATTLE_FORMATION_PERFORMANCE_RULE.leadershipDivisor);

  return Math.min(BATTLE_FORMATION_PERFORMANCE_RULE.maxPercent, rawPercent);
}

function findDuplicateSlotKeys(members: ReadonlyArray<BattleFormationMember>): BattleFormationSlotKey[] {
  const seenSlotKeys = new Set<BattleFormationSlotKey>();
  const duplicateSlotKeys = new Set<BattleFormationSlotKey>();

  for (const member of members) {
    if (seenSlotKeys.has(member.slotKey)) {
      duplicateSlotKeys.add(member.slotKey);
      continue;
    }

    seenSlotKeys.add(member.slotKey);
  }

  return [...duplicateSlotKeys];
}

function sanitizeNonNegativeNumber(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

function sanitizePositiveNumber(value: number): number {
  return Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 1;
}
