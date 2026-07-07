# First-Party Mod Acceptance Queue

## Control Block

- queue_id: `queue.first-party-mod-acceptance`
- belongs_to_target: `target.project-complete-modularization`
- queue_status: `done`
- queue_class: `conditional`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- next_effect: `promote-next-queue`
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
  - `queue.final-acceptance-closeout`
- must_not_expand_into:
  - `new_runtime_or_authoring_implementation_without_fresh_evidence`
  - `content_fill_disguised_as_acceptance_work`
  - `premature_target_closeout`

## Human Context

### Phase

- Parent phase:
  - `Phase 4: Final Mod-First Acceptance`

### Queue Goal

Demonstrate that builtin content now behaves like first-party mod content on the real production path, and distinguish acceptance-proof work from any fresh blocker that would need a different queue family.

### Boundary

This queue covers:

- acceptance-proof reconciliation after residue routing has already been synchronized
- production-path review of builtin startup, builtin content activation, default-start framing, and remaining accepted compatibility/baseline residue
- queue-local records needed before `queue.final-acceptance-closeout` can be promoted honestly

This queue does not cover:

- reopening Phase 1-3 implementation queues without fresh blocker evidence
- new scaffold, runtime-owner, or registry implementation by default
- ordinary content pipeline fill under the existing mod/content contracts
- final target closeout before builtin-versus-first-party acceptance proof is written

### Parent Target

- Target owner:
  - `docs/blueprints/targets/2026-07-06-project-complete-modularization-target-v1.md`

### Closed Review Record

- Status: `done`
- Last Updated: `2026-07-07`
- Historical Summary: `The acceptance proof is now accepted as coherent enough for final handoff. This queue is closed, and its output is the promotion basis for queue.final-acceptance-closeout rather than another implementation-family reopen.`
- Closed Task:
  - `none`
- Handoff At Closure:
  - `Return control to the target. At closeout time, the promoted next queue was final-acceptance-closeout starting from baseline-reconcile.`
- Verification:
  - `Document consistency check across the closed queue, promoted queue, target, blueprint, and project-progress entries.`
- Notes:
  - `Historical residue is now input evidence to this queue, not a separate active controller.`

### Baseline Recheck

- Recheck result: `narrowed`
- Notes:
  - `The previous queue already synchronized accepted-history, accepted-framework-baseline, accepted-compatibility-residue, and later-acceptance-review residue.`
  - `Builtin startup now enters through the shared mod runtime builtin source loader (`mod.load-builtin` + `builtinModsById`) rather than direct startup-time loaded-mod construction in main.ts.`
  - `Active content assembly now consumes activationResult.normalizedContentSources through createActiveGameContentContextFromModActivation(), so the covered production content path no longer depends on a separate builtin base-pack handoff outside mod activation.`
  - `Builtin house/playable seeds remain explicit builtin registry modules, but the generic registries are no longer the hidden owner of those seeds; current evidence treats this as explicit first-party seed inventory rather than a fresh runtime blocker.`
  - `UI reserve/schema/layout registry layering still exists, but main startup/runtime does not consume ui-contract-registry on the covered production path; current ui layout bootstrap still reads explicit layout-editor baseline presets in main.ts, so this remains accepted framework baseline rather than a newly-proven runtime privilege blocker.`
  - `The remaining live question is acceptance framing around builtin default-start behavior, builtin scenario-pack menu surfacing, and accepted compatibility residue; current evidence narrows this to proof-writing rather than another implementation queue.`

### Historical Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.first-party-mod-acceptance.baseline-reconcile` | `done` | `Freeze the current acceptance-proof baseline and confirm which builtin-versus-first-party questions still belong to the current target.` | `none` | `Closed after the source-path recheck confirmed that builtin startup, activation, and active-content assembly already use shared seams, while the remaining questions narrowed to acceptance framing rather than a fresh implementation blocker.` |
| `task.first-party-mod-acceptance.production-path-acceptance-proof` | `done` | `Write the bounded proof record for whether builtin content now behaves as first-party mod content on the production path.` | `task.first-party-mod-acceptance.baseline-reconcile` | `Closed after the queue recorded which covered production paths are already same-family mod behavior, which questions remain accepted baseline or compatibility residue, and why no fresh implementation blocker is currently required.` |
| `task.first-party-mod-acceptance.queue-closeout` | `done` | `Decide whether the acceptance-proof record is coherent enough to promote queue.final-acceptance-closeout or whether a different queue family must be considered.` | `task.first-party-mod-acceptance.production-path-acceptance-proof` | `Closed after the queue accepted the written proof as coherent enough for final closeout handoff and did not rediscover a fresh implementation-family blocker.` |

