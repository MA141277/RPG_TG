attribute vec3 aPosition;
attribute vec2 aUv;
attribute vec3 aNormal;
uniform mat4 uMatrix;
uniform float uHeightScale;
uniform vec2 uTerrainCameraTiltSinCos;
varying vec2 vUv;
varying float vHeight;
varying vec3 vNormal;
varying vec3 vCameraNormal;
varying vec2 vTerrainPosition;

void main() {
  vUv = aUv;
  vHeight = aPosition.z / uHeightScale;
  vNormal = normalize(aNormal);
  float tiltSin = uTerrainCameraTiltSinCos.x;
  float tiltCos = uTerrainCameraTiltSinCos.y;
  vCameraNormal = normalize(vec3(
    aNormal.x,
    aNormal.y * tiltCos - aNormal.z * tiltSin,
    aNormal.y * tiltSin + aNormal.z * tiltCos
  ));
  vTerrainPosition = aPosition.xy;
  gl_Position = uMatrix * vec4(aPosition, 1.0);
}
