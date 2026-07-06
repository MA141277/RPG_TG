# Authoring Entrypoint And Fail-Closed Closure Queue

## Control Block

- queue_id: `queue.authoring-entrypoint-and-fail-closed-closure`
- belongs_to_target: `target.project-complete-modularization`
- status: `active`
- queue_class: `conditional`
- active_task: `task.authoring-entrypoint-and-fail-closed-closure.scenario-pack-and-default-pack-entrypoint-closure`
- next_task: `task.authoring-entrypoint-and-fail-closed-closure.house-family-authoring-entrypoint-closure`
- allowed_task_states:
  - `candidate`
  - `queued`
  - `active`
  - `blocked`
  - `done`
  - `dropped`
- blocked_by: []
- allowed_item_classifications:
  - `current-target-item`
  - `historical-residue`
- reject_item_classifications:
  - `content-pipeline-item`
  - `asset-pipeline-item`
  - `future-target-candidate`
  - `out-of-scope`
- promotion_gate:
  - `baseline_recheck_complete`
  - `task_dependencies_satisfied`
- closeout_gate:
  - `all_required_tasks_done_or_dropped`
  - `queue_closeout_note_written`
  - `verification_recorded`
- promote_next_queue_candidates:
  - `queue.framework-scaffold-and-template-closure`
  - `queue.first-party-mod-acceptance`
- must_not_expand_into:
  - `reopening_phase_2_contribution_intake_work`
  - `ordinary_content_fill_under_existing_schema`
  - `premature_final_acceptance_proof`

## Human Context

### Phase

- Parent phase:
  - `Phase 3: Authoring Closure`

### Queue Goal

Prove that same-family content and mechanic authoring enters through framework-owned entrypoints and fail-closed guards rather than undocumented directory conventions, manual multi-point registry edits, or builtin-only adapter rewiring.

### Boundary

This queue covers:

- a fresh authoring baseline across playable, scenario-pack, default-pack-content, and house family authoring surfaces
- shared scaffold, validator, and fail-closed entrypoint closure where current target acceptance still depends on manual multi-point glue
- queue closeout records needed to roll Phase 3 authoring truth back into the current modularization target

This queue does not cover:

- ordinary content or asset fill work under an already-supported scaffold
- reopening Phase 2 contribution-intake closure unless a fresh runtime intake blocker is proven
- broad UI redesign or presenter redesign with no authoring-governance impact
- final mod-first acceptance proof before authoring residue is closed

### Parent Target

- Target spec:
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
- Target plan:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`

### Execution State

- Status: `in-progress`
- Last Updated: `2026-07-06`
- Current Focus: `The target-level Phase 3 audit confirmed that playable authoring already has scaffold and validator entrypoints, but scenario-pack/default-pack/house-family authoring still relies on manual directory, catalog, builtin adapter, and registration edits with no shared fail-closed authoring path.`
- Active Task:
  - `task.authoring-entrypoint-and-fail-closed-closure.scenario-pack-and-default-pack-entrypoint-closure`
- Next Step:
  - `Define the first bounded implementation slice that removes manual scenario-pack/default-pack authoring glue and adds an explicit fail-closed entrypoint or validator seam.`
- Verification:
  - `Fresh source audit across package scripts, tools/, scenario-pack loader/catalog loader, pack-content-access, house registries, and robustness coverage.`
- Notes:
  - `Playable scaffold/validator/CI is now treated as landed Phase 3 evidence, not the first blocker.`

### Baseline Recheck

- Recheck result: `narrowed`
- Notes:
  - `Playable authoring already has repository-owned entrypoints through tools/scaffold-playable.mjs, tools/scaffold-playable-integration.mjs, tools/validate-playables.mjs, package scripts, and CI coverage.`
  - `Scenario-pack authoring still relies on manual directory creation, hand-written pack.json and catalog.json edits, and runtime loader validation only; no repository-owned scenario scaffold or validator entrypoint exists yet.`
  - `Default builtin pack content adapters in src/content/pack-content-access.ts still hardwire zhuyuanzhang JSON file imports, which means same-family house/text/activity authoring is not yet routed through an active-pack-aware framework entrypoint.`
  - `Builtin house authoring still requires manual edits to builtin-house-module-registrations.ts and builtin-house-module-renderers.ts, so adding a same-family builtin house module is not yet fail-closed or scaffold-driven.`
  - `The current blocker is authoring-entrypoint ownership, not contribution intake: the shared runtime seams already exist, but authors still need manual multi-point glue to enter them.`

### Current Queue

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.authoring-entrypoint-and-fail-closed-closure.baseline-reconcile` | `done` | `Freeze the current authoring baseline and classify which families already have framework-owned entrypoints versus which still depend on manual glue.` | `none` | `Closed by classifying playable as landed evidence and scenario-pack/default-pack/house-family authoring as the first justified blocker set.` |
| `task.authoring-entrypoint-and-fail-closed-closure.scenario-pack-and-default-pack-entrypoint-closure` | `active` | `Close the manual scenario-pack catalog/manifest/default-pack authoring path by introducing a framework-owned entrypoint or validator story.` | `task.authoring-entrypoint-and-fail-closed-closure.baseline-reconcile` | `First active task because current scenario-pack/default-pack authoring still depends on manual directory, catalog, and builtin adapter glue.` |
| `task.authoring-entrypoint-and-fail-closed-closure.house-family-authoring-entrypoint-closure` | `queued` | `Reduce builtin house-family authoring from manual registration and renderer edits to an explicit shared authoring seam or recorded fail-closed policy.` | `task.authoring-entrypoint-and-fail-closed-closure.scenario-pack-and-default-pack-entrypoint-closure` | `Defer until scenario/default-pack authoring direction is explicit.` |
| `task.authoring-entrypoint-and-fail-closed-closure.shared-fail-closed-policy-closeout` | `queued` | `Close the remaining validator/template/fail-closed policy residue that still leaves same-family authoring underspecified.` | `task.authoring-entrypoint-and-fail-closed-closure.house-family-authoring-entrypoint-closure` | `Only execute after concrete authoring entrypoint slices are narrowed.` |
| `task.authoring-entrypoint-and-fail-closed-closure.queue-closeout` | `queued` | `Re-evaluate whether Phase 3 authoring closure is satisfied or whether a narrower follow-up queue is still needed.` | `task.authoring-entrypoint-and-fail-closed-closure.shared-fail-closed-policy-closeout` | `Close only after queue evidence can explain same-family authoring without manual glue.` |

