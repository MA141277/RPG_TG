type CampaignTerrainInput = {
  canvas: HTMLCanvasElement;
  textureUrl: string;
  heightUrl: string;
  materialUrl: string;
};

type MeshData = {
  vertices: Float32Array;
  indices: Uint16Array;
};

type Mat4 = Float32Array;

const GRID_COLUMNS = 128;
const GRID_ROWS = 96;
const HEIGHT_SCALE = 0.27;
const TERRAIN_SCALE = 1.46;
const CAMERA_TILT_RADIANS = -0.82;
const CAMERA_BASE_DISTANCE = 2.72;
const CAMERA_OFFSET_UNIT = 0.0032;
const FOV_RADIANS = 38 * Math.PI / 180;

type CampaignTerrainCamera = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

let activeRenderer: (() => void) | null = null;
let activeCanvas: HTMLCanvasElement | null = null;
let activeRender: (() => void) | null = null;
let activeProjectionInput: {
  canvas: HTMLCanvasElement;
  heights: Float32Array;
  columns: number;
  rows: number;
} | null = null;
let currentCamera: CampaignTerrainCamera = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
};

export function setCampaignTerrainCamera(camera: CampaignTerrainCamera): void {
  currentCamera = camera;
  activeRender?.();
  if (activeProjectionInput != null) {
    syncProjectedPoints(activeProjectionInput);
  }
}

export function syncCampaignTerrainWebGl(root: ParentNode): void {
  const canvas = root.querySelector<HTMLCanvasElement>("[data-campaign-map-terrain]");
  if (canvas == null) {
    disposeCampaignTerrainWebGl();
    return;
  }

  if (canvas === activeCanvas) {
    return;
  }

  disposeCampaignTerrainWebGl();
  activeCanvas = canvas;

  const textureUrl = canvas.dataset.mapTextureUrl;
  const heightUrl = canvas.dataset.mapHeightUrl;
  const materialUrl = canvas.dataset.mapMaterialUrl;
  if (textureUrl == null || heightUrl == null || materialUrl == null) {
    return;
  }

  void initCampaignTerrainWebGl({
    canvas,
    textureUrl,
    heightUrl,
    materialUrl,
  }).then((dispose) => {
    if (activeCanvas !== canvas) {
      dispose();
      return;
    }

    activeRenderer = dispose;
    canvas.classList.add("is-ready");
  }).catch((error: unknown) => {
    console.error("Failed to render campaign terrain WebGL map.", error);
    canvas.classList.add("has-error");
  });
}

function disposeCampaignTerrainWebGl(): void {
  if (activeRenderer != null) {
    activeRenderer();
    activeRenderer = null;
  }

  activeCanvas = null;
  activeRender = null;
  activeProjectionInput = null;
}

async function initCampaignTerrainWebGl(input: CampaignTerrainInput): Promise<() => void> {
  const gl = input.canvas.getContext("webgl", {
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: false,
  });
  if (gl == null) {
    throw new Error("This browser does not support WebGL.");
  }

  const derivativesExtension = gl.getExtension("OES_standard_derivatives");
  if (derivativesExtension == null) {
    throw new Error("This browser does not support terrain derivative shading.");
  }

  const [textureImage, heightImage, materialImage] = await Promise.all([
    loadImage(input.textureUrl),
    loadImage(input.heightUrl),
    loadImage(input.materialUrl),
  ]);
  const heightSamples = sampleHeightImage(heightImage, GRID_COLUMNS, GRID_ROWS);
  const mesh = createTerrainMesh(heightSamples, GRID_COLUMNS, GRID_ROWS);
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
  const positionLocation = gl.getAttribLocation(program, "aPosition");
  const uvLocation = gl.getAttribLocation(program, "aUv");
  const matrixLocation = gl.getUniformLocation(program, "uMatrix");
  const textureLocation = gl.getUniformLocation(program, "uTexture");
  const materialTextureLocation = gl.getUniformLocation(program, "uMaterialTexture");
  const lightLocation = gl.getUniformLocation(program, "uLight");
  const vertexBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();
  const texture = createTexture(gl, textureImage);
  const materialTexture = createTexture(gl, materialImage);

  if (
    positionLocation < 0 ||
    uvLocation < 0 ||
    matrixLocation == null ||
    textureLocation == null ||
    materialTextureLocation == null ||
    lightLocation == null ||
    vertexBuffer == null ||
    indexBuffer == null
  ) {
    throw new Error("Failed to initialize campaign terrain WebGL resources.");
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);
  gl.enable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);
  activeProjectionInput = {
    canvas: input.canvas,
    heights: heightSamples,
    columns: GRID_COLUMNS,
    rows: GRID_ROWS,
  };

  let frameId: number | null = null;
  const render = () => {
    resizeCanvasToDisplaySize(input.canvas);
    gl.viewport(0, 0, input.canvas.width, input.canvas.height);
    gl.clearColor(0.02, 0.04, 0.04, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(textureLocation, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, materialTexture);
    gl.uniform1i(materialTextureLocation, 1);
    gl.uniform3f(lightLocation, -0.92, 0.28, 0.36);
    gl.uniformMatrix4fv(
      matrixLocation,
      false,
      createTerrainMatrix(input.canvas.width / Math.max(input.canvas.height, 1))
    );

    const stride = 5 * Float32Array.BYTES_PER_ELEMENT;
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(uvLocation);
    gl.vertexAttribPointer(
      uvLocation,
      2,
      gl.FLOAT,
      false,
      stride,
      3 * Float32Array.BYTES_PER_ELEMENT
    );
    gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);
  };
  activeRender = render;

  render();
  syncProjectedPoints(activeProjectionInput);
  frameId = window.requestAnimationFrame(render);
  window.addEventListener("resize", render);

  return () => {
    if (frameId != null) {
      window.cancelAnimationFrame(frameId);
    }

    window.removeEventListener("resize", render);
    gl.deleteBuffer(vertexBuffer);
    gl.deleteBuffer(indexBuffer);
    gl.deleteTexture(texture);
    gl.deleteTexture(materialTexture);
    gl.deleteProgram(program);
    if (activeRender === render) {
      activeRender = null;
    }
  };
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      reject(new Error(`Failed to load image "${url}".`));
    };
    image.src = url;
  });
}

