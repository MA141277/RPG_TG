import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import type { CityDefinition } from "../../domain/city";
import type { SettlementDefinition } from "../../domain/content-pack";
import type { RuntimeDialogueDefinition } from "../../domain/dialogue";
import type { EventBinding, EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { HouseDefinition } from "../../domain/house";
import type {
  ProgressTrackBinding,
  ProgressTrackDefinition,
} from "../contracts/progression-runtime";
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
  settlementDefinitionsById?: Record<string, SettlementDefinition>;
  progressTrackDefinitionsById?: Record<string, ProgressTrackDefinition>;
  progressTrackBindingsById?: Record<string, ProgressTrackBinding>;
  dialogueDefinitionsById: Record<string, RuntimeDialogueDefinition>;
  activityDefinitionsById?: Record<string, ActivityDefinition>;
  cityDefinitionsById?: Record<string, CityDefinition>;
  houseDefinitionsById?: Record<string, HouseDefinition>;
  textEntriesById?: Record<string, string>;
}): {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  cityDefinitions?: CityDefinition[];
  houseDefinitions?: HouseDefinition[];
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
      settlementDefinitionsById: input.settlementDefinitionsById,
      progressTrackDefinitionsById: input.progressTrackDefinitionsById,
      progressTrackBindingsById: input.progressTrackBindingsById,
      dialogueDefinitionsById: input.dialogueDefinitionsById,
      activityDefinitionsById: input.activityDefinitionsById,
      cityDefinitionsById: input.cityDefinitionsById,
      houseDefinitionsById: input.houseDefinitionsById,
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
      ...(storyResult.cityDefinitions == null
        ? {}
        : { cityDefinitions: storyResult.cityDefinitions }),
      ...(storyResult.houseDefinitions == null
        ? {}
        : { houseDefinitions: storyResult.houseDefinitions }),
      session: null,
      taskInputs: [],
      effects: [],
    };
  }

  return {
    state: storyResult.state,
    characterDefinitions: storyResult.characterDefinitions,
    ...(storyResult.cityDefinitions == null
      ? {}
      : { cityDefinitions: storyResult.cityDefinitions }),
    ...(storyResult.houseDefinitions == null
      ? {}
      : { houseDefinitions: storyResult.houseDefinitions }),
    session: createDialogueSession(storyResult.state),
    taskInputs: input.eventDefinitionsById[activeEventId]?.taskInputs ?? [],
    effects: [],
  };
}
