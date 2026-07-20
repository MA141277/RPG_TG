const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("campaign terrain view wires grass and sand texture layers into WebGL inputs", () => {
  const root = path.resolve(__dirname, "..");
  const mapViewSource = fs.readFileSync(
    path.join(root, "src/ui/views/map/map-view.ts"),
    "utf8"
  );
  const terrainSource = fs.readFileSync(
    path.join(root, "src/ui/views/map/campaign-terrain-webgl.ts"),
    "utf8"
  );
  const mapJson = JSON.parse(
    fs.readFileSync(
      path.join(root, "src/content/scenario-packs/zhuyuanzhang/maps.json"),
      "utf8"
    )
  );
  const yuanmoMapSource = fs.readFileSync(
    path.join(root, "src/content/yuanmo-campaign-map.ts"),
    "utf8"
  );

  assert.match(mapViewSource, /grassTextureImageUrl: string \| null/);
  assert.match(mapViewSource, /sandTextureImageUrl: string \| null/);
  assert.match(mapViewSource, /layer\.id === "map_grass_texture"/);
  assert.match(mapViewSource, /layer\.id === "map_sand_texture"/);
  assert.match(mapViewSource, /data-map-grass-texture-url/);
  assert.match(mapViewSource, /data-map-sand-texture-url/);

  assert.match(terrainSource, /grassTextureUrl: string \| null/);
  assert.match(terrainSource, /sandTextureUrl: string \| null/);
  assert.match(terrainSource, /canvas\.dataset\.mapGrassTextureUrl/);
  assert.match(terrainSource, /canvas\.dataset\.mapSandTextureUrl/);
  assert.match(terrainSource, /createCampaignMaterialSemanticModel/);
  assert.match(terrainSource, /createShorelineChainTextureModel/);

  const campaignMap = mapJson.find((map) => map.id === "map.yuanmo_campaign");
  assert.ok(campaignMap);
  const layers = campaignMap.layers;
  assert.ok(
    layers.some(
      (layer) =>
        layer.id === "map_grass_texture" &&
        layer.imageUrl === "./assets/maps/campaign-grass-texture.png"
    )
  );
  assert.ok(
    layers.some(
      (layer) =>
        layer.id === "map_sand_texture" &&
        layer.imageUrl === "./assets/maps/campaign-sand-texture.png"
    )
  );

  assert.match(yuanmoMapSource, /map_grass_textureUrl/);
  assert.match(yuanmoMapSource, /map_sand_textureUrl/);
  assert.ok(
    fs.existsSync(path.join(root, "src/assets/yuanmo-map/campaign-grass-texture.png"))
  );
  assert.ok(
    fs.existsSync(path.join(root, "src/assets/yuanmo-map/campaign-sand-texture.png"))
  );
});
