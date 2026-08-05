const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const test = require("node:test");

async function importModule(relativePath) {
  return import(pathToFileURL(path.join(process.cwd(), relativePath)).href);
}

function walkRelativeFiles(rootPath) {
  return fs
    .readdirSync(rootPath, { withFileTypes: true })
    .flatMap((entry) => {
      const nextPath = path.join(rootPath, entry.name);
      if (entry.isDirectory()) {
        return walkRelativeFiles(nextPath).map((relativePath) =>
          path.join(entry.name, relativePath).replace(/\\/g, "/")
        );
      }
      return [entry.name];
    })
    .sort();
}

test("zhuyuanzhang source contract keeps exactly two maintained packs, one published pack, and one retired legacy physical root", async () => {
  const contract = await importModule(
    "tools/zhuyuanzhang-source-sync-contract.mjs"
  );

  assert.deepEqual(Object.keys(contract.MAINTAINED_PACK_ROOTS), [
    "builtinRuntimePack",
    "scriptEditorTemplatePack",
  ]);
  assert.deepEqual(Object.keys(contract.PUBLISHED_PACK_ROOTS), [
    "registeredBuiltinTemplatePublication",
  ]);

  for (const relativeRoot of [
    ...Object.values(contract.MAINTAINED_PACK_ROOTS),
    ...Object.values(contract.PUBLISHED_PACK_ROOTS),
  ]) {
    assert.equal(
      fs.existsSync(path.join(process.cwd(), relativeRoot)),
      true,
      `expected zhuyuanzhang pack root to exist: ${relativeRoot}`
    );
  }
  assert.equal(
    contract.LEGACY_PUBLIC_TEMPLATE_PUBLICATION_ROOT,
    "public/script-editor-templates/zhuyuanzhang"
  );
});

test("zhuyuanzhang legacy public publication physical root is retired", async () => {
  const contract = await importModule(
    "tools/zhuyuanzhang-source-sync-contract.mjs"
  );

  assert.equal(
    fs.existsSync(
      path.join(process.cwd(), contract.LEGACY_PUBLIC_TEMPLATE_PUBLICATION_ROOT)
    ),
    false
  );
});

test("zhuyuanzhang registered builtin template publication only ships manifest files plus map-referenced assets", () => {
  const publicationRoot = path.join(
    process.cwd(),
    "public",
    "builtin-script-editor-templates",
    "zhuyuanzhang"
  );
  const manifest = JSON.parse(
    fs.readFileSync(path.join(publicationRoot, "pack.json"), "utf8")
  );
  const maps = JSON.parse(
    fs.readFileSync(path.join(publicationRoot, "maps.json"), "utf8")
  );
  const allowedFiles = new Set([
    "pack.json",
    ...Object.values(manifest.files),
  ]);

  for (const mapRecord of Array.isArray(maps) ? maps : []) {
    for (const assetPath of [
      mapRecord?.primaryImageUrl,
      mapRecord?.regionOverlayImageUrl,
      mapRecord?.campaignHexGridUrl,
      mapRecord?.campaignVegetationRulesUrl,
      ...(Array.isArray(mapRecord?.layers)
        ? mapRecord.layers.map((layer) => layer?.imageUrl)
        : []),
    ]) {
      if (
        typeof assetPath !== "string" ||
        assetPath.length === 0 ||
        /^(https?:|data:|blob:|\/)/.test(assetPath)
      ) {
        continue;
      }
      allowedFiles.add(assetPath.replace(/^\.\//, ""));
    }
  }

  const walkFiles = (directoryPath) =>
    fs.readdirSync(directoryPath, { withFileTypes: true }).flatMap((entry) => {
      const nextPath = path.join(directoryPath, entry.name);
      if (entry.isDirectory()) {
        return walkFiles(nextPath);
      }
      return [path.relative(publicationRoot, nextPath).replace(/\\/g, "/")];
    });
  const extraFiles = walkFiles(publicationRoot)
    .sort()
    .filter((relativePath) => !allowedFiles.has(relativePath));

  assert.deepEqual(extraFiles, []);
});

test("zhuyuanzhang registered builtin template publication keeps map asset references self-contained for folder import", () => {
  const publicationRoot = path.join(
    process.cwd(),
    "public",
    "builtin-script-editor-templates",
    "zhuyuanzhang"
  );
  const maps = JSON.parse(
    fs.readFileSync(path.join(publicationRoot, "maps.json"), "utf8")
  );

  for (const mapRecord of Array.isArray(maps) ? maps : []) {
    for (const assetPath of [
      mapRecord?.primaryImageUrl,
      mapRecord?.regionOverlayImageUrl,
      mapRecord?.campaignHexGridUrl,
      mapRecord?.campaignVegetationRulesUrl,
      ...(Array.isArray(mapRecord?.layers)
        ? mapRecord.layers.map((layer) => layer?.imageUrl)
        : []),
    ]) {
      if (typeof assetPath !== "string" || assetPath.length === 0) {
        continue;
      }

      assert.doesNotMatch(assetPath, /^(https?:|data:|blob:|\/)/);
      assert.equal(
        fs.existsSync(
          path.join(publicationRoot, assetPath.replace(/^\.\//, ""))
        ),
        true,
        `registered builtin template folder-import asset should stay self-contained: ${assetPath}`
      );
    }
  }
});

test("zhuyuanzhang builtin template only ships manifest files plus map-referenced assets", () => {
  const templateRoot = path.join(
    process.cwd(),
    "src",
    "modules",
    "script-editor",
    "builtin-templates",
    "zhuyuanzhang"
  );
  const manifest = JSON.parse(
    fs.readFileSync(path.join(templateRoot, "pack.json"), "utf8")
  );
  const maps = JSON.parse(
    fs.readFileSync(path.join(templateRoot, "maps.json"), "utf8")
  );
  const allowedFiles = new Set([
    "pack.json",
    ...Object.values(manifest.files),
  ]);

  for (const mapRecord of Array.isArray(maps) ? maps : []) {
    for (const assetPath of [
      mapRecord?.primaryImageUrl,
      mapRecord?.regionOverlayImageUrl,
      mapRecord?.campaignHexGridUrl,
      mapRecord?.campaignVegetationRulesUrl,
      ...(Array.isArray(mapRecord?.layers)
        ? mapRecord.layers.map((layer) => layer?.imageUrl)
        : []),
    ]) {
      if (
        typeof assetPath !== "string" ||
        assetPath.length === 0 ||
        /^(https?:|data:|blob:|\/)/.test(assetPath)
      ) {
        continue;
      }
      allowedFiles.add(assetPath.replace(/^\.\//, ""));
    }
  }

  const extraFiles = walkRelativeFiles(templateRoot)
    .sort()
    .filter((relativePath) => !allowedFiles.has(relativePath));

  assert.deepEqual(extraFiles, []);
});

test("zhuyuanzhang source contract keeps only the registered default template url", async () => {
  const contract = await importModule(
    "tools/zhuyuanzhang-source-sync-contract.mjs"
  );
  const configSource = fs.readFileSync(
    path.join(process.cwd(), "src", "modules", "script-editor", "config.ts"),
    "utf8"
  );
  const syncToolSource = fs.readFileSync(
    path.join(process.cwd(), "tools", "sync-zhuyuanzhang-startup-templates.mjs"),
    "utf8"
  );

  assert.match(
    configSource,
    /DEFAULT_SCRIPT_EDITOR_TEMPLATE_SCENARIO_PACK_URL\s*=\s*\r?\n\s*"\/builtin-script-editor-templates\/zhuyuanzhang\/pack\.json"/
  );
  assert.equal(
    contract.DEFAULT_TEMPLATE_REGISTERED_PACK_URL,
    "/builtin-script-editor-templates/zhuyuanzhang/pack.json"
  );
  assert.match(
    syncToolSource,
    /from "\.\/zhuyuanzhang-source-sync-contract\.mjs"/
  );
});

test("zhuyuanzhang source contract resolves either maintained pack as the sync source", async () => {
  const contract = await importModule(
    "tools/zhuyuanzhang-source-sync-contract.mjs"
  );
  const runtimeDirection = contract.resolveZhuyuanzhangSyncDirection(
    process.cwd(),
    "builtin-runtime-pack"
  );
  const templateDirection = contract.resolveZhuyuanzhangSyncDirection(
    process.cwd(),
    "script-editor-template-pack"
  );

  assert.deepEqual(contract.SUPPORTED_SYNC_SOURCES, [
    "builtin-runtime-pack",
    "script-editor-template-pack",
  ]);
  assert.equal(
    runtimeDirection.sourceRoot,
    path.join(
      process.cwd(),
      "src",
      "content",
      "scenario-packs",
      "zhuyuanzhang"
    )
  );
  assert.deepEqual(runtimeDirection.targetRoots, [
    path.join(
      process.cwd(),
      "src",
      "modules",
      "script-editor",
      "builtin-templates",
      "zhuyuanzhang"
    ),
    path.join(
      process.cwd(),
      "public",
      "builtin-script-editor-templates",
      "zhuyuanzhang"
    ),
  ]);
  assert.equal(
    templateDirection.sourceRoot,
    path.join(
      process.cwd(),
      "src",
      "modules",
      "script-editor",
      "builtin-templates",
      "zhuyuanzhang"
    )
  );
  assert.deepEqual(templateDirection.targetRoots, [
    path.join(
      process.cwd(),
      "src",
      "content",
      "scenario-packs",
      "zhuyuanzhang"
    ),
    path.join(
      process.cwd(),
      "public",
      "builtin-script-editor-templates",
      "zhuyuanzhang"
    ),
  ]);
});

test("zhuyuanzhang source contract records the first shared sync whitelist and deferred files", async () => {
  const contract = await importModule(
    "tools/zhuyuanzhang-source-sync-contract.mjs"
  );

  assert.deepEqual(contract.SHARED_SYNC_FILE_RULES.map((rule) => rule.fileName), [
    "scenario-profile.json",
    "characters.json",
    "text-entries.json",
    "activities.json",
    "pack.json",
    "cities.json",
    "maps.json",
    "events.json",
    "city-entries.json",
    "houses.json",
  ]);
  assert.deepEqual(contract.DEFERRED_SYNC_FILE_RULES.map((rule) => rule.fileName), []);
});

test("zhuyuanzhang source contract records pack manifest ownership boundaries for shared pack.json projection sync", async () => {
  const contract = await importModule(
    "tools/zhuyuanzhang-source-sync-contract.mjs"
  );

  assert.deepEqual(contract.PACK_MANIFEST_SHARED_FILE_KEYS, [
    "activities",
    "buildingArrangements",
    "cards",
    "characters",
    "cities",
    "cityEntries",
    "cityNpcPools",
    "cityPortraits",
    "dialogues",
    "eventBindings",
    "events",
    "historicalCharacterIdByCharacterId",
    "historicalCharacters",
    "historicalCityRosters",
    "houseModuleDefaults",
    "houses",
    "locationAccess",
    "maps",
    "meetingActionSets",
    "meetingBindings",
    "meetingChoiceSets",
    "meetingPanels",
    "meetings",
    "menuInstances",
    "menuResources",
    "playableIntegrations",
    "playableShells",
    "playables",
    "scenarioProfile",
    "settlements",
    "textEntries",
    "valuables",
  ]);
  assert.deepEqual(contract.PACK_MANIFEST_RUNTIME_ONLY_FILE_KEYS, [
    "houseAccessRefusalRules",
    "scenes",
  ]);
  assert.deepEqual(contract.PACK_MANIFEST_TEMPLATE_ONLY_FILE_KEYS, [
    "portraitVariants",
    "portraits",
  ]);
});

test("zhuyuanzhang source contract records city-entry mapping boundaries for shared city-entries projection sync", async () => {
  const contract = await importModule(
    "tools/zhuyuanzhang-source-sync-contract.mjs"
  );

  assert.deepEqual(contract.CITY_ENTRY_TEMPLATE_ONLY_IDS, [
    "city-entry.kulan.temple",
    "city-entry.kulan.keep",
    "city-entry.kulan.tea-house",
    "city-entry.kulan.market",
    "city-entry.kulan.grain-shop",
    "city-entry.kulan.medicine-house",
    "city-entry.kulan.inn",
  ]);
  assert.equal(
    contract.CITY_ENTRY_TEMPLATE_LEADER_RESIDENCE_TARGET_HOUSE_ID,
    "house.template.leader_residence"
  );
  assert.equal(
    contract.CITY_ENTRY_RUNTIME_LEADER_RESIDENCE_TARGET_HOUSE_ID_PREFIX,
    "house."
  );
  assert.equal(
    contract.CITY_ENTRY_RUNTIME_LEADER_RESIDENCE_TARGET_HOUSE_ID_SUFFIX,
    ".leader_residence"
  );
});

test("zhuyuanzhang source contract records cities.json field ownership boundaries before projection helpers", async () => {
  const contract = await importModule(
    "tools/zhuyuanzhang-source-sync-contract.mjs"
  );

  assert.deepEqual(contract.CITY_SHARED_FIELD_KEYS, [
    "regionId",
    "mapNodeId",
    "neighbourCityIds",
    "travelCost",
    "tags",
    "prosperity",
    "danger",
    "specialDemand",
  ]);
  assert.deepEqual(contract.CITY_TEMPLATE_ONLY_FIELD_KEYS, [
    "mountedBuildings",
    "mapPlacement",
    "menuInstanceIds",
  ]);
  assert.deepEqual(contract.CITY_PACK_SPECIFIC_FIELD_KEYS, ["id"]);
});

test("zhuyuanzhang source contract records maps.json projection boundaries before projection helpers", async () => {
  const contract = await importModule(
    "tools/zhuyuanzhang-source-sync-contract.mjs"
  );

  assert.deepEqual(contract.MAP_RUNTIME_CANONICAL_IDS, [
    "map.prototype_frontier",
    "map.yuanmo_campaign",
  ]);
  assert.deepEqual(contract.MAP_RUNTIME_ONLY_FIELD_KEYS, [
    "campaignHexGridUrl",
    "campaignVegetationRulesUrl",
    "campaignStructureProfileId",
  ]);
  assert.deepEqual(contract.MAP_TEMPLATE_PRESERVED_FIELD_KEYS, [
    "layers",
    "primaryImageUrl",
    "regionOverlayImageUrl",
  ]);
});

test("zhuyuanzhang template map projection keeps template asset surface while rewriting runtime-canonical map content", async () => {
  const syncTool = await importModule(
    "tools/sync-zhuyuanzhang-startup-templates.mjs"
  );

  assert.equal(typeof syncTool.projectTemplateMapsForSync, "function");

  assert.deepEqual(
    syncTool.projectTemplateMapsForSync(
      [
        {
          id: "map.prototype_frontier",
          name: "边境地图（运行时）",
          backgroundId: "bg.runtime.frontier",
          nodes: [{ cityId: "city.kulan", x: 5, y: 6 }],
        },
        {
          id: "map.yuanmo_campaign",
          name: "运行时战役图",
          backgroundId: "bg.runtime.campaign",
          mode: "campaign",
          initialPlayerCoordinate: { x: 10, y: 20 },
          coordinateSpace: { width: 509, height: 451 },
          displaySize: { width: 1484, height: 1060 },
          nodes: [
            {
              id: "settlement.fenyang_province",
              label: "濠州",
              x: 10,
              y: 20,
              kind: "city",
              cityId: "city.kulan",
              summary: "runtime start",
            },
            {
              id: "settlement.runtime.only",
              label: "运行时新增点",
              x: 30,
              y: 40,
              kind: "settlement",
              summary: "runtime only",
            },
          ],
          stats: {
            regionCount: 200,
            settlementCount: 2,
            fortCount: 0,
            resourceCount: 0,
            resourceSummary: "",
          },
          layers: [{ id: "runtime-only-layer", imageUrl: "./assets/maps/runtime-only.png" }],
          primaryImageUrl: "./assets/maps/runtime-primary.png",
          regionOverlayImageUrl: "./assets/maps/runtime-regions.png",
          campaignHexGridUrl: "./assets/maps/runtime-grid.json",
          campaignVegetationRulesUrl: "./assets/maps/runtime-vegetation.json",
          campaignStructureProfileId: "runtime.structure-profile",
        },
      ],
      [
        {
          id: "map.prototype_frontier",
          name: "边境地图（模板）",
          backgroundId: "bg.template.frontier",
          nodes: [{ cityId: "city.kulan", x: 2, y: 2 }],
        },
        {
          id: "map.yuanmo_campaign",
          name: "模板战役图",
          backgroundId: "bg.template.campaign",
          mode: "campaign",
          initialPlayerCoordinate: { x: 334, y: 318 },
          coordinateSpace: { width: 509, height: 451 },
          displaySize: { width: 1484, height: 1060 },
          nodes: [
            {
              id: "settlement.fenyang_province",
              label: "濠州（模板）",
              x: 334,
              y: 318,
              kind: "settlement",
              summary: "template anchor",
            },
            {
              id: "fort.template.only",
              label: "模板专属要塞",
              x: 500,
              y: 500,
              kind: "fort",
              summary: "template only",
            },
          ],
          stats: {
            regionCount: 200,
            settlementCount: 1,
            fortCount: 1,
            resourceCount: 0,
            resourceSummary: "",
          },
          layers: [{ id: "template-layer", imageUrl: "./assets/maps/template-layer.png" }],
          primaryImageUrl: "./assets/maps/template-primary.png",
          regionOverlayImageUrl: "./assets/maps/template-regions.png",
        },
      ]
    ),
    [
      {
        id: "map.prototype_frontier",
        name: "边境地图（运行时）",
        backgroundId: "bg.runtime.frontier",
        nodes: [{ cityId: "city.kulan", x: 2, y: 2 }],
      },
      {
        id: "map.yuanmo_campaign",
        name: "运行时战役图",
        backgroundId: "bg.runtime.campaign",
        mode: "campaign",
        initialPlayerCoordinate: { x: 334, y: 318 },
        coordinateSpace: { width: 509, height: 451 },
        displaySize: { width: 1484, height: 1060 },
        nodes: [
          {
            id: "settlement.fenyang_province",
            label: "濠州",
            x: 334,
            y: 318,
            kind: "city",
            cityId: "city.kulan",
            summary: "runtime start",
          },
          {
            id: "settlement.runtime.only",
            label: "运行时新增点",
            x: 30,
            y: 40,
            kind: "settlement",
            summary: "runtime only",
          },
        ],
        stats: {
          regionCount: 200,
          settlementCount: 2,
          fortCount: 0,
          resourceCount: 0,
          resourceSummary: "",
        },
        layers: [{ id: "template-layer", imageUrl: "./assets/maps/template-layer.png" }],
        primaryImageUrl: "./assets/maps/template-primary.png",
        regionOverlayImageUrl: "./assets/maps/template-regions.png",
      },
    ]
  );
});

test("zhuyuanzhang current template maps already match runtime-to-template map projection", async () => {
  const syncTool = await importModule(
    "tools/sync-zhuyuanzhang-startup-templates.mjs"
  );
  const runtimeMaps = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "content",
        "scenario-packs",
        "zhuyuanzhang",
        "maps.json"
      ),
      "utf8"
    )
  );
  const templateMaps = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "modules",
        "script-editor",
        "builtin-templates",
        "zhuyuanzhang",
        "maps.json"
      ),
      "utf8"
    )
  );

  assert.deepEqual(
    syncTool.projectTemplateMapsForSync(runtimeMaps, templateMaps),
    templateMaps
  );
});

