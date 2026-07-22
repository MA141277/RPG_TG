import { PLAYER_MAIN_TROOP_ID } from "../../../domain/troop-editor";

type SyncTroopEditorInteractionsInput = {
  onOpenTroopManagement: (input: { troopId: string }) => void;
  onDisbandTroop: (input: { troopId: string }) => void;
  onCreateTeam: (input: { name: string }) => void;
  onSwapTeams: (input: { firstTroopId: string; secondTroopId: string }) => void;
  onDismissReserveUnit: (input: { reserveMemberId: string }) => void;
  onPurchaseShopOffer: (input: { offerId: string }) => void;
};

type InteractionMode =
  | "idle"
  | "disband-select"
  | "disband-confirm"
  | "create"
  | "sort-select"
  | "dismiss-list"
  | "dismiss-menu"
  | "dismiss-confirm"
  | "recruit-list"
  | "recruit-menu";

type InteractionState = {
  mode: InteractionMode;
  targetTroopId: string | null;
  selectedSortTroopId: string | null;
  selectedDismissReserveMemberId: string | null;
  selectedRecruitOfferId: string | null;
  alertText: string | null;
  createErrorText: string | null;
  isSortToastVisible: boolean;
  sortToastTimeoutId: number | null;
};

const ALERT_TEXT = {
  disbandForbidden: "本队不可解散",
  disbandReserveFull: "预备队空间不足，无法解散队伍",
  recruitReserveFull: "预备队已满，请先解雇士兵",
  recruitGoldInsufficient: "金钱不足",
  recruitFameInsufficient: "声望不足",
} as const;

const CREATE_ERROR_TEXT = {
  emptyName: "队伍名称不能为纯空格或为空",
  duplicateName: "队伍名称不能重复",
} as const;

