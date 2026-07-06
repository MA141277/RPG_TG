# Current Blueprint

## Control Block

- blueprint_id: `blueprint.rpg-tg`
- status: `in-progress`
- active_target: `target.project-complete-modularization`
- active_queue: `queue.authoring-entrypoint-and-fail-closed-closure`
- active_task: `task.authoring-entrypoint-and-fail-closed-closure.scenario-pack-and-default-pack-entrypoint-closure`
- active_phase: `phase.authoring-closure`
- decision_state: `active-execution`
- resume_order:
  - `blueprint`
  - `target`
  - `queue`
  - `task`
- next_step: `Open the active authoring queue and continue task.authoring-entrypoint-and-fail-closed-closure.scenario-pack-and-default-pack-entrypoint-closure.`
- next_file: `docs/blueprints/queues/authoring-entrypoint-and-fail-closed-closure-queue.md`
- execution_mode: `single-active-task`
- allow_parallel: `false`
- blocked_by: []
- classification_rules_ref: `docs/blueprints/classification-rule-layer-spec.md`
- classification_low_confidence_fallback: `uncertain-needs-review`
- candidate_targets: []
- completed_targets: []

## Human Context

### Role

This file is the single current execution index for repository work under the Blueprint workflow.

### Current Status

- Status: `in-progress`
- Last Updated: `2026-07-06`
- Current Focus: `The current blueprint has one current target for this period: project complete modularization. Phase 3 authoring closure is now active through authoring-entrypoint-and-fail-closed-closure because scenario-pack/default-pack/house-family authoring still depends on manual multi-point glue.`
- Current Target Spec:
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
- Current Target Plan:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
- Active Queue:
  - `queue.authoring-entrypoint-and-fail-closed-closure`
- Active Queue Task:
  - `task.authoring-entrypoint-and-fail-closed-closure.scenario-pack-and-default-pack-entrypoint-closure`
- Next Step:
  - `Resume the active Phase 3 queue from scenario-pack-and-default-pack-entrypoint-closure.`
- Verification:
  - `Current-target Blueprint documents, explicit acceptance rules, and first queue artifacts exist.`
- Notes:
  - `Blueprint may have multiple targets across different periods, but this period must keep exactly one current target. Add same-period modularization work through queue documents instead.`

### Current Target

- Target:
  - `project complete modularization`
- Target id:
  - `target.project-complete-modularization`
- Role:
  - `Drive the repository from partial mod-first convergence to a fully production-owned mod-first architecture.`
- Governing artifacts:
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`

### Classification Layer

- Rule layer:
  - `docs/blueprints/classification-rule-layer-spec.md`
- Default behavior:
  - `Classify first, route second, promote later.`
- Low-confidence fallback:
  - `uncertain-needs-review`
- Human intervention:
  - `Only for low confidence, conflicting rules, or high-impact promotions.`

### Queue Portfolio

| Queue ID | Class | State | Role | Source |
| --- | --- | --- | --- | --- |
| `queue.core-production-integration` | `required` | `done` | Close engine/save/runtime ownership gaps that blocked cleaner modular boundaries. | `docs/blueprints/queues/core-production-integration-queue.md` |
| `queue.shell-thinning-and-final-ownerization` | `required` | `done` | Close the audited shell/view owner residue in `src/main.ts` and record the remaining accepted shell boundary. | `docs/blueprints/queues/shell-thinning-and-final-ownerization-queue.md` |
| `queue.state-sync-and-runtime-canonicalization` | `conditional` | `candidate` | Reopen only if a real runtime/state ownership blocker is proven after queue closeout review. | `none` |
| `queue.builtin-content-deprivileging-closeout` | `required` | `done` | Remove or explicitly disposition the currently-proven builtin-only production privilege paths blocking the shared mod-facing family claim. | `docs/blueprints/queues/builtin-content-deprivileging-closeout-queue.md` |
| `queue.unified-contribution-intake-closeout` | `conditional` | `candidate` | Keep as conditional fallback only if a later audit proves a still-live family-specific intake shortcut outside the shared contract and registry seams. | `none` |
| `queue.playable-family-gap-audit` | `conditional` | `candidate` | Audit whether any still-active playable family remains outside the landed playable runtime foundation. | `none` |
| `queue.authoring-entrypoint-and-fail-closed-closure` | `conditional` | `active` | Prove that same-family authoring uses framework-owned entrypoints and fails closed. | `docs/blueprints/queues/authoring-entrypoint-and-fail-closed-closure-queue.md` |
| `queue.framework-scaffold-and-template-closure` | `conditional` | `candidate` | Extend scaffold, validator, template, and CI ownership where modularization acceptance still needs it. | `none` |
| `queue.ui-runtime-contract-consumption` | `conditional` | `candidate` | Audit whether UI/runtime integration still blocks final modular ownership claims. | `none` |
| `queue.first-party-mod-acceptance` | `conditional` | `candidate` | Prove builtin content now behaves like first-party mod content on the production path. | `none` |
| `queue.historical-residue-disposition` | `conditional` | `candidate` | Classify remaining modularization residue into accepted history, queued migration, or explicit out-of-scope status. | `none` |
| `queue.final-acceptance-closeout` | `conditional` | `candidate` | Close the current-period complete-modularization target after earlier phases pass. | `none` |
| `queue.blueprint-workflow-bootstrap` | `historical` | `done` | Historical record of the workflow bootstrap and handoff into the current-target model. | `docs/blueprints/queues/blueprint-workflow-bootstrap-queue.md` |

### Resume Notes

1. Read the `## Control Block` first.
2. Open the current target spec and plan.
3. If `active_queue = none`, do not fabricate placeholder task execution.
4. Resume from the target-level promotion decision and only promote the next queue after its gate conditions are recorded.

