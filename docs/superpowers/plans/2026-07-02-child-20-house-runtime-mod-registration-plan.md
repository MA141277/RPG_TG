# Child 20 House Runtime Mod Registration Plan

> **Legacy Governance Context:** This document was authored under the retired `weekly plan / weekly set / weekly orchestration` model. Keep its technical scope, but treat any weekly-governance references as historical context only. Resume governed work from `docs/superpowers/project-progress.md` instead.

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Promote the existing house runtime bridge and static house module registry into a mod-facing registration surface while preserving the repository special-house interface contract and keeping house behavior out of `src/main.ts`.

**Architecture:** Child 20 starts only after Child 19 closes. It expands the current house runtime from builtin static registration to a mod-aware registration path without inventing house-specific branches in `src/main.ts`. This child must obey `docs/special-house-interface.md`, update that contract if shared house interfaces change, and keep stage-specific or scenario-specific business in pack data or module implementations rather than runtime glue.

**Tech Stack:** TypeScript, `src/domain/house-module.ts`, `src/core/contracts/house-runtime.ts`, `src/core/runtime/house-runtime.ts`, house module registry, Node test runner (`tests/robustness.test.cjs`), `npm run typecheck`, `npm test`, `npm run build`, `npm run lint:plans`

## Execution State

- Status: `completed`
- Last Updated: `2026-07-02`
- Current Focus: `Child 20 is closed. Shared house registration now converges through one core-owned seam for builtin module and renderer lookup.`
- Next Step: `Run a fresh Child 21 baseline recheck before promoting the unified gameplay contribution registry child.`
- Verification: `node --test tests/robustness.test.cjs --test-name-pattern "house runtime|house module registry|special house interface|mod house registration|house renderer registry"` + `npm run typecheck` + `npm test` + `npm run build` + `npm run lint:plans`
- Notes: `Shared house interfaces and registry shape were synchronized in docs/special-house-interface.md and docs/change-log.md as required.`

## Progress Log

- 2026-07-02
  - Summary: `Plan created from the mod-first unified contract roadmap. Child 20 remains non-executable until the next weekly set promotes it after Child 19.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Recheck the builtin house module registry and special-house interface assumptions after Child 19 closes.`
- 2026-07-02
  - Summary: `Ran the fresh post-Child-19 baseline recheck and promoted Child 20 to active execution. The next debt is narrower than the original draft: a builtin-static house registry still leaks into core runtime ownership, presenter module-view selection, and house renderer lookup. Task 1 also added targeted red tests that fail exactly on the missing shared registration seam and unsynchronized special-house registry contract.`
  - Verification: `node --test tests/robustness.test.cjs --test-name-pattern "house runtime|house module registry|special house interface|mod house registration|house renderer registry"`
  - Next: `Implement the shared house registration seam under core ownership and re-run the targeted registration tests.`
- 2026-07-02
  - Summary: `Completed Child 20. Builtin house module and renderer bindings now assemble through src/core/registry/house-module-registry.ts, covered house runtime/presenter/view lookup consume that shared seam, and the special-house interface contract now explicitly requires builtin and mod-owned houses to share one registration path.`
  - Verification: `node --test tests/robustness.test.cjs --test-name-pattern "house runtime|house module registry|special house interface|mod house registration|house renderer registry"` + `npm run typecheck` + `npm test` + `npm run build` + `npm run lint:plans`
  - Next: `Keep Child 21 queued until a fresh baseline recheck decides whether its registry scope stays unchanged after Child 20.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-02-mod-first-unified-contract-roadmap-design.md`
- Weekly set plan:
  - `To be authored by the next fresh weekly review. Promote only after Child 19 closes.`

## Baseline Recheck

- Recheck result: `narrowed`
- Notes:
  - `The current builtin registry is src/application/house-modules/house-module-registry.ts.`
  - `The current shared house contract is split between src/domain/house-module.ts, src/core/contracts/house-runtime.ts, and docs/special-house-interface.md.`
  - `Child 20 must keep house-specific business in modules/content and should not expand main.ts house branching.`

## Implementation Scope

### In Scope

- audit of static builtin house registry assumptions
- additive house registration surfaces for mod-owned module contributions
- alignment of house runtime bridge, domain contract, and special-house interface docs
- migration of covered house resolution paths to the new registration seam
- targeted regression coverage for house registration and runtime dispatch ownership
- governance/doc sync for the new child outcome

### Still Out Of Scope

- creation of a new concrete house implementation
- scene/story redesign beyond shared house hooks
- task contract redesign
- global contribution registry policy redesign
- UI renderer redesign except for required registration shape alignment

## File Map

### Existing files to modify

- `docs/special-house-interface.md`
  - Update the shared house contract if the registration/runtime session shape changes.
