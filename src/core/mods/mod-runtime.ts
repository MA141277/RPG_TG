import type { GameModManifest } from "../contracts/mod-manifest";
import type {
  ActivatedMod,
  LoadedMod,
  ModActivationResult,
  ModRuntimeFailure,
  ModRuntimeRequest,
  ModRuntimeState,
  ModSourceDescriptor,
} from "../contracts/mod-runtime";
import type {
  GameplayContributionDeclaration,
  GameplayContributionRegistry,
} from "../contracts/gameplay-contribution";
import type { ContentPackDefinition } from "../../domain/content-pack";
import type { ScenarioPackDefinition } from "../../domain/scenario-pack";
import {
  loadModSource,
  type ModSourceLoaderContext,
} from "./mod-source-loader";
import { normalizeModSource } from "./mod-source-registry";
import { validateModCapabilities } from "./mod-capability-guard";
import { validateModDependencies } from "./mod-dependency-resolver";

export type ModRuntimeContext = ModSourceLoaderContext & {
  allowedCapabilities?: readonly string[];
};

export function createEmptyModRuntimeState(): ModRuntimeState {
  return {
    availableModsById: {},
    activeModId: null,
    lastRequestId: null,
  };
}

export function createLoadedModFromManifest(input: {
  source: ModSourceDescriptor;
  manifest: GameModManifest;
  rawContent: unknown;
}): LoadedMod {
  return {
    source: normalizeModSource(input.source),
    manifest: input.manifest,
    rawContent: input.rawContent,
  };
}

export function createLoadedModFromScenarioPack(input: {
  source: ModSourceDescriptor;
  scenarioPack: ScenarioPackDefinition;
  baseContentPack?: ContentPackDefinition;
}): LoadedMod {
  const profile = input.scenarioPack.scenarioProfile;
  const entryContentPackIds = Array.from(
    new Set([
      ...(input.baseContentPack == null ? [] : [input.baseContentPack.id]),
      input.scenarioPack.id,
    ])
  );

  return createLoadedModFromManifest({
    source: input.source,
    manifest: {
      id: input.scenarioPack.id,
      schemaVersion: String(input.scenarioPack.schemaVersion),
      version: "1.0.0",
      title: input.scenarioPack.title,
      entryContentPackIds,
      defaultStart: {
        playerCharacterId: profile.playerCharacterId,
        mapId: profile.initialLocation.mapId,
        cityId: profile.initialLocation.cityId,
        houseId: profile.initialLocation.houseId,
        view: profile.initialLocation.view,
      },
    },
    rawContent:
      input.baseContentPack == null
        ? input.scenarioPack
        : [input.baseContentPack, input.scenarioPack],
  });
}

export async function runModRuntime(input: {
  state: ModRuntimeState;
  request: ModRuntimeRequest;
  context?: ModRuntimeContext;
}): Promise<ModActivationResult> {
  const context = input.context ?? {};

  try {
    if (input.request.type === "mod.activate-loaded") {
      return activateLoadedMod({
        state: input.state,
        requestId: input.request.requestId,
        loadedMod: input.request.loadedMod,
        allowedCapabilities: context.allowedCapabilities ?? [],
      });
    }

    if (input.request.type === "mod.load-builtin") {
      const loadedMod = await loadModSource(
        { kind: "builtin", modId: input.request.modId },
        context
      );
      return activateLoadedMod({
        state: input.state,
        requestId: input.request.requestId,
        loadedMod,
        allowedCapabilities: context.allowedCapabilities ?? [],
      });
    }

    if (input.request.type === "mod.load-file") {
      const loadedMod = await loadModSource(
        {
          kind: "file",
          name: input.request.name,
          filePath: input.request.filePath,
        },
        context
      );
      return activateLoadedMod({
        state: input.state,
        requestId: input.request.requestId,
        loadedMod,
        allowedCapabilities: context.allowedCapabilities ?? [],
      });
    }

    if (input.request.type === "mod.load-url") {
      const loadedMod = await loadModSource(
        { kind: "url", name: input.request.name, url: input.request.url },
        context
      );
      return activateLoadedMod({
        state: input.state,
        requestId: input.request.requestId,
        loadedMod,
        allowedCapabilities: context.allowedCapabilities ?? [],
      });
    }

    if (
      input.request.type === "mod.activate" ||
      input.request.type === "mod.select"
    ) {
      const loadedMod = input.state.availableModsById[input.request.modId];
      if (loadedMod == null) {
        return failActivation({
          state: input.state,
          requestId: input.request.requestId,
          code: "mod-not-found",
          message: `Unknown mod: ${input.request.modId}`,
          modId: input.request.modId,
        });
      }

      return activateLoadedMod({
        state: input.state,
        requestId: input.request.requestId,
        loadedMod,
        allowedCapabilities: context.allowedCapabilities ?? [],
      });
    }

    if (input.request.type === "mod.discover") {
      const activeMod = readActiveLoadedMod(input.state);
      if (activeMod == null) {
        return failActivation({
          state: input.state,
          requestId: input.request.requestId,
          code: "mod-not-found",
          message: "No active mod is available after discovery.",
        });
      }

      return {
        ok: true,
        state: { ...input.state, lastRequestId: input.request.requestId },
        activatedMod: createActivatedMod(activeMod),
      };
    }

    if (input.request.type === "mod.deactivate") {
      return failActivation({
        state: {
          ...input.state,
          activeModId: null,
          lastRequestId: input.request.requestId,
        },
        requestId: input.request.requestId,
        code: "activation-failed",
        message: `Mod deactivation is not a bootable activation result for "${input.request.modId}".`,
        modId: input.request.modId,
      });
    }

    const loadedMod = input.state.availableModsById[input.request.modId];
    if (loadedMod == null) {
      return failActivation({
        state: input.state,
        requestId: input.request.requestId,
        code: "mod-not-found",
        message: `Cannot reload unknown mod: ${input.request.modId}`,
        modId: input.request.modId,
      });
    }

    return activateLoadedMod({
      state: input.state,
      requestId: input.request.requestId,
      loadedMod,
      allowedCapabilities: context.allowedCapabilities ?? [],
    });
  } catch (error) {
    return failActivation({
      state: input.state,
      requestId: input.request.requestId,
      code: "parse-failed",
      message:
        error instanceof Error
          ? error.message
          : "Mod source could not be parsed.",
    });
  }
}

