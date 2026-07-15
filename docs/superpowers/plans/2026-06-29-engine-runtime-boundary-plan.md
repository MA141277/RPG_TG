# Engine Runtime Boundary Implementation Plan

> **Legacy Governance Context:** This document was authored under the retired `weekly plan / weekly set / weekly orchestration` model. Keep its technical scope, but treat any weekly-governance references as historical context only. Resume governed work from `docs/superpowers/project-progress.md` instead.

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the first production-safe `src/core` boundary for engine boot, runtime dispatch, effect settlement, state ownership, and a minimal save envelope seam so later child plans can extract presentation, navigation, and save hardening without `main.ts` remaining the architecture owner.

**Architecture:** Introduce only the contracts and runtime seams needed to prove a real boot path through `src/core`. Keep UI presentation, layout rendering, mod activation policy, and save migration logic out of this child plan. Child 1 should end with `main.ts` delegating into a legacy adapter, `src/core/runtime` owning request dispatch plus effect settlement, and `src/core/save/save-envelope.ts` defining the smallest stable save seam needed by Child 2.

**Tech Stack:** TypeScript, Vite, Node test runner via `tests/robustness.test.cjs`, existing application services, repository plan governance

---

## Execution State

- Status: `completed`
- Last Updated: `2026-06-29`
- Current Focus: `Child 1 acceptance is satisfied in the isolated worktree: src/core now owns the first verified engine bootstrap, runtime dispatch/effect settlement, minimal save envelope, and main.ts -> legacy-main-adapter handoff seam.`
- Next Step: `Hand off completion status to the parent and weekly orchestration plans, then use Child 2 as the next executable plan for save hardening after this batch is reviewed.`
- Verification: `2026-06-29: npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "main.ts delegates boot through legacy-main-adapter"; npm run typecheck; npm test; npm run build`
- Notes: `This is Child Plan 1 under the broader mod-first engine runtime extraction roadmap. Work completed in the isolated worktree on branch codex/child1-task2. That worktree required a node_modules junction to the main checkout and one baseline sync of src/application/house-modules/temple-house/temple-house-house-module.ts so verification matched the active dev state before Task 2 could be validated. Commit batching remains deferred so this branch can be reviewed as one coherent boundary slice first.`

## Progress Log

- 2026-06-29
  - Summary: `Initial child implementation plan approved and recorded.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Begin with Task 1 in an isolated worktree if another thread is editing shared runtime files.`
- 2026-06-29
  - Summary: `Plan narrowed to remove presenter/layout delivery, save-loader/save-writer/migration work, and mod activation implementation so Child 1 remains a true boundary-first slice.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Execute Task 1 as the first production change; leave presenter and save hardening to later child plans.`
- 2026-06-29
  - Summary: `Completed Task 1 Steps 1-4: added the first src/core/contracts files, added contract-shape regression tests, and updated tsconfig.test.json so the test build emits src/core into .test-dist.`
  - Verification: `npm run typecheck; npm test; npm run build`
  - Next: `Begin Task 2 Step 1 and keep Task 1 commit work deferred until the shared dirty worktree is safe to batch for commit.`
- 2026-06-29
  - Summary: `Created an isolated worktree on branch codex/child1-task2, completed Task 2 Steps 1-4, and introduced src/core/engine plus real registry typing so the new boundary now supports EngineSession bootstrap from a selected mod.`
  - Verification: `npm run typecheck; npm test; npm run build`
  - Next: `Begin Task 3 Step 1 in the isolated worktree and keep commit separation deferred until Task 1 and Task 2 batches can be staged cleanly.`
- 2026-06-29
  - Summary: `Completed Task 3 Steps 1-4 in the isolated worktree and introduced src/core/runtime so routed RuntimeResult effects now settle back into CoreGameState through the new dispatch seam.`
  - Verification: `npm run typecheck; npm test; npm run build`
  - Next: `Begin Task 4 Step 1 and keep commit separation deferred until the early Child 1 batches can be staged cleanly.`
- 2026-06-29
  - Summary: `Completed Task 4 Steps 1-4 in the isolated worktree and introduced src/core/save/save-envelope.ts so selected mod identity plus modState payload now have a minimal stable save seam.`
  - Verification: `npm run typecheck; npm test; npm run build`
  - Next: `Begin Task 5 Step 1 and finish the first main.ts -> core handoff seam before closing Child 1.`
