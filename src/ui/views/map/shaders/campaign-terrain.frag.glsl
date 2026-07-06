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

float getWaterAmountAt(vec2 uv) {
  vec3 terrainType = texture2D(uMaterialTexture, clamp(uv, 0.0, 1.0)).rgb;

  return getWaterAmount(terrainType);
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

float getHexBoundaryDistance(vec2 point, vec2 cell) {
  vec2 localPoint = point - hexToPixel(cell);
  vec2 axial = vec2(
    0.5773503 * localPoint.x - 0.3333333 * localPoint.y,
    0.6666667 * localPoint.y
  );
  vec3 cube = vec3(axial.x, axial.y, -axial.x - axial.y);
  float hexDistance = max(max(abs(cube.x), abs(cube.y)), abs(cube.z));

  return max(0.0, (hexDistance - 0.5) * 1.5);
}

vec2 getHexCellUv(vec2 cell, float hexScale, float mapAspect) {
  vec2 center = hexToPixel(cell);

  return vec2(
    center.x / (hexScale * mapAspect) + 0.5,
    center.y / hexScale + 0.5
  );
}

float getLandAmountAtCell(vec2 cell, float hexScale, float mapAspect) {
  return 1.0 - getWaterAmountAt(getHexCellUv(cell, hexScale, mapAspect));
}

float getSharedHexEdgeShoreContribution(
  vec2 point,
  vec2 cell,
  vec2 neighborOffset,
  float hexScale,
  float mapAspect,
  float falloffWidth
) {
  vec2 neighborCell = cell + neighborOffset;
  float landNeighbor = getLandAmountAtCell(neighborCell, hexScale, mapAspect);
  vec2 center = hexToPixel(cell);
  vec2 neighborCenter = hexToPixel(neighborCell);
  vec2 edgeNormal = normalize(neighborCenter - center);
  float distanceToSharedEdge =
    length(neighborCenter - center) * 0.5 - dot(point - center, edgeNormal);

  return landNeighbor * (1.0 - smoothstep(0.0, falloffWidth, distanceToSharedEdge));
}

float getShoreEdgeContribution(
  vec2 point,
  vec2 cell,
  vec2 neighborOffset,
  float hexScale,
  float mapAspect,
  float falloffWidth
) {
  vec2 neighborCell = cell + neighborOffset;
  float landNeighbor = getLandAmountAtCell(neighborCell, hexScale, mapAspect);
  float distanceToLandHex = getHexBoundaryDistance(point, neighborCell);

  return landNeighbor * (1.0 - smoothstep(0.0, falloffWidth, distanceToLandHex));
}

float getShoreRingAmount(
  vec2 point,
  vec2 cell,
  float hexScale,
  float mapAspect,
  float ringRadius,
  float falloffWidth
) {
  float shore = 0.0;

  shore = max(shore, getSharedHexEdgeShoreContribution(point, cell, vec2(0.0, -1.0) * ringRadius, hexScale, mapAspect, falloffWidth));
  shore = max(shore, getSharedHexEdgeShoreContribution(point, cell, vec2(1.0, -1.0) * ringRadius, hexScale, mapAspect, falloffWidth));
  shore = max(shore, getSharedHexEdgeShoreContribution(point, cell, vec2(1.0, 0.0) * ringRadius, hexScale, mapAspect, falloffWidth));
  shore = max(shore, getSharedHexEdgeShoreContribution(point, cell, vec2(0.0, 1.0) * ringRadius, hexScale, mapAspect, falloffWidth));
  shore = max(shore, getSharedHexEdgeShoreContribution(point, cell, vec2(-1.0, 1.0) * ringRadius, hexScale, mapAspect, falloffWidth));
  shore = max(shore, getSharedHexEdgeShoreContribution(point, cell, vec2(-1.0, 0.0) * ringRadius, hexScale, mapAspect, falloffWidth));

  return shore;
}

float getShoreRing2Amount(vec2 point, vec2 cell, float hexScale, float mapAspect, float falloffWidth) {
  float shore = 0.0;

  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-2.0, 2.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-2.0, 1.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-2.0, 0.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-1.0, -1.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(0.0, -2.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(1.0, -2.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(2.0, -2.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(2.0, -1.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(2.0, 0.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(1.0, 1.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(0.0, 2.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-1.0, 2.0), hexScale, mapAspect, falloffWidth));

  return shore;
}

float getShoreRing3Amount(vec2 point, vec2 cell, float hexScale, float mapAspect, float falloffWidth) {
  float shore = 0.0;

  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-3.0, 3.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-3.0, 2.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-3.0, 1.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-3.0, 0.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-2.0, -1.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-1.0, -2.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(0.0, -3.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(1.0, -3.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(2.0, -3.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(3.0, -3.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(3.0, -2.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(3.0, -1.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(3.0, 0.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(2.0, 1.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(1.0, 2.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(0.0, 3.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-1.0, 3.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-2.0, 3.0), hexScale, mapAspect, falloffWidth));

  return shore;
}

float getShoreNearAmount(vec2 point, vec2 cell, float hexScale, float mapAspect) {
  return getShoreRingAmount(point, cell, hexScale, mapAspect, 1.0, 1.06);
}

float getShoreShallowAmount(vec2 point, vec2 cell, float hexScale, float mapAspect) {
  float shore = getShoreRingAmount(point, cell, hexScale, mapAspect, 1.0, 1.90);

  shore = max(shore, getShoreRing2Amount(point, cell, hexScale, mapAspect, 1.45));

  return shore;
}

float getShoreMiddleAmount(vec2 point, vec2 cell, float hexScale, float mapAspect) {
  float shore = getShoreRing2Amount(point, cell, hexScale, mapAspect, 2.20);

  shore = max(shore, getShoreRing3Amount(point, cell, hexScale, mapAspect, 1.85));

  return shore;
}

vec3 getShoreBands(vec2 point, vec2 cell, float hexScale, float mapAspect, float water) {
  float nearShore = getShoreNearAmount(point, cell, hexScale, mapAspect);
  float shallowSea = max(getShoreShallowAmount(point, cell, hexScale, mapAspect) - nearShore * 0.36, 0.0);
  float middleSea = max(getShoreMiddleAmount(point, cell, hexScale, mapAspect) - shallowSea * 0.18 - nearShore * 0.22, 0.0);

  return clamp(vec3(nearShore, shallowSea, middleSea) * water, 0.0, 1.0);
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

float sampleNoiseWaterRipple(
  vec2 uv,
  vec2 direction,
  float longScale,
  float narrowScale,
  float speed
) {
  vec2 tangent = normalize(direction);
  vec2 normal = vec2(-tangent.y, tangent.x);
  vec2 anisotropicUv = vec2(
    dot(uv, tangent) * longScale + uTimeSeconds * speed,
    dot(uv, normal) * narrowScale - uTimeSeconds * speed * 0.43
  );
  vec3 longNoise = texture2D(uWaterTexture, anisotropicUv).rgb;
  vec3 shiftedNoise = texture2D(
    uWaterTexture,
    anisotropicUv * 1.73 + vec2(0.137, 0.061)
  ).rgb;
  vec3 broadNoise = texture2D(
    uWaterTexture,
    anisotropicUv * vec2(0.42, 0.18) + vec2(0.41, 0.23)
  ).rgb;
  float streak =
    longNoise.r * 0.46 +
    longNoise.g * 0.22 +
    shiftedNoise.b * 0.22 +
    broadNoise.g * 0.10;
  float crest = smoothstep(0.58, 0.82, streak);
  float trough = 1.0 - smoothstep(0.24, 0.48, streak);

  return crest * 1.28 - trough * 0.24;
}

vec3 getAnimatedWaterColor(
  vec2 uv,
  vec3 fallbackColor,
  float shade,
  vec3 shoreBands
) {
  float nearShore = shoreBands.x;
  float shallowSea = shoreBands.y;
  float middleSea = shoreBands.z;
  vec3 broadNoise = texture2D(uWaterTexture, uv * 3.6 + vec2(uTimeSeconds * 0.010, -uTimeSeconds * 0.007)).rgb;
  vec3 boundaryNoise = texture2D(uWaterTexture, uv * 8.5 + vec2(-uTimeSeconds * 0.006, uTimeSeconds * 0.004)).rgb;
  vec3 fineBoundaryNoise = texture2D(uWaterTexture, uv * 15.0 + vec2(uTimeSeconds * 0.004, uTimeSeconds * 0.005)).rgb;
  vec3 surfaceNoise = texture2D(uWaterTexture, uv * 18.0 + vec2(uTimeSeconds * 0.020, -uTimeSeconds * 0.014)).rgb;
  vec3 surfaceNoiseShifted = texture2D(uWaterTexture, uv * 31.0 + vec2(-uTimeSeconds * 0.012, uTimeSeconds * 0.018)).rgb;
  float bandJitter =
    (broadNoise.r - 0.5) * 0.34 +
    (boundaryNoise.g - 0.5) * 0.24 +
    (fineBoundaryNoise.b - 0.5) * 0.16;
  float nearShoreBand = smoothstep(0.16, 0.92, nearShore + bandJitter * 0.92);
  float shallowSeaBand = smoothstep(0.02, 0.74, shallowSea + bandJitter * 0.82) * (1.0 - nearShoreBand * 0.42);
  float middleSeaBand = smoothstep(0.00, 0.72, middleSea + bandJitter * 0.74) * (1.0 - nearShoreBand * 0.56) * (1.0 - shallowSeaBand * 0.24);
  float ripple = sampleNoiseWaterRipple(uv, vec2(1.0, 0.20), 3.4, 24.0, 0.045);
  float fineRipple = sampleNoiseWaterRipple(uv + vec2(0.17, -0.09), vec2(0.92, 0.38), 5.2, 42.0, 0.030) * 0.42;
  float wave = ripple + fineRipple + (broadNoise.b - 0.5) * 0.10;
  float surfaceRipple =
    (surfaceNoise.r - surfaceNoise.g) * 0.18 +
    (surfaceNoiseShifted.b - 0.5) * 0.10;
  float waveCrest = smoothstep(0.12, 0.54, wave);
  float waveTrough = smoothstep(0.12, 0.54, -wave);
  float vein = smoothstep(0.30, 0.76, broadNoise.r * 0.56 + surfaceNoise.g * 0.24 + waveCrest * 0.42);
  float bandLight = nearShoreBand * 0.68 + shallowSeaBand * 0.42 + middleSeaBand * 0.26;
  float shoreLight = bandLight * smoothstep(0.10, 0.50, abs(wave) + boundaryNoise.b * 0.18);
  vec3 deepWater = vec3(0.045, 0.18, 0.42);
  vec3 middleSeaWater = vec3(0.070, 0.31, 0.52);
  vec3 shallowSeaWater = vec3(0.120, 0.46, 0.54);
  vec3 nearShoreWater = vec3(0.240, 0.62, 0.47);
  vec3 animatedColor = deepWater;

  animatedColor = mix(animatedColor, middleSeaWater, middleSeaBand * 0.62);
  animatedColor = mix(animatedColor, shallowSeaWater, shallowSeaBand * 0.82);
  animatedColor = mix(animatedColor, nearShoreWater, nearShoreBand * 0.86);

  animatedColor += vec3(0.16, 0.25, 0.30) * waveCrest;
  animatedColor -= vec3(0.05, 0.08, 0.10) * waveTrough;
  animatedColor += vec3(wave) * 0.10;
  animatedColor += vec3(0.10, 0.16, 0.18) * surfaceRipple;
  animatedColor += vec3(0.060, 0.105, 0.090) * vein;
  animatedColor += vec3(0.16, 0.26, 0.17) * shoreLight;

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
  vec3 shoreBands = getShoreBands(hexPoint, hexCell, hexScale, mapAspect, water);
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
  vec3 waterColor = getAnimatedWaterColor(vUv, terrainColor * shade, shade, shoreBands);
  vec3 color = mix(landColor, waterColor, water);

  float border = getHexGridLine(hexPoint, hexCell);
  color = mix(color, vec3(0.0), border * 0.34);

  gl_FragColor = vec4(color, 1.0);
}