### Task Definitions

#### `task.first-party-mod-acceptance.baseline-reconcile`

##### Control Block

- task_id: `task.first-party-mod-acceptance.baseline-reconcile`
- state: `done`
- task_type: `baseline-recheck`
- depends_on: []
- blocked_by: []
- priority: `high`
- scope:
  - `docs/blueprints/**`
  - `docs/change-log.md`
  - `src/main.ts`
  - `src/application/content/**`
  - `src/application/startup/**`
  - `src/core/mods/**`
  - `src/core/registry/**`
  - `tests/**`
- must_inspect:
  - `docs/blueprints/queues/historical-residue-disposition-queue.md`
  - `docs/blueprints/queues/builtin-content-deprivileging-closeout-queue.md`
  - `docs/blueprints/queues/authoring-entrypoint-and-fail-closed-closure-queue.md`
  - `src/main.ts`
  - `src/application/content/default-runtime-content.ts`
  - `src/application/startup/startup-session-coordinator.ts`
  - `src/core/mods/mod-runtime.ts`
  - `src/core/registry/**`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `phase_1_to_phase_3_closed_truth`
  - `source_level_runtime_or_authoring_implementation_by_default`
  - `target_closeout_state`
- done_when:
  - `the builtin-versus-first-party acceptance-proof scope is explicitly reconciled`
  - `the queue records whether the next step is proof writing or blocker escalation`
- verify_with:
  - `fresh_source_baseline_recheck`
- if_blocked:
  - `record blocker in queue`
  - `do not silently widen task`
- promote_next_if_done: `task.first-party-mod-acceptance.production-path-acceptance-proof`
- drift_check_required: `true`
- drift_forbidden_expansions:
  - `new_queue_promotion_without_written_basis`
  - `implementation_work_inside_baseline_without_fresh_blocker_proof`
  - `premature_final_acceptance_claim`
- drift_escalate_to:
  - `queue`
- stop_if:
  - `the remaining acceptance question cannot be distinguished from a fresh implementation blocker`

##### Human Context

- Purpose:
  - `Freeze the first-party-mod acceptance baseline after residue routing is closed, so the queue can prove the production-path claim without silently smuggling in a new implementation story.`
- Failure mode:
  - `If the audit rediscovers a real implementation blocker, stop and route it honestly instead of pretending it is still just acceptance proof.`

##### Baseline Findings

- `builtin startup path`
  - `main.ts` boots builtin content through `runModRuntime({ type: "mod.load-builtin" })` with `builtinModsById`, which keeps builtin startup on the shared mod loader seam instead of direct loaded-mod construction.`
- `active content assembly`
  - `createActiveGameContentContextFromModActivation()` now builds runtime content from `activationResult.activatedMod.normalizedContentSources`, so the covered production path no longer needs a separate builtin base-pack wiring story outside mod activation.`
- `registry ownership`
  - `builtin house` and `builtin playable` seeds still exist, but they now live in explicit builtin registry modules rather than hidden generic registry ownership; current evidence treats this as explicit first-party seed inventory, not a rediscovered runtime blocker.`
- `ui baseline`
  - `ui-contract-registry` still defines layered builtin/pack/mod/user precedence, but main startup/runtime does not consume it on the covered path and `main.ts` still boots runtime layouts from explicit layout-editor presets; this remains accepted framework baseline.`
- `remaining live acceptance questions`
  - `builtin default-start framing`
  - `builtin scenario-pack menu surfacing as first-party inventory`
  - `accepted compatibility residue around legacy builtin scenario-pack manifests`
