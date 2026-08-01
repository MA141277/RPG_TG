import type {
  TempleHouseMeetingStage,
  TempleHouseSessionMode,
  TempleHouseSessionState,
} from "../../../domain/house-modules/temple-house-session";

export function createInitialTempleHouseSessionState(
  mode: TempleHouseSessionMode,
  meetingStage: TempleHouseMeetingStage,
  dialogueLines: string[]
): TempleHouseSessionState {
  return {
    mode,
    meetingStage,
    dialogueLines,
    dialogueOverride: null,
    dialoguePhase: "greeting",
    overlay: null,
    selectedTaskId: null,
    selectedWorkPlan: null,
    dailyActionPanel: "root",
    workEncounterStage: null,
    workEncounterLoadingTicks: 0,
  };
}
