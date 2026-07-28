import type { CharacterId } from "./character";

export type ReviewCompletionGrade =
  | "outstanding"
  | "fulfilled"
  | "acceptable"
  | "poor"
  | "idle";

export type ReviewAssignmentRow = {
  characterId: string;
  characterName: string;
  assignmentTitle: string;
  contribution: number;
  grade: ReviewCompletionGrade;
};

export type ReviewPolicyPanel = {
  overallGoal: string;
  phaseGoal: string;
  executionPlan: string;
};

export type FactionMeritRank = {
  id: string;
  label: string;
  minMerit: number;
  stipendLabel?: string;
};

export type ReviewTaskGate = {
  id: string;
  label: string;
  minRankId: string;
  disabled?: boolean;
};

export type ReviewTaskChoice = {
  id: string;
  label: string;
  minRankId: string;
  minRankLabel: string;
  disabled: boolean;
};

export type ReviewSpecialTaskHookResult =
  | { type: "none" }
  | {
      type: "available";
      descriptionLines: string[];
      acceptActionId: string;
      declineActionId: string;
    };

export type ReviewItemReward = {
  itemId: string;
  label: string;
  quantity: number;
};

export type ReviewPersonnelChange =
  | {
      type: "left";
      characterId: CharacterId;
      characterName: string;
    }
  | {
      type: "joined";
      characterId: CharacterId;
      characterName: string;
      factionLabel?: string;
      nextTitle?: string;
    }
  | {
      type: "rank-changed";
      characterId: CharacterId;
      characterName: string;
      previousTitle: string;
      nextTitle: string;
    };

export type FactionMembershipStatus = "active" | "left";

export type FactionMembershipState = {
  status: FactionMembershipStatus;
  rankId: string;
  joinedReviewId?: string;
  lastReviewId?: string;
};

export type FactionMembershipsState = Record<
  string,
  Record<CharacterId, FactionMembershipState>
>;
