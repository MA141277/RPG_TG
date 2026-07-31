import type { CharacterDefinition } from "../../domain/character";
import type { CityId } from "../../domain/city";
import type { GameState } from "../../domain/game-state";
import type {
  SettlementTradeCityRuntimeMeta,
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

function withSettlementTradeCityMeta(
  state: GameState,
  cityId: CityId,
  nextMeta: SettlementTradeCityRuntimeMeta
): GameState {
  return {
    ...state,
    runtime: {
      ...state.runtime,
      settlementTrade: {
        ...state.runtime.settlementTrade,
        [cityId]: {
          ...(state.runtime.settlementTrade[cityId] ?? {}),
          __meta: {
            visibleGoodsIds: [...nextMeta.visibleGoodsIds],
            lastRefreshedDay: nextMeta.lastRefreshedDay,
          },
        },
      },
    },
  };
}

function applySettlementTradeStateMutation(
  state: GameState,
  mutation: Exclude<SettlementTradeMutation, { type: "change-player-gold" }>
): GameState {
  switch (mutation.type) {
    case "change-player-item":
      return applyPlayerItemMutations(state, [
        {
          itemId: mutation.itemId,
          delta: mutation.delta,
          legacySources: ["market-house"],
        },
      ]);
    case "set-settlement-trade-stock": {
      const current = readSettlementTradeEntry(
        state,
        mutation.cityId,
        mutation.goodsId
      );
      return withSettlementTradeEntry(state, mutation.cityId, mutation.goodsId, {
        ...current,
        stockQuantity: mutation.stockQuantity,
      });
    }
    case "set-settlement-trade-multiplier": {
      const current = readSettlementTradeEntry(
        state,
        mutation.cityId,
        mutation.goodsId
      );
      return withSettlementTradeEntry(state, mutation.cityId, mutation.goodsId, {
        ...current,
        priceMultiplier: mutation.priceMultiplier,
      });
    }
    case "set-settlement-trade-progress": {
      const current = readSettlementTradeEntry(
        state,
        mutation.cityId,
        mutation.goodsId
      );
      return withSettlementTradeEntry(state, mutation.cityId, mutation.goodsId, {
        ...current,
        progressUnits: mutation.progressUnits,
      });
    }
    case "set-settlement-trade-last-traded-day": {
      const current = readSettlementTradeEntry(
        state,
        mutation.cityId,
        mutation.goodsId
      );
      return withSettlementTradeEntry(state, mutation.cityId, mutation.goodsId, {
        ...current,
        lastTradedDay: mutation.dayNumber,
      });
    }
    case "set-settlement-trade-city-assortment":
      return withSettlementTradeCityMeta(state, mutation.cityId, {
        visibleGoodsIds: mutation.visibleGoodsIds,
        lastRefreshedDay: mutation.refreshedDay,
      });
  }
}

export function applySettlementTradeStateMutations(
  state: GameState,
  mutations: readonly SettlementTradeMutation[]
): GameState {
  let nextState = state;

  for (const mutation of mutations) {
    if (mutation.type === "change-player-gold") {
      throw new Error(
        "applySettlementTradeStateMutations cannot apply player gold changes."
      );
    }

    nextState = applySettlementTradeStateMutation(nextState, mutation);
  }

  return nextState;
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
      default:
        nextState = applySettlementTradeStateMutation(nextState, mutation);
        break;
    }
  }

  return {
    state: nextState,
    characterDefinitions: nextCharacterDefinitions,
  };
}
