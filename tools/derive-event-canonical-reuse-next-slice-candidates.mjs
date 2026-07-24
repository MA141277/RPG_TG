import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repositoryRoot = path.resolve(__dirname, "..");
const generatedRoot = path.join(repositoryRoot, "generated", "blueprint");

const firstBatchMap = readJson(
  path.join(generatedRoot, "event-canonical-reuse-first-batch-map.json")
);
const sourcePreview = readJson(
  path.join(generatedRoot, "event-canonical-reuse-source-rewrite-preview.json")
);
const homeAppliedSummary = readJson(
  path.join(generatedRoot, "event-canonical-reuse-home-applied-rewrite-summary.json")
);
const arrangements = readJson(
  path.join(
    repositoryRoot,
    "src",
    "content",
    "scenario-packs",
    "zhuyuanzhang",
    "building-arrangements.json"
  )
);
const events = readJson(
  path.join(
    repositoryRoot,
    "src",
    "content",
    "scenario-packs",
    "zhuyuanzhang",
    "events.json"
  )
);
const flows = readJson(
  path.join(
    repositoryRoot,
    "src",
    "content",
    "scenario-packs",
    "zhuyuanzhang",
    "flow-playables.json"
  )
);

const familyOrder = [
  "keep",
  "grain_shop",
  "medicine_house",
  "market",
  "tea_house",
  "temple",
  "leader_residence",
  "inn",
];

const arrangementMappingByFamily = new Map(
  (sourcePreview.arrangementRewrites ?? []).map((entry) => [
    readArrangementFamily(entry.canonicalBuildingId),
    entry,
  ])
);

const completedFamilies = readCompletedFamilies();
const candidateRows = familyOrder
  .filter((family) => !completedFamilies.includes(family))
  .map((family, index) => buildCandidateRow(family, index));
candidateRows.sort(compareCandidates);
if (candidateRows[0] != null) {
  candidateRows[0].recommended = true;
}

const artifact = {
  generatedAt: new Date().toISOString(),
  versionId: firstBatchMap.versionId,
  queueId: firstBatchMap.queueId,
  activeTask: sourcePreview.activeTask,
  status: "post-home-next-slice-selection",
  appliedSlices: {
    completed: completedFamilies,
    summaryArtifacts: completedFamilies
      .map((family) => ({
        family,
        path: `generated/blueprint/event-canonical-reuse-${family}-applied-rewrite-summary.json`,
      }))
      .filter((entry) =>
        fs.existsSync(path.join(repositoryRoot, entry.path))
      ),
  },
  historicalArtifacts: [
    {
      path: "generated/blueprint/event-canonical-reuse-source-rewrite-preview.json",
      status: "historical-pre-home-applied",
      reason:
        "It still describes the pre-home readiness partition and remains valid as pre-home evidence only.",
    },
    {
      path: "generated/blueprint/event-canonical-reuse-home-implementation-slice.json",
      status: "historical-applied",
      reason:
        "Its selected implementation slice is complete and should no longer be treated as the pending next slice.",
    },
    {
      path: "generated/blueprint/event-canonical-reuse-flow-preflight.json",
      status: "historical-pre-home-applied",
      reason:
        "It remains the audited launchFlow evidence for the completed home slice, not the live next-family selector.",
    },
  ],
  candidates: candidateRows,
  selectedNextSlice:
    candidateRows[0] == null
      ? {
          family: null,
          type: "none",
          rationale: ["No remaining non-home family candidates are left in the current selector."],
          deterministicTieBreak:
            "candidate priority sorts by arrangement deviation count, launchPlayable anomaly count, flow shape variants, launchFlow group count, and then canonical family order.",
        }
      : {
          family: candidateRows[0].family,
          type: "non-home-source-rewrite",
          rationale: candidateRows[0].selectionRationale,
          deterministicTieBreak:
            "candidate priority sorts by arrangement deviation count, launchPlayable anomaly count, flow shape variants, launchFlow group count, and then canonical family order.",
        },
};

