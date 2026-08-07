import { loadScenarioPackFromFiles } from "../application/script-editor-scenario-pack-codec";
import { createTextImportFilesFromRecord } from "./browser-file-system";
import type { ScriptEditorPreviewHost } from "./script-editor-host";

export type LoadedScenarioPackPreviewHostOptions = {
  onStartLoadedScenarioPack: (
    scenarioPack: unknown
  ) => Promise<"started" | "failed" | string | void>;
  onExitRuntimePreview?: (() => void) | undefined;
};

export function createLoadedScenarioPackPreviewHost(
  options: LoadedScenarioPackPreviewHostOptions
): ScriptEditorPreviewHost {
  return {
    startPreview: async (request) => {
      const scenarioPack = await loadScenarioPackFromFiles(
        createTextImportFilesFromRecord(request.serializedPackFiles)
      );
      const startResult = await options.onStartLoadedScenarioPack(scenarioPack);
      if (startResult === "failed") {
        throw new Error("Runtime preview startup failed.");
      }
      return {
        exit: () => {
          options.onExitRuntimePreview?.();
        },
      };
    },
  };
}
