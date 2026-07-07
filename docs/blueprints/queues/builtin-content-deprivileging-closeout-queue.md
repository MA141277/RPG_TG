# Builtin Content Deprivileging Closeout Queue

## Control Block

- queue_id: `queue.builtin-content-deprivileging-closeout`
- belongs_to_target: `target.project-complete-modularization`
- queue_status: `done`
- queue_class: `required`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- next_effect: `return-to-target-review`
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
  - `queue.unified-contribution-intake-closeout`
  - `queue.first-party-mod-acceptance`
- must_not_expand_into:
  - `reopening_phase_1_runtime_ownerization`
  - `broad_authoring_template_work`
  - `premature_final_acceptance_proof`

## Human Context

### Phase

- Parent phase:
  - `Phase 2: Contribution Closure`

### Queue Goal

Remove or explicitly disposition the remaining builtin-only production privilege paths so builtin-first-party content can be described as entering through the same contract and registry family as mod-facing content on the real production path.

### Boundary

This queue covers:

- fresh baseline reconciliation against builtin-only production privilege paths across registries, startup activation, content bootstrap, and UI reserve layering
- deprivileging or explicitly classifying builtin-only shortcuts that still bypass the mod-facing contract family
- closeout records needed to roll this Phase 2 queue back into the current modularization target

This queue does not cover:

- reopening Phase 1 runtime ownership work that is already closed
- broad authoring/template/scaffold work that belongs to Phase 3
- proving every contribution family is unified if the remaining issue is specifically builtin privilege rather than family intake shape
- final first-party-mod acceptance proof before builtin privilege residue is actually closed

### Parent Target

- Target owner:
  - `docs/blueprints/targets/2026-07-06-project-complete-modularization-target-v1.md`

### Closed Review Record

- Status: `done`
- Last Updated: `2026-07-06`
- Historical Summary: `The queue is now closed. Registry/startup/base-pack consumer privilege was removed or normalized onto shared seams, and the remaining UI reserve/layout baseline was dispositioned as accepted framework baseline because it does not currently enter the main startup/runtime path through ui-contract-registry.`
- Closed Task:
  - `none`
- Handoff At Closure:
  - `Return control to the v1 target and decide whether a new Phase 2 queue such as unified-contribution-intake-closeout is actually justified by fresh intake evidence, or whether builtin privilege work remains closed until later acceptance review.`
- Verification:
  - `Fresh source-path audit, targeted builtin/UI reserve regressions, document consistency check, and npm test.`
- Notes:
  - `This queue closed without promoting ui-framework-baseline-disposition or first-party-default-start-disposition because neither remaining question currently proves a live builtin-only production privilege blocker on the covered path.`

### Baseline Recheck

- Recheck result: `narrowed`
- Notes:
  - `Current blocker: builtin house modules still enter production through static builtin registrations in src/core/registry/house-module-registry.ts via builtin-house-module-registrations and builtin-house-module-renderers rather than through one first-party mod-family installation seam.`
  - `Current blocker: covered playable families still ship through static builtin definition and integration arrays in src/core/registry/playable-definition-registry.ts and src/core/registry/playable-integration-registry.ts, which leaves builtin-first playables privileged at the registry seed layer.`
  - `Current blocker: startup still has a hardwired builtin-default activation path through activateBuiltinDefaultMod(), while createBaseGameContentPack() still resolves one default zhuyuanzhang manifest as the privileged base pack for active content bootstrap.`
  - `Accepted-for-now baseline, not first blocker: UI reserve, screen schema, layout preset, skin preset, and asset catalog layering still treats builtin as an always-preloaded baseline in src/content/ui/** and src/application/ui/ui-contract-registry.ts, but this currently looks closer to explicit framework baseline than hidden contribution intake unless later tasks prove otherwise.`
  - `Closeout audit result: main.ts still constructs active uiLayouts directly from src/content/layout-editor-presets.ts, while the reserve family in src/application/ui/ui-contract-registry.ts and src/content/ui/** remains off the main startup/runtime path; this keeps UI reserve layering classified as explicit framework/editor baseline rather than a live builtin privilege consumer.`
  - `The mod runtime already supports builtin/file/url source kinds and builtin source loading through builtinModsById, which means this queue should prefer converging builtin-first-party paths onto existing mod-facing seams instead of inventing a new family.`
  - `builtInScenarioPacks and scenario-pack catalog publication currently read as discovery surface rather than the first builtin privilege blocker, because they do not themselves install runtime capabilities into production ownership paths.`
  - `Closeout direction from baseline-reconcile: tackle registry seeds and startup loader privilege first, then revisit active content and UI consumers only where they still depend on those builtin-specific assumptions.`

