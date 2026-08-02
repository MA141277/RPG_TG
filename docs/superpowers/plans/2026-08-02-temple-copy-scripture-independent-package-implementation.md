# Temple Copy Scripture Independent Package Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert `temple-copy-scripture` into the first standalone minigame package under `src/minigames/temple-copy-scripture/`, integrated into RPG_TG only through a host adapter, while preserving Script Editor-authored launch data and full browser settlement/return flow.

**Architecture:** Keep the mechanic package pure and host-agnostic, then bridge it into the shared playable runtime through a dedicated adapter seam that handles launch payload mapping, presenter conversion, settlement, and handoff. Temple building behavior remains authored as arrangement/event/playable content, while runtime shell code stops special-casing this one mechanic in `src/main.ts` and direct runtime branches.

**Tech Stack:** TypeScript runtime and content files under `src/`, Script Editor authoring data under `src/content` and `src/modules/script-editor`, regression coverage in `tests/robustness.test.cjs` plus browser smoke coverage, and governance verification with `pnpm run build:test`, `pnpm run typecheck`, and `pnpm run lint:plans`.

## Execution State

- Status: `running`
- Last Updated: `2026-08-02`
- Current Focus: `Closeout documentation and residual verification after browser acceptance of the standalone package route.`
- Next Step: `Decide whether the unrelated repository-wide tsconfig.json failures should be handled in a separate queue before marking this governed child closed.`
- Verification: `Bundled Node build:test PASS; direct source-boundary assertions PASS; browser path PASS for temple launch -> play -> settlement -> close-result -> return; repository-wide tsconfig.json still has pre-existing unrelated failures.`
- Notes: `docs/superpowers/project-progress.md currently points at another explicitly resumed legacy child, so this plan stays self-contained; this slice is implemented, but the plan remains open because the full repository typecheck gate is still red outside the temple package change.`

## Progress Log

- 2026-08-02
  - Summary: `Authored the temple-copy-scripture standalone-package implementation plan from the approved direction and current repository runtime mismatch.`
  - Verification: `Bundled Node runtime: tools/lint-superpowers-plans.mjs -> PASS`
  - Next: `Run plan lint, then wait for spec review or begin Task 1 if execution is explicitly approved.`
- 2026-08-02
  - Summary: `Added Task 1 red tests to tests/robustness.test.cjs and confirmed the current implementation still violates all three boundaries: package host imports, main.ts temple shell special-casing, and playable-runtime temple hardcoding.`
  - Verification: `Bundled Node runtime direct source-boundary assertions -> FAIL as expected for temple package/runtime/main seams`
  - Next: `Start Task 2 by replacing src/minigames/temple-copy-scripture with package-local contract/session/reducer/presenter files.`
- 2026-08-02
  - Summary: `Replaced temple-copy-scripture with a host-agnostic package, added the builtin host adapter/settlement seam, updated runtime and registry wiring, and fixed host result-close handling so standalone package result overlays return to the temple menu in browser play.`
  - Verification: `Bundled Node build:test -> PASS; direct source-boundary assertions -> PASS; Playwright browser acceptance -> PASS for temple launch -> play -> settlement -> close-result -> return`
  - Next: `Leave this plan running until the unrelated repository-wide tsconfig.json baseline is resolved or explicitly waived for closeout.`
