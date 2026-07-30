# Event Router Runtime Core Design

## 1. Goal

Define a phased migration path that brings the usable event-router / settlement-runtime core from `mod-first-dev` into the current baseline, then re-centers gameplay orchestration around one rule:

- every functional gameplay entry must become an event trigger
- every event trigger must resolve through one event router
- every concrete effect must be executed by a runtime selected by that router

This design intentionally separates the runtime core migration from later script-editor and scenario-pack schema cleanup so the project can stabilize the execution model first.

## 2. Target Principle

The project core should become:

`trigger source -> eventId -> event router -> event entity payload -> target runtime -> settlement / continuation -> optional next events`

Interpretation:

- trigger sources do not directly execute gameplay behavior
- event entities describe intent and payload
- the event router is the only allowed business dispatch bridge
- target runtimes execute one bounded kind of behavior
- settlement is centralized rather than encoded ad hoc on items, menus, house actions, or dialogue nodes

Examples under the target model:

- using an HP potion emits an `eventId`; the resulting HP increase is produced by settlement runtime
- clicking a menu action emits an `eventId`; the router decides whether it launches dialogue, navigation, playable, or settlement work
- entering a city, choosing dialogue, finishing a playable, or triggering a story condition all converge onto the same event-routing entry
- an event may emit one or more follow-up events, but only through the router-managed event chain

## 3. Problem Statement

The current branch already has several runtime seams, but orchestration is still fragmented:

- some paths still route through direct runtime-specific callers instead of a single event-routing core
- event activation, event binding, dialogue, navigation, playable completion, and settlement logic are not yet centered on one canonical event entity model
- the script editor and scenario-pack structures are still evolving, and current preview/export paths are not stable enough to serve as the first migration target

At the same time, `mod-first-dev` already proves a more event-centric runtime shape. The immediate need is therefore not a full branch merge, but a controlled migration of the runtime kernel that can survive future content-schema changes.

## 4. Design Constraints

### 4.1 Runtime-First Constraint

The first migration stage must move the event-routing core before attempting a full script-editor or pack-schema rewrite.

Rationale:

- the runtime execution model is the stable center
- external authoring tables are still likely to change
- importing unstable authoring shapes directly into the new core would cause repeat rework

### 4.2 Single Router Constraint

No new gameplay feature may bypass the event router once the router core is introduced.

Allowed:

- thin trigger adapters that translate existing calls into `eventId`
- compatibility bridges that convert old content shapes into canonical event entities

Disallowed:

- new direct calls from feature modules into navigation/dialogue/playable/settlement runtimes
- new item, menu, or house action logic that mutates core gameplay state without passing through routed event execution

### 4.3 Settlement Centralization Constraint

Persistent gameplay mutation must converge through one settlement runtime command model rather than remain encoded on arbitrary feature entities.

Examples of mutation to centralize:

- HP / stamina / fatigue
- money
- inventory
- flags and runtime variables
- task progress
- city / building / character status changes
- progression and settlement instances

### 4.4 Controlled Event-Chain Constraint

Events may trigger events, but only through a managed event-chain engine with explicit safety rules.

Required guardrails:

- chain depth limit
- visited / loop protection
- explicit ordering semantics
- no arbitrary recursive `startEvent(...)` style behavior in feature modules

## 5. Canonical Runtime Model

### 5.1 Trigger Source

A trigger source is any caller that wants something to happen. It does not own gameplay logic. It only emits an `eventId` plus source metadata.

Representative sources:

- event bindings
- navigation timing
- dialogue choice
- item use
- menu action
- house / building action
- playable or minigame completion
- runtime continuation emitted by a previous event

### 5.2 Event Entity

The runtime must introduce a canonical internal event entity shape. This is the runtime truth even if authoring tables remain different in phase one.

Proposed envelope:

```ts
type EventEntity = {
  id: string;
  kind:
    | "dialogue"
    | "navigation"
    | "menu"
    | "playable"
    | "settlement"
    | "composite"
    | "bridge";
  payload: Record<string, unknown>;
  nextEventId?: string | null;
  emitEventIds?: string[];
  metadata?: {
    title?: string;
    tags?: string[];
  };
};
```

