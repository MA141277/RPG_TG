import type { AccountingGrade, AccountingGradeReward } from "../../domain/grain-shop";
import * as grainShopContentJson from "../scenario-packs/zhuyuanzhang/house-content/grain-shop-content.json";

type GrainShopContent = {
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

const grainShopContent =
  ((grainShopContentJson as { default?: GrainShopContent }).default ??
    grainShopContentJson) as GrainShopContent;

export const grainShopNpcGreetingTextIds = grainShopContent.grainShopNpcGreetingTextIds;
export const grainShopNpcDefaultLineTextIds = grainShopContent.grainShopNpcDefaultLineTextIds;
export const grainShopMarketRumorTextIds = grainShopContent.grainShopMarketRumorTextIds;
export const grainShopInitialValues = grainShopContent.grainShopInitialValues;
export const accountingGradeRewards = grainShopContent.accountingGradeRewards;
export const accountingGameDurationSec = grainShopContent.accountingGameDurationSec;
export const accountingMaxWrongAnswers = grainShopContent.accountingMaxWrongAnswers;
