import type {
  CanonicalRuntimeState,
  SaveState,
} from "../contracts/state-sync-runtime";
import { normalizeRuntimeState } from "./state-sync-normalization";

export function hydrateFromSave(
  saveState: SaveState | undefined
): CanonicalRuntimeState | null {
  if (saveState == null) {
    return null;
  }

  return normalizeRuntimeState(saveState.runtime);
}
