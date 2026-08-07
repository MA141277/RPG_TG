import { loadDefaultScriptEditorTemplateProject } from "../application/default-template-project-loader";
import type { ScriptEditorProjectDefinition } from "../domain/script-editor-project";

export type ScriptEditorTemplateCatalog = {
  loadDefaultProject(): Promise<ScriptEditorProjectDefinition>;
};

let defaultScriptEditorTemplateCatalog: ScriptEditorTemplateCatalog | null = null;

export function createBuiltinScriptEditorTemplateCatalog(): ScriptEditorTemplateCatalog {
  return {
    loadDefaultProject() {
      return loadDefaultScriptEditorTemplateProject();
    },
  };
}

export function setDefaultScriptEditorTemplateCatalog(
  templateCatalog: ScriptEditorTemplateCatalog
): void {
  defaultScriptEditorTemplateCatalog = templateCatalog;
}

export function resolveScriptEditorTemplateCatalog(
  templateCatalog?: ScriptEditorTemplateCatalog | null
): ScriptEditorTemplateCatalog {
  return (
    templateCatalog ??
    defaultScriptEditorTemplateCatalog ??
    createBuiltinScriptEditorTemplateCatalog()
  );
}
