import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import {
  convertShiToDou,
  formatGrainAsShiAndDou,
} from "../../domain/grain-unit";
import type { GrainShopTradeMode } from "../../domain/grain-shop";
import { assertExists } from "../../shared/assert";
import { getTradeTotal } from "./grain-market";
import {
  advanceGrainShopTime,
  mutateGrainShopFood,
  mutatePlayerGold,
  type GrainShopMutationResult,
} from "./grain-shop-mutations";
import { createGrainShopSnapshot } from "./grain-shop-snapshot";
import { ensurePlayerGrainInventory } from "../inventory/trade-inventory";

export type GrainTradeResult =
  | { ok: true; mutation: GrainShopMutationResult; message: string }
  | { ok: false; errorTitle: string; errorMessage: string };

export function executeGrainTrade(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  mode: GrainShopTradeMode,
  quantity: number,
  grainPrice: number
): GrainTradeResult {
  const total = getTradeTotal(grainPrice, quantity);
  const syncedState = ensurePlayerGrainInventory(state);
  const playerCharacter = characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === playerCharacterId
  );
  assertExists(playerCharacter, `Player character not found for id "${playerCharacterId}".`);
  const snapshot = createGrainShopSnapshot(syncedState, playerCharacter);

  if (mode === "buy") {
    if (snapshot.money < total) {
      return {
        ok: false,
        errorTitle: "银钱不足",
        errorMessage: "囊中羞涩，买不起这么多粮食。",
      };
    }

    let nextState = syncedState;
    let nextCharacters = characterDefinitions;
    const goldMutation = mutatePlayerGold(
      nextState,
      nextCharacters,
      playerCharacterId,
      -total
    );
    nextState = goldMutation.state;
    nextCharacters = goldMutation.characterDefinitions;
    nextState = mutateGrainShopFood(nextState, quantity);
    nextState = advanceGrainShopTime(nextState);

    return {
      ok: true,
      mutation: { state: nextState, characterDefinitions: nextCharacters },
      message: `已购入 ${formatGrainAsShiAndDou(convertShiToDou(quantity))} 粮食，花费 ${total} 文。`,
    };
  }

  if (snapshot.sellableFoodShi < quantity) {
    return {
      ok: false,
      errorTitle: "粮食不足",
      errorMessage: "随身带的粮食不够这么多。",
    };
  }

  let nextState = syncedState;
  let nextCharacters = characterDefinitions;
  const goldMutation = mutatePlayerGold(
    nextState,
    nextCharacters,
    playerCharacterId,
    total
  );
  nextState = goldMutation.state;
  nextCharacters = goldMutation.characterDefinitions;
  nextState = mutateGrainShopFood(nextState, -quantity);
  nextState = advanceGrainShopTime(nextState);

  return {
    ok: true,
    mutation: { state: nextState, characterDefinitions: nextCharacters },
    message: `已卖出 ${formatGrainAsShiAndDou(convertShiToDou(quantity))} 粮食，收入 ${total} 文。`,
  };
}