test("zhuyuanzhang source contract records runtime-canonical event ids and the remaining template-only event family", async () => {
  const contract = await importModule(
    "tools/zhuyuanzhang-source-sync-contract.mjs"
  );

  assert.deepEqual(contract.EVENT_RUNTIME_CANONICAL_IDS, [
    "event.story.zhu_yuanzhang.ordination",
    "event.story.zhu_yuanzhang.first_temple_review",
    "event.story.zhu_yuanzhang.unlock_begging",
    "event.story.zhu_yuanzhang.runing_broadcast",
    "event.story.zhu_yuanzhang.haozhou_return_encounter",
    "event.building.template.house.temple.review",
    "event.building.house.kulan.temple.copy_scripture",
    "event.building.house.kulan.temple.sweep_courtyard",
    "event.building.template.house.temple.leave",
    "event.building.template.house.temple.donate",
    "event.building.house.kulan.temple.carry_water",
  ]);
  assert.deepEqual(contract.EVENT_RUNTIME_STORY_FORMAT_GAP_IDS, [
    "event.story.zhu_yuanzhang.ordination",
    "event.story.zhu_yuanzhang.first_temple_review",
    "event.story.zhu_yuanzhang.unlock_begging",
    "event.story.zhu_yuanzhang.runing_broadcast",
    "event.story.zhu_yuanzhang.haozhou_return_encounter",
  ]);
  assert.deepEqual(contract.EVENT_RUNTIME_TEMPLATE_FORMAT_PARITY_IDS, [
    "event.building.template.house.temple.review",
    "event.building.house.kulan.temple.copy_scripture",
    "event.building.house.kulan.temple.sweep_courtyard",
    "event.building.template.house.temple.leave",
    "event.building.template.house.temple.donate",
    "event.building.house.kulan.temple.carry_water",
  ]);
  assert.equal(contract.EVENT_TEMPLATE_ONLY_IDS.length, 38);
});

