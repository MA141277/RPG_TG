# Project Complete Modularization Target Plan

## Control Block

- document_role: `target-governor`
- target_id: `target.project-complete-modularization`
- status: `done`
- active_phase: `phase.final-acceptance`
- active_queue: `none`
- active_task: `none`
- decision_state: `promotion-review`
- next_decision: `none`
- blocked_by: []
- promotion_gate:
  - `active_queue_is_none_or_done`
  - `fresh_audit_proves_real_blocker`
  - `promotion_note_written`
  - `promoted_queue_has_valid_control_block`
- closeout_gate:
  - `all_required_queues_done_or_dropped`
  - `no_active_task_remaining`
  - `target_acceptance_criteria_passed`
- remote_integration_policy:
  - `verified_batch_or_queue_closeout_should_trigger_remote_integration_recommendation`
  - `continue_from_integrated_state_after_merge_into_mod-first-dev`
- classification_review_policy:
  - `new_items_must_be_classified_before_queue_promotion_or_pipeline_routing`
  - `low_confidence_routes_to_uncertain-needs-review`
  - `queue_candidate_does_not_auto_start_execution`

## Human Context

### Goal

Keep the repository on one current-period complete-modularization target and sequence the remaining production modularization work through queues.

### Architecture

This is the target-level governor for the current `mod-first` completion period. It does not replace queue-local task planning. It decides which queue is active, what queue family comes next, when queue promotion is legal, and how queue closeout rolls up into the current target.

### Tech Stack

`docs/blueprints/**`, `docs/change-log.md`, queue documents under `docs/blueprints/queues/`, historical roadmap references under `docs/superpowers/**`

### Execution State

- Status: `in-progress`
- Last Updated: `2026-07-07`
- Current Focus: `The first formal target for this period remains project complete modularization, and that current-period target is now closed. There is no active queue or task; future work must re-enter through classification and promotion review.`
- Next Step: `Resume only from later target/promotion review if fresh classified work appears.`
- Verification: `npm test; npm run typecheck; node tools/validate-scenario-packs.mjs`
- Notes: `Later periods may define different targets, but same-period modularization tracks should enter as queues under the current target.`

### Progress Log

- 2026-07-06
  - Summary: `Formalized the current-period target as project complete modularization, aligned its target artifacts, and set core-production-integration as the first active queue under it.`
  - Verification: `Document consistency check plus historical roadmap recheck`
  - Next: `Resume the active queue task.`
- 2026-07-06
  - Summary: `Accepted the core-production-integration queue closeout after engine retirement, save-envelope cutover, and runtime ownership audit.`
  - Verification: `Queue closeout verification plus pointer sync`
  - Next: `If Phase 1 continues, promote shell-thinning-and-final-ownerization instead of state-sync-and-runtime-canonicalization.`
- 2026-07-06
  - Summary: `Promoted shell-thinning-and-final-ownerization as the new active Phase 1 queue and opened its first baseline-reconcile task.`
  - Verification: `Target plan pointer sync plus queue creation check`
  - Next: `Resume the new active queue from baseline-reconcile.`
- 2026-07-06
  - Summary: `Closed the shell-thinning baseline reconcile and advanced the active queue task to view-transition-ownerization.`
  - Verification: `Target plan pointer sync plus refreshed main.ts hotspot recheck`
  - Next: `Resume the active queue from view-transition-ownerization.`
- 2026-07-06
  - Summary: `Closed shell-thinning view-transition-ownerization and advanced the active queue task to travel-and-auto-advance-ownerization.`
  - Verification: `Target plan pointer sync plus npm test`
  - Next: `Resume the active queue from travel-and-auto-advance-ownerization.`
- 2026-07-06
  - Summary: `Closed shell-thinning travel-and-auto-advance-ownerization and advanced the active queue task to render-prepass-ownerization.`
  - Verification: `Target plan pointer sync plus npm test`
  - Next: `Resume the active queue from render-prepass-ownerization.`
