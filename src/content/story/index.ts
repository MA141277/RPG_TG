import type { EventDefinition } from "../../domain/event";
import type { SceneDefinition } from "../../domain/action";
import {
  zhuYuanzhangMainStoryEvents,
  zhuYuanzhangMainStoryScenes,
} from "./zhu-yuanzhang-main-story";

export const storyEventDefinitions: EventDefinition[] = [
  ...zhuYuanzhangMainStoryEvents,
];

export const storySceneDefinitions: SceneDefinition[] = [
  ...zhuYuanzhangMainStoryScenes,
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
