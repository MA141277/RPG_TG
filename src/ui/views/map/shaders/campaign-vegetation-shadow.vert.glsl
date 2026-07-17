attribute vec3 aPosition;
attribute vec2 aUv;

uniform mat4 uMatrix;

varying vec2 vUv;

void main() {
  vUv = aUv;
  gl_Position = uMatrix * vec4(aPosition, 1.0);
}
