const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createBuiltinScriptEditorPlayableCatalog,
} = require("../.test-dist/modules/script-editor/host/script-editor-playable-catalog.js");

test("script editor builtin playable catalog uses authoring prefixes and drops retired building-flow builtin entries", () => {
  const catalog = createBuiltinScriptEditorPlayableCatalog();
  const definitionsById = new Map(
    catalog
      .listPlayableDefinitions()
      .map((definition) => [definition.id, definition.commandPrefix])
  );
  const integrationIds = catalog
    .listPlayableIntegrations()
    .map((integration) => integration.integrationId);

  assert.equal(definitionsById.get("activity-qte"), "playable.activity-qte.");
  assert.equal(definitionsById.get("city-begging"), "playable.city-begging.");
  assert.equal(definitionsById.get("grain-accounting"), "playable.grain-accounting.");
  assert.equal(
    definitionsById.get("medicine-compounding"),
    "playable.medicine-compounding."
  );
  assert.equal(
    definitionsById.get("temple-copy-scripture"),
    "playable.temple-copy-scripture."
  );
  assert.equal(definitionsById.get("building-flow"), undefined);
  assert.equal(
    integrationIds.includes("playable.building-flow.house.default"),
    false
  );
});
