import type { CharacterDefinition } from "../../../domain/character";
import type { CharacterStatusById } from "../../../domain/character-status";
import type {
  CityBeggingGameCompletionResult,
  CityBeggingMiniGameState,
  CityBeggingPlayableState,
} from "../../../domain/city-begging-minigame";
import type { RuntimeState } from "../../../core/contracts/runtime-state";
import {
  advanceCityBeggingDefaultThinking,
  confirmCityBeggingDefaultFortune,
  createCityBeggingDefaultDialogueState,
  selectCityBeggingDefaultLocation,
  selectCityBeggingDefaultOption,
  type CityBeggingDefaultDialogueState,
} from "./city-begging-default-dialogue";
import { applyCityBeggingDefaultSettlement } from "./city-begging-default-settlement";
import {
  applyCityBeggingMiniGameCompletion,
  createCityBeggingMiniGameState,
  setCityBeggingMiniGamePointer,
  updateCityBeggingMiniGameState,
} from "../../minigames/city-begging-minigame";

function isCityBeggingMiniGameState(
  state: CityBeggingPlayableState | null
): state is CityBeggingMiniGameState {
  return state != null && "variantId" in state;
}

function isCityBeggingDefaultDialogueState(
  state: CityBeggingPlayableState | null
): state is CityBeggingDefaultDialogueState {
  return state != null && "mode" in state && state.mode === "default-dialogue";
}

export function launchCityBeggingPlayable(input: {
  state: RuntimeState;
  now: number;
  mode?: "minigame" | "default-dialogue";
}): RuntimeState {
  const beggingState =
    input.mode === "default-dialogue"
      ? createCityBeggingDefaultDialogueState(input.now)
      : createCityBeggingMiniGameState(input.now);

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
      beggingMiniGameState: beggingState,
    },
  };
}

export function updateCityBeggingPointerPlayable(input: {
  state: RuntimeState;
  pointerX: number;
}): RuntimeState {
  const currentState = input.state.app.beggingMiniGameState;
  if (!isCityBeggingMiniGameState(currentState)) {
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
  if (!isCityBeggingMiniGameState(currentState)) {
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

export function selectCityBeggingDefaultLocationPlayable(input: {
  state: RuntimeState;
  locationId: string;
}): RuntimeState {
  const currentState = input.state.app.beggingMiniGameState;
  if (!isCityBeggingDefaultDialogueState(currentState)) {
    return input.state;
  }

  return {
    ...input.state,
    app: {
      ...input.state.app,
      beggingMiniGameState: selectCityBeggingDefaultLocation(
        currentState,
        input.locationId
      ),
    },
  };
}

export function selectCityBeggingDefaultOptionPlayable(input: {
  state: RuntimeState;
  optionId: string;
  now: number;
}): RuntimeState {
  const currentState = input.state.app.beggingMiniGameState;
  if (!isCityBeggingDefaultDialogueState(currentState)) {
    return input.state;
  }

  return {
    ...input.state,
    app: {
      ...input.state.app,
      beggingMiniGameState: selectCityBeggingDefaultOption(
        currentState,
        input.optionId,
        input.now
      ),
    },
  };
}

export function confirmCityBeggingDefaultFortunePlayable(input: {
  state: RuntimeState;
}): RuntimeState {
  const currentState = input.state.app.beggingMiniGameState;
  if (!isCityBeggingDefaultDialogueState(currentState)) {
    return input.state;
  }

  return {
    ...input.state,
    app: {
      ...input.state.app,
      beggingMiniGameState: confirmCityBeggingDefaultFortune(currentState),
    },
  };
}

export function tickCityBeggingDefaultDialoguePlayable(input: {
  state: RuntimeState;
  now: number;
}): RuntimeState {
  const currentState = input.state.app.beggingMiniGameState;
  if (!isCityBeggingDefaultDialogueState(currentState)) {
    return input.state;
  }

  return {
    ...input.state,
    app: {
      ...input.state.app,
      beggingMiniGameState: advanceCityBeggingDefaultThinking(
        currentState,
        input.now
      ),
    },
  };
}

export function confirmCityBeggingDefaultOutcomePlayable(input: {
  state: RuntimeState;
  characterDefinitions: CharacterDefinition[];
  playerCharacterId?: string | undefined;
}): {
  state: RuntimeState;
  characterDefinitions: CharacterDefinition[];
  characterStatusById: CharacterStatusById;
} {
  const currentState = input.state.app.beggingMiniGameState;
  if (
    !isCityBeggingDefaultDialogueState(currentState) ||
    currentState.phase !== "outcome" ||
    currentState.settlementApplied
  ) {
    return {
      state: input.state,
      characterDefinitions: input.characterDefinitions,
      characterStatusById: {},
    };
  }

  const settlement = applyCityBeggingDefaultSettlement(input);

  return {
    state: {
      ...settlement.state,
      core: {
        ...settlement.state.core,
        runtime: {
          ...settlement.state.core.runtime,
          playableSession: null,
        },
      },
      app: {
        ...settlement.state.app,
        beggingMiniGameState: null,
      },
    },
    characterDefinitions: settlement.characterDefinitions,
    characterStatusById: settlement.characterStatusById,
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
  characterStatusById: CharacterStatusById;
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
