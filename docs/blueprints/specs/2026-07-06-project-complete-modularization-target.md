# Project Complete Modularization Target

## Control Block

- target_id: `target.project-complete-modularization`
- version_label: `mod-first-current-period`
- status: `in-progress`
- active_phase: `phase.authoring-closure`
- active_queue: `none`
- required_queues:
  - `queue.core-production-integration`
  - `queue.shell-thinning-and-final-ownerization`
  - `queue.builtin-content-deprivileging-closeout`
- conditional_queues:
  - `queue.state-sync-and-runtime-canonicalization`
  - `queue.unified-contribution-intake-closeout`
  - `queue.playable-family-gap-audit`
  - `queue.authoring-entrypoint-and-fail-closed-closure`
  - `queue.framework-scaffold-and-template-closure`
  - `queue.ui-runtime-contract-consumption`
  - `queue.first-party-mod-acceptance`
  - `queue.historical-residue-disposition`
  - `queue.final-acceptance-closeout`
- optional_queues: []
- historical_queues:
  - `queue.blueprint-workflow-bootstrap`
- blocked_by: []
- classification_overrides:
  - rule_id: `CT1`
    condition:
      - `affects_current_mod_first_acceptance`
      - `fits_current_period_modularization_boundary`
      - `does_not_redefine_target_goal`
    classify_as: `current-target-item`
  - rule_id: `CT2`
    condition:
      - `requires_new_owner_line_closure`
      - `or_requires_new_shared_framework_capability`
      - `or_requires_new_acceptance_story_not_owned_by_closed_queues`
    classify_as: `queue-candidate`
  - rule_id: `CT3`
    condition:
      - `fits_existing_content_schema_and_runtime_path`
      - `no_new_framework_behavior_required`
    classify_as: `content-pipeline-item`
  - rule_id: `CT4`
    condition:
      - `only_replaces_or_adds_assets_under_existing_contract`
      - `no_runtime_or_framework_change_required`
    classify_as: `asset-pipeline-item`
  - rule_id: `CT5`
    condition:
      - `valuable_but_not_required_for_current_target_acceptance`
    classify_as: `future-target-candidate`
  - rule_id: `CT6`
    condition:
      - `accepted_old_structure_not_blocking_current_target`
    classify_as: `historical-residue`
  - rule_id: `CT7`
    condition:
      - `confidence_is_low`
      - `or_evidence_is_incomplete`
      - `or_target_scope_change_is_possible`
    classify_as: `uncertain-needs-review`
- acceptance_gate:
  - `all_required_queues_done_or_dropped`
  - `no_active_task_remaining`
  - `target_acceptance_criteria_passed`
- promote_next_queue_when:
  - `active_queue_is_none_or_done`
  - `fresh_audit_proves_real_blocker`
  - `promotion_evidence_recorded`
  - `promoted_queue_has_valid_control_block`
- close_target_when:
  - `acceptance_gate_passed`
- candidate_queue: []

## Human Context

### Goal

Make `mod-first` modularization the repository's current-period governing target, and push the project from partial mod-first convergence to a fully production-owned mod-first architecture.

For this period, "project complete modularization" means the production path can honestly be described as mod-first rather than "mostly converged":

- builtin content and imported content travel through the same production runtime path
- production runtime ownership no longer depends on unresolved shell-owned or bridge-only glue
- gameplay extension surfaces remain contract-driven and registry-driven rather than scenario-specific or static-table-specific

### Scope

This target applies to:

- production-path modularization still needed after the closed 2026-07-02 and 2026-07-03 queues
- residual engine, save, runtime, state-sync, presenter, and shell-boundary debt that still blocks a fully production-owned mod-first architecture
- queue sequencing for the remaining modularization tracks in this period

This target does not apply to:

- one-off content patches with no modularization value
- reopening the abandoned weekly-plan workflow
- creating a second current-period repository target
- future tooling, hot reload, sandboxing, or authoring ergonomics that are not required for the current production architecture closeout

### Supersession

- `docs/superpowers/**` weekly governance remains historical only.
- The older same-day `core-production-integration` target attempt is superseded as a same-period sibling target; it now belongs as a queue under this period's target.

### Problem Statement

