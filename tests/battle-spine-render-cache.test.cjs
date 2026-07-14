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

function loadBattleSpineCacheFns() {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const getSortedTimelineKeysBody = extractFunctionBody(source, "getSortedTimelineKeys(action, nodeId) {");
  const beginRenderFrameBody = extractFunctionBody(source, "beginRenderFrame(action, frame) {");
  const getRenderableAttachmentNodesBody = extractFunctionBody(source, "getRenderableAttachmentNodes(action, frame) {");
  const getAttachmentSourceGridBody = extractFunctionBody(source, "getAttachmentSourceGrid(image, cols, rows) {");
  const getSortedTimelineKeys = new Function(
    `return function getSortedTimelineKeys(action, nodeId) {${getSortedTimelineKeysBody}};`,
  )();
  const beginRenderFrame = new Function(
    `return function beginRenderFrame(action, frame) {${beginRenderFrameBody}};`,
  )();
  const getRenderableAttachmentNodes = new Function(
    `return function getRenderableAttachmentNodes(action, frame) {${getRenderableAttachmentNodesBody}};`,
  )();
  const getAttachmentSourceGrid = new Function(
    `return function getAttachmentSourceGrid(image, cols, rows) {${getAttachmentSourceGridBody}};`,
  )();
  return { getSortedTimelineKeys, beginRenderFrame, getRenderableAttachmentNodes, getAttachmentSourceGrid };
}

test("battle spine timeline sorting is memoized per action and node", () => {
  const { getSortedTimelineKeys } = loadBattleSpineCacheFns();
  const action = {
    id: "attack",
    timelines: {
      arm: [{ frame: 10 }, { frame: 0 }, { frame: 5 }],
    },
  };
  const runtime = {
    timelineKeyCache: new WeakMap(),
    projectTimelineKeyCache: new Map(),
  };

  const first = getSortedTimelineKeys.call(runtime, action, "arm");
  const second = getSortedTimelineKeys.call(runtime, action, "arm");

  assert.deepEqual(first.map((item) => item.frame), [0, 5, 10]);
  assert.strictEqual(first, second);
});

test("battle spine render frame cache reuses the same memo bucket for identical action/frame pairs", () => {
  const { beginRenderFrame } = loadBattleSpineCacheFns();
  const action = { id: "idle" };
  const runtime = {
    renderFrameState: null,
  };

  const first = beginRenderFrame.call(runtime, action, 12.3456);
  const second = beginRenderFrame.call(runtime, action, 12.3456);
  const third = beginRenderFrame.call(runtime, action, 12.9);

  assert.strictEqual(first, second);
  assert.notStrictEqual(first, third);
  assert.ok(first.localPoseByNode instanceof Map);
  assert.ok(first.worldPoseByNode instanceof Map);
  assert.ok(first.attachmentSegmentsByNode instanceof Map);
});

test("battle spine renderable attachment queue is built once per action frame", () => {
  const { beginRenderFrame, getRenderableAttachmentNodes } = loadBattleSpineCacheFns();
  const action = { id: "idle" };
  const runtime = {
    attachmentNodes: [
      { id: "b", attachment: { layer: 2 } },
      { id: "a", attachment: { layer: 1 } },
    ],
    renderFrameState: null,
    beginRenderFrame,
    isNodeVisibleAtFrameCalls: 0,
    effectiveAttachmentAlphaForNodeCalls: 0,
    isNodeVisibleAtFrame() {
      this.isNodeVisibleAtFrameCalls += 1;
      return true;
    },
    effectiveAttachmentAlphaForNode(node) {
      this.effectiveAttachmentAlphaForNodeCalls += 1;
      return node.id === "a" ? 0.3 : 0.7;
    },
  };

  const first = getRenderableAttachmentNodes.call(runtime, action, 4);
  const firstVisibleCalls = runtime.isNodeVisibleAtFrameCalls;
  const firstAlphaCalls = runtime.effectiveAttachmentAlphaForNodeCalls;
  const second = getRenderableAttachmentNodes.call(runtime, action, 4);

  assert.deepEqual(first.map((node) => node.id), ["a", "b"]);
  assert.strictEqual(first, second);
  assert.equal(firstVisibleCalls, 2);
  assert.equal(runtime.isNodeVisibleAtFrameCalls, firstVisibleCalls);
  assert.equal(runtime.effectiveAttachmentAlphaForNodeCalls, firstAlphaCalls);
});

test("battle spine attachment source grid is memoized per image and mesh density", () => {
  const { getAttachmentSourceGrid } = loadBattleSpineCacheFns();
  const runtime = {
    attachmentSourceGridCache: new WeakMap(),
  };
  const image = { width: 128, height: 256 };

  const first = getAttachmentSourceGrid.call(runtime, image, 4, 6);
  const second = getAttachmentSourceGrid.call(runtime, image, 4, 6);
  const third = getAttachmentSourceGrid.call(runtime, image, 5, 6);

  assert.strictEqual(first, second);
  assert.notStrictEqual(first, third);
  assert.deepEqual(first[0][0], { x: 0, y: 0 });
  assert.deepEqual(first[6][4], { x: 128, y: 256 });
});