- 2026-08-02
  - Summary: `Removed the remaining shared-layer temple residue by introducing a dedicated playable host-adapter registry, moving temple house overlay rendering behind the builtin adapter seam, and deleting the dead main.ts temple result-close special case.`
  - Verification: `Bundled Node tsc -p tsconfig.test.json -> PASS; targeted robustness coverage -> PASS for package source boundary, shared runtime host-adapter routing, shared overlay source guard, main.ts special-case guard, and temple launch -> settle overlay path`
  - Next: `Decide whether to rerun browser acceptance for this narrower host-adapter cleanup slice or keep the existing browser proof as sufficient before closeout.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-08-02-temple-copy-scripture-independent-package-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `The current temple route is already authored through building arrangement -> event -> launchPlayable, but src/minigames/temple-copy-scripture still wraps activity-qte and shared runtime code still contains temple-specific branches.`
  - `The historical docs/special-house-interface.md file referenced by skill docs is gone, so this implementation must preserve the surviving shared playable/runtime/building-authoring boundaries instead of reintroducing house-local lifecycle code.`

## Implementation Scope

### In Scope

- Replace the current temple wrapper with a package-local mechanic contract and reducer.
- Add a host adapter seam that maps RPG_TG payloads and settlement into the shared playable contract.
- Remove `temple-copy-scripture` shell-action special casing from `src/main.ts`.
- Route temple playable execution through a shared adapter seam in the playable runtime.
- Keep Script Editor builtin/template records aligned with the standalone package identity.
- Add automated regression and browser acceptance coverage.

### Still Out Of Scope

- Migrating every other playable to the new adapter seam in the same batch.
- Redesigning temple building arrangements or unrelated monastery tasks.
- Full runtime-family generalization beyond what this first package sample requires.
- New top-level playable families or owner kinds.

## File Map

### Existing files to modify

- `src/minigames/temple-copy-scripture/contract.ts`
  - Replace RPG_TG runtime-facing types with package-local contract types and ids.
- `src/minigames/temple-copy-scripture/runtime.ts`
  - Replace host-state wrappers with pure session creation / reducer logic.
- `src/minigames/temple-copy-scripture/index.ts`
  - Re-export the package surface only.
- `src/core/runtime/playable-runtime.ts`
  - Route temple playable through an adapter seam instead of direct temple-specific launch/action logic.
- `src/core/registry/builtin-playable-definition-registry.ts`
  - Keep builtin registration pointing at the standalone package identity without importing host-owned runtime wrappers.
- `src/core/registry/builtin-playable-integration-registry.ts`
  - Align builtin temple integration metadata if the adapter seam needs normalized trigger defaults.
- `src/main.ts`
  - Remove `temple-copy-scripture` action-id special casing and use shared session command wiring.
- `src/modules/script-editor/application/minigame-binding-authoring.ts`
  - Keep builtin playable listing aligned with the standalone package identity.
- `src/content/scenario-packs/zhuyuanzhang/playables.json`
  - Normalize standalone package metadata if needed.
- `src/content/scenario-packs/zhuyuanzhang/playable-integrations.json`
  - Keep template integration data aligned with the standalone package contract.
- `src/content/scenario-packs/zhuyuanzhang/events.json`
  - Preserve the temple `launchPlayable` route while normalizing payload fields only if required.
- `tests/robustness.test.cjs`
  - Add contract, authoring, and runtime regression coverage.
- `docs/change-log.md`
  - Record the package boundary, adapter seam, and temple browser acceptance result.

### New files to create

- `src/minigames/temple-copy-scripture/session.ts`
  - Package-local session state and creation helpers.
- `src/minigames/temple-copy-scripture/reducer.ts`
  - Pure command reducer and completion production.
- `src/minigames/temple-copy-scripture/presenter.ts`
  - Package-local render model builder.
- `src/application/playables/builtin/temple-copy-scripture/temple-copy-scripture-adapter.ts`
  - Host adapter from shared playable runtime to package contract.
- `src/application/playables/builtin/temple-copy-scripture/temple-copy-scripture-settlement.ts`
  - Host-side result translation to `PlayableResult.effects` and optional follow-up event.
- `src/application/playables/builtin/temple-copy-scripture/index.ts`
  - Adapter export surface.

## Verification Plan

- Targeted verification:
  - `temple-copy-scripture package files stay host-agnostic and stop importing activity-qte/runtime-state`
  - `shared playable runtime launches and drives temple-copy-scripture through the adapter seam`
  - `main.ts no longer special-cases temple-copy-scripture shell actions`
  - `Script Editor builtin/template export still treats temple-copy-scripture as a standalone playable`
  - `browser temple route completes launch -> play -> settlement -> return`
- Required commands:
  - `pnpm run build:test`
  - `node --test tests/robustness.test.cjs --test-name-pattern "temple copy scripture|standalone playable template|main.ts keeps covered runtime commits supplied with active task definitions|script editor"`
  - `pnpm run typecheck`
  - `pnpm run lint:plans`

## Task 1: Lock The Independence Boundary With Failing Tests

**Files:**
- Modify: `tests/robustness.test.cjs`
- Read: `src/minigames/temple-copy-scripture/contract.ts`
- Read: `src/minigames/temple-copy-scripture/runtime.ts`
- Read: `src/main.ts`
- Read: `src/core/runtime/playable-runtime.ts`

- [x] **Step 1: Add a failing source-boundary test for the package**

Add a focused regression that reads the package source files and forbids host/runtime imports:

```js
test("temple copy scripture package stays host-agnostic", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/minigames/temple-copy-scripture/runtime.ts"),
    "utf8"
  );

  assert.doesNotMatch(source, /core\/contracts\/runtime-state/);
  assert.doesNotMatch(source, /domain\/activity/);
  assert.doesNotMatch(source, /domain\/character/);
  assert.doesNotMatch(source, /application\/playables\/activity-qte/);
});
```

- [x] **Step 2: Add a failing regression for `main.ts` special casing**

Add coverage that fails while `src/main.ts` still names the temple playable explicitly:

```js
test("main.ts does not special-case temple copy scripture shell actions", () => {
  const source = fs.readFileSync(path.join(process.cwd(), "src/main.ts"), "utf8");
  assert.doesNotMatch(source, /temple-copy-scripture"\s*\?/);
});
```

- [x] **Step 3: Add a failing runtime-path regression**

Require the runtime to use an adapter seam rather than temple branches:

```js
test("playable runtime does not hardcode temple copy scripture command branches", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/playable-runtime.ts"),
    "utf8"
  );
  assert.doesNotMatch(source, /resolvedRequest\.playableId === "temple-copy-scripture"/);
  assert.doesNotMatch(source, /launchTempleCopyScripturePlayable/);
});
```

- [x] **Step 4: Run the targeted tests to confirm failure**

Run:

```bash
pnpm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "temple copy scripture package stays host-agnostic|main.ts does not special-case temple copy scripture shell actions|playable runtime does not hardcode temple copy scripture command branches"
```

Expected:

- `FAIL` on all three new assertions against the current wrapper implementation.

- [x] **Step 5: Sync plan state**

Update this plan:

- `Execution State.Status` -> `running`
- `Current Focus` -> `Task 1 failing tests`
- append the failing-test result to `Progress Log`

## Task 2: Replace The Wrapper With A Pure Package

**Files:**
- Modify: `src/minigames/temple-copy-scripture/contract.ts`
- Modify: `src/minigames/temple-copy-scripture/runtime.ts`
- Modify: `src/minigames/temple-copy-scripture/index.ts`
- Create: `src/minigames/temple-copy-scripture/session.ts`
- Create: `src/minigames/temple-copy-scripture/reducer.ts`
- Create: `src/minigames/temple-copy-scripture/presenter.ts`

- [x] **Step 1: Rewrite the package contract around package-local types**

Define package-local contracts like:

```ts
export const TEMPLE_COPY_SCRIPTURE_PACKAGE_ID = "temple-copy-scripture";

