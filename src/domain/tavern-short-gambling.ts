import {
  buildTavernShortPots,
  compareTavernShortBestFives,
  evaluateBestTavernShortShowdown,
  splitTavernShortPot,
} from "./tavern-short-gambling-evaluator";

export type TavernShortSuit = "wan" | "bing" | "tong" | "tiao";

export type TavernShortCard = {
  id: string;
  suit: TavernShortSuit;
  rank: number;
};

export type TavernShortBestFive = {
  category:
    | "high-card"
    | "one-pair"
    | "two-pair"
    | "three-of-a-kind"
    | "straight"
    | "flush"
    | "full-house"
    | "four-of-a-kind"
    | "straight-flush"
    | "royal-flush";
  label: string;
  scoreKey: number[];
  cards: TavernShortCard[];
};

export type TavernShortPot = {
  id: string;
  amount: number;
  eligibleSeatIds: string[];
};

const SUITS: TavernShortSuit[] = ["wan", "bing", "tong", "tiao"];

const SUIT_LABELS: Record<TavernShortSuit, string> = {
  wan: "万",
  bing: "饼",
  tong: "筒",
  tiao: "条",
};

export function createTavernShortDeck(): TavernShortCard[] {
  return SUITS.flatMap((suit) =>
    Array.from({ length: 13 }, (_, index) => ({
      id: `${suit}-${index + 1}`,
      suit,
      rank: index + 1,
    }))
  );
}

export function shuffleTavernShortDeck(
  deck: readonly TavernShortCard[],
  seed: number
): TavernShortCard[] {
  const shuffled = [...deck];
  let cursor = seed <= 0 ? 1 : seed;
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    cursor = (cursor * 1664525 + 1013904223) >>> 0;
    const swapIndex = cursor % (index + 1);
    const current = shuffled[index];
    const swap = shuffled[swapIndex];
    if (current != null && swap != null) {
      shuffled[index] = swap;
      shuffled[swapIndex] = current;
    }
  }
  return shuffled;
}

export function getTavernShortCardLabel(card: TavernShortCard): string {
  return `${card.rank}${SUIT_LABELS[card.suit]}`;
}

export {
  buildTavernShortPots,
  compareTavernShortBestFives,
  evaluateBestTavernShortShowdown,
  splitTavernShortPot,
};
