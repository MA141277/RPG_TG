import type { BattleFormationSlotKey } from "../../../domain/battle-formation";
import { PLAYER_MAIN_TROOP_ID } from "../../../domain/troop-editor";

type SyncTroopManagementMoveInteractionsInput = {
  onSelectUnit: () => void;
  onMoveUnit: (input: {
    troopId: string;
    fromSlotKey: BattleFormationSlotKey;
    toSlotKey: BattleFormationSlotKey;
  }) => void;
  onRemoveUnit: (input: {
    troopId: string;
    slotKey: BattleFormationSlotKey;
  }) => void;
  onAddUnit: (input: {
    troopId: string;
    reserveMemberId: string;
    toSlotKey: BattleFormationSlotKey;
  }) => void;
  onClearTroop: (input: {
    troopId: string;
  }) => void;
  onDisbandTroop: (input: {
    troopId: string;
  }) => void;
};

type InteractionMode =
  | "idle"
  | "move-select"
  | "move-place"
  | "remove-select"
  | "confirm"
  | "reserve-list"
  | "reserve-menu"
  | "add-place";

type ConfirmKind = "remove" | "clear" | "disband" | null;

type InteractionState = {
  mode: InteractionMode;
  selectedSlotKey: BattleFormationSlotKey | null;
  hoveredTargetSlotKey: BattleFormationSlotKey | null;
  selectedReserveMemberId: string | null;
  confirmKind: ConfirmKind;
  followGhost: HTMLElement | null;
  previewGhost: HTMLElement | null;
  alertText: string | null;
};

type BoundBattlefieldElements = {
  document: Document;
  grid: HTMLElement;
  slots: HTMLElement[];
};

const TROOP_MANAGEMENT_IFRAME_STYLE_ID = "rpg-tg-troop-management-style";

const ALERT_TEXT = {
  addFull: "当前队伍已满，无法编入更多单位",
  reserveFullForRemove: "请先解雇其他士兵后再增加单位",
  clearReserveFull: "预备队空间不足，无法清空队伍",
  disbandReserveFull: "预备队空间不足，无法解散队伍",
  disbandForbidden: "本队不可解散",
  captainRemoveForbidden: "褰撳墠闃熼暱涓嶅彲鐩存帴绉诲嚭闃熶紞",
} as const;

