import type { ActionNode, SceneDefinition } from "../../domain/action";
import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import type { EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { FlowPlayableDefinition } from "../../domain/playables/flow";
import { runActivity } from "../activity/activity-runner";
import { applyEffects } from "../effects/effect-applier";
import {
  continueToEvent,
  createEventContinuationTracker,
  resolveEventContinuation,
} from "../events/event-continuation";
import { runEventPlayableRuntime } from "../events/event-playable-runtime";
import { runStoryCallback } from "../story/story-callbacks";

export type SceneRunnerContext = {
  sceneDefinitionsById: Record<string, SceneDefinition>;
  eventDefinitionsById: Record<string, EventDefinition>;
  activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
  flowPlayablesById?: Record<string, FlowPlayableDefinition> | undefined;
  characterDefinitions: CharacterDefinition[];
  textEntriesById?: Record<string, string> | undefined;
  continueFromSceneEvent?:
    | ((input: {
        state: GameState;
        characterDefinitions: CharacterDefinition[];
        eventDefinition: EventDefinition;
        reason: "start-event" | "scene-end";
      }) => {
        state: GameState;
        characterDefinitions: CharacterDefinition[];
      })
    | undefined;
};

export type SceneStepResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  currentAction: ActionNode | null;
};

export function runSceneUntilPause(
  state: GameState,
  context: SceneRunnerContext
): SceneStepResult {
  let nextState = state;
  let nextCharacterDefinitions = context.characterDefinitions;
  let continuationVisitedEventIds = createEventContinuationTracker([
    state.scene.activeEventId,
  ]);

  while (nextState.scene.activeSceneId != null) {
    const activeEvent =
      nextState.scene.activeEventId == null
        ? null
        : context.eventDefinitionsById[nextState.scene.activeEventId] ?? null;
    const playableResult = runEventPlayableRuntime({
      state: nextState,
      characterDefinitions: nextCharacterDefinitions,
      eventDefinition: activeEvent,
      activityDefinitionsById: context.activityDefinitionsById,
      flowPlayablesById: context.flowPlayablesById,
      textEntriesById: context.textEntriesById,
    });
    if (playableResult?.handled) {
      return {
        state: playableResult.state,
        characterDefinitions: playableResult.characterDefinitions,
        currentAction: null,
      };
    }

    const activeScene = context.sceneDefinitionsById[nextState.scene.activeSceneId];
    if (activeScene == null) {
      const continuedState = continueSceneEvent(
        nextState,
        nextCharacterDefinitions,
        context,
        continuationVisitedEventIds
      );
      if (continuedState != null) {
        nextState = continuedState.state;
        nextCharacterDefinitions = continuedState.characterDefinitions;
        continuationVisitedEventIds = continuedState.visitedEventIds;
        continue;
      }
      return finishScene(nextState, nextCharacterDefinitions);
    }

    const currentAction = activeScene.actions[nextState.scene.cursor] ?? null;
    if (currentAction == null) {
      const continuedState = continueSceneEvent(
        nextState,
        nextCharacterDefinitions,
        context,
        continuationVisitedEventIds
      );
      if (continuedState != null) {
        nextState = continuedState.state;
        nextCharacterDefinitions = continuedState.characterDefinitions;
        continuationVisitedEventIds = continuedState.visitedEventIds;
        continue;
      }
      return finishScene(nextState, nextCharacterDefinitions);
    }

    if (
      currentAction.type === "background" ||
      currentAction.type === "music" ||
      currentAction.type === "narration" ||
      currentAction.type === "dialogue"
    ) {
      return {
        state: {
          ...nextState,
          scene: {
            ...nextState.scene,
            status: "playing",
          },
        },
        characterDefinitions: nextCharacterDefinitions,
        currentAction,
      };
    }

    if (currentAction.type === "choice") {
      return {
        state: {
          ...nextState,
          scene: {
            ...nextState.scene,
            status: "waiting-choice",
          },
        },
        characterDefinitions: nextCharacterDefinitions,
        currentAction,
      };
    }

    if (currentAction.type === "effect") {
      const effectResult = applyEffects(nextState, currentAction.effects, {
        characterDefinitions: nextCharacterDefinitions,
      });

      nextState = incrementSceneCursor(effectResult.state);
      nextCharacterDefinitions = effectResult.characterDefinitions;
      continue;
    }

    if (currentAction.type === "jump") {
      nextState = {
        ...nextState,
        scene: {
          ...nextState.scene,
          activeSceneId: currentAction.nextSceneId,
          cursor: 0,
          status: "playing",
        },
      };
      continue;
    }

    if (currentAction.type === "start-event") {
      if (context.continueFromSceneEvent != null) {
        const continuation = resolveEventContinuation({
          state: nextState,
          eventDefinitionsById: context.eventDefinitionsById,
          sourceEventId: nextState.scene.activeEventId,
          targetEventId: currentAction.eventId,
          visitedEventIds: continuationVisitedEventIds,
        });
        if (continuation == null) {
          nextState = incrementSceneCursor(nextState);
          continuationVisitedEventIds = createEventContinuationTracker([
            nextState.scene.activeEventId,
          ]);
          continue;
        }
        const continuedRuntime = context.continueFromSceneEvent({
          state: nextState,
          characterDefinitions: nextCharacterDefinitions,
          eventDefinition: continuation.eventDefinition,
          reason: "start-event",
        });
        nextState = continuedRuntime.state;
        nextCharacterDefinitions = continuedRuntime.characterDefinitions;
        continuationVisitedEventIds = continuation.visitedEventIds;
      } else {
        const continuation = continueToEvent({
          state: nextState,
          eventDefinitionsById: context.eventDefinitionsById,
          sourceEventId: nextState.scene.activeEventId,
          targetEventId: currentAction.eventId,
          visitedEventIds: continuationVisitedEventIds,
        });
        if (continuation == null) {
          nextState = incrementSceneCursor(nextState);
          continuationVisitedEventIds = createEventContinuationTracker([
            nextState.scene.activeEventId,
          ]);
          continue;
        }
        nextState = continuation.state;
        continuationVisitedEventIds = continuation.visitedEventIds;
      }
      continue;
    }

    if (currentAction.type === "start-activity") {
      const activityResult =
        context.activityDefinitionsById == null
          ? null
          : runActivity(
              nextState,
              currentAction.activityId,
              {
                activityDefinitionsById: context.activityDefinitionsById,
                characterDefinitions: nextCharacterDefinitions,
              },
              currentAction.fallbackActivityId
            );

      nextState = incrementSceneCursor(activityResult?.state ?? nextState);
      nextCharacterDefinitions =
        activityResult?.characterDefinitions ?? nextCharacterDefinitions;
      continue;
    }

    if (currentAction.type === "callback") {
      const callbackResult = runStoryCallback(currentAction.handlerId, currentAction.payload, {
        state: nextState,
        characterDefinitions: nextCharacterDefinitions,
        textEntriesById: context.textEntriesById,
      });
      nextState = incrementSceneCursor(callbackResult.state);
      nextCharacterDefinitions = callbackResult.characterDefinitions;
      continue;
    }

    nextState = incrementSceneCursor(nextState);
  }

  return finishScene(nextState, nextCharacterDefinitions);
}

