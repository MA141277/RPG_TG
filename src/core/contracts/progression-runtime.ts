export type ProgressTierRepeatPolicy = "once-ever" | "once-per-entry";

export type ProgressTierDefinition = {
  id: string;
  title: string;
  threshold: number;
  onEnterRepeatPolicy?: ProgressTierRepeatPolicy;
  targetTierSettlementId?: string | null;
};

export type ProgressTrackDefinition = {
  id: string;
  title: string;
  metricLabel: string;
  ownerKind: string | "*";
  allowDemotion?: boolean;
  tiers: ProgressTierDefinition[];
};

export type ProgressOwnerSelector = {
  ownerKind: string;
  ownerId?: string;
  ownerTag?: string;
};

export type ProgressTrackBinding = {
  id: string;
  trackId: string;
  owner: ProgressOwnerSelector;
  enabled?: boolean;
};

export type ProgressTrackRuntimeState = {
  trackId: string;
  ownerKind: string;
  ownerId: string;
  metricValue: number;
  currentTierId: string | null;
  enteredTierHistory: string[];
  updatedAt: string;
};

export type RuntimeProgressState = {
  trackStatesByOwnerKey: Record<
    string,
    Record<string, ProgressTrackRuntimeState>
  >;
};

export type ProgressionTierSettlementPayload = {
  ownerKind: string;
  ownerId: string;
  trackId: string;
  fromTierId: string | null;
  toTierId: string | null;
  metricValue: number;
};
