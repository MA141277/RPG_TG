const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const layoutPath = path.join(
  root,
  "src",
  "ui",
  "views",
  "city",
  "city-stage-layout.ts"
);
const mainPath = path.join(root, "src", "main.ts");
const prototypeCssPath = path.join(root, "src", "styles", "prototype.css");

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

test("formal city-stage markup exposes a DOM runtime mount root", () => {
  const source = readText(layoutPath);

  assert.match(source, /data-city-stage-root/);
  assert.match(source, /c-city-map-stage__entity-occluder/);
  assert.match(source, /entity-occluder-left-x/);
  assert.match(source, /entity-occluder-right-x/);
  assert.match(source, /entity-occluder-peak-y/);
  assert.match(source, /entity-occluder-bottom-y/);
});

test("main source mounts and tears down the city-stage DOM runtime", () => {
  const source = readText(mainPath);

  assert.match(source, /mountCityStageDomRuntime/);
  assert.match(source, /destroy\(\)/);
});

test("city-stage CSS does not isolate NPC and building sorting into fixed sibling layers", () => {
  const source = readText(prototypeCssPath);

  assert.match(source, /\.c-city-map-stage__visual-items\s*\{/);
  assert.match(source, /\.c-city-stage-ambient-npc-layer\s*\{/);
  assert.match(source, /clip-path:\s*polygon\(/);
  assert.match(
    source,
    /\.c-city-map-stage__entity-static--occluder\s*\{[^}]*0\s+0[^}]*100%\s+0[^}]*100%\s+100%[^}]*0\s+100%/s
  );
  assert.match(source, /--entity-image-opacity/);
  assert.doesNotMatch(
    source,
    /\.c-city-map-stage__visual-items\s*\{[^}]*z-index:\s*3;/s
  );
  assert.doesNotMatch(
    source,
    /\.c-city-stage-ambient-npc-layer\s*\{[^}]*z-index:\s*3;/s
  );
  assert.doesNotMatch(source, /clip-path:\s*inset\(/);
  assert.match(source, /\.c-city-stage-ambient-npc__sprite\s*\{/);
  assert.doesNotMatch(source, /\.c-city-stage-ambient-npc__capsule\s*\{/);
});
