import type { GameModManifest } from "../contracts/mod-manifest";
import type { GameplayContributionDeclaration } from "../contracts/gameplay-contribution";

export function parseModManifest(input: unknown): GameModManifest {
  if (input == null || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Invalid mod manifest payload.");
  }

  const candidate = input as Record<string, unknown>;
  const id = readRequiredString(candidate.id, "mod id");
  const version = readOptionalString(candidate.version) ?? "1.0.0";
  const schemaVersion =
    readOptionalString(candidate.schemaVersion) ??
    (typeof candidate.schemaVersion === "number"
      ? String(candidate.schemaVersion)
      : "1");
  const title = readOptionalString(candidate.title) ?? id;
  const entryContentPackIds = Array.isArray(candidate.entryContentPackIds)
    ? candidate.entryContentPackIds.map((entryContentPackId) =>
        readRequiredString(entryContentPackId, "entry content pack id")
      )
    : [id];
  const dependencies = readStringArray(candidate.dependencies);
  const conflictsWith = readStringArray(candidate.conflictsWith);
  const capabilities = readStringArray(candidate.capabilities);
  const gameplayContributions = normalizeGameplayContributions(
    candidate.gameplayContributions
  );
  const defaultStart = normalizeDefaultStart(candidate.defaultStart);

  return {
    id,
    schemaVersion,
    version,
    title,
    entryContentPackIds,
    ...(dependencies == null ? {} : { dependencies }),
    ...(conflictsWith == null ? {} : { conflictsWith }),
    ...(capabilities == null ? {} : { capabilities }),
    ...(gameplayContributions == null ? {} : { gameplayContributions }),
    ...(defaultStart == null ? {} : { defaultStart }),
  };
}

function normalizeGameplayContributions(
  value: unknown
): GameplayContributionDeclaration | undefined {
  if (value == null) {
    return undefined;
  }
  if (typeof value !== "object" || Array.isArray(value)) {
    throw new Error("mod gameplayContributions must be an object.");
  }

  const candidate = value as Record<string, unknown>;
  const navigation = readStringArray(candidate.navigation);
  const events = readStringArray(candidate.events);
  const scenes = readStringArray(candidate.scenes);
  const tasks = readStringArray(candidate.tasks);
  const houses = readStringArray(candidate.houses);
  const playables = readStringArray(candidate.playables);
  const playableIntegrations = readStringArray(candidate.playableIntegrations);

  return {
    ...(navigation == null ? {} : { navigation }),
    ...(events == null ? {} : { events }),
    ...(scenes == null ? {} : { scenes }),
    ...(tasks == null ? {} : { tasks }),
    ...(houses == null ? {} : { houses }),
    ...(playables == null ? {} : { playables }),
    ...(playableIntegrations == null ? {} : { playableIntegrations }),
  };
}

function normalizeDefaultStart(
  value: unknown
): GameModManifest["defaultStart"] | undefined {
  if (value == null) {
    return undefined;
  }
  if (typeof value !== "object" || Array.isArray(value)) {
    throw new Error("mod defaultStart must be an object.");
  }

  const candidate = value as Record<string, unknown>;
  const playerCharacterId = readOptionalString(candidate.playerCharacterId);
  const mapId = readOptionalString(candidate.mapId);
  const cityId = readOptionalString(candidate.cityId);
  const houseId =
    candidate.houseId === null ? null : readOptionalString(candidate.houseId);
  const sceneId = readOptionalString(candidate.sceneId);
  const view = readOptionalString(candidate.view);

  return {
    ...(playerCharacterId == null ? {} : { playerCharacterId }),
    ...(mapId == null ? {} : { mapId }),
    ...(cityId == null ? {} : { cityId }),
    ...(houseId == null ? {} : { houseId }),
    ...(sceneId == null ? {} : { sceneId }),
    ...(view == null ? {} : { view }),
  };
}

function readRequiredString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }

  return value;
}

function readOptionalString(value: unknown): string | undefined {
  if (value == null) {
    return undefined;
  }
  if (typeof value !== "string" || value.trim().length === 0) {
    return undefined;
  }

  return value;
}

function readStringArray(value: unknown): string[] | undefined {
  if (value == null) {
    return undefined;
  }
  if (!Array.isArray(value)) {
    throw new Error("mod string list must be an array.");
  }

  return value.map((entry) => readRequiredString(entry, "mod string list entry"));
}