- `baseline conclusion`
  - `No fresh implementation blocker is currently proven. The queue should now stay in bounded acceptance-proof mode and advance to task.first-party-mod-acceptance.production-path-acceptance-proof.`

#### `task.first-party-mod-acceptance.production-path-acceptance-proof`

##### Control Block

- task_id: `task.first-party-mod-acceptance.production-path-acceptance-proof`
- state: `done`
- task_type: `execution`
- depends_on:
  - `task.first-party-mod-acceptance.baseline-reconcile`
- blocked_by: []
- priority: `high`
- scope:
  - `docs/blueprints/**`
  - `docs/change-log.md`
  - `src/main.ts`
  - `src/application/content/**`
  - `src/application/startup/**`
  - `src/core/mods/**`
  - `src/core/registry/**`
  - `tests/**`
- must_inspect:
  - `docs/blueprints/queues/first-party-mod-acceptance-queue.md`
  - `docs/blueprints/queues/historical-residue-disposition-queue.md`
  - `src/main.ts`
  - `src/application/content/active-game-content.ts`
  - `src/application/startup/startup-session-coordinator.ts`
  - `src/core/mods/mod-runtime.ts`
  - `src/core/registry/**`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `phase_1_to_phase_3_closed_truth`
  - `fresh_implementation_scope_without_new_blocker_proof`
  - `target_closeout_state`
- done_when:
  - `the queue records an explicit production-path acceptance proof for builtin-as-first-party behavior`
  - `retained accepted residue is separated clearly from hidden privilege`
- verify_with:
  - `targeted_source_path_checks`
  - `document_consistency_check`
- if_blocked:
  - `record blocker in queue`
  - `do not silently widen task`
- promote_next_if_done: `task.first-party-mod-acceptance.queue-closeout`
- drift_check_required: `true`
- drift_forbidden_expansions:
  - `source_level_feature_implementation_without_fresh_basis`
  - `premature_final_acceptance_claim`
  - `queue_family_reopen_without_new_evidence`
- drift_escalate_to:
  - `queue`
- stop_if:
  - `writing the proof first requires a newly-proven implementation blocker`

##### Human Context

- Purpose:
  - `Turn the baseline findings into one explicit acceptance-proof record: what is already same-family mod-path behavior, what remains accepted baseline, and what compatibility residue must still be disclosed.`
- Failure mode:
  - `Do not overclaim that builtin content is fully identical to external mods if the remaining accepted residue still changes the honest acceptance wording.`

##### Production-Path Acceptance Record

| Acceptance Question | Current Finding | Acceptance Interpretation |
| --- | --- | --- |
| `builtin startup activation` | `main.ts` and startup-session-coordinator activate builtin startup through `runModRuntime({ type: "mod.load-builtin" })` with `builtinModsById` instead of direct startup-time loaded-mod construction. | `Covered builtin startup now enters through the same shared mod loader family as other source kinds, so this part of the production path can be described as first-party mod behavior rather than hidden builtin privilege.` |
| `saved builtin/source reload` | `activateSavedModSource()` routes builtin/file/url restores back through the shared mod runtime request family. | `Builtin reload no longer depends on a separate privileged restart path; production restore behavior is same-family across supported source kinds.` |
| `active content assembly` | `createActiveGameContentContextFromModActivation()` assembles runtime content directly from `activationResult.activatedMod.normalizedContentSources`. | `Covered runtime content bootstrap is now mod-activation-driven rather than depending on a special builtin base-pack handoff outside the activated mod story.` |
| `scenario pack startup` | `createLoadedModFromScenarioPack()` still composes `base + scenario` for scenario-pack mods, and activation preserves multi-pack normalized content sources. | `Scenario-pack startup remains compatible with the shared mod activation story; builtin base content is functioning as first-party base inventory, not as a hidden alternate runtime path.` |
| `builtin house/playable seeds` | `Builtin` seeds still exist, but now live in explicit builtin registry modules instead of hidden generic registry ownership. | `These seeds remain explicit first-party inventory and must be disclosed as such, but current evidence does not show them bypassing the covered runtime/activation contract family.` |
| `builtin default-start behavior` | `defaultStart` still participates in startup profile framing for loaded mods, and builtin default startup remains the repository's first-party boot profile.` | `This is still a live acceptance wording question: builtin default-start is no longer a fresh implementation blocker, but final acceptance must describe it honestly as first-party boot inventory rather than pretending there is no first-party baseline at all.` |
| `builtin scenario-pack surfacing` | `builtInScenarioPacks` still seed the main menu's builtin scenario inventory.` | `This remains explicit first-party inventory surfacing, not a newly-proven runtime privilege path; later closeout must disclose that repository-owned first-party scenario inventory still exists as content supply, even though runtime activation follows shared seams.` |
| `ui reserve/layout baseline` | `ui-contract-registry` layering still exists, but covered main startup/runtime does not consume it and runtime layouts still bootstrap from explicit layout-editor presets in `main.ts`. | `This remains accepted framework baseline rather than evidence that builtin content still owns a hidden runtime privilege path on the covered production line.` |
| `legacy builtin scenario-pack manifests` | `Pre-phase-3-canonical-v1` builtin manifests remain on an explicit compatibility path. | `This remains accepted compatibility residue that must be disclosed in final acceptance wording, not a basis to reopen Phase 3 or deny the current proof record.` |

