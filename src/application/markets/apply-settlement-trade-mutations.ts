import type { CharacterDefinition } from "../../domain/character";
import type { CityId } from "../../domain/city";
import type { GameState } from "../../domain/game-state";
import type {
  SettlementTradeGoodId,
  SettlementTradeGoodRuntimeState,
  SettlementTradeMutation,
} from "../../domain/settlement-trade";
import { applyPlayerItemMutations } from "../inventory/player-item-inventory";

function applyPlayerGoldChange(
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  amount: number
): CharacterDefinition[] {
  return characterDefinitions.map((character) =>
    character.id !== playerCharacterId
      ? character
      : {
          ...character,
          stats: {
            ...character.stats,
            gold: character.stats.gold + amount,
          },
        }
  );
}

function createDefaultSettlementTradeEntry(): SettlementTradeGoodRuntimeState {
  return {
    stockQuantity: 0,
    priceMultiplier: 1,
    progressUnits: 0,
    lastTradedDay: null,
  };
}

function readSettlementTradeEntry(
  state: GameState,
  cityId: CityId,
  goodsId: SettlementTradeGoodId
): SettlementTradeGoodRuntimeState {
  return (
    state.runtime.settlementTrade[cityId]?.[goodsId] ??
    createDefaultSettlementTradeEntry()
  );
}

function withSettlementTradeEntry(
  state: GameState,
  cityId: CityId,
  goodsId: SettlementTradeGoodId,
  nextEntry: SettlementTradeGoodRuntimeState
): GameState {
  return {
    ...state,
    runtime: {
      ...state.runtime,
      settlementTrade: {
        ...state.runtime.settlementTrade,
        [cityId]: {
          ...(state.runtime.settlementTrade[cityId] ?? {}),
          [goodsId]: nextEntry,
        },
      },
    },
  };
}

export function applySettlementTradeMutations(input: {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  playerCharacterId: string;
  mutations: readonly SettlementTradeMutation[];
}): { state: GameState; characterDefinitions: CharacterDefinition[] } {
  let nextState = input.state;
  let nextCharacterDefinitions = input.characterDefinitions;

  for (const mutation of input.mutations) {
    switch (mutation.type) {
      case "change-player-gold":
        nextCharacterDefinitions = applyPlayerGoldChange(
          nextCharacterDefinitions,
          input.playerCharacterId,
          mutation.amount
        );
        break;
      case "change-player-item":
        nextState = applyPlayerItemMutations(nextState, [
          {
            itemId: mutation.itemId,
            delta: mutation.delta,
            legacySources: ["market-house"],
          },
        ]);
        break;
      case "set-settlement-trade-stock": {
        const current = readSettlementTradeEntry(
          nextState,
          mutation.cityId,
          mutation.goodsId
        );
        nextState = withSettlementTradeEntry(
          nextState,
          mutation.cityId,
          mutation.goodsId,
          {
            ...current,
            stockQuantity: mutation.stockQuantity,
          }
        );
        break;
      }
      case "set-settlement-trade-multiplier": {
        const current = readSettlementTradeEntry(
          nextState,
          mutation.cityId,
          mutation.goodsId
        );
        nextState = withSettlementTradeEntry(
          nextState,
          mutation.cityId,
          mutation.goodsId,
          {
            ...current,
            priceMultiplier: mutation.priceMultiplier,
          }
        );
        break;
      }
      case "set-settlement-trade-progress": {
        const current = readSettlementTradeEntry(
          nextState,
          mutation.cityId,
          mutation.goodsId
        );
        nextState = withSettlementTradeEntry(
          nextState,
          mutation.cityId,
          mutation.goodsId,
          {
            ...current,
            progressUnits: mutation.progressUnits,
          }
        );
        break;
      }
      case "set-settlement-trade-last-traded-day": {
        const current = readSettlementTradeEntry(
          nextState,
          mutation.cityId,
          mutation.goodsId
        );
        nextState = withSettlementTradeEntry(
          nextState,
          mutation.cityId,
          mutation.goodsId,
          {
            ...current,
            lastTradedDay: mutation.dayNumber,
          }
        );
        break;
      }
    }
  }

  return {
    state: nextState,
    characterDefinitions: nextCharacterDefinitions,
  };
}
