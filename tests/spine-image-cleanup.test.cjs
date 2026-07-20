const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const source = fs.readFileSync("tools/spine-node-timeline-editor.html", "utf8");

function extractFunctionBody(signature) {
  const start = source.indexOf(signature);
  if (start === -1) {
    throw new Error(`Missing signature: ${signature}`);
  }
  const paramsStart = source.indexOf("(", start);
  let paramsDepth = 0;
  let bodyStart = -1;
  for (let index = paramsStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "(") paramsDepth += 1;
    if (char === ")") {
      paramsDepth -= 1;
      if (paramsDepth === 0) {
        bodyStart = source.indexOf("{", index);
        break;
      }
    }
  }
  if (bodyStart === -1) {
    throw new Error(`Missing function body for: ${signature}`);
  }
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(bodyStart + 1, index);
      }
    }
  }
  throw new Error(`Unclosed function body for: ${signature}`);
}

function compileCleanupFns() {
  class ImageDataShim {
    constructor(dataOrWidth, width, height) {
      if (typeof dataOrWidth === "number") {
        this.width = dataOrWidth;
        this.height = width;
        this.data = new Uint8ClampedArray(this.width * this.height * 4);
        return;
      }
      this.data = dataOrWidth;
      this.width = width;
      this.height = height;
    }
  }

  const state = {
    imageCleanup: {
      enabled: true,
      backgroundMode: "white",
      tolerance: 28,
      customColor: "#ffffff",
      edgeRepair: true,
      alphaShrink: true,
      supersample: true,
      curveRebuild: false,
    },
  };

  const createOpaqueMask = new Function(
    `return function createOpaqueMask(imageData, alphaThreshold = 16) {${extractFunctionBody(
      "function createOpaqueMask(imageData, alphaThreshold = 16)",
    )}};`,
  )();

  const dilateMask = new Function(
    `return function dilateMask(mask, width, height, steps, limitMask = null) {${extractFunctionBody(
      "function dilateMask(mask, width, height, steps, limitMask = null)",
    )}};`,
  )();

  const cloneImageData = new Function(
    "ImageData",
    "Uint8ClampedArray",
    `return function cloneImageData(imageData) {${extractFunctionBody("function cloneImageData(imageData)")}};`,
  )(ImageDataShim, Uint8ClampedArray);

  const hexToRgbColor = new Function(
    `return function hexToRgbColor(hex) {${extractFunctionBody("function hexToRgbColor(hex)")}};`,
  )();

  const resolveImageCleanupBackgroundColor = new Function(
    "state",
    "hexToRgbColor",
    `return function resolveImageCleanupBackgroundColor(options = state.imageCleanup) {${extractFunctionBody(
      "function resolveImageCleanupBackgroundColor(options = state.imageCleanup)",
    )}};`,
  )(state, hexToRgbColor);

  const normalizedImageCleanupOptions = new Function(
    "state",
    `return function normalizedImageCleanupOptions(overrides = {}) {${extractFunctionBody(
      "function normalizedImageCleanupOptions(overrides = {})",
    )}};`,
  )(state);

  const colorDistanceToBackground = new Function(
    `return function colorDistanceToBackground(r, g, b, backgroundColor) {${extractFunctionBody(
      "function colorDistanceToBackground(r, g, b, backgroundColor)",
    )}};`,
  )();

  const backgroundMatchesCleanupColor = new Function(
    `return function backgroundMatchesCleanupColor(r, g, b, backgroundColor, tolerance, mode = "custom") {${extractFunctionBody(
      'function backgroundMatchesCleanupColor(r, g, b, backgroundColor, tolerance, mode = "custom")',
    )}};`,
  )();

  const fourNeighborIndices = new Function(
    `return function fourNeighborIndices(index, width, height) {${extractFunctionBody(
      "function fourNeighborIndices(index, width, height)",
    )}};`,
  )();

  const clearImageDataPixel = new Function(
    `return function clearImageDataPixel(imageData, index) {${extractFunctionBody(
      "function clearImageDataPixel(imageData, index)",
    )}};`,
  )();

  const averageOpaqueRgbFromImageData = new Function(
    `return function averageOpaqueRgbFromImageData(imageData) {${extractFunctionBody(
      "function averageOpaqueRgbFromImageData(imageData)",
    )}};`,
  )();

  const countTransparentNeighbors = new Function(
    "fourNeighborIndices",
    `return function countTransparentNeighbors(mask, index, width, height) {${extractFunctionBody(
      "function countTransparentNeighbors(mask, index, width, height)",
    )}};`,
  )(fourNeighborIndices);

  const sampleNearestCleanOpaqueColor = new Function(
    "countTransparentNeighbors",
    "backgroundMatchesCleanupColor",
    `return function sampleNearestCleanOpaqueColor(imageData, mask, x, y, backgroundColor, tolerance, mode = "custom", maxRadius = 8) {${extractFunctionBody(
      'function sampleNearestCleanOpaqueColor(',
    )}};`,
  )(countTransparentNeighbors, backgroundMatchesCleanupColor);

  const pushColorAwayFromBackground = new Function(
    `return function pushColorAwayFromBackground(color, backgroundColor, fallbackColor) {${extractFunctionBody(
      "function pushColorAwayFromBackground(color, backgroundColor, fallbackColor)",
    )}};`,
  )();

  const floodRemoveCornerConnectedBackground = new Function(
    "cloneImageData",
    "normalizedImageCleanupOptions",
    "resolveImageCleanupBackgroundColor",
    "backgroundMatchesCleanupColor",
    "clearImageDataPixel",
    "fourNeighborIndices",
    `return function floodRemoveCornerConnectedBackground(sourceImageData, options = {}) {${extractFunctionBody(
      "function floodRemoveCornerConnectedBackground(sourceImageData, options = {})",
    )}};`,
  )(
    cloneImageData,
    normalizedImageCleanupOptions,
    resolveImageCleanupBackgroundColor,
    backgroundMatchesCleanupColor,
    clearImageDataPixel,
    fourNeighborIndices,
  );

  const detectOpaqueComponentsFromImageData = new Function(
    "createOpaqueMask",
    "Uint8Array",
    "fourNeighborIndices",
    `return function detectOpaqueComponentsFromImageData(imageData, minPixels = 1, alphaThreshold = 16) {${extractFunctionBody(
      "function detectOpaqueComponentsFromImageData(imageData, minPixels = 1, alphaThreshold = 16)",
    )}};`,
  )(createOpaqueMask, Uint8Array, fourNeighborIndices);

  const repairTransparentEdgeBleed = new Function(
    "normalizedImageCleanupOptions",
    "resolveImageCleanupBackgroundColor",
    "cloneImageData",
    "createOpaqueMask",
    "averageOpaqueRgbFromImageData",
    "countTransparentNeighbors",
    "backgroundMatchesCleanupColor",
    "colorDistanceToBackground",
    "sampleNearestCleanOpaqueColor",
    "pushColorAwayFromBackground",
    `return function repairTransparentEdgeBleed(sourceImageData, options = {}) {${extractFunctionBody(
      "function repairTransparentEdgeBleed(sourceImageData, options = {})",
    )}};`,
  )(
    normalizedImageCleanupOptions,
    resolveImageCleanupBackgroundColor,
    cloneImageData,
    createOpaqueMask,
    averageOpaqueRgbFromImageData,
    countTransparentNeighbors,
    backgroundMatchesCleanupColor,
    colorDistanceToBackground,
    sampleNearestCleanOpaqueColor,
    pushColorAwayFromBackground,
  );

  const shrinkAndSmoothAlphaEdge = new Function(
    "cloneImageData",
    "createOpaqueMask",
    "countTransparentNeighbors",
    `return function shrinkAndSmoothAlphaEdge(sourceImageData) {${extractFunctionBody(
      "function shrinkAndSmoothAlphaEdge(sourceImageData)",
    )}};`,
  )(cloneImageData, createOpaqueMask, countTransparentNeighbors);

  const supersampleAlphaEdge = new Function(
    "cloneImageData",
    "createOpaqueMask",
    "countTransparentNeighbors",
    `return function supersampleAlphaEdge(sourceImageData) {${extractFunctionBody(
      "function supersampleAlphaEdge(sourceImageData)",
    )}};`,
  )(cloneImageData, createOpaqueMask, countTransparentNeighbors);

  const erodeMask = new Function(
    "fourNeighborIndices",
    `return function erodeMask(mask, width, height, steps = 1) {${extractFunctionBody(
      "function erodeMask(mask, width, height, steps = 1)",
    )}};`,
  )(fourNeighborIndices);

  const rebuildCurveEdges = new Function(
    "normalizedImageCleanupOptions",
    "resolveImageCleanupBackgroundColor",
    "createOpaqueMask",
    "dilateMask",
    "erodeMask",
    "cloneImageData",
    "averageOpaqueRgbFromImageData",
    "clearImageDataPixel",
    "sampleNearestCleanOpaqueColor",
    "shrinkAndSmoothAlphaEdge",
    "supersampleAlphaEdge",
    `return function rebuildCurveEdges(sourceImageData, options = {}) {${extractFunctionBody(
      "function rebuildCurveEdges(sourceImageData, options = {})",
    )}};`,
  )(
    normalizedImageCleanupOptions,
    resolveImageCleanupBackgroundColor,
    createOpaqueMask,
    dilateMask,
    erodeMask,
    cloneImageData,
    averageOpaqueRgbFromImageData,
    clearImageDataPixel,
    sampleNearestCleanOpaqueColor,
    shrinkAndSmoothAlphaEdge,
    supersampleAlphaEdge,
  );

  const preprocessImportedImageData = new Function(
    "normalizedImageCleanupOptions",
    "cloneImageData",
    "floodRemoveCornerConnectedBackground",
    "repairTransparentEdgeBleed",
    "shrinkAndSmoothAlphaEdge",
    "supersampleAlphaEdge",
    "rebuildCurveEdges",
    "clearImageDataPixel",
    "detectOpaqueComponentsFromImageData",
    `return function preprocessImportedImageData(sourceImageData, options = {}) {${extractFunctionBody(
      "function preprocessImportedImageData(sourceImageData, options = {})",
    )}};`,
  )(
    normalizedImageCleanupOptions,
    cloneImageData,
    floodRemoveCornerConnectedBackground,
    repairTransparentEdgeBleed,
    shrinkAndSmoothAlphaEdge,
    supersampleAlphaEdge,
    rebuildCurveEdges,
    clearImageDataPixel,
    detectOpaqueComponentsFromImageData,
  );

  return {
    ImageDataShim,
    floodRemoveCornerConnectedBackground,
    detectOpaqueComponentsFromImageData,
    repairTransparentEdgeBleed,
    preprocessImportedImageData,
  };
}