Interpretation:

- `kind` chooses the target runtime
- `payload` is the event-specific data
- `nextEventId` is for linear continuation
- `emitEventIds` is for multi-event fan-out

### 5.3 Event Router

The event router is the only allowed business dispatch owner.

Its responsibilities are intentionally narrow:

1. resolve an `eventId` to a canonical event entity
2. select the correct target runtime based on entity kind
3. hand back runtime results in a standardized shape
4. forward any next / emitted events into the event-chain engine

The router must not become a giant feature switchboard. It is a dispatch owner, not the place where feature business logic lives.

### 5.4 Target Runtimes

The router should dispatch into bounded runtimes. Initial families:

- `dialogue event runtime`
- `navigation event runtime`
- `menu event runtime`
- `playable event runtime`
- `settlement event runtime`
- `composite event runtime`

These runtimes may emit settlement commands or follow-up events, but they do not directly own broad cross-feature orchestration.

### 5.5 Settlement Commands

Gameplay mutation must be expressed as commands, then applied centrally.

Proposed shape:

```ts
type SettlementCommand =
  | { type: "character.hp.add"; characterId: string; value: number }
  | { type: "character.stamina.add"; characterId: string; value: number }
  | { type: "money.add"; characterId: string; value: number }
  | { type: "inventory.add"; itemId: string; quantity: number }
  | { type: "inventory.remove"; itemId: string; quantity: number }
  | { type: "flag.set"; key: string; value: boolean }
  | { type: "task.input"; input: unknown }
  | { type: "city.patch"; cityId: string; patch: Record<string, unknown> }
  | { type: "building.patch"; buildingId: string; patch: Record<string, unknown> };
```

This command set does not need to be complete in phase one. The requirement is that the runtime establishes the pattern and stops adding new direct state mutation paths outside settlement runtime.

### 5.6 Event Chain Engine

The event system must explicitly support:

- event triggers event
- event triggers multiple follow-up events
- event triggers settlement and then continuation

It should do so through standardized continuation fields rather than ad hoc feature calls.

Recommended semantics:

- `nextEventId`: single ordered continuation
- `emitEventIds[]`: multiple follow-up events
- execution remains router-owned

Safety rules:

- max chain depth
- duplicate event guard per chain execution frame
- deterministic ordering

## 6. Phase Plan

### 6.1 Phase A: Migrate Runtime Core Only

Goal:

- bring the event-router core, event-chain handling, and settlement-runtime command model into the current branch

Allowed files:

- `src/core/contracts/**`
- `src/core/runtime/**`
- minimal `src/application/**` adapters only where required to feed the new router

Not yet allowed:

- broad UI rewiring
- broad `src/main.ts` redesign
- script-editor schema rewrite
- content-pack table unification

Required output:

- canonical internal event entity shape
- event repository / router entry
- router-selected runtimes
- event-chain execution support
- centralized settlement command application

### 6.2 Phase B: Replace Direct Runtime Callers With Trigger Adapters

Goal:

- convert existing runtime-specific entry paths into thin trigger adapters

Initial targets:

- event binding entry
- story trigger entry
- navigation timing entry
- dialogue continuation entry
- playable completion entry

Rule:

- these callers may still exist, but they should only emit `eventId` and call the router

### 6.3 Phase C: Move Instance Systems Onto Events

Goal:

- items, menus, houses, building actions, and other instance-owned actions stop carrying direct business behavior

Result:

- item use emits `eventId`
- menu action emits `eventId`
- house action emits `eventId`
- location access consequences emit `eventId`

This is the stage where the project meaningfully becomes “all instances are event-driven.”

### 6.4 Phase D: Script Editor Export / Preview Convergence

Goal:

- keep current authoring tables if needed, but export and preview through the canonical runtime event model

Requirements:

- preview must route through the same event router as runtime gameplay
- export lowers current authoring records into canonical event entities
- validation must check event-chain correctness, missing references, and type/payload consistency

### 6.5 Phase E: External Schema Unification

Goal:

- after runtime and preview stabilize, reduce authoring-table drift and move script packages toward an explicitly event-centered schema

