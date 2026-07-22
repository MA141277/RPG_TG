import type { MapId } from "./map";

export type CampaignMapExplorationState = {
  revealedHexKeysByMapId: Record<MapId, string[]>;
};
