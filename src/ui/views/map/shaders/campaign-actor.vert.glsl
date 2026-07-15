attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aUv;
uniform mat4 uMatrix;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
  vNormal = aNormal;
  vUv = aUv;
  gl_Position = uMatrix * vec4(aPosition, 1.0);
}
