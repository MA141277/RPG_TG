# Review Cadence Follow-Up Shared Review Support Spec

## Control Block

- spec_id: `spec.review-cadence-follow-up-shared-review`
- document_role: `supporting-spec`
- belongs_to_version: `target.project-complete-modularization`
- supports_queue: `queue.review-cadence-follow-up-contract-closure`
- contract_version: `v1`
- execution_authority: `none`

## Human Context

### Role In Blueprint

- `This document is a version-supporting mechanism contract for queue.review-cadence-follow-up-contract-closure under the current complete-modularization version.`
- `It does not replace project-progress, blueprint, version-plan, or queue truth.`
- `It must not be treated as live execution authority or queue admission by itself.`
- `Its purpose is to freeze the correct shared-mechanism end state for today's review / 今日评定 so later same-version queue admission, implementation, and verification can reuse one stable boundary instead of rediscovering the mechanism every time.`

### Goal

- `Convert today's review / 今日评定 from scattered host-private flow into a shared review cadence mechanism that can be enabled, hosted, and configured by scenario content without forcing keep-house or temple-house to own the mechanism skeleton.`
- `Keep runtime responsible for review-state adjudication, activation routing, and visibility policy while keeping page layout and host-local rendering in host house/UI owners rather than rebuilding runtime as a page-branch controller.`

### Scope

- `shared review cadence truth spanning time progression, deadline crossing, lateness handling, arrival reminders, host routing, review-stage progression, and post-review assignment handoff`
- `today review host rendering contracts for keep-house and temple-house on the covered production path`
- `scenario-pack-owned review configuration that declares host, placement, activation policy, review policy, and follow-up policy`
- `migration rules for reviewCountdown / reviewDateText / mainHouseMissionText and related review-derived UI state`
- `validation rules proving today's review can act as a shared mechanism instead of a house-private business bundle`

### Non-Goals

- `extracting only a shared UI component such as a dialog shell while leaving cadence truth fragmented`
- `creating a new dedicated review sub-runtime family in this design`
- `letting runtime directly own page layout composition or per-screen render branches`
- `rewriting every keep-house or temple-house story beat in this document`
- `changing active queue truth or using this support spec as implementation authorization by itself`

### Problem Definition

- `Today's review is not a single house feature because the mechanism starts before the player enters the host house: time progression computes councilDate offsets, council-priority.ts selects the priority host, council-attendance.ts computes late penalties, and navigation-time-follow-up.ts interrupts travel/UI flow by opening a council-arrival reminder.`
- `The same mechanism continues after host entry: keep-house-house-module.ts and temple-house-house-module.ts each decide whether review has started, whether lateness penalties apply, how intro/praise/policy/assignment stages advance, and how the next work plan or mission is written back into shared state.`
- `The mechanism also leaks into story/runtime edges: story-battle-runtime.ts resets councilDate, reviewDateText, mainHouseMissionText, and reviewCountdown directly after battle completion; time-progression.ts derives reviewDateText every time the date advances; home-house-house-module.ts and multiple timed activities gate behavior around review countdown and deadline proximity.`
- `UI and routing are likewise fragmented: navigation-time-follow-up.ts clears unrelated app surfaces and emits a council-arrival reminder; keep-house, temple-house, tavern, medicine-house, tea-house, and home-house each carry their own review-time block/redirect logic or copy variants.`
- `This scattered implementation blocks modularization because a future scenario or mod cannot honestly enable a review cadence by configuration alone. It must instead inherit host-specific code branches, duplicated countdown fields, and owner-local if statements spread across time, runtime, house, and UI modules.`

### Current-State Audit

- `src/application/time/council-priority.ts currently decides host priority by hard-routing the mechanism to keep-house or temple-house via story-stage inference rather than through one shared review host policy.`
- `src/application/time/council-attendance.ts currently owns lateness severity, grace days, contribution penalties, and expulsion probability as shared cadence logic, but host modules still consume and narrate the outcomes locally.`
- `src/application/runtime/navigation-time-follow-up.ts currently treats review arrival as a runtime follow-up outcome that clears modal/city/travel surfaces and opens a council-arrival reminder dialogue, which proves the mechanism already spans runtime-wide UI gating rather than one host-only screen.`
- `src/application/time/time-progression.ts currently derives reviewDateText from councilDate while keep-house-house-module.ts, temple-house-house-module.ts, story-battle-runtime.ts, story-callbacks.ts, and home-house-house-module.ts still rewrite reviewCountdown / reviewDateText / mainHouseMissionText on their own owner lines.`
- `src/application/house-modules/keep-house/keep-house-house-module.ts currently owns review intro, praise, strategy, task assignment, late-expulsion copy, next councilDate reset, reviewCountdown reset, and mission/writeback behavior for the camp-hosted variant.`
- `src/application/house-modules/temple-house/temple-house-house-module.ts currently owns review intro, lateness penalties, policy cadence, work-plan selection, task assignment, auto-advance, begging/indoor work gating, and next review reset for the temple-hosted variant.`
- `src/application/house-modules/home-house/home-house-house-module.ts and timed house/minigame modules still gate rest/work actions around reviewCountdown proximity, proving non-host modules already consume review cadence decisions.`
- `src/domain/game-state.ts, src/domain/global-ui.ts, src/domain/keep-house.ts, and src/domain/scenario-profile.ts still expose review-related fields in mixed locations, which currently conflates mechanism truth, display derivation, and compatibility state.`

