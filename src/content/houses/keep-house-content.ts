import type { KeepHouseContributionDefinition } from "../../domain/keep-house";
import * as keepHouseContentJson from "../scenario-packs/zhuyuanzhang/house-content/keep-house-content.json";

type KeepHouseContent = {
  keepHouseDefaultStrategy: {
    titleTextId: string;
    lineTextIds: string[];
  };
  keepHouseDefaultContributions: KeepHouseContributionDefinition[];
};

const keepHouseContent =
  ((keepHouseContentJson as { default?: KeepHouseContent }).default ??
    keepHouseContentJson) as KeepHouseContent;

export const keepHouseDefaultStrategy = keepHouseContent.keepHouseDefaultStrategy;
export const keepHouseDefaultContributions = keepHouseContent.keepHouseDefaultContributions;
