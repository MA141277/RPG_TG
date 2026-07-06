# Anti-Hardcoding Collaboration Enforcement Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add repository-level anti-hardcoding collaboration rules and a runnable hardcoding gate so new work on `mod-first-dev` cannot quietly reintroduce scenario prose, layout ownership drift, or content-text branching into runtime code.

**Architecture:** The implementation lands in two layers. First, team-facing rules are written into `docs/collaboration.md` and summarized in `AGENTS.md` so branch authors and reviewers see the ownership boundary in the normal workflow. Second, a lightweight Node-based gate scans runtime-owned source paths, enforces `TEMP-HARDCODE` metadata shape, and runs through `npm run lint:hardcoding` so the rule exists at repository level instead of relying on memory.

**Tech Stack:** Markdown docs, Node.js ESM scripts under `tools/`, `node:test` CJS tests under `tests/`, npm scripts in `package.json`, repository verification via `npm run lint:plans`, `npm test`, `npm run lint:hardcoding`, and `npm run build`.

## Execution State

- Status: `waiting`
- Last Updated: `2026-07-06`
- Current Focus: `Plan authored under the fail-closed governance model; execution not started.`
- Next Step: `Open docs/superpowers/project-progress.md and confirm this child is executable before starting Task 1 Step 1.`
- Verification: `Not run`
- Notes: `This plan implements the approved design in docs/superpowers/specs/2026-07-06-anti-hardcoding-collaboration-design.md.`

## Progress Log

- 2026-07-06
  - Summary: `Plan created for repository-level anti-hardcoding enforcement.`
  - Verification: `Not run`
  - Next: `Open docs/superpowers/project-progress.md before starting Task 1 Step 1.`
- 2026-07-06
  - Summary: `Plan updated to align with the fail-closed governance workflow and prepared for branch synchronization.`
  - Verification: `Not run`
  - Next: `Keep this plan in waiting state until project-progress explicitly promotes it.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-06-anti-hardcoding-collaboration-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `The approved design still matches the current repository state: collaboration and layout workflow docs exist, but there is no repository-wide hardcoding gate script or npm entry yet.`
  - `Existing boundary coverage is narrow and limited to the audited zhuyuanzhang house pack regression test.`

## Implementation Scope

### In Scope

- add team-facing anti-hardcoding collaboration rules
- add repository-level `lint:hardcoding` gate
- add automated tests for the gate behavior
- document merge-review checklist integration

### Still Out Of Scope

- repository-wide elimination of all historical hardcoded text
- AST-based lint infrastructure
- full conversion of every current UI/layout literal into contract-owned data
- CI provider wiring outside the local repository scripts

## File Map

### Existing files to modify

- `docs/collaboration.md`
  - Add the anti-hardcoding collaboration contract and merge checklist.
- `AGENTS.md`
  - Add a short repository-wide pointer so implementation requests inherit the rule.
- `package.json`
  - Register `lint:hardcoding` and include it in the aggregate lint flow.
- `docs/change-log.md`
  - Record the new collaboration boundary and repository gate.

### New files to create

- `tools/lint-hardcoding.mjs`
  - Repository-level scanner for runtime hardcoding regressions and malformed `TEMP-HARDCODE` markers.
- `tests/hardcoding-collaboration-gate.test.cjs`
  - Regression tests for the gate script.
- `docs/superpowers/plans/2026-07-06-anti-hardcoding-collaboration-enforcement-plan.md`
  - This executable plan record.

## Verification Plan

- Targeted verification:
  - `node --test tests/hardcoding-collaboration-gate.test.cjs`
  - `npm run lint:hardcoding`
- Required commands:
  - `npm run lint:plans`
  - `npm test`
  - `npm run build`

## Task 1: Build The Hardcoding Gate With TDD

**Files:**
- Create: `tests/hardcoding-collaboration-gate.test.cjs`
- Create: `tools/lint-hardcoding.mjs`
- Modify: `package.json`
- Read: `tests/hardcoded-scenario-pack-boundary.test.cjs`

- [ ] **Step 1: Write the failing test**

Create `tests/hardcoding-collaboration-gate.test.cjs` with process-level coverage for the two core contract checks: runtime prose rejection and malformed `TEMP-HARDCODE` rejection.

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const projectRoot = path.resolve(__dirname, "..");
const scriptPath = path.join(projectRoot, "tools", "lint-hardcoding.mjs");

function runGate(targetRoot) {
  return spawnSync(process.execPath, [scriptPath, "--root", targetRoot], {
    cwd: projectRoot,
    encoding: "utf8",
  });
}

function createFixture(structure) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "hardcoding-gate-"));
  for (const [relativePath, content] of Object.entries(structure)) {
    const absolutePath = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    fs.writeFileSync(absolutePath, content, "utf8");
  }
  return root;
}

test("gate fails when runtime-owned code contains authored Chinese prose", () => {
  const fixtureRoot = createFixture({
    "src/application/sample.ts": 'export const copy = "这是新的剧情文案";\n',
  });

  const result = runGate(fixtureRoot);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /authored Chinese prose/u);
  assert.match(result.stderr, /src\/application\/sample\.ts/u);
});

test("gate fails when TEMP-HARDCODE marker lacks migration metadata", () => {
  const fixtureRoot = createFixture({
    "src/ui/sample.ts": "// TEMP-HARDCODE\nexport const label = 1;\n",
  });

  const result = runGate(fixtureRoot);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /TEMP-HARDCODE metadata/u);
  assert.match(result.stderr, /src\/ui\/sample\.ts/u);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/hardcoding-collaboration-gate.test.cjs
```

