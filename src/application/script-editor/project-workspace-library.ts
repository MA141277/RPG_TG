import type { ScriptEditorProjectDefinition } from "../../domain/script-editor-project";

export type ScriptEditorProjectLibraryEntry = {
  projectId: string;
  title: string;
  description: string;
  source: "new" | "opened" | "imported";
  project: ScriptEditorProjectDefinition;
};

export function createScriptEditorProjectLibraryEntry(
  project: ScriptEditorProjectDefinition,
  source: ScriptEditorProjectLibraryEntry["source"]
): ScriptEditorProjectLibraryEntry {
  return {
    projectId: project.id,
    title: project.title,
    description: project.description ?? "",
    source,
    project,
  };
}

export function upsertScriptEditorProjectLibraryEntry(
  entries: readonly ScriptEditorProjectLibraryEntry[],
  nextEntry: ScriptEditorProjectLibraryEntry
): ScriptEditorProjectLibraryEntry[] {
  const remainingEntries = entries.filter(
    (entry) => entry.projectId !== nextEntry.projectId
  );

  return [nextEntry, ...remainingEntries];
}

export function removeScriptEditorProjectLibraryEntry(
  entries: readonly ScriptEditorProjectLibraryEntry[],
  projectId: string
): ScriptEditorProjectLibraryEntry[] {
  return entries.filter((entry) => entry.projectId !== projectId);
}

export function findScriptEditorProjectLibraryEntry(
  entries: readonly ScriptEditorProjectLibraryEntry[],
  projectId: string
): ScriptEditorProjectLibraryEntry | null {
  return entries.find((entry) => entry.projectId === projectId) ?? null;
}
