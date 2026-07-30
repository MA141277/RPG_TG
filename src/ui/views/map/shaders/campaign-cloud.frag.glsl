precision mediump float;

varying vec2 vUv;

uniform vec2 uResolution;
uniform float uTimeSeconds;
uniform vec4 uCloudProjection;
uniform vec2 uTerrainWorldScale;
uniform mat4 uCloudInverseTerrainMatrix;
uniform sampler2D uNoiseTexture;
uniform sampler2D uRevealTexture;
uniform sampler2D uPreviousRevealTexture;
uniform float uRevealTransition;
uniform float uCloudTextureScaleBoost;

const int MAX_MAP_SPACE_CLOUD_STEPS = 8;

const float CLOUD_TEXTURE_SAMPLE_SCALE = 1.08;
const float MAP_SPACE_CLOUD_TEXTURE_SCALE_MAX = 50.0;

const float REVEAL_FIELD_PIXEL_SMOOTHING = 1.35;
const vec3 ARTICLE_EDGE_CLEAR_VALUES = vec3(0.26, 0.84, 1.22);
const vec3 ARTICLE_CORE_CLEAR_VALUES = vec3(0.94, 0.998, 1.05);
const float ARTICLE_BODY_ALPHA = 1.78;
const float ARTICLE_RIM_BODY_ALPHA = 0.16;
const vec2 ARTICLE_AIR_MIST_HOLE_CLEAR_RANGE = vec2(0.62, 0.92);
const vec2 ARTICLE_ISOLATED_CLOUD_CLEAR_RANGE = vec2(0.88, 0.985);

float sampleNoiseTexture(vec2 p) {
  vec3 sampleColor = texture2D(uNoiseTexture, fract(p)).rgb;
  return dot(sampleColor, vec3(0.299, 0.587, 0.114));
}

float textureFbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.52;
  float amplitudeSum = 0.0;

  value += sampleNoiseTexture(p) * amplitude;
  amplitudeSum += amplitude;
  amplitude *= 0.52;
  value += sampleNoiseTexture(p * 2.03 + vec2(0.37, 0.19)) * amplitude;
  amplitudeSum += amplitude;
  amplitude *= 0.52;
  value += sampleNoiseTexture(p * 4.11 + vec2(0.11, 0.73)) * amplitude;
  amplitudeSum += amplitude;
  amplitude *= 0.52;
  value += sampleNoiseTexture(p * 8.23 + vec2(0.61, 0.43)) * amplitude;
  amplitudeSum += amplitude;

  return value / amplitudeSum;
}

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.11369, 0.13787));
  p3 += dot(p3, p3.yzx + 19.19);
  return fract(vec2((p3.x + p3.y) * p3.z, (p3.x + p3.z) * p3.y));
}

float valueNoise(vec2 p) {
  vec2 cell = floor(p);
  vec2 local = fract(p);
  vec2 fade = local * local * (3.0 - 2.0 * local);
  float a = hash12(cell);
  float b = hash12(cell + vec2(1.0, 0.0));
  float c = hash12(cell + vec2(0.0, 1.0));
  float d = hash12(cell + vec2(1.0, 1.0));

  return mix(mix(a, b, fade.x), mix(c, d, fade.x), fade.y);
}

float proceduralFbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float amplitudeSum = 0.0;
  mat2 rotation = mat2(0.82, -0.57, 0.57, 0.82);

  value += valueNoise(p) * amplitude;
  amplitudeSum += amplitude;
  p = rotation * p * 2.03 + vec2(17.13, 5.71);
  amplitude *= 0.52;
  value += valueNoise(p) * amplitude;
  amplitudeSum += amplitude;
  p = rotation * p * 2.11 + vec2(-3.19, 11.47);
  amplitude *= 0.52;
  value += valueNoise(p) * amplitude;
  amplitudeSum += amplitude;
  p = rotation * p * 2.07 + vec2(9.41, -7.63);
  amplitude *= 0.52;
  value += valueNoise(p) * amplitude;
  amplitudeSum += amplitude;

  return value / amplitudeSum;
}

