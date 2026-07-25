attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec3 aColor;
attribute vec3 aInstanceCenter;
attribute vec2 aInstanceRotation;
attribute float aInstanceWorldScale;
attribute float aInstanceLift;
attribute float aInstanceColorJitter;

uniform mat4 uMatrix;
uniform vec2 uTerrainCameraTiltSinCos;

varying vec3 vNormal;
varying vec3 vCameraNormal;
varying vec3 vColor;

void main() {
  float rotationCos = aInstanceRotation.x;
  float rotationSin = aInstanceRotation.y;
  vec3 localPosition = aPosition * aInstanceWorldScale;
  vec3 worldPosition = vec3(
    aInstanceCenter.x + localPosition.x * rotationCos - localPosition.y * rotationSin,
    aInstanceCenter.y + localPosition.x * rotationSin + localPosition.y * rotationCos,
    aInstanceCenter.z + localPosition.z + aInstanceLift
  );
  vec3 normal = normalize(vec3(
    aNormal.x * rotationCos - aNormal.y * rotationSin,
    aNormal.x * rotationSin + aNormal.y * rotationCos,
    aNormal.z
  ));
  float tiltSin = uTerrainCameraTiltSinCos.x;
  float tiltCos = uTerrainCameraTiltSinCos.y;
  vNormal = normal;
  vCameraNormal = normalize(vec3(
    normal.x,
    normal.y * tiltCos - normal.z * tiltSin,
    normal.y * tiltSin + normal.z * tiltCos
  ));
  vColor = clamp(aColor * aInstanceColorJitter, 0.0, 1.0);
  gl_Position = uMatrix * vec4(worldPosition, 1.0);
}
