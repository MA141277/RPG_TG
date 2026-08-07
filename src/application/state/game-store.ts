import type { CharacterDefinition } from "../../domain/character";
import type { EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { ActivityDefinition } from "../../domain/activity";
import type { SceneDefinition } from "../../domain/action";
import type { ChoiceOption } from "../../domain/action";
import type { FlowPlayableDefinition } from "../../domain/playables/flow";
import type { RuntimeEventEntity } from "../../core/contracts/event-router";
import type { RuntimeState } from "../../core/contracts/runtime-state";
import { createEventRouteActivationHandlers } from "../../core/runtime/event-route-activation";
import { createRuntimeEventEntity } from "../../core/runtime/event-entity-projection";
import { dispatchEventRoute } from "../../core/runtime/event-router";
import { dispatchRuntimeRequest } from "../../core/runtime/runtime-dispatch";
import { resolveChoiceOption } from "../scene/choice-resolver";
import { advanceScene, runSceneUntilPause } from "../scene/scene-runner";

export type GameContent = {
  characterDefinitions: CharacterDefinition[];
  eventDefinitionsById: Record<string, EventDefinition>;
  sceneDefinitionsById: Record<string, SceneDefinition>;
  activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
  playableShellsById?: Record<string, FlowPlayableDefinition> | undefined;
  textEntriesById?: Record<string, string> | undefined;
};

export type GameStoreSnapshot = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  currentAction: SceneDefinition["actions"][number] | null;
};

export function createGameStore(initialState: GameState, content: GameContent) {
  let state = initialState;
  let characterDefinitions = content.characterDefinitions;
  let currentAction: SceneDefinition["actions"][number] | null = null;
  const continueFromSceneEvent = ({
    state,
    characterDefinitions,
    eventDefinition,
  }: {
    state: GameState;
    characterDefinitions: CharacterDefinition[];
    eventDefinition: EventDefinition;
  }) => ({
    state: routeGameStoreContinuationEvent({
      state,
      eventDefinition,
      eventDefinitionsById: content.eventDefinitionsById,
    }),
    characterDefinitions,
  });

  return {
    getSnapshot(): GameStoreSnapshot {
      return {
        state,
        characterDefinitions,
        currentAction,
      };
    },
    syncScene(): GameStoreSnapshot {
      const result = runSceneUntilPause(state, {
        sceneDefinitionsById: content.sceneDefinitionsById,
        eventDefinitionsById: content.eventDefinitionsById,
        activityDefinitionsById: content.activityDefinitionsById,
        playableShellsById: content.playableShellsById,
        characterDefinitions,
        textEntriesById: content.textEntriesById,
        continueFromSceneEvent,
      });

      state = result.state;
      characterDefinitions = result.characterDefinitions;
      currentAction = result.currentAction;

      return this.getSnapshot();
    },
    advanceScene(): GameStoreSnapshot {
      const result = advanceScene(state, {
        sceneDefinitionsById: content.sceneDefinitionsById,
        eventDefinitionsById: content.eventDefinitionsById,
        activityDefinitionsById: content.activityDefinitionsById,
        playableShellsById: content.playableShellsById,
        characterDefinitions,
        textEntriesById: content.textEntriesById,
        continueFromSceneEvent,
      });

      state = result.state;
      characterDefinitions = result.characterDefinitions;
      currentAction = result.currentAction;

      return this.getSnapshot();
    },
    chooseOption(selectedOption: ChoiceOption): GameStoreSnapshot {
      const result = resolveChoiceOption(state, selectedOption, {
        sceneDefinitionsById: content.sceneDefinitionsById,
        eventDefinitionsById: content.eventDefinitionsById,
        characterDefinitions,
        continueFromChoiceEvent: continueFromSceneEvent,
      });

      state = result.state;
      characterDefinitions = result.characterDefinitions;

      return this.syncScene();
    },
    replaceState(nextState: GameState): GameStoreSnapshot {
      state = nextState;
      return this.getSnapshot();
    },
  };
}

function routeGameStoreContinuationEvent(input: {
  state: GameState;
  eventDefinition: EventDefinition;
  eventDefinitionsById: Record<string, EventDefinition>;
}): GameState {
  const eventId = input.eventDefinition.id;

  return dispatchRuntimeRequest({
    state: toGameStoreRuntimeState(input.state),
    request: {
      family: "external",
      type: "external",
      eventId,
    },
    context: {
      router: {
        route: ({ state }) =>
          dispatchEventRoute({
            state,
            eventId,
            context: {
              repository: {
                resolveById: (eventId) => {
                  const eventDefinition = input.eventDefinitionsById[eventId];
                  return eventDefinition == null
                    ? null
                    : toGameStoreRuntimeEventEntity(eventDefinition);
                },
              },
              handlers: createEventRouteActivationHandlers({
                eventDefinitionsById: input.eventDefinitionsById,
                fallbackEventDefinition: input.eventDefinition,
              }),
            },
          }),
      },
    },
  }).state.core;
}

function toGameStoreRuntimeState(state: GameState): RuntimeState {
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

function toGameStoreRuntimeEventEntity(
  eventDefinition: EventDefinition
): RuntimeEventEntity {
  const { emitEventIds } = eventDefinition;
  return createRuntimeEventEntity({
    ...eventDefinition,
    ...(emitEventIds == null ? {} : { emitEventIds }),
  });
}