function activateLoadedMod(input: {
  state: ModRuntimeState;
  requestId: string;
  loadedMod: LoadedMod;
  allowedCapabilities: readonly string[];
}): ModActivationResult {
  const previousActiveModId = input.state.activeModId;
  const nextAvailableModsById = {
    ...input.state.availableModsById,
    [input.loadedMod.manifest.id]: input.loadedMod,
  };

  const dependencyFailure = validateModDependencies({
    loadedMod: input.loadedMod,
    availableModsById: nextAvailableModsById,
    requestId: input.requestId,
  });
  if (dependencyFailure != null) {
    return rollbackActivation(input.state, input.requestId, dependencyFailure);
  }

  const capabilityFailure = validateModCapabilities({
    loadedMod: input.loadedMod,
    allowedCapabilities: input.allowedCapabilities,
    requestId: input.requestId,
  });
  if (capabilityFailure != null) {
    return rollbackActivation(input.state, input.requestId, capabilityFailure);
  }

  try {
    return {
      ok: true,
      state: {
        availableModsById: nextAvailableModsById,
        activeModId: input.loadedMod.manifest.id,
        lastRequestId: input.requestId,
      },
      activatedMod: createActivatedMod(input.loadedMod),
    };
  } catch (error) {
    return rollbackActivation(input.state, input.requestId, {
      code: "activation-failed",
      message:
        error instanceof Error ? error.message : "Mod activation failed.",
      modId: previousActiveModId ?? input.loadedMod.manifest.id,
      requestId: input.requestId,
    });
  }
}

function rollbackActivation(
  state: ModRuntimeState,
  requestId: string,
  failure: ModRuntimeFailure
): ModActivationResult {
  const previousActiveModId = state.activeModId;

  return {
    ok: false,
    state: {
      ...state,
      activeModId: previousActiveModId,
      lastRequestId: requestId,
    },
    failure,
  };
}

function failActivation(input: {
  state: ModRuntimeState;
  requestId: string;
  code: ModRuntimeFailure["code"];
  message: string;
  modId?: string;
}): ModActivationResult {
  return {
    ok: false,
    state: { ...input.state, lastRequestId: input.requestId },
    failure: {
      code: input.code,
      message: input.message,
      requestId: input.requestId,
      ...(input.modId == null ? {} : { modId: input.modId }),
    },
  };
}

function readActiveLoadedMod(state: ModRuntimeState): LoadedMod | null {
  if (state.activeModId == null) {
    return null;
  }

  return state.availableModsById[state.activeModId] ?? null;
}

function createActivatedMod(loadedMod: LoadedMod): ActivatedMod {
  const normalizedContentSources = Array.isArray(loadedMod.rawContent)
    ? loadedMod.rawContent
    : [loadedMod.rawContent];

  return {
    modId: loadedMod.manifest.id,
    manifest: loadedMod.manifest,
    normalizedContentSources,
    registeredDefinitionIds: loadedMod.manifest.entryContentPackIds,
    gameplayContributions: installGameplayContributions({
      manifest: loadedMod.manifest,
      normalizedContentSources,
    }),
    startupProfile: {
      ...(loadedMod.manifest.defaultStart?.playerCharacterId == null
        ? {}
        : {
            playerCharacterId:
              loadedMod.manifest.defaultStart.playerCharacterId,
          }),
      ...(loadedMod.manifest.defaultStart?.mapId == null
        ? {}
        : { mapId: loadedMod.manifest.defaultStart.mapId }),
      ...(loadedMod.manifest.defaultStart?.cityId == null
        ? {}
        : { cityId: loadedMod.manifest.defaultStart.cityId }),
      ...(loadedMod.manifest.defaultStart?.houseId == null
        ? {}
        : { houseId: loadedMod.manifest.defaultStart.houseId }),
      ...(loadedMod.manifest.defaultStart?.view == null
        ? {}
        : { view: loadedMod.manifest.defaultStart.view }),
    },
  };
}

