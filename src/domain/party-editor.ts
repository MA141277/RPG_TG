import type { BattleFormation } from "./battle-formation";

export type PartyEditorResourceTone = "primary" | "muted";

export type PartyEditorResourceSlot = {
  id: string;
  label: string;
  valueText: string;
  tone: PartyEditorResourceTone;
};

export type PartyEditorCommandItem = {
  id: string;
  label: string;
  isEnabled: boolean;
  actionId: string | null;
};

export type PartyEditorStageTeam = {
  id: string;
  name: string;
  summary: string;
  formation: BattleFormation;
};
