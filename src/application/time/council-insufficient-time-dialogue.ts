import type { HouseDialogueOverrideState } from "../../domain/house-module";

export type CouncilInsufficientTimeDialogueOverrideState =
  HouseDialogueOverrideState & {
    advanceActionId: string;
    advanceHintText: string;
  };

export const COUNCIL_INSUFFICIENT_TIME_DIALOGUE_TEXT =
  "时间不多了，先返回评定地点吧";

export function createCouncilInsufficientTimeDialogueOverride(
  playerCharacterId: string,
  advanceActionId = "dismiss-dialogue"
): CouncilInsufficientTimeDialogueOverrideState {
  return {
    speakerCharacterId: playerCharacterId,
    textLines: [COUNCIL_INSUFFICIENT_TIME_DIALOGUE_TEXT],
    advanceActionId,
    advanceHintText: "返回评定地点",
  };
}
