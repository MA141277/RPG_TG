type FrameHandle = number;

type EventTargetRoot = ParentNode & {
  addEventListener?: (
    type: string,
    listener: (event: Event | { clientX?: number }) => void
  ) => void;
  removeEventListener?: (
    type: string,
    listener: (event: Event | { clientX?: number }) => void
  ) => void;
  querySelector?<ElementType extends Element = Element>(
    selectors: string
  ): ElementType | null;
};

type CityBeggingOverlayControllerSession = {
  launchKey: string;
  root: EventTargetRoot;
  frameId: FrameHandle | null;
  pointerCleanup: (() => void) | null;
  onPointer(pointerX: number): void;
  onTick(now: number): void;
  requestAnimationFrame(callback: FrameRequestCallback): FrameHandle;
  cancelAnimationFrame(frameId: FrameHandle): void;
};

let activeSession: CityBeggingOverlayControllerSession | null = null;

function attachPointerTracking(
  session: CityBeggingOverlayControllerSession
): void {
  session.pointerCleanup?.();

  if (
    typeof session.root.addEventListener !== "function" ||
    typeof session.root.removeEventListener !== "function"
  ) {
    session.pointerCleanup = null;
    return;
  }

  const pointerHandler = (event: Event | { clientX?: number }) => {
    if (activeSession !== session) {
      return;
    }

    const canvas = session.root.querySelector?.<HTMLCanvasElement>(
      "[data-begging-game-canvas]"
    );
    if (canvas == null) {
      return;
    }

    const clientX =
      typeof (event as { clientX?: unknown }).clientX === "number"
        ? (event as { clientX: number }).clientX
        : null;
    if (clientX == null) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0) {
      return;
    }

    const normalizedX = (clientX - rect.left) / rect.width;
    const pointerX = Math.max(0, Math.min(1, normalizedX)) * canvas.width;
    session.onPointer(pointerX);
  };

  session.root.addEventListener("pointermove", pointerHandler);
  session.pointerCleanup = () => {
    session.root.removeEventListener?.("pointermove", pointerHandler);
  };
}

function scheduleNextFrame(session: CityBeggingOverlayControllerSession): void {
  if (activeSession !== session || session.frameId != null) {
    return;
  }

  session.frameId = session.requestAnimationFrame((timestamp) => {
    if (activeSession !== session) {
      return;
    }

    session.frameId = null;
    session.onTick(timestamp);
    scheduleNextFrame(session);
  });
}

export function resetCityBeggingOverlayController(): void {
  if (activeSession?.frameId != null) {
    activeSession.cancelAnimationFrame(activeSession.frameId);
  }
  activeSession?.pointerCleanup?.();
  activeSession = null;
}

export function bindCityBeggingOverlayController(input: {
  root: EventTargetRoot;
  launchKey: string;
  isPlaying: boolean;
  onPointer(pointerX: number): void;
  onTick(now: number): void;
  requestAnimationFrame(callback: FrameRequestCallback): FrameHandle;
  cancelAnimationFrame(frameId: FrameHandle): void;
}): void {
  if (!input.isPlaying) {
    resetCityBeggingOverlayController();
    return;
  }

  if (activeSession?.launchKey !== input.launchKey) {
    resetCityBeggingOverlayController();
    activeSession = {
      launchKey: input.launchKey,
      root: input.root,
      frameId: null,
      pointerCleanup: null,
      onPointer: input.onPointer,
      onTick: input.onTick,
      requestAnimationFrame: input.requestAnimationFrame,
      cancelAnimationFrame: input.cancelAnimationFrame,
    };
  } else if (activeSession != null) {
    activeSession.root = input.root;
    activeSession.onPointer = input.onPointer;
    activeSession.onTick = input.onTick;
    activeSession.requestAnimationFrame = input.requestAnimationFrame;
    activeSession.cancelAnimationFrame = input.cancelAnimationFrame;
  }

  if (activeSession == null) {
    return;
  }

  attachPointerTracking(activeSession);
  scheduleNextFrame(activeSession);
}
