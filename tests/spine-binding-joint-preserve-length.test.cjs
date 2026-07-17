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

test("binding joint drag keeps bone length and only changes relative position or angle", () => {
  const source = loadEditorSource();
  const body = extractFunctionBody(source, "function rotateBoneEndpointPreserveLength(node, startWorld, targetWorld)");
  const calls = [];
  const rotateBoneEndpointPreserveLength = new Function(
    "state",
    "worldPose",
    "poseOverrides",
    "syncKeyAtCurrentFrame",
    "drag",
    `return function rotateBoneEndpointPreserveLength(node, startWorld, targetWorld) {${body}};`,
  )(
    { nodes: [{ id: "parent" }] },
    () => ({ worldRotation: 30 }),
    { set: (id, pose) => calls.push({ kind: "override", id, pose }) },
    () => calls.push({ kind: "sync" }),
    { touched: { add: (id) => calls.push({ kind: "touch", id }) } },
  );

  const node = { id: "child", parentId: "parent", rotation: 0, length: 77, scaleX: 1, scaleY: 1 };
  rotateBoneEndpointPreserveLength(node, { x: 10, y: 10 }, { x: 10, y: 30 });

  assert.equal(node.length, 77);
  assert.equal(node.rotation, 60);
  assert.deepEqual(calls[0], {
    kind: "override",
    id: "child",
    pose: {
      x: undefined,
      y: undefined,
      rotation: 60,
      length: 77,
      scaleX: 1,
      scaleY: 1,
    },
  });
});
