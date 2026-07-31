# Playable Family Removal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the `family` field from the playable runtime contract, let the editor create playable instances from all playable definitions, and keep runtime execution centered on playable instances rather than legacy minigame-vs-battle categories.

**Architecture:** The change removes `family` from `PlayableDefinition`, launch/session/presenter contracts, and registry validation. Flow-specific behavior will no longer be inferred from `family === "flow"`; it will be resolved by explicit flow-definition presence. Script-editor authoring/export will stop filtering by runtime family and will instead treat builtin playables as a single selectable catalog for playable-instance authoring.

**Tech Stack:** TypeScript runtime/editor code, Node test runner (`node --test`), repo build helpers (`pnpm run build:test`, `npm run typecheck`, `npm run build`), plan lint (`npm run lint:plans`).

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-31`
- Current Focus: `Implementation is complete locally; remaining work is governance sync / optional broader doc cleanup / push.`
- Next Step: `If needed, continue widening docs and scaffold tooling that still mention family, then decide whether to push this batch.`
- Verification: `build:test passed; targeted playable/editor/audio/runtime tests passed; typecheck passed; build passed; lint:plans is blocked by unrelated docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md`
- Notes: `This child is intentionally scoped to playable contract/runtime/editor convergence only; it does not redesign settlement semantics beyond what family removal forces.`

## Progress Log

- 2026-07-31
  - Summary: `Opened the playable family removal child and locked scope around contract removal, editor selection convergence, and runtime compatibility cleanup.`
  - Verification: `Not run`
  - Next: `Add failing tests for contract removal and story-battle/editor instance support.`
- 2026-07-31
  - Summary: `Removed family from playable contracts, session/presenter projections, flow dispatch checks, script-editor playable option filtering, and battle-audio gating; added focused regression coverage for family removal and playable option convergence.`
  - Verification: `pnpm run build:test`; `node --test tests/playable-family-removal.test.cjs tests/playable-runtime-registries.test.cjs tests/flow-playable-runtime.test.cjs tests/flow-playable-presenter.test.cjs`; `node --test tests/event-owned-playable-completion.test.cjs tests/event-continuation-runtime.test.cjs tests/audio-manager.test.cjs tests/medicine-compounding-runtime-status.test.cjs tests/mod-runtime-contribution.test.cjs`; `pnpm run typecheck`; `pnpm run build`; `pnpm run lint:plans` failed only because unrelated docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md is malformed`
  - Next: `Decide whether to broaden the cleanup into scaffold/spec/tooling references to family, or stop at the runtime/editor contract slice and push this batch.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-03-unified-playable-runtime-contract-spec.md`
