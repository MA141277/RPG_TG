#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uMaterialTexture;
uniform sampler2D uMaterialSemanticTexture;
uniform sampler2D uShorelineDistanceTexture;
uniform sampler2D uWaterTexture;
uniform sampler2D uGrassTexture;
uniform sampler2D uSandTexture;
uniform sampler2D uStructureGroundTexture;
uniform sampler2D uRockTexture;
uniform sampler2D uSnowTexture;
uniform float uWaterTextureEnabled;
uniform float uVillageGroundTextureEnabled;
uniform float uCityGroundTextureEnabled;
uniform float uTimeSeconds;
uniform float uGrassAmbientLight;
uniform float uGrassTextureDetail;
uniform float uHexMapAspect;
uniform float uHexTerrainScale;
uniform float uTerrainGridLandOpacity;
uniform float uTerrainGridWaterOpacity;
uniform float uTerrainDirectionalLightStrength;
uniform float uTerrainBackShadowStrength;
uniform float uTerrainSteepShadowStrength;
uniform float uTerrainWaterShadowStrength;
uniform vec2 uTerrainViewportSize;
uniform float uTerrainCameraLightHeight;
uniform float uTerrainCameraLightHorizontalPull;
uniform vec3 uLandTextureColorAdjust;
uniform vec2 uLandTextureShadeRange;
uniform float uLandTextureTiling;
uniform float uSnowHeightStart;
uniform float uSnowHeightFull;
uniform float uBeachTextureTiling;
uniform float uBeachBlendStrength;
uniform float uBeachInnerRadius;
uniform float uBeachOuterRadius;
uniform float uBeachFineNoiseTiling;
uniform float uBeachFineNoiseStrength;
uniform float uShorelineVisualWaterStrength;
uniform float uShorelineEdgeWidth;
uniform float uShorelineCornerRoundness;
uniform vec2 uMaterialSemanticTextureSize;
uniform vec4 uMaterialSemanticBounds;
uniform float uShorelineDistanceRange;
uniform vec4 uShorelineDistanceBounds;
varying vec2 vUv;
varying float vHeight;
varying vec3 vNormal;
varying vec3 vCameraNormal;
varying vec2 vTerrainPosition;

float colorDistance(vec3 left, vec3 right) {
  return distance(left, right);
}

float materialWeight(vec3 material, vec3 target, float radius) {
  return 1.0 - smoothstep(0.0, radius, colorDistance(material, target));
}

float hash(vec2 point) {
  return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453);
}

vec2 hexToPixel(vec2 hex) {
  return vec2(
    1.7320508 * (hex.x + hex.y * 0.5),
    1.5 * hex.y
  );
}

vec3 cubeRound(vec3 cube) {
  vec3 rounded = floor(cube + 0.5);
  vec3 difference = abs(rounded - cube);

  if (difference.x > difference.y && difference.x > difference.z) {
    rounded.x = -rounded.y - rounded.z;
  } else if (difference.y > difference.z) {
    rounded.y = -rounded.x - rounded.z;
  } else {
    rounded.z = -rounded.x - rounded.y;
  }

  return rounded;
}

vec2 pixelToRoundedHex(vec2 point) {
  vec2 axial = vec2(
    0.5773503 * point.x - 0.3333333 * point.y,
    0.6666667 * point.y
  );
  vec3 cube = vec3(axial.x, axial.y, -axial.x - axial.y);
  vec3 roundedCube = cubeRound(cube);

  return roundedCube.xy;
}

vec2 getHexCellUv(vec2 cell, float hexScale, float mapAspect) {
  vec2 center = hexToPixel(cell);

  return vec2(
    center.x / (hexScale * mapAspect) + 0.5,
    center.y / hexScale + 0.5
  );
}

float getMapUvInsideAmount(vec2 uv) {
  return step(0.0, uv.x) *
    step(uv.x, 1.0) *
    step(0.0, uv.y) *
    step(uv.y, 1.0);
}

float getRawMaterialWaterAmount(vec3 terrainType) {
  return
    step(0.22, terrainType.r) *
    (1.0 - step(0.12, terrainType.g)) *
    (1.0 - step(0.12, terrainType.b));
}

float getRawMaterialWaterAmountAtUv(vec2 uv) {
  vec3 terrainType = texture2D(
    uMaterialTexture,
    clamp(uv, 0.0, 1.0)
  ).rgb;

  return getRawMaterialWaterAmount(terrainType);
}

float getRawMaterialLandAmountAtUv(vec2 uv) {
  return (1.0 - getRawMaterialWaterAmountAtUv(uv)) * getMapUvInsideAmount(uv);
}

float getMaterialSemanticInsideAmount(vec2 cell) {
  vec2 cellIndex = cell - uMaterialSemanticBounds.xy;

  return step(0.0, cellIndex.x) *
    step(0.0, cellIndex.y) *
    step(cellIndex.x, uMaterialSemanticBounds.z - 1.0) *
    step(cellIndex.y, uMaterialSemanticBounds.w - 1.0);
}

float getMaterialSemanticLandAtCell(vec2 cell) {
  vec2 cellIndex = cell - uMaterialSemanticBounds.xy;
  vec2 semanticUv = (cellIndex + vec2(0.5)) /
    max(uMaterialSemanticTextureSize, vec2(1.0));
  float semanticInside = getMaterialSemanticInsideAmount(cell);
  float semanticLand = texture2D(
    uMaterialSemanticTexture,
    clamp(semanticUv, 0.0, 1.0)
  ).r;

  return step(0.5, semanticLand) * semanticInside;
}

float getMaterialSemanticMountainAtCell(vec2 cell) {
  vec2 cellIndex = cell - uMaterialSemanticBounds.xy;
  vec2 semanticUv = (cellIndex + vec2(0.5)) /
    max(uMaterialSemanticTextureSize, vec2(1.0));
  float semanticInside = getMaterialSemanticInsideAmount(cell);
  float semanticMountain = texture2D(
    uMaterialSemanticTexture,
    clamp(semanticUv, 0.0, 1.0)
  ).g;

  return step(0.5, semanticMountain) *
    getMaterialSemanticLandAtCell(cell) *
    semanticInside;
}