The repository already completed a large amount of mod-first foundational work:

- pack-content decoupling
- runtime spine unification on covered paths
- task runtime mod contract
- house runtime mod registration
- unified gameplay contribution registry
- end-to-end mod-first runtime closure
- startup-family and main-runtime ownerization queues
- the first playable-runtime migration queue

Those completed queues prove that the project is no longer at the "prototype modularization" stage.

But they do not yet automatically prove that the repository is fully done with production modularization.

The remaining target-level issue is that several important seams are now present but not yet uniformly closed on the final production line:

- some production ownership still depends on transitional shell or bridge composition
- later queue work may still be needed before the repository can honestly say the mod-first architecture is fully closed rather than "mostly converged"

This target exists to govern that final period cleanly, without fragmenting the work into multiple same-period targets.

### Phase Transition Note

Phase 2 contribution closure is currently accepted without promoting `queue.unified-contribution-intake-closeout`.

The latest target-level intake audit found that the audited contribution families already route through the shared seams below:

- gameplay contribution contract
- mod manifest contribution declaration
- mod runtime contribution installation
- shared house/playable registry families

The next target-level decision therefore moved to `Phase 3: Authoring Closure`, and that review has now promoted `queue.authoring-entrypoint-and-fail-closed-closure` because same-family scenario-pack/default-pack/house-family authoring still depends on undocumented manual glue or missing fail-closed framework entrypoints.

Current Phase 3 interpretation after later queue progress:

- playable authoring is treated as landed framework-owned evidence through the existing scaffold, validation, package-script, and robustness-test coverage
- scaffolded Phase 3 scenario-pack authoring is now treated as landed framework-owned evidence through repository-owned scaffold/validator entrypoints and the `phase-3-canonical-v1` authoring template marker
- default-pack drift is now treated as fail-closed against the single default scenario-pack catalog entry rather than as an open same-family authoring blocker
- builtin house authoring is now treated as landed framework-owned evidence through the single builtin contribution seed
- legacy builtin scenario-pack manifests that predate `phase-3-canonical-v1` are accepted compatibility residue, not by themselves evidence that a broader scaffold-and-template queue must be promoted
- the remaining Phase 3 blocker is task-local documentation truth: current artifacts must explain which authoring families are framework-owned and which residue is intentionally accepted

### Dependencies

- Blueprint:
  - `docs/blueprints/blueprint.md`
- Latest queue closeout record:
  - `docs/blueprints/queues/authoring-entrypoint-and-fail-closed-closure-queue.md`
- Historical roadmap references:
  - `docs/superpowers/specs/2026-07-02-mod-first-unified-contract-roadmap-design.md`
  - `docs/superpowers/weekly/2026-07-02-mod-first-weekly-review-index.md`
  - `docs/superpowers/weekly/2026-06-29-weekly-next-split-review.md`

### Phase Model

#### Phase 1: Runtime Closure

Goal:

- close the production owner line around startup, save, runtime dispatch, state ownership, and the remaining shell/runtime seam

Phase pass signal:

- the project no longer depends on unresolved transitional engine/save/runtime owner lines to keep the real production path working

#### Phase 2: Contribution Closure

Goal:

- prove that content and gameplay extension families actually enter through shared contract and registry seams rather than hidden builtin-only shortcuts

Phase pass signal:

- builtin and external contributions can be described as same-family intake on the production path without hidden privilege routes

#### Phase 3: Authoring Closure

Goal:

- prove that authors can add same-family extensions through framework-provided entrypoints, templates, validation, and fail-closed rules rather than manual multi-point glue

Phase pass signal:

- adding same-family content or mechanics no longer requires rediscovering undocumented runtime wiring

#### Phase 4: Final Mod-First Acceptance

Goal:

- perform final closeout after the earlier phases pass, classify residue, and prove the repository can honestly be described as fully mod-first

Phase pass signal:

- the target's acceptance criteria can be satisfied without inventing a new contract family or reopening prior phases

### Queue Portfolio

