/* global URL, HTMLCanvasElement, performance, requestAnimationFrame, cancelAnimationFrame, Image, window */

const SCENE_WIDTH = 2048;
const SCENE_HEIGHT = 1152;
const EDITOR_SCALE = 0.34;
const CLOTH_FRAME_DURATION = 47;
const CLOTH_FPS = 24;
const PARALLAX_MAX_X = 36;
const PARALLAX_MAX_Y = 20;
const PARALLAX_EASE = 0.09;

const asset = (fileName) =>
  new URL(`../../../ui/yuansu/开局ui/${fileName}`, import.meta.url).href;

const imageSources = {
  cloudMidGray: asset("cloud_mid_gray.png"),
  cloudLeftBottom: asset("cloud_left_bottom.png"),
  dragonGold: asset("dragon_gold.png"),
  emperorBackStatic: asset("opening_emperor_back_static_no_hem.png"),
  emperorBackHem: asset("opening_emperor_back_hem_cloth.png"),
  landscape: asset("landscape_city_mountain.png"),
  cloudRightMid: asset("cloud_right_mid.png"),
  cloudRightTop: asset("cloud_right_top.png"),
  boatFar01: asset("boat_far_01.png"),
  boatMid01: asset("boat_mid_01.png"),
  boatMid02: asset("boat_mid_02.png"),
  boatFar02: asset("boat_far_02.png"),
  monkBottomStatic: asset("img_v3_0212i_b3059506-4159-44f0-8999-76a1503c02dg.png"),
  cloakStatic: asset("opening_mid_cloak_static_no_hem.png"),
  cloakHem: asset("opening_mid_cloak_hem_cloth.png"),
  redFlagTop: asset("opening_red_flag_top.png"),
  redFlagBottom: asset("opening_red_flag_bottom.png"),
  title: asset("title_dazu_lizhizhuan.png"),
};

const sourcePx = (value) => value / EDITOR_SCALE;

const cloudLayers = [
  {
    image: "cloudMidGray",
    speed: sourcePx(1.2),
    bounds: [486, 176, 1386, 500],
    depth: 0.16,
  },
  {
    image: "cloudLeftBottom",
    speed: sourcePx(1.8),
    bounds: [1, 735, 929, 1146],
    depth: 0.44,
  },
  {
    image: "cloudRightMid",
    speed: sourcePx(1.3),
    bounds: [1386, 275, 2032, 513],
    depth: 0.22,
  },
];

const boatLayers = [
  {
    image: "boatFar01",
    driftX: sourcePx(-9),
    driftY: sourcePx(-1.8),
    duration: 34,
    phase: 0.05,
    depth: 0.32,
  },
  {
    image: "boatMid01",
    driftX: sourcePx(11),
    driftY: sourcePx(2.4),
    duration: 38,
    phase: 0.42,
    depth: 0.5,
  },
  {
    image: "boatMid02",
    driftX: sourcePx(5),
    driftY: sourcePx(-0.7),
    duration: 64,
    phase: 0.46,
    depth: 0.46,
  },
  {
    image: "boatFar02",
    driftX: sourcePx(-3),
    driftY: sourcePx(0.6),
    duration: 70,
    phase: 0.18,
    depth: 0.28,
  },
];

