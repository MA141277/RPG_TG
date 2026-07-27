import type { CharacterId } from "../character";
import type { ReviewAssignmentRow, ReviewPolicyPanel } from "../review";

export type KeepHouseAlertOverlayState = {
  type: "alert";
  title: string;
  paragraphs: string[];
  tone?: "info" | "success" | "warning";
};

export type KeepHouseReviewAssignmentTableOverlayState = {
  type: "review-assignment-table";
  title: string;
  rows: ReviewAssignmentRow[];
  confirmActionId: string;
  confirmLabel: string;
};

export type KeepHouseReviewPolicyPanelOverlayState = {
  type: "review-policy-panel";
  title: string;
  policy: ReviewPolicyPanel;
  closeActionId?: string;
  closeLabel?: string;
};

export type KeepHouseOverlayState =
  | KeepHouseAlertOverlayState
  | KeepHouseReviewAssignmentTableOverlayState
  | KeepHouseReviewPolicyPanelOverlayState
  | null;

export type KeepHouseDialoguePhase = "greeting" | "open" | "idle";

export type KeepHouseSessionMode = "audience" | "meeting";

export type KeepHouseMeetingStage =
  | "intro"
  | "assignment-table"
  | "praise"
  | "situation"
  | "policy"
  | "advice"
  | "assign-task"
  | "assigned"
  | "finished";

export type KeepHouseContributionEntry = {
  characterId: CharacterId;
  name: string;
  title?: string;
  contribution: number;
};

export type KeepHouseSessionState = {
  mode: KeepHouseSessionMode;
  meetingStage: KeepHouseMeetingStage;
  dialogueLines: string[];
  dialoguePhase: KeepHouseDialoguePhase;
  overlay: KeepHouseOverlayState;
  selectedTaskId: string | null;
  contributionEntries: KeepHouseContributionEntry[];
};
