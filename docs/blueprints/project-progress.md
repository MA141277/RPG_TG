# Project Progress

## Control Block

- entry_id: `project-progress.rpg-tg`
- status: `in-progress`
- active_blueprint: `blueprint.rpg-tg`
- active_target: `target.project-complete-modularization`
- active_phase: `phase.authoring-closure`
- active_queue: `queue.authoring-entrypoint-and-fail-closed-closure`
- active_task: `task.authoring-entrypoint-and-fail-closed-closure.scenario-pack-and-default-pack-entrypoint-closure`
- decision_state: `active-execution`
- execution_mode: `single-active-task`
- allow_parallel: `false`
- blocked_by: []
- resume_order:
  - `project-progress`
  - `blueprint`
  - `target`
  - `queue`
  - `task`
- next_file: `docs/blueprints/queues/authoring-entrypoint-and-fail-closed-closure-queue.md`
- next_step: `Resume the active Phase 3 queue from task.authoring-entrypoint-and-fail-closed-closure.scenario-pack-and-default-pack-entrypoint-closure and close the first shared authoring entrypoint blocker without widening into generic content fill work.`
- candidate_queues: []
- completed_queues:
  - `queue.core-production-integration`
  - `queue.shell-thinning-and-final-ownerization`
  - `queue.builtin-content-deprivileging-closeout`
- classification_layer: `docs/blueprints/classification-rule-layer-spec.md`

## Human Context

### Current Source Of Truth

- Workflow spec:
  - `docs/blueprints/blueprint-workflow-spec.md`
- Current owner document:
  - `docs/blueprints/blueprint.md`
- Classification layer:
  - `docs/blueprints/classification-rule-layer-spec.md`

### Global State

- Status: `in-progress`
- Last Updated: `2026-07-06`
- Current Focus: `The Blueprint workflow now governs one current-period repository target: project complete modularization under mod-first. Phase 3 authoring closure is now active through authoring-entrypoint-and-fail-closed-closure after the latest audit confirmed that scenario-pack/default-pack/house-family authoring still depends on manual glue.`
- Active Blueprint:
  - `docs/blueprints/blueprint.md`
- Current Target Spec:
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
- Current Target Plan:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
- Active Phase:
  - `Phase 3: Authoring Closure`
- Active Queue:
  - `queue.authoring-entrypoint-and-fail-closed-closure`
- Active Queue Task:
  - `task.authoring-entrypoint-and-fail-closed-closure.scenario-pack-and-default-pack-entrypoint-closure`
- Next Step:
  - `Open the active authoring queue and continue the scenario-pack/default-pack authoring-entrypoint closure task.`
- Verification:
  - `Blueprint spec, current-target docs, explicit target acceptance rules, bootstrap handoff record, and first modularization queue are present.`
- Notes:
  - `Old docs/superpowers/** governance files remain historical reference only. Do not resume new execution from them.`

### Resume Protocol

1. Open `docs/blueprints/project-progress.md`.
2. Read the `## Control Block`.
3. Open `docs/blueprints/blueprint.md`.
4. Open the current target spec and current target plan.
5. If `active_queue = none`, resume from the target plan's promotion review instead of inventing a placeholder queue.
6. Only open a queue after the target-level promotion gate is explicitly satisfied.

### Queue Snapshot

| Queue | Current State | Current Source | Next Action |
| --- | --- | --- | --- |
| `core-production-integration` | `done` | `docs/blueprints/queues/core-production-integration-queue.md` | Use as closeout record; no new Phase 1 engine/save/runtime queue is justified right now. |
| `shell-thinning-and-final-ownerization` | `done` | `docs/blueprints/queues/shell-thinning-and-final-ownerization-queue.md` | Use as closeout record; keep main.ts shell residue accepted unless a stronger blocker is proven later. |
| `builtin-content-deprivileging-closeout` | `done` | `docs/blueprints/queues/builtin-content-deprivileging-closeout-queue.md` | Use as closeout record and decide whether a broader contribution-intake queue is actually justified. |
| `authoring-entrypoint-and-fail-closed-closure` | `active` | `docs/blueprints/queues/authoring-entrypoint-and-fail-closed-closure-queue.md` | Close the current Phase 3 blocker family around scenario-pack/default-pack/house-family authoring entrypoints and fail-closed rules. |
| `blueprint-workflow-bootstrap` | `done` | `docs/blueprints/queues/blueprint-workflow-bootstrap-queue.md` | Keep as historical workflow bootstrap record only. |
| `legacy-superpowers-history` | `historical-only` | `docs/superpowers/**` | Use only for reference, not for new execution control. |

