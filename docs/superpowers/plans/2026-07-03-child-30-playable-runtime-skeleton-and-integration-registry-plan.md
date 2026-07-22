# Child 30 Playable Runtime Skeleton And Integration Registry Plan

> **Legacy Governance Context:** This document was authored under the retired `weekly plan / weekly set / weekly orchestration` model. Keep its technical scope, but treat any weekly-governance references as historical context only. If this legacy artifact is explicitly resumed, use `docs/superpowers/project-progress.md`; otherwise use `docs/blueprints/project-progress.md` for current repository work.

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce the shared playable runtime skeleton, unified playable registry, and scenario-owned integration-instance registry so later playable migrations can resolve by `playableId` and exactly one `integrationId`.

**Architecture:** Child 30 is the first executable child in the future playable-runtime queue. It must establish the shared shell and registry seams without migrating every legacy playable at once. The child should create the minimum contract/registry/runtime/validation surfaces needed for later migrations while preserving current production behavior behind compatibility paths until Child 31 and later children promote concrete playables onto the new skeleton.

**Tech Stack:** TypeScript, `src/core/contracts`, `src/core/runtime`, `src/core/registry`, `src/domain`, `tests/robustness.test.cjs`, `npm run lint:plans`, `npm run typecheck`, `npm test`, `npm run build`

## Execution State

- Status: `completed`
- Last Updated: `2026-07-03`
- Current Focus: `Child 30 is closed. The shared playable contract/registry/runtime skeleton now exists in code while concrete playable migration remains deferred to later children.`
- Next Step: `Run a fresh baseline recheck for Child 31 before promoting covered playable migration onto the new skeleton.`
- Verification: `npm run lint:plans`, `npm run typecheck`, `npm test`, `npm run build`
- Notes: `Child 30 stayed inside skeleton scope. It did not migrate activity-qte/city-begging behavior, promote house-local mechanics, or move story-battle onto definition-driven reducers in the same batch.`

## Progress Log

- 2026-07-03
  - Summary: `Plan created from the unified playable runtime contract spec. Child 30 remains non-executable until the fresh playable-runtime weekly set promotes it after the current active weekly set closes.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Recheck current interactive-runtime and launch ownership before promotion.`
- 2026-07-03
  - Summary: `Completed the Child 30 baseline recheck and implementation batch. Added shared playable contracts, builtin playable definition/integration registries, a launch-normalization runtime seam, and interactive-runtime compatibility wiring so covered launch paths can resolve to one integrationId without migrating every playable in the same child. Narrowed main.ts by switching city-begging launch onto playableId-based launch creation while preserving legacy interactive action paths.`
  - Verification: `npm run lint:plans`, `npm run typecheck`, `npm test`, `npm run build`
  - Next: `Keep Child 31 non-executable until a fresh baseline recheck promotes covered playable migration onto the new skeleton.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-03-child-30-playable-runtime-skeleton-and-integration-registry-spec.md`
- Shared contract spec:
  - `docs/superpowers/specs/2026-07-03-unified-playable-runtime-contract-spec.md`
- Weekly set plan:
  - `docs/superpowers/plans/2026-07-03-playable-runtime-migration-weekly-orchestration-plan.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `At promotion time, the current repository still routed activity-qte, city-begging, and story-battle through src/core/runtime/interactive-runtime.ts rather than one definition-driven playable runtime.`
  - `main.ts still knew concrete interactive action ids and launch paths, so Child 30 needed a shared runtime skeleton before later children could shrink those branches safely.`
  - `House-local accounting and compounding flows remain out of scope for this child.`

## Implementation Scope

### In Scope

- define shared playable runtime contracts
- define unified playable registry and integration-instance registry
- add minimum launch normalization and session/result/settlement types
- add minimum trigger-evaluation and validation seams required for later children
- add regression coverage that proves the new skeleton exists without requiring all legacy migrations to finish
- update shared docs and change log if the skeleton changes repository-wide boundaries

### Still Out Of Scope

- migrating `activity-qte` and `city-begging` behavior onto the new skeleton
- migrating `grain-accounting` or `medicine-compounding`
- migrating `story-battle`
- deleting `interactive-runtime` compatibility paths before later children prove parity
- full scaffold/validator/CI enforcement closeout

## File Map

### Existing files to modify

- `src/main.ts`
  - Narrow launch ownership only as needed to call the new playable runtime entry seam without forcing full migration in this child.
- `src/core/contracts/interactive-runtime.ts`
  - Keep compatibility clear if shared identifiers or transition seams need bridging.
- `src/core/runtime/interactive-runtime.ts`
  - Preserve compatibility while deferring concrete playable migration to later children.
- `src/domain/game-state.ts`
  - Add shared runtime-owned playable session carrier only if the new skeleton needs it.
- `tests/robustness.test.cjs`
  - Add contract and ownership regressions for the new registry/runtime skeleton.
- `docs/change-log.md`
  - Record the new runtime skeleton boundary.
- `docs/superpowers/plans/2026-07-03-child-30-playable-runtime-skeleton-and-integration-registry-plan.md`
  - Record execution progress and closeout.

### Existing files to read

- `src/application/activity/activity-qte-runtime.ts`
- `src/application/minigames/city-begging-minigame.ts`
- `src/application/story-battle/story-battle-runtime.ts`
- `src/core/runtime/runtime-dispatch.ts`
- `src/core/runtime/state-sync-runtime.ts`

### New files to create

- `src/core/contracts/playable-runtime.ts`
  - Shared `PlayableId`, `PlayableFamily`, `PlayableIntegrationId`, launch/session/result/outcome/settlement contracts.
- `src/core/registry/playable-definition-registry.ts`
  - One framework-owned install/lookup surface for playable definitions.
- `src/core/registry/playable-integration-registry.ts`
  - One framework-owned install/lookup surface for scenario-owned integration instances.
- `src/core/runtime/playable-runtime.ts`
  - Shared runtime entry that normalizes launch to one `integrationId` and drives createSession/reduce/present/settle ownership.
- `src/domain/playables/playable-session.ts`
  - Shared runtime-owned session types if domain extraction is cleaner than keeping them under core contracts.

## Verification Plan

- Targeted verification:
  - `node --test tests/robustness.test.cjs --test-name-pattern "playable runtime skeleton|playable registry|integration registry|playable launch normalization|playable settlement contract"`
- Required commands:
  - `npm run lint:plans`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`