function sampleHeightImage(
  image: HTMLImageElement,
  columns: number,
  rows: number
): Float32Array {
  const canvas = document.createElement("canvas");
  canvas.width = columns;
  canvas.height = rows;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (context == null) {
    throw new Error("Failed to create heightmap sampling context.");
  }

  context.drawImage(image, 0, 0, columns, rows);
  const data = context.getImageData(0, 0, columns, rows).data;
  const heights = new Float32Array(columns * rows);

  for (let index = 0; index < heights.length; index += 1) {
    const pixelOffset = index * 4;
    const red = data[pixelOffset] ?? 0;
    const green = data[pixelOffset + 1] ?? red;
    const blue = data[pixelOffset + 2] ?? red;
    heights[index] = getHeightFromHeightmapColor(red, green, blue);
  }

  return heights;
}

function getHeightFromHeightmapColor(red: number, green: number, blue: number): number {
  if (isWaterHeightColor(red, green, blue)) {
    return 0;
  }

  const luminance = (red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255;
  return Math.max(0, Math.min(luminance, 1));
}

function syncProjectedPoints(input: {
  canvas: HTMLCanvasElement;
  heights: Float32Array;
  columns: number;
  rows: number;
}): void {
  const stage = input.canvas.closest<HTMLElement>("[data-campaign-map-transform]");
  if (stage == null) {
    return;
  }

  const matrix = createTerrainMatrix(
    input.canvas.width / Math.max(input.canvas.height, 1)
  );
  const points = stage.querySelectorAll<HTMLElement>("[data-terrain-projected-point]");
  for (const point of points) {
    const u = Number(point.dataset.mapHeightU);
    const v = Number(point.dataset.mapHeightV);
    if (!Number.isFinite(u) || !Number.isFinite(v)) {
      continue;
    }

    const height = sampleHeightAt(input.heights, input.columns, input.rows, u, v);
    const worldPoint = createTerrainWorldPoint(u, v, height);
    const screenPoint = projectPoint(matrix, worldPoint);
    const left = ((screenPoint.x + 1) / 2) * 100;
    const bottom = ((screenPoint.y + 1) / 2) * 100;
    const perspectiveScale = Math.min(Math.max(1 / Math.max(screenPoint.w, 0.45), 0.58), 1.42);
    const depthLayer = Math.round((1 - screenPoint.y) * 100);
    point.style.setProperty(
      "--terrain-point-offset-x",
      "0px"
    );
    point.style.setProperty(
      "--terrain-point-offset-y",
      "0px"
    );
    point.style.setProperty("--terrain-point-left", `${left.toFixed(3)}%`);
    point.style.setProperty("--terrain-point-top", "auto");
    point.style.setProperty("--terrain-point-bottom", `${bottom.toFixed(3)}%`);
    point.style.setProperty("--terrain-point-perspective-scale", perspectiveScale.toFixed(3));
    point.style.zIndex = `${20 + depthLayer}`;
  }
}

function sampleHeightAt(
  heights: Float32Array,
  columns: number,
  rows: number,
  u: number,
  v: number
): number {
  const x = Math.min(Math.max(Math.round(u * (columns - 1)), 0), columns - 1);
  const y = Math.min(Math.max(Math.round(v * (rows - 1)), 0), rows - 1);
  return heights[y * columns + x] ?? 0;
}

function isWaterHeightColor(red: number, green: number, blue: number): boolean {
  return blue > 72 && blue > red * 1.35 && blue > green * 1.18;
}

function createTerrainMesh(
  heights: Float32Array,
  columns: number,
  rows: number
): MeshData {
  const vertices = new Float32Array(columns * rows * 5);
  const indices: number[] = [];

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      const index = y * columns + x;
      const offset = index * 5;
      const u = x / Math.max(columns - 1, 1);
      const v = y / Math.max(rows - 1, 1);
      const height = heights[index] ?? 0;

      vertices[offset] = (u - 0.5) * 2;
      vertices[offset + 1] = (0.5 - v) * 2;
      vertices[offset + 2] = height * HEIGHT_SCALE;
      vertices[offset + 3] = u;
      vertices[offset + 4] = v;
    }
  }

  for (let y = 0; y < rows - 1; y += 1) {
    for (let x = 0; x < columns - 1; x += 1) {
      const topLeft = y * columns + x;
      const topRight = topLeft + 1;
      const bottomLeft = topLeft + columns;
      const bottomRight = bottomLeft + 1;
      indices.push(topLeft, bottomLeft, topRight, topRight, bottomLeft, bottomRight);
    }
  }

  return {
    vertices,
    indices: new Uint16Array(indices),
  };
}

