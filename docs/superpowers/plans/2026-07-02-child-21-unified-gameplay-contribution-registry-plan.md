# Child 21 Unified Gameplay Contribution Registry Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce one mod-facing gameplay contribution registry that validates and installs navigation/event/scene/task/house contributions through manifests and shared registries instead of scattered static imports and placeholder registry types.

**Architecture:** Child 21 starts only after Child 20 closes. It is the first child that unifies the separate contribution surfaces into one formal install/validation layer. This child must not absorb the final startup/save/render closure; it only defines and wires the contribution registry so Child 22 can use it end-to-end.

**Tech Stack:** TypeScript, mod manifest/runtime contracts, core registries, content-pack/scenario-pack definitions, Node test runner (`tests/robustness.test.cjs`), `npm run typecheck`, `npm test`, `npm run build`, `npm run lint:plans`

## Execution State

- Status: `not-started`
- Last Updated: `2026-07-02`
- Current Focus: `Pre-authored plan only. Await fresh weekly promotion before execution.`
- Next Step: `Promote Child 21 only after Child 20 closeout and baseline recheck.`
- Verification: `Not run as part of this doc-only change`
- Notes: `This child unifies registry/install policy; it does not own end-to-end runtime closure.`

## Progress Log

- 2026-07-02
  - Summary: `Plan created from the mod-first unified contract roadmap. Child 21 remains non-executable until the next weekly set promotes it after Child 20.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Recheck registry placeholders and contribution surfaces after Child 20 closes.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-02-mod-first-unified-contract-roadmap-design.md`
- Weekly set plan:
  - `To be authored by the next fresh weekly review. Promote only after Child 20 closes.`

## Baseline Recheck

- Recheck result: `narrowed`
- Notes:
  - `src/core/registry/content-registry.ts` and src/core/registry/mod-registry.ts are still placeholder-grade types.`
  - `Child 21 should reuse the mod-runtime activation seam rather than replacing it.`
  - `The child should define contribution validation and registration, not final startup/save/render closure.`

## Implementation Scope

### In Scope

- audit of current placeholder registry seams and contribution ownership gaps
- additive contribution registry types for navigation/event/scene/task/house
- manifest/runtime validation for contribution registration, dependency, and conflict handling
- integration of the contribution registry into mod activation output
- targeted regression coverage for registry validation and contribution install
- governance/doc sync for the new child outcome

### Still Out Of Scope

- final startup/restore closure
- presenter/UI redesign
- new gameplay systems beyond the existing contribution families
- editor tooling

## File Map

### Existing files to modify

- `src/core/contracts/mod-manifest.ts`
  - Expand manifest contribution declarations where needed.
- `src/core/contracts/mod-runtime.ts`
  - Expand activated-mod output for unified contribution registration.
- `src/core/mods/mod-runtime.ts`
  - Install validated contributions into activation output.
- `src/core/mods/mod-capability-guard.ts`
  - Keep capability policy aligned with new contribution categories if needed.
- `src/core/mods/mod-dependency-resolver.ts`
  - Keep dependency/conflict checks aligned with new contribution categories if needed.
- `src/core/registry/content-registry.ts`
  - Replace placeholder typing with a real contribution registry shape.
- `src/core/registry/mod-registry.ts`
  - Keep manifest registry aligned with contribution registration.
- `src/core/registry/engine-registry.ts`
  - Keep engine-facing registry shape aligned with contribution install output.
- `src/domain/content-pack.ts`
  - Expose any additive contribution fields needed for pack-backed registration.
- `src/domain/scenario-pack.ts`
  - Keep scenario-pack typing aligned with the registry shape.
- `tests/robustness.test.cjs`
  - Add red-to-green coverage for contribution registry validation and install.
- `docs/change-log.md`
  - Record the Child 21 registry outcome.
- `docs/superpowers/plans/2026-07-02-child-21-unified-gameplay-contribution-registry-plan.md`
  - Record execution progress and closeout.

### Existing files to read

- `src/core/contracts/house-runtime.ts`
- `src/core/contracts/task-runtime.ts`
- `src/core/runtime/navigation-runtime.ts`
- `src/core/runtime/event-runtime.ts`
- `src/core/runtime/scene-runtime.ts`
- `src/core/runtime/house-runtime.ts`

### New files to create

- `src/core/contracts/gameplay-contribution.ts`
  - Shared contribution type family if the existing manifest/runtime contracts become too overloaded.

## Verification Plan

- Targeted verification:
  - `node --test tests/robustness.test.cjs --test-name-pattern "gameplay contribution registry|mod manifest contribution|mod runtime contribution|dependency conflict|capability rejected"`
- Required commands:
  - `npm run typecheck`
  - `npm test`
  - `npm run build`

## Task 1: Audit Placeholder Registries And Contribution Gaps

**Files:**
- Read: `src/core/registry/content-registry.ts`
- Read: `src/core/registry/mod-registry.ts`
- Read: `src/core/contracts/mod-manifest.ts`
- Read: `src/core/contracts/mod-runtime.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Enumerate the current contribution registry and validation gaps**

