const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = process.cwd();
const v1DocsRoot = path.join(repoRoot, "docs", "blueprints", "v1");

function readDoc(name) {
  return fs.readFileSync(path.join(v1DocsRoot, name), "utf8");
}

test("Blueprint v1 document set exists", () => {
  const expectedFiles = [
    "blueprint-v1-hard-rules.md",
    "blueprint-v1-coverage-audit.md",
    "blueprint-v1-migration-map.md",
    "blueprint-v1-live-truth-templates.md",
  ];

  for (const fileName of expectedFiles) {
    assert.equal(
      fs.existsSync(path.join(v1DocsRoot, fileName)),
      true,
      `Expected ${fileName} to exist under docs/blueprints/v1`
    );
  }
});

test("Blueprint v1 template files exist for the reduced live truth model", () => {
  const templatesRoot = path.join(repoRoot, "docs", "blueprints", "templates");
  const expectedFiles = [
    "target-template.md",
    "execution-queue-template.md",
    "candidate-queue-template.md",
    "transition-queue-template.md",
  ];

  for (const fileName of expectedFiles) {
    assert.equal(
      fs.existsSync(path.join(templatesRoot, fileName)),
      true,
      `Expected ${fileName} to exist under docs/blueprints/templates`
    );
  }
});

test("Blueprint v1 hard rules define the minimal execution model", () => {
  const text = readDoc("blueprint-v1-hard-rules.md");

  assert.match(text, /project-progress -> blueprint -> target -> execution queue/i);
  assert.match(text, /only one.*execution queue.*active/i);
  assert.match(text, /candidate -> prepared -> active/i);
  assert.match(text, /entry_conditions/i);
  assert.match(text, /drop_if/i);
  assert.match(text, /on_failure/i);
  assert.match(text, /transition queue.*only when no candidate can directly execute/i);
  assert.match(text, /decision_required.*only when/i);
  assert.match(text, /decision_required[\s\S]*return to the target/i);
  assert.match(text, /executing verify_with does not by itself assign failure ownership/i);
  assert.match(text, /repository\/global verification failure/i);
  assert.match(text, /must not remain attached to the current queue closeout/i);
  assert.match(text, /must not be reattached to the original queue/i);
  assert.match(text, /must not ask users about.*admission.*closeout.*sync/i);
});

