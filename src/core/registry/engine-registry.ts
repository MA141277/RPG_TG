import type { ContentRegistry } from "./content-registry";
import type { ModRegistry } from "./mod-registry";

export type EngineRegistry = {
  mods: ModRegistry;
  content: ContentRegistry;
};
