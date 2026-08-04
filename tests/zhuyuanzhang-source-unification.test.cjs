const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const test = require("node:test");

async function importModule(relativePath) {
  return import(pathToFileURL(path.join(process.cwd(), relativePath)).href);
}

test("zhuyuanzhang source contract keeps exactly two maintained packs and one published pack", async () => {
  const contract = await importModule(
    "tools/zhuyuanzhang-source-sync-contract.mjs"
  );

  assert.deepEqual(Object.keys(contract.MAINTAINED_PACK_ROOTS), [
    "builtinRuntimePack",
    "scriptEditorTemplatePack",
  ]);
  assert.deepEqual(Object.keys(contract.PUBLISHED_PACK_ROOTS), [
    "publicTemplatePublication",
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
});

test("zhuyuanzhang source contract keeps the public template url as a publication-layer dependency", async () => {
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
    /DEFAULT_SCRIPT_EDITOR_TEMPLATE_SCENARIO_PACK_URL\s*=\s*\r?\n\s*"\/script-editor-templates\/zhuyuanzhang\/pack\.json"/
  );
  assert.equal(
    contract.DEFAULT_TEMPLATE_PUBLIC_PACK_URL,
    "/script-editor-templates/zhuyuanzhang/pack.json"
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
      "script-editor-templates",
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
      "script-editor-templates",
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
  ]);
  assert.deepEqual(contract.DEFERRED_SYNC_FILE_RULES.map((rule) => rule.fileName), [
    "pack.json",
    "cities.json",
    "city-entries.json",
    "events.json",
    "houses.json",
    "maps.json",
  ]);
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
  assert.deepEqual(contract.PUBLICATION_OMITTED_EVENT_IDS, [
    "event.playable.grain_accounting.failure_reward",
    "event.playable.medicine_compounding.failure_reward",
  ]);
  assert.deepEqual(contract.BUILTIN_ONLY_EVENT_IDS, [
    "event.playable.grain_accounting.failure_reward",
    "event.playable.medicine_compounding.failure_reward",
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
        "script-editor-templates",
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
    "script-editor-templates",
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
    "script-editor-templates",
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
        "script-editor-templates",
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
    "script-editor-templates",
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
    "script-editor-templates",
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
    "script-editor-templates",
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
