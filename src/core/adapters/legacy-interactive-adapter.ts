import {
  advanceActivityQteMarker,
  stopActivityQte,
  type ActivityQteCompletionResult,
} from "../../application/activity/activity-qte-runtime";
import {
  applyCityBeggingMiniGameCompletion,
  createCityBeggingMiniGameState,
  setCityBeggingMiniGamePointer,
  updateCityBeggingMiniGameState,
} from "../../application/minigames/city-begging-minigame";
import {
  dispatchStoryBattleAction,
  type StoryBattleActionResult,
  type StoryBattleTextContext,
} from "../../application/story-battle/story-battle-runtime";
import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import type {
  CityBeggingGameCompletionResult,
  CityBeggingMiniGameState,
} from "../../domain/city-begging-minigame";
import type { GameState } from "../../domain/game-state";

export function createLegacyCityBeggingSession(
  now: number
): CityBeggingMiniGameState {
  return createCityBeggingMiniGameState(now);
}

export function updateLegacyCityBeggingPointer(
  state: CityBeggingMiniGameState,
  pointerX: number
): CityBeggingMiniGameState {
  return setCityBeggingMiniGamePointer(state, pointerX);
}

export function tickLegacyCityBeggingSession(
  state: CityBeggingMiniGameState,
  now: number
): CityBeggingMiniGameState {
  return updateCityBeggingMiniGameState(state, now);
}

export function applyLegacyCityBeggingCompletion(input: {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  playerCharacterId: string;
  result: CityBeggingGameCompletionResult;
}): ActivityQteCompletionResult {
  return applyCityBeggingMiniGameCompletion(
    input.state,
    input.characterDefinitions,
    input.playerCharacterId,
    input.result
  );
}

export function tickLegacyActivityQte(state: GameState): GameState {
  return advanceActivityQteMarker(state);
}

export function stopLegacyActivityQte(input: {
  state: GameState;
  activityDefinition: ActivityDefinition;
  characterDefinitions: CharacterDefinition[];
}): ActivityQteCompletionResult {
  return stopActivityQte(
    input.state,
    input.activityDefinition,
    input.characterDefinitions
  );
}

export function dispatchLegacyStoryBattleAction(
  state: GameState,
  actionId: string,
  context: StoryBattleTextContext = {}
): StoryBattleActionResult {
  return dispatchStoryBattleAction(state, actionId, context);
}
