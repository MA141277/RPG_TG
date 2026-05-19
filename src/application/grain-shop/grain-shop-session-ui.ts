import type {
  AccountingGrade,
  AccountingGradeReward,
  GrainShopTradeMode,
  LedgerQuestion,
} from "../../domain/grain-shop";

export type GrainShopAlertOverlay = {
  type: "alert";
  title: string;
  bodyHtml: string;
};

export type GrainShopTradeOverlay = {
  type: "trade";
  mode: GrainShopTradeMode;
  quantity: number;
  grainPrice: number;
  tradeTotal: number;
};

export type GrainShopMinigameOverlay = {
  type: "minigame";
  score: number;
  wrongCount: number;
  secondsLeft: number;
  question: LedgerQuestion;
};

export type GrainShopResultOverlay = {
  type: "result";
  grade: AccountingGrade;
  score: number;
  reward: AccountingGradeReward;
};

export type GrainShopOverlay =
  | null
  | GrainShopAlertOverlay
  | GrainShopTradeOverlay
  | GrainShopMinigameOverlay
  | GrainShopResultOverlay;

export type GrainShopDialoguePhase = "greeting" | "open" | "idle";

export type GrainShopSessionUi = {
  npcGreeting: string;
  npcDefaultLine: string;
  dialoguePhase: GrainShopDialoguePhase;
  overlay: GrainShopOverlay;
};

export function createInitialGrainShopSessionUi(
  npcGreeting: string,
  npcDefaultLine: string
): GrainShopSessionUi {
  return {
    npcGreeting,
    npcDefaultLine,
    dialoguePhase: "greeting",
    overlay: null,
  };
}