function injectInteractionStyles(documentNode: Document): void {
  if (documentNode.getElementById(TROOP_MANAGEMENT_IFRAME_STYLE_ID) != null) {
    return;
  }

  const styleElement = documentNode.createElement("style");
  styleElement.id = TROOP_MANAGEMENT_IFRAME_STYLE_ID;
  styleElement.textContent = `
    .formation-slot.rpg-tg-move-source-candidate,
    .formation-slot.rpg-tg-move-source-selected,
    .formation-slot.rpg-tg-move-target-candidate,
    .formation-slot.rpg-tg-move-target-hover,
    .formation-slot.rpg-tg-add-target-candidate,
    .formation-slot.rpg-tg-add-target-hover,
    .formation-slot.rpg-tg-remove-source-candidate {
      opacity: 1 !important;
    }

    .formation-slot.rpg-tg-move-source-candidate::after,
    .formation-slot.rpg-tg-move-source-selected::after,
    .formation-slot.rpg-tg-move-target-candidate::after,
    .formation-slot.rpg-tg-move-target-hover::after,
    .formation-slot.rpg-tg-add-target-candidate::after,
    .formation-slot.rpg-tg-add-target-hover::after,
    .formation-slot.rpg-tg-remove-source-candidate::after {
      content: "";
      position: absolute;
      inset: 8px 10px 38px;
      border-radius: 20px 20px 14px 14px;
      pointer-events: none;
    }

    .formation-slot.rpg-tg-move-source-candidate::after {
      border: 2px solid rgba(255, 224, 122, 0.88);
      box-shadow: 0 0 16px rgba(255, 214, 92, 0.32);
    }

    .formation-slot.rpg-tg-move-source-selected::after {
      border: 2px solid rgba(255, 241, 174, 0.96);
      box-shadow:
        0 0 22px rgba(255, 229, 122, 0.48),
        0 0 8px rgba(255, 244, 210, 0.42);
    }

    .formation-slot.empty.rpg-tg-move-target-candidate .slot-name,
    .formation-slot.empty.rpg-tg-move-target-candidate .member-name,
    .formation-slot.empty.rpg-tg-move-target-hover .slot-name,
    .formation-slot.empty.rpg-tg-move-target-hover .member-name,
    .formation-slot.empty.rpg-tg-add-target-candidate .slot-name,
    .formation-slot.empty.rpg-tg-add-target-candidate .member-name,
    .formation-slot.empty.rpg-tg-add-target-hover .slot-name,
    .formation-slot.empty.rpg-tg-add-target-hover .member-name {
      color: #5e421b;
      background:
        linear-gradient(180deg, rgba(255, 244, 203, 0.98), rgba(228, 198, 140, 0.96));
      box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.24),
        inset 0 0 0 1px rgba(126, 88, 35, 0.3);
    }

    .formation-slot.empty.rpg-tg-move-target-candidate::after,
    .formation-slot.empty.rpg-tg-add-target-candidate::after {
      border: 2px dashed rgba(214, 183, 110, 0.92);
      box-shadow: 0 0 14px rgba(208, 169, 78, 0.26);
    }

    .formation-slot.empty.rpg-tg-move-target-hover::after,
    .formation-slot.empty.rpg-tg-add-target-hover::after {
      border: 2px solid rgba(255, 239, 180, 0.98);
      box-shadow:
        0 0 18px rgba(255, 226, 116, 0.46),
        0 0 6px rgba(255, 244, 210, 0.36);
    }

    .formation-slot.rpg-tg-remove-source-candidate::after {
      border: 2px solid rgba(208, 70, 56, 0.94);
      box-shadow:
        0 0 18px rgba(185, 43, 29, 0.4),
        inset 0 0 0 1px rgba(255, 227, 213, 0.14);
    }

    .formation-slot.rpg-tg-move-source-selected {
      cursor: grabbing;
    }

    .formation-slot.rpg-tg-move-source-candidate,
    .formation-slot.rpg-tg-remove-source-candidate,
    .formation-slot.rpg-tg-add-target-candidate {
      cursor: pointer;
    }

    .rpg-tg-follow-ghost,
    .rpg-tg-preview-ghost {
      pointer-events: none !important;
      opacity: 0.7;
      filter:
        drop-shadow(0 14px 8px rgba(0, 0, 0, 0.2))
        sepia(0.1)
        saturate(0.88);
    }

    .rpg-tg-follow-ghost {
      position: fixed !important;
      left: 0;
      top: 0;
      z-index: 9999 !important;
      opacity: 0.78;
    }

    .rpg-tg-preview-ghost {
      position: absolute !important;
      opacity: 0.58;
      z-index: 9998 !important;
    }
  `;
  documentNode.head.appendChild(styleElement);
}

function resolveBoundBattlefieldElements(
  frame: HTMLIFrameElement
): BoundBattlefieldElements | null {
  const documentNode = frame.contentDocument;
  if (documentNode == null) {
    return null;
  }

  const grid =
    documentNode.querySelector<HTMLElement>("#battle-attacker-grid") ??
    documentNode.querySelector<HTMLElement>(".formation-side.player .formation-grid");
  if (grid == null) {
    return null;
  }

  const slots = [...grid.querySelectorAll<HTMLElement>(".formation-slot[data-slot]")];
  if (slots.length === 0) {
    return null;
  }

  return {
    document: documentNode,
    grid,
    slots,
  };
}

function cleanupGhost(ghost: HTMLElement | null): void {
  ghost?.remove();
}

function cleanupSlotClasses(slots: HTMLElement[]): void {
  for (const slot of slots) {
    slot.classList.remove(
      "rpg-tg-move-source-candidate",
      "rpg-tg-move-source-selected",
      "rpg-tg-move-target-candidate",
      "rpg-tg-move-target-hover",
      "rpg-tg-add-target-candidate",
      "rpg-tg-add-target-hover",
      "rpg-tg-remove-source-candidate"
    );
  }
}

function createGhostFromSlot(sourceSlot: HTMLElement): HTMLElement {
  const ghost = sourceSlot.cloneNode(true) as HTMLElement;
  ghost.classList.remove(
    "empty",
    "fallen",
    "striker",
    "targeted",
    "is-proxying",
    "rpg-tg-move-source-candidate",
    "rpg-tg-move-source-selected",
    "rpg-tg-move-target-candidate",
    "rpg-tg-move-target-hover",
    "rpg-tg-add-target-candidate",
    "rpg-tg-add-target-hover",
    "rpg-tg-remove-source-candidate"
  );
  delete ghost.dataset.slot;
  return ghost;
}

