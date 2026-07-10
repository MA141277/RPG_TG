import { getHouseModuleDefaults } from "../../content/house-module-defaults";
import { defaultRuntimeContent } from "../../content/default-runtime-content";

export type HomeHouseContentDefaults = {
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

const FALLBACK_HOME_HOUSE_CONTENT: HomeHouseContentDefaults = {
  homeHouseIntroLines: [],
  homeHouseMainLines: [],
  homeHouseRestMenuLines: [],
  homeHouseRecoveryTuning: {
    hpBase: 10,
    hpRatio: 0.15,
    fatigueBase: 12,
    fatigueRatio: 0.18,
    customRestMaxDays: 99,
  },
};

export function getHomeHouseContentDefaults(): HomeHouseContentDefaults {
  return (
    getHouseModuleDefaults<HomeHouseContentDefaults>(
      defaultRuntimeContent.houseModuleDefaults,
      "home-house"
    ) ?? FALLBACK_HOME_HOUSE_CONTENT
  );
}

export function getHomeTextEntries(input: {
  textEntriesById?: Record<string, string> | undefined;
}): Record<string, string> {
  return {
    ...defaultRuntimeContent.textEntriesById,
    ...(input.textEntriesById ?? {}),
  };
}
