type HouseSortableTileRuntimeTimingApi = {
  setTimeout: typeof globalThis.setTimeout;
  clearTimeout: typeof globalThis.clearTimeout;
  now(): number;
};

export type HouseSortableTileRuntimeDependencies = {
  appElement: HTMLElement;
  dispatchReorderAction(actionId: string): void;
  longPressMs?: number;
  clickSuppressionMs?: number;
  timingApi?: HouseSortableTileRuntimeTimingApi;
};

export type HouseSortableTileRuntimeHandle = {
  destroy(): void;
};

type SortableRoot = HTMLElement & {
  dataset: DOMStringMap & {
    houseDropActionPrefix?: string;
    houseSortEnabled?: string;
    houseHoverLiftEnabled?: string;
  };
};

type SortableTile = HTMLElement & {
  dataset: DOMStringMap & {
    houseDragPayload?: string;
    houseDropBefore?: string;
  };
};

type PendingPressState = {
  pointerId: number;
  payload: string;
  actionPrefix: string;
  root: SortableRoot;
  sourceTile: SortableTile;
  startClientX: number;
  startClientY: number;
  currentClientX: number;
  currentClientY: number;
  restingBeforeId: string | null;
  timeoutId: ReturnType<typeof globalThis.setTimeout>;
};

type ActiveDragState = {
  pointerId: number;
  payload: string;
  actionPrefix: string;
  root: SortableRoot;
  sourceTile: SortableTile;
  placeholderTile: SortableTile;
  ghostTile: SortableTile;
  ghostHost: HTMLElement;
  ghostUsesViewportCoordinates: boolean;
  sourceDisplay: string;
  offsetX: number;
  offsetY: number;
  restingBeforeId: string | null;
  currentBeforeId: string | null;
};

const DEFAULT_LONG_PRESS_MS = 140;
const DEFAULT_CLICK_SUPPRESSION_MS = 250;
const DRAG_SETTLE_MS = 180;
const DRAG_SETTLE_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
const HOVER_LIFT_CLASS_NAME = "is-house-hover-lifted";
const DRAG_ORIGIN_CLASS_NAME = "is-house-drag-origin";
const DRAG_GHOST_CLASS_NAME = "is-house-drag-ghost";
const PLACEHOLDER_CLASS_NAME = "is-house-drop-placeholder";
const CLONE_TRANSIENT_CLASS_NAMES = ["is-entering", "is-dropping"] as const;
const SORTABLE_TILE_SELECTOR =
  "[data-house-sortable-tile='true'][data-house-drag-payload]";
const DROP_TARGET_SELECTOR = "[data-house-drop-before]";
const DROP_ROOT_SELECTOR = "[data-house-drop-action-prefix]";
const HOUSE_ACTION_SELECTOR = "[data-house-action]";

function createDefaultTimingApi(): HouseSortableTileRuntimeTimingApi {
  return {
    setTimeout: globalThis.setTimeout.bind(globalThis),
    clearTimeout: globalThis.clearTimeout.bind(globalThis),
    now() {
      return globalThis.performance?.now() ?? Date.now();
    },
  };
}

function isElementLike(value: unknown): value is HTMLElement {
  return (
    typeof value === "object" &&
    value != null &&
    "closest" in value &&
    "querySelectorAll" in value &&
    "classList" in value &&
    "style" in value
  );
}

function toSortableRoot(value: unknown): SortableRoot | null {
  return isElementLike(value) ? (value as SortableRoot) : null;
}

function toSortableTile(value: unknown): SortableTile | null {
  return isElementLike(value) ? (value as SortableTile) : null;
}

function isSortEnabled(root: SortableRoot): boolean {
  const rawValue = root.dataset.houseSortEnabled;
  return rawValue == null || rawValue === "" || rawValue === "true";
}

function isHoverLiftEnabled(root: SortableRoot): boolean {
  const rawValue = root.dataset.houseHoverLiftEnabled;
  if (rawValue == null || rawValue === "") {
    return isSortEnabled(root);
  }
  return rawValue === "true";
}

function resolveSortableRoot(target: EventTarget | null): SortableRoot | null {
  if (!isElementLike(target)) {
    return null;
  }
  return toSortableRoot(target.closest(DROP_ROOT_SELECTOR));
}

