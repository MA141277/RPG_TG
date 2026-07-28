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
  metricKey: string;
  metricLabel: string;
  hostFamily: string | "*";
  allowDemotion?: boolean;
  tiers: ProgressTierDefinition[];
};

export type ProgressHostReference = {
  family: string;
  id?: string;
};

export type ProgressTrackBinding = {
  id: string;
  trackId: string;
  host: ProgressHostReference;
  enabled?: boolean;
};

export type ProgressTrackRuntimeState = {
  trackId: string;
  hostFamily: string;
  hostId: string;
  metricValue: number;
  currentTierId: string | null;
  enteredTierHistory: string[];
  updatedAt: string;
};

export type RuntimeProgressState = {
  trackStatesByHostKey: Record<
    string,
    Record<string, ProgressTrackRuntimeState>
  >;
};

export type ProgressionTierSettlementPayload = {
  hostFamily: string;
  hostId: string;
  trackId: string;
  fromTierId: string | null;
  toTierId: string | null;
  metricValue: number;
};

export type ProgressionSettlementInstance = {
  settlementId: string;
  payload: ProgressionTierSettlementPayload;
};

export type ProgressionRuntimeResult = {
  state: RuntimeProgressState;
  settlementInstances: ProgressionSettlementInstance[];
  diagnostics: string[];
  eventRequests?: never;
};
