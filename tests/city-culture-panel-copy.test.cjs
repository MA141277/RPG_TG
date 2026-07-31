const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const cityViewPath = "src/ui/views/city/city-view.ts";
const cityMenuPath = "src/application/city-menu/city-menu.ts";
const citiesPath = "src/content/scenario-packs/zhuyuanzhang/cities.json";

function readSource(path) {
  return fs.readFileSync(path, "utf8");
}

function extractCityDescriptionKeys(source) {
  const match = source.match(
    /const CITY_DESCRIPTION_BY_ID: Record<string, string> = \{([\s\S]*?)\n\};/
  );

  assert.ok(match, "CITY_DESCRIPTION_BY_ID should be declared as a local copy table");

  return new Set(
    Array.from(match[1].matchAll(/"(city\.[^"]+)":/g), ([, cityId]) => cityId)
  );
}

test("city culture panel hides reserved population and security fields", () => {
  const source = readSource(cityViewPath);

  assert.doesNotMatch(source, /<h3[^>]*>预留字段<\/h3>/);
  assert.doesNotMatch(source, /cultureViewModel\.population/);
  assert.doesNotMatch(source, /cultureViewModel\.security/);
});

test("zhuyuanzhang city culture copy covers every defined city", () => {
  const source = readSource(cityMenuPath);
  const descriptionKeys = extractCityDescriptionKeys(source);
  const cityDefinitions = JSON.parse(readSource(citiesPath));
  const cityIds = cityDefinitions.map((city) => city.id);

  assert.deepEqual(
    cityIds.filter((cityId) => !descriptionKeys.has(cityId)),
    [],
    "every city in the scenario data should have explicit culture copy"
  );

  assert.match(source, /city\.yingtian[\s\S]*应天府/);
  assert.match(source, /city\.yangzhou[\s\S]*张士诚/);
  assert.match(source, /city\.wuchang[\s\S]*陈友谅/);
  assert.match(source, /city\.anfeng[\s\S]*韩林儿/);
  assert.match(source, /city\.huangcun[\s\S]*荒村/);
});
