import { defaultHomeHouseContent } from "../pack-content-access";

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

const homeHouseContent = defaultHomeHouseContent as HomeHouseContent;

export const homeHouseIntroLines = homeHouseContent.homeHouseIntroLines;
export const homeHouseMainLines = homeHouseContent.homeHouseMainLines;
export const homeHouseRestMenuLines = homeHouseContent.homeHouseRestMenuLines;
export const homeHouseRecoveryTuning = homeHouseContent.homeHouseRecoveryTuning;
