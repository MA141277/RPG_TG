# Event And Building Instance Canonical Reuse Queue

## Control Block

- queue_id: `queue.event-and-building-instance-canonical-reuse`
- belongs_to_version: `target.event-follow-up-routing-settlement-and-canonical-reuse-convergence`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-24`
- governance_sync_source: `docs/blueprints/plans/2026-07-24-event-canonical-reuse-routing-and-settlement-governance-target-plan.md`
- queue_status: `done`
- queue_class: `required-first`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `closed`
- closure_basis: `acc-event-settle-001-002-covered-and-ready-for-handoff`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `queue.instance-next-event-id-and-event-routing-convergence`
- auto_continue_eligible: `true`
- next_effect: `promote-next-queue-after-sync`
- sync_status: `pending`
- sync_scope: `local-record`
- sync_summary: `Canonical-reuse closeout proof is recorded locally and the queue is ready for the mandatory repository-sync gate before next-queue admission.`
- blocked_by: []
- allowed_item_classifications:
  - `current-target-item`
- reject_item_classifications:
  - `content-pipeline-item`
  - `asset-pipeline-item`
  - `future-target-candidate`

## Human Context

### Queue Explanation

- Goal:
  - `Remove duplicate event/building/host-instance truth through stable canonical id selection and full owned reference rewrite so later nextEventId and settlement work lands on one canonical graph instead of duplicate ids.`
- Parent spec:
  - `docs/blueprints/specs/2026-07-24-event-canonical-reuse-routing-and-settlement-governance-target.md`
- Parent requirement role:
  - `This queue owns ACC-EVENT-SETTLE-001 / 002 and is the mandatory first execution queue for the version.`
- Forbidden expansions:
  - `Do not start nextEventId routing convergence inside this queue.`
  - `Do not introduce settlement resources or settlement event-type work inside this queue.`
  - `Do not reintroduce building-specific business branches in src/main.ts.`
  - `Do not preserve duplicate content merely because ids differ.`

### Parent Spec Inheritance

- inherited_required_capabilities:
  - `event/building/host-instance deduplication with stable canonical id selection`
  - `template-layer strong deduplication by default`
  - `stricter semantic separation for task`
  - `duplicate-binding review when canonical event ids change`
  - `full owned reference rewrite across events.json, event-bindings.json, building/menu/function instances, arrangement/container/action records, export/import, preview, loading, and startup`
- inherited_compatibility_paths:
  - `building behavior must remain on the arrangement / event-binding / playable-flow / shared-runtime path`
  - `normal start, JSON import, Script Editor runtime preview, and building/module entry must remain available after canonical rewrite`
  - `task may preserve separate records when semantic meaning truly differs`
- inherited_legacy_replacements:
  - `duplicate event/building/host records that differ only by id or other ignored fields`
  - `retired duplicate ids surviving in references after canonical selection`
  - `duplicate event-bindings that remain separate after their canonical target and semantics become identical`
- inherited_non_goals:
  - `Do not yet land nextEventId field unification.`
  - `Do not yet formalize settlement resources or event(type=settlement).`
  - `Do not yet claim full-chain export/import/preview/startup consistency beyond the canonical-id rewrite foundation owned here.`
- parent_spec_change_policy:
  - `If implementation proves the parent spec must change, update the parent spec first and then reconcile the queue doc before claiming any capability as removed, unsupported, or deferred.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-EVENT-SETTLE-001`
  - `ACC-EVENT-SETTLE-002`
- acceptance_not_claimed:
  - `ACC-EVENT-SETTLE-003`
  - `ACC-EVENT-SETTLE-004`
  - `ACC-EVENT-SETTLE-005`
  - `ACC-EVENT-SETTLE-006`
  - `ACC-EVENT-SETTLE-007`
  - `ACC-EVENT-SETTLE-008`
- minimum_verification:
  - `npm run lint:blueprints`
  - `npm run lint:blueprint-skill`
  - `npm run blueprint:governance:check`

### Claim Boundary

#### Can Claim

- `ACC-EVENT-SETTLE-001: event/building/host-instance duplicate identification, strong deduplication rules, canonical id selection, and duplicate-binding review boundaries are durably specified and then implemented without flow-affecting false merges.`
- `ACC-EVENT-SETTLE-002: all owned references are rewritten to canonical ids and no retired duplicate id remains as live truth in the owned surfaces.`

#### Cannot Claim

- `nextEventId convergence, event-only routing convergence, settlement resource/event-type convergence, or final migration/acceptance.`
- `Out-of-scope means not implemented by this queue; it does not mean retired or unsupported unless the parent spec is updated first.`

#### Capability Floor

- `When this queue closes, later queues must be able to assume one canonical id graph for owned event/building/host instances and owned event-binding targets.`

#### Parent Capability Coverage

- owned_closure:
  - `ACC-EVENT-SETTLE-001 / 002 foundation work for canonical instance reuse, duplicate-binding review, and full owned reference rewrite.`
- preserved_not_owned:
  - `nextEventId routing convergence remains for the next queue.`
  - `settlement resource/event-type convergence remains for a later queue.`
  - `final migration and version closeout remain version-plan authority.`
- routed_elsewhere:
  - `none`

#### Over-Narrowing Guard

- parent_capabilities_not_owned_by_this_queue:
  - `nextEventId routing convergence remains for the next queue.`
  - `settlement resource/event-type convergence remains for a later queue.`
  - `full-chain consistency and final migration acceptance remain later-version work.`
- forbidden_scope_shrinkage:
  - `Do not pass this queue by deduplicating only one template table while building/menu/function/arrangement-side duplicate references remain untouched.`
  - `Do not pass this queue by selecting canonical ids without rewriting all owned references.`
  - `Do not pass this queue by merging task records under a relaxed duplicate rule.`
  - `Do not preserve duplicate bindings merely because their original event ids differed before canonical rewrite.`
- unspecified_detail_policy:
  - `Prefer stable canonical selection, full owned rewrite, and explicit preservation reasoning over ad hoc one-off exceptions.`
- gap_routing_policy:
  - `If a required owned surface cannot yet be canonicalized here, record a blocker or same-family residue rather than silently leaving dual truth.`

### Deduplication Rules

- `Template-layer libraries use strong deduplication by default.`
- `If content is the same, it is a duplicate candidate by default even when ids differ.`
- `task remains stricter and is not auto-folded under a relaxed duplicate rule.`
- `Canonical comparison ignores id-only, sort-only, display-only, tracing-only, metadata-only, and history-only fields by default.`
- `Canonical comparison includes creator-visible content, runtime action content, result-entry structure, event-binding conditions, host semantics, settlement semantics, and any structural field that changes creator-facing or runtime meaning.`
- `Canonical id selection is stable: highest reference count, then default-template baseline, then earlier stable template id, then deterministic tie-break.`
- `Every canonical merge must produce a mapping record and every owned reference must rewrite to the canonical target id.`

### Evidence-Anchor Findings

- `Built-in pack audit confirms the active first-pass duplicate surface is concentrated in scenario-pack event / event-binding / building-arrangement families plus their import/export/loader/runtime indexes, not in an uncontrolled spread of unrelated runtime files.`
- `zhuyuanzhang currently carries 646 events, 646 event bindings, 189 building arrangements, and 632 action-menu item event references; liu-bang-pei-county-opening currently carries 1 event and 1 event binding.`
- `A strict deep comparison that removes id only did not yet expose trivial duplicate event, event-binding, or building-arrangement records in either built-in pack, so the next task must inventory semantic duplicate families rather than assuming zero-cost exact merges.`
- `No missing references were found in the first pass: every binding eventId and every arrangement action eventId resolved to a live event id, no event was left fully unreferenced inside zhuyuanzhang, and no duplicate arrangement host pair was found under cityId + buildingId.`
- `The first-pass rewrite boundary is already visible in code: scenario-pack loader parses runtime events/bindings, runtime-pack export emits canonical events.json / event-bindings.json / building-arrangements.json, runtime-pack import reconstructs editor records from those same families, active-game-content materializes by-id indexes, building-module-entry resolves arrangements by cityId + buildingId, and building-container-event-runtime consumes canonical eventId and binding lookup at runtime.`
- `The first-pass guard baseline is already visible in tests: robustness and city-building-mount-authoring cover manifest file names, arrangement/event/binding consistency, building action -> event routing, and import/export/runtime hydration expectations.`

### Current Candidate Inventory Snapshot

- `There are 633 building-container-item-action bindings but only 632 arrangement action-menu items in zhuyuanzhang, so the queue already has one concrete semantic drift sample to classify before any rewrite batch is authorized.`
- `The current unmatched sample is binding.building.house.kulan.temple.work.container-item -> event.building.house.kulan.temple.work with trigger.extra.itemId = "work", while arrangement.city.kulan.house.kulan.temple now exposes copy-scripture / sweep-courtyard / carry-water / donate / leave instead of a work item.`
- `632 arrangement action-menu items all carry eventId, and their current runtime action distribution is 442 launchFlow, 1 launchPlayable, and 189 closeBuilding routes.`
- `14 live event ids are currently referenced by bindings but not by arrangement action-menu items; the visible sample set is story/city-enter/building-enter style routing rather than action-menu ownership, so the next task must keep host-path semantics distinct instead of flattening everything into one duplicate bucket.`
- `Action-label repetition is high enough to justify semantic family inventory rather than exact-structure matching alone: 离开 appears 189 times, 交谈 63 times, 评定 / 打听消息 42 times each, and several building-family actions repeat 21 times.`
- `Arrangement host repetition also clusters by building family rather than by random one-off records: leader_residence / temple / keep / tea_house / market / grain_shop / medicine_house / inn each appear 21 times across zhuyuanzhang, which makes building-family semantic comparison a lawful next inventory slice even though exact id-only duplicates are currently zero.`
- `The 14 binding-only references already split cleanly into semantic families: 9 building-enter routes, 2 city-enter routes, 1 story-progress route, 1 indoor-screen-shown route, and 1 container-item drift sample. That means binding-only routes should not be mixed into the same duplicate bucket as action-menu event ownership.`
- `Current robustness coverage maps one binding per eventId when asserting action-menu ownership, so queue-local truth must treat extra binding-vs-item drift as a real inventory concern rather than assuming the current test surface already proves uniqueness.`

### Canonical Selection Baseline

- `Semantic normalization that abstracts city tokens plus record-local ids now exposes 30 duplicate event families covering 628 of 646 zhuyuanzhang events: 21 launchFlow building-action families and 9 closeBuilding families.`
- `The same normalization exposes 30 duplicate building-container-item-action binding families covering 628 of 633 container-item bindings, aligned 1:1 with the action-menu-owned event families. Non-container bindings remain outside automatic folding in this task.`
- `Arrangement-side duplication is narrower and more host-sensitive than event/binding duplication. Current strong-fold arrangement groups are home standard (20), temple standard (20), keep standard (20), market standard (20), grain_shop standard (20), medicine_house standard (20), tea_house standard (19), and leader_residence civil-cluster (7).`
- `The queue therefore freezes a surface-specific canonical naming rule instead of arbitrarily preserving one city-owned id as truth owner: event families canonicalize to event.building.template.house.<family>.<action> or event.building.template.home.<action>; container-item bindings canonicalize to binding.building.template.house.<family>.<action>.container-item or binding.building.template.home.<action>.container-item; arrangement groups canonicalize to arrangement.template.house.<family>.<variant> or arrangement.template.home.standard.`
- `When reference counts tie across city-owned copies, the deterministic tie-break is a new family-scope template id rather than selecting one surviving city id such as kulan or yingtian as the permanent canonical owner.`
- `Task3 rewrite is only lawful if eventId rewrite ships together with paired owner-token rewrite: event.actions[].ownerContext.ownerId, event.actions[].flowId / playableId, binding.owner.id, binding.trigger.extra.arrangementId / containerId / itemId, and arrangement action-menu eventId must move as one canonical batch.`

### Preservation Exceptions

- `building-enter / city-enter / story-progress / indoor-screen-shown bindings are not auto-fold candidates in task2 because their host-path semantics remain distinct and they are not the first-pass action-menu-owned duplicate surface.`
- `binding.building.house.kulan.temple.work.container-item and the paired event.building.house.kulan.temple.work remain explicit preservation exceptions until task3 reconciles the Kulan temple action menu against the 20-city standard temple family.`
- `Kulan arrangement variants remain preservation exceptions for temple / keep / market / grain_shop / medicine_house, and Kulan also keeps unique arrangement truth at leader_residence / tea_house / inn / home_001 because mounted-NPC or host-layout truth still diverges from the standard reusable subgroup even after home_001 rest/leave routing was folded into the canonical home graph.`
- `Suzhou tea_house remains its own preservation exception beside the 19-city standard tea_house arrangement subgroup.`
- `leader_residence arrangement truth is not a 21-city bulk merge: only the 7-city civil-cluster shape is a current strong-fold candidate, while the remaining 14 city records preserve distinct host content until later explicit review.`
- `inn arrangements are all unique under current normalization, so this queue authorizes event/binding canonical reuse there but not arrangement canonical folding.`
- `task-owned records remain outside any relaxed duplicate shortcut; this queue found no basis to lower the stricter task semantic bar.`

### Rewrite-And-Guard Baseline

- `Version-local execution override now forbids pause-for-confirmation while this queue remains active. If task3 hits a conflict or blocker, it must first record the blocker/assumption in queue/version truth and then continue to the next lawful local action instead of stopping to ask.`
- `Version-local unattended execution also forbids final-answer style closeout while task.event-and-building-instance-canonical-reuse.reference-rewrite-and-guard-baseline still has lawful local work. Governance sync, preflight completion, artifact generation, and lint/check success must roll directly into the next bounded local action rather than behaving like queue pause points.`
- `main.ts currently forwards arrangementId / containerId / itemId / optional eventId directly from building action buttons into triggerBuildingContainerItemAction, so canonical rewrite must preserve the clicked action payload contract instead of assuming pack-file-only id replacement is sufficient.`
- `building-container-event-runtime currently treats clicked eventId as an optional canonical narrowing filter before matching bindings by owner + trigger payload. Task3 must preserve that eventId-as-truth behavior while also preventing duplicate binding collisions after canonical folding.`
- `building-module-entry still selects the live arrangement by cityId + buildingId, so arrangement canonicalization cannot replace runtime host selection with one global arrangement-id lookup. The rewrite batch must preserve per-city host resolution while moving shared arrangement content to canonical template truth.`
- `active-game-content and scenario-pack-loader materialize one by-id index per family with no alias table or retired-id fallback. Queue closeout therefore requires source data plus import/export/loading paths to emit only canonical ids by the time those indexes materialize.`
- `runtime-pack-export extractRuntimeEvents / extractRuntimeEventBindings and runtime-pack-import mapImportedEvents / mapImportedEventBindings / readBuildingArrangementsFamily currently serialize and rehydrate raw event ids, ownerContext.ownerId, flowId / playableId, binding owner ids, and binding trigger extra payloads directly. Task3 must update these seams in one batch so export/import/preview/startup stay aligned on the same canonical references.`
- `The current robustness pack audit builds bindingsByEventId = new Map(eventBindings.map(binding => [binding.eventId, binding])), which masks multiple bindings sharing one canonical event id. Task3 therefore needs stronger guard coverage for duplicate-binding detection and for the existing Kulan temple work binding-vs-item drift sample.`
- `Task3 Slice 1 now has a machine-readable canonical map at generated/blueprint/event-canonical-reuse-first-batch-map.json, not only the markdown report. The generated artifact freezes 30 canonical event groups / 627 source event ids, 30 canonical binding groups / 627 source binding ids, and 8 canonical arrangement groups / 146 source arrangement ids.`
- `Task3 now also has a non-destructive rewrite audit at generated/blueprint/event-canonical-reuse-rewrite-audit.json. The audit shows 30 simulated canonical event-id collision groups and classifies all 30 as safe multi-binding multiplex groups distinguished by owner/payload; duplicatePayloadConflictCount is currently 0.`
- `Task3 token preflight is now materialized at generated/blueprint/event-canonical-reuse-token-preflight.json. It proves that the first mapped batch currently splits cleanly into 21 launchFlow families and 9 closeBuilding-only families with 0 mixed-action groups, so canonical flowId / ownerId / buildingId / containerId rewrite can be staged from one deterministic template token rule instead of one-off family exceptions.`
- `Runtime owner-token coupling is now confirmed as a real task3 consumer constraint, not a hypothetical concern: event-binding-runtime matches binding.owner.id by exact equality against triggerContext.owner.id, building-container-event-runtime supplies triggerContext.owner.id from state.world.currentHouseId, story callbacks and playable launch plumbing also pass ownerContext.ownerId through as the current dialogue/event/house token, and the current robustness audit asserts launchFlow / launchPlayable ownerContext.ownerId === arrangement.buildingId. Canonical owner-token rewrite therefore requires coupled consumer/runtime/test updates; it is not lawful as a pack-only preview.`
- `Task3 coupled rewrite impact is now frozen at generated/blueprint/event-canonical-reuse-coupled-rewrite-impact.json. The current lawful rewrite slice spans 9 impact areas / 15 files: 3 data-source areas, 5 consumer areas, and 1 guard area.`
- `The impact matrix concretizes the next rewrite seam instead of leaving it abstract: runtime-pack-export currently exposes 3 extractRuntimeEvents hits, 3 extractRuntimeEventBindings hits, 2 ownerContext.ownerId hits, 3 binding.owner.id hits, and 20 flowId hits; active-game-content still has 5 eventDefinitionsById hits, 5 eventBindingsById hits, 2 buildingArrangementById hits, and 8 flowPlayablesById hits; robustness.test.cjs still contains the one-binding-per-eventId masking plus owner/building/flow equality assertions that task3 must replace during the coupled rewrite batch.`
- `Task3 source-side rewrite preview is now frozen at generated/blueprint/event-canonical-reuse-source-rewrite-preview.json. The preview proves the first coupled write batch is narrower than "all mapped bindings at once": only 2 binding groups (home.rest / home.leave) currently have full arrangement payload alignment, 23 groups are partial because arrangement exceptions still break full trigger.extra templating, and 5 inn groups are unaligned at the arrangement layer.`
- `Queue-local execution truth therefore tightens again: all 30 mapped event groups remain lawful canonical id rewrite candidates, but binding trigger.extra.arrangementId / containerId cannot be bulk-templated across the whole first batch without coupled runtime payload handling for the partial and unaligned families.`
- `Task3 now also freezes the first real implementation seam at generated/blueprint/event-canonical-reuse-home-implementation-slice.json. The active task no longer needs to rediscover where code-writing should begin: the home family is the first lawful write slice because it is the only family with full arrangement payload alignment and because it spans both launchFlow and closeBuilding action shapes.`
- `This home slice explicitly carries coupled source+consumer+guard ownership: home event ids, binding ids, arrangement template truth, currentHouseId / ownerId runtime handling, import/export/loading indexes, and robustness assertions must move together.`
- `Task3 guard hardening has now started in live code rather than only preflight artifacts: the zhuyuanzhang robustness audit no longer collapses bindings to one Map entry per eventId. It now groups building-container-item-action bindings by eventId, rejects duplicate exact payload tuples, and requires exactly one owner/payload-exact binding match per action-menu item.`
- `Task3 flow preflight is now frozen at generated/blueprint/event-canonical-reuse-flow-preflight.json. The queue has now audited the launchFlow dependency chain for the first implementation slice instead of assuming canonical event rewrite can invent matching flow truth later.`
- `generated/blueprint/event-canonical-reuse-home-applied-rewrite-summary.json, generated/blueprint/event-canonical-reuse-leader_residence-applied-rewrite-summary.json, generated/blueprint/event-canonical-reuse-temple-applied-rewrite-summary.json, generated/blueprint/event-canonical-reuse-keep-applied-rewrite-summary.json, generated/blueprint/event-canonical-reuse-tea_house-applied-rewrite-summary.json, generated/blueprint/event-canonical-reuse-market-applied-rewrite-summary.json, generated/blueprint/event-canonical-reuse-grain_shop-applied-rewrite-summary.json, generated/blueprint/event-canonical-reuse-medicine_house-applied-rewrite-summary.json, and generated/blueprint/event-canonical-reuse-inn-applied-rewrite-summary.json now carry the live applied-state summaries for the completed home, leader-residence, temple, keep, tea-house, market, grain-shop, medicine-house, and inn slices, while generated/blueprint/event-canonical-reuse-source-rewrite-preview.json, event-canonical-reuse-home-implementation-slice.json, and event-canonical-reuse-flow-preflight.json remain historical pre-home evidence rather than current next-slice selectors.`
- `generated/blueprint/event-canonical-reuse-next-slice-candidates.json is now the live post-temple selector state. It records that no remaining non-home family candidates survive in the current selector, so task3 must leave family-by-family source rewrite mode and advance into consumer residue alignment plus queue-closeout proof.`
- `The first-write home slice is now backed by event/binding/flow alignment together: home.rest contributes 20 source flow definitions that normalize to one title family, one initial-node shape, and one complete-node detail shape, while home.leave remains the paired closeBuilding half with no flow dependency.`
- `The same audit isolates the known out-of-batch surfaces that task3 must not silently flatten into the first rewrite batch: 18 unmapped events, 5 unmapped container-item bindings, 5 unmapped arrangement action-menu event refs, and 21 inn arrangements left outside arrangement strong-folding.`
- `The preserved Kulan temple work exception still reproduces exactly as recorded: the preserved binding and event remain live, but arrangement.city.kulan.house.kulan.temple no longer contains itemId=work. Any later rewrite that changes this state must update the queue-local exception truth together with the source diff.`

### Task3 Execution Order Baseline

- `Slice 1: finalize the canonical mapping artifact for the first rewrite batch, including canonical event ids, canonical binding ids, canonical arrangement ids, and the explicit preservation-exception list that task3 must skip or isolate.`
- `Slice 2: rewrite owned pack data in one coherent batch across arrangement action-menu eventId refs, event ids plus launchFlow / launchPlayable owner tokens, and event-binding ids plus owner/trigger payload refs.`
- `Slice 3: update import/export/loading/materialization consumers so runtime-pack export, runtime-pack import, scenario-pack loading, active-game-content indexes, building-module-entry, and building-container runtime all consume only the canonicalized references with no retired-id fallback.`
- `Slice 4: strengthen guards around canonical truth by replacing the one-binding-per-eventId robustness assumption, adding explicit duplicate-binding collision checks, and asserting that preserved exceptions such as Kulan temple work fail loudly if they drift from the recorded queue-local exception list.`

### Implementation Anchors

- Must inspect:
  - `src/content/scenario-packs/**/events.json`
  - `src/content/scenario-packs/**/event-bindings.json`
  - `src/application/script-editor/**`
  - `src/application/building/**`
  - `src/application/content/**`
  - `src/domain/**`
  - `tests/**`
  - `docs/blueprints/specs/2026-07-24-event-routing-settlement-version-scope-iteration-draft.md`
  - `docs/blueprints/reports/2026-07-24-event-canonical-reuse-first-batch-map.md`
- Must modify:
  - `docs/blueprints/queues/event-and-building-instance-canonical-reuse-queue.md`
  - `docs/blueprints/plans/2026-07-24-event-canonical-reuse-routing-and-settlement-governance-target-plan.md`
  - `docs/blueprints/reports/2026-07-24-event-canonical-reuse-first-batch-map.md`
  - `owned code/data/test surfaces once implementation begins under this queue`
- Must preserve:
  - `No building-specific business branches in src/main.ts.`
  - `No compatibility import or duplicate-id fallback as production truth.`
  - `No queue-local overreach into nextEventId or settlement convergence.`

#### Replacement Proof

- previous_owner_or_path:
  - `duplicate event/building/host instances and duplicate ids surviving as parallel truth`
- new_owner_or_path:
  - `stable canonical ids plus full owned reference rewrite`
- behavior_preservation_expectation:
  - `Creator-facing and runtime meaning stays intact, but duplicate-id truth exits the owned surfaces.`
- old_truth_owner_exit_proof:
  - `Queue closeout must show retired duplicate ids no longer survive in owned references or duplicate bindings.`
- verification_evidence:
  - `canonical map, source audit, rewrite inventory, and focused guard coverage`

#### User Path Coverage Matrix

- semantic_dimensions:
  - `canonical event identity`
  - `canonical building/host identity`
  - `binding-target identity`
  - `reference rewrite continuity`
  - `entrypoint continuity across import/preview/startup`
- primary_paths:
  - `Owned event/building/host instances resolve through one canonical id and all owned references point to that canonical target.`
- alternate_paths:
  - `JSON runtime pack import, Script Editor runtime preview, and normal startup continue resolving the canonicalized references without duplicate-id fallback.`
- leave_return_or_followup_paths:
  - `Building-side authored paths continue through arrangement / event-binding / playable-flow / shared-runtime ownership after canonical id rewrite.`
- empty_or_fail_closed_paths:
  - `Missing canonical targets or invalid retired-id references must fail closed through explicit diagnostics instead of silent reconstruction.`
- rejection_or_error_paths:
  - `False-merge candidates, task semantic conflicts, and conflicting binding semantics must be preserved or rejected explicitly rather than silently folded.`
- forbidden_regressions:
  - `No owned reference may continue pointing at a retired duplicate id once the queue claims ACC-EVENT-SETTLE-002.`

#### Functional Loss Budget

- budget: `zero`
- loss_accounting_rule:
  - `Any lost reference continuity, task semantic distinction, binding reachability, or building-entry continuity caused by canonical rewrite must be repaired or routed explicitly; silent compatibility loss is not allowed.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-24-event-canonical-reuse-routing-and-settlement-governance-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-24-event-canonical-reuse-routing-and-settlement-governance-target-plan.md`

### Queue Snapshot

- queue_goal: `Establish canonical reuse for event/building/host instances and rewrite all owned references before later routing and settlement work.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `Completed. Task3 landed the canonical-owner consumer seam, nine bounded family rewrites plus the final home_001 home-family residue absorption, a machine-readable closeout proof at generated/blueprint/event-canonical-reuse-closeout-proof.json, full robustness coverage, and Blueprint governance verification. The queue is closed locally and now waits only for the repository-sync gate before next-queue admission.`
- task_briefs:
  - `task.event-and-building-instance-canonical-reuse.evidence-anchor-reconcile: lock queue evidence, deduplication rules, owned rewrite surface, and implementation anchors.`
  - `task.event-and-building-instance-canonical-reuse.canonical-candidate-inventory-and-selection-rules: inventory duplicate candidates, select stable canonical ids, and record preservation exceptions.`
  - `task.event-and-building-instance-canonical-reuse.reference-rewrite-and-guard-baseline: execute or stage full owned reference rewrite and verify no retired duplicate ids remain in owned surfaces.`

### Completion Completeness Review

- review_status: `covered`
- can_claim_coverage:
  - `ACC-EVENT-SETTLE-001 and ACC-EVENT-SETTLE-002 are now claimable for this queue. Canonical duplicate families, stable canonical ids, duplicate-binding preservation rules, and full owned reference rewrite are all proven on the landed canonical graph.`
- parent_spec_preservation:
  - `Preserved so far: the queue stays on deduplication-first scope, confirms no trivial id-only duplicate batch can be assumed safely, and does not overreach into nextEventId or settlement work.`
- capability_floor_verification:
  - `One canonical id graph is now proven for all completed action-menu families. Family selector exhaustion, the final home_001 residue absorption, generated/blueprint/event-canonical-reuse-closeout-proof.json, full robustness coverage, and Blueprint governance checks together establish the queue's required capability floor.`
- out_of_scope_routing:
  - `No out-of-scope routing is currently required.`
- verification_sufficiency:
  - `Sufficient for queue closeout. Canonical source truth, import/export/runtime-path continuity, preserved Kulan exceptions, full robustness regression coverage, and Blueprint governance checks all pass for the bounded queue surface.`
- user_path_matrix_verification:
  - `Covered for the bounded queue surface. Building action continuity is verified for home, home_001, leader_residence, temple, keep, tea_house, market, grain_shop, medicine_house, and inn canonicalized routes, while full import/export/runtime/startup continuity is covered by the green robustness suite and the explicit closeout proof.`
- functional_loss_audit:
  - `Passed for the bounded queue surface. All landed canonicalized routes preserve live trigger payload anchors and focused route guards with no recorded capability loss, while preserved building-enter and Kulan temple exception paths remain explicit rather than silently degraded.`
- replacement_proof_summary:
  - `Baseline established: replacement proof must cover scenario-pack data, import/export, active-game-content indexes, and building action runtime consumption rather than one helper seam.`
- placeholder_or_legacy_fallback_audit:
  - `Passed for this queue. Active-game-content, export/import, and runtime consumption now materialize the canonical graph directly with no retired-id fallback added for canonical-reuse completion.`
- gap_fill_decision:
  - `none`
- gap_fill_scope:
  - `none`
- remaining_gaps:
  - `None inside the bounded canonical-reuse queue surface. The next lawful work is next-queue admission after the repository-sync gate records its result.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.event-and-building-instance-canonical-reuse.evidence-anchor-reconcile` | `done` | `Lock evidence, dedup rules, rewrite surface, and implementation anchors before code changes.` | `none` | `Completed after built-in pack audit, rewrite-anchor inspection, and queue-local truth sync confirmed the owned duplicate surfaces, no-missing-ref baseline, and exact code/test rewrite anchors.` |
| `task.event-and-building-instance-canonical-reuse.canonical-candidate-inventory-and-selection-rules` | `done` | `Inventory duplicate candidates and select canonical ids with explicit preservation reasoning.` | `task.event-and-building-instance-canonical-reuse.evidence-anchor-reconcile` | `Completed after semantic normalization exposed 30 duplicate event families, 30 action-menu binding families, eight arrangement strong-fold subgroups, template-scope canonical naming rules, and the preservation exceptions that task3 must not flatten.` |
| `task.event-and-building-instance-canonical-reuse.reference-rewrite-and-guard-baseline` | `done` | `Rewrite owned references to canonical ids and confirm no retired duplicate ids remain in owned surfaces.` | `task.event-and-building-instance-canonical-reuse.canonical-candidate-inventory-and-selection-rules` | `Completed after the canonical-owner consumer seam, nine bounded family rewrites, the final home_001 residue absorption, generated closeout proof, full robustness coverage, and Blueprint governance verification closed ACC-EVENT-SETTLE-002 locally.` |

### Task Definitions

#### `task.event-and-building-instance-canonical-reuse.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.event-and-building-instance-canonical-reuse.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/specs/2026-07-24-event-canonical-reuse-routing-and-settlement-governance-target.md`
  - `docs/blueprints/specs/2026-07-24-event-routing-settlement-version-scope-iteration-draft.md`
  - `docs/blueprints/plans/2026-07-24-event-canonical-reuse-routing-and-settlement-governance-target-plan.md`
  - `src/content/scenario-packs/**/events.json`
  - `src/content/scenario-packs/**/event-bindings.json`
  - `src/application/script-editor/**`
  - `src/application/building/**`
  - `tests/**`
- must_inspect:
  - `canonical comparison rules`
  - `task-specific stricter dedup boundary`
  - `owned rewrite surfaces`
  - `event-binding duplicate boundary`
- must_not_change:
  - `Do not claim canonical reuse before duplicate surfaces and rewrite obligations are locked.`
  - `Do not widen into nextEventId or settlement implementation.`
- done_when:
  - `Evidence Lock is locked.`
  - `The queue records the owned duplicate surfaces, canonical selection rule, task exception, binding boundary, and rewrite inventory accurately.`
  - `Minimum verification remains accurate for the current queue stage.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run lint:blueprint-skill`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Record a real blocker in queue truth instead of silently moving to implementation.`
- promote_next_if_done: `task.event-and-building-instance-canonical-reuse.canonical-candidate-inventory-and-selection-rules`
- stop_if:
  - `implementation-anchor-conflict`
  - `parent-spec-change-required`

##### Human Context

- task_brief:
  - `Lock the deduplication baseline and rewrite obligations before code changes.`
- task_outcome_summary:
  - `Completed. Built-in pack audit locked the owned duplicate surfaces, confirmed that strict id-only deep comparison does not yet expose trivial merge groups, confirmed no missing event references or duplicate arrangement host pairs in the current packs, and identified the code/test rewrite anchors in scenario-pack loader, runtime-pack export/import, active-game-content indexing, building entry, and building container runtime.`

#### `task.event-and-building-instance-canonical-reuse.canonical-candidate-inventory-and-selection-rules`

##### Control Block

- task_id: `task.event-and-building-instance-canonical-reuse.canonical-candidate-inventory-and-selection-rules`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/content/scenario-packs/**/events.json`
  - `src/content/scenario-packs/**/event-bindings.json`
  - `src/application/script-editor/**`
  - `src/application/building/**`
  - `tests/**`
- must_inspect:
  - `duplicate event/building/host-instance candidates`
  - `reference counts and stable canonical selection`
  - `duplicate-binding candidates after canonical event normalization`
- must_modify:
  - `canonical mapping records`
  - `preservation-exception records`
  - `queue-local inventory truth`
- must_replace:
  - `ad hoc duplicate handling or id-only preservation inside the owned surfaces`
- must_preserve:
  - `task stricter semantic separation`
  - `host semantic differences`
  - `flow-affecting differences`
- must_not_change:
  - `Do not rewrite references before canonical selection rules and exception reasons are recorded.`
- done_when:
  - `Stable canonical ids are selected for owned duplicate groups.`
  - `Preservation exceptions are explicitly recorded.`
  - `Duplicate-binding review is aligned to canonical target ids.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Route a blocker or same-family residue rather than leaving duplicate truth implicit.`
- promote_next_if_done: `task.event-and-building-instance-canonical-reuse.reference-rewrite-and-guard-baseline`
- stop_if:
  - `real-blocker`
  - `parent-spec-change-required`

##### Human Context

- task_brief:
  - `Select stable canonical ids and record exceptions before rewriting references.`
- task_outcome_summary:
  - `Completed. Semantic normalization that abstracts city tokens plus record-local ids exposed 30 duplicate event families, 30 duplicate action-menu binding families, and eight arrangement strong-fold subgroups instead of one flat duplicate bucket. The queue froze template-scope canonical naming for event / binding / arrangement families, recorded that Kulan temple work and several arrangement variants remain preservation exceptions, and established that task3 must rewrite ownerContext / flowId / binding owner+trigger / arrangement eventId surfaces together rather than only swapping event ids.`

#### `task.event-and-building-instance-canonical-reuse.reference-rewrite-and-guard-baseline`

##### Control Block

- task_id: `task.event-and-building-instance-canonical-reuse.reference-rewrite-and-guard-baseline`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/content/scenario-packs/**/events.json`
  - `src/content/scenario-packs/**/event-bindings.json`
  - `src/application/script-editor/**`
  - `src/application/building/**`
  - `src/application/content/**`
  - `tests/**`
  - `docs/change-log.md`
- must_inspect:
  - `all owned references to canonicalized ids`
  - `import/export/loading/preview/startup reference consumers in the owned surfaces`
  - `guard coverage that detects retired duplicate ids`
- must_modify:
  - `owned references`
  - `tests and source guards`
  - `docs/change-log.md once implementation lands`
- must_replace:
  - `retired duplicate ids surviving in owned references`
- must_preserve:
  - `one canonical id graph across owned surfaces`
  - `building/runtime path ownership outside src/main.ts hardcoding`
- must_not_change:
  - `Do not claim queue closeout while retired duplicate ids still survive in owned references.`
- done_when:
  - `Owned references are rewritten to canonical ids.`
  - `No retired duplicate id remains in owned reference truth.`
  - `Queue-local verification is sufficient for ACC-EVENT-SETTLE-001 / 002.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run lint:blueprint-skill`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Record the blocker truthfully in the queue doc and version plan.`
- promote_next_if_done: `none`
- stop_if:
  - `real-blocker`
  - `capability-downgrade-risk`

##### Human Context

- task_brief:
  - `Rewrite owned references to canonical ids and establish the guard baseline for queue closeout.`
- task_outcome_summary:
  - `Completed. Task3 landed the canonical-owner runtime seam, applied nine bounded family source rewrites plus the final home_001 home-family residue absorption, preserved the explicit Kulan temple exception set, and proved the resulting graph through generated/blueprint/event-canonical-reuse-closeout-proof.json, a green full robustness run, and passing Blueprint governance checks. Owned references now resolve through canonical event/flow/owner truth with no retired duplicate ids left in the bounded queue surface.`

### Progress Log

- `2026-07-24`: `Queue created and admitted as the first active queue under target.event-follow-up-routing-settlement-and-canonical-reuse-convergence.`
- `2026-07-24`: `Active-task truth starts at task.event-and-building-instance-canonical-reuse.evidence-anchor-reconcile so Blueprint resumes from deduplication baseline locking rather than from version-shell review.`
- `2026-07-24`: `Evidence-anchor reconcile completed after source audit locked the owned duplicate surfaces and rewrite anchors. The first pass confirmed 646 events / 646 bindings / 189 arrangements / 632 arrangement action refs in zhuyuanzhang, no missing event references, no duplicate arrangement cityId+buildingId host pairs, and no trivial exact duplicate groups under id-only normalization.`
- `2026-07-24`: `Queue execution advanced immediately to task.event-and-building-instance-canonical-reuse.canonical-candidate-inventory-and-selection-rules. The live task now focuses on semantic duplicate-family inventory and canonical-selection exceptions rather than assuming zero-cost exact merges.`
- `2026-07-24`: `Canonical-candidate inventory found the first concrete semantic drift sample before any rewrite work: zhuyuanzhang carries 633 building-container-item-action bindings but only 632 arrangement action-menu items, with binding.building.house.kulan.temple.work.container-item still targeting itemId=work after the Huangjue Temple action menu moved to copy-scripture / sweep-courtyard / carry-water style item ids.`
- `2026-07-24`: `Candidate inventory also established the first semantic clustering rule for this queue: eight major building families repeat 21 times each across zhuyuanzhang, while the 14 binding-only routes split into building-enter / city-enter / story-progress / indoor-screen-shown / one container-item drift family. The queue therefore now treats host-family and trigger-family partitioning as mandatory comparison context for later canonical selection.`
- `2026-07-24`: `Canonical-candidate inventory is now complete for the first rewrite batch. Semantic normalization exposed 30 duplicate event families covering 628 events, 30 duplicate action-menu binding families covering 628 container-item bindings, and arrangement strong-fold subgroups at home(20), temple(20), keep(20), market(20), grain_shop(20), medicine_house(20), tea_house(19), and leader_residence(7).`
- `2026-07-24`: `The queue froze template-scope canonical naming instead of preserving one city-owned id by fiat: event.building.template.*, binding.building.template.*, and arrangement.template.* become the canonical family targets for rewrite batches, while Kulan temple work, Kulan/Suzhou arrangement variants, the non-standard leader_residence cities, and all inn arrangements remain explicit preservation exceptions.`
- `2026-07-24`: `Active execution advanced to task.event-and-building-instance-canonical-reuse.reference-rewrite-and-guard-baseline. The live rewrite baseline now requires coordinated rewrite of arrangement action eventId refs, event ownerContext+flow ids, binding owner+trigger refs, import/export/loading indexes, and guard coverage rather than a narrow eventId-only replacement.`
- `2026-07-24`: `Task3 source audit tightened the rewrite anchors further: main.ts still forwards the building action payload quadruple directly, building-container-event-runtime still narrows by clicked eventId before binding runtime activation, building-module-entry still resolves arrangements by cityId + buildingId, active-game-content still materializes one by-id index per family with no alias table, and the current robustness pack audit still masks multi-binding collisions by keying one binding per eventId.`
- `2026-07-24`: `Task3 Slice 1 is now materialized as docs/blueprints/reports/2026-07-24-event-canonical-reuse-first-batch-map.md. The report freezes the first rewrite batch as 30 canonical event ids, 30 canonical binding ids, eight canonical arrangement subgroup ids, and the explicit exception list that rewrite code must skip or isolate.`
- `2026-07-24`: `Task3 Slice 1 now also has a generated machine-readable artifact at generated/blueprint/event-canonical-reuse-first-batch-map.json. The artifact freezes the same first rewrite batch as 30 canonical event groups / 627 source event ids, 30 canonical binding groups / 627 source binding ids, and 8 canonical arrangement groups / 146 source arrangement ids.`
- `2026-07-24`: `Task3 rewrite preflight now includes generated/blueprint/event-canonical-reuse-rewrite-audit.json. The simulated audit shows 30 canonical event-id collision groups and classifies all 30 as safe owner/payload-distinguished multiplex groups with 0 duplicate-payload conflicts, while also isolating the out-of-batch unmapped surfaces and re-confirming the preserved Kulan temple work drift sample.`
- `2026-07-24`: `Task3 owner/flow token preflight now includes generated/blueprint/event-canonical-reuse-token-preflight.json. The derived token audit shows 21 launchFlow-capable canonical event families, 9 closeBuilding-only families, and 0 mixed-action families, which means canonical flowId / ownerId / buildingId / containerId rewrite can proceed from one deterministic template token scheme for the mapped batch.`
- `2026-07-24`: `Task3 then confirmed the exact runtime owner-token coupling that constrains the later rewrite batch: event-binding-runtime matches binding.owner.id by exact equality, building-container-event-runtime feeds that equality from state.world.currentHouseId, story/playable ownerContext paths reuse the same current dialogue/event/house token, and current robustness coverage still asserts ownerContext.ownerId === arrangement.buildingId. Any canonical owner-token rewrite must therefore land together with consumer/runtime/test changes rather than as source-pack-only preview.`
- `2026-07-24`: `The operator then imposed a stricter version-local execution rule: do not stop to ask for confirmation while queue.event-and-building-instance-canonical-reuse remains active. Task3 must record blockers and assumptions in governed docs and continue to the next lawful local action by default.`
- `2026-07-24`: `Task3 coupled rewrite impact is now materialized at generated/blueprint/event-canonical-reuse-coupled-rewrite-impact.json. The active rewrite slice is no longer described only as a broad source+consumer+test warning; it is now frozen as 9 impact areas across 15 concrete files spanning pack data, export/import, active content indexing, building runtime, story/playable owner paths, and robustness guards.`
- `2026-07-24`: `Task3 source-side rewrite preview is now materialized at generated/blueprint/event-canonical-reuse-source-rewrite-preview.json. The preview shows that all 30 mapped event groups remain lawful rewrite targets, but only 2 binding groups have full arrangement payload alignment, while 23 are partial and 5 inn groups are arrangement-unaligned. That means the first real rewrite slice can bulk-canonicalize event ids earlier than it can bulk-template every binding trigger.extra payload.`
- `2026-07-24`: `Task3 then froze the first real implementation seam at generated/blueprint/event-canonical-reuse-home-implementation-slice.json. The queue no longer treats "start with home" as an informal preference; it is now the explicit first-write slice because home.rest and home.leave are the only fully aligned binding groups and they cover both launchFlow and closeBuilding behavior under the active queue boundary.`
- `2026-07-24`: `Task3 guard hardening has now moved from queue-local planning into repository code. tests/robustness.test.cjs no longer masks multi-binding collisions by reducing eventBindings to one binding per eventId; it now groups container-item bindings per eventId, rejects duplicate exact payload tuples, and asserts exactly one exact owner/payload match for each action-menu item.`
- `2026-07-24`: `Task3 flow preflight is now materialized at generated/blueprint/event-canonical-reuse-flow-preflight.json. The active queue has confirmed that the home launchFlow dependency chain is structurally reusable too: 20 home.rest flow definitions already collapse to one normalized shape, so the first implementation slice no longer depends on an un-audited future flow rewrite decision.`
- `2026-07-24`: `Task3 has now landed the first live canonical-owner consumer seam for the home slice. src/core/runtime/event-binding-runtime.ts now accepts canonical home.template binding owners against live city home owner ids through a dedicated canonicalization helper, while new robustness guards prove that template-to-live home matching works and city-specific home owner ids still do not widen into each other.`
- `2026-07-24`: `Task3 has also upgraded the pack-level zhuyuanzhang action-menu audit to canonical-equivalent owner semantics. The queue no longer relies on hard-coded ownerContext.ownerId === arrangement.buildingId or binding.owner.id === arrangement.buildingId checks on that path; the audit now accepts lawful canonical template owner ids while still rejecting non-equivalent owner mismatches.`
- `2026-07-24`: `Task3 now also freezes the shared flow settlement handoff boundary for the home slice. New robustness coverage proves that a flow launched with ownerContext.ownerId = home.template keeps that canonical owner id through shared playable settlement while the live world.currentHouseId remains the city-specific home token, so the remaining home-slice risk narrows to source rewrite plus export/import consumers instead of an unproven handoff branch.`
- `2026-07-24`: `Task3 then re-audited the owned export/import consumer boundary for the same home slice. runtime-pack-export already passes launchFlow / launchPlayable ownerContext.ownerId through as a raw canonical string after only ownerKind / returnPolicy validation, runtime-pack-import rehydrates playable integration ownerDefaults.ownerId with no alias layer, and imported flowPlayables explicitly reject retired routing fields instead of reconstructing them. Combined with active-game-content's by-id indexes, that means the upcoming home rewrite must update exported event action owner ids and canonical flow ids directly rather than relying on import/export compatibility fallback.`
- `2026-07-24`: `Task3 then flattened the first direct source-rewrite batch down to concrete home-slice ids. The current mapped write slice is exactly 20 home.<city>.rest launchFlow events, 20 paired home.<city>.leave closeBuilding events, 20 flow.building.home.<city>.rest definitions, and 40 matching binding.building.home.<city>.(rest|leave).container-item records. In that batch, event action ownerId, flowId, binding owner.id, and binding eventId are still city-scoped raw tokens, while arrangementId / containerId / itemId remain live city payload anchors and no home_001 source record participates.`
- `2026-07-24`: `Task3 has now executed that first bounded home source rewrite batch in production pack data. zhuyuanzhang building-arrangements now point home rest/leave items at event.building.template.home.rest / leave, the 40 matching home container-item bindings now target canonical home event ids with owner.id = home.template while preserving live arrangementId / containerId / itemId payload anchors, the 20 city-scoped home rest flows have collapsed to flow.building.template.home.rest, and the 40 city-scoped home rest/leave events have collapsed to two canonical template-home event records with canonical ownerContext.ownerId / flowId truth.`
- `2026-07-24`: `Post-rewrite residue scan confirms the home family no longer leaves direct city-scoped home event or flow ids in production source tables. Same-family direct references now remain only inside generated/blueprint historical preflight artifacts and one synthetic runtime test fixture that intentionally models a pre-canonical city-scoped sample, so the next lawful local action is artifact refresh or supersession plus the next non-home family rewrite decision.`
- `2026-07-24`: `Task3 has now refreshed that post-home selector state. generated/blueprint/event-canonical-reuse-next-slice-candidates.json explicitly demotes the pre-home source-preview / home-slice / flow-preflight artifacts to historical-only selector evidence and chooses keep as the next bounded non-home source-rewrite family, with grain_shop and medicine_house tied behind it on the deterministic family-order tie-break.`
- `2026-07-24`: `Task3 then executed the keep-family bounded source rewrite batch in production pack data. zhuyuanzhang keep arrangements now point review/work/leave items at canonical template-house keep event ids, the 63 matching keep container-item bindings now target canonical keep event ids with owner.id = house.template.keep while preserving live arrangementId / containerId / itemId payload anchors, the 42 city-scoped keep review/work flows have collapsed to canonical template-house keep flow ids, and the 63 city-scoped keep review/work/leave events have collapsed to three canonical template-house keep event records with canonical ownerContext.ownerId / flowId truth.`
- `2026-07-24`: `Task3 has now refreshed the selector again after keep landed. generated/blueprint/event-canonical-reuse-keep-applied-rewrite-summary.json records the applied keep batch, and generated/blueprint/event-canonical-reuse-next-slice-candidates.json now records home+keep as completed and promotes grain_shop as the next bounded non-home source-rewrite family ahead of medicine_house.`
- `2026-07-24`: `Task3 then executed the grain-shop bounded source rewrite batch in production pack data. zhuyuanzhang grain-shop arrangements now point trade/accounting/leave items at canonical template-house grain_shop event ids, the 63 matching grain-shop container-item bindings now target canonical grain-shop event ids with owner.id = house.template.grain_shop while preserving live arrangementId / containerId / itemId payload anchors, the 42 city-scoped grain-shop trade/accounting flows have collapsed to canonical template-house grain_shop flow ids, and the 63 city-scoped grain-shop trade/accounting/leave events have collapsed to three canonical template-house grain_shop event records with canonical ownerContext.ownerId / flowId truth.`
- `2026-07-24`: `Task3 has now refreshed the selector once more after grain_shop landed. generated/blueprint/event-canonical-reuse-grain_shop-applied-rewrite-summary.json records the applied grain-shop batch, generated/blueprint/event-canonical-reuse-next-slice-candidates.json now records home+keep+grain_shop as completed, and the next bounded non-home source-rewrite family is medicine_house.`
- `2026-07-24`: `The operator then tightened unattended execution further: while this queue remains active, final-answer style progress summaries are non-compliant. Task3 must keep progress in commentary only, treat artifact generation / governance sync / verification as non-terminal checkpoints, and roll forward to the next lawful local action automatically.`
- `2026-07-24`: `Task3 then executed the medicine-house bounded source rewrite batch in production pack data. zhuyuanzhang medicine-house arrangements now point treatment/compounding/leave items at canonical template-house medicine_house event ids, the 63 matching medicine-house container-item bindings now target canonical medicine-house event ids with owner.id = house.template.medicine_house while preserving live arrangementId / containerId / itemId payload anchors, the 42 city-scoped medicine-house treatment/compounding flows have collapsed to canonical template-house medicine_house flow ids, and the 63 city-scoped medicine-house treatment/compounding/leave events have collapsed to three canonical template-house medicine_house event records with canonical ownerContext.ownerId / flowId truth.`
- `2026-07-24`: `Task3 has now refreshed the selector after medicine_house landed. generated/blueprint/event-canonical-reuse-medicine_house-applied-rewrite-summary.json records the applied medicine-house batch, generated/blueprint/event-canonical-reuse-next-slice-candidates.json now records home+keep+grain_shop+medicine_house as completed, and the next bounded non-home source-rewrite family is market.`
- `2026-07-24`: `Task3 then executed the market bounded source rewrite batch in production pack data. zhuyuanzhang market arrangements now point trade/talk/intel/leave items at canonical template-house market event ids, the 84 matching market container-item bindings now target canonical market event ids with owner.id = house.template.market while preserving live arrangementId / containerId / itemId payload anchors, the 63 city-scoped market trade/talk/intel flows have collapsed to canonical template-house market flow ids, and the 84 city-scoped market trade/talk/intel/leave events have collapsed to four canonical template-house market event records with canonical ownerContext.ownerId / flowId truth.`
- `2026-07-24`: `Task3 has now refreshed the selector after market landed. generated/blueprint/event-canonical-reuse-market-applied-rewrite-summary.json records the applied market batch, generated/blueprint/event-canonical-reuse-next-slice-candidates.json now records home+keep+market+grain_shop+medicine_house as completed, and the next bounded non-home source-rewrite family is tea_house.`
- `2026-07-24`: `Task3 then executed the tea-house bounded source rewrite batch in production pack data. zhuyuanzhang tea-house arrangements now point tea/talk/intel/leave items at canonical template-house tea_house event ids, the 84 matching tea-house container-item bindings now target canonical tea-house event ids with owner.id = house.template.tea_house while preserving live arrangementId / containerId / itemId payload anchors, the 63 city-scoped tea-house tea/talk/intel flows have collapsed to canonical template-house tea_house flow ids, and the 84 city-scoped tea-house tea/talk/intel/leave events have collapsed to four canonical template-house tea_house event records with canonical ownerContext.ownerId / flowId truth.`
- `2026-07-24`: `Task3 has now refreshed the selector after tea_house landed. generated/blueprint/event-canonical-reuse-tea_house-applied-rewrite-summary.json records the applied tea-house batch, generated/blueprint/event-canonical-reuse-next-slice-candidates.json now records home+keep+tea_house+market+grain_shop+medicine_house as completed, and the next bounded non-home source-rewrite family is leader_residence.`
- `2026-07-24`: `Task3 then executed the leader-residence bounded source rewrite batch in production pack data. zhuyuanzhang leader-residence arrangements now point review/leave items at canonical template-house leader_residence event ids, the 42 matching leader-residence container-item bindings now target canonical leader-residence event ids with owner.id = house.template.leader_residence while preserving live arrangementId / containerId / itemId payload anchors, the 21 city-scoped leader-residence review flows have collapsed to canonical template-house leader_residence flow ids, and the 42 city-scoped leader-residence review/leave events have collapsed to two canonical template-house leader_residence event records with canonical ownerContext.ownerId / flowId truth.`
- `2026-07-24`: `Task3 has now refreshed the selector after leader_residence landed. generated/blueprint/event-canonical-reuse-leader_residence-applied-rewrite-summary.json records the applied leader-residence batch, generated/blueprint/event-canonical-reuse-next-slice-candidates.json now records home+leader_residence+keep+tea_house+market+grain_shop+medicine_house as completed, and the next bounded non-home source-rewrite family is inn.`
- `2026-07-24`: `Task3 then executed the inn bounded source rewrite batch in production pack data. zhuyuanzhang inn arrangements now point drink/gamble/talk/work/leave items at canonical template-house inn event ids, the 105 matching inn container-item bindings now target canonical inn event ids with owner.id = house.template.inn while preserving live arrangementId / containerId / itemId payload anchors, the 84 city-scoped inn drink/gamble/talk/work flows have collapsed to canonical template-house inn flow ids, and the 105 city-scoped inn drink/gamble/talk/work/leave events have collapsed to five canonical template-house inn event records with canonical ownerContext.ownerId / flowId truth.`
- `2026-07-24`: `Task3 has now refreshed the selector after inn landed. generated/blueprint/event-canonical-reuse-inn-applied-rewrite-summary.json records the applied inn batch, generated/blueprint/event-canonical-reuse-next-slice-candidates.json now records home+leader_residence+keep+tea_house+market+grain_shop+medicine_house+inn as completed, and the next bounded non-home source-rewrite family is temple.`
- `2026-07-24`: `Task3 then executed the temple bounded source rewrite batch in production pack data. zhuyuanzhang temple arrangements now point review/donate/leave items across all 21 cities plus work across the 20 standard cities at canonical template-house temple event ids, the 83 matching temple container-item bindings now target canonical temple event ids with owner.id = house.template.temple while preserving live arrangementId / containerId / itemId payload anchors, the 62 standard-city temple review/work/donate flows have collapsed to canonical template-house temple flow ids, and the 83 standard-city temple review/work/donate/leave events have collapsed to four canonical template-house temple event records with canonical ownerContext.ownerId / flowId truth.`
- `2026-07-24`: `Temple rewrite keeps the recorded Kulan exception family explicit in production truth: binding.building.house.kulan.temple.work.container-item plus event/flow.building.house.kulan.temple.work remain preserved drift evidence, and Kulan copy-scripture / sweep-courtyard / carry-water routes remain city-scoped authored exceptions rather than being silently flattened into the standard temple canonical graph.`
- `2026-07-24`: `Task3 has now refreshed the selector after temple landed. generated/blueprint/event-canonical-reuse-temple-applied-rewrite-summary.json records the applied temple batch, generated/blueprint/event-canonical-reuse-next-slice-candidates.json now records home+leader_residence+temple+keep+tea_house+market+grain_shop+medicine_house+inn as completed, and no remaining non-home source-rewrite family candidates survive in the selector.`
- `2026-07-24`: `Task3 then absorbed the final home-family residue that remained outside the earlier 20-city home batch: arrangement.city.kulan.home_001 now points rest/leave at event.building.template.home.rest / leave, its two matching bindings now target canonical home event ids with owner.id = home.template while preserving live arrangement/container/item payload anchors, and the retired event.building.home_001.rest / leave plus flow.building.home_001.rest records were removed from production source truth.`
- `2026-07-24`: `Queue-closeout proof is now materialized at generated/blueprint/event-canonical-reuse-closeout-proof.json. The artifact proves that completed action-menu families no longer retain disallowed city-scoped event / flow / owner truth, and that the only remaining city-scoped routing truth is the explicitly preserved building-enter set plus the recorded Kulan temple exceptions. A full node --test tests/robustness.test.cjs run is green, and npm run lint:blueprints, npm run lint:blueprint-skill, and npm run blueprint:governance:check all pass.`