### Progress Log

- 2026-07-06
  - Summary: `Created the Blueprint workflow spec as the new rule source and established docs/blueprints/ as the new governance root.`
  - Verification: `Document existence check`
  - Next: `Create the global entry, owner document, bootstrap queue, and templates.`
- 2026-07-06
  - Summary: `Created the Blueprint workflow global entry, current owner document, bootstrap queue, and core templates.`
  - Verification: `Document existence check`
  - Next: `Onboard the first real modularization queue under the new workflow.`
- 2026-07-06
  - Summary: `Refined the workflow model so Blueprint may have different targets across different periods, while the current period keeps one complete-modularization target and sequences concrete work through queues such as core-production-integration.`
  - Verification: `Document consistency check`
  - Next: `Resume the active queue under the current-period complete-modularization target.`
- 2026-07-06
  - Summary: `Completed the core-production-integration baseline reconcile and promoted engine-owner-line as the new active queue task.`
  - Verification: `Fresh source-baseline recheck recorded in the active queue`
  - Next: `Resolve whether src/core/engine/** should be retired as orphaned residue or adopted onto a real production startup path.`
- 2026-07-06
  - Summary: `Retired the orphaned core engine seam and promoted save-envelope-cutover as the new active queue task.`
  - Verification: `build:test plus targeted robustness tests recorded in the active queue`
  - Next: `Move continue/restore off placeholder loadSaveData() behavior and onto the core save-envelope path.`
- 2026-07-06
  - Summary: `Completed save-envelope-cutover and promoted runtime-ownership-closeout as the new active queue task.`
  - Verification: `build:test plus targeted save/startup regressions recorded in the active queue`
  - Next: `Decide whether runtime ownership is coherent enough to close the queue or whether a later Phase 1 canonicalization queue is still justified.`
- 2026-07-06
  - Summary: `Closed core-production-integration after runtime-ownership closeout concluded that no separate state-sync-and-runtime-canonicalization queue is currently justified.`
  - Verification: `Runtime ownership audit plus queue closeout verification recorded in the queue document`
  - Next: `If Phase 1 continues, promote shell-thinning-and-final-ownerization as the next queue candidate.`
- 2026-07-06
  - Summary: `Promoted shell-thinning-and-final-ownerization as the next active Phase 1 queue and opened its first baseline-reconcile task.`
  - Verification: `Blueprint pointer sync plus queue creation check`
  - Next: `Recheck the remaining main.ts shell residue and lock the first justified ownerization target order.`
- 2026-07-06
  - Summary: `Closed shell-thinning baseline-reconcile and advanced the repository-wide active task to view-transition-ownerization.`
  - Verification: `Blueprint pointer sync plus refreshed main.ts hotspot recheck`
  - Next: `Remove the covered leave-city and city-3d direct mutation blocks from main.ts through an explicit owner seam.`
- 2026-07-06
  - Summary: `Closed shell-thinning view-transition-ownerization and advanced the repository-wide active task to travel-and-auto-advance-ownerization.`
  - Verification: `npm test`
  - Next: `Remove the covered campaign travel completion and map auto-advance direct state-transition blocks from main.ts through an explicit owner seam.`
- 2026-07-06
  - Summary: `Closed shell-thinning travel-and-auto-advance-ownerization and advanced the repository-wide active task to render-prepass-ownerization.`
  - Verification: `npm test`
  - Next: `Recheck renderAppFrame() and decide whether render-prepass write-back still needs extraction.`
- 2026-07-06
  - Summary: `Closed shell-thinning render-prepass-ownerization by extracting render-time city-NPC refresh write-back into application/runtime/render-prepass-state.ts.`
  - Verification: `npm test`
  - Next: `Run shell-thinning queue closeout and re-audit main.ts residue.`
- 2026-07-06
  - Summary: `Closed shell-thinning-and-final-ownerization after confirming that no new Phase 1 queue promotion is currently justified from main.ts residue.`
  - Verification: `Queue closeout residue audit plus npm test`
  - Next: `Use the current target plan to decide whether execution should now promote a Phase 2 queue family.`
