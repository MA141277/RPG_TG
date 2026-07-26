import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import type { CityDefinition } from "../../domain/city";
import type {
  RuntimeDialogueChoiceOption,
  RuntimeDialogueDefinition,
} from "../../domain/dialogue";
import type {
  EventBinding,
  EventDefinition,
} from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { HouseDefinition } from "../../domain/house";
import { runEventBindingRuntime } from "../../core/runtime/event-binding-runtime";
import { createRuntimeTriggerContext } from "../../core/runtime/event-binding-contract";
import {
  applySettlementInstances,
  applySettlementContents,
  type ExportedSettlement,
} from "../../core/runtime/runtime-settlement";
import { runProgressionRuntime } from "../../core/runtime/progression-runtime";
import {
  continueToEvent,
  createEventContinuationTracker,
} from "../events/event-continuation";
import { startEvent } from "../events/event-runner";
import { runEventPlayableRuntime } from "../events/event-playable-runtime";
import { resolveDialogueChoiceOption } from "../dialogue/dialogue-choice-resolver";
import {
  advanceDialogue,
  runDialogueUntilPause,
} from "../dialogue/dialogue-runner";
import type {
  ProgressTrackBinding,
  ProgressTrackDefinition,
} from "../../core/contracts/progression-runtime";

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
  settlementDefinitionsById?: Record<string, StorySettlementDefinition> | undefined;
  progressTrackDefinitionsById?:
    | Record<string, ProgressTrackDefinition>
    | undefined;
  progressTrackBindingsById?: Record<string, ProgressTrackBinding> | undefined;
  dialogueDefinitionsById: Record<string, RuntimeDialogueDefinition>;
  activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
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

type StorySettlementDefinition = ExportedSettlement & {
  id: string;
  nextEventId?: string | undefined;
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
    ...(runtime.cityDefinitions == null ? {} : { cityDefinitions: runtime.cityDefinitions }),
    ...(runtime.houseDefinitions == null ? {} : { houseDefinitions: runtime.houseDefinitions }),
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

  return syncStoryDialogue(startStoryEvent(runtime, content, eventDefinition), content);
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

  return syncStoryDialogue(
    startStoryEvent(
      {
        ...runtime,
        state: continuation.state,
      },
      content,
      continuation.eventDefinition,
      { eventAlreadyStarted: true }
    ),
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
  const settledRuntime =
    activeEvent == null
      ? {
          ...runtime,
          state: bindingResult.state,
        }
      : startStoryEvent(
          {
            ...runtime,
            state: bindingResult.state,
          },
          content,
          activeEvent,
          { eventAlreadyStarted: true }
        );
  const activeEventAfterSettlement =
    settledRuntime.state.dialogue.activeEventId == null
      ? activeEvent
      : content.eventDefinitionsById[settledRuntime.state.dialogue.activeEventId] ??
        activeEvent;
  const playableResult = runEventPlayableRuntime({
    state: settledRuntime.state,
    characterDefinitions: settledRuntime.characterDefinitions,
    eventDefinition: activeEventAfterSettlement,
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
      state: settledRuntime.state,
      characterDefinitions: settledRuntime.characterDefinitions,
      ...(settledRuntime.cityDefinitions == null
        ? {}
        : { cityDefinitions: settledRuntime.cityDefinitions }),
      ...(settledRuntime.houseDefinitions == null
        ? {}
        : { houseDefinitions: settledRuntime.houseDefinitions }),
    },
    content
  );
}

function startStoryEvent(
  runtime: StoryRuntimeContext,
  content: StoryContent,
  eventDefinition: EventDefinition,
  options: { eventAlreadyStarted?: boolean } = {}
): StoryRuntimeResult {
  let activeRuntime =
    options.eventAlreadyStarted === true
      ? runtime
      : {
          ...runtime,
          state: startEvent(runtime.state, eventDefinition),
        };
  let activeEventDefinition = eventDefinition;
  let continuationVisitedEventIds = createEventContinuationTracker([
    eventDefinition.id,
  ]);

  while (true) {
    if (activeEventDefinition.type !== "settlement") {
      return activeRuntime;
    }

    const settlement = readStorySettlement(content, activeEventDefinition);
    if (settlement == null) {
      return activeRuntime;
    }

    const settlementState = applySettlementContents(
      {
        people: Object.fromEntries(
          activeRuntime.characterDefinitions.map((character) => [
            character.id,
            character as unknown as Record<string, unknown>,
          ])
        ),
        cities: Object.fromEntries(
          (activeRuntime.cityDefinitions ?? Object.values(content.cityDefinitionsById ?? {})).map(
            (city) => [city.id, city as unknown as Record<string, unknown>]
          )
        ),
        buildings: Object.fromEntries(
          (
            activeRuntime.houseDefinitions ??
            Object.values(content.houseDefinitionsById ?? {})
          ).map((house) => [house.id, house as unknown as Record<string, unknown>])
        ),
      },
      settlement
    );
    const nextRuntime: StoryRuntimeContext = {
      state: activeRuntime.state,
      characterDefinitions: activeRuntime.characterDefinitions.map(
        (character) =>
          (settlementState.people?.[character.id] as CharacterDefinition | undefined) ??
          character
      ),
      ...(activeRuntime.cityDefinitions == null
        ? {}
        : {
            cityDefinitions: activeRuntime.cityDefinitions.map(
              (city) =>
                (settlementState.cities?.[city.id] as CityDefinition | undefined) ??
                city
            ),
          }),
      ...(activeRuntime.houseDefinitions == null
        ? {}
        : {
            houseDefinitions: activeRuntime.houseDefinitions.map(
              (house) =>
                (settlementState.buildings?.[house.id] as HouseDefinition | undefined) ??
                house
            ),
          }),
    };
    const progressedRuntime = applyStoryProgressionAfterSettlement(
      nextRuntime,
      content
    );
    const continuation = continueToEvent({
      state: progressedRuntime.state,
      eventDefinitionsById: content.eventDefinitionsById,
      sourceEventId: activeEventDefinition.id,
      targetEventId: settlement.nextEventId,
      visitedEventIds: continuationVisitedEventIds,
    });
    if (continuation == null) {
      return progressedRuntime;
    }

    activeRuntime = {
      ...progressedRuntime,
      state: continuation.state,
    };
    activeEventDefinition = continuation.eventDefinition;
    continuationVisitedEventIds = continuation.visitedEventIds;
  }
}

function readStorySettlement(
  content: StoryContent,
  eventDefinition: EventDefinition
): StorySettlementDefinition | undefined {
  const settlementId =
    typeof eventDefinition.settlementId === "string"
      ? eventDefinition.settlementId.trim()
      : "";
  return settlementId.length === 0
    ? undefined
    : content.settlementDefinitionsById?.[settlementId];
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
    ...(content.settlementDefinitionsById == null
      ? {}
      : { settlementDefinitionsById: content.settlementDefinitionsById }),
    context: settlementState,
  });
  return applyStorySettlementState(progressedRuntime, appliedSettlements.state);
}