- 2026-07-06
  - Summary: `Closed shell-thinning render-prepass-ownerization by extracting render-time city-NPC refresh write-back into application/runtime/render-prepass-state.ts.`
  - Verification: `Target plan pointer sync plus npm test`
  - Next: `Run shell-thinning queue closeout.`
- 2026-07-06
  - Summary: `Closed shell-thinning-and-final-ownerization after the queue closeout audit found no current need to promote state-sync-and-runtime-canonicalization or startup-builder-ownerization.`
  - Verification: `Closed queue residue audit plus npm test`
  - Next: `Decide whether the current target now advances from Phase 1 Runtime Closure to its first Phase 2 queue promotion.`
- 2026-07-06
  - Summary: `Promoted builtin-content-deprivileging-closeout as the first active Phase 2 queue after the codebase audit found live builtin-first production privilege across registries, startup activation, active content bootstrap, and UI reserve layering.`
  - Verification: `Target plan pointer sync plus builtin privilege source audit`
  - Next: `Resume the active queue from baseline-reconcile.`
- 2026-07-06
  - Summary: `Closed builtin-content-deprivileging baseline-reconcile after classifying static registry seeds, direct builtin startup activation, and base-pack bootstrap as the first justified blockers, while UI reserve layering remains accepted-for-now framework baseline.`
  - Verification: `Target plan pointer sync plus queue baseline audit`
  - Next: `Resume the active queue from builtin-registry-and-loader-audit.`
- 2026-07-06
  - Summary: `Advanced builtin-registry-and-loader-audit by moving builtin startup activation and builtin save-source reload onto the shared mod.load-builtin loader seam.`
  - Verification: `Target plan pointer sync plus npm test`
  - Next: `Keep the active queue on builtin-registry-and-loader-audit and continue with static builtin registry seed deprivileging.`
- 2026-07-06
  - Summary: `Closed builtin-registry-and-loader-audit after builtin house/playable registry seed ownership moved into explicit builtin installer modules and promoted runtime-consumer-deprivileging as the next active queue task.`
  - Verification: `Target plan pointer sync plus npm test`
  - Next: `Resume the active queue from runtime-consumer-deprivileging.`
- 2026-07-06
  - Summary: `Advanced runtime-consumer-deprivileging by removing the builtin base-pack self-load from default-runtime-content and shifting that consumer to explicit default-pack injection from main.ts.`
  - Verification: `Target plan pointer sync plus npm test`
  - Next: `Resume the active queue on active-content/bootstrap and remaining builtin-preloaded consumer assumptions.`
- 2026-07-06
  - Summary: `Advanced runtime-consumer-deprivileging again by preserving multi-pack activation content sources for scenario startup and moving active-content bootstrap onto activationResult-driven source assembly.`
  - Verification: `Target plan pointer sync plus npm test`
  - Next: `Resume the active queue on the remaining builtin-preloaded UI/content consumer assumptions.`
- 2026-07-06
  - Summary: `Closed builtin-content-deprivileging-closeout after the queue closeout audit confirmed that the remaining UI reserve layering stays off the main startup/runtime path and therefore does not justify keeping a builtin-only deprivileging queue active.`
  - Verification: `Target plan pointer sync plus targeted source-path audit and npm test`
  - Next: `Decide whether unified-contribution-intake-closeout is actually justified or whether the current target should wait for a stronger next blocker before promoting another queue.`
- 2026-07-06
  - Summary: `Rejected promotion of unified-contribution-intake-closeout after a fresh contribution-intake audit confirmed that the audited families already enter through the shared gameplay contribution contract, mod manifest declaration, mod runtime contribution installation, and shared house/playable registries.`
  - Verification: `Targeted source audit across gameplay contribution contract, manifest, mod runtime installation, shared registries, and robustness coverage`
  - Next: `Advance to Phase 3 authoring review and decide whether authoring-entrypoint-and-fail-closed-closure is justified.`
