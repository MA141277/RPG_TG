import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import {
  BUILTIN_TEMPLATE_ONLY_MANIFEST_FILE_KEYS,
  PLAYABLE_FAMILY_FILE_NAMES,
  PUBLICATION_ONLY_MANIFEST_FILE_KEYS,
  PUBLICATION_SYNC_FILE_RULES,
  RUNTIME_BUILDING_SUPPORT_FILE_NAMES,
  RUNTIME_SAFE_EVENT_MIRROR_IDS,
  resolveZhuyuanzhangPackRoots,
  resolveZhuyuanzhangSyncDirection,
  SHARED_SYNC_FILE_RULES,
} from "./zhuyuanzhang-source-sync-contract.mjs";

const repoRoot = process.cwd();
const characterStartupFieldKeys = [
  "name",
  "birthYear",
  "deathYear",
  "age",
  "title",
  "occupation",
  "clanId",
  "affiliationLabel",
  "biography",
];
const runtimeMirrorManifestFileMap = Object.freeze({
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
});

function formatJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function readJsonIfExists(filePath) {
  try {
    return await readJson(filePath);
  } catch (error) {
    if (error != null && typeof error === "object" && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

function toStableIdList(records) {
  return [...new Set(
    (Array.isArray(records) ? records : []).flatMap((record) => {
      if (
        record != null &&
        typeof record === "object" &&
        !Array.isArray(record) &&
        typeof record.id === "string" &&
        record.id.trim().length > 0
      ) {
        return [record.id.trim()];
      }
      return [];
    })
  )].sort();
}

export function auditLegacyPublicFlowPlayablesOwnerGap(
  builtinTemplatePlayableShells,
  publicFlowPlayables
) {
  const maintainedShellIds = toStableIdList(builtinTemplatePlayableShells);
  const publicLegacyFlowIds = toStableIdList(publicFlowPlayables);
  const maintainedShellIdSet = new Set(maintainedShellIds);
  const publicOnlyFlowIds = publicLegacyFlowIds.filter(
    (id) => !maintainedShellIdSet.has(id)
  );

  return {
    status: publicOnlyFlowIds.length === 0 ? "aligned" : "owner-gap",
    maintainedShellCount: maintainedShellIds.length,
    publicLegacyFlowCount: publicLegacyFlowIds.length,
    publicOnlyFlowCount: publicOnlyFlowIds.length,
    publicOnlyFlowIds,
  };
}

function syncCharacterStartupFields(runtimeCharacters, targetCharacters) {
  const runtimeById = new Map(runtimeCharacters.map((record) => [record.id, record]));

  return targetCharacters.map((record) => {
    const runtimeRecord = runtimeById.get(record.id);
    if (runtimeRecord == null) {
      return record;
    }

    const nextRecord = { ...record };
    for (const key of characterStartupFieldKeys) {
      if (Object.prototype.hasOwnProperty.call(runtimeRecord, key)) {
        nextRecord[key] = runtimeRecord[key];
        continue;
      }

      delete nextRecord[key];
    }
    return nextRecord;
  });
}

export function projectTextEntriesForSync(sourceEntries, targetEntries) {
  const nextEntries = {};
  for (const key of Object.keys(targetEntries)) {
    if (Object.prototype.hasOwnProperty.call(sourceEntries, key)) {
      nextEntries[key] = sourceEntries[key];
      continue;
    }

    nextEntries[key] = targetEntries[key];
  }
  return nextEntries;
}

export function projectActivitiesForSync(sourceActivities, targetActivities) {
  const sourceById = new Map(sourceActivities.map((record) => [record.id, record]));

  return targetActivities.map((targetRecord) => {
    const sourceRecord = sourceById.get(targetRecord.id);
    if (sourceRecord == null) {
      return targetRecord;
    }

    return {
      ...targetRecord,
      ...sourceRecord,
    };
  });
}

export function projectRuntimeEventsForSync(sourceEvents, targetEvents) {
  const sourceById = new Map(
    (Array.isArray(sourceEvents) ? sourceEvents : []).map((record) => [
      record.id,
      record,
    ])
  );
  const mirroredIds = new Set(RUNTIME_SAFE_EVENT_MIRROR_IDS);
  const nextEvents = [];
  const seenMirroredIds = new Set();

  for (const targetRecord of Array.isArray(targetEvents) ? targetEvents : []) {
    if (!mirroredIds.has(targetRecord.id)) {
      nextEvents.push(targetRecord);
      continue;
    }

    const sourceRecord = sourceById.get(targetRecord.id);
    if (sourceRecord == null) {
      nextEvents.push(targetRecord);
      continue;
    }

    nextEvents.push(sourceRecord);
    seenMirroredIds.add(targetRecord.id);
  }

  for (const eventId of RUNTIME_SAFE_EVENT_MIRROR_IDS) {
    if (seenMirroredIds.has(eventId)) {
      continue;
    }
    const sourceRecord = sourceById.get(eventId);
    if (sourceRecord != null) {
      nextEvents.push(sourceRecord);
    }
  }

  return nextEvents;
}

export function projectPublicPackManifestForSync(
  sourceManifest,
  targetManifest
) {
  const projectedFiles = {};
  for (const [key, value] of Object.entries(sourceManifest.files ?? {})) {
    if (BUILTIN_TEMPLATE_ONLY_MANIFEST_FILE_KEYS.includes(key)) {
      continue;
    }
    projectedFiles[key] = value;
  }

  for (const key of PUBLICATION_ONLY_MANIFEST_FILE_KEYS) {
    const targetValue = targetManifest?.files?.[key];
    if (typeof targetValue === "string" && targetValue.length > 0) {
      projectedFiles[key] = targetValue;
    }
  }

  return {
    schemaVersion: sourceManifest.schemaVersion,
    kind: sourceManifest.kind,
    id: sourceManifest.id,
    title: sourceManifest.title,
    ...(sourceManifest.description == null
      ? {}
      : { description: sourceManifest.description }),
    files: projectedFiles,
  };
}

export function projectRuntimePackManifestForSync(
  sourceManifest,
  targetManifest
) {
  const nextManifest = JSON.parse(JSON.stringify(targetManifest ?? {}));
  nextManifest.schemaVersion = sourceManifest.schemaVersion;
  nextManifest.kind = sourceManifest.kind;
  nextManifest.id = sourceManifest.id;
  nextManifest.title = sourceManifest.title;
  if (sourceManifest.description == null) {
    delete nextManifest.description;
  } else {
    nextManifest.description = sourceManifest.description;
  }
  nextManifest.files = {
    ...(targetManifest?.files ?? {}),
  };

  for (const [manifestKey, fileName] of Object.entries(
    runtimeMirrorManifestFileMap
  )) {
    nextManifest.files[manifestKey] = fileName;
  }

  return nextManifest;
}

export function projectLegacyPublicFlowPlayablesForSync(sourcePlayableShells) {
  return Array.isArray(sourcePlayableShells)
    ? JSON.parse(JSON.stringify(sourcePlayableShells))
    : [];
}

export async function resolveCanonicalPublicFlowPlayablesForSync(
  repoRootPath,
  sourceRoot,
  sourcePlayableShells
) {
  if (
    sourceRoot.includes("/builtin-templates/") &&
    Array.isArray(sourcePlayableShells)
  ) {
    return projectLegacyPublicFlowPlayablesForSync(sourcePlayableShells);
  }

  const { builtinTemplateRoot } = resolveZhuyuanzhangPackRoots(repoRootPath);
  return projectLegacyPublicFlowPlayablesForSync(
    await readJson(path.join(builtinTemplateRoot, "playable-shells.json"))
  );
}

export async function resolveCanonicalPlayableFamilyForSync(
  repoRootPath,
  sourceRoot,
  sourcePlayableFamily
) {
  if (
    sourceRoot.includes("/builtin-templates/") &&
    sourcePlayableFamily != null
  ) {
    return {
      playables: JSON.parse(JSON.stringify(sourcePlayableFamily.playables ?? [])),
      playableIntegrations: JSON.parse(
        JSON.stringify(sourcePlayableFamily.playableIntegrations ?? [])
      ),
      playableShells: JSON.parse(
        JSON.stringify(sourcePlayableFamily.playableShells ?? [])
      ),
    };
  }

  const { builtinTemplateRoot } = resolveZhuyuanzhangPackRoots(repoRootPath);
  return {
    playables: await readJson(path.join(builtinTemplateRoot, "playables.json")),
    playableIntegrations: await readJson(
      path.join(builtinTemplateRoot, "playable-integrations.json")
    ),
    playableShells: await readJson(
      path.join(builtinTemplateRoot, "playable-shells.json")
    ),
  };
}

export async function resolveCanonicalRuntimeBuildingSupportForSync(
  repoRootPath,
  sourceRoot,
  sourceRuntimeBuildingSupport
) {
  const fileNameByKey = {
    buildingArrangements: "building-arrangements.json",
    dialogues: "dialogues.json",
    eventBindings: "event-bindings.json",
    houseModuleDefaults: "house-module-defaults.json",
    locationAccess: "location-access.json",
    menuInstances: "menu-instances.json",
    menuResources: "menu-resources.json",
    settlements: "settlements.json",
  };

  if (
    sourceRoot.includes("/builtin-templates/") &&
    sourceRuntimeBuildingSupport != null
  ) {
    return Object.fromEntries(
      Object.keys(fileNameByKey).map((key) => [
        key,
        JSON.parse(JSON.stringify(sourceRuntimeBuildingSupport[key] ?? [])),
      ])
    );
  }

  const { builtinTemplateRoot } = resolveZhuyuanzhangPackRoots(repoRootPath);
  return Object.fromEntries(
    await Promise.all(
      Object.entries(fileNameByKey).map(async ([key, fileName]) => [
        key,
        await readJson(path.join(builtinTemplateRoot, fileName)),
      ])
    )
  );
}

export async function resolveCanonicalRuntimeEventsForSync(
  repoRootPath,
  sourceRoot,
  sourceEvents
) {
  if (sourceRoot.includes("/builtin-templates/") && Array.isArray(sourceEvents)) {
    return JSON.parse(JSON.stringify(sourceEvents));
  }

  const { builtinTemplateRoot } = resolveZhuyuanzhangPackRoots(repoRootPath);
  return readJson(path.join(builtinTemplateRoot, "events.json"));
}

async function buildTargetContents(sourceRoot, targetRoots) {
  const { runtimeRoot } = resolveZhuyuanzhangPackRoots(repoRoot);
  const sourceScenarioProfile = await readJson(
    path.join(sourceRoot, "scenario-profile.json")
  );
  const sourceCharacters = await readJson(path.join(sourceRoot, "characters.json"));
  const sourceTextEntries = await readJson(path.join(sourceRoot, "text-entries.json"));
  const sourceActivities = await readJson(path.join(sourceRoot, "activities.json"));
  const sourcePackManifest = await readJson(path.join(sourceRoot, "pack.json"));
  const { builtinTemplateRoot } = resolveZhuyuanzhangPackRoots(repoRoot);
  const canonicalRuntimeMirrorManifestSource =
    sourceRoot.includes("/builtin-templates/")
      ? sourcePackManifest
      : await readJson(path.join(builtinTemplateRoot, "pack.json"));
  const sourcePlayableShellsPath = path.join(sourceRoot, "playable-shells.json");
  const sourcePlayableShells =
    sourceRoot.includes("/builtin-templates/")
      ? await readJson(sourcePlayableShellsPath)
      : null;
  const canonicalPublicFlowPlayables = await resolveCanonicalPublicFlowPlayablesForSync(
    repoRoot,
    sourceRoot,
    sourcePlayableShells
  );
  const canonicalPlayableFamily = await resolveCanonicalPlayableFamilyForSync(
    repoRoot,
    sourceRoot,
    sourceRoot.includes("/builtin-templates/")
      ? {
          playables: await readJson(path.join(sourceRoot, "playables.json")),
          playableIntegrations: await readJson(
            path.join(sourceRoot, "playable-integrations.json")
          ),
          playableShells: sourcePlayableShells,
        }
      : null
  );
  const canonicalRuntimeBuildingSupport =
    await resolveCanonicalRuntimeBuildingSupportForSync(
      repoRoot,
      sourceRoot,
      sourceRoot.includes("/builtin-templates/")
        ? {
            buildingArrangements: await readJson(
              path.join(sourceRoot, "building-arrangements.json")
            ),
            dialogues: await readJson(path.join(sourceRoot, "dialogues.json")),
            eventBindings: await readJson(
              path.join(sourceRoot, "event-bindings.json")
            ),
            houseModuleDefaults: await readJson(
              path.join(sourceRoot, "house-module-defaults.json")
            ),
            locationAccess: await readJson(
              path.join(sourceRoot, "location-access.json")
            ),
            menuInstances: await readJson(
              path.join(sourceRoot, "menu-instances.json")
            ),
            menuResources: await readJson(
              path.join(sourceRoot, "menu-resources.json")
            ),
            settlements: await readJson(path.join(sourceRoot, "settlements.json")),
          }
        : null
    );
  const canonicalRuntimeEvents = await resolveCanonicalRuntimeEventsForSync(
    repoRoot,
    sourceRoot,
    sourceRoot.includes("/builtin-templates/")
      ? await readJson(path.join(sourceRoot, "events.json"))
      : null
  );

  const results = [];
  for (const targetRoot of targetRoots) {
    const targetCharactersPath = path.join(targetRoot, "characters.json");
    const targetCharacters = await readJson(targetCharactersPath);
    const nextCharacters = syncCharacterStartupFields(
      sourceCharacters,
      targetCharacters
    );

    results.push({
      targetRoot,
      scenarioProfilePath: path.join(targetRoot, "scenario-profile.json"),
      scenarioProfileContent: formatJson(sourceScenarioProfile),
      charactersPath: targetCharactersPath,
      charactersContent: formatJson(nextCharacters),
      textEntriesPath: path.join(targetRoot, "text-entries.json"),
      textEntriesContent: formatJson(
        projectTextEntriesForSync(
          sourceTextEntries,
          await readJson(path.join(targetRoot, "text-entries.json"))
        )
      ),
      activitiesPath: path.join(targetRoot, "activities.json"),
      activitiesContent: formatJson(
        projectActivitiesForSync(
          sourceActivities,
          await readJson(path.join(targetRoot, "activities.json"))
        )
      ),
      packManifestPath: path.join(targetRoot, "pack.json"),
      packManifestContent: formatJson(
        targetRoot === runtimeRoot
          ? projectRuntimePackManifestForSync(
              canonicalRuntimeMirrorManifestSource,
              await readJson(path.join(targetRoot, "pack.json"))
            )
          : path.basename(targetRoot) === "zhuyuanzhang" &&
              targetRoot.includes("/public/")
          ? projectPublicPackManifestForSync(
              sourcePackManifest,
              await readJson(path.join(targetRoot, "pack.json"))
            )
          : await readJson(path.join(targetRoot, "pack.json"))
      ),
      publicFlowPlayablesPath:
        targetRoot.includes("/public/")
          ? path.join(targetRoot, "flow-playables.json")
          : null,
      publicFlowPlayablesContent:
        targetRoot.includes("/public/")
          ? formatJson(canonicalPublicFlowPlayables)
          : null,
      publicPlayableShellsPath:
        targetRoot.includes("/public/")
          ? path.join(targetRoot, "playable-shells.json")
          : null,
      publicPlayableShellsContent:
        targetRoot.includes("/public/")
          ? formatJson(canonicalPlayableFamily.playableShells)
          : null,
      runtimePlayablesPath:
        targetRoot === runtimeRoot ? path.join(targetRoot, "playables.json") : null,
      runtimePlayablesContent:
        targetRoot === runtimeRoot
          ? formatJson(canonicalPlayableFamily.playables)
          : null,
      runtimePlayableIntegrationsPath:
        targetRoot === runtimeRoot
          ? path.join(targetRoot, "playable-integrations.json")
          : null,
      runtimePlayableIntegrationsContent:
        targetRoot === runtimeRoot
          ? formatJson(canonicalPlayableFamily.playableIntegrations)
          : null,
      runtimePlayableShellsPath:
        targetRoot === runtimeRoot
          ? path.join(targetRoot, "playable-shells.json")
          : null,
      runtimePlayableShellsContent:
        targetRoot === runtimeRoot
          ? formatJson(canonicalPlayableFamily.playableShells)
          : null,
      runtimeBuildingArrangementsPath:
        targetRoot === runtimeRoot
          ? path.join(targetRoot, "building-arrangements.json")
          : null,
      runtimeBuildingArrangementsContent:
        targetRoot === runtimeRoot
          ? formatJson(canonicalRuntimeBuildingSupport.buildingArrangements)
          : null,
      runtimeDialoguesPath:
        targetRoot === runtimeRoot ? path.join(targetRoot, "dialogues.json") : null,
      runtimeDialoguesContent:
        targetRoot === runtimeRoot
          ? formatJson(canonicalRuntimeBuildingSupport.dialogues)
          : null,
      runtimeEventBindingsPath:
        targetRoot === runtimeRoot
          ? path.join(targetRoot, "event-bindings.json")
          : null,
      runtimeEventBindingsContent:
        targetRoot === runtimeRoot
          ? formatJson(canonicalRuntimeBuildingSupport.eventBindings)
          : null,
      runtimeHouseModuleDefaultsPath:
        targetRoot === runtimeRoot
          ? path.join(targetRoot, "house-module-defaults.json")
          : null,
      runtimeHouseModuleDefaultsContent:
        targetRoot === runtimeRoot
          ? formatJson(canonicalRuntimeBuildingSupport.houseModuleDefaults)
          : null,
      runtimeLocationAccessPath:
        targetRoot === runtimeRoot
          ? path.join(targetRoot, "location-access.json")
          : null,
      runtimeLocationAccessContent:
        targetRoot === runtimeRoot
          ? formatJson(canonicalRuntimeBuildingSupport.locationAccess)
          : null,
      runtimeMenuInstancesPath:
        targetRoot === runtimeRoot
          ? path.join(targetRoot, "menu-instances.json")
          : null,
      runtimeMenuInstancesContent:
        targetRoot === runtimeRoot
          ? formatJson(canonicalRuntimeBuildingSupport.menuInstances)
          : null,
      runtimeMenuResourcesPath:
        targetRoot === runtimeRoot
          ? path.join(targetRoot, "menu-resources.json")
          : null,
      runtimeMenuResourcesContent:
        targetRoot === runtimeRoot
          ? formatJson(canonicalRuntimeBuildingSupport.menuResources)
          : null,
      runtimeSettlementsPath:
        targetRoot === runtimeRoot
          ? path.join(targetRoot, "settlements.json")
          : null,
      runtimeSettlementsContent:
        targetRoot === runtimeRoot
          ? formatJson(canonicalRuntimeBuildingSupport.settlements)
          : null,
      runtimeEventsPath:
        targetRoot === runtimeRoot ? path.join(targetRoot, "events.json") : null,
      runtimeEventsContent:
        targetRoot === runtimeRoot
          ? formatJson(
              projectRuntimeEventsForSync(
                canonicalRuntimeEvents,
                await readJson(path.join(targetRoot, "events.json"))
              )
            )
          : null,
    });
  }

  if (sourceRoot === runtimeRoot) {
    results.push({
      targetRoot: runtimeRoot,
      scenarioProfilePath: null,
      scenarioProfileContent: null,
      charactersPath: null,
      charactersContent: null,
      textEntriesPath: null,
      textEntriesContent: null,
      activitiesPath: null,
      activitiesContent: null,
      packManifestPath: path.join(runtimeRoot, "pack.json"),
      packManifestContent: formatJson(
        projectRuntimePackManifestForSync(
          canonicalRuntimeMirrorManifestSource,
          await readJson(path.join(runtimeRoot, "pack.json"))
        )
      ),
      publicFlowPlayablesPath: null,
      publicFlowPlayablesContent: null,
      runtimePlayablesPath: path.join(runtimeRoot, "playables.json"),
      runtimePlayablesContent: formatJson(canonicalPlayableFamily.playables),
      runtimePlayableIntegrationsPath: path.join(
        runtimeRoot,
        "playable-integrations.json"
      ),
      runtimePlayableIntegrationsContent: formatJson(
        canonicalPlayableFamily.playableIntegrations
      ),
      runtimePlayableShellsPath: path.join(runtimeRoot, "playable-shells.json"),
      runtimePlayableShellsContent: formatJson(
        canonicalPlayableFamily.playableShells
      ),
      runtimeBuildingArrangementsPath: path.join(
        runtimeRoot,
        "building-arrangements.json"
      ),
      runtimeBuildingArrangementsContent: formatJson(
        canonicalRuntimeBuildingSupport.buildingArrangements
      ),
      runtimeDialoguesPath: path.join(runtimeRoot, "dialogues.json"),
      runtimeDialoguesContent: formatJson(canonicalRuntimeBuildingSupport.dialogues),
      runtimeEventBindingsPath: path.join(runtimeRoot, "event-bindings.json"),
      runtimeEventBindingsContent: formatJson(
        canonicalRuntimeBuildingSupport.eventBindings
      ),
      runtimeHouseModuleDefaultsPath: path.join(
        runtimeRoot,
        "house-module-defaults.json"
      ),
      runtimeHouseModuleDefaultsContent: formatJson(
        canonicalRuntimeBuildingSupport.houseModuleDefaults
      ),
      runtimeLocationAccessPath: path.join(runtimeRoot, "location-access.json"),
      runtimeLocationAccessContent: formatJson(
        canonicalRuntimeBuildingSupport.locationAccess
      ),
      runtimeMenuInstancesPath: path.join(runtimeRoot, "menu-instances.json"),
      runtimeMenuInstancesContent: formatJson(
        canonicalRuntimeBuildingSupport.menuInstances
      ),
      runtimeMenuResourcesPath: path.join(runtimeRoot, "menu-resources.json"),
      runtimeMenuResourcesContent: formatJson(
        canonicalRuntimeBuildingSupport.menuResources
      ),
      runtimeSettlementsPath: path.join(runtimeRoot, "settlements.json"),
      runtimeSettlementsContent: formatJson(
        canonicalRuntimeBuildingSupport.settlements
      ),
      runtimeEventsPath: path.join(runtimeRoot, "events.json"),
      runtimeEventsContent: formatJson(
        projectRuntimeEventsForSync(
          canonicalRuntimeEvents,
          await readJson(path.join(runtimeRoot, "events.json"))
        )
      ),
    });
  }

  return results;
}

function areJsonValuesEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

async function main() {
  const legacyPublicationAuditMode =
    process.argv.includes("--check-legacy-publication-drift");
  if (legacyPublicationAuditMode) {
    const builtinTemplateRoot = path.join(
      repoRoot,
      "src",
      "modules",
      "script-editor",
      "builtin-templates",
      "zhuyuanzhang"
    );
    const publicTemplateRoot = path.join(
      repoRoot,
      "public",
      "script-editor-templates",
      "zhuyuanzhang"
    );
    const audit = auditLegacyPublicFlowPlayablesOwnerGap(
      await readJson(path.join(builtinTemplateRoot, "playable-shells.json")),
      await readJson(path.join(publicTemplateRoot, "flow-playables.json"))
    );

    if (audit.status === "aligned") {
      console.log(
        "Zhuyuanzhang legacy public flow-playables are fully owned by maintained playable-shells."
      );
      return;
    }

    console.error(
      "Zhuyuanzhang legacy public flow-playables still have no maintained-pack owner."
    );
    console.error(
      `- builtin template playable-shells: ${audit.maintainedShellCount}`
    );
    console.error(
      `- public legacy flow-playables: ${audit.publicLegacyFlowCount}`
    );
    console.error(
      `- public-only owner gaps: ${audit.publicOnlyFlowCount}`
    );
    for (const id of audit.publicOnlyFlowIds) {
      console.error(`  - ${id}`);
    }
    process.exitCode = 1;
    return;
  }

  const checkMode = process.argv.includes("--check");
  const writeMode = !checkMode || process.argv.includes("--write");
  const sourceArg = process.argv.find((arg) => arg.startsWith("--source="));
  const source = sourceArg?.slice("--source=".length) ?? "builtin-runtime-pack";
  const updates = [];
  const { sourceRoot, targetRoots } = resolveZhuyuanzhangSyncDirection(
    repoRoot,
    source
  );
  const targets = await buildTargetContents(sourceRoot, targetRoots);
  const supportedFileNames = new Set(
    SHARED_SYNC_FILE_RULES.map((rule) => rule.fileName)
  );
  const publicationFileNames = new Set(
    PUBLICATION_SYNC_FILE_RULES.map((rule) => rule.fileName)
  );
  const runtimeMirrorFileNames = new Set([
    ...PLAYABLE_FAMILY_FILE_NAMES,
    ...RUNTIME_BUILDING_SUPPORT_FILE_NAMES,
    "events.json",
  ]);

  for (const target of targets) {
    for (const file of [
      {
        fileName: "scenario-profile.json",
        filePath: target.scenarioProfilePath,
        content: target.scenarioProfileContent,
      },
      {
        fileName: "characters.json",
        filePath: target.charactersPath,
        content: target.charactersContent,
      },
      {
        fileName: "text-entries.json",
        filePath: target.textEntriesPath,
        content: target.textEntriesContent,
      },
      {
        fileName: "activities.json",
        filePath: target.activitiesPath,
        content: target.activitiesContent,
      },
      {
        fileName: "pack.json",
        filePath: target.packManifestPath,
        content: target.packManifestContent,
      },
      {
        fileName: "playable-shells.json",
        filePath: target.publicPlayableShellsPath,
        content: target.publicPlayableShellsContent,
      },
      {
        fileName: "flow-playables.json",
        filePath: target.publicFlowPlayablesPath,
        content: target.publicFlowPlayablesContent,
      },
      {
        fileName: "playables.json",
        filePath: target.runtimePlayablesPath,
        content: target.runtimePlayablesContent,
      },
      {
        fileName: "playable-integrations.json",
        filePath: target.runtimePlayableIntegrationsPath,
        content: target.runtimePlayableIntegrationsContent,
      },
      {
        fileName: "playable-shells.json",
        filePath: target.runtimePlayableShellsPath,
        content: target.runtimePlayableShellsContent,
      },
      {
        fileName: "building-arrangements.json",
        filePath: target.runtimeBuildingArrangementsPath,
        content: target.runtimeBuildingArrangementsContent,
      },
      {
        fileName: "dialogues.json",
        filePath: target.runtimeDialoguesPath,
        content: target.runtimeDialoguesContent,
      },
      {
        fileName: "event-bindings.json",
        filePath: target.runtimeEventBindingsPath,
        content: target.runtimeEventBindingsContent,
      },
      {
        fileName: "house-module-defaults.json",
        filePath: target.runtimeHouseModuleDefaultsPath,
        content: target.runtimeHouseModuleDefaultsContent,
      },
      {
        fileName: "location-access.json",
        filePath: target.runtimeLocationAccessPath,
        content: target.runtimeLocationAccessContent,
      },
      {
        fileName: "menu-instances.json",
        filePath: target.runtimeMenuInstancesPath,
        content: target.runtimeMenuInstancesContent,
      },
      {
        fileName: "menu-resources.json",
        filePath: target.runtimeMenuResourcesPath,
        content: target.runtimeMenuResourcesContent,
      },
      {
        fileName: "settlements.json",
        filePath: target.runtimeSettlementsPath,
        content: target.runtimeSettlementsContent,
      },
      {
        fileName: "events.json",
        filePath: target.runtimeEventsPath,
        content: target.runtimeEventsContent,
      },
    ]) {
      if (
        typeof file.filePath !== "string" ||
        typeof file.content !== "string"
      ) {
        continue;
      }
      if (
        target.targetRoot.includes("/public/") &&
        publicationFileNames.has(file.fileName)
      ) {
        if (file.fileName === "pack.json" && source !== "script-editor-template-pack") {
          continue;
        }
        const existingValue = await readJsonIfExists(file.filePath);
        if (!areJsonValuesEqual(existingValue, JSON.parse(file.content))) {
          updates.push(file.filePath);
          if (writeMode) {
            await writeFile(file.filePath, file.content, "utf8");
          }
        }
        continue;
      }

      if (
        target.targetRoot === resolveZhuyuanzhangPackRoots(repoRoot).runtimeRoot &&
        runtimeMirrorFileNames.has(file.fileName)
      ) {
        const existingValue = await readJsonIfExists(file.filePath);
        if (!areJsonValuesEqual(existingValue, JSON.parse(file.content))) {
          updates.push(file.filePath);
          if (writeMode) {
            await writeFile(file.filePath, file.content, "utf8");
          }
        }
        continue;
      }

      if (
        target.targetRoot === resolveZhuyuanzhangPackRoots(repoRoot).runtimeRoot &&
        file.fileName === "pack.json"
      ) {
        const existingValue = await readJsonIfExists(file.filePath);
        if (!areJsonValuesEqual(existingValue, JSON.parse(file.content))) {
          updates.push(file.filePath);
          if (writeMode) {
            await writeFile(file.filePath, file.content, "utf8");
          }
        }
        continue;
      }

      if (!supportedFileNames.has(file.fileName)) {
        continue;
      }

      const existingValue = await readJsonIfExists(file.filePath);
      if (!areJsonValuesEqual(existingValue, JSON.parse(file.content))) {
        updates.push(file.filePath);
        if (writeMode) {
          await writeFile(file.filePath, file.content, "utf8");
        }
      }
    }
  }

  if (updates.length === 0) {
    console.log(`Zhuyuanzhang startup template files are already aligned for source ${source}.`);
    return;
  }

  if (checkMode) {
    console.error(`Zhuyuanzhang startup template files are out of date for source ${source}:`);
    for (const update of updates) {
      console.error(`- ${path.relative(repoRoot, update)}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("Updated zhuyuanzhang startup template files:");
  for (const update of updates) {
    console.log(`- ${path.relative(repoRoot, update)}`);
  }
}

if (process.argv[1] != null && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
