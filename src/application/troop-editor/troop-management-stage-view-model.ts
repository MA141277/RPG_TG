import type {
  SharedTroopSnapshot,
  TroopEditorResourceSlot,
  TroopReserveMember,
} from "../../domain/troop-editor";
import {
  createTroopListItemViewModel,
  createTroopPreviewSlots,
  getFormationDisplayCoordinates,
  getTroopRoleLabel,
  type TroopListItemViewModel,
  type TroopPreviewSlotViewModel,
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
  previewSlots: TroopPreviewSlotViewModel[];
  actions: TroopManagementActionViewModel[];
  summaryFields: TroopManagementSummaryFieldViewModel[];
  battlefieldSlots: TroopManagementBattlefieldSlotViewModel[];
  battlefieldUnits: TroopManagementBattlefieldUnitViewModel[];
  battlePreview: TroopManagementBattlePreviewViewModel;
  reserveMembers: TroopManagementReserveMemberViewModel[];
  reserveCapacity: number;
};

function createBattlefieldSlots(
  troopSnapshot: SharedTroopSnapshot
): TroopManagementBattlefieldSlotViewModel[] {
  return createTroopPreviewSlots(troopSnapshot).map((slot) => {
    const coordinates = getFormationDisplayCoordinates(slot.slotKey, "player");

    return {
      ...slot,
      row: coordinates.row,
      column: coordinates.col,
    };
  });
}

function createBattlefieldUnits(
  troopSnapshot: SharedTroopSnapshot
): TroopManagementBattlefieldUnitViewModel[] {
  return createTroopPreviewSlots(troopSnapshot)
    .filter((slot) => slot.isOccupied)
    .map((slot) => {
      const coordinates = getFormationDisplayCoordinates(slot.slotKey, "player");

      return {
        id: slot.slotKey,
        label: slot.label,
        role: slot.role,
        row: coordinates.row,
        column: coordinates.col,
      };
    });
}

function mapRoleToBattleTroopType(role: string | null): string {
  if (role === "spearman") {
    return "spear";
  }
  if (role === "archer") {
    return "archer";
  }
  if (role === "cavalry" || role === "light-cavalry" || role === "heavy-cavalry") {
    return "cavalry";
  }
  if (role === "musketeer" || role === "gunpowder" || role === "teppo") {
    return "musketeer";
  }
  return "infantry";
}

function readFirstNumber(valueText: string, fallback: number): number {
  const match = String(valueText).match(/-?\d+/);
  if (match == null) {
    return fallback;
  }

  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function createBattlePreview(
  troopSnapshot: SharedTroopSnapshot,
  summary: {
    moraleText: string;
  }
): TroopManagementBattlePreviewViewModel {
  const occupiedSlots = troopSnapshot.slots.filter((slot) => slot.isOccupied);
  const memberSoldierCount =
    occupiedSlots.length > 0 ? Math.max(1, Math.round(360 / occupiedSlots.length)) : 100;

  return {
    id: troopSnapshot.id,
    name: troopSnapshot.name,
    side: "player",
    generalName: "朱重八",
    morale: readFirstNumber(summary.moraleText, 80),
    members: occupiedSlots.map((slot, index) => ({
      id: `${troopSnapshot.id}:${slot.slotKey}:${index}`,
      slotKey: slot.slotKey,
      name: slot.occupantName ?? "空位",
      troopType: mapRoleToBattleTroopType(slot.occupantRole),
      soldiers: memberSoldierCount,
      maxSoldiers: memberSoldierCount,
    })),
  };
}

function createReserveMemberViewModel(
  reserveMember: TroopReserveMember
): TroopManagementReserveMemberViewModel {
  return {
    id: reserveMember.id,
    name: reserveMember.name,
    roleLabel: getTroopRoleLabel(reserveMember.role),
  };
}

export function createTroopManagementStageViewModel(input: {
  resources: TroopEditorResourceSlot[];
  troopSnapshots: SharedTroopSnapshot[];
  selectedTroopSnapshot: SharedTroopSnapshot;
  reserveMembers: TroopReserveMember[];
  reserveCapacity: number;
  summary: {
    threatLevelText: string;
    movementText: string;
    moraleText: string;
    scaleText: string;
    leaderTraitText: string;
  };
}): TroopManagementStageViewModel {
  const selectedTroopIndex = input.troopSnapshots.findIndex(
    (troop) => troop.id === input.selectedTroopSnapshot.id
  );
  const normalizedSelectedTroopIndex = selectedTroopIndex < 0 ? 0 : selectedTroopIndex;
  const canCycleTroops = input.troopSnapshots.length > 1;
  const previousTroopId = canCycleTroops
    ? input.troopSnapshots[
        (normalizedSelectedTroopIndex - 1 + input.troopSnapshots.length) %
          input.troopSnapshots.length
      ]?.id ?? null
    : null;
  const nextTroopId = canCycleTroops
    ? input.troopSnapshots[
        (normalizedSelectedTroopIndex + 1) % input.troopSnapshots.length
      ]?.id ?? null
    : null;

  return {
    title: "队伍管理",
    resources: input.resources,
    troops: input.troopSnapshots.map(createTroopListItemViewModel),
    previousTroopId,
    nextTroopId,
    canCycleTroops,
    selectedTroopId: input.selectedTroopSnapshot.id,
    troopName: input.selectedTroopSnapshot.name,
    previewSlots: createTroopPreviewSlots(input.selectedTroopSnapshot),
    actions: [
      { id: "move", label: "移动单位", actionId: null },
      { id: "add", label: "增加单位", actionId: null },
      { id: "remove", label: "移除单位", actionId: null },
      { id: "clear", label: "清空队伍", actionId: null },
      { id: "disband", label: "解散队伍", actionId: null },
      { id: "back", label: "返回队伍总览", actionId: "close-troop-management" },
    ],
    summaryFields: [
      { id: "threat", label: "威胁等级", valueText: input.summary.threatLevelText },
      { id: "movement", label: "移动", valueText: input.summary.movementText },
      { id: "morale", label: "士气", valueText: input.summary.moraleText },
      { id: "scale", label: "规模", valueText: input.summary.scaleText },
      { id: "leader-trait", label: "领袖特性", valueText: input.summary.leaderTraitText },
    ],
    battlefieldSlots: createBattlefieldSlots(input.selectedTroopSnapshot),
    battlefieldUnits: createBattlefieldUnits(input.selectedTroopSnapshot),
    battlePreview: createBattlePreview(input.selectedTroopSnapshot, {
      moraleText: input.summary.moraleText,
    }),
    reserveMembers: input.reserveMembers.map(createReserveMemberViewModel),
    reserveCapacity: input.reserveCapacity,
  };
}
