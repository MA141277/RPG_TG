import type { HouseActivityConfirmOverlayState } from "../house-activity";
export type TempleHouseAlertOverlayState = {
  type: "alert";
  title: string;
  paragraphs: string[];
  tone?: "info" | "success" | "warning";
};

export type TempleHouseDonateConfirmOverlayState = {
  type: "donate-confirm";
  title: string;
  paragraphs: string[];
  amount: number;
};

export type TempleHouseFoodSubmitOverlayState = {
  type: "submit-food";
  quantity: number;
  maxQuantity: number;
};

export type TempleHouseRestDaysOverlayState = {
  type: "rest-days";
  inputValue: string;
};

export type TempleHouseQteOverlayState = {
  type: "qte-bar";
  taskId: string;
  taskLabel: string;
  round: number;
  totalRounds: number;
  successes: number;
  markerPercent: number;
  markerDirection: 1 | -1;
  targetStartPercent: number;
  targetWidthPercent: number;
};

export type TempleHouseResultOverlayState = {
  type: "result";
  title: string;
  grade: string;
  score: number;
  rewardLines: string[];
};

export type TempleHouseOverlayState =
  | TempleHouseAlertOverlayState
  | HouseActivityConfirmOverlayState
  | TempleHouseDonateConfirmOverlayState
  | TempleHouseQteOverlayState
  | TempleHouseFoodSubmitOverlayState
  | TempleHouseRestDaysOverlayState
  | TempleHouseResultOverlayState
  | null;

export type TempleHouseDialoguePhase = "greeting" | "open" | "idle";

export type TempleHouseDialogueOverrideState = {
  speakerCharacterId: string;
  textLines: string[];
  advanceActionId: string;
  advanceHintText: string;
} | null;

export type TempleHouseSessionMode = "daily" | "meeting";

export type TempleHouseWorkPlan = "temple-help" | "beg-alms" | null;

export type TempleHouseDailyActionPanel = "root" | "work" | "rest";

export type TempleHouseMeetingStage =
  | "intro"
  | "contribution"
  | "praise"
  | "policy"
  | "assign-duty"
  | "assigned"
  | "finished";

export type TempleHouseSessionState = {
  mode: TempleHouseSessionMode;
  meetingStage: TempleHouseMeetingStage;
  dialogueLines: string[];
  dialogueOverride: TempleHouseDialogueOverrideState;
  dialoguePhase: TempleHouseDialoguePhase;
  overlay: TempleHouseOverlayState;
  selectedTaskId: string | null;
  selectedWorkPlan: TempleHouseWorkPlan;
  dailyActionPanel: TempleHouseDailyActionPanel;
};
