import { parseScenarioPack } from "../scenario/scenario-pack-loader";
import { parseScriptEditorProject } from "./editor-project-loader";
import {
  SCRIPT_EDITOR_PROJECT_KIND,
  type ScriptEditorProjectDefinition,
  type ScriptEditorStoryPackRecord,
  type ScriptEditorTextEntryRecord,
} from "../../domain/script-editor-project";

export type ScriptEditorCompatibilityImportDiagnostic = {
  code:
    | "unsupported-family"
    | "missing-field"
    | "invalid-field"
    | "runtime-pack-contract";
  fieldPath: string;
  message: string;
};

export type ScriptEditorCompatibilityImportResidue = {
  unresolvedFamilies: Record<string, unknown>;
  diagnostics: ScriptEditorCompatibilityImportDiagnostic[];
};

type RuntimePackImportFileEntry = {
  file: File;
  relativePath: string;
};

type RuntimePackManifestFiles = {
  scenarioProfile: string;
  characters: string;
  events: string;
  scenes: string;
  tasks?: string;
  cities?: string;
  houses?: string;
  maps?: string;
  cityEntries?: string;
  textEntries?: string;
  activities?: string;
  cards?: string;
  valuables?: string;
  cityNpcPools?: string;
  houseAccessRefusalRules?: string;
  houseModuleDefaults?: string;
  historicalCharacters?: string;
  historicalCityRosters?: string;
  cityPortraits?: string;
  historicalCharacterIdByCharacterId?: string;
  uiScreenSchemas?: string;
  uiLayouts?: string;
  uiSkins?: string;
  uiAssetCatalogs?: string;
};

type RuntimePackManifest = {
  schemaVersion: 1;
  kind?: "scenario-pack";
  id: string;
  title: string;
  description?: string;
  basePackId?: string;
  author?: string;
  version?: string;
  tags?: string[];
  files: RuntimePackManifestFiles;
};

const RUNTIME_PACK_MANIFEST_FILE = "pack.json";