function createImageData(width, height, fill = [0, 0, 0, 0]) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let index = 0; index < width * height; index += 1) {
    data[index * 4] = fill[0];
    data[index * 4 + 1] = fill[1];
    data[index * 4 + 2] = fill[2];
    data[index * 4 + 3] = fill[3];
  }
  const { ImageDataShim } = compileCleanupFns();
  return new ImageDataShim(data, width, height);
}

function setPixel(imageData, x, y, rgba) {
  const offset = (y * imageData.width + x) * 4;
  imageData.data[offset] = rgba[0];
  imageData.data[offset + 1] = rgba[1];
  imageData.data[offset + 2] = rgba[2];
  imageData.data[offset + 3] = rgba[3];
}

function getPixel(imageData, x, y) {
  const offset = (y * imageData.width + x) * 4;
  return [
    imageData.data[offset],
    imageData.data[offset + 1],
    imageData.data[offset + 2],
    imageData.data[offset + 3],
  ];
}

test("corner-connected flood background removal clears outer white background but keeps enclosed same-color interior islands", () => {
  const { floodRemoveCornerConnectedBackground } = compileCleanupFns();
  const imageData = createImageData(5, 5, [255, 255, 255, 255]);
  for (let y = 1; y <= 3; y += 1) {
    for (let x = 1; x <= 3; x += 1) {
      setPixel(imageData, x, y, [180, 40, 40, 255]);
    }
  }
  setPixel(imageData, 2, 2, [255, 255, 255, 255]);

  const cleaned = floodRemoveCornerConnectedBackground(imageData, {
    enabled: true,
    backgroundMode: "white",
    tolerance: 8,
  });

  assert.equal(getPixel(cleaned, 0, 0)[3], 0);
  assert.equal(getPixel(cleaned, 4, 4)[3], 0);
  assert.deepEqual(getPixel(cleaned, 2, 2), [255, 255, 255, 255]);
});

