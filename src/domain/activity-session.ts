import type { ActivityId } from "./activity";

export type ActivityQteSession = {
  type: "qte-bar";
  activityId: ActivityId;
  handlerId: string;
  title: string;
  taskLabel: string;
  round: number;
  totalRounds: number;
  requiredSuccesses: number;
  successes: number;
  markerPercent: number;
  markerDirection: 1 | -1;
  targetStartPercent: number;
  targetWidthPercent: number;
  timeAdvanceCost: number;
  completedFlagKey?: string;
  gradeVariableKey?: string;
  scoreVariableKey?: string;
};

export type ActivityResultSession = {
  type: "result";
  activityId: ActivityId;
  title: string;
  grade: string;
  score: number;
  rewardLines: string[];
};

export type ActiveActivitySession =
  | ActivityQteSession
  | ActivityResultSession
  | null;
