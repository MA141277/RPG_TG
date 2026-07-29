# Task 3 Review Package

Git unavailable. Review current files against Task 3 brief.

## Changed/Relevant Files
- tests/robustness.test.cjs
- src/ui/views/map/campaign-terrain-webgl.ts
- src/ui/views/map/shaders/campaign-terrain.frag.glsl if changed

## Search Evidence
src\ui\views\map\shaders\campaign-terrain.frag.glsl:346:  float shorelineValid = smoothstep(0.20, 0.85, valid);
src\ui\views\map\shaders\campaign-terrain.frag.glsl:350:    shorelineValid * step(0.001, uShorelineVisualWaterStrength)
src\ui\views\map\shaders\campaign-terrain.frag.glsl:355:  vec2 shorelineUv = (uv - uShorelineDistanceBounds.xy) /
src\ui\views\map\shaders\campaign-terrain.frag.glsl:359:    clamp(shorelineUv, vec2(0.0), vec2(1.0))
src\ui\views\map\shaders\campaign-terrain.frag.glsl:365:float getShorelineBoundaryWater(vec2 uv, float water, vec2 shoreline) {
src\ui\views\map\shaders\campaign-terrain.frag.glsl:366:  vec2 validity = getMapInteriorAndShorelineValid(uv, shoreline.y);
src\ui\views\map\shaders\campaign-terrain.frag.glsl:370:    (1.0 - smoothstep(boundaryReach * 0.70, boundaryReach, abs(shoreline.x))) *
src\ui\views\map\shaders\campaign-terrain.frag.glsl:372:  float boundaryWater = smoothstep(-boundaryFeather, boundaryFeather, shoreline.x);
src\ui\views\map\shaders\campaign-terrain.frag.glsl:377:float getShorelineNearShoreTint(vec2 uv, vec2 shoreline, float boundaryWater) {
src\ui\views\map\shaders\campaign-terrain.frag.glsl:378:  vec2 validity = getMapInteriorAndShorelineValid(uv, shoreline.y);
src\ui\views\map\shaders\campaign-terrain.frag.glsl:379:  float waterSide = smoothstep(-0.035, 0.080, shoreline.x);
src\ui\views\map\shaders\campaign-terrain.frag.glsl:384:    (1.0 - smoothstep(0.055, tintReach, max(shoreline.x, 0.0)));
src\ui\views\map\shaders\campaign-terrain.frag.glsl:427:  vec2 shoreline
src\ui\views\map\shaders\campaign-terrain.frag.glsl:430:  vec2 validity = getMapInteriorAndShorelineValid(uv, shoreline.y);
src\ui\views\map\shaders\campaign-terrain.frag.glsl:431:  float landSide = 1.0 - smoothstep(-0.030, 0.085, shoreline.x);
src\ui\views\map\shaders\campaign-terrain.frag.glsl:432:  float beachDepth = max(-shoreline.x, 0.0);
src\ui\views\map\shaders\campaign-terrain.frag.glsl:438:  float raggedFeather = mix(0.86, 1.0, shoreline.y) *
src\ui\views\map\shaders\campaign-terrain.frag.glsl:837:  vec2 shoreline = sampleShorelineDistanceField(vUv);
src\ui\views\map\shaders\campaign-terrain.frag.glsl:838:  float boundaryWater = getShorelineBoundaryWater(vUv, water, shoreline);
src\ui\views\map\shaders\campaign-terrain.frag.glsl:839:  float nearShoreTint = getShorelineNearShoreTint(vUv, shoreline, boundaryWater);
src\ui\views\map\shaders\campaign-terrain.frag.glsl:894:    shoreline
tests\robustness.test.cjs:3881:  assert.match(terrainFragmentSource, /shoreline = sampleShorelineDistanceField/);
tests\robustness.test.cjs:3909:    /getShorelineNearShoreTint\(\s*vUv,\s*shoreline,\s*boundaryWater\s*\)/s
tests\robustness.test.cjs:4413:test("campaign hex grid drives dynamic shoreline without old map rectangle fallback", () => {
tests\robustness.test.cjs:4572:        /^(?:materialSemanticModel\.terrainCoordinates|terrainCoordinates)$/,
tests\robustness.test.cjs:4573:        `Expected ${functionName} to use materialSemanticModel.terrainCoordinates or a local alias`
tests\robustness.test.cjs:4586:    /terrainUvToHexPoint\(u,\s*v,\s*materialSemanticModel\.terrainCoordinates\)/s
tests\robustness.test.cjs:4599:test("campaign terrain runtime grid paths do not use default hex conversion fallbacks", () => {
tests\robustness.test.cjs:4695:    /createShorelineDistanceTextureModel\(\s*input\.semanticData\.materialSemanticModel,/
tests\robustness.test.cjs:4699:    /createCampaignVegetationMesh\(\{\s*[\s\S]*terrainCoordinates:\s*materialSemanticModel\.terrainCoordinates,/
tests\robustness.test.cjs:4703:    /createCampaignFortCityBuildingInstances\(\{\s*[\s\S]*terrainCoordinates:\s*materialSemanticModel\.terrainCoordinates,/
tests\robustness.test.cjs:4708:    /^terrainCoordinates$/
tests\robustness.test.cjs:4710:  assertHexPointCoordinateCalls("snapTerrainUvToHexCenter", /^terrainCoordinates$/);
tests\robustness.test.cjs:4712:    "createShorelineDistanceTextureModel",
tests\robustness.test.cjs:4714:    /^materialSemanticModel\.terrainCoordinates$/
tests\robustness.test.cjs:4719:    /^input\.terrainCoordinates$/
tests\robustness.test.cjs:4721:  assertHexPointCoordinateCalls("rasterizeShorelineDistanceEdge", /^input\.terrainCoordinates$/);
tests\robustness.test.cjs:4724:    /^input\.terrainCoordinates$/
tests\robustness.test.cjs:4728:    /^terrainCoordinates$/
tests\robustness.test.cjs:4733:    /^terrainCoordinates$/
tests\robustness.test.cjs:4738:    /^terrainCoordinates$/
tests\robustness.test.cjs:4741:    "isHexPassableAtUv",
tests\robustness.test.cjs:4743:    /^materialSemanticModel\.terrainCoordinates$/
tests\robustness.test.cjs:4871:    /gl\.uniform4f\(\s*hexPointBoundsLocation,\s*materialSemanticModel\.terrainCoordinates\.hexPointBounds\.minX,\s*materialSemanticModel\.terrainCoordinates\.hexPointBounds\.maxX,\s*materialSemanticModel\.terrainCoordinates\.hexPointBounds\.minY,\s*materialSemanticModel\.terrainCoordinates\.hexPointBounds\.maxY\s*\)/s
src\ui\views\map\campaign-terrain-webgl.ts:480:  shorelineVisualWaterStrength: number;
src\ui\views\map\campaign-terrain-webgl.ts:481:  shorelineEdgeWidth: number;
src\ui\views\map\campaign-terrain-webgl.ts:482:  shorelineWaveStrength: number;
src\ui\views\map\campaign-terrain-webgl.ts:483:  shorelineWaveFrequency: number;
src\ui\views\map\campaign-terrain-webgl.ts:484:  shorelineErosionStrength: number;
src\ui\views\map\campaign-terrain-webgl.ts:485:  shorelineErosionFrequency: number;
src\ui\views\map\campaign-terrain-webgl.ts:486:  shorelineCornerRoundness: number;
src\ui\views\map\campaign-terrain-webgl.ts:500:  shorelineVisualWaterStrength: 0.76,
src\ui\views\map\campaign-terrain-webgl.ts:501:  shorelineEdgeWidth: 0.38,
src\ui\views\map\campaign-terrain-webgl.ts:502:  shorelineWaveStrength: 0.30,
src\ui\views\map\campaign-terrain-webgl.ts:503:  shorelineWaveFrequency: 4.8,
src\ui\views\map\campaign-terrain-webgl.ts:504:  shorelineErosionStrength: 0.055,
src\ui\views\map\campaign-terrain-webgl.ts:505:  shorelineErosionFrequency: 22,
src\ui\views\map\campaign-terrain-webgl.ts:506:  shorelineCornerRoundness: 0.86,
src\ui\views\map\campaign-terrain-webgl.ts:577:  const worldPoint = createTerrainWorldPoint(input.u, input.v, 0, input.worldScale);
src\ui\views\map\campaign-terrain-webgl.ts:664:  shorelineSource: ImageData;
src\ui\views\map\campaign-terrain-webgl.ts:665:  shorelineDistanceRange: number;
src\ui\views\map\campaign-terrain-webgl.ts:666:  shorelineSignature: string;
src\ui\views\map\campaign-terrain-webgl.ts:673:  shorelineTexture: WebGLTexture;
src\ui\views\map\campaign-terrain-webgl.ts:679:  terrainCoordinates: CampaignTerrainCoordinateSystem;
src\ui\views\map\campaign-terrain-webgl.ts:711:const shorelineChainEdgesBySemanticModel = new WeakMap<
src\ui\views\map\campaign-terrain-webgl.ts:849:    shorelineVisualWaterStrength: clampNumber(tuning.shorelineVisualWaterStrength, 0, 1),
src\ui\views\map\campaign-terrain-webgl.ts:850:    shorelineEdgeWidth: clampNumber(tuning.shorelineEdgeWidth, 0.02, 1.2),
src\ui\views\map\campaign-terrain-webgl.ts:851:    shorelineWaveStrength: clampNumber(tuning.shorelineWaveStrength, 0, 0.5),
src\ui\views\map\campaign-terrain-webgl.ts:852:    shorelineWaveFrequency: clampNumber(tuning.shorelineWaveFrequency, 0.2, 12),
src\ui\views\map\campaign-terrain-webgl.ts:853:    shorelineErosionStrength: clampNumber(tuning.shorelineErosionStrength, 0, 0.45),
src\ui\views\map\campaign-terrain-webgl.ts:854:    shorelineErosionFrequency: clampNumber(tuning.shorelineErosionFrequency, 2, 80),
src\ui\views\map\campaign-terrain-webgl.ts:855:    shorelineCornerRoundness: clampNumber(tuning.shorelineCornerRoundness, 0, 1),
src\ui\views\map\campaign-terrain-webgl.ts:1007:    createTerrainWorldPoint(u, v, height, renderer.projectionInput.materialSemanticModel.worldScale)
src\ui\views\map\campaign-terrain-webgl.ts:1080:  return isHexPassableAtUv(
src\ui\views\map\campaign-terrain-webgl.ts:1388:      : getCampaignVegetationCells(
src\ui\views\map\campaign-terrain-webgl.ts:1445:  const shorelineDistanceTextureLocation = gl.getUniformLocation(
src\ui\views\map\campaign-terrain-webgl.ts:1449:  const shorelineDistanceRangeLocation = gl.getUniformLocation(
src\ui\views\map\campaign-terrain-webgl.ts:1453:  const shorelineDistanceBoundsLocation = gl.getUniformLocation(
src\ui\views\map\campaign-terrain-webgl.ts:1540:  const shorelineVisualWaterStrengthLocation = gl.getUniformLocation(
src\ui\views\map\campaign-terrain-webgl.ts:1544:  const shorelineEdgeWidthLocation = gl.getUniformLocation(program, "uShorelineEdgeWidth");
src\ui\views\map\campaign-terrain-webgl.ts:1545:  const shorelineCornerRoundnessLocation = gl.getUniformLocation(
src\ui\views\map\campaign-terrain-webgl.ts:1820:    shorelineDistanceTextureLocation == null ? "uShorelineDistanceTexture" : null,
src\ui\views\map\campaign-terrain-webgl.ts:1821:    shorelineDistanceRangeLocation == null ? "uShorelineDistanceRange" : null,
src\ui\views\map\campaign-terrain-webgl.ts:1822:    shorelineDistanceBoundsLocation == null ? "uShorelineDistanceBounds" : null,
src\ui\views\map\campaign-terrain-webgl.ts:1860:    shorelineVisualWaterStrengthLocation == null ? "uShorelineVisualWaterStrength" : null,
src\ui\views\map\campaign-terrain-webgl.ts:1861:    shorelineEdgeWidthLocation == null ? "uShorelineEdgeWidth" : null,
src\ui\views\map\campaign-terrain-webgl.ts:1862:    shorelineCornerRoundnessLocation == null ? "uShorelineCornerRoundness" : null,
src\ui\views\map\campaign-terrain-webgl.ts:2381:    const shorelineTexture = createTexture(gl, chunk.shorelineSource, {
src\ui\views\map\campaign-terrain-webgl.ts:2392:      gl.deleteTexture(shorelineTexture);
src\ui\views\map\campaign-terrain-webgl.ts:2404:      shorelineTexture,
src\ui\views\map\campaign-terrain-webgl.ts:2529:        gl.deleteTexture(chunkResource.shorelineTexture);
src\ui\views\map\campaign-terrain-webgl.ts:2575:          terrainCoordinates: materialSemanticModel.terrainCoordinates,
src\ui\views\map\campaign-terrain-webgl.ts:2611:          terrainCoordinates: materialSemanticModel.terrainCoordinates,
src\ui\views\map\campaign-terrain-webgl.ts:2650:      gl.uniform1i(shorelineDistanceTextureLocation, 7);
src\ui\views\map\campaign-terrain-webgl.ts:2688:        materialSemanticModel.terrainCoordinates.hexPointBounds.minX,
src\ui\views\map\campaign-terrain-webgl.ts:2689:        materialSemanticModel.terrainCoordinates.hexPointBounds.maxX,
src\ui\views\map\campaign-terrain-webgl.ts:2690:        materialSemanticModel.terrainCoordinates.hexPointBounds.minY,
src\ui\views\map\campaign-terrain-webgl.ts:2691:        materialSemanticModel.terrainCoordinates.hexPointBounds.maxY
src\ui\views\map\campaign-terrain-webgl.ts:2735:        shorelineVisualWaterStrengthLocation,
src\ui\views\map\campaign-terrain-webgl.ts:2736:        terrainBeachTuning.shorelineVisualWaterStrength
src\ui\views\map\campaign-terrain-webgl.ts:2738:      gl.uniform1f(shorelineEdgeWidthLocation, terrainBeachTuning.shorelineEdgeWidth);
src\ui\views\map\campaign-terrain-webgl.ts:2739:      gl.uniform1f(shorelineCornerRoundnessLocation, terrainBeachTuning.shorelineCornerRoundness);
src\ui\views\map\campaign-terrain-webgl.ts:2752:        gl.bindTexture(gl.TEXTURE_2D, chunkResource.shorelineTexture);
src\ui\views\map\campaign-terrain-webgl.ts:2754:          shorelineDistanceRangeLocation,
src\ui\views\map\campaign-terrain-webgl.ts:2755:          chunkResource.data.shorelineDistanceRange
src\ui\views\map\campaign-terrain-webgl.ts:2758:          shorelineDistanceBoundsLocation,
src\ui\views\map\campaign-terrain-webgl.ts:2812:          cells: getCampaignVegetationCellsForChunks(
src\ui\views\map\campaign-terrain-webgl.ts:2822:          terrainCoordinates: materialSemanticModel.terrainCoordinates,
src\ui\views\map\campaign-terrain-webgl.ts:3357:    const actor = readCampaignActorData(input.canvas);
src\ui\views\map\campaign-terrain-webgl.ts:3514:        gl.deleteTexture(chunkResource.shorelineTexture);
src\ui\views\map\campaign-terrain-webgl.ts:3800:  const point = terrainUvToHexPoint(u, v, coordinateSystem);
src\ui\views\map\campaign-terrain-webgl.ts:3816:  const actor = readCampaignActorData(canvas);
src\ui\views\map\campaign-terrain-webgl.ts:3952:  const shoreline = createShorelineDistanceTextureModel(
src\ui\views\map\campaign-terrain-webgl.ts:3973:    shorelineSource: shoreline.source,
src\ui\views\map\campaign-terrain-webgl.ts:3974:    shorelineDistanceRange: shoreline.distanceRange,
src\ui\views\map\campaign-terrain-webgl.ts:3975:    shorelineSignature: shoreline.signature,
src\ui\views\map\campaign-terrain-webgl.ts:4060:      minU = Math.min(minU, hexPointToTerrainU(center.x - radiusX, coordinateSystem));
src\ui\views\map\campaign-terrain-webgl.ts:4061:      maxU = Math.max(maxU, hexPointToTerrainU(center.x + radiusX, coordinateSystem));
src\ui\views\map\campaign-terrain-webgl.ts:4062:      minV = Math.min(minV, hexPointToTerrainV(center.y - radiusY, coordinateSystem));
src\ui\views\map\campaign-terrain-webgl.ts:4063:      maxV = Math.max(maxV, hexPointToTerrainV(center.y + radiusY, coordinateSystem));
src\ui\views\map\campaign-terrain-webgl.ts:4087:      const point = terrainUvToHexPoint(u, v, materialSemanticModel.terrainCoordinates);
src\ui\views\map\campaign-terrain-webgl.ts:4142:      const point = terrainUvToHexPoint(u, v, materialSemanticModel.terrainCoordinates);
src\ui\views\map\campaign-terrain-webgl.ts:4194:      const point = terrainUvToHexPoint(u, v, materialSemanticModel.terrainCoordinates);
src\ui\views\map\campaign-terrain-webgl.ts:4346:      const point = terrainUvToHexPoint(u, v, materialSemanticModel.terrainCoordinates);
src\ui\views\map\campaign-terrain-webgl.ts:4395:      const point = terrainUvToHexPoint(u, v, materialSemanticModel.terrainCoordinates);
src\ui\views\map\campaign-terrain-webgl.ts:4431:      const point = terrainUvToHexPoint(u, v, materialSemanticModel.terrainCoordinates);
src\ui\views\map\campaign-terrain-webgl.ts:4446:        const samplePoint = terrainUvToHexPoint(
src\ui\views\map\campaign-terrain-webgl.ts:4449:          materialSemanticModel.terrainCoordinates
src\ui\views\map\campaign-terrain-webgl.ts:4504:        const point = terrainUvToHexPoint(
src\ui\views\map\campaign-terrain-webgl.ts:4507:          materialSemanticModel.terrainCoordinates
src\ui\views\map\campaign-terrain-webgl.ts:4610:      const point = terrainUvToHexPoint(u, v, materialSemanticModel.terrainCoordinates);
src\ui\views\map\campaign-terrain-webgl.ts:4640:      const point = terrainUvToHexPoint(
src\ui\views\map\campaign-terrain-webgl.ts:4643:        materialSemanticModel.terrainCoordinates
src\ui\views\map\campaign-terrain-webgl.ts:4708:      const point = terrainUvToHexPoint(
src\ui\views\map\campaign-terrain-webgl.ts:4711:        materialSemanticModel.terrainCoordinates
src\ui\views\map\campaign-terrain-webgl.ts:4727:        const samplePoint = terrainUvToHexPoint(
src\ui\views\map\campaign-terrain-webgl.ts:4730:          materialSemanticModel.terrainCoordinates
src\ui\views\map\campaign-terrain-webgl.ts:5233:  shorelinePixels: Uint8ClampedArray;
src\ui\views\map\campaign-terrain-webgl.ts:5234:  shorelineColumns: number;
src\ui\views\map\campaign-terrain-webgl.ts:5235:  shorelineRows: number;
src\ui\views\map\campaign-terrain-webgl.ts:5236:  shorelineDistanceRange: number;
src\ui\views\map\campaign-terrain-webgl.ts:5237:  shorelineSignature: string;
src\ui\views\map\campaign-terrain-webgl.ts:5255:    shorelinePixels: new Uint8ClampedArray(data.shorelineSource.data),
src\ui\views\map\campaign-terrain-webgl.ts:5256:    shorelineColumns: data.shorelineSource.width,
src\ui\views\map\campaign-terrain-webgl.ts:5257:    shorelineRows: data.shorelineSource.height,
src\ui\views\map\campaign-terrain-webgl.ts:5258:    shorelineDistanceRange: data.shorelineDistanceRange,
src\ui\views\map\campaign-terrain-webgl.ts:5259:    shorelineSignature: data.shorelineSignature,
src\ui\views\map\campaign-terrain-webgl.ts:5280:    shorelineSource: new ImageData(
src\ui\views\map\campaign-terrain-webgl.ts:5281:      new Uint8ClampedArray(data.shorelinePixels),
src\ui\views\map\campaign-terrain-webgl.ts:5282:      data.shorelineColumns,
src\ui\views\map\campaign-terrain-webgl.ts:5283:      data.shorelineRows
src\ui\views\map\campaign-terrain-webgl.ts:5285:    shorelineDistanceRange: data.shorelineDistanceRange,
src\ui\views\map\campaign-terrain-webgl.ts:5286:    shorelineSignature: data.shorelineSignature,
src\ui\views\map\campaign-terrain-webgl.ts:5579:  const actor = readCampaignActorData(canvas);
src\ui\views\map\campaign-terrain-webgl.ts:5735:    const center = createTerrainWorldPoint(instance.u, instance.v, terrainHeight, worldScale);
src\ui\views\map\campaign-terrain-webgl.ts:6242:      u: hexPointToTerrainU(center.x, materialSemanticModel.terrainCoordinates),
src\ui\views\map\campaign-terrain-webgl.ts:6243:      v: hexPointToTerrainV(center.y, materialSemanticModel.terrainCoordinates),
src\ui\views\map\campaign-terrain-webgl.ts:6330:      u: hexPointToTerrainU(center.x, input.materialSemanticModel.terrainCoordinates),
src\ui\views\map\campaign-terrain-webgl.ts:6331:      v: hexPointToTerrainV(center.y, input.materialSemanticModel.terrainCoordinates),
src\ui\views\map\campaign-terrain-webgl.ts:6477:    createTerrainWorldPoint(fort.u, fort.v, height, worldScale)
src\ui\views\map\campaign-terrain-webgl.ts:6512:  terrainCoordinates: CampaignTerrainCoordinateSystem;
src\ui\views\map\campaign-terrain-webgl.ts:6550:          terrainCoordinates: input.terrainCoordinates,
src\ui\views\map\campaign-terrain-webgl.ts:6559:          terrainCoordinates: input.terrainCoordinates,
src\ui\views\map\campaign-terrain-webgl.ts:6578:  terrainCoordinates: CampaignTerrainCoordinateSystem;
src\ui\views\map\campaign-terrain-webgl.ts:6617:    terrainCoordinates: input.terrainCoordinates,
src\ui\views\map\campaign-terrain-webgl.ts:6633:  terrainCoordinates: CampaignTerrainCoordinateSystem;
src\ui\views\map\campaign-terrain-webgl.ts:6665:        terrainCoordinates: input.terrainCoordinates,
src\ui\views\map\campaign-terrain-webgl.ts:6695:  terrainCoordinates: CampaignTerrainCoordinateSystem;
src\ui\views\map\campaign-terrain-webgl.ts:6735:    u: hexPointToTerrainU(point.x, input.terrainCoordinates),
src\ui\views\map\campaign-terrain-webgl.ts:6736:    v: hexPointToTerrainV(point.y, input.terrainCoordinates),
src\ui\views\map\campaign-terrain-webgl.ts:6984:        const center = createTerrainWorldPoint(
src\ui\views\map\campaign-terrain-webgl.ts:7117:    const center = createTerrainWorldPoint(instance.u, instance.v, height, input.worldScale);
src\ui\views\map\campaign-terrain-webgl.ts:7242:  terrainCoordinates: CampaignTerrainCoordinateSystem
src\ui\views\map\campaign-terrain-webgl.ts:7244:  const point = terrainUvToHexPoint(u, v, terrainCoordinates);
src\ui\views\map\campaign-terrain-webgl.ts:7249:    u: hexPointToTerrainU(center.x, terrainCoordinates),
src\ui\views\map\campaign-terrain-webgl.ts:7250:    v: hexPointToTerrainV(center.y, terrainCoordinates),
src\ui\views\map\campaign-terrain-webgl.ts:7349:  const terrainCoordinates = createCampaignTerrainCoordinateSystem(coordinateSystem);
src\ui\views\map\campaign-terrain-webgl.ts:7360:    terrainCoordinates,
src\ui\views\map\campaign-terrain-webgl.ts:7361:    worldScale: terrainCoordinates.worldScale,
src\ui\views\map\campaign-terrain-webgl.ts:7436:  const terrainCoordinates = createCampaignTerrainCoordinateSystem(
src\ui\views\map\campaign-terrain-webgl.ts:7443:    terrainCoordinates,
src\ui\views\map\campaign-terrain-webgl.ts:7444:    worldScale: terrainCoordinates.worldScale,
src\ui\views\map\campaign-terrain-webgl.ts:7461:function getCampaignVegetationCells(
src\ui\views\map\campaign-terrain-webgl.ts:7473:        u: hexPointToTerrainU(center.x, campaignHexGrid.coordinateSystem),
src\ui\views\map\campaign-terrain-webgl.ts:7474:        v: hexPointToTerrainV(center.y, campaignHexGrid.coordinateSystem),
src\ui\views\map\campaign-terrain-webgl.ts:7479:function getCampaignVegetationCellsForChunks(
src\ui\views\map\campaign-terrain-webgl.ts:7551:  terrainCoordinates: CampaignTerrainCoordinateSystem;
src\ui\views\map\campaign-terrain-webgl.ts:7589:        input.terrainCoordinates
src\ui\views\map\campaign-terrain-webgl.ts:7619:      input.terrainCoordinates,
src\ui\views\map\campaign-terrain-webgl.ts:7659:    createTerrainWorldPoint(cell.u, cell.v, height, worldScale)
src\ui\views\map\campaign-terrain-webgl.ts:7851:  terrainCoordinates: CampaignTerrainCoordinateSystem
src\ui\views\map\campaign-terrain-webgl.ts:7865:    terrainCoordinates
src\ui\views\map\campaign-terrain-webgl.ts:7876:  terrainCoordinates: CampaignTerrainCoordinateSystem,
src\ui\views\map\campaign-terrain-webgl.ts:7908:    if (isCampaignVegetationPointAvoided(point, avoidancePoints, terrainCoordinates)) {
src\ui\views\map\campaign-terrain-webgl.ts:7912:    const u = hexPointToTerrainU(point.x, terrainCoordinates);
src\ui\views\map\campaign-terrain-webgl.ts:7913:    const v = hexPointToTerrainV(point.y, terrainCoordinates);
src\ui\views\map\campaign-terrain-webgl.ts:7965:  terrainCoordinates: CampaignTerrainCoordinateSystem
src\ui\views\map\campaign-terrain-webgl.ts:7968:    const point = terrainUvToHexPoint(
src\ui\views\map\campaign-terrain-webgl.ts:7971:      terrainCoordinates
src\ui\views\map\campaign-terrain-webgl.ts:7984:  terrainCoordinates: CampaignTerrainCoordinateSystem
src\ui\views\map\campaign-terrain-webgl.ts:7987:    const avoidPoint = terrainUvToHexPoint(
src\ui\views\map\campaign-terrain-webgl.ts:7990:      terrainCoordinates
src\ui\views\map\campaign-terrain-webgl.ts:8066:    const center = createTerrainWorldPoint(instance.u, instance.v, height, terrainWorldScale);
src\ui\views\map\campaign-terrain-webgl.ts:8381:    const center = createTerrainWorldPoint(instance.u, instance.v, height, input.worldScale);
src\ui\views\map\campaign-terrain-webgl.ts:8430:  const center = createTerrainWorldPoint(
src\ui\views\map\campaign-terrain-webgl.ts:8603:    const worldPoint = createTerrainWorldPoint(
src\ui\views\map\campaign-terrain-webgl.ts:8694:function createShorelineDistanceTextureModel(
src\ui\views\map\campaign-terrain-webgl.ts:8721:      tuning.shorelineEdgeWidth * 2.65 + tuning.shorelineWaveStrength * 1.45,
src\ui\views\map\campaign-terrain-webgl.ts:8722:      tuning.shorelineErosionStrength * 3.20 + 0.82
src\ui\views\map\campaign-terrain-webgl.ts:8734:      terrainCoordinates: materialSemanticModel.terrainCoordinates,
src\ui\views\map\campaign-terrain-webgl.ts:8753:      const point = terrainUvToHexPoint(
src\ui\views\map\campaign-terrain-webgl.ts:8756:        materialSemanticModel.terrainCoordinates
src\ui\views\map\campaign-terrain-webgl.ts:8810:  const cachedEdges = shorelineChainEdgesBySemanticModel.get(materialSemanticModel);
src\ui\views\map\campaign-terrain-webgl.ts:8816:  shorelineChainEdgesBySemanticModel.set(materialSemanticModel, edges);
src\ui\views\map\campaign-terrain-webgl.ts:8896:  terrainCoordinates: CampaignTerrainCoordinateSystem;
src\ui\views\map\campaign-terrain-webgl.ts:8908:  const minEdgeU = hexPointToTerrainU(minX, input.terrainCoordinates);
src\ui\views\map\campaign-terrain-webgl.ts:8909:  const maxEdgeU = hexPointToTerrainU(maxX, input.terrainCoordinates);
src\ui\views\map\campaign-terrain-webgl.ts:8910:  const minEdgeV = hexPointToTerrainV(minY, input.terrainCoordinates);
src\ui\views\map\campaign-terrain-webgl.ts:8911:  const maxEdgeV = hexPointToTerrainV(maxY, input.terrainCoordinates);
src\ui\views\map\campaign-terrain-webgl.ts:8958:      const point = terrainUvToHexPoint(u, v, input.terrainCoordinates);
src\ui\views\map\campaign-terrain-webgl.ts:8986:        endpointDistance * (1.18 - input.tuning.shorelineCornerRoundness * 0.42),
src\ui\views\map\campaign-terrain-webgl.ts:9030:  const broadCycles = Math.max(2, Math.round(safeLength * tuning.shorelineWaveFrequency * 0.115));
src\ui\views\map\campaign-terrain-webgl.ts:9033:    Math.round(safeLength * tuning.shorelineWaveFrequency * 0.260)
src\ui\views\map\campaign-terrain-webgl.ts:9039:    shorelineFbm2d(periodicX * 2.1 + seed * 7.1, periodicY * 2.1 - seed * 4.3) - 0.5;
src\ui\views\map\campaign-terrain-webgl.ts:9045:    shorelineFbm2d(
src\ui\views\map\campaign-terrain-webgl.ts:9046:      chainMileage * tuning.shorelineErosionFrequency * 0.28 + seed * 17.0,
src\ui\views\map\campaign-terrain-webgl.ts:9049:  const broadInset = broad * tuning.shorelineWaveStrength * 0.62;
src\ui\views\map\campaign-terrain-webgl.ts:9050:  const mediumInset = medium * tuning.shorelineWaveStrength * 0.18;
src\ui\views\map\campaign-terrain-webgl.ts:9051:  const fineInset = erosion * tuning.shorelineErosionStrength * 0.52;
src\ui\views\map\campaign-terrain-webgl.ts:9056:function shorelineFbm2d(x: number, y: number): number {
src\ui\views\map\campaign-terrain-webgl.ts:9076:    tuning.shorelineEdgeWidth.toFixed(4),
src\ui\views\map\campaign-terrain-webgl.ts:9077:    tuning.shorelineWaveStrength.toFixed(4),
src\ui\views\map\campaign-terrain-webgl.ts:9078:    tuning.shorelineWaveFrequency.toFixed(4),
src\ui\views\map\campaign-terrain-webgl.ts:9079:    tuning.shorelineErosionStrength.toFixed(4),
src\ui\views\map\campaign-terrain-webgl.ts:9080:    tuning.shorelineErosionFrequency.toFixed(4),
src\ui\views\map\campaign-terrain-webgl.ts:9081:    tuning.shorelineCornerRoundness.toFixed(4),
src\ui\views\map\campaign-terrain-webgl.ts:9319:function readCampaignActorData(canvas: HTMLCanvasElement): CampaignActorData | null {
src\ui\views\map\campaign-terrain-webgl.ts:9415:  const center = createTerrainWorldPoint(
src\ui\views\map\campaign-terrain-webgl.ts:10378:  const point = terrainUvToHexPoint(
src\ui\views\map\campaign-terrain-webgl.ts:10381:    materialSemanticModel.terrainCoordinates
src\ui\views\map\campaign-terrain-webgl.ts:10600:function terrainUvToHexPoint(
src\ui\views\map\campaign-terrain-webgl.ts:10606:  const terrainCoordinates = normalizeCampaignTerrainCoordinates(coordinates);
src\ui\views\map\campaign-terrain-webgl.ts:10607:  const bounds = terrainCoordinates.hexPointBounds;
src\ui\views\map\campaign-terrain-webgl.ts:10615:function hexPointToTerrainU(
src\ui\views\map\campaign-terrain-webgl.ts:10620:  const terrainCoordinates = normalizeCampaignTerrainCoordinates(coordinates);
src\ui\views\map\campaign-terrain-webgl.ts:10621:  const bounds = terrainCoordinates.hexPointBounds;
src\ui\views\map\campaign-terrain-webgl.ts:10629:function hexPointToTerrainV(
src\ui\views\map\campaign-terrain-webgl.ts:10634:  const terrainCoordinates = normalizeCampaignTerrainCoordinates(coordinates);
src\ui\views\map\campaign-terrain-webgl.ts:10635:  const bounds = terrainCoordinates.hexPointBounds;
src\ui\views\map\campaign-terrain-webgl.ts:10647:function isHexPassableAtUv(
src\ui\views\map\campaign-terrain-webgl.ts:10652:  const point = terrainUvToHexPoint(
src\ui\views\map\campaign-terrain-webgl.ts:10655:    materialSemanticModel.terrainCoordinates
src\ui\views\map\campaign-terrain-webgl.ts:10679:      hexPointToTerrainU(center.x),
src\ui\views\map\campaign-terrain-webgl.ts:10680:      hexPointToTerrainV(center.y)
src\ui\views\map\campaign-terrain-webgl.ts:10830:function createTerrainWorldPoint(
src\ui\views\map\campaign-terrain-webgl.ts:10952:  const screenPoint = projectPoint(matrix, createTerrainWorldPoint(u, v, height, worldScale));
