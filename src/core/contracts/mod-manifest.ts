import type { GameplayContributionDeclaration } from "./gameplay-contribution";

export type GameModManifest = {
  id: string;
  schemaVersion: string;
  version: string;
  title: string;
  entryContentPackIds: string[];
  dependencies?: string[];
  conflictsWith?: string[];
  capabilities?: string[];
  gameplayContributions?: GameplayContributionDeclaration;
  defaultStart?: {
    playerCharacterId?: string;
    mapId?: string;
    cityId?: string;
    houseId?: string | null;
    sceneId?: string;
    view?: string;
  };
};
