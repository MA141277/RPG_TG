import type { ScriptEditorProjectDefinition } from "../domain/script-editor-project";

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

export type ScriptEditorPreviewRuntime = {
  startPreview(
    request: ScriptEditorPreviewRequest
  ): Promise<ScriptEditorPreviewSession>;
};

export type ScriptEditorHost = {
  projectStorage: ScriptEditorProjectStorage;
  previewRuntime: ScriptEditorPreviewRuntime;
  notify?: (
    message: string,
    kind?: "info" | "error" | "success" | "warning"
  ) => void;
  confirm?: (message: string) => Promise<boolean>;
};
