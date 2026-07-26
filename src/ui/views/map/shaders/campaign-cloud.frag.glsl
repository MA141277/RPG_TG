precision mediump float;

varying vec2 vUv;

uniform vec2 uResolution;
uniform float uTimeSeconds;
uniform vec3 uMapCamera;
uniform vec4 uCloudCamera;
uniform vec4 uCloudProjection;
uniform sampler2D uNoiseTexture;
uniform sampler2D uRevealTexture;
uniform sampler2D uPreviousRevealTexture;
uniform float uRevealTransition;

// Campaign cloud tuning table.
// Increase CLOUD_SAMPLE_SCALE to show more, smaller cloud groups on screen.
const float CLOUD_SAMPLE_SCALE = 1.5;
const float CLOUD_FLOW_SPEED = 0.3;
const vec2 CLOUD_PRIMARY_FLOW = vec2(0.92, -0.39);
const vec2 CLOUD_UPPER_FLOW = vec2(-0.48, 0.88);
const float CLOUD_FLOW_COORDINATE_SPEED = 0.026;
const float CLOUD_FLOW_WARP_STRENGTH = 0.18;
const float CLOUD_FLOW_WARP_SCALE = 0.72;
const float CLOUD_FLOW_SWIRL_STRENGTH = 0.035;
const float CLOUD_MAP_CAMERA_TRANSLATE_STRENGTH = 0.0010;
const float CLOUD_MAP_CAMERA_SCALE_STRENGTH = 0.8;
const float CLOUD_MAP_CAMERA_REFERENCE_SCALE = 15.0;
const int MAX_MAP_SPACE_CLOUD_STEPS = 12;

const float CLOUD_TEXTURE_SAMPLE_SCALE = 1.08;

const float REVEAL_FIELD_PIXEL_SMOOTHING = 1.35;
const float REVEAL_EDGE_CAMERA_SCALE_STRENGTH = 0.42;

const float OUTER_CLOUD_BANK_SAMPLE_SCALE = 1.12;
const float OUTER_CLOUD_BANK_COVERAGE_LOW = 0.38;
const float OUTER_CLOUD_BANK_COVERAGE_HIGH = 0.63;
const float OUTER_CLOUD_BANK_ALPHA_FLOOR = 0.16;
const float OUTER_CLOUD_BANK_ALPHA_BOOST = 0.24;
const float OUTER_CLOUD_BANK_EDGE_RECESS = 0.64;
const float OUTER_CLOUD_BANK_COLOR_LIFT = 0.14;
const float OUTER_PUFF_CLOUD_ALPHA = 1.18;
const float OUTER_PUFF_CLOUD_DETAIL_ALPHA = 0.46;
const float OUTER_PUFF_CLOUD_LIGHT_STEP = 0.012;
const float OUTER_PUFF_CLOUD_LIGHT_STRENGTH = 0.62;
const float OUTER_PUFF_CLOUD_SHADOW_STRENGTH = 0.88;
const float OUTER_PUFF_CLOUD_EDGE_STRENGTH = 0.38;
const float OUTER_PUFF_CLOUD_EDGE_SHADOW = 0.46;

const float ARTICLE_CLOUD_TILING_A = 1.12;
const float ARTICLE_CLOUD_TILING_B = 2.34;
const float ARTICLE_CLOUD_FLOW_A = 0.018;
const float ARTICLE_CLOUD_FLOW_B = 0.031;
const float ARTICLE_MASK_DISTORTION_STRENGTH = 0.345;
const vec2 ARTICLE_MASK_DISTORTION_BIAS = vec2(0.60, 0.58);
const float ARTICLE_EDGE_EROSION_STRENGTH = 0.36;
const vec3 ARTICLE_EDGE_CLEAR_VALUES = vec3(0.26, 0.84, 1.22);
const vec3 ARTICLE_CORE_CLEAR_VALUES = vec3(0.94, 0.998, 1.05);
const float ARTICLE_CORE_CLEAR_EROSION_STRENGTH = 0.42;
const float ARTICLE_BODY_ALPHA = 1.14;
const float ARTICLE_RIM_BODY_ALPHA = 0.16;
const vec2 ARTICLE_AIR_MIST_HOLE_CLEAR_RANGE = vec2(0.62, 0.92);
const vec2 ARTICLE_ISOLATED_CLOUD_CLEAR_RANGE = vec2(0.88, 0.985);
const float ARTICLE_REVEAL_DISSOLVE_NOISE = 0.42;
const float ARTICLE_REVEAL_DISSOLVE_SOFTNESS = 0.18;

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

