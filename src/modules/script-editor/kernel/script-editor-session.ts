import type { ScriptEditorProjectDefinition } from "../domain/script-editor-project";
import type { ScriptEditorFileSystemHost } from "../host/script-editor-file-system-host";
import type { ScriptEditorHost } from "../host/script-editor-host";
import type { ScriptEditorPlayableCatalog } from "../host/script-editor-playable-catalog";
import type { ScriptEditorTemplateCatalog } from "../host/script-editor-template-catalog";
import { installMainUiFlowScriptEditorModule } from "../ui/script-editor-session-ui";
import {
  createScriptEditorWorkflowController,
  type ScriptEditorWorkflowController,
} from "./script-editor-workflow-controller";

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
  fileSystemHost?: ScriptEditorFileSystemHost;
  playableCatalog?: ScriptEditorPlayableCatalog;
  templateCatalog?: ScriptEditorTemplateCatalog;
  previewHost?: ScriptEditorHost["previewHost"];
  setScreen(screen: string): void;
};

export type CreateEmbeddedScriptEditorSessionOptions = {
  host: ScriptEditorEmbeddedSessionHost;
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

type ScriptEditorManagedMountOptions = MountScriptEditorSessionOptions & {
  onExit?: (() => void) | undefined;
};

type ScriptEditorManagedHost = ScriptEditorEmbeddedSessionHost &
  Record<string, any> & {
    overlayRoot: HTMLElement;
    currentScreen: string;
    scriptEditorSession: ScriptEditorEmbeddedSession | null;
    render(): void;
    setScreen(screen: string): void;
    showMainMenu(): void;
    handleClick(event: Event): void;
    handleChange(event: Event): void;
    handleInput(event: Event): void;
    handleCompositionEnd(event: Event): void;
  };

function renderManagedScriptEditorHost(host: ScriptEditorManagedHost) {
  host.captureScriptEditorScrollPosition?.();
  const hasRuntimePreviewSession = host.scriptEditorRuntimePreviewSession != null;
  host.overlayRoot.classList.add("c-main-ui-overlay");
  host.overlayRoot.classList.toggle(
    "is-runtime-preview-active",
    hasRuntimePreviewSession
  );

  const screenMarkup =
    host.currentScreen === "script-editor-landing"
      ? host.renderScriptEditorLanding()
      : host.currentScreen === "runtime-preview"
        ? host.renderRuntimePreviewOverlay()
        : host.renderScriptEditorWorkspace();
  const runtimePreviewSessionMarkup = hasRuntimePreviewSession
    ? host.renderRuntimePreviewSessionBanner()
    : "";

  host.overlayRoot.innerHTML = `${screenMarkup}${runtimePreviewSessionMarkup}`;
  host.restoreScriptEditorScrollPosition?.();
}

function createManagedScriptEditorHost(
  options: ScriptEditorManagedMountOptions
): ScriptEditorManagedHost {
  const host = {
    ...options.host,
    overlayRoot: options.container,
    currentScreen: "script-editor-landing",
    scriptEditorSession: null,
    render() {
      renderManagedScriptEditorHost(host);
    },
    setScreen(screen: string) {
      host.currentScreen = screen;
      host.render();
    },
    showMainMenu() {
      if (typeof options.onExit === "function") {
        options.onExit();
        return;
      }
      host.setScreen("script-editor-landing");
    },
    handleClick(event: Event) {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      event.stopPropagation();
      void host.scriptEditorSession?.handleClickTarget?.(target);
    },
    handleChange(event: Event) {
      const target = event.target;
      if (
        !(
          target instanceof HTMLInputElement ||
          target instanceof HTMLSelectElement ||
          target instanceof HTMLTextAreaElement
        )
      ) {
        return;
      }
      event.stopPropagation();
      void host.scriptEditorSession?.handleChangeTarget?.(target);
    },
    handleInput(event: Event) {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }
      event.stopPropagation();
      host.scriptEditorSession?.handleInputTarget?.(
        target,
        (event as InputEvent).isComposing === true
      );
    },
    handleCompositionEnd(event: Event) {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }
      event.stopPropagation();
      host.scriptEditorSession?.handleCompositionEndTarget?.(target);
    },
  } as ScriptEditorManagedHost;

  installMainUiFlowScriptEditorModule(host);
  host.scriptEditorSession = createEmbeddedScriptEditorSession({ host });
  return host;
}

