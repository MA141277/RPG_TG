# Event Task Scene Runtime Collaboration Spec

## Status

- Status: `proposed`
- Date: `2026-06-29`
- Owner: `Codex`
- Scope: `Defines the collaboration boundary between Event Runtime, Task / Mission Runtime, and Scene Runtime, plus the content/runtime ownership split needed for Child 3 and later task-runtime extraction.`

---

## 1. Purpose

This spec defines how the project should model event execution, task progression, and scene playback once the project continues its mod-first runtime extraction.

The project must not collapse event triggering, task progression, and scene playback into one mixed subsystem. They must be treated as three parallel runtime subsystems with explicit collaboration boundaries:

- `Event Runtime`
- `Task / Mission Runtime`
- `Scene Runtime`

This spec also defines which concerns belong in:

- `Content / Scenario Packs`
- runtime state
- effect settlement / state sync

The purpose is to make later child plans mechanically clear:

- Child 3 can extract `Navigation + Time + Event + Scene handoff`
- a later child can extract full `Task / Mission Runtime`
- none of those plans need to re-argue who owns triggering, playback, or task state

---

## 2. Core Model

### 2.1 Three Parallel Runtime Subsystems

The runtime must use three parallel subsystems rather than one monolithic "story/event system".

#### Event Runtime

Owns:

- event trigger evaluation
- candidate event collection
- candidate filtering
- priority / cooldown / once checks
- event activation
- deciding whether an event produces direct effects or enters scene playback

Must not own:

- detailed scene node playback
- task state machine ownership
- direct UI rendering
- direct shared-state mutation outside typed runtime results

#### Task / Mission Runtime

Owns:

- task creation
- task advancement
- task completion / failure
- objective progress tracking
- task-state synchronization into shared runtime state
- emitting task-related typed effects and hooks

Must not own:

- event candidate ranking
- detailed scene playback
- direct boot-path branching
- direct UI rendering

#### Scene Runtime

Owns:

- scene session lifecycle
- scene node progression
- dialogue / narration / choice playback
- scene branch resolution
- returning scene results, task signals, and typed effects

Must not own:

- event trigger policy
- task state ownership
- direct shared-state mutation outside typed runtime results
- direct rendering implementation

### 2.2 Collaboration Principle

The three subsystems collaborate through runtime requests, runtime results, typed effects, and task signals.

They do not directly reach into each other's internal state machines.

The governing rule is:

- `Event Runtime` decides whether something should happen now
- `Scene Runtime` decides how an activated event is played out
- `Task Runtime` decides how task state changes over time
- `Effect Settlement / State Sync` decides how final state changes are applied

---

## 3. Content Ownership Versus Runtime Ownership

### 3.1 Content / Scenario Pack Ownership

The following belong in `src/content/scenario-packs/**` or other content-authoring data sources:

- event definitions
- task / mission definitions
- scene definitions
- event chains and `nextEventIds`
- task objectives
- task rewards
- task failure conditions
- NPC affinity / role / location requirements used by authored conditions
- region / season / danger-range restrictions used by authored conditions

Content defines what can happen and under what authored rules.

Content must not store:

- current task progress
- current active scene node
- whether an event has already triggered in the current save
- event cooldown state
- temporary runtime session context

### 3.2 Runtime State Ownership

The following belong in runtime-owned shared state or subsystem session state:

#### Event runtime state

- current active event id
- event-consumption history
- event cooldown tracking
- per-scope trigger memory

#### Task runtime state

- active task list
- task status
- objective progress
- completed / failed markers
- task-stage runtime variables

#### Scene runtime state

- current scene id
- current node id
- scene session branch context
- scene open / closed status

### 3.3 Settlement Ownership

The following do not belong to any one authored content file or one subsystem-specific ad hoc global:

- flags
- variables
- money changes
- time changes
- task state updates
- current-view switching
- synchronized `modState` updates

Those changes must flow through typed runtime output and unified settlement.

---

## 4. Event Type System

The event system must support one common event base shape plus typed specializations. The project must not maintain four completely separate runtime pipelines for common event classes.

### 4.1 Common Event Base

Every event definition should support a shared authored shape conceptually containing:

- `id`
- `type`
- `trigger`
- `conditions`
- `priority`
- `cooldown`
- `once`
- `scope`
- `sceneId`
- `effects`
- `taskActions`
- `nextEventIds`

Exact field names may evolve, but these concepts are required.

### 4.2 Story Events

Story events are the mainline progression class.

Typical characteristics:

- high priority
- often `once = true`
- strongly dependent on task state and mainline flags
- often chained through `nextEventIds`

Runtime policy:

- story events should outrank routine events in the same candidate pass
- story events usually activate scene playback
- story events may directly enqueue follow-up event ids or set effects that unlock later story events

### 4.3 Routine Events

Routine events are repeatable world-loop events.

Typical characteristics:

- repeatable
- cooldown-based
- commonly subscribed to `onDayStart` or `onEnterCity`

Runtime policy:

- routine events must respect cooldown strictly
- routine events should not suppress an eligible higher-priority story event
- routine events may produce direct effects or lightweight scenes

### 4.4 NPC Events

NPC events are relationship- and character-context events.

Typical characteristics:

- `scope = npc`
- conditions depend on NPC affinity, role, bound task state, and location

Runtime policy:

- NPC context must be determined before final candidate evaluation
- once / cooldown / chain state may need to be tracked per NPC scope rather than globally
- NPC events often activate scene playback

### 4.5 Incident Events

Incident events are environment- and randomness-driven events.

Typical characteristics:

- commonly subscribed to `onRandomTick`, `onTravel`, or `onDayStart`
- may include probability
- may include region restrictions
- may include season restrictions
- may include danger-level restrictions

Runtime policy:

- hard conditions must be checked before probability is rolled
- incident events must still use the unified event candidate pipeline
- incident events should not bypass common ranking and activation rules through hand-written feature branches

---

## 5. Standard Runtime Flow

The collaboration flow must follow this sequence:

1. external trigger enters runtime dispatch
2. `Event Runtime` evaluates triggers and candidates
3. chosen event either:
   - produces direct effects
   - activates `Scene Runtime`
   - emits task actions into `Task Runtime`
4. `Scene Runtime` may:
   - produce effects
   - produce task signals
   - end cleanly
5. `Task Runtime` updates task state and may:
   - emit effects
   - emit completion / failure hooks
6. `Effect Settlement / State Sync` applies the final typed changes to shared runtime state
7. follow-up hooks may re-enter `Event Runtime`

### 5.1 Governing Flow Constraints

- `Event Runtime` must not directly own scene node playback
- `Scene Runtime` must not directly own task state machine logic
- `Task Runtime` must not directly own event candidate ranking
- all state mutation must pass through unified settlement / sync seams

---

## 6. Runtime Result Contract Requirements

The collaboration model requires runtime output to carry at least these concepts:

- typed effects
- optional navigation result
- optional scene activation / scene continuation result
- optional task actions or task signals
- optional follow-up event hooks

Exact field names may evolve, but the contract must be capable of carrying those categories without subsystem-specific side channels.

---

## 7. Directory and File Boundary Mapping

### 7.1 Content Layer

Target ownership:

- `src/content/scenario-packs/**`

Expected authored content:

- `events.json`
- `scenes.json`
- `tasks.json` or `missions.json`
- NPC/context support data as needed by authored conditions

### 7.2 Event Runtime Layer

Target ownership:

- `src/core/runtime/**`

Recommended files:

- `event-runtime.ts`
- `event-candidate-selector.ts`
- `event-condition-evaluator.ts`
- `event-activation.ts`

Current migration-era seams likely to feed these:

- `src/application/events/**`
- `src/application/story/**`

### 7.3 Task Runtime Layer

Target ownership:

- `src/core/runtime/**`

Recommended files:

- `task-runtime.ts`
- `task-progress-evaluator.ts`
- `task-state-machine.ts`
- `task-reward-effects.ts`

Current authored / legacy seams likely to feed these:

- `src/domain/mission.ts`
- task logic currently mixed into `src/application/**`

### 7.4 Scene Runtime Layer

Target ownership:

- `src/core/runtime/**`

Recommended files:

- `scene-runtime.ts`
- `scene-session.ts`
- `scene-choice-resolution.ts`

Current migration-era seams likely to feed these:

- `src/application/scene/**`
- `src/domain/story.ts`

### 7.5 Settlement and Sync Layer

Target ownership:

- `src/core/runtime/runtime-settlement.ts`
- `src/core/runtime/state-sync.ts` or equivalent seam

This layer must remain the unified sink for final state mutation.

---

## 8. Child Plan Guidance

### 8.1 Child 3 Scope Guard

Child 3 should cover:

- navigation-driven trigger entry
- time-driven trigger entry
- `Event Runtime` candidate filtering and activation
- scene handoff from `Event Runtime` into `Scene Runtime`

Child 3 should not absorb the full `Task / Mission Runtime`.

Instead, Child 3 should only reserve seams for:

- task actions emitted by events
- task signals emitted by scenes
- runtime result categories capable of carrying task-related outputs

### 8.2 Later Task Runtime Extraction

A later child plan should own:

- full task-state machine extraction
- objective progress evaluation
- completion / failure hooks
- reward / penalty effect emission
- shared runtime synchronization of task state

---

## 9. Anti-Patterns To Reject

The following are explicitly out of bounds for the target architecture:

- one giant `runEvents()` function that also advances tasks and scene nodes
- storing task progress in authored content files
- storing event-consumed flags in authored content files
- allowing UI-facing view models to become runtime state ownership
- hardcoded feature branches in `main.ts` for event-type-specific behavior
- bypassing the common event candidate pipeline for incident events
- treating `Task Runtime` as merely a few helper branches inside `Event Runtime`

---

## 10. Acceptance Criteria

This spec is satisfied only if later plans and code changes preserve these truths:

- Event, Task, and Scene are parallel runtime responsibilities rather than one mixed subsystem
- content definitions remain separate from runtime progress state
- story, routine, NPC, and incident events share one event pipeline with type-specific policy
- task state changes are not hidden inside scene playback or event ranking code
- scene playback is not used as the place where event trigger policy is decided
- settlement and sync remain the unified path for final state mutation

---

## 11. Design Summary

The project should evolve toward a runtime where:

- authored content declares events, tasks, and scenes
- `Event Runtime` decides whether authored events should activate
- `Scene Runtime` plays activated content
- `Task Runtime` owns task state progression
- unified effect settlement applies final state change

That separation is required for a stable mod-first runtime boundary and for later extraction plans to remain small, composable, and testable.