This phase should happen last because it changes the least stable layer.

## 7. Script Editor Implications

The script editor should gradually change from “configure module-specific behavior” into “author an event graph.”

### 7.1 What Must Change First

- export path lowers authoring records into canonical event entities
- preview path dispatches by `eventId` through the shared router
- validation understands event chain, event kind, and event payload expectations

### 7.2 What Can Wait

- full redesign of project file formats
- full rewrite of editor UI language
- collapsing every current table into one event table

### 7.3 End-State Authoring Direction

Long term, authors should mostly express:

- what emits an event
- which event is emitted
- what type that event is
- what follow-up events it emits

instead of embedding direct behavior logic on items, menus, or house actions.

## 8. File Strategy

### 8.1 Core Runtime Targets

Primary migration focus:

- `src/core/contracts/event-runtime.ts`
- `src/core/contracts/runtime-result.ts`
- `src/core/contracts/effect-settlement.ts`
- new or updated canonical event entity / router contracts under `src/core/contracts/**`
- `src/core/runtime/event-binding-runtime.ts`
- `src/core/runtime/event-activation.ts`
- `src/core/runtime/runtime-router.ts`
- `src/core/runtime/runtime-dispatch.ts`
- `src/core/runtime/runtime-settlement.ts`
- new router / repository / chain helpers under `src/core/runtime/**`

### 8.2 Transitional Application Adapters

Only minimal bridges in:

- `src/application/runtime/**`
- `src/application/story/**`
- `src/application/events/**`
- instance-specific emitters such as item/menu/house entry adapters

These adapters should get thinner over time, not smarter.

### 8.3 Script Editor / Pack Targets For Later Phases

Later work will center on:

- `src/modules/script-editor/application/runtime-pack-export.ts`
- `src/modules/script-editor/application/runtime-pack-import.ts`
- `src/modules/script-editor/application/story-dialogue-event-authoring.ts`
- `src/modules/script-editor/application/menu-authoring.ts`
- `src/modules/script-editor/application/city-building-authoring.ts`
- `src/modules/script-editor/application/minimal-workflow.ts`
- `src/application/scenario/scenario-pack-loader.ts`
- scenario-pack files under `src/content/scenario-packs/**`

## 9. Risks

### 9.1 Accidental Full-Branch Merge

`mod-first-dev` changes far more than the event-router core. Pulling it wholesale would mix runtime migration with script-editor, scenario-pack, naming, and transition changes that the current branch is not ready to absorb.

Mitigation:

- migrate only the kernel concepts first
- use adapters at the branch boundary

### 9.2 Router Bloat

If every special case lands inside the router, the router will become a new `main.ts`.

Mitigation:

- router only resolves and dispatches
- real behavior stays in bounded target runtimes

### 9.3 Premature Schema Freeze

If the editor or pack schema is normalized before runtime truth is stable, the project will likely repeat schema churn.

Mitigation:

- keep external schema flexible in early phases
- make canonical runtime event entities the actual source of truth first

### 9.4 Unbounded Event Chains

Supporting “event triggers event” without chain control will create infinite loops and debugging failures.

Mitigation:

- introduce depth and cycle guards as part of the initial router-chain design

## 10. Exit Criteria For Phase-One Acceptance

Phase one is successful only when:

1. the current branch has a canonical internal event entity model
2. one shared event router owns event-id-to-runtime dispatch
3. one settlement runtime owns standardized gameplay mutation commands
4. events can emit follow-up events only through a controlled event-chain mechanism
5. existing runtime-only entry paths can be adapted into thin event emitters instead of direct feature callers
6. script-editor preview/export is explicitly deferred to a later integration phase rather than blocking the kernel migration

## 11. Recommendation

Proceed with a runtime-first migration:

- migrate the event-router kernel from `mod-first-dev`
- keep current external authoring tables temporarily
- lower legacy authoring shapes into canonical runtime event entities
- replace direct runtime callers with trigger adapters
- only after runtime stabilization, redesign script-editor preview/export and unify pack schema

This path best preserves forward progress while still aligning the project with the desired event-centered architecture.