type ContributionSource = {
  id?: unknown;
  maps?: unknown;
  cities?: unknown;
  cityEntries?: unknown;
  events?: unknown;
  scenes?: unknown;
  tasks?: unknown;
  houses?: unknown;
};

function installGameplayContributions(input: {
  manifest: GameModManifest;
  normalizedContentSources: unknown[];
}): GameplayContributionRegistry {
  const sources = input.normalizedContentSources.filter(
    (source): source is ContributionSource =>
      source != null && typeof source === "object"
  );
  const availableNavigation = uniqueStrings([
    ...collectRecordIds(sources, "maps"),
    ...collectRecordIds(sources, "cities"),
    ...collectRecordIds(sources, "cityEntries"),
  ]);
  const availableEvents = uniqueStrings(collectRecordIds(sources, "events"));
  const availableScenes = uniqueStrings(collectRecordIds(sources, "scenes"));
  const availableTasks = uniqueStrings(collectRecordIds(sources, "tasks"));
  const availableHouses = uniqueStrings(collectRecordIds(sources, "houses"));
  const resolvedHouses = resolveContributionIds({
    family: "houses",
    declaredIds: input.manifest.gameplayContributions?.houses,
    availableIds: availableHouses,
  });

  return {
    contentPackIds: uniqueStrings([
      ...input.manifest.entryContentPackIds,
      ...sources.flatMap((source) =>
        typeof source.id === "string" && source.id.trim().length > 0
          ? [source.id]
          : []
      ),
    ]),
    navigation: resolveContributionIds({
      family: "navigation",
      declaredIds: input.manifest.gameplayContributions?.navigation,
      availableIds: availableNavigation,
      fallbackToAvailable: true,
    }),
    events: resolveContributionIds({
      family: "events",
      declaredIds: input.manifest.gameplayContributions?.events,
      availableIds: availableEvents,
    }),
    scenes: resolveContributionIds({
      family: "scenes",
      declaredIds: input.manifest.gameplayContributions?.scenes,
      availableIds: availableScenes,
    }),
    tasks: resolveContributionIds({
      family: "tasks",
      declaredIds: input.manifest.gameplayContributions?.tasks,
      availableIds: availableTasks,
    }),
    houses: resolvedHouses,
    houseModules: collectHouseModuleIds(sources, resolvedHouses),
  };
}

function collectRecordIds(
  sources: readonly ContributionSource[],
  key: keyof ContributionSource
): string[] {
  return sources.flatMap((source) => {
    const value = source[key];
    if (!Array.isArray(value)) {
      return [];
    }

    return value.flatMap((entry) => {
      if (entry == null || typeof entry !== "object") {
        return [];
      }

      const id = (entry as { id?: unknown }).id;
      return typeof id === "string" && id.trim().length > 0 ? [id] : [];
    });
  });
}

function resolveContributionIds(input: {
  family: keyof GameplayContributionDeclaration;
  declaredIds: readonly string[] | undefined;
  availableIds: readonly string[];
  fallbackToAvailable?: boolean;
}): string[] {
  if (input.declaredIds == null) {
    return input.fallbackToAvailable === true
      ? [...input.availableIds]
      : [];
  }

  const availableIds = new Set(input.availableIds);
  const missingIds = input.declaredIds.filter((id) => !availableIds.has(id));
  if (missingIds.length > 0) {
    throw new Error(
      `Mod gameplay contributions declare unknown ${input.family}: ${missingIds.join(", ")}`
    );
  }

  return uniqueStrings(input.declaredIds);
}

function collectHouseModuleIds(
  sources: readonly ContributionSource[],
  contributedHouseIds: readonly string[]
): string[] {
  if (contributedHouseIds.length === 0) {
    return [];
  }

  const contributedHouseIdSet = new Set(contributedHouseIds);

  return uniqueStrings(
    sources.flatMap((source) => {
      if (!Array.isArray(source.houses)) {
        return [];
      }

      return source.houses.flatMap((house) => {
        if (house == null || typeof house !== "object") {
          return [];
        }

        const record = house as { id?: unknown; moduleId?: unknown };
        if (
          typeof record.id !== "string" ||
          !contributedHouseIdSet.has(record.id) ||
          typeof record.moduleId !== "string" ||
          record.moduleId.trim().length === 0
        ) {
          return [];
        }

        return [record.moduleId];
      });
    })
  );
}

function uniqueStrings(values: readonly string[]): string[] {
  return Array.from(new Set(values));
}