export function advanceScene(
  state: GameState,
  context: SceneRunnerContext
): SceneStepResult {
  return runSceneUntilPause(incrementSceneCursor(state), context);
}

function incrementSceneCursor(state: GameState): GameState {
  return {
    ...state,
    scene: {
      ...state.scene,
      cursor: state.scene.cursor + 1,
    },
  };
}

function finishScene(
  state: GameState,
  characterDefinitions: CharacterDefinition[]
): SceneStepResult {
  return {
    state: {
      ...state,
      scene: {
        ...state.scene,
        activeEventId: null,
        activeSceneId: null,
        cursor: 0,
        status: "idle",
      },
      ui: {
        ...state.ui,
        currentView: state.world.currentHouseId == null ? "city" : "house",
      },
    },
    characterDefinitions,
    currentAction: null,
  };
}

function continueSceneEvent(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  context: SceneRunnerContext,
  visitedEventIds: Iterable<string>
) {
  const activeEventId = state.scene.activeEventId;
  const nextEventId =
    activeEventId == null
      ? undefined
      : context.eventDefinitionsById[activeEventId]?.nextEventId;
  if (context.continueFromSceneEvent != null) {
    const continuation = resolveEventContinuation({
      state,
      eventDefinitionsById: context.eventDefinitionsById,
      sourceEventId: activeEventId,
      targetEventId: nextEventId,
      visitedEventIds,
    });
    if (continuation == null) {
      return null;
    }
    const continuedRuntime = context.continueFromSceneEvent({
      state,
      characterDefinitions,
      eventDefinition: continuation.eventDefinition,
      reason: "scene-end",
    });
    return {
      state: continuedRuntime.state,
      characterDefinitions: continuedRuntime.characterDefinitions,
      visitedEventIds: continuation.visitedEventIds,
    };
  }

  const continuation = continueToEvent({
    state,
    eventDefinitionsById: context.eventDefinitionsById,
    sourceEventId: activeEventId,
    targetEventId: nextEventId,
    visitedEventIds,
  });
  if (continuation == null) {
    return null;
  }

  return {
    state: continuation.state,
    characterDefinitions,
    visitedEventIds: continuation.visitedEventIds,
  };
}
