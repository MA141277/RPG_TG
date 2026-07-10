const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync("prototypes/battle-demo/spine-runtime-math.js", "utf8");
const context = { globalThis: {} };
vm.createContext(context);
vm.runInContext(source, context);
const { resolveRestPartWorldTransform } = context.globalThis.SpineRuntimeMath;

const parentPose = {
  worldX: 100,
  worldY: 50,
  worldRotation: 90,
  worldScaleX: 1,
  worldScaleY: 1,
  length: 20,
};
const restPart = {
  x: 10,
  y: 5,
  rotation: 15,
  scale: 1,
};

const resolved = resolveRestPartWorldTransform(parentPose, restPart);

assert.ok(Math.abs(resolved.x - 95) < 1e-9);
assert.ok(Math.abs(resolved.y - 80) < 1e-9);
assert.equal(resolved.rotation, 105);
