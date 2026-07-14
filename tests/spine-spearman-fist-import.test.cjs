const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

function extractFunctionBody(source, signature) {
  const start = source.indexOf(signature);
  if (start === -1) {
    throw new Error(`Missing signature: ${signature}`);
  }
  const bodyStart = source.indexOf("{", start);
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

function loadEditorSource() {
  return fs.readFileSync("tools/spine-node-timeline-editor.html", "utf8");
}

test("spearman material replacement installs the dedicated fist rig after standard slot extraction", () => {
  const source = loadEditorSource();
  assert.match(source, /await installSpearmanFistRigFromMaterial\(inputImageData,\s*inputComponents,\s*matches\);/);
});

test("material component detection can lower the pixel threshold so small spearman fist pieces remain discoverable", () => {
  const source = loadEditorSource();
  const body = extractFunctionBody(
    source,
    "function detectMaterialComponents(imageData, minPixels = materialReplacementOptions.minPixels)",
  );
  const detectMaterialComponents = new Function(
    "createMaterialForegroundMask",
    "materialReplacementOptions",
    `return function detectMaterialComponents(imageData, minPixels = materialReplacementOptions.minPixels) {${body}};`,
  )(
    (imageData) => imageData.foreground,
    { minPixels: 1000 },
  );

  const foreground = new Uint8Array(12 * 12);
  for (let y = 0; y < 4; y += 1) {
    for (let x = 0; x < 4; x += 1) {
      foreground[y * 12 + x] = 1;
    }
  }

  const components = detectMaterialComponents({ width: 12, height: 12, foreground }, 12);

  assert.equal(components.length, 1);
  assert.equal(components[0].pixels, 16);
  assert.equal(components[0].minX, 0);
  assert.equal(components[0].minY, 0);
  assert.equal(components[0].maxX, 3);
  assert.equal(components[0].maxY, 3);
});

test("spearman fist component detection prefers an unused lower-right small component", () => {
  const source = loadEditorSource();
  const body = extractFunctionBody(source, "function detectSpearmanFistComponent(inputImageData, inputComponents, matches = [])");
  const detectSpearmanFistComponent = new Function(
    `return function detectSpearmanFistComponent(inputImageData, inputComponents, matches = []) {${body}};`,
  )();

  const inputImageData = { width: 1000, height: 1000 };
  const torso = { minX: 320, minY: 120, maxX: 680, maxY: 730, width: 361, height: 611, cx: 500, cy: 425 };
  const fist = { minX: 780, minY: 620, maxX: 868, maxY: 711, width: 89, height: 92, cx: 824, cy: 666 };
  const distractor = { minX: 80, minY: 710, maxX: 180, maxY: 900, width: 101, height: 191, cx: 130, cy: 805 };
  const tooLarge = { minX: 720, minY: 580, maxX: 980, maxY: 930, width: 261, height: 351, cx: 850, cy: 755 };

  const detected = detectSpearmanFistComponent(
    inputImageData,
    [torso, fist, distractor, tooLarge],
    [{ component: torso }],
  );

  assert.deepEqual(detected, fist);
});

test("spearman fist rig nodes persist the transform lock through project reload", () => {
  const source = loadEditorSource();
  assert.match(source, /lockedTransform:\s*node\.lockedTransform === true/);
  assert.match(source, /fistBone\.lockedTransform = true/);
  assert.match(source, /fistPiece\.lockedTransform = true/);
  assert.match(source, /function isTransformLockedNode\(node\)/);
});

test("spearman fist placement can be solved from matched material centers even when torso 6 is not under the torso attachment chain", () => {
  const project = JSON.parse(fs.readFileSync("src/faxian/leg/spearman/project.json", "utf8"));
  const torso6 = (project.nodes || []).find((node) => node.name === "躯干 6");
  assert.ok(torso6, "expected spearman project to contain 躯干 6");

  let current = torso6;
  let hasTorsoAttachmentAncestor = false;
  while (current) {
    if (current.attachment?.image === "newTorso") {
      hasTorsoAttachmentAncestor = true;
      break;
    }
    current = current.parentId ? (project.nodes || []).find((node) => node.id === current.parentId) : null;
  }
  assert.equal(hasTorsoAttachmentAncestor, false);

  const source = loadEditorSource();
  const body = extractFunctionBody(source, "function estimateMaterialToWorldTransform(matches)");
  const estimateMaterialToWorldTransform = new Function(
    "state",
    "pieceCenter",
    `return function estimateMaterialToWorldTransform(matches) {${body}};`,
  )(
    {
      nodes: [
        { attachment: { image: "newHead" } },
        { attachment: { image: "newTorso" } },
        { attachment: { image: "newLeftArm" } },
      ],
    },
    (piece) => {
      if (piece.attachment.image === "newHead") return { x: 50, y: 20 };
      if (piece.attachment.image === "newTorso") return { x: 100, y: 80 };
      if (piece.attachment.image === "newLeftArm") return { x: 160, y: 120 };
      return { x: 0, y: 0 };
    },
  );

  const transform = estimateMaterialToWorldTransform([
    { slot: { imageKey: "newHead" }, component: { cx: 10, cy: 10 } },
    { slot: { imageKey: "newTorso" }, component: { cx: 20, cy: 40 } },
    { slot: { imageKey: "newLeftArm" }, component: { cx: 32, cy: 60 } },
  ]);

  assert.equal(typeof transform, "function");
  assert.deepEqual(transform(26, 50), { x: 130, y: 100 });
});

test("spearman fist lookup resolves the nearest attached ancestor for torso 6, which is the left-arm owner in the current project", () => {
  const project = JSON.parse(fs.readFileSync("src/faxian/leg/spearman/project.json", "utf8"));
  const source = loadEditorSource();
  const body = extractFunctionBody(source, "function findNearestAttachmentAncestor(node)");
  const findNearestAttachmentAncestor = new Function(
    "state",
    `return function findNearestAttachmentAncestor(node) {${body}};`,
  )({ nodes: project.nodes });

  const torso6 = project.nodes.find((node) => node.name === "躯干 6");
  const owner = findNearestAttachmentAncestor(torso6);

  assert.ok(owner);
  assert.equal(owner.attachment.image, "newLeftArm");
});

test("locked helper bones do not participate in the generic joint solver", () => {
  const source = loadEditorSource();
  const body = extractFunctionBody(source, "function participatesInGenericJointSolver(node, frame = state.currentFrame)");
  const participatesInGenericJointSolver = new Function(
    "state",
    "isBowRigNode",
    "isTempParentBoundArrowCarrier",
    "isTempParentBoundSlashFxCarrier",
    `return function participatesInGenericJointSolver(node, frame = state.currentFrame) {${body}};`,
  )(
    { currentFrame: 0 },
    () => false,
    () => false,
    () => false,
  );

  assert.equal(participatesInGenericJointSolver({ lockedTransform: true }), false);
  assert.equal(participatesInGenericJointSolver({ lockedTransform: false }), true);
});

test("spearman fist piece stays editable in binding mode even though its helper bone remains locked", () => {
  const source = loadEditorSource();
  const body = extractFunctionBody(source, "function isPieceTransformLocked(node)");
  const isPieceTransformLocked = new Function(
    "isTransformLockedNode",
    "spearmanFistPieceRole",
    `return function isPieceTransformLocked(node) {${body}};`,
  )((node) => Boolean(node?.lockedTransform), "spearman-fist-piece");

  assert.equal(isPieceTransformLocked({ role: "spearman-fist-piece", lockedTransform: true, attachment: {} }), false);
  assert.equal(isPieceTransformLocked({ role: "piece", lockedTransform: true, attachment: {} }), true);
  assert.equal(isPieceTransformLocked({ role: "piece", lockedTransform: false, attachment: {} }), false);
});