float getMaterialSemanticStructureGroundAtCell(vec2 cell) {
  vec2 cellIndex = cell - uMaterialSemanticBounds.xy;
  vec2 semanticUv = (cellIndex + vec2(0.5)) /
    max(uMaterialSemanticTextureSize, vec2(1.0));
  float semanticInside = getMaterialSemanticInsideAmount(cell);
  float semanticStructure = texture2D(
    uMaterialSemanticTexture,
    clamp(semanticUv, 0.0, 1.0)
  ).b;

  return semanticStructure *
    getMaterialSemanticLandAtCell(cell) *
    semanticInside;
}

float getSemanticLandAmountAtCell(vec2 cell, float hexScale, float mapAspect) {
  return getMaterialSemanticLandAtCell(cell) *
    getMapUvInsideAmount(getHexCellUv(cell, hexScale, mapAspect));
}

float getSemanticWaterAmountAtCell(vec2 cell, float hexScale, float mapAspect) {
  float semanticInside = getMaterialSemanticInsideAmount(cell);
  float semanticLand = getMaterialSemanticLandAtCell(cell);
  float semanticWater = mix(1.0, 1.0 - semanticLand, semanticInside);
  float mapInside = getMapUvInsideAmount(getHexCellUv(cell, hexScale, mapAspect));

  return mix(1.0, semanticWater, mapInside);
}

float getSemanticWaterAmountAtUv(vec2 uv) {
  vec2 point = vec2(
    (uv.x - 0.5) * uHexMapAspect,
    uv.y - 0.5
  ) * uHexTerrainScale;
  vec2 cell = pixelToRoundedHex(point);

  return getSemanticWaterAmountAtCell(cell, uHexTerrainScale, uHexMapAspect);
}

float getSemanticLandAmountAtUv(vec2 uv) {
  vec2 point = vec2(
    (uv.x - 0.5) * uHexMapAspect,
    uv.y - 0.5
  ) * uHexTerrainScale;
  vec2 cell = pixelToRoundedHex(point);

  return getSemanticLandAmountAtCell(cell, uHexTerrainScale, uHexMapAspect);
}

vec2 getTerrainUvOffset(
  vec2 direction,
  float hexRadius,
  float hexScale,
  float mapAspect
) {
  vec2 unitDirection = normalize(direction);

  return vec2(
    unitDirection.x * hexRadius / (hexScale * mapAspect),
    unitDirection.y * hexRadius / hexScale
  );
}

float sampleLandAtDiskOffset(
  vec2 uv,
  vec2 diskOffset,
  float radius,
  float hexScale,
  float mapAspect
) {
  return getRawMaterialLandAmountAtUv(uv + vec2(
    diskOffset.x * radius / (hexScale * mapAspect),
    diskOffset.y * radius / hexScale
  ));
}

float sampleSoftLandDisk(
  vec2 uv,
  float radius,
  float hexScale,
  float mapAspect
) {
  float land = 0.0;
  float weight = 0.0;

  land += sampleLandAtDiskOffset(uv, vec2(0.00, 0.00), radius, hexScale, mapAspect) * 0.36;
  weight += 0.36;
  land += sampleLandAtDiskOffset(uv, vec2(0.33, 0.12), radius, hexScale, mapAspect) * 0.58;
  weight += 0.58;
  land += sampleLandAtDiskOffset(uv, vec2(-0.28, 0.24), radius, hexScale, mapAspect) * 0.58;
  weight += 0.58;
  land += sampleLandAtDiskOffset(uv, vec2(0.10, -0.37), radius, hexScale, mapAspect) * 0.58;
  weight += 0.58;
  land += sampleLandAtDiskOffset(uv, vec2(-0.42, -0.12), radius, hexScale, mapAspect) * 0.52;
  weight += 0.52;
  land += sampleLandAtDiskOffset(uv, vec2(0.47, -0.31), radius, hexScale, mapAspect) * 0.52;
  weight += 0.52;
  land += sampleLandAtDiskOffset(uv, vec2(-0.08, 0.55), radius, hexScale, mapAspect) * 0.52;
  weight += 0.52;
  land += sampleLandAtDiskOffset(uv, vec2(-0.57, 0.35), radius, hexScale, mapAspect) * 0.46;
  weight += 0.46;
  land += sampleLandAtDiskOffset(uv, vec2(0.64, 0.29), radius, hexScale, mapAspect) * 0.46;
  weight += 0.46;
  land += sampleLandAtDiskOffset(uv, vec2(0.22, -0.70), radius, hexScale, mapAspect) * 0.46;
  weight += 0.46;
  land += sampleLandAtDiskOffset(uv, vec2(-0.72, -0.44), radius, hexScale, mapAspect) * 0.40;
  weight += 0.40;
  land += sampleLandAtDiskOffset(uv, vec2(0.78, -0.55), radius, hexScale, mapAspect) * 0.40;
  weight += 0.40;
  land += sampleLandAtDiskOffset(uv, vec2(-0.18, 0.86), radius, hexScale, mapAspect) * 0.40;
  weight += 0.40;
  land += sampleLandAtDiskOffset(uv, vec2(0.91, 0.03), radius, hexScale, mapAspect) * 0.34;
  weight += 0.34;
  land += sampleLandAtDiskOffset(uv, vec2(-0.92, 0.08), radius, hexScale, mapAspect) * 0.34;
  weight += 0.34;
  land += sampleLandAtDiskOffset(uv, vec2(0.04, 0.94), radius, hexScale, mapAspect) * 0.34;
  weight += 0.34;
  land += sampleLandAtDiskOffset(uv, vec2(-0.05, -0.93), radius, hexScale, mapAspect) * 0.34;
  weight += 0.34;

  return land / weight;
}

