import type { ScriptEditorProjectDefinition } from "../domain/script-editor-project";
import type { ScriptEditorHost } from "../host/script-editor-host";

export type ScriptEditorInitialAction =
  | "landing"
  | "new-project"
  | "open-project"
  | "use-template";

export type MountScriptEditorOptions = {
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

export function mountScriptEditor(
  options: MountScriptEditorOptions
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
