precision mediump float;

uniform float uOpacity;

varying vec2 vUv;

void main() {
  float along = clamp(vUv.x, 0.0, 1.0);
  float lateral = abs(vUv.y);
  float trunkAttach = 1.0 - smoothstep(0.0, 0.18, along);
  float bodyWidth = mix(0.22, 1.0, smoothstep(0.02, 0.28, along));
  bodyWidth *= mix(1.0, 0.42, smoothstep(0.62, 1.0, along));
  float lateralSoftness = 1.0 - smoothstep(bodyWidth * 0.62, bodyWidth, lateral);
  float endFade = 1.0 - smoothstep(0.72, 1.0, along);
  float rootContact = trunkAttach * (1.0 - smoothstep(0.18, 0.64, lateral)) * 1.08;
  float strip = lateralSoftness * endFade * 1.26;
  float alpha = max(rootContact, strip) * uOpacity;
  gl_FragColor = vec4(0.008, 0.024, 0.008, alpha);
}
