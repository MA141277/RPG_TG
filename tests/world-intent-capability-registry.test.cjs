const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

function requireSource(path) {
  assert.equal(
    fs.existsSync(path),
    true,
    `Expected source file to exist: ${path}`
  );
  return fs.readFileSync(path, "utf8");
}

test("world-intent domain and capability snapshot contracts expose the Haozhou world-intent surface", () => {
  const domainSource = requireSource("src/domain/world-intent.ts");
  const snapshotSource = requireSource(
    "src/application/world-intent/select-world-intent-capability-snapshot.ts"
  );
  const requestBuilderSource = requireSource(
    "src/application/world-intent/world-intent-request-builder.ts"
  );

  assert.match(domainSource, /WorldCapabilitySnapshot/u);
  assert.match(domainSource, /WorldAiIntentResponse/u);
  assert.match(domainSource, /WorldObservedEvent/u);
  assert.match(domainSource, /WorldAiContextRuntimeState/u);
  assert.match(snapshotSource, /selectWorldIntentCapabilitySnapshot/u);
  assert.match(snapshotSource, /reachableHouses/u);
  assert.match(snapshotSource, /talkTargets/u);
  assert.match(snapshotSource, /serviceActions/u);
  assert.match(snapshotSource, /negotiableStoryNodes/u);
  assert.match(requestBuilderSource, /buildWorldIntentRequest/u);
  assert.match(requestBuilderSource, /recentEvents/u);
});

test("world-intent capability snapshot only exposes the currently legal Haozhou houses, talk targets, service actions, and negotiation nodes", () => {
  const {
    selectWorldIntentCapabilitySnapshot,
  } = require("../.test-dist/application/world-intent/select-world-intent-capability-snapshot.js");

  const snapshot = selectWorldIntentCapabilitySnapshot({
    cityId: "city.kulan",
    currentHouseId: "house.kulan.temple",
    currentHouseModuleId: "temple-house",
    storyStage: "huangjue-temple",
    houses: [
      {
        houseId: "house.kulan.temple",
        houseName: "皇觉寺",
        available: true,
      },
      {
        houseId: "house.kulan.market",
        houseName: "商铺",
        available: true,
      },
      {
        houseId: "house.kulan.keep",
        houseName: "帅府",
        available: false,
        refusalText: "帅府大门紧闭。",
      },
    ],
    talkTargets: [
      {
        characterId: "char.kulan_temple_abbot",
        characterName: "住持",
        available: true,
      },
      {
        characterId: "char.kulan_market_guest",
        characterName: "客商",
        available: false,
      },
    ],
    serviceActions: [
      {
        actionId: "temple-work",
        label: "寺内干活",
        available: true,
      },
      {
        actionId: "keep-audience",
        label: "求见郭子兴",
        available: false,
      },
    ],
    negotiableStoryNodes: [
      {
        nodeId: "temple.request-early-begging",
        label: "请求提早化缘",
        available: true,
      },
      {
        nodeId: "keep.assignment-negotiation",
        label: "求领差事",
        available: false,
      },
    ],
    leaveAction: {
      actionId: "leave-house",
      label: "离开寺庙",
      available: true,
    },
  });

  assert.equal(snapshot.cityId, "city.kulan");
  assert.equal(snapshot.currentHouseId, "house.kulan.temple");
  assert.equal(snapshot.currentHouseModuleId, "temple-house");
  assert.equal(snapshot.storyStage, "huangjue-temple");
  assert.deepEqual(
    snapshot.reachableHouses.map((house) => house.houseId),
    ["house.kulan.temple", "house.kulan.market"]
  );
  assert.deepEqual(
    snapshot.talkTargets.map((target) => target.characterId),
    ["char.kulan_temple_abbot"]
  );
  assert.deepEqual(
    snapshot.serviceActions.map((action) => action.actionId),
    ["temple-work"]
  );
  assert.deepEqual(
    snapshot.negotiableStoryNodes.map((node) => node.nodeId),
    ["temple.request-early-begging"]
  );
  assert.equal(snapshot.leaveAction?.actionId, "leave-house");
});
