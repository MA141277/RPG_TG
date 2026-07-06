# Project Complete Modularization Target

## Goal

Make `mod-first` modularization the repository's current-period governing target, and push the project from partial mod-first convergence to a fully production-owned mod-first architecture.

For this period, "project complete modularization" means the production path can honestly be described as mod-first rather than "mostly converged":

- builtin content and imported content travel through the same production runtime path
- production runtime ownership no longer depends on unresolved shell-owned or bridge-only glue
- gameplay extension surfaces remain contract-driven and registry-driven rather than scenario-specific or static-table-specific

## Scope

This target applies to:

- production-path modularization still needed after the closed 2026-07-02 and 2026-07-03 queues
- residual engine, save, runtime, state-sync, presenter, and shell-boundary debt that still blocks a fully production-owned mod-first architecture
- queue sequencing for the remaining modularization tracks in this period

This target does not apply to:

- one-off content patches with no modularization value
- reopening the abandoned weekly-plan workflow
- creating a second current-period repository target
- future tooling, hot reload, sandboxing, or authoring ergonomics that are not required for the current production architecture closeout

## Supersession

- `docs/superpowers/**` weekly governance remains historical only.
- The older same-day `core-production-integration` target attempt is superseded as a same-period sibling target; it now belongs as a queue under this period's target.

## Problem Statement

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
- core save and engine seams still need final adopt-vs-retire decisions on real production paths
- later queue work may still be needed before the repository can honestly say the mod-first architecture is fully closed rather than "mostly converged"

This target exists to govern that final period cleanly, without fragmenting the work into multiple same-period targets.

## Dependencies

- Blueprint:
  - `docs/blueprints/blueprint.md`
- Current active queue:
  - `docs/blueprints/queues/core-production-integration-queue.md`
- Historical roadmap references:
  - `docs/superpowers/specs/2026-07-02-mod-first-unified-contract-roadmap-design.md`
  - `docs/superpowers/weekly/2026-07-02-mod-first-weekly-review-index.md`
  - `docs/superpowers/weekly/2026-06-29-weekly-next-split-review.md`

## In Scope

- define project complete modularization as the one current Blueprint target for this period
- keep all same-period modularization work inside queue families rather than new sibling targets
- close remaining production-path modularization debt that still affects engine/save/runtime/state-sync/shell boundaries
- keep previously closed mod-first queues treated as landed foundation rather than silently reopened execution controllers
- define which queue families still belong to this target before it can close

## Out Of Scope

- queue-local code steps
- queue-local file maps
- reopening already closed historical queues as if they were still active
- toolchain ergonomics or editor workflows that are not needed for the production mod-first architecture closeout

## Phase Model

The current target uses four acceptance phases.

### Phase 1: Runtime Closure

Goal:

- close the production owner line around startup, save, runtime dispatch, state ownership, and the remaining shell/runtime seam

Phase pass signal:

- the project no longer depends on unresolved transitional engine/save/runtime owner lines to keep the real production path working

### Phase 2: Contribution Closure

Goal:

- prove that content and gameplay extension families actually enter through shared contract and registry seams rather than hidden builtin-only shortcuts

Phase pass signal:

- builtin and external contributions can be described as same-family intake on the production path without hidden privilege routes

### Phase 3: Authoring Closure

Goal:

- prove that authors can add same-family extensions through framework-provided entrypoints, templates, validation, and fail-closed rules rather than manual multi-point glue

Phase pass signal:

- adding same-family content or mechanics no longer requires rediscovering undocumented runtime wiring

### Phase 4: Final Mod-First Acceptance

Goal:

- perform final closeout after the earlier phases pass, classify residue, and prove the repository can honestly be described as fully mod-first

Phase pass signal:

- the target's acceptance criteria can be satisfied without inventing a new contract family or reopening prior phases

## Queue Families Under This Target

### Phase 1: Runtime Closure

- `core-production-integration`
  - Active queue for closing the remaining production owner-line debt around engine/save/runtime integration.
- `shell-thinning-and-final-ownerization`
  - Promote only if `src/main.ts` still holds production business orchestration that cannot be justified as browser-shell ownership after earlier Phase 1 work closes.
- `state-sync-and-runtime-canonicalization`
  - Promote only if the active queue proves canonical runtime/state ownership is still a real blocker.

### Phase 2: Contribution Closure

- `builtin-content-deprivileging-closeout`
  - Promote only if later review still finds builtin-only production privilege paths.
- `unified-contribution-intake-closeout`
  - Promote only if later review still finds family-specific intake shortcuts outside shared contract and registry seams.
- `playable-family-gap-audit`
  - Promote only if a still-open playable family gap is proven after the current playable foundation recheck.

### Phase 3: Authoring Closure