function createStorySettlementState(
  runtime: StoryRuntimeContext,
  content: StoryContent
): {
  people: Record<string, Record<string, unknown>>;
  cities: Record<string, Record<string, unknown>>;
  buildings: Record<string, Record<string, unknown>>;
} {
  return {
    people: Object.fromEntries(
      runtime.characterDefinitions.map((character) => [
        character.id,
        character as unknown as Record<string, unknown>,
      ])
    ),
    cities: Object.fromEntries(
      (runtime.cityDefinitions ?? Object.values(content.cityDefinitionsById ?? {})).map(
        (city) => [city.id, city as unknown as Record<string, unknown>]
      )
    ),
    buildings: Object.fromEntries(
      (runtime.houseDefinitions ?? Object.values(content.houseDefinitionsById ?? {})).map(
        (house) => [house.id, house as unknown as Record<string, unknown>]
      )
    ),
  };
}

function applyStorySettlementState(
  runtime: StoryRuntimeContext,
  settlementState: {
    people: Record<string, Record<string, unknown>>;
    cities: Record<string, Record<string, unknown>>;
    buildings: Record<string, Record<string, unknown>>;
  }
): StoryRuntimeContext {
  return {
    ...runtime,
    characterDefinitions: runtime.characterDefinitions.map(
      (character) =>
        (settlementState.people?.[character.id] as CharacterDefinition | undefined) ??
        character
    ),
    ...(runtime.cityDefinitions == null
      ? {}
      : {
          cityDefinitions: runtime.cityDefinitions.map(
            (city) =>
              (settlementState.cities?.[city.id] as CityDefinition | undefined) ?? city
          ),
        }),
    ...(runtime.houseDefinitions == null
      ? {}
      : {
          houseDefinitions: runtime.houseDefinitions.map(
            (house) =>
              (settlementState.buildings?.[house.id] as HouseDefinition | undefined) ??
              house
          ),
        }),
  };
}

function readStoryProgressionMetricValue(
  settlementState: {
    people: Record<string, Record<string, unknown>>;
    cities: Record<string, Record<string, unknown>>;
    buildings: Record<string, Record<string, unknown>>;
  },
  track: ProgressTrackDefinition,
  binding: ProgressTrackBinding
): number | null {
  const hostId = binding.host.id?.trim() ?? "";
  if (hostId.length === 0) {
    return null;
  }

  const hostRecord =
    binding.host.family === "person"
      ? settlementState.people[hostId]
      : binding.host.family === "city"
        ? settlementState.cities[hostId]
        : binding.host.family === "building"
          ? settlementState.buildings[hostId]
          : undefined;
  if (hostRecord == null) {
    return null;
  }

  const pathValue = readStoryProgressionRecordPath(hostRecord, track.metricKey);
  if (typeof pathValue === "number" && Number.isFinite(pathValue)) {
    return pathValue;
  }
  const customProperties = hostRecord.customProperties;
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

function createStoryProgressionOccurredAt(state: GameState): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${String(state.calendar.year).padStart(4, "0")}-${pad(
    state.calendar.month
  )}-${pad(state.calendar.day)}T00:00:00.000Z`;
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
    ...(runtime.cityDefinitions == null ? {} : { cityDefinitions: runtime.cityDefinitions }),
    ...(runtime.houseDefinitions == null ? {} : { houseDefinitions: runtime.houseDefinitions }),
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
      ...(runtime.cityDefinitions == null ? {} : { cityDefinitions: runtime.cityDefinitions }),
      ...(runtime.houseDefinitions == null ? {} : { houseDefinitions: runtime.houseDefinitions }),
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