const UNSUPPORTED_RUNTIME_FAMILY_MESSAGES = [
  {
    familyKey: "scenes",
    fieldPath: "pack.scenes",
    hasValue: (pack: Record<string, unknown>) =>
      Array.isArray(pack.scenes) && pack.scenes.length > 0,
    message:
      "scenes cannot be imported in this bounded slice; dialogue/story-node compatibility remains a later queue.",
  },
  {
    familyKey: "maps",
    fieldPath: "pack.maps",
    hasValue: (pack: Record<string, unknown>) =>
      Array.isArray(pack.maps) && pack.maps.length > 0,
    message:
      "maps cannot be imported in this bounded slice; runtime-only map asset payloads must stay on a later compatibility queue.",
  },
  {
    familyKey: "cityEntries",
    fieldPath: "pack.cityEntries",
    hasValue: (pack: Record<string, unknown>) =>
      Array.isArray(pack.cityEntries) && pack.cityEntries.length > 0,
    message:
      "cityEntries cannot be imported in this bounded slice; city-entry compatibility remains a later queue.",
  },
  {
    familyKey: "activities",
    fieldPath: "pack.activities",
    hasValue: (pack: Record<string, unknown>) =>
      Array.isArray(pack.activities) && pack.activities.length > 0,
    message:
      "activities cannot be imported in this bounded slice; minigame/activity compatibility remains a later queue.",
  },
  {
    familyKey: "cards",
    fieldPath: "pack.cards",
    hasValue: (pack: Record<string, unknown>) =>
      Array.isArray(pack.cards) && pack.cards.length > 0,
    message:
      "cards cannot be imported in this bounded slice; card compatibility remains a later queue.",
  },
  {
    familyKey: "valuables",
    fieldPath: "pack.valuables",
    hasValue: (pack: Record<string, unknown>) =>
      Array.isArray(pack.valuables) && pack.valuables.length > 0,
    message:
      "valuables cannot be imported in this bounded slice; valuable-item compatibility remains a later queue.",
  },
  {
    familyKey: "cityNpcPools",
    fieldPath: "pack.cityNpcPools",
    hasValue: (pack: Record<string, unknown>) =>
      Array.isArray(pack.cityNpcPools) && pack.cityNpcPools.length > 0,
    message:
      "cityNpcPools cannot be imported in this bounded slice; NPC-pool compatibility remains a later queue.",
  },
  {
    familyKey: "houseAccessRefusalRules",
    fieldPath: "pack.houseAccessRefusalRules",
    hasValue: (pack: Record<string, unknown>) =>
      Array.isArray(pack.houseAccessRefusalRules) &&
      pack.houseAccessRefusalRules.length > 0,
    message:
      "houseAccessRefusalRules cannot be imported in this bounded slice; house access-rule compatibility remains a later queue.",
  },
  {
    familyKey: "houseModuleDefaults",
    fieldPath: "pack.houseModuleDefaults",
    hasValue: (pack: Record<string, unknown>) =>
      hasObjectEntries(pack.houseModuleDefaults),
    message:
      "houseModuleDefaults cannot be imported in this bounded slice; house-module default compatibility remains a later queue.",
  },
  {
    familyKey: "historicalCharacters",
    fieldPath: "pack.historicalCharacters",
    hasValue: (pack: Record<string, unknown>) =>
      Array.isArray(pack.historicalCharacters) &&
      pack.historicalCharacters.length > 0,
    message:
      "historicalCharacters cannot be imported in this bounded slice; historical roster compatibility remains a later queue.",
  },
  {
    familyKey: "historicalCityRosters",
    fieldPath: "pack.historicalCityRosters",
    hasValue: (pack: Record<string, unknown>) =>
      Array.isArray(pack.historicalCityRosters) &&
      pack.historicalCityRosters.length > 0,
    message:
      "historicalCityRosters cannot be imported in this bounded slice; historical roster compatibility remains a later queue.",
  },
  {
    familyKey: "cityPortraits",
    fieldPath: "pack.cityPortraits",
    hasValue: (pack: Record<string, unknown>) => hasObjectEntries(pack.cityPortraits),
    message:
      "cityPortraits cannot be imported in this bounded slice; portrait compatibility remains a later queue.",
  },
  {
    familyKey: "historicalCharacterIdByCharacterId",
    fieldPath: "pack.historicalCharacterIdByCharacterId",
    hasValue: (pack: Record<string, unknown>) =>
      hasObjectEntries(pack.historicalCharacterIdByCharacterId),
    message:
      "historicalCharacterIdByCharacterId cannot be imported in this bounded slice; historical mapping compatibility remains a later queue.",
  },
  {
    familyKey: "uiScreenSchemas",
    fieldPath: "pack.uiScreenSchemas",
    hasValue: (pack: Record<string, unknown>) =>
      Array.isArray(pack.uiScreenSchemas) && pack.uiScreenSchemas.length > 0,
    message:
      "uiScreenSchemas cannot be imported in this bounded slice; UI reserve compatibility remains a later queue.",
  },
  {
    familyKey: "uiLayouts",
    fieldPath: "pack.uiLayouts",
    hasValue: (pack: Record<string, unknown>) =>
      Array.isArray(pack.uiLayouts) && pack.uiLayouts.length > 0,
    message:
      "uiLayouts cannot be imported in this bounded slice; UI reserve compatibility remains a later queue.",
  },
  {
    familyKey: "uiSkins",
    fieldPath: "pack.uiSkins",
    hasValue: (pack: Record<string, unknown>) =>
      Array.isArray(pack.uiSkins) && pack.uiSkins.length > 0,
    message:
      "uiSkins cannot be imported in this bounded slice; UI reserve compatibility remains a later queue.",
  },
  {
    familyKey: "uiAssetCatalogs",
    fieldPath: "pack.uiAssetCatalogs",
    hasValue: (pack: Record<string, unknown>) =>
      Array.isArray(pack.uiAssetCatalogs) && pack.uiAssetCatalogs.length > 0,
    message:
      "uiAssetCatalogs cannot be imported in this bounded slice; UI reserve compatibility remains a later queue.",
  },
] as const;

