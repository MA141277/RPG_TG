import type {
  TavernShortHandState,
  TavernShortPlayerState,
} from "../../../domain/tavern-short-gambling";

export type TavernShortHiddenHandTone = "top" | "mid" | "base";

export type TavernShortHiddenHandTileViewModel = {
  id: string;
  tone: TavernShortHiddenHandTone;
};

function getNpcHiddenHandCount(input: {
  hand: TavernShortHandState;
  player: TavernShortPlayerState;
  viewerSeatId: string;
}): number {
  if (input.player.isHuman || input.player.seatId === input.viewerSeatId) {
    return 0;
  }
  const pendingDraw =
    input.hand.pendingIncomingCard?.ownerSeatId === input.player.seatId &&
    input.hand.pendingIncomingCard.source === "draw";
  return input.player.hand.length + (pendingDraw ? 1 : 0);
}

function toHiddenHandTone(index: number): TavernShortHiddenHandTone {
  return index === 0 ? "top" : index === 1 ? "mid" : "base";
}

export class TavernShortNpcHiddenHandStackBuilder {
  buildForSeat(input: {
    hand: TavernShortHandState;
    player: TavernShortPlayerState;
    viewerSeatId: string;
  }): TavernShortHiddenHandTileViewModel[] {
    const count = getNpcHiddenHandCount(input);
    return Array.from({ length: count }, (_, index) => ({
      id: `${input.player.seatId}:hidden-hand:${index}`,
      tone: toHiddenHandTone(index),
    }));
  }
}
