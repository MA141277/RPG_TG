import type {
  SharedTroopSnapshot,
  TroopEditorMenuItem,
  TroopEditorResourceSlot,
  TroopReserveMember,
  TroopShopOffer,
} from "../../domain/troop-editor";
import {
  BATTLE_FORMATION_SLOT_KEYS,
  type BattleFormationColumn,
  type BattleFormationRow,
  type BattleFormationSlotKey,
} from "../../domain/battle-formation";
import { assertExists } from "../../shared/assert";

export type TroopPreviewSlotViewModel = {
  slotKey: BattleFormationSlotKey;
  label: string;
  role: string | null;
  isOccupied: boolean;
  isCaptain: boolean;
};

export type TroopListItemViewModel = {
  id: string;
  name: string;
  subtitle: string;
  slots: TroopPreviewSlotViewModel[];
};

export type TroopReserveMemberViewModel = {
  id: string;
  name: string;
  roleLabel: string;
};

export type TroopShopOfferViewModel = {
  id: string;
  name: string;
  roleLabel: string;
  price: number;
  priceText: string;
  requiredFame: number;
  requiredFameText: string;
};

export type TroopCreateCaptainOptionViewModel = {
  id: string;
  name: string;
  roleLabel: string;
};

export type TroopEditorStageViewModel = {
  title: string;
  resources: TroopEditorResourceSlot[];
  troops: TroopListItemViewModel[];
  createCaptainOptions: TroopCreateCaptainOptionViewModel[];
  reserveMembers: TroopReserveMemberViewModel[];
  shopOffers: TroopShopOfferViewModel[];
  menu: TroopEditorMenuItem[];
  selectedTroopId: string | null;
  selectedMenuId: string | null;
  reserveCount: number;
  reserveCapacity: number;
  playerGold: number;
  playerFame: number;
};

export type BattleFormationPreviewViewModel = {
  teamId: string;
  teamName: string;
  slots: TroopPreviewSlotViewModel[];
};

const FORMATION_SLOT_ROW_NAMES = ["front", "middle", "rear"] as const satisfies BattleFormationRow[];
const FORMATION_SLOT_COL_NAMES = ["left", "center", "right"] as const satisfies BattleFormationColumn[];

function getFormationSlotIndices(slotKey: BattleFormationSlotKey) {
  const [rowName, columnName] = slotKey.split("-") as [
    BattleFormationRow,
    BattleFormationColumn,
  ];
  return {
    row: FORMATION_SLOT_ROW_NAMES.indexOf(rowName),
    col: FORMATION_SLOT_COL_NAMES.indexOf(columnName),
  };
}

function buildFormationSlotKey(row: number, col: number): BattleFormationSlotKey {
  const rowName = FORMATION_SLOT_ROW_NAMES[row];
  const columnName = FORMATION_SLOT_COL_NAMES[col];
  assertExists(rowName, `Invalid formation row index "${row}".`);
  assertExists(columnName, `Invalid formation column index "${col}".`);
  return `${rowName}-${columnName}`;
}

function rotateFormationPanelSlotKey(
  slotKey: BattleFormationSlotKey,
  side: "player" | "enemy" | "neutral" = "player"
): BattleFormationSlotKey {
  const { row, col } = getFormationSlotIndices(slotKey);

  if (side === "player") {
    return buildFormationSlotKey(2 - col, row);
  }

  if (side === "enemy") {
    return buildFormationSlotKey(col, 2 - row);
  }

  return slotKey;
}

function getFormationPanelDisplaySlotKeys(
  side: "player" | "enemy" | "neutral" = "player"
): BattleFormationSlotKey[] {
  return BATTLE_FORMATION_SLOT_KEYS.map((slotKey) =>
    rotateFormationPanelSlotKey(slotKey, side)
  );
}

export function getFormationDisplayCoordinates(
  slotKey: BattleFormationSlotKey,
  side: "player" | "enemy" | "neutral" = "player"
) {
  const rotatedSlotKey = rotateFormationPanelSlotKey(slotKey, side);
  return getFormationSlotIndices(rotatedSlotKey);
}

export function createTroopPreviewSlots(
  troopSnapshot: SharedTroopSnapshot,
  side: "player" | "enemy" | "neutral" = "player"
): TroopPreviewSlotViewModel[] {
  const slotSnapshotMap = new Map(
    troopSnapshot.slots.map((slot) => [slot.slotKey, slot] as const)
  );

  return getFormationPanelDisplaySlotKeys(side).map((slotKey) => {
    const slot = slotSnapshotMap.get(slotKey);

    return {
      slotKey,
      label: slot?.occupantName ?? "空位",
      role: slot?.occupantRole ?? null,
      isOccupied: slot?.isOccupied ?? false,
      isCaptain: slot?.isCaptain ?? false,
    };
  });
}

