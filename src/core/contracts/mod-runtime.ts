import type { GameModManifest } from "./mod-manifest";
import type { GameplayContributionRegistry } from "./gameplay-contribution";

export type ModSourceKind = "builtin" | "file" | "url";

export type ModSourceDescriptor =
  | { kind: "builtin"; modId: string }
  | { kind: "file"; name: string; filePath: string }
  | { kind: "url"; name: string; url: string };

export type LoadedMod = {
  source: ModSourceDescriptor;
  manifest: GameModManifest;
  rawContent: unknown;
};

export type ActivatedMod = {
  modId: string;
  manifest: GameModManifest;
  normalizedContentSources: unknown[];
  registeredDefinitionIds: string[];
  gameplayContributions: GameplayContributionRegistry;
  startupProfile: {
    playerCharacterId?: string;
    mapId?: string;
    cityId?: string;
    houseId?: string | null;
    view?: string;
  };
};

export type ModRuntimeState = {
  availableModsById: Record<string, LoadedMod>;
  activeModId: string | null;
  lastRequestId: string | null;
};

export type ModRuntimeRequest =
  | { type: "mod.discover"; requestId: string }
  | { type: "mod.load-builtin"; requestId: string; modId: string }
  | { type: "mod.load-file"; requestId: string; name: string; filePath: string }
  | { type: "mod.load-url"; requestId: string; name: string; url: string }
  | { type: "mod.select"; requestId: string; modId: string }
  | { type: "mod.activate"; requestId: string; modId: string }
  | { type: "mod.activate-loaded"; requestId: string; loadedMod: LoadedMod }
  | { type: "mod.deactivate"; requestId: string; modId: string }
  | { type: "mod.reload"; requestId: string; modId: string };

export type ModRuntimeFailureCode =
  | "mod-not-found"
  | "parse-failed"
  | "dependency-missing"
  | "dependency-conflict"
  | "capability-rejected"
  | "activation-failed"
  | "save-not-found"
  | "save-read-failed"
  | "save-migration-failed"
  | "runtime-restore-failed";

export type ModRuntimeFailure = {
  code: ModRuntimeFailureCode;
  message: string;
  modId?: string;
  requestId: string;
};

export type ModActivationResult =
  | { ok: true; state: ModRuntimeState; activatedMod: ActivatedMod }
  | { ok: false; state: ModRuntimeState; failure: ModRuntimeFailure };

export type SaveRestoreInput = {
  selectedModId: string;
  requestId: string;
};

export type RestoreFailure = ModRuntimeFailure;
