# Script Editor Content Format, Runtime Layout, And Module Capability Convergence

## Control Block

- version_id: `target.script-editor-content-format-runtime-layout-and-module-capability-convergence`
- version_label: `script-editor-content-format-runtime-layout-and-module-capability-convergence`
- closeout_contract_version: `v1`

## Human Context

### Goal

- `Land one formal version boundary that unifies Script Editor content format, completes all currently known in-scope module capability gaps, introduces runtime-layout persistence plus runtime UI layering, and forces authoring/export/import/preview/runtime loading/runtime consumption onto one event-owned production truth with no compatibility layer.`

### Formal Version Positioning

- `This document is the formal Blueprint version spec for target.script-editor-content-format-runtime-layout-and-module-capability-convergence.`
- `The version is created from the operator-approved unified requirement sheet on 2026-07-26 rather than from version-memo promotion.`
- `Version execution truth comes from this spec, its version plan, any active queue doc later admitted under this target, and the live active task inside that queue.`

### Requirement Source Boundary

- requirement_source:
  - `operator-approved requirement consolidation recorded in-thread on 2026-07-26`
- source_rule:
  - `Every requirement explicitly approved in that consolidation is inherited here unless this spec states a stricter equivalent rule.`
- source_non_dependence:
  - `This version must not be reframed as a version-memo promotion or silently narrowed to one memo-sized queue.`

### Scope

- `This version covers people, cities, buildings, dialogue, playable, settlement, event, stage configuration, menu, and preview/runtime loading chains.`
- `Story-node / plot-node work is not in this version boundary.`
- `Script Editor content format must unify across authoring structure, operation semantics, field grouping, internal-ID handling, reference shape, and creator-facing information architecture.`
- `Known capability gaps are in scope when they satisfy at least one of the approved entry tests: authoring-visible but non-effective behavior, import/export/preview/runtime mismatch, or a formal module boundary that still lacks its full resource/instance/reference/consumption chain.`
- `All follow-up flow must converge to event-owned routing. No module may keep a private continuation chain, private jump rule, or private result-routing rule beside event.`
- `Runtime layout is in scope only as runtime/preview layout truth plus runtime UI layering. This version does not treat Script Editor page layout itself as the layout-module target.`

### Formal Authoring Format Contract

- `Script Editor authoring surfaces must converge on one content-format direction across the covered modules.`
- `Duplicate or same-meaning surfaces must not survive in parallel.`
- `If two authoring surfaces describe the same creator-facing concept, one canonical surface must survive and the duplicate surface must retire.`
- `Example inherited from operator requirement: people-module mapping fields must converge into custom attributes rather than remain as a separate parallel feature.`
- `Module field shape must converge toward base attributes plus extended/custom attributes instead of flat first-level field sprawl.`
- `Creator-facing authoring surfaces must not expose runtime-lowering wording, engine-private terminology, system-information panels, or developer-only controls as normal authoring truth.`
- `Authoring surfaces must prefer title/name and creator meaning; internal ids remain program truth but must not become the primary authoring interaction object.`

### Authoring Operation Contract

- `Follow-up slots belong to module instance basic information rather than living as an event-binding substitute.`
- `Event bindings must live as an instance-local dedicated tab rather than being mixed into basic follow-up-slot semantics.`
- `Module operation patterns must not continue mixing follow-up slots, event binding, and runtime integration wording into one creator-facing control set.`
- `Event itself must also converge structurally: event type, event instance shape, basic-info section, follow-up slot, binding relationship, and host reference semantics all belong to this version.`

### Numeric ID Contract

- `Creator-visible title/name is not the formal internal id.`
- `Program truth still uses formal internal ids.`
- `Formal ids across the covered modules must follow the Script Editor unified id-generation rule.`
- `The formal id shape is numeric-combination based.`
- `Alphabetic, pinyin, English-name, or hand-spelled id families are not allowed as the formal id model for new or migrated covered content.`
- `References, export shape, loader shape, runtime lookup, and reference rewrite all use the formal numeric id rule.`
- `Creator-facing surfaces must not require the user to operate primarily through raw internal ids.`
- `Different modules must not invent different id-shape rules.`

### Stage Configuration Contract

- `Stage configuration does not directly own inline stage target instances inside the stage module itself.`
- `Stage-related instances must be configured first under host-module instances, then consumed by stage configuration through references.`
- `Stage configuration is therefore a reference consumer, not the primary object owner, for those instances.`
- `The stage-host contract must be an extensible host-family model.`
- `Current production hosts in this version are people, cities, buildings, and events.`
- `Later module onboarding must not require redesigning stage data structure, export structure, or runtime consumption paths.`

### Menu Module Contract

