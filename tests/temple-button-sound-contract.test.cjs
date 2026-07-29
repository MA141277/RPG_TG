const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function readSource(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("temple action sources declare light button sounds for option interfaces", () => {
  const source = readSource(
    "src/application/house-modules/temple-house/temple-house-house-module.ts"
  );

  assert.match(
    source,
    /getTempleRootActions[\s\S]*buttonSound: "light"/
  );
  assert.match(
    source,
    /getTempleRestMenuActions[\s\S]*buttonSound: "light"/
  );
  assert.match(
    source,
    /getTempleWorkMenuActions[\s\S]*buttonSound: "light"/
  );
  assert.match(
    source,
    /reviewWorkChoices\.map<HouseActionViewModel>\([\s\S]*buttonSound: "light"/
  );
  assert.match(
    source,
    /leaveAction: \{[\s\S]*label: "离开寺庙"[\s\S]*buttonSound: "light"/
  );
});

test("temple work confirm overlays declare heavy start and light defer sounds centrally", () => {
  const source = readSource(
    "src/application/house-modules/temple-house/temple-house-house-module.ts"
  );

  assert.match(
    source,
    /confirmLabel: "现在开始"[\s\S]*cancelLabel: "稍后再领"[\s\S]*confirmButtonSound: "heavy"[\s\S]*cancelButtonSound: "light"/
  );
});

test("temple confirm overlay renderer consumes declarative button sound fields", () => {
  const { renderTempleHouseView } = require("../.test-dist/ui/views/house/temple-house-view.js");

  const html = renderTempleHouseView({
    moduleId: "temple-house",
    houseId: "house.temple",
    sceneTitle: "皇觉寺",
    sceneSubtitle: "寺庙事务",
    standbyRoster: [],
    dialogue: null,
    actionContainer: null,
    statusCard: null,
    overlay: {
      type: "confirm",
      title: "测试差事",
      paragraphs: ["测试描述"],
      confirmActionId: "confirm-start-temple-task:test",
      confirmLabel: "现在开始",
      cancelActionId: "cancel-activity-confirm",
      cancelLabel: "稍后再领",
      confirmButtonSound: "heavy",
      cancelButtonSound: "light",
    },
    leaveAction: {
      id: "leave-house",
      label: "离开寺庙",
    },
  });

  assert.match(
    html,
    /data-house-action="cancel-activity-confirm"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-house-action="confirm-start-temple-task:test"[\s\S]*data-button-sound="heavy"/
  );
});
