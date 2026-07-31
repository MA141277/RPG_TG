export type MarketHouseAlertOverlayState = {
  type: "alert";
  title: string;
  paragraphs: string[];
  tone?: "info" | "success" | "warning";
};

export type MarketHouseTradeOverlayState = {
  type: "market-trade";
  mode: "buy" | "sell";
  selectedGoodsId: string | null;
  quantity: number;
};

export type MarketHouseOverlayState =
  | MarketHouseAlertOverlayState
  | MarketHouseTradeOverlayState
  | null;

export type MarketHouseDialoguePhase =
  | "greeting"
  | "open"
  | "idle"
  | "investigation-report";

export type MarketHouseSessionState = {
  guestActorIds: string[];
  selectedActorId: string | null;
  dialogueLines: string[];
  dialoguePhase: MarketHouseDialoguePhase;
  overlay: MarketHouseOverlayState;
};
