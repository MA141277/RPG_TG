# Script Editor Event-Only Routing And Flow Retirement Requirement Draft

## Document Control

- document_id: `requirement-draft.script-editor-event-only-routing-and-flow-retirement`
- draft_status: `recorded-only`
- created_at: `2026-07-22`
- scheduling_effect: `none`
- implementation_authorized: `no`
- related_memo:
  - `docs/blueprints/version-memo.md#memo-025-script-editor-event-centered-authoring-and-portrait-resource-refactor-draft`
- related_target:
  - `docs/blueprints/specs/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target.md`
- intent:
  - `Capture the additional requirement that creator-facing orchestration must fully converge on event routing, including retirement of flow as a formal routing family and retirement of creator-facing building-function/task modules when they behave as secondary routing owners.`

## Draft Purpose

- `This draft records a stricter follow-up requirement inside the current event-centered version direction: all orchestration responsibilities must converge on event routing rather than remaining split across scene, flow, building-function, task, or component-local callback chains.`
- `The draft does not itself admit a queue, revise the active queue, or authorize implementation.`

## Current Target Attachment Draft

- `This is a same-target requirement draft under target.script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor by default.`
- `It should not be treated as the default source for a new successor target unless later candidate review proves the current target cannot lawfully absorb the requirement without parent-spec widening.`
- `The draft exists because the current target already owns event-centered routing truth, scene retirement, no-scene runtime convergence, and creator-facing family cleanup pressure.`
- `The draft does not override the currently admitted active queue. It is candidate-review input only.`
- `If promoted, it should be routed to a new same-target candidate queue rather than absorbed into any already admitted or already recorded queue.`

## Problem Statement

- `The current creator-facing and runtime model still risks leaving multiple routing owners alive at the same time.`
- `Scene is already scheduled for retirement, but creator-facing building-function/task modules and runtime/pack flow structures can still preserve a scene-like orchestration role if not explicitly retired or reduced to non-routing data/content ownership.`
- `If building-function, task, or flow continue to own follow-up routing, launch routing, return routing, or result dispatch, the repository will keep a hidden multi-router model even after scene retirement.`

## Draft Goal

- `Converge all creator-facing and runtime orchestration onto event-binding -> event -> target-module, so event becomes the only formal routing owner and no secondary routing family survives under a different name.`

## Required Outcomes

- `Building-function and task must not remain creator-facing routing owners.`
- `Any creator-facing building interaction that currently reads as "building function" must become either:`
  - `an arrangement-hosted interactive component or building/city-owned interaction entry`
  - `an event-binding trigger source`
  - `a target module reached by event routing`
- `Task must not remain a creator-facing follow-up router; task may survive only as task data, task state, task objectives, task progression state, or a target module invoked through event.`
- `Flow must not remain a creator-facing family, runtime canonical routing family, pack canonical family, preview routing truth, or follow-up orchestration owner.`
- `All historical responsibilities that were previously carried by flow must migrate into formal event-routing semantics.`
- `Any event-like semantics currently produced by flow must be replaced by first-class event/event-binding ownership so editor authoring, pack export/import, loader resolution, preview, and runtime all see the same routed truth.`
- `Creator-facing module boundaries must stop implying that building-function or task are alternative dispatch systems next to event.`
- `Future mechanism modules such as review/council may exist as independent target modules or arrangement-bindable components, but they must still be launched and followed up through event routing rather than becoming a new routing owner.`

## Creator-Facing Family Direction

- `Event remains the only formal creator-facing routing owner.`
- `Dialogue remains a creator-facing content family for narration, speaker lines, portraits, side placement, and choice content.`
- `Building/city/arrangement remain creator-facing host/container families for background, layout, and interactive component placement.`
- `Building-function should not survive as an independent creator-facing routing family if its meaning is only "click something and go somewhere next".`
- `Task should not survive as an independent creator-facing routing family if it still mixes data/state with routing ownership.`
- `Flow should not survive as a creator-facing family.`

## Event-Only Routing Rule

