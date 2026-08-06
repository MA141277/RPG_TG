import type { HouseActivityConfirmOverlayState } from "../house-activity";
import type { TavernWorkOffer } from "../tavern";
import type { TavernGambleSession, TavernGambleVariant } from "../tavern-gambling";
import type {
  TavernShortDebugHandPreset,
  TavernShortHandState,
} from "../tavern-short-gambling";

export type TavernShortTableDebugPresetMode = "off" | "claim-cycle";
export type TavernPendingShortDebugPreset = "claim-chow-then-kong" | null;
export type TavernGambleChoiceOptionId =
  | TavernGambleVariant
  | "short-debug-chow-kong";

export type TavernShortClaimCountdownState = {
  totalSeconds: number;
  startedAtEpochMs: number;
  expiresAtEpochMs: number;
};

export type TavernAlertOverlayState = {
  type: "alert";
  title: string;
  paragraphs: string[];
  tone?: "info" | "success" | "warning";
  deferredReward?: {
    type: "coin-reward";
    playerCharacterId: string;
    delta: number;
    source: "request-pointer";
  };
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
  variant: TavernGambleVariant;
  variantLabel: string;
  wager: number;
  options: number[];
  incrementActionId: string;
  decrementActionId: string;
  confirmActionId: string;
  cancelActionId: string;
  debugToggle?: {
    actionId: string;
    label: string;
    helperText: string;
  } | null;
};

export type TavernGambleChoiceOverlayState = {
  type: "gamble-choice";
  title: string;
  options: Array<{
    id: TavernGambleChoiceOptionId;
    label: string;
    description: string;
    actionId: string;
  }>;
  cancelActionId: string;
};

export type TavernShortCompletedHand = {
  handNumber: number;
  hand: TavernShortHandState;
};

export type TavernShortTableSessionPrompt =
  | "continue-or-cashout"
  | "rebuy-or-cashout";

export type TavernShortTableSession = {
  variant: "short";
  playerSeatId: string;
  debugPresetMode: TavernShortTableDebugPresetMode;
  firstHandDebugPreset: TavernShortDebugHandPreset | null;
  claimCountdown: TavernShortClaimCountdownState | null;
  bankrollBySeatId: Record<string, number>;
  npcBaselineChips: number;
  dealerSeatIndex: number;
  handCount: number;
  buyInGoldTotal: number;
  currentHand: TavernShortHandState | null;
  lastCompletedHand: TavernShortCompletedHand | null;
  prompt: TavernShortTableSessionPrompt | null;
  staminaCharged: boolean;
};

export type TavernActiveGambleSession =
  | {
      variant: "long";
      session: TavernGambleSession;
    }
  | {
      variant: "short";
      table: TavernShortTableSession;
    };

export type TavernGambleTableOverlayState = {
  type: "gamble-table";
  session: TavernActiveGambleSession;
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
  | HouseActivityConfirmOverlayState
  | TavernDrinkConfirmOverlayState
  | TavernGambleChoiceOverlayState
  | TavernGambleOverlayState
  | TavernGambleTableOverlayState
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
  currentGambleVariant: TavernGambleVariant;
  pendingShortDebugPreset: TavernPendingShortDebugPreset;
  shortDebugPresetMode: TavernShortTableDebugPresetMode;
  gambleSession: TavernActiveGambleSession | null;
  availableOffers: TavernWorkOffer[];
  acceptedOffers: TavernWorkOffer[];
};