function resolveSortableTile(target: EventTarget | null): SortableTile | null {
  if (!isElementLike(target)) {
    return null;
  }
  return toSortableTile(target.closest(SORTABLE_TILE_SELECTOR));
}

function readDropTargets(
  root: SortableRoot,
  excludedTiles: Set<SortableTile>
): SortableTile[] {
  return [...root.querySelectorAll<SortableTile>(DROP_TARGET_SELECTOR)].filter(
    (candidateTile) =>
      candidateTile.dataset.houseDropBefore !== "end" &&
      !excludedTiles.has(candidateTile)
  );
}

function resolveRestingBeforeId(
  root: SortableRoot,
  sourceTile: SortableTile
): string | null {
  const targets = readDropTargets(root, new Set());
  const sourceIndex = targets.indexOf(sourceTile);
  if (sourceIndex < 0 || sourceIndex >= targets.length - 1) {
    return null;
  }
  return targets[sourceIndex + 1]?.dataset.houseDropBefore ?? null;
}

function createGhostTile(
  sourceTile: SortableTile,
  usesViewportCoordinates: boolean
): SortableTile {
  const ghostTile = sourceTile.cloneNode(true) as SortableTile;
  ghostTile.removeAttribute("data-house-action");
  ghostTile.removeAttribute("data-house-sortable-tile");
  ghostTile.removeAttribute("data-house-drag-payload");
  ghostTile.removeAttribute("data-house-drop-before");
  ghostTile.classList.remove(
    DRAG_ORIGIN_CLASS_NAME,
    PLACEHOLDER_CLASS_NAME,
    ...CLONE_TRANSIENT_CLASS_NAMES
  );
  resetCloneTilePresentation(ghostTile);
  ghostTile.classList.add(HOVER_LIFT_CLASS_NAME);
  ghostTile.classList.add(DRAG_GHOST_CLASS_NAME);
  ghostTile.style.position = usesViewportCoordinates ? "fixed" : "absolute";
  ghostTile.style.pointerEvents = "none";
  ghostTile.style.left = "0px";
  ghostTile.style.top = "0px";
  ghostTile.style.margin = "0";
  ghostTile.style.zIndex = "9999";
  return ghostTile;
}

function createPlaceholderTile(sourceTile: SortableTile): SortableTile {
  const placeholderTile = sourceTile.cloneNode(true) as SortableTile;
  placeholderTile.removeAttribute("data-house-action");
  placeholderTile.removeAttribute("data-house-sortable-tile");
  placeholderTile.removeAttribute("data-house-drag-payload");
  placeholderTile.removeAttribute("data-house-drop-before");
  placeholderTile.classList.remove(
    HOVER_LIFT_CLASS_NAME,
    DRAG_ORIGIN_CLASS_NAME,
    DRAG_GHOST_CLASS_NAME,
    ...CLONE_TRANSIENT_CLASS_NAMES
  );
  resetCloneTilePresentation(placeholderTile);
  placeholderTile.classList.add(PLACEHOLDER_CLASS_NAME);
  placeholderTile.setAttribute("aria-hidden", "true");
  placeholderTile.style.pointerEvents = "none";
  placeholderTile.style.opacity = "0.38";
  if ("disabled" in placeholderTile) {
    (placeholderTile as HTMLButtonElement).disabled = true;
  }
  return placeholderTile;
}

function positionGhostTile(
  ghostTile: SortableTile,
  ghostHost: HTMLElement,
  usesViewportCoordinates: boolean,
  clientX: number,
  clientY: number,
  offsetX: number,
  offsetY: number
): void {
  const hostRect = usesViewportCoordinates
    ? { left: 0, top: 0 }
    : ghostHost.getBoundingClientRect();
  ghostTile.style.left = `${clientX - offsetX - hostRect.left}px`;
  ghostTile.style.top = `${clientY - offsetY - hostRect.top}px`;
}

function resetCloneTilePresentation(tile: SortableTile): void {
  tile.style.position = "";
  tile.style.left = "";
  tile.style.top = "";
  tile.style.transition = "";
  tile.style.animation = "";
}

