import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repositoryRoot = path.resolve(__dirname, "..");
const packRoot = path.join(
  repositoryRoot,
  "src",
  "content",
  "scenario-packs",
  "zhuyuanzhang"
);
const generatedRoot = path.join(repositoryRoot, "generated", "blueprint");
const mappingPath = path.join(
  generatedRoot,
  "event-canonical-reuse-first-batch-map.json"
);
const outputPath = path.join(
  generatedRoot,
  "event-canonical-reuse-token-preflight.json"
);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function unique(values) {
  return Array.from(new Set(values)).sort();
}

function deriveCanonicalHouseToken(family) {
  return family === "home" ? "home.template" : `house.template.${family}`;
}

function deriveCanonicalContainerToken(family) {
  return family === "home"
    ? "home.template.actions"
    : `house.template.${family}.actions`;
}

function deriveCanonicalFlowId(canonicalEventId) {
  return canonicalEventId.replace(/^event\./, "flow.");
}

const mappingArtifact = readJson(mappingPath);
const events = readJson(path.join(packRoot, "events.json"));
const bindings = readJson(path.join(packRoot, "event-bindings.json"));
const arrangements = readJson(path.join(packRoot, "building-arrangements.json"));

const eventById = new Map(events.map((event) => [event.id, event]));
const bindingById = new Map(bindings.map((binding) => [binding.id, binding]));
const arrangementById = new Map(
  arrangements.map((arrangement) => [arrangement.id, arrangement])
);

const eventTokenGroups = [];
for (const entry of mappingArtifact.eventMappings ?? []) {
  const sourceEvents = entry.sourceIds.map((id) => eventById.get(id)).filter(Boolean);
  const launchFlowActions = sourceEvents.flatMap((event) =>
    (event.actions ?? []).filter((action) => action.type === "launchFlow")
  );
  const launchPlayableActions = sourceEvents.flatMap((event) =>
    (event.actions ?? []).filter((action) => action.type === "launchPlayable")
  );
  const closeBuildingActionCount = sourceEvents.filter((event) =>
    (event.actions ?? []).some((action) => action.type === "closeBuilding")
  ).length;

  eventTokenGroups.push({
    family: entry.family,
    action: entry.action,
    canonicalEventId: entry.canonicalId,
    sourceEventIds: entry.sourceIds,
    derivedCanonicalOwnerId: deriveCanonicalHouseToken(entry.family),
    ownerIds: unique(
      launchFlowActions
        .map((action) => action.ownerContext?.ownerId)
        .filter((value) => typeof value === "string" && value.length > 0)
    ),
    ownerKinds: unique(
      launchFlowActions
        .map((action) => action.ownerContext?.ownerKind)
        .filter((value) => typeof value === "string" && value.length > 0)
    ),
    flowLaunchCount: launchFlowActions.length,
    closeBuildingCount: closeBuildingActionCount,
    launchPlayableCount: launchPlayableActions.length,
    derivedCanonicalFlowId:
      launchFlowActions.length === sourceEvents.length &&
      launchPlayableActions.length === 0 &&
      closeBuildingActionCount === 0
        ? deriveCanonicalFlowId(entry.canonicalId)
        : null,
    flowIds: unique(
      launchFlowActions
        .map((action) => action.flowId)
        .filter((value) => typeof value === "string" && value.length > 0)
    ),
    playableIds: unique(
      launchPlayableActions
        .map((action) => action.playableId)
        .filter((value) => typeof value === "string" && value.length > 0)
    ),
  });
}

const bindingTokenGroups = [];
for (const entry of mappingArtifact.bindingMappings ?? []) {
  const sourceBindings = entry.sourceIds.map((id) => bindingById.get(id)).filter(Boolean);
  bindingTokenGroups.push({
    family: entry.family,
    itemId: entry.itemId,
    canonicalBindingId: entry.canonicalId,
    sourceBindingIds: entry.sourceIds,
    derivedCanonicalOwnerId: deriveCanonicalHouseToken(entry.family),
    derivedCanonicalContainerId: deriveCanonicalContainerToken(entry.family),
    ownerIds: unique(
      sourceBindings
        .map((binding) => binding.owner?.id)
        .filter((value) => typeof value === "string" && value.length > 0)
    ),
    arrangementIds: unique(
      sourceBindings
        .map((binding) => binding.trigger?.extra?.arrangementId)
        .filter((value) => typeof value === "string" && value.length > 0)
    ),
    containerIds: unique(
      sourceBindings
        .map((binding) => binding.trigger?.extra?.containerId)
        .filter((value) => typeof value === "string" && value.length > 0)
    ),
  });
}

const arrangementTokenGroups = [];
for (const entry of mappingArtifact.arrangementMappings ?? []) {
  const sourceArrangements = entry.sourceIds
    .map((id) => arrangementById.get(id))
    .filter(Boolean);
  const sampleArrangement = sourceArrangements[0] ?? null;
  const sampleBuildingId = sampleArrangement?.buildingId ?? "";
  const family =
    entry.groupKey === "home.standard"
      ? "home"
      : String(entry.groupKey).split(".")[0];

  arrangementTokenGroups.push({
    groupKey: entry.groupKey,
    canonicalArrangementId: entry.canonicalId,
    sourceArrangementIds: entry.sourceIds,
    derivedCanonicalBuildingId: deriveCanonicalHouseToken(family),
    buildingIds: unique(
      sourceArrangements
        .map((arrangement) => arrangement.buildingId)
        .filter((value) => typeof value === "string" && value.length > 0)
    ),
    cityIds: unique(
      sourceArrangements
        .map((arrangement) => arrangement.cityId)
        .filter((value) => typeof value === "string" && value.length > 0)
    ),
    sampleContainerIds: sampleArrangement == null
      ? []
      : unique(
          (sampleArrangement.containers ?? [])
            .map((container) => container.id)
            .filter((value) => typeof value === "string" && value.length > 0)
        ),
    sampleBuildingId,
  });
}

const flowCapableEventGroups = eventTokenGroups.filter(
  (group) => group.derivedCanonicalFlowId != null
);
const closeOnlyEventGroups = eventTokenGroups.filter(
  (group) => group.closeBuildingCount === group.sourceEventIds.length
);
const mixedActionEventGroups = eventTokenGroups.filter(
  (group) =>
    group.derivedCanonicalFlowId == null &&
    group.closeBuildingCount !== group.sourceEventIds.length
);

const artifact = {
  generatedAt: new Date().toISOString(),
  versionId: mappingArtifact.versionId,
  queueId: mappingArtifact.queueId,
  activeTask: mappingArtifact.activeTask,
  packId: mappingArtifact.packId,
  summary: {
    eventGroups: eventTokenGroups.length,
    flowCapableEventGroups: flowCapableEventGroups.length,
    closeOnlyEventGroups: closeOnlyEventGroups.length,
    mixedActionEventGroups: mixedActionEventGroups.length,
    bindingGroups: bindingTokenGroups.length,
    arrangementGroups: arrangementTokenGroups.length,
  },
  eventTokenGroups,
  bindingTokenGroups,
  arrangementTokenGroups,
};

fs.mkdirSync(generatedRoot, { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
console.log(`Wrote ${path.relative(repositoryRoot, outputPath)}`);
