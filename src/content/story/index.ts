import type { EventDefinition } from "../../domain/event";
import type { SceneDefinition } from "../../domain/action";
import zhuyuanzhangEventsJson from "../scenario-packs/zhuyuanzhang/events.json";
import zhuyuanzhangScenesJson from "../scenario-packs/zhuyuanzhang/scenes.json";
import zhuyuanzhangTextEntriesJson from "../scenario-packs/zhuyuanzhang/text-entries.json";

export const storyEventDefinitions: EventDefinition[] = [
  ...(zhuyuanzhangEventsJson as EventDefinition[]),
];

export const storySceneDefinitions: SceneDefinition[] = [
  ...(zhuyuanzhangScenesJson as SceneDefinition[]),
];

export const storyEventDefinitionsById: Record<string, EventDefinition> =
  Object.fromEntries(
    storyEventDefinitions.map((eventDefinition) => [
      eventDefinition.id,
      eventDefinition,
    ])
  );

export const storySceneDefinitionsById: Record<string, SceneDefinition> =
  Object.fromEntries(
    storySceneDefinitions.map((sceneDefinition) => [
      sceneDefinition.id,
      sceneDefinition,
    ])
  );

export const storyTextEntries: Record<string, string> =
  zhuyuanzhangTextEntriesJson as Record<string, string>;