vec2 buildViewportSpace(vec2 uv) {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  return (uv - 0.5) * vec2(aspect, 1.0);
}

float getMapCameraScaleFactor(float strength) {
  float normalizedScale = max(uMapCamera.x, 0.1) / CLOUD_MAP_CAMERA_REFERENCE_SCALE;
  return mix(1.0, normalizedScale, strength);
}

vec2 buildMapCoupledSpace(vec2 viewportSpace, float strength) {
  float safeCameraScale = max(uMapCamera.x, 0.1);
  vec2 effectiveCameraOffset = vec2(-uMapCamera.y, uMapCamera.z) / safeCameraScale;
  vec2 cameraOffset = effectiveCameraOffset *
    CLOUD_MAP_CAMERA_TRANSLATE_STRENGTH *
    strength;
  return viewportSpace / getMapCameraScaleFactor(strength) + cameraOffset;
}

vec2 buildCloudSpaceWithCameraStrength(vec2 viewportSpace, float time, float cameraScaleStrength) {
  float flowTime = time * CLOUD_FLOW_SPEED;
  vec2 mapCoupledSpace = buildMapCoupledSpace(viewportSpace, cameraScaleStrength);
  vec2 baseSpace = mapCoupledSpace * CLOUD_SAMPLE_SCALE;
  vec2 broadFlow =
    CLOUD_PRIMARY_FLOW * flowTime * CLOUD_FLOW_COORDINATE_SPEED +
    CLOUD_UPPER_FLOW * sin(flowTime * 0.055) * CLOUD_FLOW_SWIRL_STRENGTH;
  vec2 flowWarp = vec2(
    proceduralFbm(baseSpace * CLOUD_FLOW_WARP_SCALE + vec2(flowTime * 0.018, -flowTime * 0.010)),
    proceduralFbm(baseSpace * (CLOUD_FLOW_WARP_SCALE * 0.94) + vec2(-flowTime * 0.013, flowTime * 0.016))
  ) - 0.5;
  vec2 slowCurl = vec2(mapCoupledSpace.y, -mapCoupledSpace.x) * sin(flowTime * 0.041) * CLOUD_FLOW_SWIRL_STRENGTH;

  return baseSpace + broadFlow + flowWarp * CLOUD_FLOW_WARP_STRENGTH + slowCurl;
}

