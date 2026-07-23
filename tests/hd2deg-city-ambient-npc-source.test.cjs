const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("pixel-workflow html loads ambient npc helpers before the legacy monolith", () => {
  const html = fs.readFileSync("HD2DEG/pixel-workflow.html", "utf8");
  assert.match(html, /city-ambient-npc-scene-index\.js/);
  assert.match(html, /city-ambient-npc-pathfinder\.js/);
  assert.match(html, /city-ambient-npc-runtime\.js/);
  assert.ok(
    html.indexOf("city-ambient-npc-runtime.js") < html.indexOf("./scripts/pixel-workflow.js"),
    "ambient runtime script must load before pixel-workflow.js"
  );
});

test("pixel-workflow source boots ambient npc runtime for embedded city scenes and renders it non-interactively", () => {
  const source = fs.readFileSync("HD2DEG/scripts/pixel-workflow.js", "utf8");
  assert.match(source, /createAmbientNpcRuntime/);
  assert.match(source, /buildSceneIndex/);
  assert.match(source, /cityAmbientNpc|ambientNpc/);
  assert.match(source, /tick\(deltaMs\)|updateCityAmbientNpcRuntimeStep/);
  assert.match(source, /getRenderables\(\)/);
});

test("pixel-workflow seeds the ambient npc scene index from hydrated scene objects after scene load", () => {
  const source = fs.readFileSync("HD2DEG/scripts/pixel-workflow.js", "utf8");
  assert.match(
    source,
    /await hydrateSceneObjectAssets\(animator\._sceneObjects\);[\s\S]*resetCityAmbientNpcScene\(id,\s*\{[\s\S]*objects:\s*animator\._sceneObjects[\s\S]*\}\);/,
    "ambient npc scene reset must use hydrated animator._sceneObjects after loadSceneById hydration"
  );
});

test("pixel-workflow ambient npc enablement covers the haozhou city scene id", () => {
  const source = fs.readFileSync("HD2DEG/scripts/pixel-workflow.js", "utf8");
  assert.match(
    source,
    /function shouldEnableCityAmbientNpcForScene\(sceneId\)[\s\S]*normalizedSceneId\s*===\s*[\"']zyz_haozhou[\"']/,
    "ambient npc enablement must explicitly cover zyz_haozhou"
  );
});

test("pixel-workflow file map documents the ambient npc helper files", () => {
  const source = fs.readFileSync("HD2DEG/docs/pixel-workflow-file-map.md", "utf8");
  assert.match(source, /city-ambient-npc-scene-index\.js/);
  assert.match(source, /city-ambient-npc-pathfinder\.js/);
  assert.match(source, /city-ambient-npc-runtime\.js/);
});
