import type { ChoiceOption, SceneDefinition } from "../../domain/action";
import type { CharacterDefinition } from "../../domain/character";
import type { EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import { applyEffects } from "../effects/effect-applier";
import {
  continueToEvent,
  resolveEventContinuation,
} from "../events/event-continuation";
import {
  createNavigateRequest,
  runNavigationRuntime,
} from "../../core/runtime/navigation-runtime";

export type ChoiceResolutionContext = {
  sceneDefinitionsById: Record<string, SceneDefinition>;
  eventDefinitionsById: Record<string, EventDefinition>;
  characterDefinitions: CharacterDefinition[];
  continueFromChoiceEvent?:
    | ((input: {
        state: GameState;
        characterDefinitions: CharacterDefinition[];
        eventDefinition: EventDefinition;
      }) => {
        state: GameState;
        characterDefinitions: CharacterDefinition[];
      })
    | undefined;
};

export type ChoiceResolutionResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
};

export function resolveChoiceOption(
  state: GameState,
  selectedOption: ChoiceOption,
  context: ChoiceResolutionContext
): ChoiceResolutionResult {
  let nextState = state;
  let nextCharacterDefinitions = context.characterDefinitions;

  if (selectedOption.effects != null && selectedOption.effects.length > 0) {
    const effectResult = applyEffects(nextState, selectedOption.effects, {
      characterDefinitions: nextCharacterDefinitions,
    });

    nextState = effectResult.state;
    nextCharacterDefinitions = effectResult.characterDefinitions;
  }

  if (selectedOption.nextEventId != null) {
    const targetEvent = context.eventDefinitionsById[selectedOption.nextEventId];
    if (targetEvent != null) {
      if (context.continueFromChoiceEvent != null) {
        const continuation = resolveEventContinuation({
          state: nextState,
          eventDefinitionsById: context.eventDefinitionsById,
          sourceEventId: nextState.scene.activeEventId,
          targetEventId: targetEvent.id,
          visitedEventIds:
            nextState.scene.activeEventId == null
              ? []
              : [nextState.scene.activeEventId],
        });
        if (continuation == null) {
          nextState = finishChoiceScene(nextState);
        } else {
          const continuedRuntime = context.continueFromChoiceEvent({
            state: nextState,
            characterDefinitions: nextCharacterDefinitions,
            eventDefinition: continuation.eventDefinition,
          });
          nextState = continuedRuntime.state;
          nextCharacterDefinitions = continuedRuntime.characterDefinitions;
        }
      } else {
        const continuation = continueToEvent({
          state: nextState,
          eventDefinitionsById: context.eventDefinitionsById,
          sourceEventId: nextState.scene.activeEventId,
          targetEventId: targetEvent.id,
          visitedEventIds:
            nextState.scene.activeEventId == null
              ? []
              : [nextState.scene.activeEventId],
        });
        nextState =
          continuation == null
            ? finishChoiceScene(nextState)
            : continuation.state;
      }
    }
  } else if (selectedOption.nextSceneId != null) {
    nextState = {
      ...nextState,
      scene: {
        ...nextState.scene,
        activeSceneId: selectedOption.nextSceneId,
        cursor: 0,
        status: "playing",
      },
    };
  } else {
    nextState = {
      ...nextState,
      scene: {
        ...nextState.scene,
        cursor: nextState.scene.cursor + 1,
        status: "playing",
      },
    };
  }

  return {
    state: nextState,
    characterDefinitions: nextCharacterDefinitions,
  };
}

function finishChoiceScene(state: GameState): GameState {
  const navigationState = resolveChoiceOwnerNavigationState(state);
  return {
    ...navigationState,
    scene: {
      ...navigationState.scene,
      activeEventId: null,
      activeSceneId: null,
      cursor: 0,
      status: "idle",
    },
  };
}

function resolveChoiceOwnerNavigationState(state: GameState): GameState {
  if (state.world.currentHouseId == null) {
    return runNavigationRuntime({
      state,
      request: createNavigateRequest({
        kind: "city",
        cityId: state.world.currentCityId,
      }),
    }).state;
  }

  return runNavigationRuntime({
    state,
    request: createNavigateRequest({
      kind: "reenterBuilding",
      houseId: state.world.currentHouseId,
    }),
  }).state;
}