- `src/domain/house-module.ts`
  - Add any shared registration metadata required for mod-facing house modules.
- `src/core/contracts/house-runtime.ts`
  - Align the runtime request/response surface with the updated registration path if needed.
- `src/core/runtime/house-runtime.ts`
  - Consume house modules through the new registration seam instead of builtin-only static registry assumptions.
- `src/application/house/house-runtime.ts`
  - Keep the application-layer house runtime aligned if it remains in use during migration.
- `src/application/house-modules/house-module-registry.ts`
  - Replace or wrap the builtin static registry with a registration seam that later mods can populate.
- `src/ui/views/house/house-module-view-registry.ts`
  - Align renderer registration if the shared registry shape changes.
- `src/main.ts`
  - Keep main on stable generic house runtime wiring only.
- `tests/robustness.test.cjs`
  - Add red-to-green coverage for house registration and special-house contract assumptions.
- `docs/change-log.md`
  - Record the Child 20 contract outcome.
- `docs/superpowers/plans/2026-07-02-child-20-house-runtime-mod-registration-plan.md`
  - Record execution progress and closeout.

### Existing files to read

- `src/domain/house.ts`
- `src/core/runtime/state-sync-runtime.ts`
- `docs/hardcoded-text-audit.md`

### New files to create

- `src/core/registry/house-module-registry.ts`
  - Shared registry seam if the existing application registry cannot be safely promoted in place.

## Verification Plan

- Targeted verification:
  - `node --test tests/robustness.test.cjs --test-name-pattern "house runtime|house module registry|special house interface|mod house registration|house renderer registry"`
- Required commands:
  - `npm run typecheck`
  - `npm test`
  - `npm run build`

## Task 1: Audit Static House Registration And Shared Interface Assumptions

**Files:**
- Read: `docs/special-house-interface.md`
- Read: `src/domain/house-module.ts`
- Read: `src/application/house-modules/house-module-registry.ts`
- Read: `src/core/runtime/house-runtime.ts`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Enumerate builtin-only registry assumptions and shared contract gaps**

Record which assumptions still prevent house modules from being registered through a mod-facing path.

- [x] **Step 2: Add failing regression tests for static registry assumptions**

Write red tests that prove house runtime and renderer lookup are still builtin-static before implementation.

- [x] **Step 3: Run the targeted red tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "house runtime|house module registry|special house interface|mod house registration|house renderer registry"
```

Expected:

- at least one house-registration guard fails before implementation

- [x] **Step 4: Record the audit result in plan state**

Update `Execution State` and `Progress Log` with the enumerated house-registration baseline.

## Task 2: Introduce A Shared House Registration Seam

**Files:**
- Modify: `src/domain/house-module.ts`
- Modify: `src/core/contracts/house-runtime.ts`
- Modify: `src/application/house-modules/house-module-registry.ts`
- Create: `src/core/registry/house-module-registry.ts`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Add additive registration structures for house modules and renderers**

Keep builtin house modules working while introducing a later mod-populatable registry surface.

- [x] **Step 2: Re-run the targeted registration tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "house module registry|mod house registration|house renderer registry"
```

Expected:

- house registration tests pass

- [x] **Step 3: Run the full verification gate for Task 2**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass

## Task 3: Move Covered House Runtime Wiring Onto The New Registration Path

**Files:**
- Modify: `src/core/runtime/house-runtime.ts`
- Modify: `src/application/house/house-runtime.ts`
- Modify: `src/ui/views/house/house-module-view-registry.ts`
- Modify: `src/main.ts`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Resolve covered house runtime and renderer lookup through the new registry**

Keep `src/main.ts` on stable generic house wiring only.

- [x] **Step 2: Re-run the targeted house-runtime tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "house runtime|mod house registration|special house interface"
```

Expected:

- covered house runtime tests pass

- [x] **Step 3: Run the full verification gate for Task 3**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass

## Task 4: Sync Shared House Documentation And Close Out Governance

**Files:**
- Modify: `docs/special-house-interface.md`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-07-02-child-20-house-runtime-mod-registration-plan.md`

- [x] **Step 1: Update the shared house interface documentation**

Reflect the final registration/runtime session shape and keep the acceptance checklist accurate.

- [x] **Step 2: Run governance verification**

Run:

```bash
npm run lint:plans
```

Expected:

- `Superpowers plan lint passed`

## Exit Check

- [x] House module registration no longer depends on a builtin-only static registry.
- [x] Covered house runtime lookup uses the shared registration seam.
- [x] `src/main.ts` does not gain house-specific business branches.
- [x] `docs/special-house-interface.md` and `docs/change-log.md` are synchronized with the shared contract change.
- [x] Targeted regression coverage passes.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
