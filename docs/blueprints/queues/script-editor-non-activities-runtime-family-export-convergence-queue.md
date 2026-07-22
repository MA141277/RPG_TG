# Script Editor Non-Activities Runtime Family Export Convergence Queue

## Control Block

- queue_id: `queue.script-editor-non-activities-runtime-family-export-convergence`
- belongs_to_version: `target.script-editor-runtime-pack-unification`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-14`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `done`
- queue_class: `required`
- active_task: `none`
- next_task: `return-to-version-review`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `closed`
- closure_basis: `The 12 non-activities runtime families are now first-class script-editor project/runtime families, real Zhu Yuanzhang import no longer places them under compatibilityImport.unresolvedFamilies, and script-editor export emits a startup-loadable scenario pack that preserves the named runtime truth.`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `none`
- sync_status: `pending`
- sync_scope: `none`
- sync_summary: `Queue-local implementation and governance truth are complete; repository sync remains pending until the verified batch is committed and pushed.`
- blocked_by: []
- allowed_item_classifications:
  - `current-target-item`
- reject_item_classifications:
  - `content-pipeline-item`
  - `asset-pipeline-item`
  - `future-target-candidate`

## Human Context

### Queue Explanation

- Goal:
  - `Converge the remaining non-activities runtime families that block real Zhu Yuanzhang script-editor import/export so exported runtime packs can be loaded by the startup scenario-pack loader without unresolved runtime-family diagnostics.`
- Forbidden expansions:
  - `Do not reopen the closed activities convergence queue unless fresh evidence proves activities regressed.`
  - `Do not implement editor-authored dialogue/storyNode lowering in this queue unless the admitted task explicitly needs it to preserve existing runtime scenes.`
  - `Do not silently drop runtime families, write private export-only dialects, or rely on builtin fallback shortcuts to make export appear successful.`
  - `Do not mix PRD UI polish, asset authoring pipeline redesign, or unrelated gameplay changes into this queue.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`

### Queue Snapshot

- queue_goal: `Resolve the 12 non-activities runtime-family blockers that still prevent a real Zhu Yuanzhang import/export round trip from producing a startup-loadable scenario pack.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `none; queue is closed and returns control to the version plan.`
- task_briefs:
  - `task.script-editor-non-activities-runtime-family-export-convergence.boundary-baseline-reconcile: confirm current diagnostics, family shapes, and ordering constraints for the 12 blockers.`
  - `task.script-editor-non-activities-runtime-family-export-convergence.family-disposition-map: decide which families become direct project/runtime families, which need preservation semantics, and which must route to later queues.`
  - `task.script-editor-non-activities-runtime-family-export-convergence.queue-closeout-and-handoff: verify the bounded slice, classify remaining residue, and return control to the version plan.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 褰撳墠鎵ц闃熷垪 from queue_id.`
- `The fixed operator receipt must source 褰撳墠浠诲姟 from active_task.`
- `The fixed operator receipt must source 褰撳墠闃熷垪鐩爣 from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Admission Preconditions

- `queue.script-editor-activities-authoring-export-convergence must already be closed with activities no longer reported under compatibilityImport.unresolvedFamilies.`
- `The version plan must already record item.script-editor-non-activities-runtime-family-export-blockers as a queue-candidate and admit this queue.`
- `Single-active-queue mode remains in force; no second queue may be promoted while this queue is active.`
- `The narrative authoring export candidate remains separate unless admission review explicitly merges scope.`

### Runtime Family Boundary

- Families in scope:
  - `cards`
  - `cityEntries`
  - `cityNpcPools`
  - `cityPortraits`
  - `historicalCharacterIdByCharacterId`
  - `historicalCharacters`
  - `historicalCityRosters`
  - `houseAccessRefusalRules`
  - `houseModuleDefaults`
  - `maps`
  - `scenes`
  - `valuables`
- Out of scope unless fresh evidence proves regression:
  - `activities`
  - `dialogues/storyNodes authoring lowering for newly-created editor scenarios`
  - `minigame/playable lifecycle redesign`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-non-activities-runtime-family-export-convergence.boundary-baseline-reconcile` | `completed` | `Confirmed the 12-family blocker set and chose first-class project/runtime ownership as the lawful implementation slice.` | `none` | `Fresh Zhu Yuanzhang evidence showed these were valid runtime pack families, not compatibility residue.` |
