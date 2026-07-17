attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec3 aColor;

uniform mat4 uMatrix;
uniform vec2 uTerrainCameraTiltSinCos;

varying vec3 vNormal;
varying vec3 vCameraNormal;
varying vec3 vColor;

void main() {
  vec3 normal = normalize(aNormal);
  float tiltSin = uTerrainCameraTiltSinCos.x;
  float tiltCos = uTerrainCameraTiltSinCos.y;
  vNormal = normal;
  vCameraNormal = normalize(vec3(
    normal.x,
    normal.y * tiltCos - normal.z * tiltSin,
    normal.y * tiltSin + normal.z * tiltCos
  ));
  vColor = aColor;
  gl_Position = uMatrix * vec4(aPosition, 1.0);
}
