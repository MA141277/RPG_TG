# Runtime Follow-Up Contract Convergence Design

## 1. Goal

Define a narrow runtime-only convergence slice that reduces follow-up/result contract drift across core runtime seams without changing current visible behavior, entry wiring, or baseline UI ownership.

## 2. Scope

This design applies to:

- `src/core/contracts/runtime-result.ts`
- `src/core/runtime/runtime-router.ts`
- `src/core/runtime/runtime-dispatch.ts`
- focused runtime tests that assert follow-up compatibility behavior

This design does not apply to:

- `src/main.ts`
- UI, map, backpack, or styles
- new production caller wiring for event-owned playable completion
- removal of compatibility fields still required by the current baseline

## 3. Problem Statement

The branch has already migrated several follow-up paths onto shared runtime/application seams, but the underlying core contracts still reflect a partially transitional shape:

- `followUp` is the intended modern runtime continuation signal.
- legacy `outcome` and `interactive` compatibility paths still exist in some core contracts and dispatch handling.
- current migrated callers such as navigation and indoor-screen follow-up should not regress while this convergence happens.

The next slice should therefore converge contract ownership and tests before any new caller wiring is attempted.

## 4. Design Constraints

### 4.1 Boundary Rules

- Do not add feature business logic to `src/main.ts`.
- Do not widen UI-facing or visible app behavior as part of this slice.
- Keep the change inside `src/core/**`, `src/application/**` runtime seams, and tests only where directly required by the contract change.
- Preserve current baseline behavior for map, backpack, city-enter, house-enter, and indoor-screen follow-up flows.

### 4.2 Compatibility Rules

- `RuntimeFollowUp` remains the primary contract surface.
- Any legacy compatibility field that is still consumed by the current baseline must remain available.
- Legacy fallback handling must be explicit and test-guarded rather than implicitly preserved by scattered code paths.
- Do not delete a legacy field unless targeted tests prove the current branch no longer depends on it.

### 4.3 Slice Size Rules

- This slice must stay runtime-only.
- This slice must be verifiable in Node tests without requiring new browser-only validation.
- This slice must be small enough to land as one commit and merge checkpoint.

## 5. Target Design

### 5.1 Runtime Result Ownership

`RuntimeFollowUp` remains the canonical continuation signal in `runtime-result`.

The core contract should make a clear distinction between:

- canonical follow-up state used by current migrated runtime paths
- compatibility fields that still exist only to support older callers or transitional consumers

The design goal is not to remove compatibility immediately, but to clearly mark which fields are primary and which are compatibility-only.

### 5.2 Router / Dispatch Handling

`runtime-router` and `runtime-dispatch` should converge around a single primary follow-up handling path.

Desired behavior:

- modern runtime callers continue to return `followUp`
- dispatch handles the canonical follow-up path first
- any legacy fallback path remains narrow, explicit, and covered by tests
- compatibility logic should not duplicate state mutation or create divergent behavior between two follow-up channels

### 5.3 Test Ownership

The slice should restore or add focused contract tests that answer these questions directly:

- what is the canonical follow-up contract?
- which compatibility fields are still intentionally retained?
- how does dispatch/router prioritize canonical follow-up versus compatibility fallback?
- do migrated runtime paths still stay outside `src/main.ts` and avoid regressing to older compatibility seams?

## 6. File Strategy

### 6.1 Expected Files To Modify

- `src/core/contracts/runtime-result.ts`
  - clarify primary vs compatibility follow-up fields and types
- `src/core/runtime/runtime-router.ts`
  - align follow-up handler contract with the canonical shape
- `src/core/runtime/runtime-dispatch.ts`
  - centralize canonical follow-up handling and narrow any compatibility fallback
- `tests/runtime-follow-up-contract.test.cjs`
  - assert canonical follow-up contract plus retained compatibility fields
- `tests/runtime-router-follow-up-contract.test.cjs`
  - assert router follow-up handler shape and compatibility guardrails
- `tests/robustness.test.cjs`
  - keep existing ownership/boundary assertions for already migrated runtime paths

### 6.2 Files Explicitly Out Of Scope

- `src/main.ts`
- `src/ui/**`
- `src/components/**`
- `src/application/map/**`
- `src/application/backpack/**`
- `src/domain/map/**`
- `src/domain/backpack/**`
- `src/styles/**`

## 7. Verification Requirements

Required verification for this slice:

- `pnpm run build:test`
- targeted Node tests for follow-up contracts and migrated ownership assertions
- `pnpm run typecheck`
- boundary diff proof showing no changes in `src/main.ts`, UI, map, backpack, or styles
- `git diff --check`

Recommended targeted tests:

- `tests/runtime-follow-up-contract.test.cjs`
- `tests/runtime-router-follow-up-contract.test.cjs`
- any existing dispatch/runtime contract tests directly affected by the contract change
- the existing robustness subset that asserts migrated follow-up paths stay outside `src/main.ts` and do not regress to `scene-runtime`

## 8. Risks

### 8.1 False Cleanup

The main risk is removing or narrowing a compatibility field that is still required by the current baseline. This would create regressions that are hard to notice if only the modern path is tested.

Mitigation:

- test first
- keep compatibility fields unless usage is disproven
- prefer narrowing dispatch behavior before deleting types

### 8.2 Hidden Dual-Path Behavior

The current runtime stack may still contain callers that rely on fallback ordering rather than canonical follow-up handling.

Mitigation:

- add explicit tests for ordering and retained compatibility behavior
- avoid broad refactors outside the three core runtime files

## 9. Exit Conditions

This design is satisfied only when:

1. `RuntimeFollowUp` is still the canonical continuation surface and its contract is explicitly tested.
2. Router/dispatch handling is centered on the canonical follow-up path with any fallback behavior kept narrow and explicit.
3. No unapproved changes land in `src/main.ts`, UI, map, backpack, or styles.
4. Existing migrated runtime paths remain covered by ownership assertions and do not regress to older seams.
5. The slice remains small enough for a single runtime-only commit and merge checkpoint.