- Plan governance spec:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`
- Additional shared docs expected to change:
  - `docs/change-log.md`

## Plan Type

- Work mode: `legacy-playable-migration`
- Playable family: `removed`
- Target playable ids:
  - `activity-qte`
  - `city-begging`
  - `grain-accounting`
  - `medicine-compounding`
  - `story-battle`
  - `building-flow`
- Target integration ids:
  - `all builtin playable integration ids`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `story-battle` is still treated as `family: "battle"` while the editor playable-instance module only accepts `family === "minigame"`.
  - Flow launch/exit/action logic still depends on `family === "flow"` rather than an explicit flow-definition lookup.
  - Several tests still assert runtime/session/presenter family fields directly and must be rewritten to assert the new behavior boundary instead.

## Contract Checklist

- Launch:
  - `playableId` launch remains required.
  - `integrationId` resolution remains explicit and preserved.
  - authoring/export must no longer reject `story-battle` because of a removed family category.
- Session:
  - active session keeps `playableId`, `integrationId`, `ownerContext`, `status`, and `state`.
  - `family` is removed from session shape and from interactive compatibility wrappers.
- Result and outcome:
  - mechanics still emit `PlayableFactResult`.
  - integrations still own `PlayableOutcomeConfig`.
- Settlement and handoff:
  - existing settlement shell keeps integration-owned handoff behavior intact.
- Authoring and enforcement:
  - editor playable selection becomes definition-driven rather than category-driven.
  - runtime flow dispatch uses explicit flow-definition presence instead of family tagging.

## Implementation Scope

### In Scope

- Remove `family` from playable runtime contracts, registries, compatibility sessions, and presenter models.
- Replace `family === "flow"` checks with explicit flow-definition/session checks.
- Let script-editor playable instance authoring/export use all builtin playables.
- Update targeted runtime/editor tests and shared docs touched by the contract change.

### Still Out Of Scope

- Settlement group UI redesign beyond already requested convergence.
- New playable instance editor UX beyond exposing the full playable catalog.
- Deleting all legacy interactive compatibility adapters if they are still needed for existing runtime entry points.
- Reworking house/menu/event launch chains beyond what is needed for playable-instance-only convergence.

## Host Ownership Snapshot

- Current host entry:
  - `src/modules/script-editor/application/minigame-binding-authoring.ts`
  - `src/modules/script-editor/application/runtime-pack-export.ts`
- Current session owner:
  - `src/core/runtime/playable-runtime.ts`
  - `src/core/runtime/interactive-runtime.ts`
- Current result/settlement owner:
  - `src/core/runtime/playable-runtime.ts`
- Current return path:
  - `resume-owner | reenter-owner | close-only`
- Legacy branches expected to disappear after migration:
  - `definition.family === "minigame"` playable filtering
  - `launch.family === "flow"` and `session.family === "flow"` dispatch checks
  - session/presenter/audio checks keyed off battle/minigame family tags

## File Map

### Existing files to modify

- `src/core/contracts/playable-runtime.ts`
  - Remove `PlayableFamily` and delete `family` from shared playable contracts.
- `src/core/registry/playable-definition-registry.ts`
  - Remove builtin definition family tags and validation dependence.
- `src/core/registry/builtin-playable-definition-registry.ts`
  - Remove builtin family tags.
- `src/core/runtime/playable-runtime.ts`
  - Replace family-driven launch/action/exit logic with explicit playables/flow checks.
- `src/core/runtime/interactive-runtime.ts`
  - Stop projecting family onto compatibility sessions.
- `src/core/runtime/playable-runtime-registries.ts`
  - Remove `family` from playable definition shape validation.
- `src/modules/script-editor/application/minigame-binding-authoring.ts`
  - Expose all playable definitions as playable-instance options.
- `src/modules/script-editor/application/runtime-pack-export.ts`
  - Export editor-authored playable definitions without family checks.
- `src/application/playables/flow/flow-playable-definition.ts`
  - Remove `family` from flow session construction.
- `src/application/playables/flow/flow-playable-presenter.ts`
  - Remove `family` from presenter output.
- `src/application/audio/audio-manager.ts`
  - Replace battle-family gate with a playable-id-aware battle check.
- `tests/...`
  - Update or add targeted tests for contract removal and playable selection/export behavior.
- `docs/change-log.md`
  - Record the shared playable contract change.

### Existing files expected to be deleted

- `none`

### New files to create

- `docs/superpowers/plans/2026-07-31-playable-family-removal-plan.md`
  - Execution controller for this child.

## Verification Plan

- Targeted verification:
  - `PlayableDefinition`, launch/session/presenter contracts compile and work without `family`.
  - editor playable authoring lists `story-battle` and other builtin playables together.
  - runtime export no longer rejects `story-battle` as an “unknown minigame”.
  - flow launch/action/exit still work after replacing family checks.
- Required commands:
  - `npm run lint:plans`
  - `pnpm run build:test`
  - `node --test tests/playable-runtime-registries.test.cjs tests/flow-playable-runtime.test.cjs tests/flow-playable-presenter.test.cjs tests/event-owned-playable-completion-parity.test.cjs`
  - `npm run typecheck`
  - `npm run build`

## Task 1: Lock The Contract And Failing Coverage

**Files:**
- Modify: `docs/superpowers/plans/2026-07-31-playable-family-removal-plan.md`
- Modify: `tests/playable-runtime-registries.test.cjs`
- Modify: `tests/flow-playable-runtime.test.cjs`
- Modify: `tests/flow-playable-presenter.test.cjs`
- Modify: `tests/event-owned-playable-completion-parity.test.cjs`

- [ ] **Step 1: Write failing tests that remove family assumptions**

Assert that:

```js
assert.equal("family" in launchedSession, false);
assert.equal("family" in presenter, false);
assert.ok(
  listScriptEditorBuiltinMinigamePlayableOptions().some(
    (option) => option.id === "story-battle"
  )
);
```

- [ ] **Step 2: Run the targeted tests to verify they fail for the expected reason**

Run:

```bash
pnpm run build:test
node --test tests/playable-runtime-registries.test.cjs tests/flow-playable-runtime.test.cjs tests/flow-playable-presenter.test.cjs tests/event-owned-playable-completion-parity.test.cjs
```

Expected:

- `FAIL` because `family` still exists and `story-battle` is still filtered out of editor options.

## Task 2: Remove Family From Shared Playable Contracts

**Files:**
- Modify: `src/core/contracts/playable-runtime.ts`
- Modify: `src/core/registry/playable-definition-registry.ts`
- Modify: `src/core/registry/builtin-playable-definition-registry.ts`
- Modify: `src/core/runtime/playable-runtime-registries.ts`

- [ ] **Step 1: Delete PlayableFamily and all family fields from shared contract types**

Keep:

```ts
export type PlayableDefinition = {
  id: PlayableId;
  commandPrefix: string;
  legacyInteractiveKind?: string | undefined;
};
```

- [ ] **Step 2: Update registry defaults and validation to accept family-less definitions**

Keep registry validation down to:

```ts
return (
  typeof candidate.id === "string" &&
  typeof candidate.commandPrefix === "string"
);
```

## Task 3: Replace Runtime Family Branches With Explicit Playable Checks

**Files:**
- Modify: `src/core/runtime/playable-runtime.ts`
- Modify: `src/core/runtime/interactive-runtime.ts`
- Modify: `src/application/playables/flow/flow-playable-definition.ts`
- Modify: `src/application/playables/flow/flow-playable-presenter.ts`
- Modify: `src/application/audio/audio-manager.ts`

- [ ] **Step 1: Replace launch/action/exit flow branching with explicit flow-definition presence**

Use a helper boundary like:

```ts
function resolveActiveFlowPlayable(
  playableId: PlayableId,
  flowPlayablesById?: Record<string, FlowPlayableDefinition>
): FlowPlayableDefinition | null {
  return flowPlayablesById?.[playableId] ?? null;
}
```

- [ ] **Step 2: Remove family from session/presenter construction and battle audio checks**

Keep battle detection explicit:

```ts
return (
  state.runtime.playableSession?.status === "active" &&
  state.runtime.playableSession.playableId === "story-battle"
);
```

## Task 4: Reopen Editor Authoring To All Playables

**Files:**
- Modify: `src/modules/script-editor/application/minigame-binding-authoring.ts`
- Modify: `src/modules/script-editor/application/runtime-pack-export.ts`

- [ ] **Step 1: Stop filtering builtin playables by removed family**

Use:

```ts
const BUILTIN_PLAYABLE_DEFINITIONS = Array.from(
  builtinPlayableDefinitionRegistry.entries()
);
```

- [ ] **Step 2: Export editor-authored playable definitions without minigame-only rejection**

Keep export acceptance to:

```ts
const definition = builtinPlayableDefinitionRegistry.get(playableId);
if (definition == null) {
  // diagnostic
}
```

## Task 5: Sync Tests And Shared Docs

**Files:**
- Modify: `tests/playable-runtime-registries.test.cjs`
- Modify: `tests/flow-playable-runtime.test.cjs`
- Modify: `tests/flow-playable-presenter.test.cjs`
- Modify: `tests/event-owned-playable-completion-parity.test.cjs`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-07-31-playable-family-removal-plan.md`