float getNearSeaEdgeBand(
  vec2 uv,
  float hexScale,
  float mapAspect,
  float waterCoverage,
  float edgeShift
) {
  float roughOuterRadius = max(4.30, 6.10 + edgeShift);
  float innerLand = sampleSoftLandDisk(uv, 3.20, hexScale, mapAspect);
  float outerLand = sampleSoftLandDisk(uv, roughOuterRadius, hexScale, mapAspect);
  float nearSea = max(
    smoothstep(0.050, 0.135, innerLand),
    smoothstep(0.055, 0.170, outerLand)
  );

  return clamp(nearSea * waterCoverage, 0.0, 1.0);
}

float valueNoise(vec2 point) {
  vec2 cell = floor(point);
  vec2 local = fract(point);
  vec2 curve = local * local * (3.0 - 2.0 * local);
  float bottomLeft = hash(cell);
  float bottomRight = hash(cell + vec2(1.0, 0.0));
  float topLeft = hash(cell + vec2(0.0, 1.0));
  float topRight = hash(cell + vec2(1.0, 1.0));

  return mix(
    mix(bottomLeft, bottomRight, curve.x),
    mix(topLeft, topRight, curve.x),
    curve.y
  );
}

float sampleBeachErosionNoise(vec2 uv) {
  float broad = valueNoise(uv * (uBeachFineNoiseTiling * 0.42) + vec2(13.7, 5.1));
  float medium = valueNoise(uv * uBeachFineNoiseTiling + vec2(-4.3, 19.9));
  float fine = valueNoise(uv * (uBeachFineNoiseTiling * 2.15) + vec2(31.2, -7.6));

  return broad * 0.52 + medium * 0.33 + fine * 0.15;
}

float decodeShorelineDistance(vec2 encodedBytes) {
  vec2 bytes = floor(encodedBytes * 255.0 + vec2(0.5));
  float normalized = (bytes.x * 256.0 + bytes.y) / 65535.0;

  return (normalized * 2.0 - 1.0) * uShorelineDistanceRange;
}

vec2 getMapInteriorAndShorelineValid(vec2 uv, float valid) {
  float mapInterior =
    smoothstep(0.0, 0.018, uv.x) *
    smoothstep(0.0, 0.018, uv.y) *
    smoothstep(0.0, 0.018, 1.0 - uv.x) *
    smoothstep(0.0, 0.018, 1.0 - uv.y);
  float shorelineValid = smoothstep(0.20, 0.85, valid);

  return vec2(
    mapInterior,
    mapInterior * shorelineValid * step(0.001, uShorelineVisualWaterStrength)
  );
}

vec2 sampleShorelineDistanceField(vec2 uv) {
  vec2 shorelineUv = (uv - uShorelineDistanceBounds.xy) /
    max(uShorelineDistanceBounds.zw, vec2(0.0001));
  vec4 sampleValue = texture2D(
    uShorelineDistanceTexture,
    clamp(shorelineUv, vec2(0.0), vec2(1.0))
  );

  return vec2(decodeShorelineDistance(sampleValue.rg), sampleValue.a);
}

float getShorelineBoundaryWater(vec2 uv, float water, vec2 shoreline) {
  vec2 validity = getMapInteriorAndShorelineValid(uv, shoreline.y);
  float boundaryFeather = mix(0.060, 0.145, uShorelineCornerRoundness);
  float boundaryReach = max(uShorelineEdgeWidth * 1.35, boundaryFeather * 2.4);
  float boundaryInfluence =
    (1.0 - smoothstep(boundaryReach * 0.70, boundaryReach, abs(shoreline.x))) *
    validity.y;
  float boundaryWater = smoothstep(-boundaryFeather, boundaryFeather, shoreline.x);

  return mix(water, boundaryWater, boundaryInfluence);
}

float getShorelineNearShoreTint(vec2 uv, vec2 shoreline, float boundaryWater) {
  vec2 validity = getMapInteriorAndShorelineValid(uv, shoreline.y);
  float waterSide = smoothstep(-0.035, 0.080, shoreline.x);
  float tintReach = max(uShorelineEdgeWidth * 1.65, 0.38);
  float nearShoreTint =
    waterSide *
    boundaryWater *
    (1.0 - smoothstep(0.055, tintReach, max(shoreline.x, 0.0)));

  return clamp(
    nearShoreTint * validity.y,
    0.0,
    1.0
  );
}

vec3 getVisualLandCellData(
  vec2 cell,
  float water
) {
  return vec3(cell, 1.0 - water);
}

float sampleBeachGrain(vec2 point, vec2 cell) {
  float seed = hash(cell * 2.37 + vec2(8.1, -3.4)) * 59.0;
  float coarse = valueNoise(point * 22.0 + seed);
  float fineA = valueNoise(point * 78.0 + vec2(seed, -seed * 0.37));
  float fineB = valueNoise(point * 132.0 + vec2(-seed * 0.19, seed * 0.43));
  float pinGrain = smoothstep(0.54, 0.82, fineA) * 0.46 +
    smoothstep(0.50, 0.88, fineB) * 0.28;

  return clamp(coarse * 0.46 + pinGrain + fineB * 0.12, 0.0, 1.0);
}

float sampleBeachDust(vec2 point, vec2 cell) {
  float seed = hash(cell * 4.11 + vec2(-6.7, 12.3)) * 83.0;
  float scatter = valueNoise(point * 44.0 + vec2(seed, -seed * 0.27));
  float fineA = valueNoise(point * 118.0 + vec2(-seed * 0.41, seed * 0.13));
  float fineB = valueNoise(point * 181.0 + vec2(seed * 0.19, seed * 0.57));
  float grains =
    smoothstep(0.58, 0.82, scatter) * 0.42 +
    smoothstep(0.61, 0.88, fineA) * 0.38 +
    smoothstep(0.68, 0.94, fineB) * 0.30;

  return clamp(grains + fineA * 0.08, 0.0, 1.0);
}

