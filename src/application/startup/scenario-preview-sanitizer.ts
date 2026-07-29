import type { ScenarioPackDefinition } from "../../domain/scenario-pack";
import type { ScenarioLaunchPolicy } from "../../domain/scenario-profile";

function stripDeferredEntryEventTiming(
  launchPolicy: ScenarioLaunchPolicy | undefined
): ScenarioLaunchPolicy | undefined {
  if (launchPolicy?.entryEventTiming !== "after-map-entry") {
    return launchPolicy;
  }

  const { entryEventTiming: _entryEventTiming, ...rest } = launchPolicy;
  return Object.keys(rest).length === 0 ? undefined : rest;
}

export function sanitizeScenarioPackForRuntimePreview(
  scenarioPack: ScenarioPackDefinition
): ScenarioPackDefinition {
  const launchPolicy = stripDeferredEntryEventTiming(
    scenarioPack.scenarioProfile.launchPolicy
  );
  const shouldStripDeferredEntryEvent =
    scenarioPack.scenarioProfile.launchPolicy?.entryEventTiming ===
      "after-map-entry" &&
    typeof scenarioPack.scenarioProfile.entryEventId === "string" &&
    scenarioPack.scenarioProfile.entryEventId.length > 0;

  if (
    !shouldStripDeferredEntryEvent &&
    launchPolicy === scenarioPack.scenarioProfile.launchPolicy
  ) {
    return scenarioPack;
  }

  const {
    entryEventId: _entryEventId,
    launchPolicy: _sourceLaunchPolicy,
    ...scenarioProfileWithoutDeferredEntry
  } = scenarioPack.scenarioProfile;

  return {
    ...scenarioPack,
    scenarioProfile: {
      ...scenarioProfileWithoutDeferredEntry,
      ...(launchPolicy == null ? {} : { launchPolicy }),
    },
  };
}