### Task Definitions

#### `task.authoring-entrypoint-and-fail-closed-closure.baseline-reconcile`

##### Control Block

- task_id: `task.authoring-entrypoint-and-fail-closed-closure.baseline-reconcile`
- state: `done`
- task_type: `baseline-recheck`
- depends_on: []
- blocked_by: []
- priority: `high`
- scope:
  - `package.json`
  - `tools/**`
  - `src/application/content/**`
  - `src/application/scenario/**`
  - `src/content/pack-content-access.ts`
  - `src/application/house-modules/**`
  - `src/core/registry/**`
  - `src/ui/views/house/**`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `package.json`
  - `tools/**`
  - `src/application/content/catalog-loader.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/content/pack-content-access.ts`
  - `src/application/house-modules/builtin-house-module-registrations.ts`
  - `src/ui/views/house/builtin-house-module-renderers.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `phase_2_runtime_and_intake_scope`
  - `final_acceptance_scope`
- done_when:
  - `the current authoring families are classified into landed entrypoints versus real Phase 3 blockers`
  - `the first justified task order is recorded`
- verify_with:
  - `fresh_source_baseline_recheck`
- if_blocked:
  - `record blocker in queue`
  - `do not silently widen task`
- promote_next_if_done: `task.authoring-entrypoint-and-fail-closed-closure.scenario-pack-and-default-pack-entrypoint-closure`
- drift_check_required: `true`
- drift_forbidden_expansions:
  - `content_fill_disguised_as_framework_work`
  - `reopening_contribution_intake_without_new_evidence`
- drift_escalate_to:
  - `queue`
- stop_if:
  - `the authoring blocker cannot be distinguished from ordinary content pipeline work`

##### Human Context

- Purpose:
  - `Freeze the queue starting truth and separate landed playable authoring infrastructure from the still-manual scenario/default-pack/house-family authoring paths.`
- Failure mode:
  - `Do not treat every missing template as a queue blocker; only record blockers that affect same-family modular authoring acceptance.`

#### `task.authoring-entrypoint-and-fail-closed-closure.scenario-pack-and-default-pack-entrypoint-closure`

##### Control Block

- task_id: `task.authoring-entrypoint-and-fail-closed-closure.scenario-pack-and-default-pack-entrypoint-closure`
- state: `active`
- task_type: `execution`
- depends_on:
  - `task.authoring-entrypoint-and-fail-closed-closure.baseline-reconcile`
- blocked_by: []
- priority: `high`
- scope:
  - `package.json`
  - `tools/**`
  - `src/application/content/**`
  - `src/application/scenario/**`
  - `src/content/scenario-packs/**`
  - `src/content/pack-content-access.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `package.json`
  - `tools/**`
  - `src/application/content/catalog-loader.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/content/scenario-packs/catalog.json`
  - `src/content/pack-content-access.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `house_family_registry_scope`
  - `runtime_owner_line_scope`
- done_when:
  - `scenario-pack and default-pack authoring no longer depends on undocumented manual catalog or builtin adapter glue for the covered same-family path`
  - `a shared scaffold, validator, or fail-closed contract exists for the covered authoring slice`
- verify_with:
  - `targeted_source_path_checks`
  - `npm test`
- if_blocked:
  - `record blocker in queue`
  - `do not silently widen task`
- promote_next_if_done: `task.authoring-entrypoint-and-fail-closed-closure.house-family-authoring-entrypoint-closure`
- drift_check_required: `true`
- drift_forbidden_expansions:
  - `full_content_pipeline_redesign`
  - `runtime_intake_reclassification_without_new_evidence`
- drift_escalate_to:
  - `queue`
- stop_if:
  - `the task requires a different queue family such as broader scaffold-and-template closure`

##### Human Context

- Purpose:
  - `Close the first Phase 3 blocker family by giving scenario/default-pack authors a framework-owned entrypoint and fail-closed path instead of manual directory, pack, catalog, and builtin adapter edits.`
- Failure mode:
  - `Do not stop at loader-time runtime parsing; the task closes only if authoring itself becomes framework-owned or explicitly fail-closed before runtime.`

#### `task.authoring-entrypoint-and-fail-closed-closure.house-family-authoring-entrypoint-closure`

##### Control Block

- task_id: `task.authoring-entrypoint-and-fail-closed-closure.house-family-authoring-entrypoint-closure`
- state: `queued`
- task_type: `execution`
- depends_on:
  - `task.authoring-entrypoint-and-fail-closed-closure.scenario-pack-and-default-pack-entrypoint-closure`
- blocked_by: []
- priority: `high`
- scope:
  - `src/application/house-modules/**`
  - `src/ui/views/house/**`
  - `src/core/registry/**`
  - `docs/special-house-interface.md`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `src/application/house-modules/builtin-house-module-registrations.ts`
  - `src/ui/views/house/builtin-house-module-renderers.ts`
  - `src/core/registry/builtin-house-module-registry.ts`
  - `docs/special-house-interface.md`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `new_house_business_scope`
  - `playable_runtime_scope`
- done_when:
  - `covered builtin house authoring no longer requires undocumented multi-point module and renderer registration edits`
  - `the retained authoring contract is explicit and fail-closed`
- verify_with:
  - `targeted_source_path_checks`
  - `npm test`
- if_blocked:
  - `record blocker in queue`
  - `do not silently widen task`
- promote_next_if_done: `task.authoring-entrypoint-and-fail-closed-closure.shared-fail-closed-policy-closeout`
- drift_check_required: `true`
- drift_forbidden_expansions:
  - `new_house_feature_development`
  - `broad_ui_house_redesign`
- drift_escalate_to:
  - `queue`
- stop_if:
  - `house authoring closure requires a broader framework scaffold queue`

##### Human Context

- Purpose:
  - `Reduce same-family builtin house authoring from manual registration arrays to an explicit shared authoring seam or recorded fail-closed governance path.`
- Failure mode:
  - `Do not treat one more manual registration file as an entrypoint; the result must actually reduce authoring glue or stop and record why it cannot.`

#### `task.authoring-entrypoint-and-fail-closed-closure.shared-fail-closed-policy-closeout`

##### Control Block

- task_id: `task.authoring-entrypoint-and-fail-closed-closure.shared-fail-closed-policy-closeout`
- state: `queued`
- task_type: `execution`
- depends_on:
  - `task.authoring-entrypoint-and-fail-closed-closure.house-family-authoring-entrypoint-closure`
- blocked_by: []
- priority: `medium`
- scope:
  - `package.json`
  - `tools/**`
  - `docs/blueprints/**`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `package.json`
  - `tools/**`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `final_acceptance_scope`
  - `future_target_expansion`
- done_when:
  - `remaining Phase 3 authoring residue is either normalized into shared fail-closed policy or explicitly handed off`
  - `the queue can explain which authoring families are now framework-owned and which are accepted residue`
- verify_with:
  - `targeted_source_path_checks`
  - `npm test`
- if_blocked:
  - `record blocker in queue`
  - `do not silently widen task`
- promote_next_if_done: `task.authoring-entrypoint-and-fail-closed-closure.queue-closeout`
- drift_check_required: `true`
- drift_forbidden_expansions:
  - `arbitrary_template_bloat`
  - `non_modular_tooling_work`
- drift_escalate_to:
  - `queue`
- stop_if:
  - `the remaining residue belongs to a narrower scaffold-and-template queue instead`

##### Human Context

- Purpose:
  - `Close the remaining Phase 3 validator/template/fail-closed policy residue without inflating the queue into unrelated tooling work.`
- Failure mode:
  - `Do not turn the queue into generic tooling cleanup; only close the policy seams that still block same-family modular authoring acceptance.`

#### `task.authoring-entrypoint-and-fail-closed-closure.queue-closeout`

##### Control Block

- task_id: `task.authoring-entrypoint-and-fail-closed-closure.queue-closeout`
- state: `queued`
- task_type: `closeout`
- depends_on:
  - `task.authoring-entrypoint-and-fail-closed-closure.shared-fail-closed-policy-closeout`
- blocked_by: []
- priority: `medium`
- scope:
  - `docs/blueprints/**`
  - `docs/change-log.md`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `docs/blueprints/**`
  - `docs/change-log.md`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `phase_4_final_acceptance_scope`
  - `new_runtime_owner_lines`
- done_when:
  - `the queue records whether Phase 3 is satisfied or whether a narrower follow-up queue is justified`
  - `target and blueprint pointers are synchronized on the queue outcome`
- verify_with:
  - `document_consistency_check`
  - `npm test`
- if_blocked:
  - `record blocker in queue`
  - `do not silently widen task`
- promote_next_if_done: `none`
- drift_check_required: `true`
- drift_forbidden_expansions:
  - `queue_reopen_without_new_evidence`
  - `final_acceptance_claim_without_closeout`
- drift_escalate_to:
  - `target`
- stop_if:
  - `phase_3_acceptance cannot be stated honestly yet`

##### Human Context

- Purpose:
  - `Turn the queue result into a target-level Phase 3 authoring decision and either close the phase or hand off only the remaining justified residue.`
- Failure mode:
  - `Do not close the queue just because documentation exists; it closes only if same-family authoring truth is actually coherent.`

## Next Executable Task

- Task ID:
  - `task.authoring-entrypoint-and-fail-closed-closure.scenario-pack-and-default-pack-entrypoint-closure`
- Required action before promotion:
  - `Use the baseline record to narrow the first scenario/default-pack authoring slice, then implement only the smallest shared entrypoint or fail-closed seam that changes the authoring story.`
- Expected output:
  - `A bounded implementation plan or landed change set that removes manual scenario/default-pack authoring glue from the first covered family.`

## Candidate Backlog

- `task.authoring-entrypoint-and-fail-closed-closure.playable-authoring-recheck`
  - State:
    - `candidate`
  - Reason:
    - `Playable authoring is currently treated as landed evidence, but a later queue task may need to recheck whether the playable scaffold should be generalized rather than remain family-specific.`
  - Promote when:
    - `later queue work proves playable tooling cannot stay as the accepted baseline for same-family authoring`
  - Reject when:
    - `playable scaffold/validator remains sufficient and does not block Phase 3 acceptance`
  - Required evidence:
    - `fresh_authoring_gap_recheck`

## Closeout Decision

- queue_id: `queue.authoring-entrypoint-and-fail-closed-closure`
- closeout_status: `in-progress`
- verification_status: `source-audit-only`
- residue_remaining: `yes`
- residue_classification:
  - `current-phase-blocker`
- next_queue_recommendation: `none`
- promotion_justified: `true`
- evidence:
  - `package scripts only expose playable scaffold and validation entrypoints`
  - `scenario-pack authoring still depends on manual catalog and manifest assembly`
  - `pack-content-access still hardwires builtin zhuyuanzhang default content adapters`
  - `builtin house authoring still requires manual registration and renderer array edits`

## State Transition Rules

1. A `queued` task becomes `active` only after a baseline recheck.
2. A `blocked` task must record its blocker in the queue.
3. A `dropped` task must record why it was removed instead of disappearing silently.
4. A closed queue must remain historical truth until a new promotion record says otherwise.

## Progress Log

- 2026-07-06
  - Summary: `Queue created and promoted after the Phase 3 target audit confirmed that playable authoring already has scaffold/validator/CI coverage, but scenario-pack/default-pack/house-family authoring still depends on manual multi-point glue with no shared fail-closed entrypoint.`
  - Verification: `Fresh source audit across package scripts, tools/, scenario-pack loader/catalog loader, pack-content-access, house registries, and robustness coverage`
  - Next: `Resume the active queue from scenario-pack-and-default-pack-entrypoint-closure.`
