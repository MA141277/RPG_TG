import type { CharacterDefinition } from "../../domain/character";
import type { StoryBattleUnit } from "../../domain/story-battle";
import type { AppState } from "../app-shell";
import type { SharedTroopSnapshot, TroopReserveMember } from "../../domain/troop-editor";
import {
  selectPlayerTroopSnapshots,
  selectTroopEditorResources,
} from "./troop-editor-selectors";
import { assertExists } from "../../shared/assert";

export type TroopManagementSummary = {
  threatLevelText: string;
  movementText: string;
  moraleText: string;
  scaleText: string;
  leaderTraitText: string;
};

function selectPlayerCharacter(appState: AppState, playerCharacterId: string) {
  const playerCharacter = appState.characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === playerCharacterId
  );
  assertExists(
    playerCharacter,
    `Player character not found for id "${playerCharacterId}".`
  );
  return playerCharacter;
}

function selectPlayerBattleUnit(appState: AppState): StoryBattleUnit | null {
  const session = appState.gameState.storyBattle;
  if (session == null) {
    return null;
  }

  return (
    session.units.find((unit) => unit.id === session.playerUnitId) ??
    session.units.find((unit) => unit.controller === "player") ??
    null
  );
}

function countOccupiedSlots(troopSnapshot: SharedTroopSnapshot): number {
  return troopSnapshot.slots.filter((slot) => slot.isOccupied).length;
}

function getRoleLabel(role: string | null): string {
  if (role === "spearman") {
    return "长枪兵";
  }

  if (role === "archer") {
    return "弓兵";
  }

  if (role === "cavalry") {
    return "骑兵";
  }

  if (role === "musketeer" || role === "gunpowder") {
    return "火器兵";
  }

  return "步兵";
}

function getDominantRoleLabel(troopSnapshot: SharedTroopSnapshot): string {
  const roleCounts = troopSnapshot.slots.reduce<Map<string, number>>(
    (counts, slot) => {
      if (slot.occupantRole == null) {
        return counts;
      }

      counts.set(slot.occupantRole, (counts.get(slot.occupantRole) ?? 0) + 1);
      return counts;
    },
    new Map()
  );

  const dominantRole =
    [...roleCounts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ??
    "infantry";

  return getRoleLabel(dominantRole);
}

function formatMoraleText(
  playerCharacter: CharacterDefinition,
  playerBattleUnit: StoryBattleUnit | null
): string {
  const moraleScore =
    playerBattleUnit == null
      ? Math.round((playerCharacter.stats.leadership + playerCharacter.stats.fame) / 2)
      : Math.round((playerBattleUnit.strength / playerBattleUnit.maxStrength) * 100);

  if (moraleScore >= 90) {
    return "振奋";
  }

  if (moraleScore >= 70) {
    return "高昂";
  }

  if (moraleScore >= 50) {
    return "稳定";
  }

  return "低迷";
}

function formatLeaderTraitText(playerCharacter: CharacterDefinition): string {
  const rawTrait =
    playerCharacter.flags?.find((flag) => flag.startsWith("trait:")) ?? null;

  if (rawTrait == null) {
    return "无";
  }

  return rawTrait.slice("trait:".length) || "无";
}

export function selectTroopManagementSummary(
  appState: AppState,
  playerCharacterId: string,
  troopSnapshot: SharedTroopSnapshot
): TroopManagementSummary {
  const playerCharacter = selectPlayerCharacter(appState, playerCharacterId);
  const playerBattleUnit = selectPlayerBattleUnit(appState);
  const occupiedCount = countOccupiedSlots(troopSnapshot);
  const battleStrength = playerBattleUnit?.strength ?? occupiedCount * 60;
  const maxBattleStrength = playerBattleUnit?.maxStrength ?? 9 * 60;

  return {
    threatLevelText: `${battleStrength + playerCharacter.stats.leadership * 4 + playerCharacter.stats.martial * 3}`,
    movementText: `${getDominantRoleLabel(troopSnapshot)}[${occupiedCount}]`,
    moraleText: formatMoraleText(playerCharacter, playerBattleUnit),
    scaleText: `${battleStrength}/${maxBattleStrength}`,
    leaderTraitText: formatLeaderTraitText(playerCharacter),
  };
}

function selectReserveMembers(appState: AppState): TroopReserveMember[] {
  return appState.gameState.runtime.troops.reserve.members;
}

export function selectTroopManagementStageInput(
  appState: AppState,
  playerCharacterId: string
) {
  const troopSnapshots = selectPlayerTroopSnapshots(appState, playerCharacterId);
  const selectedTroopSnapshot =
    troopSnapshots.find((troop) => troop.id === appState.gameState.ui.selectedTroopId) ??
    troopSnapshots[0] ??
    null;
  assertExists(selectedTroopSnapshot, "Selected troop snapshot is required.");

  return {
    resources: selectTroopEditorResources(appState, playerCharacterId),
    troopSnapshots,
    selectedTroopSnapshot,
    reserveMembers: selectReserveMembers(appState),
    reserveCapacity: appState.gameState.runtime.troops.reserve.capacity,
    summary: selectTroopManagementSummary(
      appState,
      playerCharacterId,
      selectedTroopSnapshot
    ),
  };
}