vec2 worleyNoise(vec2 p) {
  vec2 cell = floor(p);
  vec2 local = fract(p);
  float nearest = 10.0;
  float secondNearest = 10.0;

  for (int y = -1; y <= 1; y += 1) {
    for (int x = -1; x <= 1; x += 1) {
      vec2 offset = vec2(float(x), float(y));
      vec2 feature = hash22(cell + offset);
      vec2 delta = offset + feature - local;
      float distanceToFeature = dot(delta, delta);
      if (distanceToFeature < nearest) {
        secondNearest = nearest;
        nearest = distanceToFeature;
      } else if (distanceToFeature < secondNearest) {
        secondNearest = distanceToFeature;
      }
    }
  }

  return sqrt(vec2(nearest, secondNearest));
}

float billow(float value) {
  return 1.0 - abs(value * 2.0 - 1.0);
}

vec2 sampleRevealTextureFields(vec2 uv) {
  vec4 sampleValue = texture2D(uRevealTexture, clamp(uv, vec2(0.0), vec2(1.0)));
  return vec2(sampleValue.r, sampleValue.g);
}

vec2 samplePreviousRevealTextureFields(vec2 uv) {
  vec4 sampleValue = texture2D(
    uPreviousRevealTexture,
    clamp(uv, vec2(0.0), vec2(1.0))
  );
  return vec2(sampleValue.r, sampleValue.g);
}

vec2 sampleRevealFields(vec2 uv) {
  vec2 texel = REVEAL_FIELD_PIXEL_SMOOTHING / max(uResolution, vec2(1.0));
  vec2 center = sampleRevealTextureFields(uv) * 0.40;
  vec2 axis =
    sampleRevealTextureFields(uv + vec2(texel.x, 0.0)) +
    sampleRevealTextureFields(uv - vec2(texel.x, 0.0)) +
    sampleRevealTextureFields(uv + vec2(0.0, texel.y)) +
    sampleRevealTextureFields(uv - vec2(0.0, texel.y));
  vec2 diagonal =
    sampleRevealTextureFields(uv + texel) +
    sampleRevealTextureFields(uv - texel) +
    sampleRevealTextureFields(uv + vec2(texel.x, -texel.y)) +
    sampleRevealTextureFields(uv + vec2(-texel.x, texel.y));

  return center + axis * 0.10 + diagonal * 0.025;
}

vec2 samplePreviousRevealFields(vec2 uv) {
  vec2 texel = REVEAL_FIELD_PIXEL_SMOOTHING / max(uResolution, vec2(1.0));
  vec2 center = samplePreviousRevealTextureFields(uv) * 0.40;
  vec2 axis =
    samplePreviousRevealTextureFields(uv + vec2(texel.x, 0.0)) +
    samplePreviousRevealTextureFields(uv - vec2(texel.x, 0.0)) +
    samplePreviousRevealTextureFields(uv + vec2(0.0, texel.y)) +
    samplePreviousRevealTextureFields(uv - vec2(0.0, texel.y));
  vec2 diagonal =
    samplePreviousRevealTextureFields(uv + texel) +
    samplePreviousRevealTextureFields(uv - texel) +
    samplePreviousRevealTextureFields(uv + vec2(texel.x, -texel.y)) +
    samplePreviousRevealTextureFields(uv + vec2(-texel.x, texel.y));

  return center + axis * 0.10 + diagonal * 0.025;
}

float clampAndPowValue(float value, vec3 minMaxPow) {
  float normalizedValue = clamp(
    (value - minMaxPow.x) / max(minMaxPow.y - minMaxPow.x, 0.0001),
    0.0,
    1.0
  );
  return clamp(pow(normalizedValue, minMaxPow.z), 0.0, 1.0);
}

const float MAP_SPACE_CLOUD_BOTTOM_HEIGHT_UNITS = 1.33;
const float MAP_SPACE_CLOUD_TOP_HEIGHT_UNITS = 3.63;
const float MAP_SPACE_CLOUD_DENSITY_SCALE = 1.74;
const float MAP_SPACE_CLOUD_ALPHA_LIMIT = 0.965;
const vec2 MAP_SPACE_CLOUD_WIND = vec2(0.018, -0.011);
const float MAP_SPACE_CLOUD_PARALLAX_MIN_STRENGTH = 0.18;
const float MAP_SPACE_CLOUD_PARALLAX_MAX_STRENGTH = 0.36;

struct MapSpaceCloudRay {
  vec3 origin;
  vec3 direction;
  vec2 groundPoint;
};

vec3 unprojectMapSpaceCloudPoint(vec3 ndc) {
  vec4 point = uCloudInverseTerrainMatrix * vec4(ndc, 1.0);
  float safeW = abs(point.w) < 0.0001 ? 1.0 : point.w;
  return point.xyz / safeW;
}