vec2 getLandBeachAmounts(
  vec2 uv,
  float water,
  vec2 shoreline
) {
  float land = 1.0 - water;
  vec2 validity = getMapInteriorAndShorelineValid(uv, shoreline.y);
  float landSide = 1.0 - smoothstep(-0.030, 0.085, shoreline.x);
  float beachDepth = max(-shoreline.x, 0.0);
  float erosionNoise = sampleBeachErosionNoise(uv * 1.13 + vec2(0.19, -0.27));
  float innerWidth = max(uBeachInnerRadius * mix(0.82, 1.12, erosionNoise), 0.05);
  float outerWidth = max(uBeachOuterRadius * mix(0.86, 1.16, erosionNoise), innerWidth + 0.05);
  float coreBeach = (1.0 - smoothstep(innerWidth * 0.10, innerWidth * 0.78, beachDepth));
  float connectorBeach = (1.0 - smoothstep(innerWidth * 0.22, outerWidth, beachDepth));
  float raggedFeather = mix(0.86, 1.0, shoreline.y) *
    (0.88 + (erosionNoise - 0.5) * uBeachFineNoiseStrength * 0.62);

  return clamp(
    vec2(coreBeach, connectorBeach * raggedFeather) *
      land *
      landSide *
      validity.y,
    0.0,
    1.0
  );
}

float getHexGridLine(vec2 point, vec2 cell) {
  vec2 center = hexToPixel(cell);
  float centerDistance = length(point - center);
  float neighborDistance = 1000.0;

  neighborDistance = min(neighborDistance, length(point - hexToPixel(cell + vec2(1.0, 0.0))));
  neighborDistance = min(neighborDistance, length(point - hexToPixel(cell + vec2(-1.0, 0.0))));
  neighborDistance = min(neighborDistance, length(point - hexToPixel(cell + vec2(0.0, 1.0))));
  neighborDistance = min(neighborDistance, length(point - hexToPixel(cell + vec2(0.0, -1.0))));
  neighborDistance = min(neighborDistance, length(point - hexToPixel(cell + vec2(1.0, -1.0))));
  neighborDistance = min(neighborDistance, length(point - hexToPixel(cell + vec2(-1.0, 1.0))));

  float boundaryDistance = abs(neighborDistance - centerDistance);
  float lineWidth = 0.1;

  return 1.0 - smoothstep(0.0, lineWidth, boundaryDistance);
}

vec2 getHexAtlasUv(vec2 point, vec2 cell) {
  const float tileCount = 4.0;
  vec2 localPoint = point - hexToPixel(cell);
  vec2 localUv = clamp(
    vec2(localPoint.x / 1.7320508 + 0.5, localPoint.y / 2.0 + 0.5),
    0.0,
    1.0
  );
  float tileIndex = floor(hash(cell) * 16.0);
  vec2 tile = vec2(mod(tileIndex, tileCount), floor(tileIndex / tileCount));

  return (tile + localUv) / tileCount;
}

vec3 getHexTerrainColor(vec3 terrainType, float water) {
  float plain =
    step(0.22, terrainType.g) *
    step(terrainType.r, 0.45) *
    (1.0 - water);
  float coast =
    step(0.36, terrainType.b) *
    step(0.30, terrainType.g) *
    (1.0 - water);
  float mountain =
    max(
      materialWeight(terrainType, vec3(0.38, 0.25, 0.25), 0.22),
      materialWeight(terrainType, vec3(0.50, 0.50, 0.25), 0.24)
    ) * (1.0 - water) * (1.0 - plain);

  vec3 color = vec3(0.39, 0.52, 0.27);
  color = mix(color, vec3(0.18, 0.55, 0.26), plain);
  color = mix(color, vec3(0.44, 0.38, 0.25), mountain);
  color = mix(color, vec3(0.24, 0.64, 0.52), coast * (1.0 - plain));
  color = mix(color, vec3(0.10, 0.35, 0.72), water);

  return color;
}

vec3 boostLandTextureColor(vec3 color) {
  float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
  vec3 saturated = mix(vec3(luma), color, uLandTextureColorAdjust.x);

  return clamp(
    saturated * uLandTextureColorAdjust.y + vec3(uLandTextureColorAdjust.z),
    0.0,
    1.0
  );
}

vec3 applyCampaignHistoricTone(vec3 color) {
  float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
  vec3 restoredColor = mix(vec3(luma), color, 1.06);
  vec3 warmArchiveTint = vec3(0.94, 0.90, 0.82);
  vec3 toned = mix(restoredColor, restoredColor * warmArchiveTint, 0.28);
  float highlightGuard = smoothstep(0.66, 0.96, luma);

  return clamp(mix(toned * 0.99, toned * 0.88, highlightGuard), 0.0, 1.0);
}

vec3 sampleGrassMaterial(vec2 uv) {
  return texture2D(uGrassTexture, fract(uv * uLandTextureTiling)).rgb;
}

vec3 sampleSandMaterial(vec2 uv) {
  return texture2D(
    uSandTexture,
    fract(uv * uBeachTextureTiling + vec2(0.17, -0.09))
  ).rgb;
}

vec3 sampleStructureGroundMaterial(vec2 point, vec2 cell, float cityAmount) {
  vec2 localPoint = point - hexToPixel(cell);
  vec2 tileUv = clamp(
    vec2(localPoint.x / 1.7320508 + 0.5, localPoint.y / 2.0 + 0.5),
    0.0,
    1.0
  );
  float atlasX = mix(tileUv.x * 0.5, 0.5 + tileUv.x * 0.5, cityAmount);

  return texture2D(uStructureGroundTexture, vec2(atlasX, tileUv.y)).rgb;
}