- `Anything that answers "what happens next" belongs to event routing.`
- `This includes at minimum:`
  - `building enter follow-up`
  - `building leave follow-up`
  - `interactive component click follow-up`
  - `dialogue end / dialogue choice follow-up`
  - `task accept / advance / complete / fail follow-up`
  - `minigame start / success / failure / cancel / return follow-up`
  - `review/council launch and settlement follow-up`
- `No content object, host object, or component object may silently keep a parallel follow-up chain once event routing is the formal truth.`

## Flow Retirement Direction

- `Flow is not to be preserved as a weaker replacement for scene.`
- `The target state is not "event plus flow". The target state is "event-only formal routing".`
- `Do not preserve flow through:`
  - `hidden runtime materializers`
  - `bridge exports`
  - `loader-side compatibility reconstruction`
  - `preview-only routing helpers`
  - `component-local flow callback chains`
  - `pack-side canonical flow definitions used as actual routing truth`
- `If some implementation layer still needs internal sequencing, that sequencing must not become creator-facing truth, pack canonical truth, or runtime routing owner.`

## Flow-To-Event Replacement Requirement

- `All currently effective flow-produced event semantics must be explicitly replaced by event-routing semantics.`
- `The replacement is not complete unless all of the following hold together:`
  - `runtime can still trigger the intended follow-up behavior`
  - `editor can correctly recognize, display, edit, and reference the resulting event relationships`
  - `pack export/import preserves the routed references without relying on flow as canonical truth`
  - `loader resolves the new event references without reconstructing flow as hidden truth`
  - `preview and runtime reach the same routed result`
- `It is illegal to claim flow retirement if the repository only deletes the flow structure but leaves trigger loss, broken follow-up chains, or editor/runtime reference divergence behind.`

## Building And Mechanism Preservation

- `Building creator-facing meaning must continue to read as interaction -> event -> dialogue/minigame/task/module.`
- `This draft does not authorize hardcoded building-specific business branches in runtime entrypoints.`
- `Future review/council behavior may be extracted as an independent mechanism module or as a reusable arrangement-bound component, but it must remain a target of event routing rather than a new formal router.`
- `Removing building-function and flow as routing owners must not erase existing building interaction meaning or collapse all building actions into static placeholder UI.`

## Editor / Pack / Runtime Convergence Requirements

- `Script Editor must not continue to show extra creator-facing modules whose real purpose is only orchestration that now belongs to event.`
- `If building-function/task modules remain visible during transition analysis, they must be treated as retirement or migration candidates rather than stable truth by default.`
- `Runtime pack, loader, preview, export, and runtime state must converge on the same event-only routing model.`
- `Editor-visible references, exported references, loaded references, and runtime-resolved references must remain the same truth family.`
- `No queue may claim success by migrating only the editor side while pack/runtime still depend on flow truth.`

## Explicit Non-Goals

- `Do not rebrand flow, building-function, or task as thin wrappers that still secretly own routing.`
- `Do not keep dual-path truth where creators author event while runtime still follows flow.`
- `Do not preserve temporary compatibility residue for flow retirement.`
- `Do not move orchestration back into hardcoded building runtime branches.`

## Candidate Routing Implications Draft

- `This draft is implementation-bearing and should not remain as memo-only prose if adopted.`
- `The requirement must be routed as one new same-target candidate queue rather than being absorbed into queue.scene-family-retirement-and-content-migration or queue.event-centered-runtime-pack-preview-export-sync.`
- `The reason is not that the requirement is unrelated, but that it crosses both creator-facing family retirement and runtime/pack reference replacement in a way that would otherwise blur existing queue claim boundaries and invite over-narrowing.`
- `This draft must not be absorbed by weakening the requirement into "hide the UI modules now, clean runtime later".`

## Queue Boundary Recommendation Draft

### Required New Candidate Queue

- candidate_queue_id: `queue.event-only-routing-family-retirement-and-reference-replacement`
- routing_status: `must-create-as-new-candidate`
- parent_target: `target.script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor`
- must_not_merge_into:
  - `queue.scene-family-retirement-and-content-migration`
  - `queue.event-centered-runtime-pack-preview-export-sync`
  - `queue.portrait-resource-authoring-and-resource-mapping-convergence`
