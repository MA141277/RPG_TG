import type { EventDefinition } from "../../domain/event";
import type { SceneDefinition } from "../../domain/action";
import {
  defaultPackEventDefinitions,
  defaultPackSceneDefinitions,
  defaultPackTextEntries,
} from "../pack-content-access";

export const storyEventDefinitions: EventDefinition[] = [
  ...(defaultPackEventDefinitions as EventDefinition[]),
];

export const storySceneDefinitions: SceneDefinition[] = [
  ...(defaultPackSceneDefinitions as SceneDefinition[]),
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
  defaultPackTextEntries;