float sampleOuterCloudBankField(vec2 uv, float time) {
  vec2 viewportSpace = buildViewportSpace(uv);
  vec2 space = buildCloudSpaceWithCameraStrength(
    viewportSpace,
    time,
    CLOUD_MAP_CAMERA_SCALE_STRENGTH * 0.72
  ) * OUTER_CLOUD_BANK_SAMPLE_SCALE + vec2(-1.34, 0.77);
  float flowTime = time * CLOUD_FLOW_SPEED;
  vec2 primaryDrift = CLOUD_PRIMARY_FLOW * flowTime * 0.014;
  vec2 upperDrift = CLOUD_UPPER_FLOW * flowTime * 0.018;
  vec2 fineDrift = vec2(flowTime * 0.030, -flowTime * 0.016);
  vec2 warp = vec2(
    proceduralFbm(space * 0.72 + primaryDrift * 0.18 + vec2(0.47, 0.22)),
    proceduralFbm(space * 0.68 - upperDrift * 0.16 + vec2(0.16, 0.83))
  ) - 0.5;
  vec2 q = space + warp * 0.46;
  float broadMass = proceduralFbm(q * 0.62 + primaryDrift * 0.16 + vec2(0.23, 0.71));
  float puffA = proceduralFbm(q * 1.28 - upperDrift * 0.15 + vec2(0.35, 0.91));
  float puffB = billow(proceduralFbm(q * 1.82 + upperDrift * 0.21 + vec2(0.84, 0.38)));
  float puffC = textureFbm(q * (1.72 * CLOUD_TEXTURE_SAMPLE_SCALE) + primaryDrift * 0.13 + vec2(0.68, 0.24));
  vec2 cellular = worleyNoise(q * 1.36 + primaryDrift * 0.12 + vec2(-2.3, 5.1));
  float roundedPuff = 1.0 - smoothstep(0.10, 0.58, cellular.x);
  float fineMist = textureFbm(q * (4.60 * CLOUD_TEXTURE_SAMPLE_SCALE) - fineDrift * 0.20 + vec2(0.57, 0.19));
  float cloudField =
    broadMass * 0.22 +
    puffA * 0.18 +
    puffB * 0.18 +
    roundedPuff * 0.34 +
    puffC * 0.08 +
    fineMist * 0.00;

  return cloudField;
}

vec4 sampleOuterPuffCloudLayer(
  vec2 uv,
  float time,
  float cloudSeaKeep,
  float shallowZone,
  float cloudBankMask,
  float field
) {
  if (cloudSeaKeep <= 0.001) {
    return vec4(0.0);
  }

  vec2 viewportSpace = buildViewportSpace(uv);
  float textureDetail = textureFbm(
    buildCloudSpaceWithCameraStrength(
      viewportSpace,
      time,
      CLOUD_MAP_CAMERA_SCALE_STRENGTH * 0.70
    ) * (3.90 * CLOUD_TEXTURE_SAMPLE_SCALE) + vec2(0.42, 0.57)
  );
  float proceduralDetail = proceduralFbm(
    buildCloudSpaceWithCameraStrength(
      viewportSpace,
      time,
      CLOUD_MAP_CAMERA_SCALE_STRENGTH * 0.66
    ) * 3.10 + vec2(0.36, 0.82)
  );
  float detail = mix(textureDetail, proceduralDetail, 0.62);
  float tornEdge = billow(proceduralFbm(
    buildCloudSpaceWithCameraStrength(
      viewportSpace,
      time,
      CLOUD_MAP_CAMERA_SCALE_STRENGTH * 0.68
    ) * 2.80 + vec2(0.81, 0.23)
  ));
  float puffyMass = smoothstep(
    OUTER_CLOUD_BANK_COVERAGE_LOW,
    OUTER_CLOUD_BANK_COVERAGE_HIGH,
    field + detail * 0.10 + tornEdge * 0.08
  );
  float viewportRadius = length(viewportSpace * vec2(0.72, 1.0));
  float outerScreenBias = smoothstep(0.30, 0.74, viewportRadius);
  float biasedPuffMass = clamp(
    puffyMass * (0.84 + outerScreenBias * 0.24),
    0.0,
    1.0
  );
  float nearHoleRecess = mix(1.0, 0.68, shallowZone);
  float puffAlpha =
    cloudSeaKeep *
    nearHoleRecess *
    biasedPuffMass *
    (OUTER_PUFF_CLOUD_ALPHA + detail * OUTER_PUFF_CLOUD_DETAIL_ALPHA) *
    (0.72 + outerScreenBias * OUTER_PUFF_CLOUD_EDGE_STRENGTH);

  float slopeLight = smoothstep(0.20, 0.84, field * 0.46 + detail * 0.34 + tornEdge * 0.20);
  float selfShadow = smoothstep(0.24, 0.86, (1.0 - detail) * 0.42 + field * 0.34 + (1.0 - tornEdge) * 0.24);
  float rimLight = smoothstep(0.38, 0.88, tornEdge * 0.48 + detail * 0.34 + field * 0.18);
  float midHeightEdge =
    smoothstep(0.30, 0.54, field) *
    (1.0 - smoothstep(0.68, 0.88, field));
  float scallopShadow = smoothstep(
    0.28,
    0.76,
    (1.0 - tornEdge) * 0.30 +
      (1.0 - detail) * 0.24 +
      (1.0 - slopeLight) * 0.18 +
      midHeightEdge * 0.28
  );
  float clumpShadow = smoothstep(
    0.26,
    0.78,
    (1.0 - detail) * 0.26 +
      selfShadow * 0.40 +
      scallopShadow * 0.26 +
      midHeightEdge * 0.08
  );
  float cloudCap = smoothstep(
    0.46,
    0.82,
    field * 0.54 + detail * 0.18 + rimLight * 0.18 + slopeLight * 0.10
  );
  float clumpLight = smoothstep(
    0.36,
    0.82,
    slopeLight * 0.36 + rimLight * 0.32 + detail * 0.18 + cloudCap * 0.14
  );

  vec3 shadowColor = vec3(0.58, 0.65, 0.66);
  vec3 midColor = vec3(0.87, 0.91, 0.90);
  vec3 lightColor = vec3(1.0, 0.99, 0.94);
  vec3 color = mix(
    midColor,
    shadowColor,
    clumpShadow * OUTER_PUFF_CLOUD_SHADOW_STRENGTH
  );
  color = mix(
    color,
    shadowColor,
    midHeightEdge * OUTER_PUFF_CLOUD_EDGE_SHADOW * (1.0 - shallowZone * 0.45)
  );
  color = mix(color, midColor * 0.98, tornEdge * 0.10);
  color = mix(
    color,
    lightColor,
    cloudCap * 0.26 * (0.66 + outerScreenBias * 0.34)
  );
  color = mix(
    color,
    lightColor,
    clumpLight * OUTER_PUFF_CLOUD_LIGHT_STRENGTH * (0.72 + cloudBankMask * 0.28)
  );

  return vec4(color, clamp(puffAlpha, 0.0, 1.0));
}

