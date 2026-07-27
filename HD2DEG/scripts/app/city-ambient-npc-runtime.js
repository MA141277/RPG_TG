(function attachCityAmbientNpcRuntime(global) {
  const root = global.PixelWorkflowCityAmbientNpc || (global.PixelWorkflowCityAmbientNpc = {});

  function clampInt(value, min, max) {
    const n = Math.floor(Number(value) || 0);
    if (n < min) return min;
    if (n > max) return max;
    return n;
  }

  function tileKey(tile) {
    return Math.floor(Number(tile && tile.x) || 0) + "," + Math.floor(Number(tile && tile.y) || 0);
  }

  function clonePoint(point) {
    return {
      x: Number(point && point.x) || 0,
      y: Number(point && point.y) || 0,
    };
  }

  function defaultDescriptor(sceneId, index) {
    const palette = index % 3;
    return {
      id: `ambient:${sceneId || "scene"}:${index}`,
      type: "capsule-placeholder",
      palette: palette === 0 ? "neutral" : (palette === 1 ? "warm" : "cool"),
      speed: 1 + (palette * 0.08),
      scale: 1,
      interactive: false,
      sceneId: sceneId || "",
    };
  }

  function ensureDescriptorPool(sceneId, descriptors, minLength) {
    const out = Array.isArray(descriptors) ? descriptors.slice() : [];
    for (let index = out.length; index < minLength; index++) {
      out.push(defaultDescriptor(sceneId, index));
    }
    return out.map(function normalizeDescriptor(entry, index) {
      return Object.assign({}, defaultDescriptor(sceneId, index), entry || {}, {
        id: String((entry && entry.id) || `ambient:${sceneId || "scene"}:${index}`),
        type: "capsule-placeholder",
        interactive: false,
      });
    });
  }

  function buildNodePool(sceneIndex) {
    const entrances = Array.isArray(sceneIndex && sceneIndex.entranceNodes) ? sceneIndex.entranceNodes : [];
    const gates = Array.isArray(sceneIndex && sceneIndex.gateNodes) ? sceneIndex.gateNodes : [];
    const out = [];
    for (let i = 0; i < entrances.length; i++) {
      const node = entrances[i];
      if (!node || !node.tile) continue;
      out.push({
        id: `entrance:${String(node.objectId == null ? i : node.objectId)}`,
        tile: clonePoint(node.tile),
        world: clonePoint(node.world || node.tile),
      });
    }
    for (let i = 0; i < gates.length; i++) {
      const node = gates[i];
      if (!node || !node.tile || node.blocked) continue;
      out.push({
        id: `gate:${String(node.side || i)}`,
        tile: clonePoint(node.tile),
        world: clonePoint(node.world || node.tile),
      });
    }
    return out;
  }

  function buildWaypointList(sceneIndex, startNode, endNode, tilePath) {
    const points = [];
    const worldFromTile = sceneIndex && typeof sceneIndex.worldFromTile === "function"
      ? sceneIndex.worldFromTile
      : function fallbackWorldFromTile(tile) { return { x: tile.x + 0.5, y: tile.y + 0.5 }; };

    points.push(clonePoint(startNode.world));
    for (let index = 1; index < tilePath.length - 1; index++) {
      points.push(clonePoint(worldFromTile(tilePath[index])));
    }
    points.push(clonePoint(endNode.world));

    const out = [];
    for (let index = 0; index < points.length; index++) {
      const current = points[index];
      const prev = out[out.length - 1];
      if (!prev || Math.abs(prev.x - current.x) > 1e-6 || Math.abs(prev.y - current.y) > 1e-6) {
        out.push(current);
      }
    }
    return out;
  }

  function createAmbientNpcRuntime(config) {
    const settings = config && typeof config === "object" ? config : {};
    const random = typeof settings.random === "function" ? settings.random : Math.random;
    const minActive = 4;
    const maxActive = 8;
    const spawnRetryLimit = clampInt(settings.spawnRetryLimit, 2, 64) || 12;
    const baseWalkSpeed = Math.max(0.5, Number(settings.walkSpeedWorldPerSec) || 5.4);
    const bobAmplitudeWorld = Math.max(0.04, Number(settings.bobAmplitudeWorld) || 0.12);
    const bobFrequencyHz = Math.max(0.5, Number(settings.bobFrequencyHz) || 2.4);
    const getAmbientNpcDescriptors = typeof settings.getAmbientNpcDescriptors === "function"
      ? settings.getAmbientNpcDescriptors
      : function fallbackDescriptors(sceneId) {
          return ensureDescriptorPool(sceneId, [], maxActive);
        };

    let active = [];
    let sceneId = "";
    let sceneIndex = null;
    let nodePool = [];
    let desiredActive = minActive;
    let descriptorCursor = 0;
    let nextWalkerId = 1;

    function getDescriptors(targetSceneId) {
      return ensureDescriptorPool(targetSceneId, getAmbientNpcDescriptors(targetSceneId), maxActive);
    }

    function clearScene() {
      active = [];
      nodePool = [];
      desiredActive = minActive;
      descriptorCursor = 0;
    }

    function chooseNodePair() {
      if (!sceneIndex || nodePool.length < 2) return null;
      for (let attempt = 0; attempt < spawnRetryLimit; attempt++) {
        const startNode = nodePool[Math.floor(random() * nodePool.length)];
        const endNode = nodePool[Math.floor(random() * nodePool.length)];
        if (!startNode || !endNode || startNode.id === endNode.id) continue;
        const tilePath = typeof root.findShortestTilePath === "function"
          ? root.findShortestTilePath(sceneIndex, startNode.tile, endNode.tile)
          : [];
        if (!Array.isArray(tilePath) || tilePath.length < 2) continue;
        return {
          startNode,
          endNode,
          tilePath,
        };
      }
      return null;
    }

    function spawnWalker() {
      const pair = chooseNodePair();
      if (!pair) return false;
      const descriptors = getDescriptors(sceneId);
      if (!descriptors.length) return false;
      const descriptor = descriptors[descriptorCursor % descriptors.length];
      descriptorCursor += 1;
      const waypoints = buildWaypointList(sceneIndex, pair.startNode, pair.endNode, pair.tilePath);
      if (waypoints.length < 2) return false;
      active.push({
        walkerId: nextWalkerId++,
        descriptor,
        wx: waypoints[0].x,
        wy: waypoints[0].y,
        waypoints,
        waypointIndex: 1,
        bobPhase: random() * Math.PI * 2,
        speed: baseWalkSpeed * Math.max(0.65, Number(descriptor.speed) || 1),
        scale: Math.max(0.75, Number(descriptor.scale) || 1),
      });
      return true;
    }

    function maintainPopulation() {
      if (!sceneIndex || nodePool.length < 2) return;
      let guard = 0;
      while (active.length < desiredActive && guard < maxActive * spawnRetryLimit) {
        if (!spawnWalker()) break;
        guard += 1;
      }
    }

    return {
      minActive,
      maxActive,
      resetForScene(nextSceneId, nextSceneIndex) {
        sceneId = String(nextSceneId || "");
        sceneIndex = nextSceneIndex && typeof nextSceneIndex === "object" ? nextSceneIndex : null;
        clearScene();
        if (!sceneIndex) return;
        nodePool = buildNodePool(sceneIndex);
        if (nodePool.length < 2) return;
        desiredActive = minActive + Math.floor(random() * (maxActive - minActive + 1));
        maintainPopulation();
      },
      tick(deltaMs) {
        const dtMs = Math.max(0, Number(deltaMs) || 0);
        if (!sceneIndex || !active.length) {
          maintainPopulation();
          return;
        }
        const dtSec = dtMs / 1000;
        const nextActive = [];
        for (let index = 0; index < active.length; index++) {
          const walker = active[index];
          walker.bobPhase += dtSec * bobFrequencyHz * Math.PI * 2;
          let remaining = walker.speed * dtSec;
          while (remaining > 0 && walker.waypointIndex < walker.waypoints.length) {
            const target = walker.waypoints[walker.waypointIndex];
            const dx = target.x - walker.wx;
            const dy = target.y - walker.wy;
            const distance = Math.hypot(dx, dy) || 0;
            if (distance <= Math.max(0.0001, remaining)) {
              walker.wx = target.x;
              walker.wy = target.y;
              walker.waypointIndex += 1;
              remaining -= distance;
              continue;
            }
            walker.wx += (dx / distance) * remaining;
            walker.wy += (dy / distance) * remaining;
            remaining = 0;
          }
          if (walker.waypointIndex < walker.waypoints.length) {
            nextActive.push(walker);
          }
        }
        active = nextActive;
        maintainPopulation();
      },
      getRenderables() {
        return active.map(function toRenderable(walker) {
          return {
            id: walker.descriptor.id + ":" + walker.walkerId,
            type: "capsule-placeholder",
            wx: walker.wx,
            wy: walker.wy,
            scale: walker.scale,
            palette: walker.descriptor.palette || "neutral",
            interactive: false,
            bobOffset: Math.sin(walker.bobPhase) * bobAmplitudeWorld,
          };
        });
      },
      getDescriptors,
    };
  }

  root.createAmbientNpcRuntime = createAmbientNpcRuntime;
})(window);
