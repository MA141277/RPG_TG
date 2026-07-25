import type {
  ProgressTrackBinding,
  ProgressTrackDefinition,
  ProgressTierDefinition,
  ProgressionRuntimeResult,
  RuntimeProgressState,
} from "../contracts/progression-runtime";

export function runProgressionRuntime(input: {
  state: RuntimeProgressState;
  track: ProgressTrackDefinition;
  binding: ProgressTrackBinding;
  metricValue: number;
  occurredAt: string;
}): ProgressionRuntimeResult {
  const ownerKind = input.binding.owner.ownerKind;
  const ownerId = input.binding.owner.ownerId ?? "";
  const ownerKey = createOwnerKey(ownerKind, ownerId);
  const current =
    input.state.trackStatesByOwnerKey[ownerKey]?.[input.track.id] ?? null;
  const nextTier = selectTargetTier({
    track: input.track,
    metricValue: input.metricValue,
    currentTierId: current?.currentTierId ?? null,
  });
  const didChangeTier = (current?.currentTierId ?? null) !== (nextTier?.id ?? null);
  const enteredTierHistory = didChangeTier && nextTier != null
    ? [...(current?.enteredTierHistory ?? []), nextTier.id]
    : [...(current?.enteredTierHistory ?? [])];
  const nextState = upsertTrackState(input.state, ownerKey, {
    trackId: input.track.id,
    ownerKind,
    ownerId,
    metricValue: input.metricValue,
    currentTierId: nextTier?.id ?? null,
    enteredTierHistory,
    updatedAt: input.occurredAt,
  });

  if (
    !didChangeTier ||
    nextTier?.targetTierSettlementId == null ||
    !shouldEmitTargetTierSettlement({
      tier: nextTier,
      enteredTierHistory: current?.enteredTierHistory ?? [],
    })
  ) {
    return {
      state: nextState,
      settlementInstances: [],
      diagnostics: [],
    };
  }

  return {
    state: nextState,
    settlementInstances: [
      {
        settlementId: nextTier.targetTierSettlementId,
        payload: {
          ownerKind,
          ownerId,
          trackId: input.track.id,
          fromTierId: current?.currentTierId ?? null,
          toTierId: nextTier.id,
          metricValue: input.metricValue,
        },
      },
    ],
    diagnostics: [],
  };
}

function selectTargetTier(input: {
  track: ProgressTrackDefinition;
  metricValue: number;
  currentTierId: string | null;
}): ProgressTierDefinition | null {
  const highestSatisfiedTier = selectHighestSatisfiedTier(
    input.track.tiers,
    input.metricValue
  );
  if (input.track.allowDemotion !== false) {
    return highestSatisfiedTier;
  }

  const currentTier =
    input.currentTierId == null
      ? null
      : input.track.tiers.find((tier) => tier.id === input.currentTierId) ?? null;
  if (currentTier == null) {
    return highestSatisfiedTier;
  }

  if (highestSatisfiedTier == null) {
    return currentTier;
  }

  return highestSatisfiedTier.threshold < currentTier.threshold
    ? currentTier
    : highestSatisfiedTier;
}

function selectHighestSatisfiedTier(
  tiers: readonly ProgressTierDefinition[],
  metricValue: number
): ProgressTierDefinition | null {
  let selectedTier: ProgressTierDefinition | null = null;

  for (const tier of tiers) {
    if (metricValue < tier.threshold) {
      continue;
    }
    if (selectedTier == null || tier.threshold >= selectedTier.threshold) {
      selectedTier = tier;
    }
  }

  return selectedTier;
}

function shouldEmitTargetTierSettlement(input: {
  tier: ProgressTierDefinition;
  enteredTierHistory: string[];
}): boolean {
  const repeatPolicy = input.tier.onEnterRepeatPolicy ?? "once-ever";
  if (repeatPolicy === "once-per-entry") {
    return true;
  }
  return !input.enteredTierHistory.includes(input.tier.id);
}

function upsertTrackState(
  state: RuntimeProgressState,
  ownerKey: string,
  value: RuntimeProgressState["trackStatesByOwnerKey"][string][string]
): RuntimeProgressState {
  return {
    trackStatesByOwnerKey: {
      ...state.trackStatesByOwnerKey,
      [ownerKey]: {
        ...(state.trackStatesByOwnerKey[ownerKey] ?? {}),
        [value.trackId]: value,
      },
    },
  };
}

function createOwnerKey(ownerKind: string, ownerId: string): string {
  return `${ownerKind}:${ownerId}`;
}
