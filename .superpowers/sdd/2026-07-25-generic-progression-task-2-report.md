# 2026-07-25 Generic Progression Task 2 Report

## Scope

Implemented Task 2 as the first runtime behavior slice for the generic progression-track mechanism.

The landed slice:

- adds a generic progression runtime module
- emits progression settlement instances only
- extends the shared runtime result / settlement seam incrementally
- keeps event as the only formal routing owner
- forwards routed progression settlement instances through `settleRuntimeEffects(...)`
- avoids creating any second execution path or direct progression-owned state mutation path

## Files Changed

- `src/core/contracts/progression-runtime.ts`
- `src/core/contracts/runtime-result.ts`
- `src/core/contracts/effect-settlement.ts`
- `src/core/runtime/progression-runtime.ts`
- `src/core/runtime/runtime-dispatch.ts`
- `src/core/runtime/runtime-settlement.ts`
- `tests/robustness.test.cjs`
- `docs/change-log.md`

## Implementation Summary

### 1. Progression runtime

Added `runProgressionRuntime(...)` in `src/core/runtime/progression-runtime.ts`.

Behavior:

- resolves the owner key from the existing binding contract
- selects the highest satisfied tier
- respects `allowDemotion`
- updates the unified runtime progression state incrementally
- appends tier-entry history on tier changes
- emits a settlement instance only when the runtime converges onto a different target tier
- respects tier repeat policy by suppressing re-entry emission for `once-ever` tiers

The emitted payload matches the required canonical shape:

- `ownerKind`
- `ownerId`
- `trackId`
- `fromTierId`
- `toTierId`
- `metricValue`

### 2. Shared result/seam extension

Extended the existing contracts rather than replacing them:

- added `ProgressionSettlementInstance`
- added `ProgressionRuntimeResult`
- added optional `settlementInstances` to `RuntimeResult`
- added optional `settlementInstances` to `EffectSettlementInput`
- extended `EffectEmitter` with `progression-runtime`

This keeps the public seam coherent with the repository's existing `RuntimeResult` / `RuntimeRouteResult` pattern.

### 3. Settlement handoff

Updated `src/core/runtime/runtime-dispatch.ts` so routed `settlementInstances` are handed to `settleRuntimeEffects(...)` after the existing routed-effect and task-effect settlement work.

That keeps progression on the current shared settlement seam:

- no direct progression effect execution
- no direct state writes from progression
- no alternate dispatcher
- no direct event-start emission

### 4. Settlement runtime boundary

Updated `src/core/runtime/runtime-settlement.ts` only minimally so the shared settlement seam now explicitly accepts the new settlement-instance lane.

This task does **not** introduce full authored progression settlement execution yet. The seam is now present and wired, which is the required Task 2 landing boundary.

## Tests

### Red phase

Added the required failing robustness tests:

- `progression runtime emits settlement instances only for target-tier convergence`
- `runtime dispatch keeps progression settlement handoff on the shared settlement seam`

Confirmed the initial failure reasons were the expected ones:

- missing `src/core/runtime/progression-runtime.ts`
- missing `settlementInstances` handoff in `src/core/runtime/runtime-dispatch.ts`

### Green verification

Passed:

```bash
npm.cmd run build:test
node --test tests/robustness.test.cjs --test-name-pattern "progression runtime emits settlement instances only for target-tier convergence|runtime dispatch keeps progression settlement handoff on the shared settlement seam"
npm.cmd run typecheck
```

## Notes / Concerns

- `npm.cmd test -- --test-name-pattern "...Task 2 tests..."` still executes unrelated test files in this repository and hits a pre-existing failure in `tests/city-building-mount-authoring.test.cjs` (`script editor city profile UI exposes mounted building and npc controls`). That failure is outside Task 2 ownership and did not block the bounded robustness verification requested for this task.
- The shared settlement seam now carries progression settlement instances, but full authored settlement-template execution for those instances is intentionally not part of Task 2.

## Result

Task 2 is complete within the requested boundary and is ready for commit.

---

## 2026-07-25 Review Fix Batch

### Review Findings Addressed

- High: `progression-runtime` no longer collapses unresolved bindings into `ownerId: ""` or the shared `person:` owner bucket. Unresolved bindings now short-circuit before state upsert and emit no canonical settlement payload.
- Medium: `progression-runtime` now respects `binding.enabled === false` as a strict no-op and emits neither state updates nor settlement instances for disabled bindings.
- Low: bounded regression tests now cover both preconditions explicitly.

### Code Changes

- Updated `src/core/runtime/progression-runtime.ts` to short-circuit disabled bindings before any runtime work.
- Updated `src/core/runtime/progression-runtime.ts` to require a concrete non-empty `ownerId` before computing the owner key, mutating progression state, or emitting a target-tier settlement payload.
- Updated `tests/robustness.test.cjs` with two bounded regression tests:
  - `progression runtime skips unresolved concrete owners instead of collapsing into a shared owner bucket`
  - `progression runtime skips disabled bindings without updating state or settlement instances`

### Red Verification

Commands run:

```bash
npm.cmd run build:test
node --test tests/robustness.test.cjs --test-name-pattern "progression runtime emits settlement instances only for target-tier convergence|progression runtime skips unresolved concrete owners instead of collapsing into a shared owner bucket|progression runtime skips disabled bindings without updating state or settlement instances|runtime dispatch keeps progression settlement handoff on the shared settlement seam"
```

Observed failure summary before the fix:

- unresolved-owner test failed because runtime wrote `trackStatesByOwnerKey["person:"]` with `ownerId: ""`
- disabled-binding test failed because runtime advanced to `tier.2` and mutated state despite `enabled: false`

### Green Verification

Commands run:

```bash
npm.cmd run build:test
node --test tests/robustness.test.cjs --test-name-pattern "progression runtime emits settlement instances only for target-tier convergence|progression runtime skips unresolved concrete owners instead of collapsing into a shared owner bucket|progression runtime skips disabled bindings without updating state or settlement instances|runtime dispatch keeps progression settlement handoff on the shared settlement seam"
npm.cmd run typecheck
```

Output summary:

- `npm.cmd run build:test`: passed
- focused `node --test ...`: `704` tests, `528` passed, `0` failed, `176` skipped
- `npm.cmd run typecheck`: passed

### Scope Notes

- The fix stays on the existing `runProgressionRuntime(...)` to `settleRuntimeEffects(...)` seam.
- No authored progression settlement-template execution was added.
- No alternate routing or execution path was introduced.
