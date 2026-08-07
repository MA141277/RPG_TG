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

test("civilization sandbox action handling stays outside main shell", () => {
  const mainSource = fs.readFileSync("src/main.ts", "utf8");
  const mapViewSource = fs.readFileSync("src/ui/views/map/map-view.ts", "utf8");
  const coordinatorSource = fs.readFileSync(
    "src/application/runtime/coordinators/civilization-sandbox-action-coordinator.ts",
    "utf8"
  );

  assert.doesNotMatch(mainSource, /placeSandboxLord/);
  assert.doesNotMatch(mainSource, /tickCivilizationSandbox/);
  assert.match(mapViewSource, /data-civilization-sandbox-action/);
  assert.match(coordinatorSource, /handleCivilizationSandboxAction/);
});

test("civilization sandbox view exposes individuals houses farms and territory visual hooks", () => {
  const mapViewSource = fs.readFileSync("src/ui/views/map/map-view.ts", "utf8");
  const styleSource = fs.readFileSync(
    "src/styles/civilization-sandbox.css",
    "utf8"
  );

  assert.match(mapViewSource, /c-civilization-sandbox-individual/);
  assert.match(
    mapViewSource,
    /c-civilization-sandbox-structure--rural-house/
  );
  assert.match(mapViewSource, /c-civilization-sandbox-structure--farm/);
  assert.match(mapViewSource, /c-civilization-sandbox-territory/);
  assert.match(mapViewSource, /data-terrain-projected-point/);
  assert.match(mapViewSource, /data-map-height-u/);
  assert.match(mapViewSource, /hexToCoordinate/);
  assert.match(mapViewSource, /hexToCoordinatePolygon/);
  assert.match(mapViewSource, /points=\"\$\{formatSandboxPolygonPoints/);
  assert.doesNotMatch(mapViewSource, /ui\/npc\/city-ambient-walkers/);
  assert.match(styleSource, /c-civilization-sandbox-overlay/);
  assert.doesNotMatch(styleSource, /#[0-9a-fA-F]{3,8}\b/);
  assert.doesNotMatch(styleSource, /z-index\s*:\s*\d+/);
});

test("civilization sandbox rural houses feed the campaign terrain model channel", () => {
  const terrainSource = fs.readFileSync(
    "src/ui/views/map/campaign-terrain-webgl.ts",
    "utf8"
  );

  assert.match(terrainSource, /readCivilizationSandboxRuralHouseStructures/);
  assert.match(terrainSource, /data-civilization-sandbox-source/);
  assert.match(terrainSource, /settlementVillageInstances/);
  assert.match(terrainSource, /setCampaignStructureGroundSemanticCell/);
  assert.match(terrainSource, /"rural-house"/);
});

test("civilization sandbox placement action converts map coordinates to hex coordinates", () => {
  const {
    createCivilizationSandboxActionFromUiInput,
  } = require("../.test-dist/application/runtime/coordinators/civilization-sandbox-action-coordinator.js");

  const action = createCivilizationSandboxActionFromUiInput({
    actionType: "place-lord",
    raceId: "wu-tong",
    entityId: undefined,
    coordinate: { x: 5, y: 5 },
    coordinateSpace: { width: 10, height: 10 },
    coordinateSystem: null,
  });

  assert.equal(action.type, "place-lord");
  assert.deepEqual(action.hex, { x: 0, y: 0 });
});

test("civilization sandbox tick moves non-leader individuals across claimed hexes", () => {
  const {
    createInitialCivilizationSandboxState,
  } = require("../.test-dist/domain/civilization-sandbox.js");
  const {
    placeSandboxLord,
  } = require("../.test-dist/application/civilization-sandbox/placement.js");
  const {
    tickCivilizationSandbox,
  } = require("../.test-dist/application/civilization-sandbox/simulation.js");

  let state = placeSandboxLord({
    state: createInitialCivilizationSandboxState(),
    raceId: "yu-qingqing",
    hex: { x: 2, y: 2 },
  });
  const initialById = Object.fromEntries(
    Object.values(state.individualsById).map((individual) => [
      individual.id,
      individual.hexKey,
    ])
  );

  state = tickCivilizationSandbox(tickCivilizationSandbox(state));

  assert.ok(
    Object.values(state.individualsById).some(
      (individual) =>
        !individual.isLeader && initialById[individual.id] !== individual.hexKey
    ),
    "Expected at least one non-leader sandbox individual to move to another hex."
  );
});

test("civilization sandbox tick keeps walkers away from their home hex once land is claimed", () => {
  const {
    createInitialCivilizationSandboxState,
  } = require("../.test-dist/domain/civilization-sandbox.js");
  const {
    placeSandboxLord,
  } = require("../.test-dist/application/civilization-sandbox/placement.js");
  const {
    tickCivilizationSandbox,
  } = require("../.test-dist/application/civilization-sandbox/simulation.js");

  let state = placeSandboxLord({
    state: createInitialCivilizationSandboxState(),
    raceId: "yu-qingqing",
    hex: { x: 2, y: 2 },
  });

  state = tickCivilizationSandbox(state);
  state = tickCivilizationSandbox(state);
  state = tickCivilizationSandbox(state);

  const civilization = Object.values(state.civilizationsById)[0];
  const walkers = Object.values(state.individualsById).filter(
    (individual) => !individual.isLeader
  );

  assert.ok(civilization.claimedHexKeys.length > 1);
  assert.ok(
    walkers.every((individual) => individual.hexKey !== civilization.homeHexKey),
    "Expected non-leader sandbox walkers to keep moving on claimed hexes instead of snapping back home."
  );
});

test("civilization sandbox enabled map hides legacy campaign markers and backpack entry", () => {
  const mapViewSource = fs.readFileSync("src/ui/views/map/map-view.ts", "utf8");

  assert.match(mapViewSource, /isCivilizationSandboxActive/);
  assert.match(mapViewSource, /getVisibleCampaignMarkers/);
  assert.match(
    mapViewSource,
    /model\.civilizationSandboxOverlay\?\.enabled === true/
  );
  assert.match(mapViewSource, /renderCampaignMapActions/);
  assert.match(mapViewSource, /renderOptionalMapStageActions/);
});

test("app render hides global hud while civilization sandbox validation is active", () => {
  const appRenderSource = fs.readFileSync("src/ui/app-render.ts", "utf8");

  assert.match(appRenderSource, /civilizationSandbox\.enabled/);
  assert.match(appRenderSource, /shouldRenderGlobalHud/);
});