test("imported image preprocessing splits disconnected opaque blocks after background removal", () => {
  const { preprocessImportedImageData } = compileCleanupFns();
  const imageData = createImageData(8, 4, [255, 255, 255, 255]);
  for (let y = 1; y <= 2; y += 1) {
    for (let x = 1; x <= 2; x += 1) setPixel(imageData, x, y, [200, 40, 40, 255]);
    for (let x = 5; x <= 6; x += 1) setPixel(imageData, x, y, [40, 80, 200, 255]);
  }

  const processed = preprocessImportedImageData(imageData, {
    enabled: true,
    backgroundMode: "white",
    tolerance: 10,
    edgeRepair: false,
    alphaShrink: false,
    supersample: false,
    curveRebuild: false,
  });

  assert.equal(getPixel(processed.imageData, 0, 0)[3], 0);
  assert.equal(processed.components.length, 2);
  assert.deepEqual(
    processed.components.map((component) => component.count).sort((a, b) => a - b),
    [4, 4],
  );
});

test("edge bleed repair repaints near-white contaminated edge pixels from nearby opaque colors", () => {
  const { repairTransparentEdgeBleed } = compileCleanupFns();
  const imageData = createImageData(5, 5, [0, 0, 0, 0]);
  for (let y = 1; y <= 3; y += 1) {
    for (let x = 1; x <= 3; x += 1) {
      setPixel(imageData, x, y, [190, 32, 32, 255]);
    }
  }
  setPixel(imageData, 1, 2, [248, 240, 240, 255]);

  const repaired = repairTransparentEdgeBleed(imageData, {
    enabled: true,
    backgroundMode: "white",
    tolerance: 18,
  });
  const [r, g, b] = getPixel(repaired, 1, 2);

  assert.ok(r >= 180);
  assert.ok(g < 180);
  assert.ok(b < 180);
});