export function createTroopListItemViewModel(
  troopSnapshot: SharedTroopSnapshot
): TroopListItemViewModel {
  return {
    id: troopSnapshot.id,
    name: troopSnapshot.name,
    subtitle: troopSnapshot.subtitle,
    slots: createTroopPreviewSlots(troopSnapshot),
  };
}

export function getTroopRoleLabel(role: string | null): string {
  if (role === "militia") {
    return "民兵";
  }
  if (role === "scout") {
    return "斥候";
  }
  if (role === "infantry") {
    return "剑士";
  }
  if (role === "spearman") {
    return "枪兵";
  }
  if (role === "archer") {
    return "弓箭手";
  }
  if (role === "crossbow") {
    return "弩兵";
  }
  if (role === "teppo" || role === "gunpowder" || role === "musketeer") {
    return "火枪手";
  }
  if (role === "light-cavalry") {
    return "轻骑兵";
  }
  if (role === "heavy-cavalry" || role === "cavalry") {
    return "骑兵";
  }
  if (role === "elite-infantry") {
    return "精锐步兵";
  }
  if (role === "guard") {
    return "亲卫";
  }
  if (role === "siege") {
    return "攻城兵";
  }
  if (role === "support") {
    return "辅兵";
  }
  return "步兵";
}

function createShopOfferViewModel(offer: TroopShopOffer): TroopShopOfferViewModel {
  return {
    id: offer.id,
    name: offer.name,
    roleLabel: getTroopRoleLabel(offer.role),
    price: offer.price,
    priceText: `${offer.price} 文`,
    requiredFame: offer.requiredFame,
    requiredFameText: `${offer.requiredFame}`,
  };
}

export function createTroopEditorStageViewModel(input: {
  resources: TroopEditorResourceSlot[];
  troopSnapshots: SharedTroopSnapshot[];
  reserveMembers?: TroopReserveMember[];
  shopOffers?: TroopShopOffer[];
  reserveCount?: number;
  reserveCapacity?: number;
  selectedTroopId?: string | null;
  playerGold?: number;
  playerFame?: number;
}): TroopEditorStageViewModel {
  const reserveMembers = input.reserveMembers ?? [];
  const shopOffers = input.shopOffers ?? [];

  return {
    title: "队伍编辑",
    resources: input.resources,
    troops: input.troopSnapshots.map(createTroopListItemViewModel),
    createCaptainOptions: reserveMembers.map((member) => ({
      id: member.id,
      name: member.name,
      roleLabel: getTroopRoleLabel(member.role),
    })),
    reserveMembers: reserveMembers.map((member) => ({
      id: member.id,
      name: member.name,
      roleLabel: getTroopRoleLabel(member.role),
    })),
    shopOffers: shopOffers.map(createShopOfferViewModel),
    menu: [
      { id: "manage", label: "队伍管理", actionId: "open-troop-management" },
      { id: "disband", label: "解散队伍", actionId: null },
      { id: "create", label: "组建队伍", actionId: null },
      { id: "sort", label: "排序队伍", actionId: null },
      { id: "dismiss", label: "解雇单位", actionId: null },
      { id: "recruit", label: "招兵买马", actionId: null },
      { id: "exit", label: "退出", actionId: "close-troop-editor" },
    ],
    selectedTroopId:
      input.selectedTroopId != null &&
      input.troopSnapshots.some((troop) => troop.id === input.selectedTroopId)
        ? input.selectedTroopId
        : (input.troopSnapshots[0]?.id ?? null),
    selectedMenuId: "manage",
    reserveCount: input.reserveCount ?? reserveMembers.length,
    reserveCapacity: input.reserveCapacity ?? reserveMembers.length,
    playerGold: input.playerGold ?? 0,
    playerFame: input.playerFame ?? 0,
  };
}

export function createBattleTroopPreviewViewModel(
  troopSnapshot: SharedTroopSnapshot | null
): BattleFormationPreviewViewModel | null {
  if (troopSnapshot == null) {
    return null;
  }

  return {
    teamId: troopSnapshot.id,
    teamName: troopSnapshot.name,
    slots: createTroopPreviewSlots(troopSnapshot),
  };
}
