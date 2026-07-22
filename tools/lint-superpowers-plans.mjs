import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const plansDir = path.join(repoRoot, "docs", "superpowers", "plans");

const allowedStatuses = new Set([
  "waiting",
  "running",
  "completed-but-open",
  "closed",
  "not-started",
  "in-progress",
  "blocked",
  "completed",
  "unknown",
]);

const requiredHeadings = [
  /^# .+/m,
  /^\*\*Goal:\*\*/m,
  /^\*\*Architecture:\*\*/m,
  /^\*\*Tech Stack:\*\*/m,
  /^## Execution State$/m,
  /^## Progress Log$/m,
];

const requiredExecutionStateFields = [
  "Status",
  "Last Updated",
  "Current Focus",
  "Next Step",
  "Verification",
  "Notes",
];

const markdownFiles = fs
  .readdirSync(plansDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
  .map((entry) => path.join(plansDir, entry.name));

const failures = [];

for (const filePath of markdownFiles) {
  const text = fs.readFileSync(filePath, "utf8");
  const relativePath = path.relative(repoRoot, filePath).replaceAll("\\", "/");

  for (const pattern of requiredHeadings) {
    if (!pattern.test(text)) {
      failures.push(`${relativePath}: missing required section matching ${pattern}`);
    }
  }

  if (!/- \[(?: |x)\] /m.test(text)) {
    failures.push(`${relativePath}: missing checkbox steps`);
  }

  const executionStateBody = getSectionBody(text, "Execution State");

  if (executionStateBody == null) {
    failures.push(`${relativePath}: missing Execution State body`);
    continue;
  }

  for (const field of requiredExecutionStateFields) {
    const fieldPattern = new RegExp(`^- ${escapeRegExp(field)}: .+`, "m");
    if (!fieldPattern.test(executionStateBody)) {
      failures.push(`${relativePath}: missing Execution State field "${field}"`);
    }
  }

  const statusMatch = executionStateBody.match(/^- Status: `([^`]+)`/m);
  if (statusMatch == null) {
    failures.push(`${relativePath}: missing Status value`);
  } else if (!allowedStatuses.has(statusMatch[1])) {
    failures.push(
      `${relativePath}: invalid Status "${statusMatch[1]}"; expected one of ${[...allowedStatuses].join(", ")}`
    );
  }

  const lastUpdatedMatch = executionStateBody.match(/^- Last Updated: `([^`]+)`/m);
  if (lastUpdatedMatch == null) {
    failures.push(`${relativePath}: missing Last Updated value`);
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(lastUpdatedMatch[1])) {
    failures.push(`${relativePath}: Last Updated must use YYYY-MM-DD`);
  }

  const progressLogBody = getSectionBody(text, "Progress Log");
  if (progressLogBody == null) {
    failures.push(`${relativePath}: missing Progress Log body`);
    continue;
  }
  if (!/^- \d{4}-\d{2}-\d{2}/m.test(progressLogBody)) {
    failures.push(`${relativePath}: Progress Log must contain at least one dated entry`);
  }
  if (!/Summary:/m.test(progressLogBody)) {
    failures.push(`${relativePath}: Progress Log must include Summary`);
  }
  if (!/Verification:/m.test(progressLogBody)) {
    failures.push(`${relativePath}: Progress Log must include Verification`);
  }
  if (!/Next:/m.test(progressLogBody)) {
    failures.push(`${relativePath}: Progress Log must include Next`);
  }

  if (statusMatch?.[1] === "closed") {
    const hasChildCloseout = /^## Child Closeout$/m.test(text);
    const hasTaskCloseout = /^## Task Closeout$/m.test(text);

    if (!hasChildCloseout && !hasTaskCloseout) {
      failures.push(
        `${relativePath}: Status "closed" requires a ## Child Closeout or ## Task Closeout section`
      );
    }
  }
}

if (failures.length > 0) {
  console.error("Superpowers plan lint failed:\n");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Superpowers plan lint passed for ${markdownFiles.length} files.`);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getSectionBody(text, sectionTitle) {
  const headingPattern = new RegExp(`^## ${escapeRegExp(sectionTitle)}\\s*$`, "m");
  const headingMatch = headingPattern.exec(text);
  if (headingMatch == null || headingMatch.index == null) {
    return null;
  }

  const sectionStart = headingMatch.index + headingMatch[0].length;
  const rest = text.slice(sectionStart);
  const nextHeadingMatch = /^\#{1,6}\s/m.exec(rest);
  if (nextHeadingMatch == null || nextHeadingMatch.index == null) {
    return rest.trim();
  }

  return rest.slice(0, nextHeadingMatch.index).trim();
}
