import type { ChoiceOption, SceneDefinition } from "../../domain/action";
import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import type { CityDefinition } from "../../domain/city";
import type {
  EventBinding,
  EventDefinition,
  EventTriggerTiming,
} from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { HouseDefinition } from "../../domain/house";
import type {
  ProgressTrackBinding,
  ProgressTrackDefinition,
} from "../../core/contracts/progression-runtime";
import {
  applySettlementInstances,
  type SettlementRuntimeTargetState,
} from "../../core/runtime/runtime-settlement";
import {
  createRuntimeTriggerContext,
  runEventBindingRuntime,
} from "../../core/runtime/event-binding-runtime";
import { runProgressionRuntime } from "../../core/runtime/progression-runtime";
import { continueToEvent } from "../events/event-continuation";
import { startEvent } from "../events/event-runner";
import {
  applyStorySettlementEvent,
  type StorySettlementDefinition,
} from "./story-settlement-continuation";
import {
  selectTriggeredEvents,
  type TriggerEvaluationInput,
} from "../events/trigger-evaluator";
import { resolveChoiceOption } from "../scene/choice-resolver";
import { advanceScene, runSceneUntilPause } from "../scene/scene-runner";

type StoryContent = {
  eventDefinitionsById: Record<string, EventDefinition>;
  sceneDefinitionsById: Record<string, SceneDefinition>;
  eventBindingsById?: Record<string, EventBinding> | undefined;
  activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
  settlementDefinitionsById?:
    | Record<string, StorySettlementDefinition | undefined>
    | undefined;
  progressTrackDefinitionsById?:
    | Record<string, ProgressTrackDefinition>
    | undefined;
  progressTrackBindingsById?:
    | Record<string, ProgressTrackBinding>
    | undefined;
  cityDefinitionsById?: Record<string, CityDefinition> | undefined;
  houseDefinitionsById?: Record<string, HouseDefinition> | undefined;
  textEntriesById?: Record<string, string> | undefined;
};

type StoryRuntimeContext = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  cityDefinitions?: CityDefinition[] | undefined;
  houseDefinitions?: HouseDefinition[] | undefined;
};

type StoryRuntimeResult = StoryRuntimeContext;

function createRuntimeWorldDefinitionContext(runtime: StoryRuntimeContext) {
  return {
    ...(runtime.cityDefinitions == null
      ? {}
      : { cityDefinitions: runtime.cityDefinitions }),
    ...(runtime.houseDefinitions == null
      ? {}
      : { houseDefinitions: runtime.houseDefinitions }),
  };
}

function applyTriggeredStoryEvent(
  runtime: StoryRuntimeContext,
  content: StoryContent,
  eventDefinition: EventDefinition,
  options: { eventAlreadyStarted?: boolean } = {}
): StoryRuntimeContext {
  const activeRuntime =
    options.eventAlreadyStarted === true
      ? runtime
      : {
          state: startEvent(runtime.state, eventDefinition),
          characterDefinitions: runtime.characterDefinitions,
          ...createRuntimeWorldDefinitionContext(runtime),
        };
  const settledRuntime = applyStorySettlementEvent(
    activeRuntime,
    content,
    eventDefinition
  );
  return eventDefinition.type === "settlement"
    ? applyStoryProgressionAfterSettlement(settledRuntime, content)
    : settledRuntime;
}

