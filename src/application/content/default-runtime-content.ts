import { createBaseGameContentPack } from "../../content/base-game-content-pack";
import type { CityDefinition } from "../../domain/city";
import type { CityNpcPoolDefinition } from "../../domain/city-npc";
import type { HouseDefinition } from "../../domain/house";
import type { MapDefinition } from "../../domain/map";

export type DefaultRuntimeContent = {
  maps: MapDefinition[];
  cities: CityDefinition[];
  houses: HouseDefinition[];
  cityNpcPools: CityNpcPoolDefinition[];
  textEntriesById: Record<string, string>;
};

export const defaultRuntimeContent: DefaultRuntimeContent = {
  maps: [],
  cities: [],
  houses: [],
  cityNpcPools: [],
  textEntriesById: {},
};

let defaultRuntimeContentPromise: Promise<DefaultRuntimeContent> | null = null;

export async function loadDefaultRuntimeContent(): Promise<DefaultRuntimeContent> {
  if (defaultRuntimeContentPromise == null) {
    defaultRuntimeContentPromise = createBaseGameContentPack().then((pack) => {
      defaultRuntimeContent.maps = pack.maps ?? [];
      defaultRuntimeContent.cities = pack.cities ?? [];
      defaultRuntimeContent.houses = pack.houses ?? [];
      defaultRuntimeContent.cityNpcPools = pack.cityNpcPools ?? [];
      defaultRuntimeContent.textEntriesById = pack.textEntries ?? {};
      return defaultRuntimeContent;
    });
  }

  return defaultRuntimeContentPromise;
}