### Progress Log

- 2026-07-06
  - Summary: `Created the Blueprint workflow owner document and linked it to the new global entry file and bootstrap queue.`
  - Verification: `Document existence check`
  - Next: `Onboard the first real modularization queue.`
- 2026-07-06
  - Summary: `Normalized the Blueprint model so different periods may have different targets, while the current period keeps project complete modularization as the one current target and moves core-production-integration under it as an active queue.`
  - Verification: `Document consistency check`
  - Next: `Resume the active queue task from the complete-modularization target plan.`
- 2026-07-06
  - Summary: `Accepted the active queue baseline reconcile and advanced the current execution pointer to task.core-production-integration.engine-owner-line.`
  - Verification: `Blueprint pointer sync check against the active queue`
  - Next: `Keep the current target in Phase 1 and resolve the orphaned engine seam direction.`
- 2026-07-06
  - Summary: `Accepted the retirement of the orphaned core engine seam and advanced the current execution pointer to task.core-production-integration.save-envelope-cutover.`
  - Verification: `Blueprint pointer sync check against the active queue after targeted verification passed`
  - Next: `Keep the current target in Phase 1 and close the production save owner gap.`
- 2026-07-06
  - Summary: `Accepted the save-envelope cutover and advanced the current execution pointer to task.core-production-integration.runtime-ownership-closeout.`
  - Verification: `Blueprint pointer sync check against the active queue after targeted save/startup verification passed`
  - Next: `Keep the current target in Phase 1 and decide whether further runtime/state canonicalization is still required.`
- 2026-07-06
  - Summary: `Accepted the core-production-integration closeout and removed any current active queue after concluding that remaining Phase 1 residue is shell-thinning-oriented rather than state-sync canonicalization debt.`
  - Verification: `Blueprint pointer sync check against the closed queue and target plan`
  - Next: `If Phase 1 continues, promote shell-thinning-and-final-ownerization as the next queue.`
- 2026-07-06
  - Summary: `Promoted shell-thinning-and-final-ownerization as the new active Phase 1 queue and pointed execution to its baseline-reconcile task.`
  - Verification: `Blueprint pointer sync check against the new active queue`
  - Next: `Reconcile the narrowed shell residue baseline in main.ts and start the first justified ownerization task.`
- 2026-07-06
  - Summary: `Accepted the shell-thinning baseline reconcile and advanced execution to view-transition-ownerization as the first formal extraction task.`
  - Verification: `Blueprint pointer sync check against the updated active queue task`
  - Next: `Remove the covered leave-city and city-3d direct mutation blocks from main.ts through an explicit owner seam.`
- 2026-07-06
  - Summary: `Accepted shell-thinning view-transition-ownerization and advanced execution to travel-and-auto-advance-ownerization as the next formal extraction task.`
  - Verification: `Blueprint pointer sync check plus npm test`
  - Next: `Remove the covered campaign travel completion and map auto-advance direct state-transition blocks from main.ts through an explicit owner seam.`
- 2026-07-06
  - Summary: `Accepted shell-thinning travel-and-auto-advance-ownerization and advanced execution to render-prepass-ownerization as the next formal extraction task.`
  - Verification: `Blueprint pointer sync check plus npm test`
  - Next: `Recheck render-prepass write-back and decide whether it still blocks the shell-owned main.ts claim.`
