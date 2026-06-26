import { createBaseGameContentPack } from "../../content/base-game-content-pack";
import type { CityDefinition } from "../../domain/city";
import type { CityNpcPoolDefinition } from "../../domain/city-npc";
import type { HouseDefinition } from "../../domain/house";

export type DefaultRuntimeContent = {
  cities: CityDefinition[];
  houses: HouseDefinition[];
  cityNpcPools: CityNpcPoolDefinition[];
};

export const defaultRuntimeContent: DefaultRuntimeContent = {
  cities: [],
  houses: [],
  cityNpcPools: [],
};

let defaultRuntimeContentPromise: Promise<DefaultRuntimeContent> | null = null;

export async function loadDefaultRuntimeContent(): Promise<DefaultRuntimeContent> {
  if (defaultRuntimeContentPromise == null) {
    defaultRuntimeContentPromise = createBaseGameContentPack().then((pack) => {
      defaultRuntimeContent.cities = pack.cities ?? [];
      defaultRuntimeContent.houses = pack.houses ?? [];
      defaultRuntimeContent.cityNpcPools = pack.cityNpcPools ?? [];
      return defaultRuntimeContent;
    });
  }

  return defaultRuntimeContentPromise;
}
