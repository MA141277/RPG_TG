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

float getShoreEdgeContribution(
  vec2 point,
  vec2 cell,
  vec2 neighborOffset,
  float hexScale,
  float mapAspect,
  float falloffWidth
) {
  vec2 neighborCell = cell + neighborOffset;
  float neighborWater = getWaterAmountAt(getHexCellUv(neighborCell, hexScale, mapAspect));
  float landNeighbor = 1.0 - neighborWater;
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

  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(1.0, 0.0) * ringRadius, hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-1.0, 0.0) * ringRadius, hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(0.0, 1.0) * ringRadius, hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(0.0, -1.0) * ringRadius, hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(1.0, -1.0) * ringRadius, hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-1.0, 1.0) * ringRadius, hexScale, mapAspect, falloffWidth));

  return shore;
}

float getShoreRing2Amount(vec2 point, vec2 cell, float hexScale, float mapAspect, float falloffWidth) {
  float shore = 0.0;

  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(2.0, 0.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(2.0, -1.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(2.0, -2.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(1.0, -2.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(0.0, -2.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-1.0, -1.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-2.0, 0.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-2.0, 1.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-2.0, 2.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-1.0, 2.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(0.0, 2.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(1.0, 1.0), hexScale, mapAspect, falloffWidth));

  return shore;
}

float getShoreRing3Amount(vec2 point, vec2 cell, float hexScale, float mapAspect, float falloffWidth) {
  float shore = 0.0;

  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(3.0, 0.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(3.0, -1.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(3.0, -2.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(3.0, -3.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(2.0, -3.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(1.0, -3.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(0.0, -3.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-1.0, -2.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-2.0, -1.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-3.0, 0.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-3.0, 1.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-3.0, 2.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-3.0, 3.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-2.0, 3.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-1.0, 3.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(0.0, 3.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(1.0, 2.0), hexScale, mapAspect, falloffWidth));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(2.0, 1.0), hexScale, mapAspect, falloffWidth));

  return shore;
}

float getShoreNearAmount(vec2 point, vec2 cell, float hexScale, float mapAspect) {
  return getShoreRingAmount(point, cell, hexScale, mapAspect, 1.0, 0.72);
}

float getShoreShallowAmount(vec2 point, vec2 cell, float hexScale, float mapAspect) {
  float shore = getShoreRingAmount(point, cell, hexScale, mapAspect, 1.0, 1.55);

  shore = max(shore, getShoreRing2Amount(point, cell, hexScale, mapAspect, 1.05));

  return shore;
}

float getShoreMiddleAmount(vec2 point, vec2 cell, float hexScale, float mapAspect) {
  float shore = getShoreRing2Amount(point, cell, hexScale, mapAspect, 1.95);

  shore = max(shore, getShoreRing3Amount(point, cell, hexScale, mapAspect, 1.45));

  return shore;
}

vec3 getShoreBands(vec2 point, vec2 cell, float hexScale, float mapAspect, float water) {
  float nearShore = getShoreNearAmount(point, cell, hexScale, mapAspect);
  float shallowSea = max(getShoreShallowAmount(point, cell, hexScale, mapAspect) - nearShore * 0.72, 0.0);
  float middleSea = max(getShoreMiddleAmount(point, cell, hexScale, mapAspect) - shallowSea * 0.28 - nearShore * 0.42, 0.0);

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

float getDirectionalWaterRipple(
  vec2 uv,
  vec2 direction,
  float longScale,
  float narrowScale,
  float speed
) {
  vec2 tangent = normalize(direction);
  vec2 normal = vec2(-tangent.y, tangent.x);
  float along = dot(uv, tangent);
  float across = dot(uv, normal);
  float bend = sin(along * 9.0 + uTimeSeconds * 0.18) * 0.035;
  vec2 waveUv = vec2(
    along * longScale + uTimeSeconds * speed,
    across * narrowScale + bend + uTimeSeconds * speed * 0.28
  );
  vec3 noiseA = texture2D(uWaterTexture, waveUv).rgb;
  vec3 noiseB = texture2D(uWaterTexture, waveUv + vec2(0.137, 0.061)).rgb;

  return (noiseA.r * 0.55 + noiseA.g * 0.25 + noiseB.b * 0.20) - 0.5;
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
  float nearShoreBand = smoothstep(0.36, 0.86, nearShore);
  float shallowSeaBand = smoothstep(0.14, 0.58, shallowSea) * (1.0 - nearShoreBand * 0.58);
  float middleSeaBand = smoothstep(0.10, 0.48, middleSea) * (1.0 - nearShoreBand * 0.78) * (1.0 - shallowSeaBand * 0.46);
  vec3 broadNoise = texture2D(uWaterTexture, uv * 4.0 + vec2(uTimeSeconds * 0.013, -uTimeSeconds * 0.008)).rgb;
  float ripple = getDirectionalWaterRipple(uv, vec2(1.0, 0.24), 10.0, 42.0, 0.030);
  float fineRipple = getDirectionalWaterRipple(uv + vec2(0.17, -0.09), vec2(0.96, 0.30), 18.0, 70.0, 0.020) * 0.42;
  float wave = ripple + fineRipple + (broadNoise.b - 0.5) * 0.10;
  float vein = smoothstep(0.42, 0.78, broadNoise.r * 0.65 + abs(wave) * 0.55);
  float bandLight = nearShoreBand * 0.66 + shallowSeaBand * 0.40 + middleSeaBand * 0.24;
  float shoreLight = bandLight * smoothstep(0.03, 0.32, abs(wave));
  vec3 deepWater = vec3(0.045, 0.18, 0.42);
  vec3 middleSeaWater = vec3(0.070, 0.31, 0.52);
  vec3 shallowSeaWater = vec3(0.120, 0.46, 0.54);
  vec3 nearShoreWater = vec3(0.240, 0.62, 0.47);
  vec3 animatedColor = deepWater;

  animatedColor = mix(animatedColor, middleSeaWater, middleSeaBand * 0.68);
  animatedColor = mix(animatedColor, shallowSeaWater, shallowSeaBand * 0.78);
  animatedColor = mix(animatedColor, nearShoreWater, nearShoreBand * 0.86);

  animatedColor += vec3(wave) * 0.13;
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