function createTexture(
  gl: WebGLRenderingContext,
  image: HTMLImageElement
): WebGLTexture {
  const texture = gl.createTexture();
  if (texture == null) {
    throw new Error("Failed to allocate campaign map texture.");
  }

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return texture;
}

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): void {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(Math.floor(canvas.clientWidth * pixelRatio), 1);
  const height = Math.max(Math.floor(canvas.clientHeight * pixelRatio), 1);

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
}

function createTerrainMatrix(aspectRatio: number): Mat4 {
  const safeScale = Math.max(currentCamera.scale, 0.1);
  const projection = createPerspectiveMatrix(FOV_RADIANS, aspectRatio, 0.1, 20);
  const translation = createTranslationMatrix(
    currentCamera.offsetX * CAMERA_OFFSET_UNIT / safeScale,
    -currentCamera.offsetY * CAMERA_OFFSET_UNIT / safeScale,
    -CAMERA_BASE_DISTANCE / safeScale
  );
  const tilt = createRotationXMatrix(CAMERA_TILT_RADIANS);
  const scale = createScaleMatrix(TERRAIN_SCALE, TERRAIN_SCALE, 1);

  return multiplyMatrices(
    projection,
    multiplyMatrices(translation, multiplyMatrices(tilt, scale))
  );
}

function createTerrainWorldPoint(
  u: number,
  v: number,
  height: number
): [number, number, number] {
  return [
    (u - 0.5) * 2,
    (0.5 - v) * 2,
    height * HEIGHT_SCALE,
  ];
}

