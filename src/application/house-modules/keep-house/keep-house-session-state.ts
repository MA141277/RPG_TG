import type {
  KeepHouseContributionEntry,
  KeepHouseMeetingStage,
  KeepHouseSessionMode,
  KeepHouseSessionState,
} from "../../../domain/house-modules/keep-house-session";

export function createInitialKeepHouseSessionState(
  mode: KeepHouseSessionMode,
  meetingStage: KeepHouseMeetingStage,
  dialogueLines: string[],
  contributionEntries: KeepHouseContributionEntry[]
): KeepHouseSessionState {
  return {
    mode,
    meetingStage,
    dialogueLines,
    dialoguePhase: "greeting",
    overlay: null,
    selectedTaskId: null,
    contributionEntries,
  };
}