export type TempleCopyScriptureLaunchConfig = {
  title: string;
  briefing: string;
  prompts: Array<{
    id: string;
    text: string;
    expectedStrokeGroup: string;
  }>;
  roundsToClear: number;
  maxMistakes: number;
};

export type TempleCopyScriptureCommand =
  | { type: "begin" }
  | { type: "input"; value: string }
  | { type: "confirm" }
  | { type: "cancel" };
```

- [x] **Step 2: Create package-local session state**

Implement `session.ts` with a pure state shape:

```ts
export type TempleCopyScriptureSession = {
  phase: "ready" | "active" | "completed" | "cancelled";
  currentRound: number;
  score: number;
  mistakes: number;
  prompts: TempleCopyScriptureLaunchConfig["prompts"];
  pendingInput: string;
};
```

- [x] **Step 3: Implement the reducer and completion result**

Create a pure reducer:

```ts
export function reduceTempleCopyScriptureSession(
  session: TempleCopyScriptureSession,
  command: TempleCopyScriptureCommand
): {
  session: TempleCopyScriptureSession;
  completion?: TempleCopyScriptureCompletion;
} {
  if (command.type === "cancel") {
    return {
      session: { ...session, phase: "cancelled" },
      completion: { outcome: "cancelled", score: session.score, mistakes: session.mistakes },
    };
  }
  return { session };
}
```

- [x] **Step 4: Add a package-local presenter**

Expose render-facing state without host types:

```ts
export type TempleCopyScripturePresenterModel = {
  title: string;
  summaryLines: string[];
  primaryActionLabel: string;
  canConfirm: boolean;
  progressLabel: string;
};
```

- [x] **Step 5: Re-run the boundary test**

Run:

```bash
pnpm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "temple copy scripture package stays host-agnostic"
```

Expected:

- `PASS`

## Task 3: Add The Host Adapter Seam And Runtime Wiring

**Files:**
- Create: `src/application/playables/builtin/temple-copy-scripture/temple-copy-scripture-adapter.ts`
- Create: `src/application/playables/builtin/temple-copy-scripture/temple-copy-scripture-settlement.ts`
- Create: `src/application/playables/builtin/temple-copy-scripture/index.ts`
- Modify: `src/core/runtime/playable-runtime.ts`
- Modify: `src/core/registry/builtin-playable-definition-registry.ts`
- Modify: `src/core/registry/builtin-playable-integration-registry.ts`
- Modify: `src/main.ts`

- [x] **Step 1: Implement the host adapter launch mapper**

Add an adapter function shaped like:

```ts
export function launchTempleCopyScriptureFromPlayable(input: {
  activityDefinition: ActivityDefinition | null;
  launchPayload: Record<string, unknown> | undefined;
  integrationId: PlayableIntegrationId;
  ownerContext: PlayableOwnerContext;
  state: RuntimeState;
}): RuntimeState {
  const config = createTempleCopyScriptureLaunchConfig(input);
  return startPackageBackedPlayableSession(input.state, {
    playableId: "temple-copy-scripture",
    integrationId: input.integrationId,
    ownerContext: input.ownerContext,
    packageState: createTempleCopyScriptureSession(config),
  });
}
```

- [x] **Step 2: Implement adapter-side settlement translation**

Create settlement mapping outside the package:

```ts
export function settleTempleCopyScriptureCompletion(input: {
  completion: TempleCopyScriptureCompletion;
  integration: PlayableIntegrationDefinition;
}): Pick<PlayableResult, "outcome" | "factResult" | "effects" | "followUpEventId"> {
  return {
    outcome: input.completion.outcome,
    factResult: {
      status: input.completion.outcome === "cancelled" ? "cancelled" : "completed",
      metrics: {
        score: input.completion.score,
        mistakes: input.completion.mistakes,
      },
    },
    effects: [],
  };
}
```

- [x] **Step 3: Replace direct temple branches in runtime**

Move runtime handling from temple-specific `if` branches to an adapter lookup:

```ts
const packageAdapter = builtinPackagePlayableAdapters[resolvedRequest.playableId];
if (packageAdapter != null) {
  return packageAdapter.reduce({ state: input.state, request: resolvedRequest, ... });
}
```

- [x] **Step 4: Remove `main.ts` special casing**

Switch shell action id generation to active session command prefix or shared metadata:

```ts
function createActivityShellActionId(action: string): string {
  const playableId = appState.gameState.runtime.playableSession?.playableId ?? "activity-qte";
  return `interactive.${playableId}.${action}`;
}
```

Adjust only if a shared prefix reader already exists; the final code must not mention `temple-copy-scripture` explicitly.

- [ ] **Step 5: Run targeted runtime regressions**

Run:

```bash
pnpm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "playable runtime does not hardcode temple copy scripture command branches|main.ts does not special-case temple copy scripture shell actions|temple copy scripture sample is exported as a standalone playable template"
pnpm run typecheck
```

Expected:

- `PASS`

## Task 4: Keep Script Editor And Scenario Content Aligned

**Files:**
- Modify: `src/modules/script-editor/application/minigame-binding-authoring.ts`
- Modify: `src/modules/script-editor/builtin-templates/zhuyuanzhang/playables.json`
- Modify: `src/modules/script-editor/builtin-templates/zhuyuanzhang/playable-integrations.json`
- Modify: `src/content/scenario-packs/zhuyuanzhang/playables.json`
- Modify: `src/content/scenario-packs/zhuyuanzhang/playable-integrations.json`
- Modify: `src/content/scenario-packs/zhuyuanzhang/events.json`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Update builtin/editor assertions to point at the standalone package identity**

Replace the old `activity-qte`-backed expectation with `temple-copy-scripture`:

```js
assert.ok(
  builtinPlayableIntegrations.some(
    (integration) =>
      integration.playableId === "temple-copy-scripture" &&
      integration.title === "寺庙抄经玩法" &&
      integration.trigger?.launchPayload?.activityId ===
        "activity.zhu_yuanzhang.temple.copy_scripture"
  )
);
```

- [x] **Step 2: Keep the authored route unchanged unless normalization is required**

The final content must still prove:

```js
assert.equal(copyScriptureEvent.actions[0].type, "launchPlayable");
assert.equal(copyScriptureEvent.actions[0].playableId, "temple-copy-scripture");
assert.equal(
  copyScriptureEvent.actions[0].ownerContext.ownerId,
  "house.kulan.temple"
);
```

- [x] **Step 3: Run targeted editor/export regressions**

Run:

```bash
pnpm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "temple copy scripture sample is exported as a standalone playable template|expected temple copy scripture activity-qte template integration|script editor"
```

Expected:

- `PASS` after the stale `activity-qte` expectation is replaced with the standalone package expectation.

## Task 5: Browser Acceptance And Closeout Docs

**Files:**
- Modify: `tests/browser-stage-settlement-smoke.test.cjs` or `tests/robustness.test.cjs`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-08-02-temple-copy-scripture-independent-package-implementation.md`

