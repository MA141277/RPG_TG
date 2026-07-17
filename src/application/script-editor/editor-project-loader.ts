import {
  SCRIPT_EDITOR_PROJECT_FILE_KEYS,
  SCRIPT_EDITOR_PROJECT_KIND,
  SCRIPT_EDITOR_PROJECT_MANIFEST_FILE,
  SCRIPT_EDITOR_PROJECT_SCHEMA_VERSION,
  type ScriptEditorEntityRecord,
  type ScriptEditorProjectDefinition,
  type ScriptEditorProjectFileKey,
  type ScriptEditorProjectManifest,
  type ScriptEditorStoryPackRecord,
} from "../../domain/script-editor-project";
import { normalizeScriptEditorProjectCompletionState } from "./project-completion-state";

const OPTIONAL_SCRIPT_EDITOR_PROJECT_FILE_KEYS = new Set<ScriptEditorProjectFileKey>([
  "eventBindings",
]);

type ScriptEditorProjectImportFileEntry = {
  file: File;
  relativePath: string;
};

export async function loadScriptEditorProjectFromFiles(
  files: readonly File[]
): Promise<ScriptEditorProjectDefinition> {
  if (files.length === 0) {
    throw new Error("Script editor project import must include at least one file.");
  }

  const indexedFiles = indexImportedFiles(files);
  const manifestFileEntry = selectManifestFileEntry(indexedFiles);
  const manifest = parseScriptEditorProjectManifest(
    JSON.parse(await manifestFileEntry.file.text())
  );

  return parseScriptEditorProject(
    await hydrateManifestFromFiles(manifest, manifestFileEntry.relativePath, indexedFiles)
  );
}

export function parseScriptEditorProjectManifest(
  value: unknown
): ScriptEditorProjectManifest {
  assertObject(value, "script editor project manifest");
  if (value.schemaVersion !== SCRIPT_EDITOR_PROJECT_SCHEMA_VERSION) {
    throw new Error(
      `Script editor project schemaVersion must be ${SCRIPT_EDITOR_PROJECT_SCHEMA_VERSION}.`
    );
  }
  if (value.kind !== SCRIPT_EDITOR_PROJECT_KIND) {
    throw new Error(`Script editor project kind must be ${SCRIPT_EDITOR_PROJECT_KIND}.`);
  }
  assertString(value.id, "script editor project id");
  assertString(value.title, "script editor project title");
  assertObject(value.files, "script editor project files");

  for (const fileKey of SCRIPT_EDITOR_PROJECT_FILE_KEYS) {
    if (
      OPTIONAL_SCRIPT_EDITOR_PROJECT_FILE_KEYS.has(fileKey) &&
      value.files[fileKey] == null
    ) {
      continue;
    }
    assertString(
      value.files[fileKey],
      `script editor project files.${fileKey}`
    );
  }

  return {
    ...(value as ScriptEditorProjectManifest),
    completionState: normalizeScriptEditorProjectCompletionState(
      value.completionState
    ),
  };
}

export function parseScriptEditorProject(
  value: unknown
): ScriptEditorProjectDefinition {
  assertObject(value, "script editor project");
  if (value.schemaVersion !== SCRIPT_EDITOR_PROJECT_SCHEMA_VERSION) {
    throw new Error(
      `Script editor project schemaVersion must be ${SCRIPT_EDITOR_PROJECT_SCHEMA_VERSION}.`
    );
  }
  if (value.kind !== SCRIPT_EDITOR_PROJECT_KIND) {
    throw new Error(`Script editor project kind must be ${SCRIPT_EDITOR_PROJECT_KIND}.`);
  }
  assertString(value.id, "script editor project id");
  assertString(value.title, "script editor project title");
  assertStoryPackRecord(value.storyPack);
  assertEntityRecordArray(value.maps, "script editor project maps");
  assertEntityRecordArray(value.people, "script editor project people");
  assertEntityRecordArray(value.cities, "script editor project cities");
  assertEntityRecordArray(value.buildings, "script editor project buildings");
  assertEntityRecordArray(value.cityEntries, "script editor project cityEntries");
  assertEntityRecordArray(value.events, "script editor project events");
  assertEntityRecordArray(
    value.eventBindings ?? [],
    "script editor project eventBindings"
  );
  assertEntityRecordArray(value.scenes, "script editor project scenes");
  assertEntityRecordArray(value.quests, "script editor project quests");
  assertEntityRecordArray(value.activities, "script editor project activities");
  assertEntityRecordArray(value.cards, "script editor project cards");
  assertEntityRecordArray(value.valuables, "script editor project valuables");
  assertObjectRecordArray(value.cityNpcPools, "script editor project cityNpcPools");
  assertEntityRecordArray(
    value.houseAccessRefusalRules,
    "script editor project houseAccessRefusalRules"
  );
  assertObject(value.houseModuleDefaults, "script editor project houseModuleDefaults");
  assertStringRecord(value.cityPortraits, "script editor project cityPortraits");
  assertEntityRecordArray(
    value.historicalCharacters,
    "script editor project historicalCharacters"
  );
  assertObjectRecordArray(
    value.historicalCityRosters,
    "script editor project historicalCityRosters"
  );
  assertStringRecord(
    value.historicalCharacterIdByCharacterId,
    "script editor project historicalCharacterIdByCharacterId"
  );
  assertEntityRecordArray(value.dialogues, "script editor project dialogues");
  assertEntityRecordArray(value.minigames, "script editor project minigames");
  assertEntityRecordArray(value.storyNodes, "script editor project storyNodes");
  assertEntityRecordArray(value.textEntries, "script editor project textEntries");
  assertEntityRecordArray(
    value.conditionGroups,
    "script editor project conditionGroups"
  );
  assertEntityRecordArray(
    value.effectBundles,
    "script editor project effectBundles"
  );

  return {
    ...(value as ScriptEditorProjectDefinition),
    completionState: normalizeScriptEditorProjectCompletionState(
      value.completionState
    ),
    eventBindings: (value.eventBindings ?? []) as ScriptEditorProjectDefinition["eventBindings"],
  };
}

