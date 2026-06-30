import type { LoadedMod, ModRuntimeFailure } from "../contracts/mod-runtime";

export function validateModCapabilities(input: {
  loadedMod: LoadedMod;
  allowedCapabilities: readonly string[];
  requestId: string;
}): ModRuntimeFailure | null {
  const allowedCapabilities = new Set(input.allowedCapabilities);

  for (const capability of input.loadedMod.manifest.capabilities ?? []) {
    if (!allowedCapabilities.has(capability)) {
      return {
        code: "capability-rejected",
        message: `Capability "${capability}" is not allowed for mod "${input.loadedMod.manifest.id}".`,
        modId: input.loadedMod.manifest.id,
        requestId: input.requestId,
      };
    }
  }

  return null;
}
