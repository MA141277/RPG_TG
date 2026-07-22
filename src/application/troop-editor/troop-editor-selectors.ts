import type { AppState } from "../app-shell";
import { BATTLE_FORMATION_SLOT_KEYS } from "../../domain/battle-formation";
import type {
  SharedTroopSlotSnapshot,
  SharedTroopSnapshot,
  TroopEditorResourceSlot,
  TroopReserveMember,
  TroopShopOffer,
} from "../../domain/troop-editor";
import { assertExists } from "../../shared/assert";

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

function createTroopSlots(
  appState: AppState,
  troopId: string
): SharedTroopSlotSnapshot[] {
  const formation =
    appState.gameState.runtime.troops.formations.find((entry) => entry.id === troopId) ??
    null;

  return BATTLE_FORMATION_SLOT_KEYS.map((slotKey) => {
    const occupant = formation?.members.find((member) => member.slotKey === slotKey) ?? null;

    return {
      slotKey,
      occupantName: occupant?.name ?? null,
      occupantRole: occupant?.role ?? null,
      isOccupied: occupant != null,
    };
  });
}

export function selectTroopEditorResources(
  appState: AppState,
  playerCharacterId: string
): TroopEditorResourceSlot[] {
  const playerCharacter = selectPlayerCharacter(appState, playerCharacterId);

  return [
    {
      id: "gold",
      label: "金钱",
      valueText: `${playerCharacter.stats.gold} 两`,
    },
    {
      id: "fame",
      label: "声望",
      valueText: `${playerCharacter.stats.fame}`,
    },
  ];
}

export function selectPlayerTroopSnapshots(
  appState: AppState,
  playerCharacterId: string
): SharedTroopSnapshot[] {
  const playerCharacter = selectPlayerCharacter(appState, playerCharacterId);

  return appState.gameState.runtime.troops.formations
    .filter((formation) => formation.leaderCharacterId === playerCharacter.id)
    .map((formation) => ({
      id: formation.id,
      name: formation.name,
      subtitle: "",
      slots: createTroopSlots(appState, formation.id),
    }));
}

export function selectTroopEditorStageInput(
  appState: AppState,
  playerCharacterId: string
): {
  resources: TroopEditorResourceSlot[];
  troopSnapshots: SharedTroopSnapshot[];
  reserveMembers: TroopReserveMember[];
  shopOffers: TroopShopOffer[];
  reserveCount: number;
  reserveCapacity: number;
  playerGold: number;
  playerFame: number;
} {
  const playerCharacter = selectPlayerCharacter(appState, playerCharacterId);

  return {
    resources: selectTroopEditorResources(appState, playerCharacterId),
    troopSnapshots: selectPlayerTroopSnapshots(appState, playerCharacterId),
    reserveMembers: appState.gameState.runtime.troops.reserve.members as TroopReserveMember[],
    shopOffers: appState.gameState.runtime.troops.shop.offers,
    reserveCount: appState.gameState.runtime.troops.reserve.members.length,
    reserveCapacity: appState.gameState.runtime.troops.reserve.capacity,
    playerGold: playerCharacter.stats.gold,
    playerFame: playerCharacter.stats.fame,
  };
}