vec3 sampleRockMaterial(vec2 uv) {
  vec2 coarseUv = uv * (uLandTextureTiling * 0.82) + vec2(0.07, -0.04);
  vec2 detailUv = uv * (uLandTextureTiling * 1.93) + vec2(-0.21, 0.18);
  vec3 coarse = texture2D(uRockTexture, fract(coarseUv)).rgb;
  vec3 detail = texture2D(uRockTexture, fract(detailUv)).rgb;
  vec3 rock = mix(coarse, detail, 0.28);
  float luma = dot(rock, vec3(0.2126, 0.7152, 0.0722));
  vec3 saturated = mix(vec3(luma), rock, 0.86);

  return clamp(saturated * 0.82 + vec3(0.045, 0.044, 0.040), 0.0, 1.0);
}

vec3 sampleSnowMaterial(vec2 uv) {
  vec2 coarseUv = uv * (uLandTextureTiling * 0.74) + vec2(-0.09, 0.13);
  vec2 detailUv = uv * (uLandTextureTiling * 1.68) + vec2(0.19, -0.17);
  vec3 coarse = texture2D(uSnowTexture, fract(coarseUv)).rgb;
  vec3 detail = texture2D(uSnowTexture, fract(detailUv)).rgb;
  vec3 snow = mix(coarse, detail, 0.34);
  float luma = dot(snow, vec3(0.2126, 0.7152, 0.0722));
  vec3 coldGrain = mix(vec3(0.72, 0.78, 0.82), vec3(1.0, 0.99, 0.94), luma);

  return clamp(mix(coldGrain, snow, 0.36) * 0.94 + vec3(0.030), 0.0, 1.0);
}

float getMountainSnowAmount(
  float mountainAmount,
  vec2 point,
  vec2 cell,
  float height,
  vec3 normal
) {
  float seed = hash(cell * 5.31 + vec2(0.37, -0.19)) * 31.0;
  float broad = valueNoise(point * 2.10 + seed);
  float streak = valueNoise(vec2(point.x * 1.15 + point.y * 0.34, point.y * 4.75) + seed);
  float fine = valueNoise(point * 12.80 - seed * 0.17);
  float snowLineNoise = (broad - 0.5) * 0.040 + (streak - 0.5) * 0.028;
  float altitude = smoothstep(
    uSnowHeightStart,
    uSnowHeightFull,
    height + snowLineNoise
  );
  float upperSurface = smoothstep(0.18, 0.70, normal.z);
  float tornEdge = smoothstep(0.30, 0.78, broad * 0.50 + streak * 0.35 + fine * 0.15);

  return clamp(
    mountainAmount *
      altitude *
      mix(0.42, 1.00, upperSurface) *
      mix(0.74, 1.08, tornEdge),
    0.0,
    1.0
  );
}

float sampleMountainEdgeNoise(
  vec2 point,
  vec2 cell,
  vec2 neighborOffset,
  vec2 edgeCenter,
  vec2 edgeTangent
) {
  float seed = hash(cell * 3.17 + neighborOffset * 11.9) * 41.0;
  vec2 local = point - edgeCenter;
  float along = dot(local, edgeTangent);
  float across = dot(local, vec2(-edgeTangent.y, edgeTangent.x));
  float broad = valueNoise(vec2(along * 1.75 + seed, across * 0.86 - seed));
  float medium = valueNoise(vec2(along * 4.70 - seed * 0.27, across * 1.65 + seed * 0.19));
  float fine = valueNoise(vec2(along * 11.60 + seed * 0.13, across * 3.70 - seed * 0.07));

  return broad * 0.56 + medium * 0.32 + fine * 0.12;
}

float getLocalMountainEdgeInset(
  vec2 point,
  vec2 cell,
  vec2 neighborOffset,
  float currentMountain
) {
  float neighborMountain = getMaterialSemanticMountainAtCell(cell + neighborOffset);
  float exposedEdge = currentMountain * (1.0 - neighborMountain);
  if (exposedEdge < 0.5) {
    return 1.0;
  }

  vec2 center = hexToPixel(cell);
  vec2 neighborCenter = hexToPixel(cell + neighborOffset);
  vec2 edgeNormal = normalize(neighborCenter - center);
  vec2 edgeTangent = vec2(-edgeNormal.y, edgeNormal.x);
  vec2 edgeCenter = (center + neighborCenter) * 0.5;
  float edgeDepth = dot(point - edgeCenter, -edgeNormal);
  float alongEdge = abs(dot(point - edgeCenter, edgeTangent));
  float edgeNoise = sampleMountainEdgeNoise(point, cell, neighborOffset, edgeCenter, edgeTangent);
  float endpointGuard = 1.0 - smoothstep(0.43, 0.64, alongEdge);
  float raggedDepth = edgeDepth +
    (edgeNoise - 0.5) * 0.34 +
    (valueNoise(point * 7.20 + hash(cell + neighborOffset) * 19.0) - 0.5) * 0.10;
  float insetWidth = mix(0.22, 0.46, edgeNoise);
  float inset = smoothstep(0.04, insetWidth, raggedDepth);

  return mix(1.0, inset, endpointGuard * exposedEdge);
}

float getMountainTerrainAmount(
  vec2 point,
  vec2 cell,
  float hexScale,
  float mapAspect,
  float visualLandWater,
  float sandMask
) {
  float currentMountain = getMaterialSemanticMountainAtCell(cell) *
    getMapUvInsideAmount(getHexCellUv(cell, hexScale, mapAspect));
  float edgeInset = 1.0;

  edgeInset = min(edgeInset, getLocalMountainEdgeInset(point, cell, vec2(1.0, 0.0), currentMountain));
  edgeInset = min(edgeInset, getLocalMountainEdgeInset(point, cell, vec2(-1.0, 0.0), currentMountain));
  edgeInset = min(edgeInset, getLocalMountainEdgeInset(point, cell, vec2(0.0, 1.0), currentMountain));
  edgeInset = min(edgeInset, getLocalMountainEdgeInset(point, cell, vec2(0.0, -1.0), currentMountain));
  edgeInset = min(edgeInset, getLocalMountainEdgeInset(point, cell, vec2(1.0, -1.0), currentMountain));
  edgeInset = min(edgeInset, getLocalMountainEdgeInset(point, cell, vec2(-1.0, 1.0), currentMountain));

  return clamp(
    currentMountain *
      edgeInset *
      (1.0 - visualLandWater) *
      (1.0 - sandMask * 0.86),
    0.0,
    1.0
  );
}