test("spine editor exposes single-piece cleanup controls in binding mode and applies cleanup through the selected piece action", () => {
  assert.match(source, /id="imageCleanupEnabledInput"/);
  assert.match(source, /id="imageCleanupBackgroundModeSelect"/);
  assert.match(source, /id="imageCleanupToleranceInput"/);
  assert.match(source, /id="imageCleanupCustomColorInput"/);
  assert.match(source, /id="cleanSelectedPieceImageBtn"/);
  assert.match(source, /function normalizeImageCleanupMetadata\(cleanup = null\)/);
  assert.match(source, /function cleanupSelectedPieceImage\(\)/);
  assert.match(source, /const processed = preprocessImportedImageData\(imageToImageData\(sourceImage\), state\.imageCleanup\);/);
  assert.match(source, /cleanup:\s*\{\s*sourceImageKey:\s*imageKey,/);
  assert.match(source, /sourceSrc:\s*sourceCustomImage\?\.src \|\| ""/);
  assert.match(source, /registerCustomImage\(id,\s*item\.name \|\| id,\s*item\.src,\s*\{\s*unitType,\s*cleanup:\s*item\.cleanup\s*\}\);/);
  assert.match(source, /replacePieceImageReferences\(piece,\s*imageKey,\s*customImageId\);/);
  assert.match(source, /function preprocessImportedImageData\(sourceImageData,\s*options = \{\}\)/);
});