- `A formal menu module must exist in this version.`
- `The menu module owns menu-instance creation and menu-order composition.`
- `Cities and buildings only keep references to menu instances.`
- `Cities and buildings must not continue embedding hardcoded or inline menu capability as their formal production truth.`
- `Menu capability is incomplete until authoring, export/import, preview, runtime loading, and runtime consumption all use the same formal menu-instance route.`
- `Menu behavior may trigger or reference events, but menu must not become a second router.`

### Playable, Dialogue, Settlement, And Event Boundary Contract

- `Playable input/output semantics must converge onto one formal runtime-consumable chain.`
- `Playable results must not keep a private result protocol that bypasses settlement or event-owned follow-up routing.`
- `When playable meaning requires write-back, the result must converge into the formal settlement path.`
- `Settlement owns mutation/write-back only and must not become a second routing owner.`
- `Dialogue authoring must not retain its old creator-facing preview surface under the editor module boundary.`
- `Dialogue runtime presentation must actually consume creator-configured dialogue truth, including portrait placement and related visible composition settings.`
- `Event remains the only formal routing owner and must itself be structurally unified inside this version rather than treated as an untouched anchor while other modules change around it.`

### Event-Owned Routing And No-Compatibility Contract

- `Event is the only formal routing owner across the covered modules.`
- `All non-event routing must be converted to event-owned routing.`
- `Menu, dialogue, playable, settlement, and stage configuration may trigger or reference events, but they must not preserve private follow-up chains, return strategies, or result-destination systems.`
- `Compatibility import is forbidden throughout this version.`
- `Old authoring shape plus new authoring shape must not remain as a supported dual truth.`
- `Old runtime routing or old runtime consumption paths must not remain as a silent fallback.`
- `If a legacy path is still needed for meaning preservation, it must be migrated into formal event-owned truth rather than preserved as a compatibility seam.`

### Runtime Layout And UI Layering Contract

- `Runtime layout applies to runtime and preview, not to Script Editor page-layout governance.`
- `Runtime layout must not become a creator-facing visible module that requires manual layout-instance management in normal authoring.`
- `Runtime or preview interaction must allow live layout adjustment and must persist the result as formal runtime-layout truth.`
- `Runtime layout truth must be exported with the scenario pack.`
- `Runtime must automatically load layout truth by host family / host id / surface semantics instead of requiring the creator to hand-wire visible layout references.`
- `Runtime layout must use a dedicated persisted registry file.`
- `The formal loading strategy supports object-level layout first and family-level default layout second.`
- `Runtime UI layering is part of the same formal runtime-layout contract.`
- `Old private layout paths, inline hardcoded runtime layout truth, or module-private layout fallback branches must not survive as formal production behavior.`

### Covered Modules

- covered_modules:
  - `people`
  - `city`
  - `building`
  - `dialogue`
  - `playable`
  - `settlement`
  - `event`
  - `stage-configuration`
  - `menu`
  - `preview/runtime-loading chain`

### Queue Contract Portfolio

| Queue ID | Class | Contract Role | Admission Rule |
| --- | --- | --- | --- |
| `queue.script-editor-content-format-and-authoring-surface-unification` | `required-first` | `Own authoring-format convergence, base-vs-extended field structure, numeric id rule adoption, duplicate-surface retirement, creator-facing de-developerization, and event authoring structure normalization.` | `Must admit first and become the initial active queue.` |
| `queue.stage-host-binding-and-menu-resource-runtime-convergence` | `required` | `Own stage host-reference convergence plus menu resource/instance/runtime consumption completion.` | `Admit only after authoring-format and id-rule baseline is stable.` |
| `queue.event-owned-routing-dialogue-playable-settlement-convergence` | `required` | `Own non-event-routing retirement, event-only continuation convergence, playable-output settlement handoff, and dialogue/runtime truth completion.` | `Admit only after stage/menu reference semantics are stable.` |
| `queue.runtime-layout-registry-and-ui-layering-convergence` | `required` | `Own runtime-layout registry persistence, live preview/runtime adjustment save-back, host-based auto-load, and runtime UI layering convergence.` | `Admit only after event-owned routing boundary is frozen so runtime layout does not absorb business routing.` |
| `queue.preview-runtime-loading-full-chain-consistency-and-final-acceptance` | `required-final` | `Own export/import/loading/preview/runtime consistency, final acceptance, fail-closed rejection, and version closeout proof.` | `Admit last.` |

### Acceptance Matrix

