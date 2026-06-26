import type { CityId } from "./city";

export const CITY_NPC_ACTIVITY_LOCATION_IDS = [
  "tea-house",
  "tavern",
  "market",
  "street",
  "custom",
] as const;

export type CityNpcId = string;
export type CityNpcActivityLocationId =
  (typeof CITY_NPC_ACTIVITY_LOCATION_IDS)[number];

export type CityNpcDefinition = {
  id: CityNpcId;
  cityId: CityId;
  name: string;
  title: string;
  personality: string;
  specialty: string;
  favorability: number;
  activityWeight: Partial<Record<CityNpcActivityLocationId, number>>;
  dialoguePool: string[];
  intelPool: string[];
};

export type CityNpcPoolDefinition = {
  cityId: CityId;
  residents: CityNpcDefinition[];
};

export type CityNpcResidentRuntimeState = {
  npcId: CityNpcId;
  favorability: number;
  currentLocationId: CityNpcActivityLocationId | null;
};

export type CityNpcPoolRuntimeState = {
  cityId: CityId;
  lastRefreshedOn: string | null;
  residents: Record<CityNpcId, CityNpcResidentRuntimeState>;
};
