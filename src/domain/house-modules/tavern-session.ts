import type { TavernWorkOffer } from "../tavern";

export type TavernAlertOverlayState = {
  type: "alert";
  title: string;
  paragraphs: string[];
  tone?: "info" | "success" | "warning";
};

export type TavernDrinkConfirmOverlayState = {
  type: "drink-confirm";
  title: string;
  price: number;
  paragraphs: string[];
  confirmActionId: string;
  cancelActionId: string;
};

export type TavernGambleOverlayState = {
  type: "gamble";
  title: string;
  wager: number;
  options: number[];
  incrementActionId: string;
  decrementActionId: string;
  confirmActionId: string;
  cancelActionId: string;
};

export type TavernOverlayState =
  | TavernAlertOverlayState
  | TavernDrinkConfirmOverlayState
  | TavernGambleOverlayState
  | null;

export type TavernDialoguePhase = "greeting" | "open" | "idle";

export type TavernSessionState = {
  selectedOfferId: string | null;
  selectedActorId: string | null;
  dialogueLines: string[];
  dialoguePhase: TavernDialoguePhase;
  overlay: TavernOverlayState;
  currentWager: number;
  availableOffers: TavernWorkOffer[];
};