### Historical Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.builtin-content-deprivileging-closeout.baseline-reconcile` | `done` | `Freeze the builtin privilege baseline and classify which shortcuts are true blockers versus acceptable framework baseline.` | `none` | `Closed by classifying registry seeds, startup direct builtin activation, and base-pack bootstrap as current blockers; UI reserve layering remains accepted-for-now framework baseline pending later proof.` |
| `task.builtin-content-deprivileging-closeout.builtin-registry-and-loader-audit` | `done` | `Resolve builtin registry seeding and builtin source loading shortcuts that still hide a privileged production intake line.` | `task.builtin-content-deprivileging-closeout.baseline-reconcile` | `Closed after builtin startup activation and builtin house/playable registry seeds moved onto explicit shared seams.` |
| `task.builtin-content-deprivileging-closeout.runtime-consumer-deprivileging` | `done` | `Rework or explicitly classify production consumers that still assume builtin-preloaded content or UI reserve layers.` | `task.builtin-content-deprivileging-closeout.builtin-registry-and-loader-audit` | `Closed after active-content/bootstrap stopped requiring separate builtin base-pack handoff and the remaining UI reserve layering was reclassified as inactive-on-runtime framework baseline.` |
| `task.builtin-content-deprivileging-closeout.queue-closeout` | `done` | `Re-evaluate whether builtin-first-party content now has a coherent same-family production story or whether a later Phase 2 queue must be promoted.` | `task.builtin-content-deprivileging-closeout.runtime-consumer-deprivileging` | `Closed after the residue audit found no current need to keep this queue active or to promote a narrower builtin-only follow-up queue immediately.` |

### Task Definitions

#### `task.builtin-content-deprivileging-closeout.baseline-reconcile`

##### Control Block

- task_id: `task.builtin-content-deprivileging-closeout.baseline-reconcile`
- state: `done`
- task_type: `baseline-recheck`
- depends_on: []
- blocked_by: []
- priority: `high`
- scope:
  - `src/main.ts`
  - `src/core/registry/**`
  - `src/core/mods/**`
  - `src/application/startup/**`
  - `src/application/content/**`
  - `src/application/ui/**`
- must_inspect:
  - `src/main.ts`
  - `src/core/registry/**`
  - `src/core/mods/**`
  - `src/application/startup/**`
  - `src/application/content/**`
  - `src/application/ui/**`
- must_not_change:
  - `phase_1_runtime_ownerization_scope`
  - `phase_3_authoring_scope`
- done_when:
  - `builtin-only privilege residue is classified into real production blockers versus acceptable framework baseline`
  - `the first justified blocker order is recorded`
- verify_with:
  - `fresh_source_baseline_recheck`
- if_blocked:
  - `record blocker in queue`
  - `do not silently widen task`
- promote_next_if_done: `task.builtin-content-deprivileging-closeout.builtin-registry-and-loader-audit`
- drift_check_required: `true`
- drift_forbidden_expansions:
  - `broad_authoring_or_template_cleanup`
  - `family_intake_audit_without_builtin_privilege_anchor`
- drift_escalate_to:
  - `queue`
- stop_if:
  - `the queue can no longer distinguish builtin privilege from a broader contribution-intake problem`

##### Human Context

- Purpose:
  - `Freeze the queue's starting truth against the current codebase and classify builtin-only privilege residue into real production blockers versus acceptable framework baseline.`
