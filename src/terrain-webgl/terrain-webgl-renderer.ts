export type TerrainRenderInput = {
  canvas: HTMLCanvasElement;
  heights: Float32Array;
  mask: Uint8Array;
  width: number;
  height: number;
  minElevation: number;
  maxElevation: number;
};

type MeshData = {
  vertices: Float32Array;
  indices: Uint32Array;
};

type Mat4 = Float32Array;

function readMatrixValue(matrix: Mat4, index: number): number {
  return matrix[index] ?? 0;
}

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type);
  if (shader == null) {
    throw new Error("Failed to allocate WebGL shader.");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? "Unknown shader compile error.";
    gl.deleteShader(shader);
    throw new Error(message);
  }

  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexSource: string,
  fragmentSource: string
): WebGLProgram {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();

  if (program == null) {
    throw new Error("Failed to allocate WebGL program.");
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) ?? "Unknown WebGL link error.";
    gl.deleteProgram(program);
    throw new Error(message);
  }

  return program;
}

function multiplyMatrices(left: Mat4, right: Mat4): Mat4 {
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

function createPerspectiveMatrix(
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

function createTranslationMatrix(x: number, y: number, z: number): Mat4 {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1,
  ]);
}

function createRotationXMatrix(angleRadians: number): Mat4 {
  const cosine = Math.cos(angleRadians);
  const sine = Math.sin(angleRadians);

  return new Float32Array([
    1, 0, 0, 0,
    0, cosine, sine, 0,
    0, -sine, cosine, 0,
    0, 0, 0, 1,
  ]);
}

function createRotationZMatrix(angleRadians: number): Mat4 {
  const cosine = Math.cos(angleRadians);
  const sine = Math.sin(angleRadians);

  return new Float32Array([
    cosine, sine, 0, 0,
    -sine, cosine, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]);
}

function createScaleMatrix(x: number, y: number, z: number): Mat4 {
  return new Float32Array([
    x, 0, 0, 0,
    0, y, 0, 0,
    0, 0, z, 0,
    0, 0, 0, 1,
  ]);
}

function createTerrainMesh(input: {
  heights: Float32Array;
  mask: Uint8Array;
  width: number;
  height: number;
  minElevation: number;
  maxElevation: number;
}): MeshData {
  const { heights, mask, width, height, minElevation, maxElevation } = input;
  const vertices = new Float32Array(width * height * 4);
  const indices: number[] = [];
  const elevationRange = Math.max(maxElevation - minElevation, 1);
  const xHalfSpan = (width - 1) / 2;
  const yHalfSpan = (height - 1) / 2;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const sampleIndex = y * width + x;
      const heightValue = heights[sampleIndex] ?? minElevation;
      const normalizedHeight = (heightValue - minElevation) / elevationRange;
      const vertexOffset = sampleIndex * 4;

      vertices[vertexOffset] = (x - xHalfSpan) / Math.max(width - 1, 1);
      vertices[vertexOffset + 1] = (y - yHalfSpan) / Math.max(height - 1, 1);
      vertices[vertexOffset + 2] = normalizedHeight;
      vertices[vertexOffset + 3] = (mask[sampleIndex] ?? 0) === 0 ? -1 : normalizedHeight;
    }
  }

  for (let y = 0; y < height - 1; y += 1) {
    for (let x = 0; x < width - 1; x += 1) {
      const topLeft = y * width + x;
      const topRight = topLeft + 1;
      const bottomLeft = topLeft + width;
      const bottomRight = bottomLeft + 1;

      if (
        (mask[topLeft] ?? 0) === 1 &&
        (mask[bottomLeft] ?? 0) === 1 &&
        (mask[topRight] ?? 0) === 1
      ) {
        indices.push(topLeft, bottomLeft, topRight);
      }

      if (
        (mask[topRight] ?? 0) === 1 &&
        (mask[bottomLeft] ?? 0) === 1 &&
        (mask[bottomRight] ?? 0) === 1
      ) {
        indices.push(topRight, bottomLeft, bottomRight);
      }
    }
  }

  return {
    vertices,
    indices: new Uint32Array(indices),
  };
}

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): void {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.floor(canvas.clientWidth * pixelRatio);
  const height = Math.floor(canvas.clientHeight * pixelRatio);

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
}

