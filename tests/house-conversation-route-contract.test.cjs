const test = require("node:test");
const assert = require("node:assert/strict");

test("hidden indoor route snapshot keeps only legal capabilities and validates routes fail-closed", () => {
  const {
    selectHouseConversationCapabilitySnapshot,
    resolveAvailableHouseConversationRoute,
  } = require("../.test-dist/application/house-conversation/select-house-conversation-capability-snapshot.js");

  const snapshot = selectHouseConversationCapabilitySnapshot({
    cityId: "city.kulan",
    houseId: "house.kulan.market",
    moduleId: "market-house",
    targetCharacterId: "char.kulan_merchant",
    targetCharacterName: "钱掌柜",
    switchableNpcTargets: [
      {
        characterId: "char.kulan_merchant",
        characterName: "钱掌柜",
        available: true,
      },
      {
        characterId: "char.kulan_apothecary",
        characterName: "孙药商",
        available: false,
      },
    ],
    houseActions: [
      {
        actionId: "buy-goods",
        label: "买入货物",
        available: true,
      },
      {
        actionId: "debug-action",
        label: "调试功能",
        available: false,
      },
    ],
    houseServices: [
      {
        serviceId: "market-buy",
        label: "买货",
        description: "直接根据自然语言结算买货。",
        enabled: true,
      },
      {
        serviceId: "market-debug",
        label: "调试服务",
        description: "不该暴露给 AI。",
        enabled: false,
      },
    ],
    reachableHouses: [
      {
        houseId: "house.kulan.grain_shop",
        houseName: "粮铺",
        available: true,
      },
      {
        houseId: "house.kulan.keep",
        houseName: "帅府",
        available: false,
      },
    ],
    leaveAction: {
      actionId: "leave-house",
      label: "离开货栈",
      available: true,
    },
    negotiableStoryNodes: [
      {
        nodeId: "temple.request-early-begging",
        label: "请求提前化缘",
        allowedApproaches: ["plea"],
        targetCharacterId: "char.abbot",
        available: true,
      },
      {
        nodeId: "keep.assignment-negotiation",
        label: "请缨领差",
        allowedApproaches: ["competence"],
        targetCharacterId: "char.lord",
        available: false,
      },
    ],
  });

  assert.equal(snapshot.cityId, "city.kulan");
  assert.equal(snapshot.houseId, "house.kulan.market");
  assert.equal(snapshot.targetCharacterId, "char.kulan_merchant");
  assert.deepEqual(
    snapshot.switchableNpcTargets.map((target) => target.characterId),
    ["char.kulan_merchant"]
  );
  assert.deepEqual(
    snapshot.houseActions.map((action) => action.actionId),
    ["buy-goods"]
  );
  assert.deepEqual(
    snapshot.houseServices.map((service) => service.serviceId),
    ["market-buy"]
  );
  assert.deepEqual(
    snapshot.reachableHouses.map((house) => house.houseId),
    ["house.kulan.grain_shop"]
  );
  assert.equal(snapshot.leaveAction?.actionId, "leave-house");
  assert.deepEqual(
    snapshot.negotiableStoryNodes.map((node) => node.nodeId),
    ["temple.request-early-begging"]
  );

  assert.deepEqual(
    resolveAvailableHouseConversationRoute({
      snapshot,
      route: {
        kind: "go-to-house",
        houseId: "house.kulan.grain_shop",
      },
    }),
    {
      kind: "go-to-house",
      houseId: "house.kulan.grain_shop",
    }
  );
  assert.deepEqual(
    resolveAvailableHouseConversationRoute({
      snapshot,
      route: {
        kind: "negotiate-story-node",
        nodeId: "temple.request-early-begging",
        approach: "plea",
      },
    }),
    {
      kind: "negotiate-story-node",
      nodeId: "temple.request-early-begging",
      approach: "plea",
      targetCharacterId: "char.abbot",
    }
  );
  assert.equal(
    resolveAvailableHouseConversationRoute({
      snapshot,
      route: {
        kind: "go-to-house",
        houseId: "house.kulan.keep",
      },
    }),
    null
  );
});

test("hidden indoor app snapshot reuses the current Haozhou negotiation nodes from the provided selector", () => {
  const {
    selectHouseConversationCapabilitySnapshotForApp,
  } = require("../.test-dist/application/house-conversation/select-house-conversation-capability-snapshot.js");

  const snapshot = selectHouseConversationCapabilitySnapshotForApp({
    appState: {
      gameState: {
        world: {
          currentCityId: "city.kulan",
          currentHouseId: "house.kulan.temple",
        },
        ui: {
          currentView: "house",
        },
      },
      characterDefinitions: [{ id: "char.abbot", name: "住持" }],
    },
    stageOutput: {
      type: "house",
      activeHouse: {
        id: "house.kulan.temple",
        name: "皇觉寺",
        moduleId: "temple-house",
        defaultCharacterId: "char.abbot",
      },
      moduleViewModel: {
        moduleId: "temple-house",
        standbyRoster: [{ characterId: "char.abbot", name: "住持" }],
        actionContainer: null,
        leaveAction: { id: "leave-house", label: "离开寺庙" },
      },
      cityNpcSummaries: [],
    },
    cityDefinitions: [],
    houseDefinitions: [],
    houseAccessRefusalRules: [],
    targetCharacterId: "char.abbot",
    selectConversationServices: () => [],
    selectNegotiableStoryNodes: () => [
      {
        nodeId: "temple.request-early-begging",
        label: "请求提前化缘",
        allowedApproaches: ["plea"],
        targetCharacterId: "char.abbot",
      },
    ],
  });

  assert.ok(snapshot != null);
  assert.deepEqual(
    snapshot.negotiableStoryNodes.map((node) => node.nodeId),
    ["temple.request-early-begging"]
  );
  assert.equal(snapshot.negotiableStoryNodes[0]?.targetCharacterId, "char.abbot");
});