vec2 sampleRevealTextureFields(vec2 uv) {
  vec2 revealUv = vec2(uv.x, 1.0 - uv.y);
  vec4 sampleValue = texture2D(uRevealTexture, clamp(revealUv, vec2(0.0), vec2(1.0)));
  return vec2(sampleValue.r, sampleValue.g);
}

vec2 samplePreviousRevealTextureFields(vec2 uv) {
  vec2 revealUv = vec2(uv.x, 1.0 - uv.y);
  vec4 sampleValue = texture2D(
    uPreviousRevealTexture,
    clamp(revealUv, vec2(0.0), vec2(1.0))
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

float articleCloudNoise(vec2 p) {
  float broad = textureFbm(p * 0.58 + vec2(0.31, 0.64));
  float medium = textureFbm(p * 1.18 + vec2(0.78, 0.22));
  float detail = proceduralFbm(p * 2.42 + vec2(0.14, 0.87));
  float fiber = textureFbm(p * 4.36 + vec2(0.43, 0.19));
  vec2 cellular = worleyNoise(p * 1.28 + vec2(3.4, -1.8));
  float roundedMass = 1.0 - smoothstep(0.08, 0.68, cellular.x);
  float brokenMass = smoothstep(0.42, 0.86, broad * 0.50 + medium * 0.34 + roundedMass * 0.16);

  return clamp(
    broad * 0.24 +
      medium * 0.22 +
      billow(detail) * 0.13 +
      fiber * 0.08 +
      roundedMass * 0.18 +
      brokenMass * 0.15,
    0.0,
    1.0
  );
}

vec3 sampleArticleFlowingCloud(vec2 uv, float time) {
  vec2 viewportSpace = buildViewportSpace(uv);
  vec2 cloudSpace = buildCloudSpaceWithCameraStrength(
    viewportSpace,
    time,
    CLOUD_MAP_CAMERA_SCALE_STRENGTH * 0.72
  );
  float flowTime = time * CLOUD_FLOW_SPEED;
  vec2 cloudUvA =
    cloudSpace * ARTICLE_CLOUD_TILING_A +
    CLOUD_PRIMARY_FLOW * flowTime * ARTICLE_CLOUD_FLOW_A;
  vec2 cloudUvB =
    cloudSpace * ARTICLE_CLOUD_TILING_B -
    CLOUD_UPPER_FLOW * flowTime * ARTICLE_CLOUD_FLOW_B;
  float cloudA = articleCloudNoise(cloudUvA);
  float cloudB = articleCloudNoise(cloudUvB);
  float combined = clamp(cloudA * 0.56 + cloudB * 0.44, 0.0, 1.0);
  combined = clamp((combined - 0.36) * 1.46 + 0.36, 0.0, 1.0);
  float detail = clamp(abs(cloudA - cloudB) * 1.55 + textureFbm(cloudSpace * 5.4) * 0.18, 0.0, 1.0);

  return vec3(combined, cloudA, detail);
}

vec3 computeArticleMaskOffsetAndErosion(vec2 uv, float time, vec3 cloudSample) {
  vec2 viewportSpace = buildViewportSpace(uv);
  vec2 edgeSpace = buildCloudSpaceWithCameraStrength(
    viewportSpace,
    time,
    REVEAL_EDGE_CAMERA_SCALE_STRENGTH
  );
  float flowTime = time * CLOUD_FLOW_SPEED;
  float broadEdgeCloud = articleCloudNoise(
    edgeSpace * 1.38 + CLOUD_PRIMARY_FLOW * flowTime * 0.018 + vec2(0.27, 0.61)
  );
  float fineEdgeCloud = articleCloudNoise(
    edgeSpace * 1.52 - CLOUD_UPPER_FLOW * flowTime * 0.021 + vec2(0.79, 0.18)
  );
  vec2 rawOffset = vec2(broadEdgeCloud, fineEdgeCloud) - ARTICLE_MASK_DISTORTION_BIAS;
  rawOffset += (cloudSample.yz - vec2(0.5)) * vec2(0.018, 0.012);

  float edgeResistance =
    broadEdgeCloud * 0.46 +
    fineEdgeCloud * 0.24 +
    billow(fineEdgeCloud) * 0.22 +
    cloudSample.x * 0.22 +
    cloudSample.z * 0.08;

  return vec3(
    rawOffset * ARTICLE_MASK_DISTORTION_STRENGTH,
    (edgeResistance - 0.50) * ARTICLE_EDGE_EROSION_STRENGTH
  );
}

float computeRevealDissolveProgress(vec2 uv, float time, vec3 cloudSample) {
  if (uRevealTransition >= 0.999) {
    return 1.0;
  }

  vec2 viewportSpace = buildViewportSpace(uv);
  vec2 dissolveSpace = buildCloudSpaceWithCameraStrength(
    viewportSpace,
    time,
    REVEAL_EDGE_CAMERA_SCALE_STRENGTH
  );
  float dissolveNoise =
    articleCloudNoise(dissolveSpace * 1.84 + vec2(0.37, 0.61)) * 0.58 +
    cloudSample.z * 0.26 +
    billow(cloudSample.y) * 0.16;
  float dissolveThreshold =
    uRevealTransition +
    (dissolveNoise - 0.5) * ARTICLE_REVEAL_DISSOLVE_NOISE;

  return smoothstep(
    0.0,
    ARTICLE_REVEAL_DISSOLVE_SOFTNESS,
    dissolveThreshold
  );
}

vec2 blendRevealFieldsForDissolve(
  vec2 previousFields,
  vec2 currentFields,
  float dissolveProgress
) {
  vec2 openingAmount = max(currentFields - previousFields, vec2(0.0));
  vec2 openingFields = mix(previousFields, currentFields, dissolveProgress);

  return mix(currentFields, openingFields, step(vec2(0.001), openingAmount));
}

vec2 sampleDissolvedRevealFields(vec2 uv, float dissolveProgress) {
  if (dissolveProgress >= 0.999) {
    return sampleRevealFields(uv);
  }

  return blendRevealFieldsForDissolve(
    samplePreviousRevealFields(uv),
    sampleRevealFields(uv),
    dissolveProgress
  );
}

vec4 sampleArticleCloudSea(vec2 uv, float time) {
  vec3 cloudSample = sampleArticleFlowingCloud(uv, time);
  vec3 maskOffsetAndErosion = computeArticleMaskOffsetAndErosion(uv, time, cloudSample);
  vec2 distortedUv = clamp(uv + maskOffsetAndErosion.xy, vec2(0.0), vec2(1.0));
  float revealDissolve = computeRevealDissolveProgress(uv, time, cloudSample);
  vec2 baseFields = sampleDissolvedRevealFields(uv, revealDissolve);
  vec2 distortedFields = sampleDissolvedRevealFields(
    distortedUv,
    revealDissolve
  );
  float baseClear = baseFields.y;
  float cloudErosion = maskOffsetAndErosion.z;
  float organicClearField = distortedFields.y - cloudErosion;
  float edgeClear = clampAndPowValue(
    organicClearField,
    ARTICLE_EDGE_CLEAR_VALUES
  );
  float coreClear = clampAndPowValue(
    distortedFields.y - cloudErosion * ARTICLE_CORE_CLEAR_EROSION_STRENGTH,
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

  float edgeBand = clamp(distortedFields.x * (1.0 - coreClear), 0.0, 1.0);
  float shallowZone = edgeBand;
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
  float cloudLobe = smoothstep(
    0.54,
    0.84,
    cloudSample.x * 0.70 + billow(cloudSample.y) * 0.16 + cloudDetail * 0.14
  );
  float bodyAlpha = ARTICLE_BODY_ALPHA * cloudLobe * deepZone;
  float rimAlpha = ARTICLE_RIM_BODY_ALPHA * edgeBand * (0.38 + cloudDensity * 0.62);
  float alpha = cloudMask * (bodyAlpha + rimAlpha);
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
  vec3 cloudColor = mix(midColor, shadowColor, selfShadow * (0.50 + deepZone * 0.20));
  cloudColor = mix(cloudColor, lightColor, cloudLight * 0.40 + cloudLobe * 0.22);
  cloudColor = mix(cloudColor, vec3(0.92, 0.96, 0.94), shallowZone * 0.22);

  float outerCloudBankField = sampleOuterCloudBankField(uv, time);
  float outerCloudBankMask = smoothstep(
    OUTER_CLOUD_BANK_COVERAGE_LOW,
    OUTER_CLOUD_BANK_COVERAGE_HIGH,
    outerCloudBankField
  );
  vec4 outerPuff = sampleOuterPuffCloudLayer(
    uv,
    time,
    cloudMask,
    shallowZone,
    outerCloudBankMask,
    outerCloudBankField
  );
  outerPuff.a *= (0.76 + deepZone * 0.72) * airMistKeep * cloudMask;

  float baseAlpha = alpha;
  vec3 baseColor = cloudColor;
  float finalAlpha = clamp(baseAlpha + outerPuff.a * (1.0 - baseAlpha), 0.0, 1.0);
  vec3 finalColor =
    (baseColor * baseAlpha + outerPuff.rgb * outerPuff.a * (1.0 - baseAlpha)) /
    max(finalAlpha, 0.001);

  return vec4(finalColor, finalAlpha);
}

void main() {
  vec4 cloudColor = sampleArticleCloudSea(vUv, uTimeSeconds);
  float cloudProjectionNoop = mod(
    abs(uCloudCamera.x) +
      abs(uCloudCamera.y) +
      abs(uCloudCamera.z) +
      abs(uCloudCamera.w) +
      abs(uCloudProjection.x) +
      abs(uCloudProjection.y) +
      abs(uCloudProjection.z) +
      abs(uCloudProjection.w),
    0.000001
  );
  cloudColor.a = clamp(cloudColor.a + cloudProjectionNoop * 0.000001, 0.0, 1.0);
  gl_FragColor = cloudColor;
}
