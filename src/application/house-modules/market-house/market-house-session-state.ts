import type { MarketHouseSessionState } from "../../../domain/house-modules/market-house-session";

export function createInitialMarketHouseSessionState(
  guestActorIds: string[] = [],
  selectedActorId: string | null = "shopkeeper_qian",
  dialogueLines: string[] = ["市集里人声杂沓，商贩正等你开口。"]
): MarketHouseSessionState {
  return {
    guestActorIds,
    selectedActorId,
    dialogueLines,
    dialoguePhase: "greeting",
    overlay: null,
  };
}
