# Project Complete Modularization Target Plan

**Goal:** Keep the repository on one current-period complete-modularization target and sequence the remaining production modularization work through queues.

**Architecture:** This is the target-level governor for the current `mod-first` completion period. It does not replace queue-local task planning. It decides which queue is active, what queue family comes next, and how queue closeout rolls up into the current target.

**Tech Stack:** `docs/blueprints/**`, `docs/change-log.md`, queue documents under `docs/blueprints/queues/`, historical roadmap references under `docs/superpowers/**`

## Execution State

- Status: `in-progress`
- Last Updated: `2026-07-06`
- Current Focus: `The first formal target for this period remains project complete modularization. core-production-integration is now closed, and the next Phase 1 decision is whether to promote shell-thinning-and-final-ownerization.`
- Next Step: `Review the closed core-production-integration queue and promote shell-thinning-and-final-ownerization only if Phase 1 should continue.`
- Verification: `Document consistency check plus historical roadmap recheck`
- Notes: `Later periods may define different targets, but same-period modularization tracks should enter as queues under the current target.`

## Progress Log

- 2026-07-06
  - Summary: `Formalized the current-period target as project complete modularization, aligned its target artifacts, and set core-production-integration as the first active queue under it.`
  - Verification: `Document consistency check plus historical roadmap recheck`
  - Next: `Resume the active queue task.`
- 2026-07-06
  - Summary: `Accepted the core-production-integration queue closeout after engine retirement, save-envelope cutover, and runtime ownership audit.`
  - Verification: `Queue closeout verification plus pointer sync`
  - Next: `If Phase 1 continues, promote shell-thinning-and-final-ownerization instead of state-sync-and-runtime-canonicalization.`

---

## Based On Spec

- Blueprint:
  - `docs/blueprints/blueprint.md`
- Primary spec:
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`

## Period Baseline

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
  - production integration residue
  - possible bridge/state canonicalization residue
  - possible presenter/layout or shell-thinning residue after earlier queues close

## Queue Policy

- There is one current target in the current execution period.
- Concrete work enters through queue documents.
- Only one queue task may be `active` repository-wide unless a stronger written reason says otherwise.
- Finished queue work should roll up into this plan's progress log, not spawn a second same-period target.
- Closed historical queues remain evidence and input, not active controllers.

## Queue Portfolio

### Phase 1: Runtime Closure

1. `core-production-integration`
2. `shell-thinning-and-final-ownerization`
   - Promote only if `src/main.ts` still owns unjustified production business orchestration after the active queue closes.
3. `state-sync-and-runtime-canonicalization`
   - Promote only if the active queue proves canonical runtime/state ownership is still a real blocker.

### Phase 2: Contribution Closure

4. `builtin-content-deprivileging-closeout`
   - Promote only if later review still finds builtin-only production privilege paths.
5. `unified-contribution-intake-closeout`
   - Promote only if later review still finds family-specific intake shortcuts outside shared contract/registry seams.
6. `playable-family-gap-audit`
   - Promote only if a still-open playable family gap is proven after the current playable foundation recheck.

### Phase 3: Authoring Closure

7. `authoring-entrypoint-and-fail-closed-closure`
   - Promote only if same-family authoring still requires manual glue across multiple runtime entrypoints.
8. `framework-scaffold-and-template-closure`
   - Promote only if current framework entrypoints are still incomplete outside the already-closed playable slice.
9. `ui-runtime-contract-consumption`
   - Promote only if runtime-facing UI contract consumption is still required for target acceptance.

### Phase 4: Final Mod-First Acceptance

10. `first-party-mod-acceptance`
11. `historical-residue-disposition`
12. `final-acceptance-closeout`

## Queue Family Cards

### `core-production-integration`

- Goal:
  - `Close the still-open production owner-line decisions around engine, save, and runtime integration.`
- Promote when:
  - `This queue is already active as the entry queue for the current target.`
- Out of scope:
  - `Presenter/layout redesign, full task runtime extraction, full house runtime extraction, or unrelated cleanup.`
- Done when:
  - `The legal engine owner line is recorded, production save flow is routed through the chosen core path, and runtime closeout notes prove the queue's owner-line claim.`

### `shell-thinning-and-final-ownerization`

- Goal:
  - `Remove any remaining unjustified production business orchestration from src/main.ts after runtime integration is stable.`
- Promote when:
  - `Phase 1 review still shows src/main.ts owning real production business flow that cannot be defended as shell-only work.`
- Out of scope:
  - `Pure style cleanup, arbitrary file splitting, or reopening already-closed startup/runtime moves with no new owner-line evidence.`
- Done when:
  - `main.ts is reduced to shell input, shell scheduling, and render orchestration, with any remaining business owner lines explicitly justified.`

### `state-sync-and-runtime-canonicalization`

- Goal:
  - `Resolve whether remaining runtime/state-sync bridge seams are canonical production owners or transitional residue.`
- Promote when:
  - `The active queue closes but a real production path still depends on ambiguous state-sync or runtime bridge ownership.`
- Out of scope:
  - `Rewriting healthy runtime contracts just for symmetry, or reopening queue-local work already closed by stronger owner lines.`
- Done when:
  - `The repository can point to one canonical runtime/state owner path for in-scope flows, with any duplicate bridge left only as accepted compatibility residue or retired.`

### `builtin-content-deprivileging-closeout`

- Goal:
  - `Remove or document any remaining builtin-only production privilege path that bypasses the mod-facing contract family.`