Record what still keeps navigation/event/scene/task/house registration split across placeholder types or static imports.

- [ ] **Step 2: Add failing regression tests for unified contribution validation**

Write red tests that prove the current activation path cannot yet validate and expose unified gameplay contributions.

- [ ] **Step 3: Run the targeted red tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "gameplay contribution registry|mod manifest contribution|mod runtime contribution|dependency conflict|capability rejected"
```

Expected:

- at least one unified-registry guard fails before implementation

- [ ] **Step 4: Record the audit result in plan state**

Update `Execution State` and `Progress Log` with the enumerated registry baseline.

## Task 2: Add Unified Contribution Registry Types And Validation

**Files:**
- Modify: `src/core/contracts/mod-manifest.ts`
- Modify: `src/core/contracts/mod-runtime.ts`
- Modify: `src/core/registry/content-registry.ts`
- Modify: `src/core/registry/mod-registry.ts`
- Create: `src/core/contracts/gameplay-contribution.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Add additive contribution registry types across manifest/runtime/registry seams**

Keep existing builtin activation valid while introducing unified contribution declarations.

- [ ] **Step 2: Re-run the targeted registry tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "gameplay contribution registry|mod manifest contribution|mod runtime contribution"
```

Expected:

- unified contribution type and validation tests pass

- [ ] **Step 3: Run the full verification gate for Task 2**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass

## Task 3: Install Unified Contributions During Mod Activation

**Files:**
- Modify: `src/core/mods/mod-runtime.ts`
- Modify: `src/core/mods/mod-capability-guard.ts`
- Modify: `src/core/mods/mod-dependency-resolver.ts`
- Modify: `src/core/registry/engine-registry.ts`
- Modify: `src/domain/content-pack.ts`
- Modify: `src/domain/scenario-pack.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Install validated gameplay contributions into activated-mod output**

Keep activation atomic and reject invalid contributions before partial install.

- [ ] **Step 2: Re-run the targeted activation tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "gameplay contribution registry|mod runtime contribution|dependency conflict|capability rejected"
```

Expected:

- unified contribution activation tests pass

- [ ] **Step 3: Run the full verification gate for Task 3**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass

## Task 4: Close Out Child 21 Governance

**Files:**
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-07-02-child-21-unified-gameplay-contribution-registry-plan.md`

- [ ] **Step 1: Record the final contribution registry boundary**

Document which contribution families are now validated/installed through the unified registry and which authoring/tooling concerns remain outside Child 21.

- [ ] **Step 2: Run governance verification**

Run:

```bash
npm run lint:plans
```

Expected:

- `Superpowers plan lint passed`

## Exit Check

- [ ] A unified gameplay contribution registry exists across manifest/runtime/registry seams.
- [ ] Mod activation validates and installs navigation/event/scene/task/house contributions atomically.
- [ ] Placeholder registry types are replaced or wrapped by stable contribution types.
- [ ] Child 21 does not absorb final startup/save/render closure.
- [ ] Targeted regression coverage passes.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
