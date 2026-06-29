import type { EngineRegistry } from "../registry/engine-registry";
import { createEngineSession } from "./engine-factory";

export function bootstrapEngine(input: {
  selectedModId: string;
  registry: EngineRegistry;
}) {
  const selectedMod = input.registry.mods[input.selectedModId];
  if (!selectedMod) {
    throw new Error(`Unknown selected mod: ${input.selectedModId}`);
  }

  return createEngineSession({
    selectedMod,
    registry: input.registry,
  });
}
