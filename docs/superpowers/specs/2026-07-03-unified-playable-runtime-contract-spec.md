# Unified Playable Runtime Contract Spec

> **2026-07-31 note:** The current code no longer carries a `family` field on playable definitions, launch requests, active sessions, or presenter models. Older sections in this document that mention `minigame/battle family` describe historical migration context and should be read as superseded unless they are explicitly about archived work.

## 1. Goal

Define one repository-level contract for all playable interaction modules so current and future playables, including `story-battle`, enter the same registration, runtime, presenter, settlement, and owner-handoff pipeline.

The target is:

- external callers launch by playable id
- runtime owns playable lifecycle rather than `main.ts` or individual house branches
- presenter/view consumes one unified shell contract
- settlement writes through unified game/runtime structures
- completion always returns to the correct owner scene/house/session through explicit handoff data
- `story-battle` is included in the same top-level runtime without being flattened into ordinary short-form minigame semantics

## 2. Scope

This spec applies to:

- existing `activity-qte`
- existing `city-begging`
- existing `grain-accounting`
- existing `medicine-compounding`
- existing `story-battle`
- future minigame-like playable modules
- future battle-like playable modules
- any modified legacy playable path once it is touched for feature work, refactor, or extension

This spec defines repository-level structure. It is not house-specific and must not be implemented as a house-local convention.

## 3. Supersession Note

This spec supersedes the repository's minigame-only contract framing for future work.

The previous file:

- `docs/superpowers/specs/2026-07-02-unified-minigame-contract-spec.md`

should be treated as historical design context rather than the current top-level contract source.

Reason:

- the repository needs one unified runtime shell for both minigame-style playables and `story-battle`
- forcing `story-battle` to remain entirely outside the unified playable runtime would preserve duplicated launch, session, presenter, settlement, and owner-return seams
- forcing `story-battle` to masquerade as an ordinary minigame would collapse valid combat-specific semantics

## 4. Why This Spec Exists

The current repository already has several playable systems, but they do not share one stable contract:

- `activity-qte` and `city-begging` are partly inside the interactive runtime family, but still expose feature-specific state and shell coupling
- `grain-accounting` and `medicine-compounding` still exist mostly as local rule helpers and house-local flows instead of full runtime-owned playable modules
- `story-battle` already shares the same interactive dispatch family as some minigames, but that shared family has not yet become a formal registry/runtime/presenter/settlement contract
- UI rendering is not driven by one unified playable presenter shell
- completion and return behavior are not defined as one formal owner-handoff contract across all playable families

Without a repository-level playable spec, future work would continue to duplicate:

- startup branching
- local session shapes
- result overlays
- write-back logic
- return-to-owner logic

That would violate the repository mechanism-first direction and keep `main.ts`, house modules, and local overlays as accidental long-term owners.

## 5. Non-Goals

This spec does not require:

- one generic DSL that replaces all playable-specific rules
- immediate full deletion of all legacy state carriers
- one visual layout shared by every playable
- forcing battle commands to look like ordinary quiz/QTE commands
- rewriting all owner/session contracts in one batch

This spec defines the target contract family and the migration path.

## 6. Core Taxonomy

The repository should use one top-level taxonomy:

- `playable`

Rules:

- all current minigames, `story-battle`, and flow-style playable instances belong to the same top-level playable runtime contract
- runtime/editor behavior must be driven by explicit ids, integrations, layouts, and capabilities rather than one mandatory subtype enum
- the repository must not use `minigame` as a blanket term for all playables once this spec is active

## 7. Current Mismatch Snapshot

Current repository mismatches that this spec resolves:

- `src/core/contracts/interactive-runtime.ts` currently keeps `activity-qte`, `city-begging`, and `story-battle` in one interactive-family union, but without a formal registry/runtime/presenter/settlement contract
- `src/core/runtime/interactive-runtime.ts` still contains feature-specific launch/action routing rather than one definition-driven playable runtime surface
- `src/application/grain-shop/accounting-minigame.ts` and `src/application/medicine-house/compounding-minigame.ts` expose rules but not unified session/runtime/presenter/settlement contracts
- `src/ui/views/minigames/city-begging-minigame-view.ts` is a feature-specific overlay rather than one presenter-shell consumer inside a common playable runtime path
- `story-battle` already lives close to the same interactive seam but historically depended on a separate battle-vs-minigame classification that no longer belongs in the shared contract
- return-to-owner behavior is not yet a mandatory top-level handoff contract for all playable completion paths

## 8. Core Architecture

