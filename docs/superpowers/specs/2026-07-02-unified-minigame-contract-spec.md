# Unified Minigame Contract Spec

## 1. Goal

Define one repository-level contract for all minigame-like gameplay modules so current and future minigames enter the same registration, runtime, presenter, settlement, and owner-handoff pipeline.

The target is:

- external callers launch by `minigameId`
- runtime owns the minigame lifecycle rather than `main.ts` or individual house branches
- presenter/view consumes one unified shell contract
- settlement writes through unified game/runtime structures
- completion always returns to the correct owner scene/house/session through explicit handoff data

## 2. Scope

This spec applies to:

- existing `activity-qte`
- existing `city-begging`
- existing `accounting`
- existing `compounding`
- all future minigame modules
- any modified legacy minigame path once it is touched for feature work, refactor, or extension

This spec defines repository-level structure. It is not house-specific and must not be implemented as a house-local convention.

## 3. Why This Spec Exists

The current repository already has several minigame-shaped systems, but they do not share one stable contract:

- `activity-qte` and `city-begging` are partly inside the interactive runtime family, but still expose feature-specific state and shell coupling
- `accounting` and `compounding` still exist mostly as local rule helpers instead of full runtime-owned minigame modules
- UI rendering is not driven by a unified minigame presenter shell
- completion and return behavior are not defined as one formal owner-handoff contract

Without a repository-level spec, future minigames would continue to duplicate:

- startup branching
- local session shapes
- result overlays
- write-back logic
- return-to-owner logic

That would violate the repository mechanism-first direction and keep `main.ts`, house modules, and local overlays as accidental long-term owners.

## 4. Non-Goals

This spec does not require:

- one generic DSL that replaces all minigame-specific rules
- immediate full deletion of all legacy minigame state carriers
- one visual layout shared by every minigame
- moving story battle under the minigame family
- rewriting all owner/session contracts in one batch

This spec defines the target contract family and the migration path.

## 5. Current Mismatch Snapshot

Current repository mismatches that this spec resolves:

- `src/core/contracts/interactive-runtime.ts` models `activity-qte` and `city-begging` as interactive-family peers instead of one minigame registry surface
- `src/core/runtime/interactive-runtime.ts` still contains feature-specific launch/action routing for those minigames
- `src/application/grain-shop/accounting-minigame.ts` and `src/application/medicine-house/compounding-minigame.ts` expose rules but not unified session/runtime/presenter/settlement contracts
- `src/ui/views/minigames/city-begging-minigame-view.ts` is a feature-specific overlay rather than one presenter-shell consumer inside a common minigame runtime path
- return-to-owner behavior is not yet a mandatory top-level handoff contract for all minigame completion paths

## 6. Core Architecture

The target flow is:

```text
minigameId -> minigame registry -> minigame runtime -> presenter shell -> settlement -> owner handoff
```

Ownership rules:

- callers identify the minigame by `minigameId`
- registry resolves the definition
- runtime owns lifecycle state and command dispatch
- presenter shell converts runtime state into render input
- settlement writes persistent changes into canonical gameplay state
- handoff returns to the correct owner via explicit owner metadata, never by shell guessing

## 7. Required Terminology

These terms are required and should be used consistently in code and docs:

- `minigameId`
  - unique minigame identifier
- `ownerContext`
  - normalized owner metadata captured when the minigame starts
- `session`
  - active runtime-owned minigame session
- `command`
  - normalized runtime input sent to a minigame
- `presenterModel`
  - render-facing minigame view model
- `completionResult`
  - unified result payload emitted on completion/cancel
- `handoff`
  - explicit return instruction to the owner flow

Avoid using multiple unrelated names for the same concept such as ad hoc `overlay state`, `local result state`, or `pending return house id`.

## 8. Registry Contract

All minigames must register through one unified registry.

Recommended shape:

```ts
export type MinigameId =
  | "activity-qte"
  | "city-begging"
  | "grain-accounting"
  | "medicine-compounding"
  | (string & {});

export type MinigameDefinition = {
  id: MinigameId;
  version: 1;
  kind: "timing" | "action" | "quiz" | "composition" | "custom";
  title: string;
  createSession(input: MinigameCreateSessionInput): ActiveMinigameSession;
  reduce(input: MinigameReduceInput): MinigameReduceResult;
  present(input: MinigamePresentInput): MinigamePresenterModel;
  settle(input: MinigameSettleInput): MinigameSettlement;
};
```

Rules:

- every minigame must have exactly one registered definition
- callers must not import concrete minigame business modules to launch them
- `main.ts` must not branch on concrete minigame ids
- house modules must not become permanent owners of concrete minigame runtime code

## 9. Launch Contract

External callers should launch by `minigameId`.

Minimal caller-facing shape:

```ts
type LaunchMinigameRequest = {
  minigameId: string;
  payload?: Record<string, unknown>;
};
```

