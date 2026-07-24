# Event Canonical Reuse, Routing, And Settlement Governance

## Control Block

- version_id: `target.event-follow-up-routing-settlement-and-canonical-reuse-convergence`
- version_label: `event-canonical-reuse-routing-and-settlement-governance`
- closeout_contract_version: `v1`

## Human Context

### Goal

- `Land one formal version boundary that first removes duplicate event/building-side instance truth through canonical reuse, then converges all follow-up routing onto nextEventId under event-owned routing, then formalizes settlement as a resource plus event type, and finally forces Script Editor, export, import, runtime loading, runtime preview, and normal startup onto the same incompatible production truth with no compatibility import.`

### Formal Version Positioning

- `This document is the formal Blueprint version spec for target.event-follow-up-routing-settlement-and-canonical-reuse-convergence.`
- `It replaces reliance on the 2026-07-24 iteration draft as execution truth.`
- `The iteration draft remains source evidence only; version execution truth now comes from this spec, its version plan, the active queue doc, and the active task.`
- `The document name is intentionally separated from the iteration-draft naming so the formal execution record is not confused with draft scope discussion.`

### Draft Absorption Boundary

- absorbed_source_docs:
  - `docs/blueprints/specs/2026-07-24-event-routing-settlement-version-scope-iteration-draft.md`
  - `docs/blueprints/specs/2026-07-22-script-editor-event-only-routing-and-flow-retirement-requirement-draft.md`
- absorption_rule:
  - `Every approved boundary from the 2026-07-24 iteration draft is inherited here unless this spec states a stricter equivalent rule.`
- absorbed_parent_direction:
  - `event remains the only formal creator-facing routing owner`
  - `event/building/host instances deduplicate first and reuse stable canonical ids`
  - `nextEventId is the only follow-up field name and stores only eventId`
  - `settlement becomes a formal resource/object type and event(type=settlement) becomes a formal event boundary`
  - `PlayableSettlement exits and the remaining result shell converges to PlayableResult`
  - `Script Editor, export/import, loader, preview, and startup stay on one truth`
  - `compatibility import is forbidden`

### Scope

- `Event-module instances, building-module instances, host-owned related instances, and their references are deduplicated and rewritten onto canonical ids before later routing or settlement work begins.`
- `Deduplication-first is the required first phase for this version.`
- `nextEventId is the single formal follow-up field name across dialogue / task / playable / function / settlement ownership surfaces.`
- `nextEventId stores only an event id and carries no condition, reward, settlement, payload, selector, or lowering truth.`
- `Empty nextEventId closes directly.`
- `Explicit self-reference through nextEventId is forbidden.`
- `Multi-result objects may place nextEventId on each result instance independently.`
- `event remains the only formal routing owner even after nextEventId convergence.`
- `No resolver, selector, private settlement router, or transitional routing layer may be inserted between content completion and the next started event.`
- `settlement becomes a formal Script Editor resource/object type, and event(type=settlement) becomes the formal event-side entry boundary for settlement execution.`
- `settlement owns mutation/write-back only; it must not become a second routing owner.`
- `PlayableSettlement must converge out of production truth; PlayableResult becomes the surviving result contract name.`
- `PlayableResult must not own routing truth, settlement truth, or follow-up truth.`
- `Script Editor, export, import, runtime loading, runtime preview, and normal startup must all use the same canonical-id, nextEventId, settlement, and event-type truth.`
- `Compatibility import is forbidden throughout this version.`
- `If old meaning requires a follow-up event and nextEventId is missing, migration must split explicit event + event-binding records.`
- `If old meaning does not require a follow-up event, the migrated path must close directly instead of inventing a compatibility bridge.`
- `Any missing follow-up EventId and EventBinding created during migration must land in the formal configuration tables such as events.json and event-bindings.json.`
- `Building-side work must continue through the Script Editor arrangement / event-binding / playable-flow / shared-runtime path and must not reintroduce building business hardcoding in src/main.ts.`

### Formal Deduplication Contract

