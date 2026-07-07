import fallbackCloudNoiseTextureUrl from "../../../assets/yuanmo-map/yuanmo-fog-noise.png?url";
import cloudFragmentShaderRaw from "./shaders/campaign-cloud.frag.glsl?raw";
import cloudVertexShaderRaw from "./shaders/campaign-cloud.vert.glsl?raw";

const CLOUD_ANIMATION_FRAME_INTERVAL_MS = 1000 / 24;

type CampaignCloudRenderer = {
  canvas: HTMLCanvasElement;
  dispose: () => void;
};

const activeCloudRenderers = new Map<HTMLCanvasElement, CampaignCloudRenderer>();
const pendingCloudRendererCanvases = new Set<HTMLCanvasElement>();

export function syncCampaignCloudWebGl(root: ParentNode): void {
  const canvases = Array.from(
    root.querySelectorAll<HTMLCanvasElement>("[data-campaign-map-cloud]")
  );
  const nextCanvasSet = new Set(canvases);

  for (const [canvas, renderer] of activeCloudRenderers.entries()) {
    if (!nextCanvasSet.has(canvas)) {
      renderer.dispose();
      activeCloudRenderers.delete(canvas);
    }
  }
  for (const canvas of Array.from(pendingCloudRendererCanvases)) {
    if (!nextCanvasSet.has(canvas) || !canvas.isConnected) {
      pendingCloudRendererCanvases.delete(canvas);
    }
  }

  for (const canvas of canvases) {
    if (
      activeCloudRenderers.has(canvas) ||
      pendingCloudRendererCanvases.has(canvas)
    ) {
      continue;
    }

    pendingCloudRendererCanvases.add(canvas);
    try {
      const renderer = initCampaignCloudWebGl(canvas);
      if (!nextCanvasSet.has(canvas) || !canvas.isConnected) {
        renderer.dispose();
        continue;
      }

      activeCloudRenderers.set(canvas, renderer);
      canvas.classList.remove("has-error");
      canvas.classList.add("is-ready");
    } catch (error) {
      console.error("Failed to render campaign cloud WebGL overlay.", error);
      canvas.classList.add("has-error");
    } finally {
      pendingCloudRendererCanvases.delete(canvas);
    }
  }
}

function initCampaignCloudWebGl(
  canvas: HTMLCanvasElement
): CampaignCloudRenderer {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    depth: false,
    preserveDrawingBuffer: false,
  });
  if (gl == null) {
    throw new Error("This browser does not support WebGL.");
  }

  const program = createProgram(gl, cloudVertexShaderRaw, cloudFragmentShaderRaw);
  const positionLocation = gl.getAttribLocation(program, "aPosition");
  const resolutionLocation = gl.getUniformLocation(program, "uResolution");
  const timeSecondsLocation = gl.getUniformLocation(program, "uTimeSeconds");
  const noiseTextureLocation = gl.getUniformLocation(program, "uNoiseTexture");
  const vertexBuffer = gl.createBuffer();
  const noiseTexture = createPlaceholderTexture(gl);
  const missingResources = [
    positionLocation < 0 ? "aPosition" : null,
    resolutionLocation == null ? "uResolution" : null,
    timeSecondsLocation == null ? "uTimeSeconds" : null,
    noiseTextureLocation == null ? "uNoiseTexture" : null,
    vertexBuffer == null ? "vertexBuffer" : null,
  ].filter((resource): resource is string => resource != null);
  if (missingResources.length > 0) {
    throw new Error(
      `Failed to initialize campaign cloud WebGL resources: ${missingResources.join(", ")}.`
    );
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      1, 1,
    ]),
    gl.STATIC_DRAW
  );
  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const cloudNoiseTextureUrl =
    canvas.dataset.mapCloudNoiseUrl ?? fallbackCloudNoiseTextureUrl;

  let frameId: number | null = null;
  let animationTimeoutId: number | null = null;
  let isDisposed = false;

  loadImage(cloudNoiseTextureUrl)
    .then((image) => {
      if (isDisposed) {
        return;
      }

      updateTexture(gl, noiseTexture, image);
      requestRender();
    })
    .catch((error: unknown) => {
      console.warn("Failed to load campaign cloud noise texture.", error);
    });

  const render = () => {
    if (isDisposed) {
      return;
    }

    frameId = null;
    resizeCanvasToDisplaySize(canvas);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform1f(timeSecondsLocation, performance.now() * 0.001);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, noiseTexture);
    gl.uniform1i(noiseTextureLocation, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    scheduleAnimationRender();
  };

  const requestRender = () => {
    if (isDisposed || frameId != null) {
      return;
    }

    frameId = window.requestAnimationFrame(render);
  };

  const scheduleAnimationRender = () => {
    if (isDisposed || animationTimeoutId != null || frameId != null) {
      return;
    }

    animationTimeoutId = window.setTimeout(() => {
      animationTimeoutId = null;
      requestRender();
    }, CLOUD_ANIMATION_FRAME_INTERVAL_MS);
  };

  const handleResize = () => {
    requestRender();
  };

  requestRender();
  window.addEventListener("resize", handleResize);

  return {
    canvas,
    dispose: () => {
      isDisposed = true;
      if (frameId != null) {
        window.cancelAnimationFrame(frameId);
      }
      if (animationTimeoutId != null) {
        window.clearTimeout(animationTimeoutId);
      }

      window.removeEventListener("resize", handleResize);
      gl.deleteBuffer(vertexBuffer);
      gl.deleteTexture(noiseTexture);
      gl.deleteProgram(program);
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

function createPlaceholderTexture(gl: WebGLRenderingContext): WebGLTexture {
  const texture = gl.createTexture();
  if (texture == null) {
    throw new Error("Failed to allocate campaign cloud noise texture.");
  }

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([180, 180, 180, 255])
  );
  setCloudNoiseTextureParameters(gl);

  return texture;
}

function updateTexture(
  gl: WebGLRenderingContext,
  texture: WebGLTexture,
  image: TexImageSource
): void {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  setCloudNoiseTextureParameters(gl);
}

function setCloudNoiseTextureParameters(gl: WebGLRenderingContext): void {
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
}

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): void {
  const rect = canvas.getBoundingClientRect();
  const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.round(rect.width * devicePixelRatio));
  const height = Math.max(1, Math.round(rect.height * devicePixelRatio));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
}

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type);
  if (shader == null) {
    throw new Error("Failed to create campaign cloud shader.");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader) ?? "Unknown shader compile error.";
    gl.deleteShader(shader);
    throw new Error(info);
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
    throw new Error("Failed to create campaign cloud WebGL program.");
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program) ?? "Unknown program link error.";
    gl.deleteProgram(program);
    throw new Error(info);
  }

  return program;
}
