# Generic Meeting Review Module Design

## 1. Goal

Design a production-grade generic meeting/review framework that any building can mount from day one.

The framework must:

- let any building, organization, or city-owned location start a meeting through shared bindings
- move meeting/review mechanism ownership out of concrete house modules
- keep authored meeting content in scenario packs and execute it through the mod/runtime framework
- preserve the current UI shell, visible feature behavior, and pre-merge story order while temple and keep review flows are migrated

This is mechanism work, not a temple-only refactor.

## 2. Current Repository State

The current branch already contains several reusable review pieces, but the full meeting state machine is still split across concrete house modules.

- `src/application/review/*` and `src/domain/review.ts` already own shared review helpers such as rank lookup, contribution settlement, policy panel data, assignment rows, and task gating.
- `src/application/house-modules/temple-house/temple-house-house-module.ts` still owns the temple review session state machine, including `intro -> assignment-table -> praise -> situation -> policy -> advice -> assign-duty/assigned/reward/personnel` transitions.
- `src/application/house-modules/keep-house/keep-house-house-module.ts` owns a similar but separate keep review state machine.
- `src/domain/house-module.ts` and shared house rendering already support `review-assignment-table` and `review-policy-panel` overlay variants.
- Temple review entry, temple donate, temple leave, and temple work front doors are already moving toward `building-container-item -> pack event / pack dialogue -> current house shell`.
- The branch does not yet have a generic runtime-owned `meeting session` contract that a building host can launch and resume independently of a concrete house module.

Current mismatches:

- meeting/review flow ownership is still mixed with house-shell ownership
- temple and keep still keep parallel meeting-stage enums and dispatch branches
- scenario packs can own review entry content, but they do not yet own the full meeting flow contract
- new buildings cannot mount a meeting flow without copying a house-local meeting state machine

## 3. Problem Statement

The current architecture still couples three concerns that should be separated:

1. **Host shell**
   - which building/location the player is inside
   - which roster and status card are shown
   - where to return when the meeting ends

2. **Meeting mechanism**
   - stage machine
   - choice handling
   - policy/assignment/reward/personnel flow
   - state write-back

3. **Meeting content**
   - dialogue
   - stage order
   - choice labels
   - reward copy
   - policy text
   - assignment candidates

Keeping those three concerns inside `temple-house` or any future building module will recreate the same ownership tangle the branch is currently removing from startup and temple runtime paths.

## 4. Design Principles

The production design must follow these rules:

- no new meeting business branches in `src/main.ts`
- no meeting-specific HTML returned from `application/*`
- no new one-off compat layers spread across buildings
- the meeting mechanism must be reusable by any building from the first shipped version
- scenario pack data should own meeting content and content-driven transitions
- shared runtime code should own stage execution, validation, and state write-back mechanisms
- concrete house/building modules should remain hosts, not full meeting-flow implementations

## 5. Recommended Architecture

Introduce a dedicated generic meeting subsystem with three layers:

### 5.1 Host Layer

The host layer remains the concrete building, city location, or organization entry.

Responsibilities:

- determine whether the current entry can launch a meeting
- resolve the meeting binding for the current action
- supply host context such as participants, active building id, and return target
- render the current meeting model inside the existing shell

Non-responsibilities:

- it does not own the meeting stage machine
- it does not decide stage transitions
- it does not hardcode meeting copy or reward logic

### 5.2 Generic Meeting Runtime Layer

Add a reusable meeting runtime under:

- `src/domain/meeting/*`
- `src/application/meeting/*`
- optionally `src/core/runtime/meeting-runtime.ts` if runtime dispatch ownership needs a separate seam

Responsibilities:

- start a meeting session from authored meeting content
- advance stages
- validate and apply player choices
- derive overlays, dialogue, and action lists
- execute shared write-back actions
- complete the meeting and return control to the host

### 5.3 Scenario-Pack Content Layer

Scenario packs own authored meeting definitions and bindings.

Responsibilities:

- meeting definitions
- stage ordering
- stage text/dialogue references
- branch conditions
- choice content
- policy/assignment/reward/personnel authored data
- content-driven write-back configuration

Non-responsibilities:

- direct DOM/UI rendering
- direct mutation of application shell state
- arbitrary code execution inside the pack layer

## 6. Core Runtime Contract

The generic meeting system should expose stable contracts equivalent to the following semantics.

### 6.1 Meeting Definition

```ts
type MeetingDefinition = {
  id: string;
  hostScope: {
    family: "building" | "city" | "organization" | "faction";
    templateId?: string;
  };
  initialStageId: string;
  stageIds: string[];
  stagesById: Record<string, MeetingStageDefinition>;
  completion?: MeetingCompletionDefinition;
};
```

### 6.2 Meeting Stage Definition

