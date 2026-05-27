import type {
  CompoundingHerbSelection,
  CompoundingSessionTarget,
  MedicineHouseCompoundingGrade,
  MedicineHouseHerbDefinition,
} from "../medicine-house";

export type MedicineHouseAlertOverlayState = {
  type: "alert";
  title: string;
  paragraphs: string[];
  tone?: "info" | "success" | "warning";
};

export type MedicineHouseBuyOverlayState = {
  type: "buy";
  selectedItemId: string | null;
};

export type MedicineHouseCompoundingOverlayState = {
  type: "compounding";
  target: CompoundingSessionTarget;
  availableHerbs: MedicineHouseHerbDefinition[];
  selections: CompoundingHerbSelection[];
  selectionsLeft: number;
  secondsLeft: number;
};

export type MedicineHouseResultOverlayState = {
  type: "result";
  grade: MedicineHouseCompoundingGrade;
  summaryLines: string[];
  rewardLines: string[];
};

export type MedicineHouseOverlayState =
  | MedicineHouseAlertOverlayState
  | MedicineHouseBuyOverlayState
  | MedicineHouseCompoundingOverlayState
  | MedicineHouseResultOverlayState
  | null;

export type MedicineHouseDialoguePhase = "greeting" | "open" | "idle";

export type MedicineHouseSessionState = {
  npcGreeting: string;
  dialoguePhase: MedicineHouseDialoguePhase;
  overlay: MedicineHouseOverlayState;
};