- required_boundary:
  - `retire building-function, task, and flow as alternate routing owners where they still carry orchestration truth`
  - `replace flow-originated event/reference semantics with first-class event/event-binding ownership`
  - `keep editor-visible references, exported references, imported references, preview behavior, loader resolution, and runtime behavior on one event-only routing truth`
- boundary_reason:
  - `This requirement is too cross-cutting to be safely absorbed into the existing scene-retirement queue without turning that queue into a broader routing replacement queue.`
  - `It is also too creator-facing to be safely absorbed into the runtime-pack-preview-export-sync queue without turning that queue into a broader family-retirement queue.`
  - `A distinct candidate queue keeps the requirement visible, preserves existing queue claim boundaries, and prevents silent narrowing into UI-only cleanup or runtime-only cleanup.`

## Acceptance Matrix Draft

| Acceptance ID | Requirement | Preferred Owner | Proof Type | Closeout Blocker |
| --- | --- | --- | --- | --- |
| `ACC-EVENT-ONLY-ROUTING-001` | `Script Editor no longer presents building-function or task as independent creator-facing routing systems parallel to event.` | `queue.event-only-routing-family-retirement-and-reference-replacement` | `UI/source review + authoring tests` | `Creators can still author follow-up routing through extra module families instead of event.` |
| `ACC-EVENT-ONLY-ROUTING-002` | `Flow is removed as creator-facing routing family, runtime canonical routing family, pack canonical routing family, preview routing truth, and follow-up orchestration owner.` | `queue.event-only-routing-family-retirement-and-reference-replacement` | `source-removal guards + export/import/runtime tests` | `Flow remains canonical truth in any editor-visible, pack, loader, preview, or runtime routing surface.` |
| `ACC-EVENT-ONLY-ROUTING-003` | `All effective flow-produced event semantics are replaced by first-class event/event-binding ownership without broken follow-up chains.` | `queue.event-only-routing-family-retirement-and-reference-replacement` | `runtime tests + preview tests + source review` | `Deleting flow breaks trigger reachability, follow-up routing, return routing, or result dispatch.` |
| `ACC-EVENT-ONLY-ROUTING-004` | `Editor-visible references, exported references, imported references, loader resolution, preview behavior, and runtime behavior all align on the same event-only routing truth.` | `queue.event-only-routing-family-retirement-and-reference-replacement` | `round-trip tests + preview/runtime tests` | `Editor writes event truth while export/import/loader/runtime still consume flow truth or compatibility reconstruction.` |
| `ACC-EVENT-ONLY-ROUTING-005` | `Building interaction meaning remains interaction -> event -> dialogue/minigame/task/module after creator-facing family cleanup and flow retirement.` | `queue.event-only-routing-family-retirement-and-reference-replacement` | `building runtime tests + browser proof + source review` | `Building interactions become placeholder-only, lose meaning, or bypass event ownership.` |
| `ACC-EVENT-ONLY-ROUTING-006` | `No compatibility residue remains for flow/building-function/task routing truth once the replacement is claimed complete.` | `queue.event-only-routing-family-retirement-and-reference-replacement` | `source-removal guards + rejection tests` | `Bridge exports, loader-side reconstruction, hidden callback chains, or dual-path routing truth survive as production behavior.` |

## Implementation Anchors Draft

### Editor-Facing Anchors

- `src/domain/script-editor-project.ts`
- `src/application/script-editor/**`
- `src/ui/main-ui/main-ui-flow.js`
- `workspace shell / visible family tree / object list / authoring panels that still expose building-function/task/flow as creator-facing orchestration surfaces`

### Runtime / Pack / Preview Anchors

- `src/application/script-editor/runtime-pack-export.ts`
- `src/application/script-editor/runtime-pack-import.ts`
- `src/application/scenario/scenario-pack-loader.ts`
- `preview/runtime loaders`
- `src/application/story/**`
- `src/application/runtime/**`
- `tests/**`

### Building Interaction Anchors