export async function loadScriptEditorProjectFromScenarioPackFiles(
  files: readonly File[]
): Promise<ScriptEditorProjectDefinition> {
  if (files.length === 0) {
    throw new Error("Scenario pack import must include at least one file.");
  }

  const indexedFiles = indexScenarioPackImportFiles(files);
  const manifestFileEntry = selectScenarioPackManifestFileEntry(indexedFiles);
  if (manifestFileEntry == null) {
    throw new Error(
      `Imported scenario pack is missing ${RUNTIME_PACK_MANIFEST_FILE}.`
    );
  }

  const rawPack = JSON.parse(await manifestFileEntry.file.text());
  if (!isScenarioPackManifest(rawPack)) {
    throw new Error(
      `Imported scenario pack ${RUNTIME_PACK_MANIFEST_FILE} must be a manifest-driven scenario pack.`
    );
  }

  return importScenarioPackToScriptEditorProject(
    await hydrateScenarioPackManifestFromFiles(
      rawPack,
      manifestFileEntry.relativePath,
      indexedFiles
    )
  );
}

export function validateScenarioPackForScriptEditorImport(
  value: unknown
): ScriptEditorCompatibilityImportDiagnostic[] {
  const pack = parseScenarioPack(value);
  const rawPack = pack as Record<string, unknown>;

  return UNSUPPORTED_RUNTIME_FAMILY_MESSAGES.flatMap((entry) =>
    entry.hasValue(rawPack)
      ? [
          {
            code: "unsupported-family" as const,
            fieldPath: entry.fieldPath,
            message: entry.message,
          },
        ]
      : []
  );
}

export function importScenarioPackToScriptEditorProject(
  value: unknown
): ScriptEditorProjectDefinition {
  const pack = parseScenarioPack(value);
  const diagnostics = validateScenarioPackForScriptEditorImport(pack);
  const rawPack = pack as Record<string, unknown>;
  const project = {
    schemaVersion: 1,
    kind: SCRIPT_EDITOR_PROJECT_KIND,
    id: pack.id,
    title: pack.title,
    ...(pack.description == null ? {} : { description: pack.description }),
    storyPack: createStoryPackRecord(
      pack,
      rawPack,
      collectCompatibilityImportResidue(rawPack, diagnostics)
    ),
    people: pack.characters ?? [],
    cities: pack.cities ?? [],
    buildings: pack.houses ?? [],
    events: pack.events ?? [],
    quests: pack.tasks ?? [],
    dialogues: [],
    minigames: [],
    storyNodes: [],
    textEntries: mapTextEntries(pack.textEntries),
    conditionGroups: [],
    effectBundles: [],
  } satisfies ScriptEditorProjectDefinition;

  try {
    return parseScriptEditorProject(project);
  } catch (error) {
    throw new Error(
      formatDiagnostics([
        {
          code: "runtime-pack-contract",
          fieldPath: "pack",
          message:
            error instanceof Error
              ? error.message
              : "Scenario pack import failed script-editor project contract validation.",
        },
      ])
    );
  }
}

function createStoryPackRecord(
  pack: ReturnType<typeof parseScenarioPack>,
  rawPack: Record<string, unknown>,
  compatibilityImportResidue: ScriptEditorCompatibilityImportResidue | null
): ScriptEditorStoryPackRecord {
  return {
    id: pack.id,
    title: pack.title,
    ...(pack.description == null ? {} : { description: pack.description }),
    scenarioProfile: pack.scenarioProfile,
    ...(typeof rawPack.basePackId === "string"
      ? { basePackId: rawPack.basePackId }
      : {}),
    ...(typeof rawPack.author === "string" ? { author: rawPack.author } : {}),
    ...(typeof rawPack.version === "string" ? { version: rawPack.version } : {}),
    ...(Array.isArray(rawPack.tags) &&
    rawPack.tags.every((tag) => typeof tag === "string")
      ? { tags: [...rawPack.tags] as string[] }
      : {}),
    ...(compatibilityImportResidue == null
      ? {}
      : { compatibilityImport: compatibilityImportResidue }),
  };
}

