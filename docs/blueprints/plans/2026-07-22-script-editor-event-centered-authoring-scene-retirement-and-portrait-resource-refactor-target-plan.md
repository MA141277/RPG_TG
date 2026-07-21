# Script Editor Event-Centered Authoring, Scene Retirement, And Portrait Resource Refactor Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor`
- version_status: `open`
- active_phase: `phase.execution`
- active_queue: `queue.scene-family-retirement-and-content-migration`
- decision_state: `active-execution`
- next_decision: `queue-closeout-or-return-to-version-review`
- next_action: `resume-active-queue`
- resume_gate: `open-active-queue`
- post_queue_closeout_pause_policy: `auto-continue`
- promotion_review_result: `admitted`
- review_subject_id: `none`
- review_subject_classification: `none`
- proposed_queue_id: `none`
- review_basis: `none`
- admission_status: `none`
- intake_status: `none`
- intake_item_id: `none`
- intake_summary: `none`
- intake_result: `none`
- intake_feedback_mode: `none`
- closure_review_subject: `target.script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor`
- closure_review_status: `routed`
- residue_candidate_id: `none`
- residue_candidate_family: `none`
- routing_basis: `formal-target-created-from-memo-025`
- next_lawful_queue_recommendation: `queue.event-centered-runtime-pack-preview-export-sync`
- auto_admission_ready: `false`
- stop_reason: `none`
- stop_basis: `none`
- next_unblocked_action: `none`
- human_input_required: `false`
- blocked_by: []
- candidate_queue_ids:
  - `queue.script-editor-event-centered-authoring-model-unification`
  - `queue.event-router-only-trigger-contract-freeze`
  - `queue.scene-family-retirement-and-content-migration`
  - `queue.event-centered-runtime-pack-preview-export-sync`
  - `queue.portrait-resource-authoring-and-resource-mapping-convergence`
  - `queue.script-editor-event-centered-authoring-final-acceptance-and-residue-guard`
- candidate_backlog_refresh_status: `fresh`
- candidate_backlog_snapshot:
  - `queue.script-editor-event-centered-authoring-model-unification: closed locally after ACC-EVENT-CENTER-001 verification and queue closeout; no same-family residue remains in its bounded authoring-model scope.`
  - `queue.event-router-only-trigger-contract-freeze: closed locally after ACC-EVENT-CENTER-002 verification and queue closeout; no same-family residue remains in its bounded router-freeze scope.`
  - `queue.scene-family-retirement-and-content-migration: admitted as the active third queue for formal scene removal, content migration, and no-compatibility-residue retirement.`
  - `queue.event-centered-runtime-pack-preview-export-sync: recorded-only required queue for preview/export/import/loader/runtime convergence on the no-scene model.`
  - `queue.portrait-resource-authoring-and-resource-mapping-convergence: recorded-only required queue for portrait resources, variants, mapping, thumbnails, and runtime continuity.`
  - `queue.script-editor-event-centered-authoring-final-acceptance-and-residue-guard: recorded-only required-final guard queue for cross-environment trigger proof and portrait creator-path acceptance.`
- candidate_backlog_scan_sources:
  - `project-progress`
  - `blueprint`
  - `docs/blueprints/version-memo.md#MEMO-025`
  - `docs/blueprints/specs/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-evidence-draft.md`
  - `docs/blueprints/specs/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target.md`

## Human Context

### Activation Record

- Scope approval:
  - `The operator explicitly required MEMO-025 to become a governed Blueprint candidate/target source without entering implementation, and then explicitly approved following the suggested successor-target route.`
- Inherits from:
  - `docs/blueprints/version-memo.md#MEMO-025`
  - `docs/blueprints/specs/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-evidence-draft.md`
  - `target.building-arrangement-container-flow-refactor candidate routing conclusion for MEMO-025`
- Inheritance boundary:
  - `This successor owns only event-centered authoring, scene retirement, no-scene runtime/export/import convergence, and portrait resource convergence.`
  - `It does not absorb current active execution from target.building-arrangement-container-flow-refactor.`