test("zhuyuanzhang template-only event ids are still actively referenced by event-bindings and menu resources", async () => {
  const contract = await importModule(
    "tools/zhuyuanzhang-source-sync-contract.mjs"
  );
  const templateBindings = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "modules",
        "script-editor",
        "builtin-templates",
        "zhuyuanzhang",
        "event-bindings.json"
      ),
      "utf8"
    )
  );
  const runtimeMenuResources = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "content",
        "scenario-packs",
        "zhuyuanzhang",
        "menu-resources.json"
      ),
      "utf8"
    )
  );
  const templateOnlyIds = new Set(contract.EVENT_TEMPLATE_ONLY_IDS);

  const boundTemplateOnlyIds = new Set(
    templateBindings
      .map((binding) => binding?.eventId)
      .filter((eventId) => templateOnlyIds.has(eventId))
  );
  const runtimeMenuTargetIds = new Set(
    runtimeMenuResources.flatMap((resource) =>
      (Array.isArray(resource?.entries) ? resource.entries : [])
        .map((entry) => entry?.targetId)
        .filter((targetId) => templateOnlyIds.has(targetId))
    )
  );

  assert.equal(boundTemplateOnlyIds.size, contract.EVENT_TEMPLATE_ONLY_IDS.length - 2);
  assert.equal(
    boundTemplateOnlyIds.has("event.playable.grain_accounting.failure_reward"),
    false
  );
  assert.equal(
    boundTemplateOnlyIds.has("event.playable.medicine_compounding.failure_reward"),
    false
  );
  assert.equal(runtimeMenuTargetIds.size > 0, true);
  assert.equal(
    runtimeMenuTargetIds.has("event.building.template.home.rest"),
    true
  );
  assert.equal(
    runtimeMenuTargetIds.has("event.building.template.house.keep.review"),
    true
  );
  assert.equal(
    runtimeMenuTargetIds.has("event.building.template.house.market.trade"),
    true
  );
});

test("zhuyuanzhang runtime-canonical story events still have a template-format gap while runtime temple event subset already matches template authored shape", async () => {
  const contract = await importModule(
    "tools/zhuyuanzhang-source-sync-contract.mjs"
  );
  const runtimeEvents = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "content",
        "scenario-packs",
        "zhuyuanzhang",
        "events.json"
      ),
      "utf8"
    )
  );
  const templateEvents = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "modules",
        "script-editor",
        "builtin-templates",
        "zhuyuanzhang",
        "events.json"
      ),
      "utf8"
    )
  );
  const runtimeById = new Map(runtimeEvents.map((event) => [event.id, event]));
  const templateById = new Map(templateEvents.map((event) => [event.id, event]));

  for (const eventId of contract.EVENT_RUNTIME_STORY_FORMAT_GAP_IDS) {
    const runtimeEvent = runtimeById.get(eventId);
    const templateEvent = templateById.get(eventId);
    assert.equal(typeof runtimeEvent?.trigger, "object");
    assert.equal(Array.isArray(runtimeEvent?.conditions), true);
    assert.equal(typeof runtimeEvent?.entrySceneId, "string");
    assert.equal(typeof templateEvent?.dialogueId, "string");
    assert.equal(Object.prototype.hasOwnProperty.call(templateEvent, "trigger"), false);
    assert.equal(
      Object.prototype.hasOwnProperty.call(templateEvent, "entrySceneId"),
      false
    );
  }

  for (const eventId of contract.EVENT_RUNTIME_TEMPLATE_FORMAT_PARITY_IDS) {
    assert.deepEqual(templateById.get(eventId), runtimeById.get(eventId));
  }
});

test("zhuyuanzhang template event projection keeps template-only events while rewriting runtime-canonical events into template-authored shape", async () => {
  const syncTool = await importModule(
    "tools/sync-zhuyuanzhang-startup-templates.mjs"
  );

  assert.equal(typeof syncTool.projectTemplateEventsForSync, "function");

  assert.deepEqual(
    syncTool.projectTemplateEventsForSync(
      [
        {
          id: "event.story.zhu_yuanzhang.ordination",
          chapterId: "chapter.test",
          name: "运行时剃度",
          occurrence: "once",
          trigger: { timing: "house-enter" },
          conditions: [{ type: "flag", key: "a", expected: false }],
          entrySceneId: "scene.runtime.ordination",
          tags: ["runtime-story"],
        },
        {
          id: "event.building.template.house.temple.review",
          chapterId: "chapter.test",
          name: "运行时评定",
          occurrence: "repeatable",
          tags: ["runtime-building"],
          dialogueId: "scene.runtime.review",
        },
      ],
      [
        {
          id: "event.story.zhu_yuanzhang.ordination",
          chapterId: "chapter.stale",
          name: "模板剃度",
          occurrence: "once",
          tags: ["template-story"],
          dialogueId: "scene.template.ordination",
        },
        {
          id: "event.building.template.house.temple.review",
          chapterId: "chapter.stale",
          name: "模板评定",
          occurrence: "repeatable",
          tags: ["template-building"],
          dialogueId: "scene.template.review",
        },
        {
          id: "event.building.template.house.keep.review",
          chapterId: "chapter.keep",
          name: "保留模板专属",
          occurrence: "repeatable",
          tags: ["template-only"],
          dialogueId: "scene.template.keep.review",
        },
      ]
    ),
    [
      {
        id: "event.story.zhu_yuanzhang.ordination",
        chapterId: "chapter.test",
        name: "运行时剃度",
        occurrence: "once",
        tags: ["runtime-story"],
        dialogueId: "scene.runtime.ordination",
      },
      {
        id: "event.building.template.house.temple.review",
        chapterId: "chapter.test",
        name: "运行时评定",
        occurrence: "repeatable",
        tags: ["runtime-building"],
        dialogueId: "scene.runtime.review",
      },
      {
        id: "event.building.template.house.keep.review",
        chapterId: "chapter.keep",
        name: "保留模板专属",
        occurrence: "repeatable",
        tags: ["template-only"],
        dialogueId: "scene.template.keep.review",
      },
    ]
  );
});

test("zhuyuanzhang current template events already match runtime-to-template event projection", async () => {
  const syncTool = await importModule(
    "tools/sync-zhuyuanzhang-startup-templates.mjs"
  );
  const runtimeEvents = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "content",
        "scenario-packs",
        "zhuyuanzhang",
        "events.json"
      ),
      "utf8"
    )
  );
  const templateEvents = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "modules",
        "script-editor",
        "builtin-templates",
        "zhuyuanzhang",
        "events.json"
      ),
      "utf8"
    )
  );

  assert.deepEqual(
    syncTool.projectTemplateEventsForSync(runtimeEvents, templateEvents),
    templateEvents
  );
});

test("zhuyuanzhang template city projection can collapse runtime concrete houseIds while preserving template-only editor fields", async () => {
  const syncTool = await importModule(
    "tools/sync-zhuyuanzhang-startup-templates.mjs"
  );

  assert.equal(typeof syncTool.projectTemplateCitiesForSync, "function");

  assert.deepEqual(
    syncTool.projectTemplateCitiesForSync(
      [
        {
          id: "city.kulan",
          name: "运行时濠州",
          regionId: "region.runtime.frontier",
          mapNodeId: "settlement.runtime.haozhou",
          houseIds: [
            "house.kulan.leader_residence",
            "house.kulan.temple",
            "home_001",
            "house.kulan.keep",
          ],
          neighbourCityIds: ["city.yingtian"],
          travelCost: 2,
          tags: ["runtime"],
          prosperity: 77,
          danger: 12,
          specialDemand: ["salt"],
        },
      ],
      [
        {
          id: "city.kulan",
          name: "模板濠州",
          regionId: "region.template.frontier",
          mapNodeId: "settlement.template.haozhou",
          houseIds: [
            "house.template.leader_residence",
            "house.kulan.temple",
            "home.template",
            "house.template.keep",
          ],
          neighbourCityIds: [],
          travelCost: 1,
          tags: ["template"],
          prosperity: 90,
          danger: 20,
          specialDemand: ["tea"],
          mountedBuildings: [{ buildingId: "house.template.keep" }],
          mapPlacement: { x: 1, y: 2 },
          menuInstanceIds: ["menu-instance.city.default"],
        },
      ]
    ),
    [
      {
        id: "city.kulan",
        name: "模板濠州",
        regionId: "region.runtime.frontier",
        mapNodeId: "settlement.runtime.haozhou",
        houseIds: [
          "house.template.leader_residence",
          "house.kulan.temple",
          "home.template",
          "house.template.keep",
        ],
        neighbourCityIds: ["city.yingtian"],
        travelCost: 2,
        tags: ["runtime"],
        prosperity: 77,
        danger: 12,
        specialDemand: ["salt"],
        mountedBuildings: [{ buildingId: "house.template.keep" }],
        mapPlacement: { x: 1, y: 2 },
        menuInstanceIds: ["menu-instance.city.default"],
      },
    ]
  );
});

test("zhuyuanzhang current template cities already match runtime-to-template city projection", async () => {
  const syncTool = await importModule(
    "tools/sync-zhuyuanzhang-startup-templates.mjs"
  );
  const runtimeCities = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "content",
        "scenario-packs",
        "zhuyuanzhang",
        "cities.json"
      ),
      "utf8"
    )
  );
  const templateCities = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "modules",
        "script-editor",
        "builtin-templates",
        "zhuyuanzhang",
        "cities.json"
      ),
      "utf8"
    )
  );

  assert.deepEqual(
    syncTool.projectTemplateCitiesForSync(runtimeCities, templateCities),
    templateCities
  );
});

test("zhuyuanzhang runtime city projection can expand template generic houseIds while preserving runtime-only city shape", async () => {
  const syncTool = await importModule(
    "tools/sync-zhuyuanzhang-startup-templates.mjs"
  );

  assert.equal(typeof syncTool.projectRuntimeCitiesForSync, "function");

  assert.deepEqual(
    syncTool.projectRuntimeCitiesForSync(
      [
        {
          id: "city.kulan",
          name: "模板濠州",
          regionId: "region.template.frontier",
          mapNodeId: "settlement.template.haozhou",
          houseIds: [
            "house.template.leader_residence",
            "house.kulan.temple",
            "home.template",
            "house.template.keep",
          ],
          neighbourCityIds: ["city.yingtian"],
          travelCost: 2,
          tags: ["template"],
          prosperity: 77,
          danger: 12,
          specialDemand: ["salt"],
          mountedBuildings: [{ buildingId: "house.template.keep" }],
          mapPlacement: { x: 1, y: 2 },
          menuInstanceIds: ["menu-instance.city.default"],
        },
      ],
      [
        {
          id: "city.kulan",
          name: "运行时濠州",
          regionId: "region.runtime.frontier",
          mapNodeId: "settlement.runtime.haozhou",
          houseIds: [
            "house.kulan.leader_residence",
            "house.kulan.temple",
            "home_001",
            "house.kulan.keep",
          ],
          neighbourCityIds: [],
          travelCost: 1,
          tags: ["runtime"],
          prosperity: 90,
          danger: 20,
          specialDemand: ["tea"],
        },
      ]
    ),
    [
      {
        id: "city.kulan",
        name: "运行时濠州",
        regionId: "region.template.frontier",
        mapNodeId: "settlement.template.haozhou",
        houseIds: [
          "house.kulan.leader_residence",
          "house.kulan.temple",
          "home_001",
          "house.kulan.keep",
        ],
        neighbourCityIds: ["city.yingtian"],
        travelCost: 2,
        tags: ["template"],
        prosperity: 77,
        danger: 12,
        specialDemand: ["salt"],
      },
    ]
  );
});