- `Template-layer libraries default to strong deduplication.`
- `If content is the same, it is a duplicate candidate by default even when ids differ.`
- `Different ids alone never justify keeping multiple surviving copies.`
- `task does not use a relaxed "probably duplicate means merge" rule and still requires stricter semantic judgment around objective/progression meaning.`
- `Canonical comparison must ignore id-only, sort-only, display-only, tracing-only, source-metadata, and create/update-history fields by default.`
- `Canonical comparison must include creator-visible primary content, runtime action content, result-entry structure, nextEventId, event-binding conditions, host semantics, settlement semantics, and any structural field that changes creator-facing or runtime meaning.`
- `Different nextEventId, different binding conditions, different host semantics, different settlement semantics, different result-entry structure, or explicit author intent to separate must prevent merging.`
- `Canonical id selection must be stable and repeatable: prefer highest reference count, then default-template-library baseline id, then earlier stable template-library id, then one deterministic tie-breaker.`
- `Every deduplication batch must rewrite all owned references to the selected canonical id.`
- `No retired duplicate id may survive in export/import/loading/preview/startup truth after the queue claims canonical reuse.`
- `Canonical merge records must preserve source id, canonical id, merge reason, whether strong template dedup applied, and whether exception review was needed.`

### Event-Binding Boundary

- `Event-binding deduplication is in scope whenever canonical event ids change.`
- `Bindings are duplicate candidates only when owner, trigger, conditions, priority, enabled state, host semantics, and canonical target eventId are all the same.`
- `Bindings must remain separate when owner, trigger, conditions, host semantics, priority, enabled state, or canonical target event meaning differ.`
- `After event-instance deduplication, the version must at minimum rewrite canonical event ids in event-bindings, detect duplicate bindings, fold truly duplicate bindings, and record preservation reasoning for non-foldable bindings.`

### Full Reference Rewrite Contract

- `This version requires full owned reference rewrite after canonical selection.`
- rewrite_surfaces:
  - `all nextEventId references`
  - `event references inside events.json`
  - `eventId references in event-bindings.json`
  - `event references in building instances, menu items, function items, arrangement records, container records, and action records`
  - `settlement-event references`
  - `runtime-pack exported event references`
  - `imported event indexes`
  - `runtime-preview event mappings`
  - `normal-startup event loading/materialization references`
  - `Script Editor materialization-generated event and binding references`
- required_outcome:
  - `Every old reference points to a canonical surviving id, and no dangling or dual truth remains.`

### Follow-Up Routing Contract

- `nextEventId is the only formal follow-up event field name.`
- `nextEventId stores only eventId.`
- `nextEventId does not store conditions, rewards, settlement logic, payload wording, selector state, or lowering details.`
- `Single-exit instances may own one direct nextEventId.`
- `Multi-result instances may own one nextEventId per result-entry instance.`
- `If nextEventId exists, runtime must directly startEvent(nextEventId).`
- `If nextEventId is empty, the path closes directly.`
- `Explicit self-reference is forbidden.`
- `dialogue / task / playable / function / settlement may own nextEventId where their instance meaning requires it, but that ownership does not create a second router.`
- `event remains the only formal creator-facing routing owner, including orchestration continuation.`
- `No resolver / selector / transition router / private settlement router may appear between completion and next-event startup.`

### Settlement Contract

- `settlement is a formal Script Editor resource/object type.`
- `event(type=settlement) is a formal event type.`
- `settlement events may reference settlement entries only.`
- `settlement events must not inline ad hoc mutation payloads.`
- `settlement remains numeric-property-first in this production slice.`
- `settlement owns mutation/write-back only and must not decide when it is called or where execution routes afterward.`
- `settlement may use instance-level nextEventId after execution only as an event reference field; that does not make settlement a second router.`
- `Dialogue/task/playable/building-action mutation routes must converge onto the same settlement execution path.`

### Naming And Ownership Convergence

- `PlayableSettlement must not continue as a production mechanism direction.`
- `The surviving result shell name is PlayableResult.`
- `PlayableResult may only carry outcome / score / metrics / detail.`
- `PlayableResult must not own routing, settlement, follow-up, or return truth.`
- stable_ownership_boundary:
  - `event = routing owner`
  - `settlement = mutation/write-back owner`
  - `dialogue = performance/content owner`
  - `task = objective/progression owner`
  - `playable = runnable content owner`

