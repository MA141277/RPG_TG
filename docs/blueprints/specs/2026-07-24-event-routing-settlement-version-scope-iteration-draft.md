# Event Follow-Up And Settlement Convergence Iteration Draft

## Document Status

- status: `iteration-draft`
- last_updated: `2026-07-24`
- scope_kind: `version-scope-declaration`
- source_memos:
  - `MEMO-029`
  - `MEMO-030`

## 1. Document Positioning

- This document is an iteration draft, not a final version shell.
- This version jointly absorbs the previously discussed `MEMO-029` and `MEMO-030` directions.
- The covered surfaces include:
  - `event / dialogue / task / playable / function / settlement`
  - building and city-hosted instances
  - Script Editor information architecture
  - export / import / runtime preview / runtime loading / normal startup
- The version must not narrow itself into runtime-only work. Authoring, runtime, export/import, preview, deduplication, naming, and settlement convergence all remain in scope.

## 2. Version Goals

- Keep converging the project toward `event` as the only formal creator-facing routing owner.
- Establish one instance-level follow-up event mechanism across `dialogue / task / playable / function / settlement`.
- Use `nextEventId` as the single unified follow-up event field name.
- Ensure `nextEventId` stores only the target `eventId`.
- Introduce `settlement` as a formal settlement object and formal event type.
- Remove duplicated template and instance truth by establishing canonical reuse.
- Retire `PlayableSettlement` as the expansion direction and converge its remaining result shell into `PlayableResult`.

## 3. First Prerequisite Batch: Instance Deduplication And Canonical Reuse

Before `nextEventId`, settlement, and authoring convergence begin, the version must first complete event-instance and building-instance deduplication plus canonical reuse.

The first batch must at minimum cover:

- `events.json`
- building-related instances
- city/building module instance items
- secondary menu items
- building function items
- arrangement / container / action related instances

Required outcomes:

- all references are rewritten to canonical ids
- duplicate truth must not survive in export/import/loading/preview/startup
- building-side deduplication must continue through the Script Editor authored `arrangement / event-binding / playable-flow / shared runtime` path
- no temporary building-specific mapping may be added in `src/main.ts`

## 4. Template-Layer Strong Deduplication Rule

- Default template libraries use strong deduplication.
- At template layer, if content is the same, it is treated as a duplicate candidate by default.
- Different ids alone are not a reason to preserve multiple copies.
- The strong rule applies to:
  - default event templates
  - default building templates
  - default menu-item templates
  - default reusable authoring resources
- This version explicitly aims to significantly reduce duplicate template volume.
- Template-layer work does not keep a separate "uncertain duplicate" bucket.
- If the difference does not affect routing semantics, the record is folded into the duplicate set by default.
- `task` does not use this relaxed template-layer rule and still requires stricter independent semantic judgment.

Template-layer exceptions that may preserve separation are limited to:

- different `nextEventId`
- different event-binding conditions
- different host semantics
- different settlement semantics
- explicit author intent requiring separation

## 5. Canonical Comparison Rules

Deduplication must use explicit comparison rules instead of informal judgment.

Fields ignored by default:

- `id`
- sort-only fields
- display-only fields
- internal tracing fields
- source metadata
- creation/update history fields

Fields that must participate in canonical comparison:

- creator-visible primary content
- text and presentation content
- runtime action content
- result-entry definitions
- `nextEventId`
- event-binding conditions
- host-object semantics
- settlement reference or settlement semantics
- any structural field that changes creator-facing meaning or runtime meaning

Records must not be merged if they differ in any flow-affecting way, including:

- different `nextEventId`
- different binding conditions
- different host semantics
- different settlement semantics
- different result-entry structure
- explicit author intent to keep them separate

Every canonical merge must leave a traceable record containing:

- source instance id
- canonical target id
- reason for merge
- whether template-layer strong deduplication was applied
- whether an exception review was needed

## 6. Canonical Id Selection Rules

When duplicates are folded into one canonical id, the canonical id must be chosen through a stable and repeatable rule:

1. prefer the id with the highest reference count
2. if tied, prefer the baseline id from the default template library
3. if still tied, prefer the earlier stable template-library id
4. if still tied, select by one deterministic ordering rule

Additional constraints:

- id difference alone cannot justify multiple surviving copies
- once selected, the canonical id must remain stable within the batch
- all canonical selections must enter the migration and mapping record

## 7. Event-Binding Deduplication And Preservation Boundary

This version cannot deduplicate only `event` instances. It must also define the event-binding boundary.

Bindings may be treated as duplicate candidates only when all of the following are the same:

- owner
- trigger
- conditions
- priority
- enabled state
- canonical target `eventId`

Bindings must remain separate when any of the following differ:

- owner
- trigger
- conditions
- host semantics
- priority
- enabled state

After event-instance deduplication, the related binding work must at minimum perform:

- canonical event id rewrites
- duplicate binding detection
- foldable binding consolidation
- explicit preservation reasoning for non-foldable bindings

## 8. Full Reference Rewrite List

