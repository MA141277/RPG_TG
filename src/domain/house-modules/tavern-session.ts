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

export type TavernSubmitConfirmOverlayState = {
  type: "submit-confirm";
  offerId: string;
  title: string;
  paragraphs: string[];
  confirmActionId: string;
  cancelActionId: string;
};

export type TavernQteOverlayState = {
  type: "qte-bar";
  offerId: string;
  taskLabel: string;
  round: number;
  totalRounds: number;
  successes: number;
  markerPercent: number;
  markerDirection: 1 | -1;
  targetStartPercent: number;
  targetWidthPercent: number;
};

export type TavernResultOverlayState = {
  type: "result";
  title: string;
  grade: string;
  score: number;
  rewardLines: string[];
};

export type TavernOverlayState =
  | TavernAlertOverlayState
  | TavernDrinkConfirmOverlayState
  | TavernGambleOverlayState
  | TavernSubmitConfirmOverlayState
  | TavernQteOverlayState
  | TavernResultOverlayState
  | null;

export type TavernDialoguePhase = "greeting" | "open" | "idle";
export type TavernWorkPanelMode = "closed" | "main" | "accept" | "submit";

export type TavernSessionState = {
  selectedOfferId: string | null;
  selectedSubmitOfferId: string | null;
  selectedActorId: string | null;
  dialogueLines: string[];
  dialoguePhase: TavernDialoguePhase;
  workPanelMode: TavernWorkPanelMode;
  overlay: TavernOverlayState;
  currentWager: number;
  availableOffers: TavernWorkOffer[];
  acceptedOffers: TavernWorkOffer[];
};
