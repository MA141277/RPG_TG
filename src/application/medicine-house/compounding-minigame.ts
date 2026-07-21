import type {
  CompoundingHerbSelection,
  CompoundingSessionTarget,
  MedicineHouseCompoundingGrade,
  MedicineHouseHerbDefinition,
} from "../../domain/medicine-house";
import { pickRandom } from "../../shared/random";
import { getMedicineHouseContentDefaults } from "./medicine-house-content-defaults";

export type CompoundingMixTotals = {
  coldBalance: number;
  heal: number;
  poison: number;
};

export type CompoundingGradeResult = {
  grade: MedicineHouseCompoundingGrade;
  totals: CompoundingMixTotals;
  summaryLines: string[];
  reward: ReturnType<typeof getMedicineHouseContentDefaults>["medicineHouseCompoundingGradeRewards"]["S"];
};

function sumSelections(
  selections: CompoundingHerbSelection[],
  herbs: MedicineHouseHerbDefinition[]
): CompoundingMixTotals {
  return selections.reduce<CompoundingMixTotals>(
    (totals, selection) => {
      const herb = herbs.find((entry) => entry.id === selection.herbId);
      if (herb == null || selection.amount <= 0) {
        return totals;
      }

      return {
        coldBalance:
          totals.coldBalance + (herb.cold - herb.heat) * selection.amount,
        heal: totals.heal + herb.heal * selection.amount,
        poison: totals.poison + herb.poison * selection.amount,
      };
    },
    { coldBalance: 0, heal: 0, poison: 0 }
  );
}

export function getCompoundingLimits(medicineSkill: number): {
  maxTurns: number;
  durationSec: number;
  herbCount: number;
} {
  const {
    medicineHouseCompoundingBaseDurationSec,
    medicineHouseCompoundingBaseTurns,
    medicineHouseHerbCatalog,
  } = getMedicineHouseContentDefaults();
  const tier = Math.max(0, Math.floor(medicineSkill / 3));
  return {
    maxTurns: medicineHouseCompoundingBaseTurns + tier,
    durationSec: medicineHouseCompoundingBaseDurationSec + tier * 10,
    herbCount: Math.min(medicineHouseHerbCatalog.length, 4 + tier * 2),
  };
}

export function pickCompoundingTarget(medicineSkill: number): CompoundingSessionTarget {
  const { medicineHouseAilmentTargets } = getMedicineHouseContentDefaults();
  const tier = Math.max(0, Math.floor(medicineSkill / 4));
  const pool = medicineHouseAilmentTargets.filter((_, index) => index <= 2 + tier);
  return pickRandom(pool.length > 0 ? pool : medicineHouseAilmentTargets);
}

export function getAvailableHerbsForSkill(
  medicineSkill: number
): MedicineHouseHerbDefinition[] {
  const { medicineHouseHerbCatalog } = getMedicineHouseContentDefaults();
  const { herbCount } = getCompoundingLimits(medicineSkill);
  return medicineHouseHerbCatalog.slice(0, herbCount);
}

export function resolveCompoundingGrade(
  target: CompoundingSessionTarget,
  selections: CompoundingHerbSelection[],
  herbs: MedicineHouseHerbDefinition[]
): CompoundingGradeResult {
  const { medicineHouseCompoundingGradeRewards } = getMedicineHouseContentDefaults();
  const totals = sumSelections(selections, herbs);
  const coldDelta = Math.abs(totals.coldBalance - target.coldRequired);
  const healDelta = Math.abs(totals.heal - target.healRequired);
  const poisonOverflow = Math.max(0, totals.poison - target.maxPoison);

  const score =
    coldDelta * 2 + healDelta + poisonOverflow * 4;

  const grade: MedicineHouseCompoundingGrade =
    score <= 1
      ? "S"
      : score <= 3
        ? "A"
        : score <= 5
          ? "B"
          : score <= 8
            ? "C"
            : "D";

  return {
    grade,
    totals,
    summaryLines: [
      `症候：${target.ailmentName}`,
      `寒性 ${totals.coldBalance} / 目标 ${target.coldRequired}`,
      `药效 ${totals.heal} / 目标 ${target.healRequired}`,
      `毒性 ${totals.poison} / 上限 ${target.maxPoison}`,
    ],
    reward: medicineHouseCompoundingGradeRewards[grade],
  };
}

export function addHerbSelection(
  selections: CompoundingHerbSelection[],
  herbId: string,
  amount = 1
): CompoundingHerbSelection[] {
  const existing = selections.find((entry) => entry.herbId === herbId);
  if (existing == null) {
    return [...selections, { herbId, amount }];
  }

  return selections.map((entry) =>
    entry.herbId === herbId
      ? { ...entry, amount: entry.amount + amount }
      : entry
  );
}
