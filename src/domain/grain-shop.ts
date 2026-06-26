/** 粮铺房屋领域类型与运行时变量键 */

export const GRAIN_SHOP_HOUSE_ID = "house.kulan.grain_shop";
export const GRAIN_SHOP_SHOPKEEPER_ID = "char.kulan_grain_shopkeeper";

export const GRAIN_SHOP_VARIABLE_KEYS = {
  food: "var.grain_shop.food",
  relationship: "var.grain_shop.relationship",
  time: "var.grain_shop.time",
  grainPrice: "var.grain_shop.grain_price",
} as const;

export type GrainShopVariableKey =
  (typeof GRAIN_SHOP_VARIABLE_KEYS)[keyof typeof GRAIN_SHOP_VARIABLE_KEYS];

export const GRAIN_PRICE_MIN = 80;
export const GRAIN_PRICE_MAX = 160;

export type GrainShopTradeMode = "buy" | "sell";

export type LedgerQuestion = {
  bought: number;
  sold: number;
  displayedStock: number;
  isLedgerCorrect: boolean;
};

export type AccountingGrade = "S" | "A" | "B" | "C" | "D";

export type AccountingGradeReward = {
  math: number;
  money: number;
  relationship: number;
};

export type GrainShopPlayerSnapshot = {
  money: number;
  food: number;
  foodDou: number;
  sellableFoodShi: number;
  math: number;
  relationship: number;
  time: number;
  grainPrice: number;
};
