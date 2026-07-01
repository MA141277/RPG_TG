import {
  advanceActivityQteMarker,
  stopActivityQte,
  type ActivityQteCompletionResult,
} from "../../application/activity/activity-qte-runtime";
import {
  dispatchStoryBattleAction,
  type StoryBattleActionResult,
  type StoryBattleTextContext,
} from "../../application/story-battle/story-battle-runtime";
import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";

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
