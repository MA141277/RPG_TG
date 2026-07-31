const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const cityViewPath = "src/ui/views/city/city-view.ts";

function readCityViewSource() {
  return fs.readFileSync(cityViewPath, "utf8");
}

test("city management panel explains future city-owner building controls instead of debug fields", () => {
  const source = readCityViewSource();

  assert.match(
    source,
    /成为城主后，可以调整建筑布局，新建\/更换\/升级\/拆除建筑，提升城市等级。/
  );
  assert.doesNotMatch(source, /canManageTown/);
  assert.doesNotMatch(source, /townLevel/);
  assert.doesNotMatch(source, /buildingList/);
  assert.doesNotMatch(source, /taxRate/);
  assert.doesNotMatch(source, /当前版本仅保留接口，不实现建设、升级、税率与治安功能。/);
});
