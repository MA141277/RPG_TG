export type TroopEditorRecruitSessionMode = "recruit-list" | "recruit-menu";

export type TroopEditorRecruitSessionSnapshot = {
  mode: TroopEditorRecruitSessionMode;
  selectedOfferId: string | null;
};

export type TroopEditorRecruitSessionInput = {
  mode: string;
  selectedRecruitOfferId: string | null;
};

const RESTORABLE_MODES = new Set<TroopEditorRecruitSessionMode>([
  "recruit-list",
  "recruit-menu",
]);

export function captureTroopEditorRecruitSessionSnapshot(
  input: TroopEditorRecruitSessionInput
): TroopEditorRecruitSessionSnapshot | null {
  const mode = RESTORABLE_MODES.has(input.mode as TroopEditorRecruitSessionMode)
    ? (input.mode as TroopEditorRecruitSessionMode)
    : null;
  if (mode == null) {
    return null;
  }

  return {
    mode,
    selectedOfferId: mode === "recruit-menu" ? input.selectedRecruitOfferId ?? null : null,
  };
}

export function restoreTroopEditorRecruitSessionSnapshot(
  snapshot: TroopEditorRecruitSessionSnapshot | null,
  availableOfferIds: readonly string[]
): TroopEditorRecruitSessionSnapshot | null {
  if (snapshot == null) {
    return null;
  }

  if (snapshot.mode === "recruit-list") {
    return snapshot;
  }

  const availableOfferIdSet = new Set(
    availableOfferIds.map((offerId) => offerId.trim()).filter((offerId) => offerId.length > 0)
  );

  if (
    snapshot.selectedOfferId != null &&
    availableOfferIdSet.has(snapshot.selectedOfferId)
  ) {
    return snapshot;
  }

  return {
    mode: "recruit-list",
    selectedOfferId: null,
  };
}

export class TroopEditorRecruitSessionStore {
  #snapshot: TroopEditorRecruitSessionSnapshot | null = null;

  remember(input: TroopEditorRecruitSessionInput): void {
    this.#snapshot = captureTroopEditorRecruitSessionSnapshot(input);
  }

  consume(availableOfferIds: readonly string[]): TroopEditorRecruitSessionSnapshot | null {
    const restoredSnapshot = restoreTroopEditorRecruitSessionSnapshot(
      this.#snapshot,
      availableOfferIds
    );
    this.#snapshot = null;
    return restoredSnapshot;
  }

  clear(): void {
    this.#snapshot = null;
  }
}

export function createTroopEditorRecruitSessionStore(): TroopEditorRecruitSessionStore {
  return new TroopEditorRecruitSessionStore();
}

export const troopEditorRecruitSessionStore = createTroopEditorRecruitSessionStore();
