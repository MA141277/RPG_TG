# Playable Family Gap Audit Queue

## Control Block

- queue_id: `queue.playable-family-gap-audit`
- belongs_to_target: `target.project-complete-modularization`
- queue_status: `done`
- queue_class: `conditional`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- next_effect: `return-to-target-review`
- blocked_by: []
- allowed_item_classifications:
  - `current-target-item`
- reject_item_classifications:
  - `future-target-candidate`
  - `out-of-scope`
  - `historical-residue`
  - `content-pipeline-item`
  - `asset-pipeline-item`
- promotion_gate:
  - `still_live_playable_family_gap_proven`
  - `bounded_closure_scope_written`
- closeout_gate:
  - `all_required_tasks_done_or_dropped`
  - `queue_closeout_note_written`
  - `verification_recorded`
- must_not_expand_into:
  - `full_gameplay_contribution_redesign`
  - `unrelated_house_or_scene_refactors`
  - `save_runtime_schema_rewrite`
  - `ui_or_authoring_workflow_relitigation`

## Human Context

### Queue Goal

Close the still-live playable-family production-path gap where covered playables still enter runtime through builtin registry seeds and builtin runtime fallback instead of one shared mod contribution and installation contract.

### Boundary

This queue covers:

- auditing the current playable definition/integration/runtime path on the covered production flow
- proving exactly which playable family seams are still outside the shared mod contribution contract
- landing the minimum shared contract and runtime consumption changes needed so covered playable families can enter through the mod/runtime path
- preserving current builtin-first compatibility only through explicit first-party seed installation rather than hidden generic fallback

This queue does not cover:

- migrating every gameplay contribution family at once
- reopening unrelated intake, authoring, UI, or shell-thinning work
- redesigning save structure, startup ownership, or scene/task runtimes beyond the playable seam
- broad content expansion or new playable gameplay design

### Parent Target

- Target spec:
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
- Target plan:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`

### Admission Preconditions

- `This queue was admitted only after the target plan was synchronized with fresh playable-family evidence.`
- `Single-active-queue mode remains in force; no second queue may be activated while this queue is active.`
- `Runtime and manifest evidence must stay written here rather than drifting back into conversation-only conclusions.`

### Admission Evidence

- `src/core/contracts/gameplay-contribution.ts` still declares no playable-family contribution contract.`
- `src/core/contracts/mod-manifest.ts` therefore cannot declare playable-family contributions for a mod manifest.`
- `src/core/mods/mod-runtime.ts` installs shared contribution families for navigation, events, scenes, tasks, and houses, but no playable family.`
- `src/core/runtime/playable-runtime.ts` still imports builtin playable definition and integration registries directly and falls back to them as the default resolution path.`
- `src/core/registry/builtin-playable-definition-registry.ts` and `src/core/registry/builtin-playable-integration-registry.ts` still seed covered production playables as builtin-first data outside the shared mod contribution contract.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.playable-family-gap-audit.baseline-reconcile` | `done` | `Prove the exact still-live playable-family blocker, record the bounded closure seam, and reject wider interpretations.` | `none` | `Completed on 2026-07-07 after the queue recorded the missing playable contribution contract and builtin runtime fallback evidence.` |
| `task.playable-family-gap-audit.playable-contribution-contract-and-runtime-closure` | `done` | `Land the minimum shared playable contribution contract and runtime consumption path for the covered playable families.` | `task.playable-family-gap-audit.baseline-reconcile` | `Completed on 2026-07-07 after playable contributions were added to activated-mod intake and default runtime registries became activation-configurable.` |
| `task.playable-family-gap-audit.queue-closeout` | `done` | `Verify closure, sync governance truth, and return the target to review.` | `task.playable-family-gap-audit.playable-contribution-contract-and-runtime-closure` | `Completed on 2026-07-07 after full verification and Blueprint truth sync passed.` |

## Task Definitions

### `task.playable-family-gap-audit.baseline-reconcile`

#### Control Block

- task_id: `task.playable-family-gap-audit.baseline-reconcile`
- state: `done`
- scope:
  - `src/core/contracts/gameplay-contribution.ts`
  - `src/core/contracts/mod-manifest.ts`
  - `src/core/mods/mod-runtime.ts`
  - `src/core/runtime/playable-runtime.ts`
  - `src/core/registry/builtin-playable-definition-registry.ts`
  - `src/core/registry/builtin-playable-integration-registry.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/**`