##### Proof Conclusion

- `same-family production-path behavior already proven`
  - `builtin startup activation`
  - `builtin saved/source reload`
  - `active content assembly from normalized activation content sources`
  - `scenario-pack activation on the shared mod runtime path`
- `still retained as accepted baseline or residue`
  - `builtin default-start framing`
  - `builtin scenario inventory surfacing in the menu`
  - `ui reserve/layout baseline outside the covered runtime path`
  - `legacy builtin scenario-pack compatibility manifests`
- `proof decision`
  - `The queue can now describe covered builtin runtime behavior as first-party mod-path behavior with explicit first-party inventory and accepted residue caveats.`
  - `No fresh implementation blocker is currently proven by this proof record.`
  - `The next justified step is queue-closeout, not reopening Phase 1-3 queue families.`

#### `task.first-party-mod-acceptance.queue-closeout`

##### Control Block

- task_id: `task.first-party-mod-acceptance.queue-closeout`
- state: `done`
- task_type: `closeout`
- depends_on:
  - `task.first-party-mod-acceptance.production-path-acceptance-proof`
- blocked_by: []
- priority: `medium`
- scope:
  - `docs/blueprints/**`
  - `docs/change-log.md`
- must_inspect:
  - `docs/blueprints/**`
  - `docs/change-log.md`
- must_not_change:
  - `phase_1_to_phase_3_closed_truth`
  - `unproven_target_acceptance_claims`
- done_when:
  - `the queue records whether the acceptance proof is coherent enough to promote final acceptance closeout`
  - `target and blueprint pointers are synchronized on the queue outcome`
- verify_with:
  - `document_consistency_check`
- if_blocked:
  - `record blocker in queue`
  - `do not silently widen task`
- promote_next_if_done: `none`
- drift_check_required: `true`
- drift_forbidden_expansions:
  - `fresh_runtime_or_authoring_implementation_without_new_evidence`
  - `final_target_closeout_without_written_handoff`
- drift_escalate_to:
  - `target`
- stop_if:
  - `the acceptance proof cannot be stated honestly enough for queue-level handoff`

##### Human Context

- Purpose:
  - `Turn the proof record into a queue-level promotion decision: either hand off into queue.final-acceptance-closeout or state the precise blocker that still prevents that handoff.`
- Failure mode:
  - `Do not confuse "proof written" with "target accepted"; queue-closeout still has to judge whether the proof is coherent enough for final closeout promotion.`

##### Closeout Finding

- `handoff decision`
  - `The written proof is coherent enough to promote queue.final-acceptance-closeout. Covered builtin startup/load/restore and active-content assembly already run on shared mod-facing production seams, while the remaining first-party baseline and compatibility items are explicitly disclosed rather than hidden as runtime privilege.`
