import type { GameModManifest } from "../contracts/mod-manifest";
import type { ActivatedMod } from "../contracts/mod-runtime";
import type { EngineRegistry } from "../registry/engine-registry";
import type { EngineSession } from "./engine-session";

export function createEngineSession(input: {
  selectedMod: GameModManifest | ActivatedMod;
  registry: EngineRegistry;
}): EngineSession {
  const selectedMod =
    "manifest" in input.selectedMod
      ? input.selectedMod.manifest
      : input.selectedMod;

  return {
    registry: input.registry,
    state: {
      engine: {
        selectedModId: selectedMod.id,
        version: selectedMod.version,
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
