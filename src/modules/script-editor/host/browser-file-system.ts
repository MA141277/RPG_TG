export type ScriptEditorSerializedTextFiles = Record<string, string>;

export type ScriptEditorDirectoryPickOptions = {
  mode?: "read" | "readwrite";
};

export type ScriptEditorWriteResult = {
  mode: "download" | "directory";
  directoryHandle: FileSystemDirectoryHandle | null;
};

export async function writeTextFilesWithDirectoryPicker(
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

export async function pickScriptEditorDirectory(
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

export async function readFilesFromDirectoryHandle(
  directoryHandle: FileSystemDirectoryHandle
): Promise<File[]> {
  const files: File[] = [];
  await collectFilesFromDirectoryHandle(directoryHandle, "", files);
  return files;
}

export function createTextImportFilesFromRecord(
  files: ScriptEditorSerializedTextFiles
): File[] {
  return Object.entries(files).map(([relativePath, content]) => {
    const fileName = relativePath.split("/").filter(Boolean).pop() ?? relativePath;
    const file = new File([content], fileName, {
      type: "application/json",
    });
    Object.defineProperty(file, "webkitRelativePath", {
      value: relativePath,
    });
    return file;
  });
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
