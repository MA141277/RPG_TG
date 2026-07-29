import type { ScriptEditorHost } from "./script-editor-host";

export type BrowserScriptEditorHostOptions = ScriptEditorHost;

export function createBrowserScriptEditorHost(
  options: BrowserScriptEditorHostOptions
): ScriptEditorHost {
  return {
    projectStorage: options.projectStorage,
    previewRuntime: options.previewRuntime,
    ...(options.notify == null ? {} : { notify: options.notify }),
    ...(options.confirm == null ? {} : { confirm: options.confirm }),
  };
}
