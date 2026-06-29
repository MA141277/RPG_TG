import * as homeHouseContentJson from "../scenario-packs/zhuyuanzhang/house-content/home-house-content.json";

type HomeHouseContent = {
  homeHouseIntroLines: string[];
  homeHouseMainLines: string[];
  homeHouseRestMenuLines: string[];
  homeHouseRecoveryTuning: {
    hpBase: number;
    hpRatio: number;
    fatigueBase: number;
    fatigueRatio: number;
    customRestMaxDays: number;
  };
};

const homeHouseContent =
  ((homeHouseContentJson as { default?: HomeHouseContent }).default ??
    homeHouseContentJson) as HomeHouseContent;

export const homeHouseIntroLines = homeHouseContent.homeHouseIntroLines;
export const homeHouseMainLines = homeHouseContent.homeHouseMainLines;
export const homeHouseRestMenuLines = homeHouseContent.homeHouseRestMenuLines;
export const homeHouseRecoveryTuning = homeHouseContent.homeHouseRecoveryTuning;
