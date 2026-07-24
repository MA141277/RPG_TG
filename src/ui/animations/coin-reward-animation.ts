const COIN_REWARD_INGOT_ICON_URL = "/ui/yuansu/属性栏/20260706-152814.png";

type CoinRewardAnimator = {
  setGoldTargetElement(element: HTMLElement | null): void;
  setTargetOffset(offsetX: number, offsetY: number): void;
  setPreviewTargetOffset(offsetX: number | null, offsetY: number | null): void;
  play(input: {
    sourceElement: HTMLElement;
    sourceClientX?: number;
    sourceClientY?: number;
    startValue: number;
    targetValue: number;
    amount: number;
  }): void;
};

type Point = {
  x: number;
  y: number;
};

type ActiveIngot = {
  node: HTMLElement;
  burstPoint: Point;
  gatherDelayMs: number;
  hasArrived: boolean;
  hitValue: number;
  currentPoint: Point;
  velocity: Point;
  isConverging: boolean;
  convergeElapsedMs: number;
  lastGatherElapsedMs: number;
};

const INGOT_MIN_COUNT = 10;
const INGOT_MAX_COUNT = 20;
const INGOT_BURST_MS = 160;
const INGOT_PAUSE_MS = 150;
const INGOT_GATHER_MAX_MS = 1900;
const INGOT_GATHER_STAGGER_MS = 240;
const INGOT_CONVERGENCE_THRESHOLD_GROWTH_PX_PER_MS = 0.6;
const INGOT_STRAIGHT_FLIGHT_COMPONENT_PX_PER_MS = 1.5;
const INGOT_ARRIVAL_DISTANCE_PX = 10;
const INGOT_TARGET_OFFSET_X = -151;
const INGOT_TARGET_OFFSET_Y = 25;
const INGOT_DIRECT_CONVERGE_SPEED_PX_PER_MS = 1.5;
const INGOT_TEXTURE_URL = "/ui/coin-reward/yuanbao.png";

function applyCriticalLayerStyles(layer: HTMLElement): void {
  layer.style.position = "absolute";
  layer.style.inset = "0";
  layer.style.overflow = "visible";
  layer.style.pointerEvents = "none";
  layer.style.zIndex = "102";
}

function createIngotNode(document: Document): HTMLElement {
  const node = document.createElement("div");
  node.className = "p-ui-coin-reward-layer__ingot";
  node.setAttribute("aria-hidden", "true");
  return node;
}

function createAnchorDebugNode(document: Document): HTMLElement {
  const node = document.createElement("div");
  node.className = "p-ui-coin-reward-layer__anchor-debug";
  node.dataset.uiCoinRewardAnchorDebug = "true";
  node.setAttribute("aria-hidden", "true");
  return node;
}

function clampIngotCount(amount: number): number {
  const normalizedAmount = Number.isFinite(amount)
    ? Math.trunc(amount)
    : INGOT_MIN_COUNT;

  return Math.max(INGOT_MIN_COUNT, Math.min(INGOT_MAX_COUNT, normalizedAmount));
}

function buildRollingDisplayValues(
  startValue: number,
  targetValue: number,
  ingotCount: number
): number[] {
  return Array.from({ length: ingotCount }, (_, index) =>
    Math.round(startValue + ((targetValue - startValue) * (index + 1)) / ingotCount)
  );
}

