import type { TeaHouseSessionState } from "../../../domain/house-modules/tea-house-session";

export function createInitialTeaHouseSessionState(
  guestNpcIds: string[],
  selectedActorId: string,
  dialogueLines: string[],
  dialoguePhase: TeaHouseSessionState["dialoguePhase"] = "greeting"
): TeaHouseSessionState {
  return {
    guestNpcIds,
    selectedActorId,
    dialogueLines,
    dialoguePhase,
    overlay: null,
  };
}
