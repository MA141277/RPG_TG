import type { CoreGameState } from "../contracts/core-state";
import type { ModSourceDescriptor } from "../contracts/mod-runtime";

export const CURRENT_SAVE_ENVELOPE_VERSION = "1.0.0";

export type SaveEnvelope = {
  version: string;
  selectedModId: string;
  selectedModSource: ModSourceDescriptor | null;
  engineState: CoreGameState["engine"];
  runtimeState: CoreGameState["runtime"];
  modState: CoreGameState["modState"];
};

export function createSaveEnvelope(input: {
  version: string;
  selectedModSource?: ModSourceDescriptor | null;
  state: CoreGameState;
}): SaveEnvelope {
  const selectedModId = input.state.engine.selectedModId;

  return {
    version: input.version,
    selectedModId,
    selectedModSource:
      input.selectedModSource ??
      (selectedModId.startsWith("builtin.")
        ? {
            kind: "builtin",
            modId: selectedModId,
          }
        : null),
    engineState: input.state.engine,
    runtimeState: input.state.runtime,
    modState: input.state.modState,
  };
}
