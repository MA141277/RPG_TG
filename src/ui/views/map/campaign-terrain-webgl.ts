type CampaignTerrainInput = {
  canvas: HTMLCanvasElement;
  textureUrl: string;
  heightUrl: string;
  materialUrl: string;
  renderMode: "terrain" | "actor";
};

type MeshData = {
  vertices: Float32Array;
  indices: Uint16Array;
};

type ActorMeshData = {
  vertices: Float32Array;
  indices: Uint16Array;
};

type ActorBoneAsset = {
  name: string;
  parentIndex: number | null;
  localPosition: [number, number, number];
};

type ActorModelAsset = {
  scale: number;
  localBindPositions: Float32Array;
  bindNormals: Float32Array;
  uvs: Float32Array;
  indices: Uint16Array;
  vertexBoneIndices: Uint16Array;
  bones: ActorBoneAsset[];
  bindGlobalPositions: [number, number, number][];
  originOffset: [number, number, number];
  bounds: {
    min: [number, number, number];
    max: [number, number, number];
  };
};

type ActorAnimationClipAsset = {
  format: string;
  fps: number;
  numFrames: number;
  numAnimatedBones: number;
  animatedBoneNames: string[];
  rotations: number[][][];
  rootPositions: number[][];
  pelvisPositions: number[][];
};

type ActorAnimationSetAsset = {
  idle: ActorAnimationClipAsset;
  walk: ActorAnimationClipAsset;
};

type ActorAnimationPose = {
  globalRotations: [number, number, number, number][];
  globalPositions: [number, number, number][];
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
const ACTOR_REFERENCE_CAMERA_SCALE = 40;
const ACTOR_MODEL_BASE_SCALE = 0.011;
const ACTOR_MODEL_FACING_OFFSET_RADIANS = Math.PI / 2;
const IDENTITY_QUATERNION: [number, number, number, number] = [0, 0, 0, 1];

type CampaignTerrainCamera = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

type CampaignTerrainRenderer = {
  canvas: HTMLCanvasElement;
  dispose: () => void;
  render: () => void;
  requestRender: (reason?: "static" | "dynamic") => void;
  hasActorAsset: boolean;
  projectionInput: {
    canvas: HTMLCanvasElement;
    heights: Float32Array;
    columns: number;
    rows: number;
  };
};

type CampaignActorData = {
  u: number;
  v: number;
  facingDegrees: number;
  isMoving: boolean;
  modelUrl: string | null;
  textureUrl: string | null;
  idleAnimationUrl: string | null;
  walkAnimationUrl: string | null;
};

const activeRenderers = new Map<HTMLCanvasElement, CampaignTerrainRenderer>();

type CampaignTerrainProjectionInput = {
  canvas: HTMLCanvasElement;
  heights: Float32Array;
  columns: number;
  rows: number;
};

export type CampaignTerrainUvPoint = {
  u: number;
  v: number;
};

let currentCamera: CampaignTerrainCamera = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
};

export function requestCampaignTerrainRender(reason: "static" | "dynamic" = "dynamic"): void {
  for (const renderer of activeRenderers.values()) {
    renderer.requestRender(reason);
  }
}

export function setCampaignTerrainCamera(camera: CampaignTerrainCamera): void {
  currentCamera = camera;
  for (const renderer of activeRenderers.values()) {
    renderer.requestRender("static");
  }
}

export function resolveCampaignTerrainUvFromClientPosition(
  root: ParentNode,
  clientX: number,
  clientY: number
): CampaignTerrainUvPoint | null {
  const terrainCanvas = root.querySelector<HTMLCanvasElement>("[data-campaign-map-terrain]");
  if (terrainCanvas == null) {
    return null;
  }

  const renderer = activeRenderers.get(terrainCanvas);
  if (renderer == null) {
    return null;
  }

  const rect = terrainCanvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    return null;
  }

  const normalizedX = clamp((clientX - rect.left) / rect.width, 0, 1);
  const normalizedY = clamp((clientY - rect.top) / rect.height, 0, 1);
  const matrix = createTerrainMatrix(
    terrainCanvas.width / Math.max(terrainCanvas.height, 1)
  );
  const targetScreenX = normalizedX * 2 - 1;
  const targetScreenY = 1 - normalizedY * 2;

  return findNearestTerrainUvForScreenPoint(
    matrix,
    targetScreenX,
    targetScreenY,
    renderer.projectionInput.heights,
    renderer.projectionInput.columns,
    renderer.projectionInput.rows
  );
}

