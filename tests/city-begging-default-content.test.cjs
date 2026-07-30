const test = require("node:test");
const assert = require("node:assert/strict");

test("city begging default content contains three fixed Haozhou locations with three options each", async () => {
  const { CITY_BEGGING_DEFAULT_LOCATIONS } = await import(
    "../src/content/playables/city-begging-default-content.ts"
  );

  assert.equal(CITY_BEGGING_DEFAULT_LOCATIONS.length, 3);
  assert.deepEqual(
    CITY_BEGGING_DEFAULT_LOCATIONS.map((location) => location.locationId),
    ["dongshi_mishi", "xicheng_guanyin", "beicheng_ciji"]
  );
  assert.deepEqual(
    CITY_BEGGING_DEFAULT_LOCATIONS.map((location) => location.baselineResult),
    ["xiong", "ping", "ji"]
  );

  for (const location of CITY_BEGGING_DEFAULT_LOCATIONS) {
    assert.equal(location.options.length, 3, location.locationId);
    assert.ok(location.encounterText.length > 20, location.locationId);
    assert.ok(location.closingText.length > 0, location.locationId);
    assert.ok(typeof location.backgroundId === "string");
  }
});

test("city begging default options lock the requested fixed fortune table", async () => {
  const { CITY_BEGGING_DEFAULT_LOCATIONS } = await import(
    "../src/content/playables/city-begging-default-content.ts"
  );

  const table = Object.fromEntries(
    CITY_BEGGING_DEFAULT_LOCATIONS.map((location) => [
      location.locationId,
      location.options.map((option) => option.fixedResult),
    ])
  );

  assert.deepEqual(table, {
    dongshi_mishi: ["xiong", "xiong", "xiong"],
    xicheng_guanyin: ["ping", "ping", "ji"],
    beicheng_ciji: ["ji", "ji", "ping"],
  });
});