MapSpaceCloudRay buildMapSpaceCloudRay(vec2 uv) {
  vec2 ndc = vec2(uv.x * 2.0 - 1.0, uv.y * 2.0 - 1.0);
  vec3 nearPoint = unprojectMapSpaceCloudPoint(vec3(ndc, -1.0));
  vec3 farPoint = unprojectMapSpaceCloudPoint(vec3(ndc, 1.0));
  vec3 direction = normalize(farPoint - nearPoint);
  float groundT = abs(direction.z) < 0.0001 ? 0.0 : -nearPoint.z / direction.z;
  vec2 groundPoint = (nearPoint + direction * groundT).xy;

  return MapSpaceCloudRay(nearPoint, direction, groundPoint);
}

vec2 intersectMapSpaceCloudSlab(MapSpaceCloudRay ray) {
  float cloudBottom = MAP_SPACE_CLOUD_BOTTOM_HEIGHT_UNITS * uCloudProjection.z;
  float cloudTop = MAP_SPACE_CLOUD_TOP_HEIGHT_UNITS * uCloudProjection.z;
  if (abs(ray.direction.z) < 0.0001) {
    return vec2(-1.0);
  }

  float tBottom = (cloudBottom - ray.origin.z) / ray.direction.z;
  float tTop = (cloudTop - ray.origin.z) / ray.direction.z;
  float tEnter = max(min(tBottom, tTop), 0.0);
  float tExit = max(tBottom, tTop);

  if (tExit <= tEnter) {
    return vec2(-1.0);
  }

  return vec2(tEnter, tExit);
}

vec2 getMapSpaceCloudRayGroundPoint(MapSpaceCloudRay ray) {
  return ray.groundPoint;
}

vec2 mapSpaceGroundPointToTerrainUv(vec2 groundPoint) {
  vec2 safeWorldScale = max(abs(uTerrainWorldScale), vec2(0.0001));
  return clamp(
    vec2(
      groundPoint.x / (2.0 * safeWorldScale.x) + 0.5,
      0.5 - groundPoint.y / (2.0 * safeWorldScale.y)
    ),
    vec2(0.0),
    vec2(1.0)
  );
}

vec2 getMapSpaceCloudRevealUv(MapSpaceCloudRay ray) {
  return mapSpaceGroundPointToTerrainUv(getMapSpaceCloudRayGroundPoint(ray));
}

float getMapSpaceCloudParallaxStrength() {
  return mix(
    MAP_SPACE_CLOUD_PARALLAX_MIN_STRENGTH,
    MAP_SPACE_CLOUD_PARALLAX_MAX_STRENGTH,
    smoothstep(1.0, 2.4, uCloudProjection.w)
  );
}

vec3 getMapSpaceCloudTexturePoint(MapSpaceCloudRay ray, vec3 point) {
  vec2 parallaxPoint = mix(getMapSpaceCloudRayGroundPoint(ray), point.xy, getMapSpaceCloudParallaxStrength());
  return vec3(parallaxPoint, point.z);
}