- Failure mode:
  - `If the queue cannot distinguish builtin privilege from broader intake or authoring work, mark the task blocked and record the ambiguous boundary instead of widening the queue blindly.`

#### `task.builtin-content-deprivileging-closeout.builtin-registry-and-loader-audit`

##### Control Block

- task_id: `task.builtin-content-deprivileging-closeout.builtin-registry-and-loader-audit`
- state: `done`
- task_type: `execution`
- depends_on:
  - `task.builtin-content-deprivileging-closeout.baseline-reconcile`
- blocked_by: []
- priority: `high`
- scope:
  - `src/core/registry/**`
  - `src/core/mods/**`
  - `src/application/startup/startup-session-coordinator.ts`
  - `src/main.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `src/core/registry/**`
  - `src/core/mods/**`
  - `src/application/startup/startup-session-coordinator.ts`
  - `src/main.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `phase_1_owner_lines`
  - `broad_runtime_consumer_scope`
- done_when:
  - `covered registry and startup source seams can be explained as first-party mod-family intake`
  - `retained privilege, if any, is narrow, documented, and justified as framework baseline`
- verify_with:
  - `targeted_source_path_checks`
  - `npm test`
- if_blocked:
  - `record blocker in queue`
  - `do not silently widen task`
- promote_next_if_done: `task.builtin-content-deprivileging-closeout.runtime-consumer-deprivileging`
- drift_check_required: `true`
- drift_forbidden_expansions:
  - `constant_renaming_without_owner_story_change`
  - `phase_3_scaffold_scope`
- drift_escalate_to:
  - `queue`
- stop_if:
  - `registry_privilege_cleanup requires a different queue family`

##### Human Context

- Purpose:
  - `Remove or explicitly normalize the builtin-first-party shortcuts where production still relies on static builtin registry seeds or hardwired builtin source activation instead of a shared first-party mod intake story.`
- Failure mode:
  - `Do not rename builtin constants and call it deprivileging; the task only closes if the production owner story changes or the retained privilege is explicitly justified.`

#### `task.builtin-content-deprivileging-closeout.runtime-consumer-deprivileging`

##### Control Block

- task_id: `task.builtin-content-deprivileging-closeout.runtime-consumer-deprivileging`
- state: `done`
- task_type: `execution`
- depends_on:
  - `task.builtin-content-deprivileging-closeout.builtin-registry-and-loader-audit`
- blocked_by: []
- priority: `high`
- scope:
  - `src/application/content/active-game-content.ts`
  - `src/content/base-game-content-pack.ts`
  - `src/content/ui/**`
  - `src/application/ui/**`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `src/application/content/active-game-content.ts`
  - `src/content/base-game-content-pack.ts`
  - `src/content/ui/**`
  - `src/application/ui/**`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `broad_ui_redesign`
  - `phase_3_template_and_validator_scope`
- done_when:
  - `covered production consumers no longer silently depend on builtin-preloaded privilege in a way that contradicts the target's contribution-closure claim`
  - `remaining builtin assumptions are either removed, downgraded to explicit framework baseline, or handed off explicitly`
- verify_with:
  - `targeted_source_path_checks`
  - `npm test`
- if_blocked:
  - `record blocker in queue`
  - `do not silently widen task`
- promote_next_if_done: `task.builtin-content-deprivileging-closeout.queue-closeout`
- drift_check_required: `true`
- drift_forbidden_expansions:
  - `broad_ui_or_presenter_rewrite`
  - `new_family_system_design`
- drift_escalate_to:
  - `queue`
- stop_if:
  - `remaining consumer assumptions prove a broader intake queue is needed`

##### Human Context

- Purpose:
  - `Resolve the production consumers that still assume builtin-preloaded base content, builtin UI reserve layers, or other builtin-first defaults in a way that blocks same-family contribution closure.`
- Failure mode:
  - `Do not turn this into a broad UI redesign or scaffold queue; only move builtin assumptions that materially affect modular ownership and contribution-closure claims.`

#### `task.builtin-content-deprivileging-closeout.queue-closeout`

##### Control Block

- task_id: `task.builtin-content-deprivileging-closeout.queue-closeout`
- state: `done`
- task_type: `closeout`
- depends_on:
  - `task.builtin-content-deprivileging-closeout.runtime-consumer-deprivileging`
- blocked_by: []
- priority: `high`
- scope:
  - `src/main.ts`
  - `src/core/registry/**`
  - `src/application/content/**`
  - `src/application/ui/**`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/project-progress.md`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `src/main.ts`
  - `src/core/registry/**`
  - `src/application/content/**`
  - `src/application/ui/**`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/project-progress.md`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `historical_queue_truth`
  - `phase_2_promotion_without_evidence`
- done_when:
  - `the queue can close with a coherent builtin deprivileging story or open one narrowly justified later Phase 2 queue with explicit residue`
  - `pointer updates for target-level artifacts are recorded`
- verify_with:
  - `document_consistency_check`
  - `targeted_source_path_and_regression_evidence`
  - `npm test`
- if_blocked:
  - `record blocker in queue`
  - `do not silently widen task`
- promote_next_if_done: `none`
- drift_check_required: `true`
- drift_forbidden_expansions:
  - `vague_builtin_is_better_now_closeout`
  - `silent_reopening_of_builtin_only_queue`
- drift_escalate_to:
  - `target`
- stop_if:
  - `a stronger remaining blocker proves this queue cannot honestly close`

##### Human Context

- Purpose:
  - `Decide whether builtin-first-party content now has a coherent same-family production story and record which later Phase 2 queue, if any, still needs promotion.`
- Failure mode:
  - `Do not close with a vague "builtin is better now" claim; either prove the remaining production story or record the exact blocker and promote the right later queue.`

## Historical Handoff Note

- Task ID:
  - `none`
- Recorded handoff at closure:
  - `Queue is closed. Return control to the target and promote a new queue only if a stronger same-period modularization blocker is proven.`
- Recorded expected output:
  - `A target-level decision on whether Phase 2 needs unified-contribution-intake-closeout or whether builtin privilege work remains closed pending later acceptance review.`

## Historical Candidate Notes

- `task.builtin-content-deprivileging-closeout.ui-framework-baseline-disposition`
  - State:
    - `candidate`
  - Reason:
    - `May be useful later if builtin UI reserve layers prove to be accepted framework baseline rather than production privilege, but still need a formal disposition note before queue closeout.`
  - Promote when:
    - `runtime-consumer-deprivileging proves UI reserve seeds should not be removed here but still require explicit contribution-closure classification.`
  - Reject when:
    - `the UI reserve family remains accepted framework baseline with no current production-path blocker.`
  - Required evidence:
    - `ui_reserve_source_audit`
    - `target_or_queue_promotion_note`

- `task.builtin-content-deprivileging-closeout.first-party-default-start-disposition`
  - State:
    - `candidate`
  - Reason:
    - `May be useful later if builtin default-start behavior remains intentionally privileged after registry/source deprivileging closes.`
  - Promote when:
    - `queue-closeout proves the only remaining builtin privilege question is default-start acceptance rather than active production ownership.`
  - Reject when:
    - `later target acceptance work can disposition default-start behavior without reopening this queue.`
  - Required evidence:
    - `closeout_residue_note`
    - `target_level_promotion_note`

## Closeout Decision

- queue_id: `queue.builtin-content-deprivileging-closeout`
- closeout_status: `done`
- verification_status: `passed`
- residue_remaining: `yes`
- residue_classification:
  - `accepted-framework-baseline`
  - `later-acceptance-review`
- next_queue_recommendation: `queue.unified-contribution-intake-closeout`
- promotion_justified: `false`
- evidence:
  - `fresh_source_path_audit`
  - `targeted_builtin_ui_reserve_regressions`
  - `document_consistency_check`
  - `npm test`

## State Transition Rules

1. Queue tasks move through `candidate -> queued -> active -> done/blocked/dropped`.
2. Only one task in this queue may be `active` at a time.
3. Follow-up intake or authoring work that does not change builtin privilege claims should become later queues, not be silently appended here.
4. Closed queue truth must remain historical; this document must not be rewritten to imply that the queue is still active.

## Progress Log

- 2026-07-06
  - Summary: `Promoted builtin-content-deprivileging-closeout as the first formal Phase 2 queue after Phase 1 closed without needing state-sync-and-runtime-canonicalization.`
  - Verification: `Phase review plus builtin privilege source audit`
  - Next at that time: `Start task.builtin-content-deprivileging-closeout.baseline-reconcile.`
- 2026-07-06
  - Summary: `Closed baseline-reconcile after classifying builtin house/playable static registry seeds, startup-time direct builtin loaded-mod construction, and the default base-pack bootstrap as the first real contribution-closure blockers, while UI reserve layering remains accepted-for-now framework baseline pending stronger evidence.`
  - Verification: `Fresh source-baseline recheck across core registries, startup coordinator, mod source loader, active content bootstrap, UI contract layers, and main startup wiring`
  - Next at that time: `Start task.builtin-content-deprivileging-closeout.builtin-registry-and-loader-audit.`
- 2026-07-06
  - Summary: `Within builtin-registry-and-loader-audit, converged builtin startup activation and builtin save-source reload onto the shared mod.load-builtin loader seam backed by builtinModsById, removing the direct createLoadedModFromManifest startup shortcut from main.ts.`
  - Verification: `npm test`
  - Next: `Continue builtin-registry-and-loader-audit on the static builtin house/playable registry seed path.`
- 2026-07-06
  - Summary: `Closed builtin-registry-and-loader-audit after moving builtin house/playable static seed ownership out of the generic core registries and into explicit builtin registry installer modules, while runtime consumers now read those builtin registries through the shared seam instead of hidden generic seeds.`
  - Verification: `npm test`
  - Next at that time: `Start task.builtin-content-deprivileging-closeout.runtime-consumer-deprivileging.`
- 2026-07-06
  - Summary: `Advanced runtime-consumer-deprivileging by removing the builtin base-pack self-load from application/content/default-runtime-content.ts and requiring main.ts to inject the current default pack explicitly instead of letting that runtime consumer import the builtin loader on its own.`
  - Verification: `npm test`
  - Next: `Continue runtime-consumer-deprivileging on active-content/bootstrap and remaining builtin-preloaded consumer assumptions.`
- 2026-07-06
  - Summary: `Advanced runtime-consumer-deprivileging again by letting scenario activation preserve multi-pack normalized content sources and by moving active-game-content bootstrap to assemble directly from activationResult.normalizedContentSources, removing the extra basePack argument from the startup content-context assembly path in main.ts.`
  - Verification: `npm test`
  - Next: `Continue runtime-consumer-deprivileging on remaining builtin-preloaded UI/content consumer assumptions.`
- 2026-07-06
  - Summary: `Closed runtime-consumer-deprivileging after a fresh source-path audit confirmed that active-content/bootstrap no longer depends on a separate builtin base-pack handoff and that the reserve UI contract family still stays off the main startup/runtime path, with main.ts continuing to build runtime uiLayouts from the current layout-editor preset baseline instead.`
  - Verification: `npm run build:test plus targeted robustness tests for builtin/ui reserve/runtime-consumer source paths`
  - Next: `Run queue-closeout and decide whether any narrower builtin-only follow-up queue is still justified.`
- 2026-07-06
  - Summary: `Closed builtin-content-deprivileging-closeout after the queue closeout audit found that builtin-first-party startup, registry seeding, and covered runtime content bootstrap now route through explicit shared seams, while the remaining builtin default-start and UI baseline questions no longer justify keeping a builtin-only deprivileging queue active.`
  - Verification: `Document consistency check plus npm test`
  - Next: `Return control to the target and decide whether a broader unified-contribution-intake-closeout or later acceptance queue should be promoted next.`