function createScopedTriggerContext(
  state: GameState,
  characterDefinitions: CharacterDefinition[]
) {
  return {
    isCharacterAvailable: (characterId: string) =>
      characterDefinitions.some(
        (characterDefinition) => characterDefinition.id === characterId
      ),
    isCharacterInClan: (characterId: string, clanId: string) =>
      characterDefinitions.some(
        (characterDefinition) =>
          characterDefinition.id === characterId &&
          characterDefinition.clanId === clanId
      ),
    isCharacterInCity: (characterId: string, cityId: string) =>
      characterDefinitions.some(
        (characterDefinition) =>
          characterDefinition.id === characterId &&
          characterDefinition.cityId === cityId
      ),
    doesClanExist: (clanId: string) =>
      characterDefinitions.some(
        (characterDefinition) => characterDefinition.clanId === clanId
      ),
    getClanRelation: () => null,
    isCityOwnedByClan: () => false,
    hasEventFired: (eventId: string) =>
      (state.runtime.eventHistory[eventId]?.firedCount ?? 0) > 0,
    getEventFiredCount: (eventId: string) =>
      state.runtime.eventHistory[eventId]?.firedCount ?? 0,
    getMonthsSinceEvent: () => null,
    getMissionStatus: (missionId: string) => {
      if (state.missions.activeMissionId === missionId) {
        return "active";
      }

      if (state.missions.completedMissionIds.includes(missionId)) {
        return "completed";
      }

      return "inactive";
    },
    runCustomCondition: () => false,
  };
}

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
    ...(runtime.cityDefinitions == null
      ? {}
      : { cityDefinitions: runtime.cityDefinitions }),
    ...(runtime.houseDefinitions == null
      ? {}
      : { houseDefinitions: runtime.houseDefinitions }),
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

  return syncStoryScene(applyTriggeredStoryEvent(runtime, content, eventDefinition), content);
}

export function continueStoryFromSourceEvent(
  runtime: StoryRuntimeContext,
  content: StoryContent,
  sourceEventId: string
): StoryRuntimeResult | null {
  const sourceEventDefinition = content.eventDefinitionsById[sourceEventId];
  const continuation = continueToEvent({
    state: runtime.state,
    eventDefinitionsById: content.eventDefinitionsById,
    sourceEventId,
    targetEventId: sourceEventDefinition?.nextEventId,
    visitedEventIds: [sourceEventId],
  });
  if (continuation == null) {
    return null;
  }

  const settledRuntime = applyStorySettlementEvent(
    {
      state: continuation.state,
      characterDefinitions: runtime.characterDefinitions,
      ...(runtime.cityDefinitions == null
        ? {}
        : { cityDefinitions: runtime.cityDefinitions }),
      ...(runtime.houseDefinitions == null
        ? {}
        : { houseDefinitions: runtime.houseDefinitions }),
    },
    content,
    continuation.eventDefinition
  );

  return syncStoryScene(
    settledRuntime,
    content
  );
}

export function triggerStoryEvents(
  runtime: StoryRuntimeContext,
  content: StoryContent,
  input: TriggerEvaluationInput
): StoryRuntimeResult {
  const boundRuntime = triggerStoryEventBindings(runtime, content, input);
  if (boundRuntime != null) {
    return syncStoryScene(boundRuntime, content);
  }

  const triggeredEvents = selectTriggeredEvents(
    runtime.state,
    Object.values(content.eventDefinitionsById),
    input,
    createScopedTriggerContext(runtime.state, runtime.characterDefinitions)
  );
  const targetEvent = triggeredEvents[0];
  if (targetEvent == null) {
    return runtime;
  }

  return syncStoryScene(applyTriggeredStoryEvent(runtime, content, targetEvent), content);
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
    ...(runtime.cityDefinitions == null
      ? {}
      : { cityDefinitions: runtime.cityDefinitions }),
    ...(runtime.houseDefinitions == null
      ? {}
      : { houseDefinitions: runtime.houseDefinitions }),
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
      ...(runtime.cityDefinitions == null
        ? {}
        : { cityDefinitions: runtime.cityDefinitions }),
      ...(runtime.houseDefinitions == null
        ? {}
        : { houseDefinitions: runtime.houseDefinitions }),
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
  timing: EventTriggerTiming,
  state: GameState
): TriggerEvaluationInput {
  return {
    timing,
    cityId: state.world.currentCityId,
    ...(state.world.currentHouseId == null ? {} : { houseId: state.world.currentHouseId }),
  };
}

