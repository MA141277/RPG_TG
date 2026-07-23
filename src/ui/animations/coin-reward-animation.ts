const COIN_REWARD_INGOT_ICON_URL = "/ui/yuansu/属性栏/20260706-152814.png";

type CoinRewardAnimator = {
  setGoldTargetElement(element: HTMLElement | null): void;
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
  node: HTMLImageElement;
  burstPoint: Point;
  controlPoint: Point;
  gatherDelayMs: number;
  hasArrived: boolean;
  hitValue: number;
};

const INGOT_MIN_COUNT = 10;
const INGOT_MAX_COUNT = 20;
const INGOT_BURST_MS = 160;
const INGOT_PAUSE_MS = 500;
const INGOT_GATHER_MS = 420;
const INGOT_GATHER_STAGGER_MS = 240;

function applyCriticalLayerStyles(layer: HTMLElement): void {
  layer.style.position = "absolute";
  layer.style.inset = "0";
  layer.style.overflow = "visible";
  layer.style.pointerEvents = "none";
  layer.style.zIndex = "102";
}

function createIngotNode(document: Document): HTMLImageElement {
  const node = document.createElement("img");
  node.className = "p-ui-coin-reward-layer__ingot";
  node.src = COIN_REWARD_INGOT_ICON_URL;
  node.alt = "";
  node.setAttribute("aria-hidden", "true");
  return node;
}

function quadraticBezier(from: number, control: number, to: number, t: number): number {
  return (1 - t) * (1 - t) * from + 2 * (1 - t) * t * control + t * t * to;
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

function getControlPoint(from: Point, to: Point): Point {
  const midpointX = (from.x + to.x) / 2;
  const midpointY = (from.y + to.y) / 2;
  const side = Math.random() < 0.5 ? -1 : 1;
  const horizontalOffset = 36 + Math.random() * 88;
  const lift = 84 + Math.random() * 56;

  return {
    x: midpointX + side * horizontalOffset,
    y: Math.min(from.y, to.y, midpointY) - lift,
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

function moveIngot(node: HTMLImageElement, point: Point, scale = 1): void {
  node.style.left = `${point.x}px`;
  node.style.top = `${point.y}px`;
  node.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

function resetIngot(node: HTMLImageElement): void {
  node.className = "p-ui-coin-reward-layer__ingot";
  node.style.position = "absolute";
  node.style.display = "block";
  node.style.width = "32px";
  node.style.height = "32px";
  node.style.objectFit = "contain";
  node.style.pointerEvents = "none";
  node.style.userSelect = "none";
  node.style.willChange = "left, top, transform, opacity";
  node.style.left = "";
  node.style.top = "";
  node.style.opacity = "";
  node.style.transform = "";
  node.style.transition = "";
  node.style.transitionDelay = "";
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
  const ingotPool: HTMLImageElement[] = [];
  let activeIngots: ActiveIngot[] = [];
  let scheduledTimeouts: number[] = [];
  let scheduledFrame: number | null = null;

  function acquireIngot(): HTMLImageElement {
    const node = ingotPool.pop() ?? createIngotNode(input.layer.ownerDocument);
    resetIngot(node);
    input.layer.appendChild(node);
    return node;
  }

  function releaseIngot(node: HTMLImageElement): void {
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
      INGOT_GATHER_MS +
      activeIngots.reduce(
        (maxDelay, ingot) => Math.max(maxDelay, ingot.gatherDelayMs),
        0
      );
    const animateGather = (now: number): void => {
      const elapsed = now - gatherStartedAt;

      activeIngots.forEach((ingot) => {
        const localElapsed = Math.max(0, elapsed - ingot.gatherDelayMs);
        const progress = Math.min(localElapsed / INGOT_GATHER_MS, 1);
        const nextPoint = {
          x: quadraticBezier(
            ingot.burstPoint.x,
            ingot.controlPoint.x,
            inputForGather.targetPoint.x,
            progress
          ),
          y: quadraticBezier(
            ingot.burstPoint.y,
            ingot.controlPoint.y,
            inputForGather.targetPoint.y,
            progress
          ),
        };
        moveIngot(ingot.node, nextPoint, 0.88 + progress * 0.16);

        if (!ingot.hasArrived && progress >= 1) {
          ingot.hasArrived = true;

          if (ingot.hitValue >= inputForGather.targetValue) {
            input.onDisplayValueChange(inputForGather.targetValue);
            input.onDisplayValueChange(null);
            clearScheduledWork();
            releaseActiveIngots();
            return;
          }

          input.onDisplayValueChange(ingot.hitValue);
        }
      });

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

      const ingotCount = clampIngotCount(amount);
      const sourcePoint = toLayerPoint(
        input.layer,
        getSourceCenter({ sourceElement, sourceClientX, sourceClientY })
      );
      const targetPoint = toLayerPoint(
        input.layer,
        goldTargetElement == null
          ? getSourceCenter({
              sourceElement,
              sourceClientX: undefined,
              sourceClientY: undefined,
            })
          : getElementCenter(goldTargetElement)
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
          controlPoint: getControlPoint(burstPoint, targetPoint),
          gatherDelayMs: 0,
          hasArrived: false,
          hitValue: targetValue,
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