- [ ] **Step 1: Update assertions to the new contract boundary**

Assert behavior through:

```js
assert.equal(session.playableId, "story-battle");
assert.equal(result.launch.playableId, "activity-qte");
assert.equal(result.launch.integrationId, "playable.activity-qte.scene.default");
```

instead of `family` equality checks.

- [ ] **Step 2: Record the shared contract change in docs**

Add a short entry to `docs/change-log.md` describing that playable runtime contract no longer carries `family`, and editor playable-instance selection is definition-driven.

- [ ] **Step 3: Run required verification and update execution state**

Run:

```bash
npm run lint:plans
pnpm run build:test
node --test tests/playable-runtime-registries.test.cjs tests/flow-playable-runtime.test.cjs tests/flow-playable-presenter.test.cjs tests/event-owned-playable-completion-parity.test.cjs
npm run typecheck
npm run build
```

Expected:

- `PASS`

## Exit Check

- [ ] Playable contracts no longer carry `family`.
- [ ] Script-editor playable-instance creation can select `story-battle` together with other builtin playables.
- [ ] Runtime flow dispatch no longer depends on `family === "flow"`.
- [ ] Session/presenter/audio compatibility checks use explicit playable semantics instead of category tags.
- [ ] Shared docs are updated for the contract change.
- [ ] Project progress sync is updated if child state changed.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

## Child Closeout

- Closed Child: `Playable Family Removal`
- Parent Task: `Playable Runtime Convergence`
- Parent Stage: `Playable Runtime Cleanup`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `run final verification, sync progress, and push if requested`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-31-playable-family-removal-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then continue docs/superpowers/plans/2026-07-31-playable-family-removal-plan.md from the first unchecked step.`