### Mechanism Principles

1. `Review is a shared cadence mechanism first, a host rendering surface second.`
2. `Scenario content decides whether review exists, who hosts it, where it is surfaced, and which policy set is active; shared application/runtime decides whether the mechanism is active now.`
3. `Runtime adjudicates visibility, blocking, hiding, and redirect decisions, but host/UI owners still render their own layout and action containers.`
4. `Host houses consume a stable review state contract and host adapter contract; they do not own the review lifecycle skeleton.`
5. `Derived display text must not act as mechanism truth. reviewDateText and mainHouseMissionText may survive only as derived or compatibility fields during migration.`
6. `Future packs must be able to enable the mechanism by configuration plus one host adapter, not by copying keep-house or temple-house business code.`

### Version Architecture

#### Scenario Configuration Layer

- `Owns whether review is enabled for the scenario, which host family/host id is active, where review entry is surfaced, how reminders/redirects behave, what cadence stages exist, what lateness/penalty policy applies, and what post-review assignment family is legal.`
- `Owns declarative policy only: host selector, placement, stage catalog, gating policy, assignment policy, and optional story/event activation hooks.`
- `Must not own runtime session truth, page layout structure, or application-side state transitions.`

#### Shared Review Mechanism Layer

- `Owns review activation, current stage, current host, current visibility policy, current gate policy, current lateness status, current follow-up outcome, and post-review writeback contract.`
- `Owns the unified trigger adjudication path for time progression, host entry, and story/event-forced activation.`
- `Owns generation of a review decision surface that other modules consume: is review active, should current action be blocked, should current view redirect, should reminder dialog open, should host adapter render review shell, and what follow-up writeback should happen when review closes.`
- `Must not own screen layout trees, host-specific action button ordering, or hardcoded keep/temple page composition branches.`

#### Host House / UI Layer

- `Owns actual rendering of review inside the host surface, host-specific labels/layout slots, and any host-local adapter needed to present shared review stages in keep-house or temple-house style.`
- `Consumes shared review state plus visibility/gate decisions without recomputing cadence truth.`
- `May provide host-specific adapter functions such as roster mapping, presenter copy slots, or local action translation, but must not re-own activation timing, lateness policy, or next-cycle scheduling logic.`

### Runtime Responsibilities

#### Runtime Should Own

- `activation adjudication`
- `review host selection from current scenario review config plus current state`
- `visibility policy generation`
- `redirect/block/hide decisions for non-host consumers`
- `review session state transition orchestration`
- `post-review writeback dispatch into unified game state`

#### Runtime Must Not Own

- `hardcoded page layout branches such as "if temple render this panel tree else render that panel tree"`
- `screen-local widget ordering`
- `host-private copy composition beyond generic reminder/gate payloads`
- `scenario-private review skeleton logic that belongs in config or host adapters`

#### Why Configuration-Driven Display Does Not Mean Runtime Owns Pages

- `Configuration should declare mechanism placement and host policy, not raw UI structure.`
- `Runtime can say "render review in host placement X with policy Y" while keep-house or temple-house still decides how that placement maps into its own action container, status card, and dialogue presentation.`
- `If runtime starts selecting concrete view fragments or host layout branches, the architecture simply moves today's house-private if statements into a new central monolith rather than modularizing the mechanism.`

### State Model

#### Canonical Mechanism Truth

- `Introduce one review mechanism state carrier under shared game state rather than leaving cadence truth split between world.schedule, ui strings, and host-local runtime variables.`
- `Recommended location: a dedicated shared review state family under domain/game-state runtime-owned mechanism truth, for example runtime.review or world.review, chosen according to the repository's final mechanism-state convention.`

#### Recommended Core Fields

- `enabledReviewId`
- `hostKind`
- `hostHouseModuleId`
- `hostHouseId`
- `placementPolicy`
- `visibilityPolicy`
- `gatePolicy`
- `status: idle | pending-arrival | active | late-grace | late-major | completed`
- `stageId`
- `currentCycleDate`
- `scheduledDate`
- `arrivalState`
- `lateDays`
- `penaltyState`
- `assignmentState`
- `followUpState`
- `lastResolvedCycleId`

#### Field Treatment Guidance

