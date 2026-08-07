import { loadDefaultScriptEditorTemplateProject } from "../application/default-template-project-loader";
import type { ScriptEditorProjectDefinition } from "../domain/script-editor-project";

export type ScriptEditorTemplateCatalog = {
  loadDefaultProject(): Promise<ScriptEditorProjectDefinition>;
};

export function createBuiltinScriptEditorTemplateCatalog(): ScriptEditorTemplateCatalog {
  return {
    loadDefaultProject() {
      return loadDefaultScriptEditorTemplateProject();
    },
  };
}
