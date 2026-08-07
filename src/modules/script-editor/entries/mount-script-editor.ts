import {
  mountScriptEditorSession,
  type MountScriptEditorSessionOptions,
  type ScriptEditorInitialAction,
  type ScriptEditorMountHandle,
} from "../kernel/script-editor-session";

export type MountScriptEditorOptions = MountScriptEditorSessionOptions;

export function mountScriptEditor(
  options: MountScriptEditorOptions
): ScriptEditorMountHandle {
  return mountScriptEditorSession(options);
}
