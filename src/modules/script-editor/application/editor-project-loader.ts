import {
  SCRIPT_EDITOR_PROJECT_FILE_KEYS,
  SCRIPT_EDITOR_PROJECT_KIND,
  SCRIPT_EDITOR_PROJECT_MANIFEST_FILE,
  SCRIPT_EDITOR_PROJECT_SCHEMA_VERSION,
  type ScriptEditorBuildingArrangementRecord,
  type ScriptEditorBuildingContainerRecord,
  type ScriptEditorEntityRecord,
  type ScriptEditorPersonSemanticBinding,
  type ScriptEditorProjectDefinition,
  type ScriptEditorProjectFileKey,
  type ScriptEditorProjectManifest,
  type ScriptEditorStoryPackRecord,
} from "../domain/script-editor-project";
import { formalizeScriptEditorProjectMenus } from "./menu-authoring";
import { normalizeScriptEditorPersonRecord } from "./person-authoring";
import { normalizeScriptEditorProjectCompletionState } from "./project-completion-state";
import { normalizeScriptEditorDialogueRecord } from "./story-dialogue-event-authoring";

const OPTIONAL_SCRIPT_EDITOR_PROJECT_FILE_KEYS = new Set<ScriptEditorProjectFileKey>([
  "buildingArrangements",
  "eventBindings",
  "progressTracks",
  "progressTrackBindings",
  "menuResources",
  "menuInstances",
  "flows",
  "portraits",
  "portraitVariants",
  "settlements",
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
  assertBuildingArrangementRecordArray(
    value.buildingArrangements ?? [],
    "script editor project buildingArrangements"
  );
  assertEntityRecordArray(value.cityEntries, "script editor project cityEntries");
  assertEntityRecordArray(
    value.settlements ?? [],
    "script editor project settlements"
  );
  assertEntityRecordArray(value.events, "script editor project events");
  assertEntityRecordArray(
    value.eventBindings ?? [],
    "script editor project eventBindings"
  );
  assertEntityRecordArray(
    value.progressTracks ?? [],
    "script editor project progressTracks"
  );
  assertEntityRecordArray(
    value.progressTrackBindings ?? [],
    "script editor project progressTrackBindings"
  );
  assertEntityRecordArray(
    value.menuResources ?? [],
    "script editor project menuResources"
  );
  assertEntityRecordArray(
    value.menuInstances ?? [],
    "script editor project menuInstances"
  );
  assertEntityRecordArray(value.quests, "script editor project quests");
  assertEntityRecordArray(value.activities, "script editor project activities");
  assertEntityRecordArray(value.cards, "script editor project cards");
  assertEntityRecordArray(value.valuables, "script editor project valuables");
  assertObjectRecordArray(value.cityNpcPools, "script editor project cityNpcPools");
  assertObject(value.houseModuleDefaults, "script editor project houseModuleDefaults");
  assertEntityRecordArray(
    value.portraits ?? [],
    "script editor project portraits"
  );
  assertEntityRecordArray(
    value.portraitVariants ?? [],
    "script editor project portraitVariants"
  );
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
  assertFlowRecordArray(value.flows ?? [], "script editor project flows");
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

  const portraitVariants =
    (value.portraitVariants ?? []) as ScriptEditorProjectDefinition["portraitVariants"];

  return formalizeScriptEditorProjectMenus({
    ...(value as ScriptEditorProjectDefinition),
    completionState: normalizeScriptEditorProjectCompletionState(
      value.completionState
    ),
    people: (value.people as Record<string, unknown>[]).map((person) =>
      normalizeScriptEditorPersonRecord(person, { portraitVariants })
    ),
    dialogues: (value.dialogues as ScriptEditorProjectDefinition["dialogues"]).map(
      (dialogue) => normalizeScriptEditorDialogueRecord(dialogue)
    ),
    portraits: (value.portraits ?? []) as ScriptEditorProjectDefinition["portraits"],
    portraitVariants,
    buildingArrangements:
      (value.buildingArrangements ?? []) as ScriptEditorProjectDefinition["buildingArrangements"],
    settlements: (value.settlements ?? []) as ScriptEditorProjectDefinition["settlements"],
    eventBindings: (value.eventBindings ?? []) as ScriptEditorProjectDefinition["eventBindings"],
    progressTracks:
      (value.progressTracks ?? []) as NonNullable<
        ScriptEditorProjectDefinition["progressTracks"]
      >,
    progressTrackBindings:
      (value.progressTrackBindings ?? []) as NonNullable<
        ScriptEditorProjectDefinition["progressTrackBindings"]
      >,
    menuResources:
      (value.menuResources ?? []) as ScriptEditorProjectDefinition["menuResources"],
    menuInstances:
      (value.menuInstances ?? []) as ScriptEditorProjectDefinition["menuInstances"],
    flows: (value.flows ?? []) as ScriptEditorProjectDefinition["flows"],
  });
}

export const validateScriptEditorProjectDefinition = parseScriptEditorProject;

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

function assertBuildingArrangementRecordArray(
  value: unknown,
  label: string
): asserts value is ScriptEditorBuildingArrangementRecord[] {
  assertArray(value, label);
  value.forEach((entry, index) => {
    const entryLabel = `${label}[${index}]`;
    assertObject(entry, entryLabel);
    assertString(entry.id, `${entryLabel}.id`);
    assertString(entry.cityId, `${entryLabel}.cityId`);
    assertString(entry.buildingId, `${entryLabel}.buildingId`);
    assertOptionalString(entry.displayName, `${entryLabel}.displayName`);
    assertOptionalString(entry.description, `${entryLabel}.description`);
    assertOptionalString(entry.backgroundId, `${entryLabel}.backgroundId`);
    assertOptionalBuildingLayoutRecord(entry.layout, `${entryLabel}.layout`);
    assertStringArray(entry.mountedNpcIds, `${entryLabel}.mountedNpcIds`);
    assertNullableString(entry.primaryNpcId, `${entryLabel}.primaryNpcId`);
    assertBuildingContainerRecordArray(entry.containers, `${entryLabel}.containers`);
    assertOptionalObject(entry.visibleRule, `${entryLabel}.visibleRule`);
    assertOptionalObject(entry.enterRule, `${entryLabel}.enterRule`);
    assertOptionalObject(entry.exitRule, `${entryLabel}.exitRule`);
  });
}

function assertBuildingContainerRecordArray(
  value: unknown,
  label: string
): asserts value is ScriptEditorBuildingContainerRecord[] {
  assertArray(value, label);
  value.forEach((entry, index) => {
    const entryLabel = `${label}[${index}]`;
    assertObject(entry, entryLabel);
    assertString(entry.id, `${entryLabel}.id`);
    assertBuildingContainerType(entry.type, `${entryLabel}.type`);
    assertOptionalString(entry.title, `${entryLabel}.title`);
    if (entry.source != null) {
      assertObject(entry.source, `${entryLabel}.source`);
      assertString(entry.source.type, `${entryLabel}.source.type`);
      if (entry.source.type === "arrangement-mounted-npcs") {
        if (entry.source.includeNpcIds != null) {
          assertStringArray(
            entry.source.includeNpcIds,
            `${entryLabel}.source.includeNpcIds`
          );
        }
      } else if (entry.source.type === "static-records") {
        assertStringArray(entry.source.recordIds, `${entryLabel}.source.recordIds`);
      }
    }
    if (entry.items != null) {
      if (entry.type === "action-menu") {
        throw new Error(
          `${entryLabel}.items must move into menuResources/menuInstances.`
        );
      }
      assertBuildingContainerActionItemArray(entry.items, `${entryLabel}.items`);
    }
  });
}

function assertBuildingContainerActionItemArray(
  value: unknown,
  label: string
): void {
  assertArray(value, label);
  value.forEach((entry, index) => {
    const entryLabel = `${label}[${index}]`;
    assertObject(entry, entryLabel);
    assertString(entry.id, `${entryLabel}.id`);
    assertString(entry.label, `${entryLabel}.label`);
    assertString(entry.eventId, `${entryLabel}.eventId`);
    assertOptionalBoolean(entry.isVisible, `${entryLabel}.isVisible`);
    assertOptionalBoolean(entry.isEnabled, `${entryLabel}.isEnabled`);
    assertOptionalString(entry.disabledHint, `${entryLabel}.disabledHint`);
  });
}

function assertFlowRecordArray(value: unknown, label: string): void {
  assertArray(value, label);
  value.forEach((entry, index) => {
    const entryLabel = `${label}[${index}]`;
    assertObject(entry, entryLabel);
    assertString(entry.id, `${entryLabel}.id`);
    assertString(entry.title, `${entryLabel}.title`);
    assertString(entry.initialNodeId, `${entryLabel}.initialNodeId`);
    assertArray(entry.nodes, `${entryLabel}.nodes`);
    entry.nodes.forEach((node, nodeIndex) => {
      assertObject(node, `${entryLabel}.nodes[${nodeIndex}]`);
      assertString(node.id, `${entryLabel}.nodes[${nodeIndex}].id`);
      assertString(node.type, `${entryLabel}.nodes[${nodeIndex}].type`);
    });
    assertArray(entry.outcomeRoutes, `${entryLabel}.outcomeRoutes`);
  });
}

function assertStoryPackRecord(
  value: unknown
): asserts value is ScriptEditorStoryPackRecord {
  assertObject(value, "script editor project storyPack");
  assertString(value.id, "script editor project storyPack.id");
  assertString(value.title, "script editor project storyPack.title");
  if (value.audioSettings != null) {
    assertObject(value.audioSettings, "script editor project storyPack.audioSettings");
    if (
      value.audioSettings.muted != null &&
      typeof value.audioSettings.muted !== "boolean"
    ) {
      throw new Error(
        "script editor project storyPack.audioSettings.muted must be boolean when present."
      );
    }
  }
  if (value.personAttributeSemantics != null) {
    assertPersonSemanticBindingArray(
      value.personAttributeSemantics,
      "script editor project storyPack.personAttributeSemantics"
    );
  }
}

function assertPersonSemanticBindingArray(
  value: unknown,
  label: string
): asserts value is ScriptEditorPersonSemanticBinding[] {
  assertArray(value, label);
  value.forEach((entry, index) => {
    assertObject(entry, `${label}[${index}]`);
    assertString(entry.semanticKey, `${label}[${index}].semanticKey`);
    assertString(entry.keyName, `${label}[${index}].keyName`);
    if (
      entry.type !== "number" &&
      entry.type !== "string" &&
      entry.type !== "boolean" &&
      entry.type !== "enum"
    ) {
      throw new Error(
        `${label}[${index}].type must be one of: number, string, boolean, enum.`
      );
    }
    if (entry.options != null) {
      assertStringArray(entry.options, `${label}[${index}].options`);
    }
  });
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

function assertOptionalObject(value: unknown, label: string): void {
  if (value == null) {
    return;
  }
  assertObject(value, label);
}

function assertString(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }
}

function assertOptionalString(value: unknown, label: string): void {
  if (value == null) {
    return;
  }
  assertString(value, label);
}

function assertNullableString(value: unknown, label: string): void {
  if (value === null) {
    return;
  }
  assertString(value, label);
}

function assertOptionalBoolean(value: unknown, label: string): void {
  if (value == null) {
    return;
  }
  if (typeof value !== "boolean") {
    throw new Error(`${label} must be a boolean.`);
  }
}

function assertStringArray(value: unknown, label: string): asserts value is string[] {
  assertArray(value, label);
  value.forEach((entry, index) => {
    assertString(entry, `${label}[${index}]`);
  });
}

function assertOptionalBuildingLayoutRecord(value: unknown, label: string): void {
  if (value == null) {
    return;
  }
  assertObject(value, label);
  assertBuildingLayoutTemplateId(value.templateId, `${label}.templateId`);
  if (value.shellClassNames != null) {
    assertStringArray(value.shellClassNames, `${label}.shellClassNames`);
  }
  if (value.nodes != null) {
    assertBuildingLayoutNodeArray(value.nodes, `${label}.nodes`);
  }
}

function assertBuildingLayoutNodeArray(value: unknown, label: string): void {
  assertArray(value, label);
  value.forEach((entry, index) => {
    const entryLabel = `${label}[${index}]`;
    assertObject(entry, entryLabel);
    assertString(entry.id, `${entryLabel}.id`);
    assertBuildingLayoutNodeKind(entry.kind, `${entryLabel}.kind`);
    assertString(entry.regionId, `${entryLabel}.regionId`);
    assertOptionalString(entry.sourceContainerId, `${entryLabel}.sourceContainerId`);
    if (entry.sourceContainerType != null) {
      assertBuildingContainerType(
        entry.sourceContainerType,
        `${entryLabel}.sourceContainerType`
      );
    }
    assertOptionalString(entry.presentation, `${entryLabel}.presentation`);
    if (entry.characterFilter != null) {
      assertBuildingLayoutCharacterFilter(
        entry.characterFilter,
        `${entryLabel}.characterFilter`
      );
    }
    if (entry.actionFilter != null) {
      assertBuildingLayoutActionFilter(
        entry.actionFilter,
        `${entryLabel}.actionFilter`
      );
    }
    assertOptionalBoolean(
      entry.previewSelectable,
      `${entryLabel}.previewSelectable`
    );
    assertOptionalBoolean(
      entry.previewDraggable,
      `${entryLabel}.previewDraggable`
    );
    assertOptionalBoolean(
      entry.previewDropTarget,
      `${entryLabel}.previewDropTarget`
    );
    assertOptionalString(entry.clickActionId, `${entryLabel}.clickActionId`);
  });
}

function assertBuildingLayoutTemplateId(value: unknown, label: string): void {
  if (value !== "default-shell" && value !== "meeting-stage") {
    throw new Error(`${label} must be a supported building layout template id.`);
  }
}

function assertBuildingLayoutNodeKind(value: unknown, label: string): void {
  const allowedKinds = new Set([
    "header",
    "description",
    "character-seats",
    "action-menu",
    "leave-action",
    "fallback-panels",
  ]);
  if (typeof value !== "string" || !allowedKinds.has(value)) {
    throw new Error(`${label} must be a supported building layout node kind.`);
  }
}

function assertBuildingLayoutCharacterFilter(value: unknown, label: string): void {
  if (value !== "all" && value !== "primary" && value !== "secondary") {
    throw new Error(`${label} must be a supported building layout character filter.`);
  }
}

function assertBuildingLayoutActionFilter(value: unknown, label: string): void {
  if (value !== "all" && value !== "non-leave" && value !== "leave-only") {
    throw new Error(`${label} must be a supported building layout action filter.`);
  }
}

function assertBuildingContainerType(
  value: unknown,
  label: string
): void {
  const allowedTypes = new Set([
    "character-seats",
    "action-menu",
    "status-panel",
    "text-panel",
    "image-panel",
    "resource-panel",
  ]);
  if (typeof value !== "string" || !allowedTypes.has(value)) {
    throw new Error(`${label} must be a supported building container type.`);
  }
}
