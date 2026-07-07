import type { GridCoordinate } from "../navigation/travel-to-coordinate";

type CampaignMoveAnimationState = {
  frameId: number | null;
  startedAtMs: number;
  from: GridCoordinate;
  to: GridCoordinate;
  durationMs: number;
  resolve: () => void;
};

export type CampaignMoveAnimationCoordinatorDependencies = {
  getCurrentFacingDegrees(): number;
  syncCampaignActorRuntimeState(
    coordinate: GridCoordinate,
    facingDegrees: number,
    isMoving: boolean
  ): void;
  syncCampaignActorView(): void;
  renderApp(): void;
  requestAnimationFrame(callback: FrameRequestCallback): number;
  cancelAnimationFrame(frameId: number): void;
  now(): number;
  clamp(value: number, min: number, max: number): number;
  msPerMapUnit: number;
  minDurationMs: number;
  maxDurationMs: number;
  turnDegreesPerSecond: number;
};

export function createCampaignMoveAnimationCoordinator(
  dependencies: CampaignMoveAnimationCoordinatorDependencies
) {
  let campaignMoveAnimationState: CampaignMoveAnimationState | null = null;

  function getFacingDegrees(from: GridCoordinate, to: GridCoordinate): number {
    const deltaX = to.x - from.x;
    const deltaY = to.y - from.y;
    if (deltaX === 0 && deltaY === 0) {
      return dependencies.getCurrentFacingDegrees();
    }

    return Math.atan2(deltaY, deltaX) * 180 / Math.PI;
  }

  function getShortestAngleDelta(fromDegrees: number, toDegrees: number): number {
    return ((toDegrees - fromDegrees + 540) % 360) - 180;
  }

  function normalizeDegrees(degrees: number): number {
    const normalized = degrees % 360;
    return normalized < 0 ? normalized + 360 : normalized;
  }

  function hasActiveAnimation(): boolean {
    return campaignMoveAnimationState != null;
  }

  function stopAnimation(): void {
    if (campaignMoveAnimationState?.frameId != null) {
      dependencies.cancelAnimationFrame(campaignMoveAnimationState.frameId);
    }
    const activeAnimation = campaignMoveAnimationState;
    campaignMoveAnimationState = null;
    activeAnimation?.resolve();
  }

  function animateMove(from: GridCoordinate, to: GridCoordinate): Promise<void> {
    stopAnimation();

    const deltaX = to.x - from.x;
    const deltaY = to.y - from.y;
    const distance = Math.hypot(deltaX, deltaY);
    const startFacingDegrees = dependencies.getCurrentFacingDegrees();
    const facingDegrees = getFacingDegrees(from, to);
    if (distance < 0.001) {
      dependencies.syncCampaignActorRuntimeState(to, facingDegrees, false);
      dependencies.renderApp();
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const durationMs = Math.max(
        dependencies.minDurationMs,
        Math.min(
          dependencies.maxDurationMs,
          distance * dependencies.msPerMapUnit
        )
      );
      const facingDelta = getShortestAngleDelta(
        startFacingDegrees,
        facingDegrees
      );
      const turnDurationMs =
        Math.abs(facingDelta) < 0.5
          ? 0
          : Math.max(
              180,
              (Math.abs(facingDelta) / dependencies.turnDegreesPerSecond) * 1000
            );
      const animationState: CampaignMoveAnimationState = {
        frameId: null,
        startedAtMs: dependencies.now(),
        from,
        to,
        durationMs,
        resolve,
      };
      campaignMoveAnimationState = animationState;

      const tick: FrameRequestCallback = (timestamp) => {
        if (campaignMoveAnimationState !== animationState) {
          resolve();
          return;
        }

        const elapsedMs = timestamp - animationState.startedAtMs;
        const rawProgress = dependencies.clamp(
          elapsedMs / animationState.durationMs,
          0,
          1
        );
        const nextCoordinate = {
          x:
            animationState.from.x +
            (animationState.to.x - animationState.from.x) * rawProgress,
          y:
            animationState.from.y +
            (animationState.to.y - animationState.from.y) * rawProgress,
        };
        const turnProgress =
          turnDurationMs <= 0
            ? 1
            : dependencies.clamp(elapsedMs / turnDurationMs, 0, 1);
        const currentFacingDegrees = normalizeDegrees(
          startFacingDegrees + facingDelta * turnProgress
        );
        dependencies.syncCampaignActorRuntimeState(
          nextCoordinate,
          currentFacingDegrees,
          rawProgress < 1
        );
        dependencies.syncCampaignActorView();

        if (rawProgress >= 1) {
          campaignMoveAnimationState = null;
          resolve();
          return;
        }

        animationState.frameId = dependencies.requestAnimationFrame(tick);
      };

      animationState.frameId = dependencies.requestAnimationFrame(tick);
    });
  }

  return {
    hasActiveAnimation,
    stopAnimation,
    animateMove,
  };
}