- 2026-07-06
  - Summary: `Promoted builtin-content-deprivileging-closeout as the new active Phase 2 queue after the current codebase audit confirmed live builtin-first production privilege across registries, startup defaults, and UI reserve layering.`
  - Verification: `Fresh builtin privilege source audit across core registries, startup, mod loader, active content bootstrap, and UI contract layers`
  - Next: `Freeze the active queue baseline and classify which builtin shortcuts are real contribution-closure blockers.`
- 2026-07-06
  - Summary: `Closed builtin-content-deprivileging baseline-reconcile after classifying registry seeds, startup direct builtin activation, and base-pack bootstrap as the first real blockers, while UI reserve layering remains accepted-for-now framework baseline.`
  - Verification: `Queue baseline audit across registries, startup, content bootstrap, and UI layers`
  - Next: `Resolve builtin registry and loader privilege before widening the queue to runtime consumers.`
- 2026-07-06
  - Summary: `Advanced builtin-registry-and-loader-audit by moving builtin startup activation and builtin save-source reload onto the shared mod.load-builtin loader seam instead of direct startup-time loaded-mod construction in main.ts.`
  - Verification: `npm test`
  - Next: `Keep the same active task and continue on static builtin house/playable registry seed privilege.`
- 2026-07-06
  - Summary: `Closed builtin-registry-and-loader-audit after builtin house/playable static seed ownership moved to explicit builtin registry installer modules, and advanced the repository-wide active task to runtime-consumer-deprivileging.`
  - Verification: `npm test`
  - Next: `Audit default base-pack bootstrap and other builtin-preloaded runtime consumers before queue closeout.`
- 2026-07-06
  - Summary: `Advanced runtime-consumer-deprivileging by removing default-runtime-content.ts as a self-loading builtin-base-pack consumer and requiring explicit default-pack injection from main.ts.`
  - Verification: `npm test`
  - Next: `Continue auditing active-content/bootstrap and UI/content consumers that still rely on builtin-preloaded assumptions.`
- 2026-07-06
  - Summary: `Advanced runtime-consumer-deprivileging again by letting scenario activation keep multi-pack normalized content sources and by moving active-content bootstrap to assemble from activationResult content sources without a separate basePack argument.`
  - Verification: `npm test`
  - Next: `Continue auditing the remaining builtin-preloaded UI/content consumer assumptions.`
- 2026-07-06
  - Summary: `Closed builtin-content-deprivileging-closeout after the runtime-consumer audit confirmed that the remaining UI reserve layering is not on the main startup/runtime path and can stay classified as accepted framework baseline rather than a live builtin privilege blocker.`
  - Verification: `Targeted source-path audit plus npm test`
  - Next: `Use the current target plan to decide whether a new Phase 2 queue such as unified-contribution-intake-closeout should be promoted.`
- 2026-07-06
  - Summary: `Rejected promotion of unified-contribution-intake-closeout after a fresh contribution-intake audit confirmed that the currently-covered families already enter through the shared gameplay contribution contract, mod manifest declaration, mod runtime contribution installation, and shared house/playable registry seams.`
  - Verification: `Targeted source audit across src/core/contracts/gameplay-contribution.ts, src/core/contracts/mod-manifest.ts, src/core/mods/mod-runtime.ts, src/core/registry/house-module-registry.ts, src/core/registry/playable-definition-registry.ts, src/core/registry/playable-integration-registry.ts, and tests/robustness.test.cjs`
  - Next: `Advance the current target to Phase 3 authoring review and decide whether authoring-entrypoint-and-fail-closed-closure is actually justified.`
- 2026-07-06
  - Summary: `Promoted authoring-entrypoint-and-fail-closed-closure as the active Phase 3 queue after the authoring audit confirmed that playable tooling is landed, but scenario-pack/default-pack/house-family authoring still depends on manual catalog, builtin adapter, and registration glue without a shared fail-closed entrypoint.`
  - Verification: `Fresh source audit across package scripts, tools/, scenario-pack loader/catalog loader, pack-content-access, house registries, and robustness coverage`
  - Next: `Resume the active queue from scenario-pack-and-default-pack-entrypoint-closure.`