| `task.script-editor-non-activities-runtime-family-export-convergence.family-disposition-map` | `completed` | `Classified all 12 runtime families as direct project/runtime families and landed import/export coverage.` | `task.script-editor-non-activities-runtime-family-export-convergence.boundary-baseline-reconcile` | `No preservation-only compatibility blob remains for the named families.` |
| `task.script-editor-non-activities-runtime-family-export-convergence.queue-closeout-and-handoff` | `completed` | `Verified the queue-local slice and returned control to the version plan with narrative authoring export still routed separately.` | `task.script-editor-non-activities-runtime-family-export-convergence.family-disposition-map` | `Targeted Zhu Yuanzhang round-trip tests pass; full repository verification is recorded before repository sync.` |

### Task Definitions

#### `task.script-editor-non-activities-runtime-family-export-convergence.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-non-activities-runtime-family-export-convergence.boundary-baseline-reconcile`
- state: `active`
- task_kind: `execution`
- scope:
  - `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-non-activities-runtime-family-export-convergence-queue.md`
  - `src/domain/content-pack.ts`
  - `src/domain/script-editor-project.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/content/scenario-packs/zhuyuanzhang/pack.json`
- must_inspect:
  - `src/domain/content-pack.ts`
  - `src/domain/script-editor-project.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/content/scenario-packs/zhuyuanzhang/pack.json`
  - `docs/scenario-pack-unified-format.md`
- must_not_change:
  - `activities import/export behavior except regression guards`
  - `dialogues/storyNodes authoring lowering for newly-created editor scenarios`
  - `new private export-only dialects`
  - `builtin fallback shortcuts that bypass active scenario-pack content`
  - `unrelated gameplay, PRD UI, or asset pipeline behavior`
- done_when:
  - `The queue records current evidence for the 12 unresolved runtime families after activities convergence.`
  - `The queue identifies which family or family cluster is the smallest lawful first implementation slice.`
  - `The queue states why narrative authoring export remains separate or why a limited scene/text-entry runtime preservation slice is required first.`
