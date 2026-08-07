const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");

test("desktop package scripts use the mirror-aware Electron Builder wrapper", () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));

  assert.equal(packageJson.scripts["desktop:dir"], "npm run build && node tools/run-electron-builder.mjs --dir");
  assert.equal(packageJson.scripts["desktop:build"], "npm run build && node tools/run-electron-builder.mjs --win portable");
});

test("Electron Builder wrapper configures Electron and builder binary mirrors", () => {
  const scriptPath = path.join(repoRoot, "tools", "run-electron-builder.mjs");
  const source = fs.readFileSync(scriptPath, "utf8");

  assert.match(source, /ELECTRON_MIRROR/);
  assert.match(source, /https:\/\/npmmirror\.com\/mirrors\/electron\//);
  assert.match(source, /ELECTRON_BUILDER_BINARIES_MIRROR/);
  assert.match(source, /https:\/\/npmmirror\.com\/mirrors\/electron-builder-binaries\//);
  assert.match(source, /electron-builder/);
});
