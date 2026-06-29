import type { CoreGameState } from "../contracts/core-state";
import type { EngineRegistry } from "../registry/engine-registry";

export type EngineSession = {
  state: CoreGameState;
  registry: EngineRegistry;
};
