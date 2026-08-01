import type { ActivatedMod } from "../contracts/mod-runtime";
import type {
  PlayableDefinition,
  PlayableIntegrationDefinition,
} from "../contracts/playable-runtime";
import { installBuiltinPlayableDefinitions } from "../registry/builtin-playable-definition-registry";
import { installBuiltinPlayableIntegrations } from "../registry/builtin-playable-integration-registry";
import {
  createPlayableDefinitionRegistry,
  type PlayableDefinitionRegistry,
} from "../registry/playable-definition-registry";
import {
  createPlayableIntegrationRegistry,
  type PlayableIntegrationRegistry,
} from "../registry/playable-integration-registry";

export type PlayableRuntimeRegistries = {
  definitions: PlayableDefinitionRegistry;
  integrations: PlayableIntegrationRegistry;
};

type PlayableContributionSource = {
  playables?: unknown;
  playableIntegrations?: unknown;
};

let defaultPlayableRuntimeRegistries = createDefaultPlayableRuntimeRegistries();

export function createDefaultPlayableRuntimeRegistries(): PlayableRuntimeRegistries {
  const definitions = createPlayableDefinitionRegistry();
  const integrations = createPlayableIntegrationRegistry();

  installBuiltinPlayableDefinitions(definitions);
  installBuiltinPlayableIntegrations(integrations);

  return {
    definitions,
    integrations,
  };
}

export function createPlayableRuntimeRegistriesFromActivatedMod(
  activatedMod: ActivatedMod
): PlayableRuntimeRegistries {
  const registries = createDefaultPlayableRuntimeRegistries();
  const contributedPlayableIds = new Set(activatedMod.gameplayContributions.playables);
  const contributedIntegrationIds = new Set(
    activatedMod.gameplayContributions.playableIntegrations
  );

  for (const source of activatedMod.normalizedContentSources) {
    if (source == null || typeof source !== "object") {
      continue;
    }

    const contributionSource = source as PlayableContributionSource;
    for (const definition of readPlayableDefinitions(contributionSource.playables)) {
      if (contributedPlayableIds.has(definition.id)) {
        registries.definitions.register(definition);
      }
    }

    for (const integration of readPlayableIntegrations(
      contributionSource.playableIntegrations
    )) {
      if (contributedIntegrationIds.has(integration.integrationId)) {
        registries.integrations.register(integration);
      }
    }
  }

  return registries;
}

export function configureDefaultPlayableRuntimeRegistriesFromActivatedMod(
  activatedMod: ActivatedMod
): void {
  defaultPlayableRuntimeRegistries =
    createPlayableRuntimeRegistriesFromActivatedMod(activatedMod);
}

export function resetDefaultPlayableRuntimeRegistries(): void {
  defaultPlayableRuntimeRegistries = createDefaultPlayableRuntimeRegistries();
}

export function readDefaultPlayableDefinitionRegistry(): PlayableDefinitionRegistry {
  return defaultPlayableRuntimeRegistries.definitions;
}

export function readDefaultPlayableIntegrationRegistry(): PlayableIntegrationRegistry {
  return defaultPlayableRuntimeRegistries.integrations;
}

function readPlayableDefinitions(value: unknown): PlayableDefinition[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => (isPlayableDefinition(entry) ? [entry] : []));
}

function readPlayableIntegrations(value: unknown): PlayableIntegrationDefinition[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) =>
    isPlayableIntegrationDefinition(entry) ? [entry] : []
  );
}

function isPlayableDefinition(value: unknown): value is PlayableDefinition {
  if (value == null || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.commandPrefix === "string"
  );
}

function isPlayableIntegrationDefinition(
  value: unknown
): value is PlayableIntegrationDefinition {
  if (value == null || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.integrationId === "string" &&
    typeof candidate.playableId === "string" &&
    candidate.ownerDefaults != null &&
    typeof candidate.ownerDefaults === "object" &&
    candidate.trigger != null &&
    typeof candidate.trigger === "object" &&
    candidate.outcomeConfig != null &&
    typeof candidate.outcomeConfig === "object"
  );
}