function triggerStoryEventBindings(
  runtime: StoryRuntimeContext,
  content: StoryContent,
  input: TriggerEvaluationInput
): StoryRuntimeContext | null {
  const eventBindings = Object.values(content.eventBindingsById ?? {});
  if (eventBindings.length === 0) {
    return null;
  }

  const triggerContext = createStoryEventBindingTriggerContext(runtime.state, input);
  if (triggerContext == null) {
    return null;
  }

  const bindingResult = runEventBindingRuntime({
    state: runtime.state,
    eventDefinitionsById: content.eventDefinitionsById,
    eventBindings,
    triggerContext,
  });
  if (bindingResult.activation == null) {
    return null;
  }

  const eventDefinition =
    content.eventDefinitionsById[bindingResult.activation.activeEventId];
  if (eventDefinition == null) {
    return {
      ...runtime,
      state: bindingResult.state,
    };
  }

  return applyTriggeredStoryEvent(
    {
      ...runtime,
      state: bindingResult.state,
    },
    content,
    eventDefinition,
    {
      eventAlreadyStarted: !isStateOnlyRuntimeActionEvent(eventDefinition),
    }
  );
}

function createStoryEventBindingTriggerContext(
  state: GameState,
  input: TriggerEvaluationInput
) {
  if (input.timing === "city-enter") {
    const cityId = input.cityId ?? state.world.currentCityId;
    return cityId == null
      ? null
      : createRuntimeTriggerContext({
          state,
          owner: {
            family: "city",
            id: cityId,
          },
          action: "city-enter",
        });
  }

  if (input.timing === "house-enter") {
    const houseId = input.houseId ?? state.world.currentHouseId;
    return houseId == null
      ? null
      : createRuntimeTriggerContext({
          state,
          owner: {
            family: "building",
            id: houseId,
          },
          action: "building-enter",
        });
  }

  if (input.timing === "indoor-screen-shown") {
    const houseId = input.houseId ?? state.world.currentHouseId;
    return houseId == null
      ? null
      : createRuntimeTriggerContext({
          state,
          owner: {
            family: "building",
            id: houseId,
          },
          action: "indoor-screen-shown",
        });
  }

  return null;
}

function isStateOnlyRuntimeActionEvent(eventDefinition: EventDefinition): boolean {
  const dialogueId =
    typeof eventDefinition.dialogueId === "string"
      ? eventDefinition.dialogueId.trim()
      : "";
  return (eventDefinition.actions?.length ?? 0) > 0 && dialogueId.length === 0;
}

function applyStoryProgressionAfterSettlement(
  runtime: StoryRuntimeContext,
  content: StoryContent
): StoryRuntimeContext {
  const trackDefinitionsById = content.progressTrackDefinitionsById ?? {};
  const bindings = Object.values(content.progressTrackBindingsById ?? {});
  if (bindings.length === 0 || Object.keys(trackDefinitionsById).length === 0) {
    return runtime;
  }

  const settlementState = createStorySettlementState(runtime, content);
  let nextProgressionState = runtime.state.runtime.progression ?? {
    trackStatesByHostKey: {},
  };
  const settlementInstances = [];
  const occurredAt = createStoryProgressionOccurredAt(runtime.state);

  for (const binding of bindings) {
    const track = trackDefinitionsById[binding.trackId];
    if (track == null) {
      continue;
    }
    const metricValue = readStoryProgressionMetricValue(
      settlementState,
      track,
      binding
    );
    if (metricValue == null) {
      continue;
    }

    const result = runProgressionRuntime({
      state: nextProgressionState,
      track,
      binding,
      metricValue,
      occurredAt,
    });
    nextProgressionState = result.state;
    settlementInstances.push(...result.settlementInstances);
  }

  const progressedRuntime: StoryRuntimeContext = {
    ...runtime,
    state: {
      ...runtime.state,
      runtime: {
        ...runtime.state.runtime,
        progression: nextProgressionState,
      },
    },
  };
  if (settlementInstances.length === 0) {
    return progressedRuntime;
  }

  const appliedSettlements = applySettlementInstances(settlementState, {
    settlementInstances,
    context: settlementState,
    ...(content.settlementDefinitionsById == null
      ? {}
      : { settlementDefinitionsById: content.settlementDefinitionsById }),
  });
  return applyStorySettlementState(progressedRuntime, appliedSettlements.state);
}

