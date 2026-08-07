import {
  mountScriptEditor,
} from "../entries/mount-script-editor";
import { createBrowserScriptEditorHost } from "../host/browser-script-editor-host";

type StandaloneScriptEditorHost = {
  mount(): void;
  dispose(): void;
};

export function createStandaloneScriptEditorHost(
  mountPoint: HTMLElement
): StandaloneScriptEditorHost {
  let mountHandle: ReturnType<typeof mountScriptEditor> | null = null;
  const browserHost = createBrowserScriptEditorHost({
    projectStorage: {
      async createProject() {
        return null;
      },
      async openProject() {
        return null;
      },
    },
  });

  const host = {
    mount() {
      mountHandle?.dispose();
      mountHandle = mountScriptEditor({
        host: browserHost,
        container: mountPoint,
        initialAction: "landing",
      });
    },
    dispose() {
      mountHandle?.dispose();
      mountHandle = null;
    },
  };

  return host;
}
