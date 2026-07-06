attribute vec3 aPosition;
attribute vec2 aUv;
uniform mat4 uMatrix;
varying vec2 vUv;
varying float vHeight;
varying vec2 vTerrainPosition;

void main() {
  vUv = aUv;
  vHeight = aPosition.z / __HEIGHT_SCALE__;
  vTerrainPosition = aPosition.xy;
  gl_Position = uMatrix * vec4(aPosition, 1.0);
}
