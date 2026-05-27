import type { MedicineHouseSessionState } from "../../../domain/house-modules/medicine-house-session";

export function createInitialMedicineHouseSessionState(
  npcGreeting: string
): MedicineHouseSessionState {
  return {
    npcGreeting,
    dialoguePhase: "greeting",
    overlay: null,
  };
}