float getLocalCityGroundEdgeInset(
  vec2 point,
  vec2 cell,
  vec2 neighborOffset,
  float currentCityGround
) {
  float neighborStructure = getMaterialSemanticStructureGroundAtCell(cell + neighborOffset);
  float neighborCityGround = step(0.75, neighborStructure) * uCityGroundTextureEnabled;
  float exposedEdge = currentCityGround * (1.0 - neighborCityGround);
  if (exposedEdge < 0.5) {
    return 1.0;
  }

  vec2 center = hexToPixel(cell);
  vec2 neighborCenter = hexToPixel(cell + neighborOffset);
  vec2 edgeNormal = normalize(neighborCenter - center);
  vec2 edgeTangent = vec2(-edgeNormal.y, edgeNormal.x);
  vec2 edgeCenter = (center + neighborCenter) * 0.5;
  float edgeDepth = dot(point - edgeCenter, -edgeNormal);
  float alongEdge = abs(dot(point - edgeCenter, edgeTangent));
  float edgeNoise = sampleMountainEdgeNoise(point, cell, neighborOffset, edgeCenter, edgeTangent);
  float endpointGuard = 1.0 - smoothstep(0.44, 0.66, alongEdge);
  float raggedDepth =
    edgeDepth +
    (edgeNoise - 0.5) * 0.24 +
    (valueNoise(point * 6.30 + hash(cell + neighborOffset) * 13.0) - 0.5) * 0.09;
  float insetWidth = mix(0.26, 0.52, edgeNoise);
  float inset = smoothstep(0.03, insetWidth, raggedDepth);

  return mix(1.0, inset, endpointGuard * exposedEdge);
}

float getCityStructureGroundAmount(vec2 point, vec2 cell, float cityGroundAmount) {
  float edgeInset = 1.0;

  edgeInset = min(edgeInset, getLocalCityGroundEdgeInset(point, cell, vec2(1.0, 0.0), cityGroundAmount));
  edgeInset = min(edgeInset, getLocalCityGroundEdgeInset(point, cell, vec2(-1.0, 0.0), cityGroundAmount));
  edgeInset = min(edgeInset, getLocalCityGroundEdgeInset(point, cell, vec2(0.0, 1.0), cityGroundAmount));
  edgeInset = min(edgeInset, getLocalCityGroundEdgeInset(point, cell, vec2(0.0, -1.0), cityGroundAmount));
  edgeInset = min(edgeInset, getLocalCityGroundEdgeInset(point, cell, vec2(1.0, -1.0), cityGroundAmount));
  edgeInset = min(edgeInset, getLocalCityGroundEdgeInset(point, cell, vec2(-1.0, 1.0), cityGroundAmount));

  return clamp(cityGroundAmount * edgeInset, 0.0, 1.0);
}

float sampleLayeredWaterFlowNoise(vec2 uv, vec2 flow) {
  vec3 coarseNoise = texture2D(
    uWaterTexture,
    uv * 6.4 + flow + vec2(0.17, -0.23)
  ).rgb;
  vec3 fineNoise = texture2D(
    uWaterTexture,
    uv * 13.5 + flow * 0.73 + vec2(-0.31, 0.12)
  ).rgb;

  return coarseNoise.r * 0.58 + coarseNoise.g * 0.24 + fineNoise.b * 0.18;
}

float sampleNearShoreEdgeNoise(vec2 uv) {
  vec2 flow = vec2(uTimeSeconds * 0.014, -uTimeSeconds * 0.004);
  vec3 softNoise = texture2D(
    uWaterTexture,
    uv * 7.6 + flow + vec2(0.21, -0.14)
  ).rgb;
  vec3 fineNoise = texture2D(
    uWaterTexture,
    uv * 15.0 + flow * 0.58 + vec2(-0.08, 0.17)
  ).rgb;

  return clamp((softNoise.g * 0.66 + fineNoise.b * 0.34 - 0.5) * 1.35, -0.5, 0.5);
}

float sampleNearSeaBoundaryNoise(vec2 uv, vec2 flow) {
  vec3 coarseNoise = texture2D(
    uWaterTexture,
    uv * 3.1 + flow + vec2(-0.11, 0.29)
  ).rgb;
  vec3 raggedNoise = texture2D(
    uWaterTexture,
    uv * 12.5 + flow * 1.37 + vec2(0.33, -0.16)
  ).rgb;
  vec3 tornFiberNoise = texture2D(
    uWaterTexture,
    uv * 27.0 - flow * 0.82 + vec2(-0.27, 0.08)
  ).rgb;

  float broadTear = coarseNoise.b * 0.58 + coarseNoise.g * 0.24 + raggedNoise.r * 0.18;
  float raggedCuts =
    (step(0.47, raggedNoise.g) - 0.5) * 0.42 +
    (step(0.56, tornFiberNoise.b) - 0.5) * 0.30;
  float raggedEdge = broadTear + raggedCuts + (tornFiberNoise.r - 0.5) * 0.18;

  return clamp((raggedEdge - 0.5) * 1.28 + 0.5, 0.0, 1.0);
}

