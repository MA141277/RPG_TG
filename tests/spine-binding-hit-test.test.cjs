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

test("binding-mode hitTest prefers the bone body over oversized joint handles on short cavalry bones", () => {
  const source = loadEditorSource();
  const body = extractFunctionBody(source, "function hitTest(point)");
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
    { editMode: "move", bindingDragMode: "bone" },
    () => {
      throw new Error("stretch mode should not be used");
    },
    () => true,
    () => null,
    () => [{ id: "bone-1", parentId: null, length: 10 }],
    () => true,
    () => ({ worldX: 0, worldY: 0, worldRotation: 0, worldScaleX: 1, worldScaleY: 1, length: 10 }),
    (pose) => ({ x: pose.worldX + pose.length, y: pose.worldY }),
    (a, b) => Math.hypot(a.x - b.x, a.y - b.y),
    () => null,
    () => "end-joint",
    () => "start-joint",
    (point, start, end) => {
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const lenSq = dx * dx + dy * dy;
      if (lenSq <= 0.0001) return Math.hypot(point.x - start.x, point.y - start.y);
      const t = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lenSq));
      const px = start.x + dx * t;
      const py = start.y + dy * t;
      return Math.hypot(point.x - px, point.y - py);
    },
    () => null,
  );

  const hit = hitTest({ x: 5, y: 0 });

  assert.deepEqual(hit, { type: "bone", node: { id: "bone-1", parentId: null, length: 10 } });
});
