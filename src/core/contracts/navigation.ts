export type NavigationRouteTarget =
  | { kind: "city"; cityId: string }
  | { kind: "building"; houseId: string }
  | { kind: "reenterBuilding"; houseId: string }
  | { kind: "leaveBuilding" }
  | { kind: "map"; mapId?: string };

export type NavigationTarget =
  | { view: "map"; mapId?: string }
  | { view: "city"; cityId: string }
  | { view: "house"; houseId: string }
  | { view: "interactive"; moduleId: string };