export function mountScriptEditorSession(
  options: MountScriptEditorSessionOptions
): ScriptEditorMountHandle {
  const initialAction = options.initialAction ?? "landing";
  const managedOptions = options as ScriptEditorManagedMountOptions;
  const managedHost = createManagedScriptEditorHost(managedOptions);
  options.container.dataset.scriptEditorMount = initialAction;
  options.container.addEventListener("click", managedHost.handleClick);
  options.container.addEventListener("change", managedHost.handleChange);
  options.container.addEventListener("input", managedHost.handleInput);
  options.container.addEventListener(
    "compositionend",
    managedHost.handleCompositionEnd
  );

  if (options.initialProject != null) {
    managedHost.commitScriptEditorProject(options.initialProject);
    managedHost.setScreen("script-editor-workspace");
  } else {
    managedHost.setScreen("script-editor-landing");
  }

  if (options.initialProject == null && initialAction !== "landing") {
    queueMicrotask(() => {
      const action =
        initialAction === "new-project"
          ? "new-project"
          : initialAction === "open-project"
            ? "open-project"
            : "use-template";
      void managedHost.handleScriptEditorAction?.(action);
    });
  }

  return {
    host: options.host,
    container: options.container,
    initialProject: options.initialProject ?? null,
    initialAction,
    dispose() {
      options.container.removeEventListener("click", managedHost.handleClick);
      options.container.removeEventListener("change", managedHost.handleChange);
      options.container.removeEventListener("input", managedHost.handleInput);
      options.container.removeEventListener(
        "compositionend",
        managedHost.handleCompositionEnd
      );
      managedHost.scriptEditorSession?.dispose();
      managedHost.scriptEditorSession = null;
      delete options.container.dataset.scriptEditorMount;
      options.container.classList.remove(
        "c-main-ui-overlay",
        "is-runtime-preview-active"
      );
      options.container.innerHTML = "";
    },
  };
}