vec3 getAnimatedWaterColor(
  vec2 uv,
  vec3 fallbackColor,
  float shade,
  float nearShoreTint,
  float nearSeaEdgeBand
) {
  vec2 waterFlow = vec2(uTimeSeconds * 0.030, -uTimeSeconds * 0.011);
  float waterFlowNoise = sampleLayeredWaterFlowNoise(uv, waterFlow);
  float secondaryWaterFlowNoise = sampleLayeredWaterFlowNoise(
    uv + vec2(0.37, -0.21),
    waterFlow * 0.82 + vec2(0.09, 0.04)
  );
  float waterFlowHighlight = smoothstep(0.38, 0.76, waterFlowNoise);
  float waterFlowShadow = 1.0 - smoothstep(0.16, 0.44, waterFlowNoise);
  float waterFlowWave =
    (waterFlowNoise - 0.5) * 0.72 +
    (secondaryWaterFlowNoise - 0.5) * 0.38;
  vec3 animatedColor = vec3(0.055, 0.23, 0.49);
  vec3 nearSeaWater = vec3(0.16, 0.52, 0.72);
  vec3 nearShoreTintWater = vec3(0.24, 0.70, 0.38);
  float nearSeaAwayFromCoast = nearSeaEdgeBand * (1.0 - nearShoreTint * 0.52);

  animatedColor = mix(animatedColor, nearSeaWater, nearSeaAwayFromCoast * 0.78);
  animatedColor = mix(animatedColor, nearShoreTintWater, nearShoreTint * 0.42);

  animatedColor += vec3(0.18, 0.34, 0.31) * waterFlowHighlight * 0.82;
  animatedColor -= vec3(0.050, 0.086, 0.090) * waterFlowShadow * 0.78;
  animatedColor += vec3(waterFlowWave) * 0.16;

  return mix(fallbackColor, clamp(animatedColor * shade, 0.0, 1.0), uWaterTextureEnabled);
}

