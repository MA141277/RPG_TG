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

function loadSource() {
  return fs.readFileSync("tools/spine-node-timeline-editor.html", "utf8");
}

test("binding solver writeback preserves solved child local offsets instead of forcing x/y back to zero", () => {
  const source = loadSource();
  const body = extractFunctionBody(source, "function applySolvedJointPositions(positions)");
  const touched = [];
  const poseOverrides = new Map();
  const state = {
    currentFrame: 0,
    nodes: [
      { id: "parent", parentId: null, x: 100, y: 100, rotation: 0, length: 50, scaleX: 1, scaleY: 1 },
      { id: "child", parentId: "parent", x: 0, y: 0, rotation: 0, length: 40, scaleX: 1, scaleY: 1 },
    ],
  };
  const applySolvedJointPositions = new Function(
    "sortedNodeRefs",
    "participatesInGenericJointSolver",
    "startJointId",
    "endJointId",
    "isBindingMode",
    "localFromWorld",
    "worldPose",
    "state",
    "poseOverrides",
    "syncKeyAtCurrentFrame",
    "drag",
    `return function applySolvedJointPositions(positions) {${body}};`,
  )(
    () => state.nodes,
    () => true,
    (node) => (node.parentId ? `end:${node.parentId}` : `base:${node.id}`),
    (node) => `end:${node.id}`,
    () => true,
    (node, world) => {
      if (!node.parentId) return world;
      return { x: 7, y: 9 };
    },
    (node) => {
      if (node.id === "parent") {
        return { worldRotation: 0, worldX: 100, worldY: 100 };
      }
      return { worldRotation: 0, worldX: 150, worldY: 100 };
    },
    state,
    poseOverrides,
    () => {},
    { touched: { add: (id) => touched.push(id) } },
  );

  applySolvedJointPositions({
    "base:parent": { x: 100, y: 100 },
    "end:parent": { x: 150, y: 100 },
    "end:child": { x: 210, y: 130 },
  });

  assert.equal(state.nodes[1].x, 7);
  assert.equal(state.nodes[1].y, 9);
  assert.equal(state.nodes[1].rotation, Math.atan2(30, 60) * 180 / Math.PI);
  assert.ok(poseOverrides.has("child"));
  assert.deepEqual(touched, ["parent", "child"]);
});

test("binding solver writeback iterates real node references instead of sorted node snapshots", () => {
  const source = loadSource();
  assert.match(source, /function sortedNodeRefs\(\)\s*\{/);
  assert.match(source, /function applySolvedJointPositions\(positions\)\s*\{\s*sortedNodeRefs\(\)\.forEach\(\(node\) => \{/);
});
