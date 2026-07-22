export type NavigationTarget =
  | { view: "map"; mapId?: string }
  | { view: "city"; cityId: string }
  | { view: "house"; houseId: string }
  | { view: "interactive"; moduleId: string };
