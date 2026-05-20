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
};

export type GrainShopOverlayState =
  | GrainShopAlertOverlayState
  | GrainShopTradeOverlayState
  | GrainShopMinigameOverlayState
  | GrainShopResultOverlayState
  | null;

export type GrainShopDialoguePhase = "greeting" | "open" | "idle";

export type GrainShopSessionState = {
  npcGreeting: string;
  npcDefaultLine: string;
  dialoguePhase: GrainShopDialoguePhase;
  overlay: GrainShopOverlayState;
};
