# Playable Minigame Independence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `city-begging` and `grain-accounting` the first two fully independent, cross-project-portable minigame slices so they run through shared playable runtime ownership, keep their own logic/resources in self-contained directories, and settle through unified event/settlement routing.

**Architecture:** Keep minigame gameplay logic independent from host-specific business flow and co-locate minigame-owned code, texts/config, and assets inside package-local directories. Launch context stays outside the minigame, runtime session and UI stay under shared playable ownership, and minigame completion is translated into `settlement` plus optional follow-up `event` rather than direct persistent mutation or host-private navigation.

**Tech Stack:** TypeScript runtime modules under `src/core` and `src/application`, JS UI rendering under `src/ui`, scriptable regression coverage in `tests/robustness.test.cjs`, and governance verification with `pnpm run lint:plans`.

## Execution State

- Status: `running`
- Last Updated: `2026-08-02`
- Current Focus: `Activity-qte first migration slice: canonical src/playables/activity-qte package landed, legacy application definition path removed, and host-side action dispatch now routes through shared playable requests.`
- Next Step: `Widen the shared shell/runtime contract until src/core/runtime/playable-runtime.ts no longer owns direct activity-qte lifecycle branches, then continue converging the remaining runnable playables onto the same canonical package rule.`
- Verification: `node node_modules/typescript/bin/tsc --noEmit -p tsconfig.json; node node_modules/typescript/bin/tsc -p tsconfig.test.json; node --test tests/robustness.test.cjs --test-name-pattern "canonical shell package exists for activity-qte|activity qte runtime no longer imports the legacy application playable definition path|main.ts routes activity qte actions through shared playable requests instead of interactive action ids|child 30 playable definition registry installs covered builtin playables without family boundaries|child 31 playable runtime closes activity qte through shared playable session exit|child 34 removes only the obsolete interactive launch helper while keeping remaining active compatibility ids|activity qte shell routes board and command buttons into shared playable runtime actions|activity qte loop keeps fortune-board sessions ticking through interactive runtime"; pnpm run lint:plans`
- Notes: `This plan is now explicitly resumed for the unified playable-shell end state. The current batch intentionally does not claim full activity-qte migration completion because playable-runtime still owns direct activity-qte lifecycle branches.`

## Progress Log

- 2026-07-31
  - Summary: `Authored the implementation plan from the approved playable minigame independence spec for city-begging and grain-accounting.`
  - Verification: `pnpm run lint:plans`
  - Next: `Choose execution mode, then begin failing tests for shared playable settlement/event routing and the two reference minigames.`
- 2026-07-31
  - Summary: `Added failing tests that require city-begging completion to emit shared settlement payload and that reject direct persistence ownership inside the city-begging and grain-accounting local definition modules.`
  - Verification: `pnpm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "playable runtime routes city-begging completion through a shared settlement payload|reference minigame implementations do not keep direct persistence ownership in their local definition modules|city-begging|grain-accounting"`
  - Next: `Implement shared playable result routing, then migrate city-begging and grain-accounting off local persistence ownership so the new failures turn green.`
- 2026-07-31
  - Summary: `Introduced shared playable result routing for city-begging completion, extracted city-begging runtime/view/assets into a builtin package with compat re-exports, and moved grain-accounting onto the same builtin package seam so the legacy definition paths no longer own direct persistence helpers.`
  - Verification: `pnpm run build:test; pnpm run typecheck; node -e direct verification for settlementPresent/settlementEffectsArray/sessionCleared/cityWrapperClean/grainWrapperClean`
  - Next: `Finish shrinking package-internal persistence ownership for grain-accounting and city-begging so settlement/event routing, not package-local mutation helpers, becomes the sole persistent write path.`
- 2026-07-31
  - Summary: `Removed the last direct persistence ownership from builtin city-begging and grain-accounting completion, taught interactive runtime to preserve routed settlement payloads, and finished the grain-accounting package shell with package-local texts/assets manifests so both reference minigames are portable builtin slices.`
  - Verification: `pnpm run build:test; pnpm run typecheck; node -e direct verification for citySettlementPresent/citySessionCleared/cityCommittedPlayerStatus/grainSettlementPresent/grainSessionCleared`
  - Next: `Leave this legacy plan waiting until formally admitted, or reuse the same package contract to migrate the next playable slice.`
