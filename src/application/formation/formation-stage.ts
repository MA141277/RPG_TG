import type { BattleFormation } from "../../domain/battle-formation";
import type {
  PartyEditorCommandItem,
  PartyEditorResourceSlot,
  PartyEditorStageTeam,
} from "../../domain/party-editor";
import { assertExists } from "../../shared/assert";

export type FormationStageTeam = PartyEditorStageTeam;

export type FormationStageState = {
  resources: PartyEditorResourceSlot[];
  commands: PartyEditorCommandItem[];
  teams: FormationStageTeam[];
  selectedTeamId: string;
};

const demoFormation: BattleFormation = {
  id: "formation.zhu-chongba.main",
  name: "朱重八本队",
  leaderCharacterId: "char.player",
  members: [
    {
      id: "member.front-center.infantry",
      unitDefinitionId: "unit.infantry.demo",
      name: "步卒队",
      role: "infantry",
      slotKey: "front-center",
    },
    {
      id: "member.rear-center.archer",
      unitDefinitionId: "unit.archer.demo",
      name: "弓手队",
      role: "archer",
      slotKey: "rear-center",
    },
  ],
};

export function createDemoFormationStageState(): FormationStageState {
  return {
    resources: [
      { id: "gold", label: "金钱", valueText: "1200", tone: "primary" },
      { id: "food", label: "食物", valueText: "800", tone: "primary" },
      { id: "horses", label: "马匹", valueText: "36", tone: "primary" },
      { id: "reserve", label: "预留", valueText: "--", tone: "muted" },
    ],
    commands: [
      { id: "disband", label: "解散队伍", isEnabled: false, actionId: null },
      { id: "create", label: "组建队伍", isEnabled: false, actionId: null },
      { id: "sort", label: "排序队伍", isEnabled: false, actionId: null },
      { id: "dismiss", label: "解雇单位", isEnabled: false, actionId: null },
      { id: "recruit", label: "招兵买马", isEnabled: false, actionId: null },
      {
        id: "exit",
        label: "退出",
        isEnabled: true,
        actionId: "close-party-editor",
      },
    ],
    teams: [
      {
        id: "team.zhu-chongba.main",
        name: "朱重八本队",
        summary: "本期仅展示界面，后续接入实时棋盘预览。",
        formation: demoFormation,
      },
    ],
    selectedTeamId: "team.zhu-chongba.main",
  };
}

export function selectActiveFormationStageTeam(
  state: FormationStageState
): FormationStageTeam {
  const activeTeam =
    state.teams.find((team) => team.id === state.selectedTeamId) ?? state.teams[0];
  assertExists(activeTeam, "Formation stage requires at least one team.");
  return activeTeam;
}
