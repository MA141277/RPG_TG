import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import type { EventBinding, EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { SceneDefinition } from "../../domain/action";
import { runSceneUntilPause } from "../../application/scene/scene-runner";
import {
  triggerStoryEvents,
  type StoryTriggerTiming,
} from "../../application/story/story-runtime";
import type {
  SceneRuntimeInput,
  SceneRuntimeResult,
} from "../contracts/scene-runtime";
import { createSceneSession } from "./scene-session";

export function runSceneFromEvent(input: SceneRuntimeInput): SceneRuntimeResult {
  const result = runSceneUntilPause(input.state, {
    sceneDefinitionsById: input.sceneDefinitionsById,
    eventDefinitionsById: input.eventDefinitionsById,
    activityDefinitionsById: input.activityDefinitionsById,
    characterDefinitions: input.characterDefinitions,
    textEntriesById: input.textEntriesById,
  });

  return {
    state: result.state,
    characterDefinitions: result.characterDefinitions,
    session: createSceneSession(result.state),
    taskInputs: input.taskInputs ?? [],
    effects: [],
  };
}

export function runStoryTriggerRuntime(input: {
  timing: StoryTriggerTiming;
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  eventDefinitionsById: Record<string, EventDefinition>;
  eventBindingsById?: Record<string, EventBinding>;
  sceneDefinitionsById: Record<string, SceneDefinition>;
  activityDefinitionsById?: Record<string, ActivityDefinition>;
  textEntriesById?: Record<string, string>;
}): {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  session: SceneRuntimeResult["session"];
  taskInputs: SceneRuntimeResult["taskInputs"];
  effects: SceneRuntimeResult["effects"];
} {
  const storyResult = triggerStoryEvents(
    {
      state: input.state,
      characterDefinitions: input.characterDefinitions,
    },
    {
      eventDefinitionsById: input.eventDefinitionsById,
      eventBindingsById: input.eventBindingsById,
      sceneDefinitionsById: input.sceneDefinitionsById,
      activityDefinitionsById: input.activityDefinitionsById,
      textEntriesById: input.textEntriesById,
    },
    {
      timing: input.timing,
      cityId: input.state.world.currentCityId,
      ...(input.state.world.currentHouseId == null
        ? {}
        : { houseId: input.state.world.currentHouseId }),
    }
  );

  const activeEventId = storyResult.state.scene.activeEventId;
  if (activeEventId == null) {
    return {
      state: storyResult.state,
      characterDefinitions: storyResult.characterDefinitions,
      session: null,
      taskInputs: [],
      effects: [],
    };
  }

  return {
    state: storyResult.state,
    characterDefinitions: storyResult.characterDefinitions,
    session: createSceneSession(storyResult.state),
    taskInputs: input.eventDefinitionsById[activeEventId]?.taskInputs ?? [],
    effects: [],
  };
}