| Queue ID | Class | State | Promote When | Source |
| --- | --- | --- | --- | --- |
| `queue.core-production-integration` | `required` | `done` | `already completed` | `docs/blueprints/queues/core-production-integration-queue.md` |
| `queue.shell-thinning-and-final-ownerization` | `required` | `done` | `already completed` | `docs/blueprints/queues/shell-thinning-and-final-ownerization-queue.md` |
| `queue.state-sync-and-runtime-canonicalization` | `conditional` | `candidate` | `only if a real runtime/state ownership blocker is proven after queue closeout review` | `none` |
| `queue.builtin-content-deprivileging-closeout` | `required` | `done` | `already completed` | `docs/blueprints/queues/builtin-content-deprivileging-closeout-queue.md` |
| `queue.unified-contribution-intake-closeout` | `conditional` | `candidate` | `only if fresh review finds family-specific intake shortcuts outside shared contract/registry seams` | `none` |
| `queue.playable-family-gap-audit` | `conditional` | `candidate` | `only if a still-open playable family gap is proven after foundation review` | `none` |
| `queue.authoring-entrypoint-and-fail-closed-closure` | `conditional` | `done` | `already closed after the Phase 3 authoring queue proved current same-family authoring is coherent without a narrower follow-up queue` | `docs/blueprints/queues/authoring-entrypoint-and-fail-closed-closure-queue.md` |
| `queue.framework-scaffold-and-template-closure` | `conditional` | `candidate` | `only if framework entrypoints remain incomplete outside already-closed slices` | `none` |
| `queue.ui-runtime-contract-consumption` | `conditional` | `candidate` | `only if runtime-facing UI contract consumption still blocks target acceptance` | `none` |
| `queue.first-party-mod-acceptance` | `conditional` | `candidate` | `only after earlier phases pass and acceptance proof is the remaining question` | `none` |
| `queue.historical-residue-disposition` | `conditional` | `candidate` | `only after earlier phases pass and residue needs formal classification` | `none` |
| `queue.final-acceptance-closeout` | `conditional` | `candidate` | `only after earlier phases pass and the target is ready for closeout proof` | `none` |

### Classification Overrides

Current target routing should prefer:

- `current-target-item` when the item directly affects completion of the current mod-first acceptance story
- `queue-candidate` when the item requires a new bounded owner-line closure topic or a new shared framework capability
- `content-pipeline-item` for content/config fill-in under existing schema and runtime paths
- `asset-pipeline-item` for asset replacement/addition under existing contracts
- `future-target-candidate` when the item has value but is not required for this target's acceptance
- `historical-residue` when the issue belongs to accepted older structure and does not block the current target
- `uncertain-needs-review` whenever confidence is low or target-scope impact is unclear

### Acceptance Criteria

The current target may be considered accepted only when all items below are true.

#### 1. Unified Production Path

- builtin content and imported content use the same production activation and runtime path
- no production consumer depends on scenario-specific direct imports as a hidden alternative execution line
- no same-scope legacy path remains required to keep builtin content working after modularized paths are active

#### 2. Ownership Closure

- `src/main.ts` is limited to browser shell input, startup wiring that is still legitimately shell-owned, and render orchestration
- engine/save/runtime/state-sync ownership no longer depends on unresolved transitional owner lines
- no in-scope subsystem remains in the ambiguous state of "new seam exists, but production still silently depends on the old path"

#### 3. Contract-Driven Extension

- gameplay extension surfaces are registered and validated through contracts, registries, or queue-governed framework seams
- builtin-default behavior is not privileged through hidden static-table shortcuts that bypass the mod-facing contract family
- same-problem feature expansion no longer requires editing production shell files just to attach new content or runtime capabilities

#### 4. Queue Closeout Discipline

- all required same-period modularization queues are either `done` or intentionally `dropped`
- no queue remains pseudo-active because the target boundary was never explicitly closed
- target artifacts, queue artifacts, and `docs/change-log.md` agree on the real closeout state
- required queue families are closed in phase order unless a later document records a justified exception

#### 5. Verification Closure

- each promoted queue has recorded its required verification
- no unresolved in-scope `P0` or `P1` remains hidden behind "later cleanup"
- the repository can describe the current production architecture as fully mod-first without relying on historical caveats

### Exit Conditions