function createStorySettlementState(
  runtime: StoryRuntimeContext,
  content: StoryContent
): SettlementRuntimeTargetState {
  const cityDefinitions =
    runtime.cityDefinitions ?? Object.values(content.cityDefinitionsById ?? {});
  const houseDefinitions =
    runtime.houseDefinitions ?? Object.values(content.houseDefinitionsById ?? {});

  return {
    people: Object.fromEntries(
      runtime.characterDefinitions.map((character) => [
        character.id,
        character as unknown as Record<string, unknown>,
      ])
    ),
    ...(cityDefinitions.length === 0
      ? {}
      : {
          cities: Object.fromEntries(
            cityDefinitions.map((city) => [
              city.id,
              city as unknown as Record<string, unknown>,
            ])
          ),
        }),
    ...(houseDefinitions.length === 0
      ? {}
      : {
          buildings: Object.fromEntries(
            houseDefinitions.map((house) => [
              house.id,
              house as unknown as Record<string, unknown>,
            ])
          ),
        }),
  };
}

function applyStorySettlementState(
  runtime: StoryRuntimeContext,
  settlementState: SettlementRuntimeTargetState
): StoryRuntimeContext {
  return {
    ...runtime,
    characterDefinitions: runtime.characterDefinitions.map(
      (character) =>
        (settlementState.people?.[character.id] as
          | CharacterDefinition
          | undefined) ?? character
    ),
    ...(runtime.cityDefinitions == null
      ? {}
      : {
          cityDefinitions: runtime.cityDefinitions.map(
            (city) =>
              (settlementState.cities?.[city.id] as CityDefinition | undefined) ??
              city
          ),
        }),
    ...(runtime.houseDefinitions == null
      ? {}
      : {
          houseDefinitions: runtime.houseDefinitions.map(
            (house) =>
              (settlementState.buildings?.[house.id] as
                | HouseDefinition
                | undefined) ?? house
          ),
        }),
  };
}

function createStoryProgressionOccurredAt(state: GameState): string {
  return [
    state.calendar.year,
    String(state.calendar.month).padStart(2, "0"),
    String(state.calendar.day).padStart(2, "0"),
  ].join("-");
}

function readStoryProgressionMetricValue(
  settlementState: SettlementRuntimeTargetState,
  track: ProgressTrackDefinition,
  binding: ProgressTrackBinding
): number | null {
  const hostId = binding.host.id?.trim() ?? "";
  if (hostId.length === 0) {
    return null;
  }

  const hostRecord =
    binding.host.family === "person"
      ? settlementState.people?.[hostId]
      : binding.host.family === "city"
        ? settlementState.cities?.[hostId]
        : binding.host.family === "building"
          ? settlementState.buildings?.[hostId]
          : undefined;
  if (hostRecord == null) {
    return null;
  }

  const pathValue = readStoryProgressionRecordPath(
    hostRecord as Record<string, unknown>,
    track.metricKey
  );
  if (typeof pathValue === "number" && Number.isFinite(pathValue)) {
    return pathValue;
  }

  const customProperties = (hostRecord as Record<string, unknown>).customProperties;
  if (
    customProperties != null &&
    typeof customProperties === "object" &&
    !Array.isArray(customProperties)
  ) {
    const customValue = (customProperties as Record<string, unknown>)[track.metricKey];
    if (typeof customValue === "number" && Number.isFinite(customValue)) {
      return customValue;
    }
  }

  return null;
}

function readStoryProgressionRecordPath(
  target: Record<string, unknown>,
  metricKey: string
): unknown {
  const parts = metricKey.split(".").filter((part) => part.length > 0);
  if (parts.length === 0) {
    return undefined;
  }

  let current: unknown = target;
  for (const part of parts) {
    if (current == null || typeof current !== "object" || Array.isArray(current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}
