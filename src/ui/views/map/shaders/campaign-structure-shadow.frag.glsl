precision mediump float;

uniform float uOpacity;

varying vec2 vUv;

void main() {
  vec2 p = vUv;
  float radius = dot(p, p);
  float softBody = 1.0 - smoothstep(0.28, 1.0, radius);
  float contactCore = 1.0 - smoothstep(0.00, 0.22, dot(p * vec2(0.92, 1.18), p * vec2(0.92, 1.18)));
  float edgeFade = 1.0 - smoothstep(0.58, 1.0, radius);
  float alpha = (softBody * 0.34 + contactCore * 0.22) * edgeFade * uOpacity;

  gl_FragColor = vec4(0.006, 0.018, 0.006, alpha);
}