const clothLayers = [
  {
    image: "emperorBackHem",
    x: sourcePx(369.58),
    y: sourcePx(196.08 - 90),
    rows: 10,
    cols: 12,
    amplitude: sourcePx(1.9),
    verticalAmplitude: sourcePx(0.12),
    sag: sourcePx(0.55),
    topLooseness: 0.012,
    rightDownBias: 0.3,
    phaseOffset: 0.06,
    directionX: 1,
    directionY: 0,
    depth: 0.28,
  },
  {
    image: "cloakHem",
    x: sourcePx(527.34),
    y: sourcePx(311.68 - 90),
    rows: 10,
    cols: 10,
    amplitude: sourcePx(3.1),
    verticalAmplitude: sourcePx(0.08),
    sag: sourcePx(0.85),
    topLooseness: 0.035,
    rightDownBias: 0.4,
    phaseOffset: 0,
    directionX: 1,
    directionY: 0,
    depth: 1,
  },
  {
    image: "redFlagTop",
    x: sourcePx(651.78),
    y: sourcePx(299.44 - 90),
    rows: 8,
    cols: 9,
    amplitude: sourcePx(3.5),
    verticalAmplitude: sourcePx(0.04),
    sag: 0,
    weightMode: "left",
    leftLooseness: 0.025,
    phaseOffset: 0.08,
    directionX: 1,
    directionY: 0,
    depth: 1,
  },
  {
    image: "redFlagBottom",
    x: sourcePx(628.66),
    y: sourcePx(354.18 - 90),
    rows: 7,
    cols: 7,
    amplitude: sourcePx(2.85),
    verticalAmplitude: sourcePx(0.035),
    sag: 0,
    weightMode: "left",
    leftLooseness: 0.025,
    phaseOffset: 0.14,
    directionX: 1,
    directionY: 0,
    depth: 1,
  },
];

const dragonLayer = {
  image: "dragonGold",
  sourceBounds: [789, 62, 1772, 741],
  segments: 9,
  overlap: 22,
  period: 13,
  twist: 3.6,
  spawnX: -34,
  spawnY: -22,
  travelX: 46,
  travelY: 28,
  drillX: 30,
  drillY: -18,
  tailTwist: 5.5,
  tailDriftX: -4,
  tailDriftY: 6,
  depth: 0.34,
};

export function mountOpeningBackgroundAnimation(root) {
  const canvas = root.querySelector(".c-main-ui-opening-background-canvas");
  if (!(canvas instanceof HTMLCanvasElement)) {
    return () => {};
  }

  const context = canvas.getContext("2d", { alpha: false });
  if (context == null) {
    return () => {};
  }

  const images = loadImages(imageSources);
  const parallax = createParallaxState(root);
  const startTimes = {
    clouds: performance.now(),
    boats: performance.now(),
    dragon: performance.now(),
  };
  let frameId = 0;
  let destroyed = false;

  const render = () => {
    if (destroyed) return;
    resizeCanvas(canvas);
    updateParallax(parallax.state);
    drawScene(context, canvas, images, startTimes, parallax.state);
    frameId = requestAnimationFrame(render);
  };

  render();

  return () => {
    destroyed = true;
    parallax.destroy();
    cancelAnimationFrame(frameId);
  };
}

function createParallaxState(root) {
  const state = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  };
  const onPointerMove = (event) => {
    const rect = root.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    state.targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    state.targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  };
  const onPointerLeave = () => {
    state.targetX = 0;
    state.targetY = 0;
  };

  root.addEventListener("pointermove", onPointerMove, { passive: true });
  root.addEventListener("pointerleave", onPointerLeave, { passive: true });

  return {
    state,
    destroy: () => {
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
    },
  };
}

function updateParallax(state) {
  state.x += (state.targetX - state.x) * PARALLAX_EASE;
  state.y += (state.targetY - state.y) * PARALLAX_EASE;
}

function loadImages(sources) {
  return Object.fromEntries(
    Object.entries(sources).map(([key, src]) => {
      const image = new Image();
      image.decoding = "async";
      image.src = src;
      return [key, image];
    }),
  );
}

function resizeCanvas(canvas) {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
  const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
}

