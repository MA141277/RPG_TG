# Playable Plan Template

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace this line with the concrete playable outcome, for example: add one new playable, migrate one legacy playable, or extract one playable from a house/scene-local flow.

**Architecture:** Replace this line with the owned boundary, and explicitly say how this work satisfies the unified playable runtime contract without reopening unrelated runtime families.

**Tech Stack:** Replace this line with the relevant runtime, test, lint, and verification commands.

## Execution State

- Status: `waiting`
- Last Updated: `2000-01-01`
- Current Focus: `Waiting for promotion or start.`
- Next Step: `Open docs/superpowers/project-progress.md and confirm this playable child is executable.`
- Verification: `Not run`
- Notes: `Use waiting/running/blocked/completed-but-open/closed for new plans.`

## Progress Log

- 2000-01-01
  - Summary: `Plan created.`
  - Verification: `Not run`
  - Next: `Open docs/superpowers/project-progress.md before starting implementation.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-03-unified-playable-runtime-contract-spec.md`
- Plan governance spec:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`
- Additional host/runtime specs, if touched:
  - `docs/special-house-interface.md`
  - `docs/superpowers/specs/...`

## Plan Type

- Work mode: `replace-with-one`
  - `new-playable`
  - `legacy-playable-migration`
  - `house-scene-flow-extraction`
- Playable family: `replace-with-one`
  - `minigame`
  - `battle`
- Target playable ids:
  - `replace-with-playable-id`
- Target integration ids:
  - `replace-with-integration-id-or-ids`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `Record whether the spec is still valid against current code.`
  - `Record any scope narrowing before execution starts.`
  - `If the target currently lives in a house/scene/local overlay path, record the exact existing owner.`

## Contract Checklist

- Launch:
  - `playableId` launch exists or will be introduced.
  - `integrationId` resolution path is explicit.
  - trigger evaluation owner is explicit.
- Session:
  - active session carries `playableId`, `integrationId`, `family`, and `ownerContext`.
  - no authoritative state remains in ad hoc UI-only containers.
- Result and outcome:
  - mechanic emits `PlayableFactResult`.
  - integration owns `PlayableOutcomeConfig`.
  - outcome evaluation remains deterministic.
- Settlement and handoff:
  - settlement writes through unified runtime/game-state structures.
  - handoff and owner return rules are explicit.
  - `sessionToken` recovery semantics are covered if `resume-owner` is used.
- Authoring and enforcement:
  - mechanic/integration artifacts stay separated.
  - scaffold / validator / CI impact is either implemented now or recorded as an explicit dependency.

## Implementation Scope

### In Scope

- Replace with the concrete playable boundary work that will be executed now.

### Still Out Of Scope

- Unrelated `main.ts` slimming outside the playable-owned seam.
- Unrelated house/module redesign outside the target playable extraction.
- New scenario pack/editor features unless this plan explicitly owns them.
- Rewriting multiple unrelated playables in one batch unless the spec explicitly promotes that scope.

## Host Ownership Snapshot

If the playable already exists in a host flow, record the pre-migration owner:

- Current host entry:
  - `path/to/current-entry`
- Current session owner:
  - `path/to/current-session-owner`
- Current result/settlement owner:
  - `path/to/current-settlement-owner`
- Current return path:
  - `resume-owner | reenter-owner | close-only | unknown`
- Legacy branches expected to disappear after migration:
  - `path/to/branch-or-helper`

## File Map

### Existing files to modify

- `path/to/file`
  - Why it changes.

### Existing files expected to be deleted

- `path/to/file`

### New files to create

- `path/to/file`
  - Why it exists.

## Verification Plan

- Targeted verification:
  - `Prove runtime resolves playable by playableId and exactly one integrationId.`
  - `Prove fact-result -> outcome-config -> settlement -> handoff path works.`
  - `Prove return reaches the correct owner/session for this plan's host flow.`
  - `Prove no new feature-specific branch remains in main.ts for this playable path.`
- Required commands:
  - `npm run lint:plans`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
- Allowed doc-only exception:
  - `Record "Not run as part of this doc-only change" only when production code is untouched.`

