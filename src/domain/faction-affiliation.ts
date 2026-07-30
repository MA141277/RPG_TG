import type { CharacterId } from "./character";

export type FactionAffiliationState = {
  factionId: string;
  factionName: string;
  status: "active" | "left";
  joinedBy: string;
  joinedOn: {
    year: number;
    month: number;
    day: number;
  };
  sourceEventId?: string;
};

export type FactionAffiliationsState = Record<
  CharacterId,
  FactionAffiliationState
>;
