export type GameModManifest = {
  id: string;
  version: string;
  title: string;
  entryContentPackIds: string[];
  defaultStart?: {
    mapId?: string;
    cityId?: string;
    sceneId?: string;
  };
};
