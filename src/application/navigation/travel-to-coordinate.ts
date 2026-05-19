export type GridCoordinate = {
  x: number;
  y: number;
};

export function travelToCoordinate(
  _currentCoordinate: GridCoordinate,
  targetCoordinate: GridCoordinate
): GridCoordinate {
  return {
    x: targetCoordinate.x,
    y: targetCoordinate.y,
  };
}