- 2026-07-06
  - Summary: `Promoted authoring-entrypoint-and-fail-closed-closure after the Phase 3 audit confirmed that playable tooling already has scaffold/validator/CI ownership, but scenario-pack/default-pack/house-family authoring still lacks a shared entrypoint and fail-closed story.`
  - Verification: `Targeted authoring source audit across package scripts, tools/, scenario-pack loader/catalog loader, pack-content-access, house registries, and robustness coverage`
  - Next: `Resume the active queue from scenario-pack-and-default-pack-entrypoint-closure.`
- 2026-07-06
  - Summary: `Closed scenario-pack-and-default-pack-entrypoint-closure after landing tools/scaffold-scenario-pack.mjs, tools/validate-scenario-packs.mjs, package-script entrypoints, and a fail-closed default-pack authoring contract tied to the default scenario-pack catalog entry.`
  - Verification: `Target plan pointer sync plus npm test, npm run typecheck, and node tools/validate-scenario-packs.mjs`
  - Next: `Resume the active queue from house-family-authoring-entrypoint-closure.`
- 2026-07-06
  - Summary: `Closed house-family-authoring-entrypoint-closure after builtin house registry seeding moved to a single shared contribution list and the documented house registry rule stopped requiring separate module and renderer edits.`
  - Verification: `Target plan pointer sync plus npm test, npm run typecheck, and node tools/validate-scenario-packs.mjs`
  - Next: `Resume the active queue from shared-fail-closed-policy-closeout.`
- 2026-07-06
  - Summary: `Advanced shared-fail-closed-policy-closeout by locking scaffolded Phase 3 scenario-pack manifests onto a canonical authoringTemplate marker, keeping legacy builtin manifests on an explicit compatibility path, and narrowing the remaining residue to documentation truth rather than another framework capability gap.`
  - Verification: `Target plan pointer sync plus npm test, npm run typecheck, and node tools/validate-scenario-packs.mjs`
  - Next: `Keep the active queue on shared-fail-closed-policy-closeout and finish task-local authoring family classification before queue closeout is considered.`
- 2026-07-07
  - Summary: `A residue recheck across package scripts, tools/, and robustness coverage found no additional shared fail-closed code seam inside the current task boundary, so the remaining Phase 3 blocker stays narrowed to documentation truth rather than another authoring implementation slice.`
  - Verification: `Targeted source-path recheck plus npm test and node tools/validate-scenario-packs.mjs`
  - Next: `Keep the active queue on shared-fail-closed-policy-closeout and finish documenting the no-new-code-seam conclusion before queue-closeout is considered.`
- 2026-07-07
  - Summary: `Recorded an explicit authoring classification matrix for the active task: playable authoring, scaffolded Phase 3 scenario-pack authoring, default-pack drift control, and builtin house authoring are now treated as framework-owned or fail-closed coverage, while legacy builtin scenario-pack manifests remain accepted compatibility residue and do not by themselves justify a new scaffold queue.`
  - Verification: `Target-plan/queue consistency check against the active task truth`
  - Next: `Keep the active queue on shared-fail-closed-policy-closeout and use the explicit matrix as the remaining documentation-truth evidence without promoting queue-closeout yet.`
- 2026-07-07
  - Summary: `Promoted queue-closeout as the new active task after shared-fail-closed-policy-closeout finished with an explicit authoring classification matrix, accepted compatibility residue, and the no-new-code-seam conclusion for the current task boundary.`
  - Verification: `Target-plan/queue consistency check plus document consistency check`
  - Next: `Run queue-closeout and decide whether Phase 3 authoring can close without promoting queue.framework-scaffold-and-template-closure.`
