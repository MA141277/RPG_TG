import type { ScriptEditorProjectDefinition } from "../domain/script-editor-project";
import type { ScriptEditorPlayableCatalog } from "./script-editor-playable-catalog";
import type { ScriptEditorTemplateCatalog } from "./script-editor-template-catalog";
import type { ScriptEditorPublicationCatalog } from "./script-editor-publication-catalog";

export type ScriptEditorProjectStorageProject = {
  project: ScriptEditorProjectDefinition;
  directoryHandle?: FileSystemDirectoryHandle | null;
  source?: "new" | "opened" | "imported";
};

export type ScriptEditorProjectStorage = {
  createProject(): Promise<ScriptEditorProjectStorageProject | null>;
  openProject(): Promise<ScriptEditorProjectStorageProject | null>;
  readRecentProject?(id: string): Promise<ScriptEditorProjectStorageProject | null>;
};

export type ScriptEditorPreviewRequest = {
  project: ScriptEditorProjectDefinition;
  serializedPackFiles: Record<string, string>;
};

export type ScriptEditorPreviewSession = {
  exit(): Promise<void> | void;
};

export type ScriptEditorPreviewHost = {
  startPreview(
    request: ScriptEditorPreviewRequest
  ): Promise<ScriptEditorPreviewSession>;
};

export type ScriptEditorHost = {
  projectStorage: ScriptEditorProjectStorage;
  previewHost?: ScriptEditorPreviewHost;
  playableCatalog?: ScriptEditorPlayableCatalog;
  templateCatalog?: ScriptEditorTemplateCatalog;
  publicationCatalog?: ScriptEditorPublicationCatalog;
  notify?: (
    message: string,
    kind?: "info" | "error" | "success" | "warning"
  ) => void;
  confirm?: (message: string) => Promise<boolean>;
};