After deduplication, canonical reuse, and `nextEventId` convergence, the version must execute full reference rewrites.

At minimum, the rewrite surface includes:

- all `nextEventId` references
- in-file event references inside `events.json`
- `eventId` references in `event-bindings.json`
- event references in building instances, menu items, and function items
- event references in arrangement / container / action records
- settlement-event references
- runtime-pack exported event references
- imported event indexes
- runtime-preview event mappings
- event references loaded during normal startup
- Script Editor materialization-generated event and binding references

Required outcomes:

- every old id reference is rewritten to the canonical id
- no source may continue pointing at retired duplicate ids
- structural checks must confirm that no dangling ids or dual truths remain

## 9. Follow-Up Event Slot Mechanism

- Follow-up slots are not a separate business type. They are event-reference fields only.
- All follow-up event references use one field name: `nextEventId`.
- `nextEventId` stores only the target `eventId`.
- It does not store conditions, rewards, settlement logic, payload wording, or lowering details.
- Covered objects:
  - `dialogue`
  - `task`
  - `playable`
  - `function`
  - `settlement`
- `nextEventId` must live on creator-edited instance data.
- Single-exit objects may hold one direct `nextEventId`.
- Multi-result objects must place `nextEventId` on each result-entry instance.
- Empty `nextEventId` means close directly.
- Explicit self-reference is forbidden.
- If `nextEventId` exists, runtime must directly `startEvent(nextEventId)`.
- No resolver, selector, or private settlement router may appear between content completion and the next event.

Allowed chains include:

- `event -> dialogue -> event`
- `event -> playable -> event`
- `event -> task -> event`
- `event -> function -> event`
- `event -> settlement -> event`
- `content -> event -> settlement -> event -> content`

## 10. Instance Ownership Placement Rules

`nextEventId` ownership follows a single-source-of-truth rule:

- resource-fixed meaning -> resource instance
- host-dependent meaning -> host instance
- orchestration continuation meaning -> `event` instance

Recommended placement:

- `dialogue` -> dialogue resource instance
- `settlement` -> settlement resource instance
- `function` -> host function-item instance
- `playable` -> host playable/menu-item instance
- `task` -> task instance, or host instance if host meaning differs
- `event` -> orchestration-style `nextEventId`

## 11. Migration And Compatibility Strategy

- Compatibility import is forbidden for this version.
- Old structures that do not satisfy the new contract must fail closed.
- Existing repository content must migrate through explicit migration batches.
- If old meaning requires a follow-up event, the migration must split out explicit event and event-binding records and write them into:
  - `events.json`
  - `event-bindings.json`
- If old meaning does not require a follow-up event, completion must close directly.
- Old `return / callback / integration / private settlement` paths must not remain as silent compatibility truth.

## 12. Script Editor / Export / Import / Preview / Loading Consistency

The new structure cannot exist only in the Script Editor. The following chains must all understand the same `nextEventId / settlement / event-type` structure:

- Script Editor authoring
- runtime-pack export
- runtime-pack import
- runtime loading
- runtime preview
- normal runtime startup

The version must not leave any state where:

- the editor can author it but export drops it
- import silently downgrades it
- preview does not understand it
- production runtime still uses the old truth
- event-type and settlement-type meaning diverge between chains

## 13. MEMO-029 Absorption Boundary

This version must fully absorb the direction previously discussed under `MEMO-029`, including:

- `event` remains the only formal creator-facing routing owner
- `dialogue / playable / task / function / settlement/result-processing` must not keep parallel "what happens next" truth
- creator-facing `return / integration / trigger-source / payload / follow-up truth` must leave minigame/playable modules and converge back to `event`
- `minigame / playable` authoring must converge toward a single-page shape
- `task` authoring must converge toward objective/progression ownership instead of becoming a second router
- reward container, settlement payload, and private return strategy must not move back into minigame/playable private end-routing structures

## 14. Creator-Facing Removal List

`minigame / playable` authoring must remove creator-facing:

- trigger source
- trigger target
- integration
- return
- return policy
- payload wording
- reference relations
- advanced settings
- system information
- creator-visible internal id
- runtime/export/payload/binding/integration jargon

The retained primary creator-facing sections are:

- basic information
- parameter configuration
- result events
- notes

These removed fields enter migration/deletion scope by default and do not require separate repeated approval.

## 15. MEMO-030 Absorption Boundary

This version must fully absorb the direction previously discussed under `MEMO-030`, including:

- `settlement` becomes a formal event type
- settlement events may only reference settlement entries
- settlement events may not embed ad hoc mutation payloads
- settlement is split into Script Editor settlement authoring plus runtime settlement execution
- Script Editor gains a formal settlement resource/list
- settlement entries include at least:
  - name
  - optional notes
  - one or more settlement items
- settlement items must cover:
  - target scope
  - target selector
  - registered attribute key
  - operator
  - value source
  - optional guard
