import {
  getTavernShortCardKey,
  getTavernShortCardSortValue,
  isTavernShortSuitedCard,
} from "./tavern-short-gambling-tiles";
import type {
  TavernShortBestFive,
  TavernShortCard,
  TavernShortPot,
} from "./tavern-short-gambling";

const CATEGORY_STRENGTH: Record<TavernShortBestFive["category"], number> = {
  "high-card": 0,
  "one-pair": 1,
  "two-pair": 2,
  "three-of-a-kind": 3,
  straight: 4,
  flush: 5,
  "full-house": 6,
  "four-of-a-kind": 7,
  "straight-flush": 8,
};

const CATEGORY_LABELS: Record<TavernShortBestFive["category"], string> = {
  "high-card": "高牌",
  "one-pair": "一对",
  "two-pair": "两对",
  "three-of-a-kind": "三条",
  straight: "顺子",
  flush: "同花",
  "full-house": "葫芦",
  "four-of-a-kind": "四条",
  "straight-flush": "同花顺",
};

function compareNumberLists(left: readonly number[], right: readonly number[]): number {
  const maxLength = Math.max(left.length, right.length);
  for (let index = 0; index < maxLength; index += 1) {
    const leftValue = left[index] ?? Number.NEGATIVE_INFINITY;
    const rightValue = right[index] ?? Number.NEGATIVE_INFINITY;
    if (leftValue !== rightValue) {
      return leftValue - rightValue;
    }
  }
  return 0;
}

function sortCardsForDisplay(cards: readonly TavernShortCard[]): TavernShortCard[] {
  return [...cards].sort((left, right) => {
    const valueDiff =
      getTavernShortCardSortValue(right) - getTavernShortCardSortValue(left);
    if (valueDiff !== 0) {
      return valueDiff;
    }
    const copyDiff = (right.copy ?? 1) - (left.copy ?? 1);
    if (copyDiff !== 0) {
      return copyDiff;
    }
    return right.id.localeCompare(left.id);
  });
}

function getStraightHigh(ranks: readonly number[]): number | null {
  const uniqueAscending = [...new Set(ranks)].sort((left, right) => left - right);
  if (uniqueAscending.length !== 5) {
    return null;
  }
  for (let index = 1; index < uniqueAscending.length; index += 1) {
    const previous = uniqueAscending[index - 1];
    const current = uniqueAscending[index];
    if (previous == null || current == null || current !== previous + 1) {
      return null;
    }
  }
  return uniqueAscending[uniqueAscending.length - 1] ?? null;
}

function getFiveCardCombinations(cards: readonly TavernShortCard[]): TavernShortCard[][] {
  const combinations: TavernShortCard[][] = [];
  const buffer: TavernShortCard[] = [];

  const walk = (startIndex: number): void => {
    if (buffer.length === 5) {
      combinations.push([...buffer]);
      return;
    }
    for (let index = startIndex; index < cards.length; index += 1) {
      const card = cards[index];
      if (card == null) {
        continue;
      }
      buffer.push(card);
      walk(index + 1);
      buffer.pop();
    }
  };

  walk(0);
  return combinations;
}

