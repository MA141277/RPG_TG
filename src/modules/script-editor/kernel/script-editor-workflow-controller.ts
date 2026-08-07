import {
  createDefaultScriptEditorProjectDefinition,
} from "../application/minimal-workflow";
import { loadScriptEditorProjectFromFiles } from "../application/editor-project-loader";
import { serializeScriptEditorProjectToFiles } from "../application/editor-project-save";
import { markScriptEditorProjectCompleteForExport } from "../application/project-completion-state";
import { exportScriptEditorProjectToScenarioPackFiles } from "../application/runtime-pack-export";
import type { ScriptEditorProjectDefinition } from "../domain/script-editor-project";
import type {
  ScriptEditorPreviewHost,
  ScriptEditorPreviewSession,
} from "../host/script-editor-host";
import type { ScriptEditorPlayableCatalog } from "../host/script-editor-playable-catalog";
import type { ScriptEditorTemplateCatalog } from "../host/script-editor-template-catalog";
import {
  pickScriptEditorDirectory,
  readFilesFromDirectoryHandle,
  type ScriptEditorWriteResult,
  writeTextFilesWithDirectoryPicker,
} from "../host/browser-file-system";

export type ScriptEditorWorkflowNotice = {
  tone: "success" | "warning";
  message: string;
};

export type ScriptEditorRuntimePreviewSessionState = {
  previewSession: ScriptEditorPreviewSession;
  startedAt: number;
};

export type ScriptEditorProjectSource = "new" | "opened" | "imported";

export type ScriptEditorWorkflowEnvironment = {
  getProject(): ScriptEditorProjectDefinition | null;
  getProjectSource(): ScriptEditorProjectSource;
  setProjectSource(source: ScriptEditorProjectSource): void;
  commitProject(project: ScriptEditorProjectDefinition): void;
  getProjectDirectoryHandle(): FileSystemDirectoryHandle | null;
  setProjectDirectoryHandle(handle: FileSystemDirectoryHandle | null): void;
  getExportDirectoryHandle(): FileSystemDirectoryHandle | null;
  setExportDirectoryHandle(handle: FileSystemDirectoryHandle | null): void;
  rememberProjectPackageLocation(result: ScriptEditorWriteResult): void;
  resetRecordListPages(): void;
  resetRecordSearch(): void;
  setSelection(selection: { family: "storyPack"; entityId: null }): void;
  setAuxiliaryPanelOpen(isOpen: boolean): void;
  setPendingDeleteProjectId(projectId: string | null): void;
  resetNoticeTimeline(): void;
  recordNotice(notice: ScriptEditorWorkflowNotice): void;
  getPlayableCatalog(): ScriptEditorPlayableCatalog | null;
  getPreviewHost(): ScriptEditorPreviewHost | null;
  getTemplateCatalog(): ScriptEditorTemplateCatalog | null;
  setScreen(screen: string): void;
  getRuntimePreviewSession(): ScriptEditorRuntimePreviewSessionState | null;
  setRuntimePreviewSession(
    session: ScriptEditorRuntimePreviewSessionState | null
  ): void;
};

export class ScriptEditorWorkflowController {
  readonly environment: ScriptEditorWorkflowEnvironment;

  constructor(environment: ScriptEditorWorkflowEnvironment) {
    this.environment = environment;
  }

  async saveProject(): Promise<void> {
    const project = this.environment.getProject();
    if (project == null) {
      return;
    }

    try {
      const result = await writeTextFilesWithDirectoryPicker(
        serializeScriptEditorProjectToFiles(project),
        {
          directoryHandle: this.environment.getProjectDirectoryHandle(),
          suggestedName: project.id,
          downloadPrefix: project.id,
        }
      );
      this.environment.setProjectDirectoryHandle(result.directoryHandle ?? null);
      this.environment.rememberProjectPackageLocation(result);
      this.environment.recordNotice({
        tone: "success",
        message:
          result.mode === "directory"
            ? "已将剧本项目保存到所选目录。"
            : "已下载剧本项目文件。",
      });
    } catch (error) {
      this.environment.recordNotice({
        tone: "warning",
        message:
          error instanceof Error ? error.message : "保存剧本项目失败。",
      });
    }

    this.environment.setScreen("script-editor-workspace");
  }

  async createProjectAtSavePath(): Promise<void> {
    const project = createDefaultScriptEditorProjectDefinition({
      playableCatalog: this.environment.getPlayableCatalog() ?? undefined,
    });
    const result = await writeTextFilesWithDirectoryPicker(
      serializeScriptEditorProjectToFiles(project),
      {
        directoryHandle: null,
        suggestedName: project.id,
        downloadPrefix: project.id,
      }
    );

    this.environment.setProjectSource("new");
    this.environment.commitProject(project);
    this.environment.setProjectDirectoryHandle(result.directoryHandle ?? null);
    this.environment.rememberProjectPackageLocation(result);
  }

  async exportProject(): Promise<void> {
    const project = this.environment.getProject();
    if (project == null) {
      return;
    }

    this.environment.setAuxiliaryPanelOpen(true);
    try {
      const result = await writeTextFilesWithDirectoryPicker(
        exportScriptEditorProjectToScenarioPackFiles(project, {
          playableCatalog: this.environment.getPlayableCatalog() ?? undefined,
        }),
        {
          directoryHandle: this.environment.getExportDirectoryHandle(),
          suggestedName: project.storyPack.id,
          downloadPrefix: project.storyPack.id,
        }
      );
      this.environment.setExportDirectoryHandle(result.directoryHandle ?? null);
      this.environment.commitProject(markScriptEditorProjectCompleteForExport(project));
      this.environment.recordNotice({
        tone: "success",
        message:
          result.mode === "directory"
            ? "已导出运行时剧本包。"
            : "已下载运行时剧本包文件。",
      });
    } catch (error) {
      this.environment.recordNotice({
        tone: "warning",
        message:
          error instanceof Error ? error.message : "导出运行时剧本包失败。",
      });
    }

    this.environment.setScreen("script-editor-workspace");
  }