void main() {
  float hexScale = uHexTerrainScale;
  float mapAspect = uHexMapAspect;
  vec2 hexPoint = vec2((vUv.x - 0.5) * mapAspect, vUv.y - 0.5) * hexScale;
  vec2 hexCell = pixelToRoundedHex(hexPoint);
  if (getMaterialSemanticInsideAmount(hexCell) < 0.5) {
    discard;
  }

  vec2 hexUv = getHexCellUv(hexCell, hexScale, mapAspect);
  vec3 material = texture2D(uMaterialTexture, clamp(hexUv, 0.0, 1.0)).rgb;
  float water = getSemanticWaterAmountAtUv(hexUv);
  vec3 terrainColor = getHexTerrainColor(material, water);
  vec2 shoreline = sampleShorelineDistanceField(vUv);
  float boundaryWater = getShorelineBoundaryWater(vUv, water, shoreline);
  float nearShoreTint = getShorelineNearShoreTint(vUv, shoreline, boundaryWater);
  vec3 visualLandCellData = getVisualLandCellData(hexCell, water);
  vec2 visualLandCell = visualLandCellData.xy;
  vec2 visualLandUv = getHexCellUv(visualLandCell, hexScale, mapAspect);
  vec3 landMaterial = texture2D(uMaterialTexture, clamp(visualLandUv, 0.0, 1.0)).rgb;
  float visualLandWater = getSemanticWaterAmountAtCell(visualLandCell, hexScale, mapAspect);
  vec2 nearSeaBoundaryFlow = vec2(uTimeSeconds * 0.026, -uTimeSeconds * 0.010);
  float nearSeaBoundaryNoise = sampleNearSeaBoundaryNoise(vUv, nearSeaBoundaryFlow);
  float nearSeaBoundaryEdgeShift = (nearSeaBoundaryNoise - 0.5) * 2.10;
  float nearSeaEdgeBand = getNearSeaEdgeBand(
    vUv,
    hexScale,
    mapAspect,
    boundaryWater,
    nearSeaBoundaryEdgeShift
  );
  float baseShade = clamp(uGrassAmbientLight + vHeight * 0.16, 0.50, 1.08);
  vec3 terrainNormal = normalize(vNormal);
  vec3 cameraNormal = normalize(vCameraNormal);
  vec2 safeViewportSize = max(uTerrainViewportSize, vec2(1.0, 1.0));
  vec2 viewportUv = gl_FragCoord.xy / safeViewportSize;
  vec2 centerToFragment =
    (vec2(0.5, 0.5) - viewportUv) *
    vec2(safeViewportSize.x / safeViewportSize.y, 1.0);
  vec3 terrainLight = normalize(vec3(
    centerToFragment * uTerrainCameraLightHorizontalPull,
    uTerrainCameraLightHeight
  ));
  float directionalLight = clamp(dot(cameraNormal, terrainLight), 0.0, 1.0);
  float backShadow = 1.0 - smoothstep(0.18, 0.62, directionalLight);
  float steepShadow = smoothstep(0.08, 0.34, 1.0 - terrainNormal.z);
  float reliefShade =
    1.0 +
    directionalLight * uTerrainDirectionalLightStrength -
    backShadow * uTerrainBackShadowStrength -
    steepShadow * uTerrainSteepShadowStrength;
  float waterReliefShade = 1.0 + (reliefShade - 1.0) * uTerrainWaterShadowStrength;
  float terrainReliefShade = clamp(mix(reliefShade, waterReliefShade, boundaryWater), 0.48, 1.34);
  float materialLuma = dot(landMaterial, vec3(0.2126, 0.7152, 0.0722));
  vec3 grassTexture = boostLandTextureColor(sampleGrassMaterial(vUv));
  float grassTextureLuma = dot(grassTexture, vec3(0.2126, 0.7152, 0.0722));
  grassTexture = clamp(
    mix(vec3(grassTextureLuma), grassTexture, uGrassTextureDetail),
    0.0,
    1.0
  );
  vec3 sandTexture = sampleSandMaterial(vUv);
  float sandTextureLuma = dot(sandTexture, vec3(0.2126, 0.7152, 0.0722));
  sandTexture = clamp(
    mix(vec3(sandTextureLuma), sandTexture, 1.18),
    0.0,
    1.0
  );
  vec3 rockTexture = sampleRockMaterial(vUv);
  vec2 beachAmounts = getLandBeachAmounts(
    vUv,
    visualLandWater,
    shoreline
  ) * uBeachBlendStrength;
  float beachAmount = beachAmounts.x;
  float beachConnectorAmount = beachAmounts.y;
  float beachErosionAmount = max(beachAmount, beachConnectorAmount * 0.88);
  float beachGrain = sampleBeachGrain(hexPoint * 1.12, visualLandCell);
  float beachDust = sampleBeachDust(hexPoint * 1.35, visualLandCell);
  float beachShapeNoise = sampleBeachErosionNoise(vUv * 0.73 + hash(visualLandCell) * 0.031);
  float beachThresholdShift = (beachShapeNoise - 0.5) * 0.11;
  float sandBodyMask = smoothstep(
    0.18 + beachThresholdShift,
    0.52 + beachThresholdShift,
    beachAmount
  );
  float sandCoreMask = smoothstep(
    0.46 + beachThresholdShift * 0.70,
    0.70 + beachThresholdShift * 0.70,
    beachAmount
  );
  float sandMaterialMask = clamp(max(sandCoreMask, sandBodyMask * 0.88), 0.0, 1.0);
  float grassErosionMask =
    smoothstep(0.015, 0.50 + abs(beachThresholdShift) * 0.55, beachErosionAmount) *
    (1.0 - sandCoreMask * 0.92);
  float fineSandTransition =
    grassErosionMask *
    (1.0 - sandMaterialMask * 0.72) *
    smoothstep(0.20, 0.86, beachDust + beachErosionAmount * 0.98);
  float sparseSandDust =
    grassErosionMask *
    (1.0 - sandMaterialMask) *
    smoothstep(0.74 - beachErosionAmount * 0.40, 0.96, beachDust);
  float beachGrainVisibility = smoothstep(0.16, 0.78, sandMaterialMask);
  sandTexture = clamp(
    sandTexture * mix(1.0, mix(0.96, 1.06, beachGrain), beachGrainVisibility * 0.45),
    0.0,
    1.0
  );
  vec3 dryGrassColor = mix(vec3(0.58, 0.60, 0.22), vec3(0.84, 0.72, 0.30), beachShapeNoise);
  vec3 erodedGrassTexture = mix(
    grassTexture,
    dryGrassColor * mix(0.88, 1.10, beachGrain),
    grassErosionMask * 0.36
  );
  vec3 sandyGrassTexture = mix(
    erodedGrassTexture,
    mix(sandTexture, dryGrassColor, 0.24),
    clamp(fineSandTransition * 0.42 + sparseSandDust * 0.62, 0.0, 0.78)
  );
  vec3 landTexture = mix(sandyGrassTexture, sandTexture, sandMaterialMask);
  float structureGround = getMaterialSemanticStructureGroundAtCell(hexCell);
  float cityGroundTextureSelector = step(0.75, structureGround) * uCityGroundTextureEnabled;
  float cityGroundAmount = cityGroundTextureSelector;
  float villageGroundAmount =
    step(0.25, structureGround) *
    (1.0 - step(0.75, structureGround)) *
    uVillageGroundTextureEnabled;
  cityGroundAmount = getCityStructureGroundAmount(
    hexPoint,
    hexCell,
    cityGroundAmount
  );
  float structureGroundAmount = max(villageGroundAmount, cityGroundAmount);
  vec3 structureGroundTexture = sampleStructureGroundMaterial(
    hexPoint,
    hexCell,
    cityGroundTextureSelector
  );
  structureGroundTexture = clamp(
    mix(structureGroundTexture, landTexture, 0.10),
    0.0,
    1.0
  );
  landTexture = mix(landTexture, structureGroundTexture, structureGroundAmount);
  float mountainAmount = getMountainTerrainAmount(
    hexPoint,
    hexCell,
    hexScale,
    mapAspect,
    visualLandWater,
    sandMaterialMask
  );
  float rockReliefNoise = valueNoise(hexPoint * 3.10 + hash(visualLandCell) * 11.0);
  vec3 rockTint = mix(vec3(0.83, 0.87, 0.82), vec3(1.05, 1.02, 0.92), rockReliefNoise);
  vec3 rockLandTexture = clamp(
    mix(rockTexture * rockTint, terrainColor * 0.82, 0.12) *
      mix(0.90, 1.08, beachShapeNoise),
    0.0,
    1.0
  );
  landTexture = mix(landTexture, rockLandTexture, mountainAmount);
  float snowAmount = getMountainSnowAmount(
    mountainAmount,
    hexPoint,
    hexCell,
    vHeight,
    terrainNormal
  );
  vec3 snowTexture = sampleSnowMaterial(vUv);
  vec3 snowLandTexture = clamp(
    mix(snowTexture, rockLandTexture * vec3(0.84, 0.88, 0.90), 0.12) *
      mix(0.94, 1.05, rockReliefNoise),
    0.0,
    1.0
  );
  landTexture = mix(landTexture, snowLandTexture, snowAmount);
  float landShade = mix(uLandTextureShadeRange.x, uLandTextureShadeRange.y, baseShade);
  vec3 landColor = landTexture * landShade * mix(0.96, 1.08, materialLuma);
  vec3 waterColor = getAnimatedWaterColor(
    vUv,
    mix(terrainColor, vec3(0.10, 0.35, 0.72), boundaryWater) * baseShade,
    baseShade,
    nearShoreTint,
    nearSeaEdgeBand
  );
  vec3 color = clamp(mix(landColor, waterColor, boundaryWater) * terrainReliefShade, 0.0, 1.0);
  color = applyCampaignHistoricTone(color);

  float border = getHexGridLine(hexPoint, hexCell);
  color = mix(
    color,
    vec3(0.0),
    border * mix(uTerrainGridLandOpacity, uTerrainGridWaterOpacity, water)
  );

  gl_FragColor = vec4(color, 1.0);
}
