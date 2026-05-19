import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import type { AccountingGrade } from "../../domain/grain-shop";
import {
  advanceGrainShopTime,
  mutateGrainShopRelationship,
  mutatePlayerArithmetic,
  mutatePlayerGold,
  type GrainShopMutationResult,
} from "./grain-shop-mutations";
import { getAccountingGradeReward } from "./accounting-minigame";

export function applyAccountingReward(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  grade: AccountingGrade
): GrainShopMutationResult {
  const reward = getAccountingGradeReward(grade);

  let nextState = state;
  let nextCharacters = characterDefinitions;

  const goldMutation = mutatePlayerGold(
    nextState,
    nextCharacters,
    playerCharacterId,
    reward.money
  );
  nextState = goldMutation.state;
  nextCharacters = goldMutation.characterDefinitions;

  const mathMutation = mutatePlayerArithmetic(
    nextState,
    nextCharacters,
    playerCharacterId,
    reward.math
  );
  nextState = mathMutation.state;
  nextCharacters = mathMutation.characterDefinitions;

  nextState = mutateGrainShopRelationship(nextState, reward.relationship);
  nextState = advanceGrainShopTime(nextState);

  return {
    state: nextState,
    characterDefinitions: nextCharacters,
  };
}