- creator-facing settlement must not expose raw runtime paths, arbitrary JSON pointer writes, hidden dispatch payload vocabulary, or engine-private lowering details
- first production slice stays numeric-property-first
- runtime reuses and extends `runtime-settlement`
- runtime settlement returns structured report/result
- dialogue/task/playable/building-action mutation paths all converge on the same settlement route
- settlement may use instance-level `nextEventId` after execution, but it still must not become a second router

## 16. Minimal Event-Type And Settlement Boundary

- `event` = routing owner
- `event(type=settlement)` = formal event type
- `settlement` = mutation/write-back owner
- settlement events reference settlement entries only
- settlement events must not inline mutation payloads
- `settlement` does not decide when it is called or where execution goes afterward

## 17. Naming And Boundary Convergence

- `PlayableSettlement` must not continue as the mechanism direction
- the remaining playable result shell converges to `PlayableResult`
- `PlayableResult` may only carry:
  - `outcome`
  - `score`
  - `metrics`
  - `detail`
- `PlayableResult` does not own routing, settlement, or follow-up truth

Stable ownership boundary:

- `event` = routing owner
- `settlement` = mutation/write-back owner
- `dialogue` = performance/content
- `task` = objective/progression
- `playable` = runnable content

## 18. Automatic Decision And No-Pause Rules

Decision priority:

1. this iteration draft
2. `MEMO-029` absorbed direction
3. `MEMO-030` absorbed direction
4. active Blueprint governance chain
5. current code
6. historical compatibility residue

The workflow must not stop to ask again for:

- folding duplicate templates into canonical ids
- bulk reference rewrites
- deleting duplicate templates already replaced by canonical ids
- removing creator-facing fields already rejected by the absorbed direction
- splitting old structures into explicit event + event-binding when follow-up meaning exists
- closing directly when `nextEventId` is empty
- converging `PlayableSettlement` into `PlayableResult`
- changing settlement events from inline payloads to settlement-entry references

Escalation is allowed only when:

- the parent version goal would change
- a new routing owner would be introduced
- numeric-first settlement boundary would be broken
- unrecoverable author content would be deleted without reconstruction path
- governing docs conflict in a way that cannot be resolved by the stated priority

Additional no-pause defaults:

- template layer defaults to strong deduplication
- flow-neutral differences are treated as duplicates by default
- `task` does not use the relaxed template-layer duplicate rule
- missing `nextEventId` auto-splits to event + event-binding when follow-up meaning is required; otherwise it closes directly
- missing settlement reference does not invent reward payloads; explicit settlement is added only when old meaning already clearly required settlement
- bulk identification, bulk folding, bulk rewrite, and bulk validation are the default working modes
- everything explicitly covered by this iteration draft is already boundary-approved and must not trigger repeated scope confirmation

## 19. Version-Level Order Approval Rule

The following default order is already approved as part of this version boundary. Blueprint may split bounded queues within these phases, but must not stop to reconfirm the order itself.

Approved high-level order:

1. event/building instance deduplication, canonical reuse, and full reference rewrite
2. instance-level `nextEventId` plus event-only routing convergence
3. settlement resources, `event(type=settlement)`, and related authoring convergence
4. export/import/runtime loading/runtime preview/normal startup full-chain consistency convergence
5. explicit migration batches, acceptance, governance sync, and documentation updates

Constraints:

- the order itself does not require repeated human reconfirmation
- Blueprint may subdivide within each phase, but may not reverse the phase order without a real blocker or governing conflict
- as long as work remains inside the approved boundary, Blueprint must continue splitting and advancing rather than stopping to ask whether authoring/runtime/settlement/deduplication should happen first

## 20. Non-Goals

This version does not do:

- arbitrary state-path writes
- unbounded settlement-type expansion
- new routing owners
- a new orchestration flow layer
- preservation of private reward containers or private return protocols
- compatibility import bridges
- editor-only half-landings without runtime convergence
- transitional layers that silently preserve old return/integration truth

## 21. Version-Level Order Note

This draft records only version-level sequence. It does not define detailed queue execution specs. Formal queue goals, acceptance criteria, and active-task truth belong in later Blueprint version-plan and queue documents.

## 22. Acceptance Requirements

- duplicate default event instances are identified and folded into canonical ids
- duplicate building-side instances are identified and folded into canonical ids
- all surviving references point at canonical instances
- no duplicate-content parallel truth remains under different ids
- all follow-up event references use `nextEventId`
- `nextEventId` stores only `eventId`
- multi-result instances may place `nextEventId` on each result-entry instance
- empty `nextEventId` closes directly
- explicit self-reference is forbidden
- no extra middle routing layer remains
- `event` remains the only creator-facing routing owner
- `settlement` is a formal settlement object/event type but not a second router
- Script Editor authoring, event authoring, settlement authoring, runtime convergence, export/import/preview consistency, migration, and naming convergence all land within the same version boundary
- verification must at minimum cover:
  - normal start
  - JSON import
  - Script Editor runtime preview
  - city/building module entry
  - result routing
  - settlement execution
  - follow-up event chain
- `docs/change-log.md` must be updated when these changes are formally landed
- once promoted into formal Blueprint execution, the corresponding version/queue governance docs and checks must be synchronized
