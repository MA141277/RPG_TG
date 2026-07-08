import type { ActivityDefinition } from "../../domain/activity";
import type { CityDefinition } from "../../domain/city";
import type { CityNpcPoolDefinition } from "../../domain/city-npc";
import type { ContentPackDefinition } from "../../domain/content-pack";
import type { HouseDefinition } from "../../domain/house";
import {
  mergeHouseModuleDefaults,
  type HouseModuleDefaults,
} from "./house-module-defaults";

export type DefaultRuntimeContent = {
  activityDefinitions: ActivityDefinition[];
  cities: CityDefinition[];
  houses: HouseDefinition[];
  cityNpcPools: CityNpcPoolDefinition[];
  houseModuleDefaults: HouseModuleDefaults;
  textEntriesById: Record<string, string>;
};

export const defaultRuntimeContent: DefaultRuntimeContent = {
  activityDefinitions: [],
  cities: [],
  houses: [],
  cityNpcPools: [],
  houseModuleDefaults: {},
  textEntriesById: {},
};

let defaultRuntimeContentPromise: Promise<DefaultRuntimeContent> | null = null;

export async function loadDefaultRuntimeContent(
  loadPack: () => Promise<ContentPackDefinition>
): Promise<DefaultRuntimeContent> {
  if (defaultRuntimeContentPromise == null) {
    defaultRuntimeContentPromise = loadPack().then((pack) => {
      replaceArrayContents(defaultRuntimeContent.activityDefinitions, pack.activities ?? []);
      replaceArrayContents(defaultRuntimeContent.cities, pack.cities ?? []);
      replaceArrayContents(defaultRuntimeContent.houses, pack.houses ?? []);
      replaceArrayContents(defaultRuntimeContent.cityNpcPools, pack.cityNpcPools ?? []);
      replaceHouseModuleDefaults(
        defaultRuntimeContent.houseModuleDefaults,
        mergeHouseModuleDefaults(undefined, pack.houseModuleDefaults)
      );
      replaceRecordContents(defaultRuntimeContent.textEntriesById, pack.textEntries ?? {});
      return defaultRuntimeContent;
    });
  }

  return defaultRuntimeContentPromise;
}

function replaceHouseModuleDefaults(
  target: HouseModuleDefaults,
  next: HouseModuleDefaults
): void {
  for (const key of Object.keys(target) as Array<keyof HouseModuleDefaults>) {
    delete target[key];
  }

  for (const [moduleId, defaults] of Object.entries(next)) {
    target[moduleId as keyof HouseModuleDefaults] = { ...defaults };
  }
}

function replaceArrayContents<T>(target: T[], next: readonly T[]): void {
  target.splice(0, target.length, ...next);
}

function replaceRecordContents<T>(
  target: Record<string, T>,
  next: Record<string, T>
): void {
  for (const key of Object.keys(target)) {
    delete target[key];
  }

  Object.assign(target, next);
}