The target flow is:

```text
playableId -> playable registry -> playable runtime -> presenter shell -> settlement -> owner handoff
```

Ownership rules:

- callers identify the playable by id
- registry resolves the definition
- runtime owns lifecycle state and command dispatch
- presenter shell converts runtime state into render input
- settlement writes persistent changes into canonical gameplay state
- handoff returns to the correct owner via explicit owner metadata, never by shell guessing

## 9. Required Terminology

These terms are required and should be used consistently in code and docs:

- `playableId`
  - unique playable identifier
- `ownerContext`
  - normalized owner metadata captured when the playable starts
- `session`
  - active runtime-owned playable session
- `command`
  - normalized runtime input sent to a playable
- `presenterModel`
  - render-facing playable view model
- `completionResult`
  - unified result payload emitted on completion/cancel
- `handoff`
  - explicit return instruction to the owner flow

Avoid using multiple unrelated names for the same concept such as ad hoc `overlay state`, `local result state`, or `pending return house id`.

## 10. Authoring Responsibility Boundary

This spec must protect future content authors from having to solve repository wiring and placement concerns manually.

Two roles must remain distinct:

- playable/content author
  - defines what the playable is
  - provides playable-facing content, assets, text ids, and any required behavior-specific inputs
- framework/runtime maintainer
  - owns registry integration
  - owns runtime glue
  - owns presenter shell compatibility
  - owns settlement/handoff integration
  - owns canonical directory and asset placement rules

Content authors should only need to care about:

- `playableId`
- `family`
- gameplay mechanism configuration
- question decks, combat templates, progression values, exposed result metrics, and text keys
- playable-specific asset payloads
- explicitly allowed playable-specific rule hooks

Content authors must not be expected to decide:

- victory conditions
- failure conditions
- cancel conditions
- reward and punishment settlement rules
- owner kind, owner id, and story/task/scene/house integration timing
- where code directories live
- where assets are stored
- how runtime registration works
- how to wire `main.ts`
- how to manage owner handoff and post-playable return paths
- how many locations need editing for a new playable to exist

Repository rule:

- if adding a new playable still requires the author to manually solve runtime glue, directory placement, or multi-point registration, the framework is incomplete and must be improved rather than pushing those responsibilities onto the author

Separate authoring responsibilities:

- playable/mechanic author
  - defines how the playable works
  - defines which metrics and details the runtime can observe on completion
- scenario/integration author
  - defines where the playable is launched
  - defines victory/failure/cancel logic
  - defines rewards, punishments, and handoff expectations
- framework/runtime maintainer
  - wires registry/runtime/presenter/settlement/intake placement

## 11. Playable Intake And Asset Placement Rules

New playables must enter the repository through one standardized intake flow.

Target intake model:

```text
author bundle -> canonical placement rules -> playable registry install -> runtime/presenter/settlement integration
```

The author-facing bundle should be treated as the source input. The repository decides final placement.

Minimum author-facing bundle categories:

- playable metadata
- playable mechanism content/configuration
- playable asset list
- playable text keys
- playable-exposed result metric declarations, if the framework requires explicit declaration
- playable-specific behavior inputs, if the framework explicitly allows them

Separate scenario/integration bundle categories:

- owner/integration metadata
- launch trigger information
- outcome configuration
- reward/punishment effect configuration
- handoff-by-outcome configuration
- pre/post playable story/task hooks

Canonical placement rules:

- contract-facing code
  - `src/domain/playables/<id>.ts`
  - `src/application/playables/<id>/...`
  - `src/ui/views/playables/<id>-view.ts`
- shared playable assets
  - `src/assets/playables/<id>/...`
- scenario/pack-owned playable assets
  - `src/content/scenario-packs/<pack>/assets/playables/<id>/...`
- shared playable content/config
  - `src/content/playables/<id>-content.ts` or later equivalent shared content seam
- pack-owned playable content/config
  - scenario-pack-local playable config tables such as `playables/<id>.json` or equivalent manifest-owned split tables
- tests
  - `tests/playables/<id>.test.*`

Rules:

- authors must not invent ad hoc storage paths for new playables
- assets must not be scattered across unrelated house folders purely because the first host flow happens inside a house
- rules logic belongs in `domain/application`; tunable content belongs in `content`
- text ids and content tables must not be silently hardcoded into reducers when they should be data
- a new playable must have one canonical install path into the registry rather than multiple dispersed registration points

Repository intake rule:

