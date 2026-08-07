import type {
  PlayableDefinition,
  PlayableIntegrationDefinition,
} from "../application/script-editor-playable-runtime-contract";
import {
  builtinPlayableDefinitionRegistry,
} from "../../../core/registry/builtin-playable-definition-registry";
import {
  builtinPlayableIntegrationRegistry,
} from "../../../core/registry/builtin-playable-integration-registry";
import {
  builtinPlayableShellRegistry,
} from "../../../core/registry/builtin-playable-shell-registry";

export type ScriptEditorPlayableCatalog = {
  getPlayableDefinition(playableId: string): PlayableDefinition | null;
  listPlayableDefinitions(): PlayableDefinition[];
  listPlayableIntegrations(): PlayableIntegrationDefinition[];
  hasPlayableShell(playableId: string): boolean;
};

let defaultScriptEditorPlayableCatalog: ScriptEditorPlayableCatalog | null = null;

export function createBuiltinScriptEditorPlayableCatalog(): ScriptEditorPlayableCatalog {
  return {
    getPlayableDefinition(playableId) {
      return builtinPlayableDefinitionRegistry.get(playableId) ?? null;
    },
    listPlayableDefinitions() {
      return Array.from(builtinPlayableDefinitionRegistry.entries());
    },
    listPlayableIntegrations() {
      return Array.from(builtinPlayableIntegrationRegistry.entries());
    },
    hasPlayableShell(playableId) {
      return builtinPlayableShellRegistry.get(playableId) != null;
    },
  };
}

export function setDefaultScriptEditorPlayableCatalog(
  playableCatalog: ScriptEditorPlayableCatalog
): void {
  defaultScriptEditorPlayableCatalog = playableCatalog;
}

export function resolveScriptEditorPlayableCatalog(
  playableCatalog?: ScriptEditorPlayableCatalog | null
): ScriptEditorPlayableCatalog {
  return (
    playableCatalog ??
    defaultScriptEditorPlayableCatalog ??
    createBuiltinScriptEditorPlayableCatalog()
  );
}
