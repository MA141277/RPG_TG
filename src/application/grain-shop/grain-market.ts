import {
  GRAIN_PRICE_MAX,
  GRAIN_PRICE_MIN,
  GRAIN_SHOP_VARIABLE_KEYS,
} from "../../domain/grain-shop";
import {
  grainShopMarketRumors,
  grainShopNpcDefaultLines,
  grainShopNpcGreetings,
} from "../../content/houses/grain-shop-content";
import { pickRandom, randomInt } from "../../shared/random";

export function rollGrainPrice(): number {
  return randomInt(GRAIN_PRICE_MIN, GRAIN_PRICE_MAX);
}

export function pickNpcGreeting(): string {
  return pickRandom(grainShopNpcGreetings);
}

export function pickNpcDefaultLine(): string {
  return pickRandom(grainShopNpcDefaultLines);
}

export function pickMarketRumor(): string {
  return pickRandom(grainShopMarketRumors);
}

export function getInvestigateDialogue(price: number): string {
  if (price > 130) {
    return "近来怕是要涨。";
  }
  if (price < 100) {
    return "如今粮路通畅，价倒是便宜。";
  }
  return "粮价还算平稳。";
}

export function getTradeTotal(grainPrice: number, quantity: number): number {
  return grainPrice * quantity;
}

export function setGrainPriceVariable(
  variables: Record<string, number | string | boolean>,
  grainPrice: number
): Record<string, number | string | boolean> {
  return {
    ...variables,
    [GRAIN_SHOP_VARIABLE_KEYS.grainPrice]: grainPrice,
  };
}
