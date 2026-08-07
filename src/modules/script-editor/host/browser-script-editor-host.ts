import type { ScriptEditorHost } from "./script-editor-host";

export type BrowserScriptEditorHostOptions = ScriptEditorHost;

export function createBrowserScriptEditorHost(
  options: BrowserScriptEditorHostOptions
): ScriptEditorHost {
  return {
    projectStorage: options.projectStorage,
    ...(options.fileSystemHost == null ? {} : { fileSystemHost: options.fileSystemHost }),
    ...(options.previewHost == null ? {} : { previewHost: options.previewHost }),
    ...(options.playableCatalog == null
      ? {}
      : { playableCatalog: options.playableCatalog }),
    ...(options.templateCatalog == null
      ? {}
      : { templateCatalog: options.templateCatalog }),
    ...(options.publicationCatalog == null
      ? {}
      : { publicationCatalog: options.publicationCatalog }),
    ...(options.notify == null ? {} : { notify: options.notify }),
    ...(options.confirm == null ? {} : { confirm: options.confirm }),
  };
}
