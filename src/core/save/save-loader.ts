import type { SaveEnvelope } from "./save-envelope";
import { migrateSaveEnvelope } from "./save-migrations";

export function loadSaveEnvelope(
  envelope: Record<string, unknown>,
  input: { availableModIds: string[] }
): SaveEnvelope {
  const migrated = migrateSaveEnvelope(envelope);

  const canRestoreFromSource =
    migrated.selectedModSource != null &&
    migrated.selectedModSource.kind !== "builtin";

  if (
    !canRestoreFromSource &&
    !input.availableModIds.includes(migrated.selectedModId)
  ) {
    throw new Error(`Missing selected mod: ${migrated.selectedModId}`);
  }

  return migrated;
}
