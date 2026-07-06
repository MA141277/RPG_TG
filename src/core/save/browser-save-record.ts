import type { CoreGameState } from "../contracts/core-state";
import type { ModSourceDescriptor } from "../contracts/mod-runtime";
import { loadSaveEnvelope } from "./save-loader";
import { createSaveEnvelope } from "./save-envelope";
import { serializeSaveEnvelope } from "./save-writer";

export const BROWSER_SAVE_STORAGE_KEY = "rpg-tg.save-envelope.v1";

type StorageLike = Pick<Storage, "getItem" | "setItem">;

type BrowserSaveRecord = {
  selectedCharacterId?: string | null;
  envelope: Record<string, unknown>;
};

export type BrowserStartupSaveData = {
  selectedCharacterId?: string | null;
  selectedModId: string;
  selectedModSource: ModSourceDescriptor | null;
};

export function readBrowserSaveRecord(input: {
  storage?: StorageLike | null;
  key?: string;
  availableModIds: string[];
}): BrowserStartupSaveData | null {
  const rawRecord = input.storage?.getItem(
    input.key ?? BROWSER_SAVE_STORAGE_KEY
  );
  if (rawRecord == null) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawRecord) as unknown;
    if (!isRecord(parsed)) {
      return null;
    }

    const selectedCharacterId =
      typeof parsed.selectedCharacterId === "string" ||
      parsed.selectedCharacterId === null
        ? parsed.selectedCharacterId
        : undefined;
    const envelopeInput = isRecord(parsed.envelope) ? parsed.envelope : parsed;
    const envelope = loadSaveEnvelope(envelopeInput, {
      availableModIds: input.availableModIds,
    });

    return {
      ...(selectedCharacterId === undefined ? {} : { selectedCharacterId }),
      selectedModId: envelope.selectedModId,
      selectedModSource: envelope.selectedModSource,
    };
  } catch {
    return null;
  }
}

export function writeBrowserSaveRecord(input: {
  storage?: StorageLike | null;
  key?: string;
  selectedCharacterId?: string | null;
  selectedModSource?: ModSourceDescriptor | null;
  state: CoreGameState;
}): void {
  if (input.storage == null) {
    return;
  }

  const envelope = createSaveEnvelope({
    version: input.state.engine.version,
    ...(input.selectedModSource === undefined
      ? {}
      : { selectedModSource: input.selectedModSource }),
    state: input.state,
  });
  const record: BrowserSaveRecord = {
    ...(input.selectedCharacterId === undefined
      ? {}
      : { selectedCharacterId: input.selectedCharacterId }),
    envelope: JSON.parse(serializeSaveEnvelope(envelope)) as Record<
      string,
      unknown
    >,
  };

  input.storage.setItem(
    input.key ?? BROWSER_SAVE_STORAGE_KEY,
    JSON.stringify(record)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