- `src/application/building/**`
- `arrangement-hosted interaction dispatch paths`
- `event-binding trigger entrypoints`
- `building interaction settlement / leave / return paths`

## Legacy Paths To Replace Draft

- `creator-facing building-function module ownership when it acts as a routing owner rather than a host interaction definition`
- `creator-facing task module ownership when it acts as a follow-up router rather than task data/state`
- `flow as canonical routing truth in editor-visible structures`
- `flow as canonical routing truth in pack export/import structures`
- `flow as canonical routing truth in loader resolution`
- `flow as canonical routing truth in preview/runtime execution`
- `component-local callback chains that bypass event ownership`
- `return/follow-up/result-dispatch behavior owned by flow rather than event`

## Compatibility Paths To Preserve Draft

- `building interaction meaning and reachable outcomes`
- `event-binding trigger entry semantics`
- `normal start / JSON import / editor preview convergence`
- `dialogue end / minigame result / task progression follow-up reachability`
- `future review/council mechanism launch through event-owned routing`

## User Path Coverage Matrix Draft

| Path Family | Must Still Work After Replacement | Failure Shape That Invalidates Closeout |
| --- | --- | --- |
| `normal game start` | `event-only routing truth is used without flow fallback` | `runtime still needs flow truth or hidden reconstruction to proceed` |
| `JSON runtime pack import start` | `imported references resolve to event-owned routing` | `import succeeds only because flow truth is still canonical` |
| `Script Editor runtime preview` | `preview follows the same routed truth as exported runtime` | `preview uses editor-only flow helpers or preview-only routing reconstruction` |
| `building enter` | `enter follow-up still reaches the intended routed result` | `enter path loses trigger, dialogue, or follow-up reachability after flow retirement` |
| `interactive component click` | `component click routes through event-binding/event rather than module-local flow logic` | `click does nothing, reaches placeholder UI, or bypasses event ownership` |
| `dialogue end / choice` | `follow-up remains event-routed and reachable` | `dialogue still depends on flow/scene-style local next-step truth` |
| `minigame result / return` | `success/failure/cancel/return paths remain reachable through event routing` | `result settlement breaks because flow owned the old return chain` |
| `task accept / advance / complete / fail` | `task progression follow-up is event-routed, not task-local routing truth` | `task behavior still depends on task-local next routing or breaks after family cleanup` |
| `leave / cancel / return / recovery` | `non-happy-path follow-up survives without flow fallback` | `only the main happy path works after replacement` |

## No-Over-Narrowing Guard Draft

- `It is illegal to claim this requirement satisfied by hiding UI modules alone.`
- `It is illegal to claim this requirement satisfied by deleting flow structures while leaving broken event references or missing trigger reachability.`
- `It is illegal to preserve a thin hidden router in building-function, task, flow, component callbacks, or loader-side reconstruction and still call the model event-only routing.`
- `It is illegal to treat editor-only cleanup as complete if pack/export/import/loader/preview/runtime still depend on the old routing truth.`
- `It is illegal to preserve only one happy-path building interaction while silently losing alternate entry, return, cancel, or progression paths.`

## Acceptance Direction Draft

- `A creator can no longer rely on scene, flow, building-function, or task as a second routing system next to event.`
- `The repository no longer contains canonical flow routing truth in editor-visible structures, runtime pack canonical structures, loader truth, or runtime session truth.`
- `Any behavior that was previously reachable through flow remains reachable through event routing after migration.`
- `Editor-visible event references, pack references, preview behavior, and runtime behavior remain aligned after the replacement.`
- `No replacement queue may close if deleting flow or extra creator-facing routing modules causes functional loss in building interaction, follow-up routing, or event reachability.`

## Draft Next Step

- `If adopted, route this draft into the current target's candidate review as one new same-target candidate queue: queue.event-only-routing-family-retirement-and-reference-replacement.`
- `Do not absorb this requirement into existing active or recorded candidate queues.`
- `Any admission review based on this draft must record that the requirement was intentionally kept as a distinct candidate queue to preserve claim-boundary clarity and prevent over-narrowing into UI-only cleanup or runtime-only cleanup.`
