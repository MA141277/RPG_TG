import { buildStoryTriggerInput } from "../../application/story/story-runtime";
import { startEvent } from "../../application/events/event-runner";
import {
  selectTriggeredEvents,
  type TriggerEvaluatorContext,
} from "../../application/events/trigger-evaluator";
import type { CharacterDefinition } from "../../domain/character";
import type { EventDefinition, EventTriggerTiming } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type {
  EventRuntimeCandidate,
  EventRuntimeInput,
} from "../contracts/event-runtime";
import type { RuntimeRequest } from "../contracts/runtime-request";
import { activateEvent, type ActivatedEvent } from "./event-activation";
import { selectEventCandidate } from "./event-candidate-selector";
import { canActivateEvent } from "./event-condition-evaluator";

export type EventRuntimeResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  activation: ActivatedEvent | null;
  candidate: EventRuntimeCandidate | null;
};

export function createEventTriggerRequest(triggerId: string): RuntimeRequest {
  return {
    family: "external",
    type: "external",
    eventId: triggerId,
  };
}

export function runEventRuntime(input: EventRuntimeInput): EventRuntimeResult {
  const triggeredEvents = selectTriggeredEvents(
    input.state,
    Object.values(input.eventDefinitionsById),
    input.triggerInput,
    createScopedTriggerContext(input.state, input.characterDefinitions)
  );
  const candidate = selectEventCandidate(
    triggeredEvents.map((eventDefinition) =>
      toEventRuntimeCandidate(eventDefinition)
    )
  );

  if (
    !canActivateEvent({
      candidateId: candidate?.eventId ?? null,
      eventDefinitionsById: input.eventDefinitionsById,
      state: input.state,
    })
  ) {
    return {
      state: input.state,
      characterDefinitions: input.characterDefinitions,
      activation: null,
      candidate: null,
    };
  }

  const activation = activateEvent(candidate);
  if (activation == null) {
    return {
      state: input.state,
      characterDefinitions: input.characterDefinitions,
      activation: null,
      candidate,
    };
  }

  const eventDefinition = input.eventDefinitionsById[activation.activeEventId];
  if (eventDefinition == null) {
    return {
      state: input.state,
      characterDefinitions: input.characterDefinitions,
      activation: null,
      candidate,
    };
  }

  return {
    state: startEvent(input.state, eventDefinition),
    characterDefinitions: input.characterDefinitions,
    activation,
    candidate,
  };
}

export function runStoryEventRuntime(input: {
  timing: EventTriggerTiming;
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  eventDefinitionsById: Record<string, EventDefinition>;
}): EventRuntimeResult {
  return runEventRuntime({
    request: createEventTriggerRequest(`story.${input.timing}`),
    state: input.state,
    characterDefinitions: input.characterDefinitions,
    eventDefinitionsById: input.eventDefinitionsById,
    triggerInput: buildStoryTriggerInput(input.timing, input.state),
  });
}

function toEventRuntimeCandidate(
  eventDefinition: EventDefinition
): EventRuntimeCandidate {
  return {
    eventId: eventDefinition.id,
    priority: eventDefinition.trigger?.priority ?? 0,
    sceneId: eventDefinition.entrySceneId,
    taskInputs: eventDefinition.taskInputs ?? [],
  };
}

function createScopedTriggerContext(
  state: GameState,
  characterDefinitions: CharacterDefinition[]
): TriggerEvaluatorContext {
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
