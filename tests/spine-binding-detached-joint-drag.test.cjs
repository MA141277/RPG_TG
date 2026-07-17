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

test("binding detached root joint drags bypass the generic solver and use direct transforms", () => {
  const source = loadEditorSource();
  const body = extractFunctionBody(source, "function handleBindingJointDrag(node, dragType, point)");
  const calls = [];
  const handleBindingJointDrag = new Function(
    "isBindingMode",
    "drag",
    "moveBoneRigid",
    "rotateBoneEndpointPreserveLength",
    `return function handleBindingJointDrag(node, dragType, point) {${body}};`,
  )(
    () => true,
    {
      start: { x: 10, y: 15 },
      startWorldOrigin: { x: 100, y: 120 },
    },
    (node, deltaWorld, startWorldOrigin) => {
      calls.push({ kind: "move", node, deltaWorld, startWorldOrigin });
    },
    (node, startWorldOrigin, point) => {
      calls.push({ kind: "rotate", node, startWorldOrigin, point });
    },
  );

  const detached = { id: "detached-root", parentId: null };

  assert.equal(handleBindingJointDrag(detached, "origin", { x: 18, y: 21 }), true);
  assert.equal(handleBindingJointDrag(detached, "end", { x: 160, y: 190 }), true);
  assert.deepEqual(calls, [
    {
      kind: "move",
      node: detached,
      deltaWorld: { x: 8, y: 6 },
      startWorldOrigin: { x: 100, y: 120 },
    },
    {
      kind: "rotate",
      node: detached,
      startWorldOrigin: { x: 100, y: 120 },
      point: { x: 160, y: 190 },
    },
  ]);
});