- verify_with:
  - `npm run build:test`
  - `node diagnostics script for real Zhu Yuanzhang import/export unresolved family keys`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker in this queue doc rather than widening into narrative authoring lowering or unrelated runtime families.`
  - `Return to version review only if fresh evidence disproves the admitted 12-family basis.`
- promote_next_if_done: `task.script-editor-non-activities-runtime-family-export-convergence.family-disposition-map`
- stop_if:
  - `Fresh diagnostics prove the real Zhu Yuanzhang path no longer reports the 12 named runtime families.`

##### Human Context

- task_brief:
  - `Confirm the 12-family export blocker baseline and pick the smallest lawful first convergence slice.`
- task_outcome_summary:
  - `Expected outcome is written baseline evidence and a bounded implementation direction that does not pre-empt separate editor narrative lowering work.`
- Purpose:
  - `Prevent the queue from becoming a broad rewrite while still moving toward a startup-loadable Zhu Yuanzhang export.`
- Failure mode:
  - `Do not make export pass by silently omitting runtime families or by designing a temporary private preservation format.`

#### `task.script-editor-non-activities-runtime-family-export-convergence.family-disposition-map`

##### Control Block

- task_id: `task.script-editor-non-activities-runtime-family-export-convergence.family-disposition-map`
- state: `pending`
- task_kind: `execution`
- scope:
  - `docs/blueprints/queues/script-editor-non-activities-runtime-family-export-convergence-queue.md`
  - `src/domain/content-pack.ts`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `tests/**`
- must_inspect:
  - `src/domain/content-pack.ts`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `activities regression behavior`
  - `newly-created dialogue/storyNode lowering beyond recorded slice`
  - `runtime gameplay rules unrelated to pack family ownership`
- done_when:
  - `Each of the 12 runtime families has a written disposition: direct project family, runtime-preserved family, or later queue route.`
  - `The first implementation slice has regression tests or explicit blocked rationale.`
  - `The disposition preserves startup-loadable runtime truth rather than deleting unresolved families.`
- verify_with:
  - `npm run typecheck`
  - `npm run test`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record missing runtime contracts or schema ambiguity in this queue doc.`
- promote_next_if_done: `task.script-editor-non-activities-runtime-family-export-convergence.queue-closeout-and-handoff`

##### Human Context

- task_brief:
  - `Classify the 12 runtime families into implementable dispositions before broad code changes continue.`
- task_outcome_summary:
  - `Expected outcome is a family-by-family route map and the first verified implementation slice or a recorded blocker.`
- Purpose:
  - `Make cross-family convergence explicit enough that later execution can proceed without guesswork.`
- Failure mode:
  - `Do not collapse unrelated runtime carriers into one untyped compatibility blob.`

#### `task.script-editor-non-activities-runtime-family-export-convergence.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-non-activities-runtime-family-export-convergence.queue-closeout-and-handoff`
- state: `pending`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-non-activities-runtime-family-export-convergence-queue.md`
  - `docs/change-log.md`
- must_inspect:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-non-activities-runtime-family-export-convergence-queue.md`
- must_not_change:
  - `version closeout without explicit acceptance evidence`
  - `new queue admission without written routing truth`
  - `repository sync truth before queue-local closeout truth is written`
- done_when:
  - `Queue truth, version truth, and project-progress truth are synchronized before control returns to version review.`
  - `Any remaining same-family or cross-family residue is explicitly classified and routed.`
  - `Verification and queue-local handoff are written before any repository sync batch is recorded.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run lint:plans`
  - `npm run typecheck`
  - `npm run test`
- if_blocked:
  - `Record the blocker explicitly in this queue doc rather than silently keeping ambiguous active truth.`
- promote_next_if_done: `return-to-version-review`
- stop_if:
  - `Queue-local truth is not synchronized with the version plan.`

##### Human Context

- task_brief:
  - `Close the queue or hand back with explicit residue routing after verification.`
- task_outcome_summary:
  - `Expected outcome is queue-local closeout or a recorded blocker that keeps version scheduling unambiguous.`
- Purpose:
  - `Keep Blueprint execution truth synchronized after implementation and verification.`
- Failure mode:
  - `Do not mark version-level completion while unresolved runtime family residue remains.`

### Family Disposition And Closeout Evidence

- Disposition:
  - `cards`, `cityEntries`, `houseAccessRefusalRules`, `historicalCharacters`, `maps`, `scenes`, and `valuables` are now direct script-editor project/runtime array families.
  - `cityNpcPools` and `historicalCityRosters` are now direct script-editor project/runtime record-array families because their runtime records do not require a uniform id field.
  - `cityPortraits`, `historicalCharacterIdByCharacterId`, and `houseModuleDefaults` are now direct script-editor project/runtime object-map families.
  - `maps` asset references imported from a scenario-pack directory are converted to data URLs inside the script-editor project so the exported scenario pack remains startup-loadable without depending on the original imported asset folder.
- Implementation evidence:
  - `src/domain/script-editor-project.ts` now includes canonical project files and project fields for all 12 runtime families.
  - `src/application/script-editor/runtime-pack-import.ts` imports the 12 families into formal project fields rather than `compatibilityImport.unresolvedFamilies`.
  - `src/application/script-editor/runtime-pack-export.ts` emits all 12 families through canonical scenario-pack manifest entries and split JSON files.
  - `src/application/scenario/scenario-pack-loader.ts` accepts `data:` asset URLs so exported map assets remain loadable.
  - `tests/robustness.test.cjs` proves the real Zhu Yuanzhang import -> script-editor export -> `loadScenarioPackFromFiles` path succeeds and preserves the named runtime families.
- Residue routing:
  - `dialogues/storyNodes` lowering for newly-created editor scenarios remains outside this queue and stays routed to `queue.script-editor-narrative-authoring-export-convergence` for version-level promotion review.
  - UI reserve families remain compatibility-residue guarded when present and are not part of this queue's 12-family closeout.
- Verification evidence:
  - `npm run build:test` passed after implementation.
  - `node --test tests/robustness.test.cjs --test-name-pattern "preserves imported Zhu Yuanzhang runtime families|unsupported ui reserve|imported compatibility residue|project loader"` passed with 417/417 tests in the selected robustness run.