const outputPath = path.join(
  generatedRoot,
  "event-canonical-reuse-next-slice-candidates.json"
);
fs.mkdirSync(generatedRoot, { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
console.log(`Wrote ${path.relative(repositoryRoot, outputPath)}`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readCompletedFamilies() {
  const canonicalEventIds = new Set(events.map((event) => event.id));
  const survivingSourceEventIds = new Set(events.map((event) => event.id));
  const completed = [];

  for (const family of new Set((sourcePreview.eventRewrites ?? []).map((entry) => entry.family))) {
    const familyEventGroups = (sourcePreview.eventRewrites ?? []).filter(
      (entry) => entry.family === family
    );
    const launchFlowGroups = familyEventGroups.filter(
      (entry) => entry.canonicalFlowId != null
    );
    const familyComplete =
      familyEventGroups.length > 0 &&
      familyEventGroups.every(
        (entry) =>
          canonicalEventIds.has(entry.canonicalEventId) &&
          entry.sourceEventIds.every((sourceEventId) => !survivingSourceEventIds.has(sourceEventId))
      ) &&
      launchFlowGroups.every((entry) =>
        flows.some((flow) => flow.id === entry.canonicalFlowId) &&
        !flows.some((flow) => entry.sourceEventIds.some((sourceEventId) => flow.id === sourceEventId.replace("event.", "flow.")))
      );

    if (familyComplete) {
      completed.push(family);
    }
  }

  return completed;
}

function buildCandidateRow(family, familyOrderIndex) {
  const familyEvents = events.filter((event) => event.id.includes(`.${family}.`));
  const familyArrangements = arrangements.filter((arrangement) =>
    arrangement.buildingId.endsWith(`.${family}`)
  );
  const launchFlowEvents = familyEvents.filter((event) =>
    (event.actions ?? []).some((action) => action.type === "launchFlow")
  );
  const launchPlayableEvents = familyEvents.filter((event) =>
    (event.actions ?? []).some((action) => action.type === "launchPlayable")
  );
  const closeBuildingEvents = familyEvents.filter((event) =>
    (event.actions ?? []).some((action) => action.type === "closeBuilding")
  );
  const actionMenuSignatureGroups = groupBy(
    familyArrangements,
    (arrangement) => JSON.stringify(readActionMenuShape(arrangement))
  );
  const dominantSignatureSize = Math.max(
    0,
    ...Array.from(actionMenuSignatureGroups.values()).map((group) => group.length)
  );
  const arrangementDeviationCount =
    familyArrangements.length - dominantSignatureSize;
  const flowShapeVariants = buildFlowShapeVariants(launchFlowEvents);
  const arrangementMapping = arrangementMappingByFamily.get(family);
  const canonicalEventGroups = (sourcePreview.eventRewrites ?? []).filter(
    (entry) => entry.family === family
  );
  const canonicalBindingGroups = (sourcePreview.bindingRewrites ?? []).filter(
    (entry) => entry.family === family
  );
  const actionMenuItems = Array.from(
    new Set(
      familyArrangements.flatMap((arrangement) =>
        readActionMenuShape(arrangement).map((item) => item.itemId)
      )
    )
  ).sort();

  const selectionRationale = [];
  selectionRationale.push(
    `${family} keeps ${canonicalEventGroups.length} canonical event groups and ${canonicalBindingGroups.length} canonical binding groups inside one bounded family rewrite.`
  );
  if (arrangementDeviationCount === 0) {
    selectionRationale.push(
      "All live arrangement action-menu shapes match across the 21 city-owned records, so action item ids do not introduce an extra family-local exception."
    );
  } else {
    selectionRationale.push(
      `The family still has ${arrangementDeviationCount} action-menu deviation record(s), so rewrite must preserve those exceptions explicitly.`
    );
  }
  if (launchPlayableEvents.length === 0) {
    selectionRationale.push(
      "The family has no launchPlayable anomaly in its action-menu-owned event set."
    );
  } else {
    selectionRationale.push(
      `The family still carries ${launchPlayableEvents.length} launchPlayable anomaly event(s).`
    );
  }
  selectionRationale.push(
    `${flowShapeVariants.size} launchFlow structural variant(s) remain after city/id token normalization.`
  );

  return {
    family,
    familyOrderIndex,
    recommended: false,
    metrics: {
      eventCount: familyEvents.length,
      launchFlowEventCount: launchFlowEvents.length,
      launchPlayableEventCount: launchPlayableEvents.length,
      closeBuildingEventCount: closeBuildingEvents.length,
      canonicalEventGroupCount: canonicalEventGroups.length,
      canonicalBindingGroupCount: canonicalBindingGroups.length,
      arrangementCount: familyArrangements.length,
      arrangementDeviationCount,
      actionMenuSignatureCount: actionMenuSignatureGroups.size,
      arrangementStrongFoldSourceCount:
        arrangementMapping?.sourceArrangementIds?.length ?? 0,
      flowShapeVariantCount: flowShapeVariants.size,
      actionMenuItemCount: actionMenuItems.length,
    },
    actionMenuItems,
    arrangementStrongFold: arrangementMapping
      ? {
          canonicalArrangementId: arrangementMapping.canonicalArrangementId,
          canonicalBuildingId: arrangementMapping.canonicalBuildingId,
          sourceArrangementIds: arrangementMapping.sourceArrangementIds,
        }
      : null,
    selectionRationale,
  };
}

function groupBy(items, makeKey) {
  const groups = new Map();
  for (const item of items) {
    const key = makeKey(item);
    const group = groups.get(key);
    if (group != null) {
      group.push(item);
      continue;
    }
    groups.set(key, [item]);
  }
  return groups;
}

function readActionMenuShape(arrangement) {
  return (arrangement.containers ?? [])
    .filter((container) => container.type === "action-menu")
    .flatMap((container) =>
      (container.items ?? []).map((item) => ({
        itemId: item.id,
        label: item.label,
      }))
    );
}

function buildFlowShapeVariants(launchFlowEvents) {
  const flowsById = new Map(flows.map((flow) => [flow.id, flow]));
  return groupBy(launchFlowEvents, (event) => {
    const action = (event.actions ?? []).find(
      (candidate) => candidate.type === "launchFlow"
    );
    const flow = action?.flowId != null ? flowsById.get(action.flowId) : null;
    return JSON.stringify({
      event: normalizeRecord(event),
      flow: normalizeRecord(flow),
    });
  });
}

function normalizeRecord(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeRecord);
  }

  if (value != null && typeof value === "object") {
    const normalized = {};
    for (const [key, entryValue] of Object.entries(value).sort(([left], [right]) =>
      left.localeCompare(right)
    )) {
      if (
        key === "id" ||
        key === "flowId" ||
        key === "eventId" ||
        key === "ownerId" ||
        key === "buildingId" ||
        key === "arrangementId" ||
        key === "containerId" ||
        key === "cityId" ||
        key === "houseId"
      ) {
        continue;
      }
      normalized[key] = normalizeRecord(entryValue);
    }
    return normalized;
  }

  if (typeof value === "string") {
    return value
      .replace(/flow\.building\.house\.[^.]+\./g, "flow.building.house.CITY.")
      .replace(/event\.building\.house\.[^.]+\./g, "event.building.house.CITY.")
      .replace(/house\.[^.]+\./g, "house.CITY.")
      .replace(/arrangement\.city\.[^.]+\./g, "arrangement.city.CITY.")
      .replace(/city\.[^.]+/g, "city.CITY");
  }

  return value;
}

function compareCandidates(left, right) {
  return (
    left.metrics.arrangementDeviationCount -
      right.metrics.arrangementDeviationCount ||
    left.metrics.launchPlayableEventCount -
      right.metrics.launchPlayableEventCount ||
    right.metrics.arrangementStrongFoldSourceCount -
      left.metrics.arrangementStrongFoldSourceCount ||
    left.metrics.flowShapeVariantCount -
      right.metrics.flowShapeVariantCount ||
    left.metrics.launchFlowEventCount -
      right.metrics.launchFlowEventCount ||
    left.familyOrderIndex - right.familyOrderIndex
  );
}

function readArrangementFamily(buildingId) {
  if (buildingId == null) {
    return null;
  }
  if (buildingId === "home.template") {
    return "home";
  }
  const match = /^house\.template\.([a-z0-9_]+)$/.exec(buildingId);
  return match?.[1] ?? null;
}
