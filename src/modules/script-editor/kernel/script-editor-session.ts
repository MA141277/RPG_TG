import type { ScriptEditorProjectDefinition } from "../domain/script-editor-project";
import type { ScriptEditorHost } from "../host/script-editor-host";
import {
  createScriptEditorWorkflowController,
  type ScriptEditorWorkflowController,
} from "./script-editor-workflow-controller";
import { installMainUiFlowScriptEditorModule } from "../ui/main-ui-script-editor-module";

export type ScriptEditorInitialAction =
  | "landing"
  | "new-project"
  | "open-project"
  | "use-template";

export type MountScriptEditorSessionOptions = {
  host: ScriptEditorHost;
  container: HTMLElement;
  initialProject?: ScriptEditorProjectDefinition | null;
  initialAction?: ScriptEditorInitialAction;
};

export type ScriptEditorMountHandle = {
  host: ScriptEditorHost;
  container: HTMLElement;
  initialProject: ScriptEditorProjectDefinition | null;
  initialAction: ScriptEditorInitialAction;
  dispose(): void;
};

type ScriptEditorEmbeddedSessionHost = {
  [key: string]: unknown;
  setScreen(screen: string): void;
  onStartLoadedScenarioPack?: (
    scenarioPack: unknown
  ) => Promise<"started" | "failed" | string | void>;
  onExitRuntimePreview?: (() => void) | undefined;
};

export type CreateEmbeddedScriptEditorSessionOptions = {
  host: ScriptEditorEmbeddedSessionHost;
  hostOptions?: unknown;
};

export type ScriptEditorEmbeddedSession = {
  host: ScriptEditorEmbeddedSessionHost;
  workflowController: ScriptEditorWorkflowController;
  handleClickTarget(target: Element): Promise<boolean>;
  dispose(): void;
};

export function mountScriptEditorSession(
  options: MountScriptEditorSessionOptions
): ScriptEditorMountHandle {
  const initialAction = options.initialAction ?? "landing";
  options.container.dataset.scriptEditorMount = initialAction;

  return {
    host: options.host,
    container: options.container,
    initialProject: options.initialProject ?? null,
    initialAction,
    dispose() {
      delete options.container.dataset.scriptEditorMount;
    },
  };
}

export function createEmbeddedScriptEditorSession(
  options: CreateEmbeddedScriptEditorSessionOptions
): ScriptEditorEmbeddedSession {
  const host = options.host as Record<string, any>;

  installMainUiFlowScriptEditorModule(host, options.hostOptions);

  const workflowController = createScriptEditorWorkflowController({
    getProject: () => host.scriptEditorProject,
    getProjectSource: () => host.scriptEditorProjectSource,
    setProjectSource: (source) => {
      host.scriptEditorProjectSource = source;
    },
    commitProject: (project) => {
      host.commitScriptEditorProject(project);
    },
    getProjectDirectoryHandle: () => host.scriptEditorProjectDirectoryHandle,
    setProjectDirectoryHandle: (handle) => {
      host.scriptEditorProjectDirectoryHandle = handle;
    },
    getExportDirectoryHandle: () => host.scriptEditorExportDirectoryHandle,
    setExportDirectoryHandle: (handle) => {
      host.scriptEditorExportDirectoryHandle = handle;
    },
    rememberProjectPackageLocation: (result) => {
      host.rememberScriptEditorProjectPackageLocation(result);
    },
    resetRecordListPages: () => {
      host.resetScriptEditorRecordListPages();
    },
    resetRecordSearch: () => {
      host.resetScriptEditorRecordSearch();
    },
    setSelection: (selection) => {
      host.scriptEditorSelection = selection;
    },
    setAuxiliaryPanelOpen: (isOpen) => {
      host.scriptEditorAuxiliaryPanelOpen = isOpen;
    },
    setPendingDeleteProjectId: (projectId) => {
      host.scriptEditorPendingDeleteProjectId = projectId;
    },
    resetNoticeTimeline: () => {
      host.resetScriptEditorNoticeTimeline();
    },
    recordNotice: (notice) => {
      host.recordScriptEditorNotice(notice);
    },
    setScreen: (screen) => {
      host.setScreen(screen);
    },
    captureRuntimePreviewReturnContext: () =>
      host.captureScriptEditorRuntimePreviewReturnContext(),
    restoreRuntimePreviewReturnContext: (returnContext) => {
      host.restoreScriptEditorRuntimePreviewReturnContext(returnContext);
    },
    getRuntimePreviewSession: () => host.scriptEditorRuntimePreviewSession,
    setRuntimePreviewSession: (session) => {
      host.scriptEditorRuntimePreviewSession = session;
    },
    startLoadedScenarioPack: (scenarioPack) => {
      if (host.onStartLoadedScenarioPack == null) {
        throw new Error("Runtime preview startup is unavailable.");
      }
      return host.onStartLoadedScenarioPack(scenarioPack);
    },
    exitRuntimePreview: () => {
      host.onExitRuntimePreview?.();
    },
  });

  host.scriptEditorWorkflowController = workflowController;

  return {
    host: options.host,
    workflowController,
    async handleClickTarget(target) {
      const scriptEditorActionElement = target.closest("[data-script-editor-action]");
      if (scriptEditorActionElement instanceof HTMLElement) {
        const action = scriptEditorActionElement.dataset.scriptEditorAction;
        if (action != null) {
          await host.handleScriptEditorAction(action, scriptEditorActionElement);
        }
        return true;
      }

      const scriptEditorFamilyElement = target.closest("[data-script-editor-family]");
      if (scriptEditorFamilyElement instanceof HTMLElement) {
        const family = scriptEditorFamilyElement.dataset.scriptEditorFamily;
        const entityId =
          scriptEditorFamilyElement.dataset.scriptEditorEntityId ?? null;
        if (family != null) {
          host.selectScriptEditorFamily(family, entityId);
        }
        return true;
      }

      const scriptEditorRecordElement = target.closest(
        "[data-script-editor-record-id]"
      );
      if (scriptEditorRecordElement instanceof HTMLElement) {
        const recordId = scriptEditorRecordElement.dataset.scriptEditorRecordId;
        if (recordId != null) {
          host.selectScriptEditorRecord(recordId);
        }
        return true;
      }

      return false;
    },
    dispose() {
      if (host.scriptEditorWorkflowController === workflowController) {
        host.scriptEditorWorkflowController = null;
      }
    },
  };
}
