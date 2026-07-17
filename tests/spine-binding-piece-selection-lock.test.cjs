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

test("binding piece mode stays locked to the currently selected piece", () => {
  const source = loadEditorSource();
  const body = extractFunctionBody(source, "function hitTest(point)");
  let fallbackCalls = 0;
  const hitTest = new Function(
    "screenLengthToWorld",
    "state",
    "hitTestStretch",
    "isBindingMode",
    "hitTestSelectedPiece",
    "sortedNodes",
    "isCanvasVisibleNode",
    "worldPose",
    "endPoint",
    "distance",
    "firstChildOf",
    "endJointId",
    "startJointId",
    "pointSegmentDistance",
    "hitTestPiece",
    `return function hitTest(point) {${body}};`,
  )(
    (value) => value,
    { editMode: "move", bindingDragMode: "piece" },
    () => {
      throw new Error("stretch mode should not be used");
    },
    () => true,
    () => null,
    () => {
      throw new Error("bone hit-testing should not run in binding piece mode");
    },
    () => true,
    () => ({ worldX: 0, worldY: 0, worldRotation: 0, worldScaleX: 1, worldScaleY: 1, length: 10 }),
    (pose) => ({ x: pose.worldX + pose.length, y: pose.worldY }),
    (a, b) => Math.hypot(a.x - b.x, a.y - b.y),
    () => null,
    () => "end-joint",
    () => "start-joint",
    () => 999,
    () => {
      fallbackCalls += 1;
      return { type: "piece", node: { id: "other-piece" } };
    },
  );

  const hit = hitTest({ x: 100, y: 100 });

  assert.equal(hit, null);
  assert.equal(fallbackCalls, 0);
});
