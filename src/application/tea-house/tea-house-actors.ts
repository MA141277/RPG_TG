import {
  getCityNpcDefinitionById,
  readCityNpcFavorability,
} from "../city-npcs/city-npc-pool-state";
import type { CityNpcPoolDefinition } from "../../domain/city-npc";
import type { GameState } from "../../domain/game-state";
import {
  getTeaHouseFixedNpcFavorabilityVariableKey,
} from "../../domain/tea-house";
import { getTeaHouseContentDefaults } from "./tea-house-content-defaults";

export type TeaHouseActor = {
  id: string;
  name: string;
  title: string;
  personality: string;
  specialty: string;
  favorability: number;
  dialoguePool: string[];
  intelPool: string[];
  isFixedHost: boolean;
};

function readNumericVariable(
  state: GameState,
  key: string,
  fallback: number
): number {
  const value = state.runtime.variables[key];
  return typeof value === "number" ? value : fallback;
}

export function createTeaHouseBossActor(
  state: GameState,
  houseId: string
): TeaHouseActor {
  const { teaHouseBossProfile } = getTeaHouseContentDefaults();

  return {
    id: teaHouseBossProfile.actorId,
    name: teaHouseBossProfile.name,
    title: teaHouseBossProfile.title,
    personality: teaHouseBossProfile.personality,
    specialty: teaHouseBossProfile.specialty,
    favorability: readNumericVariable(
      state,
      getTeaHouseFixedNpcFavorabilityVariableKey(
        houseId,
        teaHouseBossProfile.actorId
      ),
      teaHouseBossProfile.favorability
    ),
    dialoguePool: [],
    intelPool: [],
    isFixedHost: true,
  };
}

export function createTeaHouseGuestActors(
  state: GameState,
  poolDefinitions: CityNpcPoolDefinition[],
  cityId: string,
  guestNpcIds: string[]
): TeaHouseActor[] {
  return guestNpcIds
    .map((npcId) => {
      const residentDefinition = getCityNpcDefinitionById(
        poolDefinitions,
        cityId,
        npcId
      );
      if (residentDefinition == null) {
        return null;
      }

      return {
        id: residentDefinition.id,
        name: residentDefinition.name,
        title: residentDefinition.title,
        personality: residentDefinition.personality,
        specialty: residentDefinition.specialty,
        favorability: readCityNpcFavorability(
          state,
          cityId,
          residentDefinition.id,
          residentDefinition.favorability
        ),
        dialoguePool: [...residentDefinition.dialoguePool],
        intelPool: [...residentDefinition.intelPool],
        isFixedHost: false,
      };
    })
    .filter((actor): actor is TeaHouseActor => actor != null);
}
