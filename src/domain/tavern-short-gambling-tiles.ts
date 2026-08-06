import {
  createTavernMahjongDeck,
  getTavernMahjongTileLabel,
  type TavernMahjongHonor,
  type TavernMahjongSuit,
  type TavernMahjongTile,
} from "./tavern-gambling";

export type TavernShortSuit = TavernMahjongSuit;
export type TavernShortHonor = TavernMahjongHonor;

export type TavernShortSuitedCard = {
  id: string;
  kind?: "suited";
  suit: TavernShortSuit;
  rank: number;
  copy?: number;
};

export type TavernShortHonorCard = {
  id: string;
  kind?: "honor";
  honor: TavernShortHonor;
  copy?: number;
};

export type TavernShortCard = TavernShortSuitedCard | TavernShortHonorCard;

const SUIT_SORT_VALUE: Record<TavernShortSuit, number> = {
  wan: 3,
  tong: 2,
  tiao: 1,
};

const HONOR_SORT_VALUE: Record<TavernShortHonor, number> = {
  east: 1,
  south: 2,
  west: 3,
  north: 4,
  zhong: 5,
  fa: 6,
  bai: 7,
};

type MahjongOrdinaryTile = Exclude<TavernMahjongTile, { kind: "flower" }>;

export function isTavernShortSuitedCard(
  card: TavernShortCard
): card is TavernShortSuitedCard {
  return "suit" in card;
}

function toShortDeckId(tile: MahjongOrdinaryTile): string {
  if (tile.kind === "suited") {
    return tile.copy === 1
      ? `${tile.suit}-${tile.rank}`
      : `${tile.suit}-${tile.rank}-${tile.copy}`;
  }
  return tile.copy === 1 ? tile.honor : `${tile.honor}-${tile.copy}`;
}

function toMahjongOrdinaryTile(card: TavernShortCard): MahjongOrdinaryTile {
  if (isTavernShortSuitedCard(card)) {
    return {
      id: card.id,
      kind: "suited",
      suit: card.suit,
      rank: card.rank,
      copy: card.copy ?? 1,
    };
  }
  return {
    id: card.id,
    kind: "honor",
    honor: card.honor,
    copy: card.copy ?? 1,
  };
}

export function createTavernShortDeck(): TavernShortCard[] {
  return createTavernMahjongDeck()
    .filter((tile): tile is MahjongOrdinaryTile => tile.kind !== "flower")
    .map((tile) => {
      if (tile.kind === "suited") {
        return {
          id: toShortDeckId(tile),
          kind: "suited",
          suit: tile.suit,
          rank: tile.rank,
          copy: tile.copy,
        };
      }
      return {
        id: toShortDeckId(tile),
        kind: "honor",
        honor: tile.honor,
        copy: tile.copy,
      };
    });
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

export function parseTavernShortCardId(id: string): TavernShortCard {
  const suitedMatch = /^(wan|tong|tiao)-([1-9])(?:-([1-4]))?$/u.exec(id);
  if (suitedMatch != null) {
    const [, suitText, rankText, copyText] = suitedMatch;
    const suit = suitText as TavernShortSuit;
    const rank = Number.parseInt(rankText ?? "", 10);
    const copy = Number.parseInt(copyText ?? "1", 10);
    return {
      id,
      kind: "suited",
      suit,
      rank,
      copy,
    };
  }

  const honorMatch = /^(east|south|west|north|zhong|fa|bai)(?:-([1-4]))?$/u.exec(
    id
  );
  if (honorMatch != null) {
    const [, honorText, copyText] = honorMatch;
    const honor = honorText as TavernShortHonor;
    const copy = Number.parseInt(copyText ?? "1", 10);
    return {
      id,
      kind: "honor",
      honor,
      copy,
    };
  }

  throw new Error(`Invalid tavern short card id "${id}".`);
}

export function getTavernShortCardLabel(card: TavernShortCard): string {
  return getTavernMahjongTileLabel(toMahjongOrdinaryTile(card));
}

export function getTavernShortCardKey(card: TavernShortCard): string {
  return isTavernShortSuitedCard(card) ? `${card.suit}-${card.rank}` : card.honor;
}

export function getTavernShortCardSortValue(card: TavernShortCard): number {
  if (isTavernShortSuitedCard(card)) {
    return SUIT_SORT_VALUE[card.suit] * 10 + card.rank;
  }
  return 100 + HONOR_SORT_VALUE[card.honor];
}

