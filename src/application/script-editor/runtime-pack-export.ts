import { parseScenarioPack } from "../scenario/scenario-pack-loader";
import {
  parseScriptEditorProject,
} from "./editor-project-loader";
import type {
  ScriptEditorProjectDefinition,
  ScriptEditorStoryPackRecord,
  ScriptEditorTextEntryRecord,
} from "../../domain/script-editor-project";
import type { ScenarioProfileDefinition } from "../../domain/scenario-profile";

export type ScriptEditorRuntimeExportDiagnostic = {
  code:
    | "unsupported-family"
    | "missing-field"
    | "invalid-field"
    | "duplicate-id"
    | "runtime-pack-contract";
  fieldPath: string;
  message: string;
};

type RuntimePackManifestFiles = {
  scenarioProfile: string;
  characters: string;
  cities: string;
  houses: string;
  events: string;
  scenes: string;
  tasks: string;
  textEntries: string;
};

type RuntimePackManifest = {
  schemaVersion: 1;
  kind: "scenario-pack";
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

const RUNTIME_PACK_CANONICAL_FILES: RuntimePackManifestFiles = {
  scenarioProfile: "./scenario-profile.json",
  characters: "./characters.json",
  cities: "./cities.json",
  houses: "./houses.json",
  events: "./events.json",
  scenes: "./scenes.json",
  tasks: "./tasks.json",
  textEntries: "./text-entries.json",
};

const DEFERRED_FAMILY_MESSAGES = {
  dialogues:
    "dialogues export is deferred in this bounded slice; scenes/text-entries assembly belongs to a later export step.",
  minigames:
    "minigames export is deferred in this bounded slice; activity/playable assembly belongs to a later export step.",
  storyNodes:
    "storyNodes export is deferred in this bounded slice; scene-flow assembly belongs to a later export step.",
  conditionGroups:
    "conditionGroups must fail closed until the shared condition compile path exists.",
  effectBundles:
    "effectBundles must fail closed until the shared effect compile path exists.",
} as const;

export function validateScriptEditorProjectForRuntimeExport(
  value: ScriptEditorProjectDefinition
): ScriptEditorRuntimeExportDiagnostic[] {
  const project = parseScriptEditorProject(value);
  const diagnostics: ScriptEditorRuntimeExportDiagnostic[] = [];

  for (const [familyKey, message] of Object.entries(DEFERRED_FAMILY_MESSAGES) as [
    keyof typeof DEFERRED_FAMILY_MESSAGES,
    string,
  ][]) {
    if (project[familyKey].length > 0) {
      diagnostics.push({
        code: "unsupported-family",
        fieldPath: `project.${familyKey}`,
        message,
      });
    }
  }

  appendCompatibilityImportResidueDiagnostics(project.storyPack, diagnostics);

  const scenarioProfile = extractScenarioProfile(project.storyPack, diagnostics);
  const exportedTextEntries = mapTextEntries(project.textEntries, diagnostics);

  if (diagnostics.length > 0 || scenarioProfile == null || exportedTextEntries == null) {
    return diagnostics;
  }

  try {
    parseScenarioPack({
      schemaVersion: 1,
      id: project.storyPack.id,
      title: project.storyPack.title,
      ...(project.storyPack.description == null
        ? {}
        : { description: project.storyPack.description }),
      scenarioProfile,
      characters: project.people,
      cities: project.cities,
      houses: project.buildings,
      events: project.events,
      scenes: [],
      tasks: project.quests,
      textEntries: exportedTextEntries,
    });
  } catch (error) {
    diagnostics.push({
      code: "runtime-pack-contract",
      fieldPath: "project.runtimePack",
      message:
        error instanceof Error
          ? error.message
          : "Runtime pack export failed scenario-pack contract validation.",
    });
  }

  return diagnostics;
}

export function exportScriptEditorProjectToScenarioPackFiles(
  value: ScriptEditorProjectDefinition
): Record<string, string> {
  const project = parseScriptEditorProject(value);
  const diagnostics = validateScriptEditorProjectForRuntimeExport(project);
  if (diagnostics.length > 0) {
    throw new Error(formatDiagnostics(diagnostics));
  }

  const scenarioProfile = extractScenarioProfile(project.storyPack, []);
  const exportedTextEntries = mapTextEntries(project.textEntries, []);
  if (scenarioProfile == null || exportedTextEntries == null) {
    throw new Error(
      "Script editor runtime export validation unexpectedly failed after diagnostics passed."
    );
  }

  const manifest: RuntimePackManifest = {
    schemaVersion: 1,
    kind: "scenario-pack",
    id: project.storyPack.id,
    title: project.storyPack.title,
    ...(project.storyPack.description == null
      ? {}
      : { description: project.storyPack.description }),
    ...pickOptionalPackMetadata(project.storyPack),
    files: RUNTIME_PACK_CANONICAL_FILES,
  };

  return {
    [RUNTIME_PACK_MANIFEST_FILE]: stringifyJson(manifest),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.scenarioProfile)]: stringifyJson(
      scenarioProfile
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.characters)]: stringifyJson(
      project.people
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.cities)]: stringifyJson(
      project.cities
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.houses)]: stringifyJson(
      project.buildings
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.events)]: stringifyJson(
      project.events
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.scenes)]: stringifyJson([]),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.tasks)]: stringifyJson(
      project.quests
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.textEntries)]: stringifyJson(
      exportedTextEntries
    ),
  };
}