Expected:

- `FAIL`
- failure because `tools/lint-hardcoding.mjs` does not exist yet

- [ ] **Step 3: Write minimal implementation**

Create `tools/lint-hardcoding.mjs` with a narrow allowlist-based scanner and register it in `package.json`.

`tools/lint-hardcoding.mjs`

```js
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const rootFlagIndex = args.indexOf("--root");
const projectRoot =
  rootFlagIndex >= 0 && args[rootFlagIndex + 1]
    ? path.resolve(args[rootFlagIndex + 1])
    : process.cwd();

const targetDirectories = [
  path.join("src", "application"),
  path.join("src", "ui"),
];
const targetFiles = [path.join("src", "main.ts")];
const allowedChineseCopyPatterns = [
  /Failed to /u,
];
const authoredChinesePattern = /[\u4e00-\u9fff]{2,}/u;
const tempHardcodePattern = /TEMP-HARDCODE/u;
const requiredTempMetadataPatterns = [
  /target:/u,
  /remove-when:/u,
];

function collectFiles(rootPath) {
  const queue = [rootPath];
  const files = [];
  while (queue.length > 0) {
    const current = queue.pop();
    if (!fs.existsSync(current)) {
      continue;
    }
    const stat = fs.statSync(current);
    if (stat.isDirectory()) {
      for (const child of fs.readdirSync(current)) {
        queue.push(path.join(current, child));
      }
      continue;
    }
    files.push(current);
  }
  return files;
}

function normalizeRelative(absolutePath) {
  return path.relative(projectRoot, absolutePath).split(path.sep).join("/");
}

function isRuntimeOwnedFile(relativePath) {
  return (
    targetDirectories.some((dir) => relativePath.startsWith(`${dir}/`)) ||
    targetFiles.includes(relativePath)
  );
}

function isAllowedChineseLine(line) {
  return allowedChineseCopyPatterns.some((pattern) => pattern.test(line));
}

function collectFailures() {
  const failures = [];
  const files = [
    ...targetDirectories.flatMap((dir) => collectFiles(path.join(projectRoot, dir))),
    ...targetFiles.map((file) => path.join(projectRoot, file)),
  ];

  for (const absolutePath of files) {
    if (!fs.existsSync(absolutePath)) {
      continue;
    }
    const relativePath = normalizeRelative(absolutePath);
    if (!isRuntimeOwnedFile(relativePath)) {
      continue;
    }
    const lines = fs.readFileSync(absolutePath, "utf8").split(/\r?\n/u);
    lines.forEach((line, index) => {
      if (authoredChinesePattern.test(line) && !isAllowedChineseLine(line)) {
        failures.push(
          `${relativePath}:${index + 1} authored Chinese prose is not allowed in runtime-owned code`
        );
      }
      if (tempHardcodePattern.test(line)) {
        const context = lines.slice(index, index + 4).join("\n");
        const hasMetadata = requiredTempMetadataPatterns.every((pattern) =>
          pattern.test(context)
        );
        if (!hasMetadata) {
          failures.push(
            `${relativePath}:${index + 1} TEMP-HARDCODE metadata must include target: and remove-when:`
          );
        }
      }
    });
  }

  return failures;
}

const failures = collectFailures();

if (failures.length > 0) {
  console.error("Hardcoding lint failed:\n");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}
```

`package.json`

```json
{
  "scripts": {
    "lint:hardcoding": "node tools/lint-hardcoding.mjs",
    "lint": "npm run lint:ts && npm run lint:css && npm run lint:hardcoding"
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
node --test tests/hardcoding-collaboration-gate.test.cjs
```

Expected:

- `PASS`

- [ ] **Step 5: Expand the failing test coverage for the repository baseline**

Add one passing fixture and one repository-baseline test to `tests/hardcoding-collaboration-gate.test.cjs`.

