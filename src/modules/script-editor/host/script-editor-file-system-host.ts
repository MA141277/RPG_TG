export type ScriptEditorSerializedTextFiles = Record<string, string>;

export type ScriptEditorDirectoryPickOptions = {
  mode?: "read" | "readwrite";
};

export type ScriptEditorWriteResult = {
  mode: "download" | "directory";
  directoryHandle: FileSystemDirectoryHandle | null;
};

export type ScriptEditorFileSystemHost = {
  writeTextFiles(
    files: ScriptEditorSerializedTextFiles,
    options?: {
      directoryHandle?: FileSystemDirectoryHandle | null;
      suggestedName?: string | null;
      downloadPrefix?: string;
    }
  ): Promise<ScriptEditorWriteResult>;
  pickDirectory(
    options?: ScriptEditorDirectoryPickOptions
  ): Promise<FileSystemDirectoryHandle>;
  readFilesFromDirectoryHandle(
    directoryHandle: FileSystemDirectoryHandle
  ): Promise<File[]>;
};

let defaultScriptEditorFileSystemHost: ScriptEditorFileSystemHost | null = null;

export function setDefaultScriptEditorFileSystemHost(
  fileSystemHost: ScriptEditorFileSystemHost
): void {
  defaultScriptEditorFileSystemHost = fileSystemHost;
}

export function resolveScriptEditorFileSystemHost(
  fileSystemHost?: ScriptEditorFileSystemHost | null
): ScriptEditorFileSystemHost {
  if (fileSystemHost != null) {
    return fileSystemHost;
  }
  if (defaultScriptEditorFileSystemHost == null) {
    throw new Error("No script editor file-system host is installed.");
  }
  return defaultScriptEditorFileSystemHost;
}
