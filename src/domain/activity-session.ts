import type { ActivityId } from "./activity";

export const FORTUNE_BOARD_MIN_ANIMATION_TICK_MS = 250;
export const FORTUNE_BOARD_MAX_ANIMATION_TICK_MS = 1000;
export const FORTUNE_BOARD_DEFAULT_ANIMATION_TICK_MS = 500;
export const PACHINKO_BOARD_DEFAULT_ANIMATION_TICK_MS = 33;

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

export type ActivityPachinkoBoardPhase =
  | "ready"
  | "dropping"
  | "rewarding"
  | "drawing-card"
  | "card-result"
  | "settling";

export type ActivityPachinkoBoardEventKind =
  | "great"
  | "good"
  | "plain"
  | "minor-bad"
  | "timing";

export type ActivityPachinkoBoardPin = {
  id: string;
  x: number;
  y: number;
  radius: number;
  moving?: boolean;
};

export type ActivityPachinkoBoardBall = {
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  vx: number;
  vy: number;
  radius: number;
};

export type ActivityPachinkoBoardEventLogEntry = {
  roll: number;
  kind: ActivityPachinkoBoardEventKind;
  label: string;
};

export type ActivityPachinkoBoardWheelRewardKind =
  | "score"
  | "extra-ball"
  | "encounter";

export type ActivityPachinkoFortuneCardRank =
  | "bad"
  | "neutral"
  | "good"
  | "encounter";

export type ActivityPachinkoFortuneCardResult = {
  id: string;
  rank: ActivityPachinkoFortuneCardRank;
  label: string;
  description: string;
  scoreDelta?: number;
  staminaDelta?: number;
  applied: boolean;
  resolved: boolean;
};

export type ActivityPachinkoBoardWheelRewardSegment = {
  id: string;
  label: string;
  kind: ActivityPachinkoBoardWheelRewardKind;
  amount: number;
  weight: number;
};

export type ActivityPachinkoBoardRewardQueueItem = {
  type: "fortune-card";
};

export type ActivityPachinkoBoardAudioPulse = {
  token: number;
  collisionCount: number;
  settleCount: number;
};

export type ActivityPachinkoBoardWheelState = {
  phase: "idle" | "spinning" | "slowing" | "flashing" | "holding" | "settled";
  elapsedMs: number;
  rotationDegrees: number;
  targetRotationDegrees: number;
  selectedIndex: number | null;
  selectedReward: ActivityPachinkoBoardWheelRewardSegment | null;
  flashCount: number;
  segments: ActivityPachinkoBoardWheelRewardSegment[];
};

export type ActivityPachinkoMovingGate = {
  id: string;
  label: string;
  x: number;
  y: number;
  direction: 1 | -1;
  step: number;
  reward:
    | {
        kind: "extra-ball";
        amount: number;
      }
    | {
        kind: "score";
        amount: number;
      };
  pins: [ActivityPachinkoBoardPin, ActivityPachinkoBoardPin];
};

export type ActivityPachinkoBoardSession = {
  type: "pachinko-board";
  activityId: ActivityId;
  handlerId: string;
  title: string;
  taskLabel: string;
  boardWidth: number;
  boardHeight: number;
  phase: ActivityPachinkoBoardPhase;
  remainingBalls: number;
  totalBalls: number;
  activeBall: ActivityPachinkoBoardBall | null;
  activeBalls: ActivityPachinkoBoardBall[];
  audioPulseCounter: number;
  audioPulse: ActivityPachinkoBoardAudioPulse | null;
  pins: ActivityPachinkoBoardPin[];
  movingGates: ActivityPachinkoMovingGate[];
  movingGatePins: [ActivityPachinkoBoardPin, ActivityPachinkoBoardPin];
  gatePassCount: number;
  eventCharge: number;
  eventLog: ActivityPachinkoBoardEventLogEntry[];
  score: number;
  lastSlotIndex: number | null;
  slotValues: Array<number | "fortune-card">;
  rewardQueue: ActivityPachinkoBoardRewardQueueItem[];
  wheelState: ActivityPachinkoBoardWheelState;
  fortuneCardCount: number;
  fortuneCardsDrawn: number;
  currentFortuneCard: ActivityPachinkoFortuneCardResult | null;
  fortuneCardHistory: ActivityPachinkoFortuneCardResult[];
  flipperAngle: number;
  flipperDirection: 1 | -1;
  movingGateX: number;
  movingGateDirection: 1 | -1;
  animationTickMs: number;
  layoutRefreshElapsedMs: number;
  layoutRefreshPeriodMs: number;
  layoutVersion: number;
  timeAdvanceCost: number;
  completedFlagKey?: string;
  gradeVariableKey?: string;
  scoreVariableKey?: string;
};

export type ActiveActivitySession =
  | ActivityFortuneBoardSession
  | ActivityPachinkoBoardSession
  | ActivityWorkSequenceSession
  | ActivityQteSession
  | ActivityResultSession
  | null;
