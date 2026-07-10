precision mediump float;
uniform vec3 uLight;
uniform sampler2D uTexture;
uniform vec3 uTint;
uniform float uForceOpaqueAlpha;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
  vec3 normal = normalize(vNormal);
  float directionalLight = max(dot(normal, normalize(uLight)), 0.0);
  float light = 0.42 + directionalLight * 0.58;
  vec3 rim = vec3(0.16, 0.12, 0.08) * pow(1.0 - max(normal.z, 0.0), 2.0);
  vec4 base = texture2D(uTexture, vUv);
  if (base.a < 0.08) {
    discard;
  }
  vec3 color = base.rgb * uTint;
  float alpha = uForceOpaqueAlpha > 0.5 ? 1.0 : base.a;
  gl_FragColor = vec4(color * light + rim, alpha);
}