function getElementCenter(element: HTMLElement): Point {
  const rect = element.getBoundingClientRect();

  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

function getSourceCenter(input: {
  sourceElement: HTMLElement;
  sourceClientX: number | undefined;
  sourceClientY: number | undefined;
}): Point {
  const sourceCenter = getElementCenter(input.sourceElement);

  return {
    x: input.sourceClientX ?? sourceCenter.x,
    y: input.sourceClientY ?? sourceCenter.y,
  };
}

function toLayerPoint(layer: HTMLElement, viewportPoint: Point): Point {
  const layerRect =
    typeof layer.getBoundingClientRect === "function"
      ? layer.getBoundingClientRect()
      : { left: 0, top: 0, width: 0, height: 0 };
  const layerWidth = layer.clientWidth || layerRect.width || 1;
  const layerHeight = layer.clientHeight || layerRect.height || 1;
  const scaleX = layerRect.width > 0 ? layerWidth / layerRect.width : 1;
  const scaleY = layerRect.height > 0 ? layerHeight / layerRect.height : 1;

  return {
    x: (viewportPoint.x - layerRect.left) * scaleX,
    y: (viewportPoint.y - layerRect.top) * scaleY,
  };
}

function getBurstPoint(sourcePoint: Point): Point {
  const angle = Math.random() * Math.PI * 2;
  const radius = 42 + Math.random() * 34;
  const spreadScaleX = 1 + Math.random() * 0.28;
  const spreadScaleY = 0.62 + Math.random() * 0.16;

  return {
    x: sourcePoint.x + Math.cos(angle) * radius * spreadScaleX,
    y: sourcePoint.y + Math.sin(angle) * radius * spreadScaleY,
  };
}

function getGatherDelayMs(index: number, ingotCount: number): number {
  if (ingotCount <= 1) {
    return 0;
  }

  const spacing = INGOT_GATHER_STAGGER_MS / (ingotCount - 1);
  const jitter = (Math.random() - 0.5) * Math.min(28, spacing * 0.8);

  return Math.max(0, index * spacing + jitter);
}

function moveIngot(node: HTMLElement, point: Point, scale = 1): void {
  node.style.left = `${point.x}px`;
  node.style.top = `${point.y}px`;
  node.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

function moveAnchorDebugNode(node: HTMLElement, point: Point): void {
  node.style.left = `${point.x}px`;
  node.style.top = `${point.y}px`;
}

function getDistance(from: Point, to: Point): number {
  return Math.hypot(to.x - from.x, to.y - from.y);
}

function getNormalizedVector(from: Point, to: Point): Point {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.hypot(dx, dy) || 1;

  return {
    x: dx / distance,
    y: dy / distance,
  };
}

function offsetPoint(point: Point, offsetX: number, offsetY: number): Point {
  return {
    x: point.x + offsetX,
    y: point.y + offsetY,
  };
}

function createStraightFlightVelocity(from: Point, to: Point): Point {
  const direction = getNormalizedVector(from, to);

  return {
    x: direction.x * INGOT_STRAIGHT_FLIGHT_COMPONENT_PX_PER_MS,
    y: direction.y * INGOT_STRAIGHT_FLIGHT_COMPONENT_PX_PER_MS,
  };
}

function didSegmentReachTarget(from: Point, to: Point, target: Point, radius: number): boolean {
  const segmentX = to.x - from.x;
  const segmentY = to.y - from.y;
  const segmentLengthSquared = segmentX * segmentX + segmentY * segmentY;

  if (segmentLengthSquared <= 0.000001) {
    return getDistance(from, target) <= radius;
  }

  const projection =
    ((target.x - from.x) * segmentX + (target.y - from.y) * segmentY) /
    segmentLengthSquared;
  const clampedProjection = Math.max(0, Math.min(1, projection));
  const closestPoint = {
    x: from.x + segmentX * clampedProjection,
    y: from.y + segmentY * clampedProjection,
  };

  return getDistance(closestPoint, target) <= radius;
}

function getConvergenceThresholdPx(elapsedMs: number): number {
  return elapsedMs * INGOT_CONVERGENCE_THRESHOLD_GROWTH_PX_PER_MS;
}

function advanceDirectConvergencePoint(
  currentPoint: Point,
  targetPoint: Point,
  deltaMs: number
): Point {
  const distanceToTarget = getDistance(currentPoint, targetPoint);
  if (distanceToTarget <= 0.000001) {
    return {
      x: targetPoint.x,
      y: targetPoint.y,
    };
  }

  const travelDistance = Math.min(
    distanceToTarget,
    INGOT_DIRECT_CONVERGE_SPEED_PX_PER_MS * deltaMs
  );
  const directionToTarget = getNormalizedVector(currentPoint, targetPoint);

  return {
    x: currentPoint.x + directionToTarget.x * travelDistance,
    y: currentPoint.y + directionToTarget.y * travelDistance,
  };
}

function applyDirectConvergence(ingot: ActiveIngot, targetPoint: Point, deltaMs: number): void {
  const previousPoint = {
    x: ingot.currentPoint.x,
    y: ingot.currentPoint.y,
  };
  ingot.currentPoint = advanceDirectConvergencePoint(
    ingot.currentPoint,
    targetPoint,
    deltaMs
  );

  if (
    didSegmentReachTarget(previousPoint, ingot.currentPoint, targetPoint, INGOT_ARRIVAL_DISTANCE_PX)
  ) {
    ingot.currentPoint = {
      x: targetPoint.x,
      y: targetPoint.y,
    };
  }
}

function getFinalDisplayEvents(input: {
  latestDisplayedNumericValue: number;
  lastEmittedValue: number | null;
  hasShownAnyNumericValue: boolean;
  targetValue: number;
}): Array<number | null> {
  const events: Array<number | null> = [];

  if (
    input.hasShownAnyNumericValue &&
    input.latestDisplayedNumericValue !== input.targetValue
  ) {
    events.push(input.targetValue);
  }

  if (input.hasShownAnyNumericValue && input.lastEmittedValue !== null) {
    events.push(null);
  }

  return events;
}

function advanceGatherState(
  ingot: ActiveIngot,
  targetPoint: Point,
  nextElapsedMs: number
): void {
  let simulatedElapsedMs = ingot.lastGatherElapsedMs;

  while (simulatedElapsedMs < nextElapsedMs - 0.001) {
    const sliceEndElapsedMs = Math.min(nextElapsedMs, simulatedElapsedMs + 16);
    let sliceRemainingMs = sliceEndElapsedMs - simulatedElapsedMs;

    if (!ingot.isConverging) {
      ingot.currentPoint = {
        x: ingot.currentPoint.x + ingot.velocity.x * sliceRemainingMs,
        y: ingot.currentPoint.y + ingot.velocity.y * sliceRemainingMs,
      };
      simulatedElapsedMs += sliceRemainingMs;
      sliceRemainingMs = 0;

      if (
        getDistance(ingot.currentPoint, targetPoint) <=
        getConvergenceThresholdPx(simulatedElapsedMs)
      ) {
        ingot.isConverging = true;
        ingot.convergeElapsedMs = 0;
      }
    } else if (sliceRemainingMs > 0) {
      applyDirectConvergence(ingot, targetPoint, sliceRemainingMs);
      simulatedElapsedMs += sliceRemainingMs;
      sliceRemainingMs = 0;
    }
  }

  ingot.lastGatherElapsedMs = nextElapsedMs;

  if (
    nextElapsedMs >= INGOT_GATHER_MAX_MS ||
    (ingot.isConverging && getDistance(ingot.currentPoint, targetPoint) <= INGOT_ARRIVAL_DISTANCE_PX)
  ) {
    ingot.currentPoint = {
      x: targetPoint.x,
      y: targetPoint.y,
    };
  }
}

function resetIngot(node: HTMLElement): void {
  node.className = "p-ui-coin-reward-layer__ingot";
  node.style.position = "absolute";
  node.style.display = "block";
  node.style.width = "84px";
  node.style.height = "48px";
  node.style.borderRadius = "0";
  node.style.background = "transparent";
  node.style.backgroundImage = `url("${INGOT_TEXTURE_URL}")`;
  node.style.backgroundRepeat = "no-repeat";
  node.style.backgroundPosition = "center";
  node.style.backgroundSize = "contain";
  node.style.border = "0";
  node.style.boxShadow = "0 2px 6px rgba(112, 72, 0, 0.22)";
  node.style.pointerEvents = "none";
  node.style.userSelect = "none";
  node.style.transformOrigin = "50% 50%";
  node.style.willChange = "left, top, transform, opacity";
  node.style.left = "";
  node.style.top = "";
  node.style.opacity = "";
  node.style.transform = "";
  node.style.transition = "";
  node.style.transitionDelay = "";
}

function resetAnchorDebugNode(node: HTMLElement): void {
  node.style.position = "absolute";
  node.style.display = "none";
  node.style.width = "22px";
  node.style.height = "22px";
  node.style.borderRadius = "999px";
  node.style.background =
    "radial-gradient(circle, rgba(255,93,93,0.28) 0 28%, rgba(255,93,93,0) 29% 100%), linear-gradient(90deg, rgba(0,0,0,0) 46%, rgba(255,93,93,0.92) 46% 54%, rgba(0,0,0,0) 54%), linear-gradient(0deg, rgba(0,0,0,0) 46%, rgba(255,93,93,0.92) 46% 54%, rgba(0,0,0,0) 54%)";
  node.style.boxShadow =
    "0 0 0 1px rgba(255,255,255,0.85), 0 0 0 2px rgba(255,93,93,0.75)";
  node.style.pointerEvents = "none";
  node.style.userSelect = "none";
  node.style.transform = "translate(-50%, -50%)";
  node.style.left = "";
  node.style.top = "";
}

function requestAnimationStep(callback: FrameRequestCallback): number {
  if (typeof requestAnimationFrame === "function") {
    return requestAnimationFrame(callback);
  }

  return globalThis.setTimeout(() => callback(performance.now()), 16);
}

function cancelAnimationStep(frameId: number): void {
  if (typeof cancelAnimationFrame === "function") {
    cancelAnimationFrame(frameId);
    return;
  }

  globalThis.clearTimeout(frameId);
}

export function createCoinRewardAnimator(input: {
  layer: HTMLElement;
  onDisplayValueChange: (displayValue: number | null) => void;
}): CoinRewardAnimator {
  applyCriticalLayerStyles(input.layer);
  let goldTargetElement: HTMLElement | null = null;
  const anchorDebugNode = createAnchorDebugNode(input.layer.ownerDocument);
  resetAnchorDebugNode(anchorDebugNode);
  input.layer.appendChild(anchorDebugNode);
  const ingotPool: HTMLElement[] = [];
  let activeIngots: ActiveIngot[] = [];
  let scheduledTimeouts: number[] = [];
  let scheduledFrame: number | null = null;
  let targetOffsetX = INGOT_TARGET_OFFSET_X;
  let targetOffsetY = INGOT_TARGET_OFFSET_Y;
  let previewTargetOffsetX: number | null = null;
  let previewTargetOffsetY: number | null = null;
  let latestDisplayedNumericValue = 0;
  let lastEmittedValue: number | null = null;
  let hasShownAnyNumericValue = false;

  function emitDisplayValueChange(displayValue: number | null): void {
    if (typeof displayValue === "number") {
      latestDisplayedNumericValue = displayValue;
      hasShownAnyNumericValue = true;
    }

    lastEmittedValue = displayValue;
    input.onDisplayValueChange(displayValue);
  }

  function resolveTargetPointForLayer(): Point | null {
    if (goldTargetElement == null) {
      return null;
    }

    return offsetPoint(
      toLayerPoint(input.layer, getElementCenter(goldTargetElement)),
      targetOffsetX,
      targetOffsetY
    );
  }

  function resolvePreviewTargetPointForLayer(): Point | null {
    if (goldTargetElement == null) {
      return null;
    }

    return offsetPoint(
      toLayerPoint(input.layer, getElementCenter(goldTargetElement)),
      previewTargetOffsetX ?? targetOffsetX,
      previewTargetOffsetY ?? targetOffsetY
    );
  }

  function syncAnchorDebugNode(): void {
    const targetPoint = resolvePreviewTargetPointForLayer();

    if (targetPoint == null) {
      anchorDebugNode.style.display = "none";
      return;
    }

    resetAnchorDebugNode(anchorDebugNode);
    moveAnchorDebugNode(anchorDebugNode, targetPoint);
  }

  function acquireIngot(): HTMLElement {
    const node = ingotPool.pop() ?? createIngotNode(input.layer.ownerDocument);
    resetIngot(node);
    input.layer.appendChild(node);
    return node;
  }

  function releaseIngot(node: HTMLElement): void {
    resetIngot(node);
    node.remove();
    ingotPool.push(node);
  }

  function releaseActiveIngots(): void {
    activeIngots.forEach((ingot) => releaseIngot(ingot.node));
    activeIngots = [];
  }

  function schedule(callback: () => void, delayMs: number): void {
    const timeoutId = globalThis.setTimeout(callback, delayMs);
    scheduledTimeouts.push(timeoutId);
  }

  function clearScheduledWork(): void {
    scheduledTimeouts.forEach((timeoutId) => globalThis.clearTimeout(timeoutId));
    scheduledTimeouts = [];

    if (scheduledFrame != null) {
      cancelAnimationStep(scheduledFrame);
      scheduledFrame = null;
    }
  }

  function stopCurrentAnimation(): void {
    clearScheduledWork();
    releaseActiveIngots();
  }

  function scheduleGather(inputForGather: {
    targetPoint: Point;
    targetValue: number;
  }): void {
    const gatherStartedAt = performance.now();
    const gatherFinishedAt =
      INGOT_GATHER_MAX_MS +
      activeIngots.reduce(
        (maxDelay, ingot) => Math.max(maxDelay, ingot.gatherDelayMs),
        0
      );
    const animateGather = (now: number): void => {
      const elapsed = now - gatherStartedAt;
      const completedIngots: ActiveIngot[] = [];

      activeIngots.forEach((ingot) => {
        const localElapsed = Math.max(0, elapsed - ingot.gatherDelayMs);
        const clampedElapsed = Math.min(localElapsed, INGOT_GATHER_MAX_MS);
        const progress = Math.min(clampedElapsed / INGOT_GATHER_MAX_MS, 1);

        if (clampedElapsed > ingot.lastGatherElapsedMs) {
          advanceGatherState(ingot, inputForGather.targetPoint, clampedElapsed);
        }

        moveIngot(ingot.node, ingot.currentPoint, 0.88 + progress * 0.16);

        if (
          !ingot.hasArrived &&
          (clampedElapsed >= INGOT_GATHER_MAX_MS ||
            getDistance(ingot.currentPoint, inputForGather.targetPoint) <= 0.001)
        ) {
          ingot.hasArrived = true;
          completedIngots.push(ingot);

          if (ingot.hitValue >= inputForGather.targetValue) {
            emitDisplayValueChange(inputForGather.targetValue);
            emitDisplayValueChange(null);
          } else {
            emitDisplayValueChange(ingot.hitValue);
          }
        }
      });

      if (completedIngots.length > 0) {
        completedIngots.forEach((ingot) => releaseIngot(ingot.node));
        activeIngots = activeIngots.filter((ingot) => !completedIngots.includes(ingot));

        if (activeIngots.length === 0) {
          getFinalDisplayEvents({
            latestDisplayedNumericValue,
            lastEmittedValue,
            hasShownAnyNumericValue,
            targetValue: inputForGather.targetValue,
          }).forEach((event) => {
            emitDisplayValueChange(event);
          });
          clearScheduledWork();
          scheduledFrame = null;
          return;
        }
      }

      if (elapsed < gatherFinishedAt) {
        scheduledFrame = requestAnimationStep(animateGather);
      } else {
        scheduledFrame = null;
      }
    };

    scheduledFrame = requestAnimationStep(animateGather);
  }

  return {
    setGoldTargetElement(element) {
      goldTargetElement = element;
      syncAnchorDebugNode();
    },
    setTargetOffset(offsetX, offsetY) {
      targetOffsetX = offsetX;
      targetOffsetY = offsetY;
      syncAnchorDebugNode();
    },
    setPreviewTargetOffset(offsetX, offsetY) {
      previewTargetOffsetX = offsetX;
      previewTargetOffsetY = offsetY;
      syncAnchorDebugNode();
    },
    play({
      sourceElement,
      sourceClientX,
      sourceClientY,
      startValue,
      targetValue,
      amount,
    }) {
      stopCurrentAnimation();
      latestDisplayedNumericValue = startValue;
      lastEmittedValue = null;
      hasShownAnyNumericValue = false;

      const ingotCount = clampIngotCount(amount);
      const sourcePoint = toLayerPoint(
        input.layer,
        getSourceCenter({ sourceElement, sourceClientX, sourceClientY })
      );
      const targetPoint = offsetPoint(
        toLayerPoint(
          input.layer,
          goldTargetElement == null
            ? getSourceCenter({
                sourceElement,
                sourceClientX: undefined,
                sourceClientY: undefined,
              })
            : getElementCenter(goldTargetElement)
        ),
        targetOffsetX,
        targetOffsetY
      );
      const hitValues = buildRollingDisplayValues(startValue, targetValue, ingotCount);

      activeIngots = Array.from({ length: ingotCount }, () => {
        const node = acquireIngot();
        const burstPoint = getBurstPoint(sourcePoint);

        moveIngot(node, sourcePoint, 0.52);
        node.style.opacity = "1";
        node.style.transition =
          `left ${INGOT_BURST_MS}ms cubic-bezier(.18,.8,.28,1), ` +
          `top ${INGOT_BURST_MS}ms cubic-bezier(.18,.8,.28,1), ` +
          `transform ${INGOT_BURST_MS}ms ease-out, opacity 120ms ease-out`;

        schedule(() => {
          moveIngot(node, burstPoint, 1);
        }, 0);

        return {
          node,
          burstPoint,
          gatherDelayMs: 0,
          hasArrived: false,
          hitValue: targetValue,
          currentPoint: {
            x: burstPoint.x,
            y: burstPoint.y,
          },
          velocity: createStraightFlightVelocity(sourcePoint, targetPoint),
          isConverging: false,
          convergeElapsedMs: 0,
          lastGatherElapsedMs: 0,
        };
      })
        .sort(() => Math.random() - 0.5)
        .map((ingot, index) => ({
          ...ingot,
          gatherDelayMs: getGatherDelayMs(index, ingotCount),
          hitValue: hitValues[index] ?? targetValue,
        }));

      schedule(() => {
        activeIngots.forEach((ingot) => {
          ingot.node.style.transition = "";
          ingot.node.style.transitionDelay = "";
        });
        scheduleGather({
          targetPoint,
          targetValue,
        });
      }, INGOT_BURST_MS + INGOT_PAUSE_MS);
    },
  };
}

export const __coinRewardTestUtils = {
  createStraightFlightVelocity,
  advanceDirectConvergencePoint,
  getFinalDisplayEvents,
};
