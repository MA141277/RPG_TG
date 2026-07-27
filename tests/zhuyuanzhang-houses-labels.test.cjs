const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("zhuyuanzhang houses backAction labels use readable Chinese copy", () => {
  const housesPath = path.join(
    __dirname,
    "../src/content/scenario-packs/zhuyuanzhang/houses.json"
  );
  const houses = JSON.parse(fs.readFileSync(housesPath, "utf8"));

  for (const house of houses) {
    const label = house?.backAction?.label;
    assert.equal(
      label,
      "返回城市",
      `${house.id} should use the canonical backAction label`
    );
  }
});
