# Event Follow-Up Routing, Settlement, And Canonical Reuse Convergence

## Control Block

- version_id: `target.event-follow-up-routing-settlement-and-canonical-reuse-convergence`
- version_label: `event-follow-up-routing-settlement-and-canonical-reuse-convergence`
- closeout_contract_version: `v1`

## Human Context

### Goal

- `Converge the project onto one event-owned follow-up routing model by landing canonical event/building-instance reuse first, then unifying instance-level nextEventId ownership across dialogue / task / playable / function / settlement, formalizing settlement as an event-owned mutation resource/type, and forcing Script Editor / export / import / preview / runtime startup to share the same incompatible truth with no compatibility import residue.`

### Version Draft Summary

- Goal:
  - `Promote the 2026-07-24 event-routing / settlement iteration draft into a governed successor target that owns duplicate-instance folding, canonical id rewrite, event-only follow-up routing, settlement resource/event-type convergence, naming cleanup, and full-chain migration/acceptance as one inseparable replacement boundary.`
- Required outcomes:
  - `Default event templates, building-side template instances, and related host-side instances are strongly deduplicated by content and rewritten onto canonical ids before follow-up routing expansion begins.`
  - `All follow-up event references converge on one field name, nextEventId, and that field stores only the next event id.`
  - `dialogue / task / playable / function / settlement instances may expose one or more follow-up exits through instance-level nextEventId ownership, while event remains the only formal creator-facing routing owner.`
  - `Empty nextEventId closes directly, explicit self-reference is forbidden, and no resolver / selector / private settlement router may appear between content completion and event startup.`
  - `Settlement becomes a first-class Script Editor resource and a formal event type through event(type=settlement), but settlement still owns mutation/write-back only and never becomes a second router.`
  - `PlayableSettlement is retired as the mechanism direction and the remaining playable result shell converges to PlayableResult carrying outcome / score / metrics / detail only.`
  - `Script Editor authoring, runtime-pack export/import, runtime loading, runtime preview, and normal startup all understand the same canonical ids, nextEventId model, settlement references, and event-type boundaries.`
  - `Migration remains explicit and fail-closed: no compatibility import, no silent legacy callback return chains, and no hidden reward/settlement payload reconstruction are allowed.`
- Explicit non-goals:
  - `Do not introduce a new routing owner, orchestration layer, selector layer, or transitional middle router between content completion and the next event.`
  - `Do not preserve compatibility import bridges, private return protocols, inline settlement payload truth, or editor-only half-landings that runtime/export/import do not share.`
  - `Do not widen this version into arbitrary state-path writes, unbounded settlement grammar, or unrelated building/runtime refactors outside the owned convergence chain.`
- Must preserve:
  - `Building-side behavior must continue through the Script Editor arrangement / event-binding / playable-flow / shared runtime path rather than hardcoded main.ts business branches.`
  - `Normal start, JSON runtime-pack import, Script Editor runtime preview, city/building module entry, result-dependent routing, and settlement execution continuity.`
  - `Host-dependent meaning stays on host instances, resource-fixed meaning stays on resource instances, and orchestration continuation stays on event.`
- Must replace:
  - `Duplicate template or instance truth that differs only by id.`
  - `Mixed follow-up field names, hidden return/integration callbacks, private settlement routing, PlayableSettlement as forward design direction, and settlement inline payload ownership.`
- Reference material:
  - `docs/blueprints/specs/2026-07-24-event-routing-settlement-version-scope-iteration-draft.md`
  - `docs/blueprints/specs/2026-07-22-script-editor-event-only-routing-and-flow-retirement-requirement-draft.md`

### Evidence Draft Review

- evidence_draft_status: `reviewed`
- reviewed_by_operator: `yes`
- review_summary:
  - `The operator explicitly requested turning the 2026-07-24 iteration draft into a formal Blueprint version spec / plan, keeping all approved boundaries, keeping phase order at version level only, avoiding repeat scope-confirmation pauses, and preserving event as the sole formal routing owner.`

### Draft Requirement Coverage

| Draft Requirement | Acceptance IDs | Status |
| --- | --- | --- |
| `Event/building instance deduplication and canonical reuse first` | `ACC-EVENT-SETTLE-001; ACC-EVENT-SETTLE-002` | `covered` |
| `Unified nextEventId follow-up slot model` | `ACC-EVENT-SETTLE-003` | `covered` |
| `Event-only routing with no middle layer` | `ACC-EVENT-SETTLE-004` | `covered` |
| `Settlement resource and settlement event-type convergence` | `ACC-EVENT-SETTLE-005` | `covered` |
| `Export/import/preview/runtime/startup full-chain consistency` | `ACC-EVENT-SETTLE-006` | `covered` |
| `Explicit migration, naming convergence, and no compatibility import` | `ACC-EVENT-SETTLE-007` | `covered` |
| `End-to-end acceptance across entry, routing, and settlement chains` | `ACC-EVENT-SETTLE-008` | `covered` |

