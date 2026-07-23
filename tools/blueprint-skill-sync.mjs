import fs from "node:fs";
import path from "node:path";

const GENERATED_SKILL_RELATIVE_PATH = ".codex/skills/blueprint-governance/SKILL.md";

const BLOCK_SPECS = [
  {
    markerId: "reading-order",
    relativePath: "docs/blueprints/blueprint-workflow-spec.md",
    heading: "Required Reading Order",
  },
  {
    markerId: "routing-rules",
    relativePath: "docs/blueprints/classification-rule-layer-spec.md",
    heading: "Routing Rules",
  },
  {
    markerId: "sync-checklist",
    relativePath: "docs/blueprints/blueprint-workflow-spec.md",
    heading: "Required Sync",
  },
  {
    markerId: "verification",
    relativePath: "docs/blueprints/blueprint-workflow-spec.md",
    heading: "Verification",
  },
  {
    markerId: "red-flags",
    relativePath: "docs/blueprints/blueprint-workflow-spec.md",
    heading: "Red Flags",
  },
];

export function renderBlueprintGovernanceSkill(repoRoot = process.cwd()) {
  const blocks = BLOCK_SPECS.map((blockSpec) => ({
    ...blockSpec,
    body: readMarkerBlock(repoRoot, blockSpec.relativePath, blockSpec.markerId),
  }));

  return [
    "---",
    "name: blueprint-governance",
    "description: Use when work in RPG_TG may change Blueprint-governed routing, queue admission, queue closeout, version review, or governed documentation under docs/blueprints and docs/change-log.md.",
    "---",
    "",
    "<!-- GENERATED FILE: do not edit by hand -->",
    "",
    "# Blueprint Governance",
    "",
    "Use this skill when a task may affect Blueprint-governed work in RPG_TG.",
    "Blueprint documents remain the source of truth. This generated skill only tells Codex where to read, how to route work, what to synchronize, and which checks to run.",
    "",
    ...blocks.flatMap((block) => ["## " + block.heading, "", block.body, ""]),
  ].join("\n");
}

export function syncBlueprintGovernanceSkill(repoRoot = process.cwd()) {
  try {
    const rendered = renderBlueprintGovernanceSkill(repoRoot);
    const targetPath = path.join(repoRoot, ...GENERATED_SKILL_RELATIVE_PATH.split("/"));
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, rendered, "utf8");

    return {
      ok: true,
      messages: [`updated ${relative(repoRoot, targetPath)}`],
    };
  } catch (error) {
    return {
      ok: false,
      messages: [String(error instanceof Error ? error.message : error)],
    };
  }
}

export function lintBlueprintGovernanceSkill(repoRoot = process.cwd()) {
  try {
    const rendered = renderBlueprintGovernanceSkill(repoRoot);
    const targetPath = path.join(repoRoot, ...GENERATED_SKILL_RELATIVE_PATH.split("/"));
    if (!fs.existsSync(targetPath)) {
      return {
        ok: false,
        messages: [`${relative(repoRoot, targetPath)} is missing; run blueprint skill sync.`],
      };
    }

    const current = fs.readFileSync(targetPath, "utf8");
    if (current !== rendered) {
      return {
        ok: false,
        messages: [
          `${relative(repoRoot, targetPath)} is not synchronized with Blueprint governance markers; run blueprint skill sync.`,
        ],
      };
    }

    return {
      ok: true,
      messages: ["Blueprint governance skill is synchronized."],
    };
  } catch (error) {
    return {
      ok: false,
      messages: [String(error instanceof Error ? error.message : error)],
    };
  }
}

function readMarkerBlock(repoRoot, relativePath, markerId) {
  const filePath = path.join(repoRoot, ...relativePath.split("/"));
  if (!fs.existsSync(filePath)) {
    throw new Error(`${relative(repoRoot, filePath)} is missing.`);
  }

  const text = fs.readFileSync(filePath, "utf8");
  const marker = extractMarkerBlock(text, markerId);
  if (marker == null) {
    throw new Error(`${relative(repoRoot, filePath)} is missing blueprint-skill marker "${markerId}".`);
  }

  return marker;
}

function extractMarkerBlock(text, markerId) {
  const escapedId = markerId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `<!-- blueprint-skill:${escapedId}:start -->\\r?\\n([\\s\\S]*?)\\r?\\n<!-- blueprint-skill:${escapedId}:end -->`,
    "g"
  );
  const matches = [...text.matchAll(pattern)];
  if (matches.length === 0) {
    return null;
  }
  if (matches.length > 1) {
    throw new Error(`blueprint-skill marker "${markerId}" appears more than once in the same source document.`);
  }

  return matches[0][1].trim();
}

function relative(repoRoot, targetPath) {
  return path.relative(repoRoot, targetPath).replaceAll("\\", "/");
}

function printResultAndExit(result) {
  const output = result.messages.join("\n");
  if (result.ok) {
    console.log(output);
    process.exitCode = 0;
    return;
  }

  console.error(output);
  process.exitCode = 1;
}

if (import.meta.url === new URL(`file://${process.argv[1].replaceAll("\\", "/")}`).href) {
  const mode = process.argv[2] ?? "lint";
  if (mode === "sync") {
    printResultAndExit(syncBlueprintGovernanceSkill());
  } else if (mode === "lint") {
    printResultAndExit(lintBlueprintGovernanceSkill());
  } else {
    console.error('Unknown mode. Use "sync" or "lint".');
    process.exitCode = 1;
  }
}