  async previewProjectRuntime(): Promise<void> {
    const project = this.environment.getProject();
    if (project == null) {
      return;
    }

    const previewHost = this.environment.getPreviewHost();
    if (previewHost == null) {
      this.environment.recordNotice({
        tone: "warning",
        message: "当前宿主未提供运行预览能力。",
      });
      return;
    }

    try {
      const serializedPackFiles = exportScriptEditorProjectToScenarioPackFiles(project, {
        playableCatalog: this.environment.getPlayableCatalog() ?? undefined,
      });
      const previewSession = await previewHost.startPreview({
        project,
        serializedPackFiles,
      });
      this.environment.setRuntimePreviewSession({
        previewSession,
        startedAt: Date.now(),
      });
    } catch (error) {
      this.environment.setRuntimePreviewSession(null);
      this.environment.recordNotice({
        tone: "warning",
        message:
          error instanceof Error ? error.message : "Failed to start runtime preview.",
      });
    }
  }

  async openProjectFromDirectory(): Promise<void> {
    try {
      const directoryHandle = await pickScriptEditorDirectory({
        mode: "readwrite",
      });
      const files = await readFilesFromDirectoryHandle(directoryHandle);
      this.environment.setProjectSource("opened");
      this.environment.commitProject(
        await loadScriptEditorProjectFromFiles(files, {
          playableCatalog: this.environment.getPlayableCatalog() ?? undefined,
        })
      );
      this.environment.resetRecordListPages();
      this.environment.resetRecordSearch();
      this.environment.setSelection({
        family: "storyPack",
        entityId: null,
      });
      this.environment.setAuxiliaryPanelOpen(false);
      this.environment.setProjectDirectoryHandle(directoryHandle);
      this.environment.rememberProjectPackageLocation({
        mode: "directory",
        directoryHandle,
      });
      this.environment.setPendingDeleteProjectId(null);
      this.environment.resetNoticeTimeline();
      this.environment.recordNotice({
        tone: "success",
        message: "Script editor project draft opened.",
      });
      this.environment.setScreen("script-editor-workspace");
    } catch (error) {
      this.environment.recordNotice({
        tone: "warning",
        message:
          error instanceof Error ? error.message : "Failed to open script editor project.",
      });
      this.environment.setScreen("script-editor-landing");
    }
  }

  async importProjectFiles(files: readonly File[]): Promise<void> {
    try {
      this.environment.setProjectSource("opened");
      this.environment.commitProject(
        await loadScriptEditorProjectFromFiles(files, {
          playableCatalog: this.environment.getPlayableCatalog() ?? undefined,
        })
      );
      this.environment.resetRecordListPages();
      this.environment.resetRecordSearch();
      this.environment.setSelection({
        family: "storyPack",
        entityId: null,
      });
      this.environment.setAuxiliaryPanelOpen(false);
      this.environment.setProjectDirectoryHandle(null);
      this.environment.setPendingDeleteProjectId(null);
      this.environment.resetNoticeTimeline();
      this.environment.recordNotice({
        tone: "success",
        message: "已打开剧本项目。",
      });
      this.environment.setScreen("script-editor-workspace");
    } catch (error) {
      this.environment.recordNotice({
        tone: "warning",
        message:
          error instanceof Error ? error.message : "打开剧本项目失败。",
      });
      this.environment.setScreen("script-editor-landing");
    }
  }

  async importTemplateProject(): Promise<void> {
    const templateCatalog = this.environment.getTemplateCatalog();
    if (templateCatalog == null) {
      this.environment.recordNotice({
        tone: "warning",
        message: "当前宿主未提供默认模板能力。",
      });
      return;
    }

    try {
      this.environment.setProjectSource("imported");
      this.environment.commitProject(await templateCatalog.loadDefaultProject());
      this.environment.resetRecordListPages();
      this.environment.resetRecordSearch();
      this.environment.setSelection({
        family: "storyPack",
        entityId: null,
      });
      this.environment.setAuxiliaryPanelOpen(false);
      this.environment.setExportDirectoryHandle(null);
      this.environment.setPendingDeleteProjectId(null);
      this.environment.resetNoticeTimeline();
      this.environment.setScreen("script-editor-workspace");
    } catch (error) {
      this.environment.recordNotice({
        tone: "warning",
        message:
          error instanceof Error ? error.message : "导入运行时剧本包失败。",
      });
      this.environment.setScreen("script-editor-landing");
    }
  }

  enterRuntimePreviewSession(): void {
    return;
  }

  async exitRuntimePreviewSession(): Promise<void> {
    const previewSession =
      this.environment.getRuntimePreviewSession()?.previewSession ?? null;
    this.environment.setRuntimePreviewSession(null);
    await previewSession?.exit?.();
  }
}

export function createScriptEditorWorkflowController(
  environment: ScriptEditorWorkflowEnvironment
): ScriptEditorWorkflowController {
  return new ScriptEditorWorkflowController(environment);
}
