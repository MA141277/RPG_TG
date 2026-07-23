# Map Rendering, City Data Separation, And Canonical Numeric ID Transition Queue

## Control Block

- queue_id: `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition`
- belongs_to_version: `target.map-rendering-city-data-separation-and-canonical-numeric-id-transition`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-23`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `done`
- queue_class: `required`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `closed`
- closure_basis: `Queue closeout completed after visible Codex in-app browser pointer-level proof covered normal start, built-in JSON runtime-pack import, and Script Editor runtime preview through campaign map rendering, clicking 濠州, confirming city entry, and reaching the city function menu on the new city-owned map placement truth.`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `pending`
- sync_scope: `local-record`
- sync_summary: `Queue closeout truth is now written locally after automated verification stayed green and visible in-app browser acceptance covered normal start, built-in JSON runtime-pack import, and Script Editor runtime preview. No repository sync batch has been recorded yet for this completed queue.`
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
  - `Replace map-owned city marker truth with city-owned map placement/data and land first-stage canonical numeric id generation plus consumer-route cleanup for new Script Editor-authored records.`
- Parent spec:
  - `docs/blueprints/specs/2026-07-22-map-rendering-city-data-separation-and-canonical-numeric-id-transition-target.md`
- Parent requirement role:
  - `This queue implements the full MEMO-027 version boundary.`
- Forbidden expansions:
  - `Do not bulk-rewrite existing ids outside first-stage preservation rules.`
  - `Do not widen into unrelated map/review provider modularization work.`

### Parent Spec Inheritance

- inherited_required_capabilities:
  - `city-owned map placement and map-facing metadata`
  - `provider-backed map rendering and lawful city click continuation`
  - `runtime/export/import/startup convergence`
  - `canonical numeric id generation for new Script Editor records`
  - `id-consumer audit plus refactor-log maintenance`
- inherited_compatibility_paths:
  - `existing ids remain stable`
  - `non-city map node rendering remains valid`
  - `normal start, JSON runtime pack import, and Script Editor runtime preview remain aligned`
- inherited_legacy_replacements:
  - `map-owned city marker coordinates/labels/summaries`
  - `count-based new-record ids and live id-shape assumptions`
- inherited_non_goals:
  - `no bulk existing-id rewrite`
  - `no long-term dual-truth compatibility layer`
- parent_spec_change_policy:
  - `If implementation proves the parent spec must change, update the parent spec first, then reconcile every affected evidence and queue field before treating any capability as removed or unsupported.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-MAP-ID-001`
  - `ACC-MAP-ID-002`
  - `ACC-MAP-ID-003`
  - `ACC-MAP-ID-004`
  - `ACC-MAP-ID-005`
  - `ACC-MAP-ID-006`
- acceptance_not_claimed:
  - `none`
- minimum_verification:
  - `npm run lint:blueprints`
  - `npm run typecheck`
  - `npm test -- --runInBand tests/robustness.test.cjs tests/city-building-mount-authoring.test.cjs`

### Claim Boundary

#### Can Claim

- `ACC-MAP-ID-001: Cities own canonical map placement plus map-facing label/summary metadata.`
- `ACC-MAP-ID-002: Map rendering consumes provider-backed city markers and keeps maps limited to rendering layers, non-city nodes, and interaction trigger surfaces.`
- `ACC-MAP-ID-003: Runtime/export/import/startup/preview all preserve the same city-owned map placement contract.`
- `ACC-MAP-ID-004: New Script Editor-authored records use canonical numeric ids by family-segmented max+1 allocation without deleted-id reuse.`
- `ACC-MAP-ID-005: Direct-vs-indirect id-consumer audit is recorded, owned indirect assumptions are removed, and the refactor log stays synchronized.`
- `ACC-MAP-ID-006: Active built-in content and startup paths migrate onto city-owned map placement with runnable acceptance proof.`

#### Cannot Claim

- `Version closeout is not owned by this queue.`
- `Out-of-scope means not implemented by this queue; it does not mean retired or unsupported unless the parent spec was updated first.`

#### Capability Floor

- `City click handling must still go through access checking and lawful continuation.`
- `Map non-city nodes and layer rendering must still work even though city marker truth moves to cities.`
- `Existing ids must continue resolving through direct lookup where they already do today.`

#### Parent Capability Coverage

- owned_closure:
  - `The queue closes the full MEMO-027 implementation boundary inside this version.`
- preserved_not_owned:
  - `Version closeout confirmation remains version-plan authority.`
- routed_elsewhere:
  - `none`

#### Over-Narrowing Guard

- parent_capabilities_not_owned_by_this_queue:
  - `version closeout only`
- forbidden_scope_shrinkage:
  - `Do not claim city-owned map truth by merely hiding map-node city text while still deriving coordinates from map nodes.`
  - `Do not claim numeric-id transition by changing one family while other add-record paths still emit count-based ids.`
- unspecified_detail_policy:
  - `Prefer city-owned placement and direct full-id lookup whenever current parent spec leaves implementation detail open.`
- gap_routing_policy:
  - `If any required inherited capability cannot be completed here, route it as residue or blocker instead of silently preserving legacy truth.`

#### Legacy Paths To Replace

- `city.mapNodeId -> map.nodes coordinate ownership`
- `map node label/summary as city-facing display truth`
- `family.new.N and count-based Script Editor top-level ids`
- `live consumer dependence on id string shape`

#### Compatibility Paths To Preserve

- `existing ids stay unchanged`
- `non-city map markers and layers still render`
- `startup/import/preview continue to resolve city entry without hidden fallback business branches`

#### User Path Coverage Matrix

- semantic_dimensions:
  - `creator-facing city map data ownership`
  - `runtime map marker ownership`
  - `city click continuation`
  - `preview/runtime/export/import consistency`
  - `new-record id generation and direct lookup consumption`
- primary_paths:
  - `campaign map renders city markers from provider-backed city data and city click still resolves lawful entry.`
- alternate_paths:
  - `JSON runtime pack import and Script Editor runtime preview use the same city-owned placement contract.`
- leave_return_or_followup_paths:
  - `city click still flows into access-check and then lawful continuation rather than direct building/dialogue dispatch from map code.`
- empty_or_fail_closed_paths:
  - `missing city placement or missing city-node association must fail closed or omit the marker without inventing hidden map-owned truth.`
- rejection_or_error_paths:
  - `invalid import/export or unsupported id-shape assumptions must surface as tests/diagnostics rather than silent compatibility drift.`
- forbidden_regressions:
  - `No active add-record path may keep count-based ids once the queue claims ACC-MAP-ID-004.`

#### Meaning Preservation

- creator_facing_meaning:
  - `Cities own their map-facing placement and text, while maps remain a rendering and click surface.`
- runtime_meaning:
  - `Provider-backed city markers are the canonical runtime city marker source.`
- trigger_timing_or_context:
  - `City click remains only the interaction trigger; access and continuation stay outside the map renderer.`
- consistency_surfaces:
  - `Script Editor project data`
  - `runtime export/import`
  - `scenario loader`
  - `normal start`
  - `runtime preview`

#### Functional Loss Budget

- budget: `zero`
- loss_accounting_rule:
  - `Any lost city marker, city click path, or add-record id behavior must be repaired or routed explicitly; silent compatibility loss is not allowed.`

#### Implementation Anchors

- Must inspect:
  - `src/application/content/active-game-content.ts`
  - `src/application/map/map-city-marker-view-model.ts`
  - `src/application/map/map-location-provider.ts`
  - `src/ui/views/map/map-view.ts`
  - `src/application/script-editor/minimal-workflow.ts`
  - `src/application/script-editor/city-building-authoring.ts`
  - `src/application/script-editor/city-building-runtime-materializer.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/domain/script-editor-project.ts`
  - `src/content/scenario-packs/zhuyuanzhang/**`
- Must modify:
  - `src/application/content/active-game-content.ts`
  - `src/application/map/map-city-marker-view-model.ts`
  - `src/application/map/map-location-provider.ts`
  - `src/ui/views/map/map-view.ts`
  - `src/application/script-editor/**`
  - `src/domain/script-editor-project.ts`
  - `tests/**`
  - `docs/blueprints/specs/2026-07-22-map-rendering-city-data-separation-and-canonical-numeric-id-transition-refactor-log.md`
- Must preserve:
  - `lawful city click continuation`
  - `existing ids`
  - `non-city map rendering`

#### Verification Coverage

- `Blueprint lint, typecheck, targeted robustness and city-building tests, plus direct acceptance proof for map render/click surfaces.`

#### Replacement Proof

- previous_owner_or_path:
  - `map nodes owned city marker coordinates/labels/summaries, and Script Editor add-record helpers owned count-based id generation.`
- new_owner_or_path:
  - `cities own map placement/map-facing metadata, mapLocationProvider emits canonical city markers, and canonical-id helpers own new-record allocation.`
- behavior_preservation_expectation:
  - `City markers still render and city click still enters the same lawful continuation, but the truth owner changes. Existing ids keep working while new ids become canonical.`
- old_truth_owner_exit_proof:
  - `Queue closeout must show city marker rendering no longer depends on map-node-owned city coordinates/labels as primary truth and that add-record paths no longer emit count-based ids.`
- verification_evidence:
  - `Targeted runtime/export/import/tests plus refactor-log inventory updates.`
- replacement_scope_limit:
  - `This queue replaces city marker truth ownership and new-record id allocation only; it does not bulk-rewrite existing ids.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-22-map-rendering-city-data-separation-and-canonical-numeric-id-transition-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-22-map-rendering-city-data-separation-and-canonical-numeric-id-transition-target-plan.md`

### Queue Snapshot

- queue_goal: `Land city-owned map marker truth and first-stage canonical numeric id generation without rewriting existing ids.`
- task_count: `4`
- completed_task_count: `4`
- remaining_task_count: `0`
- active_task_summary: `Queue closed locally after active content migration, refactor-log sync, and human-visible in-app browser acceptance covered the remaining ACC-MAP-ID-006 proof surfaces.`
- task_briefs:
  - `task.map-rendering-city-data-separation-and-canonical-numeric-id-transition.evidence-anchor-reconcile: lock queue evidence and refactor-log baseline.`
  - `task.map-rendering-city-data-separation-and-canonical-numeric-id-transition.city-owned-map-rendering-cutover: move map marker truth into cities and provider-backed map rendering.`
  - `task.map-rendering-city-data-separation-and-canonical-numeric-id-transition.canonical-numeric-id-allocation-and-consumer-cleanup: replace count-based new-record ids and clean owned consumer assumptions.`
  - `task.map-rendering-city-data-separation-and-canonical-numeric-id-transition.pack-migration-refactor-log-and-acceptance: migrate active pack data, update refactor log, and run acceptance coverage.`

### Completion Completeness Review

- review_status: `done`
- can_claim_coverage:
  - `ACC-MAP-ID-001/002/003/004/005 remain covered by automation, and ACC-MAP-ID-006 is now covered by visible Codex in-app browser pointer-level proof across normal start, built-in JSON runtime-pack import, and Script Editor runtime preview.`
- parent_spec_preservation:
  - `Parent spec is preserved so far: city-owned placement now owns marker truth, top-level draft ids are canonical numeric max+1, and import/startup/preview regressions remain green in focused coverage.`
- capability_floor_verification:
  - `Verification now covers blueprint lint, typecheck, npm run build:test, node --test tests/robustness.test.cjs tests/city-building-mount-authoring.test.cjs, and focused map/id regression patterns.`
- out_of_scope_routing:
  - `No out-of-scope routing is currently required.`
- verification_sufficiency:
  - `Queue-local verification is sufficient: automation and source guards remain green for ACC-MAP-ID-001..005, and ACC-MAP-ID-006 now has the required visible Codex in-app browser proof.`
- user_path_matrix_verification:
  - `Done. Normal start, built-in JSON runtime-pack import, and Script Editor runtime preview all rendered the campaign map, accepted a city click on 濠州, confirmed city entry, and reached the city function menu.`
- functional_loss_audit:
  - `Done. No new city marker, city click, or continuation loss was observed on the accepted entrypoints.`
- replacement_proof_summary:
  - `Replacement truth is now both automation-backed and human-visible acceptance-backed: runtime entrypoints no longer needed hidden map-owned city marker truth to render the map or continue into the city shell.`
- placeholder_or_legacy_fallback_audit:
  - `Owned code paths remain automation-backed and refactor-log backed, and the visible runtime acceptance path did not require fallback to hidden/background browser automation.`
- gap_fill_decision:
  - `none`
- gap_fill_scope:
  - `none`
- remaining_gaps:
  - `No queue-local capability gap remains. Repository sync is still pending before any future same-version queue admission can be recorded.`

### Execution Self-Review Gate

- review_scope: `queue-closeout`
- version_acceptance_alignment:
  - `The queue owns every version acceptance id.`
- parent_spec_alignment:
  - `The queue keeps city-owned map truth and numeric-id transition together, matching the parent spec.`
- queue_claim_alignment:
  - `The queue may claim full MEMO-027 completion but not version closeout.`
- over_narrowing_check:
  - `The queue spec requires startup/import/export/preview parity, consumer audit, and pack migration, preventing a thin helper-only closeout.`
- residue_or_blocker_routing_check:
  - `No blocker or same-family residue remains inside the queue boundary. Hidden/background automation stays excluded historically, and the required visible Codex in-app browser proof has now been captured truthfully.`
- verification_adequacy_check:
  - `Implementation verification and browser acceptance are complete for this queue-local closeout batch.`
- next_lawful_action_check:
  - `Queue closeout is now recorded locally. The next lawful action is version-level review plus repository-sync recording before any future same-version queue admission.`

### Runtime/Browser Acceptance Gate

- gate_required: `true`
- covered_surfaces:
  - `campaign map rendering`
  - `city click`
  - `normal start`
  - `JSON runtime pack import`
  - `Script Editor runtime preview`
- interaction_path:
  - `Acceptance ran inside the visibly rendered Codex built-in in-app browser. A visible mouse/keyboard/scroll handshake passed first, then normal start, built-in JSON runtime-pack import, and Script Editor runtime preview each rendered the campaign map, clicked 濠州, confirmed city entry, and continued into the city function menu.`
- proof_mode:
  - `human-visible-in-app-browser`
- proof_artifacts:
  - `Automated coverage and refactor-log evidence are retained. Human-visible Codex in-app browser pointer-level proof on 2026-07-23 covered the required cross-entrypoint map/city continuation surfaces. Earlier system-browser/background automation artifacts remain explicitly excluded from simulated-human/browser-interaction accounting because they were not visible in the Codex built-in in-app browser.`
- fail_closed_check:
  - `Reviewed during closeout. The accepted runtime entrypoints now claim success only on the landed city-owned placement truth and do not rely on hidden fallback map-node ownership.`
- waiver_basis:
  - `none`
- simulated_human_visibility:
  - `covered`
- interaction_semantics:
  - `Visible Codex in-app browser interaction is required before closing ACC-MAP-ID-006; hidden/background automation, page scraping, or script-success logs do not count.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.map-rendering-city-data-separation-and-canonical-numeric-id-transition.evidence-anchor-reconcile` | `done` | `Lock evidence, anchors, claim boundary, and refactor-log baseline before feature implementation.` | `none` | `Completed after queue/plan/refactor-log truth was synchronized to the inspected replacement inventory.` |
| `task.map-rendering-city-data-separation-and-canonical-numeric-id-transition.city-owned-map-rendering-cutover` | `done` | `Move city marker truth into cities and rebase map provider/view/runtime paths onto city-owned placement and metadata.` | `task.map-rendering-city-data-separation-and-canonical-numeric-id-transition.evidence-anchor-reconcile` | `ACC-MAP-ID-001/002/003 city-map portions now have focused automated proof; remaining queue work moved to acceptance.` |
| `task.map-rendering-city-data-separation-and-canonical-numeric-id-transition.canonical-numeric-id-allocation-and-consumer-cleanup` | `done` | `Replace count-based Script Editor new-record ids with canonical numeric ids and clean owned direct-vs-indirect consumers.` | `task.map-rendering-city-data-separation-and-canonical-numeric-id-transition.city-owned-map-rendering-cutover` | `ACC-MAP-ID-004/005 now have focused automated proof plus synchronized refactor-log audit notes.` |
| `task.map-rendering-city-data-separation-and-canonical-numeric-id-transition.pack-migration-refactor-log-and-acceptance` | `done` | `Migrate active content, finalize the running refactor log, and run queue acceptance coverage.` | `task.map-rendering-city-data-separation-and-canonical-numeric-id-transition.canonical-numeric-id-allocation-and-consumer-cleanup` | `Docs/change-log sync is complete, active content migration remains green, and ACC-MAP-ID-006 is now covered by visible Codex in-app browser proof across normal start, built-in JSON runtime-pack import, and Script Editor runtime preview.` |

### Task Definitions

#### `task.map-rendering-city-data-separation-and-canonical-numeric-id-transition.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.map-rendering-city-data-separation-and-canonical-numeric-id-transition.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/specs/2026-07-22-map-rendering-city-data-separation-and-canonical-numeric-id-transition-target.md`
  - `docs/blueprints/specs/2026-07-22-map-rendering-city-data-separation-and-canonical-numeric-id-transition-refactor-log.md`
  - `src/application/content/active-game-content.ts`
  - `src/application/map/**`
  - `src/application/script-editor/**`
- must_inspect:
  - `version acceptance matrix`
  - `implementation anchors`
  - `current map and id-generation truth owners`
- must_not_change:
  - `Do not claim acceptance coverage before implementation exists.`
  - `Do not widen the queue into unrelated map/review modularization.`
- done_when:
  - `Evidence Lock is locked.`
  - `Refactor-log baseline is synchronized to the currently inspected replacement inventory.`
  - `Must inspect, must modify, must replace, must preserve, and minimum verification remain accurate.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Return to version review only if a concrete parent-spec or implementation-anchor blocker appears.`
- promote_next_if_done: `task.map-rendering-city-data-separation-and-canonical-numeric-id-transition.city-owned-map-rendering-cutover`
- stop_if:
  - `implementation_anchor_status is missing or conflicting`
  - `prerequisite_status is needs-prior-queue or split-required`

##### Human Context

- task_brief:
  - `Lock queue evidence and the running refactor-log baseline before code changes continue.`
- task_outcome_summary:
  - `Completed after the version plan, queue doc, and refactor-log baseline were reconciled against the inspected implementation anchors.`
- Purpose:
  - `Prevent map-truth and id-transition work from drifting into partial or thin helper-only completion claims.`
- Failure mode:
  - `Implementation starts before the current replacement inventory and acceptance ownership are durably synchronized.`

#### `task.map-rendering-city-data-separation-and-canonical-numeric-id-transition.city-owned-map-rendering-cutover`

##### Control Block

- task_id: `task.map-rendering-city-data-separation-and-canonical-numeric-id-transition.city-owned-map-rendering-cutover`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/domain/city.ts`
  - `src/domain/script-editor-project.ts`
  - `src/application/content/active-game-content.ts`
  - `src/application/map/**`
  - `src/ui/views/map/map-view.ts`
  - `src/application/script-editor/city-building-authoring.ts`
  - `src/application/script-editor/city-building-runtime-materializer.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
- must_inspect:
  - `city map-node ownership paths`
  - `provider-backed marker generation`
  - `campaign map marker rendering`
- must_modify:
  - `city-owned map placement/data contracts`
  - `map provider/view/runtime consumption`
- must_replace:
  - `map-owned city marker coordinate/label/summary truth`
- must_preserve:
  - `city click -> access check -> lawful continuation`
  - `non-city map node rendering`
- must_not_change:
  - `Do not move access checking or business routing into map rendering.`
  - `Do not delete non-city marker support from maps.`
- done_when:
  - `City-owned map placement and metadata are the primary city marker truth.`
  - `Provider-backed map rendering no longer depends on map-node-owned city coordinates or city-facing text as canonical truth.`
  - `Import/export/runtime-startup paths carry the same city-owned placement structure or explicit transition handling owned by this queue.`
- verify_with:
  - `npm run typecheck`
  - `npm test -- --runInBand tests/robustness.test.cjs`
- if_blocked:
  - `Record a real blocker rather than silently keeping map-node-owned city truth.`
  - `Do not widen into unrelated map/review modularization.`
- promote_next_if_done: `task.map-rendering-city-data-separation-and-canonical-numeric-id-transition.canonical-numeric-id-allocation-and-consumer-cleanup`
- stop_if:
  - `parent-spec-change-required`
  - `capability-downgrade-risk`

##### Human Context

- task_brief:
  - `Cut map city marker ownership over to city-owned data and keep the map layer as render+interaction only.`
- task_outcome_summary:
  - `Done. Provider-backed city markers, city-owned mapPlacement contracts, runtime/import/startup consumers, and focused regressions now cover city-owned marker truth; remaining explicit mapNodeId usage is limited to association/suppression seams rather than primary marker ownership.`
- Purpose:
  - `Eliminate hidden map-owned city marker truth while preserving one lawful city-click continuation chain.`
- Failure mode:
  - `Coordinates move but map-facing label/summary or click ownership still secretly lives in map nodes.`

#### `task.map-rendering-city-data-separation-and-canonical-numeric-id-transition.canonical-numeric-id-allocation-and-consumer-cleanup`

##### Control Block

- task_id: `task.map-rendering-city-data-separation-and-canonical-numeric-id-transition.canonical-numeric-id-allocation-and-consumer-cleanup`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/application/script-editor/**`
  - `src/domain/script-editor-project.ts`
  - `tests/**`
  - `docs/blueprints/specs/2026-07-22-map-rendering-city-data-separation-and-canonical-numeric-id-transition-refactor-log.md`
- must_inspect:
  - `all add-record/new-record generation paths inside the owned families`
  - `live id-consumer assumptions inside owned surfaces`
- must_modify:
  - `new-record id generation`
  - `owned direct-vs-indirect consumers`
  - `refactor log audit entries`
- must_replace:
  - `count-based ids and live string-shape assumptions`
- must_preserve:
  - `existing ids`
  - `direct full-id lookup behavior`
- must_not_change:
  - `Do not rewrite existing pack ids in bulk.`
  - `Do not claim indirect-consumer cleanup without updating the refactor log.`
- done_when:
  - `Owned add-record paths allocate canonical numeric ids by family max+1.`
  - `Deleted ids are not reused.`
  - `Refactor log records the audited direct and indirect consumers touched by this task.`
- verify_with:
  - `npm run typecheck`
  - `npm test -- --runInBand tests/robustness.test.cjs tests/city-building-mount-authoring.test.cjs`
- if_blocked:
  - `Record blocking consumer assumptions explicitly instead of preserving them silently.`
  - `Do not widen into repository-wide hardcoded-residue cleanup.`
- promote_next_if_done: `task.map-rendering-city-data-separation-and-canonical-numeric-id-transition.pack-migration-refactor-log-and-acceptance`
- stop_if:
  - `real-blocker`
  - `parent-spec-change-required`

##### Human Context

- task_brief:
  - `Replace count-based new-record ids with canonical numeric ids and clean the owned consumer assumptions.`
- task_outcome_summary:
  - `Done. Top-level draft creation is verified to allocate canonical numeric ids by family max+1 without deleted-id reuse, and owned consumer/source-guard expectations were updated away from stale legacy id/UI assumptions.`
- Purpose:
  - `Adopt the first-stage canonical numeric id rule without destabilizing existing ids.`
- Failure mode:
  - `New ids become numeric in one place but still break consumers or other add-record paths.`

#### `task.map-rendering-city-data-separation-and-canonical-numeric-id-transition.pack-migration-refactor-log-and-acceptance`

##### Control Block

- task_id: `task.map-rendering-city-data-separation-and-canonical-numeric-id-transition.pack-migration-refactor-log-and-acceptance`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/content/scenario-packs/zhuyuanzhang/**`
  - `src/content/prototype-world.ts`
  - `tests/**`
  - `docs/blueprints/specs/2026-07-22-map-rendering-city-data-separation-and-canonical-numeric-id-transition-refactor-log.md`
  - `docs/change-log.md`
- must_inspect:
  - `active content map placement truth`
  - `pack import/export/preview verification surfaces`
  - `browser acceptance requirements`
- must_modify:
  - `active pack city records`
  - `refactor log`
  - `tests`
  - `docs/change-log.md`
- must_replace:
  - `active pack dependence on hidden map-owned city placement truth`
- must_preserve:
  - `startup/import/preview parity`
  - `existing ids`
- must_not_change:
  - `Do not leave the refactor log stale at queue closeout.`
  - `Do not claim acceptance on source edits alone.`
- done_when:
  - `Active content is synchronized onto city-owned map placement.`
  - `Refactor log reflects all landed replacement inventory changes.`
  - `Acceptance verification covers runtime/export/import/map rendering and id-generation claims honestly.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run typecheck`
  - `npm test -- --runInBand tests/robustness.test.cjs tests/city-building-mount-authoring.test.cjs`
- if_blocked:
  - `Record concrete acceptance blockers in queue truth, not vague uncertainty.`
  - `Do not skip runnable proof for ACC-MAP-ID-006 without a lawful waiver basis.`
- promote_next_if_done: `none`
- stop_if:
  - `real-blocker`
  - `capability-downgrade-risk`

##### Human Context

- task_brief:
  - `Migrate active content, synchronize the running refactor log, and complete queue acceptance coverage.`
- task_outcome_summary:
  - `Completed. Active content migration and focused automated verification stayed green, the running refactor log and docs/change-log remained synchronized, and truthful visible Codex in-app browser acceptance covered normal start, built-in JSON runtime-pack import, and Script Editor runtime preview through campaign map rendering, clicking 濠州, confirming city entry, and reaching the city function menu.`
- Purpose:
  - `Finish the replacement chain with active content truth and evidence instead of leaving city-owned map placement as a partial code-only change.`
- Failure mode:
  - `Runtime code changes land, but active content and acceptance proof still depend on old hidden truth.`