Normalized runtime-facing shape:

```ts
type MinigameOwnerKind = "house" | "scene" | "task" | "external";

type MinigameOwnerContext = {
  ownerKind: MinigameOwnerKind;
  ownerId: string | null;
  sessionToken: string | null;
  returnPolicy: "resume-owner" | "reenter-owner" | "close-only";
};

type MinigameLaunchRequest = {
  minigameId: string;
  payload?: Record<string, unknown>;
  ownerContext: MinigameOwnerContext;
};
```

Rules:

- callers may omit owner metadata
- runtime must normalize missing owner metadata before session creation
- a minigame must not depend on hidden global owner state to know where to return
- minigame-private inputs belong in `payload`, not in new top-level shell globals

## 10. Session Contract

All minigames must expose one active session shape.

Recommended shape:

```ts
type ActiveMinigameSession = {
  sessionId: string;
  minigameId: MinigameId;
  ownerContext: MinigameOwnerContext;
  status: "booting" | "playing" | "result";
  state: Record<string, unknown>;
};
```

Rules:

- the runtime owns the active session
- feature-specific state may live under `state`
- no minigame may bypass the session contract by keeping the authoritative flow state in ad hoc UI-only containers

## 11. Command Contract

All runtime interaction with a minigame must go through normalized commands.

Recommended baseline:

```ts
type MinigameCommand =
  | { type: "start" }
  | { type: "pointer"; x: number; y?: number }
  | { type: "keypress"; key: string }
  | { type: "select"; value: string }
  | { type: "submit"; value?: unknown }
  | { type: "tick"; now: number }
  | { type: "confirm-result" }
  | { type: "cancel" }
  | { type: "custom"; actionId: string; payload?: Record<string, unknown> };
```

Rules:

- runtime dispatches commands
- `main.ts` must not mutate minigame-internal state directly
- feature-specific behavior may use `custom`, but must still go through the same runtime dispatch surface
- simple quiz/panel minigames are not exempt from the command contract

## 12. Reduce Contract

Each minigame definition must reduce its session through a shared lifecycle surface.

Recommended shape:

```ts
type MinigameReduceInput = {
  session: ActiveMinigameSession;
  command: MinigameCommand;
  gameState: GameState;
  now: number;
};

type MinigameReduceResult = {
  session: ActiveMinigameSession;
  lifecycle:
    | { type: "continue" }
    | { type: "completed"; result: MinigameCompletionResult }
    | { type: "cancelled"; result: MinigameCompletionResult };
};
```

Rules:

- all minigames must move through `createSession -> reduce`
- a minigame must not complete by mutating persistent gameplay state directly from view logic
- completion and cancel must emit a formal result

## 13. Presenter Contract

All minigames must expose a unified presenter model to a common minigame shell.

Recommended shape:

```ts
type MinigamePresenterModel = {
  sessionId: string;
  minigameId: MinigameId;
  phase: "booting" | "playing" | "result";
  chrome: {
    title: string;
    subtitle?: string;
    showCancel: boolean;
    showConfirmResult: boolean;
  };
  hud: Array<{ label: string; value: string }>;
  layout: "canvas" | "panel" | "sheet" | "hybrid";
  viewModel: Record<string, unknown>;
};
```

Rules:

- the shared shell consumes `MinigamePresenterModel`
- feature-specific view code consumes only its own `viewModel`
- application modules must not return HTML strings
- feature-specific UI is allowed, but the runtime/presenter shell contract must stay unified

## 14. Result Contract

All minigames must emit one unified result shape with both generic and private detail.

Recommended shape:

```ts
type MinigameReward = {
  kind: string;
  amount?: number;
  label?: string;
};

type MinigameCompletionResult = {
  outcome: "success" | "failure" | "cancelled";
  score?: number;
  rewards?: MinigameReward[];
  detail?: Record<string, unknown>;
  handoff: {
    type: "resume-owner" | "reenter-owner" | "close-only";
    ownerKind: MinigameOwnerKind;
    ownerId: string | null;
    sessionToken: string | null;
  };
};
```

Rules:

- `outcome` is mandatory
- `detail` preserves minigame-specific information without fragmenting the top-level contract
- `handoff` is mandatory
- shell/runtime must not guess the return target after completion

## 15. Settlement Contract

All persistent minigame effects must flow through unified settlement.

Recommended shape:

```ts
type MinigameSettlement = {
  gameState: GameState;
  effects: RuntimeEffect[];
  handoff: {
    type: "resume-owner" | "reenter-owner" | "close-only";
    ownerKind: MinigameOwnerKind;
    ownerId: string | null;
    sessionToken: string | null;
  };
};
```

Rules:

- reducer may compute a result, but settlement owns persistent write-back
- persistent changes must flow through unified gameplay/runtime state structures
- no minigame may store durable progression data in ad hoc top-level globals
- initialization must not overwrite player base stats, money, skills, or inventory as a hidden setup shortcut

