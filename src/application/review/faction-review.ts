import type { CharacterId } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import type {
  FactionMembershipsState,
  FactionMembershipState,
  FactionMeritRank,
  ReviewAssignmentRow,
  ReviewCompletionGrade,
  ReviewItemReward,
  ReviewPersonnelChange,
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
  { id: "temple.novice", label: "沙弥", minMerit: 30, stipendLabel: "1 斗米" },
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
type FactionMembershipRuntimeState = {
  runtime: {
    factionMemberships: FactionMembershipsState;
  };
};
type RuntimeVariablesState = {
  runtime: {
    variables: Record<string, number | string>;
  };
};

export const REVIEW_DEFAULT_TOP_RANK_REWARD: ReviewItemReward = {
  itemId: "item.grain",
  label: "斗米",
  quantity: 2,
};

export const TEMPLE_TOP_RANK_REWARD: ReviewItemReward = {
  itemId: "item.temple.scripture_copy",
  label: "经书抄本",
  quantity: 1,
};

const RUNTIME_ITEM_QUANTITY_KEY_PREFIX = "var.player_inventory.item.";
const GRAIN_ITEM_ID = "item.grain";
const PLAYER_GRAIN_QUANTITY_KEY = "var.player_inventory.grain_dou";
const TEMPLE_RANK_DISPLAY_LABELS: Record<string, string> = {
  "temple.laborer": "杂役",
  "temple.novice": "沙弥",
  "temple.itinerant": "云游僧",
  "temple.monk": "比丘",
  "temple.guest_master": "知客僧",
  "temple.prior": "监院",
};

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

export function readFactionMembership(
  state: FactionMembershipRuntimeState,
  factionId: string,
  characterId: CharacterId
): FactionMembershipState | null {
  return state.runtime.factionMemberships[factionId]?.[characterId] ?? null;
}

export function writeFactionMembership<TState extends FactionMembershipRuntimeState>(
  state: TState,
  factionId: string,
  characterId: CharacterId,
  membership: FactionMembershipState
): TState {
  return {
    ...state,
    runtime: {
      ...state.runtime,
      factionMemberships: {
        ...state.runtime.factionMemberships,
        [factionId]: {
          ...(state.runtime.factionMemberships[factionId] ?? {}),
          [characterId]: membership,
        },
      },
    },
  };
}

function resolveFactionRankById(
  ranks: FactionMeritRank[],
  rankId: string
): FactionMeritRank {
  const rank = ranks.find((candidate) => candidate.id === rankId);
  if (rank == null) {
    throw new Error(`Unknown faction rank id: ${rankId}`);
  }
  return rank;
}

export function settleFactionReviewPersonnel<
  TState extends FactionMembershipRuntimeState,
>(input: {
  state: TState;
  factionId: string;
  factionLabel?: string;
  characterId: CharacterId;
  characterName: string;
  reviewId: string;
  entryRankId: string;
  previousMerit: number;
  nextMerit: number;
  ranks: FactionMeritRank[];
  formatRankLabel?: (rank: FactionMeritRank) => string;
}): { state: TState; changes: ReviewPersonnelChange[] } {
  const formatRankLabel =
    input.formatRankLabel ??
    ((rank: FactionMeritRank) => getFactionRankPersonnelTitle(input.factionId, rank));
  const entryRank = resolveFactionRankById(input.ranks, input.entryRankId);
  const nextRank = resolveFactionMeritRank(input.ranks, input.nextMerit);
  const currentMembership = readFactionMembership(
    input.state,
    input.factionId,
    input.characterId
  );
  const changes: ReviewPersonnelChange[] = [];

  if (currentMembership == null || currentMembership.status !== "active") {
    changes.push({
      type: "joined",
      characterId: input.characterId,
      characterName: input.characterName,
      ...(input.factionLabel == null ? {} : { factionLabel: input.factionLabel }),
      nextTitle: formatRankLabel(entryRank),
    });

    if (nextRank.id !== entryRank.id) {
      changes.push({
        type: "rank-changed",
        characterId: input.characterId,
        characterName: input.characterName,
        previousTitle: formatRankLabel(entryRank),
        nextTitle: formatRankLabel(nextRank),
      });
    }

    return {
      state: writeFactionMembership(
        input.state,
        input.factionId,
        input.characterId,
        {
          status: "active",
          rankId: nextRank.id,
          joinedReviewId: input.reviewId,
          lastReviewId: input.reviewId,
        }
      ),
      changes,
    };
  }

  const previousRank =
    input.ranks.find((rank) => rank.id === currentMembership.rankId) ??
    resolveFactionMeritRank(input.ranks, input.previousMerit);
  if (previousRank.id !== nextRank.id) {
    changes.push({
      type: "rank-changed",
      characterId: input.characterId,
      characterName: input.characterName,
      previousTitle: formatRankLabel(previousRank),
      nextTitle: formatRankLabel(nextRank),
    });
  }

  return {
    state: writeFactionMembership(
      input.state,
      input.factionId,
      input.characterId,
      {
        status: "active",
        rankId: nextRank.id,
        ...(currentMembership.joinedReviewId == null
          ? {}
          : { joinedReviewId: currentMembership.joinedReviewId }),
        lastReviewId: input.reviewId,
      }
    ),
    changes,
  };
}

export function getRuntimeItemQuantityKey(itemId: string): string {
  return `${RUNTIME_ITEM_QUANTITY_KEY_PREFIX}${itemId}`;
}

export function readRuntimeItemQuantity(
  state: RuntimeVariablesState,
  itemId: string
): number {
  const value = state.runtime.variables[getRuntimeItemQuantityKey(itemId)];
  return typeof value === "number" ? value : 0;
}

function readRuntimeNumber(
  state: RuntimeVariablesState,
  key: string,
  fallback: number
): number {
  const value = state.runtime.variables[key];
  return typeof value === "number" ? value : fallback;
}

export function applyReviewItemReward<TState extends RuntimeVariablesState>(
  state: TState,
  reward: ReviewItemReward
): TState {
  const key =
    reward.itemId === GRAIN_ITEM_ID
      ? PLAYER_GRAIN_QUANTITY_KEY
      : getRuntimeItemQuantityKey(reward.itemId);
  const currentQuantity = readRuntimeNumber(state, key, 0);

  return {
    ...state,
    runtime: {
      ...state.runtime,
      variables: {
        ...state.runtime.variables,
        [key]: Math.max(0, currentQuantity + reward.quantity),
      },
    },
  };
}

export function isReviewTopRankRewardEligible(
  rows: ReviewAssignmentRow[],
  playerCharacterId: CharacterId,
  topCount = 2
): boolean {
  const sortedRows = [...rows].sort(
    (leftRow, rightRow) => rightRow.contribution - leftRow.contribution
  );
  const playerIndex = sortedRows.findIndex(
    (row) => row.characterId === playerCharacterId
  );
  const playerRow = playerIndex < 0 ? null : sortedRows[playerIndex];

  return (
    playerRow != null &&
    playerRow.contribution > 0 &&
    playerIndex >= 0 &&
    playerIndex < topCount
  );
}

export function getFactionRankPersonnelTitle(
  factionId: string,
  rank: FactionMeritRank
): string {
  if (factionId === "temple") {
    return TEMPLE_RANK_DISPLAY_LABELS[rank.id] ?? rank.label;
  }

  return rank.label;
}

export function createFactionRankPersonnelChanges(input: {
  characterDefinitions: Array<{
    id: CharacterId;
    name: string;
    title?: string;
  }>;
  playerCharacterId: CharacterId;
  previousRankLabel: string;
  nextRankLabel: string;
}): ReviewPersonnelChange[] {
  const playerCharacter = input.characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === input.playerCharacterId
  );
  if (playerCharacter == null) {
    return [];
  }

  const previousTitle =
    playerCharacter.title == null || playerCharacter.title.length === 0
      ? input.previousRankLabel
      : playerCharacter.title;
  if (previousTitle === input.nextRankLabel) {
    return [];
  }

  return [
    {
      type: "rank-changed",
      characterId: playerCharacter.id,
      characterName: playerCharacter.name,
      previousTitle,
      nextTitle: input.nextRankLabel,
    },
  ];
}

export function formatReviewPersonnelChangeLines(
  changes: ReviewPersonnelChange[]
): string[] {
  if (changes.length === 0) {
    return ["本轮我方没有人事变化。"];
  }

  return changes.map((change) => {
    if (change.type === "left") {
      return `${change.characterName}退出了。`;
    }
    if (change.type === "joined") {
      if (change.factionLabel != null && change.nextTitle != null) {
        return `${change.characterName}初次加入${change.factionLabel}，列为${change.nextTitle}。`;
      }
      if (change.nextTitle != null) {
        return `${change.characterName}初次加入，列为${change.nextTitle}。`;
      }
      return `${change.characterName}初次加入。`;
    }
    return `${change.characterName}由${change.previousTitle}晋为${change.nextTitle}。`;
  });
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
      disabled: task.disabled === true || currentMerit < minMerit,
    };
  });
}

export function getDefaultReviewSpecialTaskHookResult(): ReviewSpecialTaskHookResult {
  return { type: "none" };
}
