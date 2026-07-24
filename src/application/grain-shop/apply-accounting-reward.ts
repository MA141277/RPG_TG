import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import type { AccountingGrade } from "../../domain/grain-shop";
import {
  advanceGrainShopTime,
  mutateGrainShopRelationship,
  mutatePlayerAccountingLevel,
  mutatePlayerGold,
  type GrainShopMutationResult,
} from "./grain-shop-mutations";
import { spendPlayerStamina } from "../player/player-stamina";
import { getAccountingGradeReward } from "./accounting-minigame";

export function applyAccountingReward(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  grade: AccountingGrade,
  durationDays: number
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

  const mathMutation = mutatePlayerAccountingLevel(
    nextState,
    nextCharacters,
    playerCharacterId,
    reward.math
  );
  nextState = mathMutation.state;
  nextCharacters = mathMutation.characterDefinitions;

  const staminaMutation = spendPlayerStamina(
    nextState,
    nextCharacters,
    playerCharacterId
  );
  nextState = staminaMutation.state;
  nextCharacters = staminaMutation.characterDefinitions;

  nextState = mutateGrainShopRelationship(nextState, reward.relationship);
  nextState = advanceGrainShopTime(nextState, durationDays);

  return {
    state: nextState,
    characterDefinitions: nextCharacters,
  };
}