function mapTextEntries(
  textEntries: Record<string, string> | undefined
): ScriptEditorTextEntryRecord[] {
  return Object.entries(textEntries ?? {}).map(([id, text]) => ({
    id,
    text,
  }));
}

async function hydrateScenarioPackManifestFromFiles(
  manifest: RuntimePackManifest,
  manifestFilePath: string,
  indexedFiles: Record<string, RuntimePackImportFileEntry>
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

  return {
    schemaVersion: manifest.schemaVersion,
    id: manifest.id,
    title: manifest.title,
    ...(manifest.description == null ? {} : { description: manifest.description }),
    ...(manifest.basePackId == null ? {} : { basePackId: manifest.basePackId }),
    ...(manifest.author == null ? {} : { author: manifest.author }),
    ...(manifest.version == null ? {} : { version: manifest.version }),
    ...(manifest.tags == null ? {} : { tags: [...manifest.tags] }),
    ...Object.fromEntries(resolvedEntries),
  };
}

function indexScenarioPackImportFiles(
  files: readonly File[]
): Record<string, RuntimePackImportFileEntry> {
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
  indexedFiles: Record<string, RuntimePackImportFileEntry>
): RuntimePackImportFileEntry | null {
  const manifestEntries = Object.values(indexedFiles).filter((entry) =>
    entry.relativePath.endsWith(`/${RUNTIME_PACK_MANIFEST_FILE}`) ||
    entry.relativePath === RUNTIME_PACK_MANIFEST_FILE
  );

  if (manifestEntries.length === 0) {
    return null;
  }

  if (manifestEntries.length > 1) {
    throw new Error(
      `Imported scenario pack contains multiple ${RUNTIME_PACK_MANIFEST_FILE} files.`
    );
  }

  return manifestEntries[0] ?? null;
}

function resolveScenarioPackImportedFileEntry(
  indexedFiles: Record<string, RuntimePackImportFileEntry>,
  manifestDirectoryPath: string,
  relativePath: string
): RuntimePackImportFileEntry {
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

function isScenarioPackManifest(value: unknown): value is RuntimePackManifest {
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
    typeof files.scenes === "string"
  );
}

function hasObjectEntries(value: unknown): boolean {
  return value != null && typeof value === "object" && !Array.isArray(value)
    ? Object.keys(value).length > 0
    : false;
}

function collectCompatibilityImportResidue(
  rawPack: Record<string, unknown>,
  diagnostics: ScriptEditorCompatibilityImportDiagnostic[]
): ScriptEditorCompatibilityImportResidue | null {
  if (diagnostics.length === 0) {
    return null;
  }

  const unresolvedFamilies = Object.fromEntries(
    UNSUPPORTED_RUNTIME_FAMILY_MESSAGES.flatMap((entry) => {
      const value = rawPack[entry.familyKey];
      return entry.hasValue(rawPack) ? [[entry.familyKey, cloneJsonCompatibleValue(value)]] : [];
    })
  );

  return {
    unresolvedFamilies,
    diagnostics: diagnostics.map((diagnostic) => ({ ...diagnostic })),
  };
}

function cloneJsonCompatibleValue(value: unknown): unknown {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function formatDiagnostics(
  diagnostics: ScriptEditorCompatibilityImportDiagnostic[]
): string {
  return [
    "Script editor compatibility import validation failed.",
    ...diagnostics.map(
      (diagnostic) => `- ${diagnostic.fieldPath}: ${diagnostic.message}`
    ),
  ].join("\n");
}
