(function attachCityAmbientNpcPathfinder(global) {
  const root = global.PixelWorkflowCityAmbientNpc || (global.PixelWorkflowCityAmbientNpc = {});

  function tileKey(tile) {
    return Math.floor(Number(tile.x) || 0) + "," + Math.floor(Number(tile.y) || 0);
  }

  function normalizeTile(tile) {
    return {
      x: Math.floor(Number(tile && tile.x) || 0),
      y: Math.floor(Number(tile && tile.y) || 0),
    };
  }

  function inBounds(tile, bounds) {
    if (!bounds) return true;
    return tile.x >= bounds.minX && tile.x <= bounds.maxX && tile.y >= bounds.minY && tile.y <= bounds.maxY;
  }

  function reconstructPath(cameFrom, endKey) {
    const out = [];
    let currentKey = endKey;
    while (currentKey) {
      const current = cameFrom.get(currentKey);
      out.push(current.tile);
      currentKey = current.from;
    }
    return out.reverse();
  }

  function findShortestTilePath(sceneIndex, startTile, endTile) {
    if (!sceneIndex || !sceneIndex.blockedTiles) return [];
    const start = normalizeTile(startTile);
    const end = normalizeTile(endTile);
    const startKey = tileKey(start);
    const endKey = tileKey(end);
    if (startKey === endKey) return [start];

    const bounds = sceneIndex.bounds || null;
    const blockedTiles = sceneIndex.blockedTiles;
    const frontier = [start];
    const cameFrom = new Map([[startKey, { tile: start, from: "" }]]);
    const directions = [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 0, y: -1 },
    ];

    for (let cursor = 0; cursor < frontier.length; cursor++) {
      const current = frontier[cursor];
      for (const direction of directions) {
        const next = { x: current.x + direction.x, y: current.y + direction.y };
        const nextKey = tileKey(next);
        if (cameFrom.has(nextKey)) continue;
        if (!inBounds(next, bounds)) continue;
        if (nextKey !== endKey && nextKey !== startKey && blockedTiles.has(nextKey)) continue;
        cameFrom.set(nextKey, { tile: next, from: tileKey(current) });
        if (nextKey === endKey) return reconstructPath(cameFrom, endKey);
        frontier.push(next);
      }
    }

    return [];
  }

  root.findShortestTilePath = findShortestTilePath;
})(window);
