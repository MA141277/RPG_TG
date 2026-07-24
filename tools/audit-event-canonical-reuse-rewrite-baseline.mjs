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
  "event-canonical-reuse-rewrite-audit.json"
);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function invertMappings(entries) {
  const bySourceId = new Map();
  for (const entry of entries) {
    for (const sourceId of entry.sourceIds ?? []) {
      bySourceId.set(sourceId, entry.canonicalId);
    }
  }
  return bySourceId;
}

function summarizeCoverage(allIds, mappedIds, preservedIds) {
  const mapped = [];
  const preserved = [];
  const unmapped = [];

  for (const id of allIds) {
    if (mappedIds.has(id)) {
      mapped.push(id);
      continue;
    }
    if (preservedIds.has(id)) {
      preserved.push(id);
      continue;
    }
    unmapped.push(id);
  }

  return {
    total: allIds.length,
    mappedCount: mapped.length,
    preservedCount: preserved.length,
    unmappedCount: unmapped.length,
    unmappedIds: unmapped,
  };
}

function stringifyPayloadKey(binding) {
  return JSON.stringify({
    ownerFamily: binding?.owner?.family ?? null,
    ownerId: binding?.owner?.id ?? null,
    triggerAction: binding?.trigger?.action ?? null,
    arrangementId: binding?.trigger?.extra?.arrangementId ?? null,
    containerId: binding?.trigger?.extra?.containerId ?? null,
    itemId: binding?.trigger?.extra?.itemId ?? null,
  });
}

const mappingArtifact = readJson(mappingPath);
const events = readJson(path.join(packRoot, "events.json"));
const bindings = readJson(path.join(packRoot, "event-bindings.json"));
const arrangements = readJson(path.join(packRoot, "building-arrangements.json"));

const eventIdMap = invertMappings(mappingArtifact.eventMappings ?? []);
const bindingIdMap = invertMappings(mappingArtifact.bindingMappings ?? []);
const arrangementIdMap = invertMappings(mappingArtifact.arrangementMappings ?? []);

const preservedEventIds = new Set(mappingArtifact.preservationExceptions?.events ?? []);
const preservedBindingIds = new Set(mappingArtifact.preservationExceptions?.bindings ?? []);
const preservedArrangementIds = new Set(
  mappingArtifact.preservationExceptions?.arrangements ?? []
);

const eventCoverage = summarizeCoverage(
  events.map((entry) => entry.id),
  new Set(eventIdMap.keys()),
  preservedEventIds
);

const containerBindings = bindings.filter(
  (binding) => binding?.trigger?.action === "building-container-item-action"
);
const bindingCoverage = summarizeCoverage(
  containerBindings.map((entry) => entry.id),
  new Set(bindingIdMap.keys()),
  preservedBindingIds
);

const arrangementCoverage = summarizeCoverage(
  arrangements.map((entry) => entry.id),
  new Set(arrangementIdMap.keys()),
  preservedArrangementIds
);

const actionItems = arrangements.flatMap((arrangement) =>
  (arrangement.containers ?? [])
    .filter((container) => container.type === "action-menu")
    .flatMap((container) =>
      (container.items ?? []).map((item) => ({
        arrangementId: arrangement.id,
        containerId: container.id,
        itemId: item.id,
        eventId: item.eventId,
      }))
    )
);

const actionMenuCoverage = {
  total: actionItems.length,
  mappedEventRefs: 0,
  preservedEventRefs: 0,
  unmappedEventRefs: [],
};

for (const item of actionItems) {
  if (eventIdMap.has(item.eventId)) {
    actionMenuCoverage.mappedEventRefs += 1;
    continue;
  }
  if (preservedEventIds.has(item.eventId)) {
    actionMenuCoverage.preservedEventRefs += 1;
    continue;
  }
  actionMenuCoverage.unmappedEventRefs.push(item);
}

const simulatedBindingGroups = new Map();
for (const binding of containerBindings) {
  const simulatedEventId = eventIdMap.get(binding.eventId) ?? binding.eventId;
  const group = simulatedBindingGroups.get(simulatedEventId) ?? [];
  group.push(binding);
  simulatedBindingGroups.set(simulatedEventId, group);
}

const safeMultiplexGroups = [];
const duplicatePayloadConflicts = [];

for (const [canonicalEventId, group] of simulatedBindingGroups.entries()) {
  if (group.length <= 1) {
    continue;
  }

  const payloadGroups = new Map();
  for (const binding of group) {
    const payloadKey = stringifyPayloadKey(binding);
    const bindingsForPayload = payloadGroups.get(payloadKey) ?? [];
    bindingsForPayload.push(binding.id);
    payloadGroups.set(payloadKey, bindingsForPayload);
  }

  const duplicatePayloads = Array.from(payloadGroups.entries())
    .filter(([, bindingIds]) => bindingIds.length > 1)
    .map(([payloadKey, bindingIds]) => ({
      payloadKey: JSON.parse(payloadKey),
      bindingIds,
    }));

  if (duplicatePayloads.length > 0) {
    duplicatePayloadConflicts.push({
      canonicalEventId,
      bindingIds: group.map((binding) => binding.id).sort(),
      duplicatePayloads,
    });
    continue;
  }

  safeMultiplexGroups.push({
    canonicalEventId,
    bindingCount: group.length,
    bindingIds: group.map((binding) => binding.id).sort(),
  });
}

const kulanTempleArrangement = arrangements.find(
  (arrangement) => arrangement.id === "arrangement.city.kulan.house.kulan.temple"
);
const kulanTempleActionItemIds = (kulanTempleArrangement?.containers ?? [])
  .filter((container) => container.type === "action-menu")
  .flatMap((container) => (container.items ?? []).map((item) => item.id));

const artifact = {
  generatedAt: new Date().toISOString(),
  versionId: mappingArtifact.versionId,
  queueId: mappingArtifact.queueId,
  activeTask: mappingArtifact.activeTask,
  packId: mappingArtifact.packId,
  inputs: {
    mappingArtifact: path.relative(repositoryRoot, mappingPath),
    packRoot: path.relative(repositoryRoot, packRoot),
  },
  coverage: {
    events: eventCoverage,
    containerItemBindings: {
      ...bindingCoverage,
      nonContainerBindingCount: bindings.length - containerBindings.length,
    },
    arrangements: arrangementCoverage,
    actionMenuEventRefs: actionMenuCoverage,
  },
  simulatedBindingCollisions: {
    canonicalEventCollisionGroupCount: safeMultiplexGroups.length + duplicatePayloadConflicts.length,
    safeMultiplexGroupCount: safeMultiplexGroups.length,
    duplicatePayloadConflictCount: duplicatePayloadConflicts.length,
    safeMultiplexGroups,
    duplicatePayloadConflicts,
  },
  recordedExceptionDrift: {
    kulanTempleWork: {
      bindingPresent: bindings.some(
        (binding) =>
          binding.id === "binding.building.house.kulan.temple.work.container-item"
      ),
      eventPresent: events.some(
        (event) => event.id === "event.building.house.kulan.temple.work"
      ),
      arrangementPresent: kulanTempleArrangement != null,
      arrangementActionItemIds: kulanTempleActionItemIds,
      itemStillPresent: kulanTempleActionItemIds.includes("work"),
    },
  },
};

fs.mkdirSync(generatedRoot, { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
console.log(`Wrote ${path.relative(repositoryRoot, outputPath)}`);
