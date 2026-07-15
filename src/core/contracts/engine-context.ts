import type { EngineRegistry } from "../registry/engine-registry";
import type { CoreGameState } from "./core-state";
import type { GameModManifest } from "./mod-manifest";

export type EngineContext = {
  state: CoreGameState;
  registry: EngineRegistry;
  selectedMod: GameModManifest;
};
