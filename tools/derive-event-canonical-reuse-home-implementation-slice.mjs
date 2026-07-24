import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repositoryRoot = path.resolve(__dirname, "..");
const generatedRoot = path.join(repositoryRoot, "generated", "blueprint");

function readJson(relativePath) {
  return JSON.parse(
    fs.readFileSync(path.join(repositoryRoot, relativePath), "utf8")
  );
}

const sourcePreview = readJson(
  "generated/blueprint/event-canonical-reuse-source-rewrite-preview.json"
);
const coupledImpact = readJson(
  "generated/blueprint/event-canonical-reuse-coupled-rewrite-impact.json"
);

const homeEventGroups = sourcePreview.eventRewrites.filter(
  (entry) => entry.family === "home"
);
const homeBindingGroups = sourcePreview.bindingRewrites.filter(
  (entry) => entry.family === "home"
);
const homeArrangementGroups = sourcePreview.arrangementRewrites.filter(
  (entry) => entry.groupKey === "home.standard"
);

const artifact = {
  generatedAt: new Date().toISOString(),
  versionId: sourcePreview.versionId,
  queueId: sourcePreview.queueId,
  activeTask: sourcePreview.activeTask,
  sliceId: "slice.home-canonical-reuse-first-implementation",
  rationale: [
    "home is the only family with fully aligned arrangement payload coverage for both mapped binding groups",
    "home splits cleanly into one launchFlow event family and one closeBuilding event family",
    "home therefore minimizes trigger.extra canonicalization risk while still forcing real source+consumer+guard coupling",
  ],
  scope: {
    eventGroups: homeEventGroups,
    bindingGroups: homeBindingGroups,
    arrangementGroups: homeArrangementGroups,
  },
  requiredConsumerAreas: coupledImpact.areas.filter((area) =>
    [
      "editor-export",
      "editor-import",
      "active-content-index",
      "building-runtime",
      "story-playable-owner",
      "test-coverage",
    ].includes(area.id)
  ),
  guardedNonGoals: [
    "do not include temple/keep/market/grain_shop/medicine_house/tea_house/leader_residence partial payload families in the first implementation slice",
    "do not include inn families in the first implementation slice",
    "do not widen into nextEventId or settlement work",
  ],
  successShape: {
    canonicalEvents: homeEventGroups.map((entry) => entry.canonicalEventId),
    canonicalBindings: homeBindingGroups.map((entry) => entry.canonicalBindingId),
    canonicalArrangement:
      homeArrangementGroups[0]?.canonicalArrangementId ?? null,
    canonicalBuildingId:
      homeArrangementGroups[0]?.canonicalBuildingId ?? "home.template",
    canonicalContainerId: "home.template.actions",
  },
};

const outputPath = path.join(
  generatedRoot,
  "event-canonical-reuse-home-implementation-slice.json"
);
fs.mkdirSync(generatedRoot, { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
console.log(`Wrote ${path.relative(repositoryRoot, outputPath)}`);
