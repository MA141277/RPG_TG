export type NavigationTarget =
  | { view: "map"; mapId?: string }
  | { view: "city"; cityId: string }
  | { view: "house"; houseId: string }
  | { view: "scene"; sceneId: string }
  | { view: "interactive"; moduleId: string };
