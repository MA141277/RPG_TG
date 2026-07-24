import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repositoryRoot = path.resolve(__dirname, "..");
const outputDir = path.join(repositoryRoot, "generated", "blueprint");
const outputPath = path.join(
  outputDir,
  "event-canonical-reuse-coupled-rewrite-impact.json"
);

const IMPACT_AREAS = [
  {
    id: "pack-data-events",
    category: "data-source",
    paths: [
      "src/content/scenario-packs/zhuyuanzhang/events.json",
    ],
    concerns: [
      "canonical event ids",
      "launchFlow flowId rewrite",
      "launchPlayable ownerContext.ownerId rewrite",
      "closeBuilding family coverage",
    ],
  },
  {
    id: "pack-data-bindings",
    category: "data-source",
    paths: [
      "src/content/scenario-packs/zhuyuanzhang/event-bindings.json",
    ],
    concerns: [
      "canonical binding ids",
      "binding.eventId rewrite",
      "binding.owner.id rewrite",
      "binding.trigger.extra arrangement/container/item rewrite",
    ],
  },
  {
    id: "pack-data-arrangements",
    category: "data-source",
    paths: [
      "src/content/scenario-packs/zhuyuanzhang/building-arrangements.json",
    ],
    concerns: [
      "action-menu eventId rewrite",
      "template arrangement ids",
      "host cityId+buildingId preservation",
    ],
  },
  {
    id: "editor-export",
    category: "consumer",
    paths: [
      "src/application/script-editor/runtime-pack-export.ts",
    ],
    concerns: [
      "raw event id export",
      "ownerContext.ownerId export",
      "flowId/playableId validation",
      "event binding owner id export",
    ],
    patterns: [
      "extractRuntimeEvents",
      "extractRuntimeEventBindings",
      "ownerContext.ownerId",
      "binding.owner.id",
      "flowId",
    ],
  },
  {
    id: "editor-import",
    category: "consumer",
    paths: [
      "src/application/script-editor/runtime-pack-import.ts",
    ],
    concerns: [
      "mapImportedEvents",
      "mapImportedEventBindings",
      "readBuildingArrangementsFamily",
      "raw token rehydration",
    ],
    patterns: [
      "mapImportedEvents",
      "mapImportedEventBindings",
      "readBuildingArrangementsFamily",
    ],
  },
  {
    id: "active-content-index",
    category: "consumer",
    paths: [
      "src/application/content/active-game-content.ts",
    ],
    concerns: [
      "eventDefinitionsById canonical truth",
      "eventBindingsById canonical truth",
      "buildingArrangementById canonical truth",
      "flowPlayablesById linkage",
    ],
    patterns: [
      "eventDefinitionsById",
      "eventBindingsById",
      "buildingArrangementById",
      "flowPlayablesById",
    ],
  },
  {
    id: "building-runtime",
    category: "consumer",
    paths: [
      "src/application/building/building-container-event-runtime.ts",
      "src/application/building/building-module-entry.ts",
      "src/core/runtime/event-binding-runtime.ts",
      "src/core/runtime/navigation-runtime.ts",
    ],
    concerns: [
      "currentHouseId exact owner matching",
      "clicked eventId narrowing",
      "cityId + buildingId host resolution",
      "arrangement lookup continuity",
    ],
    patterns: [
      "currentHouseId",
      "binding.owner.id",
      "triggerContext.owner.id",
      "arrangement.buildingId",
      "eventId",
    ],
  },
  {
    id: "story-playable-owner",
    category: "consumer",
    paths: [
      "src/application/story/story-runtime.ts",
      "src/application/story/story-callbacks.ts",
      "src/core/runtime/playable-runtime.ts",
      "src/core/runtime/interactive-runtime.ts",
    ],
    concerns: [
      "ownerContext.ownerId propagation",
      "dialogue/event/house owner reuse",
      "playable handoff owner continuity",
    ],
    patterns: [
      "ownerId",
      "currentHouseId",
      "ownerContext",
      "houseId",
    ],
  },
  {
    id: "test-coverage",
    category: "guard",
    paths: [
      "tests/robustness.test.cjs",
    ],
    concerns: [
      "one-binding-per-eventId masking",
      "ownerContext.ownerId === arrangement.buildingId assertions",
      "building action routing invariants",
    ],
    patterns: [
      "bindingsByEventId",
      "binding.owner.id",
      "ownerContext.ownerId",
      "arrangement.buildingId",
      "flowId",
    ],
  },
];

function escapePattern(pattern) {
  return pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countMatches(source, pattern) {
  const regex = new RegExp(escapePattern(pattern), "g");
  return source.match(regex)?.length ?? 0;
}

const areas = IMPACT_AREAS.map((area) => {
  const fileSummaries = area.paths.map((relativePath) => {
    const absolutePath = path.join(repositoryRoot, relativePath);
    const exists = fs.existsSync(absolutePath);
    const source = exists ? fs.readFileSync(absolutePath, "utf8") : "";
    const patternHits = Object.fromEntries(
      (area.patterns ?? []).map((pattern) => [pattern, countMatches(source, pattern)])
    );
    return {
      path: relativePath,
      exists,
      bytes: exists ? Buffer.byteLength(source, "utf8") : 0,
      patternHits,
    };
  });
  return {
    id: area.id,
    category: area.category,
    concerns: area.concerns,
    fileCount: fileSummaries.length,
    files: fileSummaries,
  };
});

const artifact = {
  generatedAt: new Date().toISOString(),
  versionId: "target.event-follow-up-routing-settlement-and-canonical-reuse-convergence",
  queueId: "queue.event-and-building-instance-canonical-reuse",
  activeTask: "task.event-and-building-instance-canonical-reuse.reference-rewrite-and-guard-baseline",
  summary: {
    impactAreas: areas.length,
    dataSourceAreas: areas.filter((area) => area.category === "data-source").length,
    consumerAreas: areas.filter((area) => area.category === "consumer").length,
    guardAreas: areas.filter((area) => area.category === "guard").length,
    impactedFiles: areas.reduce((count, area) => count + area.fileCount, 0),
  },
  areas,
};

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
console.log(`Wrote ${path.relative(repositoryRoot, outputPath)}`);
