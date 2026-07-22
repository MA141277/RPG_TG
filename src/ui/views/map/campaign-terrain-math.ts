export type Mat4 = Float32Array;

export const IDENTITY_MATRIX_4 = new Float32Array([
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
]);

export function multiplyMatrices(left: Mat4, right: Mat4): Mat4 {
  const result = new Float32Array(16);

  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 4; column += 1) {
      result[column * 4 + row] =
        readMatrixValue(left, row) * readMatrixValue(right, column * 4) +
        readMatrixValue(left, 4 + row) * readMatrixValue(right, column * 4 + 1) +
        readMatrixValue(left, 8 + row) * readMatrixValue(right, column * 4 + 2) +
        readMatrixValue(left, 12 + row) * readMatrixValue(right, column * 4 + 3);
    }
  }

  return result;
}

export function invertMatrix4(matrix: Mat4): Mat4 {
  const m: [
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
  ] = [
    readMatrixValue(matrix, 0),
    readMatrixValue(matrix, 1),
    readMatrixValue(matrix, 2),
    readMatrixValue(matrix, 3),
    readMatrixValue(matrix, 4),
    readMatrixValue(matrix, 5),
    readMatrixValue(matrix, 6),
    readMatrixValue(matrix, 7),
    readMatrixValue(matrix, 8),
    readMatrixValue(matrix, 9),
    readMatrixValue(matrix, 10),
    readMatrixValue(matrix, 11),
    readMatrixValue(matrix, 12),
    readMatrixValue(matrix, 13),
    readMatrixValue(matrix, 14),
    readMatrixValue(matrix, 15),
  ];
  const inverse = new Float32Array(16);
  inverse[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] -
    m[9] * m[6] * m[15] + m[9] * m[7] * m[14] +
    m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
  inverse[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] +
    m[8] * m[6] * m[15] - m[8] * m[7] * m[14] -
    m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
  inverse[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] -
    m[8] * m[5] * m[15] + m[8] * m[7] * m[13] +
    m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
  inverse[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] +
    m[8] * m[5] * m[14] - m[8] * m[6] * m[13] -
    m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
  inverse[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] +
    m[9] * m[2] * m[15] - m[9] * m[3] * m[14] -
    m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
  inverse[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] -
    m[8] * m[2] * m[15] + m[8] * m[3] * m[14] +
    m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
  inverse[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] +
    m[8] * m[1] * m[15] - m[8] * m[3] * m[13] -
    m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
  inverse[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] -
    m[8] * m[1] * m[14] + m[8] * m[2] * m[13] +
    m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
  inverse[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] -
    m[5] * m[2] * m[15] + m[5] * m[3] * m[14] +
    m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
  inverse[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] +
    m[4] * m[2] * m[15] - m[4] * m[3] * m[14] -
    m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
  inverse[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] -
    m[4] * m[1] * m[15] + m[4] * m[3] * m[13] +
    m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
  inverse[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] +
    m[4] * m[1] * m[14] - m[4] * m[2] * m[13] -
    m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
  inverse[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] +
    m[5] * m[2] * m[11] - m[5] * m[3] * m[10] -
    m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
  inverse[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] -
    m[4] * m[2] * m[11] + m[4] * m[3] * m[10] +
    m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
  inverse[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] +
    m[4] * m[1] * m[11] - m[4] * m[3] * m[9] -
    m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
  inverse[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] -
    m[4] * m[1] * m[10] + m[4] * m[2] * m[9] +
    m[8] * m[1] * m[6] - m[8] * m[2] * m[5];

  const determinant =
    m[0] * readMatrixValue(inverse, 0) +
    m[1] * readMatrixValue(inverse, 4) +
    m[2] * readMatrixValue(inverse, 8) +
    m[3] * readMatrixValue(inverse, 12);
  if (Math.abs(determinant) <= 0.0000001) {
    return IDENTITY_MATRIX_4;
  }

  for (let index = 0; index < 16; index += 1) {
    inverse[index] = readMatrixValue(inverse, index) / determinant;
  }
  return inverse;
}

export function readMatrixValue(matrix: Mat4, index: number): number {
  return matrix[index] ?? 0;
}

export function easeOutCubic(value: number): number {
  const clampedValue = clamp(value, 0, 1);

  return 1 - (1 - clampedValue) ** 3;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function smoothstep(value: number): number {
  const clampedValue = clamp(value, 0, 1);
  return clampedValue * clampedValue * (3 - 2 * clampedValue);
}

export function createPerspectiveMatrix(
  fovRadians: number,
  aspectRatio: number,
  near: number,
  far: number
): Mat4 {
  const f = 1 / Math.tan(fovRadians / 2);
  const rangeInverse = 1 / (near - far);

  return new Float32Array([
    f / aspectRatio, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInverse, -1,
    0, 0, near * far * rangeInverse * 2, 0,
  ]);
}

export function createTranslationMatrix(x: number, y: number, z: number): Mat4 {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1,
  ]);
}

export function createRotationXMatrix(angleRadians: number): Mat4 {
  const cosine = Math.cos(angleRadians);
  const sine = Math.sin(angleRadians);

  return new Float32Array([
    1, 0, 0, 0,
    0, cosine, sine, 0,
    0, -sine, cosine, 0,
    0, 0, 0, 1,
  ]);
}

export function createScaleMatrix(x: number, y: number, z: number): Mat4 {
  return new Float32Array([
    x, 0, 0, 0,
    0, y, 0, 0,
    0, 0, z,
    0,
    0, 0, 0, 1,
  ]);
}