- Admission basis:
  - `No existing open target can lawfully own the full MEMO-025 boundary without parent-goal widening.`
  - `The evidence draft proved the work must stay in one successor target/version with five bounded implementation queues plus a required-final acceptance queue.`
- Activation conclusion:
  - `Formal target docs now exist for target.script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor.`
- `queue.scene-family-retirement-and-content-migration is now the active queue.`
- `task.scene-family-retirement-and-content-migration.content-migration-and-scene-removal is the active task.`
- `queue.event-router-only-trigger-contract-freeze is closed after ACC-EVENT-CENTER-002 verification. queue.scene-family-retirement-and-content-migration evidence-anchor reconcile is complete, so implementation is now authorized only inside the admitted ACC-EVENT-CENTER-003 / 004 / 007 scene-retirement boundary.`
- `This target is now the current active open version in the blueprint chain after target.building-arrangement-container-flow-refactor closed on 2026-07-22.`

### Version Lifecycle Rules

- `This version remains open until explicit closeout is recorded here.`
- `If active_queue = none, that does not close the version; it returns to promotion-review.`
- `Because this target is now the active version, child-queue admission here is lawful only after version-plan admission truth and queue-doc activation are synchronized.`
- `Do not turn scene retirement into compatibility layering, temporary shims, dual-path truth, or boundary-thinning.`
- `Do not split portrait resource convergence into another target/version.`
- `Do not implement code without an admitted child queue doc and a live active task.`
- `Task completion, queue closeout sync, admission sync, active queue switch, repository sync result recording, and doc-only state sync are not lawful stop points by themselves.`

### Auto-Continue Stop Rule

- `Before ending a response while an active queue, active task, or uniquely lawful next governance action still exists, run the workflow stop-condition self-check.`
- `Only these causes may lawfully stop execution: explicit answer-only request, real blocker, outside-parent-spec work, parent-spec change, capability downgrade risk, retired-rewrite risk, or genuine product decision.`
- `If none applies, do not stop at task completion, queue closeout, admission, queue activation, queue switch, sync recording, or status reporting; continue directly into the next lawful action.`
- `If one applies, write stop_reason / stop_basis / next_unblocked_action / human_input_required here before the response ends.`

### Queue Admission Startup Rules

1. `Read project-progress -> blueprint -> active version plan -> active queue before touching a fresh child queue item.`
2. `This target is now the active version, but child-queue admission still requires version-plan admission sync before any queue becomes execution truth.`
3. `Before admitting any child queue, verify that it does not narrow MEMO-025 by keeping scene as formal routing truth, by leaving editor/runtime divergence, or by routing portrait resources elsewhere.`
4. `queue.scene-family-retirement-and-content-migration` and `queue.event-centered-runtime-pack-preview-export-sync` must be admitted and executed as a coupled consecutive pair inside this same target/version.`
5. `Only after version-plan admission truth exists and the admitted queue doc exposes queue_status=active plus a live active_task may implementation start.`

### Queue Spec Integrity Rule

- `No child queue under this target may pass by shrinking MEMO-025 down to one happy path, one helper seam, or one locally convenient surface.`
- `Before admission or closeout, each queue must be specific enough to prove inherited capability preservation, alternate-path survival, and replacement-truth exit rather than only local implementation success.`
- `If a queue spec cannot yet name its capability floor, non-primary user/runtime paths, functional-loss guard, or replacement proof obligation, revise the queue spec first instead of proceeding with a thin execution boundary.`

### Operator Receipt Record

- receipt_join_status: `success | failed | success-already-recorded`
- receipt_join_type: `execution-queue | candidate-queue | not-added`
- receipt_join_queue_id: `queue.scene-family-retirement-and-content-migration | none`
- receipt_reason_code: `absorbed-into-active-queue | recorded-as-candidate | admission-routing-required | active-queue-already-exists | candidate-only-not-admitted | blocked-by-governance-truth | rejected-by-scope-or-evidence | none`
- receipt_reason_basis:
  - `Use current version-plan governance truth as the basis for operator-facing intake output.`
- receipt_active_queue: `queue.scene-family-retirement-and-content-migration`
- receipt_active_task: `task.scene-family-retirement-and-content-migration.content-migration-and-scene-removal`
- receipt_queue_goal:
  - `Retire scene as a formal family, migrate its content ownership, and remove scene compatibility residue without weakening event-centered building meaning.`
- receipt_next_step:
  - `Continue the active scene-retirement queue until the current lawful task batch completes or a lawful stop condition is recorded.`
- receipt_human_action: `none-required | confirmation-required | wait-for-blocker`
- receipt_internal_analysis_exposed: `false | true`

### Blueprint Lint Failure Handling

- `If npm run lint:blueprints fails during this version's admission, evidence-lock, implementation, or closeout path, first repair the governing docs/spec structure inside the current lawful boundary rather than treating the failure as advisory.`
- `If the lint failure proves the current queue spec is too thin, revise the queue spec before continuing implementation or closeout; do not defer the missing structure into a later queue by default.`
- `If the lint failure cannot be repaired inside the current admitted boundary without changing the parent total spec, write the blocker/reroute truth here and return to parent-spec or queue-routing governance rather than claiming progress through a failed gate.`
- `Blueprint lint failure must not be recorded as accepted residue, and it must not be bypassed by repository sync, pause, or queue handoff.`

