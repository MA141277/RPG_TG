# Task 1 Report: Inventory Canonical Versus Residue Paths

## Scope

- Dispatch scope honored: test-only.
- Modified file: `tests/robustness.test.cjs`
- Report output: `.superpowers/sdd/task-1-report.md`
- No production files, docs, plans, or runtime/domain code were changed.

## Files Read

- `src/domain/script-editor-project.ts`
- `src/application/script-editor/city-building-authoring.ts`
- `src/application/script-editor/runtime-pack-export.ts`
- `src/application/script-editor/runtime-pack-import.ts`
- `src/application/scenario/scenario-pack-loader.ts`
- `src/core/runtime/runtime-settlement.ts`
- `src/core/save/save-migrations.ts`

## TDD Notes

1. Red step check:
   - Ran `node --test tests/robustness.test.cjs --test-name-pattern "legacy cutover inventory separates canonical keep fields from residue candidates"`.
   - In this workspace, the named inventory test already existed before my edit, so the brief's expected initial failure no longer reproduced.
   - The current Node test runner also executed the full file despite the name pattern, so verification evidence comes from the full-file run output.

2. Green step:
   - Kept the existing canonical-vs-residue inventory split.
   - Added a short task-local comment clarifying the classification intent.
   - Added `city-building-authoring.ts` to the inventory audit so the test now covers the authoring surface named in the brief.
   - Added explicit authoring assertions that audit legacy/residue `baseAttributes.*` handling on the Script Editor normalization path without treating those aliases as canonical flat runtime fields.

3. Refactor step:
   - Relaxed one overly strict regex after the first post-edit run showed it depended on field order inside `normalizeBuildingBaseAttributes`.
   - Replaced it with smaller assertions for `level`, `damaged`, and `outputMultiplier`.

## Test Change Summary

- The inventory guard continues to distinguish:
  - residue candidates still present before cleanup:
    - `baseAttributes.security`
    - `baseAttributes.level`
    - `baseAttributes.outputMultiplier`
    - `baseAttributes.damaged`
    - `population?: number`
  - canonical runtime fields also present:
    - `danger`
    - `level`
    - `outputMultiplier`
    - `damaged`
- The test still inventories residue candidates as present, rather than requiring cleanup to have happened already.
- The test now explicitly audits residue/legacy authoring handling on the Script Editor normalization surface in addition to schema/export/import/runtime surfaces.

## Verification

- Executed:
  - `node --test tests/robustness.test.cjs --test-name-pattern "legacy cutover inventory separates canonical keep fields from residue candidates"`
- Result:
  - Pass
  - In this environment the run exercised the full `tests/robustness.test.cjs` file and completed green.

## Commit Scope Handling

- `tests/robustness.test.cjs` already had large unrelated uncommitted changes in the working tree before this task work.
- To keep this dispatch scoped, staging/commit must include only the inventory-guard hunk(s) for this task plus this report file, leaving unrelated test edits unstaged.

## Concerns

- The workspace did not start from the brief's expected red state because the inventory guard already existed in the working tree.
- `--test-name-pattern` did not narrow execution to the single named test in this environment; verification still passed, but on the full file run.

## Fix Wave 2

### Summary
- Renamed the task-local inventory constants so the classification matches the task brief:
  - residue candidates still present before cleanup:
    - `baseAttributes.security`
    - `baseAttributes.level`
    - `baseAttributes.outputMultiplier`
    - `baseAttributes.damaged`
    - `population?: number`
  - canonical runtime fields also present:
    - `danger`
    - `level`
    - `outputMultiplier`
    - `damaged`
- Updated the guard comment and grouped the assertion loops around those two classifications without changing the underlying inventory behavior.
- Commit subject recorded for this fix wave: `test: clarify task 1 inventory guard classification`

### Verification
- Executed: `node --test tests/robustness.test.cjs --test-name-pattern "legacy cutover inventory separates canonical keep fields from residue candidates"`
- Result: passed with exit code `0`; in this environment the run still executed the full `tests/robustness.test.cjs` file and finished with `559` passing, `0` failing, and `176` skipped.

## Fix Wave 3

### Summary
- Strengthened the canonical runtime field audit so flat runtime keys are matched through surrounding source syntax instead of bare substrings that residue aliases could satisfy.
- Kept the residue candidate inventory on explicit alias-path patterns.
- Recorded the follow-up code fix commit for this wave: `69f21643 test: harden task 1 inventory field guard`

### Verification
- Executed: `node --test tests/robustness.test.cjs --test-name-pattern "legacy cutover inventory separates canonical keep fields from residue candidates"`
- Result: passed with exit code `0`; in this environment the run executed the full `tests/robustness.test.cjs` file and finished with `559` passing, `0` failing, and `176` skipped.

## Fix Wave 4

### Summary
- Replaced the pooled residue blob audit with source-by-source residue assertions for schema, runtime export, runtime import, scenario loader, and runtime settlement surfaces.
- Kept canonical runtime field assertions separate and explicit in the scenario-loader audit.
- Clarified the report language so Script Editor authoring assertions are described as residue/legacy authoring handling checks rather than canonical flat-runtime handling.
- Commit details for this wave: `test: separate task 1 residue inventory by named surface`

### Verification
- Executed: `node --test tests/robustness.test.cjs --test-name-pattern "legacy cutover inventory separates canonical keep fields from residue candidates"`
- Result: passed with exit code `0`; in this environment the run executed the full `tests/robustness.test.cjs` file and finished with `559` passing, `0` failing, and `176` skipped.