function evaluateFiveCardHand(cards: readonly TavernShortCard[]): TavernShortBestFive {
  const orderedCards = sortCardsForDisplay(cards);
  const valuesDescending = orderedCards.map(getTavernShortCardSortValue);
  const suitedCards = cards.filter(isTavernShortSuitedCard);
  const allSuited = suitedCards.length === cards.length;
  const straightHigh = allSuited ? getStraightHigh(suitedCards.map((card) => card.rank)) : null;
  const isFlush =
    allSuited &&
    suitedCards.every((card) => card.suit === suitedCards[0]?.suit);

  const groupsByKey = new Map<string, TavernShortCard[]>();
  for (const card of cards) {
    const key = getTavernShortCardKey(card);
    const group = groupsByKey.get(key);
    if (group == null) {
      groupsByKey.set(key, [card]);
    } else {
      group.push(card);
    }
  }

  const groups = [...groupsByKey.entries()]
    .map(([key, groupCards]) => ({
      key,
      count: groupCards.length,
      value: Math.max(...groupCards.map(getTavernShortCardSortValue)),
      cards: groupCards,
    }))
    .sort((left, right) => {
      if (left.count !== right.count) {
        return right.count - left.count;
      }
      return right.value - left.value;
    });

  if (isFlush && straightHigh != null) {
    return {
      category: "straight-flush",
      label: CATEGORY_LABELS["straight-flush"],
      scoreKey: [CATEGORY_STRENGTH["straight-flush"], straightHigh],
      cards: orderedCards,
    };
  }

  if ((groups[0]?.count ?? 0) === 4) {
    const fourValue = groups[0]?.value ?? 0;
    const kicker = groups[1]?.value ?? 0;
    return {
      category: "four-of-a-kind",
      label: CATEGORY_LABELS["four-of-a-kind"],
      scoreKey: [CATEGORY_STRENGTH["four-of-a-kind"], fourValue, kicker],
      cards: orderedCards,
    };
  }

  if ((groups[0]?.count ?? 0) === 3 && (groups[1]?.count ?? 0) === 2) {
    const threeValue = groups[0]?.value ?? 0;
    const pairValue = groups[1]?.value ?? 0;
    return {
      category: "full-house",
      label: CATEGORY_LABELS["full-house"],
      scoreKey: [CATEGORY_STRENGTH["full-house"], threeValue, pairValue],
      cards: orderedCards,
    };
  }

  if (isFlush) {
    return {
      category: "flush",
      label: CATEGORY_LABELS.flush,
      scoreKey: [CATEGORY_STRENGTH.flush, ...valuesDescending],
      cards: orderedCards,
    };
  }

  if (straightHigh != null) {
    return {
      category: "straight",
      label: CATEGORY_LABELS.straight,
      scoreKey: [CATEGORY_STRENGTH.straight, straightHigh],
      cards: orderedCards,
    };
  }

  if ((groups[0]?.count ?? 0) === 3) {
    const threeValue = groups[0]?.value ?? 0;
    const kickers = groups
      .slice(1)
      .map((group) => group.value)
      .sort((left, right) => right - left);
    return {
      category: "three-of-a-kind",
      label: CATEGORY_LABELS["three-of-a-kind"],
      scoreKey: [CATEGORY_STRENGTH["three-of-a-kind"], threeValue, ...kickers],
      cards: orderedCards,
    };
  }

  if ((groups[0]?.count ?? 0) === 2 && (groups[1]?.count ?? 0) === 2) {
    const pairValues = groups
      .filter((group) => group.count === 2)
      .map((group) => group.value)
      .sort((left, right) => right - left);
    const kicker = groups.find((group) => group.count === 1)?.value ?? 0;
    return {
      category: "two-pair",
      label: CATEGORY_LABELS["two-pair"],
      scoreKey: [CATEGORY_STRENGTH["two-pair"], ...pairValues, kicker],
      cards: orderedCards,
    };
  }

  if ((groups[0]?.count ?? 0) === 2) {
    const pairValue = groups[0]?.value ?? 0;
    const kickers = groups
      .slice(1)
      .map((group) => group.value)
      .sort((left, right) => right - left);
    return {
      category: "one-pair",
      label: CATEGORY_LABELS["one-pair"],
      scoreKey: [CATEGORY_STRENGTH["one-pair"], pairValue, ...kickers],
      cards: orderedCards,
    };
  }

  return {
    category: "high-card",
    label: CATEGORY_LABELS["high-card"],
    scoreKey: [CATEGORY_STRENGTH["high-card"], ...valuesDescending],
    cards: orderedCards,
  };
}

export function compareTavernShortBestFives(
  left: TavernShortBestFive,
  right: TavernShortBestFive
): number {
  return compareNumberLists(left.scoreKey, right.scoreKey);
}

export function evaluateBestTavernShortShowdown(
  cards: readonly TavernShortCard[]
): TavernShortBestFive {
  if (cards.length < 5) {
    throw new Error("evaluateBestTavernShortShowdown requires at least 5 cards.");
  }

  let best: TavernShortBestFive | null = null;
  for (const candidate of getFiveCardCombinations(cards)) {
    const evaluated = evaluateFiveCardHand(candidate);
    if (best == null || compareTavernShortBestFives(evaluated, best) > 0) {
      best = evaluated;
    }
  }

  if (best == null) {
    throw new Error("No valid five-card combination found.");
  }
  return best;
}

export function buildTavernShortPots(
  contributions: ReadonlyArray<{ seatId: string; committed: number; folded: boolean }>
): TavernShortPot[] {
  const tiers = [
    ...new Set(
      contributions.map((entry) => entry.committed).filter((amount) => amount > 0)
    ),
  ].sort((left, right) => left - right);
  const pots: TavernShortPot[] = [];
  let previousTier = 0;

  for (const tier of tiers) {
    const contributors = contributions.filter((entry) => entry.committed >= tier);
    const amount = (tier - previousTier) * contributors.length;
    if (amount > 0) {
      pots.push({
        id: pots.length === 0 ? "main" : `side-${pots.length}`,
        amount,
        eligibleSeatIds: contributors
          .filter((entry) => !entry.folded)
          .map((entry) => entry.seatId),
      });
    }
    previousTier = tier;
  }

  return pots;
}

export function splitTavernShortPot(
  pot: TavernShortPot,
  orderedWinnerSeatIds: readonly string[],
  dealerNextSeatOrder: readonly string[]
): Array<{ seatId: string; amount: number }> {
  const eligibleWinners = orderedWinnerSeatIds.filter((seatId) =>
    pot.eligibleSeatIds.includes(seatId)
  );
  if (eligibleWinners.length === 0 || pot.amount <= 0) {
    return [];
  }

  const baseShare = Math.floor(pot.amount / eligibleWinners.length);
  let remainder = pot.amount % eligibleWinners.length;
  const payouts = new Map<string, number>();

  for (const seatId of eligibleWinners) {
    payouts.set(seatId, baseShare);
  }

  const remainderOrder = dealerNextSeatOrder.filter((seatId) =>
    eligibleWinners.includes(seatId)
  );
  for (const seatId of remainderOrder) {
    if (remainder <= 0) {
      break;
    }
    payouts.set(seatId, (payouts.get(seatId) ?? 0) + 1);
    remainder -= 1;
  }

  return eligibleWinners.map((seatId) => ({
    seatId,
    amount: payouts.get(seatId) ?? 0,
  }));
}
