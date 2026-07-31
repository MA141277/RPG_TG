import type { CharacterDefinition } from "../../../../domain/character";
import type { CityBeggingGameCompletionResult } from "../../../../domain/city-begging-minigame";
import type { Effect } from "../../../../core/contracts/effect";
import type { RuntimeState } from "../../../../core/contracts/runtime-state";
import type { CharacterStatusById } from "../../../../domain/character-status";
import {
  createCityBeggingMiniGameState,
  resolveCityBeggingMiniGameCompletion,
  setCityBeggingMiniGamePointer,
  updateCityBeggingMiniGameState,
} from "./city-begging-minigame";

export function launchCityBeggingPlayable(input: {
  state: RuntimeState;
  now: number;
}): RuntimeState {
  return {
    ...input.state,
    core: {
      ...input.state.core,
      runtime: {
        ...input.state.core.runtime,
        playableSession: {
          sessionId: "playable.city-begging",
          playableId: "city-begging",
          integrationId: "playable.city-begging.external.default",
          family: "minigame",
          ownerContext: {
            ownerKind: "external",
            ownerId: null,
            returnPolicy: "close-only",
          },
          status: "active",
        },
      },
    },
    app: {
      ...input.state.app,
      beggingMiniGameState: createCityBeggingMiniGameState(input.now),
    },
  };
}

export function updateCityBeggingPointerPlayable(input: {
  state: RuntimeState;
  pointerX: number;
}): RuntimeState {
  const currentState = input.state.app.beggingMiniGameState;
  if (currentState == null) {
    return input.state;
  }

  return {
    ...input.state,
    app: {
      ...input.state.app,
      beggingMiniGameState: setCityBeggingMiniGamePointer(
        currentState,
        input.pointerX
      ),
    },
  };
}

export function tickCityBeggingPlayable(input: {
  state: RuntimeState;
  now: number;
}): RuntimeState {
  const currentState = input.state.app.beggingMiniGameState;
  if (currentState == null) {
    return input.state;
  }

  return {
    ...input.state,
    app: {
      ...input.state.app,
      beggingMiniGameState: updateCityBeggingMiniGameState(currentState, input.now),
    },
  };
}

export function completeCityBeggingPlayable(input: {
  state: RuntimeState;
  playerCharacterId: string;
  characterDefinitions: CharacterDefinition[];
  result: CityBeggingGameCompletionResult;
}): {
  state: RuntimeState;
  effects: Effect[];
  characterStatusById: CharacterStatusById;
} {
  const completion = resolveCityBeggingMiniGameCompletion({
    state: input.state.core,
    characterDefinitions: input.characterDefinitions,
    playerCharacterId: input.playerCharacterId,
    result: input.result,
  });

  return {
    state: {
      ...input.state,
      core: {
        ...input.state.core,
        runtime: {
          ...input.state.core.runtime,
          playableSession:
            input.state.core.runtime.playableSession == null
              ? null
              : {
                  ...input.state.core.runtime.playableSession,
                  status: "completed",
                },
        },
      },
      app: {
        ...input.state.app,
        beggingMiniGameState: null,
      },
    },
    effects: completion.effects,
    characterStatusById: completion.characterStatusById,
  };
}

export function exitCityBeggingPlayable(state: RuntimeState): RuntimeState {
  return {
    ...state,
    core: {
      ...state.core,
      runtime: {
        ...state.core.runtime,
        playableSession: null,
      },
    },
    app: {
      ...state.app,
      beggingMiniGameState: null,
    },
  };
}
