import type { AccountingGrade, AccountingGradeReward } from "../../domain/grain-shop";
import { defaultRuntimeContent } from "../content/default-runtime-content";
import { getHouseModuleDefaults } from "../content/house-module-defaults";

export type GrainShopContentDefaults = {
  grainShopNpcGreetingTextIds: string[];
  grainShopNpcDefaultLineTextIds: string[];
  grainShopMarketRumorTextIds: string[];
  grainShopInitialValues: {
    money: number;
    food: number;
    math: number;
    relationship: number;
    time: number;
  };
  accountingGradeRewards: Record<AccountingGrade, AccountingGradeReward>;
  accountingGameDurationSec: number;
  accountingMaxWrongAnswers: number;
};

const FALLBACK_GRAIN_SHOP_CONTENT: GrainShopContentDefaults = {
  grainShopNpcGreetingTextIds: [
    "runtime.zhu_yuanzhang.grain_shop.greeting.001",
    "runtime.zhu_yuanzhang.grain_shop.greeting.002",
    "runtime.zhu_yuanzhang.grain_shop.greeting.003",
    "runtime.zhu_yuanzhang.grain_shop.greeting.004",
  ],
  grainShopNpcDefaultLineTextIds: [
    "runtime.zhu_yuanzhang.grain_shop.default.001",
    "runtime.zhu_yuanzhang.grain_shop.default.002",
    "runtime.zhu_yuanzhang.grain_shop.default.003",
    "runtime.zhu_yuanzhang.grain_shop.default.004",
  ],
  grainShopMarketRumorTextIds: [
    "runtime.zhu_yuanzhang.grain_market.rumor.001",
    "runtime.zhu_yuanzhang.grain_market.rumor.002",
    "runtime.zhu_yuanzhang.grain_market.rumor.003",
    "runtime.zhu_yuanzhang.grain_market.rumor.004",
  ],
  grainShopInitialValues: {
    money: 200,
    food: 5,
    math: 1,
    relationship: 0,
    time: 1,
  },
  accountingGradeRewards: {
    S: { math: 3, money: 80, relationship: 3 },
    A: { math: 2, money: 50, relationship: 2 },
    B: { math: 1, money: 30, relationship: 1 },
    C: { math: 0, money: 10, relationship: 0 },
    D: { math: -1, money: 0, relationship: 0 },
  },
  accountingGameDurationSec: 30,
  accountingMaxWrongAnswers: 3,
};

export function getGrainShopContentDefaults(): GrainShopContentDefaults {
  return (
    getHouseModuleDefaults<GrainShopContentDefaults>(
      defaultRuntimeContent.houseModuleDefaults,
      "grain-shop"
    ) ?? FALLBACK_GRAIN_SHOP_CONTENT
  );
}