- `what did not happen`
  - `The queue did not rediscover a fresh Phase 1-3 implementation blocker, and it did not justify reopening queue.framework-scaffold-and-template-closure, queue.ui-runtime-contract-consumption, or another new implementation queue family.`
- `required honesty for next queue`
  - `Final acceptance closeout must still state that first-party boot inventory, builtin scenario inventory surfacing, accepted UI baseline, and legacy builtin manifest compatibility remain disclosed baseline/residue rather than claiming builtin and external mods are identical in every repository-owned framing detail.`

## Historical Handoff Note

- Task ID:
  - `none`
- Recorded handoff at closure:
  - `None. Queue closeout has already promoted queue.final-acceptance-closeout as the next legal controller.`
- Recorded expected output:
  - `Use this queue as the closed Phase 4 acceptance-proof record.`

## Closeout Decision

- queue_id: `queue.first-party-mod-acceptance`
- closeout_status: `done`
- verification_status: `passed`
- residue_remaining: `yes`
- residue_classification:
  - `accepted-history`
  - `accepted-framework-baseline`
  - `accepted-compatibility-residue`
  - `later-acceptance-review`
- next_queue_recommendation: `queue.final-acceptance-closeout`
- promotion_justified: `true`
- evidence:
  - `queue.historical-residue-disposition already closed with a synchronized Phase 4 residue matrix`
  - `production-path acceptance proof now records which covered builtin paths already behave as first-party mod-path runtime and which items remain disclosed baseline or compatibility residue`
  - `queue-closeout did not rediscover a fresh implementation-family blocker, so the remaining legal work is final acceptance closeout rather than another acceptance-proof or implementation queue`

## State Transition Rules

1. A `queued` task becomes `active` only after the prior task records its queue-local truth.
2. A `blocked` task must record its blocker in the queue.
3. A `dropped` task must record why it was removed instead of disappearing silently.
4. A closed queue must either promote `queue.final-acceptance-closeout` or state clearly which fresh blocker prevented that handoff.

## Progress Log

- 2026-07-07
  - Summary: `Promoted queue.first-party-mod-acceptance after queue.historical-residue-disposition closed with a synchronized residue matrix and no fresh implementation blocker, leaving builtin-versus-first-party production-path acceptance proof as the remaining live Phase 4 question.`
  - Verification: `Document consistency check across the promotion handoff, new queue record, target, blueprint, and project-progress entries`
  - Next at that time: `Start baseline-reconcile.`
- 2026-07-07
  - Summary: `Closed baseline-reconcile after the source-path audit confirmed that builtin startup now uses the shared builtin mod loader, active-content assembly consumes activationResult content sources directly, UI reserve layering remains off the covered startup/runtime path, and the remaining Phase 4 work is bounded acceptance proof rather than a fresh implementation blocker.`
  - Verification: `Targeted source-path audit across main.ts, startup-session-coordinator, active-game-content, mod-runtime, builtin registry modules, ui-contract-registry, and robustness coverage`
  - Next at that time: `Start production-path-acceptance-proof.`
- 2026-07-07
  - Summary: `Closed production-path-acceptance-proof after recording the explicit acceptance matrix: builtin startup/load/restore and active-content assembly now count as same-family mod-path behavior on the covered production line, while builtin default-start framing, builtin scenario inventory surfacing, UI reserve baseline, and legacy builtin manifests remain disclosed baseline or compatibility residue rather than fresh implementation blockers.`
  - Verification: `Targeted source-path audit plus document consistency check across the queue, target, blueprint, and project-progress entries`
  - Next at that time: `Start queue-closeout.`
- 2026-07-07
  - Summary: `Accepted queue-closeout and closed queue.first-party-mod-acceptance after the written proof established that the remaining first-party baseline and compatibility caveats belong to final disclosure rather than another implementation-family reopen, so the honest next controller is queue.final-acceptance-closeout.`
  - Verification: `Document consistency check across the closed queue, promoted queue, target, blueprint, and project-progress entries`
  - Next at that time: `Promote queue.final-acceptance-closeout and start baseline-reconcile.`
