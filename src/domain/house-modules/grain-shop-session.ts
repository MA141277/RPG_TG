import type { HouseActivityConfirmOverlayState } from "../house-activity";
import type {
  AccountingGrade,
  AccountingGradeReward,
  GrainShopTradeMode,
  LedgerQuestion,
} from "../grain-shop";

export type GrainShopAlertOverlayState = {
  type: "alert";
  title: string;
  paragraphs: string[];
  tone?: "info" | "success" | "warning";
};

export type GrainShopTradeOverlayState = {
  type: "trade";
  mode: GrainShopTradeMode;
  quantity: number;
  grainPrice: number;
  tradeTotal: number;
};

export type GrainShopPriceReportRow = {
  cityId: string;
  cityName: string;
  directionLabel: string;
  grainUnit: string;
  sellPrice: number;
  buyPrice: number;
  comparisonLabel: string;
  priceTone: "low" | "high" | "neutral";
  isCurrentCity: boolean;
};

export type GrainShopPriceReportOverlayState = {
  type: "grain-price-report";
  rows: GrainShopPriceReportRow[];
};

export type GrainShopMinigameOverlayState = {
  type: "minigame";
  score: number;
  wrongCount: number;
  secondsLeft: number;
  question: LedgerQuestion;
};

export type GrainShopResultOverlayState = {
  type: "result";
  grade: AccountingGrade;
  score: number;
  reward: AccountingGradeReward;
  durationDays: number;
};

export type GrainShopOverlayState =
  | GrainShopAlertOverlayState
  | HouseActivityConfirmOverlayState
  | GrainShopTradeOverlayState
  | GrainShopPriceReportOverlayState
  | GrainShopMinigameOverlayState
  | GrainShopResultOverlayState
  | null;

export type GrainShopDialoguePhase =
  | "greeting"
  | "open"
  | "idle"
  | "investigation-offer"
  | "investigation-report";

export type GrainShopSessionState = {
  npcGreeting: string;
  npcDefaultLine: string;
  dialogueLines: string[];
  dialoguePhase: GrainShopDialoguePhase;
  overlay: GrainShopOverlayState;
};
