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

float getLandAmountAtUv(vec2 uv) {
  return 1.0 - getWaterAmountAt(uv);
}

vec2 getHexDirectionUv(vec2 axialOffset, float radius, float hexScale, float mapAspect) {
  vec2 direction = hexToPixel(axialOffset) * radius;

  return vec2(
    direction.x / (hexScale * mapAspect),
    direction.y / hexScale
  );
}

float sampleContinuousShoreRing(vec2 uv, float radius, float hexScale, float mapAspect) {
  float openWater = 1.0;

  openWater *= 1.0 - getLandAmountAtUv(uv + getHexDirectionUv(vec2(0.0, -1.0), radius, hexScale, mapAspect)) * 0.34;
  openWater *= 1.0 - getLandAmountAtUv(uv + getHexDirectionUv(vec2(0.5, -1.0), radius, hexScale, mapAspect)) * 0.22;
  openWater *= 1.0 - getLandAmountAtUv(uv + getHexDirectionUv(vec2(1.0, -1.0), radius, hexScale, mapAspect)) * 0.34;
  openWater *= 1.0 - getLandAmountAtUv(uv + getHexDirectionUv(vec2(1.0, -0.5), radius, hexScale, mapAspect)) * 0.22;
  openWater *= 1.0 - getLandAmountAtUv(uv + getHexDirectionUv(vec2(1.0, 0.0), radius, hexScale, mapAspect)) * 0.34;
  openWater *= 1.0 - getLandAmountAtUv(uv + getHexDirectionUv(vec2(0.5, 0.5), radius, hexScale, mapAspect)) * 0.22;
  openWater *= 1.0 - getLandAmountAtUv(uv + getHexDirectionUv(vec2(0.0, 1.0), radius, hexScale, mapAspect)) * 0.34;
  openWater *= 1.0 - getLandAmountAtUv(uv + getHexDirectionUv(vec2(-0.5, 1.0), radius, hexScale, mapAspect)) * 0.22;
  openWater *= 1.0 - getLandAmountAtUv(uv + getHexDirectionUv(vec2(-1.0, 1.0), radius, hexScale, mapAspect)) * 0.34;
  openWater *= 1.0 - getLandAmountAtUv(uv + getHexDirectionUv(vec2(-1.0, 0.5), radius, hexScale, mapAspect)) * 0.22;
  openWater *= 1.0 - getLandAmountAtUv(uv + getHexDirectionUv(vec2(-1.0, 0.0), radius, hexScale, mapAspect)) * 0.34;
  openWater *= 1.0 - getLandAmountAtUv(uv + getHexDirectionUv(vec2(-0.5, -0.5), radius, hexScale, mapAspect)) * 0.22;

  return 1.0 - openWater;
}