test("zhuyuanzhang current runtime cities already match template-to-runtime city projection", async () => {
  const syncTool = await importModule(
    "tools/sync-zhuyuanzhang-startup-templates.mjs"
  );
  const runtimeCities = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "content",
        "scenario-packs",
        "zhuyuanzhang",
        "cities.json"
      ),
      "utf8"
    )
  );
  const templateCities = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "modules",
        "script-editor",
        "builtin-templates",
        "zhuyuanzhang",
        "cities.json"
      ),
      "utf8"
    )
  );

  assert.deepEqual(
    syncTool.projectRuntimeCitiesForSync(templateCities, runtimeCities),
    runtimeCities
  );
});

test("zhuyuanzhang source contract records houses.json as an independent generic-template mapping family", async () => {
  const contract = await importModule(
    "tools/zhuyuanzhang-source-sync-contract.mjs"
  );

  assert.deepEqual(contract.HOUSE_TEMPLATE_GENERIC_IDS, [
    "house.template.leader_residence",
    "house.template.keep",
    "house.template.tea_house",
    "house.template.market",
    "house.template.grain_shop",
    "house.template.medicine_house",
    "house.template.inn",
    "house.template.temple",
    "home.template",
  ]);
  assert.deepEqual(contract.HOUSE_TEMPLATE_CONCRETE_SCENARIO_IDS, [
    "house.kulan.temple",
  ]);
  assert.equal(contract.HOUSE_RUNTIME_HOME_ID_PREFIX, "home.");
  assert.deepEqual(contract.HOUSE_RUNTIME_HOME_SPECIAL_IDS, ["home_001"]);
  assert.deepEqual(contract.HOUSE_RUNTIME_CITY_SCOPED_SUFFIXES, [
    ".leader_residence",
    ".temple",
    ".keep",
    ".tea_house",
    ".market",
    ".grain_shop",
    ".medicine_house",
    ".inn",
  ]);
});

test("zhuyuanzhang source contract records houses.json field ownership boundaries before any projection helper", async () => {
  const contract = await importModule(
    "tools/zhuyuanzhang-source-sync-contract.mjs"
  );

  assert.deepEqual(contract.HOUSE_SHARED_FIELD_KEYS, [
    "name",
    "type",
    "moduleId",
    "activityLocationId",
    "visibleStoryStages",
    "enterableStoryStages",
    "requiresPlayerCurrentCityMatch",
  ]);
  assert.deepEqual(contract.HOUSE_TEMPLATE_ONLY_FIELD_KEYS, [
    "menuInstanceIds",
  ]);
  assert.deepEqual(contract.HOUSE_RUNTIME_ONLY_FIELD_KEYS, [
    "onEnterEventId",
  ]);
  assert.deepEqual(contract.HOUSE_PACK_SPECIFIC_FIELD_KEYS, [
    "id",
    "cityId",
    "characterIds",
    "defaultCharacterId",
    "backAction",
  ]);
});

test("zhuyuanzhang template house projection can collapse runtime concrete houses without touching template-only or pack-specific fields", async () => {
  const syncTool = await importModule(
    "tools/sync-zhuyuanzhang-startup-templates.mjs"
  );

  assert.equal(typeof syncTool.projectTemplateHousesForSync, "function");

  assert.deepEqual(
    syncTool.projectTemplateHousesForSync(
      [
        {
          id: "house.kulan.keep",
          cityId: "city.kulan",
          name: "帅府运行时",
          type: "castle",
          moduleId: "keep-house",
          characterIds: ["char.runtime.keep"],
          defaultCharacterId: "char.runtime.keep",
          backAction: { label: "返回濠州", targetView: "city" },
        },
        {
          id: "house.yingtian.temple",
          cityId: "city.yingtian",
          name: "寺庙运行时",
          type: "temple",
          moduleId: "temple-house",
          onEnterEventId: "event.runtime.temple.enter",
          characterIds: ["char.runtime.temple"],
          defaultCharacterId: "char.runtime.temple",
          backAction: { label: "返回集庆路", targetView: "city" },
        },
        {
          id: "house.kulan.temple",
          cityId: "city.kulan",
          name: "皇觉寺运行时",
          type: "temple",
          moduleId: "temple-house",
          onEnterEventId: "event.runtime.kulan.temple.enter",
          characterIds: ["char.runtime.kulan.temple"],
          defaultCharacterId: "char.runtime.kulan.temple",
          backAction: { label: "返回濠州", targetView: "city" },
        },
        {
          id: "home_001",
          cityId: "city.kulan",
          name: "自宅运行时",
          type: "residence",
          moduleId: "home-house",
          visibleStoryStages: ["guo-zixing-camp"],
          enterableStoryStages: ["guo-zixing-camp"],
          requiresPlayerCurrentCityMatch: true,
          characterIds: ["char.runtime.home"],
          defaultCharacterId: "char.runtime.home",
          backAction: { label: "返回濠州", targetView: "city" },
        },
      ],
      [
        {
          id: "house.template.keep",
          cityId: "city.kulan",
          name: "帅府模板",
          type: "castle",
          moduleId: "keep-house",
          characterIds: [],
          defaultCharacterId: null,
          backAction: { label: "返回城市", targetView: "city" },
          menuInstanceIds: ["menu-instance.house.template.keep.primary"],
        },
        {
          id: "house.template.temple",
          cityId: "city.yingtian",
          name: "寺庙模板",
          type: "temple",
          moduleId: "temple-house",
          characterIds: [],
          defaultCharacterId: null,
          backAction: { label: "返回城市", targetView: "city" },
          menuInstanceIds: ["menu-instance.house.template.temple.primary"],
        },
        {
          id: "house.kulan.temple",
          cityId: "city.kulan",
          name: "皇觉寺模板",
          type: "temple",
          moduleId: "temple-house",
          characterIds: ["char.template.kulan.temple"],
          defaultCharacterId: "char.template.kulan.temple",
          backAction: { label: "返回城市", targetView: "city" },
          menuInstanceIds: ["menu-instance.house.kulan.temple.primary"],
        },
        {
          id: "home.template",
          cityId: "city.kulan",
          name: "自宅模板",
          type: "residence",
          moduleId: "home-house",
          visibleStoryStages: [],
          enterableStoryStages: [],
          requiresPlayerCurrentCityMatch: false,
          characterIds: ["char.template.home"],
          defaultCharacterId: "char.template.home",
          backAction: { label: "返回城市", targetView: "city" },
          menuInstanceIds: ["menu-instance.home.template.primary"],
        },
      ]
    ),
    [
      {
        id: "house.template.keep",
        cityId: "city.kulan",
        name: "帅府运行时",
        type: "castle",
        moduleId: "keep-house",
        characterIds: [],
        defaultCharacterId: null,
        backAction: { label: "返回城市", targetView: "city" },
        menuInstanceIds: ["menu-instance.house.template.keep.primary"],
      },
      {
        id: "house.template.temple",
        cityId: "city.yingtian",
        name: "寺庙运行时",
        type: "temple",
        moduleId: "temple-house",
        characterIds: [],
        defaultCharacterId: null,
        backAction: { label: "返回城市", targetView: "city" },
        menuInstanceIds: ["menu-instance.house.template.temple.primary"],
      },
      {
        id: "house.kulan.temple",
        cityId: "city.kulan",
        name: "皇觉寺运行时",
        type: "temple",
        moduleId: "temple-house",
        characterIds: ["char.template.kulan.temple"],
        defaultCharacterId: "char.template.kulan.temple",
        backAction: { label: "返回城市", targetView: "city" },
        menuInstanceIds: ["menu-instance.house.kulan.temple.primary"],
      },
      {
        id: "home.template",
        cityId: "city.kulan",
        name: "自宅运行时",
        type: "residence",
        moduleId: "home-house",
        visibleStoryStages: ["guo-zixing-camp"],
        enterableStoryStages: ["guo-zixing-camp"],
        requiresPlayerCurrentCityMatch: true,
        characterIds: ["char.template.home"],
        defaultCharacterId: "char.template.home",
        backAction: { label: "返回城市", targetView: "city" },
        menuInstanceIds: ["menu-instance.home.template.primary"],
      },
    ]
  );
});

test("zhuyuanzhang current template houses already match runtime-to-template house projection", async () => {
  const syncTool = await importModule(
    "tools/sync-zhuyuanzhang-startup-templates.mjs"
  );
  const runtimeHouses = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "content",
        "scenario-packs",
        "zhuyuanzhang",
        "houses.json"
      ),
      "utf8"
    )
  );
  const templateHouses = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "modules",
        "script-editor",
        "builtin-templates",
        "zhuyuanzhang",
        "houses.json"
      ),
      "utf8"
    )
  );

  assert.deepEqual(
    syncTool.projectTemplateHousesForSync(runtimeHouses, templateHouses),
    templateHouses
  );
});

