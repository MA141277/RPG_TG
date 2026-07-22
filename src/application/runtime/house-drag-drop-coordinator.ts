export type HouseDragDropPointerSubmit = {
  payload: string;
  beforeId: string | null;
  restingBeforeId: string | null;
  root: HTMLElement;
};

export type HouseDragDropCoordinatorDependencies = {
  dispatchHouseAction(actionId: string): void;
  renderApp(): void;
};

export function createHouseDragDropCoordinator(
  dependencies: HouseDragDropCoordinatorDependencies
) {
  function submitPointerDrag(dragState: HouseDragDropPointerSubmit): boolean {
    if (dragState.beforeId === dragState.restingBeforeId) {
      return false;
    }

    const actionPrefix = dragState.root.dataset.houseDropActionPrefix;
    if (actionPrefix == null) {
      return false;
    }

    dependencies.dispatchHouseAction(
      `${actionPrefix}${dragState.payload}:${dragState.beforeId ?? "end"}`
    );
    dependencies.renderApp();
    return true;
  }

  function submitHtmlDrop(input: {
    payload: string | null;
    beforeId: string | null;
    actionPrefix: string | null;
  }): boolean {
    const { payload, beforeId, actionPrefix } = input;
    if (payload == null || beforeId == null || actionPrefix == null) {
      return false;
    }

    dependencies.dispatchHouseAction(`${actionPrefix}${payload}:${beforeId}`);
    return true;
  }

  return {
    submitPointerDrag,
    submitHtmlDrop,
  };
}
