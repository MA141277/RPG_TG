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

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function unique(values) {
  return Array.from(new Set(values)).sort();
}

const tokenPreflight = readJson(
  path.join(generatedRoot, "event-canonical-reuse-token-preflight.json")
);
const flowPlayables = readJson(path.join(packRoot, "flow-playables.json"));

const flowById = new Map(flowPlayables.map((flow) => [flow.id, flow]));

const flowGroups = (tokenPreflight.eventTokenGroups ?? [])
  .filter((group) => typeof group.derivedCanonicalFlowId === "string")
  .map((group) => {
    const sourceFlows = group.flowIds
      .map((flowId) => flowById.get(flowId))
      .filter(Boolean);
    return {
      family: group.family,
      action: group.action,
      canonicalEventId: group.canonicalEventId,
      canonicalFlowId: group.derivedCanonicalFlowId,
      sourceFlowIds: group.flowIds,
      sourceCount: sourceFlows.length,
      uniqueTitles: unique(
        sourceFlows.map((flow) => flow.title).filter((value) => typeof value === "string")
      ),
      uniqueInitialNodeShapes: unique(
        sourceFlows.map((flow) =>
          JSON.stringify({
            initialNodeIdPattern:
              typeof flow.initialNodeId === "string"
                ? flow.initialNodeId.replace(/home\.[^.]+|house\.[^.]+\.[^.]+/g, "<owner>")
                : null,
            outcomeCount: Array.isArray(flow.outcomeRoutes) ? flow.outcomeRoutes.length : 0,
            nodeCount: Array.isArray(flow.nodes) ? flow.nodes.length : 0,
          })
        )
      ).map((value) => JSON.parse(value)),
      uniqueCompleteDetailShapes: unique(
        sourceFlows.flatMap((flow) =>
          (flow.nodes ?? [])
            .filter((node) => node.type === "complete")
            .map((node) =>
              JSON.stringify({
                outcome: node.outcome ?? null,
                detailKeys:
                  node.detail != null && typeof node.detail === "object"
                    ? Object.keys(node.detail).sort()
                    : [],
                functionId:
                  node.detail != null &&
                  typeof node.detail === "object" &&
                  typeof node.detail.functionId === "string"
                    ? node.detail.functionId
                    : null,
              })
            )
        )
      ).map((value) => JSON.parse(value)),
    };
  });

const homeFlows = flowGroups.filter((group) => group.family === "home");

const artifact = {
  generatedAt: new Date().toISOString(),
  versionId: tokenPreflight.versionId,
  queueId: tokenPreflight.queueId,
  activeTask: tokenPreflight.activeTask,
  summary: {
    launchFlowGroups: flowGroups.length,
    homeLaunchFlowGroups: homeFlows.length,
    totalFlowDefinitions: flowPlayables.length,
  },
  flowGroups,
  homeFlows,
};

const outputPath = path.join(
  generatedRoot,
  "event-canonical-reuse-flow-preflight.json"
);
fs.mkdirSync(generatedRoot, { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
console.log(`Wrote ${path.relative(repositoryRoot, outputPath)}`);
