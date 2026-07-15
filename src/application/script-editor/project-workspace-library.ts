import type { ScriptEditorProjectDefinition } from "../../domain/script-editor-project";

export type ScriptEditorProjectPackageLocation = {
  locationKind: "directory" | "imported-files" | "download";
  displayPath: string;
  durable: boolean;
};

export type ScriptEditorProjectLibraryValidity =
  | {
      state: "valid";
      reason?: undefined;
    }
  | {
      state: "stale";
      reason: string;
    };

export type ScriptEditorProjectLibraryEntry = {
  projectId: string;
  title: string;
  description: string;
  source: "new" | "opened" | "imported";
  project: ScriptEditorProjectDefinition;
  packageLocation: ScriptEditorProjectPackageLocation;
  validity: ScriptEditorProjectLibraryValidity;
};

export function createScriptEditorProjectLibraryEntry(
  project: ScriptEditorProjectDefinition,
  source: ScriptEditorProjectLibraryEntry["source"],
  packageLocation: ScriptEditorProjectPackageLocation = createDefaultPackageLocation(
    source
  )
): ScriptEditorProjectLibraryEntry {
  return {
    projectId: project.id,
    title: project.title,
    description: project.description ?? "",
    source,
    project,
    packageLocation,
    validity: {
      state: "valid",
    },
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

export function markScriptEditorProjectLibraryEntryStale(
  entry: ScriptEditorProjectLibraryEntry,
  reason: string
): ScriptEditorProjectLibraryEntry {
  return {
    ...entry,
    validity: {
      state: "stale",
      reason,
    },
  };
}

export function canContinueScriptEditorProjectEntry(
  entry: ScriptEditorProjectLibraryEntry
): boolean {
  return entry.validity.state === "valid";
}

function createDefaultPackageLocation(
  source: ScriptEditorProjectLibraryEntry["source"]
): ScriptEditorProjectPackageLocation {
  return {
    locationKind: source === "imported" ? "imported-files" : "download",
    displayPath: "",
    durable: false,
  };
}
