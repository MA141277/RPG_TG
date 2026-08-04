import type { AmbientLoopHandle } from "./audio-manager";

export class ScopedAmbientLoopController<TSnapshot> {
  private active = false;

  constructor(
    private readonly input: {
      target: AmbientLoopHandle;
      isActive(snapshot: TSnapshot): boolean;
    }
  ) {}

  sync(snapshot: TSnapshot): void {
    const nextActive = this.input.isActive(snapshot);
    if (nextActive === this.active) {
      return;
    }

    this.active = nextActive;
    if (nextActive) {
      this.input.target.activate();
      return;
    }

    this.input.target.deactivate();
  }

  destroy(): void {
    if (this.active) {
      this.input.target.deactivate();
      this.active = false;
    }

    this.input.target.destroy();
  }
}
