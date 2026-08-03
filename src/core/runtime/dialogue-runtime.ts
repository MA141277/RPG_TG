import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import type { RuntimeDialogueDefinition } from "../../domain/dialogue";
import type { EventDefinition, EventTriggerTiming } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import { runSceneUntilPause } from "../../application/scene/scene-runner";
import type {
  DialogueRuntimeInput,
  DialogueRuntimeResult,
} from "../contracts/dialogue-runtime";
import { runStoryEventRuntime } from "./event-runtime";
import { createCompatibleSceneDefinitions } from "./mod-first-compatibility";
import { createDialogueSession } from "./dialogue-session";
import { routeSceneRuntimeContinuationEvent } from "./scene-runtime";

export function runDialogueFromEvent(
  input: DialogueRuntimeInput
): DialogueRuntimeResult {
  const sceneDefinitions = createCompatibleSceneDefinitions({
    dialogueDefinitions: Object.values(input.dialogueDefinitionsById),
  });
  const result = runSceneUntilPause(input.state, {
    sceneDefinitionsById: Object.fromEntries(
      sceneDefinitions.map((scene) => [scene.id, scene])
    ),
    eventDefinitionsById: input.eventDefinitionsById,
    activityDefinitionsById: input.activityDefinitionsById,
    flowPlayablesById: input.flowPlayablesById,
    characterDefinitions: input.characterDefinitions,
    textEntriesById: input.textEntriesById,
    continueFromSceneEvent: ({
      state,
      characterDefinitions,
      eventDefinition,
    }) => ({
      state: routeSceneRuntimeContinuationEvent({
        state,
        eventDefinition,
        eventDefinitionsById: input.eventDefinitionsById,
      }),
      characterDefinitions,
    }),
  });

  return {
    state: result.state,
    characterDefinitions: result.characterDefinitions,
    session: createDialogueSession(result.state),
    taskInputs: input.taskInputs ?? [],
    effects: [],
  };
}

export function runStoryDialogueTriggerRuntime(input: {
  timing: EventTriggerTiming;
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  eventDefinitionsById: Record<string, EventDefinition>;
  dialogueDefinitionsById: Record<string, RuntimeDialogueDefinition>;
  activityDefinitionsById?: Record<string, ActivityDefinition>;
  flowPlayablesById?: Record<string, import("../../domain/playables/flow").FlowPlayableDefinition>;
  textEntriesById?: Record<string, string>;
}): {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  session: DialogueRuntimeResult["session"];
  taskInputs: DialogueRuntimeResult["taskInputs"];
  effects: DialogueRuntimeResult["effects"];
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

  return runDialogueFromEvent({
    state: eventRuntimeResult.state,
    characterDefinitions: eventRuntimeResult.characterDefinitions,
    dialogueDefinitionsById: input.dialogueDefinitionsById,
    eventDefinitionsById: input.eventDefinitionsById,
    activityDefinitionsById: input.activityDefinitionsById,
    flowPlayablesById: input.flowPlayablesById,
    textEntriesById: input.textEntriesById,
  });
}
