import type { CharacterId } from "./character";
import type { CardCategory } from "./card";
import type { ActiveHouseModuleSession } from "./house-module";
import type { BackpackItemCategoryFilter } from "./item";
import type { MissionId } from "./mission";
import type { NpcInteractionSession } from "./npc-interaction";

export type GlobalPanelType = "player-card" | "main-mission" | "resource-bar" | "notifications";
export type GlobalOverlayView = "detail" | "cards" | "valuables" | "backpack" | null;
export type CardLibraryFilter = "all" | CardCategory;
export type ValuableLibraryFilter = "all" | "equipment";
export type ValuableLibrarySortKey = "name" | "price" | "ownedCount" | "category";
export type SortDirection = "asc" | "desc";

export type GlobalUIState = {
  visiblePanels: GlobalPanelType[];
  pinnedCharacterId: CharacterId;
  detailCharacterId: CharacterId | null;
  isCharacterAbilityDetailOpen: boolean;
  selectedTroopId: string | null;
  activeMissionId: MissionId | null;
  reviewDateText: string;
  mainHouseMissionText: string;
  overlayView: GlobalOverlayView;
  cardLibraryFilter: CardLibraryFilter;
  backpackLibraryFilter: BackpackItemCategoryFilter;
  selectedBackpackItemId: string | null;
  valuableLibraryFilter: ValuableLibraryFilter;
  valuableLibrarySortKey: ValuableLibrarySortKey;
  valuableLibrarySortDirection: SortDirection;
  houseSession: ActiveHouseModuleSession;
  npcInteractionSession: NpcInteractionSession;
};
