import type {
  TroopEditorResourceSlot,
  TroopListItemViewModel,
  TroopPreviewSlotViewModel,
} from "./troop-editor-stage-view-model";

export type TroopManagementActionViewModel = {
  id: string;
  label: string;
  actionId: string | null;
};

export type TroopManagementSummaryFieldViewModel = {
  id: string;
  label: string;
  valueText: string;
};

export type TroopManagementBattlefieldSlotViewModel = TroopPreviewSlotViewModel & {
  row: number;
  column: number;
};

export type TroopManagementBattlefieldUnitViewModel = {
  id: string;
  label: string;
  role: string | null;
  row: number;
  column: number;
};

export type TroopManagementBattlePreviewMemberViewModel = {
  id: string;
  slotKey: string;
  name: string;
  troopType: string;
  soldiers: number;
  maxSoldiers: number;
};

export type TroopManagementReserveMemberViewModel = {
  id: string;
  name: string;
  roleLabel: string;
};

export type TroopManagementBattlePreviewViewModel = {
  id: string;
  name: string;
  side: "player";
  generalName: string;
  morale: number;
  members: TroopManagementBattlePreviewMemberViewModel[];
};

export type TroopManagementStageViewModel = {
  title: string;
  resources: TroopEditorResourceSlot[];
  troops: TroopListItemViewModel[];
  previousTroopId: string | null;
  nextTroopId: string | null;
  canCycleTroops: boolean;
  selectedTroopId: string;
  troopName: string;
  captainName: string | null;
  captainSlotKey: string | null;
  previewSlots: TroopPreviewSlotViewModel[];
  actions: TroopManagementActionViewModel[];
  summaryFields: TroopManagementSummaryFieldViewModel[];
  battlefieldSlots: TroopManagementBattlefieldSlotViewModel[];
  battlefieldUnits: TroopManagementBattlefieldUnitViewModel[];
  battlePreview: TroopManagementBattlePreviewViewModel;
  reserveMembers: TroopManagementReserveMemberViewModel[];
  reserveCapacity: number;
};