| Acceptance ID | Requirement | Primary Owner Queue | Proof Type | Closeout Blocker |
| --- | --- | --- | --- | --- |
| `ACC-FORMAT-001` | `Covered modules share one authoring content-format direction: duplicate same-meaning surfaces are retired, base-vs-extended structure is established where required, creator-facing de-developerization is landed, and event authoring structure is normalized.` | `queue.script-editor-content-format-and-authoring-surface-unification` | `source audit + authoring tests + source-removal guards` | `Authoring still exposes duplicated concepts, flat-only field sprawl, or developer/runtime-facing surface truth as creator truth.` |
| `ACC-FORMAT-002` | `All covered modules use the unified numeric id rule for generation, persistence, export, runtime lookup, and reference rewrite while creator-facing operation remains title/name-first.` | `queue.script-editor-content-format-and-authoring-surface-unification` | `id-allocation tests + round-trip tests + source-removal guards` | `Any covered module still emits non-unified ids or requires creators to operate primarily through internal id fields.` |
| `ACC-FORMAT-003` | `Stage configuration becomes host-reference based and extensible, and menu becomes a formal resource/instance/runtime-consumed module rather than an inline city/building behavior patch.` | `queue.stage-host-binding-and-menu-resource-runtime-convergence` | `authoring tests + export/runtime tests + source audit` | `Stage still owns inline instances directly or menu still survives as city/building inline hardcode.` |
| `ACC-FORMAT-004` | `All covered follow-up flow converges onto event-owned routing; playable output formally reaches settlement when needed; dialogue runtime truly consumes author-configured presentation; and no module retains a private continuation chain.` | `queue.event-owned-routing-dialogue-playable-settlement-convergence` | `runtime tests + authoring/runtime parity tests + source-removal guards` | `Any second router, private follow-up chain, or non-effective dialogue/playable/settlement linkage survives.` |
| `ACC-FORMAT-005` | `Runtime layout and runtime UI layering converge on one persisted registry contract with preview/runtime live adjustment save-back, host-based auto-load, object-level override, and family-level default fallback.` | `queue.runtime-layout-registry-and-ui-layering-convergence` | `runtime tests + preview-save tests + source-removal guards` | `Layout remains hardcoded, non-persistent, editor-only, or disconnected from runtime consumption.` |
| `ACC-FORMAT-006` | `Authoring, export, import, preview, runtime loading, and runtime execution all consume the same landed truth across the covered modules with fail-closed behavior and no compatibility layer.` | `queue.preview-runtime-loading-full-chain-consistency-and-final-acceptance` | `round-trip tests + browser/runtime proof + acceptance ledger` | `Any path still drops, reconstructs, silently downgrades, or compatibility-shims the landed truth.` |

### Acceptance Criteria

- `The covered modules share one canonical authoring content-format direction.`
- `Creator-facing duplicate capability surfaces are retired rather than preserved in parallel.`
- `Base vs extended/custom field grouping is used where the covered modules require structured extensibility.`
- `Internal ids remain formal runtime/export truth but use one numeric-combination id rule.`
- `Creators work primarily through titles/names and creator-facing semantics rather than raw internal ids.`
- `Follow-up slots and event bindings are clearly separated at the authoring-surface level.`
- `Stage configuration consumes host-owned instances by reference and stays extensible beyond the first four supported host families.`
- `Menu becomes a formal module with runtime consumption rather than an inline behavior patch.`
- `Playable/dialogue/settlement/event boundaries are unified under event-owned routing.`
- `Runtime layout persists formally, exports formally, loads automatically, and supports object-level override plus family-level default fallback.`
- `No compatibility import or dual old/new production truth survives.`
- `The version is not complete until creators can actually use the landed structure and runtime can actually consume it.`

### Version-Level Order Approval

- `This version records high-level sequence only. Blueprint may subdivide within phases, but it must not stop to reconfirm the phase order itself.`

1. `Script Editor content-format, authoring-surface, id-rule, and event-structure unification`
2. `stage-host binding plus menu resource/runtime convergence`
3. `event-owned routing plus dialogue/playable/settlement capability convergence`
4. `runtime-layout registry persistence plus runtime UI layering convergence`
5. `export/import/loading/preview/runtime full-chain consistency, fail-closed rejection, final acceptance, and version closeout`

### Final Acceptance Coverage Contract

- `Final validation must review the full Acceptance Matrix rather than only one editor happy path or one runtime happy path.`
- `Every required acceptance must be covered, blocked, or explicitly routed before version closeout.`
- `The required-final queue may own final consistency, fail-closed rejection, acceptance proof, and closeout only; it must not silently absorb unfinished earlier implementation ownership.`

### Version Closeout Contract

- `The version may close only after acceptance passes, no active queue/task remains, any same-version residue is lawfully routed, and the version plan records explicit closeout truth.`
- `Open-version status is not inferred away by queue completion or by shell-only governance sync.`
- `As long as this version remains open and active_queue is none, the next lawful action is still queue admission review from the version plan rather than reopening an older target or implementing without a queue.`
- `docs/change-log.md must be updated once implementation lands code/runtime/data/shared-interface/user-visible changes inside this version.`

### Archived Interpretation

- `Historical interpretation is deferred until version closeout.`
