import { runSceneUntilPause } from "../../application/scene/scene-runner";
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
    taskSignals: [],
    effects: [],
  };
}
