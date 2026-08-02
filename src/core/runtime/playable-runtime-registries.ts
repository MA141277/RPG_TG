import type { ActivatedMod } from "../contracts/mod-runtime";
import type {
  PlayableDefinition,
  PlayableIntegrationDefinition,
} from "../contracts/playable-runtime";
import type { FlowPlayableDefinition } from "../../domain/playables/flow";
import {
  createPlayableDefinitionRegistry,
  type PlayableDefinitionRegistry,
} from "../registry/playable-definition-registry";
import {
  createPlayableIntegrationRegistry,
  type PlayableIntegrationRegistry,
} from "../registry/playable-integration-registry";
import { type PlayableShellRegistry } from "../registry/playable-shell-registry";

declare const require: (path: string) => unknown;

export type PlayableRuntimeRegistries = {
  definitions: PlayableDefinitionRegistry;
  integrations: PlayableIntegrationRegistry;
  shells: PlayableShellRegistry;
};

type PlayableContributionSource = {
  playables?: unknown;
  playableIntegrations?: unknown;
  playableShells?: unknown;
};

let defaultPlayableRuntimeRegistries: PlayableRuntimeRegistries | null = null;

export function createDefaultPlayableRuntimeRegistries(): PlayableRuntimeRegistries {
  const { installBuiltinPlayableDefinitions } = require(
    "../registry/builtin-playable-definition-registry"
  ) as {
    installBuiltinPlayableDefinitions: (registry: PlayableDefinitionRegistry) => void;
  };
  const { installBuiltinPlayableIntegrations } = require(
    "../registry/builtin-playable-integration-registry"
  ) as {
    installBuiltinPlayableIntegrations: (registry: PlayableIntegrationRegistry) => void;
  };
  const { createBuiltinPlayableShellRegistry } = require(
    "../registry/builtin-playable-shell-registry"
  ) as {
    createBuiltinPlayableShellRegistry: () => PlayableShellRegistry;
  };
  const definitions = createPlayableDefinitionRegistry();
  const integrations = createPlayableIntegrationRegistry();
  const shells = createBuiltinPlayableShellRegistry();

  installBuiltinPlayableDefinitions(definitions);
  installBuiltinPlayableIntegrations(integrations);

  return {
    definitions,
    integrations,
    shells,
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

    installFlowPlayableContributions(registries, contributionSource.playableShells);
  }

  return registries;
}

function installFlowPlayableContributions(
  registries: PlayableRuntimeRegistries,
  value: unknown
): void {
  if (!Array.isArray(value)) {
    return;
  }

  const { createFlowPlayableShell } = require(
    "../../application/playables/flow/shell"
  ) as {
    createFlowPlayableShell: (
      definition: FlowPlayableDefinition
    ) => ReturnType<PlayableShellRegistry["get"]>;
  };
  const {
    createFlowPlayableCommandPrefix,
    createFlowPlayableIntegrationId,
    createFlowPlayableTriggerId,
  } = require("../../domain/playables/flow") as {
    createFlowPlayableCommandPrefix: (flowId: string) => string;
    createFlowPlayableIntegrationId: (flowId: string) => string;
    createFlowPlayableTriggerId: (flowId: string) => string;
  };

  for (const definition of readFlowPlayableDefinitions(value)) {
    registries.definitions.register({
      id: definition.id,
      commandPrefix: createFlowPlayableCommandPrefix(definition.id),
    });
    registries.integrations.register({
      integrationId: createFlowPlayableIntegrationId(definition.id),
      playableId: definition.id,
      ownerDefaults: {
        ownerKind: "external",
        ownerId: null,
        returnPolicy: "close-only",
      },
      trigger: {
        triggerId: createFlowPlayableTriggerId(definition.id),
        ownerKind: "external",
        trigger: "manual-launch",
      },
      outcomeConfig: {},
    });
    const shell = createFlowPlayableShell(definition);
    if (shell != null) {
      registries.shells.register(shell);
    }
  }
}

export function configureDefaultPlayableRuntimeRegistriesFromActivatedMod(
  activatedMod: ActivatedMod
): void {
  defaultPlayableRuntimeRegistries =
    createPlayableRuntimeRegistriesFromActivatedMod(activatedMod);
}

export function resetDefaultPlayableRuntimeRegistries(): void {
  defaultPlayableRuntimeRegistries = null;
}

export function readDefaultPlayableDefinitionRegistry(): PlayableDefinitionRegistry {
  return ensureDefaultPlayableRuntimeRegistries().definitions;
}

export function readDefaultPlayableIntegrationRegistry(): PlayableIntegrationRegistry {
  return ensureDefaultPlayableRuntimeRegistries().integrations;
}

export function readDefaultPlayableShellRegistry(): PlayableShellRegistry {
  return ensureDefaultPlayableRuntimeRegistries().shells;
}

function ensureDefaultPlayableRuntimeRegistries(): PlayableRuntimeRegistries {
  if (defaultPlayableRuntimeRegistries == null) {
    defaultPlayableRuntimeRegistries = createDefaultPlayableRuntimeRegistries();
  }
  return defaultPlayableRuntimeRegistries;
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

function readFlowPlayableDefinitions(value: unknown): FlowPlayableDefinition[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => (isFlowPlayableDefinition(entry) ? [entry] : []));
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

function isFlowPlayableDefinition(value: unknown): value is FlowPlayableDefinition {
  if (value == null || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.initialNodeId === "string" &&
    Array.isArray(candidate.nodes)
  );
}
