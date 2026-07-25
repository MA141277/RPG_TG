precision mediump float;

uniform float uAmbient;
uniform float uDirectional;
uniform vec2 uTerrainViewportSize;
uniform float uTerrainCameraLightHeight;
uniform float uTerrainCameraLightHorizontalPull;
uniform float uTerrainDirectionalLightStrength;
uniform float uTerrainBackShadowStrength;
uniform float uTerrainSteepShadowStrength;

varying vec3 vNormal;
varying vec3 vCameraNormal;
varying vec3 vColor;

void main() {
  vec3 normal = normalize(vNormal);
  // Fort-city OBJ axis remapping flips winding, so use model normals directly.
  vec3 cameraNormal = normalize(vCameraNormal);
  vec2 safeViewportSize = max(uTerrainViewportSize, vec2(1.0, 1.0));
  vec2 viewportUv = gl_FragCoord.xy / safeViewportSize;
  vec2 centerToFragment =
    (vec2(0.5, 0.5) - viewportUv) *
    vec2(safeViewportSize.x / safeViewportSize.y, 1.0);
  vec3 fortCityLight = normalize(vec3(
    centerToFragment * uTerrainCameraLightHorizontalPull,
    uTerrainCameraLightHeight
  ));
  float directionalLight = clamp(dot(cameraNormal, fortCityLight), 0.0, 1.0);
  float cameraFill = smoothstep(-0.18, 0.62, cameraNormal.z) * 0.010;
  float backShadow = 1.0 - smoothstep(0.08, 0.46, directionalLight);
  float steepShadow = smoothstep(0.08, 0.36, 1.0 - normal.z);
  float reliefShade = clamp(
    1.0 +
      directionalLight * uTerrainDirectionalLightStrength -
      backShadow * uTerrainBackShadowStrength * 1.08 -
      steepShadow * uTerrainSteepShadowStrength,
    0.44,
    1.04
  );
  float light = clamp(uAmbient + directionalLight * uDirectional + cameraFill, 0.40, 0.92) * reliefShade;
  vec3 shadedColor = clamp(vColor * light, 0.0, 1.0);
  gl_FragColor = vec4(shadedColor, 1.0);
}
