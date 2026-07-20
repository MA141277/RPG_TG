const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("map view renders a map-only party-editor entry button", () => {
  const source = fs.readFileSync("src/ui/views/map/map-view.ts", "utf8");
  assert.match(source, /data-action="open-party-editor"/);
  assert.match(source, /class="c-map-party-editor-entry"/);
  assert.match(source, />\s*部队\s*</);
});

test("party-editor view renders the requested layout and only exit is interactive", () => {
  const viewSource = fs.readFileSync("src/ui/views/party/party-editor-view.ts", "utf8");
  const stateSource = fs.readFileSync("src/application/formation/formation-stage.ts", "utf8");
  assert.match(viewSource, /class="view-party-editor"/);
  assert.match(viewSource, /class="c-party-editor__resource-bar"/);
  assert.match(viewSource, /class="c-party-editor__commands"/);
  assert.match(viewSource, /data-action="\$\{button\.actionId\}"/);
  assert.match(viewSource, /button\.actionId == null \? "disabled" : ""/);
  assert.match(stateSource, /队伍编辑|朱重八本队|解散队伍/);
  assert.match(stateSource, /close-party-editor/);
});