## 16. Owner Return And Session Recovery Rules

Returning to the correct owner is a hard requirement.

Allowed handoff policies:

- `resume-owner`
  - return to the suspended owner session when the owner session is still valid
- `reenter-owner`
  - re-enter the owner container from normalized owner identity when session restore is not the right fit
- `close-only`
  - close the minigame and leave follow-up to the enclosing runtime

Rules:

- every completion path must emit exactly one handoff
- the return path must be driven by `ownerContext` and the emitted handoff
- no minigame may directly navigate back from view code
- `main.ts` must not grow feature-specific return branches for individual minigames

## 17. File And Directory Structure

Each new or migrated minigame should follow one focused file family.

Recommended structure:

- `src/domain/minigames/<id>.ts`
- `src/application/minigames/<id>/<id>-definition.ts`
- `src/application/minigames/<id>/<id>-session.ts`
- `src/application/minigames/<id>/<id>-presenter.ts`
- `src/application/minigames/<id>/<id>-settlement.ts`
- `src/ui/views/minigames/<id>-view.ts`
- `tests/minigames/<id>.test.*`

Responsibilities:

- `domain`
  - types, rules, and pure state structures
- `application`
  - session creation, reduction, presenter mapping, settlement
- `ui`
  - render-only consumption of presenter output

## 18. Migration Strategy

Migration must be gradual rather than one-shot.

### Phase 1: Introduce Unified Skeleton

Add:

- minigame registry
- minigame runtime contracts
- minigame session/result/handoff contracts
- shared presenter shell
- this repository-level spec

Keep existing rules and feature views where possible.

### Phase 2: Migrate `activity-qte` And `city-begging`

Reason:

- both already behave like runtime-owned minigames
- they provide the first real proof of the unified contract

Direction:

- move feature-specific launch/action routing behind minigame definitions
- preserve current core rules and variants
- keep user-facing behavior stable

### Phase 3: Migrate `grain-accounting` And `medicine-compounding`

Reason:

- both already have reusable rule cores
- both lack unified session/presenter/settlement shells

Direction:

- promote them from house-local mechanisms to full minigame definitions
- unify result overlay, confirmation, settlement, and owner return

### Phase 4: Delete Legacy Direct Paths

After the migrated definitions prove stable:

- remove feature-specific startup/closeout branches from `main.ts`
- remove long-term direct house-module to concrete-minigame wiring
- reduce old compatibility carriers that no longer own production behavior

## 19. Existing Module Mapping

Recommended repository ids:

- `activity-qte`
- `city-begging`
- `grain-accounting`
- `medicine-compounding`

Recommended owner-return defaults:

- `activity-qte`
  - usually `resume-owner`
- `city-begging`
  - usually `reenter-owner`
- `grain-accounting`
  - usually `reenter-owner` or `resume-owner` depending on host flow
- `medicine-compounding`
  - usually `reenter-owner` or `resume-owner` depending on host flow

Variant note:

- `city-begging` may continue to keep internal variants such as `village-catching` and `granary-escort`, but those variants should remain internal minigame detail rather than top-level runtime families

## 20. Forward Applicability

This spec is forward-applicable:

- untouched historical paths may remain temporarily
- once a minigame path is modified, extended, or migrated, the changed path must follow this contract
- new minigames must follow this contract from the start

## 21. Required Tests

Each migrated or new minigame must cover:

- session creation
- core reduce path
- completion path
- cancel path
- presenter output shape
- settlement write-back
- correct handoff back to the owner
- invalid input protection

Repository-level regression checks should also prove:

- `main.ts` does not grow concrete minigame business branches
- runtime can resolve the definition by `minigameId`
- completion can return to the correct owner/session through the formal handoff contract

## 22. Anti-Drift Rules

Do not:

- hardcode concrete minigame business branches in `src/main.ts`
- treat a house module as the long-term runtime owner of a concrete minigame
- return HTML from `application/*`
- store persistent minigame progression in ad hoc top-level globals
- use view handlers to perform direct owner navigation on completion
- duplicate result overlay, confirmation, and write-back flows per minigame
- bypass the handoff contract and guess return targets from shell state

## 23. Acceptance Criteria

This contract is considered repository-ready when:

- all future minigames can be launched by `minigameId`
- all future minigames have one required registry/runtime/presenter/settlement interface family
- completion always carries explicit handoff data
- settlement owns persistent write-back
- the migration path for `activity-qte`, `city-begging`, `grain-accounting`, and `medicine-compounding` is explicit
- the spec forbids new feature-specific branching in `main.ts`

## 24. Recommended Follow-Up

The next executable artifact after this approved spec should be a detailed implementation plan under `docs/superpowers/plans/` that breaks the migration into small, verifiable tasks and records the first promoted execution batch.