- 2026-07-07
  - Summary: `Accepted queue-closeout and closed queue.authoring-entrypoint-and-fail-closed-closure after the active queue proved that current Phase 3 authoring is coherent without promoting queue.framework-scaffold-and-template-closure. The target is now back in promotion-review with no active queue or task.`
  - Verification: `Document consistency check plus npm test`
  - Next: `Promote nothing by default. Only start a later queue if fresh target-level evidence is recorded.`
- 2026-07-07
  - Summary: `Promoted queue.historical-residue-disposition as the first active Phase 4 queue after the target-level review found that earlier phases are closed, no fresh implementation blocker is currently proven, and the remaining work is synchronized residue routing before later acceptance proof or final closeout can be promoted honestly.`
  - Verification: `Closed-queue residue audit plus document pointer sync check`
  - Next: `Resume the active queue from residue-classification-and-routing.`
- 2026-07-07
  - Summary: `Advanced queue.historical-residue-disposition onto queue-closeout after the active task recorded the explicit residue disposition matrix and named queue.first-party-mod-acceptance as the current recommended Phase 4 handoff.`
  - Verification: `Document consistency check across the active queue, target plan, target spec, blueprint, and project-progress entries`
  - Next: `Run queue-closeout and decide whether to promote queue.first-party-mod-acceptance.`
- 2026-07-07
  - Summary: `Accepted queue.historical-residue-disposition closeout and promoted queue.first-party-mod-acceptance after the synchronized residue record confirmed that no fresh implementation blocker is currently proven and the remaining Phase 4 work is bounded acceptance proof.`
  - Verification: `Document consistency check across the closed queue, promoted queue, target plan, target spec, blueprint, and project-progress entries`
  - Next: `Resume queue.first-party-mod-acceptance from baseline-reconcile.`
- 2026-07-07
  - Summary: `Closed task.first-party-mod-acceptance.baseline-reconcile after the targeted source-path audit confirmed that builtin startup uses the shared builtin loader seam, active-content assembly consumes normalized activation content sources, and the remaining Phase 4 work is acceptance proof rather than a fresh implementation blocker.`
  - Verification: `Targeted source-path audit plus document pointer sync`
  - Next: `Resume queue.first-party-mod-acceptance from production-path-acceptance-proof.`
- 2026-07-07
  - Summary: `Closed task.first-party-mod-acceptance.production-path-acceptance-proof after the queue recorded one explicit acceptance matrix for shared mod-path behavior, retained first-party baseline, and accepted compatibility residue.`
  - Verification: `Targeted source-path audit plus document pointer sync`
  - Next: `Resume queue.first-party-mod-acceptance from queue-closeout.`
- 2026-07-07
  - Summary: `Accepted queue.first-party-mod-acceptance closeout and promoted queue.final-acceptance-closeout after the written proof established that the remaining work is final target-acceptance reconciliation rather than another implementation-family queue.`
  - Verification: `Document consistency check across the closed queue, promoted queue, target plan, target spec, blueprint, and project-progress entries`
  - Next: `Resume queue.final-acceptance-closeout from baseline-reconcile.`
- 2026-07-07
  - Summary: `Closed queue.final-acceptance-closeout baseline-reconcile after the target-level recheck confirmed that required queue evidence is already coherent, no fresh blocker was rediscovered, and the remaining live work is target-level acceptance writing.`
  - Verification: `Document consistency check plus targeted source-path recheck on the covered builtin startup, activation, and inventory surfacing seams`
  - Next: `Resume queue.final-acceptance-closeout from target-acceptance-closeout.`
- 2026-07-07
  - Summary: `Closed queue.final-acceptance-closeout target-acceptance-closeout after recording one synchronized acceptance-ready decision: target criteria are satisfied on current evidence with explicit first-party baseline and compatibility disclosures, so the remaining work is final queue/target synchronization.`
  - Verification: `Document consistency check against the target acceptance criteria and active queue truth`
  - Next: `Resume queue.final-acceptance-closeout from queue-closeout.`