test("zhuyuanzhang runtime house projection can expand template houses without touching runtime-only or pack-specific fields", async () => {
  const syncTool = await importModule(
    "tools/sync-zhuyuanzhang-startup-templates.mjs"
  );

  assert.equal(typeof syncTool.projectRuntimeHousesForSync, "function");

  assert.deepEqual(
    syncTool.projectRuntimeHousesForSync(
      [
        {
          id: "house.template.keep",
          cityId: "city.kulan",
          name: "帅府模板",
          type: "castle",
          moduleId: "keep-house",
          activityLocationId: "activity.template.keep",
          visibleStoryStages: ["template-visible"],
          enterableStoryStages: ["template-enterable"],
          requiresPlayerCurrentCityMatch: true,
          characterIds: [],
          defaultCharacterId: null,
          backAction: { label: "返回城市", targetView: "city" },
          menuInstanceIds: ["menu-instance.house.template.keep.primary"],
        },
        {
          id: "house.template.temple",
          cityId: "city.yingtian",
          name: "寺庙模板",
          type: "temple",
          moduleId: "temple-house",
          activityLocationId: "activity.template.temple",
          characterIds: [],
          defaultCharacterId: null,
          backAction: { label: "返回城市", targetView: "city" },
          menuInstanceIds: ["menu-instance.house.template.temple.primary"],
        },
        {
          id: "house.kulan.temple",
          cityId: "city.kulan",
          name: "皇觉寺模板",
          type: "temple",
          moduleId: "temple-house",
          visibleStoryStages: ["template-kulan-visible"],
          characterIds: [],
          defaultCharacterId: null,
          backAction: { label: "返回城市", targetView: "city" },
          menuInstanceIds: ["menu-instance.house.kulan.temple.primary"],
        },
        {
          id: "home.template",
          cityId: "city.kulan",
          name: "自宅模板",
          type: "residence",
          moduleId: "home-house",
          visibleStoryStages: ["guo-zixing-camp"],
          enterableStoryStages: ["guo-zixing-camp"],
          requiresPlayerCurrentCityMatch: true,
          characterIds: [],
          defaultCharacterId: null,
          backAction: { label: "返回城市", targetView: "city" },
          menuInstanceIds: ["menu-instance.home.template.primary"],
        },
      ],
      [
        {
          id: "house.kulan.keep",
          cityId: "city.kulan",
          name: "帅府运行时",
          type: "stale-castle",
          moduleId: "stale-keep-house",
          activityLocationId: "activity.runtime.keep",
          visibleStoryStages: ["runtime-visible"],
          enterableStoryStages: ["runtime-enterable"],
          requiresPlayerCurrentCityMatch: false,
          characterIds: ["char.runtime.keep"],
          defaultCharacterId: "char.runtime.keep",
          backAction: { label: "返回濠州", targetView: "city" },
        },
        {
          id: "house.yingtian.temple",
          cityId: "city.yingtian",
          name: "寺庙运行时",
          type: "stale-temple",
          moduleId: "stale-temple-house",
          activityLocationId: "activity.runtime.temple",
          onEnterEventId: "event.runtime.temple.enter",
          characterIds: ["char.runtime.temple"],
          defaultCharacterId: "char.runtime.temple",
          backAction: { label: "返回集庆路", targetView: "city" },
        },
        {
          id: "house.kulan.temple",
          cityId: "city.kulan",
          name: "皇觉寺运行时",
          type: "stale-kulan-temple",
          moduleId: "stale-temple-house",
          visibleStoryStages: ["runtime-kulan-visible"],
          onEnterEventId: "event.runtime.kulan.temple.enter",
          characterIds: ["char.runtime.kulan.temple"],
          defaultCharacterId: "char.runtime.kulan.temple",
          backAction: { label: "返回濠州", targetView: "city" },
        },
        {
          id: "home_001",
          cityId: "city.kulan",
          name: "自宅运行时",
          type: "stale-home",
          moduleId: "stale-home-house",
          visibleStoryStages: [],
          enterableStoryStages: [],
          requiresPlayerCurrentCityMatch: false,
          onEnterEventId: "event.runtime.home.enter",
          characterIds: ["char.runtime.home"],
          defaultCharacterId: "char.runtime.home",
          backAction: { label: "返回濠州", targetView: "city" },
        },
      ]
    ),
    [
      {
        id: "house.kulan.keep",
        cityId: "city.kulan",
        name: "帅府模板",
        type: "castle",
        moduleId: "keep-house",
        activityLocationId: "activity.template.keep",
        visibleStoryStages: ["template-visible"],
        enterableStoryStages: ["template-enterable"],
        requiresPlayerCurrentCityMatch: true,
        characterIds: ["char.runtime.keep"],
        defaultCharacterId: "char.runtime.keep",
        backAction: { label: "返回濠州", targetView: "city" },
      },
      {
        id: "house.yingtian.temple",
        cityId: "city.yingtian",
        name: "寺庙模板",
        type: "temple",
        moduleId: "temple-house",
        activityLocationId: "activity.template.temple",
        onEnterEventId: "event.runtime.temple.enter",
        characterIds: ["char.runtime.temple"],
        defaultCharacterId: "char.runtime.temple",
        backAction: { label: "返回集庆路", targetView: "city" },
      },
      {
        id: "house.kulan.temple",
        cityId: "city.kulan",
        name: "皇觉寺模板",
        type: "temple",
        moduleId: "temple-house",
        visibleStoryStages: ["template-kulan-visible"],
        onEnterEventId: "event.runtime.kulan.temple.enter",
        characterIds: ["char.runtime.kulan.temple"],
        defaultCharacterId: "char.runtime.kulan.temple",
        backAction: { label: "返回濠州", targetView: "city" },
      },
      {
        id: "home_001",
        cityId: "city.kulan",
        name: "自宅模板",
        type: "residence",
        moduleId: "home-house",
        visibleStoryStages: ["guo-zixing-camp"],
        enterableStoryStages: ["guo-zixing-camp"],
        requiresPlayerCurrentCityMatch: true,
        onEnterEventId: "event.runtime.home.enter",
        characterIds: ["char.runtime.home"],
        defaultCharacterId: "char.runtime.home",
        backAction: { label: "返回濠州", targetView: "city" },
      },
    ]
  );
});

test("zhuyuanzhang current runtime houses already match template-to-runtime house projection", async () => {
  const syncTool = await importModule(
    "tools/sync-zhuyuanzhang-startup-templates.mjs"
  );
  const runtimeHouses = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "content",
        "scenario-packs",
        "zhuyuanzhang",
        "houses.json"
      ),
      "utf8"
    )
  );
  const templateHouses = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "modules",
        "script-editor",
        "builtin-templates",
        "zhuyuanzhang",
        "houses.json"
      ),
      "utf8"
    )
  );

  assert.deepEqual(
    syncTool.projectRuntimeHousesForSync(templateHouses, runtimeHouses),
    runtimeHouses
  );
});

test("zhuyuanzhang sync projections preserve pack-specific overlays while syncing shared text and activities", async () => {
  const syncTool = await importModule(
    "tools/sync-zhuyuanzhang-startup-templates.mjs"
  );

  assert.equal(typeof syncTool.projectTextEntriesForSync, "function");
  assert.equal(typeof syncTool.projectActivitiesForSync, "function");

  const nextTextEntries = syncTool.projectTextEntriesForSync(
    {
      shared: "runtime text",
      runtimeOnly: "keep runtime only",
    },
    {
      shared: "template stale text",
      templateOnly: "keep template only",
    }
  );
  assert.deepEqual(nextTextEntries, {
    shared: "runtime text",
    templateOnly: "keep template only",
  });

  const nextActivities = syncTool.projectActivitiesForSync(
    [
      {
        id: "activity.shared",
        label: "Runtime label",
        orderLineTextIds: ["runtime"],
        reviewMinRankId: "rank.runtime",
      },
    ],
    [
      {
        id: "activity.shared",
        label: "Template stale label",
        orderLineTextIds: ["template"],
        templateOnlyFlag: true,
      },
      {
        id: "activity.template-only",
        label: "Template-only activity",
      },
    ]
  );
  assert.deepEqual(nextActivities, [
    {
      id: "activity.shared",
      label: "Runtime label",
      orderLineTextIds: ["runtime"],
      templateOnlyFlag: true,
      reviewMinRankId: "rank.runtime",
    },
    {
      id: "activity.template-only",
      label: "Template-only activity",
    },
  ]);
});

test("zhuyuanzhang pack manifest projections enforce shared/runtime-only/template-only ownership boundaries", async () => {
  const syncTool = await importModule(
    "tools/sync-zhuyuanzhang-startup-templates.mjs"
  );

  assert.equal(typeof syncTool.projectRuntimePackManifestForSync, "function");
  assert.equal(typeof syncTool.projectTemplatePackManifestForSync, "function");

  const runtimeProjection = syncTool.projectRuntimePackManifestForSync(
    {
      schemaVersion: 1,
      kind: "scenario-pack",
      id: "pack",
      title: "Pack",
      description: "desc",
      files: {
        scenarioProfile: "scenario-profile.json",
        cityEntries: "city-entries.json",
        portraits: "portraits.json",
        portraitVariants: "portrait-variants.json",
      },
    },
    {
      schemaVersion: 1,
      kind: "scenario-pack",
      id: "stale-pack",
      title: "Stale",
      files: {
        scenarioProfile: "stale-scenario-profile.json",
        scenes: "scenes.json",
        houseAccessRefusalRules: "house-access-refusal-rules.json",
        portraits: "should-drop.json",
      },
    }
  );
  assert.deepEqual(runtimeProjection, {
    schemaVersion: 1,
    kind: "scenario-pack",
    id: "pack",
    title: "Pack",
    description: "desc",
    files: {
      scenarioProfile: "scenario-profile.json",
      cityEntries: "city-entries.json",
      scenes: "scenes.json",
      houseAccessRefusalRules: "house-access-refusal-rules.json",
      playables: "playables.json",
      playableIntegrations: "playable-integrations.json",
      playableShells: "playable-shells.json",
      buildingArrangements: "building-arrangements.json",
      dialogues: "dialogues.json",
      eventBindings: "event-bindings.json",
      houseModuleDefaults: "house-module-defaults.json",
      locationAccess: "location-access.json",
      menuInstances: "menu-instances.json",
      menuResources: "menu-resources.json",
      settlements: "settlements.json",
    },
  });

  const templateProjection = syncTool.projectTemplatePackManifestForSync(
    {
      schemaVersion: 1,
      kind: "scenario-pack",
      id: "pack",
      title: "Pack",
      description: "desc",
      files: {
        scenarioProfile: "scenario-profile.json",
        cityEntries: "city-entries.json",
        scenes: "scenes.json",
        houseAccessRefusalRules: "house-access-refusal-rules.json",
      },
    },
    {
      schemaVersion: 1,
      kind: "scenario-pack",
      id: "template-pack",
      title: "Template Pack",
      files: {
        scenarioProfile: "stale-scenario-profile.json",
        cityEntries: "stale-city-entries.json",
        portraits: "portraits.json",
        portraitVariants: "portrait-variants.json",
        scenes: "should-drop.json",
      },
    }
  );
  assert.deepEqual(templateProjection, {
    schemaVersion: 1,
    kind: "scenario-pack",
    id: "pack",
    title: "Pack",
    description: "desc",
    files: {
      scenarioProfile: "scenario-profile.json",
      cityEntries: "city-entries.json",
      portraits: "portraits.json",
      portraitVariants: "portrait-variants.json",
    },
  });
});