function readReserveCapacity(root: HTMLElement): number {
  const parsed = Number(root.dataset.reserveCapacity ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function readReserveCount(root: HTMLElement): number {
  const parsed = Number(root.dataset.reserveCount ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function readPlayerGold(root: HTMLElement): number {
  const parsed = Number(root.dataset.playerGold ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function readPlayerFame(root: HTMLElement): number {
  const parsed = Number(root.dataset.playerFame ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function countOccupiedSlots(card: HTMLElement): number {
  return [
    ...card.querySelectorAll<HTMLElement>(".c-troop-preview-grid__slot.is-occupied"),
  ].length;
}

function canDisbandTroop(root: HTMLElement, card: HTMLElement): boolean {
  return readReserveCount(root) + countOccupiedSlots(card) <= readReserveCapacity(root);
}

function setPressedState(button: HTMLButtonElement | null, isPressed: boolean): void {
  if (button == null) {
    return;
  }

  button.classList.toggle("is-selected", isPressed);
  button.setAttribute("aria-pressed", isPressed ? "true" : "false");
}

function setHidden(element: HTMLElement | null, hidden: boolean): void {
  if (element == null) {
    return;
  }

  element.hidden = hidden;
}

function getTroopName(card: HTMLElement): string {
  return (
    card.querySelector<HTMLElement>(".c-troop-editor__troop-name")?.textContent?.trim() ?? ""
  );
}

function placePrompt(
  prompt: HTMLElement | null,
  container: HTMLElement | null,
  anchor: HTMLElement,
  options: {
    width?: number;
    xOffset?: number;
    topOffset?: number;
  } = {}
): void {
  if (prompt == null || container == null) {
    return;
  }

  const promptRect = prompt.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const anchorRect = anchor.getBoundingClientRect();
  const width = options.width ?? Math.max(180, promptRect.width);
  const xOffset = options.xOffset ?? 24;
  const topOffset = options.topOffset ?? Math.max(56, promptRect.height * 0.5);
  const top =
    anchorRect.top -
    containerRect.top +
    anchorRect.height * 0.5 -
    topOffset;
  const left = Math.max(
    8,
    Math.min(
      containerRect.width - width - 8,
      anchorRect.left - containerRect.left + xOffset
    )
  );

  prompt.style.top = `${top}px`;
  prompt.style.left = `${left}px`;
}

export function syncTroopEditorInteractions(
  root: ParentNode,
  input: SyncTroopEditorInteractionsInput
): void {
  const troopEditorRoot = root.querySelector<HTMLElement>("[data-troop-editor-root]");
  if (
    troopEditorRoot == null ||
    troopEditorRoot.dataset.troopEditorInteractionsBound === "true"
  ) {
    return;
  }

  troopEditorRoot.dataset.troopEditorInteractionsBound = "true";

  const disbandButton = troopEditorRoot.querySelector<HTMLButtonElement>(
    "[data-troop-editor-action='disband']"
  );
  const createButton = troopEditorRoot.querySelector<HTMLButtonElement>(
    "[data-troop-editor-action='create']"
  );
  const sortButton = troopEditorRoot.querySelector<HTMLButtonElement>(
    "[data-troop-editor-action='sort']"
  );
  const dismissButton = troopEditorRoot.querySelector<HTMLButtonElement>(
    "[data-troop-editor-action='dismiss']"
  );
  const recruitButton = troopEditorRoot.querySelector<HTMLButtonElement>(
    "[data-troop-editor-action='recruit']"
  );
  const troopEditorBody = troopEditorRoot.querySelector<HTMLElement>(
    "[data-troop-editor-body]"
  );
  const troopList = troopEditorRoot.querySelector<HTMLElement>("[data-troop-editor-list]");
  const troopCards = [
    ...troopEditorRoot.querySelectorAll<HTMLElement>("[data-troop-editor-card][data-troop-id]"),
  ];
  const sortToast = troopEditorRoot.querySelector<HTMLElement>(
    "[data-troop-editor-sort-toast]"
  );
  const createOverlay = troopEditorRoot.querySelector<HTMLElement>(
    "[data-troop-editor-create]"
  );
  const createInput = troopEditorRoot.querySelector<HTMLInputElement>(
    "[data-troop-editor-create-input]"
  );
  const createError = troopEditorRoot.querySelector<HTMLElement>(
    "[data-troop-editor-create-error]"
  );
  const createConfirmButton = troopEditorRoot.querySelector<HTMLButtonElement>(
    "[data-troop-editor-create-choice='confirm']"
  );
  const createCancelButton = troopEditorRoot.querySelector<HTMLButtonElement>(
    "[data-troop-editor-create-choice='cancel']"
  );
  const dismissOverlay = troopEditorRoot.querySelector<HTMLElement>(
    "[data-troop-editor-dismiss-overlay]"
  );
  const dismissPanel = troopEditorRoot.querySelector<HTMLElement>(
    "[data-troop-editor-dismiss-panel]"
  );
  const dismissMemberButtons = [
    ...troopEditorRoot.querySelectorAll<HTMLButtonElement>(
      "[data-troop-editor-dismiss-member]"
    ),
  ];
  const dismissPrompt = troopEditorRoot.querySelector<HTMLElement>(
    "[data-troop-editor-dismiss-prompt]"
  );
  const dismissPromptButton = troopEditorRoot.querySelector<HTMLButtonElement>(
    "[data-troop-editor-dismiss-prompt-action='dismiss']"
  );
  const dismissPromptBackButton = troopEditorRoot.querySelector<HTMLButtonElement>(
    "[data-troop-editor-dismiss-prompt-action='back']"
  );
  const dismissCloseButton = troopEditorRoot.querySelector<HTMLButtonElement>(
    "[data-troop-editor-dismiss-close]"
  );
  const dismissConfirmOverlay = troopEditorRoot.querySelector<HTMLElement>(
    "[data-troop-editor-dismiss-confirm]"
  );
  const dismissConfirmButton = troopEditorRoot.querySelector<HTMLButtonElement>(
    "[data-troop-editor-dismiss-confirm-choice='confirm']"
  );
  const dismissConfirmCancelButton = troopEditorRoot.querySelector<HTMLButtonElement>(
    "[data-troop-editor-dismiss-confirm-choice='cancel']"
  );
  const shopPanel = troopEditorRoot.querySelector<HTMLElement>("[data-troop-editor-shop]");
  const shopOfferButtons = [
    ...troopEditorRoot.querySelectorAll<HTMLButtonElement>(
      "[data-troop-editor-shop-offer]"
    ),
  ];
  const shopPrompt = troopEditorRoot.querySelector<HTMLElement>(
    "[data-troop-editor-shop-prompt]"
  );
  const shopBuyButton = troopEditorRoot.querySelector<HTMLButtonElement>(
    "[data-troop-editor-shop-prompt-action='buy']"
  );
  const shopCancelButton = troopEditorRoot.querySelector<HTMLButtonElement>(
    "[data-troop-editor-shop-prompt-action='cancel']"
  );
  const shopBackButton = troopEditorRoot.querySelector<HTMLButtonElement>(
    "[data-troop-editor-shop-back]"
  );
  const confirmOverlay = troopEditorRoot.querySelector<HTMLElement>(
    "[data-troop-editor-confirm]"
  );
  const confirmText = troopEditorRoot.querySelector<HTMLElement>(
    "[data-troop-editor-confirm-text]"
  );
  const confirmButton = troopEditorRoot.querySelector<HTMLButtonElement>(
    "[data-troop-editor-confirm-choice='confirm']"
  );
  const cancelButton = troopEditorRoot.querySelector<HTMLButtonElement>(
    "[data-troop-editor-confirm-choice='cancel']"
  );
  const alertOverlay = troopEditorRoot.querySelector<HTMLElement>(
    "[data-troop-editor-alert]"
  );
  const alertText = troopEditorRoot.querySelector<HTMLElement>(
    "[data-troop-editor-alert-text]"
  );
  const alertCloseButton = troopEditorRoot.querySelector<HTMLButtonElement>(
    "[data-troop-editor-alert-close]"
  );

  if (
    disbandButton == null ||
    createButton == null ||
    sortButton == null ||
    dismissButton == null ||
    recruitButton == null ||
    troopCards.length === 0
  ) {
    return;
  }

  const state: InteractionState = {
    mode: "idle",
    targetTroopId: null,
    selectedSortTroopId: null,
    selectedDismissReserveMemberId: null,
    selectedRecruitOfferId: null,
    alertText: null,
    createErrorText: null,
    isSortToastVisible: false,
    sortToastTimeoutId: null,
  };

  const clearSortToastTimer = (): void => {
    if (state.sortToastTimeoutId != null) {
      window.clearTimeout(state.sortToastTimeoutId);
      state.sortToastTimeoutId = null;
    }
  };

  const syncUi = (): void => {
    setPressedState(
      disbandButton,
      state.mode === "disband-select" || state.mode === "disband-confirm"
    );
    setPressedState(createButton, state.mode === "create");
    setPressedState(sortButton, state.mode === "sort-select");
    setPressedState(
      dismissButton,
      state.mode === "dismiss-list" ||
        state.mode === "dismiss-menu" ||
        state.mode === "dismiss-confirm"
    );
    setPressedState(
      recruitButton,
      state.mode === "recruit-list" || state.mode === "recruit-menu"
    );

    setHidden(sortToast, !state.isSortToastVisible);
    setHidden(createOverlay, state.mode !== "create");
    setHidden(confirmOverlay, state.mode !== "disband-confirm");
    setHidden(
      dismissOverlay,
      !(state.mode === "dismiss-list" || state.mode === "dismiss-menu")
    );
    setHidden(dismissConfirmOverlay, state.mode !== "dismiss-confirm");
    setHidden(alertOverlay, state.alertText == null);
    setHidden(createError, state.createErrorText == null);
    setHidden(shopPanel, !(state.mode === "recruit-list" || state.mode === "recruit-menu"));

    if (troopEditorBody != null) {
      troopEditorBody.hidden = state.mode === "recruit-list" || state.mode === "recruit-menu";
    }

    if (troopList != null) {
      troopList.hidden = state.mode === "recruit-list" || state.mode === "recruit-menu";
    }

    if (dismissPrompt != null) {
      dismissPrompt.hidden = state.mode !== "dismiss-menu";
    }

    if (shopPrompt != null) {
      shopPrompt.hidden = state.mode !== "recruit-menu";
    }

    if (confirmText != null) {
      confirmText.textContent = "确定要解散队伍吗？被解散的单位将返回预备队。";
    }

    if (alertText != null) {
      alertText.textContent = state.alertText ?? "";
    }

    if (createError != null) {
      createError.textContent = state.createErrorText ?? "";
    }

    troopCards.forEach((card) => {
      const troopId = card.dataset.troopId ?? "";
      card.classList.toggle("is-disband-selectable", state.mode === "disband-select");
      card.classList.toggle(
        "is-disband-target",
        state.mode === "disband-confirm" && troopId === state.targetTroopId
      );
      card.classList.toggle("is-sort-selectable", state.mode === "sort-select");
      card.classList.toggle(
        "is-sort-selected",
        state.mode === "sort-select" && troopId === state.selectedSortTroopId
      );
    });

    dismissMemberButtons.forEach((button) => {
      button.classList.toggle(
        "is-selected",
        state.selectedDismissReserveMemberId != null &&
          button.dataset.troopEditorDismissMember === state.selectedDismissReserveMemberId
      );
    });

    shopOfferButtons.forEach((button) => {
      button.classList.toggle(
        "is-selected",
        state.selectedRecruitOfferId != null &&
          button.dataset.troopEditorShopOffer === state.selectedRecruitOfferId
      );
    });
  };

  const resetToIdle = (): void => {
    clearSortToastTimer();
    state.mode = "idle";
    state.targetTroopId = null;
    state.selectedSortTroopId = null;
    state.selectedDismissReserveMemberId = null;
    state.selectedRecruitOfferId = null;
    state.alertText = null;
    state.createErrorText = null;
    state.isSortToastVisible = false;
    if (createInput != null) {
      createInput.value = "";
    }
    syncUi();
  };

  const showAlert = (message: string): void => {
    state.alertText = message;
    syncUi();
  };

  const dismissAlert = (): void => {
    state.alertText = null;
    syncUi();
  };

  const openCreateDialog = (): void => {
    clearSortToastTimer();
    state.mode = "create";
    state.targetTroopId = null;
    state.selectedSortTroopId = null;
    state.selectedDismissReserveMemberId = null;
    state.selectedRecruitOfferId = null;
    state.alertText = null;
    state.createErrorText = null;
    state.isSortToastVisible = false;
    syncUi();
    createInput?.focus();
    createInput?.select();
  };

  const openSortMode = (): void => {
    clearSortToastTimer();
    state.mode = "sort-select";
    state.targetTroopId = null;
    state.selectedSortTroopId = null;
    state.selectedDismissReserveMemberId = null;
    state.selectedRecruitOfferId = null;
    state.alertText = null;
    state.createErrorText = null;
    state.isSortToastVisible = true;
    state.sortToastTimeoutId = window.setTimeout(() => {
      state.isSortToastVisible = false;
      state.sortToastTimeoutId = null;
      syncUi();
    }, 3000);
    syncUi();
  };

  const openDismissList = (): void => {
    clearSortToastTimer();
    state.mode = "dismiss-list";
    state.targetTroopId = null;
    state.selectedSortTroopId = null;
    state.selectedDismissReserveMemberId = null;
    state.selectedRecruitOfferId = null;
    state.alertText = null;
    state.createErrorText = null;
    state.isSortToastVisible = false;
    syncUi();
  };

  const openRecruitList = (): void => {
    clearSortToastTimer();
    state.mode = "recruit-list";
    state.targetTroopId = null;
    state.selectedSortTroopId = null;
    state.selectedDismissReserveMemberId = null;
    state.selectedRecruitOfferId = null;
    state.alertText = null;
    state.createErrorText = null;
    state.isSortToastVisible = false;
    syncUi();
  };

  const readNormalizedCreateName = (): string => {
    return createInput?.value.trim() ?? "";
  };

  const hasDuplicateName = (name: string): boolean => {
    return troopCards.some((card) => getTroopName(card) === name);
  };

  const findRecruitOfferButton = (): HTMLButtonElement | null => {
    if (state.selectedRecruitOfferId == null) {
      return null;
    }

    return (
      shopOfferButtons.find(
        (button) => button.dataset.troopEditorShopOffer === state.selectedRecruitOfferId
      ) ?? null
    );
  };

  disbandButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (state.mode === "idle") {
      clearSortToastTimer();
      state.mode = "disband-select";
      state.targetTroopId = null;
      state.selectedSortTroopId = null;
      state.selectedDismissReserveMemberId = null;
      state.selectedRecruitOfferId = null;
      state.alertText = null;
      state.createErrorText = null;
      state.isSortToastVisible = false;
      syncUi();
      return;
    }

    resetToIdle();
  });

  createButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (state.mode === "create") {
      resetToIdle();
      return;
    }

    openCreateDialog();
  });

  sortButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (state.mode === "sort-select") {
      resetToIdle();
      return;
    }

    openSortMode();
  });

  dismissButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (
      state.mode === "dismiss-list" ||
      state.mode === "dismiss-menu" ||
      state.mode === "dismiss-confirm"
    ) {
      resetToIdle();
      return;
    }

    openDismissList();
  });

  recruitButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (state.mode === "recruit-list" || state.mode === "recruit-menu") {
      resetToIdle();
      return;
    }

    openRecruitList();
  });

  troopCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const troopId = card.dataset.troopId ?? "";
      if (troopId.length === 0) {
        return;
      }

      if (state.mode === "idle") {
        input.onOpenTroopManagement({ troopId });
        return;
      }

      if (state.mode === "sort-select") {
        if (state.selectedSortTroopId == null) {
          state.selectedSortTroopId = troopId;
          syncUi();
          return;
        }

        if (state.selectedSortTroopId === troopId) {
          state.selectedSortTroopId = null;
          syncUi();
          return;
        }

        input.onSwapTeams({
          firstTroopId: state.selectedSortTroopId,
          secondTroopId: troopId,
        });
        return;
      }

      if (state.mode !== "disband-select") {
        return;
      }

      if (troopId === PLAYER_MAIN_TROOP_ID) {
        showAlert(ALERT_TEXT.disbandForbidden);
        return;
      }

      if (!canDisbandTroop(troopEditorRoot, card)) {
        showAlert(ALERT_TEXT.disbandReserveFull);
        return;
      }

      state.mode = "disband-confirm";
      state.targetTroopId = troopId;
      state.alertText = null;
      syncUi();
    });
  });

  dismissMemberButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      state.mode = "dismiss-menu";
      state.selectedDismissReserveMemberId =
        button.dataset.troopEditorDismissMember ?? null;
      syncUi();
      placePrompt(dismissPrompt, dismissPanel, button);
    });
  });

  shopOfferButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      state.mode = "recruit-menu";
      state.selectedRecruitOfferId = button.dataset.troopEditorShopOffer ?? null;
      syncUi();
      placePrompt(shopPrompt, shopPanel, button, {
        width: 180,
        xOffset: 20,
      });
    });
  });

  createConfirmButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const normalizedName = readNormalizedCreateName();
    if (normalizedName.length === 0) {
      state.createErrorText = CREATE_ERROR_TEXT.emptyName;
      syncUi();
      return;
    }

    if (hasDuplicateName(normalizedName)) {
      state.createErrorText = CREATE_ERROR_TEXT.duplicateName;
      syncUi();
      return;
    }

    input.onCreateTeam({ name: normalizedName });
  });

  createCancelButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    resetToIdle();
  });

  createInput?.addEventListener("input", () => {
    if (state.mode !== "create") {
      return;
    }

    state.createErrorText = null;
    syncUi();
  });

  dismissPromptButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (state.selectedDismissReserveMemberId == null) {
      return;
    }

    state.mode = "dismiss-confirm";
    syncUi();
  });

  dismissPromptBackButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openDismissList();
  });

  dismissCloseButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    resetToIdle();
  });

  dismissConfirmButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (state.selectedDismissReserveMemberId == null) {
      return;
    }

    input.onDismissReserveUnit({
      reserveMemberId: state.selectedDismissReserveMemberId,
    });
  });

  dismissConfirmCancelButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openDismissList();
  });

  shopBuyButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const offerButton = findRecruitOfferButton();
    if (offerButton == null) {
      return;
    }

    const reserveCount = readReserveCount(troopEditorRoot);
    const reserveCapacity = readReserveCapacity(troopEditorRoot);
    if (reserveCount >= reserveCapacity) {
      state.mode = "recruit-list";
      state.selectedRecruitOfferId = null;
      showAlert(ALERT_TEXT.recruitReserveFull);
      return;
    }

    const price = Number(offerButton.dataset.price ?? 0);
    if (readPlayerGold(troopEditorRoot) < price) {
      state.mode = "recruit-list";
      state.selectedRecruitOfferId = null;
      showAlert(ALERT_TEXT.recruitGoldInsufficient);
      return;
    }

    const requiredFame = Number(offerButton.dataset.requiredFame ?? 0);
    if (readPlayerFame(troopEditorRoot) < requiredFame) {
      state.mode = "recruit-list";
      state.selectedRecruitOfferId = null;
      showAlert(ALERT_TEXT.recruitFameInsufficient);
      return;
    }

    const offerId = offerButton.dataset.offerId ?? "";
    if (offerId.length === 0) {
      return;
    }

    input.onPurchaseShopOffer({ offerId });
  });

  shopCancelButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openRecruitList();
  });

  shopBackButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    resetToIdle();
  });

  confirmButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (state.mode !== "disband-confirm" || state.targetTroopId == null) {
      return;
    }

    const targetCard =
      troopCards.find((card) => card.dataset.troopId === state.targetTroopId) ?? null;
    if (targetCard == null) {
      resetToIdle();
      return;
    }

    if (state.targetTroopId === PLAYER_MAIN_TROOP_ID) {
      state.mode = "disband-select";
      state.targetTroopId = null;
      showAlert(ALERT_TEXT.disbandForbidden);
      return;
    }

    if (!canDisbandTroop(troopEditorRoot, targetCard)) {
      state.mode = "disband-select";
      state.targetTroopId = null;
      showAlert(ALERT_TEXT.disbandReserveFull);
      return;
    }

    input.onDisbandTroop({ troopId: state.targetTroopId });
  });

  cancelButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    resetToIdle();
  });

  alertCloseButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (state.alertText === ALERT_TEXT.disbandForbidden) {
      resetToIdle();
      return;
    }

    dismissAlert();
  });

  syncUi();
}