## Task 1: Baseline And Legacy Path Mapping

**Files:**
- Modify: `docs/superpowers/plans/<real-plan>.md`
- Read: `docs/superpowers/specs/2026-07-03-unified-playable-runtime-contract-spec.md`
- Read: `path/to/current-playable-or-host-flow`

- [ ] **Step 1: Recheck the target against the latest code and lock the active owner path**

Record the current launch path, state owner, settlement owner, and return path before any refactor begins.

- [ ] **Step 2: Narrow the active child boundary**

Explicitly record what this plan will not absorb, especially unrelated house/scene/runtime redesign.

## Task 2: Normalize Registry And Launch Ownership

**Files:**
- Modify: `path/to/playable-registry`
- Modify: `path/to/runtime-launch-owner`
- Read: `path/to/legacy-launch-branch`

- [ ] **Step 1: Introduce or wire the playable definition through the unified registry**

Remove direct concrete import assumptions from host entry points where this plan owns that migration.

- [ ] **Step 2: Introduce explicit integration-instance resolution**

Ensure the runtime can resolve exactly one `integrationId` for this playable use site.

- [ ] **Step 3: Move trigger-to-launch mapping behind the framework-owned evaluator seam**

Do not leave trigger checks scattered in house/scene/view code.

## Task 3: Normalize Session, Presenter, And Mechanic Boundaries

**Files:**
- Modify: `path/to/playable-session-owner`
- Modify: `path/to/playable-presenter-owner`
- Read: `path/to/legacy-overlay-or-local-session`

- [ ] **Step 1: Move authoritative mechanic state into the active playable session**

Keep feature-specific state under the unified session shape rather than UI-only containers.

- [ ] **Step 2: Expose presenter output through the shared playable shell contract**

Preserve family-specific view semantics without bypassing the shared runtime/presenter surface.

## Task 4: Normalize Outcome, Settlement, And Owner Return

**Files:**
- Modify: `path/to/playable-settlement-owner`
- Modify: `path/to/integration-config-owner`
- Read: `path/to/legacy-result-or-return-branch`

- [ ] **Step 1: Convert mechanic-local win/fail logic into fact-result plus integration-owned outcome config**

Keep story/scenario semantics out of the playable mechanism layer.

- [ ] **Step 2: Normalize rewards, punishments, and handoff through unified settlement**

Do not let host flows perform ad hoc write-back for this playable after migration.

- [ ] **Step 3: Verify return-to-owner behavior**

If `resume-owner` is used, prove `sessionToken` recovery works. If `reenter-owner` is used, prove normalized owner identity is sufficient.

## Task 5: Enforcement, Tests, And Artifact Sync

**Files:**
- Modify: `tests/...`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/specs/...` or `docs/special-house-interface.md` if shared contracts moved

- [ ] **Step 1: Add or update targeted regression coverage**

Cover launch resolution, session ownership, outcome evaluation, settlement, and handoff.

- [ ] **Step 2: Update repository artifacts if shared boundaries changed**

Sync shared specs, change log, and any required validator/scaffold artifacts that this plan owns.

- [ ] **Step 3: Run the required verification commands**

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

- [ ] The target playable is launched through the unified playable runtime rather than a host-local permanent branch.
- [ ] One resolved `integrationId` governs outcome, settlement, and handoff for the migrated or new use site.
- [ ] The correct owner/scene/session return path is provable for this playable.
- [ ] Mechanic and integration responsibilities remain separated.
- [ ] Shared docs are updated if cross-module boundaries changed.
- [ ] Project progress sync is updated if child state changed.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

## Child Closeout

- Closed Child: `Replace when closing.`
- Parent Task: `Replace when closing.`
- Parent Stage: `Replace when closing.`
- Closeout Status: `closed`
- Project Progress Synced: `yes/no`
- Next Child: `Replace when closing.`
- Next Child Status: `waiting/running/blocked/none`
- Next Required Action: `Replace when closing.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `Replace when closing.`
- Push Status: `success/failure/not-pushed`
- Push Commit: `commit-sha-or-none`
- Resume From: `Replace when closing.`
