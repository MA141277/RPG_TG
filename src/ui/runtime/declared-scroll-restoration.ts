type PreservedScrollPosition = {
  top: number;
  left: number;
};

export class DeclaredScrollRestoration {
  capture(root: ParentNode): Map<string, PreservedScrollPosition> | null {
    const snapshot = new Map<string, PreservedScrollPosition>();

    this.collectScrollableElements(root).forEach((element) => {
      const key = element.dataset.preserveScrollKey?.trim() ?? "";
      if (key.length === 0) {
        return;
      }

      snapshot.set(key, {
        top: element.scrollTop,
        left: element.scrollLeft,
      });
    });

    return snapshot.size === 0 ? null : snapshot;
  }

  restore(
    root: ParentNode,
    snapshot: Map<string, PreservedScrollPosition> | null
  ): void {
    if (snapshot == null || snapshot.size === 0) {
      return;
    }

    this.collectScrollableElements(root).forEach((element) => {
      const key = element.dataset.preserveScrollKey?.trim() ?? "";
      if (key.length === 0) {
        return;
      }

      const preservedPosition = snapshot.get(key);
      if (preservedPosition == null) {
        return;
      }

      element.scrollTop = preservedPosition.top;
      element.scrollLeft = preservedPosition.left;
    });
  }

  private collectScrollableElements(root: ParentNode): HTMLElement[] {
    return Array.from(
      root.querySelectorAll<HTMLElement>("[data-preserve-scroll-key]")
    );
  }
}

export const declaredScrollRestoration = new DeclaredScrollRestoration();