float sampleMapSpaceCloudDensity(
  MapSpaceCloudRay ray,
  vec3 point,
  vec3 columnPoint,
  float time,
  out float textureValue
) {
  float cloudBottom = MAP_SPACE_CLOUD_BOTTOM_HEIGHT_UNITS * uCloudProjection.z;
  float cloudTop = MAP_SPACE_CLOUD_TOP_HEIGHT_UNITS * uCloudProjection.z;
  float heightRatio = clamp(
    (point.z - cloudBottom) /
      max(cloudTop - cloudBottom, 0.0001),
    0.0,
    1.0
  );
  vec2 wind = MAP_SPACE_CLOUD_WIND * time;
  float worldTextureScale = clamp(
    uCloudTextureScaleBoost,
    0.50,
    MAP_SPACE_CLOUD_TEXTURE_SCALE_MAX
  );
  vec3 columnTexturePoint = getMapSpaceCloudTexturePoint(ray, columnPoint);
  vec3 noisePoint = vec3(columnTexturePoint.xy * (2.35 * worldTextureScale) + wind, columnTexturePoint.z * 3.0);
  float broad = proceduralFbm(noisePoint.xy + vec2(noisePoint.z * 0.37, -noisePoint.z * 0.21));
  float billowed = billow(proceduralFbm(noisePoint.xy * 2.15 + vec2(noisePoint.z * 0.51, noisePoint.z * 0.28)));
  float detail = textureFbm(noisePoint.xy * (3.80 * CLOUD_TEXTURE_SAMPLE_SCALE) + wind * 1.7);
  float heightEnvelope = smoothstep(0.0, 0.25, heightRatio) * (1.0 - smoothstep(0.76, 1.0, heightRatio));
  float lowLayer = smoothstep(0.00, 0.34, heightRatio) * (1.0 - smoothstep(0.42, 0.72, heightRatio));
  float midLayer = smoothstep(0.18, 0.50, heightRatio) * (1.0 - smoothstep(0.62, 0.92, heightRatio));
  float highLayer = smoothstep(0.48, 0.88, heightRatio);
  float lowDensity = (broad * 0.64 + billowed * 0.24 + detail * 0.12) * (0.62 + lowLayer * 0.55);
  float midDensity = (broad * 0.38 + billowed * 0.42 + detail * 0.20) * (0.72 + midLayer * 0.46);
  float highDensity = (broad * 0.22 + billowed * 0.30 + detail * 0.48) * (0.34 + highLayer * 0.42);
  float density = lowDensity * 0.38 + midDensity * 0.44 + highDensity * 0.18;
  float visibleTextureLayer = smoothstep(0.24, 0.56, heightRatio) * (1.0 - smoothstep(0.62, 0.90, heightRatio));
  float contrastTexture = clamp((detail * 0.68 + billowed * 0.32 - 0.24) * 3.05, 0.0, 1.0);
  textureValue = mix(
    contrastTexture,
    clamp((contrastTexture - 0.10) * 1.72, 0.0, 1.0),
    visibleTextureLayer
  );

  return clamp((density - 0.39) * MAP_SPACE_CLOUD_DENSITY_SCALE * heightEnvelope, 0.0, 1.0);
}

vec4 sampleMapSpaceVolumetricCloud(
  MapSpaceCloudRay ray,
  float time,
  out float visibleTexture
) {
  vec2 segment = intersectMapSpaceCloudSlab(ray);
  if (segment.x < 0.0) {
    visibleTexture = 0.0;
    return vec4(0.0);
  }

  float segmentLength = segment.y - segment.x;
  float stepSize = segmentLength / float(MAX_MAP_SPACE_CLOUD_STEPS);
  vec3 accumulatedColor = vec3(0.0);
  float accumulatedAlpha = 0.0;
  float accumulatedTexture = 0.0;
  float accumulatedTextureWeight = 0.0;
  vec3 columnPoint = ray.origin + ray.direction * mix(segment.x, segment.y, 0.46);

  for (int stepIndex = 0; stepIndex < MAX_MAP_SPACE_CLOUD_STEPS; stepIndex += 1) {
    float stepRatio = (float(stepIndex) + 0.5) / float(MAX_MAP_SPACE_CLOUD_STEPS);
    vec3 point = ray.origin + ray.direction * (segment.x + stepSize * (float(stepIndex) + 0.5));
    float textureValue = 0.0;
    float density = sampleMapSpaceCloudDensity(ray, point, columnPoint, time, textureValue);
    float cloudBottom = MAP_SPACE_CLOUD_BOTTOM_HEIGHT_UNITS * uCloudProjection.z;
    float cloudTop = MAP_SPACE_CLOUD_TOP_HEIGHT_UNITS * uCloudProjection.z;
    float heightRatio = clamp((point.z - cloudBottom) / max(cloudTop - cloudBottom, 0.0001), 0.0, 1.0);
    float shadow = smoothstep(0.18, 0.88, density) * (1.0 - heightRatio * 0.36);
    vec3 bottomColor = vec3(0.56, 0.65, 0.66);
    vec3 midColor = vec3(0.84, 0.90, 0.88);
    vec3 topColor = vec3(1.0, 0.99, 0.93);
    vec3 stepColor = mix(bottomColor, topColor, heightRatio);
    stepColor = mix(stepColor, midColor, 0.26 + stepRatio * 0.18);
    stepColor = mix(stepColor, bottomColor, shadow * 0.44);
    float internalShadow = smoothstep(
      0.30,
      0.82,
      density * (1.0 - abs(heightRatio - 0.38) * 1.55)
    ) * (1.0 - smoothstep(0.68, 0.96, heightRatio));
    stepColor = mix(stepColor, vec3(0.52, 0.61, 0.62), internalShadow * 0.18);
    float stepTextureRidge = smoothstep(
      0.42,
      0.88,
      textureValue
    ) * smoothstep(0.18, 0.74, density);
    float stepTextureCrease = smoothstep(
      0.16,
      0.70,
      (1.0 - textureValue) * density
    );
    stepColor = mix(stepColor, vec3(0.43, 0.53, 0.56), stepTextureCrease * 0.38);
    float cloudTopHighlight = smoothstep(
      0.34,
      0.86,
      textureValue * density + heightRatio * 0.32
    ) * smoothstep(0.24, 0.92, heightRatio);
    stepColor = mix(stepColor, vec3(1.0, 0.99, 0.92), cloudTopHighlight * 0.22 + stepTextureRidge * 0.36);
    float stepAlpha = clamp(density * 0.38 * (1.0 - accumulatedAlpha), 0.0, 1.0);

    accumulatedColor += stepColor * stepAlpha;
    accumulatedAlpha += stepAlpha;
    float textureWeight = (0.18 + density) * (1.0 - abs(stepRatio - 0.46));
    accumulatedTexture += textureValue * textureWeight;
    accumulatedTextureWeight += textureWeight;
    if (accumulatedAlpha >= MAP_SPACE_CLOUD_ALPHA_LIMIT) {
      break;
    }
  }

  visibleTexture = accumulatedTexture / max(accumulatedTextureWeight, 0.001);
  return vec4(accumulatedColor / max(accumulatedAlpha, 0.001), clamp(accumulatedAlpha, 0.0, 1.0));
}

