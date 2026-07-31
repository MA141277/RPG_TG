import type {
  CityBeggingGameCompletionResult,
  CityBeggingMiniGameState,
} from "../../../../domain/city-begging-minigame";
import {
  setCityBeggingMiniGamePointer,
  updateCityBeggingMiniGameState,
} from "./city-begging-minigame";

type CityBeggingDetachedRuntimeSession = {
  launchKey: string;
  state: CityBeggingMiniGameState;
  frameId: number | null;
  root: ParentNode | null;
  syncOverlay: ((root: ParentNode, state: CityBeggingMiniGameState) => void) | null;
  renderOverlay: ((state: CityBeggingMiniGameState) => string) | null;
  pointerCleanup: (() => void) | null;
};

let detachedSession: CityBeggingDetachedRuntimeSession | null = null;
let detachedCompletionResult: CityBeggingGameCompletionResult | null = null;

function cloneState(state: CityBeggingMiniGameState): CityBeggingMiniGameState {
  if (typeof structuredClone === "function") {
    return structuredClone(state);
  }

  return JSON.parse(JSON.stringify(state)) as CityBeggingMiniGameState;
}

function deriveLaunchKey(state: CityBeggingMiniGameState): string {
  return state.variantState.status === "playing"
    ? `${state.variantId}:${state.variantState.startedAtMs}`
    : `${state.variantId}:result`;
}

function syncDetachedPointerFromInput(
  session: CityBeggingDetachedRuntimeSession,
  state: CityBeggingMiniGameState
): void {
  if (
    session.state.variantState.status !== "playing" ||
    state.variantState.status !== "playing" ||
    session.state.variantId !== state.variantId ||
    session.state.variantState.pointerX === state.variantState.pointerX
  ) {
    return;
  }

  session.state = setCityBeggingMiniGamePointer(
    session.state,
    state.variantState.pointerX
  );
}

function replaceOverlayMarkup(
  root: ParentNode,
  renderOverlay: (state: CityBeggingMiniGameState) => string,
  state: CityBeggingMiniGameState
): void {
  const currentOverlay = root.querySelector<HTMLElement>(".c-begging-game");
  if (currentOverlay == null) {
    return;
  }

  currentOverlay.outerHTML = renderOverlay(state);
}

function attachPointerTracking(session: CityBeggingDetachedRuntimeSession): void {
  session.pointerCleanup?.();
  const root = session.root;
  if (!(root instanceof HTMLElement || root instanceof Document)) {
    session.pointerCleanup = null;
    return;
  }

  const pointerHandler = (event: Event) => {
    if (!(event instanceof PointerEvent)) {
      return;
    }

    if (detachedSession !== session || session.state.variantState.status !== "playing") {
      return;
    }

    const canvas = session.root?.querySelector<HTMLCanvasElement>(
      "[data-begging-game-canvas]"
    );
    if (canvas == null) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0) {
      return;
    }

    const normalizedX = (event.clientX - rect.left) / rect.width;
    const pointerX = Math.max(0, Math.min(1, normalizedX)) * canvas.width;
    session.state = setCityBeggingMiniGamePointer(session.state, pointerX);
    session.syncOverlay?.(session.root ?? root, session.state);
  };

  root.addEventListener("pointermove", pointerHandler);
  session.pointerCleanup = () => {
    root.removeEventListener("pointermove", pointerHandler);
  };
}

function scheduleDetachedRuntimeFrame(): void {
  if (
    detachedSession == null ||
    detachedSession.state.variantState.status !== "playing" ||
    detachedSession.frameId != null ||
    typeof window === "undefined"
  ) {
    return;
  }

  detachedSession.frameId = window.requestAnimationFrame((timestamp) => {
    if (detachedSession == null) {
      return;
    }

    detachedSession.frameId = null;
    detachedSession.state = updateCityBeggingMiniGameState(
      detachedSession.state,
      timestamp
    );

    const currentSession = detachedSession;
    const root = currentSession.root;
    if (root != null) {
      if (currentSession.state.variantState.status === "result") {
        detachedCompletionResult = currentSession.state.variantState.result;
        if (currentSession.renderOverlay != null) {
          replaceOverlayMarkup(root, currentSession.renderOverlay, currentSession.state);
        }
      }

      currentSession.syncOverlay?.(root, currentSession.state);
    }

    if (detachedSession?.state.variantState.status === "playing") {
      scheduleDetachedRuntimeFrame();
    }
  });
}

export function readCityBeggingDetachedRuntimeState(): CityBeggingMiniGameState | null {
  return detachedSession?.state ?? null;
}

export function readCityBeggingDetachedCompletionResult(): CityBeggingGameCompletionResult | null {
  if (detachedSession?.state.variantState.status === "result") {
    return detachedSession.state.variantState.result;
  }

  return detachedCompletionResult;
}

export function resetCityBeggingDetachedRuntime(): void {
  if (detachedSession?.frameId != null && typeof window !== "undefined") {
    window.cancelAnimationFrame(detachedSession.frameId);
  }
  detachedSession?.pointerCleanup?.();
  detachedSession = null;
  detachedCompletionResult = null;
}

export function hydrateCityBeggingDetachedRuntime(
  state: CityBeggingMiniGameState
): CityBeggingMiniGameState {
  if (state.variantState.status !== "playing") {
    detachedCompletionResult = state.variantState.result;
    if (detachedSession != null) {
      detachedSession.state = cloneState(state);
    }
    return readCityBeggingDetachedRuntimeState() ?? state;
  }

  const launchKey = deriveLaunchKey(state);
  if (detachedSession?.launchKey !== launchKey) {
    resetCityBeggingDetachedRuntime();
    detachedSession = {
      launchKey,
      state: cloneState(state),
      frameId: null,
      root: null,
      syncOverlay: null,
      renderOverlay: null,
      pointerCleanup: null,
    };
  } else {
    syncDetachedPointerFromInput(detachedSession, state);
  }

  return detachedSession.state;
}

export function advanceCityBeggingDetachedRuntime(
  now: number
): CityBeggingMiniGameState | null {
  if (detachedSession == null) {
    return null;
  }

  if (detachedSession.state.variantState.status !== "playing") {
    return detachedSession.state;
  }

  detachedSession.state = updateCityBeggingMiniGameState(detachedSession.state, now);
  if (detachedSession.state.variantState.status === "result") {
    detachedCompletionResult = detachedSession.state.variantState.result;
  }
  return detachedSession.state;
}

export function bindCityBeggingDetachedRuntime(input: {
  root: ParentNode;
  state: CityBeggingMiniGameState;
  syncOverlay(root: ParentNode, state: CityBeggingMiniGameState): void;
  renderOverlay(state: CityBeggingMiniGameState): string;
}): CityBeggingMiniGameState {
  const activeState = hydrateCityBeggingDetachedRuntime(input.state);
  if (detachedSession == null) {
    return activeState;
  }

  detachedSession.root = input.root;
  detachedSession.syncOverlay = input.syncOverlay;
  detachedSession.renderOverlay = input.renderOverlay;
  attachPointerTracking(detachedSession);

  if (
    detachedSession.state.variantState.status === "result" &&
    input.state.variantState.status !== "result"
  ) {
    replaceOverlayMarkup(input.root, input.renderOverlay, detachedSession.state);
  }

  scheduleDetachedRuntimeFrame();
  return detachedSession.state;
}
