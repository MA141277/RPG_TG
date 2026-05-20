import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import { assertExists } from "../../shared/assert";
import { getInvestigateDialogue, pickMarketRumor } from "./grain-market";
import {
  advanceGrainShopTime,
  mutateGrainShopRelationship,
  type GrainShopMutationResult,
} from "./grain-shop-mutations";
import { createGrainShopSnapshot } from "./grain-shop-snapshot";

export type InvestigateGrainMarketResult = {
  mutation: GrainShopMutationResult;
  dialogue: string;
  rumor: string;
  grainPrice: number;
};

export function investigateGrainMarket(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string
): InvestigateGrainMarketResult {
  const playerCharacter = characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === playerCharacterId
  );
  assertExists(playerCharacter, `Player character not found for id "${playerCharacterId}".`);
  const snapshot = createGrainShopSnapshot(state, playerCharacter);

  let nextState = mutateGrainShopRelationship(state, 1);
  nextState = advanceGrainShopTime(nextState);

  return {
    mutation: {
      state: nextState,
      characterDefinitions,
    },
    dialogue: getInvestigateDialogue(snapshot.grainPrice),
    rumor: pickMarketRumor(),
    grainPrice: snapshot.grainPrice,
  };
}
