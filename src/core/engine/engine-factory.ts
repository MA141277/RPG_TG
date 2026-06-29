import type { GameModManifest } from "../contracts/mod-manifest";
import type { EngineRegistry } from "../registry/engine-registry";
import type { EngineSession } from "./engine-session";

export function createEngineSession(input: {
  selectedMod: GameModManifest;
  registry: EngineRegistry;
}): EngineSession {
  return {
    registry: input.registry,
    state: {
      engine: {
        selectedModId: input.selectedMod.id,
        version: input.selectedMod.version,
        currentView: "map",
      },
      runtime: {
        flags: {},
        variables: {},
        activeEventId: null,
        activeTaskIds: [],
      },
      modState: {},
    },
  };
}
