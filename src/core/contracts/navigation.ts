export type NavigationRouteTarget =
  | { kind: "map"; mapId?: string }
  | { kind: "city"; cityId: string }
  | { kind: "building"; houseId: string }
  | { kind: "reenterBuilding"; houseId: string }
  | { kind: "leaveBuilding" };

export type NavigationTarget =
  | { view: "map"; mapId?: string }
  | { view: "city"; cityId: string }
  | { view: "house"; houseId: string }
  | { view: "scene"; sceneId: string }
  | { view: "interactive"; moduleId: string };
