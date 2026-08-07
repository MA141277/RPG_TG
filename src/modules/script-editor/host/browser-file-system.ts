import type {
  ScriptEditorDirectoryPickOptions,
  ScriptEditorFileSystemHost,
  ScriptEditorSerializedTextFiles,
  ScriptEditorWriteResult,
} from "./script-editor-file-system-host";
export { createTextImportFilesFromRecord } from "./script-editor-file-system-host";

export async function writeTextFilesWithDirectoryPicker(
  files: ScriptEditorSerializedTextFiles,
  options: {
    directoryHandle?: FileSystemDirectoryHandle | null;
    suggestedName?: string | null;
    downloadPrefix?: string;
  } = {}
): Promise<ScriptEditorWriteResult> {
  return createBrowserScriptEditorFileSystemHost().writeTextFiles(files, options);
}

export async function pickScriptEditorDirectory(
  options: ScriptEditorDirectoryPickOptions = {}
): Promise<FileSystemDirectoryHandle> {
  return createBrowserScriptEditorFileSystemHost().pickDirectory(options);
}

export async function readFilesFromDirectoryHandle(
  directoryHandle: FileSystemDirectoryHandle
): Promise<File[]> {
  return createBrowserScriptEditorFileSystemHost().readFilesFromDirectoryHandle(
    directoryHandle
  );
}

export function createBrowserScriptEditorFileSystemHost(): ScriptEditorFileSystemHost {
  return {
    writeTextFiles(files, options = {}) {
      return writeTextFilesWithDirectoryPickerInternal(files, options);
    },
    pickDirectory(options = {}) {
      return pickScriptEditorDirectoryInternal(options);
    },
    readFilesFromDirectoryHandle(directoryHandle) {
      return readFilesFromDirectoryHandleInternal(directoryHandle);
    },
  };
}

async function writeTextFilesWithDirectoryPickerInternal(
  files: ScriptEditorSerializedTextFiles,
  options: {
    directoryHandle?: FileSystemDirectoryHandle | null;
    suggestedName?: string | null;
    downloadPrefix?: string;
  } = {}
): Promise<ScriptEditorWriteResult> {
  const directoryPicker = getScriptEditorDirectoryPicker();
  if (directoryPicker == null) {
    triggerFileDownloads(files, options.downloadPrefix);
    return {
      mode: "download",
      directoryHandle: null,
    };
  }

  const directoryHandle =
    options.directoryHandle ??
    (await directoryPicker({
      id: "script-editor-workflow",
      mode: "readwrite",
      ...(options.suggestedName == null
        ? {}
        : { startIn: "documents" as const }),
    }));
  await writeTextFilesToDirectory(directoryHandle, files);
  return {
    mode: "directory",
    directoryHandle,
  };
}

async function pickScriptEditorDirectoryInternal(
  options: ScriptEditorDirectoryPickOptions = {}
): Promise<FileSystemDirectoryHandle> {
  const directoryPicker = getScriptEditorDirectoryPicker();
  if (directoryPicker == null) {
    throw new Error("This browser cannot open a writable project directory.");
  }

  return directoryPicker({
    id: "script-editor-workflow",
    mode: options.mode ?? "read",
  });
}

async function readFilesFromDirectoryHandleInternal(
  directoryHandle: FileSystemDirectoryHandle
): Promise<File[]> {
  const files: File[] = [];
  await collectFilesFromDirectoryHandle(directoryHandle, "", files);
  return files;
}

function getScriptEditorDirectoryPicker():
  | ((options: {
      id: string;
      mode: "read" | "readwrite";
      startIn?: "documents";
    }) => Promise<FileSystemDirectoryHandle>)
  | null {
  const globalDirectoryPickerHost = globalThis as typeof globalThis & {
    showDirectoryPicker?: (
      options: {
        id: string;
        mode: "read" | "readwrite";
        startIn?: "documents";
      }
    ) => Promise<FileSystemDirectoryHandle>;
  };
  if (typeof globalDirectoryPickerHost.showDirectoryPicker === "function") {
    return globalDirectoryPickerHost.showDirectoryPicker.bind(globalThis);
  }

  const windowDirectoryPickerHost = globalThis.window as
    | (Window & {
        showDirectoryPicker?: (
          options: {
            id: string;
            mode: "read" | "readwrite";
            startIn?: "documents";
          }
        ) => Promise<FileSystemDirectoryHandle>;
      })
    | undefined;
  return typeof windowDirectoryPickerHost?.showDirectoryPicker === "function"
    ? windowDirectoryPickerHost.showDirectoryPicker.bind(windowDirectoryPickerHost)
    : null;
}

async function writeTextFilesToDirectory(
  directoryHandle: FileSystemDirectoryHandle,
  files: ScriptEditorSerializedTextFiles
): Promise<void> {
  for (const [relativePath, content] of Object.entries(files)) {
    const pathSegments = relativePath.split("/").filter(Boolean);
    const fileName = pathSegments.pop();
    if (fileName == null) {
      continue;
    }

    let currentDirectoryHandle = directoryHandle;
    for (const segment of pathSegments) {
      currentDirectoryHandle = await currentDirectoryHandle.getDirectoryHandle(segment, {
        create: true,
      });
    }

    const fileHandle = await currentDirectoryHandle.getFileHandle(fileName, {
      create: true,
    });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
  }
}

async function collectFilesFromDirectoryHandle(
  directoryHandle: FileSystemDirectoryHandle,
  basePath: string,
  files: File[]
): Promise<void> {
  for await (const [name, handle] of directoryHandle.entries()) {
    const relativePath = basePath.length === 0 ? name : `${basePath}/${name}`;
    if (handle.kind === "directory") {
      await collectFilesFromDirectoryHandle(
        handle as FileSystemDirectoryHandle,
        relativePath,
        files
      );
      continue;
    }
    if (handle.kind !== "file") {
      continue;
    }

    const file = await (handle as FileSystemFileHandle).getFile();
    files.push(createDirectoryImportFile(file, relativePath));
  }
}

function createDirectoryImportFile(file: File, relativePath: string): File {
  const importedFile = new File([file], file.name, {
    type: file.type,
    lastModified: file.lastModified,
  });
  Object.defineProperty(importedFile, "webkitRelativePath", {
    value: relativePath,
  });
  return importedFile;
}

function triggerFileDownloads(
  files: ScriptEditorSerializedTextFiles,
  downloadPrefix = "script-editor"
): void {
  for (const [relativePath, content] of Object.entries(files)) {
    const downloadName = `${downloadPrefix}-${relativePath.replaceAll("/", "__")}`;
    const link = globalThis.document?.createElement("a");
    if (link == null) {
      continue;
    }
    const url = globalThis.URL.createObjectURL(
      new Blob([content], { type: "application/json" })
    );
    link.href = url;
    link.download = downloadName;
    globalThis.document.body.append(link);
    link.click();
    link.remove();
    globalThis.setTimeout(() => {
      globalThis.URL.revokeObjectURL(url);
    }, 0);
  }
}
