(function attachCityAmbientNpcSceneIndex(global) {
  const root = global.PixelWorkflowCityAmbientNpc || (global.PixelWorkflowCityAmbientNpc = {});

  function tileKey(tile) {
    return Math.floor(Number(tile.x) || 0) + "," + Math.floor(Number(tile.y) || 0);
  }

  function normalizeBounds(scene, footprints) {
    const raw = scene && scene.bounds && typeof scene.bounds === "object" ? scene.bounds : null;
    if (raw) {
      const minX = Math.floor(Number(raw.minX) || 0);
      const minY = Math.floor(Number(raw.minY) || 0);
      const maxX = Math.ceil(Number(raw.maxX) || minX);
      const maxY = Math.ceil(Number(raw.maxY) || minY);
      return { minX, minY, maxX: Math.max(minX, maxX), maxY: Math.max(minY, maxY) };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const footprint of footprints) {
      for (const point of footprint || []) {
        const x = Number(point.x);
        const y = Number(point.y);
        if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }

    if (!Number.isFinite(minX) || !Number.isFinite(minY) || !Number.isFinite(maxX) || !Number.isFinite(maxY)) {
      return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    }

    return {
      minX: Math.floor(minX),
      minY: Math.floor(minY),
      maxX: Math.ceil(maxX),
      maxY: Math.ceil(maxY),
    };
  }

  function defaultWorldFromTile(tile) {
    return {
      x: Math.floor(Number(tile.x) || 0) + 0.5,
      y: Math.floor(Number(tile.y) || 0) + 0.5,
    };
  }

  function defaultTileFromWorld(point) {
    return {
      x: Math.floor(Number(point && point.x) || 0),
      y: Math.floor(Number(point && point.y) || 0),
    };
  }

  function fallbackBuildingFootprintWorld(object) {
    if (!object || !object.model) return [];
    const width = Number(object.model.W) || 0;
    const depth = Number(object.model.D) || 0;
    if (!(width > 0 && depth > 0)) return [];
    const scale = Number.isFinite(Number(object.scale)) && Number(object.scale) > 0 ? Number(object.scale) : 1;
    const angle = Number.isFinite(Number(object.angle)) ? Number(object.angle) : Math.PI * 0.25;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const originX = Number(object.wx) || 0;
    const originY = Number(object.wy) || 0;
    return [
      [-width * 0.5, -depth * 0.5],
      [width * 0.5, -depth * 0.5],
      [width * 0.5, depth * 0.5],
      [-width * 0.5, depth * 0.5],
    ].map(function mapModelCorner(pair) {
      const localX = pair[0] * scale;
      const localY = pair[1] * scale;
      return {
        x: originX + (localX * cosA - localY * sinA),
        y: originY + (localX * sinA + localY * cosA),
      };
    });
  }

  function pointInPolygon(point, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const pi = polygon[i];
      const pj = polygon[j];
      const yi = Number(pi.y);
      const yj = Number(pj.y);
      const xi = Number(pi.x);
      const xj = Number(pj.x);
      const crosses = (yi > point.y) !== (yj > point.y);
      if (crosses) {
        const xAtY = ((xj - xi) * (point.y - yi)) / ((yj - yi) || 1) + xi;
        if (point.x < xAtY) inside = !inside;
      }
    }
    return inside;
  }

  function footprintBounds(footprint) {
    const xs = footprint.map(function mapX(point) { return Number(point.x) || 0; });
    const ys = footprint.map(function mapY(point) { return Number(point.y) || 0; });
    return {
      minX: Math.floor(Math.min.apply(Math, xs)),
      minY: Math.floor(Math.min.apply(Math, ys)),
      maxX: Math.ceil(Math.max.apply(Math, xs)),
      maxY: Math.ceil(Math.max.apply(Math, ys)),
    };
  }

  function clampTile(tile, bounds) {
    return {
      x: Math.max(bounds.minX, Math.min(bounds.maxX, Math.floor(Number(tile.x) || 0))),
      y: Math.max(bounds.minY, Math.min(bounds.maxY, Math.floor(Number(tile.y) || 0))),
    };
  }

  function hasHouseAccess(object) {
    if (!object || !object.model) return false;
    if (object.drawRoad === true || object.drawRoad === "true" || object.drawRoad === 1 || object.drawRoad === "1") return true;
    if (object.isHouse) return true;
    return Array.isArray(object.tags) && object.tags.indexOf("house") !== -1;
  }

  function buildEntranceNode(object, bounds, tileFromWorld) {
    const angle = Number.isFinite(Number(object.angle)) ? Number(object.angle) : Math.PI * 0.25;
    const scale = Number.isFinite(Number(object.scale)) && Number(object.scale) > 0 ? Number(object.scale) : 1;
    const halfDepth = Math.max(1, (Number(object.model && object.model.D) || 8) * 0.5 * scale);
    const dirX = -Math.sin(angle);
    const dirY = Math.cos(angle);
    const facade = {
      x: (Number(object.wx) || 0) + dirX * halfDepth,
      y: (Number(object.wy) || 0) + dirY * halfDepth,
    };
    const tile = clampTile(tileFromWorld(facade), bounds);
    return {
      objectId: object.id,
      tile,
      world: facade,
    };
  }

  function buildGateNodes(bounds, blockedTiles) {
    const midX = Math.floor((bounds.minX + bounds.maxX) * 0.5);
    const midY = Math.floor((bounds.minY + bounds.maxY) * 0.5);
    const candidates = [
      { side: "north", tile: { x: midX, y: bounds.minY } },
      { side: "east", tile: { x: bounds.maxX, y: midY } },
      { side: "south", tile: { x: midX, y: bounds.maxY } },
      { side: "west", tile: { x: bounds.minX, y: midY } },
    ];
    return candidates.map(function mapGate(node) {
      return {
        side: node.side,
        tile: node.tile,
        blocked: blockedTiles.has(tileKey(node.tile)),
      };
    });
  }

  function buildSceneIndex(scene, helpers) {
    const safeHelpers = helpers && typeof helpers === "object" ? helpers : {};
    const objects = scene && Array.isArray(scene.objects) ? scene.objects : [];
    const buildingFootprintWorld = typeof safeHelpers.buildingFootprintWorld === "function"
      ? safeHelpers.buildingFootprintWorld
      : fallbackBuildingFootprintWorld;
    const worldFromTileImpl = typeof safeHelpers.worldFromTile === "function"
      ? safeHelpers.worldFromTile
      : defaultWorldFromTile;
    const tileFromWorldImpl = typeof safeHelpers.tileFromWorld === "function"
      ? safeHelpers.tileFromWorld
      : defaultTileFromWorld;
    const objectFootprints = objects.map(function mapFootprint(object) {
      return { object, footprint: buildingFootprintWorld(object) || [] };
    });
    const bounds = normalizeBounds(scene, objectFootprints.map(function mapEntry(entry) { return entry.footprint; }));
    const blockedTiles = new Set();

    function worldFromTile(tile) {
      return worldFromTileImpl(tile);
    }

    function tileFromWorld(point) {
      return tileFromWorldImpl(point);
    }

    for (const entry of objectFootprints) {
      if (!entry.footprint || entry.footprint.length < 3) continue;
      const bb = footprintBounds(entry.footprint);
      const minX = Math.max(bounds.minX, bb.minX);
      const minY = Math.max(bounds.minY, bb.minY);
      const maxX = Math.min(bounds.maxX, bb.maxX);
      const maxY = Math.min(bounds.maxY, bb.maxY);
      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          if (pointInPolygon(worldFromTile({ x, y }), entry.footprint)) {
            blockedTiles.add(tileKey({ x, y }));
          }
        }
      }
    }

    const entranceNodes = objectFootprints
      .filter(function filterEntrances(entry) { return hasHouseAccess(entry.object); })
      .map(function mapEntrance(entry) { return buildEntranceNode(entry.object, bounds, tileFromWorld); });
    const gateNodes = buildGateNodes(bounds, blockedTiles);

    return {
      blockedTiles,
      entranceNodes,
      gateNodes,
      bounds,
      worldFromTile,
      tileFromWorld,
    };
  }

  root.buildSceneIndex = buildSceneIndex;
})(window);
