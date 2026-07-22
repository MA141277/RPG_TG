import {
  BATTLE_FORMATION_SLOT_KEYS,
  type BattleFormationMember,
  type BattleFormationSlotKey,
} from "../../domain/battle-formation";
import type {
  PartyEditorCommandItem,
  PartyEditorResourceSlot,
} from "../../domain/party-editor";
import {
  selectActiveFormationStageTeam,
  type FormationStageState,
  type FormationStageTeam,
} from "./formation-stage";

export type FormationPreviewSlotViewModel = {
  slotKey: BattleFormationSlotKey;
  label: string;
  role: BattleFormationMember["role"] | null;
  isOccupied: boolean;
};

export type PartyEditorStageViewModel = {
  title: string;
  resources: PartyEditorResourceSlot[];
  commands: PartyEditorCommandItem[];
  teams: {
    id: string;
    name: string;
    summary: string;
    slots: FormationPreviewSlotViewModel[];
  }[];
};

export type BattleFormationPreviewViewModel = {
  teamId: string;
  teamName: string;
  slots: FormationPreviewSlotViewModel[];
};

function createFormationPreviewSlots(
  team: FormationStageTeam
): FormationPreviewSlotViewModel[] {
  return BATTLE_FORMATION_SLOT_KEYS.map((slotKey) => {
    const member =
      team.formation.members.find((entry) => entry.slotKey === slotKey) ?? null;

    return {
      slotKey,
      label: member?.name ?? "空位",
      role: member?.role ?? null,
      isOccupied: member != null,
    };
  });
}

export function createPartyEditorStageViewModel(
  state: FormationStageState
): PartyEditorStageViewModel {
  return {
    title: "队伍编辑",
    resources: state.resources,
    commands: state.commands,
    teams: state.teams.map((team) => ({
      id: team.id,
      name: team.name,
      summary: team.summary,
      slots: createFormationPreviewSlots(team),
    })),
  };
}

export function createBattleFormationPreviewViewModel(
  state: FormationStageState
): BattleFormationPreviewViewModel {
  const team = selectActiveFormationStageTeam(state);

  return {
    teamId: team.id,
    teamName: team.name,
    slots: createFormationPreviewSlots(team),
  };
}
