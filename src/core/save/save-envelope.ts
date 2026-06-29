import type { CoreGameState } from "../contracts/core-state";

export const CURRENT_SAVE_ENVELOPE_VERSION = "1.0.0";

export type SaveEnvelope = {
  version: string;
  selectedModId: string;
  engineState: CoreGameState["engine"];
  runtimeState: CoreGameState["runtime"];
  modState: CoreGameState["modState"];
};

export function createSaveEnvelope(input: {
  version: string;
  state: CoreGameState;
}): SaveEnvelope {
  return {
    version: input.version,
    selectedModId: input.state.engine.selectedModId,
    engineState: input.state.engine,
    runtimeState: input.state.runtime,
    modState: input.state.modState,
  };
}
