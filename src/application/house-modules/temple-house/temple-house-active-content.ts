import type { ActivityDefinition } from "../../../domain/activity";
import { defaultPackActivities, defaultPackTextEntries } from "../../content/default-pack-content";

export type TempleTaskActivityDefinition = ActivityDefinition & {
  houseModuleId: "temple-house";
  taskId: string;
  missionId: string;
  titleTextId: string;
  briefingTextId: string;
  orderLineTextIds: string[];
};

export function isTempleTaskActivityDefinition(
  activityDefinition: ActivityDefinition
): activityDefinition is TempleTaskActivityDefinition {
  return (
    activityDefinition.houseModuleId === "temple-house" &&
    typeof activityDefinition.taskId === "string" &&
    typeof activityDefinition.missionId === "string" &&
    typeof activityDefinition.titleTextId === "string" &&
    typeof activityDefinition.briefingTextId === "string" &&
    Array.isArray(activityDefinition.orderLineTextIds)
  );
}

export function getDefaultTempleTaskActivityDefinitions(): TempleTaskActivityDefinition[] {
  return (defaultPackActivities as ActivityDefinition[]).filter(
    isTempleTaskActivityDefinition
  );
}

export function getTempleTextEntries(
  textEntriesById?: Record<string, string>
): Record<string, string> {
  return textEntriesById == null
    ? defaultPackTextEntries
    : {
        ...defaultPackTextEntries,
        ...textEntriesById,
      };
}