export function createEmbeddedScriptEditorSession(
  options: CreateEmbeddedScriptEditorSessionOptions
): ScriptEditorEmbeddedSession {
  const host = options.host as Record<string, any>;

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
    getFileSystemHost: () => {
      if (host.fileSystemHost == null) {
        throw new Error("Script editor file-system host is not installed.");
      }
      return host.fileSystemHost;
    },
    getPlayableCatalog: () => host.playableCatalog ?? null,
    getPreviewHost: () => host.previewHost ?? null,
    getTemplateCatalog: () => host.templateCatalog ?? null,
    setScreen: (screen) => {
      host.setScreen(screen);
    },
    getRuntimePreviewSession: () => host.scriptEditorRuntimePreviewSession,
    setRuntimePreviewSession: (session) => {
      host.scriptEditorRuntimePreviewSession = session;
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

      if (target.matches("[data-script-editor-project-field]")) {
        const field = target.dataset.scriptEditorProjectField;
        if (field != null) {
          host.applyScriptEditorProjectField(field, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-startup-field]")) {
        const startupField = target.dataset.scriptEditorStartupField;
        const startupFieldToProjectField: Record<string, string | string[]> = {
          initialView: [
            "scenarioProfile.launchPolicy.initialView",
            "scenarioProfile.initialLocation.view",
          ],
          characterSelection: "scenarioProfile.launchPolicy.characterSelection",
          playerCharacterId: "scenarioProfile.playerCharacterId",
          cityId: "scenarioProfile.initialLocation.cityId",
          houseId: "scenarioProfile.initialLocation.houseId",
        };
        if (startupField == null) {
          return true;
        }
        const fields = startupFieldToProjectField[startupField];
        for (const field of Array.isArray(fields) ? fields : [fields]) {
          if (field == null) {
            continue;
          }
          host.applyScriptEditorProjectField(field, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-person-field]")) {
        const field = target.dataset.scriptEditorPersonField;
        if (field != null) {
          host.applyScriptEditorPersonField(field, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-item-field]")) {
        const field = target.dataset.scriptEditorItemField;
        if (field != null) {
          host.applyScriptEditorItemField(field, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-item-display-field]")) {
        const field = target.dataset.scriptEditorItemDisplayField;
        if (field != null) {
          host.applyScriptEditorItemDisplayField(field, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-item-stack-field]")) {
        const field = target.dataset.scriptEditorItemStackField;
        if (field != null) {
          host.applyScriptEditorItemStackField(field, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-item-custom-property-field]")) {
        const field = target.dataset.scriptEditorItemCustomPropertyField;
        const index = Number.parseInt(
          target.dataset.scriptEditorItemCustomPropertyIndex ?? "-1",
          10
        );
        if (field != null && Number.isInteger(index) && index >= 0) {
          host.applyScriptEditorItemCustomPropertyField(index, field, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-person-attribute-field]")) {
        const field = target.dataset.scriptEditorPersonAttributeField;
        const index = Number.parseInt(
          target.dataset.scriptEditorPersonAttributeIndex ?? "-1",
          10
        );
        if (
          (field === "key-name" || field === "type" || field === "value") &&
          Number.isInteger(index) &&
          index >= 0
        ) {
          host.applyScriptEditorPersonAttributeField(index, field, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-person-attribute-group-field]")) {
        const field = target.dataset.scriptEditorPersonAttributeGroupField;
        const groupId = target.dataset.scriptEditorPersonAttributeGroupId ?? "";
        if (field === "title" && groupId.length > 0) {
          host.applyScriptEditorPersonAttributeGroupField(groupId, field, target.value);
        }
        return true;
      }

      if (
        target instanceof HTMLInputElement &&
        target.matches("[data-script-editor-person-attribute-group-attribute-key]")
      ) {
        const groupId = target.dataset.scriptEditorPersonAttributeGroupId ?? "";
        const attributeKey =
          target.dataset.scriptEditorPersonAttributeGroupAttributeKey ?? "";
        if (groupId.length > 0 && attributeKey.length > 0) {
          host.applyScriptEditorPersonAttributeGroupItem(
            groupId,
            attributeKey,
            target.checked
          );
        }
        return true;
      }

      if (target.matches("[data-script-editor-portrait-field]")) {
        const field = target.dataset.scriptEditorPortraitField;
        if (
          field === "id" ||
          field === "label" ||
          field === "portraitImage" ||
          field === "avatarImage"
        ) {
          host.applyScriptEditorPortraitField(field, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-portrait-variant-field]")) {
        const field = target.dataset.scriptEditorPortraitVariantField;
        if (
          field === "id" ||
          field === "label" ||
          field === "parentPortraitId" ||
          field === "portraitId"
        ) {
          host.applyScriptEditorPortraitVariantField(field, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-person-relation-family]")) {
        const family = target.dataset.scriptEditorPersonRelationFamily;
        const index = Number.parseInt(
          target.dataset.scriptEditorPersonRelationIndex ?? "-1",
          10
        );
        if (
          (family === "dialogueIds" || family === "eventIds") &&
          Number.isInteger(index) &&
          index >= 0
        ) {
          host.applyScriptEditorPersonRelationField(index, family, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-story-field]")) {
        const field = target.dataset.scriptEditorStoryField;
        if (
          field === "id" ||
          field === "title" ||
          field === "chapterId" ||
          field === "summary" ||
          field === "progressMode"
        ) {
          host.applyScriptEditorStoryField(field, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-dialogue-field]")) {
        const field = target.dataset.scriptEditorDialogueField;
        if (
          field === "id" ||
          field === "title" ||
          field === "mode" ||
          field === "textId" ||
          field === "speakerPersonId" ||
          field === "nextEventId"
        ) {
          host.applyScriptEditorDialogueField(field, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-dialogue-cast-field]")) {
        const field = target.dataset.scriptEditorDialogueCastField;
        const index = Number.parseInt(
          target.dataset.scriptEditorDialogueCastIndex ?? "-1",
          10
        );
        if (
          (field === "personId" || field === "side") &&
          Number.isInteger(index) &&
          index >= 0
        ) {
          host.applyScriptEditorDialogueCastField(index, field, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-dialogue-option-field]")) {
        const field = target.dataset.scriptEditorDialogueOptionField;
        const index = Number.parseInt(
          target.dataset.scriptEditorDialogueOptionIndex ?? "-1",
          10
        );
        if (
          (field === "id" || field === "textId" || field === "nextEventId") &&
          Number.isInteger(index) &&
          index >= 0
        ) {
          host.applyScriptEditorDialogueOptionField(index, field, target.value);
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
        if (
          field === "title" ||
          field === "metricKey" ||
          field === "metricLabel" ||
          field === "hostFamily" ||
          field === "allowDemotion"
        ) {
          const nextValue =
            field === "allowDemotion" && target instanceof HTMLInputElement
              ? target.checked
              : target.value;
          host.applyScriptEditorProgressTrackField(field, nextValue);
        }
        return true;
      }

      if (target.matches("[data-script-editor-progress-track-tier-field]")) {
        const field = target.dataset.scriptEditorProgressTrackTierField;
        const index = Number.parseInt(
          target.dataset.scriptEditorProgressTrackTierIndex ?? "-1",
          10
        );
        if (
          ["title", "threshold", "onEnterRepeatPolicy", "targetTierSettlementId"].includes(
            field ?? ""
          ) &&
          Number.isInteger(index) &&
          index >= 0
        ) {
          host.applyScriptEditorProgressTrackTierField(index, field, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-progress-binding-field]")) {
        const field = target.dataset.scriptEditorProgressBindingField;
        if (
          ["trackId", "hostFamily", "hostId", "enabled"].includes(field ?? "")
        ) {
          const nextValue =
            field === "enabled" && target instanceof HTMLInputElement
              ? target.checked
              : target.value;
          host.applyScriptEditorProgressTrackBindingField(field, nextValue);
        }
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

      if (
        target instanceof HTMLInputElement &&
        target.matches("[data-script-editor-event-repeatable]")
      ) {
        host.applyScriptEditorEventRepeatable(target.checked);
        return true;
      }

      if (target.matches("[data-script-editor-event-destination-field]")) {
        const field = target.dataset.scriptEditorEventDestinationField;
        if (field === "family" || field === "targetId") {
          host.applyScriptEditorEventDestinationField(field, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-event-story-node-id]")) {
        host.applyScriptEditorEventStoryNodeId(target.value);
        return true;
      }

      if (target.matches("[data-script-editor-event-preview-field]")) {
        const field = target.dataset.scriptEditorEventPreviewField;
        if (field === "previewNotes" || field === "validationNotes") {
          host.applyScriptEditorEventPreviewField(field, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-event-binding-field]")) {
        const bindingId = target.dataset.scriptEditorEventBindingId;
        const field = target.dataset.scriptEditorEventBindingField;
        if (bindingId != null && (field === "eventId" || field === "priority")) {
          host.applyScriptEditorEventBindingField(bindingId, field, target.value);
        }
        return true;
      }

      if (
        target instanceof HTMLInputElement &&
        target.matches("[data-script-editor-event-binding-enabled]")
      ) {
        const bindingId = target.dataset.scriptEditorEventBindingId;
        if (bindingId != null) {
          host.applyScriptEditorEventBindingField(bindingId, "enabled", target.checked);
        }
        return true;
      }

      if (target.matches("[data-script-editor-event-binding-owner-field]")) {
        const bindingId = target.dataset.scriptEditorEventBindingId;
        const field = target.dataset.scriptEditorEventBindingOwnerField;
        if (bindingId != null && (field === "family" || field === "id")) {
          host.applyScriptEditorEventBindingOwnerField(bindingId, field, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-event-binding-trigger-field]")) {
        const bindingId = target.dataset.scriptEditorEventBindingId;
        const field = target.dataset.scriptEditorEventBindingTriggerField;
        if (bindingId != null && (field === "timing" || field === "action")) {
          host.applyScriptEditorEventBindingTriggerField(bindingId, field, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-event-binding-condition-operator]")) {
        const bindingId = target.dataset.scriptEditorEventBindingId;
        if (bindingId != null) {
          host.applyScriptEditorEventBindingConditionOperator(bindingId, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-event-binding-condition-item-field]")) {
        const bindingId = target.dataset.scriptEditorEventBindingId;
        const field = target.dataset.scriptEditorEventBindingConditionItemField;
        const index = Number.parseInt(
          target.dataset.scriptEditorEventBindingConditionItemIndex ?? "-1",
          10
        );
        if (
          bindingId != null &&
          [
            "type",
            "sourceFamily",
            "field",
            "operator",
            "value",
            "valueType",
            "resolverId",
            "handlerId",
            "payload",
          ].includes(field ?? "") &&
          Number.isInteger(index) &&
          index >= 0
        ) {
          host.applyScriptEditorEventBindingConditionItemField(
            bindingId,
            index,
            field,
            target.value
          );
        }
        return true;
      }

      if (target.matches("[data-script-editor-minigame-field]")) {
        const field = target.dataset.scriptEditorMinigameField;
        if (
          [
            "id",
            "title",
            "description",
            "playableId",
            "integrationId",
            "ownerKind",
            "ownerId",
            "returnPolicy",
            "triggerId",
            "triggerSource",
            "triggerEvent",
            "notes",
          ].includes(field ?? "")
        ) {
          host.applyScriptEditorMinigameField(field, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-minigame-integration]")) {
        host.applyScriptEditorMinigameIntegration(target.value);
        return true;
      }

      if (target.matches("[data-script-editor-minigame-launch-field]")) {
        const field = target.dataset.scriptEditorMinigameLaunchField;
        const index = Number.parseInt(
          target.dataset.scriptEditorMinigameLaunchIndex ?? "-1",
          10
        );
        if ((field === "key" || field === "value") && Number.isInteger(index) && index >= 0) {
          host.applyScriptEditorMinigameLaunchField(index, field, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-minigame-outcome-field]")) {
        const field = target.dataset.scriptEditorMinigameOutcomeField;
        const index = Number.parseInt(
          target.dataset.scriptEditorMinigameOutcomeIndex ?? "-1",
          10
        );
        if (
          ["id", "outcome", "handoffPolicy", "summary", "effectHint"].includes(
            field ?? ""
          ) &&
          Number.isInteger(index) &&
          index >= 0
        ) {
          host.applyScriptEditorMinigameOutcomeField(index, field, target.value);
        }
        return true;
      }

      if (target.matches('[data-script-editor-relation-kind^="story-related-"]')) {
        const relationKind = target.dataset.scriptEditorRelationKind;
        const index = Number.parseInt(
          target.dataset.scriptEditorRelationIndex ?? "-1",
          10
        );
        if (Number.isInteger(index) && index >= 0 && relationKind != null) {
          host.applyScriptEditorStoryRelationField(relationKind, index, target.value);
        }
        return true;
      }

      if (target.matches('[data-script-editor-relation-kind^="event-related-"]')) {
        const relationKind = target.dataset.scriptEditorRelationKind;
        const index = Number.parseInt(
          target.dataset.scriptEditorRelationIndex ?? "-1",
          10
        );
        if (Number.isInteger(index) && index >= 0 && relationKind != null) {
          host.applyScriptEditorEventRelationField(relationKind, index, target.value);
        }
        return true;
      }

      if (
        target instanceof HTMLInputElement &&
        target.matches("[data-script-editor-person-trade-enabled]")
      ) {
        host.applyScriptEditorPersonTradeEnabled(target.checked);
        return true;
      }

      if (target.matches("[data-script-editor-location-field]")) {
        const field = target.dataset.scriptEditorLocationField;
        if (typeof field === "string" && field.length > 0) {
          host.applyScriptEditorLocationField(field, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-city-mounted-building]")) {
        const index = Number.parseInt(
          target.dataset.scriptEditorCityMountedBuildingIndex ?? "-1",
          10
        );
        if (Number.isInteger(index) && index >= 0) {
          host.applyScriptEditorCityMountedBuilding(index, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-building-arrangement-field]")) {
        const arrangementId = target.dataset.scriptEditorBuildingArrangementId ?? "";
        const field = target.dataset.scriptEditorBuildingArrangementField;
        if (
          arrangementId.length > 0 &&
          ["id", "cityId", "buildingId", "displayName", "description", "backgroundId"].includes(
            field ?? ""
          )
        ) {
          host.applyScriptEditorBuildingArrangementField(
            arrangementId,
            field,
            target.value
          );
        }
        return true;
      }

      if (target.matches("[data-script-editor-building-arrangement-npc]")) {
        const arrangementId = target.dataset.scriptEditorBuildingArrangementId ?? "";
        const npcIndex = Number.parseInt(
          target.dataset.scriptEditorBuildingArrangementNpcIndex ?? "-1",
          10
        );
        if (arrangementId.length > 0 && Number.isInteger(npcIndex) && npcIndex >= 0) {
          host.applyScriptEditorBuildingArrangementNpc(
            arrangementId,
            npcIndex,
            target.value
          );
        }
        return true;
      }

      if (target.matches("[data-script-editor-building-arrangement-primary-npc]")) {
        const arrangementId = target.dataset.scriptEditorBuildingArrangementId ?? "";
        if (arrangementId.length > 0) {
          host.applyScriptEditorBuildingArrangementPrimaryNpc(
            arrangementId,
            target.value
          );
        }
        return true;
      }

      if (target.matches("[data-script-editor-building-layout-field]")) {
        const arrangementId = target.dataset.scriptEditorBuildingArrangementId ?? "";
        const field = target.dataset.scriptEditorBuildingLayoutField;
        if (
          arrangementId.length > 0 &&
          ["templateId", "shellClassNames"].includes(field ?? "")
        ) {
          host.applyScriptEditorBuildingLayoutField(arrangementId, field, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-building-layout-node-field]")) {
        const arrangementId = target.dataset.scriptEditorBuildingArrangementId ?? "";
        const nodeIndex = Number.parseInt(
          target.dataset.scriptEditorBuildingLayoutNodeIndex ?? "-1",
          10
        );
        const field = target.dataset.scriptEditorBuildingLayoutNodeField;
        if (
          arrangementId.length > 0 &&
          Number.isInteger(nodeIndex) &&
          nodeIndex >= 0 &&
          [
            "id",
            "kind",
            "regionId",
            "sourceContainerId",
            "sourceContainerType",
            "presentation",
            "characterFilter",
            "actionFilter",
            "clickActionId",
          ].includes(field ?? "")
        ) {
          host.applyScriptEditorBuildingLayoutNodeField(
            arrangementId,
            nodeIndex,
            field,
            target.value
          );
        }
        return true;
      }

      if (target.matches("[data-script-editor-building-container-field]")) {
        const arrangementId = target.dataset.scriptEditorBuildingArrangementId ?? "";
        const containerIndex = Number.parseInt(
          target.dataset.scriptEditorBuildingContainerIndex ?? "-1",
          10
        );
        const field = target.dataset.scriptEditorBuildingContainerField;
        if (
          arrangementId.length > 0 &&
          Number.isInteger(containerIndex) &&
          containerIndex >= 0 &&
          ["id", "type", "title"].includes(field ?? "")
        ) {
          host.applyScriptEditorBuildingContainerField(
            arrangementId,
            containerIndex,
            field,
            target.value
          );
        }
        return true;
      }

      if (
        target instanceof HTMLInputElement &&
        target.matches("[data-script-editor-building-layout-node-flag]")
      ) {
        const arrangementId = target.dataset.scriptEditorBuildingArrangementId ?? "";
        const nodeIndex = Number.parseInt(
          target.dataset.scriptEditorBuildingLayoutNodeIndex ?? "-1",
          10
        );
        const field = target.dataset.scriptEditorBuildingLayoutNodeFlag;
        if (
          arrangementId.length > 0 &&
          Number.isInteger(nodeIndex) &&
          nodeIndex >= 0 &&
          ["previewSelectable", "previewDraggable", "previewDropTarget"].includes(
            field ?? ""
          )
        ) {
          host.applyScriptEditorBuildingLayoutNodeFlag(
            arrangementId,
            nodeIndex,
            field,
            target.checked
          );
        }
        return true;
      }

      if (target.matches("[data-script-editor-city-mounted-building-npc]")) {
        const buildingIndex = Number.parseInt(
          target.dataset.scriptEditorCityMountedBuildingIndex ?? "-1",
          10
        );
        const npcIndex = Number.parseInt(
          target.dataset.scriptEditorCityMountedBuildingNpcIndex ?? "-1",
          10
        );
        if (
          Number.isInteger(buildingIndex) &&
          buildingIndex >= 0 &&
          Number.isInteger(npcIndex) &&
          npcIndex >= 0
        ) {
          host.applyScriptEditorCityMountedBuildingNpc(
            buildingIndex,
            npcIndex,
            target.value
          );
        }
        return true;
      }

      if (target.matches("[data-script-editor-city-primary-npc]")) {
        const buildingIndex = Number.parseInt(
          target.dataset.scriptEditorCityMountedBuildingIndex ?? "-1",
          10
        );
        if (Number.isInteger(buildingIndex) && buildingIndex >= 0) {
          host.applyScriptEditorCityMountedBuildingPrimaryNpc(
            buildingIndex,
            target.value
          );
        }
        return true;
      }

      if (target.matches("[data-script-editor-location-menu-field]")) {
        const field = target.dataset.scriptEditorLocationMenuField;
        const instanceId = target.dataset.scriptEditorLocationMenuInstanceId ?? "";
        const index = Number.parseInt(
          target.dataset.scriptEditorLocationMenuIndex ?? "-1",
          10
        );
        if (
          ["id", "label", "menuFamily", "targetFamily", "targetId", "disabledHint"].includes(
            field ?? ""
          ) &&
          instanceId.length > 0 &&
          Number.isInteger(index) &&
          index >= 0
        ) {
          host.applyScriptEditorLocationMenuField(instanceId, index, field, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-location-menu-instance-field]")) {
        const field = target.dataset.scriptEditorLocationMenuInstanceField;
        const instanceId = target.dataset.scriptEditorLocationMenuInstanceId ?? "";
        if (field === "title" && instanceId.length > 0) {
          host.applyScriptEditorLocationMenuInstanceField(instanceId, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-location-menu-resource-field]")) {
        const field = target.dataset.scriptEditorLocationMenuResourceField;
        const resourceId = target.dataset.scriptEditorLocationMenuResourceId ?? "";
        if (field === "title" && resourceId.length > 0) {
          host.applyScriptEditorLocationMenuResourceField(resourceId, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-location-attribute-field]")) {
        const field = target.dataset.scriptEditorLocationAttributeField;
        const index = Number.parseInt(
          target.dataset.scriptEditorLocationAttributeIndex ?? "-1",
          10
        );
        if (
          (
            field === "key" ||
            field === "label" ||
            field === "type" ||
            field === "value" ||
            field === "options"
          ) &&
          Number.isInteger(index) &&
          index >= 0
        ) {
          host.applyScriptEditorLocationAttributeField(index, field, target.value);
        }
        return true;
      }

      if (
        target instanceof HTMLInputElement &&
        target.matches("[data-script-editor-location-menu-flag]")
      ) {
        const field = target.dataset.scriptEditorLocationMenuFlag;
        const instanceId = target.dataset.scriptEditorLocationMenuInstanceId ?? "";
        const index = Number.parseInt(
          target.dataset.scriptEditorLocationMenuIndex ?? "-1",
          10
        );
        if (
          (field === "isVisible" || field === "isEnabled") &&
          instanceId.length > 0 &&
          Number.isInteger(index) &&
          index >= 0
        ) {
          host.applyScriptEditorLocationMenuFlag(
            instanceId,
            index,
            field,
            target.checked
          );
        }
        return true;
      }

      if (target.matches("[data-script-editor-location-access-field]")) {
        const field = target.dataset.scriptEditorLocationAccessField;
        if (
          field === "blockedDialogueId" ||
          field === "conditionExpression" ||
          field === "leaveConditionExpression"
        ) {
          host.applyScriptEditorLocationAccessField(field, target.value);
        }
        return true;
      }

      if (target.matches("[data-script-editor-location-access-condition-field]")) {
        const index = Number.parseInt(
          target.dataset.scriptEditorLocationAccessConditionIndex ?? "-1",
          10
        );
        const field = target.dataset.scriptEditorLocationAccessConditionField;
        if (
          Number.isInteger(index) &&
          index >= 0 &&
          (field === "factor" ||
            field === "eventId" ||
            field === "eventState" ||
            field === "personId" ||
            field === "personField" ||
            field === "timeField" ||
            field === "sourceField" ||
            field === "operator" ||
            field === "literalValue")
        ) {
          const conditionScope = target.closest(
            "[data-script-editor-location-access-condition-scope]"
          );
          const conditionField =
            (conditionScope instanceof HTMLElement
              ? conditionScope.dataset.scriptEditorLocationAccessConditionScope
              : null) ?? "conditionExpression";
          host.applyScriptEditorLocationAccessConditionField(
            index,
            field,
            target.value,
            conditionField
          );
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
