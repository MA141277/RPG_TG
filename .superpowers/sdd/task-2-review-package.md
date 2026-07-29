# Task 2 Review Package

Git is unavailable in this environment. Review current file contents and implementer report against the Task 2 brief.

## Changed/Relevant Files

- tests/robustness.test.cjs
- src/ui/views/map/campaign-terrain-webgl.ts
- src/ui/views/map/shaders/campaign-terrain.frag.glsl if changed

## Search Evidence
src\ui\views\map\campaign-terrain-webgl.ts:83:  worldScale: CampaignTerrainWorldScale;
src\ui\views\map\campaign-terrain-webgl.ts:566:    worldScale: DEFAULT_TERRAIN_WORLD_SCALE,
src\ui\views\map\campaign-terrain-webgl.ts:574:  worldScale: CampaignTerrainWorldScale;
src\ui\views\map\campaign-terrain-webgl.ts:577:  const worldPoint = createTerrainWorldPoint(input.u, input.v, 0, input.worldScale);
src\ui\views\map\campaign-terrain-webgl.ts:679:  terrainCoordinates: CampaignTerrainCoordinateSystem;
src\ui\views\map\campaign-terrain-webgl.ts:680:  worldScale: CampaignTerrainWorldScale;
src\ui\views\map\campaign-terrain-webgl.ts:899:  worldScale: CampaignTerrainWorldScale
src\ui\views\map\campaign-terrain-webgl.ts:903:    offsetX: camera.offsetX * worldScale.x,
src\ui\views\map\campaign-terrain-webgl.ts:904:    offsetY: camera.offsetY * worldScale.y,
src\ui\views\map\campaign-terrain-webgl.ts:1007:    createTerrainWorldPoint(u, v, height, renderer.projectionInput.materialSemanticModel.worldScale)
src\ui\views\map\campaign-terrain-webgl.ts:1061:    renderer.projectionInput.materialSemanticModel.worldScale
src\ui\views\map\campaign-terrain-webgl.ts:1379:  currentTerrainWorldScale = materialSemanticModel.worldScale;
src\ui\views\map\campaign-terrain-webgl.ts:2572:          worldScale: materialSemanticModel.worldScale,
src\ui\views\map\campaign-terrain-webgl.ts:2607:          worldScale: materialSemanticModel.worldScale,
src\ui\views\map\campaign-terrain-webgl.ts:2810:          worldScale: materialSemanticModel.worldScale,
src\ui\views\map\campaign-terrain-webgl.ts:2965:          worldScale: materialSemanticModel.worldScale,
src\ui\views\map\campaign-terrain-webgl.ts:2988:                worldScale: materialSemanticModel.worldScale,
src\ui\views\map\campaign-terrain-webgl.ts:3013:            worldScale: materialSemanticModel.worldScale,
src\ui\views\map\campaign-terrain-webgl.ts:3130:          worldScale: materialSemanticModel.worldScale,
src\ui\views\map\campaign-terrain-webgl.ts:3151:              worldScale: materialSemanticModel.worldScale,
src\ui\views\map\campaign-terrain-webgl.ts:3175:            worldScale: materialSemanticModel.worldScale,
src\ui\views\map\campaign-terrain-webgl.ts:3273:          materialSemanticModel.worldScale
src\ui\views\map\campaign-terrain-webgl.ts:3365:        worldScale: materialSemanticModel.worldScale,
src\ui\views\map\campaign-terrain-webgl.ts:3378:        materialSemanticModel.worldScale
src\ui\views\map\campaign-terrain-webgl.ts:3788:  const point = terrainUvToHexPoint(u, v, coordinateSystem);
src\ui\views\map\campaign-terrain-webgl.ts:3937:    input.semanticData.materialSemanticModel.worldScale,
src\ui\views\map\campaign-terrain-webgl.ts:4048:      minU = Math.min(minU, hexPointToTerrainU(center.x - radiusX, coordinateSystem));
src\ui\views\map\campaign-terrain-webgl.ts:4049:      maxU = Math.max(maxU, hexPointToTerrainU(center.x + radiusX, coordinateSystem));
src\ui\views\map\campaign-terrain-webgl.ts:4050:      minV = Math.min(minV, hexPointToTerrainV(center.y - radiusY, coordinateSystem));
src\ui\views\map\campaign-terrain-webgl.ts:4051:      maxV = Math.max(maxV, hexPointToTerrainV(center.y + radiusY, coordinateSystem));
src\ui\views\map\campaign-terrain-webgl.ts:4075:      const point = terrainUvToHexPoint(u, v, materialSemanticModel.terrainCoordinates);
src\ui\views\map\campaign-terrain-webgl.ts:4130:      const point = terrainUvToHexPoint(u, v, materialSemanticModel.terrainCoordinates);
src\ui\views\map\campaign-terrain-webgl.ts:4182:      const point = terrainUvToHexPoint(u, v, materialSemanticModel.terrainCoordinates);
src\ui\views\map\campaign-terrain-webgl.ts:4334:      const point = terrainUvToHexPoint(u, v, materialSemanticModel.terrainCoordinates);
src\ui\views\map\campaign-terrain-webgl.ts:4383:      const point = terrainUvToHexPoint(u, v, materialSemanticModel.terrainCoordinates);
src\ui\views\map\campaign-terrain-webgl.ts:4419:      const point = terrainUvToHexPoint(u, v, materialSemanticModel.terrainCoordinates);
src\ui\views\map\campaign-terrain-webgl.ts:4434:        const samplePoint = terrainUvToHexPoint(sampleU, sampleV);
src\ui\views\map\campaign-terrain-webgl.ts:4488:        const point = terrainUvToHexPoint(u, v);
src\ui\views\map\campaign-terrain-webgl.ts:4590:      const point = terrainUvToHexPoint(u, v, materialSemanticModel.terrainCoordinates);
src\ui\views\map\campaign-terrain-webgl.ts:4620:      const point = terrainUvToHexPoint(u, v);
src\ui\views\map\campaign-terrain-webgl.ts:4684:      const point = terrainUvToHexPoint(u, v);
src\ui\views\map\campaign-terrain-webgl.ts:4699:        const samplePoint = terrainUvToHexPoint(
src\ui\views\map\campaign-terrain-webgl.ts:4893:  worldScale: CampaignTerrainWorldScale,
src\ui\views\map\campaign-terrain-webgl.ts:4909:        worldScale
src\ui\views\map\campaign-terrain-webgl.ts:5692:  worldScale: CampaignTerrainWorldScale
src\ui\views\map\campaign-terrain-webgl.ts:5707:    const center = createTerrainWorldPoint(instance.u, instance.v, terrainHeight, worldScale);
src\ui\views\map\campaign-terrain-webgl.ts:6214:      u: hexPointToTerrainU(center.x, materialSemanticModel.terrainCoordinates),
src\ui\views\map\campaign-terrain-webgl.ts:6215:      v: hexPointToTerrainV(center.y, materialSemanticModel.terrainCoordinates),
src\ui\views\map\campaign-terrain-webgl.ts:6302:      u: hexPointToTerrainU(center.x, input.materialSemanticModel.terrainCoordinates),
src\ui\views\map\campaign-terrain-webgl.ts:6303:      v: hexPointToTerrainV(center.y, input.materialSemanticModel.terrainCoordinates),
src\ui\views\map\campaign-terrain-webgl.ts:6326:  worldScale: CampaignTerrainWorldScale
src\ui\views\map\campaign-terrain-webgl.ts:6334:        worldScale
src\ui\views\map\campaign-terrain-webgl.ts:6444:  worldScale: CampaignTerrainWorldScale
src\ui\views\map\campaign-terrain-webgl.ts:6449:    createTerrainWorldPoint(fort.u, fort.v, height, worldScale)
src\ui\views\map\campaign-terrain-webgl.ts:6483:  worldScale: CampaignTerrainWorldScale;
src\ui\views\map\campaign-terrain-webgl.ts:6501:    input.worldScale
src\ui\views\map\campaign-terrain-webgl.ts:6699:    u: hexPointToTerrainU(point.x),
src\ui\views\map\campaign-terrain-webgl.ts:6700:    v: hexPointToTerrainV(point.y),
src\ui\views\map\campaign-terrain-webgl.ts:6907:  worldScale: CampaignTerrainWorldScale;
src\ui\views\map\campaign-terrain-webgl.ts:6952:          input.worldScale
src\ui\views\map\campaign-terrain-webgl.ts:7059:  worldScale: CampaignTerrainWorldScale;
src\ui\views\map\campaign-terrain-webgl.ts:7081:    const center = createTerrainWorldPoint(instance.u, instance.v, height, input.worldScale);
src\ui\views\map\campaign-terrain-webgl.ts:7088:    const worldScale = placement.baseWorldScale * instance.scale;
src\ui\views\map\campaign-terrain-webgl.ts:7094:      const localX = (instance.mesh.positions[sourcePositionOffset] ?? 0) * worldScale;
src\ui\views\map\campaign-terrain-webgl.ts:7095:      const localY = (instance.mesh.positions[sourcePositionOffset + 1] ?? 0) * worldScale;
src\ui\views\map\campaign-terrain-webgl.ts:7096:      const localZ = (instance.mesh.positions[sourcePositionOffset + 2] ?? 0) * worldScale;
src\ui\views\map\campaign-terrain-webgl.ts:7204:  const point = terrainUvToHexPoint(u, v);
src\ui\views\map\campaign-terrain-webgl.ts:7209:    u: hexPointToTerrainU(center.x),
src\ui\views\map\campaign-terrain-webgl.ts:7210:    v: hexPointToTerrainV(center.y),
src\ui\views\map\campaign-terrain-webgl.ts:7309:  const terrainCoordinates = createCampaignTerrainCoordinateSystem(coordinateSystem);
src\ui\views\map\campaign-terrain-webgl.ts:7320:    terrainCoordinates,
src\ui\views\map\campaign-terrain-webgl.ts:7321:    worldScale: terrainCoordinates.worldScale,
src\ui\views\map\campaign-terrain-webgl.ts:7396:  const terrainCoordinates = createCampaignTerrainCoordinateSystem(
src\ui\views\map\campaign-terrain-webgl.ts:7403:    terrainCoordinates,
src\ui\views\map\campaign-terrain-webgl.ts:7404:    worldScale: terrainCoordinates.worldScale,
src\ui\views\map\campaign-terrain-webgl.ts:7433:        u: hexPointToTerrainU(center.x, campaignHexGrid.coordinateSystem),
src\ui\views\map\campaign-terrain-webgl.ts:7434:        v: hexPointToTerrainV(center.y, campaignHexGrid.coordinateSystem),
src\ui\views\map\campaign-terrain-webgl.ts:7510:  worldScale: CampaignTerrainWorldScale;
src\ui\views\map\campaign-terrain-webgl.ts:7528:        input.worldScale
src\ui\views\map\campaign-terrain-webgl.ts:7590:    input.worldScale
src\ui\views\map\campaign-terrain-webgl.ts:7611:  worldScale: CampaignTerrainWorldScale
src\ui\views\map\campaign-terrain-webgl.ts:7616:    createTerrainWorldPoint(cell.u, cell.v, height, worldScale)
src\ui\views\map\campaign-terrain-webgl.ts:7866:    const u = hexPointToTerrainU(point.x);
src\ui\views\map\campaign-terrain-webgl.ts:7867:    const v = hexPointToTerrainV(point.y);
src\ui\views\map\campaign-terrain-webgl.ts:7921:    const point = terrainUvToHexPoint(avoidancePoint.u, avoidancePoint.v);
src\ui\views\map\campaign-terrain-webgl.ts:7935:    const avoidPoint = terrainUvToHexPoint(avoidancePoint.u, avoidancePoint.v);
src\ui\views\map\campaign-terrain-webgl.ts:8014:    const worldScale = placement.baseWorldScale * instance.scale;
src\ui\views\map\campaign-terrain-webgl.ts:8019:      const localX = (instance.mesh.positions[sourcePositionOffset] ?? 0) * worldScale;
src\ui\views\map\campaign-terrain-webgl.ts:8020:      const localY = (instance.mesh.positions[sourcePositionOffset + 1] ?? 0) * worldScale;
src\ui\views\map\campaign-terrain-webgl.ts:8021:      const localZ = (instance.mesh.positions[sourcePositionOffset + 2] ?? 0) * worldScale;
src\ui\views\map\campaign-terrain-webgl.ts:8099:  const worldScale = placement.baseWorldScale * instance.scale;
src\ui\views\map\campaign-terrain-webgl.ts:8104:  ) * worldScale;
src\ui\views\map\campaign-terrain-webgl.ts:8108:  ) * worldScale;
src\ui\views\map\campaign-terrain-webgl.ts:8311:  worldScale: CampaignTerrainWorldScale;
src\ui\views\map\campaign-terrain-webgl.ts:8325:    const center = createTerrainWorldPoint(instance.u, instance.v, height, input.worldScale);
src\ui\views\map\campaign-terrain-webgl.ts:8330:    const worldScale = placement.baseWorldScale * instance.scale;
src\ui\views\map\campaign-terrain-webgl.ts:8335:    ) * worldScale;
src\ui\views\map\campaign-terrain-webgl.ts:8339:    ) * worldScale;
src\ui\views\map\campaign-terrain-webgl.ts:8372:  worldScale: CampaignTerrainWorldScale;
src\ui\views\map\campaign-terrain-webgl.ts:8378:    input.worldScale
src\ui\views\map\campaign-terrain-webgl.ts:8551:      input.materialSemanticModel.worldScale
src\ui\views\map\campaign-terrain-webgl.ts:8696:      const point = terrainUvToHexPoint(u, v);
src\ui\views\map\campaign-terrain-webgl.ts:8846:  const minEdgeU = hexPointToTerrainU(minX);
src\ui\views\map\campaign-terrain-webgl.ts:8847:  const maxEdgeU = hexPointToTerrainU(maxX);
src\ui\views\map\campaign-terrain-webgl.ts:8848:  const minEdgeV = hexPointToTerrainV(minY);
src\ui\views\map\campaign-terrain-webgl.ts:8849:  const maxEdgeV = hexPointToTerrainV(maxY);
src\ui\views\map\campaign-terrain-webgl.ts:8896:      const point = terrainUvToHexPoint(u, v);
src\ui\views\map\campaign-terrain-webgl.ts:9337:  worldScale: CampaignTerrainWorldScale
src\ui\views\map\campaign-terrain-webgl.ts:9357:    worldScale
src\ui\views\map\campaign-terrain-webgl.ts:10316:  const point = terrainUvToHexPoint(u, v);
src\ui\views\map\campaign-terrain-webgl.ts:10439:  worldScale: CampaignTerrainWorldScale = DEFAULT_TERRAIN_WORLD_SCALE
src\ui\views\map\campaign-terrain-webgl.ts:10441:  return addTerrainVertex(vertices, u, v, u, v, height, normal, worldScale);
src\ui\views\map\campaign-terrain-webgl.ts:10452:  worldScale: CampaignTerrainWorldScale = DEFAULT_TERRAIN_WORLD_SCALE
src\ui\views\map\campaign-terrain-webgl.ts:10456:    (positionU - 0.5) * 2 * worldScale.x,
src\ui\views\map\campaign-terrain-webgl.ts:10457:    (0.5 - positionV) * 2 * worldScale.y,
src\ui\views\map\campaign-terrain-webgl.ts:10477:function getCampaignHexPointBounds(
src\ui\views\map\campaign-terrain-webgl.ts:10492:function createCampaignTerrainCoordinateSystem(
src\ui\views\map\campaign-terrain-webgl.ts:10495:  const hexPointBounds = getCampaignHexPointBounds(coordinateSystem);
src\ui\views\map\campaign-terrain-webgl.ts:10502:    worldScale: {
src\ui\views\map\campaign-terrain-webgl.ts:10515:    "worldScale" in coordinates
src\ui\views\map\campaign-terrain-webgl.ts:10525:    : createCampaignTerrainCoordinateSystem(coordinates);
src\ui\views\map\campaign-terrain-webgl.ts:10531:  return createCampaignTerrainCoordinateSystem(coordinateSystem).worldScale;
src\ui\views\map\campaign-terrain-webgl.ts:10534:function terrainUvToHexPoint(
src\ui\views\map\campaign-terrain-webgl.ts:10540:  const terrainCoordinates = normalizeCampaignTerrainCoordinates(coordinates);
src\ui\views\map\campaign-terrain-webgl.ts:10541:  const bounds = terrainCoordinates.hexPointBounds;
src\ui\views\map\campaign-terrain-webgl.ts:10549:function hexPointToTerrainU(
src\ui\views\map\campaign-terrain-webgl.ts:10554:  const terrainCoordinates = normalizeCampaignTerrainCoordinates(coordinates);
src\ui\views\map\campaign-terrain-webgl.ts:10555:  const bounds = terrainCoordinates.hexPointBounds;
src\ui\views\map\campaign-terrain-webgl.ts:10563:function hexPointToTerrainV(
src\ui\views\map\campaign-terrain-webgl.ts:10568:  const terrainCoordinates = normalizeCampaignTerrainCoordinates(coordinates);
src\ui\views\map\campaign-terrain-webgl.ts:10569:  const bounds = terrainCoordinates.hexPointBounds;
src\ui\views\map\campaign-terrain-webgl.ts:10586:  const point = terrainUvToHexPoint(u, v);
src\ui\views\map\campaign-terrain-webgl.ts:10609:      hexPointToTerrainU(center.x),
src\ui\views\map\campaign-terrain-webgl.ts:10610:      hexPointToTerrainV(center.y)
src\ui\views\map\campaign-terrain-webgl.ts:10764:  worldScale: CampaignTerrainWorldScale = DEFAULT_TERRAIN_WORLD_SCALE
src\ui\views\map\campaign-terrain-webgl.ts:10767:    (u - 0.5) * 2 * worldScale.x,
src\ui\views\map\campaign-terrain-webgl.ts:10768:    (0.5 - v) * 2 * worldScale.y,
src\ui\views\map\campaign-terrain-webgl.ts:10815:  worldScale: CampaignTerrainWorldScale
src\ui\views\map\campaign-terrain-webgl.ts:10833:        worldScale
src\ui\views\map\campaign-terrain-webgl.ts:10859:          worldScale
src\ui\views\map\campaign-terrain-webgl.ts:10879:  worldScale: CampaignTerrainWorldScale
src\ui\views\map\campaign-terrain-webgl.ts:10882:  const screenPoint = projectPoint(matrix, createTerrainWorldPoint(u, v, height, worldScale));
tests\robustness.test.cjs:4519:  assert.match(terrainRendererSource, /function getCampaignHexPointBounds\(/);
tests\robustness.test.cjs:4520:  assert.match(terrainRendererSource, /function createCampaignTerrainCoordinateSystem\(/);
tests\robustness.test.cjs:4527:    /terrainUvToHexPoint\(u,\s*v,\s*materialSemanticModel\.terrainCoordinates\)/s