### Chain Consistency And Migration Contract

- `Script Editor authoring, runtime-pack export, runtime-pack import, runtime loading, runtime preview, and normal runtime startup must all understand the same canonical ids, nextEventId structure, settlement references, and event-type boundaries.`
- `The version must not leave an editor-only half-landing where export drops, import downgrades, preview ignores, or startup reconstructs old truth.`
- `Compatibility import is forbidden.`
- `Old return / callback / integration / private settlement / private reward routing paths must not survive as silent compatibility truth.`
- `When old meaning clearly requires a follow-up event but none is present under the new structure, migration must materialize explicit event + event-binding records into events.json and event-bindings.json.`
- `When old meaning does not clearly require a follow-up event, the migrated path must close directly.`
- `Missing settlement references must not cause invented reward payloads; settlement is only added when old meaning clearly required settlement.`

### Queue Contract Portfolio

| Queue ID | Class | Contract Role | Admission Rule |
| --- | --- | --- | --- |
| `queue.event-and-building-instance-canonical-reuse` | `required-first` | `Own event/building/host-instance deduplication, canonical id selection, event-binding rewrite boundary, and full reference rewrite onto canonical ids.` | `Must admit first and become the initial active queue.` |
| `queue.instance-next-event-id-and-event-routing-convergence` | `required` | `Unify nextEventId ownership and direct event-owned continuation without adding a middle layer.` | `Admit only after canonical reuse is closed and synchronized.` |
| `queue.settlement-resource-and-event-type-convergence` | `required` | `Introduce settlement resources, event(type=settlement), numeric-first settlement semantics, and PlayableResult naming convergence.` | `Admit only after nextEventId routing truth is stable.` |
| `queue.full-chain-event-routing-and-settlement-consistency` | `required` | `Converge Script Editor, export/import, loader, preview, startup, and runtime onto the same landed truth.` | `Admit only after settlement contract freeze.` |
| `queue.event-routing-settlement-migration-and-final-acceptance` | `required-final` | `Run explicit migration, fail-closed rejection, acceptance proof, residue guard, and version-closeout evidence.` | `Admit last.` |

### Acceptance Matrix

| Acceptance ID | Requirement | Primary Owner Queue | Proof Type | Closeout Blocker |
| --- | --- | --- | --- | --- |
| `ACC-EVENT-SETTLE-001` | `Event-module instances, building-module instances, related host instances, and duplicate bindings are identified under the formal strong-dedup contract, with stable canonical id selection and no flow-affecting false merges.` | `queue.event-and-building-instance-canonical-reuse` | `source audit + canonical-map review + migration evidence` | `Duplicate truth survives or canonical folding merges flow-affecting differences.` |
| `ACC-EVENT-SETTLE-002` | `All owned references, including event-bindings, host event refs, arrangement/container/action refs, export/import refs, preview refs, and startup refs, rewrite to canonical ids with no dangling or dual truth.` | `queue.event-and-building-instance-canonical-reuse` | `round-trip tests + source-removal guards + reference inventory` | `Any live path still points at retired ids or preserves duplicate truth.` |
| `ACC-EVENT-SETTLE-003` | `All follow-up event references converge on nextEventId, store only eventId, allow result-entry ownership where applicable, close directly when empty, and forbid explicit self-reference.` | `queue.instance-next-event-id-and-event-routing-convergence` | `authoring tests + runtime routing tests + source review` | `Mixed follow-up field names, payload-bearing follow-up fields, or self-referential routing remain live.` |
| `ACC-EVENT-SETTLE-004` | `event remains the only formal creator-facing routing owner and runtime routes directly from completion to startEvent(nextEventId) with no resolver, selector, or settlement-owned router in the middle.` | `queue.instance-next-event-id-and-event-routing-convergence` | `runtime tests + source-removal guards + building-path review` | `Any second router or middle routing layer survives.` |
| `ACC-EVENT-SETTLE-005` | `settlement becomes a first-class resource and event(type=settlement) formal type, references settlement entries only, stays numeric-first, and does not inline ad hoc payload mutation truth.` | `queue.settlement-resource-and-event-type-convergence` | `authoring tests + runtime settlement tests + source review` | `Settlement events embed payloads, expose engine-private lowering, or become a second router.` |
| `ACC-EVENT-SETTLE-006` | `Script Editor, export/import, loader, preview, normal startup, and runtime execution all share the same canonical-id, nextEventId, settlement, and event-type truth.` | `queue.full-chain-event-routing-and-settlement-consistency` | `round-trip tests + preview/runtime tests + source guards` | `Any chain can author the new truth while another chain drops, downgrades, or silently reconstructs old truth.` |
| `ACC-EVENT-SETTLE-007` | `Migration is explicit and fail-closed: compatibility import is absent, missing follow-up meaning splits to explicit event + event-binding or direct close as required, missing event ids/bindings land in formal config tables, and PlayableSettlement retires into PlayableResult.` | `queue.event-routing-settlement-migration-and-final-acceptance` | `migration tests + rejection tests + source-removal guards` | `Legacy compatibility import or private settlement/routing truth survives in production.` |
| `ACC-EVENT-SETTLE-008` | `Final acceptance proves normal start, JSON import, Script Editor runtime preview, city/building module entry, result routing, settlement execution, and chained follow-up event behavior on the formal landed model.` | `queue.event-routing-settlement-migration-and-final-acceptance` | `browser proof + acceptance ledger + automated regression coverage` | `The version attempts closeout without cross-entrypoint acceptance on the landed truth.` |