### Scope

- `Default event-template deduplication, building-side instance deduplication, host-instance canonical reuse, and full reference rewrite onto canonical ids.`
- `Instance-level nextEventId ownership for dialogue / task / playable / function / settlement and orchestration-style event continuation where applicable.`
- `Settlement resource/list authoring, event(type=settlement), settlement-entry reference semantics, and runtime settlement execution reuse.`
- `PlayableResult naming/boundary convergence and retirement of PlayableSettlement as a forward authoring/runtime mechanism.`
- `Script Editor authoring, runtime-pack export/import, runtime loading, runtime preview, normal startup, and migration validation inside the same incompatible batch.`
- `Governance-level no-pause defaults for approved phase order, bulk dedup/rewrite mode, and fail-closed migration handling inside this parent target.`

### Non-Goals

- `Compatibility import or hidden legacy reconstruction for missing nextEventId / settlement references.`
- `A new flow layer, resolver layer, or any routing owner other than event.`
- `Arbitrary JSON pointer writes, unbounded settlement item kinds, or unrelated runtime/builder modularization outside this version's owned replacement chain.`

### Queue Contract Portfolio

| Queue ID | Class | Contract Role | Admission Rule |
| --- | --- | --- | --- |
| `queue.event-and-building-instance-canonical-reuse` | `required` | `Own duplicate-instance identification, canonical id selection, strong template-layer deduplication, and full reference rewrite for event/building-side instances.` | `Admit first because all later nextEventId and settlement work must build on canonical ids rather than duplicate truth.` |
| `queue.instance-next-event-id-and-event-routing-convergence` | `required` | `Unify instance-level nextEventId ownership and direct event routing across dialogue / task / playable / function / settlement without introducing a middle layer.` | `Admit only after canonical reuse closes and all surviving references already point at canonical ids.` |
| `queue.settlement-resource-and-event-type-convergence` | `required` | `Introduce settlement resources, event(type=settlement), numeric-first settlement authoring/runtime boundaries, and PlayableResult naming convergence.` | `Admit only after nextEventId routing truth is stable and event remains the sole formal routing owner.` |
| `queue.full-chain-event-routing-and-settlement-consistency` | `required` | `Converge Script Editor authoring, export/import, loader, preview, startup, and runtime behavior onto the same canonical ids, nextEventId, and settlement-event semantics.` | `Admit after settlement resource/event-type semantics are frozen; no unrelated queue may interleave before full-chain consistency is proven.` |
| `queue.event-routing-settlement-migration-and-final-acceptance` | `required-final` | `Run explicit migration batches, fail-closed rejection coverage, acceptance proof, and final residue guard for the full version boundary.` | `Admit last; it must not become the primary owner for earlier implementation-bearing queues.` |

### Acceptance Matrix

