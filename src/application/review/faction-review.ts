import type { CharacterId } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import type {
  FactionMeritRank,
  ReviewCompletionGrade,
  ReviewSpecialTaskHookResult,
  ReviewTaskChoice,
  ReviewTaskGate,
} from "../../domain/review";

export const REVIEW_COMPLETION_GRADE_LABELS: Record<ReviewCompletionGrade, string> = {
  outstanding: "赫赫之功",
  fulfilled: "尽职尽责",
  acceptable: "差强人意",
  poor: "不尽人意",
  idle: "碌碌无为",
};

export const TEMPLE_FACTION_RANKS: FactionMeritRank[] = [
  { id: "temple.laborer", label: "杂役", minMerit: 0, stipendLabel: "0（管饭）" },
  { id: "temple.novice", label: "沙弥", minMerit: 80, stipendLabel: "1 斗米" },
  { id: "temple.itinerant", label: "云游僧", minMerit: 200, stipendLabel: "化缘所得" },
  { id: "temple.monk", label: "比丘", minMerit: 500, stipendLabel: "3 斗米" },
  { id: "temple.guest_master", label: "知客僧", minMerit: 1000, stipendLabel: "5 斗米" },
  { id: "temple.prior", label: "监院", minMerit: 1800, stipendLabel: "8 斗米" },
];

export const RED_TURBAN_FACTION_RANKS: FactionMeritRank[] = [
  { id: "red_turban.bodyguard", label: "亲兵", minMerit: 0 },
  { id: "red_turban.guard_captain", label: "亲兵队长", minMerit: 200 },
  { id: "red_turban.zhenfu", label: "镇抚", minMerit: 600 },
  { id: "red_turban.military_governor", label: "管军总管", minMerit: 1400 },
  { id: "red_turban.commander_general", label: "总兵官", minMerit: 3000 },
  { id: "red_turban.deputy_marshal", label: "（左副）元帅", minMerit: 4500 },
  { id: "red_turban.duke_or_usurper", label: "自立·吴国公 / 下克上", minMerit: 10000 },
];

type FactionMeritState = Pick<GameState, "runtime">;

export function getReviewCompletionGradeLabel(grade: ReviewCompletionGrade): string {
  return REVIEW_COMPLETION_GRADE_LABELS[grade];
}

export function resolveReviewCompletionGrade(contribution: number): ReviewCompletionGrade {
  if (contribution >= 90) {
    return "outstanding";
  }
  if (contribution >= 60) {
    return "fulfilled";
  }
  if (contribution >= 25) {
    return "acceptable";
  }
  if (contribution > 0) {
    return "poor";
  }
  return "idle";
}

export function resolveFactionMeritRank(
  ranks: FactionMeritRank[],
  merit: number
): FactionMeritRank {
  if (ranks.length === 0) {
    throw new Error("Cannot resolve faction merit rank from an empty rank table.");
  }

  return ranks.reduce((selected: FactionMeritRank, rank) => {
    if (merit >= rank.minMerit && rank.minMerit >= selected.minMerit) {
      return rank;
    }
    return selected;
  }, ranks[0] as FactionMeritRank);
}

export function readFactionMerit(
  state: FactionMeritState,
  factionId: string,
  characterId: CharacterId
): number {
  return state.runtime.factionMerit[factionId]?.[characterId] ?? 0;
}

export function writeFactionMerit<TState extends FactionMeritState>(
  state: TState,
  factionId: string,
  characterId: CharacterId,
  merit: number
): TState {
  return {
    ...state,
    runtime: {
      ...state.runtime,
      factionMerit: {
        ...state.runtime.factionMerit,
        [factionId]: {
          ...(state.runtime.factionMerit[factionId] ?? {}),
          [characterId]: merit,
        },
      },
    },
  };
}

export function clearFactionMerit<TState extends FactionMeritState>(
  state: TState,
  factionId: string,
  characterId: CharacterId
): TState {
  const { [characterId]: _cleared, ...remainingFactionMerit } =
    state.runtime.factionMerit[factionId] ?? {};

  return {
    ...state,
    runtime: {
      ...state.runtime,
      factionMerit: {
        ...state.runtime.factionMerit,
        [factionId]: remainingFactionMerit,
      },
    },
  };
}

export function createReviewTaskChoiceViewModels(input: {
  currentRankId: string;
  ranks: FactionMeritRank[];
  tasks: ReviewTaskGate[];
}): ReviewTaskChoice[] {
  const currentRank = input.ranks.find((rank) => rank.id === input.currentRankId);
  const currentMerit = currentRank?.minMerit ?? -Infinity;

  return input.tasks.map((task) => {
    const minRank = input.ranks.find((rank) => rank.id === task.minRankId);
    const minRankLabel = minRank?.label ?? task.minRankId;
    const minMerit = minRank?.minMerit ?? Infinity;

    return {
      id: task.id,
      label: `${task.label}（最低身份：${minRankLabel}）`,
      minRankId: task.minRankId,
      minRankLabel,
      disabled: currentMerit < minMerit,
    };
  });
}

export function getDefaultReviewSpecialTaskHookResult(): ReviewSpecialTaskHookResult {
  return { type: "none" };
}
