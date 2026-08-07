import {
  createEmbeddedScriptEditorSession,
  type ScriptEditorEmbeddedSession,
} from "../kernel/script-editor-session";

type StandaloneScriptEditorHost = {
  overlayRoot: HTMLElement;
  currentScreen: string;
  scriptEditorSession: ScriptEditorEmbeddedSession | null;
  setScreen(screen: string): void;
  render(): void;
  mount(): void;
  dispose(): void;
};

export function createStandaloneScriptEditorHost(
  mountPoint: HTMLElement
): StandaloneScriptEditorHost {
  const host = {
    overlayRoot: mountPoint,
    currentScreen: "script-editor-landing",
    scriptEditorSession: null,
    setScreen(screen: string) {
      host.currentScreen = screen;
      host.render();
    },
    render() {
      host.captureScriptEditorScrollPosition?.();
      const hasRuntimePreviewSession = host.scriptEditorRuntimePreviewSession != null;
      host.overlayRoot.classList.add("c-main-ui-overlay");
      host.overlayRoot.classList.toggle(
        "is-runtime-preview-active",
        hasRuntimePreviewSession
      );

      const screenMarkup =
        host.currentScreen === "script-editor-landing"
          ? host.renderScriptEditorLanding()
          : host.renderScriptEditorWorkspace();
      const runtimePreviewSessionMarkup = hasRuntimePreviewSession
        ? host.renderRuntimePreviewSessionBanner()
        : "";

      host.overlayRoot.innerHTML = `${screenMarkup}${runtimePreviewSessionMarkup}`;
      host.restoreScriptEditorScrollPosition?.();
    },
    mount() {
      host.scriptEditorSession = createEmbeddedScriptEditorSession({
        host: host as never,
      });

      mountPoint.addEventListener("click", host.handleClick);
      mountPoint.addEventListener("change", host.handleChange);
      mountPoint.addEventListener("input", host.handleInput);
      mountPoint.addEventListener("compositionend", host.handleCompositionEnd);
      host.setScreen("script-editor-landing");
    },
    dispose() {
      mountPoint.removeEventListener("click", host.handleClick);
      mountPoint.removeEventListener("change", host.handleChange);
      mountPoint.removeEventListener("input", host.handleInput);
      mountPoint.removeEventListener("compositionend", host.handleCompositionEnd);
      host.scriptEditorSession?.dispose();
      host.scriptEditorSession = null;
      host.overlayRoot.innerHTML = "";
    },
    handleClick: (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      void host.scriptEditorSession?.handleClickTarget?.(target);
    },
    handleChange: (event: Event) => {
      const target = event.target;
      if (
        !(
          target instanceof HTMLInputElement ||
          target instanceof HTMLSelectElement ||
          target instanceof HTMLTextAreaElement
        )
      ) {
        return;
      }
      void host.scriptEditorSession?.handleChangeTarget?.(target);
    },
    handleInput: (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }
      host.scriptEditorSession?.handleInputTarget?.(
        target,
        (event as InputEvent).isComposing === true
      );
    },
    handleCompositionEnd: (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }
      host.scriptEditorSession?.handleCompositionEndTarget?.(target);
    },
  } as StandaloneScriptEditorHost & Record<string, any>;

  return host;
}
