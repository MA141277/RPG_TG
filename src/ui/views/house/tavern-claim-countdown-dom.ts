const CLAIM_COUNTDOWN_SELECTOR = '[data-house-claim-countdown="true"]';
const CLAIM_COUNTDOWN_LABEL_SELECTOR = '[data-house-claim-countdown-label="true"]';
const CLAIM_COUNTDOWN_TRACK_SELECTOR = '[data-house-claim-countdown-track="true"]';
const CLAIM_COUNTDOWN_FILL_SELECTOR = '[data-house-claim-countdown-fill="true"]';

function readCountdownMs(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback;
  }
  return parsed;
}

class TavernClaimCountdownDomRuntime {
  private root: HTMLElement;
  private totalMs = 10_000;
  private deadlineMs = 0;
  private frameHandle: number | null = null;

  constructor(root: HTMLElement) {
    this.root = root;
    this.syncRoot(root);
  }

  matches(root: HTMLElement): boolean {
    return this.root === root;
  }

  syncRoot(root: HTMLElement): void {
    this.root = root;
    this.readCountdownState();
    this.start();
  }

  destroy(): void {
    if (this.frameHandle != null) {
      window.cancelAnimationFrame(this.frameHandle);
      this.frameHandle = null;
    }
  }

  private readCountdownState(): void {
    this.totalMs = Math.max(
      1_000,
      readCountdownMs(this.root.dataset.houseClaimCountdownTotalMs, 10_000)
    );
    const remainingMs = Math.min(
      this.totalMs,
      readCountdownMs(this.root.dataset.houseClaimCountdownRemainingMs, this.totalMs)
    );
    this.deadlineMs = Date.now() + remainingMs;
  }

  private start(): void {
    if (this.frameHandle != null) {
      window.cancelAnimationFrame(this.frameHandle);
      this.frameHandle = null;
    }
    this.renderFrame();
  }

  private renderFrame = (): void => {
    if (!this.root.isConnected) {
      this.destroy();
      return;
    }

    const labelElement = this.root.querySelector<HTMLElement>(CLAIM_COUNTDOWN_LABEL_SELECTOR);
    const trackElement = this.root.querySelector<HTMLElement>(CLAIM_COUNTDOWN_TRACK_SELECTOR);
    const fillElement = this.root.querySelector<HTMLElement>(CLAIM_COUNTDOWN_FILL_SELECTOR);
    if (labelElement == null || trackElement == null || fillElement == null) {
      this.destroy();
      return;
    }

    const remainingMs = Math.max(0, this.deadlineMs - Date.now());
    const remainingSeconds = Math.ceil(remainingMs / 1_000);
    const progressPercent = Math.max(
      0,
      Math.min(100, (remainingMs / this.totalMs) * 100)
    );

    labelElement.textContent = `剩余 ${remainingSeconds} 秒`;
    trackElement.setAttribute("aria-valuenow", String(remainingSeconds));
    fillElement.style.width = `${progressPercent}%`;

    if (remainingMs <= 0) {
      this.frameHandle = null;
      return;
    }

    this.frameHandle = window.requestAnimationFrame(this.renderFrame);
  };
}

let tavernClaimCountdownDomRuntime: TavernClaimCountdownDomRuntime | null = null;

export function syncTavernClaimCountdownDomRuntime(root: ParentNode): void {
  const countdownElement = root.querySelector<HTMLElement>(CLAIM_COUNTDOWN_SELECTOR);
  if (countdownElement == null) {
    tavernClaimCountdownDomRuntime?.destroy();
    tavernClaimCountdownDomRuntime = null;
    return;
  }

  if (tavernClaimCountdownDomRuntime?.matches(countdownElement)) {
    tavernClaimCountdownDomRuntime.syncRoot(countdownElement);
    return;
  }

  tavernClaimCountdownDomRuntime?.destroy();
  tavernClaimCountdownDomRuntime = new TavernClaimCountdownDomRuntime(countdownElement);
}