test("zhuyuanzhang city-entry projections preserve template-only entries and leader-residence target mapping", async () => {
  const syncTool = await importModule(
    "tools/sync-zhuyuanzhang-startup-templates.mjs"
  );

  assert.equal(typeof syncTool.projectRuntimeCityEntriesForSync, "function");
  assert.equal(typeof syncTool.projectTemplateCityEntriesForSync, "function");

  assert.deepEqual(
    syncTool.projectRuntimeCityEntriesForSync(
      [
        {
          id: "city-entry.kulan.leader-residence",
          cityId: "city.kulan",
          name: "将领府邸",
          directoryType: "leader-residence",
          targetHouseId: "house.template.leader_residence",
          artworkId: "leader-residence",
        },
        {
          id: "city-entry.kulan.temple",
          cityId: "city.kulan",
          name: "皇觉寺",
          directoryType: "building",
          targetHouseId: "house.kulan.temple",
          artworkId: "temple-house",
        },
      ],
      [
        {
          id: "city-entry.kulan.leader-residence",
          cityId: "city.kulan",
          name: "将领府邸",
          directoryType: "leader-residence",
          targetHouseId: "house.kulan.leader_residence",
          artworkId: "leader-residence",
        },
      ]
    ),
    [
      {
        id: "city-entry.kulan.leader-residence",
        cityId: "city.kulan",
        name: "将领府邸",
        directoryType: "leader-residence",
        targetHouseId: "house.kulan.leader_residence",
        artworkId: "leader-residence",
      },
    ]
  );

  assert.deepEqual(
    syncTool.projectTemplateCityEntriesForSync(
      [
        {
          id: "city-entry.kulan.leader-residence",
          cityId: "city.kulan",
          name: "将领府邸",
          directoryType: "leader-residence",
          targetHouseId: "house.kulan.leader_residence",
          artworkId: "leader-residence",
        },
      ],
      [
        {
          id: "city-entry.kulan.leader-residence",
          cityId: "city.kulan",
          name: "将领府邸",
          directoryType: "leader-residence",
          targetHouseId: "house.template.leader_residence",
          artworkId: "leader-residence",
        },
        {
          id: "city-entry.kulan.temple",
          cityId: "city.kulan",
          name: "皇觉寺",
          directoryType: "building",
          targetHouseId: "house.kulan.temple",
          artworkId: "temple-house",
        },
      ]
    ),
    [
      {
        id: "city-entry.kulan.leader-residence",
        cityId: "city.kulan",
        name: "将领府邸",
        directoryType: "leader-residence",
        targetHouseId: "house.template.leader_residence",
        artworkId: "leader-residence",
      },
      {
        id: "city-entry.kulan.temple",
        cityId: "city.kulan",
        name: "皇觉寺",
        directoryType: "building",
        targetHouseId: "house.kulan.temple",
        artworkId: "temple-house",
      },
    ]
  );
});

test("zhuyuanzhang text sync can add approved temple shared keys into the runtime pack mirror", async () => {
  const syncTool = await importModule(
    "tools/sync-zhuyuanzhang-startup-templates.mjs"
  );

  const nextTextEntries = syncTool.projectTextEntriesForSync(
    {
      "runtime.zhu_yuanzhang.temple.ui.status.contribution": "寺中贡献",
      "runtime.zhu_yuanzhang.temple.ui.status.contribution.value":
        "{contribution} / {threshold}",
      "runtime.zhu_yuanzhang.temple.rest.summary.auto_advance.title":
        "休息 {days} 天",
      "script_editor.template_only.note": "保留在模板包",
    },
    {
      existing: "keep runtime only",
    }
  );

  assert.deepEqual(nextTextEntries, {
    existing: "keep runtime only",
    "runtime.zhu_yuanzhang.temple.ui.status.contribution": "寺中贡献",
    "runtime.zhu_yuanzhang.temple.ui.status.contribution.value":
      "{contribution} / {threshold}",
    "runtime.zhu_yuanzhang.temple.rest.summary.auto_advance.title":
      "休息 {days} 天",
  });
});

test("zhuyuanzhang source contract records publication-only manifest keys and builtin-only manifest keys", async () => {
  const contract = await importModule(
    "tools/zhuyuanzhang-source-sync-contract.mjs"
  );

  assert.deepEqual(contract.PUBLICATION_ONLY_MANIFEST_FILE_KEYS, []);
  assert.deepEqual(contract.BUILTIN_TEMPLATE_ONLY_MANIFEST_FILE_KEYS, []);
  assert.deepEqual(contract.PLAYABLE_FAMILY_FILE_NAMES, [
    "playables.json",
    "playable-integrations.json",
    "playable-shells.json",
  ]);
  assert.deepEqual(contract.PLAYABLE_FAMILY_OWNERSHIP, {
    canonicalMaintainedOwner: "scriptEditorTemplatePack",
    runtimePackMirrorMode: "derived-from-script-editor-template-pack",
    publicPublicationFile: "playable-shells.json",
    publicPublicationDerivedFrom: "playable-shells.json",
  });
  assert.deepEqual(
    contract.PUBLICATION_SYNC_FILE_RULES.map((rule) => rule.fileName),
    [
      "pack.json",
      "playables.json",
      "playable-integrations.json",
      "playable-shells.json",
      "settlements.json",
      "events.json",
      "dialogues.json",
      "event-bindings.json",
      "menu-resources.json",
      "house-module-defaults.json",
    ]
  );
  assert.deepEqual(contract.PUBLICATION_OMITTED_MENU_RESOURCE_ENTRY_IDS, []);
  assert.deepEqual(contract.PUBLICATION_OMITTED_PLAYABLE_INTEGRATION_IDS, []);
  assert.deepEqual(contract.PUBLICATION_ONLY_EVENT_IDS, []);
  assert.deepEqual(contract.PUBLICATION_ONLY_DIALOGUE_IDS, []);
  assert.deepEqual(contract.PUBLICATION_OMITTED_EVENT_IDS, []);
  assert.deepEqual(contract.BUILTIN_ONLY_EVENT_IDS, []);
  assert.equal(
    contract.REGISTERED_BUILTIN_TEMPLATE_ASSET_PUBLICATION_ROOT,
    "public/builtin-script-editor-templates/zhuyuanzhang"
  );
  assert.deepEqual(contract.REGISTERED_BUILTIN_TEMPLATE_ASSET_FILE_NAMES, [
    "assets/maps/HD.png",
    "assets/maps/tie1.png",
    "assets/maps/tietu.png",
    "assets/maps/yuanmo-fog-noise.png",
    "assets/maps/yuanmo-map-climates.png",
    "assets/maps/yuanmo-map-ground-types.png",
    "assets/maps/yuanmo-map-heights.png",
    "assets/maps/yuanmo-map-regions.png",
    "assets/maps/yuanmo-map-trade-routes.png",
    "assets/maps/yuanmo-water-noise.png",
  ]);
  assert.deepEqual(contract.PUBLIC_RETIREMENT_GATE, [
    "default template URL no longer points at /script-editor-templates/zhuyuanzhang/pack.json",
    "equivalent browser-loadable template coverage exists outside public/script-editor-templates/zhuyuanzhang/**",
    "legacy public manifest URL import coverage is intentionally retired",
    "legacy public folder-import compatibility is replaced by a self-contained package outside public/script-editor-templates/zhuyuanzhang/**",
  ]);
});

test("zhuyuanzhang source contract records runtime building-support mirror files", async () => {
  const contract = await importModule(
    "tools/zhuyuanzhang-source-sync-contract.mjs"
  );

  assert.deepEqual(contract.RUNTIME_BUILDING_SUPPORT_FILE_NAMES, [
    "building-arrangements.json",
    "dialogues.json",
    "event-bindings.json",
    "house-module-defaults.json",
    "location-access.json",
    "menu-instances.json",
    "menu-resources.json",
    "settlements.json",
  ]);
  assert.deepEqual(contract.RUNTIME_SAFE_EVENT_MIRROR_IDS, [
    "event.building.template.house.temple.review",
    "event.building.house.kulan.temple.copy_scripture",
    "event.building.house.kulan.temple.sweep_courtyard",
    "event.building.template.house.temple.leave",
    "event.building.template.house.temple.donate",
    "event.building.house.kulan.temple.carry_water",
  ]);
});

test("zhuyuanzhang public manifest now publishes playable-shells without legacy flow-playables", async () => {
  const contract = await importModule(
    "tools/zhuyuanzhang-source-sync-contract.mjs"
  );
  const builtinRuntimeManifest = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "content",
        "scenario-packs",
        "zhuyuanzhang",
        "pack.json"
      ),
      "utf8"
    )
  );
  const builtinTemplateManifest = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "modules",
        "script-editor",
        "builtin-templates",
        "zhuyuanzhang",
        "pack.json"
      ),
      "utf8"
    )
  );
  const publicManifest = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "public",
        "builtin-script-editor-templates",
        "zhuyuanzhang",
        "pack.json"
      ),
      "utf8"
    )
  );

  assert.deepEqual(contract.LEGACY_PUBLICATION_FILE_RULES, []);
  assert.equal(
    Object.prototype.hasOwnProperty.call(
      builtinRuntimeManifest.files,
      "flowPlayables"
    ),
    false
  );
  assert.equal(
    Object.prototype.hasOwnProperty.call(
      builtinTemplateManifest.files,
      "flowPlayables"
    ),
    false
  );
  assert.equal(Object.hasOwn(publicManifest.files, "flowPlayables"), false);
  assert.equal(publicManifest.files.playables, "playables.json");
  assert.equal(
    publicManifest.files.playableIntegrations,
    "playable-integrations.json"
  );
  assert.equal(
    publicManifest.files.playableShells,
    "playable-shells.json"
  );
  assert.equal(publicManifest.files.settlements, "settlements.json");
});

test("zhuyuanzhang manifest projection keeps canonical public playable and settlement keys", async () => {
  const syncTool = await importModule(
    "tools/sync-zhuyuanzhang-startup-templates.mjs"
  );

  assert.equal(typeof syncTool.projectPublicPackManifestForSync, "function");
  const nextManifest = syncTool.projectPublicPackManifestForSync(
    {
      schemaVersion: 1,
      kind: "scenario-pack",
      id: "pack.test",
      title: "Pack Test",
      description: "Builtin template manifest",
      files: {
        activities: "activities.json",
        playables: "playables.json",
        playableIntegrations: "playable-integrations.json",
        playableShells: "playable-shells.json",
        settlements: "settlements.json",
        textEntries: "text-entries.json",
      },
    },
    {
      schemaVersion: 1,
      kind: "scenario-pack",
      id: "pack.test",
      title: "Pack Test",
      description: "Old public manifest",
      files: {
        activities: "activities.json",
        playableIntegrations: "old-playable-integrations.json",
        playableShells: "playable-shells.json",
        textEntries: "text-entries.json",
      },
    }
  );

  assert.deepEqual(nextManifest, {
    schemaVersion: 1,
    kind: "scenario-pack",
    id: "pack.test",
    title: "Pack Test",
    description: "Builtin template manifest",
    files: {
      activities: "activities.json",
      playables: "playables.json",
      playableIntegrations: "playable-integrations.json",
      playableShells: "playable-shells.json",
      settlements: "settlements.json",
      textEntries: "text-entries.json",
    },
  });
});

test("zhuyuanzhang public playable and settlement files are fully derived from builtin template", () => {
  const templateRoot = path.join(
    process.cwd(),
    "src",
    "modules",
    "script-editor",
    "builtin-templates",
    "zhuyuanzhang"
  );
  const publicRoot = path.join(
    process.cwd(),
    "public",
    "builtin-script-editor-templates",
    "zhuyuanzhang"
  );

  for (const fileName of [
    "playables.json",
    "settlements.json",
  ]) {
    assert.deepEqual(
      JSON.parse(fs.readFileSync(path.join(publicRoot, fileName), "utf8")),
      JSON.parse(fs.readFileSync(path.join(templateRoot, fileName), "utf8"))
    );
  }
});

