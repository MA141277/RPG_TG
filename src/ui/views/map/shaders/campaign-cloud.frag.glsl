precision mediump float;

varying vec2 vUv;

uniform vec2 uResolution;
uniform float uTimeSeconds;
uniform sampler2D uNoiseTexture;

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

vec4 sampleCloudLayer(vec2 uv, float time) {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 space = (uv - 0.5) * vec2(aspect, 1.0);
  vec2 primaryDrift = vec2(time * 0.012, -time * 0.004);
  vec2 upperDrift = vec2(-time * 0.006, time * 0.009);

  float broad = textureFbm(space * 0.26 + primaryDrift * 0.10 + vec2(0.29, 0.56));
  vec2 warp = vec2(
    textureFbm(space * 0.42 + upperDrift * 0.12 + vec2(0.12, 0.67)),
    textureFbm(space * 0.39 - upperDrift * 0.12 + vec2(0.71, 0.18))
  ) - 0.5;

  vec2 warpedSpace = space + warp * 0.34;
  vec2 bodyUv = warpedSpace * 0.34 + primaryDrift * 0.18 + vec2(0.17, 0.41);
  vec2 detailUv = warpedSpace * 0.72 - upperDrift * 0.28 + vec2(0.63, 0.22);
  vec2 strandUv = warpedSpace * 1.46 - primaryDrift * 0.42 + vec2(0.08, 0.77);
  float body = textureFbm(bodyUv);
  float detail = textureFbm(detailUv);
  float strand = textureFbm(strandUv);

  float coverage = smoothstep(0.18, 0.68, broad * 0.38 + body * 0.46 + detail * 0.26);
  float verticalFill = 0.88 + smoothstep(-0.72, 0.58, space.y) * 0.12;
  float density = coverage * (0.92 + detail * 0.32 + strand * 0.16) * verticalFill;
  density = smoothstep(0.03, 0.76, density);

  float selfShadow = smoothstep(0.24, 0.82, body * 0.62 + detail * 0.38);
  float lightEdge = smoothstep(0.34, 0.90, textureFbm(warpedSpace * 0.88 + upperDrift * 0.22 + vec2(-0.18, 0.12)));
  vec3 shadowColor = vec3(0.58, 0.64, 0.68);
  vec3 midColor = vec3(0.80, 0.84, 0.84);
  vec3 lightColor = vec3(1.0, 0.98, 0.90);
  vec3 color = mix(shadowColor, midColor, selfShadow);
  color = mix(color, lightColor, lightEdge * 0.42);

  float alpha = density * 0.99;

  return vec4(color, alpha);
}

void main() {
  vec4 cloud = sampleCloudLayer(vUv, uTimeSeconds);
  gl_FragColor = cloud;
}
