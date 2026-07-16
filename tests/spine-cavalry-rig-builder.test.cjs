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
    runtimeProjectUrl: "/src/faxian/leg/swordsman/project.json",
    runtimeAssetUnitType: "swordsman",
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

test("cavalry horse-body extraction excludes separate leg pixels that happen to fall inside the body bounding box", () => {
  const source = loadSource();
  const detectBody = extractFunctionBody(source, "function detectMaterialComponents(imageData, minPixels = materialReplacementOptions.minPixels)");
  const extractBody = extractFunctionBody(source, "function extractMaterialPiece(sourceImageData, component, padding)");
  const foregroundMask = new Uint8Array([
    0, 1, 1, 1, 1, 1, 0, 0,
    0, 1, 1, 1, 1, 1, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 1, 0,
    0, 0, 1, 1, 0, 0, 1, 0,
    0, 0, 1, 1, 0, 0, 0, 0,
    0, 0, 1, 1, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const createMaterialForegroundMask = () => foregroundMask;
  const materialReplacementOptions = { minPixels: 1 };
  const detectMaterialComponents = new Function(
    "createMaterialForegroundMask",
    "materialReplacementOptions",
    `return function detectMaterialComponents(imageData, minPixels = materialReplacementOptions.minPixels) {${detectBody}};`,
  )(createMaterialForegroundMask, materialReplacementOptions);
  const extractMaterialPiece = new Function(
    "createMaterialForegroundMask",
    "ImageData",
    `return function extractMaterialPiece(sourceImageData, component, padding) {${extractBody}};`,
  )(
    createMaterialForegroundMask,
    class ImageData {
      constructor(width, height) {
        this.width = width;
        this.height = height;
        this.data = new Uint8ClampedArray(width * height * 4);
      }
    },
  );
  const sourceImageData = {
    width: 8,
    height: 8,
    data: new Uint8ClampedArray(8 * 8 * 4),
  };
  foregroundMask.forEach((value, index) => {
    if (!value) return;
    sourceImageData.data[index * 4] = 200;
    sourceImageData.data[index * 4 + 1] = 100;
    sourceImageData.data[index * 4 + 2] = 50;
    sourceImageData.data[index * 4 + 3] = 255;
  });

  const components = detectMaterialComponents(sourceImageData, 1);
  const horseBody = components.find((component) => component.minY === 0);
  assert.ok(horseBody);
  assert.equal(horseBody.maxY, 4);

  const piece = extractMaterialPiece(sourceImageData, horseBody, 0);
  const overlappingLegPixelOffset = ((4 - horseBody.minY) * piece.width + (2 - horseBody.minX)) * 4 + 3;
  const bodyPixelOffset = ((0 - horseBody.minY) * piece.width + (1 - horseBody.minX)) * 4 + 3;

  assert.equal(piece.data[bodyPixelOffset], 255);
  assert.equal(piece.data[overlappingLegPixelOffset], 0);
});

test("material replacement has a cavalry-only branch that builds a brand-new project from the split image", () => {
  const source = loadSource();
  assert.match(source, /if \(state\.currentUnitType === "cavalry"\)/);
  assert.match(source, /const project = buildCavalryProjectFromMaterial\(inputImageData,\s*file\.name\);/);
  assert.match(source, /applyProjectData\(project,\s*\{ unitType: "cavalry" \}\);/);
});

test("generated cavalry rider upper body is delegated to the shared soldier torso-right-arm builder", () => {
  const source = loadSource();
  assert.match(
    source,
    /function buildGeneratedSoldierUpperBodyFromMaterial\(\{\s*addBone,\s*addPiece,\s*registerComponentImage,\s*parts,\s*transform,\s*mountParentId,\s*\}\) \{/,
  );
  assert.match(
    source,
    /const soldierUpperBody = buildGeneratedSoldierUpperBodyFromMaterial\(\{\s*addBone,\s*addPiece,\s*registerComponentImage,\s*parts,\s*transform,\s*mountParentId: horseBody2CenterMount\.id,\s*\}\);/,
  );
  assert.match(source, /const soldierTorsoImageId = registerComponentImage\("soldier-torso", parts\.soldierTorso\);/);
  assert.match(source, /const soldierRightArmImageId = registerComponentImage\("soldier-right-arm", parts\.soldierRightArm\);/);
});

test("generated cavalry weapon uses a dedicated sword bone attached to soldier right arm 2", () => {
  const source = loadSource();
  assert.match(
    source,
    /const soldierWeaponBone = addBone\("\\u58eb\\u5175\\u6b66\\u5668",\s*soldierRightArm2\.id,\s*componentPoint\(parts\.soldierWeapon,\s*[\d.]+,\s*[\d.]+\),\s*componentPoint\(parts\.soldierWeapon,\s*[\d.]+,\s*[\d.]+\),\s*"#[0-9a-fA-F]+"\s*,\s*"sword"\);/,
  );
  assert.match(
    source,
    /addPiece\("\\u58eb\\u5175\\u6b66\\u5668",\s*"cavalry-soldier-weapon-piece",\s*soldierWeaponImageId,\s*parts\.soldierWeapon,\s*95,\s*\[\s*soldierWeaponBone\.id,\s*\]\);/,
  );
});

test("generated cavalry horse scaling enlarges horse bones and horse fullSkin pieces without scaling the rider body itself", () => {
  const source = loadSource();
  const body = extractFunctionBody(source, "function scaleGeneratedCavalryHorse(nodes, factor = 1.5)");
  const scaleGeneratedCavalryHorse = new Function(
    `return function scaleGeneratedCavalryHorse(nodes, factor = 1.5) {${body}};`,
  )();
  const nodes = [
    {
      id: "horse-root",
      parentId: null,
      role: "cavalry-horse-body",
      x: 100,
      y: 200,
      length: 80,
      bindPose: { x: 100, y: 200, rotation: 0, length: 80, scaleX: 1, scaleY: 1 },
    },
    {
      id: "horse-leg",
      parentId: "horse-root",
      role: "cavalry-horse-leg",
      x: 20,
      y: 10,
      length: 40,
      bindPose: { x: 20, y: 10, rotation: 0, length: 40, scaleX: 1, scaleY: 1 },
    },
    {
      id: "rider-root",
      parentId: "horse-root",
      role: "cavalry-soldier-spine",
      x: 12,
      y: -16,
      length: 30,
      bindPose: { x: 12, y: -16, rotation: 0, length: 30, scaleX: 1, scaleY: 1 },
    },
    {
      id: "horse-piece",
      parentId: null,
      role: "cavalry-horse-piece",
      x: 0,
      y: 0,
      length: 4,
      bindPose: { x: 0, y: 0, rotation: 0, length: 4, scaleX: 1, scaleY: 1 },
      attachment: {
        fullSkin: true,
        restPart: {
          parentBoneId: "horse-root",
          x: -30,
          y: -10,
          scale: 0.5,
        },
      },
    },
    {
      id: "rider-piece",
      parentId: null,
      role: "cavalry-soldier-torso-piece",
      x: 0,
      y: 0,
      length: 4,
      bindPose: { x: 0, y: 0, rotation: 0, length: 4, scaleX: 1, scaleY: 1 },
      attachment: {
        fullSkin: true,
        restPart: {
          parentBoneId: "rider-root",
          x: 6,
          y: 4,
          scale: 0.75,
        },
      },
    },
  ];

  scaleGeneratedCavalryHorse(nodes, 1.5);

  assert.equal(nodes[0].x, 100);
  assert.equal(nodes[0].y, 200);
  assert.equal(nodes[0].length, 120);
  assert.equal(nodes[0].bindPose.length, 120);
  assert.equal(nodes[1].x, 30);
  assert.equal(nodes[1].y, 15);
  assert.equal(nodes[1].length, 60);
  assert.equal(nodes[1].bindPose.x, 30);
  assert.equal(nodes[1].bindPose.y, 15);
  assert.equal(nodes[2].x, 18);
  assert.equal(nodes[2].y, -24);
  assert.equal(nodes[2].length, 30);
  assert.equal(nodes[3].attachment.restPart.x, -45);
  assert.equal(nodes[3].attachment.restPart.y, -15);
  assert.equal(nodes[3].attachment.restPart.scale, 0.75);
  assert.equal(nodes[4].attachment.restPart.x, 6);
  assert.equal(nodes[4].attachment.restPart.y, 4);
  assert.equal(nodes[4].attachment.restPart.scale, 0.75);
});


test.skip("legacy cavalry rider spine layout assertions", () => {
  const source = loadSource();
  assert.match(
    source,
    /const horseBody2CenterMount = addBone\("马身 2 中心节点",\s*horseBody2\.id,\s*componentPoint\(parts\.horseBody,\s*0\.43,\s*0\.595\),\s*componentPoint\(parts\.horseBody,\s*0\.4301,\s*0\.595\)/,
  );
  assert.match(
    source,
    /const soldierSpine1 = addBone\("士兵脊椎 1",\s*horseBody2CenterMount\.id,\s*componentPoint\(parts\.soldierTorso,\s*0\.46,\s*0\.77\),\s*componentPoint\(parts\.soldierTorso,\s*0\.485,\s*0\.32\)/,
  );
  assert.match(
    source,
    /const soldierRightShoulder = addBone\("士兵右肩",\s*soldierSpine2\.id,\s*componentPoint\(parts\.soldierTorso,\s*0\.36,\s*0\.25\),\s*componentPoint\(parts\.soldierTorso,\s*0\.08,\s*0\.21\)/,
  );
  assert.match(
    source,
    /const soldierLeftShoulder = addBone\("士兵左肩",\s*soldierSpine2\.id,\s*componentPoint\(parts\.soldierTorso,\s*0\.62,\s*0\.25\),\s*componentPoint\(parts\.soldierTorso,\s*0\.90,\s*0\.21\)/,
  );
});

test("generated cavalry rider bones use the requested 3-spine layout with a longer spine 1 and redistributed upper-torso length", () => {
  const source = loadSource();
  const helperStart = source.indexOf('function buildGeneratedSoldierUpperBodyFromMaterial({');
  const cavalryStart = source.indexOf('function buildCavalryProjectFromMaterial(inputImageData, fileName = "cavalry.png")');
  const upperBodySection = source.slice(helperStart, cavalryStart);
  assert.match(
    source,
    /const horseBody2CenterMount = addBone\(".*?",\s*horseBody2\.id,\s*componentPoint\(parts\.horseBody,\s*0\.43,\s*0\.595\),\s*componentPoint\(parts\.horseBody,\s*0\.4301,\s*0\.595\)/,
  );
  assert.match(
    upperBodySection,
    /const soldierSpine1 = addBone\(".*?1",\s*mountParentId,\s*componentPoint\(parts\.soldierTorso,\s*0\.46,\s*0\.77\),\s*componentPoint\(parts\.soldierTorso,\s*0\.49,\s*0\.23\)/,
  );
  assert.match(
    upperBodySection,
    /const soldierSpine2 = addBone\(".*?2",\s*soldierSpine1\.id,\s*componentPoint\(parts\.soldierTorso,\s*0\.47,\s*0\.59\),\s*componentPoint\(parts\.soldierTorso,\s*0\.5027,\s*0\.3117\)/,
  );
  assert.match(
    upperBodySection,
    /const soldierSpine3 = addBone\(".*?3",\s*soldierSpine2\.id,\s*componentPoint\(parts\.soldierTorso,\s*0\.49,\s*0\.42\),\s*componentPoint\(parts\.soldierTorso,\s*0\.525,\s*0\.168\)/,
  );
  assert.doesNotMatch(upperBodySection, /const soldierSpine4 = addBone\(/);
  assert.match(
    upperBodySection,
    /const soldierRightShoulder = addBone\(".*?",\s*soldierSpine2\.id,\s*componentPoint\(parts\.soldierTorso,\s*0\.36,\s*0\.25\),\s*componentPoint\(parts\.soldierTorso,\s*0\.08,\s*0\.21\)/,
  );
  assert.match(
    upperBodySection,
    /const soldierLeftShoulder = addBone\(".*?",\s*soldierSpine2\.id,\s*componentPoint\(parts\.soldierTorso,\s*0\.62,\s*0\.25\),\s*componentPoint\(parts\.soldierTorso,\s*0\.90,\s*0\.21\)/,
  );
});

test("generated cavalry rider torso piece shifts upward so spine 4 sits closer to the head after the longer torso rig is built", () => {
  const source = loadSource();
  assert.match(
    source,
    /const soldierTorsoPiece = addPiece\(".*?",\s*"cavalry-soldier-torso-piece",\s*soldierTorsoImageId,\s*parts\.soldierTorso,\s*80,/,
  );
  assert.match(
    source,
    /soldierSpine1\.id,\s*[\r\n\s]*soldierSpine2\.id,\s*[\r\n\s]*soldierSpine3\.id,\s*[\r\n\s]*soldierRightShoulder\.id,\s*[\r\n\s]*soldierLeftShoulder\.id,/,
  );
  assert.doesNotMatch(source, /soldierSpine4\.id/);
  assert.match(source, /const soldierTorsoLift = parts\.soldierTorso\.height \* transform\.scale \* 0\.36;/);
  assert.match(source, /soldierTorsoPiece\.y -= soldierTorsoLift;/);
  assert.match(source, /soldierTorsoPiece\.bindPose\.y -= soldierTorsoLift;/);
  assert.match(source, /soldierTorsoPiece\.attachment\.restPart\.y -= soldierTorsoLift;/);
});

test("generated cavalry horse neck and head form the requested mirrored-7 silhouette", () => {
  const source = loadSource();
  assert.match(
    source,
    /const horseBody1 = addBone\(".*? 1",\s*horseBody1LeftAnchor\.id,\s*componentPoint\(parts\.horseBody,\s*0\.18,\s*0\.62\),\s*componentPoint\(parts\.horseBody,\s*0\.28,\s*0\.61\)/,
  );
  assert.match(
    source,
    /const horseBody2 = addBone\(".*? 2",\s*horseBody1\.id,\s*componentPoint\(parts\.horseBody,\s*0\.28,\s*0\.61\),\s*componentPoint\(parts\.horseBody,\s*0\.58,\s*0\.58\)/,
  );
  assert.match(
    source,
    /const horseBody3 = addBone\(".*? 3",\s*horseBody2\.id,\s*componentPoint\(parts\.horseBody,\s*0\.58,\s*0\.58\),\s*componentPoint\(parts\.horseBody,\s*0\.65,\s*0\.54\)/,
  );
  assert.match(
    source,
    /const horseNeck1 = addBone\(".*?1",\s*horseBody3\.id,\s*componentPoint\(parts\.horseBody,\s*0\.65,\s*0\.54\),\s*componentPoint\(parts\.horseBody,\s*0\.81,\s*0\.36\)/,
  );
  assert.match(
    source,
    /const horseNeck2 = addBone\(".*?2",\s*horseNeck1\.id,\s*componentPoint\(parts\.horseBody,\s*0\.81,\s*0\.36\),\s*componentPoint\(parts\.horseBody,\s*0\.82,\s*0\.22\)/,
  );
  assert.match(
    source,
    /const horseHead1 = addBone\(".*?1",\s*horseNeck2\.id,\s*componentPoint\(parts\.horseBody,\s*0\.82,\s*0\.22\),\s*componentPoint\(parts\.horseBody,\s*0\.97,\s*0\.29\)/,
  );
});

test("generated cavalry front legs extend upper bones and shift leg pieces down until legs 3 and 4 share the rear-leg bottom line", () => {
  const source = loadSource();
  const body = extractFunctionBody(source, "function alignGeneratedCavalryFrontLegs(horseLegPieces, horseLegUpperBones, horseLegComponents, transform)");
  const alignGeneratedCavalryFrontLegs = new Function(
    `return function alignGeneratedCavalryFrontLegs(horseLegPieces, horseLegUpperBones, horseLegComponents, transform) {${body}};`,
  )();
  const pieces = [
    { y: 100, bindPose: { y: 100 }, attachment: { restPart: { y: 100 } } },
    { y: 110, bindPose: { y: 110 }, attachment: { restPart: { y: 110 } } },
    { y: 120, bindPose: { y: 120 }, attachment: { restPart: { y: 120 } } },
    { y: 130, bindPose: { y: 130 }, attachment: { restPart: { y: 130 } } },
  ];
  const uppers = [
    { length: 50, bindPose: { length: 50 } },
    { length: 51, bindPose: { length: 51 } },
    { length: 52, bindPose: { length: 52 } },
    { length: 53, bindPose: { length: 53 } },
  ];
  const components = [
    { maxY: 2158 },
    { maxY: 2145 },
    { maxY: 2133 },
    { maxY: 2120 },
  ];

  alignGeneratedCavalryFrontLegs(pieces, uppers, components, { scale: 0.5 });

  assert.equal(pieces[0].y, 100);
  assert.equal(pieces[1].y, 110);
  assert.equal(pieces[2].y, 132.5);
  assert.equal(pieces[2].bindPose.y, 132.5);
  assert.equal(pieces[2].attachment.restPart.y, 132.5);
  assert.equal(uppers[2].length, 64.5);
  assert.equal(uppers[2].bindPose.length, 64.5);
  assert.equal(pieces[3].y, 149);
  assert.equal(pieces[3].bindPose.y, 149);
  assert.equal(pieces[3].attachment.restPart.y, 149);
  assert.equal(uppers[3].length, 72);
  assert.equal(uppers[3].bindPose.length, 72);
});

test("generated cavalry rear leg 2 shortens its upper bone to 80 percent and shifts its piece upward by the removed distance", () => {
  const source = loadSource();
  const body = extractFunctionBody(source, "function adjustGeneratedCavalryRearLegTwo(horseLegPieces, horseLegUpperBones, factor = 0.8)");
  const adjustGeneratedCavalryRearLegTwo = new Function(
    `return function adjustGeneratedCavalryRearLegTwo(horseLegPieces, horseLegUpperBones, factor = 0.8) {${body}};`,
  )();
  const pieces = [
    { y: 100, bindPose: { y: 100 }, attachment: { restPart: { y: 100 } } },
    { y: 110, bindPose: { y: 110 }, attachment: { restPart: { y: 110 } } },
  ];
  const uppers = [
    { length: 50, bindPose: { length: 50 } },
    { length: 80, bindPose: { length: 80 } },
  ];

  adjustGeneratedCavalryRearLegTwo(pieces, uppers, 0.8);

  assert.equal(pieces[0].y, 100);
  assert.equal(uppers[0].length, 50);
  assert.equal(uppers[1].length, 64);
  assert.equal(uppers[1].bindPose.length, 64);
  assert.equal(pieces[1].y, 94);
  assert.equal(pieces[1].bindPose.y, 94);
  assert.equal(pieces[1].attachment.restPart.y, 94);
});

test("generated cavalry rider right leg 1 doubles its authored length while keeping the same start point", () => {
  const source = loadSource();
  assert.match(
    source,
    /const soldierRightLeg1 = addBone\(".*?1",\s*soldierSpine1\.id,\s*componentPoint\(parts\.soldierRightLeg,\s*0\.82,\s*0\.12\),\s*componentPoint\(parts\.soldierRightLeg,\s*0\.30,\s*0\.82\)/,
  );
  assert.match(
    source,
    /const soldierRightLegPiece = addPiece\(".*?",\s*"cavalry-soldier-right-leg-piece",\s*soldierRightLegImageId,\s*parts\.soldierRightLeg,\s*70,\s*\[/,
  );
  assert.match(source, /const soldierRightLeg1ExtraDrop = parts\.soldierRightLeg\.height \* transform\.scale \* 0\.35;/);
  assert.match(source, /soldierRightLegPiece\.y \+= soldierRightLeg1ExtraDrop;/);
  assert.match(source, /soldierRightLegPiece\.bindPose\.y \+= soldierRightLeg1ExtraDrop;/);
  assert.match(source, /soldierRightLegPiece\.attachment\.restPart\.y \+= soldierRightLeg1ExtraDrop;/);
});

test("generated cavalry import splits horse neck-head pixels out of the horse body component", () => {
  const source = loadSource();
  const body = extractFunctionBody(source, "function splitCavalryHorseBodyComponent(component, imageWidth)");
  const splitCavalryHorseBodyComponent = new Function(
    `return function splitCavalryHorseBodyComponent(component, imageWidth) {${body}};`,
  )();
  const pixelIndices = [];
  const imageWidth = 20;
  for (let y = 4; y <= 11; y += 1) {
    for (let x = 0; x <= 8; x += 1) {
      pixelIndices.push(y * imageWidth + x);
    }
  }
  for (let y = 1; y <= 3; y += 1) {
    for (let x = 0; x <= 6; x += 1) {
      pixelIndices.push(y * imageWidth + x);
    }
  }
  for (let y = 0; y <= 6; y += 1) {
    for (let x = 9; x <= 13; x += 1) {
      pixelIndices.push(y * imageWidth + x);
    }
  }
  for (let y = 4; y <= 7; y += 1) {
    for (let x = 8; x <= 10; x += 1) {
      pixelIndices.push(y * imageWidth + x);
    }
  }
  const component = {
    minX: 0,
    minY: 0,
    maxX: 13,
    maxY: 11,
    width: 14,
    height: 12,
    cx: 7,
    cy: 6,
    pixels: pixelIndices.length,
    pixelIndices,
  };

  const result = splitCavalryHorseBodyComponent(component, imageWidth);

  assert.ok(result.body);
  assert.ok(result.neckHead);
  assert.equal(result.body.pixels + result.neckHead.pixels, component.pixels);
  assert.ok(result.neckHead.pixels >= 32);
  assert.ok(result.body.pixels >= 32);
  assert.equal(result.neckHead.minX, 4);
  assert.equal(result.neckHead.maxX, 13);
  assert.equal(result.neckHead.minY, 0);
  assert.equal(result.body.maxX, 9);
  assert.ok(result.neckHead.pixelIndices.includes(1 * imageWidth + 4));
  assert.ok(result.neckHead.pixelIndices.includes(0 * imageWidth + 9));
  assert.ok(result.body.pixelIndices.includes(7 * imageWidth + 8));
  assert.ok(!result.neckHead.pixelIndices.includes(7 * imageWidth + 8));
  assert.ok(result.neckHead.pixelIndices.includes(5 * imageWidth + 10));
});

test("generated cavalry project mounts the split horse neck-head image on neck/head bones instead of the main horse body piece", () => {
  const source = loadSource();
  assert.match(
    source,
    /const \{ body: horseBodyComponent, neckHead: horseNeckHeadComponent \} = splitCavalryHorseBodyComponent\(parts\.horseBody,\s*inputImageData\.width\);/,
  );
  assert.match(
    source,
    /const horseNeckHeadImageId = horseNeckHeadComponent \? registerComponentImage\("horse-neck-head",\s*horseNeckHeadComponent\) : null;/,
  );
  assert.match(
    source,
    /addPiece\(".*?",\s*"cavalry-horse-piece",\s*horseBodyImageId,\s*horseBodyComponent,\s*30,\s*\[\s*horseBody1\.id,\s*horseBody2\.id,\s*horseBody3\.id,\s*\]\);/,
  );
  assert.match(
    source,
    /if \(horseNeckHeadImageId && horseNeckHeadComponent\) \{\s*addPiece\(".*?",\s*"cavalry-horse-neck-piece",\s*horseNeckHeadImageId,\s*horseNeckHeadComponent,\s*35,\s*\[\s*horseNeck1\.id,\s*horseNeck2\.id,\s*horseHead1\.id,\s*\]\);\s*\}/,
  );
});

test("generated material-replacement child bones snap to their parent ends while preserving world direction", () => {
  const source = loadSource();
  const body = extractFunctionBody(source, "function snapGeneratedChildrenToParentsPreserveDirection(nodes)");
  const snapGeneratedChildrenToParentsPreserveDirection = new Function(
    "normalizeBindPose",
    `return function snapGeneratedChildrenToParentsPreserveDirection(nodes) {${body}};`,
  )((pose) => ({
    x: Number(pose?.x) || 0,
    y: Number(pose?.y) || 0,
    rotation: Number(pose?.rotation) || 0,
    length: Math.max(4, Number(pose?.length) || 80),
    scaleX: Math.max(0.05, Number(pose?.scaleX) || 1),
    scaleY: Math.max(0.05, Number(pose?.scaleY) || 1),
  }));

  const nodeById = new Map();
  const worldPose = (node) => {
    if (!node.parentId) {
      return {
        worldX: node.x,
        worldY: node.y,
        worldRotation: node.rotation,
        worldScaleX: node.scaleX,
        worldScaleY: node.scaleY,
        length: node.length,
      };
    }
    const parent = nodeById.get(node.parentId);
    const parentPose = worldPose(parent);
    const angle = (parentPose.worldRotation * Math.PI) / 180;
    const anchor = {
      x: parentPose.worldX + Math.cos(angle) * parentPose.length * parentPose.worldScaleX,
      y: parentPose.worldY + Math.sin(angle) * parentPose.length * parentPose.worldScaleY,
    };
    const px = node.x * parentPose.worldScaleX;
    const py = node.y * parentPose.worldScaleY;
    return {
      worldX: anchor.x + px * Math.cos(angle) - py * Math.sin(angle),
      worldY: anchor.y + px * Math.sin(angle) + py * Math.cos(angle),
      worldRotation: parentPose.worldRotation + node.rotation,
      worldScaleX: parentPose.worldScaleX * node.scaleX,
      worldScaleY: parentPose.worldScaleY * node.scaleY,
      length: node.length,
    };
  };
  const resolveRestPartWorld = (piece) => {
    const restPart = piece.attachment.restPart;
    if (!restPart.parentBoneId) {
      return {
        x: restPart.x,
        y: restPart.y,
        rotation: restPart.rotation,
      };
    }
    const parentPose = worldPose(nodeById.get(restPart.parentBoneId));
    const angle = (parentPose.worldRotation * Math.PI) / 180;
    return {
      x: parentPose.worldX + Math.cos(angle) * parentPose.length * parentPose.worldScaleX + restPart.x * Math.cos(angle) - restPart.y * Math.sin(angle),
      y: parentPose.worldY + Math.sin(angle) * parentPose.length * parentPose.worldScaleY + restPart.x * Math.sin(angle) + restPart.y * Math.cos(angle),
      rotation: parentPose.worldRotation + restPart.rotation,
    };
  };
  const localFromWorldByParentPose = (parentPose, world) => {
    const angle = (-parentPose.worldRotation * Math.PI) / 180;
    const anchor = {
      x: parentPose.worldX + Math.cos((parentPose.worldRotation * Math.PI) / 180) * parentPose.length * parentPose.worldScaleX,
      y: parentPose.worldY + Math.sin((parentPose.worldRotation * Math.PI) / 180) * parentPose.length * parentPose.worldScaleY,
    };
    const dx = world.x - anchor.x;
    const dy = world.y - anchor.y;
    return {
      x: dx * Math.cos(angle) - dy * Math.sin(angle),
      y: dx * Math.sin(angle) + dy * Math.cos(angle),
      rotation: world.rotation - parentPose.worldRotation,
    };
  };

  const nodes = [
    { id: "root", parentId: null, x: 100, y: 80, rotation: 18, length: 60, scaleX: 1, scaleY: 1, bindPose: {} },
    { id: "child", parentId: "root", x: 14, y: -9, rotation: 26, length: 40, scaleX: 1, scaleY: 1, bindPose: {} },
    { id: "grand", parentId: "child", x: -11, y: 12, rotation: -31, length: 24, scaleX: 1, scaleY: 1, bindPose: {} },
    {
      id: "piece",
      parentId: null,
      x: 0,
      y: 0,
      rotation: 0,
      length: 4,
      scaleX: 1,
      scaleY: 1,
      bindPose: {},
      attachment: {
        fullSkin: true,
        skinBoneIds: ["child", "grand"],
        restPart: {
          x: 146,
          y: 118,
          rotation: 7,
          scale: 1,
          anchorX: 0.5,
          anchorY: 0.5,
          parentBoneId: null,
        },
      },
    },
  ];
  nodes.forEach((node) => nodeById.set(node.id, node));
  const beforeChild = worldPose(nodeById.get("child"));
  const beforeGrand = worldPose(nodeById.get("grand"));
  const beforePiece = resolveRestPartWorld(nodeById.get("piece"));
  const beforePieceLocalToChild = localFromWorldByParentPose(beforeChild, beforePiece);

  snapGeneratedChildrenToParentsPreserveDirection(nodes);

  assert.equal(nodeById.get("child").x, 0);
  assert.equal(nodeById.get("child").y, 0);
  assert.equal(nodeById.get("grand").x, 0);
  assert.equal(nodeById.get("grand").y, 0);
  const afterChild = worldPose(nodeById.get("child"));
  const afterGrand = worldPose(nodeById.get("grand"));
  assert.ok(Math.abs(afterChild.worldRotation - beforeChild.worldRotation) < 1e-6);
  assert.ok(Math.abs(afterGrand.worldRotation - beforeGrand.worldRotation) < 1e-6);
  assert.equal(nodeById.get("child").bindPose.x, 0);
  assert.equal(nodeById.get("child").bindPose.y, 0);
  assert.equal(nodeById.get("grand").bindPose.x, 0);
  assert.equal(nodeById.get("grand").bindPose.y, 0);
  assert.equal(nodeById.get("piece").attachment.restPart.parentBoneId, "child");
  assert.notDeepEqual(
    {
      x: nodeById.get("piece").attachment.restPart.x,
      y: nodeById.get("piece").attachment.restPart.y,
      rotation: nodeById.get("piece").attachment.restPart.rotation,
    },
    {
      x: beforePiece.x,
      y: beforePiece.y,
      rotation: beforePiece.rotation,
    },
  );
  const afterPiece = resolveRestPartWorld(nodeById.get("piece"));
  const afterPieceLocalToChild = localFromWorldByParentPose(afterChild, afterPiece);
  assert.ok(Math.abs(afterPieceLocalToChild.x - beforePieceLocalToChild.x) < 1e-6);
  assert.ok(Math.abs(afterPieceLocalToChild.y - beforePieceLocalToChild.y) < 1e-6);
  assert.ok(Math.abs(afterPieceLocalToChild.rotation - beforePieceLocalToChild.rotation) < 1e-6);
});

test("generated material-replacement snapping preserves parent offset for nodes explicitly marked to keep their mount position", () => {
  const source = loadSource();
  const body = extractFunctionBody(source, "function snapGeneratedChildrenToParentsPreserveDirection(nodes)");
  const snapGeneratedChildrenToParentsPreserveDirection = new Function(
    "normalizeBindPose",
    `return function snapGeneratedChildrenToParentsPreserveDirection(nodes) {${body}};`,
  )((pose) => ({
    x: Number(pose?.x) || 0,
    y: Number(pose?.y) || 0,
    rotation: Number(pose?.rotation) || 0,
    length: Math.max(4, Number(pose?.length) || 80),
    scaleX: Math.max(0.05, Number(pose?.scaleX) || 1),
    scaleY: Math.max(0.05, Number(pose?.scaleY) || 1),
  }));

  const nodes = [
    { id: "root", parentId: null, x: 100, y: 80, rotation: 0, length: 60, scaleX: 1, scaleY: 1, bindPose: {} },
    { id: "mount", parentId: "root", x: 18, y: -12, rotation: 0, length: 4, scaleX: 1, scaleY: 1, preserveParentOffset: true, bindPose: {} },
    { id: "child", parentId: "mount", x: 6, y: 4, rotation: 15, length: 20, scaleX: 1, scaleY: 1, bindPose: {} },
  ];

  snapGeneratedChildrenToParentsPreserveDirection(nodes);

  assert.equal(nodes[1].x, 18);
  assert.equal(nodes[1].y, -12);
  assert.equal(nodes[1].bindPose.x, 18);
  assert.equal(nodes[1].bindPose.y, -12);
  assert.equal(nodes[2].x, 0);
  assert.equal(nodes[2].y, 0);
});

test("generated cavalry rider upper-body bones keep the baseline snapping behavior instead of the temporary preserve-offset patch", () => {
  const source = loadSource();
  assert.doesNotMatch(source, /soldierRightShoulder\.preserveParentOffset = true;/);
  assert.doesNotMatch(source, /soldierLeftShoulder\.preserveParentOffset = true;/);
  assert.doesNotMatch(source, /soldierRightArm1\.preserveParentOffset = true;/);
  assert.doesNotMatch(source, /soldierRightArm2\.preserveParentOffset = true;/);
});

test("cavalry leg roots no longer make leg 1 share leg 2's parent or leg 3 share leg 4's parent", () => {
  const source = loadSource();
  assert.match(
    source,
    /const horseBody1LeftAnchor = addBone\(".*?",\s*null,\s*componentPoint\(parts\.horseBody,\s*0\.16,\s*0\.62\),\s*componentPoint\(parts\.horseBody,\s*0\.18,\s*0\.62\)/,
  );
  assert.match(
    source,
    /horseBody1LeftAnchor\.visible = false;/,
  );
  assert.match(
    source,
    /const horseLegRoots = \[horseBody1LeftAnchor\.id,\s*horseBody1\.id,\s*horseBody2\.id,\s*horseBody3\.id\];/,
  );
});

test("cavalry left anchor helper bone uses a readable Chinese name instead of mojibake", () => {
  const source = loadSource();
  assert.match(source, /const horseBody1LeftAnchor = addBone\("\\u9a6c\\u8eab 1 \\u5de6\\u951a\\u70b9"/);
  assert.doesNotMatch(source, /const horseBody1LeftAnchor = addBone\("椹�?1 宸﹂敋鐐\?"/);
});

test("cavalry generated labels stay readable instead of mojibake", () => {
  const source = loadSource();
  const helperStart = source.indexOf('function buildGeneratedSoldierUpperBodyFromMaterial({');
  const cavalryStart = source.indexOf('function buildCavalryProjectFromMaterial(inputImageData, fileName = "cavalry.png")');
  const nextAfterCavalry = source.indexOf('async function installSpearmanFistRigFromMaterial', cavalryStart);
  const upperBodySection = source.slice(helperStart, cavalryStart);
  const cavalryBody = source.slice(cavalryStart, nextAfterCavalry);
  assert.match(cavalryBody, /const horseBody1 = addBone\("\\u9a6c\\u8eab 1"/);
  assert.match(cavalryBody, /const horseNeck1 = addBone\("\\u9a6c\\u8116\\u5b50 1"/);
  assert.match(cavalryBody, /const horseHead1 = addBone\("\\u9a6c\\u5934 1"/);
  assert.match(upperBodySection, /const soldierSpine1 = addBone\("\\u58eb\\u5175\\u810a\\u690e 1"/);
  assert.match(upperBodySection, /const soldierRightShoulder = addBone\("\\u58eb\\u5175\\u53f3\\u80a9"/);
  assert.match(upperBodySection, /const soldierRightArm1 = addBone\("\\u58eb\\u5175\\u53f3\\u81c2 1"/);
  assert.match(cavalryBody, /addPiece\("\\u58eb\\u5175\\u6b66\\u5668", "cavalry-soldier-weapon-piece"/);
  assert.doesNotMatch(`${upperBodySection}` + "`n" + `${cavalryBody}`, /椹韩|椹剸|椹ご|澹叺|婢诡偄|姝﹀�\?/);
});


test("cavalry project bootstrap json stays valid and readable", () => {
  const project = JSON.parse(fs.readFileSync("src/faxian/leg/cavalry/project.json", "utf8"));
  assert.equal(project.format, "spine-node-timeline-editor");
  assert.equal(project.version, 1);
  assert.equal(project.name, "cavalry");
  assert.ok(Array.isArray(project.nodes));
  assert.ok(project.nodes.length > 1);
  assert.ok(Array.isArray(project.actions));
  assert.ok(project.actions.length >= 1);
});


