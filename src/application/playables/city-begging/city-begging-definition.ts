import type { CharacterDefinition } from "../../../domain/character";
import type { CityBeggingGameCompletionResult } from "../../../domain/city-begging-minigame";
import type { RuntimeState } from "../../../core/contracts/runtime-state";
import {
  applyCityBeggingMiniGameCompletion,
  createCityBeggingMiniGameState,
  setCityBeggingMiniGamePointer,
  updateCityBeggingMiniGameState,
} from "../../minigames/city-begging-minigame";

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
  characterDefinitions: CharacterDefinition[];
} {
  const completion = applyCityBeggingMiniGameCompletion(
    input.state.core,
    input.characterDefinitions,
    input.playerCharacterId,
    input.result
  );

  return {
    state: {
      ...input.state,
      core: {
        ...completion.state,
        runtime: {
          ...completion.state.runtime,
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
    characterDefinitions: completion.characterDefinitions,
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
