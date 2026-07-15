import type { ActivatedMod } from "../contracts/mod-runtime";
import type { EngineRegistry } from "../registry/engine-registry";
import { createEngineSession } from "./engine-factory";

export function bootstrapEngine(input: {
  selectedModId?: string;
  activatedMod?: ActivatedMod;
  registry: EngineRegistry;
}) {
  const selectedModId = input.activatedMod?.modId ?? input.selectedModId;
  if (selectedModId == null) {
    throw new Error("Missing selected mod for engine bootstrap.");
  }

  const selectedMod =
    input.activatedMod?.manifest ?? input.registry.mods[selectedModId];
  if (!selectedMod) {
    throw new Error(`Unknown selected mod: ${selectedModId}`);
  }

  return createEngineSession({
    selectedMod,
    registry: input.registry,
  });
}
