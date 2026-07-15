import type { SaveEnvelope } from "./save-envelope";

export function serializeSaveEnvelope(envelope: SaveEnvelope): string {
  return JSON.stringify(envelope);
}
