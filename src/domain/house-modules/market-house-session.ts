import type { MarketShopType } from "../trade-good";

export type MarketHouseAlertOverlayState = {
  type: "alert";
  title: string;
  paragraphs: string[];
  tone?: "info" | "success" | "warning";
};

export type MarketHouseOverlayState = MarketHouseAlertOverlayState | null;

export type MarketHouseDialoguePhase = "greeting" | "open" | "idle";

export type MarketHouseSessionState = {
  selectedShopType: MarketShopType;
  dialogueLines: string[];
  dialoguePhase: MarketHouseDialoguePhase;
  overlay: MarketHouseOverlayState;
};
