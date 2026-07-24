import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repositoryRoot = path.resolve(__dirname, "..");
const generatedRoot = path.join(repositoryRoot, "generated", "blueprint");

const mapArtifact = readJson(
  path.join(generatedRoot, "event-canonical-reuse-first-batch-map.json")
);
const tokenArtifact = readJson(
  path.join(generatedRoot, "event-canonical-reuse-token-preflight.json")
);
const outputPath = path.join(
  generatedRoot,
  "event-canonical-reuse-source-rewrite-preview.json"
);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function keyBy(items, keyField) {
  return new Map(items.map((item) => [item[keyField], item]));
}

function sortStrings(values) {
  return [...values].sort();
}

const eventGroupByCanonicalId = keyBy(
  tokenArtifact.eventTokenGroups ?? [],
  "canonicalEventId"
);
const bindingGroupByCanonicalId = keyBy(
  tokenArtifact.bindingTokenGroups ?? [],
  "canonicalBindingId"
);
const arrangementGroups = tokenArtifact.arrangementTokenGroups ?? [];

const arrangementCoverageByFamily = new Map([
  ["home", { coverage: "full", canonicalArrangementId: "arrangement.template.home.standard" }],
  ["temple", { coverage: "partial", canonicalArrangementId: "arrangement.template.house.temple.standard" }],
  ["keep", { coverage: "partial", canonicalArrangementId: "arrangement.template.house.keep.standard" }],
  ["market", { coverage: "partial", canonicalArrangementId: "arrangement.template.house.market.standard" }],
  ["grain_shop", { coverage: "partial", canonicalArrangementId: "arrangement.template.house.grain_shop.standard" }],
  ["medicine_house", { coverage: "partial", canonicalArrangementId: "arrangement.template.house.medicine_house.standard" }],
  ["tea_house", { coverage: "partial", canonicalArrangementId: "arrangement.template.house.tea_house.standard" }],
  ["leader_residence", { coverage: "partial", canonicalArrangementId: "arrangement.template.house.leader_residence.civil-cluster" }],
  ["inn", { coverage: "none", canonicalArrangementId: null }],
]);

const eventRewrites = (mapArtifact.eventMappings ?? []).map((entry) => {
  const tokenGroup = eventGroupByCanonicalId.get(entry.canonicalId);
  const actionKind =
    tokenGroup?.derivedCanonicalFlowId != null
      ? "launchFlow"
      : tokenGroup?.closeBuildingCount === entry.sourceIds.length
        ? "closeBuilding"
        : "mixed-or-external";
  return {
    family: entry.family,
    action: entry.action,
    canonicalEventId: entry.canonicalId,
    sourceEventIds: sortStrings(entry.sourceIds ?? []),
    actionKind,
    canonicalOwnerId: tokenGroup?.derivedCanonicalOwnerId ?? null,
    canonicalFlowId: tokenGroup?.derivedCanonicalFlowId ?? null,
    requiresOwnerTokenRewrite:
      tokenGroup?.ownerIds != null && tokenGroup.ownerIds.length > 0,
  };
});

const bindingRewrites = (mapArtifact.bindingMappings ?? []).map((entry) => {
  const tokenGroup = bindingGroupByCanonicalId.get(entry.canonicalId);
  const arrangementCoverage =
    arrangementCoverageByFamily.get(entry.family) ?? {
      coverage: "none",
      canonicalArrangementId: null,
    };
  return {
    family: entry.family,
    itemId: entry.itemId,
    canonicalBindingId: entry.canonicalId,
    sourceBindingIds: sortStrings(entry.sourceIds ?? []),
    canonicalEventId:
      mapArtifact.eventMappings?.find(
        (eventEntry) =>
          eventEntry.family === entry.family &&
          eventEntry.action === entry.itemId
      )?.canonicalId ?? null,
    canonicalOwnerId: tokenGroup?.derivedCanonicalOwnerId ?? null,
    arrangementPayloadCoverage: arrangementCoverage.coverage,
    canonicalArrangementId: arrangementCoverage.canonicalArrangementId,
    canonicalContainerId:
      arrangementCoverage.coverage === "full"
        ? tokenGroup?.derivedCanonicalContainerId ?? null
        : null,
    requiresCurrentHouseIdCanonicalization: true,
    requiresClickPayloadCanonicalization:
      arrangementCoverage.coverage !== "full",
  };
});

const arrangementRewrites = arrangementGroups.map((entry) => ({
  groupKey: entry.groupKey,
  canonicalArrangementId: entry.canonicalArrangementId,
  sourceArrangementIds: sortStrings(entry.sourceArrangementIds ?? []),
  canonicalBuildingId: entry.derivedCanonicalBuildingId,
  sampleContainerIds: entry.sampleContainerIds ?? [],
}));

const fullyAlignedBindingGroups = bindingRewrites.filter(
  (entry) => entry.arrangementPayloadCoverage === "full"
);
const partialBindingGroups = bindingRewrites.filter(
  (entry) => entry.arrangementPayloadCoverage === "partial"
);
const unalignedBindingGroups = bindingRewrites.filter(
  (entry) => entry.arrangementPayloadCoverage === "none"
);

const artifact = {
  generatedAt: new Date().toISOString(),
  versionId: mapArtifact.versionId,
  queueId: mapArtifact.queueId,
  activeTask: mapArtifact.activeTask,
  summary: {
    eventRewriteGroups: eventRewrites.length,
    launchFlowEventGroups: eventRewrites.filter((entry) => entry.actionKind === "launchFlow").length,
    closeBuildingEventGroups: eventRewrites.filter((entry) => entry.actionKind === "closeBuilding").length,
    bindingRewriteGroups: bindingRewrites.length,
    fullyAlignedBindingGroups: fullyAlignedBindingGroups.length,
    partialBindingGroups: partialBindingGroups.length,
    unalignedBindingGroups: unalignedBindingGroups.length,
    arrangementRewriteGroups: arrangementRewrites.length,
  },
  eventRewrites,
  bindingRewrites,
  arrangementRewrites,
  keyFindings: {
    fullyAlignedFamilies: sortStrings(
      Array.from(new Set(fullyAlignedBindingGroups.map((entry) => entry.family)))
    ),
    partialFamilies: sortStrings(
      Array.from(new Set(partialBindingGroups.map((entry) => entry.family)))
    ),
    unalignedFamilies: sortStrings(
      Array.from(new Set(unalignedBindingGroups.map((entry) => entry.family)))
    ),
  },
};

fs.mkdirSync(generatedRoot, { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
console.log(`Wrote ${path.relative(repositoryRoot, outputPath)}`);
