import {
  mountScriptEditorSession,
  type MountScriptEditorSessionOptions,
  type ScriptEditorInitialAction,
  type ScriptEditorMountHandle,
} from "../kernel/script-editor-session";

export type OpenScriptEditorOptions = Omit<
  MountScriptEditorSessionOptions,
  "container"
> & {
  mountPoint: HTMLElement;
  initialAction?: ScriptEditorInitialAction;
};

export type ScriptEditorSessionHandle = ScriptEditorMountHandle & {
  close(): void;
};

export async function openScriptEditor(
  options: OpenScriptEditorOptions
): Promise<ScriptEditorSessionHandle> {
  const mountHandle = mountScriptEditorSession({
    host: options.host,
    container: options.mountPoint,
    initialAction: options.initialAction ?? "landing",
  });

  return {
    ...mountHandle,
    close() {
      mountHandle.dispose();
    },
  };
}