### Operator Intake Contract

- `Operator Receipt Record below is the current structured source of truth for operator-facing intake output.`

- Intake surface:
  - `人工只输入：新需求 + 参考治理规范。`
- Internal-only Blueprint work:
  - `read current truth chain`
  - `classify and route successor-target child queues`
  - `record candidate truth or admission truth`
  - `do not create execution truth without explicit admission`
- Fixed receipt:
  - `处理结果：已进入 Blueprint 内部治理。`
  - `当前执行情况：等待版本层收敛。`
  - `人工操作：当前不需要 / 当前需要确认 xxx`

- Default visibility rule:
  - `默认不向人工暴露真值链细节。`

### Candidate Recovery Ledger

| Candidate ID | Last Classification | Proposed Queue | Latest Disposition | Recheck Trigger Type | Recheck Trigger Basis | Acceptance Refs | Implementation Anchors | Can Claim | Cannot Claim | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `item.script-editor-event-centered-authoring-model-unification` | `queue-candidate` | `queue.script-editor-event-centered-authoring-model-unification` | `closed-local` | `none` | `No recheck is currently needed because the queue is already closed locally.` | `ACC-EVENT-CENTER-001` | `src/domain/script-editor-project.ts; src/application/script-editor/**; src/ui/main-ui/main-ui-flow.js` | `creator-facing event-centered semantics and destination-family ownership` | `scene retirement, trigger freeze, runtime cutover, portrait mapping` | `Closed on 2026-07-22 after typecheck, test, and blueprint-lint verification confirmed the creator-facing model moved onto event destination ownership with no same-family residue inside ACC-EVENT-CENTER-001.` |
| `item.event-router-only-trigger-contract-freeze` | `queue-candidate` | `queue.event-router-only-trigger-contract-freeze` | `closed-local` | `none` | `No recheck is currently needed because the queue is already closed locally.` | `ACC-EVENT-CENTER-002` | `src/domain/event.ts; EventBindingRuntime entrypoints; trigger-context contracts; tests/**` | `event-only routing truth and stable trigger timing/context contracts` | `scene content migration; portrait mapping` | `Closed on 2026-07-22 after shared trigger contract/runtime-export matrix freeze, event-only activation cutover, and full verification.` |
| `item.scene-family-retirement-and-content-migration` | `queue-candidate` | `queue.scene-family-retirement-and-content-migration` | `admitted-active` | `none` | `No candidate recheck applies while this queue is the current admitted active queue.` | `ACC-EVENT-CENTER-003; ACC-EVENT-CENTER-004; ACC-EVENT-CENTER-007` | `src/domain/action.ts; src/domain/script-editor-project.ts; src/application/scene/**; src/application/story/**; src/application/startup/**; src/ui/views/scene/**` | `formal scene retirement and content migration` | `runtime/export/import divergence as acceptable residue` | `Admitted on 2026-07-22 immediately after router-freeze closeout. Evidence lock confirms that scene truth still spans authoring/project/runtime/startup/presenter surfaces and must be removed directly in this queue.` |
| `item.event-centered-runtime-pack-preview-export-sync` | `queue-candidate` | `queue.event-centered-runtime-pack-preview-export-sync` | `recorded-only` | `active-queue-absorption-changed` | `Recheck only after queue.scene-family-retirement-and-content-migration closes and the no-scene runtime/export/import handoff is ready for admission.` | `ACC-EVENT-CENTER-005` | `src/application/script-editor/runtime-pack-export.ts; src/application/script-editor/runtime-pack-import.ts; src/application/scenario/scenario-pack-loader.ts; preview/runtime loaders; tests/**` | `editor/runtime/export/import no-scene convergence` | `editor-only structure changes with old runtime truth still alive` | `This queue is a coupled follow-up to scene retirement, not an independent later cleanup.` |
| `item.portrait-resource-authoring-and-resource-mapping-convergence` | `queue-candidate` | `queue.portrait-resource-authoring-and-resource-mapping-convergence` | `recorded-only` | `active-queue-absorption-changed` | `Recheck only after no-scene runtime convergence closes and portrait-resource work becomes the next lawful queue.` | `ACC-EVENT-CENTER-006` | `src/domain/script-editor-project.ts; portrait authoring helpers/UI; resource mapping/runtime loaders; tests/**` | `portrait resources, variants, mapping, thumbnail/current preview/runtime continuity` | `routing portrait work into another target/version or keeping person-driven reverse collection` | `May execute last, but only inside this target/version.` |
| `item.script-editor-event-centered-authoring-final-acceptance-and-residue-guard` | `queue-candidate` | `queue.script-editor-event-centered-authoring-final-acceptance-and-residue-guard` | `recorded-only` | `active-queue-absorption-changed` | `Recheck only after all implementation queues close or route blockers and final acceptance becomes lawfully admissible.` | `ACC-EVENT-CENTER-008` | `tests/**; browser flow; source guards; version acceptance ledger` | `final no-over-narrowing acceptance and creator-path proof` | `primary implementation ownership` | `Must not be used to hide implementation-bearing residue.` |

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.script-editor-event-centered-authoring-model-unification` | `done-local` | `none` | `Closed on 2026-07-22 after ACC-EVENT-CENTER-001 verification and no-over-narrowing review passed.` |
| `queue.event-router-only-trigger-contract-freeze` | `done-local` | `none` | `Closed on 2026-07-22 after ACC-EVENT-CENTER-002 verification and no-over-narrowing review passed.` |
| `queue.scene-family-retirement-and-content-migration` | `active` | `none` | `Admitted on 2026-07-22 immediately after router-freeze closed. Evidence-anchor reconcile is complete and implementation is live.` |
| `queue.event-centered-runtime-pack-preview-export-sync` | `candidate-not-admitted` | `Immediately after scene-retirement queue closes.` | `Coupled consecutive pair with scene retirement.` |
| `queue.portrait-resource-authoring-and-resource-mapping-convergence` | `candidate-not-admitted` | `After no-scene runtime convergence closes.` | `Must remain in this target/version.` |
| `queue.script-editor-event-centered-authoring-final-acceptance-and-residue-guard` | `candidate-not-admitted` | `After all implementation queues close or lawfully route blockers.` | `Required-final guard queue only.` |

### Candidate Backlog Refresh Rule

- `After an execution queue closes or candidate routing changes, refresh candidate truth before answering whether more same-version candidate queues remain.`
- `Read project-progress -> blueprint -> current version plan -> candidate_queue_ids -> Candidate Recovery Ledger -> Queue Promotion Ledger -> named queue docs.`
- `Use docs/change-log.md only when structured governance docs are insufficient or explicitly cited by the current version plan.`
- `Do not answer none unless candidate_backlog_refresh_status=fresh and candidate_backlog_snapshot is empty.`
- `If candidate truth is stale, missing, or inconsistent, refresh or reconcile it rather than answering with prose.`

### Candidate Evidence Matrix

| Queue ID | Source Docs | Acceptance Refs | Implementation Anchors | Legacy Paths To Replace | Compatibility Paths To Preserve | Reject Or Split Reason | Reject Or Split Basis |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `queue.scene-family-retirement-and-content-migration` | `docs/blueprints/specs/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target.md` | `ACC-EVENT-CENTER-003; ACC-EVENT-CENTER-004; ACC-EVENT-CENTER-007` | `src/domain/action.ts; src/domain/script-editor-project.ts; src/application/scene/**; src/application/story/**; src/application/startup/**; src/ui/views/scene/**` | `SceneDefinition / ActionNode / project.scenes / scenes.json / entrySceneId / nextSceneId / activeSceneId / scene runtime-session truth` | `event/event-binding remain router truth; arrangement -> event-binding -> flow / playable remains legal implementation path` | `none` | `This queue is already admitted and structurally complete for its current boundary.` |
| `queue.event-centered-runtime-pack-preview-export-sync` | `docs/blueprints/specs/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target.md` | `ACC-EVENT-CENTER-005` | `src/application/script-editor/runtime-pack-export.ts; src/application/script-editor/runtime-pack-import.ts; src/application/scenario/scenario-pack-loader.ts; preview/runtime loaders; tests/**` | `scene-owned runtime pack families and no-scene divergence across export/import/loader paths` | `No-scene authoring/runtime/export/import parity after scene retirement closes` | `none` | `Candidate remains valid and awaits the coupled scene-retirement handoff.` |
| `queue.portrait-resource-authoring-and-resource-mapping-convergence` | `docs/blueprints/specs/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target.md` | `ACC-EVENT-CENTER-006` | `src/domain/script-editor-project.ts; portrait authoring helpers/UI; resource mapping/runtime loaders; tests/**` | `person-driven reverse collection and unstable portrait resource mapping` | `portrait-resource continuity across authoring/runtime surfaces` | `none` | `Candidate remains valid inside this version and must not be routed to another target.` |

### Candidate Queue Integrity Checklist

- `Each candidate queue must name its inherited capability floor, non-primary user/runtime paths, replacement proof obligations, and functional-loss guard before admission.`
- `Reject or split any candidate that could appear complete while creator-facing meaning, runtime meaning, trigger timing/context, or editor/runtime/export/import consistency is still only implied in prose.`
- `Do not let the later runtime-sync queue silently absorb formal scene-retirement work that belongs to the active queue.`

### Execution Self-Review Gate

- review_scope: `admission-review | queue-closeout-review | version-closeout-review`
- version_acceptance_alignment:
  - `Current active queue still owns ACC-EVENT-CENTER-003 / 004 / 007; later queues remain recorded-only for ACC-EVENT-CENTER-005 / 006 / 008.`
- parent_spec_alignment:
  - `This version still preserves MEMO-025 as event-centered authoring + scene retirement + runtime/export/import sync + portrait convergence without weakening no-compatibility-residue requirements.`
- queue_claim_alignment:
  - `The active queue claims only formal scene retirement/content migration, while runtime/export/import sync, portrait convergence, and final acceptance remain routed to later queues.`
- over_narrowing_check:
  - `The updated candidate ledgers and evidence matrix now structurally prevent the active queue or later queues from collapsing parent capability into one seam or one happy path.`
- residue_or_blocker_routing_check:
  - `No new blocker was discovered during this version-doc sync; remaining work is still routed to the recorded later queues.`
- verification_adequacy_check:
  - `Version-doc governance sync will be validated through npm run lint:blueprints.`
- next_lawful_action_check:
  - `Continue the active queue until the current lawful task batch completes or a lawful stop condition is recorded.`

### Runtime/Browser Acceptance Gate

- gate_required: `true`
- covered_surfaces:
  - `Final version closeout must still prove editor/runtime/import-export and creator-path behavior through direct interaction evidence where applicable.`
- interaction_path:
  - `Deferred to the later acceptance-bearing queue and version-closeout path; this governance sync does not itself claim interaction completion.`
- proof_mode:
  - `equivalent-waiver`
- proof_artifacts:
  - `none yet; this version doc sync records the requirement and defers proof to the covered queues.`
- fail_closed_check:
  - `Any queue claiming interaction-dependent completion later must record fail-closed behavior for missing bindings/data rather than relying on source-only reasoning.`
- waiver_basis:
  - `This document update changes governance structure only; it does not itself claim UI/runtime completion.`

### Closure Routing Record

- `Current same-family routing remains unchanged: queue.scene-family-retirement-and-content-migration stays active, queue.event-centered-runtime-pack-preview-export-sync remains the next lawful same-family queue after active-queue closeout, and portrait/final-acceptance queues remain later routed candidates.`
- `No version-level blocker or reroute was introduced by this governance sync.`

### Explicit Operator-Directed Closure Or Suspension

- `If the operator explicitly requests suspending this version, keep version_status=open, write stop_reason=operator-requested-suspend with stop_basis plus next_unblocked_action, and set human_input_required=false in the Control Block.`
- `If the operator explicitly requests closing this version before closeout truth is actually satisfied, do not counterfeit done; reconcile residue/candidate truth first and use archived only when the version is being intentionally retired rather than completed.`
- `If the operator explicitly requests suspending the current execution queue, set active_queue=none here, synchronize the queue doc to queue_status=suspended, and record the lawful resume action in this plan.`
- `If the operator explicitly requests dropping a current or candidate queue, route it as dropped/rejected in governance truth rather than leaving that instruction as prose only.`

### Progress Log

- `2026-07-22`: `Promoted MEMO-025 into formal target.script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor after the operator approved the successor-target route. The new target is open with no active queue. It records five bounded implementation candidates plus one required-final acceptance queue, but does not change the current active version or authorize implementation.`
- `2026-07-22`: `After the operator explicitly closed target.building-arrangement-container-flow-refactor, Blueprint entry pointers were switched to this target. It is now the lawful active open version with no admitted child queue yet, so the next governed action remains candidate/admission review rather than implementation.`
- `2026-07-22`: `Repository sync toward origin/mod-first-dev completed successfully before successor-version admission work continued. Admission review then confirmed queue.script-editor-event-centered-authoring-model-unification is the lawful first bounded queue because trigger freeze, scene retirement, runtime cutover, and portrait convergence all depend on stable creator-facing event-centered semantics. The queue is now active with task.script-editor-event-centered-authoring-model-unification.evidence-anchor-reconcile as the current task.`
- `2026-07-22`: `queue.script-editor-event-centered-authoring-model-unification later closed after typecheck, test, and blueprint-lint verification confirmed ACC-EVENT-CENTER-001 with no same-family residue. Per post_queue_closeout_pause_policy=auto-continue, the version immediately admitted queue.event-router-only-trigger-contract-freeze as the next lawful queue rather than pausing at promotion review.`
- `2026-07-22`: `queue.event-router-only-trigger-contract-freeze evidence-anchor reconcile is now complete. Source inspection confirmed that EventDefinition.entrySceneId, EventRuntimeCandidate.sceneId, startEvent(), story-runtime/building runtime scene handoff, and caller-local TriggerContext assembly still hold formal routing truth today, so implementation begins inside ACC-EVENT-CENTER-002 with scene retirement, runtime/export convergence, and portrait-resource work explicitly preserved for later queues.`
- `2026-07-22`: `queue.event-router-only-trigger-contract-freeze later closed after shared trigger contract/runtime-export matrix freeze, event-only activation cutover, and full verification (npm run lint:blueprints, npm run typecheck, npm test). Per post_queue_closeout_pause_policy=auto-continue, the version immediately admitted queue.scene-family-retirement-and-content-migration as the next lawful queue rather than pausing at promotion review.`
- `2026-07-22`: `queue.scene-family-retirement-and-content-migration evidence-anchor reconcile is now complete. Source inspection confirmed that scene still survives as formal truth in domain/action.ts, project.scenes, scenes.json, runtime pack import/export, startup sceneId, scene-runner/scene-view/presenter paths, and dialogue-story-runtime-materializer, so implementation begins inside ACC-EVENT-CENTER-003 / 004 / 007 with runtime/export convergence and portrait-resource work explicitly preserved for later queues.`
