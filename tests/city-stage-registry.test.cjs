const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const zhuCityStageRoot = path.join(
  root,
  "src",
  "content",
  "scenario-packs",
  "zhuyuanzhang",
  "city-stages"
);
const registryPath = path.join(
  root,
  "src",
  "ui",
  "views",
  "city",
  "city-stage-registry.ts"
);
const layoutPath = path.join(
  root,
  "src",
  "ui",
  "views",
  "city",
  "city-stage-layout.ts"
);

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function resolveProjectAssetPath(assetPath) {
  return path.join(root, assetPath);
}

test("city-stage registry source auto-discovers layout and prefab pairs", () => {
  const source = readText(registryPath);

  assert.match(source, /import\.meta\.glob/);
  assert.match(source, /getCityStageBundleForCity/);
  assert.match(source, /city-layout/);
  assert.match(source, /city-prefabs/);
});

test("city-stage registry preserves the old Haozhou stage mapping after adding Huangcun", () => {
  const source = readText(registryPath);

  assert.match(source, /cityStageSlugByCityId/);
  assert.match(source, /"city\.kulan": "haozhou"/);
  assert.match(source, /const mappedCitySlug = cityStageSlugByCityId\[cityId\]/);
  assert.match(
    source,
    /findBundleByNormalizedKey\(\s*normalizeCityLookupKey\(mappedCitySlug\)\s*\)/
  );
});

test("city-stage renderer no longer hardcodes Haozhou JSON imports", () => {
  const source = readText(layoutPath);

  assert.doesNotMatch(source, /haozhouCityLayoutModule/);
  assert.doesNotMatch(source, /haozhouCityPrefabModule/);
  assert.match(source, /getCityStageBundleForCity/);
});

test("Yuanmo city-stage layouts expose clickable house entries for non-opening cities", () => {
  const targetCities = [
    { slug: "anfeng", requiredHouseId: "house.anfeng.temple" },
    { slug: "runing", requiredHouseId: "house.runing.temple" },
    { slug: "luzhou", requiredHouseId: "house.luzhou.temple" },
  ];

  for (const targetCity of targetCities) {
    const layoutPath = path.join(
      zhuCityStageRoot,
      `${targetCity.slug}-city-layout.json`
    );
    const prefabsPath = path.join(
      zhuCityStageRoot,
      `${targetCity.slug}-city-prefabs.json`
    );

    assert.equal(
      fs.existsSync(layoutPath),
      true,
      `Expected ${targetCity.slug} city-stage layout to exist.`
    );
    assert.equal(
      fs.existsSync(prefabsPath),
      true,
      `Expected ${targetCity.slug} city-stage prefabs to exist.`
    );

    const layout = JSON.parse(fs.readFileSync(layoutPath, "utf8"));
    const prefabs = JSON.parse(fs.readFileSync(prefabsPath, "utf8"));
    const entities = Array.isArray(layout.entities) ? layout.entities : [];
    const houseEntities = entities.filter(
      (entity) => entity?.entry?.type === "house"
    );

    assert.equal(layout.map?.id, targetCity.slug);
    assert.equal(
      typeof layout.map?.backgroundImage === "string" &&
        layout.map.backgroundImage.trim().length > 0,
      true,
      `Expected ${targetCity.slug} city-stage layout to render a base map image.`
    );
    assert.equal(
      typeof layout.map?.foregroundImage === "string" &&
        layout.map.foregroundImage.trim().length > 0,
      true,
      `Expected ${targetCity.slug} city-stage layout to render a foreground occlusion image.`
    );
    assert.equal(
      fs.existsSync(resolveProjectAssetPath(layout.map.backgroundImage)),
      true,
      `Expected ${targetCity.slug} background image asset to exist.`
    );
    assert.equal(
      fs.existsSync(resolveProjectAssetPath(layout.map.foregroundImage)),
      true,
      `Expected ${targetCity.slug} foreground image asset to exist.`
    );
    assert.equal(Array.isArray(prefabs.prefabs), true);
    assert.equal(
      houseEntities.length >= 9,
      true,
      `Expected ${targetCity.slug} layout to expose the default city house set.`
    );
    assert.equal(
      houseEntities.some(
        (entity) => entity.entry.houseId === targetCity.requiredHouseId
      ),
      true,
      `Expected ${targetCity.slug} temple house to be clickable.`
    );
    assert.equal(
      houseEntities.every((entity) => entity.interaction?.clickable === true),
      true,
      `Expected ${targetCity.slug} house entities to be clickable.`
    );
  }
});
