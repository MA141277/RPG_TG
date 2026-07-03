# Child 34 Playable Enforcement And Legacy Closeout Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the first playable-runtime migration set by adding scaffold/validator/CI enforcement and deleting proven-obsolete legacy direct paths that the migrated playables no longer need.

**Architecture:** Child 34 is the closeout child for the first playable-runtime set. It should run only after the shared skeleton, short-form migration, house-local promotion, and battle-family migration have all closed cleanly. The child must tighten repository enforcement so later AI or human playable additions follow one scaffold and validation path, then remove legacy direct launch/result residue only where prior children already proved production parity.

**Tech Stack:** TypeScript, Node scripts under `tools/`, `package.json`, CI/package scripts, tests, `npm run lint:plans`, `npm run typecheck`, `npm test`, `npm run build`

## Execution State

- Status: `not-started`
- Last Updated: `2026-07-03`
- Current Focus: `Pre-authored future child only. This child remains candidate-only until all earlier playable-runtime migration children close cleanly.`
- Next Step: `Recheck remaining legacy direct paths and enforcement gaps after Child 33 closes.`
- Verification: `Not run as part of this doc-only change`
- Notes: `Child 34 must not delete compatibility paths speculatively. It should only remove residue that earlier children have already made obsolete and verifiably unused.`

## Progress Log

- 2026-07-03
  - Summary: `Plan created for the playable-runtime enforcement and legacy closeout phase. Child 34 remains non-executable until earlier playable children prove migration parity.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Recheck enforcement gaps and obsolete launch/result branches after Child 33.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-03-child-34-playable-enforcement-and-legacy-closeout-spec.md`
- Shared contract spec:
  - `docs/superpowers/specs/2026-07-03-unified-playable-runtime-contract-spec.md`
- Weekly set plan:
  - `docs/superpowers/plans/2026-07-03-playable-runtime-migration-weekly-orchestration-plan.md`
- Playable plan template:
  - `docs/superpowers/plans/_playable-plan-template.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `The approved playable spec already requires scaffold, validator, and CI enforcement, but those repository-owned artifacts do not exist yet.`
  - `Legacy direct paths currently still include concrete interactive identifiers in src/main.ts and compatibility ownership in src/core/runtime/interactive-runtime.ts.`
  - `This child should remove only the residue proven obsolete by earlier children.`

## Implementation Scope

### In Scope

- add playable scaffold tooling
- add playable integration scaffold tooling
- add playable validation tooling
- wire validation into repository commands and CI-facing script entry points
- delete proven-obsolete direct launch/result branches after earlier migrations close
- add final regression coverage that enforces the repository playable contract
- update shared docs and change log for the first closed playable-runtime set

### Still Out Of Scope

- redoing earlier migration children because of unrelated feature requests
- adding new playable content beyond what earlier children already migrated
- broad repository CI redesign outside playable enforcement

## File Map

### Existing files to modify

- `package.json`
  - Add scaffold and validation command entry points.
- `src/main.ts`
  - Remove direct concrete launch/result branches proven obsolete by earlier playable children.
- `src/core/runtime/interactive-runtime.ts`
  - Remove legacy compatibility ownership that no longer owns production behavior.
- `tests/robustness.test.cjs`
  - Add final enforcement regressions.
- `docs/change-log.md`
  - Record scaffold/validator/legacy-closeout outcome.
- `docs/superpowers/specs/2026-07-03-unified-playable-runtime-contract-spec.md`
  - Sync any final enforcement naming if the implementation surface differs in a shared way.
- `docs/superpowers/plans/2026-07-03-child-34-playable-enforcement-and-legacy-closeout-plan.md`
  - Record execution progress and closeout.

### Existing files to read

- `tools/lint-superpowers-plans.mjs`
- `src/core/contracts/interactive-runtime.ts`
- `docs/superpowers/plans/_playable-plan-template.md`

### New files to create

- `tools/scaffold-playable.mjs`
  - Scaffold a new playable mechanic bundle into the repository-owned locations.
- `tools/scaffold-playable-integration.mjs`
  - Scaffold a new scenario-owned integration artifact into the repository-owned locations.
- `tools/validate-playables.mjs`
  - Validate mechanic artifacts, integration artifacts, trigger completeness, and runtime contract expectations.

## Verification Plan

- Targeted verification:
  - `node --test tests/robustness.test.cjs --test-name-pattern "playable scaffold|playable validator|playable runtime skeleton|interactive runtime no longer depends on legacy adapter-owned qte or story-battle ownership"`
- Required commands:
  - `npm run lint:plans`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`

## Task 1: Recheck Remaining Enforcement Gaps And Legacy Residue

**Files:**
- Modify: `docs/superpowers/plans/2026-07-03-child-34-playable-enforcement-and-legacy-closeout-plan.md`
- Read: `src/main.ts`
- Read: `src/core/runtime/interactive-runtime.ts`
- Read: `docs/superpowers/specs/2026-07-03-unified-playable-runtime-contract-spec.md`

- [ ] **Step 1: Reconfirm which enforcement artifacts are still missing**

Lock the scaffold/validator/CI surface against the actual post-Child-33 baseline.

- [ ] **Step 2: Reconfirm which direct paths are now obsolete**

Delete only the concrete legacy branches that earlier children have already replaced.

## Task 2: Add Scaffold And Validation Tooling

**Files:**
- Create: `tools/scaffold-playable.mjs`
- Create: `tools/scaffold-playable-integration.mjs`
- Create: `tools/validate-playables.mjs`
- Modify: `package.json`

- [ ] **Step 1: Add the playable mechanic scaffold command**

Make new playable mechanics enter the repository through one framework-owned path.

- [ ] **Step 2: Add the integration-instance scaffold command**

Make new scenario-owned playable integrations enter the repository through one framework-owned path.

- [ ] **Step 3: Add the playable validation command**

Validate mechanic artifacts, integration artifacts, trigger completeness, and outcome/handoff requirements.

## Task 3: Remove Proven-Obsolete Legacy Direct Paths

**Files:**
- Modify: `src/main.ts`
- Modify: `src/core/runtime/interactive-runtime.ts`
- Modify: `src/core/contracts/interactive-runtime.ts`

- [ ] **Step 1: Remove obsolete direct concrete launch/result branches**

Delete only the residue that no longer owns production behavior after earlier playable migrations.

- [ ] **Step 2: Keep any still-needed compatibility path explicit**

Do not pretend the migration is complete if a real compatibility seam still remains.

## Task 4: Add Final Enforcement Regressions And Artifact Sync

**Files:**
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/specs/2026-07-03-unified-playable-runtime-contract-spec.md` if implementation reveals shared naming drift

- [ ] **Step 1: Add red-to-green enforcement regressions**

Prove the scaffold and validator exist and that obsolete direct paths are gone where this child claims they are gone.

- [ ] **Step 2: Run the required verification commands**

Run:

```bash
npm run lint:plans
npm run typecheck
npm test
npm run build
```

Expected:

- `PASS`

## Exit Check

- [ ] Playable scaffold tooling exists.
- [ ] Playable integration scaffold tooling exists.
- [ ] Playable validation tooling exists.
- [ ] Obsolete direct launch/result branches are removed where migration parity is already proven.
- [ ] Shared docs are updated if boundaries changed.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