export function syncCampaignTerrainWebGl(root: ParentNode): void {
  const canvases = Array.from(
    root.querySelectorAll<HTMLCanvasElement>(
      "[data-campaign-map-terrain], [data-campaign-map-actor-layer]"
    )
  );
  const nextCanvasSet = new Set(canvases);

  for (const [canvas, renderer] of activeRenderers.entries()) {
    if (!nextCanvasSet.has(canvas)) {
      renderer.dispose();
      activeRenderers.delete(canvas);
    }
  }

  if (canvases.length === 0) {
    return;
  }

  for (const canvas of canvases) {
    if (activeRenderers.has(canvas)) {
      continue;
    }

    const textureUrl = canvas.dataset.mapTextureUrl;
    const heightUrl = canvas.dataset.mapHeightUrl;
    const materialUrl = canvas.dataset.mapMaterialUrl;
    const renderMode =
      canvas.dataset.campaignMapActorLayer === "true" ? "actor" : "terrain";
    if (textureUrl == null || heightUrl == null || materialUrl == null) {
      continue;
    }

    void initCampaignTerrainWebGl({
      canvas,
      textureUrl,
      heightUrl,
      materialUrl,
      renderMode,
    }).then((renderer) => {
      if (!nextCanvasSet.has(canvas) || !canvas.isConnected) {
        renderer.dispose();
        return;
      }

      activeRenderers.set(canvas, renderer);
      canvas.classList.add("is-ready");
      canvas.classList.toggle("has-actor-model", renderer.hasActorAsset);
    }).catch((error: unknown) => {
      console.error("Failed to render campaign terrain WebGL map.", error);
      canvas.classList.add("has-error");
    });
  }
}

