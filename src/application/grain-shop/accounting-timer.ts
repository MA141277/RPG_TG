let activeTimerId: ReturnType<typeof setInterval> | null = null;

export function startAccountingTimer(onTick: () => void): void {
  stopAccountingTimer();
  activeTimerId = window.setInterval(onTick, 1000);
}

export function stopAccountingTimer(): void {
  if (activeTimerId != null) {
    window.clearInterval(activeTimerId);
    activeTimerId = null;
  }
}

export function isAccountingTimerActive(): boolean {
  return activeTimerId != null;
}