- 2026-06-29
  - Summary: `Completed Task 5 Steps 1-5 in the isolated worktree: src/core/adapters/legacy-main-adapter.ts now fronts bootstrapEngine(), src/main.ts explicitly hands boot composition through that adapter, docs/change-log.md records the boundary milestone, and Child 1 now meets its acceptance gate.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "main.ts delegates boot through legacy-main-adapter"; npm run typecheck; npm test; npm run build`
  - Next: `Mark Child 1 complete in the parent and weekly orchestration plans, then queue Child 2 as the next implementation target.`

## Source Documents

- Spec: `docs/superpowers/specs/2026-06-29-engine-runtime-boundary-design.md`
- Parent plan: `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`
- Runtime subsystem authority: `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`

## Parent Alignment

- This file is Child Plan 1 under `2026-06-29-mod-first-engine-runtime-extraction-plan.md`.
- Execute concrete code changes from this file, not from the parent plan.
- After every work batch, sync status into both this child plan and the parent orchestration plan.
- Child 1 owns:
  - the first `src/core` runtime boundary
  - engine session composition
  - effect settlement and dispatch seam
  - the minimal `SaveEnvelope` contract only
  - `main.ts` handoff into `src/core`
- Child 1 does not own:
  - presenter/layout rendering seams
  - save loader/writer/migration hardening
  - mod activation policy or dependency resolution

## File Map

### Existing Files To Modify Early

- `src/main.ts`
  - Reduce to browser wiring plus an explicit handoff into `src/core`.
- `src/application/content/active-game-content.ts`
  - Reuse as a temporary content source behind the first engine composition seam.
- `src/application/state/create-initial-state.ts`
  - Align old state creation with the new core-owned state boundary during transition.
- `tests/robustness.test.cjs`
  - Add boundary regression tests and source-guard tests.
- `docs/change-log.md`
  - Record the boundary introduction once it lands.

### New Files To Create

- `src/core/contracts/core-state.ts`
- `src/core/contracts/engine-context.ts`
- `src/core/contracts/mod-manifest.ts`
- `src/core/contracts/runtime-request.ts`
- `src/core/contracts/runtime-result.ts`
- `src/core/contracts/effect.ts`
- `src/core/contracts/navigation.ts`
- `src/core/registry/engine-registry.ts`
- `src/core/registry/mod-registry.ts`
- `src/core/registry/content-registry.ts`
- `src/core/engine/engine-session.ts`
- `src/core/engine/engine-factory.ts`
- `src/core/engine/engine-bootstrap.ts`
- `src/core/runtime/runtime-context.ts`
- `src/core/runtime/runtime-router.ts`
- `src/core/runtime/runtime-settlement.ts`
- `src/core/runtime/runtime-dispatch.ts`
- `src/core/save/save-envelope.ts`
- `src/core/adapters/legacy-main-adapter.ts`

## Required Verification Gate

For every production-code task in this plan, record at minimum:

- `npm run typecheck`
- `npm test`
- `npm run build`

If one of these commands is intentionally skipped for a task, record the reason in `Progress Log` before marking any related step complete.

## Bug And Blocker Gate

- `P0`
  - build failure, type failure, boot failure, white screen, dead loop, unrecoverable app boot regression
  - Rule: stop later tasks in this child plan until resolved
- `P1`
  - broken engine session composition, broken runtime dispatch, broken effect settlement, broken `main.ts` handoff, broken minimal save envelope seam
  - Rule: do not mark the affected task complete and do not mark this child plan `completed`
- `P2`
  - additive seam issue, minor contract mismatch, non-critical provisional typing cleanup
  - Rule: may be deferred only if logged in `Progress Log` with a follow-up action

## Contract Freeze Rule

Do not freeze new public contract names or shapes merely because placeholder files exist.

Freeze `src/core/contracts/*`, `EngineSession`, `EngineRegistry`, and `SaveEnvelope` only after:

- at least one real boot path is validated through the new seam
- at least one real runtime dispatch path is validated
- `main.ts` hands off through the legacy adapter without a boot regression

Before that point, these files are provisional and may still be reshaped to satisfy validated integration needs.

## Task 1: Introduce Core Contracts and Boundary Tests

**Files:**
- Create: `src/core/contracts/core-state.ts`
- Create: `src/core/contracts/engine-context.ts`
- Create: `src/core/contracts/mod-manifest.ts`
- Create: `src/core/contracts/runtime-request.ts`
- Create: `src/core/contracts/runtime-result.ts`
- Create: `src/core/contracts/effect.ts`
- Create: `src/core/contracts/navigation.ts`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Add failing contract-shape tests**

