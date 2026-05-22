import type { TavernWorkOffer } from "../../../domain/tavern";
import type { TavernSessionState } from "../../../domain/house-modules/tavern-session";
import { tavernDefaultWager } from "../../../content/houses/tavern-content";

export function createInitialTavernSessionState(
  availableOffers: TavernWorkOffer[],
  selectedActorId: string,
  dialogueLines: string[],
  dialoguePhase: TavernSessionState["dialoguePhase"] = "greeting"
): TavernSessionState {
  return {
    availableOffers,
    selectedOfferId: null,
    selectedActorId,
    dialogueLines,
    dialoguePhase,
    overlay: null,
    currentWager: tavernDefaultWager,
  };
}