vec3 getContinuousShoreBands(vec2 uv, float hexScale, float mapAspect, float water) {
  float nearShore = max(
    sampleContinuousShoreRing(uv, 0.42, hexScale, mapAspect),
    sampleContinuousShoreRing(uv, 0.78, hexScale, mapAspect) * 0.40
  );
  float shallowSea = max(
    sampleContinuousShoreRing(uv, 1.58, hexScale, mapAspect),
    sampleContinuousShoreRing(uv, 2.85, hexScale, mapAspect) * 0.92
  );
  float middleSea = max(
    sampleContinuousShoreRing(uv, 3.55, hexScale, mapAspect),
    sampleContinuousShoreRing(uv, 4.45, hexScale, mapAspect) * 0.70
  );

  shallowSea = max(shallowSea - nearShore * 0.28, 0.0);
  middleSea = max(middleSea - shallowSea * 0.14 - nearShore * 0.10, 0.0);

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
    dot(uv, normal) * narrowScale - uTimeSeconds * speed * 0.12
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
  float crest = smoothstep(0.56, 0.86, streak);
  float trough = 1.0 - smoothstep(0.18, 0.44, streak);

  return crest * 0.86 - trough * 0.16;
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
  vec2 slowFlow = vec2(uTimeSeconds * 0.004, -uTimeSeconds * 0.0015);
  vec2 boundaryFlow = vec2(uTimeSeconds * 0.010, -uTimeSeconds * 0.004);
  vec2 surfaceFlow = vec2(uTimeSeconds * 0.008, -uTimeSeconds * 0.003);
  vec3 broadNoise = texture2D(uWaterTexture, uv * 3.6 + slowFlow).rgb;
  vec3 boundaryNoise = texture2D(uWaterTexture, uv * 8.5 + boundaryFlow).rgb;
  vec3 fineBoundaryNoise = texture2D(uWaterTexture, uv * 15.0 + boundaryFlow * 0.58 + vec2(0.11, -0.03)).rgb;
  vec3 boundaryDriftNoise = texture2D(uWaterTexture, uv * 5.2 + boundaryFlow * 0.34 + vec2(0.27, 0.15)).rgb;
  vec3 surfaceNoise = texture2D(uWaterTexture, uv * 16.0 + surfaceFlow).rgb;
  vec3 surfaceNoiseShifted = texture2D(uWaterTexture, uv * 27.0 + surfaceFlow * 0.64 + vec2(0.19, -0.07)).rgb;
  float bandJitter =
    (broadNoise.r - 0.5) * 0.18 +
    (boundaryNoise.g - 0.5) * 0.28 +
    (fineBoundaryNoise.b - 0.5) * 0.20 +
    (boundaryDriftNoise.r - 0.5) * 0.16;
  float nearShoreJitter = (boundaryNoise.b - 0.5) * 0.10;
  float nearShoreBand = smoothstep(0.48, 0.96, nearShore + nearShoreJitter);
  float shallowSeaBand = smoothstep(0.00, 0.60, shallowSea + bandJitter * 0.86) * (1.0 - nearShoreBand * 0.36);
  float middleSeaBand = smoothstep(0.00, 0.72, middleSea + bandJitter * 0.74) * (1.0 - nearShoreBand * 0.52) * (1.0 - shallowSeaBand * 0.24);
  float ripple = sampleNoiseWaterRipple(uv, vec2(1.0, 0.16), 2.4, 24.0, 0.020);
  float fineRipple = sampleNoiseWaterRipple(uv + vec2(0.17, -0.09), vec2(1.0, 0.14), 4.2, 36.0, 0.014) * 0.24;
  float wave = ripple + fineRipple + (broadNoise.b - 0.5) * 0.06;
  float surfaceRipple =
    (surfaceNoise.r - surfaceNoise.g) * 0.11 +
    (surfaceNoiseShifted.b - 0.5) * 0.06;
  float waveCrest = smoothstep(0.10, 0.58, wave + surfaceRipple * 0.22);
  float waveTrough = smoothstep(0.10, 0.58, -wave);
  float vein = smoothstep(0.34, 0.80, broadNoise.r * 0.58 + surfaceNoise.g * 0.24 + waveCrest * 0.18);
  float bandLight = nearShoreBand * 0.48 + shallowSeaBand * 0.42 + middleSeaBand * 0.26;
  float shoreLight = bandLight * smoothstep(0.10, 0.50, abs(wave) + boundaryNoise.b * 0.18);
  vec3 deepWater = vec3(0.045, 0.18, 0.42);
  vec3 middleSeaWater = vec3(0.070, 0.31, 0.52);
  vec3 shallowSeaWater = vec3(0.120, 0.46, 0.54);
  vec3 nearShoreWater = vec3(0.240, 0.62, 0.47);
  vec3 animatedColor = deepWater;

  animatedColor = mix(animatedColor, middleSeaWater, middleSeaBand * 0.62);
  animatedColor = mix(animatedColor, shallowSeaWater, shallowSeaBand * 0.82);
  animatedColor = mix(animatedColor, nearShoreWater, nearShoreBand * 0.72);

  animatedColor += vec3(0.10, 0.17, 0.19) * waveCrest;
  animatedColor -= vec3(0.035, 0.060, 0.075) * waveTrough;
  animatedColor += vec3(wave) * 0.07;
  animatedColor += vec3(0.055, 0.090, 0.100) * surfaceRipple;
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
  vec3 shoreBands = getContinuousShoreBands(vUv, hexScale, mapAspect, water);
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
  color = mix(color, vec3(0.0), border * mix(0.34, 0.025, water));

  gl_FragColor = vec4(color, 1.0);
}
