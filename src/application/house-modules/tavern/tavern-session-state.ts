import type { TavernWorkOffer } from "../../../domain/tavern";
import type { TavernSessionState } from "../../../domain/house-modules/tavern-session";
import { tavernDefaultWager } from "../../../content/houses/tavern-content";

export function createInitialTavernSessionState(
  availableOffers: TavernWorkOffer[],
  acceptedOffers: TavernWorkOffer[],
  selectedActorId: string,
  dialogueLines: string[],
  dialoguePhase: TavernSessionState["dialoguePhase"] = "greeting"
): TavernSessionState {
  return {
    availableOffers,
    acceptedOffers,
    selectedOfferId: null,
    selectedSubmitOfferId: null,
    selectedActorId,
    dialogueLines,
    dialoguePhase,
    workPanelMode: "closed",
    overlay: null,
    currentWager: tavernDefaultWager,
    currentGambleVariant: "short",
    gambleSession: null,
  };
}
