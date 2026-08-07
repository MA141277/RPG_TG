import {
  createBuiltinScriptEditorPublicationCatalog,
} from "../../modules/script-editor/host/script-editor-publication-catalog";

const builtinScriptEditorPublicationCatalog =
  createBuiltinScriptEditorPublicationCatalog();

export function loadRegisteredScenarioPackFromUrl(
  url: string
) {
  return builtinScriptEditorPublicationCatalog.loadScenarioPackFromUrl(url);
}

export function getRegisteredBuiltinTemplateManifestUrl(): string {
  return builtinScriptEditorPublicationCatalog.getBuiltinTemplateManifestUrl();
}