vec4 sampleArticleCloudSea(vec2 uv, float time) {
  MapSpaceCloudRay ray = buildMapSpaceCloudRay(uv);
  float mapSpaceTexture = 0.0;
  vec4 mapSpaceCloud = sampleMapSpaceVolumetricCloud(ray, time, mapSpaceTexture);
  float mapSpaceLuminance = dot(mapSpaceCloud.rgb, vec3(0.299, 0.587, 0.114));
  vec3 cloudSample = vec3(
    mapSpaceCloud.a,
    clamp(mapSpaceLuminance, 0.0, 1.0),
    clamp(mapSpaceCloud.a * 0.72 + mapSpaceLuminance * 0.28, 0.0, 1.0)
  );
  float cloudPresence = smoothstep(0.015, 0.16, mapSpaceCloud.a);
  if (cloudPresence <= 0.001) {
    return vec4(mapSpaceCloud.rgb, 0.0);
  }

  vec2 revealUv = getMapSpaceCloudRevealUv(ray);
  vec2 currentFields = sampleRevealFields(revealUv);
  vec2 revealFields = currentFields;
  if (uRevealTransition < 0.999) {
    vec2 previousFields = samplePreviousRevealFields(revealUv);
    revealFields = mix(
      previousFields,
      currentFields,
      smoothstep(0.0, 1.0, uRevealTransition)
    );
  }
  float organicClearField = revealFields.y;
  float edgeClear = clampAndPowValue(
    organicClearField,
    ARTICLE_EDGE_CLEAR_VALUES
  );
  float coreClear = clampAndPowValue(
    organicClearField,
    ARTICLE_CORE_CLEAR_VALUES
  );
  float airMistKeep = 1.0 - smoothstep(
    ARTICLE_AIR_MIST_HOLE_CLEAR_RANGE.x,
    ARTICLE_AIR_MIST_HOLE_CLEAR_RANGE.y,
    organicClearField
  );
  float isolatedCloudKeep = 1.0 - smoothstep(
    ARTICLE_ISOLATED_CLOUD_CLEAR_RANGE.x,
    ARTICLE_ISOLATED_CLOUD_CLEAR_RANGE.y,
    organicClearField
  );
  float clearAmount = max(edgeClear, coreClear);
  float cloudMask = clamp(1.0 - clearAmount, 0.0, 1.0) * isolatedCloudKeep;

  float edgeBand = clamp(revealFields.x * (1.0 - coreClear), 0.0, 1.0);
  float shallowZone = edgeBand * airMistKeep;
  float deepZone = clamp(1.0 - shallowZone, 0.0, 1.0);

  float cloudDensity = smoothstep(
    0.42,
    0.86,
    cloudSample.x * 0.70 + billow(cloudSample.y) * 0.18 + cloudSample.z * 0.12
  );
  float cloudDetail = smoothstep(
    0.20,
    0.86,
    cloudSample.z * 0.58 + billow(cloudSample.y) * 0.22 + cloudSample.x * 0.20
  );
  float cloudTexturePresence = smoothstep(0.12, 0.72, cloudDensity);
  float denseCloudTexture = smoothstep(
    0.16,
    0.74,
    mapSpaceTexture
  ) * cloudTexturePresence;
  float denseCloudCrease = smoothstep(
    0.08,
    0.56,
    (1.0 - mapSpaceTexture) * (0.44 + cloudDensity * 0.72)
  );
  float bodyTexture = mix(0.58, 1.92, mapSpaceTexture);
  float bodyAlphaTexture = mix(0.46, 1.34, smoothstep(0.14, 0.88, mapSpaceTexture));
  float bodyAlpha = ARTICLE_BODY_ALPHA * mapSpaceCloud.a * deepZone * bodyAlphaTexture;
  float rimAlpha =
    ARTICLE_RIM_BODY_ALPHA *
    edgeBand *
    cloudPresence *
    (0.38 + cloudDensity * 0.62);
  float alignedEdgeMistAlpha =
    shallowZone *
    cloudMask *
    cloudPresence *
    (0.20 + cloudDensity * 0.26 + cloudDetail * 0.10);
  float alpha = cloudMask * (bodyAlpha + rimAlpha) + alignedEdgeMistAlpha;
  alpha = clamp(alpha, 0.0, 1.0);

  float selfShadow = smoothstep(
    0.24,
    0.86,
    (1.0 - cloudSample.y) * 0.32 +
      (1.0 - cloudDetail) * 0.20 +
      cloudDensity * 0.22 +
      edgeBand * 0.16 +
      deepZone * 0.10
  );
  float cloudLight = smoothstep(
    0.34,
    0.90,
    cloudSample.x * 0.36 + cloudDetail * 0.28 + billow(cloudSample.y) * 0.36
  );
  vec3 shadowColor = vec3(0.56, 0.64, 0.65);
  vec3 midColor = vec3(0.83, 0.90, 0.89);
  vec3 lightColor = vec3(1.0, 0.99, 0.94);
  vec3 cloudColor = mix(mapSpaceCloud.rgb, shadowColor, selfShadow * (0.30 + deepZone * 0.10));
  cloudColor = mix(cloudColor, midColor, 0.14);
  float denseTextureContrast = (mapSpaceTexture - 0.50) * cloudTexturePresence * deepZone;
  float shadowTextureSplit = (0.54 - mapSpaceTexture) * selfShadow * (0.42 + cloudTexturePresence * 0.86) * deepZone;
  float shadowOcclusion = clamp(denseCloudCrease * (0.26 + selfShadow * 0.74) * deepZone, 0.0, 0.72);
  cloudColor = clamp(cloudColor + vec3(denseTextureContrast * 0.34 - shadowTextureSplit * 0.42, denseTextureContrast * 0.30 - shadowTextureSplit * 0.30, denseTextureContrast * 0.24 - shadowTextureSplit * 0.20), vec3(0.0), vec3(1.0));
  cloudColor = mix(cloudColor, vec3(0.34, 0.45, 0.50), shadowOcclusion);
  cloudColor = mix(cloudColor, vec3(0.45, 0.55, 0.58), denseCloudCrease * (0.20 + cloudTexturePresence * 0.28) * deepZone);
  cloudColor = mix(cloudColor, lightColor, (cloudLight * 0.12 + denseCloudTexture * 0.68 + mapSpaceTexture * 0.04) * (1.0 - shadowOcclusion * 0.82));
  cloudColor = mix(cloudColor, vec3(0.92, 0.96, 0.94), shallowZone * 0.22);
  vec3 edgeMistColor = mix(vec3(0.78, 0.86, 0.86), vec3(0.98, 0.98, 0.93), cloudLight);
  cloudColor = mix(cloudColor, edgeMistColor, alignedEdgeMistAlpha * 0.72);

  return vec4(cloudColor, alpha);
}

void main() {
  vec4 cloudColor = sampleArticleCloudSea(vUv, uTimeSeconds);
  gl_FragColor = cloudColor;
}