- a new playable should be addable through one framework-supported template or intake path
- it must not require editing a long list of unrelated files just to become loadable
- if a playable requires changes to multiple unrelated glue points, that is a framework bug, not an authoring requirement
- the playable/mechanic bundle and the scenario/integration bundle must stay distinct inputs even if one AI later assembles both

## 12. Registry Contract

All playables must register through one unified registry.

Recommended shape:

```ts
export type PlayableFamily = "minigame" | "battle";

export type PlayableId =
  | "activity-qte"
  | "city-begging"
  | "grain-accounting"
  | "medicine-compounding"
  | "story-battle"
  | (string & {});

export type PlayableDefinition = {
  id: PlayableId;
  family: PlayableFamily;
  version: 1;
  kind: string;
  title: string;
  createSession(input: PlayableCreateSessionInput): ActivePlayableSession;
  reduce(input: PlayableReduceInput): PlayableReduceResult;
  present(input: PlayablePresentInput): PlayablePresenterModel;
  settle(input: PlayableSettleInput): PlayableSettlement;
};
```

Rules:

- every playable must have exactly one registered definition
- callers must not import concrete playable business modules to launch them
- `main.ts` must not branch on concrete playable ids
- house modules must not become permanent owners of concrete playable runtime code
- `family` is required and must not be inferred from naming conventions
- the registry install path must be singular and framework-owned
- authors must not need to discover multiple registries or hook lists to add one playable

### 12.1 Playable Integration Instance Contract

`playableId` identifies the reusable mechanic. It does not identify one concrete scenario-owned use site.

The repository must also define one integration-instance identity for each scenario-owned playable entry.

Recommended shape:

```ts
type PlayableIntegrationId = string & {};

type PlayableIntegrationDefinition = {
  integrationId: PlayableIntegrationId;
  playableId: PlayableId;
  ownerDefaults: Partial<PlayableOwnerContext>;
  trigger: PlayableTriggerDefinition;
  outcomeConfig: PlayableOutcomeConfig;
  contentRefs?: Record<string, string>;
};
```

Rules:

- `playableId` identifies the mechanic family member
- `integrationId` identifies one concrete scenario/scene/task/house/external use site
- the same `playableId` may be referenced by many `integrationId` entries
- launch, settlement, rewards, and handoff must resolve against `integrationId`, not by guessing from `playableId` alone
- outcome config, trigger config, and owner defaults belong to the integration definition, not to the mechanic definition
- if a runtime path needs scenario-owned outcome semantics, it must be able to resolve exactly one `integrationId`

## 13. Launch Contract

External callers should launch by playable id.

Minimal caller-facing shape:

```ts
type LaunchPlayableRequest = {
  playableId: string;
  integrationId?: string;
  payload?: Record<string, unknown>;
};
```

Normalized runtime-facing shape:

```ts
type PlayableOwnerKind = "house" | "scene" | "task" | "external";

type PlayableOwnerContext = {
  ownerKind: PlayableOwnerKind;
  ownerId: string | null;
  sessionToken: string | null;
  returnPolicy: "resume-owner" | "reenter-owner" | "close-only";
};

type PlayableLaunchRequest = {
  playableId: string;
  integrationId: PlayableIntegrationId;
  payload?: Record<string, unknown>;
  ownerContext: PlayableOwnerContext;
};
```

Rules:

- external callers may start from `playableId`, but framework launch resolution must normalize to exactly one `integrationId` before session creation
- `house` / `scene` / `task` launches must provide explicit owner metadata or resolvable owner defaults through the integration definition
- only `external` launches may omit owner metadata, and they must normalize to `ownerKind: "external"` plus `returnPolicy: "close-only"` unless a stricter framework rule overrides this
- runtime must normalize missing owner metadata only where this spec explicitly allows it
- a playable must not depend on hidden global owner state to know where to return
- playable-private inputs belong in `payload`, not in new top-level shell globals
- owner metadata belongs to the scenario/integration layer, not to the playable/mechanic authoring layer
- runtime must reject ambiguous launch resolution if multiple integration instances match and no explicit `integrationId` is provided

### 13.1 Trigger Evaluation Contract

Trigger configuration belongs to the scenario/integration layer, but the repository must also define who evaluates it and how a successful trigger becomes a launch request.

Recommended shape:

```ts
type PlayableTriggerDefinition = {
  triggerId: string;
  ownerKind: PlayableOwnerKind;
  when: ConditionDefinition[];
  launchPayload?: Record<string, unknown>;
};

type PlayableTriggerMatch = {
  integrationId: PlayableIntegrationId;
  playableId: PlayableId;
  ownerContext: PlayableOwnerContext;
  payload?: Record<string, unknown>;
};
```

