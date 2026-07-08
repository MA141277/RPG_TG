const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const legacyQueueTemplateName = ["topic", "queue", "template.md"].join("-");

function readDoc(relativePath) {
  return fs.readFileSync(path.join(projectRoot, ...relativePath.split("/")), "utf8");
}

test("Blueprint v1 hard rules decouple execution state from git sync outcomes", () => {
  const text = readDoc("docs/blueprints/v1/blueprint-v1-hard-rules.md");

  assert.match(text, /execution state.*execution semantics/i);
  assert.match(text, /commit\s*\/\s*push\s*\/\s*merge.*non-governing/i);
  assert.match(text, /task.*write.*state.*before.*sync/i);
  assert.match(text, /sync failure.*repository sync result/i);
  assert.doesNotMatch(text, /push success.*closeout gate/i);
});

test("Blueprint v1 live truth templates keep repository sync results queue-local only", () => {
  const text = readDoc("docs/blueprints/v1/blueprint-v1-live-truth-templates.md");

  assert.match(text, /queue-local sync record/i);
  assert.match(text, /sync_status/i);
  assert.match(text, /sync_scope/i);
  assert.match(text, /sync_summary/i);
  assert.match(text, /target.*must not own.*sync_status.*sync_scope.*sync_summary/i);
  assert.match(text, /target scheduling.*must not read.*sync/i);
});

test("Execution queue template exposes the minimal repository sync record without making git a blocker", () => {
  const text = readDoc("docs/blueprints/templates/execution-queue-template.md");

  assert.match(text, /sync_status: `pending \| success \| failed`/i);
  assert.match(text, /sync_scope: `branch-push \| baseline-merge \| baseline-push \| none`/i);
  assert.match(text, /sync_summary:/i);
  assert.match(text, /blocked queue.*allow.*commit.*push.*merge/i);
  assert.match(text, /sync failure.*must not.*blocked_by/i);
});

test("Execution queue template is the only canonical queue template in the repo", () => {
  const executionTemplatePath = path.join(
    projectRoot,
    "docs",
    "blueprints",
    "templates",
    "execution-queue-template.md"
  );
  const topicTemplatePath = path.join(
    projectRoot,
    "docs",
    "blueprints",
    "templates",
    legacyQueueTemplateName
  );

  assert.equal(fs.existsSync(executionTemplatePath), true);
  assert.equal(fs.existsSync(topicTemplatePath), false);
});

test("Repo docs, tests, and lint do not keep topic-queue-template references", () => {
  const pathsToCheck = [
    "docs/change-log.md",
    "docs/superpowers/plans/2026-07-06-ai-first-blueprint-governance-refactor.md",
    "tests/blueprint-v1-docs.test.cjs",
    "tests/blueprint-governance-lint.test.cjs",
    "tools/lint-blueprints.mjs",
  ];

  for (const relativePath of pathsToCheck) {
    const text = readDoc(relativePath);
    assert.doesNotMatch(
      text,
      new RegExp(legacyQueueTemplateName.replace(".", "\\."), "i"),
      `${relativePath} still references ${legacyQueueTemplateName}`
    );
  }
});

test("Target-plan template states that git sync does not govern queue or target closeout", () => {
  const text = readDoc("docs/blueprints/templates/target-plan-template.md");

  assert.match(text, /git.*non-governing/i);
  assert.match(text, /push.*merge.*must not.*queue closeout gate/i);
  assert.match(text, /push.*merge.*must not.*target closeout gate/i);
  assert.match(text, /decision_required/i);
  assert.match(text, /baseline.*not clear|baseline.*ambiguous/i);
  assert.doesNotMatch(text, /- sync_status:/i);
  assert.doesNotMatch(text, /- sync_scope:/i);
  assert.doesNotMatch(text, /- sync_summary:/i);
});

test("Blueprint v1 merge conflict governance stays queue-local and non-governing", () => {
  const hardRules = readDoc("docs/blueprints/v1/blueprint-v1-hard-rules.md");
  const workflowSpec = readDoc("docs/blueprints/blueprint-workflow-spec.md");
  const targetPlanTemplate = readDoc("docs/blueprints/templates/target-plan-template.md");

  assert.match(hardRules, /merge conflict.*repository sync/i);
  assert.match(hardRules, /merge conflict.*must not.*rewrite.*task/i);
  assert.match(hardRules, /merge conflict.*queue-local sync record/i);

  assert.match(workflowSpec, /merge conflict.*repository sync/i);
  assert.match(workflowSpec, /target truth.*uniquely decide.*merge/i);
  assert.match(workflowSpec, /multiple mutually exclusive legal resolutions/i);

  assert.match(targetPlanTemplate, /merge conflict.*current target truth/i);
  assert.match(targetPlanTemplate, /do not ask.*merge conflict/i);
});
