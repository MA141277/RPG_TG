import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import { assertExists } from "../../shared/assert";
import { getInvestigateDialogue, pickMarketRumor } from "./grain-market";
import {
  advanceGrainShopTime,
  mutateGrainShopRelationship,
  setGrainPrice,
  type GrainShopMutationResult,
} from "./grain-shop-mutations";
import { createGrainShopSnapshot } from "./grain-shop-snapshot";
import { getQuotedGrainPrice } from "./grain-market";

export type InvestigateGrainMarketResult = {
  mutation: GrainShopMutationResult;
  dialogue: string;
  rumor: string;
  grainPrice: number;
};

export function investigateGrainMarket(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  textEntriesById?: Record<string, string>
): InvestigateGrainMarketResult {
  const marketQuote = getQuotedGrainPrice(state);
  const playerCharacter = characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === playerCharacterId
  );
  assertExists(playerCharacter, `Player character not found for id "${playerCharacterId}".`);
  const syncedState = setGrainPrice(marketQuote.state, marketQuote.buyPrice);
  const snapshot = createGrainShopSnapshot(syncedState, playerCharacter);

  let nextState = mutateGrainShopRelationship(syncedState, 1);
  nextState = advanceGrainShopTime(nextState);

  return {
    mutation: {
      state: nextState,
      characterDefinitions,
    },
    dialogue: getInvestigateDialogue(snapshot.grainPrice, textEntriesById),
    rumor: pickMarketRumor(textEntriesById),
    grainPrice: snapshot.grainPrice,
  };
}