- `councilDate` may remain the calendar anchor only if it is reinterpreted as one input to shared review scheduling rather than the sole mechanism truth.`
- `reviewCountdown` should stop being the mechanism source of truth. It should become either a derived field from scheduledDate/current date or a temporary compatibility mirror while consumers migrate.`
- `reviewDateText` should become a pure derived display field emitted from shared review state or a presenter/helper, not something multiple modules write directly.`
- `mainHouseMissionText` should stop encoding review mechanism truth. It should either remain a host-agnostic current-duty label fed by post-review assignment results or be split so review assignment summary lives under review assignment state while UI text is derived locally.`

#### Truth Categories

- `mechanism truth`
  - `status, stageId, scheduledDate, host identity, visibility policy, assignment state, lateness state`
- `derived display fields`
  - `reviewDateText, review badge text, reminder paragraphs, host subtitle variants`
- `compatibility transition fields`
  - `reviewCountdown, mainHouseMissionText, existing host-local countdown mirrors, legacy UI text slots`

### Trigger Design

#### Supported Trigger Sources

- `time progression`
- `entering the review host`
- `story/event forced activation`

#### Unified Trigger Adjudication

- `Trigger judgment should converge into one shared review activation path owned by the review mechanism layer.`
- `time progression should raise a review-threshold or review-cycle outcome, not directly mutate host session state.`
- `entering keep-house or temple-house should ask the shared mechanism whether the current host should enter review mode now, not independently recompute cadence completion.`
- `story/event forced activation should set or request review activation through a shared review command/effect surface, not directly rewrite house business state or UI strings.`

#### Trigger Outcome Model

- `A trigger may produce: no-op, reminder-only, activate-review, reroute-to-host, apply-late-penalty, or finalize-follow-up.`
- `Only the shared mechanism layer should update review status/stage/host truth.`
- `Host modules and unrelated activity modules should only consume these outcomes and adapt their local UI/interaction behavior accordingly.`

### Visibility, Hide, Block, And Redirect Policy

#### Required Decision Families

- `show`
  - `review host surface or review entry affordance remains visible`
- `disable`
  - `action remains visible but cannot proceed`
- `hide`
  - `action or panel disappears because review policy forbids it`
- `redirect`
  - `user is sent or invited to the current host review surface`

#### Recommended Shared Policy Objects

- `visibilityPolicy`
  - `what the player is allowed to see while review is pending or active`
- `reviewGate`
  - `what the player is forbidden to start and why`
- `hostSelector`
  - `which host is responsible now and where non-host consumers should redirect`

#### Ownership

- `The shared review mechanism layer generates visibilityPolicy, reviewGate, and hostSelector from canonical review truth plus scenario config.`
- `Host houses consume those policies to decide whether to enter review mode, which shared stage to present, and which local actions remain available.`
- `Non-host modules consume those policies to decide whether to allow work/rest/minigame/travel actions, whether to show a blocking reminder, and whether to redirect toward the host.`
- `The same policy must not be re-authored by tavern, medicine-house, tea-house, home-house, keep-house, temple-house, and runtime follow-up separately.`

#### Why Per-Module If Statements Must End

- `Distributed if statements have already produced multiple inconsistent rule surfaces: some modules block by remainingDays, some by reviewCountdown, some by councilDate arrival, some by host-local story stage, and some by direct reminder dialogue.`
- `As long as each owner decides policy alone, future scenarios cannot safely add a new host or change review placement without auditing every minigame, house, and runtime branch.`

### Configuration-Driven Design

#### Scenario Configuration Must Declare

- `whether review cadence is enabled`
- `review mechanism id`
- `host policy`
- `placement policy`
- `reminder policy`
- `late penalty policy`
- `assignment policy`
- `restriction policy`
- `story/event activation hooks`
- `optional stage catalog or stage mapping`

#### Host Expression

- `Host should be expressed as stable ids and families, for example host module id, optional concrete house id, and optional scenario-stage-based selector.`
- `Config may say "temple host during monk opening, keep host during camp stage" without hardcoding that switch inside council-priority.ts.`

#### Placement Expression

- `Placement should describe semantic placement such as host-status-card, host-dialogue-shell, host-action-panel entry, or redirect-only.`
- `Placement must not describe raw widget coordinates or direct DOM/component trees.`

#### Policy Expression

- `Stage policy declares which review stages exist and their allowed transitions.`
- `Assignment policy declares what work-plan/task-pool family is selected after review.`
- `Penalty policy declares grace days, penalty severity bands, and optional expulsion/discipline effects.`
- `Restriction policy declares which action families are blocked, hidden, disabled, or redirected while review is pending or active.`

#### Content Boundary

- `Scenario-pack should own mechanism declaration and strategy declaration because different scenarios may host review differently or disable it entirely.`
- `Scenario-pack should not own shared runtime transition code, host rendering code, or generic visibility adjudication algorithms.`

