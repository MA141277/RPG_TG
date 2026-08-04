const assert = require("node:assert/strict");
const test = require("node:test");

const {
  parseScenarioPack,
  loadScenarioPackFromUrl,
} = require("../.test-dist/application/scenario/scenario-pack-loader.js");
const {
  loadContentPackFromManifestText,
} = require("../.test-dist/application/content/content-pack-loader.js");

function createBaseScenarioPack() {
  return {
    schemaVersion: 1,
    id: "scenario.test.playable-shells",
    title: "Scenario Playable Shells",
    scenarioProfile: {
      id: "profile.test.playable-shells",
      playerCharacterId: "char.player",
      chapterId: "chapter.test",
      initialLocation: {
        mapId: "map.test",
        cityId: "city.test",
        houseId: null,
        view: "city",
      },
    },
    characters: [{ id: "char.player", name: "Player" }],
    events: [],
    dialogues: [],
  };
}

test("scenario pack parser accepts playables, playable integrations, and playable shells", () => {
  const pack = parseScenarioPack({
    ...createBaseScenarioPack(),
    playables: [
      {
        id: "flow.test.loader",
        commandPrefix: "playable.flow.test.loader.",
      },
    ],
    playableIntegrations: [
      {
        integrationId: "playable.flow.test.loader.house.default",
        playableId: "flow.test.loader",
        ownerDefaults: {
          ownerKind: "house",
          ownerId: "house.test",
          returnPolicy: "reenter-owner",
        },
        trigger: {
          triggerId: "trigger.playable.flow.test.loader.house.default",
          ownerKind: "house",
          trigger: "manual-launch",
        },
        outcomeConfig: {},
      },
    ],
    playableShells: [
      {
        id: "flow.test.loader",
        title: "Loader Flow Shell",
        initialNodeId: "node.start",
        nodes: [
          {
            id: "node.start",
            type: "text",
            text: "start",
            nextNodeId: "node.complete",
          },
          {
            id: "node.complete",
            type: "complete",
            outcome: "success",
          },
        ],
      },
    ],
  });

  assert.equal(pack.playables?.[0]?.id, "flow.test.loader");
  assert.equal(
    pack.playableIntegrations?.[0]?.integrationId,
    "playable.flow.test.loader.house.default"
  );
  assert.equal(pack.playableShells?.[0]?.id, "flow.test.loader");
});

test("scenario pack parser rejects retired flowDefinitions family", () => {
  assert.throws(
    () =>
      parseScenarioPack({
        ...createBaseScenarioPack(),
        flowDefinitions: [],
      }),
    /flowDefinitions is retired; use playableShells/i
  );
});

test("scenario pack parser rejects retired flowPlayables family", () => {
  assert.throws(
    () =>
      parseScenarioPack({
        ...createBaseScenarioPack(),
        flowPlayables: [],
      }),
    /flowPlayables is retired; use playableShells/i
  );
});

test("scenario pack parser accepts runtime menu and location support families", () => {
  const pack = parseScenarioPack({
    ...createBaseScenarioPack(),
    menuResources: [
      {
        id: "menu-resource.test.temple.primary",
        title: "寺庙菜单",
        entries: [
          {
            id: "entry.review",
            label: "评定",
            menuFamily: "building",
            targetFamily: "event",
            targetId: "event.building.template.house.temple.review",
            isVisible: true,
            isEnabled: true,
            disabledHint: "",
          },
        ],
      },
    ],
    menuInstances: [
      {
        id: "menu-instance.test.temple.primary",
        title: "寺庙菜单实例",
        resourceId: "menu-resource.test.temple.primary",
      },
    ],
    locationAccess: [
      {
        id: "location-access.test.temple",
        targetFamily: "building",
        targetId: "house.test.temple",
        purpose: "enter",
        blockedMessage: "闲人止步",
        conditions: [],
      },
    ],
    houseModuleDefaults: {
      "temple-house": {
        reviewEntryEventId: "event.building.template.house.temple.review",
      },
    },
  });

  assert.equal(pack.menuResources?.[0]?.id, "menu-resource.test.temple.primary");
  assert.equal(pack.menuInstances?.[0]?.resourceId, "menu-resource.test.temple.primary");
  assert.equal(pack.locationAccess?.[0]?.targetId, "house.test.temple");
  assert.equal(
    pack.houseModuleDefaults?.["temple-house"]?.reviewEntryEventId,
    "event.building.template.house.temple.review"
  );
});

test("content pack loader hydrates playable shell families from manifest files", async () => {
  const originalFetch = global.fetch;

  global.fetch = async (input) => {
    const url = typeof input === "string" ? input : input.url;
    if (url.endsWith("/playables.json")) {
      return { ok: true, json: async () => [{ id: "flow.test.loader" }] };
    }
    if (url.endsWith("/playable-integrations.json")) {
      return {
        ok: true,
        json: async () => [
          {
            integrationId: "playable.flow.test.loader.house.default",
            playableId: "flow.test.loader",
          },
        ],
      };
    }
    if (url.endsWith("/playable-shells.json")) {
      return {
        ok: true,
        json: async () => [
          {
            id: "flow.test.loader",
            title: "Loader Flow Shell",
            initialNodeId: "node.start",
            nodes: [],
          },
        ],
      };
    }

    return { ok: true, json: async () => [] };
  };

  try {
    const pack = await loadContentPackFromManifestText(
      JSON.stringify({
        schemaVersion: 1,
        id: "pack.test.playable-shells",
        title: "Pack Playable Shells",
        files: {
          playables: "playables.json",
          playableIntegrations: "playable-integrations.json",
          playableShells: "playable-shells.json",
        },
      }),
      "file:///virtual/pack.json"
    );

    assert.equal(pack.playables?.[0]?.id, "flow.test.loader");
    assert.equal(
      pack.playableIntegrations?.[0]?.integrationId,
      "playable.flow.test.loader.house.default"
    );
    assert.equal(pack.playableShells?.[0]?.id, "flow.test.loader");
  } finally {
    global.fetch = originalFetch;
  }
});