Append tests shaped like:

```js
test("core contracts export the boundary types", async () => {
  const contracts = require("../.test-dist/core/contracts/mod-manifest.js");
  assert.equal(typeof contracts, "object");
});

test("runtime request contract supports action tick and external variants", async () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/runtime-request.ts"),
    "utf8"
  );

  assert.match(source, /type: "action"/);
  assert.match(source, /type: "tick"/);
  assert.match(source, /type: "external"/);
});
```

- [x] **Step 2: Run focused contract tests and confirm failure**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "core contracts export the boundary types|runtime request contract supports action tick and external variants"
```

Expected:

- tests fail because `src/core/contracts/*` does not exist yet

- [x] **Step 3: Add the initial contract files**

Seed `src/core/contracts/mod-manifest.ts` with:

```ts
export type GameModManifest = {
  id: string;
  version: string;
  title: string;
  entryContentPackIds: string[];
  defaultStart?: {
    mapId?: string;
    cityId?: string;
    sceneId?: string;
  };
};
```

Seed `src/core/contracts/runtime-request.ts` with:

```ts
export type RuntimeRequest =
  | { type: "action"; actionId: string; payload?: Record<string, unknown> }
  | { type: "tick"; tickId: string }
  | { type: "external"; eventId: string; payload?: Record<string, unknown> };
```

Seed `src/core/contracts/effect.ts` with:

```ts
export type Effect =
  | { type: "setFlag"; key: string; value: boolean }
  | { type: "setVariable"; key: string; value: string | number }
  | { type: "changeMoney"; amount: number }
  | { type: "advanceTime"; hours?: number; days?: number };
```

Seed `src/core/contracts/core-state.ts` with:

```ts
export type ViewName = "map" | "city" | "house" | "scene" | "interactive";

export type EngineState = {
  selectedModId: string;
  version: string;
  currentView: ViewName;
};

export type RuntimeState = {
  flags: Record<string, boolean>;
  variables: Record<string, string | number>;
  activeEventId: string | null;
  activeTaskIds: string[];
};

export type CoreGameState = {
  engine: EngineState;
  runtime: RuntimeState;
  modState: Record<string, unknown>;
};
```

Create `src/core/contracts/navigation.ts` with:

```ts
export type NavigationTarget =
  | { view: "map"; mapId?: string }
  | { view: "city"; cityId: string }
  | { view: "house"; houseId: string }
  | { view: "scene"; sceneId: string }
  | { view: "interactive"; moduleId: string };
```

Create `src/core/contracts/runtime-result.ts` with:

```ts
import type { CoreGameState } from "./core-state";
import type { Effect } from "./effect";
import type { NavigationTarget } from "./navigation";

export type RuntimeResult = {
  state: CoreGameState;
  effects: Effect[];
  navigation?: NavigationTarget | null;
};
```

Create `src/core/contracts/engine-context.ts` with:

```ts
import type { CoreGameState } from "./core-state";
import type { GameModManifest } from "./mod-manifest";
import type { EngineRegistry } from "../registry/engine-registry";

export type EngineContext = {
  state: CoreGameState;
  registry: EngineRegistry;
  selectedMod: GameModManifest;
};
```

- [x] **Step 4: Run full verification**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- contracts compile
- new contract tests pass
- no existing tests fail from the new folder existing
- production build still passes

- [ ] **Step 5: Commit**

```bash
git add src/core/contracts tests/robustness.test.cjs
git commit -m "feat: add core boundary contracts"
```

## Task 2: Add Registries and Engine Session Composition

**Files:**
- Create: `src/core/registry/engine-registry.ts`
- Create: `src/core/registry/mod-registry.ts`
- Create: `src/core/registry/content-registry.ts`
- Create: `src/core/engine/engine-session.ts`
- Create: `src/core/engine/engine-factory.ts`
- Create: `src/core/engine/engine-bootstrap.ts`
- Modify: `src/application/state/create-initial-state.ts`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Add a failing bootstrap test**

Append a test shaped like:

```js
test("engine bootstrap builds a session from a selected mod id and registry", async () => {
  const { createEngineSession } = require("../.test-dist/core/engine/engine-factory.js");
  const session = createEngineSession({
    selectedMod: {
      id: "builtin.default",
      version: "1.0.0",
      title: "Default",
      entryContentPackIds: [],
    },
    registry: {
      mods: {},
      content: {},
    },
  });

  assert.equal(session.state.engine.selectedModId, "builtin.default");
});
```

- [x] **Step 2: Run the focused bootstrap test and confirm failure**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "engine bootstrap builds a session from a selected mod id and registry"
```

Expected:

- test fails because `src/core/engine/*` does not exist yet

- [x] **Step 3: Implement the first engine session seam**

Create `src/core/registry/engine-registry.ts` with:

```ts
import type { GameModManifest } from "../contracts/mod-manifest";

export type EngineRegistry = {
  mods: Record<string, GameModManifest>;
  content: Record<string, unknown>;
};
```

Create `src/core/engine/engine-session.ts` with:

```ts
import type { CoreGameState } from "../contracts/core-state";
import type { EngineRegistry } from "../registry/engine-registry";

export type EngineSession = {
  state: CoreGameState;
  registry: EngineRegistry;
};
```

Create `src/core/engine/engine-factory.ts` with:

```ts
import type { EngineSession } from "./engine-session";
import type { GameModManifest } from "../contracts/mod-manifest";
import type { EngineRegistry } from "../registry/engine-registry";

export function createEngineSession(input: {
  selectedMod: GameModManifest;
  registry: EngineRegistry;
}): EngineSession {
  return {
    registry: input.registry,
    state: {
      engine: {
        selectedModId: input.selectedMod.id,
        version: input.selectedMod.version,
        currentView: "map",
      },
      runtime: {
        flags: {},
        variables: {},
        activeEventId: null,
        activeTaskIds: [],
      },
      modState: {},
    },
  };
}
```

Create `src/core/engine/engine-bootstrap.ts` with:

```ts
import { createEngineSession } from "./engine-factory";
import type { EngineRegistry } from "../registry/engine-registry";

export function bootstrapEngine(input: {
  selectedModId: string;
  registry: EngineRegistry;
}) {
  const selectedMod = input.registry.mods[input.selectedModId];
  if (!selectedMod) {
    throw new Error(`Unknown selected mod: ${input.selectedModId}`);
  }

  return createEngineSession({
    selectedMod,
    registry: input.registry,
  });
}
```

Keep `src/application/state/create-initial-state.ts` aligned with the same minimum state shape during the transition.

- [x] **Step 4: Run full verification**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- engine bootstrap test passes
- new core session types compile
- legacy initialization still builds
- production build still passes

- [ ] **Step 5: Commit**

```bash
git add src/core/registry src/core/engine src/application/state/create-initial-state.ts tests/robustness.test.cjs
git commit -m "feat: add core engine session seam"
```

## Task 3: Add Runtime Dispatch and Effect Settlement

**Files:**
- Create: `src/core/runtime/runtime-context.ts`
- Create: `src/core/runtime/runtime-router.ts`
- Create: `src/core/runtime/runtime-settlement.ts`
- Create: `src/core/runtime/runtime-dispatch.ts`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Add a failing runtime dispatch test**

Append a test shaped like:

```js
test("runtime dispatch settles effects after routing", async () => {
  const { dispatchRuntimeRequest } = require("../.test-dist/core/runtime/runtime-dispatch.js");
  const result = dispatchRuntimeRequest({
    state: {
      engine: { selectedModId: "builtin.default", version: "1.0.0", currentView: "map" },
      runtime: { flags: {}, variables: {}, activeEventId: null, activeTaskIds: [] },
      modState: {},
    },
    request: { type: "action", actionId: "test" },
    context: {
      routeRequest() {
        return {
          state: {
            engine: { selectedModId: "builtin.default", version: "1.0.0", currentView: "map" },
            runtime: { flags: {}, variables: {}, activeEventId: null, activeTaskIds: [] },
            modState: {},
          },
          effects: [{ type: "setFlag", key: "booted", value: true }],
        };
      },
    },
  });

  assert.equal(result.state.runtime.flags.booted, true);
});
```

- [x] **Step 2: Run the focused runtime test and confirm failure**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "runtime dispatch settles effects after routing"
```

Expected:

- test fails because `src/core/runtime/*` does not exist yet

- [x] **Step 3: Implement runtime dispatch plus settlement**

Create `src/core/runtime/runtime-settlement.ts` with:

```ts
import type { CoreGameState } from "../contracts/core-state";
import type { Effect } from "../contracts/effect";

export function applyEffects(state: CoreGameState, effects: Effect[]): CoreGameState {
  return effects.reduce((current, effect) => {
    if (effect.type === "setFlag") {
      return {
        ...current,
        runtime: {
          ...current.runtime,
          flags: {
            ...current.runtime.flags,
            [effect.key]: effect.value,
          },
        },
      };
    }

    if (effect.type === "setVariable") {
      return {
        ...current,
        runtime: {
          ...current.runtime,
          variables: {
            ...current.runtime.variables,
            [effect.key]: effect.value,
          },
        },
      };
    }

    return current;
  }, state);
}
```

Create `src/core/runtime/runtime-dispatch.ts` with:

```ts
import type { CoreGameState } from "../contracts/core-state";
import type { RuntimeRequest } from "../contracts/runtime-request";
import type { RuntimeResult } from "../contracts/runtime-result";
import { applyEffects } from "./runtime-settlement";

export function dispatchRuntimeRequest(input: {
  state: CoreGameState;
  request: RuntimeRequest;
  context: {
    routeRequest: (input: {
      state: CoreGameState;
      request: RuntimeRequest;
    }) => RuntimeResult;
  };
}): RuntimeResult {
  const routed = input.context.routeRequest({
    state: input.state,
    request: input.request,
  });

  return {
    ...routed,
    state: applyEffects(routed.state, routed.effects),
  };
}
```

Create `src/core/runtime/runtime-router.ts` with:

```ts
import type { CoreGameState } from "../contracts/core-state";
import type { RuntimeRequest } from "../contracts/runtime-request";
import type { RuntimeResult } from "../contracts/runtime-result";

export type RuntimeRouter = (input: {
  state: CoreGameState;
  request: RuntimeRequest;
}) => RuntimeResult;
```

Create `src/core/runtime/runtime-context.ts` with:

```ts
import type { EngineRegistry } from "../registry/engine-registry";

export type RuntimeContext = {
  registry: EngineRegistry;
  now?: () => number;
};
```

- [x] **Step 4: Run full verification**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- runtime dispatch test passes
- effect settlement works for flags and variables
- production build still passes

- [ ] **Step 5: Commit**

```bash
git add src/core/runtime tests/robustness.test.cjs
git commit -m "feat: add runtime dispatch seam"
```

## Task 4: Add the Minimal Save Envelope Seam

**Files:**
- Create: `src/core/save/save-envelope.ts`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Add a failing save-envelope test**

Append a test shaped like:

```js
test("save envelope preserves selected mod id and mod state payload", async () => {
  const { createSaveEnvelope } = require("../.test-dist/core/save/save-envelope.js");
  const envelope = createSaveEnvelope({
    version: "1.0.0",
    state: {
      engine: { selectedModId: "builtin.default", version: "1.0.0", currentView: "map" },
      runtime: { flags: {}, variables: {}, activeEventId: null, activeTaskIds: [] },
      modState: { "builtin.default": { foo: 1 } },
    },
  });

  assert.equal(envelope.selectedModId, "builtin.default");
  assert.deepEqual(envelope.modState["builtin.default"], { foo: 1 });
});
```

- [x] **Step 2: Run the focused save test and confirm failure**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "save envelope preserves selected mod id and mod state payload"
```

Expected:

- test fails because `src/core/save/save-envelope.ts` does not exist yet

- [x] **Step 3: Implement only the minimal save contract**

Create `src/core/save/save-envelope.ts` with:

```ts
import type { CoreGameState } from "../contracts/core-state";

export type SaveEnvelope = {
  version: string;
  selectedModId: string;
  engineState: CoreGameState["engine"];
  runtimeState: CoreGameState["runtime"];
  modState: CoreGameState["modState"];
};

export function createSaveEnvelope(input: {
  version: string;
  state: CoreGameState;
}): SaveEnvelope {
  return {
    version: input.version,
    selectedModId: input.state.engine.selectedModId,
    engineState: input.state.engine,
    runtimeState: input.state.runtime,
    modState: input.state.modState,
  };
}
```

Do not add `save-loader.ts`, `save-writer.ts`, or `save-migrations.ts` in this child plan. Those belong to Child 2.

- [x] **Step 4: Run full verification**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- save envelope test passes
- no save hardening implementation exists yet beyond the envelope seam
- production build still passes

- [ ] **Step 5: Commit**

```bash
git add src/core/save/save-envelope.ts tests/robustness.test.cjs
git commit -m "feat: add minimal save envelope seam"
```

## Task 5: Route `main.ts` Through a Legacy Core Adapter

**Files:**
- Create: `src/core/adapters/legacy-main-adapter.ts`
- Modify: `src/main.ts`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/change-log.md`

- [x] **Step 1: Add a failing source-guard test for `main.ts`**

Append a test shaped like:

```js
test("main.ts delegates boot through legacy-main-adapter", () => {
  const mainSource = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.match(mainSource, /legacy-main-adapter/);
});
```

- [x] **Step 2: Run the focused source-guard test and confirm failure**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "main.ts delegates boot through legacy-main-adapter"
```

Expected:

- test fails because `main.ts` does not yet use the adapter

- [x] **Step 3: Create the adapter and route bootstrap through it**

Create `src/core/adapters/legacy-main-adapter.ts` with:

```ts
import { bootstrapEngine } from "../engine/engine-bootstrap";
import type { EngineRegistry } from "../registry/engine-registry";

export function bootstrapLegacyMain(input: {
  selectedModId: string;
  registry: EngineRegistry;
}) {
  return bootstrapEngine(input);
}
```

Update `src/main.ts` so it imports `bootstrapLegacyMain()` and uses it as the composition seam rather than remaining the direct architecture root.

Use a seam shaped like:

```ts
import { bootstrapLegacyMain } from "./core/adapters/legacy-main-adapter";

const session = bootstrapLegacyMain({
  selectedModId: "builtin.default",
  registry,
});

void session;
```

In this task, do not refactor feature behavior out of `main.ts`. The only required production change is to create an explicit import-and-handoff seam into `src/core/adapters/legacy-main-adapter.ts`.

- [x] **Step 4: Run final verification**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- source-guard test passes
- production build passes
- current app still boots
- `main.ts` has an explicit handoff seam into `src/core`

- [x] **Step 5: Update docs and commit**

Append a change log entry summarizing:

```md
- introduced the first `src/core` engine/runtime boundary
- added runtime dispatch and effect settlement seams
- added a minimal `SaveEnvelope` contract for later save hardening work
- routed main bootstrap through `legacy-main-adapter`
```

Commit:

```bash
git add src/core/adapters/legacy-main-adapter.ts src/main.ts tests/robustness.test.cjs docs/change-log.md
git commit -m "refactor: route main through core boundary adapter"
```

## Execution Order

1. Task 1
2. Task 2
3. Task 3
4. Task 4
5. Task 5

## Parallel Work Rules

- Do not execute Task 2 or Task 5 in the same worktree as another thread editing `src/main.ts`, `src/application/state/create-initial-state.ts`, or `tests/robustness.test.cjs`.
- After Task 1 lands, keep contracts provisional unless the `Contract Freeze Rule` has been satisfied.
- After Task 2 lands, keep `EngineSession`, `EngineRegistry`, and `SaveEnvelope` provisional unless the `Contract Freeze Rule` has been satisfied.
- Do not start Child 2 save hardening until Task 4 completes.
- Do not start Child 5 presenter/render decoupling work from assumptions made in this child unless it is documented against the validated runtime boundary produced here.

## Success Criteria

- `src/core/contracts` defines the minimal shared engine/runtime boundary.
- `src/core/engine` can compose a selected mod, registry, and initial state into an engine session.
- `src/core/runtime` can accept a runtime request and settle returned effects.
- `src/core/save/save-envelope.ts` defines the minimal additive save seam needed for Child 2.
- `src/main.ts` hands boot composition into `src/core/adapters/legacy-main-adapter.ts` instead of remaining the sole architecture root.
- No presenter/layout or save hardening responsibilities are pulled forward into Child 1.

## Self-Review

- Spec coverage:
  - engine responsibilities are covered by Task 2 and Task 5
  - runtime responsibilities are covered by Task 3
  - initial save seam responsibilities are covered by Task 4
  - migration seam out of `main.ts` is covered by Task 5
- Placeholder scan:
  - no `TBD`, `TODO`, or "implement later" placeholders remain
  - all tasks list exact file paths and commands
- Type consistency:
  - `CoreGameState`, `GameModManifest`, `EngineSession`, `RuntimeRequest`, `RuntimeResult`, `Effect`, and `SaveEnvelope` are used consistently throughout

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
- [x] Change log updated
