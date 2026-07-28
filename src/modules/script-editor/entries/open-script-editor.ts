import type { ScriptEditorHost } from "../host/script-editor-host";
import {
  mountScriptEditor,
  type ScriptEditorInitialAction,
  type ScriptEditorMountHandle,
} from "./mount-script-editor";

export type OpenScriptEditorOptions = {
  host: ScriptEditorHost;
  mountPoint: HTMLElement;
  initialAction?: ScriptEditorInitialAction;
};

export type ScriptEditorSessionHandle = ScriptEditorMountHandle & {
  close(): void;
};

export async function openScriptEditor(
  options: OpenScriptEditorOptions
): Promise<ScriptEditorSessionHandle> {
  const mountHandle = mountScriptEditor({
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
