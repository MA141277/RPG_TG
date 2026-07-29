# Task 2 Re-Review Package

Git is unavailable. Re-review current file contents against Task 2 brief and prior reviewer findings.

## Prior Findings

1. Active loaded-grid chunk-height/smoothing/floor paths still used default terrainUvToHexPoint/isLandTerrainSample conversions.
2. Test was too weak and source-text only.

## Search Evidence After Fix
src\ui\views\map\campaign-terrain-webgl.ts:3788:  const point = terrainUvToHexPoint(u, v, coordinateSystem);
src\ui\views\map\campaign-terrain-webgl.ts:4075:      const point = terrainUvToHexPoint(u, v, materialSemanticModel.terrainCoordinates);
src\ui\views\map\campaign-terrain-webgl.ts:4086:  const flattenedHeights = createNonMountainFlattenedHeightSamples(
src\ui\views\map\campaign-terrain-webgl.ts:4130:      const point = terrainUvToHexPoint(u, v, materialSemanticModel.terrainCoordinates);
src\ui\views\map\campaign-terrain-webgl.ts:4159:  return smoothMountainContinuityHeightPass(
src\ui\views\map\campaign-terrain-webgl.ts:4182:      const point = terrainUvToHexPoint(u, v, materialSemanticModel.terrainCoordinates);
src\ui\views\map\campaign-terrain-webgl.ts:4194:    heightSamples = smoothCampaignHexReferenceHeightPass(
src\ui\views\map\campaign-terrain-webgl.ts:4205:function smoothCampaignHexReferenceHeightPass(
src\ui\views\map\campaign-terrain-webgl.ts:4219:      if (!isLandTerrainSample(materialSemanticModel, u, v)) {
src\ui\views\map\campaign-terrain-webgl.ts:4233:        if (!isLandTerrainSample(materialSemanticModel, sampleU, sampleV)) {
src\ui\views\map\campaign-terrain-webgl.ts:4254:function smoothMountainContinuityHeightPass(
src\ui\views\map\campaign-terrain-webgl.ts:4271:      if (!isLandTerrainSample(materialSemanticModel, u, v)) {
src\ui\views\map\campaign-terrain-webgl.ts:4283:        if (!isLandTerrainSample(materialSemanticModel, sampleU, sampleV)) {
src\ui\views\map\campaign-terrain-webgl.ts:4314:function createNonMountainFlattenedHeightSamples(
src\ui\views\map\campaign-terrain-webgl.ts:4334:      const point = terrainUvToHexPoint(u, v, materialSemanticModel.terrainCoordinates);
src\ui\views\map\campaign-terrain-webgl.ts:4383:      const point = terrainUvToHexPoint(u, v, materialSemanticModel.terrainCoordinates);
src\ui\views\map\campaign-terrain-webgl.ts:4419:      const point = terrainUvToHexPoint(u, v, materialSemanticModel.terrainCoordinates);
src\ui\views\map\campaign-terrain-webgl.ts:4434:        const samplePoint = terrainUvToHexPoint(
src\ui\views\map\campaign-terrain-webgl.ts:4437:          materialSemanticModel.terrainCoordinates
src\ui\views\map\campaign-terrain-webgl.ts:4492:        const point = terrainUvToHexPoint(
src\ui\views\map\campaign-terrain-webgl.ts:4495:          materialSemanticModel.terrainCoordinates
src\ui\views\map\campaign-terrain-webgl.ts:4598:      const point = terrainUvToHexPoint(u, v, materialSemanticModel.terrainCoordinates);
src\ui\views\map\campaign-terrain-webgl.ts:4628:      const point = terrainUvToHexPoint(
src\ui\views\map\campaign-terrain-webgl.ts:4631:        materialSemanticModel.terrainCoordinates
src\ui\views\map\campaign-terrain-webgl.ts:4636:      if (!isLandTerrainSample(materialSemanticModel, u, v)) {
src\ui\views\map\campaign-terrain-webgl.ts:4696:      const point = terrainUvToHexPoint(
src\ui\views\map\campaign-terrain-webgl.ts:4699:        materialSemanticModel.terrainCoordinates
src\ui\views\map\campaign-terrain-webgl.ts:4715:        const samplePoint = terrainUvToHexPoint(
src\ui\views\map\campaign-terrain-webgl.ts:4718:          materialSemanticModel.terrainCoordinates
src\ui\views\map\campaign-terrain-webgl.ts:4806:        if (!isLandTerrainSample(materialSemanticModel, u, v)) {
src\ui\views\map\campaign-terrain-webgl.ts:4819:          if (!isLandTerrainSample(materialSemanticModel, sampleU, sampleV)) {
src\ui\views\map\campaign-terrain-webgl.ts:6230:      u: hexPointToTerrainU(center.x, materialSemanticModel.terrainCoordinates),
src\ui\views\map\campaign-terrain-webgl.ts:6231:      v: hexPointToTerrainV(center.y, materialSemanticModel.terrainCoordinates),
src\ui\views\map\campaign-terrain-webgl.ts:6318:      u: hexPointToTerrainU(center.x, input.materialSemanticModel.terrainCoordinates),
src\ui\views\map\campaign-terrain-webgl.ts:6319:      v: hexPointToTerrainV(center.y, input.materialSemanticModel.terrainCoordinates),
src\ui\views\map\campaign-terrain-webgl.ts:7220:  const point = terrainUvToHexPoint(u, v);
src\ui\views\map\campaign-terrain-webgl.ts:7937:    const point = terrainUvToHexPoint(avoidancePoint.u, avoidancePoint.v);
src\ui\views\map\campaign-terrain-webgl.ts:7951:    const avoidPoint = terrainUvToHexPoint(avoidancePoint.u, avoidancePoint.v);
src\ui\views\map\campaign-terrain-webgl.ts:8712:      const point = terrainUvToHexPoint(u, v);
src\ui\views\map\campaign-terrain-webgl.ts:8912:      const point = terrainUvToHexPoint(u, v);
src\ui\views\map\campaign-terrain-webgl.ts:10327:function isLandTerrainSample(
src\ui\views\map\campaign-terrain-webgl.ts:10332:  const point = terrainUvToHexPoint(
src\ui\views\map\campaign-terrain-webgl.ts:10335:    materialSemanticModel.terrainCoordinates
src\ui\views\map\campaign-terrain-webgl.ts:10554:function terrainUvToHexPoint(
src\ui\views\map\campaign-terrain-webgl.ts:10606:  const point = terrainUvToHexPoint(u, v);
tests\robustness.test.cjs:3748:  assert.match(rendererSource, /createNonMountainFlattenedHeightSamples/);
tests\robustness.test.cjs:3780:  assert.match(rendererSource, /smoothMountainContinuityHeightPass/);
tests\robustness.test.cjs:3810:  assert.match(rendererSource, /createNonMountainFlattenedHeightSamples/);
tests\robustness.test.cjs:4506:test("campaign terrain renderer uses loaded hex point bounds instead of terrain scale compensation", () => {
tests\robustness.test.cjs:4573:        `Expected ${functionName} to use materialSemanticModel.terrainCoordinates or a local alias`
tests\robustness.test.cjs:4596:  assertTerrainCoordinateCalls("isLandTerrainSample");