### Module Boundary And Directory Guidance

#### Domain

- `src/domain/review/*`
  - `review state types`
  - `review policy types`
  - `review config schema types`
  - `review lifecycle enums`

#### Application

- `src/application/review/*`
  - `activation adjudication`
  - `visibility/gate policy builders`
  - `review follow-up orchestration`
  - `review host selector`
  - `review-derived text/status helpers`

#### Scenario Content

- `src/content/scenario-packs/<pack>/reviews/*`
  - `review config`
  - `review stage config`
  - `review assignment policy data`
  - `review restriction policy data`

#### Host Adapters

- `house-modules/*` should keep only host adapters and rendering consumption points, for example keep review presenter adapter or temple review presenter adapter.`
- `Host adapters may translate shared review stage into host-local roster entries, speaker mapping, or action menu slots, but they must not re-own cadence truth or late-penalty calculation.`

### Migration Order

#### Phase 1: Shared Rule Extraction

- `Freeze one shared review policy vocabulary first: activation kinds, gate kinds, visibility policy, host selector, lateness policy, and assignment result shape.`
- `This must come first so later state moves and host extraction do not just shift ambiguous ad hoc logic into new files.`

#### Phase 2: Unified State Introduction

- `Introduce the canonical shared review state carrier and migrate writers toward it.`
- `At this stage keep compatibility mirrors for reviewCountdown / reviewDateText / mainHouseMissionText only where necessary.`
- `This must happen before host extraction, or each host will keep inventing its own state bridge.`

#### Phase 3: Trigger And Follow-Up Consolidation

- `Move time progression, host entry, and story/event-forced review activation onto the shared review adjudication path.`
- `This is the point where navigation-time-follow-up and host-local review start conditions stop being separate control planes.`

#### Phase 4: Host Adapter Extraction

- `Refactor keep-house and temple-house so they consume shared review truth and host adapters rather than owning the lifecycle skeleton.`
- `This phase should remove duplicated late intro, stage progression, reset scheduling, and assignment writeback logic from the host modules.`

#### Phase 5: Scenario-Pack Datafication

- `Only after the shared rule/state/host contract exists should zhuyuanzhang-specific review strategy, host switch policy, and assignment policy be pushed fully into scenario-pack review content.`
- `This order prevents pack data from inventing fields before the shared mechanism contract is stable.`

### Blueprint / Governance Guidance

- `This topic is not a casual patch inside the current no-active-queue state because it crosses time, runtime, host, UI gating, and scenario configuration boundaries and therefore changes a shared mechanism family rather than one owner-local implementation slice.`
- `It fits the already-recorded queue.review-cadence-follow-up-contract-closure candidate instead of creating a brand-new queue identity, because the discovered problem is still "review/evaluation cadence lacks a unified follow-up contract surface" rather than an unrelated new mechanism family.`
- `The queue naming should remain queue.review-cadence-follow-up-contract-closure; this document is the candidate's supporting design basis, not a sibling queue.`
- `Future admission should prove that:`
  - `review activation/gating/visibility/assignment still remain fragmented across the audited owners`
  - `the bounded implementation slice can unify shared cadence truth without also requiring the broader cross-mechanism composition queue`
  - `host modules can be converted into consumers/adapters rather than mechanism owners`
  - `scenario-pack review declaration can be introduced without creating a new review sub-runtime or runtime page-branch monolith`

### Acceptance Criteria

- `Review cadence truth is unified into one shared mechanism state family rather than being split across councilDate, reviewCountdown, reviewDateText, mainHouseMissionText, and host-local session logic.`
- `keep-house and temple-house no longer own the review lifecycle skeleton; they only host/render shared review stages through bounded adapters.`
- `time progression, host entry, and story/event-forced review activation all converge into one shared activation path.`
- `visibility, hide, block, and redirect decisions are generated centrally from shared review policy rather than duplicated across house, minigame, travel, and runtime modules.`
- `Scenario or future mod content can enable or host review cadence through configuration plus one host adapter instead of copying keep/temple business logic.`
- `Runtime continues to adjudicate mechanism state and visibility policy but does not become a page-layout branch controller.`
- `reviewDateText and other display strings are derived outputs rather than multi-writer mechanism truth.`

### Failure Conditions

- `A refactor that only extracts shared dialogue/UI pieces while leaving review activation, timing, penalties, and assignment fragmented is incomplete.`
- `A refactor that moves today's if statements into one giant runtime page-switch controller is invalid.`
- `A refactor that keeps keep-house or temple-house as mechanism skeleton owners and merely renames helpers is incomplete.`
- `A refactor that pushes UI layout detail into scenario config instead of mechanism policy is invalid.`
- `A refactor that creates a new review sub-runtime without first proving the shared mechanism layer is insufficient is out of scope for this contract.`