test("zhuyuanzhang public playable integrations are fully derived from builtin template", async () => {
  const syncTool = await importModule(
    "tools/sync-zhuyuanzhang-startup-templates.mjs"
  );

  assert.equal(typeof syncTool.projectPublicPlayableIntegrationsForSync, "function");

  assert.deepEqual(
    syncTool.projectPublicPlayableIntegrationsForSync([
      {
        integrationId:
          "playable.temple-copy-scripture.instance.template.temple-copy-scripture",
        playableId: "temple-copy-scripture",
      },
      {
        integrationId:
          "playable.grain-accounting.instance.template.grain-accounting",
        playableId: "grain-accounting",
      },
    ]),
    [
      {
        integrationId:
          "playable.temple-copy-scripture.instance.template.temple-copy-scripture",
        playableId: "temple-copy-scripture",
      },
      {
        integrationId:
          "playable.grain-accounting.instance.template.grain-accounting",
        playableId: "grain-accounting",
      },
    ]
  );

  const templateRoot = path.join(
    process.cwd(),
    "src",
    "modules",
    "script-editor",
    "builtin-templates",
    "zhuyuanzhang"
  );
  const publicRoot = path.join(
    process.cwd(),
    "public",
    "builtin-script-editor-templates",
    "zhuyuanzhang"
  );
  const builtinPlayableIntegrations = JSON.parse(
    fs.readFileSync(path.join(templateRoot, "playable-integrations.json"), "utf8")
  );
  const publicPlayableIntegrations = JSON.parse(
    fs.readFileSync(path.join(publicRoot, "playable-integrations.json"), "utf8")
  );

  assert.deepEqual(
    publicPlayableIntegrations,
    syncTool.projectPublicPlayableIntegrationsForSync(
      builtinPlayableIntegrations
    )
  );
});

test("zhuyuanzhang public playable-shells file is fully derived from builtin template playable-shells", async () => {
  const builtinTemplatePlayableShells = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "modules",
        "script-editor",
        "builtin-templates",
        "zhuyuanzhang",
        "playable-shells.json"
      ),
      "utf8"
    )
  );
  const publicPlayableShells = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "public",
        "builtin-script-editor-templates",
        "zhuyuanzhang",
        "playable-shells.json"
      ),
      "utf8"
    )
  );

  assert.deepEqual(publicPlayableShells, builtinTemplatePlayableShells);
});

test("zhuyuanzhang public publication is fully derived from builtin template authored files", async () => {
  const contract = await importModule(
    "tools/zhuyuanzhang-source-sync-contract.mjs"
  );
  const builtinTemplateRoot = path.join(
    process.cwd(),
    "src",
    "modules",
    "script-editor",
    "builtin-templates",
    "zhuyuanzhang"
  );
  const publicTemplateRoot = path.join(
    process.cwd(),
    "public",
    "builtin-script-editor-templates",
    "zhuyuanzhang"
  );
  const builtinEvents = JSON.parse(
    fs.readFileSync(path.join(builtinTemplateRoot, "events.json"), "utf8")
  );
  const publicEvents = JSON.parse(
    fs.readFileSync(path.join(publicTemplateRoot, "events.json"), "utf8")
  );
  const builtinDialogues = JSON.parse(
    fs.readFileSync(path.join(builtinTemplateRoot, "dialogues.json"), "utf8")
  );
  const publicDialogues = JSON.parse(
    fs.readFileSync(path.join(publicTemplateRoot, "dialogues.json"), "utf8")
  );
  const builtinEventBindings = JSON.parse(
    fs.readFileSync(path.join(builtinTemplateRoot, "event-bindings.json"), "utf8")
  );
  const publicEventBindings = JSON.parse(
    fs.readFileSync(path.join(publicTemplateRoot, "event-bindings.json"), "utf8")
  );
  const builtinMenuResources = JSON.parse(
    fs.readFileSync(path.join(builtinTemplateRoot, "menu-resources.json"), "utf8")
  );
  const publicMenuResources = JSON.parse(
    fs.readFileSync(path.join(publicTemplateRoot, "menu-resources.json"), "utf8")
  );
  const builtinHouseModuleDefaults = JSON.parse(
    fs.readFileSync(
      path.join(builtinTemplateRoot, "house-module-defaults.json"),
      "utf8"
    )
  );
  const publicHouseModuleDefaults = JSON.parse(
    fs.readFileSync(
      path.join(publicTemplateRoot, "house-module-defaults.json"),
      "utf8"
    )
  );

  assert.deepEqual(
    publicEvents,
    builtinEvents.filter(
      (record) => !contract.PUBLICATION_OMITTED_EVENT_IDS.includes(record.id)
    )
  );
  assert.deepEqual(publicDialogues, builtinDialogues);
  assert.deepEqual(publicEventBindings, builtinEventBindings);
  assert.deepEqual(
    publicMenuResources,
    builtinMenuResources.map((record) => {
      if (record.id !== "menu-resource.city.default") {
        return record;
      }
      return {
        ...record,
        entries: record.entries.filter(
          (entry) =>
            !contract.PUBLICATION_OMITTED_MENU_RESOURCE_ENTRY_IDS.includes(
              entry.id
            )
        ),
      };
    })
  );
  assert.deepEqual(publicHouseModuleDefaults, builtinHouseModuleDefaults);
});

test("zhuyuanzhang contract freezes current publication-only and builtin-only residual records", async () => {
  const contract = await importModule(
    "tools/zhuyuanzhang-source-sync-contract.mjs"
  );
  const runtimeRoot = path.join(
    process.cwd(),
    "src",
    "content",
    "scenario-packs",
    "zhuyuanzhang"
  );
  const builtinTemplateRoot = path.join(
    process.cwd(),
    "src",
    "modules",
    "script-editor",
    "builtin-templates",
    "zhuyuanzhang"
  );
  const publicTemplateRoot = path.join(
    process.cwd(),
    "public",
    "builtin-script-editor-templates",
    "zhuyuanzhang"
  );
  const runtimeEvents = JSON.parse(
    fs.readFileSync(path.join(runtimeRoot, "events.json"), "utf8")
  );
  const builtinEvents = JSON.parse(
    fs.readFileSync(path.join(builtinTemplateRoot, "events.json"), "utf8")
  );
  const publicEvents = JSON.parse(
    fs.readFileSync(path.join(publicTemplateRoot, "events.json"), "utf8")
  );
  const runtimeDialogues = JSON.parse(
    fs.readFileSync(path.join(runtimeRoot, "dialogues.json"), "utf8")
  );
  const builtinDialogues = JSON.parse(
    fs.readFileSync(path.join(builtinTemplateRoot, "dialogues.json"), "utf8")
  );
  const publicDialogues = JSON.parse(
    fs.readFileSync(path.join(publicTemplateRoot, "dialogues.json"), "utf8")
  );

  const runtimeEventIds = new Set(runtimeEvents.map((record) => record.id));
  const builtinEventIds = new Set(builtinEvents.map((record) => record.id));
  const publicEventIds = new Set(publicEvents.map((record) => record.id));
  const runtimeDialogueIds = new Set(runtimeDialogues.map((record) => record.id));
  const builtinDialogueIds = new Set(builtinDialogues.map((record) => record.id));
  const publicDialogueIds = new Set(publicDialogues.map((record) => record.id));

  assert.deepEqual(contract.PUBLICATION_ONLY_EVENT_IDS, []);
  assert.deepEqual(contract.PUBLICATION_ONLY_DIALOGUE_IDS, []);
  assert.deepEqual(
    [...publicEventIds].sort(),
    [...builtinEventIds]
      .filter((eventId) => !contract.PUBLICATION_OMITTED_EVENT_IDS.includes(eventId))
      .sort()
  );
  assert.deepEqual([...publicDialogueIds].sort(), [...builtinDialogueIds].sort());

  for (const eventId of contract.BUILTIN_ONLY_EVENT_IDS) {
    assert.equal(builtinEventIds.has(eventId), true);
    assert.equal(runtimeEventIds.has(eventId), false);
    assert.equal(publicEventIds.has(eventId), false);
  }
});

test("zhuyuanzhang canonical playable family still resolves from builtin template playable-shells", async () => {
  const syncTool = await importModule(
    "tools/sync-zhuyuanzhang-startup-templates.mjs"
  );
  const runtimeRoot = path.join(
    process.cwd(),
    "src",
    "content",
    "scenario-packs",
    "zhuyuanzhang"
  );
  const builtinTemplatePlayableShells = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "modules",
        "script-editor",
        "builtin-templates",
        "zhuyuanzhang",
        "playable-shells.json"
      ),
      "utf8"
    )
  );
  assert.deepEqual(
    await syncTool.resolveCanonicalPlayableFamilyForSync(
      process.cwd(),
      runtimeRoot,
      null
    ),
    {
      playables: JSON.parse(
        fs.readFileSync(
          path.join(
            process.cwd(),
            "src",
            "modules",
            "script-editor",
            "builtin-templates",
            "zhuyuanzhang",
            "playables.json"
          ),
          "utf8"
        )
      ),
      playableIntegrations: JSON.parse(
        fs.readFileSync(
          path.join(
            process.cwd(),
            "src",
            "modules",
            "script-editor",
            "builtin-templates",
            "zhuyuanzhang",
            "playable-integrations.json"
          ),
          "utf8"
        )
      ),
      playableShells: builtinTemplatePlayableShells,
    }
  );
});

test("zhuyuanzhang runtime pack mirrors template-owned runtime building-support files", async () => {
  const runtimeRoot = path.join(
    process.cwd(),
    "src",
    "content",
    "scenario-packs",
    "zhuyuanzhang"
  );
  const templateRoot = path.join(
    process.cwd(),
    "src",
    "modules",
    "script-editor",
    "builtin-templates",
    "zhuyuanzhang"
  );
  const runtimeManifest = JSON.parse(
    fs.readFileSync(path.join(runtimeRoot, "pack.json"), "utf8")
  );

  for (const [manifestKey, fileName] of [
    ["buildingArrangements", "building-arrangements.json"],
    ["dialogues", "dialogues.json"],
    ["houseModuleDefaults", "house-module-defaults.json"],
    ["locationAccess", "location-access.json"],
    ["menuInstances", "menu-instances.json"],
    ["menuResources", "menu-resources.json"],
    ["settlements", "settlements.json"],
  ]) {
    assert.equal(runtimeManifest.files[manifestKey], fileName);
    assert.deepEqual(
      JSON.parse(fs.readFileSync(path.join(runtimeRoot, fileName), "utf8")),
      JSON.parse(fs.readFileSync(path.join(templateRoot, fileName), "utf8"))
    );
  }

  assert.equal(runtimeManifest.files.eventBindings, "event-bindings.json");
});

