# Commit Summary Hook Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a repository-managed Git commit hook workflow that rejects commit messages missing a `Summary:` body section and gives collaborators a one-command setup path.

**Architecture:** Implement the validation logic as a small Node ESM utility under `tools/`, cover it with focused Node tests, and keep the Git hook itself as a thin checked-in entrypoint under `.githooks/`. Expose hook installation through an npm script that sets `core.hooksPath` for the local clone, and document the commit contract plus setup command in `README.md`.

**Tech Stack:** Node.js ESM, Git hooks, npm scripts, Node test runner, PowerShell/Git shell compatibility.

## Execution State

- Status: `completed`
- Last Updated: `2026-07-02`
- Current Focus: `Implementation, verification, and branch handoff complete.`
- Next Step: `None.`
- Verification: `npm run lint:plans; npm run typecheck; npm test`
- Notes: `This v1 plan intentionally enforces only Summary-based commit message validation. Changes were committed to a dedicated branch for remote backup.`

## Progress Log

- 2026-07-02
  - Summary: `Created implementation plan for repository-managed commit summary enforcement.`
  - Verification: `npm run lint:plans`
  - Next: `Start Task 1 Step 1.`
- 2026-07-02
  - Summary: `Implemented commit summary validation hook, installer, tests, and README guidance; verified repository checks; pending commit choice.`
  - Verification: `npm run lint:plans`, `npm run typecheck`, `npm test`
  - Next: `Choose branch completion path before Task 5 Step 3.`

---

## File Map

### Existing files to modify

- `C:/Users/Administrator/Desktop/workspace/project/RPG_TG/package.json`
  - Add a bootstrap script for hook installation and, if needed, a targeted validator test command.
- `C:/Users/Administrator/Desktop/workspace/project/RPG_TG/README.md`
  - Document the `Summary:` commit contract and the hook installation command.

### New files to create

- `C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tools/validate-commit-message.mjs`
  - Own the commit message parsing and validation logic.
- `C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tests/commit-message-validation.test.cjs`
  - Verify the validator against passing and failing commit message samples.
- `C:/Users/Administrator/Desktop/workspace/project/RPG_TG/.githooks/commit-msg`
  - Thin Git hook entrypoint that invokes the Node validator with the commit message file path.
- `C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tools/install-git-hooks.mjs`
  - Set `core.hooksPath` to `.githooks` for the current clone and print a confirmation message.

## Task 1: Add Validator Test Coverage

**Files:**
- Create: `C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tests/commit-message-validation.test.cjs`
- Read: `C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tests/robustness.test.cjs`
- Read: `C:/Users/Administrator/Desktop/workspace/project/RPG_TG/package.json`

- [x] **Step 1: Write the failing validator tests**

Create `tests/commit-message-validation.test.cjs` with targeted Node tests for the minimal contract:

```js
const test = require("node:test");
const assert = require("node:assert/strict");

test("accepts a commit message with a Summary section and body lines", async () => {
  const { validateCommitMessageText } = await import("../tools/validate-commit-message.mjs");

  assert.deepEqual(
    validateCommitMessageText("feat: add hook\n\nSummary:\n- add validator\n"),
    { ok: true, errors: [] }
  );
});

test("rejects a commit message without a body", async () => {
  const { validateCommitMessageText } = await import("../tools/validate-commit-message.mjs");

  const result = validateCommitMessageText("feat: add hook\n");
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /body/i);
});

test("rejects a commit message without Summary", async () => {
  const { validateCommitMessageText } = await import("../tools/validate-commit-message.mjs");

  const result = validateCommitMessageText("feat: add hook\n\nDetails:\n- add validator\n");
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /Summary:/);
});

test("rejects a commit message with an empty Summary section", async () => {
  const { validateCommitMessageText } = await import("../tools/validate-commit-message.mjs");

  const result = validateCommitMessageText("feat: add hook\n\nSummary:\n");
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /non-empty/i);
});
```

- [x] **Step 2: Run the new test file to verify it fails**

Run:

```bash
npm run build:test
node --test tests/commit-message-validation.test.cjs
```

Expected:

- `FAIL`
- failure because `../tools/validate-commit-message.mjs` or `validateCommitMessageText` does not exist yet

## Task 2: Implement the Commit Message Validator

**Files:**
- Create: `C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tools/validate-commit-message.mjs`
- Test: `C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tests/commit-message-validation.test.cjs`

- [x] **Step 1: Write the minimal validator implementation**

Create `tools/validate-commit-message.mjs` with a small reusable validator plus a CLI entrypoint:

