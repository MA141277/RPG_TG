import {
  SCRIPT_EDITOR_PROJECT_CANONICAL_FILES,
  SCRIPT_EDITOR_PROJECT_KIND,
  SCRIPT_EDITOR_PROJECT_MANIFEST_FILE,
  type ScriptEditorProjectDefinition,
  type ScriptEditorProjectFileKey,
} from "../../domain/script-editor-project";
import { parseScriptEditorProject } from "./editor-project-loader";

export function serializeScriptEditorProjectToFiles(
  value: ScriptEditorProjectDefinition
): Record<string, string> {
  const project = parseScriptEditorProject(value);
  const files: Record<string, string> = {
    [SCRIPT_EDITOR_PROJECT_MANIFEST_FILE]: stringifyJson({
      schemaVersion: project.schemaVersion,
      kind: SCRIPT_EDITOR_PROJECT_KIND,
      id: project.id,
      title: project.title,
      ...(project.description == null ? {} : { description: project.description }),
      files: SCRIPT_EDITOR_PROJECT_CANONICAL_FILES,
    }),
  };

  for (const [fileKey, filePath] of Object.entries(
    SCRIPT_EDITOR_PROJECT_CANONICAL_FILES
  ) as [ScriptEditorProjectFileKey, string][]) {
    files[stripRelativePrefix(filePath)] = stringifyJson(project[fileKey]);
  }

  return files;
}

function stripRelativePrefix(value: string): string {
  return value.startsWith("./") ? value.slice(2) : value;
}

function stringifyJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}
