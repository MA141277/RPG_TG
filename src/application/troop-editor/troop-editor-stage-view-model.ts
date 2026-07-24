export type TroopPreviewSlotViewModel = {
  slotKey: string;
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

export type TroopEditorResourceSlot = {
  id: string;
  label: string;
  valueText: string;
};

export type TroopEditorMenuItem = {
  id: string;
  label: string;
  actionId: string | null;
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
