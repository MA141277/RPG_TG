const assert = require("node:assert/strict");
const { execFileSync, spawnSync } = require("node:child_process");
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

test("zhuyuanzhang source contract records publication-only manifest keys and builtin-only manifest keys", async () => {
  const contract = await importModule(
    "tools/zhuyuanzhang-source-sync-contract.mjs"
  );

  assert.deepEqual(contract.PUBLICATION_ONLY_MANIFEST_FILE_KEYS, [
    "flowPlayables",
  ]);
  assert.deepEqual(contract.BUILTIN_TEMPLATE_ONLY_MANIFEST_FILE_KEYS, [
    "playables",
    "playableIntegrations",
    "settlements",
  ]);
  assert.deepEqual(contract.PLAYABLE_FAMILY_FILE_NAMES, [
    "playables.json",
    "playable-integrations.json",
    "playable-shells.json",
  ]);
  assert.deepEqual(contract.PLAYABLE_FAMILY_OWNERSHIP, {
    canonicalMaintainedOwner: "scriptEditorTemplatePack",
    runtimePackMirrorMode: "derived-from-script-editor-template-pack",
    publicPublicationFile: "flow-playables.json",
    publicPublicationDerivedFrom: "playable-shells.json",
  });
  assert.deepEqual(
    contract.PUBLICATION_SYNC_FILE_RULES.map((rule) => rule.fileName),
    ["pack.json", "playable-shells.json", "flow-playables.json"]
  );
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

test("zhuyuanzhang source contract marks flow-playables as a legacy public-only artifact", async () => {
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

  assert.deepEqual(contract.LEGACY_PUBLICATION_FILE_RULES, [
    {
      fileName: "flow-playables.json",
      manifestKey: "flowPlayables",
      reason:
        "旧 public 模板仍直接暴露 flow-playables.json，但它不是两套维护源中的正式小游戏 family。",
    },
  ]);
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
  assert.equal(
    publicManifest.files.flowPlayables,
    "flow-playables.json"
  );
  assert.equal(
    publicManifest.files.playableShells,
    "playable-shells.json"
  );
});

test("zhuyuanzhang manifest projection keeps public publication keys while omitting builtin-only playable keys", async () => {
  const syncTool = await importModule(
    "tools/sync-zhuyuanzhang-startup-templates.mjs"
  );

  assert.equal(typeof syncTool.projectPublicPackManifestForSync, "function");
  assert.equal(
    typeof syncTool.projectLegacyPublicFlowPlayablesForSync,
    "function"
  );

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
        flowPlayables: "flow-playables.json",
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
      playableShells: "playable-shells.json",
      textEntries: "text-entries.json",
      flowPlayables: "flow-playables.json",
    },
  });

  assert.deepEqual(
    syncTool.projectLegacyPublicFlowPlayablesForSync([
      { id: "flow.test.public", title: "Public Flow" },
    ]),
    [{ id: "flow.test.public", title: "Public Flow" }]
  );
});

test("zhuyuanzhang public flow-playables file is fully derived from builtin template playable-shells", async () => {
  const syncTool = await importModule(
    "tools/sync-zhuyuanzhang-startup-templates.mjs"
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
  const publicLegacyFlowPlayables = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "public",
        "script-editor-templates",
        "zhuyuanzhang",
        "flow-playables.json"
      ),
      "utf8"
    )
  );

  assert.deepEqual(
    publicLegacyFlowPlayables,
    syncTool.projectLegacyPublicFlowPlayablesForSync(
      builtinTemplatePlayableShells
    )
  );
  const runtimeRoot = path.join(
    process.cwd(),
    "src",
    "content",
    "scenario-packs",
    "zhuyuanzhang"
  );
  assert.deepEqual(
    await syncTool.resolveCanonicalPublicFlowPlayablesForSync(
      process.cwd(),
      runtimeRoot,
      null
    ),
    publicLegacyFlowPlayables
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
    ["eventBindings", "event-bindings.json"],
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

test("zhuyuanzhang playable-family files now stay canonical in template pack, mirrored into runtime pack, and published to public only through approved shells", () => {
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
      fileName === "playable-shells.json"
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
    true
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

test("zhuyuanzhang legacy public flow-playables audit still reports owner-gap for synthetic drift input", async () => {
  const syncTool = await importModule(
    "tools/sync-zhuyuanzhang-startup-templates.mjs"
  );
  const audit = syncTool.auditLegacyPublicFlowPlayablesOwnerGap(
    [],
    [
      { id: "flow.test.owner-gap.1" },
      { id: "flow.test.owner-gap.2" },
    ]
  );

  assert.equal(audit.status, "owner-gap");
  assert.equal(audit.maintainedShellCount, 0);
  assert.equal(audit.publicLegacyFlowCount, 2);
  assert.equal(audit.publicOnlyFlowCount, 2);
  assert.deepEqual(audit.publicOnlyFlowIds, [
    "flow.test.owner-gap.1",
    "flow.test.owner-gap.2",
  ]);
});

test("zhuyuanzhang legacy public flow-playables audit is aligned for the current repository state", async () => {
  const syncTool = await importModule(
    "tools/sync-zhuyuanzhang-startup-templates.mjs"
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
  const publicLegacyFlowPlayables = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "public",
        "script-editor-templates",
        "zhuyuanzhang",
        "flow-playables.json"
      ),
      "utf8"
    )
  );

  const audit = syncTool.auditLegacyPublicFlowPlayablesOwnerGap(
    builtinTemplatePlayableShells,
    publicLegacyFlowPlayables
  );

  assert.equal(audit.status, "aligned");
  assert.equal(audit.maintainedShellCount, 24);
  assert.equal(audit.publicLegacyFlowCount, 24);
  assert.equal(audit.publicOnlyFlowCount, 0);
  assert.deepEqual(audit.publicOnlyFlowIds, []);
});

test("zhuyuanzhang legacy public flow-playables check mode now passes with maintained ownership", () => {
  const toolPath = path.join(
    process.cwd(),
    "tools",
    "sync-zhuyuanzhang-startup-templates.mjs"
  );
  const nodePath =
    process.env.NODE ||
    "/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node";
  const result = spawnSync(nodePath, [toolPath, "--check-legacy-publication-drift"], {
    cwd: process.cwd(),
    encoding: "utf8",
  });

  assert.equal(result.status, 0);
  assert.match(
    result.stdout,
    /legacy public flow-playables are fully owned by maintained playable-shells/i
  );
});