function projectPoint(matrix: Mat4, point: [number, number, number]): {
  x: number;
  y: number;
  w: number;
} {
  const [x, y, z] = point;
  const clipX =
    readMatrixValue(matrix, 0) * x +
    readMatrixValue(matrix, 4) * y +
    readMatrixValue(matrix, 8) * z +
    readMatrixValue(matrix, 12);
  const clipY =
    readMatrixValue(matrix, 1) * x +
    readMatrixValue(matrix, 5) * y +
    readMatrixValue(matrix, 9) * z +
    readMatrixValue(matrix, 13);
  const clipW =
    readMatrixValue(matrix, 3) * x +
    readMatrixValue(matrix, 7) * y +
    readMatrixValue(matrix, 11) * z +
    readMatrixValue(matrix, 15);
  const safeW = Math.abs(clipW) < 0.0001 ? 1 : clipW;

  return {
    x: clipX / safeW,
    y: clipY / safeW,
    w: Math.abs(safeW),
  };
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
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

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

function readMatrixValue(matrix: Mat4, index: number): number {
  return matrix[index] ?? 0;
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

function createScaleMatrix(x: number, y: number, z: number): Mat4 {
  return new Float32Array([
    x, 0, 0, 0,
    0, y, 0, 0,
    0, 0, z,
    0,
    0, 0, 0, 1,
  ]);
}

const vertexShaderSource = `
  attribute vec3 aPosition;
  attribute vec2 aUv;
  uniform mat4 uMatrix;
  varying vec2 vUv;
  varying float vHeight;
  varying vec2 vTerrainPosition;

  void main() {
    vUv = aUv;
    vHeight = aPosition.z / ${HEIGHT_SCALE.toFixed(2)};
    vTerrainPosition = aPosition.xy;
    gl_Position = uMatrix * vec4(aPosition, 1.0);
  }
`;

const fragmentShaderSource = `
  #extension GL_OES_standard_derivatives : enable
  precision mediump float;
  uniform sampler2D uTexture;
  uniform sampler2D uMaterialTexture;
  uniform vec3 uLight;
  varying vec2 vUv;
  varying float vHeight;
  varying vec2 vTerrainPosition;

  float hash(vec2 point) {
    return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453);
  }

  float valueNoise(vec2 point) {
    vec2 cell = floor(point);
    vec2 local = fract(point);
    vec2 smoothLocal = local * local * (3.0 - 2.0 * local);

    float a = hash(cell);
    float b = hash(cell + vec2(1.0, 0.0));
    float c = hash(cell + vec2(0.0, 1.0));
    float d = hash(cell + vec2(1.0, 1.0));

    return mix(mix(a, b, smoothLocal.x), mix(c, d, smoothLocal.x), smoothLocal.y);
  }

  float colorDistance(vec3 left, vec3 right) {
    return distance(left, right);
  }

  float materialWeight(vec3 material, vec3 target, float radius) {
    return 1.0 - smoothstep(0.0, radius, colorDistance(material, target));
  }

  void main() {
    vec4 base = texture2D(uTexture, vUv);
    vec3 material = texture2D(uMaterialTexture, vUv).rgb;
    vec3 detail = texture2D(uMaterialTexture, vUv * 2.35).rgb;
    float materialLuma = dot(material, vec3(0.2126, 0.7152, 0.0722));
    float detailLuma = dot(detail, vec3(0.2126, 0.7152, 0.0722));
    float detailGrain = (detailLuma - 0.5) * 0.12;
    float water = step(0.1, material.b - max(material.r, material.g) * 0.72) * step(0.22, material.b);
    float forest = max(
      materialWeight(material, vec3(0.05, 0.30, 0.08), 0.30),
      materialWeight(material, vec3(0.10, 0.42, 0.12), 0.34)
    );
    float denseForest = forest * smoothstep(0.08, 0.34, material.g - max(material.r, material.b));
    float mountain = max(
      materialWeight(material, vec3(0.38, 0.30, 0.22), 0.32),
      materialWeight(material, vec3(0.48, 0.46, 0.42), 0.36)
    );
    float sand = max(
      materialWeight(material, vec3(0.72, 0.62, 0.28), 0.36),
      materialWeight(material, vec3(0.78, 0.70, 0.42), 0.38)
    );
    float plain = clamp(1.0 - max(max(water, forest), max(mountain, sand)), 0.0, 1.0);
    vec2 gradient = vec2(dFdx(vHeight), dFdy(vHeight)) * 5.8;
    vec3 normal = normalize(vec3(-gradient.x, -gradient.y, 0.62));
    float directionalLight = max(dot(normal, normalize(uLight)), 0.0);
    float sideShadow = clamp(0.62 + directionalLight * 0.42, 0.5, 1.06);
    float ridgeShadow = clamp(1.0 - length(gradient) * mix(1.35, 1.85, mountain), 0.6, 1.0);
    float grain = valueNoise(vTerrainPosition * mix(48.0, 118.0, mountain)) * mix(0.03, 0.085, mountain + forest);
    float fineGrain = valueNoise(vTerrainPosition * 168.0) * mix(0.014, 0.042, mountain + forest);
    float shade = sideShadow + vHeight * 0.1;
    vec3 color = base.rgb * shade * ridgeShadow;
    vec3 tint =
      plain * vec3(0.86, 1.10, 0.66) +
      forest * vec3(0.22, 1.08, 0.24) +
      mountain * vec3(0.58, 0.53, 0.44) +
      sand * vec3(1.30, 1.10, 0.58) +
      water * vec3(0.34, 0.62, 1.22);
    color *= mix(vec3(1.0), tint, 0.9);
    color *= 1.0 - forest * 0.08 - mountain * 0.22 + sand * 0.04;
    color *= 1.0 + detailGrain;
    color += vec3(grain + fineGrain);
    color = mix(color, color * vec3(0.48, 0.78, 0.42), denseForest * 0.72);
    color = mix(color, base.rgb * vec3(0.36, 0.62, 1.06) * shade, water * 0.82);
    color = mix(color, color * mix(vec3(0.58, 0.96, 0.52), vec3(0.78, 1.30, 0.62), materialLuma), forest * 0.42);
    color = mix(color, color * mix(vec3(0.58), vec3(1.28), materialLuma), mountain * 0.34);
    color = mix(color, color * mix(vec3(0.86, 0.76, 0.46), vec3(1.22, 1.08, 0.66), materialLuma), sand * 0.34);
    gl_FragColor = vec4(color, 1.0);
  }
`;