- the current Blueprint no longer spawns same-period sibling targets for modularization work
- modularization work is sequenced through queue documents under this target
- the active production path no longer depends on unresolved transitional owner lines in the in-scope engine/save/runtime/shell areas
- previously landed mod-first contract families remain the authoritative path rather than coexisting with hidden parallel legacy paths
- the target satisfies the Modularization Acceptance Criteria above
- `project-progress.md`, `blueprint.md`, target artifacts, and active queues stay synchronized on the current-target model

### Verification Story

- Targeted verification:
  - `docs/blueprints/**` should point consistently to one current target for the current period and queue-driven iteration work under it.
  - each promoted queue must expose current truth, candidate gates, and closeout evidence from Control Blocks alone.
- Required checks:
  - `Document consistency check`
  - `queue-level verification recorded by each promoted queue`

### Artifact Expectations

- Spec path:
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
- Plan path:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
- Expected child artifacts:
  - `docs/blueprints/queues/*.md`
  - `docs/change-log.md`

### Progress Log

- 2026-07-06
  - Summary: `Created the project-complete-modularization target as the current period's formal Blueprint target and added explicit modularization acceptance criteria.`
  - Verification: `Document consistency check plus historical roadmap recheck`
  - Next: `Drive execution from the active core-production-integration queue, then open later queues only if they are still required by the target acceptance criteria.`
- 2026-07-06
  - Summary: `Phase 2 has now advanced from builtin registry/source privilege into runtime-consumer deprivileging after builtin startup activation and builtin house/playable static registry seeds were both converged onto explicit shared seams.`
  - Verification: `Queue progress sync plus npm test`
  - Next: `Verify whether default base-pack bootstrap and builtin-preloaded consumers still block the target's contribution-closure acceptance criteria.`
- 2026-07-06
  - Summary: `The first runtime-consumer deprivileging move is now landed: default-runtime-content no longer self-loads the builtin base pack, but active-content/bootstrap and other builtin-preloaded consumers still need final disposition.`
  - Verification: `Queue progress sync plus npm test`
  - Next: `Verify whether the remaining active-content/bootstrap and UI baseline consumers still block contribution-closure acceptance.`
- 2026-07-06
  - Summary: `A second runtime-consumer deprivileging move is now landed: activation results can preserve multi-pack content sources, and active-content bootstrap now assembles from those activation sources without a separate base-pack handoff from main.ts.`
  - Verification: `Queue progress sync plus npm test`
  - Next: `Verify whether the remaining UI baseline consumers still block contribution-closure acceptance.`
- 2026-07-06
  - Summary: `builtin-content-deprivileging-closeout is now closed: the remaining UI reserve/layout baseline stays off the main startup/runtime path and is therefore classified as accepted framework baseline rather than a live builtin privilege blocker for the current contribution-closure claim.`
  - Verification: `Queue progress sync plus targeted source-path audit and npm test`
  - Next: `Decide at the target-plan level whether a further contribution-intake queue is actually needed before later acceptance work.`
- 2026-07-06
  - Summary: `Rejected promotion of unified-contribution-intake-closeout after a fresh intake audit confirmed that the audited contribution families already enter through shared contract, manifest, runtime-installation, and registry seams, so Phase 2 can close without a new queue.`
  - Verification: `Target-level contribution-intake source audit plus robustness coverage recheck`
  - Next: `Advance to Phase 3 authoring review and decide whether authoring-entrypoint-and-fail-closed-closure is justified.`
- 2026-07-06
  - Summary: `Promoted authoring-entrypoint-and-fail-closed-closure after the Phase 3 audit confirmed that playable tooling is already landed evidence, but scenario-pack/default-pack/house-family authoring still lacks framework-owned entrypoints and fail-closed guards.`
  - Verification: `Target-level authoring source audit plus robustness coverage recheck`
  - Next: `Resume the active Phase 3 queue from scenario-pack-and-default-pack-entrypoint-closure.`
- 2026-07-07
  - Summary: `Recorded that queue.authoring-entrypoint-and-fail-closed-closure is now closed: current Phase 3 authoring is treated as coherent on current evidence, queue.framework-scaffold-and-template-closure was not promoted, and the target returns to promotion-review with no active queue.`
  - Verification: `Target/queue pointer sync check plus npm test`
  - Next: `Use the target plan to decide whether any later-phase queue is actually justified by fresh evidence.`
