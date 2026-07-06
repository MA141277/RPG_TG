import type { CityDefinition } from "../../domain/city";
import type { CityNpcPoolDefinition } from "../../domain/city-npc";
import type { ContentPackDefinition } from "../../domain/content-pack";
import type { HouseDefinition } from "../../domain/house";

export type DefaultRuntimeContent = {
  cities: CityDefinition[];
  houses: HouseDefinition[];
  cityNpcPools: CityNpcPoolDefinition[];
  textEntriesById: Record<string, string>;
};

export const defaultRuntimeContent: DefaultRuntimeContent = {
  cities: [],
  houses: [],
  cityNpcPools: [],
  textEntriesById: {},
};

let defaultRuntimeContentPromise: Promise<DefaultRuntimeContent> | null = null;

export async function loadDefaultRuntimeContent(
  loadPack: () => Promise<ContentPackDefinition>
): Promise<DefaultRuntimeContent> {
  if (defaultRuntimeContentPromise == null) {
    defaultRuntimeContentPromise = loadPack().then((pack) => {
      defaultRuntimeContent.cities = pack.cities ?? [];
      defaultRuntimeContent.houses = pack.houses ?? [];
      defaultRuntimeContent.cityNpcPools = pack.cityNpcPools ?? [];
      defaultRuntimeContent.textEntriesById = pack.textEntries ?? {};
      return defaultRuntimeContent;
    });
  }

  return defaultRuntimeContentPromise;
}