Rules:

- trigger definitions are configured by scenario/integration authors
- trigger evaluation is executed by framework-owned trigger/runtime tooling rather than by playable mechanism code
- a successful trigger evaluation must produce a normalized launch candidate that already carries `integrationId`, `playableId`, and `ownerContext`
- trigger evaluators must not directly instantiate playable sessions; they only produce launchable requests for the playable runtime
- if multiple trigger matches are possible at the same decision point, the enclosing trigger system must resolve that conflict before launch
- trigger evaluation timing may evolve later, but the repository must keep one explicit evaluator owner rather than scattering trigger checks across houses, views, and `main.ts`

## 14. Session Contract

All playables must expose one active session shape.

Recommended shape:

```ts
type ActivePlayableSession = {
  sessionId: string;
  playableId: PlayableId;
  integrationId: PlayableIntegrationId;
  family: PlayableFamily;
  ownerContext: PlayableOwnerContext;
  status: "booting" | "playing" | "result";
  state: Record<string, unknown>;
};
```

Rules:

- the runtime owns the active session
- the active session must carry the resolved `integrationId` for the entire lifecycle
- feature-specific state may live under `state`
- no playable may bypass the session contract by keeping the authoritative flow state in ad hoc UI-only containers

## 15. Command Contract

All runtime interaction with a playable must go through normalized commands.

Recommended baseline:

```ts
type PlayableCommand =
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
- `main.ts` must not mutate playable-internal state directly
- feature-specific behavior may use `custom`, but must still go through the same runtime dispatch surface
- quiz/panel playables are not exempt from the command contract
- battle-family playables may primarily use `custom` commands, and this is valid

## 16. Reduce Contract

Each playable definition must reduce its session through a shared lifecycle surface.

Recommended shape:

```ts
type PlayableReduceInput = {
  session: ActivePlayableSession;
  command: PlayableCommand;
  gameState: GameState;
  now: number;
};

type PlayableReduceResult = {
  session: ActivePlayableSession;
  lifecycle:
    | { type: "continue" }
    | { type: "completed"; result: PlayableCompletionResult }
    | { type: "cancelled"; result: PlayableCompletionResult };
};
```

Rules:

- all playables must move through `createSession -> reduce`
- a playable must not complete by mutating persistent gameplay state directly from view logic
- completion and cancel must emit a formal result

## 17. Presenter Contract

All playables must expose a unified presenter model to a common playable shell.

Recommended shape:

```ts
type PlayablePresenterModel = {
  sessionId: string;
  playableId: PlayableId;
  family: PlayableFamily;
  phase: "booting" | "playing" | "result";
  chrome: {
    title: string;
    subtitle?: string;
    showCancel: boolean;
    showConfirmResult: boolean;
  };
  hud: Array<{ label: string; value: string }>;
  layout: "canvas" | "panel" | "sheet" | "hybrid" | "battlefield";
  viewModel: Record<string, unknown>;
};
```

Rules:

- the shared shell consumes `PlayablePresenterModel`
- feature-specific view code consumes only its own `viewModel`
- application modules must not return HTML strings
- feature-specific UI is allowed, but the runtime/presenter shell contract must stay unified
- `battlefield` layout exists to prevent battle-family playables from being awkwardly flattened into minigame-only layouts

## 18. Result Contract

All playables must emit one unified fact-result shape. Playables do not directly decide victory/failure/reward semantics.

Recommended shape:

```ts
type PlayableFactResult = {
  status: "finished" | "cancelled" | "aborted";
  metrics: Record<string, number | string | boolean>;
  detail?: Record<string, unknown>;
};
```

Rules:

- playables report observable facts, not scenario-owned narrative judgment
- `metrics` is mandatory
- `detail` preserves playable-specific information without fragmenting the top-level contract
- victory/failure/cancel determination happens after fact-result emission through integration-owned outcome config

## 19. Outcome Configuration Contract

Victory/failure/cancel logic and reward/punishment logic belong to the scenario/integration layer.

Recommended shape:

```ts
type PlayableOutcome = "success" | "failure" | "cancelled";

