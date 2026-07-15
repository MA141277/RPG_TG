import type {
  CanonicalRuntimeState,
  SaveState,
} from "../contracts/state-sync-runtime";

export function prepareSaveState(
  runtimeState: CanonicalRuntimeState,
  saveState: SaveState | undefined
): SaveState {
  const snapshot: SaveState = {
    version: saveState?.version ?? "1",
    timestamp: saveState?.timestamp ?? Date.now(),
    runtime: runtimeState,
  };

  if (saveState?.meta !== undefined) {
    snapshot.meta = saveState.meta;
  }

  return snapshot;
}
