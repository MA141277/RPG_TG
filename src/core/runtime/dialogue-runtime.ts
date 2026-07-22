import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import type { RuntimeDialogueDefinition } from "../../domain/dialogue";
import type { EventBinding, EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import { runDialogueUntilPause } from "../../application/dialogue/dialogue-runner";
import {
  triggerStoryEvents,
  type StoryTriggerTiming,
} from "../../application/story/story-runtime";
import type {
  DialogueRuntimeInput,
  DialogueRuntimeResult,
} from "../contracts/dialogue-runtime";
import { createDialogueSession } from "./dialogue-session";

export function runDialogueFromEvent(
  input: DialogueRuntimeInput
): DialogueRuntimeResult {
  const result = runDialogueUntilPause(input.state, {
    dialogueDefinitionsById: input.dialogueDefinitionsById,
    eventDefinitionsById: input.eventDefinitionsById,
    activityDefinitionsById: input.activityDefinitionsById,
    characterDefinitions: input.characterDefinitions,
    textEntriesById: input.textEntriesById,
  });

  return {
    state: result.state,
    characterDefinitions: result.characterDefinitions,
    session: createDialogueSession(result.state),
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
  dialogueDefinitionsById: Record<string, RuntimeDialogueDefinition>;
  activityDefinitionsById?: Record<string, ActivityDefinition>;
  textEntriesById?: Record<string, string>;
}): {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  session: DialogueRuntimeResult["session"];
  taskInputs: DialogueRuntimeResult["taskInputs"];
  effects: DialogueRuntimeResult["effects"];
} {
  const storyResult = triggerStoryEvents(
    {
      state: input.state,
      characterDefinitions: input.characterDefinitions,
    },
    {
      eventDefinitionsById: input.eventDefinitionsById,
      eventBindingsById: input.eventBindingsById,
      dialogueDefinitionsById: input.dialogueDefinitionsById,
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

  const activeEventId = storyResult.state.dialogue.activeEventId;
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
    session: createDialogueSession(storyResult.state),
    taskInputs: input.eventDefinitionsById[activeEventId]?.taskInputs ?? [],
    effects: [],
  };
}