## Task 1: Audit The Current Interactive And Playable-Like Entry Points

**Files:**
- Modify: `docs/superpowers/plans/2026-07-03-child-30-playable-runtime-skeleton-and-integration-registry-plan.md`
- Read: `src/main.ts`
- Read: `src/core/runtime/interactive-runtime.ts`
- Read: `src/core/contracts/interactive-runtime.ts`
- Read: `docs/superpowers/specs/2026-07-03-unified-playable-runtime-contract-spec.md`

- [x] **Step 1: Recheck the current covered launch/dispatch/return seams**

Record the current `activity-qte`, `city-begging`, and `story-battle` launch and result ownership before implementing the new skeleton.

- [x] **Step 2: Lock the child boundary after baseline recheck**

Confirm that Child 30 owns only the shared skeleton and not concrete playable migration.

## Task 2: Add Shared Playable Contracts And Registries

**Files:**
- Create: `src/core/contracts/playable-runtime.ts`
- Create: `src/core/registry/playable-definition-registry.ts`
- Create: `src/core/registry/playable-integration-registry.ts`
- Modify: `src/domain/game-state.ts`

- [x] **Step 1: Add the shared playable contract family**

Define `PlayableId`, `PlayableFamily`, `PlayableIntegrationId`, owner context, session, command, fact-result, outcome config, and settlement types in one shared contract surface.

- [x] **Step 2: Add the playable definition registry**

Install one framework-owned lookup seam for reusable playable mechanics.

- [x] **Step 3: Add the integration-instance registry**

Install one framework-owned lookup seam for scenario-owned `integrationId` records with owner defaults, trigger config, and outcome config.

## Task 3: Add The Minimum Playable Runtime Skeleton

**Files:**
- Create: `src/core/runtime/playable-runtime.ts`
- Modify: `src/main.ts`
- Modify: `src/core/runtime/interactive-runtime.ts`

- [x] **Step 1: Add a shared launch normalization seam**

Normalize external launch requests to exactly one `integrationId` before session creation.

- [x] **Step 2: Add the shared runtime session/present/settle ownership seam**

Create a runtime entry that can own lifecycle state without requiring all legacy playables to migrate immediately.

- [x] **Step 3: Preserve compatibility with current interactive-runtime-owned paths**

Do not remove or break current covered behavior in this child.

## Task 4: Add Skeleton-Level Regressions And Artifact Sync

**Files:**
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/specs/2026-07-03-unified-playable-runtime-contract-spec.md` if implementation reveals a shared contract drift

- [x] **Step 1: Add red-to-green contract regressions**

Prove the playable runtime skeleton, registries, and integration normalization seams exist and are wired through one shared owner path.

- [x] **Step 2: Sync shared artifacts if the implemented skeleton changes shared boundaries**

Update the spec and change log before closeout if the runtime shape moves.

- [x] **Step 3: Run the required verification commands**

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

- [x] One shared playable contract family exists.
- [x] One playable definition registry exists.
- [x] One playable integration-instance registry exists.
- [x] The runtime can normalize launch to one `integrationId`.
- [x] Current production behavior remains compatible for later migration children.
- [x] Shared docs are updated if boundaries changed.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