async function initCampaignTerrainWebGl(
  input: CampaignTerrainInput
): Promise<CampaignTerrainRenderer> {
  const renderTerrain = input.renderMode === "terrain";
  const shouldRenderActorInThisCanvas = input.renderMode === "actor";
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

  const actorAssetPromise = shouldRenderActorInThisCanvas
    ? loadCampaignActorAsset(input.canvas).catch((error: unknown) => {
      console.error("Failed to load campaign actor asset.", error);
      return null;
    })
    : Promise.resolve(null);
  const [textureImage, heightImage, materialImage, actorAsset] = await Promise.all([
    loadImage(input.textureUrl),
    loadImage(input.heightUrl),
    loadImage(input.materialUrl),
    actorAssetPromise,
  ]);
  const heightSamples = sampleHeightImage(heightImage, GRID_COLUMNS, GRID_ROWS);
  const mesh = createTerrainMesh(heightSamples, GRID_COLUMNS, GRID_ROWS);
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
  const actorProgram = createProgram(gl, actorVertexShaderSource, actorFragmentShaderSource);
  const positionLocation = gl.getAttribLocation(program, "aPosition");
  const uvLocation = gl.getAttribLocation(program, "aUv");
  const matrixLocation = gl.getUniformLocation(program, "uMatrix");
  const textureLocation = gl.getUniformLocation(program, "uTexture");
  const materialTextureLocation = gl.getUniformLocation(program, "uMaterialTexture");
  const lightLocation = gl.getUniformLocation(program, "uLight");
  const actorPositionLocation = gl.getAttribLocation(actorProgram, "aPosition");
  const actorNormalLocation = gl.getAttribLocation(actorProgram, "aNormal");
  const actorUvLocation = gl.getAttribLocation(actorProgram, "aUv");
  const actorMatrixLocation = gl.getUniformLocation(actorProgram, "uMatrix");
  const actorLightLocation = gl.getUniformLocation(actorProgram, "uLight");
  const actorTextureLocation = gl.getUniformLocation(actorProgram, "uTexture");
  const actorTintLocation = gl.getUniformLocation(actorProgram, "uTint");
  const vertexBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();
  const actorVertexBuffer = gl.createBuffer();
  const actorIndexBuffer = gl.createBuffer();
  const texture = createTexture(gl, textureImage);
  const materialTexture = createTexture(gl, materialImage);
  const actorTexture =
    actorAsset?.textureImage == null
      ? null
      : createTexture(gl, actorAsset.textureImage, {
        wrapS: gl.REPEAT,
        wrapT: gl.REPEAT,
      });

  if (
    positionLocation < 0 ||
    uvLocation < 0 ||
    matrixLocation == null ||
    textureLocation == null ||
    materialTextureLocation == null ||
    lightLocation == null ||
    actorPositionLocation < 0 ||
    actorNormalLocation < 0 ||
    actorUvLocation < 0 ||
    actorMatrixLocation == null ||
    actorLightLocation == null ||
    actorTextureLocation == null ||
    actorTintLocation == null ||
    vertexBuffer == null ||
    indexBuffer == null ||
    actorVertexBuffer == null ||
    actorIndexBuffer == null
  ) {
    throw new Error("Failed to initialize campaign terrain WebGL resources.");
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);
  gl.enable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);
  const projectionInput: CampaignTerrainProjectionInput = {
    canvas: input.canvas,
    heights: heightSamples,
    columns: GRID_COLUMNS,
    rows: GRID_ROWS,
  };

  let frameId: number | null = null;
  let isDisposed = false;
  let shouldAnimate = false;
  let hasPendingRender = false;
  let projectedPointsNeedSync = true;
  let lastActorSignature = "";
  let lastCanvasWidth = 0;
  let lastCanvasHeight = 0;
  const render = () => {
    if (isDisposed) {
      return;
    }

    frameId = null;
    hasPendingRender = false;
    resizeCanvasToDisplaySize(input.canvas);
    const resized =
      input.canvas.width !== lastCanvasWidth || input.canvas.height !== lastCanvasHeight;
    if (resized) {
      lastCanvasWidth = input.canvas.width;
      lastCanvasHeight = input.canvas.height;
      projectedPointsNeedSync = true;
    }
    gl.viewport(0, 0, input.canvas.width, input.canvas.height);
    gl.clearColor(renderTerrain ? 0.02 : 0, renderTerrain ? 0.04 : 0, renderTerrain ? 0.04 : 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (renderTerrain) {
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
    }

    const actor = readCampaignActorData(input.canvas);
    if (shouldRenderActorInThisCanvas && actor != null && actorAsset != null && actorTexture != null) {
      const actorSignature = [
        actor.u.toFixed(5),
        actor.v.toFixed(5),
        actor.facingDegrees.toFixed(2),
        actor.isMoving ? "1" : "0",
      ].join("|");
      if (actorSignature !== lastActorSignature) {
        projectedPointsNeedSync = true;
        lastActorSignature = actorSignature;
      }
      shouldAnimate = true;
      const actorHeight = sampleHeightAt(heightSamples, GRID_COLUMNS, GRID_ROWS, actor.u, actor.v);
      const actorMesh = createActorMesh(
        actor,
        actorHeight,
        actorAsset.model,
        actorAsset.animations
      );
      gl.useProgram(actorProgram);
      gl.bindBuffer(gl.ARRAY_BUFFER, actorVertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, actorMesh.vertices, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, actorIndexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, actorMesh.indices, gl.DYNAMIC_DRAW);
      const actorStride = 8 * Float32Array.BYTES_PER_ELEMENT;
      gl.enableVertexAttribArray(actorPositionLocation);
      gl.vertexAttribPointer(
        actorPositionLocation,
        3,
        gl.FLOAT,
        false,
        actorStride,
        0
      );
      gl.enableVertexAttribArray(actorNormalLocation);
      gl.vertexAttribPointer(
        actorNormalLocation,
        3,
        gl.FLOAT,
        false,
        actorStride,
        3 * Float32Array.BYTES_PER_ELEMENT
      );
      gl.enableVertexAttribArray(actorUvLocation);
      gl.vertexAttribPointer(
        actorUvLocation,
        2,
        gl.FLOAT,
        false,
        actorStride,
        6 * Float32Array.BYTES_PER_ELEMENT
      );
      gl.uniformMatrix4fv(
        actorMatrixLocation,
        false,
        createTerrainMatrix(input.canvas.width / Math.max(input.canvas.height, 1))
      );
      gl.uniform3f(actorLightLocation, -0.92, 0.28, 0.36);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, actorTexture);
      gl.uniform1i(actorTextureLocation, 0);
      gl.uniform3f(actorTintLocation, 1, 1, 1);
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.BACK);
      gl.drawElements(gl.TRIANGLES, actorMesh.indices.length, gl.UNSIGNED_SHORT, 0);
      gl.disable(gl.CULL_FACE);
    } else {
      shouldAnimate = false;
      if (lastActorSignature !== "") {
        projectedPointsNeedSync = true;
        lastActorSignature = "";
      }
    }

    if (renderTerrain && projectedPointsNeedSync) {
      syncProjectedPoints(projectionInput);
      projectedPointsNeedSync = false;
    }

    if (shouldAnimate) {
      requestRender("dynamic");
    }
  };

  const requestRender = (reason: "static" | "dynamic" = "dynamic") => {
    if (isDisposed) {
      return;
    }

    if (reason === "static") {
      projectedPointsNeedSync = true;
    }
    if (hasPendingRender) {
      return;
    }

    hasPendingRender = true;
    frameId = window.requestAnimationFrame(render);
  };
  const handleResize = () => {
    requestRender("static");
  };

  requestRender("static");
  window.addEventListener("resize", handleResize);

  return {
    canvas: input.canvas,
    render,
    requestRender,
    hasActorAsset: actorAsset != null && actorTexture != null,
    projectionInput,
    dispose: () => {
      isDisposed = true;
      if (frameId != null) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("resize", handleResize);
      gl.deleteBuffer(vertexBuffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteBuffer(actorVertexBuffer);
      gl.deleteBuffer(actorIndexBuffer);
      gl.deleteTexture(texture);
      gl.deleteTexture(materialTexture);
      if (actorTexture != null) {
        gl.deleteTexture(actorTexture);
      }
      gl.deleteProgram(program);
      gl.deleteProgram(actorProgram);
    },
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

async function loadJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load JSON "${url}" (${response.status}).`);
  }

  return response.json() as Promise<T>;
}

async function loadCampaignActorAsset(
  canvas: HTMLCanvasElement
): Promise<{ model: ActorModelAsset; textureImage: HTMLImageElement; animations: ActorAnimationSetAsset } | null> {
  const actor = readCampaignActorData(canvas);
  if (
    actor?.modelUrl == null ||
    actor.textureUrl == null ||
    actor.idleAnimationUrl == null ||
    actor.walkAnimationUrl == null
  ) {
    return null;
  }

  const [model, textureImage, idleAnimation, walkAnimation] = await Promise.all([
    loadJson<{
      scale?: number;
      positions: number[];
      normals: number[];
      uvs: number[];
      boneIndices: number[];
      indices: number[];
      origin: [number, number, number];
      bones: Array<{
        name: string;
        parentIndex: number | null;
        localPosition: [number, number, number];
      }>;
      bounds: {
        min: [number, number, number];
        max: [number, number, number];
      };
    }>(actor.modelUrl),
    loadImage(actor.textureUrl),
    loadJson<ActorAnimationClipAsset>(actor.idleAnimationUrl),
    loadJson<ActorAnimationClipAsset>(actor.walkAnimationUrl),
  ]);

  const bones = model.bones.map((bone) => ({
    name: bone.name,
    parentIndex: bone.parentIndex,
    localPosition: bone.localPosition,
  }));
  const bindGlobalPositions = computeActorGlobalBonePositions(bones);
  const vertexBoneIndices = new Uint16Array(model.boneIndices);
  const localBindPositions = new Float32Array(model.positions.length);
  const centeredBindGlobalPositions = bindGlobalPositions.map((position) => ([
    position[0] - (model.origin[0] ?? 0),
    position[1] - (model.origin[1] ?? 0),
    position[2] - (model.origin[2] ?? 0),
  ] as [number, number, number]));

  for (let vertexIndex = 0; vertexIndex < model.positions.length / 3; vertexIndex += 1) {
    const positionOffset = vertexIndex * 3;
    const boneIndex = vertexBoneIndices[vertexIndex] ?? 0;
    const bindBonePosition = centeredBindGlobalPositions[boneIndex] ?? [0, 0, 0];
    localBindPositions[positionOffset] = (model.positions[positionOffset] ?? 0) - bindBonePosition[0];
    localBindPositions[positionOffset + 1] =
      (model.positions[positionOffset + 1] ?? 0) - bindBonePosition[1];
    localBindPositions[positionOffset + 2] =
      (model.positions[positionOffset + 2] ?? 0) - bindBonePosition[2];
  }

  return {
    model: {
      scale: model.scale ?? 1,
      localBindPositions,
      bindNormals: new Float32Array(model.normals),
      uvs: new Float32Array(model.uvs),
      vertexBoneIndices,
      indices: new Uint16Array(model.indices),
      bones,
      bindGlobalPositions: centeredBindGlobalPositions,
      originOffset: [
        -(model.origin[0] ?? 0),
        -(model.origin[1] ?? 0),
        -(model.origin[2] ?? 0),
      ],
      bounds: model.bounds,
    },
    textureImage,
    animations: {
      idle: idleAnimation,
      walk: walkAnimation,
    },
  };
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
      point.removeAttribute("data-terrain-projection-ready");
      continue;
    }

    const height = sampleHeightAt(input.heights, input.columns, input.rows, u, v);
    const worldPoint = createTerrainWorldPoint(u, v, height);
    const screenPoint = projectPoint(matrix, worldPoint);
    const left = ((screenPoint.x + 1) / 2) * 100;
    const bottom = ((screenPoint.y + 1) / 2) * 100;
    const isVisible =
      screenPoint.w > 0 &&
      screenPoint.z >= -1 &&
      screenPoint.z <= 1 &&
      left >= 0 &&
      left <= 100 &&
      bottom >= 0 &&
      bottom <= 100;
    point.toggleAttribute("hidden", !isVisible);
    point.setAttribute("data-terrain-projection-ready", "true");
    if (!isVisible) {
      continue;
    }
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

function readCampaignActorData(canvas: HTMLCanvasElement): CampaignActorData | null {
  const stage = canvas.closest<HTMLElement>("[data-campaign-map-transform]");
  const playerElement = stage?.querySelector<HTMLElement>("[data-campaign-player='true']");
  if (playerElement == null) {
    return null;
  }

  const u = Number(playerElement.dataset.mapHeightU);
  const v = Number(playerElement.dataset.mapHeightV);
  if (!Number.isFinite(u) || !Number.isFinite(v)) {
    return null;
  }

  return {
    u,
    v,
    facingDegrees: Number(playerElement.dataset.campaignPlayerFacingDeg) || 0,
    isMoving: playerElement.dataset.campaignPlayerMoving === "true",
    modelUrl: playerElement.dataset.campaignPlayerModelUrl ?? null,
    textureUrl: playerElement.dataset.campaignPlayerTextureUrl ?? null,
    idleAnimationUrl: playerElement.dataset.campaignPlayerIdleAnimationUrl ?? null,
    walkAnimationUrl: playerElement.dataset.campaignPlayerWalkAnimationUrl ?? null,
  };
}

function createActorMesh(
  actor: CampaignActorData,
  height: number,
  model: ActorModelAsset,
  animations: ActorAnimationSetAsset
): ActorMeshData {
  const scaleCompensation = clamp(
    ACTOR_REFERENCE_CAMERA_SCALE / Math.max(currentCamera.scale, 0.0001),
    0.18,
    1.6
  );
  const angle =
    actor.facingDegrees * Math.PI / 180 +
    ACTOR_MODEL_FACING_OFFSET_RADIANS;
  const activeClip = actor.isMoving ? animations.walk : animations.idle;
  const sampledPose = sampleActorAnimationPose(
    activeClip,
    model.bones,
    model.originOffset,
    performance.now()
  );
  const center = createTerrainWorldPoint(
    actor.u,
    actor.v,
    height
  );
  const scale = ACTOR_MODEL_BASE_SCALE * model.scale * scaleCompensation;
  const localBindPositions = model.localBindPositions;
  const bindNormals = model.bindNormals;
  const uvs = model.uvs;
  const output = new Float32Array((localBindPositions.length / 3) * 8);
  const facingCos = Math.cos(angle);
  const facingSin = Math.sin(angle);
  for (let vertexIndex = 0; vertexIndex < localBindPositions.length / 3; vertexIndex += 1) {
    const positionOffset = vertexIndex * 3;
    const uvOffset = vertexIndex * 2;
    const outputOffset = vertexIndex * 8;
    const boneIndex = model.vertexBoneIndices[vertexIndex] ?? 0;
    const boneRotation = sampledPose.globalRotations[boneIndex] ?? IDENTITY_QUATERNION;
    const bonePosition = sampledPose.globalPositions[boneIndex] ?? [0, 0, 0];
    const animatedLocalPosition = rotateVectorByQuaternion([
      (localBindPositions[positionOffset] ?? 0) * scale,
      (localBindPositions[positionOffset + 1] ?? 0) * scale,
      (localBindPositions[positionOffset + 2] ?? 0) * scale,
    ], boneRotation);
    const animatedActorPosition: [number, number, number] = [
      bonePosition[0] * scale + animatedLocalPosition[0],
      bonePosition[1] * scale + animatedLocalPosition[1],
      bonePosition[2] * scale + animatedLocalPosition[2],
    ];
    const rotatedX =
      animatedActorPosition[0] * facingCos - animatedActorPosition[1] * facingSin;
    const rotatedY =
      animatedActorPosition[0] * facingSin + animatedActorPosition[1] * facingCos;
    const rotatedNormal = rotateVectorByQuaternion([
      bindNormals[positionOffset] ?? 0,
      bindNormals[positionOffset + 1] ?? 0,
      bindNormals[positionOffset + 2] ?? 1,
    ], boneRotation);
    const rotatedNormalX =
      rotatedNormal[0] * facingCos - rotatedNormal[1] * facingSin;
    const rotatedNormalY =
      rotatedNormal[0] * facingSin + rotatedNormal[1] * facingCos;

    output[outputOffset] = center[0] + rotatedX;
    output[outputOffset + 1] = center[1] + rotatedY;
    output[outputOffset + 2] = center[2] + animatedActorPosition[2];
    output[outputOffset + 3] = rotatedNormalX;
    output[outputOffset + 4] = rotatedNormalY;
    output[outputOffset + 5] = rotatedNormal[2];
    output[outputOffset + 6] = uvs[uvOffset] ?? 0;
    output[outputOffset + 7] = uvs[uvOffset + 1] ?? 0;
  }

  return {
    vertices: output,
    indices: model.indices,
  };
}

function computeActorGlobalBonePositions(bones: ActorBoneAsset[]): [number, number, number][] {
  const globalPositions = bones.map(() => [0, 0, 0] as [number, number, number]);
  for (let index = 0; index < bones.length; index += 1) {
    const bone = bones[index];
    if (bone == null) {
      continue;
    }

    if (bone.parentIndex == null) {
      globalPositions[index] = [...bone.localPosition];
      continue;
    }

    const parentPosition = globalPositions[bone.parentIndex] ?? [0, 0, 0];
    globalPositions[index] = [
      parentPosition[0] + bone.localPosition[0],
      parentPosition[1] + bone.localPosition[1],
      parentPosition[2] + bone.localPosition[2],
    ];
  }
  return globalPositions;
}

function sampleActorAnimationPose(
  clip: ActorAnimationClipAsset,
  bones: ActorBoneAsset[],
  originOffset: [number, number, number],
  timeMs: number
): ActorAnimationPose {
  const durationFrames = Math.max(clip.numFrames, 1);
  const frameFloat = ((timeMs / 1000) * Math.max(clip.fps, 0.001)) % durationFrames;
  const frameA = Math.floor(frameFloat) % durationFrames;
  const frameB = (frameA + 1) % durationFrames;
  const frameMix = frameFloat - Math.floor(frameFloat);
  const globalRotations = bones.map(() => [0, 0, 0, 1] as [number, number, number, number]);
  const globalPositions = bones.map(() => [0, 0, 0] as [number, number, number]);
  const firstRootPosition = clip.rootPositions[0] ?? [0, 0, 0];
  const sampledRootPosition = lerpVector3(
    clip.rootPositions[frameA] ?? firstRootPosition,
    clip.rootPositions[frameB] ?? firstRootPosition,
    frameMix
  );

  globalPositions[0] = [
    originOffset[0] ?? 0,
    originOffset[1] ?? 0,
    (originOffset[2] ?? 0) + sampledRootPosition[2] - (firstRootPosition[2] ?? 0),
  ];
  globalRotations[0] = [0, 0, 0, 1];

  for (let boneIndex = 1; boneIndex < bones.length; boneIndex += 1) {
    const bone = bones[boneIndex];
    if (bone == null) {
      continue;
    }

    const parentIndex = bone.parentIndex ?? 0;
    const localRotation = sampleClipQuaternion(clip, boneIndex - 1, frameA, frameB, frameMix);
    const parentRotation = globalRotations[parentIndex] ?? IDENTITY_QUATERNION;
    const parentPosition = globalPositions[parentIndex] ?? [0, 0, 0];
    const rotatedLocalPosition = rotateVectorByQuaternion(bone.localPosition, parentRotation);

    globalRotations[boneIndex] = normalizeQuaternion(
      multiplyQuaternions(parentRotation, localRotation)
    );
    globalPositions[boneIndex] = [
      parentPosition[0] + rotatedLocalPosition[0],
      parentPosition[1] + rotatedLocalPosition[1],
      parentPosition[2] + rotatedLocalPosition[2],
    ];
  }

  return {
    globalRotations,
    globalPositions,
  };
}

function sampleClipQuaternion(
  clip: ActorAnimationClipAsset,
  animatedBoneIndex: number,
  frameA: number,
  frameB: number,
  frameMix: number
): [number, number, number, number] {
  const frameARotation = clip.rotations[frameA]?.[animatedBoneIndex] ?? IDENTITY_QUATERNION;
  const frameBRotation = clip.rotations[frameB]?.[animatedBoneIndex] ?? frameARotation;
  return nlerpQuaternion(frameARotation, frameBRotation, frameMix);
}

function lerpVector3(
  from: number[],
  to: number[],
  amount: number
): [number, number, number] {
  return [
    (from[0] ?? 0) + ((to[0] ?? 0) - (from[0] ?? 0)) * amount,
    (from[1] ?? 0) + ((to[1] ?? 0) - (from[1] ?? 0)) * amount,
    (from[2] ?? 0) + ((to[2] ?? 0) - (from[2] ?? 0)) * amount,
  ];
}

function multiplyQuaternions(
  a: [number, number, number, number],
  b: [number, number, number, number]
): [number, number, number, number] {
  const [ax, ay, az, aw] = a;
  const [bx, by, bz, bw] = b;
  return [
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
    aw * bw - ax * bx - ay * by - az * bz,
  ];
}

function rotateVectorByQuaternion(
  vector: [number, number, number],
  quaternion: [number, number, number, number]
): [number, number, number] {
  const [x, y, z] = vector;
  const [qx, qy, qz, qw] = quaternion;
  const ix = qw * x + qy * z - qz * y;
  const iy = qw * y + qz * x - qx * z;
  const iz = qw * z + qx * y - qy * x;
  const iw = -qx * x - qy * y - qz * z;

  return [
    ix * qw + iw * -qx + iy * -qz - iz * -qy,
    iy * qw + iw * -qy + iz * -qx - ix * -qz,
    iz * qw + iw * -qz + ix * -qy - iy * -qx,
  ];
}

function normalizeQuaternion(input: number[]): [number, number, number, number] {
  const length =
    Math.hypot(input[0] ?? 0, input[1] ?? 0, input[2] ?? 0, input[3] ?? 0) ||
    1;
  return [
    (input[0] ?? 0) / length,
    (input[1] ?? 0) / length,
    (input[2] ?? 0) / length,
    (input[3] ?? 1) / length,
  ];
}

function nlerpQuaternion(
  from: number[],
  to: number[],
  amount: number
): [number, number, number, number] {
  const dot =
    (from[0] ?? 0) * (to[0] ?? 0) +
    (from[1] ?? 0) * (to[1] ?? 0) +
    (from[2] ?? 0) * (to[2] ?? 0) +
    (from[3] ?? 1) * (to[3] ?? 1);
  const sign = dot < 0 ? -1 : 1;
  return normalizeQuaternion([
    (from[0] ?? 0) + ((to[0] ?? 0) * sign - (from[0] ?? 0)) * amount,
    (from[1] ?? 0) + ((to[1] ?? 0) * sign - (from[1] ?? 0)) * amount,
    (from[2] ?? 0) + ((to[2] ?? 0) * sign - (from[2] ?? 0)) * amount,
    (from[3] ?? 1) + ((to[3] ?? 1) * sign - (from[3] ?? 1)) * amount,
  ]);
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

function rotateAroundXAxis(
  y: number,
  z: number,
  angle: number
): { y: number; z: number } {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  return {
    y: y * cosine - z * sine,
    z: y * sine + z * cosine,
  };
}

function createTexture(
  gl: WebGLRenderingContext,
  image: HTMLImageElement,
  options?: {
    wrapS?: number;
    wrapT?: number;
  }
): WebGLTexture {
  const texture = gl.createTexture();
  if (texture == null) {
    throw new Error("Failed to allocate campaign map texture.");
  }

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_WRAP_S,
    options?.wrapS ?? gl.CLAMP_TO_EDGE
  );
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_WRAP_T,
    options?.wrapT ?? gl.CLAMP_TO_EDGE
  );
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
  z: number;
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
  const clipZ =
    readMatrixValue(matrix, 2) * x +
    readMatrixValue(matrix, 6) * y +
    readMatrixValue(matrix, 10) * z +
    readMatrixValue(matrix, 14);
  const clipW =
    readMatrixValue(matrix, 3) * x +
    readMatrixValue(matrix, 7) * y +
    readMatrixValue(matrix, 11) * z +
    readMatrixValue(matrix, 15);
  const safeW = Math.abs(clipW) < 0.0001 ? 1 : clipW;

  return {
    x: clipX / safeW,
    y: clipY / safeW,
    z: clipZ / safeW,
    w: Math.abs(safeW),
  };
}

function findNearestTerrainUvForScreenPoint(
  matrix: Mat4,
  targetScreenX: number,
  targetScreenY: number,
  heights: Float32Array,
  columns: number,
  rows: number
): CampaignTerrainUvPoint | null {
  let bestPoint: CampaignTerrainUvPoint | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  const coarseColumns = 28;
  const coarseRows = 20;

  for (let row = 0; row <= coarseRows; row += 1) {
    const v = row / coarseRows;
    for (let column = 0; column <= coarseColumns; column += 1) {
      const u = column / coarseColumns;
      const distance = getScreenDistanceToTerrainPoint(
        matrix,
        targetScreenX,
        targetScreenY,
        u,
        v,
        heights,
        columns,
        rows
      );
      if (distance < bestDistance) {
        bestDistance = distance;
        bestPoint = { u, v };
      }
    }
  }

  if (bestPoint == null || !Number.isFinite(bestDistance)) {
    return null;
  }

  for (const radius of [0.12, 0.06, 0.03, 0.015, 0.0075]) {
    const center = bestPoint;
    for (let deltaV = -1; deltaV <= 1; deltaV += 1) {
      for (let deltaU = -1; deltaU <= 1; deltaU += 1) {
        const u = clamp(center.u + deltaU * radius, 0, 1);
        const v = clamp(center.v + deltaV * radius, 0, 1);
        const distance = getScreenDistanceToTerrainPoint(
          matrix,
          targetScreenX,
          targetScreenY,
          u,
          v,
          heights,
          columns,
          rows
        );
        if (distance < bestDistance) {
          bestDistance = distance;
          bestPoint = { u, v };
        }
      }
    }
  }

  return bestPoint;
}

function getScreenDistanceToTerrainPoint(
  matrix: Mat4,
  targetScreenX: number,
  targetScreenY: number,
  u: number,
  v: number,
  heights: Float32Array,
  columns: number,
  rows: number
): number {
  const height = sampleHeightAt(heights, columns, rows, u, v);
  const screenPoint = projectPoint(matrix, createTerrainWorldPoint(u, v, height));
  if (
    !Number.isFinite(screenPoint.x) ||
    !Number.isFinite(screenPoint.y) ||
    screenPoint.w <= 0 ||
    screenPoint.z < -1 ||
    screenPoint.z > 1
  ) {
    return Number.POSITIVE_INFINITY;
  }

  const deltaX = screenPoint.x - targetScreenX;
  const deltaY = screenPoint.y - targetScreenY;
  return Math.hypot(deltaX, deltaY);
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

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
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

const actorVertexShaderSource = `
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
`;

const actorFragmentShaderSource = `
  precision mediump float;
  uniform vec3 uLight;
  uniform sampler2D uTexture;
  uniform vec3 uTint;
  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
    vec3 normal = normalize(vNormal);
    float directionalLight = max(dot(normal, normalize(uLight)), 0.0);
    float light = 0.42 + directionalLight * 0.58;
    vec3 rim = vec3(0.16, 0.12, 0.08) * pow(1.0 - max(normal.z, 0.0), 2.0);
    vec4 base = texture2D(uTexture, vUv);
    if (base.a < 0.08) {
      discard;
    }
    vec3 color = base.rgb * uTint;
    gl_FragColor = vec4(color * light + rim, base.a);
  }
`;
