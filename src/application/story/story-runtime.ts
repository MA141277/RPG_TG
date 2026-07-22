import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import type {
  RuntimeDialogueChoiceOption,
  RuntimeDialogueDefinition,
} from "../../domain/dialogue";
import type {
  EventBinding,
  EventDefinition,
} from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import { runEventBindingRuntime } from "../../core/runtime/event-binding-runtime";
import { createRuntimeTriggerContext } from "../../core/runtime/event-binding-contract";
import { startEvent } from "../events/event-runner";
import { runEventPlayableRuntime } from "../events/event-playable-runtime";
import { resolveDialogueChoiceOption } from "../dialogue/dialogue-choice-resolver";
import {
  advanceDialogue,
  runDialogueUntilPause,
} from "../dialogue/dialogue-runner";

export type StoryTriggerTiming =
  | "manual"
  | "game-start"
  | "date-change"
  | "turn-end"
  | "travel-complete"
  | "city-enter"
  | "house-enter"
  | "indoor-screen-shown"
  | "talk"
  | "custom";

export type StoryTriggerInput = {
  timing: StoryTriggerTiming;
  cityId?: string;
  houseId?: string;
  characterId?: string;
};

type StoryContent = {
  eventDefinitionsById: Record<string, EventDefinition>;
  eventBindingsById?: Record<string, EventBinding> | undefined;
  dialogueDefinitionsById: Record<string, RuntimeDialogueDefinition>;
  activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
  textEntriesById?: Record<string, string> | undefined;
};

type StoryRuntimeContext = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
};

type StoryRuntimeResult = StoryRuntimeContext;

export function syncStoryDialogue(
  runtime: StoryRuntimeContext,
  content: StoryContent
): StoryRuntimeResult {
  const result = runDialogueUntilPause(runtime.state, {
    dialogueDefinitionsById: content.dialogueDefinitionsById,
    eventDefinitionsById: content.eventDefinitionsById,
    activityDefinitionsById: content.activityDefinitionsById,
    characterDefinitions: runtime.characterDefinitions,
    textEntriesById: content.textEntriesById,
  });

  return {
    state: result.state,
    characterDefinitions: result.characterDefinitions,
  };
}

export function startStoryEventById(
  runtime: StoryRuntimeContext,
  content: StoryContent,
  eventId: string
): StoryRuntimeResult {
  const eventDefinition = content.eventDefinitionsById[eventId];
  if (eventDefinition == null) {
    return runtime;
  }

  return syncStoryDialogue(
    {
      state: startEvent(runtime.state, eventDefinition),
      characterDefinitions: runtime.characterDefinitions,
    },
    content
  );
}

export function triggerStoryEvents(
  runtime: StoryRuntimeContext,
  content: StoryContent,
  input: StoryTriggerInput
): StoryRuntimeResult {
  const eventBindings = Object.values(content.eventBindingsById ?? {});
  const bindingResult = runEventBindingRuntime({
    state: runtime.state,
    eventDefinitionsById: content.eventDefinitionsById,
    eventBindings,
    triggerContext: buildTriggerContext(input, runtime.state),
  });

  if (bindingResult.activation == null) {
    return runtime;
  }

  const activeEvent =
    content.eventDefinitionsById[bindingResult.activation.activeEventId] ?? null;
  const playableResult = runEventPlayableRuntime({
    state: bindingResult.state,
    characterDefinitions: runtime.characterDefinitions,
    eventDefinition: activeEvent,
    activityDefinitionsById: content.activityDefinitionsById,
    textEntriesById: content.textEntriesById,
  });
  if (playableResult?.handled) {
    return {
      state: playableResult.state,
      characterDefinitions: playableResult.characterDefinitions,
    };
  }

  return syncStoryDialogue(
    {
      state: bindingResult.state,
      characterDefinitions: runtime.characterDefinitions,
    },
    content
  );
}

function buildTriggerContext(
  input: StoryTriggerInput,
  state: GameState
){
  if (input.timing === "city-enter") {
    const currentCityId = input.cityId ?? state.world.currentCityId;
    return createRuntimeTriggerContext({
      state: {
        ...state,
        world: {
          ...state.world,
          currentCityId,
        },
      },
      owner: {
        family: "city",
        ...(currentCityId == null ? {} : { id: currentCityId }),
      },
      action: "city-enter",
    });
  }

  if (input.timing === "house-enter" || input.timing === "indoor-screen-shown") {
    const currentCityId = input.cityId ?? state.world.currentCityId;
    const currentHouseId = input.houseId ?? state.world.currentHouseId;
    return createRuntimeTriggerContext({
      state: {
        ...state,
        world: {
          ...state.world,
          currentCityId,
          currentHouseId,
        },
      },
      owner: {
        family: "building",
        ...(currentHouseId == null ? {} : { id: currentHouseId }),
      },
      action:
        input.timing === "house-enter"
          ? "building-enter"
          : "indoor-screen-shown",
    });
  }

  const currentCityId = input.cityId ?? state.world.currentCityId;
  const currentHouseId = input.houseId ?? state.world.currentHouseId;
  return createRuntimeTriggerContext({
    state: {
      ...state,
      world: {
        ...state.world,
        currentCityId,
        currentHouseId,
      },
    },
    owner: { family: "story", id: state.calendar.chapterId },
    action: input.timing,
  });
}

export function advanceStoryDialogueStep(
  runtime: StoryRuntimeContext,
  content: StoryContent
): StoryRuntimeResult {
  const result = advanceDialogue(runtime.state, {
    dialogueDefinitionsById: content.dialogueDefinitionsById,
    eventDefinitionsById: content.eventDefinitionsById,
    activityDefinitionsById: content.activityDefinitionsById,
    characterDefinitions: runtime.characterDefinitions,
    textEntriesById: content.textEntriesById,
  });

  return {
    state: result.state,
    characterDefinitions: result.characterDefinitions,
  };
}

export function chooseStoryDialogueOption(
  runtime: StoryRuntimeContext,
  content: StoryContent,
  selectedOption: RuntimeDialogueChoiceOption
): StoryRuntimeResult {
  const choiceResult = resolveDialogueChoiceOption(
    runtime.state,
    selectedOption,
    {
    eventDefinitionsById: content.eventDefinitionsById,
    characterDefinitions: runtime.characterDefinitions,
    }
  );

  return syncStoryDialogue(
    {
      state: choiceResult.state,
      characterDefinitions: choiceResult.characterDefinitions,
    },
    content
  );
}

export function getCurrentDialogueNode(
  state: GameState,
  dialogueDefinitionsById: Record<string, RuntimeDialogueDefinition>
) {
  if (state.dialogue.activeDialogueId == null) {
    return null;
  }

  const activeDialogue = dialogueDefinitionsById[state.dialogue.activeDialogueId];
  if (activeDialogue == null) {
    return null;
  }

  return activeDialogue.nodes[state.dialogue.cursor] ?? null;
}

export function getCurrentDialogueChoiceOptions(
  state: GameState,
  dialogueDefinitionsById: Record<string, RuntimeDialogueDefinition>
): RuntimeDialogueChoiceOption[] {
  const currentNode = getCurrentDialogueNode(state, dialogueDefinitionsById);
  return currentNode?.type === "choice" ? currentNode.options : [];
}

export function buildStoryTriggerInput(
  timing: StoryTriggerTiming,
  state: GameState
): StoryTriggerInput {
  return {
    timing,
    cityId: state.world.currentCityId,
    ...(state.world.currentHouseId == null ? {} : { houseId: state.world.currentHouseId }),
  };
}
