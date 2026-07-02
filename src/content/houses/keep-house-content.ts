import type { KeepHouseContributionDefinition } from "../../domain/keep-house";
import { defaultKeepHouseContent } from "../pack-content-access";

type KeepHouseContent = {
  keepHouseDefaultStrategy: {
    titleTextId: string;
    lineTextIds: string[];
  };
  keepHouseDefaultContributions: KeepHouseContributionDefinition[];
};

const keepHouseContent = defaultKeepHouseContent as KeepHouseContent;

export const keepHouseDefaultStrategy = keepHouseContent.keepHouseDefaultStrategy;
export const keepHouseDefaultContributions = keepHouseContent.keepHouseDefaultContributions;