- 2026-07-06
  - Summary: `Accepted shell-thinning render-prepass-ownerization after renderAppFrame() stopped mutating appState directly through ensureCityNpcPoolsForCurrentDay().`
  - Verification: `Blueprint pointer sync check plus npm test`
  - Next: `Run shell-thinning queue closeout and decide whether any further Phase 1 promotion is justified.`
- 2026-07-06
  - Summary: `Accepted shell-thinning-and-final-ownerization queue closeout and removed any current active queue after the residue audit found no present need for state-sync-and-runtime-canonicalization.`
  - Verification: `Blueprint pointer sync check against the closed queue plus npm test`
  - Next: `Use the target plan to decide whether the current target can now advance from Phase 1 to Phase 2 queue promotion.`
- 2026-07-06
  - Summary: `Promoted builtin-content-deprivileging-closeout as the new active Phase 2 queue after the builtin privilege audit found live production shortcuts across registries, startup defaults, and UI reserve layering.`
  - Verification: `Blueprint pointer sync check plus builtin privilege source audit`
  - Next: `Freeze the active queue baseline and classify which builtin shortcuts must actually be deprivileged in this queue.`
- 2026-07-06
  - Summary: `Accepted builtin-content-deprivileging baseline-reconcile after the queue classified static registry seeds, direct builtin startup activation, and base-pack bootstrap as the first real Phase 2 blockers.`
  - Verification: `Blueprint pointer sync check plus queue baseline audit`
  - Next: `Resolve builtin registry and loader privilege before widening to runtime-consumer deprivileging.`
- 2026-07-06
  - Summary: `Accepted the first builtin-registry-and-loader-audit move after main.ts stopped directly constructing the builtin startup loaded mod and now routes builtin startup through the shared builtin loader seam.`
  - Verification: `Blueprint pointer sync check plus npm test`
  - Next: `Keep builtin-registry-and-loader-audit active and continue on static builtin house/playable registry seeds.`
- 2026-07-06
  - Summary: `Accepted builtin-registry-and-loader-audit closeout after builtin house/playable static seeds moved to explicit builtin registry installer modules and the shared runtime consumers stopped depending on hidden generic registry seeds.`
  - Verification: `Blueprint pointer sync check plus npm test`
  - Next: `Keep Phase 2 active and resume runtime-consumer-deprivileging.`
- 2026-07-06
  - Summary: `Accepted the first runtime-consumer-deprivileging move after default-runtime-content.ts stopped importing the builtin base-pack loader directly and now requires main.ts to inject the default pack explicitly.`
  - Verification: `Blueprint pointer sync check plus npm test`
  - Next: `Keep Phase 2 active and continue on active-content/bootstrap plus remaining builtin-preloaded consumer assumptions.`
- 2026-07-06
  - Summary: `Accepted the second runtime-consumer-deprivileging move after scenario activation started preserving multi-pack normalized content sources and active-game-content bootstrap stopped requiring a separate basePack argument from main.ts startup assembly.`
  - Verification: `Blueprint pointer sync check plus npm test`
  - Next: `Keep Phase 2 active and continue on the remaining builtin-preloaded UI/content consumer assumptions.`
- 2026-07-06
  - Summary: `Accepted builtin-content-deprivileging-closeout queue closeout after the runtime-consumer audit confirmed that the remaining UI reserve layering is not a main-runtime consumer and therefore stays classified as accepted framework baseline rather than a live builtin privilege blocker.`
  - Verification: `Blueprint pointer sync check plus targeted source-path audit and npm test`
  - Next: `Use the target plan to decide whether another Phase 2 queue should be promoted or whether queue promotion should pause.`
- 2026-07-06
  - Summary: `Rejected promotion of unified-contribution-intake-closeout after the current target's intake audit reconfirmed that gameplay contribution intake, manifest declaration, mod runtime installation, and shared house/playable registries already cover the audited contribution families through shared seams.`
  - Verification: `Blueprint pointer sync check plus targeted contribution-intake source audit and robustness coverage recheck`
  - Next: `Advance to the Phase 3 authoring review and decide whether authoring-entrypoint-and-fail-closed-closure should be promoted next.`
- 2026-07-06
  - Summary: `Promoted authoring-entrypoint-and-fail-closed-closure as the active Phase 3 queue after the authoring audit confirmed that the remaining blocker is framework-owned authoring entrypoints, not runtime intake.`
  - Verification: `Blueprint pointer sync check plus targeted authoring source audit`
  - Next: `Resume the active queue from scenario-pack-and-default-pack-entrypoint-closure.`
