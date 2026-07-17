const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const source = fs.readFileSync("tools/spine-node-timeline-editor.html", "utf8");

function extractFunctionBody(signature) {
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

function loadAttachmentSwapFns() {
  const normalizeAttachmentBody = extractFunctionBody("function normalizeAttachment(attachment)");
  const normalizeTimelineMapBody = extractFunctionBody("function normalizeTimelineMap(timelines, duration)");
  const attachmentImageVariantsBody = extractFunctionBody(
    "function attachmentImageVariants(attachmentView = selectedAttachmentView())",
  );
  const getAttachmentImageForFrameBody = extractFunctionBody(
    "function getAttachmentImageForFrame(node, frame = state.currentFrame)",
  );
  const clampFrameToDurationBody = extractFunctionBody("function clampFrameToDuration(frame, duration)");
  const importAttachmentVariantFromLegAssetInputBody = extractFunctionBody(
    "async function importAttachmentVariantFromLegAssetInput()",
  );
  const importAttachmentVariantFromFileBody = extractFunctionBody(
    "async function importAttachmentVariantFromFile(file)",
  );

  const selectedAttachmentView = (attachment) => attachment;
  const normalizeSegmentAttachment = (value) => value || null;
  const clampNumber = (_, min, max, fallback) => Math.max(min, Math.min(max, fallback));
  const normalizeSpringLength = () => 0.55;
  const normalizeSpringAngle = () => 154;
  const state = { currentFrame: 0, timelines: {} };
  const calls = { registered: [], added: [] };
  const el = { attachmentLegAssetSelect: { value: "effects/slash_big.png" } };

  const clampFrameToDuration = new Function(
    `return function clampFrameToDuration(frame, duration) {${clampFrameToDurationBody}};`,
  )();
  const attachmentImageVariants = new Function(
    "selectedAttachmentView",
    `return function attachmentImageVariants(attachmentView = selectedAttachmentView()) {${attachmentImageVariantsBody}};`,
  )(selectedAttachmentView);
  const attachmentImageKeys = (node) =>
    (state.timelines[node?.id] || []).filter((item) => typeof item.attachmentImage === "string" && item.attachmentImage);
  const normalizeAttachment = new Function(
    "normalizeSegmentAttachment",
    "clampNumber",
    "normalizeSpringLength",
    "normalizeSpringAngle",
    "attachmentImageVariants",
    `return function normalizeAttachment(attachment) {${normalizeAttachmentBody}};`,
  )(
    normalizeSegmentAttachment,
    clampNumber,
    normalizeSpringLength,
    normalizeSpringAngle,
    attachmentImageVariants,
  );
  const normalizeTimelineMap = new Function(
    "clampFrameToDuration",
    `return function normalizeTimelineMap(timelines, duration) {${normalizeTimelineMapBody}};`,
  )(clampFrameToDuration);
  const getAttachmentImageForFrame = new Function(
    "state",
    "attachmentImageVariants",
    "attachmentImageKeys",
    `return function getAttachmentImageForFrame(node, frame = state.currentFrame) {${getAttachmentImageForFrameBody}};`,
  )(state, attachmentImageVariants, attachmentImageKeys);
  const importAttachmentVariantFromLegAssetInput = new Function(
    "el",
    "attachmentEditNode",
    "isTransformLockedNode",
    "registerLegAssetImage",
    "addAttachmentVariant",
    `return async function importAttachmentVariantFromLegAssetInput() {${importAttachmentVariantFromLegAssetInputBody}};`,
  )(
    el,
    () => ({ attachment: { image: "slash_small", imageVariants: ["slash_small"] } }),
    () => false,
    (filename) => {
      calls.registered.push(filename);
      return `leg:${filename}`;
    },
    (image) => {
      calls.added.push(image);
    },
  );
  const importAttachmentVariantFromFile = new Function(
    "attachmentEditNode",
    "isTransformLockedNode",
    "loadFileImage",
    "readFileAsDataUrl",
    "customImagePrefix",
    "uid",
    "normalizeLegAssetFilename",
    "legAssetPrefix",
    "registerCustomImage",
    "addAttachmentVariant",
    `return async function importAttachmentVariantFromFile(file) {${importAttachmentVariantFromFileBody}};`,
  )(
    () => ({ attachment: { image: "slash_small", imageVariants: ["slash_small"] } }),
    () => false,
    async () => ({ width: 128, naturalWidth: 128 }),
    async () => "data:image/png;base64,abc",
    "custom:",
    () => "image-001",
    (filename) => filename,
    "leg:",
    (id, name, src) => {
      calls.customRegistered = { id, name, src };
    },
    (image) => {
      calls.added.push(image);
    },
  );
  return {
    normalizeAttachment,
    normalizeTimelineMap,
    attachmentImageVariants,
    getAttachmentImageForFrame,
    importAttachmentVariantFromLegAssetInput,
    importAttachmentVariantFromFile,
    state,
    calls,
  };
}

test("Spine editor defines attachment image variant helpers and timeline swap controls", () => {
  assert.match(source, /function attachmentImageVariants\(attachmentView = selectedAttachmentView\(\)\) \{/);
  assert.match(source, /function getAttachmentImageForFrame\(node, frame = state\.currentFrame\) \{/);
  assert.match(source, /id="attachmentVariantSelect"/);
  assert.match(source, /id="attachmentLegAssetSelect"/);
  assert.match(source, /id="attachmentVariantImportBtn"/);
  assert.match(source, /id="attachmentVariantBrowseBtn"/);
  assert.match(source, /id="attachmentVariantFileInput"/);
  assert.match(source, /id="attachmentImageKeySelect"/);
  assert.match(source, /贴图替换|璐村浘鏇挎崲/);
});

test("normalizeAttachment keeps the default image inside a deduplicated variant library", () => {
  const { normalizeAttachment } = loadAttachmentSwapFns();

  const normalized = normalizeAttachment({
    image: "slash_small",
    imageVariants: ["slash_big", "", "slash_small", "slash_big"],
  });

  assert.equal(normalized.image, "slash_small");
  assert.deepEqual(normalized.imageVariants, ["slash_small", "slash_big"]);
});

test("normalizeTimelineMap preserves attachment replacement keys", () => {
  const { normalizeTimelineMap } = loadAttachmentSwapFns();

  const result = normalizeTimelineMap(
    {
      fx: [
        { frame: 30, attachmentImage: "slash_big" },
        { frame: 40, attachmentImage: "" },
      ],
    },
    80,
  );

  assert.equal(result.fx[0].attachmentImage, "slash_big");
  assert.equal("attachmentImage" in result.fx[1], false);
});

test("attachment image replacement keys persist until the next replacement key", () => {
  const { getAttachmentImageForFrame, state } = loadAttachmentSwapFns();
  const node = { id: "fx", attachment: { image: "slash_small", imageVariants: ["slash_small", "slash_big"] } };
  state.timelines.fx = [
    { frame: 30, attachmentImage: "slash_big" },
    { frame: 48, attachmentImage: "slash_small" },
  ];

  assert.equal(getAttachmentImageForFrame(node, 0), "slash_small");
  assert.equal(getAttachmentImageForFrame(node, 35), "slash_big");
  assert.equal(getAttachmentImageForFrame(node, 47), "slash_big");
  assert.equal(getAttachmentImageForFrame(node, 60), "slash_small");
});

test("attachment variant import registers a leg asset path and adds it to the current node library", async () => {
  const { importAttachmentVariantFromLegAssetInput, calls } = loadAttachmentSwapFns();

  await importAttachmentVariantFromLegAssetInput();

  assert.deepEqual(calls.registered, ["effects/slash_big.png"]);
  assert.deepEqual(calls.added, ["leg:effects/slash_big.png"]);
});

test("attachment variant file import registers a custom image and adds it to the current node library", async () => {
  const { importAttachmentVariantFromFile, calls } = loadAttachmentSwapFns();

  await importAttachmentVariantFromFile({ name: "slash_big.png" });

  assert.deepEqual(calls.customRegistered, {
    id: "custom:attachment-variant-image-001",
    name: "slash_big.png",
    src: "leg:slash_big.png",
  });
  assert.deepEqual(calls.added, ["custom:attachment-variant-image-001"]);
});
