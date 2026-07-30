export type StoryBattleUnitSide = "player" | "ally" | "enemy";
export type StoryBattleController = "player" | "npc";
export type StoryBattleUnitStatus =
  | "ready"
  | "engaged"
  | "surrounded"
  | "relieved"
  | "routed";
export type StoryBattlePhase =
  | "awaiting-player-order"
  | "npc-resolution"
  | "embedded-running"
  | "victory";

export type StoryBattleUnit = {
  id: string;
  name: string;
  side: StoryBattleUnitSide;
  controller: StoryBattleController;
  role: string;
  x: number;
  y: number;
  strength: number;
  maxStrength: number;
  status: StoryBattleUnitStatus;
};

export type StoryBattleCompletion = {
  completedFlagKey: string;
  winFlagKey: string;
  battleIdVariableKey: string;
  resultVariableKey: string;
  enterHouseId?: string;
  returnBackgroundId?: string;
  mainMissionText?: string;
};

export type ActiveStoryBattleSession = {
  battleId: string;
  title: string;
  objective: string;
  summaryLines: string[];
  playerUnitId: string;
  rescuedUnitId: string | null;
  demoScenarioId?: string;
  phase: StoryBattlePhase;
  units: StoryBattleUnit[];
  logLines: string[];
  completion: StoryBattleCompletion;
} | null;