| Acceptance ID | Requirement | Primary Owner Queue | Proof Type | Expected Implementation Anchor | Closeout Blocker |
| --- | --- | --- | --- | --- | --- |
| `ACC-EVENT-SETTLE-001` | `Default event templates, building-side instances, and related host instances are strongly deduplicated by content with stable canonical id selection and no flow-affecting false merges.` | `queue.event-and-building-instance-canonical-reuse` | `source audit + migration coverage + canonical-map review` | `events.json; event-bindings.json; Script Editor authored building/menu/function instance surfaces; tests/**` | `Duplicate content survives under different ids or canonical folding merges flow-affecting differences.` |
| `ACC-EVENT-SETTLE-002` | `All surviving references, including event-binding targets, host-owned event refs, and exported/imported/runtime refs, rewrite to canonical ids with no dangling or dual truth.` | `queue.event-and-building-instance-canonical-reuse` | `round-trip tests + source-removal guards` | `runtime-pack export/import; loader resolution; runtime preview mappings; startup loading; tests/**` | `Any live path still points at retired duplicate ids or reconstructs duplicate truth.` |
| `ACC-EVENT-SETTLE-003` | `All follow-up event references converge on nextEventId, store only eventId, allow instance/result-entry ownership where applicable, close directly when empty, and forbid explicit self-reference.` | `queue.instance-next-event-id-and-event-routing-convergence` | `authoring tests + runtime routing tests + source review` | `src/domain/event.ts; dialogue/task/playable/function/settlement authoring/runtime surfaces; tests/**` | `Follow-up truth still depends on mixed field names, private payloads, or hidden callback return chains.` |
| `ACC-EVENT-SETTLE-004` | `Content completion routes directly back through event with no resolver/selector/middle router, so event remains the only formal creator-facing routing owner.` | `queue.instance-next-event-id-and-event-routing-convergence` | `runtime tests + source-removal guards + building-path review` | `event runtime entrypoints; EventBindingRuntime; building/dialogue/task/playable integration paths; tests/**` | `Any private router, settlement-owned routing seam, or host-local hidden continuation still sits between completion and startEvent(nextEventId).` |
| `ACC-EVENT-SETTLE-005` | `Settlement becomes a first-class Script Editor resource and formal event type through event(type=settlement), references settlement entries only, stays numeric-first, and does not inline ad hoc mutation payloads.` | `queue.settlement-resource-and-event-type-convergence` | `authoring tests + runtime settlement tests + source review` | `settlement authoring/resource surfaces; runtime-settlement reuse; event definitions; tests/**` | `Settlement events still embed mutation payloads, expose engine-private lowering, or become a second router.` |
| `ACC-EVENT-SETTLE-006` | `Script Editor, export/import, loader, preview, runtime startup, and runtime execution all share the same canonical-id, nextEventId, and settlement-event truth with no editor-only drift.` | `queue.full-chain-event-routing-and-settlement-consistency` | `round-trip tests + preview/runtime tests + source guard` | `src/application/script-editor/**; runtime-pack export/import; scenario pack loader; preview/runtime loaders; tests/**` | `Any chain can author the new structures while another chain drops, downgrades, or silently reconstructs old truth.` |
| `ACC-EVENT-SETTLE-007` | `Migration is explicit and fail-closed: no compatibility import remains, missing follow-up meaning splits into explicit event + event-binding or direct close as required, settlement references are added only when old meaning clearly required settlement, and PlayableSettlement retires into PlayableResult.` | `queue.event-routing-settlement-migration-and-final-acceptance` | `migration tests + rejection tests + source-removal guards` | `migration scripts/batches; events.json; event-bindings.json; playable result contracts; tests/**` | `Legacy compatibility import, hidden reward reconstruction, or PlayableSettlement-owned routing/settlement truth survives as production behavior.` |
| `ACC-EVENT-SETTLE-008` | `Final acceptance proves normal start, JSON import, Script Editor runtime preview, city/building module entry, result routing, settlement execution, and chained follow-up event behavior on the landed canonical model.` | `queue.event-routing-settlement-migration-and-final-acceptance` | `browser proof + acceptance ledger + automated regression coverage` | `tests/**; browser flow; version acceptance ledger` | `The version tries to close on source-only reasoning or without proving entry/routing/settlement continuity across required paths.` |

### Acceptance Criteria

- `This version must execute deduplication and canonical reuse before nextEventId and settlement expansion; the phase order is part of the approved parent boundary and does not require repeated reconfirmation.`
- `Template-layer strong deduplication applies by default, and id difference alone cannot justify keeping duplicate event/building-side content.`
- `task remains excluded from the relaxed "uncertain duplicate becomes duplicate" shortcut and still requires stricter semantic separation when its objective/progression meaning differs.`
- `nextEventId is the only follow-up field name, stores only eventId, and may live on single-exit instances or result-entry instances depending on owned meaning.`
- `If nextEventId exists, runtime must directly start that event; if nextEventId is empty, runtime must close directly.`
- `Explicit self-reference is forbidden, and no private settlement/router layer may be inserted between content completion and the next event.`
- `Settlement events may reference settlement entries only and must not inline payloads; settlement remains mutation/write-back ownership only.`
- `PlayableResult may carry outcome / score / metrics / detail only and must not own routing, settlement, or follow-up truth.`
- `Script Editor, export/import, preview, loading, startup, and runtime execution must all share one incompatible truth in the same version.`
- `Compatibility import is forbidden; all old structures must migrate explicitly or fail closed.`
- `The version must not close while duplicate-id truth, mixed follow-up semantics, settlement inline payloads, or cross-chain drift remain live anywhere inside the owned boundary.`

### Final Acceptance Coverage Contract

- `Final validation must review the Acceptance Matrix rather than only one editor or runtime happy path.`
- `Every required acceptance must be covered, blocked, or explicitly accepted as non-blocking residue before version closeout.`
- `The required-final queue may own migration/acceptance/final residue guard only; it may not absorb implementation-bearing work that belongs to earlier queues.`

### Version Closeout Contract

- `Version may become done only after acceptance passes, no active queue/task remains, residue is dispositioned, and the version plan records explicit closeout.`
- `As long as the version remains open and no active queue exists, a new queue may still be admitted only if future evidence proves a same-version lawful residue path.`
- `Open-version status is not inferred away by queue completion; the version remains open until explicit human closeout confirmation is recorded in the version plan.`
- `If no open version exists, a new version must be explicitly created before queue admission or implementation resumes.`

### Archived Interpretation

- `Historical interpretation is deferred until version closeout.`