function extractScenarioProfile(
  storyPack: ScriptEditorStoryPackRecord,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): ScenarioProfileDefinition | null {
  const rawScenarioProfile = storyPack["scenarioProfile"];
  if (rawScenarioProfile == null || typeof rawScenarioProfile !== "object" || Array.isArray(rawScenarioProfile)) {
    diagnostics.push({
      code: "missing-field",
      fieldPath: "project.storyPack.scenarioProfile",
      message:
        "storyPack.scenarioProfile is required to export a runtime-compatible scenario pack.",
    });
    return null;
  }

  const scenarioProfile = rawScenarioProfile as Record<string, unknown>;
  const initialLocation = readObject(
    scenarioProfile.initialLocation,
    "project.storyPack.scenarioProfile.initialLocation",
    diagnostics
  );

  const id = readString(
    scenarioProfile.id,
    "project.storyPack.scenarioProfile.id",
    diagnostics
  );
  const playerCharacterId = readString(
    scenarioProfile.playerCharacterId,
    "project.storyPack.scenarioProfile.playerCharacterId",
    diagnostics
  );
  const chapterId = readString(
    scenarioProfile.chapterId,
    "project.storyPack.scenarioProfile.chapterId",
    diagnostics
  );
  const mapId = readString(
    initialLocation?.mapId,
    "project.storyPack.scenarioProfile.initialLocation.mapId",
    diagnostics
  );
  const cityId = readString(
    initialLocation?.cityId,
    "project.storyPack.scenarioProfile.initialLocation.cityId",
    diagnostics
  );
  const view = readString(
    initialLocation?.view,
    "project.storyPack.scenarioProfile.initialLocation.view",
    diagnostics
  );

  if (
    id == null ||
    playerCharacterId == null ||
    chapterId == null ||
    mapId == null ||
    cityId == null ||
    view == null
  ) {
    return null;
  }

  const houseId = readNullableString(
    initialLocation?.houseId,
    "project.storyPack.scenarioProfile.initialLocation.houseId",
    diagnostics
  );

  return {
    id,
    title:
      typeof scenarioProfile.title === "string" && scenarioProfile.title.length > 0
        ? scenarioProfile.title
        : storyPack.title,
    playerCharacterId,
    chapterId,
    initialLocation: {
      mapId,
      cityId,
      houseId,
      view: view as ScenarioProfileDefinition["initialLocation"]["view"],
    },
  };
}

