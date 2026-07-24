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
