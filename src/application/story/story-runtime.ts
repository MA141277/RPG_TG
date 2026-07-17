import type { ChoiceOption, SceneDefinition } from "../../domain/action";
import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import type {
  EventBinding,
  EventDefinition,
  TriggerContext,
} from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import { runEventBindingRuntime } from "../../core/runtime/event-binding-runtime";
import { startEvent } from "../events/event-runner";
import { resolveChoiceOption } from "../scene/choice-resolver";
import { advanceScene, runSceneUntilPause } from "../scene/scene-runner";

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
  sceneDefinitionsById: Record<string, SceneDefinition>;
  activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
  textEntriesById?: Record<string, string> | undefined;
};

type StoryRuntimeContext = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
};

type StoryRuntimeResult = StoryRuntimeContext;

export function syncStoryScene(
  runtime: StoryRuntimeContext,
  content: StoryContent
): StoryRuntimeResult {
  const result = runSceneUntilPause(runtime.state, {
    sceneDefinitionsById: content.sceneDefinitionsById,
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

  return syncStoryScene(
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

  return syncStoryScene(
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
): TriggerContext {
  if (input.timing === "city-enter") {
    const currentCityId = input.cityId ?? state.world.currentCityId;
    const currentHouseId = state.world.currentHouseId;
    return {
      owner: {
        family: "city",
        ...(currentCityId == null ? {} : { id: currentCityId }),
      },
      timing: "after",
      action: "city-enter",
      currentCityId,
      ...(currentHouseId == null ? {} : { currentHouseId }),
    };
  }

  if (input.timing === "house-enter" || input.timing === "indoor-screen-shown") {
    const currentCityId = input.cityId ?? state.world.currentCityId;
    const currentHouseId = input.houseId ?? state.world.currentHouseId;
    return {
      owner: {
        family: "building",
        ...(currentHouseId == null ? {} : { id: currentHouseId }),
      },
      timing: "after",
      action:
        input.timing === "house-enter"
          ? "building-enter"
          : "indoor-screen-shown",
      currentCityId,
      ...(currentHouseId == null ? {} : { currentHouseId }),
    };
  }

  const currentCityId = input.cityId ?? state.world.currentCityId;
  const currentHouseId = input.houseId ?? state.world.currentHouseId;
  return {
    owner: { family: "story", id: state.calendar.chapterId },
    timing: "after",
    action: input.timing,
    currentCityId,
    ...(currentHouseId == null ? {} : { currentHouseId }),
  };
}

export function advanceStorySceneStep(
  runtime: StoryRuntimeContext,
  content: StoryContent
): StoryRuntimeResult {
  const result = advanceScene(runtime.state, {
    sceneDefinitionsById: content.sceneDefinitionsById,
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

export function chooseStorySceneOption(
  runtime: StoryRuntimeContext,
  content: StoryContent,
  selectedOption: ChoiceOption
): StoryRuntimeResult {
  const choiceResult = resolveChoiceOption(runtime.state, selectedOption, {
    sceneDefinitionsById: content.sceneDefinitionsById,
    eventDefinitionsById: content.eventDefinitionsById,
    characterDefinitions: runtime.characterDefinitions,
  });

  return syncStoryScene(
    {
      state: choiceResult.state,
      characterDefinitions: choiceResult.characterDefinitions,
    },
    content
  );
}

export function getCurrentSceneAction(
  state: GameState,
  sceneDefinitionsById: Record<string, SceneDefinition>
) {
  if (state.scene.activeSceneId == null) {
    return null;
  }

  const activeScene = sceneDefinitionsById[state.scene.activeSceneId];
  if (activeScene == null) {
    return null;
  }

  return activeScene.actions[state.scene.cursor] ?? null;
}

export function getCurrentChoiceOptions(
  state: GameState,
  sceneDefinitionsById: Record<string, SceneDefinition>
): ChoiceOption[] {
  const currentAction = getCurrentSceneAction(state, sceneDefinitionsById);
  return currentAction?.type === "choice" ? currentAction.options : [];
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
