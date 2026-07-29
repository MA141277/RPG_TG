import type { GrainShopSessionState } from "../../../domain/house-modules/grain-shop-session";

export function createInitialGrainShopSessionState(
  npcGreeting: string,
  npcDefaultLine: string
): GrainShopSessionState {
  return {
    npcGreeting,
    npcDefaultLine,
    dialogueLines: npcGreeting.length > 0 ? [npcGreeting] : [],
    dialoguePhase: "greeting",
    overlay: null,
  };
}
