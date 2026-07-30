import type { AccountingGrade, AccountingGradeReward } from "../../domain/grain-shop";
import { defaultGrainShopContent } from "../pack-content-access";

type GrainShopContent = {
  grainShopNpcGreetingTextIds: string[];
  grainShopNpcDefaultLineTextIds: string[];
  grainShopMarketRumorTextIds: string[];
  grainShopInvestigationOfferTextIds: string[];
  grainShopInvestigationRefusalTextIds: string[];
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

const grainShopContent = defaultGrainShopContent as GrainShopContent;

export const grainShopNpcGreetingTextIds = grainShopContent.grainShopNpcGreetingTextIds;
export const grainShopNpcDefaultLineTextIds = grainShopContent.grainShopNpcDefaultLineTextIds;
export const grainShopMarketRumorTextIds = grainShopContent.grainShopMarketRumorTextIds;
export const grainShopInvestigationOfferTextIds =
  grainShopContent.grainShopInvestigationOfferTextIds;
export const grainShopInvestigationRefusalTextIds =
  grainShopContent.grainShopInvestigationRefusalTextIds;
export const grainShopInitialValues = grainShopContent.grainShopInitialValues;
export const accountingGradeRewards = grainShopContent.accountingGradeRewards;
export const accountingGameDurationSec = grainShopContent.accountingGameDurationSec;
export const accountingMaxWrongAnswers = grainShopContent.accountingMaxWrongAnswers;