function movePlaceholderTile(
  root: SortableRoot,
  placeholderTile: SortableTile,
  sourceTile: SortableTile,
  beforeId: string | null,
  animateReorderedTiles: (
    tiles: SortableTile[],
    beforeRects: Map<
      SortableTile,
      DOMRect | ReturnType<SortableTile["getBoundingClientRect"]>
    >
  ) => void
): void {
  const isMountingPlaceholder = placeholderTile.parentElement == null;
  const referenceTile =
    beforeId == null
      ? null
      : readDropTargets(root, new Set([sourceTile, placeholderTile])).find(
          (candidateTile) =>
            candidateTile.dataset.houseDropBefore === beforeId
        ) ?? null;
  if (isMountingPlaceholder) {
    root.insertBefore(placeholderTile, referenceTile);
    return;
  }
  const animatedTiles = [
    placeholderTile,
    ...readDropTargets(root, new Set([sourceTile, placeholderTile])),
  ];
  const beforeRects = new Map<
    SortableTile,
    DOMRect | ReturnType<SortableTile["getBoundingClientRect"]>
  >();
  for (const tile of animatedTiles) {
    beforeRects.set(tile, tile.getBoundingClientRect());
  }
  root.insertBefore(placeholderTile, referenceTile);
  animateReorderedTiles(animatedTiles, beforeRects);
}

function resolveCurrentBeforeId(
  root: SortableRoot,
  sourceTile: SortableTile,
  placeholderTile: SortableTile,
  clientX: number,
  clientY: number
): string | null {
  const tiles = readDropTargets(
    root,
    new Set([sourceTile, placeholderTile])
  );
  for (const tile of tiles) {
    const rect = tile.getBoundingClientRect();
    const midpoint = rect.left + rect.width / 2;
    if (clientX < midpoint) {
      return tile.dataset.houseDropBefore ?? null;
    }
  }
  return null;
}

function resolveDropReferenceTile(
  root: SortableRoot,
  sourceTile: SortableTile,
  placeholderTile: SortableTile | null,
  beforeId: string | null
): SortableTile | null {
  if (beforeId == null) {
    return null;
  }
  return (
    readDropTargets(
      root,
      new Set(
        placeholderTile == null
          ? [sourceTile]
          : [sourceTile, placeholderTile]
      )
    ).find(
      (candidateTile) => candidateTile.dataset.houseDropBefore === beforeId
    ) ?? null
  );
}

function resolveGhostHost(
  root: SortableRoot,
  appElement: HTMLElement
): HTMLElement {
  return (
    (root.parentElement as HTMLElement | null) ??
    (root.ownerDocument?.body ?? appElement)
  );
}

function usesViewportGhostCoordinates(ghostHost: HTMLElement): boolean {
  return ghostHost === ghostHost.ownerDocument?.body;
}