- [x] **Step 1: Add a browser-path assertion for temple launch and return**

Cover the acceptance path with a browser or runtime smoke proving:

```js
// open temple -> choose copy scripture -> active playable id is temple-copy-scripture
// complete or cancel -> playable session clears -> host view resumes
```

- [x] **Step 2: Record the contract change in `docs/change-log.md`**

Add one entry describing:

- standalone package boundary under `src/minigames/temple-copy-scripture/`
- host adapter seam
- removal of `main.ts` special casing
- browser acceptance result

- [ ] **Step 3: Run the full verification set**

Run:

```bash
pnpm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "temple copy scripture|standalone playable template|script editor"
pnpm run typecheck
pnpm run lint:plans
```

Expected:

- `PASS`

- [x] **Step 4: Sync plan state for implementation closeout**

Update:

- task checkboxes
- `Execution State`
- `Progress Log`

If implementation also completes in this slice, add the closeout block before marking the plan `closed`.

## Exit Check

- [x] `src/minigames/temple-copy-scripture/` exports a host-agnostic package surface.
- [x] Temple runtime launch/action/exit no longer depend on hardcoded `main.ts` or direct runtime branches.
- [x] Script Editor and scenario-pack records still point at a standalone `temple-copy-scripture` playable.
- [x] Browser acceptance proves temple launch -> play -> settlement -> return.
- [x] `docs/change-log.md` records the contract change.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
