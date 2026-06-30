import type { ModActivationResult } from "../contracts/mod-runtime";

export function toLegacyBootstrapInput(result: ModActivationResult) {
  if (!result.ok) {
    throw new Error(result.failure.message);
  }

  return {
    selectedModId: result.activatedMod.modId,
    selectedMod: result.activatedMod.manifest,
    startupProfile: result.activatedMod.startupProfile,
    normalizedContentSources: result.activatedMod.normalizedContentSources,
  };
}
