import { bootstrapEngine } from "../engine/engine-bootstrap";
import type { EngineRegistry } from "../registry/engine-registry";

export function bootstrapLegacyMain(input: {
  selectedModId: string;
  registry: EngineRegistry;
}) {
  return bootstrapEngine(input);
}
