import type {
  CompoundingSessionTarget,
  MedicineHouseHerbDefinition,
  MedicineHousePreparedMedicineEffect,
} from "../../../domain/medicine-house";
import { defaultRuntimeContent } from "../../content/default-runtime-content";
import { getHouseModuleDefaults } from "../../content/house-module-defaults";

export type MedicineHousePreparedMedicineDefinition = {
  id: string;
  name: string;
  type: "heal" | "fatigue" | "detox";
  price: number;
  effect: MedicineHousePreparedMedicineEffect;
};

export type MedicineHouseContentDefaults = {
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

const FALLBACK_MEDICINE_HOUSE_CONTENT: MedicineHouseContentDefaults = {
  medicineHouseDoctorProfile: {
    actorId: "char.kulan_medicine_doctor",
    name: "Medicine Doctor",
    title: "Medicine Doctor",
    personality: "steady",
    specialty: "medicine",
    favorability: 0,
  },
  medicineHouseDialogueTextIds: [
    "runtime.zhu_yuanzhang.medicine_house.dialogue.001",
    "runtime.zhu_yuanzhang.medicine_house.dialogue.002",
    "runtime.zhu_yuanzhang.medicine_house.dialogue.003",
    "runtime.zhu_yuanzhang.medicine_house.dialogue.004",
  ],
  medicineHouseGreetingTextIds: [
    "runtime.zhu_yuanzhang.medicine_house.greeting.001",
    "runtime.zhu_yuanzhang.medicine_house.greeting.002",
  ],
  medicineHouseOpenTextIds: ["runtime.zhu_yuanzhang.medicine_house.open.001"],
  medicineHouseHealService: {
    cost: 50,
    fatigueRecovery: 30,
  },
  medicineHousePreparedMedicines: [
    {
      id: "medicine_heal_001",
      name: "Healing Medicine",
      type: "heal",
      price: 80,
      effect: { hp: 30 },
    },
    {
      id: "medicine_fatigue_001",
      name: "Calming Decoction",
      type: "fatigue",
      price: 60,
      effect: { fatigue: 20 },
    },
    {
      id: "medicine_poison_001",
      name: "Detox Medicine",
      type: "detox",
      price: 120,
      effect: { poison: -25 },
    },
  ],
  medicineHouseHerbCatalog: [
    {
      id: "herb_ai_cao",
      name: "Mugwort",
      cold: 0,
      heat: 2,
      poison: 0,
      heal: 1,
    },
    {
      id: "herb_huang_lian",
      name: "Coptis",
      cold: 3,
      heat: 0,
      poison: 1,
      heal: 2,
    },
    {
      id: "herb_sheng_jiang",
      name: "Fresh Ginger",
      cold: 0,
      heat: 2,
      poison: 0,
      heal: 1,
    },
    {
      id: "herb_bo_he",
      name: "Mint",
      cold: 2,
      heat: 0,
      poison: 0,
      heal: 1,
    },
    {
      id: "herb_dang_gui",
      name: "Angelica",
      cold: 0,
      heat: 1,
      poison: 0,
      heal: 3,
    },
    {
      id: "herb_xing_ren",
      name: "Apricot Kernel",
      cold: 1,
      heat: 0,
      poison: 0,
      heal: 2,
    },
    {
      id: "herb_gan_cao",
      name: "Licorice",
      cold: 0,
      heat: 0,
      poison: -1,
      heal: 2,
    },
    {
      id: "herb_wu_tou",
      name: "Aconite",
      cold: 0,
      heat: 1,
      poison: 3,
      heal: 4,
    },
  ],
  medicineHouseAilmentTargets: [
    {
      ailmentId: "wind_cold",
      ailmentName: "Wind Cold",
      coldRequired: 2,
      healRequired: 5,
      maxPoison: 1,
    },
    {
      ailmentId: "inner_heat",
      ailmentName: "Inner Heat",
      coldRequired: -2,
      healRequired: 4,
      maxPoison: 1,
    },
    {
      ailmentId: "trauma",
      ailmentName: "Trauma",
      coldRequired: 0,
      healRequired: 6,
      maxPoison: 0,
    },
    {
      ailmentId: "damp_toxin",
      ailmentName: "Damp Toxin",
      coldRequired: 1,
      healRequired: 5,
      maxPoison: 2,
    },
    {
      ailmentId: "miasma",
      ailmentName: "Miasma",
      coldRequired: 2,
      healRequired: 7,
      maxPoison: 1,
    },
  ],
  medicineHouseCompoundingBaseTurns: 5,
  medicineHouseCompoundingBaseDurationSec: 45,
  medicineHouseCompoundingGradeRewards: {
    S: { medicine: 3, relationship: 3 },
    A: { medicine: 2, relationship: 2 },
    B: { medicine: 1, relationship: 1 },
    C: { medicine: 0, relationship: 1 },
    D: { medicine: 0, relationship: -1 },
  },
};

export function getMedicineHouseContentDefaults(): MedicineHouseContentDefaults {
  return (
    getHouseModuleDefaults<MedicineHouseContentDefaults>(
      defaultRuntimeContent.houseModuleDefaults,
      "medicine-house"
    ) ?? FALLBACK_MEDICINE_HOUSE_CONTENT
  );
}
