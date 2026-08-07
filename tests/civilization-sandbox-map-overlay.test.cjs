const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

test("civilization sandbox overlay projects individuals structures farms and claimed hexes", () => {
  const {
    createInitialCivilizationSandboxState,
  } = require("../.test-dist/domain/civilization-sandbox.js");
  const {
    placeSandboxLord,
  } = require("../.test-dist/application/civilization-sandbox/placement.js");
  const {
    tickCivilizationSandbox,
  } = require("../.test-dist/application/civilization-sandbox/simulation.js");
  const {
    createCivilizationSandboxMapOverlay,
  } = require("../.test-dist/application/civilization-sandbox/map-overlay-presenter.js");

  let state = placeSandboxLord({
    state: createInitialCivilizationSandboxState(),
    raceId: "chen-yihan",
    hex: { x: 2, y: 2 },
  });
  state = tickCivilizationSandbox(tickCivilizationSandbox(state));

  const overlay = createCivilizationSandboxMapOverlay(state);

  assert.equal(overlay.enabled, true);
  assert.ok(overlay.individuals.length >= 4);
  assert.ok(
    overlay.structures.some((structure) => structure.kind === "rural-house")
  );
  assert.ok(overlay.structures.some((structure) => structure.kind === "farm"));
  assert.ok(
    overlay.claimedHexes.some(
      (entry) => entry.colorToken === "sandbox-civilization-chen"
    )
  );
});

test("map view model and app render expose civilization sandbox overlay without application HTML", () => {
  const mapViewSource = fs.readFileSync("src/ui/views/map/map-view.ts", "utf8");
  const appRenderSource = fs.readFileSync("src/ui/app-render.ts", "utf8");

  assert.match(mapViewSource, /civilizationSandboxOverlay/);
  assert.match(mapViewSource, /data-civilization-sandbox-overlay/);
  assert.match(appRenderSource, /createCivilizationSandboxMapOverlay/);
});
