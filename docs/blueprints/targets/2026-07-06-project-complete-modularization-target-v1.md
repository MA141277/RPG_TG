# Project Complete Modularization Target v1

## Control Block

- target_id: `target.project-complete-modularization`
- version_goal: `Keep the current-period modularization target closed on the least live truth necessary, reopening bounded work only if fresh evidence disproves the current mod-first production-path closure.`
- acceptance_criteria:
  - `builtin and imported content continue to use the same production activation and runtime path`
  - `in-scope startup, save, runtime, and shell ownership no longer depend on unresolved transitional owner lines`
  - `extension surfaces remain contract-driven or registry-driven rather than hidden builtin-only privilege paths`
  - `required queues are closed or intentionally dropped with explicit disposition`
  - `no unresolved in-scope P0 or P1 remains hidden behind historical narrative`
- in_scope:
  - `production-path modularization work that still affects the current mod-first architecture claim`
  - `candidate intake for fresh owner-line, authoring, acceptance, or residue work when current evidence still proves a gap`
  - `queue continuity and closeout readiness for the current-period modularization target`
- out_of_scope:
  - `reopening legacy docs/superpowers workflow as a live controller`
  - `inventing a sibling target for same-period modularization work`
  - `using target truth to hold queue-local task execution detail`
  - `treating historical queue notes as live execution commands`
- execution_queue: `none`
- candidate_queues:
  - candidate_id: `queue.state-sync-and-runtime-canonicalization`
    state: `candidate`
    goal: `Reopen only if fresh runtime/state ownership evidence proves the current modularization claim is still blocked.`
    entry_conditions: `fresh runtime/state ownership blocker is proven on the current production path`
    artifacts_needed:
      - `current runtime/state blocker evidence`
    drop_if: `fresh evidence proves the blocker is no longer in scope, already closed, or better absorbed into target truth`
    on_failure: `absorb-into-target`
  - candidate_id: `queue.unified-contribution-intake-closeout`
    state: `candidate`
    goal: `Reopen only if a fresh intake-path blocker disproves the current contribution intake closure.`
    entry_conditions: `fresh intake-path blocker is proven`
    artifacts_needed:
      - `current intake-path blocker evidence`
    drop_if: `fresh evidence proves the intake blocker is no longer in scope, already closed, or better absorbed into target truth`
    on_failure: `absorb-into-target`
  - candidate_id: `queue.playable-family-gap-audit`
    state: `candidate`
    goal: `Reopen only if a still-live playable-family production-path gap is reproven.`
    entry_conditions: `fresh playable-family runtime or contribution gap is proven`
    artifacts_needed:
      - `current playable-family gap evidence`
    drop_if: `fresh evidence proves the playable-family gap is no longer in scope, already closed, or better absorbed into target truth`
    on_failure: `absorb-into-target`
  - candidate_id: `queue.framework-scaffold-and-template-closure`
    state: `candidate`
    goal: `Reopen only if framework-owned authoring coverage is disproven by current evidence.`
    entry_conditions: `fresh framework-owned authoring gap is proven`
    artifacts_needed:
      - `current authoring coverage failure evidence`
    drop_if: `fresh evidence proves the framework authoring gap is no longer in scope, already closed, or better absorbed into target truth`
    on_failure: `absorb-into-target`
  - candidate_id: `queue.non-owner-verify-follow-up`
    state: `candidate`
    goal: `Reopen only if target conservatively absorbs a non-owner verification failure that cannot be reasonably assigned to the current queue bounded goal, owner scope, or direct edit surface.`
    entry_conditions: `target has conservatively absorbed a non-owner verification failure`
    artifacts_needed:
      - `artifact.non-owner-verify-failure`
    drop_if: `fresh evidence proves the blocker belongs to the original queue after all or is no longer live`
    on_failure: `absorb-into-target`
- transition_queue:
  - queue_id: `none`
  - state: `none`
  - binds_candidates: []
  - trigger_basis: []
  - minimal_scope: []
- absorb_resolution:
  - source_queue: `none`
  - failure_scope: `none`
  - resolution_kind: `none`
  - resolution_target: `none`
- constraints:
  - `Only one execution queue may be active at a time.`
  - `New work enters this target through candidate_queues by default.`
  - `No transition queue may exist while a candidate can directly become active.`
  - `Queue completion must remain visible but must not stop legal continuation.`
  - `Executing verify_with does not by itself assign failure ownership.`
  - `A non-owner verification failure must be absorbed into target-owned follow-up work and must not remain on the original queue closeout.`
- artifact_rules:
  - artifact_id: `artifact.current-gap-proof`
    required_for:
      - `queue.state-sync-and-runtime-canonicalization`
      - `queue.unified-contribution-intake-closeout`
      - `queue.playable-family-gap-audit`
      - `queue.framework-scaffold-and-template-closure`
    transition_allowed_when_missing: `false`
    rule: `A candidate may activate directly only when current evidence already proves the bounded blocker on the production path.`
  - artifact_id: `artifact.bridge-output`
    required_for:
      - `queue.state-sync-and-runtime-canonicalization`
      - `queue.unified-contribution-intake-closeout`
      - `queue.playable-family-gap-audit`
      - `queue.framework-scaffold-and-template-closure`
    transition_allowed_when_missing: `true`
    rule: `A transition queue may be created only when no candidate can directly execute and one minimal bridge artifact would make a specific candidate executable.`
  - artifact_id: `artifact.non-owner-verify-failure`
    required_for:
      - `queue.non-owner-verify-follow-up`
    transition_allowed_when_missing: `true`
    rule: `If conservative verification shows the failure cannot be reasonably assigned to the current queue bounded goal, owner scope, or direct edit surface, target must absorb it into target-owned follow-up work as a candidate rewrite, a new candidate, or one unique necessary transition queue.`
- done_when:
  - `all acceptance criteria remain satisfied by current evidence`
  - `execution_queue = none`
  - `no candidate has a proven entry_conditions match`
  - `no transition queue is justified by artifact_rules`
- closeout_condition:
  - `the target may close only when done_when is satisfied and the remaining choice is a human-facing close-now versus keep-open-for-future-evidence decision`
- decision_required: `none`

## Human Context

### Role

- `This file is the v1 target-level live owner.`
- `The old target spec and target plan remain reference-only compatibility shells.`
- `The current target is closed on present evidence: execution_queue is empty, no candidate entry_conditions are currently proven, and no transition queue is justified.`

### Compatibility Notes

- Legacy target spec:
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
- Legacy target plan:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
- Current migration stance:
  - `The v1 target owns current target truth; legacy target docs remain only as compatibility shells for external references that still expect those paths.`
