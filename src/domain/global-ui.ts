import type { CharacterId } from "./character";
import type { MissionId } from "./mission";

export type GlobalPanelType = "player-card" | "main-mission" | "resource-bar" | "notifications";
export type GlobalOverlayView = "detail" | "cards" | "valuables" | null;

export type GlobalUIState = {
  visiblePanels: GlobalPanelType[];
  pinnedCharacterId: CharacterId;
  activeMissionId: MissionId | null;
  reviewDateText: string;
  mainHouseMissionText: string;
  overlayView: GlobalOverlayView;
};