### Acceptance Criteria

- `Deduplication-first is mandatory and already approved at version level.`
- `Template-layer strong deduplication is the default rule.`
- `Id difference alone never justifies keeping duplicate instances.`
- `task retains stricter semantic separation rules and does not use a broad duplicate-shortcut policy.`
- `Canonical reuse must perform full owned reference rewrite before later routing/settlement work claims progress.`
- `nextEventId is the only follow-up field name and stores only eventId.`
- `Empty nextEventId closes directly.`
- `Explicit self-reference is forbidden.`
- `Multi-result objects may configure nextEventId on each result instance independently.`
- `event remains the only formal routing owner.`
- `No resolver / selector / transitional routing layer may be inserted.`
- `settlement is formalized as resource/object type plus event(type=settlement) boundary, but settlement never becomes a second router.`
- `PlayableSettlement must converge out, and PlayableResult must not own routing/settlement/follow-up truth.`
- `Script Editor/export/import/loading/preview/startup/runtime must stay aligned in one version.`
- `Compatibility import is forbidden.`
- `If old meaning needs a follow-up event and nextEventId is missing, migration must create explicit event + event-binding records in events.json / event-bindings.json.`
- `If old meaning does not need a follow-up event, the path closes directly.`

### Version-Level Order Approval

- `This version records high-level sequence only. Blueprint may subdivide within phases, but it must not stop to reconfirm the phase order itself.`

1. `event/building/host-instance deduplication, canonical reuse, and full reference rewrite`
2. `instance-level nextEventId plus event-only routing convergence`
3. `settlement resources, event(type=settlement), and PlayableResult boundary convergence`
4. `Script Editor/export/import/loading/preview/startup/runtime full-chain consistency`
5. `explicit migration, fail-closed acceptance, governance sync, and version closeout`

### Final Acceptance Coverage Contract

- `Final validation must review the full Acceptance Matrix, not one editor or runtime happy path.`
- `Every required acceptance must be covered, blocked, or explicitly routed before version closeout.`
- `The required-final queue may own migration, fail-closed validation, acceptance, and residue guard only; it must not absorb unfinished implementation from earlier queues.`

### Version Closeout Contract

- `The version may close only after acceptance passes, no active queue/task remains, residue is routed, and the version plan records explicit closeout truth.`
- `Open-version status is not inferred away by queue completion.`
- `As long as this version remains open and the active queue is not none, execution must continue from project-progress -> blueprint -> version plan -> active queue -> active task rather than dropping back to shell-only review.`
- `docs/change-log.md must be updated once implementation lands code/runtime/data/shared-interface/user-visible changes inside this version.`

### Archived Interpretation

- `Historical interpretation is deferred until version closeout.`
