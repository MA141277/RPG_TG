import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import type { EventDefinition, EventTriggerTiming } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { SceneDefinition } from "../../domain/action";
import { runSceneUntilPause } from "../../application/scene/scene-runner";
import type { RuntimeEventEntity } from "../contracts/event-router";
import type {
  SceneRuntimeInput,
  SceneRuntimeResult,
} from "../contracts/scene-runtime";
import type { RuntimeState } from "../contracts/runtime-state";
import { runStoryEventRuntime } from "./event-runtime";
import { createRuntimeEventEntity } from "./event-entity-projection";
import { createEventRouteActivationHandlers } from "./event-route-activation";
import { dispatchEventRoute } from "./event-router";
import { createSceneSession } from "./scene-session";

export function runSceneFromEvent(input: SceneRuntimeInput): SceneRuntimeResult {
  const result = runSceneUntilPause(input.state, {
    sceneDefinitionsById: input.sceneDefinitionsById,
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
  flowPlayablesById?: Record<string, import("../../domain/playables/flow").FlowPlayableDefinition>;
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
    flowPlayablesById: input.flowPlayablesById,
    textEntriesById: input.textEntriesById,
  });
}

export function routeSceneRuntimeContinuationEvent(input: {
  state: GameState;
  eventDefinition: EventDefinition;
  eventDefinitionsById: Record<string, EventDefinition>;
}): GameState {
  return dispatchEventRoute({
    state: toSceneRuntimeState(input.state),
    eventId: input.eventDefinition.id,
    context: {
      repository: {
        resolveById: (eventId) => {
          const eventDefinition = input.eventDefinitionsById[eventId];
          return eventDefinition == null
            ? null
            : toSceneRuntimeEventEntity(eventDefinition);
        },
      },
      handlers: createEventRouteActivationHandlers({
        eventDefinitionsById: input.eventDefinitionsById,
        fallbackEventDefinition: input.eventDefinition,
      }),
    },
  }).state.core;
}

function toSceneRuntimeState(state: GameState): RuntimeState {
  return {
    core: state,
    app: {
      beggingMiniGameState: null,
      autoAdvanceState: null,
      campaignTravelState: null,
      cityDirectoryState: null,
      cityMenuState: null,
      locationDialogueState: null,
      modalState: null,
    },
    view: {},
  };
}

function toSceneRuntimeEventEntity(
  eventDefinition: EventDefinition
): RuntimeEventEntity {
  const { emitEventIds } = eventDefinition;
  return createRuntimeEventEntity({
    ...eventDefinition,
    ...(emitEventIds == null ? {} : { emitEventIds }),
  });
}