test("content pack loader rejects retired manifest flowPlayables entry", async () => {
  await assert.rejects(
    () =>
      loadContentPackFromManifestText(
        JSON.stringify({
          schemaVersion: 1,
          id: "pack.test.legacy-flow-playables",
          title: "Legacy Flow Playables",
          files: {
            flowPlayables: "flow-playables.json",
          },
        }),
        "file:///virtual/pack.json"
      ),
    /files\.flowPlayables is retired; use files\.playableShells instead/i
  );
});

test("content pack loader hydrates runtime menu and location support families from manifest files", async () => {
  const originalFetch = global.fetch;

  global.fetch = async (input) => {
    const url = typeof input === "string" ? input : input.url;
    if (url.endsWith("/menu-resources.json")) {
      return {
        ok: true,
        json: async () => [
          {
            id: "menu-resource.test.temple.primary",
            title: "寺庙菜单",
            entries: [],
          },
        ],
      };
    }
    if (url.endsWith("/menu-instances.json")) {
      return {
        ok: true,
        json: async () => [
          {
            id: "menu-instance.test.temple.primary",
            title: "寺庙菜单实例",
            resourceId: "menu-resource.test.temple.primary",
          },
        ],
      };
    }
    if (url.endsWith("/location-access.json")) {
      return {
        ok: true,
        json: async () => [
          {
            id: "location-access.test.temple",
            targetFamily: "building",
            targetId: "house.test.temple",
            purpose: "enter",
            blockedMessage: "闲人止步",
            conditions: [],
          },
        ],
      };
    }
    if (url.endsWith("/house-module-defaults.json")) {
      return {
        ok: true,
        json: async () => ({
          "temple-house": {
            reviewEntryEventId: "event.building.template.house.temple.review",
          },
        }),
      };
    }

    return { ok: true, json: async () => [] };
  };

  try {
    const pack = await loadContentPackFromManifestText(
      JSON.stringify({
        schemaVersion: 1,
        id: "pack.test.runtime-building-support",
        title: "Pack Runtime Building Support",
        files: {
          menuResources: "menu-resources.json",
          menuInstances: "menu-instances.json",
          locationAccess: "location-access.json",
          houseModuleDefaults: "house-module-defaults.json",
        },
      }),
      "file:///virtual/pack.json"
    );

    assert.equal(pack.menuResources?.[0]?.id, "menu-resource.test.temple.primary");
    assert.equal(
      pack.menuInstances?.[0]?.resourceId,
      "menu-resource.test.temple.primary"
    );
    assert.equal(pack.locationAccess?.[0]?.targetId, "house.test.temple");
    assert.equal(
      pack.houseModuleDefaults?.["temple-house"]?.reviewEntryEventId,
      "event.building.template.house.temple.review"
    );
  } finally {
    global.fetch = originalFetch;
  }
});

test("content pack loader rejects retired manifest flowDefinitions entry", async () => {
  await assert.rejects(
    () =>
      loadContentPackFromManifestText(
        JSON.stringify({
          schemaVersion: 1,
          id: "pack.test.retired-flow-definitions",
          title: "Retired Flow Definitions",
          files: {
            flowDefinitions: "flow-definitions.json",
          },
        }),
        "file:///virtual/pack.json"
      ),
    /files\.flowDefinitions is retired; use files\.playableShells instead/i
  );
});

test("scenario pack loader rejects retired manifest flowPlayables publication entry", async () => {
  const originalFetch = global.fetch;

  global.fetch = async (input) => {
    const url = typeof input === "string" ? input : input.url;
    if (url.endsWith("/pack.json")) {
      return {
        ok: true,
        json: async () => ({
          schemaVersion: 1,
          kind: "scenario-pack",
          id: "pack.test.legacy-flow-playables",
          title: "Legacy Flow Playables",
          files: {
            scenarioProfile: "scenario-profile.json",
            characters: "characters.json",
            events: "events.json",
            dialogues: "dialogues.json",
            flowPlayables: "flow-playables.json",
          },
        }),
      };
    }
    if (url.endsWith("/scenario-profile.json")) {
      return {
        ok: true,
        json: async () => ({
          id: "profile.test.legacy-flow-playables",
          playerCharacterId: "char.player",
          chapterId: "chapter.test",
          initialLocation: {
            mapId: "map.test",
            cityId: "city.test",
            houseId: null,
            view: "city",
          },
        }),
      };
    }
    if (url.endsWith("/characters.json")) {
      return {
        ok: true,
        json: async () => [{ id: "char.player", name: "Player" }],
      };
    }
    if (url.endsWith("/events.json") || url.endsWith("/dialogues.json")) {
      return { ok: true, json: async () => [] };
    }

    return { ok: false, status: 404 };
  };

  try {
    await assert.rejects(
      () =>
        loadScenarioPackFromUrl(
          "https://example.test/script-editor-templates/zhuyuanzhang/pack.json"
        ),
      /files\.flowPlayables is retired; use files\.playableShells instead/i
    );
  } finally {
    global.fetch = originalFetch;
  }
});
