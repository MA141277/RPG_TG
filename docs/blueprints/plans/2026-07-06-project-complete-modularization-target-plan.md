# Project Complete Modularization Target Plan

## Control Block

- document_role: `target-governor`
- target_id: `target.project-complete-modularization`
- status: `in-progress`
- active_phase: `phase.authoring-closure`
- active_queue: `queue.authoring-entrypoint-and-fail-closed-closure`
- active_task: `task.authoring-entrypoint-and-fail-closed-closure.scenario-pack-and-default-pack-entrypoint-closure`
- decision_state: `active-execution`
- next_decision: `deferred-until-queue-closeout`
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
- Last Updated: `2026-07-06`
- Current Focus: `The first formal target for this period remains project complete modularization. Phase 3 authoring closure is now active through authoring-entrypoint-and-fail-closed-closure because the latest audit confirmed that scenario-pack/default-pack/house-family authoring still depends on manual multi-point glue.`
- Next Step: `Resume the active Phase 3 queue from task.authoring-entrypoint-and-fail-closed-closure.scenario-pack-and-default-pack-entrypoint-closure.`
- Verification: `Document consistency check plus historical roadmap recheck`
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
  - `Promoted. Resume execution from docs/blueprints/queues/authoring-entrypoint-and-fail-closed-closure-queue.md.`

#### `queue.framework-scaffold-and-template-closure`

- Goal:
  - `Extend scaffold, template, validator, and CI ownership beyond the already-closed slices where that work is still needed for modularization acceptance.`
- Promote when:
  - `The target still depends on manual file placement or undocumented artifact structure outside the currently-closed scaffold coverage.`

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

#### `queue.historical-residue-disposition`

- Goal:
  - `Classify any remaining modularization residue into accepted history, queued migration, or explicit out-of-scope status.`
- Promote when:
  - `Earlier phases pass but the repository still has residual seams that must be dispositioned before final closeout.`

#### `queue.final-acceptance-closeout`

- Goal:
  - `Close the current-period complete-modularization target with synchronized acceptance records across blueprint, target, queue, and change-log artifacts.`
- Promote when:
  - `Earlier phases and any required residue disposition work have passed.`

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