- 2026-07-07
  - Summary: `Closed queue.final-acceptance-closeout and marked target.project-complete-modularization done after final synchronization confirmed that no active queue/task remains and the target acceptance criteria now pass on written evidence.`
  - Verification: `Document consistency check across the closed queue, closed target, blueprint, project-progress, and target spec`
  - Next: `Resume only from later target/promotion review if fresh classified work appears.`

---

### Based On Spec

- Blueprint:
  - `docs/blueprints/blueprint.md`
- Primary target spec:
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`

### Period Baseline

- Closed foundation already exists from historical queues:
  - pack-content decoupling
  - runtime spine unification
  - task runtime mod contract
  - house runtime mod registration
  - unified gameplay contribution registry
  - end-to-end mod-first runtime closure
  - startup/main-runtime ownerization continuation
  - first playable-runtime migration queue
- Current remaining target-level debt still centers on:
  - whether any broader shared contribution-intake blocker still remains after the closed builtin privilege queue
  - possible bridge/state canonicalization residue only if a new blocker is later proven by later audits
  - later authoring and final-acceptance queue families after Phase 2 and Phase 3 reviews land

### Queue Policy

- There is one current target in the current execution period.
- Concrete work enters through queue documents.
- Only one queue task may be `active` repository-wide unless a stronger written reason says otherwise.
- Finished queue work should roll up into this plan's progress log, not spawn a second same-period target.
- Closed historical queues remain evidence and input, not active controllers.
- A target is allowed to remain in `promotion-review` with `active_queue = none`; AI must not invent work during this pause.

### Classification Review

- Rule layer:
  - `docs/blueprints/classification-rule-layer-spec.md`
- Promotion review order:
  1. `classify the new item`
  2. `check target-specific overrides`
  3. `route to current-target-item, queue-candidate, pipeline item, residue, or review`
  4. `only then consider queue promotion`
- Default pause:
  - `If classification returns queue-candidate, future-target-candidate, or uncertain-needs-review, do not begin implementation until governance records the next decision.`

### Classification Record

- item_id: `review.historical-residue-disposition.2026-07-07`
- item_type: `acceptance-residue`
- classify_as: `queue-candidate`
- confidence: `high`
- matched_rules:
  - `R2`
  - `CT2`
- why:
  - `Earlier phases are closed and no fresh implementation blocker is currently proven, but the target still carries accepted-history, accepted-framework-baseline, and accepted-compatibility residue across separate queue closeout records with no single synchronized Phase 4 routing note.`
- escalate_if:
  - `Promotion opens a bounded Phase 4 queue that classifies residue before first-party acceptance proof or final closeout is promoted.`
- reject_if:
  - `A fresh audit proves the remaining work is already pure final acceptance proof with no residue routing drift, or proves a new implementation blocker that belongs to another queue family instead.`

### Promotion Review Decision

- reviewed_queue: `queue.historical-residue-disposition`
- promotion_justified: `true`
- decision_reason:
  - `shell-thinning closeout still records accepted-history and narrow-compatibility residue`
  - `builtin-content-deprivileging closeout still records accepted-framework-baseline and later-acceptance-review residue`
  - `authoring-entrypoint-and-fail-closed-closure still records accepted-compatibility-residue and later-target-promotion-review residue`
  - `the current gap is synchronized Phase 4 residue routing, not another fresh implementation blocker`
- residue_classification:
  - `phase-4-controller`
  - `current-target-item`
- next_phase: `phase.final-acceptance`
- promoted_queue: `queue.historical-residue-disposition`

### Classification Record

- item_id: `review.first-party-mod-acceptance.2026-07-07`
- item_type: `acceptance-proof`
- classify_as: `queue-candidate`
- confidence: `high`
- matched_rules:
  - `R2`
  - `CT2`
- why:
  - `Historical residue is now synchronized in one closed Phase 4 record, no fresh implementation blocker is currently proven, and the remaining live question is whether builtin content can honestly be described as first-party mod content on the production path.`
- escalate_if:
  - `Promotion opens a bounded acceptance-proof queue rather than silently jumping to final target closeout.`
- reject_if:
  - `A fresh audit proves the target is already ready for direct final acceptance closeout, or rediscovers a concrete implementation blocker that belongs to another queue family instead.`

### Promotion Review Decision

- reviewed_queue: `queue.first-party-mod-acceptance`
- promotion_justified: `true`
- decision_reason:
  - `queue.historical-residue-disposition now provides one synchronized Phase 4 residue matrix and closes without reopening earlier implementation families`
  - `builtin default-start framing, accepted framework baseline, and accepted compatibility residue now belong to acceptance proof rather than residue discovery`
  - `the current evidence does not justify jumping directly to queue.final-acceptance-closeout before the builtin-versus-first-party production-path claim is exercised explicitly`
- residue_classification:
  - `queue-candidate`
  - `phase-4-acceptance-proof`
- next_phase: `phase.final-acceptance`
- promoted_queue: `queue.first-party-mod-acceptance`

### Classification Record

- item_id: `review.final-acceptance-closeout.2026-07-07`
- item_type: `target-closeout`
- classify_as: `queue-candidate`
- confidence: `high`
- matched_rules:
  - `R2`
  - `CT2`
- why:
  - `queue.first-party-mod-acceptance is now closed with a coherent production-path proof, no fresh implementation blocker was rediscovered, and the remaining live work is target-level acceptance reconciliation rather than another owner-line or authoring capability queue.`
- escalate_if:
  - `Promotion opens a bounded final acceptance closeout queue instead of silently marking the target done.`
- reject_if:
  - `A fresh audit proves the target can already close with no further queue record, or rediscovery of a concrete blocker requires a different queue family instead.`

### Promotion Review Decision

- reviewed_queue: `queue.final-acceptance-closeout`
- promotion_justified: `true`
- decision_reason:
  - `queue.first-party-mod-acceptance now provides a written proof that covered builtin startup/load/restore and content activation already behave on shared mod-facing production seams`
  - `the retained first-party baseline and compatibility items are now explicit disclosure material rather than hidden runtime privilege`
  - `the remaining live work is final target acceptance reconciliation, so promotion should open queue.final-acceptance-closeout instead of pretending the target is already finished`
- residue_classification:
  - `queue-candidate`
  - `phase-4-final-closeout`
- next_phase: `phase.final-acceptance`
- promoted_queue: `queue.final-acceptance-closeout`

### Classification Record

- item_id: `review.unified-contribution-intake-closeout.2026-07-06`
- item_type: `framework`
- classify_as: `current-target-item`
- confidence: `high`
- matched_rules:
  - `R1`
  - `CT1`
- why:
  - `This review directly affects current target acceptance sequencing, but the audit did not prove a new queue-worthy intake blocker outside the already-shared contribution seams.`
- escalate_if:
  - `Fresh evidence proves a still-live family-specific contribution intake path bypassing the shared contract, manifest, runtime-installation, or registry seams.`
- reject_if:
  - `Shared contribution intake remains covered by the current gameplay contribution contract, mod manifest, mod runtime contribution installation, and shared registry families.`

### Promotion Review Decision

- reviewed_queue: `queue.unified-contribution-intake-closeout`
- promotion_justified: `false`
- decision_reason:
  - `The current audit did not find a fresh family-specific intake shortcut outside the shared gameplay contribution contract.`
  - `Manifest contribution declaration already provides the shared declaration surface for the audited families.`
  - `mod-runtime contribution installation already centralizes production-path intake for the audited contribution families.`
  - `House and playable families already rely on shared registries plus explicit builtin installer seams rather than a newly-proven hidden intake fork.`
- residue_classification:
  - `historical-residue`
  - `conditional-fallback-only`
- next_phase: `phase.authoring-closure`
- next_queue_candidate: `queue.authoring-entrypoint-and-fail-closed-closure`

### Classification Record

- item_id: `review.authoring-entrypoint-and-fail-closed-closure.2026-07-06`
- item_type: `authoring`
- classify_as: `queue-candidate`
- confidence: `high`
- matched_rules:
  - `R2`
  - `CT2`
- why:
  - `The current blocker requires a new shared authoring capability and acceptance story: playable tooling is landed, but scenario-pack/default-pack/house-family authoring still depends on manual multi-point glue outside any active queue scope.`
- escalate_if:
  - `Promotion opens a new Phase 3 queue under the current target.`
- reject_if:
  - `Scenario-pack/default-pack/house-family authoring can already be completed through a shared scaffold, validator, or fail-closed framework entrypoint without opening a new queue.`

### Promotion Review Decision

- reviewed_queue: `queue.authoring-entrypoint-and-fail-closed-closure`
- promotion_justified: `true`
- decision_time_scope: `historical-promotion-basis-only`
- decision_reason:
  - `Package scripts and tools expose repository-owned scaffold and validation entrypoints for playable authoring, which means playable is no longer the first Phase 3 blocker.`
  - `Scenario-pack authoring still depends on manual directory creation, handwritten pack manifests, and catalog edits with no repository-owned scaffold or validator entrypoint.`
  - `pack-content-access still hardwires builtin zhuyuanzhang content adapters, so same-family default pack authoring is not yet routed through a framework-owned active-pack entrypoint.`
  - `Builtin house authoring still requires manual module and renderer registration edits, so the authoring path is not yet fail-closed or scaffold-driven.`
- residue_classification:
  - `queue-candidate`
  - `current-phase-blocker`
- next_phase: `phase.authoring-closure`
- promoted_queue: `queue.authoring-entrypoint-and-fail-closed-closure`

### Current Interpretation

- This promotion record explains why the queue was opened; it is not the current task truth after later queue progress.
- Playable authoring, scaffolded Phase 3 scenario-pack authoring, default-pack drift checks, and builtin house registration seeding are now treated as landed framework-owned or fail-closed coverage inside the active queue.
- Legacy builtin scenario-pack manifests that predate `phase-3-canonical-v1` are now explicit accepted compatibility residue, not fresh evidence for another scaffold queue by themselves.
- Do not promote `queue.framework-scaffold-and-template-closure` unless fresh evidence proves a still-live authoring family outside the currently-documented scaffold coverage.

### Queue Family Cards

#### `queue.core-production-integration`

- Goal:
  - `Close the still-open production owner-line decisions around engine, save, and runtime integration.`
- Current status:
  - `Closed. Use as required Phase 1 evidence.`

#### `queue.shell-thinning-and-final-ownerization`

- Goal:
  - `Remove any remaining unjustified production business orchestration from src/main.ts after runtime integration is stable.`
- Current status:
  - `Closed. Use its queue closeout record as evidence that current main.ts residue no longer justifies another shell-thinning pass by default.`

#### `queue.state-sync-and-runtime-canonicalization`

- Goal:
  - `Resolve whether remaining runtime/state-sync bridge seams are canonical production owners or transitional residue.`
- Promote when:
  - `A real production path still depends on ambiguous state-sync or runtime bridge ownership after closeout review.`

#### `queue.builtin-content-deprivileging-closeout`

- Goal:
  - `Remove or document any remaining builtin-only production privilege path that bypasses the mod-facing contract family.`
- Current status:
  - `Closed. Use its queue closeout record as evidence that the currently-proven builtin privilege paths have been removed or explicitly dispositioned.`

#### `queue.unified-contribution-intake-closeout`

- Goal:
  - `Prove that major contribution families enter through shared contracts and registries instead of hidden family-specific intake seams.`
- Promote when:
  - `A fresh audit still finds live extension families attaching through non-shared intake routes outside the established contract/registry surface.`
- Current disposition:
  - `Not promoted after the 2026-07-06 intake review. Keep as conditional fallback only if later evidence proves a fresh intake blocker.`

#### `queue.playable-family-gap-audit`

- Goal:
  - `Audit whether any still-active playable family remains outside the already-landed playable runtime foundation.`
- Promote when:
  - `Concrete evidence shows a playable family still runs on a privileged or split owner path after foundation review.`

#### `queue.authoring-entrypoint-and-fail-closed-closure`

- Goal:
  - `Prove that same-family authoring enters through framework-owned entrypoints and fails closed when artifacts are incomplete or invalid.`
- Promote when:
  - `Later review still shows authors needing undocumented multi-point glue edits to add same-family content or mechanics.`
- Current review status:
  - `Closed on 2026-07-07. Current Phase 3 authoring truth is coherent on existing evidence, so do not reopen this queue or promote queue.framework-scaffold-and-template-closure without fresh proof of a still-live same-family authoring gap.`

#### `queue.framework-scaffold-and-template-closure`

- Goal:
  - `Extend scaffold, template, validator, and CI ownership beyond the already-closed slices where that work is still needed for modularization acceptance.`
- Promote when:
  - `Fresh evidence proves the target still depends on manual file placement or undocumented artifact structure outside the currently-closed playable/scaffolded-scenario-pack/builtin-house coverage.`
  - `Accepted legacy compatibility residue alone is not enough to promote this queue.`

#### `queue.ui-runtime-contract-consumption`

- Goal:
  - `Close any remaining case where UI or presentation layers still consume runtime behavior through privileged direct knowledge instead of shared contracts.`
- Promote when:
  - `Later review proves the final modularization claim is blocked by runtime-facing UI paths that bypass the intended contract surfaces.`

#### `queue.first-party-mod-acceptance`

- Goal:
  - `Demonstrate that builtin content now behaves like first-party mod content rather than privileged framework payload on the production path.`
- Promote when:
  - `Earlier phases pass and the remaining question is acceptance proof rather than new owner-line implementation work.`
- Current review status:
  - `Closed on 2026-07-07 after queue-closeout accepted the written proof as coherent enough for final target-closeout handoff. Use as a closed Phase 4 acceptance-proof record only.`

#### `queue.historical-residue-disposition`

- Goal:
  - `Classify any remaining modularization residue into accepted history, queued migration, or explicit out-of-scope status.`
- Promote when:
  - `Earlier phases pass but the repository still has residual seams that must be dispositioned before final closeout.`
- Current review status:
  - `Closed on 2026-07-07 after the residue matrix and handoff recommendation were synchronized. Use as the Phase 4 residue routing record only.`

#### `queue.final-acceptance-closeout`

- Goal:
  - `Close the current-period complete-modularization target with synchronized acceptance records across blueprint, target, queue, and change-log artifacts.`
- Promote when:
  - `Earlier phases and any required residue disposition work have passed.`
- Current review status:
  - `Promoted on 2026-07-07 after queue.first-party-mod-acceptance closed without rediscovering a fresh implementation-family blocker. Resume execution from docs/blueprints/queues/final-acceptance-closeout-queue.md.`

### Remote Integration Rule

- When a queue task batch or queue closeout reaches a coherent verified checkpoint, emit a structured remote integration recommendation before continuing to widen local divergence.
- After merge into `mod-first-dev`, subsequent execution should resume from the integrated governance state rather than stacking more local-only progress.

### Exit Check

- [ ] The current Blueprint still has exactly one current target for this period.
- [ ] Concrete modularization work is represented through queues.
- [ ] Previously closed mod-first foundations remain treated as landed history rather than reopened controllers.
- [ ] Active queue pointers are synchronized across the Blueprint entry chain.
- [ ] The target's modularization acceptance criteria are satisfied before closeout.

### Completion Checklist

- [ ] `Control Block` updated
- [ ] `Progress Log` updated
- [ ] Queue pointers updated when the active queue changes