```ts
type MeetingStageDefinition = {
  id: string;
  type:
    | "dialogue"
    | "summary"
    | "policy-panel"
    | "choice"
    | "assignment-table"
    | "reward"
    | "personnel-update"
    | "action"
    | "branch";
  dialogueId?: string;
  textLineIds?: string[];
  panelId?: string;
  choiceSetId?: string;
  actionSetId?: string;
  nextStageId?: string;
};
```

### 6.3 Meeting Session State

```ts
type MeetingSessionState = {
  meetingId: string;
  hostContext: MeetingHostContext;
  currentStageId: string;
  visitedStageIds: string[];
  selectedChoiceIds: string[];
  derivedState: Record<string, unknown>;
  overlayState: MeetingOverlayState | null;
  status: "running" | "completed" | "cancelled" | "blocked";
};
```

### 6.4 Meeting Host Context

```ts
type MeetingHostContext = {
  hostFamily: "building" | "city" | "organization" | "faction";
  hostId: string;
  returnTarget: {
    type: "building" | "city" | "view";
    id: string;
  };
  primarySpeakerCharacterId?: string;
  participantCharacterIds: string[];
};
```

### 6.5 Meeting Result

```ts
type MeetingRuntimeResult = {
  gameState: GameState;
  characterDefinitions: CharacterDefinition[];
  sessionState: MeetingSessionState | null;
  completion?: {
    type: "return-to-host" | "follow-up-event" | "start-map-auto-advance";
  };
};
```

Exact naming may change during implementation, but the separation of host context, stage state, authored meeting definition, and completion result must remain stable.

## 7. Stage Type Semantics

The framework must support a standard stage vocabulary from the first shipped version.

### 7.1 `dialogue`

Used for authored narration or character speech that advances linearly.

Used for:

- meeting opening
- praise/criticism speech
- briefing text
- authored interstitial narration

### 7.2 `summary`

Used for structured recap content, such as contribution or progress summaries.

This is mechanism-owned summary presentation, not free-form authored paragraphs.

### 7.3 `policy-panel`

Used to display a structured panel with fields such as:

- overall goal
- phase goal
- execution plan

The existing `review-policy-panel` visual family should be reused.

### 7.4 `choice`

Used for player-facing decisions such as:

- speak / stay silent
- accept / decline special task
- pick work direction
- choose task assignment

### 7.5 `assignment-table`

Used for structured rows such as:

- character
- assignment
- completion/result

The existing `review-assignment-table` visual family should be reused.

### 7.6 `reward`

Used for reward summary and confirmation.

### 7.7 `personnel-update`

Used for rank changes, roster changes, appointment changes, or other personnel settlement.

### 7.8 `action`

Used to execute a bounded list of shared write-back actions without introducing house-local business branches.

### 7.9 `branch`

Used to route to the next stage according to authored conditions and derived meeting state.

## 8. Scenario-Pack Data Model

Scenario packs should add explicit meeting families instead of hiding the full flow in house-module code.

Recommended authored files:

- `meetings.json`
- `meeting-bindings.json`
- `meeting-panels.json`
- `meeting-choice-sets.json`
- `meeting-action-sets.json`

The final file split may be merged if the repository prefers fewer files, but authored meeting content must remain structurally separated from host runtime code.

### 8.1 `meetings.json`

Owns:

- meeting identity
- host scope compatibility
- initial stage
- stage graph
- completion behavior

### 8.2 `meeting-bindings.json`

Owns where meetings can start.

Examples:

- building action `itemId = review`
- building action `itemId = council`
- city action `itemId = hearing`
- organization action `itemId = appointment`

This file is the key to supporting “any building can mount a meeting” without adding one-off action branches per building.

### 8.3 `meeting-panels.json`

Owns structured authored content for:

- policy panels
- assignment tables that need authored captions or summary text
- reward/personnel summaries if not computed entirely from runtime

### 8.4 `meeting-choice-sets.json`

Owns:

- choice ids
- labels
- optional conditions
- optional disabled hints
- optional follow-up action ids or next-stage routing

### 8.5 `meeting-action-sets.json`

Owns declarative write-back and follow-up steps such as:

- set flag
- set variable
- assign mission
- grant reward
- update membership/rank
- trigger next event
- start map auto-advance

## 9. Runtime Write-Back Model

The generic meeting module must support two kinds of write-back:

### 9.1 Shared Mechanism Write-Back

These are owned by runtime/application code:

- merit updates
- rank lookup and promotions
- review countdown reset
- assignment settlement
- inventory/reward grants
- personnel announcements

### 9.2 Authored Declarative Write-Back

These are configured by scenario-pack data:

- which flag to set
- which variable to write
- which mission to activate
- which reward bundle to grant
- which follow-up event to trigger
- whether completion returns to host, opens a next scene, or starts auto-advance

The rule is:

- runtime owns **how** the write happens
- scenario data owns **what** should be written

## 10. Host Integration Contract

Buildings and other hosts should integrate through a small launcher seam.

Required host behavior:

- resolve whether the current action is bound to a meeting
- create a `MeetingHostContext`
- launch the meeting runtime
- map meeting presenter output back into the existing shell
- apply completion and return to host safely

Non-required host behavior:

- stage switching
- review progression logic
- authored reward copy
- assignment/policy/praise decision trees

For temple and keep, the current visible shell can stay intact while the meeting runtime becomes the owner of the meeting state machine.

## 11. UI And Presenter Strategy

The first production version must preserve the current visual shell and avoid a large UI rewrite.

Therefore:

- the meeting runtime must not render HTML directly
- it must output typed presenter/view-model data
- existing house/shared overlays should continue rendering those typed models

The framework should reuse and extend current presenter families where possible:

- `HouseDialogueViewModel`
- `HouseActionContainerViewModel`
- `HouseOverlayViewModel`

If a new dedicated `MeetingPresenterModel` is introduced, it must still be safely adaptable into the current house shell without changing visible behavior for temple and keep during migration.

## 12. Failure Handling

The generic meeting runtime must fail closed.

### 12.1 Missing Binding

If the current host action is expected to start a meeting but no valid binding exists:

- do not silently invent a fallback branch
- return a structured blocked result or host-safe alert

### 12.2 Missing Stage Or Invalid Stage Graph

If a stage is missing or points at an invalid next stage:

- stop progression
- keep the current session safe
- surface a structured runtime error result suitable for a safe overlay

### 12.3 Invalid Authored Action Set

If authored actions reference unknown variables, missions, reward bundles, or unsupported operations:

- do not partially mutate state
- return a blocked result and log a diagnostic

### 12.4 Invalid Return Target

If completion cannot return to the original host:

- route to a safe fallback view such as the current city or host-default view
- do not leave a dangling meeting session active

## 13. Migration Strategy

Migration must be incremental even though the design target is production-grade and fully generic.

### 13.1 Step 1: Establish Generic Contracts

Add the generic meeting runtime contracts and authored meeting families without immediately deleting temple/keep logic.

### 13.2 Step 2: Migrate Temple Review To The Generic Meeting Runtime

Temple becomes the first real host:

- keep current shell and visible order
- move stage ownership into the generic meeting runtime
- keep temple-specific content in authored meeting data

### 13.3 Step 3: Migrate Keep Review To The Same Runtime

Keep proves the framework is not temple-specialized.

### 13.4 Step 4: Generalize To Arbitrary Building Hosts

Once temple and keep both work, additional buildings should only need:

- meeting definition
- binding
- host metadata

not a copied meeting state machine.

## 14. Testing Requirements

Production implementation must add focused coverage before migrating behavior.

Required test layers:

### 14.1 Domain Tests

- stage graph validation
- branch routing
- choice validation
- authored action-set validation

### 14.2 Runtime/Application Tests

- start meeting from host binding
- advance dialogue and panel stages
- submit choices
- execute write-back
- complete and return to host

### 14.3 Pack Contract Tests

- meeting definitions reference valid stages
- bindings reference valid meetings
- stage definitions reference valid dialogue/panel/choice/action ids
- authored write-back references valid supported targets

### 14.4 Host Integration Tests

- temple review launches through the generic meeting runtime
- keep review launches through the generic meeting runtime
- host shell remains visually and behaviorally stable
- completion returns to the correct host context

### 14.5 Robustness Tests

- missing binding
- invalid stage graph
- invalid action set
- missing return target
- safe close behavior in incomplete/blocked sessions

Verification should include:

- targeted Node tests for meeting domain/runtime contracts
- existing temple/keep review robustness tests adapted to the new owner
- `pnpm run build:test`
- `pnpm run typecheck`
- `pnpm run build`

## 15. Non-Goals

This design does not require:

- changing the current temple or keep UI shell in the same slice
- rewriting all review content into fully scene-driven story scripts
- replacing every building interaction with meetings immediately
- deleting all existing temple/keep review helpers before the generic runtime is proven

## 16. Acceptance Criteria

The design is considered correctly implemented when:

- a generic meeting runtime exists and is no longer temple- or keep-owned
- scenario packs can define meetings and bind them to arbitrary building/location actions
- temple review and keep review both run through the same meeting runtime
- building hosts no longer own full meeting stage machines
- current UI shell and user-visible order remain unchanged during migration
- no new meeting business logic is added to `src/main.ts`
- future buildings can mount a meeting by adding authored meeting content plus host metadata, rather than cloning a house-local review flow

## 17. Documentation Requirements

If implementation changes shared interfaces, runtime session structure, registry shape, or cross-module wiring, update:

- `docs/special-house-interface.md`
- `docs/change-log.md`
- the implementation plan under `docs/superpowers/plans/`

If the implementation introduces a governed execution plan, that plan must follow:

- `docs/superpowers/plans/_plan-template.md`
- `docs/superpowers/specs/plan-governance-spec.md`