export function mountHouseSortableTileRuntime(
  input: HouseSortableTileRuntimeDependencies
): HouseSortableTileRuntimeHandle {
  const {
    appElement,
    dispatchReorderAction,
    longPressMs = DEFAULT_LONG_PRESS_MS,
    clickSuppressionMs = DEFAULT_CLICK_SUPPRESSION_MS,
    timingApi = createDefaultTimingApi(),
  } = input;

  let hoveredTile: SortableTile | null = null;
  let pendingPress: PendingPressState | null = null;
  let activeDrag: ActiveDragState | null = null;
  let settlingDrag: ActiveDragState | null = null;
  let settlingTimeoutId: ReturnType<typeof globalThis.setTimeout> | null = null;
  const tileAnimationCleanupTimeouts = new Map<
    SortableTile,
    ReturnType<typeof globalThis.setTimeout>
  >();
  let suppressClickUntilMs = 0;

  function clearHoveredTile(): void {
    hoveredTile?.classList.remove(HOVER_LIFT_CLASS_NAME);
    hoveredTile = null;
  }

  function applyHoveredTile(tile: SortableTile | null): void {
    if (hoveredTile === tile) {
      return;
    }
    hoveredTile?.classList.remove(HOVER_LIFT_CLASS_NAME);
    hoveredTile = null;
    if (tile == null) {
      return;
    }
    hoveredTile = tile;
    hoveredTile.classList.add(HOVER_LIFT_CLASS_NAME);
  }

  function clearPendingPress(): void {
    if (pendingPress == null) {
      return;
    }
    timingApi.clearTimeout(pendingPress.timeoutId);
    pendingPress = null;
  }

  function animateReorderedTiles(
    tiles: SortableTile[],
    beforeRects: Map<
      SortableTile,
      DOMRect | ReturnType<SortableTile["getBoundingClientRect"]>
    >
  ): void {
    for (const tile of tiles) {
      const beforeRect = beforeRects.get(tile);
      if (beforeRect == null) {
        continue;
      }
      const afterRect = tile.getBoundingClientRect();
      const deltaX = beforeRect.left - afterRect.left;
      const deltaY = beforeRect.top - afterRect.top;
      if (deltaX === 0 && deltaY === 0) {
        continue;
      }
      const existingTimeoutId = tileAnimationCleanupTimeouts.get(tile);
      if (existingTimeoutId != null) {
        timingApi.clearTimeout(existingTimeoutId);
      }
      tile.style.position = "relative";
      tile.style.transition = "none";
      tile.style.left = `${deltaX}px`;
      tile.style.top = `${deltaY}px`;
      tile.getBoundingClientRect();
      tile.style.transition = `left ${DRAG_SETTLE_MS}ms ${DRAG_SETTLE_EASING}, top ${DRAG_SETTLE_MS}ms ${DRAG_SETTLE_EASING}`;
      tile.style.left = "0px";
      tile.style.top = "0px";
      const cleanupTimeoutId = timingApi.setTimeout(() => {
        tile.style.transition = "";
        tile.style.left = "";
        tile.style.top = "";
        tileAnimationCleanupTimeouts.delete(tile);
      }, DRAG_SETTLE_MS);
      tileAnimationCleanupTimeouts.set(tile, cleanupTimeoutId);
    }
  }

  function clearTileAnimationState(): void {
    for (const [tile, timeoutId] of tileAnimationCleanupTimeouts.entries()) {
      timingApi.clearTimeout(timeoutId);
      tile.style.transition = "";
      tile.style.left = "";
      tile.style.top = "";
      tileAnimationCleanupTimeouts.delete(tile);
    }
  }

  function finishDragCleanup(
    dragState: ActiveDragState | null,
    applyCurrentSlot: boolean
  ): ActiveDragState | null {
    if (dragState == null) {
      return null;
    }
    if (applyCurrentSlot) {
      const referenceTile = resolveDropReferenceTile(
        dragState.root,
        dragState.sourceTile,
        dragState.placeholderTile,
        dragState.currentBeforeId
      );
      dragState.root.insertBefore(dragState.sourceTile, referenceTile);
    }
    dragState.placeholderTile.remove();
    dragState.ghostTile.remove();
    dragState.sourceTile.classList.remove(DRAG_ORIGIN_CLASS_NAME);
    dragState.sourceTile.style.display = dragState.sourceDisplay;
    return dragState;
  }

  function cleanupActiveDragState(): ActiveDragState | null {
    clearHoveredTile();
    clearTileAnimationState();
    const currentDrag = activeDrag;
    activeDrag = null;
    return finishDragCleanup(currentDrag, false);
  }

  function cleanupSettlingDragState(): ActiveDragState | null {
    if (settlingTimeoutId != null) {
      timingApi.clearTimeout(settlingTimeoutId);
      settlingTimeoutId = null;
    }
    clearTileAnimationState();
    const currentDrag = settlingDrag;
    settlingDrag = null;
    return finishDragCleanup(
      currentDrag,
      currentDrag != null &&
        currentDrag.currentBeforeId !== currentDrag.restingBeforeId
    );
  }

  function startDragFromPendingPress(press: PendingPressState): void {
    if (pendingPress !== press) {
      return;
    }
    pendingPress = null;
    clearHoveredTile();
    const sourceRect = press.sourceTile.getBoundingClientRect();
    const activationClientX = press.currentClientX;
    const activationClientY = press.currentClientY;
    const ghostHost = resolveGhostHost(press.root, appElement);
    const ghostUsesViewportCoordinates =
      usesViewportGhostCoordinates(ghostHost);
    const ghostTile = createGhostTile(
      press.sourceTile,
      ghostUsesViewportCoordinates
    );
    const placeholderTile = createPlaceholderTile(press.sourceTile);
    const sourceDisplay = press.sourceTile.style.display ?? "";
    const offsetX = press.startClientX - sourceRect.left;
    const offsetY = press.startClientY - sourceRect.top;
    const currentBeforeId = resolveCurrentBeforeId(
      press.root,
      press.sourceTile,
      placeholderTile,
      activationClientX,
      activationClientY
    );
    press.sourceTile.classList.add(DRAG_ORIGIN_CLASS_NAME);
    press.sourceTile.style.display = "none";
    positionGhostTile(
      ghostTile,
      ghostHost,
      ghostUsesViewportCoordinates,
      activationClientX,
      activationClientY,
      offsetX,
      offsetY
    );
    ghostHost.appendChild(ghostTile);
    movePlaceholderTile(
      press.root,
      placeholderTile,
      press.sourceTile,
      currentBeforeId,
      animateReorderedTiles
    );
    activeDrag = {
      pointerId: press.pointerId,
      payload: press.payload,
      actionPrefix: press.actionPrefix,
      root: press.root,
      sourceTile: press.sourceTile,
      placeholderTile,
      ghostTile,
      ghostHost,
      ghostUsesViewportCoordinates,
      sourceDisplay,
      offsetX,
      offsetY,
      restingBeforeId: press.restingBeforeId,
      currentBeforeId,
    };
  }

  function handleMouseOver(event: MouseEvent): void {
    if (activeDrag != null || pendingPress != null || settlingDrag != null) {
      return;
    }
    const root = resolveSortableRoot(event.target);
    const tile = resolveSortableTile(event.target);
    if (root == null || tile == null || !isHoverLiftEnabled(root)) {
      return;
    }
    applyHoveredTile(tile);
  }

  function handleMouseOut(event: MouseEvent): void {
    if (hoveredTile == null) {
      return;
    }
    const currentTile = resolveSortableTile(event.target);
    if (currentTile == null || currentTile !== hoveredTile) {
      return;
    }
    if (
      isElementLike(event.relatedTarget) &&
      hoveredTile.contains(event.relatedTarget)
    ) {
      return;
    }
    clearHoveredTile();
  }

  function handlePointerDown(event: PointerEvent): void {
    if (event.button !== 0 || activeDrag != null || settlingDrag != null) {
      return;
    }
    const root = resolveSortableRoot(event.target);
    const tile = resolveSortableTile(event.target);
    if (root == null || tile == null || !isSortEnabled(root)) {
      clearPendingPress();
      return;
    }
    const payload = tile.dataset.houseDragPayload;
    const actionPrefix = root.dataset.houseDropActionPrefix;
    if (payload == null || actionPrefix == null) {
      clearPendingPress();
      return;
    }
    clearPendingPress();
    const pendingState: PendingPressState = {
      pointerId: event.pointerId,
      payload,
      actionPrefix,
      root,
      sourceTile: tile,
      startClientX: event.clientX,
      startClientY: event.clientY,
      currentClientX: event.clientX,
      currentClientY: event.clientY,
      restingBeforeId: resolveRestingBeforeId(root, tile),
      timeoutId: timingApi.setTimeout(() => {
        startDragFromPendingPress(pendingState);
      }, longPressMs),
    };
    pendingPress = pendingState;
  }

  function handlePointerMove(event: PointerEvent): void {
    if (pendingPress != null && activeDrag == null) {
      if (pendingPress.pointerId !== event.pointerId) {
        return;
      }
      pendingPress.currentClientX = event.clientX;
      pendingPress.currentClientY = event.clientY;
      return;
    }
    if (activeDrag == null || activeDrag.pointerId !== event.pointerId) {
      return;
    }
    positionGhostTile(
      activeDrag.ghostTile,
      activeDrag.ghostHost,
      activeDrag.ghostUsesViewportCoordinates,
      event.clientX,
      event.clientY,
      activeDrag.offsetX,
      activeDrag.offsetY
    );
    const nextBeforeId = resolveCurrentBeforeId(
      activeDrag.root,
      activeDrag.sourceTile,
      activeDrag.placeholderTile,
      event.clientX,
      event.clientY
    );
    if (nextBeforeId === activeDrag.currentBeforeId) {
      return;
    }
    activeDrag.currentBeforeId = nextBeforeId;
    movePlaceholderTile(
      activeDrag.root,
      activeDrag.placeholderTile,
      activeDrag.sourceTile,
      nextBeforeId,
      animateReorderedTiles
    );
  }

  function handlePointerUp(event: PointerEvent): void {
    if (pendingPress != null && pendingPress.pointerId === event.pointerId) {
      clearPendingPress();
      return;
    }
    if (activeDrag == null || activeDrag.pointerId !== event.pointerId) {
      return;
    }
    clearHoveredTile();
    const completedDrag = activeDrag;
    activeDrag = null;
    settlingDrag = completedDrag;
    suppressClickUntilMs = timingApi.now() + clickSuppressionMs;
    const placeholderRect = completedDrag.placeholderTile.getBoundingClientRect();
    const ghostHostRect = completedDrag.ghostUsesViewportCoordinates
      ? { left: 0, top: 0 }
      : completedDrag.ghostHost.getBoundingClientRect();
    completedDrag.ghostTile.style.transition = [
      `left ${DRAG_SETTLE_MS}ms ${DRAG_SETTLE_EASING}`,
      `top ${DRAG_SETTLE_MS}ms ${DRAG_SETTLE_EASING}`,
      `transform ${DRAG_SETTLE_MS}ms ${DRAG_SETTLE_EASING}`,
    ].join(", ");
    completedDrag.ghostTile.style.left = `${
      placeholderRect.left - ghostHostRect.left
    }px`;
    completedDrag.ghostTile.style.top = `${
      placeholderRect.top - ghostHostRect.top
    }px`;
    completedDrag.ghostTile.style.transform = "translateY(0px)";
    settlingTimeoutId = timingApi.setTimeout(() => {
      const settledDrag = settlingDrag;
      settlingDrag = null;
      settlingTimeoutId = null;
      const movedDrag = finishDragCleanup(
        settledDrag,
        settledDrag != null &&
          settledDrag.currentBeforeId !== settledDrag.restingBeforeId
      );
      if (
        movedDrag == null ||
        movedDrag.currentBeforeId === movedDrag.restingBeforeId
      ) {
        return;
      }
      dispatchReorderAction(
        `${movedDrag.actionPrefix}${movedDrag.payload}:${
          movedDrag.currentBeforeId ?? "end"
        }`
      );
    }, DRAG_SETTLE_MS);
  }

  function handlePointerCancel(event: PointerEvent): void {
    if (pendingPress != null && pendingPress.pointerId === event.pointerId) {
      clearPendingPress();
      return;
    }
    if (activeDrag != null && activeDrag.pointerId === event.pointerId) {
      cleanupActiveDragState();
      return;
    }
    if (settlingDrag != null && settlingDrag.pointerId === event.pointerId) {
      cleanupSettlingDragState();
    }
  }

  function handleClick(event: MouseEvent): void {
    if (timingApi.now() >= suppressClickUntilMs) {
      return;
    }
    const houseActionButton = isElementLike(event.target)
      ? event.target.closest(HOUSE_ACTION_SELECTOR)
      : null;
    if (houseActionButton == null) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    suppressClickUntilMs = 0;
  }

  appElement.addEventListener("mouseover", handleMouseOver);
  appElement.addEventListener("mouseout", handleMouseOut);
  appElement.addEventListener("pointerdown", handlePointerDown);
  appElement.addEventListener("pointermove", handlePointerMove);
  appElement.addEventListener("pointerup", handlePointerUp);
  appElement.addEventListener("pointercancel", handlePointerCancel);
  appElement.addEventListener("click", handleClick, true);

  return {
    destroy() {
      clearPendingPress();
      cleanupActiveDragState();
      cleanupSettlingDragState();
      clearHoveredTile();
      appElement.removeEventListener("mouseover", handleMouseOver);
      appElement.removeEventListener("mouseout", handleMouseOut);
      appElement.removeEventListener("pointerdown", handlePointerDown);
      appElement.removeEventListener("pointermove", handlePointerMove);
      appElement.removeEventListener("pointerup", handlePointerUp);
      appElement.removeEventListener("pointercancel", handlePointerCancel);
      appElement.removeEventListener("click", handleClick, true);
    },
  };
}
