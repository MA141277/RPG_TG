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

function loadSource() {
  return fs.readFileSync("tools/spine-node-timeline-editor.html", "utf8");
}

test("spine editor registers cavalry as a dedicated unit type with its own project path and readable label override", () => {
  const source = loadSource();
  const match = source.match(/const SPINE_UNIT_CONFIGS = (\{[\s\S]*?\n\s*\});/);
  assert.ok(match);
  const configs = new Function(`return ${match[1]};`)();
  assert.deepEqual({ ...configs.cavalry, label: "\\u9a91\\u5175" }, {
    label: "\\u9a91\\u5175",
    projectUrl: "/src/faxian/leg/cavalry/project.json",
    imageBaseUrl: "/src/faxian/leg/cavalry/",
    materialForegroundImageKeys: [],
    materialForegroundNormalizeOptions: {},
    enabled: true,
    featureGroups: [],
  });
  assert.match(source, /SPINE_UNIT_CONFIGS\.cavalry\.label = "\\u9a91\\u5175";/);
});

test("cavalry component classifier splits horse, rider, weapon, and four legs from the source layout", () => {
  const source = loadSource();
  const identifyFarLegsBody = extractFunctionBody(source, "function identifyCavalryFarLegIndices(horseLegs)");
  const classifyBody = extractFunctionBody(source, "function classifyCavalryComponents(inputImageData, components)");
  const identifyCavalryFarLegIndices = new Function(
    `return function identifyCavalryFarLegIndices(horseLegs) {${identifyFarLegsBody}};`,
  )();
  const classifyCavalryComponents = new Function(
    "identifyCavalryFarLegIndices",
    `return function classifyCavalryComponents(inputImageData, components) {${classifyBody}};`,
  )(identifyCavalryFarLegIndices);

  const components = [
    { pixels: 949484, minX: 166, minY: 163, maxX: 1956, maxY: 1589, width: 1791, height: 1427, cx: 1061.5, cy: 876.5 },
    { pixels: 872813, minX: 624, minY: 2191, maxX: 1626, maxY: 3867, width: 1003, height: 1677, cx: 1125.5, cy: 3029.5 },
    { pixels: 244230, minX: 167, minY: 3284, maxX: 688, maxY: 4173, width: 522, height: 890, cx: 428, cy: 3729 },
    { pixels: 182542, minX: 237, minY: 2282, maxX: 546, maxY: 3256, width: 310, height: 975, cx: 392, cy: 2769.5 },
    { pixels: 168115, minX: 1801, minY: 2390, maxX: 1996, maxY: 4132, width: 196, height: 1743, cx: 1899, cy: 3261.5 },
    { pixels: 98874, minX: 341, minY: 1338, maxX: 586, maxY: 2158, width: 246, height: 821, cx: 464, cy: 1748.5 },
    { pixels: 96149, minX: 624, minY: 1313, maxX: 841, maxY: 2145, width: 218, height: 833, cx: 733, cy: 1729.5 },
    { pixels: 93778, minX: 1065, minY: 1310, maxX: 1278, maxY: 2133, width: 214, height: 824, cx: 1172, cy: 1722 },
    { pixels: 87883, minX: 1324, minY: 1311, maxX: 1528, maxY: 2120, width: 205, height: 810, cx: 1426.5, cy: 1716 },
  ];

  const result = classifyCavalryComponents({ width: 2160, height: 4320 }, components);

  assert.deepEqual(result.horseBody, components[0]);
  assert.deepEqual(result.soldierTorso, components[1]);
  assert.deepEqual(result.soldierRightLeg, components[2]);
  assert.deepEqual(result.soldierRightArm, components[3]);
  assert.deepEqual(result.soldierWeapon, components[4]);
  assert.deepEqual(result.horseLegs, [components[5], components[6], components[7], components[8]]);
  assert.deepEqual(result.horseFarLegIndices, [1, 3]);
});

test("material replacement has a cavalry-only branch that builds a brand-new project from the split image", () => {
  const source = loadSource();
  assert.match(source, /if \(state\.currentUnitType === "cavalry"\)/);
  assert.match(source, /const project = buildCavalryProjectFromMaterial\(inputImageData,\s*file\.name\);/);
  assert.match(source, /applyProjectData\(project,\s*\{ unitType: "cavalry" \}\);/);
});

test("cavalry project bootstrap json stays valid and readable", () => {
  const project = JSON.parse(fs.readFileSync("src/faxian/leg/cavalry/project.json", "utf8"));
  assert.equal(project.name, "骑兵");
  assert.equal(project.nodes[0].name, "骑兵根");
});