function drawScene(ctx, canvas, images, startTimes, parallax) {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const viewportWidth = canvas.width / dpr;
  const viewportHeight = canvas.height / dpr;
  const coverScale = Math.max(viewportWidth / SCENE_WIDTH, viewportHeight / SCENE_HEIGHT);
  const offsetX = (viewportWidth - SCENE_WIDTH * coverScale) * 0.5;
  const offsetY = (viewportHeight - SCENE_HEIGHT * coverScale) * 0.5;
  const now = performance.now();

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, viewportWidth, viewportHeight);
  ctx.fillStyle = "#FFFBF2";
  ctx.fillRect(0, 0, viewportWidth, viewportHeight);
  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(coverScale, coverScale);

  drawParallaxLayer(ctx, parallax, cloudLayers[0].depth, () =>
    drawCloud(ctx, images, cloudLayers[0], now, startTimes.clouds),
  );
  drawParallaxLayer(ctx, parallax, cloudLayers[1].depth, () =>
    drawCloud(ctx, images, cloudLayers[1], now, startTimes.clouds),
  );
  drawParallaxLayer(ctx, parallax, dragonLayer.depth, () =>
    drawDragon(ctx, images[dragonLayer.image], dragonLayer, now, startTimes.dragon),
  );
  drawParallaxLayer(ctx, parallax, 0.24, () => drawFullImage(ctx, images.emperorBackStatic));
  drawParallaxLayer(ctx, parallax, clothLayers[0].depth, () =>
    drawWindCloth(ctx, images.emperorBackHem, clothLayers[0], now),
  );
  drawParallaxLayer(ctx, parallax, 0.2, () => drawFullImage(ctx, images.landscape));
  drawParallaxLayer(ctx, parallax, cloudLayers[2].depth, () =>
    drawCloud(ctx, images, cloudLayers[2], now, startTimes.clouds),
  );
  drawParallaxLayer(ctx, parallax, 0.3, () => drawFullImage(ctx, images.cloudRightTop));
  boatLayers.forEach((layer) => {
    drawParallaxLayer(ctx, parallax, layer.depth, () => drawBoat(ctx, images, layer, now, startTimes.boats));
  });
  drawParallaxLayer(ctx, parallax, 0.92, () => drawFullImage(ctx, images.monkBottomStatic));
  drawParallaxLayer(ctx, parallax, 0.98, () => drawFullImage(ctx, images.cloakStatic));
  drawParallaxLayer(ctx, parallax, clothLayers[1].depth, () =>
    drawWindCloth(ctx, images.cloakHem, clothLayers[1], now),
  );
  drawParallaxLayer(ctx, parallax, clothLayers[2].depth, () =>
    drawWindCloth(ctx, images.redFlagTop, clothLayers[2], now),
  );
  drawParallaxLayer(ctx, parallax, clothLayers[3].depth, () =>
    drawWindCloth(ctx, images.redFlagBottom, clothLayers[3], now),
  );
  drawParallaxLayer(ctx, parallax, 0, () => drawFullImage(ctx, images.title));

  ctx.restore();
}

function drawParallaxLayer(ctx, parallax, depth, draw) {
  const offset = parallaxOffset(parallax, depth);
  ctx.save();
  ctx.translate(offset.x, offset.y);
  draw();
  ctx.restore();
}

function parallaxOffset(parallax, depth) {
  return {
    x: parallax.x * PARALLAX_MAX_X * depth,
    y: parallax.y * PARALLAX_MAX_Y * depth,
  };
}

function drawFullImage(ctx, image, x = 0, y = 0) {
  if (!isReady(image)) return;
  ctx.drawImage(image, x, y);
}

function drawCloud(ctx, images, layer, now, startTime) {
  const image = images[layer.image];
  if (!isReady(image)) return;
  drawFullImage(ctx, image, movingImageOffset(layer, now, startTime), 0);
}

function movingImageOffset(layer, now, startTime) {
  const bounds = layer.bounds;
  const start = -bounds[2];
  const end = SCENE_WIDTH - bounds[0];
  const span = Math.max(1, end - start);
  const seconds = (now - startTime) / 1000;
  return start + positiveModulo(seconds * layer.speed - start, span);
}

function drawBoat(ctx, images, layer, now, startTime) {
  const image = images[layer.image];
  if (!isReady(image)) return;
  const offset = placedDriftOffset(layer, now, startTime);
  drawFullImage(ctx, image, offset.x, offset.y);
}

function placedDriftOffset(layer, now, startTime) {
  const t = positiveModulo((now - startTime) / 1000 / layer.duration + layer.phase, 1);
  const raw = t <= 0.5 ? t * 2 : (1 - t) * 2;
  const eased = smoothEase(raw);
  return {
    x: layer.driftX * eased,
    y: layer.driftY * eased,
  };
}

