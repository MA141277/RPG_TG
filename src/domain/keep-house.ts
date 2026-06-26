import type { CharacterId } from "./character";

export type KeepHouseTaskTier = "runner" | "officer" | "commander";

export type KeepHouseTaskDefinition = {
  id: string;
  missionId: string;
  title: string;
  briefing: string;
  orderLines: string[];
  minTier: KeepHouseTaskTier;
};

export type KeepHouseContributionDefinition = {
  characterId: CharacterId;
  contribution: number;
};

export const KEEP_HOUSE_VARIABLE_KEYS = {
  reviewCountdown: "var.keep.review_countdown",
  currentStrategy: "var.keep.current_strategy",
  lastAssignedTaskId: "var.keep.last_assigned_task_id",
  contributionPrefix: "var.keep.contribution.",
} as const;

export function getKeepHouseContributionVariableKey(
  characterId: CharacterId
): string {
  return `${KEEP_HOUSE_VARIABLE_KEYS.contributionPrefix}${characterId}`;
}
