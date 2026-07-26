# Task 2 Report: Structured Review Overlays And UI Contracts

## What I Implemented

- Added `HouseOverlayViewModel` variants for `review-assignment-table` and `review-policy-panel`.
- Added shared UI renderers:
  - `renderHouseReviewAssignmentTableOverlay()`
  - `renderHouseReviewPolicyPanelOverlay()`
- The assignment table renders title `委任`, columns `人物`, `委任`, `完成情况`, and completion labels through `getReviewCompletionGradeLabel()`.
- The policy panel renders fields `总目标`, `阶段目标`, `执行计划`.
- Wired keep-house and temple-house overlay dispatchers to render the new structured overlay variants.
- Added the UI contract test covering renderer output and the `src/main.ts` review-boundary constraint.
- Updated the governed implementation plan for Task 2 progress.

## Tests And Results

- `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-review-ui-contract.test.cjs }`
  - Result: PASS, 3 tests passed.
- `npm run typecheck`
  - Result: PASS.
- `npm run lint:plans`
  - Result: PASS, 66 plan files checked.

## TDD Evidence

### RED Command

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-review-ui-contract.test.cjs }
```

### RED Output

```text
> rpg-tg@0.1.0 build:test
> tsc -p tsconfig.test.json && node -e "require('node:fs').writeFileSync('.test-dist/package.json', '{\"type\":\"commonjs\"}')"

✖ review assignment table renders requested title, columns, and grade labels (2.2347ms)
✖ review policy panel renders all policy fields and can remain visible during advice prompt (0.3253ms)
✔ main entry does not gain review business imports or hardcoded review branches (4.1772ms)
ℹ tests 3
ℹ suites 0
ℹ pass 1
ℹ fail 2
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 179.6982

✖ failing tests:

test at tests\faction-review-ui-contract.test.cjs:17:1
✖ review assignment table renders requested title, columns, and grade labels (2.2347ms)
  TypeError: renderHouseReviewAssignmentTableOverlay is not a function

test at tests\faction-review-ui-contract.test.cjs:42:1
✖ review policy panel renders all policy fields and can remain visible during advice prompt (0.3253ms)
  TypeError: renderHouseReviewPolicyPanelOverlay is not a function
```

### GREEN Command

```powershell
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-review-ui-contract.test.cjs }
```

### GREEN Output

```text
> rpg-tg@0.1.0 build:test
> tsc -p tsconfig.test.json && node -e "require('node:fs').writeFileSync('.test-dist/package.json', '{\"type\":\"commonjs\"}')"

✔ review assignment table renders requested title, columns, and grade labels (2.1604ms)
✔ review policy panel renders all policy fields and can remain visible during advice prompt (0.5464ms)
✔ main entry does not gain review business imports or hardcoded review branches (3.9106ms)
ℹ tests 3
ℹ suites 0
ℹ pass 3
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 196.9969
```

## Files Changed

- `src/domain/house-module.ts`
- `src/ui/views/house/house-shared-view.ts`
- `src/ui/views/house/keep-house-view.ts`
- `src/ui/views/house/temple-house-view.ts`
- `tests/faction-review-ui-contract.test.cjs`
- `docs/superpowers/plans/2026-07-24-faction-review-flow-plan.md`
- `.superpowers/sdd/faction-review-task-2-report.md`

## Self-Review Findings Or Concerns

- No concerns found in Task 2 scope.
- Full `npm test` was not run because the task brief scoped verification to the targeted UI contract and noted a known unrelated full-suite failure in `tests/robustness.test.cjs` child 27 startup coordinator.

## Review Fix Note

- Addressed reviewer finding that Task 2 changed shared house overlay contracts and keep/temple renderer wiring without a changelog entry.
- Commit: `da77592e docs: record review overlay contracts`
- Verification: `npm run lint:plans`; `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/faction-review-ui-contract.test.cjs }`