function drawDragon(ctx, image, layer, now, startTime) {
  if (!isReady(image)) return;
  const bounds = layer.sourceBounds;
  const segmentCount = Math.max(3, Math.round(layer.segments));
  const segmentWidth = (bounds[2] - bounds[0]) / segmentCount;
  const cycle = (((now - startTime) / 1000) % layer.period) / layer.period;
  const appear = smoothStep(0.04, 0.16, cycle);
  const travel = cycle < 0.72 ? smoothStep(0.12, 0.72, cycle) : 1;
  const vanish = smoothStep(0.58, 0.78, cycle);
  const baseAlpha = appear * (1 - vanish);
  const spawnEase = 1 - smoothStep(0.04, 0.28, cycle);
  const globalX = layer.spawnX * spawnEase + layer.travelX * travel;
  const globalY = layer.spawnY * spawnEase + layer.travelY * travel;

  for (let index = 0; index < segmentCount; index += 1) {
    const u = index / Math.max(1, segmentCount - 1);
    const sourceX = Math.max(0, Math.floor(bounds[0] + segmentWidth * index - layer.overlap));
    const sourceRight = Math.min(image.width, Math.ceil(bounds[0] + segmentWidth * (index + 1) + layer.overlap));
    const sourceY = bounds[1];
    const sourceWidth = Math.max(1, sourceRight - sourceX);
    const sourceHeight = bounds[3] - bounds[1];
    const pivotX = sourceX + sourceWidth * 0.5;
    const pivotY = sourceY + sourceHeight * 0.5;
    const wave = Math.sin(cycle * Math.PI * 2 + u * Math.PI * 1.7);
    const weight = 0.35 + Math.sin(u * Math.PI) * 0.65;
    const tailWeight = Math.pow(Math.max(0, 1 - u / 0.34), 1.7);
    const tailWave = Math.sin(cycle * Math.PI * 2.8 + u * Math.PI * 2.4);
    const vanishLead = smoothStep(0.32 + (1 - u) * 0.22, 0.76 + (1 - u) * 0.12, cycle);
    const alpha = Math.max(0, Math.min(1, baseAlpha * (1 - vanishLead * 0.45)));
    const drillX = layer.drillX * vanishLead;
    const drillY = layer.drillY * vanishLead;
    const tailRotate = layer.tailTwist * tailWave * tailWeight * (1 - vanish * 0.55);
    const tailX = layer.tailDriftX * tailWave * tailWeight;
    const tailY = layer.tailDriftY * tailWave * tailWeight;
    const rotate = ((layer.twist * wave * weight * (1 - vanish * 0.45) + tailRotate) * Math.PI) / 180;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(pivotX + globalX + drillX + tailX, pivotY + globalY + drillY + tailY);
    ctx.rotate(rotate);
    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      -sourceWidth * 0.5,
      -sourceHeight * 0.5,
      sourceWidth,
      sourceHeight,
    );
    ctx.restore();
  }
}

function drawWindCloth(ctx, image, layer, now) {
  if (!isReady(image)) return;
  const mesh = buildWindClothMesh(image, layer, now);
  ctx.save();
  for (let row = 0; row < mesh.source.length - 1; row += 1) {
    for (let col = 0; col < mesh.source[row].length - 1; col += 1) {
      drawImageTriangle(
        ctx,
        image,
        mesh.source[row][col],
        mesh.source[row + 1][col],
        mesh.source[row][col + 1],
        mesh.dest[row][col],
        mesh.dest[row + 1][col],
        mesh.dest[row][col + 1],
      );
      drawImageTriangle(
        ctx,
        image,
        mesh.source[row + 1][col],
        mesh.source[row + 1][col + 1],
        mesh.source[row][col + 1],
        mesh.dest[row + 1][col],
        mesh.dest[row + 1][col + 1],
        mesh.dest[row][col + 1],
      );
    }
  }
  ctx.restore();
}