function mapTextEntries(
  textEntries: ScriptEditorTextEntryRecord[],
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): Record<string, string> | null {
  const exportedTextEntries: Record<string, string> = {};

  for (const [index, entry] of textEntries.entries()) {
    if (typeof entry.text !== "string" || entry.text.length === 0) {
      diagnostics.push({
        code: "missing-field",
        fieldPath: `project.textEntries[${index}].text`,
        message: "Runtime export requires every text entry to provide a non-empty text string.",
      });
      continue;
    }

    if (Object.hasOwn(exportedTextEntries, entry.id)) {
      diagnostics.push({
        code: "duplicate-id",
        fieldPath: `project.textEntries[${index}].id`,
        message: `Duplicate text entry id "${entry.id}" cannot be lowered into text-entries.json.`,
      });
      continue;
    }

    exportedTextEntries[entry.id] = entry.text;
  }

  return diagnostics.length === 0 ? exportedTextEntries : null;
}

function pickOptionalPackMetadata(
  storyPack: ScriptEditorStoryPackRecord
): Partial<Pick<RuntimePackManifest, "basePackId" | "author" | "version" | "tags">> {
  return {
    ...(typeof storyPack["basePackId"] === "string"
      ? { basePackId: storyPack["basePackId"] }
      : {}),
    ...(typeof storyPack["author"] === "string"
      ? { author: storyPack["author"] }
      : {}),
    ...(typeof storyPack["version"] === "string"
      ? { version: storyPack["version"] }
      : {}),
    ...(Array.isArray(storyPack["tags"]) &&
    storyPack["tags"].every((tag) => typeof tag === "string")
      ? { tags: [...storyPack["tags"]] as string[] }
      : {}),
  };
}

function readObject(
  value: unknown,
  fieldPath: string,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): Record<string, unknown> | null {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    diagnostics.push({
      code: value == null ? "missing-field" : "invalid-field",
      fieldPath,
      message: `${fieldPath} must be an object.`,
    });
    return null;
  }

  return value as Record<string, unknown>;
}

function readString(
  value: unknown,
  fieldPath: string,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): string | null {
  if (typeof value !== "string" || value.length === 0) {
    diagnostics.push({
      code: value == null ? "missing-field" : "invalid-field",
      fieldPath,
      message: `${fieldPath} must be a non-empty string.`,
    });
    return null;
  }

  return value;
}

function readNullableString(
  value: unknown,
  fieldPath: string,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): string | null {
  if (value == null) {
    return null;
  }

  if (typeof value !== "string") {
    diagnostics.push({
      code: "invalid-field",
      fieldPath,
      message: `${fieldPath} must be a string or null.`,
    });
    return null;
  }

  return value;
}

function appendCompatibilityImportResidueDiagnostics(
  storyPack: ScriptEditorStoryPackRecord,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): void {
  const compatibilityImport = storyPack["compatibilityImport"];
  if (
    compatibilityImport == null ||
    typeof compatibilityImport !== "object" ||
    Array.isArray(compatibilityImport)
  ) {
    return;
  }

  const unresolvedFamilies = (compatibilityImport as Record<string, unknown>)[
    "unresolvedFamilies"
  ];
  if (
    unresolvedFamilies == null ||
    typeof unresolvedFamilies !== "object" ||
    Array.isArray(unresolvedFamilies)
  ) {
    return;
  }

  for (const familyKey of Object.keys(
    unresolvedFamilies as Record<string, unknown>
  ).sort()) {
    diagnostics.push({
      code: "unsupported-family",
      fieldPath: `project.storyPack.compatibilityImport.unresolvedFamilies.${familyKey}`,
      message:
        `Unresolved imported runtime family "${familyKey}" must be resolved or preserved by a later compatibility/export step before runtime export can proceed.`,
    });
  }
}

function formatDiagnostics(
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): string {
  return [
    "Script editor runtime export validation failed.",
    ...diagnostics.map(
      (diagnostic) => `- ${diagnostic.fieldPath}: ${diagnostic.message}`
    ),
  ].join("\n");
}

function stripRelativePrefix(value: string): string {
  return value.startsWith("./") ? value.slice(2) : value;
}

function stringifyJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}
