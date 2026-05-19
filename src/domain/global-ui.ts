import type { CharacterId } from "./character";
import type { CardCategory } from "./card";
import type { MissionId } from "./mission";

export type GlobalPanelType = "player-card" | "main-mission" | "resource-bar" | "notifications";
export type GlobalOverlayView = "detail" | "cards" | "valuables" | null;
export type CardLibraryFilter = "all" | CardCategory;
export type ValuableLibraryFilter = "all" | "equipment";
export type ValuableLibrarySortKey = "name" | "price" | "ownedCount" | "category";
export type SortDirection = "asc" | "desc";

export type GlobalUIState = {
  visiblePanels: GlobalPanelType[];
  pinnedCharacterId: CharacterId;
  activeMissionId: MissionId | null;
  reviewDateText: string;
  mainHouseMissionText: string;
  overlayView: GlobalOverlayView;
  cardLibraryFilter: CardLibraryFilter;
  valuableLibraryFilter: ValuableLibraryFilter;
  valuableLibrarySortKey: ValuableLibrarySortKey;
  valuableLibrarySortDirection: SortDirection;
};