- Promote when:
  - `Later review still finds builtin content entering production through shortcut imports, privileged tables, or hardwired activation exceptions.`
- Out of scope:
  - `New content authoring features that do not change builtin privilege, or queue-local runtime work already handled in Phase 1.`
- Done when:
  - `Builtin content can be described as using the same intake and activation family as imported content for the in-scope production path.`

### `unified-contribution-intake-closeout`

- Goal:
  - `Prove that major contribution families enter through shared contracts and registries instead of hidden family-specific intake seams.`
- Promote when:
  - `A later audit still finds live extension families attaching through non-shared intake routes outside the established contract/registry surface.`
- Out of scope:
  - `Inventing new family systems without evidence, or reopening contribution families already proven and closed by earlier queues.`
- Done when:
  - `The in-scope extension families have one explainable production intake story that does not depend on hidden builtin shortcuts.`

### `playable-family-gap-audit`

- Goal:
  - `Audit whether any still-active playable family remains outside the already-landed playable runtime foundation.`
- Promote when:
  - `There is concrete evidence that a playable family still runs on a privileged or split owner path after the current foundation review.`
- Out of scope:
  - `Rebuilding the playable framework from scratch or expanding into unrelated interaction systems with no remaining gap proof.`
- Done when:
  - `All in-scope playable families are either proven closed on the shared path, queued for a concrete follow-up, or explicitly accepted as out of scope for this target.`

### `authoring-entrypoint-and-fail-closed-closure`

- Goal:
  - `Prove that same-family authoring enters through framework-owned entrypoints and fails closed when artifacts are incomplete or invalid.`
- Promote when:
  - `Later review still shows authors needing undocumented multi-point glue edits to add same-family content or mechanics.`
- Out of scope:
  - `General editor UX improvements, quality-of-life scripting, or framework expansion with no acceptance impact.`
- Done when:
  - `The in-scope authoring path is explicit, documented, validated, and refuses broken additions instead of silently accepting them.`

### `framework-scaffold-and-template-closure`

- Goal:
  - `Extend scaffold, template, validator, and CI ownership beyond the already-closed slices where that work is still needed for modularization acceptance.`
- Promote when:
  - `The target still depends on manual file placement or undocumented artifact structure outside the currently-closed scaffold coverage.`
- Out of scope:
  - `Overbuilding generators for speculative families or replacing simple static docs where no framework ownership gap exists.`
- Done when:
  - `The remaining in-scope extension families have a framework-owned way to start correctly and a validator or equivalent guard to keep them honest.`

### `ui-runtime-contract-consumption`

- Goal:
  - `Close any remaining case where UI or presentation layers still consume runtime behavior through privileged direct knowledge instead of shared contracts.`
- Promote when:
  - `Later review proves the final modularization claim is blocked by runtime-facing UI paths that bypass the intended contract surfaces.`
- Out of scope:
  - `Visual redesign, CSS cleanup, or broad presenter architecture work that does not affect modular ownership claims.`
- Done when:
  - `The in-scope UI/runtime interactions can be explained through stable contracts rather than concrete feature branches.`

### `first-party-mod-acceptance`

- Goal:
  - `Demonstrate that builtin content now behaves like first-party mod content rather than privileged framework payload on the production path.`
- Promote when:
  - `Earlier phases pass and the remaining question is acceptance proof rather than new owner-line implementation work.`
- Out of scope:
  - `Fresh modularization rewrites that belong in earlier phases.`
- Done when:
  - `A concrete acceptance note can show builtin-first-party parity on the target's in-scope production surfaces.`

### `historical-residue-disposition`

- Goal:
  - `Classify any remaining modularization residue into accepted history, queued migration, or explicit out-of-scope status.`
- Promote when:
  - `Earlier phases pass but the repository still has residual seams that must be dispositioned before final closeout.`
- Out of scope:
  - `Using residue review as a backdoor to reopen broad implementation work without a new owner-line claim.`
- Done when:
  - `Every remaining residue item relevant to this target has an explicit recorded disposition.`

### `final-acceptance-closeout`

- Goal:
  - `Close the current-period complete-modularization target with synchronized acceptance records across blueprint, target, queue, and change-log artifacts.`
- Promote when:
  - `Earlier phases and any required residue disposition work have passed.`
- Out of scope:
  - `New feature work or further architecture expansion beyond what the target acceptance criteria require.`
- Done when:
  - `The target's acceptance criteria are satisfied and all workflow artifacts agree on the final current-period closeout state.`

## Active Queue

- Queue:
  - `none`
- Active task:
  - `none`

## Target-Level Tasks

- [ ] Keep `project-progress.md`, `blueprint.md`, and the current target artifacts synchronized.
- [ ] Keep exactly one active queue task across the repository unless explicitly overridden.
- [ ] Add same-period modularization tracks as new queues under this target instead of creating replacement targets for the same period.
- [ ] Keep queue promotion aligned with the phase model recorded in the target spec unless an explicit exception is documented.
- [ ] Promote a candidate queue family only after the current queue proves it is still needed.
- [ ] Roll queue closeout back into this target plan and `docs/change-log.md`.

## Exit Check

- [ ] The current Blueprint still has exactly one current target for this period.
- [ ] Concrete modularization work is represented through queues.
- [ ] Previously closed mod-first foundations remain treated as landed history rather than reopened controllers.
- [ ] Active queue pointers are synchronized across the Blueprint entry chain.
- [ ] The target's modularization acceptance criteria are satisfied before closeout.

## Completion Checklist

- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Queue pointers updated when the active queue changes
