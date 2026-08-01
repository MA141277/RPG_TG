import type { AppState } from "../app-shell";
import { openDialogueFromMenuTarget } from "../app-actions";

// Legacy compatibility seam: menu-owned dialogue actions still exist in runtime
// content, but the event-owned dialogue route is the only forward path.
export function launchLegacyCityMenuDialogue(
  state: AppState,
  dialogueId: string
): AppState {
  return openDialogueFromMenuTarget(state, dialogueId);
}