- must_inspect:
  - `src/core/contracts/gameplay-contribution.ts`
  - `src/core/contracts/mod-manifest.ts`
  - `src/core/mods/mod-runtime.ts`
  - `src/core/runtime/playable-runtime.ts`
  - `src/core/registry/builtin-playable-definition-registry.ts`
  - `src/core/registry/builtin-playable-integration-registry.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `house_runtime_scope`
  - `scene_task_runtime_scope`
  - `save_schema_scope`
  - `ui_contract_scope`
- done_when:
  - `the queue doc records whether the playable-family gap is still live on the covered production path`
  - `the exact missing shared contract or installation seam is named in written queue truth`
  - `the next implementation task is bounded enough to proceed without widening into another queue family`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `record the blocker in this queue doc`
  - `stop rather than widening into broader intake or runtime redesign`
- promote_next_if_done: `none`
- stop_if:
  - `the evidence collapses into already-accepted residue rather than a still-live production blocker`
  - `closing the gap would require reopening unrelated queue families`

#### Human Context

- Purpose:
  - `Convert the newly observed playable evidence into bounded queue truth before implementation expands.`
- Failure mode:
  - `Do not blur "explicit builtin first-party seed inventory" with "still-hidden generic fallback"; the task must prove the latter before the queue continues.`

##### Baseline Finding

- `The current mod manifest and gameplay contribution contracts still have no playable-family declaration slot.`
- `The current mod runtime therefore cannot install playable definitions or integrations through the shared activated-mod contribution path.`
- `The current playable runtime still resolves through builtin playable registries by default, which keeps the covered playable family outside the shared mod contribution contract even though the builtin seed has already been isolated into explicit registry modules.`
- `The bounded next task is therefore to add only the playable-family contribution/intake/runtime seam, not to reopen broader contribution-family work.`

### `task.playable-family-gap-audit.playable-contribution-contract-and-runtime-closure`

#### Control Block

- task_id: `task.playable-family-gap-audit.playable-contribution-contract-and-runtime-closure`
- state: `done`
- scope:
  - `src/core/contracts/gameplay-contribution.ts`
  - `src/core/contracts/mod-manifest.ts`
  - `src/core/mods/mod-runtime.ts`
  - `src/core/runtime/playable-runtime.ts`
  - `src/core/registry/**`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `src/core/contracts/gameplay-contribution.ts`
  - `src/core/contracts/mod-manifest.ts`
  - `src/core/mods/mod-runtime.ts`
  - `src/core/runtime/playable-runtime.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `save_schema_scope`
  - `house_business_scope`
  - `ui_scope`
  - `scenario_content_scope`
- done_when:
  - `a shared playable-family contribution contract exists or an equivalent manifest-owned intake seam is explicitly defined`
  - `the covered playable runtime path consumes the shared contract instead of relying on hidden builtin fallback`
  - `robustness coverage proves the bounded playable path still resolves correctly`
- verify_with:
  - `npm run build:test`
  - `node --test tests/robustness.test.cjs`
  - `npm run typecheck`
  - `npm run lint:blueprints`
- if_blocked:
  - `record the blocker in this queue doc`
  - `stop rather than widening into a full gameplay contribution rewrite`
- promote_next_if_done: `none`
- stop_if:
  - `the required change expands into unrelated gameplay family migration`
  - `the bounded closure would break current first-party mod activation semantics without a narrower compatibility seam`

#### Human Context

- Purpose:
  - `Land only the playable-family contract and runtime consumption closure needed by the admitted blocker.`
- Failure mode:
  - `Do not turn this task into a generic "finish all contribution families" program.`

##### Implementation Result

- `src/core/contracts/gameplay-contribution.ts` now carries `playables` and `playableIntegrations` as first-class contribution families.`
- `src/core/mods/mod-parser.ts` and `src/core/mods/mod-runtime.ts` now parse, validate, and install playable contribution ids into activated-mod gameplay contribution truth.`
- `src/core/runtime/playable-runtime-registries.ts` now owns the default playable registry bundle and lets startup activation explicitly configure runtime registries from the activated mod while preserving explicit builtin seed installation.`
- `src/core/runtime/playable-runtime.ts`, `src/core/runtime/interactive-runtime.ts`, and `src/main.ts` now consume that activation-configurable default runtime seam instead of hardwiring builtin playable registry constants as the only default path.`

### `task.playable-family-gap-audit.queue-closeout`

#### Control Block

- task_id: `task.playable-family-gap-audit.queue-closeout`
- state: `done`
- scope:
  - `docs/blueprints/**`
  - `docs/change-log.md`
- must_inspect:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
  - `docs/blueprints/queues/playable-family-gap-audit-queue.md`
- must_not_change:
  - `out_of_scope_code_paths`
- done_when:
  - `verification is recorded`
  - `the queue doc is closed or blocked with explicit evidence`
  - `target-level handoff is synchronized`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `record the blocker in this queue doc`
  - `do not mark the queue done without closeout truth`
- promote_next_if_done: `none`
- stop_if:
  - `required verification has not passed`

#### Human Context

- Purpose:
  - `Close the queue in one structured handoff once the bounded playable gap work is complete.`
- Failure mode:
  - `Do not leave the queue half-closed with passed code checks but unsynchronized Blueprint truth.`

## Closeout Decision

- Decision: `close-queue`
- Date: `2026-07-07`
- Verification status: `passed`
- Closeout basis:
  - `The queue was admitted and activated on 2026-07-07 after fresh playable-family evidence was written into the target plan.`
  - `The mod contribution contract now records playable families and playable integrations as activated-mod truth.`
  - `The default playable runtime registries are now explicitly activation-configurable from the activated mod instead of only depending on hidden builtin registry fallback.`
- Verification record:
  - `npm run build:test`
  - `node --test tests/robustness.test.cjs --test-name-pattern "gameplay contribution registry contract exports navigation event scene task and house contribution families|mod runtime contribution activation installs unified gameplay contributions from content sources|playable runtime can configure default registries from activated mod playable contributions"`
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- Return effect:
  - `Return to target-level review with no active queue.`
