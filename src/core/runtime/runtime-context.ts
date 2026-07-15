import type { EngineRegistry } from "../registry/engine-registry";

export type RuntimeContext = {
  registry: EngineRegistry;
  now?: () => number;
};