test("zhuyuanzhang runtime event-binding projection keeps only bindings backed by mirrored runtime events", async () => {
  const syncTool = await importModule(
    "tools/sync-zhuyuanzhang-startup-templates.mjs"
  );

  assert.equal(typeof syncTool.projectRuntimeEventBindingsForSync, "function");
  assert.deepEqual(
    syncTool.projectRuntimeEventBindingsForSync(
      [
        { id: "binding.keep", eventId: "event.runtime.keep" },
        { id: "binding.drop", eventId: "event.template.only" },
      ],
      [
        { id: "event.runtime.keep" },
      ]
    ),
    [{ id: "binding.keep", eventId: "event.runtime.keep" }]
  );
});

test("zhuyuanzhang public menu-resource projection is fully derived from builtin template", async () => {
  const syncTool = await importModule(
    "tools/sync-zhuyuanzhang-startup-templates.mjs"
  );

  assert.equal(typeof syncTool.projectPublicMenuResourcesForSync, "function");
  assert.deepEqual(
    syncTool.projectPublicMenuResourcesForSync([
      {
        id: "menu-resource.city.default",
        entries: [
          { id: "menu-entry.city.default.overview" },
          { id: "menu-entry.city.default.grain-accounting" },
          { id: "menu-entry.city.default.medicine-compounding" },
        ],
      },
      {
        id: "menu-resource.house.template.keep.primary",
        entries: [{ id: "review" }],
      },
    ]),
    [
      {
        id: "menu-resource.city.default",
        entries: [
          { id: "menu-entry.city.default.overview" },
          { id: "menu-entry.city.default.grain-accounting" },
          { id: "menu-entry.city.default.medicine-compounding" },
        ],
      },
      {
        id: "menu-resource.house.template.keep.primary",
        entries: [{ id: "review" }],
      },
    ]
  );
});

test("zhuyuanzhang runtime pack filters template event-bindings down to mirrored runtime events", async () => {
  const runtimeRoot = path.join(
    process.cwd(),
    "src",
    "content",
    "scenario-packs",
    "zhuyuanzhang"
  );
  const templateRoot = path.join(
    process.cwd(),
    "src",
    "modules",
    "script-editor",
    "builtin-templates",
    "zhuyuanzhang"
  );
  const runtimeEvents = JSON.parse(
    fs.readFileSync(path.join(runtimeRoot, "events.json"), "utf8")
  );
  const runtimeEventBindings = JSON.parse(
    fs.readFileSync(path.join(runtimeRoot, "event-bindings.json"), "utf8")
  );
  const templateEventBindings = JSON.parse(
    fs.readFileSync(path.join(templateRoot, "event-bindings.json"), "utf8")
  );
  const runtimeEventIds = new Set(runtimeEvents.map((record) => record.id));
  const templateBindingKeys = new Set(
    templateEventBindings.map((record) => JSON.stringify(record))
  );

  for (const binding of runtimeEventBindings) {
    assert.equal(runtimeEventIds.has(binding.eventId), true);
    assert.equal(templateBindingKeys.has(JSON.stringify(binding)), true);
  }
});

test("zhuyuanzhang runtime event projection only mirrors the safe temple event subset", async () => {
  const syncTool = await importModule(
    "tools/sync-zhuyuanzhang-startup-templates.mjs"
  );
  const runtimeEvents = [
    { id: "event.runtime.kept", name: "keep" },
    { id: "event.building.template.house.temple.leave", name: "old leave" },
  ];
  const templateEvents = [
    { id: "event.building.house.kulan.temple.enter", name: "enter" },
    {
      id: "event.building.template.house.temple.leave",
      name: "template leave",
    },
    {
      id: "event.building.house.kulan.temple.carry_water",
      name: "carry water",
    },
  ];

  assert.deepEqual(
    syncTool.projectRuntimeEventsForSync(templateEvents, runtimeEvents),
    [
      { id: "event.runtime.kept", name: "keep" },
      {
        id: "event.building.template.house.temple.leave",
        name: "template leave",
      },
      {
        id: "event.building.house.kulan.temple.carry_water",
        name: "carry water",
      },
    ]
  );
});

test("zhuyuanzhang runtime pack mirrors the safe temple event subset without enabling temple enter event", async () => {
  const runtimeRoot = path.join(
    process.cwd(),
    "src",
    "content",
    "scenario-packs",
    "zhuyuanzhang"
  );
  const templateRoot = path.join(
    process.cwd(),
    "src",
    "modules",
    "script-editor",
    "builtin-templates",
    "zhuyuanzhang"
  );
  const runtimeEvents = JSON.parse(
    fs.readFileSync(path.join(runtimeRoot, "events.json"), "utf8")
  );
  const templateEvents = JSON.parse(
    fs.readFileSync(path.join(templateRoot, "events.json"), "utf8")
  );
  const runtimeById = new Map(runtimeEvents.map((record) => [record.id, record]));
  const templateById = new Map(
    templateEvents.map((record) => [record.id, record])
  );

  for (const eventId of [
    "event.building.template.house.temple.review",
    "event.building.house.kulan.temple.copy_scripture",
    "event.building.house.kulan.temple.sweep_courtyard",
    "event.building.template.house.temple.leave",
    "event.building.template.house.temple.donate",
    "event.building.house.kulan.temple.carry_water",
  ]) {
    assert.deepEqual(runtimeById.get(eventId), templateById.get(eventId));
  }

  assert.equal(
    runtimeById.has("event.building.house.kulan.temple.enter"),
    false
  );
});

test("zhuyuanzhang playable-family files now stay canonical in template pack, mirrored into runtime pack, and published to public through the safe subset", () => {
  const runtimeRoot = path.join(
    process.cwd(),
    "src",
    "content",
    "scenario-packs",
    "zhuyuanzhang"
  );
  const builtinTemplateRoot = path.join(
    process.cwd(),
    "src",
    "modules",
    "script-editor",
    "builtin-templates",
    "zhuyuanzhang"
  );
  const publicTemplateRoot = path.join(
    process.cwd(),
    "public",
    "builtin-script-editor-templates",
    "zhuyuanzhang"
  );

  for (const fileName of [
    "playables.json",
    "playable-integrations.json",
    "playable-shells.json",
  ]) {
    assert.equal(
      fs.existsSync(path.join(builtinTemplateRoot, fileName)),
      true
    );
    assert.equal(
      fs.existsSync(path.join(runtimeRoot, fileName)),
      true
    );
    assert.equal(
      fs.existsSync(path.join(publicTemplateRoot, fileName)),
      true
    );
  }

  assert.equal(
    fs.existsSync(path.join(runtimeRoot, "flow-playables.json")),
    false
  );
  assert.equal(
    fs.existsSync(path.join(builtinTemplateRoot, "flow-playables.json")),
    false
  );

  assert.equal(
    fs.existsSync(path.join(publicTemplateRoot, "flow-playables.json")),
    false
  );
});

test("zhuyuanzhang playable family remains template-canonical while runtime pack only mirrors the approved temple launch-playable events", async () => {
  const runtimeManifest = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "content",
        "scenario-packs",
        "zhuyuanzhang",
        "pack.json"
      ),
      "utf8"
    )
  );
  const templateManifest = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "modules",
        "script-editor",
        "builtin-templates",
        "zhuyuanzhang",
        "pack.json"
      ),
      "utf8"
    )
  );
  const runtimeEvents = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "content",
        "scenario-packs",
        "zhuyuanzhang",
        "events.json"
      ),
      "utf8"
    )
  );
  const templateEvents = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "modules",
        "script-editor",
        "builtin-templates",
        "zhuyuanzhang",
        "events.json"
      ),
      "utf8"
    )
  );
  const runtimePlayables = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "content",
        "scenario-packs",
        "zhuyuanzhang",
        "playables.json"
      ),
      "utf8"
    )
  );
  const runtimePlayableIntegrations = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "content",
        "scenario-packs",
        "zhuyuanzhang",
        "playable-integrations.json"
      ),
      "utf8"
    )
  );
  const runtimePlayableShells = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "content",
        "scenario-packs",
        "zhuyuanzhang",
        "playable-shells.json"
      ),
      "utf8"
    )
  );
  const templatePlayables = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "modules",
        "script-editor",
        "builtin-templates",
        "zhuyuanzhang",
        "playables.json"
      ),
      "utf8"
    )
  );
  const templatePlayableIntegrations = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "modules",
        "script-editor",
        "builtin-templates",
        "zhuyuanzhang",
        "playable-integrations.json"
      ),
      "utf8"
    )
  );
  const templatePlayableShells = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "modules",
        "script-editor",
        "builtin-templates",
        "zhuyuanzhang",
        "playable-shells.json"
      ),
      "utf8"
    )
  );

  assert.equal(Object.hasOwn(runtimeManifest.files, "playables"), true);
  assert.equal(Object.hasOwn(runtimeManifest.files, "playableIntegrations"), true);
  assert.equal(Object.hasOwn(runtimeManifest.files, "playableShells"), true);
  assert.equal(templateManifest.files.playables, "playables.json");
  assert.equal(
    templateManifest.files.playableIntegrations,
    "playable-integrations.json"
  );
  assert.equal(templateManifest.files.playableShells, "playable-shells.json");
  assert.deepEqual(runtimePlayables, templatePlayables);
  assert.deepEqual(runtimePlayableIntegrations, templatePlayableIntegrations);
  assert.deepEqual(runtimePlayableShells, templatePlayableShells);

  const runtimeActionTypes = runtimeEvents.flatMap((event) =>
    Array.isArray(event.actions)
      ? event.actions.map((action) => action?.type).filter(Boolean)
      : []
  );
  const templateActionTypes = templateEvents.flatMap((event) =>
    Array.isArray(event.actions)
      ? event.actions.map((action) => action?.type).filter(Boolean)
      : []
  );

  const contract = await importModule(
    "tools/zhuyuanzhang-source-sync-contract.mjs"
  );
  const runtimeLaunchPlayableEventIds = runtimeEvents
    .filter((event) =>
      Array.isArray(event.actions) &&
      event.actions.some((action) => action?.type === "launchPlayable")
    )
    .map((event) => event.id)
    .sort();

  assert.equal(runtimeActionTypes.includes("launchFlow"), false);
  assert.deepEqual(runtimeLaunchPlayableEventIds, [
    "event.building.house.kulan.temple.carry_water",
    "event.building.house.kulan.temple.copy_scripture",
    "event.building.house.kulan.temple.sweep_courtyard",
  ]);
  for (const eventId of runtimeLaunchPlayableEventIds) {
    assert.equal(contract.RUNTIME_SAFE_EVENT_MIRROR_IDS.includes(eventId), true);
  }
  assert.equal(templateActionTypes.includes("launchPlayable"), true);
});
