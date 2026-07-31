import { loadScenarioPackFromFiles } from "../../../application/scenario/scenario-pack-loader";
import {
  createDefaultScriptEditorProjectDefinition,
} from "../application/minimal-workflow";
import { loadScriptEditorProjectFromFiles } from "../application/editor-project-loader";
import { serializeScriptEditorProjectToFiles } from "../application/editor-project-save";
import { markScriptEditorProjectCompleteForExport } from "../application/project-completion-state";
import { exportScriptEditorProjectToScenarioPackFiles } from "../application/runtime-pack-export";
import { loadScriptEditorProjectFromScenarioPackUrl } from "../application/runtime-pack-import";
import { DEFAULT_SCRIPT_EDITOR_TEMPLATE_SCENARIO_PACK_URL } from "../config";
import type { ScriptEditorProjectDefinition } from "../domain/script-editor-project";
import {
  createTextImportFilesFromRecord,
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
  returnContext: unknown;
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
  setScreen(screen: string): void;
  captureRuntimePreviewReturnContext(): unknown;
  restoreRuntimePreviewReturnContext(returnContext: unknown): void;
  getRuntimePreviewSession(): ScriptEditorRuntimePreviewSessionState | null;
  setRuntimePreviewSession(
    session: ScriptEditorRuntimePreviewSessionState | null
  ): void;
  startLoadedScenarioPack(
    scenarioPack: unknown
  ): Promise<"started" | "failed" | string | void>;
  exitRuntimePreview(): void;
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
    const project = createDefaultScriptEditorProjectDefinition();
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
        exportScriptEditorProjectToScenarioPackFiles(project),
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

    const returnContext = this.environment.captureRuntimePreviewReturnContext();
    try {
      const serializedPackFiles = exportScriptEditorProjectToScenarioPackFiles(project);
      const scenarioPack = await loadScenarioPackFromFiles(
        createTextImportFilesFromRecord(serializedPackFiles)
      );
      this.environment.setRuntimePreviewSession({
        returnContext,
        startedAt: Date.now(),
      });
      const startResult = await this.environment.startLoadedScenarioPack(scenarioPack);
      if (startResult === "started") {
        this.environment.setScreen("runtime-preview");
        return;
      }
      if (startResult === "failed") {
        throw new Error("Runtime preview startup failed.");
      }
    } catch (error) {
      this.environment.setRuntimePreviewSession(null);
      this.environment.restoreRuntimePreviewReturnContext(returnContext);
      this.environment.recordNotice({
        tone: "warning",
        message:
          error instanceof Error ? error.message : "Failed to start runtime preview.",
      });
      this.environment.setScreen("script-editor-workspace");
    }
  }

  async openProjectFromDirectory(): Promise<void> {
    try {
      const directoryHandle = await pickScriptEditorDirectory({
        mode: "readwrite",
      });
      const files = await readFilesFromDirectoryHandle(directoryHandle);
      this.environment.setProjectSource("opened");
      this.environment.commitProject(await loadScriptEditorProjectFromFiles(files));
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
      this.environment.commitProject(await loadScriptEditorProjectFromFiles(files));
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
    try {
      this.environment.setProjectSource("imported");
      this.environment.commitProject(
        await loadScriptEditorProjectFromScenarioPackUrl(
          DEFAULT_SCRIPT_EDITOR_TEMPLATE_SCENARIO_PACK_URL
        )
      );
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
    if (this.environment.getRuntimePreviewSession() == null) {
      return;
    }

    this.environment.setScreen("runtime-preview");
  }

  exitRuntimePreviewSession(): void {
    const returnContext =
      this.environment.getRuntimePreviewSession()?.returnContext ?? null;
    this.environment.setRuntimePreviewSession(null);
    this.environment.exitRuntimePreview();
    this.environment.restoreRuntimePreviewReturnContext(returnContext);
  }
}

export function createScriptEditorWorkflowController(
  environment: ScriptEditorWorkflowEnvironment
): ScriptEditorWorkflowController {
  return new ScriptEditorWorkflowController(environment);
}
