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
  handleChangeTarget(
    target:
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
  ): Promise<boolean>;
  handleInputTarget(target: HTMLInputElement, isComposing: boolean): boolean;
  handleCompositionEndTarget(target: HTMLInputElement): boolean;
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
    async handleChangeTarget(target) {
      if (target.matches("[data-script-editor-project-file]")) {
        const files = Array.from(
          target instanceof HTMLInputElement ? target.files ?? [] : []
        );
        if (target instanceof HTMLInputElement) {
          target.value = "";
        }
        if (files.length === 0) {
          return true;
        }

        await host.handleScriptEditorProjectFileImport(files);
        return true;
      }

      if (target.matches("[data-script-editor-event-field]")) {
        const field = target.dataset.scriptEditorEventField;
        if (
          field === "id" ||
          field === "title" ||
          field === "description" ||
          field === "type" ||
          field === "settlementId" ||
          field === "nextEventId"
        ) {
          host.applyScriptEditorEventField(field, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-building-entry-field]")) {
        const field = target.dataset.scriptEditorBuildingEntryField;
        if (field === "defaultPersonId" || field === "returnTarget") {
          host.applyScriptEditorBuildingEntryField(field, target.value);
        }
        return true;
      }

      return false;
    },
    handleInputTarget(target, isComposing) {
      if (target.matches("[data-script-editor-record-search-family]")) {
        if (isComposing) {
          return true;
        }
        const family = target.dataset.scriptEditorRecordSearchFamily;
        if (family != null) {
          host.setScriptEditorRecordSearchValue(family, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-city-mounted-building-search]")) {
        if (isComposing) {
          return true;
        }
        const buildingIndex = Number.parseInt(
          target.dataset.scriptEditorCityMountedBuildingIndex ?? "-1",
          10
        );
        if (Number.isInteger(buildingIndex) && buildingIndex >= 0) {
          host.setScriptEditorCityMountedBuildingSearchValue(
            buildingIndex,
            target.value
          );
        }
        return true;
      }

      if (target.matches("[data-script-editor-location-access-condition-field]")) {
        const index = Number.parseInt(
          target.dataset.scriptEditorLocationAccessConditionIndex ?? "-1",
          10
        );
        const field = target.dataset.scriptEditorLocationAccessConditionField;
        const conditionScope = target.closest(
          "[data-script-editor-location-access-condition-scope]"
        );
        const conditionField =
          (conditionScope instanceof HTMLElement
            ? conditionScope.dataset.scriptEditorLocationAccessConditionScope
            : null) ??
          "conditionExpression";
        if (
          Number.isInteger(index) &&
          index >= 0 &&
          (field === "literalValue" ||
            field === "personField" ||
            field === "timeField")
        ) {
          host.applyScriptEditorLocationAccessConditionField(
            index,
            field,
            target.value,
            conditionField
          );
        }
        return true;
      }

      if (target.matches("[data-script-editor-settlement-field]")) {
        const field = target.dataset.scriptEditorSettlementField;
        if (field === "title" || field === "nextEventId") {
          host.applyScriptEditorSettlementField(field, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-settlement-content-field]")) {
        const field = target.dataset.scriptEditorSettlementContentField;
        const index = Number.parseInt(
          target.dataset.scriptEditorSettlementContentIndex ?? "-1",
          10
        );
        if (
          (
            field === "targetFamily" ||
            field === "targetId" ||
            field === "attributeKey" ||
            field === "operation" ||
            field === "value"
          ) &&
          Number.isInteger(index) &&
          index >= 0
        ) {
          host.applyScriptEditorSettlementContentField(index, field, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-progress-track-field]")) {
        const field = target.dataset.scriptEditorProgressTrackField;
        if (field === "title" || field === "metricKey" || field === "metricLabel") {
          host.applyScriptEditorProgressTrackField(field, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-progress-track-tier-field]")) {
        const field = target.dataset.scriptEditorProgressTrackTierField;
        const index = Number.parseInt(
          target.dataset.scriptEditorProgressTrackTierIndex ?? "-1",
          10
        );
        if (field === "threshold" && Number.isInteger(index) && index >= 0) {
          host.applyScriptEditorProgressTrackTierField(index, field, target.value);
        }
        return true;
      }

      return false;
    },
    handleCompositionEndTarget(target) {
      if (target.matches("[data-script-editor-record-search-family]")) {
        const family = target.dataset.scriptEditorRecordSearchFamily;
        if (family != null) {
          host.setScriptEditorRecordSearchValue(family, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-city-mounted-building-search]")) {
        const buildingIndex = Number.parseInt(
          target.dataset.scriptEditorCityMountedBuildingIndex ?? "-1",
          10
        );
        if (Number.isInteger(buildingIndex) && buildingIndex >= 0) {
          host.setScriptEditorCityMountedBuildingSearchValue(
            buildingIndex,
            target.value
          );
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
