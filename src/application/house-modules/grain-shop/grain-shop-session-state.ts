import type { GrainShopSessionState } from "../../../domain/house-modules/grain-shop-session";

export function createInitialGrainShopSessionState(
  npcGreeting: string,
  npcDefaultLine: string
): GrainShopSessionState {
  return {
    npcGreeting,
    npcDefaultLine,
    dialoguePhase: "greeting",
    overlay: null,
  };
}
