import { resolveContentPackMapAssetUrls } from "../content/content-pack-loader";
import { assertHouseModuleDefaults } from "../content/house-module-defaults";
import type { ScenarioPackDefinition } from "../../domain/scenario-pack";

export async function loadScenarioPackFromUrl(
  url: string
): Promise<ScenarioPackDefinition> {
  const resolvedManifestUrl = resolveScenarioPackManifestUrl(url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load scenario pack: ${response.status}`);
  }

  const rawPack = await response.json();
  if (isScenarioPackManifest(rawPack)) {
    return parseScenarioPack(
      await hydrateScenarioPackManifest(rawPack, resolvedManifestUrl)
    );
  }

  return parseScenarioPack(rawPack);
}

export async function loadScenarioPackFromFiles(
  files: readonly File[]
): Promise<ScenarioPackDefinition> {
  if (files.length === 0) {
    throw new Error("Scenario pack import must include at least one file.");
  }

  const indexedFiles = indexScenarioPackImportFiles(files);
  const manifestFileEntry = selectScenarioPackManifestFileEntry(indexedFiles);

  if (manifestFileEntry == null) {
    const scriptEditorProjectManifestEntry =
      selectScriptEditorProjectManifestFileEntry(indexedFiles);
    if (scriptEditorProjectManifestEntry != null) {
      const rawProjectManifest = JSON.parse(
        await scriptEditorProjectManifestEntry.file.text()
      );
      if (
        typeof rawProjectManifest === "object" &&
        rawProjectManifest != null &&
        (rawProjectManifest as { kind?: unknown }).kind === "script-editor-project"
      ) {
        throw new Error(
          "导入的是 Script Editor 项目包（project.json kind=script-editor-project），不是 JSON 开局需要的运行时剧本包。请在剧本编辑器中打开项目，或先导出运行时剧本包再用于 JSON 开局；JSON 开局目录必须包含 pack.json。"
        );
      }
    }

    if (files.length === 1) {
      const [singleFile] = files;
      if (singleFile == null) {
        throw new Error("Scenario pack import must include at least one file.");
      }
      return parseScenarioPackText(await singleFile.text());
    }

    throw new Error("Imported scenario pack is missing pack.json.");
  }

  const rawPack = JSON.parse(await manifestFileEntry.file.text());
  if (isScenarioPackManifest(rawPack)) {
    return parseScenarioPack(
      await hydrateScenarioPackManifestFromFiles(
        rawPack,
        manifestFileEntry.relativePath,
        indexedFiles
      )
    );
  }

  return parseScenarioPack(rawPack);
}

export function parseScenarioPackText(text: string): ScenarioPackDefinition {
  return parseScenarioPack(JSON.parse(text));
}

export function parseScenarioPack(value: unknown): ScenarioPackDefinition {
  assertObject(value, "scenario pack");
  if (value.schemaVersion !== 1) {
    throw new Error("Scenario pack schemaVersion must be 1.");
  }
  assertString(value.id, "scenario pack id");
  assertString(value.title, "scenario pack title");
  assertObject(value.scenarioProfile, "scenario profile");
  assertString(value.scenarioProfile.id, "scenario profile id");
  assertString(value.scenarioProfile.playerCharacterId, "scenario playerCharacterId");
  assertString(value.scenarioProfile.chapterId, "scenario chapterId");
  assertObject(value.scenarioProfile.initialLocation, "scenario initialLocation");
  assertString(value.scenarioProfile.initialLocation.mapId, "scenario initialLocation.mapId");
  assertString(value.scenarioProfile.initialLocation.cityId, "scenario initialLocation.cityId");
  if (
    value.scenarioProfile.initialLocation.houseId !== null &&
    typeof value.scenarioProfile.initialLocation.houseId !== "string"
  ) {
    throw new Error("scenario initialLocation.houseId must be string or null.");
  }
  assertString(value.scenarioProfile.initialLocation.view, "scenario initialLocation.view");
  if (value.scenarioProfile.launchPolicy != null) {
    assertObject(value.scenarioProfile.launchPolicy, "scenario launchPolicy");
    assertOptionalEnum(
      value.scenarioProfile.launchPolicy.characterSelection,
      "scenario launchPolicy.characterSelection",
      ["shell", "fixed"]
    );
    assertOptionalString(
      value.scenarioProfile.launchPolicy.initialView,
      "scenario launchPolicy.initialView"
    );
    assertOptionalEnum(
      value.scenarioProfile.launchPolicy.entryEventTiming,
      "scenario launchPolicy.entryEventTiming",
      ["immediate", "after-map-entry"]
    );
  }
  assertArray(value.characters, "scenario characters");
  if (value.cities != null) {
    assertArray(value.cities, "scenario cities");
  }
  if (value.houses != null) {
    assertArray(value.houses, "scenario houses");
  }
  if (value.maps != null) {
    assertArray(value.maps, "scenario maps");
  }
  if (value.cityEntries != null) {
    assertArray(value.cityEntries, "scenario city entries");
  }
  assertArray(value.events, "scenario events");
  assertRuntimeEventsDoNotUseRetiredTriggerFields(value.events);
  if (value.eventBindings != null) {
    assertArray(value.eventBindings, "scenario eventBindings");
  }
  assertArray(value.scenes, "scenario scenes");
  if (value.tasks != null) {
    assertArray(value.tasks, "scenario tasks");
  }
  if (value.playables != null) {
    assertArray(value.playables, "scenario playables");
  }
  if (value.playableIntegrations != null) {
    assertArray(value.playableIntegrations, "scenario playable integrations");
  }

  if (value.activities != null) {
    assertArray(value.activities, "scenario activities");
  }
  if (value.cards != null) {
    assertArray(value.cards, "scenario cards");
  }
  if (value.valuables != null) {
    assertArray(value.valuables, "scenario valuables");
  }
  if (value.cityNpcPools != null) {
    assertArray(value.cityNpcPools, "scenario city npc pools");
  }
  if (value.houseAccessRefusalRules != null) {
    assertArray(value.houseAccessRefusalRules, "scenario house access refusal rules");
  }
  if (value.locationAccess != null) {
    assertArray(value.locationAccess, "scenario location access");
  }
  if (value.houseModuleDefaults != null) {
    assertHouseModuleDefaults(
      value.houseModuleDefaults,
      "scenario houseModuleDefaults"
    );
  }
  if (value.historicalCharacters != null) {
    assertArray(value.historicalCharacters, "scenario historical characters");
  }
  if (value.historicalCityRosters != null) {
    assertArray(value.historicalCityRosters, "scenario historical city rosters");
  }
  if (value.cityPortraits != null) {
    assertObject(value.cityPortraits, "scenario city portraits");
  }
  if (value.textEntries != null) {
    assertObject(value.textEntries, "scenario text entries");
  }
  if (value.historicalCharacterIdByCharacterId != null) {
    assertObject(
      value.historicalCharacterIdByCharacterId,
      "scenario historical character mapping"
    );
  }

  return value as ScenarioPackDefinition;
}

function assertRuntimeEventsDoNotUseRetiredTriggerFields(events: unknown[]): void {
  events.forEach((eventDefinition, index) => {
    assertObject(eventDefinition, `scenario events[${index}]`);
    if (
      Object.hasOwn(eventDefinition, "trigger") ||
      Object.hasOwn(eventDefinition, "conditions")
    ) {
      throw new Error(
        `scenario events[${index}] event body trigger/conditions are retired; use event-bindings.json for runtime trigger configuration.`
      );
    }
  });
}

type ScenarioPackManifestFiles = {
  scenarioProfile: string;
  characters: string;
  events: string;
  scenes: string;
  tasks?: string;
  playables?: string;
  playableIntegrations?: string;
  cities?: string;
  houses?: string;
  maps?: string;
  cityEntries?: string;
  textEntries?: string;
  eventBindings?: string;
  activities?: string;
  cards?: string;
  valuables?: string;
  cityNpcPools?: string;
  houseAccessRefusalRules?: string;
  locationAccess?: string;
  houseModuleDefaults?: string;
  historicalCharacters?: string;
  historicalCityRosters?: string;
  cityPortraits?: string;
  historicalCharacterIdByCharacterId?: string;
};

type ScenarioPackManifest = {
  schemaVersion: 1;
  kind?: "scenario-pack";
  id: string;
  title: string;
  description?: string;
  files: ScenarioPackManifestFiles;
};

type ScenarioPackImportFileEntry = {
  file: File;
  relativePath: string;
};

function resolveScenarioPackManifestUrl(url: string): string {
  if (/^(https?:|file:)/.test(url)) {
    return url;
  }

  if (url.startsWith("/") && typeof window !== "undefined") {
    return new URL(url, window.location.href).href;
  }

  return url;
}

function indexScenarioPackImportFiles(
  files: readonly File[]
): Record<string, ScenarioPackImportFileEntry> {
  return Object.fromEntries(
    files.map((file) => {
      const relativePath = normalizeScenarioPackImportPath(
        file.webkitRelativePath || file.name
      );
      return [relativePath, { file, relativePath }] as const;
    })
  );
}

function selectScenarioPackManifestFileEntry(
  indexedFiles: Record<string, ScenarioPackImportFileEntry>
): ScenarioPackImportFileEntry | null {
  const manifestEntries = Object.values(indexedFiles).filter((entry) =>
    entry.relativePath.endsWith("/pack.json") || entry.relativePath === "pack.json"
  );

  if (manifestEntries.length === 0) {
    return null;
  }

  if (manifestEntries.length > 1) {
    throw new Error("Imported scenario pack contains multiple pack.json files.");
  }

  return manifestEntries[0] ?? null;
}

function selectScriptEditorProjectManifestFileEntry(
  indexedFiles: Record<string, ScenarioPackImportFileEntry>
): ScenarioPackImportFileEntry | null {
  const projectEntries = Object.values(indexedFiles).filter((entry) =>
    entry.relativePath.endsWith("/project.json") || entry.relativePath === "project.json"
  );

  if (projectEntries.length === 0) {
    return null;
  }

  return projectEntries[0] ?? null;
}

async function hydrateScenarioPackManifest(
  manifest: ScenarioPackManifest,
  manifestUrl: string
): Promise<unknown> {
  const fileEntries = Object.entries(manifest.files);
  const resolvedEntries = await Promise.all(
    fileEntries.map(async ([key, relativePath]) => {
      const response = await fetch(new URL(relativePath, manifestUrl).href);
      if (!response.ok) {
        throw new Error(`Failed to load scenario pack file "${key}": ${response.status}`);
      }

      return [key, await response.json()] as const;
    })
  );

  const hydratedFields = Object.fromEntries(resolvedEntries);
  const resolvedMaps = resolveContentPackMapAssetUrls(
    hydratedFields.maps,
    manifestUrl
  );

  return {
    schemaVersion: manifest.schemaVersion,
    id: manifest.id,
    title: manifest.title,
    ...(manifest.description == null ? {} : { description: manifest.description }),
    ...hydratedFields,
    ...(resolvedMaps == null ? {} : { maps: resolvedMaps }),
  };
}

async function hydrateScenarioPackManifestFromFiles(
  manifest: ScenarioPackManifest,
  manifestFilePath: string,
  indexedFiles: Record<string, ScenarioPackImportFileEntry>
): Promise<unknown> {
  const manifestDirectoryPath = getScenarioPackImportDirectoryPath(
    manifestFilePath
  );
  const fileEntries = Object.entries(manifest.files);
  const resolvedEntries = await Promise.all(
    fileEntries.map(async ([key, relativePath]) => {
      const importedFile = resolveScenarioPackImportedFileEntry(
        indexedFiles,
        manifestDirectoryPath,
        relativePath
      );
      return [key, JSON.parse(await importedFile.file.text())] as const;
    })
  );

  const hydratedFields = Object.fromEntries(resolvedEntries);
  const resolvedMaps = resolveImportedScenarioPackMapAssetUrls(
    hydratedFields.maps,
    manifestDirectoryPath,
    indexedFiles
  );

  return {
    schemaVersion: manifest.schemaVersion,
    id: manifest.id,
    title: manifest.title,
    ...(manifest.description == null ? {} : { description: manifest.description }),
    ...hydratedFields,
    ...(resolvedMaps == null ? {} : { maps: resolvedMaps }),
  };
}

function resolveImportedScenarioPackMapAssetUrls(
  maps: ScenarioPackDefinition["maps"],
  manifestDirectoryPath: string,
  indexedFiles: Record<string, ScenarioPackImportFileEntry>
) {
  const assetUrlCache: Record<string, string> = {};

  return maps?.map((mapDefinition, mapIndex) => ({
    ...mapDefinition,
    ...(mapDefinition.primaryImageUrl == null
      ? {}
      : {
          primaryImageUrl: resolveImportedScenarioPackAssetUrl(
            readImportedScenarioPackAssetPath(
              mapDefinition.primaryImageUrl,
              `scenario maps[${mapIndex}].primaryImageUrl`
            ),
            manifestDirectoryPath,
            indexedFiles,
            assetUrlCache
          ),
        }),
    ...(mapDefinition.regionOverlayImageUrl == null
      ? {}
      : {
          regionOverlayImageUrl: resolveImportedScenarioPackAssetUrl(
            readImportedScenarioPackAssetPath(
              mapDefinition.regionOverlayImageUrl,
              `scenario maps[${mapIndex}].regionOverlayImageUrl`
            ),
            manifestDirectoryPath,
            indexedFiles,
            assetUrlCache
          ),
        }),
    ...(mapDefinition.layers == null
      ? {}
      : {
          layers: mapDefinition.layers.map((layerDefinition, layerIndex) => ({
            ...layerDefinition,
            imageUrl: resolveImportedScenarioPackAssetUrl(
              readImportedScenarioPackAssetPath(
                layerDefinition.imageUrl,
                `scenario maps[${mapIndex}].layers[${layerIndex}].imageUrl`
              ),
              manifestDirectoryPath,
              indexedFiles,
              assetUrlCache
            ),
          })),
        }),
  }));
}

function readImportedScenarioPackAssetPath(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }

  return value;
}

function resolveImportedScenarioPackAssetUrl(
  value: string,
  manifestDirectoryPath: string,
  indexedFiles: Record<string, ScenarioPackImportFileEntry>,
  assetUrlCache: Record<string, string>
): string {
  if (value.startsWith("data:")) {
    return normalizeImageDataUrlMime(value);
  }

  if (/^(https?:|file:|blob:|\/)/.test(value)) {
    return value;
  }

  const importedFile = resolveScenarioPackImportedFileEntry(
    indexedFiles,
    manifestDirectoryPath,
    value
  );
  const cachedAssetUrl = assetUrlCache[importedFile.relativePath];
  if (cachedAssetUrl != null) {
    return cachedAssetUrl;
  }

  const nextAssetUrl = URL.createObjectURL(createImportedAssetBlob(importedFile));
  assetUrlCache[importedFile.relativePath] = nextAssetUrl;
  return nextAssetUrl;
}

function createImportedAssetBlob(importedFile: ScenarioPackImportFileEntry): Blob {
  const mimeType = resolveImportedAssetMimeType(importedFile);
  if (mimeType === importedFile.file.type) {
    return importedFile.file;
  }

  return new Blob([importedFile.file], { type: mimeType });
}

function resolveImportedAssetMimeType(
  importedFile: ScenarioPackImportFileEntry
): string {
  if (importedFile.file.type.startsWith("image/")) {
    return importedFile.file.type;
  }

  const mimeTypeByExtension: Record<string, string> = {
    ".apng": "image/apng",
    ".avif": "image/avif",
    ".gif": "image/gif",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
  };
  const lowerPath = importedFile.relativePath.toLowerCase();
  const matchedExtension = Object.keys(mimeTypeByExtension).find((extension) =>
    lowerPath.endsWith(extension)
  );
  return matchedExtension == null
    ? importedFile.file.type || "application/octet-stream"
    : (mimeTypeByExtension[matchedExtension] as string);
}

function normalizeImageDataUrlMime(value: string): string {
  const match = /^data:([^;,]+);base64,([A-Za-z0-9+/=]+)/.exec(value);
  if (match == null || match[1] !== "application/octet-stream") {
    return value;
  }

  const detectedMimeType = detectBase64ImageMimeType(match[2] ?? "");
  return detectedMimeType == null
    ? value
    : value.replace("data:application/octet-stream;base64,", `data:${detectedMimeType};base64,`);
}

function detectBase64ImageMimeType(base64Value: string): string | null {
  if (base64Value.startsWith("iVBORw0KGgo")) {
    return "image/png";
  }
  if (base64Value.startsWith("/9j/")) {
    return "image/jpeg";
  }
  if (base64Value.startsWith("R0lGOD")) {
    return "image/gif";
  }
  if (base64Value.startsWith("UklGR")) {
    return "image/webp";
  }
  return null;
}

function resolveScenarioPackImportedFileEntry(
  indexedFiles: Record<string, ScenarioPackImportFileEntry>,
  manifestDirectoryPath: string,
  relativePath: string
): ScenarioPackImportFileEntry {
  const resolvedPath = resolveScenarioPackImportPath(
    manifestDirectoryPath,
    relativePath
  );
  const importedFile = indexedFiles[resolvedPath];

  if (importedFile == null) {
    throw new Error(`Imported scenario pack is missing "${relativePath}".`);
  }

  return importedFile;
}

function getScenarioPackImportDirectoryPath(filePath: string): string {
  const lastSeparatorIndex = filePath.lastIndexOf("/");
  return lastSeparatorIndex < 0 ? "" : filePath.slice(0, lastSeparatorIndex);
}

function resolveScenarioPackImportPath(
  baseDirectoryPath: string,
  relativePath: string
): string {
  const combinedPath =
    baseDirectoryPath.length === 0
      ? relativePath
      : `${baseDirectoryPath}/${relativePath}`;

  return normalizeScenarioPackImportPath(combinedPath);
}

function normalizeScenarioPackImportPath(pathValue: string): string {
  const normalizedSegments: string[] = [];

  for (const segment of pathValue.replaceAll("\\", "/").split("/")) {
    if (segment.length === 0 || segment === ".") {
      continue;
    }
    if (segment === "..") {
      normalizedSegments.pop();
      continue;
    }
    normalizedSegments.push(segment);
  }

  return normalizedSegments.join("/");
}

function isScenarioPackManifest(value: unknown): value is ScenarioPackManifest {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  if (candidate.files == null || typeof candidate.files !== "object" || Array.isArray(candidate.files)) {
    return false;
  }

  if (typeof candidate.id !== "string" || typeof candidate.title !== "string") {
    return false;
  }

  const files = candidate.files as Record<string, unknown>;
  return (
    typeof files.scenarioProfile === "string" &&
    typeof files.characters === "string" &&
    typeof files.events === "string" &&
    typeof files.scenes === "string"
  );
}

function assertObject(
  value: unknown,
  label: string
): asserts value is Record<string, unknown> {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }
}

function assertArray(value: unknown, label: string): asserts value is unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`${label} must be an array.`);
  }
}

function assertString(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }
}

function assertOptionalString(
  value: unknown,
  label: string
): asserts value is string | undefined {
  if (value != null && (typeof value !== "string" || value.length === 0)) {
    throw new Error(`${label} must be a non-empty string when present.`);
  }
}

function assertOptionalEnum<T extends string>(
  value: unknown,
  label: string,
  allowedValues: readonly T[]
): asserts value is T | undefined {
  if (value != null && !allowedValues.includes(value as T)) {
    throw new Error(`${label} must be one of: ${allowedValues.join(", ")}.`);
  }
}
