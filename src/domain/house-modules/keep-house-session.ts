import type { CharacterId } from "../character";

export type KeepHouseAlertOverlayState = {
  type: "alert";
  title: string;
  paragraphs: string[];
  tone?: "info" | "success" | "warning";
};

export type KeepHouseOverlayState = KeepHouseAlertOverlayState | null;

export type KeepHouseDialoguePhase = "greeting" | "open" | "idle";

export type KeepHouseSessionMode = "audience" | "meeting";

export type KeepHouseMeetingStage =
  | "intro"
  | "contribution"
  | "praise"
  | "strategy"
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
