import type { SaveEnvelope } from "./save-envelope";
import { migrateSaveEnvelope } from "./save-migrations";

export function loadSaveEnvelope(
  envelope: Record<string, unknown>,
  input: { availableModIds: string[] }
): SaveEnvelope {
  const migrated = migrateSaveEnvelope(envelope);

  if (!input.availableModIds.includes(migrated.selectedModId)) {
    throw new Error(`Missing selected mod: ${migrated.selectedModId}`);
  }

  return migrated;
}
