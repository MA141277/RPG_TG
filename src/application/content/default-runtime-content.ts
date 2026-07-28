import { createBaseGameContentPack } from "../../content/base-game-content-pack";
import type { BuildingArrangementDefinition } from "../../domain/building-arrangement";
import type { CityDefinition } from "../../domain/city";
import type { CityNpcPoolDefinition } from "../../domain/city-npc";
import type { HouseDefinition } from "../../domain/house";

export type DefaultRuntimeContent = {
  cities: CityDefinition[];
  houses: HouseDefinition[];
  buildingArrangements: BuildingArrangementDefinition[];
  cityNpcPools: CityNpcPoolDefinition[];
  textEntriesById: Record<string, string>;
};

export const defaultRuntimeContent: DefaultRuntimeContent = {
  cities: [],
  houses: [],
  buildingArrangements: [],
  cityNpcPools: [],
  textEntriesById: {},
};

let defaultRuntimeContentPromise: Promise<DefaultRuntimeContent> | null = null;

export async function loadDefaultRuntimeContent(): Promise<DefaultRuntimeContent> {
  if (defaultRuntimeContentPromise == null) {
    defaultRuntimeContentPromise = createBaseGameContentPack().then((pack) => {
      defaultRuntimeContent.cities = pack.cities ?? [];
      defaultRuntimeContent.houses = pack.houses ?? [];
      defaultRuntimeContent.buildingArrangements = pack.buildingArrangements ?? [];
      defaultRuntimeContent.cityNpcPools = pack.cityNpcPools ?? [];
      defaultRuntimeContent.textEntriesById = pack.textEntries ?? {};
      return defaultRuntimeContent;
    });
  }

  return defaultRuntimeContentPromise;
}