function indexImportedFiles(
  files: readonly File[]
): Record<string, ScriptEditorProjectImportFileEntry> {
  return Object.fromEntries(
    files.map((file) => {
      const relativePath = normalizeImportPath(
        file.webkitRelativePath || file.name
      );
      return [relativePath, { file, relativePath }] as const;
    })
  );
}

function selectManifestFileEntry(
  indexedFiles: Record<string, ScriptEditorProjectImportFileEntry>
): ScriptEditorProjectImportFileEntry {
  const manifestEntries = Object.values(indexedFiles).filter(
    (entry) =>
      entry.relativePath.endsWith(`/${SCRIPT_EDITOR_PROJECT_MANIFEST_FILE}`) ||
      entry.relativePath === SCRIPT_EDITOR_PROJECT_MANIFEST_FILE
  );

  if (manifestEntries.length === 0) {
    throw new Error(
      `Imported script editor project is missing ${SCRIPT_EDITOR_PROJECT_MANIFEST_FILE}.`
    );
  }

  if (manifestEntries.length > 1) {
    throw new Error(
      `Imported script editor project contains multiple ${SCRIPT_EDITOR_PROJECT_MANIFEST_FILE} files.`
    );
  }

  const [manifestEntry] = manifestEntries;
  if (manifestEntry == null) {
    throw new Error(
      `Imported script editor project is missing ${SCRIPT_EDITOR_PROJECT_MANIFEST_FILE}.`
    );
  }

  return manifestEntry;
}

async function hydrateManifestFromFiles(
  manifest: ScriptEditorProjectManifest,
  manifestFilePath: string,
  indexedFiles: Record<string, ScriptEditorProjectImportFileEntry>
): Promise<unknown> {
  const manifestDirectoryPath = getImportDirectoryPath(manifestFilePath);
  const resolvedEntries = await Promise.all(
    SCRIPT_EDITOR_PROJECT_FILE_KEYS.map(async (fileKey) => {
      const manifestFilePath = manifest.files[fileKey];
      if (
        manifestFilePath == null &&
        OPTIONAL_SCRIPT_EDITOR_PROJECT_FILE_KEYS.has(fileKey)
      ) {
        return [fileKey, []] as const;
      }
      const importedFile = resolveImportedFileEntry(
        indexedFiles,
        manifestDirectoryPath,
        manifestFilePath
      );
      return [fileKey, JSON.parse(await importedFile.file.text())] as const;
    })
  );

  const hydratedFields = Object.fromEntries(resolvedEntries);
  return {
    schemaVersion: manifest.schemaVersion,
    kind: manifest.kind,
    id: manifest.id,
    title: manifest.title,
    ...(manifest.description == null ? {} : { description: manifest.description }),
    completionState: manifest.completionState,
    ...hydratedFields,
  };
}

function resolveImportedFileEntry(
  indexedFiles: Record<string, ScriptEditorProjectImportFileEntry>,
  manifestDirectoryPath: string,
  relativePath: string
): ScriptEditorProjectImportFileEntry {
  const resolvedPath = resolveImportPath(manifestDirectoryPath, relativePath);
  const importedFile = indexedFiles[resolvedPath];

  if (importedFile == null) {
    throw new Error(`Imported script editor project is missing "${relativePath}".`);
  }

  return importedFile;
}

function getImportDirectoryPath(filePath: string): string {
  const lastSeparatorIndex = filePath.lastIndexOf("/");
  return lastSeparatorIndex < 0 ? "" : filePath.slice(0, lastSeparatorIndex);
}

function resolveImportPath(baseDirectoryPath: string, relativePath: string): string {
  const combinedPath =
    baseDirectoryPath.length === 0
      ? relativePath
      : `${baseDirectoryPath}/${relativePath}`;

  return normalizeImportPath(combinedPath);
}

function normalizeImportPath(pathValue: string): string {
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

function assertEntityRecordArray(
  value: unknown,
  label: string
): asserts value is ScriptEditorEntityRecord[] {
  assertArray(value, label);
  value.forEach((entry, index) => {
    assertObject(entry, `${label}[${index}]`);
    assertString(entry.id, `${label}[${index}].id`);
  });
}

function assertObjectRecordArray(
  value: unknown,
  label: string
): asserts value is Record<string, unknown>[] {
  assertArray(value, label);
  value.forEach((entry, index) => {
    assertObject(entry, `${label}[${index}]`);
  });
}

function assertStoryPackRecord(
  value: unknown
): asserts value is ScriptEditorStoryPackRecord {
  assertObject(value, "script editor project storyPack");
  assertString(value.id, "script editor project storyPack.id");
  assertString(value.title, "script editor project storyPack.title");
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

function assertStringRecord(
  value: unknown,
  label: string
): asserts value is Record<string, string> {
  assertObject(value, label);
  for (const [key, entryValue] of Object.entries(value)) {
    if (typeof entryValue !== "string") {
      throw new Error(`${label}.${key} must be a string.`);
    }
  }
}

function assertString(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }
}