test("Blueprint v1 coverage audit separates keep, remove, and add decisions", () => {
  const text = readDoc("blueprint-v1-coverage-audit.md");

  assert.match(text, /^## Keep$/m);
  assert.match(text, /^## Remove Or Downgrade$/m);
  assert.match(text, /^## Add Or Upgrade$/m);
});

test("Blueprint v1 migration map covers current live owners", () => {
  const text = readDoc("blueprint-v1-migration-map.md");

  assert.match(text, /project-progress\.md/i);
  assert.match(text, /blueprint\.md/i);
  assert.match(text, /target plan/i);
  assert.match(text, /active queue/i);
  assert.match(text, /execution queue/i);
  assert.match(text, /candidate queue/i);
  assert.match(text, /transition queue/i);
});

test("Blueprint v1 live truth templates define the required target fields and queue variants", () => {
  const text = readDoc("blueprint-v1-live-truth-templates.md");

  for (const fieldName of [
    "version_goal",
    "acceptance_criteria",
    "in_scope",
    "out_of_scope",
    "execution_queue",
    "candidate_queues",
    "transition_queue",
    "absorb_resolution",
    "constraints",
    "artifact_rules",
    "done_when",
    "closeout_condition",
  ]) {
    assert.match(
      text,
      new RegExp(`\\b${fieldName}\\b`),
      `Expected target template to include ${fieldName}`
    );
  }

  assert.match(text, /^## Project Progress Template$/m);
  assert.match(text, /^## Blueprint Template$/m);
  assert.match(text, /^## Target Template$/m);
  assert.match(text, /^## Execution Queue Template$/m);
  assert.match(text, /^## Candidate Queue Template$/m);
  assert.match(text, /^## Transition Queue Template$/m);
});

test("current project-progress is reduced to a repository entry during v1 migration", () => {
  const text = fs.readFileSync(
    path.join(repoRoot, "docs", "blueprints", "project-progress.md"),
    "utf8"
  );

  assert.match(text, /next_file: `docs\/blueprints\/blueprint\.md`/i);
  assert.match(text, /entry_action: `stop`/i);
  assert.doesNotMatch(text, /^### Current Target Spec$/m);
  assert.doesNotMatch(text, /^### Current Target Plan$/m);
  assert.doesNotMatch(text, /execution_queue:/i);
  assert.doesNotMatch(text, /candidate_queues:/i);
  assert.doesNotMatch(text, /transition_queue:/i);
  assert.match(text, /closed on current evidence/i);
  assert.match(text, /repository entry only/i);
});

test("current blueprint is reduced to index ownership and references v1 hard rules", () => {
  const text = fs.readFileSync(
    path.join(repoRoot, "docs", "blueprints", "blueprint.md"),
    "utf8"
  );

  assert.doesNotMatch(text, /^### Routing Layer$/m);
  assert.doesNotMatch(text, /^### Historical Snapshot/m);
  assert.match(text, /docs\/blueprints\/v1\/blueprint-v1-hard-rules\.md/i);
});

test("current blueprint points to a v1 target owner during migration", () => {
  const text = fs.readFileSync(
    path.join(repoRoot, "docs", "blueprints", "blueprint.md"),
    "utf8"
  );

  assert.match(
    text,
    /active_target_file: `docs\/blueprints\/targets\/2026-07-06-project-complete-modularization-target-v1\.md`/i
  );
  assert.doesNotMatch(text, /execution_queue:/i);
  assert.doesNotMatch(text, /candidate_queues:/i);
  assert.doesNotMatch(text, /transition_queue:/i);
  assert.doesNotMatch(text, /active_target_plan:/i);
});

test("workflow spec is reduced to a v1 routing entry instead of the legacy target-plan model", () => {
  const text = fs.readFileSync(
    path.join(repoRoot, "docs", "blueprints", "blueprint-workflow-spec.md"),
    "utf8"
  );

  assert.match(text, /project-progress -> blueprint -> target -> execution queue/i);
  assert.match(text, /docs\/blueprints\/v1\/blueprint-v1-hard-rules\.md/i);
  assert.doesNotMatch(text, /project-progress -> blueprint -> target plan -> active queue/i);
  assert.doesNotMatch(text, /target plan is the only live governor at target level/i);
});

test("classification routing spec no longer uses target-plan admission as the primary execution controller", () => {
  const text = fs.readFileSync(
    path.join(repoRoot, "docs", "blueprints", "classification-rule-layer-spec.md"),
    "utf8"
  );

  assert.match(text, /project-progress -> blueprint -> target -> execution queue/i);
  assert.match(text, /candidate_queues/i);
  assert.match(text, /transition_queue/i);
  assert.doesNotMatch(text, /target-plan admission/i);
});

test("project and blueprint templates route through v1 target ownership", () => {
  const projectProgressTemplate = fs.readFileSync(
    path.join(repoRoot, "docs", "blueprints", "templates", "project-progress-template.md"),
    "utf8"
  );
  const blueprintTemplate = fs.readFileSync(
    path.join(repoRoot, "docs", "blueprints", "templates", "blueprint-template.md"),
    "utf8"
  );

  assert.match(
    projectProgressTemplate,
    /project-progress -> blueprint -> target -> execution queue/i
  );
  assert.doesNotMatch(projectProgressTemplate, /target plan -> active queue -> active task/i);
  assert.match(
    blueprintTemplate,
    /active_target_file: `docs\/blueprints\/targets\//i
  );
  assert.doesNotMatch(blueprintTemplate, /active_target_plan:/i);
  assert.match(blueprintTemplate, /This file is the Blueprint index only/i);
});

test("legacy target-plan template is reduced to a compatibility shell template", () => {
  const text = fs.readFileSync(
    path.join(repoRoot, "docs", "blueprints", "templates", "target-plan-template.md"),
    "utf8"
  );

  assert.match(text, /^### Compatibility Pointer$/m);
  assert.match(text, /Legacy shell only/i);
  assert.doesNotMatch(text, /^## Control Block$/m);
  assert.doesNotMatch(text, /admission_status/i);
  assert.doesNotMatch(text, /active_queue:/i);
});

test("legacy topic-queue template is reduced to an alias for the execution queue template", () => {
  const text = fs.readFileSync(
    path.join(repoRoot, "docs", "blueprints", "templates", "topic-queue-template.md"),
    "utf8"
  );

  assert.match(text, /compatibility alias/i);
  assert.match(text, /execution-queue-template\.md/i);
  assert.doesNotMatch(text, /^## Control Block$/m);
  assert.doesNotMatch(text, /active_task:/i);
});

test("v1 target and queue templates encode the reduced live truth fields", () => {
  const targetTemplate = fs.readFileSync(
    path.join(repoRoot, "docs", "blueprints", "templates", "target-template.md"),
    "utf8"
  );
  const executionQueueTemplate = fs.readFileSync(
    path.join(repoRoot, "docs", "blueprints", "templates", "execution-queue-template.md"),
    "utf8"
  );
  const candidateQueueTemplate = fs.readFileSync(
    path.join(repoRoot, "docs", "blueprints", "templates", "candidate-queue-template.md"),
    "utf8"
  );
  const transitionQueueTemplate = fs.readFileSync(
    path.join(repoRoot, "docs", "blueprints", "templates", "transition-queue-template.md"),
    "utf8"
  );

  for (const fieldName of [
    "version_goal",
    "acceptance_criteria",
    "execution_queue",
    "candidate_queues",
    "transition_queue",
    "absorb_resolution",
    "artifact_rules",
    "decision_required",
  ]) {
    assert.match(targetTemplate, new RegExp(`\\b${fieldName}\\b`));
  }

  assert.match(executionQueueTemplate, /\bgoal_status\b/i);
  assert.match(executionQueueTemplate, /\bfailure_owner_scope\b/i);
  assert.match(executionQueueTemplate, /closeout_status: `in-progress \| done \| escalated-to-target`/i);
  assert.match(executionQueueTemplate, /queue_status: `active \| blocked \| done \| dropped`/i);
  assert.match(executionQueueTemplate, /verify_with.*does not by itself assign failure ownership/i);
  assert.match(executionQueueTemplate, /non-owner verification failure must not remain on this queue closeout/i);
  assert.match(executionQueueTemplate, /closeout_status = escalated-to-target.*queue_status = done/i);
  assert.match(executionQueueTemplate, /\bon_failure\b/i);
  assert.doesNotMatch(executionQueueTemplate, /\bfallback_on_failure\b/i);
  assert.match(executionQueueTemplate, /task_id/i);
  assert.match(candidateQueueTemplate, /state: `candidate \| prepared \| active`/i);
  assert.match(candidateQueueTemplate, /\bentry_conditions\b/i);
  assert.match(candidateQueueTemplate, /\bdrop_if\b/i);
  assert.match(candidateQueueTemplate, /\bon_failure\b/i);
  assert.doesNotMatch(candidateQueueTemplate, /\bactivation_condition\b/i);
  assert.doesNotMatch(candidateQueueTemplate, /\bfallback_on_failure\b/i);
  assert.match(transitionQueueTemplate, /binds_candidates/i);
  assert.match(transitionQueueTemplate, /\bon_failure\b/i);
  assert.match(transitionQueueTemplate, /unique, necessary, minimal, and candidate-bound/i);
  assert.match(targetTemplate, /artifact\.non-owner-verify-failure/i);
  assert.match(targetTemplate, /must absorb it into target-owned follow-up work/i);
});

test("v1 target owner exists and carries minimal target live truth", () => {
  const text = fs.readFileSync(
    path.join(
      repoRoot,
      "docs",
      "blueprints",
      "targets",
      "2026-07-06-project-complete-modularization-target-v1.md"
    ),
    "utf8"
  );

  for (const fieldName of [
    "version_goal",
    "acceptance_criteria",
    "in_scope",
    "out_of_scope",
    "execution_queue",
    "candidate_queues",
    "transition_queue",
    "absorb_resolution",
    "constraints",
    "artifact_rules",
    "done_when",
    "closeout_condition",
  ]) {
    assert.match(text, new RegExp(`\\b${fieldName}\\b`));
  }

  assert.match(text, /queue\.state-sync-and-runtime-canonicalization/i);
  assert.match(text, /queue\.unified-contribution-intake-closeout/i);
  assert.match(text, /queue\.playable-family-gap-audit/i);
  assert.match(text, /queue\.framework-scaffold-and-template-closure/i);
  assert.match(text, /state: `candidate`/i);
  assert.match(text, /\bentry_conditions\b/i);
  assert.match(text, /\bdrop_if\b/i);
  assert.match(text, /\bon_failure\b/i);
  assert.doesNotMatch(text, /\bactivation_condition\b/i);
  assert.doesNotMatch(text, /\bfallback_on_failure\b/i);
  assert.match(text, /transition_queue:[\s\S]*queue_id: `none`/i);
  assert.match(text, /Only one execution queue may be active at a time/i);
  assert.match(text, /No transition queue may exist while a candidate can directly become active/i);
  assert.match(text, /artifact\.non-owner-verify-failure/i);
  assert.match(text, /non-owner verification failure must be absorbed into target-owned follow-up work/i);
  assert.match(text, /absorb_resolution:/i);
  assert.match(text, /resolution_kind:/i);
  assert.match(text, /resolution_target:/i);
  assert.match(text, /no transition queue is justified by artifact_rules/i);
  assert.match(text, /closed on present evidence/i);
});

test("closed queue records now point to the v1 target owner instead of target plan or target spec", () => {
  const queuesRoot = path.join(repoRoot, "docs", "blueprints", "queues");
  const queueFiles = fs
    .readdirSync(queuesRoot)
    .filter((fileName) => fileName.endsWith(".md"));

  for (const fileName of queueFiles) {
    const text = fs.readFileSync(path.join(queuesRoot, fileName), "utf8");
    assert.doesNotMatch(
      text,
      /target plan|target spec/i,
      `Expected ${fileName} to stop referencing target plan/spec`
    );
  }
});

test("legacy target spec and target plan are marked as compatibility pointers to the v1 target", () => {
  const targetSpecText = fs.readFileSync(
    path.join(
      repoRoot,
      "docs",
      "blueprints",
      "specs",
      "2026-07-06-project-complete-modularization-target.md"
    ),
    "utf8"
  );
  const targetPlanText = fs.readFileSync(
    path.join(
      repoRoot,
      "docs",
      "blueprints",
      "plans",
      "2026-07-06-project-complete-modularization-target-plan.md"
    ),
    "utf8"
  );

  assert.match(targetSpecText, /Compatibility Pointer/i);
  assert.match(targetPlanText, /Compatibility Pointer/i);
  assert.match(
    targetSpecText,
    /docs\/blueprints\/targets\/2026-07-06-project-complete-modularization-target-v1\.md/i
  );
  assert.match(
    targetPlanText,
    /docs\/blueprints\/targets\/2026-07-06-project-complete-modularization-target-v1\.md/i
  );
  assert.match(targetPlanText, /canonical execution_queue/i);
  assert.match(targetPlanText, /canonical candidate_queues/i);
  assert.match(targetPlanText, /canonical transition_queue/i);
  assert.doesNotMatch(targetPlanText, /Legacy Candidate Mirror/i);
  assert.doesNotMatch(targetPlanText, /^### Queue Promotion Ledger$/m);
});

test("current legacy target spec and plan are reduced to compatibility shells instead of thick live prose", () => {
  const targetSpecText = fs.readFileSync(
    path.join(
      repoRoot,
      "docs",
      "blueprints",
      "specs",
      "2026-07-06-project-complete-modularization-target.md"
    ),
    "utf8"
  );
  const targetPlanText = fs.readFileSync(
    path.join(
      repoRoot,
      "docs",
      "blueprints",
      "plans",
      "2026-07-06-project-complete-modularization-target-plan.md"
    ),
    "utf8"
  );

  assert.doesNotMatch(targetSpecText, /^### Goal$/m);
  assert.doesNotMatch(targetSpecText, /^### Scope$/m);
  assert.doesNotMatch(targetSpecText, /^### Non-Goals$/m);
  assert.doesNotMatch(targetSpecText, /^### Acceptance Criteria$/m);
  assert.doesNotMatch(targetPlanText, /^## Control Block$/m);
  assert.doesNotMatch(targetPlanText, /^### Admission Review Record$/m);
  assert.doesNotMatch(targetPlanText, /^### Legacy Candidate Mirror$/m);
  assert.match(targetPlanText, /legacy shell only/i);
});
