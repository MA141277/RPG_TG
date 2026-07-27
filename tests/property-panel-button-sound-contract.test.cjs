const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function readSource(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("global player panel attribute button declares the heavy button sound", () => {
  const source = readSource("src/ui/panels/global-player-panel.ts");

  assert.match(
    source,
    /data-action="open-player-detail"[\s\S]*data-button-sound="heavy"/
  );
});

test("character detail card and return buttons declare the light button sound", () => {
  const source = readSource("src/ui/views/character/character-detail-view.ts");

  assert.match(source, /data-action="open-cards"[\s\S]*data-button-sound="light"/);
  assert.match(
    source,
    /data-action="close-character-detail"[\s\S]*data-button-sound="light"/
  );
});

test("map and character-detail entry buttons declare heavy sounds for troop and backpack entry", () => {
  const mapSource = readSource("src/ui/views/map/map-view.ts");
  const characterDetailSource = readSource("src/ui/views/character/character-detail-view.ts");

  assert.match(
    mapSource,
    /data-action="open-troop-editor"[\s\S]*data-button-sound="heavy"/
  );
  assert.match(
    mapSource,
    /data-action="open-backpack"[\s\S]*data-button-sound="heavy"/
  );
  assert.match(
    characterDetailSource,
    /data-action="open-backpack"[\s\S]*data-button-sound="heavy"/
  );
});

test("card and backpack library return buttons declare the light button sound", () => {
  const cardLibrarySource = readSource("src/ui/views/cards/card-library-view.ts");
  const backpackSource = readSource("src/ui/views/inventory/backpack-view.ts");

  assert.match(
    cardLibrarySource,
    /data-action="close-overlay"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    backpackSource,
    /data-action="close-overlay"[\s\S]*data-button-sound="light"/
  );
});