export function renderTerrainWithWebGl(input: TerrainRenderInput): () => void {
  const gl = input.canvas.getContext("webgl");
  if (gl == null) {
    throw new Error("This browser does not support WebGL.");
  }

  const vertexSource = `
    attribute vec4 aVertex;
    uniform mat4 uMatrix;
    varying float vHeight;

    void main() {
      vec3 position = vec3(aVertex.xy, aVertex.z * 0.55);
      gl_Position = uMatrix * vec4(position, 1.0);
      vHeight = aVertex.w;
    }
  `;

  const fragmentSource = `
    precision mediump float;
    varying float vHeight;

    vec3 getTerrainColor(float t) {
      vec3 sea = vec3(0.08, 0.19, 0.27);
      vec3 plain = vec3(0.28, 0.48, 0.24);
      vec3 hill = vec3(0.52, 0.42, 0.24);
      vec3 peak = vec3(0.92, 0.91, 0.86);

      if (t < 0.32) {
        return mix(sea, plain, t / 0.32);
      }

      if (t < 0.72) {
        return mix(plain, hill, (t - 0.32) / 0.40);
      }

      return mix(hill, peak, (t - 0.72) / 0.28);
    }

    void main() {
      float shade = 0.72 + max(vHeight, 0.0) * 0.45;
      gl_FragColor = vec4(getTerrainColor(max(vHeight, 0.0)) * shade, 1.0);
    }
  `;

  const program = createProgram(gl, vertexSource, fragmentSource);
  const mesh = createTerrainMesh(input);
  const vertexBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();

  if (vertexBuffer == null || indexBuffer == null) {
    throw new Error("Failed to allocate WebGL buffers.");
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);

  const vertexLocation = gl.getAttribLocation(program, "aVertex");
  const matrixLocation = gl.getUniformLocation(program, "uMatrix");

  if (vertexLocation < 0 || matrixLocation == null) {
    throw new Error("Failed to resolve WebGL program locations.");
  }

  gl.useProgram(program);
  gl.enableVertexAttribArray(vertexLocation);
  gl.vertexAttribPointer(vertexLocation, 4, gl.FLOAT, false, 16, 0);
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.02, 0.04, 0.08, 1);

  let animationFrameId = 0;
  let disposed = false;

  const draw = (timeMs: number) => {
    if (disposed) {
      return;
    }

    resizeCanvasToDisplaySize(input.canvas);
    gl.viewport(0, 0, input.canvas.width, input.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const aspectRatio = Math.max(input.canvas.width / Math.max(input.canvas.height, 1), 1);
    const projection = createPerspectiveMatrix(Math.PI / 3, aspectRatio, 0.1, 10);
    const translation = createTranslationMatrix(0, -0.08, -2.1);
    const rotationX = createRotationXMatrix(-1.05);
    const rotationZ = createRotationZMatrix(timeMs * 0.00006);
    const scale = createScaleMatrix(1.8, 1.2, 1.4);
    const matrix = multiplyMatrices(
      projection,
      multiplyMatrices(
        translation,
        multiplyMatrices(rotationX, multiplyMatrices(rotationZ, scale))
      )
    );

    gl.uniformMatrix4fv(matrixLocation, false, matrix);
    gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_INT, 0);
    animationFrameId = window.requestAnimationFrame(draw);
  };

  const uintExtension = gl.getExtension("OES_element_index_uint");
  if (uintExtension == null) {
    throw new Error("This browser cannot draw the terrain mesh index buffer.");
  }

  animationFrameId = window.requestAnimationFrame(draw);

  return () => {
    disposed = true;
    window.cancelAnimationFrame(animationFrameId);
    gl.deleteBuffer(vertexBuffer);
    gl.deleteBuffer(indexBuffer);
    gl.deleteProgram(program);
  };
}
