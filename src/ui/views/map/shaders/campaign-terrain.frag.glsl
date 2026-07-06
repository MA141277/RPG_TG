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
  float mapAspect
) {
  vec2 neighborCell = cell + neighborOffset;
  float neighborWater = getWaterAmountAt(getHexCellUv(neighborCell, hexScale, mapAspect));
  float landNeighbor = 1.0 - neighborWater;
  float centerDistance = length(point - hexToPixel(cell));
  float neighborDistance = length(point - hexToPixel(neighborCell));
  float boundaryDistance = abs(neighborDistance - centerDistance);

  return landNeighbor * (1.0 - smoothstep(0.04, 0.46, boundaryDistance));
}

float getShoreAmount(vec2 point, vec2 cell, float hexScale, float mapAspect, float water) {
  float shore = 0.0;

  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(1.0, 0.0), hexScale, mapAspect));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-1.0, 0.0), hexScale, mapAspect));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(0.0, 1.0), hexScale, mapAspect));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(0.0, -1.0), hexScale, mapAspect));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(1.0, -1.0), hexScale, mapAspect));
  shore = max(shore, getShoreEdgeContribution(point, cell, vec2(-1.0, 1.0), hexScale, mapAspect));

  return clamp(shore * water, 0.0, 1.0);
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

vec3 getAnimatedWaterColor(
  vec2 uv,
  vec3 fallbackColor,
  float shade,
  float shore
) {
  vec2 driftA = vec2(uTimeSeconds * 0.045, uTimeSeconds * 0.018);
  vec2 driftB = vec2(-uTimeSeconds * 0.032, uTimeSeconds * 0.040);
  vec3 noiseA = texture2D(uWaterTexture, uv * vec2(58.0, 50.0) + driftA).rgb;
  vec3 noiseB = texture2D(uWaterTexture, uv * vec2(132.0, 116.0) + driftB).rgb;
  float ripple = (noiseA.r + noiseB.g) * 0.5;
  float wave = ripple * 2.0 - 1.0;
  float vein = smoothstep(0.42, 0.72, noiseA.b * 0.56 + noiseB.r * 0.44);
  float fineRipple = smoothstep(0.30, 0.68, abs(noiseA.g - noiseB.b) * 1.85);
  float shoreLight = shore * smoothstep(0.36, 0.76, ripple);
  vec3 deepWater = vec3(0.06, 0.23, 0.48);
  vec3 shallowWater = vec3(0.20, 0.62, 0.47);
  vec3 animatedColor = mix(deepWater, shallowWater, shore);

  animatedColor += vec3(wave) * 0.20;
  animatedColor += vec3(0.070, 0.120, 0.090) * vein;
  animatedColor += vec3(0.085, 0.135, 0.105) * fineRipple;
  animatedColor += vec3(0.16, 0.28, 0.18) * shoreLight;

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
  float shore = getShoreAmount(hexPoint, hexCell, hexScale, mapAspect, water);
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
  vec3 waterColor = getAnimatedWaterColor(vUv, terrainColor * shade, shade, shore);
  vec3 color = mix(landColor, waterColor, water);

  float border = getHexGridLine(hexPoint, hexCell);
  color = mix(color, vec3(0.0), border * 0.34);

  gl_FragColor = vec4(color, 1.0);
}