```js
test("gate passes when TEMP-HARDCODE marker includes migration metadata", () => {
  const fixtureRoot = createFixture({
    "src/main.ts": [
      "// TEMP-HARDCODE target: move to scenario pack registry",
      "// remove-when: registry-backed startup is merged",
      'export const bootLabel = "TEMP_BOOT_LABEL";',
      "",
    ].join("\n"),
  });

  const result = runGate(fixtureRoot);

  assert.equal(result.status, 0);
});

test("repository baseline passes the hardcoding gate", () => {
  const result = runGate(projectRoot);

  assert.equal(result.status, 0, result.stderr || result.stdout);
});
```

- [ ] **Step 6: Run test to verify the expanded suite fails for the expected reason**

Run:

```bash
node --test tests/hardcoding-collaboration-gate.test.cjs
```

Expected:

- `FAIL`
- baseline failure caused by current repository hotspots that need explicit allowlisting or scope tuning

- [ ] **Step 7: Tune the implementation just enough to support the approved baseline**

Update `tools/lint-hardcoding.mjs` to add explicit file/path allowlists and a narrow prose exception list for already-accepted runtime-owned copy. Keep the scanner fail-closed for new runtime-owned authored prose and malformed `TEMP-HARDCODE` usage.

```js
const allowedRuntimeChineseFiles = new Set([
  "src/ui/main-ui/main-ui-flow.js",
  "src/ui/app-render.ts",
]);

const allowedRuntimeChineseLinePatterns = [
  /Failed to render campaign terrain WebGL map\./u,
  /Failed to load campaign actor asset\./u,
  /Failed to load campaign city depth mesh asset\./u,
];

function isAllowedRuntimeChinese(relativePath, line) {
  return (
    allowedRuntimeChineseFiles.has(relativePath) ||
    allowedRuntimeChineseLinePatterns.some((pattern) => pattern.test(line))
  );
}
```

Use `isAllowedRuntimeChinese(relativePath, line)` in place of the temporary `isAllowedChineseLine(line)` check.

- [ ] **Step 8: Run the tests and command entrypoints**

Run:

```bash
node --test tests/hardcoding-collaboration-gate.test.cjs
npm run lint:hardcoding
```

Expected:

- targeted tests `PASS`
- repository gate exits `0`

## Task 2: Write The Team-Facing Collaboration Contract

**Files:**
- Modify: `docs/collaboration.md`
- Modify: `AGENTS.md`
- Modify: `docs/change-log.md`
- Read: `docs/ui-layout-alignment-workflow.md`

- [ ] **Step 1: Write the docs change**

Add a new anti-hardcoding section to `docs/collaboration.md` that covers:

- runtime-owned content must branch on ids/facts/config, not visible text
- authored story prose and option text belong in content-owned sources
- layout coordinates/assets for layout-managed screens must stay on the preset/contract path
- `TEMP-HARDCODE` requires `target:` and `remove-when:`
- merge-review checklist questions for branches that touch gameplay, scenario flow, or layout behavior

Add a short pointer section in `AGENTS.md` that tells future agents to follow the collaboration doc and repository hardcoding gate for non-house work.

Record the repository-level collaboration rule in `docs/change-log.md`.

- [ ] **Step 2: Verify the doc changes are visible in the repository**

Run:

```bash
rg -n "Anti-Hardcoding|lint:hardcoding|TEMP-HARDCODE|ids/facts/config" docs/collaboration.md AGENTS.md docs/change-log.md
```

Expected:

- the new section and references appear in all intended files

## Task 3: Final Verification And Plan Closeout

**Files:**
- Modify: `docs/superpowers/plans/2026-07-06-anti-hardcoding-collaboration-enforcement-plan.md`

- [ ] **Step 1: Run required verification**

Run:

```bash
npm run lint:plans
npm test
npm run build
```

Expected:

- `PASS`

- [ ] **Step 2: Update plan state**

Update this plan file:

- mark completed checkboxes with `- [x]`
- set `Execution State.Status` to `completed-but-open` or `closed` only if all required verification passes and closeout requirements are satisfied
- append a final `Progress Log` entry with exact verification commands
- record any scoped exceptions if verification required tuning
- sync `docs/superpowers/project-progress.md` before treating the child as `closed`

- [ ] **Step 3: Commit the enforcement batch**

Run:

```bash
git add AGENTS.md docs/collaboration.md docs/change-log.md package.json tools/lint-hardcoding.mjs tests/hardcoding-collaboration-gate.test.cjs docs/superpowers/plans/2026-07-06-anti-hardcoding-collaboration-enforcement-plan.md
git commit -m "repo: enforce anti-hardcoding collaboration rules"
```

## Exit Check

- [ ] Repository docs contain the anti-hardcoding collaboration contract.
- [ ] `npm run lint:hardcoding` exists and passes on the current branch baseline.
- [ ] Automated tests cover the gate failure and success cases.
- [ ] Plan state and progress log reflect the finished batch.
- [ ] Project-level workflow change is recorded in `docs/change-log.md`.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
