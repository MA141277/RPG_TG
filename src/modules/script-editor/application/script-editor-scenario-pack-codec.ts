import type { MapDefinition } from "./script-editor-map-contract";
import type { ScenarioPackDefinition } from "../domain/script-editor-scenario-pack-contract";
import {
  resolveScriptEditorPublicationCatalog,
  type ScriptEditorPublicationCatalog,
} from "../host/script-editor-publication-catalog";

type ScenarioPackManifestFiles = {
  scenarioProfile: string;
  characters: string;
  events: string;
  scenes?: string;
  dialogues?: string;
  meetings?: string;
  meetingBindings?: string;
  meetingPanels?: string;
  meetingChoiceSets?: string;
  meetingActionSets?: string;
  playables?: string;
  playableIntegrations?: string;
  playableShells?: string;
  eventBindings?: string;
  menuResources?: string;
  menuInstances?: string;
  settlements?: string;
  progressTracks?: string;
  progressTrackBindings?: string;
  tasks?: string;
  cities?: string;
  houses?: string;
  buildingArrangements?: string;
  maps?: string;
  cityEntries?: string;
  textEntries?: string;
  activities?: string;
  cards?: string;
  valuables?: string;
  items?: string;
  cityNpcPools?: string;
  locationAccess?: string;
  houseModuleDefaults?: string;
  houseAccessRefusalRules?: string;
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

export async function loadScenarioPackFromUrl(
  url: string,
  options: {
    publicationCatalog?: ScriptEditorPublicationCatalog | undefined;
  } = {}
): Promise<ScenarioPackDefinition> {
  const publicationCatalog = resolveScriptEditorPublicationCatalog(
    options.publicationCatalog
  );
  const resolvedManifestUrl = resolveScenarioPackManifestUrl(url);
  const registeredPack =
    publicationCatalog.loadScenarioPackFromUrl(resolvedManifestUrl);
  if (registeredPack != null) {
    return parseScenarioPack(registeredPack);
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load scenario pack: ${response.status}`);
  }

  const rawPack = await response.json();
  if (isScenarioPackManifest(rawPack)) {
    assertSupportedScenarioPackManifestFiles(rawPack.files);
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
    assertSupportedScenarioPackManifestFiles(rawPack.files);
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
  assertString(
    value.scenarioProfile.playerCharacterId,
    "scenario playerCharacterId"
  );
  assertString(value.scenarioProfile.chapterId, "scenario chapterId");
  assertObject(value.scenarioProfile.initialLocation, "scenario initialLocation");
  assertString(
    value.scenarioProfile.initialLocation.mapId,
    "scenario initialLocation.mapId"
  );
  assertString(
    value.scenarioProfile.initialLocation.cityId,
    "scenario initialLocation.cityId"
  );
  if (
    value.scenarioProfile.initialLocation.houseId !== null &&
    typeof value.scenarioProfile.initialLocation.houseId !== "string"
  ) {
    throw new Error("scenario initialLocation.houseId must be string or null.");
  }
  assertString(
    value.scenarioProfile.initialLocation.view,
    "scenario initialLocation.view"
  );
  assertArray(value.characters, "scenario characters");
  if (value.cities != null) {
    assertArray(value.cities, "scenario cities");
  }
  if (value.houses != null) {
    assertArray(value.houses, "scenario houses");
  }
  if (value.buildingArrangements != null) {
    assertArray(value.buildingArrangements, "scenario building arrangements");
  }
  if (value.maps != null) {
    assertArray(value.maps, "scenario maps");
  }
  if (value.cityEntries != null) {
    assertArray(value.cityEntries, "scenario city entries");
  }
  assertArray(value.events, "scenario events");
  if (value.scenes == null && value.dialogues == null) {
    throw new Error("scenario pack must include scenes or dialogues.");
  }
  if (value.scenes != null) {
    assertArray(value.scenes, "scenario scenes");
  }
  if (value.dialogues != null) {
    assertArray(value.dialogues, "scenario dialogues");
  }
  if (value.meetings != null) {
    assertArray(value.meetings, "scenario meetings");
  }
  if (value.meetingBindings != null) {
    assertArray(value.meetingBindings, "scenario meeting bindings");
  }
  if (value.meetingPanels != null) {
    assertArray(value.meetingPanels, "scenario meeting panels");
  }
  if (value.meetingChoiceSets != null) {
    assertArray(value.meetingChoiceSets, "scenario meeting choice sets");
  }
  if (value.meetingActionSets != null) {
    assertArray(value.meetingActionSets, "scenario meeting action sets");
  }
  if (value.eventBindings != null) {
    assertArray(value.eventBindings, "scenario event bindings");
  }
  if (value.menuResources != null) {
    assertArray(value.menuResources, "scenario menu resources");
  }
  if (value.menuInstances != null) {
    assertArray(value.menuInstances, "scenario menu instances");
  }
  if (value.playables != null) {
    assertArray(value.playables, "scenario playables");
  }
  if (value.playableIntegrations != null) {
    assertArray(value.playableIntegrations, "scenario playable integrations");
  }
  if (value.flowDefinitions != null) {
    throw new Error(
      'scenario flowDefinitions is retired; use playableShells instead.'
    );
  }
  if (value.playableShells != null) {
    assertArray(value.playableShells, "scenario playable shells");
  }
  if (value.flowPlayables != null) {
    throw new Error(
      'scenario flowPlayables is retired; use playableShells instead.'
    );
  }
  if (value.settlements != null) {
    assertArray(value.settlements, "scenario settlements");
  }
  if (value.progressTracks != null) {
    assertArray(value.progressTracks, "scenario progress tracks");
  }
  if (value.progressTrackBindings != null) {
    assertArray(value.progressTrackBindings, "scenario progress track bindings");
  }
  if (value.tasks != null) {
    assertArray(value.tasks, "scenario tasks");
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
  if (value.items != null) {
    assertArray(value.items, "scenario items");
  }
  if (value.cityNpcPools != null) {
    assertArray(value.cityNpcPools, "scenario city npc pools");
  }
  if (value.locationAccess != null) {
    assertArray(value.locationAccess, "scenario location access");
  }
  if (value.houseModuleDefaults != null) {
    assertObject(value.houseModuleDefaults, "scenario house module defaults");
  }
  if (value.houseAccessRefusalRules != null) {
    assertArray(value.houseAccessRefusalRules, "scenario house access refusal rules");
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

function assertSupportedScenarioPackManifestFiles(
  files: Record<string, unknown>
): void {
  if (Object.hasOwn(files, "flowPlayables")) {
    throw new Error(
      'scenario pack files.flowPlayables is retired; use files.playableShells instead.'
    );
  }
}

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
  const resolvedMaps = resolveScenarioPackMapAssetUrls(
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
  const resolvedMaps = await resolveImportedScenarioPackMapAssetUrls(
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

function resolveScenarioPackMapAssetUrls(
  maps: ScenarioPackDefinition["maps"],
  manifestUrl: string
): MapDefinition[] | undefined {
  return maps?.map((mapDefinition) => {
    const primaryImageUrl = resolveScenarioPackRelativeUrl(
      manifestUrl,
      mapDefinition.primaryImageUrl
    );
    const regionOverlayImageUrl = resolveScenarioPackRelativeUrl(
      manifestUrl,
      mapDefinition.regionOverlayImageUrl
    );
    const campaignHexGridUrl = resolveScenarioPackRelativeUrl(
      manifestUrl,
      mapDefinition.campaignHexGridUrl
    );
    const campaignVegetationRulesUrl = resolveScenarioPackRelativeUrl(
      manifestUrl,
      mapDefinition.campaignVegetationRulesUrl
    );
    const layers = mapDefinition.layers?.map((layerDefinition) => ({
      ...layerDefinition,
      imageUrl:
        resolveScenarioPackRelativeUrl(manifestUrl, layerDefinition.imageUrl) ?? "",
    }));

    return {
      ...mapDefinition,
      ...(primaryImageUrl == null ? {} : { primaryImageUrl }),
      ...(regionOverlayImageUrl == null ? {} : { regionOverlayImageUrl }),
      ...(campaignHexGridUrl == null ? {} : { campaignHexGridUrl }),
      ...(campaignVegetationRulesUrl == null ? {} : { campaignVegetationRulesUrl }),
      ...(layers == null ? {} : { layers }),
    };
  });
}

function resolveScenarioPackRelativeUrl(
  manifestUrl: string,
  value: string | undefined
): string | undefined {
  if (value == null) {
    return undefined;
  }
  if (/^(https?:|file:|\/)/.test(value)) {
    return value;
  }
  return new URL(value, manifestUrl).href;
}

async function resolveImportedScenarioPackMapAssetUrls(
  maps: ScenarioPackDefinition["maps"],
  manifestDirectoryPath: string,
  indexedFiles: Record<string, ScenarioPackImportFileEntry>
) {
  const assetUrlCache: Record<string, string> = {};

  return maps == null
    ? undefined
    : Promise.all(
        maps.map(async (mapDefinition) => ({
          ...mapDefinition,
          ...(mapDefinition.primaryImageUrl == null
            ? {}
            : {
                primaryImageUrl: resolveImportedScenarioPackAssetUrl(
                  mapDefinition.primaryImageUrl,
                  manifestDirectoryPath,
                  indexedFiles,
                  assetUrlCache
                ),
              }),
          ...(mapDefinition.regionOverlayImageUrl == null
            ? {}
            : {
                regionOverlayImageUrl: resolveImportedScenarioPackAssetUrl(
                  mapDefinition.regionOverlayImageUrl,
                  manifestDirectoryPath,
                  indexedFiles,
                  assetUrlCache
                ),
              }),
          ...(mapDefinition.campaignHexGridUrl == null
            ? {}
            : {
                campaignHexGridUrl: resolveImportedScenarioPackAssetUrl(
                  mapDefinition.campaignHexGridUrl,
                  manifestDirectoryPath,
                  indexedFiles,
                  assetUrlCache
                ),
              }),
          ...(mapDefinition.campaignVegetationRulesUrl == null
            ? {}
            : {
                campaignVegetationRulesUrl:
                  await resolveImportedScenarioPackVegetationRulesUrl(
                    mapDefinition.campaignVegetationRulesUrl,
                    manifestDirectoryPath,
                    indexedFiles,
                    assetUrlCache
                  ),
              }),
          ...(mapDefinition.layers == null
            ? {}
            : {
                layers: mapDefinition.layers.map((layerDefinition) => ({
                  ...layerDefinition,
                  imageUrl: resolveImportedScenarioPackAssetUrl(
                    layerDefinition.imageUrl,
                    manifestDirectoryPath,
                    indexedFiles,
                    assetUrlCache
                  ),
                })),
              }),
        }))
      );
}

async function resolveImportedScenarioPackVegetationRulesUrl(
  value: string,
  manifestDirectoryPath: string,
  indexedFiles: Record<string, ScenarioPackImportFileEntry>,
  assetUrlCache: Record<string, string>
): Promise<string> {
  if (isInlineOrAbsoluteScenarioPackAssetUrl(value)) {
    return value;
  }

  const importedFile = resolveScenarioPackImportedFileEntry(
    indexedFiles,
    manifestDirectoryPath,
    value
  );
  const cacheKey = `${importedFile.relativePath}#resolved-vegetation`;
  const cachedAssetUrl = assetUrlCache[cacheKey];
  if (cachedAssetUrl != null) {
    return cachedAssetUrl;
  }

  const rules = JSON.parse(await importedFile.file.text()) as {
    format?: string;
    variants?: Array<{ meshUrl?: string } & Record<string, unknown>>;
  } & Record<string, unknown>;
  if (
    rules.format !== "campaign-vegetation-rules-v1" ||
    !Array.isArray(rules.variants)
  ) {
    return resolveImportedScenarioPackAssetUrl(
      value,
      manifestDirectoryPath,
      indexedFiles,
      assetUrlCache
    );
  }

  const rulesDirectoryPath = getScenarioPackImportDirectoryPath(
    importedFile.relativePath
  );
  const resolvedRules = {
    ...rules,
    variants: rules.variants.map((variant) => ({
      ...variant,
      ...(typeof variant.meshUrl !== "string"
        ? {}
        : {
            meshUrl: resolveImportedScenarioPackAssetUrl(
              variant.meshUrl,
              rulesDirectoryPath,
              indexedFiles,
              assetUrlCache
            ),
          }),
    })),
  };
  const resolvedAssetUrl = URL.createObjectURL(
    new Blob([JSON.stringify(resolvedRules)], { type: "application/json" })
  );
  assetUrlCache[cacheKey] = resolvedAssetUrl;
  return resolvedAssetUrl;
}

function resolveImportedScenarioPackAssetUrl(
  value: string,
  manifestDirectoryPath: string,
  indexedFiles: Record<string, ScenarioPackImportFileEntry>,
  assetUrlCache: Record<string, string>
): string {
  if (isInlineOrAbsoluteScenarioPackAssetUrl(value)) {
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

  const nextAssetUrl = URL.createObjectURL(importedFile.file);
  assetUrlCache[importedFile.relativePath] = nextAssetUrl;
  return nextAssetUrl;
}

function isInlineOrAbsoluteScenarioPackAssetUrl(value: string): boolean {
  return /^(data:|https?:|file:|blob:|\/)/.test(value);
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
  if (
    candidate.files == null ||
    typeof candidate.files !== "object" ||
    Array.isArray(candidate.files)
  ) {
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
    (typeof files.scenes === "string" || typeof files.dialogues === "string")
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