- 2026-08-02
  - Summary: `Started the activity-qte migration onto the final unified playable-shell path by creating src/playables/activity-qte, deleting the retired application/playables definition file, switching authored commandPrefix values to playable.activity-qte.*, and routing host-side activity-qte tick/action/stop/exit requests through shared playable requests.`
  - Verification: `node node_modules/typescript/bin/tsc --noEmit -p tsconfig.json; node node_modules/typescript/bin/tsc -p tsconfig.test.json; node --test tests/robustness.test.cjs --test-name-pattern "canonical shell package exists for activity-qte|activity qte runtime no longer imports the legacy application playable definition path|main.ts routes activity qte actions through shared playable requests instead of interactive action ids|child 30 playable definition registry installs covered builtin playables without family boundaries|child 31 playable runtime closes activity qte through shared playable session exit|child 34 removes only the obsolete interactive launch helper while keeping remaining active compatibility ids|activity qte shell routes board and command buttons into shared playable runtime actions|activity qte loop keeps fortune-board sessions ticking through interactive runtime"`
  - Next: `Replace the remaining direct activity-qte lifecycle ownership in playable-runtime with a widened shared shell/runtime contract instead of leaving runtime-local special branches in place.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-31-playable-minigame-independence-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `The approved spec remains aligned with current code: playable definitions/integrations already exist, but city-begging and grain-accounting still keep host-local or transitional ownership seams, and their owned resources are not yet packaged for portability.`
  - `Legacy docs/superpowers progress remains explicitly resumed for the separate 2026-07-28 person attribute-group child, so this new plan stays waiting until explicitly executed.`

## Implementation Scope

### In Scope

- Add a shared minigame completion contract that translates runtime results into required `settlement` plus optional follow-up `event`.
- Make `city-begging` an external-entry reference slice that is fully runtime-owned and UI-overlay-only.
- Make `grain-accounting` a host-return reference slice that is fully runtime-owned and returns through shared routing rather than host-private completion logic.
- Move minigame-owned code and resources toward self-contained package directories that are suitable for later cross-project transplantation.
- Tighten regression coverage and update change-log documentation for the new minigame independence rules.

### Still Out Of Scope

- Full playable template authoring UX.
- Creator-defined custom minigames in scenario packs.
- Broad migration of every other builtin minigame or battle/flow slice.
- Reopening unrelated layout/editor work currently tracked by other legacy or blueprint artifacts.

## File Map

### Existing files to modify

- `src/core/contracts/playable-runtime.ts`
  - Extend the shared completion contract so minigame results can carry standardized settlement/event routing payloads.
- `src/core/runtime/playable-runtime.ts`
  - Normalize launch/completion handling for the two reference minigames under shared runtime ownership.
- `src/core/runtime/runtime-dispatch.ts`
  - Consume the new playable completion routing output and keep persistent writes on the shared settlement path.
- `src/core/runtime/runtime-settlement.ts`
  - Apply any new routed minigame settlement carrier through the canonical runtime settlement seam.
- `src/application/playables/city-begging/city-begging-definition.ts`
  - Remove host/shell-owned completion ownership and emit shared playable result data instead.
- `src/application/playables/grain-accounting/grain-accounting-definition.ts`
  - Remove house-private result ownership and emit shared playable result data instead.
- `src/ui/views/minigames/city-begging-minigame-view.ts`
  - Either migrate this view into the minigame package or leave a thin re-export/compat shell while ownership moves into the package.
- `src/application/events/event-playable-runtime.ts`
  - Keep event-owned playable completion consumption aligned with the new shared contract.
- `src/ui/views/playables/house-playable-overlay.ts`
  - Render the host-return slice from shared playable session data without owning minigame business logic.
- `src/ui/app-render.ts`
  - Keep rendering sourced from shared playable session state and overlay composition only.
- `src/main.ts`
  - Thin any remaining direct city-begging or grain-accounting lifecycle control if present; avoid adding new business branches.
- `tests/robustness.test.cjs`
  - Add or update regression coverage for shared playable completion routing, city-begging independence, and grain-accounting independence.
- `docs/change-log.md`
  - Record the shared minigame independence contract and the two reference slice migrations.

### Existing files expected to be read carefully

- `docs/blueprints/playable-runtime-custom-minigame-planned-todo.md`
  - Preserve the already-recorded runtime direction and avoid reintroducing transitional ownership.
- `src/application/city-menu/city-menu-playable-launch.ts`
  - Keep city/menu launch aligned with the shared playable launch contract.
- `src/application/events/event-route-command-dispatch.ts`
  - Keep `launchPlayable` routed through the shared runtime rather than per-caller branches.
- `src/application/city/city-building-house-runtime-adapter.ts`
  - Verify any host-return seam stays adapter-only and does not reacquire minigame business logic.

### New files to create

- `src/core/runtime/playable-result-routing.ts`
  - Centralize translation from raw minigame completion data into shared runtime `settlement` plus optional follow-up `event`.
- `src/application/playables/builtin/city-begging/index.ts`
  - Package-local export surface for the city-begging slice.
- `src/application/playables/builtin/grain-accounting/index.ts`
  - Package-local export surface for the grain-accounting slice.
- `src/application/playables/builtin/city-begging/assets/`
  - Home for city-begging-owned images/audio/animation assets or explicit resource manifests.
- `src/application/playables/builtin/grain-accounting/assets/`
  - Home for grain-accounting-owned images/audio/animation assets or explicit resource manifests.
- `src/application/playables/builtin/city-begging/texts/`
  - Home for city-begging-owned text/config resources.
- `src/application/playables/builtin/grain-accounting/texts/`
  - Home for grain-accounting-owned text/config resources.

## Verification Plan

- Targeted verification:
  - `shared playable completion emits settlement/event routing without direct persistent writes`
  - `city-begging closes through shared runtime ownership`
  - `grain-accounting returns through shared runtime ownership without host-private settlement`
  - `city-begging and grain-accounting owned resources are no longer scattered across unrelated feature paths`
- Required commands:
  - `pnpm run build:test`
  - `node --test tests/robustness.test.cjs --test-name-pattern "city-begging|grain-accounting|playable runtime|event playable runtime"`
  - `pnpm run typecheck`
  - `pnpm run lint:plans`

## Task 1: Lock The Shared Completion Contract With Failing Tests

**Files:**
- Modify: `tests/robustness.test.cjs`
- Read: `src/core/contracts/playable-runtime.ts`
- Read: `src/core/runtime/playable-runtime.ts`
- Read: `src/core/runtime/runtime-dispatch.ts`

- [x] **Step 1: Add failing contract tests for raw minigame result routing**

Add focused coverage that proves:

```js
test("playable runtime routes minigame completion through settlement and optional follow-up event", () => {
  const result = /* run playable completion */;
  assert.equal(result.settlement != null, true);
  assert.equal(Array.isArray(result.settlement.effects), true);
  assert.equal("followUpEventId" in result.settlement || "eventId" in result.settlement, true);
});
```

- [x] **Step 2: Add failing coverage that city-begging and grain-accounting do not directly own persistent writes**

Add assertions that read source or runtime output rather than trusting behavior implicitly:

```js
assert.doesNotMatch(cityBeggingSource, /applyCityBeggingMiniGameCompletion\(/);
assert.doesNotMatch(grainAccountingSource, /applyAccountingReward\(/);
```

If direct helper calls remain valid but move behind a routing seam, update the assertion to enforce the seam instead of the old direct path.

- [x] **Step 3: Run the targeted failing tests**

Run:

```bash
pnpm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "playable runtime routes minigame completion|city-begging|grain-accounting"
```

Expected:

- `FAIL` on the new completion-routing and ownership assertions.

- [x] **Step 4: Sync progress and governance state**

Update this plan only:

- `Execution State.Status` -> `running`
- `Current Focus` -> `Task 1 failing tests`
- append a `Progress Log` entry with the failing-test result

Do not change `docs/superpowers/project-progress.md` yet because this plan is still waiting for explicit legacy admission.

## Task 2: Introduce Shared Playable Result Routing

**Files:**
- Create: `src/core/runtime/playable-result-routing.ts`
- Modify: `src/core/contracts/playable-runtime.ts`
- Modify: `src/core/runtime/playable-runtime.ts`
- Modify: `src/core/runtime/runtime-dispatch.ts`
- Modify: `src/core/runtime/runtime-settlement.ts`
- Read: `src/application/events/event-playable-runtime.ts`

- [x] **Step 1: Add the shared routing helper**

Create a helper shaped like:

```ts
export type PlayableRouteResolution = {
  settlement: {
    effects: Effect[];
    followUpEventId?: string;
  };
};

export function resolvePlayableResultRouting(input: {
  outcome: PlayableOutcome;
  factResult: PlayableFactResult;
  settlementEffects: Effect[];
  followUpEventId?: string;
}): PlayableRouteResolution {
  return {
    settlement: {
      effects: input.settlementEffects,
      ...(input.followUpEventId == null ? {} : { followUpEventId: input.followUpEventId }),
    },
  };
}
```

- [x] **Step 2: Extend the contract instead of inventing per-minigame carriers**

Update `PlayableResult` so shared runtime code can carry routing output without special-casing each minigame:

```ts
export type PlayableResult = {
  integrationId: PlayableIntegrationId;
  outcome: PlayableOutcome;
  factResult: PlayableFactResult;
  handoff: { /* existing fields */ };
  effects: Effect[];
  followUpEventId?: string | undefined;
};
```

If the repository already has a better canonical settlement carrier, widen that type instead of introducing a parallel path.

- [x] **Step 3: Route completion through the shared runtime seams**

Update `runPlayableRuntime()` and `runtime-dispatch.ts` so minigame completion uses the shared routing helper:

```ts
const routed = resolvePlayableResultRouting({
  outcome: settlement.outcome,
  factResult: settlement.factResult,
  settlementEffects: settlement.effects,
  followUpEventId: settlement.followUpEventId,
});
```

Then feed `routed.settlement` back into canonical settlement application rather than applying minigame-owned writes inline.

- [x] **Step 4: Run targeted contract verification**

Run:

```bash
pnpm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "playable runtime routes minigame completion|event playable runtime"
pnpm run typecheck
```

Expected:

- `PASS` on the shared routing contract tests.

## Task 3: Make City Begging The External-Entry Reference Slice

**Files:**
- Modify: `src/application/playables/city-begging/city-begging-definition.ts`
- Modify: `src/ui/views/minigames/city-begging-minigame-view.ts`
- Modify: `src/ui/app-render.ts`
- Modify: `src/main.ts`
- Modify: `tests/robustness.test.cjs`
- Create: `src/application/playables/builtin/city-begging/index.ts`
- Create: `src/application/playables/builtin/city-begging/texts/`
- Create: `src/application/playables/builtin/city-begging/assets/`
- Read: `src/application/runtime/council-priority-city-begging-coordinator.ts`

- [x] **Step 1: Remove direct completion ownership from the city-begging playable**

Change city-begging completion from direct persistent mutation to shared result emission:

```ts
return {
  state: nextState,
  settlement: {
    outcome: "success",
    factResult: { status: "completed", metrics: { score: input.result.score } },
    effects: derivedEffects,
    handoff: { type: "close-only", ownerKind: "external", ownerId: null },
  },
};
```

The playable may still derive reward/effect data, but it must not privately finish persistence outside shared runtime settlement.

- [x] **Step 2: Restrict UI to presenter/overlay concerns**

Keep `city-begging-minigame-view.ts` and render code limited to reading session/view-model state:

```ts
renderCityBeggingMinigameView({
  state: runtimeSessionState,
  viewModel: presenterModel.viewModel,
});
```

No direct closeout, reward settlement, or host switching should remain in UI files.

- [x] **Step 3: Move city-begging-owned texts/assets into the minigame package**

Create or migrate package-local ownership so city-begging does not rely on scattered feature paths:

```text
src/application/playables/builtin/city-begging/
  index.ts
  texts/
  assets/
```

If an asset cannot move immediately, add an explicit adapter/export seam and a follow-up note in the change log instead of leaving a hidden direct dependency.

- [x] **Step 4: Re-run the city-begging runtime regressions**

Run:

```bash
pnpm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "city-begging|interactive runtime can launch covered playable sessions|completion clears shared playable session"
pnpm run typecheck
```

Expected:

- `PASS` for launch, runtime ownership, settlement, and shared-session closeout coverage.

- [x] **Step 5: Sync progress and governance state**

Update this plan:

- `Current Focus` -> `Task 3 city-begging reference slice`
- `Verification` -> latest targeted command results
- append a `Progress Log` entry with the city-begging result

## Task 4: Make Grain Accounting The Host-Return Reference Slice

**Files:**
- Modify: `src/application/playables/grain-accounting/grain-accounting-definition.ts`
- Modify: `src/ui/views/playables/house-playable-overlay.ts`
- Modify: `src/application/city/city-building-house-runtime-adapter.ts`
- Modify: `src/core/runtime/playable-runtime.ts`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/change-log.md`
- Create: `src/application/playables/builtin/grain-accounting/index.ts`
- Create: `src/application/playables/builtin/grain-accounting/texts/`
- Create: `src/application/playables/builtin/grain-accounting/assets/`

- [x] **Step 1: Move grain-accounting result ownership behind shared routing**

Replace direct reward application with routed settlement output:

```ts
return {
  state: withSessionState(nextState, resultOverlayState),
  settlement: {
    outcome: resolvedOutcome,
    factResult: { status: "completed", metrics: { score, grade } },
    effects: derivedRewardEffects,
    followUpEventId,
    handoff: { type: "resume-owner", ownerKind: "house", ownerId },
  },
};
```

`grain-accounting-definition.ts` may still derive grade/reward semantics, but shared runtime settlement must own persistence and return flow.

- [x] **Step 2: Keep the house adapter as an adapter only**

After the refactor, `city-building-house-runtime-adapter.ts` and `house-playable-overlay.ts` should only:

```ts
launchPlayableFromHouse(...);
renderHousePlayableOverlay(...);
```

They must not privately own scoring, timer expiry, settlement writes, or host-return business rules.

- [x] **Step 3: Move grain-accounting-owned texts/assets into the minigame package**

Create or migrate package-local ownership so grain-accounting does not rely on scattered grain-shop/house-only resource paths:

```text
src/application/playables/builtin/grain-accounting/
  index.ts
  texts/
  assets/
```

If a resource must remain shared, replace direct path usage with an explicit adapter seam and record the exception.

- [x] **Step 4: Record the new contract in the change log**

Add a concise entry to `docs/change-log.md` covering:

- shared playable settlement/event routing for minigames
- city-begging as the external-entry reference slice
- grain-accounting as the host-return reference slice
- minigame-local portability and resource ownership rules

- [x] **Step 5: Run final targeted verification**

Run:

```bash
pnpm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "grain-accounting|house-playable-overlay|playable runtime|event playable runtime"
pnpm run typecheck
pnpm run lint:plans
```

Expected:

- `PASS` for the grain-accounting host-return slice, shared playable routing, and plan governance lint.

## Exit Check

- [x] `city-begging` no longer depends on host-private lifecycle ownership and completes through shared runtime settlement.
- [x] `grain-accounting` no longer depends on house-private lifecycle ownership and returns through shared runtime/routing.
- [x] Shared minigame completion always routes through `settlement`, with optional follow-up `event`, under the unified runtime path.
- [x] Minigame-owned texts/assets for the two reference slices live in package-local directories or documented explicit adapters.
- [ ] Project progress sync is updated if this plan is later explicitly admitted as the active legacy child.
- [ ] Closeout block is added before this plan is marked `closed`.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Playable minigame independence implementation`
- Parent Task: `Independent playable runtime reference slices`
- Parent Stage: `Historical Governance Migration`
- Closeout Status: `closed`
- Project Progress Synced: `yes/no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `Open docs/superpowers/project-progress.md and decide whether this waiting plan should become the next explicitly resumed legacy child or remain historical plan inventory.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `none`
- Push Status: `success/failed`
- Push Commit: `commit-sha-or-none`
- Resume From: `Open docs/superpowers/project-progress.md, then resume the next explicitly admitted owner document.`

`Push Commit` must point to a commit message that uses `<type>: <brief title>` plus a `Summary:` section with at least one bullet when push succeeds. If push fails, use `none`, record the failed sync result in `Progress Log`, and continue the next lawful handoff from the written governance truth.
