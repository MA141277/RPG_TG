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

function loadComputeBounds() {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const body = extractFunctionBody(source, "computeBounds() {");
  return new Function(`return function computeBounds() {${body}};`)();
}

test("battle spine bounds ignore slash fx and arrow pieces when fitting soldier scale", () => {
  const computeBounds = loadComputeBounds();
  const runtime = {
    nodes: [
      {
        id: "torso",
        role: "torso",
        attachment: {
          image: "torso",
          restPart: { x: 20, y: 40 },
        },
      },
      {
        id: "slash-fx",
        role: "slash-fx-piece",
        attachment: {
          image: "slash",
          restPart: { x: 600, y: 0 },
        },
      },
      {
        id: "arrow",
        role: "arrow-piece",
        attachment: {
          image: "arrow",
          restPart: { x: -500, y: 10 },
        },
      },
    ],
    images: {
      torso: { width: 100, height: 220 },
      slash: { width: 900, height: 320 },
      arrow: { width: 700, height: 80 },
    },
    resolveRestPartTransform(restPart) {
      return restPart;
    },
    imagePointToFullSkinRest(point, _image, restPart) {
      return {
        x: point.x + restPart.x,
        y: point.y + restPart.y,
      };
    },
  };

  const bounds = computeBounds.call(runtime);
  assert.deepEqual(bounds, {
    minX: 20,
    minY: 40,
    maxX: 120,
    maxY: 260,
    width: 100,
    height: 220,
  });
});
