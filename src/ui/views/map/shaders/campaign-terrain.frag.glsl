precision mediump float;
uniform sampler2D uTexture;
uniform sampler2D uMaterialTexture;
uniform sampler2D uWaterTexture;
uniform float uWaterTextureEnabled;
uniform float uTimeSeconds;
uniform vec3 uLandTextureColorAdjust;
uniform vec2 uLandTextureShadeRange;
varying vec2 vUv;
varying float vHeight;
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

float getWaterAmount(vec3 terrainType) {
  return
    step(0.22, terrainType.r) *
    (1.0 - step(0.12, terrainType.g)) *
    (1.0 - step(0.12, terrainType.b));
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

float getWaterAmountAtUv(vec2 uv) {
  vec3 terrainType = texture2D(
    uMaterialTexture,
    clamp(uv, 0.0, 1.0)
  ).rgb;

  return getWaterAmount(terrainType);
}

float getMapUvInsideAmount(vec2 uv) {
  return step(0.0, uv.x) *
    step(uv.x, 1.0) *
    step(0.0, uv.y) *
    step(uv.y, 1.0);
}

float getLandAmountAtUv(vec2 uv) {
  return (1.0 - getWaterAmountAtUv(uv)) * getMapUvInsideAmount(uv);
}

float getLandAmountAtCell(vec2 cell, float hexScale, float mapAspect) {
  return getLandAmountAtUv(getHexCellUv(cell, hexScale, mapAspect));
}

float getLandFacingShoreFade(
  vec2 point,
  vec2 cell,
  vec2 neighborOffset,
  float width,
  float edgeShift
) {
  vec2 center = hexToPixel(cell);
  vec2 neighborCenter = hexToPixel(cell + neighborOffset);
  float centerDistance = length(point - center);
  float neighborDistance = length(point - neighborCenter);
  float edgeDistance = clamp(neighborDistance - centerDistance + edgeShift, 0.0, width);

  return 1.0 - smoothstep(0.0, width, edgeDistance);
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
  return getLandAmountAtUv(uv + vec2(
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

float getNearShoreTint(
  vec2 point,
  vec2 cell,
  float hexScale,
  float mapAspect,
  float water,
  float edgeShift
) {
  float shoreTint = 0.0;

  shoreTint = max(
    shoreTint,
    getLandFacingShoreFade(point, cell, vec2(1.0, 0.0), 0.74, edgeShift) *
      getLandAmountAtCell(cell + vec2(1.0, 0.0), hexScale, mapAspect)
  );
  shoreTint = max(
    shoreTint,
    getLandFacingShoreFade(point, cell, vec2(-1.0, 0.0), 0.74, edgeShift) *
      getLandAmountAtCell(cell + vec2(-1.0, 0.0), hexScale, mapAspect)
  );
  shoreTint = max(
    shoreTint,
    getLandFacingShoreFade(point, cell, vec2(0.0, 1.0), 0.74, edgeShift) *
      getLandAmountAtCell(cell + vec2(0.0, 1.0), hexScale, mapAspect)
  );
  shoreTint = max(
    shoreTint,
    getLandFacingShoreFade(point, cell, vec2(0.0, -1.0), 0.74, edgeShift) *
      getLandAmountAtCell(cell + vec2(0.0, -1.0), hexScale, mapAspect)
  );
  shoreTint = max(
    shoreTint,
    getLandFacingShoreFade(point, cell, vec2(1.0, -1.0), 0.74, edgeShift) *
      getLandAmountAtCell(cell + vec2(1.0, -1.0), hexScale, mapAspect)
  );
  shoreTint = max(
    shoreTint,
    getLandFacingShoreFade(point, cell, vec2(-1.0, 1.0), 0.74, edgeShift) *
      getLandAmountAtCell(cell + vec2(-1.0, 1.0), hexScale, mapAspect)
  );

  return clamp(shoreTint * water, 0.0, 1.0);
}

float getNearSeaEdgeBand(
  vec2 uv,
  float hexScale,
  float mapAspect,
  float water,
  float edgeShift
) {
  float roughOuterRadius = max(4.30, 6.10 + edgeShift);
  float innerLand = sampleSoftLandDisk(uv, 3.20, hexScale, mapAspect);
  float outerLand = sampleSoftLandDisk(uv, roughOuterRadius, hexScale, mapAspect);
  float nearSea = max(
    smoothstep(0.050, 0.135, innerLand),
    smoothstep(0.055, 0.170, outerLand)
  );

  return clamp(nearSea * water, 0.0, 1.0);
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
  float lineWidth = 0.026;

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

vec3 getHexTerrainColor(vec3 terrainType) {
  float water = getWaterAmount(terrainType);
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
  const float hexScale = __HEX_TERRAIN_SCALE__;
  const float mapAspect = __HEX_MAP_ASPECT__;
  vec2 hexPoint = vec2((vUv.x - 0.5) * mapAspect, vUv.y - 0.5) * hexScale;
  vec2 hexCell = pixelToRoundedHex(hexPoint);
  vec2 hexUv = getHexCellUv(hexCell, hexScale, mapAspect);
  vec2 atlasUv = getHexAtlasUv(hexPoint, hexCell);
  vec4 base = texture2D(uTexture, atlasUv);
  vec3 material = texture2D(uMaterialTexture, clamp(hexUv, 0.0, 1.0)).rgb;
  vec3 terrainColor = getHexTerrainColor(material);
  float water = getWaterAmount(material);
  float nearShoreNoise = sampleNearShoreEdgeNoise(vUv);
  float nearShoreEdgeShift = nearShoreNoise * 0.12;
  float nearShoreTint = getNearShoreTint(
    hexPoint,
    hexCell,
    hexScale,
    mapAspect,
    water,
    nearShoreEdgeShift
  );
  vec2 nearSeaBoundaryFlow = vec2(uTimeSeconds * 0.026, -uTimeSeconds * 0.010);
  float nearSeaBoundaryNoise = sampleNearSeaBoundaryNoise(vUv, nearSeaBoundaryFlow);
  float nearSeaBoundaryEdgeShift = (nearSeaBoundaryNoise - 0.5) * 2.10;
  float nearSeaEdgeBand = getNearSeaEdgeBand(
    vUv,
    hexScale,
    mapAspect,
    water,
    nearSeaBoundaryEdgeShift
  );
  float shade = clamp(__GRASS_AMBIENT_LIGHT__ + vHeight * 0.16, 0.50, 1.08);
  float materialLuma = dot(material, vec3(0.2126, 0.7152, 0.0722));
  vec3 landTexture = boostLandTextureColor(base.rgb);
  float landTextureLuma = dot(landTexture, vec3(0.2126, 0.7152, 0.0722));
  landTexture = clamp(
    mix(vec3(landTextureLuma), landTexture, __GRASS_TEXTURE_DETAIL__),
    0.0,
    1.0
  );
  float landShade = mix(uLandTextureShadeRange.x, uLandTextureShadeRange.y, shade);
  vec3 landColor = landTexture * landShade * mix(0.96, 1.08, materialLuma);
  vec3 waterColor = getAnimatedWaterColor(
    vUv,
    terrainColor * shade,
    shade,
    nearShoreTint,
    nearSeaEdgeBand
  );
  vec3 color = mix(landColor, waterColor, water);

  float border = getHexGridLine(hexPoint, hexCell);
  color = mix(color, vec3(0.0), border * mix(0.34, 0.025, water));

  gl_FragColor = vec4(color, 1.0);
}
