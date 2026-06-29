import type {
  CompoundingSessionTarget,
  MedicineHouseHerbDefinition,
  MedicineHousePreparedMedicineEffect,
} from "../../domain/medicine-house";
import * as medicineHouseContentJson from "../scenario-packs/zhuyuanzhang/house-content/medicine-house-content.json";

type MedicineHousePreparedMedicineDefinition = {
  id: string;
  name: string;
  type: "heal" | "fatigue" | "detox";
  price: number;
  effect: MedicineHousePreparedMedicineEffect;
};

type MedicineHouseContent = {
  medicineHouseDoctorProfile: {
    actorId: string;
    name: string;
    title: string;
    personality: string;
    specialty: string;
    favorability: number;
  };
  medicineHouseDialogueTextIds: string[];
  medicineHouseGreetingTextIds: string[];
  medicineHouseOpenTextIds: string[];
  medicineHouseHealService: {
    cost: number;
    fatigueRecovery: number;
  };
  medicineHousePreparedMedicines: MedicineHousePreparedMedicineDefinition[];
  medicineHouseHerbCatalog: MedicineHouseHerbDefinition[];
  medicineHouseAilmentTargets: CompoundingSessionTarget[];
  medicineHouseCompoundingBaseTurns: number;
  medicineHouseCompoundingBaseDurationSec: number;
  medicineHouseCompoundingGradeRewards: Record<
    "S" | "A" | "B" | "C" | "D",
    { medicine: number; relationship: number }
  >;
};

const medicineHouseContent =
  ((medicineHouseContentJson as { default?: MedicineHouseContent }).default ??
    medicineHouseContentJson) as MedicineHouseContent;

export const medicineHouseDoctorProfile = medicineHouseContent.medicineHouseDoctorProfile;
export const medicineHouseDialogueTextIds = medicineHouseContent.medicineHouseDialogueTextIds;
export const medicineHouseGreetingTextIds = medicineHouseContent.medicineHouseGreetingTextIds;
export const medicineHouseOpenTextIds = medicineHouseContent.medicineHouseOpenTextIds;
export const medicineHouseHealService = medicineHouseContent.medicineHouseHealService;
export const medicineHousePreparedMedicines =
  medicineHouseContent.medicineHousePreparedMedicines;
export const medicineHouseHerbCatalog = medicineHouseContent.medicineHouseHerbCatalog;
export const medicineHouseAilmentTargets = medicineHouseContent.medicineHouseAilmentTargets;
export const medicineHouseCompoundingBaseTurns =
  medicineHouseContent.medicineHouseCompoundingBaseTurns;
export const medicineHouseCompoundingBaseDurationSec =
  medicineHouseContent.medicineHouseCompoundingBaseDurationSec;
export const medicineHouseCompoundingGradeRewards =
  medicineHouseContent.medicineHouseCompoundingGradeRewards;

export type { MedicineHousePreparedMedicineDefinition };
