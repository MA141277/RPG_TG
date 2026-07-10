import type { ActivityId } from "./activity";

export const FORTUNE_BOARD_MIN_ANIMATION_TICK_MS = 250;
export const FORTUNE_BOARD_MAX_ANIMATION_TICK_MS = 1000;
export const FORTUNE_BOARD_DEFAULT_ANIMATION_TICK_MS = 500;

export type ActivityWorkSequenceCommand = {
  id: string;
  label: string;
};

export type ActivityWorkSequenceHistoryEntry = {
  round: number;
  expectedCommandId: string;
  expectedLabel: string;
  selectedCommandId: string;
  selectedLabel: string;
  success: boolean;
};

export type ActivityWorkSequenceSession = {
  type: "work-sequence";
  activityId: ActivityId;
  handlerId: string;
  title: string;
  taskLabel: string;
  round: number;
  totalRounds: number;
  requiredSuccesses: number;
  successes: number;
  instruction: string;
  targetCommandId: string;
  targetCommandLabel: string;
  commandOptions: ActivityWorkSequenceCommand[];
  history: ActivityWorkSequenceHistoryEntry[];
  timeAdvanceCost: number;
  completedFlagKey?: string;
  gradeVariableKey?: string;
  scoreVariableKey?: string;
};

export type ActivityFortuneBoardCellKind =
  | "plain"
  | "timing"
  | "favorable"
  | "complete"
  | "resonance"
  | "rumor";

export type ActivityFortuneBoardCell = {
  row: number;
  column: number;
  kind: ActivityFortuneBoardCellKind;
  selected: boolean;
  selectedOrder?: number;
};

export type ActivityFortuneBoardTripletReward = {
  kind: ActivityFortuneBoardCellKind;
  sets: number;
  contribution: number;
};

export type ActivityFortuneBoardPhase =
  | "ready"
  | "scanning"
  | "column-flash"
  | "cell-scan"
  | "cell-pick"
  | "final-flash"
  | "final-reroll"
  | "settling";

export type ActivityFortuneBoardSession = {
  type: "fortune-board";
  activityId: ActivityId;
  handlerId: string;
  title: string;
  taskLabel: string;
  board: ActivityFortuneBoardCell[];
  remainingPieces: number;
  wager: number;
  phase: ActivityFortuneBoardPhase;
  highlightedColumn: number | null;
  selectedColumn: number | null;
  flashTicks: number;
  pendingDropCount: number;
  scanCellKeys: string[];
  scanCellIndex: number;
  highlightedCellKey: string | null;
  pickedCellKey: string | null;
  selectedCellKeys: string[];
  animationTickMs: number;
  score: number;
  baseScore: number;
  tripletRewards: ActivityFortuneBoardTripletReward[];
  resonanceCount: number;
  rumorCount: number;
  rerollCount: number;
  timeAdvanceCost: number;
  completedFlagKey?: string;
  gradeVariableKey?: string;
  scoreVariableKey?: string;
};

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
  | ActivityFortuneBoardSession
  | ActivityWorkSequenceSession
  | ActivityQteSession
  | ActivityResultSession
  | null;
