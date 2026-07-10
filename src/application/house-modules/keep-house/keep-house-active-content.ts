import type { ActivityDefinition } from "../../../domain/activity";
import type { KeepHouseContributionDefinition } from "../../../domain/keep-house";
import { getHouseModuleDefaults } from "../../content/house-module-defaults";
import { defaultRuntimeContent } from "../../content/default-runtime-content";

export type KeepHouseContentDefaults = {
  keepHouseDefaultStrategy: {
    titleTextId: string;
    lineTextIds: string[];
  };
  keepHouseDefaultContributions: KeepHouseContributionDefinition[];
};

const FALLBACK_KEEP_HOUSE_CONTENT: KeepHouseContentDefaults = {
  keepHouseDefaultStrategy: {
    titleTextId: "runtime.zhu_yuanzhang.keep.review.strategy.title",
    lineTextIds: [
      "runtime.zhu_yuanzhang.keep.review.strategy.001",
      "runtime.zhu_yuanzhang.keep.review.strategy.002",
      "runtime.zhu_yuanzhang.keep.review.strategy.003",
    ],
  },
  keepHouseDefaultContributions: [
    {
      characterId: "char.kulan_tang_he",
      contribution: 32,
    },
    {
      characterId: "char.kulan_xu_da",
      contribution: 27,
    },
    {
      characterId: "char.player",
      contribution: 11,
    },
    {
      characterId: "char.kulan_chang_yuchun",
      contribution: 9,
    },
    {
      characterId: "char.kulan_guard",
      contribution: 6,
    },
  ],
};

export function getKeepHouseContentDefaults(): KeepHouseContentDefaults {
  return (
    getHouseModuleDefaults<KeepHouseContentDefaults>(
      defaultRuntimeContent.houseModuleDefaults,
      "keep-house"
    ) ?? FALLBACK_KEEP_HOUSE_CONTENT
  );
}

export function getKeepHouseTextEntries(input: {
  textEntriesById?: Record<string, string> | undefined;
}): Record<string, string> {
  return {
    ...defaultRuntimeContent.textEntriesById,
    ...(input.textEntriesById ?? {}),
  };
}

export function getKeepHouseActivityDefinitionsById(input: {
  activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
}): Record<string, ActivityDefinition> {
  const defaultKeepActivityDefinitionsById = Object.fromEntries(
    defaultRuntimeContent.activityDefinitions.map((activityDefinition) => [
      activityDefinition.id,
      activityDefinition,
    ])
  );

  return {
    ...defaultKeepActivityDefinitionsById,
    ...(input.activityDefinitionsById ?? {}),
  };
}