type PlayableOutcomeConfig = {
  successWhen: ConditionDefinition[];
  failureWhen: ConditionDefinition[];
  cancelWhen?: ConditionDefinition[];
  rewardsByOutcome: {
    success?: EffectDefinition[];
    failure?: EffectDefinition[];
    cancelled?: EffectDefinition[];
  };
  handoffByOutcome?: {
    success?: HandoffPolicy;
    failure?: HandoffPolicy;
    cancelled?: HandoffPolicy;
  };
};
```

Rules:

- outcome config belongs to the scenario/integration authoring layer
- the same playable may be reused by different scenarios with different outcome configs
- no playable should hardcode one story-specific victory rule when the runtime can evaluate it from fact results
- if all outcome conditions are absent or contradictory, validation must fail rather than silently guessing

Runtime evaluation rule:

- outcome evaluation must be deterministic
- if `factResult.status` is `cancelled`, the runtime must produce `cancelled` without requiring `cancelWhen`
- if `factResult.status` is `aborted`, the base repository rule must resolve it as `failure` unless a future explicit contract extends outcome taxonomy
- otherwise the runtime must evaluate configured conditions against the same `PlayableFactResult`
- if more than one non-cancel outcome matches at runtime, settlement must fail as a configuration error rather than silently choosing one
- if no configured non-cancel outcome matches, settlement must fail as a configuration error rather than inferring success or failure

## 20. Missing Configuration Semantics

The repository must define fail-closed vs explicit-fallback behavior for incomplete scenario/integration configuration.

### 20.1 Trigger Configuration Missing

If a playable is intended to be launched through scenario/house/scene/task/external orchestration and its launch trigger information is missing:

- integration validation must fail
- the playable must not become executable through implicit runtime guessing
- authors must not rely on ad hoc manual shell wiring as a fallback

Rule:

- missing trigger configuration is a configuration error, not a signal to infer one

### 20.2 Owner Configuration Missing

If required owner metadata such as `ownerKind` or `ownerId` is missing for an integration path that requires them:

- launch validation must fail
- runtime must not fabricate owner identity from unrelated shell state

Rule:

- missing owner configuration is fail-closed
- the only allowed omission path is an explicitly external launch that normalizes to `ownerKind: "external"` and `returnPolicy: "close-only"`

### 20.3 Outcome Conditions Missing

If `successWhen`, `failureWhen`, and `cancelWhen` are all absent, empty, or contradictory:

- validation must fail
- settlement must not guess success or failure from arbitrary heuristics

Rule:

- outcome semantics are integration-owned and mandatory enough that a total absence is invalid

### 20.4 Reward / Punishment Configuration Missing

If `rewardsByOutcome` is missing for one or more outcomes:

- the default fallback is an explicit empty effect list for the missing outcome
- this fallback is allowed only when the outcome conditions themselves are valid

Rules:

- missing effect lists do not authorize runtime inference of reward logic
- validators may later introduce stricter policy for specific packs or authoring modes, but the base repository rule is explicit empty-effects fallback rather than guessed effects

### 20.5 Handoff Configuration Missing

If `handoffByOutcome` is missing for one or more outcomes:

- runtime may fall back to `ownerContext.returnPolicy`
- if `ownerContext.returnPolicy` is also absent or invalid, validation must fail

Rules:

- handoff fallback must be explicit and documented
- runtime must not invent a new return destination from shell heuristics

### 20.6 Partial Configuration Rule

Partial configuration is allowed only where the spec explicitly defines fallback semantics.

Allowed examples:

- missing `rewardsByOutcome.success` -> empty effects
- missing `handoffByOutcome.failure` -> fallback to `ownerContext.returnPolicy`

Not allowed examples:

- missing launch trigger information
- missing owner identity when the integration path requires one
- missing all outcome conditions

### 20.7 Validation Responsibility

Validation should happen before a playable is treated as ready for normal use.

Validation owners may evolve later, but the repository rule is:

- configuration completeness must be checked by framework/runtime validation tooling
- playable mechanism code must not silently absorb missing integration configuration
- if a future editor owns more of this validation, it still must follow the same fail-closed/fallback rules defined here

Required validation surfaces:

- mechanic bundle validation
- integration bundle validation
- trigger graph validation
- launch resolution validation
- outcome evaluation exclusivity/completeness validation
- handoff recoverability validation

## 21. Settlement Contract

All persistent playable effects must flow through unified settlement.

Recommended shape:

```ts
type PlayableSettlement = {
  integrationId: PlayableIntegrationId;
  outcome: PlayableOutcome;
  factResult: PlayableFactResult;
  gameState: GameState;
  effects: RuntimeEffect[];
  handoff: {
    type: "resume-owner" | "reenter-owner" | "close-only";
    ownerKind: PlayableOwnerKind;
    ownerId: string | null;
    sessionToken: string | null;
  };
};
```

Rules:

- reducer may compute a fact result, but settlement owns persistent write-back
- settlement evaluates `PlayableOutcomeConfig` against `PlayableFactResult` for exactly one resolved `integrationId`
- persistent changes must flow through unified gameplay/runtime state structures
- no playable may store durable progression data in ad hoc top-level globals
- initialization must not overwrite player base stats, money, skills, or inventory as a hidden setup shortcut
- settlement must not guess integration-owned outcome semantics from mechanic-local heuristics

## 22. Battle-Specific Boundary Rules

`story-battle` is included in the unified playable runtime, but must keep battle-specific semantics.

Rules:

- `story-battle` must register as `family: "battle"`
- battle-family playables must be allowed to expose battle-specific `detail` and `viewModel`
- battle-family playables may use `custom` command channels as their primary action surface
- do not rename battle actions into fake minigame vocabulary just for symmetry
- do not flatten battle state into quiz/QTE-style state shape for convenience-only reasons
- shared shell utilities may be reused, but battle-specific meaning must remain explicit in contracts and naming

## 23. Owner Return And Session Recovery Rules

Returning to the correct owner is a hard requirement.

Allowed handoff policies:

- `resume-owner`
  - return to the suspended owner session when the owner session is still valid
- `reenter-owner`
  - re-enter the owner container from normalized owner identity when session restore is not the right fit
- `close-only`
  - close the playable and leave follow-up to the enclosing runtime

Rules:

- every completion path must resolve exactly one handoff after outcome evaluation
- the return path must be driven by `ownerContext`, outcome config, and the emitted handoff
- no playable may directly navigate back from view code
- `main.ts` must not grow feature-specific return branches for individual playables

Session recovery contract:

- `sessionToken` must be issued by the framework-owned owner runtime when a resumable owner session is suspended for playable entry
- the token must resolve to one restorable owner session snapshot or owner-session handle through a framework-owned recovery store
- `resume-owner` is valid only when that recovery lookup succeeds
- if `resume-owner` is requested but the token is missing, invalid, expired, or no longer recoverable, handoff resolution must follow an explicit fallback rule defined by framework policy
- the default fallback should be `reenter-owner` when `ownerKind` and `ownerId` are still valid; otherwise validation or runtime recovery must fail closed
- `close-only` must not be used as a silent escape hatch for broken recovery when the integration expected resumable ownership
- recovery rules must be testable without depending on view-layer navigation state

## 24. File And Directory Structure

Each new or migrated playable should follow one focused file family.

Recommended structure:

- `src/domain/playables/<id>.ts`
- `src/application/playables/<id>/<id>-definition.ts`
- `src/application/playables/<id>/<id>-session.ts`
- `src/application/playables/<id>/<id>-presenter.ts`
- `src/application/playables/<id>/<id>-metrics.ts`
- `src/application/playables/<id>/<id>-settlement.ts`
- `src/ui/views/playables/<id>-view.ts`
- `tests/playables/<id>.test.*`

Responsibilities:

- `domain`
  - types, rules, and pure state structures
- `application`
  - session creation, reduction, presenter mapping, settlement
- `ui`
  - render-only consumption of presenter output

Transitional note:

- existing directories such as `src/application/minigames/**`, `src/ui/views/minigames/**`, and `src/application/story-battle/**` may remain during migration
- new contract-facing work should target the playable taxonomy even if old file locations are temporarily retained

Additional boundary rule:

- this file structure is a repository contract, not an author choice
- creators of new playables should fill a supported bundle/template and let the framework decide these canonical locations
- outcome/integration config should not be buried in the playable mechanism files when it is scenario-owned data

## 25. Authoring Artifact Model

The repository should eventually standardize two separate author-facing templates:

- `Playable Mechanic Brief`
  - describes the playable mechanism and exposed metrics
- `Playable Integration Brief`
  - describes launch owner, outcome rules, rewards/punishments, and handoff expectations

Rules:

- do not merge these two concerns into one authoring responsibility by default
- if one human or AI happens to provide both, the repository should still preserve the separation in stored artifacts and generated code/config

Stored artifact rule:

- each playable mechanic must produce one canonical mechanic artifact
- each scenario-owned playable use site must produce one canonical integration artifact
- mechanic artifacts and integration artifacts must be independently addressable by tooling, review, and validation
- generated code must preserve the same separation rather than flattening integration semantics back into mechanic files

### 25.1 Scaffolding, Validation, And CI Enforcement

This spec is not closed-loop unless the repository enforces it through tooling.

Required repository-owned enforcement artifacts:

- one scaffold entry for new playable mechanics such as `npm run scaffold:playable`
- one scaffold entry for new scenario/integration entries such as `npm run scaffold:playable-integration`
- one validation entry such as `npm run validate:playables`
- one CI gate that runs playable validation before merge
- one canonical schema or equivalent typed validator for mechanic artifacts
- one canonical schema or equivalent typed validator for integration artifacts

Rules:

- adding a new playable must not require manual discovery of file placement or registry glue beyond the scaffolded path
- adding a new integration instance must not require ad hoc edits across unrelated launch/settlement files
- pull requests that introduce or modify playable artifacts must fail CI when scaffold expectations or validation rules are broken
- AI-generated playable work must be judged against the same scaffold and validation surfaces as human-authored work
- if the repository cannot scaffold or validate a claimed supported playable path, that is a framework gap and must be fixed at the framework layer

Current repository implementation:

- mechanic artifacts live at `src/content/playables/<playableId>.playable.json`
- integration artifacts live at `src/content/playable-integrations/<integrationId>.integration.json`
- mechanic scaffolding entrypoint is `npm run scaffold:playable` -> `tools/scaffold-playable.mjs`
- integration scaffolding entrypoint is `npm run scaffold:playable-integration` -> `tools/scaffold-playable-integration.mjs`
- validation entrypoint is `npm run validate:playables` -> `tools/validate-playables.mjs`
- CI enforcement entrypoint is `.github/workflows/validate-playables.yml`

Scaffolded canonical file layout:

- `src/domain/playables/<playableId>.ts`
- `src/application/playables/<playableId>/<playableId>-definition.ts`
- `src/application/playables/<playableId>/<playableId>-session.ts`
- `src/application/playables/<playableId>/<playableId>-presenter.ts`
- `src/application/playables/<playableId>/<playableId>-metrics.ts`
- `src/application/playables/<playableId>/<playableId>-settlement.ts`
- `src/ui/views/playables/<playableId>-view.ts`
- `src/assets/playables/<playableId>/`

## 26. Migration Strategy

Migration must be gradual rather than one-shot.

### Phase 1: Introduce Unified Skeleton

Add:

- playable registry
- playable runtime contracts
- playable session/result/handoff contracts
- shared presenter shell
- this repository-level spec

Keep existing rules and feature views where possible.

### Phase 2: Migrate `activity-qte` And `city-begging`

Reason:

- both already behave like runtime-owned short-form playables
- they provide the first real proof of the unified contract

Direction:

- move feature-specific launch/action routing behind playable definitions
- preserve current core rules and variants
- keep user-facing behavior stable
- extract fact-result metrics from existing success/failure paths before moving scenario-owned reward logic into outcome config

### Phase 3: Migrate `grain-accounting` And `medicine-compounding`

Reason:

- both already have reusable rule cores
- both lack unified session/presenter/settlement shells

Direction:

- promote them from house-local mechanisms to full playable definitions
- unify result overlay, confirmation, settlement, and owner return
- move grade/reward determination toward `fact result + outcome config` instead of keeping all success semantics hardcoded inside house-local flows

### Phase 4: Migrate `story-battle` Into The Playable Registry

Reason:

- it already lives near the same interactive runtime seam
- it should share launch/session/presenter/settlement/handoff shell ownership

Direction:

- register `story-battle` as `family: "battle"`
- preserve battle-specific command semantics and view model
- remove battle-specific dispatch special casing where a definition-driven contract can take over
- expose battle completion facts such as objective completion and unit state so scenario-owned outcome config can decide post-battle settlement

### Phase 5: Delete Legacy Direct Paths

After the migrated definitions prove stable:

- remove feature-specific startup/closeout branches from `main.ts`
- remove long-term direct house-module to concrete-playable wiring
- reduce old compatibility carriers that no longer own production behavior

## 27. Existing Module Mapping

Recommended repository ids:

- `activity-qte`
- `city-begging`
- `grain-accounting`
- `medicine-compounding`
- `story-battle`

Recommended family mapping:

- `activity-qte`
  - `family: "minigame"`
- `city-begging`
  - `family: "minigame"`
- `grain-accounting`
  - `family: "minigame"`
- `medicine-compounding`
  - `family: "minigame"`
- `story-battle`
  - `family: "battle"`

Recommended owner-return defaults:

- `activity-qte`
  - usually `resume-owner`
- `city-begging`
  - usually `reenter-owner`
- `grain-accounting`
  - usually `reenter-owner` or `resume-owner` depending on host flow
- `medicine-compounding`
  - usually `reenter-owner` or `resume-owner` depending on host flow
- `story-battle`
  - usually `reenter-owner` or `resume-owner` depending on post-battle story ownership

Variant note:

- `city-begging` may continue to keep internal variants such as `village-catching` and `granary-escort`, but those variants should remain internal playable detail rather than top-level runtime families

## 28. Forward Applicability

This spec is forward-applicable:

- untouched historical paths may remain temporarily
- once a playable path is modified, extended, or migrated, the changed path must follow this contract
- new playables must follow this contract from the start
- new playable authoring must go through the repository-owned intake and placement rules rather than ad hoc local conventions

## 29. Required Tests

Each migrated or new playable must cover:

- session creation
- core reduce path
- fact-result completion path
- cancel path
- presenter output shape
- outcome-config evaluation
- missing-config validation behavior
- settlement write-back
- correct handoff back to the owner
- invalid input protection

Repository-level regression checks should also prove:

- `main.ts` does not grow concrete playable business branches
- runtime can resolve the definition by `playableId`
- completion can return to the correct owner/session through the formal handoff contract
- `story-battle` is routed through the same top-level playable registry while still preserving battle family semantics
- new playable intake does not require multi-point manual glue beyond the framework-owned install path
- victory/failure/reward semantics can be changed by integration config without rewriting playable mechanism code
- trigger/owner/outcome config gaps fail closed where this spec requires them to fail closed
- one `playableId` can be reused by multiple `integrationId` entries without settlement or handoff ambiguity
- trigger evaluation produces exactly one normalized launch request or a typed failure
- `resume-owner` recovery succeeds through framework-owned session restoration rather than view-state guessing
- broken or expired session recovery does not silently fall through to unrelated shell behavior
- scaffold and validator commands reject malformed mechanic or integration artifacts before runtime launch

## 30. Anti-Drift Rules

Do not:

- hardcode concrete playable business branches in `src/main.ts`
- treat a house module as the long-term runtime owner of a concrete playable
- return HTML from `application/*`
- store persistent playable progression in ad hoc top-level globals
- use view handlers to perform direct owner navigation on completion
- duplicate result overlay, confirmation, and write-back flows per playable
- bypass the handoff contract and guess return targets from shell state
- collapse battle-family playables into minigame-only terminology, registry assumptions, or settlement branches for convenience-only reasons
- require content authors to manually decide canonical folder placement, asset management strategy, or multi-point runtime registration
- treat framework glue work as part of ordinary playable content authoring
- hardcode story-specific victory/failure/reward logic into playable mechanism code when it belongs in integration config
- silently guess missing trigger, owner, or outcome configuration when this spec marks those cases as validation errors

## 31. Acceptance Criteria

This contract is considered repository-ready when:

- all future playables can be launched by `playableId`
- every scenario-owned playable use site can be identified by one `integrationId`
- all future playables have one required registry/runtime/presenter/settlement interface family
- completion always carries explicit handoff data
- settlement owns persistent write-back
- the migration path for `activity-qte`, `city-begging`, `grain-accounting`, `medicine-compounding`, and `story-battle` is explicit
- `story-battle` is included inside the unified playable runtime while retaining `family: "battle"`
- the spec forbids new feature-specific branching in `main.ts`
- the spec makes canonical code/content/asset placement framework-owned rather than author-owned
- content authors can focus on playable content without solving runtime glue and repository placement manually
- playable mechanism authors do not own victory/failure/cancel/reward semantics
- scenario/integration authors can configure outcome semantics without rewriting playable mechanism code
- missing configuration semantics are explicit rather than inferred ad hoc at runtime
- trigger evaluation ownership is explicit rather than scattered through house/scene/view code
- owner session recovery rules are explicit enough to guarantee correct return to scenario/scene/session
- validator, scaffold, and CI gates make this contract enforceable rather than advisory only

## 32. Recommended Follow-Up

The next executable artifact after this approved spec should be a detailed implementation plan under `docs/superpowers/plans/` that breaks the migration into small, verifiable tasks and records the first promoted execution batch.

Plan authoring rule:

- new playable work, legacy playable migration work, and house/scene playable-extraction work should start from `docs/superpowers/plans/_playable-plan-template.md`
- concrete active plans must still conform to `docs/superpowers/plans/_plan-template.md` and `docs/superpowers/specs/plan-governance-spec.md`