```js
import fs from "node:fs";

export function validateCommitMessageText(text) {
  const normalizedText = text.replace(/\r\n/g, "\n");
  const lines = normalizedText.split("\n");
  const errors = [];
  const subject = lines[0]?.trim() ?? "";
  const bodyLines = lines.slice(1);
  const summaryIndex = bodyLines.findIndex((line) => line.trim() === "Summary:");

  if (subject.length === 0) {
    errors.push("Commit subject must not be empty.");
  }

  if (!bodyLines.some((line) => line.trim().length > 0)) {
    errors.push("Commit message must include a body.");
  }

  if (summaryIndex === -1) {
    errors.push("Commit message body must include a `Summary:` section.");
  } else {
    const summaryBodyLines = bodyLines
      .slice(summaryIndex + 1)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (summaryBodyLines.length === 0) {
      errors.push("`Summary:` must be followed by at least one non-empty line.");
    }
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

function main(argv) {
  const commitMessagePath = argv[2];

  if (!commitMessagePath) {
    console.error("Missing commit message file path.");
    process.exit(1);
  }

  const text = fs.readFileSync(commitMessagePath, "utf8");
  const result = validateCommitMessageText(text);

  if (result.ok) {
    return;
  }

  console.error("Commit message rejected.");
  for (const error of result.errors) {
    console.error(`- ${error}`);
  }
  console.error("");
  console.error("Example:");
  console.error("feat: add hook-based commit summary enforcement");
  console.error("");
  console.error("Summary:");
  console.error("- add repository-managed commit-msg hook");
  process.exit(1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main(process.argv);
}
```

- [x] **Step 2: Run the validator tests to verify they pass**

Run:

```bash
npm run build:test
node --test tests/commit-message-validation.test.cjs
```

Expected:

- `PASS`

- [x] **Step 3: Run the existing repository test suite to confirm no regression**

Run:

```bash
npm test
```

Expected:

- `PASS`

## Task 3: Wire the Repository Hook and Installer

**Files:**
- Create: `C:/Users/Administrator/Desktop/workspace/project/RPG_TG/.githooks/commit-msg`
- Create: `C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tools/install-git-hooks.mjs`
- Modify: `C:/Users/Administrator/Desktop/workspace/project/RPG_TG/package.json`
- Read: `C:/Users/Administrator/Desktop/workspace/project/RPG_TG/tools/validate-commit-message.mjs`

- [x] **Step 1: Write the failing installer verification**

Run:

```bash
node tools/install-git-hooks.mjs
```

Expected:

- `FAIL`
- failure because `tools/install-git-hooks.mjs` does not exist yet

- [x] **Step 2: Add the hook entrypoint and installer**

Create `.githooks/commit-msg` as a thin shell entrypoint:

```sh
#!/bin/sh
node tools/validate-commit-message.mjs "$1"
```

Create `tools/install-git-hooks.mjs`:

```js
import { execFileSync } from "node:child_process";

execFileSync("git", ["config", "core.hooksPath", ".githooks"], {
  stdio: "inherit",
});

console.log("Configured core.hooksPath to .githooks");
```

Update `package.json` scripts:

```json
{
  "scripts": {
    "git:install-hooks": "node tools/install-git-hooks.mjs"
  }
}
```

- [x] **Step 3: Run the installer and verify hook configuration**

Run:

```bash
npm run git:install-hooks
git config --get core.hooksPath
```

Expected:

- installer prints a success message
- `git config --get core.hooksPath` outputs `.githooks`

## Task 4: Document the Workflow

**Files:**
- Modify: `C:/Users/Administrator/Desktop/workspace/project/RPG_TG/README.md`
- Read: `C:/Users/Administrator/Desktop/workspace/project/RPG_TG/package.json`

- [x] **Step 1: Update README with setup and commit format guidance**

Add a short section to `README.md` describing:

```md
## Git Commit Summary Rule

This repository requires every commit message to include a `Summary:` section in the body.

Enable the repository hooks once per clone:

```powershell
npm run git:install-hooks
```

Valid commit message example:

```text
feat: add hook-based commit summary enforcement

Summary:
- add repository-managed commit-msg hook
- document setup in README
```
```

- [x] **Step 2: Run focused verification for docs and scripts**

Run:

```bash
npm run typecheck
node --test tests/commit-message-validation.test.cjs
```

Expected:

- `PASS`

## Task 5: Final Verification and Plan Closeout

**Files:**
- Modify: `C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/plans/2026-07-02-commit-summary-hook-plan.md`
- Read: `C:/Users/Administrator/Desktop/workspace/project/RPG_TG/README.md`
- Read: `C:/Users/Administrator/Desktop/workspace/project/RPG_TG/package.json`

- [x] **Step 1: Run full repository verification for the completed change**

Run:

```bash
npm run lint:plans
npm run typecheck
npm test
```

Expected:

- `PASS`

- [x] **Step 2: Update plan tracking state**

Update this plan file:

```md
- Status: `completed`
- Last Updated: `2026-07-02`
- Current Focus: `Implementation and verification complete.`
- Next Step: `None.`
- Verification: `npm run lint:plans && npm run typecheck && npm test`
- Notes: `Repository-managed commit summary hook shipped.`
```

Append a final progress log entry:

```md
- 2026-07-02
  - Summary: `Implemented commit summary validation hook, installer, tests, and README guidance.`
  - Verification: `npm run lint:plans`, `npm run typecheck`, `npm test`
  - Next: `None.`
```

- [x] **Step 3: Commit the finished change**

Run:

```bash
git add .githooks/commit-msg tools/validate-commit-message.mjs tools/install-git-hooks.mjs tests/commit-message-validation.test.cjs package.json README.md docs/superpowers/plans/2026-07-02-commit-summary-hook-plan.md docs/superpowers/specs/2026-07-02-git-push-summary-enforcement-design.md
git commit
```

Expected:

- commit succeeds with a valid `Summary:` body

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