function updateFollowGhostPosition(ghost: HTMLElement | null, event: MouseEvent): void {
  if (ghost == null) {
    return;
  }

  ghost.style.left = `${event.clientX}px`;
  ghost.style.top = `${event.clientY}px`;
}

function findSlotByKey(
  slots: HTMLElement[],
  slotKey: BattleFormationSlotKey | null
): HTMLElement | null {
  if (slotKey == null) {
    return null;
  }

  return slots.find((slot) => slot.dataset.slot === slotKey) ?? null;
}

function setActionButtonPressedState(
  button: HTMLButtonElement | null | undefined,
  isPressed: boolean
): void {
  if (button == null) {
    return;
  }

  button.classList.toggle("is-selected", isPressed);
  button.setAttribute("aria-pressed", isPressed ? "true" : "false");
}

function setElementHidden(element: HTMLElement | null, isHidden: boolean): void {
  if (element == null) {
    return;
  }

  element.hidden = isHidden;
}

function syncConfirmButtonSound(
  button: HTMLButtonElement | null,
  confirmKind: ConfirmKind
): void {
  if (button == null) {
    return;
  }

  if (confirmKind === "disband") {
    button.dataset.buttonSound = "heavy";
    return;
  }

  delete button.dataset.buttonSound;
}

function readReserveCapacity(root: HTMLElement): number {
  const parsed = Number(root.dataset.reserveCapacity ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function readReserveCount(root: HTMLElement): number {
  const parsed = Number(root.dataset.reserveCount ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function hasEmptyFormationSlot(slots: HTMLElement[]): boolean {
  return slots.some((slot) => slot.classList.contains("empty"));
}

function countOccupiedFormationSlots(slots: HTMLElement[]): number {
  return slots.reduce(
    (count, slot) => count + (slot.classList.contains("empty") ? 0 : 1),
    0
  );
}

function canSendAllMembersToReserve(root: HTMLElement, slots: HTMLElement[]): boolean {
  return (
    readReserveCount(root) + countOccupiedFormationSlots(slots) <=
    readReserveCapacity(root)
  );
}

function syncSlotClasses(slots: HTMLElement[], state: InteractionState): void {
  cleanupSlotClasses(slots);

  for (const slot of slots) {
    const isEmpty = slot.classList.contains("empty");
    const slotKey = slot.dataset.slot as BattleFormationSlotKey | undefined;

    slot.classList.toggle(
      "rpg-tg-move-source-candidate",
      state.mode === "move-select" && !isEmpty
    );
    slot.classList.toggle(
      "rpg-tg-move-source-selected",
      state.mode === "move-place" &&
        state.selectedSlotKey != null &&
        slotKey === state.selectedSlotKey
    );
    slot.classList.toggle(
      "rpg-tg-move-target-candidate",
      state.mode === "move-place" && isEmpty
    );
    slot.classList.toggle(
      "rpg-tg-move-target-hover",
      state.mode === "move-place" &&
        state.hoveredTargetSlotKey != null &&
        slotKey === state.hoveredTargetSlotKey
    );
    slot.classList.toggle(
      "rpg-tg-add-target-candidate",
      state.mode === "add-place" && isEmpty
    );
    slot.classList.toggle(
      "rpg-tg-add-target-hover",
      state.mode === "add-place" &&
        state.hoveredTargetSlotKey != null &&
        slotKey === state.hoveredTargetSlotKey
    );
    slot.classList.toggle(
      "rpg-tg-remove-source-candidate",
      state.mode === "remove-select" && !isEmpty
    );
  }
}

function clearTransientGhosts(state: InteractionState): void {
  cleanupGhost(state.followGhost);
  cleanupGhost(state.previewGhost);
  state.followGhost = null;
  state.previewGhost = null;
}

function resetInteractionState(state: InteractionState): void {
  state.mode = "idle";
  state.selectedSlotKey = null;
  state.hoveredTargetSlotKey = null;
  state.selectedReserveMemberId = null;
  state.confirmKind = null;
  state.alertText = null;
  clearTransientGhosts(state);
}

function syncConfirmCopy(
  titleElement: HTMLElement | null,
  textElement: HTMLElement | null,
  confirmKind: ConfirmKind
): void {
  if (titleElement == null || textElement == null) {
    return;
  }

  if (confirmKind === "clear") {
    titleElement.textContent = "清空队伍";
    textElement.textContent = "确定要清空队伍吗？（被清空的单位将返回预备队）";
    return;
  }

  if (confirmKind === "disband") {
    titleElement.textContent = "解散队伍";
    textElement.textContent = "确定要解散队伍吗？（被解散的单位将返回预备队）";
    return;
  }

  titleElement.textContent = "移除单位";
  textElement.textContent = "确定要移除这个单位吗？（单位将返回预备队）";
}

function attachTroopManagementMoveHandlers(
  root: HTMLElement,
  frame: HTMLIFrameElement,
  input: SyncTroopManagementMoveInteractionsInput
): void {
  const troopId = root.dataset.troopId ?? "";
  const captainSlotKey =
    (root.dataset.captainSlotKey as BattleFormationSlotKey | undefined) ?? null;
  const moveButton = root.querySelector<HTMLButtonElement>(
    "[data-troop-management-action='move']"
  );
  const addButton = root.querySelector<HTMLButtonElement>(
    "[data-troop-management-action='add']"
  );
  const removeButton = root.querySelector<HTMLButtonElement>(
    "[data-troop-management-action='remove']"
  );
  const clearButton = root.querySelector<HTMLButtonElement>(
    "[data-troop-management-action='clear']"
  );
  const disbandButton = root.querySelector<HTMLButtonElement>(
    "[data-troop-management-action='disband']"
  );
  const actionsPanel = root.querySelector<HTMLElement>(
    "[data-troop-management-actions-panel]"
  );
  const reservePanel = root.querySelector<HTMLElement>(
    "[data-troop-management-reserve-panel]"
  );
  const reservePrompt = root.querySelector<HTMLElement>(
    "[data-troop-management-reserve-prompt]"
  );
  const reserveAssignButton = root.querySelector<HTMLButtonElement>(
    "[data-troop-management-reserve-prompt-action='assign']"
  );
  const reserveBackButton = root.querySelector<HTMLButtonElement>(
    "[data-troop-management-reserve-prompt-action='back']"
  );
  const reserveCloseButton = root.querySelector<HTMLButtonElement>(
    "[data-troop-management-reserve-close]"
  );
  const reserveMemberButtons = [
    ...root.querySelectorAll<HTMLButtonElement>("[data-troop-management-reserve-member]"),
  ];
  const battlefieldShell = root.querySelector<HTMLElement>(
    "[data-troop-management-battlefield-shell]"
  );
  const confirmOverlay = root.querySelector<HTMLElement>(
    "[data-troop-management-remove-confirm]"
  );
  const confirmTitle = root.querySelector<HTMLElement>(
    "[data-troop-management-confirm-title]"
  );
  const confirmText = root.querySelector<HTMLElement>(
    "[data-troop-management-confirm-text]"
  );
  const confirmButton = root.querySelector<HTMLButtonElement>(
    "[data-troop-management-remove-confirm-choice='confirm']"
  );
  const cancelButton = root.querySelector<HTMLButtonElement>(
    "[data-troop-management-remove-confirm-choice='cancel']"
  );
  const alertOverlay = root.querySelector<HTMLElement>("[data-troop-management-alert]");
  const alertText = root.querySelector<HTMLElement>("[data-troop-management-alert-text]");
  const alertCloseButton = root.querySelector<HTMLButtonElement>(
    "[data-troop-management-alert-close]"
  );

  if (
    troopId.length === 0 ||
    moveButton == null ||
    addButton == null ||
    removeButton == null ||
    clearButton == null ||
    disbandButton == null ||
    battlefieldShell == null
  ) {
    return;
  }

  const bound = resolveBoundBattlefieldElements(frame);
  if (bound == null) {
    return;
  }

  injectInteractionStyles(bound.document);

  const state: InteractionState = {
    mode: "idle",
    selectedSlotKey: null,
    hoveredTargetSlotKey: null,
    selectedReserveMemberId: null,
    confirmKind: null,
    followGhost: null,
    previewGhost: null,
    alertText: null,
  };

  const syncUi = (): void => {
    const showReservePanel =
      state.mode === "reserve-list" ||
      state.mode === "reserve-menu" ||
      state.mode === "add-place";
    const showConfirm = state.mode === "confirm";
    const showAlert = state.alertText != null;

    setActionButtonPressedState(
      moveButton,
      state.mode === "move-select" || state.mode === "move-place"
    );
    setActionButtonPressedState(addButton, showReservePanel);
    setActionButtonPressedState(
      removeButton,
      state.mode === "remove-select" ||
        (state.mode === "confirm" && state.confirmKind === "remove")
    );
    setActionButtonPressedState(
      clearButton,
      state.mode === "confirm" && state.confirmKind === "clear"
    );
    setActionButtonPressedState(
      disbandButton,
      state.mode === "confirm" && state.confirmKind === "disband"
    );

    setElementHidden(actionsPanel, showReservePanel);
    setElementHidden(reservePanel, !showReservePanel);
    setElementHidden(confirmOverlay, !showConfirm);
    setElementHidden(alertOverlay, !showAlert);

    if (alertText != null) {
      alertText.textContent = state.alertText ?? "";
    }

    syncConfirmCopy(confirmTitle, confirmText, state.confirmKind);
    syncConfirmButtonSound(confirmButton, state.confirmKind);

    reserveMemberButtons.forEach((button) => {
      button.classList.toggle(
        "is-selected",
        state.selectedReserveMemberId != null &&
          button.dataset.troopManagementReserveMember === state.selectedReserveMemberId
      );
    });

    if (reservePrompt != null) {
      const shouldShowPrompt =
        state.mode === "reserve-menu" && state.selectedReserveMemberId != null;
      reservePrompt.hidden = !shouldShowPrompt;
    }

    syncSlotClasses(bound.slots, state);
  };

  const showAlert = (message: string): void => {
    state.alertText = message;
    syncUi();
  };

  const dismissAlert = (): void => {
    state.alertText = null;
    syncUi();
  };

  const resetToIdle = (): void => {
    resetInteractionState(state);
    syncUi();
  };

  const resetToReserveList = (): void => {
    state.mode = "reserve-list";
    state.selectedSlotKey = null;
    state.hoveredTargetSlotKey = null;
    state.selectedReserveMemberId = null;
    state.confirmKind = null;
    state.alertText = null;
    clearTransientGhosts(state);
    syncUi();
  };

  const enterMode = (mode: InteractionMode): void => {
    resetInteractionState(state);
    state.mode = mode;
    syncUi();
  };

  const getHoveredEmptySlotKey = (event: MouseEvent): BattleFormationSlotKey | null => {
    const target = event.target as HTMLElement | null;
    const hoveredSlot = target?.closest<HTMLElement>(".formation-slot[data-slot]") ?? null;
    if (hoveredSlot == null || !hoveredSlot.classList.contains("empty")) {
      return null;
    }

    return (hoveredSlot.dataset.slot as BattleFormationSlotKey | undefined) ?? null;
  };

  const syncPreviewGhost = (): void => {
    cleanupGhost(state.previewGhost);
    state.previewGhost = null;

    if (state.mode !== "move-place" && state.mode !== "add-place") {
      return;
    }

    const sourceSlot = findSlotByKey(bound.slots, state.selectedSlotKey);
    const targetSlot = findSlotByKey(bound.slots, state.hoveredTargetSlotKey);
    if (sourceSlot == null || targetSlot == null) {
      return;
    }

    const previewGhost = createGhostFromSlot(sourceSlot);
    previewGhost.classList.add("rpg-tg-preview-ghost");
    previewGhost.style.left = targetSlot.style.left;
    previewGhost.style.top = targetSlot.style.top;
    previewGhost.style.zIndex = String(Number(targetSlot.style.zIndex || 0) + 5);
    bound.grid.appendChild(previewGhost);
    state.previewGhost = previewGhost;
  };

  const selectMoveSourceSlot = (slotKey: BattleFormationSlotKey): void => {
    const sourceSlot = findSlotByKey(bound.slots, slotKey);
    if (sourceSlot == null) {
      return;
    }

    clearTransientGhosts(state);
    state.mode = "move-place";
    state.selectedSlotKey = slotKey;
    state.hoveredTargetSlotKey = null;
    state.followGhost = createGhostFromSlot(sourceSlot);
    state.followGhost.classList.add("rpg-tg-follow-ghost");
    bound.document.body.appendChild(state.followGhost);
    syncUi();
  };

  const openConfirm = (config: {
    kind: Exclude<ConfirmKind, null>;
    slotKey?: BattleFormationSlotKey | null;
  }): void => {
    clearTransientGhosts(state);
    cleanupSlotClasses(bound.slots);
    state.mode = "confirm";
    state.confirmKind = config.kind;
    state.selectedSlotKey = config.slotKey ?? null;
    state.hoveredTargetSlotKey = null;
    syncUi();
  };

  const placeReservePrompt = (button: HTMLButtonElement): void => {
    if (reservePrompt == null || reservePanel == null) {
      return;
    }

    const promptRect = reservePrompt.getBoundingClientRect();
    const panelRect = reservePanel.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const top =
      buttonRect.top -
      panelRect.top +
      buttonRect.height * 0.5 -
      Math.max(56, promptRect.height * 0.5);
    const left = Math.max(
      8,
      Math.min(
        panelRect.width - Math.max(180, promptRect.width) - 8,
        buttonRect.left - panelRect.left + 24
      )
    );

    reservePrompt.style.top = `${top}px`;
    reservePrompt.style.left = `${left}px`;
  };

  const enterReserveMenuForMember = (memberButton: HTMLButtonElement): void => {
    state.mode = "reserve-menu";
    state.selectedReserveMemberId =
      memberButton.dataset.troopManagementReserveMember ?? null;
    state.selectedSlotKey = null;
    state.hoveredTargetSlotKey = null;
    state.confirmKind = null;
    clearTransientGhosts(state);
    syncUi();
    placeReservePrompt(memberButton);
  };

  moveButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (state.mode === "move-select" || state.mode === "move-place") {
      resetToIdle();
      return;
    }

    enterMode("move-select");
  });

  addButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    resetToReserveList();
  });

  removeButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (
      state.mode === "remove-select" ||
      (state.mode === "confirm" && state.confirmKind === "remove")
    ) {
      resetToIdle();
      return;
    }

    enterMode("remove-select");
  });

  clearButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (state.mode === "confirm" && state.confirmKind === "clear") {
      resetToIdle();
      return;
    }

    if (!canSendAllMembersToReserve(root, bound.slots)) {
      resetToIdle();
      showAlert(ALERT_TEXT.clearReserveFull);
      return;
    }

    openConfirm({ kind: "clear" });
  });

  disbandButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (troopId === PLAYER_MAIN_TROOP_ID) {
      resetToIdle();
      showAlert(ALERT_TEXT.disbandForbidden);
      return;
    }

    if (state.mode === "confirm" && state.confirmKind === "disband") {
      resetToIdle();
      return;
    }

    if (!canSendAllMembersToReserve(root, bound.slots)) {
      resetToIdle();
      showAlert(ALERT_TEXT.disbandReserveFull);
      return;
    }

    openConfirm({ kind: "disband" });
  });

  reserveMemberButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      enterReserveMenuForMember(button);
    });
  });

  reserveBackButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    resetToReserveList();
  });

  reserveCloseButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    resetToIdle();
  });

  reserveAssignButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (state.selectedReserveMemberId == null) {
      return;
    }

    if (!hasEmptyFormationSlot(bound.slots)) {
      resetToReserveList();
      showAlert(ALERT_TEXT.addFull);
      return;
    }

    clearTransientGhosts(state);
    state.selectedSlotKey = null;
    state.mode = "add-place";
    state.hoveredTargetSlotKey = null;
    state.confirmKind = null;
    syncUi();
  });

  battlefieldShell.addEventListener("mouseleave", () => {
    if (state.mode === "confirm" || state.alertText != null) {
      return;
    }

    if (state.mode === "add-place") {
      resetToReserveList();
      return;
    }

    if (state.mode !== "idle" && state.mode !== "reserve-list" && state.mode !== "reserve-menu") {
      resetToIdle();
    }
  });

  bound.document.addEventListener("mousemove", (event) => {
    if (
      (state.mode !== "move-place" && state.mode !== "add-place") ||
      state.selectedSlotKey == null
    ) {
      return;
    }

    updateFollowGhostPosition(state.followGhost, event);
    state.hoveredTargetSlotKey = getHoveredEmptySlotKey(event);
    syncUi();
    syncPreviewGhost();
  });

  bound.document.addEventListener("mouseleave", () => {
    if (state.mode === "confirm" || state.alertText != null) {
      return;
    }

    if (state.mode === "add-place") {
      resetToReserveList();
      return;
    }

    if (state.mode !== "idle" && state.mode !== "reserve-list" && state.mode !== "reserve-menu") {
      resetToIdle();
    }
  });

  bound.document.addEventListener(
    "click",
    (event) => {
      if (state.mode === "idle" || state.mode === "confirm" || state.alertText != null) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const slot = target?.closest<HTMLElement>(".formation-slot[data-slot]") ?? null;
      const slotKey = (slot?.dataset.slot as BattleFormationSlotKey | undefined) ?? null;
      const isEmptySlot = slot?.classList.contains("empty") ?? false;

      event.preventDefault();
      event.stopPropagation();

      if (state.mode === "move-select") {
        if (slotKey != null && !isEmptySlot) {
          input.onSelectUnit();
          selectMoveSourceSlot(slotKey);
          return;
        }

        resetToIdle();
        return;
      }

      if (state.mode === "move-place") {
        if (slotKey != null && isEmptySlot && state.selectedSlotKey != null) {
          input.onMoveUnit({
            troopId,
            fromSlotKey: state.selectedSlotKey,
            toSlotKey: slotKey,
          });
          return;
        }

        resetToIdle();
        return;
      }

      if (state.mode === "remove-select") {
        if (slotKey != null && !isEmptySlot) {
          if (slotKey === captainSlotKey) {
            resetToIdle();
            showAlert(ALERT_TEXT.captainRemoveForbidden);
            return;
          }

          if (readReserveCount(root) >= readReserveCapacity(root)) {
            resetToIdle();
            showAlert(ALERT_TEXT.reserveFullForRemove);
            return;
          }

          input.onSelectUnit();
          openConfirm({ kind: "remove", slotKey });
          return;
        }

        resetToIdle();
        return;
      }

      if (state.mode === "add-place") {
        if (slotKey != null && isEmptySlot && state.selectedReserveMemberId != null) {
          input.onAddUnit({
            troopId,
            reserveMemberId: state.selectedReserveMemberId,
            toSlotKey: slotKey,
          });
          return;
        }

        resetToReserveList();
      }
    },
    true
  );

  confirmButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (state.mode !== "confirm") {
      return;
    }

    if (state.confirmKind === "remove") {
      if (state.selectedSlotKey == null) {
        return;
      }

      if (readReserveCount(root) >= readReserveCapacity(root)) {
        resetToIdle();
        showAlert(ALERT_TEXT.reserveFullForRemove);
        return;
      }

      input.onRemoveUnit({
        troopId,
        slotKey: state.selectedSlotKey,
      });
      return;
    }

    if (state.confirmKind === "clear") {
      if (!canSendAllMembersToReserve(root, bound.slots)) {
        resetToIdle();
        showAlert(ALERT_TEXT.clearReserveFull);
        return;
      }

      input.onClearTroop({ troopId });
      return;
    }

    if (troopId === PLAYER_MAIN_TROOP_ID) {
      resetToIdle();
      showAlert(ALERT_TEXT.disbandForbidden);
      return;
    }

    if (!canSendAllMembersToReserve(root, bound.slots)) {
      resetToIdle();
      showAlert(ALERT_TEXT.disbandReserveFull);
      return;
    }

    input.onDisbandTroop({ troopId });
  });

  cancelButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    resetToIdle();
  });

  alertCloseButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    dismissAlert();
  });

  syncUi();
}

function bindMoveFrame(
  root: HTMLElement,
  frame: HTMLIFrameElement,
  input: SyncTroopManagementMoveInteractionsInput
): void {
  if (frame.dataset.troopManagementMoveBound === "true") {
    return;
  }

  frame.dataset.troopManagementMoveBound = "true";

  const attach = () => {
    attachTroopManagementMoveHandlers(root, frame, input);
  };

  frame.addEventListener("load", attach, { once: true });

  if (frame.contentDocument?.readyState === "complete") {
    attach();
  }
}

export function syncTroopManagementMoveInteractions(
  root: ParentNode,
  input: SyncTroopManagementMoveInteractionsInput
): void {
  const troopManagementRoot = root.querySelector<HTMLElement>("[data-troop-management-root]");
  const previewFrame = troopManagementRoot?.querySelector<HTMLIFrameElement>(
    "[data-troop-management-battle-preview]"
  );

  if (troopManagementRoot == null || previewFrame == null) {
    return;
  }

  bindMoveFrame(troopManagementRoot, previewFrame, input);
}