- `authoring-entrypoint-and-fail-closed-closure`
  - Promote only if same-family authoring still requires manual glue across multiple runtime entrypoints.
- `framework-scaffold-and-template-closure`
  - Promote only if current framework entrypoints are still incomplete outside the already-closed playable slice.
- `ui-runtime-contract-consumption`
  - Promote only if runtime-facing UI contract consumption is still required for target acceptance.

### Phase 4: Final Mod-First Acceptance

- `first-party-mod-acceptance`
  - Promote only after earlier phases pass and builtin content can be judged as first-party mod content rather than privileged framework payload.
- `historical-residue-disposition`
  - Promote only after earlier phases pass and remaining residue needs formal classification into accepted history, queued migration, or out-of-scope.
- `final-acceptance-closeout`
  - Promote only after earlier phases pass and the target is ready for final acceptance proof.

### Historical Foundation Queues

- closed mod-first continuation queues from `docs/superpowers/**`
- closed startup/main-runtime ownerization queues from `docs/superpowers/**`
- closed first playable-runtime migration queue from `docs/superpowers/**`

These remain target inputs and historical proof, not active queue controllers.

## Phase-To-Queue Mapping

### Phase 1: Runtime Closure

- `core-production-integration`
- `shell-thinning-and-final-ownerization`
- `state-sync-and-runtime-canonicalization`

### Phase 2: Contribution Closure

- `builtin-content-deprivileging-closeout`
- `unified-contribution-intake-closeout`
- `playable-family-gap-audit`

### Phase 3: Authoring Closure

- `authoring-entrypoint-and-fail-closed-closure`
- `framework-scaffold-and-template-closure`
- `ui-runtime-contract-consumption`

### Phase 4: Final Mod-First Acceptance

- `first-party-mod-acceptance`
- `historical-residue-disposition`
- `final-acceptance-closeout`

## Modularization Acceptance Criteria

The current target may be considered accepted only when all items below are true.

### 1. Unified Production Path

- builtin content and imported content use the same production activation and runtime path
- no production consumer depends on scenario-specific direct imports as a hidden alternative execution line
- no same-scope legacy path remains required to keep builtin content working after modularized paths are active

### 2. Ownership Closure

- `src/main.ts` is limited to browser shell input, startup wiring that is still legitimately shell-owned, and render orchestration
- engine/save/runtime/state-sync ownership no longer depends on unresolved transitional owner lines
- no in-scope subsystem remains in the ambiguous state of "new seam exists, but production still silently depends on the old path"

### 3. Contract-Driven Extension

- gameplay extension surfaces are registered and validated through contracts, registries, or queue-governed framework seams
- builtin-default behavior is not privileged through hidden static-table shortcuts that bypass the mod-facing contract family
- same-problem feature expansion no longer requires editing production shell files just to attach new content or runtime capabilities

### 4. Queue Closeout Discipline

- all required same-period modularization queues are either `done` or intentionally `dropped`
- no queue remains pseudo-active because the target boundary was never explicitly closed
- target artifacts, queue artifacts, and `docs/change-log.md` agree on the real closeout state
- required queue families are closed in phase order unless a later document records a justified exception

### 5. Verification Closure

- each promoted queue has recorded its required verification
- no unresolved in-scope `P0` or `P1` remains hidden behind "later cleanup"
- the repository can describe the current production architecture as fully mod-first without relying on historical caveats

## Exit Conditions

- the current Blueprint no longer spawns same-period sibling targets for modularization work
- modularization work is sequenced through queue documents under this target
- the active production path no longer depends on unresolved transitional owner lines in the in-scope engine/save/runtime/shell areas
- previously landed mod-first contract families remain the authoritative path rather than coexisting with hidden parallel legacy paths
- the target satisfies the Modularization Acceptance Criteria above
- `project-progress.md`, `blueprint.md`, target artifacts, and active queues stay synchronized on the current-target model

## Verification Story

- Targeted verification:
  - `docs/blueprints/**` should point consistently to one current target for the current period and queue-driven iteration work under it.
  - each active queue promoted under this target must prove a real production ownership claim, not just helper existence
- Required checks:
  - `Document consistency check`
  - queue-level verification recorded by each promoted queue

## Artifact Expectations

- Spec path:
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
- Plan path:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
- Expected child artifacts:
  - `docs/blueprints/queues/*.md`
  - `docs/change-log.md`

## Progress Log

- 2026-07-06
  - Summary: `Created the project-complete-modularization target as the current period's formal Blueprint target and added explicit modularization acceptance criteria.`
  - Verification: `Document consistency check plus historical roadmap recheck`
  - Next: `Drive execution from the active core-production-integration queue, then open later queues only if they are still required by the target acceptance criteria.`