function buildWindClothMesh(image, layer, now) {
  const source = [];
  const dest = [];
  const motion = pingPongMotion(layer, now);
  for (let row = 0; row < layer.rows; row += 1) {
    const v = row / (layer.rows - 1);
    const sourceRow = [];
    const destRow = [];
    for (let col = 0; col < layer.cols; col += 1) {
      const u = col / (layer.cols - 1);
      const looseness =
        layer.weightMode === "left"
          ? layer.leftLooseness + (1 - layer.leftLooseness) * Math.pow(u, 1.35)
          : layer.topLooseness + (1 - layer.topLooseness) * Math.pow(v, 1.45);
      const rightDownBias = layer.rightDownBias || 0;
      const rightDownWeight = 1 + rightDownBias * u * Math.pow(v, 1.2);
      const clothWeight = looseness * rightDownWeight;
      sourceRow.push({
        x: image.width * u,
        y: image.height * v,
      });
      destRow.push({
        x: layer.x + image.width * u + motion.swing * layer.amplitude * clothWeight,
        y:
          layer.y +
          image.height * v +
          layer.sag * clothWeight +
          motion.lift * layer.verticalAmplitude * clothWeight * 0.35,
      });
    }
    source.push(sourceRow);
    dest.push(destRow);
  }
  return { source, dest };
}

function pingPongMotion(layer, now) {
  const elapsedFrames = (now / 1000) * CLOTH_FPS;
  const frame = elapsedFrames % CLOTH_FRAME_DURATION;
  const t = (frame / CLOTH_FRAME_DURATION + layer.phaseOffset) % 1;
  const raw = t <= 0.5 ? t * 2 : (1 - t) * 2;
  const eased = smoothEase(raw);
  return {
    swing: eased * layer.directionX,
    lift: eased * layer.directionY,
  };
}

function drawImageTriangle(ctx, image, s0, s1, s2, d0, d1, d2) {
  const denominator =
    s0.x * (s1.y - s2.y) + s1.x * (s2.y - s0.y) + s2.x * (s0.y - s1.y);
  if (Math.abs(denominator) < 0.001) return;
  const a =
    (d0.x * (s1.y - s2.y) + d1.x * (s2.y - s0.y) + d2.x * (s0.y - s1.y)) /
    denominator;
  const b =
    (d0.y * (s1.y - s2.y) + d1.y * (s2.y - s0.y) + d2.y * (s0.y - s1.y)) /
    denominator;
  const c =
    (d0.x * (s2.x - s1.x) + d1.x * (s0.x - s2.x) + d2.x * (s1.x - s0.x)) /
    denominator;
  const d =
    (d0.y * (s2.x - s1.x) + d1.y * (s0.x - s2.x) + d2.y * (s1.x - s0.x)) /
    denominator;
  const e =
    (d0.x * (s1.x * s2.y - s2.x * s1.y) +
      d1.x * (s2.x * s0.y - s0.x * s2.y) +
      d2.x * (s0.x * s1.y - s1.x * s0.y)) /
    denominator;
  const f =
    (d0.y * (s1.x * s2.y - s2.x * s1.y) +
      d1.y * (s2.x * s0.y - s0.x * s2.y) +
      d2.y * (s0.x * s1.y - s1.x * s0.y)) /
    denominator;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(d0.x, d0.y);
  ctx.lineTo(d1.x, d1.y);
  ctx.lineTo(d2.x, d2.y);
  ctx.closePath();
  ctx.clip();
  ctx.transform(a, b, c, d, e, f);
  ctx.drawImage(image, 0, 0);
  ctx.restore();
}

function isReady(image) {
  return image?.complete && image.naturalWidth > 0;
}

function smoothStep(edge0, edge1, value) {
  const t = Math.max(0, Math.min(1, (value - edge0) / Math.max(0.0001, edge1 - edge0)));
  return smoothEase(t);
}

function smoothEase(value) {
  return value * value * (3 - 2 * value);
}

function positiveModulo(value, modulo) {
  return ((value % modulo) + modulo) % modulo;
}
