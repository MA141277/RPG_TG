import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import type { EventDefinition, EventTriggerTiming } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { SceneDefinition } from "../../domain/action";
import { runSceneUntilPause } from "../../application/scene/scene-runner";
import type {
  SceneRuntimeInput,
  SceneRuntimeResult,
} from "../contracts/scene-runtime";
import { runStoryEventRuntime } from "./event-runtime";
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
    taskInputs: [],
    effects: [],
  };
}

export function runStoryTriggerRuntime(input: {
  timing: EventTriggerTiming;
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  eventDefinitionsById: Record<string, EventDefinition>;
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
  const eventRuntimeResult = runStoryEventRuntime({
    timing: input.timing,
    state: input.state,
    characterDefinitions: input.characterDefinitions,
    eventDefinitionsById: input.eventDefinitionsById,
  });

  if (eventRuntimeResult.activation?.sceneId == null) {
    return {
      state: eventRuntimeResult.state,
      characterDefinitions: eventRuntimeResult.characterDefinitions,
      session: null,
      taskInputs: [],
      effects: [],
    };
  }

  return runSceneFromEvent({
    state: eventRuntimeResult.state,
    characterDefinitions: eventRuntimeResult.characterDefinitions,
    sceneDefinitionsById: input.sceneDefinitionsById,
    eventDefinitionsById: input.eventDefinitionsById,
    activityDefinitionsById: input.activityDefinitionsById,
    textEntriesById: input.textEntriesById,
  });
}
