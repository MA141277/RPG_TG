const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const cityViewPath = path.join(
  process.cwd(),
  "src",
  "ui",
  "views",
  "city",
  "city-view.ts"
);

function readCityViewSource() {
  return fs.readFileSync(cityViewPath, "utf8");
}

test("city locations panel no longer ships as an empty stub", () => {
  const source = readCityViewSource();
  const match = source.match(
    /function renderLocationsDeckView\(([\s\S]*?)\): string \{([\s\S]*?)\n\}/m
  );

  assert.ok(match, "Expected renderLocationsDeckView source.");
  assert.doesNotMatch(match[2], /^\s*return\s+"";\s*$/m);
});

test("city locations panel renders both city-entry and house refs", () => {
  const source = readCityViewSource();
  const match = source.match(
    /function renderLocationsDeckView\(([\s\S]*?)\): string \{([\s\S]*?)\n\}/m
  );

  assert.ok(match, "Expected renderLocationsDeckView source.");
  assert.match(match[2], /c-city-locations-view/);
  assert.match(match[2], /data-city-location-entry-ref/);
  assert.match(match[2], /data-city-location-house-ref/);
});
